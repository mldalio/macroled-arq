// variants-table · Figma 1068:5582 (+ variants-table-row 923:2708) · ficha doc/variants-table
//
// Tabla de variantes de la ficha (Glosario): una fila por SKU del grupo, con
// sus datos técnicos. El título va aparte, como título de sección.
//
//   <arq-variants-table downloads="descargas">
//     <arq-button slot="downloads" type="outline" show-icon icon="download" href="…">CAD 2D/3D</arq-button>
//   </arq-variants-table>
//
//   tabla.data = {
//     columns: [{ key: 'potencia', label: 'Potencia' }, …],
//     filters: [{ key: 'color_carcasa', label: 'Color', swatches: true }, { key: 'altura', label: 'Altura' }],
//     rows: [{ sku: 'KANU-…', thumb: '…', attributes: { color_carcasa: 'Negro', … }, values: { potencia: '12 W', … } }],
//   };
//
// - Es un <table> real: un lector de pantalla anuncia la columna de cada valor.
//   Miniatura y sku van en celdas separadas: hasta 1023 px solo la miniatura
//   queda fija y el sku se desplaza con los datos (ficha doc/variants-table:
//   «mobile: solo miniatura»).
//   variants-table-row vive adentro (la fila de la tabla), como toggle-switch
//   dentro de toggle (decisión 2026-10-02 · glosario).
// - Un solo contenedor con scroll horizontal para el encabezado y las filas; la
//   columna de inicio (miniatura + sku) y la de descarga quedan fijas
//   (position: sticky). El scroll queda dentro de los márgenes de la página.
// - Filtros: el botón (siempre Filled, con icon/filter) abre filter-panel, como
//   en la página Descargas (panel lateral derecho en Desktop, pantalla completa
//   en Mobile), con una filter-row de checkbox por filtro. Se aplica con «Ver N
//   variantes»; cerrar descarta. Selección múltiple: dentro de un filtro, una
//   fila cumple si tiene cualquiera de los valores elegidos; entre filtros,
//   todos. Las opciones que no dan ninguna fila van deshabilitadas
//   (src/data/variants.js). El botón dice «Filtros (N)» y al lado va la
//   cantidad («4 variantes», role/body en color/text/secondary); debajo, los
//   filtros aplicados como filter-chip y «Limpiar filtros» (decisiones.md,
//   2026-10-15 · Filtros del glosario en panel lateral).
// - Descarga de cada fila: icon-button Size=Large, Background=Outline (en
//   Descargas, con show-search, None: sin borde) en la columna «Descargas»;
//   emite arq:downloads { sku } y, con downloads="<id>", abre ese
//   download-modal.
// - Encabezado en role/body-regular (color/text/tertiary), valores en
//   role/body-lg-regular y sku Size=Underline (variants-table-row, Ficha v2).
// - Mobile (hasta 767 px): en lugar de la tabla, una variants-table-card por
//   variante (Figma 2399:31269): imagen 16:10, sku con la descarga y los datos
//   en dos columnas. Vive adentro de variants-table, como variants-table-row.
// - Columnas: miden lo que su contenido (sin anchos fijos).
// - Show search (página Descargas): search-field «Buscar por SKU o nombre…»
//   a la derecha (layout/search-field), busca en el SKU y en row.search; sin
//   la cantidad al lado de Filtros. show-sort (solo de código) suma el select
//   «Ordenar por» (SORT_ORDERS). Los dos filtran y ordenan junto con los
//   filtros (src/data/variants.js).

import { ArqElement } from '../../base/arq-element.js';
import { filterOptions, filterVariants, searchVariants, sortVariants, SORT_ORDERS } from '../../data/variants.js';
import '../button/button.js';
import '../icon-button/icon-button.js';
import '../sku/sku.js';
import '../filter-chip/filter-chip.js';
import '../filter-row/filter-row.js';
import '../filter-panel/filter-panel.js';
import '../checkbox/checkbox.js';
import '../search-field/search-field.js';
import '../select/select.js';
import css from './variants-table.css?inline';

const esc = (text) => String(text ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

// Descarga de una variante: icon-button Size=Large, Background=Outline en la
// ficha y None (sin borde) en la página Descargas (show-search, Figma 2496:31316)
const download = (sku, background) =>
  `<arq-icon-button icon="download" size="large" background="${background}" data-sku="${esc(sku)}">Descargas de ${esc(sku)}</arq-icon-button>`;

const TEXT = {
  search: 'Buscar por SKU o nombre…',
  searchLabel: 'Buscar por SKU o nombre',
  filters: 'Filtros',
  clear: 'Limpiar filtros',
  sort: 'Ordenar por',
  downloads: 'Descargas',
  image: 'Imagen',
  // TODO (contenido): texto sin diseño
  empty: 'Ningún SKU coincide con la búsqueda o los filtros.',
  count: (n) => (n === 1 ? '1 variante' : `${n} variantes`),
};

class ArqVariantsTable extends ArqElement {
  static tag = 'arq-variants-table';
  static styles = css;
  static properties = {
    downloads: { type: String }, // id del arq-download-modal que abre el ícono de cada fila
    label: { type: String, default: 'Variantes' }, // nombre de la región con scroll (único en la página)
    showSearch: { type: Boolean }, // solo de código: buscador por SKU o nombre
    showSort: { type: Boolean }, // solo de código: select «Ordenar por»
  };
  static template =
    `<div class="controls">` +
    `<div class="toolbar">` +
    `<div class="filters-group">` +
    `<arq-button class="toggle-filters" show-icon icon="filter">${TEXT.filters}</arq-button>` +
    `<span class="total role-body" aria-hidden="true"></span>` +
    `</div>` +
    `<div class="downloads"><slot name="downloads"></slot></div>` +
    `<arq-select class="sort" type="filter" label="${TEXT.sort}" hidden></arq-select>` +
    `<arq-search-field class="search" placeholder="${TEXT.search}" label="${TEXT.searchLabel}" hidden></arq-search-field>` +
    `</div>` +
    `<div class="applied" hidden>` +
    `<div class="chips" role="list" aria-label="Filtros aplicados"></div>` +
    `<arq-button class="clear" type="underline" show-underline>${TEXT.clear}</arq-button>` +
    `</div>` +
    `</div>` +
    `<div class="scroll" tabindex="0" role="region" aria-label="Variantes">` +
    `<table class="table"><thead></thead><tbody></tbody></table>` +
    `</div>` +
    `<ul class="cards" role="list" aria-label="Variantes"></ul>` +
    `<p class="empty role-body" hidden>${TEXT.empty}</p>` +
    `<span class="visually-hidden count" role="status"></span>` +
    `<arq-filter-panel class="panel" unit="variantes"><span slot="title">${TEXT.filters}</span></arq-filter-panel>`;

  #data = { columns: [], filters: [], rows: [] };
  #values = {};
  #query = '';
  #order = SORT_ORDERS[0].value;

  get data() {
    return this.#data;
  }

  set data(value) {
    this.#data = { columns: value?.columns ?? [], filters: value?.filters ?? [], rows: value?.rows ?? [] };
    this.#values = {};
    if (this.isConnected) this.#build();
  }

  setup() {
    const root = this.shadowRoot;
    root.querySelector('.toggle-filters').addEventListener('click', (event) => this.#openPanel(event.currentTarget));
    // El botón abre un diálogo (filter-panel)
    customElements.whenDefined('arq-button').then(() => {
      root.querySelector('.toggle-filters').shadowRoot?.querySelector('.control')?.setAttribute('aria-haspopup', 'dialog');
    });
    root.querySelector('.chips').addEventListener('click', (event) => {
      const chip = event.target.closest('arq-filter-chip');
      if (chip) this.#removeChip(chip);
    });
    root.querySelector('.clear').addEventListener('click', () => {
      this.#values = {};
      this.#refresh(true);
      root.querySelector('.toggle-filters').focus();
    });
    // Panel lateral: «Ver N variantes» se calcula con lo marcado; se aplica al
    // confirmar (cerrar descarta).
    const panel = root.querySelector('.panel');
    panel.addEventListener('arq:filters', (event) => {
      event.stopPropagation();
      this.#syncPanel(event.detail.filters);
    });
    panel.addEventListener('arq:apply', (event) => {
      event.stopPropagation();
      this.#values = { ...event.detail.filters };
      this.#refresh(true);
    });
    root.querySelector('.search').addEventListener('arq:input', (event) => {
      event.stopPropagation();
      this.#query = event.detail.value;
      this.#refresh(true);
    });
    // Enter no envía a otra página: la tabla ya se filtró al escribir.
    root.querySelector('.search').addEventListener('arq:submit', (event) => event.stopPropagation());
    // Sin botones de descarga en la barra (página Descargas), no ocupa lugar
    const downloads = root.querySelector('slot[name="downloads"]');
    const toggleDownloads = () => (downloads.parentElement.hidden = !downloads.assignedElements().length);
    downloads.addEventListener('slotchange', toggleDownloads);
    toggleDownloads();
    const sort = root.querySelector('.sort');
    // La primera opción («Todos» en un Filter) es el orden por defecto.
    sort.allLabel = SORT_ORDERS[0].label;
    sort.options = SORT_ORDERS.slice(1);
    sort.addEventListener('arq:change', (event) => {
      event.stopPropagation();
      this.#order = event.detail.value || SORT_ORDERS[0].value;
      this.#refresh(true);
    });
    root.addEventListener('click', (event) => {
      const button = event.target.closest('arq-icon-button[data-sku]');
      if (!button) return;
      const sku = button.dataset.sku;
      this.emit('downloads', { sku });
      const modal = this.downloads ? this.getRootNode().getElementById?.(this.downloads) : null;
      modal?.show?.(button);
    });
    this.#build();
  }

  update(changed) {
    const root = this.shadowRoot;
    if (changed.has('label')) root.querySelector('.scroll').setAttribute('aria-label', this.label ?? 'Variantes');
    if (changed.has('showSearch')) root.querySelector('.search').hidden = !this.showSearch;
    if (changed.has('showSort')) root.querySelector('.sort').hidden = !this.showSort;
    if (changed.has('showSearch') || changed.has('showSort')) this.#refresh();
  }

  #build() {
    const root = this.shadowRoot;
    const { columns } = this.#data;
    // Encabezado: SKU (columna fija de inicio) · columnas · descarga (fija de fin)
    root.querySelector('thead').innerHTML =
      `<tr><th scope="col" class="start"><span class="visually-hidden">${TEXT.image}</span></th>` +
      `<th scope="col" class="sku-col role-body-regular">SKU</th>` +
      columns.map((c) => `<th scope="col" class="role-body-regular">${esc(c.label)}</th>`).join('') +
      `<th scope="col" class="end role-body-regular"><span class="th-downloads">${TEXT.downloads}</span></th></tr>`;
    this.#refresh();
  }

  // announce: después de buscar, filtrar u ordenar se anuncia la cantidad de filas.
  #refresh(announce = false) {
    const root = this.shadowRoot;
    const { columns } = this.#data;
    // Buscador y orden (solo con show-search / show-sort)
    let rows = this.showSearch ? searchVariants(this.#data.rows, this.#query) : this.#data.rows;
    if (this.showSort) rows = sortVariants(rows, this.#order);
    // Filas que cumplen los filtros
    const visible = filterVariants(rows, this.#values);
    const background = this.showSearch ? 'none' : 'outline';
    root.querySelector('tbody').innerHTML = visible
      .map(
        (row) =>
          `<tr>` +
          `<td class="start"><span class="thumb">${row.thumb ? `<img src="${esc(row.thumb)}" alt="" loading="lazy">` : ''}</span></td>` +
          `<th scope="row" class="sku-col"><arq-sku size="underline">${esc(row.sku)}</arq-sku></th>` +
          columns.map((c) => `<td class="role-body-lg-regular">${esc(row.values?.[c.key] ?? '—')}</td>`).join('') +
          `<td class="end">${download(row.sku, background)}</td>` +
          `</tr>`,
      )
      .join('');
    // Mobile: una variants-table-card por variante (mismos datos que la fila)
    root.querySelector('.cards').innerHTML = visible
      .map(
        (row) =>
          `<li class="card">` +
          `<span class="card-image">${row.thumb ? `<img src="${esc(row.thumb)}" alt="" loading="lazy">` : ''}</span>` +
          `<span class="card-head"><arq-sku size="underline">${esc(row.sku)}</arq-sku>${download(row.sku, background)}</span>` +
          `<dl class="card-data">` +
          columns
            .map(
              (c) =>
                `<div class="card-item"><dt class="role-body-sm">${esc(c.label)}</dt>` +
                `<dd class="role-body-sm-medium">${esc(row.values?.[c.key] ?? '—')}</dd></div>`,
            )
            .join('') +
          `</dl>` +
          `</li>`,
      )
      .join('');
    root.querySelector('.total').textContent = TEXT.count(visible.length);
    const active = this.#filterCount();
    root.querySelector('.toggle-filters').textContent = active ? `${TEXT.filters} (${active})` : TEXT.filters;
    this.#renderChips();
    // Sin filas: la tabla y las tarjetas se ocultan y queda el aviso
    const empty = !visible.length && this.#data.rows.length > 0;
    root.querySelector('.scroll').hidden = empty;
    root.querySelector('.cards').hidden = empty;
    root.querySelector('.empty').hidden = !empty;
    if (announce) root.querySelector('.count').textContent = TEXT.count(visible.length);
  }

  // ── Filtros ────────────────────────────────────────────────────────
  // Filas de la búsqueda y el orden (antes de los filtros)
  #searched() {
    const rows = this.showSearch ? searchVariants(this.#data.rows, this.#query) : this.#data.rows;
    return this.showSort ? sortVariants(rows, this.#order) : rows;
  }

  // Opciones de cada filtro: los valores de todas las variantes (la búsqueda no
  // los quita, así lo elegido sigue a la vista) y deshabilitados los que no
  // darían filas con la búsqueda y los demás filtros.
  #options(values = this.#values) {
    const keys = this.#data.filters.map((f) => f.key);
    const all = filterOptions(this.#data.rows, keys, values);
    const searched = filterOptions(this.#searched(), keys, values);
    return all.map((group, i) => {
      const enabled = new Set(searched[i].options.filter((o) => !o.disabled).map((o) => o.value));
      return group.options.map((o) => ({ value: o.value, selected: o.selected, disabled: !enabled.has(o.value) && !o.selected }));
    });
  }

  #filterCount(values = this.#values) {
    return Object.values(values).reduce((n, list) => n + (list?.length ?? 0), 0);
  }

  // Chips de lo aplicado, en el orden de los filtros. Se reusan para no perder
  // el foco al quitar uno.
  #renderChips() {
    const root = this.shadowRoot;
    const applied = this.#data.filters.flatMap((f) => (this.#values[f.key] ?? []).map((value) => ({ key: f.key, value })));
    const chips = root.querySelector('.chips');
    while (chips.children.length > applied.length) chips.lastElementChild.remove();
    while (chips.children.length < applied.length) {
      const chip = document.createElement('arq-filter-chip');
      chip.setAttribute('role', 'listitem');
      chips.append(chip);
    }
    applied.forEach(({ key, value }, i) => {
      const chip = chips.children[i];
      chip.dataset.key = key;
      chip.dataset.value = value;
      if (chip.textContent !== value) chip.textContent = value;
    });
    root.querySelector('.applied').hidden = !applied.length;
  }

  #removeChip(chip) {
    const chips = [...this.shadowRoot.querySelectorAll('.chips arq-filter-chip')];
    const index = chips.indexOf(chip);
    const { key, value } = chip.dataset;
    this.#values = { ...this.#values, [key]: (this.#values[key] ?? []).filter((v) => v !== value) };
    this.#refresh(true);
    const left = [...this.shadowRoot.querySelectorAll('.chips arq-filter-chip')];
    (left[index] ?? left[index - 1] ?? this.shadowRoot.querySelector('.toggle-filters')).focus();
  }

  // Las filas del panel se arman al abrir, con lo aplicado marcado; mientras
  // está abierto solo cambian el estado deshabilitado y «Ver N variantes».
  #openPanel(opener) {
    const panel = this.shadowRoot.querySelector('.panel');
    const { filters } = this.#data;
    const groups = this.#options();
    panel.replaceChildren(
      panel.querySelector('[slot="title"]'),
      ...filters.map((f, i) => {
        const row = document.createElement('arq-filter-row');
        const label = document.createElement('span');
        label.slot = 'label';
        label.textContent = f.label;
        row.append(label);
        for (const option of groups[i]) {
          const checkbox = document.createElement('arq-checkbox');
          checkbox.size = 'large';
          checkbox.showLabel = true;
          checkbox.setAttribute('name', f.key);
          checkbox.value = option.value;
          checkbox.textContent = option.value;
          checkbox.checked = option.selected;
          checkbox.disabled = option.disabled;
          row.append(checkbox);
        }
        // Abierta si tiene filtros aplicados (filter-row)
        row.open = groups[i].some((o) => o.selected);
        return row;
      }),
    );
    panel.count = filterVariants(this.#searched(), this.#values).length;
    panel.show(opener);
  }

  #syncPanel(values) {
    const panel = this.shadowRoot.querySelector('.panel');
    const groups = this.#options(values);
    panel.querySelectorAll('arq-filter-row').forEach((row, i) => {
      const options = groups[i] ?? [];
      row.querySelectorAll('arq-checkbox').forEach((checkbox, j) => {
        checkbox.disabled = Boolean(options[j]?.disabled) && !checkbox.checked;
      });
    });
    panel.count = filterVariants(this.#searched(), values).length;
  }
}

ArqVariantsTable.define();

export { ArqVariantsTable };
