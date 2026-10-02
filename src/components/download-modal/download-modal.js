// download-modal · Figma 1375:4948 · ficha doc/download-modal
//
// Modal de descargas de la ficha: la ficha técnica (download-item Featured) y
// los archivos del SKU elegido (download-item Default). Lo abren los botones de
// Descargas de la ficha y el ícono de descarga de cada fila del glosario.
//
//   <arq-download-modal>
//     <h2 slot="title">Descargas</h2>
//     <arq-download-item emphasis="featured">Ficha técnica</arq-download-item>
//     <arq-download-item href="…/kanu.ies">IES</arq-download-item>
//   </arq-download-modal>
//
//   boton.addEventListener('click', () => modal.show(boton));
//
// - Diálogo modal nativo (<dialog> + showModal): el foco queda adentro, Esc y el
//   scrim (color/overlay/scrim, siempre) lo cierran y el foco vuelve al botón
//   que lo abrió.
// - Desktop: esquina inferior derecha a layout/gutter de los bordes, ancho
//   layout/filter-panel. Mobile: abajo, a layout/gutter de los bordes y
//   ocupando el ancho (decisión 2026-10-02 · download-modal).
// - La opción Featured va primero; las Default en una lista.

import { ArqElement } from '../../base/arq-element.js';
import '../icon-button/icon-button.js';
import '../download-item/download-item.js';
import css from './download-modal.css?inline';

class ArqDownloadModal extends ArqElement {
  static tag = 'arq-download-modal';
  static styles = css;
  static properties = {
    open: { type: Boolean },
  };
  static template =
    `<dialog class="dialog">` +
    `<div class="sheet">` +
    `<div class="header">` +
    `<div class="title role-heading-1"><slot name="title"></slot></div>` +
    `<arq-icon-button icon="close" size="large" class="close">Cerrar descargas</arq-icon-button>` +
    `</div>` +
    `<div class="content">` +
    `<div class="featured"><slot name="featured"></slot></div>` +
    `<div class="list" role="list"><slot></slot></div>` +
    `</div>` +
    `</div>` +
    `</dialog>`;

  #dialog = null;
  #opener = null;

  setup() {
    this.#dialog = this.shadowRoot.querySelector('dialog');
    this.shadowRoot.querySelector('.close').addEventListener('click', () => this.close());
    // Scrim: el clic en el ::backdrop llega al <dialog> (el contenido está en .sheet).
    this.#dialog.addEventListener('click', (event) => {
      if (event.target === this.#dialog) this.close();
    });
    this.#dialog.addEventListener('cancel', (event) => {
      event.preventDefault();
      this.close();
    });
    // La opción Featured va en su lugar (arriba, fuera de la lista).
    const place = () => {
      for (const item of this.querySelectorAll(':scope > arq-download-item')) {
        const featured = item.getAttribute('emphasis') === 'featured';
        if (featured && item.slot !== 'featured') item.slot = 'featured';
        if (!featured && item.slot === 'featured') item.removeAttribute('slot');
      }
    };
    new MutationObserver(place).observe(this, { childList: true, attributes: true, subtree: true, attributeFilter: ['emphasis'] });
    place();
    this.shadowRoot.querySelector('slot[name="title"]').addEventListener('slotchange', () => this.#name());
    this.#name();
  }

  update(changed) {
    if (!changed.has('open')) return;
    if (this.open && !this.#dialog.open) this.#dialog.showModal();
    if (!this.open && this.#dialog.open) {
      this.#dialog.close();
      this.#opener?.focus?.();
      this.#opener = null;
    }
  }

  /** Abre el modal. El foco vuelve a `opener` (o al elemento con foco) al cerrar. */
  show(opener) {
    this.#opener = opener ?? this.#activeElement();
    this.open = true;
  }

  close() {
    this.open = false;
  }

  #activeElement() {
    let active = document.activeElement;
    while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
    const root = active?.getRootNode?.();
    return root instanceof ShadowRoot ? root.host : active;
  }

  #name() {
    const title = this.querySelector('[slot="title"]')?.textContent.trim();
    this.#dialog.setAttribute('aria-label', title || 'Descargas');
  }
}

ArqDownloadModal.define();

export { ArqDownloadModal };
