# section · `<arq-section>`

Bloque de página: margen lateral, padding inferior y el armado encabezado → contenido → acción. Componente de layout, sin set en Figma: sale de las pantallas de Final (Home `1203:9716` · `1204:9952`). Decisión: `docs/decisiones.md`, 2026-10-02 · Layout de página.

```html
<arq-section padding-top>
  <arq-section-header slot="header" type="link" href="/arq/productos">
    <h2 slot="title">Explorar por espacio</h2>
    <span slot="link">Ver catálogo</span>
  </arq-section-header>
  <arq-grid columns="3" mobile="carousel">…</arq-grid>
  <arq-button slot="mobile-action" type="underline" show-underline show-icon icon="arrow-right" href="/arq/productos">Ver catálogo</arq-button>
</arq-section>

<arq-section layout="split">
  <arq-section-header slot="header" type="stacked">…</arq-section-header>
  <div>… faq-item …</div>
  <arq-button slot="action" type="underline" show-underline show-icon icon="arrow-right" href="/arq/contacto">Escribinos</arq-button>
</arq-section>
```

## Props y slots

| Atributo / slot | Prop JS | Valores · por defecto |
| --- | --- | --- |
| `layout` | `layout` | `stack` · `split` (def. `stack`) |
| `padding-top` | `paddingTop` | booleano: suma `space/section/md` arriba (primer bloque después del hero o el que sigue a una banda `subtle`) |
| `background` | `background` | `default` · `subtle` · `bone` · `sand` (def. `default`). `subtle`: banda `color/surface/subtle`. `bone`: `color/surface/bone` (offwhite/bone; en Dark igual que subtle). `sand`: banda de Casa FOA (`#f7f1ec`, sin token) |
| `reveal` | `reveal` | presencia: el bloque entero aparece al entrar en pantalla (fade y subida) y se va al hacer scroll hacia arriba, así la entrada se repite. Al bajar y dejarlo atrás queda visible. Con `prefers-reduced-motion` se ve quieto |
| slot `header` | — | un `arq-section-header` |
| slot por defecto | — | el contenido (grilla, mosaico, feature-block, lista) |
| slot `action` | — | un `arq-button` al final del bloque, en Desktop y Mobile |
| slot `mobile-action` | — | un `arq-button` que se ve solo hasta 767 px: el link de un section-header Type=Link, que en Mobile no se muestra (README de section-header) |

- Un slot sin contenido no suma espacio.
- No es un landmark: el `<h2>` del encabezado alcanza para navegar. Si la página quiere un `<section>`, lo pone ella.

## Layout

| | Desktop | Mobile |
| --- | --- | --- |
| Padding | `--page-gutter` a los lados (`layout/gutter`, con tope en `layout/max-width`), `space/section/xl` abajo. `padding="wide"`: `space/section/md` arriba y abajo, `space/padding/4xl` a los lados. Ese margen es de títulos y textos: Explorar, el mosaico de colecciones y el carrusel de proyectos lo cancelan y llegan al borde. Desde 1920 px se suma `--page-extra` (`--section-pad`): todo queda como a 1920, centrado, y las fotos llegan al borde de esos 1920; el carrusel de proyectos (Casa FOA) sigue al borde de la pantalla (DESIGN.md §2 · Ancho máximo) | a los lados `space/padding/sm` (títulos y textos). Arriba y abajo, `space/section/md` en `padding="wide"`. Las fotos que cancelan el margen siguen al borde |
| Gap encabezado → contenido → acción | `space/gap/2xl` | `space/gap/xl` |
| `layout="split"` | desde 1024: encabezado y acción en una columna de `layout/measure` (acción a `space/gap/lg`), contenido a la derecha a `space/section/md`. El margen lateral es `--page-gutter` (no `space/padding/4xl`) | apilado: encabezado, contenido, acción, con `--page-gutter` a los lados |
| `layout="tools"` | título a lo ancho; tarjeta grande y las chicas en dos columnas | las tarjetas en una fila con scroll (80 % del ancho, la siguiente asoma). `TODO` (diseño): sin frame Mobile |
| Fondo | `color/surface/default`; `subtle` usa `color/surface/subtle`; `bone` usa `color/surface/bone`; `sand` usa `#f7f1ec` (Casa FOA, sin token) | ídem |

## Pendientes

- `TODO` (diseño): en el Home de Final las bandas usan `#f7f7f7` sin variable (`neutral/50`); en código va `color/surface/subtle` (`#f0f0f0`) hasta que se enlace. Final Mobile todavía no tiene las bandas. El padding de la banda es 100 en Final, sin token: se usa `space/section/md`. El de la sección que sigue a una banda clara no está en DESIGN.md §2 · Cambio de fondo (solo cubre Dark): se usa `padding-top` (`space/section/md`, igual que la banda).

- `TODO` (diseño): en `layout="split"` el Home separa las columnas con `space/section/md`, un token de separación entre bloques usado dentro de un bloque (DESIGN.md §5).
- El ajuste de padding al cambiar de fondo (DESIGN.md §2 · Cambio de fondo) no está: el Home no tiene secciones Dark. Se suma cuando una página lo necesite.
