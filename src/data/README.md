# src/data

Único acceso a datos del front (AGENTS.md · Datos). Los componentes reciben datos; las páginas los piden acá.

| Archivo | Qué hace |
| --- | --- |
| `catalog.js` | API de las páginas: `listProducts`, `listCollections`, `getProduct` + `variantDetails`, `getProductCards`, `getCollection`, `getCompare`, `searchProducts`, `getNavigation` y las URLs (`productHref`…) |
| `source.js` | Elige la fuente: Typesense o el ejemplo (`VITE_DATA_SOURCE=mock`, solo en `npm run dev`) |
| `typesense.js` | Cliente de Typesense con la search-only key |
| `typesense-adapter.js` | Documentos de Typesense → catálogo. Lo único que cambia cuando la base esté completa |
| `attributes.js` | Etiquetas, secciones y filtros de los campos técnicos |
| `variants.js` | Selectores de variante (funciones puras) |

- Datos de ejemplo: `demo/fixtures/catalogo.json`, con la forma documentada al principio de `catalog.js`.
- Decisión: `docs/decisiones.md`, 2026-10-02 · Datos de ejemplo mientras se completa la base.
- Campos del índice real: `docs/typesense-schema.md`.
