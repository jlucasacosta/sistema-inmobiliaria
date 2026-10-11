"use client"
import { useId, useState } from "react"
import { ChevronDown } from "lucide-react"
import { theme } from "@/shell/theme"
import { precioLargo } from "@/shell/cartera"
import { Encabezado } from "@/shell/encabezado"

// Arquetipo: ACORDEON (secciones colapsables). Dentro del sistema no se repite un
// arquetipo. Todo lo que se muestra sale de shell/theme.ts.

function Fila({ label, value, swatch }: { label: string; value: string; swatch?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm text-muted">{label}</span>
      <span className="flex items-center gap-2 text-sm font-medium">
        {swatch && <span className="h-4 w-4 rounded-[var(--radius)] border border-border" style={{ background: value }} />}
        {value}
      </span>
    </div>
  )
}

function Toggle({ label, on }: { label: string; on: boolean }) {
  const [v, setV] = useState(on)
  // La fila entera es el switch: el nombre sale del texto y el area de toque llega a 44 px.
  return (
    <button
      type="button"
      role="switch"
      aria-checked={v}
      onClick={() => setV((x) => !x)}
      className="flex min-h-11 w-full items-center justify-between py-1.5 text-left"
    >
      <span className="text-sm text-muted">{label}</span>
      <span
        aria-hidden="true"
        className={"relative h-5 w-9 shrink-0 rounded-full transition-colors " + (v ? "bg-primary" : "bg-subtle")}
      >
        <span className={"absolute top-0.5 h-4 w-4 rounded-full bg-surface shadow-sm transition-all " + (v ? "left-[1.15rem]" : "left-0.5")} />
      </span>
    </button>
  )
}

function Seccion({ titulo, sub, abierta, onToggle, children }: { titulo: string; sub: string; abierta: boolean; onToggle: () => void; children: React.ReactNode }) {
  const panelId = useId()
  return (
    <section className="surface-card overflow-hidden p-0">
      <h2>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={abierta}
          aria-controls={panelId}
          className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-subtle"
        >
          <span>
            <span className="block font-heading text-sm font-bold uppercase tracking-widest">{titulo}</span>
            <span className="block text-xs text-muted">{sub}</span>
          </span>
          <ChevronDown size={18} aria-hidden="true" className={"shrink-0 text-muted transition-transform " + (abierta ? "rotate-180" : "")} />
        </button>
      </h2>
      <div id={panelId} hidden={!abierta} className="space-y-1 border-t border-border px-5 py-4">
        {children}
      </div>
    </section>
  )
}

const equipo = [
  { nombre: "Lucía Ferrari", rol: "Corredora senior", ops: 5 },
  { nombre: "Rodrigo Méndez", rol: "Corredor", ops: 3 },
  { nombre: "Sofía Núñez", rol: "Asesora", ops: 2 },
]

export function ConfigPage() {
  const c = theme.colors
  const [open, setOpen] = useState<string>("marca")
  const toggle = (k: string) => setOpen((o) => (o === k ? "" : k))

  return (
    <div className="space-y-5">
      <Encabezado titulo="Configuración" subtitulo="Todo se define en shell/theme.ts" />

      <div className="space-y-3">
        <Seccion titulo="Marca e identidad" sub="Palancas de diseño del theme" abierta={open === "marca"} onToggle={() => toggle("marca")}>
          <Fila label="Nombre" value={theme.brand.name} />
          <Fila label="Modo" value={theme.mode} />
          <Fila label="Navegación" value={theme.nav} />
          <Fila label="Elevación" value={theme.elevation} />
          <Fila label="Bordes" value={theme.radius} />
          <Fila label="Densidad" value={theme.density} />
          <Fila label="Badges" value={theme.badge} />
          <Fila label="Títulos" value={theme.font.heading} />
          <Fila label="Cuerpo" value={theme.font.body} />
        </Seccion>

        <Seccion titulo="Paleta" sub="Verde-pino + terracota: tierra construida" abierta={open === "paleta"} onToggle={() => toggle("paleta")}>
          <Fila label="Primario (verde-pino)" value={c.primary} swatch />
          <Fila label="Acento (terracota)" value={c.accent} swatch />
          <Fila label="Disponible" value={c.success} swatch />
          <Fila label="Por seguir" value={c.warning} swatch />
          <Fila label="Perdida" value={c.danger} swatch />
          <Fila label="Nuevo lead" value={c.info} swatch />
        </Seccion>

        <Seccion titulo="Umbrales de cartera" sub="Constantes de dominio en el theme" abierta={open === "umbrales"} onToggle={() => toggle("umbrales")}>
          <Fila label="Cartera tibia" value={`${theme.cartera.tibia} días`} />
          <Fila label="Cartera fría" value={`${theme.cartera.fria} días`} />
          <Fila label="Meta cierres" value={`${theme.meta.cierres} / mes`} />
          <Fila label="Meta captaciones" value={`${theme.meta.captaciones} / mes`} />
          <Fila label="Meta comisión" value={precioLargo(theme.meta.comision)} />
          <p className="pt-2 text-xs text-muted">Cambiar estos números recolorea toda la cartera y mueve las barras de meta.</p>
        </Seccion>

        <Seccion titulo="Notificaciones" sub="Avisos del día (mock)" abierta={open === "notif"} onToggle={() => toggle("notif")}>
          <Toggle label="Nueva consulta entrante" on={true} />
          <Toggle label="Lead sin responder +1 h" on={true} />
          <Toggle label="Propiedad reservada" on={true} />
          <Toggle label="Resumen diario por mail" on={false} />
        </Seccion>

        <Seccion titulo="Integraciones" sub="Conexiones externas (mock)" abierta={open === "integr"} onToggle={() => toggle("integr")}>
          <Fila label="Portal de listings" value="conectado" />
          <Fila label="WhatsApp Business" value="conectado" />
          <Fila label="Firma digital" value="pendiente" />
          <Fila label="CRM contable" value="no conectado" />
        </Seccion>

        <Seccion titulo="Equipo" sub="Corredores de la oficina" abierta={open === "equipo"} onToggle={() => toggle("equipo")}>
          {equipo.map((m) => (
            <div key={m.nombre} className="flex items-center justify-between border-b border-border py-2 last:border-0">
              <span>
                <span className="block text-sm font-medium">{m.nombre}</span>
                <span className="block text-xs text-muted">{m.rol}</span>
              </span>
              <span className="precio text-sm font-bold text-primary">{m.ops} <span className="text-xs font-normal text-muted">cierres</span></span>
            </div>
          ))}
        </Seccion>
      </div>
    </div>
  )
}
