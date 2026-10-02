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
import './components/spec-list/spec-list.js';
import './components/accordion-item/accordion-item.js';
import './components/filter-chip/filter-chip.js';
import './components/select-option/select-option.js';
import './components/gallery-thumb/gallery-thumb.js';
import './components/product-gallery/product-gallery.js';
import './components/catalog-nav-item/catalog-nav-item.js';
import './components/catalog-nav-group/catalog-nav-group.js';
import './components/catalog-nav/catalog-nav.js';
import './components/filter-row/filter-row.js';
import './components/filter-panel/filter-panel.js';
import './components/catalog-toolbar/catalog-toolbar.js';
import './components/sku/sku.js';
import './components/swatch/swatch.js';
import './components/option-tile/option-tile.js';
import './components/swatch-picker/swatch-picker.js';
import './components/option-group/option-group.js';
import './components/choice-chip/choice-chip.js';
import './components/tab/tab.js';
import './components/checkbox/checkbox.js';
import './components/toggle/toggle.js';
import './components/input/input.js';
import './components/file-upload/file-upload.js';
import './components/nav-link/nav-link.js';
import './components/section-header/section-header.js';
import './components/page-header/page-header.js';
import './components/faq-item/faq-item.js';
import './components/footer/footer.js';
import './components/hero/hero.js';
import './components/cta-block/cta-block.js';
import './components/carousel-controls/carousel-controls.js';
import './components/category-card/category-card.js';
import './components/line-card/line-card.js';
import './components/feature-block/feature-block.js';

if (!window.Arq) {
  window.Arq = Object.freeze({ version });
}
