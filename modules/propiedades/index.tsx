"use client"
import { useEffect, useMemo, useState } from "react"
import { BedDouble, Bath, Maximize, Car } from "lucide-react"
import { getPropiedades, type Propiedad } from "./api"
import {
  chipDeProp,
  chipDeTemperatura,
  temperaturaCartera,
  precioLargo,
  type EstadoProp,
} from "@/shell/cartera"
import { MapaCartera, type MapaPin } from "@/shell/mapa-cartera"

// Arquetipo: GALERIA (masonry). La foto ES el producto; una tabla mataria el rubro.
// Placeholder de imagen por CSS (gradiente de tokens): sin imagenes externas.
// Arriba, header-con-metricas + el Mapa de Cartera (mismo componente que el dashboard).

// Silueta de techo distinta por tipo: da variedad de altura al masonry.
const alturaFoto: Record<Propiedad["tipo"], string> = {
  casa: "aspect-[4/3]",
  apartamento: "aspect-video",
  ph: "aspect-[3/2]",
  terreno: "aspect-[16/7]",
  local: "aspect-[16/7]",
}

function Foto({ p }: { p: Propiedad }) {
  return (
    <div className={"relative w-full overflow-hidden " + alturaFoto[p.tipo]}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/85 via-primary/55 to-accent/70" />
      <div className="absolute inset-0 opacity-25 [background:repeating-linear-gradient(135deg,transparent_0,transparent_12px,rgb(255_255_255/0.3)_12px,rgb(255_255_255/0.3)_13px)]" />
      <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="absolute bottom-0 h-1/2 w-full text-bg/80">
        <path d="M15 50 L15 26 L50 8 L85 26 L85 50 Z" fill="currentColor" opacity="0.9" />
        <rect x="45" y="34" width="10" height="16" fill="rgb(var(--fg))" opacity="0.3" />
      </svg>
      <div className="absolute left-2 top-2 flex gap-1">
        <span className={"chip " + chipDeProp[p.estado]}>{p.estado}</span>
      </div>
      <span className="absolute bottom-2 left-2 text-[10px] font-semibold uppercase tracking-widest text-bg/90">
        {p.tipo}
      </span>
    </div>
  )
}

function Card({ p }: { p: Propiedad }) {
  const temp = temperaturaCartera(p.diasEnCartera)
  return (
    <article className="surface-card mb-4 break-inside-avoid overflow-hidden">
      <Foto p={p} />
      <div className="space-y-2 p-4">
        <p className="precio text-3xl font-bold leading-none text-fg">{precioLargo(p.precio)}</p>
        <h3 className="font-heading text-sm font-semibold leading-tight">{p.titulo}</h3>
        <p className="text-xs text-muted">{p.zona}</p>
        <div className="flex flex-wrap gap-1 pt-1">
          <span className="chip bg-subtle text-muted"><Maximize size={12} />{p.m2} m2</span>
          <span className="chip bg-subtle text-muted"><BedDouble size={12} />{p.dorm} dorm</span>
          <span className="chip bg-subtle text-muted"><Bath size={12} />{p.banos} bano</span>
          {p.cochera && <span className="chip bg-subtle text-muted"><Car size={12} />cochera</span>}
        </div>
        <div className="flex items-center justify-between border-t border-border pt-2 text-[11px] text-muted">
          <span>{p.diasEnCartera} dias en cartera</span>
          <span className={"chip " + chipDeTemperatura[temp]}>{temp}</span>
        </div>
      </div>
    </article>
  )
}

function Metrica({ label, valor, sub }: { label: string; valor: string; sub?: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] uppercase tracking-widest text-muted">{label}</span>
      <span className="precio text-2xl font-bold text-fg">{valor}</span>
      {sub && <span className="text-[11px] text-muted">{sub}</span>}
    </div>
  )
}

const filtros: Array<EstadoProp | "todas"> = ["todas", "disponible", "reservada", "vendida"]

export function PropiedadesPage() {
  const [items, setItems] = useState<Propiedad[]>([])
  const [filtro, setFiltro] = useState<EstadoProp | "todas">("todas")

  useEffect(() => {
    getPropiedades().then(setItems)
  }, [])

  const visibles = filtro === "todas" ? items : items.filter((p) => p.estado === filtro)

  const pins: MapaPin[] = useMemo(
    () =>
      items.map((p) => ({
        id: p.id,
        x: p.x,
        y: p.y,
        precio: p.precio,
        estado: p.estado,
        titulo: p.titulo,
        zona: p.zona,
        m2: p.m2,
        dorm: p.dorm,
        banos: p.banos,
        reciente: p.estado === "reservada" && p.diasEnCartera < 30,
      })),
    [items]
  )

  const disponibles = items.filter((p) => p.estado === "disponible")
  const valorCartera = disponibles.reduce((a, p) => a + p.precio, 0)
  const ticketProm = disponibles.length ? Math.round(valorCartera / disponibles.length) : 0

  return (
    <div className="space-y-5">
      <header className="surface-card flex flex-wrap items-center justify-between gap-6 p-5">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">Propiedades</h1>
          <p className="text-xs text-muted">Cartera activa de Nexo Propiedades</p>
        </div>
        <div className="flex flex-wrap gap-8">
          <Metrica label="En cartera" valor={String(items.length)} sub={`${disponibles.length} disponibles`} />
          <Metrica label="Valor disponible" valor={precioLargo(valorCartera)} />
          <Metrica label="Ticket promedio" valor={precioLargo(ticketProm)} />
        </div>
      </header>

      {pins.length > 0 && <MapaCartera pins={pins} />}

      <div className="flex flex-wrap gap-2">
        {filtros.map((f) => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={
              "chip capitalize transition-colors " +
              (filtro === f ? "bg-primary text-bg" : "bg-subtle text-muted hover:text-fg")
            }
          >
            {f}
          </button>
        ))}
      </div>

      <div className="gap-4 [column-fill:_balance] sm:columns-2 xl:columns-3">
        {visibles.map((p) => (
          <Card key={p.id} p={p} />
        ))}
      </div>
    </div>
  )
}
