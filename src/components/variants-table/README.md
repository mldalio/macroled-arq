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
  filters: [{ key: 'color_carcasa', label: 'Color' }, …],     // VARIANT_ATTRIBUTES
  rows: [{ sku: 'KANU-J-500-12W-N-WW', thumb: '…', attributes: { color_carcasa: 'Negro', altura: '50 cm' }, values: { potencia: '12 W', … } }],
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
| Breakpoint | — | — | Media query: hasta 767 px |
| variants-table-row · Type · State | — | — | Header y Row son el `<thead>` y las filas del `<tbody>`; Hover es CSS |

- **Tabla real** (`<table>`, decisión 2026-10-02 · glosario): un lector de pantalla anuncia la columna de cada valor. El SKU es el encabezado de cada fila.
- **Un solo contenedor con scroll** para encabezado y filas (se puede desplazar con el teclado). La columna de inicio (miniatura + sku Compact) y la de descarga quedan fijas (`position: sticky`) con fondo propio. En mobile el scroll llega al borde de la pantalla.
- **Filtros:** Off, botón Filled con `icon/filter`; On, Outline con `icon/filter-off` y debajo filter-bar con un select por filtro. Las opciones que no dan ninguna fila van deshabilitadas y la tabla muestra solo las filas que cumplen (`src/data/variants.js`: `filterOptions`, `filterVariants`). Al apagar Filtros se limpian.
- **Descarga de cada fila:** icon-button Background=Subtle ("Descargas de <SKU>"); emite `arq:downloads { sku }` y, con `downloads`, abre ese download-modal.
- **Columnas:** miden lo que su contenido (en Figma 96 fijas, sin token). Un valor que falta se muestra como "—".

## Tokens

| Parte | Token |
| --- | --- |
| Barra | padding `space/padding/md` × `layout/gutter`; gap barra–tabla `space/gap/md` |
| Encabezado | `role/label` en `color/text/tertiary`, padding vertical `space/padding/sm-md` |
| Filas | valores `role/body` en `color/text/primary`; Hover `color/surface/faint`; fondo de las fijas `color/bg/default` |
| Separadores | `border/default` en `color/border/subtle` |
| Entre columnas | `space/gap/sm`; `layout/gutter` al inicio y al final |
| Miniatura | `layout/table-thumb` (56, token nuevo), fondo `color/surface/subtle` |

## Pendientes

- `TODO` (datos) Columnas del glosario (`docs/typesense-schema.md`, columnas técnicas). La demo usa las de la Ficha de Final con valores de ejemplo.
- Las filas miden 57 (la miniatura de 56 más la línea); en Figma, 56.
