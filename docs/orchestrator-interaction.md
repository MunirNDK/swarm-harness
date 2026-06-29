# Orchestrator Interaction Model — omp Runtime

This document defines how the orchestrator (Hermes AI) interacts with omp agents.

## The fundamental shift

### Old model (Python scripts → OpenRouter API)
```
Orchestrator:
  1. Write a Python script that calls OpenRouter API
  2. Parse JSON response (file contents)
  3. Write files to disk ourselves
  4. Run `next build` via terminal
  5. Parse build errors
  6. Write another Python script with errors → API → JSON
  7. Write fixed files
  8. Repeat
```
No IDE intelligence. No LSP. Just text in, text out. Every iteration was manual orchestration.

### New model (omp with full IDE)
```
Orchestrator:
  1. Write the spec (site-spec.json + design-system.md)
  2. Dispatch: omp --agent builder "read spec, build all pages"
  3. omp does the rest:
     - Reads files with LSP-aware summarization
     - Writes code with hash-anchored edits (lands first try)
     - Runs `next build` itself
     - Reads errors and fixes them in-session
     - Can spawn `task` subagents for parallel page generation
     - Can use LSP for rename, references, definitions
     - Can attach a debugger if something crashes
     - Advisor model watches every turn for mistakes
  4. Orchestrator reads the result and decides: advance, retry, or stop
```

## What the orchestrator does (Hermes AI)

The orchestrator's job is now **higher-level**:

1. **Intake & planning** — understand the problem, decompose into lanes
2. **Write the spec** — `specs/<slug>/site-spec.json` + `design-system.md`
3. **Dispatch omp agents** — one command per phase:
   ```bash
   # Build phase
   omp --agent builder "Read specs/<slug>/site-spec.json. Build all pages and components."
   
   # Verify phase
   omp --agent verifier "Verify products/<slug>/ — build, tsc, security, a11y, SEO."
   
   # Fix phase (if red)
   omp --agent fixer "Fix all build errors in products/<slug>/."
   
   # Revise phase (targeted changes)
   omp --agent reviser "Add FAQ section to the services page."
   
   # Asset phase
   omp --agent asset-gen "Generate hero and service images from the spec's asset matrix."
   ```
4. **Read gate results** — omp agents report pass/fail with specific findings
5. **Visual QA** — orchestrator screenshots via Playwright, feeds findings to reviser
6. **Decide** — advance to next phase, retry, or escalate to human

## What the orchestrator NO LONGER does

- ❌ Write Python scripts to call OpenRouter API
- ❌ Parse JSON responses and write files to disk
- ❌ Manually run `next build` and parse errors
- ❌ Feed errors back via another API call
- ❌ Manage file paths and imports manually

omp handles all of that with LSP awareness and hash-anchored edits.

## What omp brings that the old model couldn't

| Capability | Old model | omp |
|---|---|---|
| Edits | Full file rewrites from JSON | Hash-anchored: point at anchor, patch lands first try |
| LSP | None | Rename, references, definitions, diagnostics — the agent knows what your IDE knows |
| Build loop | Orchestrator runs build, parses errors, writes fix script | omp runs build, reads errors, fixes in same session — no orchestrator round-trip |
| Parallelism | None (one API call at a time) | `task` subagents spawn parallel workers (e.g., one per page) |
| Code review | Custom security worker via API | `/review` with P0-P3 priorities and verdict |
| Debugger | None | lldb (C/C++), delv (Go), debugpy (Python) — attach, step, inspect |
| Advisor | None | Second model watches every turn, injects concerns inline |
| Git | Orchestrator runs git commands | `omp commit` splits atomic commits, validates messages |
| PRs | Orchestrator calls `gh` API | `read pr://1428` — PRs are filesystem paths |
| Memory | None | `retain`/`recall` — remembers your codebase between sessions |
| Rules | Hardcoded in prompts | `RULES.md` — sticky, survives compaction, injected mid-stream if model goes off-script |

## Parallel page generation with `task` subagents

Instead of generating pages one at a time, the builder agent can use omp's `task` tool to
spawn parallel subagents:

```
omp --agent builder "Read specs/daniells-auto-care/site-spec.json.
Build the foundation (layout, lib/site.ts, UI primitives) first.
Then use task subagents to build each page in parallel:
- task 1: homepage
- task 2: services overview + service detail template
- task 3: service areas overview + area detail template
- task 4: fleet, team, gallery, blog, contact
Each subagent reads the spec and the already-built foundation."
```

Each subagent runs in an isolated worktree, writes its files, and returns a typed result.
No merge conflicts between siblings.

## Orchestrator dispatch patterns

### Pattern 1: Full build (new project)
```bash
# 1. Write spec (orchestrator does this directly)
# 2. Build foundation + pages
omp --agent builder "Read specs/<slug>/site-spec.json. Build foundation, then pages with task subagents."
# 3. Verify
omp --agent verifier "Verify products/<slug>/ — all gates."
# 4. If red, fix
omp --agent fixer "Fix all errors in products/<slug>/."
# 5. Visual QA (orchestrator screenshots, then)
omp --agent reviser "Fix visual issues: <list>"
# 6. Ship
git add products/<slug>/ && git commit && git push
```

### Pattern 2: Targeted revision (existing project)
```bash
omp --agent reviser "Add a FAQ section to app/services/[slug]/page.tsx with 3 Q&As per service."
```

### Pattern 3: Parallel multi-page build
```bash
omp --agent builder "Build foundation from spec, then spawn task subagents:
one per page group. Each reads the spec and foundation."
```

### Pattern 4: Build + verify in one session
```bash
omp --agent builder "Build from spec, then run next build + tsc --noEmit. Fix any errors before yielding."
```

## How the orchestrator reads results

omp in `-p` (print) mode outputs the agent's final response to stdout. The orchestrator
reads this and decides next steps:

```bash
RESULT=$(omp -p --agent verifier "Verify products/daniells-auto-care/" 2>&1)
# Orchestrator reads $RESULT, checks for "verdict: pass" or "verdict: fail"
# If fail, extracts blocking issues and dispatches fixer
```

For interactive sessions (not `-p`), the orchestrator can use `omp --mode json` for
structured output, or simply read the terminal output.

## Cost and budget

omp tracks cost per session. The orchestrator also maintains `evidence/cost-ledger.json`.
Budget gate: $8/PCR. If omp reports cost approaching $8, the orchestrator pauses and asks
the human.

## Key constraint: OpenRouter credit limit

The current OpenRouter key has a token limit that can cause 402 errors with large contexts.
Use `--thinking off` for DeepSeek V4 Pro to reduce token consumption. If credits run out,
the loop stops — the human must top up the OpenRouter account.
