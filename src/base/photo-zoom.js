// photo-zoom · acercar la foto del visor (src/base/photo-viewer.js), como el
// visor de las fichas de macroled.com.ar (docs/decisiones.md, 2026-11-02 ·
// Ficha: hero en la pantalla y fotos ampliadas).
//
// - Clic (o doble toque) acerca al punto tocado; otro clic vuelve al tamaño entero.
// - La rueda del mouse y el pellizco acercan y alejan, de 1 a MAX.
// - Acercada, la foto se arrastra para recorrerla, sin salirse del recuadro: en
//   el borde cede con resistencia y al soltar vuelve; un arrastre rápido sigue
//   con impulso (sin resistencia ni impulso con reduced motion).
// - Teclado: + y − acercan y alejan desde el centro (los maneja el visor).
// - Cambiar de foto o cerrar vuelve al tamaño entero.
// - Un gesto que empieza mientras la foto se anima sigue desde donde se ve.
//
// TODO (diseño): el factor del clic y el máximo no tienen token.

const STEP = 2.5; // clic o doble toque
const MAX = 4;
const WHEEL = 0.002; // por píxel de rueda
const MOVE = 6; // px: más que esto es un arrastre, no un clic
const DOUBLE_TAP = 300; // ms entre dos toques
const RUBBER = 0.55; // resistencia en el borde (como el scroll de iOS)
const DECELERATION = 0.998; // por ms, como el scroll (impulso al soltar)
const MIN_SPEED = 0.05; // px/ms: por debajo, el impulso termina
const SAMPLES = 100; // ms de movimiento que cuentan para la velocidad al soltar

const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

// Cuánto se corre algo que se arrastra `overshoot` px más allá del borde: cada vez menos
const rubberband = (overshoot, dimension) => (overshoot * dimension * RUBBER) / (dimension + RUBBER * Math.abs(overshoot));

export class PhotoZoom {
  #frame; #image; #scale = 1; #x = 0; #y = 0;
  #pointers = new Map(); #gesture = null; #moved = false; #lastTap = null; #touch = false;
  #samples = []; #glide = 0;

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
    this.#stopGlide();
    this.#scale = 1; this.#x = 0; this.#y = 0; this.#gesture = null; this.#pointers.clear();
    this.#apply(animate);
  }

  /** Acerca (direction 1) o aleja (−1) desde el centro del recuadro: teclas + y −. */
  step(direction) {
    this.#syncFromScreen();
    const box = this.#frame.getBoundingClientRect();
    const scale = direction > 0 ? Math.min(this.#scale * 1.5, MAX) : this.#scale / 1.5;
    this.#zoomAt(scale, box.left + box.width / 2, box.top + box.height / 2, true);
  }

  #toggle(clientX, clientY) {
    this.#syncFromScreen();
    if (this.zoomed) this.reset(true);
    else this.#zoomAt(STEP, clientX, clientY, true);
  }

  // El punto de la foto que está bajo (clientX, clientY) queda en el mismo lugar.
  // Durante un pellizco no se resetea al llegar a 1: se queda en 1 y el gesto
  // sigue (si no, se perdían los dedos y separarlos ya no acercaba).
  #zoomAt(scale, clientX, clientY, animate = false) {
    const next = Math.min(Math.max(scale, 1), MAX);
    if (next <= 1) {
      if (this.#gesture?.type !== 'pinch') return this.reset(animate);
      this.#scale = 1; this.#x = 0; this.#y = 0;
      return this.#apply(animate);
    }
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
  // Si en un eje entra entera, va centrada en ese eje. Con `elastic` (arrastrando),
  // lo que pasa del borde se muestra con resistencia en vez de frenar en seco.
  #bounds(elastic = false) {
    const frame = this.#frame; const image = this.#image;
    const axis = (offset, size, visible, value) => {
      const scaled = size * this.#scale;
      if (scaled <= visible) return (visible - scaled) / 2 - offset;
      const clamped = Math.min(Math.max(value, visible - scaled - offset), -offset);
      return elastic ? clamped + rubberband(value - clamped, visible) : clamped;
    };
    return {
      x: axis(image.offsetLeft, image.offsetWidth, frame.clientWidth, this.#x),
      y: axis(image.offsetTop, image.offsetHeight, frame.clientHeight, this.#y),
    };
  }

  #apply(animate, elastic = false) {
    const image = this.#image;
    let { x, y } = { x: this.#x, y: this.#y };
    if (this.zoomed) {
      ({ x, y } = this.#bounds(elastic));
      // El arrastre guarda el lugar sin resistencia (sigue al dedo); lo demás, el que se ve
      if (!elastic) { this.#x = x; this.#y = y; }
    }
    image.classList.toggle('is-animating', animate);
    image.style.transform = this.zoomed ? `translate(${x}px, ${y}px) scale(${this.#scale})` : '';
    this.#frame.classList.toggle('is-zoomed', this.zoomed);
  }

  // Si la foto se está animando (zoom por clic, vuelta del borde), toma el lugar
  // que se ve en ese momento: el gesto nuevo arranca desde ahí, sin saltar al final.
  #syncFromScreen() {
    this.#stopGlide();
    const image = this.#image;
    if (!image.classList.contains('is-animating')) return;
    const { transform } = getComputedStyle(image);
    if (transform && transform !== 'none') {
      const matrix = new DOMMatrixReadOnly(transform);
      this.#scale = matrix.a; this.#x = matrix.e; this.#y = matrix.f;
    } else {
      this.#scale = 1; this.#x = 0; this.#y = 0;
    }
    image.classList.remove('is-animating');
    image.style.transform = this.#scale > 1 ? `translate(${this.#x}px, ${this.#y}px) scale(${this.#scale})` : '';
  }

  #onWheel(event) {
    event.preventDefault();
    this.#syncFromScreen();
    this.#zoomAt(this.#scale * Math.exp(-event.deltaY * WHEEL), event.clientX, event.clientY);
  }

  #onDown(event) {
    this.#touch = event.pointerType !== 'mouse';
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    this.#syncFromScreen();
    this.#pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    // El puntero se toma recién al arrastrar: tomado desde el principio, el
    // click y el pointerup llegan al recuadro y no a la foto (el visor cerraba)
    this.#moved = false;
    this.#startGesture();
  }

  // Un dedo (o el mouse) con la foto acercada: arrastre. Dos dedos: pellizco.
  #startGesture() {
    const points = [...this.#pointers.values()];
    this.#samples = [];
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
    const now = event.timeStamp;
    this.#samples.push({ t: now, x: event.clientX, y: event.clientY });
    while (this.#samples.length > 2 && now - this.#samples[0].t > SAMPLES) this.#samples.shift();
    this.#apply(false, !reducedMotion());
  }

  #onUp(event, cancelled = false) {
    if (!this.#pointers.has(event.pointerId)) return;
    const panning = this.#gesture?.type === 'pan' && this.#moved && this.zoomed;
    const pinching = this.#gesture?.type === 'pinch';
    this.#pointers.delete(event.pointerId);
    if (this.#frame.hasPointerCapture(event.pointerId)) this.#frame.releasePointerCapture(event.pointerId);
    this.#frame.classList.remove('is-dragging');
    const tap = !cancelled && !this.#moved && event.pointerType === 'touch' && !this.#pointers.size;
    // Queda un dedo después de pellizcar: sigue como arrastre desde ahí
    this.#gesture = null;
    if (this.#pointers.size) this.#startGesture();
    else if (pinching && !this.zoomed) this.reset(true);
    else if (panning) this.#release(cancelled);
    if (!tap) return;
    const now = event.timeStamp;
    const last = this.#lastTap;
    if (last && now - last.t < DOUBLE_TAP && Math.hypot(event.clientX - last.x, event.clientY - last.y) < MOVE * 4) {
      this.#lastTap = null;
      if (event.target === this.#image || this.zoomed) this.#toggle(event.clientX, event.clientY);
    } else this.#lastTap = { t: now, x: event.clientX, y: event.clientY };
  }

  // Al soltar un arrastre: con velocidad, la foto sigue y frena como el scroll;
  // si quedó pasada del borde, vuelve (motion/duration/base, easing/out).
  #release(cancelled) {
    const samples = this.#samples;
    this.#samples = [];
    const first = samples[0]; const last = samples[samples.length - 1];
    const elapsed = last && first ? last.t - first.t : 0;
    let vx = elapsed ? (last.x - first.x) / elapsed : 0;
    let vy = elapsed ? (last.y - first.y) / elapsed : 0;
    if (cancelled || reducedMotion() || Math.hypot(vx, vy) < MIN_SPEED) {
      const rest = this.#bounds();
      const out = rest.x !== this.#x || rest.y !== this.#y;
      return this.#apply(out);
    }
    let previous = performance.now();
    const frame = (now) => {
      const dt = Math.min(now - previous, 32);
      previous = now;
      this.#x += vx * dt; this.#y += vy * dt;
      const decay = DECELERATION ** dt;
      vx *= decay; vy *= decay;
      const rest = this.#bounds();
      // Contra el borde, el impulso se corta en ese eje y la foto vuelve
      if (rest.x !== this.#x) vx = 0;
      if (rest.y !== this.#y) vy = 0;
      if (Math.hypot(vx, vy) < MIN_SPEED) {
        this.#glide = 0;
        return this.#apply(rest.x !== this.#x || rest.y !== this.#y);
      }
      this.#apply(false, true);
      this.#glide = requestAnimationFrame(frame);
    };
    this.#glide = requestAnimationFrame(frame);
  }

  #stopGlide() {
    if (!this.#glide) return;
    cancelAnimationFrame(this.#glide);
    this.#glide = 0;
    // Queda donde se ve, dentro del recuadro
    if (this.zoomed) this.#apply(false);
  }
}
