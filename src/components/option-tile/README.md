# option-tile · `<arq-option-tile>`

Opción de configuración de la ficha (altura, potencia, temperatura). Funciona como radio dentro de option-group Type=Tiles. Sin caja: solo línea inferior. No confundir con choice-chip, que es para formularios.

- Figma: [921-2487](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=921-2487) · ficha `doc/option-tile` (`1461:9043`)

```html
<!-- dentro de option-group Type=Tiles (role="radiogroup") -->
<arq-option-tile value="30">30 cm</arq-option-tile>
<arq-option-tile value="50" selected>50 cm</arq-option-tile>
<arq-option-tile value="80" disabled>80 cm</arq-option-tile>
```

## Props

| Figma | Atributo | Prop JS | Valores |
| --- | --- | --- | --- |
| Label | slot por defecto | — | valor de la opción ("50 cm") |
| State=Selected | `selected` | `selected` | booleano |
| State=Disabled | `disabled` | `disabled` | booleano |
| — | `value` | `value` | valor que se envía en `arq:change` |

- Hover y Focus son CSS.
- **Comportamiento:** el elemento es el radio (`role="radio"`, `aria-checked`, `aria-disabled`). Clic, Enter o Espacio lo eligen y emite `arq:change` con `{ value, selected: true }`. Elegido no se des-elige con clic.
- **En grupo:** va dentro de `<arq-option-group>` (Type=Tiles), que es el `role="radiogroup"` y usa `SingleSelect` (`src/base/single-select.js`) para las flechas, Inicio / Fin y una sola opción elegida.
- En un grupo va en Fill (`flex: 1 1 max-content`): parte del ancho de su texto y se estira para llenar la fila; si no entran todos, bajan a otra línea.

## Tokens

| Parte | Token |
| --- | --- |
| Línea inferior | `border/default` en `color/border/default` (Hover `color/border/hover`, Selected `color/border/strong`, Disabled `color/border/disabled`) |
| Fondo Hover · Selected | `color/surface/faint` · `color/surface/soft` |
| Texto | `color/text/tertiary` (Hover y Selected `color/text/primary`, Disabled `color/text/disabled`) · `role/body-regular` |
| Padding | `space/padding/sm-md` × `space/padding/md` |
| Foco | `border/strong` en `color/border/focus`, separado 2 px (DESIGN.md §7) |
- Selected mantiene la línea en 1 px (set de Figma); DESIGN.md §5 asocia `border/strong` (2 px) a la selección de muestras, no a option-tile.
