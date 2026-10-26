// dao-configurator · configurador de la colección Daö, en un modal a pantalla completa
//
// PRUEBA (rama proto/dao-configurator-modal): se abre desde el botón de la ficha
// de cualquier producto configurable de Daö y se arma paso por paso, como las
// páginas de compra de Apple: un paso abierto a la vez, los hechos se pliegan en
// una línea con «Cambiar» y las fotos de las piezas se suman a la derecha a
// medida que se eligen.
//
//   configurator.show('DAO-E-X1-N', botón);   // abre desde la ficha de ese SKU
//   configurator.close();
//
// - Pasos: 1 Aro (grupo, módulos y color), 2 Cabezal (modelo y color; solo si el
//   aro lo lleva) y 3 Lámpara (modelo y, si lo trae, color del frente).
// - La pieza de la ficha sale ya elegida y marcada «Tu producto», sin «Cambiar»;
//   lo que va antes se limita a lo compatible con ella (src/data/dao-config.js,
//   daoFixed y resolveDao). Los pasos, igual, van de 1 en adelante.
// - Al terminar el último paso queda el armado completo: fotos, especificaciones,
//   piezas y «Imprimir configuración» (emite arq:print; PDF: TODO, hoy abre una
//   hoja imprimible simple).
// - Diálogo modal nativo, como compare-picker: foco adentro, Esc cierra, el foco
//   vuelve a quien lo abrió y la página de atrás no se desplaza. Siempre en Light.

import { ArqElement } from '../../base/arq-element.js';
import { containScroll } from '../../base/scroll-lock.js';
import { getDaoConfigurator, daoSelection, daoFixed, resolveDao } from '../../data/dao-config.js';
import '../icon-button/icon-button.js';
import '../option-group/option-group.js';
import '../option-tile/option-tile.js';
import '../swatch/swatch.js';
import '../sku/sku.js';
import '../button/button.js';
import '../text-link/text-link.js';
import css from './dao-configurator.css?inline';

const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

const TEXT = {
  title: 'Armá tu Daö',
  loading: 'Cargando configurador…',
  empty: 'No hay piezas de Daö para armar.',
  error: 'No se pudo cargar el configurador. Probá de nuevo en unos minutos.',
  noHead: 'Este aro no lleva cabezal: la lámpara va directo al aro.',
  noLamp: 'No hay lámparas cargadas para este armado.',
  withFront: 'Esta lámpara lleva frente y panal como accesorios requeridos: se suman al armado.',
  next: 'Continuar',
  finish: 'Finalizar',
  change: 'Cambiar',
  mine: 'Tu producto',
  hint: 'Tu armado se va formando acá a medida que elegís.',
  parts: 'Piezas para este armado',
  print: 'Imprimir configuración',
};

const STEP_NAME = { ring: 'Aro', head: 'Cabezal', lamp: 'Lámpara' };

class ArqDaoConfigurator extends ArqElement {
  static tag = 'arq-dao-configurator';
  static styles = css;
  static template =
    `<dialog class="dialog" data-arq-theme="light" aria-label="${TEXT.title}">` +
    `<div class="sheet">` +
    `<div class="header">` +
    `<p class="title role-heading-2">${TEXT.title}</p>` +
    `<arq-icon-button class="close" icon="close" size="large">Cerrar</arq-icon-button>` +
    `</div>` +
    `<p class="status role-body" role="status"></p>` +
    `<div class="body" hidden>` +
    `<div class="steps"></div>` +
    `<aside class="panel" aria-live="polite"></aside>` +
    `</div>` +
    `</div>` +
    `</dialog>`;

  #dialog = null;
  #opener = null;
  #closing = null;
  #model = null;
  #hrefs = new Map();
  #loading = null;

  #state = null;
  #fixed = { step: null };
  #done = new Set(); // pasos confirmados con «Continuar»
  #seen = new Set(); // pasos donde se eligió algo (su foto ya se ve)
  #active = null; // paso abierto
  #entering = null; // paso que acaba de abrirse (animación)
  #skus = {};
  #result = null;

  setup() {
    const root = this.shadowRoot;
    this.#dialog = root.querySelector('dialog');
    containScroll(this.#dialog);
    root.querySelector('.close').addEventListener('click', () => this.close());
    this.#dialog.addEventListener('cancel', (event) => {
      event.preventDefault();
      this.close();
    });
    this.#dialog.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      this.close();
    });

    const steps = root.querySelector('.steps');
    steps.addEventListener('arq:change', (event) => {
      const group = event.target.closest?.('arq-option-group');
      if (!group || !root.contains(group)) return;
      event.stopPropagation();
      const key = group.dataset.step;
      if (!key) return;
      const value = event.detail.value;
      this.#state[key] = key === 'qty' ? Number(value) : value;
      this.#seen.add(group.closest('.step')?.dataset.section);
      this.#render(`[data-step="${CSS.escape(key)}"] [value="${CSS.escape(String(value))}"]`);
    });
    steps.addEventListener('click', (event) => {
      const next = event.target.closest?.('.next');
      const change = event.target.closest?.('.change');
      if (next) this.#advance();
      else if (change) {
        this.#active = change.closest('.step').dataset.section;
        this.#entering = this.#active;
        this.#render();
      }
    });
    root.querySelector('.panel').addEventListener('click', (event) => {
      if (event.target.closest?.('.print')) this.#print();
    });
  }

  /** Abre el configurador desde la ficha del SKU. El foco vuelve a `opener` al cerrar. */
  async show(sku, opener) {
    this.#opener = opener ?? this.#activeElement();
    this.#showDialog();
    const root = this.shadowRoot;
    root.querySelector('.body').hidden = true;
    this.#status(TEXT.loading);
    try {
      this.#loading ??= getDaoConfigurator();
      const { model, hrefs } = await this.#loading;
      this.#model = model;
      this.#hrefs = hrefs;
    } catch (error) {
      console.error('[arq] configurador Daö: no se pudo cargar', error);
      this.#loading = null;
      this.#status(TEXT.error);
      return;
    }
    if (!this.#model.groups.length) {
      this.#status(TEXT.empty);
      return;
    }
    this.#status('');
    this.#state = daoSelection(this.#model, sku);
    this.#fixed = daoFixed(this.#model, sku);
    this.#done = new Set();
    this.#seen = new Set();
    this.#active = null;
    this.#entering = null;
    this.#skus = {};
    this.#render();
    root.querySelector('.steps').scrollTop = 0;
  }

  close() {
    this.#closeDialog();
  }

  #status(message) {
    this.shadowRoot.querySelector('.status').textContent = message;
  }

  // ── Flujo ────────────────────────────────────────────────────────────
  #isDone(id) {
    return this.#fixed.step === id || this.#done.has(id);
  }

  #advance() {
    if (this.#active) this.#done.add(this.#active);
    this.#active = null;
    this.#render();
  }

  #render(focus) {
    const view = resolveDao(this.#model, this.#state, this.#hrefs, this.#fixed);
    if (!view) return;
    // El color del cabezal solo queda fijado si se lo eligió: si no, sigue al del aro
    this.#state = { group: view.group.id, qty: view.qty, color: view.color, head: view.head?.grupo ?? null, headColor: this.#state.headColor ?? null, lamp: view.lamp?.sku ?? null, front: view.front?.sku ?? null };

    // Si un cambio arrastró la elección de un paso posterior, hay que confirmarlo de nuevo
    const skus = { head: view.head?.sku ?? null, lamp: view.lamp?.sku ?? null, front: view.front?.sku ?? null };
    if (this.#skus.head !== undefined) {
      if (skus.head !== this.#skus.head) this.#done.delete('head');
      if (skus.lamp !== this.#skus.lamp || skus.front !== this.#skus.front) this.#done.delete('lamp');
    }
    this.#skus = skus;

    const order = ['ring', ...(view.heads.length ? ['head'] : []), 'lamp'];
    if (this.#active && !order.includes(this.#active)) this.#active = null;
    const before = this.#active;
    this.#active ??= order.find((id) => !this.#isDone(id)) ?? null;
    if (this.#active && this.#active !== before) this.#entering = this.#active;

    const root = this.shadowRoot;
    root.querySelector('.body').hidden = false;
    root.querySelector('.steps').replaceChildren(...this.#steps(view, order));
    root.querySelector('.panel').replaceChildren(...this.#panel(view, order));
    const entering = root.querySelector('.step.is-entering');
    if (entering) {
      entering.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'nearest' });
      this.#entering = null;
    }
    if (focus) root.querySelector(focus)?.focus({ preventScroll: true });
  }

  // ── Pasos ────────────────────────────────────────────────────────────
  #steps(view, order) {
    return order.map((id, index) => {
      const fixed = this.#fixed.step === id;
      const status = id === this.#active ? 'active' : this.#isDone(id) ? 'done' : 'future';
      const step = document.createElement('section');
      step.className = `step is-${status}`;
      if (id === this.#entering) step.classList.add('is-entering');
      step.dataset.section = id;

      const head = document.createElement('div');
      head.className = 'step-head';
      const number = document.createElement('span');
      number.className = 'step-number role-body-xl';
      number.textContent = String(index + 1);
      const text = document.createElement('div');
      text.className = 'step-text';
      const name = document.createElement('p');
      name.className = 'step-title role-body-xl';
      name.textContent = STEP_NAME[id];
      text.append(name);
      if (status === 'done' || (fixed && status !== 'active')) {
        const summary = document.createElement('p');
        summary.className = 'summary role-body-compact';
        summary.textContent = this.#summary(view, id);
        text.append(summary);
      }
      head.append(number, text);
      if (fixed) {
        const mine = document.createElement('span');
        mine.className = 'mine role-label';
        mine.textContent = TEXT.mine;
        head.append(mine);
      } else if (status === 'done') {
        const change = document.createElement('arq-button');
        change.className = 'change';
        change.setAttribute('type', 'underline');
        change.setAttribute('show-underline', '');
        change.textContent = TEXT.change;
        change.setAttribute('label', `${TEXT.change}: ${STEP_NAME[id]}`);
        head.append(change);
      }
      step.append(head);

      if (status === 'active') {
        const body = document.createElement('div');
        body.className = 'step-body';
        body.append(...this.#groups(view, id));
        const next = document.createElement('arq-button');
        next.className = 'next';
        next.textContent = order.every((item) => item === id || this.#isDone(item)) ? TEXT.finish : TEXT.next;
        body.append(next);
        step.append(body);
      }
      return step;
    });
  }

  #summary(view, id) {
    if (id === 'ring') return view.title;
    if (id === 'head') return view.head ? `${view.head.nombre || view.head.sku} ${(view.head.color || '').toLowerCase()}`.trim() : '';
    const lamp = view.lamp?.nombre || view.lamp?.sku || '';
    return view.fronts.length > 1 && view.front?.color ? `${lamp} · frente ${view.front.color.toLowerCase()}` : lamp;
  }

  #groups(view, id) {
    if (id === 'ring') {
      const nodes = [
        this.#cards('group', 'Aro', view.group.id, view.groups.map((group) => ({ value: group.id, title: group.name })), { hideLabel: true }),
      ];
      if (view.modulos.length > 1) {
        nodes.push(this.#cards('qty', 'Módulos', String(view.qty), view.modulos.map((qty) => ({ value: String(qty), title: this.#model.moduleName(qty) }))));
      }
      nodes.push(this.#cards('color', 'Color', view.color ?? '', view.colors.map((color) => this.#colorOption(color, color))));
      if (!view.heads.length) nodes.push(this.#note(TEXT.noHead));
      return nodes;
    }
    if (id === 'head') {
      const nodes = [
        this.#cards('head', 'Cabezal', view.head?.grupo ?? '', view.heads.map((item) => ({ value: item.grupo, title: item.nombre || item.sku, meta: item.orientacion })), { hideLabel: true }),
      ];
      if (view.headColors.length > 1) {
        nodes.push(this.#cards('headColor', 'Color', view.head?.color ?? '', view.headColors.map((color) => this.#colorOption(color, color))));
      }
      return nodes;
    }
    const nodes = view.lamps.length
      ? [this.#cards('lamp', 'Lámpara', view.lamp?.sku ?? '', view.lamps.map((item) => ({ value: item.sku, title: item.nombre || item.sku, meta: item.luz })), { hideLabel: true })]
      : [this.#note(TEXT.noLamp)];
    if (view.fronts.length > 1) {
      nodes.push(this.#cards('front', 'Color del frente', view.front?.sku ?? '', view.fronts.map((front) => this.#colorOption(front.color || front.nombre || front.sku, front.color, front.sku))));
    }
    if (view.fronts.length) nodes.push(this.#note(TEXT.withFront));
    return nodes;
  }

  #colorOption(title, color, value = title) {
    return { value, title, swatch: color ? this.#model.swatch(color) : null };
  }

  // option-group Type=Cards: cada opción es una option-tile Type=Card con título,
  // un subtítulo opcional (meta) y un swatch opcional (Color)
  #cards(step, label, selected, options, { hideLabel = false } = {}) {
    const group = document.createElement('arq-option-group');
    group.dataset.step = step;
    group.type = 'cards';
    group.label = label;
    group.labelHidden = hideLabel;
    for (const option of options) {
      const tile = document.createElement('arq-option-tile');
      tile.value = option.value;
      tile.selected = option.value === selected;
      tile.textContent = option.title;
      if (option.swatch) {
        const swatch = document.createElement('arq-swatch');
        swatch.slot = 'swatch';
        swatch.src = option.swatch;
        swatch.textContent = option.title;
        tile.append(swatch);
      }
      if (option.meta) {
        const meta = document.createElement('span');
        meta.slot = 'meta';
        meta.textContent = option.meta;
        tile.append(meta);
      }
      group.append(tile);
    }
    return group;
  }

  #note(text) {
    const note = document.createElement('p');
    note.className = 'note role-body';
    note.textContent = text;
    return note;
  }

  // ── Panel: las fotos se suman a medida que se eligen ───────────────────
  #panel(view, order) {
    const shown = (id) => this.#isDone(id) || this.#seen.has(id);
    const pieces = [];
    if (shown('ring')) pieces.push(view.pieces.ring);
    if (order.includes('head') && shown('head')) pieces.push(view.pieces.head);
    if (shown('lamp')) pieces.push(view.pieces.lamp, view.pieces.front);
    const photos = pieces.filter(Boolean);

    const nodes = [];
    if (photos.length) {
      const grid = document.createElement('div');
      grid.className = 'photos';
      for (const piece of photos) {
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        img.src = piece.src;
        img.alt = piece.label;
        img.loading = 'lazy';
        const caption = document.createElement('figcaption');
        caption.className = 'role-body-sm';
        caption.textContent = piece.label;
        figure.append(img, caption);
        grid.append(figure);
      }
      nodes.push(grid);
    } else {
      const hint = document.createElement('p');
      hint.className = 'hint role-body';
      hint.textContent = TEXT.hint;
      nodes.push(hint);
    }

    this.#result = null;
    if (!order.every((id) => this.#isDone(id))) return nodes;
    this.#result = view;

    const title = document.createElement('p');
    title.className = 'result-title role-heading-3';
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
    const print = document.createElement('arq-button');
    print.className = 'print';
    print.setAttribute('type', 'outline');
    print.textContent = TEXT.print;
    nodes.push(partsTitle, list, print);
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
      const link = document.createElement('arq-text-link');
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

  // «Imprimir configuración». PRUEBA: hoja simple para imprimir o guardar como
  // PDF. TODO: PDF armado con pdfmake y los estilos de la ficha técnica (src/pdf/).
  #print() {
    const view = this.#result;
    if (!view) return;
    this.emit('print', { title: view.title, parts: view.parts, specs: view.specs });
    const esc = (text) => String(text).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
    const photos = Object.values(view.pieces).filter(Boolean).map((p) => `<figure><img src="${esc(p.src)}" alt=""><figcaption>${esc(p.label)}</figcaption></figure>`).join('');
    const specs = view.specs.map(([k, v]) => `<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join('');
    const parts = view.parts.map((p) => `<tr><td>${p.qty}×</td><td>${esc(p.name)}</td><td>${esc(p.sku)}</td></tr>`).join('');
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`<!doctype html><meta charset="utf-8"><title>${esc(view.title)}</title><style>body{font-family:sans-serif;margin:32px;color:#101010}figure{display:inline-block;width:180px;margin:0 12px 12px 0}img{width:100%}figcaption{font-size:12px}table{border-collapse:collapse;margin:16px 0}td,th{padding:4px 16px 4px 0;text-align:left;font-size:14px}</style><h1>${esc(view.title)}</h1>${photos}<table>${specs}</table><table>${parts}</table>`);
    win.document.close();
    win.focus();
    win.print();
  }

  // ── Diálogo (como compare-picker) ──────────────────────────────────────
  #showDialog() {
    const dialog = this.#dialog;
    clearTimeout(this.#closing);
    this.#closing = null;
    if (!dialog.open) {
      dialog.showModal();
      void dialog.offsetHeight; // fija el estado inicial antes de is-open
      this.shadowRoot.querySelector('.close').focus({ preventScroll: true });
    }
    dialog.classList.add('is-open');
  }

  #closeDialog() {
    const dialog = this.#dialog;
    if (this.#closing || !dialog.open) return;
    dialog.classList.remove('is-open');
    const { transitionDuration } = getComputedStyle(this.shadowRoot.querySelector('.sheet'));
    const ms = Math.max(0, ...transitionDuration.split(',').map((value) => (parseFloat(value) || 0) * (value.trim().endsWith('ms') ? 1 : 1000)));
    this.#closing = setTimeout(() => {
      this.#closing = null;
      dialog.close();
      const opener = this.#opener;
      this.#opener = null;
      opener?.focus?.();
      this.emit('close', { restored: Boolean(opener) });
    }, ms);
  }

  #activeElement() {
    let active = document.activeElement;
    while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
    return active;
  }
}

ArqDaoConfigurator.define();

export { ArqDaoConfigurator };
