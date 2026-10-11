# Backend — Dashboard
> Guía completa: [`docs/IMPLEMENTAR.md`](../../docs/IMPLEMENTAR.md).

- Funciones a reemplazar en `modules/dashboard/api.ts`: `getRealizado()`, `getHeatmap()`, `getActividad()`.
- Datos de ejemplo: `data.json` -> claves `realizado`, `heatmap`, `actividad`.
- Sin tablas propias de métricas: `realizado_mes` y `visitas_por_franja` son vistas sobre `oportunidades`, `propiedades` y `visitas`; `actividad` es una tabla.
- Los objetivos del mes (`meta`) siguen en `shell/theme.ts`.
- El encabezado usa `getPropiedades()` del módulo propiedades solo para contar las disponibles.
