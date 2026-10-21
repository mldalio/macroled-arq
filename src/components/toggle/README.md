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
| — (solo de código) | `theme` | `theme` | `default` · `inverse` (sobre foto oscura) · def. `default` |
| — | `name` · `value` | `name` · `value` | para formularios (`value` def. `on`) |

- Sin Hover (decisión del equipo, 2026-10-16); Focus es CSS.
- **toggle-switch** (pista + círculo) va siempre adentro de toggle: no es un elemento propio ("no se usa suelto").
- **Es un `<input type="checkbox" role="switch">` real:** todo el componente es clickeable, incluido el texto; Espacio lo cambia. `el.focus()` enfoca el input.
- Emite `arq:change` con `{ checked, value }`. Encendido, manda `name=value` si está en un `<form>`.
- **Theme=Inverse** (2026-10-21, solo de código; TODO (Figma): sumar la variante al set): versión clara para cuando el toggle va sobre una foto oscura. Es un blanco apagado (neutral/200 en Dark), no el blanco pleno, para no llamar la atención. En la ficha lo elige `<arq-ficha-producto>` midiendo el brillo de la foto debajo del toggle.
- **Iluminar:** el toggle solo avisa el cambio. Poner `data-arq-theme="dark"` en `<html>` (listados) o en navbar / hero / explora-coleccion (ficha) lo hace la página.

## Tokens

| Parte | Token |
| --- | --- |
| Pista | 38 × 18 = `space/padding/2xs`, `icon/sm` y `space/gap/sm` (sin token propio) · `radius/pill` · borde `border/default` |
| Off | borde `color/border/strong`, círculo `color/icon/primary` |
| On | fondo y borde `color/action/primary`, círculo `color/action/on-primary` |
| Disabled | borde `color/border/disabled`, círculo `color/icon/disabled`; On + Disabled: pista `color/surface/strong` |
| Círculo | `icon/sm`, corre `icon/sm` + `space/gap/sm` |
| Label | `color/text/primary` (Disabled `color/text/disabled`) · `role/body-regular` |
| Gap | `space/gap/sm` |
| Theme=Inverse | Dark local en el contenedor interno; pista, círculo y borde `color/icon/secondary`, label `color/text/secondary` (neutral/200); On: pista `color/icon/secondary`, círculo `color/action/on-primary` |
| Foco | `border/strong` en `color/border/focus`, separado 2 px de la pista (DESIGN.md §7) |

## Pendientes

- **Movimiento:** el círculo se corre con `transform` y la pista cambia de color en `motion/duration/fast` con `motion/easing/standard`. Con `prefers-reduced-motion: reduce` es instantáneo.
- Iluminar (catalog-toolbar / ficha) no se guarda: recargar lo apaga. Solo pasa de Productos o Colecciones a la ficha (`docs/decisiones.md`, 2026-10-15 · Iluminar no se recuerda).
