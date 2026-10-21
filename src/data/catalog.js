// Catálogo: lo que usan las páginas (AGENTS.md · Datos: los componentes reciben
// datos, no consultan). Carga el catálogo una vez (source.js: Typesense o el
// ejemplo) y resuelve en memoria listados, filtros, fichas, comparativa,
// búsqueda y navegación (decisiones.md, 2026-10-02 · Listados: una sola consulta).
//
//   import { listProducts, getProduct } from '../data/catalog.js';
//   const { cards, count } = await listProducts({ environment: 'Exterior', filters: { potencia: ['12W'] } });
//
// Forma del catálogo:
//   collection: { id, name, intro, description, images: { menu, studio, studioOn, context, contextOn, gallery[], description, inspiration[] } }
//   group: { id, name, family, collection, productType, hasDefault, menuImage, environment[], application, variantAttributes[],
//            story, inspiration, video, images: { ambient[], description, inspiration }, specs: { campo: valor },
//            variants: [{ sku, isDefault, description, attributes: { campo: valor },
//                         images: { main, studio, studioOn, context, contextOn, gallery[], galleryOn[] },
//                         downloads: { ies, cad, manual, fotometria } }] }
// specs vale para todas las variantes del grupo; attributes de la variante pisa o completa.

import { loadSource, loadGroupDetails } from './source.js';
import { ATTRIBUTES, DOWNLOAD_FILTERS, TABLE_COLUMNS, attributeInfo, specSections, tableValues } from './attributes.js';
import { variantOptions, findVariant, choose } from './variants.js';
import { normalize, queryWords, matchWords } from './text.js';
import { finishImage } from './finishes.js';

let pending = null;

/** El catálogo, cargado una sola vez por página. */
export function loadCatalog() {
  pending ??= loadSource().then(index);
  pending.catch(() => (pending = null)); // un error permite reintentar
  return pending;
}

function index({ collections, groups, withDetails }) {
  const collectionById = new Map(collections.map((c) => [c.id, c]));
  for (const group of groups) link(group, collectionById);
  return { collections, groups, collectionById, groupById: new Map(groups.map((g) => [g.id, g])), withDetails };
}

function link(group, collectionById) {
  group.collectionData = collectionById.get(group.collection) ?? null;
  for (const variant of group.variants) variant.values = { ...group.specs, ...variant.attributes };
  group.defaultVariant = group.variants.find((v) => v.isDefault) ?? group.variants[0];
}

// Detalle de un grupo (descripción, descargas, fotos y textos de la ficha): una
// consulta por grupo, filtrada por nombre. Se vuelca sobre el mismo objeto del
// catálogo para que lo que ya lo referencia (cards, colección) siga igual.
const detailed = new Map();

function ensureDetails(group) {
  if (!detailed.has(group.id)) {
    const request = (async () => {
      const catalog = await loadCatalog();
      Object.assign(group, catalog.withDetails(group.id, await loadGroupDetails(group.name)));
      link(group, catalog.collectionById);
      return group;
    })();
    detailed.set(group.id, request);
    request.catch(() => detailed.delete(group.id)); // un error permite reintentar
  }
  return detailed.get(group.id);
}

// ── URLs (docs/urls.md) ──────────────────────────────────────────────
export const productHref = (groupId, sku) => `/arq/producto/${encodeURIComponent(groupId)}${sku ? `?sku=${encodeURIComponent(sku)}` : ''}`;
export const collectionHref = (id) => `/arq/coleccion/${encodeURIComponent(id)}`;
export const compareHref = (skus) => `/arq/comparativa?sku=${skus.map(encodeURIComponent).join(',')}`;
// TODO (urls): las URLs de categoría están PENDIENTES (docs/urls.md). Por ahora, parámetros del listado.
export function categoryHref({ environment, application, productType, collection } = {}) {
  const params = new URLSearchParams();
  if (environment) params.set('environment', environment);
  if (application) params.set('application', application);
  if (productType) params.set('product_type', productType);
  if (collection) params.set('collection', collection);
  const query = params.toString();
  return `/arq/productos${query ? `?${query}` : ''}`;
}

// ── Filtros ──────────────────────────────────────────────────────────
const hasValue = (value) => value !== undefined && value !== null && String(value).trim() !== '';

/** ¿La variante cumple los filtros { campo: [valores] }? (O dentro de un campo, Y entre campos.) */
function variantMatches(variant, filters) {
  return Object.entries(filters).every(([field, values]) => !values?.length || values.includes(variant.values[field]));
}

/** Primera variante del grupo que cumple (first si cumple; si no, la predeterminada). */
function matchingVariant(group, filters, first = group.defaultVariant) {
  const ordered = [first, group.defaultVariant, ...group.variants].filter((v, i, all) => all.indexOf(v) === i);
  return ordered.find((variant) => variantMatches(variant, filters)) ?? null;
}

// Qué productos se listan (Productos, categorías y navegación): los que tienen SKU
// predeterminado marcado en la base (is_group_default), una card por grupo. Sin
// product_type en la categoría, solo Luminarias: las colecciones no son productos
// y accesorios, lámparas y artefactos se ven en su categoría. La búsqueda (?q=) y
// las fichas no usan esta regla: encuentran todo.
const isListed = (group, productType) => group.hasDefault && (productType ? true : group.productType === 'Luminaria');

function inCategory(group, { environment, application, productType, collection } = {}) {
  if (environment && !group.environment.includes(environment)) return false;
  if (application && group.application !== application) return false;
  if (productType && group.productType !== productType) return false;
  if (collection && group.collection !== collection) return false;
  return true;
}

const activeFilters = (filters = {}) => Object.fromEntries(Object.entries(filters).filter(([, v]) => v?.length));

/**
 * Filas del filter-panel para un conjunto de grupos: [{ name, label, options:
 * [{ value, count }] }]. count: grupos con alguna variante con ese valor.
 * Los filtros salen de los datos (decisiones.md, 2026-10-21 · Filtros de
 * Productos según los datos): es filtro todo campo técnico (ATTRIBUTES, en ese
 * orden) con al menos dos valores en la categoría, salvo los marcados
 * filter: false.
 */
const FILTER_FIELDS = Object.keys(ATTRIBUTES).filter((field) => ATTRIBUTES[field].filter !== false);

function filterRows(groups) {
  return FILTER_FIELDS.map((field) => {
    const counts = new Map();
    for (const group of groups) {
      for (const value of new Set(group.variants.map((v) => v.values[field]).filter(hasValue))) counts.set(value, (counts.get(value) ?? 0) + 1);
    }
    const options = [...counts].map(([value, count]) => ({ value, count })).sort((a, b) => String(a.value).localeCompare(String(b.value), 'es', { numeric: true }));
    return { name: field, label: attributeInfo(field).label, options };
  }).filter((row) => row.options.length > 1);
}

// ── Cards ────────────────────────────────────────────────────────────
function meta(group) {
  if (group.productType && group.productType !== 'Luminaria') return group.productType;
  return [group.environment.join(' · '), group.application].filter(Boolean).join(' · ');
}

// Acabados de la card (Show finishes): valores únicos de los campos con
// control 'swatches' (attributes.js) entre las variantes del grupo, cada uno con
// su imagen: { name, src }. src sale de finishes.js (nombre + familia del grupo)
// y es null si el acabado no tiene imagen (docs/acabados.md).
const FINISH_FIELDS = Object.keys(ATTRIBUTES).filter((field) => ATTRIBUTES[field].control === 'swatches');
const finishNames = (group) => [...new Set(group.variants.flatMap((v) => FINISH_FIELDS.map((field) => v.values[field])).filter(hasValue))];
// Orden en la card: negro, blanco, terracota, verde y después el resto (en el
// orden en que vienen). «Negro satinado» cuenta como negro.
const FINISH_ORDER = ['negro', 'blanco', 'terracota', 'verde'];
const finishRank = (name) => {
  const base = String(name).normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toLowerCase().split(/\s+/)[0];
  const rank = FINISH_ORDER.indexOf(base);
  return rank === -1 ? FINISH_ORDER.length : rank;
};
const byFinishOrder = (list) => list.map((finish, i) => [finish, i]).sort((a, b) => finishRank(a[0].name) - finishRank(b[0].name) || a[1] - b[1]).map(([finish]) => finish);
const finishes = (group) => byFinishOrder(finishNames(group).map((name) => ({ name, src: finishImage(name, group.family) })));
// Las cards de colección juntan los acabados de varios grupos: se repite solo
// el que tiene el mismo nombre y la misma imagen.
const uniqueFinishes = (list) => byFinishOrder([...new Map(list.map((finish) => [`${finish.name}|${finish.src}`, finish])).values()]);

// Acabado de una variante (el primer campo de acabado con valor)
const finishOf = (variant) => FINISH_FIELDS.map((field) => variant.values[field]).find(hasValue);

// Variante que muestra la card sin que nadie haya elegido una (sin filtros ni
// SKU buscado): la del primer acabado en el orden de la card (negro primero),
// con la predeterminada del grupo antes que las demás de ese acabado. Con
// filtros, la primera que los cumple en ese mismo orden. null si ninguna.
function firstFinishVariant(group, active = {}) {
  const rank = (variant) => finishRank(finishOf(variant) ?? '');
  const ordered = [group.defaultVariant, ...group.variants]
    .filter((v, i, all) => all.indexOf(v) === i)
    .map((v, i) => [v, i])
    .sort((a, b) => rank(a[0]) - rank(b[0]) || a[1] - b[1])
    .map(([v]) => v);
  return ordered.find((variant) => variantMatches(variant, active)) ?? null;
}

// Acabados elegibles de la card de producto: cada acabado con lo que cambia al
// elegirlo (SKU, link y las cuatro fotos de la variante de ese acabado) y cuál
// es el que se ve (selected). La variante de cada acabado es la que se ve si ya
// tiene ese acabado, si no la predeterminada o la primera que lo tiene,
// prefiriendo las que cumplen los filtros activos. Con un solo acabado no hay
// nada que elegir: queda la lista simple.
function finishOptions(group, shown, active = {}) {
  const list = finishes(group);
  if (list.length < 2) return list;
  return list.map((finish) => {
    const own = [shown, group.defaultVariant, ...group.variants].filter((v, i, all) => all.indexOf(v) === i && finishOf(v) === finish.name);
    const variant = own.find((v) => variantMatches(v, active)) ?? own[0];
    const images = pick(variant.images);
    return {
      ...finish,
      selected: finishOf(shown) === finish.name,
      sku: variant.sku,
      href: productHref(group.id, variant.sku),
      image: images.studio ?? null,
      imageHover: images.studioOn ?? images.context ?? null,
      imageLit: images.studioOn ?? null,
      imageHoverLit: images.contextOn ?? null,
    };
  });
}

// Las fotos son de la variante que muestra la card; sin fotos propias, la card
// muestra el fondo neutro con el nombre (ver variantDetails).
function productCard(group, variant = firstFinishVariant(group) ?? group.defaultVariant, active = {}) {
  const images = pick(variant.images);
  return {
    id: group.id,
    sku: variant.sku,
    name: group.name,
    meta: meta(group),
    finishes: finishOptions(group, variant, active),
    href: productHref(group.id, variant.sku), // la URL siempre lleva el SKU, también el predeterminado
    // Reposo: hero (img_main). Hover sin Iluminar: hero encendido (img_main_on); con Iluminar:
    // ambiente 1 encendido (img_ambient_1_on). Vale donde se use la card (docs/decisiones.md,
    // 2026-10-16 · Hover de product-card). Sin hero encendido, el hover cae al ambiente 1.
    image: images.studio ?? null,
    imageHover: images.studioOn ?? images.context ?? null,
    imageLit: images.studioOn ?? null,
    imageHoverLit: images.contextOn ?? null,
  };
}

const pick = (object = {}) => Object.fromEntries(Object.entries(object).filter(([, v]) => hasValue(v) && (!Array.isArray(v) || v.length)));

function collectionCard(collection, groups) {
  const applications = [...new Set(groups.map((g) => g.application).filter(Boolean))];
  const images = collection.images ?? {};
  return {
    id: collection.id,
    name: collection.name,
    meta: applications.join(' · '),
    finishes: uniqueFinishes(groups.flatMap(finishes)),
    href: collectionHref(collection.id),
    image: images.studio ?? null,
    imageHover: images.context ?? null,
    imageLit: images.studioOn ?? null,
    imageHoverLit: images.contextOn ?? null,
  };
}

// ── Listados ─────────────────────────────────────────────────────────
/**
 * Listado de Productos: una card por grupo. category: { environment,
 * application, productType, collection }. filters: { campo: [valores] }.
 * query: texto de la búsqueda (?q=), con el criterio de searchProducts.
 * Devuelve { cards, count, filters: filas del filter-panel de la categoría
 * (y de la búsqueda) }.
 */
export async function listProducts({ filters, query, ...category } = {}) {
  const { groups } = await loadCatalog();
  const words = queryWords(query ?? '');
  const found = new Map();
  for (const group of groups) {
    if (!inCategory(group, category)) continue;
    if (!words.length && !isListed(group, category.productType)) continue;
    const match = words.length ? searchMatch(group, words) : { variant: group.defaultVariant, bySku: false };
    if (match) found.set(group, match);
  }
  // Con búsqueda, primero los que coinciden tal cual y después los con errores de tipeo
  const scope = [...found.keys()].sort((a, b) => Number(found.get(a).typo) - Number(found.get(b).typo));
  const active = activeFilters(filters);
  const withFilters = Object.keys(active).length > 0;
  const cards = scope.flatMap((group) => {
    const match = found.get(group);
    // Sin SKU buscado, la card arranca en el primer acabado (negro)
    const variant = match.bySku ? matchingVariant(group, active, match.variant) : firstFinishVariant(group, active);
    return variant ? [productCard(group, variant, active)] : [];
  });
  return demoListing({ cards, count: cards.length, filters: filterRows(scope) });
}

/** Cuántas cards daría un listado con estos filtros (para "Ver N productos"). */
export async function countProducts(options) {
  return (await listProducts(options)).count;
}

/** Listado de Colecciones: una card por colección con algún grupo que cumple. */
export async function listCollections({ filters } = {}) {
  const { collections, groups } = await loadCatalog();
  const active = activeFilters(filters);
  const cards = collections.flatMap((collection) => {
    const own = groups.filter((g) => g.collection === collection.id);
    if (!own.some((group) => matchingVariant(group, active))) return [];
    return [collectionCard(collection, own)];
  });
  return demoListing({ cards, count: cards.length, filters: filterRows(groups.filter((g) => g.collection)) });
}

// ── Ficha de producto ────────────────────────────────────────────────
/**
 * Ficha de un grupo: { group, collection, variants, variantAttributes,
 * family: cards de las otras familias de la colección, images: { ambient[],
 * description, inspiration[] } (las que no cambian con la variante),
 * glossary: datos de variants-table, files: archivos generales de la barra de
 * la tabla (CAD 2D/3D y Manual) }. null si no existe.
 */
export async function getProduct(groupId) {
  const { groups, groupById } = await loadCatalog();
  const group = groupById.get(groupId);
  if (!group) return null;
  await ensureDetails(group);
  const family = group.collection
    ? groups.filter((g) => g.collection === group.collection && g !== group).map((g) => productCard(g))
    : [];
  const images = group.images ?? {};
  return {
    group,
    collection: group.collectionData,
    variants: group.variants.map((v) => ({ sku: v.sku, isDefault: v === group.defaultVariant, attributes: v.values })),
    variantAttributes: group.variantAttributes,
    // Imagen de cada acabado del grupo por su nombre, para las muestras del
    // configurador: { Negro: 'https://…/acabado-negro-mate.png' }. Sin imagen, no está.
    finishImages: Object.fromEntries(finishes(group).filter((finish) => finish.src).map((finish) => [finish.name, finish.src])),
    family,
    // Solo las imágenes que existen, sin repetidas (decisión 2026-10-02 · Galerías)
    images: {
      ambient: unique(images.ambient),
      description: hasValue(images.description) ? images.description : null,
      inspiration: unique(images.inspiration),
    },
    glossary: glossary(group),
    // La barra de la tabla muestra CAD 2D/3D y Manual (campos `cad` y `manual`
    // de Typesense). No hay archivos por grupo en la base: salen del SKU
    // predeterminado del grupo (is_group_default; sin marca, el primero). Sin
    // valor en ese SKU, el botón no aparece.
    files: downloads(group.defaultVariant).filter((file) => file.type === 'cad' || file.type === 'manual'),
  };
}

const unique = (value) => [...new Set([value ?? []].flat().filter(hasValue))];

/**
 * Columnas de variants-table (TABLE_COLUMNS, en orden): las mismas en la ficha
 * y en Descargas; solo las que algún SKU tiene cargadas.
 */
const tableColumns = (variants) =>
  TABLE_COLUMNS.filter(({ field }) => variants.some((v) => hasValue(v.values[field]))).map(({ field, label, wide }) => ({ key: field, label, wide }));

/**
 * Datos de variants-table (type product): una fila por SKU del grupo. Un SKU
 * sin foto propia muestra el neutro, sin la del predeterminado (como la
 * galería, decisiones.md 2026-10-07): así se ve qué falta cargar. El tamaño
 * va en mm (la base lo trae en cm).
 */
function glossary(group) {
  return {
    columns: tableColumns(group.variants),
    filters: group.variantAttributes.map((key) => ({ key, label: attributeInfo(key).label, swatches: attributeInfo(key).control === 'swatches' })),
    rows: group.variants.map((v) => ({ sku: v.sku, thumb: v.images?.studio ?? null, attributes: v.values, values: tableValues(v.values) })),
  };
}

/**
 * Página Descargas: variants-table (type catalog) con todos los SKU del catálogo, en el orden
 * de los grupos. Filtros: DOWNLOAD_FILTERS (attributes.js), solo los que
 * tienen al menos dos valores en el catálogo. Sin
 * archivos en la barra: no hay un grupo (decisiones.md, 2026-10-05 · Glosario).
 * search: nombre del producto y de la colección, para el buscador (además del
 * SKU), decisiones.md, 2026-10-06 · Descargas.
 */
/**
 * Nombre corto de un grupo en la tabla de Descargas: el de su colección
 * («Nobu»). Si la colección tiene varios grupos, se suma la aplicación
 * («Kanu Pared», «Kanu Jardín»); si la aplicación no alcanza para
 * distinguirlos (Tori Jardín, Mini Tori Jardín y Tori Visera son los tres
 * Jardín), queda el nombre del grupo. Sin colección, la primera palabra del
 * nombre («Skyline»): el SKU de debajo identifica la variante.
 */
function shortName(group, groups) {
  const collection = group.collectionData?.name;
  if (!collection) return group.name.split(/\s+/)[0];
  const siblings = groups.filter((g) => g.collection === group.collection);
  if (siblings.length === 1) return collection;
  const sameApplication = siblings.filter((g) => g.application === group.application);
  return group.application && sameApplication.length === 1 ? `${collection} ${group.application}` : group.name;
}

// Solo `npm run dev` (demo): ?data=worst|empty|one|huge|error cambia los datos
// de Descargas (y ?data=loading|loading-one|loading-empty|loading-error, los
// listados) por los de demo/fixtures/peor-caso.js, para ver la página con el
// peor caso (break-ui). En el build import.meta.env.DEV es false y el bloque no
// llega a dist/.
async function demoData() {
  if (import.meta.env.DEV) {
    const mode = new URLSearchParams(location.search).get('data');
    if (mode && mode !== 'demo') return { mode, fixtures: await import('../../demo/fixtures/peor-caso.js') };
  }
  return null;
}

// Listados (Productos y Colecciones) en la demo: ?data=loading… demora la
// respuesta como la primera visita sin caché, para ver las cards de carga.
async function demoListing(result) {
  const demo = await demoData();
  return demo ? demo.fixtures.catalogListing(demo.mode, result) : result;
}

export async function getDownloadsTable() {
  const table = await downloadsTable();
  const demo = await demoData();
  return demo ? demo.fixtures.downloadsTable(demo.mode, table) : table;
}

async function downloadsTable() {
  const { groups } = await loadCatalog();
  const variants = groups.flatMap((group) => group.variants.map((variant) => ({ group, variant })));
  const varies = (field) => new Set(variants.map(({ variant }) => variant.values[field]).filter(hasValue)).size > 1;
  return {
    // Columnas: las mismas que las de la ficha (TABLE_COLUMNS)
    columns: tableColumns(variants.map(({ variant }) => variant)),
    filters: DOWNLOAD_FILTERS.filter(({ field }) => varies(field)).map(({ field, label }) => ({
      key: field,
      label,
      swatches: attributeInfo(field).control === 'swatches',
    })),
    // name, href y meta: tabla de Descargas · propuesta (2575:22875): nombre
    // del producto sobre el SKU, «Ver producto» en Mobile y el resumen de la
    // variante en el modal («Negro, 6 W, luz cálida»).
    rows: variants.map(({ group, variant }) => ({
      sku: variant.sku,
      name: shortName(group, groups),
      href: productHref(group.id, variant.sku),
      meta: group.variantAttributes.map((field) => variant.values[field]).filter(hasValue).join(', '),
      thumb: variant.images?.studio ?? null,
      search: [group.name, group.collectionData?.name].filter(Boolean).join(' '),
      attributes: variant.values,
      values: tableValues(variant.values),
    })),
  };
}

/** Archivos de un SKU de cualquier grupo (modal de la página Descargas). [] si no existe. */
export async function skuDownloads(sku) {
  const demo = await demoData();
  const files = demo?.fixtures.skuFiles(demo.mode, sku);
  if (files) return files;
  const { groups } = await loadCatalog();
  const group = groups.find((g) => g.variants.some((v) => v.sku === sku));
  if (!group) return [];
  await ensureDetails(group);
  return downloads(group.variants.find((v) => v.sku === sku));
}

/**
 * Datos de la ficha técnica en PDF de un SKU de cualquier grupo: { name, sku,
 * image, sections }, o null si no existe. image es la imagen principal
 * (img_main en Typesense); si falta, la de estudio de la variante o de la
 * predeterminada. sections, como el acordeón de la ficha.
 */
export async function getDatasheet(sku) {
  const { groups } = await loadCatalog();
  const group = groups.find((g) => g.variants.some((v) => v.sku === sku));
  if (!group) return null;
  const variant = group.variants.find((v) => v.sku === sku);
  const own = pick(variant.images);
  const base = pick(group.defaultVariant.images);
  return {
    name: group.name,
    sku: variant.sku,
    image: own.main ?? own.studio ?? base.main ?? base.studio ?? null,
    sections: specSections(variant.values),
  };
}

/**
 * Cards de grupos elegidos a mano (Productos destacados del Home), en el
 * mismo orden. Un grupo que no existe se saltea. La meta es el tipo de
 * producto (decisiones.md, 2026-10-05 · Home: alturas y meta).
 */
export async function getProductCards(groupIds) {
  const { groupById } = await loadCatalog();
  const cards = groupIds.map((id) => groupById.get(id)).filter(Boolean).map((group) => ({ ...productCard(group), meta: productKind(group) }));
  // Demo: ?data=loading… demora igual que el listado, para ver las cards de carga del Home.
  const demo = await demoData();
  if (!demo?.mode.startsWith('loading')) return cards;
  const listing = await demo.fixtures.catalogListing(demo.mode, { cards, count: cards.length, filters: [] });
  return listing.cards;
}

/**
 * Productos recomendados del buscador (search-sheet con el campo vacío): una
 * card por cada SKU marcado como novedad en la base (columna «new» de Sheets),
 * en el orden de la base. La card toma las fotos de ese SKU (no las del
 * predeterminado del grupo, así se ven las diferencias de color) y enlaza a él
 * (?sku=). Sin ninguno marcado no hay recomendados y el bloque no se muestra
 * (decisiones.md, 2026-10-15 · Recomendados del buscador).
 */
export async function getRecommendedProducts() {
  const { groups } = await loadCatalog();
  return groups.flatMap((group) => group.variants.filter((variant) => variant.isNew).map((variant) => ({ ...productCard(group, variant), meta: productKind(group) })));
}

// Tipo de producto: la aplicación de una luminaria («Jardín», «Colgante») o
// el tipo si no es luminaria («Lámpara»).
function productKind(group) {
  if (group.productType && group.productType !== 'Luminaria') return group.productType;
  return group.application ?? group.productType ?? '';
}

// En el orden de Descargas de la Ficha de Final (1218:10596)
const DOWNLOAD_LABELS = { cad: 'CAD 2D/3D', manual: 'Manual', ies: 'IES', fotometria: 'Fotometría' };

/** Archivos de un SKU: [{ type, label, href }], solo los que existen. */
function downloads(variant) {
  const files = pick(variant.downloads);
  return Object.keys(DOWNLOAD_LABELS)
    .filter((type) => files[type])
    .map((type) => ({ type, label: DOWNLOAD_LABELS[type], href: files[type] }));
}

/**
 * Lo que cambia con la variante: descripción, galería, especificaciones por
 * sección y descargas. Una variante sin fotos propias no toma las de la
 * predeterminada (serían de otro color o tamaño): la galería queda vacía y se
 * ve el fondo neutro (decisiones.md, 2026-10-07 · Base de datos sin IDs).
 */
export function variantDetails(group, sku) {
  const variant = group.variants.find((v) => v.sku === sku) ?? group.defaultVariant;
  const own = pick(variant.images);
  const gallery = own.gallery ?? [own.studio].filter(Boolean);
  const galleryOn = own.galleryOn ?? [own.studioOn ?? null];
  return {
    sku: variant.sku,
    description: variant.description,
    values: variant.values,
    images: gallery.map((src, i) => ({ src, srcOn: galleryOn[i] ?? null, alt: `${group.name}, imagen ${i + 1}` })),
    sections: specSections(variant.values),
    downloads: downloads(variant),
  };
}

// ── Colección ────────────────────────────────────────────────────────
/**
 * Página de colección: { collection, cards: una por grupo, images: { gallery[],
 * description, inspiration[] } }. null si no existe. La meta de cada card es
 * el resumen de sus variantes (variantSummary).
 */
export async function getCollection(id) {
  const { collectionById, groups } = await loadCatalog();
  const collection = collectionById.get(id);
  if (!collection) return null;
  const images = collection.images ?? {};
  return {
    collection,
    cards: groups.filter((g) => g.collection === id).map((g) => ({ ...productCard(g), meta: variantSummary(g) })),
    images: {
      gallery: unique(images.gallery),
      description: hasValue(images.description) ? images.description : null,
      inspiration: unique(images.inspiration),
    },
  };
}

/**
 * Resumen de la card (decisión 2026-10-02 · Cards): el rango de cada atributo
 * de variante que no es acabado («50 cm – 90 cm»), separados por « · ».
 * TODO (diseño): faltan las una o dos características fijas que suma Final
 * (p. ej. la potencia) y si van en una segunda línea.
 */
function variantSummary(group) {
  const number = (value) => Number.parseFloat(String(value).replace(',', '.'));
  return group.variantAttributes
    .filter((field) => attributeInfo(field).control !== 'swatches')
    .map((field) => {
      const values = [...new Set(group.variants.map((v) => v.values[field]).filter(hasValue))];
      values.sort((a, b) => number(a) - number(b) || String(a).localeCompare(String(b), 'es'));
      return values.length > 1 ? `${values[0]} – ${values.at(-1)}` : values[0];
    })
    .filter(Boolean)
    .join(' · ');
}

// ── Comparativa ──────────────────────────────────────────────────────
// Los SKU de un grupo con la forma que esperan las funciones de variants.js.
const variantList = (group) => group.variants.map((v) => ({ sku: v.sku, isDefault: v === group.defaultVariant, attributes: v.values }));

const selectionOf = (group, variant) => Object.fromEntries(group.variantAttributes.map((field) => [field, variant.values[field]]));

/**
 * Selectores de variante de una columna de la comparativa: uno por campo de
 * VARIANT_ATTRIBUTES (Color, Altura…), con la misma disponibilidad que el
 * configurador de la ficha (una opción que no forma un SKU va deshabilitada).
 *   [{ field, label, value, options: [{ value, label, disabled, showSwatch, swatch }] }]
 * swatch: imagen del acabado (finishes.js); sin imagen, el select muestra el neutro.
 */
function compareAttributes(group, variant) {
  const selection = selectionOf(group, variant);
  return variantOptions(variantList(group), group.variantAttributes, selection).map(({ attribute, options }) => {
    const info = attributeInfo(attribute);
    return {
      field: attribute,
      label: info.label,
      value: selection[attribute] ?? '',
      // La muestra solo en los campos de acabado/color (select: swatch solo si es acabado)
      options: options.map((o) => ({
        value: o.value,
        label: o.value,
        disabled: o.disabled,
        showSwatch: info.control === 'swatches',
        swatch: info.control === 'swatches' ? finishImage(o.value, group.family) ?? undefined : undefined,
      })),
    };
  });
}

/**
 * SKU que queda al cambiar un atributo de variante en una columna de la
 * comparativa (mismo criterio que la ficha: choose + findVariant). null si
 * esa combinación no existe.
 */
export async function skuForAttribute(sku, field, value) {
  const { groups } = await loadCatalog();
  const group = groups.find((g) => g.variants.some((v) => v.sku === sku));
  const current = group?.variants.find((v) => v.sku === sku);
  if (!group || !current) return null;
  const selection = choose(selectionOf(group, current), field, value);
  return findVariant(variantList(group), selection)?.sku ?? null;
}

/** Datos de compare-header + compare-table para hasta 3 SKU (los que no existen se omiten). */
export async function getCompare(skus) {
  const { groups } = await loadCatalog();
  const found = skus.slice(0, 3).flatMap((sku) => {
    const group = groups.find((g) => g.variants.some((v) => v.sku === sku));
    return group ? [{ group, variant: group.variants.find((v) => v.sku === sku) }] : [];
  });
  const products = found.map(({ group, variant }) => {
    const card = productCard(group, variant);
    return {
      sku: variant.sku,
      name: group.name,
      meta: variant.sku,
      image: card.image,
      href: card.href,
      attributes: compareAttributes(group, variant),
    };
  });
  const sections = specSections(Object.assign({}, ...found.map(({ variant }) => variant.values)));
  const tableGroups = sections.map((section) => ({
    label: section.label,
    rows: section.rows.map((row) => ({ label: row.label, values: found.map(({ variant }) => variant.values[row.field] ?? '—') })),
  }));
  const commercial = tableGroups.find((g) => g.label === 'Información comercial');
  const skuRow = { label: 'SKU', values: found.map(({ variant }) => variant.sku) };
  if (commercial) commercial.rows.unshift(skuRow);
  else if (found.length) tableGroups.push({ label: 'Información comercial', rows: [skuRow] });
  return { products, groups: tableGroups };
}

// ── Búsqueda ─────────────────────────────────────────────────────────
// La usan search-dropdown (searchProducts) y el listado de Productos con ?q=
// (listProducts), con el mismo criterio (decisiones.md, 2026-10-05 · Búsqueda
// en Productos): cada palabra tiene que aparecer, sin importar tildes,
// mayúsculas ni plural, y con errores de tipeo salvo en el SKU (src/data/text.js).
// Los que coinciden tal cual van antes que los con errores de tipeo.

const groupText = (group) => [group.name, group.collectionData?.name, group.application, group.productType, ...group.environment].join(' ');

/**
 * ¿El grupo coincide con la búsqueda? { variant, bySku, typo } o null. Si
 * coincide un SKU, esa variante (bySku); si no, la predeterminada. typo: la
 * coincidencia es con errores de tipeo.
 */
function searchMatch(group, words) {
  // Si el texto del grupo coincide tal cual (nombre, colección…), manda la
  // variante predeterminada (is_group_default), la misma del listado. Después,
  // un SKU tal cual (los SKU no aceptan errores de tipeo: un código parecido
  // es otro producto). Por último, el texto del grupo con errores de tipeo.
  const text = matchWords(groupText(group), words);
  if (text === 'exact') return { variant: group.defaultVariant, bySku: false, typo: false };
  const variant = group.variants.find((v) => matchWords(v.sku, words, { typos: false }));
  if (variant) return { variant, bySku: true, typo: false };
  return text ? { variant: group.defaultVariant, bySku: false, typo: true } : null;
}

// Primero los que coinciden tal cual (orden estable dentro de cada grupo)
const exactFirst = (items) => items.sort((a, b) => Number(a.typo) - Number(b.typo));

/**
 * Búsqueda por nombre, colección, aplicación o SKU: { results: [{ kind:
 * 'product' | 'collection', name, meta, href, image }], total }. Un resultado por grupo (meta: el SKU; si coincide
 * un SKU, ese) y uno por colección (meta: "Colección"), como search-dropdown.
 */
export async function searchProducts(query, { limit = 5 } = {}) {
  const words = queryWords(query);
  if (!words.length) return { results: [], total: 0 };
  const { groups, collections } = await loadCatalog();
  const products = exactFirst(
    groups.flatMap((group) => {
      const match = searchMatch(group, words);
      if (!match) return [];
      const card = productCard(group, match.variant);
      return [{ kind: 'product', name: group.name, meta: match.variant.sku, href: card.href, image: card.image, typo: match.typo }];
    }),
  );
  const found = exactFirst(
    collections.flatMap((c) => {
      const match = matchWords(c.name, words);
      return match ? [{ kind: 'collection', name: c.name, meta: 'Colección', href: collectionHref(c.id), image: c.images?.studio ?? null, typo: match === 'typo' }] : [];
    }),
  );
  const results = [...products, ...found].map(({ typo, ...result }) => result);
  // total: solo productos (luminarias). «Ver todos los resultados (N)» lleva al
  // listado de Productos, que no incluye colecciones.
  return { results: results.slice(0, limit), total: products.length };
}

/** URL con todos los resultados: el listado de Productos con ?q= (docs/urls.md). */
export const searchHref = (query) => `/arq/productos?q=${encodeURIComponent(query)}`;

// ── Agregar producto a la comparativa (compare-picker) ───────────────
// La meta de las filas sigue el set (Figma 2724:8761): «Exterior · Jardín» o,
// si no es luminaria, «Lámparas y artefactos · Colgante».
const PICKER_LAMPS = 'Lámparas y artefactos';
const isLuminaire = (group) => !group.productType || group.productType === 'Luminaria';

function pickerMeta(group) {
  if (isLuminaire(group)) return meta(group);
  return [PICKER_LAMPS, group.application ?? group.productType].filter(Boolean).join(' · ');
}

/**
 * Productos del modal «Agregar producto» de la comparativa: uno por grupo
 * (los que se listan), con su SKU predeterminado; si la búsqueda coincide por
 * SKU, ese SKU. query: nombre, SKU o familia, con el criterio de la búsqueda.
 * selected: SKU que ya están en la comparativa; el grupo de cualquiera de
 * ellos sale con added (State=Added).
 * Devuelve { items: [{ id, sku, name, meta, cardMeta, image, added }] }.
 */
export async function listCompareCandidates({ query = '', selected = [] } = {}) {
  const { groups } = await loadCatalog();
  const words = queryWords(query);
  const chosen = new Set(selected);
  const items = groups.flatMap((group) => {
    if (!group.hasDefault) return [];
    const found = words.length ? searchMatch(group, words) : { variant: group.defaultVariant };
    if (!found) return [];
    return [
      {
        id: group.id,
        sku: found.variant.sku,
        name: group.name,
        meta: pickerMeta(group),
        cardMeta: meta(group), // la de la product-card: la que guarda la compare-bar
        image: productCard(group, found.variant).image,
        added: group.variants.some((v) => chosen.has(v.sku)),
      },
    ];
  });
  return { items };
}

// ── Navegación ───────────────────────────────────────────────────────
/**
 * Árbol único para mega-menu, menú mobile y catalog-nav (decisiones.md,
 * 2026-10-02 · Navegación), con las secciones del mega-menu de Figma (841:2282):
 *   { sections: { exterior, interior, lamparas, artefactos }, collections, allCollections }
 *   sección: { id, label, href, all: { label, href }, links: [{ label, href, count, image, thumb }] }
 *   colección: { label, meta, href, eyebrow, image, thumb }
 * Exterior e Interior: aplicaciones de luminarias + Artefactos y Lámparas de
 * ese entorno. Lámparas y Artefactos: un link por producto. Las opciones sin
 * productos no aparecen; una sección sin links es null.
 * image: foto del preview del mega-menu (contexto; sin contexto, estudio).
 * fallbacks: fotos que el preview prueba en orden si image no carga.
 * thumb: miniatura del submenú mobile (estudio). eyebrow: texto sobre la foto
 * del preview en Colecciones ("Línea Interior", frame 2295:23730).
 * Foto de Por espacio (Embutir, Jardín, Artefactos…): img_ambient_1_on del
 * producto de la categoría marcado con is_menu_default; de Colecciones: la de
 * su fila col-*. Sin esa foto, o si no carga: las de contexto de los
 * productos de la categoría, en orden,
 * y después las de estudio; en una colección, solo las de contexto
 * (decisiones.md, 2026-10-20 · Fotos del mega-menú).
 */
export async function getNavigation() {
  const { groups: all, collections } = await loadCatalog();
  const groups = all.filter((g) => g.hasDefault); // los que se listan (isListed)
  const count = (filter) => groups.filter((g) => inCategory(g, filter) && isListed(g, filter.productType)).length;
  const groupImages = (g) => {
    const images = pick(g.defaultVariant.images);
    return { image: images.context ?? images.studio ?? null, thumb: images.studio ?? null };
  };
  // Fotos que puede probar el preview, en orden: primero las de contexto de
  // todos los productos y después las de estudio.
  const productPhotos = (list, { studio = true } = {}) => {
    const images = list.map((g) => pick(g.defaultVariant.images));
    return [...images.map((i) => i.context), ...(studio ? images.map((i) => i.studio) : [])];
  };
  // image: la primera; fallbacks: las que prueba si esa no carga.
  const preview = (candidates) => {
    const [image = null, ...fallbacks] = [...new Set(candidates.filter(Boolean))];
    return { image, fallbacks };
  };
  const link = (label, filter) => {
    const inside = groups.filter((g) => inCategory(g, filter));
    return {
      label,
      href: categoryHref(filter),
      count: count(filter),
      // Primero la del producto marcado con is_menu_default
      ...preview([inside.find((g) => g.menuImage)?.menuImage, ...productPhotos(inside)]),
      thumb: inside.map(groupImages).find((i) => i.image)?.thumb ?? null,
    };
  };
  const environmentSection = (environment, allLabel) => {
    const applications = [...new Set(groups.filter((g) => g.productType === 'Luminaria' && g.environment.includes(environment)).map((g) => g.application).filter(Boolean))];
    const links = [
      ...applications.map((application) => link(application, { environment, application, productType: 'Luminaria' })),
      link('Artefactos', { environment, productType: 'Artefacto' }),
      link('Lámparas', { environment, productType: 'Lámpara' }),
    ].filter((l) => l.count);
    return links.length ? { id: normalize(environment), label: environment, href: categoryHref({ environment }), all: { label: allLabel, href: categoryHref({ environment }) }, links } : null;
  };
  const typeSection = (productType, label, allLabel) => {
    const links = groups.filter((g) => g.productType === productType).map((g) => ({ label: g.name, href: productHref(g.id, g.defaultVariant.sku), count: 1, ...groupImages(g) }));
    return links.length ? { id: normalize(label), label, href: categoryHref({ productType }), all: { label: allLabel, href: categoryHref({ productType }) }, links } : null;
  };
  const collectionLink = (c) => {
    const own = groups.filter((g) => g.collection === c.id);
    const images = pick(c.images);
    const environments = [...new Set(own.flatMap((g) => g.environment))];
    return {
      label: c.name,
      meta: [...new Set(own.map((g) => g.application ?? g.productType).filter(Boolean))].join(' · '),
      href: collectionHref(c.id),
      eyebrow: environments.length ? `Línea ${environments.join(' · ')}` : '',
      // Colecciones: solo fotos de contexto, nunca de estudio (pedido de Lau, 2026-10-20)
      ...preview([images.menu, ...productPhotos(own, { studio: false })]),
      thumb: images.studio ?? null,
    };
  };
  return {
    sections: {
      interior: environmentSection('Interior', 'Ver todo interior'),
      exterior: environmentSection('Exterior', 'Ver todo exterior'),
      lamparas: typeSection('Lámpara', 'Lámparas', 'Ver todas las lámparas'),
      artefactos: typeSection('Artefacto', 'Artefactos', 'Ver todos los artefactos'),
    },
    collections: collections.map(collectionLink).filter((c) => c.meta),
    allCollections: { label: 'Ver todas las colecciones', href: '/arq/productos?view=colecciones' },
  };
}

// Links de catalog-nav (sidebar de Productos). Los grupos (Interior, Exterior,
// Lámparas y artefactos, Colecciones) y su "Todo…" están fijos en el HTML de
// la página; esto trae lo de adentro. Solo las categorías con productos.
export async function getCatalogNav() {
  const { groups: all, collections } = await loadCatalog();
  const groups = all.filter((g) => g.hasDefault);
  const count = (filter) => groups.filter((g) => inCategory(g, filter) && isListed(g, filter.productType)).length;
  const link = (label, filter) => ({ label, href: categoryHref(filter), count: count(filter) });
  const environment = (env) => {
    const applications = [...new Set(groups.filter((g) => g.productType === 'Luminaria' && g.environment.includes(env)).map((g) => g.application).filter(Boolean))];
    return [
      ...applications.map((application) => link(application, { environment: env, application, productType: 'Luminaria' })),
      link('Artefactos', { environment: env, productType: 'Artefacto' }),
      link('Lámparas', { environment: env, productType: 'Lámpara' }),
    ].filter((l) => l.count);
  };
  return {
    interior: environment('Interior'),
    exterior: environment('Exterior'),
    'lamparas-artefactos': [link('Lámparas', { productType: 'Lámpara' }), link('Artefactos', { productType: 'Artefacto' })].filter((l) => l.count),
    colecciones: collections
      .filter((c) => groups.some((g) => g.collection === c.id))
      .map((c) => ({ label: c.name, href: categoryHref({ collection: c.id }) })),
  };
}

export { ATTRIBUTES };
