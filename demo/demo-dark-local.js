// Ejemplo mínimo de Dark local (solo demo, no entra al build).
// Un contenedor interno del Shadow DOM con data-arq-theme="dark": pasa a Dark
// gracias a la hoja dark.css que adopta ArqElement, y el contenido por slot
// (un <arq-button> del DOM de la página) lo hereda.

import { ArqElement } from '/src/base/arq-element.js';

const css = `
:host { display: block; }
.box {
  display: grid;
  gap: var(--arq-space-gap-md);
  padding: var(--arq-space-padding-lg);
  border: var(--arq-border-default) solid var(--arq-color-border-subtle);
  color: var(--arq-color-text-primary);
}
.dark {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--arq-space-gap-md);
  padding: var(--arq-space-padding-lg);
  background: var(--arq-color-bg-default);
  color: var(--arq-color-text-primary);
}
p { margin: 0; }
`;

class DemoDarkLocal extends ArqElement {
  static tag = 'demo-dark-local';
  static styles = css;
  static template = `
    <div class="box">
      <p class="role-body">Shadow DOM sin atributo (sigue el tema de la página)</p>
      <div class="dark" data-arq-theme="dark">
        <p class="inner role-body">Contenedor interno con data-arq-theme="dark"</p>
        <slot></slot>
      </div>
    </div>
  `;
}

DemoDarkLocal.define();
