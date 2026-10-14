// navbar · Figma 753:2907 · ficha doc/navbar (1442:3513)
//
// Barra de navegación de Macroled Arq, primer elemento de todas las páginas.
//
//   <arq-navbar theme="transparent">
//     <arq-nav-link slot="links" has-dropdown>Productos</arq-nav-link>
//     <arq-nav-link slot="links" href="/arq/descargas">Descargas</arq-nav-link>
//     <arq-nav-link slot="links" href="/arq/contacto" current>Contacto</arq-nav-link>
//   </arq-navbar>
//
// - Los links llegan por slot (indexables). El que tiene has-dropdown abre
//   Productos: en Desktop el mega-menu debajo de la barra; en Mobile el submenú
//   de Productos dentro del menú.
// - Mode no es prop: es el estado de la barra (Default · Search · Menu ·
//   Products · Colecciones · Interior · Exterior · Lámparas y artefactos), que
//   cambia con las acciones del usuario. Se refleja en el atributo mode (solo
//   lectura) para la demo y los estilos de la página. En Mobile el menú baja
//   por niveles: Menu → Products → un submenú (Interior, Exterior, Lámparas y
//   artefactos o Colecciones); "volver" y Esc suben un nivel.
// - Theme: default · transparent. Transparent va sobre la foto del hero:
//   fondo color/overlay/translucent con blur/backdrop, textos e íconos en
//   inverso (nav-link Theme=Inverse). Sigue transparente mientras la barra
//   está sobre el hero y pasa a Default al dejarlo atrás (sin hero, al hacer
//   scroll); también con el menú mobile o el mega-menu abiertos. La búsqueda
//   desktop queda sobre la foto, con el campo en blanco (Default). La lupa y
//   el menú van en Dark local sobre la foto.
// - Posición: sticky arriba en Default; fixed en Transparent (se superpone al
//   hero). TODO (diseño): confirmar.
// - Datos: la navegación (getNavigation) y la búsqueda (searchProducts) salen
//   de src/data/catalog.js. Se piden al abrir Productos o al escribir, no al
//   cargar la página. Decisión 2026-10-02 · navbar.
// - Búsqueda (search, de código y de prueba: no existe en Figma): por defecto
//   es el top sheet (arq-search-sheet) en Desktop, Tablet y Mobile. La lupa lo
//   abre; con el campo vacío muestra productos recomendados y al escribir, los
//   productos y colecciones que coinciden. search="inline" vuelve a la versión
//   anterior (campo en la barra con search-dropdown, y search-screen en
//   Mobile).
// - Menú mobile y búsqueda: diálogos modales nativos (foco adentro, Esc
//   cierra, el foco vuelve al botón que los abrió). La página no tiene que
//   bloquear el scroll (el diálogo la contiene).
// - El sheet se abre con una transición en capas (ver search-sheet.js). Si la
//   barra estaba transparente sobre la foto, el sheet arranca igual
//   (atributo over-photo) y se vuelve sólido; si ya era blanca, también
//   parte de la misma barra.
// - Mega-menu: Esc o un clic afuera lo cierran y el foco vuelve a Productos.

import { ArqElement } from '../../base/arq-element.js';
import { icon } from '../../base/icons.js';
import { getNavigation, getRecommendedProducts, searchProducts, searchHref } from '../../data/catalog.js';
import '../logo/logo.js';
import '../icon-button/icon-button.js';
import '../button/button.js';
import '../nav-link/nav-link.js';
import '../mega-menu/mega-menu.js';
import '../mega-link/mega-link.js';
import '../search-field/search-field.js';
import '../search-dropdown/search-dropdown.js';
import '../search-result/search-result.js';
import '../search-see-all/search-see-all.js';
import '../search-screen/search-screen.js';
import '../search-sheet/search-sheet.js';
import css from './navbar.css?inline';

const MOBILE = matchMedia('(max-width: 767px)');
const esc = (text) => String(text ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
// Submenús de Productos en Mobile (Mode de Figma, en kebab-case): título del
// "volver" y orden de la lista de Productos.
const SUBMENUS = {
  interior: 'Interior',
  exterior: 'Exterior',
  'lamparas-y-artefactos': 'Lámparas y artefactos',
  colecciones: 'Colecciones',
};
const SEARCH_LIMIT = 5; // search-dropdown: "hasta 4 o 5" resultados
const DEBOUNCE = 150;

class ArqNavbar extends ArqElement {
  static tag = 'arq-navbar';
  static styles = css;
  static properties = {
    theme: { type: String, values: ['default', 'transparent'], default: 'default' }, // Theme
    mode: { type: String, values: ['default', 'search', 'menu', 'products', ...Object.keys(SUBMENUS)], default: 'default' }, // Mode (lo pone el componente)
    label: { type: String, default: 'Principal' }, // nombre del <nav>
    search: { type: String, values: ['inline', 'sheet'], default: 'sheet' }, // cómo se abre la búsqueda (solo de código)
  };
  static template =
    `<header class="navbar">` +
    `<nav class="bar">` +
    `<arq-logo class="logo"></arq-logo>` +
    `<div class="right">` +
    `<div class="links"><slot name="links"></slot></div>` +
    `<div class="search">` +
    `<arq-icon-button class="search-open" icon="search">Buscar</arq-icon-button>` +
    `<div class="search-box" hidden>` +
    `<arq-search-field class="search-field" show-close></arq-search-field>` +
    `<arq-search-dropdown class="search-dropdown" hidden></arq-search-dropdown>` +
    `</div>` +
    `</div>` +
    `<div class="actions">` +
    `<arq-icon-button class="search-open-mobile" icon="search">Buscar</arq-icon-button>` +
    `<arq-icon-button class="menu-open" icon="menu">Abrir menú</arq-icon-button>` +
    `</div>` +
    `</div>` +
    `</nav>` +
    `<arq-mega-menu class="mega" hidden></arq-mega-menu>` +
    `</header>` +
    `<dialog class="menu">` +
    `<div class="menu-bar">` +
    `<arq-logo class="menu-logo" size="small"></arq-logo>` +
    `<arq-icon-button class="menu-close" icon="close" background="subtle">Cerrar menú</arq-icon-button>` +
    `</div>` +
    `<div class="menu-main"></div>` +
    `<div class="menu-sub" hidden>` +
    `<button type="button" class="back role-body-medium">${icon('chevron-left')}<span class="back-label">Productos</span></button>` +
    `<div class="panel"></div>` +
    `</div>` +
    `</dialog>` +
    `<arq-search-screen class="search-screen"></arq-search-screen>` +
    `<arq-search-sheet class="search-sheet"></arq-search-sheet>`;

  #navigation = null;
  #loadingNavigation = null;
  #results = [];
  #active = -1;
  #timer = 0;
  #query = '';
  #recommended = null;

  /** Árbol de navegación. Si no se pasa, se pide a src/data al abrir Productos. */
  get navigation() {
    return this.#navigation;
  }

  set navigation(value) {
    this.#navigation = value;
    this.#renderNavigation();
  }

  setup() {
    const root = this.shadowRoot;
    this.#placeLinks();
    MOBILE.addEventListener('change', () => {
      this.#closeAll();
      this.#placeLinks();
    });

    // Productos (nav-link con has-dropdown)
    this.addEventListener('arq:toggle', (event) => {
      if (event.target.localName !== 'arq-nav-link') return;
      event.stopPropagation();
      if (MOBILE.matches) this.#setMode('products');
      else this.#toggleMega(event.detail.open);
    });

    // Búsqueda desktop (o el sheet, en todos los anchos). Al acercarse a la lupa
    // se piden los recomendados, para que el sheet ya los tenga al abrirse.
    for (const button of root.querySelectorAll('.search-open, .search-open-mobile')) {
      for (const type of ['pointerenter', 'focusin']) button.addEventListener(type, () => this.#loadRecommended(), { once: true });
    }
    const sheet = root.querySelector('.search-sheet');
    root.querySelector('.search-open').addEventListener('click', (event) => {
      this.#setMode('search');
      if (this.#sheetSearch) this.#openSheet(event.currentTarget);
    });
    sheet.addEventListener('arq:close', (event) => {
      event.stopPropagation();
      this.#setMode('default');
    });
    const field = root.querySelector('.search-field');
    field.addEventListener('arq:close', (event) => {
      event.stopPropagation();
      this.#setMode('default');
      root.querySelector('.search-open').focus();
    });
    root.querySelector('.search-box').addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        if (!root.querySelector('.search-dropdown').hidden) this.#showResults(false);
        else {
          this.#setMode('default');
          root.querySelector('.search-open').focus();
        }
      }
    });

    // Búsqueda mobile
    const screen = root.querySelector('.search-screen');
    root.querySelector('.search-open-mobile').addEventListener('click', (event) => {
      this.#setMode('search');
      if (this.#sheetSearch) this.#openSheet(event.currentTarget);
      else screen.show(event.currentTarget);
    });
    screen.addEventListener('arq:close', (event) => {
      event.stopPropagation();
      this.#setMode('default');
    });

    // Eventos de los dos campos (desktop y mobile)
    for (const target of [field, screen, sheet]) {
      target.addEventListener('arq:input', (event) => {
        event.stopPropagation();
        this.#search(event.detail.value);
      });
      target.addEventListener('arq:navigate', (event) => {
        event.stopPropagation();
        this.#move(event.detail.step);
      });
      target.addEventListener('arq:submit', (event) => {
        event.stopPropagation();
        this.#submit(event.detail.value);
      });
    }

    // Menú mobile
    const menu = root.querySelector('.menu');
    root.querySelector('.menu-open').addEventListener('click', () => this.#setMode('menu'));
    root.querySelector('.menu-close').addEventListener('click', () => this.#setMode('default'));
    menu.addEventListener('cancel', (event) => {
      event.preventDefault();
      this.#setMode(this.#inSubmenu(this.mode) ? this.#parentMode() : 'default');
    });
    root.querySelector('.back').addEventListener('click', () => this.#setMode(this.#parentMode()));
    // Productos → submenú: las filas de la lista son mega-link button
    root.querySelector('.panel').addEventListener('click', (event) => {
      const row = event.target.closest?.('arq-mega-link[data-mode]');
      if (row) this.#setMode(row.dataset.mode);
    });

    // Mega-menu: Esc (con el foco en Productos o adentro) y clic afuera
    this.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && this.#megaOpen) {
        event.stopPropagation();
        this.#toggleMega(false);
        this.#productsLink()?.focus();
      }
    });
    document.addEventListener('click', (event) => {
      if (!event.composedPath().includes(this)) {
        this.#toggleMega(false);
        if (this.mode === 'search' && !MOBILE.matches) this.#showResults(false);
      }
    });

    // Transparent pasa a Default cuando la barra deja atrás la foto del hero
    // (el primer <arq-hero> de la página). Sin hero, al empezar el scroll.
    const onScroll = () => {
      const hero = document.querySelector('arq-hero');
      const scrolled = hero
        ? hero.getBoundingClientRect().bottom <= this.shadowRoot.querySelector('.bar').getBoundingClientRect().bottom
        : window.scrollY > 0;
      if (scrolled === this.#scrolled) return;
      this.#scrolled = scrolled;
      this.shadowRoot.querySelector('.navbar').classList.toggle('scrolled', scrolled);
      this.#syncLinks();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    const hero = document.querySelector('arq-hero');
    if (hero) new ResizeObserver(onScroll).observe(hero);
    onScroll();

    this.shadowRoot.querySelector('slot[name="links"]').addEventListener('slotchange', () => this.#syncLinks());
    this.#syncLinks();
  }

  update(changed) {
    if (changed.has('label')) this.shadowRoot.querySelector('.bar').setAttribute('aria-label', this.label ?? '');
    if (changed.has('theme') || changed.has('mode')) this.#syncLinks();
  }

  // ── Links ────────────────────────────────────────────────────────
  #productsLink() {
    return this.querySelector('arq-nav-link[has-dropdown]');
  }

  // Desktop: los links van en la barra; Mobile: dentro del menú.
  #placeLinks() {
    const root = this.shadowRoot;
    const slot = root.querySelector('slot[name="links"]');
    root.querySelector(MOBILE.matches ? '.menu-main' : '.links').append(slot);
    // Logo Default en desktop, Small en mobile
    root.querySelector('.logo').size = MOBILE.matches ? 'small' : 'default';
  }

  // Theme=Inverse en los nav-link sobre foto (Transparent sin scroll). La
  // búsqueda desktop sigue sobre la foto; el menú mobile y
  // el mega-menu pasan a Default.
  #syncLinks() {
    // Con el sheet, la barra no cambia al abrir la búsqueda (en ningún ancho): queda
    // debajo del sheet y se vuelve sólida con él, sin saltos de color.
    const overPhoto = this.mode === 'default' || (this.mode === 'search' && (!MOBILE.matches || this.#sheetSearch));
    const inverse = this.theme === 'transparent' && overPhoto && !this.#scrolled && !this.#megaOpen;
    this.shadowRoot.querySelector('.navbar').classList.toggle('over-photo', inverse);
    for (const link of this.querySelectorAll('arq-nav-link')) link.theme = inverse ? 'inverse' : 'default';
    // Lupa y menú: Dark local sobre la foto
    for (const button of this.shadowRoot.querySelectorAll('.search-open, .actions arq-icon-button')) {
      if (inverse) button.setAttribute('data-arq-theme', 'dark');
      else button.removeAttribute('data-arq-theme');
    }
  }

  // ── Modos ────────────────────────────────────────────────────────
  #setMode(mode) {
    const root = this.shadowRoot;
    const previous = this.mode;
    this.mode = mode;
    this.#toggleMega(false);
    const menu = root.querySelector('.menu');
    const mobile = MOBILE.matches;

    // Búsqueda desktop: el campo reemplaza a la lupa
    const desktopSearch = mode === 'search' && !mobile && !this.#sheetSearch;
    root.querySelector('.search-open').hidden = desktopSearch;
    root.querySelector('.search-box').hidden = !desktopSearch;
    if (desktopSearch) requestAnimationFrame(() => root.querySelector('.search-field').focus());
    if (mode !== 'search') this.#clearSearch();

    // Menú mobile (Menu, Products y los submenús)
    const inMenu = mode === 'menu' || this.#inSubmenu(mode);
    if (inMenu && !menu.open) {
      this.#menuOpener = root.querySelector('.menu-open');
      menu.showModal();
      // El foco arranca en cerrar (no en el logo)
      if (mode === 'menu') root.querySelector('.menu-close').focus();
    } else if (!inMenu && menu.open) {
      menu.close();
      this.#menuOpener?.focus();
    }
    root.querySelector('.menu-main').hidden = mode !== 'menu';
    root.querySelector('.menu-sub').hidden = !this.#inSubmenu(mode);
    if (this.#inSubmenu(mode)) {
      this.#ensureNavigation();
      this.#renderPanel();
      // Al volver de un submenú a Productos, el foco vuelve a la fila que lo abrió
      requestAnimationFrame(() => {
        if (mode === 'products' && previous in SUBMENUS) root.querySelector(`arq-mega-link[data-mode="${previous}"]`)?.focus();
        else root.querySelector('.back').focus();
      });
    } else if (mode === 'menu' && this.#inSubmenu(previous)) {
      requestAnimationFrame(() => this.#productsLink()?.focus());
    }
    if (mode !== 'search') {
      root.querySelector('.search-screen').open = false;
      root.querySelector('.search-sheet').open = false;
    }
    this.#syncLinks();
  }

  // Products y los cuatro submenús viven en el mismo panel del menú mobile.
  #inSubmenu(mode) {
    return mode === 'products' || mode in SUBMENUS;
  }

  // Nivel de arriba: submenú → Productos → Menu.
  #parentMode() {
    return this.mode in SUBMENUS ? 'products' : 'menu';
  }

  // search="sheet" (por defecto): la búsqueda es el top sheet, en todos los anchos
  get #sheetSearch() {
    return this.search === 'sheet';
  }

  #menuOpener = null;
  #scrolled = false;
  #megaOpen = false;

  #closeAll() {
    if (this.mode !== 'default') this.#setMode('default');
    this.#toggleMega(false);
  }

  #toggleMega(open) {
    const mega = this.shadowRoot.querySelector('.mega');
    const link = this.#productsLink();
    const next = Boolean(open) && !MOBILE.matches;
    if (next) this.#ensureNavigation();
    if (next && this.mode === 'search') this.#setMode('default');
    mega.hidden = !next;
    if (link) link.open = next;
    this.#megaOpen = next;
    this.#syncLinks();
  }

  // ── Navegación ───────────────────────────────────────────────────
  #ensureNavigation() {
    if (this.#navigation || this.#loadingNavigation) return;
    this.#loadingNavigation = getNavigation()
      .then((navigation) => (this.navigation = navigation))
      .catch((error) => console.error('[arq] navbar: no se pudo cargar la navegación', error))
      .finally(() => (this.#loadingNavigation = null));
  }

  #renderNavigation() {
    this.shadowRoot.querySelector('.mega').navigation = this.#navigation;
    if (this.#inSubmenu(this.mode)) this.#renderPanel();
  }

  // Menú mobile (Figma: navbar Mode=Products, Interior, Exterior, Lámparas y
  // artefactos y Colecciones). Products lista los submenús como mega-link
  // button con chevron-right; cada submenú lista sus links (Size=Large) y un
  // "Ver todo…" (button Underline con arrow-right) al pie.
  #renderPanel() {
    const root = this.shadowRoot;
    const nav = this.#navigation;
    const s = nav?.sections ?? {};
    const mode = this.mode;
    root.querySelector('.back-label').textContent = mode in SUBMENUS ? SUBMENUS[mode] : 'Productos';
    const links = (section, { image } = {}) =>
      section.links
        .map((l) => `<arq-mega-link size="large" href="${esc(l.href)}"${image ? ' show-image' : ''}>${esc(l.label)}</arq-mega-link>`)
        .join('');
    const action = (to) =>
      `<div class="action"><arq-button type="underline" show-underline show-icon icon="arrow-right" href="${esc(to.href)}">${esc(to.label)}</arq-button></div>`;
    const group = (section, { eyebrow, image } = {}) =>
      `<div class="group">${eyebrow ? `<p class="eyebrow role-label">${esc(section.label)}</p>` : ''}${links(section, { image })}</div>${action(section.all)}`;

    let html = '';
    if (mode === 'products') {
      const rows = {
        interior: s.interior,
        exterior: s.exterior,
        'lamparas-y-artefactos': s.lamparas || s.artefactos,
        colecciones: nav?.collections?.length,
      };
      html = `<div class="group">${Object.entries(SUBMENUS)
        .filter(([id]) => rows[id])
        .map(([id, label]) => `<arq-mega-link button show-arrow icon="chevron-right" data-mode="${id}">${esc(label)}</arq-mega-link>`)
        .join('')}</div>`;
    } else if (mode === 'interior' && s.interior) html = group(s.interior);
    else if (mode === 'exterior' && s.exterior) html = group(s.exterior);
    else if (mode === 'lamparas-y-artefactos') {
      html = [s.lamparas, s.artefactos]
        .filter(Boolean)
        .map((section) => group(section, { eyebrow: true, image: true }))
        .join('');
    } else if (mode === 'colecciones' && nav?.collections?.length) {
      html =
        `<div class="group">${nav.collections
          .map((c) => `<arq-mega-link size="large" show-image href="${esc(c.href)}">${esc(c.label)}<span slot="meta">${esc(c.meta)}</span></arq-mega-link>`)
          .join('')}</div>` + action(nav.allCollections);
    }
    root.querySelector('.panel').innerHTML = html;
  }

  // ── Búsqueda ─────────────────────────────────────────────────────
  #search(value) {
    clearTimeout(this.#timer);
    this.#query = value.trim();
    if (!this.#query) {
      this.#renderResults([], 0);
      return;
    }
    this.#timer = setTimeout(async () => {
      const query = this.#query;
      try {
        const { results, total } = await searchProducts(query, { limit: SEARCH_LIMIT });
        if (query === this.#query) this.#renderResults(results, total);
      } catch (error) {
        console.error('[arq] navbar: no se pudo buscar', error);
      }
    }, DEBOUNCE);
  }

  #renderResults(results, total) {
    const root = this.shadowRoot;
    this.#results = results;
    this.#active = -1;
    const query = this.#query;
    const rows =
      results
        .map(
          (r) =>
            `<arq-search-result href="${esc(r.href)}"${r.image ? ` image="${esc(r.image)}"` : ''}>${esc(r.name)}<span slot="meta">${esc(r.meta)}</span></arq-search-result>`,
        )
        .join('') +
      (results.length ? `<arq-search-see-all href="${esc(searchHref(query))}" term="${esc(query)}" count="${total}"></arq-search-see-all>` : '');
    const noResults = query && !results.length;
    // Desktop: dropdown debajo del campo
    const dropdown = root.querySelector('.search-dropdown');
    dropdown.state = noResults ? 'no-results' : 'results';
    dropdown.term = query;
    dropdown.innerHTML = rows;
    this.#showResults(Boolean(query));
    // Mobile: dentro de search-screen
    const screen = root.querySelector('.search-screen');
    screen.innerHTML = noResults ? `<arq-search-dropdown state="no-results" term="${esc(query)}"></arq-search-dropdown>` : rows;
    // Sheet: arma sus grupos (productos y colecciones) con los resultados
    root.querySelector('.search-sheet').results = { query, items: results, total, href: searchHref(query) };
    this.#announce();
  }

  // Productos recomendados del sheet: se piden una sola vez, al acercarse a la
  // lupa o al abrirlo (el catálogo tarda en cargar la primera vez).
  #loadRecommended() {
    if (this.#recommended || this.search !== 'sheet') return;
    const sheet = this.shadowRoot.querySelector('.search-sheet');
    this.#recommended = getRecommendedProducts()
      .then((cards) => (sheet.recommended = cards))
      .catch((error) => {
        this.#recommended = null;
        console.error('[arq] navbar: no se pudieron cargar los recomendados', error);
      });
  }

  // over-photo: la barra está transparente sobre la foto del hero; el sheet arranca
  // igual (logo y cruz en inverso) y se vuelve sólido con la transición.
  #openSheet(opener) {
    this.#loadRecommended();
    const sheet = this.shadowRoot.querySelector('.search-sheet');
    sheet.toggleAttribute('over-photo', this.shadowRoot.querySelector('.navbar').classList.contains('over-photo'));
    sheet.show(opener);
  }

  #showResults(show) {
    this.shadowRoot.querySelector('.search-dropdown').hidden = !show;
  }

  #clearSearch() {
    clearTimeout(this.#timer);
    this.#query = '';
    const root = this.shadowRoot;
    root.querySelector('.search-field').value = '';
    root.querySelector('.search-screen').field.value = '';
    root.querySelector('.search-sheet').field.value = '';
    this.#renderResults([], 0);
  }

  #resultElements() {
    const root = this.shadowRoot;
    if (this.#sheetSearch) return root.querySelector('.search-sheet').items;
    const container = MOBILE.matches ? root.querySelector('.search-screen') : root.querySelector('.search-dropdown');
    return [...container.querySelectorAll('arq-search-result')];
  }

  #move(step) {
    const items = this.#resultElements();
    if (!items.length) return;
    this.#active = this.#active < 0 && step < 0 ? items.length - 1 : (this.#active + step + items.length) % items.length;
    items.forEach((item, i) => (item.active = i === this.#active));
    if (!MOBILE.matches && !this.#sheetSearch) this.#showResults(true);
    this.#announce();
  }

  #announce() {
    const item = this.#results[this.#active];
    const label = item ? `${item.name}, ${item.meta}, ${this.#active + 1} de ${this.#results.length}` : '';
    this.shadowRoot.querySelector('.search-field').activeLabel = label;
    this.shadowRoot.querySelector('.search-screen').field.activeLabel = label;
    this.shadowRoot.querySelector('.search-sheet').field.activeLabel = label;
  }

  #submit(value) {
    const active = this.#resultElements()[this.#active];
    if (active) active.click();
    else if (value.trim()) location.assign(searchHref(value.trim()));
  }
}

ArqNavbar.define();

export { ArqNavbar };
