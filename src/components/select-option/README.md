# select-option · `<arq-select-option>`

Opción de select-menu: muestra de acabado opcional + nombre. Sirve para acabados y para "Todos" o valores sin muestra.

- Figma: [921-2500](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=921-2500) · ficha `doc/select-option` (`1461:8627`)

```html
<arq-select-option value="black" show-swatch swatch-src="https://…/black.jpg">Negro</arq-select-option>
<arq-select-option value="all" selected>Todos</arq-select-option>
<arq-select-option value="bronze" show-swatch disabled>Bronce (sin stock)</arq-select-option>
```

## Props

| Figma | Atributo | Prop JS | Valores · por defecto |
| --- | --- | --- | --- |
| Name | slot por defecto | — | nombre del acabado o valor |
| Show swatch | `show-swatch` | `showSwatch` | booleano. **En Figma viene en `true`; en código, sin el atributo no hay muestra** (listas de texto) |
| — | `swatch-src` | `swatchSrc` | URL de la imagen del acabado (de los datos). Sin imagen queda el fondo `color/surface/subtle` |
| State=Selected | `selected` | `selected` | booleano · nombre en `role/body-medium` |
| State=Disabled | `disabled` | `disabled` | booleano · opción sin stock o no combinable |
| — | `value` | `value` | valor de la opción |

- Hover y Focus son CSS. Al tocarla (si no está deshabilitada) emite `arq:change` con `{ value, selected: true }`.
- **Accesibilidad:** el elemento es la opción (`role="option"`, `aria-selected`, `aria-disabled`). La muestra es decorativa.

## Tokens

| Parte | Token |
| --- | --- |
| Fondo Hover | `color/surface/faint` |
| Separador | `border/default` en `color/border/subtle` |
| Nombre | `color/text/primary` (Disabled: `color/text/disabled`) · `role/body` (Selected: `role/body-medium`) |
| Muestra | `swatch/sm`, borde `border/default` en `color/border/default`, fondo `color/surface/subtle` |
| Padding · gap | `space/padding/md` · `space/gap/sm` |
| Foco | `border/strong` en `color/border/focus`, separado 2 px |

## Pendientes

- `TODO` (select-menu) Foco y teclado: foco real o `aria-activedescendant`. Hoy la opción no recibe foco sola.
- `TODO` (datos) URL de la imagen del acabado: falta el campo en Typesense y el archivo de mapeo de acabados (AGENTS.md).
- La muestra no es `<arq-swatch>`: dentro del menú lleva borde `color/border/default` (Figma) y el swatch suelto `color/border/subtle`.
- Disabled está en el set y en la tabla de la ficha; la descripción de Figma no lo menciona.
