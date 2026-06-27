// asset-matrix.mjs — generate a project's branded image set into products/<slug>/public/assets.
// Reads specs/<slug>/assets.json: { brandPrefix, items:[{ key, path, prompt }] }.
// Env: PRODUCT_SLUG, PRODUCT_DIR(optional), OPENROUTER_API_KEY, ONLY_KEYS(optional csv)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateImage, CONFIG } from '../harness/lib/openrouter.mjs';
import { writeEvidence, recordCost } from '../harness/lib/evidence.mjs';
import { costGate } from '../harness/lib/gates.mjs';

const ROOT = path.resolve(fileURLToPath(new URL('../', import.meta.url)));
const SLUG = process.env.PRODUCT_SLUG || 'daniells-auto-care';
const DIR = process.env.PRODUCT_DIR ? path.resolve(process.env.PRODUCT_DIR) : path.join(ROOT, 'products', SLUG);
const matrix = JSON.parse(fs.readFileSync(path.join(ROOT, 'specs', SLUG, 'assets.json'), 'utf8'));
const only = (process.env.ONLY_KEYS || '').split(',').map((s) => s.trim()).filter(Boolean);

let budget = { total: 0, gate: 'ok' };
const made = [];
for (const item of matrix.items) {
  if (only.length && !only.includes(item.key)) continue;
  const dest = path.join(DIR, item.path);
  process.stdout.write(`▶ ${item.key} … `);
  try {
    const { images, cost, model } = await generateImage({ prompt: matrix.brandPrefix + item.prompt });
    const img = images.find((i) => i.b64);
    if (!img) { console.log('no image bytes'); continue; }
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, Buffer.from(img.b64, 'base64'));
    budget = recordCost(SLUG, cost, { step: `asset:${item.key}`, model });
    made.push({ key: item.key, path: item.path, cost });
    console.log(`ok → ${item.path} ($${cost.toFixed(4)}, cum $${budget.total.toFixed(4)})`);
    if (budget.gate === 'exceeded') { console.error('BUDGET EXCEEDED — stopping.'); break; }
  } catch (e) {
    console.log(`FAILED: ${e.message.slice(0, 120)}`);
  }
}
writeEvidence({ pcr_id: SLUG, step_id: 'asset-matrix', generated: made, image_model: CONFIG.image.default, budget });
console.log(`\nasset-matrix: ${made.length} images. spend $${(budget.total || 0).toFixed(4)}. gate ${costGate(budget).result}`);
