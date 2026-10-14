# variants-table · `<arq-variants-table>` (+ variants-table-row)

Tabla de variantes de la ficha (Glosario): una fila por SKU del grupo con sus datos técnicos. El título va aparte, como título de sección. variants-table-row vive adentro: es la fila de la tabla.

- Figma: [1068-5582](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1068-5582) (variants-table) · [923-2708](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=923-2708) (variants-table-row) · fichas `doc/variants-table` y `doc/variants-table-row`

```html
<arq-variants-table downloads="descargas" label="Variantes de Kanu Jardín">
  <arq-button slot="downloads" type="outline" show-icon icon="download" href="…">CAD 2D/3D</arq-button>
  <arq-button slot="downloads" type="outline" show-icon icon="download" href="…">Manual</arq-button>
</arq-variants-table>
<arq-download-modal id="descargas">…</arq-download-modal>
```

```js
tabla.data = {
  columns: [{ key: 'potencia', label: 'Potencia' }, …],          // src/data/attributes.js
  filters: [{ key: 'color_carcasa', label: 'Color', swatches: true }, …],  // VARIANT_ATTRIBUTES; swatches: opciones con muestra (acabados)
  rows: [{ sku: 'KANU-J-500-12W-N-WW', thumb: '…', search: 'Kanu Jardín', attributes: { color_carcasa: 'Negro', altura: '50 cm' }, values: { potencia: '12 W', … } }],
};
tabla.addEventListener('arq:downloads', (e) => llenarModal(e.detail.sku));
```

## Props

| Figma | Atributo / slot | Prop JS | Valores · por defecto |
| --- | --- | --- | --- |
| Filters | `filters` | `filters` | booleano: Off · On. Lo cambia el botón Filtros |
| — (datos) | — | `data` | `{ columns, filters, rows }` (solo JS) |
| — (descargas de la barra) | slot `downloads` | — | `arq-button` Outline con `icon/download` (los archivos del grupo) |
| — | `downloads` | `downloads` | `id` del `arq-download-modal` que abre el ícono de cada fila |
| — | `label` | `label` | Nombre de la región con scroll (único en la página). Por defecto «Variantes» |
| Show search | `show-search` | `showSearch` | booleano. search-field «Buscar por SKU o nombre…» a la derecha, de `layout/search-field` (página Descargas); sin la cantidad al lado de Filtros |
| — (solo de código) | `show-sort` | `showSort` | booleano. select Filter «Ordenar por» a la derecha: SKU (A–Z) · SKU (Z–A). Hoy no lo usa ninguna página |
| Breakpoint | — | — | Media query: hasta 767 px |
| variants-table-row · Type · State | — | — | Header y Row son el `<thead>` y las filas del `<tbody>`; Hover es CSS |

- **Tabla real** (`<table>`, decisión 2026-10-02 · glosario): un lector de pantalla anuncia la columna de cada valor. El SKU es el encabezado de cada fila.
- **Un solo contenedor con scroll** para encabezado y filas (se puede desplazar con el teclado). La columna de inicio (miniatura + sku Compact) y la de descarga quedan fijas (`position: sticky`) con fondo propio. En mobile el scroll llega al borde de la pantalla.
- **Filtros (Ficha v2):** siempre Filled; Off con `icon/filter`, On con `icon/close` y debajo filter-bar con un select por filtro. Al lado, la cantidad («4 variantes», `role/body` en `color/text/secondary`). Las opciones que no dan ninguna fila van deshabilitadas y la tabla muestra solo las filas que cumplen (`src/data/variants.js`: `filterOptions`, `filterVariants`). Al apagar Filtros se limpian.
- **Descarga de cada fila:** columna «Descargas» (`role/body-regular`; en Mobile sin título visible) con icon-button Size=Large, Background=Outline en la ficha y None (sin borde) en Descargas (`show-search`) ("Descargas de <SKU>"); emite `arq:downloads { sku }` y, con `downloads`, abre ese download-modal.
- **Buscador y orden** (Show search en Figma; el orden es solo de código. decisiones.md 2026-10-06 · Descargas): el buscador filtra mientras se escribe por SKU y por `row.search` (nombre del producto y de la colección), sin tildes ni mayúsculas (`searchVariants`); el orden usa `sortVariants` (`src/data/variants.js`). Se combinan con los filtros. Sin filas, la tabla se oculta y aparece «Ningún SKU coincide con la búsqueda o los filtros.»; la cantidad de filas se anuncia en una región `role="status"`.
- **Barra** (centrada en alto, gap `space/gap/md`): Filtros con la cantidad a la izquierda; a la derecha, las descargas (ficha) o el buscador de `layout/search-field` (Descargas; en Mobile ocupa lo que queda de la fila). Con `show-sort`, Ordenar por va a la derecha. Sin botones de descarga, su lugar no ocupa espacio.
- **Mobile (hasta 767 px):** en lugar de la tabla, una variants-table-card por variante (Figma 2399:31269): imagen ratio/wide (16:10), sku Underline con la descarga y los datos en dos columnas (etiqueta `role/body-sm` en `color/text/secondary`, valor `role/body-sm-medium` en `color/text/primary`, separador `color/border/subtle`, padding vertical `space/padding/sm`); entre tarjetas `space/gap/6xl`.
- **Columnas:** miniatura, sku y Descargas miden su contenido; el ancho que sobra se reparte entre las de datos. Del sku a los datos, `space/gap/sm-md`. Descargas va centrada.
- **Columnas fijas:** en Desktop, miniatura y sku (celdas separadas) y Descargas. Hasta 1023 px solo la miniatura y Descargas: el sku se desplaza con los datos (ficha `doc/variants-table`: «mobile: solo miniatura»).
- **Columnas:** miden lo que su contenido (en Figma 96 fijas, sin token). Un valor que falta se muestra como "—".

## Tokens

| Parte | Token |
| --- | --- |
| Barra | padding `space/padding/md` arriba y abajo, sin padding lateral; gap barra–tabla `space/gap/md` |
| Encabezado | `role/body-regular` en `color/text/tertiary`, padding vertical `space/padding/sm-md` |
| Filas | valores `role/body-lg-regular` en `color/text/primary`; sku Size=Underline; padding vertical `space/padding/sm` (en Figma, xs: el botón de descarga quedaba pegado a la línea); Hover `color/surface/faint`; fondo de las fijas `color/surface/default` |
| Separadores | `border/default` en `color/border/subtle` |
| Entre columnas | `space/gap/sm`; sin padding al inicio ni al final |
| Ancho | El del contenido de la página en todos los breakpoints (margen `--page-gutter`, sin gutter adentro): las líneas van de la miniatura al ícono de descarga; la barra de filtros (Ficha v2, `color/surface/soft`) con `layout/gutter` adentro. Scroll horizontal sin barra visible cuando no entra |
| Miniatura | `layout/table-thumb` (100), fondo `color/surface/subtle` |

## Pendientes

- El buscador es la prop Show search del set (`show-search`). «Ordenar por» (`show-sort`) es solo de código y hoy no se usa.

- `TODO` (datos) Columnas del glosario (`docs/typesense-schema.md`, columnas técnicas). La demo usa las de la Ficha de Final con valores de ejemplo.
- Las filas miden 73 (miniatura de 56, `space/padding/sm` arriba y abajo y la línea); en Figma, 72 (la línea va por dentro).
