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
          DEFAULT: '#8e8279',
          dark: '#5a4a42',
          light: '#f5f3f1',
          muted: '#a89e94',
        },
      },
    },
  },
  plugins: [],
}
