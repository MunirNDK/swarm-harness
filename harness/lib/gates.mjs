// Gate evaluation helpers. Gates decide advance / retry / pause / fail / escalate
// based on an evidence packet (handbook: Gates, Gate Outcomes).
import { execSync } from 'node:child_process';

export const OUTCOME = {
  ADVANCE: 'advance',
  RETRY: 'retry',
  PAUSE: 'pause',
  FAIL: 'fail',
  ESCALATE: 'escalate',
};

/** Deterministic check: required fields present on an object. */
export function requiredFieldsGate(obj, fields) {
  const missing = fields.filter((f) => obj?.[f] === undefined || obj?.[f] === null || obj?.[f] === '');
  return {
    name: 'required_fields',
    pass: missing.length === 0,
    result: missing.length === 0 ? OUTCOME.ADVANCE : OUTCOME.RETRY,
    missing,
  };
}

/** Run a shell command as a deterministic gate (build, test, lint). */
export function commandGate(name, cmd, { cwd } = {}) {
  try {
    const out = execSync(cmd, { cwd, stdio: 'pipe', encoding: 'utf8' });
    return { name, pass: true, result: OUTCOME.ADVANCE, output: out.slice(-4000) };
  } catch (err) {
    const output = `${err.stdout || ''}\n${err.stderr || ''}`.slice(-4000);
    return { name, pass: false, result: OUTCOME.RETRY, output };
  }
}

/** Cost gate: map a recordCost() result to a gate outcome. */
export function costGate(costResult) {
  const map = { ok: OUTCOME.ADVANCE, warn: OUTCOME.ADVANCE, exceeded: OUTCOME.PAUSE };
  return {
    name: 'cost',
    pass: costResult.gate !== 'exceeded',
    result: map[costResult.gate],
    total_usd: costResult.total,
    max_usd: costResult.max,
    note: costResult.gate === 'warn' ? `Spent ${(costResult.fraction * 100).toFixed(0)}% of budget` : undefined,
  };
}

/** Combine sub-gate results. Worst outcome wins; PAUSE/ESCALATE are sticky. */
export function combineGates(results) {
  const order = [OUTCOME.ADVANCE, OUTCOME.RETRY, OUTCOME.FAIL, OUTCOME.PAUSE, OUTCOME.ESCALATE];
  let worst = OUTCOME.ADVANCE;
  for (const r of results) if (order.indexOf(r.result) > order.indexOf(worst)) worst = r.result;
  return { pass: results.every((r) => r.pass), result: worst, gates: results };
}
