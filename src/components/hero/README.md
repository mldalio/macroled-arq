# hero · `<arq-hero>`

Hero de página de Home y Contacto: media a sangre (imagen o video), scrim, eyebrow, título (el `<h1>` de la página), bajada y CTA opcionales. Textos claros sobre la foto.

- Figma: [1311-4340](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1311-4340) · ficha `doc/hero`

```html
<arq-hero>
  <img slot="media" src="…" alt="Dos balizas de jardín encendidas" fetchpriority="high">
  <span slot="eyebrow">Iluminación profesional</span>
  <h1 slot="title">Materia, forma, atmósfera.</h1>
  <arq-button slot="action" type="outline" href="/arq/colecciones">Explorar colecciones</arq-button>
</arq-hero>

<arq-hero>
  <video slot="media" src="…" poster="…" autoplay muted loop playsinline aria-hidden="true"></video>
  <span slot="eyebrow">Contacto</span>
  <h1 slot="title">Hablemos de tu proyecto.</h1>
  <span slot="description">Te acompañamos desde el anteproyecto hasta la obra.</span>
  <arq-button slot="action" type="outline" href="#formulario">Escribinos</arq-button>
</arq-hero>
```

## Props y slots

| Figma | Slot | Contenido |
| --- | --- | --- |
| (media) | `media` | un `<img>` o un `<video>`. Se ubica a sangre con `object-fit: cover` |
| Eyebrow · Show eyebrow | `eyebrow` | texto. Sin contenido, no se muestra |
| Title | `title` | un `<h1>` con el título |
| Description · Show description | `description` | texto. Sin contenido, no se muestra |
| Show button | `action` | `<arq-button type="outline">`. Sin contenido, no se muestra |
| Breakpoint | — | media query: hasta 767 px es Mobile |

| Atributo | Tipo | Qué hace |
| --- | --- | --- |
| `full-height` | booleano (solo código) | Todo el alto del viewport (`100svh`) en Desktop y Mobile, en lugar de `ratio/wide` y `70svh`. Lo usa la Home |

- **Show eyebrow, Show description y Show button no son atributos:** cada parte aparece si su slot tiene contenido. En Figma Show eyebrow y Show button vienen en `true` y Show description en `false`; en código lo decide el HTML.
- **Título:** el `<h1>` va en el HTML de la página, `<h1 slot="title">…</h1>`, no dentro del Shadow DOM. El componente le da `role/display` y el color con `::slotted(h1)` (hereda de un contenedor interno, con `!important` porque los estilos del sitio para `h1` ganan sobre `::slotted`). Es el único `<h1>` de la página: en Home y Contacto no va page-header. Para forzar el corte de Figma ("Materia, forma, / atmósfera.") se puede usar `<br>`; si no, se parte solo.
- **Es un `<div>`, no un `<header>`:** el banner de la página es el navbar (dos banners es un error de accesibilidad).

## Media (LCP)

- La media va en el HTML del embed (slot), no la carga el JS: el navegador la descubre al leer la página.
- **Imagen:** `fetchpriority="high"` y sin `loading="lazy"` (es lo primero que se ve). Con `alt` descriptivo; `alt=""` si es solo ambiente.
- **Video:** `autoplay muted loop playsinline` + `poster` (y `aria-hidden="true"` si es ambiente). Con `prefers-reduced-motion: reduce` el componente lo pausa y vuelve al poster; si la preferencia cambia, lo reanuda.
- Mientras carga (o si falta) el fondo es `color/surface/inverse`, así el texto se sigue leyendo.
- Los estilos de posición de la media van con `!important`: en el sitio, los estilos de Webflow para `img` ganan sobre `::slotted`.

## Navbar Transparent encima

El navbar **no** va dentro del hero (`docs/decisiones.md`, 2026-10-01 · hero y navbar). Para que se superponga, la página necesita:

1. `<arq-navbar theme="transparent">` antes del hero, con posición absoluta (o fija) arriba, sobre la media. El hero no se corre hacia abajo: la media empieza en el borde superior de la página, como en Figma.
2. El contenido del hero va abajo (`justify-content: flex-end`), así que la franja de 56 px del navbar no lo tapa mientras haya alto: con `ratio/wide` en Desktop y `70svh` en Mobile, un título de hasta 3–4 líneas queda lejos. Para reservar la franja hace falta un token. `TODO`: crear `layout/navbar-height` (56) en Figma al construir navbar; lo usan hero y compare-header Compact.
3. El navbar pasa a Default al hacer scroll: lo resuelve el navbar, no el hero.

## Layout

| | Desktop | Mobile |
| --- | --- | --- |
| Alto | `ratio/wide` (16:10, `aspect-ratio`) | `70svh` |
| Contenido | abajo: texto a la izquierda, CTA abajo a la derecha (separados `space/gap/xl`) | abajo, todo apilado a `space/gap/lg` |
| Padding | `layout/gutter` a los lados, `space/section/sm` abajo | ídem (valores Mobile) |

## Tokens

| Parte | Token |
| --- | --- |
| Textos | `color/text/inverse` |
| Eyebrow | `role/label` |
| Título | `role/display` |
| Bajada | `role/body-lg` |
| Gap entre textos | `space/gap/lg` |
| CTA | button Outline en Dark local (`data-arq-theme="dark"` en el contenedor del slot, DESIGN.md §2) |
| Scrim | `hero/scrim` (estilo de relleno de Figma, copiado en `hero.css`: excepción fija) |
| Fondo de reserva | `color/surface/inverse` |

## Pendientes

- `hero/scrim` es un estilo de relleno de Figma y el export de variables no lo trae: el degradado está copiado con sus valores en `hero.css`, como excepción fija (igual que los px del logo; `docs/decisiones.md`, 2026-10-01 · hero). Si cambia en Figma, se copia a mano.
- `TODO` (navbar): crear `layout/navbar-height` (56) en Figma al construir navbar; lo usan hero y compare-header Compact.
- El gap entre texto y CTA en Desktop (`space/gap/xl`) no está en Figma (allí es justify-between).
- La ficha dice que el hero tiene "el modo Light fijado". En código no hay Light local: si un ancestro estuviera en Dark, `color/text/inverse` cambiaría. No pasa en Home ni Contacto (no tienen Iluminar).
