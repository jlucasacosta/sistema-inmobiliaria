"use client"
import { useEffect, useState } from "react"
import { Phone, Clock, Sparkles } from "lucide-react"
import { getLlamadas, type Llamada } from "./api"

export function LlamadasPage() {
  const [rows, setRows] = useState<Llamada[]>([])
  useEffect(() => {
    getLlamadas().then(setRows)
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-semibold">Llamadas</h1>
      <div className="space-y-3">
        {rows.map((l) => (
          <div key={l.id} className="rounded border border-border bg-surface p-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 font-medium">
                <Phone size={16} className="text-muted" />
                {l.contacto}
              </span>
              <span className="flex items-center gap-3 text-xs text-muted">
                <span>{l.fecha}</span>
                <span className="flex items-center gap-1"><Clock size={14} />{l.duracion}</span>
              </span>
            </div>
            <div className="mt-2 flex items-start gap-2 rounded bg-bg p-3">
              <Sparkles size={14} className="mt-0.5 shrink-0 text-accent" />
              <p className="text-sm text-muted">{l.resumen}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
