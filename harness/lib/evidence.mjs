// Evidence packets + cost ledger. Both are committed to the repo so loop decisions
// are replayable and auditable (handbook: Evidence Packet, Cost Engine).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CONFIG } from './openrouter.mjs';

const ROOT = path.resolve(fileURLToPath(new URL('../../', import.meta.url)));
const EVIDENCE_DIR = path.join(ROOT, 'evidence');
const LEDGER = path.join(EVIDENCE_DIR, 'cost-ledger.json');

function ensureDir(d) {
  fs.mkdirSync(d, { recursive: true });
}

/** Write a structured evidence packet for a (pcr, step). Returns the file path. */
export function writeEvidence(packet) {
  const dir = path.join(EVIDENCE_DIR, `PCR-${packet.pcr_id}`);
  ensureDir(dir);
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const file = path.join(dir, `${packet.step_id || 'step'}-${stamp}.json`);
  fs.writeFileSync(file, JSON.stringify({ created_at: new Date().toISOString(), ...packet }, null, 2));
  return file;
}

function readLedger() {
  try {
    return JSON.parse(fs.readFileSync(LEDGER, 'utf8'));
  } catch {
    return { pcrs: {} };
  }
}

/**
 * Record cost against a PCR and evaluate the budget gate.
 * Returns { total, max, fraction, gate } where gate is "ok" | "warn" | "exceeded".
 */
export function recordCost(pcrId, costUsd, meta = {}) {
  ensureDir(EVIDENCE_DIR);
  const ledger = readLedger();
  const key = String(pcrId);
  const entry = ledger.pcrs[key] || { total_usd: 0, runs: [] };
  entry.total_usd = Number((entry.total_usd + Number(costUsd || 0)).toFixed(6));
  entry.runs.push({ at: new Date().toISOString(), cost_usd: Number(costUsd || 0), ...meta });
  ledger.pcrs[key] = entry;
  fs.writeFileSync(LEDGER, JSON.stringify(ledger, null, 2));

  const max = CONFIG.budget.max_cost_per_pcr_usd;
  const fraction = entry.total_usd / max;
  let gate = 'ok';
  if (entry.total_usd >= max) gate = 'exceeded';
  else if (fraction >= CONFIG.budget.warn_at_fraction) gate = 'warn';
  return { total: entry.total_usd, max, fraction, gate };
}

export { EVIDENCE_DIR };
