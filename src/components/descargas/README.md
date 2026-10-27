# descargas · `<arq-descargas>`

Contenido de la página Descargas: «Buscar archivos por producto» con [variants-table](../variants-table/README.md) type catalog (todos los SKU del catálogo, buscador y filtros de selección múltiple) y el download-modal de cada fila. El catálogo general está en `/arq/catalogos`. Contenedor de página, sin set en Figma: sale de «Descargas · propuesta final (desktop y mobile)» (`2575:22875`: Desktop `2564:20607` · Mobile `2558:20149` · modal `2554:20132` / `2554:20214`), sin el bloque de arriba. Decisión: `docs/decisiones.md`, 2026-10-21 · Descargas sin hero.

```html
<arq-descargas>
  <h1 slot="search-title">Buscar archivos por producto</h1>
  <h2 slot="modal-title">Descargas</h2>
</arq-descargas>
```

El HTML del embed completo está en [src/pages/descargas.html](../../pages/descargas.html). Demo: `/demo/descargas.html`.

## Atributos y slots

| Atributo / slot | Contenido |
| --- | --- |
| slot `search-title` | `<h1>` «Buscar archivos por producto» (`role/heading-1`) |
| slot `modal-title` | Título del download-modal |

- Los textos van por slot desde el embed, para que queden indexables.
- «Buscar archivos por producto»: `space/section/md` arriba (6 rem en Desktop) y la tabla a `space/gap/md`. En esta página, el gap interno de `arq-variants-table` es `space/gap/xl` (2 rem en Desktop). Se mantienen los valores responsive de los tokens y los offsets y padding de la barra y encabezado sticky.

## Comportamiento

- En Desktop, la línea del buscador se ajusta al ancho real del título mediante ResizeObserver, también al cargar la fuente o cambiar el tamaño de pantalla. En Mobile, el fondo de la barra de búsqueda y filtros llega a los bordes y tapa las tarjetas que pasan por debajo; los controles conservan el margen lateral.

- **Filtros:** panel lateral (filter-panel de downloads-table). De las dos propuestas se eligió esta; la desplegable quedó en la historia de la rama `feat/descargas-propuesta`.
- **Filas:** todos los SKU (`getDownloadsTable()` de `src/data/catalog.js`), con el nombre corto del producto (la colección: «Nobu»; con la aplicación si la colección tiene varios productos: «Kanu Pared»; sin colección, la primera palabra: «Skyline»), el link a su ficha (`?sku=`) y la variante («Negro, 6 W, luz cálida») para el modal. Columnas: una por filtro (`DOWNLOAD_FILTERS`), en el mismo orden y con el nombre corto (Temp., Material, Tensión); solo las que tienen algún valor. Todo en una línea: si no entran, la tabla se desliza en horizontal (producto y descarga quedan fijos). Filtros: `DOWNLOAD_FILTERS` (`attributes.js`), en el orden de la propuesta: Montaje, Acabado, Potencia, Temperatura de color, IP, Regulación, CRI, Ángulo, Fuente, Material del cuerpo y Tensión de entrada; solo los que tienen al menos dos valores. Tamaño, Flujo luminoso y Eficiencia no son filtro (casi un valor por SKU) ni columna. `TODO` (diseño): Familia y Fotometría de la propuesta no tienen campo en la base.
- **Modal** (download-modal `show-product`): miniatura, SKU y variante; debajo, download-file-row: «Ficha técnica» (emite `arq:datasheet { sku }`; mientras se genera el PDF la fila dice «Generando…», con la promesa `detail.pending`, como la ficha; si falla, `form-message` Tone=Error con «No se pudo generar la ficha técnica. Probá de nuevo.» debajo de la ficha técnica, en el slot `message` del modal) y los archivos del SKU (`skuDownloads()`), solo con el nombre.
- **Estados:** mientras carga, filas de carga y «Buscando…»; sin SKU, «Todavía no hay productos para descargar.»; si falla la carga, «No se pudieron cargar las descargas. Probá de nuevo en unos minutos.» con «Reintentar» (button Underline; al volver a cargar, el foco va al buscador). `TODO` (diseño): «Reintentar» no está en la propuesta. Sin filas que cumplan, el vacío de downloads-table.
- **Peor caso (demo):** `/demo/descargas.html?data=worst|empty|one|huge|error`, escrito a mano en la URL (`demo/demo-data-toggle.js`).
