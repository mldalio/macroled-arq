# toggle · `<arq-toggle>`

Interruptor con texto para opciones binarias que se aplican al instante: "Iluminar" (modo Dark) en catalog-toolbar y la ficha, "Solo diferencias" en Comparativa. Si el cambio se confirma con un botón, se usa checkbox.

- Figma: toggle [926-3102](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=926-3102) · toggle-switch [1131-6383](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1131-6383) · fichas `doc/toggle` (`1427:2707`) y `doc/toggle-switch` (`1427:2912`)

```html
<arq-toggle show-label>Iluminar</arq-toggle>
<arq-toggle checked show-label>Solo diferencias</arq-toggle>
```

## Props

| Figma | Atributo | Prop JS | Valores · por defecto |
| --- | --- | --- | --- |
| Label | slot por defecto | — | texto corto, en caja normal |
| Show label | `show-label` | `showLabel` | booleano. **En Figma viene en `true`; en código, sin el atributo el texto queda solo para lectores de pantalla** |
| Checked | `checked` | `checked` | booleano (switch encendido) |
| State=Disabled | `disabled` | `disabled` | booleano |
| — | `name` · `value` | `name` · `value` | para formularios (`value` def. `on`) |

- Hover y Focus son CSS.
- **toggle-switch** (pista + círculo) va siempre adentro de toggle: no es un elemento propio ("no se usa suelto").
- **Es un `<input type="checkbox" role="switch">` real:** todo el componente es clickeable, incluido el texto; Espacio lo cambia. `el.focus()` enfoca el input.
- Emite `arq:change` con `{ checked, value }`. Encendido, manda `name=value` si está en un `<form>`.
- **Iluminar:** el toggle solo avisa el cambio. Poner `data-arq-theme="dark"` en `<html>` (listados) o en navbar / hero / explora-coleccion (ficha) lo hace la página.

## Tokens

| Parte | Token |
| --- | --- |
| Pista | 38 × 18 = `space/padding/2xs`, `icon/sm` y `space/gap/sm` (sin token propio) · `radius/pill` · borde `border/default` |
| Off | borde `color/border/strong`, círculo `color/icon/primary`, Hover fondo `color/surface/hover` |
| On | fondo y borde `color/action/primary` (Hover `color/action/primary-hover`), círculo `color/action/on-primary` |
| Disabled | borde `color/border/disabled`, círculo `color/icon/disabled`; On + Disabled: pista `color/surface/strong` |
| Círculo | `icon/sm`, corre `icon/sm` + `space/gap/sm` |
| Label | `color/text/primary` (Disabled `color/text/disabled`) · `role/body-regular` |
| Gap | `space/gap/sm` |
| Foco | `border/strong` en `color/border/focus`, separado 2 px de la pista (DESIGN.md §7) |

## Pendientes

- `TODO` Sin transición del círculo: no hay tokens de movimiento (la ficha pide "transición corta" y respetar `prefers-reduced-motion`).
- `TODO` (catalog-toolbar / ficha) Guardar Iluminar en `localStorage` (`arq:<clave>`) o no: no está definido.
- On + Disabled con pista `color/surface/strong` sale del set; la descripción y la ficha no lo mencionan.
- Foco con anillo: en Figma el foco solo cambia el color del borde a `color/border/focus`, que en Light es igual al borde de Off.
