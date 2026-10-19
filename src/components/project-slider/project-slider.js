// project-slider · scene/proyectos Home v2 (Final 2153:20657)
//
// Carrusel de project-slide: el Activo queda al centro, más grande y sin
// velo; los laterales asoman. Flechas: arq-carousel-controls (sin scroll
// propio: emiten arq:prev / arq:next). El desplazamiento es un translate
// calculado con el ancho de cada slide, no con la posición en pantalla
// (los slides viven en el light DOM).
//
// El recorrido es un bucle. Hay una copia de las fotos antes y otra después
// para que, al pasar la última, sigan asomando las mismas. Al terminar la
// animación el track salta, sin transición, a la copia del medio.
//
//   <arq-project-slider>
//     <arq-project-slide>…</arq-project-slide>
//     <arq-project-slide active>…</arq-project-slide>
//     <span slot="caption">…</span>
//   </arq-project-slider>
//
// TODO (diseño): Home v2 no tiene frame Mobile; hasta 767 px se apila el pie
// y no se muestran las flechas (misma regla que carousel-controls).
// TODO (diseño): autoplay, arrastre y lightbox no están en Figma. El intervalo
// de autoplay (4 s) no tiene token.

import { ArqElement } from '../../base/arq-element.js';
import { containScroll } from '../../base/scroll-lock.js';
import '../carousel-controls/carousel-controls.js';
import '../icon-button/icon-button.js';
import css from './project-slider.css?inline';

const AUTOPLAY_MS = 4000;
const DRAG_START = 6;

class ArqProjectSlider extends ArqElement {
  static tag = 'arq-project-slider';
  static styles = css;
  static properties = {
    autoplay: { type: Boolean },
  };
  static template =
    `<div class="slider">` +
    `<div class="rail">` +
    `<div class="track"><div class="before"></div><slot></slot><div class="after"></div></div>` +
    `</div>` +
    `<div class="caption">` +
    `<p class="info role-body"><slot name="caption"></slot></p>` +
    `<arq-carousel-controls class="controls" buttons="carousel" label-prev="Proyecto anterior" label-next="Proyecto siguiente"></arq-carousel-controls>` +
    `</div>` +
    `</div>` +
    `<dialog class="lightbox" data-arq-theme="dark" aria-label="Galería ampliada">` +
    `<div class="lightbox-bar">` +
    `<p class="lightbox-count role-body" aria-live="polite"></p>` +
    `<arq-icon-button class="lightbox-close" icon="close" size="large" background="subtle">Cerrar</arq-icon-button>` +
    `</div>` +
    `<div class="lightbox-stage">` +
    `<arq-icon-button class="lightbox-prev" icon="chevron-left" size="large" background="subtle">Foto anterior</arq-icon-button>` +
    `<img class="lightbox-image" alt="">` +
    `<arq-icon-button class="lightbox-next" icon="chevron-right" size="large" background="subtle">Foto siguiente</arq-icon-button>` +
    `</div>` +
    `</dialog>`;

  #index = 0;
  #lightbox = 0;
  #started = false;
  #frame = 0;
  #timer = 0;
  #onWrap = null;
  #drag = null;
  #suppressClick = false;
  #hovering = false;
  #reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  #resize = new ResizeObserver(() => this.#align());
  #onMotion = () => this.#armAutoplay();
  #onVisibility = () => this.#armAutoplay();

  setup() {
    const root = this.shadowRoot;
    const slot = root.querySelector('slot:not([name])');
    const dialog = root.querySelector('.lightbox');
    this.setAttribute('role', 'region');
    if (!this.hasAttribute('aria-label')) this.setAttribute('aria-label', 'Galería de proyectos');
    slot.addEventListener('slotchange', () => this.#sync());
    root.querySelector('slot[name="caption"]').addEventListener('slotchange', () => this.#caption());
    root.querySelector('.controls').addEventListener('arq:prev', () => this.#move(-1));
    root.querySelector('.controls').addEventListener('arq:next', () => this.#move(1));
    this.addEventListener('click', (event) => {
      if (!this.#suppressClick) return;
      event.preventDefault();
      event.stopPropagation();
    });
    this.addEventListener('keydown', (event) => {
      if (dialog.open) return;
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        this.#move(-1);
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        this.#move(1);
      }
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        const slides = this.#slides();
        if (slides[this.#index]) this.#openFrom(slides[this.#index]);
      }
    });
    const rail = root.querySelector('.rail');
    rail.addEventListener('pointerenter', (event) => {
      if (event.pointerType !== 'mouse') return;
      this.#hovering = true;
      this.#armAutoplay();
    });
    rail.addEventListener('pointerleave', (event) => {
      if (event.pointerType !== 'mouse') return;
      this.#hovering = false;
      this.#armAutoplay();
    });
    rail.addEventListener('pointerdown', (event) => this.#dragStart(event));
    rail.addEventListener('pointermove', (event) => this.#dragMove(event));
    rail.addEventListener('pointerup', (event) => this.#dragEnd(event));
    rail.addEventListener('pointercancel', (event) => this.#dragEnd(event));
    rail.addEventListener('dragstart', (event) => event.preventDefault());
    containScroll(dialog);
    root.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
    root.querySelector('.lightbox-prev').addEventListener('click', () => this.#stepLightbox(-1));
    root.querySelector('.lightbox-next').addEventListener('click', () => this.#stepLightbox(1));
    dialog.addEventListener('click', (event) => {
      if (event.target.closest('img, arq-icon-button, button, .lightbox-bar')) return;
      dialog.close();
    });
    dialog.addEventListener('cancel', (event) => {
      event.preventDefault();
      dialog.close();
    });
    dialog.addEventListener('close', () => this.#armAutoplay());
    dialog.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        event.stopPropagation();
        this.#stepLightbox(-1);
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        event.stopPropagation();
        this.#stepLightbox(1);
      }
    });
    this.tabIndex = 0;
    this.#resize.observe(rail);
    this.#reduced.addEventListener('change', this.#onMotion);
    document.addEventListener('visibilitychange', this.#onVisibility);
    this.#sync();
    this.#caption();
  }

  update(changed) {
    if (changed.has('autoplay')) this.#armAutoplay();
  }

  #caption() {
    const slot = this.shadowRoot.querySelector('slot[name="caption"]');
    const filled = slot.assignedNodes({ flatten: true }).some((node) => node.textContent.trim());
    slot.parentElement.hidden = !filled;
  }

  disconnectedCallback() {
    this.#resize.disconnect();
    cancelAnimationFrame(this.#frame);
    this.#clearWrap();
    this.#stopAutoplay();
    this.#reduced.removeEventListener('change', this.#onMotion);
    document.removeEventListener('visibilitychange', this.#onVisibility);
    const dialog = this.shadowRoot?.querySelector('.lightbox');
    if (dialog?.open) dialog.close();
  }

  #sources() {
    return this.shadowRoot
      .querySelector('slot:not([name])')
      .assignedElements()
      .filter((el) => el.localName === 'arq-project-slide');
  }

  #slides() {
    const root = this.shadowRoot;
    return [
      ...root.querySelector('.before').children,
      ...this.#sources(),
      ...root.querySelector('.after').children,
    ];
  }

  #clone(slide) {
    const clone = slide.cloneNode(true);
    clone.removeAttribute('active');
    clone.setAttribute('aria-hidden', 'true');
    return clone;
  }

  #rebuild() {
    const root = this.shadowRoot;
    const before = root.querySelector('.before');
    const after = root.querySelector('.after');
    const sources = this.#sources();
    before.replaceChildren();
    after.replaceChildren();
    if (sources.length < 2) return;
    for (const slide of sources) {
      before.append(this.#clone(slide));
      after.append(this.#clone(slide));
    }
  }

  #sync() {
    this.#rebuild();
    const sources = this.#sources();
    const count = sources.length;
    if (!this.#started && count) {
      const marked = sources.findIndex((slide) => slide.active);
      const logical = marked >= 0 ? marked : Math.floor((count - 1) / 2);
      this.#index = count > 1 ? count + logical : logical;
      this.#started = true;
    } else if (count > 1) {
      this.#index = count + (((this.#index % count) + count) % count);
    } else {
      this.#index = 0;
    }
    this.#paint();
    this.#alignNow();
    for (const img of this.querySelectorAll('img')) img.draggable = false;
    this.#armAutoplay();
  }

  #move(direction) {
    if (this.#drag) return;
    const count = this.#sources().length;
    if (count < 2) return;
    if (this.#outside()) this.#recenter();
    this.#index += direction;
    if (this.#reduced.matches) {
      this.#recenter();
      this.#armAutoplay();
      return;
    }
    this.#paint();
    this.#alignSoon();
    if (this.#outside()) this.#armWrap();
    this.#armAutoplay();
  }

  #select(index) {
    if (index < 0 || index >= this.#slides().length) return;
    this.#index = index;
    if (this.#reduced.matches) {
      this.#recenter();
      return;
    }
    this.#paint();
    this.#alignSoon();
    if (this.#outside()) this.#armWrap();
  }

  #outside() {
    const count = this.#sources().length;
    return count > 1 && (this.#index < count || this.#index >= count * 2);
  }

  #recenter() {
    const count = this.#sources().length;
    if (count > 1) this.#index = count + (((this.#index % count) + count) % count);
    this.#paint();
    this.#alignNow();
  }

  #paint() {
    const slides = this.#slides();
    const count = this.#sources().length;
    slides.forEach((slide, i) => {
      slide.active = i === this.#index;
    });
    const controls = this.shadowRoot.querySelector('.controls');
    const logical = count ? ((this.#index % count) + count) % count : 0;
    controls.hidden = count < 2;
    controls.count = Math.max(count, 1);
    controls.index = logical;
    controls.position = count > 1 ? 'middle' : 'start';
  }

  #alignSoon() {
    cancelAnimationFrame(this.#frame);
    this.#frame = requestAnimationFrame(() => this.#align());
  }

  #alignNow() {
    const track = this.shadowRoot.querySelector('.track');
    cancelAnimationFrame(this.#frame);
    this.#clearWrap();
    for (const slide of this.#slides()) slide.setAttribute('data-instant', '');
    track.style.transition = 'none';
    this.#align();
    track.getBoundingClientRect();
    track.style.transition = '';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        for (const slide of this.#slides()) slide.removeAttribute('data-instant');
      });
    });
  }

  #armWrap() {
    const track = this.shadowRoot.querySelector('.track');
    this.#clearWrap();
    this.#onWrap = (event) => {
      if (event.target !== track || event.propertyName !== 'transform') return;
      this.#clearWrap();
      this.#recenter();
    };
    track.addEventListener('transitionend', this.#onWrap);
  }

  #clearWrap() {
    const track = this.shadowRoot.querySelector('.track');
    if (!this.#onWrap || !track) return;
    track.removeEventListener('transitionend', this.#onWrap);
    this.#onWrap = null;
  }

  #align() {
    if (this.#drag?.moved) return;
    const metrics = this.#metrics();
    const active = metrics.slides[this.#index];
    if (!active || !metrics.rail.clientWidth) return;
    metrics.track.style.transform = `translateX(${this.#txFor(this.#index, metrics)}px)`;
  }

  #metrics() {
    const root = this.shadowRoot;
    const rail = root.querySelector('.rail');
    const track = root.querySelector('.track');
    const slides = this.#slides();
    const gap = Number.parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 0;
    return { rail, track, slides, gap };
  }

  #txFor(index, metrics = this.#metrics()) {
    const { rail, slides, gap } = metrics;
    const active = slides[index];
    if (!active || !rail.clientWidth) return 0;
    let offset = 0;
    for (let i = 0; i < index; i += 1) offset += slides[i].offsetWidth + gap;
    return rail.clientWidth / 2 - offset - active.offsetWidth / 2;
  }

  #nearest(tx) {
    const metrics = this.#metrics();
    let best = this.#index;
    let bestDist = Infinity;
    for (let i = 0; i < metrics.slides.length; i += 1) {
      const dist = Math.abs(this.#txFor(i, metrics) - tx);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    }
    return best;
  }

  #photos() {
    return this.#sources().map((slide) => {
      const img = slide.querySelector('[slot="image"]');
      return {
        src: img?.getAttribute('src') || '',
        alt: img?.getAttribute('alt') || '',
      };
    });
  }

  #openFrom(slide) {
    const index = this.#slides().indexOf(slide);
    const count = this.#sources().length;
    if (index < 0 || !count) return;
    const logical = ((index % count) + count) % count;
    const photo = this.#photos()[logical];
    if (!photo?.src) return;
    this.#index = index;
    this.#recenter();
    this.#lightbox = logical;
    this.#renderLightbox();
    const dialog = this.shadowRoot.querySelector('.lightbox');
    if (!dialog.open) dialog.showModal();
    this.#armAutoplay();
  }

  #stepLightbox(direction) {
    const count = this.#sources().length;
    if (count < 2) return;
    this.#lightbox = (this.#lightbox + direction + count) % count;
    this.#index = count + this.#lightbox;
    this.#paint();
    this.#alignNow();
    this.#renderLightbox();
  }

  #renderLightbox() {
    const root = this.shadowRoot;
    const photos = this.#photos();
    const photo = photos[this.#lightbox];
    const image = root.querySelector('.lightbox-image');
    const count = photos.length;
    if (!photo) return;
    image.src = photo.src;
    image.alt = photo.alt;
    const current = String(this.#lightbox + 1).padStart(2, '0');
    const total = String(count).padStart(2, '0');
    root.querySelector('.lightbox-count').textContent = `${current} / ${total}`;
    root.querySelector('.lightbox-prev').hidden = count < 2;
    root.querySelector('.lightbox-next').hidden = count < 2;
  }

  #dragStart(event) {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    if (this.#sources().length < 2) return;
    const slide = event.composedPath().find((node) => node.localName === 'arq-project-slide');
    if (this.#outside()) this.#recenter();
    this.#drag = {
      id: event.pointerId,
      x: event.clientX,
      tx: this.#txFor(this.#index),
      moved: false,
      slide,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    this.#armAutoplay();
  }

  #dragMove(event) {
    if (!this.#drag || event.pointerId !== this.#drag.id) return;
    const dx = event.clientX - this.#drag.x;
    if (!this.#drag.moved) {
      if (Math.abs(dx) <= DRAG_START) return;
      this.#drag.moved = true;
      this.shadowRoot.querySelector('.track').style.transition = 'none';
      this.#setDragging(true);
      this.#armAutoplay();
    }
    event.preventDefault();
    this.shadowRoot.querySelector('.track').style.transform = `translateX(${this.#drag.tx + dx}px)`;
  }

  #dragEnd(event) {
    if (!this.#drag || event.pointerId !== this.#drag.id) return;
    const drag = this.#drag;
    this.#drag = null;
    this.#suppressClick = true;
    setTimeout(() => {
      this.#suppressClick = false;
    }, 0);
    const track = this.shadowRoot.querySelector('.track');
    this.#setDragging(false);
    track.style.transition = '';
    if (!drag.moved) {
      if (event.type === 'pointerup' && drag.slide) this.#openFrom(drag.slide);
      return;
    }
    const tx = drag.tx + (event.clientX - drag.x);
    this.#index = this.#nearest(tx);
    if (this.#reduced.matches) this.#recenter();
    else {
      this.#paint();
      this.#alignSoon();
      if (this.#outside()) this.#armWrap();
    }
    this.#armAutoplay();
  }

  #setDragging(on) {
    this.shadowRoot.querySelector('.rail').toggleAttribute('data-dragging', on);
    for (const slide of this.#slides()) slide.toggleAttribute('data-dragging', on);
  }

  #canAutoplay() {
    const dialog = this.shadowRoot?.querySelector('.lightbox');
    return Boolean(this.autoplay)
      && !this.#reduced.matches
      && !this.#hovering
      && !this.#drag
      && !dialog?.open
      && !document.hidden
      && this.#sources().length > 1;
  }

  #armAutoplay() {
    this.#stopAutoplay();
    if (!this.#canAutoplay()) return;
    this.#timer = window.setInterval(() => this.#move(1), AUTOPLAY_MS);
  }

  #stopAutoplay() {
    window.clearInterval(this.#timer);
    this.#timer = 0;
  }
}

ArqProjectSlider.define();

export { ArqProjectSlider };
