# Daniells Auto Care — Design System

> **Direction:** Showroom Precision  
> **Concept:** A premium automotive showroom after hours — the lights are low, the vehicle is the focus, every surface reflects precision.  
> **Metaphor:** A high-end detailing bay at night. Black epoxy floor. Vehicle under focused light. Red accent lines on tools and work orders. The glow of ceramic coating curing under inspection lamps.

## The Metaphor (What This Site IS)

"The website IS a detailing bay at night." — Not "feels like." IS.

Every design decision flows from this metaphor:
- **Near-black surfaces** (not pure black) — the epoxy floor has depth
- **White text** — the inspection lamp on the work surface
- **Red accents** — the detailer's tool markings, the work order stamp
- **Mono typography for specs** — the treatment log on a clipboard
- **Red glow on hover** — the inspection lamp sweeping across the surface
- **Gradient red bands** — the ceramic coating curing line

## Design DNA

### Colors

| Token | Hex | Purpose |
|-------|-----|---------|
| `--bg` | `#0A0A0A` | Bay floor — base surface |
| `--surface` | `#141414` | Work bench — cards, panels |
| `--surface-2` | `#1C1C1C` | Tool drawer — nested elements, hover |
| `--surface-dark` | `#050505` | Deepest bay — hero, footer |
| `--surface-dark-2` | `#080808` | Slightly raised dark — CTA bands, fleet pricing |
| `--ink` | `#FFFFFF` | Primary text — inspection lamp white |
| `--ink-soft` | `#B0B0B0` | Secondary — silver tool finish |
| `--ink-faint` | `#6E6E6E` | Captions — dull metal |
| `--muted` | `#484848` | Disabled — shadow |
| `--rule` | `#2A2A2A` | Hairlines — panel gap |
| `--accent` | `#E80505` | Detailer's red — precision, urgency, craft |
| `--accent-deep` | `#740404` | Dark red — hover state |
| `--success` | `#4ADE80` | Green — READY status |
| `--warning` | `#FBBF24` | Yellow — trust stars (not red!) |

### Typography

**Montserrat** — Headings + Body (weights: 400, 600, 700)
- Geometric sans-serif. Clean, modern, precise.
- Used for ALL text except code stamps.
- NOT Sora. NOT Inter. These are anti-patterns for this concept.

**JetBrains Mono** — Treatment Log, service codes, specs
- Monospace. Technical, precise, "work order" feel.
- Used ONLY in Treatment Log blocks and numeric specs.
- Size: 0.65rem when used in Treatment Logs.

**Type Scale:**
- xs: 11px (captions, legal)
- sm: 13px (metadata, dates)
- base: 16px (body)
- md: 18px, lg: 22px (subheads)
- xl: 26px, 2xl: 32px (card titles)
- 3xl: clamp(34px, 4vw, 48px) (page titles)
- 4xl: clamp(42px, 6vw, 64px) (hero secondary)
- display: clamp(48px, 8vw, 80px) (hero primary)

### Why-Not Decisions

| Choice | Why NOT |
|--------|---------|
| Sora font | Too playful. Does not match showroom precision. |
| Inter font | Generic. Every site uses Inter. This must be unmistakable. |
| Pure `#000000` background | Kills the red glow effect. Needs depth. `#0A0A0A` has subtle warmth. |
| Glass surfaces (backdrop-blur) | Not the concept. Glass is not a detailing bay material. |
| Rounded-full buttons | Too soft. Showroom precision uses sharp 4px corners. |
| Cream/off-white | AI-slop default. This is a dark bay, not an editorial page. |
| Gold/amber accent | Reads "car wash rewards card," not "precision craft." |
| Red stars | Stars are trust signals (yellow). Red is for precision/action only. |
| Serif fonts | Not the concept. Showroom spec sheets use clean geometric type. |
| Emoji | Unprofessional. lucide-react icons only. |
| Lorem ipsum | Never. All content from the spec's business data. |

## The Three Signature Moves

These are what make the site unmistakable. A viewer should remember them a week later.

### 1. Treatment Log (Service Card Metadata Block)

A red-stamped metadata line on every service card. Reads like a detailer's work order clipboard.

**Visual character:**
- JetBrains Mono, 0.65rem, uppercase, letter-spacing: 0.06em
- Background: `#080808` (surface-dark-2)
- Top and bottom border: 1px solid `rgba(232, 5, 5, 0.3)` (the red stamp line)
- Padding: 4px 12px
- Fields separated by `·` (middle dot) in `#484848`

**Format:** `SVC-100 · Car Detailing · STAGE 3 · EST. 4-HRS · ● READY`

**Status indicators:**
- `● READY` — Green dot (`#4ADE80`) with pulse animation. Booking available.
- `● BOOKING` — Red dot (`#E80505`) with pulse animation. High demand — book now.

Every service card MUST have a Treatment Log. It is the single most deliverable thing that makes this site different from every other auto detailer.

### 2. Red Glow Reveal (Cursor-Tracked Inspection Lamp)

Cards have a red radial gradient that follows the cursor on hover. It simulates the detailer's inspection lamp sweeping across the work surface.

**Mechanism:**
1. CSS custom properties `--mx` and `--my` set via JavaScript `mousemove` on card
2. Card has a pseudo-element or overlay with radial-gradient at `(--mx, --my)` position
3. On hover: border changes from `#2A2A2A` → `rgba(232,5,5,0.3)`, card lifts 2px, shadow shifts to red glow
4. On mouseleave: reset to 50% 50%
5. All transitions at 200ms cubic-bezier(0.2, 0, 0, 1)

**Gradient variants by card type:**
- Service cards: `radial-gradient(ellipse 300px 200px at var(--mx) var(--my), rgba(232,5,5,0.12), transparent 70%)`
- Gallery: `radial-gradient(ellipse 300px 200px at var(--mx) var(--my), rgba(232,5,5,0.10), transparent 70%)`
- Fleet: `radial-gradient(ellipse 300px 200px at var(--mx) var(--my), rgba(232,5,5,0.10), transparent 70%)`
- Reviews: `radial-gradient(ellipse 250px 180px at var(--mx) var(--my), rgba(232,5,5,0.08), transparent 70%)`

### 3. Gradient CTA Bar (Ceramic Coating Cure Line)

A full-width animated gradient bar (red → dark red) that divides sections and carries the trust signal marquee. The same gradient is used for primary button backgrounds — everywhere a visitor sees this gradient, they know "this is where I take action."

**Visual character:**
- Background: `linear-gradient(135deg, #E80505, #980404)`
- Padding: 24px 0
- Contains: horizontally scrolling trust signal items (marquee, 30s linear infinite)
- Subtle pulse: 4s alternate animation between opacity 0.85 and 1.0
- Red dot separator (8px) between marquee items

**Trust signal items:** "300+ Five Star Reviews" · "Licensed & Insured" · "Same Day Service" · "Mobile Service to Your Location"

**Placement:**
- Between sections 2-3
- Between sections 4-5  
- Before the final CTA at page bottom
- As primary button background everywhere

## Layout & Spacing

### Bay Hardware Spacing Scale

Named from the physical bay. Used throughout for consistent rhythm.

| Token | Value | Use |
|-------|-------|-----|
| `--pin` | 4px | Icon gaps, dot spacing |
| `--rivet` | 8px | Tight internal padding |
| `--bolt` | 12px | Card internal padding, Treatment Log |
| `--gauge` | 16px | Standard padding |
| `--panel` | 24px | Section padding, gap between cards |
| `--bay` | 32px | Grid gaps |
| `--stall` | 48px | Section gaps (vertical) |
| `--deck` | 64px | Large section gaps |
| `--hangar` | 96px | Hero bottom padding |
| `--perimeter` | 128px | Page edge margin |

### Container
- Max width: 80rem (not 7xl/72rem — 80rem is the spec)
- Centered with horizontal padding: clamp(16px, 5vw, 64px)

### Background Rhythm
```
Hero (above fold)    → #050505 (deepest bay)
Standard sections    → #0A0A0A (bay floor)
Testimonial section  → #141414 (work bench — raised)
Footer               → #050505 (bookends with hero)
Gradient CTA bar     → #E80505→#980404 (accent strip)
```

Exceptions: quote form always `#141414`, fleet pricing always `#080808`, gallery always `#0A0A0A`.

### Navbar
- Height: 80px
- Background: #050505
- Text: #FFFFFF
- Sticky with subtle bottom border on scroll

## Motion Philosophy: Fast and Confident

No floaty delays. No bouncy springs. The motion says "this is a precision operation."

- **Easing:** `cubic-bezier(0.2, 0, 0, 1)` — fast start, clean stop
- **Durations:** 120ms (micro), 200ms (standard), 350ms (entrance)
- **Entrance:** fade-slide-up (opacity 0→1, y 20→0) with staggered children (50ms delay)
- **Hover:** scale 1.02 + translateY(-2px) + red glow reveal (200ms)
- **Marquee:** 30s linear infinite scroll
- **Respects:** `prefers-reduced-motion` (all animations disabled/reduced)

## Accessibility

- Contrast: White (#FFFFFF) on #0A0A0A = 19.2:1 ✓. #B0B0B0 on #0A0A0A = 8.9:1 ✓.
- Focus rings: 2px solid #E80505, offset 2px on all interactive elements
- All form inputs have visible labels
- All images have descriptive alt text
- Skip-to-content link
- Minimum 44px touch targets on mobile
- Keyboard navigable (no traps)
- ARIA labels on icon-only buttons

## What To Never Do (Anti-Patterns Kill-Check)

Check every commit against these. If any are violated, it's not the approved design:

- [ ] **Glass surfaces / backdrop-blur** — not the concept
- [ ] **Cream, off-white, paper backgrounds** — AI-slop default
- [ ] **Pure #000000 body background** — kills red glow
- [ ] **Sora or Inter fonts** — wrong typeface for showroom precision
- [ ] **Rounded-full buttons (9999px)** — use 4px per the spec
- [ ] **Serif fonts** — wrong register
- [ ] **Gold/amber/yellow as primary accent** — "car wash rewards card"
- [ ] **Red star ratings** — stars are trust yellow (#FBBF24)
- [ ] **Light theme or mode toggle** — dark only
- [ ] **Emoji in UI text** — lucide-react icons only
- [ ] **Missing Treatment Log on service cards** — the #1 signature device
- [ ] **No Red Glow Reveal on cards** — the #2 signature device
- [ ] **Missing Gradient CTA Bar between sections** — the #3 signature device
- [ ] **Content not from the spec** — no invented facts, AI-slop copy, lorem ipsum
- [ ] **Placeholder images in production** — every image slot filled
