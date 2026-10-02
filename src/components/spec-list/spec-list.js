// spec-list · Figma 922:2500 · ficha doc/spec-list (1462:8935)
//
// Lista de spec-row: una sola columna en Fill (ficha doc/spec-list, set de
// accordion-item y Ficha de Final). La cantidad de filas es libre: salen de
// los datos del SKU elegido.
//
//   <arq-spec-list>
//     <arq-spec-row><span slot="label">Flujo luminoso</span>850 lm</arq-spec-row>
//     <arq-spec-row><span slot="label">CRI</span>90</arq-spec-row>
//   </arq-spec-list>
//
// Sin prop Title (decisión 2026-10-02 · accordion-item): el set no tiene capa de
// título; el nombre del bloque lo da el accordion-item que la contiene.
// Cada spec-row arma su propio <dl> (los <dt>/<dd> no cruzan el Shadow DOM).

import { ArqElement } from '../../base/arq-element.js';
import css from './spec-list.css?inline';

class ArqSpecList extends ArqElement {
  static tag = 'arq-spec-list';
  static styles = css;
  static template = `<div class="list"><slot></slot></div>`;
}

ArqSpecList.define();

export { ArqSpecList };
