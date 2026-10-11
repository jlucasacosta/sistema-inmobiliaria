// PATRON MOCK. Misma firma que la query real. Ver BACKEND.md.
// Arquetipo: MASTER-DETAIL. El dato sigue al arquetipo: cada oportunidad trae su
// ficha COMPLETA (comprador, propiedad, comision, historial) para el panel derecho.
// El kanban se cede a un sistema futuro (ver DISENO.md §5).
import type { Etapa } from "@/shell/cartera"
import raw from "./data.json"

export type EventoHist = { fecha: string; texto: string }

export type Oportunidad = {
  id: string
  comprador: string
  telefono: string
  propiedad: string
  zona: string
  precio: number // U$S valor de la operacion
  comisionPct: number // 0-1, honorarios sobre la operacion
  etapa: Etapa
  actualizada: string
  nota: string
  historial: EventoHist[]
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function getOportunidades(): Promise<Oportunidad[]> {
  await sleep(300)
  return structuredClone(raw.oportunidades) as Oportunidad[]
}
