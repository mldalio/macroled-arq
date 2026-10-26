// search-sheet · COMPONENTE DE PRUEBA (no existe en Figma)
//
// Búsqueda del sitio como top sheet: un panel que baja desde arriba, a todo el
// ancho, sobre la página con scrim. Arriba la barra (logo + cerrar), después el
// search-field Type=Line y debajo el contenido según el estado. Es la búsqueda
// del navbar en Desktop, Tablet y Mobile.
//
//   <arq-search-sheet></arq-search-sheet>
//   sheet.recommended = [{ name, href, image }];
//   sheet.results = { query, items: [{ kind, name, href, image }], total, href };
//   sheet.show(opener) · sheet.close()
//   <arq-search-sheet inline></arq-search-sheet>   <!-- sin modal, para la demo -->
//
// - State (no es prop: sale de los datos):
//   · recommended: campo vacío (results en null). search-card (imagen cuadrada y nombre) en una
//     fila con scroll + button Underline «Ver todos los productos» (all-href /
//     all-label).
//   · results: results.items con coincidencias. Dos grupos: Productos
//     (search-result Type=Simple: miniatura y nombre) y Colecciones
//     (search-collection), más search-see-all (results.href).
//   · no-results: results.items vacío (search-dropdown No results).
//   · error: results.error en true, la búsqueda falló (search-dropdown
//     State=Error).
// - Los títulos de grupo (Productos, Colecciones) no son encabezados: el
//   componente no crea h1–h6 (AGENTS.md). Cada grupo es role="group" con el
//   título como nombre (aria-labelledby).
// - Diálogo modal nativo (<dialog> + showModal): el foco arranca en el campo y
//   queda adentro; Esc, la cruz o un clic en el scrim cierran (arq:close) y el
//   foco vuelve a opener. La página de atrás no se desplaza (scroll-lock).
// - Transición en capas, de menos de medio segundo (tokens de movimiento, que
//   con prefers-reduced-motion valen 0). Al abrir: la barra pasa de transparente
//   a sólida; el panel se descubre como una persiana (un recorte, clip-path,
//   sin animar el alto); el campo y el contenido bajan un poco mientras se hacen visibles; los
//   productos llegan un instante después, con un fundido y un movimiento corto
//   hacia abajo; y la página de atrás se aclara a medias con un velo claro. Al
//   cerrar pasa lo mismo al revés (close() espera a que termine y recién ahí
//   cierra el diálogo). Detalle en search-sheet.css.
// - over-photo: lo pone el navbar cuando la barra estaba transparente sobre la
//   foto del hero: el logo y la cruz arrancan en inverso y pasan a primary a
//   medida que la barra se vuelve sólida.
// - inline: el panel queda en el flujo, abierto y sin scrim ni animación. Solo
//   para mostrarlo en la demo (demo/search-sheet.html).
// - Los eventos del campo (arq:input, arq:submit, arq:navigate) salen del
//   componente; field devuelve el search-field e items los resultados en
//   orden (para moverse con ↑ / ↓).
// - Responsive por media query (como el resto): Desktop desde 1024 px, Tablet
//   768–1023 y Mobile hasta 767. TODO (diseño): diseñar los tres en Figma.

import { ArqElement } from '../../base/arq-element.js';
import { containScroll } from '../../base/scroll-lock.js';
import { setPanelBar } from '../../base/theme.js';
import '../logo/logo.js';
import '../icon-button/icon-button.js';
import '../carousel-button/carousel-button.js';
import '../button/button.js';
import '../search-field/search-field.js';
import '../search-result/search-result.js';
import '../search-collection/search-collection.js';
import '../search-see-all/search-see-all.js';
import '../search-dropdown/search-dropdown.js';
import '../search-card/search-card.js';
import css from './search-sheet.css?inline';

const MOBILE = matchMedia('(max-width: 767px)');
const esc = (text) => String(text ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const imageAttr = (item) => (item.image ? ` image="${esc(item.image)}"` : '');

class ArqSearchSheet extends ArqElement {
  static tag = 'arq-search-sheet';
  static styles = css;
  static properties = {
    open: { type: Boolean },
    inline: { type: Boolean }, // abierto y en el flujo (demo)
    label: { type: String, default: 'Buscar' }, // nombre del diálogo
    recommendedTitle: { type: String, default: 'Productos recomendados' },
    allHref: { type: String, default: '/arq/productos' },
    allLabel: { type: String, default: 'Ver todos los productos' },
    placeholder: { type: String, default: 'Buscar productos…' },
  };
  static template =
    `<dialog class="dialog">` +
    `<div class="sheet">` +
    `<div class="bar">` +
    `<arq-logo class="logo"></arq-logo>` +
    `<arq-icon-button class="close" icon="close" size="large" background="none">Cerrar búsqueda</arq-icon-button>` +
    `</div>` +
    `<div class="drawer"><div class="drawer-inner">` +
    `<div class="field-row"><arq-search-field class="field" type="line" size="large" show-clear combobox></arq-search-field></div>` +
    `<div class="content">` +
    `<div class="recommended">` +
    `<p class="title role-label"></p>` +
    `<div class="cards-wrap"><div class="cards"></div>` +
    `<arq-carousel-button class="rail-arrow rail-prev" direction="previous" background="frosted" hidden>Productos anteriores</arq-carousel-button>` +
    `<arq-carousel-button class="rail-arrow rail-next" direction="next" background="frosted" hidden>Productos siguientes</arq-carousel-button></div>` +
    `</div>` +
    `<div class="results"></div>` +
    `</div>` +
    `<div class="all" hidden><arq-button class="all-button" type="underline" show-underline show-icon icon="arrow-right"></arq-button></div>` +
    `</div></div>` +
    `</div>` +
    `</dialog>`;

  #dialog = null;
  #opener = null;
  #closing = null; // timer del cierre animado
  #recommended = [];
  #results = null;

  get field() {
    return this.shadowRoot.querySelector('arq-search-field');
  }

  /** Productos recomendados (campo vacío): [{ name, href, image }]. */
  get recommended() {
    return this.#recommended;
  }

  set recommended(cards) {
    this.#recommended = cards ?? [];
    if (this.shadowRoot) this.#renderRecommended();
  }

  /** Resultados de la búsqueda: { query, items: [{ kind: 'product' | 'collection', name, href, image }], total, href, error? }. null con el campo vacío. */
  get results() {
    return this.#results;
  }

  set results(value) {
    this.#results = value?.query ? value : null;
    // Mientras el sheet se cierra no se redibuja (los resultados no saltan a los recomendados)
    if (this.shadowRoot && !this.#closing) this.#renderResults();
  }

  /** Los resultados (productos y colecciones) en el orden en que se ven. */
  get items() {
    return [...this.shadowRoot.querySelectorAll('.results arq-search-result, .results arq-search-collection')];
  }

  setup() {
    const root = this.shadowRoot;
    const cards = root.querySelector('.cards');
    cards.addEventListener('scroll', () => this.#syncRecommendedControls(), { passive: true });
    cards.addEventListener('dragstart', event => event.preventDefault());
    root.querySelector('.rail-prev').addEventListener('click', () => this.#scrollRecommended(-1));
    root.querySelector('.rail-next').addEventListener('click', () => this.#scrollRecommended(1));
    this.#dialog = root.querySelector('dialog');
    root.querySelector('.close').addEventListener('click', () => this.close());
    // Logo Default en Desktop y Small en Mobile (como el navbar)
    const syncLogo = () => (root.querySelector('.logo').size = MOBILE.matches ? 'small' : 'default');
    MOBILE.addEventListener('change', syncLogo);
    syncLogo();
    if (this.inline) {
      this.#dialog.show();
      this.#dialog.classList.add('is-open'); // ya abierto: sin transición
    } else {
      containScroll(this.#dialog);
      this.#dialog.addEventListener('close', () => setPanelBar(false));
      this.#dialog.addEventListener('cancel', (event) => {
        event.preventDefault();
        this.close();
      });
      // Clic en el scrim: el <dialog> ocupa todo el ancho y el panel es su único
      // hijo, así que un clic cuyo destino es el <dialog> cayó fuera del panel.
      this.#dialog.addEventListener('click', (event) => {
        if (event.target === this.#dialog) this.close();
      });
    }
    this.#renderRecommended();
    this.#renderResults();
    window.addEventListener('resize', () => this.#fit());
    // Teclado del teléfono: iOS no achica dvh al abrirlo y tapaba los últimos
    // resultados. --keyboard-inset suma ese alto al pie del contenido.
    window.visualViewport?.addEventListener('resize', () => {
      const viewport = window.visualViewport;
      const inset = Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop);
      this.style.setProperty('--keyboard-inset', `${Math.round(inset)}px`);
    });
  }

  #recommendedResize = new ResizeObserver(() => this.#syncRecommendedControls());
  connectedCallback() {
    super.connectedCallback();
    this.#watchRecommended();
  }
  disconnectedCallback() {
    this.#recommendedResize.disconnect();
  }

  #watchRecommended() {
    this.#recommendedResize.disconnect();
    const cards = this.shadowRoot.querySelector('.cards');
    this.#recommendedResize.observe(cards);
    if (cards.firstElementChild) this.#recommendedResize.observe(cards.firstElementChild);
    this.#syncRecommendedControls();
  }

  #syncRecommendedControls() {
    const root = this.shadowRoot;
    const cards = root.querySelector('.cards');
    const max = cards.scrollWidth - cards.clientWidth;
    const prev = root.querySelector('.rail-prev');
    const next = root.querySelector('.rail-next');
    const states = [
      [prev, !cards.firstElementChild || max <= 1 || cards.scrollLeft <= 1, cards.firstElementChild],
      [next, !cards.firstElementChild || max - cards.scrollLeft <= 1, cards.lastElementChild],
    ];
    for (const [button, unavailable, fallback] of states) {
      if (unavailable && root.activeElement === button) fallback?.focus();
      button.toggleAttribute('data-arq-unavailable', unavailable);
      button.inert = unavailable;
      button.setAttribute('aria-hidden', String(unavailable));
      // El CSS completa el fundido antes de ocultarlo visualmente.
      button.hidden = false;
    }
    const media = cards.firstElementChild?.shadowRoot?.querySelector('.media');
    if (media) root.querySelector('.cards-wrap').style.setProperty('--arq-search-arrow-top', `${media.getBoundingClientRect().height / 2}px`);
  }

  #scrollRecommended(direction) {
    const cards = this.shadowRoot.querySelector('.cards');
    const item = cards.firstElementChild;
    if (!item) return;
    const gap = parseFloat(getComputedStyle(cards).columnGap) || 0;
    cards.scrollBy({
      left: direction * (item.getBoundingClientRect().width + gap),
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  }

  update(changed) {
    const root = this.shadowRoot;
    if (changed.has('label')) this.#dialog.setAttribute('aria-label', this.label ?? '');
    if (changed.has('recommendedTitle')) root.querySelector('.title').textContent = this.recommendedTitle ?? '';
    if (changed.has('allHref') || changed.has('allLabel')) {
      const all = root.querySelector('.all-button');
      all.setAttribute('href', this.allHref ?? '/arq/productos');
      all.textContent = this.allLabel ?? '';
    }
    if (changed.has('placeholder')) this.field.placeholder = this.placeholder ?? '';
    if (changed.has('open') && !this.inline) {
      if (this.open) this.#reveal();
      else this.#hide();
    }
  }

  // Abre: showModal con todo en su estado inicial y, ya pintado, is-open (las
  // transiciones hacen el resto). Si se reabre mientras se cierra, vuelve a abrir.
  #reveal() {
    clearTimeout(this.#closing);
    this.#closing = null;
    const dialog = this.#dialog;
    if (!dialog.open) {
      dialog.showModal();
      // Con Iluminar, la barra del navegador pasa al color del panel (Light)
      setPanelBar(true, dialog);
      void dialog.offsetHeight; // fija el estado inicial antes de is-open
      this.#fit();
      requestAnimationFrame(() => this.field.focus({ preventScroll: true }));
    }
    dialog.classList.add('is-open');
  }

  // Cierra al revés: saca is-open y, cuando terminan las transiciones, cierra el diálogo.
  #hide() {
    const dialog = this.#dialog;
    if (!dialog.open || this.#closing) return;
    dialog.classList.remove('is-open');
    this.#closing = setTimeout(() => {
      this.#closing = null;
      dialog.close();
      this.#opener?.focus?.();
      this.#opener = null;
      this.#renderResults();
    }, this.#duration());
  }

  // Lo que dura la transición más larga (la de la persiana, en .drawer; 0 con reduced motion), en ms
  #duration() {
    const { transitionDuration } = getComputedStyle(this.shadowRoot.querySelector('.drawer'));
    return Math.max(0, ...transitionDuration.split(',').map((value) => (parseFloat(value) || 0) * (/mss*$/.test(value) ? 1 : 1000)));
  }

  /** Abre el sheet. El foco vuelve a opener al cerrar. */
  show(opener = null) {
    this.#opener = opener;
    this.open = true;
  }

  /** Cierra el sheet y emite arq:close. */
  close() {
    if (!this.open) return;
    this.open = false;
    this.emit('close');
  }

  #renderRecommended() {
    const root = this.shadowRoot;
    const cards = root.querySelector('.cards');
    cards.replaceChildren(
      ...this.#recommended.map(({ name, href, image }) => {
        const card = document.createElement('arq-search-card');
        Object.assign(card, { href, image });
        card.textContent = name;
        return card;
      }),
    );
    // Sin recomendados no se muestra el bloque (ni el título ni el link)
    root.querySelector('.recommended').dataset.empty = String(this.#recommended.length === 0);
    if (this.isConnected) this.#watchRecommended();
    this.#syncAll();
    this.#fit();
  }

  // El panel nunca scrollea: si los recomendados no entran en el alto de la
  // pantalla, se suman columnas (--cols de search-sheet.css): las tarjetas se
  // achican y siguen cuadradas. Se mide con el panel abierto. Si todas las
  // tarjetas entran en las columnas, no hay scroll ni tarjeta asomando.
  #fit() {
    if (!this.#dialog?.open) return;
    const root = this.shadowRoot;
    const cards = root.querySelector('.cards');
    const content = root.querySelector('.content');
    cards.style.removeProperty('--cols');
    const base = parseInt(getComputedStyle(cards).getPropertyValue('--cols'), 10) || 4;
    const count = cards.children.length;
    for (let cols = base; cols <= base + 3; cols++) {
      cards.style.setProperty('--cols', String(cols));
      cards.dataset.scroll = String(count > cols);
      if (content.scrollHeight - content.clientHeight <= 0) break;
    }
  }

  // "Ver todos los productos" va fuera del scroll, al pie: solo con recomendados
  #syncAll() {
    this.shadowRoot.querySelector('.all').hidden = Boolean(this.#results) || this.#recommended.length === 0;
  }

  #renderResults() {
    const root = this.shadowRoot;
    const results = this.#results;
    const container = root.querySelector('.results');
    root.querySelector('.recommended').hidden = Boolean(results);
    this.#syncAll();
    container.hidden = !results;
    if (!results) {
      container.replaceChildren();
      return;
    }
    const items = results.items ?? [];
    const products = items.filter((r) => r.kind !== 'collection');
    const collections = items.filter((r) => r.kind === 'collection');
    const seeAll = `<arq-search-see-all type="simple" href="${esc(results.href)}" term="${esc(results.query)}" count="${results.total ?? items.length}"></arq-search-see-all>`;
    const term = esc(results.query);
    const product = (r) => `<arq-search-result type="simple" term="${term}" href="${esc(r.href)}"${imageAttr(r)}>${esc(r.name)}</arq-search-result>`;
    const collection = (r) => `<arq-search-collection term="${term}" href="${esc(r.href)}"${imageAttr(r)}>${esc(r.name)}</arq-search-collection>`;
    container.classList.toggle('has-both', products.length > 0 && collections.length > 0);
    container.innerHTML = !items.length
      ? `<arq-search-dropdown state="${results.error ? 'error' : 'no-results'}" term="${esc(results.query)}"></arq-search-dropdown>`
      : (products.length ? `<div class="group" role="group" aria-labelledby="group-products"><p class="group-title role-label" id="group-products">Productos</p><div class="list">${products.map(product).join('')}</div></div>` : '') +
        (collections.length
          ? `<div class="group group-collections" role="group" aria-labelledby="group-collections"><p class="group-title role-label" id="group-collections">Colecciones</p><div class="collections">${collections.map(collection).join('')}</div></div>`
          : '') +
        // «Ver todos»: al final de los resultados (en Desktop, debajo de Productos)
        `<div class="see-all">${seeAll}</div>`;
  }
}

ArqSearchSheet.define();

export { ArqSearchSheet };
