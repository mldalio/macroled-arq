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
// no entran en dist/arq.js. Las imágenes se leen con CORS y se pasan por un
// canvas (pdfmake solo acepta JPEG y PNG; las fotos pueden venir en WebP):
// S3 no manda Access-Control-Allow-Origin, así que se piden al CloudFront que
// sirve los mismos archivos con CORS (config.images.pdfBase). Si no cargan,
// pdf-cover sale con el fondo sin foto, o sin el recuadro de cotas.

import { config } from '../config.js';
import { getDatasheet } from '../data/catalog.js';
import { PRINT_TOKENS as T } from '../styles/print-tokens.js';
import { COVER_MEDIA, FONT_WEIGHTS, buildDatasheet, cotaWidth, fontName } from './ficha-tecnica-doc.js';

// Resolución de la foto de pdf-cover: 2,5 × los px de Figma (unos 240 dpi en
// A4). El dibujo de cotas, a 4 × (unos 380 dpi): tiene líneas de 1 px y
// medidas en letra chica.
const IMAGE_SCALE = 2.5;
const COTA_SCALE = 4;
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

// La imagen se pide al CloudFront, que manda CORS (S3 no): config.images.pdfBase.
// Una imagen de otro servidor se pide tal cual.
function corsSrc(src, sizePx, type) {
  const { sampleFrom, pdfBase } = config.images;
  if (!src.startsWith(sampleFrom)) return src;
  return pdfBase.replaceAll('{size}', Math.round(sizePx)).replace('{format}', type.split('/')[1]) + src.slice(sampleFrom.length);
}

/**
 * Imagen de un tamaño en px, lista para pdfmake: { image: dataUrl, width } o
 * null si no carga.
 *   widthPx: un número o, si el ancho depende de la imagen, una función de su
 *     proporción (ancho / alto) que devuelve el ancho. maxPx: el lado más
 *     largo posible, para pedirla al CloudFront a ese tamaño.
 *   fit: 'contain' la muestra entera (foto y cotas); 'cover' recorta para llenar.
 *   background: color de fondo (los PNG de estudio son transparentes).
 *   type: 'image/jpeg' para fotos; 'image/png' para el dibujo de líneas.
 */
function fitImage(src, widthPx, heightPx, { maxPx = Math.max(Number(widthPx) || 0, heightPx), fit = 'contain', background = T['color/surface/subtle'], scale: density = IMAGE_SCALE, type = 'image/jpeg' } = {}) {
  if (!src) return Promise.resolve(null);
  src = corsSrc(src, maxPx * density, type);
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.decoding = 'async';
    img.onload = () => {
      try {
        const width = typeof widthPx === 'function' ? widthPx(img.naturalWidth / img.naturalHeight) : widthPx;
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(width * density);
        canvas.height = Math.round(heightPx * density);
        const context = canvas.getContext('2d');
        context.fillStyle = background;
        context.fillRect(0, 0, canvas.width, canvas.height);
        const ratios = [canvas.width / img.naturalWidth, canvas.height / img.naturalHeight];
        const scale = fit === 'cover' ? Math.max(...ratios) : Math.min(...ratios);
        const w = img.naturalWidth * scale;
        const h = img.naturalHeight * scale;
        context.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
        resolve({ image: canvas.toDataURL(type, IMAGE_QUALITY), width });
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
  const [photo, cota] = await Promise.all([
    // Foto en un cuadrado, entera.
    fitImage(data.image, COVER_MEDIA, COVER_MEDIA),
    // Cotas del alto de la foto; un dibujo horizontal se ensancha (cotaWidth).
    // El dibujo (PNG con fondo blanco) se pide y se guarda en PNG: el JPEG
    // ensucia las líneas finas.
    fitImage(data.cota, cotaWidth, COVER_MEDIA, {
      maxPx: cotaWidth(Infinity),
      background: T['color/surface/default'],
      scale: COTA_SCALE,
      type: 'image/png',
    }),
  ]);
  return { data, definition: buildDatasheet(data, { image: photo?.image ?? null, cota }) };
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
