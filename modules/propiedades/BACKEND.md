# Backend — Propiedades
> Guía completa: [`docs/IMPLEMENTAR.md`](../../docs/IMPLEMENTAR.md).

- Función a reemplazar: `getPropiedades()` en `modules/propiedades/api.ts` (misma firma, otro cuerpo). El dashboard también la usa para contar las propiedades disponibles.
- Datos de ejemplo: `data.json` -> clave `propiedades`.
- Tabla: `propiedades` (`tipo`, `precio`, `m2`, `dorm`, `banos`, `cochera`, `estado`, `en_cartera_desde`). RLS activado.
- `diasEnCartera` se calcula desde `en_cartera_desde`.
- La pantalla es una tabla de CRM: el buscador, los filtros (estado, tipo, zona), el orden y la paginación (10 por página) hoy se resuelven en el navegador sobre el JSON. Con un backend real conviene pasarlos a la query (`where`, `order by`, `limit`/`offset`).
