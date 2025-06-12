/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        roboto: ['var(--font-roboto-condensed)'], // ✅ nombre personalizado
      },
    },
  },
  plugins: [],
}
