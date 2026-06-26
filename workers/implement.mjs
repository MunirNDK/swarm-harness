// Implementer worker. Reads a PCR, generates the file set for the product with
// DeepSeek V4 Pro, writes files into products/<slug>/, records cost + evidence,
// and enforces the budget gate. The workflow commits the result and opens a PR.
// Env: ISSUE_NUMBER, PRODUCT_SLUG (optional), OPENROUTER_API_KEY, GITHUB_TOKEN, GITHUB_REPOSITORY
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chatJSON } from '../harness/lib/openrouter.mjs';
import { getPCR, commentPCR } from '../harness/lib/pcr.mjs';
import { writeEvidence, recordCost } from '../harness/lib/evidence.mjs';
import { costGate, OUTCOME } from '../harness/lib/gates.mjs';

const ROOT = path.resolve(fileURLToPath(new URL('../', import.meta.url)));
const number = Number(process.env.ISSUE_NUMBER);
if (!number) throw new Error('ISSUE_NUMBER is required');

const pcr = await getPCR(number);
const slug = (process.env.PRODUCT_SLUG || pcr.title)
  .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 50) || `pcr-${number}`;
const productDir = path.join(ROOT, 'products', slug);

const sys = `You are a senior frontend/full-stack implementer in an agentic build swarm.
Target stack: modern web (default Next.js + TypeScript + Tailwind unless the PCR says otherwise),
deployable to Vercel. Produce production-quality, accessible, responsive code — no placeholders,
no TODOs, no lorem ipsum in shipped UI. Respond ONLY as JSON:
{
  "files": [{ "path": "relative/path", "content": "full file contents" }],
  "post_install": ["shell commands to run, e.g. npm install"],
  "summary": "what you built and key decisions",
  "assumptions": ["..."],
  "follow_ups": ["..."]
}
Paths are relative to the product root. Include package.json, config, and all source needed to build.`;

const user = `PCR #${pcr.number}: ${pcr.title}\n\n${pcr.body}\n\nProduct slug: ${slug}`;

const { json: out, cost, usage } = await chatJSON({
  role: 'implementer',
  messages: [{ role: 'system', content: sys }, { role: 'user', content: user }],
  max_tokens: 16000,
});

let written = 0;
for (const f of out.files || []) {
  const dest = path.join(productDir, f.path);
  if (!dest.startsWith(productDir)) throw new Error(`Refusing to write outside product dir: ${f.path}`);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, f.content);
  written++;
}

const budget = recordCost(pcr.number, cost, { step: 'implement', usage, files: written });
const cg = costGate(budget);
writeEvidence({
  pcr_id: pcr.number, step_id: 'implement',
  product_slug: slug, files_written: written,
  summary: out.summary, assumptions: out.assumptions, follow_ups: out.follow_ups,
  post_install: out.post_install, cost_usd: cost, budget, gate: cg,
});

const comment = [
  `### Implementation: \`products/${slug}\` (${written} files)`,
  ``, out.summary || '',
  out.assumptions?.length ? `\n**Assumptions:** ${out.assumptions.join('; ')}` : '',
  out.follow_ups?.length ? `\n**Follow-ups:** ${out.follow_ups.join('; ')}` : '',
  ``, `**Cost so far:** $${budget.total.toFixed(4)} / $${budget.max} (gate: ${cg.result})`,
].filter(Boolean).join('\n');
await commentPCR(pcr.number, comment);

// Expose slug to the workflow (for branch/PR naming and post-install).
if (process.env.GITHUB_OUTPUT) {
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `product_slug=${slug}\n`);
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `post_install=${JSON.stringify(out.post_install || [])}\n`);
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `budget_gate=${cg.result}\n`);
}

console.log(`Implemented ${written} files into products/${slug}. Cost $${cost}. Budget gate: ${cg.result}.`);
if (cg.result === OUTCOME.PAUSE) {
  console.error('BUDGET EXCEEDED — pausing. Human input required.');
  process.exit(2);
}
