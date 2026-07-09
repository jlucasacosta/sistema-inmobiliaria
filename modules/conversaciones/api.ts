// PATRON MOCK. Misma firma que la query real. Reetiquetado para inmobiliaria.
export type Thread = {
  id: string
  name: string
  last: string
  time: string
  unread: number
  estado: "activa" | "nueva" | "en espera" | "cerrada"
}
export type Message = { id: string; from: "cliente" | "vos"; text: string; time: string }

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function getThreads(): Promise<Thread[]> {
  await sleep(300)
  return [
    { id: "1", name: "Martina Rios", last: "Perfecto, coordinamos la visita al depto", time: "14:32", unread: 2, estado: "activa" },
    { id: "2", name: "Jorge Perez", last: "Sigue disponible la casa de Caballito?", time: "13:10", unread: 0, estado: "nueva" },
    { id: "3", name: "Camila Sosa", last: "Me interesa el 3 ambientes de Palermo", time: "11:45", unread: 1, estado: "activa" },
    { id: "4", name: "Diego Torres", last: "Espero la respuesta del propietario", time: "10:20", unread: 0, estado: "en espera" },
    { id: "5", name: "Pablo Vega", last: "Gracias igual, freno la busqueda por ahora", time: "Ayer", unread: 0, estado: "cerrada" },
    { id: "6", name: "Lucia Mendez", last: "Confirmo la visita del domingo", time: "Ayer", unread: 3, estado: "activa" },
    { id: "7", name: "Sofia Luna", last: "Coordinamos firma con la escribania?", time: "Ayer", unread: 1, estado: "activa" },
    { id: "8", name: "Valentina Cruz", last: "Me pasas mas fotos del 2 amb?", time: "Ayer", unread: 0, estado: "nueva" },
    { id: "9", name: "Nicolas Ferreyra", last: "Listo, agendada la visita del martes", time: "Lun", unread: 0, estado: "activa" },
    { id: "10", name: "Agustina Molina", last: "Ya consegui por otro lado, gracias", time: "Lun", unread: 0, estado: "cerrada" },
    { id: "11", name: "Federico Ramos", last: "Necesito la tasacion para la permuta", time: "Lun", unread: 2, estado: "en espera" },
    { id: "12", name: "Carla Benitez", last: "Perfecto, el miercoles a las 10", time: "Vie", unread: 0, estado: "activa" },
    { id: "13", name: "Florencia Diaz", last: "Cuanto son las expensas del depto?", time: "Vie", unread: 1, estado: "nueva" },
    { id: "14", name: "Belen Acosta", last: "Reviso la garantia y te confirmo", time: "Vie", unread: 0, estado: "en espera" },
  ]
}

const conversaciones: Record<string, Message[]> = {
  "1": [
    { id: "1", from: "cliente", text: "Hola, vi la publicacion del 2 amb en Villa Crespo", time: "14:20" },
    { id: "2", from: "vos", text: "Hola Martina! Si, sigue disponible. Coordinamos una visita?", time: "14:22" },
    { id: "3", from: "cliente", text: "Dale, tenes lugar el sabado a la manana?", time: "14:28" },
    { id: "4", from: "vos", text: "Sabado 11hs perfecto. Te paso la direccion exacta por aca", time: "14:30" },
    { id: "5", from: "cliente", text: "Perfecto, coordinamos la visita al depto", time: "14:32" },
  ],
  "2": [
    { id: "1", from: "cliente", text: "Buenas, sigue disponible la casa de Caballito?", time: "13:02" },
    { id: "2", from: "vos", text: "Hola Jorge! Si, sigue en venta. Buscas para vivienda o inversion?", time: "13:06" },
    { id: "3", from: "cliente", text: "Para vivir. Acepta algun tipo de financiacion?", time: "13:10" },
  ],
  "3": [
    { id: "1", from: "cliente", text: "Me interesa el 3 ambientes de Palermo que publicaron", time: "11:30" },
    { id: "2", from: "vos", text: "Buenisimo Camila. Tiene cochera y muy buena luz. Te mando la ficha", time: "11:38" },
    { id: "3", from: "cliente", text: "Genial, cuando se puede visitar?", time: "11:45" },
  ],
  "5": [
    { id: "1", from: "vos", text: "Hola Pablo, quedo confirmada la visita al depto de San Isidro?", time: "Ayer 15:40" },
    { id: "2", from: "cliente", text: "Te queria avisar que voy a frenar la busqueda unos meses", time: "Ayer 16:10" },
    { id: "3", from: "vos", text: "Sin problema, cualquier cosa quedamos en contacto", time: "Ayer 16:14" },
    { id: "4", from: "cliente", text: "Gracias igual, freno la busqueda por ahora", time: "Ayer 16:15" },
  ],
  "6": [
    { id: "1", from: "vos", text: "Hola Lucia! Confirmamos la visita a la casa de Nordelta?", time: "Ayer 14:50" },
    { id: "2", from: "cliente", text: "Si! Vamos con mi pareja el domingo al mediodia", time: "Ayer 15:02" },
    { id: "3", from: "cliente", text: "Confirmo la visita del domingo", time: "Ayer 15:03" },
  ],
}

const generico: Message[] = [
  { id: "1", from: "cliente", text: "Hola! Queria consultar por una propiedad publicada", time: "10:15" },
  { id: "2", from: "vos", text: "Hola! Con gusto te ayudo. Cual te interesa?", time: "10:18" },
  { id: "3", from: "cliente", text: "Me gustaria coordinar una visita esta semana", time: "10:24" },
]

export async function getMessages(threadId: string): Promise<Message[]> {
  await sleep(200)
  return conversaciones[threadId] ?? generico
}
