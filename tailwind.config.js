/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        darkbg: '#0A0A0A',
        darkbox: '#111111',
        lightbg: '#F8FAFC',
        lightbox: '#FFFFFF',
      }
    },
  },
  plugins: [],
}

