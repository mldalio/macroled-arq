// cta-block · Figma 1265:4464 · ficha doc/cta-block (1455:7747)
//
// Bloque de cierre de página (último antes del footer, uno por página), con
// fondo color/surface/subtle a sangre. Type=Button lleva una acción; Type=Newsletter
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
//   arq-input) al tocar el button o con Enter, emite arq:submit con
//   { email } y muestra la confirmación (form-message). El envío a n8n
//   sigue pendiente (TODO, decisión 2026-10-01 · cta-block).
// - Aplica su propio layout/gutter (el fondo llega a los bordes).

import { ArqElement } from '../../base/arq-element.js';
import '../form-message/form-message.js';
import css from './cta-block.css?inline';

const SENT = 'Listo. Te suscribiste al newsletter.';

class ArqCtaBlock extends ArqElement {
  static tag = 'arq-cta-block';
  static styles = css;
  static properties = {
    type: { type: String, values: ['button', 'newsletter'], default: 'button' }, // Type
  };
  static template =
    `<div class="block">` +
    `<div class="media" hidden><slot name="media"></slot></div>` +
    `<div class="text">` +
    `<p class="kicker role-label" hidden><slot name="kicker"></slot></p>` +
    `<div class="title role-heading-2"><slot name="title"></slot></div>` +
    `<p class="description role-body-lg" hidden><slot name="description"></slot></p>` +
    `</div>` +
    `<div class="action">` +
    `<div class="email" hidden><slot name="email"></slot></div>` +
    `<slot name="action"></slot>` +
    `<arq-form-message class="message"></arq-form-message>` +
    `</div>` +
    `</div>`;

  setup() {
    const root = this.shadowRoot;
    for (const name of ['description', 'kicker', 'media']) {
      root.querySelector(`slot[name="${name}"]`).addEventListener('slotchange', () => this.update());
    }

    // El clic nace en el shadow del button: se escucha en el host, que sí lo recibe.
    this.addEventListener('click', (event) => {
      if (this.type === 'newsletter' && event.target.closest?.('arq-button')) this.#submit();
    });
    this.addEventListener('keydown', (event) => {
      if (this.type !== 'newsletter' || event.key !== 'Enter') return;
      const email = event.target.closest?.('[slot="email"]');
      if (!email || !this.contains(email)) return;
      event.preventDefault();
      this.#submit();
    });
  }

  update() {
    const root = this.shadowRoot;
    const filled = (name) =>
      root
        .querySelector(`slot[name="${name}"]`)
        .assignedNodes({ flatten: true })
        .some((node) => node.nodeType === Node.ELEMENT_NODE || node.textContent.trim());
    root.querySelector('.description').hidden = !filled('description');
    root.querySelector('.kicker').hidden = !filled('kicker');
    const hasMedia = root.querySelector('slot[name="media"]').assignedElements({ flatten: true }).length > 0;
    root.querySelector('.media').hidden = !hasMedia;
    this.classList.toggle('has-media', hasMedia);
    root.querySelector('.title').classList.toggle('role-display-sm', hasMedia);
    root.querySelector('.title').classList.toggle('role-heading-2', !hasMedia);
    root.querySelector('.description').classList.toggle('role-body', hasMedia);
    root.querySelector('.description').classList.toggle('role-body-lg', !hasMedia);
    root.querySelector('.email').hidden = this.type !== 'newsletter';
  }

  /** Valida el email y emite arq:submit con { email }. Devuelve si se emitió. */
  #submit() {
    const email = this.querySelector('[slot="email"]');
    if (!email) return false;
    const message = this.shadowRoot.querySelector('.message');
    if (typeof email.reportValidity === 'function' && !email.reportValidity()) {
      message.textContent = '';
      email.focus?.();
      return false;
    }
    const address = email.value;
    this.emit('submit', { email: address });
    email.value = '';
    // La región ya está vacía: el texto se escribe un frame después, así el
    // lector de pantalla lo anuncia (también si se repite el mismo mensaje).
    message.tone = 'success';
    message.textContent = '';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      message.textContent = SENT;
    }));
    return true;
  }
}

ArqCtaBlock.define();

export { ArqCtaBlock };
