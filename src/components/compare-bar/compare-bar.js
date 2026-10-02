// compare-bar · Figma 1233:3963 · ficha doc/compare-bar
//
// Barra fija inferior para comparar productos (hasta 3), en Productos y
// Colecciones. Aparece cuando hay al menos un producto elegido con "Comparar".
//
//   <arq-compare-bar></arq-compare-bar>
//
//   bar.add({ sku, name, meta, image });   // al marcar "Comparar" en una product-card
//   bar.remove(sku);                       // al desmarcarlo
//   bar.addEventListener('arq:compare-change', (e) => sincronizarCards(e.detail.items));
//
// - Dark local (DESIGN.md §2): el contenedor interno lleva data-arq-theme="dark";
//   quien arma la página no pone nada.
// - Título "Productos seleccionados" + count-badge; 3 lugares (compare-slot:
//   Default en Desktop, Compact en Mobile); "Borrar todo" y "Comparar".
// - "Comparar" lleva a /arq/comparativa?sku=SKU1,SKU2,SKU3 (decisión 2026-10-02
//   · Comparativa; href base en el atributo href).
// - La selección se guarda en localStorage (arq:compare), así sigue al cambiar
//   de página o de filtros. add() con 3 elegidos no agrega y devuelve false.
// - Emite arq:compare-change { items } cuando cambia la selección.

import { ArqElement } from '../../base/arq-element.js';
import '../button/button.js';
import '../count-badge/count-badge.js';
import '../divider/divider.js';
import '../compare-slot/compare-slot.js';
import css from './compare-bar.css?inline';

const KEY = 'arq:compare';
const MAX = 3;
const MOBILE = matchMedia('(max-width: 767px)');

function read() {
  try {
    const list = JSON.parse(localStorage.getItem(KEY) ?? '[]');
    return Array.isArray(list) ? list.filter((item) => item && item.sku).slice(0, MAX) : [];
  } catch {
    return [];
  }
}

function write(items) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {}
}

class ArqCompareBar extends ArqElement {
  static tag = 'arq-compare-bar';
  static styles = css;
  static properties = {
    href: { type: String, default: '/arq/comparativa' }, // página de la comparativa
  };
  static template =
    `<section class="bar" data-arq-theme="dark" aria-label="Comparar productos" hidden>` +
    `<div class="head">` +
    `<p class="title role-body-lg"><span>Productos seleccionados</span><arq-count-badge class="count"></arq-count-badge></p>` +
    `<arq-button type="underline" show-underline class="clear clear-mobile">Borrar todo</arq-button>` +
    `</div>` +
    `<div class="row">` +
    `<div class="slots"></div>` +
    `<div class="actions">` +
    `<arq-button type="underline" show-underline class="clear clear-desktop">Borrar todo</arq-button>` +
    `<arq-button class="go">Comparar</arq-button>` +
    `</div>` +
    `</div>` +
    `</section>`;

  #items = read();

  /** Productos elegidos: [{ sku, name, meta, image }]. */
  get items() {
    return [...this.#items];
  }

  set items(list) {
    this.#items = (Array.isArray(list) ? list : []).filter((item) => item && item.sku).slice(0, MAX);
    this.#changed();
  }

  setup() {
    const root = this.shadowRoot;
    for (const button of root.querySelectorAll('.clear')) button.addEventListener('click', () => this.clear());
    root.querySelector('.slots').addEventListener('arq:remove', (event) => {
      event.stopPropagation();
      this.remove(event.detail.sku);
    });
    MOBILE.addEventListener('change', () => this.#render());
    // Otra pestaña cambió la selección
    addEventListener('storage', (event) => {
      if (event.key !== KEY) return;
      this.#items = read();
      this.#render();
      this.emit('compare-change', { items: this.items });
    });
    this.#render();
  }

  update(changed) {
    if (changed.has('href')) this.#render();
  }

  /** Agrega un producto. Devuelve false si ya hay 3 (o si ya estaba). */
  add(item) {
    if (!item?.sku || this.has(item.sku) || this.#items.length >= MAX) return false;
    this.#items.push({ sku: item.sku, name: item.name ?? '', meta: item.meta ?? '', image: item.image ?? '' });
    this.#changed();
    return true;
  }

  /** Quita un producto por SKU. */
  remove(sku) {
    const before = this.#items.length;
    this.#items = this.#items.filter((item) => item.sku !== sku);
    if (this.#items.length !== before) this.#changed();
  }

  /** "Borrar todo". */
  clear() {
    if (!this.#items.length) return;
    this.#items = [];
    this.#changed();
  }

  has(sku) {
    return this.#items.some((item) => item.sku === sku);
  }

  #changed() {
    write(this.#items);
    this.#render();
    this.emit('compare-change', { items: this.items });
  }

  #render() {
    const root = this.shadowRoot;
    if (!root.querySelector('.bar')) return;
    const items = this.#items;
    root.querySelector('.bar').hidden = items.length === 0;
    root.querySelector('.count').count = items.length;
    const compact = MOBILE.matches;
    const slots = root.querySelector('.slots');
    const nodes = [];
    for (let i = 0; i < MAX; i++) {
      if (i > 0 && !compact) {
        const divider = document.createElement('arq-divider');
        divider.setAttribute('orientation', 'vertical');
        divider.setAttribute('emphasis', 'default');
        nodes.push(divider);
      }
      const item = items[i];
      const slot = document.createElement('arq-compare-slot');
      slot.size = compact ? 'compact' : 'default';
      if (item) {
        slot.sku = item.sku;
        if (item.image) slot.image = item.image;
        const name = document.createElement('span');
        name.slot = 'name';
        name.textContent = item.name;
        const meta = document.createElement('span');
        meta.slot = 'meta';
        meta.textContent = item.meta;
        slot.append(name, meta);
      }
      nodes.push(slot);
    }
    slots.replaceChildren(...nodes);
    const go = root.querySelector('.go');
    const query = items.map((item) => encodeURIComponent(item.sku)).join(',');
    go.href = `${this.href ?? '/arq/comparativa'}?sku=${query}`;
  }
}

ArqCompareBar.define();

export { ArqCompareBar };
