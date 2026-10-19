// catalog-nav-group · Figma 1035:2410 · ficha doc/catalog-nav-group (1426:2110)
//
// Grupo desplegable del sidebar de catálogo: una macrofamilia (Interior,
// Exterior, Lámparas…) con su lista de catalog-nav-item.
//
//   <arq-catalog-nav-group open selected>
//     <span slot="label">Interior</span>
//     <arq-catalog-nav-item href="…" selected>Todo interior</arq-catalog-nav-item>
//     <arq-catalog-nav-item href="…">Embutir</arq-catalog-nav-item>
//   </arq-catalog-nav-group>
//
// - Selected (Figma: prop Selected del set): el grupo guarda la categoría
//   actual. Es el grupo, no el ítem, el que le dice a catalog-nav cuál abrir y
//   qué texto mostrar en Mobile. Si el HTML solo marca un ítem como selected,
//   el grupo se marca solo; si se marca el grupo a mano, se respeta. Figma no
//   dibuja diferencia entre Selected=False y Selected=True: es estado, no
//   estilo.
// - Encabezado <button> con aria-expanded (Disclosure); la lista queda en el
//   HTML aunque esté cerrada (indexable).
// - Open: lo decide el HTML (el grupo de la categoría actual). Si ningún grupo
//   viene abierto, catalog-nav abre el que tiene el ítem elegido.
// - El chevron (abajo cerrado, arriba abierto) tiene las medidas de
//   icon-button Size=Default (24, ícono 16) pero es parte del botón, no otro
//   botón. Es un solo chevron-down que gira al abrir.
// - La lista se despliega y se pliega animando el alto (Disclosure
//   animateHeight, como faq-item; decisión 2026-10-19 · Sidebar de catálogo:
//   desplegar suave). .items es el panel; .items-clip, lo que se recorta.
// - Selected: el grupo de la categoría actual. Sin cambio visual; lo pone
//   catalog-nav en el grupo que tiene el catalog-nav-item elegido.

import { ArqElement } from '../../base/arq-element.js';
import { Disclosure } from '../../base/disclosure.js';
import { icon } from '../../base/icons.js';
import css from './catalog-nav-group.css?inline';

class ArqCatalogNavGroup extends ArqElement {
  static tag = 'arq-catalog-nav-group';
  static styles = css;
  static properties = {
    open: { type: Boolean }, // Open
    selected: { type: Boolean }, // Selected (el grupo de la categoría actual)
  };
  static template =
    `<div class="group">` +
    `<button type="button" class="header">` +
    `<span class="label role-body-xl"><slot name="label"></slot></span>` +
    `<span class="icon-box">${icon('chevron-down')}</span>` +
    `</button>` +
    `<div class="items" part="panel"><div class="items-clip"><div class="items-inner"><div class="rail" role="list"><slot></slot></div></div></div></div>` +
    `</div>`;

  #auto = false; // selected lo puso el grupo al ver un ítem selected (no el HTML)

  setup() {
    this.disclosure = new Disclosure(this, {
      trigger: this.shadowRoot.querySelector('.header'),
      panel: this.shadowRoot.querySelector('.items'),
      animateHeight: true,
    });
    const sync = () => this.#syncSelected();
    this.shadowRoot.querySelector('slot:not([name])').addEventListener('slotchange', sync);
    new MutationObserver(sync).observe(this, { subtree: true, attributes: true, attributeFilter: ['selected'] });
    sync();
  }

  #syncSelected() {
    const hasItem = Boolean(this.querySelector(':scope > arq-catalog-nav-item[selected]'));
    if (hasItem && !this.selected) {
      this.#auto = true;
      this.selected = true;
    } else if (!hasItem && this.selected && this.#auto) {
      this.#auto = false;
      this.selected = false;
    }
  }
}

ArqCatalogNavGroup.define();

export { ArqCatalogNavGroup };
