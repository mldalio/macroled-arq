// Dibujo con cotas de un SKU para la ficha técnica en PDF (src/pdf/).
//
// Los dibujos son PNG en el servidor de imágenes (config.images.cotasBase):
// uno por medida (`KANU_bolardo_J-500_12W.png`) y uno por familia con todas
// las medidas juntas (`KANU.png`). Los nombres no siguen el SKU ni hay columna
// en la base, así que este archivo es el único lugar que los relaciona
// (decisiones.md, 2026-10-27 · Ficha técnica con cotas).
//
//   cotaUrl('KANU-J-500-12W-N-WW') → '…/cotas/KANU_bolardo_J-500_12W.png'
//   cotaUrl('KAI-M-A-7W-35G-N-WW') → null (sin dibujo: la ficha sale sin cotas)
//
// Cada regla es un patrón sobre el SKU (tratado como texto, sin derivar nada
// más) y el archivo; $1, $2 toman lo que capturó el patrón. Gana la primera
// que coincide: las de una medida van antes que las de familia.

import { config } from '../config.js';

const RULES = [
  [/^AFO-A-7W-/, 'AFO_7W'],
  [/^FUJI-A-20W-/, 'FUJI_20W'],
  // TODO (datos): el archivo se llama 12W pero dibuja la de 7 W (Ø7 × 10 cm).
  [/^FUJI-A-7W-/, 'FUJI_12W'],
  [/^UGOKI-A-(7|12)W-/, 'UGOKI_$1W'],
  [/^NAMI-E-(12|15)W-/, 'NAMI_$1W'],
  [/^HOSHI-E-(3|7|12)W-/, 'HOSHI_$1W'],
  [/^DAO-E-X([12])-/, 'DAO-E_x$1'],
  [/^DAO-T-X([12])-/, 'DAO-trimless_x$1'],
  [/^DAO-MINI-E-X([123])-/, 'DAO-mini_x$1'],
  [/^DAO-MINI-T-X([123])-/, 'DAO-trimless-mini_x$1'],
  [/^DAO-MINI-C-/, 'DAO_MINI-C-B'],
  [/^DAO-C-/, 'DAO_C'],
  [/^DAO-CD-/, 'DAO_cabezal'],
  [/^DAO-E-DF-/, 'DAO-E-DF'],
  [/^DAO-E-PH-/, 'DAO-E-H'],
  [/^DOULI-C-(12|15|18)W-/, 'DOULI_$1W'],
  [/^KANU-J-(500|900)-12W-/, 'KANU_bolardo_J-$1_12W'],
  [/^KANU-P-350-12W-/, 'KANU_P-350_12W'],
  [/^KANU-P-500-15W-/, 'KANU_P-500_15W'],
  [/^KOEN-P-20W-/, 'KOEN_20W'],
  [/^NOBU-J-12W-/, 'NOBU_12W'],
  [/^SENTO-J-(520|820)-12W-/, 'SENTO_J-$1_12W'],
  [/^TORI-J-(400|600|800)-([37])W-/, 'TORI_$1_$2W'],
  [/^YORU-J-8W-/, 'YORU_8W'],
  // Familias sin dibujo por medida.
  [/^PAR11-/, 'PAR11'],
];

/** Nombre del archivo de cotas de un SKU, sin extensión; null si no tiene. */
export function cotaFile(sku) {
  const code = String(sku ?? '').trim().toUpperCase();
  for (const [pattern, file] of RULES) {
    const match = code.match(pattern);
    if (match) return file.replace(/\$(\d)/g, (_, i) => match[i]);
  }
  return null;
}

/** URL del dibujo con cotas de un SKU; null si no tiene. */
export function cotaUrl(sku) {
  const file = cotaFile(sku);
  return file ? `${config.images.cotasBase}${file}.png` : null;
}
