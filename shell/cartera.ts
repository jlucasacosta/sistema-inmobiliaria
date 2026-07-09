// cartera.ts · El vocabulario de estado de Nexo, en un solo lugar.
// Estado de propiedad, temperatura del lead, etapa del pipeline y antiguedad en
// cartera se traducen a CLASES literales (Tailwind no ve `bg-${x}`). Los umbrales
// y probabilidades viven en theme. Ningun componente inventa un numero ni un hex.
import { theme } from "./theme"

// --- Estado de una propiedad -------------------------------------------------
export type EstadoProp = "disponible" | "reservada" | "vendida"

// Relleno del price-pin en el Mapa de Cartera: verde / terracota / gris.
export const pinDeProp: Record<EstadoProp, string> = {
  disponible: "bg-primary text-bg border-primary",
  reservada: "bg-accent text-bg border-accent",
  vendida: "bg-muted text-bg border-muted",
}
// Badge cuadrado de estado en cards y tablas.
export const chipDeProp: Record<EstadoProp, string> = {
  disponible: "bg-success/15 text-success",
  reservada: "bg-accent/15 text-accent",
  vendida: "bg-muted/20 text-muted",
}
// Punto de color para leyendas.
export const puntoDeProp: Record<EstadoProp, string> = {
  disponible: "bg-primary",
  reservada: "bg-accent",
  vendida: "bg-muted",
}

// --- Temperatura del lead ----------------------------------------------------
export type EstadoLead = "nuevo" | "caliente" | "frio"

export const chipDeLead: Record<EstadoLead, string> = {
  nuevo: "bg-info/15 text-info",
  caliente: "bg-accent/15 text-accent",
  frio: "bg-muted/20 text-muted",
}
// Barra lateral del ticket: lo que el corredor mira de reojo.
export const barraDeLead: Record<EstadoLead, string> = {
  nuevo: "bg-info",
  caliente: "bg-accent",
  frio: "bg-muted",
}
export const textoDeLead: Record<EstadoLead, string> = {
  nuevo: "text-info",
  caliente: "text-accent",
  frio: "text-muted",
}

// --- Etapa del pipeline ------------------------------------------------------
export type Etapa = "contacto" | "visita" | "propuesta" | "reserva" | "cierre" | "perdida"

export const ordenEtapas: Etapa[] = ["contacto", "visita", "propuesta", "reserva", "cierre"]

export const chipDeEtapa: Record<Etapa, string> = {
  contacto: "bg-info/15 text-info",
  visita: "bg-primary/15 text-primary",
  propuesta: "bg-warning/15 text-warning",
  reserva: "bg-accent/15 text-accent",
  cierre: "bg-success/15 text-success",
  perdida: "bg-danger/15 text-danger",
}
export const rellenoDeEtapa: Record<Etapa, string> = {
  contacto: "bg-info",
  visita: "bg-primary",
  propuesta: "bg-warning",
  reserva: "bg-accent",
  cierre: "bg-success",
  perdida: "bg-danger",
}
// La probabilidad de cierre sale del theme, no de un numero magico en el componente.
export function probabilidad(etapa: Etapa): number {
  return theme.probabilidad[etapa]
}

// --- Resultado de una llamada ------------------------------------------------
export type Resultado = "agendada" | "interesado" | "sin respuesta" | "descartado"

export const chipDeResultado: Record<Resultado, string> = {
  agendada: "bg-success/15 text-success",
  interesado: "bg-primary/15 text-primary",
  "sin respuesta": "bg-warning/15 text-warning",
  descartado: "bg-danger/15 text-danger",
}
export const puntoDeResultado: Record<Resultado, string> = {
  agendada: "bg-success",
  interesado: "bg-primary",
  "sin respuesta": "bg-warning",
  descartado: "bg-danger",
}

// --- Antiguedad en cartera ---------------------------------------------------
export type Temperatura = "fresca" | "tibia" | "fria"

// Los umbrales viven en theme.cartera: cambiar `fria: 45` recolorea toda la cartera.
export function temperaturaCartera(dias: number): Temperatura {
  if (dias >= theme.cartera.fria) return "fria"
  if (dias >= theme.cartera.tibia) return "tibia"
  return "fresca"
}
export const chipDeTemperatura: Record<Temperatura, string> = {
  fresca: "bg-success/15 text-success",
  tibia: "bg-warning/15 text-warning",
  fria: "bg-danger/15 text-danger",
}

// --- Formato de precio (voz de tasacion) -------------------------------------
// "U$S 340k" compacto para pins; "U$S 340.000" largo para el hero.
export function precioCompacto(usd: number): string {
  if (usd >= 1_000_000) return `U$S ${(usd / 1_000_000).toFixed(usd % 1_000_000 === 0 ? 0 : 1)}M`
  return `U$S ${Math.round(usd / 1000)}k`
}
export function precioLargo(usd: number): string {
  return `U$S ${usd.toLocaleString("es-UY")}`
}
