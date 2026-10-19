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
// - Categoría: sale de la URL (?environment=, ?application=, ?product_type=,
//   ?collection= para las cards de producto de una colección;
//   las URLs de categoría están PENDIENTES, docs/urls.md). Se marca sola el
//   catalog-nav-item cuyo href coincide con la página, y el <h1> del
//   page-header pasa a ser el nombre de su grupo (Interior, Exterior…).
// - Búsqueda: ?q= filtra el listado con el criterio del buscador del navbar
//   ("Ver todos los resultados" y Enter llegan acá; decisiones.md,
//   2026-10-05 · Búsqueda en Productos). Se combina con categoría y filtros.
// - Filtros técnicos: las filas del filter-panel salen de los datos de la
//   categoría. "Ver N" aplica (arq:apply) y la grilla se vuelve a armar.
// - Comparar (solo Productos): "Comparar" de cada card suma o saca el producto
//   de la compare-bar (hasta 3; la selección se guarda en arq:compare). El
//   lugar vacío (+) de la barra abre compare-picker para agregar desde ahí.
//   La barra se ve también en «Todas las colecciones» (las cards de colección
//   no tienen Comparar, pero la selección sigue y se puede agregar con el +).
// - Iluminar: lo resuelve catalog-toolbar (data-arq-theme en <html>).
// - Al desplazarse, catalog-toolbar pasa a State=Scroll con el nombre de la
//   página (el texto del <h1> del page-header).

import { ArqElement } from '../../base/arq-element.js';
import { listProducts, listCollections, listCompareCandidates } from '../../data/catalog.js';
import { handOffTheme } from '../../base/theme.js';
import '../catalog-toolbar/catalog-toolbar.js';
import '../filter-panel/filter-panel.js';
import '../filter-row/filter-row.js';
import '../checkbox/checkbox.js';
import '../compare-bar/compare-bar.js';
import '../compare-picker/compare-picker.js';
import '../grid/grid.js';
import '../product-card/product-card.js';
import '../swatch/swatch.js';
import css from './catalog-listing.css?inline';

const CATEGORY_PARAMS = { environment: 'environment', application: 'application', product_type: 'productType', collection: 'collection' };
const LISTING_DESKTOP = matchMedia('(min-width: 1024px)');
const LISTING_WIDE = matchMedia('(min-width: 1920px)');
const ENTER_STAGGERED = 8; // cards con escalón en la entrada; el resto entra con la octava

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
    `<arq-compare-picker class="picker"></arq-compare-picker>` +
    `<div class="compare-space" aria-hidden="true"></div>` +
    // Aviso para lectores de pantalla (límite de Comparar). Está siempre en la
    // página y vacío; solo cambia su texto (DESIGN.md §9).
    `<p class="notice visually-hidden" aria-live="polite"></p>`;

  #category = {};
  #query = '';
  #filters = {};
  #cards = new Map(); // product-card → datos de la card
  #request = 0;
  #anchorY = 0; // scroll donde empezó la dirección actual
  #direction = 'down';
  #scrollState = null; // 'top' · 'down' · 'up'
  #threshold = 0;
  #htmlCrumbs = null; // niveles del breadcrumb del HTML después de Inicio
  #htmlTitle = null; // <h1> del HTML (Productos), para volver a él sin categoría

  setup() {
    // Productos y Colecciones comparten el mismo embed. "Todas las
    // colecciones" cambia solamente la vista del listado.
    if (new URLSearchParams(location.search).get('view') === 'colecciones') this.unit = 'colecciones';
    const root = this.shadowRoot;
    this.#category = categoryFromUrl();
    this.#query = new URLSearchParams(location.search).get('q')?.trim() ?? '';
    this.#syncScrollState();
    window.addEventListener('scroll', this.#onScroll, { passive: true });
    root.querySelector('slot[name="nav"]').addEventListener('slotchange', () => this.#markNav());
    // Cambiar de categoría no recarga la página: se actualiza la URL y se
    // vuelve a pedir solo el listado (sin parpadeo, también con Iluminar).
    root.addEventListener('click', this.#onNavClick);
    // Lo mismo con los niveles del breadcrumb que vuelven a este listado
    // (Productos, Exterior…)
    document.querySelector('arq-page-header')?.addEventListener('click', this.#onNavClick);
    // Iluminar solo pasa a la ficha: un listado nuevo empieza sin traspaso, y al
    // entrar a un producto se avisa si está iluminado (theme.js)
    handOffTheme(false);
    root.querySelector('.grid').addEventListener('click', (event) => {
      if (event.composedPath().some((node) => node.localName === 'a' && node.hasAttribute('href'))) handOffTheme(document.documentElement.getAttribute('data-arq-theme') === 'dark');
    });
    window.addEventListener('popstate', this.#onPopState);

    const panel = root.querySelector('arq-filter-panel');
    panel.addEventListener('arq:filters', (event) => this.#count(event.detail.filters));
    panel.addEventListener('arq:apply', (event) => {
      this.#filters = event.detail.filters;
      this.#load();
    });

    const grid = root.querySelector('.grid');
    const syncGridColumns = () => {
      // El catálogo usa tres cards junto al sidebar; desde el modo Wide la
      // composición pasa a cuatro. Antes del sidebar vuelve al auto-fill.
      grid.columns = LISTING_DESKTOP.matches ? (LISTING_WIDE.matches ? 4 : 3) : null;
    };
    LISTING_DESKTOP.addEventListener('change', syncGridColumns);
    LISTING_WIDE.addEventListener('change', syncGridColumns);
    syncGridColumns();
    const bar = root.querySelector('.compare');
    grid.addEventListener('arq:compare', (event) => {
      const card = event.target;
      const data = this.#cards.get(card);
      if (!data) return;
      if (!event.detail.checked) bar.remove(data.sku);
      else if (!bar.add({ sku: data.sku, name: data.name, meta: data.meta, image: data.image })) {
        card.compared = false; // ya hay 3
        // TODO (diseño): no hay aviso visible del límite en Figma; por ahora
        // solo se anuncia a lectores de pantalla.
        this.#notify(`Podés comparar hasta ${bar.items.length} productos. Sacá uno de la barra para sumar otro.`);
      }
    });
    bar.addEventListener('arq:compare-change', () => {
      this.#syncCompared();
      requestAnimationFrame(() => this.#syncSpace());
      if (picker.open) this.#loadPicker();
    });

    // «Agregar producto» (compare-picker): lo abre el lugar vacío (+) de la
    // compare-bar; lo que se agrega va a la barra.
    const picker = root.querySelector('.picker');
    bar.addEventListener('arq:add', (event) => {
      event.stopPropagation();
      picker.show(); // emite arq:search: carga la lista
    });
    picker.addEventListener('arq:search', () => this.#loadPicker());
    // El lugar vacío que lo abrió ya tiene producto: el foco vuelve a la barra
    picker.addEventListener('arq:close', (event) => {
      if (!event.detail.restored) bar.focusAdd();
    });
    picker.addEventListener('arq:add', (event) => {
      // En la barra, la misma meta que las cards (no la del modal)
      const { sku, name, cardMeta, meta, image } = event.detail.item;
      bar.add({ sku, name, meta: cardMeta ?? meta, image });
    });

    // La compare-bar es fija abajo: un espacio de su alto al final del listado
    // para que no tape las últimas cards ni el footer (README de compare-bar).
    new ResizeObserver(() => this.#syncSpace()).observe(bar);
    requestAnimationFrame(() => this.#syncSpace());
  }

  #onNavClick = (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const item = event.target.closest?.('arq-catalog-nav-item, arq-breadcrumb-item:not([current])');
    const href = item?.getAttribute('href') ?? item?.href;
    if (!href) return;
    const url = new URL(href, location.href);
    // Otra página u otro origen: navegación normal
    if (url.origin !== location.origin || url.pathname.replace(/\/$/, '') !== location.pathname.replace(/\/$/, '')) return;
    event.preventDefault();
    if (url.pathname + url.search === location.pathname + location.search) return;
    history.pushState(null, '', url.pathname + url.search);
    this.shadowRoot.querySelector('arq-filter-panel').open = false;
    this.#goTo();
  };

  #onPopState = () => this.#goTo();

  #pickerRequest = 0;

  // Productos del compare-picker con la búsqueda y el filtro del modal; los
  // de la barra salen como Agregado (y con 3, el resto Disabled).
  async #loadPicker() {
    const root = this.shadowRoot;
    const bar = root.querySelector('.compare');
    const picker = root.querySelector('.picker');
    const selected = bar.items.map((item) => item.sku);
    const request = ++this.#pickerRequest;
    picker.count = selected.length;
    picker.href = location.pathname; // «Ver todos los productos»: este listado, sin categoría
    try {
      const { items } = await listCompareCandidates({ ...picker.search, selected });
      if (request === this.#pickerRequest) picker.items = items;
    } catch (error) {
      console.error('[arq] compare-picker: no se pudo cargar el catálogo', error);
    }
  }

  // Relee la URL (categoría, búsqueda, vista) y recarga solo el listado. El
  // scroll queda donde está la persona.
  #goTo() {
    const params = new URLSearchParams(location.search);
    const unit = params.get('view') === 'colecciones' ? 'colecciones' : 'productos';
    this.#category = categoryFromUrl();
    this.#query = params.get('q')?.trim() ?? '';
    this.#filters = {};
    this.shadowRoot.querySelector('arq-filter-panel').clear();
    this.#markNav();
    if (this.unit !== unit) this.unit = unit; // update() recarga
    else this.#load();
  }

  #spaceTimer = 0;

  // El espacio se va recién cuando la barra terminó de bajar: si se quitaba al
  // marcarla hidden, con la página al final el contenido saltaba para arriba
  // mientras la barra todavía salía (motion/duration/panel).
  #syncSpace() {
    const bar = this.shadowRoot.querySelector('.compare');
    const box = bar.shadowRoot?.querySelector('.bar');
    const space = this.shadowRoot.querySelector('.compare-space');
    const height = !bar.hidden && box && !box.hidden ? box.getBoundingClientRect().height : 0;
    clearTimeout(this.#spaceTimer);
    if (height || !space.style.height || !box) {
      space.style.height = height ? `${height}px` : '';
      return;
    }
    const leaving = Number.parseFloat(getComputedStyle(box).transitionDuration) * 1000 || 0;
    this.#spaceTimer = setTimeout(() => {
      space.style.height = '';
    }, leaving);
  }

  #onScroll = () => this.#syncScrollState();

  // Dirección del scroll con umbral: cambia recién después de recorrer
  // space/gap/sm en sentido contrario, así el temblor del trackpad no hace
  // aparecer y desaparecer el navbar. Solo se toca el DOM cuando cambia algo.
  #syncScrollState() {
    const y = Math.max(0, window.scrollY);
    const delta = y - this.#anchorY;
    if (this.#direction === 'down' ? delta >= 0 : delta <= 0) this.#anchorY = y;
    else if (Math.abs(delta) >= this.#scrollThreshold()) {
      this.#direction = delta > 0 ? 'down' : 'up';
      this.#anchorY = y;
    }
    const scrolling = y > 0;
    const state = scrolling ? this.#direction : 'top';
    if (state === this.#scrollState) return;
    this.#scrollState = state;
    const root = this.shadowRoot;
    const toolbar = root?.querySelector('.toolbar');
    if (toolbar) toolbar.state = scrolling ? 'scroll' : 'default';
    document.querySelector('arq-navbar')?.toggleAttribute('data-arq-catalog-hidden', state === 'down');
    const navVisible = state === 'up';
    for (const element of [toolbar, root?.querySelector('.nav')]) {
      if (element) this.#followNavbar(element, navVisible);
    }
  }

  // space/gap/sm en px (el token está en rem)
  #scrollThreshold() {
    if (this.#threshold) return this.#threshold;
    const value = getComputedStyle(this).getPropertyValue('--arq-space-gap-sm').trim();
    const rem = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    const amount = Number.parseFloat(value) || 0.5;
    this.#threshold = value.endsWith('px') ? amount : amount * rem;
    return this.#threshold;
  }

  // La barra de herramientas y el sidebar quedan pegados debajo del navbar
  // (.nav-visible cambia su top). El top cambia de golpe; para que acompañen
  // al navbar, que entra y sale con transform, se anima la diferencia con
  // transform (misma duración y curva que el navbar: motion/duration/base +
  // motion/easing/standard). Si no están pegados, la diferencia es 0 y no hay
  // animación. Una animación en curso se reemplaza desde donde está.
  #followNavbar(element, navVisible) {
    if (element.classList.contains('nav-visible') === navVisible) return;
    const before = element.getBoundingClientRect().top;
    element.getAnimations().forEach((animation) => animation.cancel());
    element.classList.toggle('nav-visible', navVisible);
    const offset = before - element.getBoundingClientRect().top;
    const styles = getComputedStyle(this);
    const duration = Number.parseFloat(styles.getPropertyValue('--arq-motion-duration-base')) || 0;
    if (!offset || !duration || !LISTING_DESKTOP.matches) return;
    element.animate(
      [{ transform: `translateY(${offset}px)` }, { transform: 'none' }],
      { duration, easing: styles.getPropertyValue('--arq-motion-easing-standard').trim() || 'ease-out' },
    );
  }

  update(changed) {
    if (!changed.has('unit')) return;
    const root = this.shadowRoot;
    root.querySelector('.toolbar').unit = this.unit;
    root.querySelector('arq-filter-panel').unit = this.unit;
    root.querySelector('arq-filter-panel').showCategories = this.unit === 'productos';
    if (this.#query && this.unit === 'productos') this.#titleFromQuery();
    else this.#syncToolbarName();
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
    this.#status(result.count ? '' : this.#query && this.unit === 'productos' ? `No hay productos para «${this.#query}».` : text.empty);
  }

  #list(filters) {
    return this.unit === 'colecciones' ? listCollections({ filters }) : listProducts({ ...this.#category, query: this.#query, filters });
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

  // Vacía y vuelve a escribir el aviso, así se anuncia aunque se repita.
  #notify(message) {
    const notice = this.shadowRoot.querySelector('.notice');
    notice.textContent = '';
    requestAnimationFrame(() => {
      notice.textContent = message;
    });
  }

  #render(cards) {
    const compare = this.unit === 'productos';
    this.#cards = new Map(cards.map((data, index) => {
      const card = this.#card(data, compare);
      // Escalón de la entrada (catalog-listing.css): solo las 8 primeras
      card.style.setProperty('--enter-index', String(Math.min(index, ENTER_STAGGERED)));
      return [card, data];
    }));
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
    // Acabados en los dos listados (Figma 1153:5679 y 1160:6116); la meta,
    // solo en Colecciones (aplicaciones de la colección).
    for (const name of data.finishes ?? []) {
      const swatch = document.createElement('arq-swatch');
      swatch.slot = 'finishes';
      swatch.textContent = name;
      card.append(swatch);
    }
    if (!compare && data.meta) {
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
    let current = null;
    for (const item of nav.querySelectorAll('arq-catalog-nav-item')) {
      const href = item.getAttribute('href');
      item.selected = Boolean(href) && samePage(href, here);
      if (item.selected) current ??= item;
    }
    // La categoría actual la guarda el grupo (catalog-nav-group selected)
    const currentGroup = current?.closest('arq-catalog-nav-group');
    for (const group of nav.querySelectorAll(':scope > arq-catalog-nav-group')) group.selected = group === currentGroup;
    this.#titleFromNav(current);
    this.#syncPanelCategories(nav);
    const header = document.querySelector('arq-page-header');
    if (header) header.showDescription = this.unit !== 'colecciones';
  }

  // El panel Mobile reutiliza los grupos y enlaces del HTML del sidebar.
  // El original sigue en su slot para Desktop y Tablet.
  #syncPanelCategories(nav) {
    const panel = this.shadowRoot.querySelector('arq-filter-panel');
    const categories = panel.querySelector('[slot="categories"]') ?? document.createElement('nav');
    categories.slot = 'categories';
    categories.setAttribute('aria-label', 'Categorías de productos');
    const groups = [...nav.querySelectorAll(':scope > arq-catalog-nav-group')].map((group) => {
      const copy = group.cloneNode(true);
      copy.open = group.selected;
      return copy;
    });
    categories.replaceChildren(...groups);
    if (!categories.isConnected) panel.append(categories);
  }

  // Con ?q=, el <h1> del page-header nombra la búsqueda.
  // TODO (diseño): no hay pantalla de resultados de búsqueda en Final; título y
  // vacío elegidos en código.
  #titleFromQuery() {
    const title = document.querySelector('arq-page-header > [slot="title"]');
    if (title) this.#htmlTitle ??= title.textContent;
    if (title) title.textContent = `Resultados para «${this.#query}»`;
    // El título de búsqueda va en role/display (no display-lg).
    title?.parentElement.setAttribute('search-title', '');
    this.#syncBreadcrumb([{ label: 'Productos', href: location.pathname }], true);
    this.#syncToolbarName();
  }

  // El <h1> del page-header pasa a ser el grupo del ítem actual (Interior,
  // Exterior, Lámparas y artefactos, Colecciones). Sin ítem actual queda el
  // del HTML (Productos).
  #titleFromNav(item) {
    const group = item?.closest('arq-catalog-nav-group');
    const firstItem = group?.querySelector(':scope > arq-catalog-nav-item');
    // El primer link de cada grupo es su vista completa (Todo interior,
    // Todo exterior, Lámparas y artefactos o Todas las colecciones). Las
    // subcategorías sí pasan a ser el título de la página.
    const groupLabel = group?.querySelector('[slot="label"]')?.textContent.trim();
    const sub = item && item !== firstItem;
    const label = sub ? item.textContent.trim() : groupLabel;
    const title = document.querySelector('arq-page-header > [slot="title"]');
    if (!label && this.#query && this.unit === 'productos') return this.#titleFromQuery();
    if (title) {
      this.#htmlTitle ??= title.textContent;
      title.textContent = label || this.#htmlTitle;
      title.parentElement.removeAttribute('search-title');
    }
    // Breadcrumb (Levels 3 · 2): Inicio / Productos sin categoría; Inicio /
    // Productos / grupo en su vista completa; Inicio / grupo / subcategoría.
    if (!label) this.#syncBreadcrumb([]);
    else if (sub) this.#syncBreadcrumb([{ label: groupLabel, href: firstItem.getAttribute('href') }, { label }]);
    else this.#syncBreadcrumb([{ label: 'Productos', href: location.pathname }, { label }]);
    this.#syncToolbarName();
  }

  // Reemplaza los niveles del breadcrumb del page-header que siguen al
  // primero (Inicio, del HTML). Sin niveles, vuelve al del HTML (Productos).
  // trail: el último nivel sigue siendo link y lleva separador (búsqueda:
  // «Inicio / Productos /», sin nivel actual).
  #syncBreadcrumb(crumbs, trail = false) {
    const breadcrumb = document.querySelector('arq-page-header > arq-breadcrumb');
    if (!breadcrumb) return;
    this.#htmlCrumbs ??= [...breadcrumb.children].slice(1);
    const [home] = breadcrumb.children;
    const items = crumbs.length
      ? crumbs.map(({ label, href }, index) => {
        const item = document.createElement('arq-breadcrumb-item');
        const last = index === crumbs.length - 1 && !trail;
        if (last) item.current = true;
        else {
          item.href = href;
          item.showSeparator = true;
        }
        item.textContent = label;
        return item;
      })
      : this.#htmlCrumbs;
    breadcrumb.replaceChildren(...[home, ...items].filter(Boolean));
  }

  // catalog-toolbar State=Scroll muestra el nombre de la página: el mismo
  // texto que el <h1> del page-header.
  #syncToolbarName() {
    const title = document.querySelector('arq-page-header > [slot="title"]');
    const toolbar = this.shadowRoot?.querySelector('.toolbar');
    if (toolbar) toolbar.name = title?.textContent.trim() || null;
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
