// glosario · contenedor de página (Final: Glosario 1795:18553 Desktop ·
// 1795:18955 Mobile)
//
// Página Glosario: variants-table con todos los SKU del catálogo y el modal de
// descargas de cada fila. El embed imprime el page-header (breadcrumb, <h1> y
// bajada); el componente pide las filas a getGlossary() (src/data/catalog.js),
// como coleccion.
//
//   <arq-glosario>
//     <h2 slot="modal-title">Descargas</h2>
//   </arq-glosario>
//
// - Sin descargas en la barra de la tabla: en la ficha son las del grupo y acá
//   no hay grupo (Final oculta CAD 2D/3D y Manual).
// - "Ficha técnica" del modal emite arq:datasheet { sku }, como la ficha.
//   TODO (diseño): el PDF no tiene diseño; se genera cuando exista.

import { ArqElement } from '../../base/arq-element.js';
import { getGlossary, skuDownloads } from '../../data/catalog.js';
import '../variants-table/variants-table.js';
import '../download-modal/download-modal.js';
import '../download-item/download-item.js';
import css from './glosario.css?inline';

const TEXT = {
  loading: 'Cargando glosario…',
  empty: 'Todavía no hay productos en el glosario.',
  error: 'No se pudo cargar el glosario. Probá de nuevo en unos minutos.',
  label: 'Glosario de productos',
  datasheet: 'Ficha técnica',
};

class ArqGlosario extends ArqElement {
  static tag = 'arq-glosario';
  static styles = css;
  static properties = {};
  static template =
    `<p class="status role-body" role="status" hidden></p>` +
    `<arq-variants-table class="table" downloads="downloads-modal" hidden></arq-variants-table>` +
    `<arq-download-modal id="downloads-modal"><slot name="modal-title" slot="title"></slot></arq-download-modal>`;

  setup() {
    const root = this.shadowRoot;
    root.querySelector('.table').label = TEXT.label;
    root.querySelector('.table').addEventListener('arq:downloads', (event) => this.#fillModal(event.detail.sku));
    root.querySelector('arq-download-modal').addEventListener('arq:download', (event) => {
      event.stopPropagation();
      const { sku } = event.currentTarget.dataset;
      if (sku) this.emit('datasheet', { sku });
    });
    this.#load();
  }

  async #load() {
    this.setAttribute('aria-busy', 'true');
    this.#status(TEXT.loading);
    let data = null;
    try {
      data = await getGlossary();
    } catch (error) {
      console.error('[arq] glosario: no se pudo cargar el catálogo', error);
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
    modal.dataset.sku = sku;
    const featured = document.createElement('arq-download-item');
    featured.emphasis = 'featured';
    featured.textContent = TEXT.datasheet;
    for (const item of modal.querySelectorAll(':scope > arq-download-item')) item.remove();
    modal.append(featured);
    const files = await skuDownloads(sku);
    if (modal.dataset.sku !== sku) return;
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

ArqGlosario.define();

export { ArqGlosario };
