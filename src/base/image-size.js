// image-size · pide las fotos de producto al CloudFront en el tamaño que se
// muestran, en webp, en lugar del archivo original del servidor (docs/decisiones.md,
// 2026-10-28 · Fotos de producto por el CloudFront).
//
// El original puede pesar 2 MB (PNG de más de 2000 px) para una card de 350 px:
// la misma foto a 800 px en webp pesa unos 35 KB. El webp conserva la
// transparencia de los PNG de estudio (el jpeg la pinta de negro).
//
// Solo cambia fotos del servidor de imágenes (config.images.sampleFrom) o del
// CloudFront; cualquier otra URL queda como viene. Sirve tanto para un original
// como para una URL ya achicada: se reemplaza el tamaño.

import { config } from '../config.js';

export const CARD_WIDTH = 800; // card de 350 px a doble densidad, con margen
export const GALLERY_WIDTH = 1600; // foto grande de la ficha
const QUALITY = 85;

const isStep = (segment) => segment === 'fit-in' || segment.startsWith('filters:') || /^[0-9]+x[0-9]+$/.test(segment);

export function sizedImage(url, width = CARD_WIDTH) {
  if (!url) return url;
  const { sampleFrom, sampleBase } = config.images;
  const cdn = `${new URL(sampleBase).origin}/`;
  let path;
  if (url.startsWith(sampleFrom)) path = url.slice(sampleFrom.length);
  else if (url.startsWith(cdn)) path = url.slice(cdn.length);
  else return url;
  const [file, query = ''] = path.split('?');
  const segments = file.split('/');
  while (segments.length > 1 && isStep(segments[0])) segments.shift();
  // La altura no limita: fit-in entra en width × (2 × width) y conserva la proporción
  return `${cdn}fit-in/${width}x${width * 2}/filters:format(webp):quality(${QUALITY})/${segments.join('/')}${query ? `?${query}` : ''}`;
}
