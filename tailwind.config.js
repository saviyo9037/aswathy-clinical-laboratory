/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      colors: {
        navy: { 900: '#0b1f3a', 800: '#102a4c', 700: '#17375f', 600: '#1f4678' },
        brand: { 50: '#eff7ff', 100: '#dbeeff', 200: '#bfe0ff', 500: '#2f8df5', 600: '#1a74e0', 700: '#175fb8' },
      },
      boxShadow: { card: '0 1px 2px rgba(16,42,76,.05), 0 4px 16px rgba(16,42,76,.06)' },
    },
  },
  plugins: [],
};
