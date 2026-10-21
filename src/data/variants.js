// Variantes de un grupo (decisiones.md, 2026-10-02 · Selectores de variante).
//
// Funciones puras, sin acceso a Typesense: reciben los SKU de un grupo ya
// traducidos y los campos de VARIANT_ATTRIBUTES en orden. Las usan la ficha,
// los filtros del glosario (variants-table) y la comparativa.
//
//   const variants = [
//     { sku: 'KANU-J-500-12W-N-WW', isDefault: true, attributes: { color_carcasa: 'Negro', altura: '50 cm' } },
//     …
//   ];
//   const attributes = ['color_carcasa', 'altura'];
//   let selection = initialSelection(variants, attributes, skuDeLaUrl);
//   variantOptions(variants, attributes, selection);
//   // → [{ attribute: 'color_carcasa', options: [{ value: 'Negro', selected: true, disabled: false }, …] }, …]
//   selection = choose(variants, attributes, selection, 'altura', '90 cm');
//   findVariant(variants, selection); // → el SKU elegido (o null)
//
// - Las opciones de cada atributo son los valores únicos de los SKU, ordenados
//   (números de menor a mayor). Las celdas vacías no son opción.
// - Característica madre (decisiones.md, 2026-10-21 · Característica madre):
//   el color si el grupo lo tiene; si no, la primera de VARIANT_ATTRIBUTES.
//   Va primera y sus opciones nunca se apagan. Las demás siguen el orden de
//   VARIANT_ATTRIBUTES y dependen solo de las de arriba: una opción va
//   deshabilitada si no forma un SKU con lo elegido en las anteriores. Una
//   opción deshabilitada no se puede elegir.
// - Al elegir, las de abajo se acomodan: queda el valor que tenían si existe
//   con lo nuevo; si no, el del SKU predeterminado, o el primero que exista.
//   Así la selección siempre es un SKU.

/**
 * @typedef {{ sku: string, isDefault?: boolean, attributes: Record<string, string> }} Variant
 * @typedef {Record<string, string>} Selection  campo → valor elegido
 */

import { queryWords, matchesWords } from './text.js';
import { attributeInfo } from './attributes.js';

const hasValue = (value) => value !== undefined && value !== null && String(value).trim() !== '';

/**
 * Valores únicos de un atributo, ordenados con números de menor a mayor
 * ("50 cm" antes que "90 cm") y el resto alfabético: Typesense no devuelve
 * los SKU en un orden útil.
 */
export function variantValues(variants, attribute) {
  const values = [];
  for (const variant of variants) {
    const value = variant.attributes[attribute];
    if (hasValue(value) && !values.includes(value)) values.push(value);
  }
  return values.sort((a, b) => String(a).localeCompare(String(b), 'es', { numeric: true }));
}

/** El SKU que coincide con todos los atributos de la selección, o null. */
export function findVariant(variants, selection) {
  const keys = Object.keys(selection);
  return variants.find((variant) => keys.every((key) => variant.attributes[key] === selection[key])) ?? null;
}

/**
 * Selección inicial: la del SKU pedido (por ejemplo, el de ?sku=) si es del
 * grupo; si no, la del predeterminado; si no hay, la del primer SKU.
 */
export function initialSelection(variants, attributes, sku) {
  const variant =
    variants.find((v) => sku && v.sku === sku) ?? variants.find((v) => v.isDefault) ?? variants[0];
  if (!variant) return {};
  return Object.fromEntries(attributes.map((attribute) => [attribute, variant.attributes[attribute]]));
}

/**
 * Atributos en el orden del configurador: la característica madre primero (el
 * color si lo hay; si no, la primera) y el resto en el orden de la hoja.
 */
export function configuratorOrder(attributes) {
  const lead = attributes.find((attribute) => attributeInfo(attribute).control === 'swatches') ?? attributes[0];
  return lead ? [lead, ...attributes.filter((attribute) => attribute !== lead)] : [];
}

// ¿Hay un SKU con `value` en `attribute` y lo elegido en los atributos de arriba?
const availableAfter = (variants, above, selection, attribute, value) =>
  variants.some(
    (variant) => variant.attributes[attribute] === value && above.every((other) => variant.attributes[other] === selection[other]),
  );

/** Opciones de cada atributo con su estado (selected, disabled), en el orden del configurador. */
export function variantOptions(variants, attributes, selection) {
  const ordered = configuratorOrder(attributes);
  return ordered.map((attribute, i) => ({
    attribute,
    options: variantValues(variants, attribute).map((value) => ({
      value,
      selected: selection[attribute] === value,
      disabled: !availableAfter(variants, ordered.slice(0, i), selection, attribute, value),
    })),
  }));
}

// ── Filtros del glosario (variants-table) ─────────────────────────
// Selección parcial: un atributo sin valor ("Todos") no filtra. Un atributo
// puede tener varios valores (selección múltiple de la página Descargas): el
// SKU cumple si tiene cualquiera de ellos.

const accepts = (value, wanted) => (Array.isArray(wanted) ? !wanted.length || wanted.includes(value) : !hasValue(wanted) || value === wanted);

const matches = (variant, filters, except) =>
  Object.entries(filters).every(([key, value]) => key === except || accepts(variant.attributes[key], value));

/** SKU que cumplen los filtros (selección parcial). */
export function filterVariants(variants, filters) {
  return variants.filter((variant) => matches(variant, filters));
}

/**
 * Opciones de cada filtro con su estado: una opción va deshabilitada si no hay
 * SKU con ese valor que cumpla los demás filtros elegidos.
 */
export function filterOptions(variants, attributes, filters) {
  return attributes.map((attribute) => ({
    attribute,
    options: variantValues(variants, attribute).map((value) => ({
      value,
      selected: Array.isArray(filters[attribute]) ? filters[attribute].includes(value) : filters[attribute] === value,
      disabled: !variants.some((variant) => variant.attributes[attribute] === value && matches(variant, filters, attribute)),
    })),
  }));
}

/**
 * Nueva selección al elegir `value` en `attribute` (una opción habilitada).
 * Los atributos de abajo conservan su valor si existe con lo nuevo; si no,
 * toman el del SKU predeterminado o el primero disponible.
 */
export function choose(variants, attributes, selection, attribute, value) {
  const ordered = configuratorOrder(attributes);
  const next = { ...selection, [attribute]: value };
  const fallback = variants.find((variant) => variant.isDefault)?.attributes ?? {};
  ordered.forEach((other, i) => {
    if (i <= ordered.indexOf(attribute)) return;
    const above = ordered.slice(0, i);
    const fits = (candidate) => hasValue(candidate) && availableAfter(variants, above, next, other, candidate);
    if (fits(next[other])) return;
    next[other] = fits(fallback[other]) ? fallback[other] : variantValues(variants, other).find(fits) ?? next[other];
  });
  return next;
}

// ── Buscador y orden de la página Descargas (variants-table) ──────
// decisiones.md, 2026-10-06 · Descargas.

/** SKU que coinciden con la búsqueda: en el SKU o en `search` (nombre del producto y de la colección). */
export function searchVariants(variants, query) {
  const words = queryWords(query ?? '');
  if (!words.length) return variants;
  return variants.filter((variant) => matchesWords(`${variant.sku} ${variant.search ?? ''}`, words));
}

// Órdenes del select «Ordenar por»: por SKU (decisiones.md, 2026-10-06 · Descargas).
export const SORT_ORDERS = Object.freeze([
  { value: 'sku-asc', label: 'SKU (A–Z)' },
  { value: 'sku-desc', label: 'SKU (Z–A)' },
]);

const collator = new Intl.Collator('es', { numeric: true, sensitivity: 'base' });

/** Copia ordenada por SKU (`sku-asc` · `sku-desc`). Otro valor deja el orden como está. */
export function sortVariants(variants, order) {
  if (order !== 'sku-asc' && order !== 'sku-desc') return variants;
  const sign = order === 'sku-desc' ? -1 : 1;
  return [...variants].sort((a, b) => sign * collator.compare(a.sku, b.sku));
}
