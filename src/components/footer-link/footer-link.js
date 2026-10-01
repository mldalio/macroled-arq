// footer-link · Figma 788:2930 · ficha doc/footer-link (1442:4534)
//
// Link del footer. Show icon agrega un ícono a la izquierda (solo en la
// columna Redes: Instagram, YouTube).
//
//   <arq-footer-link href="/arq/productos">Productos</arq-footer-link>
//   <arq-footer-link href="https://instagram.com/…" show-icon icon="instagram" target="_blank">Instagram</arq-footer-link>
//
// State de Figma: Hover, Pressed y Focus son :hover, :active y :focus-visible.

import { ArqElement } from '../../base/arq-element.js';
import { icon } from '../../base/icons.js';
import css from './footer-link.css?inline';

class ArqFooterLink extends ArqElement {
  static tag = 'arq-footer-link';
  static styles = css;
  static properties = {
    showIcon: { type: Boolean }, // Show icon
    icon: { type: String, default: 'instagram' }, // Icon (default de Figma)
    href: { type: String },
    target: { type: String },
  };
  static template = `<a class="link role-body"><span class="leading" hidden></span><span class="label"><slot></slot></span></a>`;

  update(changed) {
    const link = this.shadowRoot.querySelector('.link');
    if (this.href !== null) link.setAttribute('href', this.href);
    else link.removeAttribute('href');
    if (this.target) link.setAttribute('target', this.target);
    else link.removeAttribute('target');
    if (this.target === '_blank') link.setAttribute('rel', 'noopener');
    else link.removeAttribute('rel');

    const leading = this.shadowRoot.querySelector('.leading');
    if (changed.has('icon')) leading.innerHTML = icon(this.icon);
    leading.hidden = !this.showIcon;
  }
}

ArqFooterLink.define();

export { ArqFooterLink };
