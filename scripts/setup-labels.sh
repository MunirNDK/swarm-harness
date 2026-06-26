#!/usr/bin/env bash
# Create the PCR label taxonomy (lanes / status / risk / loop). Idempotent.
set -euo pipefail

create() { gh label create "$1" --color "$2" --description "$3" --force >/dev/null && echo "  $1"; }

echo "Core:";   create "pcr" "5319e7" "Product Change Request"
echo "Status:"; for s in new triaged duplicate running gated retrying blocked staged deployed verified failed; do create "status:$s" "0e8a16" "PCR status: $s"; done
echo "Risk:";   create "risk:low" "c2e0c6" "Low risk"; create "risk:medium" "fbca04" "Medium risk"; create "risk:high" "d93f0b" "High risk"
echo "Loop:";   for l in manual event-driven scheduled production; do create "loop:$l" "1d76db" "Loop type: $l"; done
echo "Lanes:";  for ln in intake research seo content design development qa security deployment monitoring; do create "lane:$ln" "bfdadc" "Lane: $ln"; done
echo "Done."
