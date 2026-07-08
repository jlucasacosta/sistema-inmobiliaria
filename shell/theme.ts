// theme.ts · Nexo Propiedades (sistema inmobiliaria)
// LA PALANCA DE DISEÑO. Nada se hardcodea: todo lee de aca.

export type Theme = {
  brand: { name: string; logo?: string }
  colors: {
    primary: string
    accent: string
    bg: string
    surface: string
    fg: string
    muted: string
    border: string
  }
  font: { heading: string; body: string }
  radius: "sharp" | "soft" | "round"
  density: "compact" | "comfortable"
}

export const nexo: Theme = {
  brand: { name: "Nexo Propiedades" },
  colors: {
    primary: "#16324f",
    accent: "#c98a3a",
    bg: "#ffffff",
    surface: "#f6f7f9",
    fg: "#12212f",
    muted: "#64748b",
    border: "#e3e7ec",
  },
  font: { heading: "Georgia", body: "Inter" },
  radius: "soft",
  density: "comfortable",
}

export const theme: Theme = nexo
