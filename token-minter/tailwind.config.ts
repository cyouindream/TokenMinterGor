import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        christmas: {
          red: "var(--christmas-red)",
          green: "var(--christmas-green)",
          gold: "var(--christmas-gold)",
          snow: "var(--snow-white)",
        },
      },
    },
  },
  plugins: [],
};
export default config;
