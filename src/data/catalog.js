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
import { ATTRIBUTES, FILTER_FIELDS, GLOSSARY_COLUMNS, attributeInfo, specSections } from './attributes.js';
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

/** Primera variante del grupo que cumple (first si cumple; si no, la predeterminada). */
function matchingVariant(group, filters, first = group.defaultVariant) {
  const ordered = [first, group.defaultVariant, ...group.variants].filter((v, i, all) => all.indexOf(v) === i);
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

// Acabados de la card (Show finishes): valores únicos de los campos con
// control 'swatches' (attributes.js) entre las variantes del grupo.
// TODO (acabados): imagen de cada acabado (mapeo nombre → slug, DESIGN.md §8).
const FINISH_FIELDS = Object.keys(ATTRIBUTES).filter((field) => ATTRIBUTES[field].control === 'swatches');
const finishes = (group) => [...new Set(group.variants.flatMap((v) => FINISH_FIELDS.map((field) => v.values[field])).filter(hasValue))];

function productCard(group, variant = group.defaultVariant, withSku = false) {
  const images = { ...group.defaultVariant.images, ...pick(variant.images) };
  return {
    id: group.id,
    sku: variant.sku,
    name: group.name,
    meta: meta(group),
    finishes: finishes(group),
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
    const match = words.length ? searchMatch(group, words) : { variant: group.defaultVariant, bySku: false };
    if (match) found.set(group, match);
  }
  const scope = [...found.keys()];
  const active = activeFilters(filters);
  const withFilters = Object.keys(active).length > 0;
  const cards = scope.flatMap((group) => {
    const match = found.get(group);
    const variant = matchingVariant(group, active, match.variant);
    return variant ? [productCard(group, variant, withFilters || match.bySku)] : [];
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

/** Datos de variants-table: una fila por SKU del grupo (columnas en attributes.js). */
function glossary(group) {
  const fallback = group.defaultVariant.images?.studio ?? null;
  return {
    columns: GLOSSARY_COLUMNS.filter(({ field }) => group.variants.some((v) => hasValue(v.values[field]))).map(({ field, label }) => ({ key: field, label })),
    filters: group.variantAttributes.map((key) => ({ key, label: attributeInfo(key).label, swatches: attributeInfo(key).control === 'swatches' })),
    rows: group.variants.map((v) => ({ sku: v.sku, thumb: v.images?.studio ?? fallback, attributes: v.values, values: v.values })),
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
// La usan search-dropdown (searchProducts) y el listado de Productos con ?q=
// (listProducts), con el mismo criterio (decisiones.md, 2026-10-05 · Búsqueda
// en Productos): cada palabra tiene que aparecer, sin importar tildes,
// mayúsculas ni plural.
// TODO (búsqueda): sinónimos ("jardín" → parque, patio…): falta decidir si van
// en el front o en Typesense (decisiones.md, Pendientes).
const normalize = (text) => String(text ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

// Formas de una palabra: ella misma y su singular ("jardines" → "jardin").
function forms(word) {
  const all = [word];
  if (word.length > 3 && word.endsWith('es')) all.push(word.slice(0, -2));
  if (word.length > 3 && word.endsWith('s')) all.push(word.slice(0, -1));
  return all;
}

/** Palabras de la búsqueda: por cada una, la lista de textos que valen. */
function queryWords(query) {
  return normalize(query).split(/\s+/).filter(Boolean).map(forms);
}

const matchesWords = (text, words) => {
  const value = normalize(text);
  return words.every((options) => options.some((option) => value.includes(option)));
};

const groupText = (group) => [group.name, group.collectionData?.name, group.application, group.productType, ...group.environment].join(' ');

/**
 * ¿El grupo coincide con la búsqueda? { variant, bySku } o null. Si coincide
 * un SKU, esa variante (bySku); si no, la predeterminada.
 */
function searchMatch(group, words) {
  const variant = group.variants.find((v) => matchesWords(v.sku, words));
  if (variant) return { variant, bySku: true };
  return matchesWords(groupText(group), words) ? { variant: group.defaultVariant, bySku: false } : null;
}

/**
 * Búsqueda por nombre, colección, aplicación o SKU: { results: [{ name, meta,
 * href, image }], total }. Un resultado por grupo (meta: el SKU; si coincide
 * un SKU, ese) y uno por colección (meta: "Colección"), como search-dropdown.
 */
export async function searchProducts(query, { limit = 5 } = {}) {
  const words = queryWords(query);
  if (!words.length) return { results: [], total: 0 };
  const { groups, collections } = await loadCatalog();
  const products = groups.flatMap((group) => {
    const match = searchMatch(group, words);
    if (!match) return [];
    const card = productCard(group, match.variant, match.bySku);
    return [{ name: group.name, meta: match.variant.sku, href: card.href, image: card.image }];
  });
  const found = collections
    .filter((c) => matchesWords(c.name, words))
    .map((c) => ({ name: c.name, meta: 'Colección', href: collectionHref(c.id), image: c.images?.studio ?? null }));
  const results = [...products, ...found];
  return { results: results.slice(0, limit), total: results.length };
}

/** URL con todos los resultados: el listado de Productos con ?q= (docs/urls.md). */
export const searchHref = (query) => `/arq/productos?q=${encodeURIComponent(query)}`;

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
