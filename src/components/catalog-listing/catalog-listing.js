// catalog-listing · contenedor de página (Final: Productos 1153:5679 · 1155:5837;
// filtros 1199:20568)
//
// Listado de Productos: navegación
// de categorías, catalog-toolbar, grilla de product-card, filter-panel y
// compare-bar. Pide los datos a src/data/catalog.js, como el navbar
// (decisiones.md, 2026-10-02 · Listados y · Productos).
//
//   <arq-catalog-listing>
//     <arq-catalog-nav slot="nav" label="Categorías">…links de categoría…</arq-catalog-nav>
//     <h2 slot="filter-title">Filtrar</h2>
//   </arq-catalog-listing>
//
// - Categoría: ?environment= (también las rutas viejas /arq/interior…),
//   ?environment=, ?application=, ?product_type=, ?collection= y ?family=.
//   Se marca el catalog-nav-item cuyo href coincide con la página, y el <h1> del
//   page-header pasa a ser el nombre de su grupo (Interior, Exterior…).
// - Búsqueda: ?q= filtra el listado con el criterio del buscador del navbar
//   ("Ver todos los resultados" y Enter llegan acá; decisiones.md,
//   2026-10-05 · Búsqueda en Productos). Se combina con categoría y filtros.
// - Filtros técnicos: las filas del filter-panel salen de los datos de la
//   categoría. "Ver N" aplica (arq:apply) y la grilla se vuelve a armar.
// - Comparar: "Comparar" de cada card suma o saca el producto
//   de la compare-bar (hasta 3; la selección se guarda en arq:compare). El
//   lugar vacío (+) de la barra abre compare-picker para agregar desde ahí.
// - Iluminar: lo resuelve catalog-toolbar (data-arq-theme en <html>). En la
//   colección Daö (?collection=dao) no existe: sin toggle y la página en Light.
// - No hay vista «Todas las colecciones» (se sacó el 2026-10-23: docs/archivo/
//   todas-las-colecciones.md). Una colección se ve desde el catalog-nav
//   (?collection=) y desde el mega-menu.

import { ArqElement } from '../../base/arq-element.js';
import { listProducts, listCompareCandidates, getCatalogNav, categoryFromPath } from '../../data/catalog.js';
import { subcategoryDescription, collectionDescription } from '../../data/category-descriptions.js';
import { handOffTheme, setBrowserBar, withoutThemeTransition } from '../../base/theme.js';
import '../catalog-toolbar/catalog-toolbar.js';
import '../carousel-controls/carousel-controls.js';
import '../filter-panel/filter-panel.js';
import '../filter-row/filter-row.js';
import '../checkbox/checkbox.js';
import '../compare-bar/compare-bar.js';
import '../compare-picker/compare-picker.js';
import '../grid/grid.js';
import { appendFinishes, appendSpecs } from '../product-card/product-card.js';
import '../swatch/swatch.js';
import { covered, reveal, revealCss } from '../../base/reveal.js';
import { toMs } from '../../base/motion.js';
import css from './catalog-listing.css?inline';

// Nivel «Colecciones» del breadcrumb: abre el mega-menu en esa pestaña (no hay vista de todas)
const COLLECTIONS_CRUMB = { label: 'Colecciones', href: '/arq/productos', menu: 'colecciones' };
const CATEGORY_PARAMS ={ environment: 'environment', application: 'application', product_type: 'productType', collection: 'collection', family: 'family' };
const LISTING_DESKTOP = matchMedia('(min-width: 1024px)');
const LISTING_WIDE = matchMedia('(min-width: 1920px)');

// Colección (id, sin tildes) sin Iluminar, como la ficha de Daö (decisiones.md, 2026-10-23)
const NO_ILLUMINATION_COLLECTION = 'dao';

const TEXT = { loading: 'Cargando productos…', empty: 'No hay productos con estos filtros.', error: 'No se pudieron cargar los productos. Probá de nuevo en unos minutos.' };

class ArqCatalogListing extends ArqElement {
  static tag = 'arq-catalog-listing';
  static styles = revealCss + css;
  static template =
    `<div class="layout">` +
    // nav-content: el ResizeObserver de carousel-controls ve el alto del
    // contenido cuando se abre o se cierra un grupo (un slot no tiene caja)
    `<div class="nav"><div class="nav-scroll" id="nav-scroll"><div class="nav-content"><slot name="nav"></slot></div></div>` +
    `<arq-carousel-controls class="nav-bar" for="nav-scroll" buttons="none" progress="scroll" scrub orientation="vertical" label-prev="Subir" label-next="Bajar"></arq-carousel-controls></div>` +
    `<div class="content">` +
    `<arq-catalog-toolbar class="toolbar" for="filters" show-iluminar></arq-catalog-toolbar>` +
    `<p class="status role-body" role="status"></p>` +
    `<arq-grid class="grid"></arq-grid>` +
    `</div>` +
    `</div>` +
    `<arq-filter-panel id="filters" show-categories><slot name="filter-title" slot="title"></slot></arq-filter-panel>` +
    `<arq-compare-bar class="compare"></arq-compare-bar>` +
    `<arq-compare-picker class="picker"></arq-compare-picker>` +
    // Aviso para lectores de pantalla (límite de Comparar). Está siempre en la
    // página y vacío; solo cambia su texto (DESIGN.md §9).
    `<p class="notice visually-hidden" aria-live="polite"></p>`;

  #category = {};
  #query = '';
  #filters = {};
  #cards = new Map(); // product-card → datos de la card
  #reveal = null; // entrada al hacer scroll de las cards nuevas (reveal.js)
  #request = 0;
  #countRequest = 0; // la última cuenta de «Ver N» gana (las respuestas pueden llegar desordenadas)
  #htmlCrumbs = null; // niveles del breadcrumb del HTML después de Inicio
  #htmlTitle = null; // <h1> del HTML (Productos), para volver a él sin categoría
  #htmlDescription = null; // bajada del HTML, ídem

  setup() {
    const root = this.shadowRoot;
    this.#category = categoryFromUrl();
    this.#query = new URLSearchParams(location.search).get('q')?.trim() ?? '';
    this.#syncIlluminate();
    root.querySelector('slot[name="nav"]').addEventListener('slotchange', () => this.#markNav());
    // Si cambia el href de un link del nav (la demo reescribe los que llegan
    // de Typesense), se vuelve a marcar el actual. selected no es href: no
    // se dispara a sí mismo.
    new MutationObserver(() => this.#markNav()).observe(this, { subtree: true, attributes: true, attributeFilter: ['href'] });
    this.#fillNav();
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

    // Desde 1024 px el toolbar queda pegado debajo del navbar: mientras está
    // pegado no lleva línea superior (se juntaba con la del navbar). Se observa
    // con el margen de su top sticky: pegado, asoma por encima de ese borde.
    const toolbar = root.querySelector('.toolbar');
    let stuckObserver = null;
    const observeStuck = () => {
      stuckObserver?.disconnect();
      toolbar.stuck = false;
      if (!LISTING_DESKTOP.matches) return;
      const top = Number.parseFloat(getComputedStyle(toolbar).top) || 0;
      stuckObserver = new IntersectionObserver(
        ([entry]) => {
          toolbar.stuck = entry.intersectionRatio < 1 && entry.boundingClientRect.top <= top + 1;
        },
        { rootMargin: `-${top + 1}px 0px 0px 0px`, threshold: 1 },
      );
      stuckObserver.observe(toolbar);
    };
    LISTING_DESKTOP.addEventListener('change', observeStuck);
    observeStuck();

    // Sidebar (desde 1024 px): mide como mucho lo que se ve de pantalla desde
    // su borde superior (pegado, desde el navbar; antes, desde donde esté).
    // Solo si lo que tiene no entra, se desplaza adentro (nav-scroll) y
    // aparece la barra (carousel-controls vertical).
    // Se compara el alto del nav del slot, al que no le suman los transform
    // del pliegue de catalog-nav-group: así la barra no asoma mientras se
    // cierra un grupo.
    const side = root.querySelector('.nav');
    const scroller = root.querySelector('.nav-scroll');
    let fitFrame = 0;
    const fitNav = () => {
      fitFrame = 0;
      const nav = root.querySelector('slot[name="nav"]').assignedElements()[0];
      // nav-scroll se asoma space/padding/xs por arriba y por abajo (lugar
      // para el anillo de foco): se mide desde su borde, no desde el de .nav.
      const inset = Number.parseFloat(getComputedStyle(scroller).paddingTop) || 0;
      const top = Math.max(side.getBoundingClientRect().top, Number.parseFloat(getComputedStyle(side).top) || 0) - inset;
      const room = Math.max(window.innerHeight - top, 0);
      const content = (nav?.offsetHeight ?? 0) + inset * 2;
      side.style.setProperty('--nav-max', `${room}px`);
      side.classList.toggle('scrolls', LISTING_DESKTOP.matches && content > room);
    };
    const queueFit = () => {
      fitFrame ||= requestAnimationFrame(fitNav);
    };
    window.addEventListener('scroll', queueFit, { passive: true });
    window.addEventListener('resize', queueFit);
    // Cambios de alto: abrir o cerrar un grupo (nav del slot) y lo que corre
    // el sidebar de lugar (título, bajada, grilla: el alto de la página).
    const navResize = new ResizeObserver(queueFit);
    navResize.observe(document.documentElement);
    root.querySelector('slot[name="nav"]').addEventListener('slotchange', (event) => {
      const nav = event.target.assignedElements()[0];
      if (nav) navResize.observe(nav);
      queueFit();
    });
    queueFit();

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
    // Otro acabado en la card: es otro SKU. «Comparar» y la compare-bar usan el
    // SKU y la foto del acabado que se ve.
    grid.addEventListener('arq:finish', (event) => {
      const card = event.target;
      const data = this.#cards.get(card);
      if (!data) return;
      Object.assign(data, { sku: event.detail.sku ?? data.sku, href: event.detail.href, image: event.detail.image });
      card.compared = bar.has(data.sku);
    });
    bar.addEventListener('arq:compare-change', () => {
      this.#syncCompared();
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
  }

  #onNavClick = (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const item = event.target.closest?.('arq-catalog-nav-item, arq-breadcrumb-item:not([current])');
    // Un nivel con data-arq-menu abre el menú del navbar (arq-navbar): no cambia el listado
    if (item?.hasAttribute('data-arq-menu')) return;
    const href = item?.getAttribute('href') ?? item?.href;
    if (!href) return;
    const url = new URL(href, location.href);
    // Otra página u otro origen: navegación normal. Las tres categorías
    // (/arq/interior, /exterior, /lamparas-y-artefactos) son este listado.
    const sameListing = listingPath(url.pathname) && listingPath(location.pathname);
    if (!sameListing && (url.origin !== location.origin || url.pathname.replace(/\/$/, '') !== location.pathname.replace(/\/$/, ''))) return;
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
    picker.href = '/arq/productos'; // «Ver todos los productos»: el listado, sin categoría
    try {
      const { items } = await listCompareCandidates({ ...picker.search, selected });
      if (request === this.#pickerRequest) picker.items = items;
    } catch (error) {
      console.error('[arq] compare-picker: no se pudo cargar el catálogo', error);
      if (request === this.#pickerRequest) picker.showError();
    }
  }

  // Relee la URL (categoría y búsqueda) y recarga solo el listado. El
  // scroll queda donde está la persona.
  #goTo() {
    const params = new URLSearchParams(location.search);
    this.#category = categoryFromUrl();
    this.#query = params.get('q')?.trim() ?? '';
    this.#filters = {};
    this.shadowRoot.querySelector('arq-filter-panel').clear();
    this.#syncIlluminate();
    this.#markNav();
    this.#load();
  }

  // La colección Daö no tiene Iluminar: sin toggle, y si se llegó iluminado
  // (otra categoría) la página vuelve a Light. Llega como ?collection= o como
  // ?family= (los links del menú Colecciones y del breadcrumb de la ficha).
  #syncIlluminate() {
    const plain = (text) => (text ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toLowerCase();
    const { collection, family } = this.#category;
    const off = [collection, family].some((name) => plain(name) === NO_ILLUMINATION_COLLECTION);
    this.shadowRoot.querySelector('.toolbar').showIluminar = !off;
    const html = document.documentElement;
    if (off && html.getAttribute('data-arq-theme') === 'dark') {
      withoutThemeTransition(() => {
        html.removeAttribute('data-arq-theme');
        setBrowserBar(false);
      });
    }
  }

  // Una sola vez, al conectarse (el componente no tiene props): carga el listado.
  update() {
    if (this.#query) this.#titleFromQuery();
    this.#load({ rows: true });
  }

  async #load({ rows = false } = {}) {
    const request = ++this.#request;
    const text = TEXT;
    this.setAttribute('aria-busy', 'true');
    // Primera carga (todavía sin cards): cards de carga en lugar de la grilla.
    // Después, otra categoría o filtros atenúan la grilla que sigue a la vista.
    if (!this.#cards.size) this.#renderSkeleton();
    if (rows) this.#status(text.loading, { quiet: true });
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
    this.#status(result.count ? '' : this.#query ? `No encontramos productos para «${this.#query}».` : text.empty);
  }

  #list(filters) {
    return listProducts({ ...this.#category, query: this.#query, filters });
  }

  // "Ver N productos" mientras se marcan filtros (el listado no cambia). Las
  // opciones que darían 0 con lo marcado se ocultan (decisiones.md,
  // 2026-10-22 · Filtros que no aplican).
  async #count(filters) {
    const panel = this.shadowRoot.querySelector('arq-filter-panel');
    const request = ++this.#countRequest;
    let result = null;
    try {
      result = await this.#list(filters);
    } catch {
      // sin resultado: el botón queda sin número y las opciones, como estaban
    }
    if (request !== this.#countRequest) return;
    panel.count = result ? result.count : null;
    if (!result?.available) return;
    // Cantidad al lado de cada opción: las cards que daría con lo demás marcado
    for (const option of panel.options) {
      const count = result.available[option.getAttribute('name')]?.[option.value];
      option.count = count ?? null;
    }
    panel.showAvailable((option) => Number.isFinite(option.count));
  }

  // quiet: solo para lectores de pantalla («Cargando productos…»: lo que se ve
  // son las cards de carga)
  #status(message, { quiet = false } = {}) {
    const status = this.shadowRoot.querySelector('.status');
    status.textContent = message;
    status.hidden = !message;
    status.classList.toggle('visually-hidden', quiet);
  }

  // Cards de carga (product-card loading): dos filas de la grilla, así llenan
  // la pantalla sin sumar scroll de más. Entran como las cards del Home,
  // después de esperar un fundido corto (catalog-listing.css): con el
  // catálogo en caché llegan las cards antes y no se ven.
  #renderSkeleton() {
    const grid = this.shadowRoot.querySelector('.grid');
    if (grid.querySelector('[loading]')) return;
    const tracks = getComputedStyle(grid.shadowRoot.querySelector('.grid')).gridTemplateColumns.split(' ').filter(Boolean);
    const cards = Array.from({ length: Math.max(tracks.length, 1) * 2 }, (_, index) => {
      const card = document.createElement('arq-product-card');
      card.loading = true;
      card.style.setProperty('--reveal-index', String(Math.min(index, 5))); // escalón de la entrada (catalog-listing.css)
      card.showCompare = true;
      return card;
    });
    grid.replaceChildren(...cards);
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
    // Si las cards de carga ya se ven, las cards ocupan su lugar sin la
    // entrada (con el fundido desde 0 el gris bajaba a blanco y volvía): lo
    // que aparece es la foto (fundido de product-card). Si todavía no se
    // veían (respuesta rápida, o el preloader las tapaba), entrada normal.
    // Las cards que ya estaban (mismos datos) se reusan: al filtrar quedan
    // quietas y conservan el acabado elegido; solo entran las nuevas. Una
    // card del mismo producto con otros datos (otros acabados) se rehace en
    // su lugar, sin entrada.
    const skeleton = this.shadowRoot.querySelector('.grid > [loading]');
    const settled = !covered() && Boolean(skeleton) && Number.parseFloat(getComputedStyle(skeleton).opacity) > 0;
    const previous = new Map([...this.#cards].map(([card, data]) => [data.href, { card, json: JSON.stringify(data) }]));
    const entering = [];
    this.#cards = new Map(cards.map((data) => {
      const kept = previous.get(data.href);
      let card = kept?.json === JSON.stringify(data) ? kept.card : null;
      if (card) {
        if (card.classList.contains('reveal')) entering.push(card); // todavía no había entrado en pantalla
      } else {
        card = this.#card(data);
        card.classList.toggle('settled', settled || Boolean(kept));
        if (!settled && !kept) entering.push(card);
      }
      return [card, data];
    }));
    this.#reveal?.disconnect();
    this.shadowRoot.querySelector('.grid').replaceChildren(...this.#cards.keys());
    this.#reveal = reveal(entering);
    this.#syncCompared();
  }

  #card(data) {
    const card = document.createElement('arq-product-card');
    card.href = data.href;
    card.family = data.family;
    card.image = data.image;
    card.imageHover = data.imageHover;
    card.imageLit = data.imageLit;
    card.imageHoverLit = data.imageHoverLit;
    card.showCompare = true;
    // <h2>: en el listado las cards van directo debajo del <h1> del page-header
    // (sin section-header en el medio), así no se saltea un nivel.
    const title = document.createElement('h2');
    title.slot = 'name';
    title.textContent = data.name;
    card.append(title);
    appendSpecs(card, data.specs);
    appendFinishes(card, data.finishes);
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

  // Los grupos del sidebar (Interior, Exterior, Lámparas y artefactos,
  // Colecciones) y su "Todo…" están fijos en el HTML; los links de adentro
  // salen de los datos: cada catalog-nav-group con data-arq-nav="<grupo>"
  // recibe los de getCatalogNav(). Sin datos, queda solo lo del HTML.
  async #fillNav() {
    const nav = this.shadowRoot.querySelector('slot[name="nav"]').assignedElements()[0];
    const groups = nav?.querySelectorAll('arq-catalog-nav-group[data-arq-nav]');
    if (!groups?.length) return;
    let links;
    try {
      links = await getCatalogNav();
    } catch (error) {
      console.error('[arq] catalog-listing: no se pudieron cargar las categorías', error);
      return;
    }
    for (const group of groups) {
      group.querySelectorAll(':scope > [data-arq-nav-item]').forEach((item) => item.remove());
      for (const link of links[group.dataset.arqNav] ?? []) {
        const item = document.createElement('arq-catalog-nav-item');
        item.setAttribute('href', link.href);
        item.setAttribute('data-arq-nav-item', '');
        item.textContent = link.label;
        group.append(item);
      }
    }
    this.#markNav();
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
    if (header) header.showDescription = true;
  }

  // El panel en Mobile y Tablet reutiliza los grupos y enlaces del HTML del
  // sidebar. El original sigue en su slot para Desktop.
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
    this.#syncBreadcrumb([{ label: 'Productos', href: '/arq/productos' }], true);
  }

  // El <h1> del page-header pasa a ser el grupo del ítem actual (Interior,
  // Exterior, Lámparas y artefactos, Colecciones). Sin ítem actual queda el
  // del HTML (Productos).
  #titleFromNav(item) {
    // Una familia es una colección: Inicio / Productos / Colecciones / Kanu.
    // Vale aunque el ítem del sidebar todavía no coincida con la URL.
    if (this.#category.family && !this.#query) {
      const fromNav = item?.closest('[data-arq-nav="colecciones"]') ? item.textContent.trim() : '';
      const label = fromNav || this.#category.family;
      const title = document.querySelector('arq-page-header > [slot="title"]');
      if (title) {
        this.#htmlTitle ??= title.textContent;
        this.#setTitle(title, label);
        title.parentElement.removeAttribute('search-title');
      }
      const description = document.querySelector('arq-page-header > [slot="description"]');
      if (description) {
        this.#htmlDescription ??= description.textContent;
        this.#setDescription(description, collectionDescription(label) || this.#htmlDescription);
      }
      this.#syncBreadcrumb([
        { label: 'Productos', href: '/arq/productos' },
        COLLECTIONS_CRUMB,
        { label },
      ]);
      return;
    }
    const group = item?.closest('arq-catalog-nav-group');
    // El primer link de cada grupo es su vista completa (Todo interior,
    // Todo exterior o Lámparas y artefactos). Las subcategorías sí pasan a ser
    // el título de la página. Colecciones no tiene vista completa (se sacó
    // «Todas las colecciones»): todos sus ítems son colecciones y llevan su nombre.
    const firstItem = group?.dataset.arqNav === 'colecciones' ? null : group?.querySelector(':scope > arq-catalog-nav-item');
    const groupLabel = group?.querySelector('[slot="label"]')?.textContent.trim();
    const sub = item && item !== firstItem;
    const label = sub ? item.textContent.trim() : groupLabel;
    const title = document.querySelector('arq-page-header > [slot="title"]');
    // La bajada es la del grupo (data-arq-description), también en sus
    // subcategorías. TODO (datos): provisoria en el HTML hasta que venga de
    // Typesense.
    const description = document.querySelector('arq-page-header > [slot="description"]');
    if (description) {
      this.#htmlDescription ??= description.textContent;
      const own = sub ? (group.dataset.arqNav === 'colecciones' ? collectionDescription(label) : subcategoryDescription(group.dataset.arqNav, label)) : '';
      this.#setDescription(description, own || (label && group.dataset.arqDescription) || this.#htmlDescription);
    }
    if (!label && this.#query) return this.#titleFromQuery();
    if (title) {
      this.#htmlTitle ??= title.textContent;
      this.#setTitle(title, label || this.#htmlTitle);
      title.parentElement.removeAttribute('search-title');
    }
    // Breadcrumb: Inicio / Productos sin categoría; Inicio / Productos / grupo
    // en su vista completa; Inicio / Productos / grupo / subcategoría.
    const products = { label: 'Productos', href: '/arq/productos' };
    if (!label) this.#syncBreadcrumb([]);
    else if (sub) {
      // Colecciones no tiene página propia: su nivel abre el mega-menu en esa pestaña.
      const groupCrumb = firstItem ? { label: groupLabel, href: firstItem.getAttribute('href') } : COLLECTIONS_CRUMB;
      this.#syncBreadcrumb([products, groupCrumb, { label }]);
    }
    else this.#syncBreadcrumb([products, { label }]);
  }

  // Título y bajada: si ya había uno puesto y cambia el texto, el viejo se
  // desvanece (motion/duration/fade) y entra el nuevo. El título, con la misma
  // entrada que las cards (reveal.css: sube space/gap/2xl y aparece con
  // easing/standard), algo más rápida: motion/duration/slow × 1,5 (con × 2,
  // como las cards, se sentía lenta); la bajada solo funde, en
  // motion/duration/slow (con × 2 se sentía lento). La bajada, motion/duration/fast después
  // del título. Las subcategorías que comparten la bajada del grupo no la
  // animan. Va con la Web Animations API porque los dos están en el DOM de la
  // página (slot). Sin animación con prefers-reduced-motion (2026-10-29).
  #titleShown = false;
  #setTitle(title, text) {
    const animate = this.#titleShown;
    this.#titleShown = true;
    this.#replaceText(title, text, animate, { rise: true });
  }

  #descriptionShown = false;
  #setDescription(description, text) {
    const animate = this.#descriptionShown;
    this.#descriptionShown = true;
    this.#replaceText(description, text, animate, { delay: 'motion-duration-fast' });
  }

  #pendingText = new WeakMap(); // texto que espera a que termine de irse el anterior

  #replaceText(element, text, animate, { rise = false, delay = null } = {}) {
    const current = this.#pendingText.get(element) ?? element.textContent;
    if (current === text) return;
    for (const animation of element.getAnimations()) animation.cancel();
    if (!animate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.#pendingText.delete(element);
      element.textContent = text;
      return;
    }
    const style = getComputedStyle(document.documentElement);
    const token = (name) => style.getPropertyValue(`--arq-${name}`).trim();
    this.#pendingText.set(element, text);
    const leave = element.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: toMs(token('motion-duration-fade')),
      easing: token('motion-easing-standard'),
      delay: delay ? toMs(token(delay)) : 0,
      fill: 'forwards',
    });
    leave.finished.then(() => {
      if (this.#pendingText.get(element) !== text) return; // llegó otro texto mientras se iba
      this.#pendingText.delete(element);
      element.textContent = text;
      leave.cancel();
      if (rise) {
        element.animate([{ opacity: 0, transform: `translateY(${token('space-gap-2xl')})` }, { opacity: 1, transform: 'none' }], {
          duration: toMs(token('motion-duration-slow')) * 1.5,
          easing: token('motion-easing-standard'),
          fill: 'backwards',
        });
        return;
      }
      // Curva pareja: con easing/standard el texto llegaba casi entero en el
      // primer tercio y se sentía rápido. TODO (token): no hay una curva de
      // fundido general; se usa la del fundido de fotos de Iluminar.
      element.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: toMs(token('motion-duration-slow')),
        easing: token('motion-easing-illumination-image'),
        fill: 'backwards',
      });
    }, () => {}); // cancelada: otro cambio ya tomó su lugar
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
      ? crumbs.map(({ label, href, menu }, index) => {
        const item = document.createElement('arq-breadcrumb-item');
        const last = index === crumbs.length - 1 && !trail;
        if (last) item.current = true;
        else {
          item.href = href;
          if (menu) item.dataset.arqMenu = menu;
          item.showSeparator = true;
        }
        item.textContent = label;
        return item;
      })
      : this.#htmlCrumbs;
    breadcrumb.replaceChildren(...[home, ...items].filter(Boolean));
  }
}

function categoryFromUrl() {
  const params = new URLSearchParams(location.search);
  const category = {};
  const fromPath = categoryFromPath(location.pathname);
  if (fromPath) category.environment = fromPath;
  for (const [param, key] of Object.entries(CATEGORY_PARAMS)) {
    const value = params.get(param);
    if (value) category[key] = value;
  }
  return category;
}

function listingPath(pathname) {
  const path = decodeURIComponent(pathname).replace(/\/$/, '');
  return path === '/arq/productos' || categoryFromPath(path) !== null;
}

function samePage(href, here) {
  const url = new URL(href, location.href);
  const sorted = (search) => [...new URLSearchParams(search)].sort().join('&');
  const current = new URL(here, location.href);
  return url.pathname.replace(/\/$/, '') === current.pathname.replace(/\/$/, '') && sorted(url.search) === sorted(current.search);
}

ArqCatalogListing.define();

export { ArqCatalogListing };
