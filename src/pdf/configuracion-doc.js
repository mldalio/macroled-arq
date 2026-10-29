// Configuración de Daö en PDF: la hoja del armado que sale del configurador
// («Descargar configuración»). Sigue la ficha técnica (ficha-tecnica-doc.js):
// misma hoja A4, encabezado con el logo, pie con el paginado, títulos de
// sección y filas. Solo lo de la configuración, sin fecha ni datos que no
// suman. TODO (diseño): no está en Figma.
//
//   buildConfiguration({ title, pieces, specs, parts }, { images })
//
// - Encabezado: logo + «Configuración Daö» (pdf-header Type=Default) en todas
//   las hojas. Pie: el paginado.
// - Arriba, el título del armado (role/heading-2, el mismo del configurador) y
//   una fila con la foto de cada pieza en un cuadrado (como el panel del
//   configurador), con su nombre debajo y, si va más de una, la cantidad.
// - Debajo, «Características» en dos columnas (pdf-spec-group · 2 col) y
//   «Piezas para este armado»: cantidad, nombre y SKU de cada pieza.
// No carga nada ni toca el DOM (eso es configuracion.js).

import { PRINT_TOKENS as T, PRINT_ROLES as ROLES } from '../styles/print-tokens.js';
import { CONTENT_WIDTH, COVER_MEDIA, PHOTO_BACKGROUND, RULE, TEXT as SHEET, color, footer, footerHeight, fontName, header, headerHeight, page, pt, roleText, specGroup } from './ficha-tecnica-doc.js';

export const TEXT = Object.freeze({
  label: 'Configuración Daö',
  specs: 'Características',
  parts: 'Piezas para este armado',
});

/**
 * Lado de la foto de cada pieza, en px: las fotos van en una fila a
 * space/gap/sm y se reparten el ancho; nunca más grandes que la de la ficha
 * técnica (layout/pdf-cover-image).
 */
export function pieceSide(count) {
  const gap = T['space/gap/sm'];
  return Math.min(COVER_MEDIA, (CONTENT_WIDTH - gap * (count - 1)) / Math.max(count, 1));
}

// Fotos de las piezas: cuadrados con la foto entera sobre PHOTO_BACKGROUND (el
// de la ficha técnica: el gris de pantalla no sale impreso) y, debajo, a
// space/gap/xs, el nombre en role/body-sm (con «2 ×» si va más de una). Con el
// título arriba; sin regla debajo (la sección siguiente ya lleva la suya).
function cover(data, images) {
  const side = pieceSide(data.pieces.length);
  // Si las fotos no llenan el ancho (pocas piezas), una columna vacía ocupa el resto
  const used = data.pieces.length * side + (data.pieces.length - 1) * T['space/gap/sm'];
  const filler = CONTENT_WIDTH - used > 1 ? [{ text: '', width: '*' }] : [];
  const photo = (piece, i) => ({
    width: pt(side),
    stack: [
      images[i] ? { image: images[i], width: pt(side), height: pt(side) } : { canvas: [{ type: 'rect', x: 0, y: 0, w: pt(side), h: pt(side), color: color(PHOTO_BACKGROUND) }] },
      roleText(piece.qty ? `${piece.qty} × ${piece.label}` : piece.label, 'body-sm', 'text/secondary', { above: T['space/gap/xs'] }),
    ],
  });
  return {
    stack: [
      roleText(data.title, 'heading-2', 'text/primary'),
      {
        columns: [...data.pieces.map(photo), ...filler],
        columnGap: pt(T['space/gap/sm']),
        margin: [0, pt(T['space/gap/md']), 0, 0],
      },
    ],
    // Sin regla, el aire con «Características» lo da el margen: space/padding/md
    // acá y otro tanto arriba de la sección
    margin: [0, 0, 0, pt(T['space/padding/md'])],
    unbreakable: true,
  };
}

// Piezas: como pdf-spec-group (título role/body-compact-medium con regla
// color/border/strong) y una fila por pieza: cantidad («2×», role/body-sm en
// color/text/secondary), nombre (role/body-sm-medium) y SKU (role/body-sm, a
// la derecha), con regla RULE y padding vertical space/padding/sm.
function partsGroup(parts) {
  const cell = (text, role, colorName, extra = {}) => ({ ...roleText(text, role, colorName), border: [false, false, false, true], ...extra });
  return {
    table: {
      widths: ['auto', '*', 'auto'],
      headerRows: 1,
      keepWithHeaderRows: 1,
      dontBreakRows: true,
      body: [
        [{ ...roleText(TEXT.parts, 'body-compact-medium', 'text/primary'), colSpan: 3, border: [false, false, false, true] }, {}, {}],
        ...parts.map((part) => [
          cell(`${part.qty}×`, 'body-sm', 'text/secondary'),
          cell(part.name, 'body-sm-medium', 'text/primary'),
          // El SKU no se corta (puede ser largo: PAR11-C-5W-DIM-36G-WW)
          cell(part.sku, 'body-sm', 'text/secondary', { alignment: 'right', noWrap: true }),
        ]),
      ],
    },
    layout: {
      defaultBorder: false,
      hLineWidth: () => pt(T['border/default']),
      vLineWidth: () => 0,
      hLineColor: (i) => color(i === 1 ? 'border/strong' : RULE),
      paddingLeft: (i) => (i === 0 ? 0 : pt(T['space/gap/lg'])),
      paddingRight: () => 0,
      paddingTop: (i) => (i === 0 ? 0 : pt(T['space/padding/sm'])),
      paddingBottom: () => pt(T['space/padding/sm']),
    },
  };
}

/**
 * Definición de documento de pdfmake.
 *   data: { title, pieces: [{ label, qty }], specs: [[label, value]], parts: [{ qty, name, sku }] }
 *   options.images: la foto de cada pieza (data URL cuadrada de pieceSide, con
 *     el fondo pintado), en el orden de pieces; null deja solo el fondo.
 */
export function buildConfiguration(data, { images = [] } = {}) {
  // El título arranca a space/padding/xl del encabezado (con md quedaba pegado a la regla)
  const top = page.top + headerHeight(ROLES.label.lineHeight) + T['space/padding/xl'];
  const specs = data.specs.length ? [specGroup({ label: TEXT.specs, rows: data.specs.map(([label, value]) => ({ label, value })) }, 0, false)] : [];
  return {
    pageSize: 'A4',
    pageMargins: [pt(page.side), pt(top), pt(page.side), pt(footerHeight + page.bottom)],
    info: { title: `${TEXT.label} · ${data.title}`, author: SHEET.brand },
    header: () => ({ ...header(null, TEXT.label), margin: [pt(page.side), pt(page.top), pt(page.side), 0] }),
    footer: (current, total) => ({ ...footer(current, total), margin: [pt(page.side), 0, pt(page.side), 0] }),
    defaultStyle: { font: fontName(ROLES.body.fontWeight) },
    content: [cover(data, images), ...specs, { ...partsGroup(data.parts), margin: [0, specs.length ? 0 : pt(T['space/padding/md']), 0, 0] }],
  };
}
