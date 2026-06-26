// Self-healing build gate. Runs `next build` in products/<slug>; on failure it feeds the
// errors + real file paths + offending file contents to DeepSeek V4 Pro, applies the fix,
// reinstalls if deps changed, and rebuilds — looping until green or limits hit.
// Handbook: "retry with evaluator feedback". Env: PRODUCT_SLUG, MAX_ITERS(=4), OPENROUTER_API_KEY
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chatJSON } from '../harness/lib/openrouter.mjs';
import { writeEvidence, recordCost } from '../harness/lib/evidence.mjs';
import { costGate } from '../harness/lib/gates.mjs';

const ROOT = path.resolve(fileURLToPath(new URL('../', import.meta.url)));
const SLUG = process.env.PRODUCT_SLUG || 'daniells-auto-care';
const DIR = process.env.PRODUCT_DIR ? path.resolve(process.env.PRODUCT_DIR) : path.join(ROOT, 'products', SLUG);
const BUILD_CMD = process.env.BUILD_CMD || 'npm run build';
const MAX = Number(process.env.MAX_ITERS || 4);

function sh(cmd) {
  try { return { ok: true, out: execSync(cmd, { cwd: DIR, encoding: 'utf8', stdio: 'pipe' }) }; }
  catch (e) { return { ok: false, out: `${e.stdout || ''}\n${e.stderr || ''}` }; }
}
function listFiles() {
  const acc = [];
  (function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      if (['node_modules', '.next', '.git', 'dist'].includes(e.name)) continue;
      const full = path.join(d, e.name);
      if (e.isDirectory()) walk(full);
      else acc.push(path.relative(DIR, full).replace(/\\/g, '/'));
    }
  })(DIR);
  return acc;
}
function readIf(rel) { try { return fs.readFileSync(path.join(DIR, rel), 'utf8'); } catch { return null; } }

console.log(`fix-build: ${SLUG} (max ${MAX} iters)`);
sh('npm install --no-audit --no-fund');
let budget = { total: 0, gate: 'ok' };
let passed = false;

for (let iter = 1; iter <= MAX; iter++) {
  const build = sh(BUILD_CMD);
  if (build.ok) { passed = true; console.log(`✅ ${BUILD_CMD} passed on iter ${iter}`); break; }
  console.log(`\n— iter ${iter}: build failed, asking DeepSeek to fix —`);
  const errors = build.out.slice(-8000);
  const files = listFiles();
  // pull files referenced in the errors + always-relevant config/layout
  const mentioned = [...new Set((errors.match(/(?:\.\/)?(?:app|components|lib)[\\/][\w[\]./-]+\.(?:tsx?|css)/g) || [])
    .map((p) => p.replace(/^\.\//, '').replace(/\\/g, '/')))];
  const always = ['package.json', 'tsconfig.json', 'tailwind.config.ts', 'next.config.mjs', 'postcss.config.mjs', 'app/globals.css', 'app/layout.tsx'];
  // include all shared component/lib definitions so the model can fix API drift (add missing props/exports)
  const shared = files.filter((f) => /^(components|lib)\//.test(f));
  const ctxFiles = [...new Set([...mentioned, ...shared, ...always])].filter((f) => files.includes(f) || f === 'package.json');
  const ctx = ctxFiles.map((f) => `// FILE: ${f}\n${readIf(f) ?? '(missing)'}`).join('\n\n').slice(0, 90000);

  const sys = `You fix build/compile errors in a Next.js (App Router) + TypeScript + Tailwind app.
Rules: imports MUST point to files that exist (see FILE LIST). If a package is imported but missing, add it to package.json "dependencies". Keep the design intact. Do not introduce new errors.
Respond ONLY as JSON: { "files": [{ "path": "relative/path", "content": "FULL corrected file" }], "deps_changed": true|false, "notes": "what you fixed" }
Return ONLY the files that need changes, with their COMPLETE new contents.`;
  const user = `BUILD ERRORS:\n${errors}\n\nFILE LIST (real paths — import only from these):\n${files.join('\n')}\n\nRELEVANT FILE CONTENTS:\n${ctx}`;

  let res;
  try {
    res = await chatJSON({ role: 'implementer', messages: [{ role: 'system', content: sys }, { role: 'user', content: user }], max_tokens: 16000 });
  } catch (e) { console.error(`  fix call failed: ${e.message}`); continue; }

  let n = 0;
  for (const f of res.json.files || []) {
    const dest = path.join(DIR, f.path);
    if (!dest.startsWith(DIR)) continue;
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, f.content); n++;
  }
  budget = recordCost(SLUG, res.cost, { step: `fix-build:iter${iter}`, files: n });
  writeEvidence({ pcr_id: SLUG, step_id: `fix-build-iter${iter}`, files: n, notes: res.json.notes, errors_tail: errors.slice(-1500), cost_usd: res.cost, budget });
  console.log(`  applied ${n} file(s): ${res.json.notes || ''} ($${res.cost.toFixed(4)}, cum $${budget.total.toFixed(4)})`);
  if (res.json.deps_changed || (res.json.files || []).some((f) => f.path === 'package.json')) {
    console.log('  deps changed → npm install'); sh('npm install --no-audit --no-fund');
  }
  if (budget.gate === 'exceeded') { console.error('BUDGET EXCEEDED — stopping fix loop.'); break; }
}

const cg = costGate(budget);
if (process.env.GITHUB_OUTPUT) {
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `build_passed=${passed}\n`);
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `total_cost=${(budget.total || 0).toFixed(4)}\n`);
}
console.log(`\nfix-build done. passed=${passed}. spend $${(budget.total || 0).toFixed(4)}. gate=${cg.result}`);
if (!passed) process.exit(1);
