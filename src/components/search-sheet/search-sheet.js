// search-sheet · COMPONENTE DE PRUEBA (no existe en Figma)
//
// Búsqueda en Desktop como top sheet: un panel que baja desde arriba, a todo
// el ancho, sobre la página con scrim. Arriba la barra (logo + cerrar), después
// el search-field Type=Line y debajo el contenido según State.
//
//   <arq-search-sheet>
//     <!-- state="recommended" (por defecto) -->
//     <arq-product-card slot="recommended" size="small" href="…">…</arq-product-card>
//     <arq-button slot="all" type="underline" show-underline show-icon icon="arrow-right" href="/arq/productos">Ver todos los productos</arq-button>
//     <!-- state="results" / "no-results" -->
//     <section slot="results"><h3 class="group-title">Productos</h3><arq-search-result …>…</arq-search-result></section>
//   </arq-search-sheet>
//   sheet.show(opener) · sheet.close()
//
// - State: recommended (campo vacío: tarjetas de productos + link "todos"),
//   results (hay coincidencias) o no-results. Lo pone quien la usa (navbar).
//   No es un State de Figma: es de prueba.
// - Diálogo modal nativo (<dialog> + showModal): el foco arranca en el campo
//   y queda adentro; Esc, la cruz o un clic en el scrim cierran (arq:close) y
//   el foco vuelve a opener. La página de atrás no se desplaza (scroll-lock).
// - Baja con arq-search-sheet-in (transform, motion/duration/base). Sin
//   animación de cierre: el diálogo nativo se cierra al instante.
// - Los eventos del campo (arq:input, arq:submit, arq:navigate) salen del
//   componente; field devuelve el search-field.
// - Solo Desktop: en Mobile la búsqueda sigue siendo search-screen. TODO
//   (diseño): definir el Mobile del sheet si se adopta.

import { ArqElement } from '../../base/arq-element.js';
import { containScroll } from '../../base/scroll-lock.js';
import '../logo/logo.js';
import '../icon-button/icon-button.js';
import '../search-field/search-field.js';
import css from './search-sheet.css?inline';

class ArqSearchSheet extends ArqElement {
  static tag = 'arq-search-sheet';
  static styles = css;
  static properties = {
    open: { type: Boolean },
    state: { type: String, values: ['recommended', 'results', 'no-results'], default: 'recommended' },
    label: { type: String, default: 'Buscar' }, // nombre del diálogo
    recommendedTitle: { type: String, default: 'Productos recomendados' },
  };
  static template =
    `<dialog class="dialog">` +
    `<div class="sheet">` +
    `<div class="bar">` +
    `<arq-logo class="logo"></arq-logo>` +
    `<arq-icon-button class="close" icon="close">Cerrar búsqueda</arq-icon-button>` +
    `</div>` +
    `<div class="field-row"><arq-search-field class="field" type="line"></arq-search-field></div>` +
    `<div class="content">` +
    `<div class="recommended">` +
    `<p class="title role-label"></p>` +
    `<div class="cards"><slot name="recommended"></slot></div>` +
    `<div class="all"><slot name="all"></slot></div>` +
    `</div>` +
    `<div class="results"><slot name="results"></slot></div>` +
    `</div>` +
    `</div>` +
    `</dialog>`;

  #dialog = null;
  #opener = null;

  get field() {
    return this.shadowRoot.querySelector('arq-search-field');
  }

  setup() {
    const root = this.shadowRoot;
    this.#dialog = root.querySelector('dialog');
    containScroll(this.#dialog);
    root.querySelector('.close').addEventListener('click', () => this.close());
    this.#dialog.addEventListener('cancel', (event) => {
      event.preventDefault();
      this.close();
    });
    // Clic en el scrim: el <dialog> ocupa todo el ancho y el panel es su único
    // hijo, así que un clic cuyo destino es el <dialog> cayó fuera del panel.
    this.#dialog.addEventListener('click', (event) => {
      if (event.target === this.#dialog) this.close();
    });
  }

  update(changed) {
    const root = this.shadowRoot;
    if (changed.has('label')) this.#dialog.setAttribute('aria-label', this.label ?? '');
    if (changed.has('recommendedTitle')) root.querySelector('.title').textContent = this.recommendedTitle ?? '';
    root.querySelector('.recommended').hidden = this.state !== 'recommended';
    root.querySelector('.results').hidden = this.state === 'recommended';
    if (changed.has('open')) {
      if (this.open && !this.#dialog.open) {
        this.#dialog.showModal();
        requestAnimationFrame(() => this.field.focus());
      } else if (!this.open && this.#dialog.open) {
        this.#dialog.close();
        this.#opener?.focus?.();
        this.#opener = null;
      }
    }
  }

  /** Abre el sheet. El foco vuelve a opener al cerrar. */
  show(opener = null) {
    this.#opener = opener;
    this.open = true;
  }

  /** Cierra el sheet y emite arq:close. */
  close() {
    if (!this.open) return;
    this.open = false;
    this.emit('close');
  }
}

ArqSearchSheet.define();

export { ArqSearchSheet };
