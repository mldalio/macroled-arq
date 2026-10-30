// navbar · Figma 753:2907 · ficha doc/navbar (1442:3513)
//
// Barra de navegación de Macroled Arq, primer elemento de todas las páginas.
//
//   <arq-navbar theme="transparent">
//     <arq-nav-link slot="links" has-dropdown data-menu="products">Productos</arq-nav-link>
//     <arq-nav-link slot="links" has-dropdown data-menu="recursos">Recursos</arq-nav-link>
//     <arq-nav-link slot="links" href="/arq/nosotros">Nosotros</arq-nav-link>
//     <arq-nav-link slot="links" href="/arq/contacto" current>Contacto</arq-nav-link>
//   </arq-navbar>
//
// - Los links llegan por slot (indexables). has-dropdown abre un panel:
//   data-menu="products" el mega-menu de Productos; data-menu="recursos"
//   el panel de Recursos (Catálogos y Descargas en mega-link, con lugar
//   para una foto). En desktop con mouse se abren al pasar el cursor y se
//   cierran al salir. En Mobile cada uno entra a su submenú (clic). Sin
//   mouse (tablet táctil), el clic sigue abriendo el panel.
// - Mode no es prop: es el estado de la barra (Default · Search · Menu ·
//   Products · Interior · Exterior · Lámparas y artefactos · Colecciones),
//   que cambia con las
//   acciones del usuario. Se refleja en el atributo mode (solo lectura) para
//   la demo y los estilos de la página.
// - Products (Mobile, set 841:2325): lista de Interior, Exterior, Lámparas y
//   artefactos y Colecciones (mega-link submenu, chevron-right). Cada fila
//   entra a su submenú con «volver» y el nombre del nivel: links en mega-link
//   Size=Large y "Ver todo…" al pie (frame 2295:23605; Colecciones con
//   miniatura, y la lista se desplaza con "Ver todo" fijo abajo). Lámparas y
//   artefactos sale de la macrofamilia, con un link por subfamilia, igual que
//   Interior y Exterior.
// - Theme: default · transparent. Transparent va sobre la foto del hero:
//   fondo color/overlay/translucent con blur/backdrop, textos e íconos en
//   inverso (nav-link Theme=Inverse). Sigue transparente mientras la barra
//   está sobre el hero y pasa a Default al dejarlo atrás (sin hero, al hacer
//   scroll); también con el menú mobile o el mega-menu abiertos. La búsqueda
//   desktop queda sobre la foto, con el campo en blanco (Default). La lupa y
//   el menú van en Dark local sobre la foto. Con prefers-reduced-transparency
//   o prefers-contrast: more, la barra queda Default también sobre la foto.
// - Posición: sticky arriba en los dos Theme; Transparent se superpone al
//   hero con un margen inferior negativo (su alto), así arranca debajo de
//   announcement-bar si la hay. TODO (diseño): confirmar.
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
// - Mega-menu y Recursos: Esc o un clic afuera los cierran y el foco vuelve al link que los abrió.
//   Con teclado, Enter o Espacio los abren y el foco queda en el link; Tab o
//   ↓ entran al panel: la pestaña elegida del mega-menu o el primer link de
//   Recursos. Si el foco sale del panel y de su link (Tab), se cierran.
// - Búsqueda y lectores de pantalla: el campo es un combobox (search-field
//   combobox) y anuncia la cantidad de resultados, «sin resultados» o el error
//   (prop status del campo; cada diálogo tiene el suyo, porque lo de afuera de
//   un diálogo modal queda inerte). Si la búsqueda falla, search-dropdown
//   State=error (solo de código, TODO diseño).
// - Recursos (Desktop): columna de links a la izquierda y una foto grande a la
//   derecha (slot recursos-media; sin foto, color/surface/subtle). Catálogos
//   apunta a /arq/catalogos. Descargas es
//   /arq/descargas. En Mobile, submenú con «volver» y los dos links.

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
import { sizedImage } from '../../base/image-size.js';
import { containScroll } from '../../base/scroll-lock.js';
import { setPanelBar } from '../../base/theme.js';
import { toMs } from '../../base/motion.js';
import css from './navbar.css?inline';

const MOBILE = matchMedia('(max-width: 767px)');
// Desktop con mouse: los dropdowns se abren al pasar el cursor, no con el clic.
// Quien pidió menos transparencia o más contraste ve la barra Default también
// sobre la foto: el texto claro sobre una foto que cambia, con un fondo al
// 10 % y blur, puede no leerse.
const SOLID = matchMedia('(prefers-reduced-transparency: reduce), (prefers-contrast: more)');
const esc = (text) => String(text ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const SEARCH_LIMIT = 5; // search-dropdown: "hasta 4 o 5" resultados
const THUMB_WIDTH = 240; // ancho en px que se pide de la miniatura de mega-link (80 px a 3x)
const DEBOUNCE = 150;
const SUBMENUS = ['interior', 'exterior', 'lamparas-y-artefactos', 'colecciones']; // orden de Products Mobile (841:2325)

class ArqNavbar extends ArqElement {
  static tag = 'arq-navbar';
  static styles = css;
  static properties = {
    theme: { type: String, values: ['default', 'transparent'], default: 'default' }, // Theme
    mode: { type: String, values: ['default', 'search', 'menu', 'products', 'recursos', ...SUBMENUS], default: 'default' }, // Mode (lo pone el componente)
    search: { type: String, values: ['inline', 'sheet'], default: 'sheet' }, // cómo se abre la búsqueda (solo de código)
    label: { type: String, default: 'Principal' }, // nombre del <nav>
  };
  static template =
    `<header class="navbar">` +
    `<div class="scrim" aria-hidden="true"></div>` +
    `<nav class="bar">` +
    `<arq-logo class="logo"></arq-logo>` +
    `<div class="right">` +
    `<div class="links"><slot name="links"></slot></div>` +
    `<div class="search">` +
    `<arq-icon-button class="search-open" icon="search">Buscar</arq-icon-button>` +
    `<div class="search-box" hidden>` +
    `<arq-search-field class="search-field" show-close combobox></arq-search-field>` +
    `<arq-search-dropdown class="search-dropdown" data-arq-theme="light" hidden></arq-search-dropdown>` +
    `</div>` +
    `</div>` +
    `<div class="actions">` +
    `<arq-icon-button class="search-open-mobile" icon="search">Buscar</arq-icon-button>` +
    `<arq-icon-button class="menu-open" icon="menu">Abrir menú</arq-icon-button>` +
    `</div>` +
    `</div>` +
    `</nav>` +
    `<div class="mega-wrap" hidden><div class="mega-drawer">` +
    `<arq-mega-menu class="mega" data-arq-theme="light"></arq-mega-menu>` +
    `<div class="recursos" data-arq-theme="light" hidden>` +
    `<nav class="recursos-nav" aria-label="Recursos">` +
    `<p class="recursos-title role-heading-1">Recursos</p>` +
    `<div class="recursos-links">` +
    `<arq-mega-link href="/arq/catalogos" show-arrow>Catálogos</arq-mega-link>` +
    `<arq-mega-link href="/arq/descargas" show-arrow>Descargas</arq-mega-link>` +
    `</div>` +
    `</nav>` +
    `<div class="recursos-media" aria-hidden="true"><slot name="recursos-media">` +
    `<img class="catalogs" src="https://d1zltvqju4u8ql.cloudfront.net/fit-in/filters:format(webp)/MACROLED/ARQ/imagenes/home/catalogos_todos.png" alt="" loading="lazy">` +
    `<img class="downloads" src="/Fichas%20t%C3%A9cnicas%20Macroled%20Arq%20sobre%20madera.png" alt="" loading="lazy" hidden>` +
    `</slot></div>` +
    `</div>` +
    `</div></div>` +
    `</header>` +
    `<dialog class="menu" data-arq-theme="light" aria-label="Menú">` +
    `<div class="menu-bar">` +
    `<arq-logo class="menu-logo" size="small"></arq-logo>` +
    `<arq-icon-button class="menu-close" icon="close" background="subtle">Cerrar menú</arq-icon-button>` +
    `</div>` +
    `<div class="menu-main"></div>` +
    `<div class="menu-products" hidden>` +
    `<button type="button" class="back role-body-medium">${icon('chevron-left')}<span>Productos</span></button>` +
    `<div class="groups"></div>` +
    `<div class="products-cta"><arq-button type="underline" show-underline show-icon icon="arrow-right" href="/arq/productos">Ver todos los productos</arq-button></div>` +
    `</div>` +
    `<div class="menu-recursos" hidden>` +
    `<button type="button" class="back back-recursos role-body-medium">${icon('chevron-left')}<span>Recursos</span></button>` +
    `<div class="recursos-list">` +
    `<arq-mega-link size="large" href="/arq/catalogos">Catálogos</arq-mega-link>` +
    `<arq-mega-link size="large" href="/arq/descargas">Descargas</arq-mega-link>` +
    `</div>` +
    `</div>` +
    `<div class="menu-sub" hidden>` +
    `<button type="button" class="back back-sub role-body-medium">${icon('chevron-left')}<span class="sub-label"></span></button>` +
    `<div class="sub-list"></div>` +
    `<div class="sub-cta"></div>` +
    `</div>` +
    `</dialog>` +
    `<arq-search-screen class="search-screen" data-arq-theme="light"></arq-search-screen>` +
    `<arq-search-sheet class="search-sheet" data-arq-theme="light"></arq-search-sheet>`;

  #navigation = null;
  #loadingNavigation = null;
  #recommended = null;
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
    SOLID.addEventListener('change', () => this.#syncLinks());

    // Productos y Recursos se abren y cierran con clic en todos los dispositivos.
    this.addEventListener('arq:toggle', (event) => {
      if (event.target.localName !== 'arq-nav-link') return;
      event.stopPropagation();
      const which = event.target.dataset.menu === 'recursos' ? 'recursos' : 'products';
      if (MOBILE.matches) this.#setMode(which);
      else this.#toggleMega(!(this.#megaOpen && this.#megaWhich === which), which);
    });
    // Teclado: al abrir, el foco queda en Productos o Recursos; con Tab o ↓
    // entra al panel (en el DOM el panel va después de toda la barra).
    this.addEventListener('keydown', (event) => {
      if (MOBILE.matches || !['Tab', 'ArrowDown'].includes(event.key) || event.shiftKey) return;
      const link = event.composedPath().find((node) => node.localName === 'arq-nav-link' && node.hasAttribute('has-dropdown'));
      if (!link) return;
      const which = link.dataset.menu === 'recursos' ? 'recursos' : 'products';
      const open = this.#megaOpen && this.#megaWhich === which;
      if (event.key === 'Tab' && !open) return;
      event.preventDefault();
      if (!open) this.#toggleMega(true, which);
      this.#focusPanel(which);
    });
    // Tab fuera del panel y de su link: se cierra. Sin destino (clic en un
    // fondo, cambio de ventana) no: de eso se ocupa el clic afuera.
    this.addEventListener('focusin', (event) => {
      if (!this.#megaOpen) return;
      const path = event.composedPath();
      const wrap = this.shadowRoot.querySelector('.mega-wrap');
      if (!path.includes(wrap) && !path.includes(this.#dropdown(this.#megaWhich))) this.#toggleMega(false);
    });
    this.addEventListener('focusout', (event) => {
      const next = event.relatedTarget;
      if (this.#megaOpen && next && next !== this && !this.contains(next)) this.#toggleMega(false);
    });
    // Preparar el contenido al activar cualquiera de los dropdowns.
    this.addEventListener('arq:toggle', (event) => {
      if (event.target.localName === 'arq-nav-link' && event.target.dataset.menu !== 'recursos') this.#ensureNavigation();
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
      this.#setMode(SUBMENUS.includes(this.mode) ? 'products' : this.mode === 'products' || this.mode === 'recursos' ? 'menu' : 'default');
    });
    // Un toque en el scrim (fuera del panel) cierra el menú, como el top sheet
    menu.addEventListener('click', (event) => {
      if (event.target !== menu) return;
      const { bottom } = menu.getBoundingClientRect();
      if (event.clientY > bottom) this.#setMode('default');
    });
    root.querySelector('.back').addEventListener('click', () => this.#setMode('menu'));
    root.querySelector('.back-recursos').addEventListener('click', () => this.#setMode('menu'));
    root.querySelector('.back-sub').addEventListener('click', () => this.#setMode('products'));
    // Filas de Productos: entran a su submenú
    root.querySelector('.groups').addEventListener('click', (event) => {
      const row = event.target.closest('arq-mega-link[data-sub]');
      if (row) this.#setMode(row.dataset.sub);
    });

    // Con el mega-menú abierto la página de atrás no se desplaza (rueda, touch ni teclado)
    containScroll(root.querySelector('.navbar'), { when: () => this.#megaOpen });
    // Menú Mobile: tampoco (en el teléfono se movía la página y con ella la barra del navegador)
    containScroll(root.querySelector('.menu'));
    root.querySelector('.menu').addEventListener('close', () => setPanelBar(false));
    // Clic en el scrim del mega-menú: lo cierra
    root.querySelector('.scrim').addEventListener('click', () => this.#toggleMega(false));

    // Mega-menu: Esc (con el foco en Productos o adentro) y clic afuera
    this.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && this.#megaOpen) {
        event.stopPropagation();
        const which = this.#megaWhich;
        this.#toggleMega(false);
        this.#dropdown(which)?.focus();
      }
    });
    document.addEventListener('click', (event) => {
      // Un link de la página con data-arq-menu="colecciones" (footer, Home) abre el menú
      // en esa pestaña en vez de navegar. Con Ctrl/Cmd/Mayús o clic del medio, el link
      // hace lo suyo (su href).
      const opener = event.composedPath().find((node) => node.dataset?.arqMenu);
      if (opener && !event.defaultPrevented && event.button === 0 && !(event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)) {
        event.preventDefault();
        this.#openMenu(opener.dataset.arqMenu);
        return;
      }
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
    this.#markRecursosCurrent();
    const recursosLinks = root.querySelector('.recursos-links');
    const onRecursosLink = (event) => {
      const link = event.target.closest?.('arq-mega-link');
      if (link) this.#showRecursosPhoto(link);
    };
    recursosLinks.addEventListener('pointerover', onRecursosLink);
    recursosLinks.addEventListener('focusin', onRecursosLink);
  }

  update(changed) {
    if (changed.has('label')) this.shadowRoot.querySelector('.bar').setAttribute('aria-label', this.label ?? '');
    if (changed.has('theme') || changed.has('mode')) this.#syncLinks();
  }

  // ── Links ────────────────────────────────────────────────────────
  #dropdown(which) {
    return this.querySelector(`arq-nav-link[data-menu="${which}"]`) || this.querySelector('arq-nav-link[has-dropdown]');
  }

  #productsLink() {
    return this.#dropdown('products');
  }

  // Catálogos muestra los lomos; Descargas, las fichas. Al abrir vuelve a la de la página, o a catálogos.
  #showRecursosPhoto(link) {
    const downloads = (link?.getAttribute?.('href') || link || '').includes('/descargas');
    const media = this.shadowRoot.querySelector('.recursos-media');
    const catalogs = media.querySelector('img.catalogs');
    const sheets = media.querySelector('img.downloads');
    if (!catalogs || !sheets) return;
    catalogs.hidden = downloads;
    sheets.hidden = !downloads;
  }

  // El link del panel que coincide con la página (Descargas o, cuando exista, Catálogos).
  #markRecursosCurrent() {
    const page = decodeURIComponent(location.pathname).replace(/\/$/, '').split('/').pop().replace(/\.html$/, '');
    for (const link of this.shadowRoot.querySelectorAll('.recursos-nav arq-mega-link, .recursos-list arq-mega-link')) {
      const target = (link.getAttribute('href') || '').split('/').pop();
      const anchor = link.shadowRoot?.querySelector('a');
      if (!anchor) continue;
      if (target && target === page) anchor.setAttribute('aria-current', 'page');
      else anchor.removeAttribute('aria-current');
    }
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
    const inverse = this.theme === 'transparent' && overPhoto && !this.#scrolled && !this.#megaOpen && !SOLID.matches;
    this.shadowRoot.querySelector('.navbar').classList.toggle('over-photo', inverse);
    for (const link of this.querySelectorAll('arq-nav-link')) {
      // Si el navbar se activa antes que sus links (HTML insertado de una vez,
      // como en la demo), se activa el link acá: si no, theme quedaría como
      // propiedad suelta y el método no existiría todavía.
      customElements.upgrade(link);
      link.theme = inverse ? 'inverse' : 'default';
      link.setCurrentIndicatorVisible(!this.#megaOpen);
    }
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

    // Menú mobile (Menu, Products y sus submenús)
    const sub = SUBMENUS.includes(mode);
    const inMenu = mode === 'menu' || mode === 'products' || mode === 'recursos' || sub;
    // El nivel que se ve ahora (para el cambio de nivel, #slideLevel)
    const levels = [...root.querySelectorAll('.menu-main, .menu-products, .menu-recursos, .menu-sub')];
    // (el que está saliendo en un cambio en curso sigue a la vista, pero inert)
    const from = menu.classList.contains('is-open') ? levels.find((level) => !level.hidden && !level.inert) : null;
    const fromTop = from?.offsetTop ?? 0;
    // Alto visible del panel antes del cambio de nivel (para que crezca o se achique, #resizeMenu)
    const heightBefore = from ? this.#menuVisibleHeight(menu) : 0;
    // Colecciones es una lista larga: el panel llega a toda la pantalla (el único salto de alto)
    menu.classList.toggle('is-tall', mode === 'colecciones');
    if (inMenu && !menu.open) {
      this.#syncTop();
      this.#menuOpener = root.querySelector('.menu-open');
      clearTimeout(this.#menuTimer);
      menu.showModal();
      // Con Iluminar, la barra del navegador pasa al color del menú (Light)
      setPanelBar(true, menu);
      void menu.offsetHeight; // fija la persiana cerrada antes de is-open
      menu.classList.add('is-open');
      // El foco arranca en cerrar (no en el logo)
      if (mode === 'menu') root.querySelector('.menu-close').focus();
    } else if (inMenu && !menu.classList.contains('is-open')) {
      // Se vuelve a abrir mientras se cerraba: la persiana vuelve desde donde está
      clearTimeout(this.#menuTimer);
      menu.classList.add('is-open');
    } else if (!inMenu && menu.open) {
      this.#closeMenu(menu);
    }
    if (inMenu) {
      root.querySelector('.menu-main').hidden = mode !== 'menu';
      root.querySelector('.menu-products').hidden = mode !== 'products';
      root.querySelector('.menu-recursos').hidden = mode !== 'recursos';
      root.querySelector('.menu-sub').hidden = !sub;
      const to = levels.find((level) => !level.hidden);
      const depth = (m) => (m === 'menu' ? 0 : m === 'products' || m === 'recursos' ? 1 : 2);
      if (from && to && from !== to) {
        this.#slideLevel(from, to, depth(mode) > depth(previous), fromTop);
        this.#resizeMenu(menu, heightBefore);
      }
    }
    if (sub) this.#renderSub(mode);
    if (mode === 'products') {
      this.#ensureNavigation();
      // Volviendo de un submenú, el foco va a su fila; si no, a «volver»
      const row = SUBMENUS.includes(previous) && root.querySelector(`.groups [data-sub="${previous}"]`);
      requestAnimationFrame(() => (row || root.querySelector('.back')).focus());
    } else if (mode === 'recursos') {
      requestAnimationFrame(() => root.querySelector('.back-recursos').focus());
    } else if (sub) {
      requestAnimationFrame(() => root.querySelector('.back-sub').focus());
    } else if (mode === 'menu' && (previous === 'products' || previous === 'recursos')) {
      requestAnimationFrame(() => this.#dropdown(previous)?.focus());
    }
    if (mode !== 'search') {
      root.querySelector('.search-screen').open = false;
      root.querySelector('.search-sheet').open = false;
    }
    this.#syncLinks();
  }

  // Lo que se abre desde la barra (mega-menu y su scrim, top sheet, menú
  // mobile) arranca donde está la barra: con announcement-bar a la vista,
  // debajo de ella, que sigue visible y sin scrim. Se mide al abrir: con el
  // panel abierto la página no se desplaza.
  #syncTop() {
    const root = this.shadowRoot;
    const top = `${Math.max(0, root.querySelector('.bar').getBoundingClientRect().top)}px`;
    root.querySelector('.navbar').style.setProperty('--bar-top', top);
    root.querySelector('.menu').style.setProperty('--bar-top', top);
    root.querySelector('.search-sheet').style.setProperty('--sheet-top', top);
  }

  // search="sheet" (por defecto): la búsqueda es el top sheet, en todos los anchos
  get #sheetSearch() {
    return this.search === 'sheet';
  }

  #menuOpener = null;
  #scrolled = false;
  #megaOpen = false;

  #menuTimer = 0;
  #levelAnimations = [];
  #levelPair = null; // el último cambio de nivel: { from, to }

  #menuResizeTimer = 0;

  // Alto que se ve ahora del panel del menú (con un cambio de alto en curso, el
  // que dejó el recorte).
  #menuVisibleHeight(menu) {
    const total = menu.getBoundingClientRect().height;
    const bottom = Number.parseFloat(menu.style.clipPath.match(/inset\(0px 0px ([\d.]+)px/)?.[1] ?? menu.style.clipPath.match(/inset\(0 0 ([\d.]+)px/)?.[1]) || 0;
    return Math.max(0, total - bottom);
  }

  // El panel crece (o se achica) hasta el alto del nivel nuevo con el mismo
  // recorte de la persiana (clip-path, motion/duration/panel), sin animar el
  // alto: al entrar a Productos o a un submenú se descubre lo que falta, y al
  // volver se recorta lo que sobra (el panel mantiene su alto hasta terminar).
  // Con reduced motion (duración 0) cambia de golpe.
  #resizeMenu(menu, before) {
    this.#finishMenuResize(menu);
    const after = menu.getBoundingClientRect().height;
    if (!before || Math.abs(after - before) < 1 || !this.#ms('panel')) return;
    const set = (clipPath, minHeight = '') => {
      menu.style.transition = 'none';
      menu.style.minHeight = minHeight;
      menu.style.clipPath = clipPath;
      void menu.offsetHeight;
      menu.style.transition = '';
    };
    if (after > before) {
      set(`inset(0 0 ${after - before}px 0)`);
      menu.style.clipPath = 'inset(0)';
    } else {
      set('inset(0)', `${before}px`);
      menu.style.clipPath = `inset(0 0 ${before - after}px 0)`;
    }
    this.#menuResizeTimer = setTimeout(() => this.#finishMenuResize(menu), this.#ms('panel'));
  }

  // Termina un cambio de alto en curso: suelta el recorte y el alto mínimo.
  #finishMenuResize(menu) {
    clearTimeout(this.#menuResizeTimer);
    if (!menu.style.clipPath && !menu.style.minHeight) return;
    menu.style.transition = 'none';
    menu.style.clipPath = '';
    menu.style.minHeight = '';
    void menu.offsetHeight;
    menu.style.transition = '';
  }

  // Cierra el menú mobile al revés de como abrió (la persiana sube) y recién
  // al terminar cierra el diálogo y devuelve el foco.
  #closeMenu(menu) {
    this.#finishMenuResize(menu);
    menu.classList.remove('is-open');
    const { transitionDuration } = getComputedStyle(menu);
    const ms = Math.max(0, ...transitionDuration.split(',').map((value) => (parseFloat(value) || 0) * (/ms\s*$/.test(value) ? 1 : 1000)));
    clearTimeout(this.#menuTimer);
    this.#menuTimer = setTimeout(() => {
      if (menu.classList.contains('is-open')) return;
      menu.close();
      this.#menuOpener?.focus();
    }, ms);
  }

  // Cambio de nivel del menú mobile (Menú → Productos → submenú, y al volver):
  // el que sale se corre hacia un lado y se desvanece mientras el nuevo entra
  // desde el otro, los dos a la vez (motion/duration/panel +
  // motion/easing/standard). Con reduced motion, solo un fundido
  // (motion/duration/fade).
  #slideLevel(from, to, forward, fromTop) {
    // Volver al nivel anterior mientras el cambio todavía corre (tocar
    // «volver» enseguida): las dos animaciones se dan vuelta desde donde están,
    // en vez de saltar al final y arrancar de nuevo.
    const [runningOut, runningEnter] = this.#levelAnimations;
    const running = this.#levelAnimations.length === 2 && this.#levelAnimations.every((animation) => animation.playState === 'running');
    if (running && this.#levelPair?.from === to && this.#levelPair?.to === from) {
      for (const property of ['position', 'top', 'left', 'right']) to.style.removeProperty(property);
      to.inert = false;
      from.hidden = false;
      from.inert = true;
      Object.assign(from.style, { position: 'absolute', top: `${fromTop}px`, left: '0', right: '0' });
      runningOut.reverse();
      runningEnter.reverse();
      this.#levelPair = { from, to };
      const settle = () => this.#settleLevel(from);
      runningEnter.finished.then(settle, settle);
      return;
    }
    for (const animation of this.#levelAnimations) animation.finish();
    this.#levelPair = { from, to };
    const styles = getComputedStyle(this);
    const easing = styles.getPropertyValue('--arq-motion-easing-standard').trim() || 'ease';
    const duration = toMs(styles.getPropertyValue('--arq-motion-duration-panel')) || 0;
    if (!duration) {
      const fade = toMs(styles.getPropertyValue('--arq-motion-duration-fade')) || 0;
      this.#levelAnimations = [to.animate([{ opacity: 0 }, { opacity: 1 }], { duration: fade, easing })];
      return;
    }
    // El que sale queda a la vista encima, en el mismo lugar, sin ocupar espacio
    from.hidden = false;
    from.inert = true;
    Object.assign(from.style, { position: 'absolute', top: `${fromTop}px`, left: '0', right: '0' });
    const shift = (sign) => `calc(${sign} * var(--arq-space-gap-4xl)) 0`;
    const options = { duration, easing };
    const out = from.animate([{ translate: '0 0', opacity: 1 }, { translate: shift(forward ? -1 : 1), opacity: 0 }], options);
    const enter = to.animate([{ translate: shift(forward ? 1 : -1), opacity: 0 }, { translate: '0 0', opacity: 1 }], options);
    this.#levelAnimations = [out, enter];
    const done = () => this.#settleLevel(from);
    out.finished.then(done, done);
  }

  // Al terminar un cambio de nivel: el que salió vuelve al flujo y se oculta,
  // salvo que mientras tanto haya vuelto a ser el nivel actual.
  #settleLevel(level) {
    for (const property of ['position', 'top', 'left', 'right']) level.style.removeProperty(property);
    level.inert = false;
    const current = { menu: '.menu-main', products: '.menu-products', recursos: '.menu-recursos' }[this.mode] ?? (SUBMENUS.includes(this.mode) ? '.menu-sub' : null);
    level.hidden = !(current && level.matches(current));
  }

  #closeAll() {
    if (this.mode !== 'default') this.#setMode('default');
    this.#toggleMega(false);
  }

  #megaTimer = 0;
  #megaWhich = 'products';
  // Con teclado: el foco entra al panel (la pestaña elegida del
  // mega-menu o el primer link de Recursos). Si la navegación todavía no
  // llegó, espera a que llegue.
  #focusPanel(which) {
    const focus = () => {
      if (!this.#megaOpen || this.#megaWhich !== which) return;
      const root = this.shadowRoot;
      const target =
        which === 'recursos'
          ? root.querySelector('.recursos-links arq-mega-link')
          : root.querySelector('.mega').shadowRoot?.querySelector('arq-tab[selected]') ?? root.querySelector('.mega').shadowRoot?.querySelector('arq-tab');
      target?.focus();
    };
    if (which === 'products' && !this.#navigation && this.#loadingNavigation) this.#loadingNavigation.then(() => requestAnimationFrame(focus));
    else requestAnimationFrame(focus);
  }

  // Duración de un token motion/duration/<name>, en ms
  #ms(name) {
    const value = getComputedStyle(this).getPropertyValue(`--arq-motion-duration-${name}`).trim();
    return toMs(value) || 0;
  }

  #swapTimer = 0;

  // De Productos a Recursos (o al revés) con el panel abierto. Los dos ocupan
  // la misma celda: el que sale se desvanece mientras el que entra aparece
  // (fundido cruzado, sobre el fondo fijo del drawer) y el alto visible va del
  // de uno al del otro con el mismo recorte de la persiana (clip-path, en
  // --mega-in, motion/duration/panel), sin animar height. Al terminar, el que sale se
  // oculta y el drawer ya mide lo del nuevo.
  #swapPanels(incoming, outgoing) {
    const drawer = this.shadowRoot.querySelector('.mega-drawer');
    const visible = this.#visibleHeight(drawer); // antes de soltar un cambio en curso
    this.#finishSwap();
    incoming.classList.remove('leaving');
    incoming.hidden = false;
    outgoing.classList.add('leaving');
    const total = drawer.getBoundingClientRect().height;
    const target = incoming.getBoundingClientRect().height;
    drawer.style.transition = 'none';
    drawer.style.clipPath = `inset(0 0 ${Math.max(0, total - visible)}px 0)`;
    void drawer.offsetHeight;
    drawer.style.transition = '';
    drawer.style.clipPath = `inset(0 0 ${Math.max(0, total - target)}px 0)`;
    this.#swapTimer = setTimeout(() => this.#finishSwap(), Math.max(this.#ms('panel'), this.#ms('fade')));
  }

  // Termina un cambio en curso: oculta el que sale y suelta el recorte.
  #finishSwap() {
    clearTimeout(this.#swapTimer);
    const root = this.shadowRoot;
    for (const leaving of root.querySelectorAll('.mega-drawer > .leaving')) {
      leaving.hidden = true;
      leaving.classList.remove('leaving');
    }
    const drawer = root.querySelector('.mega-drawer');
    if (!drawer.style.clipPath) return;
    drawer.style.transition = 'none';
    drawer.style.clipPath = '';
    void drawer.offsetHeight;
    drawer.style.transition = '';
  }

  // Alto que se ve del drawer ahora (descuenta el recorte inferior, también a mitad de una transición)
  #visibleHeight(drawer) {
    const values = /inset\(([^)]*)\)/.exec(getComputedStyle(drawer).clipPath)?.[1].trim().split(/\s+/).map(parseFloat) ?? [0];
    const bottom = values.length >= 3 ? values[2] : values[0];
    return drawer.getBoundingClientRect().height - (bottom || 0);
  }

  // Misma transición que el top sheet: la barra pasa a sólida y clara (Light
  // local, también con Iluminar) y el panel se abre como una persiana.
  // which: 'products' (mega-menu) o 'recursos'.
  #toggleMega(open, which = 'products', tab) {
    const root = this.shadowRoot;
    const wrap = root.querySelector('.mega-wrap');
    const navbar = root.querySelector('.navbar');
    const next = Boolean(open) && !MOBILE.matches;
    if (next && which === 'products') this.#ensureNavigation();
    if (next && this.mode === 'search') this.#setMode('default');
    if (next) this.#megaWhich = which;
    const kind = next ? which : this.#megaWhich;
    for (const link of this.querySelectorAll('arq-nav-link[has-dropdown]')) {
      link.open = next && (link.dataset.menu || 'products') === kind;
    }
    // Al abrir o cambiar de panel. Al cerrar no se ocultan: se desvanecen
    // mientras la persiana se cierra y el wrap se oculta al final.
    if (next) {
      const incoming = root.querySelector(kind === 'products' ? '.mega' : '.recursos');
      const outgoing = root.querySelector(kind === 'products' ? '.recursos' : '.mega');
      if (this.#megaOpen && !outgoing.hidden && !outgoing.classList.contains('leaving')) {
        this.#swapPanels(incoming, outgoing);
      } else if (!this.#megaOpen) {
        this.#finishSwap();
        incoming.hidden = false;
        outgoing.hidden = true;
      }
    } else {
      this.#finishSwap();
    }
    if (next && kind === 'products') root.querySelector('.mega').reset(tab); // la pestaña pedida o la primera, con su preview inicial (Colgante)
    if (next && kind === 'recursos') this.#showRecursosPhoto(location.pathname.includes('/descargas') ? '/descargas' : '/catalogos');
    if (next !== this.#megaOpen) {
      clearTimeout(this.#megaTimer);
      if (next) {
        wrap.hidden = false;
        void wrap.offsetHeight; // fija el estado inicial antes de is-open
      }
      navbar.classList.add('mega-motion');
      if (next) this.#syncTop();
      if (next) navbar.setAttribute('data-arq-theme', 'light');
      else navbar.removeAttribute('data-arq-theme');
      wrap.classList.toggle('is-open', next);
      navbar.classList.toggle('mega-open', next);
      const { transitionDuration } = getComputedStyle(root.querySelector('.mega-drawer'));
      const ms = Math.max(0, ...transitionDuration.split(',').map((value) => (parseFloat(value) || 0) * (/mss*$/.test(value) ? 1 : 1000)));
      this.#megaTimer = setTimeout(() => {
        navbar.classList.remove('mega-motion');
        if (!this.#megaOpen) wrap.hidden = true;
      }, ms);
    }
    this.#megaOpen = next;
    this.#syncLinks();
  }

  // Abre el menú de Productos en una pestaña: el mega-menu en Desktop; en Mobile, el menú
  // directo en ese submenú. Con el menú ya abierto cambia de pestaña.
  #openMenu(tab) {
    this.#ensureNavigation();
    if (MOBILE.matches) {
      if (SUBMENUS.includes(tab)) this.#setMode(tab);
    } else {
      this.#toggleMega(true, 'products', tab);
    }
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
    // Products Mobile: una fila por submenú con datos
    root.querySelector('.groups').innerHTML = SUBMENUS.map((id) => ({ id, label: this.#subLabel(id) }))
      .filter((s) => s.label)
      .map((s) => `<arq-mega-link submenu data-sub="${s.id}">${esc(s.label)}</arq-mega-link>`)
      .join('');
    if (SUBMENUS.includes(this.mode)) this.#renderSub(this.mode);
  }

  // Nombre del submenú; vacío si no tiene datos
  #subLabel(id) {
    const nav = this.#navigation;
    if (id === 'colecciones') return nav?.collections?.length ? 'Colecciones' : '';
    return nav?.sections?.[id]?.label ?? '';
  }

  // Submenú Mobile: «volver» con el nombre del nivel, links en mega-link
  // Size=Large y "Ver todo…" al pie (Colecciones: con miniatura y "Ver todo"
  // sin flecha, frame 2295:23605).
  #renderSub(id) {
    const root = this.shadowRoot;
    const nav = this.#navigation;
    const box = root.querySelector('.menu-sub');
    box.classList.toggle('menu-sub--colecciones', id === 'colecciones');
    root.querySelector('.sub-label').textContent = this.#subLabel(id);
    let links = '';
    let cta = '';
    if (id === 'colecciones') {
      links = (nav?.collections ?? [])
        .map(
          (c) => {
            // Miniatura de layout/mega-link-thumb (80 px): se pide chica (240 = 3x), no a 800 px; la primera vez tarda menos
            const photos = [c.image, ...(c.fallbacks ?? []), c.thumb].filter(Boolean).map((src) => sizedImage(src, THUMB_WIDTH));
            const [photo, ...rest] = [...new Set(photos)];
            return (
              `<arq-mega-link size="large" show-image href="${esc(c.href)}"${photo ? ` image="${esc(photo)}"` : ''}${rest.length ? ` fallbacks="${esc(JSON.stringify(rest))}"` : ''}>${esc(c.label)}` +
              `<span slot="meta">${esc(c.meta)}</span></arq-mega-link>`
            );
          },
        )
        .join('');
    } else {
      const section = nav?.sections?.[id];
      links = (section?.links ?? []).map((l) => `<arq-mega-link size="large" href="${esc(l.href)}">${esc(l.label)}</arq-mega-link>`).join('');
      if (section) cta = `<arq-button type="underline" show-underline show-icon icon="arrow-right" href="${esc(section.all.href)}">${esc(section.all.label)}</arq-button>`;
    }
    root.querySelector('.sub-list').innerHTML = links;
    root.querySelector('.sub-cta').innerHTML = cta;
    root.querySelector('.sub-list').scrollTop = 0;
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
        if (query === this.#query) this.#renderResults([], 0, true);
      }
    }, DEBOUNCE);
  }

  // error: la búsqueda falló (search-dropdown State=error, solo de código)
  #renderResults(results, total, error = false) {
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
    const emptyState = error ? 'error' : 'no-results';
    // Desktop: dropdown debajo del campo
    const dropdown = root.querySelector('.search-dropdown');
    dropdown.state = noResults ? emptyState : 'results';
    dropdown.term = query;
    dropdown.innerHTML = rows;
    this.#showResults(Boolean(query));
    // Mobile: dentro de search-screen
    const screen = root.querySelector('.search-screen');
    screen.innerHTML = noResults ? `<arq-search-dropdown state="${emptyState}" term="${esc(query)}"></arq-search-dropdown>` : rows;
    // Sheet: arma sus grupos (productos y colecciones) con los resultados
    root.querySelector('.search-sheet').results = { query, items: results, total, href: searchHref(query), error };
    this.#announce();
    // Lectores de pantalla: cuántos resultados hay, ninguno o el error. total
    // cuenta solo productos: se suman las colecciones que se ven.
    const count = total + results.filter((r) => r.kind === 'collection').length;
    const status = !query
      ? ''
      : error
        ? 'No se pudo completar la búsqueda.'
        : results.length
          ? `${count.toLocaleString('es-AR')} ${count === 1 ? 'resultado' : 'resultados'}`
          : `No encontramos resultados para «${query}»`;
    for (const field of this.#fields()) {
      field.status = status;
      field.expanded = results.length > 0;
    }
    root.querySelector('.search-field').expanded = !dropdown.hidden;
  }

  // Los tres campos de búsqueda: barra (search="inline"), search-screen y sheet
  #fields() {
    const root = this.shadowRoot;
    return [root.querySelector('.search-field'), root.querySelector('.search-screen').field, root.querySelector('.search-sheet').field];
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
    this.#syncTop();
    sheet.show(opener);
  }

  #showResults(show) {
    this.shadowRoot.querySelector('.search-dropdown').hidden = !show;
    this.shadowRoot.querySelector('.search-field').expanded = show;
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
    for (const field of this.#fields()) field.activeLabel = label;
  }

  #submit(value) {
    const active = this.#resultElements()[this.#active];
    if (active) active.click();
    else if (value.trim()) location.assign(searchHref(value.trim()));
  }
}

ArqNavbar.define();

export { ArqNavbar };
