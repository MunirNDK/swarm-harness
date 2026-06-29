# swarm-harness

A loop-based agentic build swarm harnessed by **oh-my-pi (omp)** — a terminal coding agent
with LSP-aware edits, hash-anchored patches, first-class subagents, and 40+ model providers.

- **Orchestrator / Planner:** AI model (interactive, in Hermes chat). Does intake shaping, decomposition, lane assignment, spec writing, dispatch, and review.
- **Runtime:** **oh-my-pi (omp)** — runs locally, warm caches, LSP wired into every edit, `task` subagents for parallel work.
- **Workers:** **DeepSeek V4 Pro** via OpenRouter — built, verified, and fixed by omp agents defined in `.omp/agents/`.
- **Products:** websites, multi-page sites, plugins, SaaS products, web apps, asset sets.
- **Deploy target:** Vercel (via GitHub Actions — deploy only).
- **Budget gate:** **$8 / PCR** — the loop pauses and asks a human when exceeded.

## Runtime docs
- [omp Runtime Adaptation](docs/omp-runtime.md) — **current** runtime (omp-harnessed loop)
- [GitHub Runtime Adaptation](docs/github-runtime.md) — legacy runtime (GitHub Actions workers, still used for deploy)
- [Swarm Operator Handbook](docs/SWARM-OPERATOR-HANDBOOK.md) — full operator guide (model-agnostic)

## How the harness maps onto omp

| Handbook primitive | omp runtime |
|---|---|
| PCR (unit of work) | GitHub Issue (`pcr` label) or local prompt |
| Worker dispatch | `omp --agent <role> "prompt"` or `task` subagent |
| Agent roles | `.omp/agents/*.md` (builder, fixer, verifier, asset-gen, reviser) |
| Project context | `.omp/AGENTS.md` (auto-loaded by omp) |
| Sticky rules | `.omp/RULES.md` (always-apply, survives compaction) |
| Model routing | `.omp/config.yml` + `.omp/.env` (OpenRouter key) |
| Gate | omp agents run `next build` + `tsc --noEmit` + security review |
| Evidence packet | Committed `evidence/PCR-<n>/*.json` |
| Cost engine | `evidence/cost-ledger.json` + budget gate |
| Validated production path | PR → verify gate → preview → merge → Vercel deploy |

## Layout

```
.omp/                  omp config: AGENTS.md, RULES.md, config.yml, agents/
docs/                  handbook + runtime adaptations (omp + GitHub)
harness/config/        models.json (routing + $8 budget), agents/, gates/ (legacy)
harness/lib/           openrouter, pcr, evidence, gates (legacy, kept for reference)
workers/               intake, implement, verify, asset, smoke (legacy, kept for reference)
.github/workflows/     deploy (active), intake/verify/fix (legacy fallback)
specs/<slug>/          per-project spec (design-system.md + site-spec.json)
products/<slug>/       generated product code (one folder per project)
evidence/              committed evidence packets + cost ledger
```

## Setup (one-time)

1. **Install omp** (Windows PowerShell):
   ```powershell
   irm https://omp.sh/install.ps1 | iex
   ```
   Or download the binary from [releases](https://github.com/can1357/oh-my-pi/releases).

2. **Set the OpenRouter key** (already in GitHub secrets for deploy):
   ```bash
   echo "OPENROUTER_API_KEY=*** > .omp/.env
   ```

3. **Verify omp works**:
   ```bash
   omp --version
   omp --model openrouter/deepseek/deepseek-v4-pro "Say hello"
   ```

4. **Rotate keys** if they were exposed: set new GitHub secrets (`gh secret set OPENROUTER_API_KEY`, `gh secret set VERCEL_TOKEN`).

## Run a loop

1. **Create a PCR** — open a GitHub Issue (label `pcr`) or describe the task in the orchestrator chat.
2. **Write the spec** — create `specs/<slug>/site-spec.json` + `design-system.md`.
3. **Build** — dispatch the omp builder agent:
   ```bash
   cd products/<slug>
   omp --agent builder "Read specs/<slug>/site-spec.json and build all pages."
   ```
4. **Gate — code** — run the verifier:
   ```bash
   omp --agent verifier "Verify products/<slug>/ — build, tsc, security, a11y, SEO."
   ```
5. **If RED → self-heal**:
   ```bash
   omp --agent fixer "Fix all build and type errors in products/<slug>/."
   ```
   Repeat 4→5 until green (max 6 iterations).
6. **Visual QA** — screenshot at 375/768/1440px, compare to seed, feed findings to reviser.
7. **Ship** — commit, push, open PR, merge → Vercel deploys production.

Deploy can also be triggered manually: Actions → **Deploy to Vercel** → pick a product slug
and `preview`/`production`. Requires the `VERCEL_TOKEN` secret.

Image assets: run the omp `asset-gen` agent or the legacy **Asset Generation** GitHub Action.
