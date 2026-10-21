// product-gallery · Figma 920:2490 · ficha doc/product-gallery (1463:10376)
//
// Galería de la ficha: imagen principal (5:4) + fila de gallery-thumb. Elegir
// una miniatura la muestra en grande, sin recargar.
//
//   <arq-product-gallery>
//     <img slot="image" src="…/kanu-jardin.jpg" alt="Kanu Jardín" fetchpriority="high">
//   </arq-product-gallery>
//
//   gallery.images = [                          // desde src/data/
//     { src: '…/main.jpg', srcOn: '…/main-on.jpg', alt: 'Kanu Jardín' },
//     { src: '…/ambient-1.jpg', srcOn: '…/ambient-1-on.jpg', alt: 'Kanu Jardín en un jardín' },
//     { src: '…/detail-1.jpg', alt: 'Kanu Jardín, detalle' },
//   ];
//
// - La imagen principal llega por slot desde el HTML del embed (la del CMS):
//   es el LCP, el navegador la descubre sin esperar al JS. Si no viene, el
//   componente crea una con la primera de images.
// - images (prop de JS, no atributo): la primera es la principal. Al cambiar
//   (otra variante) vuelve a la primera. Con menos de dos, no hay miniaturas.
// - Iluminar: dentro de un bloque con data-arq-theme="dark", la imagen grande y
//   las miniaturas usan srcOn; si falta, la apagada (src/base/theme.js).
// - Desktop: miniaturas sobre la imagen, abajo a la izquierda. Mobile: debajo.
//   Si no entran, la fila se desliza (decisión 2026-10-02 · Galerías).
// - Miniaturas: un <button> cada una (Tab), la elegida con aria-current.

import { ArqElement } from '../../base/arq-element.js';
import { watchTheme } from '../../base/theme.js';
import '../gallery-thumb/gallery-thumb.js';
import css from './product-gallery.css?inline';

class ArqProductGallery extends ArqElement {
  static tag = 'arq-product-gallery';
  static styles = css;
  static properties = {
    insetThumbs: { type: Boolean }, // solo de código: en Mobile, miniaturas con el margen de página
  };
  static template = `<div class="gallery"><div class="image"><slot name="image"></slot><slot name="overlay"></slot></div><div class="thumbs" hidden></div></div>`;

  #images = [];
  #index = 0;
  #dark = false;
  #received = false; // ya llegaron los datos: antes no se oculta la imagen del HTML
  #transitionImage = null;

  get images() {
    return this.#images;
  }

  set images(list) {
    this.#images = Array.isArray(list) ? list.filter((image) => image && image.src) : [];
    this.#received = true;
    this.#index = 0;
    if (this.isConnected) this.#render();
  }

  setup() {
    this.shadowRoot.querySelector('.thumbs').addEventListener('click', (event) => {
      const thumb = event.target.closest('arq-gallery-thumb');
      if (thumb) this.select(Number(thumb.dataset.index));
    });
    watchTheme(this, 'themeChanged');
    this.#render();
  }

  /** Iluminar (src/base/theme.js): pasa a las versiones encendidas. */
  themeChanged(dark) {
    const current = this.#images[this.#index];
    const previousSrc = current ? this.#src(current) : null;
    this.#dark = dark;
    this.#render(previousSrc);
  }

  /** Muestra en grande la imagen `index` de images. */
  select(index) {
    if (!this.#images[index] || index === this.#index) return;
    this.#index = index;
    this.#render();
  }

  #src(image) {
    return (this.#dark && image.srcOn) || image.src;
  }

  #mainImage() {
    let img = this.querySelector(':scope > img[slot="image"]');
    if (!img && this.#images.length) {
      img = document.createElement('img');
      img.slot = 'image';
      this.append(img);
    }
    return img;
  }

  #render(previousSrc = null) {
    const images = this.#images;
    const current = images[this.#index];
    const img = this.#mainImage();
    if (img && current) {
      const src = this.#src(current);
      if (img.getAttribute('src') !== src) {
        if (previousSrc && img.getAttribute('src') === previousSrc && src !== previousSrc) this.#crossfade(img, previousSrc, src);
        else img.src = src;
      }
      img.alt = current.alt ?? '';
      // Iluminar: la versión del otro modo ya queda en caché, así el fundido
      // arranca al instante y termina junto con el fondo.
      const other = this.#dark ? current.src : current.srcOn;
      if (other && other !== src) new Image().src = other;
    }
    // Sin imágenes (variante sin fotos): se ve el fondo del marco. Estilo en
    // línea porque el <img> está en el DOM de la página (Webflow le da display).
    if (img && this.#received) img.style.display = current ? '' : 'none';
    const row = this.shadowRoot.querySelector('.thumbs');
    row.hidden = images.length < 2;
    if (row.hidden) {
      row.replaceChildren();
      return;
    }
    // Las miniaturas se reusan: así el foco no se pierde al elegir una.
    while (row.children.length > images.length) row.lastElementChild.remove();
    while (row.children.length < images.length) row.append(document.createElement('arq-gallery-thumb'));
    images.forEach((image, i) => {
      const thumb = row.children[i];
      thumb.dataset.index = String(i);
      thumb.src = this.#src(image);
      thumb.alt = image.alt ?? '';
      thumb.selected = i === this.#index;
    });
  }

  #crossfade(img, previousSrc, nextSrc) {
    this.#transitionImage?.remove();
    const previous = document.createElement('img');
    previous.className = 'theme-transition';
    previous.src = previousSrc;
    previous.alt = '';
    previous.setAttribute('aria-hidden', 'true');
    this.#transitionImage = previous;
    this.shadowRoot.querySelector('.image').append(previous);
    img.src = nextSrc;

    // El fundido arranca en el mismo instante que el cambio de fondo (la
    // versión nueva ya está en caché por la precarga).
    previous.addEventListener('transitionend', (event) => {
      if (event.propertyName === 'opacity') previous.remove();
    }, { once: true });
    void previous.offsetWidth;
    previous.classList.add('fade-out');
    const duration = getComputedStyle(previous).transitionDuration.split(',')[0];
    if (!Number.parseFloat(duration)) previous.remove();
  }
}

ArqProductGallery.define();

export { ArqProductGallery };
