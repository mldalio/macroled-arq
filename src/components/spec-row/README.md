# spec-row · `<arq-spec-row>`

Fila de especificación técnica: etiqueta y valor, con separador inferior. Va dentro de spec-list (ficha → accordion-item). No confundir con compare-row (comparativa).

- Figma: [922-2497](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=922-2497) · ficha `doc/spec-row` (`1462:9118`)

```html
<arq-spec-row><span slot="label">Flujo luminoso</span>850 lm</arq-spec-row>
<arq-spec-row><span slot="label">Temperatura de color</span>2700 K</arq-spec-row>
```

## Props

| Figma | Slot | Valores |
| --- | --- | --- |
| Label | `label` | nombre de la especificación |
| Value | slot por defecto | valor (texto, como llega de Typesense) |

- **Accesibilidad:** cada fila es un `<dl>` con un `<dt>` (etiqueta) y un `<dd>` (valor). No se arma un `<dl>` único en spec-list porque `<dt>`/`<dd>` no cruzan el Shadow DOM.
- Las filas se agregan o quitan según los datos; la cantidad es libre.

## Tokens

| Parte | Token |
| --- | --- |
| Etiqueta · valor | `color/text/tertiary` · `color/text/primary`, los dos `role/body-regular` |
| Separador | `border/default` en `color/border/subtle` |
| Padding vertical · gap mínimo | `space/padding/md` · `space/gap/lg` |

## Pendientes

- `TODO` Textos largos y mobile: Figma no define si se apilan. Hoy se parten en líneas, etiqueta a la izquierda y valor a la derecha.
