# descargas · `<arq-descargas>`

Contenido de la página Descargas: arriba, el título con su bajada y la download-card del catálogo general; debajo, «Buscar producto» con una variants-table (todos los SKU del catálogo, buscador por SKU o nombre) y el download-modal de cada fila. Contenedor de página, sin set en Figma: sale del frame «Descargas (antes Glosario)» (`1801:19315`: Desktop `2496:31316` · Mobile `2496:31862` · modal `1802:30817` / `1802:30903`). Decisión: `docs/decisiones.md`, 2026-10-06 · Descargas; diseño nuevo de 2026-10-14 (sin page-header).

```html
<arq-descargas>
  <h1 slot="title">Descargas</h1>
  <span slot="description">…</span>
  <arq-download-card slot="catalog" href="…" show-description>
    <span slot="title">Catálogo Macroled ARQ 2026</span>
    <span slot="description">Un catálogo por familia de producto</span>
  </arq-download-card>
  <h2 slot="search-title">Buscar producto</h2>
  <h2 slot="modal-title">Descargas</h2>
</arq-descargas>
```

El HTML del embed completo está en [src/pages/descargas.html](../../pages/descargas.html).

## Atributos y slots

| Atributo / slot | Contenido |
| --- | --- |
| slot `title` | `<h1>` de la página (`role/display`) |
| slot `description` | Bajada (`role/body-lg` en `color/text/secondary`, hasta `layout/measure`) |
| slot `catalog` | `arq-download-card` del catálogo general (`layout/measure-wide`) |
| slot `search-title` | `<h2>` «Buscar producto» (`role/display-sm`) |
| slot `modal-title` | Título del download-modal |

- Los textos van por slot desde el embed, para que queden indexables.
- Bloque de arriba: `space/section/sm` arriba y abajo; Desktop, textos a la izquierda y tarjeta a la derecha (arriba alineados); Mobile, apilados a `space/gap/xl`. «Buscar producto»: `space/section/sm` arriba y la tabla a `space/gap/md`.
- `TODO` (token): en Figma la columna del título mide 300, sin variable: la bajada usa `layout/measure` (400).

## Comportamiento

- **Filas:** todos los SKU (`getDownloadsTable()` de `src/data/catalog.js`), en el orden de los grupos. Columnas: `GLOSSARY_COLUMNS` (`attributes.js`); las que están vacías en todos los SKU no se muestran.
- **Buscador** (variants-table `show-search`): busca en el SKU, el nombre del producto y el de la colección, sin importar tildes ni mayúsculas, mientras se escribe.
- **Barra:** Filtros (Filled) a la izquierda y el buscador a la derecha, de `layout/search-field`; en Mobile el buscador ocupa lo que queda de la fila. Sin la cantidad ni «Ordenar por» (variants-table lo tiene con `show-sort`).
- Los archivos llevan los nombres de siempre (CAD 2D/3D, Manual, IES, Fotometría): los formatos de la pantalla de Figma («DWG + STEP», «LDT») son de ejemplo.
- **Filtros:** los selectores de variante de todos los grupos más los filtros de los listados, solo los que tienen al menos dos valores. Buscador y filtros se combinan; las opciones de filtro sin filas van deshabilitadas.
- **Descargas:** la barra no lleva botones. El ícono de cada fila (icon-button Large sin borde, Background=None) abre el modal con el SKU debajo del título, «Ficha técnica» (emite `arq:datasheet { sku }`) y los archivos de ese SKU (`skuDownloads()`).
- **Estados:** mientras carga (`aria-busy`), «Cargando descargas…»; sin SKU, «Todavía no hay productos para descargar.»; si falla la carga, «No se pudieron cargar las descargas. Probá de nuevo en unos minutos.». Sin filas que cumplan la búsqueda o los filtros, la tabla muestra «Ningún SKU coincide con la búsqueda o los filtros.».

## Tokens

| Parte | Token |
| --- | --- |
| Bloque | padding inferior `space/section/xl`; la tabla pone su propio margen (`--page-gutter`) |
| Estado | `role/body` en `color/text/secondary` |

## Pendientes

- `TODO` (datos): URL del catálogo general (el embed apunta a `#`).
- `TODO` (diseño): mensaje de error si no se puede generar la ficha técnica en PDF (la genera `src/pdf/` con `arq:datasheet`). La opción del modal (download-item) no tiene estado de carga: la pestaña nueva se abre en el clic.
- Para decidir con diseño (`docs/decisiones.md` · Pendientes): cómo se muestran muchos SKU (paginación, «Ver más» o agrupado).
