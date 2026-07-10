import type { Config } from "tailwindcss";

const config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        arabic: [
          "IBM Plex Sans Arabic",
          "Noto Sans Arabic",
          "Cairo",
          "Tajawal",
          "Segoe UI",
          "Arial",
          "sans-serif"
        ]
      },
      boxShadow: {
        soft: "0 18px 55px rgba(15, 23, 42, 0.08)",
        premium: "0 28px 90px rgba(15, 23, 42, 0.12)",
        brand: "0 18px 42px rgba(20, 184, 166, 0.22), 0 10px 24px rgba(37, 99, 235, 0.14)",
        glow: "0 14px 35px rgba(20, 184, 166, 0.18), 0 8px 22px rgba(59, 130, 246, 0.12)",
        "glow-lg": "0 18px 48px rgba(20, 184, 166, 0.24), 0 12px 32px rgba(59, 130, 246, 0.16)",
        "inner-soft": "inset 0 1px 0 rgba(255,255,255,0.72)"
      },
      screens: {
        xs: "390px",
        "3xl": "1800px"
      }
    }
  },
  plugins: []
} satisfies Config;

export default config;
