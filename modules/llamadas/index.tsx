"use client"
import { PhoneCall, PhoneOff, ArrowRight } from "lucide-react"
import { getLlamadas } from "./api"
import { chipDeResultado, puntoDeResultado } from "@/shell/cartera"
import { useCarga, Esqueleto, ErrorCarga } from "@/shell/carga"
import { Encabezado, Metrica } from "@/shell/encabezado"

// Arquetipo: TIMELINE. Eje vertical con las llamadas del dia; la mas reciente arriba.
// Hora + duracion + resultado (chip de color) + next-step.
// Mientras carga muestra "—" y esqueletos estaticos; si falla, ErrorCarga con reintento.

function mmss(seg: number): string {
  if (seg <= 0) return "—"
  const m = Math.floor(seg / 60)
  const s = seg % 60
  return `${m}:${String(s).padStart(2, "0")}`
}

export function LlamadasPage() {
  const { data, error, cargando, reintentar } = useCarga(getLlamadas)
  const rows = data ?? []
  const guion = "—"

  const totalSeg = rows.reduce((a, l) => a + l.duracionSeg, 0)
  const agendadas = rows.filter((l) => l.resultado === "agendada").length
  const horas = Math.floor(totalSeg / 3600)
  const mins = Math.round((totalSeg % 3600) / 60)

  return (
    <div className="space-y-5">
      <Encabezado titulo="Llamadas" subtitulo="Registro cronológico de hoy">
        <div aria-busy={cargando} className="flex flex-wrap gap-x-8 gap-y-3">
          <Metrica label="Llamadas" valor={cargando ? guion : String(rows.length)} sub="hoy" />
          <Metrica label="En línea" valor={cargando ? guion : `${horas}h ${mins}m`} sub="tiempo total" />
          <Metrica label="Agendadas" valor={cargando ? guion : String(agendadas)} sub="visitas nuevas" />
        </div>
      </Encabezado>

      <section aria-label="Llamadas de hoy" aria-busy={cargando} className="surface-card p-4 md:p-6">
        {error ? (
          <ErrorCarga mensaje="No pudimos cargar las llamadas." onReintentar={reintentar} />
        ) : cargando ? (
          <div aria-hidden="true" className="space-y-4">
            {Array.from({ length: 6 }, (_, i) => (
              <Esqueleto key={i} className="h-14" />
            ))}
          </div>
        ) : (
          <ol className="relative ml-20 space-y-5 border-l border-border md:ml-24">
            {rows.map((l) => {
              const perdida = l.duracionSeg === 0
              return (
                <li key={l.id} className="relative pl-6">
                  {/* hora a la izquierda del eje */}
                  <span className="precio absolute -left-20 top-0 w-14 text-right text-lg font-bold text-fg md:-left-24 md:w-16">{l.hora}</span>
                  {/* nodo en el eje */}
                  <span aria-hidden="true" className={"absolute -left-[7px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-surface " + puntoDeResultado[l.resultado]} />
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 text-sm font-semibold">
                        {perdida ? <PhoneOff size={13} aria-hidden="true" className="text-warning" /> : <PhoneCall size={13} aria-hidden="true" className="text-primary" />}
                        {l.contacto}
                      </p>
                      <p className="text-xs text-muted">{l.propiedad}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="precio text-xs text-muted">{mmss(l.duracionSeg)}</span>
                      <span className={"chip " + chipDeResultado[l.resultado]}>{l.resultado}</span>
                    </div>
                  </div>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted">
                    <ArrowRight size={11} aria-hidden="true" className="text-accent" />
                    {l.nextStep}
                  </p>
                </li>
              )
            })}
          </ol>
        )}
      </section>
    </div>
  )
}
