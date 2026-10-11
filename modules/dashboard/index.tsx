"use client"
import { useEffect, useState } from "react"
import { MessageSquare, CalendarCheck, Handshake, CheckCircle2, KeyRound, XCircle, type LucideIcon } from "lucide-react"
import { getRealizado, getHeatmap, getActividad, type Realizado, type Heatmap, type Actividad, type TipoActividad } from "./api"
import { getPropiedades, type Propiedad } from "@/modules/propiedades/api"
import { theme } from "@/shell/theme"
import { precioLargo } from "@/shell/cartera"

// Dashboard = panel de gestion sobrio. Header con 3 metricas, metas del mes contra
// objetivo absoluto, resumen de comision, heatmap de visitas y actividad reciente.
// Sin animaciones: los valores se muestran tal cual, sin conteo ni entradas.

// Iconos de la actividad en un cuadrado neutro: el icono distingue el tipo y solo el
// rechazo lleva color, porque es lo unico que pide atencion.
const actIcon: Record<TipoActividad, LucideIcon> = {
  consulta: MessageSquare,
  visita: CalendarCheck,
  reserva: Handshake,
  cierre: CheckCircle2,
  captacion: KeyRound,
  rechazo: XCircle,
}
const actChip: Record<TipoActividad, string> = {
  consulta: "bg-subtle text-muted",
  visita: "bg-subtle text-muted",
  reserva: "bg-subtle text-muted",
  cierre: "bg-subtle text-muted",
  captacion: "bg-subtle text-muted",
  rechazo: "bg-subtle text-danger",
}

// Heatmap: la intensidad sube en escalones del token primary, sin llegar al color pleno.
// fg sobre todos los escalones llega a 4.5:1. Sin hex.
function baldeHeat(v: number): string {
  if (v <= 0) return "bg-subtle text-muted"
  if (v <= 2) return "bg-primary/15 text-fg"
  if (v <= 4) return "bg-primary/30 text-fg"
  if (v <= 6) return "bg-primary/45 text-fg"
  return "bg-primary/60 text-fg"
}

function Barra({ label, actual, objetivo, unidad }: { label: string; actual: string; objetivo: string; unidad: number }) {
  const pct = Math.round(Math.min(unidad, 1) * 100)
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <span className="text-sm text-muted">{label}</span>
        <span className="text-xs text-muted">
          <span className="precio text-sm font-semibold text-fg">{actual}</span> / {objetivo}
        </span>
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-valuetext={`${actual} de ${objetivo}`}
        className="h-2 overflow-hidden rounded-[var(--radius)] bg-subtle"
      >
        <div className="h-full bg-primary" style={{ width: pct + "%" }} />
      </div>
    </div>
  )
}

// Resumen de comision: cifra, objetivo y avance. Sin conteo animado.
function ComisionResumen({ valor }: { valor: number }) {
  const pct = Math.round((valor / theme.meta.comision) * 100)
  return (
    <section className="surface-card flex flex-col justify-center p-6">
      <h2 className="font-heading text-sm font-semibold text-muted">Comisión proyectada del mes</h2>
      <p className="precio mt-2 text-3xl font-semibold leading-none text-fg">{precioLargo(valor)}</p>
      <p className="mt-2 text-xs text-muted">
        Objetivo <span className="precio font-semibold text-fg">{precioLargo(theme.meta.comision)}</span> · {pct}% cumplido
      </p>
      <div
        role="progressbar"
        aria-label="Avance de la comisión contra el objetivo"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.min(pct, 100)}
        className="mt-3 h-2 overflow-hidden rounded-[var(--radius)] bg-subtle"
      >
        <div className="h-full bg-primary" style={{ width: Math.min(pct, 100) + "%" }} />
      </div>
    </section>
  )
}

function Metrica({ label, valor, sub }: { label: string; valor: string; sub: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs text-muted">{label}</span>
      <span className="precio text-xl font-semibold text-fg">{valor}</span>
      <span className="text-xs text-muted">{sub}</span>
    </div>
  )
}

export function DashboardPage() {
  const [real, setReal] = useState<Realizado | null>(null)
  const [heat, setHeat] = useState<Heatmap | null>(null)
  const [act, setAct] = useState<Actividad[]>([])
  const [props, setProps] = useState<Propiedad[]>([])

  useEffect(() => {
    getRealizado().then(setReal)
    getHeatmap().then(setHeat)
    getActividad().then(setAct)
    getPropiedades().then(setProps)
  }, [])

  const disponibles = props.filter((p) => p.estado === "disponible").length
  const m = theme.meta

  return (
    <div className="space-y-5">
      <header className="surface-card flex flex-wrap items-center justify-between gap-6 p-5">
        <div>
          <h1 className="font-heading text-xl font-semibold tracking-tight">Panel general</h1>
          <p className="text-xs text-muted">Nexo Propiedades · cierre del mes en curso</p>
        </div>
        <div className="flex flex-wrap gap-8">
          <Metrica label="Cierres del mes" valor={`${real?.cierres ?? 0}/${m.cierres}`} sub="operaciones" />
          <Metrica label="Captaciones" valor={`${real?.captaciones ?? 0}/${m.captaciones}`} sub="exclusivas" />
          <Metrica label="En cartera" valor={String(disponibles)} sub="disponibles" />
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-3">
        <section className="surface-card space-y-5 p-6 lg:col-span-2">
          <h2 className="font-heading text-base font-semibold">Metas del mes</h2>
          {real && (
            <>
              <Barra label="Cierres" actual={String(real.cierres)} objetivo={String(m.cierres)} unidad={real.cierres / m.cierres} />
              <Barra label="Captaciones" actual={String(real.captaciones)} objetivo={String(m.captaciones)} unidad={real.captaciones / m.captaciones} />
              <Barra label="Comisión" actual={precioLargo(real.comision)} objetivo={precioLargo(m.comision)} unidad={real.comision / m.comision} />
            </>
          )}
        </section>

        {real && <ComisionResumen valor={real.comision} />}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <section className="surface-card p-6 lg:col-span-2">
          <header className="mb-5 flex items-baseline justify-between">
            <h2 className="font-heading text-base font-semibold">Visitas por franja</h2>
            <span className="text-xs text-muted">franjas de mayor demanda de la semana</span>
          </header>
          {heat && (
            <div role="region" aria-label="Mapa de calor de visitas por día y franja" tabIndex={0} className="overflow-x-auto">
              {/* Equivalente accesible: la grilla visual se oculta al lector de pantalla y esta tabla trae los mismos datos. */}
              <div className="sr-only">
              <table>
                <caption>Visitas agendadas por día y franja horaria</caption>
                <thead>
                  <tr>
                    <th scope="col">Día</th>
                    {heat.franjas.map((f) => (
                      <th key={f} scope="col">{f}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {heat.dias.map((d) => (
                    <tr key={d.dia}>
                      <th scope="row">{d.dia}</th>
                      {d.valores.map((v, i) => (
                        <td key={i}>{v}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
              <div aria-hidden="true" className="inline-grid gap-1" style={{ gridTemplateColumns: `auto repeat(${heat.franjas.length}, minmax(2.5rem, 1fr))` }}>
                <span />
                {heat.franjas.map((f) => (
                  <span key={f} className="pb-1 text-center text-[10px] text-muted">{f}</span>
                ))}
                {heat.dias.map((d) => (
                  <div key={d.dia} className="contents">
                    <span className="pr-2 text-right text-[11px] font-medium text-muted">{d.dia}</span>
                    {d.valores.map((v, i) => (
                      <div
                        key={i}
                        title={`${d.dia} ${heat.franjas[i]}: ${v} visitas`}
                        className={"flex aspect-square items-center justify-center rounded-[var(--radius)] text-[10px] font-medium " + baldeHeat(v)}
                      >
                        {v > 0 ? v : ""}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="surface-card p-6">
          <h2 className="mb-4 font-heading text-base font-semibold">Actividad</h2>
          <div role="region" aria-label="Actividad reciente" tabIndex={0} className="max-h-[19rem] overflow-y-auto pr-1">
          <ul className="space-y-3">
            {act.map((a) => {
              const Icon = actIcon[a.tipo]
              return (
                <li key={a.id} className="flex gap-3 border-b border-border pb-3 last:border-0 last:pb-0">
                  <span className={"icon-chip " + actChip[a.tipo]}><Icon size={14} aria-hidden="true" /></span>
                  <div className="min-w-0">
                    <p className="text-[13px] leading-tight">{a.texto}</p>
                    <p className="mt-0.5 text-[11px] text-muted">{a.cuando}</p>
                  </div>
                </li>
              )
            })}
          </ul>
          </div>
        </section>
      </div>
    </div>
  )
}
