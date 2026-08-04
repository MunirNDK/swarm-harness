<?php
/**
 * Small admin-only config endpoint so the orchestrator/deploy process can
 * read the generated revalidation/preview secrets once (to put them in
 * Next.js env vars) and set the Next.js base URLs once they're known,
 * without ever needing shell/database access for it.
 *
 * Never exposed to unauthenticated requests — same trust level as any
 * other manage_options-gated wp-admin screen.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'rest_api_init', 'shi_register_config_route' );

function shi_register_config_route() {
	register_rest_route( 'site-headless/v1', '/config', array(
		array(
			'methods'             => 'GET',
			'callback'            => 'shi_get_config',
			'permission_callback' => 'shi_config_permission',
		),
		array(
			'methods'             => 'POST',
			'callback'            => 'shi_update_config',
			'permission_callback' => 'shi_config_permission',
			'args'                => array(
				'revalidate_url'   => array( 'type' => 'string' ),
				'preview_base_url' => array( 'type' => 'string' ),
			),
		),
	) );
}

function shi_config_permission() {
	return current_user_can( 'manage_options' );
}

function shi_get_config() {
	return rest_ensure_response( array(
		'revalidate_url'    => get_option( 'shi_revalidate_url', '' ),
		'preview_base_url'  => get_option( 'shi_preview_base_url', '' ),
		'revalidate_secret' => shi_revalidate_secret(),
		'preview_secret'    => shi_preview_secret(),
	) );
}

function shi_update_config( $request ) {
	if ( $request->has_param( 'revalidate_url' ) ) {
		update_option( 'shi_revalidate_url', esc_url_raw( $request->get_param( 'revalidate_url' ) ) );
	}
	if ( $request->has_param( 'preview_base_url' ) ) {
		update_option( 'shi_preview_base_url', esc_url_raw( $request->get_param( 'preview_base_url' ) ) );
	}
	return shi_get_config();
}
