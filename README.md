# Nexo Propiedades — Sistema inmobiliario

Un sistema de gestión para inmobiliarias: propiedades en una tabla de CRM, bandeja de consultas, pipeline de operaciones, registro de llamadas y contactos. Un sistema demo hecho con Next.js.

> Es un demo **frontend** con datos de ejemplo (mock). **No tiene backend conectado**: sirve para ver cómo se ve y cómo funciona un sistema así, y para aprender a construirlo. Los datos son ficticios y no se guardan: si recargás la página, todo vuelve al estado original.

---

## Demo en vivo
👉 https://sistema-inmobiliaria-three.vercel.app

## Sumate al Club de la IA

Aprendé a crear tu Agencia de IA y conseguir tu primer cliente. Eso lo trabajamos adentro del Club de la IA, nuestro Skool privado.

👉 https://www.skool.com/club-de-la-ia-8047/about

---

## Qué incluye
- **Dashboard**: metas del mes (cierres, captaciones y comisión), mapa de calor de visitas por franja horaria, y feed de actividad.
- **Propiedades**: tabla de CRM con KPIs de la cartera, buscador, filtros por estado, tipo y zona, columnas ordenables y paginación.
- **Conversaciones**: bandeja de consultas entrantes con el estado del lead y de la propiedad.
- **Pipeline**: lista de oportunidades con la ficha completa, comisión proyectada y probabilidad de cierre.
- **Llamadas**: registro cronológico del día con resultado y próximo paso.
- **Contactos**: directorio de leads con estado y presupuesto.
- **Configuración**: marca, paleta, umbrales, notificaciones y equipo (de ejemplo).

## Requisitos (instalá esto primero)

Necesitás dos programas gratis en tu computadora:

1. **Node.js** (versión 18.18 o mayor; recomendamos la 20 o la 22). Descargalo en https://nodejs.org y elegí la opción **LTS**.
2. **Git**. Descargalo en https://git-scm.com

Para chequear que quedaron instalados, abrí una terminal y escribí:

    node -v
    git --version

Si te devuelven un número de versión, ya está.

## Cómo clonar y correr (paso a paso)

1. Abrí una terminal en la carpeta donde quieras guardar el proyecto.
2. Cloná el repo:

       git clone https://github.com/jlucasacosta/sistema-inmobiliaria.git

3. Entrá a la carpeta del proyecto:

       cd sistema-inmobiliaria

4. Instalá las dependencias (baja lo que el proyecto necesita):

       npm install

5. Levantá el proyecto:

       npm run dev

6. Abrí el navegador en http://localhost:3000

Listo. Vas a ver el sistema funcionando.

## Personalizarlo

Todo el diseño (colores, tipografía, nombre de la marca) vive en un solo archivo: `shell/theme.ts`. Cambiás eso y muta el sistema entero. Probá y mirá qué pasa.

## Cambiar los datos de ejemplo

Los datos de cada módulo están en un archivo JSON dentro de su carpeta: `modules/<módulo>/data.json` (por ejemplo `modules/propiedades/data.json`). Abrilo, editá los valores y guardá: el cambio se ve al recargar.

Los datos son de **solo lectura**: lo que hagas en pantalla (filtrar, abrir secciones, activar interruptores) vive solo en la página, no se guarda en ningún lado, y con F5 todo vuelve a lo que dice el JSON.

## Llevalo a producción

Este repo es un demo: no guarda datos ni tiene usuarios. Para convertirlo en un sistema real hay una guía paso a paso en [`docs/IMPLEMENTAR.md`](docs/IMPLEMENTAR.md). En resumen:

1. **Supabase**: la base de datos y el login de tu equipo. La guía trae el SQL de las tablas de cada módulo, con RLS.
2. **Cambiar `api.ts`**: cada módulo tiene un `api.ts` que hoy lee el JSON; conectar el backend es cambiar el cuerpo de esas funciones, sin tocar la pantalla.
3. **Railway + pg-boss**: tareas automáticas, como avisar de un lead sin responder o recordar una visita.
4. **Vercel**: publicar el sitio con tu dominio.
5. **IA (OpenAI o Gemini)**: borradores de respuesta a las consultas y resumen de llamadas.
6. **Checklist de seguridad** antes de cargar datos reales.

El archivo `.env.example` lista las variables de entorno que vas a necesitar; viene con los valores vacíos.

## Estructura de carpetas

    app/                 rutas de Next.js (cada una muestra un módulo)
    modules/<módulo>/    una carpeta por pantalla
      index.tsx            la pantalla
      api.ts               las funciones que piden datos (hoy leen el JSON)
      data.json            los datos de ejemplo
      BACKEND.md           qué cambiar al conectar el backend
    shell/               lo compartido: theme.ts (diseño), navegación, vocabulario de la cartera
    docs/IMPLEMENTAR.md  guía para llevarlo a producción
    DISENO.md            la ficha de diseño de este sistema
    .env.example         variables de entorno (vacías)

## Licencia

MIT. Podés usar este código, copiarlo y modificarlo libremente. Ver el archivo `LICENSE`.

## Te trabaste

Si algo no te salió, preguntá en el Club de la IA:

👉 https://www.skool.com/club-de-la-ia-8047/about
