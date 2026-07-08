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
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-semibold">Pipeline</h1>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {etapas.map((e) => {
          const cards = opps.filter((o) => o.etapaId === e.id)
          return (
            <div key={e.id} className="flex w-64 shrink-0 flex-col rounded border border-border bg-surface">
              <div className="flex items-center justify-between border-b border-border p-3">
                <span className="font-medium">{e.nombre}</span>
                <span className="rounded bg-bg px-2 text-xs text-muted">{cards.length}</span>
              </div>
              <div className="space-y-2 p-3">
                {cards.map((o) => (
                  <div key={o.id} className="rounded border border-border bg-bg p-3">
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
