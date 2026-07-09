// PATRON MOCK. Misma firma que la query real. Ver BACKEND.md.
export type Etapa = { id: string; nombre: string }
export type Oportunidad = { id: string; cliente: string; propiedad: string; valor: string; etapaId: string; probabilidad: number }

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function getEtapas(): Promise<Etapa[]> {
  await sleep(200)
  return [
    { id: "lead", nombre: "Lead" },
    { id: "contactado", nombre: "Contactado" },
    { id: "visita", nombre: "Visita" },
    { id: "oferta", nombre: "Oferta" },
    { id: "cierre", nombre: "Cierre" },
    { id: "perdida", nombre: "Perdida" },
  ]
}

export async function getOportunidades(): Promise<Oportunidad[]> {
  await sleep(300)
  return [
    { id: "1", cliente: "Martina Rios", propiedad: "2 amb Villa Crespo", valor: "USD 185.000", etapaId: "lead", probabilidad: 15 },
    { id: "2", cliente: "Jorge Perez", propiedad: "Casa Caballito", valor: "USD 260.000", etapaId: "lead", probabilidad: 10 },
    { id: "3", cliente: "Carla Benitez", propiedad: "3 amb Nunez", valor: "USD 289.000", etapaId: "lead", probabilidad: 20 },
    { id: "4", cliente: "Antonella Ruiz", propiedad: "Depto Cerro", valor: "USD 132.000", etapaId: "lead", probabilidad: 12 },
    { id: "5", cliente: "Camila Sosa", propiedad: "3 amb Palermo", valor: "USD 240.000", etapaId: "contactado", probabilidad: 35 },
    { id: "6", cliente: "Nicolas Ferreyra", propiedad: "Duplex Nueva Cordoba", valor: "USD 198.000", etapaId: "contactado", probabilidad: 30 },
    { id: "7", cliente: "Micaela Romero", propiedad: "Loft Rosario norte", valor: "$ 490.000 / mes", etapaId: "contactado", probabilidad: 40 },
    { id: "8", cliente: "Tomas Gimenez", propiedad: "PH Alta Cordoba", valor: "$ 358.000 / mes", etapaId: "contactado", probabilidad: 28 },
    { id: "9", cliente: "Diego Torres", propiedad: "PH Belgrano", valor: "USD 210.000", etapaId: "visita", probabilidad: 55 },
    { id: "10", cliente: "Lucia Mendez", propiedad: "Casa Nordelta", valor: "USD 320.000", etapaId: "visita", probabilidad: 50 },
    { id: "11", cliente: "Julieta Castro", propiedad: "2 amb Pichincha", valor: "$ 445.000 / mes", etapaId: "visita", probabilidad: 60 },
    { id: "12", cliente: "Federico Ramos", propiedad: "Casa Chacras de Coria", valor: "USD 275.000", etapaId: "visita", probabilidad: 45 },
    { id: "13", cliente: "Rocio Medina", propiedad: "4 amb Recoleta", valor: "USD 289.000", etapaId: "oferta", probabilidad: 75 },
    { id: "14", cliente: "Franco Dominguez", propiedad: "Casa Pilar", valor: "USD 355.000", etapaId: "oferta", probabilidad: 70 },
    { id: "15", cliente: "Sebastian Ortiz", propiedad: "Casa San Fernando", valor: "USD 231.000", etapaId: "oferta", probabilidad: 65 },
    { id: "16", cliente: "Belen Acosta", propiedad: "2 amb Colegiales", valor: "$ 585.000 / mes", etapaId: "oferta", probabilidad: 80 },
    { id: "17", cliente: "Sofia Luna", propiedad: "Monoamb Caballito", valor: "USD 95.000", etapaId: "cierre", probabilidad: 95 },
    { id: "18", cliente: "Leandro Vera", propiedad: "3 amb Saavedra", valor: "USD 268.000", etapaId: "cierre", probabilidad: 92 },
    { id: "19", cliente: "Hernan Gil", propiedad: "Casa Villa Allende", valor: "USD 262.000", etapaId: "cierre", probabilidad: 90 },
    { id: "20", cliente: "Pablo Vega", propiedad: "Depto San Isidro", valor: "USD 295.000", etapaId: "perdida", probabilidad: 0 },
    { id: "21", cliente: "Agustina Molina", propiedad: "PH Boedo", valor: "USD 142.000", etapaId: "perdida", probabilidad: 0 },
    { id: "22", cliente: "Ezequiel Paz", propiedad: "Casa Lujan de Cuyo", valor: "USD 208.000", etapaId: "perdida", probabilidad: 0 },
  ]
}
