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

if (!window.Arq) {
  window.Arq = Object.freeze({ version });
}
