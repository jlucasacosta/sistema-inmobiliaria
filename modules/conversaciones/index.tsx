"use client"
import { useEffect, useState } from "react"
import { getTickets, type Ticket } from "./api"
import { barraDeLead, chipDeLead, chipDeProp, precioLargo, type EstadoLead } from "@/shell/cartera"

// Arquetipo: LISTA-TICKET. La pantalla que MANDA. Bandeja densa, no burbujas grandes.
// Cada ticket: barra de color del lead a la izquierda, nombre, ultimo mensaje (1 linea),
// propiedad consultada con precio en Fraunces y badge cuadrado de estado de la propiedad.

const filtros: Array<EstadoLead | "todos"> = ["todos", "caliente", "nuevo", "frio"]

function Metrica({ label, valor, sub }: { label: string; valor: string; sub: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] uppercase tracking-widest text-muted">{label}</span>
      <span className="precio text-2xl font-bold text-fg">{valor}</span>
      <span className="text-[11px] text-muted">{sub}</span>
    </div>
  )
}

export function ConversacionesPage() {
  const [rows, setRows] = useState<Ticket[]>([])
  const [filtro, setFiltro] = useState<EstadoLead | "todos">("todos")

  useEffect(() => {
    getTickets().then(setRows)
  }, [])

  const visibles = filtro === "todos" ? rows : rows.filter((t) => t.estadoLead === filtro)
  const sinLeer = rows.reduce((a, t) => a + t.sinLeer, 0)
  const calientes = rows.filter((t) => t.estadoLead === "caliente").length

  return (
    <div className="space-y-5">
      <header className="surface-card flex flex-wrap items-center justify-between gap-6 p-5">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">Consultas</h1>
          <p className="text-xs text-muted">Bandeja de entrada · todas las consultas entrantes</p>
        </div>
        <div className="flex flex-wrap gap-8">
          <Metrica label="Abiertas" valor={String(rows.length)} sub="consultas" />
          <Metrica label="Sin leer" valor={String(sinLeer)} sub="mensajes" />
          <Metrica label="Calientes" valor={String(calientes)} sub="responder ya" />
        </div>
      </header>

      <div className="flex flex-wrap gap-2">
        {filtros.map((f) => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={"chip capitalize transition-colors " + (filtro === f ? "bg-primary text-bg" : "bg-subtle text-muted hover:text-fg")}
          >
            {f}
          </button>
        ))}
      </div>

      <ul className="surface-card divide-y divide-border p-0">
        {visibles.map((t) => (
          <li key={t.id}>
            <button className="flex w-full items-stretch gap-3 px-3 py-3 text-left transition-colors hover:bg-subtle">
              {/* color del lead, lo que se mira de reojo */}
              <span className={"w-1 shrink-0 rounded-full " + barraDeLead[t.estadoLead]} />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="flex items-center gap-2 truncate">
                    <span className="truncate text-sm font-semibold">{t.contacto}</span>
                    <span className={"chip " + chipDeLead[t.estadoLead]}>{t.estadoLead}</span>
                  </span>
                  <span className="shrink-0 text-[11px] text-muted">{t.cuando}</span>
                </div>
                <p className="mt-0.5 truncate text-[13px] text-muted">{t.ultimo}</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="truncate text-[11px] text-muted">{t.propiedad}</span>
                  <span className={"chip shrink-0 " + chipDeProp[t.estadoProp]}>{t.estadoProp}</span>
                </div>
              </div>
              <div className="flex flex-col items-end justify-between">
                <span className="precio text-base font-bold text-fg">{precioLargo(t.precio)}</span>
                {t.sinLeer > 0 && (
                  <span className="mt-1 flex h-5 min-w-5 items-center justify-center rounded-[var(--radius)] bg-accent px-1.5 text-[11px] font-bold text-bg">
                    {t.sinLeer}
                  </span>
                )}
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
