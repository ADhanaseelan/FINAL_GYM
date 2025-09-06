/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",                   // Vite entry point
    "./src/**/*.{js,ts,jsx,tsx}",     // React files
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        days: ['"Days One"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
