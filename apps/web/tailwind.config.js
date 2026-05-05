/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#04120a',
          950: '#020c07',
        },
        brand: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#145231',
          950: '#0a3d1a',
        },
        gold: {
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        field: {
          light: '#1f7e39',
          DEFAULT: '#0f5c2a',
          dark: '#08472a',
          line: '#ffffff',
        },
      },
      boxShadow: {
        'glow-gold': '0 0 20px rgba(251, 191, 36, 0.3)',
        'glow-brand': '0 0 20px rgba(22, 163, 74, 0.2)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'field-pattern': 'linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px)',
      },
      backgroundSize: {
        'field-pattern': '20px 20px',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
