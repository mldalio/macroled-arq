// npm run tokens
// Lee tokens/tokens.json (formato DTCG) y genera con Style Dictionary:
//   src/styles/tokens.css  → variables --arq-*
//     :root                             valores base (Light · Desktop)
//     [data-arq-theme="dark"]           modo dark (solo los tokens que lo tienen)
//     [data-arq-theme="light"]          Light local: los mismos tokens con su valor Light,
//                                       para un bloque que queda en Light dentro de Dark
//     @media (max-width: 767px) :root   modo mobile (solo los que cambian)
//     @media (768px–1023px) :root       modo tablet (solo los que cambian)
//     @media (min-width: 1440px) :root  modo large (solo los que cambian)
//     @media (min-width: 1920px) :root  modo wide (solo los que cambian)
//     @media (prefers-reduced-motion: reduce) :root   duraciones de motion/* en 0
//   src/styles/dark.css    → el mismo bloque [data-arq-theme="dark"], para adoptarlo
//     en cada Shadow DOM (src/styles/roles.js): así el atributo también funciona
//     en un contenedor interno de un componente (Dark local)
//   src/styles/light.css   → el bloque [data-arq-theme="light"], adoptado igual
//     (Light local: filter-panel queda en Light con Iluminar)
//   src/styles/roles.css   → estilos de texto role/* como clases .role-<nombre>
//     (no son variables: los componentes los adoptan con src/styles/roles.js)
//   src/styles/print-tokens.js → valores resueltos (px y hex) de los semánticos
//     y los role/*, para la ficha técnica en PDF (src/pdf/): pdfmake no lee
//     variables CSS. Color en Light, Dimension en Desktop y Type en Mobile,
//     como los frames ficha_pdf de Figma («Escala Type en modo Mobile»)
// Nunca se usa prefers-color-scheme: dark solo se activa con data-arq-theme.

import { readFile, writeFile } from 'node:fs/promises';
import StyleDictionary from 'style-dictionary';
import { getReferences } from 'style-dictionary/utils';
import { MODES, MODE_GROUPS, MODES_KEY, ROLE_PROPS, collectTokens, isToken, validate } from './lib/validate-tokens.js';

const SOURCE = new URL('../tokens/tokens.json', import.meta.url);
const OUT_TOKENS = new URL('../src/styles/tokens.css', import.meta.url);
const OUT_DARK = new URL('../src/styles/dark.css', import.meta.url);
const OUT_LIGHT = new URL('../src/styles/light.css', import.meta.url);
const OUT_ROLES = new URL('../src/styles/roles.css', import.meta.url);
const OUT_PRINT = new URL('../src/styles/print-tokens.js', import.meta.url);

const BASE_KEY = 'arq.baseValue';

const HEADER = `/* Generado por npm run tokens desde tokens/tokens.json. No editar a mano. */\n`;

const isRole = (token) => token.path[0] === 'role';

// Recorre el árbol y devuelve una copia donde cada token con el modo pedido
// toma ese valor. El valor base queda guardado para comparar después.
function treeForMode(node, mode, path = []) {
  if (isToken(node)) {
    const modes = node.$extensions?.[MODES_KEY] ?? {};
    const present = MODES.filter((m) => m in modes);
    if (MODE_GROUPS.filter((group) => group.some((m) => present.includes(m))).length > 1) {
      throw new Error(
        `${path.join('/')}: cruza modos de colecciones distintas (${present.join(', ')}). ` +
          'Color es Light/Dark, Dimension es Desktop/Mobile/Tablet/Large, Type es Desktop/Mobile/Wide y Motion tiene reducedMotion.',
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

// En rem (base 16px, la del html de Webflow), para que respeten el tamaño de
// fuente del usuario/SO:
// - font/size/*, font/leading/* y font/tracking/*: el texto.
// - space/*: el espaciado. Los semánticos que apuntan a space (space/gap,
//   padding y section, layout/gutter, icon/*, swatch/*) lo siguen por alias.
// Siguen en px border/* (hairlines de 1 y 2 px), radius/*, blur/* y los
// layout/* con valor propio (anchos de tarjeta, miniaturas, max-width): son
// geometría fija. Las media queries también van en px.
const REM_BASE_PX = 16;
const isRemToken = (path) =>
  path[0] === 'space' || (path[0] === 'font' && ['size', 'leading', 'tracking'].includes(path[1]));
StyleDictionary.registerTransform({
  name: 'arq/rem',
  type: 'value',
  filter: (token) => token.$type === 'dimension' && isRemToken(token.path) && /^-?[\d.]+px$/.test(token.$value),
  transform: (token) => `${Number((parseFloat(token.$value) / REM_BASE_PX).toFixed(4))}rem`,
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
        transforms: [
          'name/kebab',
          'color/css',
          'arq/color/round-alpha',
          'fontFamily/css',
          'cubicBezier/css',
          'arq/rem',
        ],
        files,
      },
    },
  });
}

// Un token tiene modo Dark si su valor Dark cambia respecto del base.
const hasDark = (token) => {
  const dark = token.original.$extensions?.[MODES_KEY]?.dark;
  return dark !== undefined && JSON.stringify(dark) !== JSON.stringify(token.original.$value);
};

// only: filtro extra para la pasada base (el bloque Light local).
async function cssVariables(mode, selector, only = () => true) {
  const filter = mode ? (token) => !isRole(token) && inMode(token) : (token) => !isRole(token) && only(token);
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
const light = await cssVariables(null, '[data-arq-theme="light"]', hasDark);
const mobile = await cssVariables('mobile', ':root');
const tablet = await cssVariables('tablet', ':root');
const large = await cssVariables('large', ':root');
const wide = await cssVariables('wide', ':root');
const reducedMotion = await cssVariables('reducedMotion', ':root');

// Los rangos de cada colección no se pisan; Large (Dimension) y Wide (Type)
// se superponen pero tocan tokens distintos, así que el orden no importa.
const sections = [
  `/* Base: Light · Desktop (1024–1439 px) */\n${base}`,
  `/* Dark: con data-arq-theme="dark" (Iluminar o Dark local), nunca por prefers-color-scheme */\n${dark}`,
  `/* Light local: con data-arq-theme="light", un bloque que queda en Light dentro de Dark (filter-panel) */\n${light}`,
  `/* Mobile: hasta 767 px */\n@media (max-width: 767px) {\n${indent(mobile)}\n}`,
];
if (tablet) sections.push(`/* Tablet: 768–1023 px */\n@media (min-width: 768px) and (max-width: 1023px) {\n${indent(tablet)}\n}`);
if (large) sections.push(`/* Large: desde 1440 px (Dimension) */\n@media (min-width: 1440px) {\n${indent(large)}\n}`);
if (wide) sections.push(`/* Wide: desde 1920 px (Type) */\n@media (min-width: 1920px) {\n${indent(wide)}\n}`);
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

// Bloque Light local para los Shadow DOM, por el mismo motivo.
await writeFile(
  OUT_LIGHT,
  `${HEADER}/* Lo adopta cada Shadow DOM (src/styles/roles.js): Light local en un contenedor interno. */\n${light}\n`,
);

const rolesSd = createDictionary(tokens, [{ destination: 'roles.css', format: 'arq/roles', filter: isRole }]);
const [{ output: roles }] = await rolesSd.formatPlatform('css');
await writeFile(OUT_ROLES, roles);

// Valores para impresión (ficha técnica en PDF). Solo Semantic y role/*: los
// primitivos (space/16, neutral/900, font/size/40…) no se exportan. Las
// dimensiones salen en px como número; los colores, en hex como en Figma.
const PRINT_MODE = { type: 'mobile' };
const isPrintToken = ([group, sub]) =>
  ['color', 'layout', 'type', 'role'].includes(group) ||
  (group === 'space' && ['gap', 'padding', 'section'].includes(sub)) ||
  (group === 'border' && !/^\d+$/.test(sub)) ||
  (group === 'font' && sub === 'family');
const printList = collectTokens(source);
const printByPath = new Map(printList.map(({ path, token }) => [path.join('.'), { path, token }]));
const printValue = ({ path, token }) => {
  const mode = PRINT_MODE[path[0]];
  const value = token.$extensions?.[MODES_KEY]?.[mode] ?? token.$value;
  return resolvePrint(value);
};
const resolvePrint = (value) => {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return Object.fromEntries(Object.entries(value).map(([key, v]) => [key, resolvePrint(v)]));
  }
  const alias = typeof value === 'string' && value.match(/^\{([^}]+)\}$/);
  if (alias) return printValue(printByPath.get(alias[1]));
  if (typeof value === 'string' && /^-?[\d.]+px$/.test(value)) return parseFloat(value);
  return value;
};
const printTokens = {};
const printRoles = {};
for (const entry of printList) {
  if (!isPrintToken(entry.path)) continue;
  if (entry.path[0] === 'role') {
    const transform = entry.token.$extensions?.['arq.textTransform'];
    printRoles[entry.path.slice(1).join('-')] = { ...printValue(entry), ...(transform ? { textTransform: transform } : {}) };
  } else {
    printTokens[entry.path.join('/')] = printValue(entry);
  }
}
const print =
  `// Generado por npm run tokens desde tokens/tokens.json. No editar a mano.\n` +
  `// Valores resueltos para la ficha técnica en PDF (src/pdf/): Color Light,\n` +
  `// Dimension Desktop y Type Mobile. Dimensiones en px (número).\n\n` +
  `export const PRINT_TOKENS = Object.freeze(${JSON.stringify(printTokens, null, 2)});\n\n` +
  `export const PRINT_ROLES = Object.freeze(${JSON.stringify(printRoles, null, 2)});\n`;
await writeFile(OUT_PRINT, print);

// Control de la salida: nada vacío ni mal serializado.
const broken = `${base}\n${dark}\n${light}\n${mobile}\n${tablet}\n${large}\n${wide}\n${reducedMotion}\n${roles}\n${print}`
  .split('\n')
  .filter((line) => /undefined|\[object|NaN|:\s*;/.test(line));
if (broken.length) {
  console.error(`Salida con valores mal convertidos:\n${broken.join('\n')}`);
  process.exit(1);
}

const countDecls = (css) => (css.match(/^\s*--arq-/gm) ?? []).length;
const roleCount = (roles.match(/^\.role-/gm) ?? []).length;
console.log(
  `${count} tokens → ${countDecls(base)} variables base, ${countDecls(dark)} dark, ${countDecls(light)} light local, ` +
    `${countDecls(mobile)} mobile, ${countDecls(tablet)} tablet, ${countDecls(large)} large, ${countDecls(wide)} wide, ${countDecls(reducedMotion)} reduced-motion y ${roleCount} estilos role/*. ` +
    'Generados en src/styles/.',
);
