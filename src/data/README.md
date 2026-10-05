# src/data

Único acceso a datos del front (AGENTS.md · Datos). Los componentes reciben datos; las páginas los piden acá.

| Archivo | Qué hace |
| --- | --- |
| `catalog.js` | API de las páginas: `listProducts`, `listCollections`, `getProduct` + `variantDetails`, `getProductCards`, `getCollection`, `getCompare`, `searchProducts`, `getNavigation` y las URLs (`productHref`…) |
| `source.js` | Elige la fuente: Typesense, mixto o el ejemplo (`VITE_DATA_SOURCE`, solo en `npm run dev`) |
| `typesense.js` | Cliente de Typesense con la search-only key |
| `typesense-adapter.js` | Documentos de Typesense → catálogo. Lo único que cambia cuando la base esté completa |
| `attributes.js` | Etiquetas, secciones y filtros de los campos técnicos |
| `variants.js` | Selectores de variante (funciones puras) |

- Datos de ejemplo: `demo/fixtures/catalogo.json`, con la forma documentada al principio de `catalog.js`.
- Datos mixtos (`VITE_DATA_SOURCE=mixto`): lo que trae Typesense, con lo vacío completado por `demo/fixtures/completar.js` (el ejemplo o datos inventados). No entra al build.
- Decisión: `docs/decisiones.md`, 2026-10-02 · Datos de ejemplo mientras se completa la base.
- Campos del índice real: `docs/typesense-schema.md`.
