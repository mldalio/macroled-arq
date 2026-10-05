// search-see-all · Figma 795:2206 · ficha doc/search-see-all (1446:6955)
//
// Última fila de los resultados: lleva a la página con todos los resultados.
//
//   <arq-search-see-all href="/arq/productos?q=kanu" term="kanu" count="12"></arq-search-see-all>
//
// - Texto "Ver todos los resultados (N) para “término”" en role/body-sm,
//   color/text/tertiary; el término en role/body-sm-medium y
//   color/text/primary (el set usa Medium; la descripción dice SemiBold:
//   manda el set).
// - Íconos (lupa y flecha) en color/icon/tertiary.
// - State: Hover (:hover, fondo color/surface/hover) y Focus (:focus-visible).

import { ArqElement } from '../../base/arq-element.js';
import { icon } from '../../base/icons.js';
import css from './search-see-all.css?inline';

class ArqSearchSeeAll extends ArqElement {
  static tag = 'arq-search-see-all';
  static styles = css;
  static properties = {
    href: { type: String },
    term: { type: String, default: '' },
    count: { type: Number },
  };
  static template =
    `<a class="row">` +
    `${icon('search')}` +
    `<span class="text role-body-sm"><span class="lead"></span><span class="term role-body-sm-medium"></span></span>` +
    `${icon('arrow-right')}` +
    `</a>`;

  focus(options) {
    this.shadowRoot.querySelector('a').focus(options);
  }

  click() {
    this.shadowRoot.querySelector('a').click();
  }

  update() {
    const root = this.shadowRoot;
    const link = root.querySelector('a');
    if (this.href) link.setAttribute('href', this.href);
    else link.removeAttribute('href');
    const count = Number.isFinite(this.count) ? ` (${this.count})` : '';
    root.querySelector('.lead').textContent = `Ver todos los resultados${count} para `;
    root.querySelector('.term').textContent = `“${this.term ?? ''}”`;
  }
}

ArqSearchSeeAll.define();

export { ArqSearchSeeAll };
