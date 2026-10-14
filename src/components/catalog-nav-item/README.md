# catalog-nav-item · `<arq-catalog-nav-item>`

Link a una subcategoría del catálogo, dentro de catalog-nav-group.

- Figma: [1035-2382](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1035-2382) · ficha `doc/catalog-nav-item` (`1426:2295`)

```html
<arq-catalog-nav-item href="/arq/productos/…" selected>Todo interior</arq-catalog-nav-item>
<arq-catalog-nav-item href="/arq/productos/…">Embutir</arq-catalog-nav-item>
```

## Props

| Figma | Atributo | Prop JS | Valores · por defecto |
| --- | --- | --- | --- |
| Label | slot por defecto | — | Nombre de la subcategoría |
| Size | `size` | `size` | `default` (`role/body-compact`, 14) · `large` (`role/body-lg`, 16). Por defecto `default` |
| State=Selected | `selected` | `selected` | booleano: la subcategoría actual. Una sola por lista |
| — | `href` | `href` | Destino del link |

- Es un `<a href>`. Selected suma el guion "—", pasa a `role/body-compact-regular` (o `role/body-lg-regular` en Large) en `color/text/primary` y lleva `aria-current="page"`.
- Hover (`color/text/primary`) y Focus son CSS. Va con `role="listitem"` (el grupo es la lista).

## Tokens

| Parte | Token |
| --- | --- |
| Texto | Default: `role/body-compact` en `color/text/secondary`. Large: `role/body-lg` en `color/text/tertiary`. Hover y Selected: `color/text/primary` |
| Padding | `space/padding/xs` arriba y abajo, `space/padding/sm-md` a la izquierda (alto 32) |
| Gap guion–texto | `space/gap/sm` |
| Guion de Selected | `space/gap/sm-md` × `border/default` en `color/text/primary` (sin token de tamaño, como el de nav-link) |
| Foco | `border/strong` en `color/border/focus`, separado 2 px (DESIGN.md §7) |

## Pendientes

- La ficha `doc/catalog-nav-item` todavía muestra el diseño anterior (`role/body` 14/20, Default en `color/text/tertiary`). Manda el set.
- En el set, la variante Size=Default, State=Focus tiene el texto en `color/text/tertiary` y Default en `color/text/secondary`. En código el foco solo suma el anillo y conserva el color de Default.
