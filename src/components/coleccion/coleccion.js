// coleccion · contenedor de página (Final: Colección 1234:13201 Desktop ·
// 1234:13448 Mobile)
//
// Página de una colección: grilla de product-card (una por grupo), galería,
// texto + imagen y mosaico de fotos con carousel-controls. El template del CMS
// imprime el page-header (breadcrumb, <h1> e intro) y el texto de
// descripción; el componente pide el resto a getCollection()
// (src/data/catalog.js), como catalog-listing.
//
//   <arq-coleccion data-collection="kanu">
//     <p slot="description">COLLECTION_DESCRIPTION_TEXT</p>
//   </arq-coleccion>
//
// - Las imágenes muestran solo las que existen (decisión 2026-10-02 ·
//   Galerías); un bloque sin imágenes no se muestra.
// - Sin Iluminar ni Comparar (Final).

import { ArqElement } from '../../base/arq-element.js';
import { getCollection } from '../../data/catalog.js';
import '../grid/grid.js';
import '../product-card/product-card.js';
import '../swatch/swatch.js';
import '../carousel-controls/carousel-controls.js';
import css from './coleccion.css?inline';

const TEXT = {
  loading: 'Cargando colección…',
  notFound: 'No encontramos esta colección.',
  empty: 'Esta colección todavía no tiene productos.',
  error: 'No se pudo cargar la colección. Probá de nuevo en unos minutos.',
};

class ArqColeccion extends ArqElement {
  static tag = 'arq-coleccion';
  static styles = css;
  static properties = {};
  static template =
    `<div class="products">` +
    `<p class="status role-body" role="status" hidden></p>` +
    `<arq-grid class="grid"></arq-grid>` +
    `</div>` +
    `<div class="gallery" hidden></div>` +
    `<div class="feature" hidden>` +
    `<div class="feature-text role-body-xl"><slot name="description"></slot></div>` +
    `<div class="feature-image" hidden><img alt="" loading="lazy"></div>` +
    `</div>` +
    `<div class="mosaic" hidden>` +
    `<div class="controls"><arq-carousel-controls for="mosaic-track" label-prev="Fotos anteriores" label-next="Fotos siguientes"></arq-carousel-controls></div>` +
    `<div class="track" id="mosaic-track" role="region" aria-label="Fotos de la colección" tabindex="0"></div>` +
    `</div>`;

  setup() {
    this.shadowRoot.querySelector('slot[name="description"]').addEventListener('slotchange', () => this.#syncFeature());
    this.#syncFeature();
    this.#load();
  }

  async #load() {
    const id = this.getAttribute('data-collection');
    this.setAttribute('aria-busy', 'true');
    this.#status(TEXT.loading);
    let data = null;
    let failed = false;
    try {
      data = id ? await getCollection(id) : null;
    } catch (error) {
      failed = true;
      console.error('[arq] coleccion: no se pudo cargar el catálogo', error);
    }
    this.removeAttribute('aria-busy');
    if (!data) {
      this.#status(failed ? TEXT.error : TEXT.notFound);
      return;
    }
    this.#status(data.cards.length ? '' : TEXT.empty);
    this.#renderCards(data.cards);
    this.#renderImages(data);
  }

  #status(message) {
    const status = this.shadowRoot.querySelector('.status');
    status.textContent = message;
    status.hidden = !message;
  }

  #renderCards(cards) {
    this.shadowRoot.querySelector('.grid').replaceChildren(
      ...cards.map((data) => {
        const card = document.createElement('arq-product-card');
        card.href = data.href;
        card.image = data.image;
        card.imageHover = data.imageHover;
        card.imageLit = data.imageLit;
        card.imageHoverLit = data.imageHoverLit;
        // <h2>: las cards van directo debajo del <h1> del page-header
        const title = document.createElement('h2');
        title.slot = 'name';
        title.textContent = data.name;
        card.append(title);
        for (const name of data.finishes ?? []) {
          const swatch = document.createElement('arq-swatch');
          swatch.slot = 'finishes';
          swatch.textContent = name;
          card.append(swatch);
        }
        if (data.meta) {
          const meta = document.createElement('span');
          meta.slot = 'meta';
          meta.textContent = data.meta;
          card.append(meta);
        }
        return card;
      }),
    );
  }

  #renderImages({ collection, images }) {
    const root = this.shadowRoot;
    const gallery = root.querySelector('.gallery');
    gallery.hidden = !images.gallery.length;
    gallery.replaceChildren(...images.gallery.map((src, i) => image(src, `${collection.name}, imagen ${i + 1}`)));

    const picture = root.querySelector('.feature-image');
    picture.hidden = !images.description;
    if (images.description) picture.querySelector('img').src = images.description;
    this.#syncFeature();

    const mosaic = root.querySelector('.mosaic');
    mosaic.hidden = !images.inspiration.length;
    root.querySelector('.track').replaceChildren(...images.inspiration.map((src, i) => image(src, `${collection.name}, proyecto ${i + 1}`)));
  }

  // Texto + imagen: se muestra si hay alguno de los dos
  #syncFeature() {
    const root = this.shadowRoot;
    const text = root.querySelector('slot[name="description"]').assignedElements().length > 0;
    root.querySelector('.feature-text').hidden = !text;
    root.querySelector('.feature').hidden = !text && root.querySelector('.feature-image').hidden;
  }
}

function image(src, alt) {
  const img = document.createElement('img');
  img.src = src;
  img.alt = alt;
  img.loading = 'lazy';
  return img;
}

ArqColeccion.define();

export { ArqColeccion };
