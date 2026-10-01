// npm run tokens:import
// Convierte el export de variables de Figma (tokens/figma/<colección>.<modo>.json,
// DTCG generado por MCP con scripts/figma/) a tokens/tokens.json en el formato
// del repo (ver docs/decisiones.md · Formato de tokens/tokens.json):
//   - Un solo árbol: el nombre de la colección no forma parte de la ruta.
//   - $value es el modo base (Value, Light o Desktop); Dark y Mobile van en
//     $extensions["arq.modes"] solo si cambian.
//   - Tipos del repo: color (hex en mayúsculas), dimension (px), fontWeight,
//     fontFamily, duration (ms) y cubicBezier.
//   - motion/duration/fast, base y slow suman el modo reducedMotion = 0ms.
//   - No se importan las paletas de marca sin uso (bronze, cacao, olive,
//     terracotta, offwhite).
//   - role/* no son variables (son estilos de texto): se conservan del
//     tokens.json actual.
// Valida el resultado con las mismas reglas que npm run tokens. Si hay
// problemas, no escribe nada. Al final lista las diferencias con el anterior.

import { readFile, readdir, writeFile } from 'node:fs/promises';
import { collectTokens, validate } from './lib/validate-tokens.js';

const FIGMA_DIR = new URL('../tokens/figma/', import.meta.url);
const TARGET = new URL('../tokens/tokens.json', import.meta.url);

// Modo de Figma → modo del repo (null = valor base).
const MODE_MAP = { Value: null, Light: null, Desktop: null, Dark: 'dark', Mobile: 'mobile' };
const EXCLUDED_GROUPS = ['bronze', 'cacao', 'olive', 'terracotta', 'offwhite'];
const REDUCED_MOTION = ['motion.duration.fast', 'motion.duration.base', 'motion.duration.slow'];
// Orden de los grupos de primer nivel en tokens.json (los nuevos van al final).
const GROUP_ORDER = ['space', 'font', 'radius', 'border', 'blur', 'neutral', 'red', 'green', 'amber', 'alpha', 'color', 'layout', 'icon', 'swatch', 'type', 'motion', 'role'];

const isToken = (node) => node && typeof node === 'object' && '$value' in node;
const isAlias = (v) => typeof v === 'string' && /^\{[^}]+\}$/.test(v);
const round = (n) => Number(n.toFixed(4));

// Tipo del repo según la ruta y el $type de Figma.
function repoType(path, figmaType) {
  if (figmaType === 'color') return 'color';
  if (path.startsWith('font.weight.')) return 'fontWeight';
  if (path.startsWith('font.family.')) return 'fontFamily';
  if (path.startsWith('motion.duration.')) return 'duration';
  if (path.startsWith('motion.easing.')) return 'cubicBezier';
  if (figmaType === 'number') return 'dimension';
  throw new Error(`${path}: no se sabe convertir una variable ${figmaType}`);
}

function convert(path, type, value) {
  if (isAlias(value)) return value;
  switch (type) {
    case 'color':
      return value.toUpperCase();
    case 'dimension':
      return `${round(value)}px`;
    case 'duration':
      return `${round(value)}ms`;
    case 'fontWeight':
      return value;
    case 'fontFamily':
      return value;
    case 'cubicBezier': {
      const match = String(value).match(/^cubic-bezier\(([^)]+)\)$/);
      if (!match) throw new Error(`${path}: "${value}" no es un cubic-bezier()`);
      return match[1].split(',').map((n) => Number(n.trim()));
    }
  }
}

function flatten(node, path = [], out = new Map()) {
  if (isToken(node)) out.set(path.join('.'), node);
  else if (node && typeof node === 'object') {
    for (const [key, child] of Object.entries(node)) {
      if (!key.startsWith('$')) flatten(child, [...path, key], out);
    }
  }
  return out;
}

// ── Leer el export ─────────────────────────────────────────────────
const files = (await readdir(FIGMA_DIR)).filter((f) => f.endsWith('.json')).sort();
if (!files.length) {
  console.error('tokens/figma/ está vacío: primero hay que exportar las variables por MCP (ver docs/setup.md).');
  process.exit(1);
}

const tokens = new Map(); // path → { type, base, modes: {}, description, order }
let order = 0;
for (const file of files) {
  const data = JSON.parse(await readFile(new URL(file, FIGMA_DIR), 'utf8'));
  const { collection, mode } = data.$extensions?.['com.figma'] ?? {};
  if (!(mode in MODE_MAP)) throw new Error(`${file}: modo "${mode}" desconocido (${Object.keys(MODE_MAP).join(', ')})`);
  const repoMode = MODE_MAP[mode];
  for (const [path, token] of flatten(data)) {
    if (EXCLUDED_GROUPS.includes(path.split('.')[0])) continue;
    const type = repoType(path, token.$type);
    const value = convert(path, type, token.$value);
    const entry = tokens.get(path) ?? { type, modes: {}, order: order++, collection };
    if (entry.collection !== collection) throw new Error(`${path}: está en "${entry.collection}" y en "${collection}"`);
    if (repoMode) entry.modes[repoMode] = value;
    else entry.base = value;
    if (token.$description) entry.description = token.$description;
    tokens.set(path, entry);
  }
}

// ── Armar tokens.json ──────────────────────────────────────────────
const previous = JSON.parse(await readFile(TARGET, 'utf8'));
if (!previous.role) {
  console.error('tokens.json no tiene la rama role: los estilos de texto no vienen del export de variables.');
  process.exit(1);
}

// Se respeta el orden del tokens.json anterior para que el diff muestre solo
// cambios reales; los tokens nuevos van al final de su grupo, en el orden de Figma.
const previousOrder = new Map(collectTokens(previous).map(({ path }, i) => [path.join('.'), i]));
const groupIndex = (path) => {
  const i = GROUP_ORDER.indexOf(path.split('.')[0]);
  return i === -1 ? GROUP_ORDER.length : i;
};
const sorted = [...tokens].sort(([a, ea], [b, eb]) => {
  const pa = previousOrder.get(a) ?? Infinity;
  const pb = previousOrder.get(b) ?? Infinity;
  return groupIndex(a) - groupIndex(b) || (pa === pb ? ea.order - eb.order : pa - pb);
});

const tree = {};
for (const [path, entry] of sorted) {
  if (entry.base === undefined) throw new Error(`${path}: falta el valor del modo base`);
  const token = { $type: entry.type, $value: entry.base };
  if (entry.description) token.$description = entry.description;
  const modes = {};
  for (const [mode, value] of Object.entries(entry.modes)) {
    if (JSON.stringify(value) !== JSON.stringify(entry.base)) modes[mode] = value;
  }
  if (REDUCED_MOTION.includes(path)) modes.reducedMotion = '0ms';
  if (Object.keys(modes).length) token.$extensions = { 'arq.modes': modes };
  const keys = path.split('.');
  let node = tree;
  for (const key of keys.slice(0, -1)) node = node[key] ??= {};
  node[keys.at(-1)] = token;
}
for (const path of REDUCED_MOTION) {
  if (!tokens.has(path)) throw new Error(`${path}: no está en el export (hace falta para reducedMotion)`);
}
tree.role = previous.role;

const { problems, count } = validate(tree);
if (problems.length) {
  console.error(`Resultado con ${problems.length} problema(s), no se escribió nada:\n- ${problems.join('\n- ')}`);
  process.exit(1);
}

// ── Diferencias con el tokens.json anterior ───────────────────────
const asMap = (t) => new Map(collectTokens(t).map(({ path, token }) => [path.join('/'), token]));
const before = asMap(previous);
const after = asMap(tree);
const diff = { added: [], removed: [], changed: [] };
for (const [path, token] of after) {
  const old = before.get(path);
  if (!old) diff.added.push(path);
  else {
    for (const key of ['$type', '$value', '$description', '$extensions']) {
      if (JSON.stringify(old[key]) !== JSON.stringify(token[key])) {
        diff.changed.push(`${path} ${key}: ${JSON.stringify(old[key])} → ${JSON.stringify(token[key])}`);
      }
    }
  }
}
for (const path of before.keys()) if (!after.has(path)) diff.removed.push(path);

await writeFile(TARGET, `${JSON.stringify(tree, null, 2)}\n`);

console.log(`${files.length} archivos de tokens/figma/ → ${count} tokens en tokens/tokens.json.`);
const section = (title, list) => list.length && console.log(`\n${title} (${list.length}):\n- ${list.join('\n- ')}`);
if (!diff.added.length && !diff.removed.length && !diff.changed.length) console.log('Sin cambios.');
section('Nuevos', diff.added);
section('Quitados', diff.removed);
section('Cambiados', diff.changed);
console.log('\nSiguiente paso: npm run tokens');
