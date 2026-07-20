# site-headless-integration

Version-controlled WordPress plugin for the Daniells Auto Care headless
integration. Source of truth is this directory in the Next.js repo — do not
hand-edit the deployed copy on the server.

Deployed via SFTP to `/public_html/wp-content/plugins/site-headless-integration/`
on the Cloudways staging instance. See `Headless CMS Implementation Log.md`
at the repo root for deployment history and `docs/headless-cms-schema-contract.md`
for the field spec this implements.

## What it does on activation
- Registers three least-privilege roles (`headless_migration_agent`,
  `headless_forms_agent`, `headless_testing_agent`) for future subagent
  accounts — see `includes/roles.php`.
- Sets `blog_public` to 0 (discourage search engines) — spec §13.5.
- Registers the `service` and `service_area` custom post types and their
  meta fields.

- Registers the Services ↔ Service Areas relationship via JetEngine
  Relations (`includes/` — created via the JetEngine REST API, not stored
  as plugin code; see the implementation log for the exact payload).
- Fires a signed revalidation webhook (`includes/revalidation.php`) on
  save/delete of `service`, `service_area`, `post`, `page` — inert until
  `shi_revalidate_url` is configured.
- Rewrites the WP "Preview" link to point at the Next.js draft endpoint
  (`includes/previews.php`) — inert until `shi_preview_base_url` is
  configured.
- Exposes an admin-only config endpoint (`includes/rest-config.php`,
  `GET/POST /wp-json/site-headless/v1/config`) to read the generated
  revalidate/preview secrets and set the two base URLs once the Next.js
  routes exist.

## Not yet included (future phases)
- Formidable entry-creation REST endpoint (Phase 5).
- Actually setting `shi_revalidate_url` / `shi_preview_base_url` (Phase 4,
  once `/api/revalidate` and `/api/draft` exist in Next.js).
