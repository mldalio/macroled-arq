// accordion-item · Figma 922:2645 · ficha doc/accordion-item (1462:9426)
//
// Bloque desplegable de especificaciones de la ficha (características
// lumínicas, eléctricas, materiales y dimensiones), con spec-list adentro.
// No confundir con faq-item (preguntas del Home).
//
//   <arq-accordion-item open>
//     <span slot="title">Características lumínicas</span>
//     <arq-spec-list>…</arq-spec-list>
//   </arq-accordion-item>
//
// - El título (slot title) va dentro del <button> con aria-expanded
//   (Disclosure). No es un h2/h3: un encabezado dentro de un botón pierde su
//   rol para los lectores de pantalla (mismo criterio que faq-item). El botón
//   va dentro de un role="heading" (patrón accordion de ARIA), así se puede
//   recorrer las especificaciones por encabezados. Nivel: heading-level
//   (por defecto 3).
// - El contenido (slot por defecto) queda en el HTML aunque esté cerrado.
//   Pueden quedar varios abiertos a la vez.
// - Título en role/heading-3 (Ficha v2). El ícono +/– tiene las medidas de
//   icon-button Size=Large (48 × 48, ícono 24), sin borde, pero es parte del
//   botón, no otro botón: no se anida un control en otro.
// - Open es la prop open. State no es prop: Hover (:hover, solo cerrado, como
//   el set) y Focus (anillo alrededor de todo el ítem). Breakpoint es media query.
// - Sin divisor bajo el título al abrir (decisión 2026-10-02 · accordion-item:
//   como Open=True Default y la Ficha de Final).

import { ArqElement } from '../../base/arq-element.js';
import { Disclosure } from '../../base/disclosure.js';
import { icon } from '../../base/icons.js';
import css from './accordion-item.css?inline';

class ArqAccordionItem extends ArqElement {
  static tag = 'arq-accordion-item';
  static styles = css;
  static properties = {
    open: { type: Boolean }, // Open
    headingLevel: { type: Number, default: 3 }, // solo de código: aria-level del encabezado
  };
  static template =
    `<div class="item">` +
    `<div class="heading" role="heading" aria-level="3">` +
    `<button type="button" class="trigger">` +
    `<span class="title role-heading-3"><slot name="title"></slot></span>` +
    `<span class="icon-box">${icon('plus')}${icon('minus')}</span>` +
    `</button>` +
    `</div>` +
    `<div class="content" part="panel"><slot></slot></div>` +
    `</div>`;

  setup() {
    this.disclosure = new Disclosure(this, {
      trigger: this.shadowRoot.querySelector('.trigger'),
      panel: this.shadowRoot.querySelector('.content'),
    });
  }

  update() {
    const level = Math.min(6, Math.max(1, Math.round(this.headingLevel) || 3));
    this.shadowRoot.querySelector('.heading').setAttribute('aria-level', String(level));
  }
}

ArqAccordionItem.define();

export { ArqAccordionItem };
