// PATRON MOCK. Misma firma que la query real. Reetiquetado para inmobiliaria.
export type Kpi = { label: string; value: string; delta: number }
export type SalesPoint = { label: string; value: number }
export type Activity = { id: string; text: string; time: string }

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function getKpis(): Promise<Kpi[]> {
  await sleep(300)
  return [
    { label: "Propiedades activas", value: "48", delta: 4 },
    { label: "Leads nuevos", value: "134", delta: 12 },
    { label: "Visitas esta semana", value: "22", delta: 8 },
    { label: "Operaciones cerradas", value: "6", delta: -2 },
  ]
}

export async function getSales(): Promise<SalesPoint[]> {
  await sleep(300)
  return [
    { label: "Lun", value: 5 },
    { label: "Mar", value: 8 },
    { label: "Mie", value: 4 },
    { label: "Jue", value: 9 },
    { label: "Vie", value: 7 },
    { label: "Sab", value: 11 },
    { label: "Dom", value: 3 },
  ]
}

export async function getActivity(): Promise<Activity[]> {
  await sleep(300)
  return [
    { id: "1", text: "Nueva consulta: 2 amb en Villa Crespo", time: "hace 5 min" },
    { id: "2", text: "Visita confirmada: casa en Nordelta", time: "hace 20 min" },
    { id: "3", text: "Oferta recibida: USD 185.000", time: "hace 1 h" },
    { id: "4", text: "Tasacion agendada en Caballito", time: "hace 3 h" },
  ]
}
