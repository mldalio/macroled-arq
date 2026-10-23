// compare-bar · Figma 1233:3963 · ficha doc/compare-bar
//
// Barra fija inferior para comparar productos (hasta 3), en Productos y
// Colecciones. Aparece cuando hay al menos un producto elegido con "Comparar".
//
//   <arq-compare-bar></arq-compare-bar>
//
//   bar.add({ sku, name, meta, image });   // al marcar "Comparar" en una product-card
//   bar.remove(sku);                       // al desmarcarlo
//   bar.addEventListener('arq:compare-change', (e) => sincronizarCards(e.detail.items));
//
// - Dark local (DESIGN.md §2): el contenedor interno lleva data-arq-theme="dark";
//   quien arma la página no pone nada.
// - Título "Productos seleccionados" + count-badge; 3 lugares (compare-slot
//   Default, con divisores); "Borrar todo" y "Comparar". En Mobile, como
//   macroled.com.ar: los productos elegidos, uno arriba de otro (más un lugar
//   vacío para agregar si hay menos de 3), y "Comparar" debajo a todo el ancho.
// - Open: el título es un botón que pliega y despliega la lista de productos
//   (disclosure base, chevron-down abierta · chevron-up plegada). Plegada
//   quedan el título, "Borrar todo" y "Comparar" (en Desktop, en una sola
//   línea). Arranca abierta y se vuelve a abrir al agregar un producto.
// - "Comparar" lleva a /arq/comparativa?sku=SKU1,SKU2,SKU3 (decisión 2026-10-02
//   · Comparativa; href base en el atributo href).
// - La selección se guarda en localStorage (arq:compare), así sigue al cambiar
//   de página o de filtros. add() con 3 elegidos no agrega y devuelve false.
// - Emite arq:compare-change { items } cuando cambia la selección.
// - Un lugar vacío (+, compare-slot Empty) emite arq:add: la página abre
//   compare-picker («Agregar producto»). En Mobile, un solo lugar vacío
//   debajo de los elegidos, mientras haya menos de 3.

import { ArqElement } from '../../base/arq-element.js';
import { Disclosure } from '../../base/disclosure.js';
import { icon } from '../../base/icons.js';
import '../button/button.js';
import '../count-badge/count-badge.js';
import '../divider/divider.js';
import '../compare-slot/compare-slot.js';
import css from './compare-bar.css?inline';

const KEY = 'arq:compare';
const MAX = 3;
const MOBILE = matchMedia('(max-width: 767px)');

function read() {
  try {
    const list = JSON.parse(localStorage.getItem(KEY) ?? '[]');
    return Array.isArray(list) ? list.filter((item) => item && item.sku).slice(0, MAX) : [];
  } catch {
    return [];
  }
}

function write(items) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {}
}

class ArqCompareBar extends ArqElement {
  static tag = 'arq-compare-bar';
  static styles = css;
  static properties = {
    href: { type: String, default: '/arq/comparativa' }, // página de la comparativa
    open: { type: Boolean }, // Open: lista de productos desplegada
  };
  static template =
    `<section class="bar" data-arq-theme="dark" aria-label="Comparar productos" hidden>` +
    `<div class="head">` +
    `<button class="title toggle role-body-lg"><span>Productos seleccionados</span><arq-count-badge class="count"></arq-count-badge>` +
    `<span class="icon-box">${icon('chevron-down')}${icon('chevron-up')}</span></button>` +
    `</div>` +
    `<div class="row">` +
    `<div class="slots"></div>` +
    `<div class="actions">` +
    `<arq-button type="underline" show-underline class="clear">Borrar todo</arq-button>` +
    `<arq-button class="go" show-icon icon="arrow-right">Comparar</arq-button>` +
    `</div>` +
    `</div>` +
    `</section>`;

  #items = read();

  /** Productos elegidos: [{ sku, name, meta, image }]. */
  get items() {
    return [...this.#items];
  }

  set items(list) {
    this.#items = (Array.isArray(list) ? list : []).filter((item) => item && item.sku).slice(0, MAX);
    this.#changed();
  }

  setup() {
    const root = this.shadowRoot;
    this.open = true;
    this.disclosure = new Disclosure(this, {
      trigger: root.querySelector('.toggle'),
      panel: root.querySelector('.slots'),
    });
    // Plegar y desplegar con el chevron: la barra se desliza (#slide). Dónde
    // está el borde de arriba se toma en captura, antes de que Disclosure
    // cambie open (con el desplazamiento en curso, si se vuelve a apretar).
    let before = null;
    root.querySelector('.toggle').addEventListener('click', () => {
      before = root.querySelector('.bar').getBoundingClientRect().top;
    }, { capture: true });
    this.addEventListener('arq:toggle', () => this.#slide(before));
    for (const button of root.querySelectorAll('.clear')) button.addEventListener('click', () => this.clear());
    root.querySelector('.slots').addEventListener('arq:remove', (event) => {
      event.stopPropagation();
      this.remove(event.detail.sku);
    });
    MOBILE.addEventListener('change', () => this.#render());
    // Otra pestaña cambió la selección
    addEventListener('storage', (event) => {
      if (event.key !== KEY) return;
      this.#items = read();
      this.#render();
      this.emit('compare-change', { items: this.items });
    });
    this.#render();
    // Entrada y salida animadas solo después del primer render: si la página
    // carga con productos ya elegidos, la barra aparece sin animar.
    requestAnimationFrame(() => requestAnimationFrame(() => root.querySelector('.bar').classList.add('animate')));
  }

  update(changed) {
    if (changed.has('href')) this.#render();
  }

  /** Agrega un producto. Devuelve false si ya hay 3 (o si ya estaba). */
  add(item) {
    if (!item?.sku || this.has(item.sku) || this.#items.length >= MAX) return false;
    this.#items.push({ sku: item.sku, name: item.name ?? '', meta: item.meta ?? '', image: item.image ?? '' });
    this.open = true;
    this.#changed();
    return true;
  }

  /** Quita un producto por SKU. */
  remove(sku) {
    const before = this.#items.length;
    this.#items = this.#items.filter((item) => item.sku !== sku);
    if (this.#items.length !== before) this.#changed();
  }

  /** "Borrar todo". */
  clear() {
    if (!this.#items.length) return;
    this.#items = [];
    this.#changed();
  }

  has(sku) {
    return this.#items.some((item) => item.sku === sku);
  }

  /** Foco en el primer lugar vacío (+) o, si no hay, en «Comparar». */
  focusAdd() {
    const root = this.shadowRoot;
    const empty = [...root.querySelectorAll('arq-compare-slot')].find((slot) => !slot.filled);
    const target = empty?.shadowRoot.querySelector('.add') ?? root.querySelector('.go');
    target?.focus();
  }

  /** URL de «Comparar»: la comparativa con los SKU elegidos. */
  get compareUrl() {
    const query = this.#items.map((item) => encodeURIComponent(item.sku)).join(',');
    return `${this.href ?? '/arq/comparativa'}?sku=${query}`;
  }

  // Al plegar o desplegar, la barra cambia de alto de golpe. Como está pegada
  // abajo, se anima la diferencia con transform: arranca con el borde de
  // arriba donde estaba y lo lleva a su lugar nuevo, con el mismo tiempo y la
  // misma curva que la entrada (motion/duration/panel + motion/easing/standard).
  // Con movimiento reducido, panel vale 0 y cambia de golpe.
  #slide(before) {
    const bar = this.shadowRoot.querySelector('.bar');
    if (before === null || bar.hidden || !bar.classList.contains('animate')) return;
    const styles = getComputedStyle(bar);
    const duration = Number.parseFloat(styles.getPropertyValue('--arq-motion-duration-panel')) || 0;
    if (!duration) return;
    bar.getAnimations().forEach((animation) => animation.cancel());
    bar.classList.remove('sliding');
    const delta = before - bar.getBoundingClientRect().top;
    if (!delta) return;
    bar.classList.add('sliding');
    const animation = bar.animate([{ transform: `translateY(${delta}px)` }, { transform: 'none' }], {
      duration,
      easing: styles.getPropertyValue('--arq-motion-easing-standard').trim() || 'ease-out',
    });
    animation.onfinish = () => bar.classList.remove('sliding');
  }

  #changed() {
    write(this.#items);
    this.#render();
    this.emit('compare-change', { items: this.items });
  }

  #render() {
    const root = this.shadowRoot;
    if (!root.querySelector('.bar')) return;
    const items = this.#items;
    root.querySelector('.bar').hidden = items.length === 0;
    root.querySelector('.count').count = items.length;
    const mobile = MOBILE.matches;
    const slots = root.querySelector('.slots');
    const nodes = [];
    // Mobile: los elegidos, apilados, y debajo un solo lugar vacío para
    // agregar (abre compare-picker) mientras haya menos de 3
    const count = mobile ? Math.min(items.length + 1, MAX) : MAX;
    for (let i = 0; i < count; i++) {
      if (i > 0) {
        const divider = document.createElement('arq-divider');
        divider.setAttribute('orientation', mobile ? 'horizontal' : 'vertical');
        divider.setAttribute('emphasis', mobile ? 'subtle' : 'default');
        nodes.push(divider);
      }
      const item = items[i];
      const slot = document.createElement('arq-compare-slot');
      if (item) {
        slot.sku = item.sku;
        if (item.image) slot.image = item.image;
        const name = document.createElement('span');
        name.slot = 'name';
        name.textContent = item.name;
        const meta = document.createElement('span');
        meta.slot = 'meta';
        meta.textContent = item.meta;
        slot.append(name, meta);
      }
      nodes.push(slot);
    }
    slots.replaceChildren(...nodes);
    root.querySelector('.go').href = this.compareUrl;
  }
}

ArqCompareBar.define();

export { ArqCompareBar };
