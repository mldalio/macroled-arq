// descargas · contenedor de página (Figma: Descargas (antes Glosario)
// 1801:19315 → Desktop 2496:31316 · Mobile 2496:31862 · modal 1802:30817 /
// 1802:30903)
//
// Página Descargas (antes Glosario, decisiones.md 2026-10-06 · Descargas):
// arriba, el título con su bajada y la download-card del catálogo general;
// debajo, «Buscar producto» con variants-table (todos los SKU del catálogo,
// buscador por SKU o nombre) y el modal de descargas de cada fila. El embed
// imprime los textos y la tarjeta por slot; el componente pide las filas a
// getDownloadsTable() (src/data/catalog.js), como coleccion.
//
//   <arq-descargas>
//     <h1 slot="title">Descargas</h1>
//     <p slot="description">…</p>
//     <arq-download-card slot="catalog" href="…" show-description>…</arq-download-card>
//     <h2 slot="search-title">Buscar producto</h2>
//     <h2 slot="modal-title">Descargas</h2>
//   </arq-descargas>
//
// - Sin page-header: el bloque de arriba es propio de la página (título
//   role/display y bajada role/body-lg a la izquierda, la tarjeta a la derecha;
//   en Mobile, apilados).
//
// - Sin descargas en la barra de la tabla: en la ficha son las del grupo y acá
//   no hay grupo.
// - El modal muestra el SKU debajo del título. "Ficha técnica" emite
//   arq:datasheet { sku }, como la ficha; los archivos llevan los nombres de
//   siempre (los formatos de Figma, «DWG + STEP», son de ejemplo).
//   TODO (diseño): el PDF no tiene diseño; se genera cuando exista.
//   «Descargar todo (.zip)» de Figma queda afuera por ahora.

import { ArqElement } from '../../base/arq-element.js';
import { getDownloadsTable, skuDownloads } from '../../data/catalog.js';
import '../variants-table/variants-table.js';
import '../download-modal/download-modal.js';
import '../download-item/download-item.js';
import css from './descargas.css?inline';

const TEXT = {
  loading: 'Cargando descargas…',
  empty: 'Todavía no hay productos para descargar.',
  error: 'No se pudieron cargar las descargas. Probá de nuevo en unos minutos.',
  label: 'Descargas por SKU',
  datasheet: 'Ficha técnica',
};

class ArqDescargas extends ArqElement {
  static tag = 'arq-descargas';
  static styles = css;
  static properties = {};
  static template =
    `<div class="hero">` +
    `<div class="heading">` +
    `<div class="title role-display"><slot name="title"></slot></div>` +
    `<div class="description role-body-lg"><slot name="description"></slot></div>` +
    `</div>` +
    `<div class="catalog"><slot name="catalog"></slot></div>` +
    `</div>` +
    `<div class="search-section">` +
    `<div class="search-title role-display-sm"><slot name="search-title"></slot></div>` +
    `<p class="status role-body" role="status" hidden></p>` +
    `<arq-variants-table class="table" downloads="downloads-modal" show-search hidden></arq-variants-table>` +
    `</div>` +
    `<arq-download-modal id="downloads-modal"><slot name="modal-title" slot="title"></slot></arq-download-modal>`;

  setup() {
    const root = this.shadowRoot;
    root.querySelector('.table').label = TEXT.label;
    root.querySelector('.table').addEventListener('arq:downloads', (event) => this.#fillModal(event.detail.sku));
    root.querySelector('arq-download-modal').addEventListener('arq:download', (event) => {
      // Solo la ficha técnica (sin href) emite arq:download: se genera.
      event.stopPropagation();
      const { sku } = event.currentTarget;
      if (sku) this.emit('datasheet', { sku });
    });
    this.#load();
  }

  async #load() {
    this.setAttribute('aria-busy', 'true');
    this.#status(TEXT.loading);
    let data = null;
    try {
      data = await getDownloadsTable();
    } catch (error) {
      console.error('[arq] descargas: no se pudo cargar el catálogo', error);
    }
    this.removeAttribute('aria-busy');
    if (!data) {
      this.#status(TEXT.error);
      return;
    }
    this.#status(data.rows.length ? '' : TEXT.empty);
    const table = this.shadowRoot.querySelector('.table');
    table.data = data;
    table.hidden = !data.rows.length;
  }

  #status(message) {
    const status = this.shadowRoot.querySelector('.status');
    status.textContent = message;
    status.hidden = !message;
  }

  // El modal se abre al hacer clic (variants-table); los archivos llegan
  // enseguida porque el catálogo ya está cargado.
  async #fillModal(sku) {
    const modal = this.shadowRoot.querySelector('arq-download-modal');
    modal.sku = sku;
    const datasheet = document.createElement('arq-download-item');
    datasheet.textContent = TEXT.datasheet;
    for (const item of modal.querySelectorAll(':scope > arq-download-item')) item.remove();
    modal.append(datasheet);
    const files = await skuDownloads(sku);
    if (modal.sku !== sku) return;
    modal.append(
      ...files.map((file) => {
        const item = document.createElement('arq-download-item');
        item.href = file.href;
        item.textContent = file.label;
        return item;
      }),
    );
  }
}

ArqDescargas.define();

export { ArqDescargas };
