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
| `padding-top` | `paddingTop` | booleano: suma `space/section/xl` arriba (primer bloque después del hero) |
| slot `header` | — | un `arq-section-header` |
| slot por defecto | — | el contenido (grilla, mosaico, feature-block, lista) |
| slot `action` | — | un `arq-button` al final del bloque, en Desktop y Mobile |
| slot `mobile-action` | — | un `arq-button` que se ve solo hasta 767 px: el link de un section-header Type=Link, que en Mobile no se muestra (README de section-header) |

- Un slot sin contenido no suma espacio.
- No es un landmark: el `<h2>` del encabezado alcanza para navegar. Si la página quiere un `<section>`, lo pone ella.

## Layout

| | Desktop | Mobile |
| --- | --- | --- |
| Padding | `--page-gutter` a los lados (`layout/gutter`, con tope en `layout/max-width`), `space/section/xl` abajo | ídem (valores Mobile) |
| Gap encabezado → contenido → acción | `space/gap/2xl` | `space/gap/xl` |
| `layout="split"` | encabezado y acción en una columna de `layout/measure` (acción a `space/gap/lg`), contenido a la derecha a `space/section/md` | apilado: encabezado, contenido, acción |
| Fondo | `color/bg/default` | ídem |

## Pendientes

- `TODO` (diseño): en `layout="split"` el Home separa las columnas con `space/section/md`, un token de separación entre bloques usado dentro de un bloque (DESIGN.md §5).
- El ajuste de padding al cambiar de fondo (DESIGN.md §2 · Cambio de fondo) no está: el Home no tiene secciones Dark. Se suma cuando una página lo necesite.
