// Entrada de dist/arq.js.
// Registra los Web Components y expone un único global: window.Arq.

import './styles/global.css';
import { version } from '../package.json';
import { openDatasheet } from './pdf/ficha-tecnica.js';

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
import './components/spec-row/spec-row.js';
import './components/spec-list/spec-list.js';
import './components/accordion-item/accordion-item.js';
import './components/filter-chip/filter-chip.js';
import './components/select-option/select-option.js';
import './components/select-menu/select-menu.js';
import './components/select/select.js';
import './components/filter-bar/filter-bar.js';
import './components/variants-table/variants-table.js';
import './components/gallery-thumb/gallery-thumb.js';
import './components/product-gallery/product-gallery.js';
import './components/family-card/family-card.js';
import './components/download-item/download-item.js';
import './components/download-modal/download-modal.js';
import './components/catalog-nav-item/catalog-nav-item.js';
import './components/catalog-nav-group/catalog-nav-group.js';
import './components/catalog-nav/catalog-nav.js';
import './components/filter-row/filter-row.js';
import './components/filter-panel/filter-panel.js';
import './components/catalog-toolbar/catalog-toolbar.js';
import './components/product-card/product-card.js';
import './components/compare-slot/compare-slot.js';
import './components/compare-bar/compare-bar.js';
import './components/compare-product/compare-product.js';
import './components/compare-header/compare-header.js';
import './components/compare-table/compare-table.js';
import './components/comparativa/comparativa.js';
import './components/mega-link/mega-link.js';
import './components/mega-menu/mega-menu.js';
import './components/search-field/search-field.js';
import './components/search-result/search-result.js';
import './components/search-see-all/search-see-all.js';
import './components/search-dropdown/search-dropdown.js';
import './components/search-screen/search-screen.js';
import './components/navbar/navbar.js';
import './components/contact-item/contact-item.js';
import './components/link-list/link-list.js';
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
import './components/section/section.js';
import './components/grid/grid.js';
import './components/project-mosaic/project-mosaic.js';
import './components/featured-products/featured-products.js';
import './components/catalog-listing/catalog-listing.js';
import './components/ficha-producto/ficha-producto.js';
import './components/coleccion/coleccion.js';
import './components/descargas/descargas.js';
import './components/form-contacto/form-contacto.js';

// Ficha técnica en PDF: la piden la ficha de producto y Descargas con
// arq:datasheet { sku }. Se abre en una pestaña nueva: el evento llega dentro
// del clic, así que el navegador no la bloquea. La promesa queda en
// event.detail.pending para que quien la pidió muestre el botón en Loading.
// TODO (diseño): no hay mensaje de error; hoy el error queda en consola.
document.addEventListener('arq:datasheet', (event) => {
  const sku = event.detail?.sku;
  if (!sku) return;
  const pending = openDatasheet(sku);
  event.detail.pending = pending;
  pending.catch((error) => console.error('[arq] ficha técnica:', error));
});

// Imprimir la página (comparativa: "Imprimir comparación", como
// macroled.com.ar/comparativa). Cada componente trae su @media print.
document.addEventListener('click', (event) => {
  if (event.target.closest?.('[data-arq-print]')) window.print();
});

if (!window.Arq) {
  window.Arq = Object.freeze({ version });
}
