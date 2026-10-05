# select-menu · `<arq-select-menu>`

Lista desplegable de select: `arq-select-option` en una lista (`role="listbox"`). La arma y la maneja select (opciones, teclado, foco y posición); no se usa suelta.

- Figma: [1061-4867](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1061-4867) · ficha `doc/select-menu`

```html
<!-- dentro del Shadow DOM de arq-select -->
<arq-select-menu type="filter">
  <arq-select-option value="" selected>Todos</arq-select-option>
  <arq-select-option value="Negro" show-swatch swatch-src="…">Negro</arq-select-option>
</arq-select-menu>
```

## Props

| Figma | Atributo | Prop JS | Valores · por defecto |
| --- | --- | --- | --- |
| Type | `type` | `type` | `finishes` (ancho del campo, con muestras) · `filter` (ancho propio, "Todos" primero) · `text` (ancho propio, sin muestras). Por defecto `finishes` |
| — (opciones) | slot por defecto | — | `arq-select-option` |

- Hasta 7 opciones a la vista; con más, la lista tiene scroll. El scroll va en el host, que es el `role="listbox"` con `tabindex="-1"`: una región con scroll tiene que poder recibir el foco (axe: scrollable-region-focusable), y `-1` no suma una parada de Tab (el teclado se maneja desde el campo).
- La usan `arq-select` y `arq-input type="select"` (Type=Text, del ancho del campo).
- Sin sombra (DESIGN.md §5).

## Tokens

| Parte | Token |
| --- | --- |
| Fondo · borde | `color/surface/default` · `border/default` en `color/border/default` |
| Alto máximo | 7 opciones (cada una `space/padding/md` × 2 + una línea de `role/body` + su línea inferior) |
| Ancho Filter · Text | el de sus opciones, al menos el del campo; como máximo, el ancho de la pantalla menos `layout/gutter` × 2 |
