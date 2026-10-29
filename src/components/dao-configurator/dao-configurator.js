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
// - Al elegir el aro quedan marcados su módulo y su color predeterminados (los
//   de la foto), con «Continuar» habilitado; lo mismo el color del cabezal.
// - Cabezales: uno por módulo. Con 2 o 3 módulos y más de un cabezal, cada uno
//   lleva su cantidad (− / +, de a uno) y su color, y se pueden combinar;
//   «Continuar» se habilita cuando suman los módulos. La foto no se repite:
//   lleva la cantidad.
// - Lámpara con frente (PAR11): un aviso de accesorios requeridos y el frente
//   se elige por su foto.
// - Siempre arranca en el aro, sin nada elegido y con el panel de la derecha
//   vacío: la pieza de la ficha desde donde se abre no se adelanta. Cada grupo
//   de opciones aparece cuando se eligió el anterior, «Continuar» se habilita
//   con todo lo del paso elegido y las fotos se suman a medida que se elige.
// - Al terminar el último paso queda el armado completo: fotos, especificaciones,
//   piezas y «Descargar configuración» (emite arq:configuration: main.js abre
//   el PDF en una pestaña nueva, src/pdf/configuracion.js).
// - Diálogo modal nativo, como compare-picker: foco adentro, Esc cierra, el foco
//   vuelve a quien lo abrió y la página de atrás no se desplaza. Siempre en Light.

import { ArqElement } from '../../base/arq-element.js';
import { containScroll } from '../../base/scroll-lock.js';
import { getDaoConfigurator, daoSelection, resolveDao } from '../../data/dao-config.js';
import '../icon-button/icon-button.js';
import '../option-group/option-group.js';
import '../option-tile/option-tile.js';
import '../swatch/swatch.js';
import '../sku/sku.js';
import '../button/button.js';
import '../text-link/text-link.js';
import '../count-badge/count-badge.js';
import { icon } from '../../base/icons.js';
import css from './dao-configurator.css?inline';

const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

const TEXT = {
  title: 'Armá tu Daö',
  loading: 'Cargando configurador…',
  empty: 'No hay piezas de Daö para armar.',
  error: 'No se pudo cargar el configurador. Probá de nuevo en unos minutos.',
  noHead: 'Este aro no lleva cabezal: la lámpara va directo al aro.',
  headsHint: 'Un cabezal por módulo, podés combinarlos.',
  headsCount: (n, qty) => `${n} de ${qty} elegidos`,
  add: (name) => `Sumar ${name}`,
  remove: (name) => `Quitar ${name}`,
  noLamp: 'No hay lámparas cargadas para este armado.',
  frontTitle: 'Accesorios requeridos',
  frontText: 'esta lámpara se instala con un frente y un panal antideslumbrante que se suman al armado.',
  next: 'Continuar',
  finish: 'Finalizar',
  change: 'Cambiar',
  back: 'Ver resumen',
  parts: 'Piezas para este armado',
  print: 'Descargar configuración',
  generating: 'Generando…',
};

const STEP_NAME = { ring: 'Aro', head: 'Cabezal', lamp: 'Lámpara' };
const STEP_OF = { group: 'ring', qty: 'ring', color: 'ring', head: 'head', headColor: 'head', lamp: 'lamp', lampBeam: 'lamp', front: 'lamp' };
// Qué se vuelve a elegir cuando cambia un grupo
const DEPENDENTS = {
  group: ['qty', 'color', 'head', 'headColor', 'lamp', 'front'],
  qty: ['color'],
  head: ['headColor', 'lamp', 'lampBeam', 'front'],
  lamp: ['lampBeam', 'front'],
  lampBeam: ['front'],
};
// Lo que queda elegido con su valor predeterminado al elegir un grupo: el aro
// trae un módulo y un color (los de su foto) y el cabezal, el color del aro.
const DEFAULTS = {
  group: ['qty', 'color'],
  qty: ['color'],
  head: ['headColor'],
  lamp: ['lampBeam'],
};

const sumCounts = (counts) => Object.values(counts ?? {}).reduce((total, count) => total + count, 0);

// Valor de un token de movimiento en ms («400ms», «0.4s»)
const durationOf = (element, name) => {
  const value = getComputedStyle(element).getPropertyValue(name).trim();
  return (parseFloat(value) || 0) * (value.endsWith('ms') ? 1 : 1000);
};

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
  #done = new Set(); // pasos confirmados con «Continuar»
  #chosen = new Set(); // grupos donde el usuario ya eligió (group, qty, color, head, headColor, lamp, front)
  #active = null; // paso abierto
  #editing = false; // con todo hecho: «Cambiar» vuelve a desplegar los tres pasos
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
      // Color de un cabezal (aro de varios módulos)
      if (key.startsWith('headColorBy:')) {
        const grupo = key.slice('headColorBy:'.length);
        this.#state.headColorBy = { ...this.#state.headColorBy, [grupo]: value };
        this.#render(`[data-step="${CSS.escape(key)}"] [value="${CSS.escape(String(value))}"]`);
        return;
      }
      // Lámpara: se elige el modelo (value es su nombre) y el ángulo, si tiene más
      // de uno; el estado guarda el SKU. Otro modelo conserva el ángulo si lo tiene.
      if (key === 'lamp' || key === 'lampBeam') {
        const view = resolveDao(this.#model, this.#state, this.#hrefs);
        if (key === 'lamp') {
          const rows = view.lamps.filter((item) => (item.nombre || item.sku) === value);
          this.#state.lamp = (rows.find((item) => item.haz === view.lamp?.haz) ?? rows[0])?.sku ?? null;
        } else this.#state.lamp = value;
        this.#choose(key);
        this.#render(`[data-step="${CSS.escape(key)}"] [value="${CSS.escape(String(value))}"]`);
        return;
      }
      // Otro aro (modelo): los cabezales se vuelven a elegir y arrancan en el color
      // del aro. Cambiar solo el color o los módulos no toca los ya elegidos.
      if (key === 'group') {
        this.#state.headColor = null;
        this.#state.headColorBy = null;
      }
      this.#state[key] = key === 'qty' ? Number(value) : value;
      // Un cabezal por módulo: elegir uno (aro de 1 módulo o un solo cabezal posible) los pone a todos
      if (key === 'head') this.#state.headCounts = null;
      this.#choose(key);
      this.#render(`[data-step="${CSS.escape(key)}"] [value="${CSS.escape(String(value))}"]`);
    });
    steps.addEventListener('click', (event) => {
      const print = event.target.closest?.('.print');
      if (print) return this.#print(print);
      // «Cambiar» del armado: vuelven los tres pasos plegados, cada uno con su
      // resumen; se abre el que se toque (toda la fila es clickeable)
      if (event.target.closest?.('.change-all')) {
        this.#editing = true;
        this.#active = null;
        this.#render();
        this.shadowRoot.querySelector('.step-toggle')?.focus({ preventScroll: true });
        return;
      }
      if (event.target.closest?.('.back')) {
        this.#editing = false;
        this.#render();
        return;
      }
      const counter = event.target.closest?.('[data-count]');
      if (counter) return this.#count(counter.dataset.head, counter.dataset.count === 'add');
      const next = event.target.closest?.('.next');
      const change = event.target.closest?.('.step-toggle');
      if (next) this.#advance();
      else if (change) {
        this.#active = change.closest('.step').dataset.section;
        this.#entering = this.#active;
        this.#render();
      }
    });
  }

  // Marca un grupo como elegido: lo que depende de él se vuelve a elegir y lo
  // que trae un valor predeterminado queda elegido con ese valor.
  #choose(key) {
    this.#chosen.add(key);
    for (const dependent of DEPENDENTS[key] ?? []) {
      this.#chosen.delete(dependent);
      this.#done.delete(STEP_OF[dependent]);
    }
    for (const preset of DEFAULTS[key] ?? []) this.#chosen.add(preset);
  }

  // − / + de un cabezal (aro de 2 o 3 módulos), de a uno. Sumar con todos los
  // módulos cubiertos pasa uno de otro cabezal a este.
  #count(grupo, add) {
    const view = resolveDao(this.#model, this.#state, this.#hrefs);
    if (!view) return;
    const counts = this.#chosen.has('head') ? { ...view.headCounts } : {};
    const total = sumCounts(counts);
    if (add) {
      if (total < view.qty) counts[grupo] = (counts[grupo] ?? 0) + 1;
      else {
        const [donor] = Object.entries(counts).filter(([id, count]) => id !== grupo && count > 0).sort((a, b) => b[1] - a[1])[0] ?? [];
        if (!donor) return;
        counts[donor] -= 1;
        counts[grupo] = (counts[grupo] ?? 0) + 1;
      }
    } else {
      if (!counts[grupo]) return;
      counts[grupo] -= 1;
    }
    for (const id of Object.keys(counts)) if (!counts[id]) delete counts[id];
    this.#state.headCounts = counts;
    this.#state.head = Object.keys(counts)[0] ?? this.#state.head;
    if (sumCounts(counts)) {
      if (!this.#chosen.has('head')) this.#choose('head');
    } else {
      this.#chosen.delete('head');
      this.#done.delete('head');
    }
    // El foco queda en el mismo botón; si quedó deshabilitado (0 o todos los módulos), en el otro
    const root = this.shadowRoot;
    const selector = (kind) => `[data-head="${CSS.escape(grupo)}"][data-count="${kind}"]`;
    this.#render(selector(add ? 'add' : 'remove'));
    if (root.querySelector(selector(add ? 'add' : 'remove'))?.disabled) root.querySelector(selector(add ? 'remove' : 'add'))?.focus({ preventScroll: true });
  }

  /** Abre el configurador desde la ficha del SKU. El foco vuelve a `opener` al cerrar. */
  async show(_sku, opener) {
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
    this.#state = daoSelection(this.#model, null);
    this.#done = new Set();
    this.#chosen = new Set();
    this.#active = null;
    this.#entering = null;
    this.#skus = {};
    this.#finalShown = false;
    this.shadowRoot.querySelector('.panel').replaceChildren();
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
    return this.#done.has(id);
  }

  #advance() {
    if (this.#active) this.#done.add(this.#active);
    this.#active = null;
    this.#editing = false;
    this.#render();
  }

  #render(focus) {
    let view = resolveDao(this.#model, this.#state, this.#hrefs);
    if (!view) return;
    // El color por cabezal es solo de un aro de varios módulos con cabezales
    // combinados; con uno solo manda el grupo Color (headColor)
    if (!this.#combined(view) && this.#state.headColorBy) {
      this.#state.headColorBy = null;
      view = resolveDao(this.#model, this.#state, this.#hrefs);
    }
    // Antes de elegir el cabezal, su color sigue al del aro; elegido, queda fijo
    // (cambiar el color del aro después no lo arrastra). Las cantidades de
    // cabezales, solo las que eligió el usuario (recortadas a los módulos).
    this.#state = {
      group: view.group.id,
      qty: view.qty,
      color: view.color,
      head: view.head?.grupo ?? null,
      headCounts: this.#state.headCounts ? view.headCounts : null,
      headColor: this.#chosen.has('head') ? view.headColor : (this.#state.headColor ?? null),
      headColorBy: this.#chosen.has('head') && this.#combined(view) ? { ...this.#state.headColorBy, ...Object.fromEntries(view.headParts.map(({ row }) => [row.grupo, row.color])) } : (this.#state.headColorBy ?? null),
      lamp: view.lamp?.sku ?? null,
      front: view.front?.sku ?? null,
    };

    // Si un cambio arrastró la elección de un paso posterior, hay que confirmarlo de nuevo
    const heads = view.headParts.map(({ row, qty }) => `${qty}×${row.sku}`).join(' ');
    const skus = { head: heads || null, lamp: view.lamp?.sku ?? null, front: view.front?.sku ?? null };
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
    const finished = order.every((id) => this.#isDone(id));
    if (!finished) this.#editing = false;
    let nodes;
    if (finished && !this.#editing) nodes = [this.#final(view, order)];
    else {
      this.#finalShown = false;
      this.#result = null;
      nodes = this.#steps(view, order);
      if (finished) nodes.push(this.#backToSummary());
    }
    root.querySelector('.steps').replaceChildren(...nodes);
    this.#panel(view, order);
    const entering = root.querySelector('.is-entering');
    if (entering) {
      entering.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'nearest' });
      this.#entering = null;
    }
    if (focus) root.querySelector(focus)?.focus({ preventScroll: true });
  }

  // ── Pasos ────────────────────────────────────────────────────────────
  #steps(view, order) {
    return order.map((id, index) => {
      const status = id === this.#active ? 'active' : this.#isDone(id) ? 'done' : 'future';
      const step = document.createElement('section');
      step.className = `step is-${status}`;
      if (id === this.#entering) step.classList.add('is-entering');
      step.dataset.section = id;

      // Un paso hecho es un solo botón en toda la fila (número, título, resumen y
      // «Cambiar»): se abre tocando cualquier parte, como un desplegable.
      // «Cambiar» queda como texto adentro (no un segundo botón).
      const done = status === 'done';
      const head = document.createElement(done ? 'button' : 'div');
      head.className = 'step-head';
      if (done) {
        head.type = 'button';
        head.classList.add('step-toggle');
        head.setAttribute('aria-label', `${TEXT.change}: ${STEP_NAME[id]}, ${this.#summary(view, id)}`);
      }
      const number = document.createElement('span');
      number.className = 'step-number role-body-xl';
      number.textContent = String(index + 1);
      const text = document.createElement('span');
      text.className = 'step-text';
      const name = document.createElement('span');
      name.className = 'step-title role-body-xl';
      name.textContent = STEP_NAME[id];
      text.append(name);
      if (done) {
        const summary = document.createElement('span');
        summary.className = 'summary role-body-compact';
        summary.textContent = this.#summary(view, id);
        text.append(summary);
      }
      head.append(number, text);
      if (done) {
        const change = document.createElement('span');
        change.className = 'change role-body-regular';
        change.textContent = TEXT.change;
        head.append(change);
      }
      step.append(head);

      if (status === 'active') {
        const body = document.createElement('div');
        body.className = 'step-body';
        const { nodes, ready } = this.#groups(view, id);
        body.append(...nodes);
        const next = document.createElement('arq-button');
        next.className = 'next';
        next.disabled = !ready;
        next.textContent = order.every((item) => item === id || this.#isDone(item)) ? TEXT.finish : TEXT.next;
        body.append(next);
        step.append(body);
      }
      return step;
    });
  }

  #summary(view, id) {
    if (id === 'ring') return view.title;
    if (id === 'head') return view.head ? this.#headNames(view) : '';
    const lamp = [view.lamp?.nombre || view.lamp?.sku, view.lamp?.haz].filter(Boolean).join(' · ');
    return view.fronts.length > 1 && view.front?.color ? `${lamp} · frente ${view.front.color.toLowerCase()}` : lamp;
  }

  // «Daö Cabezal negro» o, con varios módulos, «1× Daö Cabezal negro + 1× Daö Cabezal Direccionable blanco»
  #headNames(view) {
    const many = this.#combined(view);
    return view.headParts.map(({ row, qty }) => `${many ? `${qty}× ` : ''}${row.nombre || row.sku} ${(row.color || '').toLowerCase()}`.trim()).join(' + ');
  }

  // Aro de varios módulos con más de un cabezal posible: cantidades y color por cabezal
  #combined(view) {
    return view.qty > 1 && view.heads.length > 1;
  }

  // Los grupos de un paso, en orden: cada uno aparece cuando se eligió el anterior.
  // Un grupo con una sola opción se elige solo. ready: todo lo del paso está elegido.
  #groups(view, id) {
    const plan = [];
    const add = (key, label, selected, options, extra = {}) => plan.push({ key, label, selected, options, ...extra });
    const notes = [];
    if (id === 'ring') {
      add('group', 'Aro', view.group.id, view.groups.map((group) => ({ value: group.id, title: group.name })), { hideLabel: true });
      if (view.modulos.length > 1) add('qty', 'Módulos', String(view.qty), view.modulos.map((qty) => ({ value: String(qty), title: this.#model.moduleName(qty) })));
      add('color', 'Color', view.color ?? '', view.colors.map((color) => this.#colorOption(color, color)));
      if (!view.heads.length) notes.push(TEXT.noHead);
    } else if (id === 'head') {
      // Con varios módulos y más de un cabezal, cantidades (se pueden combinar)
      // (cada uno con su color, dentro de su caja)
      if (this.#combined(view)) plan.push({ key: 'head', node: () => this.#headCounter(view), ready: () => this.#chosen.has('head') && sumCounts(view.headCounts) === view.qty });
      else {
        add('head', 'Cabezal', view.head?.grupo ?? '', view.heads.map((item) => ({ value: item.grupo, title: item.nombre || item.sku, meta: item.orientacion })), { hideLabel: true });
        if (view.headColors.length > 1) add('headColor', 'Color', view.headColor ?? '', view.headColors.map((color) => this.#colorOption(color, color)));
      }
    } else {
      // Una opción por modelo (las que solo cambian el ángulo, como PAR11 Dim to
      // warm 24° y 12°, son una) y el ángulo debajo, como los módulos del aro. La
      // lámpara que lleva frente lo dice el aviso de accesorios requeridos.
      if (view.lamps.length) {
        const models = new Map();
        for (const item of view.lamps) {
          const name = item.nombre || item.sku;
          if (!models.has(name)) models.set(name, []);
          models.get(name).push(item);
        }
        add('lamp', 'Lámpara', view.lamp ? view.lamp.nombre || view.lamp.sku : '', [...models].map(([name, rows]) => ({
          value: name,
          title: name,
          meta: [rows.length === 1 ? rows[0].haz : '', rows[0].luz].filter(Boolean).join(' · '),
        })), { hideLabel: true });
        const beams = models.get(view.lamp?.nombre || view.lamp?.sku) ?? [];
        if (beams.length > 1) add('lampBeam', 'Ángulo', view.lamp.sku, beams.map((item) => ({ value: item.sku, title: item.haz || item.sku })));
      } else notes.push(TEXT.noLamp);
      // Frente (PAR11): el aviso de accesorios requeridos arriba y el frente por su foto
      if (view.fronts.length) {
        plan.push({ key: 'notice', node: () => this.#notice(TEXT.frontTitle, TEXT.frontText), ready: () => true });
        // El frente siempre va: lo que se elige es su color
        add('front', 'Color del frente', view.front?.sku ?? '', view.fronts.map((front) => ({ value: front.sku, title: front.color || front.nombre || front.sku, image: front.img })));
      }
    }

    const nodes = [];
    let ready = true;
    for (const item of plan) {
      if (!ready) break; // el grupo anterior todavía no se eligió
      if (item.node) {
        nodes.push(item.node());
        ready = item.ready();
        continue;
      }
      if (item.options.length === 1) this.#chosen.add(item.key);
      nodes.push(this.#cards(item.key, item.label, this.#chosen.has(item.key) ? item.selected : null, item.options, { hideLabel: item.hideLabel }));
      ready = this.#chosen.has(item.key);
    }
    if (ready) nodes.push(...notes.map((text) => this.#note(text)));
    return { nodes, ready };
  }

  // Cabezales de un aro de 2 o 3 módulos: una caja por cabezal con su cantidad
  // (− / +). La caja con cantidad lleva el borde de la elegida y el número en
  // count-badge, como la foto.
  #headCounter(view) {
    const counts = this.#chosen.has('head') ? view.headCounts : {};
    const total = sumCounts(counts);
    const group = document.createElement('div');
    group.className = 'counter';
    group.setAttribute('role', 'group');
    group.setAttribute('aria-label', 'Cabezales');
    // La ayuda a la izquierda y la cuenta («1 de 2 elegidos») en la punta opuesta
    const hint = document.createElement('div');
    hint.className = 'counter-hint role-body-compact';
    const text = document.createElement('p');
    text.textContent = TEXT.headsHint;
    const tally = document.createElement('p');
    tally.className = 'counter-tally';
    tally.classList.toggle('is-complete', total === view.qty);
    tally.setAttribute('role', 'status');
    tally.textContent = TEXT.headsCount(total, view.qty);
    hint.append(text, tally);
    group.append(hint);
    for (const item of view.heads) {
      const count = counts[item.grupo] ?? 0;
      const name = item.nombre || item.sku;
      const row = document.createElement('div');
      row.className = 'count-row';
      row.classList.toggle('is-selected', count > 0);
      const text = document.createElement('span');
      text.className = 'count-text';
      const title = document.createElement('span');
      title.className = 'role-body-regular';
      title.textContent = name;
      text.append(title);
      if (item.orientacion) {
        const meta = document.createElement('span');
        meta.className = 'count-meta role-body-compact';
        meta.textContent = item.orientacion;
        text.append(meta);
      }
      const stepper = document.createElement('span');
      stepper.className = 'stepper';
      const button = (kind, iconName, label, disabled) => {
        const control = document.createElement('arq-icon-button');
        control.icon = iconName;
        control.background = 'outline';
        control.dataset.head = item.grupo;
        control.dataset.count = kind;
        control.disabled = disabled;
        control.textContent = label;
        return control;
      };
      const value = document.createElement('span');
      value.className = 'count-value role-body-medium';
      value.textContent = String(count);
      stepper.append(button('remove', 'minus', TEXT.remove(name), !count), value, button('add', 'plus', TEXT.add(name), count >= view.qty));
      row.append(text, stepper);
      // Elegido: su color, dentro de la caja (de entrada, el del aro)
      const colors = view.headColorsBy[item.grupo] ?? [];
      if (count > 0 && colors.length > 1) {
        const color = view.headParts.find((part) => part.row.grupo === item.grupo)?.row.color ?? '';
        const picker = this.#cards(`headColorBy:${item.grupo}`, `Color de ${name}`, color, colors.map((option) => this.#colorOption(option, option)), { hideLabel: true });
        picker.classList.add('count-colors');
        row.append(picker);
      }
      group.append(row);
    }
    return group;
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
      if (option.image) {
        const img = document.createElement('img');
        img.slot = 'media';
        img.src = option.image;
        img.alt = '';
        img.loading = 'lazy';
        tile.append(img);
      }
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

  // Aviso de accesorios requeridos: ícono alert en color/text/warning y una línea
  // («Accesorios requeridos:» en medium y el texto), sin caja
  #notice(title, text) {
    const notice = document.createElement('p');
    notice.className = 'notice role-body-compact';
    notice.setAttribute('role', 'note');
    notice.innerHTML = icon('alert');
    const copy = document.createElement('span');
    const heading = document.createElement('span');
    heading.className = 'notice-title role-body-compact-medium';
    heading.textContent = `${title}: `;
    copy.append(heading, text);
    notice.append(copy);
    return notice;
  }

  #note(text) {
    const note = document.createElement('p');
    note.className = 'note role-body';
    note.textContent = text;
    return note;
  }

  // ── Panel: las fotos se suman a medida que se eligen ───────────────────
  // Las tarjetas se reutilizan (una por pieza): solo entra la nueva, una foto
  // que cambia (otro color) se funde sobre la anterior y las que cambian de
  // lugar se deslizan hasta el nuevo (FLIP, solo transform). Cada foto aparece
  // recién cuando cargó. Un cabezal que va en más de un módulo lleva su
  // cantidad en un count-badge al principio del epígrafe (la foto no se repite).
  #panel(view, order) {
    const has = (key) => this.#chosen.has(key);
    const pieces = [];
    const push = (key, piece) => piece && pieces.push({ ...piece, key });
    if (has('group')) push('ring', view.pieces.ring);
    if (order.includes('head') && has('head')) {
      for (const head of view.pieces.heads) push(`head:${head.key}`, { ...head, qty: view.qty > 1 ? head.qty : 0 });
    }
    if (has('lamp')) push('lamp', view.pieces.lamp);
    if (has('front') || (has('lamp') && view.fronts.length === 1)) push('front', view.pieces.front);

    const panel = this.shadowRoot.querySelector('.panel');
    let grid = panel.querySelector('.photos');
    if (!pieces.length) {
      panel.replaceChildren();
      return;
    }
    if (!grid) {
      grid = document.createElement('div');
      grid.className = 'photos';
      panel.replaceChildren(grid);
    }
    const motion = !reducedMotion() && this.#dialog.open;
    const current = new Map([...grid.children].map((figure) => [figure.dataset.key, figure]));
    const before = new Map(motion ? [...current].map(([key, figure]) => [key, figure.getBoundingClientRect()]) : []);

    grid.style.setProperty('--cols', pieces.length === 1 ? '1' : '2');
    grid.style.setProperty('--rows', String(Math.ceil(pieces.length / 2)));
    const figures = pieces.map((piece) => {
      const figure = current.get(piece.key) ?? this.#figure(piece.key);
      this.#fill(figure, piece, motion);
      return figure;
    });
    // Mover un nodo que ya está reinicia sus transiciones: solo si cambia el orden
    if (figures.length !== grid.children.length || figures.some((figure, index) => grid.children[index] !== figure)) grid.replaceChildren(...figures);

    if (!motion) return;
    const duration = durationOf(this, '--arq-motion-duration-panel');
    const easing = getComputedStyle(this).getPropertyValue('--arq-motion-easing-standard').trim() || 'ease';
    for (const figure of figures) {
      const from = before.get(figure.dataset.key);
      if (!from) continue;
      const to = figure.getBoundingClientRect();
      if (!to.width || !to.height) continue;
      const scale = Math.min(from.width / to.width, from.height / to.height);
      const x = from.left + from.width / 2 - (to.left + to.width / 2);
      const y = from.top + from.height / 2 - (to.top + to.height / 2);
      if (Math.abs(x) < 1 && Math.abs(y) < 1 && Math.abs(scale - 1) < 0.01) continue;
      figure.animate([{ transform: `translate(${x}px, ${y}px) scale(${scale})` }, { transform: 'none' }], { duration, easing });
    }
  }

  #figure(key) {
    const figure = document.createElement('figure');
    figure.dataset.key = key;
    figure.className = 'is-new';
    const media = document.createElement('div');
    media.className = 'media';
    const badge = document.createElement('arq-count-badge');
    badge.className = 'badge';
    const caption = document.createElement('figcaption');
    caption.className = 'role-body-sm';
    const text = document.createElement('span');
    text.className = 'caption-text';
    caption.append(badge, text);
    figure.append(media, caption);
    return figure;
  }

  // Foto, cantidad y nombre de una tarjeta. Una foto nueva entra fundida sobre la
  // anterior cuando terminó de cargar; la anterior se funde a la vez y se quita
  // al terminar. Con la foto en caché, el fundido espera un cuadro (si no, no
  // hay transición).
  #fill(figure, piece, motion) {
    const media = figure.querySelector('.media');
    const label = piece.qty ? `${piece.qty} × ${piece.label}` : piece.label;
    let img = media.querySelector('img');
    if (img?.dataset.src !== piece.src) {
      const next = document.createElement('img');
      next.dataset.src = piece.src;
      next.decoding = 'async';
      const ready = () => {
        if (!next.isConnected) return;
        for (const old of media.querySelectorAll('img')) {
          if (old === next || old.classList.contains('is-leaving')) continue;
          old.classList.add('is-leaving');
          old.alt = '';
          if (motion) setTimeout(() => old.remove(), durationOf(this, '--arq-motion-duration-slow'));
          else old.remove();
        }
        next.classList.add('is-loaded');
        figure.classList.remove('is-new');
      };
      const settle = () => (motion ? requestAnimationFrame(() => requestAnimationFrame(ready)) : ready());
      next.addEventListener('load', settle, { once: true });
      next.addEventListener('error', settle, { once: true });
      next.src = piece.src;
      media.prepend(next);
      img = next;
    }
    img.alt = label;
    const badge = figure.querySelector('.badge');
    if (motion && piece.qty && badge.count && badge.count !== piece.qty) {
      badge.animate([{ transform: 'scale(1.25)' }, { transform: 'none' }], { duration: durationOf(this, '--arq-motion-duration-base'), easing: 'ease-out' });
    }
    badge.count = piece.qty || null;
    // Con cantidad, el número lo dice el badge: el texto sigue con «× …»
    figure.querySelector('.caption-text').textContent = piece.qty ? `× ${piece.label}` : piece.label;
  }

  #backToSummary() {
    const back = document.createElement('arq-button');
    back.className = 'back';
    back.setAttribute('type', 'underline');
    back.setAttribute('show-underline', '');
    back.textContent = TEXT.back;
    return back;
  }

  // Al terminar el último paso, el armado completo reemplaza a los pasos
  // (columna izquierda, que ya se desplaza): el título compuesto con «Cambiar»
  // al lado (vuelve a desplegar los pasos), especificaciones, piezas y
  // «Descargar configuración». El panel de la derecha sigue solo con las fotos.
  #final(view, order) {
    this.#result = view;
    const section = document.createElement('section');
    section.className = 'final';
    if (!this.#finalShown) section.classList.add('is-entering');
    this.#finalShown = true;

    const head = document.createElement('div');
    head.className = 'result-head';
    const title = document.createElement('p');
    title.className = 'result-title role-heading-3';
    title.textContent = this.#resultTitle(view);
    const change = document.createElement('arq-button');
    change.className = 'change-all';
    change.setAttribute('type', 'underline');
    change.setAttribute('show-underline', '');
    change.textContent = TEXT.change;
    change.setAttribute('label', `${TEXT.change}: configuración`);
    head.append(title, change);
    // Tres bloques: el armado (título y especificaciones), la descarga y las
    // piezas (título y lista). En Desktop la descarga va al final; en Mobile,
    // debajo de las especificaciones, para que se vea sin desplazar (CSS order).
    const summary = document.createElement('div');
    summary.className = 'result-block result-summary';
    summary.append(head);
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
      summary.append(specs);
    }
    const partsTitle = document.createElement('p');
    partsTitle.className = 'parts-title role-body-medium';
    partsTitle.textContent = TEXT.parts;
    const list = document.createElement('ul');
    list.className = 'parts';
    for (const part of view.parts) list.append(this.#part(part));
    const parts = document.createElement('div');
    parts.className = 'result-block result-parts';
    parts.append(partsTitle, list);
    const print = document.createElement('arq-button');
    print.className = 'print';
    print.loadingLabel = TEXT.generating;
    print.textContent = TEXT.print;
    section.append(summary, parts, print);
    return section;
  }

  #finalShown = false;

  // Título del armado, como una frase: el modelo de aro es el único nombre propio
  // (con mayúsculas) y lo demás va en minúscula, sin repetir «Daö»: «Mini Daö
  // Trimless x3 negro con cabezal blanco», «Daö x2 negro con cabezal negro y
  // cabezal direccionable blanco». El color del cabezal va siempre; las
  // cantidades, no (están en Piezas).
  #resultTitle(view) {
    const heads = view.headParts.map(({ row }) => {
      const name = row.nombre || row.sku;
      const at = name.search(/cabezal/i);
      return `${(at >= 0 ? name.slice(at) : name).toLowerCase()} ${(row.color || '').toLowerCase()}`.trim();
    });
    if (!heads.length) return view.title;
    const list = heads.length > 1 ? `${heads.slice(0, -1).join(', ')} y ${heads.at(-1)}` : heads[0];
    return `${view.title} con ${list}`;
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

  // «Descargar configuración»: el PDF lo genera src/pdf/configuracion.js (lo
  // engancha main.js con arq:configuration) y lo abre en una pestaña nueva,
  // como la ficha técnica. Mientras tanto el botón queda en Loading.
  #print(button) {
    const view = this.#result;
    if (!view || button?.loading) return;
    const { ring, heads, lamp, front } = view.pieces;
    const many = view.qty > 1;
    const detail = {
      title: this.#resultTitle(view),
      pieces: [ring, ...heads.map((head) => ({ ...head, qty: many ? head.qty : 0 })), lamp, front].filter(Boolean).map(({ src, label, qty }) => ({ src, label, qty: qty || 0 })),
      specs: view.specs,
      parts: view.parts,
    };
    this.emit('configuration', detail);
    if (!detail.pending || !button) return;
    button.loading = true;
    const done = () => (button.loading = false);
    detail.pending.then(done, done);
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
