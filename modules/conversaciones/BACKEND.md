# Backend — Conversaciones
> Guia completa: [`docs/IMPLEMENTAR.md`](../../docs/IMPLEMENTAR.md).

- Funcion a reemplazar: `getTickets()` en `modules/conversaciones/api.ts` (misma firma, otro cuerpo).
- Datos de ejemplo: `data.json` -> clave `tickets`.
- Tablas: `conversaciones` (la bandeja) y `mensajes` (el detalle, cuando conectes WhatsApp). RLS activado.
- Ingreso: webhook de WhatsApp -> Route Handler -> insert en `mensajes` y update de `conversaciones`.
- Tarea en segundo plano (pg-boss, Railway): avisar de leads sin responder hace mas de 1 hora.
- IA: borrador de respuesta a partir de la ficha de la propiedad (seccion 6 de la guia).
