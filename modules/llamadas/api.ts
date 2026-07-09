// PATRON MOCK. Misma firma que la query real. Ver BACKEND.md.
// Arquetipo: TIMELINE. El dato sigue al arquetipo: cada llamada trae HORA y duracion
// para ubicarse en el eje vertical del dia. La mas reciente arriba.
import type { Resultado } from "@/shell/cartera"

export type Llamada = {
  id: string
  hora: string // HH:MM del dia de hoy
  contacto: string
  telefono: string
  propiedad: string
  duracionSeg: number
  resultado: Resultado
  nextStep: string
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

// Ordenadas de mas reciente (arriba) a mas antigua. Todas de HOY.
const data: Llamada[] = [
  { id: "l01", hora: "17:42", contacto: "Valentina Cabrera", telefono: "+598 94 217 663", propiedad: "Apto 2 dorm · Pocitos", duracionSeg: 272, resultado: "agendada", nextStep: "Firma de sena el jueves 10:00" },
  { id: "l02", hora: "17:15", contacto: "Bruno Machado", telefono: "+598 98 210 476", propiedad: "Local · Ciudad Vieja", duracionSeg: 96, resultado: "descartado", nextStep: "Eligio otra ubicacion, cerrar" },
  { id: "l03", hora: "16:50", contacto: "Sofia Nunez", telefono: "+598 91 302 774", propiedad: "Penthouse · Punta Carretas", duracionSeg: 365, resultado: "interesado", nextStep: "Enviar ficha y coordinar 2da visita" },
  { id: "l04", hora: "16:20", contacto: "Gonzalo Barrios", telefono: "+598 99 512 038", propiedad: "Apto 3 dorm · Buceo", duracionSeg: 0, resultado: "sin respuesta", nextStep: "Reintentar manana temprano" },
  { id: "l05", hora: "15:58", contacto: "Camila Rossi", telefono: "+598 95 401 882", propiedad: "Apto 3 dorm · Punta Carretas", duracionSeg: 418, resultado: "agendada", nextStep: "Revisar boleto de reserva" },
  { id: "l06", hora: "15:30", contacto: "Federico Bala", telefono: "+598 93 220 596", propiedad: "PH 2 dorm · Malvin", duracionSeg: 187, resultado: "interesado", nextStep: "Mandar planos por mail" },
  { id: "l07", hora: "15:05", contacto: "Martina Sena", telefono: "+598 94 852 703", propiedad: "Apto 1 dorm · Parque Rodo", duracionSeg: 243, resultado: "interesado", nextStep: "Derivar a asesor de credito" },
  { id: "l08", hora: "14:40", contacto: "Ramiro Techera", telefono: "+598 92 660 471", propiedad: "Terreno · Escobar", duracionSeg: 54, resultado: "descartado", nextStep: "Fuera de presupuesto" },
  { id: "l09", hora: "14:12", contacto: "Lucia Ferrari", telefono: "+598 92 618 447", propiedad: "Duplex 3 dorm · Malvin", duracionSeg: 201, resultado: "agendada", nextStep: "Visita el sabado 11:00" },
  { id: "l10", hora: "13:48", contacto: "Diego Pereyra", telefono: "+598 97 733 158", propiedad: "Chalet 5 dorm · Punta del Este", duracionSeg: 512, resultado: "interesado", nextStep: "Espera contraoferta del vendedor" },
  { id: "l11", hora: "13:20", contacto: "Renata Delgado", telefono: "+598 96 704 285", propiedad: "Apto 3 dorm · Punta Carretas", duracionSeg: 298, resultado: "interesado", nextStep: "Decide en la semana" },
  { id: "l12", hora: "12:55", contacto: "Ignacio Bentancor", telefono: "+598 95 137 648", propiedad: "Apto 3 dorm · Punta Carretas", duracionSeg: 176, resultado: "interesado", nextStep: "Presentar oferta al propietario" },
  { id: "l13", hora: "12:30", contacto: "Paula Iglesias", telefono: "+598 91 776 508", propiedad: "Casa 4 dorm · Punta del Este", duracionSeg: 331, resultado: "agendada", nextStep: "Confirmar reserva de temporada" },
  { id: "l14", hora: "12:02", contacto: "Emilia Sosa", telefono: "+598 98 903 217", propiedad: "Apto 2 dorm · Cordon", duracionSeg: 0, resultado: "sin respuesta", nextStep: "Dejo mensaje de voz" },
  { id: "l15", hora: "11:38", contacto: "Joaquin Silveira", telefono: "+598 98 449 127", propiedad: "Casa 3 dorm · Carrasco", duracionSeg: 254, resultado: "interesado", nextStep: "Negociando 470k" },
  { id: "l16", hora: "11:10", contacto: "Carolina Techera", telefono: "+598 99 331 720", propiedad: "Apto 2 dorm · Malvin", duracionSeg: 143, resultado: "agendada", nextStep: "Visita el viernes 16:00" },
  { id: "l17", hora: "10:44", contacto: "Sebastian Lorenzo", telefono: "+598 99 482 150", propiedad: "Apto 2 dorm · Pocitos", duracionSeg: 88, resultado: "descartado", nextStep: "Ya compro por otra via" },
  { id: "l18", hora: "10:18", contacto: "Agustina Vidal", telefono: "+598 96 118 340", propiedad: "Apto 2 dorm · Pocitos", duracionSeg: 377, resultado: "agendada", nextStep: "Sena aceptada, coordinar escribania" },
  { id: "l19", hora: "09:52", contacto: "Nicolas Ackermann", telefono: "+598 99 067 215", propiedad: "Terreno · Punta Carretas", duracionSeg: 226, resultado: "interesado", nextStep: "Evalua permuta, pedir tasacion" },
  { id: "l20", hora: "09:30", contacto: "Florencia Piriz", telefono: "+598 91 855 209", propiedad: "Monoambiente · Buceo", duracionSeg: 164, resultado: "interesado", nextStep: "Busca renta, enviar numeros" },
  { id: "l21", hora: "09:08", contacto: "Marcos Duarte", telefono: "+598 94 730 915", propiedad: "Apto 2 dorm · Centro", duracionSeg: 0, resultado: "sin respuesta", nextStep: "Reintentar al mediodia" },
  { id: "l22", hora: "08:45", contacto: "Gaston Prieto", telefono: "+598 92 558 913", propiedad: "PH · Parque Rodo", duracionSeg: 209, resultado: "interesado", nextStep: "Oferta sujeta a venta de su depto" },
]

export async function getLlamadas(): Promise<Llamada[]> {
  await sleep(300)
  return data
}
