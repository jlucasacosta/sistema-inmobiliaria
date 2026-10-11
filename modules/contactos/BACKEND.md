# Backend — Contactos
> Guía completa: [`docs/IMPLEMENTAR.md`](../../docs/IMPLEMENTAR.md).

- Función a reemplazar: `getContactos()` en `modules/contactos/api.ts` (misma firma, otro cuerpo).
- Datos de ejemplo: `data.json` -> clave `contacts`.
- Tabla: `contactos` (`nombre`, `estado`, `telefono`, `email`, `ultima_interaccion_at`, `interes`, `presupuesto`). RLS activado.
- `ultima` ("hace 2 h") se calcula desde `ultima_interaccion_at`.
- Ficha: al hacer clic en una fila se abre la ficha lateral con todos los datos del contacto y 3 acciones de demostración (Llamar, Enviar propiedades, Cambiar estado) que hoy NO guardan nada. Con backend real serían un registro en `llamadas`, un envío (WhatsApp o mail) y un `update` de `contactos.estado`.
- Carga y error: la pantalla usa `useCarga(getContactos)` (`shell/carga.tsx`). Mientras llegan los datos muestra `—` y esqueletos; si la función lanza un error (`throw`), muestra un aviso con "Reintentar".
