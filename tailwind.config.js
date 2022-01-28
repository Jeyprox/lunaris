module.exports = {
  content: ["./public/**/*.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      blur: {
        xs: "1px",
      },
      fontSize: {
        dynamicTitle: "clamp(2.25rem, 7.5vw, 6rem)",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
