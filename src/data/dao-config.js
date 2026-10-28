// Configurador de la colección Daö (aro → cabezal → lámpara → frente).
// Misma lógica que arq_nosotros/dao_config/base.js, leyendo Typesense
// (src/data/typesense.js) en lugar del CSV. Los componentes no consultan.

import { searchAll, inFilter, quote } from './typesense.js';
import { loadSource } from './source.js';
import { productHref } from './catalog.js';
import { finishImage } from './finishes.js';

const FAMILY = 'Dao';

// Presentación, igual que el demo: orden de grupos. Los colores salen de
// finishes.js (familia Dao). Los módulos se muestran «x1», «x2», «x3», como en
// la ficha (typesense-adapter.js).
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
    moduleName: (qty) => `x${qty}`,
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
    headColor: extra.headColor ?? null,
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

// Rol de una pieza según quién la lista (las filas de PAR11 traen `categoria` vacía)
function roleOf(model, row) {
  const all = Object.values(model.bySku);
  if (all.some((item) => item.frentes.includes(row.sku))) return 'front';
  if (all.some((item) => item.lamparas.includes(row.sku))) return 'lamp';
  if (all.some((item) => item.cabezales.includes(row.sku))) return 'head';
  if ((row.categoria === 'Aro' || row.categoria === 'Accesorio') && model.group(row.grupo)) return 'ring';
  return null;
}

/**
 * Estado inicial: la pieza de la ficha queda elegida y el resto es un armado
 * compatible con ella. Sin SKU, o si no está en la base, el primer aro.
 */
export function daoSelection(model, sku) {
  const row = sku ? model.bySku[clean(sku)] : null;
  if (!row) return fallbackSelection(model);
  const role = roleOf(model, row);

  if (role === 'ring') return fromRing(row);

  if (role === 'head') {
    const ring = ringsInOrder(model).find((item) => item.cabezales.includes(row.sku));
    if (ring) return fromRing(ring, { head: row.grupo, headColor: row.color });
  }

  if (role === 'lamp') {
    return selectionForLamp(model, row.sku) ?? fallbackSelection(model);
  }

  if (role === 'front') {
    const lamp = Object.values(model.bySku).find((item) => item.frentes.includes(row.sku));
    const selection = lamp ? selectionForLamp(model, lamp.sku) : null;
    if (!selection) return fallbackSelection(model);
    const sameColor = model.ring(selection.group, selection.qty, row.color);
    return sameColor ? fromRing(sameColor, { head: selection.head, lamp: lamp.sku, front: row.sku }) : { ...selection, front: row.sku };
  }

  return fallbackSelection(model);
}

/**
 * La pieza de la ficha desde la que se abre el configurador: en qué paso está y
 * qué fija. step: 'ring' | 'head' | 'lamp' | null (sin pieza). Un aro fija su
 * grupo, módulos y color; un cabezal, su grupo y color; una lámpara (o un frente,
 * que lleva a su lámpara), su SKU.
 */
export function daoFixed(model, sku) {
  const row = sku ? model.bySku[clean(sku)] : null;
  const role = row ? roleOf(model, row) : null;
  if (role === 'ring') return { step: 'ring', group: row.grupo, qty: row.modulos, color: row.color };
  if (role === 'head') return { step: 'head', head: row.grupo, headColor: row.color };
  if (role === 'lamp') return { step: 'lamp', lamp: row.sku };
  if (role === 'front') {
    const lamp = Object.values(model.bySku).find((item) => item.frentes.includes(row.sku));
    return lamp ? { step: 'lamp', lamp: lamp.sku } : { step: null };
  }
  return { step: null };
}

/**
 * Lo que muestra el configurador para una elección. Cada paso depende del
 * anterior. fixed (de daoFixed) limita lo que se puede elegir a lo compatible
 * con la pieza de la ficha: el aro, si la ficha es un cabezal o una lámpara; el
 * cabezal, si es una lámpara.
 */
export function resolveDao(model, selection, hrefs, fixed = { step: null }) {
  const allowed = (ring) => {
    if (fixed.step === 'head') return model.cabezales(ring).some((item) => item.grupo === fixed.head);
    if (fixed.step === 'lamp') return model.cabezales(ring).some((item) => item.lamparas.includes(fixed.lamp)) || ring.lamparas.includes(fixed.lamp);
    return true;
  };
  const groups = model.groups.filter((item) => item.rows.some(allowed));
  const group = groups.find((item) => item.id === selection.group) ?? groups[0];
  if (!group) return null;
  const modulos = [...new Set(group.rows.filter(allowed).map((row) => row.modulos))].sort((a, b) => a - b);
  const qty = modulos.includes(selection.qty) ? selection.qty : modulos[0];
  const colors = model.colorsFor(group.id, qty).filter((item) => allowed(model.ring(group.id, qty, item)));
  const color = colors.includes(selection.color) ? selection.color : colors[0] ?? null;
  const ring = model.ring(group.id, qty, color);
  if (!ring) return null;

  let heads = uniqueByGroup(model.cabezales(ring), ring.color);
  if (fixed.step === 'lamp') heads = heads.filter((item) => model.cabezales(ring).some((row) => row.grupo === item.grupo && row.lamparas.includes(fixed.lamp)));
  const headGroup = heads.find((item) => item.grupo === selection.head) ?? heads[0] ?? null;
  // Colores del cabezal: cada aro lista el cabezal de su propio color, así que se
  // juntan los de todos los colores de ese aro (mismo grupo y módulos). Sin elección, el del aro.
  const sameRings = colors.map((item) => model.ring(group.id, qty, item)).filter(Boolean);
  const headRows = headGroup ? [...new Set(sameRings.flatMap((item) => model.cabezales(item)))].filter((item) => item.grupo === headGroup.grupo) : [];
  const headColors = [...new Set(headRows.map((item) => item.color).filter(Boolean))].sort((a, b) => orderOf(COLOR_ORDER, a) - orderOf(COLOR_ORDER, b));
  const head = headRows.find((item) => item.color === selection.headColor) ?? headRows.find((item) => item.color === ring.color) ?? headGroup;
  let lamps = model.lamparas(head || ring);
  if (fixed.step === 'lamp') lamps = lamps.filter((item) => item.sku === fixed.lamp);
  const lamp = lamps.find((item) => item.sku === selection.lamp) ?? lamps[0] ?? null;
  const fronts = model.frentes(lamp);
  const front = fronts.find((item) => item.sku === selection.front) ?? fronts.find((item) => item.color === ring.color) ?? fronts[0] ?? null;

  const qtyName = modulos.length > 1 ? `${model.moduleName(qty).toLowerCase()} ` : '';
  const ringName = `${group.name} ${qtyName}${ring.color.toLowerCase()}`.replace(/\s+/g, ' ').trim();
  const parts = [{ qty: 1, name: ringName, sku: ring.sku }];
  if (head) {
    const terminal = model.extra('bornera');
    if (terminal) parts.push({ qty: ring.modulos, name: terminal.nombre, sku: terminal.sku });
    parts.push({ qty: ring.modulos, name: `${head.nombre || head.sku} ${(head.color || ring.color).toLowerCase()}`.trim(), sku: head.sku });
  }
  if (lamp) parts.push({ qty: ring.modulos, name: lamp.nombre || lamp.sku, sku: lamp.sku });
  if (front) parts.push({ qty: ring.modulos, name: `${front.nombre || 'Frente'} ${(front.color || ring.color).toLowerCase()}`.trim(), sku: front.sku });
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

  const named = (row) => `${row.nombre || row.sku} ${(row.color || '').toLowerCase()}`.trim();
  return {
    groups,
    group,
    modulos,
    qty,
    color,
    colors,
    ring,
    heads,
    head,
    headColors,
    lamps,
    lamp,
    fronts,
    front,
    ringName,
    title: ringName.charAt(0).toUpperCase() + ringName.slice(1),
    // Una foto por pieza: el panel las suma a medida que se eligen
    pieces: {
      ring: ring.img ? { src: ring.img, label: ringName } : null,
      head: head?.img ? { src: head.img, label: named(head) } : null,
      lamp: lamp?.img ? { src: lamp.img, label: [lamp.nombre || lamp.sku, lamp.haz].filter(Boolean).join(' · ') } : null,
      front: front?.img ? { src: front.img, label: named(front) } : null,
    },
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

/**
 * Lo que va en «compatibles» de la ficha de un SKU de Daö, con las relaciones
 * del configurador (aro ← cabezal ← lámpara ← frente). El rol de cada pieza
 * sale de quién la lista, no de `categoria` (las filas de PAR11 la traen vacía):
 * - Lámpara (la lista un cabezal o un aro): solo sus frentes, que son accesorios
 *   requeridos (kind 'accessory'). Sin frentes, nada.
 * - Frente (la lista una lámpara): las lámparas que lo piden (kind 'product',
 *   «Producto compatible»: la relación de la lámpara, vista desde el otro lado).
 * - Aro o cabezal: los demás aros, cabezales y lámparas con los que se arma, hacia
 *   arriba y hacia abajo, sin los frentes (kind 'compatible').
 * Una tarjeta por grupo (los colores y módulos de un grupo son variantes de su
 * ficha); el grupo del propio SKU no entra. Orden: aros, cabezales y lámparas.
 * Sin SKU o sin la pieza: sin items.
 */
export function compatibleProducts(model, hrefs, sku) {
  const start = model.bySku[clean(sku)];
  if (!start) return { kind: 'compatible', items: [] };
  const all = Object.values(model.bySku);
  const listed = (field) => new Set(all.flatMap((row) => row[field]));
  const heads = listed('cabezales');
  const lamps = listed('lamparas');
  const fronts = listed('frentes');
  const role = (row) => (fronts.has(row.sku) ? 3 : lamps.has(row.sku) ? 2 : heads.has(row.sku) ? 1 : 0);

  const children = (row) => [...row.cabezales, ...row.lamparas, ...row.frentes].map((id) => model.bySku[id]).filter(Boolean);
  const parents = (row) => all.filter((item) => children(item).includes(row));
  const reach = (next) => {
    const seen = new Set();
    const queue = [start];
    while (queue.length) {
      for (const row of next(queue.pop())) {
        if (!seen.has(row)) {
          seen.add(row);
          queue.push(row);
        }
      }
    }
    return seen;
  };
  const key = (row) => row.grupo || row.sku;

  const accessory = role(start) === 2;
  const front = role(start) === 3;
  let rows = [];
  if (accessory) rows = start.frentes.map((id) => model.bySku[id]).filter(Boolean);
  else if (front) rows = parents(start).filter((row) => role(row) === 2); // las lámparas que lo piden
  else rows = [...reach(children), ...reach(parents)].filter((row) => role(row) !== 3);
  rows = rows.filter((row) => key(row) !== key(start));
  rows.sort((a, b) => role(a) - role(b) || orderOf(GROUP_ORDER, a.grupo) - orderOf(GROUP_ORDER, b.grupo));

  const byGroup = new Map();
  for (const row of rows) if (!byGroup.has(key(row))) byGroup.set(key(row), row);
  return {
    kind: accessory ? 'accessory' : front ? 'product' : 'compatible',
    items: [...byGroup.values()].map((row) => {
      const members = all.filter((item) => key(item) === key(row));
      const colors = [...new Set(members.map((item) => item.color).filter(Boolean))].sort((a, b) => orderOf(COLOR_ORDER, a) - orderOf(COLOR_ORDER, b));
      // Cantidad de módulos solo en los aros (en las demás piezas «modulos» vale 1 por omisión)
      const qtys = role(row) === 0 ? [...new Set(members.map((item) => item.modulos))].sort((a, b) => a - b) : [];
      const list = qtys.length > 1 ? `${qtys[0]}-${qtys.at(-1)}` : String(qtys[0] ?? '');
      return {
        sku: row.sku,
        name: stripModule(row.nombre) || row.sku,
        image: row.img,
        href: hrefs.get(row.sku) ?? null,
        finishes: colors.map((color) => ({ name: color, src: model.swatch(color) })),
        meta: qtys.length ? `${list} ${qtys.at(-1) === 1 ? 'módulo' : 'módulos'}` : '',
      };
    }),
  };
}

let configurator = null;

/** Modelo del configurador y la ficha de cada SKU (cuando el catálogo la tiene). Se carga una vez. */
export function getDaoConfigurator() {
  configurator ??= (async () => {
    const [rows, { groups }] = await Promise.all([loadRows(), loadSource()]);
    const hrefs = new Map();
    for (const group of groups) {
      for (const variant of group.variants) hrefs.set(variant.sku, productHref(group.id, variant.sku));
    }
    return { model: buildDaoModel(rows), hrefs };
  })();
  configurator.catch(() => (configurator = null)); // un error permite reintentar
  return configurator;
}
