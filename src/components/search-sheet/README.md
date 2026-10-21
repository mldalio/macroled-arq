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
- **Transición en capas** (menos de medio segundo, con `transition`; al cerrar, la misma al revés): la barra pasa de transparente a sólida, el panel se abre como una persiana (`grid-template-rows` 0fr → 1fr), el campo y el contenido bajan `space/gap/lg` a la par del panel, los productos llegan un instante después (fundido y `space/gap/sm` hacia abajo) y la página de atrás se aclara a medias con un velo `color/surface/faint` al 50 %. Detalle y tiempos en `search-sheet.css`. `close()` espera a que termine antes de cerrar el diálogo.
- **Arriba:** arranca en la barra del navbar (`--sheet-top`, lo pone el navbar): con announcement-bar a la vista, debajo de ella. El scrim arranca debajo de la barra (no oscurece la del navbar mientras la del sheet se vuelve sólida).
- **Cruz y lupa:** la cruz del sheet va en el lugar de la lupa del navbar; se funden una con otra (`motion/duration/fast`) al abrir y al cerrar.
- **Campo:** search-field `type="line" size="large" show-clear`: lo escrito en `role/heading-3`, el placeholder en Light y, con texto, la cruz chica que borra.
- **Recomendados:** search-card en `ratio/landscape` (5:4); la fila va a sangre a la derecha (llega al borde de la pantalla y el margen aparece al final del scroll). «Ver todos los productos» con `space/padding/2xl` abajo, como los «Ver todo…» del mega-menu.
- **Ver todos los resultados:** search-see-all `type="simple"`, siempre en 14.
- `over-photo` (lo pone el navbar): la barra estaba transparente sobre la foto del hero; el logo y la cruz arrancan en inverso y pasan a primary con la barra. Con la barra blanca, el sheet parte de ella sin saltos.
- Los eventos del campo (`arq:input`, `arq:submit`, `arq:navigate`) salen del componente; `field` devuelve el search-field e `items` los resultados en orden (para ↑ / ↓).
- **Responsive** por media query: Desktop desde 1024 px (6 tarjetas; Productos a la izquierda y Colecciones a la derecha), Tablet 768–1023 (4 tarjetas; grupos apilados) y Mobile hasta 767 (2 tarjetas, logo Small).

## En el navbar

`search="sheet"` (por defecto) o `search="inline"` (la versión anterior: campo en la barra con search-dropdown, y search-screen en Mobile). Los recomendados se piden a `getRecommendedProducts()` al acercarse a la lupa o al abrir (el catálogo tarda en cargar la primera vez); los resultados, a `searchProducts()` con debounce, como antes.

## Demo

`demo/index.html`, sección «search-sheet»: iframes de `demo/search-sheet.html` a 1440, 900 y 390 px (Recomendados, Resultados y Sin resultados), con datos de ejemplo. La búsqueda real se prueba con la lupa de los navbar de arriba.

## Tokens

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
- Animación de cierre, flechas del carrusel de recomendados.
- Rendimiento: el catálogo tarda varios segundos en la primera carga; la búsqueda en vivo y los recomendados esperan ese tiempo.
