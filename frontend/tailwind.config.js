/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00AEEF',     // Cyan-blue (from logo)
        secondary: '#5C5ACB',   // Indigo-purple (from logo)
        accent: '#3F8CFF',      // Bright blue accent
        light: '#F4F6F8',       // Light background
        dark: '#0F172A',        // Dark text color
      },
      backgroundImage: {
        'logo-gradient': 'linear-gradient(135deg, #00AEEF, #5C5ACB)',
      },
      boxShadow: {
        'soft': '0 4px 12px rgba(92, 90, 203, 0.2)',
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
