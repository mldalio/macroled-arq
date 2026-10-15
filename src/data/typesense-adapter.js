// ─────────────────────────────────────────────────────────────────────────────
// typesense-adapter · de los documentos de Typesense a lo que muestra el sitio
// ─────────────────────────────────────────────────────────────────────────────
//
// QUÉ HACE
//   Typesense guarda UN DOCUMENTO POR FILA DE LA HOJA, o sea uno por SKU. Los
//   componentes, en cambio, trabajan con PRODUCTOS (grupos con sus variantes) y
//   COLECCIONES. Este archivo hace esa traducción: recibe la lista de documentos
//   crudos y devuelve { collections, groups }, la forma que documenta catalog.js.
//
// DÓNDE ENCAJA
//   Google Sheets ──(n8n, fuera del repo)──▶ Typesense ──▶ typesense.js (trae los
//   documentos) ──▶ ESTE ARCHIVO ──▶ catalog.js (listados, ficha, buscador…) ──▶
//   componentes. Lo llama source.js; las páginas y los componentes no lo conocen.
//
// EJEMPLO
//   3 documentos con SKU distinto y el mismo product_name «Kanu Jardín» → 1 grupo
//   «Kanu Jardín» (id: kanu-jardin) con 3 variantes. Una card del listado es 1
//   grupo, no 1 SKU.
//
// ES EL ÚNICO LUGAR QUE CONOCE LOS NOMBRES DE CAMPO DEL ÍNDICE
//   (los de identificación, textos e imágenes; los técnicos están en
//   attributes.js). Si en la hoja o en n8n cambia el nombre de una columna, se
//   corrige acá y el resto del proyecto no se entera:
//   - FIELDS:      nombre de campo de identificación, textos y colecciones.
//   - IMAGE_SLOTS: posición de cada foto dentro de las listas multimagen_*. Tiene
//                  que coincidir con el orden en que n8n arma esas listas.
//   - GALLERY:     orden de la galería de la ficha.
//   - attributes.js: campos técnicos (potencia, IP, color…) y sus etiquetas.
//   Lista completa de campos: docs/typesense-schema.md.
//
// SI ALGO NO APARECE EN EL SITIO
//   1. ¿El campo llega a Typesense? Abrir un documento en el panel o en la consola
//      de red y mirar su nombre exacto.
//   2. ¿El nombre coincide con FIELDS / IMAGE_SLOTS / attributes.js?
//   3. Una fila sin product_name no se publica (se omite a propósito).
//   4. Si falta una foto, el componente muestra su fallback: un gris con el nombre.
//
// NO HACE
//   No consulta Typesense, no guarda nada ni toca la pantalla: solo transforma
//   datos. Todo acceso a la base pasa por typesense.js (AGENTS.md · Datos).
//
// REGLAS DE TRANSFORMACIÓN
//   Estructura de la hoja y del índice: docs/typesense-schema.md (decisiones.md,
//   2026-10-07 · Base de datos sin IDs).
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
  isNew: 'new',
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

// Qué campos se piden a Typesense (decisiones.md, 2026-10-14 · Campos por consulta).
// Cada documento trae unos 100 campos y el servidor es lento: se pide solo lo
// que usa cada pantalla.
// - LIGHT_FIELDS: el catálogo completo (listados, buscador, navegación,
//   Descargas, Comparativa y PDF): identificación, colecciones, fotos de la card
//   y de ambiente, y los campos técnicos de attributes.js.
// - DETAIL_FIELDS: lo que suma la ficha de UN grupo (consulta filtrada por
//   product_name): descripción, descargas, resto de las fotos y textos.
// Un campo nuevo que use una pantalla se agrega acá; si no, llega vacío.
export const LIGHT_FIELDS = Object.freeze([
  'sku', FIELDS.name, FIELDS.family, FIELDS.productType, FIELDS.environment, FIELDS.application,
  FIELDS.isDefault, FIELDS.isNew, FIELDS.variantAttributes, FIELDS.compatibleWith,
  FIELDS.collectionIntro, FIELDS.collectionDescription, FIELDS.collectionGallery, FIELDS.collectionInspiration,
  'multimagen_producto', 'multimagen_ambiente', 'multimagen_coleccion',
  ...Object.keys(ATTRIBUTES),
]);

export const DETAIL_FIELDS = Object.freeze([
  'sku', FIELDS.name, FIELDS.isDefault, FIELDS.description, FIELDS.story, FIELDS.inspiration, FIELDS.video,
  'multimagen_vistas', 'multimagen_perspectivas', 'multimagen_detalles',
  ...DOWNLOADS,
]);

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

/**
 * Documentos → { collections, groups, withDetails(id, documentosDeDetalle) }.
 * withDetails devuelve el grupo reconstruido con los campos de DETAIL_FIELDS.
 */
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

  const groupFromRows = (id, rows) => {
    const first = rows.find((doc) => doc[FIELDS.isDefault] === true) ?? rows[0];
    const productType = text(first[FIELDS.productType]) || null;
    const compatible = list(first[FIELDS.compatibleWith]).map((name) => idByName.get(normalize(name))).filter(Boolean);
    return {
      id,
      name: text(first[FIELDS.name]),
      collection: productType === ACCESSORY_TYPE ? null : collectionOf(first[FIELDS.family]),
      productType,
      // ¿La base marca un SKU predeterminado (is_group_default)? Sin marca, el primero
      // hace de predeterminado en la ficha, pero el grupo no se lista (catalog.js · isListed).
      hasDefault: rows.some((doc) => doc[FIELDS.isDefault] === true),
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
        // Novedad: la columna «new» de Sheets (bool), por SKU. Cada SKU marcado es un producto
        // recomendado del buscador, con sus propias fotos (catalog.js · getRecommendedProducts).
        isNew: doc[FIELDS.isNew] === true,
        description: text(doc[FIELDS.description]),
        attributes: Object.fromEntries(Object.keys(ATTRIBUTES).map((field) => [field, text(doc[field])]).filter(([, v]) => v && v !== '-')),
        images: variantImages(doc),
        downloads: Object.fromEntries(DOWNLOADS.map((field) => [field, text(doc[field])]).filter(([, v]) => v)),
      })),
    };
  };

  const groups = [...byGroup].map(([id, rows]) => groupFromRows(id, rows));

  // Mismo grupo con los campos de DETAIL_FIELDS: cada documento de detalle se
  // suma al de la lista que tiene su mismo SKU.
  const withDetails = (id, details) => {
    const bySku = new Map(details.map((doc) => [doc.sku, doc]));
    return groupFromRows(id, byGroup.get(id).map((doc) => ({ ...doc, ...bySku.get(doc.sku) })));
  };

  // Colecciones sin productos publicados no se muestran.
  return { collections: collections.filter((c) => groups.some((g) => g.collection === c.id)), groups, withDetails };
}
