# product-card · `<arq-product-card>`

Tarjeta de producto (Productos) o de colección (Colecciones, página de colección), siempre vertical con imagen 7:10. Toda la tarjeta es un link; "Comparar" queda fuera del link.

- Figma: [990-2372](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=990-2372) · ficha `doc/product-card` (`1430:2371`)

```html
<!-- Productos: con Comparar -->
<arq-product-card href="/arq/producto/kanu-jardin" show-compare
  image="…/principal.jpg" image-hover="…/principal-on.jpg"
  image-lit="…/principal-on.jpg" image-hover-lit="…/ambiente-1-on.jpg">
  <h3 slot="name">Kanu Jardín</h3>
  <!-- Con más de un acabado: el elegido lleva selected; lo que cambia al elegir, en data-* -->
  <arq-swatch slot="finishes" selected src="…/negro.png" data-sku="KANU-J-N" data-href="/arq/producto/kanu-jardin?sku=KANU-J-N"
    data-image="…/principal.jpg" data-image-hover="…/principal-on.jpg"
    data-image-lit="…/principal-on.jpg" data-image-hover-lit="…/ambiente-1-on.jpg">Negro</arq-swatch>
  <arq-swatch slot="finishes" src="…/verde.png" data-sku="KANU-J-V" data-href="…?sku=KANU-J-V" data-image="…">Verde</arq-swatch>
</arq-product-card>

<!-- Colecciones: con Meta, sin Comparar -->
<arq-product-card href="/arq/productos?collection=kanu" image="…">
  <h3 slot="name">Kanu</h3>
  <span slot="meta">Exterior · Jardín · Pared</span>
</arq-product-card>
```

## Props y slots

| Figma | Atributo / slot | Prop JS | Valores · por defecto |
| --- | --- | --- | --- |
| Name | slot `name` | — | `<h3>` con el nombre: es lo que lleva el link |
| Meta · Show meta | slot `meta` | — | Tipo o datos técnicos, hasta 2 líneas. Sin contenido no se muestra |
| Show finishes | slot `finishes` | — | `arq-swatch`; el tamaño lo pone la tarjeta: siempre Small (16 × 16), en Large y en Small. Sin contenido no se muestra. Con más de uno y `data-*` son elegibles (ver Acabados elegibles) |
| Show compare | `show-compare` | `showCompare` | booleano: checkbox "Comparar" |
| — | `compared` | `compared` | booleano: "Comparar" marcado |
| Size | `size` | `size` | `large` · `small`. Por defecto `large`. Large pasa sola al aspecto Small hasta 767 px |
| — | `href` | `href` | Destino (la ficha con `?sku=` si hay filtros, decisión 2026-10-02 · Listados) |
| — (imagen) | `image` · `image-hover` · `image-lit` · `image-hover-lit` | `image` · `imageHover` · `imageLit` · `imageHoverLit` | Principal apagada; hover sin Iluminar (principal encendida); principal encendida; hover con Iluminar (ambiente 1 encendido) (DESIGN.md §8) |
| State=Loading | `loading` | `loading` | booleano: card de carga (skeleton), sin slots ni imágenes |

- **No son props:** State=Hover y State=Focus (CSS).
- **Link estirado** (`src/base/card-link.css`): el `<a>` envuelve solo el nombre; su `::after` cubre la tarjeta, también la imagen. El foco rodea la tarjeta. "Comparar" y los acabados van por encima del link.
- **Imágenes** (DESIGN.md §8): en reposo, la principal apagada; con hover sobre la imagen o foco, la principal encendida (con Iluminar: reposo la principal encendida y hover el ambiente 1 encendido; sobre el nombre o «Comparar» la imagen no cambia), con un fundido entre dos `<img>` (`motion/duration/slow`, instantáneo con movimiento reducido). Dentro de un bloque con `data-arq-theme="dark"` (Iluminar) pasa a las encendidas (`src/base/theme.js`). En táctiles no hay hover. Aplica también a Size=Small (decisión 2026-10-02 · product-card).
- **Faltantes:** sin imagen de hover no hay cambio; sin encendida queda la apagada; sin principal, fondo `color/surface/subtle` con el nombre.
- **Carga:** solo la imagen visible de entrada (`loading="lazy"`); la de hover al primer hover o foco; las encendidas al activar Iluminar. Las imágenes son decorativas (`alt=""`): el nombre lo da el link.
- **Acabados elegibles:** con más de un swatch y datos por acabado (`data-sku`, `data-href`, `data-image`, `data-image-hover`, `data-image-lit`, `data-image-hover-lit`; `appendFinishes(card, finishes)` los arma desde `src/data/catalog.js`) los swatches pasan a `role="radio"` dentro de un `radiogroup` «Acabado». El elegido (`selected`, por defecto el primero: negro) lleva el State=Selected del swatch (borde `border/strong`) y todos el State=Hover; **no crece**: siempre Small (16). Elegir uno (clic, Enter, Espacio o flechas) cambia las cuatro imágenes y el `href` a los de esa variante (la foto nueva se pide antes y se cambia cuando está lista) y emite `arq:finish { name, sku, href, image }`; el listado lo usa para que «Comparar» y la compare-bar tomen el SKU del acabado que se ve. Con **un solo acabado** no hay elegido ni se puede elegir. Un acabado sin fotos muestra el fondo con el nombre. Los swatches van por encima del link estirado: el clic no navega. **Muchos acabados** (decisión 2026-10-26): bajan a otra línea en vez de salirse de la card; en Large ocupan como mucho la mitad de la fila (alineados a la derecha), así el nombre no se corta a mitad de palabra. La fila suma `space/padding/xs` arriba y abajo con margen negativo (no cambia el dibujo): un toque al lado de una muestra de 16 cae en la fila y no abre la ficha.
- **Foto que no carga** (404 en la base): la card la recuerda y no la vuelve a pedir. Si era la encendida, usa la apagada; si era la principal, queda el fondo con el nombre (también después de Iluminar o del primer hover).
- **Cargando** (`loading`, decisiones.md 2026-10-20 · Cards de carga): la misma geometría que la card que la reemplaza, en `color/surface/subtle`, como las filas de carga de Descargas (2564:21523), con un **shimmer**: una franja de brillo (`color/surface/default`; en Dark `color/surface/strong`) cruza los bloques en diagonal cada `motion/duration/shimmer` (1600 ms), lineal. El degradé es uno solo para toda la pantalla (`background-attachment: fixed`), así pasa parejo por todas las cards (en iOS Safari cada bloque lleva su franja). Con movimiento reducido, fija. Bloque 7:10 (el fondo de la imagen), una barra para el nombre con tres muestras de `swatch/sm` y una barra corta para «Comparar» (con `show-compare`) o la meta. Cada barra va en una línea con el alto de línea de su texto (`1lh` del `role/*`), así el alto de la card no cambia al llegar los datos. Lleva `aria-hidden`: el aviso «Cargando…» lo da quien la usa. Figma: `State=Loading` (Large y Small).
- **Primera foto:** la principal funde al llegar (`motion/duration/slow`, `motion/easing/standard`; con movimiento reducido, `motion/duration/fade`). Si ya estaba en la caché aparece directo; al cambiar de acabado o con Iluminar no hay fundido de entrada.
- **Evento:** `arq:compare { checked }` al marcar o desmarcar "Comparar" (la página arma la compare-bar).
- **Nombre accesible de «Comparar»:** se ve «Comparar», pero el lector lee «Comparar <nombre>» (texto oculto con el nombre del slot `name`): en un listado cada checkbox se distingue.
- **Grilla:** la tarjeta toma el ancho de su columna. En el listado: `repeat(auto-fill, minmax(var(--arq-layout-card-min), 1fr))` y `layout/card-min-wide` desde 1600 px (DESIGN.md §2).

## Tokens

| Parte | Token |
| --- | --- |
| Imagen | `ratio/portrait` (7:10; un contenedor puede cambiarla con la variable local `--card-ratio`, como el search-sheet con `ratio/square`), sin borde (como el set; la ficha dice `color/border/subtle`). La foto llena el recuadro. En Fuji, Mini Kai, Mini Kai Round, Sen y en el producto Tori Visera se muestra entera (`object-fit: contain`; `TODO` diseño: no está en Figma). Detrás de la foto, el mismo fondo que la imagen de la ficha: `color/surface/subtle` (con Iluminar pasa al gris oscuro de ese token, en el fundido de la página). En hover y foco, con Iluminar apagado, el fondo es ese mismo negro (`color/surface/inverse-hover`, neutral/750) |
| Gap imagen–info | `space/gap/md` (Small `space/gap/sm`) |
| Info | padding `space/gap/xs` arriba y `space/gap/sm` abajo, gap `space/gap/xs` (Small `space/gap/md`) |
| Título | Large: nombre y acabados en fila, gap `space/gap/sm`. Small (y Large hasta 767 px): en **columna**, el nombre arriba y los acabados debajo, gap `space/gap/sm` |
| Nombre | `role/heading-3` (Small `role/body-xl`; en Mobile `role/heading-3`, que también vale 20/28) en `color/text/primary` |
| Meta | `role/body` (Small `role/body-sm`) en `color/text/secondary`, hasta 2 líneas |
| Acabados | gap `space/gap/xs` (Small `space/gap/sm`); swatch Small (16) en Large y en Small, elegible con Selected y Hover del swatch (decisiones.md, 2026-10-19 · Acabados de la card a 16 px y Elegir acabado en la card) |
| Cargando | bloques `color/surface/subtle`; barras de `space/gap/md` (nombre) y `space/gap/sm-md` (detalle); muestras de `swatch/sm`; shimmer `color/surface/default` (Dark `color/surface/strong`) cada `motion/duration/shimmer` |
| Sin imagen | nombre en `role/body-sm`, `color/text/secondary` (con `text/tertiary` no llega a 4.5 en Dark) |
| Fundido | `motion/duration/slow` + `motion/easing/standard` |
| Foco | `border/strong` en `color/border/focus`, separado 2 px |

## Pendientes

- `TODO` (datos) De dónde salen las imágenes de hover de una card de colección (hoy solo `img_collection` y `img_collection_on`).
- `TODO` (datos) El texto de Meta: valores de `VARIANT_ATTRIBUTES` + una o dos características fijas (decisión 2026-10-02 · Cards).
