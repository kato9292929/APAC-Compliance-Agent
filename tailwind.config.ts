import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0a0a0a",
        card: "#111111",
        border: "#1f1f1f",
        primary: "#ffffff",
        secondary: "#888888",
        blue: {
          DEFAULT: "#3b82f6",
          hover: "#2563eb",
        },
        green: "#00ff87",
        red: "#ff4444",
        gold: "#d4af37",
      },
      fontFamily: {
        mono: ["var(--font-geist-mono)", "monospace"],
      },
    },
  },
};

export default config;
