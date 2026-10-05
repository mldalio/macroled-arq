// Clase base de todos los componentes de Macroled Arq.
//
// - Crea el Shadow DOM y adopta la hoja de roles compartida + la del componente.
// - Refleja atributos ↔ props: la prop de Figma "Show icon" es el atributo
//   show-icon y la prop JS showIcon. Los valores van en kebab-case, igual en el
//   atributo y en JS: type="outline" → el.type === 'outline'.
// - Emite eventos arq:<nombre> que salen del Shadow DOM (bubbles + composed).
//
// No son props: Breakpoint (media query) ni Hover / Pressed / Focus
// (:hover, :active, :focus-visible). Sí lo son los estados que dependen de
// datos o de la app (open, selected, disabled, loading…), declarados uno por uno.
//
//   import css from './accordion-item.css?inline';
//
//   class ArqAccordionItem extends ArqElement {
//     static tag = 'arq-accordion-item';
//     static styles = css;
//     static properties = {
//       open: { type: Boolean },                                       // Open
//       type: { type: String, values: ['filled', 'outline'], default: 'filled' },
//       count: { type: Number },
//     };
//     static template = `<button type="button">…</button><div part="panel"><slot></slot></div>`;
//     setup() { … }            // una vez, al conectarse por primera vez
//     update(changed) { … }    // al conectarse y cada vez que cambian props
//   }
//   ArqAccordionItem.define();

import { adoptStyles } from '../styles/roles.js';

const toAttribute = (prop) => prop.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
const templates = new WeakMap();

// Hoja base de todos los componentes, antes que la del componente.
// [hidden] gana siempre: el CSS de un componente que le pone display a un
// panel no puede dejarlo visible cuando Disclosure lo oculta.
// .visually-hidden: texto solo para lectores de pantalla (nombres de controles
// sin texto visible, labels ocultos con Show label=false, números reales).
// border/default (1 px) es el tamaño mínimo disponible: con 0 algunos lectores
// lo descartan.
// Transición de colores (DESIGN.md §6 · Movimiento): una sola regla para el
// cambio de hover, pressed, foco y selección de todos los componentes, con
// motion/duration/fast y motion/easing/standard. Solo colores: nunca alto,
// ancho ni posición. Alcanza solo al Shadow DOM (el contenido por slot no la
// toma). Con prefers-reduced-motion la duración vale 0 desde tokens.css.
// Un componente que además anima transform u opacity redeclara la lista
// completa en ese elemento (toggle, ícono de los desplegables).
// Encabezados por slot (AGENTS.md: h1–h6 en el HTML de la página): sin margen
// y con la tipografía y el color del contenedor del componente, que lleva la
// clase role/*. !important porque los estilos del sitio (Webflow) para h1–h6
// ganan sobre ::slotted.
// --page-gutter: margen lateral del contenido de página (DESIGN.md §2 ·
// Breakpoints y grilla). Es layout/gutter hasta que el viewport supera
// layout/max-width + 2 × gutter (1920 px); desde ahí crece y el contenido queda
// centrado en layout/max-width. Va como padding, así los fondos siguen a todo
// el ancho. 100vw (no 100%) para que dé lo mismo en cualquier contenedor
// (celdas sticky, carruseles). Variable local: no se declara en :root.
const baseCss = `
:host {
  --page-gutter: max(var(--arq-layout-gutter), (100vw - var(--arq-layout-max-width)) / 2);
}

:host([hidden]),
[hidden] {
  display: none !important;
}

*,
*::before,
*::after {
  transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke;
  transition-duration: var(--arq-motion-duration-fast);
  transition-timing-function: var(--arq-motion-easing-standard);
}

.visually-hidden {
  position: absolute;
  width: var(--arq-border-default);
  height: var(--arq-border-default);
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

::slotted(h1),
::slotted(h2),
::slotted(h3),
::slotted(h4),
::slotted(h5),
::slotted(h6) {
  margin: 0 !important;
  font: inherit !important;
  letter-spacing: inherit !important;
  text-transform: inherit !important;
  color: inherit !important;
}
`;

function warn(message) {
  if (import.meta.env.DEV) console.warn(`[arq] ${message}`);
}

export class ArqElement extends HTMLElement {
  /** Nombre del elemento, con prefijo arq- */
  static tag = '';
  /** CSS del componente (texto de `import css from './x.css?inline'`) */
  static styles = '';
  /** HTML del Shadow DOM. Se parsea una vez por clase. */
  static template = '';
  /** { prop: { type: Boolean | String | Number, values?, default?, attribute? } } */
  static properties = {};

  static get observedAttributes() {
    return Object.entries(this.properties).map(([prop, def]) => def.attribute ?? toAttribute(prop));
  }

  /** Registra el elemento una sola vez (Webflow puede cargar el script dos veces). */
  static define() {
    if (!this.tag) throw new Error(`${this.name}: falta static tag`);
    if (customElements.get(this.tag)) return this;
    // Los estáticos privados solo se leen desde ArqElement; this es la subclase.
    ArqElement.#createAccessors.call(this);
    customElements.define(this.tag, this);
    return this;
  }

  static #createAccessors() {
    this.attributeToProp = new Map();
    for (const [prop, def] of Object.entries(this.properties)) {
      const attr = def.attribute ?? toAttribute(prop);
      this.attributeToProp.set(attr, prop);
      Object.defineProperty(this.prototype, prop, {
        configurable: true,
        enumerable: true,
        get() {
          return this.#read(attr, def);
        },
        set(value) {
          this.#write(attr, def, value);
        },
      });
    }
  }

  #changed = new Set();
  #updateQueued = false;
  #ready = false;
  #controllers = new Set();

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    adoptStyles(root, baseCss, this.constructor.styles);
    const template = this.#templateElement();
    if (template) root.append(template.content.cloneNode(true));
  }

  connectedCallback() {
    if (!this.#ready) {
      this.#upgradeProperties();
      this.setup();
      this.#ready = true;
      this.#runUpdate(new Set(Object.keys(this.constructor.properties)));
    }
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    if (oldValue === newValue) return;
    const prop = this.constructor.attributeToProp.get(attr);
    const def = this.constructor.properties[prop];
    if (def.values && newValue !== null && !def.values.includes(newValue)) {
      warn(`<${this.localName}> ${attr}="${newValue}" no es válido (${def.values.join(' · ')}). Se usa "${def.default}".`);
    }
    this.#changed.add(prop);
    this.#queueUpdate();
  }

  /** Se llama una vez, cuando el elemento se conecta por primera vez. */
  setup() {}

  /** Se llama al conectarse y después de cada cambio de props (agrupados). */
  update(_changed) {}

  /**
   * Suma un controlador (por ejemplo Disclosure). Su hostUpdate(changed) se
   * llama después de cada update() del componente.
   */
  addController(controller) {
    this.#controllers.add(controller);
    if (this.#ready) controller.hostUpdate?.(new Set(Object.keys(this.constructor.properties)));
  }

  /** Despacha arq:<nombre>. Devuelve false si se canceló (con cancelable: true). */
  emit(name, detail, { cancelable = false } = {}) {
    return this.dispatchEvent(new CustomEvent(`arq:${name}`, { bubbles: true, composed: true, cancelable, detail }));
  }

  #read(attr, def) {
    const raw = this.getAttribute(attr);
    if (def.type === Boolean) return raw !== null;
    if (raw === null) return def.default ?? null;
    if (def.type === Number) {
      const n = Number(raw);
      return Number.isFinite(n) ? n : (def.default ?? null);
    }
    if (def.values && !def.values.includes(raw)) return def.default ?? null;
    return raw;
  }

  #write(attr, def, value) {
    if (def.type === Boolean) this.toggleAttribute(attr, Boolean(value));
    else if (value === null || value === undefined) this.removeAttribute(attr);
    else this.setAttribute(attr, String(value));
  }

  #templateElement() {
    const Class = this.constructor;
    if (!Class.template) return null;
    if (!templates.has(Class)) {
      const el = document.createElement('template');
      el.innerHTML = Class.template;
      templates.set(Class, el);
    }
    return templates.get(Class);
  }

  // Props asignadas antes de que se registrara el elemento (quedaron como
  // propiedades propias de la instancia): se pasan por el setter.
  #upgradeProperties() {
    for (const prop of Object.keys(this.constructor.properties)) {
      if (Object.prototype.hasOwnProperty.call(this, prop)) {
        const value = this[prop];
        delete this[prop];
        this[prop] = value;
      }
    }
  }

  #queueUpdate() {
    if (!this.#ready || this.#updateQueued) return;
    this.#updateQueued = true;
    queueMicrotask(() => {
      this.#updateQueued = false;
      const changed = this.#changed;
      this.#changed = new Set();
      this.#runUpdate(changed);
    });
  }

  #runUpdate(changed) {
    this.#changed.clear();
    this.update(changed);
    for (const controller of this.#controllers) controller.hostUpdate?.(changed);
  }
}
