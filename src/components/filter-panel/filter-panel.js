// filter-panel · Figma 1225:13576 · ficha doc/filter-panel (1433:2483)
//
// Panel de filtros técnicos de Productos y Colecciones. Se abre desde el botón
// Filtrar de catalog-toolbar. Desktop: panel lateral derecho de
// layout/filter-panel sobre el scrim. Mobile: pantalla completa, sin scrim.
//
//   <arq-filter-panel unit="productos">
//     <h2 slot="title">Filtrar</h2>
//     <arq-filter-row open>
//       <span slot="label">Potencia</span>
//       <arq-checkbox size="large" show-label name="potencia" value="8">8 W</arq-checkbox>
//     </arq-filter-row>
//   </arq-filter-panel>
//
//   filtrar.addEventListener('click', () => panel.show());
//   panel.addEventListener('arq:filters', (e) => (panel.count = contar(e.detail.filters)));
//   panel.addEventListener('arq:apply', (e) => aplicar(e.detail.filters));
//
// - Diálogo modal nativo (<dialog> + showModal): el foco queda adentro, Esc y el
//   scrim lo cierran y al cerrar vuelve al botón que lo abrió.
// - Siempre en Light, también con Iluminar: el <dialog> lleva
//   data-arq-theme="light" (Light local, decisión 2026-10-05 · filter-panel).
// - Summary ("3 filtros activos") y los filter-chip de lo aplicado se arman
//   solos con los checkbox marcados; sin filtros no se muestran (Show summary
//   y Show applied).
// - Cada cambio emite arq:filters { filters } (filters: { name: [values] }):
//   la página calcula el resultado y lo pasa en count ("Ver 4 productos").
// - Mientras está abierto el listado no cambia. "Ver N" emite arq:apply
//   { filters } y cierra. Cerrar con la X, el scrim o Esc descarta los cambios:
//   vuelve a lo marcado al abrir (decisión 2026-10-02 · filter-panel).
// - "Borrar todo" desmarca todo sin cerrar. Tocar un chip desmarca su opción y
//   el foco pasa al chip siguiente (o al anterior, o a cerrar).

import { ArqElement } from '../../base/arq-element.js';
import '../button/button.js';
import '../icon-button/icon-button.js';
import '../filter-chip/filter-chip.js';
import '../filter-row/filter-row.js';
import '../tab/tab.js';
import { SingleSelect } from '../../base/single-select.js';
import css from './filter-panel.css?inline';

const UNITS = { productos: ['producto', 'productos'], colecciones: ['colección', 'colecciones'] };

class ArqFilterPanel extends ArqElement {
  static tag = 'arq-filter-panel';
  static styles = css;
  static properties = {
    open: { type: Boolean },
    count: { type: Number }, // resultado para "Ver N productos" (lo calcula la página)
    unit: { type: String, values: ['productos', 'colecciones'], default: 'productos' },
    showCategories: { type: Boolean }, // Productos Mobile: tabs de características y categorías
  };
  static template =
    `<dialog class="dialog" data-arq-theme="light">` +
    `<div class="sheet">` +
    `<div class="header">` +
    `<div class="titles"><div class="title role-heading-1"><slot name="title"></slot></div><p class="summary role-body" hidden></p></div>` +
    `<arq-icon-button icon="close" size="large" class="close">Cerrar filtros</arq-icon-button>` +
    `</div>` +
    `<div class="applied" hidden></div>` +
    `<div class="tabs" role="tablist" aria-label="Tipo de filtro">` +
    `<arq-tab value="features" id="features-tab" aria-controls="features-panel" selected>Características</arq-tab>` +
    `<arq-tab value="categories" id="categories-tab" aria-controls="categories-panel">Categorías</arq-tab>` +
    `</div>` +
    `<div class="body">` +
    `<div class="features-panel" id="features-panel" role="tabpanel" aria-labelledby="features-tab"><slot></slot></div>` +
    `<div class="categories-panel" id="categories-panel" role="tabpanel" aria-labelledby="categories-tab" hidden><slot name="categories"></slot></div>` +
    `</div>` +
    `<div class="footer">` +
    `<arq-button type="underline" show-underline class="clear">Borrar todo</arq-button>` +
    `<arq-button class="apply"></arq-button>` +
    `</div>` +
    `</div>` +
    `</dialog>`;

  #dialog = null;
  #snapshot = null;
  #opener = null;
  #applying = false;

  setup() {
    const root = this.shadowRoot;
    this.#dialog = root.querySelector('dialog');
    root.querySelector('.close').addEventListener('click', () => this.close());
    root.querySelector('.clear').addEventListener('click', () => this.clear());
    root.querySelector('.apply').addEventListener('click', () => this.apply());
    new SingleSelect(root.querySelector('.tabs'), { items: 'arq-tab' });
    root.querySelector('.tabs').addEventListener('arq:change', (event) => {
      this.#activateTab(event.detail.value);
    });
    this.addEventListener('arq:toggle', (event) => {
      const group = event.target;
      if (group.localName !== 'arq-catalog-nav-group' || !event.detail.open || !group.closest('[slot="categories"]')) return;
      for (const candidate of this.querySelectorAll('[slot="categories"] arq-catalog-nav-group')) {
        candidate.open = candidate === group;
      }
    });
    // Scrim: el clic en el ::backdrop llega al <dialog> (el contenido está en .sheet).
    this.#dialog.addEventListener('click', (event) => {
      if (event.target === this.#dialog) this.close();
    });
    // Esc: el navegador cierra el diálogo; se descartan los cambios.
    this.#dialog.addEventListener('cancel', (event) => {
      event.preventDefault();
      this.close();
    });
    root.querySelector('.applied').addEventListener('click', (event) => {
      const chip = event.target.closest('arq-filter-chip');
      if (chip) this.#removeChip(chip);
    });
    this.addEventListener('arq:change', (event) => {
      if (event.target.localName !== 'arq-checkbox') return;
      this.#changed();
    });
    root.querySelector('slot[name="title"]').addEventListener('slotchange', () => this.#name());
    this.#name();
    this.#render();
  }

  update(changed) {
    if (changed.has('open')) {
      if (this.open && !this.#dialog.open) this.#showDialog();
      if (!this.open && this.#dialog.open) this.#closeDialog();
    }
    if (changed.has('count') || changed.has('unit')) this.#renderApply();
    if (changed.has('showCategories')) this.#activateTab('features');
  }

  /** Checkbox de todas las filas. */
  get options() {
    return [...this.querySelectorAll('arq-filter-row > arq-checkbox')];
  }

  /** Filtros marcados: { name: [values] }. */
  get filters() {
    const filters = {};
    for (const option of this.options) {
      if (!option.checked) continue;
      const name = option.getAttribute('name') ?? '';
      (filters[name] ??= []).push(option.value);
    }
    return filters;
  }

  /** Abre el panel. El foco vuelve a `opener` (o al elemento con foco) al cerrar. */
  show(opener) {
    this.#opener = opener ?? this.#activeElement();
    this.open = true;
  }

  /** Cierra descartando los cambios (X, scrim, Esc). */
  close() {
    const restore = this.#snapshot;
    this.#snapshot = null;
    if (restore && [...restore].some(([option, checked]) => option.checked !== checked)) {
      for (const [option, checked] of restore) option.checked = checked;
      this.#changed(); // la página vuelve a calcular count con lo restaurado
    } else {
      this.#render();
    }
    this.open = false;
  }

  /** "Ver N productos": aplica y cierra. */
  apply() {
    this.#snapshot = null;
    this.emit('apply', { filters: this.filters });
    this.open = false;
  }

  /** "Borrar todo": desmarca todo sin cerrar. */
  clear() {
    for (const option of this.options) option.checked = false;
    this.#changed();
  }

  #showDialog() {
    this.#snapshot = new Map(this.options.map((option) => [option, option.checked]));
    this.#activateTab('features');
    this.#render();
    this.#dialog.showModal();
  }

  #activateTab(value) {
    const categories = this.showCategories && value === 'categories';
    const root = this.shadowRoot;
    root.querySelector('#features-tab').selected = !categories;
    root.querySelector('#categories-tab').selected = categories;
    root.querySelector('.features-panel').hidden = categories;
    root.querySelector('.categories-panel').hidden = !categories;
    root.querySelector('.summary').hidden = categories || this.#checked().length === 0;
    root.querySelector('.applied').hidden = categories || this.#checked().length === 0;
    root.querySelector('.footer').hidden = categories;
  }

  #closeDialog() {
    if (this.#snapshot) this.close();
    this.#dialog.close();
    this.#opener?.focus?.();
    this.#opener = null;
  }

  #activeElement() {
    let active = document.activeElement;
    while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
    // Si el foco está dentro de un componente, se vuelve al host (su focus() lo deriva).
    const root = active?.getRootNode?.();
    return root instanceof ShadowRoot ? root.host : active;
  }

  #name() {
    const title = this.querySelector('[slot="title"]')?.textContent.trim();
    this.#dialog.setAttribute('aria-label', title || 'Filtrar');
  }

  #changed() {
    this.#render();
    this.emit('filters', { filters: this.filters });
  }

  #checked() {
    return this.options.filter((option) => option.checked);
  }

  #render() {
    const checked = this.#checked();
    const root = this.shadowRoot;
    const summary = root.querySelector('.summary');
    summary.hidden = checked.length === 0 || root.querySelector('#categories-tab').selected;
    summary.textContent = `${checked.length} ${checked.length === 1 ? 'filtro activo' : 'filtros activos'}`;
    const applied = root.querySelector('.applied');
    applied.hidden = checked.length === 0 || root.querySelector('#categories-tab').selected;
    // Los chips se reusan para no perder el foco al quitar uno.
    while (applied.children.length > checked.length) applied.lastElementChild.remove();
    while (applied.children.length < checked.length) applied.append(document.createElement('arq-filter-chip'));
    checked.forEach((option, i) => {
      const chip = applied.children[i];
      chip.textContent = option.textContent.trim();
      chip.option = option;
    });
    this.#renderApply();
  }

  #renderApply() {
    const button = this.shadowRoot.querySelector('.apply');
    if (!button) return;
    const [one, many] = UNITS[this.unit] ?? UNITS.productos;
    button.textContent = Number.isFinite(this.count) ? `Ver ${this.count} ${this.count === 1 ? one : many}` : `Ver ${many}`;
  }

  #removeChip(chip) {
    const chips = [...this.shadowRoot.querySelectorAll('.applied arq-filter-chip')];
    const index = chips.indexOf(chip);
    chip.option.checked = false;
    this.#changed();
    const left = [...this.shadowRoot.querySelectorAll('.applied arq-filter-chip')];
    const next = left[index] ?? left[index - 1];
    (next ?? this.shadowRoot.querySelector('.close')).focus();
  }
}

ArqFilterPanel.define();

export { ArqFilterPanel };
