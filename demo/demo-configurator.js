// Configurador de prueba (solo demo, no entra al build): option-group +
// swatch-picker + src/data/variants.js con los SKU de Kanu (demo/fixtures/kanu.json).
// No es la ficha: la arma <arq-ficha-producto> cuando exista.
//
//   <demo-configurator group="kanu-jardin"></demo-configurator>
//
// Los controles se crean una vez; al elegir se actualizan selected y disabled
// en los mismos elementos (así el foco no se pierde con las flechas).

import { variantOptions, initialSelection, findVariant, choose } from '/src/data/variants.js';
import { attributeInfo } from '/src/data/attributes.js';
import fixture from '/demo/fixtures/kanu.json';

class DemoConfigurator extends HTMLElement {
  connectedCallback() {
    if (this.group) return;
    this.group = fixture.groups.find((g) => g.id === this.getAttribute('group'));
    if (!this.group) return;
    const sku = new URLSearchParams(location.search).get('sku');
    this.selection = initialSelection(this.group.variants, this.group.variantAttributes, sku);
    this.addEventListener('arq:change', (event) => {
      const attribute = event.target.closest('[data-attribute]')?.dataset.attribute;
      if (!attribute || !event.detail?.selected) return;
      this.selection = choose(this.selection, attribute, event.detail.value);
      this.refresh();
    });
    this.build();
    this.refresh();
  }

  get options() {
    return variantOptions(this.group.variants, this.group.variantAttributes, this.selection);
  }

  build() {
    const groups = this.options.map(({ attribute, options }) => {
      const info = attributeInfo(attribute);
      const group = document.createElement('arq-option-group');
      group.dataset.attribute = attribute;
      group.setAttribute('label', info.label);
      const swatches = info.control === 'swatches';
      const parent = swatches ? document.createElement('arq-swatch-picker') : group;
      if (swatches) {
        group.setAttribute('type', 'swatches');
        group.append(parent);
      }
      for (const option of options) {
        const item = document.createElement(swatches ? 'arq-swatch' : 'arq-option-tile');
        item.value = option.value;
        item.textContent = option.value;
        const src = swatches && fixture.finishImages[option.value];
        if (src) item.src = src;
        parent.append(item);
      }
      return group;
    });
    this.result = document.createElement('p');
    this.result.className = 'demo-note role-body-sm';
    this.replaceChildren(...groups, this.result);
  }

  refresh() {
    for (const { attribute, options } of this.options) {
      const items = this.querySelectorAll(`[data-attribute="${attribute}"] :is(arq-swatch, arq-option-tile)`);
      items.forEach((item, i) => {
        item.selected = options[i].selected;
        item.disabled = options[i].disabled;
      });
    }
    const variant = findVariant(this.group.variants, this.selection);
    this.result.textContent = `${this.group.name} · SKU: ${variant ? variant.sku : '—'}`;
  }
}

customElements.define('demo-configurator', DemoConfigurator);
