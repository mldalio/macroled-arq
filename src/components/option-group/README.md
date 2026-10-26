# option-group · `<arq-option-group>`

Grupo de configuración de la ficha con etiqueta: elige un atributo de la variante (color, altura, potencia…). Las opciones llegan por slot y la cantidad es libre.

- Figma: [921-2560](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=921-2560) · ficha `doc/option-group` (`1461:9308`)

```html
<!-- Type=Tiles (por defecto): altura, potencia, temperatura -->
<arq-option-group label="Altura">
  <arq-option-tile value="50 cm" selected>50 cm</arq-option-tile>
  <arq-option-tile value="90 cm" disabled>90 cm</arq-option-tile>
</arq-option-group>

<!-- Type=Swatches: acabado -->
<arq-option-group type="swatches" label="Color">
  <arq-swatch-picker>
    <arq-swatch value="Negro" selected src="https://…/negro.jpg">Negro</arq-swatch>
  </arq-swatch-picker>
</arq-option-group>
```

## Props

| Figma | Atributo | Prop JS | Valores · por defecto |
| --- | --- | --- | --- |
| Label | `label` | `label` | Texto de la etiqueta (`role/label`, la mayúscula la pone el estilo) |
| Type | `type` | `type` | `tiles` · `swatches` · `select`. **Por defecto `tiles`** |
| — (solo de código) | `value` | `value` | valor elegido junto a la etiqueta («COLOR Negro»); solo visual (`aria-hidden`). La ficha lo usa en Swatches |
| — (opciones) | slot por defecto | — | Tiles: `arq-option-tile`. Swatches: un `arq-swatch-picker` |

- **Tiles:** el propio grupo es el `role="radiogroup"` (con `aria-label` = etiqueta) y usa `SingleSelect`: una sola elegida, flechas, Inicio / Fin, saltea las deshabilitadas. Los tiles van en **Hug content** (miden lo que su texto) y, si no entran en una línea, bajan a la siguiente (decisión 2026-10-02).
- **Cards (solo de código, configurador de Daö):** como Tiles, pero sus option-tile pasan a Type=Card (caja con título y subtítulo), a `space/gap/sm` entre cajas y entre filas. Es un `radiogroup`. Con `label-hidden` la etiqueta no se ve pero queda como nombre accesible (el paso ya tiene su título). `TODO` (diseño): Type=Cards no está en el set.
- **Swatches:** el radiogroup es el `arq-swatch-picker` de adentro; el grupo le pasa su etiqueta como nombre. No hay dos radiogroups anidados.
- **Select:** un `arq-select` (Field) por slot. Por la decisión del 2026-10-02 queda sin uso por ahora.
- **Etiqueta:** visible en el Shadow DOM y repetida como `aria-label` (un `aria-labelledby` no cruza el Shadow DOM). La ficha `doc/option-group` pide `<fieldset>` + `<legend>`: un radiogroup con nombre da el mismo anuncio y deja las flechas de un grupo de radios.
- **Evento:** el `arq:change` de la opción elegida (`{ value, selected: true }`) sale del grupo.
- **Qué opción va deshabilitada** lo decide `src/data/variants.js` (combinaciones que existen); el grupo solo muestra el estado. Etiqueta y control de cada atributo: `src/data/attributes.js`.
- La separación entre grupos en la ficha (`space/gap/xl-2xl`) la pone la página.

## Tokens

| Parte | Token |
| --- | --- |
| Gap etiqueta–opciones | `space/gap/md` |
| Etiqueta | `role/label` en `color/text/tertiary` (antes `secondary`, 2026-10-21) |
| Valor elegido (`value`) | `role/body-sm` en `color/text/secondary`, a `space/gap/sm` de la etiqueta |
| Gap entre tiles | `space/gap/lg` entre opciones, `space/gap/sm` entre filas (2026-10-21, sin caja; en Figma, `space/gap/sm`: TODO) |
| Opciones | ver `option-tile` y `swatch-picker` |
