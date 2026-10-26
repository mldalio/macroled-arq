// search-card · COMPONENTE DE PRUEBA (documentado en Figma desde el código)
//
// Tarjeta de producto recomendado del search-sheet: solo la imagen en
// proporción cuadrada y el nombre. No lleva tipo de producto, acabados ni
// comparar (eso es de product-card, que no se usa acá).
//
//   <arq-search-card href="/arq/producto/kanu-jardin" image="…">Kanu Jardín</arq-search-card>
//   <arq-search-card size="large" href="…" image="…">Daö Embutir
//     <arq-swatch slot="finishes" src="…">Negro</arq-swatch>
//     <span slot="meta">1-3 módulos</span>
//   </arq-search-card>
//
// - Toda la tarjeta es un link (<a>). Imagen ratio/square (1:1); el
//   search-sheet puede pedir otra con --card-ratio (hoy no la usa)
//   alcanza. Sin imagen queda el recuadro de color/surface/subtle.
// - Nombre en role/body-regular y color/text/primary, por slot (indexable).
// - Size: Default (nombre en role/body-regular) · Large (role/body-xl, 20/28;
//   la usa compatible-products). Slot finishes: swatches Small a la derecha del
//   nombre, como product-card. Slot meta: texto debajo del nombre (role/body-sm,
//   color/text/secondary). Los dos solo se ven si traen contenido.
// - State: Hover (:hover) y Focus (:focus-visible); no cambia la imagen.

import { ArqElement } from '../../base/arq-element.js';
import css from './search-card.css?inline';

class ArqSearchCard extends ArqElement {
  static tag = 'arq-search-card';
  static styles = css;
  static properties = {
    href: { type: String },
    image: { type: String },
    size: { type: String, values: ['default', 'large'], default: 'default' }, // Size
  };
  static template =
    `<a class="card">` +
    `<span class="media"><img class="img" alt="" loading="lazy"></span>` +
    `<span class="info">` +
    `<span class="title"><span class="name role-body-regular"><slot></slot></span>` +
    `<span class="finishes" hidden><slot name="finishes"></slot></span></span>` +
    `<span class="meta role-body-sm" hidden><slot name="meta"></slot></span>` +
    `</span>` +
    `</a>`;

  setup() {
    const img = this.shadowRoot.querySelector('img');
    img.addEventListener('error', () => (img.hidden = true));
    for (const name of ['finishes', 'meta']) {
      const slot = this.shadowRoot.querySelector(`slot[name="${name}"]`);
      const show = () => (slot.parentElement.hidden = !slot.assignedNodes().some((node) => node.nodeType === 1 || node.textContent.trim()));
      slot.addEventListener('slotchange', show);
      show();
    }
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
    root.querySelector('.name').className = `name ${this.size === 'large' ? 'role-body-xl' : 'role-body-regular'}`;
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
