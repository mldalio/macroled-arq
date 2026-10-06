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
| — (solo de código) | `show-search` | `showSearch` | booleano. search-field «Buscar por SKU o nombre…» a la izquierda de Filtros (página Descargas) |
| — (solo de código) | `show-sort` | `showSort` | booleano. select Filter «Ordenar por» a la derecha: SKU (A–Z) · SKU (Z–A). Hoy no lo usa ninguna página |
| Breakpoint | — | — | Media query: hasta 767 px |
| variants-table-row · Type · State | — | — | Header y Row son el `<thead>` y las filas del `<tbody>`; Hover es CSS |

- **Tabla real** (`<table>`, decisión 2026-10-02 · glosario): un lector de pantalla anuncia la columna de cada valor. El SKU es el encabezado de cada fila.
- **Un solo contenedor con scroll** para encabezado y filas (se puede desplazar con el teclado). La columna de inicio (miniatura + sku Compact) y la de descarga quedan fijas (`position: sticky`) con fondo propio. En mobile el scroll llega al borde de la pantalla.
- **Filtros:** Off, botón Filled con `icon/filter` (con `show-search`, Outline); On, Outline con `icon/filter-off` y debajo filter-bar con un select por filtro. Las opciones que no dan ninguna fila van deshabilitadas y la tabla muestra solo las filas que cumplen (`src/data/variants.js`: `filterOptions`, `filterVariants`). Al apagar Filtros se limpian.
- **Descarga de cada fila:** columna «Descargas» (`role/label`; en Mobile sin título visible) con icon-button Size=Large Background=Outline ("Descargas de <SKU>"); emite `arq:downloads { sku }` y, con `downloads`, abre ese download-modal.
- **Buscador y orden** (solo de código, decisiones.md 2026-10-06 · Descargas): el buscador filtra mientras se escribe por SKU y por `row.search` (nombre del producto y de la colección), sin tildes ni mayúsculas (`searchVariants`); el orden usa `sortVariants` (`src/data/variants.js`). Se combinan con los filtros. Sin filas, la tabla se oculta y aparece «Ningún SKU coincide con la búsqueda o los filtros.»; la cantidad de filas se anuncia en una región `role="status"`.
- **Barra** (alineada abajo, gap `space/gap/md`): sin buscador (ficha), Filtros a la izquierda y las descargas a la derecha. Con buscador (Descargas), el buscador a todo el ancho y Filtros al lado, a `space/gap/sm-md`, igual en Mobile. Filtros va siempre en Outline (Filled competiría con la acción del page-header) y toma el alto del buscador (42; el button mide 40). Con `show-sort`, Ordenar por va a la derecha (en Mobile, en la fila de abajo). Sin botones de descarga, su lugar no ocupa espacio.
- **Columnas:** la de inicio y la de Descargas miden su contenido; el ancho que sobra se reparte entre las de datos. Del sku a los datos, `space/gap/lg`. Descargas va centrada.
- **Columnas:** miden lo que su contenido (en Figma 96 fijas, sin token). Un valor que falta se muestra como "—".

## Tokens

| Parte | Token |
| --- | --- |
| Barra | padding `space/padding/md` arriba y abajo, sin padding lateral; gap barra–tabla `space/gap/md` |
| Encabezado | `role/label` en `color/text/tertiary`, padding vertical `space/padding/sm-md` |
| Filas | valores `role/body` en `color/text/primary`; padding vertical `space/padding/sm` (en Figma, xs: el botón de descarga quedaba pegado a la línea); Hover `color/surface/faint`; fondo de las fijas `color/bg/default` |
| Separadores | `border/default` en `color/border/subtle` |
| Entre columnas | `space/gap/sm`; sin padding al inicio ni al final |
| Ancho | El del contenido de la página en todos los breakpoints (margen `--page-gutter`, sin gutter adentro): las líneas van de la miniatura al ícono de descarga; la barra de filtros con `space/padding/md` adentro. Scroll horizontal sin barra visible cuando no entra |
| Miniatura | `layout/table-thumb` (56, token nuevo), fondo `color/surface/subtle` |

## Pendientes

- `TODO` (Figma): buscador y orden son solo de código; el set de variants-table no tiene esas props (están en la pantalla 1808:20165). En Figma el icon-button de la fila mide 36 (sin token): en código es Size=Large (48). El encabezado «Descargas» va en `color/text/tertiary` como el resto (en la pantalla, secondary).

- `TODO` (datos) Columnas del glosario (`docs/typesense-schema.md`, columnas técnicas). La demo usa las de la Ficha de Final con valores de ejemplo.
- Las filas miden 73 (miniatura de 56, `space/padding/sm` arriba y abajo y la línea); en Figma, 56.
