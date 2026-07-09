// PATRON MOCK. Misma firma que la query real. Reetiquetado para inmobiliaria.
export type Contact = {
  id: string
  name: string
  phone: string
  email: string
  interes: string
  status: "activo" | "nuevo" | "en seguimiento" | "perdido"
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function getContacts(): Promise<Contact[]> {
  await sleep(300)
  return [
    { id: "1", name: "Martina Rios", phone: "+54 9 11 4783-2610", email: "martina.rios@gmail.com", interes: "2 amb Villa Crespo", status: "activo" },
    { id: "2", name: "Jorge Perez", phone: "+54 9 11 5390-7124", email: "jperez@outlook.com", interes: "Casa Caballito", status: "nuevo" },
    { id: "3", name: "Camila Sosa", phone: "+54 9 341 618-4472", email: "sosa.camila@hotmail.com", interes: "3 amb Palermo", status: "en seguimiento" },
    { id: "4", name: "Diego Torres", phone: "+54 9 11 6027-3391", email: "diego.torres@gmail.com", interes: "PH Belgrano", status: "activo" },
    { id: "5", name: "Lucia Mendez", phone: "+54 9 351 274-8830", email: "lu.mendez90@gmail.com", interes: "Casa Nordelta", status: "nuevo" },
    { id: "6", name: "Pablo Vega", phone: "+54 9 261 439-5502", email: "pablo_vega@yahoo.com", interes: "Depto San Isidro", status: "perdido" },
    { id: "7", name: "Sofia Luna", phone: "+54 9 11 4915-6273", email: "sluna77@hotmail.com", interes: "Monoamb Caballito", status: "activo" },
    { id: "8", name: "Matias Aguirre", phone: "+54 9 11 3628-9014", email: "matias.aguirre@nexopropiedades.com", interes: "Local Almagro", status: "en seguimiento" },
    { id: "9", name: "Valentina Cruz", phone: "+54 9 341 507-2298", email: "cruz.valentina@hotmail.com", interes: "2 amb Rosario centro", status: "nuevo" },
    { id: "10", name: "Nicolas Ferreyra", phone: "+54 9 351 690-1145", email: "nferreyra@outlook.com", interes: "Duplex Cordoba", status: "activo" },
    { id: "11", name: "Agustina Molina", phone: "+54 9 11 5183-4076", email: "agustina_molina@yahoo.com", interes: "PH Boedo", status: "perdido" },
    { id: "12", name: "Federico Ramos", phone: "+54 9 261 812-3367", email: "fede.ramos90@gmail.com", interes: "Casa Chacras", status: "activo" },
    { id: "13", name: "Carla Benitez", phone: "+54 9 11 4471-8829", email: "carla.benitez@gmail.com", interes: "3 amb Nunez", status: "nuevo" },
    { id: "14", name: "Gonzalo Herrera", phone: "+54 9 351 356-7710", email: "gherrera77@hotmail.com", interes: "Oficina Nueva Cordoba", status: "en seguimiento" },
    { id: "15", name: "Julieta Castro", phone: "+54 9 341 229-6653", email: "castro.julieta@hotmail.com", interes: "2 amb Pichincha", status: "activo" },
    { id: "16", name: "Ramiro Silva", phone: "+54 9 11 6704-2218", email: "rsilva@outlook.com", interes: "Terreno Escobar", status: "perdido" },
    { id: "17", name: "Florencia Diaz", phone: "+54 9 261 548-9074", email: "flor_diaz@yahoo.com", interes: "Depto Godoy Cruz", status: "nuevo" },
    { id: "18", name: "Sebastian Ortiz", phone: "+54 9 11 3915-6640", email: "sebastian.ortiz@gmail.com", interes: "Casa San Fernando", status: "activo" },
    { id: "19", name: "Micaela Romero", phone: "+54 9 341 703-1182", email: "mica.romero90@gmail.com", interes: "Loft Rosario norte", status: "en seguimiento" },
    { id: "20", name: "Tomas Gimenez", phone: "+54 9 351 462-8895", email: "tgimenez@outlook.com", interes: "PH Alta Cordoba", status: "nuevo" },
    { id: "21", name: "Belen Acosta", phone: "+54 9 11 5240-7318", email: "acosta.belen@hotmail.com", interes: "2 amb Colegiales", status: "activo" },
    { id: "22", name: "Ezequiel Paz", phone: "+54 9 261 371-4429", email: "ezequiel_paz@yahoo.com", interes: "Casa Lujan de Cuyo", status: "perdido" },
    { id: "23", name: "Rocio Medina", phone: "+54 9 11 4082-5567", email: "rocio.medina@nexopropiedades.com", interes: "4 amb Recoleta", status: "activo" },
    { id: "24", name: "Ignacio Suarez", phone: "+54 9 341 815-2203", email: "isuarez77@hotmail.com", interes: "Deposito Rosario sur", status: "en seguimiento" },
    { id: "25", name: "Antonella Ruiz", phone: "+54 9 351 528-6691", email: "antonella.ruiz@nexopropiedades.com", interes: "Depto Cerro", status: "nuevo" },
    { id: "26", name: "Franco Dominguez", phone: "+54 9 11 6359-4470", email: "fdominguez@outlook.com", interes: "Casa Pilar", status: "activo" },
    { id: "27", name: "Paula Navarro", phone: "+54 9 261 604-7783", email: "paula_navarro@yahoo.com", interes: "Monoamb Ciudad", status: "perdido" },
    { id: "28", name: "Leandro Vera", phone: "+54 9 11 3746-9925", email: "leandro.vera@nexopropiedades.com", interes: "3 amb Saavedra", status: "activo" },
    { id: "29", name: "Daniela Campos", phone: "+54 9 341 490-3316", email: "dani.campos90@gmail.com", interes: "PH Echesortu", status: "nuevo" },
    { id: "30", name: "Hernan Gil", phone: "+54 9 351 217-8804", email: "hernan.gil@hotmail.com", interes: "Casa Villa Allende", status: "en seguimiento" },
  ]
}
