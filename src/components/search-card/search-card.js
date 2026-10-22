// search-card · COMPONENTE DE PRUEBA (documentado en Figma desde el código)
//
// Tarjeta de producto recomendado del search-sheet: solo la imagen en
// proporción cuadrada y el nombre. No lleva tipo de producto, acabados ni
// comparar (eso es de product-card, que no se usa acá).
//
//   <arq-search-card href="/arq/producto/kanu-jardin" image="…">Kanu Jardín</arq-search-card>
//
// - Toda la tarjeta es un link (<a>). Imagen ratio/square (1:1); el
//   search-sheet puede pedir otra con --card-ratio (hoy no la usa)
//   alcanza. Sin imagen queda el recuadro de color/surface/subtle.
// - Nombre en role/body-regular y color/text/primary, por slot (indexable).
// - State: Hover (:hover) y Focus (:focus-visible); no cambia la imagen.

import { ArqElement } from '../../base/arq-element.js';
import css from './search-card.css?inline';

class ArqSearchCard extends ArqElement {
  static tag = 'arq-search-card';
  static styles = css;
  static properties = {
    href: { type: String },
    image: { type: String },
  };
  static template =
    `<a class="card">` +
    `<span class="media"><img class="img" alt="" loading="lazy"></span>` +
    `<span class="name role-body-regular"><slot></slot></span>` +
    `</a>`;

  setup() {
    const img = this.shadowRoot.querySelector('img');
    img.addEventListener('error', () => (img.hidden = true));
  }

  /** El foco va al <a> interno. */
  focus(options) {
    this.shadowRoot.querySelector('a').focus(options);
  }

  update() {
    const root = this.shadowRoot;
    const link = root.querySelector('a');
    if (this.href) link.setAttribute('href', this.href);
    else link.removeAttribute('href');
    const img = root.querySelector('img');
    // Sin imagen queda el recuadro gris de color/surface/subtle
    if (this.image) {
      if (img.getAttribute('src') !== this.image) img.src = this.image;
      img.hidden = false;
    } else {
      img.removeAttribute('src');
      img.hidden = true;
    }
  }
}

ArqSearchCard.define();

export { ArqSearchCard };
