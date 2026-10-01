// gallery-thumb · Figma 920:2474 · ficha doc/gallery-thumb (1463:10579)
//
// Miniatura de la galería de producto (5:4). Elegirla muestra la imagen grande
// en product-gallery (todavía no construido). Toma el ancho que le da la
// galería.
//
//   <arq-gallery-thumb src="…/kanu-1.jpg" alt="Kanu Jardín, vista frontal" selected></arq-gallery-thumb>
//
// Es un <button>; la miniatura elegida lleva aria-current="true".

import { ArqElement } from '../../base/arq-element.js';
import css from './gallery-thumb.css?inline';

class ArqGalleryThumb extends ArqElement {
  static tag = 'arq-gallery-thumb';
  static styles = css;
  static properties = {
    selected: { type: Boolean }, // State=Selected
    src: { type: String },
    alt: { type: String },
  };
  static template = `<button type="button" class="thumb"><img alt="" loading="lazy" hidden></button>`;

  #control = null;

  setup() {
    this.#control = this.shadowRoot.querySelector('.thumb');
    const img = this.shadowRoot.querySelector('img');
    // Sin imagen (o si no carga): queda el fondo color/surface/subtle.
    img.addEventListener('error', () => (img.hidden = true));
    img.addEventListener('load', () => (img.hidden = false));
    // Se revisa después de una vuelta del event loop (el alt puede llegar por JS).
    setTimeout(() => {
      if (!this.alt) console.warn('[arq] <arq-gallery-thumb> sin alt: describí la imagen (p. ej. alt="Kanu Jardín, vista frontal").');
    });
  }

  /** El foco va al <button> interno. */
  focus(options) {
    if (this.#control) this.#control.focus(options);
    else super.focus(options);
  }

  update(changed) {
    const control = this.#control;
    if (this.selected) control.setAttribute('aria-current', 'true');
    else control.removeAttribute('aria-current');
    const img = this.shadowRoot.querySelector('img');
    if (changed.has('src')) {
      if (this.src) img.src = this.src;
      else {
        img.removeAttribute('src');
        img.hidden = true;
      }
    }
    // El nombre del botón es el alt de la imagen.
    if (this.alt) control.setAttribute('aria-label', this.alt);
    else control.removeAttribute('aria-label');
  }
}

ArqGalleryThumb.define();

export { ArqGalleryThumb };
