// spec-row · Figma 922:2497 · ficha doc/spec-row (1462:9118)
//
// Fila de especificación técnica: etiqueta + valor, con separador inferior.
// Va dentro de spec-list; la cantidad de filas es libre.
//
//   <arq-spec-row><span slot="label">Flujo luminoso</span>850 lm</arq-spec-row>
//
// Cada fila arma su propio <dl> con un par <dt> / <dd>: los <dt>/<dd> no
// pueden cruzar el Shadow DOM hasta un <dl> de spec-list.

import { ArqElement } from '../../base/arq-element.js';
import css from './spec-row.css?inline';

class ArqSpecRow extends ArqElement {
  static tag = 'arq-spec-row';
  static styles = css;
  static template = `<dl class="row role-body-regular"><dt class="label"><slot name="label"></slot></dt><dd class="value"><slot></slot></dd></dl>`;
}

ArqSpecRow.define();

export { ArqSpecRow };
