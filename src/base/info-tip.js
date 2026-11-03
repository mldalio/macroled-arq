// info-tip · el ⓘ de las características, como en las fichas de macroled.com.ar:
// una etiqueta con un ícono que abre una burbuja con el nombre y qué significa.
// Lo usan las especificaciones y los datos clave de la ficha (la tabla de
// variantes, en la ficha y en Descargas, no). Estilos en info-tip.css, que el
// componente suma a los suyos (static styles).
//
//   const button = infoTip({ label: 'CRI', help: fieldHelp('cri') });  // etiqueta + ⓘ
//   infoTipHtml({ title: 'Flujo luminoso', help })                      // solo el ⓘ (string)
//   bindInfoTips(this.shadowRoot);                                       // una vez, en setup()
//
// - Con mouse aparece al pasar por encima (espera motion/duration/base la
//   primera vez; de un ⓘ a otro, sin espera) y se va al salir.
// - Clic o toque: la abre y queda abierta hasta otro toque, Esc, un toque afuera
//   o el scroll. Con teclado, también al enfocar el botón.
// - Va arriba de la etiqueta, con una flecha que la señala; si no entra, abajo.
//   Nunca se sale de la pantalla. Es un popover (capa superior): no la recorta
//   ningún contenedor con scroll.
//
// TODO (diseño): no está en Figma (ni el ícono info, ni la burbuja).

import { icon } from './icons.js';
import { tokenMs } from './motion.js';

const esc = (text) => String(text ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const MORE = 'más información';

/**
 * El botón como HTML (para templates armados con strings). Con `label`, la
 * etiqueta y el ⓘ son el botón; sin `label`, solo el ⓘ (cuando la etiqueta ya
 * es otro botón, como el orden de las columnas). `title`: el nombre completo
 * que encabeza la burbuja (por defecto, `label`).
 */
export function infoTipHtml({ label = '', title = label, help }) {
  const text = label ? `<span class="info-tip-label">${esc(label)}</span>` : '';
  return `<button type="button" class="info-tip${label ? '' : ' info-tip--icon'}" data-tip-title="${esc(title)}" data-tip="${esc(help)}" aria-label="${esc(title)}: ${MORE}" aria-expanded="false">${text}${icon('info')}</button>`;
}

/** El mismo botón como elemento. */
export function infoTip(options) {
  const template = document.createElement('template');
  template.innerHTML = infoTipHtml(options);
  return template.content.firstElementChild;
}

/**
 * Escucha los .info-tip de `root` (un ShadowRoot) y les muestra la burbuja,
 * una por root. Se llama una vez; los botones pueden llegar después.
 */
export function bindInfoTips(root) {
  const host = root.host ?? root;
  const bubble = document.createElement('div');
  bubble.className = 'info-bubble';
  bubble.setAttribute('role', 'tooltip');
  bubble.id = 'arq-info-bubble';
  bubble.popover = 'manual';
  bubble.innerHTML = '<span class="info-bubble-title role-label"></span><span class="info-bubble-body role-body-sm"></span>';
  root.append(bubble);

  let current = null; // botón con la burbuja abierta
  let pinned = false; // abierta con clic o toque: no se va al sacar el mouse
  let waiting = 0;

  const open = () => bubble.matches(':popover-open');

  const hide = () => {
    clearTimeout(waiting);
    waiting = 0;
    if (current) {
      current.setAttribute('aria-expanded', 'false');
      current.removeAttribute('aria-describedby');
    }
    current = null;
    pinned = false;
    if (open()) bubble.hidePopover();
  };

  const place = (button) => {
    // layout/gutter y space/gap/sm en px, desde scroll-margin (info-tip.css)
    const styles = getComputedStyle(bubble);
    const margin = Number.parseFloat(styles.scrollMarginLeft) || 0;
    const gap = Number.parseFloat(styles.scrollMarginTop) || 0;
    const anchor = button.querySelector('.icon')?.getBoundingClientRect() ?? button.getBoundingClientRect();
    const box = bubble.getBoundingClientRect();
    const center = anchor.left + anchor.width / 2;
    const left = Math.max(margin, Math.min(center - box.width / 2, innerWidth - box.width - margin));
    let top = anchor.top - box.height - gap;
    const below = top < margin;
    if (below) top = button.getBoundingClientRect().bottom + gap;
    bubble.classList.toggle('is-below', below);
    bubble.style.setProperty('--x', `${left}px`);
    bubble.style.setProperty('--y', `${top}px`);
    bubble.style.setProperty('--arrow-x', `${Math.max(gap * 2, Math.min(center - left, box.width - gap * 2))}px`);
  };

  const show = (button) => {
    clearTimeout(waiting);
    waiting = 0;
    if (current && current !== button) {
      current.setAttribute('aria-expanded', 'false');
      current.removeAttribute('aria-describedby');
    }
    current = button;
    bubble.querySelector('.info-bubble-title').textContent = button.dataset.tipTitle;
    bubble.querySelector('.info-bubble-body').textContent = button.dataset.tip;
    button.setAttribute('aria-expanded', 'true');
    button.setAttribute('aria-describedby', bubble.id);
    if (!open()) bubble.showPopover();
    place(button);
  };

  // Con mouse: la primera espera motion/duration/base; con otra abierta, al instante
  root.addEventListener('pointerover', (event) => {
    if (event.pointerType !== 'mouse') return;
    const button = event.target.closest?.('.info-tip');
    if (!button || button === current) return;
    if (pinned) return;
    if (open()) return show(button);
    clearTimeout(waiting);
    waiting = setTimeout(() => show(button), tokenMs(host, '--arq-motion-duration-base'));
  });
  root.addEventListener('pointerout', (event) => {
    if (event.pointerType !== 'mouse' || pinned) return;
    const button = event.target.closest?.('.info-tip');
    if (!button || button.contains(event.relatedTarget)) return;
    hide();
  });
  root.addEventListener('click', (event) => {
    const button = event.target.closest?.('.info-tip');
    if (!button) return;
    event.preventDefault();
    event.stopPropagation();
    if (button === current && pinned) return hide();
    show(button);
    pinned = true;
  });
  // Teclado: al enfocar se muestra; al salir del botón, se va
  root.addEventListener('focusin', (event) => {
    const button = event.target.closest?.('.info-tip');
    if (button && button.matches(':focus-visible')) show(button);
  });
  root.addEventListener('focusout', (event) => {
    if (event.target.closest?.('.info-tip') === current && !pinned) hide();
  });
  root.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && current) {
      event.stopPropagation();
      hide();
    }
  });
  // Un toque afuera, el scroll o un cambio de tamaño la cierran
  document.addEventListener('pointerdown', (event) => {
    if (current && !event.composedPath().some((node) => node === current || node === bubble)) hide();
  }, true);
  addEventListener('scroll', () => current && hide(), { capture: true, passive: true });
  addEventListener('resize', () => current && hide());
}
