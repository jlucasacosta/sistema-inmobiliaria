# Ficha de Diseño — Nexo Propiedades

> Sistema demo frontend (Next.js + Tailwind, mock data) para el nicho **inmobiliaria**.
> Marca ficticia: **Nexo Propiedades**. Se graba en 9:16 para contenido; el objetivo es que sea RECONOCIBLE y distinto, no solo lindo.
> Es el PRIMER sistema de la fábrica: fija el baseline de piel contra el que se medirán los que vengan.

---

## 1. Marca, usuario y contexto

**Nexo Propiedades** no es un portal de listings: es la **mesa de operaciones del corredor**.

**Usuario:** el agente/corredor inmobiliario, casi siempre desde el celular, entre visitas, en el auto o parado en la puerta de una propiedad. Manos ocupadas, sol pegando en la pantalla, poco tiempo. No abre a "leer" un dashboard: abre a **resolver un lead que entró hace 4 minutos** antes de que se lo lleve otra inmobiliaria.

**La tarea que repite 40 veces al día:** responder consultas entrantes ("¿sigue disponible?", "¿acepta permuta?", "¿cuánto de expensas?") y matchear una persona con una propiedad. No carga fichas: filtra, manda ficha, agenda visita.

**Qué se rompe si el dato llega tarde:** el lead se enfría. La velocidad de primera respuesta ES la venta; un lead sin contactar en la primera hora vale la mitad.

**Qué mira de reojo (sin leer):** color del estado del lead (nuevo / caliente / frío) y estado de la propiedad (disponible / reservada / vendida). Eso es **posición y color**, no texto. **Qué lee de verdad:** el último mensaje del contacto y el precio.

---

## 2. LA PANTALLA QUE MANDA: `conversaciones`

No es el dashboard de KPIs (eso lo mira el dueño una vez por semana). Es la **bandeja de conversaciones cruzada con el estado del lead en el pipeline**. Ahí vive el día del agente: cada consulta es plata caminando. Propiedades y dashboard son consulta secundaria; el pipeline es el marcador que se mira de reojo.

---

## 3. Dirección de arte y el cliché rechazado

**CLICHÉ DEL RUBRO — RECHAZADO.** El azul-marino-con-dorado "premium", el sidebar celeste tipo portal (Zillow / Idealista), la foto de fachada a sangre en cada card y el ícono de casita en todo. Eso grita "portal de listings" y ya lo vio todo el mundo.

**DECISIÓN: light, denso, editorial-financiero.** Una inmobiliaria seria maneja pipeline y plata en horario de oficina, con luz. `dark` diría "cripto / gaming" y mentiría el contexto. Se lee como un **cuaderno de tasaciones**, no como una app de fintech con glow: cero sombras blandas, bordes finos de 1px, esquinas rectas.

**COLOR.** Primary **verde-pino profundo `#1F5A3D`** — en real estate el verde dice "terreno, valor, patrimonio" sin caer en el dólar-verde chillón ni en el azul-confianza genérico. Accent **terracota `#C6603F`** — ladrillo, tierra, la materia real de una propiedad; calienta la grilla fría y marca CTAs sin pedir permiso. **Verde + terracota = tierra construida, no lujo de vidrio.** Contraste `#1F5A3D` sobre blanco >7:1; terracota ~4.5:1, reservado a CTA.

**TIPOGRAFÍA.** **Fraunces** (display) para números de precio y títulos: voz de tasación con criterio, casi notarial. **Inter** para la data densa de tablas. El par dice "oficio + precisión", no "startup".

**TEXTURA.** Bordes finos, mucha línea divisoria, números de precio GRANDES en Fraunces como protagonistas, badges cuadrados. Densidad alta: el corredor quiere ver 20 propiedades sin scrollear. Aire solo alrededor del número clave.

---

## 4. Palancas del theme (resueltas)

El abogado del diablo detectó tres voces peleadas (Arte vs Arquitecto) y falló: un `theme.ts` tiene **un** valor por token. Gana la tesis "mesa de operaciones editorial-financiera" (Arte), porque es más reconocible y deja `raised + soft + round` libre para un vertical futuro más blando.

| Palanca | Valor | Por qué |
|---|---|---|
| **mode** | `light` | Oficina, luz de día. `dark` mentiría el contexto. |
| **nav** | `sidebar` | Sistema denso de 7 módulos; navegación editorial estable. Se descarta `rail`. |
| **elevation** | `outlined` | Bordes finos de 1px, cero sombra blanda: cuaderno de tasaciones. |
| **radius** | `sharp` | Esquinas rectas, corporativo-notarial. |
| **density** | `compact` | Ver 20 propiedades / 20 hilos sin scrollear. |
| **badge** | `square` | Estados en píldora cuadrada, más "ficha" que "chip social". |
| **fontHeading** | `Fraunces` | Serif editorial para precios y títulos. |
| **fontBody** | `Inter` | Data densa de tablas, legible en compact. |
| **familia color** | verde-pino `#1F5A3D` + terracota `#C6603F` | Tierra construida. |

> Descartado explícitamente: `rail + raised + soft` (cluster Arquitecto). Se reserva `raised/soft/round` como baseline para un vertical futuro con cards flotantes.

---

## 5. Esqueleto — módulo → arquetipo

Como PRIMER sistema, se dejan libres los arquetipos obvios del rubro (**kanban** de pipeline y **tabla-densa** de listados) para los que vienen. Se toman los espaciales-visuales.

| Módulo | Arquetipo | Componentes, tamaños y qué se ve primero |
|---|---|---|
| **dashboard** | board `barra-metas` + `heatmap` | Header con 3 métricas (disponibles, visitas de la semana, reservas activas). Bloque de **metas del mes** (cierres y captaciones contra el objetivo) con barras de un solo tono; resumen de **comisión proyectada** como cifra sobria con su avance (la comisión aparece solo ahí); **heatmap** de visitas agendadas por día/hora en escalones del color primario; y la actividad reciente al costado, con íconos neutros (solo el rechazo lleva color). Sin animaciones (decisión de Lucas, 2026-10-11). Se ve primero: las metas del mes. |
| **conversaciones** *(pantalla que manda)* | `lista-ticket` (bandeja) | Lista vertical densa de consultas entrantes. Cada ticket: **color de estado del lead** a la izquierda (nuevo/caliente/frío), nombre del contacto, **último mensaje** (1 línea), propiedad consultada con **precio en Fraunces** y badge cuadrado de estado de la propiedad. Filtro por estado arriba. Se ve primero: el ticket más nuevo, su color y su precio. Se ELIMINA el panel de chat completo de escritorio: en celular manda la bandeja. |
| **contactos** | `tabla-densa` | Directorio denso tipo ledger. Columnas: nombre, **estado-lead (color)**, teléfono, última interacción, propiedad de interés, presupuesto (Fraunces). Filas finas con divisorias de 1px. Se ve primero: la columna de estado y el presupuesto. |
| **config** | `acordeon` (secciones) | Ajustes agrupados en secciones colapsables: marca, notificaciones, integraciones (mock), equipo. Formularios simples, títulos en Fraunces. Se ve primero: la sección abierta. |
| **propiedades** | `tabla-crm` (ordenable, filtrable) | Cabecera con 4 métricas (en cartera, disponibles, valor disponible, ticket), barra de herramientas (buscador, estado, tipo, zona) y **tabla de CRM** con encabezados ordenables y paginación de 10 filas; cada fila abre una ficha lateral. Columnas: propiedad (título + código NX-2301 + zona), tipo, **precio en Fraunces**, superficie, dorm./baños, badge cuadrado de estado y días en cartera con su temperatura. Sin fotos ni animaciones. En celular, la misma data como lista de filas compactas. Se ve primero: el precio y el estado. |
| **pipeline** | `master-detail` | Lista izquierda de operaciones + panel derecho con la propiedad, el comprador y el historial. Cada operación con etapa, precio y comisión proyectada. Se ve primero: la operación seleccionada completa. Se cede el kanban a un sistema futuro. |
| **llamadas** | `timeline` | Registro cronológico vertical de llamadas: hora, contacto, duración, resultado (chip de color) y next-step. La última llamada arriba. Se ve primero: la llamada más reciente. |

---

## 6. KPI, gráfico, iconos, estructura

- **KPI = `barra-metas`** — cierres del mes vs objetivo y captaciones vs meta. Manda la **meta mensual absoluta**, no el ruido diario.
- **GRÁFICO principal = `heatmap`** — visitas agendadas por día/hora; revela las ventanas calientes de la semana. La combinación **barra-metas + heatmap** no la usa ningún otro sistema.
- **ICONOS = `icon-chip`** — ícono lucide dentro de un chip redondeado con **tinte de estado** (verde/terracota/gris). Fijado como tratamiento vecino-cero.
- **ESTRUCTURA DE PÁGINA = `header-con-metricas`** — cada página abre con 3 métricas embebidas en el header antes del contenido.

---

## 7. Decisión de Lucas (2026-10-11): se quitó el mapa y la galería

Se sacó el **Mapa de propiedades** (el plano esquemático con price-pins, en el dashboard y en propiedades) y la **galería** de cards con foto. Propiedades pasa a ser una **tabla de CRM**, como un sistema normal, y no queda ninguna animación en esa pantalla. La firma visual pasa a ser la **tipografía Fraunces** (precios y títulos) más las **barras de metas** y el **heatmap** del dashboard.

---

## 8. COMPONENTE ELIMINADO

**Fuera los sparklines / flechas de micro-tendencia en los stat tiles.** En inmobiliaria manda la meta mensual absoluta (barra-metas), no el ruido diario; el micro-trend distrae y ensucia la grabación. Los tiles quedan limpios: número grande + label + barra de meta, nada de flechitas.

---

## 9. FRAME-FIRMA

El Productor firmaba el reel con un **kanban saltando**, pero el Arquitecto CEDIÓ el kanban: no se graba lo que no se construye. El frame se **reancla en el activo que SÍ existe y es único**:

> **Las metas del mes: barras contra el objetivo y la comisión proyectada en Fraunces**, sobre un panel sobrio de CRM. Las cifras en Fraunces (tabulares) son lo que ancla "inmobiliaria" sin recurrir a efectos. (Hasta 2026-10-11 el frame incluía el Mapa de propiedades y un hero de comisión que se llenaba de golpe; ambos se quitaron por decisión de Lucas, ver §7. Hoy el dashboard no tiene ninguna animación.)

Para grabar en pantalla chica: las tres barras de metas y la cifra de comisión arriba, ocupando el ancho.

---

## 10. Veredicto

**PASA.** (Abogado del diablo.)

**Piel (baseline fijado — es el primer sistema):** `light · sidebar · outlined · sharp · compact · square · Fraunces + Inter · verde-pino/terracota`. Queda registrado para vetar a los que vengan (deberán diferenciarse en ≥3 palancas).

**Esqueleto:** arquetipos que nadie más usa aún — **master-detail (pipeline)** + **timeline (llamadas)** (dos, cumple). Propiedades es una tabla de CRM (decisión de Lucas, §7). Combo **barra-metas + heatmap** único. Iconos `icon-chip`. Firma real: **Fraunces + barras de meta + heatmap**. Eliminado real: **sparklines/micro-trend**. Si dos dashboards lado a lado no se distinguen sin leer el texto: la tipografía serif en los precios y las barras de meta lo evitan.

---

## 11. Nota de contraste (2026-10-10)

Auditoría Impeccable: cuatro tokens se oscurecieron lo mínimo (mismo tono y saturación, solo luminosidad) para llegar a 4.5:1 en el uso real (texto chico y chips de estado). La identidad no cambia: sigue siendo verde-pino + terracota.

| Token | Antes | Ahora | Motivo |
|---|---|---|---|
| `accent` (terracota) | `#C6603F` (4.08:1) | `#A64E31` | texto y chips `accent/15` por debajo de 4.5:1 |
| `muted` | `#6B7A72` (4.14:1 sobre `bg`) | `#616E67` | etiquetas de 10-11 px sobre `bg` y `subtle` |
| `success` | `#2F7D53` | `#2C754E` | chip `success/15` en 4.12:1 |
| `warning` | `#B7791F` (3.64:1) | `#8F5E18` | ocre sobre blanco y sobre su tinte |

Los valores de este documento (§3 y §4) corresponden al diseño original; el código manda.

---

## 12. Nota (2026-10-11): sistema operable, estados claros, color sin ambigüedad

Decisión de Lucas, tras la crítica Impeccable (22/40): dejar el demo listo para operar como un dashboard-CRM normal. La identidad (verde-pino + terracota, Fraunces + Inter, outlined/sharp/compact/square) NO cambia. Lo que cambió y por qué:

- **Operar**: propiedades y contactos abren una ficha lateral con todos los datos y acciones de demostración ("Demo: no se guardó nada"). Cada propiedad lleva un código visible (`NX-2301`), la columna ancla de la tabla. Antes las filas no abrían nada.
- **Carga y error**: nada de ceros falsos. Mientras cargan, las cifras muestran `—` y hay esqueletos estáticos; si la carga falla hay un aviso con "Reintentar".
- **Color**: Reservada pasa de terracota a la familia `info` (el terracota se confundía con el rojo de Fría y Perdida); la etapa "reserva" del pipeline igual. El terracota queda para lo activo/primario y para el lead caliente. La temperatura Fresca/Tibia/Fría solo existe en propiedades disponibles; en reservadas y vendidas va `—`. Los umbrales se explican junto a los filtros y salen de `theme.cartera`.
- **Excepción de neutros (pedida acá, según CLAUDE.md §9)**: tres estados son neutros por diseño y van en gris con rótulo de texto y contraste ≥4.5:1 (`muted` sobre su tinte: 4.57:1): **Vendida** (propiedad cerrada), **frío** (lead sin movimiento) y la etapa **contacto** (sin compromiso todavía). Los chips se apoyan sobre una base blanca (`shell/chip.tsx`) para que el contraste no baje en la fila en hover o seleccionada.
- **Sin redundancia**: la comisión aparece una sola vez (tarjeta "Comisión proyectada"); el encabezado del panel ya no repite cierres y captaciones. El heatmap llena el ancho de su tarjeta y lleva leyenda ("0 → 7 visitas"). El feed muestra 6 actividades y "Ver todo" expande en la misma página.
- **Texto**: nada baja de 12 px (los chips pasaron de 11,2 a 12 px). Todos los h1 comparten escala y estructura (`shell/encabezado.tsx`); los nombres del menú coinciden con el h1 (Panel, Consultas, Llamadas).
- **Celular**: el menú es una tira con degradé en el borde derecho y el ítem activo centrado; en `/propiedades` tipo, zona y orden van dentro de una hoja "Filtros" para que la lista arranque a la vista.
- **Movimiento**: sin animaciones. Quedan solo los cambios que provoca el usuario (el interruptor y la flecha de los acordeones de Configuración) y los cambios de color en hover y foco.
- **Mock data**: la seña de Punta Carretas era U$S 372.000 (el precio entero); ahora U$S 37.200 (10 %). Las señas del pipeline también (10 % y 5 % en reservas), los estados de las propiedades coinciden con el pipeline y las consultas, y las fechas pasan a octubre 2026, el mes del demo.
