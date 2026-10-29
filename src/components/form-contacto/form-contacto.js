// form-contacto · contenedor de página (Final › Contacto v3: 2295:23055
// Desktop · 2473:30918 Mobile; enviado 2473:30758 · 2473:31283)
//
// Bloque de Contacto: a la izquierda la información (por slot, desde el
// embed: indexable; fija al desplazar en Desktop) y a la derecha el
// formulario, que envía por fetch al webhook de n8n (src/config.js;
// AGENTS.md · Formulario). Debajo, opcional, las preguntas frecuentes en la
// misma grilla.
//
//   <arq-form-contacto>
//     <h2 slot="title">Te acompañamos en cada etapa.</h2>
//     <p slot="description">Desde la selección de luminarias…</p>
//     <span slot="channels-title">Contacto</span>
//     <arq-contact-item slot="channels" href="mailto:…">…</arq-contact-item>
//     <arq-link-list slot="links">…</arq-link-list>
//     <h2 slot="faq-title">Preguntas frecuentes</h2>
//     <p slot="faq-description">¿No encontrás lo que buscás?…</p>
//     <arq-button slot="faq-action" type="underline" …>Escribinos</arq-button>
//     <arq-faq-item slot="faq">…</arq-faq-item>
//   </arq-form-contacto>
//
// - El <form> y sus campos viven en el Shadow DOM del componente: así el
//   formulario es dueño de los campos (ElementInternals) y manda su FormData.
// - Cada bloque es un <fieldset> con su <legend> en role/heading-3 y línea
//   inferior, como el set form-section-header (decisiones.md, 2026-10-14 ·
//   Contacto v3).
// - Validación al enviar: cada campo inválido muestra su mensaje (prop error
//   de arq-input) y el foco va al primero. Después, se revalida al salir del
//   campo, y un campo con error también mientras se escribe (el error se va
//   apenas el valor es válido). Sin validación nativa del navegador
//   (novalidate).
// - Honeypot: un campo oculto (website) que una persona no completa. Si llega
//   con texto, se muestra la confirmación y no se envía nada.
// - Estados: enviando (button loading), enviado (form-message Success; el
//   formulario se vacía) y error (form-message Error; los datos quedan).
// - Emite arq:submit { data } antes de enviar y arq:sent o arq:error después.

import { ArqElement } from '../../base/arq-element.js';
import { SingleSelect } from '../../base/single-select.js';
import { config } from '../../config.js';
import '../choice-chip/choice-chip.js';
import '../input/input.js';
import '../file-upload/file-upload.js';
import '../checkbox/checkbox.js';
import '../button/button.js';
import '../form-message/form-message.js';
import css from './form-contacto.css?inline';

// Lo que se ve es el texto de Final (1278:27940). `value` es lo que viaja en
// `tipo` hacia n8n (el Switch del workflow compara contra estos slugs).
const TOPICS = [
  { label: 'Asesoramiento lumínico', value: 'asesoramiento' },
  { label: 'Cotización de proyecto', value: 'cotizacion' },
  { label: 'Consulta técnica', value: 'consultas-tecnicas' },
  { label: 'Garantía', value: 'garantia' },
];

const PROVINCES = [
  'Buenos Aires', 'Ciudad Autónoma de Buenos Aires', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba', 'Corrientes',
  'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa', 'La Rioja', 'Mendoza', 'Misiones', 'Neuquén', 'Río Negro', 'Salta',
  'San Juan', 'San Luis', 'Santa Cruz', 'Santa Fe', 'Santiago del Estero', 'Tierra del Fuego', 'Tucumán',
];

// TODO (código): pasar los textos de error diseñados en Figma (Final › Contacto,
// «Textos de error · formulario de contacto», 2805:26390; decisiones.md,
// 2026-10-20). Obligatorios sin marca «(opcional)»: nombre, empresa, email,
// teléfono, provincia y detalles. Ciudad y el adjunto siguen opcionales.
const ERRORS = {
  nombre: 'Completá tu nombre.',
  empresa: 'Completá el estudio o la empresa.',
  email: { valueMissing: 'Completá tu email.', typeMismatch: 'Revisá el formato del email.' },
  telefono: 'Completá tu teléfono.',
  provincia: 'Elegí una provincia.',
  detalles: 'Contanos un poco sobre tu proyecto.',
};

// Tamaño máximo del adjunto (Contacto v3; el set file-upload dice 10 MB).
// TODO (n8n): confirmar que el webhook acepte 25 MB.
const MAX_FILE_MB = 25;

// Slots opcionales: el contenedor de cada uno no se muestra si está vacío
const OPTIONAL = { 'channels-title': '.channels-title', faq: '.faq' };

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
    `<div class="title role-display-sm"><slot name="title"></slot></div>` +
    `<div class="description role-body"><slot name="description"></slot></div>` +
    `</div>` +
    `<div class="channels">` +
    `<span class="channels-title role-body-lg-regular" hidden><slot name="channels-title"></slot></span>` +
    `<slot name="channels"></slot>` +
    `</div>` +
    `<slot name="links"></slot>` +
    `</div>` +
    `<form class="form" novalidate>` +
    `<fieldset class="section topics">` +
    `<legend class="role-heading-3">Tipo de consulta</legend>` +
    `<div class="choices" role="radiogroup" aria-label="Tipo de consulta">` +
    TOPICS.map((topic, i) => `<arq-choice-chip name="tipo" value="${esc(topic.value)}"${i ? '' : ' selected'}>${esc(topic.label)}</arq-choice-chip>`).join('') +
    `</div>` +
    `</fieldset>` +
    `<fieldset class="section">` +
    `<legend class="role-heading-3">Tus datos</legend>` +
    `<div class="fields">` +
    `<arq-input name="nombre" placeholder="Tu nombre y apellido" autocomplete="name" autocapitalize="words" enterkeyhint="next" required show-label>Nombre completo</arq-input>` +
    `<arq-input name="empresa" placeholder="Nombre del estudio" autocomplete="organization" autocapitalize="words" enterkeyhint="next" required show-label>Estudio o empresa</arq-input>` +
    `<arq-input name="email" input-type="email" placeholder="nombre@estudio.com" autocomplete="email" enterkeyhint="next" required show-label>Email</arq-input>` +
    `<arq-input name="telefono" input-type="tel" placeholder="+54 11 0000-0000" autocomplete="tel" enterkeyhint="next" required show-label>Teléfono</arq-input>` +
    `<arq-input name="provincia" type="select" placeholder="Seleccioná una provincia" required show-label>Provincia</arq-input>` +
    `<arq-input name="ciudad" placeholder="Tu ciudad" autocomplete="address-level2" autocapitalize="words" enterkeyhint="next" show-label>Ciudad (opcional)</arq-input>` +
    `</div>` +
    `</fieldset>` +
    `<fieldset class="section">` +
    `<legend class="role-heading-3">Tu proyecto</legend>` +
    // 6 filas: el campo de Contacto v3 es más alto que las 4 del set de input
    `<arq-input name="detalles" type="textarea" rows="6" placeholder="Contanos el tipo de espacio, etapa del proyecto y qué necesitás…" required show-label>Detalles del proyecto</arq-input>` +
    `<arq-file-upload name="adjunto" max-size="${MAX_FILE_MB}">Planos o imágenes (opcional)<span slot="helper">PDF, DWG, JPG o PNG · hasta ${MAX_FILE_MB} MB. ¿Pesa más? Pegá un link de Drive o WeTransfer en el detalle.</span></arq-file-upload>` +
    `</fieldset>` +
    // Honeypot: fuera de la vista y del orden de Tab; una persona no lo completa
    `<div class="honeypot" aria-hidden="true"><label>No completar este campo <input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>` +
    `<div class="submit">` +
    `<arq-checkbox name="novedades" value="si" show-label>Quiero recibir novedades y lanzamientos</arq-checkbox>` +
    `<div class="send">` +
    `<arq-button class="send-button" submit show-icon icon="arrow-right">Enviar consulta</arq-button>` +
    // Región viva: siempre en la página y vacía (DESIGN.md §9)
    `<arq-form-message class="message"></arq-form-message>` +
    `</div>` +
    `</div>` +
    `</form>` +
    `</div>` +
    // Preguntas frecuentes (Contacto v3): todo por slot, en la misma grilla
    // que la consulta. Sin preguntas, el bloque no se muestra.
    `<div class="faq" hidden>` +
    `<div class="faq-text">` +
    `<div class="faq-title role-display-sm"><slot name="faq-title"></slot></div>` +
    `<div class="faq-description role-body"><slot name="faq-description"></slot></div>` +
    `<slot name="faq-action"></slot>` +
    `</div>` +
    `<div class="faq-items"><slot name="faq"></slot></div>` +
    `</div>`;

  #validated = false;

  setup() {
    const root = this.shadowRoot;
    const choices = root.querySelector('.choices');
    new SingleSelect(choices, { items: 'arq-choice-chip' });
    for (const [name, selector] of Object.entries(OPTIONAL)) {
      const slot = root.querySelector(`slot[name="${name}"]`);
      const sync = () => {
        root.querySelector(selector).hidden = !slot.assignedNodes().length;
      };
      slot.addEventListener('slotchange', sync);
      sync();
    }
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
    // Un campo con error se revalida mientras se escribe: el error se va
    // apenas el valor es válido (los errores nuevos siguen apareciendo al salir).
    form.addEventListener('arq:input', (event) => {
      if (event.target.localName === 'arq-input' && event.target.hasAttribute('error')) this.#validate(event.target);
    });
  }

  /** Mensaje de error de un campo, o '' si es válido. */
  #message(input) {
    if (input.checkValidity()) return '';
    const rule = ERRORS[input.name];
    if (typeof rule === 'string') return rule;
    return (input.validity.typeMismatch && rule?.typeMismatch) || rule?.valueMissing || 'Revisá este campo.';
  }

  #validate(input, { announce = true } = {}) {
    const message = this.#message(input);
    input.setError(message, { announce });
    return !message;
  }

  async #submit(form) {
    const root = this.shadowRoot;
    this.#validated = true;
    const inputs = [...root.querySelectorAll('arq-input')];
    // Al enviar, los errores no pasan por las regiones vivas de cada campo (se
    // encadenarían): el foco va al primero, que lee su error por aria-describedby.
    const invalid = inputs.filter((input) => !this.#validate(input, { announce: false }));
    const message = root.querySelector('.message');
    if (invalid.length) {
      message.textContent = '';
      invalid[0].focus();
      return;
    }

    const button = root.querySelector('.send-button');
    message.textContent = '';
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

    // La región ya está vacía: el texto se escribe en un frame posterior, así se
    // anuncia siempre (también si se repite el mismo mensaje) y con el role del
    // tono nuevo ya puesto.
    message.tone = ok ? 'success' : 'error';
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    message.textContent = ok ? TEXT.sent : TEXT.error;
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
// TODO (n8n): confirmar que el webhook lea multipart/form-data (por el adjunto).
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
