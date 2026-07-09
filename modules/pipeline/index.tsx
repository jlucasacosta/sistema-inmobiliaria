"use client"
import { useEffect, useState } from "react"
import { getEtapas, getOportunidades, type Etapa, type Oportunidad } from "./api"

// Mapas literales por etapa: Tailwind necesita ver la clase completa en el fuente.
const rail: Record<string, string> = {
  lead: "bg-info",
  contactado: "bg-primary",
  visita: "bg-warning",
  oferta: "bg-accent",
  cierre: "bg-success",
  perdida: "bg-danger",
}
const bar: Record<string, string> = {
  lead: "bg-info",
  contactado: "bg-primary",
  visita: "bg-warning",
  oferta: "bg-accent",
  cierre: "bg-success",
  perdida: "bg-danger",
}

export function PipelinePage() {
  const [etapas, setEtapas] = useState<Etapa[]>([])
  const [opps, setOpps] = useState<Oportunidad[]>([])

  useEffect(() => {
    getEtapas().then(setEtapas)
    getOportunidades().then(setOpps)
  }, [])

  return (
    <div className="space-y-8">
      <h1 className="font-heading text-2xl font-semibold">Pipeline</h1>
      <div className="flex gap-5 overflow-x-auto pb-2">
        {etapas.map((e) => {
          const cards = opps.filter((o) => o.etapaId === e.id)
          return (
            <div key={e.id} className="flex w-64 shrink-0 flex-col rounded-xl bg-subtle p-3">
              <div className="flex items-center justify-between px-1 pb-3">
                <span className="flex items-center gap-2 text-sm font-medium">
                  <span className={"h-2 w-2 rounded-full " + (rail[e.id] ?? "bg-muted")} />
                  {e.nombre}
                </span>
                <span className="rounded-full bg-surface px-2 py-0.5 text-xs text-muted shadow-sm">{cards.length}</span>
              </div>
              <div className="space-y-3">
                {cards.map((o) => (
                  <div
                    key={o.id}
                    className="relative overflow-hidden rounded-lg bg-surface p-3 pl-4 shadow-card transition-shadow hover:shadow-pop"
                  >
                    <span className={"absolute inset-y-0 left-0 w-1 " + (rail[o.etapaId] ?? "bg-muted")} />
                    <p className="text-sm font-medium">{o.cliente}</p>
                    <p className="text-xs text-muted">{o.propiedad}</p>
                    <p className="mt-1 text-sm font-semibold text-fg">{o.valor}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-subtle">
                        <div
                          className={"h-full rounded-full " + (bar[o.etapaId] ?? "bg-muted")}
                          style={{ width: o.probabilidad + "%" }}
                        />
                      </div>
                      <span className="text-[10px] text-muted">{o.probabilidad}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
