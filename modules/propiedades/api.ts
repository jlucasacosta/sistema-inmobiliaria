// PATRON MOCK. Misma firma que la query real. Ver BACKEND.md.
// Arquetipo: tabla de CRM (lista ordenable y filtrable). Cada propiedad trae precio,
// m2/dorm/banos, estado y dias en cartera: lo que el corredor compara fila a fila.
// Marca ficticia Nexo Propiedades, mercado Montevideo / Punta del Este (LATAM).
import type { EstadoProp } from "@/shell/cartera"
import raw from "./data.json"

export type TipoProp = "apartamento" | "casa" | "ph" | "terreno" | "local"

export type Propiedad = {
  id: string
  codigo: string // codigo visible de la propiedad ("NX-2301"), unico
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
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function getPropiedades(): Promise<Propiedad[]> {
  await sleep(300)
  return structuredClone(raw.propiedades) as Propiedad[]
}
