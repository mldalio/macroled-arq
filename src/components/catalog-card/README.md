# catalog-card · `<arq-catalog-card>`

Tapa de un catálogo en la página Catálogos: portada vertical y título. La tapa abre el PDF en otra pestaña. No confundir con [download-card](../download-card/README.md) (en Descargas la tarjeta entera descarga un solo archivo, en horizontal y con bajada).

Sin set en Figma. Sale de la página `/arq/catalogos` (`docs/decisiones.md`, 2026-10-21 · Catálogos).

```html
<arq-catalog-card href="/archivos/catalogo-general-2026.pdf">
  <img slot="image" src="/img/tapa.jpg" alt="" loading="lazy">
  <span slot="title">Catálogo general 2026</span>
</arq-catalog-card>
```

## Props

| Atributo | Prop JS | Valores |
| --- | --- | --- |
| slot `title` | — | Nombre del catálogo, debajo de la tapa. También nombra el link de la tapa («Ver …») |
| slot `image` | — | `<img>` de la tapa, `alt=""`. Sin imagen, fondo `color/surface/subtle` |
| `href` | `href` | PDF. La tapa lo abre en otra pestaña |

- Sin `href` la tapa no navega.
- Hover y Focus no son props: `:hover` en la tapa y `:focus-visible` en el link.

## Tokens

| Parte | Token |
| --- | --- |
| Tapa | ratio/portrait (7:10), fondo `color/surface/subtle` |
| Título | `role/body` en `color/text/primary`, a `space/gap/md` de la tapa |
| Hover de la tapa | zoom `motion/scale/hover` dentro del recorte, `motion/duration/slow`. La card no cambia de tamaño. Sin zoom si el movimiento está reducido |
| Foco | anillo `border/strong` en `color/border/focus`, separado 2 px |

## Pendientes

- `TODO` (diseño): no hay set en Figma.
