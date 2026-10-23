// De dónde salen los datos del catálogo: siempre de Typesense (decisiones.md,
// 2026-10-13 · Datos solo desde Typesense). La configuración sale de
// .env (host, colección y search-only key).
// Devuelve { collections, groups, withDetails }, la forma de catalog.js. Las
// páginas y los componentes no saben de dónde viene.
//
// Dos consultas (decisiones.md, 2026-10-14 · Campos por consulta): el catálogo
// con los campos de LIGHT_FIELDS (todos los documentos) y, solo en la ficha, los
// de DETAIL_FIELDS de un grupo.
//
// El catálogo liviano se guarda en sessionStorage (arq:catalog) para que las
// páginas siguientes de la misma visita no lo vuelvan a pedir: se usa lo guardado
// y, pasado CATALOG_TTL, se actualiza por detrás para la próxima página.
// Al recargar la página (F5) o con ?arq-nocache en la URL se pide siempre al
// servidor: así un cambio en Sheets se ve al instante.

import { searchAll, inFilter } from './typesense.js';
import { fromDocuments, LIGHT_FIELDS, DETAIL_FIELDS } from './typesense-adapter.js';
import { config } from '../config.js';

const CACHE_KEY = 'arq:catalog';
const CATALOG_TTL = 60 * 1000;

// Si cambia el servidor, la colección o los campos pedidos, lo guardado no sirve.
const signature = () => [config.typesense.host, config.typesense.collection, LIGHT_FIELDS.join(',')].join('|');

function readCache() {
  try {
    if (new URLSearchParams(location.search).has('arq-nocache')) return null;
    if (performance.getEntriesByType('navigation')[0]?.type === 'reload') return null; // F5: datos frescos
    const saved = JSON.parse(sessionStorage.getItem(CACHE_KEY));
    return saved?.signature === signature() && Array.isArray(saved.docs) ? saved : null;
  } catch {
    return null; // sin storage o JSON roto: se pide al servidor
  }
}

function writeCache(docs) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ signature: signature(), at: Date.now(), docs }));
  } catch {
    /* storage lleno o no disponible: no se guarda, no es crítico */
  }
}

async function fetchCatalogDocs() {
  const docs = await searchAll({ q: '*', include_fields: LIGHT_FIELDS.join(',') });
  writeCache(docs);
  return docs;
}

/** Catálogo liviano: { collections, groups, withDetails }. */
export async function loadSource() {
  const saved = readCache();
  if (!saved) return fromDocuments(await fetchCatalogDocs());
  if (Date.now() - saved.at > CATALOG_TTL) fetchCatalogDocs().catch(() => {}); // actualiza para la próxima página
  return fromDocuments(saved.docs);
}

// SKU por consulta: la lista va en la URL (un grupo grande no entra en una sola).
const DETAIL_CHUNK = 80;

/** Campos de detalle de los SKU de un grupo. Un grupo puede reunir varios product_name: se pide por SKU. */
export async function loadGroupDetails(skus) {
  const chunks = Array.from({ length: Math.ceil(skus.length / DETAIL_CHUNK) }, (_, i) => skus.slice(i * DETAIL_CHUNK, (i + 1) * DETAIL_CHUNK));
  const pages = await Promise.all(chunks.map((chunk) => searchAll({ q: '*', filter_by: inFilter('sku', chunk), include_fields: DETAIL_FIELDS.join(',') })));
  return pages.flat();
}
