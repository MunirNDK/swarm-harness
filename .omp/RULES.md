# Sticky Rules (always-apply, survive compaction)

## Design system enforcement
- Dark theme only. Background #0A0A0A/#000. Glass surfaces: bg-white/5 border-white/10 backdrop-blur-xl.
- Brand red #E80505 for CTAs/accents only. Never red for small body text (contrast).
- Sora headings (600/700, tight tracking). Inter body (400/500/600). Both via next/font/google.
- rounded-full for buttons/pills, rounded-3xl for cards, rounded-xl for inputs.
- framer-motion fade-slide-in on section entrances. Respect prefers-reduced-motion.
- lucide-react icons only. NO emoji.
- max-w-7xl container. 8pt spacing rhythm.

## Code discipline
- All content from lib/site.ts (the spec). No invented facts. No lorem ipsum.
- Import shared components ONLY from exact paths in the spec.
- Every page imports Navbar/Footer via layout. Do not redefine.
- Responsive: 375/768/1024/1440. Mobile-first. No horizontal scroll.
- TypeScript strict mode. No any unless absolutely necessary.

## Process
- Never declare done until next build + tsc --noEmit are clean.
- Never commit secrets (.env, *.local.md, swarm-secrets.local.md).
- Track cost in evidence/cost-ledger.json. Stop at $8/PCR.
