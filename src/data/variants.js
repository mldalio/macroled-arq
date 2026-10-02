// Variantes de un grupo (decisiones.md, 2026-10-02 · Selectores de variante).
//
// Funciones puras, sin acceso a Typesense: reciben los SKU de un grupo ya
// traducidos y los campos de VARIANT_ATTRIBUTES en orden. Las usan la ficha,
// los filtros del glosario y la comparativa.
//
//   const variants = [
//     { sku: 'KANU-J-500-12W-N-WW', isDefault: true, attributes: { color_de_carcasa: 'Negro', altura: '50 cm' } },
//     …
//   ];
//   const attributes = ['color_de_carcasa', 'altura'];
//   let selection = initialSelection(variants, attributes, skuDeLaUrl);
//   variantOptions(variants, attributes, selection);
//   // → [{ attribute: 'color_de_carcasa', options: [{ value: 'Negro', selected: true, disabled: false }, …] }, …]
//   findVariant(variants, selection); // → el SKU elegido (o null)
//
// - Las opciones de cada atributo son los valores únicos de los SKU, en el
//   orden en que aparecen (el de la hoja). Las celdas vacías no son opción.
// - Una opción va deshabilitada si no forma un SKU con lo ya elegido en los
//   demás atributos. Por eso elegir una opción habilitada siempre da un SKU.

/**
 * @typedef {{ sku: string, isDefault?: boolean, attributes: Record<string, string> }} Variant
 * @typedef {Record<string, string>} Selection  campo → valor elegido
 */

const hasValue = (value) => value !== undefined && value !== null && String(value).trim() !== '';

/** Valores únicos de un atributo, en el orden de los SKU. */
export function variantValues(variants, attribute) {
  const values = [];
  for (const variant of variants) {
    const value = variant.attributes[attribute];
    if (hasValue(value) && !values.includes(value)) values.push(value);
  }
  return values;
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

/** Opciones de cada atributo con su estado (selected, disabled). */
export function variantOptions(variants, attributes, selection) {
  return attributes.map((attribute) => ({
    attribute,
    options: variantValues(variants, attribute).map((value) => ({
      value,
      selected: selection[attribute] === value,
      disabled: !variants.some(
        (variant) =>
          variant.attributes[attribute] === value &&
          attributes.every((other) => other === attribute || variant.attributes[other] === selection[other]),
      ),
    })),
  }));
}

// ── Filtros del glosario (variants-table) ─────────────────────────
// Selección parcial: un atributo sin valor ("Todos") no filtra.

const matches = (variant, filters, except) =>
  Object.entries(filters).every(([key, value]) => key === except || !hasValue(value) || variant.attributes[key] === value);

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
      selected: filters[attribute] === value,
      disabled: !variants.some((variant) => variant.attributes[attribute] === value && matches(variant, filters, attribute)),
    })),
  }));
}

/** Nueva selección al elegir `value` en `attribute`. */
export function choose(selection, attribute, value) {
  return { ...selection, [attribute]: value };
}
