// catalog-nav-item · Figma 1035:2382 · ficha doc/catalog-nav-item (1426:2295)
//
// Link a una subcategoría del catálogo, dentro de catalog-nav-group.
//
//   <arq-catalog-nav-item href="/arq/productos?…" selected>Todo interior</arq-catalog-nav-item>
//   <arq-catalog-nav-item href="/arq/productos?…">Embutir</arq-catalog-nav-item>
//
// - Es un <a href>; el texto llega por slot (queda en el HTML del embed).
// - Selected = la subcategoría actual: guion "—", role/body-regular en
//   color/text/primary y aria-current="page". Una sola por lista.
// - Size: Default (role/body) o Large (role/body-lg). Hover y Focus son CSS.
// - Va con role="listitem": el grupo es la lista.

import { ArqElement } from '../../base/arq-element.js';
import css from './catalog-nav-item.css?inline';

class ArqCatalogNavItem extends ArqElement {
  static tag = 'arq-catalog-nav-item';
  static styles = css;
  static properties = {
    size: { type: String, values: ['default', 'large'], default: 'default' }, // Size
    selected: { type: Boolean }, // State=Selected
    href: { type: String },
  };
  static template = `<a class="link"><span class="indicator" aria-hidden="true"></span><span class="label"><slot></slot></span></a>`;

  setup() {
    this.setAttribute('role', 'listitem');
  }

  update() {
    const link = this.shadowRoot.querySelector('.link');
    if (this.href) link.setAttribute('href', this.href);
    else link.removeAttribute('href');
    if (this.selected) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
    const large = this.size === 'large';
    const role = `role-body${large ? '-lg' : ''}${this.selected ? '-regular' : ''}`;
    this.shadowRoot.querySelector('.label').className = `label ${role}`;
  }
}

ArqCatalogNavItem.define();

export { ArqCatalogNavItem };
