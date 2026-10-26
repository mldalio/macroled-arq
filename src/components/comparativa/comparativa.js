// comparativa · contenedor de página (Final: Comparativa 1227:12373)
//
// Combina arq-compare-header y arq-compare-table con los SKU de ?sku= (hasta
// 3, lo arma compare-bar). Pide los datos a src/data/catalog.js y sincroniza
// entre los dos componentes los selects, "Solo diferencias" y quitar
// (AGENTS.md · Datos: los componentes reciben datos, el contenedor consulta,
// misma excepción que arq-ficha-producto y arq-catalog-listing).
//
//   <arq-comparativa></arq-comparativa>
//
// - Elegir familia o variante, o quitar un producto, actualiza ?sku=
//   (history.replaceState, como ficha-producto) y localStorage arq:compare
//   (la misma clave que lee/escribe compare-bar en Productos y Colecciones),
//   para que la selección siga igual al volver a esas páginas.
// - Sin productos (?sku= vacío o ningún SKU existe): mensaje con link a Productos.
// - Un lugar vacío (compare-product State=Empty, o «Agregar producto» de la
//   cabecera compacta) abre compare-picker. Lo que se agrega se suma a ?sku=
//   y la comparación se vuelve a armar detrás del modal.
// - Mobile: compare-header y compare-table comparten un solo scroll horizontal,
//   el de .scroll (como macroled.com.ar/comparativa): los dos van con
//   `embedded` y no tienen scroll propio. La cabecera compacta (fija) sigue
//   ese desplazamiento y, si se desliza ella, lo mueve. El
//   set no muestra el toggle "Solo diferencias" dentro de compare-header en
//   Mobile: va en una fila aparte, fuera del scroll, como en Final.
// - Bajada: completa [data-arq-compare-count] de la página con la cantidad
//   ("3 productos seleccionados."); sin productos queda vacío.
// - Descargar comparación (como macroled.com.ar/comparativa): el botón de la página con
//   data-arq-print llama a window.print() (main.js). Cada componente trae su
//   @media print. Mientras se imprime, el título del documento pasa a
//   «Comparativa · <productos> · Macroled Arq»: es el nombre que propone el
//   navegador al guardar como PDF.

import { ArqElement } from '../../base/arq-element.js';
import { getCompare, skuForAttribute, listCompareCandidates } from '../../data/catalog.js';
import '../toggle/toggle.js';
import '../compare-header/compare-header.js';
import '../compare-table/compare-table.js';
import '../compare-picker/compare-picker.js';
import css from './comparativa.css?inline';

const KEY = 'arq:compare';
const MAX = 3;
const MOBILE = matchMedia('(max-width: 767px)');

const TEXT = {
  count: (n) => (n === 1 ? '1 producto seleccionado.' : `${n} productos seleccionados.`),
  printTitle: (names) => `Comparativa · ${names.join(' · ')} · Macroled Arq`,
  empty: 'Elegí hasta 3 productos para comparar desde el listado de Productos.',
  error: 'No se pudo cargar la comparación. Probá de nuevo en unos minutos.',
};

function readSkus() {
  const param = new URLSearchParams(location.search).get('sku');
  return param
    ? param
        .split(',')
        .map((s) => decodeURIComponent(s.trim()))
        .filter(Boolean)
        .slice(0, MAX)
    : [];
}

function writeStorage(products) {
  try {
    localStorage.setItem(KEY, JSON.stringify(products.map((p) => ({ sku: p.sku, name: p.name, meta: p.meta, image: p.image }))));
  } catch {
    /* localStorage no disponible: la selección no persiste, no es crítico */
  }
}

class ArqComparativa extends ArqElement {
  static tag = 'arq-comparativa';
  static styles = css;
  static properties = {};
  static template =
    `<div class="page">` +
    `<p class="status role-body" role="status"></p>` +
    `<div class="mobile-controls" hidden><arq-toggle show-label class="diff-mobile">Solo diferencias</arq-toggle></div>` +
    `<div class="scroll" aria-label="Comparación de productos" hidden>` +
    `<arq-compare-header class="header" embedded></arq-compare-header>` +
    `<arq-compare-table class="table" embedded></arq-compare-table>` +
    `</div>` +
    `</div>` +
    `<arq-compare-picker class="picker"></arq-compare-picker>`;

  #skus = [];
  #pickerRequest = 0;
  #names = [];
  #onlyDifferences = false;
  #pageTitle = null;

  setup() {
    const root = this.shadowRoot;
    const header = root.querySelector('.header');
    const table = root.querySelector('.table');
    const applyDifferences = (value) => {
      this.#onlyDifferences = value;
      header.onlyDifferences = value;
      table.onlyDifferences = value;
    };
    header.addEventListener('arq:differences', (event) => applyDifferences(event.detail.value));
    root.querySelector('.diff-mobile').addEventListener('arq:change', (event) => applyDifferences(event.detail.checked));
    header.addEventListener('arq:remove', (event) => {
      this.#skus = this.#skus.filter((sku) => sku !== event.detail.sku);
      this.#load();
    });
    header.addEventListener('arq:change', (event) => this.#onChange(event.detail));
    // «Agregar producto»: compare-picker (la comparación se actualiza detrás).
    const picker = root.querySelector('.picker');
    header.addEventListener('arq:add', (event) => {
      event.stopPropagation();
      picker.show(); // emite arq:search: carga la lista
    });
    picker.addEventListener('arq:search', () => this.#loadPicker());
    // El lugar vacío que lo abrió ya tiene producto: el foco va al próximo
    // lugar vacío o, si no hay, al nombre del último producto.
    picker.addEventListener('arq:close', (event) => {
      if (event.detail.restored) return;
      const products = [...header.shadowRoot.querySelectorAll('.products arq-compare-product')];
      const empty = products.find((product) => product.hasAttribute('empty'));
      const target = empty ? empty.shadowRoot.querySelector('.add') : products.at(-1)?.shadowRoot.querySelector('.title');
      target?.focus();
    });
    picker.addEventListener('arq:add', (event) => {
      const { sku } = event.detail.item;
      if (this.#skus.length >= MAX || this.#skus.includes(sku)) return;
      this.#skus = [...this.#skus, sku];
      this.#load();
    });
    // Mobile: un solo scroll (.scroll) para productos y tabla. La cabecera
    // compacta lo sigue; si se desliza la compacta, mueve el contenedor.
    const scroll = root.querySelector('.scroll');
    // written: el último scrollLeft que puso el código. Su evento scroll llega
    // un cuadro después y no se devuelve a la cabecera (si no, ida y vuelta).
    let written = null;
    scroll.addEventListener('scroll', () => {
      if (written !== null && Math.abs(scroll.scrollLeft - written) < 1) {
        written = null;
        return;
      }
      written = null;
      if (MOBILE.matches) header.setScrollLeft(scroll.scrollLeft);
    });
    header.addEventListener('arq:scroll', (event) => {
      if (!MOBILE.matches || Math.abs(scroll.scrollLeft - event.detail.left) < 1) return;
      written = event.detail.left;
      scroll.scrollLeft = event.detail.left;
    });
    // Solo hace falta ser foco-de-teclado cuando el scroll compartido existe (Mobile).
    MOBILE.addEventListener('change', () => this.#syncScrollA11y());
    this.#syncScrollA11y();
    this.#skus = readSkus();
    this.#load();
  }

  connectedCallback() {
    super.connectedCallback?.();
    addEventListener('beforeprint', this.#beforePrint);
    addEventListener('afterprint', this.#afterPrint);
  }

  disconnectedCallback() {
    super.disconnectedCallback?.();
    removeEventListener('beforeprint', this.#beforePrint);
    removeEventListener('afterprint', this.#afterPrint);
  }

  #beforePrint = () => {
    if (!this.#names.length) return;
    this.#pageTitle ??= document.title;
    document.title = TEXT.printTitle(this.#names);
  };

  #afterPrint = () => {
    if (this.#pageTitle === null) return;
    document.title = this.#pageTitle;
    this.#pageTitle = null;
  };

  #syncScrollA11y() {
    const scroll = this.shadowRoot.querySelector('.scroll');
    if (MOBILE.matches) {
      scroll.setAttribute('tabindex', '0');
      scroll.setAttribute('role', 'region');
    } else {
      scroll.removeAttribute('tabindex');
      scroll.removeAttribute('role');
    }
  }

  // Productos del compare-picker con la búsqueda y el filtro del modal; los
  // que ya están en la comparación salen como Agregado (con 3, el resto Disabled).
  async #loadPicker() {
    const picker = this.shadowRoot.querySelector('.picker');
    const selected = [...this.#skus];
    const request = ++this.#pickerRequest;
    picker.count = selected.length;
    try {
      const { items } = await listCompareCandidates({ ...picker.search, selected });
      if (request === this.#pickerRequest) picker.items = items;
    } catch (error) {
      console.error('[arq] compare-picker: no se pudo cargar el catálogo', error);
      if (request === this.#pickerRequest) picker.showError();
    }
  }

  // field: el campo de un atributo de variante (color_carcasa, altura…).
  // Resuelve el SKU de esa combinación con la misma lógica que la ficha.
  async #onChange({ index, field, value }) {
    const current = this.#skus[index];
    if (!value || !current) return;
    const sku = await skuForAttribute(current, field, value);
    if (!sku || sku === current) return;
    this.#skus[index] = sku;
    this.#skus = this.#skus.slice(0, MAX);
    this.#load();
  }

  async #load() {
    const root = this.shadowRoot;
    const header = root.querySelector('.header');
    const table = root.querySelector('.table');
    const scroll = root.querySelector('.scroll');
    const mobileControls = root.querySelector('.mobile-controls');
    this.setAttribute('aria-busy', 'true');
    let data = null;
    let failed = false;
    try {
      data = this.#skus.length ? await getCompare(this.#skus) : { products: [], groups: [] };
    } catch (error) {
      failed = true;
      console.error('[arq] comparativa: no se pudo cargar el catálogo', error);
    }
    this.removeAttribute('aria-busy');
    if (!data || (failed && !data.products.length)) {
      this.#status(failed ? TEXT.error : TEXT.empty);
      scroll.hidden = true;
      mobileControls.hidden = true;
      return;
    }
    // SKU que no existían se omiten (getCompare): la URL y la selección
    // guardada reflejan lo que realmente se está mostrando.
    this.#skus = data.products.map((p) => p.sku);
    this.#names = data.products.map((p) => p.name).filter(Boolean);
    if (!this.#skus.length) {
      this.#status(TEXT.empty);
      scroll.hidden = true;
      mobileControls.hidden = true;
      return;
    }
    this.#status('');
    this.#count(this.#skus.length);
    scroll.hidden = false;
    mobileControls.hidden = false;
    header.products = data.products;
    header.onlyDifferences = this.#onlyDifferences;
    table.data = { products: data.products, groups: data.groups };
    table.onlyDifferences = this.#onlyDifferences;
    root.querySelector('.diff-mobile').checked = this.#onlyDifferences;
    requestAnimationFrame(() => header.refreshCompact());
    writeStorage(data.products);
    if (root.querySelector('.picker').open) this.#loadPicker();
    const url = new URL(location.href);
    url.searchParams.set('sku', this.#skus.map(encodeURIComponent).join(','));
    history.replaceState(history.state, '', url);
  }

  // Bajada del page-header (DOM de la página): "3 productos seleccionados."
  #count(n) {
    for (const el of document.querySelectorAll('[data-arq-compare-count]')) el.textContent = n ? TEXT.count(n) : '';
  }

  #status(message) {
    const status = this.shadowRoot.querySelector('.status');
    status.textContent = message;
    if (message) this.#count(0);
  }
}

ArqComparativa.define();

export { ArqComparativa };
