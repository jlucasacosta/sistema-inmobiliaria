import { LayoutDashboard, Building2, MessageSquare, Columns3, Phone, Users, Settings, type LucideIcon } from "lucide-react"

export type NavItem = { label: string; href: string; icon: LucideIcon }

export const nav: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Propiedades", href: "/propiedades", icon: Building2 },
  { label: "Conversaciones", href: "/conversaciones", icon: MessageSquare },
  { label: "Pipeline", href: "/pipeline", icon: Columns3 },
  { label: "Llamadas", href: "/llamadas", icon: Phone },
  { label: "Contactos", href: "/contactos", icon: Users },
  { label: "Configuracion", href: "/config", icon: Settings },
]
