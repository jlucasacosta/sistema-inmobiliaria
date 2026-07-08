"use client"
import { useEffect, useState } from "react"
import { getEtapas, getOportunidades, type Etapa, type Oportunidad } from "./api"

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
                <span className="text-sm font-medium">{e.nombre}</span>
                <span className="rounded-full bg-surface px-2 py-0.5 text-xs text-muted shadow-sm">{cards.length}</span>
              </div>
              <div className="space-y-3">
                {cards.map((o) => (
                  <div
                    key={o.id}
                    className="rounded-lg bg-surface p-3 shadow-card transition-shadow hover:shadow-pop"
                  >
                    <p className="text-sm font-medium">{o.cliente}</p>
                    <p className="text-xs text-muted">{o.propiedad}</p>
                    <p className="mt-1 text-sm font-semibold text-accent">{o.valor}</p>
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
