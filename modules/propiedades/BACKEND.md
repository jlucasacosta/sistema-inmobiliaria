# Backend — Propiedades
> Guia completa: [`docs/IMPLEMENTAR.md`](../../docs/IMPLEMENTAR.md).

- Funcion a reemplazar: `getPropiedades()` en `modules/propiedades/api.ts` (misma firma, otro cuerpo). El dashboard tambien la usa para el mapa.
- Datos de ejemplo: `data.json` -> clave `propiedades`.
- Tabla: `propiedades` (`tipo`, `precio`, `m2`, `dorm`, `banos`, `cochera`, `estado`, `en_cartera_desde`, `x`, `y`). RLS activado.
- `diasEnCartera` se calcula desde `en_cartera_desde`; `x` / `y` (0-100) ubican el pin en el mapa esquematico.
- Fotos reales: Supabase Storage. El demo usa un degrade de CSS, no imagenes.
