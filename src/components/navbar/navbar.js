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
//   Products), que cambia con las acciones del usuario. Se refleja en el
//   atributo mode (solo lectura) para la demo y los estilos de la página.
// - Theme: default · transparent. Transparent va sobre la foto del hero:
//   fondo color/overlay/translucent con blur/backdrop, textos e íconos en
//   inverso (nav-link Theme=Inverse). Sigue transparente mientras la barra
//   está sobre el hero y pasa a Default al dejarlo atrás (sin hero, al hacer
//   scroll); también con un menú o la búsqueda abiertos.
//   TODO (diseño): las variantes Transparent de Menu, Search y Products del set
//   están desactualizadas (otra estructura); se usa la versión Default.
// - Posición: sticky arriba en Default; fixed en Transparent (se superpone al
//   hero). TODO (diseño): confirmar.
// - Datos: la navegación (getNavigation) y la búsqueda (searchProducts) salen
//   de src/data/catalog.js. Se piden al abrir Productos o al escribir, no al
//   cargar la página. Decisión 2026-10-02 · navbar.
// - Menú mobile y búsqueda mobile: diálogos modales nativos (foco adentro,
//   Esc cierra, el foco vuelve al botón que los abrió). La página no tiene
//   que bloquear el scroll (el diálogo ocupa la pantalla).
// - Mega-menu: Esc o un clic afuera lo cierran y el foco vuelve a Productos.

import { ArqElement } from '../../base/arq-element.js';
import { icon } from '../../base/icons.js';
import { getNavigation, searchProducts, searchHref } from '../../data/catalog.js';
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
import css from './navbar.css?inline';

const MOBILE = matchMedia('(max-width: 767px)');
const esc = (text) => String(text ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const SEARCH_LIMIT = 5; // search-dropdown: "hasta 4 o 5" resultados
const DEBOUNCE = 150;

class ArqNavbar extends ArqElement {
  static tag = 'arq-navbar';
  static styles = css;
  static properties = {
    theme: { type: String, values: ['default', 'transparent'], default: 'default' }, // Theme
    mode: { type: String, values: ['default', 'search', 'menu', 'products'], default: 'default' }, // Mode (lo pone el componente)
    label: { type: String, default: 'Principal' }, // nombre del <nav>
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
    `<div class="menu-products" hidden>` +
    `<button type="button" class="back role-body-medium">${icon('chevron-left')}<span>Productos</span></button>` +
    `<div class="groups"></div>` +
    `<div class="collections"></div>` +
    `</div>` +
    `</dialog>` +
    `<arq-search-screen class="search-screen"></arq-search-screen>`;

  #navigation = null;
  #loadingNavigation = null;
  #results = [];
  #active = -1;
  #timer = 0;
  #query = '';

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

    // Búsqueda desktop
    root.querySelector('.search-open').addEventListener('click', () => this.#setMode('search'));
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
      screen.show(event.currentTarget);
    });
    screen.addEventListener('arq:close', (event) => {
      event.stopPropagation();
      this.#setMode('default');
    });

    // Eventos de los dos campos (desktop y mobile)
    for (const target of [field, screen]) {
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
      this.#setMode(this.mode === 'products' ? 'menu' : 'default');
    });
    root.querySelector('.back').addEventListener('click', () => this.#setMode('menu'));

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

  // Theme=Inverse en los nav-link sobre foto (Transparent sin scroll).
  #syncLinks() {
    const inverse = this.theme === 'transparent' && this.mode === 'default' && !this.#scrolled && !this.#megaOpen;
    this.shadowRoot.querySelector('.navbar').classList.toggle('over-photo', inverse);
    for (const link of this.querySelectorAll('arq-nav-link')) link.theme = inverse ? 'inverse' : 'default';
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
    const desktopSearch = mode === 'search' && !mobile;
    root.querySelector('.search-open').hidden = desktopSearch;
    root.querySelector('.search-box').hidden = !desktopSearch;
    if (desktopSearch) requestAnimationFrame(() => root.querySelector('.search-field').focus());
    if (mode !== 'search') this.#clearSearch();

    // Menú mobile (Menu y Products)
    const inMenu = mode === 'menu' || mode === 'products';
    if (inMenu && !menu.open) {
      this.#menuOpener = root.querySelector('.menu-open');
      menu.showModal();
      // El foco arranca en cerrar (no en el logo)
      if (mode === 'menu') root.querySelector('.menu-close').focus();
    } else if (!inMenu && menu.open) {
      menu.close();
      this.#menuOpener?.focus();
    }
    root.querySelector('.menu-main').hidden = mode === 'products';
    root.querySelector('.menu-products').hidden = mode !== 'products';
    if (mode === 'products') {
      this.#ensureNavigation();
      requestAnimationFrame(() => root.querySelector('.back').focus());
    } else if (mode === 'menu' && previous === 'products') {
      requestAnimationFrame(() => this.#productsLink()?.focus());
    }
    if (mode !== 'search') root.querySelector('.search-screen').open = false;
    this.#syncLinks();
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
    const root = this.shadowRoot;
    const nav = this.#navigation;
    root.querySelector('.mega').navigation = nav;
    // Submenú mobile: Interior, Exterior, Lámparas y Artefactos (orden del set)
    const s = nav?.sections ?? {};
    root.querySelector('.groups').innerHTML = [s.interior, s.exterior, s.lamparas, s.artefactos]
      .filter(Boolean)
      .map(
        (section) =>
          `<arq-mega-link type="group">${esc(section.label)}` +
          section.links.map((l) => `<a slot="links" href="${esc(l.href)}">${esc(l.label)}</a>`).join('') +
          `<arq-button slot="links" type="underline" show-underline href="${esc(section.all.href)}">Ver todo</arq-button>` +
          `</arq-mega-link>`,
      )
      .join('');
    root.querySelector('.collections').innerHTML = nav?.allCollections
      ? `<arq-button type="underline" show-underline show-icon icon="arrow-right" href="${esc(nav.allCollections.href)}">Ver colecciones</arq-button>`
      : '';
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
    this.#announce();
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
    this.#renderResults([], 0);
  }

  #resultElements() {
    const container = MOBILE.matches ? this.shadowRoot.querySelector('.search-screen') : this.shadowRoot.querySelector('.search-dropdown');
    return [...container.querySelectorAll('arq-search-result')];
  }

  #move(step) {
    const items = this.#resultElements();
    if (!items.length) return;
    this.#active = this.#active < 0 && step < 0 ? items.length - 1 : (this.#active + step + items.length) % items.length;
    items.forEach((item, i) => (item.active = i === this.#active));
    if (!MOBILE.matches) this.#showResults(true);
    this.#announce();
  }

  #announce() {
    const item = this.#results[this.#active];
    const label = item ? `${item.name}, ${item.meta}, ${this.#active + 1} de ${this.#results.length}` : '';
    this.shadowRoot.querySelector('.search-field').activeLabel = label;
    this.shadowRoot.querySelector('.search-screen').field.activeLabel = label;
  }

  #submit(value) {
    const active = this.#resultElements()[this.#active];
    if (active) active.click();
    else if (value.trim()) location.assign(searchHref(value.trim()));
  }
}

ArqNavbar.define();

export { ArqNavbar };
