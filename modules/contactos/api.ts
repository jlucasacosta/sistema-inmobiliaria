// PATRON MOCK. Misma firma que la query real. Reetiquetado para inmobiliaria.
export type Contact = {
  id: string
  name: string
  phone: string
  email: string
  status: "activo" | "nuevo" | "perdido"
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function getContacts(): Promise<Contact[]> {
  await sleep(300)
  return [
    { id: "1", name: "Martina Rios", phone: "+54 11 5555 1234", email: "martina@mail.com", status: "activo" },
    { id: "2", name: "Jorge Perez", phone: "+54 11 5555 2233", email: "jorge@mail.com", status: "nuevo" },
    { id: "3", name: "Camila Sosa", phone: "+54 11 5555 7788", email: "camila@mail.com", status: "perdido" },
    { id: "4", name: "Diego Torres", phone: "+54 11 5555 3311", email: "diego@mail.com", status: "activo" },
  ]
}
