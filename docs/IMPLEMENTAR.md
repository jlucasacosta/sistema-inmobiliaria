# Cómo llevar Nexo Propiedades a producción

Esta guía te lleva de "clonar el demo" a "sistema inmobiliario con datos reales, usuarios y tareas automáticas". Es específica de este sistema: usa los nombres reales de `api.ts` y las claves reales de cada `data.json`.

> **El repo sigue siendo un demo frontend con datos de ejemplo.** Todo el backend de esta guía está **descrito**, no implementado: los bloques de código son ejemplos para copiar en TU proyecto. No agregues credenciales reales a este repo si lo vas a publicar.

Stack: **Next.js 15** (este repo) + **Supabase** (base de datos y Auth) + **Railway** (tareas en segundo plano con pg-boss) + **Vercel** (deploy) + **OpenAI o Gemini** (IA).

---

## 0. Qué vas a lograr, orden recomendado y tiempos

Al final tenés: el sistema online en tu dominio, con login, propiedades/contactos/consultas/llamadas/oportunidades guardados en tu base, recordatorios automáticos y una IA que te sugiere respuestas a las consultas y resume llamadas.

| Etapa | Qué hacés | Tiempo estimado |
|------|-----------|-----------------|
| 1 | Clonar y correr local | 15 min |
| 2 | Entender el mapa del sistema | 10 min (leer) |
| 3 | Supabase: tablas, datos de ejemplo, Auth, cambiar `api.ts` | 3 a 5 h |
| 4 | Railway: tareas en segundo plano (opcional al principio) | 1 a 2 h |
| 5 | Vercel: publicar | 30 min |
| 6 | IA: sugerencias y resumen de llamadas | 1 a 2 h |
| 7 | Checklist de seguridad antes de cargar datos reales | 30 min |

**Orden recomendado:** 1, 2, 3, 5 (publicás ya con base y login), y después 4 y 6. Las tareas en segundo plano y la IA no hacen falta para el primer día. Los tiempos son referencia para una persona que lo hace por primera vez.

---

## 1. Clonar y correr local

### Qué necesitás instalado

- **Node.js 20 o 22 (LTS)**: https://nodejs.org (el instalador "LTS"). Next 15 pide como mínimo Node 18.18.
- **Git**: https://git-scm.com

Verificá en una terminal:

```bash
node -v
git --version
```

Si los dos devuelven un número de versión, ya está.

### Pasos

```bash
git clone https://github.com/jlucasacosta/sistema-inmobiliaria.git
cd sistema-inmobiliaria
npm install
npm run dev
```

Abrí http://localhost:3000. Tiene que cargar el dashboard con las metas del mes y el mapa de calor de visitas.

### Si algo falla (3 errores típicos)

| Síntoma | Causa | Arreglo |
|---------|-------|---------|
| `node` o `git` "no se reconoce como comando" | Se instaló pero la terminal es anterior a la instalación | Cerrá la terminal, abrí una nueva y probá otra vez |
| `Port 3000 is in use` | Hay otra cosa usando el puerto 3000 | `npm run dev -- -p 3001` y abrí http://localhost:3001 |
| `npm install` falla con `EBADENGINE` o errores raros de versiones | Node demasiado viejo | Instalá Node 20 o 22 LTS, borrá la carpeta `node_modules` y repetí `npm install` |

---

## 2. Mapa de este sistema

Cada módulo tiene un `api.ts` que hoy devuelve datos de un JSON. Para conectar el backend cambiás **solo el cuerpo** de esas funciones: nombre, parámetros y tipo de retorno quedan igual, así que ningún componente se toca.

| Módulo | Funciones de `api.ts` | Datos de ejemplo | Tabla(s) sugerida(s) |
|--------|----------------------|------------------|----------------------|
| dashboard | `getRealizado`, `getHeatmap`, `getActividad` | `modules/dashboard/data.json` (`realizado`, `heatmap`, `actividad`) | vista `realizado_mes`, vista `visitas_por_franja` (sobre `visitas`), tabla `actividad`. Las metas (`theme.meta`) siguen en `shell/theme.ts` |
| propiedades | `getPropiedades` (el dashboard también la usa para contar las disponibles) | `modules/propiedades/data.json` (`propiedades`) | `propiedades` |
| conversaciones | `getTickets` | `modules/conversaciones/data.json` (`tickets`) | `conversaciones` (+ `mensajes` cuando conectes WhatsApp) |
| pipeline | `getOportunidades` | `modules/pipeline/data.json` (`oportunidades`, con `historial`) | `oportunidades` + `oportunidad_eventos` |
| llamadas | `getLlamadas` | `modules/llamadas/data.json` (`calls`) | `llamadas` |
| contactos | `getContactos` | `modules/contactos/data.json` (`contacts`) | `contactos` |
| config | no tiene `api.ts` | el theme vive en `shell/theme.ts`; el equipo está escrito en `modules/config/index.tsx` | opcional: `ajustes` por usuario |

Hay dos diferencias entre el demo y una base real que conviene saber desde ya:

1. **Fechas.** El demo guarda textos como `"hace 4 min"`, `"ayer"` o `"12 oct"`. En la base guardás fechas reales (`timestamptz` o `date`) y las convertís a ese texto en `api.ts` con una función de formato (ver 3.7). La firma de la función no cambia.
2. **Relaciones.** El demo repite el texto de la propiedad dentro de cada consulta, llamada u oportunidad. Las tablas de abajo mantienen esas columnas de texto (así importás los JSON sin cambios) y agregan columnas `propiedad_id` / `contacto_id` **opcionales** para cuando quieras relacionar de verdad.

---

## 3. Supabase: base de datos y Auth

### 3.1 Crear el proyecto

1. Entrá a https://supabase.com y creá una cuenta.
2. **New project**: elegí nombre (por ejemplo `nexo-propiedades`), una contraseña de base de datos (guardala en tu gestor de contraseñas) y la región más cercana a tus usuarios.
3. Esperá a que termine de crearse.
4. Abrí **Project Settings → API** y copiá la **Project URL** y la clave pública (`anon`, o `publishable` en el panel nuevo). Las vas a usar en 3.4.

### 3.2 Crear las tablas

En el panel abrí **SQL Editor → New query**, pegá el bloque completo y ejecutalo (**Run**). Las columnas salen de los tipos de `api.ts` y de las claves de cada `data.json`; los estados son los valores reales del demo, protegidos con `check`.

```sql
-- =====================================================================
-- Nexo Propiedades · esquema inicial
-- Cada tabla refleja un tipo de modules/<modulo>/api.ts.
-- 'codigo' sirve para reimportar sin duplicar. En propiedades es el CÓDIGO VISIBLE
-- de la propiedad ('NX-2301', 'NX-2302', ...): único y obligatorio, es la columna
-- ancla de la tabla y de la ficha. En el resto de las tablas guarda el id del demo
-- ('c01', 't01', ...); si no lo necesitás ahí, borrá la columna.
-- =====================================================================

-- ---------- propiedades (modules/propiedades) ----------
create table public.propiedades (
  id uuid primary key default gen_random_uuid(),
  codigo text unique not null,                            -- visible: 'NX-2301'. Se muestra en la tabla y en la ficha
  titulo text not null,
  zona text not null,
  tipo text not null
    check (tipo in ('apartamento', 'casa', 'ph', 'terreno', 'local')),
  precio integer not null check (precio >= 0),            -- U$S
  m2 integer not null check (m2 >= 0),
  dorm smallint not null default 0 check (dorm >= 0),
  banos smallint not null default 0 check (banos >= 0),
  cochera boolean not null default false,
  estado text not null default 'disponible'
    check (estado in ('disponible', 'reservada', 'vendida')),
  en_cartera_desde date not null default current_date,    -- diasEnCartera se calcula
  destacada boolean not null default false,
  created_at timestamptz not null default now()
);
create index propiedades_estado_idx on public.propiedades (estado);
create index propiedades_zona_idx on public.propiedades (zona);
create index propiedades_precio_idx on public.propiedades (precio);

-- ---------- contactos (modules/contactos) ----------
create table public.contactos (
  id uuid primary key default gen_random_uuid(),
  codigo text unique,
  nombre text not null,
  estado text not null default 'nuevo'
    check (estado in ('nuevo', 'caliente', 'frio')),
  telefono text,
  email text,
  ultima_interaccion_at timestamptz,                      -- 'ultima' = "hace 2 h"
  interes text,                                           -- 'Apto 2 dorm · Pocitos'
  presupuesto integer not null default 0 check (presupuesto >= 0),  -- U$S
  created_at timestamptz not null default now()
);
create index contactos_estado_idx on public.contactos (estado);
create index contactos_ultima_idx on public.contactos (ultima_interaccion_at desc);

-- ---------- conversaciones (modules/conversaciones, tipo Ticket) ----------
create table public.conversaciones (
  id uuid primary key default gen_random_uuid(),
  codigo text unique,
  contacto text not null,                                 -- nombre del contacto
  contacto_id uuid references public.contactos (id) on delete set null,
  estado_lead text not null default 'nuevo'
    check (estado_lead in ('nuevo', 'caliente', 'frio')),
  ultimo text not null default '',                        -- último mensaje, 1 línea
  ultimo_mensaje_at timestamptz not null default now(),   -- 'cuando' = "hace 4 min"
  propiedad text not null default '',                     -- 'Apto 2 dorm · Pocitos'
  propiedad_id uuid references public.propiedades (id) on delete set null,
  precio integer not null default 0 check (precio >= 0),  -- U$S de la propiedad consultada
  estado_prop text not null default 'disponible'
    check (estado_prop in ('disponible', 'reservada', 'vendida')),
  sin_leer integer not null default 0 check (sin_leer >= 0),
  created_at timestamptz not null default now()
);
create index conversaciones_estado_lead_idx on public.conversaciones (estado_lead);
create index conversaciones_ultimo_idx on public.conversaciones (ultimo_mensaje_at desc);
create index conversaciones_contacto_id_idx on public.conversaciones (contacto_id);
create index conversaciones_propiedad_id_idx on public.conversaciones (propiedad_id);

-- ---------- mensajes (para cuando conectes WhatsApp; el demo no los muestra) ----------
create table public.mensajes (
  id uuid primary key default gen_random_uuid(),
  conversacion_id uuid not null references public.conversaciones (id) on delete cascade,
  direccion text not null check (direccion in ('entrante', 'saliente')),
  cuerpo text not null,
  created_at timestamptz not null default now()
);
create index mensajes_conversacion_idx on public.mensajes (conversacion_id, created_at desc);

-- ---------- llamadas (modules/llamadas) ----------
create table public.llamadas (
  id uuid primary key default gen_random_uuid(),
  codigo text unique,
  inicio_at timestamptz not null default now(),           -- 'hora' = "17:42"
  contacto text not null,
  contacto_id uuid references public.contactos (id) on delete set null,
  telefono text,
  propiedad text not null default '',
  propiedad_id uuid references public.propiedades (id) on delete set null,
  duracion_seg integer not null default 0 check (duracion_seg >= 0),
  resultado text not null
    check (resultado in ('agendada', 'interesado', 'sin respuesta', 'descartado')),
  next_step text not null default '',                     -- 'nextStep'
  grabacion_path text,                                    -- archivo en Supabase Storage
  transcripcion text,
  resumen text,                                           -- lo completa la IA (sección 6)
  created_at timestamptz not null default now()
);
create index llamadas_inicio_idx on public.llamadas (inicio_at desc);
create index llamadas_contacto_id_idx on public.llamadas (contacto_id);

-- ---------- oportunidades + historial (modules/pipeline) ----------
create table public.oportunidades (
  id uuid primary key default gen_random_uuid(),
  codigo text unique,
  comprador text not null,
  contacto_id uuid references public.contactos (id) on delete set null,
  telefono text,
  propiedad text not null default '',
  propiedad_id uuid references public.propiedades (id) on delete set null,
  zona text not null default '',
  precio integer not null check (precio >= 0),            -- U$S valor de la operación
  comision_pct numeric(4, 3) not null default 0.03
    check (comision_pct between 0 and 1),                 -- 'comisionPct' (0.03 = 3%)
  etapa text not null default 'contacto'
    check (etapa in ('contacto', 'visita', 'propuesta', 'reserva', 'cierre', 'perdida')),
  actualizada_at timestamptz not null default now(),      -- 'actualizada' = "hace 2 h"
  nota text not null default '',
  created_at timestamptz not null default now()
);
create index oportunidades_etapa_idx on public.oportunidades (etapa);
create index oportunidades_actualizada_idx on public.oportunidades (actualizada_at desc);
create index oportunidades_contacto_id_idx on public.oportunidades (contacto_id);
create index oportunidades_propiedad_id_idx on public.oportunidades (propiedad_id);

create table public.oportunidad_eventos (                 -- 'historial' = [{ fecha, texto }]
  id uuid primary key default gen_random_uuid(),
  oportunidad_id uuid not null references public.oportunidades (id) on delete cascade,
  fecha date not null default current_date,
  texto text not null
);
create index oportunidad_eventos_idx on public.oportunidad_eventos (oportunidad_id, fecha desc);

-- ---------- actividad (feed del dashboard) ----------
create table public.actividad (
  id uuid primary key default gen_random_uuid(),
  codigo text unique,
  tipo text not null
    check (tipo in ('consulta', 'visita', 'reserva', 'cierre', 'captacion', 'rechazo')),
  texto text not null,
  created_at timestamptz not null default now()           -- 'cuando' = "hace 4 min"
);
create index actividad_created_idx on public.actividad (created_at desc);

-- ---------- visitas (alimenta el heatmap del dashboard) ----------
create table public.visitas (
  id uuid primary key default gen_random_uuid(),
  propiedad_id uuid references public.propiedades (id) on delete set null,
  contacto_id uuid references public.contactos (id) on delete set null,
  agendada_para timestamptz not null,
  created_at timestamptz not null default now()
);
create index visitas_agendada_idx on public.visitas (agendada_para);
create index visitas_propiedad_id_idx on public.visitas (propiedad_id);
create index visitas_contacto_id_idx on public.visitas (contacto_id);

-- ---------- ajustes por usuario (opcional; módulo config) ----------
create table public.ajustes (
  user_id uuid not null references auth.users (id) on delete cascade,
  clave text not null,
  valor jsonb not null default '{}'::jsonb,
  primary key (user_id, clave)
);

-- ---------- vistas del dashboard ----------
-- security_invoker = la vista respeta el RLS de quien consulta.
-- Zona horaria de ejemplo: ajustala a la tuya.
create view public.realizado_mes with (security_invoker = true) as
select
  (select count(*) from public.oportunidades
    where etapa = 'cierre'
      and date_trunc('month', actualizada_at at time zone 'America/Montevideo')
        = date_trunc('month', now() at time zone 'America/Montevideo'))::int as cierres,
  (select count(*) from public.propiedades
    where date_trunc('month', en_cartera_desde::timestamp)
        = date_trunc('month', now() at time zone 'America/Montevideo'))::int as captaciones,
  -- Regla de ejemplo: comisión de lo reservado o cerrado este mes. Ajustala a tu negocio.
  (select coalesce(round(sum(precio * comision_pct)), 0) from public.oportunidades
    where etapa in ('reserva', 'cierre')
      and date_trunc('month', actualizada_at at time zone 'America/Montevideo')
        = date_trunc('month', now() at time zone 'America/Montevideo'))::int as comision;

-- Franjas de 2 horas desde las 9 (0 = 9-11, 1 = 11-13, ... 5 = 19-21). dia_semana: 1 = lunes.
create view public.visitas_por_franja with (security_invoker = true) as
select
  extract(isodow from v.hora_local)::int as dia_semana,
  (extract(hour from v.hora_local)::int - 9) / 2 as franja,
  count(*)::int as visitas
from (
  select agendada_para at time zone 'America/Montevideo' as hora_local
  from public.visitas
) v
where v.hora_local >= date_trunc('week', now() at time zone 'America/Montevideo')
  and v.hora_local <  date_trunc('week', now() at time zone 'America/Montevideo') + interval '7 days'
  and extract(hour from v.hora_local) between 9 and 20
group by 1, 2;
```

### 3.3 Activar RLS y crear las políticas

RLS (Row Level Security) es lo que impide que cualquiera con tu URL lea o borre tus datos. **Sin RLS, la clave pública del frontend da acceso a toda la tabla.** Ejecutá este segundo bloque:

```sql
-- RLS activado en TODAS las tablas.
alter table public.propiedades          enable row level security;
alter table public.contactos            enable row level security;
alter table public.conversaciones       enable row level security;
alter table public.mensajes             enable row level security;
alter table public.llamadas             enable row level security;
alter table public.oportunidades        enable row level security;
alter table public.oportunidad_eventos  enable row level security;
alter table public.actividad            enable row level security;
alter table public.visitas              enable row level security;
alter table public.ajustes              enable row level security;

-- Políticas de EJEMPLO para una sola inmobiliaria con equipo cerrado:
-- cualquier usuario autenticado del proyecto puede leer y escribir.
-- Esto es seguro SOLO si desactivás los registros públicos (sección 7).
do $$
declare
  t text;
begin
  foreach t in array array[
    'propiedades', 'contactos', 'conversaciones', 'mensajes', 'llamadas',
    'oportunidades', 'oportunidad_eventos', 'actividad', 'visitas'
  ]
  loop
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
    execute format('create policy "equipo lee %1$s" on public.%1$I for select to authenticated using (true)', t);
    execute format('create policy "equipo crea %1$s" on public.%1$I for insert to authenticated with check (true)', t);
    execute format('create policy "equipo edita %1$s" on public.%1$I for update to authenticated using (true) with check (true)', t);
    execute format('create policy "equipo borra %1$s" on public.%1$I for delete to authenticated using (true)', t);
  end loop;
end
$$;

-- Ajustes: cada usuario ve y edita solo los suyos.
grant select, insert, update, delete on public.ajustes to authenticated;
create policy "ajustes propios" on public.ajustes
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- Las vistas heredan el RLS de las tablas (security_invoker); solo falta dar lectura.
grant select on public.realizado_mes, public.visitas_por_franja to authenticated;
```

Dos aclaraciones:

- `(select auth.uid())` va entre paréntesis a propósito: Postgres lo evalúa una sola vez por consulta en vez de una vez por fila.
- Si más adelante tenés **varias inmobiliarias** en el mismo proyecto, agregá una columna `agencia_id` a cada tabla y cambiá `using (true)` por una condición que compare con la agencia del usuario. No lo dejes en `true`.

### 3.4 Cargar los datos de ejemplo

Tenés dos caminos. Los datos de ejemplo son ficticios; cargalos para ver el sistema andando antes de pasar a datos reales.

**Camino A: importar CSV desde el panel.** Convertí cada `data.json` a CSV, abrí **Table Editor → (tabla) → Insert → Import data from CSV** y mapeá columnas. Sirve para tablas simples (`contactos`, `propiedades`), pero tenés que renombrar columnas a mano (`diasEnCartera` → `en_cartera_desde`, `nextStep` → `next_step`, etc.) y convertir los textos "hace 2 h" a fechas. Para este sistema recomiendo el camino B.

**Camino B: script que lee los `data.json`.** Guardalo **fuera del repo** (o en una carpeta ignorada por git), por ejemplo `seed-supabase.mjs`, y corrélo desde la raíz del proyecto. Usa la clave `service_role`, que saltea RLS: **solo en tu computadora, nunca en el frontend ni en un repo.**

```bash
npm install --no-save @supabase/supabase-js
node --env-file=.env.local seed-supabase.mjs
```

(`--no-save` instala el paquete sin tocar tu `package.json`. `--env-file` pide Node 20.6 o superior.)

```js
// seed-supabase.mjs · carga los data.json del demo en tus tablas. Correlo UNA vez sobre tablas vacías.
import { createClient } from "@supabase/supabase-js"
import { readFileSync } from "node:fs"

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !key) throw new Error("Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local")

const sb = createClient(url, key, { auth: { persistSession: false } })
const leer = (modulo) => JSON.parse(readFileSync(`modules/${modulo}/data.json`, "utf8"))

// Convierte los textos del demo a fechas reales.
const MIN = 60_000
function desdeHace(txt) {                       // "hace 4 min" | "hace 2 h" | "hace 3 d" | "ayer"
  const m = /^hace (\d+) (min|h|d)$/.exec(txt)
  const ms = m ? Number(m[1]) * { min: MIN, h: 60 * MIN, d: 1440 * MIN }[m[2]] : 1440 * MIN
  return new Date(Date.now() - ms).toISOString()
}
const MESES = { ene: 0, feb: 1, mar: 2, abr: 3, may: 4, jun: 5, jul: 6, ago: 7, sep: 8, oct: 9, nov: 10, dic: 11 }
function fechaDe(txt) {                         // "12 oct" -> "2026-10-12"
  const [dia, mes] = txt.split(" ")
  return new Date(Date.UTC(new Date().getUTCFullYear(), MESES[mes], Number(dia))).toISOString().slice(0, 10)
}
function hoyA(hhmm) {                           // "17:42" -> hoy a esa hora
  const [h, m] = hhmm.split(":").map(Number)
  const d = new Date()
  d.setHours(h, m, 0, 0)
  return d.toISOString()
}

async function cargar(tabla, filas) {
  const { data, error } = await sb.from(tabla).upsert(filas, { onConflict: "codigo" }).select("id, codigo")
  if (error) throw new Error(`${tabla}: ${error.message}`)
  console.log(`${tabla}: ${filas.length} filas`)
  return data
}

await cargar("propiedades", leer("propiedades").propiedades.map((p) => ({
  codigo: p.codigo, titulo: p.titulo, zona: p.zona, tipo: p.tipo, precio: p.precio, m2: p.m2,
  dorm: p.dorm, banos: p.banos, cochera: p.cochera, estado: p.estado,
  en_cartera_desde: new Date(Date.now() - p.diasEnCartera * 864e5).toISOString().slice(0, 10),
  destacada: p.destacada,
})))

await cargar("contactos", leer("contactos").contacts.map((c) => ({
  codigo: c.id, nombre: c.nombre, estado: c.estado, telefono: c.telefono, email: c.email,
  ultima_interaccion_at: desdeHace(c.ultima), interes: c.interes, presupuesto: c.presupuesto,
})))

await cargar("conversaciones", leer("conversaciones").tickets.map((t) => ({
  codigo: t.id, contacto: t.contacto, estado_lead: t.estadoLead, ultimo: t.ultimo,
  ultimo_mensaje_at: desdeHace(t.cuando), propiedad: t.propiedad, precio: t.precio,
  estado_prop: t.estadoProp, sin_leer: t.sinLeer,
})))

await cargar("llamadas", leer("llamadas").calls.map((l) => ({
  codigo: l.id, inicio_at: hoyA(l.hora), contacto: l.contacto, telefono: l.telefono,
  propiedad: l.propiedad, duracion_seg: l.duracionSeg, resultado: l.resultado, next_step: l.nextStep,
})))

const oportunidades = leer("pipeline").oportunidades
const guardadas = await cargar("oportunidades", oportunidades.map((o) => ({
  codigo: o.id, comprador: o.comprador, telefono: o.telefono, propiedad: o.propiedad, zona: o.zona,
  precio: o.precio, comision_pct: o.comisionPct, etapa: o.etapa,
  actualizada_at: desdeHace(o.actualizada), nota: o.nota,
})))
const idDe = Object.fromEntries(guardadas.map((g) => [g.codigo, g.id]))
const { error: errDel } = await sb.from("oportunidad_eventos").delete().in("oportunidad_id", Object.values(idDe))
if (errDel) throw new Error(`oportunidad_eventos: ${errDel.message}`)
const eventos = oportunidades.flatMap((o) =>
  o.historial.map((h) => ({ oportunidad_id: idDe[o.id], fecha: fechaDe(h.fecha), texto: h.texto }))
)
const { error: errEv } = await sb.from("oportunidad_eventos").insert(eventos)
if (errEv) throw new Error(`oportunidad_eventos: ${errEv.message}`)
console.log(`oportunidad_eventos: ${eventos.length} filas`)

const dash = leer("dashboard")
await cargar("actividad", dash.actividad.map((a) => ({
  codigo: a.id, tipo: a.tipo, texto: a.texto, created_at: desdeHace(a.cuando),
})))

// Visitas de esta semana a partir del heatmap (Lun = 0 ... Sab = 5; franja j = 9 + 2j hs).
const lunes = new Date()
lunes.setHours(0, 0, 0, 0)
lunes.setDate(lunes.getDate() - ((lunes.getDay() + 6) % 7))
const visitas = []
dash.heatmap.dias.forEach((dia, i) =>
  dia.valores.forEach((cant, j) => {
    for (let k = 0; k < cant; k++) {
      const d = new Date(lunes)
      d.setDate(lunes.getDate() + i)
      d.setHours(9 + 2 * j, k * 7, 0, 0)
      visitas.push({ agendada_para: d.toISOString() })
    }
  })
)
const { error: errVis } = await sb.from("visitas").insert(visitas)
if (errVis) throw new Error(`visitas: ${errVis.message}`)
console.log(`visitas: ${visitas.length} filas`)
console.log("Listo.")
```

### 3.5 Variables de entorno

Copiá el ejemplo y completalo:

```bash
cp .env.example .env.local
```

Abrí `.env.local` y pegá los valores de **Project Settings → API**:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-publica
```

Reglas que no se negocian:

- `NEXT_PUBLIC_*` viaja al navegador de cualquiera que abra el sitio. Por eso ahí **solo** va la URL y la clave pública (`anon`, o `publishable` en el panel nuevo; sirve en esa misma variable).
- La clave **`service_role`** (o *secret key*) saltea RLS: da control total. **Jamás** lleva el prefijo `NEXT_PUBLIC_`, jamás se importa desde un componente `"use client"` y jamás se sube a git.
- `.env.local` ya está ignorado por git (`.gitignore`). `.env.example` es el único que se commitea y va siempre con valores vacíos.

### 3.6 Instalar el cliente y crear `lib/supabase`

```bash
npm install @supabase/supabase-js @supabase/ssr
```

Creá `lib/supabase/client.ts` (para los módulos, que son componentes de cliente):

```ts
// lib/supabase/client.ts
import { createBrowserClient } from "@supabase/ssr"

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

Y `lib/supabase/server.ts` (para Route Handlers, Server Components y el login):

```ts
// lib/supabase/server.ts
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // Si se llama desde un Server Component no se pueden escribir cookies; el middleware se encarga de refrescar la sesión.
          }
        },
      },
    }
  )
}
```

Opcional pero muy recomendable: generá los tipos de tu base para que el editor te autocomplete columnas.

```bash
npx supabase gen types typescript --project-id "tu-proyecto" > lib/supabase/database.types.ts
```

### 3.7 Antes / después: `getContactos`

Esta es la forma de convertir **cada** función de `api.ts`: misma firma, cuerpo nuevo.

**Antes** (`modules/contactos/api.ts`, demo):

```ts
import raw from "./data.json"

export async function getContactos(): Promise<Contacto[]> {
  await sleep(300)
  return structuredClone(raw.contacts) as Contacto[]
}
```

**Después** (consulta a Supabase):

```ts
import { supabase } from "@/lib/supabase/client"
import { haceCuanto } from "@/lib/tiempo"
import type { EstadoLead } from "@/shell/cartera"

export async function getContactos(): Promise<Contacto[]> {
  const { data, error } = await supabase
    .from("contactos")
    .select("id, nombre, estado, telefono, email, ultima_interaccion_at, interes, presupuesto")
    .order("ultima_interaccion_at", { ascending: false, nullsFirst: false })

  if (error) throw new Error(`No se pudieron cargar los contactos: ${error.message}`)

  return (data ?? []).map((r) => ({
    id: r.id,
    nombre: r.nombre,
    estado: r.estado as EstadoLead,
    telefono: r.telefono ?? "",
    email: r.email ?? "",
    ultima: haceCuanto(r.ultima_interaccion_at),
    interes: r.interes ?? "",
    presupuesto: r.presupuesto,
  }))
}
```

El tipo `Contacto` y el nombre `getContactos` no cambian, así que `modules/contactos/index.tsx` sigue funcionando igual. Los nombres de columna en base son `snake_case` y los del tipo son `camelCase`: la conversión se hace en ese `map`.

El helper `haceCuanto` convierte una fecha real en el texto que muestra el demo:

```ts
// lib/tiempo.ts
export function haceCuanto(iso: string | null): string {
  if (!iso) return "—"
  const min = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 60_000))
  if (min < 60) return `hace ${min} min`
  const h = Math.floor(min / 60)
  if (h < 24) return `hace ${h} h`
  const d = Math.floor(h / 24)
  return d === 1 ? "ayer" : `hace ${d} d`
}
```

Para `getPropiedades`, hay que devolver también `codigo` (el código visible, por ejemplo `NX-2301`) y la única conversión no trivial es `diasEnCartera`:

```ts
diasEnCartera: Math.max(0, Math.round((Date.now() - new Date(r.en_cartera_desde).getTime()) / 864e5)),
```

Con esto, las demás funciones siguen el mismo patrón: `getTickets` lee `conversaciones` (`estado_lead` → `estadoLead`, `estado_prop` → `estadoProp`, `sin_leer` → `sinLeer`); `getLlamadas` lee `llamadas` (`duracion_seg` → `duracionSeg`, `next_step` → `nextStep`, y `hora` se arma con `new Date(r.inicio_at).toLocaleTimeString("es-UY", { hour: "2-digit", minute: "2-digit", hour12: false })`, filtrando `inicio_at` de hoy); `getOportunidades` pide `oportunidades` con su historial en una sola consulta (`.select("*, oportunidad_eventos(fecha, texto)")`); `getRealizado` lee la vista `realizado_mes` y le suma `periodo` (el mes en texto, por ejemplo `new Date().toLocaleDateString("es-UY", { month: "long", year: "numeric" })`, que el panel muestra en el subtítulo); `getHeatmap` lee `visitas_por_franja` y arma la matriz de días por franja.

Un detalle de interfaz que ya está resuelto: los módulos cargan sus datos con `useCarga(getX)` (`shell/carga.tsx`). Mientras llegan los datos muestran `—` y esqueletos; si la función hace `throw` (como en el ejemplo de arriba), la pantalla muestra un aviso con el botón "Reintentar". No tenés que agregar un `.catch` en las pantallas: alcanza con que `api.ts` lance el error.

### 3.8 Auth con Supabase Auth

El archivo `shell/auth-stub.ts` es un placeholder. Se reemplaza por Supabase Auth (**nunca Clerk**). Hacen falta cuatro piezas.

**1) Crear usuarios.** En el panel, **Authentication → Users → Add user**, creá a tu equipo con email y contraseña. Después desactivá los registros públicos (sección 7).

**2) `middleware.ts` en la raíz**: refresca la sesión y manda a `/login` a quien no esté autenticado.

```ts
// middleware.ts
import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    }
  )

  // No pongas lógica entre createServerClient y getUser: si se rompe, la gente queda deslogueada al azar.
  const { data: { user } } = await supabase.auth.getUser()

  if (!user && !request.nextUrl.pathname.startsWith("/login")) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
```

**3) Página de login** (`app/login/page.tsx`): un formulario con email y contraseña. Fijate que acá no hay nada de diseño: usá las clases del sistema (`surface-card`, tokens del theme) para que quede igual al resto.

```tsx
// app/login/page.tsx
"use client"
import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  async function entrar(e: FormEvent) {
    e.preventDefault()
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return setError("Email o contraseña incorrectos")
    router.push("/dashboard")
    router.refresh()
  }

  return (
    <form onSubmit={entrar} className="surface-card mx-auto mt-24 max-w-sm space-y-4 p-6">
      <h1 className="font-heading text-xl font-bold">Ingresar</h1>
      <label className="block text-sm">
        Email
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded border border-border bg-surface px-3 py-2" />
      </label>
      <label className="block text-sm">
        Contraseña
        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full rounded border border-border bg-surface px-3 py-2" />
      </label>
      {error && <p role="alert" className="text-sm text-danger">{error}</p>}
      <button type="submit" className="w-full rounded bg-primary px-3 py-2 text-sm font-medium text-bg">Entrar</button>
    </form>
  )
}
```

Como `/login` comparte `app/layout.tsx`, vas a ver el menú lateral. Si no lo querés, mové el login a un grupo de rutas con su propio layout.

**4) Reemplazar `shell/auth-stub.ts`**, manteniendo la forma `{ user: { id, name } }` que devuelve hoy:

```ts
// shell/auth-stub.ts
import { createClient } from "@/lib/supabase/server"

export async function getSession() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user ? { user: { id: user.id, name: user.email ?? "Usuario" } } : null
}
```

Para cerrar sesión: `await supabase.auth.signOut()` desde un botón en el cliente. Usá `getUser()` en servidor y middleware: valida el token contra Supabase. No confíes en `getSession()` del lado servidor.

---

## 4. Railway: tareas en segundo plano (pg-boss)

### Para qué sirve, en criollo

Vercel responde a visitas y se "apaga" entre una y otra: no sirve para algo que tiene que pasar **solo, a una hora, o que tarda**. Railway corre un programa chiquito (un **worker**) que está siempre prendido. **pg-boss** es la libreta de pendientes de ese worker: guarda las tareas en tu propia base de Supabase (en un schema aparte, `pgboss`) y se asegura de que cada tarea se haga una vez, con reintentos si falla.

### Qué casos de una inmobiliaria lo necesitan

- **Lead sin responder.** El demo ya tiene el interruptor "Lead sin responder +1 h": cada 5 minutos el worker busca conversaciones con mensajes sin leer hace más de una hora y avisa al corredor. La velocidad de primera respuesta es la venta.
- **Recordatorio de visita.** Una hora antes de cada visita agendada, un aviso al corredor y al comprador.
- **Resumen de llamadas.** Al terminar una llamada: transcribir el audio y guardar un resumen (sección 6).
- **Seguimiento de leads fríos.** Todas las mañanas, marcar como `frio` los contactos sin interacción hace más de N días y proponer un mensaje de reactivación.
- **Resumen diario por mail.** El interruptor "Resumen diario por mail": una vez al día, un correo con consultas, visitas y cierres.
- **Reintento de envío.** Si falla el envío de un WhatsApp, volver a intentarlo.

### Conexión a la base: directa o pooler

pg-boss mantiene conexiones largas y usa funciones de sesión de Postgres. Por eso **no uses el pooler en modo transacción (puerto 6543)**. Opciones:

| Cadena de conexión | Cuándo |
|---|---|
| **Directa** (`db.<tu-proyecto>.supabase.co:5432`) | La mejor para un proceso permanente. En el plan gratuito y en el pago sin add-on es **solo IPv6** |
| **Pooler en modo sesión** (`aws-...pooler.supabase.com:5432`, usuario `postgres.<tu-proyecto>`) | Si tu servidor no tiene IPv6: es IPv4 y mantiene la sesión |
| Pooler en modo transacción (puerto 6543) | **No** para pg-boss: pensado para funciones serverless |

Probá primero la directa y, si Railway no logra conectar, pasá a la del pooler en modo sesión. Las dos se copian de **Connect** en el panel de Supabase (botón arriba).

### Pasos

1. Entrá a https://railway.com y creá un **New Project**.
2. El worker es un programa Node aparte: creá un repo nuevo (por ejemplo `nexo-worker`) con el código del ejemplo de abajo. **No lo pongas dentro de este repo.**
3. En el proyecto de Railway: **New → GitHub Repo** y elegí `nexo-worker`. Si el worker vive dentro de una carpeta de otro repo, indicá esa carpeta como *Root Directory* en los ajustes del servicio.
4. En el servicio, pestaña **Variables**, cargá:

   ```bash
   DATABASE_URL=postgresql://postgres:TU_CONTRASEÑA@db.tu-proyecto.supabase.co:5432/postgres
   SUPABASE_URL=https://tu-proyecto.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=tu-clave-service-role
   ```

   Estas variables viven **solo en Railway**. Nunca en Vercel ni con prefijo `NEXT_PUBLIC_`.
5. En **Settings → Deploy**, el *Custom Start Command* es `npm start` (o dejá que Railway lo detecte del `package.json`).
6. Un worker no recibe visitas, así que no necesita dominio público. Mirá la pestaña **Deployments** y **Logs**: deberías ver que arrancó y está esperando tareas.

Dependencias del worker:

```bash
npm init -y
npm install pg-boss @supabase/supabase-js
```

En el `package.json` del worker poné `"type": "module"` y `"scripts": { "start": "node index.mjs" }`. Las versiones recientes de pg-boss piden Node 22 o superior: revisá su README y fijá la versión de Node en Railway si hace falta.

### Esqueleto de un worker (ejemplo, no es código de este repo)

```js
// index.mjs del worker (repo aparte)
import PgBoss from "pg-boss"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
})

const boss = new PgBoss(process.env.DATABASE_URL)
boss.on("error", (err) => console.error("pg-boss:", err))
await boss.start()

// Las colas hay que crearlas antes de usarlas.
await boss.createQueue("lead-sin-responder")
await boss.createQueue("resumir-llamada")

// Cada 5 minutos, hora de Montevideo.
await boss.schedule("lead-sin-responder", "*/5 * * * *", {}, { tz: "America/Montevideo" })

// El handler recibe un arreglo de tareas.
await boss.work("lead-sin-responder", async ([job]) => {
  const haceUnaHora = new Date(Date.now() - 60 * 60_000).toISOString()
  const { data, error } = await supabase
    .from("conversaciones")
    .select("id, contacto, ultimo")
    .gt("sin_leer", 0)
    .lt("ultimo_mensaje_at", haceUnaHora)
  if (error) throw error // pg-boss reintenta
  for (const c of data) {
    console.log(`Lead sin responder: ${c.contacto}`)
    // acá enviarías el aviso (email, push, WhatsApp)
  }
})

await boss.work("resumir-llamada", async ([job]) => {
  const { llamadaId } = job.data
  // 1) bajar el audio de Storage  2) transcribir  3) resumir con IA (sección 6)
  // 4) await supabase.from("llamadas").update({ transcripcion, resumen }).eq("id", llamadaId)
})

console.log("Worker listo")
```

Para encolar una tarea desde otro lado (por ejemplo cuando termina una llamada): `await boss.send("resumir-llamada", { llamadaId })` desde el worker, o desde un webhook que viva en el mismo servicio. Las API de pg-boss cambian entre versiones mayores: contrastá este ejemplo con la documentación de la versión que instales.

---

## 5. Vercel: publicar

1. Subí tu copia del proyecto a un repo de GitHub (tuyo, **privado** si ya cargaste datos reales).
2. Entrá a https://vercel.com, **Add New → Project** e importá el repo. Vercel detecta **Next.js** solo: no cambies el comando de build ni la carpeta de salida.
3. Antes de **Deploy**, abrí **Environment Variables** y cargá las mismas variables de `.env.local` que empiezan con `NEXT_PUBLIC_` (y las de IA de la sección 6, sin prefijo). Marcá los entornos **Production** y **Preview**. **No cargues** `DATABASE_URL`: eso es del worker en Railway.
4. **Deploy.** Al terminar te da una URL `*.vercel.app`.
5. **Dominio propio:** en el proyecto, **Settings → Domains**, agregá tu dominio y copiá los registros DNS que te indica Vercel en el panel de tu proveedor de dominio.
6. **Redeploy automático:** cada `git push` a la rama principal publica a producción; cada rama o pull request genera una URL de prueba.

Dos cosas que muerden:

- Las variables `NEXT_PUBLIC_*` se **incorporan al código en el build**. Si las cambiás, hay que volver a desplegar (**Deployments → ⋯ → Redeploy**).
- En Supabase, **Authentication → URL Configuration**, agregá tu dominio de Vercel como *Site URL* para que los enlaces de recuperación de contraseña apunten al lugar correcto.

### Si el build falla

1. Abrí el log del deploy y buscá la primera línea en rojo.
2. Reproducilo en tu máquina: `npm run build`. Lo que falla en Vercel casi siempre falla igual acá.
3. Causas típicas: variable de entorno sin cargar en Vercel; error de TypeScript (se arregla con `npx tsc --noEmit`); un import con mayúsculas distintas (Windows no distingue, Vercel sí).

---

## 6. IA: sugerencias y resúmenes

Dos usos concretos en este nicho:

- **`conversaciones`: borrador de respuesta.** "¿Sigue disponible?", "¿acepta permuta?", "¿cuánto de expensas?": la IA arma una respuesta a partir de la ficha real de la propiedad, y el corredor la revisa y la manda.
- **`llamadas`: resumen y próximo paso.** Se transcribe la llamada y la IA completa `resumen` y `next_step` (lo hace el worker de la sección 4).

**Regla de oro: la clave de la IA vive solo en el servidor.** Jamás en un componente `"use client"` ni con prefijo `NEXT_PUBLIC_`. El navegador llama a TU Route Handler y ese llama a la IA.

Variables (en `.env.local` y en Vercel; elegí **una** de las dos):

```bash
OPENAI_API_KEY=
OPENAI_MODEL=       # el nombre del modelo, tomado de la lista oficial de OpenAI
# o
GEMINI_API_KEY=
GEMINI_MODEL=       # el nombre del modelo, tomado de la lista oficial de Gemini
```

Los nombres de modelo cambian seguido; por eso van en variables y no escritos en el código.

### Ejemplo con OpenAI

```bash
npm install openai
```

```ts
// app/api/sugerir-respuesta/route.ts
import { NextResponse } from "next/server"
import OpenAI from "openai"
import { createClient } from "@/lib/supabase/server"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: Request) {
  // 1) Solo usuarios logueados.
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  // 2) Validar la entrada y traer la ficha desde la base (no confíes en datos que manda el navegador).
  const { mensaje, propiedadId } = await req.json()
  if (typeof mensaje !== "string" || mensaje.length === 0 || mensaje.length > 1000) {
    return NextResponse.json({ error: "Mensaje inválido" }, { status: 400 })
  }
  const { data: ficha } = await supabase
    .from("propiedades")
    .select("titulo, zona, tipo, precio, m2, dorm, banos, cochera, estado")
    .eq("id", propiedadId)
    .single()
  if (!ficha) return NextResponse.json({ error: "Propiedad no encontrada" }, { status: 404 })

  // 3) Llamar a la IA con un tope de salida.
  const respuesta = await openai.responses.create({
    model: process.env.OPENAI_MODEL!,
    instructions:
      "Sos asistente de una inmobiliaria. Respondé en español rioplatense, en máximo 3 líneas. " +
      "Usá solo los datos de la ficha; si te preguntan algo que no está, decí que lo consultás.",
    input: `Ficha: ${JSON.stringify(ficha)}\nConsulta del cliente: ${mensaje}`,
    max_output_tokens: 300,
  })

  return NextResponse.json({ respuesta: respuesta.output_text })
}
```

### Ejemplo con Gemini

```bash
npm install @google/genai
```

```ts
import { GoogleGenAI } from "@google/genai"

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

const respuesta = await ai.models.generateContent({
  model: process.env.GEMINI_MODEL!,
  contents: `Ficha: ${JSON.stringify(ficha)}\nConsulta del cliente: ${mensaje}`,
  config: { systemInstruction: "Sos asistente de una inmobiliaria. Respondé en máximo 3 líneas." },
})
// respuesta.text
```

### Costos y límites a vigilar

- Se cobra por **tokens** (texto que mandás + texto que recibís). Una ficha corta y una respuesta de 3 líneas cuestan poco; una transcripción de llamada completa, bastante más.
- Poné un **tope de gasto mensual** y alertas en el panel del proveedor antes de publicar.
- Siempre fijá un máximo de salida (`max_output_tokens` en el ejemplo) y recortá la entrada (el ejemplo limita el mensaje a 1000 caracteres).
- Limitá cuántas veces por minuto puede llamar un usuario a esa ruta (ver sección 7: rate limiting). Si no, un bucle o un usuario curioso te genera una factura.
- Guardá la respuesta (por ejemplo en `llamadas.resumen`) para no pagar dos veces por lo mismo.
- Los datos de tus clientes (teléfonos, presupuestos) salen hacia el proveedor de IA cuando los mandás en el prompt: mandá solo lo necesario y revisá su política de privacidad.

---

## 7. Checklist de seguridad antes de publicar con datos reales

- [ ] **RLS activado en todas las tablas** (sección 3.3). Comprobalo: en **Table Editor** ninguna tabla debe mostrar el aviso de RLS desactivado.
- [ ] **Registros públicos desactivados** en Supabase (en **Authentication**, buscá la opción para no permitir que se registren usuarios nuevos). Con las políticas de ejemplo, cualquiera que se pueda registrar vería todo.
- [ ] **`service_role` fuera del cliente**: no empieza con `NEXT_PUBLIC_`, no aparece en componentes `"use client"` y solo está en tu máquina, en Railway o en variables de servidor de Vercel.
- [ ] **`.env.local` en `.gitignore`** (ya está) y `git status` no lo lista. Si alguna vez subiste una clave a git, **rotala** en Supabase: borrarla del repo no alcanza.
- [ ] **Rate limiting** en las rutas que llaman a la IA o escriben en la base (por ejemplo con un contador por usuario en la base, o un servicio de límites en la capa de Vercel).
- [ ] **Backups**: revisá en Supabase qué copias de seguridad incluye tu plan y cuándo podés restaurar. Hacé un `pg_dump` periódico si tus datos importan.
- [ ] **No subas datos reales a un repo público.** Los `data.json` de este repo son ficticios y así deben quedar. Si publicás tu copia, que sea privada.
- [ ] **Políticas por agencia o por rol** si hay más de un equipo: reemplazá `using (true)` por una condición real.
- [ ] **Contraseñas fuertes** y verificación de email activada para tus usuarios.
- [ ] **Prueba de acceso**: abrí el sitio en una ventana de incógnito. Debe mandarte a `/login`, y la clave pública sola no debe devolver filas.

---

## 8. Errores comunes y cómo resolverlos

| Error o síntoma | Causa probable | Qué hacer |
|---|---|---|
| La lista aparece **vacía** pero no hay error | RLS activado sin política, o no estás logueado | Revisá las políticas (3.3) y que `/login` haya funcionado |
| `permission denied for table ...` (código `42501`) | Falta el `grant` o RLS bloquea | Ejecutá los `grant` de 3.3 y revisá las políticas |
| `new row violates check constraint` | Un estado que no está en la lista (`'Vendida'` en vez de `'vendida'`) | Usá exactamente los valores del `check`: minúsculas y sin tildes |
| `relation "public.xxx" does not exist` | No corriste el SQL de 3.2 | Corré el bloque completo en el SQL Editor |
| `Invalid API key` o `fetch failed` | Variable mal copiada o vacía | Revisá `.env.local` y reiniciá `npm run dev` |
| En producción no carga nada, en local sí | Variables sin cargar en Vercel | Cargalas en Vercel y hacé **Redeploy** |
| Te desloguea al azar | Lógica entre `createServerClient` y `getUser` en el middleware | Dejalas pegadas, como en 3.8 |
| El worker de Railway no conecta | Cadena directa sin IPv6 | Usá la del pooler en modo sesión (sección 4) |
| pg-boss: `queue does not exist` | Falta `createQueue` | Crear la cola antes de `send` o `work` |
| pg-boss falla con el pooler | Estás usando el puerto 6543 (modo transacción) | Cambiá al 5432 |
| `Module not found: @/lib/supabase/client` | Falta el archivo o el alias `@/` | Creá `lib/supabase/client.ts` en la raíz (ya existe el alias en `tsconfig.json`) |
| La IA responde 401 o 429 | Clave inválida, o sin saldo o límite alcanzado | Revisá la clave y el panel de facturación del proveedor |
| Build de Vercel falla y local no | Mayúsculas en un import, o variable faltante | Sección 5, "Si el build falla" |

---

## 9. Siguiente paso

Ya tenés el sistema andando. Lo que sigue es convertir esto en un negocio: **aprender a crear tu Agencia de IA y conseguir tu primer cliente**. Eso lo trabajamos adentro del Club de la IA, nuestro Skool privado.

👉 https://www.skool.com/club-de-la-ia-8047/about
