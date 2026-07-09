// PATRON MOCK. Misma firma que la query real. Ver BACKEND.md.
// Arquetipo: LISTA-TICKET (bandeja densa). LA PANTALLA QUE MANDA (DISENO.md §2).
// Se ELIMINA el panel de chat de escritorio: en celular manda la bandeja. Cada
// ticket cruza la consulta entrante con el estado del lead y de la propiedad.
import type { EstadoLead, EstadoProp } from "@/shell/cartera"

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

const data: Ticket[] = [
  { id: "t01", contacto: "Valentina Cabrera", estadoLead: "caliente", ultimo: "Perfecto, coordinamos la sena para el jueves", cuando: "hace 4 min", propiedad: "Apto 2 dorm · Pocitos", precio: 268000, estadoProp: "reservada", sinLeer: 2 },
  { id: "t02", contacto: "Sofia Nunez", estadoLead: "nuevo", ultimo: "Sigue disponible el penthouse de la rambla?", cuando: "hace 12 min", propiedad: "Penthouse · Punta Carretas", precio: 640000, estadoProp: "disponible", sinLeer: 1 },
  { id: "t03", contacto: "Federico Bala", estadoLead: "caliente", ultimo: "Me pasas los planos del PH?", cuando: "hace 25 min", propiedad: "PH 2 dorm · Malvin", precio: 219000, estadoProp: "disponible", sinLeer: 1 },
  { id: "t04", contacto: "Martina Sena", estadoLead: "nuevo", ultimo: "Acepta credito hipotecario del BHU?", cuando: "hace 40 min", propiedad: "Apto 1 dorm · Parque Rodo", precio: 138000, estadoProp: "disponible", sinLeer: 3 },
  { id: "t05", contacto: "Diego Pereyra", estadoLead: "caliente", ultimo: "Espero la contraoferta del propietario", cuando: "hace 1 h", propiedad: "Chalet · Punta del Este", precio: 1150000, estadoProp: "disponible", sinLeer: 0 },
  { id: "t06", contacto: "Camila Rossi", estadoLead: "caliente", ultimo: "Reviso el boleto y te confirmo hoy", cuando: "hace 2 h", propiedad: "Apto 3 dorm · Punta Carretas", precio: 458000, estadoProp: "reservada", sinLeer: 1 },
  { id: "t07", contacto: "Carolina Techera", estadoLead: "nuevo", ultimo: "Cuanto son los gastos comunes?", cuando: "hace 3 h", propiedad: "Apto 2 dorm · Malvin", precio: 205000, estadoProp: "disponible", sinLeer: 2 },
  { id: "t08", contacto: "Renata Delgado", estadoLead: "caliente", ultimo: "Decido en la semana, me encanto", cuando: "hace 4 h", propiedad: "Apto 3 dorm · Punta Carretas", precio: 372000, estadoProp: "reservada", sinLeer: 0 },
  { id: "t09", contacto: "Bruno Machado", estadoLead: "frio", ultimo: "Gracias igual, elegi otra ubicacion", cuando: "ayer", propiedad: "Local · Ciudad Vieja", precio: 158000, estadoProp: "disponible", sinLeer: 0 },
  { id: "t10", contacto: "Agustina Vidal", estadoLead: "caliente", ultimo: "Coordinamos firma con la escribania?", cuando: "ayer", propiedad: "Apto 2 dorm · Pocitos", precio: 289000, estadoProp: "reservada", sinLeer: 1 },
  { id: "t11", contacto: "Florencia Piriz", estadoLead: "nuevo", ultimo: "Me pasas numeros de renta estimada?", cuando: "ayer", propiedad: "Monoambiente · Buceo", precio: 143000, estadoProp: "disponible", sinLeer: 2 },
  { id: "t12", contacto: "Sebastian Lorenzo", estadoLead: "frio", ultimo: "Ya compre por otra via, muchas gracias", cuando: "hace 2 d", propiedad: "Apto 2 dorm · Pocitos", precio: 254000, estadoProp: "vendida", sinLeer: 0 },
  { id: "t13", contacto: "Gaston Prieto", estadoLead: "caliente", ultimo: "Mi oferta queda sujeta a vender mi depto", cuando: "hace 2 d", propiedad: "PH · Parque Rodo", precio: 189000, estadoProp: "reservada", sinLeer: 0 },
  { id: "t14", contacto: "Nicolas Ackermann", estadoLead: "frio", ultimo: "Sigo evaluando la permuta, sin apuro", cuando: "hace 3 d", propiedad: "Terreno · Punta Carretas", precio: 430000, estadoProp: "disponible", sinLeer: 0 },
]

export async function getTickets(): Promise<Ticket[]> {
  await sleep(300)
  return data
}
