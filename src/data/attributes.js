// Etiquetas visibles y uso de cada campo técnico (decisiones.md, 2026-10-02 ·
// Nombres de campo y Selectores de variante). Único lugar donde un campo de
// Typesense se convierte en texto de interfaz.
//
// - label: texto visible (spec-row, compare-row, filtros, selectores).
// - section: sección del acordeón de la ficha y grupo de la comparativa (SECTIONS).
// - filter: es filtro en los listados (filter-panel). Solo los campos facet del
//   índice real pueden filtrar en Typesense (docs/typesense-schema.md).
// - control: selector de variante: 'swatches' (acabado) o 'tiles' (el resto).
// - column: nombre anterior de la columna en la hoja. variant_attributes ahora
//   trae nombres de campo; column queda sin uso desde que no hay catálogo mixto.
//
// El orden de las claves es el orden en que se muestran.
// TODO (diseño): confirmar las secciones y qué campos van en cada una. Las
// secciones salen de la Ficha y la Comparativa de Final; el reparto de los
// campos es una propuesta.

export const SECTIONS = Object.freeze([
  { id: 'luminicas', label: 'Características lumínicas' },
  { id: 'electricas', label: 'Características eléctricas' },
  // Materiales, dimensiones, instalación y protección en una sola sección (2026-10-21)
  { id: 'materiales', label: 'Materiales e instalación' },
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
  // Materiales e instalación
  color_carcasa: a('Color', 'materiales', { control: 'swatches', column: 'Color de carcasa' }),
  altura: a('Altura', 'materiales', { column: 'Altura' }),
  tamanio: a('Medidas', 'materiales'),
  material_cuerpo: a('Material del cuerpo', 'materiales'),
  material_lente: a('Material de la lente', 'materiales'),
  largo_cable: a('Largo de cable', 'materiales'),
  peso: a('Peso', 'materiales'),
  proteccion_ip: a('Grado de protección', 'materiales'),
  proteccion_ik: a('Resistencia al impacto', 'materiales'),
  tipo_montaje: a('Montaje', 'materiales'),
  temperatura_operacion: a('Temperatura de operación', 'materiales'),
  // Comercial
  garantia_proveedor: a('Garantía', 'comercial'),
});

// Columnas de variants-table, en orden, con la etiqueta corta del encabezado
// (en la ficha y en Descargas: es la misma tabla, decisiones.md, 2026-10-20 ·
// Una sola variants-table). Solo se muestran las que algún SKU tiene cargadas.
// «Acabado» es el color de la carcasa y «Regulación», dimeable: los valores se
// muestran como llegan, salvo el tamaño, que se pasa a mm (tableValues).
// wide: valor largo; la tabla le deja su ancho en lugar del común a las demás.
export const TABLE_COLUMNS = Object.freeze([
  { field: 'color_carcasa', label: 'Acabado' },
  { field: 'tamanio', label: 'Tamaño', wide: true },
  { field: 'potencia', label: 'Potencia' },
  { field: 'temperatura_color', label: 'Temp.' },
  { field: 'cri', label: 'CRI' },
  { field: 'flujo_luminoso', label: 'Flujo lum.' },
  { field: 'angulo_apertura', label: 'Ángulo' },
  { field: 'lumenes_lmw', label: 'Eficiencia' },
  { field: 'proteccion_ip', label: 'IP' },
  { field: 'dimeable', label: 'Regulación' },
]);

// «cm» y «mm» como unidad, también pegada al número («9,5cm»), pero no dentro de una palabra
const CM = /(?<![a-zñ])cm(?![a-zñ])/gi;
const MM = /(?<![a-zñ])mm(?![a-zñ])/i;

/**
 * Tamaño en milímetros. La base lo trae en centímetros («Ø 12 x 5 cm»): se
 * multiplica cada número por 10 y la unidad pasa a mm («Ø 120 x 50 mm»). Sin
 * unidad se toma como cm (así viene de la hoja). Si ya está en mm, queda igual.
 * Un valor sin números se devuelve como llega.
 */
export function toMillimeters(value) {
  const text = String(value ?? '').trim();
  if (!/\d/.test(text) || MM.test(text)) return text;
  const converted = text.replace(/\d+(?:[.,]\d+)?/g, (number) => {
    const mm = Number((parseFloat(number.replace(',', '.')) * 10).toFixed(1));
    return number.includes(',') ? String(mm).replace('.', ',') : String(mm);
  });
  const withUnit = converted.replace(CM, 'mm');
  return withUnit !== converted ? withUnit : `${converted} mm`;
}

/** Valores de las columnas de la tabla de un SKU (campo → texto): el tamaño en mm. */
export function tableValues(values) {
  return hasValue(values.tamanio) ? { ...values, tamanio: toMillimeters(values.tamanio) } : values;
}

// Filtros de la página Descargas, en orden, con su nombre, para el panel de filtros (decisiones.md, 2026-10-15 · Descargas · propuesta final).
// El orden y «Acabado» siguen a la propuesta (2571:22278). Fuera, por tener casi
// un valor por SKU: Tamaño, Flujo luminoso y Eficiencia (siguen como columnas,
// TABLE_COLUMNS), Altura y Peso.
// TODO (diseño): Familia y Fotometría de la propuesta no tienen campo en la base.
export const DOWNLOAD_FILTERS = Object.freeze([
  { field: 'tipo_montaje', label: 'Montaje' },
  { field: 'color_carcasa', label: 'Acabado' },
  { field: 'potencia', label: 'Potencia' },
  { field: 'temperatura_color', label: 'Temperatura de color' },
  { field: 'proteccion_ip', label: 'IP' },
  { field: 'dimeable', label: 'Regulación' },
  { field: 'cri', label: 'CRI' },
  { field: 'angulo_apertura', label: 'Ángulo' },
  { field: 'tipo_led', label: 'Fuente' },
  { field: 'material_cuerpo', label: 'Material del cuerpo' },
  { field: 'tension_proveedor', label: 'Tensión de entrada' },
]);

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
 * Campos de los selectores de variante a partir de variant_attributes, con
 * nombres de campo («color_carcasa, altura» → ['color_carcasa', 'altura']).
 * También acepta el nombre de columna anterior («Color de carcasa»), que usa el
 * catálogo de ejemplo. Un campo sin entrada en ATTRIBUTES se omite y avisa en consola.
 */
export function variantFields(variantAttributes) {
  const names = Array.isArray(variantAttributes) ? variantAttributes : String(variantAttributes ?? '').split(',');
  return names
    .map((name) => name.trim())
    .filter(Boolean)
    .map((name) => {
      const field = ATTRIBUTES[name] ? name : Object.keys(ATTRIBUTES).find((key) => ATTRIBUTES[key].column === name);
      if (!field) console.warn(`[arq] variant_attributes: el campo «${name}» no está en src/data/attributes.js`);
      return field;
    })
    .filter(Boolean);
}
