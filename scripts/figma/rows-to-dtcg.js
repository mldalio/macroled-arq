// node scripts/figma/rows-to-dtcg.js <respuesta.json>...
// Convierte las respuestas de export-variables.figma.js (filas compactas por
// colección) en un archivo DTCG por colección y modo:
//   tokens/figma/<colección>.<modo>.json   (p. ej. 2-semantic-color.dark.json)
// Cada respuesta puede ser un objeto o una lista de objetos. Las partes de una
// misma colección (FROM / TO) se juntan; si falta alguna variable, corta con error.

import { readFile, writeFile, mkdir } from 'node:fs/promises';

const OUT_DIR = new URL('../../tokens/figma/', import.meta.url);
const TYPES = { COLOR: 'color', FLOAT: 'number', STRING: 'string', BOOLEAN: 'boolean' };

const slug = (text) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const files = process.argv.slice(2);
if (!files.length) {
  console.error('Uso: node scripts/figma/rows-to-dtcg.js <respuesta.json>...');
  process.exit(1);
}

const collections = new Map();
for (const file of files) {
  const data = JSON.parse(await readFile(file, 'utf8'));
  for (const part of [data].flat()) {
    const entry = collections.get(part.col) ?? { modes: part.modes, total: part.total, rows: [] };
    entry.rows.push(...part.rows);
    collections.set(part.col, entry);
  }
}

await mkdir(OUT_DIR, { recursive: true });
const written = [];
for (const [name, { modes, total, rows }] of collections) {
  const names = new Set(rows.map((r) => r[0]));
  if (names.size !== total) {
    console.error(`${name}: llegaron ${names.size} de ${total} variables (falta una parte).`);
    process.exit(1);
  }
  for (const [i, mode] of modes.entries()) {
    const root = { $extensions: { 'com.figma': { collection: name, mode } } };
    for (const [varName, resolvedType, values, description, scopes, web] of rows) {
      const type = TYPES[resolvedType];
      if (!type) throw new Error(`${varName}: tipo ${resolvedType} desconocido`);
      const path = varName.split('/');
      let node = root;
      for (const key of path.slice(0, -1)) node = node[key] ??= {};
      const token = { $type: type, $value: values[i] };
      if (description) token.$description = description;
      const figma = { scopes };
      if (web) figma.codeSyntax = { WEB: web };
      token.$extensions = { 'com.figma': figma };
      node[path.at(-1)] = token;
    }
    const file = `${slug(name)}.${slug(mode)}.json`;
    written.push(file);
    await writeFile(new URL(file, OUT_DIR), `${JSON.stringify(root, null, 2)}\n`);
  }
}
console.log(`${written.length} archivos en tokens/figma/:\n- ${written.join('\n- ')}`);
