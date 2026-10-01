# checkbox · `<arq-checkbox>`

Checkbox con label. Se usa en las opciones de filter-row (panel de filtros, Size=Large) y en "Comparar" de product-card (Size=Default). Para selección múltiple que se confirma después.

- Figma: [975-2322](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=975-2322) · ficha `doc/checkbox` (`1430:2811`)

```html
<arq-checkbox name="comparar" value="KANU-J-500-12W-N-WW" show-label>Comparar</arq-checkbox>
<arq-checkbox name="aplicacion" value="exterior" size="large" checked show-label>Exterior</arq-checkbox>
```

## Props

| Figma | Atributo | Prop JS | Valores · por defecto |
| --- | --- | --- | --- |
| Label | slot por defecto | — | texto de la opción |
| Show label | `show-label` | `showLabel` | booleano. **En Figma viene en `true`; en código, sin el atributo el texto queda solo para lectores de pantalla** |
| Size | `size` | `size` | `default` · `large` (def. `default`) |
| Checked | `checked` | `checked` | booleano |
| State=Disabled | `disabled` | `disabled` | booleano |
| — | `name` · `value` | `name` · `value` | como un `<input type="checkbox">` (`value` def. `on`) |

- Hover y Focus son CSS.
- **Es un `<input type="checkbox">` real** con su `<label>`: toda la fila (caja + texto) es clickeable y Espacio lo marca. `el.focus()` enfoca el input.
- **Formulario:** marcado, manda `name=value` con el `<form>` (ElementInternals). `form.reset()` vuelve al estado inicial.
- Emite `arq:change` con `{ checked, value }` cuando la persona lo cambia.
- En product-card va fuera del link de la tarjeta.

## Tokens

| Parte | Token |
| --- | --- |
| Caja · control | `icon/sm` (12) dentro de `icon/md` (16) · `radius/control` |
| Caja sin marcar | fondo `color/surface/default`, borde `border/default` en `color/icon/tertiary` (Hover `color/icon/primary`) |
| Caja marcada | `color/action/primary` (Hover `color/action/primary-hover`) |
| Disabled | `color/icon/disabled` · texto `color/text/disabled` |
| Label | `color/text/secondary` (Hover `color/text/primary`) · `role/body` (Large `role/body-lg`) |
| Gap · padding vertical | `space/gap/sm` · `space/gap/xs` (como en Figma) |
| Foco | `border/strong` en `color/border/focus`, separado 2 px de la caja (DESIGN.md §7) |

## Pendientes

- `TODO` (product-card) "Comparar" con 3 productos elegidos: el resto pasa a disabled o se avisa (la ficha no lo decide).
- En Figma, Show label no está conectado en Size=Large.
- Un label largo se parte en líneas (Figma es nowrap).
