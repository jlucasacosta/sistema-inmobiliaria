"use client"
import { useRef, useState } from "react"
import { Phone, Clock } from "lucide-react"
import { getOportunidades, type Oportunidad } from "./api"
import {
  chipDeEtapa,
  rellenoDeEtapa,
  probabilidad,
  precioLargo,
  precioCompacto,
} from "@/shell/cartera"
import { useCarga, Esqueleto, ErrorCarga } from "@/shell/carga"
import { Encabezado, Metrica } from "@/shell/encabezado"
import { BaseChip } from "@/shell/chip"

// Arquetipo: MASTER-DETAIL. Lista de oportunidades a la izquierda, ficha completa a
// la derecha con barra de probabilidad por etapa (probabilidad viene del theme).
// Mientras carga muestra "—" y esqueletos estaticos; si falla, ErrorCarga con reintento.

function comision(o: Oportunidad): number {
  return Math.round(o.precio * o.comisionPct)
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
            <span className="flex items-center gap-1"><Phone size={12} aria-hidden="true" />{o.telefono}</span>
            <span className="flex items-center gap-1"><Clock size={12} aria-hidden="true" />{o.actualizada}</span>
          </p>
        </div>
        <span className={"chip capitalize " + chipDeEtapa[o.etapa]}>{o.etapa}</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs text-muted">Propiedad</p>
          <p className="font-heading text-sm font-semibold">{o.propiedad}</p>
          <p className="text-xs text-muted">{o.zona}</p>
        </div>
        <div>
          <p className="text-xs text-muted">Valor de operación</p>
          <p className="precio text-2xl font-bold text-fg">{precioLargo(o.precio)}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-[var(--radius)] bg-subtle p-4">
          <p className="text-xs text-muted">Comisión proyectada</p>
          <p className="precio text-3xl font-bold text-primary">{precioLargo(com)}</p>
          <p className="mt-1 text-xs text-muted">{Math.round(o.comisionPct * 100)}% de honorarios</p>
        </div>
        <div className="rounded-[var(--radius)] bg-subtle p-4">
          <p className="mb-2 flex items-baseline justify-between text-xs text-muted">
            Probabilidad de cierre <span className="precio text-lg font-bold text-fg">{Math.round(prob * 100)}%</span>
          </p>
          <div className="h-3 overflow-hidden rounded-[var(--radius)] bg-surface">
            <div className={"h-full rounded-[var(--radius)] " + rellenoDeEtapa[o.etapa]} style={{ width: prob * 100 + "%" }} />
          </div>
          <p className="mt-2 text-xs text-muted">
            ponderado: <span className="precio font-bold text-fg">{precioLargo(Math.round(com * prob))}</span>
          </p>
        </div>
      </div>

      <div className="rounded-[var(--radius)] border border-border p-4">
        <p className="text-sm">{o.nota}</p>
      </div>

      <div>
        <p className="mb-3 text-xs text-muted">Historial</p>
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
  const { data, error, cargando, reintentar } = useCarga(getOportunidades)
  const [elegida, setElegida] = useState<string | null>(null)
  const detalleRef = useRef<HTMLDivElement>(null)

  const opps = data ?? []
  const guion = "—"
  // Sin eleccion del usuario, se muestra la primera oportunidad de la lista.
  const selId = elegida ?? opps[0]?.id ?? null

  // En celular la lista y el detalle van apilados: al elegir una oportunidad, el detalle se lleva a la vista.
  function elegir(id: string) {
    setElegida(id)
    if (window.matchMedia("(max-width: 1023px)").matches) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      detalleRef.current?.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" })
    }
  }

  const sel = opps.find((o) => o.id === selId) ?? null
  const activas = opps.filter((o) => o.etapa !== "cierre" && o.etapa !== "perdida")
  const valorPipeline = activas.reduce((a, o) => a + o.precio, 0)
  const forecast = activas.reduce((a, o) => a + comision(o) * probabilidad(o.etapa), 0)

  return (
    <div className="space-y-5">
      <Encabezado titulo="Pipeline" subtitulo="Oportunidades en curso">
        <div aria-busy={cargando} className="flex flex-wrap gap-x-8 gap-y-3">
          <Metrica label="Activas" valor={cargando ? guion : String(activas.length)} sub={cargando ? "oportunidades" : `${opps.length} totales`} />
          <Metrica label="Valor en pipeline" valor={cargando ? guion : precioLargo(valorPipeline)} sub="operaciones activas" />
          <Metrica label="Forecast ponderado" valor={cargando ? guion : precioLargo(Math.round(forecast))} sub="comisión esperada" />
        </div>
      </Encabezado>

      {error ? (
        <ErrorCarga mensaje="No pudimos cargar las oportunidades." onReintentar={reintentar} />
      ) : (
        <div aria-busy={cargando} className="flex flex-col gap-5 lg:flex-row">
          {/* MASTER: lista de oportunidades */}
          <section
            aria-label="Lista de oportunidades"
            className="surface-card max-h-64 w-full shrink-0 overflow-y-auto p-0 lg:max-h-[38rem] lg:w-80"
          >
            {cargando ? (
              <div aria-hidden="true" className="space-y-2 p-3">
                {Array.from({ length: 6 }, (_, i) => (
                  <Esqueleto key={i} className="h-16" />
                ))}
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {opps.map((o) => {
                  const active = o.id === selId
                  return (
                    <li key={o.id}>
                      <button
                        type="button"
                        onClick={() => elegir(o.id)}
                        aria-current={active ? "true" : undefined}
                        className={"flex w-full flex-col gap-1 border-l-[3px] px-4 py-3 text-left transition-colors " + (active ? "border-primary bg-subtle" : "border-transparent hover:bg-subtle")}
                      >
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="truncate text-sm font-semibold">{o.comprador}</span>
                          <span className="precio shrink-0 text-sm font-bold text-fg">{precioCompacto(o.precio)}</span>
                        </div>
                        <span className="truncate text-xs text-muted">{o.propiedad} · {o.zona}</span>
                        <span className="mt-1 self-start">
                          <BaseChip><span className={"chip capitalize " + chipDeEtapa[o.etapa]}>{o.etapa}</span></BaseChip>
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </section>

          {/* DETAIL */}
          <div ref={detalleRef} className="flex min-w-0 flex-1 scroll-mt-3 flex-col">
            {cargando ? (
              <div aria-hidden="true" className="surface-card flex-1 space-y-4 p-6">
                <Esqueleto className="h-12" />
                <Esqueleto className="h-20" />
                <Esqueleto className="h-24" />
                <Esqueleto className="h-32" />
              </div>
            ) : sel ? (
              <Detalle o={sel} />
            ) : (
              <div className="surface-card flex-1 p-6 text-sm text-muted">No hay oportunidades en curso.</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
