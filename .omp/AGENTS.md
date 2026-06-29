# Swarm Harness — omp Runtime

This repo is a **loop-based agentic build swarm** orchestrated by an AI planner and executed by omp (oh-my-pi) coding agents.

## Architecture

- **Orchestrator (AI planner):** decides what to build, writes specs, dispatches omp agents, reads gate results, decides advance/retry/stop. Runs in a Hermes chat session.
- **Workers (omp agents):** read specs, write code with LSP-aware hash-anchored edits, run builds, self-heal, generate assets. Each agent role is defined in `.omp/agents/`.
- **Specs:** `specs/<slug>/site-spec.json` + `design-system.md` — the buildable contract. Workers must conform to the spec exactly.
- **Products:** `products/<slug>/` — generated code (one folder per project).
- **Gates:** build + tsc + security review + visual QA. A step only advances when its gate passes.
- **Budget:** $8 per PCR (Product Change Request). Track spend in `evidence/cost-ledger.json`.

## How the loop runs

```
1. PCR created (GitHub Issue or local prompt)
2. PLAN: orchestrator loads skills, fetches seed/reference, writes specs/<slug>/
3. BUILD: dispatch omp builder agent with spec → code written to products/<slug>/
4. GATE-CODE: run next build + tsc --noEmit. If RED → dispatch fixer agent (loop ≤6)
5. GATE-VISUAL: screenshot 375/768/1440px → vision critique vs seed → fixes → re-screenshot
6. GATE-SEO: confirm titles/meta/JSON-LD/sitemap. Fix gaps.
7. REVIEW: omp /review on the diff. Apply high-value fixes.
8. SHIP: commit + push → GitHub PR → Vercel preview → merge → production deploy
9. RECORD: cost + evidence
```

## Model routing

- **Worker model:** `deepseek/deepseek-v4-pro` via OpenRouter (set in `.omp/.env`)
- **Image model:** `google/gemini-2.5-flash-image` via OpenRouter
- **Advisor/reviewer:** same model, in advisor role

## Spec system

The spec is the contract. Two files per project under `specs/<slug>/`:

### `site-spec.json` (machine-readable)
- `slug`, `name`, `stack` (framework, deps, devDeps — include EVERY package)
- `tokens` — colors, radius, container, gradients
- `fonts`, `motion`
- `business`/`content` — the ONLY source of truth for facts (no invention)
- `components` — name + exact path + contract for every shared component
- `pages` — route/file, type, ordered sections
- `assets` — asset matrix + policy
- `globalRules` — dark-only, brand color usage, import discipline, a11y, responsive

### `design-system.md` (human-readable DNA)
- Design DNA extracted from seed/reference
- Color tokens, typography, UX rules
- Asset policy

## Anti-drift rules (learned the hard way)

- List **exact import paths** for every shared component in the spec.
- Put **all** used packages in `deps`.
- Pages import shared components ONLY from the paths listed in the spec.
- All content comes from the spec's `business`/`services`/`areas` fields — no invented facts, no lorem ipsum.

## Quality bars

1. **Engineering:** `next build` + `tsc --noEmit` = 0 errors
2. **Performance:** next/image with width/height, lazy-load, AVIF/WebP, font-display swap
3. **SEO:** unique title/meta per page, JSON-LD, sitemap.xml, robots.txt, internal links, FAQ blocks
4. **Design:** match the approved seed design's DNA (colors, type, spacing, radius, motion)
5. **Security:** input validation, rate limiting, no secrets in client code, output encoding
6. **Accessibility:** contrast ≥4.5:1, focus rings, alt text, keyboard nav, prefers-reduced-motion
7. **Visual:** zero blocking issues at 375/768/1440px vs seed/reference

## Stop conditions

- Budget exceeded ($8/PCR)
- Same gate fails 3+ times with no progress
- Requires a new secret, paid service, or destructive action
- Security review reports unfixable high/critical
