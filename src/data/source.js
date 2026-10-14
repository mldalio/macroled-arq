// De dónde salen los datos del catálogo: siempre de Typesense (decisiones.md,
// 2026-10-13 · Datos solo desde Typesense). La configuración sale de
// .env (host, colección y search-only key).
// Devuelve { collections, groups, withDetails }, la forma de catalog.js. Las
// páginas y los componentes no saben de dónde viene.
//
// Dos consultas (decisiones.md, 2026-10-14 · Campos por consulta): el catálogo
// con los campos de LIGHT_FIELDS (todos los documentos) y, solo en la ficha, los
// de DETAIL_FIELDS de un grupo.

import { searchAll, quote } from './typesense.js';
import { fromDocuments, LIGHT_FIELDS, DETAIL_FIELDS } from './typesense-adapter.js';

/** Catálogo liviano: { collections, groups, withDetails }. */
export async function loadSource() {
  return fromDocuments(await searchAll({ q: '*', include_fields: LIGHT_FIELDS.join(',') }));
}

/** Campos de detalle de los SKU de un grupo (product_name exacto). */
export function loadGroupDetails(name) {
  return searchAll({ q: '*', filter_by: `product_name:=${quote(name)}`, include_fields: DETAIL_FIELDS.join(',') });
}
