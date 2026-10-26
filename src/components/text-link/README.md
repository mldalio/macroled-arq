# text-link · `<arq-text-link>`

Link de texto: un nombre o una frase que lleva a otra página y sigue el estilo del texto que lo rodea. Sin padding, con la línea pegada al texto y sin la animación de un botón.

- Figma: [2965-9774](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=2965-9774) (sección «Text link» dentro de 3 · Acciones) · ficha `doc/text-link`: `TODO`

```html
<arq-text-link href="/arq/productos/dao">Daö</arq-text-link>
<arq-text-link size="compact" href="/arq/productos/dao?sku=DAO-C-B">Mini Daö Cabezal</arq-text-link>
```

## Props

| Figma | Atributo | Prop JS | Valores |
| --- | --- | --- | --- |
| Label | slot por defecto | — | texto del link (indexable) |
| Size | `size` | `size` | `default` (role/body-regular, 16) · `compact` (role/body-compact-regular, 14). Def. `default` |
| — | `href` | `href` | destino |
| — | `target` | `target` | `_blank` agrega `rel="noopener"` |
| — | `label` | `label` | nombre accesible (`aria-label`), si el texto visible no alcanza |

- Hover, Pressed y Focus son CSS (`:hover` solo con mouse, `:active`, `:focus-visible`).
- **Línea:** `border/default` (1 px) en el color del texto, en el borde inferior de una caja de texto ajustada (`line-height: 1em + border/strong`, o sea 2 px más que el cuerpo: 14 → 16, 16 → 18). Queda a unos 3,5 px de la base de las letras y no toca las colas de g, p, y, q. En un link en línea sin esa caja, la línea quedaría a unos 9 px (el área de contenido de la fuente es más alta que las letras).
- **Hover y Pressed:** no se dibuja otra línea: texto y línea se atenúan juntos a `color/text/tertiary`, con fundido de `motion/duration/base`.
- **Foco:** anillo separado (`border/strong`, offset 2 px, `color/border/focus`); no cambia el tamaño.
- **Una línea:** si el texto baja de renglón, la línea queda debajo de todo el bloque.

## Dónde se usa

- Nombre del producto en variants-table Type=Catalog (Descargas), en la fila y en la tarjeta Mobile (`size="compact"`).
- Piezas del armado de Daö en la ficha (`size="default"`).

## No confundir con

- **button Underline:** es un botón (padding propio, 16/24, línea que se dibuja en hover, con íconos). Se usa para acciones y llamadas («Ver colección», «Volver»).
- **nav-link, footer-link, breadcrumb-item, mega-link, contact-item:** cada uno tiene su lugar y sus estados (Current, Open, íconos).

## Tokens

| Parte | Token |
| --- | --- |
| Texto | `color/text/primary`; hover y pressed `color/text/tertiary` |
| Línea | `border/default`, en el color del texto |
| Caja de texto | `1em + border/strong` |
| Foco | `border/strong`, `color/border/focus` |
| Fundido | `motion/duration/base`, `motion/easing/standard` |
