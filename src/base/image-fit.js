// image-fit · foto de estudio que no entra en su recuadro (docs/decisiones.md,
// 2026-11-03 · Productos grandes en la card y la ficha).
//
// Las fotos de estudio (PNG transparente) están a la misma escala: la variante
// más grande de un producto (Döuli 18W, Höshi 12W, Sen 10W, Kanu Jardín 90 cm,
// Kanu Pared 50 cm) ocupa casi toda la foto y, con el recorte de object-fit, se
// corta o toca el borde del recuadro. Se mide dónde está el producto en una
// copia chica de la foto (con CORS, config.images.sampleBase) y se achica la
// foto lo justo para que quede a `margin` de cada borde. No hay lista de
// productos: vale para cualquier foto que llegue de la base.
//
// Un lado donde el producto ya toca el borde de la foto (el cable de un
// colgante, la base de un bolardo) sigue pegado a ese borde: la foto se achica
// desde ahí. Una foto sin transparencia (ambiente, detalle) no cambia.
//
//   import { productBox, fitScale, tokenPx } from '../../base/image-fit.js';
//   const box = await productBox(img.getAttribute('src'));
//   const { scale, origin } = fitScale(box, { width, height }, { margin: tokenPx('--arq-space-padding-3xl') });

import { config } from '../config.js';
import { sizedImage } from './image-size.js';

const SAMPLE = 128; // ancho de la copia que se lee
const ALPHA = 20; // de 0 a 255: por debajo es fondo (el borde suave del recorte)
const boxes = new Map(); // URL de la copia → Promise<caja | null>

// Copia chica que se puede leer con CORS; null si la foto viene de otro
// servidor (no se intenta: dejaría un error en consola). Höshi llega del S3
// (image-size.js), que no manda CORS: se pide la copia de sampleBase.
const sampleSrc = (src) => {
  const { sampleFrom, sampleBase } = config.images;
  const url = sizedImage(src, SAMPLE);
  if (url.startsWith(sampleFrom)) return sampleBase + url.slice(sampleFrom.length);
  return url.startsWith(`${new URL(sampleBase).origin}/`) ? url : null;
};

async function measure(url) {
  const image = new Image();
  image.crossOrigin = 'anonymous';
  image.src = url;
  try {
    await image.decode();
  } catch {
    return null;
  }
  const { naturalWidth: width, naturalHeight: height } = image;
  if (!width || !height) return null;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  context.drawImage(image, 0, 0);
  let data;
  try {
    data = context.getImageData(0, 0, width, height).data;
  } catch {
    return null;
  }
  let left = width, top = height, right = -1, bottom = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] <= ALPHA) continue;
      if (x < left) left = x;
      if (x > right) right = x;
      if (y < top) top = y;
      if (y > bottom) bottom = y;
    }
  }
  if (right < 0) return null;
  const anchored = { left: left === 0, top: top === 0, right: right === width - 1, bottom: bottom === height - 1 };
  // Sin fondo transparente: no es una foto de estudio
  if (anchored.left && anchored.top && anchored.right && anchored.bottom) return null;
  return { left: left / width, top: top / height, right: (right + 1) / width, bottom: (bottom + 1) / height, ratio: width / height, anchored };
}

/** Dónde está el producto en la foto (0 a 1 de cada lado), o null si no se puede medir o no es de estudio. */
export function productBox(src) {
  const url = src ? sampleSrc(src) : null;
  if (!url) return Promise.resolve(null);
  if (!boxes.has(url)) boxes.set(url, measure(url));
  return boxes.get(url);
}

/**
 * Dónde dibujar la foto para que el producto quede a `margin` px de los bordes
 * del recuadro que no toca en la foto.
 * frame: { width, height } del contenido del <img> (sin su padding).
 * margin: un número, o { x, y } (a los lados y arriba y abajo).
 * limit: margen mínimo (mismo formato). Sin él, el producto se achica hasta
 *   `margin`. Con él, lo que pasa de `margin` se achica con la raíz cúbica y
 *   nunca pasa de `limit`: un producto más grande sigue viéndose más grande
 *   (Döuli 18W más que el 15W, y este más que el 12W).
 * cover: object-fit cover (true) o contain (false); la foto va centrada.
 * centerX: se achica siempre desde el centro a lo ancho (la galería: su
 *   scroll-snap se alinea con la caja ya achicada).
 * shift: con cover, antes de achicar se corre la foto dentro del recuadro
 *   (object-position) si con eso el producto entra.
 * Devuelve { scale, origin, position, rect }: la escala desde transform-origin
 * sobre la foto con object-position, y rect, dónde queda la foto dibujada.
 */
export function fitScale(box, { width, height }, { margin = 0, limit, cover = true, centerX = false, shift = false } = {}) {
  if (!box || !width || !height) return { scale: 1, origin: '', position: '', rect: null };
  const pair = (value) => (typeof value === 'number' ? { x: value, y: value } : value);
  const soft = pair(margin);
  const hard = pair(limit ?? margin);
  const drawnHeight = (cover ? Math.max : Math.min)(height, width / box.ratio);
  const drawnWidth = drawnHeight * box.ratio;
  const { anchored } = box;
  // Corre la foto en un eje para que el lado libre que se pasa entre, sin que
  // se pase el otro ni la foto deje de cubrir el recuadro
  const place = (size, drawn, from, to, freeFrom, freeTo, gap) => {
    const slack = size - drawn;
    const offset = slack / 2;
    if (!shift || !cover || slack >= 0) return offset;
    const start = offset + from * drawn;
    const end = offset + to * drawn;
    const low = freeFrom ? gap - start : -Infinity; // corrimiento mínimo
    const high = freeTo ? size - gap - end : Infinity; // corrimiento máximo
    let move = 0;
    if (low > 0 && high >= 0) move = Math.min(low, high);
    else if (high < 0 && low <= 0) move = Math.max(low, high);
    return Math.min(0, Math.max(slack, offset + move));
  };
  const x = place(width, drawnWidth, box.left, box.right, !anchored.left, !anchored.right, soft.x);
  const y = place(height, drawnHeight, box.top, box.bottom, !anchored.top, !anchored.bottom, soft.y);
  const product = {
    left: x + box.left * drawnWidth,
    right: x + box.right * drawnWidth,
    top: y + box.top * drawnHeight,
    bottom: y + box.bottom * drawnHeight,
  };
  // Se achica desde el lado anclado; con los dos o ninguno, desde el centro
  const originX = centerX ? width / 2 : anchored.left && !anchored.right ? 0 : anchored.right && !anchored.left ? width : width / 2;
  const originY = anchored.top && !anchored.bottom ? 0 : anchored.bottom && !anchored.top ? height : height / 2;
  let scale = 1;
  // Lado libre: reach es lo que ocupa desde el origen; room, el lugar hasta el margen
  const fit = (room, roomLimit, reach) => {
    if (reach <= room || room <= 0) return;
    const target = roomLimit > room ? Math.min(roomLimit, room * Math.cbrt(reach / room)) : room;
    scale = Math.min(scale, target / reach);
  };
  if (!anchored.left || centerX) fit(originX - soft.x, originX - hard.x, originX - product.left);
  if (!anchored.right || centerX) fit(width - soft.x - originX, width - hard.x - originX, product.right - originX);
  if (!anchored.top) fit(originY - soft.y, originY - hard.y, originY - product.top);
  if (!anchored.bottom) fit(height - soft.y - originY, height - hard.y - originY, product.bottom - originY);
  const percent = (value, size) => `${(value / size) * 100}%`;
  // object-position: el corrimiento sobre lo que la foto sobra del recuadro
  const share = (offset, size, drawn) => (size === drawn ? '50%' : percent(offset, size - drawn));
  return {
    scale,
    origin: `${percent(originX, width)} ${percent(originY, height)}`,
    position: `${share(x, width, drawnWidth)} ${share(y, height, drawnHeight)}`,
    rect: {
      x: originX + (x - originX) * scale,
      y: originY + (y - originY) * scale,
      width: drawnWidth * scale,
      height: drawnHeight * scale,
    },
  };
}

/**
 * Dónde dibujar la foto para que el producto se vea entero: a `margin` px de
 * los bordes que no toca en la foto y pegado al borde del recuadro del lado que
 * sí (la base de un bolardo apoyada abajo). A lo ancho, la foto va centrada.
 * Ficha: Kanu Jardín 90 cm se ve entero y más angosto que el de 50 cm, que
 * llena el recuadro: así se aprecia que es más alto.
 */
export function wholeRect(box, { width, height }, margin = 0) {
  const drawnHeight = Math.max(height, width / box.ratio);
  const drawnWidth = drawnHeight * box.ratio;
  const { anchored } = box;
  const roomX = width - (anchored.left ? 0 : margin) - (anchored.right ? 0 : margin);
  const roomY = height - (anchored.top ? 0 : margin) - (anchored.bottom ? 0 : margin);
  const scale = Math.min(1, roomX / ((box.right - box.left) * drawnWidth), roomY / ((box.bottom - box.top) * drawnHeight));
  const w = drawnWidth * scale;
  const h = drawnHeight * scale;
  const productHeight = (box.bottom - box.top) * h;
  let y;
  if (anchored.bottom && !anchored.top) y = height - box.bottom * h;
  else if (anchored.top && !anchored.bottom) y = -box.top * h;
  else y = (height - productHeight) / 2 - box.top * h;
  return { x: (width - w) / 2, y, width: w, height: h };
}

/**
 * transform que lleva la foto entera (object-fit: contain, centrada) a `rect`.
 * Con cover el navegador recorta antes de achicar y lo recortado no vuelve:
 * por eso se parte de la foto entera. offset: el padding del <img>.
 * Devuelve { transform, scale }: scale > 1 agranda la caja del <img>.
 */
export function containTransform(rect, { width, height }, ratio, offset = { left: 0, top: 0 }) {
  const drawn = Math.min(width, height * ratio);
  const left = offset.left + (width - drawn) / 2;
  const top = offset.top + (height - drawn / ratio) / 2;
  const scale = rect.width / drawn;
  const x = offset.left + rect.x - left * scale;
  const y = offset.top + rect.y - top * scale;
  return { transform: `translate(${x}px, ${y}px) scale(${scale})`, scale };
}

/** Un token de espacio (--arq-space-*) en px, con el modo del viewport. */
export function tokenPx(name) {
  const root = document.documentElement;
  const value = getComputedStyle(root).getPropertyValue(name).trim();
  const number = Number.parseFloat(value) || 0;
  return value.endsWith('rem') ? number * Number.parseFloat(getComputedStyle(root).fontSize) : number;
}
