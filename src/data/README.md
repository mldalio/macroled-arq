# src/data

Único acceso a datos del front (AGENTS.md · Datos). Los componentes reciben datos; las páginas los piden acá.

| Archivo | Qué hace |
| --- | --- |
| `catalog.js` | API de las páginas: `listProducts`, `listCollections`, `getProduct` + `variantDetails`, `getProductCards`, `getCollection`, `getCompare`, `searchProducts`, `getNavigation` y las URLs (`productHref`…) |
| `source.js` | Carga el catálogo desde Typesense (único origen de datos) |
| `typesense.js` | Cliente de Typesense con la search-only key |
| `typesense-adapter.js` | Documentos de Typesense → catálogo: grupos por nombre, colecciones, accesorios e imágenes por posición (`docs/typesense-schema.md`) |
| `attributes.js` | Etiquetas, secciones y filtros de los campos técnicos |
| `variants.js` | Selectores de variante (funciones puras) |

- Configuración: `.env` (host, colección y search-only key). Si falta algo, el error de la consola dice qué variable.
- Decisión: `docs/decisiones.md`, 2026-10-13 · Datos solo desde Typesense.
- Campos del índice real: `docs/typesense-schema.md`.
