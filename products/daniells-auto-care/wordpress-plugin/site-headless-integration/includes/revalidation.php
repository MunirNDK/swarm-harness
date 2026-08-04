<?php
/**
 * On-demand revalidation webhook — notifies Next.js when content changes so
 * it can invalidate the relevant cache tag instead of requiring a full
 * rebuild. Spec §7.
 *
 * Inert until `shi_revalidate_url` is configured (Phase 4, once the Next.js
 * /api/revalidate route exists) — POST attempts are skipped, not queued or
 * retried, while the option is empty.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const SHI_REVALIDATABLE_TYPES = array( 'service', 'service_area', 'post', 'page' );

add_action( 'save_post', 'shi_maybe_revalidate', 20, 2 );
add_action( 'before_delete_post', 'shi_revalidate_on_delete', 20, 1 );

function shi_revalidate_secret() {
	$secret = get_option( 'shi_revalidate_secret' );
	if ( ! $secret ) {
		$secret = wp_generate_password( 40, false );
		update_option( 'shi_revalidate_secret', $secret, false );
	}
	return $secret;
}

function shi_maybe_revalidate( $post_id, $post ) {
	if ( wp_is_post_revision( $post_id ) || wp_is_post_autosave( $post_id ) ) {
		return;
	}
	if ( ! in_array( $post->post_type, SHI_REVALIDATABLE_TYPES, true ) ) {
		return;
	}
	// Only notify for states a visitor could actually see change.
	if ( ! in_array( $post->post_status, array( 'publish', 'trash', 'draft', 'private' ), true ) ) {
		return;
	}
	shi_send_revalidation( array(
		'event'       => 'content.updated',
		'contentType' => $post->post_type,
		'slug'        => $post->post_name,
	) );
}

function shi_revalidate_on_delete( $post_id ) {
	$post = get_post( $post_id );
	if ( ! $post || ! in_array( $post->post_type, SHI_REVALIDATABLE_TYPES, true ) ) {
		return;
	}
	shi_send_revalidation( array(
		'event'       => 'content.deleted',
		'contentType' => $post->post_type,
		'slug'        => $post->post_name,
	) );
}

function shi_send_revalidation( $payload ) {
	$url = get_option( 'shi_revalidate_url' );
	if ( ! $url ) {
		return; // not configured yet — see Implementation Log, Phase 4 follow-up
	}

	$payload['timestamp'] = gmdate( 'c' );
	$body                 = wp_json_encode( $payload );
	$signature            = hash_hmac( 'sha256', $body, shi_revalidate_secret() );

	wp_remote_post( $url, array(
		'timeout'  => 5,
		'blocking' => false, // fire-and-forget — never let this slow down a save
		'headers'  => array(
			'Content-Type'          => 'application/json',
			'X-SHI-Signature-256'   => $signature,
		),
		'body'     => $body,
	) );
}
