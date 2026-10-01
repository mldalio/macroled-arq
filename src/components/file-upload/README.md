# file-upload · `<arq-file-upload>`

Zona para adjuntar un archivo al formulario de Contacto (planos, renders, fotos). Empty: zona con `icon/plus` y ayuda. Attached: nombre del archivo + "Quitar". Drag over: archivo arrastrado encima. Error: archivo inválido. Disabled. Un solo archivo.

- Figma: [1113-2499](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1113-2499) · ficha `doc/file-upload` (`1451:5767`)

```html
<arq-file-upload name="adjunto">
  <span slot="helper">PDF, DWG, JPG o PNG · hasta 10 MB</span>
</arq-file-upload>
```

## Props

| Figma | Atributo / slot | Prop JS | Valores · por defecto |
| --- | --- | --- | --- |
| Label | slot por defecto | — | texto del campo (def. "Adjuntar archivo") |
| Helper | slot `helper` | — | formatos y tamaño máximo |
| — (texto de la zona) | slot `prompt` | — | def. "Arrastrá o seleccioná planos, renders o fotos" |
| — (texto de la zona en Drag over) | slot `drop` | — | def. "Soltá el archivo acá" |
| State=Empty / Attached | — | `file` (solo lectura) | sale de si hay archivo |
| State=Drag over | — | — | mientras se arrastra un archivo encima (`:state(drag-over)`) |
| State=Error | — | — | archivo que no pasa la validación (`:state(error)`) |
| State=Disabled | `disabled` | `disabled` | booleano |
| — | `accept` | `accept` | def. `.pdf,.dwg,.jpg,.jpeg,.png` |
| — | `max-size` | `maxSize` | MB, def. `10` |
| — | `name` · `required` | `name` · `required` | para el formulario |

- **Es un `<input type="file">` real:** la zona es su `<label>` (clic o Enter/Espacio abre el selector) y acepta arrastrar y soltar. `el.focus()` enfoca el input.
- **Validación:** formato (`accept`) y tamaño (`max-size`) al elegir el archivo. Si no pasa, no lo adjunta y pasa a State=Error: la zona con borde `color/border/error` y el mensaje en lugar del helper. Mensajes: "El archivo supera los 10 MB. Formatos: PDF, DWG, JPG o PNG." y "El formato no está admitido. Formatos: PDF, DWG, JPG o PNG." (los dos de la descripción del set). La lista de formatos sale de `accept`.
- **Drag over:** borde `color/border/strong`, fondo `color/surface/hover` y el texto de la zona pasa a "Soltá el archivo acá". Disabled no acepta archivos arrastrados.
- **Formulario:** el archivo viaja en el `FormData` del `<form>` (ElementInternals). `form.reset()` lo quita.
- "Quitar" es `<arq-button type="underline">`; su nombre accesible es "Quitar archivo plano.pdf". Al quitarlo, el foco vuelve al input.
- Emite `arq:change` con `{ file }` (o `{ file: null }` al quitar).

## Tokens

| Parte | Token |
| --- | --- |
| Label | `color/text/secondary` · `role/label` |
| Zona | fondo `color/bg/subtle`, borde `border/default` en `color/border/default` (punteado en Empty, lleno en Attached) · padding `space/padding/lg` · gap `space/gap/sm-md` |
| Ícono · texto de la zona | `plus` en `icon/md`, `color/icon/primary` · `color/text/primary` `role/body` |
| Nombre del archivo | `color/text/primary` · `role/body-regular` |
| Helper · error | `color/text/tertiary` · `color/text/error` · `role/body-sm` |
| Drag over | borde `color/border/strong` · fondo `color/surface/hover` |
| Disabled | borde `color/border/disabled` · textos `color/text/disabled` · ícono `color/icon/disabled` |
| Foco | `border/strong` en `color/border/focus`, separado 2 px (DESIGN.md §7) |

## Pendientes

- `TODO` En Figma, el ícono de State=Disabled es `icon/plus` Theme=Default; en código va en `color/icon/disabled`, como el resto del texto (ficha: "border/disabled y text/disabled").
- `TODO` (form-contacto) Cómo viaja el archivo a n8n (multipart): no está definido el contrato del webhook.
- Formatos aceptados: los acordados (PDF, DWG, JPG, PNG).
