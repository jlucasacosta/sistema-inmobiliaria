# Backend — Llamadas
> Guía completa: [`docs/IMPLEMENTAR.md`](../../docs/IMPLEMENTAR.md).

- Función a reemplazar: `getLlamadas()` en `modules/llamadas/api.ts` (misma firma, otro cuerpo).
- Datos de ejemplo: `data.json` -> clave `calls`.
- Tabla: `llamadas` (`inicio_at`, `duracion_seg`, `resultado`, `next_step`, `grabacion_path`, `transcripcion`, `resumen`). RLS activado.
- Ingreso: webhook de telefonía -> audio en Supabase Storage -> fila en `llamadas`.
- Tarea en segundo plano (pg-boss, Railway): transcribir y resumir con IA, y completar `resumen` y `next_step`.
