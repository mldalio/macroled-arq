// nav-link · Figma 752:2866 · ficha doc/nav-link (1442:3957)
//
// Link de primer nivel del navbar (y del menú mobile).
//
//   <arq-nav-link href="/arq/colecciones" current>Colecciones</arq-nav-link>
//   <arq-nav-link has-dropdown>Productos</arq-nav-link>
//
// - Sin dropdown: <a href>. Current: aria-current="page" + indicador.
// - Con dropdown: <button aria-expanded>. Al tocarlo emite arq:toggle
//   { open: !open }; open y current los controla el navbar.
//   El mega-menu incluye los "Ver todo…" (Productos deja de ser link).
// Breakpoint es CSS (≤ 767 px: fila del menú mobile). El estilo de texto
// (role/body → role/body-xl) lo cambia el JS con el mismo media query.
// TODO (navbar): aria-controls hacia el mega-menu (los ids no cruzan el Shadow DOM).
// Theme=Inverse (navbar Transparent sobre el hero): label, indicador,
// subrayado y chevron en color/text/inverse y color/icon/inverse. Solo desktop:
// el menú mobile siempre va sobre color/surface/default.

import { ArqElement } from '../../base/arq-element.js';
import { icon } from '../../base/icons.js';
import css from './nav-link.css?inline';

// Mismo corte que tokens.css (Mobile hasta 767 px).
const mobile = matchMedia('(max-width: 767px)');

class ArqNavLink extends ArqElement {
  static tag = 'arq-nav-link';
  static styles = css;
  static properties = {
    hasDropdown: { type: Boolean }, // Has dropdown
    open: { type: Boolean }, // Open
    current: { type: Boolean }, // State=Current
    href: { type: String },
    theme: { type: String, values: ['default', 'inverse'], default: 'default' }, // Theme
  };
  static template =
    `<a class="link">` +
    `<span class="indicator" aria-hidden="true"></span>` +
    `<span class="label role-body"><slot></slot></span>` +
    `<span class="chevron">${icon('chevron-down')}</span>` +
    `<span class="trailing">${icon('chevron-right')}${icon('arrow-right')}</span>` +
    `</a>`;

  #control = null;

  setup() {
    this.#control = this.shadowRoot.querySelector('.link');
    const label = this.shadowRoot.querySelector('.label');
    const apply = () => {
      label.classList.toggle('role-body', !mobile.matches);
      label.classList.toggle('role-body-xl', mobile.matches);
    };
    mobile.addEventListener('change', apply);
    apply();
  }

  /** El foco va al <a> o <button> interno. */
  focus(options) {
    if (this.#control) this.#control.focus(options);
    else super.focus(options);
  }

  update(changed) {
    if (changed.has('hasDropdown')) this.#renderControl();
    const control = this.#control;

    if (control.localName === 'a') {
      if (this.href !== null) control.setAttribute('href', this.href);
      else control.removeAttribute('href');
      if (this.current) control.setAttribute('aria-current', 'page');
      else control.removeAttribute('aria-current');
    } else {
      control.setAttribute('aria-expanded', String(this.open));
    }
    // Current también se marca en el botón (indicador), sin aria-current.
    control.classList.toggle('current', this.current);
  }

  // <a> para navegar, <button> para abrir el menú. Se cambia el elemento
  // conservando su contenido.
  #renderControl() {
    const tag = this.hasDropdown ? 'button' : 'a';
    const current = this.#control;
    if (current.localName === tag) return;
    const next = document.createElement(tag);
    next.className = current.className;
    if (tag === 'button') {
      next.type = 'button';
      next.addEventListener('click', () => this.emit('toggle', { open: !this.open }));
    }
    next.append(...current.childNodes);
    current.replaceWith(next);
    this.#control = next;
  }
}

ArqNavLink.define();

export { ArqNavLink };
