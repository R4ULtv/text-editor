/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "selector",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      transitionTimingFunction: {
        "out-bounce": "cubic-bezier(0.34,1.56,0.64,1)",
      },
      colors: {
        gemini: {
          blue: "#5684D1",
          purple: "#9168C0",
          "blue-light": "#1BA1E3",
        },
      },
      backgroundImage: ({ theme }) => ({
        gemini: `linear-gradient(to bottom right, #9168C0, #5684D1, #1BA1E3)`,
      }),
      typography: {
        DEFAULT: {
          css: {
            "code::before": false,
            "code::after": false,
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("tailwindcss-animate")],
  variants: {
    scrollbar: ["rounded"],
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("tailwindcss-animate"),
    function ({ addUtilities }) {
      addUtilities({
        ".no-scrollbar::-webkit-scrollbar": {
          display: "none",
        },
        ".no-scrollbar": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        },
      });
    },
  ],
};
