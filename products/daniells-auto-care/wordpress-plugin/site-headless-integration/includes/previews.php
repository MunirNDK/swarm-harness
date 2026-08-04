<?php
/**
 * Draft preview support — points WordPress's "Preview" button at the
 * Next.js draft endpoint instead of the (non-existent, headless) WP
 * frontend. Spec §8.
 *
 * Inert until `shi_preview_base_url` is configured (Phase 4, once the
 * Next.js /api/draft route exists) — falls back to WordPress's own default
 * preview link while unset, so nothing breaks in the meantime.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_filter( 'preview_post_link', 'shi_preview_post_link', 10, 2 );

function shi_preview_secret() {
	$secret = get_option( 'shi_preview_secret' );
	if ( ! $secret ) {
		$secret = wp_generate_password( 40, false );
		update_option( 'shi_preview_secret', $secret, false );
	}
	return $secret;
}

function shi_preview_post_link( $link, $post ) {
	$base = get_option( 'shi_preview_base_url' );
	if ( ! $base ) {
		return $link; // not configured yet — see Implementation Log, Phase 4 follow-up
	}

	return add_query_arg(
		array(
			'secret' => shi_preview_secret(),
			'type'   => $post->post_type,
			'slug'   => $post->post_name ? $post->post_name : $post->ID,
		),
		trailingslashit( $base ) . 'api/draft'
	);
}
