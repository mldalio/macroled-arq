// search-sheet · COMPONENTE DE PRUEBA (no existe en Figma)
//
// Búsqueda del sitio como top sheet: un panel que baja desde arriba, a todo el
// ancho, sobre la página con scrim. Arriba la barra (logo + cerrar), después el
// search-field Type=Line y debajo el contenido según el estado. Es la búsqueda
// del navbar en Desktop, Tablet y Mobile.
//
//   <arq-search-sheet></arq-search-sheet>
//   sheet.recommended = [{ name, meta, href, image, imageHover, imageLit, imageHoverLit }];
//   sheet.results = { query, items: [{ kind, name, href, image }], total, href };
//   sheet.show(opener) · sheet.close()
//   <arq-search-sheet inline></arq-search-sheet>   <!-- sin modal, para la demo -->
//
// - State (no es prop: sale de los datos):
//   · recommended: campo vacío (results en null). Tarjetas de productos en una
//     fila con scroll + button Underline «Ver todos los productos» (all-href /
//     all-label).
//   · results: results.items con coincidencias. Dos grupos: Productos
//     (search-result Type=Simple: miniatura y nombre) y Colecciones
//     (search-collection), más search-see-all (results.href).
//   · no-results: results.items vacío (search-dropdown No results).
// - Diálogo modal nativo (<dialog> + showModal): el foco arranca en el campo y
//   queda adentro; Esc, la cruz o un clic en el scrim cierran (arq:close) y el
//   foco vuelve a opener. La página de atrás no se desplaza (scroll-lock).
// - Transición en capas, de menos de medio segundo (tokens de movimiento, que
//   con prefers-reduced-motion valen 0). Al abrir: la barra pasa de transparente
//   a sólida; el panel se despliega como una persiana (grid-template-rows 0fr →
//   1fr); el campo y el contenido bajan un poco mientras se hacen visibles; los
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
import '../logo/logo.js';
import '../icon-button/icon-button.js';
import '../button/button.js';
import '../search-field/search-field.js';
import '../search-result/search-result.js';
import '../search-collection/search-collection.js';
import '../search-see-all/search-see-all.js';
import '../search-dropdown/search-dropdown.js';
import '../product-card/product-card.js';
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
    `<div class="field-row"><arq-search-field class="field" type="line"></arq-search-field></div>` +
    `<div class="content">` +
    `<div class="recommended">` +
    `<p class="title role-label"></p>` +
    `<div class="cards"></div>` +
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

  /** Productos recomendados (campo vacío): [{ name, meta, href, image, imageHover, imageLit, imageHoverLit }]. */
  get recommended() {
    return this.#recommended;
  }

  set recommended(cards) {
    this.#recommended = cards ?? [];
    if (this.shadowRoot) this.#renderRecommended();
  }

  /** Resultados de la búsqueda: { query, items: [{ kind: 'product' | 'collection', name, href, image }], total, href }. null con el campo vacío. */
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

  // Lo que dura la transición más larga (la de la persiana; 0 con reduced motion), en ms
  #duration() {
    const { transitionDuration } = getComputedStyle(this.shadowRoot.querySelector('.sheet'));
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
      ...this.#recommended.map(({ name, meta, href, image, imageHover, imageLit, imageHoverLit }) => {
        const card = document.createElement('arq-product-card');
        Object.assign(card, { size: 'small', href, image, imageHover, imageLit, imageHoverLit });
        card.innerHTML = `<h3 slot="name">${esc(name)}</h3>${meta ? `<span slot="meta">${esc(meta)}</span>` : ''}`;
        return card;
      }),
    );
    // Sin recomendados no se muestra el bloque (ni el título ni el link)
    root.querySelector('.recommended').dataset.empty = String(this.#recommended.length === 0);
    this.#syncAll();
    this.#fit();
  }

  // El panel nunca scrollea: si los recomendados no entran en el alto de la
  // pantalla, la imagen de las cards se vuelve más ancha que alta (--card-ratio,
  // que lee search-sheet.css). El ancho de las cards no cambia: cuántas se ven
  // depende solo del ancho de la pantalla. Se mide con el panel abierto.
  #fit() {
    if (!this.#dialog?.open) return;
    const root = this.shadowRoot;
    const cards = root.querySelector('.cards');
    cards.style.removeProperty('--card-ratio');
    const content = root.querySelector('.content');
    let ratio = 1; // las cards parten de 1:1
    // Un par de pasadas: al cambiar la imagen, el texto y la fila se reacomodan
    for (let pass = 0; pass < 3; pass++) {
      const overflow = content.scrollHeight - content.clientHeight;
      const width = cards.firstElementChild?.getBoundingClientRect().width;
      if (overflow <= 0 || !width) break;
      const height = Math.max(1, width / ratio - overflow);
      ratio = width / height;
      cards.style.setProperty('--card-ratio', String(ratio));
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
      ? `<arq-search-dropdown state="no-results" term="${esc(results.query)}"></arq-search-dropdown>`
      : (products.length ? `<section class="group"><h3 class="group-title role-label">Productos</h3><div class="list">${products.map(product).join('')}</div>${seeAll}</section>` : '') +
        (collections.length
          ? `<section class="group"><h3 class="group-title role-label">Colecciones</h3><div class="collections">${collections.map(collection).join('')}</div>${products.length ? '' : seeAll}</section>`
          : '');
  }
}

ArqSearchSheet.define();

export { ArqSearchSheet };
