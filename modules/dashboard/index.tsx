"use client"
import { useState } from "react"
import { MessageSquare, CalendarCheck, Handshake, CheckCircle2, KeyRound, XCircle, type LucideIcon } from "lucide-react"
import { getRealizado, getHeatmap, getActividad, type TipoActividad } from "./api"
import { getPropiedades } from "@/modules/propiedades/api"
import { theme } from "@/shell/theme"
import { precioLargo } from "@/shell/cartera"
import { useCarga, Esqueleto, ErrorCarga } from "@/shell/carga"
import { Encabezado, Metrica } from "@/shell/encabezado"

// Dashboard = panel de gestion sobrio. Header con 3 metricas, metas del mes contra
// objetivo absoluto, resumen de comision, heatmap de visitas y actividad reciente.
// Sin animaciones: los valores se muestran tal cual, sin conteo ni entradas.
// Mientras carga muestra "—" y esqueletos estaticos; si falla, ErrorCarga con reintento.
// Cada dato aparece una sola vez: la comision vive en su tarjeta, no en las metas ni en el header.

const FEED_INICIAL = 6

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
// Un valor representativo de cada escalon, para dibujar la leyenda con la escala real.
const escalonesHeat = [0, 1, 3, 5, 7]

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

// Resumen de comision: cifra, objetivo y avance. El unico lugar donde aparece la comision.
function ComisionResumen({ valor }: { valor: number }) {
  const pct = Math.round((valor / theme.meta.comision) * 100)
  return (
    <>
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
    </>
  )
}

export function DashboardPage() {
  const real = useCarga(getRealizado)
  const heat = useCarga(getHeatmap)
  const act = useCarga(getActividad)
  const props = useCarga(getPropiedades)
  const [verTodo, setVerTodo] = useState(false)

  const m = theme.meta
  const guion = "—"
  const disponibles = props.data ? String(props.data.filter((p) => p.estado === "disponible").length) : guion
  const reservas = props.data ? String(props.data.filter((p) => p.estado === "reservada").length) : guion
  const visitasSemana = heat.data ? String(heat.data.dias.reduce((a, d) => a + d.valores.reduce((x, v) => x + v, 0), 0)) : guion
  const maxVisitas = heat.data ? Math.max(...heat.data.dias.flatMap((d) => d.valores)) : 0

  const actividad = act.data ?? []
  const feed = verTodo ? actividad : actividad.slice(0, FEED_INICIAL)

  return (
    <div className="space-y-5">
      <Encabezado titulo="Panel general" subtitulo={real.data ? `${theme.brand.name} · ${real.data.periodo}` : theme.brand.name}>
        <div aria-busy={props.cargando || heat.cargando} className="flex flex-wrap gap-x-8 gap-y-3">
          <Metrica label="Disponibles" valor={disponibles} sub="propiedades a la venta" />
          <Metrica label="Visitas de la semana" valor={visitasSemana} sub="agendadas" />
          <Metrica label="Reservas activas" valor={reservas} sub="propiedades reservadas" />
        </div>
      </Encabezado>
      {(props.error || heat.error) && (
        <ErrorCarga
          mensaje="No pudimos cargar las cifras del encabezado."
          onReintentar={() => {
            if (props.error) props.reintentar()
            if (heat.error) heat.reintentar()
          }}
        />
      )}

      {real.error ? (
        <ErrorCarga mensaje="No pudimos cargar las metas del mes." onReintentar={real.reintentar} />
      ) : (
        <div className="grid gap-5 lg:grid-cols-3">
          <section aria-busy={real.cargando} aria-labelledby="dash-metas" className="surface-card space-y-5 p-4 md:p-6 lg:col-span-2">
            <h2 id="dash-metas" className="font-heading text-base font-semibold">Metas del mes</h2>
            {real.data ? (
              <>
                <Barra label="Cierres" actual={String(real.data.cierres)} objetivo={String(m.cierres)} unidad={real.data.cierres / m.cierres} />
                <Barra label="Captaciones" actual={String(real.data.captaciones)} objetivo={String(m.captaciones)} unidad={real.data.captaciones / m.captaciones} />
              </>
            ) : (
              <div className="space-y-5">
                <Esqueleto className="h-10" />
                <Esqueleto className="h-10" />
              </div>
            )}
          </section>

          <section aria-busy={real.cargando} aria-labelledby="dash-comision" className="surface-card flex flex-col justify-center p-4 md:p-6">
            <h2 id="dash-comision" className="font-heading text-sm font-semibold text-muted">Comisión proyectada del mes</h2>
            {real.data ? <ComisionResumen valor={real.data.comision} /> : <Esqueleto className="mt-2 h-20" />}
          </section>
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-3">
        <section aria-busy={heat.cargando} aria-labelledby="dash-visitas" className="surface-card p-4 md:p-6 lg:col-span-2">
          <header className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h2 id="dash-visitas" className="font-heading text-base font-semibold">Visitas por franja</h2>
            <span className="text-xs text-muted">Visitas agendadas por día y franja horaria</span>
          </header>
          {heat.error ? (
            <ErrorCarga mensaje="No pudimos cargar las visitas." onReintentar={heat.reintentar} />
          ) : heat.data ? (
            <div>
              {/* Equivalente accesible: la grilla visual se oculta al lector de pantalla y esta tabla trae los mismos datos. */}
              <div className="sr-only">
                <table>
                  <caption>Visitas agendadas por día y franja horaria</caption>
                  <thead>
                    <tr>
                      <th scope="col">Día</th>
                      {heat.data.franjas.map((f) => (
                        <th key={f} scope="col">{f}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {heat.data.dias.map((d) => (
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
              {/* Las celdas llenan el ancho de la tarjeta (1fr). */}
              <div
                aria-hidden="true"
                className="grid gap-1"
                style={{ gridTemplateColumns: `auto repeat(${heat.data.franjas.length}, minmax(0, 1fr))` }}
              >
                <span />
                {heat.data.franjas.map((f) => (
                  <span key={f} className="pb-1 text-center text-xs text-muted">{f}</span>
                ))}
                {heat.data.dias.map((d) => (
                  <div key={d.dia} className="contents">
                    <span className="flex items-center justify-end pr-2 text-xs font-medium text-muted">{d.dia}</span>
                    {d.valores.map((v, i) => (
                      <div
                        key={i}
                        className={"flex h-11 items-center justify-center rounded-[var(--radius)] text-xs font-medium " + baldeHeat(v)}
                      >
                        {v > 0 ? v : ""}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div aria-hidden="true" className="mt-4 flex items-center gap-2 text-xs text-muted">
                <span className="flex gap-0.5">
                  {escalonesHeat.map((v) => (
                    <span key={v} className={"h-3 w-5 rounded-[var(--radius)] " + baldeHeat(v).replace(/ text-\S+/, "")} />
                  ))}
                </span>
                <span>0 → {maxVisitas} visitas</span>
              </div>
            </div>
          ) : (
            <Esqueleto className="h-80" />
          )}
        </section>

        <section aria-busy={act.cargando} aria-labelledby="dash-actividad" className="surface-card p-4 md:p-6">
          <h2 id="dash-actividad" className="mb-4 font-heading text-base font-semibold">Actividad</h2>
          {act.error ? (
            <ErrorCarga mensaje="No pudimos cargar la actividad." onReintentar={act.reintentar} />
          ) : act.data ? (
            <>
              <ul className="space-y-3">
                {feed.map((a) => {
                  const Icon = actIcon[a.tipo]
                  return (
                    <li key={a.id} className="flex gap-3 border-b border-border pb-3 last:border-0 last:pb-0">
                      <span className={"icon-chip " + actChip[a.tipo]}><Icon size={14} aria-hidden="true" /></span>
                      <div className="min-w-0">
                        <p className="text-sm leading-snug">{a.texto}</p>
                        <p className="mt-0.5 text-xs text-muted">{a.cuando}</p>
                      </div>
                    </li>
                  )
                })}
              </ul>
              {actividad.length > FEED_INICIAL && (
                <button
                  type="button"
                  onClick={() => setVerTodo((v) => !v)}
                  aria-expanded={verTodo}
                  className="tap relative mt-3 inline-flex min-h-9 items-center rounded-[var(--radius)] border border-border bg-surface px-3 text-sm font-medium text-primary hover:bg-subtle"
                >
                  {verTodo ? "Ver menos" : `Ver todo (${actividad.length})`}
                </button>
              )}
            </>
          ) : (
            <div className="space-y-3">
              {Array.from({ length: FEED_INICIAL }, (_, i) => (
                <Esqueleto key={i} className="h-11" />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
