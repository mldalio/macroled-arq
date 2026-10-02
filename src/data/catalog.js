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
//   group: { id, name, collection, productType, environment[], application, variantAttributes[],
//            story, inspiration, video, images: { ambient[], description, inspiration }, specs: { campo: valor },
//            variants: [{ sku, isDefault, description, attributes: { campo: valor },
//                         images: { studio, studioOn, context, contextOn, gallery[], galleryOn[] },
//                         downloads: { ies, cad, manual, fotometria } }] }
// specs vale para todas las variantes del grupo; attributes de la variante pisa o completa.

import { loadSource } from './source.js';
import { ATTRIBUTES, FILTER_FIELDS, attributeInfo, specSections } from './attributes.js';

let pending = null;

/** El catálogo, cargado una sola vez por página. */
export function loadCatalog() {
  pending ??= loadSource().then(index);
  pending.catch(() => (pending = null)); // un error permite reintentar
  return pending;
}

function index({ collections, groups }) {
  const collectionById = new Map(collections.map((c) => [c.id, c]));
  for (const group of groups) {
    group.collectionData = collectionById.get(group.collection) ?? null;
    for (const variant of group.variants) variant.values = { ...group.specs, ...variant.attributes };
    group.defaultVariant = group.variants.find((v) => v.isDefault) ?? group.variants[0];
  }
  return { collections, groups, collectionById, groupById: new Map(groups.map((g) => [g.id, g])) };
}

// ── URLs (docs/urls.md) ──────────────────────────────────────────────
export const productHref = (groupId, sku) => `/arq/producto/${encodeURIComponent(groupId)}${sku ? `?sku=${encodeURIComponent(sku)}` : ''}`;
export const collectionHref = (id) => `/arq/coleccion/${encodeURIComponent(id)}`;
export const compareHref = (skus) => `/arq/comparativa?sku=${skus.map(encodeURIComponent).join(',')}`;
// TODO (urls): las URLs de categoría están PENDIENTES (docs/urls.md). Por ahora, parámetros del listado.
export function categoryHref({ environment, application, productType } = {}) {
  const params = new URLSearchParams();
  if (environment) params.set('environment', environment);
  if (application) params.set('application', application);
  if (productType) params.set('product_type', productType);
  const query = params.toString();
  return `/arq/productos${query ? `?${query}` : ''}`;
}

// ── Filtros ──────────────────────────────────────────────────────────
const hasValue = (value) => value !== undefined && value !== null && String(value).trim() !== '';

/** ¿La variante cumple los filtros { campo: [valores] }? (O dentro de un campo, Y entre campos.) */
function variantMatches(variant, filters) {
  return Object.entries(filters).every(([field, values]) => !values?.length || values.includes(variant.values[field]));
}

/** Primera variante del grupo que cumple (la predeterminada si cumple). */
function matchingVariant(group, filters) {
  const ordered = [group.defaultVariant, ...group.variants.filter((v) => v !== group.defaultVariant)];
  return ordered.find((variant) => variantMatches(variant, filters)) ?? null;
}

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

function productCard(group, variant = group.defaultVariant, withSku = false) {
  const images = { ...group.defaultVariant.images, ...pick(variant.images) };
  return {
    id: group.id,
    sku: variant.sku,
    name: group.name,
    meta: meta(group),
    href: productHref(group.id, withSku && variant !== group.defaultVariant ? variant.sku : null),
    image: images.studio ?? null,
    imageHover: images.context ?? null,
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
 * Devuelve { cards, count, filters: filas del filter-panel de la categoría }.
 */
export async function listProducts({ filters, ...category } = {}) {
  const { groups } = await loadCatalog();
  const scope = groups.filter((group) => inCategory(group, category));
  const active = activeFilters(filters);
  const withFilters = Object.keys(active).length > 0;
  const cards = scope.flatMap((group) => {
    const variant = matchingVariant(group, active);
    return variant ? [productCard(group, variant, withFilters)] : [];
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
 * family: cards de las otras familias de la colección }. null si no existe.
 */
export async function getProduct(groupId) {
  const { groups, groupById } = await loadCatalog();
  const group = groupById.get(groupId);
  if (!group) return null;
  const family = group.collection
    ? groups.filter((g) => g.collection === group.collection && g !== group).map((g) => productCard(g))
    : [];
  return {
    group,
    collection: group.collectionData,
    variants: group.variants.map((v) => ({ sku: v.sku, isDefault: v === group.defaultVariant, attributes: v.values })),
    variantAttributes: group.variantAttributes,
    family,
  };
}

/**
 * Cards de grupos elegidos a mano (Productos destacados del Home), en el
 * mismo orden. Un grupo que no existe se saltea.
 */
export async function getProductCards(groupIds) {
  const { groupById } = await loadCatalog();
  return groupIds.map((id) => groupById.get(id)).filter(Boolean).map((group) => productCard(group));
}

const DOWNLOAD_LABELS ={ ies: 'IES', cad: 'CAD 2D/3D', manual: 'Manual', fotometria: 'Fotometría' };

/**
 * Lo que cambia con la variante: descripción, galería, especificaciones por
 * sección y descargas. Las imágenes que faltan salen de la predeterminada.
 */
export function variantDetails(group, sku) {
  const variant = group.variants.find((v) => v.sku === sku) ?? group.defaultVariant;
  const own = pick(variant.images);
  const base = pick(group.defaultVariant.images);
  const gallery = own.gallery ?? base.gallery ?? [own.studio ?? base.studio].filter(Boolean);
  const galleryOn = own.galleryOn ?? (own.gallery ? [] : base.galleryOn ?? []);
  return {
    sku: variant.sku,
    description: variant.description,
    values: variant.values,
    images: gallery.map((src, i) => ({ src, srcOn: galleryOn[i] ?? null, alt: `${group.name}, imagen ${i + 1}` })),
    sections: specSections(variant.values),
    downloads: Object.entries(pick(variant.downloads)).map(([type, href]) => ({ type, label: DOWNLOAD_LABELS[type] ?? type, href })),
  };
}

// ── Colección ────────────────────────────────────────────────────────
/** Página de colección: { collection, cards: una por grupo }. null si no existe. */
export async function getCollection(id) {
  const { collectionById, groups } = await loadCatalog();
  const collection = collectionById.get(id);
  if (!collection) return null;
  return { collection, cards: groups.filter((g) => g.collection === id).map((g) => productCard(g)) };
}

// ── Comparativa ──────────────────────────────────────────────────────
/** Datos de compare-table para hasta 3 SKU (los que no existen se omiten). */
export async function getCompare(skus) {
  const { groups } = await loadCatalog();
  const found = skus.slice(0, 3).flatMap((sku) => {
    const group = groups.find((g) => g.variants.some((v) => v.sku === sku));
    return group ? [{ group, variant: group.variants.find((v) => v.sku === sku) }] : [];
  });
  const products = found.map(({ group, variant }) => {
    const card = productCard(group, variant, true);
    return { sku: variant.sku, name: group.name, meta: variant.sku, image: card.image, href: card.href };
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
const normalize = (text) => String(text ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/**
 * Búsqueda por nombre, colección, aplicación o SKU: { results: [{ name, meta,
 * href, image }], total }. Un resultado por grupo (meta: el SKU; si coincide
 * un SKU, ese) y uno por colección (meta: "Colección"), como search-dropdown.
 */
export async function searchProducts(query, { limit = 5 } = {}) {
  const words = normalize(query).split(/\s+/).filter(Boolean);
  if (!words.length) return { results: [], total: 0 };
  const { groups, collections } = await loadCatalog();
  const matches = (text) => words.every((w) => normalize(text).includes(w));
  const products = groups.flatMap((group) => {
    const variant = group.variants.find((v) => matches(v.sku));
    if (!variant && !matches([group.name, group.collectionData?.name, group.application, group.productType, ...group.environment].join(' '))) return [];
    const card = productCard(group, variant ?? group.defaultVariant, Boolean(variant));
    return [{ name: group.name, meta: (variant ?? group.defaultVariant).sku, href: card.href, image: card.image }];
  });
  const found = collections
    .filter((c) => matches(c.name))
    .map((c) => ({ name: c.name, meta: 'Colección', href: collectionHref(c.id), image: c.images?.studio ?? null }));
  const results = [...products, ...found];
  return { results: results.slice(0, limit), total: results.length };
}

/** URL de la página con todos los resultados (docs/urls.md). */
export const searchHref = (query) => `/arq/buscar?q=${encodeURIComponent(query)}`;

// ── Navegación ───────────────────────────────────────────────────────
/**
 * Árbol único para mega-menu, menú mobile y catalog-nav (decisiones.md,
 * 2026-10-02 · Navegación), con las secciones del mega-menu de Figma (841:2282):
 *   { sections: { exterior, interior, lamparas, artefactos }, collections, allCollections }
 *   sección: { id, label, href, all: { label, href }, links: [{ label, href, count }] }
 *   colección: { label, meta, href }
 * Exterior e Interior: aplicaciones de luminarias + Artefactos y Lámparas de
 * ese entorno. Lámparas y Artefactos: un link por producto. Las opciones sin
 * productos no aparecen; una sección sin links es null.
 */
export async function getNavigation() {
  const { groups, collections } = await loadCatalog();
  const count = (filter) => groups.filter((g) => inCategory(g, filter)).length;
  const link = (label, filter) => ({ label, href: categoryHref(filter), count: count(filter) });
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
    const links = groups.filter((g) => g.productType === productType).map((g) => ({ label: g.name, href: productHref(g.id), count: 1 }));
    return links.length ? { id: normalize(label), label, href: categoryHref({ productType }), all: { label: allLabel, href: categoryHref({ productType }) }, links } : null;
  };
  return {
    sections: {
      exterior: environmentSection('Exterior', 'Ver todo Exterior'),
      interior: environmentSection('Interior', 'Ver todo Interior'),
      lamparas: typeSection('Lámpara', 'Lámparas', 'Ver todas las lámparas'),
      artefactos: typeSection('Artefacto', 'Artefactos', 'Ver todos los artefactos'),
    },
    collections: collections
      .map((c) => ({ label: c.name, meta: [...new Set(groups.filter((g) => g.collection === c.id).map((g) => g.application ?? g.productType).filter(Boolean))].join(' · '), href: collectionHref(c.id) }))
      .filter((c) => c.meta),
    allCollections: { label: 'Ver todas las colecciones', href: '/arq/colecciones' },
  };
}

export { ATTRIBUTES };
