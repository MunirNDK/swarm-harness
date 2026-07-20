<?php
/**
 * Plugin Name: Site Headless Integration — Daniells Auto Care
 * Description: Durable, version-controlled schema and integration logic for the Next.js headless frontend. Source of truth lives in this repo, not in the WP dashboard.
 * Version: 0.1.0
 * Author: Daniells Auto Care headless CMS orchestrator
 * Text Domain: site-headless-integration
 *
 * Deployed to /wp-content/plugins/site-headless-integration/ via SFTP.
 * Do not hand-edit on the server — edit here and redeploy. See
 * "Headless CMS Implementation Log.md" at the repo root for deployment history.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'SHI_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'SHI_PLUGIN_VERSION', '0.1.0' );

require_once SHI_PLUGIN_DIR . 'includes/roles.php';
require_once SHI_PLUGIN_DIR . 'includes/post-types.php';
require_once SHI_PLUGIN_DIR . 'includes/field-schema.php';
require_once SHI_PLUGIN_DIR . 'includes/meta-fields.php';
require_once SHI_PLUGIN_DIR . 'includes/admin-fields-ui.php';
require_once SHI_PLUGIN_DIR . 'includes/revalidation.php';
require_once SHI_PLUGIN_DIR . 'includes/previews.php';
require_once SHI_PLUGIN_DIR . 'includes/rest-config.php';
require_once SHI_PLUGIN_DIR . 'includes/relationships.php';
require_once SHI_PLUGIN_DIR . 'includes/relation-tables.php';
require_once SHI_PLUGIN_DIR . 'includes/forms.php';

register_activation_hook( __FILE__, 'shi_on_activation' );

/**
 * Runs once on activation. Idempotent — safe to reactivate.
 */
function shi_on_activation() {
	shi_register_roles();

	// Spec §13.5: CMS/staging must not be search-engine indexable.
	// blog_public isn't in the default REST-exposed settings list, so this
	// is set here in code rather than requiring a dashboard visit.
	update_option( 'blog_public', 0 );

	shi_register_post_types();
	shi_revalidate_secret();
	shi_preview_secret();
	shi_bootstrap_formidable_forms();
	shi_add_missing_quote_fields();
	shi_create_relation_tables();
	flush_rewrite_rules();
}
