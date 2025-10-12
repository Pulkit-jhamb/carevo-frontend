/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-card': '#1a1d2e',
        'dark-bg': '#0f1117',
        'dark-border': '#2a2d3a',
      },
    },
  },
  plugins: [],
}