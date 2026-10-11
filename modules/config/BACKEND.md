# Backend — Configuración
> Guía completa: [`docs/IMPLEMENTAR.md`](../../docs/IMPLEMENTAR.md).

- No tiene `api.ts` ni `data.json`: el diseño vive en `shell/theme.ts` y no necesita backend.
- El equipo (`equipo`) está escrito dentro de `index.tsx`: si lo querés editable, pasalo a una tabla (o leelo de `auth.users`).
- Ajustes por usuario (opcional): tabla `ajustes (user_id, clave, valor jsonb)` con RLS por `auth.uid()`. SQL en la sección 3.2.
