// search-result · Figma 789:3045 · ficha doc/search-result (1446:6758)
//
// Fila de resultado de búsqueda: miniatura, nombre, SKU y flecha.
//
//   <arq-search-result href="/arq/producto/kanu-jardin" image="…">
//     Kanu Jardín<span slot="meta">KANU-J-500-12W-N-WW</span>
//   </arq-search-result>
//
// - Es un link (<a>). Nombre role/body-strong (slot por defecto), meta
//   role/body-sm en color/text/tertiary (slot meta: SKU, o "Colección").
// - Show image: sale de image. Sin imagen no hay miniatura (la ficha pide no
//   dejar el gris vacío).
// - State: Hover (:hover), Focus (:focus-visible) y Active (prop active: el
//   resultado elegido con ↑ / ↓ mientras el foco sigue en el campo). Hover y
//   Active: fondo color/surface/hover.

import { ArqElement } from '../../base/arq-element.js';
import { icon } from '../../base/icons.js';
import css from './search-result.css?inline';

class ArqSearchResult extends ArqElement {
  static tag = 'arq-search-result';
  static styles = css;
  static properties = {
    href: { type: String },
    image: { type: String }, // Show image
    active: { type: Boolean }, // State=Active
  };
  static template =
    `<a class="result">` +
    `<span class="thumb"><img alt="" loading="lazy"></span>` +
    `<span class="text">` +
    `<span class="name role-body-strong"><slot></slot></span>` +
    `<span class="meta role-body-sm"><slot name="meta"></slot></span>` +
    `</span>` +
    `<span class="arrow">${icon('arrow-right')}</span>` +
    `</a>`;

  setup() {
    const img = this.shadowRoot.querySelector('img');
    img.addEventListener('error', () => (img.parentElement.hidden = true));
  }

  /** El foco va al <a> interno. */
  focus(options) {
    this.shadowRoot.querySelector('a').focus(options);
  }

  /** Abre el resultado (Enter en el campo con este resultado activo). */
  click() {
    this.shadowRoot.querySelector('a').click();
  }

  update() {
    const root = this.shadowRoot;
    const link = root.querySelector('a');
    if (this.href) link.setAttribute('href', this.href);
    else link.removeAttribute('href');
    link.classList.toggle('active', this.active);
    const img = root.querySelector('img');
    if (this.image) {
      if (img.getAttribute('src') !== this.image) img.src = this.image;
      img.parentElement.hidden = false;
    } else {
      img.removeAttribute('src');
      img.parentElement.hidden = true;
    }
  }
}

ArqSearchResult.define();

export { ArqSearchResult };
