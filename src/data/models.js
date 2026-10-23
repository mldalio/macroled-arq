// Productos con un nivel de agrupación mayor: un producto que se configura en ciertas
// partes, como Daö (estándar) y Mini Daö, que son un solo producto con dos modelos
// (docs/decisiones.md, 2026-10-23 · Modelos de un producto).
//
// Cada modelo tiene su propio grupo_variantes (DAO-E y DAO-MINI-E). Este archivo los
// une en un solo producto y agrega el selector «Modelo» (Estándar · Mini):
//
//   DAO-E, DAO-MINI-E  →  grupo_producto DAO-E,  modelo «Estándar» y «Mini»
//
// Hoy se resuelve por código, y solo para Daö. Cuando otro producto necesite lo mismo,
// la hoja gana las columnas `grupo_producto` y `modelo` (que el adaptador ya lee) y esta
// regla deja de hacer falta: una fila que ya trae `grupo_producto` no se toca.
//
// Dos reglas de seguridad, para que una unión equivocada no pase desapercibida:
// - Solo se unen dos grupos que existen los dos (un DAO-E-PH sin Mini no recibe «Modelo»).
// - No se unen grupos de distinta macrofamilia o subfamilia: Aplicar y Embutir son
//   categorías de navegación y el producto se listaría solo en una.

// Cada regla: de qué grupos es (match), cómo se llama el grupo del modelo base a partir
// del de cualquier modelo (parent) y qué modelo es cada uno (model).
const RULES = Object.freeze([
  {
    match: /^DAO-/,
    parent: (variantGroup) => variantGroup.replace('-MINI', ''),
    model: (variantGroup) => (variantGroup.includes('-MINI') ? 'Mini' : 'Estándar'),
  },
]);

const text = (value) => (value === undefined || value === null ? '' : String(value).trim());
const names = (value) => (Array.isArray(value) ? value : text(value).split(',')).map(text).filter(Boolean);

// «modelo» va justo después del color (el color manda y el modelo sigue), o primero si no hay color.
function withModelAttribute(variantAttributes) {
  const list = names(variantAttributes).filter((name) => name !== 'modelo');
  const at = list.indexOf('color_carcasa') + 1;
  return [...list.slice(0, at), 'modelo', ...list.slice(at)].join(', ');
}

/**
 * Devuelve los documentos con `grupo_producto` y `modelo` completados donde la regla
 * aplica. No modifica los originales (el catálogo liviano se guarda en sessionStorage).
 */
export function applyModels(docs) {
  const fresh = (doc) => !text(doc.grupo_producto) && !text(doc.modelo);
  const rule = (doc) => RULES.find((r) => r.match.test(text(doc.grupo_variantes)));

  // Por grupo de producto: qué grupos de variantes lo forman y en qué categoría están.
  const parents = new Map();
  for (const doc of docs) {
    const r = rule(doc);
    if (!r || !fresh(doc)) continue;
    const variantGroup = text(doc.grupo_variantes);
    const parent = r.parent(variantGroup);
    if (!parents.has(parent)) parents.set(parent, { variantGroups: new Set(), models: new Set(), categories: new Set() });
    const entry = parents.get(parent);
    entry.variantGroups.add(variantGroup);
    entry.models.add(r.model(variantGroup));
    entry.categories.add(`${text(doc.macrofamilia)}|${text(doc.subfamilia)}`);
  }

  // Se unen los que tienen más de un modelo y una sola categoría.
  const merged = new Set([...parents].filter(([, e]) => e.models.size > 1 && e.categories.size === 1).map(([parent]) => parent));
  for (const [parent, e] of parents) {
    if (e.models.size > 1 && e.categories.size > 1) console.warn(`[arq] modelos: «${parent}» mezcla categorías (${[...e.categories].join(', ')}): no se unen.`);
  }

  return docs.map((doc) => {
    const r = rule(doc);
    if (!r || !fresh(doc)) return doc;
    const variantGroup = text(doc.grupo_variantes);
    const parent = r.parent(variantGroup);
    if (!merged.has(parent)) return doc;
    return { ...doc, grupo_producto: parent, modelo: r.model(variantGroup), variant_attributes: withModelAttribute(doc.variant_attributes) };
  });
}
