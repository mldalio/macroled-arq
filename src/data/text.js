// Comparación de textos de búsqueda (Productos, navbar y Descargas): cada
// palabra tiene que aparecer, sin importar tildes, mayúsculas ni plural.
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

/** ¿El texto tiene todas las palabras de la búsqueda? */
export const matchesWords = (text, words) => {
  const value = normalize(text);
  return words.every((options) => options.some((option) => value.includes(option)));
};
