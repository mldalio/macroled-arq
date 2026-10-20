// Datos de peor caso para la demo (break-ui). Solo `npm run dev`: los pide
// src/data/catalog.js cuando la URL tiene ?data=<modo> y no llegan al build.
//
//   ?data=worst   Peor caso: filas armadas con los extremos reales de la base
//                 (SKU con espacios y paréntesis, nombres largos, sin foto, foto
//                 rota, sin link, columnas vacías) arriba de las 243 reales.
//   ?data=empty   Sin filas (la base vacía).
//   ?data=one     Una sola fila («1 producto»).
//   ?data=huge    1.500 filas (las reales repetidas con otro SKU).
//   ?data=error   La consulta falla.
//   ?data=loading Productos y Colecciones: la respuesta tarda como la primera
//                 visita (cards de carga); -one, -empty y -error cambian lo
//                 que llega después.
//
// Los valores son creíbles: salen de la base (los más largos de cada columna,
// medidos el 2026-10-15) o de nombres y SKU con la forma de los de Sheets. El
// SKU es opaco (AGENTS.md): puede tener espacios, paréntesis, barras y «&».

const THUMB = 'https://d1zltvqju4u8ql.cloudfront.net/fit-in/1000x1000/MACROLED/ARQ/imagenes/RMS-ATD302-B-6W-WW_HERO_OFF.webp';
const BROKEN = 'https://d1zltvqju4u8ql.cloudfront.net/fit-in/1000x1000/MACROLED/ARQ/imagenes/NO-EXISTE_HERO_OFF.webp';

// Valores más largos de cada columna en la base real.
const LONGEST = {
  tipo_montaje: '1 Entrada / 1 Salida Flexible',
  color_carcasa: 'Negro satinado',
  potencia: '200W máx',
  temperatura_color: '2000-5000K',
  proteccion_ip: 'IP65',
  dimeable: 'Si, mediante fuente DIM',
  cri: '90',
  angulo_apertura: '120°',
  tipo_led: 'Dimeable SMD',
  material_cuerpo: 'Aluminio inyectado',
  tension_proveedor: 'AC 85-265V',
};

const row = (fields) => {
  const values = fields.values ?? {};
  return {
    sku: fields.sku,
    name: fields.name ?? null,
    href: fields.href ?? null,
    meta: fields.meta ?? '',
    thumb: fields.thumb ?? null,
    search: [fields.name, fields.search].filter(Boolean).join(' '),
    attributes: values,
    values,
  };
};

const WORST_ROWS = [
  // Nombre largo (grupo sin colección que lo acorte), SKU largo con espacios y
  // paréntesis, y todas las columnas con su valor más largo.
  row({
    sku: 'LSUD-120-NS-36W-WW-DALI (kit 3 m)',
    name: 'Lineal Suspendido Up & Down 1,20 m',
    href: '/arq/producto/lineal-suspendido-up-down?sku=LSUD-120-NS-36W-WW-DALI%20(kit%203%20m)',
    meta: 'Negro satinado, 36 W, luz cálida 2700 K, óptica 24°, 1 Entrada / 1 Salida Flexible',
    thumb: THUMB,
    values: { ...LONGEST, potencia: '36W + 36W (Up & Down)' },
  }),
  // Sin nombre y sin foto; casi todas las columnas vacías (como 72 filas reales).
  row({
    sku: 'MTORI-J-2W-WW (simple)',
    href: '/arq/producto/mini-tori-jardin?sku=MTORI-J-2W-WW%20(simple)',
    values: { color_carcasa: 'Terracota', potencia: '2W' },
  }),
  // Nombre de dos letras, foto rota y sin página de producto.
  row({
    sku: 'KO-P-B-12W',
    name: 'Ko',
    thumb: BROKEN,
    meta: 'Blanco, 12 W',
    values: { tipo_montaje: 'Pared', color_carcasa: 'Blanco', potencia: '12W', proteccion_ip: 'IP20' },
  }),
  // SKU con barra y «&» (escapado y búsqueda), nombre con tilde y eñe.
  row({
    sku: 'AR/L-120 B&N',
    name: 'Ñandú Jardín',
    href: '/arq/producto/nandu-jardin?sku=AR%2FL-120%20B%26N',
    meta: 'Blanco y negro, 120 cm',
    thumb: THUMB,
    values: { ...LONGEST, color_carcasa: 'Blanco y negro', material_cuerpo: 'Aluminio' },
  }),
  // Valores largos repartidos en otra fila, para que no queden todos en la primera.
  row({
    sku: 'EMB-R-75-N-15W-36G-NW',
    name: 'Mini Tori Jardín',
    href: '/arq/producto/mini-tori-jardin?sku=EMB-R-75-N-15W-36G-NW',
    meta: 'Negro, 15 W, luz neutra 4000 K',
    thumb: THUMB,
    values: { tipo_montaje: 'Embutido en cielorraso', color_carcasa: 'Negro', potencia: '15W', temperatura_color: '4000K', dimeable: 'Si, mediante fuente DIM', tension_proveedor: 'DC 48V' },
  }),
];

// Archivos del modal: muchos y con nombres largos, o ninguno (solo «Ficha técnica»).
const MANY_FILES = [
  'Fotometría IES · óptica 24° · 2700 K',
  'Fotometría IES · óptica 36° · 2700 K',
  'Fotometría LDT (Eulumdat) · óptica 24°',
  'Plano CAD 2D (DWG) · vista frontal y lateral',
  'Modelo 3D (STEP)',
  'Modelo 3D para Revit (RFA)',
  'Manual de instalación y conexionado',
  'Declaración de conformidad',
  'Certificado de seguridad eléctrica',
  'Ficha de la fuente DALI',
  'Instructivo de mantenimiento',
  'Garantía extendida 5 años',
].map((label, i) => ({ label, href: `/demo/fixtures/archivo-${i + 1}.pdf` }));

const FILES = {
  'LSUD-120-NS-36W-WW-DALI (kit 3 m)': MANY_FILES,
  'MTORI-J-2W-WW (simple)': [],
  'KO-P-B-12W': [],
  'AR/L-120 B&N': MANY_FILES.slice(0, 3),
  'EMB-R-75-N-15W-36G-NW': MANY_FILES.slice(0, 5),
};

/** Tabla de Descargas para el modo pedido, a partir de la real. */
export function downloadsTable(mode, real) {
  if (mode === 'error') throw new Error('Peor caso (demo): la consulta falló');
  if (mode === 'empty') return { ...real, rows: [] };
  if (mode === 'one') return { ...real, rows: real.rows.slice(0, 1) };
  if (mode === 'huge') {
    const rows = [];
    for (let i = 0; rows.length < 1500; i++) {
      const source = real.rows[i % real.rows.length];
      const copy = Math.floor(i / real.rows.length);
      rows.push(copy ? { ...source, sku: `${source.sku}-R${copy}` } : source);
    }
    return { ...real, rows };
  }
  if (mode === 'worst') return { ...real, rows: [...WORST_ROWS, ...real.rows] };
  return real;
}

// Primera visita sin caché: ~3 s medidos con 2 pedidos de 250 documentos
// (decisiones.md, 2026-10-19 · Caché del catálogo entre páginas).
const FIRST_VISIT = 3000;

/**
 * Listado de Productos o Colecciones para el modo pedido, a partir del real.
 *   ?data=loading        demora la respuesta (cards de carga) y llega el real
 *   ?data=loading-one    … y llega una sola card («1 producto»)
 *   ?data=loading-empty  … y no llega ninguna (vacío)
 *   ?data=loading-error  … y la consulta falla
 */
export async function catalogListing(mode, real) {
  if (!mode.startsWith('loading')) return real;
  await new Promise((resolve) => setTimeout(resolve, FIRST_VISIT));
  if (mode === 'loading-error') throw new Error('Peor caso (demo): la consulta falló');
  if (mode === 'loading-empty') return { ...real, cards: [], count: 0 };
  if (mode === 'loading-one') return { ...real, cards: real.cards.slice(0, 1), count: 1 };
  return real;
}

/** Archivos de un SKU para el modo pedido (null: los reales). */
export function skuFiles(mode, sku) {
  if (mode === 'worst' && sku in FILES) return FILES[sku];
  return null;
}
