# navbar · `<arq-navbar>`

Barra de navegación de Macroled Arq, primer elemento de todas las páginas: logo, links de primer nivel y búsqueda.

- Figma: [753-2907](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=753-2907) · ficha `doc/navbar`

```html
<arq-navbar>
  <arq-nav-link slot="links" has-dropdown>Productos</arq-nav-link>
  <arq-nav-link slot="links" href="/arq/glosario">Glosario</arq-nav-link>
  <arq-nav-link slot="links" href="/arq/contacto" current>Contacto</arq-nav-link>
</arq-navbar>

<arq-navbar theme="transparent">…</arq-navbar>   <!-- sobre el hero -->
```

## Props

| Figma | Atributo / slot | Prop JS | Valores · por defecto |
| --- | --- | --- | --- |
| — (links) | slot `links` | — | `arq-nav-link`. El que tiene `has-dropdown` abre Productos. La página pone `current` en la sección actual |
| Theme | `theme` | `theme` | `default` · `transparent` (def. `default`) |
| Mode | `mode` | `mode` | Lo pone el componente: `default` · `search` · `menu` · `products`. No se escribe en el HTML |
| Breakpoint | — | — | Media query: hasta 767 px, logo Small, lupa y menú |
| — | `label` | `label` | Nombre del `<nav>`. Por defecto "Principal" |
| — (datos) | — | `navigation` | Árbol de `getNavigation()`. Si no se pasa, el navbar lo pide a `src/data/` al abrir Productos |

## Comportamiento

- **Productos (Desktop):** abre el `arq-mega-menu` debajo de la barra (`aria-expanded` en el nav-link). Esc o un clic afuera lo cierran; el foco vuelve a Productos.
- **Búsqueda (Desktop):** la lupa se reemplaza por `arq-search-field` (ancho `layout/search-field`) con el foco adentro. Al escribir aparece `arq-search-dropdown` debajo, con hasta 5 resultados y "Ver todos los resultados". ↑ / ↓ marcan el resultado activo (el foco sigue en el campo), Enter lo abre (o va a `/arq/buscar?q=` si no hay activo). Esc cierra el dropdown y después la búsqueda; la cruz cierra.
- **Mobile:** el menú es un diálogo modal a pantalla completa (Mode=Menu) con los nav-link apilados; el foco arranca en cerrar. Productos entra al submenú (Mode=Products): volver, un `arq-mega-link` Type=Group por sección (Interior, Exterior, Lámparas, Artefactos) y "Ver colecciones". Esc vuelve un paso. La lupa abre `arq-search-screen`.
- **Transparent:** fondo `color/overlay/translucent` con `blur/backdrop`; logo, nav-links (Theme=Inverse) e íconos en inverso. Pasa a Default al desplazar la página y con un menú o la búsqueda abiertos.
- **Posición:** sticky arriba en Default; fixed en Transparent, encima del hero.
- **Datos:** navegación y búsqueda salen de `src/data/catalog.js` (decisión 2026-10-02 · navbar). Con `VITE_DATA_SOURCE=mock` usa el catálogo de ejemplo.
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

- `TODO` (diseño) Las variantes Transparent de Menu, Search y Products del set tienen otra estructura (desactualizadas). Se usa la versión Default con un menú o la búsqueda abiertos.
- `TODO` (diseño) Confirmar la posición: sticky en Default y fixed en Transparent.
- `TODO` (diseño) Foco sobre la foto (Transparent): `color/border/focus` se ve poco sobre una foto oscura.
