// product-card · Figma 990:2372 · ficha doc/product-card (1430:2371)
//
// Tarjeta de producto (Productos) o de colección (Colecciones, página de
// colección), siempre vertical con imagen 7:10. Toda la tarjeta es un link;
// "Comparar" queda fuera del link.
//
//   <arq-product-card href="/arq/producto/kanu-jardin" show-compare
//     image="…/principal.jpg" image-hover="…/principal-on.jpg"
//     image-lit="…/principal-on.jpg" image-hover-lit="…/ambiente-1-on.jpg">
//     <h3 slot="name">Kanu Jardín</h3>
//     <span slot="specs">35 – 50 cm</span>
//     <span slot="specs">6 – 12 W</span>
//     <arq-swatch slot="finishes" src="…">Negro</arq-swatch>
//   </arq-product-card>
//
// - Link estirado (src/base/card-link.css): el <a> envuelve solo el nombre.
// - Imágenes (DESIGN.md §8): reposo = principal apagada; hover sobre la imagen
//   y foco = principal encendida (Iluminar: reposo = principal encendida, hover =
//   ambiente 1 encendido; sin él, el estudio apagado sobre fondo gris claro:
//   hover-unlit / hover-ground, ver DESIGN.md §8 · Imágenes de product-card), con un
//   fundido entre dos <img> (motion/duration/slow). Iluminar (data-arq-theme=
//   "dark" en un ancestro, src/base/theme.js) pasa a las versiones encendidas.
//   Sin imagen de hover no hay cambio; sin encendida queda la apagada; sin principal, un
//   fondo color/surface/subtle con el nombre. En táctiles no hay hover.
// - Carga: solo la imagen visible de entrada; la de hover al primer hover o
//   foco; las encendidas cuando se activa Iluminar.
// - Size: Large (listados) o Small. Large pasa sola al aspecto Small hasta
//   767 px (grilla mobile; decisión 2026-10-02 · product-card).
// - Orden: nombre, datos (slot specs: dos líneas cortas, ver appendSpecs y
//   specs en src/data/catalog.js) y acabados debajo. Los datos y los acabados
//   se muestran si su slot tiene contenido. Reemplaza al slot meta.
// - Show compare: checkbox "Comparar"; emite arq:compare { checked }.
// - Acabados elegibles: con más de un acabado y datos por acabado (data-* de
//   cada swatch, ver appendFinishes) los swatches son un radiogroup: el elegido
//   (selected) lleva el aro de Selected de la ficha y todos el de Hover (atributo
//   ring del swatch), sin crecer (siempre Small, 16, a space/gap/md entre
//   muestras). Elegir uno cambia las imágenes y el link a las de
//   ese acabado y emite arq:finish { name, sku, href, image }. Con un solo
//   acabado se ve elegido (como la opción única de la ficha), pero no se elige.
// - loading: card de carga (skeleton) con la misma geometría (bloque 7:10,
//   nombre, dos líneas de datos y acabados) en color/surface/subtle, como las
//   filas de carga de Descargas, con una franja de brillo que la cruza
//   (shimmer; fija con reduced motion). Fuera del árbol de accesibilidad. Figma: State=Loading.
// - La foto principal funde al cargar la primera vez (motion/duration/slow);
//   si ya estaba en la caché aparece directo. Al cambiar de acabado o con
//   Iluminar, no.
// - Producto grande (Döuli 18W, Höshi 12W, Sen 10W): la foto de estudio se
//   achica para que el producto no pase de space/padding/3xl (2xl en Mobile)
//   de los bordes del recuadro; lo que se pasa se achica con la raíz cúbica, sin llegar a
//   space/padding/lg, así el más grande sigue viéndose más grande
//   (src/base/image-fit.js). Se mide antes de mostrarla.

import { ArqElement } from '../../base/arq-element.js';
import { trackThemeImage, watchTheme, whenImageReady } from '../../base/theme.js';
import { tipForText } from '../../data/attributes.js';
import { temperatureColor } from '../../base/color-temperature.js';
import { bindTooltip } from '../../base/tooltip.js';
import { containTransform, fitScale, productBox, tokenPx } from '../../base/image-fit.js';
import '../checkbox/checkbox.js';
import cardLinkCss from '../../base/card-link.css?inline';
import tooltipCss from '../../base/tooltip.css?inline';
import css from './product-card.css?inline';

const MOBILE = matchMedia('(max-width: 767px)');

/**
 * Agrega los acabados de una card como swatches del slot finishes. finishes:
 * [{ name, src, selected, sku, href, image, imageHover, imageLit, imageHoverLit }]
 * (src/data/catalog.js). Lo que trae cada acabado va en data-* del swatch: lo
 * lee la card al elegirlo.
 */
export function appendFinishes(card, finishes = []) {
  for (const finish of finishes) {
    const swatch = document.createElement('arq-swatch');
    swatch.slot = 'finishes';
    swatch.setAttribute('ring', '');
    swatch.textContent = finish.name;
    if (finish.src) swatch.src = finish.src;
    if (finish.selected) swatch.setAttribute('selected', '');
    for (const key of FINISH_DATA) if (finish[key]) swatch.dataset[key] = finish[key];
    card.append(swatch);
  }
}

/**
 * Agrega los datos de una card como líneas del slot specs: specs es una lista
 * de textos cortos, cada uno en su línea («1 – 3 módulos», «6 – 12 W»).
 */
export function appendSpecs(card, specs = []) {
  for (const item of specs) {
    // una línea de varios datos ([ángulo, IP, CRI, UGR]): cada dato va en su span y los
    // que siguen al primero llevan `divided`, la línea vertical que los separa (product-card.css)
    // cada dato es un texto o { text, tip }: tip es el tooltip al pasar el mouse
    [].concat(item).forEach((part, index) => {
      const { text, tip } = typeof part === 'object' ? part : { text: part };
      const line = document.createElement('span');
      line.slot = 'specs';
      line.textContent = text;
      // El tooltip es solo con mouse: el texto también queda para lectores de pantalla
      if (tip) { line.dataset.tip = tip; line.setAttribute('aria-description', tip); }
      if (index) line.toggleAttribute('divided', true);
      card.append(line);
    });
  }
}

// Qué lleva cada swatch elegible (data-sku, data-href, data-image, …)
const FINISH_DATA = ['sku', 'href', 'temperature', 'image', 'imageHover', 'imageLit', 'imageHoverLit'];

class ArqProductCard extends ArqElement {
  static tag = 'arq-product-card';
  static styles = cardLinkCss + tooltipCss + css;
  static properties = {
    size: { type: String, values: ['large', 'small'], default: 'large' }, // Size
    showCompare: { type: Boolean }, // Show compare
    compared: { type: Boolean }, // checkbox "Comparar" marcado
    href: { type: String },
    image: { type: String }, // principal (hero), luz apagada
    imageHover: { type: String }, // hover sin Iluminar: principal encendida
    imageLit: { type: String }, // principal (hero), luz encendida
    imageHoverLit: { type: String }, // hover con Iluminar: ambiente 1 encendido
    loading: { type: Boolean }, // card de carga (skeleton)
    temperature: { type: String }, // temperatura de color, dentro de la imagen abajo a la derecha
    family: { type: String }, // familia de la base; Fuji, Mini Kai, Mini Kai Round y Sen no recortan la foto. Tori Visera, por el nombre del producto.
  };
  static template =
    `<div class="card">` +
    `<div class="card-media">` +
    // Cable de un colgante achicado, de arriba hasta la foto (#applyFit)
    `<span class="stem" aria-hidden="true"></span>` +
    `<img class="img base" alt="" loading="lazy" decoding="async">` +
    `<img class="img hover" alt="" decoding="async">` +
    `<span class="fallback role-body-sm" aria-hidden="true"></span>` +
    // temperatura de color: un puntito de ese color y el texto, sin fondo
    `<span class="temp role-body-sm" hidden><span class="temp-dot" aria-hidden="true"></span><span class="temp-text"></span></span>` +
    `</div>` +
    `<div class="info">` +
    `<div class="title"><a class="card-link name"><slot name="name"></slot></a></div>` +
    `<p class="specs role-body" hidden><slot name="specs"></slot></p>` +
    `<span class="finishes" hidden><slot name="finishes"></slot><span class="more role-body-sm" role="img" hidden></span></span>` +
    // «Comparar» + el nombre del producto solo para lectores: en un listado
    // cada checkbox se distingue (WCAG 2.4.6). Se ve igual que en Figma.
    `<arq-checkbox class="compare" show-label hidden>Comparar<span class="compare-name visually-hidden"></span></arq-checkbox>` +
    // Cargando: barras con el alto de línea de cada texto, así la card de
    // carga mide lo mismo que la card que la reemplaza
    `<span class="sk sk-title"><span class="sk-name"><span class="sk-bar"></span></span></span>` +
    `<span class="sk sk-detail role-body-compact-regular"><span class="sk-bar sk-short"></span><span class="sk-bar sk-short"></span></span>` +
    `<span class="sk sk-swatches"><span></span><span></span><span></span></span>` +
    `</div>` +
    `</div>`;

  #dark = false;
  #hoverWanted = false;
  #finishToken = 0;
  #infoWidth = 0; // ancho de .info, para ver cuántos acabados entran
  #revealed = false; // la foto principal ya tuvo su fundido de entrada
  #failed = new Set(); // fotos que no cargaron
  #boxes = new Map(); // <img> → dónde está el producto en su foto (image-fit.js)

  setup() {
    const root = this.shadowRoot;
    for (const img of root.querySelectorAll('.img')) {
      // Se muestra al cargar, ya con su escala (producto grande, #fit): así no
      // se ve achicarse. No se usa hidden: una <img> lazy oculta no se carga.
      img.addEventListener('load', () => {
        const src = img.getAttribute('src');
        this.#fit(img).then(() => img.getAttribute('src') === src && img.classList.add('loaded'));
      });
      // Foto que no carga (404 en la base): se recuerda, así un nuevo dibujo
      // (Iluminar, hover) no la vuelve a pedir ni esconde el fondo con el nombre.
      // Si era la encendida, se usa la apagada (DESIGN.md §8).
      img.addEventListener('error', () => {
        img.classList.remove('loaded', 'reveal');
        const src = img.getAttribute('src');
        if (!src) return;
        this.#failed.add(src);
        this.#renderImages();
      });
    }
    // El fundido de entrada es uno solo: después la foto cambia sin él
    const base = root.querySelector('.base');
    base.addEventListener('transitionend', (event) => {
      if (event.propertyName === 'opacity' && base.classList.contains('loaded')) base.classList.remove('reveal');
    });
    // La de hover se pide recién al primer hover o foco.
    const wantHover = () => {
      if (this.#hoverWanted) return;
      this.#hoverWanted = true;
      this.#renderImages();
    };
    const card = root.querySelector('.card');
    // Solo con mouse: en táctil pointerenter llega con cada toque (también al
    // desplazar) y bajaba una foto que nunca se muestra
    card.addEventListener('pointerenter', (event) => event.pointerType === 'mouse' && wantHover());
    root.querySelector('.card-link').addEventListener('focus', wantHover);
    // Hover con mouse solo sobre la imagen (no el nombre ni los acabados): un
    // solo estado para el fondo y la imagen. El ::after del link estirado tapa
    // la imagen, así que se mide contra su caja en vez de escuchar en .card-media.
    const media = root.querySelector('.card-media');
    const setMediaHover = (on) => {
      if (card.classList.contains('is-media-hover') === on) return;
      card.classList.toggle('is-media-hover', on);
      this.#syncHoverGround();
    };
    const overMedia = (event) => {
      const box = media.getBoundingClientRect();
      return event.clientX >= box.left && event.clientX < box.right &&
        event.clientY >= box.top && event.clientY < box.bottom;
    };
    const link = root.querySelector('.card-link');
    link.addEventListener('focus', () => this.#syncHoverGround());
    link.addEventListener('blur', () => this.#syncHoverGround());
    card.addEventListener('pointerenter', (event) => event.pointerType === 'mouse' && setMediaHover(overMedia(event)));
    card.addEventListener('pointermove', (event) => event.pointerType === 'mouse' && setMediaHover(overMedia(event)));
    card.addEventListener('pointerleave', () => setMediaHover(false));
    // Tooltip de cada dato de la línea (hover con mouse); arriba del dato, dentro de .card
    // (no de .info: el link estirado se ancla a .card y .info no puede ser position: relative)
    bindTooltip(card, root.querySelector('.specs'), '[slot="specs"]');
    for (const name of ['name', 'specs', 'finishes']) {
      root.querySelector(`slot[name="${name}"]`).addEventListener('slotchange', () => this.#renderSlots());
    }
    const finishes = root.querySelector('.finishes');
    finishes.addEventListener('click', (event) => this.#chooseFinish(event.target.closest?.('arq-swatch')));
    finishes.addEventListener('keydown', (event) => this.#finishKey(event));
    const compare = root.querySelector('.compare');
    compare.addEventListener('arq:change', (event) => {
      event.stopPropagation();
      this.compared = event.detail.checked;
      this.emit('compare', { checked: event.detail.checked });
    });
    MOBILE.addEventListener('change', () => this.#renderSize());
    // ancho de la columna de textos: decide cuántos acabados entran (#limitFinishes)
    new ResizeObserver(([entry]) => {
      if (entry.contentRect.width === this.#infoWidth) return;
      this.#infoWidth = entry.contentRect.width;
      this.#limitFinishes(this.#swatches());
    }).observe(root.querySelector('.info'));
    // El margen del producto grande es en px: con otro tamaño de card, otra escala
    new ResizeObserver(() => {
      for (const img of root.querySelectorAll('.img')) this.#applyFit(img);
    }).observe(root.querySelector('.card-media'));
    watchTheme(this, 'themeChanged');
  }

  /** Iluminar (src/base/theme.js): pasa a las imágenes encendidas. */
  themeChanged(dark) {
    const root = this.shadowRoot;
    // El brillo del shimmer de carga es otro color en Dark (product-card.css)
    root.querySelector('.card').classList.toggle('is-dark', dark);
    const base = root.querySelector('.base');
    const hover = root.querySelector('.hover');
    // Se ve la de hover: lo mismo que pide el CSS (mouse sobre la imagen o foco
    // de teclado), sin leer estilos (con muchas cards, cada lectura forzaba layout)
    const card = root.querySelector('.card');
    const hoverActive = card.classList.contains('has-hover') && hover.classList.contains('loaded') &&
      (card.classList.contains('is-media-hover') || Boolean(root.querySelector('.card-link:focus-visible')));
    const visible = hoverActive ? hover : base;
    // Solo funde una foto que se ve: si no cargó (falta en el servidor), encima quedaría el ícono de imagen rota
    const previousSrc = visible.naturalWidth ? visible.currentSrc || visible.getAttribute('src') : null;
    const nextSrc = hoverActive
      ? (dark ? this.imageHoverLit || this.imageHover : this.imageHover)
      : (dark ? this.imageLit || this.image : this.image);
    const overlay = previousSrc && nextSrc && previousSrc !== new URL(nextSrc, location.href).href
      ? this.#createThemeOverlay(root.querySelector('.card-media'), previousSrc, visible)
      : null;
    this.#dark = dark;
    this.#renderImages();
    // Iluminar con View Transitions espera a que la foto nueva esté lista
    trackThemeImage(visible);
    // La foto vieja queda encima hasta que la nueva se puede pintar: si no,
    // se vería el fondo de la tarjeta mientras carga
    if (overlay) whenImageReady(visible).then(() => this.#fadeThemeOverlay(overlay));
  }

  update(changed) {
    const root = this.shadowRoot;
    if (changed.has('href')) {
      const link = root.querySelector('.card-link');
      if (this.href) link.setAttribute('href', this.href);
      else link.removeAttribute('href');
    }
    const temp = root.querySelector('.temp');
    temp.querySelector('.temp-text').textContent = this.temperature ?? '';
    const dot = temp.querySelector('.temp-dot');
    const dotColor = temperatureColor(this.temperature);
    dot.hidden = !dotColor;
    if (dotColor) dot.style.backgroundColor = dotColor;
    temp.hidden = !this.temperature;
    const compare = root.querySelector('.compare');
    compare.hidden = !this.showCompare;
    compare.checked = this.compared;
    const card = root.querySelector('.card');
    card.classList.toggle('is-loading', this.loading);
    card.classList.toggle('has-compare', this.showCompare);
    this.#syncContain(card);
    // La card de carga no es contenido: el aviso lo da el listado (role="status")
    if (this.loading) this.setAttribute('aria-hidden', 'true');
    else if (changed.has('loading')) this.removeAttribute('aria-hidden');
    if (changed.has('size')) this.#renderSize();
    if ([...changed].some((prop) => prop.startsWith('image'))) this.#renderImages();
    this.#renderSlots();
  }

  #small() {
    return this.size === 'small' || MOBILE.matches;
  }

  // Los role/* son clases: el aspecto Small en mobile lo pone el JS (como nav-link).
  #renderSize() {
    const small = this.#small();
    const root = this.shadowRoot;
    root.querySelector('.card').classList.toggle('is-small', small);
    // Small se ve a 20/28 (el set): role/body-xl en Desktop; en Mobile body-xl baja a 16/24,
    // así que usa role/heading-3, que en Mobile vale 20/28 (mismo peso).
    // TODO (diseño): que el nombre de Small tenga un rol que valga 20/28 en los dos modos.
    const nameRole = !small ? 'role-heading-3' : MOBILE.matches ? 'role-heading-3' : 'role-body-xl';
    root.querySelector('.name').className = `card-link name ${nameRole}`;
    // Cargando: cada barra en el alto de línea del texto que reemplaza
    root.querySelector('.sk-name').className = `sk-name ${nameRole}`;
    // Los acabados van siempre en Size=Small (swatch/sm, 16 × 16), en Large y en Small, con el aro de
    // Selected de la ficha (atributo ring del swatch).
    for (const swatch of this.querySelectorAll(':scope > arq-swatch[slot="finishes"]')) {
      swatch.setAttribute('size', 'small');
      swatch.setAttribute('ring', '');
    }
  }

  #renderSlots() {
    const root = this.shadowRoot;
    const filled = (name) =>
      root.querySelector(`slot[name="${name}"]`).assignedNodes({ flatten: true }).some((node) => node.nodeType === Node.ELEMENT_NODE || node.textContent.trim());
    root.querySelector('.specs').hidden = !filled('specs');
    // datos escritos a mano sin tooltip: se deduce del texto
    for (const spec of this.querySelectorAll(':scope > [slot="specs"]:not([data-tip])')) {
      const tip = tipForText(spec.textContent);
      if (tip) { spec.dataset.tip = tip; spec.setAttribute('aria-description', tip); }
    }
    root.querySelector('.finishes').hidden = !filled('finishes');
    this.#renderFinishes();
    const name = this.querySelector('[slot="name"]')?.textContent.trim() ?? '';
    root.querySelector('.fallback').textContent = name;
    root.querySelector('.compare-name').textContent = name ? ` ${name}` : '';
    this.#renderSize();
    this.#syncContain(root.querySelector('.card'));
  }

  #swatches() {
    return [...this.querySelectorAll(':scope > arq-swatch[slot="finishes"]')];
  }

  // Elegible: más de un acabado y datos por acabado. Un solo acabado se ve
  // elegido (aro de Selected, como la opción única de la ficha) pero no se elige.
  #renderFinishes() {
    const swatches = this.#swatches();
    const group = this.shadowRoot.querySelector('.finishes');
    const choosable = swatches.length > 1 && swatches.some((swatch) => swatch.dataset.sku || swatch.dataset.image);
    if (!choosable) {
      group.removeAttribute('role');
      if (swatches.length === 1) swatches[0].setAttribute('selected', '');
      this.#limitFinishes(swatches);
      return;
    }
    group.setAttribute('role', 'radiogroup');
    group.setAttribute('aria-label', 'Acabado');
    // Sin elegido en los datos: el primero (negro)
    if (!swatches.some((swatch) => swatch.hasAttribute('selected'))) swatches[0].setAttribute('selected', '');
    for (const swatch of swatches) {
      const on = swatch.hasAttribute('selected');
      swatch.setAttribute('role', 'radio');
      swatch.setAttribute('aria-checked', String(on));
      swatch.setAttribute('tabindex', on ? '0' : '-1');
    }
    this.#limitFinishes(swatches);
  }

  // Si los acabados no entran en una línea del ancho de la card, se ven los que entran y «+N» con
  // los que siguen; si entran, se ven todos. El elegido siempre se ve: si está más allá, ocupa el
  // último lugar. Los ocultos (data-overflow) no se pueden elegir en la card (ni con las flechas):
  // se eligen en la ficha. Se recalcula al cambiar el ancho (#infoWidth, ResizeObserver de setup).
  // TODO (diseño): no está en Figma.
  #limitFinishes(swatches) {
    const more = this.shadowRoot.querySelector('.more');
    for (const swatch of swatches) swatch.removeAttribute('data-overflow');
    more.hidden = true;
    const width = this.#infoWidth;
    const size = swatches[0]?.getBoundingClientRect().width;
    if (!width || !size || swatches.length < 2) return;
    const gap = parseFloat(getComputedStyle(this.shadowRoot.querySelector('.finishes')).columnGap) || 0;
    const row = (count) => count * size + (count - 1) * gap;
    if (row(swatches.length) <= width) return;
    // el «+N» más ancho posible, para que no cambie lo que entra según la cantidad
    more.textContent = `+${swatches.length}`;
    more.hidden = false;
    const moreWidth = more.getBoundingClientRect().width;
    let shown = swatches.length - 1;
    while (shown > 1 && row(shown) + gap + moreWidth > width) shown--;
    const hidden = swatches.length - shown;
    const chosen = swatches.findIndex((swatch) => swatch.hasAttribute('selected'));
    const visible = new Set(swatches.slice(0, shown));
    if (chosen >= shown) {
      visible.delete(swatches[shown - 1]);
      visible.add(swatches[chosen]);
    }
    for (const swatch of swatches) if (!visible.has(swatch)) swatch.setAttribute('data-overflow', '');
    more.textContent = `+${hidden}`;
    more.setAttribute('aria-label', hidden === 1 ? '1 acabado más' : `${hidden} acabados más`);
  }

  #finishKey(event) {
    const keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    const swatches = this.#swatches().filter((swatch) => !swatch.hasAttribute('data-overflow'));
    const index = swatches.indexOf(event.target.closest?.('arq-swatch'));
    if (index === -1) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.#chooseFinish(swatches[index]);
    } else if (keys[event.key]) {
      event.preventDefault();
      const next = swatches[(index + keys[event.key] + swatches.length) % swatches.length];
      next.focus();
      this.#chooseFinish(next);
    }
  }

  // Elegir un acabado: las imágenes y el link pasan a los de ese acabado. La foto
  // nueva se pide antes y se cambia cuando está lista, así no se ve el fondo vacío.
  #chooseFinish(swatch) {
    if (!swatch || swatch.getAttribute('role') !== 'radio' || swatch.hasAttribute('selected')) return;
    for (const other of this.#swatches()) {
      const on = other === swatch;
      other.toggleAttribute('selected', on);
      other.setAttribute('aria-checked', String(on));
      other.setAttribute('tabindex', on ? '0' : '-1');
    }
    const data = swatch.dataset;
    const next = {
      href: data.href ?? this.href,
      temperature: data.temperature ?? this.temperature,
      image: data.image ?? null,
      imageHover: data.imageHover ?? null,
      imageLit: data.imageLit ?? null,
      imageHoverLit: data.imageHoverLit ?? null,
    };
    const token = ++this.#finishToken;
    const apply = () => {
      if (token === this.#finishToken) Object.assign(this, next);
    };
    const visible = (this.#dark && next.imageLit) || next.image;
    if (visible) {
      const preload = new Image();
      preload.onload = preload.onerror = apply;
      preload.src = visible;
    } else apply();
    this.emit('finish', { name: swatch.textContent.trim(), sku: data.sku ?? null, href: next.href, image: next.image });
  }

  // Light local del fondo de la imagen mientras se ve el estudio apagado en
  // una página iluminada (src/styles/light.css, adoptado en el Shadow DOM).
  #syncHoverGround() {
    const root = this.shadowRoot;
    const card = root.querySelector('.card');
    const on = (card.classList.contains('hover-unlit') || card.classList.contains('hover-ground')) &&
      (card.classList.contains('is-media-hover') || Boolean(root.querySelector('.card-link:focus-visible')));
    const media = root.querySelector('.card-media');
    if (on) media.setAttribute('data-arq-theme', 'light');
    else media.removeAttribute('data-arq-theme');
  }

  #renderImages() {
    const root = this.shadowRoot;
    const base = root.querySelector('.base');
    const hover = root.querySelector('.hover');
    const usable = (src) => (src && !this.#failed.has(src) ? src : null);
    const baseSrc = (this.#dark && usable(this.imageLit)) || usable(this.image);
    // Un hover igual a la imagen de reposo no cambia nada: con Iluminar, la
    // contraria (estudio apagado) ocupa su lugar.
    const hoverCandidates = this.#dark ? [this.imageHoverLit, this.image] : [this.imageHover];
    const hoverSrc = hoverCandidates.map(usable).find((src) => src && src !== baseSrc) ?? null;
    this.#setSrc(base, baseSrc);
    this.#renderFallback(!baseSrc);
    root.querySelector('.card').classList.toggle('has-hover', Boolean(baseSrc && hoverSrc));
    // Con Iluminar y sin foto de contexto, el hover muestra el estudio apagado:
    // con el fondo gris claro de Light, no el oscuro de la página.
    root.querySelector('.card').classList.toggle('hover-unlit', Boolean(this.#dark && hoverSrc && hoverSrc === usable(this.image)));
    // Sin foto encendida ni de contexto (la de reposo ya es el estudio apagado):
    // la imagen no cambia, pero el fondo sí pasa al gris claro.
    root.querySelector('.card').classList.toggle('hover-ground', Boolean(this.#dark && baseSrc && !hoverSrc && baseSrc === usable(this.image)));
    this.#syncHoverGround();
    this.#setSrc(hover, this.#hoverWanted ? hoverSrc : null);
    // Iluminar: la imagen de estudio del otro modo queda en caché, así el fundido
    // arranca al instante y termina junto con el fondo. Solo donde Iluminar
    // existe (Productos): en la Home duplicaba las fotos. TODO (diseño): §8 pide
    // cargarla al activar Iluminar; confirmar el precargado.
    const canIlluminate = this.#dark || document.querySelector('arq-catalog-toolbar[show-iluminar]');
    const otherSrc = this.#dark ? this.image : this.imageLit;
    if (canIlluminate && baseSrc && otherSrc && otherSrc !== baseSrc) new Image().src = otherSrc;
  }

  // Fuji, Mini Kai, Mini Kai Round y Sen son la familia. Tori Visera es el
  // producto (en la base la familia es Tori): si no, entrarían todas las Tori.
  #syncContain(card) {
    const key = (value) => String(value ?? '').normalize('NFD').replace(/\p{M}/gu, '').trim().toLowerCase();
    const family = key(this.family);
    const name = key(this.querySelector('[slot="name"]')?.textContent);
    const contain = family === 'fuji' || family === 'mini kai' || family === 'mini kai round' || family === 'sen' || name === 'tori visera' || name.startsWith('mini kai');
    const before = card?.className;
    card?.classList.toggle('is-contain', contain);
    // Foto ancha: con aire a los lados (product-card.css)
    card?.classList.toggle('is-wide', name.startsWith('mini kai'));
    // Otro recorte: otra escala para el producto grande
    if (card && card.className !== before) for (const img of card.querySelectorAll('.img')) this.#applyFit(img);
  }

  #setSrc(img, src) {
    if (img.getAttribute('src') === (src ?? null)) return;
    img.classList.remove('loaded');
    if (!src) {
      img.removeAttribute('src');
      return;
    }
    img.src = src;
    productBox(src); // la copia chica se pide junto con la foto (#fit)
    if (img.classList.contains('base')) this.#renderStem();
    // Primera foto principal: funde al llegar, salvo que ya esté lista en el
    // mismo instante (en caché). complete solo no alcanza: una lazy que todavía
    // no empezó a cargar también da complete, pero sin tamaño.
    if (img.classList.contains('base') && !this.#revealed) {
      this.#revealed = true;
      if (!(img.complete && img.naturalWidth)) img.classList.add('reveal');
    }
  }

  // from: la <img> que se estaba viendo; la de encima lleva su misma escala
  #createThemeOverlay(media, src, from) {
    media.querySelector('.theme-transition')?.remove();
    const overlay = document.createElement('img');
    overlay.className = 'theme-transition';
    overlay.src = src;
    overlay.style.objectFit = from.style.objectFit;
    overlay.style.transformOrigin = from.style.transformOrigin;
    overlay.style.transform = from.style.transform;
    overlay.alt = '';
    overlay.setAttribute('aria-hidden', 'true');
    media.append(overlay);
    return overlay;
  }

  // El fundido arranca antes que el del fondo de la página (switchTheme,
  // src/base/theme.js): el reflow fija opacity 1 como punto de partida y la
  // transición empieza de inmediato.
  #fadeThemeOverlay(overlay) {
    if (!overlay.isConnected) return;
    overlay.addEventListener('transitionend', (event) => {
      if (event.propertyName === 'opacity') overlay.remove();
    }, { once: true });
    void overlay.offsetWidth;
    overlay.classList.add('fade-out');
    const duration = getComputedStyle(overlay).transitionDuration.split(',')[0];
    if (!Number.parseFloat(duration)) overlay.remove();
  }

  // Producto grande: mide la foto (una vez por URL) y le pone su escala
  async #fit(img) {
    const src = img.getAttribute('src');
    const box = await productBox(src);
    if (img.getAttribute('src') !== src) return;
    this.#boxes.set(img, box);
    this.#applyFit(img);
  }

  // Fuji, Mini Kai, Sen y Tori Visera van enteros (contain). Mini Kai ya tiene
  // aire a los lados (padding): se mide dentro de él y el margen lo descuenta.
  #applyFit(img) {
    const media = img.parentElement;
    const style = getComputedStyle(img);
    const pad = (side) => Number.parseFloat(style.getPropertyValue(`padding-${side}`)) || 0;
    const frame = {
      width: media.clientWidth - pad('left') - pad('right'),
      height: media.clientHeight - pad('top') - pad('bottom'),
    };
    const box = this.#boxes.get(img);
    const cover = !this.shadowRoot.querySelector('.card').classList.contains('is-contain');
    // Margen space/padding/3xl (2xl en Mobile: 3xl ahí achicaría todas las
    // cards); lo que se pasa se achica hasta space/padding/lg (image-fit.js)
    const room = (token) => ({
      x: Math.max(0, tokenPx(token) - Math.max(pad('left'), pad('right'))),
      y: Math.max(0, tokenPx(token) - Math.max(pad('top'), pad('bottom'))),
    });
    const margin = MOBILE.matches ? '--arq-space-padding-2xl' : '--arq-space-padding-3xl';
    const { scale, rect } = fitScale(box, frame, { margin: room(margin), limit: room('--arq-space-padding-lg'), cover });
    if (scale >= 1) {
      img.style.objectFit = img.style.transformOrigin = img.style.transform = '';
      if (img.classList.contains('base')) this.#renderStem();
      return;
    }
    // Desde la foto entera (contain): con cover, lo que el recorte deja afuera
    // no vuelve al achicar (el disco de Döuli 18W quedaba cortado en los costados)
    img.style.objectFit = 'contain';
    img.style.transformOrigin = '0 0';
    img.style.transform = containTransform(rect, frame, box.ratio, { left: pad('left'), top: pad('top') }).transform;
    if (img.classList.contains('base')) this.#renderStem(img, rect, { left: pad('left'), top: pad('top') });
  }

  // Colgante achicado desde abajo (Döuli 15W y 18W, alineados con el 12W): el
  // cable ya no llega al borde de arriba. Se completa con el de la misma foto,
  // estirado a lo alto (es una línea vertical: no se nota), con su misma
  // posición y ancho. Sin argumentos, se saca.
  #renderStem(img, rect, offset) {
    const stem = this.shadowRoot.querySelector('.stem');
    if (!rect?.stem) {
      stem.removeAttribute('style');
      return;
    }
    // Solo arriba de la foto (más 1 px, que tapa la línea clara del borde): donde
    // se superponen, el cable estirado y el de la foto se ven dobles. Se estiran
    // las primeras filas de la foto (2 px): el cable no es del todo vertical y
    // así empalma con el borde de arriba de la foto.
    const top = offset.top + rect.y;
    if (top <= 0) {
      stem.removeAttribute('style');
      return;
    }
    const height = top + 1;
    stem.style.height = `${height}px`;
    stem.style.backgroundImage = `url(${JSON.stringify(img.getAttribute('src'))})`;
    stem.style.backgroundSize = `${rect.width}px ${(rect.height * height) / 2}px`;
    stem.style.backgroundPosition = `${offset.left + rect.x}px 0`;
  }

  #renderFallback(show) {
    this.shadowRoot.querySelector('.fallback').hidden = !show;
  }
}

ArqProductCard.define();

export { ArqProductCard };
