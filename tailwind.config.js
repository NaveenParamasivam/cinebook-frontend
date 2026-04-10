/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans:  ['"Plus Jakarta Sans"', 'sans-serif'],
        mono:  ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        // Cream palette
        cream: {
          DEFAULT: '#F5F0E8',
          50:  '#FDFCF9',
          100: '#F5F0E8',
          200: '#EDE4D0',
          300: '#DDD1B8',
        },
        // Charcoal palette
        charcoal: {
          DEFAULT: '#1C1917',
          800: '#292524',
          700: '#3C3836',
          600: '#57534E',
          500: '#78716C',
        },
        // Wine / burgundy
        wine: {
          DEFAULT: '#8B1A2B',
          light:   '#A82030',
          dark:    '#6B1421',
          muted:   '#C4455A',
        },
        // Gold
        gold: {
          DEFAULT: '#C9973A',
          light:   '#DBA84D',
          pale:    '#F2DFA8',
        },
        // Sage green
        sage: {
          DEFAULT: '#4A6741',
          light:   '#5C8054',
        },
        // Pure ink black
        ink: '#0F0D0C',
      },
      animation: {
        'fade-up':  'fadeUp 0.5s ease both',
        'fade-in':  'fadeIn 0.4s ease both',
        'shimmer':  'shimmer 2s linear infinite',
        'marquee':  'marquee 40s linear infinite',
      },
      keyframes: {
        fadeUp:  { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeIn:  { from: { opacity: '0' }, to: { opacity: '1' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
      },
      boxShadow: {
        'card':    '0 2px 16px rgba(28,25,23,0.08), 0 1px 4px rgba(28,25,23,0.04)',
        'card-lg': '0 8px 40px rgba(28,25,23,0.12), 0 2px 8px rgba(28,25,23,0.06)',
        'wine':    '0 4px 20px rgba(139,26,43,0.25)',
        'lift':    '0 16px 48px rgba(28,25,23,0.14)',
      },
    },
  },
  plugins: [],
}
