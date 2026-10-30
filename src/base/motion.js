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
