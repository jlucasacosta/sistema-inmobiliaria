import type { ReactNode } from "react"

// chip.tsx · Base blanca del chip de estado.
// El tinte del chip (bg-X/15) se mezcla contra lo que tenga detras. Sobre la fila en hover o
// seleccionada (subtle) el contraste baja de 4.5:1, asi que el chip se apoya SIEMPRE sobre
// una base de superficie: el tinte se mezcla contra blanco en cualquier estado de la fila.
export function BaseChip({ children }: { children: ReactNode }) {
  return <span className="inline-flex rounded-[var(--badge-radius)] bg-surface">{children}</span>
}
