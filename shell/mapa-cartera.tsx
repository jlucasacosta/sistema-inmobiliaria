"use client"
import { useState } from "react"
import {
  pinDeProp,
  chipDeProp,
  puntoDeProp,
  precioCompacto,
  precioLargo,
  type EstadoProp,
} from "./cartera"

// COMPONENTE ESTRELLA · Mapa de Cartera.
// Ningun otro sistema tiene un mapa: es la firma visual inmobiliaria.
// SVG estilizado hecho a mano (silueta de zona en trazo fino, sin tiles ni deps).
// Un price-pin por propiedad: muestra precio (Fraunces) y cambia de color por estado.
// Hover -> mini-card con placeholder de imagen (gradiente de tokens), precio hero y chips.
// Pins que se solapan -> cluster-count ("+7"), se abre al hover. Todo el color sale del theme.

export type MapaPin = {
  id: string
  x: number // 0-100 en el lienzo
  y: number // 0-100
  precio: number
  estado: EstadoProp
  titulo: string
  zona: string
  m2: number
  dorm: number
  banos: number
  reciente?: boolean // pulsa: recien reservada, cambia en la toma
}

type Cluster = { x: number; y: number; pins: MapaPin[] }

// Agrupa pins que se solapan en un cluster con centro promedio.
function agrupar(pins: MapaPin[], radio = 8): Cluster[] {
  const clusters: Cluster[] = []
  for (const p of pins) {
    const c = clusters.find((cl) => Math.hypot(cl.x - p.x, cl.y - p.y) < radio)
    if (c) {
      c.pins.push(p)
      c.x = (c.x * (c.pins.length - 1) + p.x) / c.pins.length
      c.y = (c.y * (c.pins.length - 1) + p.y) / c.pins.length
    } else {
      clusters.push({ x: p.x, y: p.y, pins: [p] })
    }
  }
  return clusters
}

// Placeholder de imagen: NO usa imagenes externas. Bloque 16:9 con gradiente + silueta CSS.
function FotoMock({ estado }: { estado: EstadoProp }) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-[var(--radius)] bg-gradient-to-br from-primary/85 via-primary/60 to-accent/70">
      <div className="absolute inset-0 opacity-30 [background:repeating-linear-gradient(135deg,transparent_0,transparent_10px,rgb(255_255_255/0.25)_10px,rgb(255_255_255/0.25)_11px)]" />
      {/* silueta de techo a dos aguas */}
      <svg viewBox="0 0 100 56" preserveAspectRatio="none" className="absolute bottom-0 h-2/3 w-full text-bg/85">
        <path d="M20 56 L20 30 L50 12 L80 30 L80 56 Z" fill="currentColor" opacity="0.9" />
        <rect x="44" y="40" width="12" height="16" fill="rgb(var(--fg))" opacity="0.35" />
      </svg>
      <span className={"chip absolute right-2 top-2 " + chipDeProp[estado]}>{estado}</span>
    </div>
  )
}

function MiniCard({ p }: { p: MapaPin }) {
  return (
    <div className="surface-card pointer-events-none absolute left-1/2 top-full z-30 w-52 -translate-x-1/2 translate-y-2 p-3 shadow-pop">
      <FotoMock estado={p.estado} />
      <p className="precio mt-2 text-2xl font-bold text-fg">{precioLargo(p.precio)}</p>
      <p className="truncate text-xs text-muted">{p.titulo}</p>
      <div className="mt-2 flex flex-wrap gap-1">
        <span className="chip bg-subtle text-muted">{p.m2} m2</span>
        <span className="chip bg-subtle text-muted">{p.dorm} dorm</span>
        <span className="chip bg-subtle text-muted">{p.banos} bano</span>
      </div>
    </div>
  )
}

function PinUnico({ p }: { p: MapaPin }) {
  const [hover, setHover] = useState(false)
  return (
    <button
      type="button"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      style={{ left: p.x + "%", top: p.y + "%" }}
      className="absolute z-10 -translate-x-1/2 -translate-y-1/2 focus:outline-none"
      aria-label={`${p.titulo} · ${precioLargo(p.precio)} · ${p.estado}`}
    >
      <span
        className={
          "precio flex items-center rounded-[var(--radius)] border px-1.5 py-0.5 text-[11px] font-bold shadow-pop transition-transform hover:z-20 hover:scale-110 " +
          pinDeProp[p.estado] +
          (p.reciente ? " pin-vivo" : "")
        }
      >
        {precioCompacto(p.precio)}
      </span>
      {hover && <MiniCard p={p} />}
    </button>
  )
}

function PinCluster({ c }: { c: Cluster }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      style={{ left: c.x + "%", top: c.y + "%" }}
      className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
    >
      <button
        type="button"
        className="precio flex h-8 w-8 items-center justify-center rounded-full border-2 border-surface bg-fg text-xs font-bold text-bg shadow-pop transition-transform hover:scale-110"
        aria-label={`${c.pins.length} propiedades en esta zona`}
      >
        +{c.pins.length}
      </button>
      {open && (
        <div className="surface-card absolute left-1/2 top-full z-30 w-56 -translate-x-1/2 translate-y-2 p-2 shadow-pop">
          <p className="mb-1 px-1 text-[10px] uppercase tracking-widest text-muted">
            {c.pins.length} propiedades
          </p>
          <ul className="max-h-44 space-y-0.5 overflow-y-auto">
            {c.pins.map((p) => (
              <li key={p.id} className="flex items-center gap-2 rounded-[var(--radius)] px-1.5 py-1 hover:bg-subtle">
                <span className={"h-2 w-2 shrink-0 rounded-full " + puntoDeProp[p.estado]} />
                <span className="precio text-xs font-bold text-fg">{precioCompacto(p.precio)}</span>
                <span className="truncate text-[11px] text-muted">{p.zona}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export function MapaCartera({ pins, alto = "h-[26rem]" }: { pins: MapaPin[]; alto?: string }) {
  const clusters = agrupar(pins)
  const disp = pins.filter((p) => p.estado === "disponible").length
  const res = pins.filter((p) => p.estado === "reservada").length
  const ven = pins.filter((p) => p.estado === "vendida").length

  return (
    <section className="surface-card overflow-hidden p-0">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-3">
        <h2 className="font-heading text-sm font-bold uppercase tracking-widest">Mapa de propiedades</h2>
        <div className="flex flex-wrap gap-2">
          <span className="chip bg-primary/15 text-primary"><span className="h-2 w-2 rounded-full bg-primary" />{disp} disponibles</span>
          <span className="chip bg-accent/15 text-accent"><span className="h-2 w-2 rounded-full bg-accent" />{res} reservadas</span>
          <span className="chip bg-muted/20 text-muted"><span className="h-2 w-2 rounded-full bg-muted" />{ven} vendidas</span>
        </div>
      </header>

      <div className={"relative w-full overflow-hidden bg-subtle/40 " + alto}>
        {/* Silueta de zona en trazo fino: cuaderno de tasaciones, sin tiles reales. */}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full text-border">
          {/* rio */}
          <path d="M-2 22 C 20 30, 30 12, 52 20 S 88 34, 104 26" fill="none" stroke="rgb(var(--info))" strokeOpacity="0.35" strokeWidth="2.4" />
          {/* avenidas */}
          <path d="M0 62 L100 54 M0 80 L100 74 M34 100 L40 8 M68 100 L72 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
          {/* manzanas / barrios */}
          <g fill="rgb(var(--primary))" fillOpacity="0.05" stroke="currentColor" strokeWidth="0.6">
            <path d="M8 34 L30 31 L33 52 L11 55 Z" />
            <path d="M42 30 L64 27 L67 50 L45 53 Z" />
            <path d="M76 26 L96 24 L98 46 L79 49 Z" />
            <path d="M12 60 L34 57 L37 82 L15 85 Z" />
            <path d="M46 58 L70 55 L73 80 L49 83 Z" />
            <path d="M78 54 L97 52 L99 78 L81 80 Z" />
          </g>
          {/* plaza */}
          <circle cx="40" cy="42" r="3.2" fill="rgb(var(--primary))" fillOpacity="0.12" stroke="currentColor" strokeWidth="0.5" />
        </svg>
        <span className="absolute left-4 top-3 text-[10px] uppercase tracking-[0.3em] text-muted">Zona centro · costa</span>

        {clusters.map((c, i) =>
          c.pins.length === 1 ? <PinUnico key={c.pins[0].id} p={c.pins[0]} /> : <PinCluster key={"c" + i} c={c} />
        )}
      </div>
    </section>
  )
}
