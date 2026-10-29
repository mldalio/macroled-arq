// preloader · sin set en Figma
//
// Pantalla blanca de entrada: el logo de Macroled Arq y una línea debajo,
// del mismo ancho, que se completa de izquierda a derecha.
//
//   <arq-preloader open></arq-preloader>         vista (la línea se recorre sola)
//   <arq-preloader open page></arq-preloader>    tapa la página hasta que cargan
//                                                imágenes, videos y textos
//
// - Siempre en Light (data-arq-theme="light"): el pedido es fondo blanco,
//   también si la página está en Dark.
// - El logo no es link: es el mismo dibujo de src/base/logo-paths.js.
// - Sin page: al terminar la línea espera motion/duration/panel y emite
//   arq:done. Quién lo muestra saca open.
// - Con page: la línea es la parte ya cargada (src/base/page-ready.js). No espera
//   las imágenes lazy, el video decorativo ni los destacados. Se va cuando no
//   queda nada pendiente. Tope de 20 s para no trabar la página si un recurso
//   no responde.
//   TODO (diseño): no hay token para ese tope.

import { ArqElement } from '../../base/arq-element.js';
import { LOGO_PATHS } from '../../base/logo-paths.js';
import { pageProgress } from '../../base/page-ready.js';
import css from './preloader.css?inline';

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)');
// Tope si un recurso no responde. No es un token: no es una medida de diseño.
const PAGE_LIMIT = 20000;
const QUIET_FRAMES = 2;

const mark =
  `<svg class="mark" viewBox="0 0 181 16" fill="currentColor" aria-hidden="true" focusable="false">` +
  LOGO_PATHS.map((d) => `<path d="${d}"/>`).join('') +
  `</svg>`;

class ArqPreloader extends ArqElement {
  static tag = 'arq-preloader';
  static styles = css;
  static properties = {
    open: { type: Boolean },
    page: { type: Boolean }, // tapa la página hasta que cargue
  };
  static template =
    `<div class="cluster">` +
    mark +
    `<span class="track" aria-hidden="true"><span class="line"></span></span>` +
    `<p class="status visually-hidden" role="status"></p>` +
    `</div>`;

  #run = 0;
  #hold = 0;
  #watching = false;
  #shown = 0;
  #inerted = new Set();
  #blockScroll = (event) => event.preventDefault();

  setup() {
    // Light local: el fondo queda blanco aunque la página esté en Dark
    this.setAttribute('data-arq-theme', 'light');
    this.setAttribute('aria-hidden', 'true');
  }

  disconnectedCallback() {
    window.clearTimeout(this.#hold);
    this.#scroll(false);
    this.#run += 1;
  }

  update(changed) {
    if (!changed.has('open') && !changed.has('page')) return;
    const status = this.shadowRoot.querySelector('.status');
    if (this.open && this.page) {
      this.#announce();
      this.#scroll(true);
      this.#watch();
      return;
    }
    if (!changed.has('open')) return;
    if (this.open) {
      this.#announce();
      this.#play();
    } else {
      this.setAttribute('aria-hidden', 'true');
      status.textContent = '';
      this.#scroll(false);
      this.#stop();
    }
  }

  #scroll(on) {
    window.removeEventListener('wheel', this.#blockScroll);
    window.removeEventListener('touchmove', this.#blockScroll);
    if (!on) {
      for (const el of this.#inerted) el.removeAttribute('inert');
      this.#inerted.clear();
      return;
    }
    window.addEventListener('wheel', this.#blockScroll, { passive: false });
    window.addEventListener('touchmove', this.#blockScroll, { passive: false });
    // Inert todo lo que no contiene al preloader: los hermanos de cada nivel,
    // de él hasta <body>. En Webflow va dentro de un div.w-embed; marcar ese
    // ancestro lo dejaría inert también a él (y a su aviso).
    for (let node = this; node && node !== document.body && node.parentElement; node = node.parentElement) {
      for (const sibling of node.parentElement.children) {
        if (sibling === node || this.#inerted.has(sibling) || sibling.hasAttribute('inert')) continue;
        if (sibling.localName === 'script' || sibling.localName === 'style') continue;
        sibling.setAttribute('inert', '');
        this.#inerted.add(sibling);
      }
    }
  }

  // Región viva (DESIGN.md §9): primero el preloader entra al árbol de
  // accesibilidad (sin aria-hidden) con el aviso vacío, y en el frame
  // siguiente cambia el texto, así se anuncia. Sin aria-busy en el host: haría
  // esperar el aviso de adentro.
  #announce() {
    const status = this.shadowRoot.querySelector('.status');
    this.removeAttribute('aria-hidden');
    status.textContent = '';
    requestAnimationFrame(() => {
      if (this.open) status.textContent = 'Cargando';
    });
  }

  #progress(value) {
    const next = Math.min(1, Math.max(this.#shown, value));
    this.#shown = next;
    this.shadowRoot.querySelector('.line').style.setProperty('--progress', String(next));
  }

  #watch() {
    if (this.#watching) return;
    this.#watching = true;
    const run = ++this.#run;
    const started = performance.now();
    let quiet = 0;
    const tick = () => {
      if (run !== this.#run || !this.open) return;
      this.#scroll(true);
      const { done, total, waiting } = pageProgress();
      const ratio = total ? done / total : 1;
      this.#progress(waiting ? Math.min(ratio, 0.92) : ratio);
      const timedOut = performance.now() - started > PAGE_LIMIT;
      if (!waiting || timedOut) quiet += 1;
      else quiet = 0;
      if (quiet < QUIET_FRAMES) {
        requestAnimationFrame(tick);
        return;
      }
      const already = this.#shown >= 1;
      this.#progress(1);
      const line = this.shadowRoot.querySelector('.line');
      const close = () => {
        if (run !== this.#run || !this.open) return;
        this.#run += 1;
        this.open = false;
      };
      if (REDUCED.matches || already) {
        requestAnimationFrame(close);
        return;
      }
      line.addEventListener(
        'transitionend',
        (event) => {
          if (event.propertyName === 'transform') close();
        },
        { once: true },
      );
      const ms = Number.parseFloat(getComputedStyle(line).transitionDuration) * 1000 || 0;
      this.#hold = window.setTimeout(close, ms + 40);
    };
    requestAnimationFrame(tick);
  }

  #play() {
    const line = this.shadowRoot.querySelector('.line');
    const run = ++this.#run;
    window.clearTimeout(this.#hold);
    line.classList.remove('run');
    void line.offsetWidth;
    if (!this.open || run !== this.#run) return;
    line.classList.add('run');
    if (REDUCED.matches) {
      this.#finish(run);
      return;
    }
    line.addEventListener(
      'animationend',
      (event) => {
        if (event.animationName !== 'arq-preloader-line') return;
        this.#finish(run);
      },
      { once: true },
    );
  }

  #finish(run) {
    const hold = Number.parseFloat(getComputedStyle(this).getPropertyValue('--arq-motion-duration-panel')) || 0;
    this.#hold = window.setTimeout(() => {
      if (run !== this.#run || !this.open) return;
      this.emit('done', {});
    }, hold);
  }

  #stop() {
    window.clearTimeout(this.#hold);
    this.#run += 1;
    this.shadowRoot.querySelector('.line').classList.remove('run');
  }
}

ArqPreloader.define();

export { ArqPreloader };
