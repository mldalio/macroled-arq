// Tiempos de los tokens de movimiento en JS.
//
// El CSS publicado (dist/arq.css) sale minificado y escribe los tiempos en
// segundos: --arq-motion-duration-slow llega como «.32s», no «320ms» como en la
// demo. Number.parseFloat solo daba 0,32 ms y la animación saltaba de golpe.
//
//   import { toMs } from '../../base/motion.js';
//   const duration = toMs(styles.getPropertyValue('--arq-motion-duration-panel')) || 0;

/** Un tiempo CSS («320ms», «.32s», «0s») en ms. NaN si está vacío (para el || de respaldo). */
export function toMs(value) {
  const raw = String(value).trim();
  const number = Number.parseFloat(raw);
  return raw.endsWith('ms') ? number : number * 1000;
}

/** Valor de un token de movimiento de `element` en ms («--arq-motion-duration-fade»). 0 si no está. */
export function tokenMs(element, name) {
  return toMs(getComputedStyle(element).getPropertyValue(name)) || 0;
}

/** La transición más larga de `element` en ms (transition-duration con varios valores): cuándo termina un cierre. */
export function transitionMs(element) {
  return Math.max(0, ...getComputedStyle(element).transitionDuration.split(',').map((value) => toMs(value) || 0));
}
