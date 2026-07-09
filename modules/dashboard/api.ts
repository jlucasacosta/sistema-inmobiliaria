// PATRON MOCK. Misma firma que la query real. Ver BACKEND.md.
// Arquetipo: board (barra-metas + heatmap + Mapa de Cartera). El dashboard RESUME el
// mes, no lo opera. SIN sparklines ni flechitas (DISENO.md §8): manda la meta absoluta.
// Los objetivos viven en theme.meta; aca vive lo REALIZADO del mes.

export type TipoActividad = "consulta" | "visita" | "reserva" | "cierre" | "captacion" | "rechazo"
export type Actividad = { id: string; tipo: TipoActividad; texto: string; cuando: string }

// Realizado del mes (los objetivos salen de theme.meta).
export type Realizado = { cierres: number; captaciones: number; comision: number }

// Heatmap: visitas agendadas por dia x franja horaria.
export type Heatmap = { franjas: string[]; dias: { dia: string; valores: number[] }[] }

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function getRealizado(): Promise<Realizado> {
  await sleep(200)
  // 5 de 8 cierres, 9 de 12 captaciones, U$S 31.400 de comision proyectada (objetivo 42.000).
  return { cierres: 5, captaciones: 9, comision: 31400 }
}

export async function getHeatmap(): Promise<Heatmap> {
  await sleep(280)
  const franjas = ["9-11", "11-13", "13-15", "15-17", "17-19", "19-21"]
  return {
    franjas,
    dias: [
      { dia: "Lun", valores: [1, 2, 0, 3, 4, 1] },
      { dia: "Mar", valores: [0, 3, 1, 2, 5, 2] },
      { dia: "Mie", valores: [2, 1, 0, 4, 3, 0] },
      { dia: "Jue", valores: [1, 4, 2, 5, 6, 3] },
      { dia: "Vie", valores: [3, 5, 1, 6, 7, 4] },
      { dia: "Sab", valores: [4, 6, 3, 5, 2, 0] },
    ],
  }
}

export async function getActividad(): Promise<Actividad[]> {
  await sleep(300)
  return [
    { id: "a01", tipo: "consulta", texto: "Nueva consulta: 2 dorm en Pocitos", cuando: "hace 4 min" },
    { id: "a02", tipo: "visita", texto: "Visita confirmada: casa en Carrasco", cuando: "hace 18 min" },
    { id: "a03", tipo: "reserva", texto: "Sena recibida: U$S 372.000 en Punta Carretas", cuando: "hace 1 h" },
    { id: "a04", tipo: "rechazo", texto: "Sena rechazada: monoambiente en Centro", cuando: "hace 2 h" },
    { id: "a05", tipo: "captacion", texto: "Captacion nueva: PH en Malvin", cuando: "hace 3 h" },
    { id: "a06", tipo: "cierre", texto: "Operacion cerrada: apto en Buceo", cuando: "hace 4 h" },
    { id: "a07", tipo: "visita", texto: "Visita cancelada: chalet en Punta del Este", cuando: "hace 5 h" },
    { id: "a08", tipo: "consulta", texto: "Consulta por permuta: terreno en La Blanqueada", cuando: "hace 6 h" },
    { id: "a09", tipo: "reserva", texto: "Reserva vencida sin pago en Cordon", cuando: "hace 7 h" },
    { id: "a10", tipo: "cierre", texto: "Escritura firmada: casa en Carrasco", cuando: "ayer" },
    { id: "a11", tipo: "rechazo", texto: "Oportunidad perdida: local en Ciudad Vieja", cuando: "ayer" },
    { id: "a12", tipo: "captacion", texto: "Exclusiva firmada: apto 3 dorm en Punta Carretas", cuando: "ayer" },
  ]
}
