/* Capa de datos del configurador Daö.
   Lee las filas de la base (SKU = una fila), arma el modelo y avisa qué hay que arreglar en la base.
   Funciona en el navegador y en Node (para pruebas). */
(function (root) {
  "use strict";

  /* ---------- Configuración (lo único "a mano": presentación y piezas sin SKU) ---------- */
  const QW = { 1: "Simple", 2: "Doble", 3: "Triple" };
  const ORDEN_GRUPOS = ["DAO-E", "DAO-T", "DAO-MINI-E", "DAO-MINI-T", "DAO-E-PH", "DAO-E-DF"];
  const ORDEN_CARDS = ["DAO-E", "DAO-MINI-E", "DAO-T", "DAO-MINI-T", "DAO-C", "DAO-MINI-C", "DAO-CD", "DAO-E-DF", "DAO-E-PH"];
  const ORDEN_COLORES = ["Negro", "Blanco", "Cobre", "Bronce", "Celeste", "Grafito", "Platil"];
  const COLOR_HEX = { Negro: "#1c1c1c", Blanco: "#f4f4f2", Cobre: "#b87347", Bronce: "#7d6449", Celeste: "#a9c3d6", Grafito: "#4a4a4c", Platil: "#c9c9c4" };
  /* Piezas que hoy no tienen fila en la base. Cuando tengan SKU, completar "sku" y se leen de la base. */
  const EXTRAS = {
    bornera: { nombre: "Bornera + casquillo GU10", sku: "" },
    panal: { nombre: "Panal abeja", sku: "", venta: "Se vende x5 (según ficha)" }
  };

  const COLUMNAS_OBLIGATORIAS = ["sku", "product_name", "categoria", "grupo_variantes", "color_carcasa", "modulos", "dimensiones",
    "cabezales_compatibles", "lamparas_compatibles", "frentes_compatibles"];
  const COLUMNAS_OPCIONALES = {
    orientacion: "la orientación del cabezal",
    visto_en_cielorraso: "si el aro se ve o queda al ras",
    angulo_apertura: "el haz de la lámpara",
    temperatura_color: "el color de luz de la lámpara",
    img_hero_on: "las fotos de las piezas"
  };

  /* ---------- Utilidades ---------- */
  const clean = v => (v == null ? "" : String(v)).trim();
  const list = v => (Array.isArray(v) ? v.map(clean) : clean(v).split(",").map(s => s.trim())).filter(Boolean);
  const stripModulo = s => clean(s).replace(/\s+(Simple|Doble|Triple)$/i, "");
  const idx = (arr, v) => { const i = arr.indexOf(v); return i < 0 ? 999 : i; };

  /* Medidas legibles: "74 Ø * 26mm" -> "Ø74×26 mm" */
  function fmtSize(s) {
    s = clean(s);
    if (!s) return "";
    return s.replace(/(\d+(?:[.,]\d+)?)\s*Ø/g, "Ø$1").replace(/\s*[*xX×]\s*/g, "×").replace(/\s*mm$/i, " mm");
  }

  /* CSV con comillas y celdas de varias líneas (como exporta Google Sheets) */
  function parseCSV(text) {
    if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);
    const rows = []; let row = [], f = "", q = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (q) {
        if (c === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else q = false; }
        else f += c;
      } else if (c === '"') q = true;
      else if (c === ",") { row.push(f); f = ""; }
      else if (c === "\n" || c === "\r") {
        if (c === "\r" && text[i + 1] === "\n") i++;
        row.push(f); f = ""; rows.push(row); row = [];
      } else f += c;
    }
    if (f !== "" || row.length) { row.push(f); rows.push(row); }
    const head = rows.shift().map(h => h.trim());
    return rows.filter(r => r.some(x => x !== "")).map(r => {
      const o = {};
      head.forEach((h, i) => { if (h && !(h in o)) o[h] = r[i] == null ? "" : r[i]; });
      return o;
    });
  }

  /* ---------- Modelo ---------- */
  function buildModel(rows) {
    const warnMap = new Map();
    const W = (nivel, txt) => { if (!warnMap.has(txt)) warnMap.set(txt, { nivel, txt }); };

    const cols = rows.length ? Object.keys(rows[0]) : [];
    COLUMNAS_OBLIGATORIAS.forEach(c => { if (!cols.includes(c)) W("error", `Falta la columna “${c}” en la base.`); });
    Object.keys(COLUMNAS_OPCIONALES).forEach(c => { if (!cols.includes(c)) W("aviso", `Falta la columna “${c}”: no se puede mostrar ${COLUMNAS_OPCIONALES[c]}.`); });

    const bySku = {};
    rows.forEach(r => {
      const raw = r.sku == null ? "" : String(r.sku);
      const sku = clean(raw);
      if (!(sku.startsWith("DAO-") || sku.startsWith("PAR11-"))) return;
      if (raw !== sku) W("aviso", `El SKU “${sku}” tiene espacios o saltos de línea; conviene limpiarlo.`);
      bySku[sku] = {
        sku,
        nombre: clean(r.product_name),
        categoria: clean(r.categoria),
        grupo: clean(r.grupo_variantes),
        color: clean(r.color_carcasa),
        modulos: parseInt(clean(r.modulos), 10) || 1,
        dim: clean(r.dimensiones),
        cabezales: list(r.cabezales_compatibles),
        lamparas: list(r.lamparas_compatibles),
        frentes: list(r.frentes_compatibles),
        orientacion: clean(r.orientacion),
        visto: clean(r.visto_en_cielorraso),
        haz: clean(r.angulo_apertura),
        luz: clean(r.temperatura_color),
        img: clean(r.img_hero_on) || clean(r.img_hero_off)
      };
    });
    const all = Object.values(bySku);
    all.filter(x => x.sku.startsWith("DAO-") && !x.categoria).forEach(x => W("error", `${x.sku}: falta la categoría (Aro, Cabezal o Accesorio).`));

    /* Aros agrupados por grupo_variantes */
    const aros = all.filter(x => x.sku.startsWith("DAO-") && (x.categoria === "Aro" || x.categoria === "Accesorio"));
    const gmap = {};
    aros.forEach(a => { (gmap[a.grupo] = gmap[a.grupo] || []).push(a); });
    const groups = Object.keys(gmap).sort((a, b) => idx(ORDEN_GRUPOS, a) - idx(ORDEN_GRUPOS, b)).map(id => {
      const rs = gmap[id];
      return {
        id,
        name: stripModulo(rs[0].nombre) || id,
        rows: rs,
        modulos: [...new Set(rs.map(r => r.modulos))].sort((a, b) => a - b),
        colores: [...new Set(rs.map(r => r.color))].sort((a, b) => idx(ORDEN_COLORES, a) - idx(ORDEN_COLORES, b))
      };
    });

    /* Tarjetas de arriba (aros + cabezales) */
    const cmap = {};
    all.filter(x => x.sku.startsWith("DAO-") && ["Aro", "Accesorio", "Cabezal"].includes(x.categoria)).forEach(x => { (cmap[x.grupo] = cmap[x.grupo] || []).push(x); });
    const cards = Object.keys(cmap).sort((a, b) => idx(ORDEN_CARDS, a) - idx(ORDEN_CARDS, b)).map(id => {
      const rs = cmap[id];
      return { id, name: stripModulo(rs[0].nombre) || id, img: (rs.find(r => r.img) || {}).img || "" };
    });

    const refs = arr => arr.map(s => bySku[s]).filter(Boolean);
    const M = {
      bySku, groups, cards, extras: EXTRAS, QW, COLOR_HEX, fmtSize,
      group: id => groups.find(g => g.id === id),
      colorsFor: (gid, qty) => { const g = M.group(gid); return g.colores.filter(c => g.rows.some(r => r.modulos === qty && r.color === c)); },
      aro: (gid, qty, color) => M.group(gid).rows.find(r => r.modulos === qty && r.color === color),
      cabezales: row => refs(row.cabezales),
      lamparas: row => refs(row.lamparas),
      frente: (lamp, color) => refs(lamp.frentes).find(f => f.color === color) || null,
      warnings: []
    };

    /* ---------- Validaciones: avisan qué hay que arreglar en la base (agrupadas) ---------- */
    const acc = new Map(); // etiqueta -> {nivel, items:Set}
    const A = (nivel, label, item) => { if (!acc.has(label)) acc.set(label, { nivel, items: new Set() }); acc.get(label).items.add(item); };
    const checkRefs = (owner, arr, tipo) => arr.forEach(s => { if (!bySku[s]) A("error", `“${s}” figura como ${tipo} compatible pero no existe como fila en la base`, owner.sku); });
    const hasCol = c => cols.includes(c);
    const lampColors = new Map(); // lámpara -> colores de aro que llegan a ella
    const reach = (l, a) => { if (!lampColors.has(l.sku)) lampColors.set(l.sku, new Set()); lampColors.get(l.sku).add(a.color); };
    aros.forEach(a => {
      checkRefs(a, a.cabezales, "cabezal");
      checkRefs(a, a.lamparas, "lámpara");
      const cabs = M.cabezales(a);
      const lamps = cabs.length ? [] : M.lamparas(a);
      if (!cabs.length && !lamps.length) A("error", "Aros sin cabezales ni lámparas compatibles (no se pueden armar)", a.sku);
      if (hasCol("visto_en_cielorraso") && !a.visto) A("aviso", 'Falta “visto_en_cielorraso” en estos aros', a.sku);
      if (!a.dim) A("aviso", 'Falta “dimensiones” en estos aros', a.sku);
      cabs.forEach(c => {
        checkRefs(c, c.lamparas, "lámpara");
        if (!M.lamparas(c).length) A("error", "Cabezales sin lámparas compatibles", c.sku);
        if (hasCol("orientacion") && !c.orientacion) A("aviso", 'Falta “orientacion” en estos cabezales', c.sku);
        M.lamparas(c).forEach(l => reach(l, a));
      });
      lamps.forEach(l => reach(l, a));
    });
    lampColors.forEach((colors, sku) => {
      const l = bySku[sku];
      if (!l.nombre) A("aviso", 'Falta “product_name” (se muestra el SKU en su lugar) en estas lámparas y frentes', sku);
      if (hasCol("angulo_apertura") && !l.haz) A("aviso", 'Falta “angulo_apertura” en estas lámparas', sku);
      if (hasCol("temperatura_color") && !l.luz) A("aviso", 'Falta “temperatura_color” en estas lámparas', sku);
      checkRefs(l, l.frentes, "frente");
      if (l.frentes.length) {
        const frs = refs(l.frentes);
        frs.forEach(f => { if (!f.nombre) A("aviso", 'Falta “product_name” (se muestra el SKU en su lugar) en estas lámparas y frentes', f.sku); });
        const sin = [...colors].filter(c => !frs.some(f => f.color === c));
        if (sin.length) A("aviso", `Aros de estos colores no tienen frente cargado: ${sin.join(", ")}. Lámpara`, sku);
      }
    });
    acc.forEach((v, label) => {
      const it = [...v.items];
      W(v.nivel, `${label} (${it.length}): ${it.slice(0, 6).join(", ")}${it.length > 6 ? ", …" : ""}`);
    });
    M.warnings = [...warnMap.values()].sort((a, b) => (a.nivel === b.nivel ? 0 : a.nivel === "error" ? -1 : 1));
    return M;
  }

  /* ---------- Typesense ---------- */
  const TS_CAMPOS = ["sku", "familia", "product_name", "categoria", "grupo_variantes", "color_carcasa", "modulos", "tamanio", "dimensiones",
    "cabezales_compatibles", "lamparas_compatibles", "frentes_compatibles", "orientacion", "visto_en_cielorraso",
    "angulo_apertura", "temperatura_color", "multimagen_producto"];
  const CAMPOS_REL = ["cabezales_compatibles", "lamparas_compatibles", "frentes_compatibles"];
  const bt = s => "`" + s + "`";

  /* Documento de Typesense -> fila con los mismos nombres que la hoja (así el modelo es el mismo para CSV y Typesense) */
  function fromDoc(d) {
    const imgs = Array.isArray(d.multimagen_producto) ? d.multimagen_producto : [];   // [0] = foto apagada, [1] = foto prendida
    return {
      sku: d.sku, product_name: d.product_name, categoria: d.categoria, grupo_variantes: d.grupo_variantes,
      color_carcasa: d.color_carcasa, modulos: d.modulos,
      dimensiones: d.tamanio || d.dimensiones,                                         // el sitio puede usar cualquiera de los dos
      cabezales_compatibles: d.cabezales_compatibles, lamparas_compatibles: d.lamparas_compatibles, frentes_compatibles: d.frentes_compatibles,
      orientacion: d.orientacion, visto_en_cielorraso: d.visto_en_cielorraso,
      angulo_apertura: d.angulo_apertura, temperatura_color: d.temperatura_color,
      img_hero_off: imgs[0] || "", img_hero_on: imgs[1] || ""
    };
  }

  /* Trae toda la familia Daö y después las piezas referenciadas que no sean de esa familia (PAR11, frentes).
     Solo filtra por campos indexados (familia, sku). */
  async function loadTypesense(cfg) {
    const url = `${cfg.protocol || "https"}://${cfg.host}${cfg.port ? ":" + cfg.port : ""}/collections/${cfg.collection}/documents/search`;
    const buscar = async params => {
      const q = new URLSearchParams(Object.assign({ q: "*", query_by: "sku", include_fields: TS_CAMPOS.join(",") }, params));
      const r = await fetch(url + "?" + q.toString(), { headers: { "X-TYPESENSE-API-KEY": cfg.apiKey } });
      if (!r.ok) throw new Error("Typesense respondió " + r.status);
      return r.json();
    };
    const docs = new Map();
    for (let page = 1; ; page++) {
      const j = await buscar({ filter_by: `familia:=${bt(cfg.familia || "Dao")}`, per_page: 250, page });
      j.hits.forEach(h => docs.set(h.document.sku, h.document));
      if (page * 250 >= j.found || !j.hits.length) break;
    }
    for (let ronda = 0; ronda < 4; ronda++) {
      const faltan = new Set();
      docs.forEach(d => CAMPOS_REL.forEach(f => list(d[f]).forEach(s => { if (!docs.has(s)) faltan.add(s); })));
      if (!faltan.size) break;
      const antes = docs.size;
      const j = await buscar({ filter_by: `sku:=[${[...faltan].map(bt).join(",")}]`, per_page: 250 });
      j.hits.forEach(h => docs.set(h.document.sku, h.document));
      if (docs.size === antes) break;                                                   // lo que falta no existe en la colección
    }
    return [...docs.values()].map(fromDoc);
  }

  async function load() {
    if (root.TYPESENSE) return loadTypesense(root.TYPESENSE);
    if (root.BASE_CSV_URL) {
      const r = await fetch(root.BASE_CSV_URL);
      if (!r.ok) throw new Error("No se pudo leer el CSV (" + r.status + ")");
      return parseCSV(await r.text());
    }
    return root.BASE_ROWS || [];
  }

  root.Base = { parseCSV, buildModel, load, loadTypesense, fromDoc, fmtSize };
  if (typeof module !== "undefined" && module.exports) module.exports = root.Base;
})(typeof window !== "undefined" ? window : globalThis);
