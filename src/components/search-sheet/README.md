# search-sheet · `<arq-search-sheet>` (prueba)

Búsqueda del sitio como **top sheet**: un panel que baja desde arriba, a todo el ancho, con scrim. Barra (logo + cerrar), search-field `type="line"` y el contenido según los datos. Es la búsqueda del navbar en **Desktop, Tablet y Mobile**.

> **Componente de prueba, documentado en Figma desde el código (2026-10-15).** Set `search-sheet` (`2549:8722`) y ficha `doc/search-sheet`, en Componentes › 2 · Navegación › «Búsqueda · top sheet», con sus piezas como sets aparte: `search-field-line` (`type="line"`), `search-result-simple` (`type="simple"`) y `search-collection`. Falta la revisión de diseño (TODO).

```html
<arq-navbar>…</arq-navbar>   <!-- search="sheet" es el valor por defecto: el navbar lo arma y lo alimenta -->
```

```js
sheet.recommended = [{ name, href, image }];
sheet.results = { query: 'kanu', total: 5, href: '/arq/productos?q=kanu', items: [{ kind: 'product' | 'collection', name, href, image }] };
sheet.results = null;      // campo vacío: vuelven los recomendados
sheet.show(botonLupa);     // el foco vuelve a botonLupa al cerrar
```

## Estados (salen de los datos, no son props)

| Estado | Cuándo | Contenido |
| --- | --- | --- |
| Recomendados | `results` es null | Título, [search-card](../search-card/README.md) (imagen cuadrada y nombre, sin tipo de producto) en una fila con scroll, button Underline «Ver todos los productos» |
| Resultados | `results.items` con coincidencias | **Productos** ([search-result](../search-result/README.md) `type="simple"`: miniatura de 100, nombre en gris con lo que coincide en negro; 24 px entre filas) a la izquierda y, discretas, **Colecciones** ([search-collection](../search-collection/README.md): miniatura chica y nombre) a la derecha en Desktop; más search-see-all `type="simple"` al final: en Desktop debajo de Productos; en Tablet y Mobile al pie, después de Colecciones |
| Sin resultados | `results.items` vacío | `search-dropdown state="no-results"` |
| Error | `results.error` en true (la búsqueda falló) | `search-dropdown state="error"` (State=Error) |

Los títulos de grupo (Productos, Colecciones) no son encabezados (el componente no crea h1–h6): cada grupo es `role="group"` con su título como nombre (`aria-labelledby`). El campo es un combobox (`search-field combobox`) y anuncia la cantidad de resultados (prop `status`, la pone el navbar).

## Props

| Atributo | Valores |
| --- | --- |
| `open` | booleano. Mejor `show(opener)` y `close()` |
| `inline` | Solo demo: el panel queda en el flujo, abierto, sin scrim ni animación |
| `label` | Nombre del diálogo. Por defecto "Buscar" |
| `placeholder` | Por defecto "Buscar productos…" |
| `recommended-title` | Por defecto "Productos recomendados" |
| `all-href` · `all-label` | Link de los recomendados. Por defecto `/arq/productos` · "Ver todos los productos" |

- **Diálogo modal nativo** (`<dialog>` + `showModal()`): foco en el campo, Esc / cruz / clic en el scrim cierran y emiten `arq:close`. La página de atrás no se desplaza (`scroll-lock`).
- **Transición en capas** (menos de medio segundo, con `transition`; al cerrar, la misma al revés): la barra pasa de transparente a sólida, el panel se descubre como una persiana (un recorte, `clip-path`, como el mega-menu: no se anima el alto, DESIGN.md §6), el campo y el contenido bajan `space/gap/lg` a la par del panel, los productos llegan un instante después (fundido y `space/gap/sm` hacia abajo) y la página de atrás se aclara a medias con un velo `color/surface/faint` al 50 %. Detalle y tiempos en `search-sheet.css`. `close()` espera a que termine antes de cerrar el diálogo.
- **Arriba:** arranca en la barra del navbar (`--sheet-top`, lo pone el navbar): con announcement-bar a la vista, debajo de ella. El scrim arranca debajo de la barra (no oscurece la del navbar mientras la del sheet se vuelve sólida).
- **Cruz y lupa:** la cruz del sheet va en el lugar de la lupa del navbar; se funden una con otra (`motion/duration/fast`) al abrir y al cerrar.
- **Campo:** search-field `type="line" size="large" show-clear`: lo escrito en `role/heading-3`, el placeholder en Light y, con texto, la cruz chica que borra.
- **Recomendados:** search-card en `ratio/square` (1:1), con `space/gap/lg` entre ellas (`space/gap/md` en Mobile). Entran enteras 4 (5 desde 1600 px, 3 en Tablet, 2 en Mobile) y la siguiente asoma cortada en el margen derecho para mostrar que se desliza; el salto es de a una tarjeta (snap y botones) y la última termina contra el margen. Si el alto de la pantalla no alcanza (laptops), se suman columnas: las tarjetas se achican y siguen cuadradas. Se mide sin el teclado del teléfono, y en Mobile quedan siempre 2 (si no entran, el contenido scrollea). El alto del teclado va al pie del panel, debajo de «Ver todos»: el link sigue a las tarjetas con el mismo aire que hay entre el campo y el título. Si todas entran, no hay scroll ni tarjeta cortada. Los botones son `arq-carousel-button` `background="frosted"`. «Ver todos los productos» con `space/padding/2xl` abajo, como los «Ver todo…» del mega-menu.
- **Ver todos los resultados:** search-see-all `type="simple"`, siempre en 14.
- `over-photo` (lo pone el navbar): la barra estaba transparente sobre la foto del hero; el logo y la cruz arrancan en inverso y pasan a primary con la barra. Con la barra blanca, el sheet parte de ella sin saltos.
- Los eventos del campo (`arq:input`, `arq:submit`, `arq:navigate`) salen del componente; `field` devuelve el search-field e `items` los resultados en orden (para ↑ / ↓).
- **Responsive** por media query: Desktop desde 1024 px (6 tarjetas; Productos a la izquierda y Colecciones a la derecha), Tablet 768–1023 (4 tarjetas; grupos apilados) y Mobile hasta 767 (2 tarjetas, logo Small).

## En el navbar

`search="sheet"` (por defecto) o `search="inline"` (la versión anterior: campo en la barra con search-dropdown, y search-screen en Mobile). Los recomendados se piden a `getRecommendedProducts()` al acercarse a la lupa o al abrir (el catálogo tarda en cargar la primera vez); los resultados, a `searchProducts()` con debounce, como antes.

## Demo

`demo/index.html`, sección «search-sheet»: iframes de `demo/search-sheet.html` a 1440, 900 y 390 px (Recomendados, Resultados y Sin resultados), con datos de ejemplo. La búsqueda real se prueba con la lupa de los navbar de arriba.

## Tokens

Los chevrons aparecen con fundido `motion/duration/base` y desaparecen con `motion/duration/slow` (más lento, para que no se corten de golpe al sacar el mouse), con `motion/easing/standard`, sin escala ni desplazamiento. Al llegar a un extremo, el chevron que ya no sirve se va más rápido, con `motion/duration/fast` (no `slow`; con movimiento reducido, `fade`), para que no se haga un segundo clic pensando que sigue algo y se entre a la última card; la dirección deja de ser interactiva inmediatamente. Con movimiento reducido los dos pasan a `motion/duration/fade`.

La fila de Recomendados usa `arq-carousel-button` con los estilos originales y chevrons a ambos lados, centrados en la altura de las imágenes. Aparecen solo al hacer hover sobre la fila de tarjetas o al navegar con teclado (foco visible; un clic con el mouse no los deja fijos). Solo aparece cada dirección si hay contenido por recorrer de ese lado; si todo cabe, no hay botones. Cada clic avanza una tarjeta. Sin arrastre con mouse ni cursor grab; en táctil mantiene el scroll nativo. El clic en una tarjeta abre el producto.

| Parte | Token |
| --- | --- |
| Panel | fondo `color/surface/default`, sin sombra |
| Velo | `color/surface/faint` al 50 % (sin token de opacidad) |
| Movimiento | `motion/duration/fast` (120) · `base` (200) · `slow` (320) con `motion/easing/standard`; con `prefers-reduced-motion` valen 0 |
| Barra | alto `space/gap/md` × 2 + `icon/xl` (igual al navbar), margen `--page-gutter`; cruz: icon-button `size="large" background="none"` |
| Campo | padding superior `space/gap/md` (1rem) |
| Contenido | padding `space/gap/xl` arriba, `space/section/2xs` abajo, gap `space/gap/lg`; tarjetas con gap `space/gap/md`; link del pie «Ver todos los productos» con padding inferior `space/gap/lg` |
| Título | `role/label`, `color/text/tertiary` |
| Resultados | gap entre filas de productos `space/gap/lg` (24); columna de colecciones `layout/search-field`; gap entre grupos `space/section/2xs` |

## TODO

- Diseño en Figma (sheet en los tres anchos, y las variantes de search-field, search-result y search-collection).
- Criterio de «recomendados» (`getRecommendedProducts` en `src/data/catalog.js` toma hoy los primeros del catálogo con foto).
- Animación de cierre.
- Rendimiento: el catálogo tarda varios segundos en la primera carga; la búsqueda en vivo y los recomendados esperan ese tiempo.
