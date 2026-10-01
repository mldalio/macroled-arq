# tab · `<arq-tab>`

Pestaña para cambiar entre vistas de un mismo contenido sin salir de la página (Aplicación, Lámparas y artefactos, Colecciones en el mega-menu). Si cada opción lleva a otra URL, se usa nav-link.

- Figma: [929-2287](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=929-2287) · ficha `doc/tab` (`1451:5248`)

```html
<!-- dentro del tablist del mega-menu (role="tablist") -->
<arq-tab value="aplicacion" aria-controls="panel-aplicacion" selected>Aplicación</arq-tab>
<arq-tab value="lamparas" aria-controls="panel-lamparas">Lámparas y artefactos</arq-tab>
<arq-tab value="colecciones" aria-controls="panel-colecciones">Colecciones</arq-tab>
```

## Props

| Figma | Atributo | Prop JS | Valores |
| --- | --- | --- | --- |
| Label | slot por defecto | — | nombre de la pestaña, en caja normal (la mayúscula la pone `role/label`) |
| State=Selected | `selected` | `selected` | booleano · vista activa |
| State=Disabled | `disabled` | `disabled` | booleano |
| — | `value` | `value` | valor que se envía en `arq:change` |

- Hover y Focus son CSS.
- **Comportamiento:** el elemento es la pestaña (`role="tab"`, `aria-selected`, `aria-disabled`). Clic, Enter o Espacio la eligen y emite `arq:change` con `{ value, selected: true }`.
- **Tablist (mega-menu):** contenedor `role="tablist"` con `SingleSelect` (`src/base/single-select.js`): ← → cambian de pestaña (activación automática), Inicio / Fin a la primera / última, una sola Selected. Separación `space/gap/xl` y línea `border/default` en `color/border/subtle` debajo. Cada pestaña con `aria-controls` y su panel con `role="tabpanel"` y `aria-labelledby`.
- El nombre accesible va en caja normal (`aria-label`), aunque se vea en mayúsculas.

## Tokens

| Parte | Token |
| --- | --- |
| Texto Default · Hover / Selected · Disabled | `color/text/tertiary` · `color/text/primary` · `color/text/disabled` |
| Subrayado Selected | `border/default` (1 px) en `color/border/strong` |
| Padding inferior | `space/gap/sm` (como en Figma) |
| Texto | `role/label` |
| Foco | `border/strong` en `color/border/focus`, separado 2 px (DESIGN.md §7) |

## Pendientes

- `TODO` (mega-menu) Tablist, paneles y ids de `aria-controls` / `aria-labelledby`.
- Un label que no entra: Figma es nowrap y no define overflow del tablist.
