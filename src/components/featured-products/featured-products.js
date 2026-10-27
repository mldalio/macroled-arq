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
// - Mientras carga, una product-card loading por link (el mismo skeleton del
//   listado de Productos). Aparecen con un fundido corto y demorado: con el
//   catálogo en caché no llegan a verse. Si ya se veían, las cards ocupan su
//   lugar sin la entrada al hacer scroll (lo que aparece es la foto).
// - Como el navbar, es un contenedor que consulta por src/data/ (decisiones.md,
//   2026-10-02 · Home); las product-card que muestra reciben datos.
// - Home v2: el slot intro (texto) queda a la izquierda y las tarjetas van en
//   una fila con scroll (slider). Autoplay: una tarjeta por intervalo. Se
//   detiene con el mouse encima o el foco adentro (tarjetas y flechas), y no
//   vuelve mientras siga así (WCAG 2.2.2); también al deslizar, fuera de
//   pantalla o con prefers-reduced-motion.
//   TODO (diseño): falta un botón de pausa visible (no hay ícono de pausa en el set).
//   El paso usa la misma transición que Casa FOA (motion/duration/slow y
//   motion/easing/standard) y la misma pausa (3 s). No hay token de intervalo.
// - Se desliza con el dedo o arrastrando con el mouse. Un toque sigue
//   abriendo la ficha; si hubo desplazamiento, ese clic no navega.
// - Entrada al hacer scroll (src/base/reveal.js), escalonada por tarjeta.

import { ArqElement } from '../../base/arq-element.js';
import { covered, reveal, revealCss } from '../../base/reveal.js';
import { getProductCards } from '../../data/catalog.js';
import '../product-card/product-card.js';
import '../carousel-controls/carousel-controls.js';
import css from './featured-products.css?inline';

const VELOCITY_WINDOW = 100; // ms de arrastre que cuentan para la velocidad al soltar

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
    `<arq-carousel-controls class="controls" buttons="carousel" progress="scroll" slide="slow" for="featured-rail" step="item" label-prev="Productos anteriores" label-next="Productos siguientes"></arq-carousel-controls>` +
    `</div>` +
    `<div class="rail" id="featured-rail"></div>` +
    `</div>` +
    `<p class="status visually-hidden" role="status"></p>` +
    `<div class="fallback role-body" hidden><slot></slot></div>`;

  #groups = '';
  #request = 0;
  #reveal = null;
  #timer = 0;
  #inView = false;
  #drag = null;
  #hovered = false;
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
    const root = this.shadowRoot;
    root.addEventListener('focusin', () => this.#syncAutoplay());
    root.addEventListener('focusout', () => queueMicrotask(() => this.#syncAutoplay()));
    this.addEventListener('pointerenter', (event) => {
      if (event.pointerType !== 'mouse') return;
      this.#hovered = true;
      this.#syncAutoplay();
    });
    this.addEventListener('pointerleave', (event) => {
      if (event.pointerType !== 'mouse') return;
      this.#hovered = false;
      this.#syncAutoplay();
    });
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
    // Una card de carga por link: la fila ya mide lo que va a medir.
    if (groups.length) this.#renderSkeleton(groups.length);
    this.#status(groups.length ? 'Cargando productos…' : '');
    let cards = [];
    try {
      cards = groups.length ? await getProductCards(groups) : [];
    } catch (error) {
      console.error('[arq] featured-products: no se pudo cargar el catálogo', error);
    }
    if (request !== this.#request) return;
    this.removeAttribute('aria-busy');
    this.#status('');
    this.#render(cards);
  }

  // Mismo skeleton que el listado (product-card loading), una por grupo del HTML.
  #renderSkeleton(count) {
    const rail = this.shadowRoot.querySelector('.rail');
    if (rail.querySelectorAll('[loading]').length === count) return;
    const cards = Array.from({ length: count }, () => {
      const card = document.createElement('arq-product-card');
      card.loading = true;
      return card;
    });
    this.#reveal?.disconnect();
    this.#reveal = null;
    rail.replaceChildren(...cards);
    rail.hidden = false;
    this.shadowRoot.querySelector('.controls').hidden = true;
    this.shadowRoot.querySelector('.fallback').hidden = true;
    this.#syncAutoplay();
  }

  #status(message) {
    this.shadowRoot.querySelector('.status').textContent = message;
  }

  #render(cards) {
    const root = this.shadowRoot;
    const rail = root.querySelector('.rail');
    // Si las cards de carga ya se ven, las cards ocupan su lugar sin la
    // entrada (con el fundido desde 0 el gris bajaba a blanco y volvía).
    // Con el preloader encima no se vieron: entrada normal.
    const skeleton = rail.querySelector('[loading]');
    const settled = !covered() && Boolean(skeleton) && Number.parseFloat(getComputedStyle(skeleton).opacity) > 0;
    const elements = cards.map((card) => this.#card(card));
    rail.replaceChildren(...elements);
    this.#reveal?.disconnect();
    this.#reveal = settled ? null : reveal(elements);
    rail.hidden = cards.length === 0;
    root.querySelector('.controls').hidden = cards.length < 2; // con una sola card, las flechas no llevan a nada
    root.querySelector('.fallback').hidden = cards.length > 0;
    this.#syncAutoplay();
  }

  // Misma pausa que project-slider (Casa FOA). No hay token de intervalo.
  #interval() {
    return 3000;
  }

  #syncAutoplay() {
    const rail = this.shadowRoot.querySelector('.rail');
    const canPlay =
      !rail.hidden &&
      !rail.querySelector('[loading]') &&
      this.#inView &&
      !this.#drag &&
      !this.#hovered &&
      !this.shadowRoot.activeElement &&
      !this.#reducedMotion.matches &&
      document.visibilityState === 'visible' &&
      rail.scrollWidth - rail.clientWidth > 1;
    if (canPlay) this.#play();
    else this.#stop();
  }

  #play() {
    if (this.#timer) return;
    // Cada paso vuelve a mirar si puede seguir (hover, foco…): no depende solo
    // de los eventos.
    this.#timer = window.setInterval(() => {
      this.#syncAutoplay();
      if (this.#timer) this.#advance();
    }, this.#interval());
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

  // Arrastre solo con mouse: con el dedo se desliza el scroll nativo (inercia
  // y snap del navegador, fuera del hilo principal), como HorizontalRail.
  #dragStart(event) {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    const rail = event.currentTarget;
    if (rail.scrollWidth - rail.clientWidth <= 1) return;
    this.shadowRoot.querySelector('.controls').cancelGlide();
    this.#settle?.();
    this.#drag = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      left: rail.scrollLeft,
      samples: [{ x: event.clientX, t: event.timeStamp }],
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
    // Velocidad sobre los últimos ~100 ms (una sola muestra es ruidosa)
    const samples = this.#drag.samples;
    samples.push({ x: event.clientX, t: event.timeStamp });
    while (samples.length > 2 && event.timeStamp - samples[0].t > VELOCITY_WINDOW) samples.shift();
    event.preventDefault();
    rail.scrollLeft = this.#drag.left - dx;
  }

  #dragEnd(event) {
    if (!this.#drag || event.pointerId !== this.#drag.id) return;
    const drag = this.#drag;
    this.#drag = null;
    const rail = this.shadowRoot.querySelector('.rail');
    if (drag.moved && event.type === 'pointerup') {
      this.#suppressClick = true;
      window.clearTimeout(this.#suppressTimer);
      this.#suppressTimer = window.setTimeout(() => {
        this.#suppressClick = false;
      }, 400);
      const first = drag.samples[0];
      const last = drag.samples.at(-1);
      this.#snap((last.x - first.x) / Math.max(last.t - first.t, 1));
    } else rail.removeAttribute('data-dragging');
    this.#syncAutoplay();
  }

  // El destino se calcula con el snap todavía apagado (data-dragging): al
  // prenderlo, el navegador salta de golpe a la card más cercana. Se prende
  // recién cuando el deslizamiento suave terminó.
  #settle = null;

  #snap(velocity) {
    const rail = this.shadowRoot.querySelector('.rail');
    const step = this.#step();
    const release = () => {
      this.#settle = null;
      rail.removeEventListener('scrollend', release);
      window.clearTimeout(timer);
      rail.removeAttribute('data-dragging');
    };
    let timer = 0;
    if (!step) return release();
    const max = rail.scrollWidth - rail.clientWidth;
    let left = rail.scrollLeft;
    if (Math.abs(velocity) > 0.4) left -= Math.sign(velocity) * step;
    const index = Math.round(left / step);
    const target = Math.min(max, Math.max(0, index * step));
    if (Math.abs(target - rail.scrollLeft) < 1) return release();
    this.#settle = release;
    rail.addEventListener('scrollend', release);
    // Por si scrollend no llega (navegador sin soporte): tope de motion/duration/panel × 2
    const panel = Number.parseFloat(getComputedStyle(this).getPropertyValue('--arq-motion-duration-panel')) || 400;
    timer = window.setTimeout(release, panel * 2);
    this.shadowRoot.querySelector('.controls').glideTo(target);
  }

  #advance() {
    if (this.#drag) return;
    const rail = this.shadowRoot.querySelector('.rail');
    const max = rail.scrollWidth - rail.clientWidth;
    if (max <= 1) return;
    // Al final vuelve al principio con un fundido corto (motion/duration/fade:
    // se va, salta y vuelve), no rebobinando todas las cards a la vista.
    if (rail.scrollLeft >= max - 1) {
      const styles = getComputedStyle(this);
      const options = {
        duration: Number.parseFloat(styles.getPropertyValue('--arq-motion-duration-fade')) || 0,
        easing: styles.getPropertyValue('--arq-motion-easing-standard').trim() || 'ease',
      };
      const out = rail.animate([{ opacity: 1 }, { opacity: 0 }], { ...options, fill: 'forwards' });
      out.finished.then(() => {
        rail.scrollTo({ left: 0, behavior: 'auto' });
        rail.animate([{ opacity: 0 }, { opacity: 1 }], options);
        out.cancel();
      }).catch(() => {});
      return;
    }
    this.shadowRoot.querySelector('.controls').go(1);
  }

  #card({ name, meta, href, family, image, imageHover, imageLit, imageHoverLit }) {
    const card = document.createElement('arq-product-card');
    card.href = href;
    card.family = family;
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
