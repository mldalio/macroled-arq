// logo · Figma 751:4307 · ficha doc/logo (1440:3214)
//
// Logotipo de Macroled Arq. Siempre es link a la home de Arq.
//
//   <arq-logo></arq-logo>                     Size=Default (navbar desktop)
//   <arq-logo size="small"></arq-logo>        Size=Small (navbar mobile)
//   <arq-logo size="compact"></arq-logo>      Size=Compact (footer y espacios reducidos)
//
// El color es currentColor = color/text/primary: se invierte solo en modo Dark.
// TODO (navbar): sobre el hero (navbar Theme=Transparent) toma el color
// inverso; se define al construir el navbar (puede pisar `color` del elemento).

import { ArqElement } from '../../base/arq-element.js';
import { LOGO_PATHS } from '../../base/logo-paths.js';
import css from './logo.css?inline';

const ACCESSIBLE_NAME = 'Macroled Arq, inicio';

const svg =
  `<svg class="mark" viewBox="0 0 181 16" fill="currentColor" aria-hidden="true" focusable="false">` +
  LOGO_PATHS.map((d) => `<path d="${d}"/>`).join('') +
  `</svg>`;

class ArqLogo extends ArqElement {
  static tag = 'arq-logo';
  static styles = css;
  static properties = {
    size: { type: String, values: ['default', 'small', 'compact'], default: 'default' }, // Size
    href: { type: String, default: '/arq' },
  };
  static template = `<a class="link" aria-label="${ACCESSIBLE_NAME}">${svg}</a>`;

  update(changed) {
    if (changed.has('href')) this.shadowRoot.querySelector('.link').setAttribute('href', this.href);
  }
}

ArqLogo.define();

export { ArqLogo };
