// PATRON MOCK. Misma firma que la query real. Reetiquetado para inmobiliaria.
export type Thread = { id: string; name: string; last: string; time: string; unread: number }
export type Message = { id: string; from: "cliente" | "vos"; text: string; time: string }

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function getThreads(): Promise<Thread[]> {
  await sleep(300)
  return [
    { id: "1", name: "Martina Rios", last: "Perfecto, coordinamos la visita al depto", time: "14:32", unread: 2 },
    { id: "2", name: "Jorge Perez", last: "Sigue disponible la casa de Caballito?", time: "13:10", unread: 0 },
    { id: "3", name: "Camila Sosa", last: "Me interesa el 3 ambientes", time: "11:45", unread: 0 },
  ]
}

export async function getMessages(_threadId: string): Promise<Message[]> {
  await sleep(200)
  return [
    { id: "1", from: "cliente", text: "Hola, vi la publicacion del 2 amb en Villa Crespo", time: "14:20" },
    { id: "2", from: "vos", text: "Hola! Si, sigue disponible. Coordinamos una visita?", time: "14:22" },
    { id: "3", from: "cliente", text: "Perfecto, coordinamos la visita al depto", time: "14:32" },
  ]
}
