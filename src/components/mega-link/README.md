# mega-link · `<arq-mega-link>`

Link del mega-menu (Desktop) y del submenú de Productos (navbar Mobile).

- Figma: [840-2070](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=840-2070) · ficha `doc/mega-link`

```html
<arq-mega-link href="…" show-arrow>Jardín</arq-mega-link>
<arq-mega-link href="…" show-arrow>Kanu<span slot="meta">Jardín · Pared</span></arq-mega-link>
<arq-mega-link type="group">Interior
  <a slot="links" href="…">Embutir</a>
  <arq-button slot="links" type="underline" show-underline href="…">Ver todo</arq-button>
</arq-mega-link>
```

## Props

| Figma | Atributo / slot | Prop JS | Valores · por defecto |
| --- | --- | --- | --- |
| Name | slot por defecto | — | Nombre del destino |
| Meta · Show meta | slot `meta` | — | Bajada (colecciones). Sin contenido no se muestra |
| Show arrow | `show-arrow` | `showArrow` | booleano. **En Figma viene en `true`; en código hay que escribirlo.** La flecha se ve solo en Hover y Focus |
| Show image | `show-image` | `showImage` | booleano: miniatura de 60 × 60 al final de la fila (submenú mobile de Colecciones) |
| — | `image` | `image` | URL de la miniatura. Sin imagen: `color/surface/subtle` |
| — | `submenu` | `submenu` | booleano, solo de código: la fila abre un submenú del menú mobile (`<button>` con chevron-right siempre visible). Se lee al conectarse |
| Type | `type` | `type` | `link` · `group` (def. `link`). Se lee al conectarse |
| Size | `size` | `size` | `default` · `large` (def. `default`). Default en el mega-menu y en la lista de Productos mobile, Large en los submenús mobile |
| Open | `open` | `open` | booleano · solo Group |
| — | `href` | `href` | Destino (Link) |
| — (links del Group) | slot `links` | — | `<a>` y el "Ver todo" (button Underline) |

- **Link:** un `<a>`; Hover con fondo `color/surface/hover` y Focus con anillo (DESIGN.md §7). La flecha es decorativa y aparece en Hover y Focus (frames 2295:23636 y 2295:23730).
- **Group:** `<button aria-expanded aria-controls>` (disclosure base) con + / –; abierto muestra los links (`role/body-lg`, padding `space/gap/sm`).
- Nombre del Group en `role/body-xl`, como el set (la ficha dice `role/body-lg`: manda el set).

## Tokens

| Parte | Token |
| --- | --- |
| Fila Link | Default: padding vertical `space/gap/sm-md` (con bajada `space/gap/sm`), gap `space/gap/md` · Large y submenu: padding vertical `space/gap/md`, gap `space/gap/sm` · línea inferior `color/border/subtle` |
| Nombre · bajada | `role/body-xl` · `role/body-compact-regular` pegada (Large y submenu: `role/heading-3` · `role/caption` a `space/gap/xs`); nombre en `color/text/primary`, bajada en `color/text/tertiary` |
| Miniatura | 60 × 60 (`layout/search-thumb` + `space/gap/sm-md`), fondo `color/surface/subtle` |
| Flecha · + / – | `icon/md` en `color/icon/primary` |
| Group | padding vertical `space/gap/md`, nombre `role/body-xl` |

## Pendientes

- `TODO` (token) La miniatura (60) y el padding de la fila con bajada (10, filas de 68) no tienen token: se arman con los más cercanos.
- Estilos (set actualizado el 2026-10-14): Default `role/body-xl` (frames finales del mega-menu), Large y submenu `role/heading-3` (decisión 2026-10-14 · Textos del menú mobile). La bajada de Colecciones Desktop no tiene estilo `role/*` en los frames (14 px): se usa `role/body-compact-regular`, también en el set.
