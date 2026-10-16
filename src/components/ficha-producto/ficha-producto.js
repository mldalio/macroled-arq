// ficha-producto · contenedor de página (Final: Ficha v2 2085:26124 Desktop;
// Mobile: la v1 1220:11334 con los componentes nuevos; Iluminar 1218:11777 · 1220:12601)
//
// Ficha de un producto (grupo): hero con galería y configurador (con el
// encabezado adentro), especificaciones en un acordeón, galería de ambiente, descripción, glosario, inspiración y
// "Explora la colección". El template del CMS imprime el grupo y los textos
// y el nombre; el componente pide el resto a src/data/catalog.js, textos
// incluidos (AGENTS.md · Datos; decisiones.md, 2026-10-02 · Ficha de producto
// por grupo y 2026-10-07 · Base de datos sin IDs).
//
//   <arq-ficha-producto data-group="kanu-jardin">
//     <h1 slot="title">Kanu Jardín</h1>
//     <h2 slot="glossary-title">Glosario</h2>
//     <h2 slot="collection-title">Explora la colección</h2>
//     <h2 slot="modal-title">Descargas</h2>
//   </arq-ficha-producto>
//
// - Textos solo de los datos: descripción corta (description de la variante),
//   STORY (product_story_text) e inspiración (product_inspiration_text). Se
//   escriben en el DOM de la página, en sus slots. Si un dato falta, esa parte
//   no se muestra, aunque el HTML traiga texto: así se ve qué falta en la base.
//   Opcional: <img slot="image"> con la imagen principal (LCP); sin ella, la
//   galería la crea.
// - Variante: ?sku= si es del grupo; si no, la predeterminada. Al elegir otra
//   se actualiza ?sku= con history.replaceState (la predeterminada va sin
//   parámetro). Cambian galería, sku, descripción, acordeón y descargas.
// - Iluminar: data-arq-theme="dark" en el hero (contenedor interno) y en el
//   <arq-navbar> de la página; la galería pasa a las fotos encendidas. No se
//   recuerda: recargar la ficha la deja apagada. Solo llega encendida si se
//   entró desde un listado iluminado (theme.js, takeThemeHandoff).
// - STORY (Markdown limitado): el componente arma con el texto, en el DOM de
//   la página, un <h2> con la primera línea (el título, con o sin «## », slot
//   story-title), un <p> por línea y un <ul> con las líneas «-», con createElement
//   y textContent (nunca innerHTML). Así el encabezado queda en el HTML de la página.
//   Se muestran sobre la foto de ambiente 6 a todo el ancho, que queda fija al
//   hacer scroll (parallax).
// - "Ver descargas" lleva al glosario, donde está la descarga de cada SKU.
// - Comparar: suma la variante elegida a la compare-bar de la ficha (hasta 3).
// - "Generar ficha técnica" y "Ficha técnica" (modal del glosario) emiten arq:datasheet { sku }.
//   TODO (diseño): el PDF no tiene diseño; se genera cuando exista.

import { ArqElement } from '../../base/arq-element.js';
import { animateThemeChange, refreshTheme, takeThemeHandoff, withoutThemeTransition } from '../../base/theme.js';
import { getProduct, variantDetails, collectionHref } from '../../data/catalog.js';
import { attributeInfo } from '../../data/attributes.js';
import { variantOptions, initialSelection, findVariant, choose } from '../../data/variants.js';
import '../breadcrumb/breadcrumb.js';
import '../breadcrumb-item/breadcrumb-item.js';
import '../button/button.js';
import '../toggle/toggle.js';
import '../checkbox/checkbox.js';
import '../compare-bar/compare-bar.js';
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
import '../icon-button/icon-button.js';
import { icon } from '../../base/icons.js';
import '../download-modal/download-modal.js';
import '../download-item/download-item.js';
import css from './ficha-producto.css?inline';

const TEXT = {
  loading: 'Cargando producto…',
  notFound: 'No encontramos este producto.',
  error: 'No se pudo cargar el producto. Probá de nuevo en unos minutos.',
  datasheet: 'Ficha técnica',
  generating: 'Generando…',
  previous: 'Anterior',
  next: 'Siguiente',
};

const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

class ArqFichaProducto extends ArqElement {
  static tag = 'arq-ficha-producto';
  static styles = css;
  static properties = {
    // Destino del botón del bloque «¿Te interesa este producto?»
    ctaHref: { type: String, default: '/arq/contacto' },
  };
  static template =
    `<div class="page">` +
    // Hero (Ficha v2, 2085:27570): galería a sangre a la izquierda y configurador
    // a la derecha, con el encabezado adentro. Iluminar pone data-arq-theme="dark"
    // en este contenedor.
    `<div class="hero">` +
    `<div class="configurator">` +
    `<div class="gallery-column">` +
    `<arq-product-gallery class="gallery" fill>` +
    `<arq-toggle class="iluminar needs-data" slot="overlay" show-label>Iluminar</arq-toggle>` +
    `</arq-product-gallery>` +
    `</div>` +
    `<div class="configurator-column">` +
    `<div class="header">` +
    `<arq-breadcrumb class="breadcrumb needs-data"></arq-breadcrumb>` +
    `<div class="title-row">` +
    `<div class="title role-display"><slot name="title"></slot></div>` +
    `<arq-sku class="sku needs-data" size="compact"></arq-sku>` +
    `</div>` +
    `</div>` +
    `<div class="info">` +
    `<p class="status role-body" role="status" hidden></p>` +
    `<div class="product">` +
    `<div class="description role-body-regular"><span class="variant-description" hidden></span></div>` +
    `</div>` +
    `<div class="options needs-data"></div>` +
    `</div>` +
    `<div class="buy needs-data">` +
    `<arq-checkbox class="compare" show-label>Comparar</arq-checkbox>` +
    `<div class="actions">` +
    `<arq-button class="datasheet">Generar ficha técnica</arq-button>` +
    `<arq-button class="to-glossary" type="outline">Ver descargas</arq-button>` +
    `</div>` +
    `</div>` +
    `</div>` +
    `</div>` +
    `</div>` +
    // Especificaciones (cambian con la variante)
    `<div class="details needs-data">` +
    `<div class="accordion"></div>` +
    `</div>` +
    // Galería de ambiente
    `<div class="ambient-block needs-data" hidden>` +
    `<div class="ambient" role="region" aria-label="Galería de ambiente" tabindex="0"></div>` +
    // Flechas debajo de las fotos en pantallas sin cursor (táctiles); con cursor, la flecha sigue al mouse
    `<div class="ambient-controls">` +
    `<arq-icon-button class="ambient-prev" icon="arrow-left" size="large" background="outline" disabled>${TEXT.previous}</arq-icon-button>` +
    `<arq-icon-button class="ambient-next" icon="arrow-right" size="large" background="outline">${TEXT.next}</arq-icon-button>` +
    `</div>` +
    `<span class="ambient-cursor" aria-hidden="true" hidden>${icon('arrow-right')}${icon('arrow-left')}</span>` +
    `</div>` +
    // Glosario de variantes
    `<div class="glossary needs-data">` +
    `<div class="glossary-title role-display-sm"><slot name="glossary-title"></slot></div>` +
    `<arq-variants-table class="table" downloads="downloads-modal"></arq-variants-table>` +
    `</div>` +
    // Descripción (STORY): foto a todo el ancho con el texto encima (Dark local)
    `<div class="story-block needs-data">` +
    `<div class="story" data-arq-theme="dark" hidden>` +
    `<div class="story-bg" hidden><img alt="" loading="lazy"></div>` +
    `<div class="story-title"><slot name="story-title"></slot></div>` +
    `<div class="story-body">` +
    `<div class="story-text"><slot name="story-text"></slot><slot name="story-list"></slot></div>` +
    `<arq-button class="story-link" type="underline" show-underline show-icon icon="arrow-up-right" hidden></arq-button>` +
    `</div>` +
    `</div>` +
    `</div>` +
    // «¿Te interesa este producto?» (los textos llegan por slot desde la página)
    `<div class="cta" hidden>` +
    `<div class="cta-block">` +
    `<div class="cta-text">` +
    `<div class="cta-title role-heading-1"><slot name="cta-title"></slot></div>` +
    `<p class="cta-description role-body-lg"><slot name="cta-description"></slot></p>` +
    `</div>` +
    `<arq-button class="cta-action" show-icon icon="arrow-right"><slot name="cta-action"></slot></arq-button>` +
    `</div>` +
    `</div>` +
    // Inspiración: foto ancha o video + foto vertical, y el texto a la derecha
    `<div class="inspiration" hidden>` +
    `<div class="inspiration-copy">` +
    `<div class="inspiration-text role-body-lg"><slot name="inspiration"></slot></div>` +
    `</div>` +
    `<div class="inspiration-images needs-data"></div>` +
    `</div>` +
    // Explora la colección (Light, sobre color/surface/subtle: Figma V1 y V2)
    `<div class="collection needs-data" hidden>` +
    `<div class="collection-intro">` +
    `<div class="collection-title role-heading-2"><slot name="collection-title"></slot></div>` +
    `<arq-button class="collection-link" type="underline" show-underline show-icon icon="arrow-up-right"></arq-button>` +
    `</div>` +
    `<div class="cards collection-cards"></div>` +
    `</div>` +
    `</div>` +
    `<arq-compare-bar class="compare-bar"></arq-compare-bar>` +
    `<arq-download-modal id="downloads-modal"><slot name="modal-title" slot="title"></slot></arq-download-modal>`;

  #product = null;

  update(changed) {
    if (changed.has('ctaHref')) this.shadowRoot.querySelector('.cta-action').href = this.ctaHref;
  }

  #selection = {};
  #storyHasText = false;
  #sku = null;

  setup() {
    const root = this.shadowRoot;
    this.#moveMainImage();
    root.querySelector('slot[name="inspiration"]').addEventListener('slotchange', () => this.#syncInspiration());
    this.#syncInspiration();
    root.querySelector('slot[name="cta-title"]').addEventListener('slotchange', () => this.#syncCta());
    this.#syncCta();

    this.#setupAmbient();

    // Hasta 1023 px (Tablet y Mobile) Iluminar es solo el interruptor; la palabra queda
    // oculta para lectores de pantalla (show-label apagado)
    const compact = matchMedia('(max-width: 1023px)');
    const syncLabel = () => (root.querySelector('.iluminar').showLabel = !compact.matches);
    compact.addEventListener('change', syncLabel);
    syncLabel();

    root.querySelector('.iluminar').addEventListener('arq:change', (event) => this.#iluminar(event.detail.checked));
    // Viene de Productos o Colecciones iluminado: la ficha arranca iluminada, sin fundido
    if (takeThemeHandoff()) {
      root.querySelector('.iluminar').checked = true;
      withoutThemeTransition(() => this.#applyDark(true));
    }
    root.querySelector('.options').addEventListener('arq:change', (event) => {
      const attribute = event.target.closest('[data-attribute]')?.dataset.attribute;
      if (!attribute || !event.detail?.selected) return;
      this.#selection = choose(this.#selection, attribute, event.detail.value);
      this.#refreshOptions();
      this.#showVariant({ updateUrl: true });
    });
    root.querySelector('.datasheet').addEventListener('click', (event) => this.#datasheet(this.#sku, event.currentTarget));
    root.querySelector('.to-glossary').addEventListener('click', () => this.#toGlossary());
    // Comparar: suma o saca la variante elegida de la compare-bar (hasta 3)
    const compare = root.querySelector('.compare');
    const bar = root.querySelector('.compare-bar');
    compare.addEventListener('arq:change', (event) => {
      event.stopPropagation();
      if (!this.#sku) return;
      if (!event.detail.checked) bar.remove(this.#sku);
      else if (!bar.add(this.#compareItem())) compare.checked = false; // ya hay 3
    });
    bar.addEventListener('arq:compare-change', () => {
      compare.checked = bar.has(this.#sku);
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
    this.#renderStory(product.group.story);
    this.#renderInspirationText(product.group.inspiration);
    this.#buildOptions();
    this.#refreshOptions();
    // El SKU de ?sku=, si es del grupo; si no, el is_group_default. La URL siempre queda con ?sku=
    this.#showVariant({ updateUrl: true, sku: product.variants.find((v) => v.sku === sku)?.sku ?? product.variants.find((v) => v.isDefault)?.sku });
    this.#renderAmbient();
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
    animateThemeChange();
    this.#applyDark(dark);
  }

  #applyDark(dark) {
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

  // sku: el SKU pedido (apertura de la ficha). Sin él, el que coincide con los
  // atributos elegidos. Un grupo sin variant_attributes no tiene selección: el
  // SKU manda (con la selección vacía findVariant daría siempre el primero).
  #showVariant({ updateUrl = false, sku = null } = {}) {
    const { group, variants } = this.#product;
    const chosen = Object.keys(this.#selection).length ? findVariant(variants, this.#selection) : null;
    const variant = variants.find((v) => v.sku === sku) ?? chosen ?? variants.find((v) => v.isDefault) ?? variants[0];
    if (!variant || variant.sku === this.#sku) return;
    this.#sku = variant.sku;
    const details = variantDetails(group, variant.sku);
    const root = this.shadowRoot;

    root.querySelector('.sku').textContent = details.sku;
    const description = root.querySelector('.variant-description');
    description.textContent = details.description ?? '';
    description.hidden = !details.description;
    root.querySelector('.gallery').images = details.images;
    this.#renderSpecs(details.sections);
    const compare = root.querySelector('.compare');
    compare.checked = root.querySelector('.compare-bar').has(details.sku);

    if (updateUrl) {
      const url = new URL(location.href);
      url.searchParams.set('sku', variant.sku);
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
        list.columns = true;
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

  #compareItem() {
    const { group } = this.#product;
    const details = variantDetails(group, this.#sku);
    return { sku: this.#sku, name: group.name, meta: this.#sku, image: details.images?.[0]?.src ?? null };
  }

  // El PDF lo genera src/pdf/ficha-tecnica.js (lo engancha main.js), que deja
  // la promesa en detail.pending: mientras tanto el botón queda en Loading.
  #datasheet(sku, button = null) {
    if (!sku) return;
    const detail = { sku };
    this.emit('datasheet', detail);
    if (!button || !detail.pending) return;
    button.loadingLabel = TEXT.generating;
    button.loading = true;
    const done = () => (button.loading = false);
    detail.pending.then(done, done);
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
    const root = this.shadowRoot;
    const ambient = root.querySelector('.ambient');
    root.querySelector('.ambient-block').hidden = !images.ambient.length;
    ambient.replaceChildren(...images.ambient.map((src, i) => image(src, `${group.name}, ambiente ${i + 1}`)));
    ambient.dispatchEvent(new Event('scroll'));
  }

  // Galería de ambiente: con mouse, el cursor pasa a ser la flecha (icon/arrow-right o arrow-left)
  // y el clic desplaza la fila; sin cursor (táctil), dos botones debajo de las fotos.
  // Mitad derecha: siguiente; mitad izquierda: anterior. Al inicio solo hay «siguiente» y,
  // al final, solo «anterior».
  #setupAmbient() {
    const root = this.shadowRoot;
    const scroller = root.querySelector('.ambient');
    const cursor = root.querySelector('.ambient-cursor');
    const prev = root.querySelector('.ambient-prev');
    const next = root.querySelector('.ambient-next');
    const canPrev = () => scroller.scrollLeft > 1;
    const canNext = () => scroller.scrollLeft + scroller.clientWidth < scroller.scrollWidth - 1;
    let pointer = null;

    const direction = (x) => {
      const box = scroller.getBoundingClientRect();
      let dir = x < box.left + box.width / 2 ? -1 : 1;
      if (dir === -1 && !canPrev()) dir = 1;
      if (dir === 1 && !canNext()) dir = -1;
      return dir;
    };
    const place = () => {
      const scrollable = canPrev() || canNext();
      scroller.classList.toggle('is-scrollable', scrollable);
      cursor.hidden = !pointer || !scrollable;
      if (cursor.hidden) return;
      cursor.dataset.direction = direction(pointer.x) === 1 ? 'next' : 'prev';
      cursor.style.transform = `translate(${pointer.x}px, ${pointer.y}px)`;
    };
    // De a una foto. Adelante: la próxima foto que no entra completa (con el margen de la derecha)
    // y que todavía no está alineada a la izquierda; se la lleva hasta que entre completa, o
    // alineada a la izquierda si es más ancha que la pantalla. Atrás: la última foto cortada a
    // la izquierda, alineada a la izquierda. La última queda con el margen derecho.
    const go = (dir) => {
      const box = scroller.getBoundingClientRect();
      const inset = parseFloat(getComputedStyle(scroller).paddingLeft) || 0;
      const here = scroller.scrollLeft;
      const items = [...scroller.children].map((img) => {
        const rect = img.getBoundingClientRect();
        return { left: rect.left - box.left + here, right: rect.right - box.left + here };
      });
      const max = scroller.scrollWidth - scroller.clientWidth;
      let target;
      if (dir === 1) {
        const item = items.find((i) => i.right > here + scroller.clientWidth - inset + 2 && i.left > here + inset + 2);
        target = item ? Math.min(item.right + inset - scroller.clientWidth, item.left - inset) : max;
      } else {
        const item = [...items].reverse().find((i) => i.left < here + inset - 2);
        target = item ? item.left - inset : 0;
      }
      scroller.scrollTo({ left: Math.min(Math.max(target, 0), max), behavior: reducedMotion() ? 'auto' : 'smooth' });
    };

    const sync = () => {
      prev.disabled = !canPrev();
      next.disabled = !canNext();
      place();
    };
    scroller.addEventListener('scroll', sync, { passive: true });
    // las fotos cambian el ancho total al cargar
    scroller.addEventListener('load', sync, true);
    new ResizeObserver(sync).observe(scroller);

    scroller.addEventListener('pointermove', (event) => {
      if (event.pointerType !== 'mouse') return;
      pointer = { x: event.clientX, y: event.clientY };
      place();
    });
    scroller.addEventListener('pointerleave', () => {
      pointer = null;
      place();
    });
    scroller.addEventListener('click', (event) => {
      if (event.pointerType === 'mouse' || event.detail > 0) {
        if (!(canPrev() || canNext())) return;
        go(direction(event.clientX));
      }
    });
    prev.addEventListener('click', () => go(-1));
    next.addEventListener('click', () => go(1));
  }

  // ── Descripción ───────────────────────────────────────────────────
  // STORY (solo de los datos) se arma en el DOM de la página: la primera línea
  // es el título (<h2>, con o sin «## »), los demás «## » → <h3>,
  // «- » → <li> de un <ul>, el resto <p>.
  #renderStory(story) {
    for (const old of this.querySelectorAll(':scope > [slot="story-title"], :scope > [slot="story-text"], :scope > [slot="story-list"]')) old.remove();
    const lines = String(story ?? '').split('\n').map((line) => line.trim()).filter(Boolean);
    const nodes = [];
    let list = null;
    for (const line of lines) {
      const item = line.match(/^[-–•]\s+(.*)$/);
      if (item) {
        list ??= Object.assign(document.createElement('ul'), { slot: 'story-list' });
        list.append(Object.assign(document.createElement('li'), { textContent: item[1] }));
        continue;
      }
      const heading = line.startsWith('## ');
      const first = !nodes.length;
      const node = document.createElement(first ? 'h2' : heading ? 'h3' : 'p');
      node.slot = first ? 'story-title' : 'story-text';
      node.textContent = heading ? line.slice(3).trim() : line;
      nodes.push(node);
    }
    this.append(...nodes, ...(list ? [list] : []));
    this.#storyHasText = nodes.length > 0 || Boolean(list);
    this.#syncStory();
  }

  // La sección se muestra si hay texto (y entonces la foto, si hay); sin texto no hay sección
  #syncStory() {
    const root = this.shadowRoot;
    const { images, collection } = this.#product ?? {};
    const story = root.querySelector('.story');
    story.hidden = !this.#storyHasText;
    const bg = root.querySelector('.story-bg');
    bg.hidden = !images?.description;
    if (images?.description) bg.querySelector('img').src = images.description;
    const link = root.querySelector('.story-link');
    link.hidden = !collection;
    if (collection) {
      link.href = collectionHref(collection.id);
      link.textContent = `Ver colección ${collection.name}`;
    }
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
  // Solo el texto de los datos: si falta, se quita el del HTML.
  #renderInspirationText(text) {
    let element = this.querySelector(':scope > [slot="inspiration"]');
    if (!text) {
      element?.remove();
      return;
    }
    if (!element) {
      element = document.createElement('p');
      element.slot = 'inspiration';
      this.append(element);
    }
    element.textContent = text;
  }

  #syncInspiration() {
    const root = this.shadowRoot;
    const text = root.querySelector('slot[name="inspiration"]').assignedElements().length > 0;
    const images = root.querySelector('.inspiration-images').children.length > 0;
    root.querySelector('.inspiration').hidden = !text && !images;
  }

  // Fotos de ambiente del grupo, sin la del parallax (ambient_6): ambient_2_on, 3_on, 4, 5 y 7.
  // La galería toma todas; la inspiración, las dos últimas. TODO (datos): cuando haya más fotos o un
  // video (video_inspiration), se reparten distinto.
  #pool() {
    return this.#product.images.ambient;
  }

  // Video de inspiración (video_inspiration). Sin video, una foto ocupa su lugar.
  #video(src, alt) {
    const url = this.#product.group.video;
    if (!url) return image(src, alt, 'media-wide');
    const video = document.createElement('video');
    video.src = url;
    video.controls = true;
    video.playsInline = true;
    video.preload = 'metadata';
    video.className = 'media-wide';
    video.setAttribute('aria-label', alt);
    return video;
  }

  #renderInspirationImages() {
    const { group } = this.#product;
    const [, , , d, e] = this.#pool();
    const nodes = [d && this.#video(d, `${group.name}, video`), e && image(e, `${group.name}, inspiración`, 'media-portrait')];
    this.shadowRoot.querySelector('.inspiration-images').replaceChildren(...nodes.filter(Boolean));
    this.#syncInspiration();
  }

  #syncCta() {
    this.shadowRoot.querySelector('.cta').hidden = !this.shadowRoot.querySelector('slot[name="cta-title"]').assignedElements().length;
  }

  // ── Explora la colección ──────────────────────────────────────────
  #renderCollection() {
    const { collection, family } = this.#product;
    const section = this.shadowRoot.querySelector('.collection');
    section.hidden = !collection || !family.length;
    section.querySelector('.collection-cards').replaceChildren(...family.map((card) => familyCard(card, 'large')));
  }
}

function image(src, alt, className = '') {
  const img = document.createElement('img');
  img.src = src;
  if (className) img.className = className;
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
