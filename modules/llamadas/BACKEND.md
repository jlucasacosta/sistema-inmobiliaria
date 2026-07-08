# Backend — Llamadas
> Asume BACKEND_RULES.md.

- Tablas: llamadas (contacto_id, duracion, grabacion_url, transcripcion, resumen)
- Ingreso: webhook de telefonia -> guarda audio en Supabase Storage
- Job (pg-boss): transcribir con Whisper -> resumen con LLM
- Reemplazar: modules/llamadas/api.ts. Misma firma.
