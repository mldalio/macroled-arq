// breadcrumb · Figma 1244:12667 · ficha doc/breadcrumb-item (1424:2126)
//
// Migas de pan: <nav aria-label="Migas de pan"> con una lista (role="list") de
// <arq-breadcrumb-item>. El último es la página actual (current), sin
// separador; los demás llevan show-separator.
//
//   <arq-breadcrumb>
//     <arq-breadcrumb-item href="/arq/colecciones" show-separator>Colecciones</arq-breadcrumb-item>
//     <arq-breadcrumb-item href="/arq/colecciones/kanu" show-separator>Kanu</arq-breadcrumb-item>
//     <arq-breadcrumb-item current>Kanu Jardín</arq-breadcrumb-item>
//   </arq-breadcrumb>
//
// Levels (3 · 2) no es una prop: la cantidad de niveles es la cantidad de ítems.

import { ArqElement } from '../../base/arq-element.js';
import '../breadcrumb-item/breadcrumb-item.js';
import css from './breadcrumb.css?inline';

const LABEL = 'Migas de pan';

class ArqBreadcrumb extends ArqElement {
  static tag = 'arq-breadcrumb';
  static styles = css;
  // La lista es un role="list" y no un <ol>: un <ol> solo admite <li> como hijos
  // directos, y los ítems son <arq-breadcrumb-item> (con role="listitem").
  static template = `<nav aria-label="${LABEL}"><div class="list" role="list"><slot></slot></div></nav>`;
}

ArqBreadcrumb.define();

export { ArqBreadcrumb };
