# input · `<arq-input>`

Campo de formulario con línea inferior (sin caja). Text para datos cortos (nombre, email, teléfono) y Textarea para mensajes. Cubre Contacto, el email del Home (sin label visible) y la versión oscura (modo Dark).

- Figma: [930-2364](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=930-2364) · ficha `doc/input` (`1451:5397`)

```html
<arq-input name="nombre" placeholder="Tu nombre completo" autocomplete="name" required show-label>Nombre</arq-input>

<arq-input name="email" input-type="email" autocomplete="email" show-label show-helper>
  Email
  <span slot="helper">Te respondemos en 48 h</span>
</arq-input>

<arq-input type="textarea" name="mensaje" placeholder="Contanos más sobre tu consulta o proyecto…" show-label>Mensaje</arq-input>

<!-- Error: el mensaje reemplaza al helper -->
<arq-input name="email" input-type="email" error="Revisá el formato del email" show-label>Email</arq-input>

<!-- Email del Home: sin label visible -->
<arq-input name="email" input-type="email" placeholder="Tu email">Email</arq-input>
```

## Props

| Figma | Atributo | Prop JS | Valores · por defecto |
| --- | --- | --- | --- |
| Label | slot por defecto | — | **Obligatorio** aunque no se vea: es el `<label>` del campo |
| Show label | `show-label` | `showLabel` | booleano. **En Figma viene en `true`; en código, sin el atributo el label queda solo para lectores de pantalla** (email del Home) |
| Helper | slot `helper` | — | aclaración ("Te respondemos en 48 h") |
| Show helper | `show-helper` | `showHelper` | booleano |
| Type | `type` | `type` | `text` · `textarea` (def. `text`). `select`: todavía no (ver Pendientes) |
| State=Error | `error` | `error` | mensaje de error. Con `error`, la línea pasa a `color/border/error`, el mensaje reemplaza al helper y siempre se ve |
| State=Disabled | `disabled` | `disabled` | booleano |
| — | `input-type` | `inputType` | `text` · `email` · `tel` · `url` · `number` · `search` (teclado del celular y validación) |
| — | `name` · `value` · `placeholder` · `autocomplete` · `required` · `minlength` · `maxlength` · `pattern` · `inputmode` · `rows` | | pasan al control nativo |

- State Empty / Filled salen del valor; Focus es CSS.
- **Es un `<input>` / `<textarea>` real** con su `<label for>`. El helper y el error van en `aria-describedby`; con error, `aria-invalid="true"` y el mensaje se anuncia (`aria-live`).
- **Formulario:** manda `name=value` con el `<form>` (ElementInternals) y le pasa la validación nativa (`required`, `input-type="email"`…): `form.reportValidity()` la muestra. `form.reset()` vuelve al valor inicial.
- **Validación:** se valida al salir del campo o al enviar, no mientras se escribe. El texto del error lo pone el formulario con `error`.
- Eventos: `arq:input` (cada tecla) y `arq:change` (al salir del campo), con `{ value }`.

## Tokens

| Parte | Token |
| --- | --- |
| Label | `color/text/tertiary` · `role/label` |
| Valor · placeholder | `color/text/primary` · `color/text/tertiary` · `role/body` |
| Línea | `border/default` en `color/border/default` (Focus `color/border/focus`, Error `color/border/error`, Disabled `color/border/disabled`) |
| Helper · error | `color/text/tertiary` · `color/text/error` · `role/body-sm` |
| Disabled | `color/text/disabled` en label, valor, placeholder y helper |
| Gap · padding vertical | `space/gap/sm` · `space/gap/sm` (como en Figma) |

## Pendientes

- `TODO` **Type=Select:** se construye con select y select-menu (menú propio, teclado y posición). Hoy `type="select"` avisa en consola y se ve como Text.
- **Foco:** solo cambia el color de la línea, sin anillo (excepción a DESIGN.md §7, anotada en `docs/decisiones.md`).
- **Textarea:** 4 filas visibles por defecto (`rows="4"`; se cambia con el atributo `rows`) y solo se agranda hacia abajo (`resize: vertical`), según la descripción del set. En el frame de Figma el campo mide 120 (unas 5 líneas): manda el texto.
- `TODO` Textos de error por caso de validación, indicador de campo obligatorio y estado Hover: no están diseñados.
- Helper y error comparten la prop Helper en Figma; en código son separados (slot `helper` y atributo `error`).
