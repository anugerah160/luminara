// tailwind.config.js
module.exports = {
  content: [
    "./resources/views/app.blade.php",
    "./resources/js/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite-react/lib/esm/**/*.js",
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
    // require('flowbite/plugin'),
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/typography'),
  ],
}
