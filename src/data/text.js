// Comparación de textos de búsqueda (Productos, navbar y Descargas): cada
// palabra tiene que aparecer, sin importar tildes, mayúsculas ni plural, y se
// toleran errores de tipeo ("kani" → Kanu). decisiones.md,
// 2026-10-21 · Búsqueda con errores de tipeo.
// TODO (búsqueda): sinónimos ("jardín" → parque, patio…): falta decidir si van
// en el front o en Typesense (decisiones.md, Pendientes).

export const normalize = (text) => String(text ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

// Formas de una palabra: ella misma y su singular ("jardines" → "jardin").
function forms(word) {
  const all = [word];
  if (word.length > 3 && word.endsWith('es')) all.push(word.slice(0, -2));
  if (word.length > 3 && word.endsWith('s')) all.push(word.slice(0, -1));
  return all;
}

/** Palabras de la búsqueda: por cada una, la lista de textos que valen. */
export function queryWords(query) {
  return normalize(query).split(/\s+/).filter(Boolean).map(forms);
}

// Errores de tipeo que se aceptan según el largo de la palabra buscada:
// hasta 3 letras, ninguno ("kai" es Mini Kai, no Kanu: con 3 letras un error es
// una letra de cada tres); de 4 a 5, uno; desde 6, dos.
const typosFor = (word) => (word.length >= 6 ? 2 : word.length >= 4 ? 1 : 0);

// Distancia entre dos palabras: letras cambiadas, de más, de menos o dos
// vecinas invertidas ("kanu" / "knau"). Corta apenas pasa de max.
function distance(a, b, max) {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let before = null;
  let previous = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const current = [i];
    let best = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let value = Math.min(previous[j] + 1, current[j - 1] + 1, previous[j - 1] + cost);
      if (before && i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) value = Math.min(value, before[j - 2] + 1);
      current.push(value);
      best = Math.min(best, value);
    }
    if (best > max) return max + 1;
    before = previous;
    previous = current;
  }
  return previous[b.length];
}

// ¿word se parece al comienzo de alguna palabra del texto? Se compara con el
// comienzo de cada una (así "kani" encuentra "kanu" y también "kanu-jardin"
// mientras se escribe), de un largo parecido al de word.
function nearWord(word, tokens) {
  const max = typosFor(word);
  if (!max) return false;
  return tokens.some((token) => {
    for (let size = word.length - max; size <= word.length + max; size++) {
      if (size < 1 || size > token.length) continue;
      if (distance(word, token.slice(0, size), max) <= max) return true;
    }
    return false;
  });
}

const tokensOf = (value) => value.split(/[^a-z0-9]+/).filter(Boolean);

/**
 * ¿El texto tiene todas las palabras de la búsqueda? 'exact' si aparecen tal
 * cual, 'typo' si alguna aparece con errores de tipeo, false si no.
 * typos: false para comparar solo tal cual (los SKU).
 */
export function matchWords(text, words, { typos = true } = {}) {
  const value = normalize(text);
  let tokens = null;
  let result = 'exact';
  for (const options of words) {
    if (options.some((option) => value.includes(option))) continue;
    if (!typos) return false;
    tokens ??= tokensOf(value);
    if (!options.some((option) => nearWord(option, tokens))) return false;
    result = 'typo';
  }
  return result;
}

/** ¿El texto tiene todas las palabras de la búsqueda (tal cual o con errores de tipeo)? */
export const matchesWords = (text, words, options) => Boolean(matchWords(text, words, options));
