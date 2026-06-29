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

## How the handbook maps onto GitHub

| Handbook primitive | GitHub-native runtime |
|---|---|
| PCR (unit of work) | **Issue** (`pcr` label) |
| Lane / status / risk / loop | **Labels** (`lane:*`, `status:*`, `risk:*`, `loop:*`) |
| Loop | **Workflow** (dispatch = manual, issue/PR events = event-driven) |
| Agent run | **Actions job** running a worker that calls OpenRouter |
| Gate | **CI checks** + the verify worker's pass/fail |
| Evidence packet | Committed `evidence/PCR-<n>/*.json` |
| Cost engine | `evidence/cost-ledger.json` + budget gate |
| Validated production path | PR → verify gate → preview → merge → Vercel deploy |

## Layout

```
docs/                 handbook + GitHub-runtime adaptation
harness/config/       models.json (routing + $8 budget), agents/, gates/
harness/lib/          openrouter, pcr, evidence, gates (zero-dependency Node)
workers/              intake, implement, verify, asset, smoke
.github/workflows/    pcr-intake, implement, verify, asset-gen
evidence/             committed evidence packets + cost ledger
products/             products the swarm builds (one folder per product)
```

## Setup (one-time)

1. **Rotate** your OpenRouter key (it was shared in chat once) and set secrets:
   ```bash
   gh secret set OPENROUTER_API_KEY      # paste the NEW key when prompted
   gh secret set VERCEL_TOKEN            # for deploys (when wired up)
   ```
2. Create the labels: `bash scripts/setup-labels.sh`
3. Smoke-test the model + cost reporting:
   ```bash
   OPENROUTER_API_KEY=*** node workers/smoke.mjs
   ```

## Run a loop

1. Open a PCR (Issues → "PCR — Product Change Request"). Intake auto-classifies it.
2. Planner dispatches **Implement PCR** (Actions) with the issue number → opens a PR.
3. On the PR: **Verify PCR** (build/test + QA + security gate) and **Deploy to Vercel**
   (preview) run automatically. The preview URL is commented on the PR.
4. Merge when green → **Deploy to Vercel** runs on `main` and ships the changed product(s)
   to production (`swarm-<slug>` Vercel project per product).

Deploy can also be triggered manually: Actions → **Deploy to Vercel** → pick a product slug
and `preview`/`production`. Requires the `VERCEL_TOKEN` secret.

Image assets: run **Asset Generation** (Actions) with a prompt; images land in `evidence/assets/`.
