# Backend — Propiedades
> Guía completa: [`docs/IMPLEMENTAR.md`](../../docs/IMPLEMENTAR.md).

- Función a reemplazar: `getPropiedades()` en `modules/propiedades/api.ts` (misma firma, otro cuerpo). El dashboard también la usa para el mapa.
- Datos de ejemplo: `data.json` -> clave `propiedades`.
- Tabla: `propiedades` (`tipo`, `precio`, `m2`, `dorm`, `banos`, `cochera`, `estado`, `en_cartera_desde`, `x`, `y`). RLS activado.
- `diasEnCartera` se calcula desde `en_cartera_desde`; `x` / `y` (0-100) ubican el pin en el mapa esquemático.
- Fotos reales: Supabase Storage. El demo usa un degradé de CSS, no imágenes.
