"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { nav } from "./nav-config"
import { theme } from "./theme"

export function Sidebar() {
  const path = usePathname()
  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-border bg-surface p-[var(--pad)]">
      <div className="mb-6 px-2 text-lg font-heading font-bold">{theme.brand.name}</div>
      <nav className="space-y-1">
        {nav.map(({ label, href, icon: Icon }) => {
          const active = path === href
          return (
            <Link
              key={href}
              href={href}
              className={
                "flex items-center gap-3 rounded px-3 py-2 text-sm transition-colors " +
                (active ? "bg-primary text-bg" : "text-muted hover:bg-bg hover:text-fg")
              }
            >
              <Icon size={18} />
              {label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
