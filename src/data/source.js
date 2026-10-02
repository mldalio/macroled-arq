// De dónde salen los datos del catálogo (decisiones.md, 2026-10-02 · Datos de
// ejemplo): Typesense o el catálogo de ejemplo (demo/fixtures/catalogo.json).
//
// - VITE_DATA_SOURCE=mock en .env usa el ejemplo. Solo funciona con
//   `npm run dev`: el build (dist/arq.js) siempre usa Typesense y no incluye
//   el ejemplo.
// - Las dos fuentes devuelven la misma forma ({ collections, groups }, ver
//   catalog.js). Las páginas y los componentes no saben cuál se usa.

import { searchAll } from './typesense.js';
import { fromDocuments } from './typesense-adapter.js';

export const useMock = import.meta.env.DEV && import.meta.env.VITE_DATA_SOURCE === 'mock';

/** Catálogo crudo: { collections, groups }. */
export async function loadSource() {
  if (useMock) {
    const { default: mock } = await import('../../demo/fixtures/catalogo.json');
    return structuredClone({ collections: mock.collections, groups: mock.groups });
  }
  return fromDocuments(await searchAll({ q: '*' }));
}
