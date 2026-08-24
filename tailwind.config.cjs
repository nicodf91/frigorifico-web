/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./pages/**/*.{ts,tsx}", "./services/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          black: "#0c0a09",
          dark: "#1c1917",
          gray: "#292524",
          gold: "#d97706",
          goldLight: "#f59e0b",
          light: "#f5f5f4",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        serif: ["Playfair Display", "serif"],
      },
    },
  },
  plugins: [],
};
