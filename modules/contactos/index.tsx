"use client"
import { useEffect, useState } from "react"
import { getContacts, type Contact } from "./api"

const badge: Record<Contact["status"], string> = {
  activo: "bg-accent text-bg",
  nuevo: "bg-primary text-bg",
  perdido: "bg-border text-muted",
}

export function ContactosPage() {
  const [rows, setRows] = useState<Contact[]>([])
  useEffect(() => {
    getContacts().then(setRows)
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-semibold">Contactos</h1>
      <div className="overflow-hidden rounded border border-border bg-surface">
        <table className="w-full text-sm">
          <thead className="border-b border-border text-left text-muted">
            <tr>
              <th className="p-3">Nombre</th>
              <th className="p-3">Telefono</th>
              <th className="p-3">Email</th>
              <th className="p-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-border last:border-0">
                <td className="p-3 font-medium">{r.name}</td>
                <td className="p-3 text-muted">{r.phone}</td>
                <td className="p-3 text-muted">{r.email}</td>
                <td className="p-3">
                  <span className={"rounded px-2 py-0.5 text-xs " + badge[r.status]}>{r.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
