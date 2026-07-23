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

## Forms (`includes/forms.php`)
- Bootstraps two Formidable forms ("Contact", "Quote") on activation and
  exposes the server-to-server `POST /wp-json/site-headless/v1/submit`
  endpoint the Next.js `/api/quote` route calls.
- The Quote form's fields include the fleet-specific `fleetSize`,
  `vehicleType`, and `serviceFrequency` inputs, added idempotently via
  `shi_add_missing_quote_fields()`.

## Service pricing fields
- The `service` post type carries CMS pricing fields (`pricing_tiers`,
  `pricing_note`, `addons`, etc. — see `includes/field-schema.php`). These
  register on `init`, so they take effect as soon as the files are deployed,
  no reactivation required.

## Upgrading (redeploy without reactivating)
Bump `Version:` + `SHI_PLUGIN_VERSION` when you add fields, then SFTP the
files up. On the next request, `shi_maybe_upgrade()` detects the version
change and re-runs the idempotent Formidable setup — so new form fields
install automatically, without a manual deactivate/reactivate. (A
reactivate still works too and does the same thing.)

## Not yet included (future phases)
- Actually setting `shi_revalidate_url` / `shi_preview_base_url` (Phase 4,
  once `/api/revalidate` and `/api/draft` exist in Next.js).
