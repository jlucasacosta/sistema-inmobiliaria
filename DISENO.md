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
| **dashboard** | board `barra-metas` + `heatmap` + Mapa de Cartera | Header con 3 métricas. Bloque de **barras de meta** (cierres del mes vs objetivo, captaciones vs meta) con la barra llena de color de estado; **heatmap** de visitas agendadas por día/hora; y el **Mapa de Cartera** a pantalla ancha abajo. Se ve primero: la barra de meta y el mapa con price-pins. |
| **conversaciones** *(pantalla que manda)* | `lista-ticket` (bandeja) | Lista vertical densa de consultas entrantes. Cada ticket: **color de estado del lead** a la izquierda (nuevo/caliente/frío), nombre del contacto, **último mensaje** (1 línea), propiedad consultada con **precio en Fraunces** y badge cuadrado de estado de la propiedad. Filtro por estado arriba. Se ve primero: el ticket más nuevo, su color y su precio. Se ELIMINA el panel de chat completo de escritorio: en celular manda la bandeja. |
| **contactos** | `tabla-densa` | Directorio denso tipo ledger. Columnas: nombre, **estado-lead (color)**, teléfono, última interacción, propiedad de interés, presupuesto (Fraunces). Filas finas con divisorias de 1px. Se ve primero: la columna de estado y el presupuesto. |
| **config** | `acordeon` (secciones) | Ajustes agrupados en secciones colapsables: marca, notificaciones, integraciones (mock), equipo. Formularios simples, títulos en Fraunces. Se ve primero: la sección abierta. |
| **propiedades** | `galeria` (masonry) | Masonry de **property cards**: foto 16:9, **precio hero en Fraunces** (U$S grande), chips m² / dorm / baño, badge cuadrado de estado (Disponible/Reservada/Vendida) con color. La foto ES el producto; una tabla mataría el rubro. Se ve primero: la foto y el precio. |
| **pipeline** | `master-detail` | Lista izquierda de operaciones + panel derecho con la propiedad, el comprador y el historial. Cada operación con etapa, precio y comisión proyectada. Se ve primero: la operación seleccionada completa. Se cede el kanban a un sistema futuro. |
| **llamadas** | `timeline` | Registro cronológico vertical de llamadas: hora, contacto, duración, resultado (chip de color) y next-step. La última llamada arriba. Se ve primero: la llamada más reciente. |

---

## 6. KPI, gráfico, iconos, estructura

- **KPI = `barra-metas`** — cierres del mes vs objetivo y captaciones vs meta. Manda la **meta mensual absoluta**, no el ruido diario.
- **GRÁFICO principal = `heatmap`** — visitas agendadas por día/hora; revela las ventanas calientes de la semana. La combinación **barra-metas + heatmap** no la usa ningún otro sistema.
- **ICONOS = `icon-chip`** — ícono lucide dentro de un chip redondeado con **tinte de estado** (verde/terracota/gris). Fijado como tratamiento vecino-cero.
- **ESTRUCTURA DE PÁGINA = `header-con-metricas`** — cada página abre con 3 métricas embebidas en el header antes del contenido.

---

## 7. COMPONENTE ESTRELLA — "Mapa de Cartera"

Panel a pantalla completa en dashboard y propiedades. **Ningún otro sistema tiene un mapa: es la firma visual inmobiliaria.**

Especificación para codearlo:
- **Base:** SVG estilizado mock (NO tiles reales, sin dependencia externa) — una silueta de zona/barrios en trazo fino sobre fondo claro, coherente con el look de cuaderno.
- **Price-pins:** un pin geolocalizado por propiedad. Cada pin muestra el **precio** (Fraunces, compacto: "U$S 340k") y **cambia de color por estado** (verde = disponible, terracota = reservada, gris = vendida).
- **Hover:** el pin expande un **mini-card** con foto 16:9, precio hero y chips m²/dorm/baño.
- **Clustering:** cuando varios pins se solapan, colapsan en un **cluster-count** ("+7") que se abre al hacer zoom/hover.
- **Estado:** todo el color sale de `theme.ts` (tokens de estado). Cero hardcodeo.

---

## 8. COMPONENTE ELIMINADO

**Fuera los sparklines / flechas de micro-tendencia en los stat tiles.** En inmobiliaria manda la meta mensual absoluta (barra-metas), no el ruido diario; el micro-trend distrae y ensucia la grabación. Los tiles quedan limpios: número grande + label + barra de meta, nada de flechitas.

---

## 9. FRAME-FIRMA

El Productor firmaba el reel con un **kanban saltando**, pero el Arquitecto CEDIÓ el kanban: no se graba lo que no se construye. El frame se **reancla en el activo que SÍ existe y es único**:

> **El Mapa de Cartera con price-pins cambiando de color por estado** (un pin "U$S 340k" pasando de terracota-reserva) **mientras un hero-number de comisión proyectada se llena de golpe** (U$S 0 → U$S 10.200). El "U$S" dominante + el mapa son lo que ancla "inmobiliaria" y lo separan de un CRM genérico.

Exagerar para pantalla chica: el número de comisión ocupando un tercio de alto, el "U$S" enorme, el pin cambiando a color de estado con transición visible.

---

## 10. Veredicto

**PASA.** (Abogado del diablo.)

**Piel (baseline fijado — es el primer sistema):** `light · sidebar · outlined · sharp · compact · square · Fraunces + Inter · verde-pino/terracota`. Queda registrado para vetar a los que vengan (deberán diferenciarse en ≥3 palancas).

**Esqueleto:** arquetipos que nadie más usa aún — **master-detail (pipeline)** + **timeline (llamadas)** (dos, cumple). `galeria` en propiedades es lo obvio del rubro; se tolera porque el Arquitecto la posee y cede `kanban` / `tabla-densa` a los que siguen. Combo **barra-metas + heatmap** único. Iconos `icon-chip`. Estrella real: **Mapa de Cartera**. Eliminado real: **sparklines/micro-trend**. Si dos dashboards lado a lado no se distinguen sin leer el texto: el mapa con price-pins lo evita.
