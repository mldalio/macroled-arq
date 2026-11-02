// Tooltip de texto para los datos de la card. Un solo elemento por componente, dentro de un
// contenedor con position: relative (estilos en tooltip.css).
//
//   bindTooltip(container, scope, '[data-tip]')
//
// Escucha en `scope` y muestra el texto de data-tip del elemento señalado, sobre él. Al pasar de
// un dato a otro no se cierra: se desliza al nuevo. Solo con mouse: en táctil no hay hover y el
// toque abre la ficha.

// Pausa antes de cerrar: pasar por el hueco entre dos datos no lo apaga
const CLOSE_DELAY = 80;

export function bindTooltip(container, scope, selector = '[data-tip]') {
  const tip = document.createElement('div');
  tip.className = 'tooltip role-body-sm';
  tip.setAttribute('role', 'tooltip');
  container.append(tip);

  let current = null;
  let closing = 0;

  const hide = () => {
    clearTimeout(closing);
    closing = setTimeout(() => {
      current = null;
      tip.removeAttribute('data-open');
    }, CLOSE_DELAY);
  };

  const show = (target) => {
    clearTimeout(closing);
    if (target === current) return;
    // sin tooltip abierto, aparece en su lugar (data-jump quita el deslizamiento)
    const opening = !tip.hasAttribute('data-open');
    current = target;
    tip.textContent = target.dataset.tip;
    if (opening) tip.setAttribute('data-jump', '');
    const box = container.getBoundingClientRect();
    const at = target.getBoundingClientRect();
    // arriba del dato, alineado a su borde izquierdo y sin salirse del contenedor
    const left = Math.max(0, Math.min(at.left - box.left, box.width - tip.offsetWidth));
    tip.style.setProperty('--tip-x', `${left}px`);
    tip.style.setProperty('--tip-y', `${at.top - box.top}px`);
    if (opening) {
      void tip.offsetWidth; // fija la posición antes de mostrarlo
      tip.setAttribute('data-open', '');
      requestAnimationFrame(() => tip.removeAttribute('data-jump'));
    }
  };

  scope.addEventListener('pointerover', (event) => {
    if (event.pointerType !== 'mouse') return;
    const target = event.target.closest?.(selector);
    if (target?.dataset.tip) show(target);
    else hide();
  });
  scope.addEventListener('pointerleave', hide);
}
