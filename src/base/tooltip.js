// Tooltip de texto para los datos de la card. Un solo elemento por componente, dentro de un
// contenedor con position: relative (estilos en tooltip.css).
//
//   bindTooltip(container, scope, '[data-tip]')
//
// Escucha en `scope` y muestra el texto de data-tip del elemento señalado, sobre él. El primero
// espera motion/duration/slow: cruzar una grilla de cards con el mouse no los hace parpadear. Al
// pasar de un dato a otro no se cierra ni espera: se desliza al nuevo. Solo con mouse: en táctil
// no hay hover y el toque abre la ficha (el texto va también en aria-description del dato).

import { tokenMs } from './motion.js';

export function bindTooltip(container, scope, selector = '[data-tip]') {
  const tip = document.createElement('div');
  tip.className = 'tooltip role-body-sm';
  tip.setAttribute('role', 'tooltip');
  container.append(tip);

  let current = null;
  let closing = 0;
  let opening = 0;

  // Pausa antes de cerrar (motion/duration/fast): pasar por el hueco entre dos datos no lo apaga
  const hide = () => {
    clearTimeout(opening);
    opening = 0;
    clearTimeout(closing);
    closing = setTimeout(() => {
      current = null;
      tip.removeAttribute('data-open');
    }, tokenMs(container, '--arq-motion-duration-fast'));
  };

  const place = (target) => {
    current = target;
    tip.textContent = target.dataset.tip;
    const box = container.getBoundingClientRect();
    const at = target.getBoundingClientRect();
    // arriba del dato, alineado a su borde izquierdo y sin salirse del contenedor
    const left = Math.max(0, Math.min(at.left - box.left, box.width - tip.offsetWidth));
    tip.style.setProperty('--tip-x', `${left}px`);
    tip.style.setProperty('--tip-y', `${at.top - box.top}px`);
  };

  const show = (target) => {
    clearTimeout(closing);
    if (target === current) return;
    // Abierto (o cerrándose): se desliza al nuevo dato, sin esperar
    if (tip.hasAttribute('data-open')) return place(target);
    clearTimeout(opening);
    opening = setTimeout(() => {
      opening = 0;
      // sin tooltip abierto, aparece en su lugar (data-jump quita el deslizamiento)
      tip.setAttribute('data-jump', '');
      place(target);
      void tip.offsetWidth; // fija la posición antes de mostrarlo
      tip.setAttribute('data-open', '');
      requestAnimationFrame(() => tip.removeAttribute('data-jump'));
    }, tokenMs(container, '--arq-motion-duration-slow'));
  };

  scope.addEventListener('pointerover', (event) => {
    if (event.pointerType !== 'mouse') return;
    const target = event.target.closest?.(selector);
    if (target?.dataset.tip) show(target);
    else hide();
  });
  scope.addEventListener('pointerleave', hide);
}
