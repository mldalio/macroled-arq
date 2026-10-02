// Cliente de Typesense: único lugar del front que habla con el servidor
// (AGENTS.md · Datos). Usa solo la search-only key de src/config.js.
//
//   import { search, searchAll, getBySkus, facets } from '../data/typesense.js';
//   const { hits, found } = await search({ q: '*', filter_by: 'macrofamilia:=Exterior' });
//
// - Todas las funciones devuelven documentos tal como vienen de la base. La
//   conversión a datos de componente (etiquetas, grupos, filas) va en otros
//   módulos de src/data/.
// - Los valores de filter_by se escapan con quote(): los SKU pueden tener
//   espacios o paréntesis.
// - Las respuestas se guardan en memoria por URL mientras dure la página.

import { config } from '../config.js';

const PER_PAGE_MAX = 250; // tope de Typesense por página

const cache = new Map();

/** Error de Typesense con el código HTTP y el mensaje del servidor. */
export class TypesenseError extends Error {
  constructor(status, message) {
    super(`Typesense ${status}: ${message}`);
    this.name = 'TypesenseError';
    this.status = status;
  }
}

/** ¿Está configurado el acceso (.env)? */
export function isConfigured() {
  const { host, searchKey, collection } = config.typesense;
  return Boolean(host && searchKey && collection);
}

/** Valor para filter_by entre comillas invertidas: `KANU-J (doble)`. */
export function quote(value) {
  return '`' + String(value).replaceAll('`', '') + '`';
}

/** Filtro "campo en esta lista": sku:=[`A`,`B`]. */
export function inFilter(field, values) {
  return `${field}:=[${values.map(quote).join(',')}]`;
}

async function request(params, { signal } = {}) {
  if (!isConfigured()) throw new TypesenseError(0, 'falta configurar VITE_TYPESENSE_* en .env');
  const { host, searchKey, collection } = config.typesense;
  const query = new URLSearchParams({ q: '*', ...params });
  const url = `${host.replace(/\/$/, '')}/collections/${encodeURIComponent(collection)}/documents/search?${query}`;
  if (cache.has(url)) return cache.get(url);
  const pending = fetch(url, { headers: { 'X-TYPESENSE-API-KEY': searchKey }, signal }).then(async (response) => {
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new TypesenseError(response.status, body.message ?? response.statusText);
    return body;
  });
  cache.set(url, pending);
  pending.catch(() => cache.delete(url)); // un error no queda guardado
  return pending;
}

/**
 * Una búsqueda. params: los de Typesense (q, query_by, filter_by, facet_by,
 * sort_by, per_page, page…). Devuelve { hits: documentos, found, facets }.
 */
export async function search(params = {}, options) {
  const body = await request(params, options);
  return {
    hits: (body.hits ?? []).map((hit) => hit.document),
    found: body.found ?? 0,
    facets: Object.fromEntries((body.facet_counts ?? []).map((f) => [f.field_name, f.counts.map(({ value, count }) => ({ value, count }))])),
  };
}

/** Todos los documentos que cumplen el filtro (recorre las páginas). */
export async function searchAll(params = {}, options) {
  const first = await search({ ...params, per_page: PER_PAGE_MAX, page: 1 }, options);
  const pages = Math.ceil(first.found / PER_PAGE_MAX);
  const rest = await Promise.all(
    Array.from({ length: Math.max(0, pages - 1) }, (_, i) => search({ ...params, per_page: PER_PAGE_MAX, page: i + 2 }, options)),
  );
  return [first, ...rest].flatMap((page) => page.hits);
}

/** Documentos de estos SKU, en el mismo orden (los que no existen se omiten). */
export async function getBySkus(skus, options) {
  if (!skus.length) return [];
  const docs = await searchAll({ filter_by: inFilter('sku', skus) }, options);
  const bySku = new Map(docs.map((doc) => [doc.sku, doc]));
  return skus.map((sku) => bySku.get(sku)).filter(Boolean);
}

/** Valores y cantidades de campos facet: { familia: [{ value, count }] }. */
export async function facets(fields, params = {}, options) {
  const { facets: result } = await search({ ...params, per_page: 0, facet_by: fields.join(','), max_facet_values: 100 }, options);
  return result;
}
