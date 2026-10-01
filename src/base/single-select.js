// Selección única con teclado para grupos de opciones: choice-chip, option-tile,
// swatch (role="radio") y tab (role="tab").
//
// Lo usa el contenedor (option-group, swatch-picker, el tablist del mega-menu
// o el grupo de choice-chip):
//
//   setup() {
//     this.select = new SingleSelect(this, { items: 'arq-option-tile' });
//   }
//
// - Una sola opción con `selected`. Cuando una opción se elige (clic, Enter o
//   Espacio), emite arq:change; el grupo des-selecciona las demás.
// - Roving tabindex: solo la opción elegida (o la primera habilitada) entra en
//   el orden de Tab; las flechas mueven el foco y eligen (como un radio
//   nativo), Inicio / Fin van a la primera / última. Las deshabilitadas se
//   saltean.
// - Las opciones son elementos del DOM del contenedor (light DOM).

const KEYS_NEXT = ['ArrowRight', 'ArrowDown'];
const KEYS_PREV = ['ArrowLeft', 'ArrowUp'];

export class SingleSelect {
  /**
   * @param {HTMLElement} host contenedor del grupo
   * @param {{ items: string }} options selector CSS de las opciones (hijos del host)
   */
  constructor(host, { items }) {
    this.host = host;
    this.selector = items;
    host.addEventListener('keydown', (event) => this.#onKeydown(event));
    host.addEventListener('arq:change', (event) => this.#onChange(event));
    // Opciones que llegan después (render por JS): se reacomoda el tabindex.
    new MutationObserver(() => this.refresh()).observe(host, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['selected', 'disabled'],
    });
    this.refresh();
  }

  get items() {
    return [...this.host.querySelectorAll(this.selector)];
  }

  get enabledItems() {
    return this.items.filter((item) => !item.disabled);
  }

  /** Opción elegida (o null). */
  get selected() {
    return this.items.find((item) => item.selected) ?? null;
  }

  /** Recalcula qué opción entra en el orden de Tab. */
  refresh() {
    const enabled = this.enabledItems;
    const current = this.selected && !this.selected.disabled ? this.selected : enabled[0];
    for (const item of this.items) {
      item.setAttribute('tabindex', item === current ? '0' : '-1');
    }
  }

  #onChange(event) {
    const chosen = event.target;
    if (!this.items.includes(chosen) || !chosen.selected) return;
    for (const item of this.items) {
      if (item !== chosen && item.selected) item.selected = false;
    }
    this.refresh();
  }

  #onKeydown(event) {
    const items = this.enabledItems;
    const index = items.indexOf(event.target);
    if (index === -1) return;
    let next = null;
    if (KEYS_NEXT.includes(event.key)) next = items[(index + 1) % items.length];
    else if (KEYS_PREV.includes(event.key)) next = items[(index - 1 + items.length) % items.length];
    else if (event.key === 'Home') next = items[0];
    else if (event.key === 'End') next = items[items.length - 1];
    if (!next) return;
    event.preventDefault();
    next.focus();
    next.choose?.();
  }
}
