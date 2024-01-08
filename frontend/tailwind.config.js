/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    fontFamily: {
      jetbrains: ['JetBrains Mono', 'monospace'],
      poppins: ['Poppins', 'sans-serif'],
      inter: ['Inter', 'sans-serif'],
      ibm: ['IBM Plex Sans', 'sans-serif'],
    },
    extend: {},
  },
  plugins: [],
}

