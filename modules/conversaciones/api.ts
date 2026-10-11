// PATRON MOCK. Misma firma que la query real. Ver BACKEND.md.
// Arquetipo: LISTA-TICKET (bandeja densa). LA PANTALLA QUE MANDA (DISENO.md §2).
// Se ELIMINA el panel de chat de escritorio: en celular manda la bandeja. Cada
// ticket cruza la consulta entrante con el estado del lead y de la propiedad.
import type { EstadoLead, EstadoProp } from "@/shell/cartera"
import raw from "./data.json"

export type Ticket = {
  id: string
  contacto: string
  estadoLead: EstadoLead
  ultimo: string // ultimo mensaje del contacto, 1 linea
  cuando: string
  propiedad: string
  precio: number // U$S de la propiedad consultada
  estadoProp: EstadoProp
  sinLeer: number
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function getTickets(): Promise<Ticket[]> {
  await sleep(300)
  return structuredClone(raw.tickets) as Ticket[]
}
