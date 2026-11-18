/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      colors: {
        navy: { 900: '#0c2447', 800: '#12305e', 700: '#1a4283', 600: '#2255a3' },
        brand: { 50: '#eef5fc', 100: '#d9e8f8', 200: '#b3d0f0', 500: '#3b7fcf', 600: '#2b6cbe', 700: '#235a9f' },
        lab: { green: '#3d6e34', greenSoft: '#eaf3e8', red: '#c44a40', redSoft: '#fbebe9' },
      },
      boxShadow: { card: '0 1px 2px rgba(16,42,76,.05), 0 4px 16px rgba(16,42,76,.06)' },
    },
  },
  plugins: [],
};
