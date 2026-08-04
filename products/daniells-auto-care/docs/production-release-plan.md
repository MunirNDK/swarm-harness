# Production Release Plan — Headless WordPress Integration

Spec Phase 9/10 deliverable. This is a **plan**, not an execution log — nothing
in this document has been done yet. See `Headless CMS Implementation Log.md`
at the repo root for everything that *has* already happened (Phases 0–8, all
on staging/local, nothing pushed or deployed).

**Nothing in this plan proceeds without the owner's explicit sign-off at each
gated step marked 🔒 below** — per the orchestrator spec's non-negotiable
approval-gate requirement and this session's established workflow.

---

## 1. Where things actually stand right now

- **WordPress**: one instance exists —
  `wordpress-1279759-6563731.cloudwaysapps.com`. There is no separate
  staging/production WordPress pair; this single instance *is* what will
  serve as the CMS backend. It already has: the `site-headless-integration`
  plugin active, `service`/`service_area` CPTs + fields, the Services↔Areas
  relationship, Formidable forms, and all real content migrated (8 services,
  10 areas, 3 blog posts). Search-engine indexing is disabled on this domain.
- **Next.js**: all integration code exists only as **uncommitted local
  changes** on branch `redesign/showroom-precision`. Nothing has been
  committed, pushed, or deployed. The live/production site at
  `daniellsautocare.com` is running whatever was last actually deployed to
  Vercel — completely unaffected by this session's work so far.
- **Vercel**: not touched this session at all. No environment variables for
  the WordPress integration exist there yet. CLAUDE.md documents a known
  prior issue — Vercel's Root Directory setting reset to the repo root
  after a GitHub disconnect/reconnect — status unconfirmed; **must be
  verified before deploying**, or the build will fail immediately regardless
  of code correctness.
- **Secrets**: everything generated this session (WordPress Application
  Passwords, the revalidate/preview HMAC secrets) exists only in the local,
  gitignored `products/daniells-auto-care/.env.local`. Vercel needs its own
  copies of these — copying `.env.local`'s *values* to Vercel is required;
  the file itself must never be committed or pasted anywhere public.

---

## 2. Pre-release checklist — owner actions this session could not do

These require access this orchestrator doesn't have (Vercel dashboard,
Cloudways panel, DNS, or are simply the owner's call to make):

| # | Item | Why it's needed | Blocking? |
|---|---|---|---|
| 1 | Confirm/enable Cloudways automatic backups for the WordPress app, and confirm a recent backup exists | No rollback path for WordPress data without one | **Yes** — do not proceed past §4 without this |
| 2 | Confirm Vercel's Root Directory is set to `products/daniells-auto-care` (Project Settings → General) | Known prior issue; build fails entirely if wrong | **Yes** |
| 3 | Add the 7 environment variables below to the Vercel project (Production environment) | Next.js can't reach WordPress or verify webhook signatures without them | **Yes** |
| 4 | Decide: keep using `wordpress-1279759-6563731.cloudwaysapps.com` directly, or point a real subdomain (e.g. `cms.daniellsautocare.com`) at it first | Cosmetic/professionalism only — functionally works either way. A DNS change is the owner's call and this orchestrator doesn't have DNS access. | No — optional |
| 5 | Turnstile site key + secret key, if spam protection is wanted before launch | Not implemented — flagged since the Phase 0 access audit | No — can launch without it, add later |
| 6 | Real SMTP/email notification setup for form entries | Forms work and create WordPress/Formidable entries correctly, but nobody gets emailed about them yet | No — can launch without it; entries are still visible in wp-admin → Formidable |
| 7 | Decide on the Services↔Service-Areas relationship: leave every relation empty (current state — every service shows all 10 areas, every area shows all 8 services, matching the pre-CMS site exactly) or start curating specific relationships | Pure content decision | No |

### Environment variables to add in Vercel (item 3)

Copy these from `products/daniells-auto-care/.env.local` — do not retype
them by hand, and never commit that file:

```
WORDPRESS_API_URL
WORDPRESS_APP_USERNAME
WORDPRESS_APP_PASSWORD
WP_FORMS_AGENT_USERNAME
WP_FORMS_AGENT_APP_PASSWORD
SHI_REVALIDATE_SECRET
SHI_PREVIEW_SECRET
```

None of these should ever get a `NEXT_PUBLIC_` prefix — they're server-only
and must stay that way.

---

## 3. 🔒 Gate 1 — approval to commit and push

Everything through Phase 8 is currently uncommitted. Before anything else:

- [ ] Owner reviews the working tree changes (or trusts the session log) and
      approves committing.
- [ ] Owner approves pushing to `redesign/showroom-precision` (or opening a
      PR — owner's call which).

**This orchestrator will not run `git commit` or `git push` without this
explicit go-ahead**, per the standing workflow rule for this repo.

---

## 4. 🔒 Gate 2 — approval to deploy to Vercel production

Only after Gate 1, and only after pre-release checklist items 1–3 are
confirmed done:

- [ ] Vercel environment variables are set (checklist item 3).
- [ ] Vercel Root Directory is confirmed correct (checklist item 2).
- [ ] Fresh Cloudways backup confirmed (checklist item 1).
- [ ] Owner gives explicit go-ahead to trigger/allow the production deploy.

---

## 5. Release procedure (ordered)

Steps 1–3 are things this orchestrator can execute once Gate 1 clears.
Steps 4–6 need the owner (Vercel/Cloudways access). Step 7 onward resumes
with this orchestrator once Gate 2 clears.

1. **Commit.** Stage and commit all Phase 0–8 changes with a clear message
   (or a small series of logical commits — owner's preference).
2. **Push** to `redesign/showroom-precision` (or open a PR to `main` —
   confirm which with the owner first).
3. Confirm the push triggers (or does not trigger — depending on Vercel's
   branch-deploy settings) a **preview** deployment, and sanity-check that
   preview URL before touching production at all.
4. **Owner:** set the 7 environment variables in Vercel (Production
   environment — and Preview environment too, if preview deploys should
   also talk to the same WordPress instance).
5. **Owner:** confirm Vercel Root Directory setting.
6. **Owner:** trigger a fresh Cloudways backup of the WordPress app.
7. **Owner approves Gate 2.**
8. Merge/promote to production (exact mechanism depends on whether this
   repo deploys `main` or the feature branch directly — confirm with owner).
9. Once the production deployment is live, **activate revalidation and
   preview** by calling the WordPress plugin's config endpoint to set the
   real production URL:
   ```
   POST https://wordpress-1279759-6563731.cloudwaysapps.com/wp-json/site-headless/v1/config
   (admin Basic Auth)
   { "revalidate_url": "https://daniellsautocare.com/api/revalidate",
     "preview_base_url": "https://daniellsautocare.com" }
   ```
   Until this runs, WordPress edits won't auto-push updates to the live
   site (it'll still work via the 1-hour fallback cache, just not instant).
10. Run the smoke test checklist below against the real production URL.
11. Monitor for the rollback triggers in §7 for a reasonable window
    (suggest: actively watch for the first hour, check again after 24h).

---

## 6. Smoke test checklist (run against production after deploy)

- [ ] Homepage loads, no errors
- [ ] `/services` shows all 8 services
- [ ] `/services/car-detailing` and 2–3 others load with correct content
- [ ] `/service-areas` shows all 10 areas
- [ ] `/service-areas/franklin-lakes` and 1–2 others load correctly
- [ ] `/blog` shows all 3 posts; one post detail page loads correctly
- [ ] Contact form submission succeeds and creates a real Formidable entry
- [ ] Quote form submission succeeds and creates a real Formidable entry
- [ ] `/sitemap.xml` renders, includes real service/area/post URLs
- [ ] `/robots.txt` on the **production** domain allows crawling (this is
      the opposite of the WordPress CMS domain, which is correctly
      noindexed — don't confuse the two)
- [ ] HTTPS works, no mixed-content warnings
- [ ] **Visual/browser check — needs a human.** No browser-automation tool
      was available this entire session; nothing has been visually
      confirmed beyond raw HTML content checks. Please actually look at a
      handful of pages before calling this done.
- [ ] Edit something trivial in WordPress (e.g. a service's short
      description), confirm it updates on the live site within a few
      seconds (proves the revalidation webhook set up in step 9 is really
      working end-to-end in production, not just in this session's local
      testing)

---

## 7. Rollback plan

**Triggers** (per spec §21): widespread 500 errors, form submissions
failing, major content loss, broken canonical URLs, missing critical pages,
authentication/secret leakage, unacceptable performance regression.

**Next.js rollback** — instant, no rebuild:
Vercel dashboard → Deployments → find the last known-good deployment (the
one live before this release) → "Promote to Production." Takes effect
immediately.

**WordPress rollback** — depends on severity:
- If the *integration plugin* is the problem (e.g. a bad field/relation
  change): deactivate `site-headless-integration` via wp-admin or
  `PUT /wp-json/wp/v2/plugins/site-headless-integration/site-headless-integration
  {"status":"inactive"}`. This unregisters the CPTs/fields/relations from
  REST but does **not** delete any data — safe, reversible, no content loss.
- If actual **content** is corrupted or lost: restore from the Cloudways
  backup taken in release step 6. This is why that backup must exist and be
  recent *before* Gate 2 clears — there is no other WordPress-side rollback
  path.
- Revalidation/preview can be instantly neutralized by clearing the
  `revalidate_url`/`preview_base_url` options via the same config endpoint
  used to set them (empty string = inert, matching the safe default this
  whole session ran under).

**Nothing about this rollback plan requires DNS changes** — no DNS was
touched by this release (see checklist item 4, which is optional and
independent of the rest of this plan).

---

## 8. Known open items going into release (not blockers, just honest gaps)

- Turnstile/spam protection not implemented (owner-approval item, checklist #5).
- Email notifications for form entries not configured (checklist #6).
- The one JetEngine relationship type exists but every individual
  service↔area pairing is currently empty by design (matches current site
  behavior exactly — see checklist #7 if the owner wants to start curating).
- Legal pages (`privacy`/`terms`) remain code-owned, not WordPress-managed —
  deliberate scope decision from Phase 4/5, documented in the implementation log.
- No browser/visual QA has been performed at any point this session.
- Local `next build` was never confirmed clean (blocked by an unrelated
  Google-Fonts-fetch issue specific to this local machine) — Vercel's build
  environment is different and should be treated as the real first test of
  a full production build; if it fails, that's new information, not a
  known-and-accepted risk.
