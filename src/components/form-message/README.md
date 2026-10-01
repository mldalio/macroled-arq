# form-message · `<arq-form-message>`

Mensaje de resultado debajo del botón de envío (Contacto, envío a n8n). Sin ícono.

- Figma: [1311-4871](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1311-4871) · ficha `doc/form-message` (`1451:6043`)

```html
<arq-form-message>Recibimos tu consulta. Te respondemos a la brevedad.</arq-form-message>
<arq-form-message tone="error">No pudimos enviar. Probá de nuevo o escribinos a …</arq-form-message>
```

## Props

| Figma | Atributo | Prop JS | Valores · por defecto |
| --- | --- | --- | --- |
| Message | slot por defecto | — | texto del resultado |
| Tone | `tone` | `tone` | `success` · `error` (def. `success`) |

- **Accesibilidad:** Success lleva `role="status"` y Error `role="alert"` (en el elemento). Se anuncia al aparecer o cambiar el texto.
- Los errores de cada campo van en el propio input, no acá.
- Después de enviar, Contacto muestra solo el mensaje de confirmación.

## Tokens

| Parte | Token |
| --- | --- |
| Texto Success · Error | `color/text/success` · `color/text/error` |
| Texto | `role/body` |

## Pendientes

- `TODO` (form-contacto) La ficha pide mover el foco al mensaje después de enviar. Lo decide el formulario: un `role="status"` no recibe foco y moverlo puede anunciarlo dos veces.
- En Figma el texto es nowrap; en código se parte en líneas.
