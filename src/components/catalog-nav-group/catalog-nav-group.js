// catalog-nav-group · Figma 1035:2410 · ficha doc/catalog-nav-group (1426:2110)
//
// Grupo desplegable del sidebar de catálogo: una macrofamilia (Interior,
// Exterior, Lámparas…) con su lista de catalog-nav-item.
//
//   <arq-catalog-nav-group open>
//     <span slot="label">Interior</span>
//     <arq-catalog-nav-item href="…" selected>Todo interior</arq-catalog-nav-item>
//     <arq-catalog-nav-item href="…">Embutir</arq-catalog-nav-item>
//   </arq-catalog-nav-group>
//
// - Encabezado <button> con aria-expanded (Disclosure); la lista queda en el
//   HTML aunque esté cerrada (indexable).
// - Open: lo decide el HTML (el grupo de la categoría actual). Si ningún grupo
//   viene abierto, catalog-nav abre el que tiene el ítem elegido.
// - El ícono +/– tiene las medidas de icon-button Size=Default (24, ícono 16)
//   pero es parte del botón, no otro botón.

import { ArqElement } from '../../base/arq-element.js';
import { Disclosure } from '../../base/disclosure.js';
import { icon } from '../../base/icons.js';
import css from './catalog-nav-group.css?inline';

class ArqCatalogNavGroup extends ArqElement {
  static tag = 'arq-catalog-nav-group';
  static styles = css;
  static properties = {
    open: { type: Boolean }, // Open
  };
  static template =
    `<div class="group">` +
    `<button type="button" class="header">` +
    `<span class="label role-label"><slot name="label"></slot></span>` +
    `<span class="icon-box">${icon('plus')}${icon('minus')}</span>` +
    `</button>` +
    `<div class="items" role="list" part="panel"><slot></slot></div>` +
    `</div>`;

  setup() {
    this.disclosure = new Disclosure(this, {
      trigger: this.shadowRoot.querySelector('.header'),
      panel: this.shadowRoot.querySelector('.items'),
    });
  }
}

ArqCatalogNavGroup.define();

export { ArqCatalogNavGroup };
