// theme.ts · Nexo Propiedades (sistema inmobiliaria)
// LA PALANCA DE DISEÑO. Nada se hardcodea: todo lee de aca.
// Lenguaje visual: tech / SaaS (elevacion, radio, aire). Marca: navy + ocre.

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
    subtle: string
  }
  font: { heading: string; body: string }
  radius: "sharp" | "soft" | "round"
  density: "comfortable" | "compact"
}

export const nexo: Theme = {
  brand: { name: "Nexo Propiedades" },
  colors: {
    primary: "#16324f",
    accent: "#c98a3a",
    bg: "#f7f9fc",
    surface: "#ffffff",
    fg: "#12212f",
    muted: "#64748b",
    border: "#e6eaf0",
    subtle: "#eef2f7",
  },
  font: { heading: "Inter", body: "Inter" },
  radius: "soft",
  density: "comfortable",
}

export const theme: Theme = nexo
