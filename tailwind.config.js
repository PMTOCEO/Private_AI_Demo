/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      keyframes: {
        glow: {
          '0%, 100%': { opacity: 0.6 },
          '50%': { opacity: 0.2 }
        }
      },
      animation: {
        glow: 'glow 2s ease-in-out infinite'
      }
    },
  },
  plugins: [],
};