# GitHub Runtime Adaptation

The Loop Engineering Handbook (a private engineering document kept local to the maintainer,
not in this public repo) describes a generic durable runtime (PCR DB, queue, workers, gate
engine, event log). This file pins those abstractions
to concrete GitHub-native mechanisms for **this** project. Where the handbook and this file
disagree, this file wins for the current implementation.

## Runtime mapping

| Handbook | This project |
|---|---|
| PCR database | GitHub Issues (label `pcr`); state in `status:*` labels |
| Event log | Issue comments + committed `evidence/**` + Actions run logs |
| Loop orchestrator | GitHub Actions workflows (`.github/workflows/`) |
| Job queue / workers | Actions jobs running `workers/*.mjs` |
| Harness / capability bundle | `harness/config/agents/*` + env-scoped secrets per workflow |
| Model router | `harness/config/models.json` (V4 Pro for all roles) |
| Gate engine | `harness/lib/gates.mjs` + required PR checks |
| Cost engine | `evidence/cost-ledger.json`, budget gate at $8/PCR |
| Secrets manager | GitHub Actions secrets (`OPENROUTER_API_KEY`, `VERCEL_TOKEN`) |
| Artifact/evidence store | `evidence/` in-repo (small) + PR artifacts (large) |
| Release controller | Vercel (PR previews → production on merge to `main`) |

## Lanes in scope for this use case

`intake, research, seo, content, design, development, qa, security, deployment, monitoring`
— frontend-weighted, with backend pulled in only when a product needs it.

## Deliberate simplifications (vs. the full handbook)

- **No Redis/Postgres.** Durable state is GitHub primitives. Add Railway + a real queue only
  if always-on autonomous loops or a live ops dashboard become necessary.
- **Single model tier.** All roles use DeepSeek V4 Pro (user decision). The router still exists
  so a cheap tier can be reintroduced later by editing `models.json`.
- **Human gates via Issues.** Budget-exceeded and high-risk actions pause and `@`-mention the
  human in an issue comment instead of a bespoke approval UI.

## What still holds from the handbook

PCR discipline, lane scoping, gates-before-advance, evidence packets, cost-per-verified-PCR,
least-privilege tool access, and the validated production path (build → review → preview →
verify → deploy → monitor).
