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
  estado: "disponible" | "reservada" | "vendida" | "alquilada"
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function getPropiedades(): Promise<Propiedad[]> {
  await sleep(300)
  return [
    { id: "1", titulo: "Depto 2 ambientes con balcon", operacion: "venta", precio: "USD 185.000", direccion: "Villa Crespo, CABA", ambientes: 2, banos: 1, m2: 52, estado: "disponible" },
    { id: "2", titulo: "Casa 4 ambientes con jardin", operacion: "venta", precio: "USD 320.000", direccion: "Nordelta, Tigre", ambientes: 4, banos: 3, m2: 180, estado: "reservada" },
    { id: "3", titulo: "Monoambiente a estrenar", operacion: "alquiler", precio: "$ 420.000 / mes", direccion: "Caballito, CABA", ambientes: 1, banos: 1, m2: 34, estado: "disponible" },
    { id: "4", titulo: "PH 3 ambientes reciclado", operacion: "venta", precio: "USD 240.000", direccion: "Palermo, CABA", ambientes: 3, banos: 2, m2: 78, estado: "disponible" },
    { id: "5", titulo: "Depto 2 amb con cochera", operacion: "alquiler", precio: "$ 560.000 / mes", direccion: "Belgrano, CABA", ambientes: 2, banos: 1, m2: 58, estado: "alquilada" },
    { id: "6", titulo: "Casa 5 ambientes con pileta", operacion: "venta", precio: "USD 410.000", direccion: "San Isidro, GBA", ambientes: 5, banos: 3, m2: 220, estado: "vendida" },
    { id: "7", titulo: "Loft industrial en planta alta", operacion: "alquiler", precio: "$ 490.000 / mes", direccion: "Rosario Norte, Santa Fe", ambientes: 1, banos: 1, m2: 46, estado: "disponible" },
    { id: "8", titulo: "Duplex 3 amb con parrilla", operacion: "venta", precio: "USD 198.000", direccion: "Nueva Cordoba, Cordoba", ambientes: 3, banos: 2, m2: 96, estado: "reservada" },
    { id: "9", titulo: "Depto 1 amb frente al parque", operacion: "alquiler", precio: "$ 375.000 / mes", direccion: "Godoy Cruz, Mendoza", ambientes: 1, banos: 1, m2: 38, estado: "disponible" },
    { id: "10", titulo: "Casa quinta con parque", operacion: "venta", precio: "USD 275.000", direccion: "Chacras de Coria, Mendoza", ambientes: 4, banos: 2, m2: 165, estado: "disponible" },
    { id: "11", titulo: "Oficina 2 ambientes categoria A", operacion: "alquiler", precio: "$ 610.000 / mes", direccion: "Microcentro, CABA", ambientes: 2, banos: 1, m2: 62, estado: "alquilada" },
    { id: "12", titulo: "PH 2 amb con patio", operacion: "venta", precio: "USD 142.000", direccion: "Boedo, CABA", ambientes: 2, banos: 1, m2: 55, estado: "disponible" },
    { id: "13", titulo: "Depto 3 amb con dependencia", operacion: "venta", precio: "USD 289.000", direccion: "Recoleta, CABA", ambientes: 3, banos: 2, m2: 104, estado: "reservada" },
    { id: "14", titulo: "Casa 3 amb en barrio cerrado", operacion: "venta", precio: "USD 355.000", direccion: "Pilar, GBA", ambientes: 3, banos: 2, m2: 148, estado: "disponible" },
    { id: "15", titulo: "Depto 2 amb luminoso", operacion: "alquiler", precio: "$ 445.000 / mes", direccion: "Pichincha, Rosario", ambientes: 2, banos: 1, m2: 54, estado: "disponible" },
    { id: "16", titulo: "Local comercial a la calle", operacion: "alquiler", precio: "$ 720.000 / mes", direccion: "Almagro, CABA", ambientes: 1, banos: 1, m2: 88, estado: "disponible" },
    { id: "17", titulo: "Casa 4 amb con quincho", operacion: "venta", precio: "USD 262.000", direccion: "Villa Allende, Cordoba", ambientes: 4, banos: 3, m2: 172, estado: "vendida" },
    { id: "18", titulo: "Monoambiente para inversion", operacion: "venta", precio: "USD 88.000", direccion: "Ciudad, Mendoza", ambientes: 1, banos: 1, m2: 30, estado: "disponible" },
    { id: "19", titulo: "Depto 4 amb con vista al rio", operacion: "venta", precio: "USD 468.000", direccion: "Puerto Madero, CABA", ambientes: 4, banos: 3, m2: 138, estado: "reservada" },
    { id: "20", titulo: "PH 3 amb en dos plantas", operacion: "alquiler", precio: "$ 585.000 / mes", direccion: "Colegiales, CABA", ambientes: 3, banos: 2, m2: 84, estado: "alquilada" },
    { id: "21", titulo: "Casa 5 amb con fondo verde", operacion: "venta", precio: "USD 231.000", direccion: "San Fernando, GBA", ambientes: 5, banos: 2, m2: 190, estado: "disponible" },
    { id: "22", titulo: "Deposito con playa de maniobras", operacion: "alquiler", precio: "$ 940.000 / mes", direccion: "Rosario Sur, Santa Fe", ambientes: 1, banos: 1, m2: 320, estado: "disponible" },
    { id: "23", titulo: "Depto 2 amb a reciclar", operacion: "venta", precio: "USD 121.000", direccion: "Echesortu, Rosario", ambientes: 2, banos: 1, m2: 49, estado: "disponible" },
    { id: "24", titulo: "Casa 3 amb estilo colonial", operacion: "venta", precio: "USD 208.000", direccion: "Lujan de Cuyo, Mendoza", ambientes: 3, banos: 2, m2: 132, estado: "reservada" },
    { id: "25", titulo: "Depto 3 amb con amenities", operacion: "alquiler", precio: "$ 675.000 / mes", direccion: "Nunez, CABA", ambientes: 3, banos: 2, m2: 92, estado: "disponible" },
    { id: "26", titulo: "Terreno apto edificar", operacion: "venta", precio: "USD 96.000", direccion: "Escobar, GBA", ambientes: 0, banos: 0, m2: 400, estado: "disponible" },
    { id: "27", titulo: "Depto 1 amb en Alta Cordoba", operacion: "alquiler", precio: "$ 358.000 / mes", direccion: "Alta Cordoba, Cordoba", ambientes: 1, banos: 1, m2: 36, estado: "alquilada" },
  ]
}
