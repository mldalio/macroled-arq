# form-section-header · `<arq-form-section-header>`

Título de sección dentro de un formulario largo ("01 Tus datos", "02 Tu proyecto"). Mismo patrón que compare-group. Ancho FILL.

- Figma: [1303-4382](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1303-4382) · ficha `doc/form-section-header` (`1451:5929`)

```html
<fieldset>
  <legend><arq-form-section-header number="01" show-number>Tus datos</arq-form-section-header></legend>
  …
</fieldset>
```

## Props

| Figma | Atributo | Prop JS | Valores · por defecto |
| --- | --- | --- | --- |
| Label | slot por defecto | — | nombre del bloque, en caja normal (la mayúscula la pone `role/label`) |
| Number | `number` | `number` | texto libre ("01") |
| Show number | `show-number` | `showNumber` | booleano. **En Figma viene en `true`; en código, sin el atributo no se ve el número** |

- **Es solo visual.** Un componente con Shadow DOM no puede ser el `<legend>` de un `<fieldset>`: se pone **dentro** del `<legend>` (o de un `<h2>` si no agrupa campos).
- Show number cuando el orden importa; sin él, si los bloques son independientes.
- No se usa como título de página: para eso está page-header.

## Tokens

| Parte | Token |
| --- | --- |
| Número · Label | `color/text/tertiary` · `color/text/primary`, los dos `role/label` |
| Línea inferior | `border/default` en `color/border/strong` |
| Gap · padding inferior | `space/gap/md` · `space/padding/sm-md` |

## Pendientes

- El padding va solo abajo (set de Figma); la ficha dice "padding vertical".
- `TODO` Textos `role/label` en mayúsculas: el nombre accesible del `<legend>` puede quedar en mayúsculas (ver `docs/decisiones.md`).
