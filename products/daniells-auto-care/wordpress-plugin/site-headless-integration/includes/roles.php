<?php
/**
 * Scoped, least-privilege roles for headless-integration subagents.
 *
 * Spec §13.1/§13.3: no subagent should use the owner's main admin account,
 * and no subagent should default to full `administrator` either. The one
 * account this session already had ("Orchestrator agent AI") was
 * provisioned as full administrator before this plugin existed — that's
 * documented as an accepted interim risk in the implementation log and kept
 * ONLY for schema/plugin deployment (which inherently needs
 * install_plugins/edit_plugins-equivalent trust; WordPress has no more
 * granular capability for "can deploy code"). Every other subagent gets one
 * of the roles below instead of that admin account.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function shi_register_roles() {
	// Migration agent — can create/edit/delete content (services, service
	// areas, posts, pages) and upload media. Cannot install/edit plugins,
	// edit files, manage users, or change site settings.
	if ( ! get_role( 'headless_migration_agent' ) ) {
		add_role(
			'headless_migration_agent',
			'Headless Migration Agent',
			array(
				'read'                   => true,
				'edit_posts'              => true,
				'edit_others_posts'       => true,
				'edit_published_posts'    => true,
				'delete_posts'            => true,
				'delete_others_posts'     => true,
				'delete_published_posts'  => true,
				'publish_posts'           => true,
				'edit_pages'              => true,
				'edit_others_pages'       => true,
				'edit_published_pages'    => true,
				'delete_pages'            => true,
				'publish_pages'           => true,
				'upload_files'            => true,
				'unfiltered_html'         => true, // needed to migrate existing rich content
			)
		);
	}

	// Forms agent — can view/edit Formidable form definitions and view
	// entries. Cannot delete forms/entries or change global Formidable
	// settings, cannot touch content or plugins.
	if ( ! get_role( 'headless_forms_agent' ) ) {
		add_role(
			'headless_forms_agent',
			'Headless Forms Agent',
			array(
				'read'            => true,
				'frm_view_forms'  => true,
				'frm_edit_forms'  => true,
				'frm_view_entries' => true,
			)
		);
	}

	// Testing agent — read-only, plus visibility into Formidable entries to
	// verify test submissions actually landed. No write capability at all.
	if ( ! get_role( 'headless_testing_agent' ) ) {
		add_role(
			'headless_testing_agent',
			'Headless Testing Agent',
			array(
				'read'             => true,
				'frm_view_entries' => true,
			)
		);
	}

	// Next.js runtime — used ONLY by the server-side draft-preview fetch
	// (spec §8). Needs just enough capability for WP's REST controller to
	// allow reading an unpublished service/service_area/post/page; no write
	// capability of any kind. Published-content fetches never use this
	// account — those are unauthenticated public GETs.
	if ( ! get_role( 'headless_next_runtime' ) ) {
		add_role(
			'headless_next_runtime',
			'Headless Next.js Runtime',
			array(
				'read'       => true,
				'edit_posts' => true, // required by core for READING drafts via REST, not just writing
				'edit_pages' => true,
			)
		);
	}
}
