/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#F1FBFB",
          300: "#CEF1F1",
          500: "#86CED8",
          700: "#35AEBE",
          900: "#098292",
        },
        warning: {
          100: "#FFF4E4",
          500: "#D9CA7B",
          900: "#9E8E00",
        },
        error: {
          100: "#FFEEEF",
          500: "#F55C67",
          900: "#DD224F",
        },
        gray: {
          100: "#F3F5F7",
          200: "#E2E5E7",
          300: "#D4D7DD",
          400: "#CBCBCF",
          500: "#ABAFB5",
          600: "#989DA5",
          700: "#747A81",
          800: "#5A5F62",
          900: "#1F2324",
        },
      },
      fontFamily: {
        roboto: ["Roboto"],
        "roboto-bold": ["RobotoBold"],
        "roboto-italic": ["RobotoItalic"],
        "roboto-bold-italic": ["RobotoBoldItalic"],
        dm: ["DMSans"],
        "dm-bold": ["DMSansBold"],
        caveat: ["Caveat"],
      },
    },
  },
  plugins: [],
};
