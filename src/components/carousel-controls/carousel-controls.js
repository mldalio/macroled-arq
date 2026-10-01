// carousel-controls · Figma 1410:17825 · ficha doc/carousel-controls (1452:6289)
//
// Flechas anterior / siguiente de un carrusel con scroll horizontal (mosaico
// de Colección, proyectos del Home). Solo Desktop: en Mobile no se muestran
// (el carrusel se desliza y la imagen siguiente asoma).
//
//   <arq-carousel-controls for="proyectos"></arq-carousel-controls>
//   <div id="proyectos"> … tarjetas con overflow-x y scroll-snap … </div>
//
// - for: id del contenedor con scroll (en el DOM de la página). El componente
//   hace scrollBy de un ancho visible y el snap del carrusel lo alinea.
// - Position (Start · Middle · End) se calcula sola con el scrollLeft: en
//   Start la anterior está deshabilitada; en End, la siguiente. Sin for (o si
//   el carrusel no existe) position queda como esté en el atributo.
// - Si la flecha con foco se deshabilita, el foco pasa a la otra.
// - aria-controls con ariaControlsElements: un id del DOM de la página no se
//   puede referenciar desde el Shadow DOM.
// - Con prefers-reduced-motion el salto es instantáneo.
// - El contenedor (snap, peek) no es parte del componente: TODO (páginas).

import { ArqElement } from '../../base/arq-element.js';
import '../icon-button/icon-button.js';
import css from './carousel-controls.css?inline';

const POSITIONS = ['start', 'middle', 'end'];

class ArqCarouselControls extends ArqElement {
  static tag = 'arq-carousel-controls';
  static styles = css;
  static properties = {
    position: { type: String, values: POSITIONS, default: 'start' }, // Position
    for: { type: String }, // id del contenedor con scroll
    labelPrev: { type: String, default: 'Anterior' },
    labelNext: { type: String, default: 'Siguiente' },
  };
  static template =
    `<div class="controls" role="group">` +
    `<arq-icon-button class="prev" size="large" icon="arrow-left"></arq-icon-button>` +
    `<arq-icon-button class="next" size="large" icon="arrow-right"></arq-icon-button>` +
    `</div>`;

  #target = null;
  #watching = false;
  #scrollable = true;
  #onScroll = () => this.#syncFromScroll();
  #resize = new ResizeObserver(() => this.#syncFromScroll());
  #reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  setup() {
    const root = this.shadowRoot;
    root.querySelector('.prev').addEventListener('click', () => this.#go(-1));
    root.querySelector('.next').addEventListener('click', () => this.#go(1));
  }

  // ArqElement corre setup() y update() solo en la primera conexión; si el
  // elemento se mueve en el DOM, se vuelve a escuchar el carrusel.
  connectedCallback() {
    super.connectedCallback();
    if (this.#target && !this.#watching) this.#watch(this.#target);
  }

  disconnectedCallback() {
    this.#unwatch();
  }

  update(changed) {
    const root = this.shadowRoot;
    const prev = root.querySelector('.prev');
    const next = root.querySelector('.next');
    if (changed.has('labelPrev')) prev.textContent = this.labelPrev;
    if (changed.has('labelNext')) next.textContent = this.labelNext;
    root.querySelector('.controls').setAttribute('aria-label', `${this.labelPrev} / ${this.labelNext}`);

    if (changed.has('for')) this.#connectTarget();

    const focused = root.activeElement;
    prev.disabled = this.position === 'start';
    next.disabled = this.position === 'end' || !this.#scrollable;
    // La flecha con foco quedó deshabilitada: el foco pasa a la otra.
    if (focused === prev && prev.disabled) next.focus();
    if (focused === next && next.disabled) prev.focus();
  }

  #connectTarget() {
    this.#unwatch();
    const target = this.for ? this.getRootNode().getElementById?.(this.for) : null;
    if (this.for && !target) {
      // El carrusel puede estar después en el HTML: se busca otra vez al
      // terminar de cargar la página.
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.#connectTarget(), { once: true });
      } else if (import.meta.env.DEV) {
        console.warn(`[arq] <arq-carousel-controls for="${this.for}">: no hay un elemento con ese id.`);
      }
    }
    this.#target = target;
    if (target) this.#watch(target);
  }

  #watch(target) {
    this.#watching = true;
    target.addEventListener('scroll', this.#onScroll, { passive: true });
    this.#resize.observe(target);
    // aria-controls hacia el carrusel (los botones están dentro de icon-button)
    customElements.whenDefined('arq-icon-button').then(() => {
      for (const button of this.shadowRoot.querySelectorAll('arq-icon-button')) {
        const control = button.shadowRoot?.querySelector('button');
        if (control && 'ariaControlsElements' in control) control.ariaControlsElements = [target];
      }
    });
    this.#syncFromScroll();
  }

  #unwatch() {
    if (!this.#target || !this.#watching) return;
    this.#watching = false;
    this.#target.removeEventListener('scroll', this.#onScroll);
    this.#resize.unobserve(this.#target);
  }

  #syncFromScroll() {
    const target = this.#target;
    if (!target) return;
    const max = target.scrollWidth - target.clientWidth;
    // 1 px de margen por redondeos del scroll con zoom o snap
    const position = max <= 1 ? 'start' : target.scrollLeft <= 1 ? 'start' : target.scrollLeft >= max - 1 ? 'end' : 'middle';
    // Sin nada para desplazar, las dos flechas quedan deshabilitadas
    const scrollable = max > 1;
    if (scrollable !== this.#scrollable) {
      this.#scrollable = scrollable;
      this.shadowRoot.querySelector('.next').disabled = !scrollable || position === 'end';
    }
    if (position !== this.position) this.position = position;
  }

  #go(direction) {
    const target = this.#target;
    if (!target) {
      this.emit(direction < 0 ? 'prev' : 'next');
      return;
    }
    target.scrollBy({
      left: direction * target.clientWidth,
      behavior: this.#reducedMotion.matches ? 'auto' : 'smooth',
    });
  }
}

ArqCarouselControls.define();

export { ArqCarouselControls };
