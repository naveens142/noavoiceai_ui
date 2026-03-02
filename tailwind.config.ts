import type { Config } from "tailwindcss"

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#00F5FF",
        neon: "#8B5CF6",
        darkbg: "#0B0F19"
      }
    },
  },
  plugins: [],
} satisfies Config