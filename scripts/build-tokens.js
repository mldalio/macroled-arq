// npm run tokens
// Lee tokens/tokens.json (formato DTCG) y genera con Style Dictionary:
//   src/styles/tokens.css  → variables --arq-*
//     :root                             valores base (Light · Desktop)
//     [data-arq-theme="dark"]           modo dark (solo los tokens que lo tienen)
//     @media (max-width: 767px) :root   modo mobile (solo los que cambian)
//     @media (prefers-reduced-motion: reduce) :root   duraciones de motion/* en 0
//   src/styles/dark.css    → el mismo bloque [data-arq-theme="dark"], para adoptarlo
//     en cada Shadow DOM (src/styles/roles.js): así el atributo también funciona
//     en un contenedor interno de un componente (Dark local)
//   src/styles/roles.css   → estilos de texto role/* como clases .role-<nombre>
//     (no son variables: los componentes los adoptan con src/styles/roles.js)
// Nunca se usa prefers-color-scheme: dark solo se activa con data-arq-theme.

import { readFile, writeFile } from 'node:fs/promises';
import StyleDictionary from 'style-dictionary';
import { getReferences } from 'style-dictionary/utils';
import { MODES, MODES_KEY, ROLE_PROPS, isToken, validate } from './lib/validate-tokens.js';

const SOURCE = new URL('../tokens/tokens.json', import.meta.url);
const OUT_TOKENS = new URL('../src/styles/tokens.css', import.meta.url);
const OUT_DARK = new URL('../src/styles/dark.css', import.meta.url);
const OUT_ROLES = new URL('../src/styles/roles.css', import.meta.url);

const BASE_KEY = 'arq.baseValue';

const HEADER = `/* Generado por npm run tokens desde tokens/tokens.json. No editar a mano. */\n`;

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
          'Hoy los modos no se cruzan: Color es Light/Dark, Dimension/Type son Desktop/Mobile y Motion tiene reducedMotion.',
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
        transforms: ['name/kebab', 'color/css', 'arq/color/round-alpha', 'fontFamily/css', 'cubicBezier/css'],
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
  // Un modo sin tokens (por ejemplo reducedMotion sin motion/*) no genera salida.
  return (output ?? '').trim();
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
const reducedMotion = await cssVariables('reducedMotion', ':root');

const sections = [
  `/* Base: Light · Desktop */\n${base}`,
  `/* Dark: con data-arq-theme="dark" (Iluminar o Dark local), nunca por prefers-color-scheme */\n${dark}`,
  `/* Mobile: hasta 767 px */\n@media (max-width: 767px) {\n${indent(mobile)}\n}`,
];
if (reducedMotion) {
  sections.push(
    `/* Movimiento reducido: fast, base y slow en 0 (feedback no cambia) */\n` +
      `@media (prefers-reduced-motion: reduce) {\n${indent(reducedMotion)}\n}`,
  );
}
await writeFile(OUT_TOKENS, `${HEADER}\n${sections.join('\n\n')}\n`);

// Bloque Dark para los Shadow DOM: tokens.css (documento) no alcanza un
// [data-arq-theme] que está dentro de un componente.
await writeFile(
  OUT_DARK,
  `${HEADER}/* Lo adopta cada Shadow DOM (src/styles/roles.js): Dark local en un contenedor interno. */\n${dark}\n`,
);

const rolesSd = createDictionary(tokens, [{ destination: 'roles.css', format: 'arq/roles', filter: isRole }]);
const [{ output: roles }] = await rolesSd.formatPlatform('css');
await writeFile(OUT_ROLES, roles);

// Control de la salida: nada vacío ni mal serializado.
const broken = `${base}\n${dark}\n${mobile}\n${reducedMotion}\n${roles}`
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
    `${countDecls(mobile)} mobile, ${countDecls(reducedMotion)} reduced-motion y ${roleCount} estilos role/*. ` +
    'Generados en src/styles/.',
);
