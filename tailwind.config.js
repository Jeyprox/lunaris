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
      dropShadow: {
        dark: "0 0 2px rgba(0, 0, 0, 1)",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
