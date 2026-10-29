import { containScroll } from './scroll-lock.js';
import { sizedImage } from './image-size.js';

const VIEWER_WIDTH = 2400; // foto ampliada a pantalla completa

// Mismo visor y estilos para FOA, la galería de ambiente y la cota de la ficha (Mobile).
export const photoViewerTemplate =
  `<dialog class="lightbox" data-arq-theme="dark" aria-label="Galería ampliada">` +
  `<div class="lightbox-bar"><p class="lightbox-count role-body" aria-live="polite"></p>` +
  `<arq-icon-button class="lightbox-close" icon="close" size="large" background="subtle">Cerrar</arq-icon-button></div>` +
  `<div class="lightbox-stage"><arq-icon-button class="lightbox-prev" icon="chevron-left" size="large" background="subtle">Foto anterior</arq-icon-button>` +
  `<img class="lightbox-image" alt="">` +
  `<arq-icon-button class="lightbox-next" icon="chevron-right" size="large" background="subtle">Foto siguiente</arq-icon-button></div></dialog>`;

export class PhotoViewer {
  #dialog; #photos; #list = null; #index = 0; #opener; #change;
  constructor(root, photos, change = () => {}) {
    this.#dialog = root.querySelector('.lightbox'); this.#photos = photos; this.#change = change;
    const dialog = this.#dialog;
    containScroll(dialog);
    dialog.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
    dialog.querySelector('.lightbox-prev').addEventListener('click', () => this.#step(-1));
    dialog.querySelector('.lightbox-next').addEventListener('click', () => this.#step(1));
    dialog.addEventListener('click', e => { if (!e.target.closest('img, arq-icon-button, .lightbox-bar')) dialog.close(); });
    dialog.addEventListener('keydown', e => {
      if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
      e.preventDefault(); e.stopPropagation(); this.#step(e.key === 'ArrowLeft' ? -1 : 1);
    });
    dialog.addEventListener('close', () => { this.#change(false); this.#opener?.focus({ preventScroll: true }); });
  }
  // photos: otra lista solo para esta vez (la cota de la ficha, una sola foto).
  // Una foto con original: true se muestra tal cual llega (sin pedir la copia
  // grande, que el servidor genera en el momento) y a su tamaño, sin estirarla.
  open(index, opener, photos = null) {
    this.#list = photos;
    if (!this.#current()[index]?.src) return;
    this.#index = index; this.#opener = opener; this.#render();
    this.#change(true); this.#dialog.showModal();
    this.#dialog.querySelector('.lightbox-close').focus();
  }
  close() { if (this.#dialog.open) this.#dialog.close(); }
  #current() { return this.#list ?? this.#photos(); }
  #step(direction) {
    const photos = this.#current(); if (photos.length < 2) return;
    this.#index = (this.#index + direction + photos.length) % photos.length; this.#render();
  }
  #render() {
    const photos = this.#current(); const photo = photos[this.#index]; if (!photo) return;
    const image = this.#dialog.querySelector('img'); image.src = photo.original ? photo.src : sizedImage(photo.src, VIEWER_WIDTH); image.alt = photo.alt;
    this.#dialog.classList.toggle('is-original', Boolean(photo.original));
    this.#dialog.classList.toggle('is-single', photos.length < 2);
    // Con una sola foto no hay contador (queda vacío: la cruz sigue a la derecha)
    this.#dialog.querySelector('.lightbox-count').textContent = photos.length < 2 ? '' : `${String(this.#index + 1).padStart(2, '0')} / ${String(photos.length).padStart(2, '0')}`;
    for (const control of this.#dialog.querySelectorAll('.lightbox-prev, .lightbox-next')) control.hidden = photos.length < 2;
  }
}
