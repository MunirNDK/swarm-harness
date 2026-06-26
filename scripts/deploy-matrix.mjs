// Computes the deploy matrix for the Vercel workflow and writes it to GITHUB_OUTPUT.
// - workflow_dispatch: the single slug + chosen environment
// - pull_request:      slug parsed from branch (pcr/<n>-<slug>) -> preview
// - push to main:      every product folder changed in the push -> production
import fs from 'node:fs';
import { execSync } from 'node:child_process';

const event = process.env.GITHUB_EVENT_NAME;
const out = process.env.GITHUB_OUTPUT;
const include = [];

function changedProductSlugs(base, head) {
  let range = base && !/^0+$/.test(base) ? `${base} ${head}` : `${head}^ ${head}`;
  let files = '';
  try {
    files = execSync(`git diff --name-only ${range} -- products/`, { encoding: 'utf8' });
  } catch {
    files = execSync(`git show --name-only --pretty=format: ${head} -- products/`, { encoding: 'utf8' });
  }
  return [...new Set(
    files.split('\n')
      .map((f) => /^products\/([^/]+)\//.exec(f)?.[1])
      .filter(Boolean)
  )];
}

if (event === 'workflow_dispatch') {
  const slug = process.env.INPUT_SLUG;
  const env = process.env.INPUT_ENV || 'preview';
  if (slug) include.push({ slug, env, pr: '' });
} else if (event === 'pull_request') {
  const branch = process.env.HEAD_REF || '';
  const slug = /pcr\/[0-9]+-(.+)/.exec(branch)?.[1];
  if (slug) include.push({ slug, env: 'preview', pr: process.env.PR_NUMBER || '' });
} else {
  // push to main
  for (const slug of changedProductSlugs(process.env.BEFORE_SHA, process.env.GITHUB_SHA)) {
    include.push({ slug, env: 'production', pr: '' });
  }
}

const matrix = { include };
const hasWork = include.length > 0 ? 'true' : 'false';
fs.appendFileSync(out, `matrix=${JSON.stringify(matrix)}\n`);
fs.appendFileSync(out, `has_work=${hasWork}\n`);
console.log('deploy matrix:', JSON.stringify(matrix));
