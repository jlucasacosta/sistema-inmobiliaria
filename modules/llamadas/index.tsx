"use client"
import { useEffect, useState } from "react"
import { PhoneCall, PhoneOff, ArrowRight } from "lucide-react"
import { getLlamadas, type Llamada } from "./api"
import { chipDeResultado, puntoDeResultado } from "@/shell/cartera"

// Arquetipo: TIMELINE. Eje vertical con las llamadas del dia; la mas reciente arriba.
// Hora + duracion + resultado (chip de color) + next-step.

function mmss(seg: number): string {
  if (seg <= 0) return "—"
  const m = Math.floor(seg / 60)
  const s = seg % 60
  return `${m}:${String(s).padStart(2, "0")}`
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

export function LlamadasPage() {
  const [rows, setRows] = useState<Llamada[]>([])
  useEffect(() => {
    getLlamadas().then(setRows)
  }, [])

  const totalSeg = rows.reduce((a, l) => a + l.duracionSeg, 0)
  const agendadas = rows.filter((l) => l.resultado === "agendada").length
  const horas = Math.floor(totalSeg / 3600)
  const mins = Math.round((totalSeg % 3600) / 60)

  return (
    <div className="space-y-5">
      <header className="surface-card flex flex-wrap items-center justify-between gap-6 p-5">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">Llamadas de hoy</h1>
          <p className="text-xs text-muted">Registro cronologico del dia</p>
        </div>
        <div className="flex flex-wrap gap-8">
          <Metrica label="Llamadas" valor={String(rows.length)} sub="hoy" />
          <Metrica label="En linea" valor={`${horas}h ${mins}m`} sub="tiempo total" />
          <Metrica label="Agendadas" valor={String(agendadas)} sub="visitas nuevas" />
        </div>
      </header>

      <section className="surface-card p-6">
        <ol className="relative ml-24 space-y-5 border-l border-border">
          {rows.map((l) => {
            const perdida = l.duracionSeg === 0
            return (
              <li key={l.id} className="relative pl-6">
                {/* hora a la izquierda del eje */}
                <span className="absolute -left-24 top-0 w-16 text-right precio text-lg font-bold text-fg">{l.hora}</span>
                {/* nodo en el eje */}
                <span className={"absolute -left-[7px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-surface " + puntoDeResultado[l.resultado]} />
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 text-sm font-semibold">
                      {perdida ? <PhoneOff size={13} className="text-warning" /> : <PhoneCall size={13} className="text-primary" />}
                      {l.contacto}
                    </p>
                    <p className="text-xs text-muted">{l.propiedad}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="precio text-xs text-muted">{mmss(l.duracionSeg)}</span>
                    <span className={"chip " + chipDeResultado[l.resultado]}>{l.resultado}</span>
                  </div>
                </div>
                <p className="mt-1 flex items-center gap-1 text-[11px] text-muted">
                  <ArrowRight size={11} className="text-accent" />
                  {l.nextStep}
                </p>
              </li>
            )
          })}
        </ol>
      </section>
    </div>
  )
}
