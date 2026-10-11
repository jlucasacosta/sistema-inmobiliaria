// PATRON MOCK. Misma firma que la query real. Ver BACKEND.md.
// Arquetipo: galeria (masonry). El dato sigue al arquetipo: cada propiedad trae
// precio hero, m2/dorm/banos, estado y COORDENADAS (x,y) para el Mapa de Cartera.
// Marca ficticia Nexo Propiedades, mercado Montevideo / Punta del Este (LATAM).
import type { EstadoProp } from "@/shell/cartera"
import raw from "./data.json"

export type TipoProp = "apartamento" | "casa" | "ph" | "terreno" | "local"

export type Propiedad = {
  id: string
  titulo: string
  zona: string
  tipo: TipoProp
  precio: number // U$S (valor de venta)
  m2: number
  dorm: number
  banos: number
  cochera: boolean
  estado: EstadoProp
  diasEnCartera: number
  destacada: boolean
  x: number // 0-100, posicion en el Mapa de Cartera
  y: number // 0-100
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function getPropiedades(): Promise<Propiedad[]> {
  await sleep(300)
  return structuredClone(raw.propiedades) as Propiedad[]
}
