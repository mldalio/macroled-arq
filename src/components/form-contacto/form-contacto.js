// form-contacto · contenedor de página (Final: Contacto 1278:27919 Desktop ·
// 1311:17151 Mobile; enviado 1311:17461 · 1311:17501)
//
// Bloque de Contacto: a la izquierda la información (por slot, desde el
// embed: indexable) y a la derecha el formulario, que envía por fetch al
// webhook de n8n (src/config.js; AGENTS.md · Formulario).
//
//   <arq-form-contacto>
//     <h2 slot="title">Te acompañamos en cada etapa.</h2>
//     <p slot="description">Desde la selección de luminarias…</p>
//     <arq-contact-item slot="channels" href="mailto:…">…</arq-contact-item>
//     <arq-link-list slot="links">…</arq-link-list>
//   </arq-form-contacto>
//
// - El <form> y sus campos viven en el Shadow DOM del componente: así el
//   formulario es dueño de los campos (ElementInternals) y manda su FormData.
// - Validación al enviar: cada campo inválido muestra su mensaje (prop error
//   de arq-input) y el foco va al primero. Después, se revalida al salir del
//   campo. Sin validación nativa del navegador (novalidate).
// - Honeypot: un campo oculto (website) que una persona no completa. Si llega
//   con texto, se muestra la confirmación y no se envía nada.
// - Estados: enviando (button loading), enviado (form-message Success; el
//   formulario se vacía) y error (form-message Error; los datos quedan).
// - Emite arq:submit { data } antes de enviar y arq:sent o arq:error después.

import { ArqElement } from '../../base/arq-element.js';
import { SingleSelect } from '../../base/single-select.js';
import { config } from '../../config.js';
import '../form-section-header/form-section-header.js';
import '../choice-chip/choice-chip.js';
import '../input/input.js';
import '../file-upload/file-upload.js';
import '../checkbox/checkbox.js';
import '../button/button.js';
import '../form-message/form-message.js';
import css from './form-contacto.css?inline';

// Opciones de la pantalla Contacto de Final (1278:27940)
const TOPICS = ['Asesoramiento lumínico', 'Cotización de proyecto', 'Consulta técnica', 'Garantía'];

const PROVINCES = [
  'Buenos Aires', 'Ciudad Autónoma de Buenos Aires', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba', 'Corrientes',
  'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa', 'La Rioja', 'Mendoza', 'Misiones', 'Neuquén', 'Río Negro', 'Salta',
  'San Juan', 'San Luis', 'Santa Cruz', 'Santa Fe', 'Santiago del Estero', 'Tierra del Fuego', 'Tucumán',
];

// TODO (diseño): textos de error por caso y campos obligatorios no están
// diseñados (README de input). Obligatorios: nombre, email y detalles.
const ERRORS = {
  nombre: 'Completá tu nombre.',
  email: { valueMissing: 'Completá tu email.', typeMismatch: 'Revisá el formato del email.' },
  detalles: 'Contanos un poco sobre tu proyecto.',
};

const TEXT = {
  sent: 'Recibimos tu consulta. Te respondemos a la brevedad.',
  error: 'No pudimos enviar tu consulta. Probá de nuevo en unos minutos.',
};

const esc = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

class ArqFormContacto extends ArqElement {
  static tag = 'arq-form-contacto';
  static styles = css;
  static properties = {};
  static template =
    `<div class="layout">` +
    `<div class="info">` +
    `<div class="intro">` +
    `<div class="title role-heading-2"><slot name="title"></slot></div>` +
    `<div class="description role-body-lg"><slot name="description"></slot></div>` +
    `</div>` +
    `<div class="channels"><slot name="channels"></slot></div>` +
    `<slot name="links"></slot>` +
    `</div>` +
    `<form class="form" novalidate>` +
    `<fieldset class="section topics">` +
    `<legend><arq-form-section-header number="01" show-number>Tipo de consulta</arq-form-section-header></legend>` +
    `<div class="choices" role="radiogroup" aria-label="Tipo de consulta">` +
    TOPICS.map((topic, i) => `<arq-choice-chip name="tipo" value="${esc(topic)}"${i ? '' : ' selected'}>${esc(topic)}</arq-choice-chip>`).join('') +
    `</div>` +
    `</fieldset>` +
    `<fieldset class="section">` +
    `<legend><arq-form-section-header number="02" show-number>Tus datos</arq-form-section-header></legend>` +
    `<div class="fields">` +
    `<arq-input name="nombre" placeholder="Tu nombre y apellido" autocomplete="name" required show-label>Nombre completo</arq-input>` +
    `<arq-input name="empresa" placeholder="Nombre del estudio" autocomplete="organization" show-label>Estudio o empresa</arq-input>` +
    `<arq-input name="email" input-type="email" placeholder="nombre@estudio.com" autocomplete="email" required show-label>Email</arq-input>` +
    `<arq-input name="telefono" input-type="tel" placeholder="+54 11 0000-0000" autocomplete="tel" show-label>Teléfono</arq-input>` +
    `<arq-input name="provincia" type="select" placeholder="Seleccioná una provincia" show-label>Provincia</arq-input>` +
    `<arq-input name="ciudad" placeholder="Tu ciudad" autocomplete="address-level2" show-label>Ciudad</arq-input>` +
    `</div>` +
    `</fieldset>` +
    `<fieldset class="section">` +
    `<legend><arq-form-section-header number="03" show-number>Tu proyecto</arq-form-section-header></legend>` +
    `<arq-input name="detalles" type="textarea" placeholder="Contanos el tipo de espacio, etapa del proyecto y qué necesitás…" required show-label>Detalles del proyecto</arq-input>` +
    `<arq-file-upload name="adjunto">Planos o imágenes (opcional)<span slot="helper">PDF, DWG, JPG o PNG · hasta 10 MB</span></arq-file-upload>` +
    `</fieldset>` +
    // Honeypot: fuera de la vista y del orden de Tab; una persona no lo completa
    `<div class="honeypot" aria-hidden="true"><label>No completar este campo <input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>` +
    `<div class="submit">` +
    `<arq-checkbox name="novedades" value="si" show-label>Quiero recibir novedades y lanzamientos</arq-checkbox>` +
    `<div class="send">` +
    `<arq-button class="send-button" submit show-icon icon="arrow-right">Enviar consulta</arq-button>` +
    `<arq-form-message class="message" hidden></arq-form-message>` +
    `</div>` +
    `</div>` +
    `</form>` +
    `</div>`;

  #validated = false;

  setup() {
    const root = this.shadowRoot;
    const choices = root.querySelector('.choices');
    new SingleSelect(choices, { items: 'arq-choice-chip' });
    // Los chips ocupan todo el ancho solo si entran en una fila; si hacen
    // wrap, quedan con su ancho (decisiones.md, 2026-10-05 · Contacto: ajustes)
    const chips = [...choices.querySelectorAll('arq-choice-chip')];
    const fit = () => choices.classList.toggle('fill', chips.every((chip) => chip.offsetTop === chips[0].offsetTop));
    const observer = new ResizeObserver(fit);
    observer.observe(choices);
    for (const chip of chips) observer.observe(chip);
    root.querySelector('[name="provincia"]').options = PROVINCES.map((value) => ({ value }));
    const form = root.querySelector('form');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      this.#submit(form);
    });
    // Después del primer intento, cada campo se revalida al salir de él
    form.addEventListener('arq:change', (event) => {
      if (this.#validated && event.target.localName === 'arq-input') this.#validate(event.target);
    });
  }

  /** Mensaje de error de un campo, o '' si es válido. */
  #message(input) {
    if (input.checkValidity()) return '';
    const rule = ERRORS[input.name];
    if (typeof rule === 'string') return rule;
    return (input.validity.typeMismatch && rule?.typeMismatch) || rule?.valueMissing || 'Revisá este campo.';
  }

  #validate(input) {
    const message = this.#message(input);
    if (message) input.error = message;
    else input.removeAttribute('error');
    return !message;
  }

  async #submit(form) {
    const root = this.shadowRoot;
    this.#validated = true;
    const inputs = [...root.querySelectorAll('arq-input')];
    const invalid = inputs.filter((input) => !this.#validate(input));
    if (invalid.length) {
      invalid[0].focus();
      return;
    }

    const button = root.querySelector('.send-button');
    const message = root.querySelector('.message');
    message.hidden = true;
    const data = new FormData(form);
    const spam = String(data.get('website') ?? '').trim() !== '';
    data.delete('website');
    this.emit('submit', { data });

    button.loading = true;
    let ok = false;
    try {
      ok = spam || (await send(data));
    } catch (error) {
      console.error('[arq] form-contacto: no se pudo enviar', error);
    }
    button.loading = false;

    message.tone = ok ? 'success' : 'error';
    message.textContent = ok ? TEXT.sent : TEXT.error;
    message.hidden = false;
    if (ok) {
      form.reset();
      this.#validated = false;
      for (const input of inputs) input.removeAttribute('error');
      this.emit('sent', {});
    } else {
      this.emit('error', {});
    }
  }
}

// Envío al webhook de n8n (src/config.js). Sin URL: en `npm run dev` se simula
// el envío para poder probar los estados; en el build es un error.
// TODO (n8n): falta VITE_N8N_WEBHOOK_URL y confirmar el formato que espera el
// webhook (hoy multipart/form-data, por el archivo adjunto).
async function send(data) {
  const url = config.n8n.webhookUrl;
  if (!url) {
    if (import.meta.env.DEV) {
      console.info('[arq] form-contacto: sin VITE_N8N_WEBHOOK_URL, envío simulado (solo npm run dev)', Object.fromEntries(data));
      await new Promise((resolve) => setTimeout(resolve, 800));
      return true;
    }
    console.error('[arq] form-contacto: falta VITE_N8N_WEBHOOK_URL');
    return false;
  }
  const response = await fetch(url, { method: 'POST', body: data });
  return response.ok;
}

ArqFormContacto.define();

export { ArqFormContacto };
