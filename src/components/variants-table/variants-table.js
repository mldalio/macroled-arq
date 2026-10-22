// variants-table · Figma 1068:5582 (+ variants-table-row 923:2708) · ficha doc/variants-table
//
// Tabla de variantes: un solo componente para la ficha y para Descargas
// (decisiones.md, 2026-10-20 · Una sola variants-table). `type` decide la barra
// y qué muestran las filas; la tabla, las tarjetas Mobile, los filtros y el
// difuminado son los mismos.
//
//   <arq-variants-table downloads="descargas" label="Variantes de Kanu Jardín">   <!-- ficha -->
//     <arq-button slot="downloads" type="outline" show-icon icon="download" href="…">CAD 2D/3D</arq-button>
//     <arq-button slot="downloads" type="outline" show-icon icon="download" href="…">Manual</arq-button>
//   </arq-variants-table>
//   <arq-variants-table type="catalog" downloads="descargas"></arq-variants-table>  <!-- Descargas -->
//
//   tabla.data = {
//     columns: [{ key: 'potencia', label: 'Potencia' }, …],
//     filters: [{ key: 'color_carcasa', label: 'Acabado', swatches: true }, …],
//     rows: [{ sku, name, href, meta, thumb, search, attributes: {…}, values: {…} }],
//   };
//   tabla.addEventListener('arq:downloads', (e) => llenarModal(e.detail.sku));
//
// Type
// - product (por defecto, ficha): los SKU de un grupo. Barra: Filtros con la
//   cantidad («4 variantes») a la izquierda y, a la derecha, los archivos
//   generales del grupo (slot `downloads`: CAD 2D/3D y Manual). Las filas
//   muestran solo el sku (sin nombre). Sin buscador, sin «Ver más», sin
//   y sin la URL.
// - catalog (Descargas): todos los SKU del catálogo. Barra: el buscador a la
//   izquierda y Filtros a la derecha, del lado donde se abre filter-panel;
//   debajo del buscador, la cantidad («4 productos»; cargando, «Buscando…»);
//   debajo de Filtros, a la derecha, los chips de lo aplicado y «Limpiar
//   filtros». Las filas muestran el nombre
//   sobre el sku. Búsqueda y filtros en la URL (?q=…&tipo_montaje=Pared…, con
//   history.replaceState); de a 100 filas con «Ver más productos».
//
// En los dos
// - Filtros: el botón abre filter-panel (panel lateral derecho en Desktop,
//   pantalla completa en Mobile) con una filter-row de checkbox por filtro. Se
//   aplica con «Ver N …»; cerrar descarta. El botón dice «Filtros (N)» y debajo
//   de la barra van los chips de lo aplicado y «Limpiar filtros».
// - Selección múltiple: dentro de un filtro, una fila cumple si tiene
//   cualquiera de los valores elegidos; entre filtros, todos
//   (src/data/variants.js). Las opciones que no darían filas van deshabilitadas.
// - Desktop: <table> real con miniatura (layout/table-thumb), sku Compact (con el
//   nombre encima en catalog), columnas de datos y la descarga (icon-button
//   Large Outline). Miniatura, sku (desde 1024 px) y descarga quedan fijas al
//   desplazar en horizontal; mientras queda tabla por ver, un difuminado junto
//   a las columnas fijas lo avisa. Encabezado en role/body-regular. Si no entra
//   en el ancho, abajo, pegada al borde inferior de la pantalla, la línea de
//   progreso de las columnas (arq-carousel-controls, como la de la Home).
// - Mobile (hasta 767 px): una tarjeta por variante (variants-table-card):
//   miniatura, sku (y nombre en catalog), con la descarga arriba a la derecha;
//   seis datos en dos columnas.
// - loading: filas (o tarjetas) de carga en color/surface/subtle.
// - Sin filas que cumplan: «No hay productos con estos filtros» (role/heading-2)
//   con su ayuda (role/body-regular); si el vacío viene de la búsqueda, el
//   texto nombra lo buscado.
// - La cantidad se anuncia a los lectores de pantalla (en catalog, al dejar de
//   escribir: 500 ms, no con cada tecla).
// - Descarga de cada fila: emite arq:downloads { sku } y, con
//   downloads="<id>", abre ese download-modal.

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
import '../carousel-controls/carousel-controls.js';
import css from './variants-table.css?inline';

const NUMBER = new Intl.NumberFormat('es-AR');

const esc = (text) => String(text ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

// Celda con dato (como hasValue de src/data/attributes.js: «-» cuenta como vacío)
const filled = (value) => value !== undefined && value !== null && String(value).trim() !== '' && value !== '-';

const TEXT = {
  filters: 'Filtros',
  search: 'Buscar por nombre o SKU…',
  searchLabel: 'Buscar por nombre o SKU',
  clear: 'Limpiar filtros',
  downloads: 'Descargas',
  image: 'Imagen',
  sku: 'SKU',
  loading: 'Buscando…',
  // Vacío según la causa: filtros, búsqueda o las dos.
  // TODO (diseño): textos del vacío por búsqueda (la propuesta solo tiene el de filtros).
  emptyTitle: 'No hay productos con estos filtros',
  emptyText: 'Probá quitar alguno de los filtros aplicados o buscar por otro nombre o SKU.',
  emptySearchTitle: (q) => `No hay productos para «${q}»`,
  emptySearchText: 'Probá con otro nombre o SKU, o con una parte del código.',
  emptyBothTitle: (q) => `No hay productos para «${q}» con estos filtros`,
  // TODO (diseño): vacío de la ficha (sin buscador): no tiene diseño propio.
  emptyVariantsTitle: 'No hay variantes con estos filtros',
  emptyVariantsText: 'Probá quitar alguno de los filtros aplicados.',
  // TODO (diseño): «Ver más» no está en la propuesta (2575:22875).
  more: 'Ver más productos',
  shown: (n, total) => `Se muestran ${NUMBER.format(n)} de ${NUMBER.format(total)} productos`,
  count: (n) => (n === 1 ? '1 producto' : `${NUMBER.format(n)} productos`),
  countVariants: (n) => (n === 1 ? '1 variante' : `${NUMBER.format(n)} variantes`),
};

// Filas que se muestran de entrada y por cada «Ver más» (solo catalog): con todo
// el catálogo (cientos de SKU) rearmar todas las filas en cada tecla tardaba más
// de un segundo; con tandas de 100 la búsqueda sigue al ritmo del teclado.
const PAGE = 100;

// Una columna es «larga» (mide lo suyo y no ensancha a las demás) si su valor más
// ancho pasa de tantas veces la mediana de las columnas.
const LONG = 1.5;

// La cantidad se anuncia al lector de pantalla cuando se deja de escribir,
// no con cada tecla.
const ANNOUNCE_DELAY = 500;

// Datos de la tarjeta Mobile, de a dos por fila: Potencia y Temp.; CRI y Flujo
// lum.; Acabado y Tamaño. Si el dato no está entre las columnas, se omite.
const CARD_COLUMNS = ['potencia', 'temperatura_color', 'cri', 'flujo_luminoso', 'color_carcasa', 'tamanio'];

// Columnas de datos de las filas de carga, antes de tener los datos
const SKELETON_COLUMNS = 9;

// Descarga de una fila (tabla): icon-button Large Background=Outline (Figma 1218:10705)
const download = (sku) =>
  `<arq-icon-button icon="download" size="large" background="outline" data-sku="${esc(sku)}">Descargas de ${esc(sku)}</arq-icon-button>`;

// Miniatura. En catalog, con href, es un link al producto (el mismo del nombre: no
// entra en el orden de tabulación ni se anuncia dos veces).
const thumb = (row, className, link = false) => {
  const image = `<span class="${className}">${row.thumb ? `<img src="${esc(row.thumb)}" alt="" loading="lazy">` : ''}</span>`;
  return link && row.href ? `<a class="thumb-link" href="${esc(row.href)}" tabindex="-1" aria-hidden="true">${image}</a>` : image;
};

// Nombre del producto (solo en catalog). Con href es el link a la ficha, con el
// sku elegido; sin href, texto.
const productName = (row, role) =>
  row.href
    ? `<a class="name name-link ${role}" href="${esc(row.href)}">${esc(row.name)}</a>`
    : `<span class="name ${role}">${esc(row.name)}</span>`;

class ArqVariantsTable extends ArqElement {
  static tag = 'arq-variants-table';
  static styles = css;
  static properties = {
    type: { type: String, values: ['product', 'catalog'], default: 'product' }, // Type: ficha (un grupo) · Descargas (todo el catálogo)
    loading: { type: Boolean }, // filas de carga
    downloads: { type: String }, // id del arq-download-modal que abre la descarga de cada fila
    label: { type: String, default: 'Variantes' }, // nombre de la región con scroll (único en la página)
  };
  static template =
    `<div class="controls">` +
    `<arq-search-field class="search" type="line" size="medium" show-icon show-clear placeholder="${TEXT.search}" label="${TEXT.searchLabel}" hidden></arq-search-field>` +
    `<arq-button class="toggle-filters" show-icon icon="filter">${TEXT.filters}</arq-button>` +
    `<span class="total role-body" aria-hidden="true"></span>` +
    `<div class="downloads"><slot name="downloads"></slot></div>` +
    `<div class="applied" hidden>` +
    `<div class="chips" role="list" aria-label="Filtros aplicados"></div>` +
    `<arq-button class="clear" type="underline" show-underline>${TEXT.clear}</arq-button>` +
    `</div>` +
    `<div class="head" aria-hidden="true" hidden><table class="head-table"><colgroup></colgroup><thead></thead></table></div>` +
    `</div>` +
    `<div class="scroll" id="scroll" tabindex="0" role="region" aria-label="Variantes">` +
    `<table class="table"><thead></thead><tbody></tbody></table>` +
    `</div>` +
    `<div class="scrollbar" hidden><arq-carousel-controls buttons="none" progress="scroll" for="scroll"></arq-carousel-controls></div>` +
    `<ul class="cards" role="list" aria-label="Variantes"></ul>` +
    `<div class="more" hidden><arq-button class="more-button" type="outline">${TEXT.more}</arq-button></div>` +
    `<div class="skeleton" aria-hidden="true" hidden></div>` +
    `<div class="empty" hidden><p class="empty-title role-heading-2">${TEXT.emptyTitle}</p><p class="empty-text role-body-regular">${TEXT.emptyText}</p></div>` +
    `<span class="visually-hidden count" role="status"></span>` +
    `<arq-filter-panel class="panel" unit="variantes"><span slot="title">${TEXT.filters}</span></arq-filter-panel>`;

  #data = { columns: [], filters: [], rows: [] };
  #values = {}; // filtro → [valores]
  #query = '';
  #revealed = false; // ya se hizo el fundido de la primera carga
  #shown = PAGE; // filas a la vista (Ver más suma PAGE)
  #announceTimer = null;
  #measure = null;
  #sized = false; // ya se igualó el ancho de las columnas
  #availableWidth = 0; // ancho del contenedor con el que se igualaron
  #onPageScroll = () => this.#updateStuck();

  get #catalog() {
    return this.type === 'catalog';
  }

  get data() {
    return this.#data;
  }

  set data(value) {
    this.#data = { columns: value?.columns ?? [], filters: value?.filters ?? [], rows: value?.rows ?? [] };
    this.#values = {};
    this.#restoreUrl();
    if (this.isConnected) this.#build();
  }

  // Solo catalog: búsqueda y filtros viven en la URL (?q=…&tipo_montaje=Pared…):
  // al volver de «Ver producto», la tabla está como se dejó. Solo cuentan los
  // filtros que existen en los datos. En la ficha la URL ya lleva ?sku=.
  #restoreUrl() {
    if (!this.#catalog) return;
    const params = new URLSearchParams(location.search);
    this.#query = params.get('q') ?? '';
    const values = {};
    for (const { key } of this.#data.filters) {
      const list = params.getAll(key);
      if (list.length) values[key] = list;
    }
    this.#values = values;
    const search = this.shadowRoot?.querySelector('.search');
    if (search) search.value = this.#query;
  }

  #syncUrl() {
    if (!this.#catalog) return;
    const url = new URL(location.href);
    url.searchParams.delete('q');
    for (const { key } of this.#data.filters) url.searchParams.delete(key);
    if (this.#query.trim()) url.searchParams.set('q', this.#query.trim());
    for (const { key } of this.#data.filters) for (const value of this.#values[key] ?? []) url.searchParams.append(key, value);
    if (url.href !== location.href) history.replaceState(history.state, '', url);
  }

  // Cambio de la persona (búsqueda, filtros, chips): vuelve a la primera tanda,
  // actualiza la URL y anuncia la cantidad (al dejar de escribir, si busca).
  #changed(delay = 0) {
    this.#shown = PAGE;
    this.#refresh();
    this.#syncUrl();
    this.#announce(this.#countText(this.#visible().length), delay);
  }

  #countText(n) {
    return this.#catalog ? TEXT.count(n) : TEXT.countVariants(n);
  }

  #announce(text, delay = 0) {
    clearTimeout(this.#announceTimer);
    this.#announceTimer = setTimeout(() => {
      this.shadowRoot.querySelector('.count').textContent = text;
    }, delay);
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('scroll', this.#onPageScroll, { passive: true });
    window.addEventListener('resize', this.#onPageScroll, { passive: true });
  }

  disconnectedCallback() {
    window.removeEventListener('scroll', this.#onPageScroll);
    window.removeEventListener('resize', this.#onPageScroll);
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
      this.#changed(ANNOUNCE_DELAY);
    });
    // Enter no envía a otra página: la tabla ya se filtró al escribir.
    root.querySelector('.search').addEventListener('arq:submit', (event) => event.stopPropagation());
    root.querySelector('.chips').addEventListener('click', (event) => {
      const chip = event.target.closest('arq-filter-chip');
      if (chip) this.#removeChip(chip);
    });
    root.querySelector('.clear').addEventListener('click', () => {
      this.#values = {};
      this.#changed();
      root.querySelector('.toggle-filters').focus();
    });
    root.querySelector('.more-button').addEventListener('click', () => this.#showMore());
    // Sin archivos generales en la barra, el slot no ocupa lugar
    const downloads = root.querySelector('slot[name="downloads"]');
    const toggleDownloads = () => (downloads.parentElement.hidden = !downloads.assignedElements().length);
    downloads.addEventListener('slotchange', toggleDownloads);
    toggleDownloads();
    // Panel lateral: «Ver N …» se calcula con lo marcado; se aplica al
    // confirmar (cerrar descarta).
    const panel = root.querySelector('.panel');
    panel.addEventListener('arq:filters', (event) => {
      event.stopPropagation();
      this.#syncPanel(event.detail.filters);
    });
    panel.addEventListener('arq:apply', (event) => {
      event.stopPropagation();
      this.#values = { ...event.detail.filters };
      this.#changed();
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

  // Difuminado en los bordes de las columnas fijas mientras queda tabla por ver
  // de ese lado (variants-table.css, .more-start / .more-end), en los dos types.
  // Si la tabla no entra en el ancho, abajo de todo, pegada al borde inferior de
  // la pantalla mientras la tabla está a la vista, una barra con la línea de
  // progreso (arq-carousel-controls, como en la Home, sin flechas): reemplaza a la barra de scroll nativa, que quedaría al final de cientos
  // de filas.
  #scrollbar() {
    const root = this.shadowRoot;
    const scroll = root.querySelector('.scroll');
    const bar = root.querySelector('.scrollbar');
    const head = root.querySelector('.head');
    const table = root.querySelector('.table');
    // scrollWidth incluye también desbordes decorativos de las columnas sticky.
    // El ancho real de la tabla determina si quedan columnas por desplazar.
    const overflow = () => Math.max(0, table.getBoundingClientRect().width - scroll.clientWidth);
    const edges = () => {
      const max = overflow();
      const rest = max - scroll.scrollLeft;
      for (const target of [scroll, head]) {
        target.classList.toggle('more-start', max > 1 && scroll.scrollLeft > 1);
        target.classList.toggle('more-end', rest > 1);
      }
    };
    scroll.addEventListener('scroll', () => {
      head.scrollLeft = scroll.scrollLeft; // la copia del encabezado acompaña el desplazamiento
      edges();
    }, { passive: true });
    this.#measure = () => {
      const fits = overflow() <= 1;
      bar.hidden = scroll.hidden || fits;
      scroll.classList.toggle('fits', fits);
      edges();
    };
    const observer = new ResizeObserver(() => {
      this.#measure();
      if (!this.#sized || scroll.clientWidth !== this.#availableWidth) this.#equalizeColumns();
      this.#syncHead();
    });
    // Con la tipografía recién cargada los textos cambian de ancho
    document.fonts?.ready.then(() => this.#equalizeColumns());
    observer.observe(scroll);
    observer.observe(root.querySelector('.table'));
  }

  update(changed) {
    const root = this.shadowRoot;
    if (changed.has('label')) root.querySelector('.scroll').setAttribute('aria-label', this.label ?? 'Variantes');
    if (changed.has('type')) {
      root.querySelector('.search').hidden = !this.#catalog;
      root.querySelector('.panel').unit = this.#catalog ? 'productos' : 'variantes';
      root.querySelector('.cards').setAttribute('aria-label', this.label ?? 'Variantes');
      // El tipo puede llegar después de los datos (atributo puesto con JS)
      if (this.#catalog && !this.#query && !this.#filterCount()) {
        this.#restoreUrl();
        this.#build();
      }
      this.#measure?.();
    }
    if (changed.has('loading') || changed.has('type')) this.#refresh();
  }

  #build() {
    this.#refresh();
  }

  // Encabezado: imagen · SKU · columnas · descarga
  #renderHead(columns) {
    this.shadowRoot.querySelector('.table thead').innerHTML =
      `<tr><th scope="col" class="start"><span class="visually-hidden">${TEXT.image}</span></th>` +
      `<th scope="col" class="sku-col role-body-compact-regular">${TEXT.sku}</th>` +
      columns.map((c) => `<th scope="col" class="role-body-compact-regular${c.wide ? ' wide' : ' data'}"><span class="cell">${esc(c.label)}</span></th>`).join('') +
      `<th scope="col" class="end role-body-compact-regular">${TEXT.downloads}</th></tr>`;
  }

  // Columnas con algún dato en las filas que cumplen la búsqueda y los filtros
  // (todas, no solo la tanda visible: «Ver más» no cambia las columnas). Una
  // columna vacía en todas no se muestra.
  #shownColumns(visible) {
    if (!visible.length) return this.#data.columns;
    return this.#data.columns.filter((c) => visible.some((row) => filled(row.values?.[c.key])));
  }

  // Filas de la búsqueda (antes de los filtros). Solo catalog busca.
  #searched() {
    return this.#catalog ? searchVariants(this.#data.rows, this.#query) : this.#data.rows;
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

  // Filas que cumplen la búsqueda y los filtros
  #visible() {
    return filterVariants(this.#searched(), this.#values);
  }

  // Ver más: suma una tanda. El foco queda en el botón; si ya no quedan más,
  // pasa a la primera fila nueva (el botón desaparece).
  #showMore() {
    const root = this.shadowRoot;
    const before = this.#shown;
    this.#shown += PAGE;
    this.#refresh();
    const total = this.#visible().length;
    this.#announce(TEXT.shown(Math.min(this.#shown, total), total));
    if (root.querySelector('.more').hidden) {
      const mobile = getComputedStyle(root.querySelector('.cards')).display !== 'none';
      root.querySelectorAll(mobile ? '.cards [data-sku]' : 'tbody [data-sku]')[before]?.focus();
    }
  }

  #refresh() {
    const root = this.shadowRoot;
    const catalog = this.#catalog;
    const { filters } = this.#data;
    const visible = this.#visible();
    const page = catalog ? visible.slice(0, this.#shown) : visible;
    const active = this.#filterCount();
    const columns = this.#shownColumns(visible);
    this.#renderHead(columns);
    // Botón: «Filtros (N)»; deshabilitado mientras carga o si no hay filtros
    const toggle = root.querySelector('.toggle-filters');
    toggle.textContent = active ? `${TEXT.filters} (${active})` : TEXT.filters;
    toggle.disabled = this.loading || !filters.length;
    this.#renderChips();
    // Tabla: el nombre solo en catalog
    root.querySelector('.table tbody').innerHTML = page
      .map(
        (row) =>
          `<tr>` +
          `<td class="start">${thumb(row, 'thumb', catalog)}</td>` +
          `<th scope="row" class="sku-col"><span class="product">` +
          (catalog && row.name ? productName(row, 'role-body-compact-regular') : '') +
          `<arq-sku size="compact" dense data-arq-copy-feedback="replace">${esc(row.sku)}</arq-sku></span></th>` +
          columns.map((c) => `<td class="role-body-compact-regular${c.wide ? ' wide' : ' data'}"><span class="cell">${esc(row.values?.[c.key] ?? '—')}</span></td>`).join('') +
          `<td class="end">${download(row.sku)}</td>` +
          `</tr>`,
      )
      .join('');
    // Mobile: una tarjeta por variante
    const cardColumns = CARD_COLUMNS.map((key) => columns.find((c) => c.key === key)).filter(Boolean);
    root.querySelector('.cards').innerHTML = page
      .map((row) => {
        // En catalog, cada tarjeta muestra solo los datos que su SKU tiene cargados
        const items = catalog ? cardColumns.filter((c) => (row.values?.[c.key] ?? '') !== '') : cardColumns;
        return (
          `<li class="card">` +
          `<span class="card-head">${thumb(row, 'card-thumb', catalog)}<span class="product">` +
          (catalog && row.name ? productName(row, 'role-body-compact-regular') : '') +
          `<arq-sku size="compact" dense data-arq-copy-feedback="replace">${esc(row.sku)}</arq-sku></span>${download(row.sku)}</span>` +
          (items.length
            ? `<dl class="card-data">` +
              items
                .map(
                  (c) =>
                    `<div class="card-item"><dt class="role-body-compact-regular">${esc(c.label)}</dt>` +
                    `<dd class="role-body-compact-medium">${esc(row.values?.[c.key] ?? '—')}</dd></div>`,
                )
                .join('') +
              `</dl>`
            : '') +
          `</li>`
        );
      })
      .join('');
    // Cantidad · cargando · vacío
    root.querySelector('.total').textContent = this.loading ? TEXT.loading : this.#countText(visible.length);
    const empty = !this.loading && !visible.length && this.#data.rows.length > 0;
    // Primera carga: la tabla funde al reemplazar las filas de carga. Solo una
    // vez: al buscar o filtrar las filas cambian sin fundido.
    if (!this.loading && !this.#revealed && !root.querySelector('.skeleton').hidden) this.#reveal();
    root.querySelector('.skeleton').hidden = !this.loading;
    if (this.loading) this.#renderSkeleton();
    root.querySelector('.scroll').hidden = empty || this.loading;
    root.querySelector('.cards').hidden = empty || this.loading;
    root.querySelector('.more').hidden = !catalog || this.loading || visible.length <= this.#shown;
    root.querySelector('.empty').hidden = !empty;
    if (empty) this.#renderEmpty(active);
    this.#equalizeColumns();
    this.#updateStuck();
  }

  // Columnas de datos del mismo ancho. El ancho común es el de la más ancha entre las
  // columnas «normales»; las largas miden lo suyo, cada una con su máximo. Es
  // larga la marcada `wide` en los datos o la que pasa de LONG veces la mediana
  // de las columnas (un valor como «Si, mediante fuente DIM» no ensancha a las
  // demás). Se mide del contenido (cada texto va en un span.cell sin cortes de
  // línea) y se aplica como --col-width (comunes) o como ancho de la celda
  // (largas). Si la tabla es más ancha que sus columnas (pocas columnas o textos
  // cortos), el ancho que sobra se reparte parejo entre todas las columnas de
  // datos, así no queda un hueco entre el sku y los datos: el sku solo conserva
  // lo que mide. Con la tabla oculta (cargando, vacío) no hay medidas: se repite
  // al mostrarse y cuando cambia el ancho disponible.
  #equalizeColumns() {
    const table = this.shadowRoot.querySelector('.table');
    table.style.removeProperty('--col-width');
    const cells = [...table.querySelectorAll('.data, .wide')];
    for (const cell of cells) {
      cell.style.width = '';
      cell.firstElementChild.style.minWidth = '';
    }
    const columns = new Map(); // índice de columna → { wide, width: el valor más ancho }
    for (const cell of cells) {
      const column = columns.get(cell.cellIndex) ?? { wide: false, width: 0 };
      column.wide ||= cell.classList.contains('wide');
      column.width = Math.max(column.width, cell.firstElementChild.getBoundingClientRect().width);
      columns.set(cell.cellIndex, column);
    }
    const widths = [...columns.values()].filter((column) => column.width).map((column) => column.width).sort((x, y) => x - y);
    const median = widths[Math.floor(widths.length / 2)] ?? 0;
    for (const column of columns.values()) column.wide ||= column.width > median * LONG;
    const common = Math.max(0, ...[...columns.values()].filter((column) => !column.wide).map((column) => column.width));
    const apply = (extra) => {
      if (common) table.style.setProperty('--col-width', `${Math.ceil(common + extra)}px`);
      for (const cell of cells) {
        const column = columns.get(cell.cellIndex);
        if (!column.wide || !column.width) continue;
        cell.style.width = `${Math.ceil(column.width + extra)}px`;
        cell.firstElementChild.style.minWidth = `${Math.ceil(column.width + extra)}px`;
      }
    };
    apply(0);
    const available = this.shadowRoot.querySelector('.scroll').clientWidth;
    const fitsNaturally = table.getBoundingClientRect().width <= available + 1;
    // Lo que sobra: lo que ocupa de más la columna del sku (la única sin ancho fijo)
    const sku = table.querySelector('thead th.sku-col');
    const products = [...table.querySelectorAll('tbody .product')];
    if (fitsNaturally && sku && products.length && columns.size) {
      const natural = Math.max(...products.map((product) => Math.max(...[...product.children].map((child) => child.getBoundingClientRect().width))));
      const extra = sku.getBoundingClientRect().width - natural - parseFloat(getComputedStyle(sku).paddingInlineEnd);
      if (extra > 1) {
        apply(Math.floor(extra / columns.size));
        // Repartir espacio vacío nunca debe crear un desborde nuevo.
        if (table.getBoundingClientRect().width > available + 1) apply(0);
      }
    }
    this.#availableWidth = this.shadowRoot.querySelector('.scroll').clientWidth;
    this.#sized = widths.length > 0;
    this.#measure?.();
    this.#syncHead();
  }

  // Copia del encabezado para la barra fija: la tabla no puede dejar fijo su
  // <thead> (el contenedor con scroll horizontal lo impide), así que debajo de la
  // barra va una copia con las mismas columnas (mismo ancho que la real), que
  // solo se ve mientras el encabezado real quedó arriba.
  #syncHead() {
    const root = this.shadowRoot;
    const real = [...root.querySelectorAll('.table thead th')];
    const head = root.querySelector('.head-table');
    const widths = real.map((th) => th.getBoundingClientRect().width);
    if (!widths.some(Boolean)) return;
    head.querySelector('thead').innerHTML = root.querySelector('.table thead').innerHTML;
    head.querySelector('colgroup').innerHTML = widths.map((width) => `<col style="width:${width}px">`).join('');
    head.style.width = `${widths.reduce((sum, width) => sum + width, 0)}px`;
    root.querySelector('.head').scrollLeft = root.querySelector('.scroll').scrollLeft;
    this.#updateStuck();
  }

  // La copia se ve cuando el encabezado real ya pasó por debajo de la barra y
  // todavía queda tabla por ver.
  #updateStuck() {
    const root = this.shadowRoot;
    const head = root.querySelector('.head');
    // La barra solo se fija si la tabla no entra en la pantalla: con pocas filas
    // (4 variantes, o una búsqueda o filtro con pocos resultados) no hay qué
    // desplazar y fijarla no aporta.
    const fixed = this.getBoundingClientRect().height > window.innerHeight;
    root.querySelector('.controls').classList.toggle('fixed', fixed);
    const thead = root.querySelector('.table thead').getBoundingClientRect();
    const controls = root.querySelector('.controls').getBoundingClientRect();
    const table = root.querySelector('.table').getBoundingClientRect();
    head.hidden = !fixed || this.loading || !thead.height || !(thead.top < controls.bottom && table.bottom > controls.bottom + thead.height);
  }
  // Vacío según la causa: búsqueda, filtros o las dos
  #renderEmpty(active) {
    const root = this.shadowRoot;
    const query = this.#catalog ? this.#query.trim() : '';
    let title = TEXT.emptyTitle;
    let text = TEXT.emptyText;
    if (!this.#catalog) {
      title = TEXT.emptyVariantsTitle;
      text = TEXT.emptyVariantsText;
    } else if (query) {
      title = active ? TEXT.emptyBothTitle(query) : TEXT.emptySearchTitle(query);
      if (!active) text = TEXT.emptySearchText;
    }
    root.querySelector('.empty-title').textContent = title;
    root.querySelector('.empty-text').textContent = text;
  }

  // Fundido de la primera carga (decisiones.md, 2026-10-15 · Descargas): la
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
    this.#changed();
    const left = [...this.shadowRoot.querySelectorAll('.chips arq-filter-chip')];
    const next = left[index] ?? left[index - 1];
    (next ?? this.shadowRoot.querySelector('.toggle-filters')).focus();
  }

  // ── Panel lateral ────────────────────────────────────────────────
  // Las filas se arman al abrir, con lo aplicado marcado. Con cada cambio se
  // ocultan las opciones que no darían filas con la búsqueda y lo marcado, y
  // los filtros sin nada que elegir (filter-panel showAvailable; decisiones.md,
  // 2026-10-22 · Filtros que no aplican).
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
          row.append(checkbox);
        }
        // Abierta si tiene filtros aplicados (filter-row)
        row.open = groups[i].some((o) => o.selected);
        return row;
      }),
    );
    this.#syncPanel(this.#values);
    panel.show(opener);
  }

  // Cantidad al lado de cada opción: las filas que daría con la búsqueda y los
  // otros filtros (en el mismo filtro los valores se suman, así que cuenta
  // como si fuera el único elegido ahí). Sin filas, la opción se oculta.
  #syncPanel(values) {
    const panel = this.shadowRoot.querySelector('.panel');
    const rows = this.#searched();
    for (const checkbox of panel.options) {
      const key = checkbox.getAttribute('name');
      const count = filterVariants(rows, { ...values, [key]: [checkbox.value] }).length;
      checkbox.count = count || null;
    }
    panel.showAvailable((checkbox) => Number.isFinite(checkbox.count));
    panel.count = filterVariants(rows, values).length;
  }

  // Filas (Desktop) o tarjetas (Mobile) de carga
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

ArqVariantsTable.define();

export { ArqVariantsTable };
