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
//   Con grupo_variantes, varios product_name pueden ser un solo grupo: «Daö
//   Simple» y «Daö Doble» (grupo DAO-E) → 1 grupo «Daö» con 4 variantes (color y
//   módulos). Ver «Producto (grupo)» más abajo.
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
// - Producto (grupo): las filas con el mismo grupo_variantes (el SKU cortado que
//   comparten todas las variantes de un producto). Una fila sin grupo_variantes
//   se agrupa por product_name, como antes. El nombre del grupo son las palabras
//   que comparten al principio los product_name de sus filas («Daö Simple» y «Daö
//   Doble» → «Daö»); con un solo nombre, ese. El id (slug de la ficha y del CMS)
//   sale del nombre del grupo: «Kanu Jardín» → kanu-jardin. Una fila sin
//   product_name todavía no se publica.
// - SKU predeterminado del grupo: una fila con is_group_default; si hay varias
//   marcadas (una por product_name), la de SKU menor (X1 antes que X2); sin marca,
//   la primera.
// - Colección: una fila con product_type «Colección». Su familia lista las
//   familias que reúne («Tori, Mini Tori»); un producto pertenece a la colección
//   que incluye su familia. Los accesorios no entran en las colecciones.
// - Accesorio: product_type «Accesorio»; compatible_with es el nombre del
//   producto con el que se usa.
// - Foto del mega-menú: img_ambient_1_on (o img_ambient_1, la columna
//   img_ambient_1_off de la hoja, si falta). En una
//   aplicación de Por espacio (Embutir, Jardín…), la del SKU con
//   is_menu_default (casilla, como is_group_default); en una colección, la de
//   su fila col-* (decisiones.md, 2026-10-20 · Fotos del mega-menú).
// - Imágenes: listas multimagen_* con posición fija (IMAGE_SLOTS). Un lugar
//   vacío ('') es una foto que falta.

import { ATTRIBUTES, variantFields } from './attributes.js';
import { normalize } from './text.js';
import { applyModels } from './models.js';

const FIELDS = {
  name: 'product_name',
  variantGroup: 'grupo_variantes',
  // Nivel mayor de agrupación (opcional): varios grupo_variantes que son un solo producto
  // con modelos (Daö y Mini Daö). Hoy lo completa models.js; más adelante, la hoja.
  productGroup: 'grupo_producto',
  family: 'familia',
  productType: 'product_type',
  environment: 'macrofamilia',
  application: 'subfamilia',
  isDefault: 'is_group_default',
  isMenuDefault: 'is_menu_default',
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
// Sin product_type, el producto es una luminaria: el tipo se completa solo en lo que no lo
// es (Lámpara, Artefacto, Accesorio). Qué se lista lo decide is_group_default (el SKU
// predeterminado marcado); el tipo solo separa las luminarias del resto (catalog.js · isListed).
const DEFAULT_TYPE = 'Luminaria';

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
  'sku', FIELDS.name, FIELDS.variantGroup, FIELDS.productGroup, 'modelo', FIELDS.family, FIELDS.productType, FIELDS.environment, FIELDS.application,
  FIELDS.isDefault, FIELDS.isMenuDefault, FIELDS.isNew, FIELDS.variantAttributes, FIELDS.compatibleWith,
  FIELDS.collectionIntro, FIELDS.collectionDescription, FIELDS.collectionGallery, FIELDS.collectionInspiration,
  'multimagen_producto', 'multimagen_ambiente', 'multimagen_coleccion',
  ...Object.keys(ATTRIBUTES),
]);

export const DETAIL_FIELDS = Object.freeze([
  'sku', FIELDS.name, FIELDS.isDefault, FIELDS.description, FIELDS.story, FIELDS.inspiration, FIELDS.video,
  'multimagen_vistas', 'multimagen_perspectivas', 'multimagen_detalles',
  ...DOWNLOADS, 'cotas_img',
]);

const text = (value) => (value === undefined || value === null ? '' : String(value).trim());

// En localhost el navegador reutiliza la foto ya descargada aunque CloudFront
// ya tenga el archivo nuevo. Un parámetro distinto en cada carga la pide de
// nuevo. En el build no se agrega.
const IMAGE_BUST = import.meta.env.DEV ? String(Date.now()) : '';
const imageUrl = (url) => (IMAGE_BUST && url ? `${url}${url.includes('?') ? '&' : '?'}arq=${IMAGE_BUST}` : url);

// Módulos de Daö: la base trae «1», «2», «3» (o «1x», «X1»); se muestran siempre «x1», «x2», «x3».
// Un grupo que ya trae medidas «2x2», «3x3» no se toca: sus números sueltos («5», «10») se dejan
// como vienen, sin la x delante.
const GRID = /^\d+\s*x\s*\d+$/i;
const attributeText = (field, value, asIs = false) => {
  const shown = text(value);
  return field === 'modulos' && !asIs ? shown.replace(/^(?:x\s*(\d+)|(\d+)\s*x?)$/i, (_, a, b) => `x${a ?? b}`) : shown;
};
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
  // La base trae el ambiente 1 encendido en la posición 0 (`…_AMBIENT_1_ON.webp`) y deja la 1
  // vacía: si el archivo de la posición 0 es «_ON» y falta la posición 1, es el encendido.
  // TODO (datos): cuando la base respete 0 = apagado y 1 = encendido, esto no hace falta.
  if (out.ambient1 && !out.ambient1On && /_on\.\w+$/i.test(out.ambient1.split(/[?#]/)[0])) out.ambient1On = out.ambient1;
  for (const name of Object.keys(out)) out[name] = imageUrl(out[name]);
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
    // ambient_6 es la foto del parallax (description): no va en la galería
    ambient: ['ambient2', 'ambient3', 'ambient4', 'ambient5', 'ambient7'].map((name) => s[name]).filter(Boolean),
    description: s.ambient6 ?? null,
    inspiration: [s.ambient7].filter(Boolean),
    // Todas las de ambiente 2 a 7, en orden: se suman a la galería del hero de la ficha (catalog.js · variantDetails)
    heroExtra: ['ambient2', 'ambient3', 'ambient4', 'ambient5', 'ambient6', 'ambient7'].map((name) => s[name]).filter(Boolean),
  };
}

// Foto del mega-menú de una fila de colección o de un SKU con is_menu_default.
const menuImage = (s) => s.ambient1On ?? s.ambient1 ?? null;

function collectionFromDoc(doc) {
  const s = slots(doc);
  return {
    id: slug(doc[FIELDS.name]),
    name: text(doc[FIELDS.name]),
    families: list(doc[FIELDS.family]).map(normalize),
    intro: text(doc[FIELDS.collectionIntro]),
    description: text(doc[FIELDS.collectionDescription]),
    images: {
      // menu: solo el mega-menú. No es «context»: la card de colección no
      // cambia en hover (typesense-schema.md · Imágenes).
      menu: menuImage(s),
      studio: s.card ?? null,
      studioOn: s.cardOn ?? null,
      gallery: list(doc[FIELDS.collectionGallery]).map(imageUrl),
      description: s.description ?? null,
      inspiration: list(doc[FIELDS.collectionInspiration]).map(imageUrl),
    },
  };
}

// SKU predeterminado del grupo: el marcado con is_group_default. Con varias marcadas
// (la base marca una por product_name o por modelo), el de SKU más corto y, a igual
// largo, el menor: el modelo estándar antes que el Mini (DAO-T-X1-N antes que
// DAO-MINI-T-X1-N) y X1 antes que X2 («Simple» antes que «Doble»). Sin marca, la primera.
// Lo ideal es marcar uno solo por grupo en la hoja.
function defaultRow(rows) {
  const marked = rows.filter((doc) => doc[FIELDS.isDefault] === true);
  if (marked.length < 2) return marked[0] ?? rows[0];
  const bySku = (a, b) => String(a.sku).length - String(b.sku).length || String(a.sku).localeCompare(String(b.sku), 'es', { numeric: true });
  return [...marked].sort(bySku)[0];
}

// Nombre del grupo: las palabras del nombre del predeterminado que están en todos los
// product_name de sus filas, sin importar tildes ni mayúsculas: «Daö Simple», «Daö
// Doble» y «Mini Dao Simple» → «Daö»; «Daö Trimless Doble» y «Mini Daö Trimless Triple»
// → «Daö Trimless». Con un solo nombre, ese. Si no comparten ninguna palabra, el del
// predeterminado.
function groupName(rows, first) {
  const own = text(first[FIELDS.name]);
  const names = [...new Set(rows.map((doc) => text(doc[FIELDS.name])).filter(Boolean))];
  if (names.length < 2) return own;
  const others = names.map((name) => name.split(/\s+/).map(normalize));
  const shared = own.split(/\s+/).filter((word) => others.every((words) => words.includes(normalize(word))));
  return shared.length ? shared.join(' ') : own;
}

/**
 * Documentos → { collections, groups, withDetails(id, documentosDeDetalle) }.
 * withDetails devuelve el grupo reconstruido con los campos de DETAIL_FIELDS.
 */
export function fromDocuments(rawDocs) {
  const collections = [];
  const byKey = new Map();
  // Productos con modelos (Daö y Mini Daö): completa grupo_producto y modelo (models.js)
  const docs = applyModels(rawDocs);
  for (const doc of docs) {
    const name = text(doc[FIELDS.name]);
    if (!name) continue; // sin nombre: todavía no se publica
    if (text(doc[FIELDS.productType]) === COLLECTION_TYPE) {
      collections.push(collectionFromDoc(doc));
      continue;
    }
    // grupo_producto (si la fila lo trae) manda sobre grupo_variantes. Una fila sin ninguno
    // de los dos se agrupa por su nombre, como antes.
    const variantGroup = text(doc[FIELDS.productGroup]) || text(doc[FIELDS.variantGroup]);
    const key = variantGroup ? `g:${variantGroup}` : `n:${slug(name)}`;
    if (!byKey.has(key)) byKey.set(key, []);
    byKey.get(key).push(doc);
  }

  // id de cada grupo: el slug de su nombre. Si dos grupos dan el mismo, el segundo
  // suma su grupo_variantes para no pisarse.
  const byGroup = new Map();
  for (const rows of byKey.values()) {
    const base = slug(groupName(rows, defaultRow(rows)));
    const id = byGroup.has(base) ? `${base}-${slug(text(rows[0][FIELDS.variantGroup])) || byGroup.size}` : base;
    byGroup.set(id, rows);
  }

  const collectionOf = (family) => collections.find((c) => c.families.includes(normalize(family)))?.id ?? null;
  // compatible_with nombra un producto por su product_name: cualquiera de los de un grupo lleva a él.
  const idByName = new Map([...byGroup].flatMap(([id, rows]) => rows.map((doc) => [normalize(doc[FIELDS.name]), id])));

  const groupFromRows = (id, rows) => {
    const first = defaultRow(rows);
    const names = new Set(rows.map((doc) => text(doc[FIELDS.name])));
    const gridModules = rows.some((doc) => GRID.test(text(doc.modulos)));
    const productType = text(first[FIELDS.productType]) || DEFAULT_TYPE;
    const compatible = list(first[FIELDS.compatibleWith]).map((name) => idByName.get(normalize(name))).filter(Boolean);
    return {
      id,
      name: groupName(rows, first),
      // grupo_variantes: el SKU cortado que comparten las variantes. variantNames: el
      // grupo reúne varios product_name (Simple, Doble…): cada variante lleva el suyo.
      variantGroup: text(first[FIELDS.variantGroup]),
      variantNames: names.size > 1,
      // Familia de la base («Kanu», «Tori»…): decide la imagen de algunos
      // acabados (finishes.js). Un grupo, una familia: la de su SKU predeterminado.
      family: list(first[FIELDS.family])[0] ?? '',
      collection: productType === ACCESSORY_TYPE ? null : collectionOf(first[FIELDS.family]),
      productType,
      // ¿La base marca un SKU predeterminado (is_group_default)? Sin marca, el primero
      // hace de predeterminado en la ficha, pero el grupo no se lista (catalog.js · isListed).
      hasDefault: rows.some((doc) => doc[FIELDS.isDefault] === true),
      // Foto de su aplicación en el mega-menú: la del SKU marcado con is_menu_default.
      menuImage: (() => {
        const marked = rows.find((doc) => doc[FIELDS.isMenuDefault] === true);
        return marked ? menuImage(slots(marked)) : null;
      })(),
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
        // Nombre de esta variante (product_name de su fila): «Daö Doble» dentro del grupo «Daö»
        name: text(doc[FIELDS.name]),
        isDefault: doc === first,
        // Novedad: la columna «new» de Sheets (bool), por SKU. Cada SKU marcado es un producto
        // recomendado del buscador, con sus propias fotos (catalog.js · getRecommendedProducts).
        isNew: doc[FIELDS.isNew] === true,
        description: text(doc[FIELDS.description]),
        attributes: Object.fromEntries(Object.keys(ATTRIBUTES).map((field) => [field, attributeText(field, doc[field], gridModules)]).filter(([, v]) => v && v !== '-')),
        images: variantImages(doc),
        downloads: Object.fromEntries(DOWNLOADS.map((field) => [field, text(doc[field])]).filter(([, v]) => v)),
        // Dibujo con cotas (cotas_img): una URL, o una lista cuya primera es el dibujo
        cota: text(Array.isArray(doc.cotas_img) ? doc.cotas_img[0] : doc.cotas_img),
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
