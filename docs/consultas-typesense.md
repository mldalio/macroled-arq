# Consultas a Typesense por pantalla · PENDIENTE

Estado: **diseño, sin implementar** (2026-10-14). Se retoma cuando n8n sincronice el schema nuevo de la hoja. Contexto: `docs/decisiones.md`, 2026-10-14 · Campos por consulta.

## Por qué

El servidor de Typesense es lento (4–5 s al primer byte, ~5 KB/s, sin gzip) y cada documento trae unos 100 campos. Hoy todas las páginas comparten un catálogo de 44 campos (`LIGHT_FIELDS`, 131 KB, ~25 s). Cada pantalla debería pedir solo lo que muestra.

## Estructura de los datos (como la describe el equipo)

- Un documento por SKU. `tipo_producto` es `Luminaria` o `Colección` (columna nueva en la hoja; el adaptador todavía lee `product_type`).
- Cada producto tiene un SKU predeterminado (`is_group_default: true`): es el que representa al grupo en los listados.
- Los listados muestran **un documento por grupo**: el predeterminado.

## Consultas propuestas

| Pantalla | Consulta | Campos |
| --- | --- | --- |
| **Productos** (`/arq/productos`) | `filter_by: tipo_producto:=Luminaria && is_group_default:=true` | `product_name`, `sku` (link y botón Comparar), `multimagen_producto` (principal apagada y encendida) y, para el cambio en hover, `multimagen_ambiente` (contexto) |
| Productos · colores de la card | Todos los SKU de Luminaria, solo 2 campos | `product_name`, `color_carcasa` (se agrupan por producto). Alternativa: facet `color_carcasa` con `group_by=product_name` |
| Productos · filtros del panel | Facets con `group_by=product_name` (cuenta grupos, no SKU) | `potencia`, `temperatura_color` (los de `FILTER_FIELDS`). **Requiere `facet: true`** en esos campos y en `product_name` |
| **Colecciones** (`?view=colecciones`) | `filter_by: tipo_producto:=Colección`, solo con esa vista | `product_name`, fotos de card (`multimagen_coleccion`) y la meta de la card |
| **Colección** (`/arq/coleccion/<id>`) | La colección + los productos de su familia | Textos y galerías de la colección; las cards, como Productos |
| **Ficha** | `product_name:=<grupo>` (ya implementada) | `DETAIL_FIELDS`. Falta que no dependa del catálogo completo para las cards de «otras familias» |
| **Comparativa / PDF** | `sku:=[…]` (hasta 3) | Los campos técnicos de `ATTRIBUTES` solo de esos SKU |
| **Descargas** | Tabla de todos los SKU | Columnas de `GLOSSARY_COLUMNS` + miniatura; archivos por SKU al abrir el modal |
| **Navbar (mega-menú y buscador)** | Una consulta compartida y liviana, al primer clic (no al entrar a la página): todos los documentos | `sku`, `product_name`, `familia`, `macrofamilia`, `subfamilia`, `tipo_producto`, `is_group_default` (~15–20 KB). El buscador filtra en el navegador sobre ese índice |

## Pendientes y dudas

- **Navbar (mega-menu y buscador).** Decisión: consulta propia y compartida, no el catálogo completo (con este servidor, consultar Typesense en cada tecla sería más lento que filtrar local). Si el servidor queda rápido, el buscador podría consultar en vivo y no descargar el índice. Hoy los dos usan el catálogo completo, pero se cargan al abrirlos, no al entrar a la página (`#ensureNavigation`, `#openSheet`). Necesitan nombres, SKU, entorno (`macrofamilia`), aplicación (`subfamilia`) y tipo de todo el catálogo: una consulta chica de esos campos, aparte de la de Productos.
- **Mega-menu vacío.** `getNavigation()` arma las secciones con `macrofamilia`, `subfamilia` y `product_type`; con la base actual esas columnas están vacías o con otro nombre, y devuelve `null` en todas las secciones. Se resuelve al sincronizar el schema (y al pasar el adaptador a `tipo_producto`).
- **Recomendados del buscador.** Hoy son los primeros grupos con foto en el orden de la base (`getRecommendedProducts`), que en la práctica son los SKU predeterminados. Falta definir el criterio real: destacados a mano, novedades (`new`) o más vistos. Ver `decisiones.md`, 2026-10-13 · Búsqueda como top sheet.
- **Colecciones.** El adaptador no las reconoce con la base actual (0 colecciones; la fila «Colección» tiene `product_type` vacío y `tipo_producto: Colección`).
- **Campos facet:** confirmar en el schema de Typesense cuáles tienen `facet: true`.
- **Servidor:** activar gzip en nginx y revisar la latencia (4 s para un documento). Con gzip, parte de este rediseño puede no hacer falta.

## Al implementarlo

1. Actualizar `FIELDS` en `typesense-adapter.js` a los nombres nuevos (`tipo_producto`…) y `docs/typesense-schema.md`.
2. Una función por consulta en `src/data/source.js`; `catalog.js` deja de depender de un único catálogo.
3. Verificar con el mismo método de la decisión 2026-10-14 (comparar la salida de cada pantalla contra la consulta completa).
4. Registrar la decisión en `docs/decisiones.md`.
