import type { Config } from 'tailwindcss';

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
         COLORS — Design Spec §18
         All mapped to CSS custom properties.
         ═══════════════════════════════════════════ */
      colors: {
        bg:             'var(--bg)',
        surface:        'var(--surface)',
        surface2:       'var(--surface-2)',
        'surface-dark':   'var(--surface-dark)',
        'surface-dark-2': 'var(--surface-dark-2)',
        border:         'var(--rule)',
        fg:             'var(--ink)',
        'fg-soft':      'var(--ink-soft)',
        'fg-faint':     'var(--ink-faint)',
        muted:          'var(--muted)',
        accent:         'var(--accent)',
        'accent-deep':  'var(--accent-deep)',
        'accent-mid':   'var(--accent-mid)',
        'accent-soft':  'var(--accent-soft)',
        'accent-light': 'var(--accent-light)',
        cta:            'var(--cta-bg)',
        'cta-fg':       'var(--cta-fg)',
        trust:          'var(--trust-bg)',
        'trust-border': 'var(--trust-border)',
        'trust-star':   'var(--trust-star)',
        urgency:        'var(--urgency)',
        success:        'var(--success)',
        warning:        'var(--warning)',
        danger:         'var(--danger)',
        info:           'var(--info)',
        /* Legacy aliases — preserve for existing page compat */
        dac: {
          red:        '#E80505',
          'red-light':'#B30404',
          'red-med':  '#980404',
          'red-dark': '#740404',
          ink:        '#0A0A0A',
          black:      '#000000',
          white:      '#FFFFFF',
          muted:      '#B0B0B0',
          faint:      '#6E6E6E',
        },
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
         FONT SIZE — Design Spec §18, §3
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
         BORDER RADIUS — Design Spec §18, §5
         ═══════════════════════════════════════════ */
      borderRadius: {
        none: 'var(--r-none)',
        sm:   'var(--r-sm)',
        md:   'var(--r-md)',
        lg:   'var(--r-lg)',
        full: 'var(--r-full)',
        /* Keep 2xl/3xl for legacy compat */
        '2xl': '1rem',
        '3xl': '1.5rem',
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
         MAX WIDTH — Design Spec §18, §9
         ═══════════════════════════════════════════ */
      maxWidth: {
        container: 'var(--container-max-w)',
      },
    },
  },
  plugins: [],
};

export default config;
