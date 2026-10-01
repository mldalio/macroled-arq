// Entrada de dist/arq.js.
// Registra los Web Components y expone un único global: window.Arq.

import './styles/global.css';
import { version } from '../package.json';

// Registro de componentes (uno por línea, cuando existan):
// import './components/<nombre>/<nombre>.js';
import './components/button/button.js';
import './components/count-badge/count-badge.js';
import './components/divider/divider.js';
import './components/logo/logo.js';
import './components/icon-button/icon-button.js';
import './components/breadcrumb-item/breadcrumb-item.js';
import './components/breadcrumb/breadcrumb.js';
import './components/footer-link/footer-link.js';
import './components/form-message/form-message.js';
import './components/form-section-header/form-section-header.js';
import './components/spec-row/spec-row.js';
import './components/filter-chip/filter-chip.js';
import './components/select-option/select-option.js';
import './components/gallery-thumb/gallery-thumb.js';
import './components/sku/sku.js';

if (!window.Arq) {
  window.Arq = Object.freeze({ version });
}
