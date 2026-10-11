// PATRON MOCK. Misma firma que la query real. Ver BACKEND.md.
// Arquetipo: TIMELINE. El dato sigue al arquetipo: cada llamada trae HORA y duracion
// para ubicarse en el eje vertical del dia. La mas reciente arriba.
import type { Resultado } from "@/shell/cartera"
import raw from "./data.json"

export type Llamada = {
  id: string
  hora: string // HH:MM del dia de hoy
  contacto: string
  telefono: string
  propiedad: string
  duracionSeg: number
  resultado: Resultado
  nextStep: string
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

// data.json: ordenadas de mas reciente (arriba) a mas antigua. Todas de HOY.
export async function getLlamadas(): Promise<Llamada[]> {
  await sleep(300)
  return structuredClone(raw.calls) as Llamada[]
}
