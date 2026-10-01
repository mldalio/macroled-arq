// Código para correr en Figma con la herramienta use_figma del MCP (solo lectura).
// No se ejecuta con Node: se copia tal cual en use_figma, cambiando COL, FROM y TO.
//
// Devuelve las variables de UNA colección en filas compactas:
//   [nombre, resolvedType, [valor por modo], descripción, scopes, codeSyntax.WEB]
// Colores en hex (#rrggbb o #rrggbbaa), alias como {grupo.nombre}.
//
// La respuesta de use_figma se corta a los 20 KB: se pide una colección por
// llamada y las grandes (1 · Primitive · Color) en dos partes con FROM / TO.
// Cada respuesta se guarda como JSON y se convierte con:
//   node scripts/figma/rows-to-dtcg.js <respuesta.json>...
// Para listar las colecciones y sus ids:
//   const cols = await figma.variables.getLocalVariableCollectionsAsync();
//   return cols.map((c) => ({ name: c.name, id: c.id, n: c.variableIds.length }));

const COL = 'VariableCollectionId:000:0000'; // id de la colección
const FROM = 0;
const TO = 999;

const col = await figma.variables.getVariableCollectionByIdAsync(COL);
const hex = (c) => {
  const h = (x) => Math.round(x * 255).toString(16).padStart(2, '0');
  return '#' + h(c.r) + h(c.g) + h(c.b) + (c.a !== undefined && c.a < 1 ? h(c.a) : '');
};
const conv = async (v) => {
  if (v && typeof v === 'object' && v.type === 'VARIABLE_ALIAS') {
    const t = await figma.variables.getVariableByIdAsync(v.id);
    return '{' + t.name.split('/').join('.') + '}';
  }
  if (v && typeof v === 'object' && 'r' in v) return hex(v);
  return v;
};
const rows = [];
for (const id of col.variableIds.slice(FROM, TO)) {
  const v = await figma.variables.getVariableByIdAsync(id);
  const vals = [];
  for (const m of col.modes) vals.push(await conv(v.valuesByMode[m.modeId]));
  rows.push([v.name, v.resolvedType, vals, v.description || '', v.scopes, (v.codeSyntax && v.codeSyntax.WEB) || '']);
}
return { col: col.name, modes: col.modes.map((m) => m.name), total: col.variableIds.length, rows };
