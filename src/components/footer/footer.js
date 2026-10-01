// footer · Figma 788:3104 · ficha doc/footer (1442:4213)
//
// Footer de Macroled Arq, último elemento de todas las páginas, full width.
// Marca (logo + bajada + legal) y tres columnas de links: Productos,
// Información y Redes.
//
//   <arq-footer>
//     <span slot="tagline">Diseño lumínico para la arquitectura contemporánea.</span>
//     <h2 slot="productos-title">Productos</h2>
//     <arq-footer-link slot="productos" href="/arq/productos/interior">Interior</arq-footer-link>
//     <arq-footer-link slot="informacion" href="/arq/contacto">Contacto</arq-footer-link>
//     <arq-footer-link slot="redes" href="https://www.instagram.com/…" target="_blank"
//       show-icon icon="instagram" label="Macroled Arq en Instagram">Instagram</arq-footer-link>
//   </arq-footer>
//
// La bajada, los títulos de columna (<h2 slot="<columna>-title">, AGENTS.md:
// los encabezados van en el HTML) y los links llegan por slot. El logo y el
// legal están en el componente: el año sale de new Date().getFullYear(). Cada
// columna es un <nav> nombrado con el texto de su <h2> y una lista
// (role="list"; cada footer-link es un listitem).
//
// Breakpoint no es prop: en Mobile se apilan marca, columnas y legal.
// Aplica su propio layout/gutter (componente de borde a borde).

import { ArqElement } from '../../base/arq-element.js';
import '../logo/logo.js';
import '../footer-link/footer-link.js';
import css from './footer.css?inline';

const COLUMNS = ['productos', 'informacion', 'redes'];

class ArqFooter extends ArqElement {
  static tag = 'arq-footer';
  static styles = css;
  static template =
    `<footer class="footer">` +
    `<div class="brand">` +
    `<arq-logo size="compact"></arq-logo>` +
    `<p class="tagline role-body"><slot name="tagline"></slot></p>` +
    `</div>` +
    `<div class="columns">` +
    COLUMNS.map(
      (slot) =>
        `<nav class="column" data-column="${slot}">` +
        `<div class="title role-body-strong"><slot name="${slot}-title"></slot></div>` +
        `<div class="list" role="list"><slot name="${slot}"></slot></div>` +
        `</nav>`,
    ).join('') +
    `</div>` +
    `<p class="legal role-body-sm">© <span class="year"></span> Macroled Arq.</p>` +
    `</footer>`;

  setup() {
    const root = this.shadowRoot;
    root.querySelector('.year').textContent = String(new Date().getFullYear());

    // Sin bajada, el párrafo no ocupa lugar (ni suma el gap de la marca)
    const tagline = root.querySelector('slot[name="tagline"]');
    const syncTagline = () => {
      root.querySelector('.tagline').hidden = !tagline
        .assignedNodes({ flatten: true })
        .some((node) => node.textContent.trim());
    };
    tagline.addEventListener('slotchange', syncTagline);
    syncTagline();

    // Nombre de cada <nav>: el texto de su <h2>. aria-labelledby no sirve
    // porque el <h2> está en el DOM de la página y el <nav> en el Shadow DOM.
    for (const column of COLUMNS) {
      const nav = root.querySelector(`[data-column="${column}"]`);
      const title = root.querySelector(`slot[name="${column}-title"]`);
      const syncName = () => {
        const text = title
          .assignedNodes({ flatten: true })
          .map((node) => node.textContent)
          .join(' ')
          .trim();
        if (text) nav.setAttribute('aria-label', text);
        else nav.removeAttribute('aria-label');
      };
      title.addEventListener('slotchange', syncName);
      syncName();
    }
  }
}

ArqFooter.define();

export { ArqFooter };
