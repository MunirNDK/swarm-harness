<?php
/**
 * Plugin Name: Site Headless Integration — Daniells Auto Care
 * Description: Durable, version-controlled schema and integration logic for the Next.js headless frontend. Source of truth lives in this repo, not in the WP dashboard.
 * Version: 0.2.0
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
define( 'SHI_PLUGIN_VERSION', '0.2.0' );

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

	// Record the version so the on-load upgrade path (shi_maybe_upgrade)
	// treats a fresh activation as already up to date.
	update_option( 'shi_plugin_version', SHI_PLUGIN_VERSION );
}

add_action( 'init', 'shi_maybe_upgrade', 20 );

/**
 * Version-gated self-upgrade so an SFTP redeploy applies new form fields
 * WITHOUT a manual deactivate/reactivate. When the deployed
 * SHI_PLUGIN_VERSION differs from the stored option, re-run the idempotent
 * Formidable setup — each call is a no-op when its work is already done, so
 * this only ever *adds* what's newly declared (e.g. the vehicleType /
 * serviceFrequency quote fields added in 0.2.0). Custom post types + meta
 * fields register on their own `init` hooks and need nothing here.
 *
 * Runs at `init` priority 20 (after Formidable has loaded its classes). If
 * Formidable isn't active yet we bail WITHOUT recording the version, so the
 * upgrade retries on a later request once it's available.
 */
function shi_maybe_upgrade() {
	if ( get_option( 'shi_plugin_version' ) === SHI_PLUGIN_VERSION ) {
		return;
	}
	if ( ! class_exists( 'FrmForm' ) || ! class_exists( 'FrmField' ) ) {
		return; // Formidable not ready — retry next request, don't record version.
	}

	shi_bootstrap_formidable_forms();
	shi_add_missing_quote_fields();

	update_option( 'shi_plugin_version', SHI_PLUGIN_VERSION );
}
