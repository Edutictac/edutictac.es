/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./privacitat.html",
    "./galetes.html",
    "./termes.html",
    "./commons.html",
    "./instala-commons.html",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
    },
  },
};
