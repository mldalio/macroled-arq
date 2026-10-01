// form-message · Figma 1311:4871 · ficha doc/form-message (1451:6043)
//
// Mensaje de resultado debajo del botón de envío. Sin ícono (no hay icon/check
// ni icon/alert en la librería).
//
//   <arq-form-message>Recibimos tu consulta. Te respondemos a la brevedad.</arq-form-message>
//   <arq-form-message tone="error">No pudimos enviar. Probá de nuevo.</arq-form-message>
//
// Success lleva role="status" y Error role="alert": el lector de pantalla lo
// anuncia cuando aparece o cambia el texto. Mover el foco después de enviar lo
// decide el formulario (form-contacto).

import { ArqElement } from '../../base/arq-element.js';
import css from './form-message.css?inline';

class ArqFormMessage extends ArqElement {
  static tag = 'arq-form-message';
  static styles = css;
  static properties = {
    tone: { type: String, values: ['success', 'error'], default: 'success' }, // Tone
  };
  static template = `<p class="message role-body"><slot></slot></p>`;

  update() {
    this.setAttribute('role', this.tone === 'error' ? 'alert' : 'status');
  }
}

ArqFormMessage.define();

export { ArqFormMessage };
