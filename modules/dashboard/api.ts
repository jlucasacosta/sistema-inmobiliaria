// PATRON MOCK. Misma firma que la query real. Ver BACKEND.md.
// Arquetipo: board (barra-metas + heatmap). El dashboard RESUME el
// mes, no lo opera. SIN sparklines ni flechitas (DISENO.md §8): manda la meta absoluta.
// Los objetivos viven en theme.meta; aca vive lo REALIZADO del mes.

import raw from "./data.json"

export type TipoActividad = "consulta" | "visita" | "reserva" | "cierre" | "captacion" | "rechazo"
export type Actividad = { id: string; tipo: TipoActividad; texto: string; cuando: string }

// Realizado del mes (los objetivos salen de theme.meta).
// `periodo` es el mes que resume el panel ("octubre 2026").
export type Realizado = { periodo: string; cierres: number; captaciones: number; comision: number }

// Heatmap: visitas agendadas por dia x franja horaria.
export type Heatmap = { franjas: string[]; dias: { dia: string; valores: number[] }[] }

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function getRealizado(): Promise<Realizado> {
  await sleep(200)
  // 5 de 8 cierres, 9 de 12 captaciones, U$S 31.400 de comision proyectada (objetivo 42.000).
  return structuredClone(raw.realizado) as Realizado
}

export async function getHeatmap(): Promise<Heatmap> {
  await sleep(280)
  return structuredClone(raw.heatmap) as Heatmap
}

export async function getActividad(): Promise<Actividad[]> {
  await sleep(300)
  return structuredClone(raw.actividad) as Actividad[]
}
