// Entrada al hacer scroll (docs/decisiones.md, 2026-10-06 · Entrada al hacer
// scroll en el Home): cada elemento sube y aparece cuando entra en pantalla,
// una sola vez, escalonado según su lugar en la lista. Lo hace el componente,
// no la página, para que funcione igual en el embed de Webflow.
// Los elementos van en el Shadow DOM del componente, que suma revealCss a sus
// estilos. Sin JS o con prefers-reduced-motion se ven quietos.
//
//   import { reveal, revealCss } from '../../base/reveal.js';
//   static styles = revealCss + css;
//   setup() { this.#reveal = reveal([image, content]); }
//
// Devuelve el IntersectionObserver (para desconectarlo si los elementos se
// reemplazan) o null si no anima.

import revealCss from './reveal.css?inline';

export function reveal(targets, { start = 0 } = {}) {
  if (!targets.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.15 },
  );
  targets.forEach((target, i) => {
    target.style.setProperty('--reveal-index', String(start + i));
    target.classList.add('reveal');
    observer.observe(target);
  });
  return observer;
}

export { revealCss };
