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
// - Type: box (el campo del navbar, con borde) o line (solo una línea inferior
//   y la lupa a la izquierda: el campo del search-sheet). No existe en Figma:
//   variante de prueba. TODO (diseño): diseñarla en el set antes de adoptarla.
// - Size: default (texto role/body), medium (role/body-xl, 20/28 · 16/24 en
//   Mobile) o large (role/heading-3, 24/32 · 20/28 en Mobile): lo que se
//   escribe se destaca frente a los resultados. El placeholder va un peso
//   menos, en Light (role/body-xl-light · role/heading-3-light). Large: la
//   búsqueda del navbar (search-sheet); medium: la de Descargas
//   (variants-table Catalog). En Figma, Size de los sets search-field y
//   search-field-line.
// - Show icon: la lupa a la izquierda en Type=Box (en Line va siempre).
// - Show clear: con texto, una cruz a la derecha borra lo escrito (emite
//   arq:input con el valor vacío y el foco vuelve al campo). Sin texto no se ve.
//   No es la cruz de Show close, que cierra la búsqueda.
// - Show close viene en true en Figma; en código es un atributo de presencia.
// - Resultado activo para lectores de pantalla: los resultados viven en otro
//   Shadow DOM y aria-activedescendant no lo cruza. El campo anuncia el activo
//   en una región aria-live (prop activeLabel).
//   TODO (a11y): revisar con lector de pantalla cuando esté la página de búsqueda.

import { ArqElement } from '../../base/arq-element.js';
import { icon } from '../../base/icons.js';
import '../icon-button/icon-button.js';
import css from './search-field.css?inline';

class ArqSearchField extends ArqElement {
  static tag = 'arq-search-field';
  static styles = css;
  static properties = {
    type: { type: String, values: ['box', 'line'], default: 'box' }, // Type (solo de código, ver arriba)
    size: { type: String, values: ['default', 'medium', 'large'], default: 'default' }, // Size
    showIcon: { type: Boolean }, // Show icon (Type=Box)
    showClear: { type: Boolean }, // Show clear
    showClose: { type: Boolean }, // Show close
    value: { type: String, default: '' },
    placeholder: { type: String, default: 'Buscar productos…' },
    label: { type: String, default: 'Buscar productos' }, // nombre accesible del campo
    activeLabel: { type: String, default: '' }, // resultado activo (se anuncia)
  };
  static template =
    `<div class="field">` +
    `<span class="lead">${icon('search')}</span>` +
    `<input class="input role-body" type="search" autocomplete="off" spellcheck="false" enterkeyhint="search">` +
    `<arq-icon-button class="clear" icon="close" hidden>Borrar búsqueda</arq-icon-button>` +
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
    root.querySelector('.clear').addEventListener('click', () => {
      this.value = '';
      this.emit('input', { value: '' });
      this.#input.focus();
    });
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
    root.querySelector('.clear').hidden = !this.showClear || !this.value;
    if (changed.has('size')) {
      this.#input.classList.toggle('role-body', this.size !== 'large' && this.size !== 'medium');
      this.#input.classList.toggle('role-body-xl', this.size === 'medium');
      this.#input.classList.toggle('role-heading-3', this.size === 'large');
    }
    if (changed.has('activeLabel')) root.querySelector('[aria-live]').textContent = this.activeLabel ?? '';
  }
}

ArqSearchField.define();

export { ArqSearchField };
