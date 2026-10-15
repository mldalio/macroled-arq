// descargas · contenedor de página (Figma: «Descargas · propuesta final
// (desktop y mobile)» 2575:22875 → Desktop 2564:20607 · Mobile 2558:20149 ·
// modal 2554:20132 / 2554:20214)
//
// Página Descargas: arriba, el título con su bajada y el catálogo general
// (tapa, nombre, bajada y «Descargar catálogo»); debajo, «Buscar archivos por
// producto» con downloads-table (todos los SKU del catálogo, buscador y
// filtros de selección múltiple) y el modal de descargas de cada fila. El
// embed imprime los textos por slot; el componente pide las filas a
// getDownloadsTable() (src/data/catalog.js).
//
//   <arq-descargas catalog-href="…/catalogo.pdf">
//     <h1 slot="title">Descargas</h1>
//     <p slot="description">…</p>
//     <img slot="catalog-cover" src="…" alt="">
//     <span slot="catalog-title">Catálogo Macroled ARQ 2026</span>
//     <span slot="catalog-description">…</span>
//     <span slot="catalog-action">Descargar catálogo</span>
//     <h2 slot="search-title">Buscar archivos por producto</h2>
//     <h2 slot="modal-title">Descargas</h2>
//   </arq-descargas>
//
// - Filtros: panel lateral (filter-panel) de downloads-table; de las dos
//   propuestas se eligió esta (decisiones.md, 2026-10-15 · Descargas ·
//   propuesta final).
// - Catálogo: Desktop, tapa a la izquierda y textos con button Outline;
//   Mobile, tapa chica, nombre role/body-xl, bajada role/body-compact-regular y
//   button Underline (2561:20649). El button y los estilos de texto cambian con
//   el breakpoint (matchMedia).
// - El modal (download-modal show-product) muestra la miniatura, el SKU y la
//   variante («Negro, 6 W, luz cálida») y los archivos como download-file-row:
//   «Ficha técnica» (PDF; emite arq:datasheet { sku }, como la ficha) y los de
//   ese SKU con su formato. TODO (datos): el peso de cada archivo no está en la
//   base.

import { ArqElement } from '../../base/arq-element.js';
import { getDownloadsTable, skuDownloads } from '../../data/catalog.js';
import '../button/button.js';
import '../downloads-table/downloads-table.js';
import '../download-modal/download-modal.js';
import '../download-file-row/download-file-row.js';
import css from './descargas.css?inline';

const TEXT = {
  empty: 'Todavía no hay productos para descargar.',
  error: 'No se pudieron cargar las descargas. Probá de nuevo en unos minutos.',
  label: 'Descargas por SKU',
  datasheet: 'Ficha técnica',
  datasheetFormat: 'PDF',
};

const MOBILE = '(max-width: 767px)';

// Formato de un archivo por la extensión de su URL («IES», «PDF», «DWG»).
function fileFormat(href) {
  const path = String(href ?? '').split(/[?#]/)[0];
  const ext = path.includes('.') ? path.slice(path.lastIndexOf('.') + 1) : '';
  return /^[a-z0-9]{1,5}$/i.test(ext) ? ext.toUpperCase() : '';
}

class ArqDescargas extends ArqElement {
  static tag = 'arq-descargas';
  static styles = css;
  static properties = {
    catalogHref: { type: String }, // URL del PDF del catálogo general
  };
  static template =
    `<div class="hero">` +
    `<div class="heading">` +
    `<div class="title role-display"><slot name="title"></slot></div>` +
    `<div class="description role-body-regular"><slot name="description"></slot></div>` +
    `</div>` +
    `<div class="catalog">` +
    `<div class="cover"><slot name="catalog-cover"></slot></div>` +
    `<div class="catalog-info">` +
    `<div class="catalog-title"><slot name="catalog-title"></slot></div>` +
    `<div class="catalog-description"><slot name="catalog-description"></slot></div>` +
    `<div class="catalog-actions"><arq-button class="catalog-action" show-icon icon="download"><slot name="catalog-action"></slot></arq-button></div>` +
    `</div>` +
    `</div>` +
    `</div>` +
    `<div class="search-section">` +
    `<div class="search-title role-heading-1"><slot name="search-title"></slot></div>` +
    `<p class="status role-body" role="status" hidden></p>` +
    `<arq-downloads-table class="table" downloads="downloads-modal"></arq-downloads-table>` +
    `</div>` +
    `<arq-download-modal id="downloads-modal" show-product><slot name="modal-title" slot="title"></slot></arq-download-modal>`;

  #media = null;
  #rows = new Map();

  setup() {
    const root = this.shadowRoot;
    const table = root.querySelector('.table');
    table.label = TEXT.label;
    table.addEventListener('arq:downloads', (event) => this.#fillModal(event.detail.sku));
    root.querySelector('arq-download-modal').addEventListener('arq:download', (event) => {
      // Solo la ficha técnica (sin href) emite arq:download: se genera.
      event.stopPropagation();
      const { sku } = event.currentTarget;
      if (sku) this.emit('datasheet', { sku });
    });
    this.#media = matchMedia(MOBILE);
    this.#media.addEventListener('change', () => this.#breakpoint());
    this.#breakpoint();
    this.#load();
  }

  update(changed) {
    const root = this.shadowRoot;
    if (changed.has('catalogHref')) {
      const action = root.querySelector('.catalog-action');
      action.href = this.catalogHref || null;
      action.target = this.catalogHref ? '_blank' : null;
    }
  }

  // Catálogo: Desktop button Outline, nombre role/heading-3 y bajada role/body;
  // Mobile button Underline, nombre role/body-xl y bajada role/body-compact-regular.
  #breakpoint() {
    const mobile = this.#media.matches;
    const root = this.shadowRoot;
    const action = root.querySelector('.catalog-action');
    action.type = mobile ? 'underline' : 'outline';
    action.showUnderline = mobile;
    root.querySelector('.catalog-title').className = `catalog-title ${mobile ? 'role-body-xl' : 'role-heading-3'}`;
    root.querySelector('.catalog-description').className = `catalog-description ${mobile ? 'role-body-compact-regular' : 'role-body'}`;
  }

  async #load() {
    const table = this.shadowRoot.querySelector('.table');
    this.setAttribute('aria-busy', 'true');
    table.loading = true;
    this.#status('');
    let data = null;
    try {
      data = await getDownloadsTable();
    } catch (error) {
      console.error('[arq] descargas: no se pudo cargar el catálogo', error);
    }
    this.removeAttribute('aria-busy');
    table.loading = false;
    if (!data) {
      table.hidden = true;
      this.#status(TEXT.error);
      return;
    }
    this.#rows = new Map(data.rows.map((row) => [row.sku, row]));
    this.#status(data.rows.length ? '' : TEXT.empty);
    table.data = data;
    table.hidden = !data.rows.length;
  }

  #status(message) {
    const status = this.shadowRoot.querySelector('.status');
    status.textContent = message;
    status.hidden = !message;
  }

  // El modal se abre al hacer clic (downloads-table); los archivos llegan
  // enseguida porque el catálogo ya está cargado.
  async #fillModal(sku) {
    const modal = this.shadowRoot.querySelector('arq-download-modal');
    const row = this.#rows.get(sku);
    modal.sku = sku;
    modal.meta = row?.meta ?? '';
    modal.thumb = row?.thumb ?? null;
    for (const item of modal.querySelectorAll(':scope > arq-download-file-row')) item.remove();
    modal.append(this.#fileRow(TEXT.datasheet, TEXT.datasheetFormat));
    const files = await skuDownloads(sku);
    if (modal.sku !== sku) return;
    modal.append(...files.map((file) => this.#fileRow(file.label, fileFormat(file.href), file.href)));
  }

  #fileRow(label, format, href) {
    const item = document.createElement('arq-download-file-row');
    if (href) item.href = href;
    item.append(label);
    if (format) {
      const meta = document.createElement('span');
      meta.slot = 'meta';
      meta.textContent = format;
      item.append(meta);
    }
    return item;
  }
}

ArqDescargas.define();

export { ArqDescargas };
