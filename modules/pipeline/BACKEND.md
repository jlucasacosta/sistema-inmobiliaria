# Backend — Pipeline
> Guía completa: [`docs/IMPLEMENTAR.md`](../../docs/IMPLEMENTAR.md).

- Función a reemplazar: `getOportunidades()` en `modules/pipeline/api.ts` (misma firma, otro cuerpo).
- Datos de ejemplo: `data.json` -> clave `oportunidades` (cada una con su `historial`).
- Tablas: `oportunidades` (etapa: contacto, visita, propuesta, reserva, cierre, perdida) y `oportunidad_eventos` (el historial). RLS activado.
- Una sola consulta trae todo: `.select("*, oportunidad_eventos(fecha, texto)")`.
- La probabilidad de cierre por etapa sigue en `shell/theme.ts` (`probabilidad`).
