// mega-menu · Figma 841:2282 · ficha doc/mega-menu (1446:7723)
//
// Mega menú de Productos (desktop). Lo abre el nav-link "Productos" del
// navbar y va debajo de la barra, a todo el ancho.
//
//   <arq-mega-menu></arq-mega-menu>
//   menu.navigation = await getNavigation();   // src/data/catalog.js
//
// - Un solo componente: pestañas, columnas, links y "Ver todo…" salen de los
//   datos (descripción del set). Tres pestañas: Aplicación (Exterior ·
//   Interior), Lámparas y artefactos, y Colecciones (tres columnas de
//   mega-link con bajada). Una pestaña sin columnas no se muestra.
// - Tab es la prop tab (aplicacion · lamparas · colecciones). Tablist con
//   tab + SingleSelect: ← → cambian de pestaña, Inicio / Fin.
// - Imagen a la derecha: ancho layout/mega-menu-image y ratio/portrait-soft;
//   puede cambiar por pestaña (prop images). Sin imagen, color/surface/subtle.
//   TODO (datos): de dónde salen las imágenes de cada pestaña.
// - El panel no se abre ni se cierra solo: lo muestra el navbar (atributo
//   hidden en el host).

import { ArqElement } from '../../base/arq-element.js';
import { SingleSelect } from '../../base/single-select.js';
import '../tab/tab.js';
import '../mega-link/mega-link.js';
import '../button/button.js';
import css from './mega-menu.css?inline';

const esc = (text) => String(text ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const TABS = [
  { id: 'aplicacion', label: 'Aplicación' },
  { id: 'lamparas', label: 'Lámparas y artefactos' },
  { id: 'colecciones', label: 'Colecciones' },
];
const COLLECTION_COLUMNS = 3;
let uid = 0;

class ArqMegaMenu extends ArqElement {
  static tag = 'arq-mega-menu';
  static styles = css;
  static properties = {
    tab: { type: String, values: TABS.map((t) => t.id), default: 'aplicacion' }, // Tab
    label: { type: String, default: 'Productos' }, // nombre del tablist
  };
  static template =
    `<div class="menu">` +
    `<div class="tabs" role="tablist"></div>` +
    `<div class="body">` +
    `<div class="panels"></div>` +
    `<div class="image"><img alt="" hidden></div>` +
    `</div>` +
    `</div>`;

  #navigation = null;
  #images = {};
  #id = ++uid;

  /** Árbol de navegación de src/data/catalog.js (getNavigation). */
  get navigation() {
    return this.#navigation;
  }

  set navigation(value) {
    this.#navigation = value;
    if (this.shadowRoot.querySelector('.tabs')) this.#render();
  }

  /** Imagen por pestaña: { aplicacion: url, lamparas: url, colecciones: url }. */
  get images() {
    return this.#images;
  }

  set images(value) {
    this.#images = value ?? {};
    this.#syncImage();
  }

  setup() {
    const root = this.shadowRoot;
    const tabs = root.querySelector('.tabs');
    this.select = new SingleSelect(tabs, { items: 'arq-tab' });
    tabs.addEventListener('arq:change', (event) => {
      event.stopPropagation();
      this.tab = event.detail.value;
    });
    const img = root.querySelector('img');
    img.addEventListener('load', () => (img.hidden = false));
    img.addEventListener('error', () => (img.hidden = true));
    this.#render();
  }

  update(changed) {
    const root = this.shadowRoot;
    if (changed.has('label')) root.querySelector('.tabs').setAttribute('aria-label', this.label ?? '');
    if (changed.has('tab')) {
      for (const tab of root.querySelectorAll('arq-tab')) tab.selected = tab.value === this.tab;
      for (const panel of root.querySelectorAll('[role="tabpanel"]')) panel.hidden = panel.dataset.tab !== this.tab;
      this.#syncImage();
    }
  }

  #columns(tab) {
    const s = this.#navigation?.sections ?? {};
    if (tab === 'aplicacion') return [s.exterior, s.interior].filter(Boolean);
    if (tab === 'lamparas') return [s.lamparas, s.artefactos].filter(Boolean);
    return [];
  }

  #render() {
    const root = this.shadowRoot;
    const nav = this.#navigation;
    const available = TABS.filter((t) => (t.id === 'colecciones' ? nav?.collections?.length : this.#columns(t.id).length));
    if (available.length && !available.some((t) => t.id === this.tab)) this.tab = available[0].id;
    const ids = (t) => ({ tab: `mega-tab-${this.#id}-${t.id}`, panel: `mega-panel-${this.#id}-${t.id}` });
    root.querySelector('.tabs').innerHTML = available
      .map((t) => `<arq-tab id="${ids(t).tab}" value="${t.id}" aria-controls="${ids(t).panel}"${t.id === this.tab ? ' selected' : ''}>${esc(t.label)}</arq-tab>`)
      .join('');
    root.querySelector('.panels').innerHTML = available
      .map((t) => {
        const content = t.id === 'colecciones' ? this.#collections(nav) : this.#sectionColumns(this.#columns(t.id));
        return `<div class="panel panel--${t.id}" role="tabpanel" id="${ids(t).panel}" aria-labelledby="${ids(t).tab}" data-tab="${t.id}"${t.id === this.tab ? '' : ' hidden'}>${content}</div>`;
      })
      .join('');
    this.select.refresh();
    this.#syncImage();
  }

  // Aplicación y Lámparas y artefactos: una columna por sección, con título
  // (role/heading-3), links y "Ver todo…" al pie.
  #sectionColumns(sections) {
    return (
      `<div class="columns">` +
      sections
        .map(
          (section) =>
            `<div class="column">` +
            `<div class="top"><p class="title role-heading-3">${esc(section.label)}</p>` +
            `<div class="links">${section.links.map((l) => `<arq-mega-link href="${esc(l.href)}" show-arrow>${esc(l.label)}</arq-mega-link>`).join('')}</div></div>` +
            `<arq-button type="underline" show-underline href="${esc(section.all.href)}">${esc(section.all.label)}</arq-button>` +
            `</div>`,
        )
        .join('') +
      `</div>`
    );
  }

  // Colecciones: un título, los links repartidos en tres columnas (con la
  // bajada de aplicaciones) y un solo "Ver todas las colecciones".
  #collections(nav) {
    const list = nav?.collections ?? [];
    const size = Math.ceil(list.length / COLLECTION_COLUMNS);
    const columns = Array.from({ length: COLLECTION_COLUMNS }, (_, i) => list.slice(i * size, (i + 1) * size));
    return (
      `<p class="title role-heading-3">Colecciones</p>` +
      `<div class="columns">` +
      columns
        .map(
          (items) =>
            `<div class="links column">${items
              .map((c) => `<arq-mega-link href="${esc(c.href)}" show-arrow>${esc(c.label)}<span slot="meta">${esc(c.meta)}</span></arq-mega-link>`)
              .join('')}</div>`,
        )
        .join('') +
      `</div>` +
      `<arq-button class="all" type="underline" show-underline href="${esc(nav?.allCollections?.href)}">${esc(nav?.allCollections?.label)}</arq-button>`
    );
  }

  #syncImage() {
    const img = this.shadowRoot.querySelector('img');
    const src = this.#images[this.tab];
    if (src) img.src = src;
    else {
      img.removeAttribute('src');
      img.hidden = true;
    }
  }
}

ArqMegaMenu.define();

export { ArqMegaMenu };
