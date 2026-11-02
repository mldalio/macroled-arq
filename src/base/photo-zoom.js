// photo-zoom · acercar la foto del visor (src/base/photo-viewer.js), como el
// visor de las fichas de macroled.com.ar (docs/decisiones.md, 2026-11-02 ·
// Ficha: hero en la pantalla y fotos ampliadas).
//
// - Clic (o doble toque) acerca al punto tocado; otro clic vuelve al tamaño entero.
// - La rueda del mouse y el pellizco acercan y alejan, de 1 a MAX.
// - Acercada, la foto se arrastra para recorrerla, sin salirse del recuadro.
// - Teclado: + y − acercan y alejan desde el centro (los maneja el visor).
// - Cambiar de foto o cerrar vuelve al tamaño entero.
//
// TODO (diseño): el factor del clic y el máximo no tienen token.

const STEP = 2.5; // clic o doble toque
const MAX = 4;
const WHEEL = 0.002; // por píxel de rueda
const MOVE = 6; // px: más que esto es un arrastre, no un clic
const DOUBLE_TAP = 300; // ms entre dos toques

export class PhotoZoom {
  #frame; #image; #scale = 1; #x = 0; #y = 0;
  #pointers = new Map(); #gesture = null; #moved = false; #lastTap = null; #touch = false;

  constructor(frame, image) {
    this.#frame = frame; this.#image = image;
    frame.addEventListener('wheel', e => this.#onWheel(e), { passive: false });
    frame.addEventListener('pointerdown', e => this.#onDown(e));
    frame.addEventListener('pointermove', e => this.#onMove(e));
    frame.addEventListener('pointerup', e => this.#onUp(e));
    frame.addEventListener('pointercancel', e => this.#onUp(e, true));
    frame.addEventListener('dragstart', e => e.preventDefault());
    // Un arrastre que termina sobre la foto no es un clic (el visor cerraría o acercaría)
    frame.addEventListener('click', e => { if (this.#moved) { e.stopPropagation(); this.#moved = false; } }, { capture: true });
    image.addEventListener('click', e => {
      // En táctil, doble toque. Safari no dice pointerType en el click: se toma del pointerdown
      if (this.#touch) return;
      this.#toggle(e.clientX, e.clientY);
    });
  }

  get zoomed() { return this.#scale > 1; }

  /** Vuelve al tamaño entero. */
  reset(animate = false) {
    this.#scale = 1; this.#x = 0; this.#y = 0; this.#gesture = null; this.#pointers.clear();
    this.#apply(animate);
  }

  /** Acerca (direction 1) o aleja (−1) desde el centro del recuadro: teclas + y −. */
  step(direction) {
    const box = this.#frame.getBoundingClientRect();
    const scale = direction > 0 ? Math.min(this.#scale * 1.5, MAX) : this.#scale / 1.5;
    this.#zoomAt(scale, box.left + box.width / 2, box.top + box.height / 2, true);
  }

  #toggle(clientX, clientY) {
    if (this.zoomed) this.reset(true);
    else this.#zoomAt(STEP, clientX, clientY, true);
  }

  // El punto de la foto que está bajo (clientX, clientY) queda en el mismo lugar
  #zoomAt(scale, clientX, clientY, animate = false) {
    const next = Math.min(Math.max(scale, 1), MAX);
    if (next <= 1) return this.reset(animate);
    // Lugar de la foto sin transform (origen 0 0): el recuadro es su offsetParent
    const box = this.#frame.getBoundingClientRect();
    const left = box.left + this.#frame.clientLeft + this.#image.offsetLeft;
    const top = box.top + this.#frame.clientTop + this.#image.offsetTop;
    const px = (clientX - left - this.#x) / this.#scale;
    const py = (clientY - top - this.#y) / this.#scale;
    this.#x = clientX - left - px * next; this.#y = clientY - top - py * next;
    this.#scale = next;
    this.#apply(animate);
  }

  // Acercada, la foto cubre el recuadro: no se ve el fondo de un lado mientras sobra del otro.
  // Si en un eje entra entera, va centrada en ese eje.
  #clamp() {
    const frame = this.#frame; const image = this.#image;
    const axis = (offset, size, visible, value) => {
      const scaled = size * this.#scale;
      if (scaled <= visible) return (visible - scaled) / 2 - offset;
      return Math.min(Math.max(value, visible - scaled - offset), -offset);
    };
    this.#x = axis(image.offsetLeft, image.offsetWidth, frame.clientWidth, this.#x);
    this.#y = axis(image.offsetTop, image.offsetHeight, frame.clientHeight, this.#y);
  }

  #apply(animate) {
    const image = this.#image;
    if (this.zoomed) this.#clamp();
    image.classList.toggle('is-animating', animate);
    image.style.transform = this.zoomed ? `translate(${this.#x}px, ${this.#y}px) scale(${this.#scale})` : '';
    this.#frame.classList.toggle('is-zoomed', this.zoomed);
  }

  #onWheel(event) {
    event.preventDefault();
    this.#zoomAt(this.#scale * Math.exp(-event.deltaY * WHEEL), event.clientX, event.clientY);
  }

  #onDown(event) {
    this.#touch = event.pointerType !== 'mouse';
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    this.#pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    // El puntero se toma recién al arrastrar: tomado desde el principio, el
    // click y el pointerup llegan al recuadro y no a la foto (el visor cerraba)
    this.#moved = false;
    this.#startGesture();
  }

  // Un dedo (o el mouse) con la foto acercada: arrastre. Dos dedos: pellizco.
  #startGesture() {
    const points = [...this.#pointers.values()];
    if (points.length >= 2) {
      const [a, b] = points;
      this.#gesture = { type: 'pinch', distance: Math.hypot(b.x - a.x, b.y - a.y) || 1, scale: this.#scale, cx: (a.x + b.x) / 2, cy: (a.y + b.y) / 2 };
    } else if (points.length === 1) {
      this.#gesture = { type: 'pan', sx: points[0].x, sy: points[0].y, x: this.#x, y: this.#y };
    }
  }

  #onMove(event) {
    const point = this.#pointers.get(event.pointerId);
    if (!point) return;
    point.x = event.clientX; point.y = event.clientY;
    const gesture = this.#gesture;
    if (!gesture) return;
    if (gesture.type === 'pinch') {
      const [a, b] = [...this.#pointers.values()];
      const cx = (a.x + b.x) / 2; const cy = (a.y + b.y) / 2;
      this.#moved = true;
      // Acerca desde el centro de los dedos y sigue al centro si se mueven juntos
      this.#x += cx - gesture.cx; this.#y += cy - gesture.cy;
      gesture.cx = cx; gesture.cy = cy;
      this.#zoomAt(gesture.scale * Math.hypot(b.x - a.x, b.y - a.y) / gesture.distance, cx, cy);
      return;
    }
    const dx = event.clientX - gesture.sx; const dy = event.clientY - gesture.sy;
    if (!this.#moved && Math.hypot(dx, dy) < MOVE) return;
    if (!this.#moved && !this.#frame.hasPointerCapture(event.pointerId)) this.#frame.setPointerCapture(event.pointerId);
    this.#moved = true;
    if (!this.zoomed) return;
    this.#frame.classList.add('is-dragging');
    this.#x = gesture.x + dx; this.#y = gesture.y + dy;
    this.#apply(false);
  }

  #onUp(event, cancelled = false) {
    if (!this.#pointers.has(event.pointerId)) return;
    this.#pointers.delete(event.pointerId);
    if (this.#frame.hasPointerCapture(event.pointerId)) this.#frame.releasePointerCapture(event.pointerId);
    this.#frame.classList.remove('is-dragging');
    const tap = !cancelled && !this.#moved && event.pointerType === 'touch' && !this.#pointers.size;
    // Queda un dedo después de pellizcar: sigue como arrastre desde ahí
    this.#gesture = null;
    if (this.#pointers.size) this.#startGesture();
    if (!tap) return;
    const now = event.timeStamp;
    const last = this.#lastTap;
    if (last && now - last.t < DOUBLE_TAP && Math.hypot(event.clientX - last.x, event.clientY - last.y) < MOVE * 4) {
      this.#lastTap = null;
      if (event.target === this.#image || this.zoomed) this.#toggle(event.clientX, event.clientY);
    } else this.#lastTap = { t: now, x: event.clientX, y: event.clientY };
  }
}
