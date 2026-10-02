// catalog-listing · contenedor de página (Final: Productos 1153:5679 · 1155:5837;
// filtros 1199:20568)
//
// Listado de Productos (y de Colecciones con unit="colecciones"): navegación
// de categorías, catalog-toolbar, grilla de product-card, filter-panel y
// compare-bar. Pide los datos a src/data/catalog.js, como el navbar
// (decisiones.md, 2026-10-02 · Listados y · Productos).
//
//   <arq-catalog-listing>
//     <arq-catalog-nav slot="nav" label="Categorías">…links de categoría…</arq-catalog-nav>
//     <h2 slot="filter-title">Filtrar</h2>
//   </arq-catalog-listing>
//
// - Categoría: sale de la URL (?environment=, ?application=, ?product_type=;
//   las URLs de categoría están PENDIENTES, docs/urls.md). Se marca sola el
//   catalog-nav-item cuyo href coincide con la página.
// - Filtros técnicos: las filas del filter-panel salen de los datos de la
//   categoría. "Ver N" aplica (arq:apply) y la grilla se vuelve a armar.
// - Comparar (solo Productos): "Comparar" de cada card suma o saca el producto
//   de la compare-bar (hasta 3; la selección se guarda en arq:compare).
// - Iluminar: lo resuelve catalog-toolbar (data-arq-theme en <html>).

import { ArqElement } from '../../base/arq-element.js';
import { listProducts, listCollections } from '../../data/catalog.js';
import '../catalog-toolbar/catalog-toolbar.js';
import '../filter-panel/filter-panel.js';
import '../filter-row/filter-row.js';
import '../checkbox/checkbox.js';
import '../compare-bar/compare-bar.js';
import '../grid/grid.js';
import '../product-card/product-card.js';
import '../swatch/swatch.js';
import css from './catalog-listing.css?inline';

const CATEGORY_PARAMS = { environment: 'environment', application: 'application', product_type: 'productType' };

const TEXT = {
  productos: { loading: 'Cargando productos…', empty: 'No hay productos con estos filtros.', error: 'No se pudieron cargar los productos. Probá de nuevo en unos minutos.' },
  colecciones: { loading: 'Cargando colecciones…', empty: 'No hay colecciones con estos filtros.', error: 'No se pudieron cargar las colecciones. Probá de nuevo en unos minutos.' },
};

class ArqCatalogListing extends ArqElement {
  static tag = 'arq-catalog-listing';
  static styles = css;
  static properties = {
    unit: { type: String, values: ['productos', 'colecciones'], default: 'productos' },
  };
  static template =
    `<div class="layout">` +
    `<div class="nav"><slot name="nav"></slot></div>` +
    `<div class="content">` +
    `<arq-catalog-toolbar class="toolbar" for="filters" show-iluminar></arq-catalog-toolbar>` +
    `<p class="status role-body" role="status"></p>` +
    `<arq-grid class="grid"></arq-grid>` +
    `</div>` +
    `</div>` +
    `<arq-filter-panel id="filters"><slot name="filter-title" slot="title"></slot></arq-filter-panel>` +
    `<arq-compare-bar class="compare"></arq-compare-bar>` +
    `<div class="compare-space" aria-hidden="true"></div>`;

  #category = {};
  #filters = {};
  #cards = new Map(); // product-card → datos de la card
  #request = 0;

  setup() {
    const root = this.shadowRoot;
    this.#category = categoryFromUrl();
    root.querySelector('slot[name="nav"]').addEventListener('slotchange', () => this.#markNav());

    const panel = root.querySelector('arq-filter-panel');
    panel.addEventListener('arq:filters', (event) => this.#count(event.detail.filters));
    panel.addEventListener('arq:apply', (event) => {
      this.#filters = event.detail.filters;
      this.#load();
    });

    const grid = root.querySelector('.grid');
    const bar = root.querySelector('.compare');
    grid.addEventListener('arq:compare', (event) => {
      const card = event.target;
      const data = this.#cards.get(card);
      if (!data) return;
      if (!event.detail.checked) bar.remove(data.sku);
      else if (!bar.add({ sku: data.sku, name: data.name, meta: data.meta, image: data.image })) card.compared = false; // ya hay 3
    });
    bar.addEventListener('arq:compare-change', () => {
      this.#syncCompared();
      requestAnimationFrame(() => this.#syncSpace());
    });

    // La compare-bar es fija abajo: un espacio de su alto al final del listado
    // para que no tape las últimas cards ni el footer (README de compare-bar).
    new ResizeObserver(() => this.#syncSpace()).observe(bar);
    requestAnimationFrame(() => this.#syncSpace());
  }

  #syncSpace() {
    const bar = this.shadowRoot.querySelector('.compare');
    const box = bar.shadowRoot?.querySelector('.bar');
    const height = !bar.hidden && box && !box.hidden ? box.getBoundingClientRect().height : 0;
    this.shadowRoot.querySelector('.compare-space').style.height = height ? `${height}px` : '';
  }

  update(changed) {
    if (!changed.has('unit')) return;
    const root = this.shadowRoot;
    root.querySelector('.toolbar').unit = this.unit;
    root.querySelector('arq-filter-panel').unit = this.unit;
    root.querySelector('.compare').hidden = this.unit !== 'productos';
    this.#load({ rows: true });
  }

  async #load({ rows = false } = {}) {
    const request = ++this.#request;
    const text = TEXT[this.unit] ?? TEXT.productos;
    this.setAttribute('aria-busy', 'true');
    if (rows) this.#status(text.loading);
    let result = null;
    try {
      result = await this.#list(this.#filters);
    } catch (error) {
      console.error('[arq] catalog-listing: no se pudo cargar el catálogo', error);
    }
    if (request !== this.#request) return;
    this.removeAttribute('aria-busy');

    const toolbar = this.shadowRoot.querySelector('.toolbar');
    if (!result) {
      toolbar.count = null;
      this.#render([]);
      this.#status(text.error);
      return;
    }
    if (rows) this.#renderRows(result.filters);
    toolbar.count = result.count;
    this.#render(result.cards);
    this.#status(result.count ? '' : text.empty);
  }

  #list(filters) {
    return this.unit === 'colecciones' ? listCollections({ filters }) : listProducts({ ...this.#category, filters });
  }

  // "Ver N productos" mientras se marcan filtros (el listado no cambia)
  async #count(filters) {
    const panel = this.shadowRoot.querySelector('arq-filter-panel');
    try {
      panel.count = (await this.#list(filters)).count;
    } catch {
      panel.count = null;
    }
  }

  #status(message) {
    const status = this.shadowRoot.querySelector('.status');
    status.textContent = message;
    status.hidden = !message;
  }

  #render(cards) {
    const compare = this.unit === 'productos';
    this.#cards = new Map(cards.map((data) => [this.#card(data, compare), data]));
    this.shadowRoot.querySelector('.grid').replaceChildren(...this.#cards.keys());
    if (compare) this.#syncCompared();
  }

  #card(data, compare) {
    const card = document.createElement('arq-product-card');
    card.href = data.href;
    card.image = data.image;
    card.imageHover = data.imageHover;
    card.imageLit = data.imageLit;
    card.imageHoverLit = data.imageHoverLit;
    card.showCompare = compare;
    // <h2>: en el listado las cards van directo debajo del <h1> del page-header
    // (sin section-header en el medio), así no se saltea un nivel.
    const title = document.createElement('h2');
    title.slot = 'name';
    title.textContent = data.name;
    card.append(title);
    // Productos muestra acabados (Figma 1153:5679); Colecciones, la meta.
    if (compare) {
      for (const name of data.finishes ?? []) {
        const swatch = document.createElement('arq-swatch');
        swatch.slot = 'finishes';
        swatch.textContent = name;
        card.append(swatch);
      }
    } else if (data.meta) {
      const meta = document.createElement('span');
      meta.slot = 'meta';
      meta.textContent = data.meta;
      card.append(meta);
    }
    return card;
  }

  #syncCompared() {
    const bar = this.shadowRoot.querySelector('.compare');
    for (const [card, data] of this.#cards) card.compared = bar.has(data.sku);
  }

  #renderRows(rows) {
    const panel = this.shadowRoot.querySelector('arq-filter-panel');
    for (const row of panel.querySelectorAll(':scope > arq-filter-row')) row.remove();
    for (const { name, label, options } of rows) {
      const row = document.createElement('arq-filter-row');
      const title = document.createElement('span');
      title.slot = 'label';
      title.textContent = label;
      row.append(title);
      for (const { value } of options) {
        const option = document.createElement('arq-checkbox');
        option.size = 'large';
        option.showLabel = true;
        option.setAttribute('name', name);
        option.value = String(value);
        option.textContent = String(value);
        row.append(option);
      }
      panel.append(row);
    }
    this.#count({});
  }

  // Marca el ítem de la categoría actual: el que enlaza a esta misma página.
  #markNav() {
    const nav = this.shadowRoot.querySelector('slot[name="nav"]').assignedElements()[0];
    if (!nav) return;
    const here = location.pathname + location.search;
    for (const item of nav.querySelectorAll('arq-catalog-nav-item')) {
      const href = item.getAttribute('href');
      item.selected = Boolean(href) && samePage(href, here);
    }
  }
}

function categoryFromUrl() {
  const params = new URLSearchParams(location.search);
  const category = {};
  for (const [param, key] of Object.entries(CATEGORY_PARAMS)) {
    const value = params.get(param);
    if (value) category[key] = value;
  }
  return category;
}

function samePage(href, here) {
  const url = new URL(href, location.href);
  const sorted = (search) => [...new URLSearchParams(search)].sort().join('&');
  const current = new URL(here, location.href);
  return url.pathname.replace(/\/$/, '') === current.pathname.replace(/\/$/, '') && sorted(url.search) === sorted(current.search);
}

ArqCatalogListing.define();

export { ArqCatalogListing };
