const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const lc = s => String(s).toLowerCase();

let M;                                   // modelo armado desde la base (ver base.js)
let cs = { g: null, qty: 1, col: null, cab: null, lamp: null };
let layout = "1", tab = "cfg";

/* ---------- Estado: cada elección depende de la anterior, todo sale de la base ---------- */
function resolve() {
  const G = M.group(cs.g);
  if (!G.modulos.includes(cs.qty)) cs.qty = G.modulos[0];
  const colores = M.colorsFor(G.id, cs.qty);
  if (!colores.includes(cs.col)) cs.col = colores[0];
  const aro = M.aro(G.id, cs.qty, cs.col);

  const cabs = M.cabezales(aro);                                  // paso 2: cabezales del aro (columna cabezales_compatibles)
  const cab = cabs.length ? (cabs.find(c => c.grupo === cs.cab) || cabs[0]) : null;
  cs.cab = cab ? cab.grupo : null;

  const lamps = M.lamparas(cab || aro);                           // paso 3: lámparas del cabezal (o del aro si no lleva cabezal)
  const lamp = lamps.find(l => l.sku === cs.lamp) || lamps[0] || null;
  cs.lamp = lamp ? lamp.sku : null;

  const hasFrente = !!lamp && lamp.frentes.length > 0;            // paso 4: frente de la lámpara, del color del aro
  const frente = hasFrente ? M.frente(lamp, aro.color) : null;
  return { G, colores, aro, cabs, cab, lamps, lamp, hasFrente, frente, units: aro.modulos };
}

/* Una pieza "extra" (bornera, panal) sale de la base si ya tiene SKU; si no, queda como texto fijo. */
function extra(key) {
  const e = M.extras[key], r = e.sku && M.bySku[e.sku];
  return r ? { n: r.nombre || e.nombre, s: r.sku, c: "" }
           : { n: e.nombre, s: key === "panal" && e.venta ? e.venta : "Sin código en catálogo", c: key === "panal" ? "Unidad de venta a confirmar" : "Código a confirmar" };
}

/* ---------- Tarjetas de arriba ---------- */
const imgOrText = (src, text) => src
  ? `<img src="${esc(src)}" alt="${esc(text)}" loading="lazy" onerror="this.parentNode.classList.add('noimg');this.replaceWith(document.createTextNode(this.alt))">`
  : esc(text);
const cardsHTML = () => `<div class="cards">${M.cards.map(c =>
  `<a class="card" href="#" data-ficha="${esc(c.name)}"><div class="ph">${imgOrText(c.img, c.name)}</div></a>`).join("")}</div>`;

/* ---------- Configurador ---------- */
function cfgHTML() {
  const S = resolve(), { G, colores, aro, cabs, cab, lamps, lamp, units } = S;
  const btn = (k, v, label, sub, on) => `<button type="button" class="opt" data-c="${k}" data-val="${esc(v)}" aria-pressed="${on}">${esc(label)}${sub ? `<small>${esc(sub)}</small>` : ""}</button>`;
  let i = 0;
  const grp = (t, body) => `<div class="cfg-g"><h3><span>${++i}</span>${t}</h3>${body}</div>`;

  const aroBody = `<div class="opts">${M.groups.map(g => btn("g", g.id, g.name, g.id.replace(/^DAO-/, ""), cs.g === g.id)).join("")}</div>`
    + (G.modulos.length > 1 ? `<p class="sub">Módulos</p><div class="opts">${G.modulos.map(q => btn("qty", q, M.QW[q] || q + " módulos", "x" + q, cs.qty === q)).join("")}</div>` : "")
    + `<p class="sub">Terminación</p><div class="opts">${colores.map(c => `<button type="button" class="sw" data-c="col" data-val="${esc(c)}" aria-pressed="${cs.col === c}"><i style="background:${M.COLOR_HEX[c] || "#bbb"}"></i>${esc(c)}</button>`).join("")}</div>`;

  let opts = grp("Aro", aroBody);
  opts += grp("Cabezal", cabs.length
    ? `<div class="opts">${cabs.map(c => btn("cab", c.grupo, c.nombre || c.sku, c.orientacion, cs.cab === c.grupo)).join("")}</div>`
    : `<div class="empty">Este aro no lleva cabezal: la lámpara va directo al aro.</div>`);
  opts += grp("Lámpara PAR11", lamps.length
    ? `<div class="opts">${lamps.map(l => btn("lamp", l.sku, l.nombre || l.sku, l.luz, cs.lamp === l.sku)).join("")}</div>`
    : `<div class="empty">No hay lámparas cargadas para este armado.</div>`);
  opts += grp("Frente y panal", S.hasFrente
    ? `<p class="auto">Se suman solos: esta lámpara pide frente y panal como accesorios requeridos.</p>`
    : `<p class="auto">Esta lámpara no lleva frente ni panal.</p>`);

  /* Piezas del armado: cantidad = módulos del aro */
  const qtyWord = G.modulos.length > 1 ? lc(M.QW[cs.qty] || cs.qty + " módulos") + " " : "";
  const aroName = `${G.name} ${qtyWord}${lc(aro.color)}`.replace(/\s+/g, " ").trim();
  const list = [{ q: 1, n: aroName, s: aro.sku }];
  if (cab) { const b = extra("bornera"); list.push({ q: units, n: b.n, s: b.s, c: b.c }); list.push({ q: units, n: `${cab.nombre || cab.sku} ${lc(aro.color)}`, s: cab.sku }); }
  if (lamp) list.push({ q: units, n: lamp.nombre || lamp.sku, s: lamp.sku });
  if (S.hasFrente) {
    if (S.frente) list.push({ q: units, n: `${S.frente.nombre || "Frente"} ${lc(aro.color)}`, s: S.frente.sku });
    else list.push({ q: units, n: "Frente para este color", s: `Sin frente cargado en ${lc(aro.color)}`, c: "Color del frente a confirmar" });
    const p = extra("panal"); list.push({ q: units, n: p.n, s: p.s, c: p.c });
  }

  const dl = [
    ["Haz", lamp && lamp.haz], ["Color de luz", lamp && lamp.luz],
    ["Orientación", cab && cab.orientacion], ["En el cielorraso", aro.visto], ["Medida del aro", M.fmtSize(aro.dim)]
  ].filter(r => r[1]).map(r => `<dt>${r[0]}</dt><dd>${esc(r[1])}</dd>`).join("");

  const thumb = (r, label) => `<figure class="t"><div class="im">${imgOrText(r && r.img, label)}</div><figcaption>${esc(label)}</figcaption></figure>`;
  const res = `
    <div class="thumbs">${thumb(aro, aroName)}${cab ? thumb(cab, cab.nombre || cab.sku) : thumb(lamp, lamp ? (lamp.nombre || lamp.sku) : "Lámpara")}</div>
    <h3>${esc(aroName.charAt(0).toUpperCase() + aroName.slice(1))}${cab ? ", " + esc(cab.nombre || cab.sku) : ""}</h3>
    <dl class="res">${dl}</dl>
    <h4>Piezas para este armado</h4>
    <ul class="plist">${list.map(p => `<li><a href="#" data-ficha="${esc(p.n)}"><span class="q">${p.q}×</span><span>${esc(p.n)}<span class="s">${esc(p.s)}</span>${p.c ? `<span class="conf">${esc(p.c)}</span>` : ""}</span><span class="g">Ver ficha</span></a></li>`).join("")}</ul>`;
  return `<div class="cfg"><div class="cfg-opts">${opts}</div><aside class="cfg-res" aria-live="polite">${res}</aside></div>`;
}

/* ---------- Layouts ---------- */
function render(focusSel) {
  if (layout === "1") {
    $("#layout").innerHTML = cardsHTML() + `<section class="cfg-sec"><h2>Armá tu Daö</h2>${cfgHTML()}</section>`;
  } else {
    $("#layout").innerHTML = `
      <div class="tabs" role="tablist" aria-label="Contenido de la colección">
        <button type="button" role="tab" id="t-cfg" aria-controls="p-cfg" data-tab="cfg" aria-selected="${tab === "cfg"}">Configurador</button>
        <button type="button" role="tab" id="t-prod" aria-controls="p-prod" data-tab="prod" aria-selected="${tab === "prod"}">Productos</button>
      </div>
      <div role="tabpanel" id="p-${tab}" aria-labelledby="t-${tab}" class="cfg-sec in-tab">${tab === "cfg" ? cfgHTML() : cardsHTML()}</div>`;
  }
  bind();
  if (focusSel) { const el = document.querySelector(focusSel); if (el) el.focus(); }
}
function bind() {
  document.querySelectorAll("[data-c]").forEach(b => b.onclick = () => {
    const k = b.dataset.c, v = b.dataset.val;
    cs[k] = k === "qty" ? Number(v) : v;
    render(`[data-c="${k}"][data-val="${v}"]`);
  });
  document.querySelectorAll("[data-tab]").forEach(b => b.onclick = () => { tab = b.dataset.tab; render(`[data-tab="${tab}"]`); });
}
document.querySelectorAll("[data-layout]").forEach(b => b.onclick = () => {
  layout = b.dataset.layout;
  document.querySelectorAll("[data-layout]").forEach(x => x.setAttribute("aria-pressed", x === b));
  render();
});

/* ---------- Links a fichas (simulados) ---------- */
let t;
document.addEventListener("click", e => {
  const a = e.target.closest("[data-ficha]"); if (!a) return;
  e.preventDefault();
  const el = $("#toast"); el.textContent = `En el sitio, esto abre la ficha de: ${a.dataset.ficha}`;
  el.classList.add("on"); clearTimeout(t); t = setTimeout(() => el.classList.remove("on"), 2200);
});

/* ---------- Panel "Revisión de la base" (solo para la demo) ---------- */
function renderAvisos() {
  const w = M.warnings, btn = $("#btn-avisos"), box = $("#avisos");
  const err = w.filter(x => x.nivel === "error").length;
  btn.textContent = w.length ? `Revisión de la base: ${err} errores, ${w.length - err} avisos` : "Revisión de la base: sin avisos";
  btn.dataset.estado = err ? "error" : w.length ? "aviso" : "ok";
  box.innerHTML = w.length
    ? `<ul>${w.map(x => `<li class="${x.nivel}"><b>${x.nivel === "error" ? "Error" : "Aviso"}</b> ${esc(x.txt)}</li>`).join("")}</ul>`
    : `<p>La base tiene todo lo que necesita el configurador.</p>`;
  btn.onclick = () => { box.hidden = !box.hidden; btn.setAttribute("aria-expanded", String(!box.hidden)); };
  if (w.length) console.warn("Revisión de la base:\n" + w.map(x => `[${x.nivel}] ${x.txt}`).join("\n"));
}

/* ---------- Arranque ---------- */
(async function init() {
  try { M = Base.buildModel(await Base.load()); }
  catch (e) { $("#layout").innerHTML = `<p class="empty">No se pudo cargar la base: ${esc(e.message)}</p>`; return; }
  if (!M.groups.length) { $("#layout").innerHTML = `<p class="empty">La base no tiene aros de Daö (categoría Aro o Accesorio).</p>`; renderAvisos(); return; }
  if (window.TYPESENSE) $("#origen").textContent = "Base: Typesense (" + window.TYPESENSE.collection + ")";
  else if (window.BASE_ORIGEN) $("#origen").textContent = "Base: " + window.BASE_ORIGEN;
  cs.g = M.groups[0].id;
  renderAvisos();
  render();
})();
