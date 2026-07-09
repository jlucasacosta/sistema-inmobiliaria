// theme.ts · Nexo Propiedades (sistema inmobiliaria)
// LA PALANCA DE DISEÑO. Nada se hardcodea: todo lee de aca.
// Modo CLARO: SaaS inmobiliario, azul confianza + cian dato.

export type Theme = {
  brand: { name: string; logo?: string }
  mode: "light" | "dark"
  colors: {
    primary: string
    accent: string
    bg: string
    surface: string
    fg: string
    muted: string
    border: string
    subtle: string
    // Semanticos: estados, badges, metricas. LOS CUATRO, SIEMPRE.
    success: string
    warning: string
    danger: string
    info: string
  }
  font: { heading: string; body: string }
  radius: "sharp" | "soft" | "round"
  density: "comfortable" | "compact"
}

export const nexo: Theme = {
  brand: { name: "Nexo Propiedades" },
  mode: "light",
  colors: {
    primary: "#1d4ed8",
    accent: "#06b6d4",
    bg: "#f7f9fc",
    surface: "#ffffff",
    fg: "#0f1e35",
    muted: "#64748b",
    border: "#e3e8ef",
    subtle: "#eef2f7",
    success: "#16a34a",
    warning: "#d97706",
    danger: "#dc2626",
    info: "#0284c7",
  },
  font: { heading: "Inter", body: "Inter" },
  radius: "soft",
  density: "comfortable",
}

export const theme: Theme = nexo
