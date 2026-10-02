// catalog-toolbar · Figma 1244:4058 · ficha doc/catalog-toolbar (1427:2499)
//
// Barra sobre la grilla de Productos y Colecciones: cantidad de resultados,
// toggle Iluminar, divider vertical y botón Filtrar.
//
//   <arq-catalog-toolbar count="11" unit="productos" for="filtros" show-iluminar></arq-catalog-toolbar>
//   <arq-filter-panel id="filtros">…</arq-filter-panel>
//
// - Count: número + sustantivo ("1 producto", "10 colecciones"), en un aria-live
//   para que se anuncie al filtrar. Lo actualiza la página.
// - Filtrar: con for (id de un arq-filter-panel) abre el panel y, cuando el panel
//   aplica, muestra la cantidad de filtros (Show count) y pasa a icon/filter-off.
//   Sin for, emite arq:filter-open y la cantidad se pasa en filter-count.
// - Iluminar (show-iluminar): pone data-arq-theme="dark" en <html> y recuerda la
//   preferencia en localStorage (arq:theme), así Productos y Colecciones
//   arrancan como se dejó (decisión 2026-10-02 · catalog-toolbar). El toggle
//   sigue a <html> si otro lo cambia. La ficha tiene su propio Iluminar.

import { ArqElement } from '../../base/arq-element.js';
import '../button/button.js';
import '../divider/divider.js';
import '../toggle/toggle.js';
import css from './catalog-toolbar.css?inline';

const UNITS = { productos: ['producto', 'productos'], colecciones: ['colección', 'colecciones'] };
const THEME_KEY = 'arq:theme';

function readTheme() {
  try {
    return localStorage.getItem(THEME_KEY);
  } catch {
    return null;
  }
}

function writeTheme(value) {
  try {
    localStorage.setItem(THEME_KEY, value);
  } catch {}
}

class ArqCatalogToolbar extends ArqElement {
  static tag = 'arq-catalog-toolbar';
  static styles = css;
  static properties = {
    count: { type: Number }, // Count (número)
    unit: { type: String, values: ['productos', 'colecciones'], default: 'productos' },
    showIluminar: { type: Boolean }, // Show iluminar
    for: { type: String }, // id del arq-filter-panel
    filterCount: { type: Number }, // filtros aplicados (Show count del botón Filtrar)
  };
  static template =
    `<div class="bar">` +
    `<p class="count role-body" aria-live="polite"></p>` +
    `<div class="actions">` +
    `<div class="lead"><arq-toggle show-label class="iluminar">Iluminar</arq-toggle><arq-divider orientation="vertical"></arq-divider></div>` +
    `<arq-button type="outline" show-icon icon="filter" count-label="filtros activos" class="filter">Filtrar</arq-button>` +
    `</div>` +
    `</div>`;

  #panel = null;
  #toggle = null;
  #button = null;

  setup() {
    const root = this.shadowRoot;
    this.#toggle = root.querySelector('.iluminar');
    this.#button = root.querySelector('.filter');
    this.#button.addEventListener('click', () => this.#openFilters());
    this.#toggle.addEventListener('arq:change', (event) => {
      event.stopPropagation();
      this.#setDark(event.detail.checked, true);
    });
    // Preferencia guardada (solo si el toolbar muestra Iluminar).
    if (this.showIluminar) {
      const saved = readTheme();
      if (saved === 'dark' || saved === 'light') this.#setDark(saved === 'dark', false);
    }
    // El toggle sigue a <html> (por ejemplo, otro toolbar en la misma página).
    new MutationObserver(() => this.#syncToggle()).observe(document.documentElement, { attributes: true, attributeFilter: ['data-arq-theme'] });
    this.#syncToggle();
    customElements.whenDefined('arq-button').then(() => this.#a11y());
  }

  update(changed) {
    if (changed.has('count') || changed.has('unit')) this.#renderCount();
    if (changed.has('showIluminar')) this.shadowRoot.querySelector('.lead').hidden = !this.showIluminar;
    if (changed.has('for')) this.#connectPanel();
    if (changed.has('filterCount')) this.#renderFilterButton();
  }

  #renderCount() {
    const [one, many] = UNITS[this.unit] ?? UNITS.productos;
    const p = this.shadowRoot.querySelector('.count');
    p.textContent = Number.isFinite(this.count) ? `${this.count} ${this.count === 1 ? one : many}` : '';
  }

  #renderFilterButton() {
    const n = Number.isFinite(this.filterCount) ? this.filterCount : 0;
    const button = this.#button;
    button.showCount = n > 0;
    button.count = n > 0 ? n : null;
    button.icon = n > 0 ? 'filter-off' : 'filter';
  }

  #setDark(dark, save) {
    const html = document.documentElement;
    if (dark) html.setAttribute('data-arq-theme', 'dark');
    else html.removeAttribute('data-arq-theme');
    if (save) writeTheme(dark ? 'dark' : 'light');
  }

  #syncToggle() {
    this.#toggle.checked = document.documentElement.getAttribute('data-arq-theme') === 'dark';
  }

  #connectPanel() {
    const panel = this.for ? this.getRootNode().getElementById?.(this.for) : null;
    if (this.for && !panel) {
      setTimeout(() => {
        if (!this.#panel) console.warn(`[arq] <arq-catalog-toolbar for="${this.for}">: no hay un elemento con ese id.`);
      });
    }
    if (panel === this.#panel) return;
    this.#panel?.removeEventListener('arq:apply', this.#onApply);
    this.#panel = panel;
    if (!panel) return;
    panel.addEventListener('arq:apply', this.#onApply);
    customElements.whenDefined('arq-filter-panel').then(() => {
      this.filterCount = this.#countFilters(panel.filters);
      this.#a11y();
    });
  }

  #onApply = (event) => {
    this.filterCount = this.#countFilters(event.detail.filters);
  };

  #countFilters(filters) {
    return Object.values(filters ?? {}).flat().length;
  }

  #openFilters() {
    if (this.#panel?.show) this.#panel.show(this.#button);
    else this.emit('filter-open', {});
  }

  // Filtrar abre un diálogo: aria-haspopup y aria-controls en el <button> interno.
  #a11y() {
    const control = this.#button.shadowRoot?.querySelector('.control');
    if (!control) return;
    control.setAttribute('aria-haspopup', 'dialog');
    if ('ariaControlsElements' in control) control.ariaControlsElements = this.#panel ? [this.#panel] : null;
  }
}

ArqCatalogToolbar.define();

export { ArqCatalogToolbar };
