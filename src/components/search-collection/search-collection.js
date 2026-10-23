// search-collection · COMPONENTE DE PRUEBA (no existe en Figma)
//
// Resultado de búsqueda de una colección, discreto: miniatura muy chica y el
// nombre. Va en el grupo «Colecciones» del search-sheet (a la derecha en
// Desktop); la jerarquía la llevan los productos.
//
//   <arq-search-collection href="/arq/productos?collection=kanu" image="…" term="ka">Kanu</arq-search-collection>
//
// - Todo es un link (<a>). Miniatura cuadrada layout/search-thumb; sin imagen
//   queda el recuadro gris (color/surface/subtle).
// - Texto como el de search-result Type=Simple: nombre en role/body-regular y
//   color/text/tertiary; lo que coincide con term, en color/text/primary con
//   más peso (src/base/highlight.js). Hover, Focus y Active ponen el nombre en
//   primary.
// - State: Hover (:hover), Focus (:focus-visible) y Active (prop active: el
//   resultado elegido con ↑ / ↓ mientras el foco sigue en el campo).
// - Mismo contrato que search-result para el navbar: active y click().

import { ArqElement } from '../../base/arq-element.js';
import { highlight } from '../../base/highlight.js';
import css from './search-collection.css?inline';

class ArqSearchCollection extends ArqElement {
  static tag = 'arq-search-collection';
  static styles = css;
  static properties = {
    href: { type: String },
    image: { type: String },
    term: { type: String, default: '' }, // búsqueda a resaltar
    active: { type: Boolean }, // State=Active
  };
  static template =
    `<a class="card">` +
    `<span class="thumb"><img alt="" loading="lazy"></span>` +
    `<span class="name role-body-regular"><slot></slot><span class="marked" hidden></span></span>` +
    `</a>`;

  setup() {
    const root = this.shadowRoot;
    const img = root.querySelector('img');
    img.addEventListener('error', () => (img.hidden = true));
    root.querySelector('slot').addEventListener('slotchange', () => this.#mark());
  }

  // El nombre llega por slot; para resaltarlo se muestra una copia con marcas
  // y se oculta el slot (el texto sigue en el DOM de la página).
  #mark() {
    const root = this.shadowRoot;
    const marked = root.querySelector('.marked');
    const name = this.textContent.trim();
    const on = Boolean(this.term?.trim()) && Boolean(name);
    marked.hidden = !on;
    root.querySelector('.name').classList.toggle('has-marks', on);
    marked.innerHTML = on ? highlight(name, this.term) : '';
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
    // Sin imagen queda el recuadro gris de color/surface/subtle
    if (this.image) {
      if (img.getAttribute('src') !== this.image) img.src = this.image;
      img.hidden = false;
    } else {
      img.removeAttribute('src');
      img.hidden = true;
    }
    this.#mark();
  }
}

ArqSearchCollection.define();

export { ArqSearchCollection };
