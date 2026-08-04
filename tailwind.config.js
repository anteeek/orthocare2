/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          DEFAULT: '#968981',
          dark: '#5c4f47',
          light: '#f0ebe8',
          muted: '#8f8882',
          heading: '#584b43',
        },
      },
    },
  },
  plugins: [],
}
