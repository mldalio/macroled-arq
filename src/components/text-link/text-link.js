// text-link · Figma 2965:9774 · ficha doc/text-link: TODO
//
// Link de texto: un nombre o una frase que lleva a otra página (el nombre de un
// producto en Descargas, una pieza del armado en la ficha). Es el link que
// sigue el estilo del texto que lo rodea: sin padding, con la línea pegada al
// texto y sin la animación de un botón. No confundir con button Underline (es un
// botón: padding propio, 16/24 y línea que se dibuja en hover) ni con nav-link,
// footer-link o breadcrumb-item (cada uno con su lugar y sus estados).
//
//   <arq-text-link href="/arq/productos/dao">Daö</arq-text-link>
//   <arq-text-link size="compact" href="/arq/productos/dao?sku=DAO-C-B">Mini Daö Cabezal</arq-text-link>
//
// - size: default (role/body-regular, 16) · compact (role/body-compact-regular, 14).
// - La línea (border/default, 1 px) va en el borde inferior de una caja de texto
//   ajustada (1em + border/strong) y en el color del texto. Hover y Pressed
//   atenúan texto y línea a color/text/tertiary (State de Figma: :hover y :active).
// - Foco: anillo separado (DESIGN.md §7).
// - El texto llega por slot (indexable). Pensado para una línea: si el texto baja
//   de renglón, la línea queda debajo de todo el bloque.

import { ArqElement } from '../../base/arq-element.js';
import css from './text-link.css?inline';

class ArqTextLink extends ArqElement {
  static tag = 'arq-text-link';
  static styles = css;
  static properties = {
    size: { type: String, values: ['default', 'compact'], default: 'default' }, // Size
    href: { type: String },
    target: { type: String },
    label: { type: String }, // nombre accesible del link (aria-label), si el texto visible no alcanza
  };
  static template = `<a class="link"><slot></slot></a>`;

  update() {
    const link = this.shadowRoot.querySelector('.link');
    link.classList.toggle('role-body-regular', this.size !== 'compact');
    link.classList.toggle('role-body-compact-regular', this.size === 'compact');
    if (this.href !== null) link.setAttribute('href', this.href);
    else link.removeAttribute('href');
    if (this.label) link.setAttribute('aria-label', this.label);
    else link.removeAttribute('aria-label');
    if (this.target) link.setAttribute('target', this.target);
    else link.removeAttribute('target');
    if (this.target === '_blank') link.setAttribute('rel', 'noopener');
    else link.removeAttribute('rel');
  }

  /** El foco va al <a> interno. */
  focus(options) {
    this.shadowRoot.querySelector('.link')?.focus(options);
  }
}

ArqTextLink.define();

export { ArqTextLink };
