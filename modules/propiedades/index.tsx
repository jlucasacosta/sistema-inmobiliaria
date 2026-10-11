"use client"
import { useEffect, useMemo, useState, type ReactNode } from "react"
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react"
import { getPropiedades, type Propiedad, type TipoProp } from "./api"
import {
  chipDeProp,
  chipDeTemperatura,
  etiquetaDeTemperatura,
  temperaturaCartera,
  precioLargo,
  type EstadoProp,
} from "@/shell/cartera"

// Arquetipo: TABLA DE CRM. Una cartera se compara fila a fila (precio, m2, dias en
// cartera), asi que es una tabla ordenable y filtrable, sin fotos ni mapa ni animacion.
// Desde md: tabla semantica. En celular: la misma data como lista de filas compactas.

const POR_PAGINA = 10

const etiquetaDeTipo: Record<TipoProp, string> = {
  apartamento: "Apartamento",
  casa: "Casa",
  ph: "PH",
  terreno: "Terreno",
  local: "Local",
}

const filtrosEstado: Array<EstadoProp | "todas"> = ["todas", "disponible", "reservada", "vendida"]
const etiquetaDeFiltro: Record<EstadoProp | "todas", string> = {
  todas: "Todas",
  disponible: "Disponibles",
  reservada: "Reservadas",
  vendida: "Vendidas",
}
const ordenDeEstado: Record<EstadoProp, number> = { disponible: 0, reservada: 1, vendida: 2 }

type ClaveOrden = "titulo" | "tipo" | "precio" | "m2" | "ambientes" | "estado" | "dias"
type Dir = "asc" | "desc"
type Orden = { clave: ClaveOrden; dir: Dir } | null

const columnas: Array<{ clave: ClaveOrden; label: string; derecha?: boolean }> = [
  { clave: "titulo", label: "Propiedad" },
  { clave: "tipo", label: "Tipo" },
  { clave: "precio", label: "Precio", derecha: true },
  { clave: "m2", label: "Superficie", derecha: true },
  { clave: "ambientes", label: "Dorm. / Baños" },
  { clave: "estado", label: "Estado" },
  { clave: "dias", label: "En cartera" },
]

const opcionesOrden: Array<{ valor: string; label: string }> = [
  { valor: "", label: "Orden original" },
  { valor: "precio:asc", label: "Precio: menor a mayor" },
  { valor: "precio:desc", label: "Precio: mayor a menor" },
  { valor: "m2:desc", label: "Superficie: mayor a menor" },
  { valor: "dias:desc", label: "Más tiempo en cartera" },
  { valor: "dias:asc", label: "Menos tiempo en cartera" },
  { valor: "titulo:asc", label: "Nombre: A a Z" },
]

// Para buscar sin importar tildes ni mayusculas.
function normalizar(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
}

function valorDeOrden(p: Propiedad, clave: ClaveOrden): string | number {
  switch (clave) {
    case "titulo": return normalizar(p.titulo)
    case "tipo": return etiquetaDeTipo[p.tipo]
    case "precio": return p.precio
    case "m2": return p.m2
    case "ambientes": return p.dorm * 100 + p.banos
    case "estado": return ordenDeEstado[p.estado]
    case "dias": return p.diasEnCartera
  }
}

function ambientes(p: Propiedad): string {
  const partes: string[] = []
  if (p.dorm > 0) partes.push(`${p.dorm} dorm.`)
  if (p.banos > 0) partes.push(`${p.banos} ${p.banos === 1 ? "baño" : "baños"}`)
  return partes.length ? partes.join(" · ") : "—"
}

function Kpi({ label, valor, sub }: { label: string; valor: string; sub: string }) {
  return (
    <div className="surface-card min-w-0 p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</p>
      <p className="precio mt-1 break-words text-xl font-bold leading-tight text-fg sm:text-2xl">{valor}</p>
      <p className="mt-0.5 text-xs text-muted">{sub}</p>
    </div>
  )
}

// Base surface: el tinte 15% del chip se mezcla siempre contra blanco, tambien con la fila en hover (contraste >=4.5:1).
function Base({ children }: { children: ReactNode }) {
  return <span className="inline-flex rounded-[var(--badge-radius)] bg-surface">{children}</span>
}

function ChipEstado({ estado }: { estado: EstadoProp }) {
  return <Base><span className={"chip capitalize " + chipDeProp[estado]}>{estado}</span></Base>
}

function ChipTemperatura({ dias }: { dias: number }) {
  const t = temperaturaCartera(dias)
  return <Base><span className={"chip capitalize " + chipDeTemperatura[t]}>{etiquetaDeTemperatura[t]}</span></Base>
}

function Destacada() {
  return <Base><span className="chip bg-warning/15 text-warning">Destacada</span></Base>
}

const campo =
  "h-11 rounded-[var(--radius)] border border-border bg-surface px-3 text-sm text-fg placeholder:text-muted md:h-9"

export function PropiedadesPage() {
  const [items, setItems] = useState<Propiedad[]>([])
  const [cargado, setCargado] = useState(false)
  const [busqueda, setBusqueda] = useState("")
  const [estado, setEstado] = useState<EstadoProp | "todas">("todas")
  const [tipo, setTipo] = useState<TipoProp | "todos">("todos")
  const [zona, setZona] = useState("todas")
  const [orden, setOrden] = useState<Orden>(null)
  const [pagina, setPagina] = useState(1)

  useEffect(() => {
    getPropiedades().then((r) => {
      setItems(r)
      setCargado(true)
    })
  }, [])

  const tipos = useMemo(() => Array.from(new Set(items.map((p) => p.tipo))).sort((a, b) => etiquetaDeTipo[a].localeCompare(etiquetaDeTipo[b], "es")), [items])
  const zonas = useMemo(() => Array.from(new Set(items.map((p) => p.zona))).sort((a, b) => a.localeCompare(b, "es")), [items])

  const textoBuscado = normalizar(busqueda.trim())
  // Los conteos por estado respetan el resto de los filtros (buscador, tipo, zona).
  const base = useMemo(
    () =>
      items.filter(
        (p) =>
          (tipo === "todos" || p.tipo === tipo) &&
          (zona === "todas" || p.zona === zona) &&
          (textoBuscado === "" || normalizar(p.titulo).includes(textoBuscado) || normalizar(p.zona).includes(textoBuscado))
      ),
    [items, tipo, zona, textoBuscado]
  )
  const conteo: Record<EstadoProp | "todas", number> = {
    todas: base.length,
    disponible: base.filter((p) => p.estado === "disponible").length,
    reservada: base.filter((p) => p.estado === "reservada").length,
    vendida: base.filter((p) => p.estado === "vendida").length,
  }

  const filtradas = useMemo(() => {
    const lista = estado === "todas" ? base : base.filter((p) => p.estado === estado)
    if (!orden) return lista
    const signo = orden.dir === "asc" ? 1 : -1
    return [...lista].sort((a, b) => {
      const va = valorDeOrden(a, orden.clave)
      const vb = valorDeOrden(b, orden.clave)
      if (typeof va === "number" && typeof vb === "number") return (va - vb) * signo
      return String(va).localeCompare(String(vb), "es") * signo
    })
  }, [base, estado, orden])

  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / POR_PAGINA))
  const paginaActual = Math.min(pagina, totalPaginas)
  const visibles = filtradas.slice((paginaActual - 1) * POR_PAGINA, paginaActual * POR_PAGINA)

  const hayFiltros = busqueda !== "" || estado !== "todas" || tipo !== "todos" || zona !== "todas"

  const disponibles = items.filter((p) => p.estado === "disponible")
  const reservadas = items.filter((p) => p.estado === "reservada").length
  const vendidas = items.filter((p) => p.estado === "vendida").length
  const valorDisponible = disponibles.reduce((a, p) => a + p.precio, 0)
  const ticketPromedio = disponibles.length ? Math.round(valorDisponible / disponibles.length) : 0

  function limpiar() {
    setBusqueda("")
    setEstado("todas")
    setTipo("todos")
    setZona("todas")
    setPagina(1)
  }

  function ordenarPor(clave: ClaveOrden) {
    setOrden((o) => (o && o.clave === clave ? { clave, dir: o.dir === "asc" ? "desc" : "asc" } : { clave, dir: "asc" }))
    setPagina(1)
  }

  function ariaSort(clave: ClaveOrden): "ascending" | "descending" | "none" {
    if (!orden || orden.clave !== clave) return "none"
    return orden.dir === "asc" ? "ascending" : "descending"
  }

  const valorSelectOrden = orden ? `${orden.clave}:${orden.dir}` : ""

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-heading text-2xl font-bold tracking-tight">Propiedades</h1>
        <p className="text-sm text-muted">Cartera activa de Nexo Propiedades: precios, estado y tiempo en cartera.</p>
      </header>

      <section aria-label="Resumen de la cartera" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi label="En cartera" valor={String(items.length)} sub={`${reservadas} reservadas · ${vendidas} vendidas`} />
        <Kpi label="Disponibles" valor={String(disponibles.length)} sub="a la venta hoy" />
        <Kpi label="Valor disponible" valor={precioLargo(valorDisponible)} sub="suma de las disponibles" />
        <Kpi label="Ticket promedio" valor={precioLargo(ticketPromedio)} sub="por propiedad disponible" />
      </section>

      <section aria-label="Listado de propiedades" className="surface-card overflow-hidden">
        <div className="space-y-3 border-b border-border p-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex w-full flex-col gap-1 md:w-72">
              <label htmlFor="prop-buscar" className="text-xs font-semibold text-muted">Buscar</label>
              <input
                id="prop-buscar"
                type="search"
                value={busqueda}
                onChange={(e) => {
                  setBusqueda(e.target.value)
                  setPagina(1)
                }}
                placeholder="Título o zona"
                autoComplete="off"
                className={campo}
              />
            </div>
            <div className="flex min-w-[9rem] flex-1 flex-col gap-1 md:flex-none">
              <label htmlFor="prop-tipo" className="text-xs font-semibold text-muted">Tipo</label>
              <select
                id="prop-tipo"
                value={tipo}
                onChange={(e) => {
                  setTipo(e.target.value as TipoProp | "todos")
                  setPagina(1)
                }}
                className={campo}
              >
                <option value="todos">Todos</option>
                {tipos.map((t) => (
                  <option key={t} value={t}>{etiquetaDeTipo[t]}</option>
                ))}
              </select>
            </div>
            <div className="flex min-w-[9rem] flex-1 flex-col gap-1 md:flex-none">
              <label htmlFor="prop-zona" className="text-xs font-semibold text-muted">Zona</label>
              <select
                id="prop-zona"
                value={zona}
                onChange={(e) => {
                  setZona(e.target.value)
                  setPagina(1)
                }}
                className={campo}
              >
                <option value="todas">Todas</option>
                {zonas.map((z) => (
                  <option key={z} value={z}>{z}</option>
                ))}
              </select>
            </div>
            <div className="flex w-full flex-col gap-1 md:hidden">
              <label htmlFor="prop-orden" className="text-xs font-semibold text-muted">Ordenar por</label>
              <select
                id="prop-orden"
                value={valorSelectOrden}
                onChange={(e) => {
                  const v = e.target.value
                  if (v === "") setOrden(null)
                  else {
                    const [clave, dir] = v.split(":") as [ClaveOrden, Dir]
                    setOrden({ clave, dir })
                  }
                  setPagina(1)
                }}
                className={campo}
              >
                {opcionesOrden.map((o) => (
                  <option key={o.valor} value={o.valor}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div role="group" aria-label="Filtrar por estado de la propiedad" className="flex flex-wrap gap-2">
              {filtrosEstado.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => {
                    setEstado(f)
                    setPagina(1)
                  }}
                  aria-pressed={estado === f}
                  className={
                    "tap chip relative px-3 py-1 text-xs " +
                    (estado === f ? "bg-primary text-bg" : "bg-subtle text-fg hover:bg-border")
                  }
                >
                  {etiquetaDeFiltro[f]} ({conteo[f]})
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 text-sm text-muted">
              <p aria-live="polite">
                Mostrando {filtradas.length} de {items.length} propiedades
              </p>
              {hayFiltros && (
                <button
                  type="button"
                  onClick={limpiar}
                  className="relative tap rounded-[var(--radius)] px-2 py-1 text-sm font-semibold text-primary underline underline-offset-2"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          </div>
        </div>

        {cargado && filtradas.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <p className="font-heading text-base font-semibold">No hay propiedades con esos filtros</p>
            <p className="mt-1 text-sm text-muted">Probá con otra búsqueda, otro tipo o otra zona.</p>
            {hayFiltros && (
              <button
                type="button"
                onClick={limpiar}
                className="relative tap mt-3 rounded-[var(--radius)] border border-border bg-surface px-3 py-2 text-sm font-semibold text-primary hover:bg-subtle"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Celular: filas compactas, sin scroll horizontal de pagina. */}
            <ul className="md:hidden">
              {visibles.map((p) => (
                <li key={p.id} className="border-b border-border px-4 py-3 last:border-0">
                  <div className="flex items-start justify-between gap-3">
                    <p className="precio min-w-0 text-lg font-bold leading-tight text-fg">{precioLargo(p.precio)}</p>
                    <ChipEstado estado={p.estado} />
                  </div>
                  <p className="mt-1 break-words text-sm font-semibold leading-snug text-fg">{p.titulo}</p>
                  <p className="text-xs text-muted">{p.zona} · {etiquetaDeTipo[p.tipo]} · {p.m2} m²</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted">
                    <span>{ambientes(p)}{p.cochera ? " · cochera" : ""}</span>
                    <span aria-hidden="true">·</span>
                    <span>{p.diasEnCartera} días en cartera</span>
                    <ChipTemperatura dias={p.diasEnCartera} />
                    {p.destacada && <Destacada />}
                  </div>
                </li>
              ))}
            </ul>

            {/* Escritorio: tabla semantica con encabezados ordenables. */}
            <div role="region" aria-label="Tabla de propiedades" tabIndex={0} className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[56rem] border-collapse text-sm">
                <caption className="sr-only">
                  Cartera de propiedades: tipo, precio, superficie, dormitorios y baños, estado y días en cartera
                </caption>
                <thead>
                  <tr className="border-b border-border bg-subtle text-left text-xs text-muted">
                    {columnas.map((c) => {
                      const activa = orden?.clave === c.clave
                      return (
                        <th
                          key={c.clave}
                          scope="col"
                          aria-sort={ariaSort(c.clave)}
                          className={"px-4 py-2 font-semibold " + (c.derecha ? "text-right" : "")}
                        >
                          <button
                            type="button"
                            onClick={() => ordenarPor(c.clave)}
                            className={
                              "relative inline-flex items-center gap-1 rounded-[var(--radius)] py-1 font-semibold uppercase tracking-wider hover:text-fg " +
                              (activa ? "text-fg" : "")
                            }
                          >
                            {c.label}
                            {activa ? (
                              orden?.dir === "asc" ? <ArrowUp size={12} aria-hidden="true" /> : <ArrowDown size={12} aria-hidden="true" />
                            ) : (
                              <ChevronsUpDown size={12} aria-hidden="true" />
                            )}
                            <span className="sr-only">, ordenar</span>
                          </button>
                        </th>
                      )
                    })}
                  </tr>
                </thead>
                <tbody>
                  {visibles.map((p) => (
                    <tr key={p.id} className="border-b border-border last:border-0 hover:bg-subtle">
                      <th scope="row" className="px-4 py-3 text-left font-normal">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-fg">{p.titulo}</span>
                          {p.destacada && <Destacada />}
                        </span>
                        <span className="block text-xs text-muted">{p.zona}</span>
                      </th>
                      <td className="px-4 py-3 text-fg">{etiquetaDeTipo[p.tipo]}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-right">
                        <span className="precio font-bold tabular-nums text-fg">{precioLargo(p.precio)}</span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums text-fg">{p.m2} m²</td>
                      <td className="whitespace-nowrap px-4 py-3 text-fg">
                        {ambientes(p)}
                        {p.cochera && <span className="block text-xs text-muted">con cochera</span>}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3"><ChipEstado estado={p.estado} /></td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span className="flex items-center gap-2">
                          <span className="tabular-nums text-fg">{p.diasEnCartera} días</span>
                          <ChipTemperatura dias={p.diasEnCartera} />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <nav aria-label="Paginación" className="flex items-center justify-between gap-3 border-t border-border px-4 py-3">
              <button
                type="button"
                onClick={() => setPagina(paginaActual - 1)}
                disabled={paginaActual <= 1}
                aria-label="Página anterior"
                className="min-h-11 rounded-[var(--radius)] border border-border bg-surface px-3 text-sm font-semibold text-fg hover:bg-subtle disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-surface md:min-h-9"
              >
                Anterior
              </button>
              <p className="text-sm text-muted">Página {paginaActual} de {totalPaginas}</p>
              <button
                type="button"
                onClick={() => setPagina(paginaActual + 1)}
                disabled={paginaActual >= totalPaginas}
                aria-label="Página siguiente"
                className="min-h-11 rounded-[var(--radius)] border border-border bg-surface px-3 text-sm font-semibold text-fg hover:bg-subtle disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-surface md:min-h-9"
              >
                Siguiente
              </button>
            </nav>
          </>
        )}
      </section>
    </div>
  )
}
