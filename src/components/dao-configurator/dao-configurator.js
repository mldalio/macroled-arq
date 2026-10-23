// dao-configurator · pestaña Configurador de la ficha de Daö.
//
// Arma un Daö eligiendo aro, módulos, terminación, cabezal y lámpara. Los
// datos salen de Typesense (src/data/dao-config.js), no del CSV del demo.
// El SKU de la ficha (data-sku) queda preseleccionado: si es un cabezal, una
// lámpara o un frente, esa pieza abre elegida y el resto se acomoda con lo
// compatible. Al cambiar de variante en la ficha, vuelve a esa pieza.

import { ArqElement } from '../../base/arq-element.js';
import { getDaoConfigurator, daoSelection, resolveDao } from '../../data/dao-config.js';
import '../option-group/option-group.js';
import '../option-tile/option-tile.js';
import '../swatch/swatch.js';
import '../swatch-picker/swatch-picker.js';
import '../sku/sku.js';
import '../button/button.js';
import css from './dao-configurator.css?inline';

const TEXT = {
  loading: 'Cargando configurador…',
  empty: 'No hay piezas de Daö para armar.',
  error: 'No se pudo cargar el configurador. Probá de nuevo en unos minutos.',
  noHead: 'Este aro no lleva cabezal: la lámpara va directo al aro.',
  noLamp: 'No hay lámparas cargadas para este armado.',
  withoutFront: 'Esta lámpara no lleva frente.',
  parts: 'Piezas para este armado',
  open: 'Ver ficha',
};

class ArqDaoConfigurator extends ArqElement {
  static tag = 'arq-dao-configurator';
  static styles = css;
  static properties = {
    sku: { type: String, attribute: 'data-sku' },
  };
  static template =
    `<p class="status role-body" role="status"></p>` +
    `<div class="layout" hidden>` +
    `<div class="steps"></div>` +
    `<aside class="result" aria-live="polite"></aside>` +
    `</div>`;

  #model = null;
  #hrefs = new Map();
  #state = null;

  update(changed) {
    if (!changed.has('sku') || !this.#model?.groups.length) return;
    this.#state = daoSelection(this.#model, this.sku);
    this.#render();
  }

  setup() {
    this.shadowRoot.querySelector('.steps').addEventListener('arq:change', (event) => {
      const group = event.target.closest?.('arq-option-group');
      if (!group || !this.shadowRoot.contains(group)) return;
      event.stopPropagation();
      const key = group.dataset.step;
      if (!key) return;
      const value = event.detail.value;
      this.#state[key] = key === 'qty' ? Number(value) : value;
      this.#render(`[data-step="${CSS.escape(key)}"] [value="${CSS.escape(String(value))}"]`);
    });
    this.#load();
  }

  async #load() {
    this.setAttribute('aria-busy', 'true');
    this.#status(TEXT.loading);
    try {
      const { model, hrefs } = await getDaoConfigurator();
      this.#model = model;
      this.#hrefs = hrefs;
    } catch (error) {
      console.error('[arq] configurador Daö: no se pudo cargar', error);
      this.removeAttribute('aria-busy');
      this.#status(TEXT.error);
      return;
    }
    this.removeAttribute('aria-busy');
    if (!this.#model.groups.length) {
      this.#status(TEXT.empty);
      return;
    }
    this.#state = daoSelection(this.#model, this.sku);
    this.#status('');
    this.#render();
  }

  #status(message) {
    this.shadowRoot.querySelector('.status').textContent = message;
  }

  #render(focus) {
    const view = resolveDao(this.#model, this.#state, this.#hrefs);
    if (!view) return;
    this.#state = { group: view.group.id, qty: view.qty, color: view.color, head: view.head?.grupo ?? null, lamp: view.lamp?.sku ?? null, front: view.front?.sku ?? null };
    const root = this.shadowRoot;
    root.querySelector('.layout').hidden = false;
    root.querySelector('.steps').replaceChildren(...this.#steps(view));
    root.querySelector('.result').replaceChildren(...this.#result(view));
    if (!focus) return;
    const chosen = root.querySelector(focus);
    chosen?.focus();
  }

  #steps(view) {
    const steps = [
      this.#tiles('group', 'Aro', view.group.id, this.#model.groups.map((group) => ({ value: group.id, label: group.name }))),
    ];
    if (view.group.modulos.length > 1) {
      steps.push(this.#tiles('qty', 'Módulos', String(view.qty), view.group.modulos.map((qty) => ({
        value: String(qty),
        label: this.#model.moduleName(qty),
      }))));
    }
    steps.push(this.#swatches(view));
    steps.push(view.heads.length
      ? this.#tiles('head', 'Cabezal', view.head?.grupo ?? '', view.heads.map((head) => ({
        value: head.grupo,
        label: head.orientacion ? `${head.nombre || head.sku} · ${head.orientacion}` : (head.nombre || head.sku),
      })))
      : this.#note(TEXT.noHead));
    steps.push(view.lamps.length
      ? this.#tiles('lamp', 'Lámpara', view.lamp?.sku ?? '', view.lamps.map((lamp) => ({
        value: lamp.sku,
        label: lamp.luz ? `${lamp.nombre || lamp.sku} · ${lamp.luz}` : (lamp.nombre || lamp.sku),
      })))
      : this.#note(TEXT.noLamp));
    steps.push(view.fronts.length ? this.#fronts(view) : this.#note(TEXT.withoutFront));
    return steps;
  }

  #tiles(step, label, selected, options) {
    const group = document.createElement('arq-option-group');
    group.dataset.step = step;
    group.label = label;
    for (const option of options) {
      const tile = document.createElement('arq-option-tile');
      tile.value = option.value;
      tile.selected = option.value === selected;
      tile.textContent = option.label;
      group.append(tile);
    }
    return group;
  }

  #swatches(view) {
    const group = document.createElement('arq-option-group');
    group.dataset.step = 'color';
    group.type = 'swatches';
    group.label = 'Terminación';
    group.value = view.color ?? '';
    const picker = document.createElement('arq-swatch-picker');
    for (const color of view.colors) {
      const swatch = document.createElement('arq-swatch');
      swatch.value = color;
      swatch.selected = color === view.color;
      swatch.textContent = color;
      const src = this.#model.swatch(color);
      if (src) swatch.src = src;
      picker.append(swatch);
    }
    group.append(picker);
    return group;
  }

  // Los de frentes_compatibles de la lámpara elegida (PAR11-C-5W-DIM-36G-WW: blanco y negro).
  #fronts(view) {
    const group = document.createElement('arq-option-group');
    group.dataset.step = 'front';
    group.type = 'swatches';
    group.label = 'Frente';
    group.value = view.front?.color || view.front?.nombre || '';
    const picker = document.createElement('arq-swatch-picker');
    for (const front of view.fronts) {
      const swatch = document.createElement('arq-swatch');
      swatch.value = front.sku;
      swatch.selected = front.sku === view.front?.sku;
      swatch.textContent = front.color || front.nombre || front.sku;
      const src = front.color ? this.#model.swatch(front.color) : null;
      if (src) swatch.src = src;
      picker.append(swatch);
    }
    group.append(picker);
    return group;
  }

  #note(text) {
    const note = document.createElement('p');
    note.className = 'note role-body';
    note.textContent = text;
    return note;
  }

  #result(view) {
    const nodes = [];
    if (view.thumbs.length) {
      const thumbs = document.createElement('div');
      thumbs.className = 'thumbs';
      for (const thumb of view.thumbs) {
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        img.src = thumb.src;
        img.alt = thumb.label;
        img.loading = 'lazy';
        const caption = document.createElement('figcaption');
        caption.className = 'role-body-sm';
        caption.textContent = thumb.label;
        figure.append(img, caption);
        thumbs.append(figure);
      }
      nodes.push(thumbs);
    }
    const title = document.createElement('p');
    title.className = 'title role-heading-3';
    title.textContent = view.head ? `${view.title}, ${view.head.nombre || view.head.sku}` : view.title;
    nodes.push(title);
    if (view.specs.length) {
      const specs = document.createElement('dl');
      specs.className = 'specs role-body';
      for (const [label, value] of view.specs) {
        const term = document.createElement('dt');
        term.textContent = label;
        const detail = document.createElement('dd');
        detail.textContent = value;
        specs.append(term, detail);
      }
      nodes.push(specs);
    }
    const partsTitle = document.createElement('p');
    partsTitle.className = 'parts-title role-body-medium';
    partsTitle.textContent = TEXT.parts;
    const list = document.createElement('ul');
    list.className = 'parts';
    for (const part of view.parts) list.append(this.#part(part));
    nodes.push(partsTitle, list);
    return nodes;
  }

  #part(part) {
    const item = document.createElement('li');
    item.className = 'part';
    const qty = document.createElement('span');
    qty.className = 'qty role-body';
    qty.textContent = `${part.qty}×`;
    const body = document.createElement('div');
    body.className = 'part-body';
    if (part.href) {
      const link = document.createElement('arq-button');
      link.type = 'underline';
      link.showUnderline = true;
      link.href = part.href;
      link.textContent = part.name;
      body.append(link);
    } else {
      const name = document.createElement('span');
      name.className = 'role-body';
      name.textContent = part.name;
      body.append(name);
    }
    const code = document.createElement('arq-sku');
    code.size = 'compact';
    code.textContent = part.sku;
    body.append(code);
    item.append(qty, body);
    return item;
  }
}

ArqDaoConfigurator.define();

export { ArqDaoConfigurator };
