import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FDFCFA",
        surface: "#FFFFFF",
        charcoal: {
          950: "#0D0D0D",
          900: "#161616",
          800: "#222222",
          700: "#383838",
          600: "#555555",
          400: "#999999",
          300: "#C4C4C2",
          200: "#E6E6E3",
          100: "#F2F2EF",
          50: "#F9F9F7",
        },
        pastel: {
          sage: "#DCE5DF",
          sand: "#EBE5DC",
          butter: "#FFF3E5",
          rose: "#FFE9E3",
          ice: "#E4EFF4",
          olive: "#C8D1C5",
        },
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "Roboto", "Helvetica", "Arial", "sans-serif"],
      },
      letterSpacing: {
        widest: "0.22em",
        editorial: "0.14em",
      },
      aspectRatio: {
        "fashion-portrait": "3 / 4",
      },
    },
  },
  plugins: [],
};

export default config;
