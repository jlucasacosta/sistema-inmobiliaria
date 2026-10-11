# Backend — Contactos
> Guia completa: [`docs/IMPLEMENTAR.md`](../../docs/IMPLEMENTAR.md).

- Funcion a reemplazar: `getContactos()` en `modules/contactos/api.ts` (misma firma, otro cuerpo).
- Datos de ejemplo: `data.json` -> clave `contacts`.
- Tabla: `contactos` (`nombre`, `estado`, `telefono`, `email`, `ultima_interaccion_at`, `interes`, `presupuesto`). RLS activado.
- `ultima` ("hace 2 h") se calcula desde `ultima_interaccion_at`.
