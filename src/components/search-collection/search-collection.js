// search-collection · COMPONENTE DE PRUEBA (no existe en Figma)
//
// Resultado de búsqueda de una colección: más llamativo que search-result.
// Imagen grande (ratio/landscape), etiqueta «Colección», nombre en
// role/heading-3 y flecha. Va en el slot results de search-sheet.
//
//   <arq-search-collection href="/arq/coleccion/kanu" image="…">Kanu</arq-search-collection>
//
// - Toda la tarjeta es un link (<a>). Sin imagen, fondo color/surface/subtle.
// - State: Hover (:hover), Focus (:focus-visible) y Active (prop active: el
//   resultado elegido con ↑ / ↓ mientras el foco sigue en el campo). Hover y
//   Active subrayan el nombre y mueven la flecha (transform).
// - Mismo contrato que search-result para el navbar: active y click().

import { ArqElement } from '../../base/arq-element.js';
import { icon } from '../../base/icons.js';
import css from './search-collection.css?inline';

class ArqSearchCollection extends ArqElement {
  static tag = 'arq-search-collection';
  static styles = css;
  static properties = {
    href: { type: String },
    image: { type: String },
    active: { type: Boolean }, // State=Active
  };
  static template =
    `<a class="card">` +
    `<span class="media"><img alt="" loading="lazy"></span>` +
    `<span class="info">` +
    `<span class="text">` +
    `<span class="eyebrow role-label">Colección</span>` +
    `<span class="name role-heading-3"><slot></slot></span>` +
    `</span>` +
    `<span class="arrow">${icon('arrow-right')}</span>` +
    `</span>` +
    `</a>`;

  setup() {
    const img = this.shadowRoot.querySelector('img');
    img.addEventListener('error', () => img.removeAttribute('src'));
  }

  /** El foco va al <a> interno. */
  focus(options) {
    this.shadowRoot.querySelector('a').focus(options);
  }

  /** Abre la colección (Enter en el campo con este resultado activo). */
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
    } else img.removeAttribute('src');
  }
}

ArqSearchCollection.define();

export { ArqSearchCollection };
