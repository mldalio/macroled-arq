// product-gallery · Figma 920:2490 · ficha doc/product-gallery (1463:10376)
//
// Galería de la ficha: la foto principal es un slider (una foto por vez) y
// debajo, o encima en Desktop, la fila de gallery-thumb. Las flechas, el
// deslizamiento y una miniatura muestran la misma foto, sin recargar.
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
//   es el LCP y la primera del slider. Las demás las crea el componente.
// - images (prop de JS, no atributo): la primera es la principal. Al cambiar
//   (otra variante) vuelve a la primera. Con menos de dos no hay flechas ni
//   miniaturas.
// - Recorrido en loop: después de la última foto sigue la primera, y antes de
//   la primera está la última. Flechas solo con el chevron (sin caja): aparecen
//   al pasar el mouse o con el foco. Las dos van a la misma altura, al centro
//   de la foto. Con el dedo se desliza (scroll nativo con snap) y con mouse se
//   arrastra. ← → con el foco en la foto, una flecha o una miniatura.
// - Iluminar: dentro de un bloque con data-arq-theme="dark", cada foto usa
//   srcOn; si falta, la apagada (src/base/theme.js). El cambio de variante y
//   de Iluminar funde; pasar de foto se desliza.
// - Desktop: miniaturas sobre la imagen, abajo a la izquierda. Mobile: debajo.
//   Si no entran, la fila se desliza (decisión 2026-10-02 · Galerías).
// - Miniaturas: un <button> cada una (Tab), la elegida con aria-current.

import { ArqElement } from '../../base/arq-element.js';
import { watchTheme } from '../../base/theme.js';
import { icon } from '../../base/icons.js';
import '../gallery-thumb/gallery-thumb.js';
import css from './product-gallery.css?inline';

const DRAG_START = 6;
const FLICK_VELOCITY = 0.4; // px/ms: un deslizamiento más rápido pasa de foto

class ArqProductGallery extends ArqElement {
  static tag = 'arq-product-gallery';
  static styles = css;
  static properties = {
    insetThumbs: { type: Boolean }, // solo de código: en Mobile, miniaturas con el margen de página
  };
  static template =
    `<div class="gallery">` +
    `<div class="image">` +
    `<slot name="image" class="track" tabindex="-1" role="region" aria-roledescription="carrusel" aria-label="Fotos del producto"></slot>` +
    `<slot name="overlay"></slot>` +
    `<button type="button" class="nav prev"><span class="glyph"></span><span class="visually-hidden">Foto anterior</span></button>` +
    `<button type="button" class="nav next"><span class="glyph"></span><span class="visually-hidden">Foto siguiente</span></button>` +
    `<p class="live visually-hidden" aria-live="polite"></p>` +
    `</div>` +
    `<div class="thumbs-row" hidden>` +
    `<div class="thumbs"></div>` +
    `</div>` +
    `</div>`;

  #images = [];
  #index = 0;
  #dark = false;
  #received = false; // ya llegaron los datos: antes no se oculta la imagen del HTML
  #transitionImage = null;
  #drag = null;
  #width = 0;
  #resize = new ResizeObserver(() => this.#realign());

  /** La foto que se está viendo (la mide la ficha para el contraste de Iluminar). */
  get currentImage() {
    const reals = this.#reals();
    return reals[this.#index] ?? reals[0] ?? null;
  }

  get images() {
    return this.#images;
  }

  set images(list) {
    // Otra variante (acabado, módulos): la foto nueva funde sobre la anterior.
    // La primera vez no: reemplaza a la del HTML.
    const previousSrc = this.#received ? this.currentImage?.getAttribute('src') : null;
    this.#images = Array.isArray(list) ? list.filter((image) => image && image.src) : [];
    this.#received = true;
    this.#index = 0;
    if (this.isConnected) this.#render(previousSrc, { quick: true, reset: true });
  }

  setup() {
    const root = this.shadowRoot;
    const track = root.querySelector('.track');
    root.querySelector('.thumbs').addEventListener('click', (event) => {
      const thumb = event.target.closest('arq-gallery-thumb');
      if (thumb) this.select(Number(thumb.dataset.index));
    });
    root.querySelector('.prev .glyph').innerHTML = icon('chevron-left');
    root.querySelector('.next .glyph').innerHTML = icon('chevron-right');
    root.querySelector('.prev').addEventListener('click', () => this.#go(this.#index - 1, true));
    root.querySelector('.next').addEventListener('click', () => this.#go(this.#index + 1, true));
    track.addEventListener('scroll', () => this.#onScroll(), { passive: true });
    track.addEventListener('scrollend', () => {
      if (!this.#programmatic && !this.#drag) this.#settleLoop();
    });
    track.addEventListener('pointerdown', (event) => this.#dragStart(event));
    track.addEventListener('pointermove', (event) => this.#dragMove(event));
    track.addEventListener('pointerup', (event) => this.#dragEnd(event));
    track.addEventListener('pointercancel', (event) => this.#dragEnd(event));
    track.addEventListener('dragstart', (event) => event.preventDefault());
    root.addEventListener('keydown', (event) => this.#onKey(event));
    this.#resize.observe(track);
    watchTheme(this, 'themeChanged');
    this.#render();
  }

  disconnectedCallback() {
    this.#resize.disconnect();
  }

  /** Iluminar (src/base/theme.js): pasa a las versiones encendidas. */
  themeChanged(dark) {
    const current = this.#images[this.#index];
    const previousSrc = current ? this.#src(current) : null;
    this.#dark = dark;
    this.#render(previousSrc);
  }

  /** Muestra la imagen `index` de images. En los extremos sigue de largo (loop). */
  select(index) {
    this.#go(index, false);
  }

  #src(image) {
    return (this.#dark && image.srcOn) || image.src;
  }

  #reals() {
    return [...this.querySelectorAll(':scope > img[slot="image"]:not([data-clone])')];
  }

  #track() {
    return this.shadowRoot.querySelector('.track');
  }

  // step: un paso (flecha, tecla o arrastre). En los extremos pasa por la copia
  // de la otra punta, así el loop se ve hacia adelante y no como un rebote.
  #go(index, step) {
    const count = this.#images.length;
    if (count < 2) return;
    const logical = ((index % count) + count) % count;
    if (logical === this.#index) return;
    const forward = step && this.#index === count - 1 && logical === 0;
    const backward = step && this.#index === 0 && logical === count - 1;
    this.#index = logical;
    this.#syncSelection(true);
    const trackPos = forward ? count + 1 : backward ? 0 : logical + 1;
    this.#scrollTo(trackPos);
  }

  #trackPos() {
    return this.#images.length > 1 ? this.#index + 1 : 0;
  }

  #mountSlides() {
    const count = this.#images.length;
    if (count && !this.#reals().length) {
      const img = document.createElement('img');
      img.slot = 'image';
      this.append(img);
    }
    let slides = this.#reals();
    while (slides.length > Math.max(count, 1)) {
      const last = slides.pop();
      if (last.dataset.slide === 'extra') last.remove();
    }
    for (const img of this.#reals()) img.hidden = this.#received && !count;
    while (count && this.#reals().length < count) {
      const img = document.createElement('img');
      img.slot = 'image';
      img.dataset.slide = 'extra';
      img.alt = '';
      img.draggable = false;
      const after = this.querySelector(':scope > img[data-clone="after"]');
      if (after) this.insertBefore(img, after);
      else this.append(img);
    }
    this.#syncClones();
  }

  // Copias de la última foto antes de la primera y de la primera después de
  // la última. Al llegar a una copia, el scroll salta a la original.
  #syncClones() {
    const images = this.#images;
    const reals = this.#reals();
    let before = this.querySelector(':scope > img[data-clone="before"]');
    let after = this.querySelector(':scope > img[data-clone="after"]');
    if (images.length < 2 || !reals[0]) {
      before?.remove();
      after?.remove();
      return;
    }
    if (!before) {
      before = document.createElement('img');
      before.dataset.clone = 'before';
      before.slot = 'image';
      before.alt = '';
      before.setAttribute('aria-hidden', 'true');
      before.draggable = false;
      this.insertBefore(before, reals[0]);
    }
    if (!after) {
      after = document.createElement('img');
      after.dataset.clone = 'after';
      after.slot = 'image';
      after.alt = '';
      after.setAttribute('aria-hidden', 'true');
      after.draggable = false;
      this.append(after);
    }
    const lastSrc = this.#src(images.at(-1));
    const firstSrc = this.#src(images[0]);
    if (before.getAttribute('src') !== lastSrc) before.src = lastSrc;
    if (after.getAttribute('src') !== firstSrc) after.src = firstSrc;
  }

  // previousSrc: la foto que se ve ahora, para fundir de ella a la nueva.
  // quick: cambio de variante, con motion/duration/fade y esperando a que la
  // nueva esté lista; sin quick, el fundido de Iluminar.
  // reset: otra variante, vuelve a la primera foto.
  #render(previousSrc = null, { quick = false, reset = false } = {}) {
    this.#rendering = true;
    const images = this.#images;
    this.#mountSlides();
    if (reset) this.#index = 0;
    if (this.#index > images.length - 1) this.#index = Math.max(images.length - 1, 0);
    const slides = this.#reals();
    const next = images[this.#index];
    const nextSrc = next ? this.#src(next) : null;
    const visible = slides[this.#index];
    const fading = Boolean(previousSrc && nextSrc && previousSrc !== nextSrc && visible);
    if (fading) this.#crossfade(visible, previousSrc, nextSrc, quick);
    slides.forEach((img, i) => {
      const image = images[i];
      if (!image) return;
      const src = this.#src(image);
      if (!(fading && i === this.#index) && img.getAttribute('src') !== src) img.src = src;
      img.alt = image.alt ?? '';
      img.draggable = false;
      if (i > 0) img.loading = 'lazy';
      const other = this.#dark ? image.src : image.srcOn;
      if (other && other !== src) new Image().src = other;
    });
    this.#syncClones();
    const width = this.#fitSlides();
    this.#track().scrollTo({ left: this.#trackPos() * width, behavior: 'auto' });
    const row = this.shadowRoot.querySelector('.thumbs');
    const strip = this.shadowRoot.querySelector('.thumbs-row');
    strip.hidden = images.length < 2;
    const single = images.length < 2;
    this.shadowRoot.querySelector('.prev').hidden = single;
    this.shadowRoot.querySelector('.next').hidden = single;
    if (images.length < 2) row.replaceChildren();
    else {
      while (row.children.length > images.length) row.lastElementChild.remove();
      while (row.children.length < images.length) row.append(document.createElement('arq-gallery-thumb'));
      images.forEach((image, i) => {
        const thumb = row.children[i];
        thumb.dataset.index = String(i);
        thumb.src = this.#src(image);
        thumb.alt = image.alt ?? '';
      });
    }
    this.#syncSelection(false);
    this.#rendering = false;
  }

  #syncSelection(announce) {
    const images = this.#images;
    const index = this.#index;
    const row = this.shadowRoot.querySelector('.thumbs');
    [...row.children].forEach((thumb, i) => {
      thumb.selected = i === index;
    });
    const show = images.length > 1;
    const track = this.#track();
    track.tabIndex = show ? 0 : -1;
    if (!announce || !show) return;
    const alt = images[index]?.alt;
    this.shadowRoot.querySelector('.live').textContent = `Foto ${index + 1} de ${images.length}${alt ? `, ${alt}` : ''}`;
    this.dispatchEvent(new CustomEvent('arq:slide', { detail: { index } }));
  }

  #programmatic = 0;
  #rendering = false;

  #scrollTo(index) {
    const track = this.#track();
    const width = this.#fitSlides() || track.clientWidth;
    const left = index * width;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || Math.abs(track.scrollLeft - left) < 1) {
      track.scrollTo({ left, behavior: 'auto' });
      this.#settleLoop();
      return;
    }
    // Mientras corre el salto, el scroll intermedio no cambia la foto elegida.
    this.#programmatic += 1;
    let timer = 0;
    const done = () => {
      if (!this.#programmatic) return;
      track.removeEventListener('scrollend', done);
      clearTimeout(timer);
      this.#programmatic -= 1;
      if (!this.#programmatic) this.#settleLoop();
    };
    track.addEventListener('scrollend', done);
    timer = setTimeout(done, 800);
    track.scrollTo({ left, behavior: 'smooth' });
  }

  #onScroll() {
    if (this.#rendering || this.#drag || this.#programmatic) return;
    const track = this.#track();
    const width = track.clientWidth;
    if (!width || this.#images.length < 2) return;
    const pos = Math.round(track.scrollLeft / width);
    const count = this.#images.length;
    const index = pos <= 0 ? count - 1 : pos >= count + 1 ? 0 : pos - 1;
    if (index === this.#index) return;
    this.#index = index;
    this.#syncSelection(true);
  }

  // La copia de la última (antes) y de la primera (después) muestran la misma
  // foto que la original: al soltar, el scroll salta a esa original.
  #settleLoop() {
    const count = this.#images.length;
    const track = this.#track();
    const width = track.clientWidth;
    if (count < 2 || !width || this.#drag) return;
    const pos = Math.round(track.scrollLeft / width);
    let jumped = false;
    if (pos <= 0) {
      track.scrollTo({ left: count * width, behavior: 'auto' });
      jumped = true;
    } else if (pos >= count + 1) {
      track.scrollTo({ left: width, behavior: 'auto' });
      jumped = true;
    }
    if (!jumped) return;
    // La foto original ya está en el lugar de la copia: se vuelve a medir el contraste.
    requestAnimationFrame(() => {
      this.dispatchEvent(new CustomEvent('arq:slide', { detail: { index: this.#index } }));
    });
  }

  #realign() {
    const width = this.#fitSlides();
    if (!width || this.#drag) return;
    if (width === this.#width) return;
    this.#width = width;
    this.#track().scrollTo({ left: this.#trackPos() * width, behavior: 'auto' });
  }

  // Cada foto mide exactamente el ancho visible, en píxeles enteros. Con 100 %
  // el redondeo deja asomar 1 px de la foto siguiente (la línea del borde).
  #fitSlides() {
    const width = this.#track().clientWidth;
    if (!width) return 0;
    const size = `${width}px`;
    for (const img of this.querySelectorAll(':scope > img[slot="image"]')) {
      img.style.setProperty('flex-basis', size, 'important');
      img.style.setProperty('width', size, 'important');
      img.style.setProperty('min-width', size, 'important');
      img.style.setProperty('max-width', size, 'important');
    }
    return width;
  }

  #onKey(event) {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    const path = event.composedPath();
    const track = this.#track();
    const thumbs = this.shadowRoot.querySelector('.thumbs');
    const onNav = path.some((node) => node.classList?.contains?.('nav'));
    if (!path.includes(track) && !path.includes(thumbs) && !onNav) return;
    event.preventDefault();
    this.#go(this.#index + (event.key === 'ArrowRight' ? 1 : -1), true);
  }

  #dragStart(event) {
    if (event.pointerType !== 'mouse' || event.button !== 0 || this.#images.length < 2) return;
    const track = this.#track();
    this.#drag = {
      id: event.pointerId,
      x: event.clientX,
      left: track.scrollLeft,
      index: this.#index,
      moved: false,
      t: event.timeStamp,
    };
  }

  #dragMove(event) {
    const drag = this.#drag;
    if (!drag || event.pointerId !== drag.id) return;
    const dx = event.clientX - drag.x;
    if (!drag.moved && Math.abs(dx) < DRAG_START) return;
    const track = this.#track();
    drag.moved = true;
    track.setPointerCapture(event.pointerId);
    track.toggleAttribute('data-dragging', true);
    event.preventDefault();
    track.scrollLeft = drag.left - dx;
  }

  #dragEnd(event) {
    const drag = this.#drag;
    if (!drag || event.pointerId !== drag.id) return;
    this.#drag = null;
    const track = this.#track();
    track.removeAttribute('data-dragging');
    if (track.hasPointerCapture(event.pointerId)) track.releasePointerCapture(event.pointerId);
    if (!drag.moved) return;
    const dx = event.clientX - drag.x;
    const velocity = dx / Math.max(event.timeStamp - drag.t, 1);
    const width = track.clientWidth || 1;
    let index = drag.index;
    if (velocity > FLICK_VELOCITY || dx > width * 0.2) index -= 1;
    else if (velocity < -FLICK_VELOCITY || dx < -width * 0.2) index += 1;
    if (index === drag.index) {
      this.#scrollTo(this.#trackPos());
      return;
    }
    this.#go(index, true);
  }

  // La foto anterior queda encima (.theme-transition) y se desvanece. Si había
  // otro fundido en curso, ese sigue encima del nuevo: la mezcla que se ve no
  // salta, y los dos terminan de desvanecerse.
  #crossfade(img, previousSrc, nextSrc, quick = false) {
    const previous = document.createElement('img');
    previous.className = quick ? 'theme-transition quick' : 'theme-transition';
    previous.src = previousSrc;
    previous.alt = '';
    previous.setAttribute('aria-hidden', 'true');
    const image = this.shadowRoot.querySelector('.image');
    const running = this.#transitionImage?.isConnected ? this.#transitionImage : null;
    image.insertBefore(previous, running);
    this.#transitionImage = previous;
    img.src = nextSrc;
    previous.addEventListener('transitionend', (event) => {
      if (event.propertyName === 'opacity') previous.remove();
    }, { once: true });
    const fade = () => {
      if (!previous.isConnected) return;
      void previous.offsetWidth;
      previous.classList.add('fade-out');
      const duration = getComputedStyle(previous).transitionDuration.split(',')[0];
      if (!Number.parseFloat(duration)) previous.remove();
    };
    if (quick) img.decode().catch(() => {}).then(fade);
    else fade();
  }
}

ArqProductGallery.define();

export { ArqProductGallery };
