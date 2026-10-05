// Validación de tokens/tokens.json, compartida por npm run tokens y
// npm run tokens:import. Recorre el árbol y junta todo lo que no se puede
// convertir. Si hay problemas, ninguno de los dos scripts escribe nada.

import { usesReferences } from 'style-dictionary/utils';

export const MODES_KEY = 'arq.modes';
// dark: [data-arq-theme="dark"] · mobile: max-width 767px · tablet: 768–1023px ·
// large: min-width 1440px (Dimension) · wide: min-width 1920px (Type) · reducedMotion: prefers-reduced-motion: reduce
// (solo duraciones de motion/*).
export const MODES = ['dark', 'mobile', 'tablet', 'large', 'wide', 'reducedMotion'];
// Modos que se pueden combinar en un mismo token: los breakpoints (Dimension y Type).
export const MODE_GROUPS = [['dark'], ['mobile', 'tablet', 'large', 'wide'], ['reducedMotion']];

export const isToken = (node) => node && typeof node === 'object' && '$value' in node;

export const ROLE_PROPS = {
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
  duration: (v) => typeof v === 'string' && /^\d+(\.\d+)?ms$/.test(v),
  cubicBezier: (v) =>
    Array.isArray(v) && v.length === 4 && v.every((n) => typeof n === 'number') && v[0] >= 0 && v[0] <= 1 && v[2] >= 0 && v[2] <= 1,
};

export function collectTokens(node, path = [], out = []) {
  if (isToken(node)) out.push({ path, token: node });
  else if (node && typeof node === 'object') {
    for (const [key, child] of Object.entries(node)) {
      if (!key.startsWith('$')) collectTokens(child, [...path, key], out);
    }
  }
  return out;
}

export function validate(tree) {
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
      if (mode === 'reducedMotion' && type !== 'duration') {
        report(path, 'reducedMotion solo aplica a duraciones (motion/duration/*)');
      }
      checkValue(path, type, value, mode);
      if (JSON.stringify(value) === JSON.stringify(token.$value)) {
        report(path, `el modo ${mode} vale lo mismo que el base: no debería llevar la extensión`);
      }
    }
  }
  return { problems, count: list.length };
}
