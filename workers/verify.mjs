// Verifier + security worker. Runs deterministic build/test gates if present, then a
// DeepSeek V4 Pro QA + security review over the product, writes evidence, and emits a
// pass/fail the workflow turns into a check run.
// Env: ISSUE_NUMBER, PRODUCT_SLUG, OPENROUTER_API_KEY, GITHUB_TOKEN, GITHUB_REPOSITORY
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chatJSON } from '../harness/lib/openrouter.mjs';
import { commentPCR } from '../harness/lib/pcr.mjs';
import { writeEvidence, recordCost } from '../harness/lib/evidence.mjs';
import { commandGate, costGate, combineGates, OUTCOME } from '../harness/lib/gates.mjs';

const ROOT = path.resolve(fileURLToPath(new URL('../', import.meta.url)));
const number = Number(process.env.ISSUE_NUMBER) || 0;
const slug = process.env.PRODUCT_SLUG;
if (!slug) throw new Error('PRODUCT_SLUG is required');
const dir = path.join(ROOT, 'products', slug);

// 1. Deterministic gates (only if the product declares the scripts).
// build + test are blocking; lint is advisory (missing eslint config shouldn't block a deploy).
const det = [];
const advisory = [];
const pkgPath = path.join(dir, 'package.json');
if (fs.existsSync(pkgPath)) {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  if (pkg.scripts?.test) det.push(commandGate('test', 'npm test --silent', { cwd: dir }));
  if (pkg.scripts?.build) det.push(commandGate('build', 'npm run -s build', { cwd: dir }));
  if (pkg.scripts?.lint) advisory.push(commandGate('lint', 'npm run -s lint -- --no-cache 2>/dev/null || true', { cwd: dir }));
}

// 2. Collect source for the review (skip deps/build output, cap size).
function collect(d, base = d, acc = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (['node_modules', '.next', 'dist', '.git'].includes(e.name)) continue;
    const full = path.join(d, e.name);
    if (e.isDirectory()) collect(full, base, acc);
    else if (/\.(t|j)sx?$|\.css$|\.json$|\.html$|\.md$/.test(e.name)) {
      const rel = path.relative(base, full);
      const content = fs.readFileSync(full, 'utf8');
      if (content.length < 20000) acc.push(`// FILE: ${rel}\n${content}`);
    }
  }
  return acc;
}
const source = collect(dir).join('\n\n').slice(0, 120000);

const sys = `You are a QA + security reviewer in a build swarm. Review the product for
correctness bugs, accessibility issues, responsiveness, and security problems
(XSS, injection, secret leakage, unsafe deps, auth gaps). Respond ONLY as JSON:
{
  "verdict": "pass|fail",
  "findings": [{ "severity": "low|medium|high|critical", "type": "bug|a11y|security|perf", "file": "...", "issue": "...", "fix": "..." }],
  "summary": "..."
}
verdict must be "fail" if any high/critical finding exists.`;

const { json: rev, cost, usage } = await chatJSON({
  role: 'security_reviewer',
  messages: [{ role: 'system', content: sys }, { role: 'user', content: `Product: ${slug}\n\n${source}` }],
  max_tokens: 4000,
});

const budget = recordCost(number || slug, cost, { step: 'verify', usage });
const reviewGate = {
  name: 'qa_security_review',
  pass: rev.verdict === 'pass',
  result: rev.verdict === 'pass' ? OUTCOME.ADVANCE : OUTCOME.RETRY,
};
const combined = combineGates([...det, reviewGate, costGate(budget)]);

writeEvidence({
  pcr_id: number || slug, step_id: 'verify', product_slug: slug,
  deterministic_gates: det, review: rev, cost_usd: cost, budget, gate: combined,
});

const lines = [
  `### Verify: \`products/${slug}\` — **${combined.pass ? 'PASS' : 'FAIL'}**`,
  ``,
  ...det.map((g) => `- ${g.pass ? '✅' : '❌'} ${g.name}`),
  ...advisory.map((g) => `- ${g.pass ? '✅' : '⚠️'} ${g.name} (advisory)`),
  `- ${reviewGate.pass ? '✅' : '❌'} qa+security review (${rev.findings?.length || 0} findings)`,
  ``,
  ...(rev.findings || []).map((f) => `- **[${f.severity}/${f.type}]** \`${f.file}\` — ${f.issue}\n  - fix: ${f.fix}`),
  ``, rev.summary || '',
].join('\n');
if (number) await commentPCR(number, lines);
console.log(lines);

if (process.env.GITHUB_OUTPUT) {
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `verdict=${combined.pass ? 'pass' : 'fail'}\n`);
}
if (!combined.pass) process.exit(1);
