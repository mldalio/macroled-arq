// search-dropdown · Figma 796:2271 · ficha doc/search-dropdown (1446:7088)
//
// Resultados de la búsqueda en desktop, debajo de search-field y con su mismo
// ancho (layout/search-field; lo pone el navbar).
//
//   <arq-search-dropdown term="kanu">
//     <arq-search-result href="…">Kanu Jardín<span slot="meta">KANU-J-…</span></arq-search-result>
//     <arq-search-see-all href="/arq/productos?q=kanu" term="kanu" count="12"></arq-search-see-all>
//   </arq-search-dropdown>
//   <arq-search-dropdown state="no-results" term="lámpara roja"></arq-search-dropdown>
//
// - State: Results (los search-result y el search-see-all llegan por slot) o
//   No results: título "No se encontraron resultados para “término”"
//   (role/body-strong), ayuda (role/body-sm, color/text/tertiary) y el link
//   "Explorá nuestros productos" (explore-href).
// - Con el campo vacío no se muestra: lo oculta el navbar (hidden).
// - search-screen (mobile) usa el mismo componente, a todo el ancho.

import { ArqElement } from '../../base/arq-element.js';
import { icon } from '../../base/icons.js';
import css from './search-dropdown.css?inline';

class ArqSearchDropdown extends ArqElement {
  static tag = 'arq-search-dropdown';
  static styles = css;
  static properties = {
    state: { type: String, values: ['results', 'no-results'], default: 'results' }, // State
    term: { type: String, default: '' },
    exploreHref: { type: String, default: '/arq/productos' },
  };
  static template =
    `<div class="dropdown">` +
    `<div class="results"><slot></slot></div>` +
    `<div class="empty">` +
    `<div class="message">` +
    `<p class="title role-body-strong"></p>` +
    `<p class="help role-body-sm">Probá con otro término, revisá la ortografía o buscá por código de producto (SKU).</p>` +
    `</div>` +
    `<a class="explore role-body-sm">Explorá nuestros productos${icon('arrow-right')}</a>` +
    `</div>` +
    `</div>`;

  update() {
    const root = this.shadowRoot;
    const empty = this.state === 'no-results';
    root.querySelector('.results').hidden = empty;
    root.querySelector('.empty').hidden = !empty;
    root.querySelector('.title').textContent = `No se encontraron resultados para “${this.term ?? ''}”`;
    root.querySelector('.explore').setAttribute('href', this.exploreHref ?? '/arq/productos');
  }
}

ArqSearchDropdown.define();

export { ArqSearchDropdown };
