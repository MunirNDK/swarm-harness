<?php
/**
 * Single source of truth for the `service` / `service_area` custom fields —
 * drives both REST registration (meta-fields.php) and the wp-admin editing
 * UI (admin-fields-ui.php), so adding a new field means editing ONE array
 * here, not two separate places that can drift out of sync.
 *
 * To add a new field: add one entry to the relevant post type's array
 * below. `type` controls both the REST schema and which admin UI widget
 * renders — see admin-fields-ui.php for the supported types:
 *   'text'             — single-line text input
 *   'textarea'         — multi-line text input
 *   'repeater_strings' — add/remove list of plain strings (e.g. benefits)
 *   'repeater_object'  — add/remove list of {subfields} rows (e.g. FAQ items)
 *
 * Keep field `key`s in sync with docs/headless-cms-schema-contract.md and
 * lib/wordpress/schemas.ts on the Next.js side — this schema controls what
 * WordPress stores and exposes, not what Next.js expects to receive.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function shi_field_schema( $post_type ) {
	$schemas = array(
		'service'      => array(
			array( 'key' => 'short_description', 'label' => 'Short Description', 'type' => 'text', 'help' => 'Shown on service cards (listing pages).' ),
			array( 'key' => 'long_description', 'label' => 'Long Description', 'type' => 'textarea', 'help' => 'Hero paragraph on the service detail page.' ),
			array( 'key' => 'icon', 'label' => 'Icon', 'type' => 'text', 'help' => 'A lucide-react icon name (e.g. Sparkles, ShieldCheck) — must match an icon already mapped in components/service-card.tsx.' ),
			array( 'key' => 'seo_description', 'label' => 'SEO Description', 'type' => 'textarea', 'help' => 'Meta description tag — not shown on the page itself.' ),
			array( 'key' => 'benefits_title', 'label' => 'Benefits Section — Title', 'type' => 'text', 'help' => 'Leave blank to use the default: "{Service Name} Package".' ),
			array( 'key' => 'benefits_subtitle', 'label' => 'Benefits Section — Subtitle', 'type' => 'textarea', 'help' => 'Leave blank to use the default subtitle.' ),
			array( 'key' => 'benefits', 'label' => 'Benefits', 'type' => 'repeater_strings' ),
			array( 'key' => 'process_title', 'label' => 'Process Section — Title', 'type' => 'text', 'help' => 'Leave blank to use the default: "How We Deliver {Service Name}".' ),
			array( 'key' => 'process_subtitle', 'label' => 'Process Section — Subtitle', 'type' => 'textarea', 'help' => 'Leave blank to use the default subtitle.' ),
			array(
				'key'       => 'process_steps',
				'label'     => 'Process Steps',
				'type'      => 'repeater_object',
				'subfields' => array(
					array( 'key' => 'title', 'label' => 'Title', 'type' => 'text' ),
					array( 'key' => 'desc', 'label' => 'Description', 'type' => 'textarea' ),
				),
			),
			array( 'key' => 'faq_title', 'label' => 'FAQ Section — Title', 'type' => 'text', 'help' => 'Leave blank to use the default: "{Service Name} Questions".' ),
			array( 'key' => 'faq_subtitle', 'label' => 'FAQ Section — Subtitle', 'type' => 'textarea', 'help' => 'Leave blank to use the default subtitle.' ),
			array(
				'key'       => 'faq_items',
				'label'     => 'FAQ Items',
				'type'      => 'repeater_object',
				'subfields' => array(
					array( 'key' => 'q', 'label' => 'Question', 'type' => 'text' ),
					array( 'key' => 'a', 'label' => 'Answer', 'type' => 'textarea' ),
				),
			),
		),
		'service_area' => array(
			array( 'key' => 'local_introduction', 'label' => 'Local Introduction', 'type' => 'textarea', 'help' => 'Leave blank to use the generic template sentence instead (spec §5.3 — do not invent local facts).' ),
			array( 'key' => 'seo_description', 'label' => 'SEO Description', 'type' => 'textarea', 'help' => 'Leave blank to fall back to the computed default.' ),
		),
	);

	return $schemas[ $post_type ] ?? array();
}
