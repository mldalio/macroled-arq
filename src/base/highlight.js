// Resalta en un texto lo que coincide con lo que escribió el usuario.
//
//   highlight('Käfer Jardín', 'ka jar')  →  '<span class="match role-body-medium">Kä</span>fer <span …>Jar</span>dín'
//
// - Coincide sin importar mayúsculas ni tildes ("ka" marca "Kä"), con cada
//   palabra de la búsqueda en cualquier lugar del texto.
// - Devuelve HTML ya escapado; si nada coincide, el texto sin marcas.
// - La marca es un <span class="match role-body-medium">: quien lo usa le da
//   el color (color/text/primary) en su CSS. Una marca por tramo, sin cambiar
//   el largo del texto.

const esc = (text) => text.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

// Letra base en minúscula y sin tilde. Un carácter por carácter, para que los
// índices del texto y del normalizado coincidan.
const base = (char) => char.normalize('NFD')[0].toLowerCase()[0];

export function highlight(text, term) {
  const chars = [...String(text ?? '')];
  const words = [...new Set([...String(term ?? '').trim()].map(base).join('').split(/\s+/).filter(Boolean))];
  if (!words.length) return esc(chars.join(''));
  const normal = chars.map(base).join('');
  const marked = new Array(chars.length).fill(false);
  for (const word of words) {
    for (let at = normal.indexOf(word); at !== -1; at = normal.indexOf(word, at + 1)) {
      for (let i = at; i < at + word.length; i++) marked[i] = true;
    }
  }
  let html = '';
  for (let i = 0; i < chars.length; ) {
    let j = i;
    while (j < chars.length && marked[j] === marked[i]) j++;
    const part = esc(chars.slice(i, j).join(''));
    html += marked[i] ? `<span class="match role-body-medium">${part}</span>` : part;
    i = j;
  }
  return html;
}
