# src/data

Único acceso a datos del front (AGENTS.md · Datos). Los componentes reciben datos; las páginas los piden acá.

| Archivo | Qué hace |
| --- | --- |
| `catalog.js` | API de las páginas: `listProducts`, `listCollections`, `getProduct` + `variantDetails`, `getProductCards`, `getCollection`, `getCompare`, `searchProducts`, `getNavigation` y las URLs (`productHref`…) |
| `source.js` | Carga desde Typesense (único origen de datos): el catálogo liviano (`LIGHT_FIELDS`) y el detalle de un grupo para la ficha (`DETAIL_FIELDS`) |
| `typesense.js` | Cliente de Typesense con la search-only key |
| `typesense-adapter.js` | Documentos de Typesense → catálogo: grupos por nombre, colecciones, accesorios e imágenes por posición (`docs/typesense-schema.md`) |
| `attributes.js` | Etiquetas, secciones y filtros de los campos técnicos |
| `variants.js` | Selectores de variante (funciones puras) |

- Configuración: `.env` (host, colección y search-only key). Si falta algo, el error de la consola dice qué variable.
- Decisiones: `docs/decisiones.md`, 2026-10-13 · Datos solo desde Typesense y 2026-10-14 · Campos por consulta. Un campo nuevo que use una pantalla se agrega a `LIGHT_FIELDS` o `DETAIL_FIELDS` (`typesense-adapter.js`); si no, llega vacío.
- Campos del índice real: `docs/typesense-schema.md`.
