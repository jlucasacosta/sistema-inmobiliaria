import type { Config } from "tailwindcss"

// Los colores NO son valores fijos: apuntan a variables CSS que inyecta el theme.
// Por eso cambiar shell/theme.ts re-tematiza todo sin tocar un solo componente.
export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./modules/**/*.{ts,tsx}",
    "./shell/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        accent: "var(--accent)",
        bg: "var(--bg)",
        surface: "var(--surface)",
        fg: "var(--fg)",
        muted: "var(--muted)",
        border: "var(--border)",
      },
      borderRadius: { DEFAULT: "var(--radius)" },
      fontFamily: {
        heading: "var(--font-heading)",
        body: "var(--font-body)",
      },
    },
  },
  plugins: [],
} satisfies Config
