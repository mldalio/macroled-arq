# option-tile · `<arq-option-tile>`

Opción de configuración de la ficha (altura, potencia, temperatura). Funciona como radio dentro de option-group Type=Tiles. Sin caja: el dato y, solo en la elegida, una línea debajo. No confundir con choice-chip, que es para formularios.

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
- En un grupo va en Hug content (`flex: 0 1 auto`): mide lo que mide su texto y no se estira para llenar la fila; si no entran todos, bajan a otra línea.

## Tokens

| Parte | Token |
| --- | --- |
| Línea inferior | `border/strong` (2 px), siempre reservada: transparente (`color/surface/transparent`) en Default y Disabled, `color/border/hover` en Hover, `color/border/strong` en Selected |
| Fondo | ninguno (tampoco en Hover ni Selected) |
| Texto | `color/text/secondary` (Hover y Selected `color/text/primary`, Disabled `color/text/disabled`, sin tachado desde 2026-10-21) · `role/body-regular` |
| Transición | línea y texto en `motion/duration/base` · `motion/easing/standard` (con Iluminar, la duración del texto de la página) |
| Padding | solo abajo, `space/padding/xs` entre el texto y la línea |
| Foco | `border/strong` en `color/border/focus`, separado 2 px (DESIGN.md §7) |

- **2026-10-21 · sin caja** (`docs/decisiones.md`, Configurador de la ficha): se sacaron el padding lateral y superior y los fondos; la línea pasó a ser el indicador de selección (2 px solo en la elegida). TODO (Figma): actualizar el set 921:2487, que todavía tiene caja, línea de 1 px en todas y fondo en Hover y Selected.
