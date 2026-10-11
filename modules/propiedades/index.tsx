"use client"
import { useMemo, useState } from "react"
import { ArrowDown, ArrowUp, ChevronsUpDown, Star } from "lucide-react"
import { getPropiedades, type Propiedad, type TipoProp } from "./api"
import {
  ayudaTemperatura,
  chipDeProp,
  chipDeTemperatura,
  etiquetaDeTemperatura,
  temperaturaDePropiedad,
  precioCompacto,
  precioLargo,
  type EstadoProp,
} from "@/shell/cartera"
import { useCarga, Esqueleto, ErrorCarga } from "@/shell/carga"
import { FichaLateral, DatoFicha, AvisoDemo, botonPrimario, botonSecundario } from "@/shell/ficha-lateral"
import { Encabezado, Metrica } from "@/shell/encabezado"
import { BaseChip as Base } from "@/shell/chip"

// Arquetipo: TABLA DE CRM. Una cartera se compara fila a fila (precio, m2, dias en
// cartera), asi que es una tabla ordenable y filtrable, sin fotos ni mapa ni animacion.
// Desde md: tabla semantica. En celular: la misma data como lista de filas compactas,
// con los selects (tipo, zona, orden) dentro de una hoja "Filtros".
// Cada fila abre la ficha de la propiedad (FichaLateral) con acciones de demostracion.

const POR_PAGINA = 10
const FILAS_ESQUELETO = 10

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
  { clave: "ambientes", label: "Ambientes" },
  { clave: "estado", label: "Estado" },
  { clave: "dias", label: "Antigüedad" },
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

// "2 dorm. · 2 baños · cochera": todo en una sola linea.
function ambientes(p: Propiedad): string {
  const partes: string[] = []
  if (p.dorm > 0) partes.push(`${p.dorm} dorm.`)
  if (p.banos > 0) partes.push(`${p.banos} ${p.banos === 1 ? "baño" : "baños"}`)
  if (p.cochera) partes.push("cochera")
  return partes.length ? partes.join(" · ") : "—"
}

function ChipEstado({ estado }: { estado: EstadoProp }) {
  return <Base><span className={"chip capitalize " + chipDeProp[estado]}>{estado}</span></Base>
}

// Guion largo con salida para el lector de pantalla: "no aplica".
function NoAplica() {
  return (
    <span className="text-muted">
      <span aria-hidden="true">—</span>
      <span className="sr-only">no aplica</span>
    </span>
  )
}

// La temperatura (Fresca/Tibia/Fria) solo existe en una propiedad disponible.
function Temperatura({ p }: { p: Propiedad }) {
  const t = temperaturaDePropiedad(p.estado, p.diasEnCartera)
  if (!t) return <NoAplica />
  return <Base><span className={"chip capitalize " + chipDeTemperatura[t]}>{etiquetaDeTemperatura[t]}</span></Base>
}

// "Destacada": marcador de texto chico con estrella, al lado del titulo (no es un chip).
function Destacada() {
  return (
    <span className="inline-flex shrink-0 items-center gap-1 text-xs text-muted">
      <Star size={12} aria-hidden="true" className="text-warning" />
      Destacada
    </span>
  )
}

const campo =
  "h-11 rounded-[var(--radius)] border border-border bg-surface px-3 text-sm text-fg placeholder:text-muted md:h-9"

export function PropiedadesPage() {
  const { data, error, cargando, reintentar } = useCarga(getPropiedades)
  const items = useMemo(() => data ?? [], [data])
  const [busqueda, setBusqueda] = useState("")
  const [estado, setEstado] = useState<EstadoProp | "todas">("todas")
  const [tipo, setTipo] = useState<TipoProp | "todos">("todos")
  const [zona, setZona] = useState("todas")
  const [orden, setOrden] = useState<Orden>(null)
  const [pagina, setPagina] = useState(1)
  const [sel, setSel] = useState<Propiedad | null>(null)
  const [aviso, setAviso] = useState<string | null>(null)
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false)

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
          (textoBuscado === "" ||
            normalizar(p.titulo).includes(textoBuscado) ||
            normalizar(p.zona).includes(textoBuscado) ||
            normalizar(p.codigo).includes(textoBuscado))
      ),
    [items, tipo, zona, textoBuscado]
  )
  const guion = "—"
  const conteo: Record<EstadoProp | "todas", string> = cargando
    ? { todas: guion, disponible: guion, reservada: guion, vendida: guion }
    : {
        todas: String(base.length),
        disponible: String(base.filter((p) => p.estado === "disponible").length),
        reservada: String(base.filter((p) => p.estado === "reservada").length),
        vendida: String(base.filter((p) => p.estado === "vendida").length),
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

  const hayFiltros = busqueda !== "" || estado !== "todas" || tipo !== "todos" || zona !== "todas" || orden !== null
  // Filtros que viven dentro de la hoja del celular (tipo, zona y orden).
  const filtrosDeHoja = (tipo !== "todos" ? 1 : 0) + (zona !== "todas" ? 1 : 0) + (orden ? 1 : 0)

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
    setOrden(null)
    setPagina(1)
  }

  // Ciclo de 3 clics por encabezado: ascendente, descendente y de vuelta al orden original.
  function ordenarPor(clave: ClaveOrden) {
    setOrden((o) => {
      if (!o || o.clave !== clave) return { clave, dir: "asc" }
      return o.dir === "asc" ? { clave, dir: "desc" } : null
    })
    setPagina(1)
  }

  function ariaSort(clave: ClaveOrden): "ascending" | "descending" | "none" {
    if (!orden || orden.clave !== clave) return "none"
    return orden.dir === "asc" ? "ascending" : "descending"
  }

  function abrir(p: Propiedad) {
    setAviso(null)
    setSel(p)
  }

  const valorSelectOrden = orden ? `${orden.clave}:${orden.dir}` : ""
  function cambiarOrden(v: string) {
    if (v === "") setOrden(null)
    else {
      const [clave, dir] = v.split(":") as [ClaveOrden, Dir]
      setOrden({ clave, dir })
    }
    setPagina(1)
  }

  const tempSel = sel ? temperaturaDePropiedad(sel.estado, sel.diasEnCartera) : null

  return (
    <div className="space-y-5">
      <Encabezado titulo="Propiedades" subtitulo="Cartera activa de Nexo Propiedades" ocultarSubtituloEnMovil>
        <div aria-busy={cargando} className="grid w-full grid-cols-4 gap-3 md:flex md:w-auto md:flex-wrap md:gap-x-8">
          <Metrica
            compacta
            label="En cartera"
            valor={cargando ? guion : String(items.length)}
            sub={cargando ? "propiedades en total" : `${reservadas} reservadas · ${vendidas} vendidas`}
          />
          <Metrica compacta label="Disponibles" valor={cargando ? guion : String(disponibles.length)} sub="a la venta hoy" />
          <Metrica
            compacta
            label={
              <>
                <span className="md:hidden">Valor</span>
                <span className="hidden md:inline">Valor disponible</span>
              </>
            }
            valor={
              cargando ? (
                guion
              ) : (
                <>
                  <span className="md:hidden">{precioCompacto(valorDisponible)}</span>
                  <span className="hidden md:inline">{precioLargo(valorDisponible)}</span>
                </>
              )
            }
            sub="suma de las disponibles"
          />
          <Metrica
            compacta
            label="Ticket"
            valor={
              cargando ? (
                guion
              ) : (
                <>
                  <span className="md:hidden">{precioCompacto(ticketPromedio)}</span>
                  <span className="hidden md:inline">{precioLargo(ticketPromedio)}</span>
                </>
              )
            }
            sub="promedio por disponible"
          />
        </div>
      </Encabezado>

      <section aria-labelledby="prop-listado" aria-busy={cargando} className="surface-card overflow-hidden">
        <h2 id="prop-listado" className="sr-only">Listado de propiedades</h2>
        <div className="space-y-3 border-b border-border p-3 md:p-4">
          <div className="flex items-end gap-3">
            <div className="flex min-w-0 flex-1 flex-col gap-1 md:w-72 md:flex-none">
              <label htmlFor="prop-buscar" className="sr-only text-xs font-semibold text-muted md:not-sr-only">Buscar</label>
              <input
                id="prop-buscar"
                type="search"
                value={busqueda}
                onChange={(e) => {
                  setBusqueda(e.target.value)
                  setPagina(1)
                }}
                placeholder="Código, título o zona"
                autoComplete="off"
                className={campo}
              />
            </div>
            {/* Escritorio: tipo y zona a la vista. En celular van dentro de "Filtros". */}
            <div className="hidden min-w-[9rem] flex-col gap-1 md:flex">
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
            <div className="hidden min-w-[9rem] flex-col gap-1 md:flex">
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
            <button
              type="button"
              onClick={() => setFiltrosAbiertos(true)}
              className="tap relative inline-flex h-11 shrink-0 items-center rounded-[var(--radius)] border border-border bg-surface px-3 text-sm font-medium text-fg hover:bg-subtle md:hidden"
            >
              {filtrosDeHoja > 0 ? `Filtros (${filtrosDeHoja})` : "Filtros"}
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
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
                    "tap chip relative px-3 py-1 " +
                    (estado === f ? "bg-primary text-bg" : "bg-subtle text-fg hover:bg-border")
                  }
                >
                  {etiquetaDeFiltro[f]} ({conteo[f]})
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 text-sm text-muted">
              <p aria-live="polite">
                {cargando ? "Cargando propiedades" : `Mostrando ${filtradas.length} de ${items.length}`}
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

          {/* Reglas del rotulo calculado: los umbrales salen de theme.cartera. */}
          <details className="text-xs text-muted">
            <summary className="cursor-pointer py-1 font-medium text-fg">¿Qué significan Fresca, Tibia y Fría?</summary>
            <p className="mt-1">{ayudaTemperatura()}</p>
          </details>
        </div>

        {error ? (
          <div className="p-4">
            <ErrorCarga mensaje="No pudimos cargar las propiedades." onReintentar={reintentar} />
          </div>
        ) : cargando ? (
          <div aria-hidden="true" className="space-y-2 p-4">
            {Array.from({ length: FILAS_ESQUELETO }, (_, i) => (
              <Esqueleto key={i} className="h-12" />
            ))}
          </div>
        ) : filtradas.length === 0 ? (
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
            {/* Celular: filas compactas, sin scroll horizontal de pagina. Cada fila abre la ficha. */}
            <ul className="md:hidden">
              {visibles.map((p) => (
                <li key={p.id} className="border-b border-border last:border-0">
                  <button
                    type="button"
                    onClick={() => abrir(p)}
                    className="block w-full px-4 py-3 text-left hover:bg-subtle"
                  >
                    <span className="flex items-start justify-between gap-3">
                      <span className="precio min-w-0 text-lg font-bold leading-tight text-fg">{precioLargo(p.precio)}</span>
                      <ChipEstado estado={p.estado} />
                    </span>
                    <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                      <span className="break-words text-sm font-semibold leading-snug text-fg">{p.titulo}</span>
                      {p.destacada && <Destacada />}
                    </span>
                    <span className="block text-xs text-muted">
                      <span className="font-medium tabular-nums text-fg">{p.codigo}</span> · {p.zona} · {etiquetaDeTipo[p.tipo]} · {p.m2} m²
                    </span>
                    <span className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
                      <span>{ambientes(p)}</span>
                      <span aria-hidden="true">·</span>
                      <span>{p.diasEnCartera} días en cartera</span>
                      <Temperatura p={p} />
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            {/* Escritorio: tabla semantica con encabezados ordenables. */}
            <div role="region" aria-label="Tabla de propiedades" className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[58rem] border-collapse text-sm">
                <caption className="sr-only">
                  Cartera de propiedades: código, tipo, precio, superficie, ambientes, estado y antigüedad en cartera. Cada título abre la ficha.
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
                    <tr
                      key={p.id}
                      onClick={() => abrir(p)}
                      className="cursor-pointer border-b border-border last:border-0 hover:bg-subtle"
                    >
                      <th scope="row" className="whitespace-nowrap px-4 py-3 text-left font-normal">
                        <span className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              abrir(p)
                            }}
                            className="tap relative rounded-[var(--radius)] text-left font-semibold text-fg hover:underline"
                          >
                            {p.titulo}
                          </button>
                          {p.destacada && <Destacada />}
                        </span>
                        <span className="block text-xs text-muted">
                          <span className="font-medium tabular-nums text-fg">{p.codigo}</span> · {p.zona}
                        </span>
                      </th>
                      <td className="whitespace-nowrap px-4 py-3 text-fg">{etiquetaDeTipo[p.tipo]}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-right">
                        <span className="precio font-bold tabular-nums text-fg">{precioLargo(p.precio)}</span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums text-fg">{p.m2} m²</td>
                      <td className="whitespace-nowrap px-4 py-3 text-fg">{ambientes(p)}</td>
                      <td className="whitespace-nowrap px-4 py-3"><ChipEstado estado={p.estado} /></td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span className="flex items-center gap-2">
                          <span className="tabular-nums text-fg">{p.diasEnCartera} días</span>
                          <Temperatura p={p} />
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

      {/* Hoja de filtros del celular: tipo, zona y orden. */}
      <FichaLateral
        abierta={filtrosAbiertos}
        titulo="Filtros"
        subtitulo="Tipo, zona y orden de la lista"
        onCerrar={() => setFiltrosAbiertos(false)}
        acciones={
          <>
            <button
              type="button"
              onClick={() => {
                setTipo("todos")
                setZona("todas")
                setOrden(null)
                setPagina(1)
              }}
              className={botonSecundario}
            >
              Limpiar
            </button>
            <button type="button" onClick={() => setFiltrosAbiertos(false)} className={botonPrimario}>
              Ver {filtradas.length} {filtradas.length === 1 ? "propiedad" : "propiedades"}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="hoja-tipo" className="text-xs font-semibold text-muted">Tipo</label>
            <select
              id="hoja-tipo"
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
          <div className="flex flex-col gap-1">
            <label htmlFor="hoja-zona" className="text-xs font-semibold text-muted">Zona</label>
            <select
              id="hoja-zona"
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
          <div className="flex flex-col gap-1">
            <label htmlFor="hoja-orden" className="text-xs font-semibold text-muted">Ordenar por</label>
            <select id="hoja-orden" value={valorSelectOrden} onChange={(e) => cambiarOrden(e.target.value)} className={campo}>
              {opcionesOrden.map((o) => (
                <option key={o.valor} value={o.valor}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>
      </FichaLateral>

      {/* Ficha de la propiedad: todos los datos de la fila, mas lo que se deriva de ellos. */}
      <FichaLateral
        abierta={!!sel}
        titulo={sel?.titulo ?? ""}
        subtitulo={sel ? `${sel.codigo} · ${sel.zona}` : undefined}
        onCerrar={() => setSel(null)}
        acciones={
          sel && (
            <>
              <button
                type="button"
                onClick={() => setAviso(`Demo: no se guardó nada. No se envió la ficha de ${sel.codigo}.`)}
                className={botonPrimario}
              >
                Enviar ficha
              </button>
              <button
                type="button"
                onClick={() => setAviso(`Demo: no se guardó nada. No se agendó ninguna visita a ${sel.codigo}.`)}
                className={botonSecundario}
              >
                Agendar visita
              </button>
              <button
                type="button"
                onClick={() => setAviso(`Demo: no se guardó nada. El estado de ${sel.codigo} no cambió.`)}
                className={botonSecundario}
              >
                Cambiar estado
              </button>
            </>
          )
        }
      >
        {sel && (
          <>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <ChipEstado estado={sel.estado} />
              {sel.destacada && <Destacada />}
            </div>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
              <DatoFicha etiqueta="Código"><span className="tabular-nums">{sel.codigo}</span></DatoFicha>
              <DatoFicha etiqueta="Zona">{sel.zona}</DatoFicha>
              <DatoFicha etiqueta="Tipo">{etiquetaDeTipo[sel.tipo]}</DatoFicha>
              <DatoFicha etiqueta="Precio"><span className="precio font-bold">{precioLargo(sel.precio)}</span></DatoFicha>
              <DatoFicha etiqueta="Superficie"><span className="tabular-nums">{sel.m2} m²</span></DatoFicha>
              <DatoFicha etiqueta="Precio por m²">
                <span className="tabular-nums">{precioLargo(Math.round(sel.precio / sel.m2))}</span>
              </DatoFicha>
              <DatoFicha etiqueta="Dormitorios">{sel.dorm > 0 ? sel.dorm : <NoAplica />}</DatoFicha>
              <DatoFicha etiqueta="Baños">{sel.banos > 0 ? sel.banos : <NoAplica />}</DatoFicha>
              <DatoFicha etiqueta="Cochera">{sel.cochera ? "Sí" : "No"}</DatoFicha>
              <DatoFicha etiqueta="Destacada">{sel.destacada ? "Sí" : "No"}</DatoFicha>
              <DatoFicha etiqueta="Días en cartera"><span className="tabular-nums">{sel.diasEnCartera} días</span></DatoFicha>
              <DatoFicha etiqueta="Temperatura">
                {tempSel ? (
                  <span className={"chip capitalize " + chipDeTemperatura[tempSel]}>{etiquetaDeTemperatura[tempSel]}</span>
                ) : (
                  <NoAplica />
                )}
              </DatoFicha>
            </dl>
            <AvisoDemo texto={aviso} />
          </>
        )}
      </FichaLateral>
    </div>
  )
}
