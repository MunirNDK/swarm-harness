import type { Config } from 'tailwindcss';

/**
 * Colours backed by an RGB channel triplet in globals.css.
 * Emitting `rgb(var(--x-rgb) / <alpha-value>)` is what makes opacity
 * modifiers (`bg-surface/90`, `text-cta-fg/80`) resolve — a bare
 * `var(--x)` colour silently drops the modifier and emits no CSS.
 */
const ch = (name: string) => `rgb(var(--${name}-rgb) / <alpha-value>)`;

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      /* ═══════════════════════════════════════════
         COLORS — tokens doc §"Color Tokens"
         Every colour resolves to a CSS custom property in globals.css.
         There are no literal hex values in this file by design: if a
         colour is not here, it is not part of the system.
         ═══════════════════════════════════════════ */
      colors: {
        bg:               ch('bg'),
        surface:          ch('surface'),
        surface2:         ch('surface-2'),
        'surface-dark':   ch('surface-dark'),
        'surface-dark-2': ch('surface-dark-2'),
        border:           ch('rule'),
        fg:               ch('ink'),
        'fg-soft':        ch('ink-soft'),
        'fg-faint':       ch('ink-faint'),
        muted:            ch('muted'),
        accent:           ch('accent'),
        'accent-deep':    ch('accent-deep'),
        'accent-mid':     ch('accent-mid'),
        'accent-light':   ch('accent-light'),
        cta:              ch('accent'),
        'cta-fg':         ch('cta-fg'),
        'cta-hover':      ch('danger'),
        'cta-active':     ch('accent-deep'),
        trust:            ch('surface'),
        'trust-border':   ch('rule'),
        'trust-star':     ch('trust-star'),
        urgency:          ch('accent'),
        phone:            ch('accent'),
        'input-border':   ch('input-border'),
        success:          ch('success'),
        warning:          ch('warning'),
        danger:           ch('danger'),
        info:             ch('info'),

        /* Pre-composed tints — alpha is baked in, so these take no modifier */
        overlay:        'var(--overlay)',
        'accent-soft':  'var(--accent-soft)',
        'accent-mist':  'var(--accent-mist)',
        'urgency-soft': 'var(--urgency-soft)',
        'success-soft': 'var(--success-soft)',
        'warning-soft': 'var(--warning-soft)',
        'danger-soft':  'var(--danger-soft)',
        'info-soft':    'var(--info-soft)',
      },

      /* ═══════════════════════════════════════════
         FONT FAMILY — Design Spec §18, §3
         ═══════════════════════════════════════════ */
      fontFamily: {
        sans:    ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono:    ['var(--font-mono)', 'monospace'],
        /* Legacy aliases */
        heading: ['var(--font-body)', 'system-ui', 'sans-serif'],
        body:    ['var(--font-body)', 'system-ui', 'sans-serif'],
      },

      /* ═══════════════════════════════════════════
         FONT SIZE — tokens doc §"Type Scale" + §"Labels & Mono"
         The mono/* and kicker entries carry their own tracking so a label
         is a single class. Nothing in the app may set a font size outside
         this list — 12px is the floor for readable text, and text-xs (11px)
         is reserved for mono micro-labels.
         ═══════════════════════════════════════════ */
      fontSize: {
        xs:      ['var(--t-xs)',      { lineHeight: '1.4' }],
        sm:      ['var(--t-sm)',      { lineHeight: '1.5' }],
        base:    ['var(--t-base)',    { lineHeight: '1.65' }],
        md:      ['var(--t-md)',      { lineHeight: '1.6' }],
        lg:      ['var(--t-lg)',      { lineHeight: '1.5' }],
        xl:      ['var(--t-xl)',      { lineHeight: '1.3' }],
        '2xl':   ['var(--t-2xl)',     { lineHeight: '1.2' }],
        '3xl':   ['var(--t-3xl)',     { lineHeight: '1.1' }],
        '4xl':   ['var(--t-4xl)',     { lineHeight: '1.05' }],
        display: ['var(--t-display)', { lineHeight: '1.0' }],

        'mono-xs': ['var(--t-mono-xs)', { lineHeight: '1.4', letterSpacing: 'var(--track-mono)' }],
        'mono-sm': ['var(--t-mono-sm)', { lineHeight: '1.5', letterSpacing: 'var(--track-mono)' }],
        'mono-md': ['var(--t-mono-md)', { lineHeight: '1.5', letterSpacing: 'var(--track-mono-md)' }],
        kicker:    ['var(--t-kicker)',  { lineHeight: '1.4', letterSpacing: 'var(--track-kicker)' }],
      },

      /* ═══════════════════════════════════════════
         LETTER SPACING — tokens doc §"Labels & Mono",
         §"Heading Hierarchy", §"Quick Reference — Minimums".
         `tight`/`tighter` intentionally shadow Tailwind's defaults
         (-0.025em / -0.05em) so utilities match the heading base styles.
         `label` is the WCAG 1.4.12 floor for uppercase text.
         ═══════════════════════════════════════════ */
      letterSpacing: {
        tighter: 'var(--track-tighter)',
        tight:   'var(--track-tight)',
        flat:    'var(--track-flat)',
        'mono-md': 'var(--track-mono-md)',
        mono:    'var(--track-mono)',
        label:   'var(--track-label)',
        kicker:  'var(--track-kicker)',
      },

      /* ═══════════════════════════════════════════
         SPACING — Bay Hardware Scale §18, §4
         ═══════════════════════════════════════════ */
      spacing: {
        pin:       'var(--pin)',
        rivet:     'var(--rivet)',
        bolt:      'var(--bolt)',
        gauge:     'var(--gauge)',
        panel:     'var(--panel)',
        bay:       'var(--bay)',
        stall:     'var(--stall)',
        deck:      'var(--deck)',
        hangar:    'var(--hangar)',
        perimeter: 'var(--perimeter)',
      },

      /* ═══════════════════════════════════════════
         BORDER RADIUS — tokens doc §"Border Radius"
         The scale tops out at r-lg (12px) + r-full. The old 2xl/3xl
         legacy radii were off-system and have been removed.
         ═══════════════════════════════════════════ */
      borderRadius: {
        DEFAULT: 'var(--r-sm)',
        none: 'var(--r-none)',
        sm:   'var(--r-sm)',
        md:   'var(--r-md)',
        lg:   'var(--r-lg)',
        full: 'var(--r-full)',
      },

      /* ═══════════════════════════════════════════
         BORDER WIDTH — tokens doc §"Border Width Tokens"
         ═══════════════════════════════════════════ */
      borderWidth: {
        DEFAULT: 'var(--bw-thin)',
        none:   'var(--bw-none)',
        thin:   'var(--bw-thin)',
        medium: 'var(--bw-medium)',
        thick:  'var(--bw-thick)',
        heavy:  'var(--bw-heavy)',
      },

      /* ═══════════════════════════════════════════
         Z-INDEX — tokens doc §"Z-Index Scale"
         ═══════════════════════════════════════════ */
      zIndex: {
        base:     'var(--z-base)',
        raised:   'var(--z-raised)',
        dropdown: 'var(--z-dropdown)',
        sticky:   'var(--z-sticky)',
        overlay:  'var(--z-overlay)',
        modal:    'var(--z-modal)',
        toast:    'var(--z-toast)',
        tooltip:  'var(--z-tooltip)',
      },

      /* ═══════════════════════════════════════════
         OPACITY — tokens doc §"Opacity Tokens"
         ═══════════════════════════════════════════ */
      opacity: {
        disabled: 'var(--o-disabled)',
        faint:    'var(--o-faint)',
        muted:    'var(--o-muted)',
        overlay:  'var(--o-overlay)',
        hover:    'var(--o-hover)',
      },

      /* ═══════════════════════════════════════════
         TOUCH TARGETS — tokens doc §"Touch Target Tokens"
         ═══════════════════════════════════════════ */
      minWidth: {
        'touch-sm': 'var(--touch-sm)',
        touch:      'var(--touch-md)',
        'touch-lg': 'var(--touch-lg)',
        'touch-xl': 'var(--touch-xl)',
      },

      minHeight: {
        'touch-sm': 'var(--touch-sm)',
        touch:      'var(--touch-md)',
        'touch-lg': 'var(--touch-lg)',
        'touch-xl': 'var(--touch-xl)',
      },

      /* ═══════════════════════════════════════════
         TRANSITION TIMING — Design Spec §18, §7
         ═══════════════════════════════════════════ */
      transitionTimingFunction: {
        default: 'var(--ease)',
        spring:  'var(--ease-spring)',
      },

      transitionDuration: {
        fast: 'var(--d-fast)',
        base: 'var(--d-base)',
        slow: 'var(--d-slow)',
      },

      /* ═══════════════════════════════════════════
         BOX SHADOW — Design Spec §18, §6
         ═══════════════════════════════════════════ */
      boxShadow: {
        sm:  'var(--shadow-sm)',
        md:  'var(--shadow-md)',
        lg:  'var(--shadow-lg)',
        red: 'var(--shadow-red)',
      },

      /* ═══════════════════════════════════════════
         MAX WIDTH — tokens doc §"Container Tokens"
         ═══════════════════════════════════════════ */
      maxWidth: {
        container:      'var(--container-max-w)',
        'container-xs': 'var(--container-xs)',
        'container-sm': 'var(--container-sm)',
        'container-md': 'var(--container-md)',
        'container-lg': 'var(--container-lg)',
        'container-xl': 'var(--container-xl)',
      },
    },
  },
  plugins: [],
};

export default config;
