<?php
/**
 * Custom post types: `service`, `service_area`.
 * Registered as plain native CPTs (not JetEngine's post-type module) —
 * see the architecture decision in the implementation log. Fields for
 * these are in meta-fields.php; the field spec itself lives in
 * docs/headless-cms-schema-contract.md in the Next.js app.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'init', 'shi_register_post_types' );

function shi_register_post_types() {
	register_post_type(
		'service',
		array(
			'label'        => 'Services',
			'labels'       => array(
				'name'          => 'Services',
				'singular_name' => 'Service',
				'add_new_item'  => 'Add New Service',
				'edit_item'     => 'Edit Service',
			),
			'public'       => true,
			'show_in_rest' => true,
			'rest_base'    => 'services',
			'has_archive'  => false,
			// 'custom-fields' is required for WordPress to attach the `meta`
			// object to this post type's REST schema at all — without it,
			// register_post_meta() calls succeed silently but the `meta`
			// field never appears on wp/v2 responses. Cost a debugging
			// session to find; see Implementation Log.
			'supports'     => array( 'title', 'editor', 'excerpt', 'thumbnail', 'revisions', 'custom-fields' ),
			'menu_icon'    => 'dashicons-admin-tools',
		)
	);

	register_post_type(
		'service_area',
		array(
			'label'        => 'Service Areas',
			'labels'       => array(
				'name'          => 'Service Areas',
				'singular_name' => 'Service Area',
				'add_new_item'  => 'Add New Service Area',
				'edit_item'     => 'Edit Service Area',
			),
			'public'       => true,
			'show_in_rest' => true,
			'rest_base'    => 'service-areas',
			'has_archive'  => false,
			// 'custom-fields' is required for WordPress to attach the `meta`
			// object to this post type's REST schema at all — without it,
			// register_post_meta() calls succeed silently but the `meta`
			// field never appears on wp/v2 responses. Cost a debugging
			// session to find; see Implementation Log.
			'supports'     => array( 'title', 'editor', 'excerpt', 'thumbnail', 'revisions', 'custom-fields' ),
			'menu_icon'    => 'dashicons-location',
		)
	);
}
