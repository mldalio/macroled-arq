// Entrada al hacer scroll (docs/decisiones.md, 2026-10-06 · Entrada al hacer
// scroll en el Home): cada elemento sube y aparece cuando entra en pantalla,
// una sola vez. Lo hace el componente, no la página, para que funcione igual
// en el embed de Webflow.
// El escalón se cuenta dentro de lo que entra junto (los que se ven al mismo
// tiempo), no en toda la lista: una card que aparece al bajar no espera a las
// de arriba. Con tope de MAX_STEP escalones, así una grilla llena no tarda.
// Al terminar se quitan las clases: si el elemento se vuelve a insertar
// (catalog-listing reusa las cards al filtrar) no repite la entrada.
// Mientras arq-preloader tapa la página, espera: la entrada arranca cuando el
// preloader se va (si no, lo que está arriba entraba debajo y no se veía).
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

const MAX_STEP = 5;

/** true mientras arq-preloader tapa la página. */
export function covered() {
  return Boolean(document.querySelector('arq-preloader[open]'));
}

function whenUncovered(callback) {
  const preloader = document.querySelector('arq-preloader[open]');
  if (!preloader) {
    callback();
    return;
  }
  const watch = new MutationObserver(() => {
    if (preloader.hasAttribute('open')) return;
    watch.disconnect();
    callback();
  });
  watch.observe(preloader, { attributes: true, attributeFilter: ['open'] });
}

function settle(event) {
  if (event.target !== event.currentTarget || event.animationName !== 'arq-reveal') return;
  const target = event.currentTarget;
  target.classList.remove('reveal', 'revealed');
  target.style.removeProperty('--reveal-index');
  target.removeEventListener('animationend', settle);
}

export function reveal(targets) {
  if (!targets.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;
  const observer = new IntersectionObserver(
    (entries) => {
      let step = 0;
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.style.setProperty('--reveal-index', String(Math.min(step++, MAX_STEP)));
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.15 },
  );
  // Si se desconecta antes de que se vaya el preloader, no empieza a observar
  let live = true;
  const disconnect = observer.disconnect.bind(observer);
  observer.disconnect = () => {
    live = false;
    disconnect();
  };
  for (const target of targets) {
    target.classList.add('reveal');
    target.addEventListener('animationend', settle);
  }
  whenUncovered(() => {
    if (live) for (const target of targets) observer.observe(target);
  });
  return observer;
}

export { revealCss };
