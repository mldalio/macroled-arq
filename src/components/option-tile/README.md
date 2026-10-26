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
| Type | `type` | `type` | `option` · `value` · `card` (def. `option`). `value` lo pone option-group solo cuando el grupo tiene una sola opción: se muestra como dato. `card` lo pone option-group Type=Cards (configurador de Daö) |
| — | slot `meta` | — | Type=Card: subtítulo debajo del título (`role/body-compact`, 14/24, `color/text/tertiary`); solo se reserva si trae contenido |
| — | slot `swatch` | — | Type=Card: un `arq-swatch` antes del título (Terminación) |
| State=Selected | `selected` | `selected` | booleano |
| State=Disabled | `disabled` | `disabled` | booleano |
| — | `value` | `value` | valor que se envía en `arq:change` |

- Hover y Focus son CSS.
- **Type=Value (una sola opción):** no hay nada que elegir, así que el tile se ve como dato: sin línea de selección (queda reservada, transparente), en `color/text/primary`, sin `role`, sin foco ni cursor de click. Lo decide option-group al contar sus tiles; con más de uno vuelven a Type=Option. El grupo, en ese caso, deja de ser un `radiogroup`.
- **Type=Card (solo del configurador de Daö):** la opción en una caja, para cuando cada opción lleva un dato más (código, orientación, color de luz) y la línea sola no alcanza. Título en `role/body-regular` (16) y subtítulo opcional en `role/body-compact` (14). Caja de 1 px en `color/border/subtle`; elegida, `color/border/strong` (el contraste lo da el tono, no el grosor); hover `color/border/hover`; Disabled `color/border/disabled`. Subtítulo en `color/text/secondary` (`color/text/disabled` si está deshabilitada). Sin fondo ni sombra. La ficha de arriba sigue con Type=Option, sin cajas. `TODO` (diseño): Type=Card no está en el set de Figma.
- **Comportamiento:** el elemento es el radio (`role="radio"`, `aria-checked`, `aria-disabled`). Clic, Enter o Espacio lo eligen y emite `arq:change` con `{ value, selected: true }`. Elegido no se des-elige con clic.
- **En grupo:** va dentro de `<arq-option-group>` (Type=Tiles), que es el `role="radiogroup"` y usa `SingleSelect` (`src/base/single-select.js`) para las flechas, Inicio / Fin y una sola opción elegida.
- En un grupo va en Hug content (`flex: 0 1 auto`): mide lo que mide su texto y no se estira para llenar la fila; si no entran todos, bajan a otra línea.

## Tokens

| Parte | Token |
| --- | --- |
| Línea inferior | `border/default` (1 px, como el swatch de la ficha; antes 2 px), siempre reservada: transparente (`color/surface/transparent`) en Default y Disabled, `color/border/hover` en Hover, `color/border/strong` en Selected. A `space/padding/xs` (4 px) del texto, que tiene una caja de `1em + border/strong` y no el interlineado completo: la línea queda a ~8 px de la base de las letras (antes ~11) |
| Fondo | ninguno (tampoco en Hover ni Selected) |
| Texto | `color/text/secondary` (Hover y Selected `color/text/primary`, Disabled `color/text/disabled`, sin tachado desde 2026-10-21) · `role/body-regular` |
| Transición | línea y texto en `motion/duration/base` · `motion/easing/standard` (con Iluminar, la duración del texto de la página) |
| Padding | solo abajo, `space/padding/xs` entre el texto y la línea |
| Foco | `border/strong` en `color/border/focus`, separado 2 px (DESIGN.md §7) |

- **2026-10-21 · sin caja** (`docs/decisiones.md`, Configurador de la ficha): se sacaron el padding lateral y superior y los fondos; la línea pasó a ser el indicador de selección (2 px solo en la elegida). TODO (Figma): actualizar el set 921:2487, que todavía tiene caja, línea de 1 px en todas y fondo en Hover y Selected.
