// PATRON MOCK. Misma firma que la query real. Ver BACKEND.md.
// Arquetipo: MASTER-DETAIL. El dato sigue al arquetipo: cada oportunidad trae su
// ficha COMPLETA (comprador, propiedad, comision, historial) para el panel derecho.
// El kanban se cede a un sistema futuro (ver DISENO.md §5).
import type { Etapa } from "@/shell/cartera"

export type EventoHist = { fecha: string; texto: string }

export type Oportunidad = {
  id: string
  comprador: string
  telefono: string
  propiedad: string
  zona: string
  precio: number // U$S valor de la operacion
  comisionPct: number // 0-1, honorarios sobre la operacion
  etapa: Etapa
  actualizada: string
  nota: string
  historial: EventoHist[]
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

const data: Oportunidad[] = [
  { id: "o01", comprador: "Valentina Cabrera", telefono: "+598 94 217 663", propiedad: "Apto 2 dorm con terraza", zona: "Pocitos", precio: 268000, comisionPct: 0.03, etapa: "reserva", actualizada: "hace 2 h", nota: "Sena firmada, escritura en 30 dias.", historial: [{ fecha: "12 jul", texto: "Sena depositada U$S 8.040" }, { fecha: "8 jul", texto: "Visita con escribano" }, { fecha: "2 jul", texto: "Primera visita" }] },
  { id: "o02", comprador: "Rodrigo Methol", telefono: "+598 99 845 012", propiedad: "Casa 3 dorm con fondo", zona: "Carrasco", precio: 520000, comisionPct: 0.04, etapa: "propuesta", actualizada: "hace 5 h", nota: "Oferto U$S 495.000, espera contraoferta.", historial: [{ fecha: "11 jul", texto: "Oferta presentada" }, { fecha: "6 jul", texto: "Segunda visita con familia" }] },
  { id: "o03", comprador: "Sofia Nunez", telefono: "+598 91 302 774", propiedad: "Penthouse frente rambla", zona: "Punta Carretas", precio: 640000, comisionPct: 0.03, etapa: "visita", actualizada: "ayer", nota: "Interesada, coordina segunda visita.", historial: [{ fecha: "9 jul", texto: "Visita agendada" }, { fecha: "7 jul", texto: "Consulta por financiacion" }] },
  { id: "o04", comprador: "Matias Olivera", telefono: "+598 98 551 209", propiedad: "Apto 3 dorm con amenities", zona: "Buceo", precio: 315000, comisionPct: 0.03, etapa: "cierre", actualizada: "hace 1 h", nota: "Escritura firmada hoy.", historial: [{ fecha: "12 jul", texto: "Escritura firmada" }, { fecha: "1 jul", texto: "Sena aceptada" }, { fecha: "24 jun", texto: "Visita" }] },
  { id: "o05", comprador: "Lucia Ferrari", telefono: "+598 92 618 447", propiedad: "Duplex 3 dorm parrillero", zona: "Malvin", precio: 246000, comisionPct: 0.03, etapa: "contacto", actualizada: "hace 20 min", nota: "Consulta inicial por WhatsApp.", historial: [{ fecha: "13 jul", texto: "Primer contacto" }] },
  { id: "o06", comprador: "Diego Pereyra", telefono: "+598 97 733 158", propiedad: "Chalet 5 dorm con parque", zona: "Punta del Este", precio: 1150000, comisionPct: 0.04, etapa: "propuesta", actualizada: "hace 3 h", nota: "Comprador de exterior, opera en USD.", historial: [{ fecha: "10 jul", texto: "Oferta U$S 1.080.000" }, { fecha: "3 jul", texto: "Visita privada" }] },
  { id: "o07", comprador: "Camila Rossi", telefono: "+598 95 401 882", propiedad: "Apto 3 dorm premium", zona: "Punta Carretas", precio: 458000, comisionPct: 0.03, etapa: "reserva", actualizada: "hace 6 h", nota: "Reserva paga, revisando boleto.", historial: [{ fecha: "11 jul", texto: "Reserva U$S 13.740" }, { fecha: "5 jul", texto: "Visita" }] },
  { id: "o08", comprador: "Federico Bala", telefono: "+598 93 220 596", propiedad: "PH 2 dorm planta baja", zona: "Malvin", precio: 219000, comisionPct: 0.03, etapa: "visita", actualizada: "ayer", nota: "Pide ficha tecnica y planos.", historial: [{ fecha: "9 jul", texto: "Visita" }] },
  { id: "o09", comprador: "Agustina Vidal", telefono: "+598 96 118 340", propiedad: "Apto 2 dorm con garage", zona: "Pocitos", precio: 289000, comisionPct: 0.03, etapa: "reserva", actualizada: "hace 8 h", nota: "Sena aceptada por el propietario.", historial: [{ fecha: "10 jul", texto: "Sena aceptada" }, { fecha: "4 jul", texto: "Visita" }] },
  { id: "o10", comprador: "Nicolas Ackermann", telefono: "+598 99 067 215", propiedad: "Terreno apto edificar", zona: "Punta Carretas", precio: 430000, comisionPct: 0.04, etapa: "contacto", actualizada: "hace 1 d", nota: "Desarrollador, evalua permuta.", historial: [{ fecha: "8 jul", texto: "Primer contacto" }] },
  { id: "o11", comprador: "Martina Sena", telefono: "+598 94 852 703", propiedad: "Apto 1 dorm frente parque", zona: "Parque Rodo", precio: 138000, comisionPct: 0.03, etapa: "visita", actualizada: "hace 12 h", nota: "Primera compradora, busca credito.", historial: [{ fecha: "9 jul", texto: "Visita" }, { fecha: "6 jul", texto: "Consulta" }] },
  { id: "o12", comprador: "Joaquin Silveira", telefono: "+598 98 449 127", propiedad: "Casa 3 dorm barrio privado", zona: "Carrasco", precio: 495000, comisionPct: 0.04, etapa: "propuesta", actualizada: "hace 4 h", nota: "Ofrece 470k, negociando.", historial: [{ fecha: "11 jul", texto: "Oferta" }, { fecha: "2 jul", texto: "Visita" }] },
  { id: "o13", comprador: "Paula Iglesias", telefono: "+598 91 776 508", propiedad: "Casa 4 dorm con quincho", zona: "Punta del Este", precio: 720000, comisionPct: 0.04, etapa: "reserva", actualizada: "ayer", nota: "Reserva de temporada confirmada.", historial: [{ fecha: "10 jul", texto: "Reserva" }, { fecha: "1 jul", texto: "Visita" }] },
  { id: "o14", comprador: "Emiliano Vazquez", telefono: "+598 95 903 664", propiedad: "Apto 2 dorm a estrenar", zona: "Cordon", precio: 197000, comisionPct: 0.03, etapa: "cierre", actualizada: "hace 2 d", nota: "Operacion escriturada.", historial: [{ fecha: "5 jul", texto: "Escritura" }, { fecha: "20 jun", texto: "Sena" }] },
  { id: "o15", comprador: "Carolina Techera", telefono: "+598 99 331 720", propiedad: "Apto 2 dorm luminoso", zona: "Malvin", precio: 205000, comisionPct: 0.03, etapa: "contacto", actualizada: "hace 40 min", nota: "Consulta por disponibilidad.", historial: [{ fecha: "13 jul", texto: "Primer contacto" }] },
  { id: "o16", comprador: "Gaston Prieto", telefono: "+598 92 558 913", propiedad: "PH reciclado con patio", zona: "Parque Rodo", precio: 189000, comisionPct: 0.03, etapa: "propuesta", actualizada: "hace 7 h", nota: "Oferta sujeta a venta de su depto.", historial: [{ fecha: "10 jul", texto: "Oferta condicionada" }] },
  { id: "o17", comprador: "Renata Delgado", telefono: "+598 96 704 285", propiedad: "Apto 3 dorm con dependencia", zona: "Punta Carretas", precio: 372000, comisionPct: 0.03, etapa: "visita", actualizada: "ayer", nota: "Muy interesada, decide en la semana.", historial: [{ fecha: "9 jul", texto: "Visita" }] },
  { id: "o18", comprador: "Bruno Machado", telefono: "+598 98 210 476", propiedad: "Local comercial a la calle", zona: "Ciudad Vieja", precio: 158000, comisionPct: 0.04, etapa: "perdida", actualizada: "hace 3 d", nota: "Descarto: eligio otra ubicacion.", historial: [{ fecha: "4 jul", texto: "Descartada" }, { fecha: "28 jun", texto: "Visita" }] },
  { id: "o19", comprador: "Antonella Ramos", telefono: "+598 94 619 037", propiedad: "Casa colonial a refaccionar", zona: "La Blanqueada", precio: 174000, comisionPct: 0.03, etapa: "perdida", actualizada: "hace 4 d", nota: "Bajo presupuesto tras tasacion.", historial: [{ fecha: "3 jul", texto: "Descartada" }] },
  { id: "o20", comprador: "Sebastian Lorenzo", telefono: "+598 99 482 150", propiedad: "Apto 2 dorm con vista", zona: "Pocitos", precio: 254000, comisionPct: 0.03, etapa: "cierre", actualizada: "hace 3 d", nota: "Cerrada, comision cobrada.", historial: [{ fecha: "4 jul", texto: "Cierre" }, { fecha: "18 jun", texto: "Sena" }] },
  { id: "o21", comprador: "Florencia Piriz", telefono: "+598 91 855 209", propiedad: "Monoambiente sobre rambla", zona: "Buceo", precio: 143000, comisionPct: 0.03, etapa: "contacto", actualizada: "hace 5 h", nota: "Inversora, busca renta.", historial: [{ fecha: "13 jul", texto: "Primer contacto" }] },
  { id: "o22", comprador: "Ignacio Bentancor", telefono: "+598 95 137 648", propiedad: "Apto 3 dorm categoria", zona: "Punta Carretas", precio: 458000, comisionPct: 0.03, etapa: "propuesta", actualizada: "hace 9 h", nota: "Oferto 440k, espera respuesta.", historial: [{ fecha: "11 jul", texto: "Oferta" }, { fecha: "4 jul", texto: "Visita" }] },
]

export async function getOportunidades(): Promise<Oportunidad[]> {
  await sleep(300)
  return data
}
