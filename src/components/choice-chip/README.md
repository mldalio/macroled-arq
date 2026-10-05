# choice-chip · `<arq-choice-chip>`

Opción en forma de chip para elegir entre pocas opciones visibles (2 a 6) en un formulario, por ejemplo el motivo de consulta en Contacto. Una sola selección por grupo. No confundir con option-tile, que configura el producto en la ficha.

- Figma: [1113-2485](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1113-2485) · ficha `doc/choice-chip` (`1451:5647`)

```html
<!-- dentro del grupo de choice-chip (role="radiogroup", con su legend) -->
<arq-choice-chip name="motivo" value="presupuesto" selected>Presupuesto</arq-choice-chip>
<arq-choice-chip name="motivo" value="asesoramiento">Asesoramiento técnico</arq-choice-chip>
<arq-choice-chip name="motivo" value="otro" disabled>Otro</arq-choice-chip>
```

## Props

| Figma | Atributo | Prop JS | Valores |
| --- | --- | --- | --- |
| Label | slot por defecto | — | texto corto y paralelo entre opciones |
| State=Selected | `selected` | `selected` | booleano |
| State=Disabled | `disabled` | `disabled` | booleano |
| — | `name` · `value` | `name` · `value` | como un `<input type="radio">` |

- Hover y Focus son CSS.
- **Formulario:** el chip elegido manda `name=value` con el `<form>` (ElementInternals), como un radio nativo. `form.reset()` vuelve a la selección inicial.
- **Comportamiento:** el elemento es el radio (`role="radio"`, `aria-checked`). Clic, Enter o Espacio lo eligen y emite `arq:change` con `{ value, selected: true }`. En grupo, `SingleSelect` maneja las flechas y la selección única.
- Con más de 6 opciones se usa input Type=Select.

## Tokens

| Parte | Token |
| --- | --- |
| Borde | `border/default` en `color/border/default` (Hover y Selected `color/border/strong`, Disabled `color/border/disabled`) |
| Fondo Selected | `color/surface/selected` |
| Texto | `color/text/primary` (Disabled `color/text/disabled`) · `role/body-regular` |
| Padding | `space/padding/sm-md` × `space/padding/md`. Texto centrado: si el contenedor lo estira (Contacto), el chip ocupa el ancho que le den |
| Foco | `border/strong` en `color/border/focus`, separado 2 px (DESIGN.md §7) |

## Pendientes

- Contenedor del grupo: no existe en Figma. En Contacto (`arq-form-contacto`) es un `<fieldset>` con su `<legend>` y adentro un `role="radiogroup"` con `SingleSelect`; los chips van a `space/gap/sm` (Final, `1278:27940`: `space/gap/sm-md`; se juntaron para que entren cuatro en una fila en 1440). La demo usa `space/gap/sm`.
