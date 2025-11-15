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
        pastel: {
          pink: "var(--pastel-pink)",
          mint: "var(--pastel-mint)",
          peach: "var(--pastel-peach)",
          lavender: "var(--pastel-lavender)",
        },
      },
    },
  },
  plugins: [],
};
export default config;
