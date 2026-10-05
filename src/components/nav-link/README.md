# nav-link · `<arq-nav-link>`

Link de primer nivel del navbar (desktop) y fila del menú mobile. Current marca la sección activa; Has dropdown abre un menú (Productos).

- Figma: [752-2866](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=752-2866) · ficha `doc/nav-link` (`1442:3957`)

```html
<arq-nav-link href="/arq/colecciones" current>Colecciones</arq-nav-link>
<arq-nav-link href="/arq/contacto">Contacto</arq-nav-link>
<arq-nav-link has-dropdown>Productos</arq-nav-link>
```

## Props

| Figma | Atributo | Prop JS | Valores |
| --- | --- | --- | --- |
| Label | slot por defecto | — | nombre de la sección |
| Has dropdown | `has-dropdown` | `hasDropdown` | booleano · abre un menú: es un `<button>` (no navega) |
| Open | `open` | `open` | booleano · menú abierto (`aria-expanded="true"`); lo controla el navbar |
| State=Current | `current` | `current` | booleano · página actual (`aria-current="page"`) + indicador; lo controla el navbar |
| — | `href` | `href` | destino (sin Has dropdown) |
| Theme | `theme` | `theme` | `default` · `inverse` (def. `default`) · Inverse en el navbar Transparent, sobre foto (solo desktop) |

- Hover, Pressed y Focus son CSS. Breakpoint es CSS: hasta 767 px es la fila del menú mobile.
- **Sin dropdown:** `<a href>`. **Con dropdown:** `<button aria-expanded>`; al tocarlo emite `arq:toggle` con `{ open: !open }` y el navbar decide abrir o cerrar.
- **Desktop:** `role/body`, hug. Hover subraya el label (y el chevron). Pressed: texto `color/text/tertiary`. Current: guion antes del label, sin subrayado, y texto en `role/body-regular` (un peso más, como catalog-nav-item Selected). Has dropdown: chevron-down (`icon/sm`); Open solo lo gira, sin subrayado.
- **Mobile:** fila a todo el ancho con padding `space/gap/md` × `layout/gutter`, `role/body-xl`. Todas las filas llevan una flecha al final (`chevron-right`; en Current, `arrow-right`), también las que tienen Has dropdown (una sola flecha). Pressed: fondo `color/surface/selected`; Hover (solo con mouse): `color/surface/hover`. Sin borde inferior.
- Una sola Current por navbar.

## Tokens

| Parte | Token |
| --- | --- |
| Texto | `color/text/primary` (Pressed desktop `color/text/tertiary`) · `role/body`, Current `role/body-regular` (mobile `role/body-xl`) |
| Subrayado Hover | `border/default` en `color/border/strong`, 3 px debajo del texto (`space/padding/2xs`, como el button Underline) |
| Indicador Current | `space/gap/sm` × `border/strong` (8 × 2) en `color/border/strong` |
| Chevron · flecha mobile | `icon/sm` · `icon/md`, color del texto |
| Gap | `space/gap/sm` |
| Mobile | padding `space/gap/md` × `layout/gutter` · Pressed `color/surface/selected` · Hover `color/surface/hover` |
| Foco | `border/strong` en `color/border/focus`, separado 2 px (en mobile, hacia adentro) |

## Pendientes

- `TODO` (diseño) **Theme=Inverse**: Pressed queda en `color/text/inverse` (el set no define otro color) y el anillo de foco usa `color/border/focus`, que sobre una foto oscura se ve poco.
- `TODO` (a11y) `aria-controls` hacia el mega-menu: los ids no cruzan el Shadow DOM (el mega-menu vive en el del navbar). El estado lo comunica `aria-expanded`.
- El estilo de texto (`role/body` → `role/body-xl`) lo cambia el JS con el mismo corte de 767 px: un `role/*` es una clase y no se puede aplicar desde un media query.
- En mobile, Figma dibuja dos flechas si tiene Has dropdown; se deja una sola.
