// Ficha técnica en PDF: la genera en el navegador y la abre en una pestaña nueva.
//
//   import { openDatasheet } from '../pdf/ficha-tecnica.js';
//   button.addEventListener('click', () => openDatasheet('KA 500 12W N WW'));
//
// main.js la llama con cada arq:datasheet { sku } (ficha de producto y
// Descargas). Datos: src/data/catalog.js (getDatasheet). Diseño y paginado:
// ficha-tecnica-doc.js.
//
// pdfmake y Albert Sans se cargan de jsDelivr al primer clic (src/config.js) y
// no entran en dist/arq.js. La imagen se lee con CORS y se pasa a JPEG en un
// canvas (pdfmake solo acepta JPEG y PNG; las imágenes pueden venir en WebP):
// el servidor de imágenes (S3) tiene que responder con
// Access-Control-Allow-Origin. Si no, la portada sale con el fondo sin imagen.

import { config } from '../config.js';
import { getDatasheet } from '../data/catalog.js';
import { PRINT_TOKENS as T, PRINT_ROLES as ROLES } from '../styles/print-tokens.js';
import { CONTENT_WIDTH, FONT_WEIGHTS, buildDatasheet, coverImageHeight, fontName } from './ficha-tecnica-doc.js';

// Resolución de la imagen de la portada: 2,5 × los px de Figma (unos 240 dpi en A4).
const IMAGE_SCALE = 2.5;
const IMAGE_QUALITY = 0.9;

let library = null;

// pdfmake con Albert Sans, una sola vez por página.
function loadLibrary() {
  library ??= import(/* @vite-ignore */ config.pdf.pdfmakeUrl).then(({ default: pdfMake }) => {
    const fonts = {};
    for (const weight of FONT_WEIGHTS) {
      const url = config.pdf.fontUrl.replace('{weight}', weight);
      fonts[fontName(weight)] = { normal: url, bold: url, italics: url, bolditalics: url };
    }
    pdfMake.addFonts(fonts);
    // Solo se descargan la fuente y las imágenes ya convertidas a data URL.
    pdfMake.setUrlAccessPolicy((url) => url.startsWith(config.pdf.fontUrl.split('{weight}')[0]));
    return pdfMake;
  });
  library.catch(() => (library = null)); // un error permite reintentar
  return library;
}

// Líneas que ocupa un texto con un rol en el ancho de la hoja. Se mide con la
// fuente de la página (Albert Sans se carga a nivel página).
async function countLines(text, role) {
  const r = ROLES[role];
  const font = `${r.fontWeight} ${r.fontSize}px "${T['font/family/sans']}"`;
  try {
    await document.fonts?.load(font, text);
  } catch {
    // Sin la fuente se mide con la de reemplazo: es una estimación.
  }
  const context = document.createElement('canvas').getContext('2d');
  context.font = font;
  const width = (value) => context.measureText(value).width + value.length * r.letterSpacing;
  let lines = 1;
  let line = '';
  for (const word of String(text).split(/\s+/).filter(Boolean)) {
    const next = line ? `${line} ${word}` : word;
    if (line && width(next) > CONTENT_WIDTH) {
      lines += 1;
      line = word;
    } else {
      line = next;
    }
  }
  return lines;
}

// Imagen recortada como object-fit: cover sobre color/bg/subtle, en JPEG.
function coverImage(src, widthPx, heightPx) {
  if (!src) return Promise.resolve(null);
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.decoding = 'async';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(widthPx * IMAGE_SCALE);
        canvas.height = Math.round(heightPx * IMAGE_SCALE);
        const context = canvas.getContext('2d');
        context.fillStyle = T['color/bg/subtle'];
        context.fillRect(0, 0, canvas.width, canvas.height);
        const scale = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
        const w = img.naturalWidth * scale;
        const h = img.naturalHeight * scale;
        context.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
        resolve(canvas.toDataURL('image/jpeg', IMAGE_QUALITY));
      } catch (error) {
        // Canvas «tainted»: la imagen no tiene CORS.
        console.warn('[arq] ficha técnica: la imagen no se puede usar en el PDF (¿falta CORS en el servidor de imágenes?)', src, error);
        resolve(null);
      }
    };
    img.onerror = () => {
      console.warn('[arq] ficha técnica: no se pudo cargar la imagen', src);
      resolve(null);
    };
    img.src = src;
  });
}

// El SKU es un identificador opaco (puede tener espacios o paréntesis): para el
// nombre del archivo queda solo lo seguro.
const fileName = (sku) => `ficha-tecnica-${String(sku).replace(/[^\w-]+/g, '-').replace(/^-+|-+$/g, '')}.pdf`;

/** Documento de pdfmake de un SKU, listo para generar. null si el SKU no existe. */
export async function datasheetDocument(sku) {
  const data = await getDatasheet(sku);
  if (!data) return null;
  const [nameLines, skuLines] = await Promise.all([countLines(data.name, 'display'), countLines(data.sku, 'body-lg')]);
  const image = await coverImage(data.image, CONTENT_WIDTH, coverImageHeight({ nameLines, skuLines }));
  return { data, definition: buildDatasheet(data, { image, nameLines, skuLines }) };
}

const pending = new Map();

/**
 * Genera la ficha técnica de un SKU y la abre en una pestaña nueva, en el
 * visor de PDF del navegador (sin descargarla). Hay que llamarla dentro del
 * clic: la pestaña se abre vacía en ese momento (si no, el navegador la
 * bloquea como ventana emergente) y se carga cuando el PDF está listo. Si el
 * navegador la bloquea igual, el PDF se descarga. Un segundo clic mientras se
 * genera no abre otra pestaña.
 */
export function openDatasheet(sku) {
  if (pending.has(sku)) return pending.get(sku);
  const tab = window.open('', '_blank');
  const job = (async () => {
    try {
      const [pdfMake, result] = await Promise.all([loadLibrary(), datasheetDocument(sku)]);
      if (!result) throw new Error(`el SKU «${sku}» no está en el catálogo`);
      const pdf = pdfMake.createPdf(result.definition);
      if (tab && !tab.closed) await pdf.open(tab);
      else await pdf.download(fileName(result.data.sku));
    } catch (error) {
      tab?.close();
      throw error;
    }
  })().finally(() => pending.delete(sku));
  pending.set(sku, job);
  return job;
}
