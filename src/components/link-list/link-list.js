// link-list · Figma 1303:4377 · ficha doc/link-list (1452:5836)
//
// Lista corta de links con título ("Recursos técnicos" en Contacto).
//
//   <arq-link-list>
//     <span slot="title">Recursos técnicos</span>
//     <arq-button type="underline" show-underline show-icon icon="arrow-right" href="/arq/descargas">Centro de descargas</arq-button>
//     <arq-button type="underline" show-underline show-icon icon="arrow-right" href="/arq/glosario">Glosario técnico</arq-button>
//   </arq-link-list>
//
// - Title (slot title): role/label en color/text/tertiary. También es el
//   nombre del <nav>.
// - Links: arq-button Underline con ícono (slot por defecto). Show link 3 no
//   es prop: la cantidad es libre (la ficha recomienda hasta 3).
// - Es un <nav> con una lista (role="list" + role="listitem" en cada link).

import { ArqElement } from '../../base/arq-element.js';
import css from './link-list.css?inline';

let uid = 0;

class ArqLinkList extends ArqElement {
  static tag = 'arq-link-list';
  static styles = css;
  static template =
    `<nav class="list">` +
    `<span class="title role-label"><slot name="title"></slot></span>` +
    `<div class="links" role="list"><slot></slot></div>` +
    `</nav>`;

  setup() {
    const root = this.shadowRoot;
    const title = root.querySelector('.title');
    title.id = `arq-link-list-${++uid}`;
    root.querySelector('nav').setAttribute('aria-labelledby', title.id);
    const slot = root.querySelector('slot:not([name])');
    const sync = () => {
      for (const link of slot.assignedElements()) link.setAttribute('role', 'listitem');
    };
    slot.addEventListener('slotchange', sync);
    sync();
  }
}

ArqLinkList.define();

export { ArqLinkList };
