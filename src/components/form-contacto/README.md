# form-contacto · `<arq-form-contacto>`

Bloque principal de Contacto: la información a la izquierda (por slot, desde el embed) y el formulario a la derecha, que envía por `fetch` al webhook de n8n. Contenedor de página, sin set en Figma: sale de la pantalla Contacto de Final (`1278:27919` Desktop · `1311:17151` Mobile; enviado `1311:17461` · `1311:17501`). Decisión: `docs/decisiones.md`, 2026-10-05 · Contacto.

```html
<arq-form-contacto>
  <h2 slot="title">Te acompañamos en cada etapa.</h2>
  <p slot="description">Desde la selección de luminarias hasta el cálculo lumínico…</p>
  <arq-contact-item slot="channels" href="mailto:info@macroled.com.ar"><span slot="label">Email</span>info@macroled.com.ar</arq-contact-item>
  <arq-contact-item slot="channels" href="tel:+541140000000"><span slot="label">Teléfono</span>+54 11 4000-0000</arq-contact-item>
  <arq-link-list slot="links">…</arq-link-list>
</arq-form-contacto>
```

El HTML del embed completo está en [src/pages/contacto.html](../../pages/contacto.html).

## Slots

| Slot | Contenido |
| --- | --- |
| `title` | `<h2>` de la introducción (`role/heading-2`) |
| `description` | Bajada (`role/body-lg`, `color/text/secondary`) |
| `channels` | `arq-contact-item` (email, teléfono); la lista cierra con una línea `color/border/subtle` |
| `links` | Un `arq-link-list` ("Recursos técnicos") |

## Formulario

- **Vive en el Shadow DOM** del componente: así el `<form>` es dueño de sus campos (todos son form-associated, con ElementInternals) y su `FormData` lleva todo, incluido el archivo.
- **Campos** (Final): 01 Tipo de consulta (`tipo`: choice-chip, Asesoramiento lumínico elegido), 02 Tus datos (`nombre`, `empresa`, `email`, `telefono`, `provincia` con input Type=Select y las 24 jurisdicciones, `ciudad`), 03 Tu proyecto (`detalles` y `adjunto`), `novedades` (checkbox) y Enviar consulta (`arq-button submit`).
- **Validación** al enviar (`novalidate`: sin los globos del navegador): cada campo inválido muestra su mensaje con la prop `error` de arq-input y el foco va al primero. Después del primer intento, cada campo se revalida al salir de él. Obligatorios: nombre, email y detalles.
- **Honeypot:** un campo `website` fuera de la vista y del orden de Tab. Si llega con texto, se muestra la confirmación y no se envía nada. No viaja en el `FormData`.
- **Envío:** `POST` con `multipart/form-data` (por el adjunto) a `config.n8n.webhookUrl` (`VITE_N8N_WEBHOOK_URL`). Sin URL, en `npm run dev` el envío se simula (para probar los estados) y en el build es un error.
- **Estados:** enviando (button Loading, "Enviando…"), enviado (form-message Success "Recibimos tu consulta. Te respondemos a la brevedad."; el formulario se vacía) y error (form-message Error "No pudimos enviar tu consulta. Probá de nuevo en unos minutos."; los datos quedan).
- **Eventos:** `arq:submit { data }` antes de enviar, `arq:sent` o `arq:error` después.

## Layout

| Parte | Desktop | Mobile |
| --- | --- | --- |
| Bloque | dos columnas iguales a `space/gap/6xl`; `space/section/lg` arriba, `space/section/xl` abajo, `layout/gutter` a los lados | apiladas a `space/gap/6xl` |
| Información | intro (título y bajada a `space/gap/md`), canales y links a `space/gap/2xl` | ídem |
| Formulario | secciones a `space/gap/2xl`; dentro, `space/gap/lg` | ídem |
| Tipo de consulta | chips a `space/gap/sm-md`, en varias líneas | ídem |
| Tus datos | dos campos por fila a `space/gap/lg` | uno por fila |
| Envío | checkbox a la izquierda; botón y mensaje a la derecha, a `space/gap/md` | apilados; botón a todo el ancho |

## Pendientes

- `TODO` (n8n): falta `VITE_N8N_WEBHOOK_URL` y confirmar el formato que espera el webhook.
- `TODO` (diseño): textos de error por caso e indicador de campo obligatorio (README de input). Las columnas están a 160 en Final y no hay gap de ese tamaño (`space/gap/6xl`, 128).
- `TODO` (contenido): email y teléfono son los de Final; confirmar los datos reales.
