# catalog-card · `<arq-catalog-card>`

Tapa de un catálogo en la página Catálogos: portada vertical, título y dos acciones (ver y descargar). No confundir con [download-card](../download-card/README.md) (en Descargas la tarjeta entera descarga un solo archivo, en horizontal y con bajada).

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
| slot `title` | — | Nombre del catálogo. Es el texto visible y entra en el nombre de cada acción («Ver …», «Descargar …») |
| slot `image` | — | `<img>` de la tapa, `alt=""`. Sin imagen, fondo `color/surface/subtle` |
| `href` | `href` | PDF. Ver lo abre en otra pestaña. Descargar, en el mismo sitio, lo baja; en otro dominio también se abre en otra pestaña |

- Sin `href` las dos acciones se ven y no navegan.
- Hover, Pressed y Focus no son props: `:hover`, `:active` y `:focus-visible` en cada acción.
- Las acciones son links, no `icon-button`: ese componente es un `<button>` y no lleva a una URL.

## Tokens

| Parte | Token |
| --- | --- |
| Tapa | ratio/portrait (7:10), fondo `color/surface/subtle` |
| Título | `role/body` en `color/text/primary`, a `space/gap/md` de la tapa |
| Acciones | `icon/eye` e `icon/download` en `icon/md`, color `color/icon/primary`, caja de icon-button Default, gap `space/gap/xs`, a `space/gap/sm` del título |
| Hover de la tapa | zoom `motion/scale/hover` dentro del recorte, `motion/duration/slow`. La card no cambia de tamaño. Sin zoom si el movimiento está reducido |
| Hover de ver y descargar | fondo `color/surface/hover` y el mismo zoom `motion/scale/hover` |
| Pressed | `motion/scale/pressed` |
| Foco | anillo `border/strong` en `color/border/focus`, separado 2 px |

## Pendientes

- `TODO` (diseño): no hay set en Figma. `icon/eye` no está en el set de íconos (1075:4571).
- `TODO` (datos): URL de cada PDF y tapas definitivas.
