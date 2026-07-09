"use client"
import { useEffect, useState } from "react"
import { Phone, Clock, Sparkles } from "lucide-react"
import { getLlamadas, type Llamada } from "./api"

// Mapas literales: Tailwind necesita ver la clase completa en el fuente.
const badge: Record<Llamada["resultado"], string> = {
  agendada: "bg-success/15 text-success",
  seguimiento: "bg-info/15 text-info",
  "sin respuesta": "bg-warning/15 text-warning",
  cancelada: "bg-danger/15 text-danger",
}
const avatar: Record<Llamada["resultado"], string> = badge

const iniciales = (n: string) =>
  n
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")

export function LlamadasPage() {
  const [rows, setRows] = useState<Llamada[]>([])
  useEffect(() => {
    getLlamadas().then(setRows)
  }, [])

  return (
    <div className="space-y-8">
      <h1 className="font-heading text-2xl font-semibold">Llamadas</h1>
      <div className="space-y-4">
        {rows.map((l) => (
          <div key={l.id} className="rounded-xl bg-surface p-5 shadow-card transition-shadow hover:shadow-pop">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-3 font-medium">
                <span
                  className={
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold " +
                    avatar[l.resultado]
                  }
                >
                  {iniciales(l.contacto)}
                </span>
                {l.contacto}
              </span>
              <span className="flex items-center gap-3 text-xs text-muted">
                <span className={"whitespace-nowrap rounded-full px-2.5 py-0.5 " + badge[l.resultado]}>{l.resultado}</span>
                <span>{l.fecha}</span>
                <span className="flex items-center gap-1"><Clock size={14} />{l.duracion}</span>
                <Phone size={14} />
              </span>
            </div>
            <div className="mt-3 flex items-start gap-2 rounded-lg bg-subtle p-3">
              <Sparkles size={14} className="mt-0.5 shrink-0 text-accent" />
              <p className="text-sm text-muted">{l.resumen}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
