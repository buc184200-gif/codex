import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./store/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#090909",
        coal: "#171717",
        smoke: "#2d2c2a",
        bone: "#f7f3eb",
        linen: "#ede4d3",
        sand: "#c7aa73",
        gilt: "#a98745"
      },
      boxShadow: {
        glow: "0 0 32px rgba(199, 170, 115, 0.22)",
        soft: "0 24px 80px rgba(0, 0, 0, 0.16)"
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.22, 1, 0.36, 1)"
      }
    }
  },
  plugins: []
};

export default config;
