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
// - State Error (2924:44879): la búsqueda falló. Mismo dibujo que No
//   results, con «No se pudo completar la búsqueda.» y «Probá de nuevo en unos
//   minutos.» (la redacción de error del resto del sitio).
// - Con el campo vacío no se muestra: lo oculta el navbar (hidden).
// - search-screen (mobile) usa el mismo componente, a todo el ancho.

import { ArqElement } from '../../base/arq-element.js';
import { icon } from '../../base/icons.js';
import css from './search-dropdown.css?inline';

const TEXT = {
  help: 'Probá con otro término, revisá la ortografía o buscá por código de producto (SKU).',
  errorTitle: 'No se pudo completar la búsqueda.',
  errorHelp: 'Probá de nuevo en unos minutos.',
};

class ArqSearchDropdown extends ArqElement {
  static tag = 'arq-search-dropdown';
  static styles = css;
  static properties = {
    state: { type: String, values: ['results', 'no-results', 'error'], default: 'results' }, // State
    term: { type: String, default: '' },
    exploreHref: { type: String, default: '/arq/productos' },
  };
  static template =
    `<div class="dropdown">` +
    `<div class="results"><slot></slot></div>` +
    `<div class="empty">` +
    `<div class="message">` +
    `<p class="title role-body-strong"></p>` +
    `<p class="help role-body-sm"></p>` +
    `</div>` +
    `<a class="explore role-body-sm">Explorá nuestros productos${icon('arrow-right')}</a>` +
    `</div>` +
    `</div>`;

  update() {
    const root = this.shadowRoot;
    const error = this.state === 'error';
    const empty = this.state === 'no-results' || error;
    root.querySelector('.results').hidden = empty;
    root.querySelector('.empty').hidden = !empty;
    root.querySelector('.title').textContent = error ? TEXT.errorTitle : `No se encontraron resultados para “${this.term ?? ''}”`;
    root.querySelector('.help').textContent = error ? TEXT.errorHelp : TEXT.help;
    root.querySelector('.explore').setAttribute('href', this.exploreHref ?? '/arq/productos');
  }
}

ArqSearchDropdown.define();

export { ArqSearchDropdown };
