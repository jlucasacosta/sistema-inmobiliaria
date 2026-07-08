"use client"
import { useEffect, useState } from "react"
import { getThreads, getMessages, type Thread, type Message } from "./api"

export function ConversacionesPage() {
  const [threads, setThreads] = useState<Thread[]>([])
  const [active, setActive] = useState<string | null>(null)
  const [msgs, setMsgs] = useState<Message[]>([])

  useEffect(() => {
    getThreads().then((t) => {
      setThreads(t)
      setActive(t[0]?.id ?? null)
    })
  }, [])

  useEffect(() => {
    if (active) getMessages(active).then(setMsgs)
  }, [active])

  return (
    <div className="flex h-[calc(100vh-2*var(--pad))] gap-4">
      <div className="w-72 shrink-0 overflow-y-auto rounded border border-border bg-surface">
        {threads.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={
              "flex w-full items-start justify-between gap-2 border-b border-border p-3 text-left " +
              (active === t.id ? "bg-bg" : "")
            }
          >
            <div className="min-w-0">
              <p className="truncate font-medium">{t.name}</p>
              <p className="truncate text-sm text-muted">{t.last}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-xs text-muted">{t.time}</span>
              {t.unread > 0 && (
                <span className="rounded bg-primary px-1.5 text-xs text-bg">{t.unread}</span>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="flex flex-1 flex-col rounded border border-border bg-surface">
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {msgs.map((m) => (
            <div
              key={m.id}
              className={
                "max-w-[70%] rounded p-2 text-sm " +
                (m.from === "vos" ? "ml-auto bg-primary text-bg" : "bg-bg")
              }
            >
              {m.text}
              <span className="mt-1 block text-xs opacity-60">{m.time}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-border p-3">
          <input
            placeholder="Escribi un mensaje..."
            className="w-full rounded border border-border bg-bg px-3 py-2 text-sm outline-none"
          />
        </div>
      </div>
    </div>
  )
}
