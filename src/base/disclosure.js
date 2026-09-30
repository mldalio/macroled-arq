// Lógica compartida de abrir y cerrar para los desplegables:
// accordion-item, faq-item, filter-row, catalog-nav-group y catalog-nav-trigger.
//
// Patrón (fichas doc/<nombre> en Figma):
// - El encabezado es un <button type="button"> con aria-expanded y aria-controls.
//   Enter y Espacio funcionan de forma nativa.
// - El panel se oculta con el atributo hidden (no solo con CSS). El contenido
//   llega por slot: queda en el HTML de Webflow aunque esté cerrado (indexable).
// - El ícono + / – es decorativo (aria-hidden); el estado lo comunica aria-expanded.
// - Cada desplegable abre y cierra por su cuenta: pueden quedar varios abiertos.
// - El estado vive en la prop open del componente (atributo open). Figma define
//   Open=True por defecto en filter-row y catalog-nav-group, pero en código
//   decide el HTML o los datos: un booleano ausente es false.
// - Cambiar open por código no emite eventos. La acción del usuario (y los
//   métodos show / hide / toggle) emite arq:toggle con { open }.
// - TODO: sin animación, porque no hay tokens de movimiento. Si se anima,
//   respetar prefers-reduced-motion.
//
//   setup() {
//     this.disclosure = new Disclosure(this, {
//       trigger: this.shadowRoot.querySelector('button'),
//       panel: this.shadowRoot.querySelector('[part="panel"]'),
//     });
//   }

let uid = 0;

export class Disclosure {
  #host;
  #trigger;
  #panel;

  /**
   * @param {import('./arq-element.js').ArqElement} host componente con una prop booleana open
   * @param {{ trigger: HTMLButtonElement, panel: HTMLElement, closeOnEscape?: boolean }} options
   */
  constructor(host, { trigger, panel, closeOnEscape = false }) {
    this.#host = host;
    this.#trigger = trigger;
    this.#panel = panel;

    // Los id viven dentro del Shadow DOM de cada instancia, pero igual se
    // generan únicos. Nunca se derivan del contenido (por ejemplo, un SKU).
    panel.id ||= `arq-disclosure-${++uid}`;
    trigger.type = 'button';
    trigger.setAttribute('aria-controls', panel.id);
    trigger.addEventListener('click', () => this.toggle());

    if (closeOnEscape) {
      host.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && this.open) {
          event.stopPropagation();
          this.hide();
          this.#trigger.focus();
        }
      });
    }

    host.addController(this);
  }

  get open() {
    return this.#host.open;
  }

  show() {
    this.toggle(true);
  }

  hide() {
    this.toggle(false);
  }

  /** Alterna (o fuerza con true / false) y emite arq:toggle si cambió. */
  toggle(force) {
    const next = force ?? !this.open;
    if (next === this.open) return;
    this.#host.open = next;
    this.#sync();
    this.#host.emit('toggle', { open: next });
  }

  /** Lo llama ArqElement después de cada update() del host. */
  hostUpdate(changed) {
    if (changed.has('open')) this.#sync();
  }

  #sync() {
    const open = this.open;
    this.#trigger.setAttribute('aria-expanded', String(open));
    this.#panel.hidden = !open;
  }
}
