// Datos de la demo (break-ui): el modo va en la URL (?data=<modo>) y se escribe
// a mano; ninguna página muestra un selector. Los datos entran por el mismo
// lugar que los reales (src/data/catalog.js en Descargas, el HTML del embed y
// lo que escribe la persona en Contacto), no tocando el componente. Solo demo:
// no está en src/ ni llega al build.
//
//   Descargas  ?data=worst · empty · one · huge · error · datasheet-error
//   Ficha      ?data=datasheet-error (la ficha técnica en PDF no se genera)
//   Contacto   ?data=worst · errors · sent

/** Modo pedido en la URL ('demo' si no hay). */
export function dataMode() {
  return new URLSearchParams(location.search).get('data') ?? 'demo';
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
