// Selector de datos de la demo (break-ui): «Demo / Peor caso / …» abajo al
// centro, para ver la página con los datos de siempre o con el peor caso
// creíble. Solo demo: no está en src/ ni llega al build.
//
// El modo va en la URL (?data=<modo>), así una recarga lo conserva y se puede
// compartir. Cambiar de modo recarga la página: los datos entran por el mismo
// lugar que los reales (src/data/catalog.js en Descargas, el HTML del embed y
// lo que escribe la persona en Contacto), no tocando el componente.
//
//   Descargas  Demo · Peor caso · Vacío · Uno · 1.500 filas · Error
//   Contacto   Demo · Peor caso · Errores · Enviado

const MODES = {
  descargas: [
    ['demo', 'Demo'],
    ['worst', 'Peor caso'],
    ['empty', 'Vacío'],
    ['one', 'Uno'],
    ['huge', '1.500 filas'],
    ['error', 'Error'],
  ],
  contacto: [
    ['demo', 'Demo'],
    ['worst', 'Peor caso'],
    ['errors', 'Errores'],
    ['sent', 'Enviado'],
  ],
};

/** Modo pedido en la URL ('demo' si no hay). */
export function dataMode() {
  return new URLSearchParams(location.search).get('data') ?? 'demo';
}

/** Monta el selector si la página tiene modos. */
export function mountDataToggle(page) {
  const modes = MODES[page];
  if (!modes) return;
  const current = dataMode();
  const style = document.createElement('style');
  style.textContent = `
    .demo-data-toggle { position: fixed; z-index: 2147483000; left: 50%; bottom: 16px; transform: translateX(-50%);
      display: flex; gap: 2px; max-width: calc(100vw - 32px); overflow-x: auto; padding: 3px; border-radius: 999px;
      background: #e5e5e5; font: 500 12px/1 system-ui, sans-serif; box-shadow: 0 1px 4px rgb(0 0 0 / 0.15); scrollbar-width: none; }
    .demo-data-toggle button { flex: none; padding: 7px 12px; border: 0; border-radius: 999px; background: transparent;
      color: #444; font: inherit; cursor: pointer; white-space: nowrap; }
    .demo-data-toggle button[aria-pressed="true"] { background: #fff; color: #111; box-shadow: 0 1px 2px rgb(0 0 0 / 0.15); }
    .demo-data-toggle button:focus-visible { outline: 2px solid #111; outline-offset: 1px; }
  `;
  const bar = document.createElement('div');
  bar.className = 'demo-data-toggle';
  bar.setAttribute('role', 'group');
  bar.setAttribute('aria-label', 'Datos de la demo');
  for (const [mode, label] of modes) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    button.setAttribute('aria-pressed', String(mode === current));
    button.addEventListener('click', () => {
      const url = new URL(location.href);
      if (mode === 'demo') url.searchParams.delete('data');
      else url.searchParams.set('data', mode);
      location.href = url.href;
    });
    bar.append(button);
  }
  document.head.append(style);
  document.body.append(bar);
}

// ── Contacto: lo que escribe la persona ─────────────────────────────
// Valores creíbles y largos: un apellido compuesto con diacríticos, un estudio
// con «&», un email largo, la provincia de nombre más largo y un plano con un
// nombre de archivo de los que salen de una obra (24,9 MB, cerca del tope de 25).
const WORST_FORM = {
  nombre: 'Aleksandra Wiśniewska-Kowalczyk',
  empresa: 'Estudio de Arquitectura e Interiorismo Fernández Castro & Asociados',
  email: 'bartholomew.fitzgerald@northwind-industries-holdings.example.com',
  telefono: '+54 9 11 4000-0000 int. 1234',
  provincia: 'Ciudad Autónoma de Buenos Aires',
  ciudad: 'San Fernando del Valle de Catamarca',
  detalles:
    'Proyecto de iluminación para un edificio de oficinas de 12 pisos con planta baja comercial. Necesitamos luminarias lineales suspendidas para las oficinas (aprox. 340 unidades), downlights embutidos para circulaciones y apliques de exterior IP65 para la fachada. Adjunto planos de planta baja y entrepiso; el resto lo comparto por Drive: https://drive.google.com/drive/folders/1AbCdEfGhIjKlMnOpQrStUvWxYz0123456789?usp=sharing',
};
const WORST_FILE = 'Plano-iluminacion-planta-baja-y-entrepiso-v12-FINAL-revisado-cliente.dwg';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Completa el formulario de Contacto según el modo (como lo haría una persona). */
export async function fillContacto(mode) {
  if (!['worst', 'errors', 'sent'].includes(mode)) return;
  await customElements.whenDefined('arq-form-contacto');
  const form = document.querySelector('arq-form-contacto');
  await wait(100);
  const root = form?.shadowRoot;
  if (!root) return;
  const field = (name) => root.querySelector(`[name="${name}"]`);
  const submit = () => root.querySelector('.send-button').shadowRoot.querySelector('button, .control').click();

  if (mode === 'errors') {
    // Email a medio escribir y los obligatorios vacíos: se ven todos los errores.
    field('email').value = 'aleksandra.wisniewska-kowalczyk@';
    submit();
    return;
  }
  for (const [name, value] of Object.entries(WORST_FORM)) field(name).value = value;
  root.querySelector('arq-choice-chip:last-child')?.click();
  const upload = field('adjunto');
  const native = upload?.shadowRoot?.querySelector('.native');
  if (native) {
    const transfer = new DataTransfer();
    transfer.items.add(new File([new Uint8Array(1024)], WORST_FILE, { type: 'application/acad' }));
    native.files = transfer.files;
    native.dispatchEvent(new Event('change'));
  }
  if (mode === 'sent') submit();
}
