// Datos mixtos para probar el layout (VITE_DATA_SOURCE=mixto, solo en
// npm run dev; docs/decisiones.md, 2026-10-05 · Ficha 60/40, scroll de la galería de ambiente y datos mixtos).
//
// Usa todo lo que ya trae Typesense y completa solo lo que está vacío:
//   1. con el catálogo de ejemplo (catalogo.json), si el SKU o el grupo existen ahí;
//   2. si no, con datos inventados a partir del SKU y de la familia.
// Nada de esto llega al build: src/data/source.js lo importa solo en desarrollo.
// Cuando la base esté completa, este archivo deja de completar (todo viene lleno).

import { ATTRIBUTES } from '../../src/data/attributes.js';

const IMG = '/demo/fixtures/img';

// Inventado: códigos de color del SKU (la tabla real está pendiente, DESIGN.md §12)
const COLORS = {
  N: 'Negro',
  B: 'Blanco',
  V: 'Verde',
  R: 'Terracota',
  P: 'Plata',
  BN: 'Blanco y negro',
  PLATIL: 'Platil',
  GRAFITO: 'Grafito',
  COBRE: 'Cobre',
  CELESTE: 'Celeste',
  BRONCE: 'Bronce',
};

// Inventado: imágenes de ejemplo para los grupos que no están en catalogo.json
const PLACEHOLDER_VARIANT = {
  studio: `${IMG}/card-estudio.svg`,
  studioOn: `${IMG}/card-estudio-on.svg`,
  context: `${IMG}/card-contexto.svg`,
  contextOn: `${IMG}/card-contexto-on.svg`,
  gallery: [`${IMG}/producto-1.svg`, `${IMG}/producto-2.svg`, `${IMG}/producto-3.svg`],
  galleryOn: [`${IMG}/producto-1-on.svg`, `${IMG}/producto-2-on.svg`],
};
const PLACEHOLDER_GROUP = {
  ambient: [1, 2, 3, 4].map((n) => `${IMG}/ficha/ambiente-${n}.webp`),
  description: `${IMG}/ficha/descripcion.webp`,
  inspiration: [`${IMG}/ficha/ambiente-5.webp`, `${IMG}/ficha/inspiracion-2.webp`],
};
const PLACEHOLDER_COLLECTION = {
  studio: `${IMG}/card-estudio.svg`,
  context: `${IMG}/card-contexto.svg`,
  gallery: [`${IMG}/producto-1.svg`, `${IMG}/producto-2.svg`, `${IMG}/producto-3.svg`],
};

const empty = (value) => value === undefined || value === null || value === '' || value === false || (Array.isArray(value) && !value.length);
const slug = (text) =>
  String(text)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
const segments = (sku) => String(sku).split(/[-\s]+/);

// Familia: la del índice o, si falta, el primer tramo del SKU (DAO, KAI…)
const familyOf = (doc) => doc.familia || capitalize(segments(doc.sku)[0]);

function colorOf(sku) {
  const parts = segments(sku).slice(1);
  for (let i = parts.length - 1; i >= 0; i--) if (COLORS[parts[i]]) return COLORS[parts[i]];
  return '';
}

// Altura: tramo de 3 o 4 cifras en mm (KANU-J-500 → 50 cm)
function heightOf(sku) {
  const mm = segments(sku).slice(1).find((part) => /^\d{3,4}$/.test(part));
  return mm ? `${Number(mm) / 10} cm` : '';
}

/** Documentos de Typesense con los campos vacíos completados. */
export function completarDocumentos(docs, mock) {
  const bySku = new Map();
  const groupById = new Map(mock.groups.map((group) => [group.id, group]));
  for (const group of mock.groups) for (const variant of group.variants) bySku.set(variant.sku, { group, variant });
  const collectionById = new Map(mock.collections.map((c) => [c.id, c]));
  const template = mock.groups[0];

  const filled = docs.map((doc) => {
    const out = { ...doc };
    const known = bySku.get(doc.sku);
    const family = familyOf(doc);
    const name = [family, doc.subfamilia].filter(Boolean).join(' ');
    const mockGroup = known?.group ?? groupById.get(slug(name)) ?? null;
    const collection = mockGroup?.collection ?? slug(family);
    const mockCollection = collectionById.get(collection);

    const set = (field, value) => {
      if (empty(out[field]) && !empty(value)) out[field] = value;
    };
    set('product_group_id', mockGroup?.id ?? slug(name));
    set('product_name', mockGroup?.name ?? name);
    set('collection_id', collection);
    set('collection_name', mockCollection?.name ?? family);
    set('collection_intro_text', mockCollection?.intro ?? `Colección ${family}: texto de ejemplo para probar el layout.`);
    set('collection_description_text', mockCollection?.description ?? `${family} es una colección de ejemplo. Este texto se reemplaza por el de la base.`);
    set('product_type', mockGroup?.productType ?? 'Luminaria');
    set('environment', doc.macrofamilia || mockGroup?.environment?.[0]);
    set('application', doc.subfamilia || mockGroup?.application);
    set('product_story_text', mockGroup?.story ?? template.story);
    set('product_inspiration_text', mockGroup?.inspiration ?? template.inspiration);

    const invented = { color_carcasa: colorOf(doc.sku), altura: heightOf(doc.sku) };
    for (const field of Object.keys(ATTRIBUTES)) {
      set(field, known?.variant.attributes[field] ?? invented[field] ?? mockGroup?.specs?.[field] ?? template.specs[field]);
    }
    for (const [field, value] of Object.entries(known?.variant.downloads ?? {})) set(field, value);

    const summary = [out.altura, out.color_carcasa?.toLowerCase(), out.potencia].filter((v) => v && v !== '-').join(', ');
    set('description', known?.variant.description || `${out.product_name}${summary ? `, ${summary}` : ''}.`);
    return out;
  });

  // Por grupo: predeterminado (el del índice, el del ejemplo o el primero) y
  // atributos de variante (los del índice o los que cambian entre SKU)
  const groups = Map.groupBy(filled, (doc) => doc.product_group_id);
  for (const rows of groups.values()) {
    if (!rows.some((doc) => doc.is_group_default)) {
      const mockDefault = groupById.get(rows[0].product_group_id)?.variants.find((v) => v.isDefault)?.sku;
      (rows.find((doc) => doc.sku === mockDefault) ?? rows[0]).is_group_default = true;
    }
    if (rows.every((doc) => empty(doc.variant_attributes))) {
      const varying = Object.entries(ATTRIBUTES)
        .filter(([field, info]) => info.column && new Set(rows.map((doc) => doc[field])).size > 1)
        .map(([, info]) => info.column)
        .join(', ');
      for (const doc of rows) doc.variant_attributes = varying;
    }
  }
  return filled;
}

/** Catálogo (salida de fromDocuments) con imágenes y especificaciones completadas. */
export function completarCatalogo(catalog, mock) {
  const groupById = new Map(mock.groups.map((group) => [group.id, group]));
  const variantBySku = new Map(mock.groups.flatMap((group) => group.variants.map((v) => [v.sku, v])));
  const collectionById = new Map(mock.collections.map((c) => [c.id, c]));

  for (const group of catalog.groups) {
    const mockGroup = groupById.get(group.id);
    if (!Object.keys(group.images).length) group.images = Object.keys(mockGroup?.images ?? {}).length ? mockGroup.images : PLACEHOLDER_GROUP;
    for (const variant of group.variants) {
      const own = variantBySku.get(variant.sku)?.images;
      if (own && Object.keys(own).length) variant.images = own;
      else if (variant.isDefault && !Object.keys(variant.images).length) variant.images = PLACEHOLDER_VARIANT;
    }
  }
  for (const collection of catalog.collections) {
    const mockImages = collectionById.get(collection.id)?.images ?? {};
    if (!Object.keys(collection.images).length) collection.images = Object.keys(mockImages).length ? mockImages : PLACEHOLDER_COLLECTION;
  }
  return catalog;
}
