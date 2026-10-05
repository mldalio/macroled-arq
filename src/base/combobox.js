// Combobox de un valor (patrón select-only de ARIA): un botón role="combobox"
// que abre una lista role="listbox" (arq-select-menu) en el mismo Shadow DOM.
// El foco queda siempre en el botón; la opción resaltada va en
// aria-activedescendant. Lo usan arq-select y arq-input type="select".
//
//   this.combobox = new Combobox({
//     trigger, menu,                      // <button role="combobox">, <arq-select-menu>
//     options: () => [{ label, disabled }], // en el orden del menú
//     selected: () => índice elegido (o -1),
//     isOpen: () => this.open,
//     setOpen: (open) => (this.open = open),
//     choose: (index) => …,               // elegir una opción habilitada
//   });
//
// - Teclado: cerrado, flechas, Enter, Espacio, Inicio, Fin o una letra abren;
//   abierto, flechas, Inicio, Fin y letras mueven el resaltado (saltean las
//   deshabilitadas), Enter o Espacio eligen y Esc o Tab cierran.
// - Clic en el botón abre o cierra; clic en una opción la elige; Tab o clic
//   afuera cierran sin elegir.
// - El componente llama a combobox.closed() cuando su prop open pasa a false.

export class Combobox {
  #config;
  #active = -1;
  #typed = '';
  #typedAt = 0;

  constructor(config) {
    this.#config = config;
    const { trigger, menu } = config;
    trigger.setAttribute('role', 'combobox');
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-controls', menu.id);
    trigger.addEventListener('click', () => (config.isOpen() ? this.close() : this.show()));
    trigger.addEventListener('keydown', (event) => this.#onKeydown(event));
    trigger.addEventListener('blur', () => {
      // Tab o clic afuera: se cierra sin elegir.
      setTimeout(() => {
        const root = trigger.getRootNode();
        if (config.isOpen() && root.activeElement !== trigger) this.close(false);
      });
    });
    menu.addEventListener('pointerdown', (event) => event.preventDefault()); // el foco queda en el botón
    menu.addEventListener('click', (event) => {
      const option = event.target.closest('arq-select-option');
      if (option && !option.disabled) this.#choose([...menu.children].indexOf(option));
    });
    menu.addEventListener('arq:change', (event) => event.stopPropagation());
  }

  /** Abre con la opción elegida resaltada (o la primera habilitada). */
  show() {
    const { setOpen, selected, options } = this.#config;
    setOpen(true);
    const index = selected();
    this.#setActive(index >= 0 && !options()[index]?.disabled ? index : this.#next(-1, 1));
  }

  /** Cierra; con focus, el foco vuelve al botón. */
  close(focus = true) {
    this.#config.setOpen(false);
    if (focus) this.#config.trigger.focus();
  }

  /** El componente avisa que se cerró (open = false): se quita el resaltado. */
  closed() {
    this.#setActive(-1);
  }

  #setActive(index) {
    this.#active = index;
    const { trigger, menu } = this.#config;
    const items = [...menu.children];
    items.forEach((el, i) => (el.active = i === index));
    if (index >= 0 && items[index]) {
      trigger.setAttribute('aria-activedescendant', items[index].id);
      // Al abrir, el menú se muestra en el update del componente (después):
      // el scroll espera al próximo cuadro para que la lista ya sea visible.
      requestAnimationFrame(() => items[index].scrollIntoView({ block: 'nearest' }));
    } else {
      trigger.removeAttribute('aria-activedescendant');
    }
  }

  #next(from, step) {
    const list = this.#config.options();
    for (let i = from + step; i >= 0 && i < list.length; i += step) if (!list[i].disabled) return i;
    return from;
  }

  #choose(index) {
    const option = this.#config.options()[index];
    if (!option || option.disabled) return;
    this.#config.choose(index);
    this.close();
  }

  #typeahead(key) {
    const now = Date.now();
    this.#typed = now - this.#typedAt > 500 ? key : this.#typed + key;
    this.#typedAt = now;
    const list = this.#config.options();
    const start = this.#active >= 0 ? this.#active : 0;
    const order = [...list.keys()].slice(start + 1).concat([...list.keys()].slice(0, start + 1));
    const hit = order.find((i) => !list[i].disabled && list[i].label.toLowerCase().startsWith(this.#typed.toLowerCase()));
    if (hit !== undefined) this.#setActive(hit);
  }

  #onKeydown(event) {
    const { key } = event;
    const length = this.#config.options().length;
    const letter = key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey;
    if (!this.#config.isOpen()) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' ', 'Home', 'End'].includes(key)) {
        event.preventDefault();
        this.show();
        if (key === 'Home') this.#setActive(this.#next(-1, 1));
        if (key === 'End') this.#setActive(this.#next(length, -1));
      } else if (letter) {
        this.show();
        this.#typeahead(key);
      }
      return;
    }
    if (key === 'ArrowDown') this.#setActive(this.#next(this.#active, 1));
    else if (key === 'ArrowUp') this.#setActive(this.#next(this.#active, -1));
    else if (key === 'Home') this.#setActive(this.#next(-1, 1));
    else if (key === 'End') this.#setActive(this.#next(length, -1));
    else if (key === 'Enter' || key === ' ') this.#choose(this.#active);
    else if (key === 'Escape') this.close();
    else if (key === 'Tab') {
      this.close(false);
      return;
    } else if (letter) this.#typeahead(key);
    else return;
    event.preventDefault();
  }
}
