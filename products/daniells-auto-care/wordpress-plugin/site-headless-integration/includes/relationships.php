<?php
/**
 * Exposes the Services ↔ Service Areas relationship (created via the
 * JetEngine REST API — see Implementation Log for how) as plain slug
 * arrays on the wp/v2/services and wp/v2/service-areas REST responses, so
 * the Next.js client never has to know JetEngine's relation API exists.
 *
 * Looked up by relation `name` rather than a hardcoded ID, so this keeps
 * working even if the relation ever gets recreated with a different ID.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'rest_api_init', 'shi_register_relationship_fields' );

function shi_find_relation_by_name( $name ) {
	if ( ! function_exists( 'jet_engine' )
		|| empty( jet_engine()->relations )
		|| ! method_exists( jet_engine()->relations, 'get_active_relations' )
	) {
		return false;
	}
	foreach ( (array) jet_engine()->relations->get_active_relations() as $relation ) {
		if ( $relation->get_args( 'name' ) === $name ) {
			return $relation;
		}
	}
	return false;
}

function shi_slugs_for_ids( $ids ) {
	$slugs = array();
	foreach ( (array) $ids as $id ) {
		$post = get_post( $id );
		if ( $post ) {
			$slugs[] = $post->post_name;
		}
	}
	return $slugs;
}

add_action( 'rest_api_init', 'shi_register_relationship_link_route' );

/**
 * Links two existing posts within a relation. Used by the migration script
 * (Phase 6/7) — JetEngine's own REST API has no public endpoint for this,
 * only an admin-ajax action (`update_relation_items`) gated by a wp-admin
 * nonce, which a server-to-server script can't obtain. This wraps the same
 * underlying `$relation->update()` call the admin-ajax handler uses.
 */
function shi_register_relationship_link_route() {
	register_rest_route( 'site-headless/v1', '/link', array(
		'methods'             => 'POST',
		'callback'            => 'shi_link_relation_items',
		'permission_callback' => function () {
			return current_user_can( 'edit_posts' );
		},
		'args'                => array(
			'relation_name' => array( 'type' => 'string', 'required' => true ),
			'parent_id'     => array( 'type' => 'integer', 'required' => true ),
			'child_id'      => array( 'type' => 'integer', 'required' => true ),
		),
	) );
}

function shi_link_relation_items( $request ) {
	$relation = shi_find_relation_by_name( $request->get_param( 'relation_name' ) );
	if ( ! $relation ) {
		return new WP_Error( 'shi_relation_not_found', 'No relation with that name.', array( 'status' => 404 ) );
	}
	$id = $relation->update( (int) $request->get_param( 'parent_id' ), (int) $request->get_param( 'child_id' ) );
	return rest_ensure_response( array( 'success' => ! empty( $id ), 'id' => $id ) );
}

add_action( 'rest_api_init', 'shi_register_relationship_unlink_route' );

/** Counterpart to /link — wraps the same $relation->delete_rows() the admin-ajax "disconnect" action uses. */
function shi_register_relationship_unlink_route() {
	register_rest_route( 'site-headless/v1', '/unlink', array(
		'methods'             => 'POST',
		'callback'            => 'shi_unlink_relation_items',
		'permission_callback' => function () {
			return current_user_can( 'edit_posts' );
		},
		'args'                => array(
			'relation_name' => array( 'type' => 'string', 'required' => true ),
			'parent_id'     => array( 'type' => 'integer', 'required' => true ),
			'child_id'      => array( 'type' => 'integer', 'required' => true ),
		),
	) );
}

function shi_unlink_relation_items( $request ) {
	$relation = shi_find_relation_by_name( $request->get_param( 'relation_name' ) );
	if ( ! $relation ) {
		return new WP_Error( 'shi_relation_not_found', 'No relation with that name.', array( 'status' => 404 ) );
	}
	$relation->delete_rows( (int) $request->get_param( 'parent_id' ), (int) $request->get_param( 'child_id' ) );
	return rest_ensure_response( array( 'success' => true ) );
}

function shi_register_relationship_fields() {
	register_rest_field(
		'service',
		'related_service_area_slugs',
		array(
			'get_callback' => function ( $post ) {
				$relation = shi_find_relation_by_name( 'services-to-service-areas' );
				if ( ! $relation ) {
					return array();
				}
				return shi_slugs_for_ids( $relation->get_children( $post['id'], 'ids' ) );
			},
		)
	);

	register_rest_field(
		'service_area',
		'related_service_slugs',
		array(
			'get_callback' => function ( $post ) {
				$relation = shi_find_relation_by_name( 'services-to-service-areas' );
				if ( ! $relation ) {
					return array();
				}
				return shi_slugs_for_ids( $relation->get_parents( $post['id'], 'ids' ) );
			},
		)
	);
}
