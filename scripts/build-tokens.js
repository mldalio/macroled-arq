// npm run tokens
// Lee tokens/tokens.json (formato DTCG) y genera con Style Dictionary:
//   src/styles/tokens.css  → variables --arq-*
//     :root                             valores base (Light · Desktop)
//     [data-arq-theme="dark"]           modo dark (solo los tokens que lo tienen)
//     @media (max-width: 767px) :root   modo mobile (solo los que cambian)
//   src/styles/roles.css   → estilos de texto role/* como clases .role-<nombre>
//     (no son variables: los componentes los adoptan con src/styles/roles.js)
// Nunca se usa prefers-color-scheme: dark solo se activa con data-arq-theme.

import { readFile, writeFile } from 'node:fs/promises';
import StyleDictionary from 'style-dictionary';
import { getReferences, usesReferences } from 'style-dictionary/utils';

const SOURCE = new URL('../tokens/tokens.json', import.meta.url);
const OUT_TOKENS = new URL('../src/styles/tokens.css', import.meta.url);
const OUT_ROLES = new URL('../src/styles/roles.css', import.meta.url);

const MODES_KEY = 'arq.modes';
const BASE_KEY = 'arq.baseValue';
const MODES = ['dark', 'mobile'];

const HEADER = `/* Generado por npm run tokens desde tokens/tokens.json. No editar a mano. */\n`;

const isToken = (node) => node && typeof node === 'object' && '$value' in node;
const isRole = (token) => token.path[0] === 'role';

// Recorre el árbol y devuelve una copia donde cada token con el modo pedido
// toma ese valor. El valor base queda guardado para comparar después.
function treeForMode(node, mode, path = []) {
  if (isToken(node)) {
    const modes = node.$extensions?.[MODES_KEY] ?? {};
    const present = MODES.filter((m) => m in modes);
    if (present.length > 1) {
      throw new Error(
        `${path.join('/')}: tiene más de un modo (${present.join(', ')}). ` +
          'Hoy los modos no se cruzan: Color es Light/Dark y Dimension/Type son Desktop/Mobile.',
      );
    }
    if (!mode || !(mode in modes)) return node;
    return {
      ...node,
      $value: modes[mode],
      $extensions: { ...node.$extensions, [BASE_KEY]: node.$value },
    };
  }
  if (node && typeof node === 'object') {
    return Object.fromEntries(
      Object.entries(node).map(([key, child]) =>
        key.startsWith('$') ? [key, child] : [key, treeForMode(child, mode, [...path, key])],
      ),
    );
  }
  return node;
}

// Un token entra a la pasada de un modo si tiene ese modo y su valor cambia.
function inMode(token) {
  const base = token.original.$extensions?.[BASE_KEY];
  return base !== undefined && JSON.stringify(base) !== JSON.stringify(token.original.$value);
}

// ── Validación ─────────────────────────────────────────────────────
// Recorre tokens.json antes de convertir y junta todo lo que no se puede
// convertir. Si hay problemas, no se escribe nada y el script sale con error.

const ROLE_PROPS = {
  fontFamily: 'font-family',
  fontWeight: 'font-weight',
  fontSize: 'font-size',
  lineHeight: 'line-height',
  letterSpacing: 'letter-spacing',
};
// fontSize y lineHeight tienen que apuntar a type/* (Semantic · Type, con modo
// Mobile) para que el rol cambie solo en mobile.
const ROLE_SEMANTIC = { fontSize: 'type', lineHeight: 'type' };
const TEXT_TRANSFORMS = ['uppercase', 'lowercase', 'capitalize', 'none'];
const KNOWN_EXTENSIONS = [MODES_KEY, 'arq.textTransform'];

const LITERAL = {
  color: (v) => typeof v === 'string' && /^#([0-9a-f]{6}|[0-9a-f]{8})$/i.test(v),
  dimension: (v) => typeof v === 'string' && /^-?\d+(\.\d+)?px$/.test(v),
  fontWeight: (v) => typeof v === 'number' && v >= 100 && v <= 900,
  fontFamily: (v) => typeof v === 'string' && v.trim() !== '',
};

function collectTokens(node, path = [], out = []) {
  if (isToken(node)) out.push({ path, token: node });
  else if (node && typeof node === 'object') {
    for (const [key, child] of Object.entries(node)) {
      if (!key.startsWith('$')) collectTokens(child, [...path, key], out);
    }
  }
  return out;
}

function validate(tree) {
  const list = collectTokens(tree);
  const byPath = new Map(list.map(({ path, token }) => [path.join('.'), token]));
  const problems = [];
  const report = (path, msg) => problems.push(`${path.join('/')}: ${msg}`);

  // Resuelve un alias hasta el valor literal (para comparar tipos).
  const resolve = (value, seen = []) => {
    const match = typeof value === 'string' && value.match(/^\{([^}]+)\}$/);
    if (!match) return { value };
    const target = byPath.get(match[1]);
    if (!target) return { error: `el alias {${match[1]}} no existe` };
    if (seen.includes(match[1])) return { error: `alias circular (${[...seen, match[1]].join(' → ')})` };
    return { ...resolve(target.$value, [...seen, match[1]]), type: target.$type, ref: match[1] };
  };

  const checkValue = (path, type, value, label) => {
    const r = resolve(value);
    if (r.error) return report(path, `${label}: ${r.error}`);
    if (r.type && r.type !== type) return report(path, `${label}: apunta a {${r.ref}} de tipo ${r.type}, se esperaba ${type}`);
    if (!LITERAL[type](r.value)) report(path, `${label}: valor ${JSON.stringify(r.value)} no es un ${type} válido`);
  };

  for (const { path, token } of list) {
    const type = token.$type;
    const ext = token.$extensions ?? {};

    for (const key of Object.keys(ext)) {
      if (!KNOWN_EXTENSIONS.includes(key)) report(path, `extensión desconocida "${key}" (se ignora)`);
    }

    if (type === 'typography') {
      if (path[0] !== 'role') report(path, 'los estilos de texto van en role/*');
      if (typeof token.$value !== 'object') {
        report(path, 'typography sin campos');
        continue;
      }
      for (const key of Object.keys(token.$value)) {
        if (!(key in ROLE_PROPS)) report(path, `campo "${key}" no soportado en role/*`);
      }
      for (const [key, raw] of Object.entries(token.$value)) {
        if (!(key in ROLE_PROPS)) continue;
        if (typeof raw !== 'string' || !usesReferences(raw)) {
          report(path, `${key}: tiene que ser un alias a una variable, no un valor suelto (${JSON.stringify(raw)})`);
          continue;
        }
        const expected = key === 'fontFamily' ? 'fontFamily' : key === 'fontWeight' ? 'fontWeight' : 'dimension';
        checkValue(path, expected, raw, key);
        const ref = raw.slice(1, -1).split('.');
        if (ROLE_SEMANTIC[key] && ref[0] !== ROLE_SEMANTIC[key]) {
          report(path, `${key}: tiene que usar una variable ${ROLE_SEMANTIC[key]}/* para que cambie en Mobile (usa {${ref.join('.')}})`);
        }
      }
      const transform = ext['arq.textTransform'];
      if (transform !== undefined && !TEXT_TRANSFORMS.includes(transform)) {
        report(path, `arq.textTransform "${transform}" no es válido (${TEXT_TRANSFORMS.join(', ')})`);
      }
      if (ext[MODES_KEY]) report(path, 'los role/* no llevan modos: el cambio a Mobile viene de type/*');
      continue;
    }

    if (!(type in LITERAL)) {
      report(path, `$type "${type}" no soportado`);
      continue;
    }
    if (ext['arq.textTransform'] !== undefined) report(path, 'arq.textTransform solo aplica a role/*');
    checkValue(path, type, token.$value, 'valor');

    const modes = ext[MODES_KEY] ?? {};
    for (const [mode, value] of Object.entries(modes)) {
      if (!MODES.includes(mode)) {
        report(path, `modo desconocido "${mode}" (se esperaba ${MODES.join(' o ')})`);
        continue;
      }
      checkValue(path, type, value, mode);
      if (JSON.stringify(value) === JSON.stringify(token.$value)) {
        report(path, `el modo ${mode} vale lo mismo que el base: no debería llevar la extensión`);
      }
    }
  }
  return { problems, count: list.length };
}

StyleDictionary.registerFormat({
  name: 'arq/roles',
  format: ({ dictionary }) => {
    const all = dictionary.unfilteredTokens ?? dictionary.tokens;
    const rules = dictionary.allTokens.map((token) => {
      const value = token.original.$value;
      const decls = Object.entries(ROLE_PROPS)
        .filter(([key]) => key in value)
        .map(([key, prop]) => {
          const [ref] = getReferences(value[key], all);
          return `  ${prop}: var(--${ref.name});`;
        });
      const transform = token.original.$extensions?.['arq.textTransform'];
      if (transform) decls.push(`  text-transform: ${transform};`);
      const name = token.path.slice(1).join('-');
      const comment = token.$description ? `/* ${token.$description} */\n` : '';
      return `${comment}.role-${name} {\n${decls.join('\n')}\n}`;
    });
    return `${HEADER}\n${rules.join('\n\n')}\n`;
  },
});

// color/css escribe los colores con transparencia como rgba() con el alpha
// exacto del hex de 8 dígitos (#1010101A → 0.10196…). Se redondea a 2
// decimales (0.1). Los colores sin transparencia siguen en hex.
StyleDictionary.registerTransform({
  name: 'arq/color/round-alpha',
  type: 'value',
  filter: (token) => token.$type === 'color',
  transform: (token) =>
    String(token.$value).replace(
      /rgba\(\s*([^,]+),\s*([^,]+),\s*([^,]+),\s*([0-9.]+)\s*\)/,
      (_, r, g, b, a) => `rgba(${r}, ${g}, ${b}, ${Number(Number(a).toFixed(2))})`,
    ),
});

function createDictionary(tokens, files) {
  return new StyleDictionary({
    tokens,
    // Las pasadas de modo filtran los primitivos a los que apuntan los alias;
    // el var() se escribe igual y el primitivo existe en :root.
    log: { warnings: 'disabled', verbosity: 'silent' },
    platforms: {
      css: {
        prefix: 'arq',
        transforms: ['name/kebab', 'color/css', 'arq/color/round-alpha', 'fontFamily/css'],
        files,
      },
    },
  });
}

async function cssVariables(mode, selector) {
  const filter = mode ? (token) => !isRole(token) && inMode(token) : (token) => !isRole(token);
  const sd = createDictionary(treeForMode(tokens, mode), [
    {
      destination: 'tokens.css',
      format: 'css/variables',
      filter,
      options: { selector, outputReferences: true, showFileHeader: false },
    },
  ]);
  const [{ output }] = await sd.formatPlatform('css');
  return output.trim();
}

const indent = (text) => text.replace(/^(?=.)/gm, '  ');

const source = JSON.parse(await readFile(SOURCE, 'utf8'));
const { problems, count } = validate(source);
if (problems.length) {
  console.error(`tokens.json: ${problems.length} problema(s), no se generó nada:\n- ${problems.join('\n- ')}`);
  process.exit(1);
}
const tokens = treeForMode(source);

const base = await cssVariables(null, ':root');
const dark = await cssVariables('dark', '[data-arq-theme="dark"]');
const mobile = await cssVariables('mobile', ':root');

const sections = [
  `/* Base: Light · Desktop */\n${base}`,
  `/* Dark: solo con el switch Iluminar (data-arq-theme="dark"), nunca por prefers-color-scheme */\n${dark}`,
  `/* Mobile: hasta 767 px */\n@media (max-width: 767px) {\n${indent(mobile)}\n}`,
];
await writeFile(OUT_TOKENS, `${HEADER}\n${sections.join('\n\n')}\n`);

const rolesSd = createDictionary(tokens, [{ destination: 'roles.css', format: 'arq/roles', filter: isRole }]);
const [{ output: roles }] = await rolesSd.formatPlatform('css');
await writeFile(OUT_ROLES, roles);

// Control de la salida: nada vacío ni mal serializado.
const broken = `${base}\n${dark}\n${mobile}\n${roles}`
  .split('\n')
  .filter((line) => /undefined|\[object|NaN|:\s*;/.test(line));
if (broken.length) {
  console.error(`Salida con valores mal convertidos:\n${broken.join('\n')}`);
  process.exit(1);
}

const countDecls = (css) => (css.match(/^\s*--arq-/gm) ?? []).length;
const roleCount = (roles.match(/^\.role-/gm) ?? []).length;
console.log(
  `${count} tokens → ${countDecls(base)} variables base, ${countDecls(dark)} dark, ` +
    `${countDecls(mobile)} mobile y ${roleCount} estilos role/*. Generados en src/styles/.`,
);
