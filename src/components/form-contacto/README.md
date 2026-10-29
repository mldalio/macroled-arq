# form-contacto · `<arq-form-contacto>`

Bloque principal de Contacto: la información a la izquierda (por slot, desde el embed) y el formulario a la derecha, que envía por `fetch` al webhook de n8n. Debajo, opcional, las preguntas frecuentes. Contenedor de página, sin set en Figma: sale de Final › Contacto v3 (`2295:23055` Desktop · `2473:30918` Mobile; enviado `2473:30758` · `2473:31283`). Decisiones: `docs/decisiones.md`, 2026-10-05 · Contacto y 2026-10-14 · Contacto v3.

```html
<arq-form-contacto id="formulario">
  <h2 slot="title">Te acompañamos en cada etapa.</h2>
  <p slot="description">Desde la selección de luminarias hasta el cálculo lumínico…</p>
  <span slot="channels-title">Contacto</span>
  <arq-contact-item slot="channels" href="mailto:info@macroled.com.ar"><span slot="label">Email</span>info@macroled.com.ar</arq-contact-item>
  <arq-contact-item slot="channels" href="tel:+541140000000"><span slot="label">Teléfono</span>+54 11 4000-0000</arq-contact-item>
  <arq-link-list slot="links">…</arq-link-list>
  <h2 slot="faq-title">Preguntas frecuentes</h2>
  <p slot="faq-description">¿No encontrás lo que buscás?…</p>
  <arq-button slot="faq-action" type="underline" show-underline show-icon icon="arrow-right" href="#formulario">Escribinos</arq-button>
  <arq-faq-item slot="faq" open>…</arq-faq-item>
</arq-form-contacto>
```

El HTML del embed completo está en [src/pages/contacto.html](../../pages/contacto.html).

## Slots

| Slot | Contenido |
| --- | --- |
| `title` | `<h2>` de la introducción (`role/display-sm`) |
| `description` | Bajada (`role/body`, `color/text/secondary`) |
| `channels-title` | Título de los canales ("Contacto", `role/body-lg-regular`, `color/text/secondary`). Sin contenido, no se muestra |
| `channels` | `arq-contact-item` (email, teléfono), sin líneas, a `space/gap/sm` |
| `links` | Un `arq-link-list` ("Recursos técnicos") |
| `faq-title` | `<h2>` de las preguntas frecuentes (`role/display-sm`) |
| `faq-description` | Bajada (`role/body`, hasta `layout/measure`) |
| `faq-action` | Un `arq-button` Underline ("Escribinos", con `icon/arrow-right` y `href="#formulario"`: lleva al formulario de la misma página) |
| `faq` | `arq-faq-item`. Sin preguntas, el bloque no se muestra |

## Formulario

- **Vive en el Shadow DOM** del componente: así el `<form>` es dueño de sus campos (todos son form-associated, con ElementInternals) y su `FormData` lleva todo, incluido el archivo.
- **Campos** (v3): Tipo de consulta (`tipo`: choice-chip, Asesoramiento lumínico elegido). El texto que se ve es el de la pantalla; al webhook va el slug: `asesoramiento`, `cotizacion`, `consultas-tecnicas`, `garantia`. Tus datos (`nombre`, `empresa`, `email`, `telefono`, `provincia` con input Type=Select y las 24 jurisdicciones, `ciudad`), Tu proyecto (`detalles`, textarea de 6 filas, y `adjunto`, hasta 25 MB), `novedades` (checkbox) y Enviar consulta (`arq-button submit`).
- **Validación** al enviar (`novalidate`: sin los globos del navegador): cada campo inválido muestra su mensaje con la prop `error` de arq-input y el foco va al primero. Después del primer intento, cada campo se revalida al salir de él. Obligatorios: nombre, empresa, email, teléfono, provincia y detalles. Ciudad y el adjunto siguen opcionales.
- **Honeypot:** un campo `website` fuera de la vista y del orden de Tab. Si llega con texto, se muestra la confirmación y no se envía nada. No viaja en el `FormData`.
- **Envío:** `POST` con `multipart/form-data` (por el adjunto) a `config.n8n.webhookUrl` (`VITE_N8N_WEBHOOK_URL`). Sin URL, en `npm run dev` el envío se simula (para probar los estados) y en el build es un error.
- **Estados:** enviando (button Loading, "Enviando…"), enviado (form-message Success "Recibimos tu consulta. Te respondemos a la brevedad."; el formulario se vacía) y error (form-message Error "No pudimos enviar tu consulta. Probá de nuevo en unos minutos."; los datos quedan).
- **Eventos:** `arq:submit { data }` antes de enviar, `arq:sent` o `arq:error` después.

## Layout

| Parte | Desktop (desde 1024 px) | Mobile (y Tablet, 768–1023 px) |
| --- | --- | --- |
| Bloque | dos columnas 2:3 a `space/gap/6xl`; `space/section/md` arriba, `space/section/xl` abajo, `layout/gutter` a los lados | apiladas a `space/gap/6xl`. En Tablet los campos siguen de a dos, la bajada llega hasta `layout/measure-wide` y el envío no ocupa todo el ancho |
| Información | fija al desplazar (`position: sticky`, a `space/section/md` del borde). Intro (título y bajada a `space/gap/lg`, con línea inferior `color/border/default` y `space/padding/lg`), canales y links a `space/gap/2xl` | sin sticky |
| Formulario | secciones a `space/gap/3xl`, sin fondo; dentro, `space/gap/lg`. Título de cada sección: `<legend>` con el dibujo de form-section-header (`role/heading-3`, línea `color/border/default`, padding inferior `space/padding/sm`) | ídem |
| Tipo de consulta | chips con su ancho a `space/gap/sm-md`, en varias líneas si no entran | ídem |
| Tus datos | dos campos por fila a `space/gap/lg` | uno por fila |
| Envío | checkbox arriba; botón y mensaje debajo, a la izquierda, a `space/gap/xl` | botón a todo el ancho |
| Preguntas frecuentes | fondo `color/surface/faint`, `space/section/lg` arriba y abajo, misma grilla: texto a la izquierda y preguntas alineadas con el formulario | apiladas a `space/gap/2xl` |

## Pendientes

- `TODO` (n8n): confirmar que el webhook lea `multipart/form-data` (por el adjunto).
- `TODO` (diseño): textos de error por caso e indicador de campo obligatorio (README de input).
- `TODO` (diseño): revisar el Mobile de v3, que se armó en Figma desde el Desktop con las columnas apiladas, como el código.
- `TODO` (diseño): distancia del sticky al navbar. Hoy `space/section/md`; con `layout/navbar-height` (2026-10-20) quedaría pegado al navbar.
- `TODO` (diseño): el hover de faq-item (`color/surface/faint`) no se ve sobre el fondo faint del bloque.
- `TODO` (n8n): confirmar que el webhook acepte adjuntos de 25 MB.
- `TODO` (contenido): email y teléfono son los de Final; confirmar los datos reales.
