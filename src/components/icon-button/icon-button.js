// icon-button · Figma 752:2882 · ficha doc/icon-button (1440:4000)
//
// Botón de solo ícono. El nombre accesible llega por slot y queda oculto
// visualmente; es obligatorio (sin texto visible no hay otra forma de saber
// qué hace el botón).
//
//   <arq-icon-button icon="search">Buscar</arq-icon-button>
//   <arq-icon-button icon="plus" size="large">Abrir especificaciones</arq-icon-button>
//   <arq-icon-button icon="download" background="subtle">Descargar</arq-icon-button>
//
// State de Figma: Hover, Pressed y Focus son :hover, :active y :focus-visible.
// Disabled es la prop disabled (atributo disabled nativo en el <button>).
// TODO: aria-expanded y aria-controls cuando abre algo (menú, búsqueda,
// acordeón). Se definen al construir esos componentes.

import { ArqElement } from '../../base/arq-element.js';
import { icon } from '../../base/icons.js';
import css from './icon-button.css?inline';

class ArqIconButton extends ArqElement {
  static tag = 'arq-icon-button';
  static styles = css;
  static properties = {
    icon: { type: String, default: 'search' }, // Icon (default de Figma)
    size: { type: String, values: ['default', 'large'], default: 'default' }, // Size
    background: { type: String, values: ['none', 'surface', 'subtle'], default: 'none' }, // Background
    disabled: { type: Boolean }, // State=Disabled
  };
  static template = `<button type="button" class="control"><span class="glyph"></span><span class="visually-hidden"><slot></slot></span></button>`;

  #control = null;

  setup() {
    this.#control = this.shadowRoot.querySelector('.control');
    // Deshabilitado, el clic no se propaga (aunque llegue al elemento de afuera).
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
    // Se revisa después de una vuelta del event loop: si el elemento se crea
    // por JS, el texto puede llegar después de conectarse.
    const slot = this.shadowRoot.querySelector('slot');
    slot.addEventListener('slotchange', () => this.#checkName());
    setTimeout(() => this.#checkName());
  }

  /** El foco va al <button> interno. */
  focus(options) {
    if (this.#control) this.#control.focus(options);
    else super.focus(options);
  }

  update(changed) {
    if (changed.has('icon')) this.shadowRoot.querySelector('.glyph').innerHTML = icon(this.icon);
    this.#control.disabled = this.disabled;
  }

  // El nombre accesible es obligatorio: sin texto en el slot, avisa.
  #checkName() {
    if (!this.textContent.trim()) {
      console.warn(
        `[arq] <arq-icon-button icon="${this.icon}"> no tiene nombre accesible: escribí qué hace entre las etiquetas (p. ej. <arq-icon-button icon="search">Buscar</arq-icon-button>).`,
      );
    }
  }
}

ArqIconButton.define();

export { ArqIconButton };
