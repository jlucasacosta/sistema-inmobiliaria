"use client"
import { useState } from "react"
import { getTickets } from "./api"
import { barraDeLead, chipDeLead, chipDeProp, etiquetaDeLead, precioLargo, type EstadoLead } from "@/shell/cartera"
import { useCarga, Esqueleto, ErrorCarga } from "@/shell/carga"
import { Encabezado, Metrica } from "@/shell/encabezado"

// Arquetipo: LISTA-TICKET. La pantalla que MANDA. Bandeja densa, no burbujas grandes.
// Cada ticket: barra de color del lead a la izquierda, nombre, ultimo mensaje (1 linea),
// propiedad consultada con precio en Fraunces y badge cuadrado de estado de la propiedad.
// La bandeja no abre detalle (se elimino el panel de chat, ver DISENO.md): los tickets son
// elementos de lectura, no botones. Mientras carga muestra "—" y esqueletos; si falla, reintento.

const filtros: Array<EstadoLead | "todos"> = ["todos", "caliente", "nuevo", "frio"]

export function ConversacionesPage() {
  const { data, error, cargando, reintentar } = useCarga(getTickets)
  const [filtro, setFiltro] = useState<EstadoLead | "todos">("todos")

  const rows = data ?? []
  const guion = "—"
  const visibles = filtro === "todos" ? rows : rows.filter((t) => t.estadoLead === filtro)
  const sinLeer = rows.reduce((a, t) => a + t.sinLeer, 0)
  const calientes = rows.filter((t) => t.estadoLead === "caliente").length

  return (
    <div className="space-y-5">
      <Encabezado titulo="Consultas" subtitulo="Bandeja de entrada · todas las consultas entrantes">
        <div aria-busy={cargando} className="flex flex-wrap gap-x-8 gap-y-3">
          <Metrica label="Abiertas" valor={cargando ? guion : String(rows.length)} sub="consultas" />
          <Metrica label="Sin leer" valor={cargando ? guion : String(sinLeer)} sub="mensajes" />
          <Metrica label="Calientes" valor={cargando ? guion : String(calientes)} sub="responder ya" />
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

      <section aria-label="Bandeja de consultas" aria-busy={cargando}>
        {error ? (
          <ErrorCarga mensaje="No pudimos cargar las consultas." onReintentar={reintentar} />
        ) : cargando ? (
          <div aria-hidden="true" className="surface-card space-y-2 p-3">
            {Array.from({ length: 8 }, (_, i) => (
              <Esqueleto key={i} className="h-[4.5rem]" />
            ))}
          </div>
        ) : visibles.length === 0 ? (
          <div className="surface-card px-4 py-12 text-center">
            <p className="font-heading text-base font-semibold">No hay consultas con ese estado</p>
            <button
              type="button"
              onClick={() => setFiltro("todos")}
              className="relative tap mt-3 rounded-[var(--radius)] border border-border bg-surface px-3 py-2 text-sm font-semibold text-primary hover:bg-subtle"
            >
              Ver todas
            </button>
          </div>
        ) : (
          <ul className="surface-card divide-y divide-border p-0">
            {visibles.map((t) => (
              <li key={t.id} className="flex items-stretch gap-3 px-3 py-3">
                {/* color del lead, lo que se mira de reojo */}
                <span aria-hidden="true" className={"w-1 shrink-0 rounded-full " + barraDeLead[t.estadoLead]} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="flex items-center gap-2 truncate">
                      <span className="truncate text-sm font-semibold">{t.contacto}</span>
                      <span className={"chip " + chipDeLead[t.estadoLead]}>{etiquetaDeLead[t.estadoLead]}</span>
                    </span>
                    <span className="shrink-0 text-xs text-muted">{t.cuando}</span>
                  </div>
                  <p className="mt-0.5 truncate text-sm text-muted">{t.ultimo}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="truncate text-xs text-muted">{t.propiedad}</span>
                    <span className={"chip shrink-0 capitalize " + chipDeProp[t.estadoProp]}>{t.estadoProp}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <span className="precio text-base font-bold text-fg">{precioLargo(t.precio)}</span>
                  {t.sinLeer > 0 && (
                    <span
                      role="img"
                      aria-label={`${t.sinLeer} ${t.sinLeer === 1 ? "mensaje sin leer" : "mensajes sin leer"}`}
                      className="mt-1 flex h-5 min-w-5 items-center justify-center rounded-[var(--radius)] bg-accent px-1.5 text-xs font-bold text-bg"
                    >
                      {t.sinLeer}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
