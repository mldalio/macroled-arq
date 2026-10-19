// Catálogo: lo que usan las páginas (AGENTS.md · Datos: los componentes reciben
// datos, no consultan). Carga el catálogo una vez (source.js: Typesense o el
// ejemplo) y resuelve en memoria listados, filtros, fichas, comparativa,
// búsqueda y navegación (decisiones.md, 2026-10-02 · Listados: una sola consulta).
//
//   import { listProducts, getProduct } from '../data/catalog.js';
//   const { cards, count } = await listProducts({ environment: 'Exterior', filters: { potencia: ['12W'] } });
//
// Forma del catálogo:
//   collection: { id, name, intro, description, images: { studio, studioOn, context, contextOn, gallery[], description, inspiration[] } }
//   group: { id, name, collection, productType, hasDefault, environment[], application, variantAttributes[],
//            story, inspiration, video, images: { ambient[], description, inspiration }, specs: { campo: valor },
//            variants: [{ sku, isDefault, description, attributes: { campo: valor },
//                         images: { main, studio, studioOn, context, contextOn, gallery[], galleryOn[] },
//                         downloads: { ies, cad, manual, fotometria } }] }
// specs vale para todas las variantes del grupo; attributes de la variante pisa o completa.

import { loadSource, loadGroupDetails } from './source.js';
import { ATTRIBUTES, DOWNLOAD_FILTERS, FILTER_FIELDS, GLOSSARY_COLUMNS, attributeInfo, specSections } from './attributes.js';
import { variantOptions, findVariant, choose } from './variants.js';
import { normalize, queryWords, matchesWords } from './text.js';

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
 * Un filtro con menos de dos valores no se muestra.
 */
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
// control 'swatches' (attributes.js) entre las variantes del grupo.
// TODO (acabados): imagen de cada acabado (mapeo nombre → slug, DESIGN.md §8).
const FINISH_FIELDS = Object.keys(ATTRIBUTES).filter((field) => ATTRIBUTES[field].control === 'swatches');
const finishes = (group) => [...new Set(group.variants.flatMap((v) => FINISH_FIELDS.map((field) => v.values[field])).filter(hasValue))];

// Las fotos son de la variante que muestra la card; sin fotos propias, la card
// muestra el fondo neutro con el nombre (ver variantDetails).
function productCard(group, variant = group.defaultVariant) {
  const images = pick(variant.images);
  return {
    id: group.id,
    sku: variant.sku,
    name: group.name,
    meta: meta(group),
    finishes: finishes(group),
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
    finishes: [...new Set(groups.flatMap(finishes))],
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
  const scope = [...found.keys()];
  const active = activeFilters(filters);
  const withFilters = Object.keys(active).length > 0;
  const cards = scope.flatMap((group) => {
    const match = found.get(group);
    const variant = matchingVariant(group, active, match.variant);
    return variant ? [productCard(group, variant)] : [];
  });
  return { cards, count: cards.length, filters: filterRows(scope) };
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
  return { cards, count: cards.length, filters: filterRows(groups.filter((g) => g.collection)) };
}

// ── Ficha de producto ────────────────────────────────────────────────
/**
 * Ficha de un grupo: { group, collection, variants, variantAttributes,
 * family: cards de las otras familias de la colección, images: { ambient[],
 * description, inspiration[] } (las que no cambian con la variante),
 * glossary: datos de variants-table, files: descargas de la barra del
 * glosario }. null si no existe.
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
    family,
    // Solo las imágenes que existen, sin repetidas (decisión 2026-10-02 · Galerías)
    images: {
      ambient: unique(images.ambient),
      description: hasValue(images.description) ? images.description : null,
      inspiration: unique(images.inspiration),
    },
    glossary: glossary(group),
    // TODO (datos): la barra del glosario muestra CAD 2D/3D y Manual (Final,
    // 1218:10708). No hay archivos por grupo en la base: salen del SKU
    // predeterminado.
    files: downloads(group.defaultVariant).filter((file) => file.type === 'cad' || file.type === 'manual'),
  };
}

const unique = (value) => [...new Set([value ?? []].flat().filter(hasValue))];

/**
 * Datos de variants-table: una fila por SKU del grupo (columnas en attributes.js).
 * Un SKU sin foto propia muestra el neutro, sin la del predeterminado (como la
 * galería, decisiones.md 2026-10-07): así se ve qué falta cargar.
 */
function glossary(group) {
  return {
    columns: GLOSSARY_COLUMNS.filter(({ field }) => group.variants.some((v) => hasValue(v.values[field]))).map(({ field, label }) => ({ key: field, label })),
    filters: group.variantAttributes.map((key) => ({ key, label: attributeInfo(key).label, swatches: attributeInfo(key).control === 'swatches' })),
    rows: group.variants.map((v) => ({ sku: v.sku, thumb: v.images?.studio ?? null, attributes: v.values, values: v.values })),
  };
}

/**
 * Página Descargas: variants-table con todos los SKU del catálogo, en el orden
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
// de Descargas por los de demo/fixtures/peor-caso.js, para ver la página con el
// peor caso (break-ui). En el build import.meta.env.DEV es false y el bloque no
// llega a dist/.
async function demoData() {
  if (import.meta.env.DEV) {
    const mode = new URLSearchParams(location.search).get('data');
    if (mode && mode !== 'demo') return { mode, fixtures: await import('../../demo/fixtures/peor-caso.js') };
  }
  return null;
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
    // Columnas: una por filtro, en el mismo orden (Montaje, Acabado,
    // Potencia…), con el nombre corto; solo las que tienen algún valor.
    columns: DOWNLOAD_FILTERS.filter(({ field }) => variants.some(({ variant }) => hasValue(variant.values[field]))).map(
      ({ field, label, column }) => ({ key: field, label: column ?? label }),
    ),
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
      values: variant.values,
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
  return groupIds.map((id) => groupById.get(id)).filter(Boolean).map((group) => ({ ...productCard(group), meta: productKind(group) }));
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
 *   [{ field, label, value, options: [{ value, label, disabled, showSwatch }] }]
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
      options: options.map((o) => ({ value: o.value, label: o.value, disabled: o.disabled, showSwatch: info.control === 'swatches' })),
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
// mayúsculas ni plural (src/data/text.js).

const groupText = (group) => [group.name, group.collectionData?.name, group.application, group.productType, ...group.environment].join(' ');

/**
 * ¿El grupo coincide con la búsqueda? { variant, bySku } o null. Si coincide
 * un SKU, esa variante (bySku); si no, la predeterminada.
 */
function searchMatch(group, words) {
  // Si el texto del grupo coincide (nombre, colección…), manda la variante
  // predeterminada (is_group_default), la misma del listado. Solo si coincide
  // únicamente por SKU se usa esa variante.
  if (matchesWords(groupText(group), words)) return { variant: group.defaultVariant, bySku: false };
  const variant = group.variants.find((v) => matchesWords(v.sku, words));
  return variant ? { variant, bySku: true } : null;
}

/**
 * Búsqueda por nombre, colección, aplicación o SKU: { results: [{ kind:
 * 'product' | 'collection', name, meta, href, image }], total }. Un resultado por grupo (meta: el SKU; si coincide
 * un SKU, ese) y uno por colección (meta: "Colección"), como search-dropdown.
 */
export async function searchProducts(query, { limit = 5 } = {}) {
  const words = queryWords(query);
  if (!words.length) return { results: [], total: 0 };
  const { groups, collections } = await loadCatalog();
  const products = groups.flatMap((group) => {
    const match = searchMatch(group, words);
    if (!match) return [];
    const card = productCard(group, match.variant);
    return [{ kind: 'product', name: group.name, meta: match.variant.sku, href: card.href, image: card.image }];
  });
  const found = collections
    .filter((c) => matchesWords(c.name, words))
    .map((c) => ({ kind: 'collection', name: c.name, meta: 'Colección', href: collectionHref(c.id), image: c.images?.studio ?? null }));
  const results = [...products, ...found];
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
 * thumb: miniatura del submenú mobile (estudio). eyebrow: texto sobre la foto
 * del preview en Colecciones ("Línea Interior", frame 2295:23730).
 * TODO (datos): qué foto muestra el preview de una categoría (Embutir,
 * Jardín…). Por ahora, la del primer producto de la categoría que tenga foto.
 */
export async function getNavigation() {
  const { groups: all, collections } = await loadCatalog();
  const groups = all.filter((g) => g.hasDefault); // los que se listan (isListed)
  const count = (filter) => groups.filter((g) => inCategory(g, filter) && isListed(g, filter.productType)).length;
  const groupImages = (g) => {
    const images = pick(g.defaultVariant.images);
    return { image: images.context ?? images.studio ?? null, thumb: images.studio ?? null };
  };
  const categoryImages = (filter) => {
    const found = groups.filter((g) => inCategory(g, filter)).map(groupImages).find((i) => i.image);
    return found ?? { image: null, thumb: null };
  };
  const link = (label, filter) => ({ label, href: categoryHref(filter), count: count(filter), ...categoryImages(filter) });
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
      image: images.context ?? images.studio ?? null,
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

export { ATTRIBUTES };
