// search-screen · Figma 796:2351 · ficha doc/search-screen (1446:7244)
//
// Búsqueda en mobile, a pantalla completa. Arriba, volver + search-field (sin
// cruz); debajo, los resultados que pone el navbar por slot.
//
//   <arq-search-screen>
//     <arq-search-result href="…">…</arq-search-result>
//     <arq-search-see-all …></arq-search-see-all>
//   </arq-search-screen>
//   screen.show(opener) · screen.close()
//
// - State: Empty (sin contenido), Results (search-result + search-see-all,
//   con padding lateral layout/gutter) o No results (arq-search-dropdown
//   state="no-results"). Lo decide el contenido: no es prop.
// - Diálogo modal nativo (<dialog> + showModal): ocupa la pantalla, el foco
//   arranca en el campo y queda adentro. Volver o Esc cierran (arq:close) y
//   el foco vuelve al botón que lo abrió.
// - Los eventos del campo (arq:input, arq:submit, arq:navigate) salen del
//   componente; field devuelve el search-field.

import { ArqElement } from '../../base/arq-element.js';
import '../icon-button/icon-button.js';
import '../search-field/search-field.js';
import css from './search-screen.css?inline';

class ArqSearchScreen extends ArqElement {
  static tag = 'arq-search-screen';
  static styles = css;
  static properties = {
    open: { type: Boolean },
    label: { type: String, default: 'Buscar' }, // nombre del diálogo
  };
  static template =
    `<dialog class="dialog">` +
    `<div class="screen">` +
    `<div class="header">` +
    `<arq-icon-button class="back" icon="chevron-left">Volver</arq-icon-button>` +
    `<arq-search-field class="field"></arq-search-field>` +
    `</div>` +
    `<div class="content"><slot></slot></div>` +
    `</div>` +
    `</dialog>`;

  #dialog = null;
  #opener = null;

  get field() {
    return this.shadowRoot.querySelector('arq-search-field');
  }

  setup() {
    const root = this.shadowRoot;
    this.#dialog = root.querySelector('dialog');
    root.querySelector('.back').addEventListener('click', () => this.close());
    this.#dialog.addEventListener('cancel', (event) => {
      event.preventDefault();
      this.close();
    });
  }

  update(changed) {
    if (changed.has('label')) this.#dialog.setAttribute('aria-label', this.label ?? '');
    if (changed.has('open')) {
      if (this.open && !this.#dialog.open) {
        this.#dialog.showModal();
        requestAnimationFrame(() => this.field.focus());
      } else if (!this.open && this.#dialog.open) {
        this.#dialog.close();
        this.#opener?.focus?.();
        this.#opener = null;
      }
    }
  }

  /** Abre la búsqueda. El foco vuelve a opener al cerrar. */
  show(opener = null) {
    this.#opener = opener;
    this.open = true;
  }

  /** Cierra la búsqueda y emite arq:close. */
  close() {
    if (!this.open) return;
    this.open = false;
    this.emit('close');
  }
}

ArqSearchScreen.define();

export { ArqSearchScreen };
