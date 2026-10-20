// featured-products · contenedor de página (Home de Final: productos-destacados
// 1203:9846 · 1204:10062)
//
// Productos elegidos a mano. El embed lista un link por grupo
// (PRODUCT_GROUP_ID en data-group) y el componente arma las product-card con
// los datos del catálogo (nombre, meta e imágenes), en el mismo orden.
//
//   <arq-featured-products>
//     <a href="/arq/producto/kanu-jardin" data-group="kanu-jardin">Kanu Jardín</a>
//     <a href="/arq/producto/douli-colgante" data-group="douli-colgante">Douli</a>
//   </arq-featured-products>
//
// - Los links quedan en el HTML de la página (indexables) y son la reserva: si
//   el catálogo no carga o ningún grupo existe, se muestran como lista.
// - Como el navbar, es un contenedor que consulta por src/data/ (decisiones.md,
//   2026-10-02 · Home); las product-card que muestra reciben datos.
// - Home v2: el slot intro (texto) queda a la izquierda y las tarjetas van en
//   una fila con scroll (slider). Autoplay: una tarjeta por intervalo; se
//   pausa solo al hacer hover (o foco) en una product-card, al deslizar,
//   fuera de pantalla o prefers-reduced-motion.
//   TODO (diseño): no hay token de intervalo; se usa motion/duration/feedback × 2.
// - Se desliza con el dedo o arrastrando con el mouse. Un toque sigue
//   abriendo la ficha; si hubo desplazamiento, ese clic no navega.
// - Entrada al hacer scroll (src/base/reveal.js), escalonada por tarjeta.

import { ArqElement } from '../../base/arq-element.js';
import { reveal, revealCss } from '../../base/reveal.js';
import { getProductCards } from '../../data/catalog.js';
import '../product-card/product-card.js';
import '../carousel-controls/carousel-controls.js';
import css from './featured-products.css?inline';

class ArqFeaturedProducts extends ArqElement {
  static tag = 'arq-featured-products';
  static styles = revealCss + css;
  static properties = {
    layout: { type: String, values: ['side', 'stacked'], default: 'side' }, // side: texto al lado. stacked: título arriba y tarjetas debajo
  };
  static template =
    `<div class="layout">` +
    `<div class="intro">` +
    `<slot name="intro"></slot>` +
    `<arq-carousel-controls class="controls" buttons="carousel" for="featured-rail" step="item" label-prev="Productos anteriores" label-next="Productos siguientes"></arq-carousel-controls>` +
    `</div>` +
    `<div class="rail" id="featured-rail"></div>` +
    `</div>` +
    `<div class="fallback role-body" hidden><slot></slot></div>`;

  #groups = '';
  #request = 0;
  #reveal = null;
  #timer = 0;
  #inView = false;
  #hover = false;
  #drag = null;
  #suppressClick = false;
  #suppressTimer = 0;
  #reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  #onVisibility = () => this.#syncAutoplay();
  #onReduced = () => this.#syncAutoplay();
  #io = new IntersectionObserver(([entry]) => {
    this.#inView = entry.isIntersecting;
    this.#syncAutoplay();
  });

  setup() {
    this.shadowRoot.querySelector('.fallback slot').addEventListener('slotchange', () => this.#load());
    const rail = this.shadowRoot.querySelector('.rail');
    rail.addEventListener('pointerenter', (event) => this.#onCardPointer(event, true), true);
    rail.addEventListener('pointerleave', (event) => this.#onCardPointer(event, false), true);
    rail.addEventListener('pointerdown', (event) => this.#dragStart(event));
    rail.addEventListener('pointermove', (event) => this.#dragMove(event));
    rail.addEventListener('pointerup', (event) => this.#dragEnd(event));
    rail.addEventListener('pointercancel', (event) => this.#dragEnd(event));
    rail.addEventListener('dragstart', (event) => event.preventDefault());
    rail.addEventListener(
      'click',
      (event) => {
        if (!this.#suppressClick) return;
        this.#suppressClick = false;
        window.clearTimeout(this.#suppressTimer);
        event.preventDefault();
        event.stopPropagation();
      },
      true,
    );
    rail.addEventListener('focusin', () => this.#syncAutoplay());
    rail.addEventListener('focusout', () => queueMicrotask(() => this.#syncAutoplay()));
    this.#reducedMotion.addEventListener('change', this.#onReduced);
    document.addEventListener('visibilitychange', this.#onVisibility);
    this.#io.observe(this);
    this.#load();
  }

  disconnectedCallback() {
    this.#stop();
    window.clearTimeout(this.#suppressTimer);
    this.#io.disconnect();
    this.#reducedMotion.removeEventListener('change', this.#onReduced);
    document.removeEventListener('visibilitychange', this.#onVisibility);
  }

  async #load() {
    const groups = [...this.querySelectorAll(':scope > a[data-group]')].map((link) => link.dataset.group.trim()).filter(Boolean);
    const key = groups.join('\n');
    if (key === this.#groups) return;
    this.#groups = key;

    const request = ++this.#request;
    this.setAttribute('aria-busy', 'true');
    let cards = [];
    try {
      cards = groups.length ? await getProductCards(groups) : [];
    } catch (error) {
      console.error('[arq] featured-products: no se pudo cargar el catálogo', error);
    }
    if (request !== this.#request) return;
    this.removeAttribute('aria-busy');
    this.#render(cards);
  }

  #render(cards) {
    const root = this.shadowRoot;
    const rail = root.querySelector('.rail');
    const elements = cards.map((card) => this.#card(card));
    rail.replaceChildren(...elements);
    this.#reveal?.disconnect();
    this.#reveal = reveal(elements);
    rail.hidden = cards.length === 0;
    root.querySelector('.controls').hidden = cards.length === 0;
    root.querySelector('.fallback').hidden = cards.length > 0;
    this.#syncAutoplay();
  }

  #cardFrom(node) {
    if (!node || node.nodeType !== Node.ELEMENT_NODE) return null;
    if (node.localName === 'arq-product-card') return node;
    const host = node.getRootNode?.()?.host;
    if (host?.localName === 'arq-product-card') return host;
    return node.closest?.('arq-product-card') ?? null;
  }

  #onCardPointer(event, entering) {
    if (!this.#cardFrom(event.target)) return;
    if (!entering && this.#cardFrom(event.relatedTarget)) return;
    this.#hover = entering;
    this.#syncAutoplay();
  }

  #cardHasFocus() {
    const active = this.shadowRoot.activeElement;
    return Boolean(this.#cardFrom(active));
  }

  #interval() {
    const ms = Number.parseFloat(getComputedStyle(this).getPropertyValue('--arq-motion-duration-feedback')) || 2000;
    return ms * 2;
  }

  #syncAutoplay() {
    const rail = this.shadowRoot.querySelector('.rail');
    const canPlay =
      !rail.hidden &&
      this.#inView &&
      !this.#hover &&
      !this.#drag &&
      !this.#cardHasFocus() &&
      !this.#reducedMotion.matches &&
      document.visibilityState === 'visible' &&
      rail.scrollWidth - rail.clientWidth > 1;
    if (canPlay) this.#play();
    else this.#stop();
  }

  #play() {
    if (this.#timer) return;
    this.#timer = window.setInterval(() => this.#advance(), this.#interval());
  }

  #stop() {
    window.clearInterval(this.#timer);
    this.#timer = 0;
  }

  #step() {
    const rail = this.shadowRoot.querySelector('.rail');
    const card = rail.firstElementChild;
    if (!card) return 0;
    const gap = Number.parseFloat(getComputedStyle(rail).columnGap || getComputedStyle(rail).gap) || 0;
    return card.offsetWidth + gap;
  }

  #dragStart(event) {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    const rail = event.currentTarget;
    if (rail.scrollWidth - rail.clientWidth <= 1) return;
    this.#drag = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      left: rail.scrollLeft,
      lastX: event.clientX,
      lastT: event.timeStamp,
      vx: 0,
      moved: false,
      axis: null,
    };
    this.#syncAutoplay();
  }

  #dragMove(event) {
    if (!this.#drag || event.pointerId !== this.#drag.id) return;
    const dx = event.clientX - this.#drag.x;
    const dy = event.clientY - this.#drag.y;
    if (!this.#drag.axis) {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      this.#drag.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
    }
    if (this.#drag.axis !== 'x') return;
    const rail = this.shadowRoot.querySelector('.rail');
    if (!this.#drag.moved) {
      this.#drag.moved = true;
      rail.setPointerCapture(event.pointerId);
      rail.setAttribute('data-dragging', '');
    }
    const dt = Math.max(event.timeStamp - this.#drag.lastT, 1);
    this.#drag.vx = (event.clientX - this.#drag.lastX) / dt;
    this.#drag.lastX = event.clientX;
    this.#drag.lastT = event.timeStamp;
    event.preventDefault();
    rail.scrollLeft = this.#drag.left - dx;
  }

  #dragEnd(event) {
    if (!this.#drag || event.pointerId !== this.#drag.id) return;
    const drag = this.#drag;
    this.#drag = null;
    const rail = this.shadowRoot.querySelector('.rail');
    rail.removeAttribute('data-dragging');
    if (drag.moved && event.type === 'pointerup') {
      this.#suppressClick = true;
      window.clearTimeout(this.#suppressTimer);
      this.#suppressTimer = window.setTimeout(() => {
        this.#suppressClick = false;
      }, 400);
      this.#snap(drag.vx);
    }
    this.#syncAutoplay();
  }

  #snap(velocity) {
    const rail = this.shadowRoot.querySelector('.rail');
    const step = this.#step();
    if (!step) return;
    const max = rail.scrollWidth - rail.clientWidth;
    let left = rail.scrollLeft;
    if (Math.abs(velocity) > 0.4) left -= Math.sign(velocity) * step;
    const index = Math.round(left / step);
    rail.scrollTo({
      left: Math.min(max, Math.max(0, index * step)),
      behavior: this.#reducedMotion.matches ? 'auto' : 'smooth',
    });
  }

  #advance() {
    if (this.#drag) return;
    const rail = this.shadowRoot.querySelector('.rail');
    const max = rail.scrollWidth - rail.clientWidth;
    if (max <= 1) return;
    if (rail.scrollLeft >= max - 1) {
      rail.scrollTo({ left: 0, behavior: this.#reducedMotion.matches ? 'auto' : 'smooth' });
      return;
    }
    this.shadowRoot.querySelector('.controls').go(1);
  }

  #card({ name, meta, href, image, imageHover, imageLit, imageHoverLit }) {
    const card = document.createElement('arq-product-card');
    card.href = href;
    card.showCursor = true;
    card.image = image;
    card.imageHover = imageHover;
    card.imageLit = imageLit;
    card.imageHoverLit = imageHoverLit;
    const title = document.createElement('h3');
    title.slot = 'name';
    title.textContent = name;
    card.append(title);
    if (meta) {
      const text = document.createElement('span');
      text.slot = 'meta';
      text.textContent = meta;
      card.append(text);
    }
    return card;
  }
}

ArqFeaturedProducts.define();

export { ArqFeaturedProducts };
