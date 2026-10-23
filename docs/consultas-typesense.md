# Consultas a Typesense por pantalla · PENDIENTE

Estado: **sin implementar** (recortado el 2026-10-15). Lo que ya se aplicó está en `docs/decisiones.md` (2026-10-14 · Campos por consulta; 2026-10-15 · Recomendados del buscador): la ficha pide solo sus campos de detalle de un grupo (`loadGroupDetails`) y el resto de las pantallas comparte un catálogo liviano (`loadSource`, `LIGHT_FIELDS`).

## Cuándo retomarlo

Hoy el servidor responde en unos 0,7 s al primer byte (antes 4–5 s) y el catálogo son 326 documentos. Solo vale la pena el rediseño si la latencia vuelve a ser un problema o si el catálogo crece mucho.

## Pendientes

Una consulta por pantalla, en lugar de un único catálogo con todos los documentos. En el código, la regla «solo SKU predeterminados de Luminaria» la aplica el navegador (`catalog.js · isListed`), no una consulta al servidor.

| Pantalla | Consulta propuesta |
| --- | --- |
| **Productos** | `filter_by: product_type:=Luminaria && is_group_default:=true` y solo los campos de la card |
| Productos · colores de la card | Los SKU de Luminaria con solo `product_name` y `color_carcasa`, o un facet `color_carcasa` con `group_by=product_name` |
| Productos · filtros del panel | Facets con `group_by=product_name` (cuentan grupos, no SKU). Requieren `facet: true` en esos campos y en `product_name` |
| **Colección** (`/arq/coleccion/<id>`) | La colección y los productos de su familia |
| **Ficha** | Las cards de «otras familias» todavía dependen del catálogo completo |
| **Comparativa / PDF** | `sku:=[…]` (hasta 3), solo los campos técnicos de esos SKU |
| **Descargas** | La tabla de todos los SKU con sus columnas y la miniatura |
| **Navbar (mega-menú y buscador)** | Una consulta propia y liviana (`sku`, `product_name`, `familia`, `macrofamilia`, `subfamilia`, `product_type`, `is_group_default`, `new`) al primer uso. El buscador filtra en el navegador sobre ese índice; si el servidor queda rápido, podría consultar en vivo |

## Dudas abiertas

- **Campos facet:** confirmar en el schema de Typesense cuáles tienen `facet: true`.
- **Servidor:** activar gzip en nginx (las respuestas siguen sin comprimir). Con gzip, parte de este rediseño no haría falta.

## Al implementarlo

1. Una función por consulta en `src/data/source.js`; `catalog.js` deja de depender de un único catálogo.
2. Verificar comparando la salida de cada pantalla contra la consulta completa (el método de la decisión 2026-10-14).
3. Registrar la decisión en `docs/decisiones.md` y borrar este archivo.
