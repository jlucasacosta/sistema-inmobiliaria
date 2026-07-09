// PATRON MOCK. Misma firma que la query real. Reetiquetado para inmobiliaria.
export type Tone = "primary" | "accent" | "success" | "warning" | "danger" | "info"
export type Kpi = { label: string; value: string; delta: number; tone: Tone }
export type SalesPoint = { label: string; value: number }
export type Activity = { id: string; text: string; time: string; tone: Tone }

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function getKpis(): Promise<Kpi[]> {
  await sleep(300)
  return [
    { label: "Propiedades activas", value: "48", delta: 4, tone: "primary" },
    { label: "Leads nuevos", value: "134", delta: 12, tone: "info" },
    { label: "Visitas esta semana", value: "22", delta: 8, tone: "accent" },
    { label: "Operaciones cerradas", value: "6", delta: -2, tone: "success" },
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
    { id: "1", text: "Nueva consulta: 2 amb en Villa Crespo", time: "hace 5 min", tone: "info" },
    { id: "2", text: "Visita confirmada: casa en Nordelta", time: "hace 20 min", tone: "success" },
    { id: "3", text: "Oferta recibida: USD 289.000 en Recoleta", time: "hace 1 h", tone: "accent" },
    { id: "4", text: "Visita cancelada: depto en San Isidro", time: "hace 2 h", tone: "danger" },
    { id: "5", text: "Sena rechazada: monoambiente en Ciudad", time: "hace 3 h", tone: "danger" },
    { id: "6", text: "Tasacion agendada en Caballito", time: "hace 4 h", tone: "warning" },
    { id: "7", text: "Operacion cerrada: PH en Belgrano", time: "hace 5 h", tone: "success" },
    { id: "8", text: "Pago de reserva pendiente en Nunez", time: "hace 6 h", tone: "warning" },
    { id: "9", text: "Nuevo lead asignado: casa en Pilar", time: "hace 7 h", tone: "info" },
    { id: "10", text: "Contrato de alquiler firmado en Colegiales", time: "hace 8 h", tone: "success" },
    { id: "11", text: "Oportunidad perdida: PH en Boedo", time: "ayer", tone: "danger" },
    { id: "12", text: "Publicacion renovada: loft en Rosario norte", time: "ayer", tone: "primary" },
  ]
}
