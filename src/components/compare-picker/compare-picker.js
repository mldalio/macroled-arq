// compare-picker · Figma 2724:8761 (sin ficha doc/compare-picker todavía)
//
// Modal «Agregar producto» de la comparativa. Lo abren el lugar vacío (+) de
// compare-bar (listados y ficha) y el compare-product vacío (y el «Agregar producto»
// de la cabecera compacta) en Comparativa. No consulta: la página le pasa los
// productos (src/data/catalog.js · listCompareCandidates) y agrega lo elegido.
//
//   <arq-compare-picker href="/arq/productos"></arq-compare-picker>
//   <arq-compare-picker><h2 slot="title">Agregar producto</h2></arq-compare-picker>
//
// - Título: «Agregar producto» por defecto; la página puede pasar su
//   encabezado por el slot title.
//
//   picker.addEventListener('arq:search', (e) => buscar(e.detail.query));
//   picker.addEventListener('arq:add', (e) => agregar(e.detail.item));
//   picker.items = [{ id, sku, name, meta, image, added }];
//   picker.showError();         // no se pudo cargar: error + «Reintentar» (emite arq:search)
//   picker.count = 2;           // productos ya elegidos (con 3, el resto queda Disabled)
//   boton.addEventListener('click', () => picker.show(boton));  // emite arq:search
//
// - Buscador (search-field Type=Line) por nombre, SKU o familia. Cada cambio
//   emite arq:search { query }; la página responde con items. Sin los
//   choice-chip de categoría del set (Todos · Interior · Exterior · Lámparas y
//   artefactos): se sacaron a pedido (decisiones.md, 2026-10-19 · compare-picker).
// - Lista de compare-picker-item: Added si ya está en la comparativa, con
//   «Quitar» (emite arq:remove { sku, item }; sku es el SKU que está en la
//   comparativa, item.selectedSku, que puede ser otro acabado del grupo; el
//   modal sigue abierto); Disabled si ya hay 3 (count). «Agregar» emite
//   arq:add { item, replace: null } y cierra el modal: la página muestra el
//   producto en su lugar y lo anuncia.
// - show(opener, { replace: sku }) abre «Cambiar producto»: las filas dicen
//   «Elegir» (ninguna queda Disabled) y lo elegido llega en
//   arq:add { item, replace: sku } para ponerlo en ese lugar. Si se quita ese
//   producto desde el modal, vuelve a «Agregar producto».
// - State=No results: solo el mensaje, sin CTA; se sigue buscando en el mismo
//   modal.
// - Al final, «Ver todos los productos» (button Underline con subrayado y
//   arrow-right): lleva al listado de Productos (href, por defecto
//   /arq/productos). En el set es «Comparar» (Filled).
// - Diálogo modal nativo, como download-modal: el foco queda adentro, Esc y el
//   scrim lo cierran, el foco vuelve a quien lo abrió y la página de atrás no
//   se desplaza. Al cerrar emite arq:close { restored, item }: restored es
//   false si el foco no pudo volver a quien lo abrió (ya no está o quedó
//   oculto); la página lo mueve (al producto elegido, item, si hay).
//   Desktop: centrado sobre el scrim, ancho layout/filter-panel.
//   Mobile: pantalla completa. Siempre en Light (DESIGN.md §2 · Light local).

import { ArqElement } from '../../base/arq-element.js';
import { containScroll } from '../../base/scroll-lock.js';
import { setPanelBar } from '../../base/theme.js';
import '../icon-button/icon-button.js';
import '../search-field/search-field.js';
import '../button/button.js';
import '../compare-picker-item/compare-picker-item.js';
import css from './compare-picker.css?inline';
import { transitionMs } from '../../base/motion.js';

const MAX = 3;
const FINE = matchMedia('(hover: hover) and (pointer: fine)');

const TEXT = {
  noResults: (query) => (query ? `No encontramos productos para «${query}».` : 'No encontramos productos.'),
  hint: 'Probá con otro nombre, SKU o familia.',
  count: (n) => (n === 1 ? '1 producto' : `${n.toLocaleString('es-AR')} productos`),
  removed: (name) => `${name} quitado de la comparación.`,
  title: (replace) => (replace ? 'Cambiar producto' : 'Agregar producto'),
  // Mismo texto que el error de los listados (catalog-listing) y «Reintentar»
  // como en Descargas (State=Error del set 2724:8761).
  error: 'No se pudieron cargar los productos.',
  errorHint: 'Probá de nuevo en unos minutos.',
  retry: 'Reintentar',
};

class ArqComparePicker extends ArqElement {
  static tag = 'arq-compare-picker';
  static styles = css;
  static properties = {
    open: { type: Boolean },
    href: { type: String, default: '/arq/productos' }, // «Ver todos los productos»
    count: { type: Number, default: 0 }, // productos ya elegidos
  };
  static template =
    `<dialog class="dialog" data-arq-theme="light">` +
    `<div class="sheet">` +
    `<div class="header">` +
    `<div class="title role-heading-2"><slot name="title">Agregar producto</slot></div>` +
    `<arq-icon-button icon="close" size="large" class="close">Cerrar</arq-icon-button>` +
    `</div>` +
    `<arq-search-field type="line" class="search" placeholder="Buscar por nombre, SKU o familia…" label="Buscar por nombre, SKU o familia"></arq-search-field>` +
    `<div class="list" role="list"></div>` +
    `<div class="empty" hidden>` +
    `<p class="empty-title role-body-regular"></p>` +
    `<p class="empty-hint role-body-compact">${TEXT.hint}</p>` +
    `<arq-button class="retry" type="underline" show-underline hidden>${TEXT.retry}</arq-button>` +
    `</div>` +
    `<div class="footer"><arq-button class="go" type="underline" show-underline show-icon icon="arrow-right">Ver todos los productos</arq-button></div>` +
    `<span class="visually-hidden" aria-live="polite"></span>` +
    `</div>` +
    `</dialog>`;

  #dialog = null;
  #opener = null;
  #closing = null;
  #items = [];
  #query = '';
  #searched = false;
  #failed = false;
  #replace = null; // SKU del lugar que se cambia (Cambiar producto)
  #chosen = null; // lo elegido antes de cerrar (va en arq:close)
  #refocus = null; // fila que tenía el foco mientras se rearma la lista

  /** Productos de la lista: [{ id, sku, name, meta, image, added }]. */
  get items() {
    return [...this.#items];
  }

  set items(list) {
    this.#items = Array.isArray(list) ? list.filter((item) => item && item.sku) : [];
    this.#failed = false;
    this.#render();
  }

  /** La lista no se pudo cargar: muestra el error y «Reintentar» (vuelve a emitir arq:search). */
  showError() {
    this.#items = [];
    this.#failed = true;
    this.#render();
  }

  /** Búsqueda actual: { query }. */
  get search() {
    return { query: this.#query };
  }

  setup() {
    const root = this.shadowRoot;
    this.#dialog = root.querySelector('dialog');
    containScroll(this.#dialog);
    this.#dialog.addEventListener('close', () => setPanelBar(false));
    root.querySelector('.close').addEventListener('click', () => this.close());
    // Scrim: el clic en el ::backdrop llega al <dialog> (el contenido está en .sheet).
    this.#dialog.addEventListener('click', (event) => {
      if (event.target === this.#dialog) this.close();
    });
    this.#dialog.addEventListener('cancel', (event) => {
      event.preventDefault();
      this.close();
    });
    // Esc en el buscador con texto: el campo type="search" lo borra y el
    // <dialog> no recibe cancel. En el modal, Esc siempre cierra.
    this.#dialog.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      this.close();
    });
    const search = root.querySelector('.search');
    search.addEventListener('arq:input', (event) => {
      event.stopPropagation();
      this.#query = event.detail.value.trim();
      this.#emitSearch();
    });
    search.addEventListener('arq:submit', (event) => event.stopPropagation());
    search.addEventListener('arq:navigate', (event) => event.stopPropagation());
    search.addEventListener('arq:close', (event) => event.stopPropagation());
    const list = root.querySelector('.list');
    // Elegir cierra el modal: el producto aparece en su lugar (la página lo
    // anuncia y le pasa el foco).
    list.addEventListener('arq:add', (event) => {
      event.stopPropagation();
      const item = this.#items.find((i) => i.sku === event.detail.sku);
      if (!item || item.added || (!this.#replace && this.count >= MAX)) return;
      this.#chosen = { ...item };
      this.emit('add', { item: { ...item }, replace: this.#replace });
      this.close();
    });
    // Quitar: el modal sigue abierto (la página rearma la lista)
    list.addEventListener('arq:remove', (event) => {
      event.stopPropagation();
      const item = this.#items.find((i) => i.sku === event.detail.sku);
      if (!item?.added) return;
      const sku = item.selectedSku ?? item.sku;
      if (this.#replace === sku) this.#setReplace(null);
      this.emit('remove', { sku, item: { ...item } });
      this.#announce(TEXT.removed(item.name));
    });
    root.querySelector('.retry').addEventListener('click', () => {
      root.querySelector('.search').focus();
      this.#emitSearch();
    });
    root.querySelector('slot[name="title"]').addEventListener('slotchange', () => this.#name());
    this.#name();
  }

  update(changed) {
    if (changed.has('count')) this.#render();
    this.shadowRoot.querySelector('.go').href = this.href ?? '/arq/productos';
    if (!changed.has('open')) return;
    if (this.open) this.#showDialog();
    else if (this.#dialog.open) this.#closeDialog();
  }

  /**
   * Abre el modal sin búsqueda y emite arq:search para que la página cargue
   * la lista. El foco vuelve a `opener` (o al elemento con foco) al cerrar.
   * Con `replace` (SKU), «Cambiar producto»: lo elegido reemplaza a ese SKU.
   */
  show(opener, { replace = null } = {}) {
    this.#opener = opener ?? this.#activeElement();
    if (!this.open) {
      this.#chosen = null;
      this.#setReplace(replace);
      const root = this.shadowRoot;
      this.#query = '';
      root.querySelector('.search').value = '';
      root.querySelector('.list').scrollTop = 0;
      this.#emitSearch({ announce: false });
    }
    this.open = true;
  }

  close() {
    this.open = false;
  }

  // Modo del modal: el título por defecto (si la página no pasa uno por el
  // slot) y el botón de las filas.
  #setReplace(sku) {
    this.#replace = sku ?? null;
    this.shadowRoot.querySelector('slot[name="title"]').textContent = TEXT.title(this.#replace);
    this.#name();
    this.#render();
  }

  #emitSearch({ announce = true } = {}) {
    this.#searched = announce;
    this.emit('search', this.search);
  }

  #render() {
    const root = this.shadowRoot;
    const list = root.querySelector('.list');
    if (!list) return;
    const full = (this.count ?? 0) >= MAX;
    const nodes = this.#items.map((item) => {
      const row = document.createElement('arq-compare-picker-item');
      row.sku = item.sku;
      row.added = Boolean(item.added);
      row.replace = Boolean(this.#replace);
      row.disabled = full && !item.added && !this.#replace;
      if (item.image) row.image = item.image;
      const name = document.createElement('span');
      name.slot = 'name';
      name.textContent = item.name ?? '';
      row.append(name);
      if (item.meta) {
        const meta = document.createElement('span');
        meta.slot = 'meta';
        meta.textContent = item.meta;
        row.append(meta);
      }
      return row;
    });
    // Si la lista se vuelve a armar con el foco en una fila (después de
    // «Quitar» esa fila vuelve a «Agregar»), el foco queda en la misma fila;
    // si ya no está o quedó deshabilitada, en la próxima que se pueda usar y,
    // si no hay, en «Ver todos los productos».
    // La página cambia count y después items: la lista se arma dos veces
    // seguidas y en la segunda el foco ya no está en ninguna fila. #refocus
    // guarda la fila hasta el cuadro siguiente, que busca en la lista final.
    const focused = root.activeElement?.closest?.('arq-compare-picker-item')?.sku ?? this.#refocus;
    list.replaceChildren(...nodes);
    if (focused && !this.#refocus) {
      requestAnimationFrame(() => {
        const sku = this.#refocus;
        this.#refocus = null;
        const rows = [...list.children];
        const index = Math.max(0, rows.findIndex((node) => node.sku === sku));
        const enabled = (node) => node.added || !node.disabled;
        const next = rows.slice(index).find(enabled) ?? rows.slice(0, index).reverse().find(enabled);
        if (next) next.focus();
        else root.querySelector('.go').focus();
      });
    }
    if (focused) this.#refocus = focused;
    const empty = !nodes.length;
    list.hidden = empty;
    root.querySelector('.empty').hidden = !empty;
    const failed = this.#failed;
    const title = failed ? TEXT.error : TEXT.noResults(this.#query);
    const hint = failed ? TEXT.errorHint : TEXT.hint;
    root.querySelector('.empty-title').textContent = empty ? title : '';
    root.querySelector('.empty-hint').textContent = hint;
    root.querySelector('.retry').hidden = !failed;
    // Resultado de una búsqueda: se anuncia la cantidad (o que no hay). El
    // error se anuncia siempre (también al abrir).
    if (this.#searched || failed) {
      this.#searched = false;
      this.#announce(empty ? `${title} ${hint}` : TEXT.count(nodes.length));
    }
  }

  #announce(message) {
    const live = this.shadowRoot.querySelector('[aria-live]');
    live.textContent = '';
    requestAnimationFrame(() => (live.textContent = message));
  }

  // Entrada y salida como download-modal: is-open dispara la transición (CSS)
  // y el <dialog> se cierra recién cuando termina, así sale por donde entró.
  #showDialog() {
    const dialog = this.#dialog;
    clearTimeout(this.#closing);
    this.#closing = null;
    if (!dialog.open) {
      dialog.showModal();
      // Con Iluminar, la barra del navegador pasa al color del panel (Light)
      setPanelBar(true, dialog);
      void dialog.offsetHeight; // fija el estado inicial antes de is-open
      // Con mouse, el foco va al buscador; en táctil, al cerrar (no abre el teclado).
      const target = FINE.matches ? this.shadowRoot.querySelector('.search') : this.shadowRoot.querySelector('.close');
      target.focus({ preventScroll: true });
    }
    dialog.classList.add('is-open');
  }

  #closeDialog() {
    const dialog = this.#dialog;
    if (this.#closing) return;
    dialog.classList.remove('is-open');
    const ms = transitionMs(this.shadowRoot.querySelector('.sheet'));
    this.#closing = setTimeout(() => {
      this.#closing = null;
      dialog.close();
      // Si quien lo abrió ya no está o quedó oculto (el lugar vacío pasó a
      // tener producto), la página decide adónde va el foco:
      // arq:close { restored: false }.
      const opener = this.#opener;
      this.#opener = null;
      opener?.focus?.();
      const item = this.#chosen;
      this.#chosen = null;
      this.emit('close', { restored: Boolean(opener) && this.#activeElement() === opener, item });
    }, ms);
  }

  // El elemento con foco, aunque esté dentro de un Shadow DOM (el botón del
  // lugar vacío de compare-slot o de compare-product), para devolverle el foco.
  #activeElement() {
    let active = document.activeElement;
    while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
    return active;
  }

  #name() {
    const slot = this.shadowRoot.querySelector('slot[name="title"]');
    const nodes = slot.assignedNodes({ flatten: true });
    const title = (nodes.length ? nodes : [...slot.childNodes]).map((node) => node.textContent).join('').trim();
    this.#dialog.setAttribute('aria-label', title || TEXT.title(this.#replace));
  }
}

ArqComparePicker.define();

export { ArqComparePicker };
