# variants-table · `<arq-variants-table>` (+ variants-table-row y variants-table-card)

Tabla de variantes: **un solo componente** para la ficha (Glosario) y para la página Descargas. `type` decide la barra y qué muestran las filas; la tabla, las tarjetas Mobile, los filtros y el difuminado son los mismos (decisiones.md, 2026-10-20 · Una sola variants-table). variants-table-row y variants-table-card viven adentro. Reemplaza al antiguo `<arq-downloads-table>`.

- Figma: [1068-5582](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1068-5582) (variants-table) · [923-2708](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=923-2708) (variants-table-row) · [2399-31269](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=2399-31269) (variants-table-card) · Descargas: «Descargas · propuesta final» [2575-22875](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=2575-22875) · fichas `doc/variants-table` y `doc/variants-table-row`

```html
<!-- Ficha: los SKU de un grupo -->
<arq-variants-table downloads="descargas" label="Variantes de Kanu Jardín">
  <arq-button slot="downloads" type="outline" show-icon icon="download" href="…">CAD 2D/3D</arq-button>
  <arq-button slot="downloads" type="outline" show-icon icon="download" href="…">Manual</arq-button>
</arq-variants-table>

<!-- Descargas: todos los SKU del catálogo -->
<arq-variants-table type="catalog" downloads="descargas"></arq-variants-table>
<arq-download-modal id="descargas">…</arq-download-modal>
```

```js
tabla.data = {
  columns: [{ key: 'potencia', label: 'Potencia' }, …],                    // TABLE_COLUMNS, src/data/attributes.js
  filters: [{ key: 'color_carcasa', label: 'Acabado', swatches: true }, …],  // swatches: opciones con muestra (acabados)
  rows: [{ sku, name, href, meta, thumb, search, attributes: { … }, values: { … } }],
};
tabla.addEventListener('arq:downloads', (e) => llenarModal(e.detail.sku));
```

Los datos los arman `getProduct().glossary` (ficha) y `getDownloadsTable()` (Descargas) en `src/data/catalog.js`.

## Props

| Figma | Atributo / slot | Prop JS | Valores · por defecto |
| --- | --- | --- | --- |
| Type | `type` | `type` | `product` (ficha) · `catalog` (Descargas). Por defecto `product`. En Figma, Type: Product · Catalog (el set ya lo tiene) |
| — (datos) | — | `data` | `{ columns, filters, rows }` (solo JS) |
| — (archivos de la barra) | slot `downloads` | — | `arq-button` Outline con `icon/download` (CAD 2D/3D y Manual del grupo, campos `cad` y `manual` de Typesense). Solo `product`; sin botones, no ocupa lugar |
| — | `downloads` | `downloads` | `id` del `arq-download-modal` que abre el ícono de cada fila |
| — | `label` | `label` | Nombre de la región con scroll (único en la página). Por defecto «Variantes» |
| — | `loading` | `loading` | booleano. Filas (Mobile: tarjetas) de carga y «Buscando…» en la cantidad |
| Breakpoint | — | — | Media query: tarjetas hasta 767 px; columna de sku fija desde 1024 px |
| variants-table-row · Type · State | — | — | Header y Row son el `<thead>` y las filas del `<tbody>`; Hover es CSS |

Se quitaron `show-search` (ahora es `type="catalog"`) y `show-sort` (solo de código, no lo usaba ninguna página).

## Qué cambia con `type`

| | `product` (ficha) | `catalog` (Descargas) |
| --- | --- | --- |
| Barra | Filtros con la cantidad («4 variantes») a la izquierda; CAD 2D/3D y Manual a la derecha | Buscador (search-field `size="medium" show-icon show-clear`, `layout/download-search`, 480) a la izquierda; Filtros a la derecha; debajo del buscador la cantidad («4 productos»); debajo de Filtros, a la derecha, lo aplicado (chips y «Limpiar filtros») |
| Mobile (barra) | Filtros + cantidad, archivos debajo, aplicado abajo | Buscador arriba a todo el ancho; Filtros + cantidad debajo; aplicado abajo |
| Fila | Solo el sku | Nombre del producto sobre el sku |
| Tarjeta Mobile | Descarga (ícono) arriba a la derecha | Igual, con el nombre como link a la ficha |
| Link al producto | No | Nombre y miniatura (con `href`) |
| Búsqueda | No | Por nombre, SKU y `row.search` (`searchVariants`) |
| «Ver más» | No (todas las filas) | De a 100 filas |
| URL | No (la ficha ya usa `?sku=`) | `?q=…&filtro=valor`, con `history.replaceState` |

## En los dos

- **Tabla real** (`<table>`): un lector de pantalla anuncia la columna de cada valor. El SKU es el encabezado de cada fila.
- **Columnas**, en este orden (`TABLE_COLUMNS`): Acabado · Tamaño · Potencia · Temp. · CRI · Flujo lum. · Ángulo · Eficiencia · IP · Regulación. Solo se muestran las que algún SKU tiene cargadas, y al buscar o filtrar, solo las que tienen algún dato en las filas que quedan (todas las que cumplen, no solo la tanda de «Ver más»). **Tamaño** llega en cm de la base y se muestra en **mm** (`toMillimeters`, `src/data/attributes.js`). Un valor que falta se muestra como «—».
- **Barra fija:** solo si la tabla no entra en la pantalla (alto del componente mayor que el de la ventana): con pocas filas, o una búsqueda o filtro con pocos resultados, no se fija. Al desplazar la página, la barra (buscador y Filtros en `catalog`; Filtros y los archivos generales en `product`, con los chips aplicados) queda pegada debajo del navbar, sobre `color/surface/default`, junto con la fila de encabezados. El `<thead>` real no puede quedar fijo (el contenedor con scroll horizontal lo impide): debajo de la barra va una copia (`aria-hidden`) con las mismas columnas, que solo se ve cuando el encabezado real quedó arriba y acompaña el desplazamiento horizontal. Queda a `layout/navbar-height` (56) del borde superior.
- **Jerarquía de texto** (nombre · sku · datos), igual en todos los tamaños: nombre, sku, datos y encabezados en 14 hasta 1919 px; desde 1920 px, sku, datos y encabezados pasan a 16 y el nombre sigue en 14 (todos `role/body-compact-regular`; el sku, con `dense`). Entre el nombre y el sku, `space/gap/sm` (0,5 rem) en la tabla y `space/gap/xs` en la tarjeta Mobile. El nombre va en Regular, igual que los datos, y se distingue solo por ir siempre subrayado (prueba: en Medium llamaba demasiado la atención en Desktop).
- **Encabezado** en `role/body-compact-regular` (sin mayúsculas, 16 desde 1920 px) en `color/text/tertiary`, con fondo `color/surface/soft`; valores en `role/body-lg-regular`.
- **Ancho de columnas:** las de datos «normales» miden lo mismo: el de la más ancha entre ellas (encabezados y valores, medido en el navegador; el máximo y no el promedio, para no cortar nada). Si la tabla es más ancha que sus columnas (pocas columnas o textos cortos), el ancho que sobra se reparte parejo entre todas las columnas de datos: el sku conserva solo lo que mide y no queda un hueco entre el sku y los datos. Una columna **larga** mide lo suyo, el de su valor más largo, y no ensancha a las demás: la que tiene `wide: true` en los datos (hoy Tamaño) o la que pasa de 1,5 veces la mediana de las columnas (por ejemplo Regulación con «Si, mediante fuente DIM»). Se recalcula con cada búsqueda y filtro.
- **Miniatura** de `layout/table-thumb` (100 × 100), la de la ficha. En las tarjetas Mobile, `layout/download-thumb` (72).
- **sku**: Size=Compact (con el ícono de copiar), el de Descargas.
- **Barra de columnas** (ficha y Descargas, solo si la tabla no entra en el ancho): reemplaza a la barra de scroll nativa, que quedaría al final de cientos de filas. Es `<arq-carousel-controls buttons="none" progress="scroll">`: la línea de progreso de la Home (trazo de `border/strong` sobre la pista fina), sin flechas ni contador, a todo el ancho de la tabla. El trazo mide la parte visible y sigue el scroll. Va abajo, con `space/padding/sm` (0,5 rem) arriba y abajo, para que se aprecie como indicador de desplazamiento y no como adorno, pegada al borde inferior de la pantalla mientras la tabla está a la vista (fondo `color/surface/default`). No se muestra en Mobile (tarjetas). No es interactiva (decorativa, `aria-hidden`): la tabla se desplaza con trackpad, touch o teclado.
- **Columnas fijas:** miniatura, sku (desde 1024 px; hasta 1023 px se desplaza con los datos) y Descargas. **Difuminado** de `space/gap/3xl` junto a las fijas, del transparente al fondo de la fila, mientras queda tabla por ver de ese lado.
- **Filtros:** el botón (Filled, `icon/filter`) abre filter-panel (panel lateral derecho en Desktop, pantalla completa en Mobile), una filter-row de checkbox por filtro. «Ver N …» aplica; cerrar descarta. Selección múltiple: dentro de un filtro, cualquiera de los valores; entre filtros, todos. Las opciones que no darían filas con la búsqueda y lo marcado se ocultan (lo marcado queda siempre), y también los filtros con una sola opción visible; se recalcula con cada cambio (`src/data/variants.js`; decisiones.md, 2026-10-22 · Filtros que no aplican). «Borrar todo» aplica en el momento. El botón dice «Filtros (N)»; debajo, los filtros aplicados como filter-chip y «Limpiar filtros».
- **Descarga de cada fila:** icon-button Size=Large Background=Outline («Descargas de <SKU>»); emite `arq:downloads { sku }` y, con `downloads`, abre ese download-modal.
- **Mobile (hasta 767 px):** una tarjeta por variante (nombre `role/body-compact-regular`, sku Compact `dense` y datos, etiqueta y valor, `role/body-compact-regular` y `role/body-compact-medium`, 14 px): miniatura, sku (con nombre en `catalog`) y la descarga (icon-button Large Outline) arriba a la derecha; debajo, seis datos en dos columnas, etiqueta y valor sin espacio entre sí (Potencia · Temp. · CRI · Flujo lum. · Acabado · Tamaño: `CARD_COLUMNS`). En `catalog` (Descargas) cada tarjeta muestra solo los datos que su SKU tiene cargados, sin «—»; la tabla Desktop sigue con «—» para no correr las columnas. Sin botones de texto. La última fila de datos no lleva línea (debajo está la de la tarjeta). La línea que separa las tarjetas es `border/default` en `color/border/default` (más marcada que la de los datos) y va de borde a borde de la pantalla; el contenido conserva el margen de página.
- **Link al producto** (solo `catalog`, con `href` en la fila): el nombre y la miniatura son un link a la ficha, con el sku elegido, en la tabla y en las tarjetas Mobile. El nombre se subraya con el mouse; la miniatura no entra en el orden de tabulación (un solo link por producto para teclado y lectores de pantalla). No es clickeable la fila entera (chocaría con la descarga, copiar el sku y seleccionar texto). Reemplaza al botón «Ver producto» de las tarjetas. En la ficha no hay link: las variantes son de la misma ficha.
- **Cargando**, **vacío** (con la causa: filtros, búsqueda o las dos) y fundido de la primera carga, como en Descargas.

## Tokens

| Parte | Token |
| --- | --- |
| Barra | padding vertical `space/padding/md`; gap `space/gap/md` (columnas en `catalog`: `space/gap/lg`) |
| Encabezado | `role/body-compact-regular` (16 desde 1920 px) en `color/text/tertiary`, fondo `color/surface/soft`, padding vertical `space/padding/sm-md` |
| Filas | valores `role/body-compact-regular` (16 desde 1920 px) en `color/text/primary`; sku `dense` (14, 16 desde 1920 px); nombre `role/body-compact-regular` (14 siempre), subrayado; padding vertical `space/padding/sm`; Hover `color/surface/faint` |
| Separadores | `border/default` en `color/border/subtle` |
| Entre columnas | `space/gap/lg`; del sku a los datos `space/gap/xl` |
| Ancho | El del contenido de la página (margen `--page-gutter`); las líneas van de la miniatura al ícono de descarga. Scroll horizontal sin barra nativa (la reemplaza la barra de columnas) |
| Miniatura | `layout/table-thumb` (100), fondo `color/surface/subtle` |
| Difuminado | `space/gap/3xl`, `color/surface/transparent` → fondo de la celda |

## Pendientes

- Figma (2026-10-20): el set variants-table tiene Type (Product · Catalog), State (Default · Applied: chips y «Limpiar filtros»), Breakpoint y Show more («Ver más productos», solo Catalog); la fila suma Show name · Name; sku suma Size=Dense; las fichas `doc/` y las descripciones están al día. El modal de filtros es filter-panel (ya existe).
- `TODO` (diseño): vacío de `product` (hoy el de Descargas con «variantes»); tarjetas Mobile de la ficha con los mismos cuatro datos que Descargas; «Ver más productos».
- `cad` y `manual` de la barra salen del SKU predeterminado del grupo (`is_group_default`; sin marca, el primero), porque la base no tiene archivos por grupo. Mientras esos campos estén vacíos, los botones no aparecen.
- La barra de columnas (línea de progreso y flechas) es una excepción a «sin barra de scroll visible» (DESIGN.md §2) en los dos types: actualizar DESIGN.md y Figma. 
