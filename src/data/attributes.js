// Etiquetas visibles y uso de cada campo técnico (decisiones.md, 2026-10-02 ·
// Nombres de campo y Selectores de variante). Único lugar donde un campo de
// Typesense se convierte en texto de interfaz.
//
// - label: texto visible (spec-row, compare-row, filtros, selectores).
// - section: sección del acordeón de la ficha y grupo de la comparativa (SECTIONS).
// - filter: es filtro en los listados (filter-panel). Solo los campos facet del
//   índice real pueden filtrar en Typesense (docs/typesense-schema.md).
// - control: selector de variante: 'swatches' (acabado) o 'tiles' (el resto).
// - column: nombre de la columna en la hoja, como llega en variant_attributes.
//
// El orden de las claves es el orden en que se muestran.
// TODO (diseño): confirmar las secciones y qué campos van en cada una. Las
// secciones salen de la Ficha y la Comparativa de Final; el reparto de los
// campos es una propuesta.

export const SECTIONS = Object.freeze([
  { id: 'luminicas', label: 'Características lumínicas' },
  { id: 'electricas', label: 'Características eléctricas' },
  { id: 'materiales', label: 'Materiales y dimensiones' },
  { id: 'instalacion', label: 'Instalación y protección' },
  { id: 'comercial', label: 'Información comercial' },
]);

const a = (label, section, extra = {}) => Object.freeze({ label, section, control: 'tiles', ...extra });

export const ATTRIBUTES = Object.freeze({
  // Lumínicas
  potencia: a('Potencia', 'luminicas', { filter: true }),
  flujo_luminoso: a('Flujo luminoso', 'luminicas'),
  lumenes_lmw: a('Eficiencia luminosa', 'luminicas'),
  temperatura_color: a('Temperatura de color', 'luminicas', { filter: true }),
  cri: a('CRI', 'luminicas'),
  angulo_apertura: a('Ángulo de apertura', 'luminicas'),
  ugr: a('UGR', 'luminicas'),
  sdcm: a('SDCM', 'luminicas'),
  tipo_led: a('Tipo de LED', 'luminicas'),
  vida_util: a('Vida útil', 'luminicas'),
  // Eléctricas
  tension_proveedor: a('Tensión de entrada', 'electricas'),
  factor_potencia: a('Factor de potencia', 'electricas'),
  thd: a('THD', 'electricas'),
  dimeable: a('Dimerizable', 'electricas'),
  tipo_driver: a('Driver', 'electricas'),
  emc: a('EMC', 'electricas'),
  // Materiales y dimensiones
  color_carcasa: a('Color', 'materiales', { control: 'swatches', column: 'Color de carcasa' }),
  altura: a('Altura', 'materiales', { column: 'Altura' }),
  tamanio: a('Medidas', 'materiales'),
  material_cuerpo: a('Material del cuerpo', 'materiales'),
  material_lente: a('Material de la lente', 'materiales'),
  largo_cable: a('Largo de cable', 'materiales'),
  peso: a('Peso', 'materiales'),
  // Instalación y protección
  proteccion_ip: a('Grado de protección', 'instalacion'),
  proteccion_ik: a('Resistencia al impacto', 'instalacion'),
  tipo_montaje: a('Montaje', 'instalacion'),
  temperatura_operacion: a('Temperatura de operación', 'instalacion'),
  // Comercial
  garantia_proveedor: a('Garantía', 'comercial'),
});

/** Etiqueta y control de un campo. Un campo sin entrada usa su nombre y tiles. */
export function attributeInfo(field) {
  return ATTRIBUTES[field] ?? { label: field, control: 'tiles' };
}

/** Campos que son filtro en los listados, en orden. */
export const FILTER_FIELDS = Object.freeze(Object.keys(ATTRIBUTES).filter((field) => ATTRIBUTES[field].filter));

/**
 * Secciones con sus filas para un conjunto de valores (campo → valor). Una
 * fila sin valor no se muestra y una sección sin filas tampoco.
 *   specSections({ potencia: '12W' }) → [{ id, label, rows: [{ field, label, value }] }]
 */
export function specSections(values) {
  return SECTIONS.map((section) => ({
    ...section,
    rows: Object.entries(ATTRIBUTES)
      .filter(([field, info]) => info.section === section.id && hasValue(values[field]))
      .map(([field, info]) => ({ field, label: info.label, value: values[field] })),
  })).filter((section) => section.rows.length);
}

const hasValue = (value) => value !== undefined && value !== null && String(value).trim() !== '' && value !== '-';

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
