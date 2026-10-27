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
//   No results: título «No encontramos resultados para «término».»
//   (role/heading-2), ayuda (role/body-regular, color/text/tertiary) y un
//   button Underline con flecha, «Todos los productos».
//   La redacción es la del vacío del buscador de Descargas (variants-table).
// - State Error (2924:44879): la búsqueda falló. Mismo dibujo que No
//   results, con «No se pudo completar la búsqueda.» y «Probá de nuevo en unos
//   minutos.» (la redacción de error del resto del sitio).
// - Con el campo vacío no se muestra: lo oculta el navbar (hidden).
// - search-screen (mobile) usa el mismo componente, a todo el ancho.

import { ArqElement } from '../../base/arq-element.js';
import '../button/button.js';
import { categoryHref } from '../../data/catalog.js';
import css from './search-dropdown.css?inline';

const TEXT = {
  title: (term) => `No encontramos resultados para «${term}».`,
  help: 'Probá con otro nombre, revisá la ortografía o buscá por SKU.',
  errorTitle: 'No se pudo completar la búsqueda.',
  errorHelp: 'Probá de nuevo en unos minutos.',
};

// TODO (urls): las URLs de categoría están pendientes (docs/urls.md); categoryHref las arma.
const LINKS = [
  { label: 'Todos los productos', href: categoryHref() },
];

class ArqSearchDropdown extends ArqElement {
  static tag = 'arq-search-dropdown';
  static styles = css;
  static properties = {
    state: { type: String, values: ['results', 'no-results', 'error'], default: 'results' }, // State
    term: { type: String, default: '' },
  };
  static template =
    `<div class="dropdown">` +
    `<div class="results"><slot></slot></div>` +
    `<div class="empty">` +
    `<div class="message">` +
    `<p class="title role-heading-2"></p>` +
    `<p class="help role-body-regular"></p>` +
    `</div>` +
    `<nav class="explore" aria-label="Explorar productos">` +
    LINKS.map((l) => `<arq-button type="underline" show-underline show-icon icon="arrow-right" href="${l.href}">${l.label}</arq-button>`).join('') +
    `</nav>` +
    `</div>` +
    `</div>`;

  update() {
    const root = this.shadowRoot;
    const error = this.state === 'error';
    const empty = this.state === 'no-results' || error;
    root.querySelector('.results').hidden = empty;
    root.querySelector('.empty').hidden = !empty;
    root.querySelector('.title').textContent = error ? TEXT.errorTitle : TEXT.title(this.term ?? '');
    root.querySelector('.help').textContent = error ? TEXT.errorHelp : TEXT.help;
  }
}

ArqSearchDropdown.define();

export { ArqSearchDropdown };
