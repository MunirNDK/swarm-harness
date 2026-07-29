# CLAUDE.md

Guidance for Claude Code working in this repo. Read this before touching anything.

## What this repo is

`swarm-harness` — a monorepo that hosts an agentic build harness (`workers/`, `harness/`,
`.omp/`, `docs/`) *and* the actual client products it builds, under `products/<slug>/`.
See `README.md` for the full harness architecture (omp runtime, PCR workflow, budget gates).
That system is largely orthogonal to day-to-day page/component edits — most work happens
directly inside a product folder, not through the harness pipeline.

## Active product: Daniells Auto Care

- **Path:** `products/daniells-auto-care/` — a Next.js 14.2 (App Router) + TypeScript +
  Tailwind CSS 3.4 site for a mobile auto-detailing business in Northern NJ.
- **Live branch:** `redesign/showroom-precision` (not `main` — this branch is several commits
  ahead with an in-progress redesign; check `git log --oneline main..redesign/showroom-precision`
  for the full list before assuming `main` reflects current work).
- **Build/verify commands** (run from `products/daniells-auto-care/`):
  ```
  npx tsc --noEmit      # typecheck
  npx next build        # production build, 39 static/SSG/dynamic routes
  npx next dev -p 4300  # dev server (use a non-default port; 3000 may collide)
  ```
- **Design tokens:** single source of truth is `app/globals.css` `:root` block, consumed via
  `tailwind.config.ts` (`theme.extend.colors` → `var(--token)`). No separate `lib/theme.ts`.

## Current theme state — LIGHT (not dark)

The site was originally built dark (`Design System/daniells-auto-care-design-system.txt`,
"Showroom Precision" — near-black `#0A0A0A` bg, white text, red `#E80505` accent). It has since
been **flipped to a light theme** (off-white `#F5F4F2` bg, near-black `#171513` text). The red
accent (`#E80505` and its `--accent-*` family) was kept **unchanged** — it already passes WCAG
AA on white (~4.71:1) and didn't need to move.

**Important gotcha for future edits:** several elements sit directly on the still-red accent
background (CTA gradient bands, avatar/badge circles, the trust marquee, primary/phone button
variants, the skip-link) and must use `text-cta-fg` (hardcoded white, from `var(--cta-fg)`) or
literal `text-white`/`bg-white` — **never** `text-fg`/`--ink`, which is now dark and will render
unreadable dark-on-red if used there. If you add a new component that sits on the red accent or
`--cta-gradient`, pin its text explicitly; don't let it inherit `--ink`.

Four alternative light-theme design-system variations (not implemented, just concepts) live in
`Design Systems/Design System/*-v2-light*` through `*-v5-wash-ticket*` — Delivery Floor, Spec
Sheet, Showroom Glass, Wash Ticket. The site currently uses a straight inversion of the original
v1 tokens, not any of these four.

## Deployment — Vercel

- Two preview domains exist: `swarm-daniells-aut-git-c732c3-muhammad-munir-ndayako-s-projects.vercel.app`
  and `swarm-daniells-auto-care-jbpstp4q1.vercel.app`.
- **Known issue (as of last session):** the Vercel project's **Root Directory** setting
  reset to the monorepo root after a GitHub disconnect/reconnect, causing builds to run
  `next build` from the repo root (where there's no `app/`/`pages/` dir) instead of from
  `products/daniells-auto-care/`. Fix is in the Vercel dashboard: **Project Settings → General
  → Root Directory → `products/daniells-auto-care`**, then redeploy. This is *not* fixable via
  git — confirm with the user whether it's been corrected before assuming deploys will succeed.
  The code itself builds cleanly locally (`next build` → 39/39 routes, verified).

## Git identity — read this before committing

- **Correct identity for this repo:** `MunirNDK <ndayakomunir@gmail.com>` — already set at the
  **local repo level** (`git config user.email`), so commits made from here are correct.
- **Do not rely on global git config** — the machine's global config is a *third*, different
  email (`ndayakomunir@icloud.com`). Never assume it matches; check `git config user.email`
  (unqualified, repo-scoped) if in doubt.
- **History note:** most of this repo's pre-existing commit history (everything before the
  light-theme-recolor work) still has the old, wrong author email
  (`christianmclark92@gmail.com`) baked in — that email was leaked/misconfigured in this repo
  previously. Per explicit user decision, that history was **left as-is** (not rewritten) to
  avoid a disruptive full-repo force-push rewriting every commit SHA on `main` and all branches.
  Only the two commits made during the recolor work were rewritten to the correct author. If the
  user asks to clean up the rest of the history later, that requires `git filter-repo` (or
  `filter-branch`) across all branches + force-pushing `main`, which needs explicit sign-off
  first — it's disruptive (rewrites every SHA repo-wide).
- If you ever push and the author looks wrong, stop and check `git config user.email` before
  writing more commits — don't silently proceed with a bad identity.

## Workflow used on this branch so far

Recolor/redesign work has followed this pattern (established across this session and prior
ones referenced in commit history): implement (often via dispatched subagents for mechanical,
well-scoped edits) → verify locally (`tsc --noEmit` + `next build`) → visually verify with
Playwright (screenshot key pages/components, especially anything touching the red accent
background) → commit → **confirm with the user before pushing** (push triggers a live Vercel
preview deploy, which is a visible/shared-state action) → push.

## Windows/environment gotchas hit this session

- The repo path contains spaces (`Daniel Auto Website swarm harness`) — quote it in every shell
  command, and don't `cd` into a path relative to itself (Bash tool `cd` is already rooted at
  the right cwd most of the time; a redundant `cd products/daniells-auto-care` from inside that
  same dir will fail with "No such file or directory").
- `git push` prints a harmless `credential-manager-core is not a git command` warning on this
  machine — it still succeeds; don't treat that line as a failure.
- Killing a background `next dev` process: `Get-NetTCPConnection -LocalPort <port>` often
  resolves `OwningProcess` to `0`/Idle for TIME_WAIT leftover sockets, not the real listener.
  Use `Get-Process node | Stop-Process -Force` (PowerShell tool, not Bash) instead.

# Graphify-First Code Navigation

## Core Rule

Use Graphify as the primary navigation map for this repository.

Before reading, editing, or creating code, first inspect:

```text
graphify-out/GRAPH_REPORT.md
graphify-out/graph.json
```

If the files are stored at the project root instead, use:

```text
GRAPH_REPORT.md
graph.json
```

Graphify determines which files are relevant. Raw source files remain the source of truth for implementation details.

## Do Not

Do not begin with:

* Repository-wide `grep`, `rg`, `find`, or recursive scans
* Broad directory browsing
* Guessing filenames or import paths
* Opening unrelated files
* Reading large parts of the codebase without graph justification

A targeted search is allowed only inside a file or narrow directory already identified by Graphify.

## Required Workflow

For every bug fix, PCR, feature, or refactor:

1. Read `GRAPH_REPORT.md`.
2. Locate the relevant node in `graph.json`.
3. Trace its direct imports, callers, dependencies, routes, schemas, components, services, and tests.
4. Build the smallest necessary file list.
5. Open and modify only those graph-supported files.
6. Run validation relevant to the affected code path.
7. Update Graphify when the structure changes.

Before editing, briefly identify:

* Target graph node
* Owning file or module
* Direct dependency path
* Files to modify
* New files to create
* Likely affected callers or dependents

## New PCRs and Features

For new functionality, use Graphify to find the closest existing architectural pattern.

Examples include a similar:

* Route
* Component
* Service
* Schema
* Workflow
* Feature module

New files are allowed even though they do not yet exist in the graph.

Before creating a new file, determine:

* Why it is needed
* Which existing module owns it
* Which existing file will call or import it
* Which dependencies it will use
* Where it belongs based on the current architecture

Do not create speculative abstractions, utilities, folders, or modules outside the active PCR.

## Graphify Synchronization

Graphify must be updated after structural changes, including:

* Creating, deleting, moving, or renaming source files
* Adding or removing imports
* Adding routes, schemas, services, components, or modules
* Changing important calls or dependency relationships

Use this sequence:

```text
Implement change
→ Run targeted validation
→ Run Graphify extraction
→ Run clustering/report generation
→ Verify graph.json and GRAPH_REPORT.md
```

Use the Graphify extraction command supported by this repository, followed by:

```bash
graphify cluster-only "<PROJECT_PATH>"
```

Do not use `cluster-only` as a replacement for extraction. It reclusters the existing graph and may not discover newly created files.

After synchronization, confirm:

* New files appear in `graph.json`
* New dependencies appear as edges
* Deleted files are removed
* `GRAPH_REPORT.md` is updated

## Missing or Stale Graph Data

If Graphify cannot locate an existing feature:

1. Recheck the report, nodes, communities, and neighboring edges.
2. Check registered multi-root paths.
3. Do not automatically scan the full repository.

If the graph is missing or stale, report it clearly and regenerate Graphify.

If regeneration fails:

* Report the exact error
* State whether the code change succeeded
* State that the graph is stale
* Do not claim synchronization completed

## Navigation Order

Always follow:

```text
Graph report
→ Graph node
→ Dependency edges
→ Small file list
→ Source inspection
→ Implementation
→ Validation
→ Graphify update
```
