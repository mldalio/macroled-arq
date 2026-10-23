// Scroll nativo con arrastre de mouse; comparte el ritmo de Destacados.
// El avance automático se detiene mientras el mouse está encima o el foco
// está adentro del bloque (el riel y sus flechas: su contenedor), y no vuelve
// mientras siga así (WCAG 2.2.2).
// TODO (diseño): falta un botón de pausa visible (no hay ícono de pausa en el set).
export class HorizontalRail {
  #rail; #host; #autoplay; #open; #drag = null; #timer = 0; #pause = 0;
  #visible = false; #blocked = false; #suppress = false; #events = null; #touching = false; #hovered = false;
  #reduced = matchMedia('(prefers-reduced-motion: reduce)');
  #resize; #intersection; #mutations;

  constructor(host, rail, { autoplay = false, open = null } = {}) {
    this.#host = host; this.#rail = rail; this.#autoplay = autoplay; this.#open = open;
    this.#resize = new ResizeObserver(() => this.refresh());
    this.#intersection = new IntersectionObserver(([entry]) => {
      this.#visible = entry.isIntersecting; this.#sync();
    });
    this.#mutations = new MutationObserver(() => {
      for (const child of rail.children) this.#resize.observe(child);
      this.refresh();
    });
  }

  connect() {
    if (this.#events) return;
    this.#events = new AbortController();
    const signal = this.#events.signal;
    const rail = this.#rail;
    this.#resize.observe(rail);
    for (const child of rail.children) this.#resize.observe(child);
    this.#mutations.observe(rail, { childList: true });
    this.#intersection.observe(rail);
    rail.addEventListener('load', () => this.refresh(), { capture: true, signal });
    rail.addEventListener('dragstart', e => e.preventDefault(), { signal });
    rail.addEventListener('pointerdown', e => {
      if (e.pointerType !== 'mouse') { this.#touching = true; this.#sync(); return; }
      if (e.pointerType !== 'mouse' || e.button !== 0 || !this.#scrollable()) return;
      this.#drag = { id: e.pointerId, x: e.clientX, y: e.clientY, left: rail.scrollLeft, moved: false };
      this.#sync();
    }, { signal });
    rail.addEventListener('pointermove', e => {
      const drag = this.#drag;
      if (!drag || e.pointerId !== drag.id) return;
      const dx = e.clientX - drag.x;
      if (!drag.moved && Math.abs(dx) < 6) return;
      if (!drag.moved && Math.abs(dx) < Math.abs(e.clientY - drag.y)) return;
      drag.moved = true;
      rail.setPointerCapture(e.pointerId);
      rail.toggleAttribute('data-arq-dragging', true);
      e.preventDefault();
      rail.scrollLeft = drag.left - dx;
    }, { signal });
    const finish = e => {
      if (e.pointerType !== 'mouse' && this.#touching) { this.#touching = false; this.#sync(); }
      if (!this.#drag || e.pointerId !== this.#drag.id) return;
      this.#suppress = this.#drag.moved;
      this.#drag = null;
      rail.removeAttribute('data-arq-dragging');
      if (rail.hasPointerCapture(e.pointerId)) rail.releasePointerCapture(e.pointerId);
      clearTimeout(this.#pause);
      this.#pause = setTimeout(() => { this.#suppress = false; this.#pause = 0; this.#sync(); }, 0);
    };
    for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) rail.addEventListener(type, finish, { signal });
    rail.addEventListener('pointerleave', () => {
      if (!this.#drag?.moved) { this.#drag = null; this.#sync(); }
    }, { signal });
    rail.addEventListener('click', e => {
      if (this.#suppress) { e.preventDefault(); e.stopImmediatePropagation(); return; }
      if (this.#open) this.#open(e);
    }, { capture: true, signal });
    const area = this.#area();
    area.addEventListener('focusin', () => this.#sync(), { signal });
    area.addEventListener('focusout', () => queueMicrotask(() => this.#sync()), { signal });
    area.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') { this.#hovered = true; this.#sync(); } }, { signal });
    area.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') { this.#hovered = false; this.#sync(); } }, { signal });
    document.addEventListener('visibilitychange', () => this.#sync(), { signal });
    this.#reduced.addEventListener('change', () => this.#sync(), { signal });
    this.refresh();
  }

  disconnect() {
    this.#events?.abort(); this.#events = null;
    this.#stop(); clearTimeout(this.#pause); this.#pause = 0;
    this.#resize.disconnect(); this.#intersection.disconnect(); this.#mutations.disconnect();
    this.#drag = null;
    this.#rail.removeAttribute('data-arq-dragging');
    this.#touching = false;
    this.#hovered = false;
  }

  set blocked(value) { this.#blocked = value; this.#sync(); }
  #area() { return this.#rail.parentElement ?? this.#rail; }
  #scrollable() { return this.#rail.scrollWidth - this.#rail.clientWidth > 1; }
  #interval() {
    const raw = getComputedStyle(this.#host).getPropertyValue('--arq-motion-duration-feedback').trim();
    return parseFloat(raw) * (raw.endsWith('ms') ? 1 : 1000) * 1.5;
  }
  refresh() {
    this.#rail.toggleAttribute('data-arq-scrollable', this.#scrollable());
    this.#rail.dispatchEvent(new Event('arq:rail-resize'));
    this.#sync();
  }
  go(direction) {
    const rail = this.#rail;
    const box = rail.getBoundingClientRect();
    const inset = parseFloat(getComputedStyle(rail).paddingInlineStart) || 0;
    const positions = [...rail.children].map(child => child.getBoundingClientRect().left - box.left + rail.scrollLeft - inset);
    const max = rail.scrollWidth - rail.clientWidth;
    const target = direction > 0 ? positions.find(x => x > rail.scrollLeft + 1)
      : positions.reverse().find(x => x < rail.scrollLeft - 1);
    rail.scrollTo({ left: Math.min(max, Math.max(0, target ?? (direction > 0 ? max : 0))), behavior: this.#reduced.matches ? 'auto' : 'smooth' });
  }
  #stop() { clearInterval(this.#timer); this.#timer = 0; }
  #sync() {
    const focused = this.#area().matches(':focus-within');
    const canPlay = this.#events && this.#autoplay && this.#visible && !this.#blocked && !this.#drag && !this.#touching && !this.#pause && !focused && !this.#hovered && !this.#reduced.matches && document.visibilityState === 'visible' && this.#scrollable();
    if (!canPlay) { this.#stop(); return; }
    if (!this.#timer) this.#timer = setInterval(() => {
      // Cada paso vuelve a mirar si puede seguir (hover, foco…)
      this.#sync(); if (!this.#timer) return;
      if (this.#rail.scrollLeft >= this.#rail.scrollWidth - this.#rail.clientWidth - 1) this.#rail.scrollTo({ left: 0, behavior: 'smooth' });
      else this.go(1);
    }, this.#interval());
  }
}
