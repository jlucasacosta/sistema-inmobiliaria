# Backend — Dashboard
> Guía completa: [`docs/IMPLEMENTAR.md`](../../docs/IMPLEMENTAR.md).

- Funciones a reemplazar en `modules/dashboard/api.ts`: `getRealizado()`, `getHeatmap()`, `getActividad()`.
- Datos de ejemplo: `data.json` -> claves `realizado`, `heatmap`, `actividad`.
- Sin tablas propias de métricas: `realizado_mes` y `visitas_por_franja` son vistas sobre `oportunidades`, `propiedades` y `visitas`; `actividad` es una tabla.
- Los objetivos del mes (`meta`) siguen en `shell/theme.ts`.
- El encabezado usa `getPropiedades()` del módulo propiedades para contar las disponibles y las reservadas.
- `getRealizado()` devuelve también `periodo` (el mes en texto, "octubre 2026"): armalo en `api.ts` con `toLocaleDateString("es-UY", { month: "long", year: "numeric" })`.
- La comisión aparece una sola vez (tarjeta "Comisión proyectada"); el encabezado muestra disponibles, visitas de la semana (suma del heatmap) y reservas activas, todo derivado de `getPropiedades()` y `getHeatmap()`.
- Carga y error: cada bloque usa `useCarga` (`shell/carga.tsx`): `—` y esqueletos mientras llega la data y "Reintentar" si la función lanza un error.
