// De dónde salen los datos del catálogo: siempre de Typesense (decisiones.md,
// 2026-10-13 · Datos solo desde Typesense). La configuración sale de
// .env (host, colección y search-only key).
// Devuelve { collections, groups }, la forma de catalog.js. Las páginas y los
// componentes no saben de dónde viene.

import { searchAll } from './typesense.js';
import { fromDocuments } from './typesense-adapter.js';

/** Catálogo crudo: { collections, groups }. */
export async function loadSource() {
  return fromDocuments(await searchAll({ q: '*' }));
}
