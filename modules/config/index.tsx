import { theme } from "@/shell/theme"

function Row({ label, value, swatch }: { label: string; value: string; swatch?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted">{label}</span>
      <span className="flex items-center gap-2 text-sm font-medium">
        {swatch && <span className="h-4 w-4 rounded-full border border-border" style={{ background: value }} />}
        {value}
      </span>
    </div>
  )
}

const chips: { label: string; cls: string }[] = [
  { label: "activo", cls: "bg-success/15 text-success" },
  { label: "nuevo", cls: "bg-info/15 text-info" },
  { label: "en seguimiento", cls: "bg-warning/15 text-warning" },
  { label: "perdido", cls: "bg-danger/15 text-danger" },
]

export function ConfigPage() {
  const c = theme.colors
  return (
    <div className="space-y-8">
      <h1 className="font-heading text-2xl font-semibold">Configuracion</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="max-w-md space-y-4 rounded-xl bg-surface p-6 shadow-card">
          <h2 className="font-heading text-base font-semibold">Identidad</h2>
          <Row label="Marca" value={theme.brand.name} />
          <Row label="Modo" value={theme.mode} />
          <Row label="Tipografia" value={theme.font.heading} />
          <Row label="Bordes" value={theme.radius} />
          <Row label="Densidad" value={theme.density} />
          <p className="pt-2 text-xs text-muted">
            Todo esto sale de shell/theme.ts. Cambias un archivo y muta el sistema entero.
          </p>
        </div>

        <div className="max-w-md space-y-4 rounded-xl bg-surface p-6 shadow-card">
          <h2 className="font-heading text-base font-semibold">Paleta</h2>
          <Row label="Primario" value={c.primary} swatch />
          <Row label="Acento" value={c.accent} swatch />
          <Row label="Success" value={c.success} swatch />
          <Row label="Warning" value={c.warning} swatch />
          <Row label="Danger" value={c.danger} swatch />
          <Row label="Info" value={c.info} swatch />

          <div className="pt-2">
            <p className="mb-3 text-sm text-muted">Chips de estado</p>
            <div className="flex flex-wrap gap-2">
              {chips.map((ch) => (
                <span key={ch.label} className={"rounded-full px-2.5 py-0.5 text-xs " + ch.cls}>
                  {ch.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
