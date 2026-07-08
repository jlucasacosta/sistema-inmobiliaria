// PATRON MOCK. Misma firma que la query real. Ver BACKEND.md.
export type Propiedad = {
  id: string
  titulo: string
  operacion: "venta" | "alquiler"
  precio: string
  direccion: string
  ambientes: number
  banos: number
  m2: number
  estado: "disponible" | "reservada" | "vendida"
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function getPropiedades(): Promise<Propiedad[]> {
  await sleep(300)
  return [
    { id: "1", titulo: "Depto 2 ambientes con balcon", operacion: "venta", precio: "USD 185.000", direccion: "Villa Crespo, CABA", ambientes: 2, banos: 1, m2: 52, estado: "disponible" },
    { id: "2", titulo: "Casa 4 ambientes con jardin", operacion: "venta", precio: "USD 320.000", direccion: "Nordelta, Tigre", ambientes: 4, banos: 3, m2: 180, estado: "reservada" },
    { id: "3", titulo: "Monoambiente a estrenar", operacion: "alquiler", precio: "$ 420.000 / mes", direccion: "Caballito, CABA", ambientes: 1, banos: 1, m2: 34, estado: "disponible" },
    { id: "4", titulo: "PH 3 ambientes reciclado", operacion: "venta", precio: "USD 240.000", direccion: "Palermo, CABA", ambientes: 3, banos: 2, m2: 78, estado: "disponible" },
    { id: "5", titulo: "Depto 2 amb con cochera", operacion: "alquiler", precio: "$ 560.000 / mes", direccion: "Belgrano, CABA", ambientes: 2, banos: 1, m2: 58, estado: "disponible" },
    { id: "6", titulo: "Casa 5 ambientes con pileta", operacion: "venta", precio: "USD 410.000", direccion: "San Isidro, GBA", ambientes: 5, banos: 3, m2: 220, estado: "vendida" },
  ]
}
