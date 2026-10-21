# navbar · `<arq-navbar>`

Barra de navegación de Macroled Arq, primer elemento de todas las páginas: logo, links de primer nivel y búsqueda.

- Figma: [753-2907](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=753-2907) · ficha `doc/navbar`

```html
<arq-navbar>
  <arq-nav-link slot="links" has-dropdown data-menu="products">Productos</arq-nav-link>
  <arq-nav-link slot="links" has-dropdown data-menu="recursos">Recursos</arq-nav-link>
  <arq-nav-link slot="links" href="/arq/nosotros">Nosotros</arq-nav-link>
  <arq-nav-link slot="links" href="/arq/contacto" current>Contacto</arq-nav-link>
</arq-navbar>

<arq-navbar theme="transparent">…</arq-navbar>   <!-- sobre el hero -->
```

## Props

| Figma | Atributo / slot | Prop JS | Valores · por defecto |
| --- | --- | --- | --- |
| — (links) | slot `links` | — | `arq-nav-link`. `has-dropdown` abre un panel: `data-menu="products"` (Productos) o `data-menu="recursos"` (Recursos). La página pone `current` en la sección actual |
| Theme | `theme` | `theme` | `default` · `transparent` (def. `default`) |
| Mode | `mode` | `mode` | Lo pone el componente: `default` · `search` · `menu` · `products` · `recursos` · `interior` · `exterior` · `lamparas-y-artefactos` · `colecciones`. No se escribe en el HTML |
| Breakpoint | — | — | Media query: hasta 767 px, logo Small, lupa y menú |
| — | `label` | `label` | Nombre del `<nav>`. Por defecto "Principal" |
| — (datos) | — | `navigation` | Árbol de `getNavigation()`. Si no se pasa, el navbar lo pide a `src/data/` al abrir Productos |

## Comportamiento

- **Productos (Desktop):** se abre al pasar el mouse por el nav-link (con teclado, al enfocarlo) y muestra el `arq-mega-menu` debajo de la barra (`aria-expanded` en el nav-link). Se cierra al salir del link y del panel, con Esc o con un clic afuera; el foco vuelve a Productos. El clic en el link no lo abre ni lo cierra. En una pantalla táctil (sin hover) sigue abriéndose con el clic.
- **Recursos (Desktop):** el mismo panel, con la misma apertura. A la izquierda, el título Recursos (`role/heading-1`, igual que Interior y Exterior) y debajo Catálogos (`/arq/catalogos`) y Descargas (`/arq/descargas`) en `arq-mega-link` (el mismo de Embutir y Colgante: fila con línea, fondo en hover y flecha); a la derecha, una foto de ancho 2 × `layout/mega-menu-image` y alto mínimo del preview de Productos (`slot="recursos-media"`). Sin foto, el lugar queda en `color/surface/subtle`. La columna de links ocupa el resto. En Tablet su mínimo pasa a `layout/catalog-nav` para que la foto siga ocupando el resto.
- **Búsqueda (Desktop):** la lupa se reemplaza por `arq-search-field` (ancho `layout/search-field`) con el foco adentro. Al escribir aparece `arq-search-dropdown` debajo, con hasta 5 resultados y "Ver todos los resultados". ↑ / ↓ marcan el resultado activo (el foco sigue en el campo), Enter lo abre (o va a `/arq/productos?q=` si no hay activo). Esc cierra el dropdown y después la búsqueda; la cruz cierra.
- **Mobile:** el menú es un diálogo modal a pantalla completa (Mode=Menu) con los nav-link apilados; el foco arranca en cerrar. Productos entra al submenú (Mode=Products, set 841:2325): volver y una fila por nivel (Interior, Exterior, Lámparas y artefactos, Colecciones; `arq-mega-link submenu`, chevron-right). Un nivel sin datos no aparece. Cada fila entra a su nivel (Mode Interior · Exterior · Lámparas y artefactos · Colecciones): volver con el nombre del nivel, links en `arq-mega-link` Size=Large y "Ver todo…" al pie; Colecciones con miniatura, la lista se desplaza y "Ver todo" queda fijo abajo (frame 2295:23605). Lámparas y artefactos (set 2312:8904) tiene dos grupos, Lámparas y Artefactos: cada uno con su eyebrow (role/label en `color/text/tertiary`), un link por producto con miniatura (la foto de estudio) y su "Ver todo…" (→); la lista entera se desplaza, con los dos "Ver todo…" adentro. Recursos entra a su submenú (Mode=Recursos): volver y los dos links en `arq-mega-link` Size=Large (Catálogos y Descargas), sin la foto. Esc vuelve un paso; al volver, el foco queda en la fila de la que se salió. La lupa abre `arq-search-screen`.
- **Transparent:** fondo `color/overlay/translucent` con `blur/backdrop`; logo, nav-links (Theme=Inverse) e íconos en inverso. Sigue transparente mientras la barra está sobre el hero (el primer `<arq-hero>` de la página) y pasa a Default al dejarlo atrás; sin hero, al empezar a desplazar la página. Con la búsqueda abierta (Desktop) sigue sobre la foto, con `arq-search-field` en blanco (como en Default). La lupa y el menú van en Dark local (`data-arq-theme="dark"`) sobre la foto: ícono claro y hover y foco oscuros, sin el cuadrado claro de `color/surface/hover`. Pasa a Default con el menú mobile o el mega-menu abiertos, y siempre con `prefers-reduced-transparency: reduce` o `prefers-contrast: more` (el texto claro sobre la foto puede no leerse).
- **Posición:** sticky arriba en los dos Theme. Transparent queda encima del hero con un margen inferior negativo (su alto, 56). Si arriba hay un `<arq-announcement-bar>`, el navbar arranca debajo y se pega arriba cuando la barra se va con el scroll.
- **Datos:** navegación y búsqueda salen de `src/data/catalog.js` (decisión 2026-10-02 · navbar).
- **Dark (Iluminar en la ficha):** `data-arq-theme="dark"` en el `<arq-navbar>` (DESIGN.md §2).

## Tokens

| Parte | Token |
| --- | --- |
| Barra | alto 56 (`space/gap/md` × 2 + `icon/xl`), padding lateral `layout/gutter`, fondo `color/surface/default`, línea inferior `border/default` en `color/border/subtle` |
| Links | gap `space/gap/xl` |
| Transparent | `color/overlay/translucent` + `blur/backdrop`; `color/text/inverse` y `color/icon/inverse` |
| Búsqueda | `layout/search-field` (campo y dropdown) |
| Submenú mobile | volver `role/body-medium` en `color/text/secondary`, padding `space/gap/sm` × `layout/gutter`; grupos con `space/gap/md` arriba y `space/padding/md` abajo; abajo del menú `space/gap/xl` |

## Pendientes

- icon-button no tiene Theme=Inverse: sobre la foto se usa Dark local (hover `color/surface/hover` en Dark), como dice la descripción del set.
- `TODO` (diseño) Confirmar la posición: sticky en Default y en Transparent (encima del hero).
- `TODO` (diseño) Foco sobre la foto (Transparent): `color/border/focus` se ve poco sobre una foto oscura.


## Búsqueda: top sheet (prueba)

`search` (valores: `sheet` por defecto, `inline`). Por defecto la lupa abre el [search-sheet](../search-sheet/README.md) en Desktop, Tablet y Mobile, en todas las páginas. `search="inline"` vuelve a la versión anterior: en Desktop el campo reemplaza a la lupa con search-dropdown, y en Mobile abre search-screen. No existe en Figma.
