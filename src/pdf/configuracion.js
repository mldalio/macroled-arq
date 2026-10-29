// Configuración de Daö en PDF: la genera en el navegador y la abre en una
// pestaña nueva, como la ficha técnica (ficha-tecnica.js, de donde toma
// pdfmake, la fuente y la preparación de imágenes).
//
//   import { openConfiguration } from '../pdf/configuracion.js';
//   button.addEventListener('click', () => openConfiguration({ title, pieces, specs, parts }));
//
// main.js la llama con cada arq:configuration (dao-configurator, «Descargar
// configuración»). Diseño: configuracion-doc.js.

import { PRINT_TOKENS as T } from '../styles/print-tokens.js';
import { PHOTO_BACKGROUND } from './ficha-tecnica-doc.js';
import { fitImage, loadLibrary } from './ficha-tecnica.js';
import { buildConfiguration, pieceSide } from './configuracion-doc.js';

const FILE = 'configuracion-dao';

let pending = null;

/**
 * Genera la configuración y la abre en una pestaña nueva, en el visor de PDF
 * del navegador (sin descargarla). Hay que llamarla dentro del clic: la
 * pestaña se abre vacía en ese momento (si no, el navegador la bloquea) y se
 * carga cuando el PDF está listo. Si el navegador la bloquea igual, el PDF se
 * descarga. Un segundo clic mientras se genera no abre otra pestaña.
 *   data: { title, pieces: [{ src, label, qty }], specs: [[label, value]], parts: [{ qty, name, sku }] }
 */
export function openConfiguration(data) {
  if (pending) return pending;
  const tab = window.open('', '_blank');
  pending = (async () => {
    try {
      const side = pieceSide(data.pieces.length);
      const [pdfMake, ...images] = await Promise.all([
        loadLibrary(),
        ...data.pieces.map((piece) => fitImage(piece.src, side, side, { background: T[`color/${PHOTO_BACKGROUND}`] })),
      ]);
      const definition = buildConfiguration(data, { images: images.map((image) => image?.image ?? null) });
      // El visor de Chrome nombra el archivo guardado con el título del PDF
      definition.info.title = FILE;
      const pdf = pdfMake.createPdf(definition);
      if (tab && !tab.closed) await pdf.open(tab);
      else await pdf.download(`${FILE}.pdf`);
    } catch (error) {
      tab?.close();
      throw error;
    }
  })().finally(() => (pending = null));
  return pending;
}
