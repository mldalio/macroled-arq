// compare-header · Figma 1265:4330 · ficha doc/compare-header
//
// Cabecera de la página Comparativa. Type=Default: columna de controles
// (toggle "Solo diferencias") + hasta 3 compare-product. Type=Compact:
// versión mini que queda fija bajo el navbar cuando el Default sale de
// pantalla (compare-slot por producto). Type no es una prop: el propio
// componente mide el scroll con un IntersectionObserver y cambia solo.
//
//   <arq-compare-header></arq-compare-header>
//   header.products = [
//     { sku, name, href, image, meta, family: { value, options }, variant: { value, options } },
//     null,  // lugar vacío (State=Empty): compare-product muestra una caja clickeable, sin selects
//   ];
//   header.onlyDifferences = false;
//   header.addEventListener('arq:differences', (e) => (table.onlyDifferences = e.detail.value));
//   header.addEventListener('arq:remove', (e) => quitar(e.detail.sku));
//   header.addEventListener('arq:change', (e) => elegir(e.detail.index, e.detail.field, e.detail.value));
//   header.addEventListener('arq:add', () => abrirModalDeProductos()); // TODO: el modal no existe todavía
//
// - No consulta Typesense: recibe los datos ya armados (AGENTS.md · Datos).
// - TODO (navbar): falta el token layout/navbar-height (docs/decisiones.md,
//   2026-10-01 · hero). Mientras tanto se mide el alto real de <arq-navbar>.
// - Mobile: columnas de compare-slot Compact (28 de ancho) con el nombre al
//   lado, igual que la cabecera provisoria que tenía compare-table.

import { ArqElement } from '../../base/arq-element.js';
import '../toggle/toggle.js';
import '../compare-product/compare-product.js';
import '../compare-slot/compare-slot.js';
import css from './compare-header.css?inline';

const MAX = 3;
const MOBILE = matchMedia('(max-width: 767px)');

class ArqCompareHeader extends ArqElement {
  static tag = 'arq-compare-header';
  static styles = css;
  static properties = {
    onlyDifferences: { type: Boolean }, // toggle "Solo diferencias" (Default y Compact comparten el valor)
    diffLabel: { type: String, default: 'Solo diferencias' },
  };
  static template =
    `<div class="header">` +
    `<div class="default">` +
    `<div class="controls"><arq-toggle show-label class="diff"></arq-toggle></div>` +
    `<div class="products"></div>` +
    `<span class="sentinel" aria-hidden="true"></span>` +
    `</div>` +
    `<div class="compact" hidden>` +
    `<div class="controls"><arq-toggle show-label class="diff-compact"></arq-toggle></div>` +
    `<div class="slots"></div>` +
    `</div>` +
    `</div>`;

  #products = [];
  #io = null;
  #syncingScroll = false;
  #defaultWasVisible = false;

  /** Hasta 3: cada item { sku, name, href, image, meta, family, variant } o null (Empty). */
  get products() {
    return this.#products;
  }

  set products(list) {
    this.#products = (Array.isArray(list) ? list : []).slice(0, MAX);
    if (this.isConnected) this.#render();
  }

  setup() {
    const root = this.shadowRoot;
    for (const toggle of root.querySelectorAll('arq-toggle')) {
      toggle.addEventListener('arq:change', (event) => {
        event.stopPropagation();
        this.onlyDifferences = event.detail.checked;
        this.emit('differences', { value: event.detail.checked });
      });
    }
    root.querySelector('.products').addEventListener('arq:remove', (event) => {
      event.stopPropagation();
      this.emit('remove', { sku: event.detail.sku });
    });
    root.querySelector('.products').addEventListener('arq:change', (event) => {
      event.stopPropagation();
      const index = [...root.querySelectorAll('.products arq-compare-product')].indexOf(event.target);
      this.emit('change', { index, field: event.detail.field, value: event.detail.value });
    });
    root.querySelector('.products').addEventListener('arq:add', (event) => {
      event.stopPropagation();
      const index = [...root.querySelectorAll('.products arq-compare-product')].indexOf(event.target);
      this.emit('add', { index });
    });
    root.querySelector('.slots').addEventListener('arq:remove', (event) => {
      event.stopPropagation();
      this.emit('remove', { sku: event.detail.sku });
    });
    for (const strip of root.querySelectorAll('.products, .slots')) {
      strip.addEventListener('scroll', () => this.#onScroll(strip));
    }
    MOBILE.addEventListener('change', () => this.#syncBreakpoint());
    this.#syncNavbarOffset();
    addEventListener('resize', () => {
      this.#syncNavbarOffset();
      if (MOBILE.matches) document.querySelector('arq-navbar')?.removeAttribute('data-arq-compare-hidden');
    });
    this.#render();
  }

  disconnectedCallback() {
    this.#io?.disconnect();
    document.querySelector('arq-navbar')?.removeAttribute('data-arq-compare-hidden');
  }

  update(changed) {
    if (changed.has('diffLabel') || changed.has('onlyDifferences')) {
      for (const toggle of this.shadowRoot.querySelectorAll('arq-toggle')) {
        toggle.textContent = this.diffLabel ?? '';
        toggle.checked = this.onlyDifferences;
      }
    }
  }

  // Siempre se muestran MAX columnas: sin producto, compare-product/compare-slot
  // quedan en State=Empty (ficha: "con menos, compare-product Empty").
  #render() {
    const root = this.shadowRoot;
    const products = root.querySelector('.products');
    const slots = root.querySelector('.slots');
    for (let i = 0; i < MAX; i++) {
      const data = this.#products[i] ?? null;
      let product = products.children[i];
      if (!product) {
        product = document.createElement('arq-compare-product');
        products.append(product);
      }
      product.data = data;

      let slot = slots.children[i];
      if (!slot) {
        slot = document.createElement('div');
        slot.className = 'product';
        slot.innerHTML = '<arq-compare-slot></arq-compare-slot><span class="mobile-name role-label" aria-hidden="true"></span>';
        slots.append(slot);
      }
      const compareSlot = slot.querySelector('arq-compare-slot');
      if (data) {
        compareSlot.sku = data.sku;
        if (data.image) compareSlot.image = data.image;
        else compareSlot.removeAttribute('image');
        compareSlot.replaceChildren();
        const name = document.createElement('span');
        name.slot = 'name';
        name.textContent = data.name ?? '';
        const meta = document.createElement('span');
        meta.slot = 'meta';
        meta.textContent = data.meta ?? data.sku ?? '';
        compareSlot.append(name, meta);
      } else {
        compareSlot.removeAttribute('sku');
        compareSlot.removeAttribute('image');
        compareSlot.replaceChildren();
      }
      slot.querySelector('.mobile-name').textContent = data?.name ?? '';
    }
    while (products.children.length > MAX) products.lastElementChild.remove();
    while (slots.children.length > MAX) slots.lastElementChild.remove();
    this.#syncBreakpoint();
  }

  #syncBreakpoint() {
    const mobile = MOBILE.matches;
    for (const slot of this.shadowRoot.querySelectorAll('.slots arq-compare-slot')) slot.size = mobile ? 'compact' : 'default';
    document.querySelector('arq-navbar')?.removeAttribute('data-arq-compare-hidden');
  }

  // Lo usa arq-comparativa para alinear el Compact fijo con el scroll
  // compartido de Default + compare-table en Mobile.
  setScrollLeft(left) {
    if (!MOBILE.matches) return;
    for (const strip of this.shadowRoot.querySelectorAll('.products, .slots')) strip.scrollLeft = left;
  }

  // arq-comparativa llama esto después de quitar hidden de su contenedor. El
  // observer inicial puede correr mientras ese contenedor no tiene geometría.
  refreshCompact() {
    this.#syncNavbarOffset();
  }

  #onScroll(source) {
    if (!MOBILE.matches || this.#syncingScroll) return;
    this.#syncingScroll = true;
    for (const strip of this.shadowRoot.querySelectorAll('.products, .slots')) {
      if (strip !== source) strip.scrollLeft = source.scrollLeft;
    }
    this.emit('scroll', { left: source.scrollLeft });
    this.#syncingScroll = false;
  }

  #syncNavbarOffset() {
    const navbar = document.querySelector('arq-navbar');
    const height = navbar ? Math.round(navbar.getBoundingClientRect().height) : 0;
    this.shadowRoot.querySelector('.compact').style.setProperty('--navbar-height', `${height}px`);
    this.#watch(height);
  }

  // El centinela queda al final del Default. Su posición vertical permite
  // distinguir que la cabecera ya pasó por arriba de que aún esté más abajo.
  #watch(navbarHeight = 0) {
    this.#io?.disconnect();
    this.#defaultWasVisible = false;
    this.#setCompact(false);
    const sentinel = this.shadowRoot.querySelector('.sentinel');
    this.#io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) this.#defaultWasVisible = true;
      this.#setCompact(this.#defaultWasVisible && entry.boundingClientRect.top < 0);
    }, {
      rootMargin: `${MOBILE.matches ? 0 : -navbarHeight}px 0px 0px 0px`,
      threshold: 0,
    });
    this.#io.observe(sentinel);
  }

  #setCompact(compact) {
    if (!this.getClientRects().length) return;
    this.shadowRoot.querySelector('.compact').hidden = !compact;
    const navbar = document.querySelector('arq-navbar');
    if (navbar && MOBILE.matches) navbar.toggleAttribute('data-arq-compare-hidden', compact);
  }
}

ArqCompareHeader.define();

export { ArqCompareHeader };
