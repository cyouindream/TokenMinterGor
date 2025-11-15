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
        "background-secondary": "var(--background-secondary)",
        foreground: "var(--foreground)",
        "foreground-muted": "var(--foreground-muted)",
        "accent-lime": "var(--accent-lime)",
        "accent-lime-bright": "var(--accent-lime-bright)",
        "dark-green": "var(--dark-green)",
        "dark-green-secondary": "var(--dark-green-secondary)",
        "dark-green-transparent": "var(--dark-green-transparent)",
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'glow': 'glow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
export default config;
