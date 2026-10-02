// Etiquetas visibles y control de cada atributo técnico (decisiones.md,
// 2026-10-02 · Nombres de campo y Selectores de variante). Único lugar donde
// un campo de Typesense se convierte en texto de interfaz.
//
// control: 'swatches' (acabado: option-group Type=Swatches) o 'tiles' (el resto).
//
// TODO (schema): faltan las columnas técnicas de la hoja (docs/typesense-schema.md,
// Características técnicas). Por ahora solo los atributos de variante de Kanu
// del documento de estructura. Etiquetas tomadas de la Ficha de Final (1218:10565).

// column: nombre de la columna en la hoja, como llega en variant_attributes
// («Color de carcasa, Altura»). Los nombres de campo son los del índice real.
export const ATTRIBUTES = Object.freeze({
  color_carcasa: Object.freeze({ label: 'Color', control: 'swatches', column: 'Color de carcasa' }),
  altura: Object.freeze({ label: 'Altura', control: 'tiles', column: 'Altura' }),
});

/** Etiqueta y control de un campo. Un campo sin entrada usa su nombre y tiles. */
export function attributeInfo(field) {
  return ATTRIBUTES[field] ?? { label: field, control: 'tiles' };
}

/**
 * Campos de los selectores de variante a partir de variant_attributes
 * («Color de carcasa, Altura» → ['color_carcasa', 'altura']). Una columna sin
 * entrada en ATTRIBUTES se omite y avisa en consola.
 */
export function variantFields(variantAttributes) {
  const columns = Array.isArray(variantAttributes) ? variantAttributes : String(variantAttributes ?? '').split(',');
  return columns
    .map((column) => column.trim())
    .filter(Boolean)
    .map((column) => {
      const field = Object.keys(ATTRIBUTES).find((key) => ATTRIBUTES[key].column === column);
      if (!field) console.warn(`[arq] variant_attributes: la columna «${column}» no está en src/data/attributes.js`);
      return field;
    })
    .filter(Boolean);
}
