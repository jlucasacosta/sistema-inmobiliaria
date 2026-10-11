"use client"
import { useEffect, useState } from "react"
import { getContactos, type Contacto } from "./api"
import { chipDeLead, barraDeLead, etiquetaDeLead, precioLargo, type EstadoLead } from "@/shell/cartera"

// Arquetipo: TABLA-DENSA (ledger). Filas finas, divisorias de 1px. Se ve primero la
// columna de estado (color) y el presupuesto (Fraunces). Aca SI va tabla (la ficha
// se la asigna a contactos): dentro del sistema no se repite arquetipo.

const filtros: Array<EstadoLead | "todos"> = ["todos", "nuevo", "caliente", "frio"]

function Metrica({ label, valor, sub }: { label: string; valor: string; sub: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] uppercase tracking-widest text-muted">{label}</span>
      <span className="precio text-2xl font-bold text-fg">{valor}</span>
      <span className="text-[11px] text-muted">{sub}</span>
    </div>
  )
}

export function ContactosPage() {
  const [rows, setRows] = useState<Contacto[]>([])
  const [filtro, setFiltro] = useState<EstadoLead | "todos">("todos")

  useEffect(() => {
    getContactos().then(setRows)
  }, [])

  const visibles = filtro === "todos" ? rows : rows.filter((r) => r.estado === filtro)
  const calientes = rows.filter((r) => r.estado === "caliente").length
  const nuevos = rows.filter((r) => r.estado === "nuevo").length

  return (
    <div className="space-y-5">
      <header className="surface-card flex flex-wrap items-center justify-between gap-6 p-5">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">Contactos</h1>
          <p className="text-xs text-muted">Directorio de leads de Nexo Propiedades</p>
        </div>
        <div className="flex flex-wrap gap-8">
          <Metrica label="Total" valor={String(rows.length)} sub="en directorio" />
          <Metrica label="Calientes" valor={String(calientes)} sub="a seguir hoy" />
          <Metrica label="Nuevos" valor={String(nuevos)} sub="sin contactar" />
        </div>
      </header>

      <div role="group" aria-label="Filtrar por estado del lead" className="flex flex-wrap gap-2">
        {filtros.map((f) => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            aria-pressed={filtro === f}
            className={"tap chip relative capitalize transition-colors " + (filtro === f ? "bg-primary text-bg" : "bg-subtle text-muted hover:text-fg")}
          >
            {f === "todos" ? f : etiquetaDeLead[f]}
          </button>
        ))}
      </div>

      <div role="region" aria-label="Tabla de contactos" tabIndex={0} className="surface-card overflow-x-auto p-0">
        <table className="w-full min-w-[52rem] border-collapse text-sm">
          <caption className="sr-only">Directorio de leads: estado, teléfono, última interacción, interés y presupuesto</caption>
          <thead>
            <tr className="border-b border-border text-left text-[10px] uppercase tracking-widest text-muted">
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
              <tr key={r.id} className="border-b border-border transition-colors last:border-0 hover:bg-subtle">
                <td className="px-4 py-2">
                  <span className="flex items-center gap-2">
                    <span className={"h-2 w-2 rounded-full " + barraDeLead[r.estado]} />
                    <span className="font-medium">{r.nombre}</span>
                  </span>
                  <span className="ml-4 block truncate text-[11px] text-muted">{r.email}</span>
                </td>
                <td className="px-4 py-2"><span className={"chip " + chipDeLead[r.estado]}>{etiquetaDeLead[r.estado]}</span></td>
                <td className="px-4 py-2 tabular-nums text-muted">{r.telefono}</td>
                <td className="px-4 py-2 text-muted">{r.ultima}</td>
                <td className="px-4 py-2 text-muted">{r.interes}</td>
                <td className="px-4 py-2 text-right"><span className="precio font-bold text-fg">{precioLargo(r.presupuesto)}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
