// PATRON MOCK. Misma firma que la query real. Ver BACKEND.md.
// Arquetipo: galeria (masonry). El dato sigue al arquetipo: cada propiedad trae
// precio hero, m2/dorm/banos, estado y COORDENADAS (x,y) para el Mapa de Cartera.
// Marca ficticia Nexo Propiedades, mercado Montevideo / Punta del Este (LATAM).
import type { EstadoProp } from "@/shell/cartera"

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

const data: Propiedad[] = [
  { id: "p01", titulo: "Apto 2 dorm con terraza al mar", zona: "Pocitos", tipo: "apartamento", precio: 268000, m2: 74, dorm: 2, banos: 2, cochera: true, estado: "disponible", diasEnCartera: 12, destacada: true, x: 30, y: 33 },
  { id: "p02", titulo: "Casa 3 dorm con fondo verde", zona: "Carrasco", tipo: "casa", precio: 520000, m2: 210, dorm: 3, banos: 3, cochera: true, estado: "disponible", diasEnCartera: 8, destacada: true, x: 83, y: 30 },
  { id: "p03", titulo: "Monoambiente a estrenar", zona: "Cordon", tipo: "apartamento", precio: 112000, m2: 36, dorm: 1, banos: 1, cochera: false, estado: "disponible", diasEnCartera: 4, destacada: false, x: 47, y: 40 },
  { id: "p04", titulo: "PH reciclado con patio", zona: "Parque Rodo", tipo: "ph", precio: 189000, m2: 88, dorm: 2, banos: 1, cochera: false, estado: "reservada", diasEnCartera: 26, destacada: true, x: 41, y: 45 },
  { id: "p05", titulo: "Penthouse frente a la rambla", zona: "Punta Carretas", tipo: "apartamento", precio: 640000, m2: 128, dorm: 3, banos: 3, cochera: true, estado: "disponible", diasEnCartera: 19, destacada: true, x: 34, y: 48 },
  { id: "p06", titulo: "Apto 1 dorm para inversion", zona: "Centro", tipo: "apartamento", precio: 96000, m2: 40, dorm: 1, banos: 1, cochera: false, estado: "vendida", diasEnCartera: 63, destacada: false, x: 52, y: 38 },
  { id: "p07", titulo: "Casa 4 dorm con piscina", zona: "Carrasco", tipo: "casa", precio: 780000, m2: 320, dorm: 4, banos: 4, cochera: true, estado: "reservada", diasEnCartera: 34, destacada: true, x: 86, y: 33 },
  { id: "p08", titulo: "Apto 2 dorm luminoso", zona: "Malvin", tipo: "apartamento", precio: 205000, m2: 68, dorm: 2, banos: 1, cochera: true, estado: "disponible", diasEnCartera: 51, destacada: false, x: 69, y: 39 },
  { id: "p09", titulo: "Local comercial a la calle", zona: "Ciudad Vieja", tipo: "local", precio: 158000, m2: 92, dorm: 0, banos: 1, cochera: false, estado: "disponible", diasEnCartera: 72, destacada: false, x: 44, y: 34 },
  { id: "p10", titulo: "Apto 3 dorm con amenities", zona: "Buceo", tipo: "apartamento", precio: 315000, m2: 96, dorm: 3, banos: 2, cochera: true, estado: "disponible", diasEnCartera: 15, destacada: true, x: 60, y: 42 },
  { id: "p11", titulo: "Casa estilo colonial a refaccionar", zona: "La Blanqueada", tipo: "casa", precio: 174000, m2: 140, dorm: 3, banos: 1, cochera: false, estado: "disponible", diasEnCartera: 58, destacada: false, x: 55, y: 52 },
  { id: "p12", titulo: "Apto 2 dorm con garage doble", zona: "Pocitos", tipo: "apartamento", precio: 289000, m2: 82, dorm: 2, banos: 2, cochera: true, estado: "reservada", diasEnCartera: 22, destacada: true, x: 32, y: 35 },
  { id: "p13", titulo: "Terreno apto edificar 12 pisos", zona: "Punta Carretas", tipo: "terreno", precio: 430000, m2: 600, dorm: 0, banos: 0, cochera: false, estado: "disponible", diasEnCartera: 41, destacada: false, x: 36, y: 50 },
  { id: "p14", titulo: "Apto 1 dorm frente al parque", zona: "Parque Rodo", tipo: "apartamento", precio: 138000, m2: 44, dorm: 1, banos: 1, cochera: false, estado: "disponible", diasEnCartera: 9, destacada: false, x: 43, y: 47 },
  { id: "p15", titulo: "Chalet 5 dorm con parque", zona: "Punta del Este", tipo: "casa", precio: 1150000, m2: 480, dorm: 5, banos: 5, cochera: true, estado: "disponible", diasEnCartera: 28, destacada: true, x: 92, y: 72 },
  { id: "p16", titulo: "Apto 2 dorm a reciclar", zona: "Centro", tipo: "apartamento", precio: 121000, m2: 58, dorm: 2, banos: 1, cochera: false, estado: "vendida", diasEnCartera: 47, destacada: false, x: 50, y: 37 },
  { id: "p17", titulo: "Duplex 3 dorm con parrillero", zona: "Malvin", tipo: "ph", precio: 246000, m2: 118, dorm: 3, banos: 2, cochera: true, estado: "disponible", diasEnCartera: 17, destacada: true, x: 71, y: 41 },
  { id: "p18", titulo: "Apto 3 dorm con dependencia", zona: "Punta Carretas", tipo: "apartamento", precio: 372000, m2: 110, dorm: 3, banos: 2, cochera: true, estado: "reservada", diasEnCartera: 31, destacada: true, x: 35, y: 46 },
  { id: "p19", titulo: "Casa 3 dorm en barrio privado", zona: "Carrasco", tipo: "casa", precio: 495000, m2: 240, dorm: 3, banos: 3, cochera: true, estado: "disponible", diasEnCartera: 6, destacada: true, x: 84, y: 28 },
  { id: "p20", titulo: "Monoambiente sobre la rambla", zona: "Buceo", tipo: "apartamento", precio: 143000, m2: 42, dorm: 1, banos: 1, cochera: false, estado: "disponible", diasEnCartera: 44, destacada: false, x: 62, y: 44 },
  { id: "p21", titulo: "Apto 2 dorm con vista abierta", zona: "Pocitos", tipo: "apartamento", precio: 254000, m2: 71, dorm: 2, banos: 2, cochera: true, estado: "vendida", diasEnCartera: 55, destacada: false, x: 29, y: 31 },
  { id: "p22", titulo: "Local en galeria comercial", zona: "Centro", tipo: "local", precio: 89000, m2: 48, dorm: 0, banos: 1, cochera: false, estado: "disponible", diasEnCartera: 81, destacada: false, x: 53, y: 40 },
  { id: "p23", titulo: "Apartamento a estrenar 2 dorm", zona: "Cordon", tipo: "apartamento", precio: 197000, m2: 66, dorm: 2, banos: 2, cochera: true, estado: "disponible", diasEnCartera: 11, destacada: false, x: 48, y: 42 },
  { id: "p24", titulo: "Casa 4 dorm con quincho", zona: "Punta del Este", tipo: "casa", precio: 720000, m2: 300, dorm: 4, banos: 3, cochera: true, estado: "reservada", diasEnCartera: 38, destacada: true, x: 90, y: 74 },
  { id: "p25", titulo: "Apto 3 dorm categoria premium", zona: "Punta Carretas", tipo: "apartamento", precio: 458000, m2: 124, dorm: 3, banos: 3, cochera: true, estado: "disponible", diasEnCartera: 21, destacada: true, x: 37, y: 49 },
  { id: "p26", titulo: "Terreno con salida a dos calles", zona: "La Blanqueada", tipo: "terreno", precio: 165000, m2: 520, dorm: 0, banos: 0, cochera: false, estado: "disponible", diasEnCartera: 67, destacada: false, x: 57, y: 54 },
  { id: "p27", titulo: "PH 2 dorm en planta baja", zona: "Malvin", tipo: "ph", precio: 219000, m2: 90, dorm: 2, banos: 2, cochera: false, estado: "disponible", diasEnCartera: 14, destacada: false, x: 73, y: 43 },
]

export async function getPropiedades(): Promise<Propiedad[]> {
  await sleep(300)
  return data
}
