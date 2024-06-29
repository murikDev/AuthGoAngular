/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
        fontFamily: {
            main: ["Sintony"],
            second: ["Poppins"],
        },
    },
  },
  plugins: [],
}

