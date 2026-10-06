# comparativa · `<arq-comparativa>`

Combina **compare-header** y **compare-table** con los SKU de `?sku=` (hasta 3, los arma `compare-bar` en Productos/Colecciones). Es un contenedor de página, sin set propio en Figma: sale de la pantalla Comparativa de Final (`1227:12373`), igual que `ficha-producto` y `catalog-listing`.

```html
<arq-comparativa></arq-comparativa>
```

El HTML del embed completo está en [src/pages/comparativa.html](../../pages/comparativa.html).

## Cómo funciona

- Lee `?sku=` al conectarse y pide los datos a `getCompare()` (`src/data/catalog.js`): no recibe nada por atributo ni por slot.
- Reparte esos datos entre `<arq-compare-header>` (identidad + selects de cada columna) y `<arq-compare-table>` (filas agrupadas), y sincroniza entre los dos:
  - `arq:differences` de compare-header → `onlyDifferences` de compare-table.
  - `arq:remove { sku }` de compare-header → saca ese SKU y vuelve a pedir los datos.
  - `arq:change { index, field, value }` de compare-header → `field` es un atributo de variante (`altura`, `color_carcasa`…): resuelve el SKU de esa combinación con `skuForAttribute()`, la misma lógica que el configurador de la ficha, y vuelve a pedir los datos.
- Después de cada carga actualiza `?sku=` (`history.replaceState`, como `ficha-producto`) y `localStorage` `arq:compare` (la misma clave que lee/escribe `compare-bar`), para que la selección siga igual al volver a Productos o Colecciones.
- Sin productos (`?sku=` vacío o ningún SKU existe en el catálogo): mensaje con link a Productos, sin mostrar compare-header ni compare-table.
- **Mobile:** la etiqueta de cada compare-row y los controles quedan fijos; solo las tiras de valores y productos hacen scroll horizontal. `arq-comparativa` sincroniza esas tiras entre filas y Header Default/Compact. El toggle de Default va en una fila propia; el de Compact queda debajo de sus productos, ambos sincronizados.

## Pendientes

- `TODO` (diseño + código): "Descargar comparación" (botón en `page-header`, fuera de este componente) todavía no hace nada — falta el diseño del PDF (`DESIGN.md` §12 · Ficha técnica en PDF).
