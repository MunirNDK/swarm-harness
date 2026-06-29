# omp Runtime Adaptation

This file documents how the swarm harness primitives map to **oh-my-pi (omp)** — the terminal
coding agent that replaces the GitHub Actions worker layer.

## Why omp?

GitHub Actions works for one-shot builds and deploys, but the iterate-to-perfect loop
(build → fix → build → fix) pays a cold-start tax on every run. omp runs locally with
warm caches, LSP-aware edits, hash-anchored patches, and first-class subagents — making
the tight loop dramatically faster and more reliable.

## What changed

| Old (GitHub Actions) | New (omp) |
|---|---|
| `workers/build-site.mjs` calls OpenRouter, writes files | omp `builder` agent reads spec, writes code with LSP + hash-anchored edits |
| `workers/fix-build.mjs` self-heal loop | omp `fixer` agent runs `next build`, reads errors, fixes in-session |
| `workers/verify.mjs` calls model for review | omp `verifier` agent runs build + tsc + security + a11y + SEO checks |
| `workers/asset.mjs` generates images | omp `asset-gen` agent crafts prompts, calls OpenRouter image API |
| `workers/revise.mjs` targeted fixes | omp `reviser` agent makes surgical edits with LSP references |
| Cold start every Actions run (~2 min) | Warm local caches, instant iteration |
| No parallelism for page generation | omp `task` subagents spawn parallel workers per page |
| GitHub Actions workflows dispatch workers | Orchestrator dispatches omp agents (still uses GitHub for PRs + Vercel deploy) |

## What stays the same

- **Orchestrator:** The AI planner (in Hermes chat) still decides what to build, writes
  specs, dispatches agents, reads gate results, and decides advance/retry/stop.
- **Specs:** `specs/<slug>/site-spec.json` + `design-system.md` remain the buildable contract.
- **Products:** `products/<slug>/` — generated code lives here.
- **Gates:** Build + tsc + security + visual QA must all pass to ship.
- **Budget:** $8/PCR. Tracked in `evidence/cost-ledger.json`.
- **GitHub:** Still owns source of truth, PRs, and Vercel deploys.
- **Evidence:** Committed JSON packets in `evidence/`.

## Runtime mapping

| Handbook primitive | omp runtime |
|---|---|
| PCR (unit of work) | GitHub Issue (`pcr` label) or local prompt |
| Worker dispatch | `omp --agent builder "prompt"` or `task` subagent |
| Agent roles | `.omp/agents/*.md` (builder, fixer, verifier, asset-gen, reviser) |
| Project context | `.omp/AGENTS.md` (auto-loaded by omp) |
| Sticky rules | `.omp/RULES.md` (always-apply, survives compaction) |
| Model routing | `.omp/config.yml` + `.omp/.env` (OpenRouter key) |
| Gate engine | omp agents run `next build` + `tsc --noEmit` + security review |
| Evidence | Still committed to `evidence/` |
| Cost engine | `evidence/cost-ledger.json` + omp's built-in cost tracking |
| Release | GitHub PR → Vercel preview → merge → production |

## Directory layout

```
swarm-harness/
├─ .omp/
│  ├─ AGENTS.md          ← project context (auto-loaded)
│  ├─ RULES.md           ← sticky rules (always-apply)
│  ├─ config.yml         ← model routing (DeepSeek V4 Pro via OpenRouter)
│  ├─ .env               ← OPENROUTER_API_KEY (gitignored)
│  └─ agents/
│     ├─ builder.md      ← builds pages/components from spec
│     ├─ fixer.md        ← self-heals build errors
│     ├─ verifier.md     ← QA + security + a11y + SEO gates
│     ├─ asset-gen.md    ← generates images via OpenRouter
│     └─ reviser.md      ← targeted revisions to existing code
├─ specs/<slug>/         ← per-project spec
├─ products/<slug>/      ← generated product code
├─ evidence/             ← committed evidence packets + cost ledger
├─ harness/              ← legacy Node.js lib (kept for reference, not used by omp)
├─ workers/              ← legacy Node.js workers (kept for reference, not used by omp)
└─ .github/workflows/    ← still used for Vercel deploy + GitHub Issue intake
```

## Orchestrator runbook C — omp-harnessed (default)

### C0. One-time setup
```bash
# Install omp (Windows PowerShell)
irm https://omp.sh/install.ps1 | iex

# Or download the binary directly:
# https://github.com/can1357/oh-my-pi/releases/latest

# Set the OpenRouter key
echo "OPENROUTER_API_KEY=sk-or-v1-..." > .omp/.env

# Verify omp can see the key and model
omp --version
omp --model openrouter/deepseek/deepseek-v4-pro "Say hello"
```

### C1. Create the PCR
Either open a GitHub Issue (label `pcr`) or just describe the task in the orchestrator chat.

### C2. Write the spec
Create `specs/<slug>/site-spec.json` + `design-system.md`. Commit + push to `main`.
A great spec = few fix cycles. A vague spec = many.

### C3. Build (dispatch omp builder)
```bash
# From the repo root:
cd products/<slug>
omp --agent builder "Read specs/<slug>/site-spec.json and build all pages and components."
```

Or for parallel page generation, the orchestrator uses omp's `task` subagent system:
```bash
omp --agent builder "Build the homepage from the spec. Use task subagents for each page."
```

### C4. Gate — code
```bash
# Run the verifier agent
omp --agent verifier "Verify products/<slug>/ — run build, tsc, security, a11y, SEO checks."
```

### C5. If RED → self-heal
```bash
omp --agent fixer "Fix all build and type errors in products/<slug>/. Run next build + tsc --noEmit."
```
Repeat C4→C5 until green (max 6 iterations).

### C6. Visual QA
Screenshot the preview at 375/768/1440px. Compare to the seed/reference. Feed findings
back to the reviser agent:
```bash
omp --agent reviser "Fix the visual issues found in the screenshot: <issues>"
```

### C7. Ship
```bash
git add products/<slug>/ specs/<slug>/ evidence/
git commit -m "feat(<slug>): <description>"
git push
gh pr create --title "feat(<slug>): <description>" --body "..."
# Merge → Vercel deploys production
```

### Stop conditions (same as before)
- Budget exceeded ($8/PCR)
- Same gate fails 3+ times with no progress
- Requires a new secret, paid service, or destructive action
- Security review reports unfixable high/critical

## Hybrid: GitHub Actions for deploy only

The GitHub Actions workflows for Vercel deploy (`deploy.yml`) still run. The build/fix/verify
loop now happens locally via omp. This gives:
- omp's speed (warm caches, LSP, hash-anchored edits) for the heavy iteration
- GitHub's audit trail + Vercel preview/production for shipping

If you still want to run a worker via GitHub Actions (e.g., for CI on a PR), the legacy
`workers/*.mjs` and workflows remain available — just not the default path.
