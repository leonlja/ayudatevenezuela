import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ve: {
          yellow: "#FFD100",
          blue: "#0033A0",
          red: "#CF142B",
        },
      },
    },
  },
  plugins: [],
};

export default config;

// authored-by: gpt-5.3-codex
