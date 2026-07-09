// theme.ts · Nexo Propiedades (sistema inmobiliaria)
// LA PALANCA DE DISENO. Nada se hardcodea: todo lee de aca.
// Ficha de Diseno: ver DISENO.md. Cliche rechazado: el azul-marino-con-dorado
// "premium", el sidebar celeste tipo portal (Zillow/Idealista), la casita en todo.
// Esto es la MESA DE OPERACIONES del corredor: un cuaderno de tasaciones con luz de
// oficina. Verde-pino (terreno, valor, patrimonio) + terracota (ladrillo, tierra).

export type Theme = {
  brand: { name: string; logo?: string }
  mode: "light" | "dark"
  nav: "sidebar" | "topbar" | "rail"
  elevation: "raised" | "outlined" | "flat"
  badge: "pill" | "square"
  radius: "sharp" | "soft" | "round"
  density: "compact" | "comfortable"
  font: { heading: string; body: string }
  colors: {
    primary: string
    accent: string
    bg: string
    surface: string
    fg: string
    muted: string
    border: string
    subtle: string
    success: string
    warning: string
    danger: string
    info: string
  }
  // Constantes de DOMINIO inmobiliario. Son diseno, no logica suelta.
  // Ningun componente inventa un numero magico ni escribe un hex: pide la clase.
  cartera: {
    tibia: number // dias en cartera sin cerrar antes de considerarse "tibia"
    fria: number // dias antes de "fria"
  }
  // Probabilidad de cierre por etapa del pipeline (0-1). El embudo real.
  probabilidad: {
    contacto: number
    visita: number
    propuesta: number
    reserva: number
    cierre: number
    perdida: number
  }
  // Metas del mes: la barra-metas se llena contra estos objetivos absolutos.
  meta: {
    cierres: number // unidades a cerrar en el mes
    captaciones: number // propiedades nuevas a captar
    comision: number // U$S de comision proyectada objetivo
  }
}

export const nexo: Theme = {
  brand: { name: "Nexo Propiedades" },
  mode: "light",
  nav: "sidebar",
  elevation: "outlined",
  badge: "square",
  radius: "sharp",
  density: "compact",
  font: { heading: "Fraunces", body: "Inter" },
  colors: {
    primary: "#1F5A3D", // verde-pino profundo: terreno, valor, patrimonio (>7:1 sobre blanco)
    accent: "#C6603F", // terracota: ladrillo, tierra; calienta la grilla, marca CTA
    bg: "#F6F5F1", // hueso-papel: cuaderno de tasaciones, no blanco frio
    surface: "#FFFFFF",
    fg: "#1C2620", // verde-tinta casi negro
    muted: "#6B7A72", // verde-gris apagado
    border: "#E1E2DB", // linea fina de 1px
    subtle: "#EDEDE6", // relleno de zebra / hover
    success: "#2F7D53", // disponible / cierre bueno (verde vivo)
    warning: "#B7791F", // ocre: por vencer / a seguir
    danger: "#B23A2E", // rojo-ladrillo quemado: perdida / rechazo
    info: "#2C6E8F", // azul-pizarra sobrio: nuevo lead
  },
  cartera: { tibia: 21, fria: 45 },
  probabilidad: {
    contacto: 0.15,
    visita: 0.35,
    propuesta: 0.55,
    reserva: 0.8,
    cierre: 1,
    perdida: 0,
  },
  meta: { cierres: 8, captaciones: 12, comision: 42000 },
}

export const theme: Theme = nexo
