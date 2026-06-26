# Daniells Auto Care — Locked Design System

Authority order (highest wins): Rights/safety → PCR requirements → **Approved hero seed (glassmorphism)** → **Approved brand + factual content (live site)** → Accessibility → IA → This design system → UI/UX Pro Max recs → agent preference.

## Design DNA (extracted from the approved hero seed, recolored to the live brand)

| Element | Decision |
|---|---|
| Mood | Premium, high-contrast, cinematic, "liquid glass" (confirmed by UI/UX Pro Max: *Liquid Glass* style + *conversion funnel* pattern) |
| Base | Near-black: `#000000 → #0A0A0A` gradient surfaces |
| Glass surfaces | `bg-white/5` + `border border-white/10` + `backdrop-blur-xl`, `rounded-3xl`, `shadow-2xl` |
| Accent | **Brand red `#E80505`** (from live `--dac-primary`); ramp `#B30404 / #980404 / #740404` for depth & gradients |
| Accent glow | Soft red bloom: `bg-[#E80505]/10 blur-3xl` behind cards/hero |
| Headline | Gradient-clip: `from-white via-white to-[#E80505]` (red replaces the seed's gold) |
| Text | Primary `#FFFFFF`; body/muted `#A1A1AA` (zinc-400, ≥4.5:1 on black); faint labels `#7C7C7C` |
| CTAs | `rounded-full`. Primary = solid red `#E80505` → white text. Secondary = glass (`bg-white/5 border-white/10`) |
| Motion | framer-motion: fade-slide-in (opacity 0→1, y 20→0, 0.6–0.8s ease-out), stagger 40–60ms, hover scale 1.02, marquee 40s. **Respect `prefers-reduced-motion`.** |
| Icons | lucide-react only (no emoji). Consistent stroke. |
| Radius | cards `rounded-3xl`, pills/buttons `rounded-full`, inputs `rounded-xl` |
| Container | `max-w-7xl`, px-4 sm:px-6 lg:px-8, 8pt spacing rhythm |

## Color tokens (Tailwind theme.extend.colors)

```
dac.red       #E80505   (primary / CTA)
dac.red-light #B30404
dac.red-med   #980404
dac.red-dark  #740404
dac.ink       #0A0A0A   (surface)
dac.black     #000000
dac.white     #FFFFFF
dac.muted     #A1A1AA   (body on dark)
dac.faint     #7C7C7C
```
CSS variables mirror the live site: `--dac-primary`, `--dac-dark-red`, `--dac-medium-red`, `--dac-light-red`, `--dac-dark-gray`, `--dac-dark-gradient: linear-gradient(180deg,#000,#0A0A0A)`.

## Typography
- **Headings:** `Sora` (600/700, tight tracking `-0.02em`) — geometric, premium, distinct (anti-template).
- **Body/UI:** `Inter` (400/500/600). Base 16px, line-height 1.6.
- Both via `next/font/google`. Weight expresses hierarchy (700 display, 600 titles, 500 labels, 400 body).

## UX rules (from UI/UX Pro Max, priority order)
1. **Accessibility:** contrast ≥4.5:1 (verify red `#E80505` on black = ~4.3:1 for large text only → use red for ≥18px/CTA fills, not small body text; white/zinc-400 for body). Visible focus rings, alt text, keyboard nav, `prefers-reduced-motion`.
2. **Touch/interaction:** targets ≥44px, cursor-pointer, loading state on the quote form submit, press feedback.
3. **Performance:** AVIF/WebP images, width/height set (no CLS), lazy-load below fold, font-display swap.
4. **Conversion funnel:** every page drives to **Get Free Quote** / **Call (973) 916-7868**; one primary CTA per section.
5. **Consistency:** same nav/footer everywhere; one icon family; glass effects uniform.

## Asset policy
Phase 1 (this build): tasteful, dark-toned **Unsplash** auto-detailing/luxury-car photos as placeholders (the hero seed permits known-good stock). Phase 2 (asset lane): OpenRouter image worker (Seedream/FLUX) generates branded assets → review → AVIF/WebP → swap in. No "completion" claimed while unapproved placeholders remain unless explicitly permitted.
