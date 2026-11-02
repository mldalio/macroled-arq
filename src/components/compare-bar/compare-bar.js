// compare-bar · Figma 1233:3963 · ficha doc/compare-bar
//
// Barra fija inferior para comparar productos (hasta 3), en Productos y
// Colecciones. Aparece cuando hay al menos un producto elegido con "Comparar".
//
//   <arq-compare-bar></arq-compare-bar>
//
//   bar.add({ sku, name, meta, image });   // al marcar "Comparar" en una product-card
//   bar.remove(sku);                       // al desmarcarlo
//   bar.replace(sku, { sku, name, … });    // otro producto en el mismo lugar
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
//   línea). Arranca abierta y se vuelve a abrir al agregar un producto. En
//   Mobile, con 2 o más productos arranca plegada y no se abre sola al
//   agregar: abierta con 3 ocupaba más de la mitad de la pantalla
//   (decisión 2026-10-26).
// - "Comparar" lleva a /arq/comparativa?sku=SKU1,SKU2,SKU3 (decisión 2026-10-02
//   · Comparativa; href base en el atributo href).
// - La selección se guarda en localStorage (arq:compare), así sigue al cambiar
//   de página o de filtros. add() con 3 elegidos no agrega y devuelve false.
// - Emite arq:compare-change { items } cuando cambia la selección.
// - Un lugar vacío (+, compare-slot Empty) emite arq:add: la página abre
//   compare-picker («Agregar producto»). En Mobile, un solo lugar vacío
//   debajo de los elegidos, mientras haya menos de 3.
// - Un lugar con producto emite arq:replace { sku } (de compare-slot): la
//   página abre compare-picker en modo «Cambiar producto» y llama a replace().
//   El orden es fijo: el de cómo se agregaron (el de las columnas de la
//   comparativa). Reordenar arrastrando quedó para más adelante.
// - Vacía: si la persona quita todos los productos, la barra queda con los
//   lugares vacíos y una X para cerrarla («Comparar» deshabilitado, sin
//   «Borrar todo» ni cantidad). La X emite arq:dismiss. Al recargar, sin
//   productos, la barra no aparece (decisiones.md, 2026-11-02 · compare-bar:
//   cambiar y quitar).
// - Lo que cambia se anuncia a lectores de pantalla (región aria-live, fuera
//   de la barra para que se escuche también al cerrarla).

import { ArqElement } from '../../base/arq-element.js';
import { Disclosure } from '../../base/disclosure.js';
import { icon } from '../../base/icons.js';
import '../button/button.js';
import '../icon-button/icon-button.js';
import '../count-badge/count-badge.js';
import '../divider/divider.js';
import '../compare-slot/compare-slot.js';
import { toMs } from '../../base/motion.js';
import css from './compare-bar.css?inline';

const KEY = 'arq:compare';
const MAX = 3;
const MOBILE = matchMedia('(max-width: 767px)');

const TEXT = {
  added: (name, count) => `${name} agregado a la comparación. ${count} de ${MAX}.`,
  removed: (name) => `${name} quitado de la comparación.`,
  replaced: (from, to) => `${from} cambiado por ${to}.`,
  cleared: 'Se quitaron todos los productos de la comparación.',
  closed: 'Comparador cerrado.',
};

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

const entry = (item) => ({ sku: item.sku, name: item.name ?? '', meta: item.meta ?? '', image: item.image ?? '' });

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
    `<button class="title toggle"><span class="role-body-lg">Productos seleccionados</span><arq-count-badge class="count"></arq-count-badge>` +
    `<span class="icon-box">${icon('chevron-down')}${icon('chevron-up')}</span></button>` +
    `<arq-icon-button icon="close" class="dismiss" hidden>Cerrar comparador</arq-icon-button>` +
    `</div>` +
    `<div class="row">` +
    `<div class="slots"></div>` +
    `<div class="actions">` +
    `<arq-button type="underline" show-underline class="clear">Borrar todo</arq-button>` +
    `<arq-button class="go" show-icon icon="arrow-right">Comparar</arq-button>` +
    `</div>` +
    `</div>` +
    `</section>` +
    `<span class="visually-hidden" aria-live="polite"></span>`;

  #items = read();
  // La persona quitó todos los productos: la barra sigue a la vista, vacía,
  // hasta que la cierra con la X (o recarga la página).
  #keep = false;

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
    this.open = !this.#folds();
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
    root.querySelector('.clear').addEventListener('click', () => {
      this.clear();
      this.focusAdd();
    });
    root.querySelector('.dismiss').addEventListener('click', () => this.dismiss());
    const slots = root.querySelector('.slots');
    // Quitar con la X: el foco pasa al lugar que queda en esa posición (el
    // producto siguiente o el lugar vacío), así no se pierde.
    slots.addEventListener('arq:remove', (event) => {
      event.stopPropagation();
      const index = this.#items.findIndex((item) => item.sku === event.detail.sku);
      this.remove(event.detail.sku);
      const target = root.querySelectorAll('arq-compare-slot')[index];
      if (target) target.focus();
      else this.focusAdd();
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
    this.#items.push(entry(item));
    if (!this.#folds()) this.open = true;
    this.#announce(TEXT.added(item.name ?? '', this.#items.length));
    this.#changed();
    return true;
  }

  // Mobile con 2 o más elegidos: la lista queda plegada salvo que la persona la abra
  #folds() {
    return MOBILE.matches && this.#items.length >= 2;
  }

  /** Quita un producto por SKU. Si era el último, la barra queda vacía a la vista. */
  remove(sku) {
    const item = this.#items.find((i) => i.sku === sku);
    if (!item) return;
    this.#items = this.#items.filter((i) => i.sku !== sku);
    if (!this.#items.length) this.#empty();
    this.#announce(TEXT.removed(item.name));
    this.#changed();
  }

  /** Cambia el producto `sku` por `item`, en el mismo lugar. Devuelve false si no se pudo. */
  replace(sku, item) {
    const index = this.#items.findIndex((i) => i.sku === sku);
    if (index < 0 || !item?.sku || (item.sku !== sku && this.has(item.sku))) return false;
    const before = this.#items[index];
    this.#items[index] = entry(item);
    this.#announce(TEXT.replaced(before.name, item.name ?? ''));
    this.#changed();
    return true;
  }

  /** "Borrar todo": la barra queda vacía a la vista. */
  clear() {
    if (!this.#items.length) return;
    this.#items = [];
    this.#empty();
    this.#announce(TEXT.cleared);
    this.#changed();
  }

  /** La X de la barra vacía: la oculta. Emite arq:dismiss (la página mueve el foco). */
  dismiss() {
    if (this.#items.length || !this.#keep) return;
    this.#keep = false;
    this.#render();
    this.#announce(TEXT.closed);
    this.emit('dismiss');
  }

  has(sku) {
    return this.#items.some((item) => item.sku === sku);
  }

  /** Foco en el primer lugar vacío (+) o, si no hay, en «Comparar». */
  focusAdd() {
    const root = this.shadowRoot;
    const empty = [...root.querySelectorAll('arq-compare-slot')].find((slot) => !slot.filled);
    if (empty) empty.focus();
    else root.querySelector('.go')?.focus();
  }

  /** Foco en el lugar del producto `sku` (abre la lista si estaba plegada). */
  focusItem(sku) {
    const slot = this.#filledSlots().find((s) => s.sku === sku);
    if (!slot) return this.focusAdd();
    if (!this.open) this.open = true;
    slot.focus();
  }

  /** URL de «Comparar»: la comparativa con los SKU elegidos. */
  get compareUrl() {
    const query = this.#items.map((item) => encodeURIComponent(item.sku)).join(',');
    return `${this.href ?? '/arq/comparativa'}?sku=${query}`;
  }

  // Sin productos, la barra sigue a la vista y abierta (los lugares vacíos)
  #empty() {
    this.#keep = true;
    this.open = true;
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
    const duration = toMs(styles.getPropertyValue('--arq-motion-duration-panel')) || 0;
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

  #filledSlots() {
    return [...this.shadowRoot.querySelectorAll('arq-compare-slot')].filter((slot) => slot.filled);
  }

  #announce(message) {
    const live = this.shadowRoot.querySelector('[aria-live]');
    if (!live) return;
    live.textContent = '';
    requestAnimationFrame(() => (live.textContent = message));
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
    const empty = items.length === 0;
    if (!empty) this.#keep = false;
    root.querySelector('.bar').hidden = empty && !this.#keep;
    const count = root.querySelector('.count');
    count.count = items.length;
    count.hidden = empty;
    root.querySelector('.dismiss').hidden = !empty;
    root.querySelector('.clear').hidden = empty;
    const mobile = MOBILE.matches;
    const slots = root.querySelector('.slots');
    const nodes = [];
    // Mobile: los elegidos, apilados, y debajo un solo lugar vacío para
    // agregar (abre compare-picker) mientras haya menos de 3
    const places = mobile ? Math.min(items.length + 1, MAX) : MAX;
    for (let i = 0; i < places; i++) {
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
    const go = root.querySelector('.go');
    go.href = this.compareUrl;
    go.disabled = empty;
  }
}

ArqCompareBar.define();

/**
 * Después de cerrar la barra vacía (arq:dismiss), el foco va al título de la
 * página (el <h1> que llega por slot al contenedor `host`, como en la ficha, o
 * el de la página, como el page-header de Productos), sin desplazarla: la
 * barra ya no está y el foco no queda perdido en el <body>.
 */
function focusHeading(host) {
  const heading = host.querySelector('h1') ?? document.querySelector('h1');
  if (!heading) return;
  if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1');
  heading.focus({ preventScroll: true });
}

export { ArqCompareBar, focusHeading };
