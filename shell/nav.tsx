"use client"
import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { nav } from "./nav-config"
import { theme } from "./theme"

// Tres chasis distintos sobre el mismo nav-config. La palanca `theme.nav` decide.
// Nexo usa `sidebar`: sistema denso de 7 modulos, navegacion editorial estable.

function Marca({ compact = false }: { compact?: boolean }) {
  const iniciales = theme.brand.name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
  if (compact) {
    return (
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-bg">
        {iniciales}
      </span>
    )
  }
  return <span className="font-heading text-lg font-semibold">{theme.brand.name}</span>
}

// --- sidebar: herramienta de escritorio. Etiquetas siempre visibles. ---
// Desde md queda fija (sticky + h-dvh) y lleva al pie la marca y la cuenta demo.
// En celular es una tira horizontal: el item activo se centra al cargar y, mientras queda
// menu por scrollear hacia la derecha, el borde se desvanece (clase .nav-fade) como pista.
function Sidebar({ path }: { path: string | null }) {
  const lista = useRef<HTMLElement>(null)
  const activo = useRef<HTMLAnchorElement>(null)
  const [hayMas, setHayMas] = useState(false)

  const medir = useCallback(() => {
    const el = lista.current
    if (!el) return
    setHayMas(el.scrollWidth - el.clientWidth - el.scrollLeft > 4)
  }, [])

  useEffect(() => {
    if (window.matchMedia("(max-width: 767px)").matches) {
      activo.current?.scrollIntoView({ inline: "center", block: "nearest" })
    }
    medir()
    window.addEventListener("resize", medir)
    return () => window.removeEventListener("resize", medir)
  }, [path, medir])

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-border bg-surface p-[var(--pad)] md:sticky md:top-0 md:h-dvh md:w-56 md:overflow-y-auto md:border-b-0 md:border-r">
      <div className="mb-2 px-3 pt-1 md:mb-8 md:pt-2">
        <Marca />
      </div>
      {/* En celular los items van en una fila con scroll horizontal; desde md, la columna de siempre. */}
      <nav
        ref={lista}
        onScroll={medir}
        aria-label="Principal"
        className={
          "flex gap-1 overflow-x-auto px-1 py-1 md:block md:space-y-1 md:overflow-visible md:p-0 " +
          (hayMas ? "nav-fade" : "")
        }
      >
        {nav.map(({ label, href, icon: Icon }) => {
          const esActual = path === href
          return (
            <Link
              key={href}
              ref={esActual ? activo : undefined}
              href={href}
              aria-current={esActual ? "page" : undefined}
              className={
                "flex shrink-0 items-center gap-3 whitespace-nowrap rounded-[var(--radius)] px-3 py-2 text-sm transition-colors " +
                (esActual ? "bg-subtle font-medium text-primary" : "text-muted hover:bg-subtle hover:text-fg")
              }
            >
              <span
                className={
                  "flex h-7 w-7 items-center justify-center rounded-[var(--radius)] " +
                  (esActual ? "bg-primary/15 text-primary" : "bg-subtle text-muted")
                }
              >
                <Icon size={16} aria-hidden="true" />
              </span>
              {label}
            </Link>
          )
        })}
      </nav>
      {/* Pie del menu: la marca ficticia y la cuenta demo, para que se sienta producto. */}
      <div className="mt-auto hidden items-center gap-3 border-t border-border px-3 pt-3 md:flex">
        <span
          aria-hidden="true"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius)] bg-primary/15 text-xs font-semibold text-primary"
        >
          DM
        </span>
        <p className="min-w-0 text-xs leading-tight">
          <span className="block font-medium text-fg">Cuenta demo</span>
          <span className="block truncate text-muted">{theme.brand.name}</span>
        </p>
      </div>
    </aside>
  )
}

// --- topbar: app de consulta rapida. Pestañas arriba, lienzo ancho. ---
function Topbar({ path }: { path: string }) {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-surface">
      <div className="flex items-center gap-8 px-[var(--pad)] py-3">
        <Marca />
        <nav aria-label="Principal" className="flex flex-1 items-center gap-1 overflow-x-auto">
          {nav.map(({ label, href, icon: Icon }) => {
            const active = path === href
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={
                  "flex shrink-0 items-center gap-2 border-b-2 px-3 py-2 text-sm transition-colors " +
                  (active
                    ? "border-primary font-medium text-fg"
                    : "border-transparent text-muted hover:border-border hover:text-fg")
                }
              >
                <Icon size={16} aria-hidden="true" />
                {label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}

// --- rail: solo iconos. Maxima superficie para el contenido. ---
function Rail({ path }: { path: string }) {
  return (
    <aside className="flex w-16 shrink-0 flex-col items-center gap-2 border-r border-border bg-surface py-4">
      <div className="mb-6">
        <Marca compact />
      </div>
      <nav aria-label="Principal" className="flex flex-col items-center gap-2">
      {nav.map(({ label, href, icon: Icon }) => {
        const active = path === href
        return (
          <Link
            key={href}
            href={href}
            title={label}
            aria-label={label}
            aria-current={active ? "page" : undefined}
            className={
              "group relative flex h-10 w-10 items-center justify-center rounded-lg transition-colors " +
              (active ? "bg-primary text-bg" : "text-muted hover:bg-subtle hover:text-fg")
            }
          >
            <Icon size={20} strokeWidth={2.5} aria-hidden="true" />
            <span className="pointer-events-none absolute left-12 z-20 hidden whitespace-nowrap rounded-md bg-fg px-2 py-1 text-xs text-bg group-hover:block">
              {label}
            </span>
          </Link>
        )
      })}
      </nav>
    </aside>
  )
}

export function Nav() {
  const path = usePathname()
  if (theme.nav === "topbar") return <Topbar path={path} />
  if (theme.nav === "rail") return <Rail path={path} />
  return <Sidebar path={path} />
}
