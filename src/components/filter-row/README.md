# filter-row · `<arq-filter-row>`

Fila desplegable de filter-panel: un atributo técnico (Potencia, Temperatura, Ángulo…) con sus opciones como checkbox Size=Large.

- Figma: [1225-3405](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1225-3405) · ficha `doc/filter-row` (`1433:3170`)

```html
<arq-filter-row open>
  <span slot="label">Potencia</span>
  <arq-checkbox size="large" show-label name="potencia" value="8">8 W</arq-checkbox>
  <arq-checkbox size="large" show-label name="potencia" value="12">12 W</arq-checkbox>
</arq-filter-row>
```

## Props

| Figma | Atributo / slot | Prop JS | Valores |
| --- | --- | --- | --- |
| Label | slot `label` | — | Nombre del atributo (`role/body-xl`) |
| Open | `open` | `open` | booleano. Figma lo trae en True; en código lo decide la página: abierta si tiene filtros aplicados |
| — (opciones) | slot por defecto | — | `arq-checkbox size="large" show-label`, con `name` (el campo), `value` y `count` (resultados). Cantidad libre: solo las que darían resultados (filter-panel `showAvailable`) |

- **No son props:** State=Hover (`:hover`, solo con mouse) y State=Focus (anillo alrededor de la fila).
- **Comportamiento** (`src/base/disclosure.js`): el encabezado es un `<button>` con `aria-expanded`; las opciones quedan en el HTML aunque esté cerrada. Las opciones van en un grupo (`role="group"`) con el nombre del atributo: la ficha pide `<fieldset>` + `<legend>`, que no se pueden armar con contenido por slot; el anuncio es el mismo.
- **Hover:** la línea pasa a `color/border/default` y el ícono a hover, sin fondo (como el set; la ficha dice `color/surface/hover`).
- **Opciones a todo el ancho:** cada checkbox ocupa la fila (toda es clickeable) y su cantidad queda al borde derecho, en columna con el −/+. **Hover de opción:** fondo `color/surface/faint` en toda la fila, que se asoma `space/padding/sm-md` a los lados y `space/padding/xs` arriba y abajo, junto con el Hover del checkbox; no en Disabled (decisiones.md, 2026-10-22 · Cantidad por opción).
- `options` (JS) devuelve los checkbox de la fila.

## Tokens

| Parte | Token |
| --- | --- |
| Línea inferior | `border/default` en `color/border/subtle` (Hover `color/border/default`) |
| Padding vertical · gap encabezado–opciones | `space/padding/md` · `space/gap/md` |
| Label | `role/body-xl` en `color/text/primary` |
| Ícono | como icon-button Size=Default (`space/padding/xs` + `icon/md`); Hover `color/surface/hover` |
| Opciones | gap `space/gap/sm-md` entre opciones (menos el padding vertical del fondo de hover); a la derecha `space/padding/xs`; abajo `space/padding/sm` (el del set; la ficha dice `md`) |
| Hover de opción | fondo `color/surface/faint`, `space/padding/sm-md` × `space/padding/xs`, fundido `motion/duration/fast` |
| Foco | `border/strong` en `color/border/focus`, separado 2 px (DESIGN.md §7) |
