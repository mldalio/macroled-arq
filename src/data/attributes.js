// Etiquetas visibles y control de cada atributo técnico (decisiones.md,
// 2026-10-02 · Nombres de campo y Selectores de variante). Único lugar donde
// un campo de Typesense se convierte en texto de interfaz.
//
// control: 'swatches' (acabado: option-group Type=Swatches) o 'tiles' (el resto).
//
// TODO (schema): faltan las columnas técnicas de la hoja (docs/typesense-schema.md,
// Características técnicas). Por ahora solo los atributos de variante de Kanu
// del documento de estructura. Etiquetas tomadas de la Ficha de Final (1218:10565).

export const ATTRIBUTES = Object.freeze({
  color_de_carcasa: Object.freeze({ label: 'Color', control: 'swatches' }),
  altura: Object.freeze({ label: 'Altura', control: 'tiles' }),
});

/** Etiqueta y control de un campo. Un campo sin entrada usa su nombre y tiles. */
export function attributeInfo(field) {
  return ATTRIBUTES[field] ?? { label: field, control: 'tiles' };
}
