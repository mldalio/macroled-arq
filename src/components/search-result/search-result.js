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
//   dejar el gris vacío); Type=Simple es la excepción: deja el recuadro gris.
// - Type: default (miniatura, nombre, SKU y flecha) o simple (miniatura grande
//   y nombre, sin SKU ni flecha ni línea: la fila del search-sheet). No existe
//   en Figma: variante de prueba. TODO (diseño).
// - term (con Type=Simple): lo que escribió el usuario. El nombre va en
//   color/text/tertiary y lo que coincide, en color/text/primary con más peso
//   (src/base/highlight.js); si nada coincide, todo en tertiary. Hover, Focus y
//   Active ponen todo el nombre en primary (sin fondo ni cambio de peso).
// - State: Hover (:hover), Focus (:focus-visible) y Active (prop active: el
//   resultado elegido con ↑ / ↓ mientras el foco sigue en el campo). Hover y
//   Active: fondo color/surface/hover.

import { ArqElement } from '../../base/arq-element.js';
import { icon } from '../../base/icons.js';
import { highlight } from '../../base/highlight.js';
import css from './search-result.css?inline';

class ArqSearchResult extends ArqElement {
  static tag = 'arq-search-result';
  static styles = css;
  static properties = {
    type: { type: String, values: ['default', 'simple'], default: 'default' }, // Type (solo de código)
    href: { type: String },
    term: { type: String, default: '' }, // búsqueda a resaltar
    image: { type: String }, // Show image
    active: { type: Boolean }, // State=Active
  };
  static template =
    `<a class="result">` +
    `<span class="thumb"><img alt="" loading="lazy"></span>` +
    `<span class="text">` +
    `<span class="name role-body-strong"><slot></slot><span class="marked" hidden></span></span>` +
    `<span class="meta role-body-sm"><slot name="meta"></slot></span>` +
    `</span>` +
    `<span class="arrow">${icon('arrow-right')}</span>` +
    `</a>`;

  setup() {
    const img = this.shadowRoot.querySelector('img');
    img.addEventListener('error', () => this.#noImage());
    this.shadowRoot.querySelector('slot:not([name])').addEventListener('slotchange', () => this.#mark());
  }

  // Sin imagen (o si falla): Type=Simple deja el recuadro gris de color/surface/subtle;
  // el resto, sin miniatura.
  #noImage() {
    const img = this.shadowRoot.querySelector('img');
    img.removeAttribute('src');
    img.hidden = true;
    img.parentElement.hidden = this.type !== 'simple';
  }

  // El nombre llega por slot; para resaltarlo se muestra una copia con marcas y
  // se oculta el slot (el texto sigue en el DOM de la página).
  #mark() {
    const root = this.shadowRoot;
    const marked = root.querySelector('.marked');
    const name = [...this.childNodes]
      .filter((node) => !(node.nodeType === 1 && node.slot === 'meta'))
      .map((node) => node.textContent)
      .join('')
      .trim();
    const on = this.type === 'simple' && Boolean(this.term?.trim()) && Boolean(name);
    marked.hidden = !on;
    root.querySelector('.name').classList.toggle('has-marks', on);
    marked.innerHTML = on ? highlight(name, this.term) : '';
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
    // Simple: nombre en role/body-regular (el resto, role/body-strong)
    const name = root.querySelector('.name');
    name.classList.toggle('role-body-strong', this.type !== 'simple');
    name.classList.toggle('role-body-regular', this.type === 'simple');
    this.#mark();
    const img = root.querySelector('img');
    if (this.image) {
      if (img.getAttribute('src') !== this.image) img.src = this.image;
      img.hidden = false;
      img.parentElement.hidden = false;
    } else this.#noImage();
  }
}

ArqSearchResult.define();

export { ArqSearchResult };
