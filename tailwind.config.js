/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      spacing: {
        '15': '3.75rem',
        '18': '4.5rem',
        '30': '7.5rem',
      },
    },
  },
  plugins: [],
};
