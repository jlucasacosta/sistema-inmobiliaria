import type { ReactNode } from "react"

// encabezado.tsx · La cabecera que abre cada pantalla: h1 con la misma escala en todas,
// subtitulo opcional y, a la derecha, las metricas de la pantalla (header-con-metricas,
// DISENO.md §6). Un solo lugar para que ningun h1 se salga de la escala.

export function Encabezado({
  titulo,
  subtitulo,
  ocultarSubtituloEnMovil = false,
  children,
}: {
  titulo: string
  subtitulo?: string
  ocultarSubtituloEnMovil?: boolean
  children?: ReactNode
}) {
  return (
    <header className="surface-card flex flex-wrap items-center justify-between gap-x-6 gap-y-3 p-4 md:p-5">
      <div className="min-w-0">
        <h1 className="font-heading text-2xl font-bold tracking-tight">{titulo}</h1>
        {subtitulo && <p className={"text-sm text-muted " + (ocultarSubtituloEnMovil ? "hidden md:block" : "")}>{subtitulo}</p>}
      </div>
      {children}
    </header>
  )
}

// Una cifra de la cabecera. Mientras carga, `valor` es "—" (nunca un 0 falso).
// `compacta` la deja en una fila angosta en celular: sin la linea de abajo y con cifra chica.
export function Metrica({
  label,
  valor,
  sub,
  compacta = false,
}: {
  label: ReactNode
  valor: ReactNode
  sub?: string
  compacta?: boolean
}) {
  return (
    <div className="flex min-w-0 flex-col">
      <span className="text-xs text-muted">{label}</span>
      <span className={"precio font-semibold leading-tight text-fg " + (compacta ? "text-base md:text-xl" : "text-xl")}>{valor}</span>
      {sub && <span className={"text-xs text-muted " + (compacta ? "hidden md:block" : "")}>{sub}</span>}
    </div>
  )
}
