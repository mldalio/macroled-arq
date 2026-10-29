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
//   que lo abrió. Mientras está abierto, la página de atrás no se desplaza
//   (containScroll, src/base/scroll-lock.js).
// - Desktop: esquina inferior derecha a layout/gutter de los bordes, ancho
//   layout/filter-panel. Mobile: abajo, a layout/gutter de los bordes y
//   ocupando el ancho (decisión 2026-10-02 · download-modal).
// - La opción Featured va primero; las Default en una lista.
// - sku="<código>": sku Compact debajo del título (página Descargas, Figma
//   1802:30817 · 1802:30903). «Descargar todo (.zip)» de Figma queda afuera
//   por ahora (decisiones.md, 2026-10-06 · Descargas).
// - show-product (solo de código; Descargas · propuesta 2575:22875, modal
//   2554:20048 · 2554:20133): debajo del título, el producto (miniatura
//   thumb, sku Compact y meta «Negro, 6 W, luz cálida») y los archivos como
//   download-file-row, a space/gap/xl. En Mobile es una hoja pegada al borde
//   inferior, a todo el ancho.
//   Sin sku, la misma hoja sin el bloque de producto: título y archivos
//   (archivos generales de la ficha, decisión 2026-10-29).
// - Entrada y salida (decisiones.md, 2026-10-15 · Descargas): el scrim funde
//   y el panel sube desde abajo (Mobile, hoja: translateY(100%); Desktop:
//   funde y sube un 2 %), y cierra por el mismo camino. Duración como
//   filter-panel (motion/duration/slow × 1,25), curva motion/easing/standard.
//   Con reduced motion las duraciones valen 0.

import { ArqElement } from '../../base/arq-element.js';
import { containScroll } from '../../base/scroll-lock.js';
import '../icon-button/icon-button.js';
import '../download-item/download-item.js';
import '../sku/sku.js';
import css from './download-modal.css?inline';

class ArqDownloadModal extends ArqElement {
  static tag = 'arq-download-modal';
  static styles = css;
  static properties = {
    open: { type: Boolean },
    sku: { type: String }, // SKU de las descargas (sku Compact debajo del título)
    showProduct: { type: Boolean }, // solo de código: bloque de producto (Descargas · propuesta)
    thumb: { type: String }, // miniatura del producto (show-product)
    meta: { type: String }, // resumen de la variante (show-product)
  };
  static template =
    `<dialog class="dialog" data-arq-theme="light">` +
    `<div class="sheet">` +
    `<div class="header">` +
    `<div class="title-wrap">` +
    `<div class="title role-heading-2"><slot name="title"></slot></div>` +
    `<arq-sku class="sku" size="compact" hidden></arq-sku>` +
    `</div>` +
    `<arq-icon-button icon="close" size="large" class="close">Cerrar descargas</arq-icon-button>` +
    `</div>` +
    `<div class="product" hidden>` +
    `<span class="thumb"><img alt="" hidden></span>` +
    `<span class="product-info"><arq-sku class="product-sku" size="compact"></arq-sku><span class="meta role-body-compact-regular"></span></span>` +
    `</div>` +
    `<div class="content">` +
    `<div class="featured"><slot name="featured"></slot></div>` +
    `<slot name="message"></slot>` +
    `<div class="list" role="list"><slot></slot></div>` +
    `</div>` +
    `</div>` +
    `</dialog>`;

  #dialog = null;
  #opener = null;
  #closing = null;

  setup() {
    this.#dialog = this.shadowRoot.querySelector('dialog');
    const img = this.shadowRoot.querySelector('.thumb img');
    // Sin imagen (o si no carga): queda el fondo color/surface/subtle.
    img.addEventListener('error', () => (img.hidden = true));
    img.addEventListener('load', () => (img.hidden = false));
    containScroll(this.#dialog);
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
    if (changed.has('sku') || changed.has('showProduct')) {
      const sku = this.shadowRoot.querySelector('.sku');
      sku.textContent = this.sku ?? '';
      sku.hidden = !this.sku || this.showProduct;
      this.shadowRoot.querySelector('.product-sku').textContent = this.sku ?? '';
      // Sin sku (archivos generales de la ficha), la misma hoja sin el producto
      this.shadowRoot.querySelector('.product').hidden = !this.showProduct || !this.sku;
    }
    if (changed.has('meta')) {
      const meta = this.shadowRoot.querySelector('.meta');
      meta.textContent = this.meta ?? '';
      meta.hidden = !this.meta;
    }
    if (changed.has('thumb')) {
      const img = this.shadowRoot.querySelector('.thumb img');
      if (this.thumb) img.src = this.thumb;
      else {
        img.removeAttribute('src');
        img.hidden = true;
      }
    }
    if (!changed.has('open')) return;
    if (this.open) this.#showDialog();
    else if (this.#dialog.open) this.#closeDialog();
  }

  // Entrada y salida como filter-panel: is-open dispara la transición (CSS) y
  // el <dialog> se cierra recién cuando termina, así sale por donde entró.
  // Mientras el panel entra, el <dialog> no se desplaza (overflow: clip hasta
  // is-settled): showModal() enfoca el primer control, que todavía está fuera
  // de la pantalla, y el navegador desplazaba el <dialog> para mostrarlo; el
  // desplazamiento y la transición se peleaban (en Mobile la hoja subía y
  // bajaba). Al terminar la entrada vuelve el scroll, por si el panel no entra.
  #showDialog() {
    const dialog = this.#dialog;
    const sheet = this.shadowRoot.querySelector('.sheet');
    clearTimeout(this.#closing);
    this.#closing = null;
    if (!dialog.open) {
      dialog.classList.remove('is-settled');
      dialog.showModal();
      dialog.scrollTop = 0;
      void dialog.offsetHeight; // fija el estado inicial antes de is-open
    }
    dialog.classList.add('is-open');
    const settle = (event) => {
      // transform; con reduced motion solo funde: opacity
      if (event && (event.target !== sheet || !['transform', 'opacity'].includes(event.propertyName))) return;
      sheet.removeEventListener('transitionend', settle);
      if (dialog.classList.contains('is-open')) dialog.classList.add('is-settled');
    };
    if (!parseFloat(getComputedStyle(sheet).transitionDuration)) settle();
    else sheet.addEventListener('transitionend', settle);
  }

  #closeDialog() {
    const dialog = this.#dialog;
    if (this.#closing) return;
    dialog.classList.remove('is-open', 'is-settled');
    const { transitionDuration } = getComputedStyle(this.shadowRoot.querySelector('.sheet'));
    const ms = Math.max(0, ...transitionDuration.split(',').map((value) => (parseFloat(value) || 0) * (value.trim().endsWith('ms') ? 1 : 1000)));
    this.#closing = setTimeout(() => {
      this.#closing = null;
      dialog.close();
      this.#opener?.focus?.();
      this.#opener = null;
    }, ms);
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
