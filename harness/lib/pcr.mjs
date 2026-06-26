// PCR helpers. A PCR is a GitHub Issue. State/lane/risk are labels.
// Uses the GitHub REST API via fetch with GITHUB_TOKEN (provided in Actions).
const TOKEN = process.env.GITHUB_TOKEN;
const REPO = process.env.GITHUB_REPOSITORY; // "owner/name"
const API = 'https://api.github.com';

function gh(path, init = {}) {
  if (!TOKEN) throw new Error('GITHUB_TOKEN is not set.');
  return fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  }).then(async (r) => {
    if (!r.ok) throw new Error(`GitHub ${r.status} ${path}: ${await r.text()}`);
    return r.status === 204 ? null : r.json();
  });
}

export async function getPCR(number) {
  const issue = await gh(`/repos/${REPO}/issues/${number}`);
  return {
    number: issue.number,
    title: issue.title,
    body: issue.body || '',
    labels: issue.labels.map((l) => (typeof l === 'string' ? l : l.name)),
    state: issue.state,
    url: issue.html_url,
  };
}

export function listOpenPCRs() {
  return gh(`/repos/${REPO}/issues?state=open&labels=pcr&per_page=100`).then((issues) =>
    issues
      .filter((i) => !i.pull_request)
      .map((i) => ({ number: i.number, title: i.title, body: i.body || '' }))
  );
}

export function commentPCR(number, body) {
  return gh(`/repos/${REPO}/issues/${number}/comments`, {
    method: 'POST',
    body: JSON.stringify({ body }),
  });
}

export function setLabels(number, labels) {
  return gh(`/repos/${REPO}/issues/${number}/labels`, {
    method: 'PUT',
    body: JSON.stringify({ labels }),
  });
}

export function addLabels(number, labels) {
  return gh(`/repos/${REPO}/issues/${number}/labels`, {
    method: 'POST',
    body: JSON.stringify({ labels }),
  });
}

// Replace any label with the given prefix (e.g. "status:") with a single new value.
export async function setPrefixedLabel(number, prefix, value) {
  const pcr = await getPCR(number);
  const kept = pcr.labels.filter((l) => !l.startsWith(prefix));
  return setLabels(number, [...kept, `${prefix}${value}`]);
}

export { REPO };
