// PATRON MOCK. Misma firma que la query real. Ver BACKEND.md.
export type Llamada = {
  id: string
  contacto: string
  fecha: string
  duracion: string
  resultado: "agendada" | "seguimiento" | "sin respuesta" | "cancelada"
  resumen: string
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function getLlamadas(): Promise<Llamada[]> {
  await sleep(300)
  return [
    { id: "1", contacto: "Martina Rios", fecha: "Hoy 14:10", duracion: "4:32", resultado: "agendada", resumen: "Interesada en el 2 ambientes de Villa Crespo. Coordina visita para el sabado a las 11." },
    { id: "2", contacto: "Jorge Perez", fecha: "Hoy 11:05", duracion: "2:18", resultado: "seguimiento", resumen: "Consulta si la casa de Caballito acepta financiacion. Presupuesto hasta USD 260.000." },
    { id: "3", contacto: "Camila Sosa", fecha: "Hoy 10:22", duracion: "6:05", resultado: "agendada", resumen: "Busca 3 ambientes en Palermo. Agenda visita para el jueves y pide ficha tecnica." },
    { id: "4", contacto: "Diego Torres", fecha: "Ayer 17:40", duracion: "3:47", resultado: "seguimiento", resumen: "Oferto por el PH de Belgrano. Espera respuesta del propietario esta semana." },
    { id: "5", contacto: "Pablo Vega", fecha: "Ayer 16:15", duracion: "0:38", resultado: "cancelada", resumen: "Cancela la visita al depto de San Isidro. Frena la busqueda por unos meses." },
    { id: "6", contacto: "Lucia Mendez", fecha: "Ayer 15:03", duracion: "5:12", resultado: "agendada", resumen: "Confirma visita a la casa de Nordelta el domingo al mediodia con su pareja." },
    { id: "7", contacto: "Sofia Luna", fecha: "Ayer 12:47", duracion: "7:24", resultado: "seguimiento", resumen: "Avanza con la sena del monoambiente de Caballito. Coordina firma con la escribania." },
    { id: "8", contacto: "Matias Aguirre", fecha: "Ayer 11:31", duracion: "0:00", resultado: "sin respuesta", resumen: "No atiende. Se deja mensaje por el local de Almagro y se reprograma el llamado." },
    { id: "9", contacto: "Valentina Cruz", fecha: "Ayer 10:08", duracion: "3:19", resultado: "seguimiento", resumen: "Pide fotos del 2 amb en Rosario centro y disponibilidad para visita de tarde." },
    { id: "10", contacto: "Nicolas Ferreyra", fecha: "Lun 18:22", duracion: "4:56", resultado: "agendada", resumen: "Agenda visita al duplex de Nueva Cordoba para el martes a las 17." },
    { id: "11", contacto: "Agustina Molina", fecha: "Lun 16:40", duracion: "1:12", resultado: "cancelada", resumen: "Da de baja la busqueda del PH de Boedo. Consiguio propiedad por otra via." },
    { id: "12", contacto: "Federico Ramos", fecha: "Lun 15:05", duracion: "5:48", resultado: "seguimiento", resumen: "Analiza la casa de Chacras de Coria. Pide tasacion de su depto para permuta." },
    { id: "13", contacto: "Carla Benitez", fecha: "Lun 12:33", duracion: "2:41", resultado: "agendada", resumen: "Coordina visita al 3 amb de Nunez para el miercoles a las 10." },
    { id: "14", contacto: "Gonzalo Herrera", fecha: "Lun 11:19", duracion: "0:00", resultado: "sin respuesta", resumen: "Buzon de voz. Se envia info de la oficina en Nueva Cordoba por WhatsApp." },
    { id: "15", contacto: "Julieta Castro", fecha: "Vie 17:52", duracion: "6:33", resultado: "agendada", resumen: "Confirma visita al 2 amb de Pichincha. Muy interesada, quiere reservar." },
    { id: "16", contacto: "Ramiro Silva", fecha: "Vie 16:10", duracion: "0:45", resultado: "cancelada", resumen: "Cancela interes por el terreno de Escobar. El precio quedo fuera de presupuesto." },
    { id: "17", contacto: "Florencia Diaz", fecha: "Vie 14:27", duracion: "3:58", resultado: "seguimiento", resumen: "Consulta expensas del depto de Godoy Cruz. Pide comparativa con otra unidad." },
    { id: "18", contacto: "Sebastian Ortiz", fecha: "Vie 12:14", duracion: "4:11", resultado: "agendada", resumen: "Agenda segunda visita a la casa de San Fernando con un arquitecto." },
    { id: "19", contacto: "Belen Acosta", fecha: "Vie 10:39", duracion: "5:27", resultado: "seguimiento", resumen: "Negocia el alquiler del 2 amb de Colegiales. Solicita revisar la garantia." },
    { id: "20", contacto: "Tomas Gimenez", fecha: "Jue 18:05", duracion: "0:00", resultado: "sin respuesta", resumen: "No contesta. Se reintenta manana por el PH de Alta Cordoba." },
    { id: "21", contacto: "Rocio Medina", fecha: "Jue 16:48", duracion: "7:02", resultado: "agendada", resumen: "Cierra fecha de escritura del 4 amb de Recoleta. Coordina con la escribania." },
    { id: "22", contacto: "Franco Dominguez", fecha: "Jue 15:20", duracion: "4:44", resultado: "seguimiento", resumen: "Revisa la oferta por la casa de Pilar. Espera contraoferta del vendedor." },
  ]
}
