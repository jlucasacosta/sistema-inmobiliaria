"use client"
import { useState } from "react"
import { getContactos, type Contacto } from "./api"
import { chipDeLead, barraDeLead, etiquetaDeLead, precioLargo, type EstadoLead } from "@/shell/cartera"
import { useCarga, Esqueleto, ErrorCarga } from "@/shell/carga"
import { FichaLateral, DatoFicha, AvisoDemo, botonPrimario, botonSecundario } from "@/shell/ficha-lateral"
import { Encabezado, Metrica } from "@/shell/encabezado"
import { BaseChip } from "@/shell/chip"

// Arquetipo: TABLA-DENSA (ledger). Filas finas, divisorias de 1px. Se ve primero la
// columna de estado (color) y el presupuesto (Fraunces). Aca SI va tabla (la ficha
// se la asigna a contactos): dentro del sistema no se repite arquetipo.
// Cada fila abre la ficha del contacto (FichaLateral) con acciones de demostracion.

const filtros: Array<EstadoLead | "todos"> = ["todos", "nuevo", "caliente", "frio"]
const FILAS_ESQUELETO = 10

export function ContactosPage() {
  const { data, error, cargando, reintentar } = useCarga(getContactos)
  const [filtro, setFiltro] = useState<EstadoLead | "todos">("todos")
  const [sel, setSel] = useState<Contacto | null>(null)
  const [aviso, setAviso] = useState<string | null>(null)

  const rows = data ?? []
  const visibles = filtro === "todos" ? rows : rows.filter((r) => r.estado === filtro)
  const guion = "—"
  const calientes = rows.filter((r) => r.estado === "caliente").length
  const nuevos = rows.filter((r) => r.estado === "nuevo").length

  function abrir(c: Contacto) {
    setAviso(null)
    setSel(c)
  }

  return (
    <div className="space-y-5">
      <Encabezado titulo="Contactos" subtitulo="Directorio de leads de Nexo Propiedades">
        <div aria-busy={cargando} className="flex flex-wrap gap-x-8 gap-y-3">
          <Metrica label="Total" valor={cargando ? guion : String(rows.length)} sub="en directorio" />
          <Metrica label="Calientes" valor={cargando ? guion : String(calientes)} sub="a seguir hoy" />
          <Metrica label="Nuevos" valor={cargando ? guion : String(nuevos)} sub="sin contactar" />
        </div>
      </Encabezado>

      <div role="group" aria-label="Filtrar por estado del lead" className="flex flex-wrap gap-2">
        {filtros.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFiltro(f)}
            aria-pressed={filtro === f}
            className={"tap chip relative capitalize transition-colors " + (filtro === f ? "bg-primary text-bg" : "bg-subtle text-muted hover:text-fg")}
          >
            {f === "todos" ? f : etiquetaDeLead[f]}
          </button>
        ))}
      </div>

      <section aria-label="Tabla de contactos" aria-busy={cargando}>
        {error ? (
          <ErrorCarga mensaje="No pudimos cargar los contactos." onReintentar={reintentar} />
        ) : cargando ? (
          <div aria-hidden="true" className="surface-card space-y-2 p-4">
            {Array.from({ length: FILAS_ESQUELETO }, (_, i) => (
              <Esqueleto key={i} className="h-11" />
            ))}
          </div>
        ) : visibles.length === 0 ? (
          <div className="surface-card px-4 py-12 text-center">
            <p className="font-heading text-base font-semibold">No hay contactos con ese estado</p>
            <button
              type="button"
              onClick={() => setFiltro("todos")}
              className="relative tap mt-3 rounded-[var(--radius)] border border-border bg-surface px-3 py-2 text-sm font-semibold text-primary hover:bg-subtle"
            >
              Ver todos
            </button>
          </div>
        ) : (
          <div role="region" aria-label="Contactos, con scroll horizontal" className="surface-card overflow-x-auto p-0">
            <table className="w-full min-w-[52rem] border-collapse text-sm">
              <caption className="sr-only">Directorio de leads: estado, teléfono, última interacción, interés y presupuesto. Cada nombre abre la ficha.</caption>
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted">
                  <th scope="col" className="px-4 py-2 font-semibold">Nombre</th>
                  <th scope="col" className="px-4 py-2 font-semibold">Estado</th>
                  <th scope="col" className="px-4 py-2 font-semibold">Teléfono</th>
                  <th scope="col" className="px-4 py-2 font-semibold">Última</th>
                  <th scope="col" className="px-4 py-2 font-semibold">Interés</th>
                  <th scope="col" className="px-4 py-2 text-right font-semibold">Presupuesto</th>
                </tr>
              </thead>
              <tbody>
                {visibles.map((r) => (
                  <tr
                    key={r.id}
                    onClick={() => abrir(r)}
                    className="cursor-pointer border-b border-border transition-colors last:border-0 hover:bg-subtle"
                  >
                    <th scope="row" className="px-4 py-2 text-left font-normal">
                      <span className="flex items-center gap-2">
                        <span aria-hidden="true" className={"h-2 w-2 shrink-0 rounded-full " + barraDeLead[r.estado]} />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            abrir(r)
                          }}
                          className="tap relative rounded-[var(--radius)] text-left font-medium text-fg hover:underline"
                        >
                          {r.nombre}
                        </button>
                      </span>
                      <span className="ml-4 block truncate text-xs text-muted">{r.email}</span>
                    </th>
                    <td className="px-4 py-2"><BaseChip><span className={"chip " + chipDeLead[r.estado]}>{etiquetaDeLead[r.estado]}</span></BaseChip></td>
                    <td className="whitespace-nowrap px-4 py-2 tabular-nums text-muted">{r.telefono}</td>
                    <td className="whitespace-nowrap px-4 py-2 text-muted">{r.ultima}</td>
                    <td className="whitespace-nowrap px-4 py-2 text-muted">{r.interes}</td>
                    <td className="px-4 py-2 text-right"><span className="precio font-bold text-fg">{precioLargo(r.presupuesto)}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <FichaLateral
        abierta={!!sel}
        titulo={sel?.nombre ?? ""}
        subtitulo={sel ? `Lead ${etiquetaDeLead[sel.estado]} · última interacción ${sel.ultima}` : undefined}
        onCerrar={() => setSel(null)}
        acciones={
          sel && (
            <>
              <button
                type="button"
                onClick={() => setAviso(`Demo: no se guardó nada. No se llamó a ${sel.nombre}.`)}
                className={botonPrimario}
              >
                Llamar
              </button>
              <button
                type="button"
                onClick={() => setAviso(`Demo: no se guardó nada. No se envió ninguna propiedad a ${sel.nombre}.`)}
                className={botonSecundario}
              >
                Enviar propiedades
              </button>
              <button
                type="button"
                onClick={() => setAviso(`Demo: no se guardó nada. El estado de ${sel.nombre} no cambió.`)}
                className={botonSecundario}
              >
                Cambiar estado
              </button>
            </>
          )
        }
      >
        {sel && (
          <>
            <div className="mb-4">
              <span className={"chip " + chipDeLead[sel.estado]}>{etiquetaDeLead[sel.estado]}</span>
            </div>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
              <DatoFicha etiqueta="Teléfono"><span className="tabular-nums">{sel.telefono}</span></DatoFicha>
              <DatoFicha etiqueta="Última interacción">{sel.ultima}</DatoFicha>
              <div className="col-span-2">
                <DatoFicha etiqueta="Email"><span className="break-all">{sel.email}</span></DatoFicha>
              </div>
              <div className="col-span-2">
                <DatoFicha etiqueta="Interés">{sel.interes}</DatoFicha>
              </div>
              <DatoFicha etiqueta="Presupuesto"><span className="precio font-bold">{precioLargo(sel.presupuesto)}</span></DatoFicha>
              <DatoFicha etiqueta="Estado del lead">{etiquetaDeLead[sel.estado]}</DatoFicha>
            </dl>
            <AvisoDemo texto={aviso} />
          </>
        )}
      </FichaLateral>
    </div>
  )
}
