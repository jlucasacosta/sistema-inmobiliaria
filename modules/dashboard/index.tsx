"use client"
import { useEffect, useMemo, useRef, useState } from "react"
import { MessageSquare, CalendarCheck, Handshake, CheckCircle2, KeyRound, XCircle, type LucideIcon } from "lucide-react"
import { getRealizado, getHeatmap, getActividad, type Realizado, type Heatmap, type Actividad, type TipoActividad } from "./api"
import { getPropiedades, type Propiedad } from "@/modules/propiedades/api"
import { theme } from "@/shell/theme"
import { precioLargo } from "@/shell/cartera"
import { MapaCartera, type MapaPin } from "@/shell/mapa-cartera"

// Dashboard = board editorial-financiero. Header con 3 metricas, barra-metas contra
// objetivo absoluto (SIN sparklines), heatmap de visitas, hero de comision que se
// llena de golpe (frame-firma) y el Mapa de Cartera a pantalla ancha abajo.

// icon-chip: icono lucide dentro de un cuadrado tintado de estado.
const actIcon: Record<TipoActividad, LucideIcon> = {
  consulta: MessageSquare,
  visita: CalendarCheck,
  reserva: Handshake,
  cierre: CheckCircle2,
  captacion: KeyRound,
  rechazo: XCircle,
}
const actChip: Record<TipoActividad, string> = {
  consulta: "bg-info/15 text-info",
  visita: "bg-primary/15 text-primary",
  reserva: "bg-accent/15 text-accent",
  cierre: "bg-success/15 text-success",
  captacion: "bg-warning/15 text-warning",
  rechazo: "bg-danger/15 text-danger",
}

// Heatmap: la intensidad sube en escalones del token primary. Sin hex.
function baldeHeat(v: number): string {
  if (v <= 0) return "bg-subtle"
  if (v <= 2) return "bg-primary/25"
  if (v <= 4) return "bg-primary/50"
  if (v <= 6) return "bg-primary/70"
  return "bg-primary"
}

function Barra({ label, actual, objetivo, unidad, relleno }: { label: string; actual: string; objetivo: string; unidad: number; relleno: string }) {
  const pct = Math.min(unidad, 1) * 100
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between">
        <span className="text-xs uppercase tracking-widest text-muted">{label}</span>
        <span className="text-xs text-muted">
          <span className="precio text-sm font-bold text-fg">{actual}</span> / {objetivo}
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded-[var(--radius)] bg-subtle">
        <div className={"barra-anim h-full rounded-[var(--radius)] " + relleno} style={{ width: pct + "%" }} />
      </div>
    </div>
  )
}

// Hero de comision: cuenta de 0 al objetivo realizado. El frame que se graba.
function ComisionHero({ target }: { target: number }) {
  const [n, setN] = useState(0)
  const raf = useRef<number | undefined>(undefined)
  useEffect(() => {
    const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce || target === 0) {
      setN(target)
      return
    }
    const start = performance.now()
    const dur = 900
    const tick = (t: number) => {
      const p = Math.min((t - start) / dur, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setN(Math.round(target * eased))
      if (p < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => { if (raf.current) cancelAnimationFrame(raf.current) }
  }, [target])

  const pct = Math.round((target / theme.meta.comision) * 100)
  return (
    <div className="surface-card comision-hero flex flex-col justify-center p-6">
      <span className="text-[10px] uppercase tracking-widest text-muted">Comision proyectada del mes</span>
      <p className="precio mt-2 text-5xl font-bold leading-none text-primary">
        <span className="text-accent">U$S</span> {n.toLocaleString("es-UY")}
      </p>
      <p className="mt-3 text-xs text-muted">
        objetivo <span className="precio font-bold text-fg">{precioLargo(theme.meta.comision)}</span>
      </p>
      <div className="mt-2 h-2 overflow-hidden rounded-[var(--radius)] bg-subtle">
        <div className="barra-anim h-full rounded-[var(--radius)] bg-accent" style={{ width: Math.min(pct, 100) + "%" }} />
      </div>
      <span className="chip mt-3 self-start bg-accent/15 text-accent">{pct}% del objetivo</span>
    </div>
  )
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

  const pins: MapaPin[] = useMemo(
    () =>
      props.map((p) => ({
        id: p.id, x: p.x, y: p.y, precio: p.precio, estado: p.estado,
        titulo: p.titulo, zona: p.zona, m2: p.m2, dorm: p.dorm, banos: p.banos,
        reciente: p.estado === "reservada" && p.diasEnCartera < 30,
      })),
    [props]
  )
  const disponibles = props.filter((p) => p.estado === "disponible").length
  const m = theme.meta

  return (
    <div className="space-y-5">
      <header className="surface-card flex flex-wrap items-center justify-between gap-6 p-5">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">Panel general</h1>
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
          <h2 className="font-heading text-sm font-bold uppercase tracking-widest">Metas del mes</h2>
          {real && (
            <>
              <Barra label="Cierres" actual={String(real.cierres)} objetivo={String(m.cierres)} unidad={real.cierres / m.cierres} relleno="bg-primary" />
              <Barra label="Captaciones" actual={String(real.captaciones)} objetivo={String(m.captaciones)} unidad={real.captaciones / m.captaciones} relleno="bg-accent" />
              <Barra label="Comision" actual={precioLargo(real.comision)} objetivo={precioLargo(m.comision)} unidad={real.comision / m.comision} relleno="bg-success" />
            </>
          )}
        </section>

        {real && <ComisionHero target={real.comision} />}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <section className="surface-card p-6 lg:col-span-2">
          <header className="mb-5 flex items-baseline justify-between">
            <h2 className="font-heading text-sm font-bold uppercase tracking-widest">Visitas por franja</h2>
            <span className="text-xs text-muted">franjas de mayor demanda de la semana</span>
          </header>
          {heat && (
            <div className="overflow-x-auto">
              <div className="inline-grid gap-1" style={{ gridTemplateColumns: `auto repeat(${heat.franjas.length}, minmax(2.5rem, 1fr))` }}>
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
                        className={"flex aspect-square items-center justify-center rounded-[var(--radius)] text-[10px] font-semibold " + baldeHeat(v) + (v > 4 ? " text-bg" : " text-muted")}
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
          <h2 className="mb-4 font-heading text-sm font-bold uppercase tracking-widest">Actividad</h2>
          <ul className="max-h-[19rem] space-y-3 overflow-y-auto pr-1">
            {act.map((a) => {
              const Icon = actIcon[a.tipo]
              return (
                <li key={a.id} className="flex gap-3 border-b border-border pb-3 last:border-0 last:pb-0">
                  <span className={"icon-chip " + actChip[a.tipo]}><Icon size={14} /></span>
                  <div className="min-w-0">
                    <p className="text-[13px] leading-tight">{a.texto}</p>
                    <p className="mt-0.5 text-[11px] text-muted">{a.cuando}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      </div>

      {pins.length > 0 && <MapaCartera pins={pins} alto="h-[30rem]" />}
    </div>
  )
}
