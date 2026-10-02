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
| Show arrow | `show-arrow` | `showArrow` | booleano. **En Figma viene en `true`; en código hay que escribirlo** |
| Type | `type` | `type` | `link` · `group` (def. `link`). Se lee al conectarse |
| Size | `size` | `size` | `default` · `large` (def. `default`). Default en el mega-menu, Large en el submenú mobile |
| Open | `open` | `open` | booleano · solo Group |
| — | `href` | `href` | Destino (Link) |
| — (links del Group) | slot `links` | — | `<a>` y el "Ver todo" (button Underline) |

- **Link:** un `<a>`; Hover con fondo `color/surface/hover` y Focus con anillo (DESIGN.md §7). La flecha es decorativa.
- **Group:** `<button aria-expanded aria-controls>` (disclosure base) con + / –; abierto muestra los links (`role/body-lg`, padding `space/gap/sm`).
- Nombre del Group en `role/body-xl`, como el set (la ficha dice `role/body-lg`: manda el set).

## Tokens

| Parte | Token |
| --- | --- |
| Fila Link | padding vertical `space/gap/sm`, gap `space/gap/sm`, línea inferior `color/border/subtle` |
| Nombre · bajada | `role/body` (Large `role/body-lg`) en `color/text/primary` · `role/caption` en `color/text/tertiary`, gap `space/gap/xs` |
| Flecha · + / – | `icon/md` en `color/icon/primary` |
| Group | padding vertical `space/gap/md`, nombre `role/body-xl` |

## Pendientes

- `TODO` (show-image) Show image no se usa en ninguna pantalla y la miniatura (60) no tiene token: no está implementada.
