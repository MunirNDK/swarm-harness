import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dac: {
          red: '#E80505',
          'red-light': '#B30404',
          'red-med': '#980404',
          'red-dark': '#740404',
          ink: '#0A0A0A',
          black: '#000000',
          white: '#FFFFFF',
          muted: '#A1A1AA',
          faint: '#7C7C7C',
        },
      },
      fontFamily: {
        heading: ['var(--font-sora)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
      },
      borderRadius: {
        '3xl': '1.5rem',
        full: '9999px',
        xl: '0.75rem',
      },
      maxWidth: {
        '7xl': '80rem',
      },
      backdropBlur: {
        xl: '20px',
      },
      letterSpacing: {
        tight: '-0.02em',
      },
    },
  },
  plugins: [],
};

export default config;
