// De dónde salen los datos del catálogo (decisiones.md, 2026-10-02 · Datos de
// ejemplo y 2026-10-05 · Ficha 60/40, scroll de la galería de ambiente y datos mixtos).
//
// VITE_DATA_SOURCE en .env, solo con `npm run dev`:
// - typesense (o sin valor): el índice tal como está.
// - mixto: el índice, con lo que falta completado por demo/fixtures/completar.js
//   (catálogo de ejemplo o datos inventados), para probar el layout.
// - mock: solo el catálogo de ejemplo (demo/fixtures/catalogo.json).
// El build (dist/arq.js) siempre usa Typesense y no incluye el ejemplo.
// Las fuentes devuelven la misma forma ({ collections, groups }, ver
// catalog.js). Las páginas y los componentes no saben cuál se usa.

import { searchAll } from './typesense.js';
import { fromDocuments } from './typesense-adapter.js';

const mode = import.meta.env.DEV ? import.meta.env.VITE_DATA_SOURCE : 'typesense';

/** Catálogo crudo: { collections, groups }. */
export async function loadSource() {
  if (import.meta.env.DEV && (mode === 'mock' || mode === 'mixto')) {
    const { default: mock } = await import('../../demo/fixtures/catalogo.json');
    if (mode === 'mock') return structuredClone({ collections: mock.collections, groups: mock.groups });
    const { completarDocumentos, completarCatalogo } = await import('../../demo/fixtures/completar.js');
    const docs = completarDocumentos(await searchAll({ q: '*' }), mock);
    return completarCatalogo(fromDocuments(docs), structuredClone(mock));
  }
  return fromDocuments(await searchAll({ q: '*' }));
}
