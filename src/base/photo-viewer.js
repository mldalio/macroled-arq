import { containScroll } from './scroll-lock.js';
import { sizedImage, THUMB_WIDTH } from './image-size.js';
import { PhotoZoom } from './photo-zoom.js';
import '../components/gallery-thumb/gallery-thumb.js';

const VIEWER_WIDTH = 2400; // foto ampliada a pantalla completa

// Mismo visor y estilos para FOA, la galería de ambiente, la galería del hero
// y la cota de la ficha (Mobile). PhotoViewer (la ficha) suma el zoom
// (photo-zoom.js): clic, rueda, pellizco y + / −, y la fila de miniaturas
// abajo (gallery-thumb, con dos fotos o más). FOA (project-slider) usa solo
// la plantilla y los estilos, sin zoom ni miniaturas.
export const photoViewerTemplate =
  `<dialog class="lightbox" data-arq-theme="dark" aria-label="Galería ampliada">` +
  `<div class="lightbox-bar"><p class="lightbox-count role-body" aria-live="polite"></p>` +
  `<arq-icon-button class="lightbox-close" icon="close" size="large" background="subtle">Cerrar</arq-icon-button></div>` +
  `<div class="lightbox-stage"><arq-icon-button class="lightbox-prev" icon="chevron-left" size="large" background="subtle">Foto anterior</arq-icon-button>` +
  `<div class="lightbox-frame"><img class="lightbox-image" alt=""></div>` +
  `<arq-icon-button class="lightbox-next" icon="chevron-right" size="large" background="subtle">Foto siguiente</arq-icon-button></div>` +
  `<div class="lightbox-thumbs" role="group" aria-label="Fotos" hidden></div></dialog>`;

export class PhotoViewer {
  #dialog; #photos; #list = null; #index = 0; #opener; #change; #zoom;
  constructor(root, photos, change = () => {}) {
    this.#dialog = root.querySelector('.lightbox'); this.#photos = photos; this.#change = change;
    const dialog = this.#dialog;
    containScroll(dialog);
    this.#zoom = new PhotoZoom(dialog.querySelector('.lightbox-frame'), dialog.querySelector('.lightbox-image'));
    dialog.classList.add('can-zoom');
    dialog.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
    dialog.querySelector('.lightbox-prev').addEventListener('click', () => this.#step(-1));
    dialog.querySelector('.lightbox-next').addEventListener('click', () => this.#step(1));
    dialog.addEventListener('click', e => { if (!e.target.closest('img, arq-icon-button, .lightbox-bar, .lightbox-thumbs')) dialog.close(); });
    dialog.querySelector('.lightbox-thumbs').addEventListener('click', e => {
      const thumb = e.target.closest('arq-gallery-thumb');
      if (!thumb) return;
      this.#index = Number(thumb.dataset.index); this.#render();
    });
    dialog.addEventListener('keydown', e => {
      if (['+', '=', '-'].includes(e.key)) { e.preventDefault(); this.#zoom.step(e.key === '-' ? -1 : 1); return; }
      if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
      e.preventDefault(); e.stopPropagation(); this.#step(e.key === 'ArrowLeft' ? -1 : 1);
    });
    dialog.addEventListener('close', () => { this.#zoom.reset(); this.#change(false); this.#opener?.focus({ preventScroll: true }); });
  }
  // photos: otra lista solo para esta vez (la cota de la ficha, una sola foto).
  // Una foto con original: true se muestra tal cual llega (sin pedir la copia
  // grande, que el servidor genera en el momento) y a su tamaño, sin estirarla.
  // Una foto con ground: 'light' o 'dark' (estudio, PNG con transparencia) va
  // sobre color/surface/subtle de ese modo, como en la galería del hero.
  // width: el ancho que se pide al CloudFront (por defecto VIEWER_WIDTH). La
  // galería del hero pasa el suyo: esa copia ya está cargada y se ve al
  // instante (la de 2400 la genera el servidor en el momento y tardaba).
  open(index, opener, photos = null) {
    this.#list = photos;
    if (!this.#current()[index]?.src) return;
    this.#index = index; this.#opener = opener; this.#render();
    this.#change(true); this.#dialog.showModal();
    this.#dialog.querySelector('.lightbox-thumbs [selected]')?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
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
    this.#zoom.reset();
    const image = this.#dialog.querySelector('img'); image.src = photo.original ? photo.src : sizedImage(photo.src, photo.width ?? VIEWER_WIDTH); image.alt = photo.alt;
    this.#dialog.classList.toggle('is-original', Boolean(photo.original));
    this.#dialog.classList.toggle('has-ground', Boolean(photo.ground));
    if (photo.ground) image.setAttribute('data-arq-theme', photo.ground); else image.removeAttribute('data-arq-theme');
    this.#dialog.classList.toggle('is-single', photos.length < 2);
    // Con una sola foto no hay contador (queda vacío: la cruz sigue a la derecha)
    this.#dialog.querySelector('.lightbox-count').textContent = photos.length < 2 ? '' : `${String(this.#index + 1).padStart(2, '0')} / ${String(photos.length).padStart(2, '0')}`;
    for (const control of this.#dialog.querySelectorAll('.lightbox-prev, .lightbox-next')) control.hidden = photos.length < 2;
    this.#renderThumbs(photos);
  }
  // Miniaturas de todas las fotos, con la que se ve en Selected. Las de estudio
  // llevan su fondo (ground), como la foto grande.
  #renderThumbs(photos) {
    const row = this.#dialog.querySelector('.lightbox-thumbs');
    const show = photos.length > 1;
    row.hidden = !show; this.#dialog.classList.toggle('has-thumbs', show);
    if (!show) return row.replaceChildren();
    while (row.children.length > photos.length) row.lastElementChild.remove();
    while (row.children.length < photos.length) row.append(document.createElement('arq-gallery-thumb'));
    photos.forEach((photo, i) => {
      const thumb = row.children[i];
      thumb.dataset.index = String(i);
      // Con `width` (galería del hero) la foto ya está en caché a ese tamaño; si no,
      // la miniatura se pide chica: a 2400 px competía con la foto grande
      thumb.src = photo.original ? photo.src : sizedImage(photo.src, photo.width ?? THUMB_WIDTH);
      thumb.alt = photo.alt || `Foto ${i + 1}`;
      thumb.selected = i === this.#index;
      if (photo.ground) thumb.setAttribute('data-arq-theme', photo.ground); else thumb.removeAttribute('data-arq-theme');
    });
    row.children[this.#index]?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }
}
