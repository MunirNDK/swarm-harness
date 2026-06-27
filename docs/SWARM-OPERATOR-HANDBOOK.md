# Swarm Operator Handbook

**Audience:** an AI model (or human) acting as the **Orchestrator / Planner** of this swarm.
**Goal:** take *any* coding problem and drive it to a **perfect** result — no code errors, no
visual issues — by looping: plan → build → gate → fix → re-check, using data-backed best
practices (SEO, SERP content, design-from-seed/reference, security, engineering) and the
installed skills.

> You do **not** need to be a strong model to use this. Follow the numbered runbooks and
> copy-paste the prompt templates. When in doubt, prefer the **default** option and keep the
> loop running until every gate is green.

---

## 0. The 60-second mental model

```
PCR (a problem, as a GitHub Issue)
  → PLAN (you + skills: research, design seed/reference, SEO, security, spec)
  → BUILD (DeepSeek V4 Pro writes the code, in phases, from the spec)
  → GATE  (next build/test/lint + security review + visual QA)
  → FIX   (feed failures back to DeepSeek; loop until green)
  → DEPLOY (Vercel preview → production)
  → DONE when: build green + tests pass + security clean + visual matches seed/reference
```

- **You (Orchestrator):** decide *what* to build, write the spec, dispatch workers, read gate
  results, decide advance/retry/stop. You can be any model.
- **Workers (the "brawn"):** **DeepSeek V4 Pro** via OpenRouter. They write/fix code, review
  security, generate assets. They never decide scope.
- **Gates:** objective checks. A step only advances when its gate passes.
- **Budget gate:** **$8 per PCR**. If exceeded, STOP and ask the human.

Core rule: **never declare done until all gates are green and (for UI) the visuals match the
seed/reference.** Keep iterating.

---

## 1. Secrets (read first, never leak)

- All real keys live in **`swarm-secrets.local.md`** at the repo root. It is **gitignored**
  (`*.local.md`). **Never commit, push, print, or paste these values into a command argument.**
- To use a secret, either (a) it's already a GitHub Actions secret / Railway variable (CI reads
  it automatically), or (b) set it with an interactive prompt: `gh secret set NAME` (type, don't paste inline).
- The keys in that file were exposed once — **rotate them** and update the GitHub/Railway copies.
- Verify before any push: `git status` must NOT show `swarm-secrets.local.md`.

---

## 2. Where everything lives (repo map)

```
swarm-harness/
├─ docs/
│  ├─ SWARM-OPERATOR-HANDBOOK.md   ← you are here
│  ├─ github-runtime.md            ← how handbook primitives map to GitHub
│  └─ loop-engineering-handbook.md ← (LOCAL ONLY, gitignored) source theory
├─ harness/
│  ├─ config/
│  │  ├─ models.json               ← model routing (V4 Pro) + $8 budget gate
│  │  ├─ agents/roles.json         ← agent role profiles
│  │  └─ gates/gates.json          ← gate definitions
│  └─ lib/
│     ├─ openrouter.mjs            ← chat()/chatJSON()/generateImage() + cost
│     ├─ pcr.mjs                   ← read/update GitHub Issues (PCRs)
│     ├─ evidence.mjs              ← evidence packets + cost ledger + budget gate
│     └─ gates.mjs                 ← build/test/lint/cost gate helpers
├─ workers/
│  ├─ intake.mjs        ← classify a PCR, dedup, estimate cost
│  ├─ build-site.mjs    ← generate a multi-page site from a spec (web projects)
│  ├─ implement.mjs     ← generate code for a single PCR (general projects)
│  ├─ fix-build.mjs     ← self-heal: run build, feed errors to DeepSeek, loop to green
│  ├─ verify.mjs        ← build/test/lint + QA + security review gate
│  ├─ asset.mjs         ← generate images via OpenRouter (Seedream/FLUX)
│  └─ smoke.mjs         ← cheap connectivity/cost check
├─ .github/workflows/
│  ├─ pcr-intake.yml    ← on issue → intake.mjs
│  ├─ build-site.yml    ← dispatch → build-site.mjs → PR
│  ├─ implement.yml     ← dispatch → implement.mjs → PR
│  ├─ verify.yml        ← on PR → verify.mjs (gate)
│  ├─ fix-build.yml     ← dispatch → fix-build.mjs (self-heal a branch)
│  ├─ deploy.yml        ← PR→preview, merge→production (Vercel)
│  ├─ asset-gen.yml     ← dispatch → asset.mjs
│  └─ smoke.yml         ← dispatch → smoke.mjs
├─ specs/<slug>/        ← per-project spec (design-system.md + site-spec.json)
├─ products/<slug>/     ← generated product code (one folder per project)
└─ evidence/            ← committed evidence packets + cost-ledger.json
```

Every PCR = a GitHub Issue labelled `pcr`. Labels carry state: `status:*`, `lane:*`, `risk:*`, `loop:*`.

---

## 3. The two runtimes — GitHub vs Railway (and the honest "is Actions slow?" answer)

**Short answer:** GitHub Actions is *not* inherently slow. Two things made it feel slow:
1. **Cold start every run** — each Actions job re-checks-out the repo and runs `npm install`
   (~1–2 min) *before* doing any work. In an iterate-until-perfect loop that re-pays this cost
   on every iteration.
2. **Flaky network while monitoring** from the operator side (unrelated to the runners).

So: for **one-shot builds + PR previews + deploys**, GitHub is great (free, zero infra, native
Vercel previews). For **tight iterate-to-perfect loops** (build → fix → build → fix, many times)
and **always-on / autonomous** runs, a **persistent Railway worker with warm caches** is
meaningfully faster because it skips the cold start and keeps `node_modules` + build cache hot.

### Decision matrix

| Situation | Use |
|---|---|
| First build of a project, PR preview, production deploy | **GitHub** |
| Many fix iterations to reach "perfect" | **Railway** (warm caches → seconds, not minutes) |
| Always-on / scheduled / autonomous loops | **Railway** |
| Multiple PCRs in parallel with a queue | **Railway** (+ Redis) |
| Hosting a backend for a SaaS you build | **Railway** |
| Lowest cost, no infra to manage | **GitHub** |

### Recommended: **Hybrid**
- **GitHub** owns source of truth, PRs, Vercel previews/production, and the audit trail.
- **Railway** runs a persistent worker for the heavy **build → fix → verify → visual-QA loop**,
  pushing fixes back to the GitHub branch. You get GitHub's integration + Railway's speed.

You can run the *entire* process on GitHub alone (it works today). Add Railway when iteration
speed or autonomy becomes the bottleneck. Section 7 has the Railway setup.

---

## 4. Orchestrator runbook A — GitHub-native (works today)

> This is the default path. Copy-paste the commands; replace `<...>` placeholders.

### A0. One-time checks
```bash
gh auth status                       # must be logged in (MunirNDK), scopes incl. repo, workflow
gh workflow list --repo MunirNDK/swarm-harness   # confirm workflows are active
gh workflow run smoke.yml --repo MunirNDK/swarm-harness   # confirm OpenRouter key + model + cost
```
If the smoke run isn't green, the `OPENROUTER_API_KEY` secret is missing/invalid — fix before continuing.

### A1. Create the PCR (the problem)
```bash
gh api repos/MunirNDK/swarm-harness/issues -X POST \
  -f title="[PCR] <short outcome>" \
  -f body="<full requirements: pages/features, brand, constraints, seed/reference URLs, non-goals>" \
  -f 'labels[]=pcr' --jq .number
```
Note the issue number `N`. Intake runs automatically and posts a classification.

### A2. Write the spec (THE most important planner step — see Section 6)
Create `specs/<slug>/site-spec.json` (+ `design-system.md` for UI). Commit + push to `main`.
A great spec = few fix cycles. A vague spec = many.

### A3. Build
```bash
# Web/multi-page project:
gh workflow run build-site.yml --repo MunirNDK/swarm-harness -f product_slug=<slug> -f issue_number=N
# General/single-PCR project:
gh workflow run implement.yml  --repo MunirNDK/swarm-harness -f issue_number=N -f product_slug=<slug>
```
This generates `products/<slug>/`, opens a **PR**, and (on the PR) auto-runs **verify** + **deploy preview**.

### A4. Read the gates
```bash
gh pr list --repo MunirNDK/swarm-harness
gh pr checks <PR#> --repo MunirNDK/swarm-harness
gh api repos/MunirNDK/swarm-harness/issues/<PR#>/comments --jq '.[-3:][].body'   # verify findings + preview URL
```

### A5. If build/verify is RED → self-heal
```bash
gh workflow run fix-build.yml --repo MunirNDK/swarm-harness \
  -f product_slug=<slug> -f branch=pcr/N-<slug> -f max_iters=6
```
`fix-build` runs `next build`, feeds errors back to DeepSeek, applies fixes, loops until green,
then pushes to the branch (which re-runs verify + deploy). Repeat A4→A5 until green.

### A6. Visual QA (the "no visual issues" gate — see Section 5.6)
Screenshot the preview at desktop+mobile, compare to the **seed/reference**, get a vision-model
critique, feed fixes back. Loop until visuals match.

### A7. Ship
```bash
gh pr merge <PR#> --repo MunirNDK/swarm-harness --squash   # merge → deploy.yml ships production
```
Production URL: `https://swarm-<slug>.vercel.app` (public by default). Close the PCR.

### Stop conditions (when to pause and ask the human)
- Budget gate `exceeded` ($8/PCR).
- Same gate fails 3+ times with no progress.
- A change requires a new secret, a paid service, or a destructive/irreversible action.
- Security review reports an unfixable **high/critical**.

---

## 5. Quality bars — make it perfect, data-backed (which SKILL to use when)

The swarm must not just "work" — it must be **correct, fast, accessible, discoverable, secure,
and on-brand**. For each dimension, invoke the named skill(s) during PLAN, bake the guidance
into the spec, and check it in a gate.

### 5.1 Engineering correctness
- **Skills:** `software-architecture`, `clean-code`, `code-reviewer`, `test-driven-development`,
  `typescript-expert`, `react-nextjs-development`, `nextjs-app-router-patterns`.
- **Gate:** `next build` + `tsc --noEmit` = 0 errors; tests pass.

### 5.2 Performance / Core Web Vitals
- **Skills:** `web-performance-optimization`, `performance-optimizer`.
- **Bake in:** `next/image` with width/height, lazy-load below fold, AVIF/WebP, font-display swap.
- **Gate:** no CLS regressions; Lighthouse (optional) ≥ 90.

### 5.3 SEO + content for SERP
- **Skills:** `seo`, `seo-technical`, `seo-content`, `seo-schema`, `seo-sitemap`, `seo-geo`,
  `programmatic-seo`, `content-strategy`, `ai-seo`, `schema-markup`, `copywriting`.
- **Bake in (every page):** unique `<title>`/meta description, semantic headings, Open Graph,
  **JSON-LD** (LocalBusiness/Service/FAQ as relevant), `sitemap.xml`, `robots.txt`, internal
  links, keyword-aligned headings, FAQ blocks for featured snippets, `llms.txt` for AI search.
- **Gate:** schema validates; each page has unique title/description; sitemap covers all routes.

### 5.4 Design — seed-driven + reference-driven (UI tasks)
- **Skills:** `design-taste-frontend` (anti-slop), `ui-ux-pro-max` (palettes/typography/UX rules,
  run its `scripts/search.py --design-system`), `frontend-design`, `tailwind-patterns`, `shadcn`.
- **Precedence (highest wins):** rights/safety → PCR requirements → **approved seed design** →
  **brand + factual content** → accessibility → IA → design system → skill recs → model taste.
- **Seed design:** if the user gives a hero/component, extract its DNA (color, type, spacing,
  radius, motion, density) and apply site-wide — do NOT just repeat the seed layout.
- **Reference site:** if given a reference URL, fetch it, extract real brand colors/structure
  (see `curl` + grep for hex/`--vars`, or Playwright computed styles), and honor them.
- **Gate:** Visual QA (5.6).

### 5.5 Security
- **Skills:** `security-audit`, `vulnerability-scanner`, `frontend-security-coder`,
  `api-security-best-practices`, `threat-modeling-expert`; slash: `/security-review`.
- **Bake in:** input validation + length caps + rate limiting on every endpoint, no secrets in
  client code, output encoding (XSS), safe error messages, dependency hygiene.
- **Gate:** `verify.mjs` security review must report **no high/critical**.

### 5.6 Visual QA (no visual issues) — the loop that makes it "perfect"
1. Deploy the preview (or run `next start` locally).
2. Screenshot key pages at **375px, 768px, 1440px** (Playwright MCP: `browser_navigate` +
   `browser_take_screenshot fullPage:true`).
3. Critique each screenshot with a **vision-capable model** (via OpenRouter) against: the seed
   design, the reference site, and a checklist (alignment, spacing rhythm, contrast, overflow,
   broken images, hierarchy, mobile layout, hover/focus states).
4. Turn findings into a fix prompt → DeepSeek edits → redeploy → re-screenshot.
5. **Loop until the vision critique returns zero blocking issues.**

> If `visual-qa.mjs` doesn't exist yet, build it from `verify.mjs` + `asset.mjs` patterns:
> screenshots in, vision-model JSON findings out, fixes via `chatJSON`. Until then, do step 2–4
> manually with the Playwright tools + a vision model.

### 5.7 Accessibility
- **Skills:** `fixing-accessibility`. **Bake in:** contrast ≥4.5:1, focus rings, alt text,
  labelled inputs, keyboard nav, `prefers-reduced-motion`. **Gate:** part of Visual QA + review.

### Skill-selection rule of thumb
> For any task, load: **1 architecture/engineering skill + 1 domain skill (SEO/design/security/
> framework) + `code-reviewer` at the end.** Prefer official/highly-rated skills already
> installed (listed by the harness). Use **context7** MCP to fetch current library docs before
> using any framework/API — your training data may be stale.

---

## 6. The spec system — how to define ANY problem so the swarm can build it

The spec is how the Planner hands a precise, buildable contract to the workers. Two files per
project under `specs/<slug>/`:

### 6.1 `site-spec.json` (machine-readable, consumed by build-site.mjs)
Key fields (generalize beyond websites):
- `slug`, `name`, `description`
- `stack` — framework, language, styling, **deps**, devDeps (include EVERY package the code imports)
- `tokens` — colors, radius, container, gradients (from seed/reference)
- `fonts`, `motion`
- `business`/`content` — the **only** source of truth for facts (no invention)
- `components` — **name + exact path + contract** for every shared component (prevents the #1
  failure: pages importing props/paths that don't exist)
- `pages` (or `modules`) — route/file, type, ordered sections, notes (e.g. dynamic templates)
- `assets` — asset matrix + policy
- `globalRules` — dark-only, brand color usage, import discipline, a11y, responsive, no lorem

### 6.2 `design-system.md` (human-readable design DNA + tokens + UX rules)
Captured from the seed design + reference site + `ui-ux-pro-max` recommendations, ordered by the
precedence list in 5.4.

### 6.3 Non-web problems (CLI, library, API, bug-fix, refactor)
Use `implement.mjs` with a spec that describes: target files/modules, public API/acceptance
criteria, test plan, and constraints. The same loop applies: implement → `verify` (build/test) →
`fix-build` (self-heal) → done when tests+build green. For **existing-repo bug-fixes**, the PCR
body includes the failing behavior + repro; the worker reads the repo, patches, and the gate is
"the failing test now passes and nothing else breaks."

### 6.4 Anti-drift rules (learned the hard way)
- List **exact import paths** for every shared component; tell pages "import only from these paths."
- Put **all** used packages in `deps`.
- Prefer one combined component+page generation context, or generate a **locked interface
  contract first**, then conform every page to it. (Improvement target for `build-site.mjs`.)

---

## 7. Orchestrator runbook B — Railway (faster iteration / always-on)

Railway runs a **persistent worker** so the build/fix loop skips cold starts and keeps caches warm.

### 7.1 What to deploy
A small Node service `railway/worker.mjs` that:
- Exposes `POST /run` accepting `{ action: "build"|"fix"|"verify"|"asset"|"visual", slug, branch }`.
- Keeps the repo cloned on a **persistent volume** (`/workspace`) with warm `node_modules` and
  `.next` cache per product.
- Runs the existing `workers/*.mjs` logic (import them) without re-installing each time.
- Commits/pushes results to the GitHub branch and comments status (same as the workflows).
- Reads `OPENROUTER_API_KEY`, `VERCEL_TOKEN`, `GITHUB_TOKEN` from Railway **Variables**.

### 7.2 Setup (one-time)
1. Create a Railway project; connect the `swarm-harness` repo (or deploy the `railway/` service).
2. Add a **Volume** mounted at `/workspace`.
3. Add **Variables**: `OPENROUTER_API_KEY`, `VERCEL_TOKEN`, `GITHUB_TOKEN` (fine-grained PAT:
   `contents:write`, `pull_requests:write`, and `workflow` only if pushing workflow files).
4. (Optional) Add **Redis** for a job queue (parallel PCRs) using BullMQ.
5. Set the start command to run `worker.mjs`. Note the public URL.

### 7.3 Trigger it
- **From GitHub:** a tiny workflow (or repo webhook) calls `POST <railway-url>/run` on issue/PR
  events. Or call it directly:
  ```bash
  curl -X POST "$RAILWAY_URL/run" -H 'content-type: application/json' \
    -d '{"action":"build","slug":"<slug>","branch":"pcr/N-<slug>"}'
  ```
- **Always-on:** add a Railway cron to re-run audits/visual-QA, or have the worker loop a PCR
  queue until empty.

### 7.4 Why it's faster
- No per-iteration `git checkout` + `npm install` (warm volume).
- `.next` incremental cache persists → rebuilds are seconds.
- The fix loop (build→fix→build) iterates in-process; no workflow dispatch latency.

### 7.5 Keep GitHub in the loop
Railway pushes the fixed branch to GitHub → `verify.yml` + `deploy.yml` still run there for the
audit trail + Vercel previews. This is the hybrid. (If you want Railway to deploy too, give it
the Vercel token and call `vercel deploy` from the worker.)

> Building `railway/worker.mjs` is a contained next step — it reuses every existing `workers/*`
> function; only the transport (HTTP + warm volume) is new.

---

## 8. The iterate-until-perfect master loop (pseudistructions for the orchestrator)

```
1.  Create PCR (Issue). Read intake classification.
2.  PLAN: load relevant skills (Section 5). If UI: fetch seed + reference, extract DNA + colors.
        Use context7 for current library docs. Write specs/<slug>/.
3.  BUILD: dispatch build-site (web) or implement (general). Wait for PR.
4.  GATE-CODE: read verify. If RED → dispatch fix-build (≤6 iters). Repeat until build+tests+security green.
5.  GATE-VISUAL (UI only): screenshot 375/768/1440 → vision critique vs seed/reference → fixes → redeploy.
        Repeat until zero blocking visual issues.
6.  GATE-SEO/A11Y: confirm titles/meta/JSON-LD/sitemap + contrast/focus/alt. Fix gaps via a worker pass.
7.  REVIEW: run /code-review (or code-reviewer skill) on the diff. Apply high-value fixes.
8.  SHIP: merge PR → production deploy. Verify production URL loads. Close PCR.
9.  RECORD: cost (evidence/cost-ledger.json), what worked, follow-ups.
STOP early only on the Section-4 stop conditions. Otherwise keep looping.
```

A result is **"perfect"** when, simultaneously: `next build`+`tsc` clean, tests pass, security
review has no high/critical, the vision critique returns no blocking issues, SEO/a11y checklist
is satisfied, and the production URL loads correctly.

---

## 9. Cost control

- Routing + budget live in `harness/config/models.json` (`max_cost_per_pcr_usd: 8`).
- Every worker records spend to `evidence/cost-ledger.json` and enforces the gate; at `exceeded`
  it pauses and asks the human.
- Typical full multi-page site build ≈ **$0.15–0.40**. Fix iterations are cheap. Image gen is
  the variable cost (Seedream ≈ $0.04/image).
- Cheap-tier option: `models.json` can route low-risk steps (intake, formatting) to
  `deepseek/deepseek-v3.2`; currently all roles use V4 Pro by user choice.

---

## 10. Troubleshooting (every gotcha we actually hit)

| Symptom | Cause | Fix |
|---|---|---|
| Worker "did not return JSON" | model returned prose/fences | `chatJSON` now strips fences + retries; re-run |
| Pages import props/paths that don't exist | components & pages generated in separate calls (API drift) | `fix-build` self-heals; better: lock component contract in spec (6.4) |
| `next build` fails on Google Fonts locally | `next/font/google` needs network at build | works on Vercel/CI; ignore locally, or use `tsc --noEmit` to gate locally |
| Branch push rejected: "workflow … without workflows permission" | `GITHUB_TOKEN` can't push `.github/workflows`; stale `git add -A` included them | base branch on latest `main`; commit only `products/ specs/ evidence/` |
| "GitHub Actions is not permitted to create … pull requests" | repo setting off | create the PR from the operator CLI (`gh pr create`), OR enable the setting in repo settings |
| `.next/` committed / "large files" | build output not ignored | product-level `.gitignore` with `node_modules/`, `.next/`, `out/` |
| Windows "Filename too long" in worktree | deep path + long evidence filename | `git config core.longpaths true` + short worktree path |
| Can't run a worker locally | key can't go on the command line (leak guard) | run via Actions/Railway (secret store), or `gh secret set` then dispatch |
| Vercel preview redirects to SSO | Deployment Protection on previews (default) | owner can view logged in; disable protection or use production for public |
| Lint fails the gate | no eslint config (`next lint` prompts) | lint is **advisory** in `verify.mjs`; build+security are blocking |

---

## 11. Copy-paste prompt templates

### 11.1 Worker: implement from spec (used by build-site/implement)
```
You are a senior <stack> engineer. Build production-quality, accessible, responsive code.
No placeholders/TODOs/lorem in shipped UI. Follow this DESIGN SYSTEM and these GLOBAL RULES
exactly. Import shared components ONLY from the exact paths listed. Use real content from the
spec — invent nothing. Respond ONLY as JSON: { "files":[{"path","content"}], "notes" }.
<spec slice>
```

### 11.2 Worker: fix build (self-heal)
```
Fix the build/compile errors below. Imports MUST point to files that exist (see FILE LIST).
If a package is imported but missing, add it to package.json. Keep the design intact; introduce
no new errors. Respond ONLY as JSON: { "files":[{"path","content"}], "deps_changed", "notes" }.
ERRORS: <build output>  FILE LIST: <paths>  RELEVANT FILES: <contents>
```

### 11.3 Worker: visual critique (vision model)
```
You are a senior product designer reviewing screenshots of <page> at <viewport>. Compare to the
SEED design and REFERENCE site. Find every visual issue: misalignment, spacing, contrast,
overflow, broken/missing images, weak hierarchy, broken mobile layout, missing hover/focus.
Respond ONLY as JSON: { "blocking":[{ "issue","where","fix" }], "minor":[...] }.
```

### 11.4 Worker: security review
```
Review for correctness bugs, a11y, and security (XSS, injection, secret leakage, missing
rate-limit/validation, unsafe deps). verdict="fail" if any high/critical. Respond ONLY as JSON:
{ "verdict","findings":[{severity,type,file,issue,fix}],"summary" }.
```

---

## 12. Glossary
- **PCR** — Product Change Request = one problem = one GitHub Issue.
- **Spec** — the buildable contract (`specs/<slug>/`).
- **Gate** — an objective check that must pass to advance (build/test/lint/security/visual/cost).
- **Self-heal** — `fix-build` loop: run build → feed errors to DeepSeek → apply → repeat.
- **Seed design** — an approved hero/component whose DNA drives the whole UI.
- **Reference site** — an existing site whose brand/colors/structure must be honored.
- **Evidence** — committed JSON proving what each step did (replayable/auditable).

---

### Appendix: current defaults
- Planner model: any (this handbook makes it model-agnostic). Workers: `deepseek/deepseek-v4-pro`.
- Image: `bytedance/seedream-4.5` (alt `black-forest-labs/flux.2-pro`).
- Repo: `MunirNDK/swarm-harness` (public). Deploy: Vercel (`swarm-<slug>`). Budget: $8/PCR.
- Secrets: `swarm-secrets.local.md` (LOCAL, gitignored).
```
