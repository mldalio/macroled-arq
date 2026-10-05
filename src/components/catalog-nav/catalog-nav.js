// catalog-nav · Figma 1035:2411 (+ catalog-nav-mobile 1207:3314 y
// catalog-nav-trigger 1215:3337) · fichas doc/catalog-nav (1426:1839),
// doc/catalog-nav-mobile (1427:2053) y doc/catalog-nav-trigger (1427:2306)
//
// Navegación de categorías de Productos y Colecciones: una lista de
// catalog-nav-group. Un solo componente para Desktop y Mobile (decisión
// 2026-10-02 · catalog-nav): los links están una sola vez en el HTML.
//
//   <arq-catalog-nav label="Categorías">
//     <arq-catalog-nav-group open>
//       <span slot="label">Interior</span>
//       <arq-catalog-nav-item href="…" selected>Todo interior</arq-catalog-nav-item>
//       …
//     </arq-catalog-nav-group>
//     <arq-catalog-nav-group><span slot="label">Exterior</span>…</arq-catalog-nav-group>
//   </arq-catalog-nav>
//
// - Desde 1024 px: sidebar con los grupos (catalog-nav).
// - Hasta 1023 px: catalog-nav-mobile. Un encabezado (catalog-nav-trigger,
//   <button> con aria-expanded) muestra la selección actual; al tocarlo se
//   abren los mismos grupos. Open es la prop open (solo cuenta en Mobile).
// - El texto del encabezado es el del catalog-nav-item elegido (selected).
// - Si ningún grupo viene abierto, se abre el que tiene el ítem elegido.
// - Al elegir un ítem en Mobile, el panel se cierra.

import { ArqElement } from '../../base/arq-element.js';
import { Disclosure } from '../../base/disclosure.js';
import { icon } from '../../base/icons.js';
import '../catalog-nav-group/catalog-nav-group.js';
import '../catalog-nav-item/catalog-nav-item.js';
import css from './catalog-nav.css?inline';

class ArqCatalogNav extends ArqElement {
  static tag = 'arq-catalog-nav';
  static styles = css;
  static properties = {
    open: { type: Boolean }, // catalog-nav-mobile Open
    label: { type: String, default: 'Categorías' }, // nombre del <nav>
  };
  static template =
    `<nav class="nav">` +
    `<button type="button" class="trigger">` +
    `<span class="current"><span class="indicator" aria-hidden="true"></span><span class="current-label role-body-regular"></span></span>` +
    `<span class="icon-box">${icon('plus')}${icon('minus')}</span>` +
    `</button>` +
    `<div class="panel" part="panel"><slot></slot></div>` +
    `</nav>`;

  setup() {
    this.disclosure = new Disclosure(this, {
      trigger: this.shadowRoot.querySelector('.trigger'),
      panel: this.shadowRoot.querySelector('.panel'),
    });
    const sync = () => {
      this.#syncCurrent();
      this.#openCurrentGroup();
    };
    this.shadowRoot.querySelector('slot').addEventListener('slotchange', sync);
    new MutationObserver(sync).observe(this, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['selected'] });
    // Mobile: al elegir una subcategoría se cierra el panel.
    this.addEventListener('click', (event) => {
      if (event.target.closest?.('arq-catalog-nav-item')) this.disclosure.hide();
    });
    // El sidebar funciona como índice: abrir un grupo lleva a su primer link
    // ("Todo interior", "Todo exterior", etc.), no deja un acordeón sin
    // cambiar el listado. Se activa el <a> real para que Webflow y la demo
    // conserven su navegación normal.
    this.addEventListener('arq:toggle', (event) => {
      const group = event.target;
      if (group.localName !== 'arq-catalog-nav-group' || !event.detail.open) return;
      for (const candidate of this.querySelectorAll('arq-catalog-nav-group')) candidate.open = candidate === group;
      group.querySelector(':scope > arq-catalog-nav-item')?.shadowRoot?.querySelector('a')?.click();
    });
    sync();
    this.#openCurrentGroup();
  }

  update(changed) {
    if (changed.has('label')) this.shadowRoot.querySelector('.nav').setAttribute('aria-label', this.label ?? '');
  }

  #selected() {
    return this.querySelector('arq-catalog-nav-item[selected]');
  }

  #syncCurrent() {
    const item = this.#selected();
    this.shadowRoot.querySelector('.current-label').textContent = item ? item.textContent.trim() : this.label ?? '';
    this.shadowRoot.querySelector('.indicator').hidden = !item;
  }

  #openCurrentGroup() {
    const group = this.#selected()?.closest('arq-catalog-nav-group');
    if (!group) return;
    for (const candidate of this.querySelectorAll('arq-catalog-nav-group')) candidate.open = candidate === group;
  }
}

ArqCatalogNav.define();

export { ArqCatalogNav };
