import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        purple: {
          950: "#170b28",
          900: "#231239",
          800: "#391c5c",
          700: "#4f2980",
        },
        emerald: {
          950: "#051d15",
          900: "#0a3226",
          800: "#0f4736",
          700: "#166049",
        },
        cobalt: {
          950: "#060f28",
          900: "#0a1a42",
          800: "#102a66",
          700: "#1c4fb0",
        },
        gold: {
          100: "#fdf3d0",
          200: "#f9e29b",
          300: "#f3d266",
          400: "#eabe3a",
          500: "#d9a51f",
          600: "#b3821a",
          700: "#8a6314",
        },
        ink: {
          950: "#120b1d",
          900: "#0d1a15",
          800: "#1e1630",
          700: "#2a2140",
        },
        bone: "#f4efe4",
      },
      fontFamily: {
        display: ["var(--font-brand)", "sans-serif"],
        sans: ["var(--font-sans)", "sans-serif"],
        brand: ["var(--font-brand)", "sans-serif"],
      },
      backgroundImage: {
        "gold-metal": "linear-gradient(165deg, #b3821a 0%, #eabe3a 55%, #d9a51f 100%)",
        "gold-line": "linear-gradient(90deg, transparent, #f3d266, #eabe3a, #f3d266, transparent)",
      },
      letterSpacing: {
        widest2: "0.35em",
      },
      transitionTimingFunction: {
        luxe: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};
export default config;
