// downloads-table · Figma: «Descargas · propuesta final (desktop y mobile)»
// 2575:22875 (frames «variants-table» de la pantalla; no es un set)
//
// Tabla de la página Descargas: todos los SKU del catálogo con buscador,
// filtros de selección múltiple, los filtros aplicados como filter-chip y la
// descarga de cada fila. Es propia de Descargas: la tabla de la ficha sigue
// siendo variants-table.
//
//   <arq-downloads-table downloads="descargas"></arq-downloads-table>
//
//   tabla.data = {
//     columns: [{ key: 'potencia', label: 'Potencia' }, …],
//     filters: [{ key: 'color_carcasa', label: 'Acabado', swatches: true }, …],
//     rows: [{ sku, name, href, meta, thumb, search, attributes: {…}, values: {…} }],
//   };
//   tabla.addEventListener('arq:downloads', (e) => llenarModal(e.detail.sku));
//
// - Filtros: el botón abre filter-panel (panel lateral derecho en Desktop,
//   pantalla completa en Mobile, 2571:22966 · 2572:22988) con una filter-row
//   de checkbox por filtro. Se aplica con «Ver N productos»; cerrar descarta.
//   El botón dice «Filtros (N)» con N = valores elegidos, y debajo de la barra
//   van los chips de lo aplicado y «Limpiar filtros». De las dos propuestas se
//   eligió el panel lateral (decisiones.md, 2026-10-15 · Descargas · propuesta
//   final); la desplegable quedó en la historia de la rama
//   feat/descargas-propuesta.
// - Selección múltiple: dentro de un filtro, una fila cumple si tiene
//   cualquiera de los valores elegidos; entre filtros, todos
//   (src/data/variants.js). Las opciones que no darían filas van
//   deshabilitadas.
// - Barra: el buscador a la izquierda y Filtros a la derecha, del lado donde
//   se abre filter-panel. Debajo del buscador, la cantidad («4 productos»:
//   cada SKU cuenta como producto, como pidió diseño el 2026-10-15; cargando,
//   «Buscando…») seguida de los chips y «Limpiar filtros». Mobile: el
//   buscador arriba, a todo el ancho; Filtros con la cantidad debajo, y lo
//   aplicado abajo de todo.
// - Desktop: <table> real con miniatura, nombre + sku Compact, columnas de
//   datos y la descarga (icon-button Large Outline, como la ficha). Miniatura, producto y
//   descarga quedan fijas al desplazar en horizontal.
// - Mobile (hasta 767 px): una tarjeta por variante (variants-table-card de la
//   propuesta): miniatura, nombre y sku; cuatro datos en dos columnas;
//   «Descargas» (button Outline) y «Ver producto» (button Underline, ↗).
// - loading: filas (o tarjetas) de carga en color/surface/subtle.
// - Sin filas que cumplan: «No hay productos con estos filtros» (role/heading-2)
//   con su ayuda (role/body-regular).
// - Descargas de cada fila: emite arq:downloads { sku } y, con
//   downloads="<id>", abre ese download-modal (como variants-table).

import { ArqElement } from '../../base/arq-element.js';
import { filterOptions, filterVariants, searchVariants } from '../../data/variants.js';
import '../button/button.js';
import '../icon-button/icon-button.js';
import '../sku/sku.js';
import '../search-field/search-field.js';
import '../filter-chip/filter-chip.js';
import '../filter-row/filter-row.js';
import '../filter-panel/filter-panel.js';
import '../checkbox/checkbox.js';
import css from './downloads-table.css?inline';

const esc = (text) => String(text ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

const TEXT = {
  filters: 'Filtros',
  search: 'Buscar por nombre o SKU…',
  searchLabel: 'Buscar por nombre o SKU',
  clear: 'Limpiar filtros',
  downloads: 'Descargas',
  product: 'Ver producto',
  image: 'Imagen',
  sku: 'SKU',
  loading: 'Buscando…',
  emptyTitle: 'No hay productos con estos filtros',
  emptyText: 'Probá quitar alguno de los filtros aplicados o buscar por otro nombre o SKU.',
  count: (n) => (n === 1 ? '1 producto' : `${n} productos`),
};

// Datos de la tarjeta Mobile (la propuesta muestra cuatro: Potencia, Temp.,
// Flujo lum. e IP; Flujo lum. ya no es columna en Descargas, va Ángulo).
// TODO (diseño): confirmar qué datos van en la tarjeta.
const CARD_COLUMNS = ['potencia', 'temperatura_color', 'angulo_apertura', 'proteccion_ip'];

// Columnas de datos de las filas de carga, antes de tener los datos (la
// propuesta muestra nueve)
const SKELETON_COLUMNS = 9;

// Descarga de una fila (tabla): icon-button Large Background=Outline, como el
// glosario de la ficha (Figma 1218:10705)
const download = (sku) =>
  `<arq-icon-button icon="download" size="large" background="outline" data-sku="${esc(sku)}">Descargas de ${esc(sku)}</arq-icon-button>`;

const thumb = (row, className) => `<span class="${className}">${row.thumb ? `<img src="${esc(row.thumb)}" alt="" loading="lazy">` : ''}</span>`;

class ArqDownloadsTable extends ArqElement {
  static tag = 'arq-downloads-table';
  static styles = css;
  static properties = {
    loading: { type: Boolean }, // filas de carga
    downloads: { type: String }, // id del arq-download-modal que abre la descarga de cada fila
    label: { type: String, default: 'Productos' }, // nombre de la región con scroll
  };
  static template =
    `<div class="controls">` +
    `<arq-search-field class="search" placeholder="${TEXT.search}" label="${TEXT.searchLabel}"></arq-search-field>` +
    `<arq-button class="toggle-filters" show-icon icon="filter">${TEXT.filters}</arq-button>` +
    `<span class="total role-body" aria-hidden="true"></span>` +
    `<div class="applied" hidden>` +
    `<div class="chips" role="list" aria-label="Filtros aplicados"></div>` +
    `<arq-button class="clear" type="underline" show-underline>${TEXT.clear}</arq-button>` +
    `</div>` +
    `</div>` +
    `<div class="scroll" tabindex="0" role="region" aria-label="Productos">` +
    `<table class="table"><thead></thead><tbody></tbody></table>` +
    `</div>` +
    `<div class="scrollbar" aria-hidden="true" hidden><div class="scrollbar-track"></div></div>` +
    `<ul class="cards" role="list" aria-label="Productos"></ul>` +
    `<div class="skeleton" aria-hidden="true" hidden></div>` +
    `<div class="empty" hidden><p class="empty-title role-heading-2">${TEXT.emptyTitle}</p><p class="empty-text role-body-regular">${TEXT.emptyText}</p></div>` +
    `<span class="visually-hidden count" role="status"></span>` +
    `<arq-filter-panel class="panel" unit="productos"><span slot="title">${TEXT.filters}</span></arq-filter-panel>`;

  #data = { columns: [], filters: [], rows: [] };
  #values = {}; // filtro → [valores]
  #query = '';
  #revealed = false; // ya se hizo el fundido de la primera carga

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
    // Miniatura que no carga: queda el fondo color/surface/subtle.
    root.addEventListener('error', (event) => {
      if (event.target.localName === 'img') event.target.hidden = true;
    }, true);
    root.querySelector('.toggle-filters').addEventListener('click', (event) => this.#openPanel(event.currentTarget));
    // El botón abre un diálogo (filter-panel)
    customElements.whenDefined('arq-button').then(() => {
      root.querySelector('.toggle-filters').shadowRoot?.querySelector('.control')?.setAttribute('aria-haspopup', 'dialog');
    });
    root.querySelector('.search').addEventListener('arq:input', (event) => {
      event.stopPropagation();
      this.#query = event.detail.value;
      this.#refresh(true);
    });
    // Enter no envía a otra página: la tabla ya se filtró al escribir.
    root.querySelector('.search').addEventListener('arq:submit', (event) => event.stopPropagation());
    root.querySelector('.chips').addEventListener('click', (event) => {
      const chip = event.target.closest('arq-filter-chip');
      if (chip) this.#removeChip(chip);
    });
    root.querySelector('.clear').addEventListener('click', () => {
      this.#values = {};
      this.#refresh(true);
      root.querySelector('.toggle-filters').focus();
    });
    // Panel lateral: «Ver N productos» se calcula con lo marcado; se aplica al
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
    root.addEventListener('click', (event) => {
      const button = event.target.closest('[data-sku]');
      if (!button) return;
      const sku = button.dataset.sku;
      this.emit('downloads', { sku });
      const modal = this.downloads ? this.getRootNode().getElementById?.(this.downloads) : null;
      modal?.show?.(button);
    });
    this.#scrollbar();
    this.#build();
  }

  // Barra de scroll horizontal fina, pegada al borde inferior de la pantalla
  // mientras la tabla está a la vista (la del contenedor quedaría al final de
  // cientos de filas). Es un espejo: se sincroniza con .scroll en los dos
  // sentidos y solo aparece si la tabla no entra.
  #scrollbar() {
    const root = this.shadowRoot;
    const scroll = root.querySelector('.scroll');
    const bar = root.querySelector('.scrollbar');
    const track = root.querySelector('.scrollbar-track');
    let syncing = null;
    const follow = (from, to) => {
      if (syncing === to) return;
      syncing = from;
      to.scrollLeft = from.scrollLeft;
      requestAnimationFrame(() => (syncing = null));
    };
    scroll.addEventListener('scroll', () => follow(scroll, bar), { passive: true });
    bar.addEventListener('scroll', () => follow(bar, scroll), { passive: true });
    const measure = () => {
      track.style.width = `${scroll.scrollWidth}px`;
      bar.hidden = scroll.hidden || scroll.scrollWidth <= scroll.clientWidth;
      bar.scrollLeft = scroll.scrollLeft;
    };
    const observer = new ResizeObserver(measure);
    observer.observe(scroll);
    observer.observe(root.querySelector('.table'));
  }

  update(changed) {
    const root = this.shadowRoot;
    if (changed.has('label')) root.querySelector('.scroll').setAttribute('aria-label', this.label ?? 'Productos');
    if (changed.has('loading')) this.#refresh();
  }

  #build() {
    const root = this.shadowRoot;
    const { columns } = this.#data;
    // Encabezado: imagen · SKU (producto) · columnas · descarga
    root.querySelector('thead').innerHTML =
      `<tr><th scope="col" class="start"><span class="visually-hidden">${TEXT.image}</span></th>` +
      `<th scope="col" class="sku-col role-label-lg">${TEXT.sku}</th>` +
      columns.map((c) => `<th scope="col" class="role-label-lg">${esc(c.label)}</th>`).join('') +
      `<th scope="col" class="end role-label-lg">${TEXT.downloads}</th></tr>`;
    this.#refresh();
  }

  // Filas de la búsqueda (antes de los filtros)
  #searched() {
    return searchVariants(this.#data.rows, this.#query);
  }

  // Opciones de cada filtro: los valores de todo el catálogo (la búsqueda no
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

  // announce: después de buscar o filtrar se anuncia la cantidad de filas.
  #refresh(announce = false) {
    const root = this.shadowRoot;
    const { columns, filters } = this.#data;
    const rows = this.#searched();
    const visible = filterVariants(rows, this.#values);
    const active = this.#filterCount();
    // Botón: «Filtros (N)»; deshabilitado mientras carga o si no hay filtros
    const toggle = root.querySelector('.toggle-filters');
    toggle.textContent = active ? `${TEXT.filters} (${active})` : TEXT.filters;
    toggle.disabled = this.loading || !filters.length;
    this.#renderChips();
    // Tabla
    root.querySelector('tbody').innerHTML = visible
      .map(
        (row) =>
          `<tr>` +
          `<td class="start">${thumb(row, 'thumb')}</td>` +
          `<th scope="row" class="sku-col"><span class="product">` +
          (row.name ? `<span class="name role-body-compact-medium">${esc(row.name)}</span>` : '') +
          `<arq-sku size="compact">${esc(row.sku)}</arq-sku></span></th>` +
          columns.map((c) => `<td class="role-body-lg-regular">${esc(row.values?.[c.key] ?? '—')}</td>`).join('') +
          `<td class="end">${download(row.sku)}</td>` +
          `</tr>`,
      )
      .join('');
    // Mobile: una tarjeta por variante
    const cardColumns = CARD_COLUMNS.map((key) => columns.find((c) => c.key === key)).filter(Boolean);
    root.querySelector('.cards').innerHTML = visible
      .map(
        (row) =>
          `<li class="card">` +
          `<span class="card-head">${thumb(row, 'card-thumb')}<span class="product">` +
          (row.name ? `<span class="name role-body-medium">${esc(row.name)}</span>` : '') +
          `<arq-sku size="compact">${esc(row.sku)}</arq-sku></span></span>` +
          (cardColumns.length
            ? `<dl class="card-data">` +
              cardColumns
                .map(
                  (c) =>
                    `<div class="card-item"><dt class="role-body-compact-regular">${esc(c.label)}</dt>` +
                    `<dd class="role-body-medium">${esc(row.values?.[c.key] ?? '—')}</dd></div>`,
                )
                .join('') +
              `</dl>`
            : '') +
          `<span class="card-actions">` +
          `<arq-button type="outline" show-icon icon="download" data-sku="${esc(row.sku)}">${TEXT.downloads}<span class="visually-hidden"> de ${esc(row.sku)}</span></arq-button>` +
          (row.href
            ? `<arq-button type="underline" show-underline show-icon icon="arrow-up-right" href="${esc(row.href)}">${TEXT.product}<span class="visually-hidden"> ${esc(row.name ?? row.sku)}</span></arq-button>`
            : '') +
          `</span>` +
          `</li>`,
      )
      .join('');
    // Cantidad · cargando · vacío
    root.querySelector('.total').textContent = this.loading ? TEXT.loading : TEXT.count(visible.length);
    const empty = !this.loading && !visible.length && this.#data.rows.length > 0;
    // Primera carga: la tabla funde al reemplazar las filas de carga. Solo una
    // vez: al buscar o filtrar las filas cambian sin fundido.
    if (!this.loading && !this.#revealed && !root.querySelector('.skeleton').hidden) this.#reveal();
    root.querySelector('.skeleton').hidden = !this.loading;
    if (this.loading) this.#renderSkeleton();
    root.querySelector('.scroll').hidden = empty || this.loading;
    root.querySelector('.cards').hidden = empty || this.loading;
    root.querySelector('.empty').hidden = !empty;
    if (announce) root.querySelector('.count').textContent = TEXT.count(visible.length);
  }

  // Fundido de la primera carga (prueba, rama feat/descargas-animaciones): la
  // clase reveal habilita el @starting-style del CSS y se quita al terminar el
  // fundido, así no se repite cuando la tabla vuelve a aparecer (vacío →
  // filas). Se espera el transitionend y no un temporizador: armar cientos de
  // filas demora el primer cuadro y el temporizador cortaría el fundido. Con
  // reduced motion (duración 0) no hay transición: se quita en el cuadro
  // siguiente.
  #reveal() {
    this.#revealed = true;
    const targets = [this.shadowRoot.querySelector('.scroll'), this.shadowRoot.querySelector('.cards')];
    const done = () => {
      for (const target of targets) {
        target.classList.remove('reveal');
        target.removeEventListener('transitionend', end);
        target.removeEventListener('transitioncancel', end);
      }
    };
    const end = (event) => {
      if (event.target === event.currentTarget && event.propertyName === 'opacity') done();
    };
    for (const target of targets) {
      target.classList.add('reveal');
      target.addEventListener('transitionend', end);
      target.addEventListener('transitioncancel', end);
    }
    if (!parseFloat(getComputedStyle(targets[0]).transitionDuration)) requestAnimationFrame(done);
  }

  // Chips de lo aplicado, en el orden de los filtros y de sus opciones. Se
  // reusan para no perder el foco al quitar uno.
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
    const next = left[index] ?? left[index - 1];
    (next ?? this.shadowRoot.querySelector('.toggle-filters')).focus();
  }

  // ── Panel lateral ────────────────────────────────────────────────
  // Las filas se arman al abrir, con lo aplicado marcado; mientras está
  // abierto solo cambian el estado deshabilitado y «Ver N productos».
  #openPanel(opener) {
    const panel = this.shadowRoot.querySelector('.panel');
    const rows = this.#searched();
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
    panel.count = filterVariants(rows, this.#values).length;
    panel.show(opener);
  }

  #syncPanel(values) {
    const panel = this.shadowRoot.querySelector('.panel');
    const rows = this.#searched();
    const groups = this.#options(values);
    panel.querySelectorAll('arq-filter-row').forEach((row, i) => {
      const options = groups[i] ?? [];
      row.querySelectorAll('arq-checkbox').forEach((checkbox, j) => {
        checkbox.disabled = Boolean(options[j]?.disabled) && !checkbox.checked;
      });
    });
    panel.count = filterVariants(rows, values).length;
  }

  // Filas (Desktop) o tarjetas (Mobile) de carga: la cantidad de la propuesta
  #renderSkeleton() {
    const skeleton = this.shadowRoot.querySelector('.skeleton');
    if (skeleton.childElementCount) return;
    const columns = this.#data.columns.length || SKELETON_COLUMNS;
    const bars = Array.from({ length: columns }, () => `<span class="sk-cell"><span class="sk-bar"></span></span>`).join('');
    skeleton.innerHTML =
      Array.from(
        { length: 4 },
        () =>
          `<div class="sk-row"><span class="sk-thumb"></span><span class="sk-product"><span class="sk-bar sk-short"></span><span class="sk-bar"></span></span>` +
          `<span class="sk-cells">${bars}</span><span class="sk-download"></span></div>`,
      ).join('') +
      Array.from(
        { length: 3 },
        () =>
          `<div class="sk-card"><span class="sk-head"><span class="sk-thumb"></span><span class="sk-product"><span class="sk-bar sk-short"></span><span class="sk-bar"></span></span></span>` +
          `<span class="sk-data"><span class="sk-bar"></span><span class="sk-bar"></span><span class="sk-bar"></span><span class="sk-bar"></span></span></div>`,
      ).join('');
  }
}

ArqDownloadsTable.define();

export { ArqDownloadsTable };
