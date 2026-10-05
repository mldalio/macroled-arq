// ficha-producto · contenedor de página (Final: Ficha 1218:10487 · 1220:11334;
// Iluminar 1218:11777 · 1220:12601)
//
// Ficha de un producto (grupo): hero con galería y configurador, descargas y
// especificaciones, galería de ambiente, descripción, glosario, inspiración y
// "Explora la colección". El template del CMS imprime el grupo y los textos
// indexables; el componente pide el resto a src/data/catalog.js (AGENTS.md ·
// Datos; decisiones.md, 2026-10-02 · Ficha de producto por grupo).
//
//   <arq-ficha-producto data-group="kanu-jardin">
//     <h1 slot="title">Kanu Jardín</h1>
//     <p slot="description">Descripción corta</p>
//     <img slot="image" src="…" alt="Kanu Jardín" fetchpriority="high">
//     <h2 slot="downloads-title">Descargas</h2>
//     <div slot="story">## Título\nPárrafo\n- Característica</div>
//     <h2 slot="glossary-title">Glosario</h2>
//     <p slot="inspiration">Texto de inspiración</p>
//     <h2 slot="collection-title">Explora la colección</h2>
//     <h2 slot="modal-title">Descargas</h2>
//   </arq-ficha-producto>
//
// - Variante: ?sku= si es del grupo; si no, la predeterminada. Al elegir otra
//   se actualiza ?sku= con history.replaceState (la predeterminada va sin
//   parámetro). Cambian galería, sku, descripción, acordeón y descargas.
// - Iluminar: data-arq-theme="dark" en el hero (contenedor interno) y en el
//   <arq-navbar> de la página; la galería pasa a las fotos encendidas. No se
//   guarda (la preferencia arq:theme es de los listados).
// - STORY (Markdown limitado): el componente lo lee del slot story y arma en el
//   DOM de la página un <h2> por cada «##», un <p> por línea y un <ul> con las
//   líneas «-», con createElement y textContent (nunca innerHTML). Así el
//   encabezado queda en el HTML de la página.
// - "Generar ficha técnica" y "Ficha técnica" emiten arq:datasheet { sku }.
//   TODO (diseño): el PDF no tiene diseño; se genera cuando exista.

import { ArqElement } from '../../base/arq-element.js';
import { refreshTheme } from '../../base/theme.js';
import { getProduct, variantDetails, collectionHref } from '../../data/catalog.js';
import { attributeInfo } from '../../data/attributes.js';
import { variantOptions, initialSelection, findVariant, choose } from '../../data/variants.js';
import '../breadcrumb/breadcrumb.js';
import '../breadcrumb-item/breadcrumb-item.js';
import '../button/button.js';
import '../toggle/toggle.js';
import '../product-gallery/product-gallery.js';
import '../sku/sku.js';
import '../option-group/option-group.js';
import '../option-tile/option-tile.js';
import '../swatch-picker/swatch-picker.js';
import '../swatch/swatch.js';
import '../accordion-item/accordion-item.js';
import '../spec-list/spec-list.js';
import '../spec-row/spec-row.js';
import '../variants-table/variants-table.js';
import '../family-card/family-card.js';
import '../download-modal/download-modal.js';
import '../download-item/download-item.js';
import css from './ficha-producto.css?inline';

const TEXT = {
  loading: 'Cargando producto…',
  notFound: 'No encontramos este producto.',
  error: 'No se pudo cargar el producto. Probá de nuevo en unos minutos.',
  datasheet: 'Ficha técnica',
};

const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

class ArqFichaProducto extends ArqElement {
  static tag = 'arq-ficha-producto';
  static styles = css;
  static properties = {};
  static template =
    `<div class="page">` +
    // Hero: Iluminar pone data-arq-theme="dark" en este contenedor
    `<div class="hero">` +
    `<div class="header">` +
    `<arq-breadcrumb class="breadcrumb needs-data"></arq-breadcrumb>` +
    `<div class="title-row">` +
    `<div class="title role-display"><slot name="title"></slot></div>` +
    `<arq-button class="collection-link needs-data" type="underline" show-underline show-icon icon="arrow-up-right" hidden></arq-button>` +
    `</div>` +
    `</div>` +
    `<div class="configurator">` +
    `<div class="gallery-column">` +
    `<arq-toggle class="iluminar needs-data" show-label>Iluminar</arq-toggle>` +
    `<arq-product-gallery class="gallery"></arq-product-gallery>` +
    `</div>` +
    `<div class="configurator-column">` +
    `<div class="info">` +
    `<p class="status role-body" role="status" hidden></p>` +
    `<div class="product">` +
    `<arq-sku class="sku needs-data"></arq-sku>` +
    `<div class="description role-body-regular"><slot name="description"></slot><span class="variant-description" hidden></span></div>` +
    `</div>` +
    `<div class="options needs-data"></div>` +
    `</div>` +
    `<div class="actions needs-data">` +
    `<arq-button class="datasheet" show-icon icon="arrow-up-right">Generar ficha técnica</arq-button>` +
    `<arq-button class="to-glossary" type="outline" show-icon icon="arrow-up-right">Ver glosario</arq-button>` +
    `</div>` +
    `</div>` +
    `</div>` +
    `</div>` +
    // Descargas + especificaciones (cambian con la variante)
    `<div class="details needs-data">` +
    `<div class="downloads">` +
    `<div class="downloads-title role-display-sm"><slot name="downloads-title"></slot></div>` +
    `<div class="download-buttons"></div>` +
    `</div>` +
    `<div class="accordion"></div>` +
    `</div>` +
    `<div class="ambient needs-data" role="region" aria-label="Galería de ambiente" tabindex="0" hidden></div>` +
    // Descripción (STORY) + otras familias + imagen
    `<div class="story-block">` +
    `<div class="story">` +
    `<div class="story-text"><slot name="story-text"></slot></div>` +
    `<div class="features" hidden>` +
    `<p class="features-label role-body-medium">Características del producto</p>` +
    `<div class="features-list role-body"><slot name="story-list"></slot></div>` +
    `</div>` +
    `</div>` +
    `<div class="family-row needs-data" hidden>` +
    `<div class="family" hidden>` +
    `<p class="family-label role-label">Otras familias de la colección</p>` +
    `<div class="cards family-cards"></div>` +
    `</div>` +
    `<div class="description-image" hidden><img alt="" loading="lazy"></div>` +
    `</div>` +
    `</div>` +
    `<div class="glossary needs-data">` +
    `<div class="glossary-title role-display-sm"><slot name="glossary-title"></slot></div>` +
    `<arq-variants-table class="table" downloads="downloads-modal"></arq-variants-table>` +
    `</div>` +
    `<div class="inspiration" hidden>` +
    `<div class="inspiration-text role-body-xl"><slot name="inspiration"></slot></div>` +
    `<div class="inspiration-images needs-data"></div>` +
    `</div>` +
    // Explora la colección: Dark local, fijo (DESIGN.md §2)
    `<div class="collection needs-data" data-arq-theme="dark" hidden>` +
    `<div class="collection-intro">` +
    `<div class="collection-title role-heading-2"><slot name="collection-title"></slot></div>` +
    `<arq-button class="collection-link" type="underline" show-underline show-icon icon="arrow-up-right"></arq-button>` +
    `</div>` +
    `<div class="cards collection-cards"></div>` +
    `</div>` +
    `</div>` +
    `<arq-download-modal id="downloads-modal"><slot name="modal-title" slot="title"></slot></arq-download-modal>`;

  #product = null;
  #selection = {};
  #sku = null;

  setup() {
    const root = this.shadowRoot;
    this.#moveMainImage();
    this.#renderStory();
    root.querySelector('slot[name="inspiration"]').addEventListener('slotchange', () => this.#syncInspiration());
    this.#syncInspiration();

    root.querySelector('.iluminar').addEventListener('arq:change', (event) => this.#iluminar(event.detail.checked));
    root.querySelector('.options').addEventListener('arq:change', (event) => {
      const attribute = event.target.closest('[data-attribute]')?.dataset.attribute;
      if (!attribute || !event.detail?.selected) return;
      this.#selection = choose(this.#selection, attribute, event.detail.value);
      this.#refreshOptions();
      this.#showVariant({ updateUrl: true });
    });
    root.querySelector('.datasheet').addEventListener('click', () => this.#datasheet(this.#sku));
    root.querySelector('.to-glossary').addEventListener('click', () => this.#toGlossary());
    root.querySelector('.download-buttons').addEventListener('click', (event) => {
      if (event.target.closest('[data-datasheet]')) this.#datasheet(this.#sku);
    });

    // Glosario: el ícono de cada fila abre el modal con los archivos de ese SKU
    const table = root.querySelector('.table');
    table.addEventListener('arq:downloads', (event) => this.#fillModal(event.detail.sku));
    root.querySelector('arq-download-modal').addEventListener('arq:download', (event) => {
      event.stopPropagation();
      this.#datasheet(event.currentTarget.dataset.sku);
    });

    this.#load();
  }

  async #load() {
    const id = this.getAttribute('data-group');
    this.setAttribute('aria-busy', 'true');
    this.#status(TEXT.loading);
    let product = null;
    let failed = false;
    try {
      product = id ? await getProduct(id) : null;
    } catch (error) {
      failed = true;
      console.error('[arq] ficha-producto: no se pudo cargar el catálogo', error);
    }
    this.removeAttribute('aria-busy');
    if (!product) {
      this.#status(failed ? TEXT.error : TEXT.notFound);
      return;
    }
    this.#product = product;
    this.#status('');
    const sku = new URLSearchParams(location.search).get('sku');
    this.#selection = initialSelection(product.variants, product.variantAttributes, sku);
    this.#renderHeader();
    this.#buildOptions();
    this.#refreshOptions();
    this.#showVariant();
    this.#renderAmbient();
    this.#renderFamily();
    this.#renderGlossary();
    this.#renderInspirationImages();
    this.#renderCollection();
    this.shadowRoot.querySelector('.page').toggleAttribute('data-ready', true);
  }

  #status(message) {
    const status = this.shadowRoot.querySelector('.status');
    status.textContent = message;
    status.hidden = !message;
  }

  // ── Hero ──────────────────────────────────────────────────────────
  // La imagen principal del CMS (LCP) pasa a la galería: es la que muestra
  // la primera imagen de la variante (README de product-gallery).
  #moveMainImage() {
    const img = this.querySelector(':scope > img[slot="image"]');
    if (img) this.shadowRoot.querySelector('.gallery').append(img);
  }

  #renderHeader() {
    const { group, collection } = this.#product;
    const root = this.shadowRoot;
    const crumbs = collection
      ? [
          { label: 'Colecciones', href: '/arq/productos?view=colecciones' },
          { label: collection.name, href: collectionHref(collection.id) },
        ]
      : [{ label: 'Productos', href: '/arq/productos' }];
    root.querySelector('.breadcrumb').replaceChildren(
      ...crumbs.map(({ label, href }) => {
        const item = document.createElement('arq-breadcrumb-item');
        item.href = href;
        item.showSeparator = true;
        item.textContent = label;
        return item;
      }),
      Object.assign(document.createElement('arq-breadcrumb-item'), { current: true, textContent: group.name }),
    );
    for (const link of root.querySelectorAll('.collection-link')) {
      link.hidden = !collection;
      if (!collection) continue;
      link.href = collectionHref(collection.id);
      link.textContent = `Ver colección ${collection.name}`;
    }
  }

  #iluminar(dark) {
    const hero = this.shadowRoot.querySelector('.hero');
    for (const element of [hero, ...document.querySelectorAll('arq-navbar')]) {
      if (dark) element.setAttribute('data-arq-theme', 'dark');
      else element.removeAttribute('data-arq-theme');
    }
    refreshTheme(); // el observer de theme.js no ve el cambio dentro del Shadow DOM
  }

  // ── Configurador ──────────────────────────────────────────────────
  // Los controles se crean una vez; al elegir se actualizan selected y
  // disabled en los mismos elementos (así el foco no se pierde con las flechas).
  #buildOptions() {
    const { variants, variantAttributes } = this.#product;
    const groups = variantOptions(variants, variantAttributes, this.#selection).map(({ attribute, options }) => {
      const info = attributeInfo(attribute);
      const group = document.createElement('arq-option-group');
      group.dataset.attribute = attribute;
      group.label = info.label;
      const swatches = info.control === 'swatches';
      const parent = swatches ? document.createElement('arq-swatch-picker') : group;
      if (swatches) {
        group.type = 'swatches';
        group.append(parent);
      }
      for (const option of options) {
        const item = document.createElement(swatches ? 'arq-swatch' : 'arq-option-tile');
        item.value = option.value;
        item.textContent = option.value;
        // TODO (acabados): imagen del acabado (DESIGN.md §8 · Acabados); sin
        // imagen el swatch muestra el neutro.
        parent.append(item);
      }
      return group;
    });
    this.shadowRoot.querySelector('.options').replaceChildren(...groups);
  }

  #refreshOptions() {
    const { variants, variantAttributes } = this.#product;
    const root = this.shadowRoot;
    for (const { attribute, options } of variantOptions(variants, variantAttributes, this.#selection)) {
      const items = root.querySelectorAll(`.options [data-attribute="${CSS.escape(attribute)}"] :is(arq-swatch, arq-option-tile)`);
      items.forEach((item, i) => {
        item.selected = options[i].selected;
        item.disabled = options[i].disabled;
      });
    }
  }

  #showVariant({ updateUrl = false } = {}) {
    const { group, variants } = this.#product;
    const variant = findVariant(variants, this.#selection) ?? variants.find((v) => v.isDefault) ?? variants[0];
    if (!variant || variant.sku === this.#sku) return;
    this.#sku = variant.sku;
    const details = variantDetails(group, variant.sku);
    const root = this.shadowRoot;

    root.querySelector('.sku').textContent = details.sku;
    const description = root.querySelector('.variant-description');
    description.textContent = details.description ?? '';
    description.hidden = !details.description;
    root.querySelector('slot[name="description"]').hidden = Boolean(details.description);
    root.querySelector('.gallery').images = details.images;
    this.#renderSpecs(details.sections);
    this.#renderDownloads(details.downloads);

    if (updateUrl) {
      const url = new URL(location.href);
      if (variant.isDefault) url.searchParams.delete('sku');
      else url.searchParams.set('sku', variant.sku);
      history.replaceState(history.state, '', url);
    }
    this.emit('variant', { sku: variant.sku });
  }

  // Acordeón: una sección por grupo de especificaciones (src/data/attributes.js).
  // Al cambiar de variante quedan abiertas las mismas secciones; la primera vez,
  // la primera (Final).
  #renderSpecs(sections) {
    const container = this.shadowRoot.querySelector('.accordion');
    const previous = [...container.children];
    const open = previous.length ? new Set(previous.filter((item) => item.open).map((item) => item.dataset.section)) : new Set([sections[0]?.id]);
    container.replaceChildren(
      ...sections.map((section) => {
        const item = document.createElement('arq-accordion-item');
        item.dataset.section = section.id;
        item.open = open.has(section.id);
        const title = document.createElement('span');
        title.slot = 'title';
        title.textContent = section.label;
        const list = document.createElement('arq-spec-list');
        for (const row of section.rows) {
          const spec = document.createElement('arq-spec-row');
          const label = document.createElement('span');
          label.slot = 'label';
          label.textContent = row.label;
          spec.append(label, String(row.value));
          list.append(spec);
        }
        item.append(title, list);
        return item;
      }),
    );
  }

  // Descargas: la ficha técnica (se genera) y los archivos del SKU elegido.
  // Un archivo que falta no se muestra (README de download-item).
  #renderDownloads(files) {
    const button = (label, href) => {
      const element = document.createElement('arq-button');
      element.type = 'outline';
      element.showIcon = true;
      element.icon = 'download';
      if (href) element.href = href;
      element.textContent = label;
      return element;
    };
    const datasheet = button(TEXT.datasheet);
    datasheet.dataset.datasheet = '';
    this.shadowRoot.querySelector('.download-buttons').replaceChildren(datasheet, ...files.map((file) => button(file.label, file.href)));
  }

  #datasheet(sku) {
    // TODO (diseño): el PDF de la ficha técnica no tiene diseño en Figma y la
    // librería no está elegida (decisiones.md, 2026-10-02 · Ficha técnica en PDF).
    if (sku) this.emit('datasheet', { sku });
  }

  #toGlossary() {
    const glossary = this.shadowRoot.querySelector('.glossary');
    glossary.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' });
    // El foco pasa al título del glosario (el <h2> del embed)
    const title = this.querySelector(':scope > [slot="glossary-title"]');
    if (title) {
      title.tabIndex = -1;
      title.focus({ preventScroll: true });
    }
  }

  // ── Galería de ambiente ───────────────────────────────────────────
  #renderAmbient() {
    const { group, images } = this.#product;
    const ambient = this.shadowRoot.querySelector('.ambient');
    ambient.hidden = !images.ambient.length;
    ambient.replaceChildren(...images.ambient.map((src, i) => image(src, `${group.name}, ambiente ${i + 1}`)));
  }

  // ── Descripción ───────────────────────────────────────────────────
  // STORY llega como texto en el slot story. Se arma en el DOM de la página:
  // «## » → <h2> (los siguientes, <h3>), «- » → <li> de un <ul>, el resto <p>.
  #renderStory() {
    const root = this.shadowRoot;
    const raw = this.querySelector(':scope > [slot="story"]');
    if (!raw) {
      root.querySelector('.story').hidden = true;
      return;
    }
    const lines = raw.textContent.split('\n').map((line) => line.trim()).filter(Boolean);
    const nodes = [];
    let list = null;
    let headings = 0;
    for (const line of lines) {
      if (line.startsWith('- ')) {
        list ??= Object.assign(document.createElement('ul'), { slot: 'story-list' });
        list.append(Object.assign(document.createElement('li'), { textContent: line.slice(2).trim() }));
        continue;
      }
      const heading = line.startsWith('## ');
      const node = document.createElement(heading ? (headings++ ? 'h3' : 'h2') : 'p');
      node.slot = 'story-text';
      node.textContent = heading ? line.slice(3).trim() : line;
      nodes.push(node);
    }
    raw.replaceWith(...nodes, ...(list ? [list] : []));
    root.querySelector('.story-text').hidden = !nodes.length;
    root.querySelector('.features').hidden = !list;
    root.querySelector('.story').hidden = !nodes.length && !list;
  }

  #renderFamily() {
    const { family, images } = this.#product;
    const root = this.shadowRoot;
    root.querySelector('.family').hidden = !family.length;
    root.querySelector('.family-cards').replaceChildren(...family.map((card) => familyCard(card)));
    const picture = root.querySelector('.description-image');
    picture.hidden = !images.description;
    if (images.description) picture.querySelector('img').src = images.description;
    root.querySelector('.family-row').hidden = !family.length && !images.description;
  }

  // ── Glosario ──────────────────────────────────────────────────────
  #renderGlossary() {
    const { group, glossary, files } = this.#product;
    const table = this.shadowRoot.querySelector('.table');
    table.label = `Variantes de ${group.name}`;
    table.data = glossary;
    table.replaceChildren(
      ...files.map((file) => {
        const button = document.createElement('arq-button');
        button.slot = 'downloads';
        button.type = 'outline';
        button.showIcon = true;
        button.icon = 'download';
        button.href = file.href;
        button.textContent = file.label;
        return button;
      }),
    );
  }

  #fillModal(sku) {
    const modal = this.shadowRoot.querySelector('arq-download-modal');
    modal.dataset.sku = sku;
    const featured = document.createElement('arq-download-item');
    featured.emphasis = 'featured';
    featured.textContent = TEXT.datasheet;
    const files = variantDetails(this.#product.group, sku).downloads.map((file) => {
      const item = document.createElement('arq-download-item');
      item.href = file.href;
      item.textContent = file.label;
      return item;
    });
    for (const item of modal.querySelectorAll(':scope > arq-download-item')) item.remove();
    modal.append(featured, ...files);
  }

  // ── Inspiración ───────────────────────────────────────────────────
  #syncInspiration() {
    const root = this.shadowRoot;
    const text = root.querySelector('slot[name="inspiration"]').assignedElements().length > 0;
    const images = root.querySelector('.inspiration-images').children.length > 0;
    root.querySelector('.inspiration').hidden = !text && !images;
  }

  #renderInspirationImages() {
    const { group, images } = this.#product;
    this.shadowRoot
      .querySelector('.inspiration-images')
      .replaceChildren(...images.inspiration.map((src, i) => image(src, `${group.name}, inspiración ${i + 1}`)));
    this.#syncInspiration();
  }

  // ── Explora la colección ──────────────────────────────────────────
  #renderCollection() {
    const { collection, family } = this.#product;
    const section = this.shadowRoot.querySelector('.collection');
    section.hidden = !collection || !family.length;
    section.querySelector('.collection-cards').replaceChildren(...family.map((card) => familyCard(card, 'large')));
  }
}

function image(src, alt) {
  const img = document.createElement('img');
  img.src = src;
  img.alt = alt;
  img.loading = 'lazy';
  return img;
}

// Misma imagen que la product-card del grupo: estudio, luz apagada
// (decisiones.md, 2026-10-02 · Cards).
function familyCard(data, size) {
  const card = document.createElement('arq-family-card');
  card.href = data.href;
  if (size) card.size = size;
  if (data.image) {
    const img = image(data.image, '');
    img.slot = 'image';
    card.append(img);
  }
  const name = document.createElement('h3');
  name.slot = 'name';
  name.textContent = data.name;
  card.append(name);
  return card;
}

ArqFichaProducto.define();

export { ArqFichaProducto };
