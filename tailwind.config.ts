import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#0F2A4A",
          ink: "#1A1A1A",
          paper: "#FAF7F2",
          cream: "#F2EDE4",
          rule: "#E5DFD4",
          accent: "#D94F2D",
          green: "#2F6F4E",
        },
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica", "Arial"],
        display: ["ui-serif", "Georgia", "Cambria", "Times New Roman", "serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(15,42,74,0.06), 0 4px 12px rgba(15,42,74,0.06)",
        cardHover: "0 2px 6px rgba(15,42,74,0.10), 0 12px 30px rgba(15,42,74,0.10)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
