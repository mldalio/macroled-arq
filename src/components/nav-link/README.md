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

- Hover, Pressed y Focus son CSS. Breakpoint es CSS: hasta 767 px es la fila del menú mobile.
- **Sin dropdown:** `<a href>`. **Con dropdown:** `<button aria-expanded>`; al tocarlo emite `arq:toggle` con `{ open: !open }` y el navbar decide abrir o cerrar.
- **Desktop:** `role/body`, hug. Hover subraya el label (y el chevron). Pressed: texto `color/text/tertiary`. Current: guion antes del label, sin subrayado. Has dropdown: chevron-down (`icon/sm`); Open solo lo gira, sin subrayado.
- **Mobile:** fila a todo el ancho con padding `space/gap/md` × `layout/gutter`, `role/body-xl`. Todas las filas llevan una flecha al final (`chevron-right`; en Current, `arrow-right`), también las que tienen Has dropdown (una sola flecha). Pressed: fondo `color/surface/selected`; Hover (solo con mouse): `color/surface/hover`. Sin borde inferior.
- Una sola Current por navbar.

## Tokens

| Parte | Token |
| --- | --- |
| Texto | `color/text/primary` (Pressed desktop `color/text/tertiary`) · `role/body` (mobile `role/body-xl`) |
| Subrayado Hover | `border/default` en `color/border/strong`, 3 px debajo del texto (`space/padding/2xs`, como el button Underline) |
| Indicador Current | `space/gap/sm` × `border/strong` (8 × 2) en `color/border/strong` |
| Chevron · flecha mobile | `icon/sm` · `icon/md`, color del texto |
| Gap | `space/gap/sm` |
| Mobile | padding `space/gap/md` × `layout/gutter` · Pressed `color/surface/selected` · Hover `color/surface/hover` |
| Foco | `border/strong` en `color/border/focus`, separado 2 px (en mobile, hacia adentro) |

## Pendientes

- `TODO` (navbar) **Theme=Inverse** (navbar Transparent sobre el hero): queda para cuando se haga el navbar, con diseño (opacidad de Pressed sin token, color del foco sobre foto, Inverse con Iluminar).
- `TODO` (mega-menu) "Productos" con Has dropdown deja de ser link: el mega-menu tiene que incluir un link "Ver todos".
- `TODO` (navbar) `aria-controls` hacia el mega-menu: los ids no cruzan el Shadow DOM.
- El estilo de texto (`role/body` → `role/body-xl`) lo cambia el JS con el mismo corte de 767 px: un `role/*` es una clase y no se puede aplicar desde un media query.
- En mobile, Figma dibuja dos flechas si tiene Has dropdown; se deja una sola.
- Foco con anillo: en Figma el foco es un borde interno que agranda la caja (desktop 65 → 81, mobile 60 → 62).
