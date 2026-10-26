// collection-index · bloque del Home bajo «Diseño que inspira».
// No está en Figma: sale de una referencia de lista + foto, adaptada a
// los tokens de Arq (sin trama de fondo).
//
//   <arq-collection-index>
//     <arq-button slot="action" type="outline" href="/arq/productos" data-arq-menu="colecciones">Ver todo</arq-button>
//   </arq-collection-index>
//
// Los nombres salen de la columna familia de las luminarias publicadas
// (getFamilies). Cada link abre /arq/productos?family=. El botón «Ver todo»
// queda en el HTML.
//
// Pasar el mouse (o enfocar) un nombre muestra su foto. El primero arranca
// visible. En táctil, el primer toque muestra la foto y el segundo entra.
// TODO (diseño): no hay set ni tokens propios de este bloque.

import { ArqElement } from '../../base/arq-element.js';
import { getFamilies } from '../../data/catalog.js';
import css from './collection-index.css?inline';

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
    `<img class="photo is-shown" alt="">` +
    `<img class="photo" alt="">` +
    `</div>` +
    `</div>`;

  #current = null;
  #pointer = 'mouse';
  #reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

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
    });
    this.#sync();
    this.#load();
  }

  async #load() {
    let families = [];
    try {
      families = await getFamilies();
    } catch (error) {
      console.error('[arq] collection-index: no se pudieron cargar las familias', error);
      return;
    }
    const action = this.querySelector('[slot="action"]');
    for (const child of [...this.children]) {
      if (child !== action) child.remove();
    }
    const links = families.map((family) => {
      const link = document.createElement('a');
      link.href = family.href;
      if (family.image) {
        const img = document.createElement('img');
        img.src = family.image;
        img.alt = '';
        img.loading = 'lazy';
        link.append(img);
      }
      link.append(document.createTextNode(family.name));
      return link;
    });
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
  }

  #select(link, instant = false) {
    if (!link) return;
    for (const item of this.#links()) item.removeAttribute('aria-current');
    link.setAttribute('aria-current', 'true');
    this.#current = link;
    const img = link.querySelector('img');
    const src = img?.getAttribute('src') || '';
    const alt = img?.getAttribute('alt') || link.textContent.trim();
    if (src) this.#paint(src, alt, instant || this.#reduced.matches);
  }

  #paint(src, alt, instant) {
    const photos = [...this.shadowRoot.querySelectorAll('.photo')];
    const shown = photos.find((photo) => photo.classList.contains('is-shown')) ?? photos[0];
    const next = photos.find((photo) => photo !== shown);
    if (shown.getAttribute('src') === src) {
      shown.alt = alt;
      return;
    }
    if (instant || !next) {
      shown.src = src;
      shown.alt = alt;
      shown.classList.add('is-shown');
      next?.classList.remove('is-shown');
      return;
    }
    next.src = src;
    next.alt = alt;
    next.classList.add('is-shown');
    shown.classList.remove('is-shown');
  }
}

ArqCollectionIndex.define();

export { ArqCollectionIndex };
