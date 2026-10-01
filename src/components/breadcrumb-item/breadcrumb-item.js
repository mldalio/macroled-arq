// breadcrumb-item · Figma 1053:4430 · ficha doc/breadcrumb-item (1424:2126)
//
// Un nivel del breadcrumb: label (link) + separador "/" opcional. No se usa
// suelto: siempre dentro de <arq-breadcrumb>.
//
//   <arq-breadcrumb-item href="/arq/colecciones" show-separator>Colecciones</arq-breadcrumb-item>
//   <arq-breadcrumb-item current>Kanu Jardín</arq-breadcrumb-item>
//
// State=Hover es :hover. State=Current es la prop current: sin link ni
// separador, con aria-current="page".

import { ArqElement } from '../../base/arq-element.js';
import css from './breadcrumb-item.css?inline';

class ArqBreadcrumbItem extends ArqElement {
  static tag = 'arq-breadcrumb-item';
  static styles = css;
  static properties = {
    href: { type: String },
    showSeparator: { type: Boolean }, // Show separator
    current: { type: Boolean }, // State=Current
  };
  static template = `<span class="item role-label"><span class="label"><slot></slot></span><span class="separator" aria-hidden="true" hidden>/</span></span>`;

  #internals = this.attachInternals();

  setup() {
    // Es un <li> del <ol> de <arq-breadcrumb>.
    this.#internals.role = 'listitem';
    this.shadowRoot.querySelector('slot').addEventListener('slotchange', () => this.#syncName());
  }

  update(changed) {
    if (changed.has('href') || changed.has('current')) this.#renderLabel();
    const separator = this.shadowRoot.querySelector('.separator');
    // Current nunca lleva separador, aunque tenga show-separator.
    separator.hidden = !this.showSeparator || this.current;
  }

  // Link si tiene href y no es la página actual; si no, texto.
  #renderLabel() {
    const current = this.shadowRoot.querySelector('.label');
    const isLink = this.href !== null && !this.current;
    const next = document.createElement(isLink ? 'a' : 'span');
    next.className = 'label';
    if (isLink) next.setAttribute('href', this.href);
    if (this.current) next.setAttribute('aria-current', 'page');
    next.append(...current.childNodes);
    current.replaceWith(next);
    this.#syncName();
  }

  // role/label pone el texto en mayúsculas y Chrome arma el nombre accesible
  // del link con esa transformación ("COLECCIONES"); algunos lectores lo leen
  // como sigla. El link lleva el nombre en caja normal, como llega del HTML.
  // Solo en links: en un <span> (Current) ARIA no permite aria-label.
  #syncName() {
    const label = this.shadowRoot.querySelector('.label');
    const text = this.textContent.trim();
    if (label.localName === 'a' && text) label.setAttribute('aria-label', text);
    else label.removeAttribute('aria-label');
  }
}

ArqBreadcrumbItem.define();

export { ArqBreadcrumbItem };
