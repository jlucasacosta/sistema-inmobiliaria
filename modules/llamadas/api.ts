// PATRON MOCK. Misma firma que la query real. Ver BACKEND.md.
export type Llamada = { id: string; contacto: string; fecha: string; duracion: string; resumen: string }

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function getLlamadas(): Promise<Llamada[]> {
  await sleep(300)
  return [
    { id: "1", contacto: "Martina Rios", fecha: "Hoy 14:10", duracion: "4:32", resumen: "Interesada en el 2 ambientes de Villa Crespo. Pide coordinar visita para el fin de semana." },
    { id: "2", contacto: "Jorge Perez", fecha: "Hoy 11:05", duracion: "2:18", resumen: "Consulta si la casa de Caballito acepta financiacion. Presupuesto hasta USD 260.000." },
    { id: "3", contacto: "Camila Sosa", fecha: "Ayer 17:40", duracion: "6:05", resumen: "Busca 3 ambientes en Palermo para mudarse en 2 meses. Prioriza cochera y luz natural." },
    { id: "4", contacto: "Diego Torres", fecha: "Ayer 10:22", duracion: "3:47", resumen: "Oferto por el PH de Belgrano. Espera respuesta del propietario esta semana." },
  ]
}
