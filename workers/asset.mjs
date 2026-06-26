// Asset generation worker. Optionally sharpens a raw prompt with DeepSeek V4 Pro, then
// generates images via OpenRouter's image model and writes them to evidence/assets.
// Env: PROMPT, COUNT (default 1), OUT_DIR (optional), PCR (optional), REFINE ("1" to refine)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chat, generateImage, CONFIG } from '../harness/lib/openrouter.mjs';
import { recordCost, writeEvidence, EVIDENCE_DIR } from '../harness/lib/evidence.mjs';

const rawPrompt = process.env.PROMPT;
if (!rawPrompt) throw new Error('PROMPT is required');
const count = Math.max(1, Number(process.env.COUNT || 1));
const pcr = process.env.PCR || 'assets';
const outDir = process.env.OUT_DIR
  ? path.resolve(process.env.OUT_DIR)
  : path.join(EVIDENCE_DIR, 'assets');
fs.mkdirSync(outDir, { recursive: true });

let prompt = rawPrompt;
let totalCost = 0;

if (process.env.REFINE === '1') {
  const r = await chat({
    role: 'asset_prompter',
    messages: [{
      role: 'user',
      content: `Rewrite this into a single vivid, specific image-generation prompt (no preamble): ${rawPrompt}`,
    }],
    max_tokens: 300,
  });
  prompt = r.text.trim() || rawPrompt;
  totalCost += r.cost;
}

const made = [];
for (let i = 0; i < count; i++) {
  const { images, cost, model } = await generateImage({ prompt });
  totalCost += cost;
  images.forEach((img, j) => {
    if (!img.b64) return;
    const ext = (img.mimeType.split('/')[1] || 'png').replace('jpeg', 'jpg');
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const file = path.join(outDir, `${pcr}-${stamp}-${i}-${j}.${ext}`);
    fs.writeFileSync(file, Buffer.from(img.b64, 'base64'));
    made.push({ file: path.relative(process.cwd(), file), model });
  });
}

const budget = recordCost(pcr, totalCost, { step: 'asset', count, image_model: CONFIG.image.default });
writeEvidence({ pcr_id: pcr, step_id: 'asset', prompt, refined: prompt !== rawPrompt, images: made, cost_usd: totalCost, budget });
console.log(`Generated ${made.length} image(s) → ${outDir}. Cost $${totalCost.toFixed(4)}.`);
if (!made.length) console.warn('WARN: no image bytes returned — check the image model ID / request shape in harness/lib/openrouter.mjs.');
