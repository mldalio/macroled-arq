# product-card · `<arq-product-card>`

Tarjeta de producto (Productos) o de colección (Colecciones, página de colección), siempre vertical con imagen 7:10. Toda la tarjeta es un link; "Comparar" queda fuera del link.

- Figma: [990-2372](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=990-2372) · ficha `doc/product-card` (`1430:2371`)

```html
<!-- Productos: con Comparar -->
<arq-product-card href="/arq/producto/kanu-jardin" show-compare
  image="…/estudio.jpg" image-hover="…/contexto.jpg"
  image-lit="…/estudio-on.jpg" image-hover-lit="…/contexto-on.jpg">
  <h3 slot="name">Kanu Jardín</h3>
  <arq-swatch slot="finishes" src="…/negro.jpg">Negro</arq-swatch>
</arq-product-card>

<!-- Colecciones: con Meta, sin Comparar -->
<arq-product-card href="/arq/coleccion/kanu" image="…">
  <h3 slot="name">Kanu</h3>
  <span slot="meta">Exterior · Jardín · Pared</span>
</arq-product-card>
```

## Props y slots

| Figma | Atributo / slot | Prop JS | Valores · por defecto |
| --- | --- | --- | --- |
| Name | slot `name` | — | `<h3>` con el nombre: es lo que lleva el link |
| Meta · Show meta | slot `meta` | — | Tipo o datos técnicos, hasta 2 líneas. Sin contenido no se muestra |
| Show finishes | slot `finishes` | — | `arq-swatch`; el tamaño lo pone la tarjeta (Default en Large, Small en Small). Sin contenido no se muestra |
| Show compare | `show-compare` | `showCompare` | booleano: checkbox "Comparar" |
| — | `compared` | `compared` | booleano: "Comparar" marcado |
| Size | `size` | `size` | `large` · `small`. Por defecto `large`. Large pasa sola al aspecto Small hasta 767 px |
| — | `href` | `href` | Destino (la ficha con `?sku=` si hay filtros, decisión 2026-10-02 · Listados) |
| — (imagen) | `image` · `image-hover` · `image-lit` · `image-hover-lit` | `image` · `imageHover` · `imageLit` · `imageHoverLit` | Estudio y contexto, con la luz apagada y encendida (DESIGN.md §8) |

- **No son props:** State=Hover y State=Focus (CSS).
- **Link estirado** (`src/base/card-link.css`): el `<a>` envuelve solo el nombre; su `::after` cubre la tarjeta. El foco rodea la tarjeta. "Comparar" va por encima del link.
- **Imágenes** (DESIGN.md §8): en reposo, estudio; con hover sobre la imagen o foco, contexto (sobre el nombre o «Comparar» la imagen no cambia), con un fundido entre dos `<img>` (`motion/duration/slow`, instantáneo con movimiento reducido). Dentro de un bloque con `data-arq-theme="dark"` (Iluminar) pasa a las encendidas (`src/base/theme.js`). En táctiles no hay hover. Aplica también a Size=Small (decisión 2026-10-02 · product-card).
- **Faltantes:** sin contexto no hay cambio; sin encendida queda la apagada; sin estudio, fondo `color/surface/subtle` con el nombre.
- **Carga:** solo la imagen visible de entrada (`loading="lazy"`); la de hover al primer hover o foco; las encendidas al activar Iluminar. Las imágenes son decorativas (`alt=""`): el nombre lo da el link.
- **Evento:** `arq:compare { checked }` al marcar o desmarcar "Comparar" (la página arma la compare-bar).
- **Grilla:** la tarjeta toma el ancho de su columna. En el listado: `repeat(auto-fill, minmax(var(--arq-layout-card-min), 1fr))` y `layout/card-min-wide` desde 1600 px (DESIGN.md §2).

## Tokens

| Parte | Token |
| --- | --- |
| Imagen | `ratio/portrait` (7:10), fondo `color/surface/subtle`, sin borde (como el set; la ficha dice `color/border/subtle`) |
| Gap imagen–info | `space/gap/md` (Small `space/gap/sm`) |
| Info | padding `space/gap/xs` arriba y `space/gap/sm` abajo, gap `space/gap/xs` |
| Nombre | `role/heading-3` (Small `role/body-regular`) en `color/text/primary` |
| Meta | `role/body` (Small `role/body-sm`) en `color/text/secondary`, hasta 2 líneas |
| Acabados | gap `space/gap/xs`; swatch Default (20) en Large, Small (16) en Small (el set; la ficha dice Small en los dos) |
| Sin imagen | nombre en `role/body-sm`, `color/text/secondary` (con `text/tertiary` no llega a 4.5 en Dark) |
| Fundido | `motion/duration/slow` + `motion/easing/standard` |
| Foco | `border/strong` en `color/border/focus`, separado 2 px |

## Pendientes

- `TODO` (diseño) Qué columnas de la base son la foto de estudio y la de contexto (`docs/typesense-schema.md`, Imágenes de product-card), y de dónde salen las cuatro de una card de colección.
- `TODO` (datos) El texto de Meta: valores de `VARIANT_ATTRIBUTES` + una o dos características fijas (decisión 2026-10-02 · Cards).
