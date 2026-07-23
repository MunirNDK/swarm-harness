<?php
/**
 * Formidable Forms bootstrap + submission endpoint. Spec §9.
 *
 * Next.js owns the actual public-facing form UI (app/contact + the quote
 * modal) and does its own validation/honeypot/rate-limiting server-side in
 * app/api/quote/route.ts BEFORE ever reaching this endpoint — this endpoint
 * is server-to-server only (Basic Auth via the headless-forms-agent
 * account), never called from the browser.
 *
 * Two forms are created programmatically on first activation (idempotent —
 * skipped if the option already shows them created): "Contact" and "Quote",
 * matching exactly the two payload modes app/api/quote/route.ts already
 * validates. Field IDs are captured at creation time and stored as options,
 * since Formidable's entry API addresses fields by numeric ID, not name.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'rest_api_init', 'shi_register_forms_routes' );

function shi_bootstrap_formidable_forms() {
	if ( get_option( 'shi_forms_bootstrapped' ) ) {
		return;
	}
	if ( ! class_exists( 'FrmForm' ) || ! class_exists( 'FrmField' ) ) {
		return; // Formidable not active yet — activation hook order safety
	}

	$contact_form_id = FrmForm::create( array( 'name' => 'Contact (headless)' ) );
	$contact_fields  = array(
		'name'    => shi_create_field( $contact_form_id, 'Name', 'text', true ),
		'email'   => shi_create_field( $contact_form_id, 'Email', 'email', true ),
		'phone'   => shi_create_field( $contact_form_id, 'Phone', 'phone', false ),
		'message' => shi_create_field( $contact_form_id, 'Message', 'textarea', true ),
	);

	$quote_form_id = FrmForm::create( array( 'name' => 'Quote (headless)' ) );
	$quote_fields   = array(
		'name'    => shi_create_field( $quote_form_id, 'Name', 'text', true ),
		'phone'   => shi_create_field( $quote_form_id, 'Phone', 'phone', true ),
		'zip'     => shi_create_field( $quote_form_id, 'Zip', 'text', false ),
		'vehicle' => shi_create_field( $quote_form_id, 'Vehicle', 'text', true ),
		'service' => shi_create_field( $quote_form_id, 'Service', 'text', true ),
	);

	update_option( 'shi_contact_form_id', $contact_form_id );
	update_option( 'shi_contact_form_fields', $contact_fields );
	update_option( 'shi_quote_form_id', $quote_form_id );
	update_option( 'shi_quote_form_fields', $quote_fields );
	update_option( 'shi_forms_bootstrapped', true );
}

/**
 * Adds fields to an already-bootstrapped form that weren't part of the
 * original set — idempotent, safe to call on every activation. Needed once
 * already: QuoteForm (components/quote-form.tsx) sends `fleetSize` and
 * `notes`, which the original bootstrap didn't create fields for — those
 * submissions were being rejected outright once app/api/quote/route.ts
 * started strictly validating known fields (Phase 8 hardening), a real
 * production bug caught by the owner. See Implementation Log.
 */
function shi_add_missing_quote_fields() {
	$quote_form_id = get_option( 'shi_quote_form_id' );
	$quote_fields  = get_option( 'shi_quote_form_fields' );
	if ( ! $quote_form_id || ! is_array( $quote_fields ) ) {
		return; // quote form not bootstrapped yet — nothing to add to
	}

	$missing = array(
		'fleetSize'        => array( 'Fleet Size', 'text', false ),
		'notes'            => array( 'Additional Details', 'textarea', false ),
		'vehicleType'      => array( 'Vehicle Type', 'text', false ),
		'serviceFrequency' => array( 'Service Frequency', 'text', false ),
	);

	$changed = false;
	foreach ( $missing as $key => list( $label, $type, $required ) ) {
		if ( ! isset( $quote_fields[ $key ] ) ) {
			$quote_fields[ $key ] = shi_create_field( $quote_form_id, $label, $type, $required );
			$changed              = true;
		}
	}

	if ( $changed ) {
		update_option( 'shi_quote_form_fields', $quote_fields );
	}
}

function shi_create_field( $form_id, $label, $type, $required ) {
	return FrmField::create( array(
		'form_id'       => $form_id,
		'name'          => $label,
		'type'          => $type,
		'required'      => $required ? 1 : 0,
		'field_options' => array(),
	) );
}

function shi_register_forms_routes() {
	// Verification/testing route — spec §17 suggests `site/list-form-submissions`
	// as a bounded ability; this is that, gated to accounts that can view entries.
	register_rest_route( 'site-headless/v1', '/entries/(?P<formType>contact|quote)', array(
		'methods'             => 'GET',
		'callback'            => 'shi_list_entries',
		'permission_callback' => function () {
			return current_user_can( 'frm_view_entries' );
		},
	) );

	register_rest_route( 'site-headless/v1', '/submit', array(
		'methods'             => 'POST',
		'callback'            => 'shi_submit_form',
		'permission_callback' => function () {
			// Server-to-server only — gated behind any authenticated
			// headless-integration account, same trust boundary as the
			// forms agent's other capabilities.
			return current_user_can( 'frm_view_forms' );
		},
		'args'                => array(
			'formType' => array( 'type' => 'string', 'required' => true, 'enum' => array( 'contact', 'quote' ) ),
			'fields'   => array( 'type' => 'object', 'required' => true ),
		),
	) );
}

function shi_submit_form( $request ) {
	if ( ! class_exists( 'FrmEntry' ) ) {
		return new WP_Error( 'shi_formidable_unavailable', 'Formidable Forms is not active.', array( 'status' => 503 ) );
	}

	$form_type = $request->get_param( 'formType' );
	$fields    = (array) $request->get_param( 'fields' );

	$form_id     = get_option( "shi_{$form_type}_form_id" );
	$field_map   = get_option( "shi_{$form_type}_form_fields" );
	if ( ! $form_id || ! is_array( $field_map ) ) {
		return new WP_Error( 'shi_form_not_bootstrapped', 'That form has not been created yet.', array( 'status' => 500 ) );
	}

	$item_meta = array();
	foreach ( $field_map as $key => $field_id ) {
		if ( isset( $fields[ $key ] ) && $fields[ $key ] !== '' ) {
			$item_meta[ $field_id ] = sanitize_textarea_field( (string) $fields[ $key ] );
		}
	}

	$entry_id = FrmEntry::create( array(
		'form_id'   => $form_id,
		'item_meta' => $item_meta,
	) );

	if ( ! $entry_id ) {
		return new WP_Error( 'shi_entry_create_failed', 'Formidable rejected the entry (likely a duplicate).', array( 'status' => 422 ) );
	}

	return rest_ensure_response( array( 'success' => true, 'entryId' => $entry_id ) );
}

function shi_list_entries( $request ) {
	$form_type = $request->get_param( 'formType' );
	$form_id   = get_option( "shi_{$form_type}_form_id" );
	$field_map = get_option( "shi_{$form_type}_form_fields" );
	if ( ! $form_id || ! is_array( $field_map ) ) {
		return new WP_Error( 'shi_form_not_bootstrapped', 'That form has not been created yet.', array( 'status' => 500 ) );
	}

	// Queried directly via $wpdb rather than FrmEntry::getAll() — the latter's
	// object-cache-backed results were observed stuck on a pre-entry-creation
	// empty result on this instance (Object Cache Pro / Redis); a direct
	// read sidesteps whatever isn't being invalidated. Fine for this
	// verification-only, low-traffic endpoint. See Implementation Log.
	global $wpdb;
	$reverse_map = array_flip( $field_map ); // field_id => our key name
	$items       = $wpdb->get_results(
		$wpdb->prepare(
			"SELECT id, created_at FROM {$wpdb->prefix}frm_items WHERE form_id = %d ORDER BY id DESC LIMIT 20",
			$form_id
		)
	);

	$result = array();
	foreach ( $items as $item ) {
		$metas = $wpdb->get_results(
			$wpdb->prepare( "SELECT field_id, meta_value FROM {$wpdb->prefix}frm_item_metas WHERE item_id = %d", $item->id )
		);
		$row = array( 'id' => (int) $item->id, 'created_at' => $item->created_at, 'fields' => array() );
		foreach ( $metas as $meta ) {
			$key                    = $reverse_map[ $meta->field_id ] ?? "field_{$meta->field_id}";
			$row['fields'][ $key ] = $meta->meta_value;
		}
		$result[] = $row;
	}

	return rest_ensure_response( $result );
}
