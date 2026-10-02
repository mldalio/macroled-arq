# swatch · `<arq-swatch>`

Muestra de acabado (único swatch del sistema). Siempre cuadrada. El relleno es la imagen del acabado; si falta, queda `color/surface/subtle`.

- Figma: [1063-4880](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1063-4880) · ficha `doc/swatch` (`1430:2649`)

```html
<!-- Solo visual: product-card, filtros -->
<arq-swatch src="https://…/black.jpg">Negro texturado</arq-swatch>

<!-- Elegible: dentro de swatch-picker (role="radiogroup") -->
<arq-swatch role="radio" size="large" selected value="black" src="https://…/black.jpg">Negro texturado</arq-swatch>
<arq-swatch role="radio" size="default" value="white" src="https://…/white.jpg">Blanco</arq-swatch>
```

## Props

| Figma | Atributo | Prop JS | Valores · por defecto |
| --- | --- | --- | --- |
| — (nombre del acabado) | slot por defecto | — | **Obligatorio.** Queda oculto y es el nombre accesible (`aria-label`) |
| Size | `size` | `size` | `small` (16) · `default` (20) · `large` (24). **Por defecto `small`**, como en Figma (Size=Default no es el valor por defecto) |
| State=Selected | `selected` | `selected` | booleano |
| State=Disabled | `disabled` | `disabled` | booleano. Acabado sin combinación con las otras opciones elegidas: no se puede elegir (`aria-disabled="true"`) y las flechas del grupo la saltean |
| — (imagen del fill) | `src` | `src` | URL de la imagen del acabado (de los datos) |
| — | `value` | `value` | valor del acabado (slug en inglés) |

- **Solo visual** por defecto: `role="img"` con el nombre del acabado. Así va en product-card y en los filtros (State=Default).
- **Elegible** con `role="radio"`, que lo pone swatch-picker: clic, Enter o Espacio la eligen y emite `arq:change` con `{ value, selected: true }`. Tiene Hover, Selected y Focus. Las flechas las maneja el grupo (`SingleSelect`).
- En swatch-picker la elegida va en `size="large"` + `selected` y el resto en `size="default"`.

## Tokens

| Parte | Token |
| --- | --- |
| Tamaño | `swatch/sm` · `swatch/md` · `swatch/lg` |
| Borde Default | `border/default` en `color/border/subtle` |
| Borde Hover · Selected | `border/strong` (2 px) en `color/border/strong`, por dentro: no cambia el tamaño |
| Disabled | borde `border/default` en `color/border/disabled` + línea diagonal `border/default` en `color/icon/tertiary`, sobre la imagen. Sin Hover |
| Fondo sin imagen | `color/surface/subtle` |
| Radio | `radius/control` |
| Foco | `border/strong` en `color/border/focus`, separado 2 px (DESIGN.md §7) |

## Pendientes

- `TODO` (datos) URL de la imagen: falta el campo en Typesense, la URL base del servidor de imágenes y el archivo de mapeo de acabados (nombre de Sheets → slug en inglés). Faltan también los códigos N, V, R, B, BN, P (DESIGN.md §12).
- `TODO` "Neutro con el nombre" cuando falta la imagen: en 16–24 px no entra texto; hoy queda el fondo `color/surface/subtle` y el nombre solo para lectores de pantalla.
- El tratamiento de Disabled (línea diagonal) se sumó en Figma el 2026-10-02 como propuesta: falta que diseño lo confirme.
