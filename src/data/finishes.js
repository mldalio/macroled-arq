// Imagen de cada acabado (docs/acabados.md · DESIGN.md §8 · Acabados de producto).
//
// Único archivo de mapeo: el nombre que viene de Sheets («Negro», «Gris Grafito»)
// → archivo de imagen. El nombre NO se toca: la ficha y las cards siguen mostrando
// lo que dice la base; solo cambia qué imagen se pide.
//
//   finishImage('Negro', 'Yoru')    → …/acabado-negro-mate.png
//   finishImage('Negro', 'Dao')     → …/acabado-negro.png
//   finishImage('Rosa', 'Yoru')     → null (sin imagen: el swatch muestra el neutro)
//
// Dos pasos:
// 1. SLUGS: nombre del acabado → imagen base.
// 2. BY_FAMILY: la misma palabra puede ser otro acabado según la familia del
//    producto (campo `familia`). Hoy solo pasa con el negro: mate en unas
//    familias y metálico (DAO) en el resto.

import { config } from '../config.js';
import { normalize } from './text.js';

const clean = (text) => normalize(text).replace(/\s+/g, ' ').trim();

// Nombre normalizado (minúsculas, sin tildes) → slug del archivo `acabado-<slug>.png`.
// Un nombre que no está acá no tiene imagen (se ve el neutro con el nombre).
// TODO (acabados): «Negro satinado» y «Blanco y negro» (aparecen en los datos de
// ejemplo) no tienen imagen; falta confirmar si son acabados reales.
const SLUGS = Object.freeze({
  negro: 'negro',
  blanco: 'blanco',
  cobre: 'cobre',
  bronce: 'bronce',
  celeste: 'celeste',
  grafito: 'grafito',
  'gris grafito': 'grafito',
  platil: 'platil',
  verde: 'verde',
  terracota: 'terracota',
  beige: 'beige',
  pardo: 'pardo',
});

// Familias (campo `familia`, comparación sin tildes ni mayúsculas) que usan el
// negro mate. La comparación es exacta: «Tori» no incluye una familia que se llame
// «Mini Tori». Hoy en la base «Mini Tori Jardín» tiene familia «Tori», así que entra;
// si algún día una familia nueva usa el negro mate, se agrega acá.
const MATTE_BLACK_FAMILIES = ['Kanu', 'Nobu', 'Tori', 'Koen', 'Douli', 'Yoru', 'Sento'];

// slug base → reglas por familia. La primera que incluya la familia gana; si
// ninguna, vale el slug base.
const BY_FAMILY = Object.freeze({
  negro: [{ slug: 'negro-mate', families: MATTE_BLACK_FAMILIES.map(clean) }],
});

/** Slug de la imagen del acabado para una familia, o null si el nombre no está mapeado. */
export function finishSlug(name, family = '') {
  const base = SLUGS[clean(name)];
  if (!base) return null;
  const rule = (BY_FAMILY[base] ?? []).find(({ families }) => families.includes(clean(family)));
  return rule ? rule.slug : base;
}

/** URL de la imagen del acabado, o null (el swatch muestra el neutro con el nombre). */
export function finishImage(name, family = '') {
  const slug = finishSlug(name, family);
  return slug ? `${config.images.finishesBase}acabado-${slug}.png` : null;
}
