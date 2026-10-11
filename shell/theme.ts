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
    accent: "#A64E31", // terracota: ladrillo, tierra; calienta la grilla, marca CTA (era #C6603F: 4.08:1; ahora >=4.5:1 sobre surface, bg y chips)
    bg: "#F6F5F1", // hueso-papel: cuaderno de tasaciones, no blanco frio
    surface: "#FFFFFF",
    fg: "#1C2620", // verde-tinta casi negro
    muted: "#616E67", // verde-gris apagado (era #6B7A72: 4.14:1 sobre bg y 3.84:1 sobre subtle; ahora >=4.5:1)
    border: "#E1E2DB", // linea fina de 1px
    subtle: "#EDEDE6", // relleno de zebra / hover
    success: "#2C754E", // disponible / cierre bueno (era #2F7D53: chip 4.12:1; ahora >=4.5:1)
    warning: "#8F5E18", // ocre oscuro: por vencer / a seguir (era #B7791F: 3.64:1; ahora >=4.5:1)
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
