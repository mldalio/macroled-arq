// cta-block · Figma 1265:4464 · ficha doc/cta-block (1455:7747)
//
// Bloque de cierre de página (último antes del footer, uno por página), con
// fondo color/bg/subtle a sangre. Type=Button lleva una acción; Type=Newsletter
// un email + button.
//
//   <arq-cta-block>
//     <h2 slot="title">¿Necesitás ayuda para elegir?</h2>
//     <span slot="description">Nuestro equipo técnico te asesora.</span>
//     <arq-button slot="action" show-icon icon="arrow-right" href="/arq/contacto">Hablar con un asesor</arq-button>
//   </arq-cta-block>
//
//   <arq-cta-block type="newsletter">
//     <h2 slot="title">Novedades para estudios</h2>
//     <arq-input slot="email" name="email" input-type="email" placeholder="Tu email profesional" required>Email</arq-input>
//     <arq-button slot="action">Suscribirme</arq-button>
//   </arq-cta-block>
//
// - El <h2> va en el HTML de la página (slot title); el componente le da
//   role/heading-2 desde un contenedor interno.
// - Newsletter: el componente valida el email (validación nativa del
//   arq-input) al tocar el button o con Enter, y emite arq:submit con
//   { email }. No envía: el envío a n8n y form-message llegan con el envío de
//   formularios (TODO, decisión 2026-10-01 · cta-block).
// - Aplica su propio layout/gutter (el fondo llega a los bordes).

import { ArqElement } from '../../base/arq-element.js';
import css from './cta-block.css?inline';

class ArqCtaBlock extends ArqElement {
  static tag = 'arq-cta-block';
  static styles = css;
  static properties = {
    type: { type: String, values: ['button', 'newsletter'], default: 'button' }, // Type
  };
  static template =
    `<div class="block">` +
    `<div class="text">` +
    `<div class="title role-heading-2"><slot name="title"></slot></div>` +
    `<p class="description role-body-lg" hidden><slot name="description"></slot></p>` +
    `</div>` +
    `<div class="action">` +
    `<div class="email" hidden><slot name="email"></slot></div>` +
    `<slot name="action"></slot>` +
    `</div>` +
    `</div>`;

  setup() {
    const root = this.shadowRoot;
    root.querySelector('slot[name="description"]').addEventListener('slotchange', () => this.update());

    // Newsletter: clic en el button del slot action o Enter en el email
    root.querySelector('slot[name="action"]').addEventListener('click', () => {
      if (this.type === 'newsletter') this.#submit();
    });
    root.querySelector('slot[name="email"]').addEventListener('keydown', (event) => {
      if (this.type === 'newsletter' && event.key === 'Enter') {
        event.preventDefault();
        this.#submit();
      }
    });
  }

  update() {
    const root = this.shadowRoot;
    root.querySelector('.description').hidden = !root
      .querySelector('slot[name="description"]')
      .assignedNodes({ flatten: true })
      .some((node) => node.nodeType === Node.ELEMENT_NODE || node.textContent.trim());
    root.querySelector('.email').hidden = this.type !== 'newsletter';
  }

  /** Valida el email y emite arq:submit con { email }. Devuelve si se emitió. */
  #submit() {
    const email = this.querySelector('[slot="email"]');
    if (!email) return false;
    if (typeof email.reportValidity === 'function' && !email.reportValidity()) {
      email.focus?.();
      return false;
    }
    this.emit('submit', { email: email.value });
    return true;
  }
}

ArqCtaBlock.define();

export { ArqCtaBlock };
