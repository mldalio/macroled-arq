# count-badge · `<arq-count-badge>`

Contador de productos seleccionados (compare-bar) o de filtros activos (button Filtrar). Crece con el número, con un mínimo de 20 × 20.

- Figma: [1231-3557](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1231-3557) · ficha `doc/count-badge` (`1433:3961`)

```html
<arq-count-badge count="3"></arq-count-badge>
<arq-count-badge count="3" tone="inverse"></arq-count-badge>
```

## Props

| Figma | Atributo | Prop JS | Valores · por defecto |
| --- | --- | --- | --- |
| Count | `count` | `count` | número. Si es `0` o falta, el badge no se muestra |
| Tone | `tone` | `tone` | `primary` · `inverse` (def. `primary`) |

- **Tone=Primary** sobre superficies claras. En modo Dark se invierte solo con los tokens: no hace falta cambiar a Inverse.
- **Tone=Inverse** solo dentro de elementos con fondo `color/action/primary` (p. ej. button Filled).
- No es interactivo y no tiene estados.
- **Accesibilidad:** el número solo no alcanza. El texto ("3 filtros activos") lo pone el control que lo contiene; en `<arq-button>` es el atributo `count-label`.
- Oculto (0 o vacío) usa el estado `:state(empty)` del elemento; no cambia sus atributos.

## Tokens

| Parte | Token |
| --- | --- |
| Fondo · texto Primary | `color/action/primary` · `color/action/on-primary` |
| Fondo · texto Inverse | `color/action/on-primary` · `color/action/primary` |
| Padding | `space/padding/2xs` (vertical) · `space/padding/xs` (horizontal) |
| Radio | `radius/control` |
| Número | `role/caption-medium`, cifras tabulares |

## Pendientes

- `TODO` Ancho mínimo 20 sin token: se calcula con `type/caption/leading` + 2 × `space/padding/2xs`.
- Números grandes ("99+"): no hay regla definida. Hoy se muestra el número completo.
