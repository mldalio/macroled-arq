# swatch-picker · `<arq-swatch-picker>`

Selector de acabado por muestras: una fila de `arq-swatch` que funciona como grupo de radios. Va dentro de option-group Type=Swatches, que le pasa su etiqueta.

- Figma: [1063-4881](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1063-4881) · ficha `doc/swatch-picker` (`1461:8862`)

```html
<arq-option-group type="swatches" label="Color">
  <arq-swatch-picker>
    <arq-swatch value="Negro" selected src="https://…/negro.jpg">Negro</arq-swatch>
    <arq-swatch value="Verde" src="https://…/verde.jpg">Verde</arq-swatch>
    <arq-swatch value="Terracota" disabled>Terracota</arq-swatch>
  </arq-swatch-picker>
</arq-option-group>
```

## Props

| Figma | Atributo | Prop JS | Valores |
| --- | --- | --- | --- |
| — (muestras) | slot por defecto | — | `arq-swatch`, cantidad libre |
| — | `label` | `label` | Nombre accesible del grupo. option-group lo completa con su etiqueta si no viene |

- **Comportamiento:** `role="radiogroup"` con `SingleSelect` (`src/base/single-select.js`): una sola elegida, flechas, Inicio / Fin y las deshabilitadas se saltean. Cada muestra es `role="radio"` (no hace falta escribirlo: un swatch dentro del picker es elegible solo).
- **Tamaño automático:** la elegida va en Size=Large y el resto en Size=Default, como el set. No se escribe `size` en las muestras.
- **Evento:** el `arq:change` de la muestra elegida (`{ value, selected: true }`) sale del picker.
- Si las muestras no entran en una línea, bajan a la siguiente.

## Tokens

| Parte | Token |
| --- | --- |
| Gap entre muestras | `space/gap/sm-md` |
| Muestras | ver `swatch` |

## Pendientes

- `TODO` (datos) Imágenes de los acabados: sin definir (DESIGN.md §12). Sin imagen queda el neutro `color/surface/subtle`.
