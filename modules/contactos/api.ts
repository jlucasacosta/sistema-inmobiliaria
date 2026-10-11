// PATRON MOCK. Misma firma que la query real. Ver BACKEND.md.
// Arquetipo: TABLA-DENSA (ledger). El dato sigue al arquetipo: columnas planas y
// comparables. Emails de patron VARIADO y dominios ficticios (nunca de terceros
// reales). Marca ficticia Nexo Propiedades, mercado Montevideo.
import type { EstadoLead } from "@/shell/cartera"
import raw from "./data.json"

export type Contacto = {
  id: string
  nombre: string
  estado: EstadoLead
  telefono: string
  email: string
  ultima: string
  interes: string
  presupuesto: number // U$S
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function getContactos(): Promise<Contacto[]> {
  await sleep(300)
  return structuredClone(raw.contacts) as Contacto[]
}
