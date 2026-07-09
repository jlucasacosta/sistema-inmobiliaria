// PATRON MOCK. Misma firma que la query real. Ver BACKEND.md.
// Arquetipo: TABLA-DENSA (ledger). El dato sigue al arquetipo: columnas planas y
// comparables. Emails de patron VARIADO y dominios ficticios (nunca de terceros
// reales). Marca ficticia Nexo Propiedades, mercado Montevideo.
import type { EstadoLead } from "@/shell/cartera"

export type Contacto = {
  id: string
  nombre: string
  estado: EstadoLead
  telefono: string
  email: string
  ultima: string
  interes: string
  presupuesto: number // U$S
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

const data: Contacto[] = [
  { id: "c01", nombre: "Valentina Cabrera", estado: "caliente", telefono: "+598 94 217 663", email: "vcabrera@gmail.com", ultima: "hace 2 h", interes: "Apto 2 dorm · Pocitos", presupuesto: 280000 },
  { id: "c02", nombre: "Rodrigo Methol", estado: "caliente", telefono: "+598 99 845 012", email: "rodrigo.methol@hotmail.com", ultima: "hace 5 h", interes: "Casa 3 dorm · Carrasco", presupuesto: 540000 },
  { id: "c03", nombre: "Sofia Nunez", estado: "nuevo", telefono: "+598 91 302 774", email: "sofinunez@outlook.com", ultima: "ayer", interes: "Penthouse · Punta Carretas", presupuesto: 650000 },
  { id: "c04", nombre: "Matias Olivera", estado: "frio", telefono: "+598 98 551 209", email: "m.olivera@yahoo.com", ultima: "hace 9 d", interes: "Apto 3 dorm · Buceo", presupuesto: 320000 },
  { id: "c05", nombre: "Lucia Ferrari", estado: "nuevo", telefono: "+598 92 618 447", email: "lucia_ferrari@gmail.com", ultima: "hace 20 min", interes: "Duplex · Malvin", presupuesto: 250000 },
  { id: "c06", nombre: "Diego Pereyra", estado: "caliente", telefono: "+598 97 733 158", email: "dpereyra@hotmail.com", ultima: "hace 3 h", interes: "Chalet · Punta del Este", presupuesto: 1200000 },
  { id: "c07", nombre: "Camila Rossi", estado: "caliente", telefono: "+598 95 401 882", email: "camila.rossi@outlook.com", ultima: "hace 6 h", interes: "Apto 3 dorm · Punta Carretas", presupuesto: 470000 },
  { id: "c08", nombre: "Federico Bala", estado: "nuevo", telefono: "+598 93 220 596", email: "fbala@gmail.com", ultima: "ayer", interes: "PH 2 dorm · Malvin", presupuesto: 230000 },
  { id: "c09", nombre: "Agustina Vidal", estado: "caliente", telefono: "+598 96 118 340", email: "agus.vidal@yahoo.com", ultima: "hace 8 h", interes: "Apto 2 dorm · Pocitos", presupuesto: 300000 },
  { id: "c10", nombre: "Nicolas Ackermann", estado: "frio", telefono: "+598 99 067 215", email: "n.ackermann@hotmail.com", ultima: "hace 12 d", interes: "Terreno · Punta Carretas", presupuesto: 450000 },
  { id: "c11", nombre: "Martina Sena", estado: "nuevo", telefono: "+598 94 852 703", email: "martina.sena@gmail.com", ultima: "hace 12 h", interes: "Apto 1 dorm · Parque Rodo", presupuesto: 145000 },
  { id: "c12", nombre: "Joaquin Silveira", estado: "caliente", telefono: "+598 98 449 127", email: "jsilveira@nexopropiedades.com", ultima: "hace 4 h", interes: "Casa · Carrasco", presupuesto: 500000 },
  { id: "c13", nombre: "Paula Iglesias", estado: "caliente", telefono: "+598 91 776 508", email: "paula_iglesias@hotmail.com", ultima: "ayer", interes: "Casa 4 dorm · Punta del Este", presupuesto: 730000 },
  { id: "c14", nombre: "Emiliano Vazquez", estado: "frio", telefono: "+598 95 903 664", email: "evazquez@outlook.com", ultima: "hace 18 d", interes: "Apto 2 dorm · Cordon", presupuesto: 200000 },
  { id: "c15", nombre: "Carolina Techera", estado: "nuevo", telefono: "+598 99 331 720", email: "carolina.techera@yahoo.com", ultima: "hace 40 min", interes: "Apto 2 dorm · Malvin", presupuesto: 210000 },
  { id: "c16", nombre: "Gaston Prieto", estado: "caliente", telefono: "+598 92 558 913", email: "gprieto@gmail.com", ultima: "hace 7 h", interes: "PH · Parque Rodo", presupuesto: 195000 },
  { id: "c17", nombre: "Renata Delgado", estado: "caliente", telefono: "+598 96 704 285", email: "renata.delgado@hotmail.com", ultima: "ayer", interes: "Apto 3 dorm · Punta Carretas", presupuesto: 380000 },
  { id: "c18", nombre: "Bruno Machado", estado: "frio", telefono: "+598 98 210 476", email: "bmachado@outlook.com", ultima: "hace 15 d", interes: "Local · Ciudad Vieja", presupuesto: 160000 },
  { id: "c19", nombre: "Antonella Ramos", estado: "frio", telefono: "+598 94 619 037", email: "antonella.ramos@gmail.com", ultima: "hace 22 d", interes: "Casa · La Blanqueada", presupuesto: 175000 },
  { id: "c20", nombre: "Sebastian Lorenzo", estado: "frio", telefono: "+598 99 482 150", email: "s.lorenzo@yahoo.com", ultima: "hace 30 d", interes: "Apto 2 dorm · Pocitos", presupuesto: 260000 },
  { id: "c21", nombre: "Florencia Piriz", estado: "nuevo", telefono: "+598 91 855 209", email: "flor.piriz@hotmail.com", ultima: "hace 5 h", interes: "Monoambiente · Buceo", presupuesto: 150000 },
  { id: "c22", nombre: "Ignacio Bentancor", estado: "caliente", telefono: "+598 95 137 648", email: "ibentancor@nexopropiedades.com", ultima: "hace 9 h", interes: "Apto 3 dorm · Punta Carretas", presupuesto: 460000 },
  { id: "c23", nombre: "Daniela Fonseca", estado: "nuevo", telefono: "+598 93 940 176", email: "daniela_fonseca@gmail.com", ultima: "hace 1 h", interes: "Apto 2 dorm · Cordon", presupuesto: 205000 },
  { id: "c24", nombre: "Marcos Duarte", estado: "frio", telefono: "+598 94 730 915", email: "mduarte@hotmail.com", ultima: "hace 11 d", interes: "Apto 2 dorm · Centro", presupuesto: 130000 },
  { id: "c25", nombre: "Carla Bentos", estado: "nuevo", telefono: "+598 92 461 803", email: "carla.bentos@outlook.com", ultima: "hace 3 h", interes: "PH 2 dorm · Malvin", presupuesto: 225000 },
  { id: "c26", nombre: "Gonzalo Barrios", estado: "caliente", telefono: "+598 99 512 038", email: "gbarrios@yahoo.com", ultima: "hace 6 h", interes: "Apto 3 dorm · Buceo", presupuesto: 315000 },
  { id: "c27", nombre: "Emilia Sosa", estado: "nuevo", telefono: "+598 98 903 217", email: "emilia.sosa@gmail.com", ultima: "hace 2 h", interes: "Apto 2 dorm · Cordon", presupuesto: 198000 },
  { id: "c28", nombre: "Ramiro Techera", estado: "frio", telefono: "+598 92 660 471", email: "rtechera@hotmail.com", ultima: "hace 26 d", interes: "Terreno · Escobar", presupuesto: 95000 },
  { id: "c29", nombre: "Julieta Cardozo", estado: "caliente", telefono: "+598 96 384 902", email: "julieta.cardozo@outlook.com", ultima: "hace 4 h", interes: "Apto 3 dorm · Pocitos", presupuesto: 340000 },
  { id: "c30", nombre: "Hernan Fagundez", estado: "nuevo", telefono: "+598 94 108 557", email: "hfagundez@gmail.com", ultima: "hace 7 h", interes: "Casa 3 dorm · Carrasco", presupuesto: 490000 },
]

export async function getContactos(): Promise<Contacto[]> {
  await sleep(300)
  return data
}
