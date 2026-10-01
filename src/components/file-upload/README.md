# file-upload · `<arq-file-upload>`

Zona para adjuntar un archivo al formulario de Contacto (planos, renders, fotos). Empty: zona con `icon/plus` y ayuda. Attached: nombre del archivo + "Quitar". Un solo archivo.

- Figma: [1113-2499](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1113-2499) · ficha `doc/file-upload` (`1451:5767`)

```html
<arq-file-upload name="adjunto">
  Adjuntar archivos
  <span slot="helper">PDF, DWG, JPG o PNG · hasta 10 MB</span>
</arq-file-upload>
```

## Props

| Figma | Atributo / slot | Prop JS | Valores · por defecto |
| --- | --- | --- | --- |
| Label | slot por defecto | — | texto del campo ("Adjuntar archivos") |
| Helper | slot `helper` | — | formatos y tamaño máximo |
| — (texto de la zona) | slot `prompt` | — | def. "Arrastrá o seleccioná planos, renders o fotos" |
| State=Empty / Attached | — | `file` (solo lectura) | sale de si hay archivo |
| — | `accept` | `accept` | def. `.pdf,.dwg,.jpg,.jpeg,.png` |
| — | `max-size` | `maxSize` | MB, def. `10` |
| — | `name` · `required` | `name` · `required` | para el formulario |

- **Es un `<input type="file">` real:** la zona es su `<label>` (clic o Enter/Espacio abre el selector) y acepta arrastrar y soltar. `el.focus()` enfoca el input.
- **Validación:** formato (`accept`) y tamaño (`max-size`) al elegir el archivo. Si no pasa, no lo adjunta y muestra el error: la zona con borde `color/border/error` y el mensaje en lugar del helper.
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
| Foco | `border/strong` en `color/border/focus`, separado 2 px (DESIGN.md §7) |

## Pendientes

- `TODO` Estado de error y de arrastrar encima: no están diseñados. El error usa el tratamiento de input State=Error; arrastrar no cambia nada visual.
- `TODO` Textos de error ("El formato no está admitido.", "El archivo supera los 10 MB.") sin diseñar.
- `TODO` (form-contacto) Cómo viaja el archivo a n8n (multipart): no está definido el contrato del webhook.
- `TODO` Disabled no está diseñado.
- El label es `color/text/secondary` (set); la tabla de la ficha dice `color/text/tertiary`.
- El texto de ayuda de Figma ("PDF, JPG o PNG") y el de la ficha ("PDF, DWG o JPG") no coinciden; los formatos aceptados son los acordados (PDF, DWG, JPG, PNG).
