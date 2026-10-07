// Documentos de Typesense (uno por fila de la hoja) → catálogo ({ collections,
// groups }, la forma de catalog.js). Único lugar que conoce los campos de
// identificación, textos e imágenes del índice; los técnicos están en attributes.js.
// Estructura de la hoja y del índice: docs/typesense-schema.md (decisiones.md,
// 2026-10-07 · Base de datos sin IDs).
//
// - Producto (grupo): las filas con el mismo product_name. El id (slug de la
//   ficha y del CMS) sale del nombre: «Kanu Jardín» → kanu-jardin. Una fila sin
//   product_name todavía no se publica.
// - Colección: una fila con product_type «Colección». Su familia lista las
//   familias que reúne («Tori, Mini Tori»); un producto pertenece a la colección
//   que incluye su familia. Los accesorios no entran en las colecciones.
// - Accesorio: product_type «Accesorio»; compatible_with es el nombre del
//   producto con el que se usa.
// - Imágenes: listas multimagen_* con posición fija (IMAGE_SLOTS). Un lugar
//   vacío ('') es una foto que falta.

import { ATTRIBUTES, variantFields } from './attributes.js';
import { normalize } from './text.js';

const FIELDS = {
  name: 'product_name',
  family: 'familia',
  productType: 'product_type',
  environment: 'macrofamilia',
  application: 'subfamilia',
  isDefault: 'is_group_default',
  variantAttributes: 'variant_attributes',
  compatibleWith: 'compatible_with',
  description: 'description',
  story: 'product_story_text',
  inspiration: 'product_inspiration_text',
  video: 'video_inspiration',
  collectionIntro: 'collection_intro_text',
  collectionDescription: 'collection_description_text',
  collectionGallery: 'collection_gallery_images',
  collectionInspiration: 'collection_inspiration_images',
};

const COLLECTION_TYPE = 'Colección';
const ACCESSORY_TYPE = 'Accesorio';

// Posición de cada foto en las listas multimagen_* (la arma la sincronización
// Sheets → Typesense en n8n; no cambiar el orden sin cambiarlo allá).
const IMAGE_SLOTS = {
  multimagen_producto: ['main', 'mainOn'],
  multimagen_vistas: ['front', 'frontOn', 'back', 'backOn', 'left', 'leftOn', 'right', 'rightOn'],
  multimagen_perspectivas: ['pers1', 'pers1On', 'pers2', 'pers2On'],
  multimagen_detalles: ['detail1', 'detail1On', 'detail2', 'detail2On'],
  multimagen_ambiente: ['ambient1', 'ambient1On', 'ambient2', 'ambient3', 'ambient4', 'ambient5', 'ambient6', 'ambient7'],
  multimagen_coleccion: ['card', 'cardOn', 'description'],
};

// Galería de la ficha, en orden. Con Iluminar, cada foto pasa a su versión «On».
const GALLERY = ['main', 'ambient1', 'front', 'back', 'left', 'right', 'pers1', 'pers2', 'detail1', 'detail2'];

const DOWNLOADS = ['ies', 'cad', 'manual', 'fotometria'];

const text = (value) => (value === undefined || value === null ? '' : String(value).trim());
const list = (value) => (Array.isArray(value) ? value.map(text).filter(Boolean) : text(value) ? text(value).split(',').map((v) => v.trim()).filter(Boolean) : []);

/** Slug para URLs: «Kanu Jardín» → kanu-jardin. */
export const slug = (value) => normalize(value).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** Fotos de un documento por nombre ({ main, mainOn, ambient1… }); las vacías no aparecen. */
function slots(doc) {
  const out = {};
  for (const [field, names] of Object.entries(IMAGE_SLOTS)) {
    const urls = Array.isArray(doc[field]) ? doc[field] : [];
    names.forEach((name, i) => {
      const url = text(urls[i]);
      if (url) out[name] = url;
    });
  }
  return out;
}

function variantImages(doc) {
  const s = slots(doc);
  const gallery = GALLERY.filter((name) => s[name]);
  const images = {
    main: s.main,
    studio: s.main,
    studioOn: s.mainOn,
    context: s.ambient1,
    contextOn: s.ambient1On,
    gallery: gallery.map((name) => s[name]),
    galleryOn: gallery.map((name) => s[`${name}On`] ?? null),
  };
  return Object.fromEntries(Object.entries(images).filter(([, v]) => (Array.isArray(v) ? v.length : v)));
}

function groupImages(doc) {
  const s = slots(doc);
  return {
    ambient: ['ambient2', 'ambient3', 'ambient4', 'ambient5'].map((name) => s[name]).filter(Boolean),
    description: s.ambient6 ?? null,
    inspiration: [s.ambient7].filter(Boolean),
  };
}

function collectionFromDoc(doc) {
  const s = slots(doc);
  return {
    id: slug(doc[FIELDS.name]),
    name: text(doc[FIELDS.name]),
    families: list(doc[FIELDS.family]).map(normalize),
    intro: text(doc[FIELDS.collectionIntro]),
    description: text(doc[FIELDS.collectionDescription]),
    images: {
      studio: s.card ?? null,
      studioOn: s.cardOn ?? null,
      gallery: list(doc[FIELDS.collectionGallery]),
      description: s.description ?? null,
      inspiration: list(doc[FIELDS.collectionInspiration]),
    },
  };
}

export function fromDocuments(docs) {
  const collections = [];
  const byGroup = new Map();
  for (const doc of docs) {
    const name = text(doc[FIELDS.name]);
    if (!name) continue; // sin nombre: todavía no se publica
    if (text(doc[FIELDS.productType]) === COLLECTION_TYPE) {
      collections.push(collectionFromDoc(doc));
      continue;
    }
    const id = slug(name);
    if (!byGroup.has(id)) byGroup.set(id, []);
    byGroup.get(id).push(doc);
  }

  const collectionOf = (family) => collections.find((c) => c.families.includes(normalize(family)))?.id ?? null;
  const idByName = new Map([...byGroup].map(([id, rows]) => [normalize(rows[0][FIELDS.name]), id]));

  const groups = [...byGroup].map(([id, rows]) => {
    const first = rows.find((doc) => doc[FIELDS.isDefault] === true) ?? rows[0];
    const productType = text(first[FIELDS.productType]) || null;
    const compatible = list(first[FIELDS.compatibleWith]).map((name) => idByName.get(normalize(name))).filter(Boolean);
    return {
      id,
      name: text(first[FIELDS.name]),
      collection: productType === ACCESSORY_TYPE ? null : collectionOf(first[FIELDS.family]),
      productType,
      environment: list(first[FIELDS.environment]),
      application: text(first[FIELDS.application]) || null,
      variantAttributes: variantFields(first[FIELDS.variantAttributes]),
      compatibleWith: compatible,
      story: text(first[FIELDS.story]),
      inspiration: text(first[FIELDS.inspiration]),
      video: text(first[FIELDS.video]),
      images: groupImages(first),
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

  // Colecciones sin productos publicados no se muestran.
  return { collections: collections.filter((c) => groups.some((g) => g.collection === c.id)), groups };
}
