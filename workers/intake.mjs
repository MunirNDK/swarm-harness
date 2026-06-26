// Intake worker. Classifies a PCR (GitHub Issue), checks for duplicates, estimates
// loop type / lanes / risk, posts a comment, and applies labels.
// Env: ISSUE_NUMBER, OPENROUTER_API_KEY, GITHUB_TOKEN, GITHUB_REPOSITORY
import { chatJSON } from '../harness/lib/openrouter.mjs';
import { getPCR, listOpenPCRs, commentPCR, setLabels } from '../harness/lib/pcr.mjs';
import { writeEvidence, recordCost } from '../harness/lib/evidence.mjs';

const number = Number(process.env.ISSUE_NUMBER);
if (!number) throw new Error('ISSUE_NUMBER is required');

const pcr = await getPCR(number);
const others = (await listOpenPCRs()).filter((p) => p.number !== number);

const sys = `You are the Intake Classifier for an agentic build swarm that builds websites,
plugins, SaaS products, and applications (frontend + some backend), deploying to Vercel.
Classify the request and detect duplicates. Respond ONLY as JSON with this shape:
{
  "loop_type": "manual|event-driven|scheduled|production",
  "lanes": ["intake","research","seo","content","design","development","qa","security","deployment","monitoring"],
  "risk_level": "low|medium|high",
  "product_type": "string",
  "duplicate_of": null | <issue number>,
  "estimated_cost_usd": <number>,
  "clarifying_questions": ["..."],
  "summary": "one paragraph"
}`;

const user = `New PCR #${pcr.number}: ${pcr.title}\n\n${pcr.body}\n\n` +
  `Other open PCRs (for duplicate detection):\n` +
  (others.map((p) => `#${p.number}: ${p.title}`).join('\n') || '(none)');

const { json: c, cost, usage } = await chatJSON({
  role: 'intake_classifier',
  messages: [{ role: 'system', content: sys }, { role: 'user', content: user }],
  max_tokens: 1200,
});

const budget = recordCost(pcr.number, cost, { step: 'intake', usage });
writeEvidence({ pcr_id: pcr.number, step_id: 'intake', classification: c, cost_usd: cost, budget });

const labels = [
  'pcr',
  `loop:${c.loop_type}`,
  `risk:${c.risk_level}`,
  ...c.lanes.map((l) => `lane:${l}`),
  c.duplicate_of ? 'status:duplicate' : 'status:triaged',
];
await setLabels(pcr.number, labels);

const body = [
  `### Intake classification`,
  ``,
  `- **Loop:** ${c.loop_type}`,
  `- **Product type:** ${c.product_type}`,
  `- **Risk:** ${c.risk_level}`,
  `- **Lanes:** ${c.lanes.join(', ')}`,
  c.duplicate_of ? `- **Possible duplicate of:** #${c.duplicate_of}` : null,
  `- **Estimated cost:** ~$${Number(c.estimated_cost_usd).toFixed(2)} (budget: $${budget.max}/PCR)`,
  ``,
  c.summary,
  c.clarifying_questions?.length ? `\n**Clarifying questions:**\n` + c.clarifying_questions.map((q) => `- ${q}`).join('\n') : '',
].filter(Boolean).join('\n');

await commentPCR(pcr.number, body);
console.log(`Intake done for #${pcr.number}. Cost $${cost}. Budget gate: ${budget.gate}.`);
