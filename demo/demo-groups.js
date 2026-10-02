// Contenedores de prueba (solo demo, no entran al build). No son componentes
// del sistema: el tablist del mega-menu y el grupo de choice-chip se
// construyen después. Prueban SingleSelect.
//
//   <demo-radio-group role="radiogroup" label="Motivo" items="arq-choice-chip">…</demo-radio-group>
//   <demo-tablist role="tablist" label="Productos">…</demo-tablist>
//
// El role va escrito en el HTML: las opciones se registran antes que estos
// contenedores y miran el role del grupo al conectarse (swatch: role="radio"
// también en el HTML).

import { ArqElement } from '/src/base/arq-element.js';
import { SingleSelect } from '/src/base/single-select.js';

const css = `
:host { display: flex; flex-wrap: wrap; gap: var(--arq-space-gap-sm); }
:host([fill]) ::slotted(*) { flex: 1 1 0; }
`;

class DemoRadioGroup extends ArqElement {
  static tag = 'demo-radio-group';
  static styles = css;
  static template = `<slot></slot>`;
  setup() {
    this.setAttribute('aria-label', this.getAttribute('label') ?? '');
    this.select = new SingleSelect(this, { items: this.getAttribute('items') });
  }
}
DemoRadioGroup.define();

class DemoTablist extends ArqElement {
  static tag = 'demo-tablist';
  // Tablist del mega-menu: gap space/gap/xl y línea border/subtle debajo
  static styles = `
:host { display: flex; gap: var(--arq-space-gap-xl); overflow-x: auto; border-bottom: var(--arq-border-default) solid var(--arq-color-border-subtle); }
`;
  static template = `<slot></slot>`;
  setup() {
    this.setAttribute('aria-label', this.getAttribute('label') ?? '');
    this.select = new SingleSelect(this, { items: 'arq-tab' });
  }
}
DemoTablist.define();
