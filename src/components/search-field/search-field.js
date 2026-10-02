// search-field · Figma 795:2179 · ficha doc/search-field (1446:6595)
//
// Campo de búsqueda del sitio. En desktop va en el navbar (Mode=Search) con la
// cruz que cierra la búsqueda; en mobile, dentro de search-screen, sin cruz.
//
//   <arq-search-field show-close></arq-search-field>
//
// - State: Empty y Filled salen del valor; Focus es :focus-within (borde
//   color/border/focus). No son props.
// - Emite arq:input { value } al escribir, arq:submit { value } con Enter y
//   arq:close al tocar la cruz. ↑ / ↓ emiten arq:navigate { step } para mover
//   el resultado activo (el foco sigue en el campo).
// - Show close viene en true en Figma; en código es un atributo de presencia.
// - Resultado activo para lectores de pantalla: los resultados viven en otro
//   Shadow DOM y aria-activedescendant no lo cruza. El campo anuncia el activo
//   en una región aria-live (prop activeLabel).
//   TODO (a11y): revisar con lector de pantalla cuando esté la página de búsqueda.

import { ArqElement } from '../../base/arq-element.js';
import '../icon-button/icon-button.js';
import css from './search-field.css?inline';

class ArqSearchField extends ArqElement {
  static tag = 'arq-search-field';
  static styles = css;
  static properties = {
    showClose: { type: Boolean }, // Show close
    value: { type: String, default: '' },
    placeholder: { type: String, default: 'Buscar productos…' },
    label: { type: String, default: 'Buscar productos' }, // nombre accesible del campo
    activeLabel: { type: String, default: '' }, // resultado activo (se anuncia)
  };
  static template =
    `<div class="field">` +
    `<input class="input role-body" type="search" autocomplete="off" spellcheck="false" enterkeyhint="search">` +
    `<arq-icon-button class="close" icon="close">Cerrar búsqueda</arq-icon-button>` +
    `</div>` +
    `<span class="visually-hidden" aria-live="polite"></span>`;

  #input = null;

  setup() {
    const root = this.shadowRoot;
    this.#input = root.querySelector('input');
    this.#input.addEventListener('input', () => {
      this.value = this.#input.value;
      this.emit('input', { value: this.value });
    });
    this.#input.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        this.emit('navigate', { step: event.key === 'ArrowDown' ? 1 : -1 });
      } else if (event.key === 'Enter') {
        event.preventDefault();
        this.emit('submit', { value: this.value });
      }
    });
    root.querySelector('.close').addEventListener('click', () => this.emit('close'));
  }

  /** El foco va al <input>. */
  focus(options) {
    this.#input?.focus(options);
  }

  update(changed) {
    const root = this.shadowRoot;
    if (this.#input.value !== this.value) this.#input.value = this.value ?? '';
    this.#input.placeholder = this.placeholder ?? '';
    this.#input.setAttribute('aria-label', this.label ?? '');
    root.querySelector('.close').hidden = !this.showClose;
    if (changed.has('activeLabel')) root.querySelector('[aria-live]').textContent = this.activeLabel ?? '';
  }
}

ArqSearchField.define();

export { ArqSearchField };
