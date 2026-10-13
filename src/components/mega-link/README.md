# mega-link · `<arq-mega-link>`

Link del mega-menu (Desktop) y del submenú de Productos (navbar Mobile).

- Figma: [840-2070](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=840-2070) · ficha `doc/mega-link`

```html
<arq-mega-link href="…" show-arrow>Jardín</arq-mega-link>
<arq-mega-link href="…" show-arrow>Kanu<span slot="meta">Jardín · Pared</span></arq-mega-link>
<arq-mega-link size="large" show-image image="…" href="…">Mini Kai Round</arq-mega-link>
<arq-mega-link button show-arrow icon="chevron-right">Interior</arq-mega-link>   <!-- entra a un submenú -->
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
| Show arrow | `show-arrow` | `showArrow` | booleano. **En Figma viene en `true`; en código hay que escribirlo** |
| Show image · imagen | `show-image` · `image` | `showImage` · `image` | booleano · URL de la miniatura. Sin URL (o si falla) queda el cuadrado `color/surface/subtle`, como en Figma. **En Figma viene en `false`** |
| — (ícono de la flecha) | `icon` | `icon` | nombre de `src/base/icons.js` (def. `arrow-right`). Entrar a un submenú usa `chevron-right` |
| — (entrar a un submenú) | `button` | `button` | booleano. Dibuja la fila como `<button>` en lugar de `<a>` (sin `href`): el padre escucha el click |
| Type | `type` | `type` | `link` · `group` (def. `link`). Se lee al conectarse |
| Size | `size` | `size` | `default` · `large` (def. `default`). **Son los dos únicos tamaños del set** (2026-10-13: se quitaron XL y Small de Figma). Large en las columnas Por espacio y Lámparas y artefactos del mega-menu y en los submenús mobile; Default en Colecciones del mega-menu y en la lista de Productos mobile |
| Open | `open` | `open` | booleano · solo Group |
| — | `href` | `href` | Destino (Link) |
| — (links del Group) | slot `links` | — | `<a>` y el "Ver todo" (button Underline) |

- **Link:** un `<a>`; Hover con fondo `color/surface/hover` y Focus con anillo (DESIGN.md §7). La flecha es decorativa.
- **Group:** `<button aria-expanded aria-controls>` (disclosure base) con + / –; abierto muestra los links (`role/body-lg`, padding `space/gap/sm`).
- Nombre del Group en `role/body-xl`, como el set (la ficha dice `role/body-lg`: manda el set).

## Tokens

| Parte | Token |
| --- | --- |
| Fila Link | padding vertical `space/gap/md` (el set lo subió de `space/gap/sm`), gap `space/gap/sm`, línea inferior `color/border/subtle` |
| Miniatura (Show image) | cuadrada, `color/surface/subtle` de fondo; `layout/table-thumb` (56) |
| Nombre · bajada | `role/body` (Large `role/body-lg`) en `color/text/primary` · `role/caption` en `color/text/tertiary`, gap `space/gap/xs` |
| Flecha · + / – | `icon/md` en `color/icon/primary` |
| Group | padding vertical `space/gap/md`, nombre `role/body-xl` |

## Pendientes

- `TODO` (token) La miniatura mide 60 en Figma y no hay token: se usa `layout/table-thumb` (56), el más cercano.
- `TODO` (datos) Los links del submenú mobile no traen imagen en `getNavigation()`: se ve el cuadrado `color/surface/subtle`.
