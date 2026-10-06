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
// - TODO (diseño + código): un lugar vacío (compare-product State=Empty) emite
//   arq:add { index } al clickear, pero todavía no hace nada acá — la ficha
//   dice que más adelante abre un modal para elegir producto.
// - Mobile: compare-header y compare-table comparten un solo scroll horizontal
//   (ficha de compare-header: "el scroll horizontal se sincroniza con la
//   tabla"); compare-table va con `embedded` para no tener scroll propio. El
//   set no muestra el toggle "Solo diferencias" dentro de compare-header en
//   Mobile: va en una fila aparte, fuera del scroll, como en Final.
// - Imprimir (como macroled.com.ar/comparativa): el botón de la página con
//   data-arq-print llama a window.print() (main.js). Cada componente trae su
//   @media print. Mientras se imprime, el título del documento pasa a
//   «Comparativa · <productos> · Macroled Arq»: es el nombre que propone el
//   navegador al guardar como PDF.

import { ArqElement } from '../../base/arq-element.js';
import { getCompare, skuForAttribute } from '../../data/catalog.js';
import '../toggle/toggle.js';
import '../compare-header/compare-header.js';
import '../compare-table/compare-table.js';
import css from './comparativa.css?inline';

const KEY = 'arq:compare';
const MAX = 3;
const MOBILE = matchMedia('(max-width: 767px)');

const TEXT = {
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
    `<p class="status role-body" role="status" hidden></p>` +
    `<div class="mobile-controls" hidden><arq-toggle show-label class="diff-mobile">Solo diferencias</arq-toggle></div>` +
    `<div class="scroll" aria-label="Comparación de productos" hidden>` +
    `<arq-compare-header class="header"></arq-compare-header>` +
    `<arq-compare-table class="table" embedded></arq-compare-table>` +
    `</div>` +
    `</div>`;

  #skus = [];
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
    // Mobile: solo las tiras de valores y de productos se desplazan. La tabla
    // alinea todas sus filas; compare-header alinea Default y Compact.
    header.addEventListener('arq:scroll', (event) => {
      if (MOBILE.matches) table.setScrollLeft(event.detail.left);
    });
    table.addEventListener('arq:scroll', (event) => {
      if (MOBILE.matches) header.setScrollLeft(event.detail.left);
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
    scroll.hidden = false;
    mobileControls.hidden = false;
    header.products = data.products;
    header.onlyDifferences = this.#onlyDifferences;
    table.data = { products: data.products, groups: data.groups };
    table.onlyDifferences = this.#onlyDifferences;
    root.querySelector('.diff-mobile').checked = this.#onlyDifferences;
    requestAnimationFrame(() => header.refreshCompact());
    writeStorage(data.products);
    const url = new URL(location.href);
    url.searchParams.set('sku', this.#skus.map(encodeURIComponent).join(','));
    history.replaceState(history.state, '', url);
  }

  #status(message) {
    const status = this.shadowRoot.querySelector('.status');
    status.textContent = message;
    status.hidden = !message;
  }
}

ArqComparativa.define();

export { ArqComparativa };
