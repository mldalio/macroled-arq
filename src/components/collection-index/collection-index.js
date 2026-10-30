// collection-index · bloque del Home bajo «Diseño que inspira».
// No está en Figma: sale de una referencia de lista + foto, adaptada a
// los tokens de Arq (sin trama de fondo).
//
//   <arq-collection-index>
//     <arq-button slot="action" type="outline" href="/arq/productos" data-arq-menu="colecciones">Ver todas las colecciones</arq-button>
//   </arq-collection-index>
//
// Los nombres son las familias destacadas (Yoru, Afo, Sento, Höshi, Kanu, Köen),
// en ese orden (getFamilies). Cada link abre /arq/productos?family=.
//
// Pasar el mouse (o enfocar) un nombre muestra su foto. El primero arranca
// visible. En táctil, el primer toque muestra la foto y el segundo entra.
// Mobile (hasta 767 px): la colección activa avanza sola cada 1,5 s (más corto
// que Productos destacados: al pasar scrolleando, el cambio se tiene que ver). Se detiene con el foco adentro, con la
// pestaña oculta, fuera de pantalla y con prefers-reduced-motion; un toque
// reinicia la cuenta. No hay token de intervalo.
// TODO (diseño): no hay set ni tokens propios de este bloque.

import { ArqElement } from '../../base/arq-element.js';
import { getFamilies } from '../../data/catalog.js';
import css from './collection-index.css?inline';

const AUTOPLAY_MS = 1500;

class ArqCollectionIndex extends ArqElement {
  static tag = 'arq-collection-index';
  static styles = css;
  static template =
    `<div class="layout">` +
    `<div class="names">` +
    `<nav class="list role-display-sm" aria-label="Colecciones"><slot></slot></nav>` +
    `<div class="action"><slot name="action"></slot></div>` +
    `</div>` +
    `<div class="stage">` +
    `<a class="stage-link" tabindex="-1" aria-hidden="true">` +
    `<img class="photo is-shown" alt="">` +
    `<img class="photo" alt="">` +
    `</a>` +
    `</div>` +
    `</div>`;

  #current = null;
  #pointer = 'mouse';
  #reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  #mobile = window.matchMedia('(max-width: 767px)');
  #timer = 0;
  #inView = false;
  #onChange = () => this.#syncAutoplay();
  #io = new IntersectionObserver(([entry]) => {
    this.#inView = entry.isIntersecting;
    this.#syncAutoplay();
  });

  setup() {
    const slot = this.shadowRoot.querySelector('slot:not([name])');
    slot.addEventListener('slotchange', () => this.#sync());
    this.addEventListener('pointerdown', (event) => {
      this.#pointer = event.pointerType;
    });
    this.addEventListener('pointerover', (event) => {
      if (event.pointerType !== 'mouse') return;
      const link = this.#linkFrom(event.target);
      if (link) this.#select(link);
    });
    this.addEventListener('focusin', (event) => {
      const link = this.#linkFrom(event.target);
      if (link) this.#select(link);
    });
    this.addEventListener('click', (event) => {
      if (this.#pointer === 'mouse') return;
      const link = this.#linkFrom(event.target);
      if (!link || link === this.#current) return;
      event.preventDefault();
      this.#select(link);
      this.#restart();
    });
    this.addEventListener('focusin', this.#onChange);
    this.addEventListener('focusout', () => queueMicrotask(this.#onChange));
    this.#reduced.addEventListener('change', this.#onChange);
    this.#mobile.addEventListener('change', this.#onChange);
    document.addEventListener('visibilitychange', this.#onChange);
    this.#io.observe(this);
    this.#sync();
    this.#load();
  }

  disconnectedCallback() {
    this.#stop();
    this.#io.disconnect();
    this.#reduced.removeEventListener('change', this.#onChange);
    this.#mobile.removeEventListener('change', this.#onChange);
    document.removeEventListener('visibilitychange', this.#onChange);
  }

  #syncAutoplay() {
    const canPlay =
      this.#mobile.matches &&
      this.#inView &&
      !this.#reduced.matches &&
      document.visibilityState === 'visible' &&
      !this.querySelector(':focus-visible') &&
      this.#links().length > 1;
    if (canPlay) this.#play();
    else this.#stop();
  }

  #play() {
    if (this.#timer) return;
    this.#timer = window.setInterval(() => {
      this.#syncAutoplay();
      if (!this.#timer) return;
      const links = this.#links();
      this.#select(links[(links.indexOf(this.#current) + 1) % links.length]);
    }, AUTOPLAY_MS);
  }

  #stop() {
    window.clearInterval(this.#timer);
    this.#timer = 0;
  }

  // Un toque o un cambio de la lista reinicia la cuenta.
  #restart() {
    this.#stop();
    this.#syncAutoplay();
  }

  async #load() {
    let families = [];
    try {
      families = await getFamilies();
    } catch (error) {
      console.error('[arq] collection-index: no se pudieron cargar las familias', error);
      return;
    }
    const links = families.map((family) => {
      const link = document.createElement('a');
      link.href = family.href;
      if (family.image) {
        const img = document.createElement('img');
        img.src = family.image;
        img.alt = '';
        img.loading = 'lazy';
        if (family.focus) img.dataset.focus = family.focus;
        link.append(img);
      }
      link.append(document.createTextNode(family.name));
      return link;
    });
    const action = this.querySelector(':scope > [slot="action"]');
    for (const child of [...this.querySelectorAll(':scope > a')]) child.remove();
    if (action) action.before(...links);
    else this.append(...links);
  }

  #links() {
    return [...this.querySelectorAll(':scope > a[href]')];
  }

  #linkFrom(node) {
    const link = node instanceof Element ? node.closest('a[href]') : null;
    return link && this.#links().includes(link) ? link : null;
  }

  #sync() {
    for (const link of this.#links()) {
      const img = link.querySelector('img');
      if (img) img.hidden = true;
    }
    const links = this.#links();
    if (!this.#current || !links.includes(this.#current)) this.#select(links[0], true);
    this.#restart();
  }

  #select(link, instant = false) {
    if (!link) return;
    for (const item of this.#links()) item.removeAttribute('aria-current');
    link.setAttribute('aria-current', 'true');
    this.#current = link;
    // La foto lleva a la colección elegida. Es redundante con la lista para
    // teclado y lectores de pantalla (tabindex -1, aria-hidden).
    this.shadowRoot.querySelector('.stage-link').href = link.href;
    const img = link.querySelector('img');
    const src = img?.getAttribute('src') || '';
    const alt = img?.getAttribute('alt') || link.textContent.trim();
    const focus = img?.dataset.focus || '';
    if (src) this.#paint(src, alt, focus, instant || this.#reduced.matches);
  }

  #place(photo, focus) {
    if (focus) photo.dataset.focus = focus;
    else delete photo.dataset.focus;
  }

  #paint(src, alt, focus, instant) {
    const photos = [...this.shadowRoot.querySelectorAll('.photo')];
    const shown = photos.find((photo) => photo.classList.contains('is-shown')) ?? photos[0];
    const next = photos.find((photo) => photo !== shown);
    if (shown.getAttribute('src') === src) {
      shown.alt = alt;
      this.#place(shown, focus);
      return;
    }
    if (instant || !next) {
      shown.src = src;
      shown.alt = alt;
      this.#place(shown, focus);
      shown.classList.add('is-shown');
      next?.classList.remove('is-shown');
      return;
    }
    next.src = src;
    next.alt = alt;
    this.#place(next, focus);
    next.classList.add('is-shown');
    shown.classList.remove('is-shown');
  }
}

ArqCollectionIndex.define();

export { ArqCollectionIndex };
