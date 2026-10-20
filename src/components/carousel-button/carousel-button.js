// carousel-button · Figma 2387:8532
//
// Botón anterior / siguiente de los carruseles de Destacados y Proyectos.
// No confundir con icon-button, que usa carousel-controls del mosaico de
// Colección.
//
//   <arq-carousel-button direction="previous">Anterior</arq-carousel-button>
//   <arq-carousel-button direction="next" disabled>Siguiente</arq-carousel-button>
//
// Direction: Previous · Next. State=Disabled es el atributo disabled (fondo
// color/surface/subtle). Hover, Pressed y Focus no son props.

import { ArqElement } from '../../base/arq-element.js';
import { icon } from '../../base/icons.js';
import css from './carousel-button.css?inline';

class ArqCarouselButton extends ArqElement {
  static tag = 'arq-carousel-button';
  static styles = css;
  static properties = {
    direction: { type: String, values: ['previous', 'next'], default: 'previous' }, // Direction
    disabled: { type: Boolean }, // State=Disabled
  };
  static template =
    `<button type="button" class="control">` +
    `<span class="glyph"></span>` +
    `<span class="visually-hidden"><slot></slot></span>` +
    `</button>`;

  #control = null;

  setup() {
    this.#control = this.shadowRoot.querySelector('.control');
    this.addEventListener(
      'click',
      (event) => {
        if (this.disabled) {
          event.preventDefault();
          event.stopImmediatePropagation();
        }
      },
      { capture: true },
    );
  }

  /** El foco va al <button> interno. */
  focus(options) {
    if (this.#control) this.#control.focus(options);
    else super.focus(options);
  }

  update(changed) {
    if (changed.has('direction') || changed.size === 0) {
      const name = this.direction === 'next' ? 'chevron-right' : 'chevron-left';
      this.shadowRoot.querySelector('.glyph').innerHTML = icon(name);
    }
    this.#control.disabled = this.disabled;
  }
}

ArqCarouselButton.define();

export { ArqCarouselButton };
