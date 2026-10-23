// Configurador de la colección Daö (aro → cabezal → lámpara → frente).
// Misma lógica que arq_nosotros/dao_config/base.js, leyendo Typesense
// (src/data/typesense.js) en lugar del CSV. Los componentes no consultan.

import { searchAll, inFilter, quote } from './typesense.js';
import { loadSource } from './source.js';
import { productHref } from './catalog.js';
import { finishImage } from './finishes.js';

const FAMILY = 'Dao';

// Presentación, igual que el demo: orden de grupos y el nombre de cada cantidad
// de módulos. Los colores salen de finishes.js (familia Dao).
const MODULE_NAMES = { 1: 'Simple', 2: 'Doble', 3: 'Triple' };
const GROUP_ORDER = ['DAO-E', 'DAO-T', 'DAO-MINI-E', 'DAO-MINI-T', 'DAO-E-PH', 'DAO-E-DF'];
const COLOR_ORDER = ['Negro', 'Blanco', 'Cobre', 'Bronce', 'Celeste', 'Grafito', 'Platil'];

// Piezas que el armado suma y que todavía no tienen fila. Cuando tengan SKU,
// se completan acá y se leen de Typesense. Sin SKU no se muestran.
// TODO (datos): bornera + casquillo GU10 y panal abeja.
const EXTRAS = {
  bornera: { nombre: 'Bornera + casquillo GU10', sku: '' },
  panal: { nombre: 'Panal abeja', sku: '' },
};

const FIELDS = [
  'sku', 'familia', 'product_name', 'categoria', 'grupo_variantes', 'color_carcasa', 'modulos', 'tamanio', 'dimensiones',
  'cabezales_compatibles', 'lamparas_compatibles', 'frentes_compatibles', 'orientacion', 'visto_en_cielorraso',
  'angulo_apertura', 'temperatura_color', 'multimagen_producto',
];
const RELATED = ['cabezales_compatibles', 'lamparas_compatibles', 'frentes_compatibles'];

const clean = (value) => (value == null ? '' : String(value).trim());
const asList = (value) => (Array.isArray(value) ? value.map(clean) : clean(value).split(',')).map((item) => item.trim()).filter(Boolean);
const stripModule = (name) => clean(name).replace(/\s+(Simple|Doble|Triple)$/i, '');
// Un cabezal por grupo: si vienen los dos colores, queda el del aro.
function uniqueByGroup(rows, color) {
  const byGroup = new Map();
  for (const row of rows) {
    const current = byGroup.get(row.grupo);
    if (!current || (row.color === color && current.color !== color)) byGroup.set(row.grupo, row);
  }
  return [...byGroup.values()];
}

const orderOf = (list, value) => {
  const index = list.indexOf(value);
  return index < 0 ? 999 : index;
};

/** «74 Ø * 26mm» → «Ø74×26 mm». */
export function formatSize(value) {
  const text = clean(value);
  if (!text) return '';
  return text.replace(/(\d+(?:[.,]\d+)?)\s*Ø/g, 'Ø$1').replace(/\s*[*xX×]\s*/g, '×').replace(/\s*mm$/i, ' mm');
}

function fromDoc(doc) {
  const images = Array.isArray(doc.multimagen_producto) ? doc.multimagen_producto : [];
  return {
    sku: clean(doc.sku),
    nombre: clean(doc.product_name),
    categoria: clean(doc.categoria),
    grupo: clean(doc.grupo_variantes),
    color: clean(doc.color_carcasa),
    modulos: Number.parseInt(clean(doc.modulos), 10) || 1,
    dim: clean(doc.tamanio) || clean(doc.dimensiones),
    cabezales: asList(doc.cabezales_compatibles),
    lamparas: asList(doc.lamparas_compatibles),
    frentes: asList(doc.frentes_compatibles),
    orientacion: clean(doc.orientacion),
    visto: clean(doc.visto_en_cielorraso),
    haz: clean(doc.angulo_apertura),
    luz: clean(doc.temperatura_color),
    img: clean(images[1]) || clean(images[0]),
  };
}

/**
 * Filas de Daö (y las piezas que referencian y no son de esa familia) → modelo
 * del configurador. Una fila sin categoría de aro no entra en los grupos.
 */
export function buildDaoModel(rows) {
  const warnings = [];
  const warn = (level, text) => {
    if (!warnings.some((item) => item.text === text)) warnings.push({ level, text });
  };

  const bySku = {};
  for (const row of rows) {
    if (!(row.sku.startsWith('DAO-') || row.sku.startsWith('PAR11-'))) continue;
    bySku[row.sku] = row;
  }
  const all = Object.values(bySku);
  for (const row of all) {
    if (row.sku.startsWith('DAO-') && !row.categoria) warn('error', `${row.sku}: falta la categoría (Aro, Cabezal o Accesorio).`);
  }

  const rings = all.filter((row) => row.sku.startsWith('DAO-') && (row.categoria === 'Aro' || row.categoria === 'Accesorio'));
  const byGroup = new Map();
  for (const ring of rings) {
    if (!byGroup.has(ring.grupo)) byGroup.set(ring.grupo, []);
    byGroup.get(ring.grupo).push(ring);
  }
  const groups = [...byGroup.keys()].sort((a, b) => orderOf(GROUP_ORDER, a) - orderOf(GROUP_ORDER, b)).map((id) => {
    const rowsOfGroup = byGroup.get(id);
    return {
      id,
      name: stripModule(rowsOfGroup[0].nombre) || id,
      rows: rowsOfGroup,
      modulos: [...new Set(rowsOfGroup.map((row) => row.modulos))].sort((a, b) => a - b),
      colores: [...new Set(rowsOfGroup.map((row) => row.color).filter(Boolean))].sort((a, b) => orderOf(COLOR_ORDER, a) - orderOf(COLOR_ORDER, b)),
    };
  });

  const refs = (skus) => skus.map((sku) => bySku[sku]).filter(Boolean);
  const model = {
    bySku,
    groups,
    moduleName: (qty) => MODULE_NAMES[qty] || `${qty} módulos`,
    formatSize,
    swatch: (color) => finishImage(color, FAMILY),
    extra: (key) => {
      const piece = EXTRAS[key];
      return piece?.sku && bySku[piece.sku] ? bySku[piece.sku] : null;
    },
    group: (id) => groups.find((group) => group.id === id) ?? null,
    colorsFor(id, qty) {
      const group = model.group(id);
      if (!group) return [];
      return group.colores.filter((color) => group.rows.some((row) => row.modulos === qty && row.color === color));
    },
    ring(id, qty, color) {
      return model.group(id)?.rows.find((row) => row.modulos === qty && row.color === color) ?? null;
    },
    cabezales: (row) => (row ? refs(row.cabezales) : []),
    lamparas: (row) => (row ? refs(row.lamparas) : []),
    frentes: (lamp) => (lamp ? refs(lamp.frentes) : []),
  };

  const missing = new Map();
  const mark = (level, label, sku) => {
    if (!missing.has(label)) missing.set(label, { level, items: new Set() });
    missing.get(label).items.add(sku);
  };
  const checkRefs = (owner, skus, kind) => {
    for (const sku of skus) {
      if (!bySku[sku]) mark('error', `«${sku}» figura como ${kind} compatible pero no existe en la base`, owner.sku);
    }
  };
  for (const ring of rings) {
    checkRefs(ring, ring.cabezales, 'cabezal');
    checkRefs(ring, ring.lamparas, 'lámpara');
    const heads = model.cabezales(ring);
    const lamps = heads.length ? [] : model.lamparas(ring);
    if (!heads.length && !lamps.length) mark('error', 'Aros sin cabezales ni lámparas compatibles', ring.sku);
    for (const head of heads) {
      checkRefs(head, head.lamparas, 'lámpara');
      if (!model.lamparas(head).length) mark('error', 'Cabezales sin lámparas compatibles', head.sku);
    }
  }
  for (const [label, entry] of missing) {
    const items = [...entry.items];
    warn(entry.level, `${label} (${items.length}): ${items.slice(0, 6).join(', ')}${items.length > 6 ? ', …' : ''}`);
  }
  for (const item of warnings) console.warn(`[arq] configurador Daö: ${item.text}`);
  return model;
}

function fallbackSelection(model) {
  const first = model.groups[0];
  return { group: first?.id ?? null, qty: first?.modulos[0] ?? 1, color: null, head: null, lamp: null };
}

function fromRing(ring, extra = {}) {
  return {
    group: ring.grupo,
    qty: ring.modulos,
    color: ring.color,
    head: extra.head ?? null,
    lamp: extra.lamp ?? null,
    front: extra.front ?? null,
  };
}

/** Aros en el orden del configurador: grupo, después menos módulos, después color. */
function ringsInOrder(model) {
  const rows = [];
  for (const group of model.groups) {
    rows.push(...[...group.rows].sort((a, b) => a.modulos - b.modulos || orderOf(COLOR_ORDER, a.color) - orderOf(COLOR_ORDER, b.color)));
  }
  return rows;
}

/**
 * Un armado que incluye esta lámpara: el primer aro (o su cabezal) que la lista.
 */
function selectionForLamp(model, lampSku) {
  for (const ring of ringsInOrder(model)) {
    const head = model.cabezales(ring).find((item) => item.lamparas.includes(lampSku));
    if (head) return fromRing(ring, { head: head.grupo, lamp: lampSku });
    if (ring.lamparas.includes(lampSku)) return fromRing(ring, { lamp: lampSku });
  }
  return null;
}

/**
 * Estado inicial: la pieza de la ficha queda elegida y el resto es un armado
 * compatible con ella. Sin SKU, o si no está en la base, el primer aro.
 */
export function daoSelection(model, sku) {
  const row = sku ? model.bySku[clean(sku)] : null;
  if (!row) return fallbackSelection(model);

  if ((row.categoria === 'Aro' || row.categoria === 'Accesorio') && model.group(row.grupo)) {
    return fromRing(row);
  }

  if (row.categoria === 'Cabezal') {
    const ring = ringsInOrder(model).find((item) => item.cabezales.includes(row.sku));
    if (ring) return fromRing(ring, { head: row.grupo });
  }

  if (row.categoria === 'Lámpara') {
    return selectionForLamp(model, row.sku) ?? fallbackSelection(model);
  }

  if (row.categoria === 'Frente') {
    const lamp = Object.values(model.bySku).find((item) => item.categoria === 'Lámpara' && item.frentes.includes(row.sku));
    const selection = lamp ? selectionForLamp(model, lamp.sku) : null;
    if (!selection) return fallbackSelection(model);
    const sameColor = model.ring(selection.group, selection.qty, row.color);
    const chosen = sameColor ? fromRing(sameColor, { head: selection.head, lamp: lamp.sku, front: row.sku }) : { ...selection, front: row.sku };
    return chosen;
  }

  return fallbackSelection(model);
}

/**
 * Lo que muestra el configurador para una elección. Cada paso depende del
 * anterior. href es la ficha del SKU cuando el catálogo tiene ese grupo.
 */
export function resolveDao(model, selection, hrefs) {
  const group = model.group(selection.group) ?? model.groups[0];
  if (!group) return null;
  const qty = group.modulos.includes(selection.qty) ? selection.qty : group.modulos[0];
  const colors = model.colorsFor(group.id, qty);
  const color = colors.includes(selection.color) ? selection.color : colors[0] ?? null;
  const ring = model.ring(group.id, qty, color);
  if (!ring) return null;

  const heads = uniqueByGroup(model.cabezales(ring), ring.color);
  const head = heads.find((item) => item.grupo === selection.head) ?? heads[0] ?? null;
  const lamps = model.lamparas(head || ring);
  const lamp = lamps.find((item) => item.sku === selection.lamp) ?? lamps[0] ?? null;
  const fronts = model.frentes(lamp);
  const front = fronts.find((item) => item.sku === selection.front) ?? fronts.find((item) => item.color === ring.color) ?? fronts[0] ?? null;

  const qtyName = group.modulos.length > 1 ? `${model.moduleName(qty).toLowerCase()} ` : '';
  const ringName = `${group.name} ${qtyName}${ring.color.toLowerCase()}`.replace(/\s+/g, ' ').trim();
  const parts = [{ qty: 1, name: ringName, sku: ring.sku }];
  if (head) {
    const terminal = model.extra('bornera');
    if (terminal) parts.push({ qty: ring.modulos, name: terminal.nombre, sku: terminal.sku });
    parts.push({ qty: ring.modulos, name: `${head.nombre || head.sku} ${ring.color.toLowerCase()}`.trim(), sku: head.sku });
  }
  if (lamp) parts.push({ qty: ring.modulos, name: lamp.nombre || lamp.sku, sku: lamp.sku });
  if (front) parts.push({ qty: ring.modulos, name: `${front.nombre || 'Frente'} ${ring.color.toLowerCase()}`.trim(), sku: front.sku });
  if (lamp?.frentes.length) {
    const honeycomb = model.extra('panal');
    if (honeycomb) parts.push({ qty: ring.modulos, name: honeycomb.nombre, sku: honeycomb.sku });
  }

  const specs = [
    ['Haz', lamp?.haz],
    ['Color de luz', lamp?.luz],
    ['Orientación', head?.orientacion],
    ['En el cielorraso', ring.visto],
    ['Medida del aro', model.formatSize(ring.dim)],
  ].filter(([, value]) => value);

  return {
    group,
    qty,
    color,
    colors,
    ring,
    heads,
    head,
    lamps,
    lamp,
    fronts,
    front,
    ringName,
    title: ringName.charAt(0).toUpperCase() + ringName.slice(1),
    thumbs: [
      { src: ring.img, label: ringName },
      head ? { src: head.img, label: head.nombre || head.sku } : { src: lamp?.img, label: lamp ? (lamp.nombre || lamp.sku) : 'Lámpara' },
      front ? { src: front.img, label: front.color ? `${front.nombre || front.sku} ${front.color}` : (front.nombre || front.sku) } : null,
    ].filter((thumb) => thumb?.src),
    specs,
    parts: parts.map((part) => ({ ...part, href: hrefs.get(part.sku) ?? null })),
  };
}

async function loadRows() {
  const params = { q: '*', include_fields: FIELDS.join(',') };
  const family = await searchAll({ ...params, filter_by: `familia:=${quote(FAMILY)}` });
  const docs = new Map(family.map((doc) => [clean(doc.sku), doc]));
  for (let round = 0; round < 4; round += 1) {
    const missing = new Set();
    for (const doc of docs.values()) {
      for (const field of RELATED) {
        for (const sku of asList(doc[field])) if (!docs.has(sku)) missing.add(sku);
      }
    }
    if (!missing.size) break;
    const before = docs.size;
    const extra = await searchAll({ ...params, filter_by: inFilter('sku', [...missing]) });
    for (const doc of extra) docs.set(clean(doc.sku), doc);
    if (docs.size === before) break;
  }
  return [...docs.values()].map(fromDoc);
}

/** Modelo del configurador y la ficha de cada SKU (cuando el catálogo la tiene). */
export async function getDaoConfigurator() {
  const [rows, { groups }] = await Promise.all([loadRows(), loadSource()]);
  const hrefs = new Map();
  for (const group of groups) {
    for (const variant of group.variants) hrefs.set(variant.sku, productHref(group.id, variant.sku));
  }
  return { model: buildDaoModel(rows), hrefs };
}
