"use client"
import { useEffect, useState } from "react"
import { Building2, BedDouble, Bath, Maximize } from "lucide-react"
import { getPropiedades, type Propiedad } from "./api"

// Mapas literales: Tailwind necesita ver la clase completa en el fuente.
const estadoBadge: Record<Propiedad["estado"], string> = {
  disponible: "bg-success/15 text-success",
  reservada: "bg-warning/15 text-warning",
  vendida: "bg-info/15 text-info",
  alquilada: "bg-info/15 text-info",
}
const operacionBadge: Record<Propiedad["operacion"], string> = {
  venta: "bg-primary/15 text-primary",
  alquiler: "bg-accent/15 text-accent",
}

export function PropiedadesPage() {
  const [items, setItems] = useState<Propiedad[]>([])
  const [filtro, setFiltro] = useState<"todas" | "venta" | "alquiler">("todas")

  useEffect(() => {
    getPropiedades().then(setItems)
  }, [])

  const visibles = items.filter((p) => filtro === "todas" || p.operacion === filtro)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-semibold">Propiedades</h1>
        <div className="flex gap-1 rounded-xl bg-subtle p-1">
          {(["todas", "venta", "alquiler"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={
                "rounded-lg px-3 py-1.5 text-sm capitalize transition-colors " +
                (filtro === f ? "bg-surface font-medium text-primary shadow-sm" : "text-muted hover:text-fg")
              }
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visibles.map((p) => (
          <div
            key={p.id}
            className="overflow-hidden rounded-xl bg-surface shadow-card transition-shadow hover:shadow-pop"
          >
            <div className="flex h-36 items-center justify-center bg-subtle">
              <Building2 size={40} className="text-muted" />
            </div>
            <div className="space-y-2 p-5">
              <div className="flex items-center justify-between">
                <span className={"rounded-full px-2.5 py-0.5 text-xs uppercase tracking-wide " + operacionBadge[p.operacion]}>{p.operacion}</span>
                <span className={"rounded-full px-2.5 py-0.5 text-xs " + estadoBadge[p.estado]}>{p.estado}</span>
              </div>
              <h3 className="font-medium">{p.titulo}</h3>
              <p className="text-sm text-muted">{p.direccion}</p>
              <p className="text-lg font-semibold">{p.precio}</p>
              <div className="flex gap-4 border-t border-border pt-3 text-xs text-muted">
                <span className="flex items-center gap-1"><BedDouble size={14} />{p.ambientes} amb</span>
                <span className="flex items-center gap-1"><Bath size={14} />{p.banos}</span>
                <span className="flex items-center gap-1"><Maximize size={14} />{p.m2} m2</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
