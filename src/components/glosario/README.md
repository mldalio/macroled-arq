# glosario · `<arq-glosario>`

Contenido de la página Glosario: una variants-table con todos los SKU del catálogo y el download-modal de cada fila. Contenedor de página, sin set en Figma: sale de la pantalla Glosario de Final (`1795:18553` Desktop · `1795:18955` Mobile). Decisión: `docs/decisiones.md`, 2026-10-05 · Glosario.

```html
<arq-page-header show-breadcrumb show-description>…breadcrumb, <h1> y bajada…</arq-page-header>
<arq-glosario>
  <h2 slot="modal-title">Descargas</h2>
</arq-glosario>
```

El HTML del embed completo está en [src/pages/glosario.html](../../pages/glosario.html).

## Atributos y slots

| Atributo / slot | Contenido |
| --- | --- |
| slot `modal-title` | Título del download-modal |

- El page-header va aparte, en el embed, para que quede indexable.

## Comportamiento

- **Filas:** todos los SKU, en el orden de los grupos (`getGlossary()` de `src/data/catalog.js`). Columnas: `GLOSSARY_COLUMNS` (`attributes.js`); las que están vacías en todos los SKU no se muestran.
- **Filtros:** los selectores de variante de todos los grupos más los filtros de los listados, solo los que tienen al menos dos valores. Funcionan igual que en la ficha (README de variants-table).
- **Descargas:** la barra no lleva botones (en la ficha son los archivos del grupo). El ícono de cada fila abre el modal con "Ficha técnica" (emite `arq:datasheet { sku }`) y los archivos de ese SKU (`skuDownloads()`).
- **Estados:** mientras carga (`aria-busy`), "Cargando glosario…"; sin SKU, "Todavía no hay productos en el glosario."; si falla la carga, "No se pudo cargar el glosario. Probá de nuevo en unos minutos.".

## Tokens

| Parte | Token |
| --- | --- |
| Bloque | padding inferior `space/section/xl`; la tabla pone su propio margen (`--page-gutter`) |
| Estado | `role/body` en `color/text/secondary` |

## Pendientes

- `TODO` (diseño): el PDF de la ficha técnica no tiene diseño.
- Para decidir con diseño (`docs/decisiones.md` · Pendientes): columna o filtro de colección / producto, cómo se muestran muchos SKU y qué filtros van para todo el catálogo.
