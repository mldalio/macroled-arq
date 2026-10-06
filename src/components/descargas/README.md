# descargas · `<arq-descargas>`

Contenido de la página Descargas (antes Glosario): una variants-table con todos los SKU del catálogo, buscador por SKU o nombre y el download-modal de cada fila. Contenedor de página, sin set en Figma: sale del frame «Descargas (antes Glosario)» (`1801:19315`: Desktop `1808:20165` · Mobile `1808:20882` · modal `1802:30817` / `1802:30903`). Decisión: `docs/decisiones.md`, 2026-10-06 · Descargas.

```html
<arq-page-header type="detail" show-back back-href="/arq/productos" show-description show-action>
  <span slot="back">Volver a productos</span>
  <h1 slot="title">Descargas</h1>
  <p slot="description">…</p>
  <arq-button slot="action" show-icon icon="download" href="…">Descargar catálogo general</arq-button>
</arq-page-header>
<arq-descargas>
  <h2 slot="modal-title">Descargas</h2>
</arq-descargas>
```

El HTML del embed completo está en [src/pages/descargas.html](../../pages/descargas.html).

## Atributos y slots

| Atributo / slot | Contenido |
| --- | --- |
| slot `modal-title` | Título del download-modal |

- El page-header (Type=Detail con Volver y «Descargar catálogo general») va aparte, en el embed, para que quede indexable.

## Comportamiento

- **Filas:** todos los SKU (`getDownloadsTable()` de `src/data/catalog.js`), en el orden de los grupos. Columnas: `GLOSSARY_COLUMNS` (`attributes.js`); las que están vacías en todos los SKU no se muestran.
- **Buscador** (variants-table `show-search`): busca en el SKU, el nombre del producto y el de la colección, sin importar tildes ni mayúsculas, mientras se escribe.
- **Barra:** buscador a todo el ancho y Filtros al lado, en Outline y del mismo alto; igual en Mobile. Sin «Ordenar por» por ahora (variants-table lo tiene con `show-sort`).
- Los archivos llevan los nombres de siempre (CAD 2D/3D, Manual, IES, Fotometría): los formatos de la pantalla de Figma («DWG + STEP», «LDT») son de ejemplo.
- **Filtros:** los selectores de variante de todos los grupos más los filtros de los listados, solo los que tienen al menos dos valores. Buscador y filtros se combinan; las opciones de filtro sin filas van deshabilitadas.
- **Descargas:** la barra no lleva botones. El ícono de cada fila (icon-button Outline) abre el modal con el SKU debajo del título, «Ficha técnica» (emite `arq:datasheet { sku }`) y los archivos de ese SKU (`skuDownloads()`).
- **Estados:** mientras carga (`aria-busy`), «Cargando descargas…»; sin SKU, «Todavía no hay productos para descargar.»; si falla la carga, «No se pudieron cargar las descargas. Probá de nuevo en unos minutos.». Sin filas que cumplan la búsqueda o los filtros, la tabla muestra «Ningún SKU coincide con la búsqueda o los filtros.».

## Tokens

| Parte | Token |
| --- | --- |
| Bloque | padding inferior `space/section/xl`; la tabla pone su propio margen (`--page-gutter`) |
| Estado | `role/body` en `color/text/secondary` |

## Pendientes

- `TODO` (datos): URL del catálogo general (el embed apunta a `#`).
- `TODO` (diseño): el PDF de la ficha técnica no tiene diseño.
- Para decidir con diseño (`docs/decisiones.md` · Pendientes): cómo se muestran muchos SKU (paginación, «Ver más» o agrupado).
