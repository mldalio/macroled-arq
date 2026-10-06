// Documentos de Typesense (uno por SKU) → catálogo ({ collections, groups },
// la forma de catalog.js). Único lugar que conoce los campos de identificación,
// textos e imágenes del índice; los técnicos están en attributes.js.
//
// Estado (docs/typesense-schema.md, Estado del índice): el índice todavía no
// trae product_group_id, collection_id, nombres, textos ni imágenes. Mientras
// tanto cada SKU es su propio grupo y lo que falta queda vacío: las páginas
// se ven, pero sin contenido. Cuando la base esté completa, se ajusta FIELDS
// (y las imágenes) acá y nada más.

import { ATTRIBUTES, variantFields } from './attributes.js';

// Nombre del campo del índice para cada dato del catálogo.
// TODO (base): confirmar con quien arma la base. Son los de la propuesta v5;
// ¿macrofamilia = environment, subfamilia = application, familia = colección?
const FIELDS = {
  group: 'product_group_id', // TODO (base): no existe todavía
  name: 'product_name',
  collection: 'collection_id', // TODO (base): no existe todavía
  collectionName: 'collection_name',
  productType: 'product_type',
  environment: 'environment',
  application: 'application',
  isDefault: 'is_group_default',
  variantAttributes: 'variant_attributes',
  description: 'description',
  story: 'product_story_text',
  inspiration: 'product_inspiration_text',
  collectionIntro: 'collection_intro_text',
  collectionDescription: 'collection_description_text',
  video: 'video_inspiration',
};

const DOWNLOADS = ['ies', 'cad', 'manual', 'fotometria'];

const text = (value) => (value === undefined || value === null ? '' : String(value).trim());
const list = (value) => (Array.isArray(value) ? value : text(value) ? text(value).split(',').map((v) => v.trim()) : []);

// TODO (base): qué posición de cada lista multimagen_* es cada foto (estudio,
// contexto, luz encendida, galería). Hasta entonces, sin imágenes. La
// principal (img_main) va en images.main: la usa la ficha técnica en PDF.
function variantImages(_doc) {
  return {};
}

function groupImages(_docs) {
  return {};
}

export function fromDocuments(docs) {
  const byGroup = new Map();
  for (const doc of docs) {
    const id = text(doc[FIELDS.group]) || doc.sku; // sin grupo: cada SKU es un grupo
    if (!byGroup.has(id)) byGroup.set(id, []);
    byGroup.get(id).push(doc);
  }

  const collections = new Map();
  const groups = [...byGroup].map(([id, rows]) => {
    const first = rows.find((doc) => doc[FIELDS.isDefault] === true) ?? rows[0];
    const collectionId = text(first[FIELDS.collection]) || null;
    if (collectionId && !collections.has(collectionId)) {
      collections.set(collectionId, {
        id: collectionId,
        name: text(first[FIELDS.collectionName]) || collectionId,
        intro: text(first[FIELDS.collectionIntro]),
        description: text(first[FIELDS.collectionDescription]),
        images: {},
      });
    }
    return {
      id,
      name: text(first[FIELDS.name]) || first.sku,
      collection: collectionId,
      productType: text(first[FIELDS.productType]) || null,
      environment: list(first[FIELDS.environment]),
      application: text(first[FIELDS.application]) || null,
      variantAttributes: variantFields(first[FIELDS.variantAttributes]),
      story: text(first[FIELDS.story]),
      inspiration: text(first[FIELDS.inspiration]),
      video: text(first[FIELDS.video]),
      images: groupImages(rows),
      specs: {},
      variants: rows.map((doc) => ({
        sku: doc.sku,
        isDefault: doc === first,
        description: text(doc[FIELDS.description]),
        attributes: Object.fromEntries(Object.keys(ATTRIBUTES).map((field) => [field, text(doc[field])]).filter(([, v]) => v && v !== '-')),
        images: variantImages(doc),
        downloads: Object.fromEntries(DOWNLOADS.map((field) => [field, text(doc[field])]).filter(([, v]) => v)),
      })),
    };
  });

  return { collections: [...collections.values()], groups };
}
