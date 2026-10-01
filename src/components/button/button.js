// button · Figma 907:2375 · ficha doc/button (1440:3630)
//
// Un solo botón para todo el sitio, en tres jerarquías: Filled, Outline y
// Underline. Con href se dibuja como <a> (navegación: Ver colección, Volver);
// sin href, como <button type="button"> (acciones).
//
//   <arq-button type="outline" show-icon icon="arrow-right">Filtrar</arq-button>
//   <arq-button type="underline" show-leading-icon href="/arq/productos">Volver a productos</arq-button>
//
// State de Figma: Hover, Pressed y Focus son :hover, :active y :focus-visible.
// Disabled y Loading son props (disabled, loading).

import { ArqElement } from '../../base/arq-element.js';
import { icon } from '../../base/icons.js';
import css from './button.css?inline';

// Label de State=Loading, según la descripción de Figma.
const LOADING_LABEL = 'Enviando…';

function warn(message) {
  if (import.meta.env.DEV) console.warn(`[arq] ${message}`);
}

class ArqButton extends ArqElement {
  static tag = 'arq-button';
  static styles = css;
  static properties = {
    type: { type: String, values: ['filled', 'outline', 'underline'], default: 'filled' }, // Type
    showIcon: { type: Boolean }, // Show icon
    icon: { type: String, default: 'arrow-up-right' }, // Icon (default de Figma)
    showUnderline: { type: Boolean }, // Show underline (solo Underline)
    showCount: { type: Boolean }, // Show count
    count: { type: Number }, // Count del count-badge
    showLeadingIcon: { type: Boolean }, // Show leading icon
    leadingIcon: { type: String, default: 'chevron-left' }, // Leading icon (default de Figma)
    disabled: { type: Boolean }, // State=Disabled
    loading: { type: Boolean }, // State=Loading (solo Filled)
    href: { type: String },
    target: { type: String },
  };
  static template = `
    <button type="button" class="control role-body-regular">
      <span class="leading" hidden></span>
      <span class="text">
        <span class="label"><slot></slot></span>
        <span class="label" data-loading hidden>${LOADING_LABEL}</span>
      </span>
      <span class="count role-caption-medium" hidden></span>
      <span class="trailing" hidden></span>
    </button>
  `;

  #control = null;

  setup() {
    this.#control = this.shadowRoot.querySelector('.control');
    // Un <a> sin href todavía recibe clics: deshabilitado o cargando no hace nada.
    this.addEventListener(
      'click',
      (event) => {
        if (this.disabled || this.loading) {
          event.preventDefault();
          event.stopImmediatePropagation();
        }
      },
      { capture: true },
    );
  }

  /** El foco va al <button> o <a> interno. */
  focus(options) {
    if (this.#control) this.#control.focus(options);
    else super.focus(options);
  }

  update(changed) {
    if (changed.has('href')) this.#renderControl();
    if (changed.has('loading') && this.loading && this.type !== 'filled') {
      warn(`<arq-button> loading es solo para type="filled" (Figma: State=Loading solo Filled).`);
    }

    const root = this.shadowRoot;
    const control = this.#control;
    const loading = this.loading;
    const inactive = this.disabled || loading;

    control.classList.toggle('inactive', inactive);
    if (loading) control.setAttribute('aria-busy', 'true');
    else control.removeAttribute('aria-busy');

    if (control.localName === 'button') {
      control.disabled = inactive;
    } else {
      // Un link no se puede deshabilitar: sin href deja de ser navegable.
      if (inactive) {
        control.removeAttribute('href');
        control.setAttribute('aria-disabled', 'true');
      } else {
        control.setAttribute('href', this.href);
        control.removeAttribute('aria-disabled');
      }
      if (this.target) control.setAttribute('target', this.target);
      else control.removeAttribute('target');
      if (this.target === '_blank') control.setAttribute('rel', 'noopener');
      else control.removeAttribute('rel');
    }

    root.querySelector('.label:not([data-loading])').hidden = loading;
    root.querySelector('.label[data-loading]').hidden = !loading;

    const leading = root.querySelector('.leading');
    if (changed.has('leadingIcon')) leading.innerHTML = icon(this.leadingIcon);
    leading.hidden = !this.showLeadingIcon || loading;

    const trailing = root.querySelector('.trailing');
    if (changed.has('icon')) trailing.innerHTML = icon(this.icon);
    trailing.hidden = !this.showIcon || loading;

    // TODO: reemplazar por <arq-count-badge> cuando exista ese componente.
    // TODO: la ficha pide que el nombre accesible incluya el número
    // ("Filtrar, 3 filtros activos"). Hoy se lee "Filtrar 3": falta definir
    // cómo se pasa el texto ("filtros activos") sin inventar una prop.
    const count = root.querySelector('.count');
    count.textContent = this.count ?? '';
    count.hidden = !this.showCount || this.count === null || loading;
  }

  // <button> para acciones, <a> para navegación. Se cambia el elemento
  // conservando su contenido (íconos, slot y count).
  #renderControl() {
    const tag = this.href !== null ? 'a' : 'button';
    const current = this.#control;
    if (current.localName === tag) return;
    const next = document.createElement(tag);
    next.className = current.className;
    if (tag === 'button') next.type = 'button';
    next.append(...current.childNodes);
    current.replaceWith(next);
    this.#control = next;
  }
}

ArqButton.define();

export { ArqButton };
