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
  - `arq:add` de compare-header (compare-product vacío o «Agregar producto» de la cabecera compacta) → abre `compare-picker`. Lo que se agrega se suma a `?sku=` y la comparación se vuelve a armar detrás del modal. Al cerrar, si el lugar vacío ya tiene producto, el foco va al próximo lugar vacío o al nombre del último producto.
- Después de cada carga actualiza `?sku=` (`history.replaceState`, como `ficha-producto`) y `localStorage` `arq:compare` (la misma clave que lee/escribe `compare-bar`), para que la selección siga igual al volver a Productos o Colecciones.
- Sin productos (`?sku=` vacío o ningún SKU existe en el catálogo): mensaje con link a Productos, sin mostrar compare-header ni compare-table.
- **Mobile (como macroled.com.ar/comparativa):** un solo contenedor con scroll horizontal (`.scroll`) para los productos de compare-header y los valores de compare-table (los dos con `embedded`), así el gesto horizontal y el vertical no se traban. La etiqueta de cada compare-row y los títulos de grupo quedan fijos (sticky). La cabecera Compact (fija) sigue ese desplazamiento y, si se desliza ella, lo mueve. El toggle de Default va en una fila propia; el de Compact queda debajo de sus productos, ambos sincronizados.

## Pendientes

- **Descargar comparación** (botón con `icon/download` en `page-header` con `data-arq-print`, fuera de este componente) abre el diálogo de impresión del navegador, como macroled.com.ar/comparativa; desde ahí se imprime o se guarda como PDF. La tabla se imprime como en Desktop (etiqueta a la izquierda, valores al lado), sin scroll ni columnas vacías y oculta navbar (queda el logo), page-header (queda el título), toggle, selects, quitar, cta-block y footer. Mientras se imprime, `document.title` pasa a «Comparativa · <productos> · Macroled Arq», el nombre que propone el navegador al guardar.
- `TODO` (diseño): la versión impresa / PDF no tiene diseño en Figma (se armó como la de Macroled; DESIGN.md §12 · Descargar comparación). El botón volvió a «Descargar comparación» con `icon/download`, como Figma (Comparativa · cambios), y sigue abriendo el diálogo de impresión.
- **Bajada:** completa `[data-arq-compare-count]` del page-header con la cantidad («3 luminarias seleccionadas.»).
