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
// - Breadcrumb y toggle Iluminar flotan sobre la foto (arriba a la izquierda y
//   abajo a la derecha). Se mide el brillo de la parte de la foto que queda
//   debajo de cada uno y se usa la versión con más contraste, con Iluminar
//   prendido o apagado. Foto clara: data-arq-theme="light" (el toggle negro de
//   siempre). Foto oscura: toggle Theme=Inverse (blanco apagado) y breadcrumb
//   en Dark. Se vuelve a medir al cambiar la foto o el tamaño. La foto se lee
//   de una copia chica con CORS (config.images.sampleBase); si no se puede, el
//   toggle sigue el modo del hero.
// - STORY (Markdown limitado): el componente arma con el texto, en el DOM de
//   la página, un <h2> con la primera línea (el título, con o sin «## », slot
//   story-title), un <p> por línea y un <ul> con las líneas «-», con createElement
//   y textContent (nunca innerHTML). Así el encabezado queda en el HTML de la página.
//   Se muestran sobre la foto de ambiente 6 a todo el ancho, que queda fija al
//   hacer scroll (parallax).
// - "Ver descargas" lleva al glosario, donde está la descarga de cada SKU.
// - Comparar: suma la variante elegida a la compare-bar de la ficha (hasta 3).
//   El lugar vacío (+) de la barra abre compare-picker, como en el listado.
// - "Generar ficha técnica" y "Ficha técnica" (modal del glosario) emiten arq:datasheet { sku }.
//   TODO (diseño): el PDF no tiene diseño; se genera cuando exista.

import { ArqElement } from '../../base/arq-element.js';
import { HorizontalRail } from '../../base/horizontal-rail.js';
import { SingleSelect } from '../../base/single-select.js';
import { PhotoViewer,photoViewerTemplate } from '../../base/photo-viewer.js';
import viewerCss from '../../base/photo-viewer.css?inline';
import { normalize } from '../../data/text.js';
import { animateThemeChange, refreshTheme, setBrowserBar, takeThemeHandoff, withoutThemeTransition } from '../../base/theme.js';
import { getProduct, variantDetails, categoryHref, listCompareCandidates, LAMPS_ENVIRONMENT } from '../../data/catalog.js';
import { attributeInfo } from '../../data/attributes.js';
import { config } from '../../config.js';
import { variantOptions, initialSelection, findVariant, choose } from '../../data/variants.js';
import '../breadcrumb/breadcrumb.js';
import '../breadcrumb-item/breadcrumb-item.js';
import '../button/button.js';
import '../toggle/toggle.js';
import '../checkbox/checkbox.js';
import '../compare-bar/compare-bar.js';
import '../compare-picker/compare-picker.js';
import '../product-gallery/product-gallery.js';
import '../sku/sku.js';
import '../option-group/option-group.js';
import '../option-tile/option-tile.js';
import '../swatch-picker/swatch-picker.js';
import '../swatch/swatch.js';
import '../tab/tab.js';
import '../dao-configurator/dao-configurator.js';
import '../accordion-item/accordion-item.js';
import '../spec-list/spec-list.js';
import '../spec-row/spec-row.js';
import '../variants-table/variants-table.js';
import { appendFinishes } from '../product-card/product-card.js';
import '../carousel-controls/carousel-controls.js';
import '../icon-button/icon-button.js';
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

// Brillo (luminancia relativa, WCAG) de la foto debajo del toggle o del
// breadcrumb a partir del cual la versión oscura (neutral/900) contrasta más
// que la clara (neutral/200): (L + 0,05)² = (0,0052 + 0,05) × (0,745 + 0,05) → L ≈ 0,16.
const BACKDROP_LIGHT = 0.16;
const BACKDROP_SAMPLE = 16; // lado de la muestra reducida, en píxeles de canvas

// Copia chica de la foto que se puede leer con CORS (config.images); null si
// la foto viene de otro servidor (no se intenta: dejaría un error en consola).
const sampleSrc = (src) => {
  const { sampleFrom, sampleBase } = config.images;
  if (src.startsWith(sampleFrom)) return sampleBase + src.slice(sampleFrom.length);
  const cdn = new URL(sampleBase).origin;
  return src.startsWith(`${cdn}/`) ? src : null;
};

const toLinear = (channel) => {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};

// Familia (sin tildes ni mayúsculas) de los productos de la ficha sin Iluminar
const NO_ILLUMINATION_FAMILY = 'dao';

class ArqFichaProducto extends ArqElement {
  static tag = 'arq-ficha-producto';
  static styles = css + viewerCss;
  static template =
    `<div class="page">` +
    // Hero (Ficha v2, 2085:27570): galería a sangre a la izquierda y configurador
    // a la derecha, con el encabezado adentro. Iluminar pone data-arq-theme="dark"
    // en este contenedor.
    `<div class="hero">` +
    `<div class="configurator">` +
    `<div class="gallery-column">` +
    `<arq-product-gallery class="gallery" fill inset-thumbs>` +
    `<arq-breadcrumb class="breadcrumb needs-data" slot="overlay"></arq-breadcrumb>` +
    `<arq-toggle class="iluminar needs-data" slot="overlay" show-label>Iluminar</arq-toggle>` +
    `</arq-product-gallery>` +
    `</div>` +
    `<div class="configurator-column">` +
    `<div class="header">` +
    `<div class="title-row">` +
    `<div class="title role-display"><slot name="title"></slot></div>` +
    // Descripción de la variante: debajo del nombre, en 14 px y discreta
    // (decisiones.md, 2026-10-21 · Configurador de la ficha)
    `<div class="description role-body-compact"><span class="variant-description" hidden></span></div>` +
    `<arq-sku class="sku needs-data" size="compact" data-arq-copy-motion></arq-sku>` +
    `</div>` +
    `</div>` +
    `<div class="info">` +
    `<p class="status role-body" role="status"></p>` +
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
    `<div class="spec-tabs" role="tablist" aria-label="Información técnica" hidden></div>` +
    `<div class="spec-panels"></div>` +
    `</div>` +
    // Galería de ambiente
    `<div class="ambient-block needs-data" hidden>` +
    `<div class="ambient" role="region" aria-label="Galería de ambiente" tabindex="0"></div>` +
    // Flechas debajo de las fotos en pantallas sin cursor (táctiles); con cursor, la flecha sigue al mouse
    `<div class="ambient-controls">` +
    `<arq-icon-button class="ambient-prev" icon="chevron-left" size="large" background="outline" disabled>${TEXT.previous}</arq-icon-button>` +
    `<arq-icon-button class="ambient-next" icon="chevron-right" size="large" background="outline">${TEXT.next}</arq-icon-button>` +
    `</div>` +
    `</div>` +
    photoViewerTemplate +
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
    `<div class="collection-rail">` +
    `<arq-carousel-controls class="collection-controls" buttons="carousel" progress="scroll" for="collection-rail" step="item" label-prev="Productos anteriores" label-next="Productos siguientes"></arq-carousel-controls>` +
    `<div class="cards" id="collection-rail"></div>` +
    `</div>` +
    `</div>` +
    `</div>` +
    `<arq-compare-bar class="compare-bar"></arq-compare-bar>` +
    `<arq-compare-picker class="picker"></arq-compare-picker>` +
    `<arq-download-modal id="downloads-modal" show-product><slot name="modal-title" slot="title"></slot></arq-download-modal>`;

  #product = null;
  #ambientRail = null;
  #collectionRail = null;
  #viewer = null;

  connectedCallback() {
    super.connectedCallback();
    this.#ambientRail?.connect();
    this.#collectionRail?.connect();
  }

  disconnectedCallback() {
    this.#ambientRail?.disconnect();
    this.#collectionRail?.disconnect();
    this.#viewer?.close();
  }

  #selection = {};
  #storyHasText = false;
  #sku = null;

  setup() {
    const root = this.shadowRoot;
    const specTabs = root.querySelector('.spec-tabs');
    new SingleSelect(specTabs, { items: 'arq-tab' });
    specTabs.addEventListener('arq:change', (event) => {
      event.stopPropagation();
      this.#showSpecTab(event.detail.value);
    });
    this.#moveMainImage();
    root.querySelector('slot[name="inspiration"]').addEventListener('slotchange', () => this.#syncInspiration());
    this.#syncInspiration();

    this.#setupAmbient();
    // Explora la colección: se arrastra con el mouse (cursor grab) además de las flechas
    this.#collectionRail = new HorizontalRail(this, root.querySelector('.cards'));
    this.#collectionRail.connect();

    // Hasta 1023 px (Tablet y Mobile) Iluminar es solo el interruptor; la palabra queda
    // oculta para lectores de pantalla (show-label apagado)
    const compact = matchMedia('(max-width: 1023px)');
    const syncLabel = () => (root.querySelector('.iluminar').showLabel = !compact.matches);
    compact.addEventListener('change', syncLabel);
    syncLabel();

    root.querySelector('.iluminar').addEventListener('arq:change', (event) => this.#iluminar(event.detail.checked));
    this.#watchToggleBackdrop();
    // Viene de Productos o Colecciones iluminado: la ficha arranca iluminada, sin fundido
    if (takeThemeHandoff()) {
      root.querySelector('.iluminar').checked = true;
      withoutThemeTransition(() => this.#applyDark(true));
    }
    root.querySelector('.options').addEventListener('arq:change', (event) => {
      const attribute = event.target.closest('[data-attribute]')?.dataset.attribute;
      if (!attribute || !event.detail?.selected) return;
      const { variants, variantAttributes } = this.#product;
      this.#selection = choose(variants, variantAttributes, this.#selection, attribute, event.detail.value);
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
      if (picker.open) this.#loadPicker();
    });
    // «Agregar producto» (compare-picker): lo abre el lugar vacío (+) de la
    // compare-bar; lo que se agrega va a la barra (como en catalog-listing).
    const picker = root.querySelector('.picker');
    bar.addEventListener('arq:add', (event) => {
      event.stopPropagation();
      picker.show(); // emite arq:search: carga la lista
    });
    picker.addEventListener('arq:search', () => this.#loadPicker());
    // El lugar vacío que lo abrió ya tiene producto: el foco vuelve a la barra
    picker.addEventListener('arq:close', (event) => {
      if (!event.detail.restored) bar.focusAdd();
    });
    picker.addEventListener('arq:add', (event) => {
      // En la barra, la misma meta que las cards (no la del modal)
      const { sku, name, cardMeta, meta, image } = event.detail.item;
      bar.add({ sku, name, meta: cardMeta ?? meta, image });
    });

    // Glosario: el ícono de cada fila abre el modal con los archivos de ese SKU
    const table = root.querySelector('.table');
    table.addEventListener('arq:downloads', (event) => this.#fillModal(event.detail.sku));
    root.querySelector('arq-download-modal').addEventListener('arq:download', (event) => {
      event.stopPropagation();
      this.#datasheet(event.currentTarget.dataset.sku, event.target.closest('arq-download-item'));
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
    // Daö no tiene Iluminar (decisiones.md, 2026-10-23): sin toggle, y si llegó iluminado desde el listado, vuelve a Light
    if (normalize(product.group.family) === NO_ILLUMINATION_FAMILY || /^DAO-/i.test(product.group.variantGroup ?? '')) {
      const toggle = this.shadowRoot.querySelector('.iluminar');
      toggle.hidden = true;
      if (toggle.checked) {
        toggle.checked = false;
        withoutThemeTransition(() => this.#applyDark(false));
      }
    }
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
    const { crumbs, see } = headerTrail(group, collection);
    root.querySelector('.breadcrumb').replaceChildren(
      ...crumbs.map(({ label, href, menu }) => {
        const item = document.createElement('arq-breadcrumb-item');
        item.theme = 'transparent'; // va sobre la foto
        item.href = href;
        if (menu) item.dataset.arqMenu = menu;
        item.showSeparator = true;
        item.textContent = label;
        return item;
      }),
      Object.assign(document.createElement('arq-breadcrumb-item'), { current: true, theme: 'transparent', textContent: group.name }),
    );
    for (const link of root.querySelectorAll('.collection-link')) {
      link.hidden = !see;
      if (!see) continue;
      link.href = see.href;
      link.textContent = see.label;
    }
  }

  // Un grupo que reúne varios product_name («Daö Simple», «Daö Doble») muestra el de
  // la variante elegida: en el título (el h1 del CMS, que llega por slot y empieza con
  // el nombre del grupo) y en la última migaja del breadcrumb.
  #renderName(name) {
    if (!this.#product.group.variantNames || !name) return;
    const title = this.querySelector(':scope > [slot="title"]');
    if (title && title.textContent !== name) title.textContent = name;
    const current = this.shadowRoot.querySelector('.breadcrumb').lastElementChild;
    if (current && current.textContent !== name) current.textContent = name;
  }

  // ── Contraste del toggle Iluminar con la foto ─────────────────────
  #backdrops = new Map(); // foto → promesa de su copia chica decodificada
  #backdropFrame = 0;

  #watchToggleBackdrop() {
    const root = this.shadowRoot;
    const gallery = root.querySelector('.gallery');
    const schedule = () => {
      cancelAnimationFrame(this.#backdropFrame);
      this.#backdropFrame = requestAnimationFrame(() => this.#syncOverlayTones());
    };
    // load no burbujea: en captura llega el de la imagen principal (variante, miniatura o Iluminar)
    gallery.addEventListener('load', schedule, true);
    const resize = new ResizeObserver(schedule);
    resize.observe(gallery);
    resize.observe(root.querySelector('.iluminar'));
    resize.observe(root.querySelector('.breadcrumb'));
    schedule();
  }

  async #syncOverlayTones() {
    const root = this.shadowRoot;
    const toggle = root.querySelector('.iluminar');
    const breadcrumb = root.querySelector('.breadcrumb');
    const img = root.querySelector('.gallery > img[slot="image"]');
    // src (no currentSrc): al iluminar se mide la foto nueva antes de que termine de cargar
    const src = img && img.style.display !== 'none' && img.getAttribute('src') ? img.src : null;
    const measure = async (element) => {
      if (!src) return null;
      try {
        return await this.#backdropLuminance(src, img, element);
      } catch {
        return null; // la foto no se puede leer (sin CORS): queda el modo del hero
      }
    };
    const [toggleLuminance, breadcrumbLuminance] = await Promise.all([measure(toggle), measure(breadcrumb)]);
    if (src && img.src !== src) return; // cambió la foto mientras se medía
    // La otra versión (apagada o encendida) de esta foto, lista para Iluminar
    const shown = root.querySelector('.gallery').images.find((image) => [image.src, image.srcOn].some((url) => url && new URL(url, location.href).href === src));
    for (const url of [shown?.src, shown?.srcOn]) if (url) this.#backdropImage(url).catch(() => {});
    const dark = (luminance) => luminance !== null && luminance < BACKDROP_LIGHT;
    toggle.theme = dark(toggleLuminance) ? 'inverse' : 'default';
    if (toggleLuminance === null || dark(toggleLuminance)) toggle.removeAttribute('data-arq-theme');
    else toggle.setAttribute('data-arq-theme', 'light');
    if (breadcrumbLuminance === null) breadcrumb.removeAttribute('data-arq-theme');
    else breadcrumb.setAttribute('data-arq-theme', dark(breadcrumbLuminance) ? 'dark' : 'light');
  }

  // Luminancia media de la parte de la foto que tapa el toggle, con el recorte
  // de object-fit: cover. Se lee una copia chica de la foto pedida con CORS
  // (sampleSrc): la del <img> no se puede leer.
  async #backdropLuminance(src, img, toggle) {
    const image = await this.#backdropImage(src);
    if (!image) return null;
    const box = img.getBoundingClientRect();
    const area = toggle.getBoundingClientRect();
    if (!box.width || !box.height || !area.width || !area.height) return null;
    const scale = Math.max(box.width / image.naturalWidth, box.height / image.naturalHeight);
    const left = box.left + (box.width - image.naturalWidth * scale) / 2;
    const top = box.top + (box.height - image.naturalHeight * scale) / 2;
    const canvas = document.createElement('canvas');
    canvas.width = BACKDROP_SAMPLE;
    canvas.height = BACKDROP_SAMPLE;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    context.drawImage(
      image,
      (area.left - left) / scale,
      (area.top - top) / scale,
      area.width / scale,
      area.height / scale,
      0,
      0,
      BACKDROP_SAMPLE,
      BACKDROP_SAMPLE,
    );
    const { data } = context.getImageData(0, 0, BACKDROP_SAMPLE, BACKDROP_SAMPLE);
    let total = 0;
    for (let i = 0; i < data.length; i += 4) {
      total += 0.2126 * toLinear(data[i]) + 0.7152 * toLinear(data[i + 1]) + 0.0722 * toLinear(data[i + 2]);
    }
    return total / (data.length / 4);
  }

  // La copia chica se pide solo si la foto existe: la original ya la pidió la
  // galería (sale de la caché); si falta en la base, no se suma otro error.
  #backdropImage(src) {
    if (!this.#backdrops.has(src)) {
      const sample = sampleSrc(src);
      const load = (url, cors) => {
        const image = new Image();
        if (cors) image.crossOrigin = 'anonymous';
        image.src = url;
        return image.decode().then(() => image);
      };
      const ready = sample ? load(src, false).then(() => load(sample, true)) : Promise.resolve(null);
      ready.catch(() => this.#backdrops.delete(src)); // se reintenta la próxima vez
      this.#backdrops.set(src, ready);
    }
    return this.#backdrops.get(src);
  }

  #iluminar(dark) {
    animateThemeChange();
    this.#applyDark(dark);
  }

  #followPhotoTimer = 0;

  #followPhoto() {
    const root = this.shadowRoot;
    const elements = [root.querySelector('.breadcrumb'), root.querySelector('.iluminar')];
    const vars = {
      '--arq-theme-text-delay': '0s',
      '--arq-theme-text-duration': 'var(--arq-illumination-image-duration)',
      '--arq-theme-text-easing': 'var(--arq-illumination-image-easing)',
    };
    for (const element of elements) for (const [name, value] of Object.entries(vars)) element.style.setProperty(name, value);
    clearTimeout(this.#followPhotoTimer);
    // Se quitan al terminar, así hover y foco no se retrasan
    this.#followPhotoTimer = setTimeout(() => {
      for (const element of elements) for (const name of Object.keys(vars)) element.style.removeProperty(name);
    }, 1200);
  }

  #applyDark(dark) {
    const hero = this.shadowRoot.querySelector('.hero');
    for (const element of [hero, ...document.querySelectorAll('arq-navbar')]) {
      if (dark) element.setAttribute('data-arq-theme', 'dark');
      else element.removeAttribute('data-arq-theme');
    }
    refreshTheme(); // el observer de theme.js no ve el cambio dentro del Shadow DOM
    // Breadcrumb y toggle están sobre la foto: su color funde con ella (misma
    // duración y curva, sin el retraso del resto de los textos), no con el texto
    // de la página, que arranca después y quedaba a destiempo (2026-10-22).
    this.#followPhoto();
    // La galería ya pasó a la otra foto: breadcrumb y toggle cambian en el mismo
    // instante que el hero (las copias para medir están precargadas), no al cargar la foto
    this.#syncOverlayTones();
    setBrowserBar(dark, document.querySelector('arq-navbar') ?? hero); // la barra del navegador sigue al navbar
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
        // Imagen del acabado (data/finishes.js); sin imagen, el swatch muestra el neutro.
        const src = swatches ? this.#product.finishImages?.[option.value] : null;
        if (src) item.src = src;
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
      // Color: el acabado elegido junto a la etiqueta (la muestra no tiene texto)
      const group = root.querySelector(`.options [data-attribute="${CSS.escape(attribute)}"]`);
      if (group?.type === 'swatches') group.value = options.find((option) => option.selected)?.value ?? '';
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
    this.#renderName(details.name);
    const description = root.querySelector('.variant-description');
    description.textContent = details.description ?? '';
    description.hidden = !details.description;
    root.querySelector('.gallery').images = details.images;
    // Copias para medir el brillo de la primera foto, apagada y encendida: así
    // el toggle cambia junto con la foto al iluminar
    for (const src of [details.images?.[0]?.src, details.images?.[0]?.srcOn]) if (src) this.#backdropImage(src).catch(() => {});
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

  // Pestañas (tab, como el mega-menu): «Especificaciones» con un acordeón por
  // grupo (lumínicas, eléctricas, materiales e instalación) e «Información
  // comercial» con su lista. En la colección Daö se suma «Configurador»
  // (arq-dao-configurator): se crea una vez. El SKU de la ficha queda
  // preseleccionado y, al cambiar de variante, vuelve a esa pieza. Al cambiar
  // de variante queda la pestaña elegida y abiertas las mismas secciones; la
  // primera vez, las tres en
  // Desktop y solo la primera (lumínicas) en Mobile. Una pestaña sin datos
  // no se muestra (src/data/attributes.js).
  #specTab = 'specs';
  #daoConfigurator = null;

  #specList(section) {
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
    return list;
  }

  #renderSpecs(sections) {
    const root = this.shadowRoot;
    const tablist = root.querySelector('.spec-tabs');
    const panels = root.querySelector('.spec-panels');
    const previous = [...panels.querySelectorAll('arq-accordion-item')];
    const technical = sections.filter((section) => section.id !== 'comercial');
    const open = previous.length ? new Set(previous.filter((item) => item.open).map((item) => item.dataset.section)) : new Set(matchMedia('(max-width: 767px)').matches ? [technical[0]?.id] : technical.map((section) => section.id));

    const accordion = document.createElement('div');
    accordion.className = 'accordion';
    for (const section of technical) {
      const item = document.createElement('arq-accordion-item');
      item.dataset.section = section.id;
      item.open = open.has(section.id);
      const title = document.createElement('span');
      title.slot = 'title';
      title.textContent = section.label;
      item.append(title, this.#specList(section));
      accordion.append(item);
    }
    const commercial = sections.find((section) => section.id === 'comercial');

    const configurador = this.#product.collection?.id === 'dao' ? this.#configuratorPanel() : null;
    const tabs = [
      technical.length && { id: 'specs', label: 'Especificaciones', content: accordion },
      commercial && { id: 'commercial', label: commercial.label, content: this.#specList(commercial) },
      configurador && { id: 'configurador', label: 'Configurador', content: configurador },
    ].filter(Boolean);
    if (!tabs.some((tab) => tab.id === this.#specTab)) this.#specTab = tabs[0]?.id;

    tablist.replaceChildren(
      ...tabs.map((tab) => {
        const el = document.createElement('arq-tab');
        el.id = `spec-tab-${tab.id}`;
        el.value = tab.id;
        el.setAttribute('aria-controls', `spec-panel-${tab.id}`);
        el.selected = tab.id === this.#specTab;
        el.textContent = tab.label;
        return el;
      }),
    );
    panels.replaceChildren(
      ...tabs.map((tab) => {
        const panel = document.createElement('div');
        panel.className = 'spec-panel';
        panel.id = `spec-panel-${tab.id}`;
        panel.dataset.tab = tab.id;
        panel.setAttribute('role', 'tabpanel');
        panel.setAttribute('aria-labelledby', `spec-tab-${tab.id}`);
        panel.hidden = tab.id !== this.#specTab;
        panel.append(tab.content);
        return panel;
      }),
    );
    tablist.hidden = tabs.length < 2;
  }

  #configuratorPanel() {
    if (!this.#daoConfigurator) this.#daoConfigurator = document.createElement('arq-dao-configurator');
    if (this.#sku) this.#daoConfigurator.sku = this.#sku;
    return this.#daoConfigurator;
  }

  #showSpecTab(id) {
    const root = this.shadowRoot;
    this.#specTab = id;
    for (const tab of root.querySelectorAll('.spec-tabs arq-tab')) tab.selected = tab.value === id;
    for (const panel of root.querySelectorAll('.spec-panel')) panel.hidden = panel.dataset.tab !== id;
  }

  #pickerRequest = 0;

  // Productos del compare-picker con la búsqueda del modal; los de la barra
  // salen como Agregado (y con 3, el resto Disabled).
  async #loadPicker() {
    const root = this.shadowRoot;
    const picker = root.querySelector('.picker');
    const selected = root.querySelector('.compare-bar').items.map((item) => item.sku);
    const request = ++this.#pickerRequest;
    picker.count = selected.length;
    try {
      const { items } = await listCompareCandidates({ ...picker.search, selected });
      if (request === this.#pickerRequest) picker.items = items;
    } catch (error) {
      console.error('[arq] compare-picker: no se pudo cargar el catálogo', error);
      if (request === this.#pickerRequest) picker.showError();
    }
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
    this.#viewer?.close();
    ambient.replaceChildren(...images.ambient.map((src, i) => {
      const img = image(src, `${group.name}, ambiente ${i + 1}`);
      img.tabIndex = 0; img.draggable = false; img.setAttribute('role', 'button');
      img.setAttribute('aria-label', `Ampliar ${img.alt}`);
      return img;
    }));
    ambient.scrollLeft = 0;
    ambient.dispatchEvent(new Event('scroll'));
  }

  // Avance nativo como Destacados; arrastrar desplaza y clic abre la foto.
  #setupAmbient() {
    const root = this.shadowRoot;
    const scroller = root.querySelector('.ambient');
    const photos = () => [...scroller.querySelectorAll('img')].map(img => ({ src: img.currentSrc || img.src, alt: img.alt }));
    this.#viewer = new PhotoViewer(root, photos, open => { this.#ambientRail.blocked = open; });
    this.#ambientRail = new HorizontalRail(this, scroller, {
      autoplay: true,
      open: event => {
        const img = event.composedPath().find(node => node.localName === 'img');
        if (img) this.#viewer.open([...scroller.children].indexOf(img), img);
      },
    });
    const prev = root.querySelector('.ambient-prev');
    const next = root.querySelector('.ambient-next');
    const sync = () => {
      prev.disabled = scroller.scrollLeft <= 1;
      next.disabled = scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - 1;
    };
    scroller.addEventListener('scroll', sync, { passive: true });
    scroller.addEventListener('arq:rail-resize', sync);
    scroller.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault(); this.#ambientRail.go(event.key === 'ArrowLeft' ? -1 : 1);
      } else if (event.key === 'Enter' || event.key === ' ') {
        const index = [...scroller.children].indexOf(event.target);
        if (index >= 0) { event.preventDefault(); this.#viewer.open(index, event.target); }
      }
    });
    prev.addEventListener('click', () => this.#ambientRail.go(-1));
    next.addEventListener('click', () => this.#ambientRail.go(1));
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
      link.href = categoryHref({ collection: collection.id }); // la navegación de sus productos
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

  // Mismo modal que Descargas (show-product: miniatura, SKU y variante): la
  // ficha técnica es un download-item Featured y los archivos, Default.
  #fillModal(sku) {
    const { group, variantAttributes } = this.#product;
    const modal = this.shadowRoot.querySelector('arq-download-modal');
    const details = variantDetails(group, sku);
    modal.dataset.sku = sku;
    modal.sku = sku;
    modal.thumb = details.images[0]?.src ?? null;
    modal.meta = variantAttributes.map((field) => details.values[field]).filter(Boolean).join(', ');
    const featured = document.createElement('arq-download-item');
    featured.emphasis = 'featured';
    featured.textContent = TEXT.datasheet;
    const items = details.downloads.map((file) => {
      const item = document.createElement('arq-download-item');
      item.href = file.href;
      item.textContent = file.label;
      return item;
    });
    for (const item of modal.querySelectorAll(':scope > arq-download-item')) item.remove();
    modal.append(featured, ...items);
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

  // ── Explora la colección ──────────────────────────────────────────
  #renderCollection() {
    const { collection, family } = this.#product;
    const section = this.shadowRoot.querySelector('.collection');
    section.hidden = !collection || !family.length;
    section.querySelector('.cards').replaceChildren(...family.map(productCard));
    // Con una sola card no hay nada que recorrer
    section.querySelector('.collection-controls').hidden = family.length < 2;
  }
}

// Migas de la ficha (hasta 3, sin Inicio: va sobre la foto). Una luminaria
// sale de Productos y sigue a su familia. Una lámpara o artefacto sigue a
// su macrofamilia y, si tiene, a su subfamilia.
function headerTrail(group, collection) {
  const lamps = group.environment?.includes(LAMPS_ENVIRONMENT) && !group.environment.some((env) => env === 'Interior' || env === 'Exterior');
  if (lamps) {
    const crumbs = [{ label: 'Lámparas y artefactos', href: categoryHref({ environment: LAMPS_ENVIRONMENT }) }];
    if (group.application) crumbs.push({ label: group.application, href: categoryHref({ environment: LAMPS_ENVIRONMENT, application: group.application }) });
    return { crumbs };
  }
  const family = group.family?.trim();
  if (family) {
    const href = categoryHref({ family });
    return {
      crumbs: [
        { label: 'Productos', href: '/arq/productos' },
        { label: family, href },
      ],
      see: { href, label: `Ver colección ${family}` },
    };
  }
  if (collection) {
    const href = categoryHref({ collection: collection.id });
    return {
      crumbs: [
        { label: 'Productos', href: '/arq/productos' },
        { label: collection.name, href },
      ],
      see: { href, label: `Ver colección ${collection.name}` },
    };
  }
  return { crumbs: [{ label: 'Productos', href: '/arq/productos' }] };
}

function image(src, alt, className = '') {
  const img = document.createElement('img');
  img.src = src;
  if (className) img.className = className;
  img.alt = alt;
  img.loading = 'lazy';
  return img;
}

// Las otras familias de la colección usan la misma product-card que Productos y
// Colecciones: imágenes de reposo y hover (también con Iluminar), acabados y link.
function productCard(data) {
  const card = document.createElement('arq-product-card');
  card.href = data.href;
  card.family = data.family;
  card.image = data.image;
  card.imageHover = data.imageHover;
  card.imageLit = data.imageLit;
  card.imageHoverLit = data.imageHoverLit;
  const name = document.createElement('h3');
  name.slot = 'name';
  name.textContent = data.name;
  card.append(name);
  appendFinishes(card, data.finishes);
  return card;
}

ArqFichaProducto.define();

export { ArqFichaProducto };
