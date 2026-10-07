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
  static properties = {};
  static template = `<div class="gallery"><div class="image"><slot name="image"></slot></div><div class="thumbs" hidden></div></div>`;

  #images = [];
  #index = 0;
  #dark = false;
  #received = false; // ya llegaron los datos: antes no se oculta la imagen del HTML

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
    this.#dark = dark;
    this.#render();
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

  #render() {
    const images = this.#images;
    const current = images[this.#index];
    const img = this.#mainImage();
    if (img && current) {
      const src = this.#src(current);
      if (img.getAttribute('src') !== src) img.src = src;
      img.alt = current.alt ?? '';
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
}

ArqProductGallery.define();

export { ArqProductGallery };
