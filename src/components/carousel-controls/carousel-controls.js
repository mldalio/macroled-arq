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
// - progress="scroll" (solo con buttons="carousel"): en lugar de un tramo por slide,
//   la línea muestra qué parte del contenido se ve (el trazo mide lo que el ancho
//   visible sobre el total y se mueve con el scrollLeft), sin contador. Es la de
//   variants-table. Si no hay nada para desplazar, la línea no se muestra.
// - page-inset: ancho que tapan las columnas fijas de una tabla; cada salto de
//   página mide el ancho visible menos ese valor, así no se saltea contenido.
// - Con prefers-reduced-motion el salto es instantáneo.
// - El contenedor (snap, peek) no es parte del componente: TODO (páginas).

import { ArqElement } from '../../base/arq-element.js';
import '../icon-button/icon-button.js';
import '../carousel-button/carousel-button.js';
import css from './carousel-controls.css?inline';

const POSITIONS = ['start', 'middle', 'end'];

class ArqCarouselControls extends ArqElement {
  static tag = 'arq-carousel-controls';
  static styles = css;
  static properties = {
    position: { type: String, values: POSITIONS, default: 'start' }, // Position
    for: { type: String }, // id del contenedor con scroll
    step: { type: String, values: ['page', 'item'], default: 'page' }, // page: un ancho visible; item: una tarjeta
    labelPrev: { type: String, default: 'Anterior' },
    labelNext: { type: String, default: 'Siguiente' },
    // Solo código. icon: icon-button Large (Colección). carousel: carousel-button
    // de Figma (Destacados y Proyectos de la Home). chevron: solo el chevron, sin
    // borde ni fondo (icon-button Large Background=None: el área clickeable es la
    // del botón). none: sin flechas, solo la línea de progreso (con progress="scroll":
    // variants-table).
    buttons: { type: String, values: ['icon', 'carousel', 'chevron', 'none'], default: 'icon' },
    progress: { type: String, values: ['slides', 'scroll'], default: 'slides' }, // solo código: qué mide la línea (tramo por slide o parte visible)
    pageInset: { type: Number, default: 0 }, // solo código: ancho tapado por columnas fijas, se resta al salto de página
    index: { type: Number, default: 0 }, // slide actual, desde 0
    count: { type: Number, default: 1 }, // cantidad de slides
  };
  static template =
    `<div class="controls" role="group">` +
    `<p class="count role-caption" hidden></p>` +
    `<div class="progress" hidden><span class="track"></span><span class="indicator"></span></div>` +
    `<div class="arrows">` +
    `<arq-icon-button class="prev icon" size="large" icon="arrow-left"></arq-icon-button>` +
    `<arq-carousel-button class="prev square" direction="previous" hidden></arq-carousel-button>` +
    `<arq-icon-button class="next icon" size="large" icon="arrow-right"></arq-icon-button>` +
    `<arq-carousel-button class="next square" direction="next" hidden></arq-carousel-button>` +
    `<arq-icon-button class="prev chevron" size="large" icon="chevron-left" hidden></arq-icon-button>` +
    `<arq-icon-button class="next chevron" size="large" icon="chevron-right" hidden></arq-icon-button>` +
    `</div>` +
    `</div>`;

  #target = null;
  #watching = false;
  #scrollable = true;
  #onScroll = () => this.#syncFromScroll();
  #resize = new ResizeObserver(() => this.#syncFromScroll());
  // Elementos que entran al carrusel (cards, fotos que arma la página)
  #children = new MutationObserver(() => this.#observeChildren());
  #reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  setup() {
    const root = this.shadowRoot;
    for (const button of root.querySelectorAll('.prev')) button.addEventListener('click', () => this.#go(-1));
    for (const button of root.querySelectorAll('.next')) button.addEventListener('click', () => this.#go(1));
  }

  /** El par visible: icon-button o carousel-button. */
  #pair() {
    const kind = { carousel: 'square', chevron: 'chevron' }[this.buttons] ?? 'icon';
    const root = this.shadowRoot;
    return {
      prev: root.querySelector(`.prev.${kind}`),
      next: root.querySelector(`.next.${kind}`),
    };
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
    for (const kind of ['icon', 'square', 'chevron']) {
      const shown = this.buttons !== 'none' && (this.buttons === 'carousel' ? 'square' : this.buttons === 'chevron' ? 'chevron' : 'icon') === kind;
      for (const button of root.querySelectorAll(`.${kind}`)) button.hidden = !shown;
    }
    const { prev, next } = this.#pair();
    if (changed.has('labelPrev') || changed.has('buttons')) {
      for (const button of root.querySelectorAll('.prev')) button.textContent = this.labelPrev;
    }
    if (changed.has('labelNext') || changed.has('buttons')) {
      for (const button of root.querySelectorAll('.next')) button.textContent = this.labelNext;
    }
    root.querySelector('.controls').setAttribute('aria-label', `${this.labelPrev} / ${this.labelNext}`);
    this.#progress();

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
    // Además del carrusel, cada elemento de adentro: una foto de ancho auto que
    // carga (o llega de la caché) agranda el contenido sin cambiar el tamaño
    // del carrusel, y el ResizeObserver del carrusel solo no lo ve.
    this.#resize.observe(target);
    this.#children.observe(target, { childList: true });
    this.#observeChildren();
    // aria-controls hacia el carrusel (los botones están dentro de icon-button)
    const tag = this.buttons === 'carousel' ? 'arq-carousel-button' : 'arq-icon-button';
    customElements.whenDefined(tag).then(() => {
      for (const button of this.shadowRoot.querySelectorAll(tag)) {
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
    this.#children.disconnect();
    this.#resize.disconnect();
  }

  #observeChildren() {
    for (const child of this.#target?.children ?? []) this.#resize.observe(child);
    this.#syncFromScroll();
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
      this.#pair().next.disabled = !scrollable || position === 'end';
    }
    if (position !== this.position) this.position = position;
    if (this.progress === 'scroll' && this.buttons !== 'icon') this.#progressByScroll(target, scrollable);
    else if (this.buttons === 'carousel') this.#progressFromScroll(target);
  }

  /** Línea de variants-table: el trazo es la parte visible del contenido. */
  #progressByScroll(target, scrollable) {
    const root = this.shadowRoot;
    const progress = root.querySelector('.progress');
    root.querySelector('.count').hidden = true;
    progress.hidden = !scrollable;
    progress.dataset.mode = 'scroll';
    progress.setAttribute('aria-hidden', 'true');
    for (const attribute of ['role', 'aria-valuemin', 'aria-valuemax', 'aria-valuenow', 'aria-valuetext']) progress.removeAttribute(attribute);
    if (!scrollable) return;
    const size = Math.min(1, target.clientWidth / target.scrollWidth);
    const offset = target.scrollLeft / target.scrollWidth;
    progress.style.setProperty('--progress-size', String(size));
    progress.style.setProperty('--progress-offset', String(offset));
  }

  /** La línea de Home: un tramo por slide, sobre la pista. */
  #progress() {
    const root = this.shadowRoot;
    const count = Math.max(this.count || 1, 1);
    const index = Math.min(Math.max(this.index || 0, 0), count - 1);
    if (this.progress === 'scroll') return; // la línea la arma #progressByScroll
    const show = this.buttons === 'carousel' && count > 1;
    const countEl = root.querySelector('.count');
    const progress = root.querySelector('.progress');
    countEl.hidden = !show;
    progress.hidden = !show;
    const current = String(index + 1).padStart(2, '0');
    const total = String(count).padStart(2, '0');
    countEl.textContent = `${current} / ${total}`;
    progress.style.setProperty('--progress-count', String(count));
    progress.style.setProperty('--progress-index', String(index));
    progress.setAttribute('role', 'progressbar');
    progress.setAttribute('aria-valuemin', '1');
    progress.setAttribute('aria-valuemax', String(count));
    progress.setAttribute('aria-valuenow', String(index + 1));
    progress.setAttribute('aria-valuetext', `${index + 1} de ${count}`);
  }

  #progressFromScroll(target) {
    const children = [...target.children];
    const count = Math.max(children.length, 1);
    // El contador sigue el recorrido, no la tarjeta que queda a la izquierda: con varias
    // tarjetas a la vista el scroll llega al final antes de la última tarjeta, y así la
    // última posición (y la flecha siguiente deshabilitada) es siempre "05 / 05".
    const max = target.scrollWidth - target.clientWidth;
    const index = max <= 1 ? 0 : Math.min(count - 1, Math.max(0, Math.round((target.scrollLeft / max) * (count - 1))));
    if (this.count !== count) this.count = count;
    if (this.index !== index) this.index = index;
    else this.#progress();
  }

  /** Avanza o retrocede un paso (page o item). Lo usa el autoplay del Home. */
  go(direction) {
    this.#go(direction);
  }

  #go(direction) {
    const target = this.#target;
    if (!target) {
      this.emit(direction < 0 ? 'prev' : 'next');
      return;
    }
    const item = this.step === 'item' ? target.children[0] : null;
    const gap = item ? Number.parseFloat(getComputedStyle(target).columnGap || getComputedStyle(target).gap) || 0 : 0;
    const amount = item ? item.getBoundingClientRect().width + gap : Math.max(target.clientWidth - (this.pageInset || 0), 1);
    target.scrollBy({
      left: direction * amount,
      behavior: this.#reducedMotion.matches ? 'auto' : 'smooth',
    });
  }
}

ArqCarouselControls.define();

export { ArqCarouselControls };
