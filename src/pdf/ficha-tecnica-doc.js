// Ficha técnica en PDF · Figma «11 · Ficha PDF» (1907:8278): pdf-page,
// pdf-header, pdf-cover (pdf-cover-title), pdf-spec-group, pdf-spec-row · 2 col y pdf-footer. Hoja con cotas: «pdf ·
// cotas A2 · 1 hoja» (2992:45969).
//
// Arma la definición de documento de pdfmake a partir de los datos del SKU.
// No carga nada ni toca el DOM (eso es ficha-tecnica.js): se puede probar en Node.
//
//   buildDatasheet({ name, sku, sections }, { image: dataUrl | null, cota: dataUrl | null })
//
// - Hoja 1 (pdf-page Type=Primera): pdf-cover (nombre, SKU, foto y cotas) y
//   las especificaciones en dos columnas, para que entre todo
//   en una hoja; pdfmake suma hojas si no entra (Type=Siguiente).
// - Una sección que no entra en lo que queda de la hoja sigue en la próxima,
//   con su título repetido arriba; las filas no se parten (decisiones.md,
//   2026-10-27 · Ficha técnica: ajuste de impresión).
// - Encabezado y pie en todas las hojas. Encabezado: «Ficha técnica» en la
//   hoja 1; desde la 2, el nombre sobre el SKU. Pie: solo el paginado.
// - Medidas y colores de src/styles/print-tokens.js (generado por npm run
//   tokens): pdfmake no lee variables CSS. Figma mide en px a 96 dpi y el PDF
//   en puntos: 1 px = 0,75 pt.

import { PRINT_TOKENS as T, PRINT_ROLES as ROLES } from '../styles/print-tokens.js';
import { LOGO_PATHS, LOGO_VIEWBOX, LOGO_WIDTHS } from '../base/logo-paths.js';

export const TEXT = Object.freeze({
  label: 'Ficha técnica',
  brand: 'Macroled Arq',
});

const PT_PER_PX = 0.75;
export const pt = (px) => px * PT_PER_PX;

// A4 en puntos (el tamaño A4 de pdfmake); en px es el frame de Figma, 794 × 1123.
export const PAGE = Object.freeze({ width: 595.28, height: 841.89 });

// El alto de línea de pdfmake es 1,2 × el tamaño (ascender − descender de
// Albert Sans: 950 + 250 sobre 1000). Con eso se lleva el interlineado del rol
// a su multiplicador.
const FONT_BOX = 1.2;

export const page = {
  top: T['space/padding/xl'],
  side: T['space/padding/xl-2xl'],
  bottom: T['space/padding/lg'],
};
const ruled = T['border/default'];

// Color de las líneas finas (filas, encabezado, pie, pdf-cover). En pantalla
// es color/border/subtle, pero impreso (tinta al 10 %) no se ve: en papel va
// color/border/default (22 %). Las de título siguen en color/border/strong.
export const RULE = 'border/default';

/**
 * Fondo de la foto de pdf-cover. En pantalla es color/surface/subtle, pero
 * impreso (#F0F0F0, 6 % de gris) muchas impresoras no lo sacan: en papel va
 * color/surface/strong (decisión de Lau, 2026-10-27).
 */
export const PHOTO_BACKGROUND = 'surface/strong';

/** Nombre de familia en pdfmake de cada peso: AlbertSans-300, AlbertSans-400… */
export const fontName = (weight) => `${T['font/family/sans'].replace(/\s+/g, '')}-${weight}`;

/** Pesos de los roles que usa la ficha: son las fuentes que hay que cargar. */
export const FONT_WEIGHTS = Object.freeze([
  ...new Set(['label', 'heading-2', 'body-compact-medium', 'body-sm', 'body-sm-medium'].map((role) => ROLES[role].fontWeight)),
]);

// Colores con transparencia (color/border/subtle es tinta al 10 %): se
// mezclan sobre el fondo de la hoja, color/surface/default.
function solid(hex, background = T['color/surface/default']) {
  const match = hex.match(/^#([0-9a-f]{6})([0-9a-f]{2})?$/i);
  if (!match?.[2]) return hex;
  const alpha = parseInt(match[2], 16) / 255;
  const channels = (h) => [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  const bg = channels(background.replace('#', ''));
  const mixed = channels(match[1]).map((c, i) => Math.round(c * alpha + bg[i] * (1 - alpha)));
  return `#${mixed.map((c) => c.toString(16).padStart(2, '0')).join('')}`;
}
export const color = (name) => solid(T[`color/${name}`]);

/**
 * Texto con un estilo role/*. pdfmake dibuja el texto arriba de su línea y deja
 * el interlineado sobrante abajo; CSS lo reparte arriba y abajo. El margen
 * corre el texto para que quede donde lo pone Figma. above: separación en px
 * con lo anterior (un gap de Figma).
 */
export function roleText(text, role, colorName, { above = 0 } = {}) {
  const r = ROLES[role];
  const shift = pt((r.lineHeight - FONT_BOX * r.fontSize) / 2);
  return {
    text: r.textTransform === 'uppercase' ? String(text).toLocaleUpperCase('es') : String(text),
    font: fontName(r.fontWeight),
    fontSize: pt(r.fontSize),
    lineHeight: r.lineHeight / (FONT_BOX * r.fontSize),
    characterSpacing: pt(r.letterSpacing),
    color: color(colorName),
    margin: [0, pt(above) + shift, 0, -shift],
  };
}

// Bloque con una sola regla horizontal, debajo (header, pdf-cover) o arriba
// (footer) de su contenido. padding: el aire entre la regla y el
// contenido.
export function ruledBlock(content, { lineAt, lineColor, padding, widths = ['*'] }) {
  return {
    table: { widths, body: [Array.isArray(content) ? content : [content]] },
    layout: {
      hLineWidth: (i) => (i === (lineAt === 'bottom' ? 1 : 0) ? pt(ruled) : 0),
      vLineWidth: () => 0,
      hLineColor: () => lineColor,
      paddingLeft: () => 0,
      paddingRight: () => 0,
      paddingTop: () => (lineAt === 'top' ? pt(padding) : 0),
      paddingBottom: () => (lineAt === 'bottom' ? pt(padding) : 0),
    },
  };
}

function logo() {
  const width = LOGO_WIDTHS.small;
  const paths = LOGO_PATHS.map((d) => `<path d="${d}"/>`).join('');
  return {
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${LOGO_VIEWBOX.width} ${LOGO_VIEWBOX.height}" fill="${color('text/primary')}">${paths}</svg>`,
    width: pt(width),
    height: pt((width * LOGO_VIEWBOX.height) / LOGO_VIEWBOX.width),
  };
}

// Alto del encabezado y del pie: el texto (o el logo, si es más alto), el
// padding y la regla. El encabezado Type=Product (nombre sobre SKU) es más
// alto que el de la hoja 1.
const logoHeight = (LOGO_WIDTHS.small * LOGO_VIEWBOX.height) / LOGO_VIEWBOX.width;
const productLines = ROLES['body-sm-medium'].lineHeight + ROLES['body-sm'].lineHeight;
export const headerHeight = (textHeight) => Math.max(textHeight, logoHeight) + T['space/padding/sm-md'] + ruled;
export const footerHeight = ROLES.label.lineHeight + T['space/padding/sm-md'] + ruled;

// pdf-header: logo (Size=Small) a la izquierda y, a la derecha, centrado en
// alto con el logo, Type=Default (label en role/label: «Ficha técnica» en la
// hoja 1; la configuración de Daö pasa el suyo) o Type=Product (nombre en
// role/body-sm-medium sobre el SKU en role/body-sm, alineados a la derecha,
// hoja 2 en adelante).
export function header(product, label = TEXT.label) {
  const meta = product
    ? { stack: [roleText(product.name, 'body-sm-medium', 'text/primary'), roleText(product.sku, 'body-sm', 'text/tertiary')] }
    : roleText(label, 'label', 'text/tertiary');
  const textHeight = product ? productLines : ROLES.label.lineHeight;
  return ruledBlock(
    {
      columns: [
        { ...logo(), margin: [0, pt((textHeight - logoHeight) / 2), 0, 0] },
        { ...meta, width: '*', alignment: 'right' },
      ],
      columnGap: pt(T['space/gap/md']),
    },
    { lineAt: 'bottom', lineColor: color(RULE), padding: T['space/padding/sm-md'] },
  );
}

// pdf-footer: paginado role/label al borde derecho.
export function footer(current, total) {
  return ruledBlock(
    { ...roleText(`${current} / ${total}`, 'label', 'text/tertiary'), alignment: 'right' },
    { lineAt: 'top', lineColor: color(RULE), padding: T['space/padding/sm-md'] },
  );
}

/** Ancho del contenido de la hoja, en px. */
export const CONTENT_WIDTH = PAGE.width / PT_PER_PX - 2 * page.side;

// Las especificaciones van en dos columnas a space/gap/xl.
const SPEC_COLUMN = (CONTENT_WIDTH - T['space/gap/xl']) / 2;

/**
 * Lado de la foto de pdf-cover, en px (layout/pdf-cover-image): un cuadrado
 * debajo del nombre, con la foto entera adentro.
 */
export const COVER_MEDIA = T['layout/pdf-cover-image'];

// Un dibujo de cotas horizontal puede ensancharse hasta 1,5 veces la foto:
// así las medidas de los más horizontales (Mini Daö Trimless Triple) llegan a
// unos 9 pt impresos, el mínimo de lectura cómoda.
const COTA_MAX_RATIO = 1.5;

/**
 * Ancho del dibujo de cotas, en px, según su proporción (ancho / alto). Va al
 * lado de la foto, a space/gap/md, con su mismo alto: uno vertical o cuadrado
 * queda en un cuadrado igual al de la foto; uno horizontal se ensancha lo que
 * necesita, hasta COTA_MAX_RATIO veces la foto, y si es más horizontal queda
 * más bajo, centrado en el alto de la foto.
 */
export function cotaWidth(aspect) {
  return COVER_MEDIA * Math.min(Math.max(aspect, 1), COTA_MAX_RATIO);
}

/**
 * Aire entre el borde de su lugar y el dibujo de cotas, en px: el dibujo se
 * ve más chico que la foto, sin cambiar la fila (impreso quedaba grande).
 */
export const COTA_INSET = T['space/padding/lg'];

// pdf-cover: nombre (role/heading-2, 18 pt) y SKU (role/body-sm, 9 pt) a
// todo el ancho; debajo, a space/gap/md, la foto (COVER_MEDIA) y las cotas
// (cotaWidth, con COTA_INSET de aire). Sin dibujo de cotas, la foto queda sola.
function cover(data, { image, cota }) {
  const side = pt(COVER_MEDIA);
  const title = [
    roleText(data.name, 'heading-2', 'text/primary'),
    roleText(data.sku, 'body-sm', 'text/secondary', { above: T['space/gap/xs'] }),
  ];
  const media = [
    // Foto entera sobre PHOTO_BACKGROUND, ya pintado en la imagen. Sin
    // imagen, solo el fondo.
    image ? { image, width: side, height: side } : { canvas: [{ type: 'rect', x: 0, y: 0, w: side, h: side, color: color(PHOTO_BACKGROUND) }] },
    // Cotas enteras sobre el fondo de la hoja, sin recuadro, del alto de la foto.
    // cota.width es el del dibujo, sin el aire.
    ...(cota ? [{ image: cota.image, width: pt(cota.width), height: side - 2 * pt(COTA_INSET), margin: [pt(T['space/gap/md'] + COTA_INSET), pt(COTA_INSET), pt(COTA_INSET), pt(COTA_INSET)] }] : []),
  ];
  return {
    ...ruledBlock(
      {
        stack: [
          { stack: title },
          {
            columns: [...media.map((item) => ({ ...item, width: 'auto' })), { text: '', width: '*' }],
            columnGap: 0,
            margin: [0, pt(T['space/gap/md']), 0, 0],
          },
        ],
      },
      { lineAt: 'bottom', lineColor: color(RULE), padding: T['space/padding/md'] },
    ),
    unbreakable: true,
  };
}

// Una celda de pdf-spec-row con su regla inferior (RULE).
const specCell = (text, role, colorName) => ({ ...roleText(text, role, colorName), border: [false, false, false, true] });

// pdf-spec-group en dos columnas: título role/body-compact-medium (10,5 pt)
// con regla color/border/strong y, debajo, las filas de pdf-spec-row · 2 col
// (etiqueta role/body-sm de layout/pdf-spec-label-compact, valor
// role/body-sm-medium a space/gap/lg: 9 pt, el tamaño de las tablas impresas;
// padding vertical space/padding/sm) repartidas en dos columnas a
// space/gap/xl: la primera mitad a la izquierda y el resto a la derecha, para
// leer de arriba abajo. Es una sola tabla de cinco columnas (etiqueta, valor,
// separación, etiqueta, valor), así las reglas de las dos columnas quedan a la
// misma altura aunque un valor ocupe dos líneas.
export function specGroup(section, index, isLast) {
  const rowPadding = pt(T['space/padding/sm']);
  const label = T['layout/pdf-spec-label-compact'];
  const valueWidth = SPEC_COLUMN - label - T['space/gap/lg'];
  const half = Math.ceil(section.rows.length / 2);
  const left = section.rows.slice(0, half);
  const right = section.rows.slice(half);
  const pair = (row) => (row ? [specCell(row.label, 'body-sm', 'text/secondary'), specCell(row.value, 'body-sm-medium', 'text/primary')] : [{}, {}]);
  return {
    // Si la sección no entra en lo que queda de la hoja, sigue en la próxima:
    // las filas no se parten (dontBreakRows), el título se repite arriba
    // (headerRows) y nunca queda solo al pie, sin filas (keepWithHeaderRows).
    table: {
      widths: [pt(label), pt(valueWidth), pt(T['space/gap/xl']), pt(label), '*'],
      headerRows: 1,
      keepWithHeaderRows: 1,
      dontBreakRows: true,
      body: [
        [{ ...roleText(section.label, 'body-compact-medium', 'text/primary'), colSpan: 5, border: [false, false, false, true] }, {}, {}, {}, {}],
        ...left.map((row, i) => [...pair(row), {}, ...pair(right[i])]),
      ],
    },
    layout: {
      defaultBorder: false,
      hLineWidth: () => pt(ruled),
      vLineWidth: () => 0,
      hLineColor: (i) => color(i === 1 ? 'border/strong' : RULE),
      paddingLeft: (i) => (i === 1 || i === 4 ? pt(T['space/gap/lg']) : 0),
      paddingRight: () => 0,
      paddingTop: (i) => (i === 0 ? 0 : rowPadding),
      paddingBottom: () => rowPadding,
    },
    // En la hoja 1, las especificaciones arrancan a space/padding/md de pdf-cover.
    margin: [0, index === 0 ? pt(T['space/padding/md']) : 0, 0, isLast ? 0 : pt(T['space/gap/sm-md'])],
  };
}


/**
 * Definición de documento de pdfmake.
 *   data: { name, sku, sections: [{ label, rows: [{ label, value }] }] }
 *   options.image: foto de pdf-cover como data URL (JPEG o PNG), cuadrada
 *     de COVER_MEDIA y con el fondo ya pintado; null muestra solo el fondo.
 *   options.cota: { image, width }: dibujo con cotas como data URL, con fondo
 *     blanco, del alto de COVER_MEDIA y el ancho de cotaWidth; null no lo muestra.
 */
export function buildDatasheet(data, { image = null, cota = null } = {}) {
  // Desde la hoja 2 el cuerpo arranca a space/padding/xl del encabezado
  // (Type=Product). En la 1, pdf-cover va debajo del encabezado Type=Default,
  // más bajo, con su propio padding (space/padding/md): sube desde el margen
  // de la hoja, que pdfmake no deja cambiar por hoja.
  const specBody = page.top + headerHeight(productLines) + T['space/padding/xl'];
  const coverShift = page.top + headerHeight(ROLES.label.lineHeight) + T['space/padding/md'] - specBody;
  const sections = data.sections ?? [];

  return {
    pageSize: 'A4',
    pageMargins: [pt(page.side), pt(specBody), pt(page.side), pt(footerHeight + page.bottom)],
    info: { title: `${TEXT.label} · ${data.name} · ${data.sku}`, author: TEXT.brand },
    header: (current) => ({
      ...header(current === 1 ? null : data),
      margin: [pt(page.side), pt(page.top), pt(page.side), 0],
    }),
    footer: (current, total) => ({
      ...footer(current, total),
      margin: [pt(page.side), 0, pt(page.side), 0],
    }),
    defaultStyle: { font: fontName(ROLES.body.fontWeight) },
    content: [
      { ...cover(data, { image, cota }), margin: [0, pt(coverShift), 0, 0] },
      ...sections.map((section, i) => specGroup(section, i, i === sections.length - 1)),
    ],
  };
}
