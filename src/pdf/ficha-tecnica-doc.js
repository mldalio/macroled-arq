// Ficha técnica en PDF · Figma ficha_pdf (1907:27213): pdf-page, pdf-header,
// pdf-cover-title, pdf-spec-group, pdf-spec-row y pdf-footer.
//
// Arma la definición de documento de pdfmake a partir de los datos del SKU.
// No carga nada ni toca el DOM (eso es ficha-tecnica.js): se puede probar en Node.
//
//   buildDatasheet({ name, sku, image, sections }, { image: dataUrl | null, nameLines, skuLines })
//
// - Hoja 1, portada: imagen principal, nombre y SKU. Hoja 2 en adelante:
//   especificaciones; pdfmake suma hojas si no entran.
// - Una sección no se parte entre hojas: si no entra, pasa entera a la
//   siguiente. Solo una sección más alta que una hoja se corta, y repite su
//   título arriba (decisiones.md, 2026-10-06 · Ficha técnica en PDF).
// - Encabezado y pie en todas las hojas. Pie de la portada: «Macroled Arq»; del
//   resto, el aviso legal.
// - Medidas y colores de src/styles/print-tokens.js (generado por npm run
//   tokens): pdfmake no lee variables CSS. Figma mide en px a 96 dpi y el PDF
//   en puntos: 1 px = 0,75 pt.

import { PRINT_TOKENS as T, PRINT_ROLES as ROLES } from '../styles/print-tokens.js';
import { LOGO_PATHS, LOGO_VIEWBOX, LOGO_WIDTHS } from '../base/logo-paths.js';

export const TEXT = Object.freeze({
  eyebrow: 'Ficha técnica',
  brand: 'Macroled Arq',
  legal: 'Los datos técnicos pueden variar sin previo aviso.',
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
  ...new Set(['label', 'display', 'body-lg', 'body', 'body-lg-regular', 'body-sm'].map((role) => ROLES[role].fontWeight)),
]);

// Colores con transparencia (color/border/subtle es tinta al 10 %): se
// mezclan sobre el fondo de la hoja, color/bg/default.
function solid(hex, background = T['color/bg/default']) {
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

// Línea de una sola regla: horizontal, debajo (header) o arriba (footer) de su contenido.
function ruledBlock(content, { lineAt, lineColor, padding }) {
  return {
    table: { widths: ['*'], body: [[content]] },
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

// Alto del encabezado y del pie: la línea de texto más alta (o el logo), el
// padding y la regla.
const headerHeight = Math.max(ROLES.label.lineHeight, (LOGO_WIDTHS.small * LOGO_VIEWBOX.height) / LOGO_VIEWBOX.width) + T['space/padding/md'] + ruled;
const footerHeight = Math.max(ROLES['body-sm'].lineHeight, ROLES.label.lineHeight) + T['space/padding/md'] + ruled;

// pdf-header: logo (Size=Small) y metadatos role/label, separados por space/gap/md.
function header(meta) {
  const logoBox = logo();
  // El logo se centra en la altura de la línea de texto (items-center).
  const logoOffset = pt((ROLES.label.lineHeight - (LOGO_WIDTHS.small * LOGO_VIEWBOX.height) / LOGO_VIEWBOX.width) / 2);
  const metaColumns = meta.map((item) => ({ ...roleText(item, 'label', 'text/tertiary'), width: 'auto' }));
  return ruledBlock(
    {
      columns: [
        { ...logoBox, margin: [0, logoOffset, 0, 0] },
        { width: '*', text: '' },
        ...metaColumns,
      ],
      columnGap: pt(T['space/gap/md']),
    },
    { lineAt: 'bottom', lineColor: color('border/subtle'), padding: T['space/padding/md'] },
  );
}

// pdf-footer: nota role/body-sm y paginado role/label.
function footer(note, current, total) {
  return ruledBlock(
    {
      columns: [
        { ...roleText(note, 'body-sm', 'text/tertiary'), width: '*' },
        { ...roleText(`${current} / ${total}`, 'label', 'text/tertiary'), width: 'auto' },
      ],
    },
    { lineAt: 'top', lineColor: color('border/subtle'), padding: T['space/padding/md'] },
  );
}

/** Ancho del contenido de la hoja, en px. */
export const CONTENT_WIDTH = PAGE.width / PT_PER_PX - 2 * page.side;

/**
 * Alto de la imagen de la portada en px: lo que queda de la hoja después del
 * encabezado, el título (con sus líneas reales) y el pie. En Figma la imagen
 * es FILL.
 */
export function coverImageHeight({ nameLines = 1, skuLines = 1 } = {}) {
  const title =
    ROLES.label.lineHeight +
    T['space/gap/sm-md'] +
    nameLines * ROLES.display.lineHeight +
    T['space/gap/sm-md'] +
    skuLines * ROLES['body-lg'].lineHeight +
    T['space/padding/xl-2xl'];
  const available =
    PAGE.height / PT_PER_PX -
    page.top -
    headerHeight -
    T['space/padding/xl-2xl'] - // padding superior del cuerpo de la portada
    T['space/gap/xl-2xl'] - // entre la imagen y el título
    title -
    footerHeight -
    page.bottom;
  // Un px de margen: el redondeo de pdfmake no puede empujar el título a otra hoja.
  return Math.floor(available) - 1;
}

// pdf-spec-group: título role/label con regla color/border/strong y filas
// pdf-spec-row (etiqueta role/body, valor role/body-lg-regular).
function specGroup(section, index, isLast) {
  const rowPadding = pt(T['space/padding/sm-md']);
  return {
    id: `spec-${index}`,
    table: {
      widths: [pt(T['layout/pdf-spec-label']), '*'],
      headerRows: 1,
      keepWithHeaderRows: 1,
      dontBreakRows: true,
      body: [
        [{ ...roleText(section.label, 'label', 'text/primary'), colSpan: 2 }, {}],
        ...section.rows.map((row) => [roleText(row.label, 'body', 'text/secondary'), roleText(row.value, 'body-lg-regular', 'text/primary')]),
      ],
    },
    layout: {
      hLineWidth: (i) => (i === 0 ? 0 : pt(ruled)),
      vLineWidth: () => 0,
      hLineColor: (i) => color(i === 1 ? 'border/strong' : 'border/subtle'),
      paddingLeft: (i) => (i === 0 ? 0 : pt(T['space/gap/lg'])),
      paddingRight: () => 0,
      paddingTop: (i) => (i === 0 ? 0 : rowPadding),
      paddingBottom: () => rowPadding,
    },
    pageBreak: index === 0 ? 'before' : undefined,
    margin: [0, 0, 0, isLast ? 0 : pt(T['space/gap/xl-2xl'])],
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
 *   data: { name, sku, sections: [{ label, rows: [{ label, value }] }] }
 *   options.image: imagen de la portada como data URL (JPEG o PNG), ya
 *     recortada al alto de coverImageHeight; null muestra solo el fondo.
 *   options.nameLines / skuLines: líneas que ocupan nombre y SKU en la portada.
 */
export function buildDatasheet(data, { image = null, nameLines = 1, skuLines = 1 } = {}) {
  const imageHeight = coverImageHeight({ nameLines, skuLines });
  const coverBody = page.top + headerHeight + T['space/padding/xl-2xl'];
  const specBody = page.top + headerHeight + T['space/padding/2xl'];
  const box = { width: pt(CONTENT_WIDTH), height: pt(imageHeight) };
  const sections = data.sections ?? [];

  const cover = [
    {
      // Imagen de producto sobre color/bg/subtle (el fondo ya viene pintado en
      // la imagen). Sin imagen, solo el fondo.
      ...(image ? { image, ...box } : { canvas: [{ type: 'rect', x: 0, y: 0, w: box.width, h: box.height, color: color('bg/subtle') }] }),
      // La hoja empieza con el padding de especificaciones (más alto): la portada lo achica.
      margin: [0, pt(coverBody - specBody), 0, pt(T['space/gap/xl-2xl'])],
    },
    // pdf-cover-title
    {
      stack: [
        roleText(TEXT.eyebrow, 'label', 'text/tertiary'),
        roleText(data.name, 'display', 'text/primary', { above: T['space/gap/sm-md'] }),
        roleText(data.sku, 'body-lg', 'text/secondary', { above: T['space/gap/sm-md'] }),
      ],
      unbreakable: true,
    },
  ];

  return {
    pageSize: 'A4',
    pageMargins: [pt(page.side), pt(specBody), pt(page.side), pt(footerHeight + page.bottom)],
    info: { title: `${TEXT.eyebrow} · ${data.name} · ${data.sku}`, author: TEXT.brand },
    header: (current) => ({
      ...header(current === 1 ? [TEXT.eyebrow] : [data.name, data.sku]),
      margin: [pt(page.side), pt(page.top), pt(page.side), 0],
    }),
    footer: (current, total) => ({
      ...footer(current === 1 ? TEXT.brand : TEXT.legal, current, total),
      margin: [pt(page.side), 0, pt(page.side), 0],
    }),
    pageBreakBefore,
    defaultStyle: { font: fontName(ROLES.body.fontWeight) },
    content: [...cover, ...sections.map((section, i) => specGroup(section, i, i === sections.length - 1))],
  };
}
