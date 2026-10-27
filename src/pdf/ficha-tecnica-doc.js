// Ficha técnica en PDF · Figma «11 · Ficha PDF» (1907:8278): pdf-page,
// pdf-header, pdf-cover (pdf-cover-title + pdf-key-data / pdf-key-item),
// pdf-spec-group, pdf-spec-row · 2 col y pdf-footer. Hoja con cotas: «pdf ·
// cotas A2 · 1 hoja» (2992:45969).
//
// Arma la definición de documento de pdfmake a partir de los datos del SKU.
// No carga nada ni toca el DOM (eso es ficha-tecnica.js): se puede probar en Node.
//
//   buildDatasheet({ name, sku, keyData, sections }, { image: dataUrl | null, cota: dataUrl | null })
//
// - Hoja 1 (pdf-page Type=Primera): pdf-cover (foto, cotas, nombre, SKU y
//   datos clave) y las especificaciones en dos columnas, para que entre todo
//   en una hoja; pdfmake suma hojas si no entra (Type=Siguiente).
// - Una sección no se parte entre hojas: si no entra, pasa entera a la
//   siguiente. Solo una sección más alta que una hoja se corta, y repite su
//   título arriba (decisiones.md, 2026-10-06 · Ficha técnica en PDF).
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
const pt = (px) => px * PT_PER_PX;

// A4 en puntos (el tamaño A4 de pdfmake); en px es el frame de Figma, 794 × 1123.
export const PAGE = Object.freeze({ width: 595.28, height: 841.89 });

// El alto de línea de pdfmake es 1,2 × el tamaño (ascender − descender de
// Albert Sans: 950 + 250 sobre 1000). Con eso se lleva el interlineado del rol
// a su multiplicador.
const FONT_BOX = 1.2;

const page = {
  top: T['space/padding/xl-2xl'],
  side: T['space/padding/2xl'],
  bottom: T['space/padding/xl'],
};
const ruled = T['border/default'];

/** Nombre de familia en pdfmake de cada peso: AlbertSans-300, AlbertSans-400… */
export const fontName = (weight) => `${T['font/family/sans'].replace(/\s+/g, '')}-${weight}`;

/** Pesos de los roles que usa la ficha: son las fuentes que hay que cargar. */
export const FONT_WEIGHTS = Object.freeze([
  ...new Set(['label', 'heading-1', 'body-compact', 'body-compact-regular', 'body-lg-regular', 'heading-3-light', 'body-sm', 'body-sm-medium'].map((role) => ROLES[role].fontWeight)),
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
const color = (name) => solid(T[`color/${name}`]);

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
// (footer, pdf-key-data) de su contenido. padding: el aire entre la regla y el
// contenido.
function ruledBlock(content, { lineAt, lineColor, padding, widths = ['*'] }) {
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
const headerHeight = (textHeight) => Math.max(textHeight, logoHeight) + T['space/padding/md'] + ruled;
const footerHeight = ROLES.label.lineHeight + T['space/padding/md'] + ruled;

// pdf-header: logo (Size=Small) a la izquierda y, a la derecha, centrado en
// alto con el logo, Type=Default («Ficha técnica» en role/label, hoja 1) o
// Type=Product (nombre en role/body-sm-medium sobre el SKU en role/body-sm,
// alineados a la derecha, hoja 2 en adelante).
function header(product) {
  const meta = product
    ? { stack: [roleText(product.name, 'body-sm-medium', 'text/primary'), roleText(product.sku, 'body-sm', 'text/tertiary')] }
    : roleText(TEXT.label, 'label', 'text/tertiary');
  const textHeight = product ? productLines : ROLES.label.lineHeight;
  return ruledBlock(
    {
      columns: [
        { ...logo(), margin: [0, pt((textHeight - logoHeight) / 2), 0, 0] },
        { ...meta, width: '*', alignment: 'right' },
      ],
      columnGap: pt(T['space/gap/md']),
    },
    { lineAt: 'bottom', lineColor: color('border/subtle'), padding: T['space/padding/md'] },
  );
}

// pdf-footer: paginado role/label al borde derecho.
function footer(current, total) {
  return ruledBlock(
    { ...roleText(`${current} / ${total}`, 'label', 'text/tertiary'), alignment: 'right' },
    { lineAt: 'top', lineColor: color('border/subtle'), padding: T['space/padding/md'] },
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

// pdf-key-data: hasta cuatro pdf-key-item del mismo ancho, con regla superior
// color/border/strong. Cada uno: etiqueta role/label y valor role/heading-3-light.
function keyDataRow(items) {
  return {
    table: {
      widths: items.map(() => '*'),
      body: [
        items.map((item) => ({
          stack: [roleText(item.label, 'label', 'text/tertiary'), roleText(item.value, 'heading-3-light', 'text/primary', { above: T['space/gap/xs'] })],
        })),
      ],
    },
    layout: {
      hLineWidth: (i) => (i === 0 ? pt(ruled) : 0),
      vLineWidth: () => 0,
      hLineColor: () => color('border/strong'),
      paddingLeft: () => 0,
      paddingRight: (i, node) => (i < node.table.widths.length - 1 ? pt(T['space/gap/sm-md']) : 0),
      paddingTop: () => pt(T['space/padding/sm-md']),
      paddingBottom: () => 0,
    },
  };
}

// pdf-cover: nombre (role/heading-1) y SKU (role/body-compact) a todo el
// ancho; debajo, a space/gap/lg, la foto (COVER_MEDIA) y las cotas
// (cotaWidth); y debajo,
// a todo el ancho, los datos clave. Sin dibujo de cotas, la foto queda sola.
// Tamaños de impresión: nombre 24 pt, SKU 10,5 pt.
function cover(data, { image, cota }) {
  const side = pt(COVER_MEDIA);
  const title = [
    roleText(data.name, 'heading-1', 'text/primary'),
    roleText(data.sku, 'body-compact', 'text/secondary', { above: T['space/gap/sm-md'] }),
  ];
  const media = [
    // Foto entera sobre color/surface/subtle, ya pintado en la imagen. Sin
    // imagen, solo el fondo.
    image ? { image, width: side, height: side } : { canvas: [{ type: 'rect', x: 0, y: 0, w: side, h: side, color: color('surface/subtle') }] },
    // Cotas enteras sobre el fondo de la hoja, sin recuadro, del alto de la foto.
    ...(cota ? [{ image: cota.image, width: pt(cota.width), height: side, margin: [pt(T['space/gap/md']), 0, 0, 0] }] : []),
  ];
  const keyData = data.keyData ?? [];
  return {
    ...ruledBlock(
      {
        stack: [
          { stack: title },
          {
            columns: [...media.map((item) => ({ ...item, width: 'auto' })), { text: '', width: '*' }],
            columnGap: 0,
            margin: [0, pt(T['space/gap/lg']), 0, 0],
          },
          ...(keyData.length ? [{ ...keyDataRow(keyData), margin: [0, pt(T['space/gap/lg']), 0, 0] }] : []),
        ],
      },
      { lineAt: 'bottom', lineColor: color('border/subtle'), padding: T['space/padding/xl'] },
    ),
    unbreakable: true,
  };
}

// Una celda de pdf-spec-row con su regla inferior color/border/subtle.
const specCell = (text, role, colorName) => ({ ...roleText(text, role, colorName), border: [false, false, false, true] });

// pdf-spec-group en dos columnas: título role/body-lg-regular (12 pt) con
// regla color/border/strong y, debajo, las filas de pdf-spec-row · 2 col
// (etiqueta role/body-compact de layout/pdf-spec-label-compact, valor
// role/body-compact-regular a space/gap/lg: 10,5 pt, tamaño de lectura
// impresa; padding vertical space/padding/sm) repartidas en dos columnas a
// space/gap/xl: la primera mitad a la izquierda y el resto a la derecha, para
// leer de arriba abajo. Es una sola tabla de cinco columnas (etiqueta, valor,
// separación, etiqueta, valor), así las reglas de las dos columnas quedan a la
// misma altura aunque un valor ocupe dos líneas.
function specGroup(section, index, isLast) {
  const rowPadding = pt(T['space/padding/sm']);
  const label = T['layout/pdf-spec-label-compact'];
  const valueWidth = SPEC_COLUMN - label - T['space/gap/lg'];
  const half = Math.ceil(section.rows.length / 2);
  const left = section.rows.slice(0, half);
  const right = section.rows.slice(half);
  const pair = (row) => (row ? [specCell(row.label, 'body-compact', 'text/secondary'), specCell(row.value, 'body-compact-regular', 'text/primary')] : [{}, {}]);
  return {
    id: `spec-${index}`,
    table: {
      widths: [pt(label), pt(valueWidth), pt(T['space/gap/xl']), pt(label), '*'],
      headerRows: 1,
      keepWithHeaderRows: 1,
      dontBreakRows: true,
      body: [
        [{ ...roleText(section.label, 'body-lg-regular', 'text/primary'), colSpan: 5, border: [false, false, false, true] }, {}, {}, {}, {}],
        ...left.map((row, i) => [...pair(row), {}, ...pair(right[i])]),
      ],
    },
    layout: {
      defaultBorder: false,
      hLineWidth: () => pt(ruled),
      vLineWidth: () => 0,
      hLineColor: (i) => color(i === 1 ? 'border/strong' : 'border/subtle'),
      paddingLeft: (i) => (i === 1 || i === 4 ? pt(T['space/gap/lg']) : 0),
      paddingRight: () => 0,
      paddingTop: (i) => (i === 0 ? 0 : rowPadding),
      // Bajo el título, space/padding/sm-md, como pdf-spec-group.
      paddingBottom: (i) => (i === 0 ? pt(T['space/padding/sm-md']) : rowPadding),
    },
    // En la hoja 1, las especificaciones arrancan a space/padding/md de pdf-cover.
    margin: [0, index === 0 ? pt(T['space/padding/md']) : 0, 0, isLast ? 0 : pt(T['space/gap/lg'])],
  };
}

/**
 * Una sección que no entra en lo que queda de la hoja pasa entera a la
 * siguiente. Si ya arranca arriba de la hoja (no entra en ninguna), se corta.
 */
export function pageBreakBefore(node, { getPreviousNodesOnPage }) {
  if (!String(node.id ?? '').startsWith('spec-') || node.pageNumbers.length < 2) return false;
  return getPreviousNodesOnPage().length > 0;
}

/**
 * Definición de documento de pdfmake.
 *   data: { name, sku, keyData: [{ label, value }], sections: [{ label, rows: [{ label, value }] }] }
 *   options.image: foto de pdf-cover como data URL (JPEG o PNG), cuadrada
 *     de COVER_MEDIA y con el fondo ya pintado; null muestra solo el fondo.
 *   options.cota: { image, width }: dibujo con cotas como data URL, con fondo
 *     blanco, del alto de COVER_MEDIA y el ancho de cotaWidth; null no lo muestra.
 */
export function buildDatasheet(data, { image = null, cota = null } = {}) {
  // Desde la hoja 2 el cuerpo arranca a space/padding/2xl del encabezado
  // (Type=Product). En la 1, pdf-cover va debajo del encabezado Type=Default,
  // más bajo, con su propio padding (space/padding/xl): sube desde el margen
  // de la hoja, que pdfmake no deja cambiar por hoja.
  const specBody = page.top + headerHeight(productLines) + T['space/padding/2xl'];
  const coverShift = page.top + headerHeight(ROLES.label.lineHeight) + T['space/padding/xl'] - specBody;
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
    pageBreakBefore,
    defaultStyle: { font: fontName(ROLES.body.fontWeight) },
    content: [
      { ...cover(data, { image, cota }), margin: [0, pt(coverShift), 0, 0] },
      ...sections.map((section, i) => specGroup(section, i, i === sections.length - 1)),
    ],
  };
}
