// Bajadas del listado de Productos: una por subcategoría (aplicación o tipo
// dentro de Interior, Exterior y Lámparas y artefactos) y una por colección.
// El grupo («Todo interior»…) usa el data-arq-description de su HTML.
// TODO (datos): provisorias en código hasta que cada bajada venga de Typesense.
// Las claves van en minúsculas y sin tildes (`key()`); las de subcategoría
// llevan el grupo: `interior/embutir`.

export const key = (text) => String(text ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toLowerCase();

const SUBCATEGORIES = {
  'interior/embutir': 'Luminarias a ras del cielorraso: aros simples, dobles y trimless, cabezales direccionables y accesorios.',
  'interior/aplicar': 'Luminarias que se montan sobre la superficie, para sumar luz de forma directa en techo, pared o piso.',
  'interior/colgante': 'Luminarias suspendidas del techo que concentran la luz sobre un punto del espacio, como una mesa.',
  'interior/artefactos': 'Accesorios y artefactos para completar las luminarias de interior.',
  'interior/lamparas': 'Lámparas para las luminarias de interior que las usan.',
  'exterior/jardin': 'Bolardos y estacas que marcan recorridos y resaltan la vegetación con una luz baja, sin deslumbrar.',
  'exterior/pared': 'Luminarias de pared para fachadas, accesos, galerías y pasos, que acompañan la arquitectura desde el muro.',
  'exterior/artefactos': 'Accesorios y artefactos para completar las luminarias de exterior.',
  'exterior/lamparas': 'Lámparas para las luminarias de exterior que las usan.',
  'lamparas-artefactos/lampara': 'Lámparas mini dicroicas PAR11 de luz cálida, con versión dim to warm.',
  'lamparas-artefactos/artefacto': 'Accesorios para completar lámparas PAR11.',
};

const COLLECTIONS = {
  dao: 'Sistema modular de embutir que combina aros simples, dobles y triples, con terminación trimless o con marco, en versión estándar y Mini.',
  'mini kai': 'Luminarias compactas para embutir y aplicar, en formato cuadrado y Round, con una luz cálida y discreta que se integra al cielorraso.',
  'par 11': 'Lámparas mini dicroicas con frentes de cerámica. La versión dim to warm entibia la luz a medida que se regula, como una lámpara incandescente.',
  tori: 'Estacas de jardín para plantas bajas y nivel de cantero, con una visera antideslumbrante opcional que cuida la mirada.',
  kanu: 'Bolardo de jardín y luz de pared de diseño vertical, que controla la emisión de luz y reduce el deslumbramiento.',
  fuji: 'Spot de aplicar sobre el cielorraso, de presencia discreta, para acentuar un objeto o una zona del ambiente.',
  ugoki: 'Spot de aplicar sobre el cielorraso, de presencia discreta, para acentuar un objeto o una zona del ambiente.',
  sen: 'Downlight de embutir que ilumina el ambiente con una luz cálida y pareja, sin llamar la atención.',
  afo: 'Una línea de luz que dibuja el espacio. Diseño minimalista para destacar muros, pasillos y detalles arquitectónicos.',
  yoru: 'Bolardo que marca un punto de luz en un camino o sendero, con una presencia vertical y precisa.',
  nobu: 'Bolardo con un hueco transversal que deja pasar la luz y la dibuja sobre el recorrido del jardín.',
  nami: 'Luminaria de embutir regulable, con luz cálida y un haz concentrado para destacar lo que importa.',
  koen: 'Luminaria de pared de gran escala, pensada para la fachada, junto a una doble puerta de entrada o un ventanal.',
  sento: 'Bolardo decorativo para rodear de plantas, que suma una luz cálida y suave al jardín.',
  hoshi: 'Luminaria de embutir de efecto de punto de luz: no ilumina grandes superficies, acompaña como un detalle.',
  douli: 'Una luz que cuelga sobre la mesa y reúne: crea un círculo cálido de intimidad en comedores, islas de cocina, restaurantes y salas de reunión.',
};

export const subcategoryDescription = (group, label) => SUBCATEGORIES[`${group}/${key(label)}`] ?? '';
export const collectionDescription = (name) => COLLECTIONS[key(name)] ?? '';
