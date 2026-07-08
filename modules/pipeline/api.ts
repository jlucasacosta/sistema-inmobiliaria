// PATRON MOCK. Misma firma que la query real. Ver BACKEND.md.
export type Etapa = { id: string; nombre: string }
export type Oportunidad = { id: string; cliente: string; propiedad: string; valor: string; etapaId: string }

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function getEtapas(): Promise<Etapa[]> {
  await sleep(200)
  return [
    { id: "lead", nombre: "Lead" },
    { id: "contactado", nombre: "Contactado" },
    { id: "visita", nombre: "Visita" },
    { id: "oferta", nombre: "Oferta" },
    { id: "cierre", nombre: "Cierre" },
  ]
}

export async function getOportunidades(): Promise<Oportunidad[]> {
  await sleep(300)
  return [
    { id: "1", cliente: "Martina Rios", propiedad: "2 amb Villa Crespo", valor: "USD 185.000", etapaId: "lead" },
    { id: "2", cliente: "Jorge Perez", propiedad: "Casa Caballito", valor: "USD 260.000", etapaId: "lead" },
    { id: "3", cliente: "Camila Sosa", propiedad: "3 amb Palermo", valor: "USD 240.000", etapaId: "contactado" },
    { id: "4", cliente: "Diego Torres", propiedad: "PH Belgrano", valor: "USD 210.000", etapaId: "visita" },
    { id: "5", cliente: "Lucia Mendez", propiedad: "Casa Nordelta", valor: "USD 320.000", etapaId: "visita" },
    { id: "6", cliente: "Pablo Vega", propiedad: "Depto San Isidro", valor: "USD 295.000", etapaId: "oferta" },
    { id: "7", cliente: "Sofia Luna", propiedad: "Monoamb Caballito", valor: "USD 95.000", etapaId: "cierre" },
  ]
}
