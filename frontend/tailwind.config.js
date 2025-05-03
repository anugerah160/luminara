// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#DADADA",
        lightGray: "#F4F4F4",
        orangeMain: "#FFA552",
        chipBorder: "#E5E5E5",
        textGray: "#333333",
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/typography'),
  ],
}
