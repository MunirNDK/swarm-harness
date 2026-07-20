<?php
/**
 * Registers the fields defined in field-schema.php with WordPress's REST
 * API, per docs/headless-cms-schema-contract.md §2–3. show_in_rest makes
 * them readable/writable through the standard wp/v2 endpoints — no custom
 * REST controller needed for reads.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'init', 'shi_register_meta_fields' );

function shi_meta_args_for_field( $field ) {
	if ( 'repeater_strings' === $field['type'] ) {
		return array(
			'type'         => 'array',
			'single'       => true,
			'show_in_rest' => array(
				'schema' => array(
					'type'  => 'array',
					'items' => array( 'type' => 'string' ),
				),
			),
			'default'      => array(),
		);
	}

	if ( 'repeater_object' === $field['type'] ) {
		$properties = array();
		foreach ( $field['subfields'] as $sub ) {
			$properties[ $sub['key'] ] = array( 'type' => 'string' );
		}
		return array(
			'type'         => 'array',
			'single'       => true,
			'show_in_rest' => array(
				'schema' => array(
					'type'  => 'array',
					'items' => array(
						'type'       => 'object',
						'properties' => $properties,
					),
				),
			),
			'default'      => array(),
		);
	}

	// 'text' / 'textarea'
	return array(
		'type'         => 'string',
		'single'       => true,
		'show_in_rest' => true,
		'default'      => '',
	);
}

function shi_register_meta_fields() {
	foreach ( array( 'service', 'service_area' ) as $post_type ) {
		foreach ( shi_field_schema( $post_type ) as $field ) {
			register_post_meta( $post_type, $field['key'], shi_meta_args_for_field( $field ) );
		}
	}
}
