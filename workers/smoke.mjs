// Cheap connectivity check: confirms OPENROUTER_API_KEY works, DeepSeek V4 Pro responds,
// and cost reporting comes back. Run this first before any real loop.
import { chat, CONFIG } from '../harness/lib/openrouter.mjs';

const res = await chat({
  role: 'planner',
  messages: [{ role: 'user', content: 'Reply with exactly: swarm online' }],
  max_tokens: 16,
});

console.log('model:', res.model);
console.log('reply:', JSON.stringify(res.text.trim()));
console.log('usage:', res.usage);
console.log('cost (USD):', res.cost);
console.log('budget/PCR (USD):', CONFIG.budget.max_cost_per_pcr_usd);

if (!res.text.toLowerCase().includes('swarm online')) {
  console.warn('WARN: unexpected reply — model reachable but output differed.');
}
