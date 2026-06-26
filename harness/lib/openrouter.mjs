// OpenRouter client for the swarm. Chat + image generation with cost reporting.
// Uses Node's built-in fetch (Node >= 20). No external deps by design (budget + simplicity).
import fs from 'node:fs';

export const CONFIG = JSON.parse(
  fs.readFileSync(new URL('../config/models.json', import.meta.url), 'utf8')
);

const KEY = process.env.OPENROUTER_API_KEY;

function headers() {
  if (!KEY) throw new Error('OPENROUTER_API_KEY is not set (add it as a GitHub Actions secret).');
  return {
    Authorization: `Bearer ${KEY}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': CONFIG.openrouter.referer,
    'X-Title': CONFIG.openrouter.title,
  };
}

async function postWithRetry(path, body, { attempts = 3 } = {}) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(`${CONFIG.openrouter.base_url}${path}`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify(body),
      });
      if (res.status === 429 || res.status >= 500) {
        throw new Error(`retryable ${res.status}: ${await res.text()}`);
      }
      if (!res.ok) throw Object.assign(new Error(`OpenRouter ${res.status}: ${await res.text()}`), { fatal: true });
      return await res.json();
    } catch (err) {
      lastErr = err;
      if (err.fatal) throw err;
      await new Promise((r) => setTimeout(r, 1000 * 2 ** i));
    }
  }
  throw lastErr;
}

/**
 * Chat completion. Returns { text, model, usage, cost, raw }.
 * cost is in USD as reported by OpenRouter (usage.cost) when available.
 */
export async function chat({
  role,
  model,
  messages,
  temperature = 0.2,
  max_tokens,
  response_format,
} = {}) {
  const chosen = model || (role && CONFIG.roles[role]) || CONFIG.default_model;
  const data = await postWithRetry('/chat/completions', {
    model: chosen,
    messages,
    temperature,
    ...(max_tokens ? { max_tokens } : {}),
    ...(response_format ? { response_format } : {}),
    usage: { include: true },
  });
  const choice = data.choices?.[0];
  return {
    text: choice?.message?.content ?? '',
    model: data.model ?? chosen,
    usage: data.usage ?? null,
    cost: Number(data.usage?.cost ?? 0),
    raw: data,
  };
}

function extractJSON(text) {
  if (!text) return null;
  // strip ```json ... ``` or ``` ... ``` fences
  let t = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  try { return JSON.parse(t); } catch {}
  // grab from first { to last }
  const first = t.indexOf('{');
  const last = t.lastIndexOf('}');
  if (first !== -1 && last > first) {
    try { return JSON.parse(t.slice(first, last + 1)); } catch {}
  }
  return null;
}

/**
 * Ask for strict JSON back and parse it. Strips code fences, extracts the object,
 * and does one corrective retry if the model returns prose. Cost accumulates across attempts.
 */
export async function chatJSON(opts) {
  const out = await chat({ ...opts, response_format: { type: 'json_object' } });
  let parsed = extractJSON(out.text);
  let cost = out.cost;
  if (!parsed) {
    const retry = await chat({
      ...opts,
      response_format: { type: 'json_object' },
      messages: [
        ...opts.messages,
        { role: 'assistant', content: out.text.slice(0, 2000) },
        { role: 'user', content: 'That was not valid JSON. Respond again with ONLY the JSON object — no prose, no markdown fences.' },
      ],
    });
    cost += retry.cost;
    parsed = extractJSON(retry.text);
    if (!parsed) throw new Error(`Model did not return JSON after retry:\n${(retry.text || out.text).slice(0, 500)}`);
    return { ...retry, cost, json: parsed };
  }
  return { ...out, cost, json: parsed };
}

/**
 * Image generation via OpenRouter's unified image output (chat/completions + modalities).
 * Returns { images: [{ b64, mimeType }], cost }. Image request shape is validated on first run.
 */
export async function generateImage({ model, prompt } = {}) {
  const chosen = model || CONFIG.image.default;
  const data = await postWithRetry('/chat/completions', {
    model: chosen,
    messages: [{ role: 'user', content: prompt }],
    modalities: ['image', 'text'],
    usage: { include: true },
  });
  const msg = data.choices?.[0]?.message ?? {};
  const images = (msg.images ?? []).map((img) => {
    const url = img?.image_url?.url ?? img?.url ?? '';
    const match = /^data:(.*?);base64,(.*)$/.exec(url);
    return match ? { mimeType: match[1], b64: match[2] } : { mimeType: 'image/png', b64: '', url };
  });
  return { images, model: data.model ?? chosen, cost: Number(data.usage?.cost ?? 0), raw: data };
}
