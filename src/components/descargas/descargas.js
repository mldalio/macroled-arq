// descargas · contenedor de página (Figma: «Descargas · propuesta final
// (desktop y mobile)» 2575:22875 → Desktop 2564:20607 · Mobile 2558:20149 ·
// modal 2554:20132 / 2554:20214)
//
// Página Descargas: «Buscar archivos por producto» con variants-table
// type="catalog" (todos los SKU del catálogo, buscador y filtros de selección
// múltiple) y el modal de descargas de cada fila. El catálogo general vive en
// /arq/catalogos. El embed imprime los textos por slot; el componente pide las
// filas a getDownloadsTable() (src/data/catalog.js).
//
//   <arq-descargas>
//     <h1 slot="search-title">Buscar archivos por producto</h1>
//     <h2 slot="modal-title">Descargas</h2>
//   </arq-descargas>
//
// - Filtros: panel lateral (filter-panel) de variants-table; de las dos
//   propuestas se eligió esta (decisiones.md, 2026-10-15 · Descargas ·
//   propuesta final).
// - El modal (download-modal show-product) muestra la miniatura, el SKU y la
//   variante («Negro, 6 W, luz cálida») y los archivos como download-item:
//   «Ficha técnica» (Featured; emite arq:datasheet { sku }, como la ficha) y los
//   de ese SKU (Default), solo con el nombre.

import { ArqElement } from '../../base/arq-element.js';
import { getDownloadsTable, skuDownloads } from '../../data/catalog.js';
import '../button/button.js';
import '../variants-table/variants-table.js';
import '../download-modal/download-modal.js';
import '../download-item/download-item.js';
import css from './descargas.css?inline';

const TEXT = {
  empty: 'Todavía no hay productos para descargar.',
  error: 'No se pudieron cargar las descargas. Probá de nuevo en unos minutos.',
  // TODO (diseño): «Reintentar» no está en la propuesta; button Underline.
  retry: 'Reintentar',
  label: 'Descargas por SKU',
  datasheet: 'Ficha técnica',
};

class ArqDescargas extends ArqElement {
  static tag = 'arq-descargas';
  static styles = css;
  static template =
    `<div class="search-section">` +
    `<div class="search-title role-heading-1"><slot name="search-title"></slot></div>` +
    `<p class="status role-body" role="status"></p>` +
    `<arq-button class="retry" type="underline" show-underline hidden>${TEXT.retry}</arq-button>` +
    `<arq-variants-table class="table" type="catalog" downloads="downloads-modal"></arq-variants-table>` +
    `</div>` +
    `<arq-download-modal id="downloads-modal" show-product><slot name="modal-title" slot="title"></slot></arq-download-modal>`;

  #rows = new Map();
  #titleObserver = new ResizeObserver((entries) => {
    const width = entries[0]?.contentRect.width;
    if (width > 0) this.shadowRoot.querySelector('.table').style.setProperty('--arq-download-search-width', `${width}px`);
  });

  connectedCallback() {
    super.connectedCallback();
    this.#titleObserver.observe(this.shadowRoot.querySelector('.search-title'));
  }

  disconnectedCallback() {
    this.#titleObserver.disconnect();
  }

  setup() {
    const root = this.shadowRoot;
    const table = root.querySelector('.table');
    table.label = TEXT.label;
    table.addEventListener('arq:downloads', (event) => this.#fillModal(event.detail.sku));
    root.querySelector('arq-download-modal').addEventListener('arq:download', (event) => {
      // Solo la ficha técnica (sin href) emite arq:download: se genera. El PDF
      // lo arma src/pdf/ (main.js), que deja la promesa en detail.pending:
      // mientras tanto la fila dice «Generando…», como el botón de la ficha.
      event.stopPropagation();
      const { sku } = event.currentTarget;
      if (!sku) return;
      const detail = { sku };
      this.emit('datasheet', detail);
      const row = event.target.closest?.('arq-download-item');
      if (!row || !detail.pending) return;
      row.loading = true;
      const done = () => (row.loading = false);
      detail.pending.then(done, done);
    });
    root.querySelector('.retry').addEventListener('click', () => this.#load());
    this.#load();
  }

  async #load() {
    const table = this.shadowRoot.querySelector('.table');
    const retry = this.shadowRoot.querySelector('.retry');
    const retried = !retry.hidden;
    retry.hidden = true;
    table.hidden = false;
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
      retry.hidden = false;
      return;
    }
    // Después de reintentar, el foco va al buscador (el botón desapareció)
    if (retried) requestAnimationFrame(() => table.shadowRoot?.querySelector('.search')?.focus());
    this.#rows = new Map(data.rows.map((row) => [row.sku, row]));
    this.#status(data.rows.length ? '' : TEXT.empty);
    table.data = data;
    table.hidden = !data.rows.length;
  }

  #status(message) {
    const status = this.shadowRoot.querySelector('.status');
    status.textContent = message;
  }

  // El modal se abre al hacer clic (variants-table); los archivos llegan
  // enseguida porque el catálogo ya está cargado.
  async #fillModal(sku) {
    const modal = this.shadowRoot.querySelector('arq-download-modal');
    const row = this.#rows.get(sku);
    modal.sku = sku;
    modal.meta = row?.meta ?? '';
    modal.thumb = row?.thumb ?? null;
    for (const item of modal.querySelectorAll(':scope > arq-download-item')) item.remove();
    const datasheet = this.#fileRow(TEXT.datasheet);
    datasheet.emphasis = 'featured';
    modal.append(datasheet);
    const files = await skuDownloads(sku);
    if (modal.sku !== sku) return;
    modal.append(...files.map((file) => this.#fileRow(file.label, file.href)));
  }

  #fileRow(label, href) {
    const item = document.createElement('arq-download-item');
    if (href) item.href = href;
    item.append(label);
    return item;
  }
}

ArqDescargas.define();

export { ArqDescargas };
