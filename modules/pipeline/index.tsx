"use client"
import { useEffect, useState } from "react"
import { Phone, Clock } from "lucide-react"
import { getOportunidades, type Oportunidad } from "./api"
import {
  chipDeEtapa,
  rellenoDeEtapa,
  probabilidad,
  precioLargo,
  precioCompacto,
} from "@/shell/cartera"

// Arquetipo: MASTER-DETAIL. Lista de oportunidades a la izquierda, ficha completa a
// la derecha con barra de probabilidad por etapa (probabilidad viene del theme).

function comision(o: Oportunidad): number {
  return Math.round(o.precio * o.comisionPct)
}

function Metrica({ label, valor, sub }: { label: string; valor: string; sub: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] uppercase tracking-widest text-muted">{label}</span>
      <span className="precio text-2xl font-bold text-fg">{valor}</span>
      <span className="text-[11px] text-muted">{sub}</span>
    </div>
  )
}

function Detalle({ o }: { o: Oportunidad }) {
  const prob = probabilidad(o.etapa)
  const com = comision(o)
  return (
    <div className="surface-card flex-1 space-y-5 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-4">
        <div>
          <h2 className="font-heading text-xl font-bold tracking-tight">{o.comprador}</h2>
          <p className="mt-1 flex items-center gap-3 text-xs text-muted">
            <span className="flex items-center gap-1"><Phone size={12} />{o.telefono}</span>
            <span className="flex items-center gap-1"><Clock size={12} />{o.actualizada}</span>
          </p>
        </div>
        <span className={"chip " + chipDeEtapa[o.etapa]}>{o.etapa}</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-muted">Propiedad</p>
          <p className="font-heading text-sm font-semibold">{o.propiedad}</p>
          <p className="text-xs text-muted">{o.zona}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-muted">Valor de operacion</p>
          <p className="precio text-2xl font-bold text-fg">{precioLargo(o.precio)}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-[var(--radius)] bg-subtle p-4">
          <p className="text-[10px] uppercase tracking-widest text-muted">Comision proyectada</p>
          <p className="precio text-3xl font-bold text-primary">{precioLargo(com)}</p>
          <p className="mt-1 text-[11px] text-muted">{Math.round(o.comisionPct * 100)}% de honorarios</p>
        </div>
        <div className="rounded-[var(--radius)] bg-subtle p-4">
          <p className="mb-2 flex items-baseline justify-between text-[10px] uppercase tracking-widest text-muted">
            Probabilidad de cierre <span className="precio text-lg font-bold text-fg">{Math.round(prob * 100)}%</span>
          </p>
          <div className="h-3 overflow-hidden rounded-[var(--radius)] bg-surface">
            <div className={"barra-anim h-full rounded-[var(--radius)] " + rellenoDeEtapa[o.etapa]} style={{ width: prob * 100 + "%" }} />
          </div>
          <p className="mt-2 text-[11px] text-muted">
            ponderado: <span className="precio font-bold text-fg">{precioLargo(Math.round(com * prob))}</span>
          </p>
        </div>
      </div>

      <div className="rounded-[var(--radius)] border border-border p-4">
        <p className="text-sm">{o.nota}</p>
      </div>

      <div>
        <p className="mb-3 text-[10px] uppercase tracking-widest text-muted">Historial</p>
        <ol className="relative space-y-4 border-l border-border pl-5">
          {o.historial.map((h, i) => (
            <li key={i} className="relative">
              <span className={"absolute -left-[1.42rem] top-1 h-2.5 w-2.5 rounded-full " + (i === 0 ? rellenoDeEtapa[o.etapa] : "bg-border")} />
              <p className="text-xs font-medium text-muted">{h.fecha}</p>
              <p className="text-sm">{h.texto}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

export function PipelinePage() {
  const [opps, setOpps] = useState<Oportunidad[]>([])
  const [selId, setSelId] = useState<string | null>(null)

  useEffect(() => {
    getOportunidades().then((d) => {
      setOpps(d)
      setSelId(d[0]?.id ?? null)
    })
  }, [])

  const sel = opps.find((o) => o.id === selId) ?? null
  const activas = opps.filter((o) => o.etapa !== "cierre" && o.etapa !== "perdida")
  const valorPipeline = activas.reduce((a, o) => a + o.precio, 0)
  const forecast = activas.reduce((a, o) => a + comision(o) * probabilidad(o.etapa), 0)

  return (
    <div className="space-y-5">
      <header className="surface-card flex flex-wrap items-center justify-between gap-6 p-5">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">Pipeline</h1>
          <p className="text-xs text-muted">Oportunidades en curso</p>
        </div>
        <div className="flex flex-wrap gap-8">
          <Metrica label="Activas" valor={String(activas.length)} sub={`${opps.length} totales`} />
          <Metrica label="Valor en pipeline" valor={precioLargo(valorPipeline)} sub="operaciones activas" />
          <Metrica label="Forecast ponderado" valor={precioLargo(Math.round(forecast))} sub="comision esperada" />
        </div>
      </header>

      <div className="flex flex-col gap-5 lg:flex-row">
        {/* MASTER: lista de oportunidades */}
        <ul className="surface-card max-h-[38rem] w-full shrink-0 divide-y divide-border overflow-y-auto p-0 lg:w-80">
          {opps.map((o) => {
            const active = o.id === selId
            return (
              <li key={o.id}>
                <button
                  onClick={() => setSelId(o.id)}
                  className={"flex w-full flex-col gap-1 border-l-[3px] px-4 py-3 text-left transition-colors " + (active ? "border-primary bg-subtle" : "border-transparent hover:bg-subtle")}
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="truncate text-sm font-semibold">{o.comprador}</span>
                    <span className="precio shrink-0 text-sm font-bold text-fg">{precioCompacto(o.precio)}</span>
                  </div>
                  <span className="truncate text-xs text-muted">{o.propiedad} · {o.zona}</span>
                  <span className={"chip mt-1 self-start " + chipDeEtapa[o.etapa]}>{o.etapa}</span>
                </button>
              </li>
            )
          })}
        </ul>

        {/* DETAIL */}
        {sel ? <Detalle o={sel} /> : <div className="surface-card flex-1 p-6 text-sm text-muted">Selecciona una oportunidad</div>}
      </div>
    </div>
  )
}
