# Backend — Propiedades
> Guía completa: [`docs/IMPLEMENTAR.md`](../../docs/IMPLEMENTAR.md).

- Función a reemplazar: `getPropiedades()` en `modules/propiedades/api.ts` (misma firma, otro cuerpo). El dashboard también la usa para contar las propiedades disponibles y reservadas.
- Datos de ejemplo: `data.json` -> clave `propiedades`.
- Tabla: `propiedades` (`codigo`, `tipo`, `precio`, `m2`, `dorm`, `banos`, `cochera`, `estado`, `en_cartera_desde`). RLS activado.
- `diasEnCartera` se calcula desde `en_cartera_desde`.
- La pantalla es una tabla de CRM: el buscador, los filtros (estado, tipo, zona), el orden y la paginación (10 por página) hoy se resuelven en el navegador sobre el JSON. Con un backend real conviene pasarlos a la query (`where`, `order by`, `limit`/`offset`).
- Código visible: cada propiedad trae `codigo` ("NX-2301"), columna `codigo text unique not null` en la tabla `propiedades`. Se muestra bajo el título y el buscador lo acepta.
- Ficha: al hacer clic en una fila se abre la ficha lateral con todos los datos y 3 acciones de demostración (Enviar ficha, Agendar visita, Cambiar estado) que hoy NO guardan nada. Con backend real, cada acción pasa a ser un `insert`/`update` (por ejemplo un registro de visita en `visitas` o un cambio de `estado`), con su propio RLS.
- La temperatura (Fresca/Tibia/Fría) solo se calcula para propiedades `disponible`; sus umbrales salen de `theme.cartera`.
- Carga y error: la pantalla usa `useCarga(getPropiedades)` (`shell/carga.tsx`). Mientras llegan los datos muestra `—` y esqueletos; si la función lanza un error (`throw`), muestra un aviso con "Reintentar".
