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
// - Al abrir, el panel aparece con un fundido de opacity en motion/duration/base
//   (DESIGN.md §6). El alto cambia de golpe: no se anima layout. Al cerrar se
//   oculta sin fundido (hidden es display: none). Con prefers-reduced-motion
//   queda el fundido de motion/duration/fade. La hoja la adopta Disclosure en el Shadow DOM del host:
//   los componentes no la repiten.
// - animateHeight (faq-item; DESIGN.md §6 · Movimiento): el panel no
//   se oculta con hidden sino con data-open, y anima el alto
//   (grid-template-rows 0fr → 1fr, motion/duration/expand) y la opacidad
//   (motion/duration/base) al abrir y al cerrar, con motion/easing/out.
//   Cerrado queda con visibility: hidden (fuera del orden de Tab y de los
//   lectores). El panel es un envoltorio con un único hijo, que es el que se
//   recorta (sin padding: el padding no se recorta y el panel cerrado no
//   mediría 0). Con reduced motion, el alto cambia de golpe y queda el
//   fundido de motion/duration/fade.
//
//   setup() {
//     this.disclosure = new Disclosure(this, {
//       trigger: this.shadowRoot.querySelector('button'),
//       panel: this.shadowRoot.querySelector('[part="panel"]'),
//     });
//   }

let uid = 0;

// Fundido del panel al abrir. Repite la lista de colores de la hoja base de
// ArqElement porque transition-property no se puede sumar, solo reemplazar.
const disclosureCss = `
[data-disclosure-panel=''] {
  transition-property: opacity, color, background-color, border-color, outline-color, text-decoration-color, fill, stroke;
  transition-duration: var(--arq-motion-duration-base);
  transition-timing-function: var(--arq-motion-easing-standard);
}

@starting-style {
  [data-disclosure-panel='']:not([hidden]) {
    opacity: 0;
  }
}

/* Reduced motion: el fundido se queda (motion/duration/fade); los colores, en
   motion/duration/fast, que vale 0. Ocho valores, uno por propiedad. */
@media (prefers-reduced-motion: reduce) {
  [data-disclosure-panel=''] {
    transition-duration: var(--arq-motion-duration-fade), var(--arq-motion-duration-fast), var(--arq-motion-duration-fast), var(--arq-motion-duration-fast), var(--arq-motion-duration-fast), var(--arq-motion-duration-fast), var(--arq-motion-duration-fast), var(--arq-motion-duration-fast);
    transition-timing-function: var(--arq-motion-easing-out);
  }
}

/* animateHeight. visibility pasa a hidden recién al terminar de cerrar. */
[data-disclosure-panel='height'] {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  visibility: hidden;
  transition:
    grid-template-rows var(--arq-motion-duration-expand) var(--arq-motion-easing-out),
    opacity var(--arq-motion-duration-base) var(--arq-motion-easing-out),
    visibility 0s linear var(--arq-motion-duration-expand);
}

[data-disclosure-panel='height'][data-open] {
  grid-template-rows: 1fr;
  opacity: 1;
  visibility: visible;
  transition-delay: 0s;
}

[data-disclosure-panel='height'] > * {
  min-height: 0;
  overflow: hidden;
}

@media (prefers-reduced-motion: reduce) {
  [data-disclosure-panel='height'] {
    transition:
      opacity var(--arq-motion-duration-fade) var(--arq-motion-easing-out),
      visibility 0s linear var(--arq-motion-duration-fade);
  }

  [data-disclosure-panel='height'][data-open] {
    transition-delay: 0s;
  }
}
`;
let disclosureSheet;

function adoptDisclosureSheet(root) {
  if (!disclosureSheet) {
    disclosureSheet = new CSSStyleSheet();
    disclosureSheet.replaceSync(disclosureCss);
  }
  if (!root.adoptedStyleSheets.includes(disclosureSheet)) {
    root.adoptedStyleSheets = [...root.adoptedStyleSheets, disclosureSheet];
  }
}

export class Disclosure {
  #host;
  #trigger;
  #panel;
  #animateHeight;

  /**
   * @param {import('./arq-element.js').ArqElement} host componente con una prop booleana open
   * @param {{ trigger: HTMLButtonElement, panel: HTMLElement, closeOnEscape?: boolean, animateHeight?: boolean }} options
   */
  constructor(host, { trigger, panel, closeOnEscape = false, animateHeight = false }) {
    this.#host = host;
    this.#trigger = trigger;
    this.#panel = panel;
    this.#animateHeight = animateHeight;

    // Los id viven dentro del Shadow DOM de cada instancia, pero igual se
    // generan únicos. Nunca se derivan del contenido (por ejemplo, un SKU).
    panel.id ||= `arq-disclosure-${++uid}`;
    panel.setAttribute('data-disclosure-panel', animateHeight ? 'height' : '');
    adoptDisclosureSheet(host.shadowRoot);
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
    if (this.#animateHeight) this.#panel.toggleAttribute('data-open', open);
    else this.#panel.hidden = !open;
  }
}
