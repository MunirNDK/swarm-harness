<?php
/**
 * Provisions the JetEngine relations storage tables (`wp_jet_rel_default`
 * and `wp_jet_rel_default_meta`) that a normal install would create the
 * first time an admin saves a relation through JetEngine's own dashboard
 * screen. Since our relation was created via JetEngine's REST API instead
 * (no dedicated create-table endpoint exists there — see Implementation
 * Log), those tables were never provisioned, and every relation read/write
 * was silently failing its primary query and logging a "table doesn't
 * exist" DB error on every single request (functionally harmless — it was
 * falling back to a working path — but noisy and not how this should run
 * in production).
 *
 * Schema copied exactly from JetEngine's own
 * includes/components/relations/storage/manager.php `get_db_schema()` /
 * `get_meta_db_schema()`, so these tables are byte-for-byte what JetEngine
 * itself would have created.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function shi_create_relation_tables() {
	global $wpdb;
	require_once ABSPATH . 'wp-admin/includes/upgrade.php';

	$charset_collate = $wpdb->get_charset_collate();
	$prefix          = $wpdb->prefix . 'jet_rel_';

	dbDelta( "CREATE TABLE {$prefix}default (
		_ID bigint(20) NOT NULL AUTO_INCREMENT,
		created TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
		rel_id VARCHAR(40),
		parent_rel INT,
		parent_object_id BIGINT,
		child_object_id BIGINT,
		PRIMARY KEY  (_ID),
		KEY parent_id (rel_id, parent_object_id),
		KEY child_id (rel_id, child_object_id)
	) {$charset_collate};" );

	dbDelta( "CREATE TABLE {$prefix}default_meta (
		_ID bigint(20) NOT NULL AUTO_INCREMENT,
		created TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
		rel_id VARCHAR(40),
		parent_object_id BIGINT,
		child_object_id BIGINT,
		meta_key TEXT,
		meta_value TEXT,
		PRIMARY KEY  (_ID),
		KEY meta_id (rel_id, parent_object_id, child_object_id)
	) {$charset_collate};" );
}
