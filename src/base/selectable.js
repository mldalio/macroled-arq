// Opción elegible de un grupo de selección única (ver single-select.js).
// La usan choice-chip, option-tile y swatch (role="radio", aria-checked) y tab
// (role="tab", aria-selected).
//
//   setup() {
//     this.selectable = new Selectable(this, { role: 'radio', state: 'aria-checked' });
//   }
//
// - El propio elemento es el control: lleva role, aria-checked / aria-selected,
//   aria-disabled y tabindex (atributos, para que los lean también axe y los
//   lectores de pantalla).
// - Clic, Enter o Espacio la eligen: selected = true y emite arq:change
//   { value, selected: true }. Una opción elegida no se des-elige con clic
//   (como un radio). Cambiar selected por código no emite eventos.
// - Dentro de un grupo (role radiogroup o tablist), el tabindex lo maneja el
//   grupo; sola, entra en el orden de Tab salvo que esté deshabilitada.

const GROUP_ROLES = '[role="radiogroup"], [role="tablist"]';

export class Selectable {
  constructor(host, { role, state }) {
    this.host = host;
    this.state = state;
    if (!host.hasAttribute('role')) host.setAttribute('role', role);
    host.choose = () => this.choose();
    host.addEventListener('click', () => this.choose());
    host.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        this.choose();
      }
    });
    host.addController(this);
  }

  choose() {
    const host = this.host;
    if (host.disabled || host.selected) return;
    host.selected = true;
    host.emit('change', { value: host.value ?? null, selected: true });
  }

  hostUpdate() {
    const host = this.host;
    host.setAttribute(this.state, String(Boolean(host.selected)));
    if (host.disabled) host.setAttribute('aria-disabled', 'true');
    else host.removeAttribute('aria-disabled');
    if (!host.parentElement?.closest(GROUP_ROLES)) {
      host.setAttribute('tabindex', host.disabled ? '-1' : '0');
    }
  }
}
