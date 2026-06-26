// Spec-driven multi-page site generator. Reads specs/<slug>/site-spec.json + design-system.md
// and builds products/<slug>/ with DeepSeek V4 Pro in phases: foundation -> components -> pages.
// All code is written by the model (the swarm "brawn"); this worker is the planner's orchestrator.
// Env: PRODUCT_SLUG (default daniells-auto-care), OPENROUTER_API_KEY [, ONLY_PHASE=foundation|components|pages]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chatJSON, CONFIG } from '../harness/lib/openrouter.mjs';
import { writeEvidence, recordCost } from '../harness/lib/evidence.mjs';
import { costGate } from '../harness/lib/gates.mjs';

const ROOT = path.resolve(fileURLToPath(new URL('../', import.meta.url)));
const SLUG = process.env.PRODUCT_SLUG || 'daniells-auto-care';
const SPEC_DIR = path.join(ROOT, 'specs', SLUG);
const PRODUCT_DIR = path.join(ROOT, 'products', SLUG);
const ONLY = process.env.ONLY_PHASE || '';

const spec = JSON.parse(fs.readFileSync(path.join(SPEC_DIR, 'site-spec.json'), 'utf8'));
const designSystem = fs.readFileSync(path.join(SPEC_DIR, 'design-system.md'), 'utf8');

const content = {
  business: spec.business, services: spec.services, areas: spec.areas,
  stats: spec.stats, reviews: spec.reviews, nav: spec.nav,
};
const componentContracts = spec.components
  .map((c) => `- ${c.name} @ ${c.path} — ${c.contract}`).join('\n');

const BASE = `You are a senior Next.js (App Router) + TypeScript + Tailwind + framer-motion engineer
building a production marketing site. Quality bar: polished, accessible, responsive, no placeholders/TODOs/lorem in shipped UI.

DESIGN SYSTEM (authoritative):
${designSystem}

STACK: ${JSON.stringify(spec.stack)}
TOKENS: ${JSON.stringify(spec.tokens)}
FONTS: ${JSON.stringify(spec.fonts)} (load via next/font/google in app/layout.tsx)
GLOBAL RULES:
${spec.globalRules.map((r) => '- ' + r).join('\n')}

SHARED COMPONENT CONTRACTS (import these by path; never redefine them in pages):
${componentContracts}

SITE CONTENT (the only source of truth — do not invent facts):
${JSON.stringify(content)}

OUTPUT: Respond ONLY as JSON: { "files": [{ "path": "relative/path", "content": "FULL file contents" }], "notes": "short" }.
Paths are relative to the product root. Use the dac.* Tailwind color tokens and the glass/motion patterns above.`;

let totalCost = 0;
let budget = { total: 0, max: CONFIG.budget.max_cost_per_pcr_usd, gate: 'ok' };

function writeFiles(files) {
  let n = 0;
  for (const f of files || []) {
    const dest = path.join(PRODUCT_DIR, f.path);
    if (!dest.startsWith(PRODUCT_DIR)) throw new Error(`outside product dir: ${f.path}`);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, f.content);
    n++;
  }
  return n;
}

async function step(label, instruction, { max_tokens = 16000 } = {}) {
  process.stdout.write(`\n▶ ${label} … `);
  const { json, cost, usage } = await chatJSON({
    role: 'implementer',
    messages: [{ role: 'system', content: BASE }, { role: 'user', content: instruction }],
    max_tokens,
  });
  const n = writeFiles(json.files);
  totalCost += cost;
  budget = recordCost(SLUG, cost, { step: `build:${label}`, usage, files: n });
  console.log(`${n} files, $${cost.toFixed(4)} (cum $${budget.total.toFixed(4)})`);
  writeEvidence({ pcr_id: SLUG, step_id: `build-${label}`, files: n, notes: json.notes, cost_usd: cost, budget });
  if (budget.gate === 'exceeded') {
    console.error(`BUDGET EXCEEDED at ${label} — pausing.`);
    if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `budget_gate=pause\n`);
    process.exit(2);
  }
  return json;
}

// ---- PHASE 1: foundation (config + lib + layout + globals) ----
if (!ONLY || ONLY === 'foundation') {
  await step('foundation',
    `Generate the project FOUNDATION files only:
- package.json (deps: ${spec.stack.deps.join(', ')}; devDeps: ${spec.stack.devDeps.join(', ')}; scripts: dev/build/start/lint)
- tsconfig.json, next.config.mjs (images: allow images.unsplash.com), postcss.config.mjs, tailwind.config.ts (map dac.* colors, Sora/Inter font families, container)
- app/globals.css (Tailwind layers, dark base #0A0A0A/#000 gradient, base typography, focus-visible ring, prefers-reduced-motion guard)
- lib/utils.ts (cn helper)
- lib/site.ts (export ALL of the SITE CONTENT above as typed consts: business, services, areas, stats, reviews, nav)
- app/layout.tsx (Sora+Inter via next/font/google as CSS vars, <html lang=en dark>, metadata + OpenGraph for the business, render <Navbar/>{children}<Footer/>)
Do NOT generate page bodies or components yet (Navbar/Footer come next but layout should import them from components/navbar and components/footer).`);
}

// ---- PHASE 2: shared components ----
if (!ONLY || ONLY === 'components') {
  await step('components',
    `Generate ALL shared components from the SHARED COMPONENT CONTRACTS list (every path under components/ and the lib helpers if not already created).
Include: Container, Section, Button (variants primary/secondary/ghost, rounded-full, asChild), GlassCard, SectionHeading, StarRating, Reveal (framer-motion, 'use client', respects prefers-reduced-motion), Navbar ('use client', sticky, glass-on-scroll, dropdowns for services & areas from lib/site, mobile drawer, phone + Get Free Quote), Footer, ServiceCard, StatStrip, ReviewCard, QuoteForm ('use client', validated, loading+success, posts to /api/quote), QuoteCTA, Marquee.
Make them cohesive and reusable; pages will compose them.`,
    { max_tokens: 20000 });
}

// ---- PHASE 3: pages (one model call each) ----
if (!ONLY || ONLY === 'pages') {
  const pages = spec.pages.filter((p) => p.type !== 'layout');
  for (const p of pages) {
    const detail = [
      `Generate ONLY the file(s) for this route: ${p.route} (type: ${p.type}).`,
      p.note ? `IMPORTANT: ${p.note}` : '',
      `Sections (in order): ${JSON.stringify(p.sections)}`,
      `Compose the shared components by importing them from their contract paths. Do not redefine shared components.`,
      `Use real content from lib/site.ts. For image slots use dark-toned Unsplash photos of car detailing/luxury cars via https://images.unsplash.com (known valid) with width/height set.`,
      p.route.includes('[slug]') ? `Implement generateStaticParams from the relevant lib/site.ts list and notFound() for unknown slugs.` : '',
    ].filter(Boolean).join('\n');
    try {
      await step(`page:${p.route}`, detail, { max_tokens: 16000 });
    } catch (err) {
      console.error(`  ✗ ${p.route}: ${err.message}`);
      writeEvidence({ pcr_id: SLUG, step_id: `build-error`, route: p.route, error: String(err.message) });
    }
  }
}

const cg = costGate(budget);
console.log(`\n✅ build-site done for ${SLUG}. Total $${budget.total.toFixed(4)} / $${budget.max}. Gate: ${cg.result}.`);
if (process.env.GITHUB_OUTPUT) {
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `product_slug=${SLUG}\n`);
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `budget_gate=${cg.result}\n`);
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `total_cost=${budget.total.toFixed(4)}\n`);
}
