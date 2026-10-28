// Orden de los recomendados del buscador (search-sheet con el campo vacío).
// Qué entra lo decide la columna «new» de la base; acá solo se decide el orden.
// Cada nombre abarca al producto que se llama así y a sus variantes («Mini Kai»
// incluye «Mini Kai Aplicar»), sin tildes ni mayúsculas. Los marcados con «new»
// que no estén en la lista van después, en el orden de la base.
import { normalize } from './text.js';

export const RECOMMENDED_ORDER = ['Hoshi', 'Fuji', 'Douli', 'Daö', 'Mini Kai', 'Sento', 'Nobu'];

const ORDER = RECOMMENDED_ORDER.map(normalize);

/** Posición de un producto en la lista (por su nombre); los que no están, al final. */
export function recommendedRank(name) {
  const key = normalize(name).trim();
  const index = ORDER.findIndex((entry) => key === entry || key.startsWith(`${entry} `));
  return index === -1 ? ORDER.length : index;
}
