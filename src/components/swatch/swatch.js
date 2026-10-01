// swatch · Figma 1063:4880 · ficha doc/swatch (1430:2649)
//
// Muestra de acabado (único swatch del sistema). El relleno es la imagen del
// acabado (de los datos); si falta o no carga, queda color/surface/subtle.
// El nombre del acabado va por slot (oculto) y es el nombre accesible.
//
//   <arq-swatch src="…/black.jpg">Negro texturado</arq-swatch>                  solo visual (product-card, filtros)
//   <arq-swatch role="radio" size="large" selected src="…">Negro</arq-swatch>    elegible (swatch-picker)
//
// Solo visual por defecto (role="img"). Con role="radio" (lo pone swatch-picker)
// se elige con clic, Enter o Espacio y tiene Hover, Selected y Focus.

import { ArqElement } from '../../base/arq-element.js';
import { Selectable } from '../../base/selectable.js';
import css from './swatch.css?inline';

class ArqSwatch extends ArqElement {
  static tag = 'arq-swatch';
  static styles = css;
  static properties = {
    size: { type: String, values: ['small', 'default', 'large'], default: 'small' }, // Size (def. Small)
    selected: { type: Boolean }, // State=Selected
    src: { type: String },
    value: { type: String },
  };
  static template = `<span class="swatch"><img alt="" hidden></span><span class="visually-hidden"><slot></slot></span>`;

  setup() {
    const img = this.shadowRoot.querySelector('img');
    img.addEventListener('error', () => (img.hidden = true));
    img.addEventListener('load', () => (img.hidden = false));
    const sync = () => {
      const name = this.textContent.trim();
      if (name) this.setAttribute('aria-label', name);
    };
    this.shadowRoot.querySelector('slot').addEventListener('slotchange', sync);
    sync();
    if (this.getAttribute('role') === 'radio') {
      this.selectable = new Selectable(this, { role: 'radio', state: 'aria-checked' });
    } else if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'img');
    }
  }

  update(changed) {
    if (changed.has('src')) {
      const img = this.shadowRoot.querySelector('img');
      if (this.src) img.src = this.src;
      else {
        img.removeAttribute('src');
        img.hidden = true;
      }
    }
  }
}

ArqSwatch.define();

export { ArqSwatch };
