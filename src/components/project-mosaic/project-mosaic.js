// project-mosaic · componente de layout de página (DESIGN.md §12: se resuelve
// en código, con grid + aspect-ratio; no es un set de Figma)
//
// Mosaico de fotos de proyectos del Home ("Diseño que inspira").
//
//   <arq-project-mosaic>
//     <img src="…" alt="Balizas Kanu en un patio con muros de hormigón" loading="lazy">
//     <img src="…" alt="…" loading="lazy">
//     <img src="…" alt="…" loading="lazy">
//     <img src="…" alt="…" loading="lazy">
//   </arq-project-mosaic>
//
// - Desktop: la 1.ª ocupa la mitad izquierda a todo el alto; la 2.ª la mitad
//   derecha arriba; la 3.ª y la 4.ª abajo a la derecha, una al lado de la otra.
// - Mobile: la 1.ª a todo el ancho y la 2.ª y la 3.ª debajo; la 4.ª no se ve.
// - Las fotos llegan por slot y son contenido: van con alt descriptivo.
// - Más de cuatro: no se muestran (la cantidad de las galerías está pendiente,
//   DESIGN.md §12).

import { ArqElement } from '../../base/arq-element.js';
import { containScroll } from '../../base/scroll-lock.js';
import css from './project-mosaic.css?inline';

const FRAMES = 4;

class ArqProjectMosaic extends ArqElement {
  static tag = 'arq-project-mosaic';
  static styles = css;
  static properties = {
    bleed: { type: Boolean }, // fotos al borde de la página, con 5px entre ellas
    zoom: { type: Boolean }, // solo código: hover zoom y clic para ampliar (Nosotros)
  };
  static template =
    `<div class="mosaic">` +
    `<slot></slot>` +
    Array.from({ length: FRAMES }, (_, i) =>
      `<button type="button" class="frame" data-index="${i}" hidden>` +
      `<slot name="m${i}"></slot>` +
      `</button>`).join('') +
    `</div>` +
    `<dialog class="lightbox" data-arq-theme="dark" aria-label="Foto ampliada">` +
    `<div class="lightbox-bar">` +
    `<p class="lightbox-count role-body" aria-live="polite"></p>` +
    `<arq-icon-button class="lightbox-close" icon="close" size="large" background="subtle">Cerrar</arq-icon-button>` +
    `</div>` +
    `<div class="lightbox-stage">` +
    `<arq-icon-button class="lightbox-prev" icon="chevron-left" size="large" background="subtle">Foto anterior</arq-icon-button>` +
    `<img class="lightbox-image" alt="">` +
    `<arq-icon-button class="lightbox-next" icon="chevron-right" size="large" background="subtle">Foto siguiente</arq-icon-button>` +
    `</div>` +
    `</dialog>`;

  #index = 0;
  #opener = null;

  setup() {
    const root = this.shadowRoot;
    const dialog = root.querySelector('.lightbox');
    root.querySelector('slot:not([name])').addEventListener('slotchange', () => this.#assign());
    root.querySelectorAll('.frame').forEach((frame) => {
      frame.addEventListener('click', () => this.#open(Number(frame.dataset.index)));
    });
    containScroll(dialog);
    root.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
    root.querySelector('.lightbox-prev').addEventListener('click', () => this.#step(-1));
    root.querySelector('.lightbox-next').addEventListener('click', () => this.#step(1));
    dialog.addEventListener('click', (event) => {
      if (event.target.closest('img, arq-icon-button, .lightbox-bar')) return;
      dialog.close();
    });
    dialog.addEventListener('cancel', (event) => {
      event.preventDefault();
      dialog.close();
    });
    dialog.addEventListener('close', () => this.#opener?.focus());
    dialog.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        this.#step(-1);
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        this.#step(1);
      }
    });
  }

  update() {
    this.#assign();
  }

  #images() {
    return [...this.querySelectorAll(':scope > img')].slice(0, FRAMES);
  }

  // Con zoom cada foto entra en un botón (el recorte del hover y el clic).
  // Sin zoom siguen en el slot de siempre: el Home no cambia.
  #assign() {
    const images = this.#images();
    images.forEach((img, i) => {
      const name = `m${i}`;
      if (this.zoom) {
        if (img.getAttribute('slot') !== name) img.setAttribute('slot', name);
      } else if (img.hasAttribute('slot')) {
        img.removeAttribute('slot');
      }
    });
    this.shadowRoot.querySelectorAll('.frame').forEach((frame, i) => {
      const img = images[i];
      frame.hidden = !this.zoom || !img;
      if (img) frame.setAttribute('aria-label', `Ampliar: ${img.getAttribute('alt') || 'foto'}`);
    });
  }

  #open(index) {
    const img = this.#images()[index];
    if (!img?.getAttribute('src')) return;
    const photos = this.#images().filter((item) => item.getAttribute('src'));
    this.#index = photos.indexOf(img);
    this.#opener = this.shadowRoot.querySelector(`.frame[data-index="${index}"]`);
    this.#show();
    const dialog = this.shadowRoot.querySelector('.lightbox');
    if (!dialog.open) dialog.showModal();
    this.shadowRoot.querySelector('.lightbox-close').focus();
  }

  #step(direction) {
    const photos = this.#images().filter((img) => img.getAttribute('src'));
    if (photos.length < 2) return;
    this.#index = (this.#index + direction + photos.length) % photos.length;
    this.#show();
  }

  #show() {
    const photos = this.#images().filter((img) => img.getAttribute('src'));
    const img = photos[this.#index];
    if (!img) return;
    const root = this.shadowRoot;
    const view = root.querySelector('.lightbox-image');
    view.src = img.getAttribute('src');
    view.alt = img.getAttribute('alt') || '';
    const current = String(this.#index + 1).padStart(2, '0');
    const total = String(photos.length).padStart(2, '0');
    root.querySelector('.lightbox-count').textContent = `${current} / ${total}`;
    root.querySelector('.lightbox-prev').hidden = photos.length < 2;
    root.querySelector('.lightbox-next').hidden = photos.length < 2;
  }
}

ArqProjectMosaic.define();

export { ArqProjectMosaic };
