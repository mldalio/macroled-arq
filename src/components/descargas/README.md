# descargas · `<arq-descargas>`

Contenido de la página Descargas: arriba, el título con su bajada y el catálogo general (tapa, nombre, bajada y «Descargar catálogo»); debajo, «Buscar archivos por producto» con [downloads-table](../downloads-table/README.md) (todos los SKU del catálogo, buscador y filtros de selección múltiple) y el download-modal de cada fila. Contenedor de página, sin set en Figma: sale de «Descargas · propuesta final (desktop y mobile)» (`2575:22875`: Desktop `2564:20607` · Mobile `2558:20149` · modal `2554:20132` / `2554:20214`). Decisión: `docs/decisiones.md`, 2026-10-15 · Descargas · propuesta final.

```html
<arq-descargas catalog-href="…/catalogo.pdf">
  <h1 slot="title">Descargas</h1>
  <span slot="description">…</span>
  <img slot="catalog-cover" src="…" alt="">
  <span slot="catalog-title">Catálogo Macroled ARQ 2026</span>
  <span slot="catalog-description">…</span>
  <span slot="catalog-action">Descargar catálogo</span>
  <h2 slot="search-title">Buscar archivos por producto</h2>
  <h2 slot="modal-title">Descargas</h2>
</arq-descargas>
```

El HTML del embed completo está en [src/pages/descargas.html](../../pages/descargas.html). Demo: `/demo/descargas.html`.

## Atributos y slots

| Atributo / slot | Contenido |
| --- | --- |
| `catalog-href` | URL del PDF del catálogo general (se abre en otra pestaña). Sin URL, «Descargar catálogo» no se muestra |
| slot `title` | `<h1>` de la página (`role/display`) |
| slot `description` | Bajada (`role/body-regular` en `color/text/secondary`, hasta `layout/measure`) |
| slot `catalog-cover` | `<img>` de la tapa del catálogo (4:5), de `layout/catalog-cover` (168 · Mobile 104) |
| slot `catalog-title` | Nombre del catálogo (`role/heading-3`; Mobile `role/body-xl`) |
| slot `catalog-description` | Bajada del catálogo (`role/body` en `color/text/secondary`; Mobile `role/body-compact-regular` en `color/text/tertiary`) |
| slot `catalog-action` | Texto del botón (Desktop button Outline, Mobile Underline, con `icon/download`) |
| slot `search-title` | `<h2>` «Buscar archivos por producto» (`role/heading-1`) |
| slot `modal-title` | Título del download-modal |

- Los textos van por slot desde el embed, para que queden indexables.
- Bloque de arriba: `space/section/sm` arriba; Desktop, textos a la izquierda y el catálogo a la derecha (tapa y textos a `space/gap/lg`); Mobile, apilados a `space/gap/xl`, con la tapa chica a `space/gap/md`. «Buscar archivos por producto»: `space/section/sm` arriba y la tabla a `space/gap/md`.

## Comportamiento

- **Filtros:** panel lateral (filter-panel de downloads-table). De las dos propuestas se eligió esta; la desplegable quedó en la historia de la rama `feat/descargas-propuesta`.
- **Filas:** todos los SKU (`getDownloadsTable()` de `src/data/catalog.js`), con el nombre corto del producto (la colección: «Nobu»; con la aplicación si la colección tiene varios productos: «Kanu Pared»; sin colección, la primera palabra: «Skyline»), el link a su ficha (`?sku=`) y la variante («Negro, 6 W, luz cálida») para el modal. Columnas: una por filtro (`DOWNLOAD_FILTERS`), en el mismo orden y con el nombre corto (Temp., Material, Tensión); solo las que tienen algún valor. Todo en una línea: si no entran, la tabla se desliza en horizontal (producto y descarga quedan fijos). Filtros: `DOWNLOAD_FILTERS` (`attributes.js`), en el orden de la propuesta: Montaje, Acabado, Potencia, Temperatura de color, IP, Regulación, CRI, Ángulo, Fuente, Material del cuerpo y Tensión de entrada; solo los que tienen al menos dos valores. Tamaño, Flujo luminoso y Eficiencia no son filtro (casi un valor por SKU) ni columna. `TODO` (diseño): Familia y Fotometría de la propuesta no tienen campo en la base.
- **Modal** (download-modal `show-product`): miniatura, SKU y variante; debajo, download-file-row: «Ficha técnica» (emite `arq:datasheet { sku }`; mientras se genera el PDF la fila dice «Generando…», con la promesa `detail.pending`, como la ficha) y los archivos del SKU (`skuDownloads()`), solo con el nombre.
- **Estados:** mientras carga, filas de carga y «Buscando…»; sin SKU, «Todavía no hay productos para descargar.»; si falla la carga, «No se pudieron cargar las descargas. Probá de nuevo en unos minutos.» con «Reintentar» (button Underline; al volver a cargar, el foco va al buscador). `TODO` (diseño): «Reintentar» no está en la propuesta. Sin filas que cumplan, el vacío de downloads-table.
- **Peor caso (demo):** `/demo/descargas.html?data=worst|empty|one|huge|error`, escrito a mano en la URL (`demo/demo-data-toggle.js`).

## Pendientes

- `TODO` (datos): URL del catálogo general y su portada (la demo usa la de Figma).
- La bajada del catálogo es distinta en Desktop («Todas las familias, con especificaciones…») y Mobile («Catálogo general en PDF, 24 MB») en la propuesta: va un solo texto.
