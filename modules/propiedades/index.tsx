"use client"
import { useEffect, useState } from "react"
import { Building2, BedDouble, Bath, Maximize } from "lucide-react"
import { getPropiedades, type Propiedad } from "./api"

const estadoBadge: Record<Propiedad["estado"], string> = {
  disponible: "bg-accent text-bg",
  reservada: "bg-primary text-bg",
  vendida: "bg-border text-muted",
}

export function PropiedadesPage() {
  const [items, setItems] = useState<Propiedad[]>([])
  const [filtro, setFiltro] = useState<"todas" | "venta" | "alquiler">("todas")

  useEffect(() => {
    getPropiedades().then(setItems)
  }, [])

  const visibles = items.filter((p) => filtro === "todas" || p.operacion === filtro)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-semibold">Propiedades</h1>
        <div className="flex gap-1 rounded border border-border p-1">
          {(["todas", "venta", "alquiler"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={"rounded px-3 py-1 text-sm capitalize " + (filtro === f ? "bg-primary text-bg" : "text-muted")}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibles.map((p) => (
          <div key={p.id} className="overflow-hidden rounded border border-border bg-surface">
            <div className="flex h-36 items-center justify-center bg-bg">
              <Building2 size={40} className="text-muted" />
            </div>
            <div className="space-y-2 p-4">
              <div className="flex items-center justify-between">
                <span className="rounded bg-primary px-2 py-0.5 text-xs uppercase text-bg">{p.operacion}</span>
                <span className={"rounded px-2 py-0.5 text-xs " + estadoBadge[p.estado]}>{p.estado}</span>
              </div>
              <h3 className="font-medium">{p.titulo}</h3>
              <p className="text-sm text-muted">{p.direccion}</p>
              <p className="text-lg font-semibold">{p.precio}</p>
              <div className="flex gap-4 border-t border-border pt-2 text-xs text-muted">
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
