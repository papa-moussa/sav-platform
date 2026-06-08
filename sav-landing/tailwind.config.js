/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['"Inter"', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Inter Tight"', '"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      colors: {
        ink: {
          DEFAULT: '#0A0A0B',
          soft:    '#27272A',
          mid:     '#52525B',
          muted:   '#71717A',
          subtle:  '#A1A1AA',
        },
        primary: {
          50:  '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
        },
      },
      boxShadow: {
        'xs':       '0 1px 2px rgba(10,10,11,0.04)',
        'subtle':   '0 1px 2px rgba(10,10,11,0.04), 0 1px 3px rgba(10,10,11,0.04)',
        'card':     '0 4px 12px -2px rgba(10,10,11,0.06), 0 2px 4px -1px rgba(10,10,11,0.04)',
        'lifted':   '0 16px 32px -8px rgba(10,10,11,0.08), 0 4px 8px -2px rgba(10,10,11,0.04)',
        'elevated': '0 24px 48px -12px rgba(10,10,11,0.12), 0 8px 16px -4px rgba(10,10,11,0.06)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.55s ease-out forwards',
        'fade-in':    'fadeIn 0.45s ease-out forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
