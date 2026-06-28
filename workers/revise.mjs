// revise.mjs — DeepSeek-powered targeted edits to an EXISTING product.
// The orchestrator describes a change (TASK); DeepSeek returns updated/created full files.
// Env: PRODUCT_SLUG, PRODUCT_DIR(optional), TASK | TASK_FILE, TARGETS(optional, comma rel paths),
//      OPENROUTER_API_KEY
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chatJSON } from '../harness/lib/openrouter.mjs';
import { writeEvidence, recordCost } from '../harness/lib/evidence.mjs';
import { costGate } from '../harness/lib/gates.mjs';

const ROOT = path.resolve(fileURLToPath(new URL('../', import.meta.url)));
const SLUG = process.env.PRODUCT_SLUG || 'daniells-auto-care';
const DIR = process.env.PRODUCT_DIR ? path.resolve(process.env.PRODUCT_DIR) : path.join(ROOT, 'products', SLUG);
const SPEC_DIR = path.join(ROOT, 'specs', SLUG);

const TASK = process.env.TASK || (process.env.TASK_FILE ? fs.readFileSync(process.env.TASK_FILE, 'utf8') : '');
if (!TASK.trim()) throw new Error('TASK or TASK_FILE is required');
const TARGETS = (process.env.TARGETS || '').split(',').map((s) => s.trim()).filter(Boolean);

function read(p) { try { return fs.readFileSync(p, 'utf8'); } catch { return null; } }
const designSystem = read(path.join(SPEC_DIR, 'design-system.md')) || '(none)';
let facts = '(none)';
try {
  const spec = JSON.parse(read(path.join(SPEC_DIR, 'site-spec.json')) || '{}');
  facts = JSON.stringify({ business: spec.business, services: spec.services, areas: spec.areas, stats: spec.stats, reviews: spec.reviews, nav: spec.nav });
} catch {}

function listFiles() {
  const acc = [];
  (function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      if (['node_modules', '.next', '.git', 'dist', 'out'].includes(e.name)) continue;
      const f = path.join(d, e.name);
      if (e.isDirectory()) walk(f);
      else if (/\.(tsx?|css|json|mjs)$/.test(e.name)) acc.push(path.relative(DIR, f).replace(/\\/g, '/'));
    }
  })(DIR);
  return acc;
}
const files = listFiles();
const targetList = TARGETS.length ? TARGETS : ['app/layout.tsx'];
const targetContents = targetList
  .map((t) => `// FILE: ${t}\n${read(path.join(DIR, t)) ?? '(does not exist yet — you may create it)'}`)
  .join('\n\n').slice(0, 100000);

const sys = `You are a senior Next.js (App Router) + TypeScript + Tailwind + framer-motion engineer
revising an EXISTING production site. Make ONLY the change described in the TASK. Preserve the
existing design language. Imports MUST point to files that exist (see FILE LIST) — our shared
components are NAMED exports under components/ and components/ui. Use real facts from SITE FACTS;
invent nothing. Accessibility + responsive + no lorem in shipped UI.
Respond ONLY as JSON: { "files": [{ "path": "relative/path", "content": "FULL file contents" }], "notes": "what changed" }.
Return COMPLETE contents for every file you change or create.

DESIGN SYSTEM:
${designSystem}

SITE FACTS (source of truth):
${facts}

FILE LIST (import only from these; create new files only when the TASK needs them):
${files.join('\n')}`;

const user = `TASK:\n${TASK}\n\nRELEVANT CURRENT FILES:\n${targetContents}`;

const { json, cost, usage } = await chatJSON({
  role: 'implementer',
  messages: [{ role: 'system', content: sys }, { role: 'user', content: user }],
  max_tokens: 16000,
});

const targetSet = new Set(targetList.map((t) => t.replace(/\\/g, '/')));
let n = 0;
for (const f of json.files || []) {
  const rel = f.path.replace(/\\/g, '/');
  const dest = path.join(DIR, f.path);
  if (!dest.startsWith(DIR)) { console.warn('skip outside dir:', f.path); continue; }
  // guard: never clobber an EXISTING file that wasn't an explicit target (prevents side-effect overwrites)
  if (fs.existsSync(dest) && targetList.length && !targetSet.has(rel)) {
    console.warn('  SKIP (existing, not a target):', rel);
    continue;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, f.content); n++;
  console.log('  wrote', f.path);
}
const budget = recordCost(SLUG, cost, { step: 'revise', usage, files: n, task: TASK.slice(0, 80) });
writeEvidence({ pcr_id: SLUG, step_id: 'revise', files: n, task: TASK.slice(0, 200), notes: json.notes, cost_usd: cost, budget });
console.log(`\nrevise: ${n} file(s). ${json.notes || ''}\n$${cost.toFixed(4)} (cum $${budget.total.toFixed(4)}, gate ${costGate(budget).result})`);
