//#region package.json
var e = "0.3.4", t = {
	BASE_URL: "/",
	DEV: !1,
	MODE: "production",
	PROD: !0,
	SSR: !1,
	VITE_TYPESENSE_COLLECTION: "macroled_arq",
	VITE_TYPESENSE_HOST: "https://typesense.coresagroup.com",
	VITE_TYPESENSE_SEARCH_KEY: "fstX8TBuNifh2YewtBqyPEcCxhUQqpkJ"
}, n = Object.freeze({
	typesense: Object.freeze({
		host: t.VITE_TYPESENSE_HOST ?? "",
		searchKey: t.VITE_TYPESENSE_SEARCH_KEY ?? "",
		collection: t.VITE_TYPESENSE_COLLECTION ?? ""
	}),
	n8n: Object.freeze({ webhookUrl: t.VITE_N8N_WEBHOOK_URL ?? "" }),
	images: Object.freeze({
		finishesBase: t.VITE_FINISHES_BASE_URL ?? "https://s3.coresagroup.com/MACROLED/ARQ/imagenes/acabados/",
		sampleFrom: "https://s3.coresagroup.com/",
		sampleBase: "https://d1zltvqju4u8ql.cloudfront.net/fit-in/128x128/",
		pdfBase: "https://d1zltvqju4u8ql.cloudfront.net/fit-in/{size}x{size}/filters:format({format})/"
	}),
	pdf: Object.freeze({
		pdfmakeUrl: "https://cdn.jsdelivr.net/npm/pdfmake@0.3.11/build/pdfmake.min.js/+esm",
		fontUrl: "https://cdn.jsdelivr.net/npm/@fontsource/albert-sans@5.3.0/files/albert-sans-latin-{weight}-normal.woff"
	})
}), r = 250, i = /* @__PURE__ */ new Map(), a = class extends Error {
	constructor(e, t) {
		super(`Typesense ${e}: ${t}`), this.name = "TypesenseError", this.status = e;
	}
};
function o() {
	let { host: e, searchKey: t, collection: r } = n.typesense;
	return [
		[e, "VITE_TYPESENSE_HOST"],
		[t, "VITE_TYPESENSE_SEARCH_KEY"],
		[r, "VITE_TYPESENSE_COLLECTION"]
	].filter(([e]) => !e).map(([, e]) => e);
}
function s() {
	let { host: e, searchKey: t, collection: r } = n.typesense;
	return !!(e && t && r);
}
function c(e) {
	return "`" + String(e).replaceAll("`", "") + "`";
}
function l(e, t) {
	return `${e}:=[${t.map(c).join(",")}]`;
}
async function u(e, { signal: t } = {}) {
	if (!s()) throw new a(0, `falta configurar ${o().join(", ")} (.env)`);
	let { host: r, searchKey: c, collection: l } = n.typesense, u = new URLSearchParams({
		q: "*",
		...e
	}), d = `${r.replace(/\/$/, "")}/collections/${encodeURIComponent(l)}/documents/search?${u}`;
	if (i.has(d)) return i.get(d);
	let f = fetch(d, {
		headers: { "X-TYPESENSE-API-KEY": c },
		signal: t
	}).then(async (e) => {
		let t = await e.json().catch(() => ({}));
		if (!e.ok) throw new a(e.status, t.message ?? e.statusText);
		return t;
	});
	return i.set(d, f), f.catch(() => i.delete(d)), f;
}
async function d(e = {}, t) {
	let n = await u(e, t);
	return {
		hits: (n.hits ?? []).map((e) => e.document),
		found: n.found ?? 0,
		facets: Object.fromEntries((n.facet_counts ?? []).map((e) => [e.field_name, e.counts.map(({ value: e, count: t }) => ({
			value: e,
			count: t
		}))]))
	};
}
async function f(e = {}, t) {
	let n = await d({
		...e,
		per_page: r,
		page: 1
	}, t), i = Math.ceil(n.found / r);
	return [n, ...await Promise.all(Array.from({ length: Math.max(0, i - 1) }, (n, i) => d({
		...e,
		per_page: r,
		page: i + 2
	}, t)))].flatMap((e) => e.hits);
}
//#endregion
//#region src/data/attributes.js
var p = Object.freeze([
	{
		id: "luminicas",
		label: "Características lumínicas"
	},
	{
		id: "electricas",
		label: "Características eléctricas"
	},
	{
		id: "materiales",
		label: "Materiales e instalación"
	},
	{
		id: "comercial",
		label: "Información comercial"
	}
]), m = (e, t, n = {}) => Object.freeze({
	label: e,
	section: t,
	control: "tiles",
	...n
}), h = Object.freeze({
	flujo_luminoso: m("Flujo luminoso", "luminicas", { filter: !1 }),
	lumenes_lmw: m("Eficacia luminosa", "luminicas", { filter: !1 }),
	temperatura_color: m("Temperatura de color", "luminicas"),
	cri: m("CRI", "luminicas"),
	angulo_apertura: m("Ángulo de apertura", "luminicas"),
	ugr: m("UGR", "luminicas"),
	sdcm: m("SDCM", "luminicas", { filter: !1 }),
	tipo_led: m("Tipo de LED", "luminicas"),
	vida_util: m("Vida útil", "luminicas", { filter: !1 }),
	potencia: m("Potencia", "electricas"),
	tension_proveedor: m("Tensión de entrada", "electricas"),
	factor_potencia: m("Factor de potencia", "electricas", { filter: !1 }),
	thd: m("THD", "electricas", { filter: !1 }),
	dimeable: m("Dimerizable", "electricas"),
	tipo_driver: m("Driver", "electricas", { filter: !1 }),
	emc: m("EMC", "electricas", { filter: !1 }),
	color_carcasa: m("Color", "materiales", {
		control: "swatches",
		column: "Color de carcasa"
	}),
	altura: m("Altura", "materiales", {
		column: "Altura",
		filter: !1
	}),
	modelo: m("Modelo", "materiales", {
		filter: !1,
		summary: !1
	}),
	modulos: m("Módulos", "materiales", {
		filter: !1,
		unit: ["módulo", "módulos"]
	}),
	tamanio: m("Medidas", "materiales", { filter: !1 }),
	dimensiones: m("Dimensiones", "materiales", { filter: !1 }),
	calado: m("Calado", "materiales", { filter: !1 }),
	medidas_cabezal: m("Medidas del cabezal", "materiales", { filter: !1 }),
	color_lente: m("Color del lente", "materiales", { filter: !1 }),
	material_cuerpo: m("Material del cuerpo", "materiales"),
	material_lente: m("Material de la lente", "materiales"),
	largo_cable: m("Largo de cable", "materiales", { filter: !1 }),
	peso: m("Peso", "materiales", { filter: !1 }),
	proteccion_ip: m("Grado de protección", "materiales", { prefix: "IP" }),
	proteccion_ik: m("Resistencia al impacto", "materiales", {
		prefix: "IK",
		digits: 2
	}),
	tipo_montaje: m("Montaje", "materiales"),
	temperatura_operacion: m("Temperatura de operación", "materiales", { filter: !1 }),
	escena_uso_sugerido: m("Uso sugerido", "materiales", {
		filter: !1,
		summary: !1
	}),
	garantia_proveedor: m("Garantía", "comercial", { filter: !1 })
}), g = Object.freeze([
	{
		field: "color_carcasa",
		label: "Acabado"
	},
	{
		field: "tamanio",
		label: "Tamaño",
		wide: !0
	},
	{
		field: "potencia",
		label: "Potencia"
	},
	{
		field: "temperatura_color",
		label: "Temp."
	},
	{
		field: "cri",
		label: "CRI"
	},
	{
		field: "flujo_luminoso",
		label: "Flujo lum."
	},
	{
		field: "angulo_apertura",
		label: "Ángulo"
	},
	{
		field: "lumenes_lmw",
		label: "Eficiencia"
	},
	{
		field: "proteccion_ip",
		label: "IP"
	},
	{
		field: "dimeable",
		label: "Regulación"
	}
]), _ = /(?<![a-zñ])cm(?![a-zñ])/gi, ee = /(?<![a-zñ])mm(?![a-zñ])/i;
function te(e) {
	let t = String(e ?? "").trim();
	if (!/\d/.test(t) || ee.test(t)) return t;
	let n = t.replace(/\d+(?:[.,]\d+)?/g, (e) => {
		let t = Number((parseFloat(e.replace(",", ".")) * 10).toFixed(1));
		return e.includes(",") ? String(t).replace(".", ",") : String(t);
	}), r = n.replace(_, "mm");
	return r === n ? `${n} mm` : r;
}
function ne(e) {
	return oe(e.tamanio) ? {
		...e,
		tamanio: te(e.tamanio)
	} : e;
}
var re = Object.freeze([
	{
		field: "tipo_montaje",
		label: "Montaje"
	},
	{
		field: "color_carcasa",
		label: "Acabado"
	},
	{
		field: "potencia",
		label: "Potencia"
	},
	{
		field: "temperatura_color",
		label: "Temperatura de color"
	},
	{
		field: "proteccion_ip",
		label: "IP"
	},
	{
		field: "dimeable",
		label: "Regulación"
	},
	{
		field: "cri",
		label: "CRI"
	},
	{
		field: "angulo_apertura",
		label: "Ángulo"
	},
	{
		field: "tipo_led",
		label: "Fuente"
	},
	{
		field: "material_cuerpo",
		label: "Material del cuerpo"
	},
	{
		field: "tension_proveedor",
		label: "Tensión de entrada"
	}
]);
function v(e) {
	return h[e] ?? {
		label: e,
		control: "tiles"
	};
}
function ie(e) {
	return p.map((t) => ({
		...t,
		rows: Object.entries(h).filter(([n, r]) => r.section === t.id && oe(e[n])).map(([t, n]) => ({
			field: t,
			label: n.label,
			value: ae(n, e[t])
		}))
	})).filter((e) => e.rows.length);
}
function ae({ prefix: e, digits: t = 0 }, n) {
	if (!e) return n;
	let r = String(n).match(RegExp(`^\\s*(?:${e}\\s*)?(\\d+)\\s*$`, "i"));
	return r ? `${e}${r[1].padStart(t, "0")}` : n;
}
var oe = (e) => e != null && String(e).trim() !== "" && e !== "-";
function se(e) {
	return (Array.isArray(e) ? e : String(e ?? "").split(",")).map((e) => e.trim()).filter(Boolean).map((e) => {
		let t = h[e] ? e : Object.keys(h).find((t) => h[t].column === e);
		return t || console.warn(`[arq] variant_attributes: el campo «${e}» no está en src/data/attributes.js`), t;
	}).filter(Boolean);
}
//#endregion
//#region src/data/text.js
var y = (e) => String(e ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
function b(e) {
	let t = [e];
	return e.length > 3 && e.endsWith("es") && t.push(e.slice(0, -2)), e.length > 3 && e.endsWith("s") && t.push(e.slice(0, -1)), t;
}
function ce(e) {
	return y(e).split(/\s+/).filter(Boolean).map(b);
}
var x = (e) => e.length >= 6 ? 2 : +(e.length >= 4);
function le(e, t, n) {
	if (Math.abs(e.length - t.length) > n) return n + 1;
	let r = null, i = Array.from({ length: t.length + 1 }, (e, t) => t);
	for (let a = 1; a <= e.length; a++) {
		let o = [a], s = a;
		for (let n = 1; n <= t.length; n++) {
			let c = e[a - 1] === t[n - 1] ? 0 : 1, l = Math.min(i[n] + 1, o[n - 1] + 1, i[n - 1] + c);
			r && a > 1 && n > 1 && e[a - 1] === t[n - 2] && e[a - 2] === t[n - 1] && (l = Math.min(l, r[n - 2] + 1)), o.push(l), s = Math.min(s, l);
		}
		if (s > n) return n + 1;
		r = i, i = o;
	}
	return i[t.length];
}
function ue(e, t) {
	let n = x(e);
	return n ? t.some((t) => {
		for (let r = e.length - n; r <= e.length + n; r++) if (!(r < 1 || r > t.length) && le(e, t.slice(0, r), n) <= n) return !0;
		return !1;
	}) : !1;
}
var de = (e) => e.split(/[^a-z0-9]+/).filter(Boolean);
function fe(e, t, { typos: n = !0 } = {}) {
	let r = y(e), i = null, a = "exact";
	for (let e of t) if (!e.some((e) => r.includes(e))) {
		if (!n || (i ??= de(r), !e.some((e) => ue(e, i)))) return !1;
		a = "typo";
	}
	return a;
}
//#endregion
//#region src/data/models.js
var pe = Object.freeze([{
	match: /^DAO-/,
	parent: (e) => e.replace("-MINI", ""),
	model: (e) => e.includes("-MINI") ? "Mini" : "Estándar"
}]), S = (e) => e == null ? "" : String(e).trim(), me = (e) => (Array.isArray(e) ? e : S(e).split(",")).map(S).filter(Boolean);
function he(e) {
	let t = me(e).filter((e) => e !== "modelo"), n = t.indexOf("color_carcasa") + 1;
	return [
		...t.slice(0, n),
		"modelo",
		...t.slice(n)
	].join(", ");
}
function ge(e) {
	let t = (e) => !S(e.grupo_producto) && !S(e.modelo), n = (e) => pe.find((t) => t.match.test(S(e.grupo_variantes))), r = /* @__PURE__ */ new Map();
	for (let i of e) {
		let e = n(i);
		if (!e || !t(i)) continue;
		let a = S(i.grupo_variantes), o = e.parent(a);
		r.has(o) || r.set(o, {
			variantGroups: /* @__PURE__ */ new Set(),
			models: /* @__PURE__ */ new Set(),
			categories: /* @__PURE__ */ new Set()
		});
		let s = r.get(o);
		s.variantGroups.add(a), s.models.add(e.model(a)), s.categories.add(`${S(i.macrofamilia)}|${S(i.subfamilia)}`);
	}
	let i = new Set([...r].filter(([, e]) => e.models.size > 1 && e.categories.size === 1).map(([e]) => e));
	for (let [e, t] of r) t.models.size > 1 && t.categories.size > 1 && console.warn(`[arq] modelos: «${e}» mezcla categorías (${[...t.categories].join(", ")}): no se unen.`);
	return e.map((e) => {
		let r = n(e);
		if (!r || !t(e)) return e;
		let a = S(e.grupo_variantes), o = r.parent(a);
		return i.has(o) ? {
			...e,
			grupo_producto: o,
			modelo: r.model(a),
			variant_attributes: he(e.variant_attributes)
		} : e;
	});
}
var _e = 1600, ve = 85, ye = (e) => e === "fit-in" || e.startsWith("filters:") || /^[0-9]+x[0-9]+$/.test(e);
function be(e, t = 800) {
	if (!e) return e;
	let { sampleFrom: r, sampleBase: i } = n.images, a = `${new URL(i).origin}/`, o;
	if (e.startsWith(r)) o = e.slice(r.length);
	else if (e.startsWith(a)) o = e.slice(a.length);
	else return e;
	let [s, c = ""] = o.split("?"), l = s.split("/");
	for (; l.length > 1 && ye(l[0]);) l.shift();
	return `${a}fit-in/${t}x${t * 2}/filters:format(webp):quality(${ve})/${l.join("/")}${c ? `?${c}` : ""}`;
}
//#endregion
//#region src/data/typesense-adapter.js
var C = {
	name: "product_name",
	variantGroup: "grupo_variantes",
	productGroup: "grupo_producto",
	family: "familia",
	productType: "product_type",
	environment: "macrofamilia",
	application: "subfamilia",
	isDefault: "is_group_default",
	isMenuDefault: "is_menu_default",
	isNew: "new",
	variantAttributes: "variant_attributes",
	compatibleWith: "compatible_with",
	description: "description",
	category: "categoria",
	story: "product_story_text",
	inspiration: "product_inspiration_text",
	video: "video_inspiration",
	collectionIntro: "collection_intro_text",
	collectionDescription: "collection_description_text",
	collectionGallery: "collection_gallery_images",
	collectionInspiration: "collection_inspiration_images"
}, xe = "Colección", Se = "Accesorio", Ce = "Luminaria", we = {
	multimagen_producto: ["main", "mainOn"],
	multimagen_vistas: [
		"front",
		"frontOn",
		"back",
		"backOn",
		"left",
		"leftOn",
		"right",
		"rightOn"
	],
	multimagen_perspectivas: [
		"pers1",
		"pers1On",
		"pers2",
		"pers2On"
	],
	multimagen_detalles: [
		"detail1",
		"detail1On",
		"detail2",
		"detail2On"
	],
	multimagen_ambiente: [
		"ambient1",
		"ambient1On",
		"ambient2",
		"ambient3",
		"ambient4",
		"ambient5",
		"ambient6",
		"ambient7"
	],
	multimagen_coleccion: [
		"card",
		"cardOn",
		"description"
	]
}, Te = [
	"main",
	"ambient1",
	"front",
	"back",
	"left",
	"right",
	"pers1",
	"pers2",
	"detail1",
	"detail2"
], Ee = [
	"ies",
	"cad",
	"manual",
	"fotometria"
], De = Object.freeze([
	"sku",
	C.name,
	C.variantGroup,
	C.productGroup,
	"modelo",
	C.family,
	C.productType,
	C.environment,
	C.application,
	C.isDefault,
	C.isMenuDefault,
	C.isNew,
	C.variantAttributes,
	C.compatibleWith,
	C.category,
	C.collectionIntro,
	C.collectionDescription,
	C.collectionGallery,
	C.collectionInspiration,
	"multimagen_producto",
	"multimagen_ambiente",
	"multimagen_coleccion",
	"cotas_img",
	...Object.keys(h)
]), Oe = Object.freeze([
	"sku",
	C.name,
	C.isDefault,
	C.description,
	C.story,
	C.inspiration,
	C.video,
	"multimagen_vistas",
	"multimagen_perspectivas",
	"multimagen_detalles",
	...Ee
]), w = (e) => e == null ? "" : String(e).trim(), ke = (e) => e, Ae = /^\d+\s*x\s*\d+$/i, je = (e, t, n = !1) => {
	let r = w(t);
	return e === "modulos" && !n ? r.replace(/^(?:x\s*(\d+)|(\d+)\s*x?)$/i, (e, t, n) => `x${t ?? n}`) : r;
}, Me = (e) => Array.isArray(e) ? e.map(w).filter(Boolean) : w(e) ? w(e).split(",").map((e) => e.trim()).filter(Boolean) : [], Ne = (e) => y(e).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
function Pe(e) {
	let t = {};
	for (let [n, r] of Object.entries(we)) {
		let i = Array.isArray(e[n]) ? e[n] : [];
		r.forEach((e, n) => {
			let r = w(i[n]);
			r && (t[e] = r);
		});
	}
	t.ambient1 && !t.ambient1On && /_on\.\w+$/i.test(t.ambient1.split(/[?#]/)[0]) && (t.ambient1On = t.ambient1);
	for (let e of Object.keys(t)) t[e] = ke(be(t[e]));
	return t;
}
function Fe(e) {
	let t = Pe(e), n = Te.filter((e) => t[e]), r = {
		main: t.main,
		studio: t.main,
		studioOn: t.mainOn,
		context: t.ambient1,
		contextOn: t.ambient1On,
		gallery: n.map((e) => t[e]),
		galleryOn: n.map((e) => t[`${e}On`] ?? null)
	};
	return Object.fromEntries(Object.entries(r).filter(([, e]) => Array.isArray(e) ? e.length : e));
}
function Ie(e) {
	let t = Pe(e);
	return {
		ambient: [
			"ambient2",
			"ambient3",
			"ambient4",
			"ambient5",
			"ambient7"
		].map((e) => t[e]).filter(Boolean),
		description: t.ambient6 ?? null,
		inspiration: [t.ambient7].filter(Boolean),
		heroExtra: [
			"ambient2",
			"ambient3",
			"ambient4",
			"ambient5",
			"ambient6",
			"ambient7"
		].map((e) => t[e]).filter(Boolean)
	};
}
var Le = (e) => e.ambient1On ?? e.ambient1 ?? null;
function Re(e) {
	let t = Pe(e);
	return {
		id: Ne(e[C.name]),
		name: w(e[C.name]),
		families: Me(e[C.family]).map(y),
		intro: w(e[C.collectionIntro]),
		description: w(e[C.collectionDescription]),
		images: {
			menu: Le(t),
			studio: t.card ?? null,
			studioOn: t.cardOn ?? null,
			gallery: Me(e[C.collectionGallery]).map(ke),
			description: t.description ?? null,
			inspiration: Me(e[C.collectionInspiration]).map(ke)
		}
	};
}
function ze(e) {
	let t = e.filter((e) => e[C.isDefault] === !0);
	if (t.length < 2) return t[0] ?? e[0];
	let n = (e, t) => String(e.sku).length - String(t.sku).length || String(e.sku).localeCompare(String(t.sku), "es", { numeric: !0 });
	return [...t].sort(n)[0];
}
function Be(e, t) {
	let n = w(t[C.name]), r = [...new Set(e.map((e) => w(e[C.name])).filter(Boolean))];
	if (r.length < 2) return n;
	let i = r.map((e) => e.split(/\s+/).map(y)), a = n.split(/\s+/).filter((e) => i.every((t) => t.includes(y(e))));
	return a.length ? a.join(" ") : n;
}
function Ve(e) {
	let t = [], n = /* @__PURE__ */ new Map(), r = ge(e);
	for (let e of r) {
		let r = w(e[C.name]);
		if (!r) continue;
		if (w(e[C.productType]) === xe) {
			t.push(Re(e));
			continue;
		}
		let i = w(e[C.productGroup]) || w(e[C.variantGroup]), a = i ? `g:${i}` : `n:${Ne(r)}`;
		n.has(a) || n.set(a, []), n.get(a).push(e);
	}
	let i = /* @__PURE__ */ new Map();
	for (let e of n.values()) {
		let t = Ne(Be(e, ze(e))), n = i.has(t) ? `${t}-${Ne(w(e[0][C.variantGroup])) || i.size}` : t;
		i.set(n, e);
	}
	let a = (e) => t.find((t) => t.families.includes(y(e)))?.id ?? null, o = new Map([...i].flatMap(([e, t]) => t.map((t) => [y(t[C.name]), e]))), s = (e, t) => {
		let n = ze(t), r = new Set(t.map((e) => w(e[C.name]))), i = t.some((e) => Ae.test(w(e.modulos))), s = w(n[C.productType]) || Ce, c = Me(n[C.compatibleWith]).map((e) => o.get(y(e))).filter(Boolean);
		return {
			id: e,
			name: Be(t, n),
			variantGroup: w(n[C.variantGroup]),
			variantNames: r.size > 1,
			family: Me(n[C.family])[0] ?? "",
			collection: s === Se ? null : a(n[C.family]),
			productType: s,
			hasDefault: t.some((e) => e[C.isDefault] === !0),
			menuImage: (() => {
				let e = t.find((e) => e[C.isMenuDefault] === !0);
				return e ? Le(Pe(e)) : null;
			})(),
			environment: Me(n[C.environment]),
			application: w(n[C.application]) || null,
			variantAttributes: se(n[C.variantAttributes]),
			compatibleWith: c,
			story: w(n[C.story]),
			inspiration: w(n[C.inspiration]),
			video: w(n[C.video]),
			images: Ie(n),
			specs: {},
			variants: t.map((e) => ({
				sku: e.sku,
				name: w(e[C.name]),
				isDefault: e === n,
				isNew: e[C.isNew] === !0,
				description: w(e[C.description]),
				category: w(e[C.category]),
				attributes: Object.fromEntries(Object.keys(h).map((t) => [t, je(t, e[t], i)]).filter(([, e]) => e && e !== "-")),
				images: Fe(e),
				cota: w(e.cotas_img) || null,
				downloads: Object.fromEntries(Ee.map((t) => [t, w(e[t])]).filter(([, e]) => e))
			}))
		};
	}, c = [...i].map(([e, t]) => s(e, t));
	return {
		collections: t.filter((e) => c.some((t) => t.collection === e.id)),
		groups: c,
		withDetails: (e, t) => {
			let n = new Map(t.map((e) => [e.sku, e]));
			return s(e, i.get(e).map((e) => ({
				...e,
				...n.get(e.sku)
			})));
		}
	};
}
//#endregion
//#region src/data/source.js
var He = "arq:catalog", Ue = 6e4, We = () => [
	n.typesense.host,
	n.typesense.collection,
	De.join(",")
].join("|");
function Ge() {
	try {
		if (new URLSearchParams(location.search).has("arq-nocache") || performance.getEntriesByType("navigation")[0]?.type === "reload") return null;
		let e = JSON.parse(sessionStorage.getItem(He));
		return e?.signature === We() && Array.isArray(e.docs) ? e : null;
	} catch {
		return null;
	}
}
function Ke(e) {
	try {
		sessionStorage.setItem(He, JSON.stringify({
			signature: We(),
			at: Date.now(),
			docs: e
		}));
	} catch {}
}
async function qe() {
	let e = await f({
		q: "*",
		include_fields: De.join(",")
	});
	return Ke(e), e;
}
async function Je() {
	let e = Ge();
	return e ? (Date.now() - e.at > Ue && qe().catch(() => {}), Ve(e.docs)) : Ve(await qe());
}
var Ye = 80;
async function Xe(e) {
	let t = Array.from({ length: Math.ceil(e.length / Ye) }, (t, n) => e.slice(n * Ye, (n + 1) * Ye));
	return (await Promise.all(t.map((e) => f({
		q: "*",
		filter_by: l("sku", e),
		include_fields: Oe.join(",")
	})))).flat();
}
//#endregion
//#region src/data/variants.js
var Ze = (e) => e != null && String(e).trim() !== "";
function Qe(e, t) {
	let n = [];
	for (let r of e) {
		let e = r.attributes[t];
		Ze(e) && !n.includes(e) && n.push(e);
	}
	return n.sort((e, t) => String(e).localeCompare(String(t), "es", { numeric: !0 }));
}
function $e(e, t) {
	let n = Object.keys(t);
	return e.find((e) => n.every((n) => e.attributes[n] === t[n])) ?? null;
}
function et(e, t, n) {
	let r = e.find((e) => n && e.sku === n) ?? e.find((e) => e.isDefault) ?? e[0];
	return r ? Object.fromEntries(t.map((e) => [e, r.attributes[e]])) : {};
}
function tt(e) {
	let t = e.find((e) => v(e).control === "swatches") ?? e[0];
	return t ? [
		t,
		...t !== "potencia" && e.includes("potencia") ? ["potencia"] : [],
		...e.filter((e) => e !== t && e !== "potencia")
	] : [];
}
var nt = (e, t, n, r, i) => e.some((e) => e.attributes[r] === i && t.every((t) => e.attributes[t] === n[t]));
function rt(e, t, n) {
	let r = tt(t);
	return r.map((t, i) => ({
		attribute: t,
		options: Qe(e, t).map((a) => ({
			value: a,
			selected: n[t] === a,
			disabled: !nt(e, r.slice(0, i), n, t, a)
		}))
	}));
}
var it = (e, t) => Array.isArray(t) ? !t.length || t.includes(e) : !Ze(t) || e === t, at = (e, t, n) => Object.entries(t).every(([t, r]) => t === n || it(e.attributes[t], r));
function ot(e, t) {
	return e.filter((e) => at(e, t));
}
function st(e, t, n) {
	return t.map((t) => ({
		attribute: t,
		options: Qe(e, t).map((r) => ({
			value: r,
			selected: Array.isArray(n[t]) ? n[t].includes(r) : n[t] === r,
			disabled: !e.some((e) => e.attributes[t] === r && at(e, n, t))
		}))
	}));
}
function ct(e, t, n, r, i) {
	let a = tt(t), o = {
		...n,
		[r]: i
	}, s = e.find((e) => e.isDefault)?.attributes ?? {};
	return a.forEach((t, n) => {
		if (n <= a.indexOf(r)) return;
		let i = a.slice(0, n), c = (n) => Ze(n) && nt(e, i, o, t, n);
		c(o[t]) || (o[t] = c(s[t]) ? s[t] : Qe(e, t).find(c) ?? o[t]);
	}), o;
}
function lt(e, t) {
	let n = ce(t ?? "");
	if (!n.length) return e;
	let r = [], i = [];
	for (let t of e) fe(`${t.sku} ${t.search ?? ""}`, n, { typos: !1 }) ? r.push(t) : fe(t.search ?? "", n) && i.push(t);
	return [...r, ...i];
}
var ut = new Intl.Collator("es", {
	numeric: !0,
	sensitivity: "base"
});
function dt(e, t) {
	let n = !Ze(e) || e === "-", r = !Ze(t) || t === "-";
	return n || r ? Number(n) - Number(r) : ut.compare(String(e), String(t));
}
function ft(e, t, n = !1) {
	if (!t) return e;
	let r = (e) => t === "sku" ? e.sku : e.values?.[t], i = n ? -1 : 1;
	return e.map((e, t) => [e, t]).sort(([e, t], [n, a]) => {
		let o = r(e), s = r(n);
		return Number(!Ze(o) || o === "-") - Number(!Ze(s) || s === "-") || i * dt(o, s) || t - a;
	}).map(([e]) => e);
}
//#endregion
//#region src/data/finishes.js
var pt = (e) => y(e).replace(/\s+/g, " ").trim(), mt = Object.freeze({
	negro: "negro",
	"negro satinado": "negro-mate",
	"blanco y negro": "blanco-y-negro",
	blanco: "blanco",
	cobre: "cobre",
	bronce: "bronce",
	celeste: "celeste",
	grafito: "grafito",
	"gris grafito": "grafito",
	platil: "platil",
	verde: "verde",
	terracota: "terracota",
	beige: "beige",
	pardo: "pardo"
}), ht = Object.freeze({ negro: [{
	slug: "negro-mate",
	families: [
		"Kanu",
		"Nobu",
		"Tori",
		"Koen",
		"Douli",
		"Yoru",
		"Sento"
	].map(pt)
}] });
function gt(e, t = "") {
	let n = mt[pt(e)];
	if (!n) return null;
	let r = (ht[n] ?? []).find(({ families: e }) => e.includes(pt(t)));
	return r ? r.slug : n;
}
function _t(e, t = "") {
	let r = gt(e, t);
	return r ? `${n.images.finishesBase}acabado-${r}.png` : null;
}
var vt = [
	"Hoshi",
	"Fuji",
	"Douli",
	"Daö",
	"Mini Kai",
	"Sento",
	"Nobu"
].map(y);
function yt(e) {
	let t = y(e).trim(), n = vt.findIndex((e) => t === e || t.startsWith(`${e} `));
	return n === -1 ? vt.length : n;
}
//#endregion
//#region src/data/catalog.js
var bt = null;
function T() {
	return bt ??= Je().then(xt), bt.catch(() => bt = null), bt;
}
function xt({ collections: e, groups: t, withDetails: n }) {
	let r = new Map(e.map((e) => [e.id, e]));
	for (let e of t) St(e, r);
	return {
		collections: e,
		groups: t,
		collectionById: r,
		groupById: new Map(t.map((e) => [e.id, e])),
		withDetails: n
	};
}
function St(e, t) {
	e.collectionData = t.get(e.collection) ?? null;
	for (let t of e.variants) t.values = {
		...e.specs,
		...t.attributes
	};
	e.defaultVariant = e.variants.find((e) => e.isDefault) ?? e.variants[0];
}
var Ct = /* @__PURE__ */ new Map();
function wt(e) {
	if (!Ct.has(e.id)) {
		let t = (async () => {
			let t = await T();
			return Object.assign(e, t.withDetails(e.id, await Xe(e.variants.map((e) => e.sku)))), St(e, t.collectionById), e;
		})();
		Ct.set(e.id, t), t.catch(() => Ct.delete(e.id));
	}
	return Ct.get(e.id);
}
var Tt = (e, t) => e.variantNames && t?.name ? t.name : e.name, Et = (e, t) => `/arq/producto/${encodeURIComponent(e)}${t ? `?sku=${encodeURIComponent(t)}` : ""}`;
function E({ environment: e, application: t, productType: n, collection: r, family: i } = {}) {
	let a = new URLSearchParams();
	e && a.set("environment", e), t && a.set("application", t), n && a.set("product_type", n), r && a.set("collection", r), i && a.set("family", i);
	let o = a.toString();
	return `/arq/productos${o ? `?${o}` : ""}`;
}
var D = (e) => e != null && String(e).trim() !== "";
function Dt(e, t) {
	return Object.entries(t).every(([t, n]) => !n?.length || n.includes(e.values[t]));
}
function Ot(e, t, n = e.defaultVariant) {
	return [
		n,
		e.defaultVariant,
		...e.variants
	].filter((e, t, n) => n.indexOf(e) === t).find((e) => Dt(e, t)) ?? null;
}
var kt = "Lámparas y Artefactos", At = (e, t = {}) => e.hasDefault ? t.productType ? !0 : e.environment.includes("Lámparas y Artefactos") ? t.environment === kt : e.productType === "Luminaria" : !1;
function jt(e, { environment: t, application: n, productType: r, collection: i, family: a } = {}) {
	return !(t && !e.environment.includes(t) || n && e.application !== n || r && e.productType !== r || i && e.collection !== i || a && y(e.family) !== y(a));
}
var Mt = (e = {}) => Object.fromEntries(Object.entries(e).filter(([, e]) => e?.length)), Nt = Object.keys(h).filter((e) => h[e].filter !== !1);
function Pt(e) {
	return Nt.map((t) => {
		let n = /* @__PURE__ */ new Map();
		for (let r of e) for (let e of new Set(r.variants.map((e) => e.values[t]).filter(D))) n.set(e, (n.get(e) ?? 0) + 1);
		let r = [...n].map(([e, t]) => ({
			value: e,
			count: t
		})).sort((e, t) => String(e.value).localeCompare(String(t.value), "es", { numeric: !0 }));
		return {
			name: t,
			label: v(t).label,
			options: r
		};
	}).filter((e) => e.options.length > 1);
}
function Ft(e, t) {
	let n = {};
	for (let r of Nt) {
		let i = { ...t };
		delete i[r];
		let a = /* @__PURE__ */ new Map();
		for (let t of e) for (let e of t.variants) {
			let n = e.values[r];
			D(n) && Dt(e, i) && (a.has(n) || a.set(n, /* @__PURE__ */ new Set()), a.get(n).add(t));
		}
		n[r] = Object.fromEntries([...a].map(([e, t]) => [e, t.size]));
	}
	return n;
}
function It(e) {
	return e.productType && e.productType !== "Luminaria" ? e.productType : [e.environment.join(" · "), e.application].filter(Boolean).join(" · ");
}
var Lt = Object.keys(h).filter((e) => h[e].control === "swatches"), Rt = (e) => [...new Set(e.variants.flatMap((e) => Lt.map((t) => e.values[t])).filter(D))], zt = [
	"negro",
	"blanco",
	"terracota",
	"verde"
], Bt = (e) => {
	let t = String(e).normalize("NFD").replace(/[̀-ͯ]/g, "").trim().toLowerCase().split(/\s+/)[0], n = zt.indexOf(t);
	return n === -1 ? zt.length : n;
}, Vt = (e) => e.map((e, t) => [e, t]).sort((e, t) => Bt(e[0].name) - Bt(t[0].name) || e[1] - t[1]).map(([e]) => e), Ht = (e) => Vt(Rt(e).map((t) => ({
	name: t,
	src: _t(t, e.family)
}))), Ut = (e) => Lt.map((t) => e.values[t]).find(D);
function Wt(e, t = {}) {
	let n = (e) => Bt(Ut(e) ?? "");
	return [e.defaultVariant, ...e.variants].filter((e, t, n) => n.indexOf(e) === t).map((e, t) => [e, t]).sort((e, t) => n(e[0]) - n(t[0]) || e[1] - t[1]).map(([e]) => e).find((e) => Dt(e, t)) ?? null;
}
function Gt(e, t, n = {}) {
	let r = Ht(e);
	return r.length < 2 ? r : r.map((r) => {
		let i = [
			t,
			e.defaultVariant,
			...e.variants
		].filter((e, t, n) => n.indexOf(e) === t && Ut(e) === r.name), a = (n) => e.variantAttributes.filter((e) => !Lt.includes(e) && n.values[e] === t.values[e]).length, o = i.map((e, t) => [e, t]).sort((e, t) => a(t[0]) - a(e[0]) || e[1] - t[1]).map(([e]) => e), s = o.find((e) => Dt(e, n)) ?? o[0], c = k(s.images);
		return {
			...r,
			selected: Ut(t) === r.name,
			sku: s.sku,
			href: Et(e.id, s.sku),
			image: c.studio ?? null,
			imageHover: c.studioOn ?? c.context ?? c.contextOn ?? null,
			imageLit: c.studioOn ?? null,
			imageHoverLit: c.contextOn ?? c.studio ?? null
		};
	});
}
function O(e, t = Wt(e) ?? e.defaultVariant, n = {}) {
	let r = k(t.images);
	return {
		id: e.id,
		sku: t.sku,
		name: e.name,
		meta: It(e),
		finishes: Gt(e, t, n),
		href: Et(e.id, t.sku),
		family: e.family,
		image: r.studio ?? null,
		imageHover: r.studioOn ?? r.context ?? r.contextOn ?? null,
		imageLit: r.studioOn ?? null,
		imageHoverLit: r.contextOn ?? r.studio ?? null
	};
}
var k = (e = {}) => Object.fromEntries(Object.entries(e).filter(([, e]) => D(e) && (!Array.isArray(e) || e.length))), Kt = "dao", qt = ["tori jardin", "tori visera"], Jt = (e) => {
	let t = y(e.name);
	return (/\bround/.test(t) ? 2 : 0) + +!!/\bapli(car|que)\b/.test(t);
};
function Yt(e) {
	let t = (e) => y(e.collection || e.family || e.name).replace(/\s+round(ed)?$/, ""), n = (e) => {
		let t = qt.indexOf(y(e.name));
		return t >= 0 ? 2 + t : +(y(e.family) === Kt || y(e.collection) === Kt);
	}, r = /* @__PURE__ */ new Map();
	for (let n of e) r.has(t(n)) || r.set(t(n), r.size);
	let i = (e) => e.environment.includes("Interior") ? 0 : e.environment.includes("Exterior") ? 1 : 2;
	return [...e].sort((e, a) => i(e) - i(a) || n(e) - n(a) || r.get(t(e)) - r.get(t(a)) || Jt(e) - Jt(a));
}
async function Xt({ filters: e, query: t, ...n } = {}) {
	let { groups: r } = await T(), i = ce(t ?? ""), a = /* @__PURE__ */ new Map();
	for (let e of r) {
		if (!jt(e, n) || !i.length && !At(e, n)) continue;
		let t = i.length ? In(e, i) : {
			variant: e.defaultVariant,
			bySku: !1
		};
		t && a.set(e, t);
	}
	let o = [...a.keys()].sort((e, t) => Number(a.get(e).typo) - Number(a.get(t).typo));
	i.length || o.splice(0, o.length, ...Yt(o));
	let s = Mt(e);
	Object.keys(s).length;
	let c = o.flatMap((e) => {
		let t = a.get(e), n = t.bySku ? Ot(e, s, t.variant) : Wt(e, s);
		return n ? [O(e, n, s)] : [];
	});
	return hn({
		cards: c,
		count: c.length,
		filters: Pt(o),
		available: Ft(o, s)
	});
}
function Zt(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) {
		if (!At(n)) continue;
		let e = n.family.trim();
		if (!e) continue;
		let r = y(e);
		t.has(r) || t.set(r, {
			name: e,
			groups: []
		}), t.get(r).groups.push(n);
	}
	return [...t.values()].sort((e, t) => e.name.localeCompare(t.name, "es", {
		sensitivity: "base",
		numeric: !0
	}));
}
var Qt = [
	"Yoru",
	"Afo",
	"Sento",
	"Hoshi",
	"Kanu",
	"Koen"
], $t = {
	yoru: "https://d1zltvqju4u8ql.cloudfront.net/fit-in/1000x1000/MACROLED/ARQ/imagenes/productos/YORU%20WEB_0002s_0001_YORU-J-8W-N-WW_AMBIENT_1_ON.webp",
	afo: "https://d1zltvqju4u8ql.cloudfront.net/fit-in/1000x1000/MACROLED/ARQ/imagenes/productos/afo.jpg",
	sento: "https://d1zltvqju4u8ql.cloudfront.net/fit-in/1000x1000/MACROLED/ARQ/imagenes/productos/SENTO-J-520-12W-N-WW_AMBIENT_ON.webp",
	hoshi: "https://d1zltvqju4u8ql.cloudfront.net/fit-in/filters:format(webp)/MACROLED/ARQ/imagenes/productos/HOSHI-E-7W-15G-B_AMBIENT_1_ON.png",
	kanu: "https://d1zltvqju4u8ql.cloudfront.net/fit-in/MACROLED/ARQ/imagenes/productos/KANU-J-500-12W-N-WW_AMBIENT_3_ON.webp",
	koen: "https://d1zltvqju4u8ql.cloudfront.net/fit-in/1000x1000/MACROLED/ARQ/imagenes/productos/KOEN-P-20W-N-WW_HERO_AMBIENT_3_ON.webp"
}, en = {
	hoshi: "top",
	afo: "bottom"
};
function tn(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) {
		let e = n.family.trim();
		t.set(e, (t.get(e) ?? 0) + 1);
	}
	return [...t.entries()].sort((e, t) => t[1] - e[1])[0][0];
}
async function nn() {
	let { groups: e } = await T(), t = new Map(Zt(e).map((e) => [y(e.name), e]));
	return Qt.flatMap((e) => {
		let n = y(e), r = t.get(n), i = $t[n] ?? null;
		if (!r) return i ? [{
			name: e,
			href: E({ family: e }),
			image: i,
			focus: en[n] ?? null
		}] : (console.warn(`[arq] collection-index: no hay familia «${e}»`), []);
		let a = tn(r.groups), o = k(r.groups[0].defaultVariant.images), s = $t[y(e)] ?? o.context ?? o.studio ?? null, c = en[y(e)] ?? null;
		return [{
			name: a,
			href: E({ family: a }),
			image: s,
			focus: c
		}];
	});
}
var rn = { "tori-jardin": ["tori-visera"] }, an = (e, t) => e.map((e) => t.get(e)).filter((e) => e?.hasDefault).map((e) => {
	let t = O(e);
	return {
		name: t.name,
		href: t.href,
		image: t.image,
		finishes: Ht(e).map(({ name: e, src: t }) => ({
			name: e,
			src: t
		})),
		meta: ""
	};
});
async function on(e) {
	let { groups: t, groupById: n } = await T(), r = n.get(e);
	if (!r) return null;
	await wt(r);
	let i = y(r.family ?? ""), a = i ? t.filter((e) => e !== r && y(e.family ?? "") === i && At(e)).sort((e, t) => Jt(e) - Jt(t)).map((e) => O(e)) : [], o = r.images ?? {};
	return {
		group: r,
		collection: r.collectionData,
		variants: r.variants.map((e) => ({
			sku: e.sku,
			isDefault: e === r.defaultVariant,
			attributes: e.values
		})),
		variantAttributes: r.variantAttributes,
		finishImages: Object.fromEntries(Ht(r).filter((e) => e.src).map((e) => [e.name, e.src])),
		accessories: an(rn[r.id] ?? [], n),
		related: an(Object.keys(rn).filter((e) => rn[e].includes(r.id)), n),
		family: a,
		images: {
			ambient: sn(o.ambient),
			description: D(o.description) ? o.description : null,
			inspiration: sn(o.inspiration)
		},
		glossary: fn(r),
		files: Tn(r.defaultVariant).filter((e) => e.type === "cad" || e.type === "manual")
	};
}
var sn = (e) => [...new Set([e ?? []].flat().filter(D))], cn = (e, t) => dt(e.values.potencia, t.values.potencia) || dt(e.values.temperatura_color, t.values.temperatura_color) || Bt(Ut(e) ?? "") - Bt(Ut(t) ?? ""), ln = (e) => e.map((e, t) => [e, t]).sort(([e, t], [n, r]) => cn(e, n) || t - r).map(([e]) => e), un = (e) => g.filter(({ field: t }) => e.some((e) => D(e.values[t]))).map(({ field: e, label: t, wide: n }) => ({
	key: e,
	label: t,
	wide: n
}));
function dn(e) {
	let t = un(e.variants), n = e.variantAttributes.filter((e) => !t.some((t) => t.key === e) && !g.some((t) => t.field === e)).filter((t) => e.variants.some((e) => D(e.values[t]))).map((e) => ({
		key: e,
		label: v(e).label,
		card: !0
	})), r = t.findIndex((e) => e.key === "color_carcasa") + 1;
	return t.splice(r, 0, ...n), t;
}
function fn(e) {
	return {
		columns: dn(e),
		filters: e.variantAttributes.map((e) => ({
			key: e,
			label: v(e).label,
			swatches: v(e).control === "swatches"
		})),
		rows: ln(e.variants).map((e) => ({
			sku: e.sku,
			thumb: e.images?.studio ?? null,
			attributes: e.values,
			values: ne(e.values)
		}))
	};
}
function pn(e, t) {
	let n = e.collectionData?.name;
	if (!n) return e.family || e.name;
	let r = t.filter((t) => t.collection === e.collection);
	if (r.length === 1) return n;
	let i = r.filter((t) => t.application === e.application);
	return e.application && i.length === 1 ? `${n} ${e.application}` : e.name;
}
async function mn() {
	return null;
}
async function hn(e) {
	let t = await mn();
	return t ? t.fixtures.catalogListing(t.mode, e) : e;
}
async function gn() {
	let e = await _n(), t = await mn();
	return t ? t.fixtures.downloadsTable(t.mode, e) : e;
}
async function _n() {
	let { groups: e } = await T(), t = (e) => e.collectionData?.name || e.family || e.name, n = new Intl.Collator("es", {
		sensitivity: "base",
		numeric: !0
	}), r = new Map(e.map((e, t) => [e, t])), i = (e, t) => e.variants.findIndex((e) => e.name === t.name), a = e.flatMap((e) => e.variants.map((t) => ({
		group: e,
		variant: t
	}))).map((e, t) => [e, t]).sort(([e, a], [o, s]) => n.compare(t(e.group), t(o.group)) || dt(e.variant.values.potencia, o.variant.values.potencia) || r.get(e.group) - r.get(o.group) || i(e.group, e.variant) - i(o.group, o.variant) || cn(e.variant, o.variant) || a - s).map(([e]) => e), o = (e) => new Set(a.map(({ variant: t }) => t.values[e]).filter(D)).size > 1;
	return {
		columns: un(a.map(({ variant: e }) => e)),
		filters: re.filter(({ field: e }) => o(e)).map(({ field: e, label: t }) => ({
			key: e,
			label: t,
			swatches: v(e).control === "swatches"
		})),
		rows: a.map(({ group: t, variant: n }) => ({
			sku: n.sku,
			name: t.variantNames ? n.name : pn(t, e),
			href: Et(t.id, n.sku),
			meta: t.variantAttributes.map((e) => n.values[e]).filter(D).join(", "),
			thumb: n.images?.studio ?? null,
			search: [
				t.name,
				n.name,
				t.collectionData?.name
			].filter(Boolean).join(" "),
			attributes: n.values,
			values: ne(n.values)
		}))
	};
}
async function vn(e) {
	let t = await mn(), n = t?.fixtures.skuFiles(t.mode, e);
	if (n) return n;
	let { groups: r } = await T(), i = r.find((t) => t.variants.some((t) => t.sku === e));
	return i ? (await wt(i), Tn(i.variants.find((t) => t.sku === e))) : [];
}
async function yn(e) {
	let { groups: t } = await T(), n = t.find((t) => t.variants.some((t) => t.sku === e));
	if (!n) return null;
	let r = n.variants.find((t) => t.sku === e), i = k(r.images), a = k(n.defaultVariant.images), o = {
		name: Tt(n, r),
		sku: r.sku,
		image: i.main ?? i.studio ?? a.main ?? a.studio ?? null,
		cota: r.cota ?? null,
		sections: ie(r.values)
	}, s = await mn();
	return s ? s.fixtures.datasheet(s.mode, o) : o;
}
async function bn(e) {
	let { groupById: t } = await T(), n = e.map((e) => t.get(e)).filter(Boolean).map((e) => ({
		...O(e),
		meta: Sn(e)
	})), r = await mn();
	return r?.mode.startsWith("loading") ? (await r.fixtures.catalogListing(r.mode, {
		cards: n,
		count: n.length,
		filters: []
	})).cards : n;
}
async function xn() {
	let { groups: e } = await T();
	return e.flatMap((e) => e.variants.filter((e) => e.isNew).map((t) => ({
		...O(e, t),
		name: Tt(e, t),
		meta: Sn(e)
	}))).sort((e, t) => yt(e.name) - yt(t.name));
}
function Sn(e) {
	return e.productType && e.productType !== "Luminaria" ? e.productType : e.application ?? e.productType ?? "";
}
var Cn = {
	cad: "CAD 2D/3D",
	manual: "Manual",
	ies: "IES",
	fotometria: "Fotometría",
	cotas: "Cotas"
}, wn = (e) => e.cota ?? null;
function Tn(e) {
	let t = {
		...k(e.downloads),
		cotas: wn(e)
	};
	return Object.keys(Cn).filter((e) => t[e]).map((e) => ({
		type: e,
		label: Cn[e],
		href: t[e]
	}));
}
function En(e, t) {
	let n = e.variants.find((e) => e.sku === t) ?? e.defaultVariant, r = k(n.images), i = [...r.gallery ?? [r.studio].filter(Boolean)], a = [...r.galleryOn ?? [r.studioOn ?? null]], o = (e.images?.heroExtra ?? []).filter((e) => !i.includes(e));
	if (o.length) {
		let e = i.includes(r.context) ? i.indexOf(r.context) + 1 : i.length;
		i.splice(e, 0, ...o), a.splice(e, 0, ...o.map(() => null));
	}
	return {
		sku: n.sku,
		name: Tt(e, n),
		description: n.description,
		values: n.values,
		images: i.map((t, n) => ({
			src: t,
			srcOn: a[n] ?? null,
			alt: `${e.name}, imagen ${n + 1}`
		})),
		sections: ie(n.values),
		downloads: Tn(n),
		cota: wn(n)
	};
}
async function Dn(e) {
	let { collectionById: t, groups: n } = await T(), r = t.get(e);
	if (!r) return null;
	let i = r.images ?? {};
	return {
		collection: r,
		cards: n.filter((t) => t.collection === e).map((e) => ({
			...O(e),
			meta: On(e)
		})),
		images: {
			gallery: sn(i.gallery),
			description: D(i.description) ? i.description : null,
			inspiration: sn(i.inspiration)
		}
	};
}
function On(e) {
	let t = (e) => Number.parseFloat(String(e).replace(/^x/i, "").replace(",", "."));
	return e.variantAttributes.filter((e) => v(e).control !== "swatches" && v(e).summary !== !1).map((n) => {
		let r = [...new Set(e.variants.map((e) => e.values[n]).filter(D))];
		r.sort((e, n) => t(e) - t(n) || String(e).localeCompare(String(n), "es"));
		let i = r.length > 1 ? `${r[0]} – ${r.at(-1)}` : r[0], a = v(n).unit;
		return a && i ? `${i} ${r.length === 1 && t(r[0]) === 1 ? a[0] : a[1]}` : i;
	}).filter(Boolean).join(" · ");
}
var kn = (e) => e.variants.map((t) => ({
	sku: t.sku,
	isDefault: t === e.defaultVariant,
	attributes: t.values
})), An = (e, t) => Object.fromEntries(e.variantAttributes.map((e) => [e, t.values[e]]));
function jn(e, t) {
	let n = An(e, t);
	return rt(kn(e), e.variantAttributes, n).map(({ attribute: t, options: r }) => {
		let i = v(t);
		return {
			field: t,
			label: i.label,
			value: n[t] ?? "",
			options: r.map((t) => ({
				value: t.value,
				label: t.value,
				disabled: t.disabled,
				showSwatch: i.control === "swatches",
				swatch: i.control === "swatches" ? _t(t.value, e.family) ?? void 0 : void 0
			}))
		};
	});
}
async function Mn(e, t, n) {
	let { groups: r } = await T(), i = r.find((t) => t.variants.some((t) => t.sku === e)), a = i?.variants.find((t) => t.sku === e);
	if (!i || !a) return null;
	let o = ct(kn(i), i.variantAttributes, An(i, a), t, n);
	return $e(kn(i), o)?.sku ?? null;
}
async function Nn(e) {
	let { groups: t } = await T(), n = e.slice(0, 3).flatMap((e) => {
		let n = t.find((t) => t.variants.some((t) => t.sku === e));
		return n ? [{
			group: n,
			variant: n.variants.find((t) => t.sku === e)
		}] : [];
	}), r = n.map(({ group: e, variant: t }) => {
		let n = O(e, t);
		return {
			sku: t.sku,
			name: Tt(e, t),
			meta: t.sku,
			image: n.image,
			href: n.href,
			attributes: jn(e, t)
		};
	}), i = ie(Object.assign({}, ...n.map(({ variant: e }) => e.values))).map((e) => ({
		label: e.label,
		rows: e.rows.map((e) => ({
			label: e.label,
			values: n.map(({ variant: t }) => t.values[e.field] ?? "—")
		}))
	})), a = i.find((e) => e.label === "Información comercial"), o = {
		label: "SKU",
		values: n.map(({ variant: e }) => e.sku)
	};
	return a ? a.rows.unshift(o) : n.length && i.push({
		label: "Información comercial",
		rows: [o]
	}), {
		products: r,
		groups: i
	};
}
var Pn = (e) => [...new Set(e.variants.map((e) => e.category).filter(Boolean))], Fn = (e) => [
	e.name,
	e.collectionData?.name,
	e.application,
	e.productType,
	...e.environment,
	...Pn(e)
].join(" ");
function In(e, t) {
	let n = fe(Fn(e), t);
	if (n === "exact") return {
		variant: e.defaultVariant,
		bySku: !1,
		typo: !1
	};
	let r = e.variants.find((e) => fe(e.sku, t, { typos: !1 }));
	if (r) return {
		variant: r,
		bySku: !0,
		typo: !1
	};
	let i = e.variantNames ? e.variants.find((e) => fe(e.name, t, { typos: !1 })) : null;
	return i ? {
		variant: i,
		bySku: !0,
		typo: !1
	} : n ? {
		variant: e.defaultVariant,
		bySku: !1,
		typo: !0
	} : null;
}
var Ln = (e) => e.sort((e, t) => Number(e.typo) - Number(t.typo));
async function Rn(e, { limit: t = 5, collectionLimit: n = 3 } = {}) {
	let r = ce(e);
	if (!r.length) return {
		results: [],
		total: 0
	};
	let { groups: i } = await T(), a = Ln(i.flatMap((e) => {
		if (!e.hasDefault) return [];
		let t = In(e, r);
		if (!t) return [];
		let n = O(e, t.variant);
		return [{
			kind: "product",
			name: t.bySku ? Tt(e, t.variant) : e.name,
			meta: t.variant.sku,
			href: n.href,
			image: n.image,
			typo: t.typo
		}];
	})), o = Ln(Zt(i).flatMap((e) => {
		let t = fe(e.name, r), n = k(e.groups[0].defaultVariant.images);
		return t ? [{
			kind: "collection",
			name: e.name,
			meta: "Colección",
			href: E({ family: e.name }),
			image: n.studio ?? n.context ?? null,
			typo: t === "typo"
		}] : [];
	})), s = o.filter((e) => !e.typo), c = (s.length ? s : o).slice(0, n);
	return {
		results: [...a.slice(0, t), ...c].map(({ typo: e, ...t }) => t),
		total: a.length
	};
}
var zn = (e) => `/arq/productos?q=${encodeURIComponent(e)}`, Bn = "Lámparas y artefactos", Vn = (e) => !e.productType || e.productType === "Luminaria";
function Hn(e) {
	return Vn(e) ? It(e) : [Bn, e.application ?? e.productType].filter(Boolean).join(" · ");
}
async function Un({ query: e = "", selected: t = [] } = {}) {
	let { groups: n } = await T(), r = ce(e), i = new Set(t);
	return { items: n.flatMap((e) => {
		if (!e.hasDefault) return [];
		let t = r.length ? In(e, r) : { variant: e.defaultVariant };
		return t ? [{
			id: e.id,
			sku: t.variant.sku,
			name: e.name,
			meta: Hn(e),
			cardMeta: It(e),
			image: O(e, t.variant).image,
			added: e.variants.some((e) => i.has(e.sku))
		}] : [];
	}) };
}
async function Wn() {
	let { groups: e } = await T(), t = e.filter((e) => e.hasDefault), n = (e) => t.filter((t) => jt(t, e) && At(t, e)).length, r = (e) => {
		let t = k(e.defaultVariant.images);
		return {
			image: t.context ?? t.studio ?? null,
			thumb: t.studio ?? null
		};
	}, i = (e, { studio: t = !0 } = {}) => {
		let n = e.map((e) => k(e.defaultVariant.images));
		return [...n.map((e) => e.contextOn ?? e.context), ...t ? n.map((e) => e.studio) : []];
	}, a = (e) => {
		let [t = null, ...n] = [...new Set(e.filter(Boolean))];
		return {
			image: t,
			fallbacks: n
		};
	}, o = (e, o) => {
		let s = t.filter((e) => jt(e, o));
		return {
			label: e,
			href: E(o),
			count: n(o),
			...a([s.find((e) => e.menuImage)?.menuImage, ...i(s)]),
			thumb: s.map(r).find((e) => e.image)?.thumb ?? null
		};
	}, s = (e, n) => {
		let r = e === kt, i = [...[...new Set(t.filter((t) => t.environment.includes(e) && (r ? At(t, { environment: e }) : t.productType === "Luminaria")).map((e) => e.application).filter(Boolean))].map((t) => o(t, r ? {
			environment: e,
			application: t
		} : {
			environment: e,
			application: t,
			productType: "Luminaria"
		})), ...r ? [] : [o("Artefactos", {
			environment: e,
			productType: "Artefacto"
		}), o("Lámparas", {
			environment: e,
			productType: "Lámpara"
		})]].filter((e) => e.count);
		return i.length ? {
			id: y(e),
			label: e,
			href: E({ environment: e }),
			all: {
				label: n,
				href: E({ environment: e })
			},
			links: i
		} : null;
	};
	return {
		sections: {
			interior: s("Interior", "Ver todo interior"),
			exterior: s("Exterior", "Ver todo exterior"),
			"lamparas-y-artefactos": s(kt, "Ver todo lámparas y artefactos")
		},
		collections: Zt(t).map((e) => {
			let t = e.groups, n = [...new Set(t.flatMap((e) => e.environment))];
			return {
				label: e.name,
				meta: [...new Set(t.map((e) => e.application).filter(Boolean))].join(" · "),
				href: E({ family: e.name }),
				eyebrow: n.length ? `Línea ${n.join(" · ")}` : "",
				...a(i(t)),
				thumb: t.map(r).find((e) => e.thumb)?.thumb ?? null
			};
		})
	};
}
async function Gn() {
	let { groups: e } = await T(), t = e.filter((e) => e.hasDefault), n = (e) => t.filter((t) => jt(t, e) && At(t, e)).length, r = (e, t) => ({
		label: e,
		href: E(t),
		count: n(t)
	}), i = (e) => {
		let n = e === kt;
		return [...[...new Set(t.filter((t) => t.environment.includes(e) && (n ? At(t, { environment: e }) : t.productType === "Luminaria")).map((e) => e.application).filter(Boolean))].map((t) => r(t, n ? {
			environment: e,
			application: t
		} : {
			environment: e,
			application: t,
			productType: "Luminaria"
		})), ...n ? [] : [r("Artefactos", {
			environment: e,
			productType: "Artefacto"
		}), r("Lámparas", {
			environment: e,
			productType: "Lámpara"
		})]].filter((e) => e.count);
	};
	return {
		interior: i("Interior"),
		exterior: i("Exterior"),
		"lamparas-artefactos": i(kt),
		colecciones: Zt(t).map((e) => ({
			label: e.name,
			href: E({ family: e.name })
		}))
	};
}
//#endregion
//#region src/styles/print-tokens.js
var A = Object.freeze({
	"space/section/2xs": 32,
	"space/section/xs": 48,
	"space/section/sm": 64,
	"space/section/md": 96,
	"space/section/lg": 128,
	"space/section/xl": 160,
	"space/gap/xs": 4,
	"space/gap/sm": 8,
	"space/gap/sm-md": 12,
	"space/gap/md": 16,
	"space/gap/lg": 24,
	"space/gap/xl": 32,
	"space/gap/xl-2xl": 40,
	"space/gap/2xl": 48,
	"space/gap/3xl": 64,
	"space/gap/4xl": 80,
	"space/gap/5xl": 96,
	"space/gap/6xl": 128,
	"space/padding/2xs": 3,
	"space/padding/xs": 4,
	"space/padding/sm": 8,
	"space/padding/sm-md": 12,
	"space/padding/md": 16,
	"space/padding/lg": 24,
	"space/padding/xl": 32,
	"space/padding/xl-2xl": 40,
	"space/padding/2xl": 48,
	"space/padding/3xl": 64,
	"space/padding/4xl": 80,
	"space/padding/5xl": 96,
	"space/padding/6xl": 128,
	"font/family/sans": "Albert Sans",
	"border/default": 1,
	"border/focus": 1,
	"border/strong": 2,
	"color/surface/default": "#FFFFFF",
	"color/surface/faint": "#FBFBFB",
	"color/surface/hover": "#F7F7F7",
	"color/surface/soft": "#F4F4F4",
	"color/surface/subtle": "#F0F0F0",
	"color/surface/selected": "#E9E9E9",
	"color/surface/strong": "#E0E0E0",
	"color/surface/inverse": "#101010",
	"color/surface/inverse-hover": "#2E2E2E",
	"color/surface/inverse-pressed": "#666666",
	"color/surface/transparent": "#00000000",
	"color/surface/bone": "#F3F0E9",
	"color/surface/sand": "#F7F1EC",
	"color/text/primary": "#101010",
	"color/text/secondary": "#2E2E2E",
	"color/text/tertiary": "#666666",
	"color/text/inverse": "#FFFFFF",
	"color/text/accent": "#101010",
	"color/text/disabled": "#ADADAD",
	"color/text/error": "#A8322A",
	"color/text/success": "#3F6F53",
	"color/text/warning": "#8A5F10",
	"color/icon/primary": "#101010",
	"color/icon/secondary": "#2E2E2E",
	"color/icon/tertiary": "#666666",
	"color/icon/accent": "#101010",
	"color/icon/inverse": "#FFFFFF",
	"color/icon/disabled": "#ADADAD",
	"color/border/subtle": "#1010101A",
	"color/border/default": "#10101038",
	"color/border/hover": "#8A8A8A",
	"color/border/strong": "#101010",
	"color/border/disabled": "#E0E0E0",
	"color/border/focus": "#101010",
	"color/border/error": "#A8322A",
	"color/action/primary": "#101010",
	"color/action/primary-hover": "#2E2E2E",
	"color/action/on-primary": "#FFFFFF",
	"color/accent/default": "#101010",
	"color/overlay/scrim": "#000000B2",
	"color/overlay/translucent": "#1010101A",
	"color/overlay/scrim-gallery": "#000000E5",
	"color/overlay/frosted": "#FFFFFF99",
	"layout/gutter": 40,
	"layout/card-min": 280,
	"layout/card-min-wide": 340,
	"layout/compare-media-max": 2e3,
	"layout/measure": 400,
	"layout/measure-wide": 520,
	"layout/gallery-thumb": 105,
	"layout/filter-panel": 560,
	"layout/table-thumb": 100,
	"layout/compare-thumb": 48,
	"layout/compare-slot": 400,
	"layout/compare-label": 320,
	"layout/compare-column": 160,
	"layout/mega-menu-image": 420,
	"layout/search-field": 360,
	"layout/search-thumb": 48,
	"layout/max-width": 1792,
	"layout/select-filter": 160,
	"layout/select-menu-filter": 200,
	"layout/footer-column": 200,
	"layout/footer-tagline": 240,
	"layout/featured-thumb": 160,
	"layout/pdf-spec-label": 260,
	"layout/carousel-button": 44,
	"layout/catalog-nav": 240,
	"layout/download-thumb": 72,
	"layout/catalog-cover": 168,
	"layout/download-search": 480,
	"layout/compare-picker-list": 400,
	"layout/navbar-height": 56,
	"layout/mega-link-thumb": 80,
	"layout/result-thumb": 100,
	"layout/gallery-thumb-overlay": 66,
	"layout/pdf-cover-image": 240,
	"layout/pdf-spec-label-compact": 160,
	"type/display/size": 40,
	"type/display/leading": 44,
	"type/display-sm/size": 32,
	"type/display-sm/leading": 40,
	"type/heading-1/size": 32,
	"type/heading-1/leading": 40,
	"type/heading-2/size": 24,
	"type/heading-2/leading": 32,
	"type/heading-3/size": 20,
	"type/heading-3/leading": 28,
	"type/body-xl/size": 16,
	"type/body-xl/leading": 24,
	"type/body-lg/size": 16,
	"type/body-lg/leading": 24,
	"type/body/size": 16,
	"type/body/leading": 24,
	"type/body-sm/size": 12,
	"type/body-sm/leading": 16,
	"type/label/size": 12,
	"type/label/leading": 16,
	"type/label-sm/size": 10,
	"type/label-sm/leading": 14,
	"type/caption/size": 12,
	"type/caption/leading": 14,
	"type/body-compact/size": 14,
	"type/body-compact/leading": 24,
	"type/display-lg/size": 48,
	"type/display-lg/leading": 56,
	"type/label-lg/size": 14,
	"type/label-lg/leading": 16
}), j = Object.freeze({
	"display-lg": {
		fontFamily: "Albert Sans",
		fontWeight: 300,
		fontSize: 48,
		lineHeight: 56,
		letterSpacing: -.8
	},
	display: {
		fontFamily: "Albert Sans",
		fontWeight: 300,
		fontSize: 40,
		lineHeight: 44,
		letterSpacing: -.8
	},
	"display-sm": {
		fontFamily: "Albert Sans",
		fontWeight: 300,
		fontSize: 32,
		lineHeight: 40,
		letterSpacing: -.4
	},
	"heading-1": {
		fontFamily: "Albert Sans",
		fontWeight: 300,
		fontSize: 32,
		lineHeight: 40,
		letterSpacing: -.4
	},
	"heading-2": {
		fontFamily: "Albert Sans",
		fontWeight: 300,
		fontSize: 24,
		lineHeight: 32,
		letterSpacing: 0
	},
	"heading-3": {
		fontFamily: "Albert Sans",
		fontWeight: 400,
		fontSize: 20,
		lineHeight: 28,
		letterSpacing: 0
	},
	"heading-3-light": {
		fontFamily: "Albert Sans",
		fontWeight: 300,
		fontSize: 20,
		lineHeight: 28,
		letterSpacing: 0
	},
	"body-xl": {
		fontFamily: "Albert Sans",
		fontWeight: 400,
		fontSize: 16,
		lineHeight: 24,
		letterSpacing: 0
	},
	"body-xl-light": {
		fontFamily: "Albert Sans",
		fontWeight: 300,
		fontSize: 16,
		lineHeight: 24,
		letterSpacing: 0
	},
	"body-lg": {
		fontFamily: "Albert Sans",
		fontWeight: 300,
		fontSize: 16,
		lineHeight: 24,
		letterSpacing: 0
	},
	"body-lg-regular": {
		fontFamily: "Albert Sans",
		fontWeight: 400,
		fontSize: 16,
		lineHeight: 24,
		letterSpacing: 0
	},
	"body-lg-medium": {
		fontFamily: "Albert Sans",
		fontWeight: 500,
		fontSize: 16,
		lineHeight: 24,
		letterSpacing: 0
	},
	body: {
		fontFamily: "Albert Sans",
		fontWeight: 300,
		fontSize: 16,
		lineHeight: 24,
		letterSpacing: 0
	},
	"body-regular": {
		fontFamily: "Albert Sans",
		fontWeight: 400,
		fontSize: 16,
		lineHeight: 24,
		letterSpacing: 0
	},
	"body-medium": {
		fontFamily: "Albert Sans",
		fontWeight: 500,
		fontSize: 16,
		lineHeight: 24,
		letterSpacing: 0
	},
	"body-strong": {
		fontFamily: "Albert Sans",
		fontWeight: 600,
		fontSize: 16,
		lineHeight: 24,
		letterSpacing: 0
	},
	"body-compact": {
		fontFamily: "Albert Sans",
		fontWeight: 300,
		fontSize: 14,
		lineHeight: 24,
		letterSpacing: 0
	},
	"body-compact-regular": {
		fontFamily: "Albert Sans",
		fontWeight: 400,
		fontSize: 14,
		lineHeight: 24,
		letterSpacing: 0
	},
	"body-compact-medium": {
		fontFamily: "Albert Sans",
		fontWeight: 500,
		fontSize: 14,
		lineHeight: 24,
		letterSpacing: 0
	},
	"body-compact-strong": {
		fontFamily: "Albert Sans",
		fontWeight: 600,
		fontSize: 14,
		lineHeight: 24,
		letterSpacing: 0
	},
	"body-sm": {
		fontFamily: "Albert Sans",
		fontWeight: 400,
		fontSize: 12,
		lineHeight: 16,
		letterSpacing: 0
	},
	"body-sm-medium": {
		fontFamily: "Albert Sans",
		fontWeight: 500,
		fontSize: 12,
		lineHeight: 16,
		letterSpacing: 0
	},
	"label-lg": {
		fontFamily: "Albert Sans",
		fontWeight: 400,
		fontSize: 14,
		lineHeight: 16,
		letterSpacing: 1,
		textTransform: "uppercase"
	},
	label: {
		fontFamily: "Albert Sans",
		fontWeight: 400,
		fontSize: 12,
		lineHeight: 16,
		letterSpacing: 1,
		textTransform: "uppercase"
	},
	"label-sm": {
		fontFamily: "Albert Sans",
		fontWeight: 500,
		fontSize: 10,
		lineHeight: 14,
		letterSpacing: 1,
		textTransform: "uppercase"
	},
	caption: {
		fontFamily: "Albert Sans",
		fontWeight: 400,
		fontSize: 12,
		lineHeight: 14,
		letterSpacing: .4
	},
	"caption-medium": {
		fontFamily: "Albert Sans",
		fontWeight: 500,
		fontSize: 12,
		lineHeight: 14,
		letterSpacing: .4
	}
}), Kn = [
	"M13.2112 1.03819C13.5552 0.538809 14.1401 0.243121 14.7662 0.243121H16.9337V15.6977H13.452V7.16879C13.452 6.99138 13.2112 6.92567 13.108 7.07023L8.62167 13.4637C8.54598 13.5688 8.38772 13.5688 8.31203 13.4637L3.80509 7.07023C3.70188 6.92567 3.46793 6.99138 3.46793 7.16879V15.6977H0V0.243121H2.16746C2.79361 0.243121 3.37848 0.538809 3.72252 1.03819L8.31203 7.76674C8.38772 7.87187 8.55286 7.87187 8.62855 7.76674L13.2112 1.03819ZM35.0922 15.6977H31.1564L30.5233 14.1799C30.5233 14.1799 30.5233 14.1667 30.5164 14.1602C30.1518 13.306 29.4362 13.1351 28.5623 13.1351H23.5943L22.5209 15.6977H18.592L24.8604 1.07105C25.0806 0.571663 25.5898 0.243121 26.1609 0.243121H28.4591L28.4797 0.295688L35.0853 15.6977H35.0922ZM29.0095 10.2571L27.021 5.46037C26.9591 5.30924 26.7389 5.30924 26.6769 5.46037L24.6677 10.2637H29.0164L29.0095 10.2571ZM47.6703 10.7828C47.6703 10.7828 46.2873 12.6949 43.5487 12.6949C42.1657 12.6949 41.0235 12.2546 40.0533 11.361C39.1175 10.4476 38.6633 9.34374 38.6633 7.98357C38.6633 6.62341 39.1175 5.51951 40.0533 4.60616C41.0166 3.71253 42.1657 3.27228 43.5487 3.27228C45.1244 3.27228 46.4455 3.85051 47.4914 4.99384L47.5534 5.05955L49.191 2.51663C49.2804 2.37207 49.2529 2.18152 49.1222 2.06324C47.574 0.742505 45.6405 0.0197125 43.5487 0.0197125C41.1542 0.0197125 39.1725 0.755647 37.4936 2.28008C36.0073 3.64682 35.0096 5.85462 35.0096 7.977C35.0096 10.2702 35.8216 12.1363 37.4936 13.6739C39.1725 15.1918 41.1542 15.9343 43.5487 15.9343C45.7024 15.9343 47.6979 15.1721 49.2598 13.7725C49.3905 13.6542 49.4181 13.4702 49.3217 13.3257L47.6703 10.7828ZM60.9985 9.66571C60.9022 9.7117 60.8677 9.82998 60.9297 9.9154L64.9068 15.6912H61.4113C60.9297 15.6912 60.4755 15.4481 60.2209 15.0604L57.331 10.6053H55.1291V15.6912H51.4617V3.48912V0.243121H58.198C59.7118 0.243121 61.0122 0.742505 62.065 1.7347C63.1522 2.72033 63.682 3.90965 63.682 5.36838C63.682 7.22793 62.5811 8.88378 60.9916 9.66571M55.1291 7.27392C55.1291 7.37248 55.2117 7.45134 55.3149 7.45134H57.8127C59.1407 7.45134 59.9939 6.64969 59.9939 5.41437C59.9939 4.31704 59.1819 3.48912 58.1085 3.48912H55.1291V7.27392ZM79.7281 2.32608C81.3795 3.86366 82.2121 5.77577 82.2121 8.00329C82.2121 10.2374 81.3864 12.1561 79.7487 13.7002C78.1042 15.2312 76.0881 16.0066 73.7349 16.0066C71.4092 16.0066 69.3862 15.2312 67.7279 13.7002C66.0903 12.1561 65.2646 10.2374 65.2646 8.00329C65.2646 5.78234 66.0903 3.87023 67.7279 2.32608C69.3862 0.78193 71.4092 0 73.7418 0C76.0881 0 78.0973 0.78193 79.735 2.32608M68.9665 8.00329C68.9665 9.34374 69.4206 10.4476 70.3495 11.3676C71.2647 12.2546 72.4069 12.708 73.7418 12.708C75.0904 12.708 76.1913 12.2612 77.1134 11.3478C78.0423 10.4411 78.5171 9.31745 78.5171 8.00329C78.5171 6.70883 78.056 5.59179 77.1409 4.67844C76.2189 3.75852 75.0766 3.29199 73.7486 3.29199C72.4206 3.29199 71.2784 3.75852 70.3564 4.67844C69.4413 5.58522 68.9734 6.70883 68.9734 8.00329M86.6433 0.243121H84.2832V3.48912V15.6977H94.164V12.3598H88.2328C88.1296 12.3598 88.047 12.2809 88.047 12.1823V1.577C88.047 0.841068 87.4208 0.243121 86.6433 0.243121ZM100.185 12.4517C100.082 12.4517 99.999 12.3729 99.999 12.2743V9.37659H105.951V6.16345H100.192C100.088 6.16345 100.006 6.0846 100.006 5.98604V3.48912H105.779C106.55 3.48912 107.183 2.89117 107.183 2.15524V0.243121H96.3177V15.6977H107.492V12.4517H100.192H100.185ZM124.364 8.00329C124.364 10.3359 123.621 12.2218 122.148 13.6148C120.71 15.0012 118.598 15.7043 115.866 15.7043H109.928V0.243121H115.846C118.557 0.243121 120.669 0.965914 122.128 2.39836C123.614 3.80452 124.364 5.69035 124.364 8.00329ZM113.623 12.2678C113.623 12.3663 113.706 12.4452 113.809 12.4452H115.639C119.052 12.4452 120.641 11.0324 120.641 7.99672C120.641 6.59055 120.256 5.47351 119.506 4.68501C118.77 3.88994 117.463 3.48912 115.612 3.48912H113.616V12.2743L113.623 12.2678Z",
	"M141.655 1.64271H140.912L135.532 15.5006H134.142L139.977 0.512526H142.578L148.385 15.5072H147.016L141.655 1.64928V1.64271ZM136.722 10.2374H145.873V11.3741H136.722V10.2374Z",
	"M156.89 0.512526C158.128 0.512526 159.133 0.70308 159.903 1.09076C160.674 1.47844 161.245 1.99754 161.617 2.65462C161.988 3.3117 162.174 4.05421 162.174 4.88214C162.174 5.49322 162.071 6.06489 161.858 6.59713C161.651 7.12279 161.328 7.58932 160.894 7.977C160.461 8.37125 159.917 8.68008 159.257 8.91006C158.596 9.14004 157.819 9.25175 156.924 9.25175H153.023V15.5072H151.653V0.512526H156.883H156.89ZM160.791 4.88214C160.791 3.89651 160.495 3.11458 159.897 2.5232C159.298 1.9384 158.293 1.64271 156.89 1.64271H153.029V8.08871H156.931C157.825 8.08871 158.562 7.95072 159.126 7.68131C159.69 7.41191 160.11 7.0308 160.385 6.54456C160.653 6.05832 160.791 5.4998 160.791 4.87557V4.88214ZM158.073 8.75893L162.449 15.5072H160.901L156.594 8.75893H158.073Z",
	"M180.415 4.91499C180.023 3.98193 179.486 3.17372 178.791 2.49692C178.096 1.82012 177.277 1.29446 176.349 0.919918C175.413 0.551951 174.401 0.361396 173.307 0.361396C172.213 0.361396 171.174 0.54538 170.232 0.919918C169.289 1.29446 168.47 1.81355 167.761 2.49692C167.059 3.17372 166.516 3.98193 166.137 4.91499C165.759 5.84805 165.566 6.87967 165.566 8.00986C165.566 9.14004 165.759 10.1717 166.137 11.1047C166.516 12.0378 167.059 12.846 167.761 13.5228C168.463 14.1996 169.289 14.7253 170.232 15.0998C171.174 15.4743 172.199 15.6583 173.307 15.6583C174.415 15.6583 175.413 15.4743 176.349 15.0998C177.284 14.7318 178.096 14.2062 178.791 13.5228C179.486 12.846 180.03 12.0378 180.415 11.1047C180.8 10.1717 181 9.14004 181 8.00986C181 6.87967 180.807 5.84805 180.415 4.91499ZM178.771 11.4793C178.206 12.4517 177.456 13.2008 176.507 13.7265C175.557 14.2522 174.491 14.5216 173.307 14.5216C172.124 14.5216 171.037 14.2587 170.08 13.7265C169.124 13.2008 168.367 12.4517 167.803 11.4793C167.238 10.5068 166.963 9.35031 166.963 8.00986C166.963 6.6694 167.245 5.50637 167.803 4.52731C168.367 3.54825 169.124 2.79918 170.08 2.28008C171.037 1.76099 172.117 1.49815 173.307 1.49815C174.498 1.49815 175.55 1.76099 176.507 2.28008C177.456 2.79918 178.213 3.54825 178.771 4.52731C179.335 5.50637 179.61 6.66283 179.61 8.00986C179.61 9.35688 179.328 10.5068 178.771 11.4793Z",
	"M176.698 10.9485L175.745 11.8591L179.598 15.539L180.552 14.6283L176.698 10.9485Z"
], qn = Object.freeze({
	width: 181,
	height: 16
}), Jn = Object.freeze({
	default: 181,
	small: 158,
	compact: 117
}), Yn = Object.freeze({
	label: "Ficha técnica",
	brand: "Macroled Arq"
}), Xn = .75, M = (e) => e * Xn, Zn = Object.freeze({
	width: 595.28,
	height: 841.89
}), Qn = 1.2, N = {
	top: A["space/padding/xl"],
	side: A["space/padding/xl-2xl"],
	bottom: A["space/padding/lg"]
}, $n = A["border/default"], er = "border/default", tr = "surface/strong", nr = (e) => `${A["font/family/sans"].replace(/\s+/g, "")}-${e}`, rr = Object.freeze([...new Set([
	"label",
	"heading-2",
	"body-compact-medium",
	"body-sm",
	"body-sm-medium"
].map((e) => j[e].fontWeight))]);
function ir(e, t = A["color/surface/default"]) {
	let n = e.match(/^#([0-9a-f]{6})([0-9a-f]{2})?$/i);
	if (!n?.[2]) return e;
	let r = parseInt(n[2], 16) / 255, i = (e) => [
		0,
		2,
		4
	].map((t) => parseInt(e.slice(t, t + 2), 16)), a = i(t.replace("#", ""));
	return `#${i(n[1]).map((e, t) => Math.round(e * r + a[t] * (1 - r))).map((e) => e.toString(16).padStart(2, "0")).join("")}`;
}
var P = (e) => ir(A[`color/${e}`]);
function F(e, t, n, { above: r = 0 } = {}) {
	let i = j[t], a = M((i.lineHeight - Qn * i.fontSize) / 2);
	return {
		text: i.textTransform === "uppercase" ? String(e).toLocaleUpperCase("es") : String(e),
		font: nr(i.fontWeight),
		fontSize: M(i.fontSize),
		lineHeight: i.lineHeight / (Qn * i.fontSize),
		characterSpacing: M(i.letterSpacing),
		color: P(n),
		margin: [
			0,
			M(r) + a,
			0,
			-a
		]
	};
}
function ar(e, { lineAt: t, lineColor: n, padding: r, widths: i = ["*"] }) {
	return {
		table: {
			widths: i,
			body: [Array.isArray(e) ? e : [e]]
		},
		layout: {
			hLineWidth: (e) => e === +(t === "bottom") ? M($n) : 0,
			vLineWidth: () => 0,
			hLineColor: () => n,
			paddingLeft: () => 0,
			paddingRight: () => 0,
			paddingTop: () => t === "top" ? M(r) : 0,
			paddingBottom: () => t === "bottom" ? M(r) : 0
		}
	};
}
function or() {
	let e = Jn.small, t = Kn.map((e) => `<path d="${e}"/>`).join("");
	return {
		svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${qn.width} ${qn.height}" fill="${P("text/primary")}">${t}</svg>`,
		width: M(e),
		height: M(e * qn.height / qn.width)
	};
}
var sr = Jn.small * qn.height / qn.width, cr = j["body-sm-medium"].lineHeight + j["body-sm"].lineHeight, lr = (e) => Math.max(e, sr) + A["space/padding/sm-md"] + $n, ur = j.label.lineHeight + A["space/padding/sm-md"] + $n;
function dr(e, t = Yn.label) {
	let n = e ? { stack: [F(e.name, "body-sm-medium", "text/primary"), F(e.sku, "body-sm", "text/tertiary")] } : F(t, "label", "text/tertiary"), r = e ? cr : j.label.lineHeight;
	return ar({
		columns: [{
			...or(),
			margin: [
				0,
				M((r - sr) / 2),
				0,
				0
			]
		}, {
			...n,
			width: "*",
			alignment: "right"
		}],
		columnGap: M(A["space/gap/md"])
	}, {
		lineAt: "bottom",
		lineColor: P(er),
		padding: A["space/padding/sm-md"]
	});
}
function fr(e, t) {
	return ar({
		...F(`${e} / ${t}`, "label", "text/tertiary"),
		alignment: "right"
	}, {
		lineAt: "top",
		lineColor: P(er),
		padding: A["space/padding/sm-md"]
	});
}
var pr = Zn.width / Xn - 2 * N.side, mr = (pr - A["space/gap/xl"]) / 2, hr = A["layout/pdf-cover-image"], gr = 1.5;
function _r(e) {
	return hr * Math.min(Math.max(e, 1), gr);
}
var I = A["space/padding/lg"];
function vr(e, { image: t, cota: n }) {
	let r = M(hr), i = [F(e.name, "heading-2", "text/primary"), F(e.sku, "body-sm", "text/secondary", { above: A["space/gap/xs"] })], a = [t ? {
		image: t,
		width: r,
		height: r
	} : { canvas: [{
		type: "rect",
		x: 0,
		y: 0,
		w: r,
		h: r,
		color: P(tr)
	}] }, ...n ? [{
		image: n.image,
		width: M(n.width),
		height: r - 2 * M(I),
		margin: [
			M(A["space/gap/md"] + I),
			M(I),
			M(I),
			M(I)
		]
	}] : []];
	return {
		...ar({ stack: [{ stack: i }, {
			columns: [...a.map((e) => ({
				...e,
				width: "auto"
			})), {
				text: "",
				width: "*"
			}],
			columnGap: 0,
			margin: [
				0,
				M(A["space/gap/md"]),
				0,
				0
			]
		}] }, {
			lineAt: "bottom",
			lineColor: P(er),
			padding: A["space/padding/md"]
		}),
		unbreakable: !0
	};
}
var yr = (e, t, n) => ({
	...F(e, t, n),
	border: [
		!1,
		!1,
		!1,
		!0
	]
});
function br(e, t, n) {
	let r = M(A["space/padding/sm"]), i = A["layout/pdf-spec-label-compact"], a = mr - i - A["space/gap/lg"], o = Math.ceil(e.rows.length / 2), s = e.rows.slice(0, o), c = e.rows.slice(o), l = (e) => e ? [yr(e.label, "body-sm", "text/secondary"), yr(e.value, "body-sm-medium", "text/primary")] : [{}, {}];
	return {
		table: {
			widths: [
				M(i),
				M(a),
				M(A["space/gap/xl"]),
				M(i),
				"*"
			],
			headerRows: 1,
			keepWithHeaderRows: 1,
			dontBreakRows: !0,
			body: [[
				{
					...F(e.label, "body-compact-medium", "text/primary"),
					colSpan: 5,
					border: [
						!1,
						!1,
						!1,
						!0
					]
				},
				{},
				{},
				{},
				{}
			], ...s.map((e, t) => [
				...l(e),
				{},
				...l(c[t])
			])]
		},
		layout: {
			defaultBorder: !1,
			hLineWidth: () => M($n),
			vLineWidth: () => 0,
			hLineColor: (e) => P(e === 1 ? "border/strong" : er),
			paddingLeft: (e) => e === 1 || e === 4 ? M(A["space/gap/lg"]) : 0,
			paddingRight: () => 0,
			paddingTop: (e) => e === 0 ? 0 : r,
			paddingBottom: () => r
		},
		margin: [
			0,
			t === 0 ? M(A["space/padding/md"]) : 0,
			0,
			n ? 0 : M(A["space/gap/sm-md"])
		]
	};
}
function xr(e, { image: t = null, cota: n = null } = {}) {
	let r = N.top + lr(cr) + A["space/padding/xl"], i = N.top + lr(j.label.lineHeight) + A["space/padding/md"] - r, a = e.sections ?? [];
	return {
		pageSize: "A4",
		pageMargins: [
			M(N.side),
			M(r),
			M(N.side),
			M(ur + N.bottom)
		],
		info: {
			title: `${Yn.label} · ${e.name} · ${e.sku}`,
			author: Yn.brand
		},
		header: (t) => ({
			...dr(t === 1 ? null : e),
			margin: [
				M(N.side),
				M(N.top),
				M(N.side),
				0
			]
		}),
		footer: (e, t) => ({
			...fr(e, t),
			margin: [
				M(N.side),
				0,
				M(N.side),
				0
			]
		}),
		defaultStyle: { font: nr(j.body.fontWeight) },
		content: [{
			...vr(e, {
				image: t,
				cota: n
			}),
			margin: [
				0,
				M(i),
				0,
				0
			]
		}, ...a.map((e, t) => br(e, t, t === a.length - 1))]
	};
}
//#endregion
//#region src/pdf/ficha-tecnica.js
var Sr = 2.5, Cr = 4, wr = .9, Tr = null;
function Er() {
	return Tr ??= import(
		/* @vite-ignore */
		n.pdf.pdfmakeUrl
).then(({ default: e }) => {
		let t = {};
		for (let e of rr) {
			let r = n.pdf.fontUrl.replace("{weight}", e);
			t[nr(e)] = {
				normal: r,
				bold: r,
				italics: r,
				bolditalics: r
			};
		}
		return e.addFonts(t), e.setUrlAccessPolicy((e) => e.startsWith(n.pdf.fontUrl.split("{weight}")[0])), e;
	}), Tr.catch(() => Tr = null), Tr;
}
function Dr(e, t, r) {
	let { sampleFrom: i, pdfBase: a } = n.images;
	return e.startsWith(i) ? a.replaceAll("{size}", Math.round(t)).replace("{format}", r) + e.slice(i.length) : e;
}
function Or(e, t, n, { maxPx: r = Math.max(Number(t) || 0, n), fit: i = "contain", background: a, scale: o = Sr, type: s = "image/jpeg", request: c = "webp" } = {}) {
	return e ? (e = Dr(e, r * o, c), new Promise((r) => {
		let c = new Image();
		c.crossOrigin = "anonymous", c.decoding = "async", c.onload = () => {
			try {
				let e = typeof t == "function" ? t(c.naturalWidth / c.naturalHeight) : t, l = document.createElement("canvas");
				l.width = Math.round(e * o), l.height = Math.round(n * o);
				let u = l.getContext("2d");
				u.fillStyle = a, u.fillRect(0, 0, l.width, l.height);
				let d = [l.width / c.naturalWidth, l.height / c.naturalHeight], f = i === "cover" ? Math.max(...d) : Math.min(...d), p = c.naturalWidth * f, m = c.naturalHeight * f;
				u.drawImage(c, (l.width - p) / 2, (l.height - m) / 2, p, m), r({
					image: l.toDataURL(s, wr),
					width: e
				});
			} catch (t) {
				console.warn("[arq] ficha técnica: la imagen no se puede usar en el PDF (¿falta CORS en el servidor de imágenes?)", e, t), r(null);
			}
		}, c.onerror = () => {
			console.warn("[arq] ficha técnica: no se pudo cargar la imagen", e), r(null);
		}, c.src = e;
	})) : Promise.resolve(null);
}
var kr = (e) => String(e).replace(/[^\w-]+/g, "-").replace(/^-+|-+$/g, ""), Ar = (e) => `${kr(e)}.pdf`;
async function jr(e) {
	let t = await yn(e);
	if (!t) return null;
	let [n, r] = await Promise.all([Or(t.image, hr, hr, { background: A[`color/${tr}`] }), Or(t.cota, (e) => _r(e) - 2 * I, hr - 2 * I, {
		maxPx: _r(Infinity) - 2 * I,
		background: A["color/surface/default"],
		scale: Cr,
		type: "image/png",
		request: "png"
	})]);
	return {
		data: t,
		definition: xr(t, {
			image: n?.image ?? null,
			cota: r
		})
	};
}
var Mr = /* @__PURE__ */ new Map();
function Nr(e) {
	if (Mr.has(e)) return Mr.get(e);
	let t = window.open("", "_blank"), n = (async () => {
		try {
			let [n, r] = await Promise.all([Er(), jr(e)]);
			if (!r) throw Error(`el SKU «${e}» no está en el catálogo`);
			r.definition.info.title = kr(r.data.sku);
			let i = n.createPdf(r.definition);
			t && !t.closed ? await i.open(t) : await i.download(Ar(r.data.sku));
		} catch (e) {
			throw t?.close(), e;
		}
	})().finally(() => Mr.delete(e));
	return Mr.set(e, n), n;
}
//#endregion
//#region src/pdf/configuracion-doc.js
var Pr = Object.freeze({
	label: "Configuración Daö",
	specs: "Características",
	parts: "Piezas para este armado"
});
function Fr(e) {
	let t = A["space/gap/sm"];
	return Math.min(hr, (pr - t * (e - 1)) / Math.max(e, 1));
}
function Ir(e, t) {
	let n = Fr(e.pieces.length), r = pr - (e.pieces.length * n + (e.pieces.length - 1) * A["space/gap/sm"]) > 1 ? [{
		text: "",
		width: "*"
	}] : [];
	return {
		stack: [F(e.title, "heading-2", "text/primary"), {
			columns: [...e.pieces.map((e, r) => ({
				width: M(n),
				stack: [t[r] ? {
					image: t[r],
					width: M(n),
					height: M(n)
				} : { canvas: [{
					type: "rect",
					x: 0,
					y: 0,
					w: M(n),
					h: M(n),
					color: P(tr)
				}] }, F(e.qty ? `${e.qty} × ${e.label}` : e.label, "body-sm", "text/secondary", { above: A["space/gap/xs"] })]
			})), ...r],
			columnGap: M(A["space/gap/sm"]),
			margin: [
				0,
				M(A["space/gap/md"]),
				0,
				0
			]
		}],
		margin: [
			0,
			0,
			0,
			M(A["space/padding/md"])
		],
		unbreakable: !0
	};
}
function Lr(e) {
	let t = (e, t, n, r = {}) => ({
		...F(e, t, n),
		border: [
			!1,
			!1,
			!1,
			!0
		],
		...r
	});
	return {
		table: {
			widths: [
				"auto",
				"*",
				"auto"
			],
			headerRows: 1,
			keepWithHeaderRows: 1,
			dontBreakRows: !0,
			body: [[
				{
					...F(Pr.parts, "body-compact-medium", "text/primary"),
					colSpan: 3,
					border: [
						!1,
						!1,
						!1,
						!0
					]
				},
				{},
				{}
			], ...e.map((e) => [
				t(`${e.qty}×`, "body-sm", "text/secondary"),
				t(e.name, "body-sm-medium", "text/primary"),
				t(e.sku, "body-sm", "text/secondary", {
					alignment: "right",
					noWrap: !0
				})
			])]
		},
		layout: {
			defaultBorder: !1,
			hLineWidth: () => M(A["border/default"]),
			vLineWidth: () => 0,
			hLineColor: (e) => P(e === 1 ? "border/strong" : er),
			paddingLeft: (e) => e === 0 ? 0 : M(A["space/gap/lg"]),
			paddingRight: () => 0,
			paddingTop: (e) => e === 0 ? 0 : M(A["space/padding/sm"]),
			paddingBottom: () => M(A["space/padding/sm"])
		}
	};
}
function Rr(e, { images: t = [] } = {}) {
	let n = N.top + lr(j.label.lineHeight) + A["space/padding/xl"], r = e.specs.length ? [br({
		label: Pr.specs,
		rows: e.specs.map(([e, t]) => ({
			label: e,
			value: t
		}))
	}, 0, !1)] : [];
	return {
		pageSize: "A4",
		pageMargins: [
			M(N.side),
			M(n),
			M(N.side),
			M(ur + N.bottom)
		],
		info: {
			title: `${Pr.label} · ${e.title}`,
			author: Yn.brand
		},
		header: () => ({
			...dr(null, Pr.label),
			margin: [
				M(N.side),
				M(N.top),
				M(N.side),
				0
			]
		}),
		footer: (e, t) => ({
			...fr(e, t),
			margin: [
				M(N.side),
				0,
				M(N.side),
				0
			]
		}),
		defaultStyle: { font: nr(j.body.fontWeight) },
		content: [
			Ir(e, t),
			...r,
			{
				...Lr(e.parts),
				margin: [
					0,
					r.length ? 0 : M(A["space/padding/md"]),
					0,
					0
				]
			}
		]
	};
}
//#endregion
//#region src/pdf/configuracion.js
var zr = "configuracion-dao", Br = null;
function Vr(e) {
	if (Br) return Br;
	let t = window.open("", "_blank");
	return Br = (async () => {
		try {
			let n = Fr(e.pieces.length), [r, ...i] = await Promise.all([Er(), ...e.pieces.map((e) => Or(e.src, n, n, { background: A[`color/${tr}`] }))]), a = Rr(e, { images: i.map((e) => e?.image ?? null) });
			a.info.title = zr;
			let o = r.createPdf(a);
			t && !t.closed ? await o.open(t) : await o.download(`${zr}.pdf`);
		} catch (e) {
			throw t?.close(), e;
		}
	})().finally(() => Br = null), Br;
}
//#endregion
//#region src/styles/roles.css?inline
var Hr = ".role-display-lg{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-light);font-size:var(--arq-type-display-lg-size);line-height:var(--arq-type-display-lg-leading);letter-spacing:var(--arq-font-tracking-tighter)}.role-display{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-light);font-size:var(--arq-type-display-size);line-height:var(--arq-type-display-leading);letter-spacing:var(--arq-font-tracking-tighter)}.role-display-sm{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-light);font-size:var(--arq-type-display-sm-size);line-height:var(--arq-type-display-sm-leading);letter-spacing:var(--arq-font-tracking-tight)}.role-heading-1{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-light);font-size:var(--arq-type-heading-1-size);line-height:var(--arq-type-heading-1-leading);letter-spacing:var(--arq-font-tracking-tight)}.role-heading-2{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-light);font-size:var(--arq-type-heading-2-size);line-height:var(--arq-type-heading-2-leading);letter-spacing:var(--arq-font-tracking-normal)}.role-heading-3{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-regular);font-size:var(--arq-type-heading-3-size);line-height:var(--arq-type-heading-3-leading);letter-spacing:var(--arq-font-tracking-normal)}.role-heading-3-light{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-light);font-size:var(--arq-type-heading-3-size);line-height:var(--arq-type-heading-3-leading);letter-spacing:var(--arq-font-tracking-normal)}.role-body-xl{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-regular);font-size:var(--arq-type-body-xl-size);line-height:var(--arq-type-body-xl-leading);letter-spacing:var(--arq-font-tracking-normal)}.role-body-xl-light{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-light);font-size:var(--arq-type-body-xl-size);line-height:var(--arq-type-body-xl-leading);letter-spacing:var(--arq-font-tracking-normal)}.role-body-lg{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-light);font-size:var(--arq-type-body-lg-size);line-height:var(--arq-type-body-lg-leading);letter-spacing:var(--arq-font-tracking-normal)}.role-body-lg-regular{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-regular);font-size:var(--arq-type-body-lg-size);line-height:var(--arq-type-body-lg-leading);letter-spacing:var(--arq-font-tracking-normal)}.role-body-lg-medium{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-medium);font-size:var(--arq-type-body-lg-size);line-height:var(--arq-type-body-lg-leading);letter-spacing:var(--arq-font-tracking-normal)}.role-body{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-light);font-size:var(--arq-type-body-size);line-height:var(--arq-type-body-leading);letter-spacing:var(--arq-font-tracking-normal)}.role-body-regular{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-regular);font-size:var(--arq-type-body-size);line-height:var(--arq-type-body-leading);letter-spacing:var(--arq-font-tracking-normal)}.role-body-medium{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-medium);font-size:var(--arq-type-body-size);line-height:var(--arq-type-body-leading);letter-spacing:var(--arq-font-tracking-normal)}.role-body-strong{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-semibold);font-size:var(--arq-type-body-size);line-height:var(--arq-type-body-leading);letter-spacing:var(--arq-font-tracking-normal)}.role-body-compact{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-light);font-size:var(--arq-type-body-compact-size);line-height:var(--arq-type-body-compact-leading);letter-spacing:var(--arq-font-tracking-normal)}.role-body-compact-regular{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-regular);font-size:var(--arq-type-body-compact-size);line-height:var(--arq-type-body-compact-leading);letter-spacing:var(--arq-font-tracking-normal)}.role-body-compact-medium{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-medium);font-size:var(--arq-type-body-compact-size);line-height:var(--arq-type-body-compact-leading);letter-spacing:var(--arq-font-tracking-normal)}.role-body-compact-strong{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-semibold);font-size:var(--arq-type-body-compact-size);line-height:var(--arq-type-body-compact-leading);letter-spacing:var(--arq-font-tracking-normal)}.role-body-sm{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-regular);font-size:var(--arq-type-body-sm-size);line-height:var(--arq-type-body-sm-leading);letter-spacing:var(--arq-font-tracking-normal)}.role-body-sm-medium{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-medium);font-size:var(--arq-type-body-sm-size);line-height:var(--arq-type-body-sm-leading);letter-spacing:var(--arq-font-tracking-normal)}.role-label-lg{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-regular);font-size:var(--arq-type-label-lg-size);line-height:var(--arq-type-label-lg-leading);letter-spacing:var(--arq-font-tracking-widest);text-transform:uppercase}.role-label{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-regular);font-size:var(--arq-type-label-size);line-height:var(--arq-type-label-leading);letter-spacing:var(--arq-font-tracking-widest);text-transform:uppercase}.role-label-sm{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-medium);font-size:var(--arq-type-label-sm-size);line-height:var(--arq-type-label-sm-leading);letter-spacing:var(--arq-font-tracking-widest);text-transform:uppercase}.role-caption{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-regular);font-size:var(--arq-type-caption-size);line-height:var(--arq-type-caption-leading);letter-spacing:var(--arq-font-tracking-wide)}.role-caption-medium{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-medium);font-size:var(--arq-type-caption-size);line-height:var(--arq-type-caption-leading);letter-spacing:var(--arq-font-tracking-wide)}", Ur = "[data-arq-theme=dark]{--arq-color-surface-default:var(--arq-neutral-800);--arq-color-surface-faint:var(--arq-neutral-775);--arq-color-surface-hover:var(--arq-neutral-775);--arq-color-surface-soft:var(--arq-neutral-725);--arq-color-surface-subtle:var(--arq-neutral-750);--arq-color-surface-selected:var(--arq-neutral-725);--arq-color-surface-strong:var(--arq-neutral-700);--arq-color-surface-inverse:var(--arq-neutral-0);--arq-color-surface-inverse-hover:var(--arq-neutral-150);--arq-color-surface-inverse-pressed:var(--arq-neutral-200);--arq-color-surface-bone:var(--arq-neutral-750);--arq-color-surface-sand:var(--arq-neutral-750);--arq-color-text-primary:var(--arq-neutral-100);--arq-color-text-secondary:var(--arq-neutral-200);--arq-color-text-tertiary:var(--arq-neutral-500);--arq-color-text-inverse:var(--arq-neutral-800);--arq-color-text-accent:var(--arq-neutral-150);--arq-color-text-disabled:var(--arq-neutral-600);--arq-color-text-error:var(--arq-red-300);--arq-color-text-success:var(--arq-green-300);--arq-color-text-warning:var(--arq-amber-300);--arq-color-icon-primary:var(--arq-neutral-100);--arq-color-icon-secondary:var(--arq-neutral-200);--arq-color-icon-tertiary:var(--arq-neutral-500);--arq-color-icon-accent:var(--arq-neutral-150);--arq-color-icon-inverse:var(--arq-neutral-800);--arq-color-icon-disabled:var(--arq-neutral-600);--arq-color-border-subtle:var(--arq-alpha-white-10);--arq-color-border-default:var(--arq-alpha-white-22);--arq-color-border-strong:var(--arq-neutral-0);--arq-color-border-disabled:var(--arq-alpha-white-10);--arq-color-border-focus:var(--arq-neutral-150);--arq-color-border-error:var(--arq-red-300);--arq-color-action-primary:var(--arq-neutral-100);--arq-color-action-primary-hover:var(--arq-neutral-200);--arq-color-action-on-primary:var(--arq-neutral-900);--arq-color-accent-default:var(--arq-neutral-150)}", Wr = "[data-arq-theme=light]{--arq-color-surface-default:var(--arq-neutral-0);--arq-color-surface-faint:var(--arq-neutral-25);--arq-color-surface-hover:var(--arq-neutral-50);--arq-color-surface-soft:var(--arq-neutral-75);--arq-color-surface-subtle:var(--arq-neutral-100);--arq-color-surface-selected:var(--arq-neutral-150);--arq-color-surface-strong:var(--arq-neutral-200);--arq-color-surface-inverse:var(--arq-neutral-900);--arq-color-surface-inverse-hover:var(--arq-neutral-750);--arq-color-surface-inverse-pressed:var(--arq-neutral-600);--arq-color-surface-bone:var(--arq-offwhite-bone);--arq-color-surface-sand:var(--arq-offwhite-sand);--arq-color-text-primary:var(--arq-neutral-900);--arq-color-text-secondary:var(--arq-neutral-750);--arq-color-text-tertiary:var(--arq-neutral-600);--arq-color-text-inverse:var(--arq-neutral-0);--arq-color-text-accent:var(--arq-neutral-900);--arq-color-text-disabled:var(--arq-neutral-400);--arq-color-text-error:var(--arq-red-600);--arq-color-text-success:var(--arq-green-600);--arq-color-text-warning:var(--arq-amber-600);--arq-color-icon-primary:var(--arq-neutral-900);--arq-color-icon-secondary:var(--arq-neutral-750);--arq-color-icon-tertiary:var(--arq-neutral-600);--arq-color-icon-accent:var(--arq-neutral-900);--arq-color-icon-inverse:var(--arq-neutral-0);--arq-color-icon-disabled:var(--arq-neutral-400);--arq-color-border-subtle:var(--arq-alpha-ink-10);--arq-color-border-default:var(--arq-alpha-ink-22);--arq-color-border-strong:var(--arq-neutral-900);--arq-color-border-disabled:var(--arq-neutral-200);--arq-color-border-focus:var(--arq-neutral-900);--arq-color-border-error:var(--arq-red-600);--arq-color-action-primary:var(--arq-neutral-900);--arq-color-action-primary-hover:var(--arq-neutral-750);--arq-color-action-on-primary:var(--arq-neutral-0);--arq-color-accent-default:var(--arq-neutral-900)}", Gr, Kr, qr, Jr = /* @__PURE__ */ new Map();
function Yr(e) {
	let t = new CSSStyleSheet();
	return t.replaceSync(e), t;
}
function Xr() {
	return Gr ??= Yr(Hr), Gr;
}
function Zr() {
	return Kr ??= Yr(Ur), Kr;
}
function Qr() {
	return qr ??= Yr(Wr), qr;
}
function $r(e, ...t) {
	let n = [
		Xr(),
		Zr(),
		Qr()
	];
	for (let e of t) e && (Jr.has(e) || Jr.set(e, Yr(e)), n.push(Jr.get(e)));
	e.adoptedStyleSheets = [...n, ...e.adoptedStyleSheets.filter((e) => !n.includes(e))];
}
//#endregion
//#region src/base/arq-element.js
var ei = (e) => e.replace(/[A-Z]/g, (e) => `-${e.toLowerCase()}`), ti = /* @__PURE__ */ new WeakMap(), ni = "\n:host {\n  --page-gutter: max(var(--arq-layout-gutter), (100vw - var(--arq-layout-max-width)) / 2);\n}\n\n@media print {\n  :host {\n    --page-gutter: var(--arq-space-padding-2xl);\n  }\n}\n\n:host([hidden]),\n[hidden] {\n  display: none !important;\n}\n\n/* Táctil (mobile-native): sin el destello gris del navegador al tocar (cada\n   control tiene su propio Pressed o Hover), sin la espera del doble toque\n   (manipulation deja el desplazamiento y el zoom con dos dedos; touch-action\n   se suma con el de los ancestros, así que alcanza con el host) y sin\n   seleccionar el texto de un control al dejar el dedo apretado. El texto que\n   es contenido (mails, teléfonos, respuestas) se sigue pudiendo seleccionar. */\n:host {\n  -webkit-tap-highlight-color: var(--arq-color-surface-transparent);\n  touch-action: manipulation;\n  /* Sin el texto agrandado de iOS al girar a horizontal. Se hereda: alcanza\n     con el host, sin tocar html (AGENTS.md · Integración con Webflow). */\n  -webkit-text-size-adjust: 100%;\n  text-size-adjust: 100%;\n}\n\n/* Albert Sans en cada componente: lo que hereda la fuente (font: inherit de\n   los <button>, texto sin role/*) no toma la del body de Webflow. En la demo\n   no se nota porque su body ya usa Albert Sans. */\n:host {\n  font-family: var(--arq-font-family-sans);\n}\n\nbutton,\n[role='button'],\n:host([role='button']),\n:host([role='radio']),\n:host([role='checkbox']) {\n  -webkit-user-select: none;\n  user-select: none;\n  -webkit-touch-callout: none;\n}\n\n*,\n*::before,\n*::after {\n  transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke;\n  transition-duration: var(--arq-theme-text-duration, var(--arq-motion-duration-fast)), var(--arq-theme-surface-duration, var(--arq-motion-duration-fast)), var(--arq-theme-text-duration, var(--arq-motion-duration-fast)), var(--arq-motion-duration-fast), var(--arq-theme-text-duration, var(--arq-motion-duration-fast)), var(--arq-theme-text-duration, var(--arq-motion-duration-fast)), var(--arq-theme-text-duration, var(--arq-motion-duration-fast));\n  transition-delay: var(--arq-theme-text-delay, 0s), 0s, var(--arq-theme-text-delay, 0s), 0s, var(--arq-theme-text-delay, 0s), var(--arq-theme-text-delay, 0s), var(--arq-theme-text-delay, 0s);\n  transition-timing-function: var(--arq-theme-text-easing, var(--arq-motion-easing-standard)), var(--arq-theme-surface-easing, var(--arq-motion-easing-standard)), var(--arq-theme-text-easing, var(--arq-motion-easing-standard)), var(--arq-theme-text-easing, var(--arq-motion-easing-standard)), var(--arq-theme-text-easing, var(--arq-motion-easing-standard)), var(--arq-theme-text-easing, var(--arq-motion-easing-standard)), var(--arq-theme-text-easing, var(--arq-motion-easing-standard));\n}\n\n/* Íconos SVG: heredan el color del texto que los rodea. Sin transición propia,\n   porque se sumaría a la del padre y cambiarían mucho después (logo, flechas). */\nsvg,\nsvg * {\n  transition: none;\n}\n\n.visually-hidden {\n  position: absolute;\n  width: var(--arq-border-default);\n  height: var(--arq-border-default);\n  margin: calc(-1 * var(--arq-border-default));\n  overflow: hidden;\n  clip-path: inset(50%);\n  white-space: nowrap;\n}\n\n::slotted(h1),\n::slotted(h2),\n::slotted(h3),\n::slotted(h4),\n::slotted(h5),\n::slotted(h6) {\n  margin: 0 !important;\n  font: inherit !important;\n  letter-spacing: inherit !important;\n  text-transform: inherit !important;\n  color: inherit !important;\n}\n";
document.addEventListener("touchstart", () => {}, { passive: !0 });
var L = class e extends HTMLElement {
	static tag = "";
	static styles = "";
	static template = "";
	static properties = {};
	static get observedAttributes() {
		return Object.entries(this.properties).map(([e, t]) => t.attribute ?? ei(e));
	}
	static define() {
		if (!this.tag) throw Error(`${this.name}: falta static tag`);
		return customElements.get(this.tag) ? this : (e.#e.call(this), customElements.define(this.tag, this), this);
	}
	static #e() {
		this.attributeToProp = /* @__PURE__ */ new Map();
		for (let [e, t] of Object.entries(this.properties)) {
			let n = t.attribute ?? ei(e);
			this.attributeToProp.set(n, e), Object.defineProperty(this.prototype, e, {
				configurable: !0,
				enumerable: !0,
				get() {
					return this.#a(n, t);
				},
				set(e) {
					this.#o(n, t, e);
				}
			});
		}
	}
	#t = /* @__PURE__ */ new Set();
	#n = !1;
	#r = !1;
	#i = /* @__PURE__ */ new Set();
	constructor() {
		super();
		let e = this.attachShadow({ mode: "open" });
		$r(e, ni, this.constructor.styles);
		let t = this.#s();
		t && e.append(t.content.cloneNode(!0));
	}
	connectedCallback() {
		this.#r || (this.#c(), this.setup(), this.#r = !0, this.#u(new Set(Object.keys(this.constructor.properties))));
	}
	attributeChangedCallback(e, t, n) {
		if (t === n) return;
		let r = this.constructor.attributeToProp.get(e), i = this.constructor.properties[r];
		i.values && n !== null && !i.values.includes(n) && `${this.localName}${e}${n}${i.values.join(" · ")}${i.default}`, this.#t.add(r), this.#l();
	}
	setup() {}
	update(e) {}
	addController(e) {
		this.#i.add(e), this.#r && e.hostUpdate?.(new Set(Object.keys(this.constructor.properties)));
	}
	emit(e, t, { cancelable: n = !1 } = {}) {
		return this.dispatchEvent(new CustomEvent(`arq:${e}`, {
			bubbles: !0,
			composed: !0,
			cancelable: n,
			detail: t
		}));
	}
	#a(e, t) {
		let n = this.getAttribute(e);
		if (t.type === Boolean) return n !== null;
		if (n === null) return t.default ?? null;
		if (t.type === Number) {
			let e = Number(n);
			return Number.isFinite(e) ? e : t.default ?? null;
		}
		return t.values && !t.values.includes(n) ? t.default ?? null : n;
	}
	#o(e, t, n) {
		t.type === Boolean ? this.toggleAttribute(e, !!n) : n == null ? this.removeAttribute(e) : this.setAttribute(e, String(n));
	}
	#s() {
		let e = this.constructor;
		if (!e.template) return null;
		if (!ti.has(e)) {
			let t = document.createElement("template");
			t.innerHTML = e.template, ti.set(e, t);
		}
		return ti.get(e);
	}
	#c() {
		for (let e of Object.keys(this.constructor.properties)) if (Object.prototype.hasOwnProperty.call(this, e)) {
			let t = this[e];
			delete this[e], this[e] = t;
		}
	}
	#l() {
		!this.#r || this.#n || (this.#n = !0, queueMicrotask(() => {
			this.#n = !1;
			let e = this.#t;
			this.#t = /* @__PURE__ */ new Set(), this.#u(e);
		}));
	}
	#u(e) {
		this.#t.clear(), this.update(e);
		for (let t of this.#i) t.hostUpdate?.(e);
	}
}, ri = "<svg preserveAspectRatio=\"none\" overflow=\"visible\" style=\"display: block;\" width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<g id=\"icon/check\">\n<path id=\"Vector\" d=\"M6.5 12L2 7.5L2.707 6.793L6.5 10.5855L13.293 3.793L14 4.5L6.5 12Z\" fill=\"black\"/>\n</g>\n</svg>\n", ii = {
	"arrow-down": "<path vector-effect=\"non-scaling-stroke\" d=\"M8 2V13.3M12.65 8.65L8 13.3L3.35 8.65\"/>",
	"arrow-left": "<path vector-effect=\"non-scaling-stroke\" d=\"M14 8H2.7M7.35 12.65L2.7 8L7.35 3.35\"/>",
	"arrow-right": "<path vector-effect=\"non-scaling-stroke\" d=\"M2 8H13.3M8.65 12.65L13.3 8L8.65 3.35\"/>",
	"arrow-up": "<path vector-effect=\"non-scaling-stroke\" d=\"M8 14V2.7M12.65 7.35L8 2.7L3.35 7.35\"/>",
	"arrow-up-right": "<path vector-effect=\"non-scaling-stroke\" d=\"M3.35 12.65L12.5 3.5M12.5 11V3.5H5\"/>",
	"chevron-down": "<path vector-effect=\"non-scaling-stroke\" d=\"M3.35 5.65L8 10.3L12.65 5.65\"/>",
	"chevron-left": "<path vector-effect=\"non-scaling-stroke\" d=\"M10.35 3.35L5.7 8L10.35 12.65\"/>",
	"chevron-right": "<path vector-effect=\"non-scaling-stroke\" d=\"M5.65 3.35L10.3 8L5.65 12.65\"/>",
	"chevron-up": "<path vector-effect=\"non-scaling-stroke\" d=\"M3.35 10.35L8 5.7L12.65 10.35\"/>",
	close: "<path vector-effect=\"non-scaling-stroke\" d=\"M2.5 2.5L13.5 13.5M13.5 2.5L2.5 13.5\" stroke-linejoin=\"round\"/>",
	copy: "<path vector-effect=\"non-scaling-stroke\" shape-rendering=\"crispEdges\" d=\"M11 5V2H2V11H5M5 5H14V14H5V5Z\"/>",
	download: "<path vector-effect=\"non-scaling-stroke\" d=\"M8 1.79545V10.0682M4.4 7.70455L8 11.25L11.6 7.70455M2 14.2045H14\"/>",
	alert: "<path vector-effect=\"non-scaling-stroke\" stroke-linejoin=\"round\" d=\"M8 1.75L14.75 13.75H1.25L8 1.75Z\"/><path vector-effect=\"non-scaling-stroke\" stroke-linecap=\"round\" d=\"M8 6.25V9.75M8 11.75V11.8\"/>",
	eye: "<path vector-effect=\"non-scaling-stroke\" stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M1 8C2.6 4.7 5.1 3.25 8 3.25C10.9 3.25 13.4 4.7 15 8C13.4 11.3 10.9 12.75 8 12.75C5.1 12.75 2.6 11.3 1 8Z\"/><path vector-effect=\"non-scaling-stroke\" d=\"M8 10.2C9.22 10.2 10.2 9.22 10.2 8C10.2 6.78 9.22 5.8 8 5.8C6.78 5.8 5.8 6.78 5.8 8C5.8 9.22 6.78 10.2 8 10.2Z\"/>",
	filter: "<path vector-effect=\"non-scaling-stroke\" d=\"M2.5 4.5H13.5M4.5 8H11.5M7 11.5H9\"/>",
	"filter-off": "<path vector-effect=\"non-scaling-stroke\" d=\"M2 4H14M4 8H12M6 12H10M3 2L13 14\"/>",
	instagram: "<path vector-effect=\"non-scaling-stroke\" d=\"M11.667 4.33304H11.6736M4.6664 1.3328H11.3336C13.1747 1.3328 14.6672 2.8253 14.6672 4.6664V11.3336C14.6672 13.1747 13.1747 14.6672 11.3336 14.6672H4.6664C2.8253 14.6672 1.3328 13.1747 1.3328 11.3336V4.6664C1.3328 2.8253 2.8253 1.3328 4.6664 1.3328ZM10.6667 7.58017C10.749 8.13504 10.6542 8.70173 10.3958 9.19964C10.1375 9.69755 9.72871 10.1013 9.22765 10.3535C8.7266 10.6057 8.15878 10.6935 7.60496 10.6044C7.05115 10.5152 6.53953 10.2538 6.14288 9.85712C5.74624 9.46048 5.48476 8.94886 5.39564 8.39504C5.30652 7.84122 5.39431 7.27341 5.6465 6.77235C5.8987 6.2713 6.30246 5.86252 6.80037 5.60417C7.29827 5.34582 7.86496 5.25104 8.41984 5.33332C8.98583 5.41725 9.50983 5.68099 9.91442 6.08559C10.319 6.49018 10.5828 7.01417 10.6667 7.58017Z\" stroke-linecap=\"round\"/>",
	menu: "<path vector-effect=\"non-scaling-stroke\" d=\"M0 14H15.75M0 8H15.75M0 2H15.75\" stroke-linejoin=\"round\"/>",
	minus: "<path vector-effect=\"non-scaling-stroke\" d=\"M3 8H13\"/>",
	plus: "<path vector-effect=\"non-scaling-stroke\" d=\"M8 3V13M3 8H13\"/>",
	search: "<path vector-effect=\"non-scaling-stroke\" d=\"M13.6667 13.6667L10.676 10.6707M12.3333 6.66667C12.3333 8.16956 11.7363 9.6109 10.6736 10.6736C9.6109 11.7363 8.16956 12.3333 6.66667 12.3333C5.16377 12.3333 3.72243 11.7363 2.65973 10.6736C1.59702 9.6109 1 8.16956 1 6.66667C1 5.16377 1.59702 3.72243 2.65973 2.65973C3.72243 1.59702 5.16377 1 6.66667 1C8.16956 1 9.6109 1.59702 10.6736 2.65973C11.7363 3.72243 12.3333 5.16377 12.3333 6.66667Z\"/>",
	youtube: "<path vector-effect=\"non-scaling-stroke\" d=\"M1.66688 4.66703C1.20117 6.86458 1.20117 9.13533 1.66688 11.3329C1.72807 11.556 1.8463 11.7594 2.00994 11.9231C2.17358 12.0867 2.37699 12.2049 2.60018 12.2661C6.17568 12.8585 9.82432 12.8585 13.3998 12.2661C13.623 12.2049 13.8264 12.0867 13.9901 11.9231C14.1537 11.7594 14.2719 11.556 14.3331 11.3329C14.7988 9.13533 14.7988 6.86458 14.3331 4.66703C14.2719 4.44387 14.1537 4.24047 13.9901 4.07684C13.8264 3.91322 13.623 3.795 13.3998 3.73382C9.82431 3.14153 6.17569 3.14153 2.60018 3.73382C2.37699 3.795 2.17358 3.91322 2.00994 4.07684C1.8463 4.24047 1.72807 4.44387 1.66688 4.66703Z\" stroke-linecap=\"round\"/><path vector-effect=\"non-scaling-stroke\" d=\"M10 8L6.5 5.75V10.25L10 8Z\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>"
};
Object.freeze([...Object.keys(ii), "check"]);
function R(e) {
	if (e === "check") return ri.replace("<svg ", "<svg class=\"icon\" data-icon=\"check\" aria-hidden=\"true\" focusable=\"false\" ").replace("fill=\"black\"", "fill=\"currentColor\"");
	let t = ii[e];
	return t ? `<svg class="icon" data-icon="${e}" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1" aria-hidden="true" focusable="false">${t}</svg>` : "";
}
//#endregion
//#region src/components/count-badge/count-badge.css?inline
var ai = ":host{vertical-align:middle;flex:none;display:inline-flex;position:relative}:host(:state(empty)){display:none}.badge{box-sizing:border-box;min-width:calc(var(--arq-type-caption-leading) + var(--arq-space-padding-2xs) * 2);padding:var(--arq-space-padding-2xs) var(--arq-space-padding-xs);border-radius:var(--arq-radius-control);background:var(--arq-color-action-primary);color:var(--arq-color-action-on-primary);text-align:center;white-space:nowrap;font-variant-numeric:tabular-nums;justify-content:center;align-items:center;display:inline-flex}.visually-hidden{width:var(--arq-border-default);height:var(--arq-border-default);clip-path:inset(50%);white-space:nowrap;position:absolute;overflow:hidden}:host([tone=inverse]) .badge{background:var(--arq-color-action-on-primary);color:var(--arq-color-action-primary)}", oi = 99;
(class extends L {
	static tag = "arq-count-badge";
	static styles = ai;
	static properties = {
		count: { type: Number },
		tone: {
			type: String,
			values: ["primary", "inverse"],
			default: "primary"
		}
	};
	static template = "<span class=\"badge role-caption-medium\" aria-hidden=\"true\"></span><span class=\"visually-hidden\"></span>";
	#e = this.attachInternals();
	update() {
		let e = !this.count, t = e ? "" : String(this.count);
		this.shadowRoot.querySelector(".badge").textContent = this.count > oi ? `${oi}+` : t, this.shadowRoot.querySelector(".visually-hidden").textContent = t, e ? this.#e.states.add("empty") : this.#e.states.delete("empty");
	}
}).define();
//#endregion
//#region src/components/button/button.css?inline
var si = ":host{vertical-align:middle;min-width:0;max-width:100%;transition:scale var(--arq-motion-duration-fast) var(--arq-motion-easing-out);display:inline-flex}@media (prefers-reduced-motion:no-preference){:host(:not([type=underline]):not([disabled]):not([loading]):active){scale:var(--arq-motion-scale-pressed)}}.control{box-sizing:border-box;justify-content:center;align-items:center;gap:var(--arq-space-gap-sm);max-width:100%;padding:var(--arq-space-gap-sm) var(--arq-space-padding-md);border-radius:var(--arq-radius-control);background:var(--arq-color-action-primary);color:var(--arq-color-action-on-primary);cursor:pointer;-webkit-tap-highlight-color:var(--arq-color-surface-transparent);border:0;flex:auto;margin:0;text-decoration:none;display:inline-flex;position:relative}.text{min-width:0;display:flex;position:relative}.label{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.leading,.trailing{flex:none;display:inline-flex}.icon{width:var(--arq-icon-md);height:var(--arq-icon-md)}.control:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.control:focus:not(:focus-visible){outline:none}.control.inactive{cursor:default}@media (hover:hover) and (pointer:fine){.control:not(.inactive):hover{background:var(--arq-color-action-primary-hover)}}.control:not(.inactive):active{background:var(--arq-color-surface-inverse-pressed)}.control.inactive{background:var(--arq-color-surface-subtle);color:var(--arq-color-text-disabled)}.control[aria-busy=true]{background:var(--arq-color-action-primary-hover);color:var(--arq-color-action-on-primary)}.visually-hidden{width:var(--arq-border-default);height:var(--arq-border-default);clip-path:inset(50%);white-space:nowrap;position:absolute;overflow:hidden}:host([type=outline]) .control{padding:calc(var(--arq-space-gap-sm) - var(--arq-border-default)) calc(var(--arq-space-padding-md) - var(--arq-border-default));border:var(--arq-border-default) solid var(--arq-color-border-strong);background:var(--arq-color-surface-transparent);color:var(--arq-color-action-primary)}@media (hover:hover) and (pointer:fine){:host([type=outline]) .control:not(.inactive):hover{background:var(--arq-color-surface-hover)}}:host([type=outline]) .control:not(.inactive):active{background:var(--arq-color-surface-selected)}:host([type=outline]) .control.inactive{border-color:var(--arq-color-border-disabled);background:var(--arq-color-surface-transparent);color:var(--arq-color-text-disabled)}:host([type=outline]) .control[aria-busy=true]{border-color:var(--arq-color-border-strong);background:var(--arq-color-surface-hover);color:var(--arq-color-action-primary)}:host([compact]) .control{font-size:var(--arq-type-body-sm-size);line-height:var(--arq-type-body-sm-leading)}:host([compact]) .icon{width:var(--arq-icon-sm);height:var(--arq-icon-sm)}:host([compact][type=underline]) .text:before,:host([compact][type=underline]) .text:after{height:var(--arq-border-default);top:100%}:host([type=underline]) .control{padding:var(--arq-space-gap-xs) 0;background:var(--arq-color-surface-transparent);color:var(--arq-color-action-primary)}:host([type=underline]) .text:before,:host([type=underline]) .text:after{content:\"\";inset-inline:0;top:calc(100% + var(--arq-space-padding-2xs) - var(--arq-border-default));height:var(--arq-border-default);background:var(--arq-color-border-strong);position:absolute}:host([type=underline]:not([show-underline])) .text:before{display:none}:host([type=underline]) .text:after{height:var(--arq-border-strong);transform-origin:100%;transition:transform var(--arq-motion-duration-base) var(--arq-motion-easing-standard);transform:scaleX(0)}@media (hover:hover) and (pointer:fine){:host([type=underline]) .control:not(.inactive):hover .text:after{transform-origin:0;transform:scaleX(1)}}:host([type=underline]) .control:not(.inactive):active .text:after{transform-origin:0;transform:scaleX(1)}:host([type=underline]) .control:not(.inactive):active{color:var(--arq-color-text-tertiary)}:host([type=underline]) .control:not(.inactive):active .text:before,:host([type=underline]) .control:not(.inactive):active .text:after{background:var(--arq-color-text-tertiary)}:host([type=underline]) .control.inactive{background:var(--arq-color-surface-transparent);color:var(--arq-color-text-disabled)}:host([type=underline]) .control.inactive .text:before{background:var(--arq-color-border-disabled)}", ci = "Enviando…", li = ["filled", "outline"];
(class extends L {
	static tag = "arq-button";
	static styles = si;
	static formAssociated = !0;
	static properties = {
		type: {
			type: String,
			values: [
				"filled",
				"outline",
				"underline"
			],
			default: "filled"
		},
		showIcon: { type: Boolean },
		icon: {
			type: String,
			default: "arrow-up-right"
		},
		showUnderline: { type: Boolean },
		showCount: { type: Boolean },
		count: { type: Number },
		countLabel: { type: String },
		showLeadingIcon: { type: Boolean },
		leadingIcon: {
			type: String,
			default: "chevron-left"
		},
		disabled: { type: Boolean },
		loading: { type: Boolean },
		loadingLabel: { type: String },
		href: { type: String },
		target: { type: String },
		submit: { type: Boolean },
		compact: { type: Boolean }
	};
	static template = "\n    <button type=\"button\" class=\"control role-body-regular\">\n      <span class=\"leading\" hidden></span>\n      <span class=\"text\">\n        <span class=\"label\"><slot></slot><span class=\"visually-hidden\" hidden></span></span>\n        <span class=\"label\" data-loading hidden></span>\n      </span>\n      <arq-count-badge class=\"count\" hidden></arq-count-badge>\n      <span class=\"trailing\" hidden></span>\n    </button>\n  ".replace(/>\s+</g, "><").trim();
	#e = null;
	#t = this.attachInternals();
	setup() {
		this.#e = this.shadowRoot.querySelector(".control"), this.addEventListener("click", () => {
			this.submit && !this.href && !this.disabled && !this.loading && this.#t.form?.requestSubmit();
		}), this.addEventListener("click", (e) => {
			(this.disabled || this.loading) && (e.preventDefault(), e.stopImmediatePropagation());
		}, { capture: !0 });
	}
	focus(e) {
		this.#e ? this.#e.focus(e) : super.focus(e);
	}
	update(e) {
		e.has("href") && this.#n(), e.has("loading") && this.loading && li.includes(this.type);
		let t = this.shadowRoot, n = this.#e, r = this.loading, i = this.loadingLabel?.trim() || ci, a = this.disabled || r;
		t.querySelector(".label[data-loading]").textContent = i, n.classList.toggle("inactive", a), r ? (n.setAttribute("aria-busy", "true"), n.setAttribute("aria-label", i)) : (n.removeAttribute("aria-busy"), n.removeAttribute("aria-label")), n.localName === "button" ? n.disabled = a : (a ? (n.removeAttribute("href"), n.setAttribute("aria-disabled", "true")) : (n.setAttribute("href", this.href), n.removeAttribute("aria-disabled")), this.target ? n.setAttribute("target", this.target) : n.removeAttribute("target"), this.target === "_blank" ? n.setAttribute("rel", "noopener") : n.removeAttribute("rel")), t.querySelector(".label:not([data-loading])").hidden = r, t.querySelector(".label[data-loading]").hidden = !r;
		let o = t.querySelector(".leading");
		e.has("leadingIcon") && (o.innerHTML = R(this.leadingIcon)), o.hidden = !this.showLeadingIcon || r;
		let s = t.querySelector(".trailing");
		e.has("icon") && (s.innerHTML = R(this.icon)), s.hidden = !this.showIcon || r;
		let c = t.querySelector(".count"), l = this.showCount && !!this.count && !r;
		this.count ? c.setAttribute("count", this.count) : c.removeAttribute("count"), c.setAttribute("tone", this.type === "filled" ? "inverse" : "primary"), c.hidden = !l;
		let u = t.querySelector(".visually-hidden"), d = this.countLabel?.trim();
		u.textContent = d ? `, ${this.count} ${d}` : "", u.hidden = !l || !d, l && d ? c.setAttribute("aria-hidden", "true") : c.removeAttribute("aria-hidden");
	}
	#n() {
		let e = this.href === null ? "button" : "a", t = this.#e;
		if (t.localName === e) return;
		let n = document.createElement(e);
		n.className = t.className, e === "button" && (n.type = "button"), n.append(...t.childNodes), t.replaceWith(n), this.#e = n;
	}
}).define();
//#endregion
//#region src/components/divider/divider.css?inline
var ui = ":host{box-sizing:border-box;width:100%;height:var(--arq-border-default);background:var(--arq-color-border-subtle);flex:none;display:block}:host([emphasis=default]){background:var(--arq-color-border-default)}:host([orientation=vertical]){width:var(--arq-border-default);align-self:stretch;height:auto;display:inline-block}";
(class extends L {
	static tag = "arq-divider";
	static styles = ui;
	static properties = {
		orientation: {
			type: String,
			values: ["horizontal", "vertical"],
			default: "horizontal"
		},
		emphasis: {
			type: String,
			values: ["subtle", "default"],
			default: "subtle"
		}
	};
	#e = this.attachInternals();
	update() {
		let e = this.orientation === "vertical";
		this.#e.role = e ? null : "separator", this.#e.ariaHidden = e ? "true" : null;
	}
}).define();
//#endregion
//#region src/components/logo/logo.css?inline
var di = ":host{vertical-align:middle;color:var(--arq-color-text-primary);flex:none;display:inline-flex}.link{color:inherit;transition:none;display:inline-flex}.link:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.link:focus:not(:focus-visible){outline:none}.mark{aspect-ratio:181/16;width:181px;height:auto;display:block}:host([size=small]) .mark{width:158px}:host([size=compact]) .mark{width:117px}", fi = "Macroled Arq, inicio", pi = "<svg class=\"mark\" viewBox=\"0 0 181 16\" fill=\"currentColor\" aria-hidden=\"true\" focusable=\"false\">" + Kn.map((e) => `<path d="${e}"/>`).join("") + "</svg>";
(class extends L {
	static tag = "arq-logo";
	static styles = di;
	static properties = {
		size: {
			type: String,
			values: [
				"default",
				"small",
				"compact"
			],
			default: "default"
		},
		href: {
			type: String,
			default: "/arq/inicio"
		}
	};
	static template = `<a class="link" aria-label="${fi}">${pi}</a>`;
	update(e) {
		e.has("href") && this.shadowRoot.querySelector(".link").setAttribute("href", this.href);
	}
}).define();
//#endregion
//#region src/base/page-ready.js
var mi = /* @__PURE__ */ new WeakSet(), hi = !document.fonts;
document.fonts?.ready.then(() => {
	hi = !0;
}, () => {
	hi = !0;
});
function gi(e, t) {
	if (e.nodeType === Node.ELEMENT_NODE && e.localName !== "arq-preloader") {
		if ((e.localName === "img" || e.localName === "video") && t.push(e), e.shadowRoot) for (let n of e.shadowRoot.children) gi(n, t);
		for (let n of e.children) gi(n, t);
	}
}
function _i(e) {
	return e.localName === "img" ? !e.getAttribute("src") && !e.currentSrc ? !1 : (mi.has(e) || (mi.add(e), e.getAttribute("loading") === "lazy" && (e.loading = "eager")), !e.complete) : !(e.getAttribute("src") || e.querySelector("source[src]")?.getAttribute("src")) && !e.currentSrc || e.error ? !1 : (mi.has(e) || (mi.add(e), e.preload !== "auto" && (e.preload = "auto"), e.readyState < HTMLMediaElement.HAVE_CURRENT_DATA && e.load()), e.readyState < HTMLMediaElement.HAVE_CURRENT_DATA);
}
function vi(e = document.body) {
	let t = [];
	for (let n of e.children) gi(n, t);
	let n = t.filter(_i).length, r = [...e.querySelectorAll("[aria-busy=\"true\"]")].filter((e) => e.localName !== "arq-preloader").length, i = +!hi, a = t.length + 1;
	return {
		done: t.length - n + +!!hi,
		total: a,
		waiting: n > 0 || r > 0 || i > 0
	};
}
//#endregion
//#region src/components/preloader/preloader.css?inline
var yi = ":host{z-index:5;background:var(--arq-color-surface-default);color:var(--arq-color-text-primary);visibility:hidden;opacity:0;pointer-events:none;transition-property:opacity,visibility;transition-duration:var(--arq-motion-duration-fade), 0s;transition-timing-function:var(--arq-motion-easing-standard), linear;transition-delay:0s, var(--arq-motion-duration-fade);place-items:center;margin:0;display:grid;position:fixed;inset:0}:host([open]){visibility:visible;opacity:1;pointer-events:auto;transition-delay:0s,0s}.cluster{align-items:stretch;gap:var(--arq-space-gap-lg);flex-direction:column;width:max-content;display:flex}.mark{aspect-ratio:181/16;width:181px;height:auto;display:block}.track{height:var(--arq-border-default);overflow:hidden}.line{height:100%;transform:scaleX(var(--progress,0));transform-origin:0;transition-property:transform;transition-duration:var(--arq-motion-duration-base);transition-timing-function:var(--arq-motion-easing-out);background:currentColor;display:block}:host([open]:not([page])) .line.run{animation:arq-preloader-line var(--arq-motion-duration-shimmer) var(--arq-motion-easing-out) forwards;transition:none}@keyframes arq-preloader-line{to{transform:scaleX(1)}}@media (prefers-reduced-motion:reduce){:host([open]) .line.run{animation:none;transform:scaleX(1)}}@media print{:host{display:none!important}}", bi = window.matchMedia("(prefers-reduced-motion: reduce)"), xi = 2e4, Si = 2, Ci = "<svg class=\"mark\" viewBox=\"0 0 181 16\" fill=\"currentColor\" aria-hidden=\"true\" focusable=\"false\">" + Kn.map((e) => `<path d="${e}"/>`).join("") + "</svg>";
(class extends L {
	static tag = "arq-preloader";
	static styles = yi;
	static properties = {
		open: { type: Boolean },
		page: { type: Boolean }
	};
	static template = "<div class=\"cluster\">" + Ci + "<span class=\"track\" aria-hidden=\"true\"><span class=\"line\"></span></span><p class=\"status visually-hidden\" role=\"status\"></p></div>";
	#e = 0;
	#t = 0;
	#n = !1;
	#r = 0;
	#i = /* @__PURE__ */ new Set();
	#a = (e) => e.preventDefault();
	setup() {
		this.setAttribute("data-arq-theme", "light"), this.setAttribute("aria-hidden", "true");
	}
	disconnectedCallback() {
		window.clearTimeout(this.#t), this.#o(!1), this.#e += 1;
	}
	update(e) {
		if (!e.has("open") && !e.has("page")) return;
		let t = this.shadowRoot.querySelector(".status");
		if (this.open && this.page) {
			this.#s(), this.#o(!0), this.#l();
			return;
		}
		e.has("open") && (this.open ? (this.#s(), this.#u()) : (this.setAttribute("aria-hidden", "true"), t.textContent = "", this.#o(!1), this.#f()));
	}
	#o(e) {
		if (window.removeEventListener("wheel", this.#a), window.removeEventListener("touchmove", this.#a), !e) {
			for (let e of this.#i) e.removeAttribute("inert");
			this.#i.clear();
			return;
		}
		window.addEventListener("wheel", this.#a, { passive: !1 }), window.addEventListener("touchmove", this.#a, { passive: !1 });
		for (let e = this; e && e !== document.body && e.parentElement; e = e.parentElement) for (let t of e.parentElement.children) t === e || this.#i.has(t) || t.hasAttribute("inert") || t.localName !== "script" && t.localName !== "style" && (t.setAttribute("inert", ""), this.#i.add(t));
	}
	#s() {
		let e = this.shadowRoot.querySelector(".status");
		this.removeAttribute("aria-hidden"), e.textContent = "", requestAnimationFrame(() => {
			this.open && (e.textContent = "Cargando");
		});
	}
	#c(e) {
		let t = Math.min(1, Math.max(this.#r, e));
		this.#r = t, this.shadowRoot.querySelector(".line").style.setProperty("--progress", String(t));
	}
	#l() {
		if (this.#n) return;
		this.#n = !0;
		let e = ++this.#e, t = performance.now(), n = 0, r = () => {
			if (e !== this.#e || !this.open) return;
			this.#o(!0);
			let { done: i, total: a, waiting: o } = vi(), s = a ? i / a : 1;
			this.#c(o ? Math.min(s, .92) : s);
			let c = performance.now() - t > xi;
			if (!o || c ? n += 1 : n = 0, n < Si) {
				requestAnimationFrame(r);
				return;
			}
			let l = this.#r >= 1;
			this.#c(1);
			let u = this.shadowRoot.querySelector(".line"), d = () => {
				e === this.#e && this.open && (this.#e += 1, this.open = !1);
			};
			if (bi.matches || l) {
				requestAnimationFrame(d);
				return;
			}
			u.addEventListener("transitionend", (e) => {
				e.propertyName === "transform" && d();
			}, { once: !0 });
			let f = Number.parseFloat(getComputedStyle(u).transitionDuration) * 1e3 || 0;
			this.#t = window.setTimeout(d, f + 40);
		};
		requestAnimationFrame(r);
	}
	#u() {
		let e = this.shadowRoot.querySelector(".line"), t = ++this.#e;
		if (window.clearTimeout(this.#t), e.classList.remove("run"), e.offsetWidth, this.open && t === this.#e) {
			if (e.classList.add("run"), bi.matches) {
				this.#d(t);
				return;
			}
			e.addEventListener("animationend", (e) => {
				e.animationName === "arq-preloader-line" && this.#d(t);
			}, { once: !0 });
		}
	}
	#d(e) {
		let t = Number.parseFloat(getComputedStyle(this).getPropertyValue("--arq-motion-duration-panel")) || 0;
		this.#t = window.setTimeout(() => {
			e === this.#e && this.open && this.emit("done", {});
		}, t);
	}
	#f() {
		window.clearTimeout(this.#t), this.#e += 1, this.shadowRoot.querySelector(".line").classList.remove("run");
	}
}).define();
//#endregion
//#region src/components/icon-button/icon-button.css?inline
var wi = ":host{vertical-align:middle;color:var(--arq-color-icon-primary);transition:scale var(--arq-motion-duration-fast) var(--arq-motion-easing-out);flex:none;display:inline-flex}@media (prefers-reduced-motion:no-preference){:host(:not([disabled]):active){scale:var(--arq-motion-scale-pressed)}}.control{box-sizing:border-box;padding:var(--arq-space-padding-xs);border-radius:var(--arq-radius-control);background:var(--arq-color-surface-transparent);color:inherit;transition-property:background-color,border-color,outline-color;transition-duration:var(--arq-motion-duration-fast);cursor:pointer;-webkit-tap-highlight-color:var(--arq-color-surface-transparent);border:0;justify-content:center;align-items:center;margin:0;transition-delay:0s;display:inline-flex;position:relative}.glyph{display:inline-flex}.icon{width:var(--arq-icon-md);height:var(--arq-icon-md)}:host([size=large]) .control{padding:var(--arq-space-padding-sm-md)}:host([size=large]) .icon{width:var(--arq-icon-xl);height:var(--arq-icon-xl)}.control:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.control:focus:not(:focus-visible){outline:none}.visually-hidden{width:var(--arq-border-default);height:var(--arq-border-default);clip-path:inset(50%);white-space:nowrap;position:absolute;overflow:hidden}@media (hover:hover) and (pointer:fine){.control:enabled:hover{background:var(--arq-color-surface-hover)}}.control:enabled:active{background:var(--arq-color-surface-selected)}:host([background=surface]) .control{background:var(--arq-color-surface-default)}@media (hover:hover) and (pointer:fine){:host([background=surface]) .control:enabled:hover{background:var(--arq-color-surface-subtle)}}:host([background=surface]) .control:enabled:active{background:var(--arq-color-surface-selected)}:host([background=subtle]) .control{background:var(--arq-color-surface-subtle)}@media (hover:hover) and (pointer:fine){:host([background=subtle]) .control:enabled:hover{background:var(--arq-color-surface-selected)}}:host([background=subtle]) .control:enabled:active{background:var(--arq-color-surface-strong)}.control:disabled{color:var(--arq-color-icon-disabled);cursor:default}:host([background=outline]) .control{padding:calc(var(--arq-space-padding-xs) - var(--arq-border-default));border:var(--arq-border-default) solid var(--arq-icon-button-border,var(--arq-color-border-strong))}:host([background=outline][size=large]) .control{padding:calc(var(--arq-space-padding-sm-md) - var(--arq-border-default));border-color:var(--arq-color-border-default)}:host([background=outline][size=large]) .icon :is(path,line,circle,rect){vector-effect:none}:host([background=outline]) .control:disabled{border-color:var(--arq-color-border-disabled)}";
(class extends L {
	static tag = "arq-icon-button";
	static styles = wi;
	static properties = {
		icon: {
			type: String,
			default: "search"
		},
		size: {
			type: String,
			values: ["default", "large"],
			default: "default"
		},
		background: {
			type: String,
			values: [
				"none",
				"surface",
				"subtle",
				"outline"
			],
			default: "none"
		},
		disabled: { type: Boolean }
	};
	static template = "<button type=\"button\" class=\"control\"><span class=\"glyph\"></span><span class=\"visually-hidden\"><slot></slot></span></button>";
	#e = null;
	setup() {
		this.#e = this.shadowRoot.querySelector(".control"), this.addEventListener("click", (e) => {
			this.disabled && (e.preventDefault(), e.stopImmediatePropagation());
		}, { capture: !0 }), this.shadowRoot.querySelector("slot").addEventListener("slotchange", () => this.#t()), setTimeout(() => this.#t());
	}
	focus(e) {
		this.#e ? this.#e.focus(e) : super.focus(e);
	}
	update(e) {
		e.has("icon") && (this.shadowRoot.querySelector(".glyph").innerHTML = R(this.icon)), this.#e.disabled = this.disabled;
	}
	#t() {
		this.textContent.trim() || console.warn(`[arq] <arq-icon-button icon="${this.icon}"> no tiene nombre accesible: escribí qué hace entre las etiquetas (p. ej. <arq-icon-button icon="search">Buscar</arq-icon-button>).`);
	}
}).define();
//#endregion
//#region src/components/breadcrumb-item/breadcrumb-item.css?inline
var Ti = ":host{min-width:0;display:inline-flex}.item{align-items:center;gap:var(--arq-space-gap-sm);min-width:0;color:var(--arq-color-text-tertiary);display:inline-flex}.label{color:var(--arq-color-text-tertiary);text-overflow:ellipsis;white-space:nowrap;text-decoration:none;overflow:hidden}.label[aria-current=page]{white-space:normal;overflow-wrap:break-word;overflow:visible}.separator{color:var(--arq-color-text-tertiary);flex:none}:host([theme=transparent]) .item,:host([theme=transparent]) .label,:host([theme=transparent]) .separator{color:var(--arq-color-text-secondary)}:host([current]) .item,:host([current]) .label{color:var(--arq-color-text-primary)}@media (hover:hover) and (pointer:fine){a.label:hover{color:var(--arq-color-text-primary)}}a.label:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}a.label:focus:not(:focus-visible){outline:none}";
(class extends L {
	static tag = "arq-breadcrumb-item";
	static styles = Ti;
	static properties = {
		href: { type: String },
		showSeparator: { type: Boolean },
		current: { type: Boolean },
		theme: {
			type: String,
			values: ["default", "transparent"],
			default: "default"
		}
	};
	static template = "<span class=\"item role-label\"><span class=\"label\"><slot></slot></span><span class=\"separator\" aria-hidden=\"true\" hidden>/</span></span>";
	setup() {
		this.hasAttribute("role") || this.setAttribute("role", "listitem"), this.shadowRoot.querySelector("slot").addEventListener("slotchange", () => this.#t());
	}
	update(e) {
		(e.has("href") || e.has("current")) && this.#e();
		let t = this.shadowRoot.querySelector(".separator");
		t.hidden = !this.showSeparator || this.current;
	}
	#e() {
		let e = this.shadowRoot.querySelector(".label"), t = this.href !== null && !this.current, n = document.createElement(t ? "a" : "span");
		n.className = "label", t && n.setAttribute("href", this.href), this.current && n.setAttribute("aria-current", "page"), n.append(...e.childNodes), e.replaceWith(n), this.#t();
	}
	#t() {
		let e = this.shadowRoot.querySelector(".label"), t = this.textContent.trim();
		e.localName === "a" && t ? e.setAttribute("aria-label", t) : e.removeAttribute("aria-label"), !this.current && t ? e.title = t : e.removeAttribute("title");
	}
}).define();
//#endregion
//#region src/components/breadcrumb/breadcrumb.css?inline
var Ei = ":host{min-width:0;display:block}.list{align-items:flex-start;gap:var(--arq-space-gap-sm);flex-wrap:nowrap;min-width:0;margin:0;padding:0;list-style:none;display:flex}::slotted(*){flex:0 auto;min-width:0}::slotted([current]){flex-shrink:1000;min-width:auto}@media (width<=767px){.list{row-gap:var(--arq-space-gap-xs);flex-wrap:wrap}}", Di = "Migas de pan";
(class extends L {
	static tag = "arq-breadcrumb";
	static styles = Ei;
	static template = `<nav aria-label="${Di}"><div class="list" role="list"><slot></slot></div></nav>`;
}).define();
//#endregion
//#region src/components/footer-link/footer-link.css?inline
var Oi = ":host{vertical-align:middle;max-width:100%;display:inline-flex}.link{align-items:center;gap:var(--arq-space-gap-sm);max-width:100%;color:var(--arq-color-text-secondary);text-decoration:none;display:inline-flex;position:relative}.label{overflow-wrap:break-word;min-width:0}.leading{flex:none;display:inline-flex}.icon{width:var(--arq-icon-md);height:var(--arq-icon-md)}.link:after{content:\"\";inset-inline:0;height:var(--arq-border-default);background:var(--arq-color-border-strong);transform-origin:100%;transition:transform var(--arq-motion-duration-base) var(--arq-motion-easing-standard);position:absolute;top:100%;transform:scaleX(0)}@media (hover:hover) and (pointer:fine){.link[href]:hover{color:var(--arq-color-text-primary)}.link[href]:hover:after{transform-origin:0;transform:scaleX(1)}}.link[href]:active{color:var(--arq-color-text-tertiary)}.link[href]:active:after{transform:scaleX(0)}.link:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.link:focus:not(:focus-visible){outline:none}";
(class extends L {
	static tag = "arq-footer-link";
	static styles = Oi;
	static properties = {
		showIcon: { type: Boolean },
		icon: {
			type: String,
			default: "instagram"
		},
		href: { type: String },
		target: { type: String },
		label: { type: String }
	};
	static template = "<a class=\"link role-body\"><span class=\"leading\" hidden></span><span class=\"label\"><slot></slot></span></a>";
	setup() {
		this.hasAttribute("role") || this.setAttribute("role", "listitem");
	}
	update(e) {
		let t = this.shadowRoot.querySelector(".link");
		this.href === null ? t.removeAttribute("href") : t.setAttribute("href", this.href), this.label ? t.setAttribute("aria-label", this.label) : t.removeAttribute("aria-label"), this.target ? t.setAttribute("target", this.target) : t.removeAttribute("target"), this.target === "_blank" ? t.setAttribute("rel", "noopener") : t.removeAttribute("rel");
		let n = this.shadowRoot.querySelector(".leading");
		e.has("icon") && (n.innerHTML = R(this.icon)), n.hidden = !this.showIcon;
	}
}).define();
//#endregion
//#region src/components/text-link/text-link.css?inline
var ki = ":host{max-width:100%;display:inline-block}a.link{max-width:100%;color:var(--arq-color-text-primary);line-height:calc(1em + var(--arq-border-strong));transition:color var(--arq-motion-duration-base) var(--arq-motion-easing-standard);text-decoration:none;display:inline-block;position:relative}a.link:before{content:\"\";inset-inline:0;height:var(--arq-border-default);background:currentColor;position:absolute;top:100%}@media (hover:hover) and (pointer:fine){a.link:hover{color:var(--arq-color-text-tertiary)}}a.link:active{color:var(--arq-color-text-tertiary)}a.link:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:var(--arq-border-strong)}a.link:focus:not(:focus-visible){outline:none}";
(class extends L {
	static tag = "arq-text-link";
	static styles = ki;
	static properties = {
		size: {
			type: String,
			values: ["default", "compact"],
			default: "default"
		},
		href: { type: String },
		target: { type: String },
		label: { type: String }
	};
	static template = "<a class=\"link\"><slot></slot></a>";
	update() {
		let e = this.shadowRoot.querySelector(".link");
		e.classList.toggle("role-body-regular", this.size !== "compact"), e.classList.toggle("role-body-compact-regular", this.size === "compact"), this.href === null ? e.removeAttribute("href") : e.setAttribute("href", this.href), this.label ? e.setAttribute("aria-label", this.label) : e.removeAttribute("aria-label"), this.target ? e.setAttribute("target", this.target) : e.removeAttribute("target"), this.target === "_blank" ? e.setAttribute("rel", "noopener") : e.removeAttribute("rel");
	}
	focus(e) {
		this.shadowRoot.querySelector(".link")?.focus(e);
	}
}).define();
//#endregion
//#region src/components/form-message/form-message.css?inline
var Ai = ":host{display:block}.message{transition:opacity var(--arq-motion-duration-slow) var(--arq-motion-easing-out), transform var(--arq-motion-duration-slow) var(--arq-motion-easing-out), color var(--arq-motion-duration-fast) var(--arq-motion-easing-standard)}@starting-style{.message{opacity:0;transform:translateY(var(--arq-space-gap-sm))}}@media (prefers-reduced-motion:reduce){.message{transition:opacity var(--arq-motion-duration-fade) var(--arq-motion-easing-out)}}.message{color:var(--arq-color-text-success);margin:0}:host([tone=error]) .message{color:var(--arq-color-text-error)}";
(class extends L {
	static tag = "arq-form-message";
	static styles = Ai;
	static properties = { tone: {
		type: String,
		values: ["success", "error"],
		default: "success"
	} };
	static template = "<p class=\"message role-body\"><slot></slot></p>";
	setup() {
		let e = this.shadowRoot.querySelector("slot"), t = this.shadowRoot.querySelector(".message"), n = () => {
			t.hidden = !e.assignedNodes().some((e) => e.textContent.trim());
		};
		e.addEventListener("slotchange", n), n();
	}
	update() {
		this.setAttribute("role", this.tone === "error" ? "alert" : "status");
	}
}).define();
//#endregion
//#region src/components/spec-row/spec-row.css?inline
var ji = ":host{display:block}.row{align-items:flex-start;gap:var(--arq-space-gap-md);padding-block:var(--arq-space-padding-sm);border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle);margin:0;display:flex}:host([data-arq-last]) .row{border-bottom-color:var(--arq-color-surface-transparent)}.label{flex:0 1 var(--arq-layout-measure);overflow-wrap:anywhere;min-width:0;max-width:50%;color:var(--arq-color-text-primary)}.value{overflow-wrap:anywhere;min-width:0;color:var(--arq-color-text-primary);flex:1 1 0;margin:0}";
(class extends L {
	static tag = "arq-spec-row";
	static styles = ji;
	static template = "<dl class=\"row role-body-regular\"><dt class=\"label\"><slot name=\"label\"></slot></dt><dd class=\"value role-body\"><slot></slot></dd></dl>";
}).define();
//#endregion
//#region src/components/spec-list/spec-list.css?inline
var Mi = ":host{min-width:0;display:block}.list{flex-direction:column;display:flex}@media (width>=1024px){:host([columns]) .list{grid-template-columns:repeat(2,minmax(0,1fr));grid-auto-flow:column;grid-template-rows:repeat(var(--rows,1), auto);column-gap:var(--arq-space-gap-4xl);display:grid}}";
(class extends L {
	static tag = "arq-spec-list";
	static styles = Mi;
	static properties = { columns: { type: Boolean } };
	static template = "<div class=\"list\"><slot></slot></div>";
	setup() {
		this.slotEl = this.shadowRoot.querySelector("slot"), this.wide = window.matchMedia("(min-width: 1024px)"), this.slotEl.addEventListener("slotchange", () => this.#e()), this.wide.addEventListener("change", () => this.#e());
	}
	update() {
		this.#e();
	}
	#e() {
		let e = this.slotEl.assignedElements(), t = this.columns && this.wide.matches ? Math.ceil(e.length / 2) : e.length;
		this.style.setProperty("--rows", t), e.forEach((e, n) => e.toggleAttribute("data-arq-last", (n + 1) % t === 0));
	}
}).define();
//#endregion
//#region src/base/disclosure.js
var Ni = 0, Pi = "\n[data-disclosure-panel=''] {\n  transition-property: opacity, color, background-color, border-color, outline-color, text-decoration-color, fill, stroke;\n  transition-duration: var(--arq-motion-duration-base);\n  transition-timing-function: var(--arq-motion-easing-standard);\n}\n\n@starting-style {\n  [data-disclosure-panel='']:not([hidden]) {\n    opacity: 0;\n  }\n}\n\n/* Reduced motion: el fundido se queda (motion/duration/fade); los colores, en\n   motion/duration/fast, que vale 0. Ocho valores, uno por propiedad. */\n@media (prefers-reduced-motion: reduce) {\n  [data-disclosure-panel=''] {\n    transition-duration: var(--arq-motion-duration-fade), var(--arq-motion-duration-fast), var(--arq-motion-duration-fast), var(--arq-motion-duration-fast), var(--arq-motion-duration-fast), var(--arq-motion-duration-fast), var(--arq-motion-duration-fast), var(--arq-motion-duration-fast);\n    transition-timing-function: var(--arq-motion-easing-out);\n  }\n}\n\n/* animateHeight. visibility pasa a hidden recién al terminar de cerrar. */\n[data-disclosure-panel='height'] {\n  display: grid;\n  grid-template-rows: 0fr;\n  opacity: 0;\n  visibility: hidden;\n  transition:\n    grid-template-rows var(--arq-motion-duration-expand) var(--arq-motion-easing-out),\n    opacity var(--arq-motion-duration-base) var(--arq-motion-easing-out),\n    visibility 0s linear var(--arq-motion-duration-expand);\n}\n\n[data-disclosure-panel='height'][data-open] {\n  grid-template-rows: 1fr;\n  opacity: 1;\n  visibility: visible;\n  transition-delay: 0s;\n}\n\n[data-disclosure-panel='height'] > * {\n  min-height: 0;\n  overflow: hidden;\n}\n\n@media (prefers-reduced-motion: reduce) {\n  [data-disclosure-panel='height'] {\n    transition:\n      opacity var(--arq-motion-duration-fade) var(--arq-motion-easing-out),\n      visibility 0s linear var(--arq-motion-duration-fade);\n  }\n\n  [data-disclosure-panel='height'][data-open] {\n    transition-delay: 0s;\n  }\n}\n", Fi;
function Ii(e) {
	Fi || (Fi = new CSSStyleSheet(), Fi.replaceSync(Pi)), e.adoptedStyleSheets.includes(Fi) || (e.adoptedStyleSheets = [...e.adoptedStyleSheets, Fi]);
}
var Li = class {
	#e;
	#t;
	#n;
	#r;
	constructor(e, { trigger: t, panel: n, closeOnEscape: r = !1, animateHeight: i = !1 }) {
		this.#e = e, this.#t = t, this.#n = n, this.#r = i, n.id ||= `arq-disclosure-${++Ni}`, n.setAttribute("data-disclosure-panel", i ? "height" : ""), Ii(e.shadowRoot), t.type = "button", t.setAttribute("aria-controls", n.id), t.addEventListener("click", () => this.toggle()), r && e.addEventListener("keydown", (e) => {
			e.key === "Escape" && this.open && (e.stopPropagation(), this.hide(), this.#t.focus());
		}), e.addController(this);
	}
	get open() {
		return this.#e.open;
	}
	show() {
		this.toggle(!0);
	}
	hide() {
		this.toggle(!1);
	}
	toggle(e) {
		let t = e ?? !this.open;
		t !== this.open && (this.#e.open = t, this.#i(), this.#e.emit("toggle", { open: t }));
	}
	hostUpdate(e) {
		e.has("open") && this.#i();
	}
	#i() {
		let e = this.open;
		this.#t.setAttribute("aria-expanded", String(e)), this.#r ? this.#n.toggleAttribute("data-open", e) : this.#n.hidden = !e;
	}
}, Ri = ":host{min-width:0;display:block}.item{border-bottom:var(--arq-border-default) solid var(--arq-color-border-default);background:var(--arq-color-surface-transparent)}.heading{margin:0}.trigger{box-sizing:border-box;align-items:center;gap:var(--arq-space-gap-md);width:100%;padding:var(--arq-space-padding-xl-2xl) var(--arq-space-padding-xl);padding-bottom:calc(var(--arq-space-padding-xl-2xl) - var(--arq-border-default));background:var(--arq-color-surface-transparent);color:var(--arq-color-text-primary);font:inherit;text-align:start;cursor:pointer;-webkit-tap-highlight-color:var(--arq-color-surface-transparent);border:0;margin:0;display:flex}:host([open]) .trigger{padding-block:var(--arq-space-padding-lg) var(--arq-space-gap-xs)}.title{overflow-wrap:break-word;flex:1 1 0;min-width:0}.icon-box{padding:var(--arq-space-padding-sm-md);color:var(--arq-color-icon-primary);flex:none;display:inline-flex}.icon{width:var(--arq-icon-xl);height:var(--arq-icon-xl)}:host(:not([open])) [data-icon=minus],:host([open]) [data-icon=plus]{display:none}.content{padding:0 var(--arq-space-padding-xl) var(--arq-space-padding-lg)}@media (width<=767px){.trigger,.content{padding-inline:0}}@media (hover:hover) and (pointer:fine){:host(:not([open])) .item:has(.trigger:hover){background:var(--arq-color-surface-faint)}}.item:has(.trigger:focus-visible){outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.trigger:focus{outline:none}";
(class extends L {
	static tag = "arq-accordion-item";
	static styles = Ri;
	static properties = {
		open: { type: Boolean },
		headingLevel: {
			type: Number,
			default: 3
		}
	};
	static template = `<div class="item"><div class="heading" role="heading" aria-level="3"><button type="button" class="trigger"><span class="title role-heading-3"><slot name="title"></slot></span><span class="icon-box">${R("plus")}${R("minus")}</span></button></div><div class="content" part="panel"><slot></slot></div></div>`;
	setup() {
		this.disclosure = new Li(this, {
			trigger: this.shadowRoot.querySelector(".trigger"),
			panel: this.shadowRoot.querySelector(".content")
		});
	}
	update() {
		let e = Math.min(6, Math.max(1, Math.round(this.headingLevel) || 3));
		this.shadowRoot.querySelector(".heading").setAttribute("aria-level", String(e));
	}
}).define();
//#endregion
//#region src/components/filter-chip/filter-chip.css?inline
var zi = ":host{vertical-align:middle;max-width:100%;display:inline-flex}.chip{box-sizing:border-box;align-items:center;gap:var(--arq-space-gap-xs);max-width:100%;padding:var(--arq-space-padding-xs) var(--arq-space-padding-sm);border:var(--arq-border-default) solid var(--arq-color-border-default);border-radius:var(--arq-radius-control);background:var(--arq-color-surface-transparent);color:var(--arq-color-text-primary);cursor:pointer;-webkit-tap-highlight-color:var(--arq-color-surface-transparent);margin:0;display:inline-flex}.label{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.icon{width:var(--arq-icon-sm);height:var(--arq-icon-sm);flex:none}@media (hover:hover) and (pointer:fine){.chip:hover{border-color:var(--arq-color-text-primary)}}.chip:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.chip:focus:not(:focus-visible){outline:none}";
(class extends L {
	static tag = "arq-filter-chip";
	static styles = zi;
	static template = `<button type="button" class="chip role-body-sm"><span class="label"><slot></slot></span>${R("close")}</button>`;
	#e = null;
	setup() {
		this.#e = this.shadowRoot.querySelector(".chip");
		let e = () => {
			this.#e.setAttribute("aria-label", `Quitar filtro ${this.textContent.trim()}`), this.#e.title = this.textContent.trim();
		};
		this.shadowRoot.querySelector("slot").addEventListener("slotchange", e), e();
	}
	focus(e) {
		this.#e ? this.#e.focus(e) : super.focus(e);
	}
}).define();
//#endregion
//#region src/components/select-option/select-option.css?inline
var Bi = ":host{cursor:pointer;display:block}:host([disabled]){cursor:default}.option{align-items:center;gap:var(--arq-space-gap-sm);padding:var(--arq-space-padding-md);border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle);display:flex}@media (hover:hover) and (pointer:fine){:host(:not([disabled]):hover) .option{background:var(--arq-color-surface-faint)}}.swatch{box-sizing:border-box;width:var(--arq-swatch-sm);height:var(--arq-swatch-sm);border:var(--arq-border-default) solid var(--arq-color-border-default);border-radius:var(--arq-radius-control);background:var(--arq-color-surface-subtle);flex:none;position:relative;overflow:hidden}.swatch img{object-fit:cover;width:100%;height:100%;display:block}.name{min-width:0;color:var(--arq-color-text-primary)}:host([disabled]) .name{color:var(--arq-color-text-disabled)}:host([disabled]) .swatch{opacity:var(--arq-opacity-disabled)}.control{width:var(--arq-icon-md);height:var(--arq-icon-md);flex:none;justify-content:center;align-items:center;display:inline-flex}.box{box-sizing:border-box;width:var(--arq-icon-sm);height:var(--arq-icon-sm);border:var(--arq-border-default) solid var(--arq-color-icon-tertiary);border-radius:var(--arq-radius-control);background:var(--arq-color-surface-default)}:host([multiple]) .option{padding:var(--arq-space-padding-sm) var(--arq-space-padding-md);border-bottom:0}:host([multiple]) .name{color:var(--arq-color-text-secondary)}:host([multiple][active]) .name{color:var(--arq-color-text-primary)}@media (hover:hover) and (pointer:fine){:host([multiple]:not([disabled]):hover) .name{color:var(--arq-color-text-primary)}:host([multiple]:not([disabled]):hover) .box{border-width:var(--arq-border-strong);border-color:var(--arq-color-border-strong)}}:host([multiple][selected]) .box{border-color:var(--arq-color-action-primary);background:var(--arq-color-action-primary)}:host([multiple][disabled]) .box{border-color:var(--arq-color-icon-disabled);background:var(--arq-color-surface-default)}:host([multiple][disabled]) .name{color:var(--arq-color-text-disabled)}:host([active]) .option{background:var(--arq-color-surface-faint)}:host(:focus-visible){outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}:host(:focus:not(:focus-visible)){outline:none}";
(class extends L {
	static tag = "arq-select-option";
	static styles = Bi;
	static properties = {
		showSwatch: { type: Boolean },
		swatchSrc: { type: String },
		selected: { type: Boolean },
		disabled: { type: Boolean },
		active: { type: Boolean },
		multiple: { type: Boolean },
		value: { type: String }
	};
	static template = "<span class=\"option\"><span class=\"control\" aria-hidden=\"true\" hidden><span class=\"box\"></span></span><span class=\"swatch\" aria-hidden=\"true\" hidden><img alt=\"\" hidden></span><span class=\"name role-body\"><slot></slot></span></span>";
	setup() {
		this.hasAttribute("role") || this.setAttribute("role", "option");
		let e = this.shadowRoot.querySelector("img");
		e.addEventListener("error", () => e.hidden = !0), e.addEventListener("load", () => e.hidden = !1), this.addEventListener("click", () => {
			this.disabled || this.emit("change", {
				value: this.value,
				selected: !0
			});
		});
	}
	update(e) {
		this.setAttribute("aria-selected", String(this.selected)), this.disabled ? this.setAttribute("aria-disabled", "true") : this.removeAttribute("aria-disabled"), this.shadowRoot.querySelector(".swatch").hidden = !this.showSwatch || this.multiple, this.shadowRoot.querySelector(".control").hidden = !this.multiple;
		let t = this.shadowRoot.querySelector(".name"), n = this.selected && !this.multiple;
		if (t.classList.toggle("role-body", !n), t.classList.toggle("role-body-medium", n), e.has("swatchSrc")) {
			let e = this.shadowRoot.querySelector("img");
			this.swatchSrc ? e.src = this.swatchSrc : (e.removeAttribute("src"), e.hidden = !0);
		}
	}
}).define();
//#endregion
//#region src/components/select-menu/select-menu.css?inline
var Vi = ":host{box-sizing:border-box;border:var(--arq-border-default) solid var(--arq-color-border-default);border-radius:var(--arq-radius-control);background:var(--arq-color-surface-default);min-width:100%;display:block}:host([type=filter]),:host([type=text]){width:max-content;max-width:calc(100vw - 2 * var(--arq-layout-gutter))}:host([type=filter]){min-width:max(100%, var(--arq-layout-select-menu-filter))}:host{max-height:calc(7 * (2 * var(--arq-space-padding-md) + var(--arq-type-body-leading) + var(--arq-border-default)) + 2 * var(--arq-border-default));overscroll-behavior:contain;overflow-y:auto}:host(:focus){outline:none}:host([aria-multiselectable=true]){padding-block:var(--arq-space-padding-sm)}", Hi = 0;
(class extends L {
	static tag = "arq-select-menu";
	static styles = Vi;
	static properties = {
		type: {
			type: String,
			values: [
				"finishes",
				"filter",
				"text"
			],
			default: "finishes"
		},
		label: { type: String }
	};
	static template = "<div class=\"menu\"><slot></slot></div>";
	setup() {
		this.setAttribute("role", "listbox"), this.hasAttribute("tabindex") || this.setAttribute("tabindex", "-1"), queueMicrotask(() => this.#e());
	}
	update(e) {
		e.has("label") && this.#e();
	}
	#e() {
		if (this.label) {
			this.setAttribute("aria-label", this.label), this.removeAttribute("aria-labelledby");
			return;
		}
		this.removeAttribute("aria-label");
		let e = this.getRootNode().querySelector?.(".label");
		e && (e.id ||= `arq-select-menu-label-${++Hi}`, this.setAttribute("aria-labelledby", e.id));
	}
}).define();
//#endregion
//#region src/base/combobox.js
var Ui = class {
	#e;
	#t = -1;
	#n = "";
	#r = 0;
	constructor(e) {
		this.#e = e;
		let { trigger: t, menu: n } = e;
		t.setAttribute("role", "combobox"), t.setAttribute("aria-haspopup", "listbox"), t.setAttribute("aria-controls", n.id), t.addEventListener("click", () => e.isOpen() ? this.close() : this.show()), t.addEventListener("keydown", (e) => this.#l(e)), t.addEventListener("blur", () => {
			setTimeout(() => {
				let n = t.getRootNode();
				e.isOpen() && n.activeElement !== t && this.close(!1);
			});
		}), n.addEventListener("pointerdown", (e) => e.preventDefault()), n.addEventListener("click", (e) => {
			let t = e.target.closest("arq-select-option");
			t && !t.disabled && this.#s([...n.children].indexOf(t));
		}), n.addEventListener("arq:change", (e) => e.stopPropagation());
	}
	show() {
		let { setOpen: e, selected: t, options: n, menu: r } = this.#e;
		this.#i ? r.setAttribute("aria-multiselectable", "true") : r.removeAttribute("aria-multiselectable"), e(!0);
		let i = t();
		this.#a(i >= 0 && !n()[i]?.disabled ? i : this.#o(-1, 1));
	}
	close(e = !0) {
		this.#e.setOpen(!1), e && this.#e.trigger.focus();
	}
	closed() {
		this.#a(-1);
	}
	get #i() {
		return !!this.#e.multiple?.();
	}
	#a(e) {
		this.#t = e;
		let { trigger: t, menu: n } = this.#e, r = [...n.children];
		r.forEach((t, n) => t.active = n === e), e >= 0 && r[e] ? (t.setAttribute("aria-activedescendant", r[e].id), requestAnimationFrame(() => r[e].scrollIntoView({ block: "nearest" }))) : t.removeAttribute("aria-activedescendant");
	}
	#o(e, t) {
		let n = this.#e.options();
		for (let r = e + t; r >= 0 && r < n.length; r += t) if (!n[r].disabled) return r;
		return e;
	}
	#s(e) {
		let t = this.#e.options()[e];
		t && !t.disabled && (this.#e.choose(e), this.#i ? this.#a(e) : this.close());
	}
	#c(e) {
		let t = Date.now();
		this.#n = t - this.#r > 500 ? e : this.#n + e, this.#r = t;
		let n = this.#e.options(), r = this.#t >= 0 ? this.#t : 0, i = [...n.keys()].slice(r + 1).concat([...n.keys()].slice(0, r + 1)).find((e) => !n[e].disabled && n[e].label.toLowerCase().startsWith(this.#n.toLowerCase()));
		i !== void 0 && this.#a(i);
	}
	#l(e) {
		let { key: t } = e, n = this.#e.options().length, r = t.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey;
		if (!this.#e.isOpen()) {
			[
				"ArrowDown",
				"ArrowUp",
				"Enter",
				" ",
				"Home",
				"End"
			].includes(t) ? (e.preventDefault(), this.show(), t === "Home" && this.#a(this.#o(-1, 1)), t === "End" && this.#a(this.#o(n, -1))) : r && (this.show(), this.#c(t));
			return;
		}
		if (t === "ArrowDown") this.#a(this.#o(this.#t, 1));
		else if (t === "ArrowUp") this.#a(this.#o(this.#t, -1));
		else if (t === "Home") this.#a(this.#o(-1, 1));
		else if (t === "End") this.#a(this.#o(n, -1));
		else if (t === "Enter" || t === " ") this.#s(this.#t);
		else if (t === "Escape") this.close();
		else if (t === "Tab") {
			this.close(!1);
			return;
		} else if (r) this.#c(t);
		else return;
		e.preventDefault();
	}
}, Wi = "[role=\"radiogroup\"], [role=\"tablist\"]", Gi = class {
	constructor(e, { role: t, state: n }) {
		this.host = e, this.role = t, this.state = n, e.hasAttribute("role") || e.setAttribute("role", t), e.choose = () => this.choose(), e.addEventListener("click", () => this.choose()), e.addEventListener("keydown", (e) => {
			(e.key === "Enter" || e.key === " ") && (e.preventDefault(), this.choose());
		}), e.addController(this);
	}
	choose() {
		let e = this.host;
		e.disabled || e.selected || e.type === "value" || (e.selected = !0, e.emit("change", {
			value: e.value ?? null,
			selected: !0
		}));
	}
	hostUpdate() {
		let e = this.host;
		if (e.type === "value") {
			for (let t of [
				"role",
				this.state,
				"aria-disabled",
				"tabindex"
			]) e.removeAttribute(t);
			return;
		}
		e.hasAttribute("role") || e.setAttribute("role", this.role), e.setAttribute(this.state, String(!!e.selected)), e.disabled ? e.setAttribute("aria-disabled", "true") : e.removeAttribute("aria-disabled"), e.parentElement?.closest(Wi) || e.setAttribute("tabindex", e.disabled ? "-1" : "0");
	}
}, Ki = ":host{vertical-align:middle;flex:none;display:inline-flex}.swatch{box-sizing:border-box;width:var(--arq-swatch-sm);height:var(--arq-swatch-sm);border-radius:var(--arq-radius-control);background:var(--arq-color-surface-subtle);display:block;position:relative;overflow:hidden}:host([size=default]) .swatch{width:var(--arq-swatch-md);height:var(--arq-swatch-md)}:host([size=large]) .swatch{width:var(--arq-swatch-lg);height:var(--arq-swatch-lg)}:host([size=xlarge]) .swatch{width:var(--arq-swatch-xl);height:var(--arq-swatch-xl)}.swatch img{object-fit:cover;width:100%;height:100%;display:block}.swatch:after{content:\"\";border:var(--arq-border-default) solid var(--arq-color-border-subtle);border-radius:inherit;pointer-events:none;position:absolute;inset:0}:host([role=radio]){cursor:pointer}:host([selected]) .swatch:after{border-width:var(--arq-border-strong);border-color:var(--arq-color-border-strong)}@media (hover:hover) and (pointer:fine){:host([role=radio]:not([disabled]):hover) .swatch:after{border-width:var(--arq-border-strong);border-color:var(--arq-color-border-strong)}}:host([size=xlarge]) .swatch{outline:var(--arq-border-default) solid var(--arq-color-surface-transparent);outline-offset:var(--arq-space-padding-2xs);transition-property:outline-color,opacity;transition-duration:var(--arq-motion-duration-base);transition-timing-function:var(--arq-motion-easing-standard)}:host([size=xlarge]) .swatch:after{border-width:var(--arq-border-default);border-color:var(--arq-color-border-subtle)}@media (hover:hover) and (pointer:fine){:host([size=xlarge][role=radio]:not([disabled]):hover) .swatch:after{border-width:var(--arq-border-default);border-color:var(--arq-color-border-subtle)}:host([size=xlarge][role=radio]:not([disabled]):not([selected]):hover) .swatch{outline-color:var(--arq-color-border-hover)}}:host([size=xlarge][selected]) .swatch{outline-color:var(--arq-color-border-strong)}:host([disabled]){cursor:default}:host([disabled]) .swatch{opacity:var(--arq-opacity-disabled)}:host([disabled]) .swatch:after{border-color:var(--arq-color-border-disabled)}:host(:focus-visible){outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}:host(:focus:not(:focus-visible)){outline:none}@media (forced-colors:active){.swatch{forced-color-adjust:none}.swatch:after,:host([size=xlarge]) .swatch:after,:host([role=radio]:not([disabled]):hover) .swatch:after,:host([size=xlarge][role=radio]:not([disabled]):hover) .swatch:after{border-color:canvastext}:host([selected]) .swatch:after,:host([selected][role=radio]:not([disabled]):hover) .swatch:after{border-color:highlight}:host([size=xlarge][selected]) .swatch{outline-color:highlight}:host([disabled]) .swatch:after{border-color:graytext}}";
(class extends L {
	static tag = "arq-swatch";
	static styles = Ki;
	static properties = {
		size: {
			type: String,
			values: [
				"small",
				"default",
				"large",
				"xlarge"
			],
			default: "small"
		},
		selected: { type: Boolean },
		disabled: { type: Boolean },
		src: { type: String },
		value: { type: String }
	};
	static template = "<span class=\"swatch\"><img alt=\"\" hidden></span><span class=\"visually-hidden\"><slot></slot></span>";
	setup() {
		let e = this.shadowRoot.querySelector("img");
		e.addEventListener("error", () => e.hidden = !0), e.addEventListener("load", () => e.hidden = !1);
		let t = () => {
			let e = this.textContent.trim();
			e && this.setAttribute("aria-label", e), e ? this.title = e : this.removeAttribute("title");
		};
		this.shadowRoot.querySelector("slot").addEventListener("slotchange", t), t(), this.getAttribute("role") === "radio" || this.parentElement?.closest("arq-swatch-picker") ? this.selectable = new Gi(this, {
			role: "radio",
			state: "aria-checked"
		}) : this.hasAttribute("role") || this.setAttribute("role", "img");
	}
	update(e) {
		if (e.has("src")) {
			let e = this.shadowRoot.querySelector("img");
			this.src ? e.src = this.src : (e.removeAttribute("src"), e.hidden = !0);
		}
	}
}).define();
//#endregion
//#region src/components/select/select.css?inline
var qi = ":host{min-width:0;display:block}.select{flex-direction:column;display:flex;position:relative}.label{color:var(--arq-color-text-tertiary)}.trigger{box-sizing:border-box;align-items:center;gap:var(--arq-space-gap-sm-md);width:100%;padding:var(--arq-space-padding-sm-md) 0 calc(var(--arq-space-padding-sm-md) - var(--arq-border-default));border:0;border-bottom:var(--arq-border-default) solid var(--arq-color-border-strong);border-radius:var(--arq-radius-control);background:var(--arq-color-surface-transparent);color:var(--arq-color-text-primary);font:inherit;text-align:start;cursor:pointer;-webkit-tap-highlight-color:var(--arq-color-surface-transparent);margin:0;display:flex}.value{overflow-wrap:break-word;flex:auto;min-width:0}.chevron{flex:none;display:inline-flex}.icon{width:var(--arq-icon-md);height:var(--arq-icon-md);color:var(--arq-color-icon-primary)}:host(:not([open])) [data-icon=chevron-up],:host([open]) [data-icon=chevron-down]{display:none}@media (hover:hover) and (pointer:fine){:host(:not([open])) .trigger:enabled:hover{background:var(--arq-color-surface-faint)}}:host([open]) .trigger{background:var(--arq-color-surface-faint)}.menu{z-index:2;position:absolute;top:100%;left:0}:host(:not([type=filter])) .menu,:host([size=small]) .menu,:host([multiple]) .menu{right:0}:host([type=filter]){min-width:var(--arq-layout-select-filter)}:host([type=filter]) .select{gap:var(--arq-space-gap-sm)}:host([type=filter]) .trigger{border-bottom-color:var(--arq-color-surface-transparent);justify-content:space-between}:host([type=filter]) .icon{width:var(--arq-icon-sm);height:var(--arq-icon-sm)}:host([disabled]) .trigger,:host([type=filter][disabled]) .trigger{cursor:default;border-bottom-color:var(--arq-color-border-disabled);background:var(--arq-color-surface-transparent);color:var(--arq-color-text-disabled)}:host([disabled]) .label,:host([disabled]) .icon{color:var(--arq-color-text-disabled)}:host([disabled]) .swatch{opacity:.4}.trigger:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.trigger:focus:not(:focus-visible){outline:none}", Ji = 0;
(class extends L {
	static tag = "arq-select";
	static styles = qi;
	static properties = {
		type: {
			type: String,
			values: ["field", "filter"],
			default: "field"
		},
		size: {
			type: String,
			values: ["default", "small"],
			default: "default"
		},
		label: { type: String },
		value: { type: String },
		name: { type: String },
		disabled: { type: Boolean },
		open: { type: Boolean },
		filled: { type: Boolean },
		allLabel: {
			type: String,
			default: "Todos"
		},
		hideAll: { type: Boolean },
		showSwatch: { type: Boolean },
		multiple: { type: Boolean }
	};
	static template = `<div class="select"><span class="label role-label" hidden></span><button type="button" class="trigger" aria-expanded="false"><arq-swatch class="swatch" aria-hidden="true" hidden></arq-swatch><span class="value"></span><span class="chevron">${R("chevron-down")}${R("chevron-up")}</span></button><arq-select-menu class="menu" hidden></arq-select-menu></div>`;
	#e = [];
	#t = [];
	#n = null;
	get values() {
		return [...this.#t];
	}
	set values(e) {
		this.#t = Array.isArray(e) ? e.map(String) : [], this.isConnected && this.#i();
	}
	get options() {
		return this.#e;
	}
	set options(e) {
		this.#e = Array.isArray(e) ? e : [], this.isConnected && this.#i();
	}
	setup() {
		let e = this.shadowRoot, t = `arq-select-${++Ji}`;
		this.trigger = e.querySelector(".trigger"), this.menu = e.querySelector(".menu"), this.menu.id = `${t}-menu`, e.querySelector(".label").id = `${t}-label`, this.trigger.id = `${t}-trigger`, this.#n = new Ui({
			trigger: this.trigger,
			menu: this.menu,
			options: () => this.#r(),
			selected: () => this.#r().findIndex((e) => this.#a(e)),
			multiple: () => this.multiple,
			isOpen: () => this.open,
			setOpen: (e) => this.open = e,
			choose: (e) => this.#o(e)
		}), this.#i();
	}
	update(e) {
		let t = this.shadowRoot, n = this.type === "filter", r = t.querySelector(".label");
		r.hidden = !1, r.textContent = this.label ?? "", r.className = `label ${n && this.size !== "small" ? "role-label-lg" : "role-label"}`, this.trigger.setAttribute("aria-labelledby", `${r.id} ${this.trigger.id}`), this.trigger.removeAttribute("aria-label"), this.trigger.disabled = this.disabled, this.menu.type = n && this.size !== "small" && !this.multiple ? "filter" : "finishes", e.has("open") && (this.menu.hidden = !this.open, this.trigger.setAttribute("aria-expanded", String(this.open)), this.open || this.#n.closed()), this.#i();
	}
	show() {
		this.disabled || this.#n.show();
	}
	close(e = !0) {
		this.#n.close(e);
	}
	focus(e) {
		this.trigger ? this.trigger.focus(e) : super.focus(e);
	}
	#r() {
		let e = this.#e.map((e) => ({
			value: String(e.value),
			label: e.label ?? String(e.value),
			swatch: e.swatch,
			showSwatch: e.showSwatch !== !1 && !!(e.swatch || e.showSwatch || this.showSwatch),
			disabled: !!e.disabled
		}));
		return this.type === "filter" && !this.hideAll && !this.multiple && e.unshift({
			value: "",
			label: this.allLabel ?? "Todos",
			showSwatch: !1,
			disabled: !1
		}), e;
	}
	#i() {
		if (!this.trigger) return;
		let e = this.#r(), t = this.multiple ? e.filter((e) => this.#t.includes(e.value)) : [], n = this.multiple ? t.length === 1 ? t[0] : { label: t.length ? t.map((e) => e.label).join(", ") : this.allLabel ?? "Todos" } : e.find((e) => e.value === (this.value ?? "")) ?? (this.type === "filter" ? e[0] : null), r = this.type === "filter" && (this.multiple ? t.length > 0 : !!this.value);
		this.filled !== r && (this.filled = r);
		let i = this.shadowRoot.querySelector(".swatch");
		i.hidden = !n?.showSwatch || this.type !== "field" && !r, i.setAttribute("size", this.type === "field" ? "default" : "small"), n?.swatch ? i.setAttribute("src", n.swatch) : i.removeAttribute("src"), i.textContent = n?.label ?? "";
		let a = this.shadowRoot.querySelector(".value");
		a.textContent = n?.label ?? "", a.className = `value ${r && !this.disabled ? "role-body-medium" : "role-body-regular"}`;
		let o = this.menu;
		for (; o.children.length > e.length;) o.lastElementChild.remove();
		for (; o.children.length < e.length;) o.append(document.createElement("arq-select-option"));
		e.forEach((e, t) => {
			let r = o.children[t];
			r.id = `${o.id}-${t}`, r.dataset.index = String(t), r.value = e.value, r.textContent = e.label, r.showSwatch = e.showSwatch, r.swatchSrc = e.swatch ?? null, r.disabled = e.disabled, r.multiple = this.multiple, r.selected = this.multiple ? this.#t.includes(e.value) : e === n;
		});
	}
	#a(e) {
		return this.multiple ? this.#t.includes(e.value) : e.value === (this.value ?? "");
	}
	#o(e) {
		let t = this.#r()[e];
		if (this.multiple) {
			let e = this.#t.includes(t.value) ? this.#t.filter((e) => e !== t.value) : [...this.#t, t.value], n = this.#r().map((e) => e.value);
			this.#t = e.sort((e, t) => n.indexOf(e) - n.indexOf(t)), this.#i(), this.emit("change", {
				value: this.#t[0] ?? "",
				values: this.values
			});
			return;
		}
		let n = t.value !== (this.value ?? "");
		this.value = t.value, n && this.emit("change", { value: t.value });
	}
}).define();
//#endregion
//#region src/components/filter-bar/filter-bar.css?inline
var Yi = ":host{min-width:0;display:block}.bar{align-items:flex-start;gap:var(--arq-space-gap-xl);padding:var(--arq-space-padding-2xl) var(--page-gutter);background:var(--arq-color-surface-soft);flex-direction:column;display:flex}.filters{align-items:stretch;gap:var(--arq-space-gap-lg);flex-wrap:wrap;min-width:0;display:flex}::slotted(arq-select){flex:none}::slotted(arq-select:not(:first-child)){border-inline-start:var(--arq-border-default) solid var(--arq-color-border-subtle);padding-inline-start:var(--arq-space-gap-lg)}.clear{flex:none}@media (width<=767px){.bar{align-items:stretch}.filters{gap:var(--arq-space-gap-md);flex-direction:column}::slotted(arq-select:not(:first-child)){border-inline-start:0;padding-inline-start:0}.clear{align-self:flex-start}}:host([stacked]) .bar{justify-content:flex-start;align-items:flex-start;gap:var(--arq-space-gap-xl);padding-block:var(--arq-space-padding-2xl);background:var(--arq-color-surface-soft);border-block:0;flex-direction:column}@media (width<=767px){:host([stacked]) .bar{align-items:stretch}}";
(class extends L {
	static tag = "arq-filter-bar";
	static styles = Yi;
	static properties = {
		applied: { type: Boolean },
		stacked: { type: Boolean }
	};
	static template = "<div class=\"bar\"><div class=\"filters\" role=\"group\" aria-label=\"Filtros\"><slot></slot></div><arq-button type=\"underline\" show-underline class=\"clear\" hidden>Limpiar filtros</arq-button></div>";
	setup() {
		this.addEventListener("arq:change", (e) => {
			e.target.localName === "arq-select" && (e.stopPropagation(), this.#e());
		}), this.shadowRoot.querySelector(".clear").addEventListener("click", () => this.clear()), this.shadowRoot.querySelector("slot").addEventListener("slotchange", () => this.#t()), this.#t();
	}
	get selects() {
		return [...this.querySelectorAll(":scope > arq-select")];
	}
	get filters() {
		let e = {};
		for (let t of this.selects) t.value && (e[t.name ?? ""] = t.value);
		return e;
	}
	clear() {
		for (let e of this.selects) e.value = "";
		this.#e(), this.selects[0]?.focus();
	}
	#e() {
		this.#t(), this.emit("filters", { filters: this.filters });
	}
	#t() {
		let e = this.selects.some((e) => !!e.value);
		this.applied !== e && (this.applied = e), this.shadowRoot.querySelector(".clear").hidden = !e;
	}
}).define();
//#endregion
//#region src/components/sku/sku.css?inline
var Xi = ":host{vertical-align:middle;max-width:100%;display:inline-flex}.sku{align-items:flex-start;gap:var(--arq-space-gap-xs);flex-direction:column;min-width:0;display:flex}.label{color:var(--arq-color-text-secondary)}:host([size=compact]) .label{display:none}.row{align-items:flex-start;gap:var(--arq-space-gap-sm);background:var(--arq-color-surface-transparent);max-width:100%;color:var(--arq-color-text-primary);text-align:start;cursor:pointer;-webkit-tap-highlight-color:var(--arq-color-surface-transparent);border:0;margin:0;padding:0;display:inline-flex}.code{min-width:0;color:var(--arq-color-text-primary);overflow-wrap:anywhere}:host([dense][size=compact]) .code{font-size:var(--arq-type-body-compact-size);line-height:var(--arq-type-body-compact-leading)}@media (width>=1920px){:host([dense][size=compact]) .code{font-size:var(--arq-type-body-size);line-height:var(--arq-type-body-leading)}}.copy{color:var(--arq-color-icon-secondary);flex:none;margin-block-start:calc((var(--arq-type-body-lg-leading) - var(--arq-icon-md)) / 2);display:inline-flex}:host([size=compact]) .copy{margin-block-start:calc((var(--arq-type-body-leading) - var(--arq-icon-md)) / 2)}.icon{width:var(--arq-icon-md);height:var(--arq-icon-md)}.success-icon{flex:none;display:none}:host([data-arq-copy-motion]) .copied,:host([data-arq-copy-feedback=replace]) .copied{align-items:center;gap:var(--arq-space-gap-xs)}:host([data-arq-copy-motion]) .success-icon,:host([data-arq-copy-feedback=replace]) .success-icon{display:inline-flex}@media (hover:hover) and (pointer:fine){.row:hover .copy{color:var(--arq-color-icon-primary)}}.copied,.failed{color:var(--arq-color-text-success);flex:none;margin-block-start:calc((var(--arq-type-body-lg-leading) - var(--arq-type-caption-leading)) / 2);display:none}:host([size=compact]) .copied,:host([size=compact]) .failed{margin-block-start:calc((var(--arq-type-body-leading) - var(--arq-type-caption-leading)) / 2)}:host([copied]) .copy,:host(:state(copy-failed)) .copy{display:none}:host([copied]) .copied,:host(:state(copy-failed)) .failed{display:inline}:host([size=compact][data-arq-copy-feedback=replace]) .row{position:relative}:host([size=compact][data-arq-copy-feedback=replace][copied]) .copy{visibility:hidden;display:inline-flex}:host([size=compact][data-arq-copy-feedback=replace][copied]) .code{visibility:hidden}:host([size=compact][data-arq-copy-feedback=replace]) .copied{inset-inline-start:0;white-space:nowrap;position:absolute;top:0}.copied,.failed{transition-property:opacity,color;transition-duration:var(--arq-motion-duration-fade), var(--arq-motion-duration-fast);transition-timing-function:var(--arq-motion-easing-out)}@starting-style{:host([copied]) .copied,:host(:state(copy-failed)) .failed{opacity:0}}.failed{color:var(--arq-color-text-secondary)}.label,.copy,.copied,.failed{-webkit-user-select:none;user-select:none}.row:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.row:focus:not(:focus-visible){outline:none}:host([data-arq-copy-motion]) .row{grid-template-columns:minmax(0,auto) max-content;display:inline-grid}:host([data-arq-copy-motion]) .code{grid-area:1/1}:host([data-arq-copy-motion]) .copy,:host([data-arq-copy-motion]) .copied,:host([data-arq-copy-motion]) .failed{grid-area:1/2}:host([data-arq-copy-motion]) :is(.code,.copy,.copied),:host([data-arq-copy-feedback=replace]) :is(.code,.copy,.copied){transition:opacity var(--arq-motion-duration-fade) var(--arq-motion-easing-standard)}:host([data-arq-copy-motion]) .copied,:host([data-arq-copy-feedback=replace]) .copied{opacity:0;pointer-events:none;display:inline-flex}:host([data-arq-copy-motion][copied]) .copy,:host([data-arq-copy-feedback=replace][copied]) .copy{visibility:visible;opacity:0;display:inline-flex}:host([data-arq-copy-feedback=replace][copied]) .code{visibility:visible;opacity:0}:host([data-arq-copy-motion][copied]) .copied,:host([data-arq-copy-feedback=replace][copied]) .copied{opacity:1}:host([size=underline]) .label,:host([size=underline]) .copy{display:none}:host([size=underline]) .code{text-underline-position:from-font;text-decoration:underline}:host([size=underline][copied]) .code,:host([size=underline]:state(copy-failed)) .code{display:none}:host([size=underline]) .copied,:host([size=underline]) .failed{margin-block-start:0}", Zi = "Copiado", Qi = /Mac|iPhone|iPad/.test(navigator.userAgentData?.platform ?? navigator.platform ?? "") ? "Copialo con ⌘C" : "Copialo con Ctrl+C";
function $i(e, t = "feedback") {
	let n = getComputedStyle(e).getPropertyValue(`--arq-motion-duration-${t}`).trim(), r = Number.parseFloat(n);
	return Number.isNaN(r) ? 0 : n.endsWith("ms") ? r : r * 1e3;
}
(class extends L {
	static tag = "arq-sku";
	static styles = Xi;
	static properties = {
		size: {
			type: String,
			values: [
				"default",
				"compact",
				"underline"
			],
			default: "default"
		},
		dense: { type: Boolean },
		copied: { type: Boolean }
	};
	static template = `<span class="sku"><span class="label role-label">SKU</span><button type="button" class="row"><span class="code"><slot></slot></span><span class="copy">${R("copy")}</span><span class="copied role-caption" aria-hidden="true"><span class="success-icon">${R("check")}</span>${Zi}</span><span class="failed role-caption" aria-hidden="true">${Qi}</span></button><span class="visually-hidden" aria-live="polite"></span></span>`;
	#e = null;
	#t = 0;
	#n = this.attachInternals();
	setup() {
		this.#e = this.shadowRoot.querySelector(".row"), this.#e.addEventListener("click", () => this.copy());
		let e = () => this.#e.setAttribute("aria-label", `Copiar SKU ${this.code}`);
		this.shadowRoot.querySelector("slot").addEventListener("slotchange", e), e();
	}
	get code() {
		return this.textContent.trim();
	}
	focus(e) {
		this.#e ? this.#e.focus(e) : super.focus(e);
	}
	async copy() {
		clearTimeout(this.#t), this.#r(!1);
		try {
			await navigator.clipboard.writeText(this.code);
		} catch {
			getSelection()?.selectAllChildren(this), this.copied = !1, this.#r(!0), this.#t = setTimeout(() => this.#r(!1), $i(this));
			return;
		}
		this.copied = !0, this.emit("copy", { code: this.code }), this.#t = setTimeout(() => {
			this.copied = !1;
		}, $i(this));
	}
	update() {
		let e = this.shadowRoot.querySelector(".code");
		e.classList.toggle("role-body-lg", this.size === "default"), e.classList.toggle("role-body", this.size === "compact"), e.classList.toggle("role-caption-medium", this.size === "underline");
		for (let e of this.shadowRoot.querySelectorAll(".copied, .failed")) e.classList.toggle("role-caption", this.size !== "underline"), e.classList.toggle("role-caption-medium", this.size === "underline");
		this.#i();
	}
	disconnectedCallback() {
		clearTimeout(this.#t);
	}
	#r(e) {
		e ? this.#n.states.add("copy-failed") : this.#n.states.delete("copy-failed"), this.#i();
	}
	#i() {
		let e = this.#n.states.has("copy-failed");
		this.shadowRoot.querySelector("[aria-live]").textContent = e ? Qi : this.copied ? Zi : "";
	}
}).define();
//#endregion
//#region src/components/search-field/search-field.css?inline
var ea = ":host{min-width:0;display:block}.field{align-items:center;gap:var(--arq-space-gap-md);padding:var(--arq-space-gap-sm) var(--arq-space-padding-xs) var(--arq-space-gap-sm) var(--arq-space-padding-md);border:var(--arq-border-default) solid var(--arq-color-border-default);background:var(--arq-color-surface-default);display:flex}:host(:not([show-close]):not([show-clear])) .field{padding-inline-end:var(--arq-space-padding-md)}.field:focus-within{border-color:var(--arq-color-border-focus)}.input{min-width:0;color:var(--arq-color-text-primary);caret-color:var(--arq-color-text-primary);appearance:none;background:0 0;border:0;flex:1;margin:0;padding:0}.input::placeholder{color:var(--arq-color-text-tertiary);opacity:1}:host([size=large]) .input::placeholder,:host([size=medium]) .input::placeholder{font-weight:var(--arq-font-weight-light)}.input:focus{outline:none}.input::-webkit-search-cancel-button{appearance:none}.input::-webkit-search-decoration{appearance:none}.close,.clear{flex:none}:host([show-icon]) .lead{color:var(--arq-color-icon-tertiary);flex:none;display:inline-flex}.lead{display:none}:host([type=line]) .lead{color:var(--arq-color-icon-tertiary);flex:none;display:inline-flex}:host([type=line]) .field{gap:var(--arq-space-gap-sm-md);padding:var(--arq-space-gap-md) 0;border-width:0 0 var(--arq-border-default);border-color:var(--arq-color-border-default);background:0 0}:host([type=line]) .field:focus-within{border-color:var(--arq-color-border-focus)}.lead .icon{width:var(--arq-icon-lg);height:var(--arq-icon-lg)}@media (prefers-contrast:more){.field,:host([type=line]) .field{border-color:var(--arq-color-border-strong)}}";
(class extends L {
	static tag = "arq-search-field";
	static styles = ea;
	static properties = {
		type: {
			type: String,
			values: ["box", "line"],
			default: "box"
		},
		size: {
			type: String,
			values: [
				"default",
				"medium",
				"large"
			],
			default: "default"
		},
		showIcon: { type: Boolean },
		showClear: { type: Boolean },
		showClose: { type: Boolean },
		value: {
			type: String,
			default: ""
		},
		placeholder: {
			type: String,
			default: "Buscar productos…"
		},
		label: {
			type: String,
			default: "Buscar productos"
		},
		activeLabel: {
			type: String,
			default: ""
		},
		status: {
			type: String,
			default: ""
		},
		combobox: { type: Boolean },
		expanded: { type: Boolean }
	};
	static template = `<div class="field"><span class="lead">${R("search")}</span><input class="input role-body" type="search" autocomplete="off" spellcheck="false" enterkeyhint="search"><arq-icon-button class="clear" icon="close" hidden>Borrar búsqueda</arq-icon-button><arq-icon-button class="close" icon="close">Cerrar búsqueda</arq-icon-button></div><span class="visually-hidden active-live" aria-live="polite"></span><span class="visually-hidden status-live" aria-live="polite"></span>`;
	#e = null;
	setup() {
		let e = this.shadowRoot;
		this.#e = e.querySelector("input"), this.#e.addEventListener("input", () => {
			this.value = this.#e.value, this.emit("input", { value: this.value });
		}), this.#e.addEventListener("keydown", (e) => {
			e.key === "ArrowDown" || e.key === "ArrowUp" ? (e.preventDefault(), this.emit("navigate", { step: e.key === "ArrowDown" ? 1 : -1 })) : e.key === "Enter" && (e.preventDefault(), this.emit("submit", { value: this.value }));
		}), e.querySelector(".close").addEventListener("click", () => this.emit("close")), e.querySelector(".clear").addEventListener("click", () => {
			this.value = "", this.emit("input", { value: "" }), this.#e.focus();
		});
	}
	focus(e) {
		this.#e?.focus(e);
	}
	update(e) {
		let t = this.shadowRoot;
		if (this.#e.value !== this.value && (this.#e.value = this.value ?? ""), this.#e.placeholder = this.placeholder ?? "", this.#e.setAttribute("aria-label", this.label ?? ""), t.querySelector(".close").hidden = !this.showClose, t.querySelector(".clear").hidden = !this.showClear || !this.value, e.has("size") && (this.#e.classList.toggle("role-body", this.size !== "large" && this.size !== "medium"), this.#e.classList.toggle("role-body-xl", this.size === "medium"), this.#e.classList.toggle("role-heading-3", this.size === "large")), e.has("combobox") || e.has("expanded")) {
			if (this.combobox) this.#e.setAttribute("role", "combobox"), this.#e.setAttribute("aria-autocomplete", "list"), this.#e.setAttribute("aria-expanded", String(!!this.expanded));
			else for (let e of [
				"role",
				"aria-autocomplete",
				"aria-expanded"
			]) this.#e.removeAttribute(e);
		}
		e.has("activeLabel") && (t.querySelector(".active-live").textContent = this.activeLabel ?? ""), e.has("status") && (t.querySelector(".status-live").textContent = this.status ?? "");
	}
}).define();
//#endregion
//#region src/components/checkbox/checkbox.css?inline
var ta = ":host{vertical-align:middle;max-width:100%;display:inline-flex}.row{align-items:center;gap:var(--arq-space-gap-sm);max-width:100%;padding-block:var(--arq-space-gap-xs);cursor:pointer;-webkit-user-select:none;user-select:none;flex:1;display:inline-flex;position:relative}.control{width:var(--arq-icon-md);height:var(--arq-icon-md);flex:none;justify-content:center;align-items:center;display:inline-flex}.box{box-sizing:border-box;width:var(--arq-icon-sm);height:var(--arq-icon-sm);border:var(--arq-border-default) solid var(--arq-color-icon-tertiary);border-radius:var(--arq-radius-control);background:var(--arq-color-surface-transparent)}.label{min-width:0;color:var(--arq-color-text-secondary);flex:auto}.label,.count,.box{transition:color var(--arq-motion-duration-fast) var(--arq-motion-easing-standard), border-color var(--arq-motion-duration-fast) var(--arq-motion-easing-standard), background-color var(--arq-motion-duration-fast) var(--arq-motion-easing-standard)}.count{color:var(--arq-color-text-tertiary);font-variant-numeric:tabular-nums;flex:none;align-self:flex-start;margin-inline-start:auto}@media (hover:hover) and (pointer:fine){.row:hover .box{border-width:var(--arq-border-strong);border-color:var(--arq-color-border-strong)}.row:hover .label{color:var(--arq-color-text-primary)}.row:hover .count{color:var(--arq-color-text-secondary)}}.native:checked+.control .box{border-color:var(--arq-color-action-primary);background:var(--arq-color-action-primary)}@media (hover:hover) and (pointer:fine){.row:hover .native:checked+.control .box{border-color:var(--arq-color-action-primary-hover);background:var(--arq-color-action-primary-hover)}}:host([disabled]) .row{cursor:default}:host([disabled]) .box,:host([disabled]) .row:hover .box{border-width:var(--arq-border-default);border-color:var(--arq-color-icon-disabled)}:host([disabled]) .native:checked+.control .box{border-color:var(--arq-color-icon-disabled);background:var(--arq-color-icon-disabled)}:host([disabled]) .label,:host([disabled]) .row:hover .label,:host([disabled]) .count,:host([disabled]) .row:hover .count{color:var(--arq-color-text-disabled)}.native:focus-visible+.control .box{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}@media (forced-colors:active){.box,.row:hover .box{forced-color-adjust:none;border-color:canvastext}.native:checked+.control .box,.row:hover .native:checked+.control .box{background:highlight;border-color:highlight}:host([disabled]) .box,:host([disabled]) .native:checked+.control .box{border-color:graytext}:host([disabled]) .native:checked+.control .box{background:graytext}}", na = new Intl.NumberFormat("es-AR");
(class extends L {
	static tag = "arq-checkbox";
	static styles = ta;
	static formAssociated = !0;
	static properties = {
		size: {
			type: String,
			values: ["default", "large"],
			default: "default"
		},
		checked: { type: Boolean },
		disabled: { type: Boolean },
		showLabel: { type: Boolean },
		name: { type: String },
		value: {
			type: String,
			default: "on"
		},
		count: { type: Number }
	};
	static template = "<label class=\"row\"><input type=\"checkbox\" class=\"native visually-hidden\"><span class=\"control\" aria-hidden=\"true\"><span class=\"box\"></span></span><span class=\"label\"><slot></slot></span><span class=\"count\" hidden></span></label>";
	#e = this.attachInternals();
	#t = null;
	#n = !1;
	setup() {
		this.#n = this.checked, this.#t = this.shadowRoot.querySelector("input"), this.#t.addEventListener("change", () => {
			this.checked = this.#t.checked, this.emit("change", {
				checked: this.#t.checked,
				value: this.value
			});
		});
	}
	focus(e) {
		this.#t ? this.#t.focus(e) : super.focus(e);
	}
	update() {
		let e = this.#t;
		e.checked = this.checked, e.disabled = this.disabled, this.shadowRoot.querySelector(".label").classList.toggle("visually-hidden", !this.showLabel), this.shadowRoot.querySelector(".label").classList.toggle("role-body", this.size !== "large"), this.shadowRoot.querySelector(".label").classList.toggle("role-body-lg", this.size === "large");
		let t = this.shadowRoot.querySelector(".count");
		t.hidden = !this.showLabel || !Number.isFinite(this.count), t.textContent = Number.isFinite(this.count) ? na.format(this.count) : "", t.className = `count ${this.size === "large" ? "role-body-lg" : "role-body"}`, this.#e.setFormValue(this.checked ? this.value : null);
	}
	formResetCallback() {
		this.checked = this.#n;
	}
	formDisabledCallback(e) {
		this.#t.disabled = e || this.disabled;
	}
}).define();
//#endregion
//#region src/components/filter-row/filter-row.css?inline
var ra = ":host{min-width:0;display:block}.row{border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle)}.header{box-sizing:border-box;justify-content:space-between;align-items:center;gap:var(--arq-space-gap-md);width:100%;padding:var(--arq-space-padding-md) 0;background:var(--arq-color-surface-transparent);color:var(--arq-color-text-primary);font:inherit;text-align:start;cursor:pointer;-webkit-tap-highlight-color:var(--arq-color-surface-transparent);border:0;margin:0;display:flex}:host([open]) .header{padding-bottom:var(--arq-space-gap-md)}.label{overflow-wrap:break-word;min-width:0}.icon-box{padding:var(--arq-space-padding-xs);border-radius:var(--arq-radius-control);background:var(--arq-color-surface-transparent);color:var(--arq-color-icon-primary);flex:none;display:inline-flex}.icon{width:var(--arq-icon-md);height:var(--arq-icon-md)}:host(:not([open])) [data-icon=minus],:host([open]) [data-icon=plus]{display:none}.options{align-items:stretch;gap:calc(var(--arq-space-gap-sm-md) - 2 * var(--arq-space-padding-xs));padding-inline-end:var(--arq-space-padding-xs);padding-bottom:calc(var(--arq-space-padding-sm) + var(--arq-space-padding-md));flex-direction:column;display:flex}::slotted(arq-checkbox){margin-inline:calc(-1 * var(--arq-space-padding-sm-md));padding:var(--arq-space-padding-xs) var(--arq-space-padding-sm-md);background:var(--arq-color-surface-transparent);transition:background-color var(--arq-motion-duration-fast) var(--arq-motion-easing-standard)}@media (hover:hover) and (pointer:fine){::slotted(arq-checkbox:not([disabled]):hover){background:var(--arq-color-surface-faint)}.row:has(.header:hover){border-bottom-color:var(--arq-color-border-default)}.header:hover .icon-box{background:var(--arq-color-surface-hover)}}.row:has(.header:focus-visible){outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.header:focus{outline:none}";
(class extends L {
	static tag = "arq-filter-row";
	static styles = ra;
	static properties = { open: { type: Boolean } };
	static template = `<div class="row"><button type="button" class="header"><span class="label role-body-xl"><slot name="label"></slot></span><span class="icon-box">${R("plus")}${R("minus")}</span></button><div class="options" role="group" part="panel"><slot></slot></div></div>`;
	setup() {
		this.disclosure = new Li(this, {
			trigger: this.shadowRoot.querySelector(".header"),
			panel: this.shadowRoot.querySelector(".options")
		});
		let e = this.shadowRoot.querySelector(".options"), t = () => e.setAttribute("aria-label", this.querySelector("[slot=\"label\"]")?.textContent.trim() ?? "");
		this.shadowRoot.querySelector("slot[name=\"label\"]").addEventListener("slotchange", t), t();
	}
	get options() {
		return [...this.querySelectorAll(":scope > arq-checkbox")];
	}
}).define();
//#endregion
//#region src/components/tab/tab.css?inline
var ia = ":host{cursor:pointer;flex:none;display:inline-flex}.tab{padding-bottom:var(--arq-space-padding-sm-md);border-bottom:var(--arq-border-default) solid var(--arq-color-surface-transparent);color:var(--arq-color-text-secondary);white-space:nowrap;display:inline-flex}@media (hover:hover) and (pointer:fine){:host(:not([disabled]):hover) .tab{color:var(--arq-color-text-primary)}}:host([selected]) .tab{border-bottom-color:var(--arq-color-border-strong);color:var(--arq-color-text-primary)}:host([disabled]){cursor:default}:host([disabled]) .tab{color:var(--arq-color-text-disabled)}:host(:focus-visible){outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}:host(:focus:not(:focus-visible)){outline:none}";
(class extends L {
	static tag = "arq-tab";
	static styles = ia;
	static properties = {
		selected: { type: Boolean },
		disabled: { type: Boolean },
		value: { type: String }
	};
	static template = "<span class=\"tab role-body-regular\"><slot></slot></span>";
	setup() {
		this.selectable = new Gi(this, {
			role: "tab",
			state: "aria-selected"
		});
	}
	update() {
		let e = this.shadowRoot.querySelector(".tab");
		e.classList.toggle("role-body-regular", !this.selected), e.classList.toggle("role-body-medium", this.selected);
	}
}).define();
//#endregion
//#region src/base/single-select.js
var aa = ["ArrowRight", "ArrowDown"], oa = ["ArrowLeft", "ArrowUp"], sa = class {
	constructor(e, { items: t }) {
		this.host = e, this.selector = t, e.addEventListener("keydown", (e) => this.#t(e)), e.addEventListener("arq:change", (e) => this.#e(e)), new MutationObserver(() => this.refresh()).observe(e, {
			childList: !0,
			subtree: !0,
			attributes: !0,
			attributeFilter: ["selected", "disabled"]
		}), this.refresh();
	}
	get items() {
		return [...this.host.querySelectorAll(this.selector)];
	}
	get enabledItems() {
		return this.items.filter((e) => !e.disabled);
	}
	get selected() {
		return this.items.find((e) => e.selected) ?? null;
	}
	refresh() {
		let e = this.enabledItems, t = this.selected && !this.selected.disabled ? this.selected : e[0];
		for (let e of this.items) e.type !== "value" && e.setAttribute("tabindex", e === t ? "0" : "-1");
	}
	#e(e) {
		let t = e.target;
		if (this.items.includes(t) && t.selected) {
			for (let e of this.items) e !== t && e.selected && (e.selected = !1);
			this.refresh();
		}
	}
	#t(e) {
		let t = this.enabledItems, n = t.indexOf(e.target);
		if (n === -1) return;
		let r = null;
		aa.includes(e.key) ? r = t[(n + 1) % t.length] : oa.includes(e.key) ? r = t[(n - 1 + t.length) % t.length] : e.key === "Home" ? r = t[0] : e.key === "End" && (r = t[t.length - 1]), r && (e.preventDefault(), r.focus(), r.choose?.());
	}
}, ca = {
	ArrowDown: 1,
	ArrowUp: -1,
	PageDown: 1,
	PageUp: -1,
	End: 1,
	Home: -1,
	" ": 1
};
function la(e, t, n) {
	for (let r of e.composedPath()) {
		if (!(r instanceof Element)) continue;
		let { overflowY: e } = getComputedStyle(r);
		if ((e === "auto" || e === "scroll") && r.scrollHeight > r.clientHeight && (n < 0 ? r.scrollTop > 0 : Math.ceil(r.scrollTop + r.clientHeight) < r.scrollHeight)) return !0;
		if (r === t) break;
	}
	return !1;
}
var ua = (e) => e.composedPath().some((e) => e instanceof Element && (e.matches("input, textarea, select, [contenteditable=\"\"], [contenteditable=\"true\"]") || e.getAttribute("role") === "combobox"));
function z(e, { when: t = () => !0 } = {}) {
	e.addEventListener("wheel", (n) => {
		t() && n.deltaY && !la(n, e, n.deltaY) && n.preventDefault();
	}, { passive: !1 });
	let n = 0, r = 0;
	e.addEventListener("touchstart", (e) => {
		n = e.touches[0].clientX, r = e.touches[0].clientY;
	}, { passive: !0 }), e.addEventListener("touchmove", (i) => {
		if (i.touches.length > 1) return;
		let a = n - i.touches[0].clientX, o = r - i.touches[0].clientY;
		Math.abs(a) > Math.abs(o) || t() && o && !la(i, e, o) && i.preventDefault();
	}, { passive: !1 }), e.addEventListener("keydown", (n) => {
		let r = ca[n.key];
		!t() || !r || n.altKey || n.ctrlKey || n.metaKey || ua(n) || n.key === " " && n.composedPath().some((e) => e instanceof Element && e.matches("button, a[href], [role=\"button\"]")) || la(n, e, r) || n.preventDefault();
	});
}
//#endregion
//#region src/base/theme.js
var da = /* @__PURE__ */ new Set(), fa = null;
function pa(e) {
	if (e.assignedSlot) return e.assignedSlot;
	if (e.parentElement) return e.parentElement;
	let t = e.parentNode;
	return t instanceof ShadowRoot ? t.host : null;
}
function ma(e, t) {
	for (let n = e; n; n = pa(n)) {
		if (t !== void 0 && n === document.documentElement) return t;
		if (n.hasAttribute?.("data-arq-theme")) return n.getAttribute("data-arq-theme") === "dark";
	}
	return t ?? !1;
}
function ha() {
	ga();
}
function ga(e) {
	typeof e != "boolean" && (e = void 0);
	for (let t of da) {
		let n = t.ref.deref();
		if (!n) {
			da.delete(t);
			continue;
		}
		if (!n.isConnected) continue;
		let r = ma(n, e);
		r !== t.dark && (t.dark = r, n[t.method](r));
	}
}
function _a(e, t) {
	let n = {
		ref: new WeakRef(e),
		dark: ma(e),
		method: t
	};
	da.add(n), fa || (fa = new MutationObserver(ga), fa.observe(document.documentElement, {
		attributes: !0,
		subtree: !0,
		attributeFilter: ["data-arq-theme"]
	})), e[t](n.dark);
}
var B = [
	"--arq-theme-text-delay",
	"--arq-theme-text-duration",
	"--arq-theme-text-easing",
	"--arq-theme-bg-duration",
	"--arq-theme-bg-easing",
	"--arq-theme-surface-duration",
	"--arq-theme-surface-easing"
], va = 0, ya = [
	"--arq-illumination-bg-duration",
	"--arq-illumination-image-duration",
	"--arq-theme-bg-duration",
	"--arq-theme-text-duration",
	"--arq-theme-text-delay",
	"--arq-theme-surface-duration",
	"--arq-card-ground-duration"
];
function ba(e) {
	let t = document.documentElement.style;
	for (let e of ya) t.setProperty(e, "0s");
	e(), requestAnimationFrame(() => requestAnimationFrame(() => ya.forEach((e) => t.removeProperty(e))));
}
var xa = "data-arq-theme-color", Sa = "data-arq-theme-color-added";
function Ca(e, t = document.documentElement) {
	let n = [...document.head.querySelectorAll("meta[name=\"theme-color\"]")];
	if (!e) {
		for (let e of n) e.hasAttribute(Sa) ? e.remove() : e.hasAttribute(xa) && (e.content = e.getAttribute(xa), e.removeAttribute(xa));
		return;
	}
	let r = getComputedStyle(t).getPropertyValue("--arq-color-surface-default").trim();
	if (r) {
		if (!n.length) {
			let e = document.createElement("meta");
			e.name = "theme-color", e.setAttribute(Sa, ""), document.head.append(e), n.push(e);
		}
		for (let e of n) !e.hasAttribute(Sa) && !e.hasAttribute(xa) && e.setAttribute(xa, e.content), e.content = r;
	}
}
var wa = "data-arq-theme-color-lit", Ta = matchMedia("(max-width: 767px)");
function V(e, t) {
	let n = [...document.head.querySelectorAll(`meta[name="theme-color"][${xa}], meta[name="theme-color"][${Sa}]`)];
	if (!n.length) return;
	if (!e) {
		for (let e of n) e.hasAttribute(wa) && (e.content = e.getAttribute(wa), e.removeAttribute(wa));
		return;
	}
	if (!Ta.matches) return;
	let r = getComputedStyle(t).getPropertyValue("--arq-color-surface-default").trim();
	if (r) for (let e of n) e.hasAttribute(wa) || e.setAttribute(wa, e.content), e.content = r;
}
var Ea = "arq:iluminar-handoff", Da = 1e4;
function Oa(e) {
	try {
		e ? sessionStorage.setItem(Ea, String(Date.now())) : sessionStorage.removeItem(Ea);
	} catch {}
}
function ka() {
	try {
		let e = Number(sessionStorage.getItem(Ea));
		return sessionStorage.removeItem(Ea), !!e && Date.now() - e < Da;
	} catch {
		return !1;
	}
}
function Aa(e = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--arq-illumination-bg-duration")) || 0, t = [document.documentElement]) {
	let n = t.map((e) => e.style), r = {
		setProperty: (e, t) => n.forEach((n) => n.setProperty(e, t)),
		removeProperty: (e) => n.forEach((t) => t.removeProperty(e))
	};
	if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
		let e = "var(--arq-motion-duration-fade)";
		r.setProperty(B[0], "0s"), r.setProperty(B[1], e), r.setProperty(B[2], "var(--arq-motion-easing-standard)"), r.setProperty(B[3], e), r.setProperty(B[4], "var(--arq-motion-easing-standard)"), r.setProperty(B[5], e), r.setProperty(B[6], "var(--arq-motion-easing-standard)"), clearTimeout(va), va = setTimeout(() => B.forEach((e) => r.removeProperty(e)), 1e3);
		return;
	}
	r.setProperty(B[0], `${Math.round(e * .25)}ms`), r.setProperty(B[1], `${Math.round(e * .5)}ms`), r.setProperty(B[2], "cubic-bezier(0.4, 0, 0.2, 1)"), r.setProperty(B[3], "var(--arq-illumination-bg-duration)"), r.setProperty(B[4], "var(--arq-illumination-bg-easing)"), r.setProperty(B[5], "var(--arq-illumination-bg-duration)"), r.setProperty(B[6], "var(--arq-illumination-bg-easing)"), clearTimeout(va), va = setTimeout(() => B.forEach((e) => r.removeProperty(e)), e + 100);
}
var ja = 400, Ma = 150, Na = /* @__PURE__ */ new Set(), Pa = 0, Fa = (e) => new Promise((t) => setTimeout(t, e));
function Ia(e) {
	return !e.getAttribute("src") || e.complete ? Promise.resolve() : Promise.race([e.decode().catch(() => {}), Fa(ja)]);
}
function La(e) {
	if (!e.getAttribute("src") || e.complete) return;
	let t = e.getBoundingClientRect();
	if (t.bottom < 0 || t.top > innerHeight) return;
	let n = Ia(e).finally(() => Na.delete(n));
	Na.add(n);
}
function Ra(e, t, n) {
	let r = document.documentElement;
	for (let e of document.getAnimations()) e.effect?.pseudoElement?.startsWith("::view-transition") && e.cancel();
	let i = 2 * Math.hypot(Math.max(e.x, innerWidth - e.x), Math.max(e.y, innerHeight - e.y)) / .4, a = (t) => `${e.x - t / 2}px ${e.y - t / 2}px`, o = "radial-gradient(closest-side, #000 40%, transparent 100%)", s = {
		duration: t,
		easing: n,
		fill: "both"
	};
	r.animate({
		maskImage: [o, o],
		maskRepeat: ["no-repeat", "no-repeat"],
		maskSize: ["0px 0px", `${i}px ${i}px`],
		maskPosition: [a(0), a(i)],
		mixBlendMode: ["normal", "normal"]
	}, {
		...s,
		pseudoElement: "::view-transition-new(root)"
	}), r.animate({ mixBlendMode: ["normal", "normal"] }, {
		...s,
		pseudoElement: "::view-transition-old(root)"
	});
}
async function za(e, t, n) {
	let r = document.documentElement, i = getComputedStyle(r), a = Number.parseFloat(i.getPropertyValue("--arq-illumination-bg-duration")) || 0;
	if (!document.startViewTransition || !a) {
		Aa(), t();
		return;
	}
	let o = i.getPropertyValue("--arq-illumination-bg-easing").trim() || "ease", s = r.style, c = ++Pa, l = a, u = matchMedia("(prefers-reduced-motion: reduce)").matches, d = !u && n && i.getPropertyValue("--arq-illumination-style").trim() === "spread";
	if (!u) {
		let t = Number.parseFloat(i.getPropertyValue("--arq-illumination-lead")) || 0;
		if (ga(e), await Promise.race([Promise.all(Na), Fa(Ma)]), await Fa(t), c !== Pa) return;
		l = Math.max(a - t, 0);
	}
	let f = document.startViewTransition(async () => {
		for (let e of ya) s.setProperty(e, "0s");
		t(), await Promise.resolve(), await Promise.race([Promise.all(Na), Fa(Ma)]);
	});
	f.ready.then(() => {
		if (d) return Ra(n, l, o);
		for (let e of document.getAnimations()) e.effect?.pseudoElement?.startsWith("::view-transition") && e.effect.updateTiming({
			duration: l,
			easing: o
		});
	}).catch(() => {}), f.finished.finally(() => {
		c === Pa && ya.forEach((e) => s.removeProperty(e));
	});
}
//#endregion
//#region src/components/filter-panel/filter-panel.css?inline
var Ba = ":host{--panel-slow:var(--arq-motion-duration-panel);display:contents}.dialog:not(.is-open){--panel-slow:var(--arq-motion-duration-expand)}.dialog{box-sizing:border-box;width:var(--arq-layout-filter-panel);border:var(--arq-border-default) solid var(--arq-color-border-default);border-radius:var(--arq-radius-control);background:var(--arq-color-surface-default);max-width:100%;height:100dvh;max-height:none;color:var(--arq-color-text-primary);clip-path:inset(0 0 0 100%);transition:clip-path var(--panel-slow) var(--arq-motion-easing-standard);margin:0;padding:0;inset:0 0 0 auto;overflow:clip}.dialog.is-open{clip-path:inset(0)}.dialog:not(.is-open){pointer-events:none}.dialog::backdrop{background:var(--arq-color-overlay-scrim);opacity:0;transition:opacity var(--panel-slow) var(--arq-motion-easing-standard)}.dialog.is-open::backdrop{opacity:1}.sheet{opacity:0;transition:opacity var(--arq-motion-duration-slow) var(--arq-motion-easing-standard)}.dialog.is-open .sheet{opacity:1}.sheet{--sheet-inline:var(--arq-space-padding-xl-2xl);box-sizing:border-box;gap:var(--arq-space-gap-lg);height:100%;padding:var(--arq-space-padding-xl-2xl) var(--sheet-inline);flex-direction:column;display:flex}.header{justify-content:space-between;align-items:center;gap:var(--arq-space-gap-md);display:flex}.titles{gap:var(--arq-space-gap-xs);flex-direction:column;min-width:0;display:flex}.title{color:var(--arq-color-text-primary)}.summary{color:var(--arq-color-text-secondary);margin:0}.applied{gap:var(--arq-space-gap-sm);flex-wrap:wrap;display:flex}.tabs{display:none}.body{min-height:0;margin:calc(-1 * var(--arq-space-padding-xs));margin-inline:calc(-1 * var(--arq-space-padding-sm-md)) calc(-1 * var(--sheet-inline));padding:var(--arq-space-padding-xs);padding-inline:var(--arq-space-padding-sm-md) var(--sheet-inline);overscroll-behavior:contain;flex:auto;overflow-y:auto}.footer{justify-content:space-between;align-items:center;gap:var(--arq-space-gap-lg);display:flex}@media (width<=767px){.dialog{border:0;width:100%;inset:0}.dialog::backdrop{background:var(--arq-color-surface-transparent)}.sheet{--sheet-inline:var(--arq-layout-gutter);gap:var(--arq-space-gap-xl);padding:var(--arq-space-padding-lg) var(--sheet-inline) calc(var(--arq-space-padding-lg) + env(safe-area-inset-bottom,var(--arq-space-0)))}.footer{justify-content:flex-start}.apply{flex:auto}}@media (width<=1023px){:host([show-categories]) .tabs{gap:var(--arq-space-gap-xl);border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle);flex:none;display:flex;overflow-x:auto}.categories-panel{min-width:0}}@media (prefers-reduced-motion:reduce){.dialog{clip-path:none;opacity:0;transition:opacity var(--arq-motion-duration-fade) var(--arq-motion-easing-out)}.dialog.is-open{opacity:1}.dialog::backdrop,.sheet{transition:opacity var(--arq-motion-duration-fade) var(--arq-motion-easing-out)}}", Va = {
	productos: ["producto", "productos"],
	variantes: ["variante", "variantes"]
}, Ha = new Intl.NumberFormat("es-AR");
(class extends L {
	static tag = "arq-filter-panel";
	static styles = Ba;
	static properties = {
		open: { type: Boolean },
		count: { type: Number },
		unit: {
			type: String,
			values: ["productos", "variantes"],
			default: "productos"
		},
		showCategories: { type: Boolean }
	};
	static template = "<dialog class=\"dialog\" data-arq-theme=\"light\"><div class=\"sheet\"><div class=\"header\"><div class=\"titles\"><div class=\"title role-heading-1\"><slot name=\"title\"></slot></div><p class=\"summary role-body\" hidden></p></div><arq-icon-button icon=\"close\" size=\"large\" class=\"close\">Cerrar filtros</arq-icon-button></div><div class=\"applied\" hidden></div><div class=\"tabs\" role=\"tablist\" aria-label=\"Tipo de filtro\"><arq-tab value=\"features\" id=\"features-tab\" aria-controls=\"features-panel\" selected>Características</arq-tab><arq-tab value=\"categories\" id=\"categories-tab\" aria-controls=\"categories-panel\">Categorías</arq-tab></div><div class=\"body\"><div class=\"features-panel\" id=\"features-panel\" role=\"tabpanel\" aria-labelledby=\"features-tab\"><slot></slot></div><div class=\"categories-panel\" id=\"categories-panel\" role=\"tabpanel\" aria-labelledby=\"categories-tab\" hidden><slot name=\"categories\"></slot></div></div><div class=\"footer\"><arq-button type=\"underline\" show-underline class=\"clear\">Limpiar filtros</arq-button><arq-button class=\"apply\"></arq-button></div></div></dialog>";
	#e = null;
	#t = null;
	#n = null;
	#r = null;
	setup() {
		let e = this.shadowRoot;
		this.#e = e.querySelector("dialog"), z(this.#e), this.#e.addEventListener("close", () => V(!1)), e.querySelector(".close").addEventListener("click", () => this.close()), e.querySelector(".clear").addEventListener("click", () => this.clear()), e.querySelector(".apply").addEventListener("click", () => this.apply()), new sa(e.querySelector(".tabs"), { items: "arq-tab" }), e.querySelector(".tabs").addEventListener("arq:change", (e) => {
			this.#a(e.detail.value);
		}), this.addEventListener("arq:toggle", (e) => {
			let t = e.target;
			if (t.localName === "arq-catalog-nav-group" && e.detail.open && t.closest("[slot=\"categories\"]")) for (let e of this.querySelectorAll("[slot=\"categories\"] arq-catalog-nav-group")) e.open = e === t;
		}), this.#e.addEventListener("click", (e) => {
			e.target === this.#e && this.close();
		}), this.#e.addEventListener("cancel", (e) => {
			e.preventDefault(), this.close();
		}), e.querySelector(".applied").addEventListener("click", (e) => {
			let t = e.target.closest("arq-filter-chip");
			t && this.#p(t);
		}), this.addEventListener("arq:change", (e) => {
			e.target.localName === "arq-checkbox" && this.#l();
		}), e.querySelector("slot[name=\"title\"]").addEventListener("slotchange", () => this.#c()), this.#c(), this.#d();
	}
	update(e) {
		e.has("open") && (this.open && (!this.#e.open || this.#r) && this.#i(), !this.open && this.#e.open && this.#o()), (e.has("count") || e.has("unit")) && this.#f(), e.has("showCategories") && this.#a("features");
	}
	get options() {
		return [...this.querySelectorAll("arq-filter-row > arq-checkbox")];
	}
	get filters() {
		let e = {};
		for (let t of this.options) {
			if (!t.checked) continue;
			let n = t.getAttribute("name") ?? "";
			(e[n] ??= []).push(t.value);
		}
		return e;
	}
	show(e) {
		this.#n = e ?? this.#s(), this.open = !0;
	}
	close() {
		let e = this.#t;
		if (this.#t = null, e && [...e].some(([e, t]) => e.checked !== t)) {
			for (let [t, n] of e) t.checked = n;
			this.#l();
		} else this.#d();
		this.open = !1;
	}
	apply() {
		this.#t = null, this.emit("apply", { filters: this.filters }), this.open = !1;
	}
	showAvailable(e) {
		for (let t of this.querySelectorAll("arq-filter-row")) {
			let n = [...t.querySelectorAll(":scope > arq-checkbox")];
			for (let t of n) t.hidden = !t.checked && !e(t);
			let r = n.filter((e) => !e.hidden);
			t.hidden = r.length < 2 && !r.some((e) => e.checked);
		}
	}
	clear() {
		for (let e of this.options) e.checked = !1;
		this.#l(), this.#t &&= new Map(this.options.map((e) => [e, !1])), this.emit("apply", { filters: this.filters });
	}
	#i() {
		this.#t = new Map(this.options.map((e) => [e, e.checked])), this.#a("features"), this.#d(), clearTimeout(this.#r), this.#r = null, this.#e.open || (this.#e.showModal(), V(!0, this.#e), this.#e.offsetHeight), this.#e.classList.add("is-open");
	}
	#a(e) {
		let t = this.showCategories && e === "categories", n = this.shadowRoot;
		n.querySelector("#features-tab").selected = !t, n.querySelector("#categories-tab").selected = t, n.querySelector(".features-panel").hidden = t, n.querySelector(".categories-panel").hidden = !t, n.querySelector(".summary").hidden = t || this.#u().length === 0, n.querySelector(".applied").hidden = t || this.#u().length === 0, n.querySelector(".footer").hidden = t;
	}
	#o() {
		this.#t && this.close();
		let e = this.#e;
		if (this.#r) return;
		e.classList.remove("is-open");
		let { transitionDuration: t } = getComputedStyle(e), n = Math.max(0, ...t.split(",").map((e) => (parseFloat(e) || 0) * (e.trim().endsWith("ms") ? 1 : 1e3)));
		this.#r = setTimeout(() => {
			this.#r = null, e.close(), this.#n?.focus?.(), this.#n = null;
		}, n);
	}
	#s() {
		let e = document.activeElement;
		for (; e?.shadowRoot?.activeElement;) e = e.shadowRoot.activeElement;
		let t = e?.getRootNode?.();
		return t instanceof ShadowRoot ? t.host : e;
	}
	#c() {
		let e = this.querySelector("[slot=\"title\"]")?.textContent.trim();
		this.#e.setAttribute("aria-label", e || "Filtrar");
	}
	#l() {
		this.#d(), this.emit("filters", { filters: this.filters });
	}
	#u() {
		return this.options.filter((e) => e.checked);
	}
	#d() {
		let e = this.#u(), t = this.shadowRoot, n = t.querySelector(".summary");
		n.hidden = e.length === 0 || t.querySelector("#categories-tab").selected, n.textContent = `${e.length} ${e.length === 1 ? "filtro activo" : "filtros activos"}`;
		let r = t.querySelector(".applied");
		for (r.hidden = e.length === 0 || t.querySelector("#categories-tab").selected; r.children.length > e.length;) r.lastElementChild.remove();
		for (; r.children.length < e.length;) r.append(document.createElement("arq-filter-chip"));
		e.forEach((e, t) => {
			let n = r.children[t];
			n.textContent = e.textContent.trim(), n.option = e;
		});
		let i = t.querySelector(".clear"), a = t.activeElement === i;
		i.disabled = e.length === 0, a && i.disabled && t.querySelector(".apply").focus(), this.#f();
	}
	#f() {
		let e = this.shadowRoot.querySelector(".apply");
		if (!e) return;
		let [t, n] = Va[this.unit] ?? Va.productos;
		e.textContent = Number.isFinite(this.count) ? `Ver ${Ha.format(this.count)} ${this.count === 1 ? t : n}` : `Ver ${n}`;
	}
	#p(e) {
		let t = [...this.shadowRoot.querySelectorAll(".applied arq-filter-chip")].indexOf(e);
		e.option.checked = !1, this.#l();
		let n = [...this.shadowRoot.querySelectorAll(".applied arq-filter-chip")];
		(n[t] ?? n[t - 1] ?? this.shadowRoot.querySelector(".close")).focus();
	}
}).define();
//#endregion
//#region src/components/carousel-button/carousel-button.css?inline
var Ua = ":host{vertical-align:middle;color:var(--arq-color-icon-primary);--blur:var(--arq-blur-backdrop);flex:none;display:inline-flex}.control{box-sizing:border-box;width:var(--arq-layout-carousel-button);height:var(--arq-layout-carousel-button);border:var(--arq-border-default) solid var(--arq-color-border-disabled);border-radius:var(--arq-radius-control);background:var(--arq-color-surface-default);color:inherit;cursor:pointer;-webkit-tap-highlight-color:var(--arq-color-surface-transparent);justify-content:center;align-items:center;margin:0;padding:0;display:inline-flex}.glyph{display:inline-flex}.icon{width:var(--arq-icon-md);height:var(--arq-icon-md)}.control:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.control:focus:not(:focus-visible){outline:none}@media (hover:hover) and (pointer:fine){.control:enabled:hover{background:var(--arq-color-surface-hover)}}.control:enabled:active{background:var(--arq-color-surface-selected)}:host([disabled]){color:var(--arq-color-icon-disabled)}:host([disabled]) .control{background:var(--arq-color-surface-transparent);cursor:default}:host([background=frosted]){--blur:var(--arq-blur-backdrop-soft)}:host([background=frosted]) .control{border-color:var(--arq-color-border-subtle);background:var(--arq-color-overlay-frosted);-webkit-backdrop-filter:blur(var(--blur));backdrop-filter:blur(var(--blur))}:host([background=frosted]) .control:enabled:active{border-color:var(--arq-color-border-default);background:var(--arq-color-overlay-frosted)}@media (hover:hover) and (pointer:fine){:host([background=frosted]) .control:enabled:hover{border-color:var(--arq-color-border-default);background:var(--arq-color-overlay-frosted)}}:host([background=frosted][disabled]) .control{background:var(--arq-color-overlay-frosted)}:host([background=frosted]) .icon{width:var(--arq-icon-xl);height:var(--arq-icon-xl)}";
(class extends L {
	static tag = "arq-carousel-button";
	static styles = Ua;
	static properties = {
		direction: {
			type: String,
			values: ["previous", "next"],
			default: "previous"
		},
		background: {
			type: String,
			values: ["outline", "frosted"],
			default: "outline"
		},
		disabled: { type: Boolean }
	};
	static template = "<button type=\"button\" class=\"control\"><span class=\"glyph\"></span><span class=\"visually-hidden\"><slot></slot></span></button>";
	#e = null;
	setup() {
		this.#e = this.shadowRoot.querySelector(".control"), this.addEventListener("click", (e) => {
			this.disabled && (e.preventDefault(), e.stopImmediatePropagation());
		}, { capture: !0 });
	}
	focus(e) {
		this.#e ? this.#e.focus(e) : super.focus(e);
	}
	update(e) {
		if (e.has("direction") || e.size === 0) {
			let e = this.direction === "next" ? "chevron-right" : "chevron-left";
			this.shadowRoot.querySelector(".glyph").innerHTML = R(e);
		}
		this.#e.disabled = this.disabled;
	}
}).define();
//#endregion
//#region src/components/carousel-controls/carousel-controls.css?inline
var Wa = ":host{display:inline-flex}.controls,.arrows{align-items:center;gap:var(--arq-space-gap-sm);display:flex}:host([buttons=carousel]) .controls,:host([buttons=chevron]) .controls{gap:var(--arq-space-gap-lg)}.count{color:var(--arq-color-text-secondary);margin:0}.progress{width:var(--arq-space-gap-5xl);height:var(--arq-border-strong);flex:none;position:relative}.track{height:var(--arq-border-default);background:var(--arq-color-text-secondary);opacity:var(--arq-opacity-track);position:absolute;top:50%;left:0;right:0;transform:translateY(-50%)}.indicator{height:100%;width:calc(100% / var(--progress-count,1));background:var(--arq-color-text-primary);transform:translateX(calc(var(--progress-index,0) * 100%));transition:transform var(--arq-motion-duration-base) var(--arq-motion-easing-standard);position:absolute;top:0;left:0}:host([buttons=none]){width:100%;display:flex}:host([buttons=none]) .controls,:host([buttons=none]) .progress{width:100%}.progress[data-mode=scroll] .indicator{width:calc(100% * var(--progress-size,1));transform:translateX(calc(var(--progress-offset,0) / var(--progress-size,1) * 100%));transition:none}:host([buttons=none]) .progress.scrub{flex:1;width:auto;min-width:0}.progress.scrub{--thick:var(--arq-space-padding-xs);height:var(--arq-space-padding-sm-md);cursor:grab;touch-action:none}.progress.scrub.dragging{cursor:grabbing;-webkit-user-select:none;user-select:none}.progress.scrub .track{height:var(--thick);background:var(--arq-color-surface-subtle);opacity:1;transition:height var(--arq-motion-duration-base) var(--arq-motion-easing-standard)}.progress.scrub .indicator{top:calc(50% - var(--thick) / 2);height:var(--thick);background:var(--arq-color-border-hover);transition:top var(--arq-motion-duration-base) var(--arq-motion-easing-standard), height var(--arq-motion-duration-base) var(--arq-motion-easing-standard), background-color var(--arq-motion-duration-base) var(--arq-motion-easing-standard)}.progress.scrub.dragging{--thick:calc(var(--arq-space-padding-xs) + var(--arq-border-strong))}.progress.scrub.dragging .indicator{background:var(--arq-color-text-tertiary)}@media (hover:hover) and (pointer:fine){.progress.scrub:hover{--thick:calc(var(--arq-space-padding-xs) + var(--arq-border-strong))}.progress.scrub:hover .indicator{background:var(--arq-color-text-tertiary)}}:host([orientation=vertical]){width:auto;height:100%;display:flex}:host([orientation=vertical]) .controls{flex-direction:column;width:auto;height:100%}:host([orientation=vertical]) .progress.scrub{width:var(--arq-space-padding-sm-md);flex:1;height:auto;min-height:0}:host([orientation=vertical]) .progress.scrub .track{width:var(--thick);height:auto;transition:width var(--arq-motion-duration-base) var(--arq-motion-easing-standard);inset:0 auto 0 50%;transform:translate(-50%)}:host([orientation=vertical]) .progress.scrub .indicator{top:0;left:calc(50% - var(--thick) / 2);width:var(--thick);height:calc(100% * var(--progress-size,1));transform:translateY(calc(var(--progress-offset,0) / var(--progress-size,1) * 100%));transition:left var(--arq-motion-duration-base) var(--arq-motion-easing-standard), width var(--arq-motion-duration-base) var(--arq-motion-easing-standard), background-color var(--arq-motion-duration-base) var(--arq-motion-easing-standard)}@media (prefers-reduced-motion:reduce){.indicator{transition:none}}@media (width<=767px){:host{display:none}}", Ga = [
	"start",
	"middle",
	"end"
];
function Ka(e) {
	let t = String(e).match(/cubic-bezier\(\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*\)/), [n, r, i, a] = t ? t.slice(1).map(Number) : [
		.42,
		0,
		.58,
		1
	], o = 3 * n, s = 3 * (i - n) - o, c = 1 - o - s, l = 3 * r, u = 3 * (a - r) - l, d = 1 - l - u, f = (e) => ((c * e + s) * e + o) * e, p = (e) => ((d * e + u) * e + l) * e, m = (e) => (3 * c * e + 2 * s) * e + o;
	return (e) => {
		let t = e;
		for (let n = 0; n < 6; n += 1) {
			let n = m(t);
			if (Math.abs(n) < 1e-6) break;
			t -= (f(t) - e) / n;
		}
		return p(Math.min(1, Math.max(0, t)));
	};
}
(class extends L {
	static tag = "arq-carousel-controls";
	static styles = Wa;
	static properties = {
		position: {
			type: String,
			values: Ga,
			default: "start"
		},
		for: { type: String },
		step: {
			type: String,
			values: ["page", "item"],
			default: "page"
		},
		labelPrev: {
			type: String,
			default: "Anterior"
		},
		labelNext: {
			type: String,
			default: "Siguiente"
		},
		buttons: {
			type: String,
			values: [
				"icon",
				"carousel",
				"chevron",
				"none"
			],
			default: "icon"
		},
		progress: {
			type: String,
			values: ["slides", "scroll"],
			default: "slides"
		},
		pageInset: {
			type: Number,
			default: 0
		},
		scrub: {
			type: Boolean,
			default: !1
		},
		slide: {
			type: String,
			values: ["native", "slow"],
			default: "native"
		},
		orientation: {
			type: String,
			values: ["horizontal", "vertical"],
			default: "horizontal"
		},
		index: {
			type: Number,
			default: 0
		},
		count: {
			type: Number,
			default: 1
		}
	};
	static template = "<div class=\"controls\" role=\"group\"><p class=\"count role-caption\" hidden></p><arq-icon-button class=\"prev edge\" icon=\"chevron-left\" hidden></arq-icon-button><div class=\"progress\" hidden><span class=\"track\"></span><span class=\"indicator\"></span></div><arq-icon-button class=\"next edge\" icon=\"chevron-right\" hidden></arq-icon-button><div class=\"arrows\"><arq-icon-button class=\"prev icon\" size=\"large\" icon=\"arrow-left\"></arq-icon-button><arq-carousel-button class=\"prev square\" direction=\"previous\" hidden></arq-carousel-button><arq-icon-button class=\"next icon\" size=\"large\" icon=\"arrow-right\"></arq-icon-button><arq-carousel-button class=\"next square\" direction=\"next\" hidden></arq-carousel-button><arq-icon-button class=\"prev chevron\" size=\"large\" icon=\"chevron-left\" hidden></arq-icon-button><arq-icon-button class=\"next chevron\" size=\"large\" icon=\"chevron-right\" hidden></arq-icon-button></div></div>";
	#e = null;
	#t = !1;
	#n = !0;
	#r = "";
	#i = () => this.#g();
	#a = new ResizeObserver(() => this.#g());
	#o = new MutationObserver(() => this.#h());
	#s = window.matchMedia("(prefers-reduced-motion: reduce)");
	#c = null;
	setup() {
		let e = this.shadowRoot;
		for (let t of e.querySelectorAll(".prev")) t.addEventListener("click", () => this.#b(-1));
		for (let t of e.querySelectorAll(".next")) t.addEventListener("click", () => this.#b(1));
		e.querySelector(".progress").addEventListener("pointerdown", (e) => this.#l(e));
	}
	#l(e) {
		let t = this.#e, n = e.currentTarget;
		if (!this.scrub || this.progress !== "scroll" || !t || e.button > 0) return;
		let r = n.getBoundingClientRect(), i = n.querySelector(".indicator").getBoundingClientRect(), a = this.#u(), o = (e) => a.vertical ? e.clientY : e.clientX, s = a.vertical ? "top" : "left", c = a.vertical ? "bottom" : "right", l = a.vertical ? "height" : "width", u = o(e) >= i[s] && o(e) <= i[c] ? o(e) - i[s] : i[l] / 2, d = (e) => {
			let n = Math.min(Math.max(e - r[s] - u, 0), r[l] - i[l]);
			t[a.scroll] = n / r[l] * t[a.scrollSize];
		};
		e.preventDefault(), n.setPointerCapture(e.pointerId), n.classList.add("dragging"), d(o(e));
		let f = (e) => d(o(e)), p = () => {
			n.classList.remove("dragging"), n.removeEventListener("pointermove", f), n.removeEventListener("pointerup", p), n.removeEventListener("pointercancel", p);
		};
		n.addEventListener("pointermove", f), n.addEventListener("pointerup", p), n.addEventListener("pointercancel", p);
	}
	#u() {
		let e = this.orientation === "vertical";
		return e ? {
			vertical: e,
			scroll: "scrollTop",
			scrollSize: "scrollHeight",
			clientSize: "clientHeight"
		} : {
			vertical: e,
			scroll: "scrollLeft",
			scrollSize: "scrollWidth",
			clientSize: "clientWidth"
		};
	}
	#d() {
		let e = {
			carousel: "square",
			chevron: "chevron"
		}[this.buttons] ?? "icon", t = this.shadowRoot;
		return {
			prev: t.querySelector(`.prev.${e}`),
			next: t.querySelector(`.next.${e}`)
		};
	}
	connectedCallback() {
		super.connectedCallback(), this.#e && !this.#t && this.#p(this.#e);
	}
	disconnectedCallback() {
		this.#m();
	}
	update(e) {
		let t = this.shadowRoot;
		for (let e of [
			"icon",
			"square",
			"chevron"
		]) {
			let n = this.buttons !== "none" && (this.buttons === "carousel" ? "square" : this.buttons === "chevron" ? "chevron" : "icon") === e;
			for (let r of t.querySelectorAll(`.${e}`)) r.hidden = !n;
		}
		let { prev: n, next: r } = this.#d();
		if (e.has("labelPrev") || e.has("buttons")) for (let e of t.querySelectorAll(".prev")) e.textContent = this.labelPrev;
		if (e.has("labelNext") || e.has("buttons")) for (let e of t.querySelectorAll(".next")) e.textContent = this.labelNext;
		t.querySelector(".controls").setAttribute("aria-label", `${this.labelPrev} / ${this.labelNext}`);
		let i = this.scrub && this.progress === "scroll";
		for (let e of t.querySelectorAll(".edge")) e.hidden = !i;
		if (e.has("orientation")) {
			let e = this.orientation === "vertical";
			t.querySelector(".edge.prev").setAttribute("icon", e ? "chevron-up" : "chevron-left"), t.querySelector(".edge.next").setAttribute("icon", e ? "chevron-down" : "chevron-right");
		}
		t.querySelector(".edge.prev").disabled = this.position === "start", t.querySelector(".edge.next").disabled = this.position === "end" || !this.#n, this.#v(), e.has("for") && this.#f();
		let a = t.activeElement;
		n.disabled = this.position === "start", r.disabled = this.position === "end" || !this.#n, a === n && n.disabled && r.focus(), a === r && r.disabled && n.focus();
	}
	#f() {
		this.#m();
		let e = this.for ? this.getRootNode().getElementById?.(this.for) : null;
		this.for && !e && document.readyState === "loading" && document.addEventListener("DOMContentLoaded", () => this.#f(), { once: !0 }), this.#e = e, e && this.#p(e);
	}
	#p(e) {
		this.#t = !0, e.addEventListener("scroll", this.#i, { passive: !0 }), this.#a.observe(e), this.#o.observe(e, { childList: !0 }), this.#h();
		let t = this.buttons === "carousel" ? "arq-carousel-button" : "arq-icon-button";
		customElements.whenDefined(t).then(() => {
			for (let n of this.shadowRoot.querySelectorAll(t)) {
				let t = n.shadowRoot?.querySelector("button");
				t && "ariaControlsElements" in t && (t.ariaControlsElements = [e]);
			}
		}), this.#g();
	}
	#m() {
		this.#e && this.#t && (this.#t = !1, this.#e.removeEventListener("scroll", this.#i), this.#o.disconnect(), this.#a.disconnect());
	}
	#h() {
		for (let e of this.#e?.children ?? []) this.#a.observe(e);
		this.#g();
	}
	#g() {
		let e = this.#e;
		if (!e) return;
		let t = this.#u(), n = e[t.scrollSize] - e[t.clientSize], r = e[t.scroll], i = n <= 1 || r <= 1 ? "start" : r >= n - 1 ? "end" : "middle", a = n > 1;
		a !== this.#n && (this.#n = a, this.#d().next.disabled = !a || i === "end", this.shadowRoot.querySelector(".edge.next").disabled = !a || i === "end"), i !== this.position && (this.position = i), this.progress === "scroll" && this.buttons !== "icon" ? this.#_(e, a) : this.buttons === "carousel" && this.#y(e);
	}
	#_(e, t) {
		let n = this.shadowRoot, r = n.querySelector(".progress"), i = `${t}|${this.scrub}`;
		if (i !== this.#r) {
			this.#r = i, n.querySelector(".count").hidden = !0, r.hidden = !t, r.dataset.mode = "scroll", r.classList.toggle("scrub", this.scrub), r.setAttribute("aria-hidden", "true");
			for (let e of [
				"role",
				"aria-valuemin",
				"aria-valuemax",
				"aria-valuenow",
				"aria-valuetext"
			]) r.removeAttribute(e);
		}
		if (!t) return;
		let a = this.#u(), o = Math.min(1, e[a.clientSize] / e[a.scrollSize]), s = e[a.scroll] / e[a.scrollSize];
		r.style.setProperty("--progress-size", String(o)), r.style.setProperty("--progress-offset", String(s));
	}
	#v() {
		let e = this.shadowRoot, t = Math.max(this.count || 1, 1), n = Math.min(Math.max(this.index || 0, 0), t - 1);
		if (this.progress === "scroll") return;
		this.#r = "";
		let r = this.buttons === "carousel" && t > 1, i = e.querySelector(".count"), a = e.querySelector(".progress");
		i.hidden = !r, a.hidden = !r, i.textContent = `${String(n + 1).padStart(2, "0")} / ${String(t).padStart(2, "0")}`, a.style.setProperty("--progress-count", String(t)), a.style.setProperty("--progress-index", String(n)), a.setAttribute("role", "progressbar"), a.setAttribute("aria-valuemin", "1"), a.setAttribute("aria-valuemax", String(t)), a.setAttribute("aria-valuenow", String(n + 1)), a.setAttribute("aria-valuetext", `${n + 1} de ${t}`);
	}
	#y(e) {
		let t = [...e.children], n = Math.max(t.length, 1), r = e.scrollWidth - e.clientWidth, i = r <= 1 ? 0 : Math.min(n - 1, Math.max(0, Math.round(e.scrollLeft / r * (n - 1))));
		this.count !== n && (this.count = n), this.index === i ? this.#v() : this.index = i;
	}
	go(e) {
		this.#b(e);
	}
	#b(e) {
		let t = this.#e;
		if (!t) {
			this.emit(e < 0 ? "prev" : "next");
			return;
		}
		let n = this.step === "item" ? t.children[0] : null, r = n && Number.parseFloat(getComputedStyle(t).columnGap || getComputedStyle(t).gap) || 0, i = this.orientation === "vertical", a = Math.max((i ? t.clientHeight : t.clientWidth) - (this.pageInset || 0), 1), o = n ? n.getBoundingClientRect().width + r : this.scrub && this.progress === "scroll" ? a / 2 : a;
		if (i) {
			t.scrollBy({
				top: e * o,
				behavior: this.#s.matches ? "auto" : "smooth"
			});
			return;
		}
		let s = Math.max(t.scrollWidth - t.clientWidth, 0), c = Math.min(s, Math.max(0, t.scrollLeft + e * o));
		this.slide === "slow" ? this.#x(t, c) : t.scrollBy({
			left: e * o,
			behavior: this.#s.matches ? "auto" : "smooth"
		});
	}
	glideTo(e) {
		let t = this.#e;
		if (!t) return;
		let n = Math.max(t.scrollWidth - t.clientWidth, 0), r = Math.min(n, Math.max(0, e));
		this.slide === "slow" ? this.#x(t, r) : t.scrollTo({
			left: r,
			behavior: this.#s.matches ? "auto" : "smooth"
		});
	}
	cancelGlide() {
		let e = this.#e, t = e ? e.scrollLeft : 0;
		this.#c?.(), this.#c = null, e && (e.scrollLeft = t, e.removeAttribute("data-gliding"));
	}
	#x(e, t) {
		let n = e.scrollLeft;
		this.#c?.(), this.#c = null, e.scrollLeft = n, e.removeAttribute("data-gliding");
		let r = getComputedStyle(this), i = this.#s.matches ? 0 : Number.parseFloat(r.getPropertyValue("--arq-motion-duration-fold")) || 0, a = Ka(r.getPropertyValue("--arq-motion-easing-in-out"));
		if (!i || Math.abs(t - n) < 1) {
			e.scrollLeft = t;
			return;
		}
		e.setAttribute("data-gliding", "");
		let o = performance.now(), s = 0, c = () => cancelAnimationFrame(s);
		this.#c = c;
		let l = (r) => {
			if (this.#c !== c) return;
			let u = Math.min(1, (r - o) / i);
			if (e.scrollLeft = n + (t - n) * a(u), u < 1) {
				s = requestAnimationFrame(l);
				return;
			}
			this.#c = null, e.scrollLeft = t, e.removeAttribute("data-gliding");
		};
		s = requestAnimationFrame(l);
	}
}).define();
//#endregion
//#region src/components/variants-table/variants-table.css?inline
var qa = ":host{gap:var(--arq-space-gap-md);min-width:0;margin-inline:var(--page-gutter);color:var(--arq-color-text-primary);isolation:isolate;flex-direction:column;display:flex}.controls{align-items:center;gap:var(--arq-space-gap-md);padding-block:var(--arq-space-padding-md);grid-template-columns:auto auto minmax(0,1fr);display:grid}.controls.fixed{top:var(--arq-layout-navbar-height);z-index:3;background:var(--arq-color-surface-default);position:sticky}.toggle-filters{grid-area:1/1;justify-self:start}.total{color:var(--arq-color-text-secondary);grid-area:1/2}.downloads{justify-content:flex-end;gap:var(--arq-space-gap-sm);flex-wrap:wrap;grid-area:1/3;display:flex}.downloads-menu{display:none}.search{width:100%;max-width:var(--arq-download-search-width,var(--arq-layout-download-search));grid-area:1/1/auto/3;justify-self:start;min-width:0}.applied{align-items:center;gap:var(--arq-space-gap-lg);flex-wrap:wrap;grid-area:2/1/auto/-1;display:flex}:host([type=catalog]) .controls{column-gap:var(--arq-space-gap-lg);grid-template-columns:auto minmax(0,1fr) auto}:host([type=catalog]) .toggle-filters{grid-column:3;justify-self:end}:host([type=catalog]) .total{grid-area:2/1}:host([type=catalog]) .applied{grid-column:2/4;justify-content:flex-end}.chips{gap:var(--arq-space-gap-sm);flex-wrap:wrap;display:flex}.reveal{transition-property:opacity,color,background-color,border-color,outline-color,text-decoration-color,fill,stroke;transition-duration:var(--arq-motion-duration-base);transition-timing-function:var(--arq-motion-easing-standard)}@media (prefers-reduced-motion:reduce){.reveal{transition-duration:var(--arq-motion-duration-fade), var(--arq-motion-duration-fast), var(--arq-motion-duration-fast), var(--arq-motion-duration-fast), var(--arq-motion-duration-fast), var(--arq-motion-duration-fast), var(--arq-motion-duration-fast), var(--arq-motion-duration-fast);transition-timing-function:var(--arq-motion-easing-out)}}@starting-style{.reveal:not([hidden]){opacity:0}}.scroll{--page-gutter:var(--arq-space-padding-sm);overscroll-behavior-x:contain;scrollbar-width:none;overflow-x:auto}.scroll::-webkit-scrollbar{display:none}.scroll.fits{overflow-x:clip}.scrollbar{z-index:3;padding-block:var(--arq-space-padding-sm);background:var(--arq-color-surface-default);display:flex;position:sticky;bottom:0}.scroll:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:calc(-1 * var(--arq-border-strong))}.table{border-collapse:collapse;border-spacing:0;width:100%}th,td{padding:0 var(--arq-space-gap-lg) 0 0;--cell-bg:var(--arq-color-surface-default);border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle);background:var(--cell-bg);text-align:start;white-space:nowrap;vertical-align:middle}.cell{display:inline-block}.data{width:var(--col-width,auto)}.data>.cell{min-width:var(--col-width,0)}thead th{--cell-bg:var(--arq-color-surface-soft);padding-block:var(--arq-space-padding-sm-md);color:var(--arq-color-text-tertiary);font-weight:inherit}.sort{align-items:center;gap:var(--arq-space-gap-xs);color:inherit;font:inherit;letter-spacing:inherit;text-align:inherit;cursor:pointer;transition:color var(--arq-motion-duration-fast) var(--arq-motion-easing-standard);background:0 0;border:0;margin:0;padding:0;display:inline-flex}.sort .icon{width:var(--arq-icon-sm);height:var(--arq-icon-sm);flex:none}.sort.sorted{color:var(--arq-color-text-primary)}@media (hover:hover) and (pointer:fine){.sort:hover{color:var(--arq-color-text-primary)}}.sort:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}tbody th,tbody td{padding-block:var(--arq-space-padding-sm);color:var(--arq-color-text-primary)}:host([type=catalog]) tbody th,:host([type=catalog]) tbody td{padding-block:var(--arq-space-padding-sm-md)}@media (hover:hover) and (pointer:fine){tbody tr:hover>*{--cell-bg:var(--arq-color-surface-faint)}}.start{z-index:1;width:1%;padding-inline:var(--page-gutter) var(--arq-space-gap-sm);position:sticky;left:0}.sku-col{left:calc(var(--page-gutter) + var(--arq-layout-table-thumb) + var(--arq-space-gap-sm));z-index:1;padding-inline-end:var(--arq-space-gap-xl);position:sticky}tbody .sku-col{font-weight:inherit}.thumb{width:var(--arq-layout-table-thumb);height:var(--arq-layout-table-thumb);background:var(--arq-color-surface-subtle);display:block;overflow:hidden}.thumb img,.card-thumb img{object-fit:cover;width:100%;height:100%;display:block}.product{align-items:flex-start;gap:var(--arq-space-gap-sm-md);flex-direction:column;min-width:0;display:flex}.name{color:var(--arq-color-text-primary)}.thumb-link{color:inherit;text-decoration:none;display:block}th.end,td.end{z-index:1;width:1%;padding-inline:var(--arq-space-gap-sm) var(--page-gutter);text-align:center;position:sticky;right:0}@media (width<=1023px){.sku-col{position:static}}.end:before,.sku-col:after,.start:after{content:\"\";width:var(--arq-space-gap-3xl);pointer-events:none;opacity:0;transition:opacity var(--arq-motion-duration-fast) var(--arq-motion-easing-standard);position:absolute;top:0;bottom:0}.end:before{background:linear-gradient(to right, var(--arq-color-surface-transparent), var(--cell-bg));right:100%}.sku-col:after,.start:after{background:linear-gradient(to left, var(--arq-color-surface-transparent), var(--cell-bg));left:100%}.more-end .end:before,.more-start .sku-col:after,.more-start .start:after{opacity:1}@media (width>=1024px){.start:after{content:none}}@media (width<=1023px){.sku-col:after{content:none}}@media (width>=1920px){.table thead th,.head-table thead th,.table tbody td{font-size:var(--arq-type-body-size);line-height:var(--arq-type-body-leading)}}.more{padding-top:var(--arq-space-gap-xl);justify-content:center;display:flex}.empty{gap:var(--arq-space-gap-sm-md);padding:var(--arq-space-section-sm) 0 var(--arq-space-section-md);flex-direction:column;display:flex}.empty p{margin:0}.empty-title{color:var(--arq-color-text-primary)}.empty-text{max-width:var(--arq-layout-measure-wide);color:var(--arq-color-text-secondary)}.skeleton{flex-direction:column;display:flex}.sk-row{align-items:center;gap:var(--arq-space-gap-sm);padding:var(--arq-space-padding-sm);border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle);display:flex}.sk-thumb{width:var(--arq-layout-table-thumb);height:var(--arq-layout-table-thumb);background:var(--arq-color-surface-subtle);flex:none}.sk-product{gap:var(--arq-space-gap-sm);flex-direction:column;flex:0 0 25%;padding-inline-start:var(--arq-space-padding-sm);display:flex}.sk-bar{width:70%;height:var(--arq-space-gap-sm-md);background:var(--arq-color-surface-subtle);display:block}.sk-short{width:35%;height:var(--arq-icon-sm)}.sk-cells{gap:var(--arq-space-gap-sm);flex:auto;min-width:0;display:flex}.sk-cell{flex:1 1 0;min-width:0}.sk-cell .sk-bar{width:55%}.sk-download{width:var(--arq-icon-xl);height:var(--arq-icon-xl);margin-inline:var(--arq-space-padding-lg);background:var(--arq-color-surface-subtle);flex:none}.sk-card{display:none}.cards{margin:0;padding:0;list-style:none;display:none}@media (width<=767px){:host([type=catalog]) .controls{margin-inline:calc(-1 * var(--page-gutter));padding-inline:var(--page-gutter)}.controls,:host([type=catalog]) .controls{grid-template-columns:auto minmax(0,1fr)}.downloads{display:none}.downloads-menu:not([hidden]){grid-area:1/2;justify-self:end;display:inline-flex}:host(:not([type=catalog])) .total{grid-area:2/1/auto/-1}.applied,:host([type=catalog]) .applied{grid-area:3/1/auto/-1}:host([type=catalog]) .search{grid-column:1/-1;max-width:none}:host([type=catalog]) .toggle-filters{grid-area:2/1;justify-self:start}:host([type=catalog]) .total{grid-area:2/2}.scroll,.scrollbar{display:none}.cards:not([hidden]){flex-direction:column;display:flex}.cards,.skeleton{margin-inline:calc(-1 * var(--page-gutter))}.card{gap:var(--arq-space-gap-sm);padding:var(--arq-space-padding-lg) var(--page-gutter);border-bottom:var(--arq-border-default) solid var(--arq-color-border-default);flex-direction:column;display:flex}.card-head{align-items:center;gap:var(--arq-space-gap-md);display:flex}.card-head .product{flex:auto}.card-head .thumb-link,.card-head arq-icon-button{flex:none}.card-thumb{width:var(--arq-layout-download-thumb);height:var(--arq-layout-download-thumb);background:var(--arq-color-surface-subtle);flex:none;display:block;overflow:hidden}.card-data{grid-template-columns:repeat(2,minmax(0,1fr));margin:0;display:grid}.card-item{padding-block:var(--arq-space-padding-sm);border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle);flex-direction:column;display:flex}.card-item:last-child,.card-item:nth-last-child(2):nth-child(odd){border-bottom:0}.card-item dt{color:var(--arq-color-text-secondary)}.card-item dd{color:var(--arq-color-text-primary);overflow-wrap:break-word;margin:0}.sk-row{display:none}.sk-card{gap:var(--arq-space-gap-md);padding:var(--arq-space-padding-lg) var(--page-gutter);border-bottom:var(--arq-border-default) solid var(--arq-color-border-default);flex-direction:column;display:flex}.sk-head{align-items:center;gap:var(--arq-space-gap-md);display:flex}.sk-card .sk-thumb{width:var(--arq-layout-download-thumb);height:var(--arq-layout-download-thumb)}.sk-card .sk-product{flex:auto;padding:0}.sk-data{gap:var(--arq-space-gap-md);grid-template-columns:repeat(2,minmax(0,1fr));display:grid}.sk-data .sk-bar{width:50%}}.head{--page-gutter:var(--arq-space-padding-sm);top:100%;background:var(--arq-color-surface-default);position:absolute;inset-inline:0;overflow:hidden}.head-table{table-layout:fixed;border-collapse:collapse;border-spacing:0}@media (width<=767px){.head{display:none}}", Ja = new Intl.NumberFormat("es-AR"), H = (e) => String(e ?? "").replace(/[&<>"]/g, (e) => ({
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;"
})[e]), Ya = (e) => e != null && String(e).trim() !== "" && e !== "-", U = {
	filters: "Filtros",
	search: "Buscar por nombre o SKU…",
	searchLabel: "Buscar por nombre o SKU",
	clear: "Limpiar filtros",
	downloads: "Descargas",
	image: "Imagen",
	sku: "SKU",
	loading: "Buscando…",
	emptyTitle: "No hay productos con estos filtros",
	emptyText: "Probá quitar alguno de los filtros aplicados o buscar por otro nombre o SKU.",
	emptySearchTitle: (e) => `No encontramos resultados para «${e}».`,
	emptySearchText: "Probá con otro nombre o SKU, o con una parte del código.",
	emptyBothTitle: (e) => `No encontramos resultados para «${e}» con estos filtros.`,
	emptyVariantsTitle: "No hay variantes con estos filtros",
	emptyVariantsText: "Probá quitar alguno de los filtros aplicados.",
	more: "Ver más productos",
	shown: (e, t) => `Se muestran ${Ja.format(e)} de ${Ja.format(t)} productos`,
	count: (e) => e === 1 ? "1 producto" : `${Ja.format(e)} productos`,
	countVariants: (e) => e === 1 ? "1 variante" : `${Ja.format(e)} variantes`,
	sorted: (e, t) => `Ordenado por ${e}, de ${t ? "mayor a menor" : "menor a mayor"}`
}, Xa = "orden", Za = 100, Qa = 1.5, $a = 500, eo = [
	"potencia",
	"temperatura_color",
	"cri",
	"flujo_luminoso",
	"color_carcasa",
	"tamanio"
], to = 9, no = (e) => `<arq-icon-button icon="download" size="large" background="outline" data-sku="${H(e)}">Descargas de ${H(e)}</arq-icon-button>`, ro = (e, t, n = !1) => {
	let r = `<span class="${t}">${e.thumb ? `<img src="${H(e.thumb)}" alt="" loading="lazy">` : ""}</span>`;
	return n && e.href ? `<a class="thumb-link" href="${H(e.href)}" tabindex="-1" aria-hidden="true">${r}</a>` : r;
}, io = (e, t) => e.href ? `<arq-text-link class="name" size="compact" href="${H(e.href)}">${H(e.name)}</arq-text-link>` : `<span class="name ${t}">${H(e.name)}</span>`;
(class extends L {
	static tag = "arq-variants-table";
	static styles = qa;
	static properties = {
		type: {
			type: String,
			values: ["product", "catalog"],
			default: "product"
		},
		loading: { type: Boolean },
		downloads: { type: String },
		label: {
			type: String,
			default: "Variantes"
		}
	};
	static template = `<div class="controls"><arq-search-field class="search" type="line" size="medium" show-icon show-clear placeholder="${U.search}" label="${U.searchLabel}" hidden></arq-search-field><arq-button class="toggle-filters" show-icon icon="filter">${U.filters}</arq-button><span class="total role-body" aria-hidden="true"></span><div class="downloads"><slot name="downloads"></slot></div><arq-button class="downloads-menu" type="outline" show-icon icon="download" hidden>${U.downloads}</arq-button><div class="applied" hidden><div class="chips" role="list" aria-label="Filtros aplicados"></div><arq-button class="clear" type="underline" show-underline>${U.clear}</arq-button></div><div class="head" aria-hidden="true" hidden><table class="head-table"><colgroup></colgroup><thead></thead></table></div></div><div class="scroll" id="scroll" tabindex="0" role="region" aria-label="Variantes"><table class="table"><thead></thead><tbody></tbody></table></div><div class="scrollbar" hidden><arq-carousel-controls buttons="none" progress="scroll" scrub for="scroll"></arq-carousel-controls></div><ul class="cards" role="list" aria-label="Variantes"></ul><div class="more" hidden><arq-button class="more-button" type="outline">${U.more}</arq-button></div><div class="skeleton" aria-hidden="true" hidden></div><div class="empty" hidden><p class="empty-title role-heading-2">${U.emptyTitle}</p><p class="empty-text role-body-regular">${U.emptyText}</p></div><span class="visually-hidden count" role="status"></span><arq-filter-panel class="panel" unit="variantes"><span slot="title">${U.filters}</span></arq-filter-panel>`;
	#e = {
		columns: [],
		filters: [],
		rows: []
	};
	#t = {};
	#n = "";
	#r = {
		key: "",
		desc: !1
	};
	#i = !1;
	#a = Za;
	#o = null;
	#s = null;
	#c = !1;
	#l = 0;
	#u = () => this.#A();
	get #d() {
		return this.type === "catalog";
	}
	get data() {
		return this.#e;
	}
	set data(e) {
		this.#e = {
			columns: e?.columns ?? [],
			filters: e?.filters ?? [],
			rows: e?.rows ?? []
		}, this.#t = {}, this.#f(), this.isConnected && this.#v();
	}
	#f() {
		if (!this.#d) return;
		let e = new URLSearchParams(location.search);
		this.#n = e.get("q") ?? "";
		let t = {};
		for (let { key: n } of this.#e.filters) {
			let r = e.getAll(n);
			r.length && (t[n] = r);
		}
		this.#t = t;
		let n = e.get(Xa) ?? "", r = n.replace(/^-/, ""), i = r === "sku" || this.#e.columns.some((e) => e.key === r);
		this.#r = i ? {
			key: r,
			desc: n.startsWith("-")
		} : {
			key: "",
			desc: !1
		};
		let a = this.shadowRoot?.querySelector(".search");
		a && (a.value = this.#n);
	}
	#p() {
		if (!this.#d) return;
		let e = new URL(location.href);
		e.searchParams.delete("q");
		for (let { key: t } of this.#e.filters) e.searchParams.delete(t);
		this.#n.trim() && e.searchParams.set("q", this.#n.trim());
		for (let { key: t } of this.#e.filters) for (let n of this.#t[t] ?? []) e.searchParams.append(t, n);
		e.searchParams.delete(Xa), this.#r.key && e.searchParams.set(Xa, `${this.#r.desc ? "-" : ""}${this.#r.key}`), e.href !== location.href && history.replaceState(history.state, "", e);
	}
	#m(e = 0) {
		this.#a = Za, this.#D(), this.#p(), this.#g(this.#h(this.#T().length), e);
	}
	#h(e) {
		return this.#d ? U.count(e) : U.countVariants(e);
	}
	#g(e, t = 0) {
		clearTimeout(this.#o), this.#o = setTimeout(() => {
			this.shadowRoot.querySelector(".count").textContent = e;
		}, t);
	}
	connectedCallback() {
		super.connectedCallback(), window.addEventListener("scroll", this.#u, { passive: !0 }), window.addEventListener("resize", this.#u, { passive: !0 });
	}
	disconnectedCallback() {
		window.removeEventListener("scroll", this.#u), window.removeEventListener("resize", this.#u);
	}
	setup() {
		let e = this.shadowRoot;
		e.addEventListener("error", (e) => {
			e.target.localName === "img" && (e.target.hidden = !0);
		}, !0), e.querySelector(".toggle-filters").addEventListener("click", (e) => this.#F(e.currentTarget)), customElements.whenDefined("arq-button").then(() => {
			e.querySelector(".toggle-filters").shadowRoot?.querySelector(".control")?.setAttribute("aria-haspopup", "dialog");
		}), e.querySelector(".search").addEventListener("arq:input", (e) => {
			e.stopPropagation(), this.#n = e.detail.value, this.#m($a);
		}), e.querySelector(".search").addEventListener("arq:submit", (e) => e.stopPropagation()), e.querySelector(".chips").addEventListener("click", (e) => {
			let t = e.target.closest("arq-filter-chip");
			t && this.#P(t);
		}), e.querySelector(".clear").addEventListener("click", () => {
			this.#t = {}, this.#m(), e.querySelector(".toggle-filters").focus();
		}), e.querySelector(".more-button").addEventListener("click", () => this.#E());
		let t = e.querySelector("slot[name=\"downloads\"]"), n = e.querySelector(".downloads-menu"), r = () => {
			let e = !t.assignedElements().length;
			t.parentElement.hidden = e, n.hidden = e;
		};
		t.addEventListener("slotchange", r), r(), n.addEventListener("click", () => {
			this.emit("downloads", { sku: null }), (this.downloads ? this.getRootNode().getElementById?.(this.downloads) : null)?.show?.(n);
		});
		let i = e.querySelector(".panel");
		i.addEventListener("arq:filters", (e) => {
			e.stopPropagation(), this.#I(e.detail.filters);
		}), i.addEventListener("arq:apply", (e) => {
			e.stopPropagation(), this.#t = { ...e.detail.filters }, this.#m();
		}), e.addEventListener("click", (e) => {
			let t = e.target.closest("[data-sort]");
			if (t) return this.#b(t.dataset.sort, !t.closest(".head"));
			let n = e.target.closest("[data-sku]");
			if (!n) return;
			let r = n.dataset.sku;
			this.emit("downloads", { sku: r }), (this.downloads ? this.getRootNode().getElementById?.(this.downloads) : null)?.show?.(n);
		}), this.#_(), this.#v();
	}
	#_() {
		let e = this.shadowRoot, t = e.querySelector(".scroll"), n = e.querySelector(".scrollbar"), r = e.querySelector(".head"), i = e.querySelector(".table"), a = () => Math.max(0, i.getBoundingClientRect().width - t.clientWidth), o = () => {
			let e = a(), n = e - t.scrollLeft;
			for (let i of [t, r]) i.classList.toggle("more-start", e > 1 && t.scrollLeft > 1), i.classList.toggle("more-end", n > 1);
		};
		t.addEventListener("scroll", () => {
			r.scrollLeft = t.scrollLeft, o();
		}, { passive: !0 }), this.#s = () => {
			let e = a() <= 1;
			n.hidden = t.hidden || e, t.classList.toggle("fits", e), o();
		};
		let s = new ResizeObserver(() => {
			this.#s(), (!this.#c || t.clientWidth !== this.#l) && this.#O(), this.#k();
		});
		document.fonts?.ready.then(() => this.#O()), s.observe(t), s.observe(e.querySelector(".table"));
	}
	update(e) {
		let t = this.shadowRoot;
		e.has("label") && t.querySelector(".scroll").setAttribute("aria-label", this.label ?? "Variantes"), e.has("type") && (t.querySelector(".search").hidden = !this.#d, t.querySelector(".panel").unit = this.#d ? "productos" : "variantes", t.querySelector(".cards").setAttribute("aria-label", this.label ?? "Variantes"), this.#d && !this.#n && !this.#w() && (this.#f(), this.#v()), this.#s?.()), (e.has("loading") || e.has("type")) && this.#D();
	}
	#v() {
		this.#D();
	}
	#y(e) {
		let t = this.#d, { key: n, desc: r } = this.#r, i = (e, i) => {
			if (!t) return H(i);
			let a = e === n;
			return `<button type="button" class="sort${a ? " sorted" : ""}" data-sort="${H(e)}">${H(i)}${R(a && r ? "chevron-up" : "chevron-down")}</button>`;
		}, a = (e) => t && e === n ? ` aria-sort="${r ? "descending" : "ascending"}"` : "";
		this.shadowRoot.querySelector(".table thead").innerHTML = `<tr><th scope="col" class="start"><span class="visually-hidden">${U.image}</span></th><th scope="col" class="sku-col role-body-compact-regular"${a("sku")}>${i("sku", U.sku)}</th>` + e.map((e) => `<th scope="col" class="role-body-compact-regular${e.wide ? " wide" : " data"}"${a(e.key)}><span class="cell">${i(e.key, e.label)}</span></th>`).join("") + `<th scope="col" class="end role-body-compact-regular">${U.downloads}</th></tr>`;
	}
	#b(e, t) {
		let { key: n, desc: r } = this.#r;
		this.#r = {
			key: e,
			desc: e === n && !r
		}, this.#a = Za, this.#D(), this.#p();
		let i = e === "sku" ? U.sku : this.#e.columns.find((t) => t.key === e)?.label ?? e;
		this.#g(U.sorted(i, this.#r.desc)), t && this.shadowRoot.querySelector(`.table thead [data-sort="${CSS.escape(e)}"]`)?.focus();
	}
	#x(e) {
		return e.length ? this.#e.columns.filter((t) => e.some((e) => Ya(e.values?.[t.key]))) : this.#e.columns;
	}
	#S() {
		return this.#d ? lt(this.#e.rows, this.#n) : this.#e.rows;
	}
	#C(e = this.#t) {
		let t = this.#e.filters.map((e) => e.key), n = st(this.#e.rows, t, e), r = st(this.#S(), t, e);
		return n.map((e, t) => {
			let n = new Set(r[t].options.filter((e) => !e.disabled).map((e) => e.value));
			return e.options.map((e) => ({
				value: e.value,
				selected: e.selected,
				disabled: !n.has(e.value) && !e.selected
			}));
		});
	}
	#w(e = this.#t) {
		return Object.values(e).reduce((e, t) => e + (t?.length ?? 0), 0);
	}
	#T() {
		return ot(this.#S(), this.#t);
	}
	#E() {
		let e = this.shadowRoot, t = this.#a;
		this.#a += Za, this.#D();
		let n = this.#T().length;
		if (this.#g(U.shown(Math.min(this.#a, n), n)), e.querySelector(".more").hidden) {
			let n = getComputedStyle(e.querySelector(".cards")).display !== "none";
			e.querySelectorAll(n ? ".cards [data-sku]" : "tbody [data-sku]")[t]?.focus();
		}
	}
	#D() {
		let e = this.shadowRoot, t = this.#d, { filters: n } = this.#e, r = t ? ft(this.#T(), this.#r.key, this.#r.desc) : this.#T(), i = t ? r.slice(0, this.#a) : r, a = this.#w(), o = this.#x(r);
		this.#y(o);
		let s = e.querySelector(".toggle-filters");
		s.textContent = a ? `${U.filters} (${a})` : U.filters, s.disabled = this.loading, s.hidden = !this.loading && !n.length, this.#N(), e.querySelector(".table tbody").innerHTML = i.map((e) => `<tr><td class="start">${ro(e, "thumb", t)}</td><th scope="row" class="sku-col"><span class="product">` + (t && e.name ? io(e, "role-body-compact-regular") : "") + `<arq-sku size="compact" dense data-arq-copy-feedback="replace">${H(e.sku)}</arq-sku></span></th>` + o.map((t) => `<td class="role-body-compact-regular${t.wide ? " wide" : " data"}"><span class="cell">${H(e.values?.[t.key] ?? "—")}</span></td>`).join("") + `<td class="end">${no(e.sku)}</td></tr>`).join("");
		let c = [...eo.map((e) => o.find((t) => t.key === e)).filter(Boolean), ...o.filter((e) => e.card)];
		e.querySelector(".cards").innerHTML = i.map((e) => {
			let n = t ? c.filter((t) => (e.values?.[t.key] ?? "") !== "") : c;
			return `<li class="card"><span class="card-head">${ro(e, "card-thumb", t)}<span class="product">` + (t && e.name ? io(e, "role-body-compact-regular") : "") + `<arq-sku size="compact" dense data-arq-copy-feedback="replace">${H(e.sku)}</arq-sku></span>${no(e.sku)}</span>` + (n.length ? "<dl class=\"card-data\">" + n.map((t) => `<div class="card-item"><dt class="role-body-compact-regular">${H(t.label)}</dt><dd class="role-body-compact-medium">${H(e.values?.[t.key] ?? "—")}</dd></div>`).join("") + "</dl>" : "") + "</li>";
		}).join(""), e.querySelector(".total").textContent = this.loading ? U.loading : this.#h(r.length);
		let l = !this.loading && !r.length && this.#e.rows.length > 0;
		!this.loading && !this.#i && !e.querySelector(".skeleton").hidden && this.#M(), e.querySelector(".skeleton").hidden = !this.loading, this.loading && this.#L(), e.querySelector(".scroll").hidden = l || this.loading, e.querySelector(".cards").hidden = l || this.loading, e.querySelector(".more").hidden = !t || this.loading || r.length <= this.#a, e.querySelector(".empty").hidden = !l, l && this.#j(a), this.#O(), this.#A();
	}
	#O() {
		let e = this.shadowRoot.querySelector(".table");
		e.style.removeProperty("--col-width");
		let t = [...e.querySelectorAll(".data, .wide")];
		for (let e of t) e.style.width = "", e.firstElementChild.style.minWidth = "";
		let n = /* @__PURE__ */ new Map();
		for (let e of t) {
			let t = n.get(e.cellIndex) ?? {
				wide: !1,
				width: 0
			};
			t.wide ||= e.classList.contains("wide"), t.width = Math.max(t.width, e.firstElementChild.getBoundingClientRect().width), n.set(e.cellIndex, t);
		}
		let r = [...n.values()].filter((e) => e.width).map((e) => e.width).sort((e, t) => e - t), i = r[Math.floor(r.length / 2)] ?? 0;
		for (let e of n.values()) e.wide ||= e.width > i * Qa;
		let a = Math.max(0, ...[...n.values()].filter((e) => !e.wide).map((e) => e.width)), o = (r) => {
			a && e.style.setProperty("--col-width", `${Math.ceil(a + r)}px`);
			for (let e of t) {
				let t = n.get(e.cellIndex);
				t.wide && t.width && (e.style.width = `${Math.ceil(t.width + r)}px`, e.firstElementChild.style.minWidth = `${Math.ceil(t.width + r)}px`);
			}
		};
		o(0);
		let s = this.shadowRoot.querySelector(".scroll").clientWidth, c = e.getBoundingClientRect().width <= s + 1, l = e.querySelector("thead th.sku-col"), u = [...e.querySelectorAll("tbody .product")];
		if (c && l && u.length && n.size) {
			let t = Math.max(...u.map((e) => Math.max(...[...e.children].map((e) => e.getBoundingClientRect().width)))), r = l.getBoundingClientRect().width - t - parseFloat(getComputedStyle(l).paddingInlineEnd);
			r > 1 && (o(Math.floor(r / n.size)), e.getBoundingClientRect().width > s + 1 && o(0));
		}
		this.#l = this.shadowRoot.querySelector(".scroll").clientWidth, this.#c = r.length > 0, this.#s?.(), this.#k();
	}
	#k() {
		let e = this.shadowRoot, t = [...e.querySelectorAll(".table thead th")], n = e.querySelector(".head-table"), r = t.map((e) => e.getBoundingClientRect().width);
		if (r.some(Boolean)) {
			n.querySelector("thead").innerHTML = e.querySelector(".table thead").innerHTML;
			for (let e of n.querySelectorAll("button")) e.tabIndex = -1;
			n.querySelector("colgroup").innerHTML = r.map((e) => `<col style="width:${e}px">`).join(""), n.style.width = `${r.reduce((e, t) => e + t, 0)}px`, e.querySelector(".head").scrollLeft = e.querySelector(".scroll").scrollLeft, this.#A();
		}
	}
	#A() {
		let e = this.shadowRoot, t = e.querySelector(".head"), n = this.getBoundingClientRect().height > window.innerHeight;
		e.querySelector(".controls").classList.toggle("fixed", n);
		let r = e.querySelector(".table thead").getBoundingClientRect(), i = e.querySelector(".controls").getBoundingClientRect(), a = e.querySelector(".table").getBoundingClientRect();
		t.hidden = !n || this.loading || !r.height || !(r.top < i.bottom && a.bottom > i.bottom + r.height);
	}
	#j(e) {
		let t = this.shadowRoot, n = this.#d ? this.#n.trim() : "", r = U.emptyTitle, i = U.emptyText;
		this.#d ? n && (r = e ? U.emptyBothTitle(n) : U.emptySearchTitle(n), e || (i = U.emptySearchText)) : (r = U.emptyVariantsTitle, i = U.emptyVariantsText), t.querySelector(".empty-title").textContent = r, t.querySelector(".empty-text").textContent = i;
	}
	#M() {
		this.#i = !0;
		let e = [this.shadowRoot.querySelector(".scroll"), this.shadowRoot.querySelector(".cards")], t = () => {
			for (let t of e) t.classList.remove("reveal"), t.removeEventListener("transitionend", n), t.removeEventListener("transitioncancel", n);
		}, n = (e) => {
			e.target === e.currentTarget && e.propertyName === "opacity" && t();
		};
		for (let t of e) t.classList.add("reveal"), t.addEventListener("transitionend", n), t.addEventListener("transitioncancel", n);
		parseFloat(getComputedStyle(e[0]).transitionDuration) || requestAnimationFrame(t);
	}
	#N() {
		let e = this.shadowRoot, t = this.#e.filters.flatMap((e) => (this.#t[e.key] ?? []).map((t) => ({
			key: e.key,
			value: t
		}))), n = e.querySelector(".chips");
		for (; n.children.length > t.length;) n.lastElementChild.remove();
		for (; n.children.length < t.length;) {
			let e = document.createElement("arq-filter-chip");
			e.setAttribute("role", "listitem"), n.append(e);
		}
		t.forEach(({ key: e, value: t }, r) => {
			let i = n.children[r];
			i.dataset.key = e, i.dataset.value = t, i.textContent !== t && (i.textContent = t);
		}), e.querySelector(".applied").hidden = !t.length;
	}
	#P(e) {
		let t = [...this.shadowRoot.querySelectorAll(".chips arq-filter-chip")].indexOf(e), { key: n, value: r } = e.dataset;
		this.#t = {
			...this.#t,
			[n]: (this.#t[n] ?? []).filter((e) => e !== r)
		}, this.#m();
		let i = [...this.shadowRoot.querySelectorAll(".chips arq-filter-chip")];
		(i[t] ?? i[t - 1] ?? this.shadowRoot.querySelector(".toggle-filters")).focus();
	}
	#F(e) {
		let t = this.shadowRoot.querySelector(".panel"), { filters: n } = this.#e, r = this.#C();
		t.replaceChildren(t.querySelector("[slot=\"title\"]"), ...n.map((e, t) => {
			let n = document.createElement("arq-filter-row"), i = document.createElement("span");
			i.slot = "label", i.textContent = e.label, n.append(i);
			for (let i of r[t]) {
				let t = document.createElement("arq-checkbox");
				t.size = "large", t.showLabel = !0, t.setAttribute("name", e.key), t.value = i.value, t.textContent = i.value, t.checked = i.selected, n.append(t);
			}
			return n.open = r[t].some((e) => e.selected), n;
		})), this.#I(this.#t), t.show(e);
	}
	#I(e) {
		let t = this.shadowRoot.querySelector(".panel"), n = this.#S();
		for (let r of t.options) {
			let t = r.getAttribute("name");
			r.count = ot(n, {
				...e,
				[t]: [r.value]
			}).length || null;
		}
		t.showAvailable((e) => Number.isFinite(e.count)), t.count = ot(n, e).length;
	}
	#L() {
		let e = this.shadowRoot.querySelector(".skeleton");
		if (e.childElementCount) return;
		let t = this.#e.columns.length || to, n = Array.from({ length: t }, () => "<span class=\"sk-cell\"><span class=\"sk-bar\"></span></span>").join("");
		e.innerHTML = Array.from({ length: 4 }, () => `<div class="sk-row"><span class="sk-thumb"></span><span class="sk-product"><span class="sk-bar sk-short"></span><span class="sk-bar"></span></span><span class="sk-cells">${n}</span><span class="sk-download"></span></div>`).join("") + Array.from({ length: 3 }, () => "<div class=\"sk-card\"><span class=\"sk-head\"><span class=\"sk-thumb\"></span><span class=\"sk-product\"><span class=\"sk-bar sk-short\"></span><span class=\"sk-bar\"></span></span></span><span class=\"sk-data\"><span class=\"sk-bar\"></span><span class=\"sk-bar\"></span><span class=\"sk-bar\"></span><span class=\"sk-bar\"></span></span></div>").join("");
	}
}).define();
//#endregion
//#region src/components/gallery-thumb/gallery-thumb.css?inline
var ao = ":host{display:block}.thumb{box-sizing:border-box;aspect-ratio:5/4;border-radius:var(--arq-radius-control);background:var(--thumb-surface,var(--arq-color-surface-subtle));cursor:pointer;-webkit-tap-highlight-color:var(--arq-color-surface-transparent);border:0;width:100%;margin:0;padding:0;display:block;position:relative;overflow:hidden}.thumb img{object-fit:cover;width:100%;height:100%;display:block}.thumb:after{content:\"\";border:var(--arq-border-default) solid var(--arq-color-surface-transparent);border-radius:inherit;pointer-events:none;position:absolute;inset:0}@media (hover:hover) and (pointer:fine){.thumb:hover:after{border-color:var(--arq-color-border-hover)}}.thumb[aria-current=true]:after{border-color:var(--arq-color-border-strong)}.thumb:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.thumb:focus:not(:focus-visible){outline:none}";
(class extends L {
	static tag = "arq-gallery-thumb";
	static styles = ao;
	static properties = {
		selected: { type: Boolean },
		src: { type: String },
		alt: { type: String }
	};
	static template = "<button type=\"button\" class=\"thumb\"><img alt=\"\" loading=\"lazy\"></button>";
	#e = null;
	setup() {
		this.#e = this.shadowRoot.querySelector(".thumb");
		let e = this.shadowRoot.querySelector("img");
		e.addEventListener("error", () => e.hidden = !0), setTimeout(() => {
			this.alt || console.warn("[arq] <arq-gallery-thumb> sin alt: describí la imagen (p. ej. alt=\"Kanu Jardín, vista frontal\").");
		});
	}
	focus(e) {
		this.#e ? this.#e.focus(e) : super.focus(e);
	}
	update(e) {
		let t = this.#e;
		this.selected ? t.setAttribute("aria-current", "true") : t.removeAttribute("aria-current");
		let n = this.shadowRoot.querySelector("img");
		e.has("src") && (this.src ? (n.hidden = !1, n.src = this.src) : (n.removeAttribute("src"), n.hidden = !0)), this.alt ? t.setAttribute("aria-label", this.alt) : t.removeAttribute("aria-label");
	}
}).define();
//#endregion
//#region src/components/product-gallery/product-gallery.css?inline
var oo = ":host{isolation:isolate;min-width:0;display:block}.gallery{gap:var(--arq-space-gap-sm);flex-direction:column;display:flex;position:relative}.image{aspect-ratio:var(--gallery-ratio,5 / 4);border-radius:var(--arq-radius-control);background:var(--arq-color-surface-subtle);position:relative;overflow:hidden}.image:has(.track:focus-visible){outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.track{overscroll-behavior-x:contain;scroll-snap-type:x mandatory;scrollbar-width:none;cursor:grab;touch-action:pan-x pan-y;display:flex;position:absolute;inset:0;overflow:auto hidden}.track:focus{outline:none}.track::-webkit-scrollbar{display:none}.track[data-dragging]{scroll-snap-type:none;cursor:grabbing}.nav{padding:var(--arq-space-padding-xs);color:var(--arq-color-icon-primary);cursor:pointer;background:0 0;border:0;flex:none;justify-content:center;align-items:center;margin:0;display:inline-flex}.nav[hidden]{display:none}.nav .icon{width:var(--arq-icon-xl);height:var(--arq-icon-xl)}.nav:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.nav:focus:not(:focus-visible){outline:none}.prev,.next{z-index:4;position:absolute;top:50%;transform:translateY(-50%)}.prev{left:var(--arq-space-padding-md)}.next{right:var(--arq-space-padding-md)}@media (hover:hover) and (pointer:fine){.nav{opacity:0;pointer-events:none;transition:opacity var(--arq-motion-duration-fast) var(--arq-motion-easing-standard)}.gallery:hover .nav,.gallery:focus-within .nav{opacity:1;pointer-events:auto}}@media (hover:none),(pointer:coarse){.nav{display:none}}.theme-transition{z-index:1;object-fit:cover;opacity:1;pointer-events:none;width:100%;height:100%;transition-property:opacity;transition-duration:var(--arq-illumination-image-duration,var(--arq-motion-duration-slow));transition-timing-function:var(--arq-illumination-image-easing,var(--arq-motion-easing-standard));position:absolute;inset:0}.theme-transition.fade-out{opacity:0}.theme-transition.quick{transition-duration:var(--arq-motion-duration-fade);transition-timing-function:var(--arq-motion-easing-standard)}::slotted(img){scroll-snap-align:start;scroll-snap-stop:always;object-fit:cover!important;flex:0 0 100%!important;width:100%!important;height:100%!important;display:block!important}::slotted(img[data-fit=air]){box-sizing:border-box!important;padding:var(--arq-space-padding-3xl)!important;object-fit:contain!important}.theme-transition[data-fit=air]{box-sizing:border-box;padding:var(--arq-space-padding-3xl);object-fit:contain}::slotted(img[hidden]){display:none!important}.gallery{--thumb-surface:var(--arq-color-surface-subtle)}.thumbs-row{align-items:center;gap:var(--arq-space-gap-sm);min-width:0;display:flex}.thumbs{gap:var(--arq-space-gap-sm);margin:calc(-1 * var(--arq-space-padding-xs));padding:var(--arq-space-padding-xs);overscroll-behavior-x:contain;scroll-snap-type:x mandatory;scrollbar-width:none;display:flex;overflow-x:auto}.thumbs::-webkit-scrollbar{display:none}arq-gallery-thumb{width:var(--arq-layout-gallery-thumb);scroll-snap-align:start;flex:none}@media (width<=767px){:host([inset-thumbs]) .thumbs{padding-inline:var(--page-gutter);scroll-padding-inline:var(--page-gutter);margin-inline:0}}@media (width>=768px){.thumbs-row{z-index:3;left:var(--arq-space-padding-lg);bottom:var(--arq-space-padding-lg);max-width:calc(100% - 2 * var(--arq-space-padding-lg));position:absolute}.thumbs{min-width:0}}@media (width>=1024px){:host([fill]){flex-direction:column;display:flex}:host([fill]) .gallery{flex:auto;min-height:0}:host([fill]) .image{aspect-ratio:auto;flex:auto;min-height:0}:host([fill]) .prev{left:var(--arq-space-padding-xl-2xl)}:host([fill]) .next{right:var(--arq-space-padding-xl-2xl)}:host([fill]) .thumbs-row{left:var(--arq-space-padding-xl-2xl);bottom:var(--arq-space-padding-xl);max-height:calc(100% - 2 * var(--arq-space-padding-xl));align-items:center}:host([fill]) .thumbs{scroll-snap-type:y mandatory;flex-direction:column;max-width:none;min-height:0;max-height:100%;overflow:hidden auto}:host([fill]) arq-gallery-thumb{width:var(--arq-layout-gallery-thumb-overlay)}}", so = 6, co = .4;
(class extends L {
	static tag = "arq-product-gallery";
	static styles = oo;
	static properties = { insetThumbs: { type: Boolean } };
	static template = "<div class=\"gallery\"><div class=\"image\"><slot name=\"image\" class=\"track\" tabindex=\"-1\" role=\"region\" aria-roledescription=\"carrusel\" aria-label=\"Fotos del producto\"></slot><slot name=\"overlay\"></slot><button type=\"button\" class=\"nav prev\"><span class=\"glyph\"></span><span class=\"visually-hidden\">Foto anterior</span></button><button type=\"button\" class=\"nav next\"><span class=\"glyph\"></span><span class=\"visually-hidden\">Foto siguiente</span></button><p class=\"live visually-hidden\" aria-live=\"polite\"></p></div><div class=\"thumbs-row\" hidden><div class=\"thumbs\"></div></div></div>";
	#e = [];
	#t = 0;
	#n(e) {
		if (this.hasAttribute("zoom") || !e) return "fill";
		let t = String(e).split(/[?#]/)[0].split("/").pop();
		return /ambient|detail|detalle|inspira/i.test(t) ? "fill" : "air";
	}
	#r = !1;
	#i = !1;
	#a = null;
	#o = null;
	#s = 0;
	#c = new ResizeObserver(() => this.#C());
	get currentImage() {
		let e = this.#u();
		return e[this.#t] ?? e[0] ?? null;
	}
	get frame() {
		return this.shadowRoot.querySelector(".image");
	}
	get overlays() {
		let e = this.shadowRoot;
		return {
			prev: e.querySelector(".prev"),
			next: e.querySelector(".next"),
			thumbs: e.querySelector(".thumbs-row")
		};
	}
	setOverlayTone(e, t) {
		let n = this.overlays[e];
		n && (t ? n.setAttribute("data-arq-theme", t) : n.removeAttribute("data-arq-theme"));
	}
	get images() {
		return this.#e;
	}
	set images(e) {
		let t = this.#i ? this.currentImage?.getAttribute("src") : null;
		this.#e = Array.isArray(e) ? e.filter((e) => e && e.src) : [], this.#i = !0, this.#t = 0, this.isConnected && this.#g(t, {
			quick: !0,
			reset: !0
		});
	}
	setup() {
		let e = this.shadowRoot, t = e.querySelector(".track");
		e.querySelector(".thumbs").addEventListener("click", (e) => {
			let t = e.target.closest("arq-gallery-thumb");
			t && this.select(Number(t.dataset.index));
		}), e.querySelector(".prev .glyph").innerHTML = R("chevron-left"), e.querySelector(".next .glyph").innerHTML = R("chevron-right"), e.querySelector(".prev").addEventListener("click", () => this.#f(this.#t - 1, !0)), e.querySelector(".next").addEventListener("click", () => this.#f(this.#t + 1, !0)), t.addEventListener("scroll", () => this.#x(), { passive: !0 }), t.addEventListener("scrollend", () => {
			!this.#v && !this.#o && this.#S();
		}), t.addEventListener("pointerdown", (e) => this.#E(e)), t.addEventListener("pointermove", (e) => this.#D(e)), t.addEventListener("pointerup", (e) => this.#O(e)), t.addEventListener("pointercancel", (e) => this.#O(e)), t.addEventListener("dragstart", (e) => e.preventDefault()), e.addEventListener("keydown", (e) => this.#T(e)), this.#c.observe(t), _a(this, "themeChanged"), this.#g();
	}
	disconnectedCallback() {
		this.#c.disconnect();
	}
	themeChanged(e) {
		let t = this.#e[this.#t], n = t ? this.#l(t) : null;
		this.#r = e, this.#g(n);
	}
	select(e) {
		this.#f(e, !1);
	}
	#l(e) {
		return be(this.#r && e.srcOn || e.src, _e);
	}
	#u() {
		return [...this.querySelectorAll(":scope > img[slot=\"image\"]:not([data-clone])")];
	}
	#d() {
		return this.shadowRoot.querySelector(".track");
	}
	#f(e, t) {
		let n = this.#e.length;
		if (n < 2) return;
		let r = (e % n + n) % n;
		if (r === this.#t) return;
		let i = t && this.#t === n - 1 && r === 0, a = t && this.#t === 0 && r === n - 1;
		this.#t = r, this.#_(!0);
		let o = i ? n + 1 : a ? 0 : r + 1;
		this.#b(o);
	}
	#p() {
		return this.#e.length > 1 ? this.#t + 1 : 0;
	}
	#m() {
		let e = this.#e.length;
		if (e && !this.#u().length) {
			let e = document.createElement("img");
			e.slot = "image", this.append(e);
		}
		let t = this.#u();
		for (; t.length > Math.max(e, 1);) {
			let e = t.pop();
			e.dataset.slide === "extra" && e.remove();
		}
		for (let t of this.#u()) t.hidden = this.#i && !e;
		for (; e && this.#u().length < e;) {
			let e = document.createElement("img");
			e.slot = "image", e.dataset.slide = "extra", e.alt = "", e.draggable = !1;
			let t = this.querySelector(":scope > img[data-clone=\"after\"]");
			t ? this.insertBefore(e, t) : this.append(e);
		}
		this.#h();
	}
	#h() {
		let e = this.#e, t = this.#u(), n = this.querySelector(":scope > img[data-clone=\"before\"]"), r = this.querySelector(":scope > img[data-clone=\"after\"]");
		if (e.length < 2 || !t[0]) {
			n?.remove(), r?.remove();
			return;
		}
		n || (n = document.createElement("img"), n.dataset.clone = "before", n.slot = "image", n.alt = "", n.setAttribute("aria-hidden", "true"), n.draggable = !1, this.insertBefore(n, t[0])), r || (r = document.createElement("img"), r.dataset.clone = "after", r.slot = "image", r.alt = "", r.setAttribute("aria-hidden", "true"), r.draggable = !1, this.append(r));
		let i = this.#l(e.at(-1)), a = this.#l(e[0]);
		n.getAttribute("src") !== i && (n.src = i), r.getAttribute("src") !== a && (r.src = a), n.dataset.fit = this.#n(i), r.dataset.fit = this.#n(a);
	}
	#g(e = null, { quick: t = !1, reset: n = !1 } = {}) {
		this.#y = !0;
		let r = this.#e;
		this.#m(), n && (this.#t = 0), this.#t > r.length - 1 && (this.#t = Math.max(r.length - 1, 0));
		let i = this.#u(), a = r[this.#t], o = a ? this.#l(a) : null, s = i[this.#t], c = !!(e && o && e !== o && s);
		c && this.#k(s, e, o, t), i.forEach((e, t) => {
			let n = r[t];
			if (!n) return;
			let i = this.#l(n);
			!(c && t === this.#t) && e.getAttribute("src") !== i && (e.src = i), e.dataset.fit = this.#n(i), e.alt = n.alt ?? "", e.draggable = !1, t > 0 && (e.loading = "lazy");
			let a = be(this.#r ? n.src : n.srcOn, _e);
			a && a !== i && (new Image().src = a);
		}), this.#h();
		let l = this.#w();
		this.#d().scrollTo({
			left: this.#p() * l,
			behavior: "auto"
		});
		let u = this.shadowRoot.querySelector(".thumbs"), d = this.shadowRoot.querySelector(".thumbs-row");
		d.hidden = r.length < 2;
		let f = r.length < 2;
		if (this.shadowRoot.querySelector(".prev").hidden = f, this.shadowRoot.querySelector(".next").hidden = f, r.length < 2) u.replaceChildren();
		else {
			for (; u.children.length > r.length;) u.lastElementChild.remove();
			for (; u.children.length < r.length;) u.append(document.createElement("arq-gallery-thumb"));
			r.forEach((e, t) => {
				let n = u.children[t];
				n.dataset.index = String(t), n.src = this.#l(e), n.alt = e.alt ?? "";
			});
		}
		this.#_(!1), this.#y = !1;
	}
	#_(e) {
		let t = this.#e, n = this.#t;
		[...this.shadowRoot.querySelector(".thumbs").children].forEach((e, t) => {
			e.selected = t === n;
		});
		let r = t.length > 1, i = this.#d();
		if (i.tabIndex = r ? 0 : -1, !e || !r) return;
		let a = t[n]?.alt;
		this.shadowRoot.querySelector(".live").textContent = `Foto ${n + 1} de ${t.length}${a ? `, ${a}` : ""}`, this.dispatchEvent(new CustomEvent("arq:slide", { detail: { index: n } }));
	}
	#v = 0;
	#y = !1;
	#b(e) {
		let t = this.#d(), n = e * (this.#w() || t.clientWidth);
		if (matchMedia("(prefers-reduced-motion: reduce)").matches || Math.abs(t.scrollLeft - n) < 1) {
			t.scrollTo({
				left: n,
				behavior: "auto"
			}), this.#S();
			return;
		}
		this.#v += 1;
		let r = 0, i = () => {
			this.#v && (t.removeEventListener("scrollend", i), clearTimeout(r), --this.#v, this.#v || this.#S());
		};
		t.addEventListener("scrollend", i), r = setTimeout(i, 800), t.scrollTo({
			left: n,
			behavior: "smooth"
		});
	}
	#x() {
		if (this.#y || this.#o || this.#v) return;
		let e = this.#d(), t = e.clientWidth;
		if (!t || this.#e.length < 2) return;
		let n = Math.round(e.scrollLeft / t), r = this.#e.length, i = n <= 0 ? r - 1 : n >= r + 1 ? 0 : n - 1;
		i !== this.#t && (this.#t = i, this.#_(!0));
	}
	#S() {
		let e = this.#e.length, t = this.#d(), n = t.clientWidth;
		if (e < 2 || !n || this.#o) return;
		let r = Math.round(t.scrollLeft / n), i = !1;
		r <= 0 ? (t.scrollTo({
			left: e * n,
			behavior: "auto"
		}), i = !0) : r >= e + 1 && (t.scrollTo({
			left: n,
			behavior: "auto"
		}), i = !0), i && requestAnimationFrame(() => {
			this.dispatchEvent(new CustomEvent("arq:slide", { detail: { index: this.#t } }));
		});
	}
	#C() {
		let e = this.#w();
		!e || this.#o || e !== this.#s && (this.#s = e, this.#d().scrollTo({
			left: this.#p() * e,
			behavior: "auto"
		}));
	}
	#w() {
		let e = this.#d().clientWidth;
		if (!e) return 0;
		let t = `${e}px`;
		for (let e of this.querySelectorAll(":scope > img[slot=\"image\"]")) e.style.setProperty("flex-basis", t, "important"), e.style.setProperty("width", t, "important"), e.style.setProperty("min-width", t, "important"), e.style.setProperty("max-width", t, "important");
		return e;
	}
	#T(e) {
		if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
		let t = e.composedPath(), n = this.#d(), r = this.shadowRoot.querySelector(".thumbs"), i = t.some((e) => e.classList?.contains?.("nav"));
		(t.includes(n) || t.includes(r) || i) && (e.preventDefault(), this.#f(this.#t + (e.key === "ArrowRight" ? 1 : -1), !0));
	}
	#E(e) {
		if (e.pointerType !== "mouse" || e.button !== 0 || this.#e.length < 2) return;
		let t = this.#d();
		this.#o = {
			id: e.pointerId,
			x: e.clientX,
			left: t.scrollLeft,
			index: this.#t,
			moved: !1,
			t: e.timeStamp
		};
	}
	#D(e) {
		let t = this.#o;
		if (!t || e.pointerId !== t.id) return;
		let n = e.clientX - t.x;
		if (!t.moved && Math.abs(n) < so) return;
		let r = this.#d();
		t.moved = !0, r.setPointerCapture(e.pointerId), r.toggleAttribute("data-dragging", !0), e.preventDefault(), r.scrollLeft = t.left - n;
	}
	#O(e) {
		let t = this.#o;
		if (!t || e.pointerId !== t.id) return;
		this.#o = null;
		let n = this.#d();
		if (n.removeAttribute("data-dragging"), n.hasPointerCapture(e.pointerId) && n.releasePointerCapture(e.pointerId), !t.moved) return;
		let r = e.clientX - t.x, i = r / Math.max(e.timeStamp - t.t, 1), a = n.clientWidth || 1, o = t.index;
		if (i > co || r > a * .2 ? --o : (i < -.4 || r < -a * .2) && (o += 1), o === t.index) {
			this.#b(this.#p());
			return;
		}
		this.#f(o, !0);
	}
	#k(e, t, n, r = !1) {
		let i = document.createElement("img");
		i.className = r ? "theme-transition quick" : "theme-transition", i.src = t, i.dataset.fit = this.#n(t), i.alt = "", i.setAttribute("aria-hidden", "true");
		let a = this.shadowRoot.querySelector(".image"), o = this.#a?.isConnected ? this.#a : null;
		a.insertBefore(i, o), this.#a = i, e.src = n, i.addEventListener("transitionend", (e) => {
			e.propertyName === "opacity" && i.remove();
		}, { once: !0 });
		let s = () => {
			if (!i.isConnected) return;
			i.offsetWidth, i.classList.add("fade-out");
			let e = getComputedStyle(i).transitionDuration.split(",")[0];
			Number.parseFloat(e) || i.remove();
		};
		r ? e.decode().catch(() => {}).then(s) : s();
	}
}).define();
//#endregion
//#region src/base/card-link.css?inline
var lo = ".card{--card-above:1;isolation:isolate;position:relative}.card-link{color:inherit;-webkit-tap-highlight-color:var(--arq-color-surface-transparent);text-decoration:none;display:block}.card-link[href],.card-link[href]:after{cursor:pointer}.card:has(.card-link[href]) .card-media ::slotted(*){cursor:pointer!important}.card-link:after{content:\"\";position:absolute;inset:0}.card-link:focus{outline:none}.card:has(.card-link:focus-visible){outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}@media (hover:hover) and (pointer:fine){.card:has(.card-link:hover) .card-media{outline:var(--arq-border-default) solid var(--arq-color-border-hover);outline-offset:calc(var(--arq-border-default) * -1)}}.card-media{background:var(--arq-color-surface-subtle);overflow:hidden}.card-media ::slotted(*){object-fit:cover;width:100%!important;max-width:none!important;height:100%!important;display:block!important}@media (hover:none){.card:has(.card-link:active) .card-media{outline:var(--arq-border-default) solid var(--arq-color-border-hover);outline-offset:calc(var(--arq-border-default) * -1)}}", uo = ":host{min-width:0;display:block}.card{gap:var(--arq-space-gap-md);flex-direction:column;display:flex}.card-media{aspect-ratio:1;background:var(--arq-color-surface-subtle)}:host([size=large]) .card-media{aspect-ratio:7/10}.name{max-width:100%;color:var(--arq-color-text-secondary);overflow-wrap:break-word;align-self:flex-start}:host([size=large]) .name{color:var(--arq-color-text-primary)}";
(class extends L {
	static tag = "arq-family-card";
	static styles = lo + uo;
	static properties = {
		size: {
			type: String,
			values: ["default", "large"],
			default: "default"
		},
		href: { type: String }
	};
	static template = "<div class=\"card\"><div class=\"card-media\"><slot name=\"image\"></slot></div><a class=\"card-link name\"><slot name=\"name\"></slot></a></div>";
	update(e) {
		let t = this.shadowRoot.querySelector(".card-link");
		e.has("href") && (this.href ? t.setAttribute("href", this.href) : t.removeAttribute("href")), e.has("size") && (t.className = `card-link name ${this.size === "large" ? "role-heading-3" : "role-body-lg-medium"}`);
	}
}).define();
//#endregion
//#region src/components/download-card/download-card.css?inline
var fo = ":host{min-width:0;display:block}.card{gap:var(--arq-space-gap-md);flex-direction:column;display:flex}.card-media{aspect-ratio:5/4}.card-media ::slotted(*){object-fit:contain!important}.caption{gap:var(--arq-space-gap-xs);flex-direction:column;display:flex}.title-row{align-items:center;gap:var(--arq-space-gap-sm-md);display:flex}.title{min-width:0;color:var(--arq-color-text-primary);overflow-wrap:break-word;flex:auto}.icon-wrap{color:var(--arq-color-icon-primary);flex:none;display:inline-flex}.icon{width:var(--arq-icon-lg);height:var(--arq-icon-lg)}.description{color:var(--arq-color-text-secondary);margin:0}";
(class extends L {
	static tag = "arq-download-card";
	static styles = lo + fo;
	static properties = {
		href: { type: String },
		showDescription: { type: Boolean }
	};
	static template = `<div class="card"><div class="card-media"><slot name="image"></slot></div><div class="caption"><div class="title-row"><a class="card-link title role-heading-3"><slot name="title"></slot></a><span class="icon-wrap" aria-hidden="true">${R("download")}</span></div><p class="description role-body" hidden><slot name="description"></slot></p></div></div>`;
	update(e) {
		let t = this.shadowRoot, n = t.querySelector(".card-link");
		if (e.has("href")) {
			if (this.href) {
				n.setAttribute("href", this.href);
				let e = new URL(this.href, location.href).origin !== location.origin;
				n.toggleAttribute("download", !e), e ? (n.target = "_blank", n.rel = "noopener") : (n.removeAttribute("target"), n.removeAttribute("rel"));
			} else n.removeAttribute("href");
		}
		t.querySelector(".description").hidden = !this.showDescription;
	}
}).define();
//#endregion
//#region src/components/catalog-card/catalog-card.css?inline
var po = ":host{min-width:0;display:block}.card{gap:var(--arq-space-gap-md);flex-direction:column;display:flex}.cover{color:inherit;text-decoration:none;display:block}.cover[href]{cursor:pointer}.cover:not([href]){cursor:default}.cover:focus{outline:none}.cover:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.card-media{aspect-ratio:7/10;background:var(--arq-color-surface-subtle);overflow:hidden}.card-media ::slotted(*){object-fit:cover;width:100%!important;max-width:none!important;height:100%!important;transition:transform var(--arq-motion-duration-slow) var(--arq-motion-easing-standard)!important;display:block!important}@media (hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference){.card:hover .card-media ::slotted(*){transform:scale(var(--arq-motion-scale-hover))!important}}.title{color:var(--arq-color-text-primary);overflow-wrap:break-word;margin:0}";
(class extends L {
	static tag = "arq-catalog-card";
	static styles = po;
	static properties = { href: { type: String } };
	static template = "<div class=\"card\"><a class=\"cover\"><span class=\"visually-hidden\"></span><div class=\"card-media\"><slot name=\"image\"></slot></div></a><p class=\"title role-body\"><slot name=\"title\"></slot></p></div>";
	setup() {
		this.shadowRoot.querySelector("slot[name=\"title\"]").addEventListener("slotchange", () => this.#t());
	}
	update() {
		this.#t();
	}
	#e() {
		return this.shadowRoot.querySelector("slot[name=\"title\"]").assignedNodes({ flatten: !0 }).map((e) => e.textContent).join("").trim() || "catálogo";
	}
	#t() {
		let e = this.shadowRoot.querySelector(".cover");
		if (e.querySelector(".visually-hidden").textContent = `Ver ${this.#e()}`, !this.href) {
			e.removeAttribute("href"), e.removeAttribute("target"), e.removeAttribute("rel"), e.setAttribute("aria-disabled", "true");
			return;
		}
		e.removeAttribute("aria-disabled"), e.href = this.href, e.target = "_blank", e.rel = "noopener";
	}
}).define();
//#endregion
//#region src/components/download-item/download-item.css?inline
var mo = ":host{min-width:0;display:block}.row{box-sizing:border-box;align-items:center;gap:var(--arq-space-gap-md);width:100%;padding:var(--arq-space-padding-md) 0 calc(var(--arq-space-padding-md) - var(--arq-border-default));border:0;border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle);border-radius:var(--arq-radius-control);background:var(--arq-color-surface-transparent);color:var(--arq-color-text-primary);font:inherit;text-align:start;cursor:pointer;-webkit-tap-highlight-color:var(--arq-color-surface-transparent);margin:0;text-decoration:none;display:flex}.info{gap:var(--arq-space-gap-xs);flex-direction:column;flex:auto;min-width:0;display:flex}.label{overflow-wrap:break-word;align-self:flex-start;position:relative}:host(:not([emphasis=featured])) .label:after{content:\"\";inset-inline:0;height:var(--arq-border-default);transform-origin:100%;transition:transform var(--arq-motion-duration-base) var(--arq-motion-easing-standard);background:currentColor;position:absolute;top:100%;transform:scaleX(0)}.meta{color:var(--arq-color-text-tertiary)}.icon{width:var(--arq-icon-md);height:var(--arq-icon-md);color:var(--arq-color-icon-primary);flex:none}:host([emphasis=featured]) .row{padding:calc(var(--arq-space-padding-md) - var(--arq-border-default)) calc(var(--arq-space-padding-lg) - var(--arq-border-default));border:var(--arq-border-default) solid var(--arq-color-border-strong)}@media (hover:hover) and (pointer:fine){:host(:not([emphasis=featured])) .row:hover .label:after{transform-origin:0;transform:scaleX(1)}:host([emphasis=featured]) .row:hover{background:var(--arq-color-surface-faint)}}.row:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.row:focus:not(:focus-visible){outline:none}@media (hover:none){:host([emphasis=featured]) .row:active{background:var(--arq-color-surface-faint)}}";
(class extends L {
	static tag = "arq-download-item";
	static styles = mo;
	static properties = {
		emphasis: {
			type: String,
			values: ["default", "featured"],
			default: "default"
		},
		href: { type: String },
		loading: { type: Boolean },
		showFormat: { type: Boolean }
	};
	static template = "<div class=\"slot-host\"></div>";
	#e = null;
	update(e) {
		if (this.emphasis === "featured" ? this.removeAttribute("role") : this.setAttribute("role", "listitem"), (e.has("loading") || e.has("showFormat") || this.#e) && this.#t(), !e.has("href") && this.#e) return;
		let t = this.href ? "a" : "button";
		if (this.#e?.localName !== t) {
			let e = document.createElement(t);
			e.className = "row", e.innerHTML = `<span class="info"><span class="label role-body-xl"><span class="name"><slot></slot></span><span class="busy" hidden>Generando…</span></span><span class="meta role-body-compact-regular" hidden><slot name="meta"></slot></span></span>${R(t === "a" ? "arrow-up-right" : "download")}`, t === "button" && (e.type = "button", e.addEventListener("click", () => {
				this.loading || this.emit("download", {});
			})), this.shadowRoot.querySelector(".slot-host").replaceChildren(e), this.#e = e, this.#t();
		}
		this.href && (this.#e.setAttribute("href", this.href), this.#e.setAttribute("target", "_blank"), this.#e.setAttribute("rel", "noopener"));
	}
	#t() {
		if (!this.#e) return;
		let e = !(!this.loading || this.href);
		this.#e.toggleAttribute("aria-busy", e), this.#e.querySelector(".name").hidden = e, this.#e.querySelector(".busy").hidden = !e, this.#e.querySelector(".meta").hidden = !this.showFormat || !this.querySelector(":scope > [slot=\"meta\"]");
	}
	focus(e) {
		this.#e ? this.#e.focus(e) : super.focus(e);
	}
}).define();
//#endregion
//#region src/components/download-file-row/download-file-row.css?inline
var ho = ":host{min-width:0;display:block}.row{box-sizing:border-box;align-items:center;gap:var(--arq-space-gap-md);width:100%;padding:var(--arq-space-padding-md) 0 calc(var(--arq-space-padding-md) - var(--arq-border-default));border:0;border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle);border-radius:var(--arq-radius-control);background:var(--arq-color-surface-transparent);color:var(--arq-color-text-primary);font:inherit;text-align:start;cursor:pointer;-webkit-tap-highlight-color:var(--arq-color-surface-transparent);margin:0;text-decoration:none;display:flex}.info{gap:var(--arq-space-gap-xs);flex-direction:column;flex:auto;min-width:0;display:flex}.label{color:var(--arq-color-text-primary);overflow-wrap:break-word;align-self:flex-start;position:relative}.label:after{content:\"\";inset-inline:0;height:var(--arq-border-default);transform-origin:100%;transition:transform var(--arq-motion-duration-base) var(--arq-motion-easing-standard);background:currentColor;position:absolute;top:100%;transform:scaleX(0)}.meta{color:var(--arq-color-text-tertiary)}.icon{width:var(--arq-icon-md);height:var(--arq-icon-md);color:var(--arq-color-icon-primary);flex:none}@media (hover:hover) and (pointer:fine){.row:hover .label:after{transform-origin:0;transform:scaleX(1)}}.row:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.row:focus:not(:focus-visible){outline:none}";
(class extends L {
	static tag = "arq-download-file-row";
	static styles = ho;
	static properties = {
		href: { type: String },
		showFormat: { type: Boolean },
		loading: { type: Boolean }
	};
	static template = "<div class=\"slot-host\"></div>";
	#e = null;
	#t = null;
	update(e) {
		this.setAttribute("role", "listitem"), (e.has("href") || !this.#e) && this.#n(), this.#t?.();
		let t = !(!this.loading || this.href);
		this.#e.toggleAttribute("aria-busy", t), this.#e.querySelector(".name").hidden = t, this.#e.querySelector(".busy").hidden = !t;
	}
	#n() {
		let e = this.href ? "a" : "button";
		if (this.#e?.localName !== e) {
			let t = document.createElement(e);
			t.className = "row", t.innerHTML = `<span class="info"><span class="label role-body-xl"><span class="name"><slot></slot></span><span class="busy" hidden>Generando…</span></span><span class="meta role-body-compact-regular"><slot name="meta"></slot></span></span>${R("download")}`;
			let n = t.querySelector("slot[name=\"meta\"]"), r = () => n.parentElement.hidden = !this.showFormat || !n.assignedNodes().length;
			this.#t = r, n.addEventListener("slotchange", r), r(), e === "button" && (t.type = "button", t.addEventListener("click", () => {
				this.loading || this.emit("download", {});
			})), this.shadowRoot.querySelector(".slot-host").replaceChildren(t), this.#e = t;
		}
		this.href && (this.#e.setAttribute("href", this.href), this.#e.setAttribute("download", ""));
	}
	focus(e) {
		this.#e ? this.#e.focus(e) : super.focus(e);
	}
}).define();
//#endregion
//#region src/components/download-modal/download-modal.css?inline
var go = ":host{display:contents}.dialog{box-sizing:border-box;width:100%;max-width:none;height:100%;max-height:none;padding:var(--arq-layout-gutter);background:var(--arq-color-surface-transparent);color:var(--arq-color-text-primary);overscroll-behavior:contain;border:0;margin:0;position:fixed;inset:0;overflow-y:auto}.dialog[open]{flex-direction:column;display:flex}.dialog::backdrop{background:var(--arq-color-overlay-scrim)}:host{--panel-slow:var(--arq-motion-duration-panel)}.dialog:not(.is-open){--panel-slow:var(--arq-motion-duration-expand)}.dialog::backdrop{opacity:0;transition:opacity var(--panel-slow) var(--arq-motion-easing-standard)}.dialog.is-open::backdrop{opacity:1}.dialog:not(.is-open){pointer-events:none}.dialog:not(.is-settled){overflow:clip}.sheet{opacity:0;transition-property:opacity,transform;transition-duration:var(--panel-slow);transition-timing-function:var(--arq-motion-easing-standard);transform:translateY(2%)}.dialog.is-open .sheet{opacity:1;transform:none}.sheet{box-sizing:border-box;gap:var(--arq-space-gap-2xl);width:var(--arq-layout-filter-panel);max-width:100%;padding:var(--arq-space-padding-xl-2xl);border:var(--arq-border-default) solid var(--arq-color-border-default);border-radius:var(--arq-radius-control);background:var(--arq-color-surface-default);flex-direction:column;flex:none;margin:auto 0 0 auto;display:flex}.header{justify-content:space-between;align-items:flex-start;gap:var(--arq-space-gap-md);display:flex}.title-wrap{gap:var(--arq-space-gap-sm);flex-direction:column;min-width:0;display:flex}.title{min-width:0;color:var(--arq-color-text-primary)}.content{gap:var(--arq-space-gap-md);flex-direction:column;display:flex}::slotted(arq-form-message:empty){position:absolute}.list{flex-direction:column;display:flex}@media (width<=767px){.sheet{width:auto;margin-inline-start:0}}:host([show-product]) .sheet{gap:var(--arq-space-gap-xl)}.product{align-items:center;gap:var(--arq-space-gap-md);min-width:0;display:flex}.thumb{width:var(--arq-layout-download-thumb);height:var(--arq-layout-download-thumb);background:var(--arq-color-surface-subtle);flex:none;overflow:hidden}.thumb img{object-fit:cover;width:100%;height:100%;display:block}.product-info{gap:var(--arq-space-gap-xs);flex-direction:column;min-width:0;display:flex}.meta{color:var(--arq-color-text-tertiary)}@media (width<=767px){:host([show-product]) .dialog{padding:var(--arq-space-0)}:host([show-product]) .sheet{width:100%;padding:var(--arq-space-padding-lg) var(--arq-layout-gutter) calc(var(--arq-space-padding-xl) + env(safe-area-inset-bottom,var(--arq-space-0)));border-inline:0;opacity:1;border-bottom:0;margin:auto 0 0;transform:translateY(100%)}:host([show-product]) .dialog.is-open .sheet{transform:none}}@media (prefers-reduced-motion:reduce){.sheet,:host([show-product]) .sheet{opacity:0;transition-property:opacity,transform;transition-duration:var(--arq-motion-duration-fade), 0s;transition-timing-function:var(--arq-motion-easing-out);transform:none}.dialog.is-open .sheet,:host([show-product]) .dialog.is-open .sheet{opacity:1}.dialog::backdrop{transition:opacity var(--arq-motion-duration-fade) var(--arq-motion-easing-out)}}";
(class extends L {
	static tag = "arq-download-modal";
	static styles = go;
	static properties = {
		open: { type: Boolean },
		sku: { type: String },
		showProduct: { type: Boolean },
		thumb: { type: String },
		meta: { type: String }
	};
	static template = "<dialog class=\"dialog\" data-arq-theme=\"light\"><div class=\"sheet\"><div class=\"header\"><div class=\"title-wrap\"><div class=\"title role-heading-2\"><slot name=\"title\"></slot></div><arq-sku class=\"sku\" size=\"compact\" hidden></arq-sku></div><arq-icon-button icon=\"close\" size=\"large\" class=\"close\">Cerrar descargas</arq-icon-button></div><div class=\"product\" hidden><span class=\"thumb\"><img alt=\"\" hidden></span><span class=\"product-info\"><arq-sku class=\"product-sku\" size=\"compact\"></arq-sku><span class=\"meta role-body-compact-regular\"></span></span></div><div class=\"content\"><div class=\"featured\"><slot name=\"featured\"></slot></div><slot name=\"message\"></slot><div class=\"list\" role=\"list\"><slot></slot></div></div></div></dialog>";
	#e = null;
	#t = null;
	#n = null;
	setup() {
		this.#e = this.shadowRoot.querySelector("dialog");
		let e = this.shadowRoot.querySelector(".thumb img");
		e.addEventListener("error", () => e.hidden = !0), e.addEventListener("load", () => e.hidden = !1), z(this.#e), this.shadowRoot.querySelector(".close").addEventListener("click", () => this.close()), this.#e.addEventListener("click", (e) => {
			e.target === this.#e && this.close();
		}), this.#e.addEventListener("cancel", (e) => {
			e.preventDefault(), this.close();
		});
		let t = () => {
			for (let e of this.querySelectorAll(":scope > arq-download-item")) {
				let t = e.getAttribute("emphasis") === "featured";
				t && e.slot !== "featured" && (e.slot = "featured"), !t && e.slot === "featured" && e.removeAttribute("slot");
			}
		};
		new MutationObserver(t).observe(this, {
			childList: !0,
			attributes: !0,
			subtree: !0,
			attributeFilter: ["emphasis"]
		}), t(), this.shadowRoot.querySelector("slot[name=\"title\"]").addEventListener("slotchange", () => this.#o()), this.#o();
	}
	update(e) {
		if (e.has("sku") || e.has("showProduct")) {
			let e = this.shadowRoot.querySelector(".sku");
			e.textContent = this.sku ?? "", e.hidden = !this.sku || this.showProduct, this.shadowRoot.querySelector(".product-sku").textContent = this.sku ?? "", this.shadowRoot.querySelector(".product").hidden = !this.showProduct || !this.sku;
		}
		if (e.has("meta")) {
			let e = this.shadowRoot.querySelector(".meta");
			e.textContent = this.meta ?? "", e.hidden = !this.meta;
		}
		if (e.has("thumb")) {
			let e = this.shadowRoot.querySelector(".thumb img");
			this.thumb ? e.src = this.thumb : (e.removeAttribute("src"), e.hidden = !0);
		}
		e.has("open") && (this.open ? this.#r() : this.#e.open && this.#i());
	}
	#r() {
		let e = this.#e, t = this.shadowRoot.querySelector(".sheet");
		clearTimeout(this.#n), this.#n = null, e.open || (e.classList.remove("is-settled"), e.showModal(), e.scrollTop = 0, e.offsetHeight), e.classList.add("is-open");
		let n = (r) => {
			(!r || r.target === t && ["transform", "opacity"].includes(r.propertyName)) && (t.removeEventListener("transitionend", n), e.classList.contains("is-open") && e.classList.add("is-settled"));
		};
		parseFloat(getComputedStyle(t).transitionDuration) ? t.addEventListener("transitionend", n) : n();
	}
	#i() {
		let e = this.#e;
		if (this.#n) return;
		e.classList.remove("is-open", "is-settled");
		let { transitionDuration: t } = getComputedStyle(this.shadowRoot.querySelector(".sheet")), n = Math.max(0, ...t.split(",").map((e) => (parseFloat(e) || 0) * (e.trim().endsWith("ms") ? 1 : 1e3)));
		this.#n = setTimeout(() => {
			this.#n = null, e.close(), this.#t?.focus?.(), this.#t = null;
		}, n);
	}
	show(e) {
		this.#t = e ?? this.#a(), this.open = !0;
	}
	close() {
		this.open = !1;
	}
	#a() {
		let e = document.activeElement;
		for (; e?.shadowRoot?.activeElement;) e = e.shadowRoot.activeElement;
		let t = e?.getRootNode?.();
		return t instanceof ShadowRoot ? t.host : e;
	}
	#o() {
		let e = this.querySelector("[slot=\"title\"]")?.textContent.trim();
		this.#e.setAttribute("aria-label", e || "Descargas");
	}
}).define();
//#endregion
//#region src/components/catalog-nav-item/catalog-nav-item.css?inline
var _o = ":host{min-width:0;display:flex}.link{align-items:center;gap:var(--arq-space-gap-sm);min-width:0;padding-block:var(--arq-space-padding-xs);color:var(--arq-color-text-secondary);-webkit-tap-highlight-color:var(--arq-color-surface-transparent);padding-inline-start:var(--arq-space-padding-sm-md);text-decoration:none;display:inline-flex}.label{overflow-wrap:break-word;min-width:0}.indicator{width:var(--arq-space-gap-sm-md);height:var(--arq-border-default);background:var(--arq-color-text-primary);transition-property:background-color;transition-duration:var(--arq-theme-text-duration,var(--arq-motion-duration-fast));transition-delay:var(--arq-theme-text-delay,0s);flex:none;display:none}:host([size=large]) .link{color:var(--arq-color-text-tertiary)}@media (hover:hover) and (pointer:fine){.link:hover{color:var(--arq-color-text-primary)}}:host([selected]) .link{color:var(--arq-color-text-primary)}:host([selected]) .indicator{display:block}.link:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.link:focus:not(:focus-visible){outline:none}@media (hover:none){.link:active{color:var(--arq-color-text-primary)}}";
(class extends L {
	static tag = "arq-catalog-nav-item";
	static styles = _o;
	static properties = {
		size: {
			type: String,
			values: ["default", "large"],
			default: "default"
		},
		selected: { type: Boolean },
		href: { type: String }
	};
	static template = "<a class=\"link\"><span class=\"indicator\" aria-hidden=\"true\"></span><span class=\"label\"><slot></slot></span></a>";
	setup() {
		this.setAttribute("role", "listitem");
	}
	update() {
		let e = this.shadowRoot.querySelector(".link");
		this.href ? e.setAttribute("href", this.href) : e.removeAttribute("href"), this.selected ? e.setAttribute("aria-current", "page") : e.removeAttribute("aria-current");
		let t = `role-body-${this.size === "large" ? "lg" : "compact"}${this.selected ? "-regular" : ""}`;
		this.shadowRoot.querySelector(".label").className = `label ${t}`;
	}
}).define();
//#endregion
//#region src/components/catalog-nav-group/catalog-nav-group.css?inline
var vo = ":host{min-width:0;display:block}.group:after{content:\"\";border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle);display:block}.header{box-sizing:border-box;width:100%;padding:var(--arq-space-padding-md) 0;background:var(--arq-color-surface-transparent);color:var(--arq-color-text-secondary);font:inherit;text-align:start;cursor:pointer;-webkit-tap-highlight-color:var(--arq-color-surface-transparent);border:0;justify-content:space-between;align-items:center;margin:0;display:flex}:host([open]) .header{padding-bottom:var(--arq-space-gap-md);color:var(--arq-color-text-primary)}.label{overflow-wrap:break-word;min-width:0}.icon-box{padding:var(--arq-space-padding-xs);border-radius:var(--arq-radius-control);background:var(--arq-color-surface-transparent);color:var(--arq-color-icon-primary);flex:none;display:inline-flex}.icon{width:var(--arq-icon-md);height:var(--arq-icon-md);transition:rotate var(--arq-motion-duration-expand) var(--arq-motion-easing-standard)}:host([open]) .icon{rotate:180deg}@media (hover:hover) and (pointer:fine){.header:hover .icon-box{background:var(--arq-color-surface-hover)}}.items-inner{padding-inline-start:var(--arq-space-padding-lg);padding-bottom:calc(var(--arq-space-padding-md) + var(--arq-space-padding-xs))}.rail{border-inline-start:var(--arq-border-default) solid var(--arq-color-border-subtle);flex-direction:column;align-items:flex-start;display:flex}.header:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.header:focus:not(:focus-visible){outline:none}";
(class extends L {
	static tag = "arq-catalog-nav-group";
	static styles = vo;
	static properties = {
		open: { type: Boolean },
		selected: { type: Boolean }
	};
	static template = `<div class="group"><button type="button" class="header"><span class="label role-body-xl"><slot name="label"></slot></span><span class="icon-box">${R("chevron-down")}</span></button><div class="items" part="panel"><div class="items-clip"><div class="items-inner"><div class="rail" role="list"><slot></slot></div></div></div></div></div>`;
	#e = !1;
	#t = 0;
	#n() {
		return this.#t = this.querySelector(":scope > arq-catalog-nav-item")?.offsetHeight || this.#t, this.#t;
	}
	setup() {
		let e = this.shadowRoot.querySelector(".header"), t = null;
		e.addEventListener("click", () => {
			t = this.getBoundingClientRect().height, this.#n();
		}), this.disclosure = new Li(this, {
			trigger: e,
			panel: this.shadowRoot.querySelector(".items")
		}), this.addEventListener("arq:toggle", (e) => {
			e.target === this && (this.#r(t), t = null);
		});
		let n = () => this.#i();
		this.shadowRoot.querySelector("slot:not([name])").addEventListener("slotchange", n), new MutationObserver(n).observe(this, {
			subtree: !0,
			attributes: !0,
			attributeFilter: ["selected"]
		}), n();
	}
	#r(e) {
		if (e === null) return;
		let t = getComputedStyle(this), n = (e) => Number.parseFloat(t.getPropertyValue(e)) || 0, r = n(this.open ? "--arq-motion-duration-panel" : "--arq-motion-duration-expand");
		if (!r) return;
		let i = this.shadowRoot.querySelector(".group"), a = this.shadowRoot.querySelector(".items"), o = this.shadowRoot.querySelector(".icon"), s = [];
		for (let e = this.nextElementSibling; e; e = e.nextElementSibling) s.push(e);
		let c = s.length ? new DOMMatrixReadOnly(getComputedStyle(s[0]).transform).m42 : 0, l = getComputedStyle(o).rotate;
		for (let e of [
			i,
			a,
			o,
			...s
		]) e.getAnimations().forEach((e) => e.cancel());
		let u = e - this.getBoundingClientRect().height + c;
		if (!u) return;
		let d = this.#n() || Math.abs(u), f = Math.min(Math.max((Math.abs(u) / d - 4) / 11, 0), 1), p = n(this.open ? "--arq-motion-duration-fold" : "--arq-motion-duration-panel"), m = {
			duration: Math.round(r + (p - r) * f),
			easing: t.getPropertyValue("--arq-motion-easing-in-out").trim() || "ease-in-out"
		}, h = [{ transform: `translateY(${u}px)` }, { transform: "none" }];
		i.animate(h, {
			...m,
			pseudoElement: "::after"
		});
		for (let e of s) e.animate(h, m);
		this.open && a.animate([{ clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0)" }], m), o.animate([{ rotate: l }, { rotate: getComputedStyle(o).rotate }], m);
	}
	#i() {
		let e = !!this.querySelector(":scope > arq-catalog-nav-item[selected]");
		e && !this.selected ? (this.#e = !0, this.selected = !0) : !e && this.selected && this.#e && (this.#e = !1, this.selected = !1);
	}
}).define();
//#endregion
//#region src/components/catalog-nav/catalog-nav.css?inline
var yo = ":host{min-width:0;display:block}.nav{background:var(--arq-color-surface-transparent)}.trigger{display:none}.panel,.panel[hidden]{display:block!important}@media (width<=1023px){.panel,.panel[hidden]{padding-inline:var(--arq-space-padding-md)}.nav{border-block:var(--arq-border-default) solid var(--arq-color-border-default)}.panel[hidden]{display:none!important}.trigger{box-sizing:border-box;justify-content:space-between;align-items:center;gap:var(--arq-space-gap-md);width:100%;padding:var(--arq-space-padding-md);background:var(--arq-color-surface-transparent);color:var(--arq-color-text-primary);font:inherit;text-align:start;cursor:pointer;-webkit-tap-highlight-color:var(--arq-color-surface-transparent);border:0;margin:0;display:flex}:host([open]) .trigger{background:var(--arq-color-surface-faint)}@media (hover:hover) and (pointer:fine){.trigger:hover{background:var(--arq-color-surface-faint)}:host(:not([open])) .trigger:hover .icon-box{background:var(--arq-color-surface-hover)}}.trigger:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.trigger:focus:not(:focus-visible){outline:none}}.current{align-items:center;gap:var(--arq-space-gap-sm);min-width:0;display:inline-flex}.current-label{overflow-wrap:break-word;min-width:0}.indicator{width:var(--arq-space-gap-sm-md);height:var(--arq-border-default);background:var(--arq-color-text-primary);flex:none}.icon-box{padding:var(--arq-space-padding-xs);border-radius:var(--arq-radius-control);background:var(--arq-color-surface-transparent);color:var(--arq-color-icon-primary);flex:none;display:inline-flex}:host([open]) .icon-box{background:var(--arq-color-surface-default)}.icon{width:var(--arq-icon-md);height:var(--arq-icon-md)}:host(:not([open])) [data-icon=minus],:host([open]) [data-icon=plus]{display:none}";
(class extends L {
	static tag = "arq-catalog-nav";
	static styles = yo;
	static properties = {
		open: { type: Boolean },
		label: {
			type: String,
			default: "Categorías"
		}
	};
	static template = `<nav class="nav"><button type="button" class="trigger"><span class="current"><span class="indicator" aria-hidden="true"></span><span class="current-label role-body-regular"></span></span><span class="icon-box">${R("plus")}${R("minus")}</span></button><div class="panel" part="panel"><slot></slot></div></nav>`;
	setup() {
		this.disclosure = new Li(this, {
			trigger: this.shadowRoot.querySelector(".trigger"),
			panel: this.shadowRoot.querySelector(".panel")
		});
		let e = () => {
			this.#n(), this.#r(), this.#a();
		};
		this.shadowRoot.querySelector("slot").addEventListener("slotchange", e), new MutationObserver(e).observe(this, {
			subtree: !0,
			childList: !0,
			characterData: !0,
			attributes: !0,
			attributeFilter: ["selected"]
		}), this.addEventListener("arq:toggle", (e) => {
			let t = e.target;
			if (t.localName === "arq-catalog-nav-group" && (this.#i = !0, t.dataset.arqNav === "colecciones" && t.open)) for (let e of this.querySelectorAll("arq-catalog-nav-group")) e !== t && e.open && (e.open = !1);
		}), e();
	}
	update(e) {
		e.has("label") && this.shadowRoot.querySelector(".nav").setAttribute("aria-label", this.label ?? "");
	}
	#e() {
		return this.querySelector("arq-catalog-nav-group[selected]");
	}
	#t() {
		return (this.#e() ?? this).querySelector("arq-catalog-nav-item[selected]");
	}
	#n() {
		let e = this.#t();
		this.shadowRoot.querySelector(".current-label").textContent = e ? e.textContent.trim() : this.label ?? "", this.shadowRoot.querySelector(".indicator").hidden = !e;
	}
	#r() {
		let e = this.#t()?.closest("arq-catalog-nav-group");
		for (let t of this.querySelectorAll("arq-catalog-nav-group")) {
			let n = t === e;
			t.selected !== n && (t.selected = n);
		}
	}
	#i = !1;
	#a() {
		let e = this.#e();
		if (e) {
			if (this.#i) {
				e.open ||= !0;
				return;
			}
			this.#i = !0;
			for (let t of this.querySelectorAll("arq-catalog-nav-group")) t.open = t === e;
		}
	}
}).define();
//#endregion
//#region src/components/toggle/toggle.css?inline
var bo = ":host{vertical-align:middle;max-width:100%;display:inline-flex}.toggle{align-items:center;gap:var(--arq-space-gap-sm);cursor:pointer;max-width:100%;display:inline-flex;position:relative}.track{box-sizing:border-box;width:calc(var(--arq-space-padding-2xs) * 2 + var(--arq-icon-sm) * 2 + var(--arq-space-gap-sm));height:calc(var(--arq-space-padding-2xs) * 2 + var(--arq-icon-sm));padding:calc(var(--arq-space-padding-2xs) - var(--arq-border-default));border:var(--arq-border-default) solid var(--arq-color-border-strong);border-radius:var(--arq-radius-pill);background:var(--arq-color-surface-transparent);flex:none;align-items:center;display:inline-flex}.thumb{width:var(--arq-icon-sm);height:var(--arq-icon-sm);border-radius:var(--arq-radius-pill);background:var(--arq-color-icon-primary);transition-property:transform,background-color;transition-duration:var(--arq-motion-duration-fast), var(--arq-theme-surface-duration,var(--arq-motion-duration-fast));transition-delay:0s;transition-timing-function:var(--arq-motion-easing-in-out), var(--arq-theme-surface-easing,var(--arq-motion-easing-standard))}.label{min-width:0;color:var(--arq-color-text-primary)}.native:checked+.track{border-color:var(--arq-color-action-primary);background:var(--arq-color-action-primary)}.native:checked+.track .thumb{background:var(--arq-color-action-on-primary);transform:translateX(calc(var(--arq-icon-sm) + var(--arq-space-gap-sm)))}:host([disabled]) .toggle{cursor:default}:host([disabled]) .track{border-color:var(--arq-color-border-disabled);background:var(--arq-color-surface-transparent)}:host([disabled]) .native:checked+.track{border-color:var(--arq-color-border-disabled);background:var(--arq-color-surface-strong)}:host([disabled]) .thumb,:host([disabled]) .native:checked+.track .thumb{background:var(--arq-color-icon-disabled)}:host([disabled]) .label{color:var(--arq-color-text-disabled)}:host([theme=inverse]:not([disabled])) .track{border-color:var(--arq-color-icon-secondary)}:host([theme=inverse]:not([disabled])) .thumb{background:var(--arq-color-icon-secondary)}:host([theme=inverse]:not([disabled])) .label{color:var(--arq-color-text-secondary)}:host([theme=inverse]:not([disabled])) .native:checked+.track{border-color:var(--arq-color-icon-secondary);background:var(--arq-color-icon-secondary)}:host([theme=inverse]:not([disabled])) .native:checked+.track .thumb{background:var(--arq-color-action-on-primary)}.native:focus-visible+.track{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}@media (forced-colors:active){.track,.thumb{forced-color-adjust:none}.track,:host([theme=inverse]:not([disabled])) .track{background:canvas;border-color:canvastext}.thumb,:host([theme=inverse]:not([disabled])) .thumb{background:canvastext}.native:checked+.track,:host([theme=inverse]:not([disabled])) .native:checked+.track{background:highlight;border-color:highlight}.native:checked+.track .thumb,:host([theme=inverse]:not([disabled])) .native:checked+.track .thumb{background:highlighttext}:host([disabled]) .track,:host([disabled]) .native:checked+.track{background:canvas;border-color:graytext}:host([disabled]) .thumb,:host([disabled]) .native:checked+.track .thumb{background:graytext}}";
(class extends L {
	static tag = "arq-toggle";
	static styles = bo;
	static formAssociated = !0;
	static properties = {
		checked: { type: Boolean },
		disabled: { type: Boolean },
		showLabel: { type: Boolean },
		theme: {
			type: String,
			values: ["default", "inverse"],
			default: "default"
		},
		name: { type: String },
		value: {
			type: String,
			default: "on"
		}
	};
	static template = "<label class=\"toggle\"><input type=\"checkbox\" role=\"switch\" class=\"native visually-hidden\"><span class=\"track\" aria-hidden=\"true\"><span class=\"thumb\"></span></span><span class=\"label role-body-regular\"><slot></slot></span></label>";
	#e = this.attachInternals();
	#t = null;
	#n = !1;
	setup() {
		this.#n = this.checked, this.#t = this.shadowRoot.querySelector("input"), this.#t.addEventListener("change", () => {
			this.checked = this.#t.checked, this.emit("change", {
				checked: this.#t.checked,
				value: this.value
			});
		});
	}
	focus(e) {
		this.#t ? this.#t.focus(e) : super.focus(e);
	}
	update() {
		this.#t.checked = this.checked, this.#t.disabled = this.disabled, this.shadowRoot.querySelector(".label").classList.toggle("visually-hidden", !this.showLabel);
		let e = this.shadowRoot.querySelector(".toggle");
		this.theme === "inverse" ? e.setAttribute("data-arq-theme", "dark") : e.removeAttribute("data-arq-theme"), this.#e.setFormValue(this.checked ? this.value : null);
	}
	formResetCallback() {
		this.checked = this.#n;
	}
	formDisabledCallback(e) {
		this.#t.disabled = e || this.disabled;
	}
}).define();
//#endregion
//#region src/components/catalog-toolbar/catalog-toolbar.css?inline
var xo = ":host{min-width:0;display:block}.bar{justify-content:space-between;align-items:center;gap:var(--arq-space-gap-sm-md) var(--arq-space-gap-md);padding-block:var(--arq-space-padding-md);border-block:var(--arq-border-default) solid var(--arq-color-border-subtle);background:var(--arq-color-surface-transparent);transition:border-top-color var(--arq-motion-duration-fast) var(--arq-motion-easing-standard);flex-wrap:wrap;display:flex}:host([stuck]) .bar{border-top-color:var(--arq-color-surface-transparent)}.count{color:var(--arq-color-text-secondary);white-space:nowrap;flex:none;margin:0}.actions{align-items:center;gap:var(--arq-space-gap-xl);flex:none;margin-inline-start:auto;display:flex}.lead{align-items:stretch;gap:var(--arq-space-gap-xl);display:flex}@media (width<=767px){.actions,.lead{gap:var(--arq-space-gap-lg)}}", So = { productos: ["producto", "productos"] }, Co = new Intl.NumberFormat("es-AR");
(class extends L {
	static tag = "arq-catalog-toolbar";
	static styles = xo;
	static properties = {
		count: { type: Number },
		unit: {
			type: String,
			values: ["productos"],
			default: "productos"
		},
		showIluminar: { type: Boolean },
		stuck: { type: Boolean },
		for: { type: String },
		filterCount: { type: Number }
	};
	static template = "<div class=\"bar\"><p class=\"count role-body\" aria-live=\"polite\"></p><div class=\"actions\"><div class=\"lead\"><arq-toggle show-label class=\"iluminar\">Iluminar</arq-toggle><arq-divider orientation=\"vertical\"></arq-divider></div><arq-button type=\"outline\" show-icon icon=\"filter\" count-label=\"filtros activos\" class=\"filter\">Filtrar</arq-button></div></div>";
	#e = null;
	#t = null;
	#n = null;
	setup() {
		let e = this.shadowRoot;
		this.#t = e.querySelector(".iluminar"), this.#n = e.querySelector(".filter"), this.#n.addEventListener("click", () => this.#u()), this.#t.addEventListener("arq:change", (e) => {
			e.stopPropagation(), this.#a(e.detail.checked);
		}), new MutationObserver(() => this.#o()).observe(document.documentElement, {
			attributes: !0,
			attributeFilter: ["data-arq-theme"]
		}), this.#o(), customElements.whenDefined("arq-button").then(() => this.#d());
	}
	update(e) {
		(e.has("count") || e.has("unit")) && this.#r(), e.has("showIluminar") && (this.shadowRoot.querySelector(".lead").hidden = !this.showIluminar), e.has("for") && this.#s(), e.has("filterCount") && this.#i();
	}
	#r() {
		let [e, t] = So[this.unit] ?? So.productos, n = this.shadowRoot.querySelector(".count");
		n.textContent = Number.isFinite(this.count) ? `${Co.format(this.count)} ${this.count === 1 ? e : t}` : "";
	}
	#i() {
		let e = Number.isFinite(this.filterCount) ? this.filterCount : 0, t = this.#n;
		t.showCount = e > 0, t.count = e > 0 ? e : null, t.icon = e > 0 ? "filter-off" : "filter";
	}
	#a(e) {
		let t = document.documentElement, n = this.#t.getBoundingClientRect();
		za(e, () => {
			e ? t.setAttribute("data-arq-theme", "dark") : t.removeAttribute("data-arq-theme"), Ca(e);
		}, {
			x: n.left + n.width / 2,
			y: n.top + n.height / 2
		});
	}
	#o() {
		this.#t.checked = document.documentElement.getAttribute("data-arq-theme") === "dark";
	}
	#s() {
		let e = this.for ? this.getRootNode().getElementById?.(this.for) : null;
		this.for && !e && setTimeout(() => {
			this.#e || console.warn(`[arq] <arq-catalog-toolbar for="${this.for}">: no hay un elemento con ese id.`);
		}), e !== this.#e && (this.#e?.removeEventListener("arq:apply", this.#c), this.#e = e, e && (e.addEventListener("arq:apply", this.#c), customElements.whenDefined("arq-filter-panel").then(() => {
			this.filterCount = this.#l(e.filters), this.#d();
		})));
	}
	#c = (e) => {
		this.filterCount = this.#l(e.detail.filters);
	};
	#l(e) {
		return Object.values(e ?? {}).flat().length;
	}
	#u() {
		this.#e?.show ? this.#e.show(this.#n) : this.emit("filter-open", {});
	}
	#d() {
		let e = this.#n.shadowRoot?.querySelector(".control");
		e && (e.setAttribute("aria-haspopup", "dialog"), "ariaControlsElements" in e && (e.ariaControlsElements = this.#e ? [this.#e] : null));
	}
}).define();
//#endregion
//#region src/components/product-card/product-card.css?inline
var wo = ":host{min-width:0;display:block}.card{gap:var(--arq-space-gap-md);--card-above:4;flex-direction:column;display:flex}.card-link:after{z-index:3}.card.is-small{gap:var(--arq-space-gap-sm)}.card-media{aspect-ratio:var(--card-ratio,7 / 10);background-color:var(--arq-color-surface-subtle);transition-property:background-color;transition-delay:0s;transition-duration:var(--arq-card-ground-duration,var(--arq-motion-duration-slow));transition-timing-function:var(--arq-motion-easing-standard);position:relative}@media (prefers-reduced-motion:reduce){.card-media{transition-duration:var(--arq-card-ground-duration,var(--arq-motion-duration-fade))}}@media (hover:hover) and (pointer:fine){.card.is-media-hover .card-media{background-color:var(--arq-color-surface-inverse-hover)}.card:has(.card-link:hover) .card-media{outline:none}}.card.is-dark.is-media-hover .card-media{background-color:var(--arq-color-surface-subtle)}.card.is-dark:has(.card-link:focus-visible) .card-media{background-color:var(--arq-color-surface-subtle)}.card:has(.card-link:focus-visible) .card-media{background-color:var(--arq-color-surface-inverse-hover)}.img{z-index:1;object-fit:cover;visibility:hidden;width:100%;height:100%;position:absolute;inset:0}.card.is-contain .img,.card.is-contain .theme-transition{box-sizing:border-box;object-fit:contain}.card.is-wide .img,.card.is-wide .theme-transition{box-sizing:border-box;padding-inline:var(--arq-space-padding-2xl)}.theme-transition{z-index:2;object-fit:cover;opacity:1;pointer-events:none;width:100%;height:100%;transition-property:opacity;transition-duration:var(--arq-illumination-image-duration,var(--arq-motion-duration-slow));transition-timing-function:var(--arq-illumination-image-easing,var(--arq-motion-easing-standard));position:absolute;inset:0}.theme-transition.fade-out{opacity:0}.img.loaded{visibility:visible}.base.reveal{opacity:0;transition:none}.base.reveal.loaded{opacity:1;transition-property:opacity;transition-duration:var(--arq-motion-duration-slow);transition-timing-function:var(--arq-motion-easing-standard)}@media (prefers-reduced-motion:reduce){.base.reveal.loaded{transition-duration:var(--arq-motion-duration-fade)}}.hover{opacity:0;transition-property:opacity,color,background-color,border-color,outline-color,text-decoration-color,fill,stroke;transition-duration:var(--arq-motion-duration-slow);transition-timing-function:var(--arq-motion-easing-illumination-image)}@media (prefers-reduced-motion:reduce){.hover{transition-duration:var(--arq-motion-duration-fade)}}.card.has-hover:has(.card-link:focus-visible) .hover.loaded{opacity:1}@media (hover:hover) and (pointer:fine){.card.has-hover.is-media-hover .hover.loaded{opacity:1}}.base{transition-property:opacity;transition-duration:var(--arq-motion-duration-slow);transition-timing-function:var(--arq-motion-easing-illumination-image)}@media (prefers-reduced-motion:reduce){.base{transition-duration:var(--arq-motion-duration-fade)}}.card.hover-unlit.is-media-hover .base{opacity:0}.card.hover-unlit:has(.card-link:focus-visible) .base{opacity:0}.fallback{z-index:1;padding:var(--arq-space-padding-md);color:var(--arq-color-text-secondary);text-align:center;overflow-wrap:break-word;justify-content:center;align-items:center;display:flex;position:absolute;inset:0}.info{align-items:flex-start;gap:var(--arq-space-gap-xs);padding-top:var(--arq-space-gap-xs);padding-bottom:var(--arq-space-gap-sm);flex-direction:column;display:flex}.title{align-items:center;gap:var(--arq-space-gap-sm);align-self:stretch;display:flex}.name{min-width:0;color:var(--arq-color-text-primary);overflow-wrap:break-word;flex:auto}.is-small .info{gap:var(--arq-space-gap-md)}.is-small .title{flex-direction:column;align-items:flex-start}.is-small .finishes{gap:var(--arq-space-gap-sm);justify-content:flex-start;max-width:100%}.finishes{z-index:var(--card-above);justify-content:flex-end;align-items:center;gap:var(--arq-space-gap-xs);min-width:0;max-width:50%;padding-block:var(--arq-space-padding-xs);margin-block:calc(var(--arq-space-padding-xs) * -1);flex-wrap:wrap;flex:none;display:flex;position:relative}.meta{-webkit-line-clamp:2;color:var(--arq-color-text-secondary);overflow-wrap:break-word;-webkit-box-orient:vertical;margin:0;display:-webkit-box;overflow:hidden}.meta[hidden]{display:none}.compare{z-index:var(--card-above);position:relative}.card.is-loading{--shimmer-shine:var(--arq-color-surface-default)}.card.is-dark.is-loading{--shimmer-shine:var(--arq-color-surface-strong)}.is-loading .card-media,.is-loading .sk-bar,.is-loading .sk-swatches>span{background-image:linear-gradient(105deg, var(--arq-color-surface-subtle) 44%, var(--shimmer-shine) 50%, var(--arq-color-surface-subtle) 56%);animation:arq-skeleton-shimmer var(--arq-motion-duration-shimmer) linear infinite;background-repeat:no-repeat;background-size:300% 100%;background-attachment:fixed}@keyframes arq-skeleton-shimmer{0%{background-position:100% 0}to{background-position:0 0}}@media (prefers-reduced-motion:reduce){.is-loading .card-media,.is-loading .sk-bar,.is-loading .sk-swatches>span{background-image:none;animation:none}}.sk,.is-loading .img,.is-loading .fallback,.is-loading .title,.is-loading .meta,.is-loading .compare{display:none}.is-loading .sk{align-self:stretch;align-items:center;display:flex}.sk-title{gap:var(--arq-space-gap-sm)}.is-small .sk-title{flex-direction:column;align-items:flex-start}.sk-name{flex:auto;align-self:stretch;align-items:center;min-width:0;height:1lh;display:flex}.sk-bar{width:60%;height:var(--arq-space-gap-md);background:var(--arq-color-surface-subtle);display:block}.sk-short{width:35%;height:var(--arq-space-gap-sm-md)}.sk-swatches{gap:var(--arq-space-gap-xs);flex:none;display:flex}.is-small .sk-swatches{gap:var(--arq-space-gap-sm)}.sk-swatches>span{width:var(--arq-swatch-sm);height:var(--arq-swatch-sm);background:var(--arq-color-surface-subtle)}.sk-detail{height:1lh}.has-compare .sk-detail{padding-block:var(--arq-space-gap-xs)}", To = matchMedia("(max-width: 767px)");
function Eo(e, t = []) {
	for (let n of t) {
		let t = document.createElement("arq-swatch");
		t.slot = "finishes", t.textContent = n.name, n.src && (t.src = n.src), n.selected && t.setAttribute("selected", "");
		for (let e of Do) n[e] && (t.dataset[e] = n[e]);
		e.append(t);
	}
}
var Do = [
	"sku",
	"href",
	"image",
	"imageHover",
	"imageLit",
	"imageHoverLit"
];
(class extends L {
	static tag = "arq-product-card";
	static styles = lo + wo;
	static properties = {
		size: {
			type: String,
			values: ["large", "small"],
			default: "large"
		},
		showCompare: { type: Boolean },
		compared: { type: Boolean },
		href: { type: String },
		image: { type: String },
		imageHover: { type: String },
		imageLit: { type: String },
		imageHoverLit: { type: String },
		loading: { type: Boolean },
		family: { type: String }
	};
	static template = "<div class=\"card\"><div class=\"card-media\"><img class=\"img base\" alt=\"\" loading=\"lazy\" decoding=\"async\"><img class=\"img hover\" alt=\"\" decoding=\"async\"><span class=\"fallback role-body-sm\" aria-hidden=\"true\"></span></div><div class=\"info\"><div class=\"title\"><a class=\"card-link name\"><slot name=\"name\"></slot></a><span class=\"finishes\" hidden><slot name=\"finishes\"></slot></span></div><p class=\"meta\" hidden><slot name=\"meta\"></slot></p><arq-checkbox class=\"compare\" show-label hidden>Comparar<span class=\"compare-name visually-hidden\"></span></arq-checkbox><span class=\"sk sk-title\"><span class=\"sk-name\"><span class=\"sk-bar\"></span></span><span class=\"sk-swatches\"><span></span><span></span><span></span></span></span><span class=\"sk sk-detail\"><span class=\"sk-bar sk-short\"></span></span></div></div>";
	#e = !1;
	#t = !1;
	#n = 0;
	#r = !1;
	#i = /* @__PURE__ */ new Set();
	setup() {
		let e = this.shadowRoot;
		for (let t of e.querySelectorAll(".img")) t.addEventListener("load", () => t.classList.add("loaded")), t.addEventListener("error", () => {
			t.classList.remove("loaded", "reveal");
			let e = t.getAttribute("src");
			e && (this.#i.add(e), this.#p());
		});
		let t = e.querySelector(".base");
		t.addEventListener("transitionend", (e) => {
			e.propertyName === "opacity" && t.classList.contains("loaded") && t.classList.remove("reveal");
		});
		let n = () => {
			this.#t || (this.#t = !0, this.#p());
		}, r = e.querySelector(".card");
		r.addEventListener("pointerenter", n), e.querySelector(".card-link").addEventListener("focus", n);
		let i = (e) => {
			r.classList.toggle("is-media-hover", e), this.#f();
		}, a = e.querySelector(".card-link");
		a.addEventListener("focus", () => this.#f()), a.addEventListener("blur", () => this.#f()), r.addEventListener("pointerenter", (e) => e.pointerType === "mouse" && i(!0)), r.addEventListener("pointermove", (e) => {
			e.pointerType === "mouse" && !r.classList.contains("is-media-hover") && i(!0);
		}), r.addEventListener("pointerleave", () => i(!1));
		for (let t of [
			"name",
			"meta",
			"finishes"
		]) e.querySelector(`slot[name="${t}"]`).addEventListener("slotchange", () => this.#s());
		let o = e.querySelector(".finishes");
		o.addEventListener("click", (e) => this.#d(e.target.closest?.("arq-swatch"))), o.addEventListener("keydown", (e) => this.#u(e)), e.querySelector(".compare").addEventListener("arq:change", (e) => {
			e.stopPropagation(), this.compared = e.detail.checked, this.emit("compare", { checked: e.detail.checked });
		}), To.addEventListener("change", () => this.#o()), _a(this, "themeChanged");
	}
	themeChanged(e) {
		let t = this.shadowRoot;
		t.querySelector(".card").classList.toggle("is-dark", e);
		let n = t.querySelector(".base"), r = t.querySelector(".hover"), i = t.querySelector(".card"), a = i.classList.contains("has-hover") && r.classList.contains("loaded") && (i.classList.contains("is-media-hover") || !!t.querySelector(".card-link:focus-visible")), o = a ? r : n, s = o.naturalWidth ? o.currentSrc || o.getAttribute("src") : null, c = a ? e && this.imageHoverLit || this.imageHover : e && this.imageLit || this.image, l = s && c && s !== new URL(c, location.href).href ? this.#g(t.querySelector(".card-media"), s) : null;
		this.#e = e, this.#p(), La(o), l && Ia(o).then(() => this.#_(l));
	}
	update(e) {
		let t = this.shadowRoot;
		if (e.has("href")) {
			let e = t.querySelector(".card-link");
			this.href ? e.setAttribute("href", this.href) : e.removeAttribute("href");
		}
		let n = t.querySelector(".compare");
		n.hidden = !this.showCompare, n.checked = this.compared;
		let r = t.querySelector(".card");
		r.classList.toggle("is-loading", this.loading), r.classList.toggle("has-compare", this.showCompare), this.#m(r), this.loading ? this.setAttribute("aria-hidden", "true") : e.has("loading") && this.removeAttribute("aria-hidden"), e.has("size") && this.#o(), [...e].some((e) => e.startsWith("image")) && this.#p(), this.#s();
	}
	#a() {
		return this.size === "small" || To.matches;
	}
	#o() {
		let e = this.#a(), t = this.shadowRoot;
		t.querySelector(".card").classList.toggle("is-small", e);
		let n = e ? To.matches ? "role-heading-3" : "role-body-xl" : "role-heading-3";
		t.querySelector(".name").className = `card-link name ${n}`;
		let r = e ? "role-body-sm" : "role-body";
		t.querySelector(".meta").className = `meta ${r}`, t.querySelector(".sk-name").className = `sk-name ${n}`, t.querySelector(".sk-detail").className = `sk sk-detail ${this.showCompare ? "role-body" : r}`;
		for (let e of this.querySelectorAll(":scope > arq-swatch[slot=\"finishes\"]")) e.setAttribute("size", "small");
	}
	#s() {
		let e = this.shadowRoot, t = (t) => e.querySelector(`slot[name="${t}"]`).assignedNodes({ flatten: !0 }).some((e) => e.nodeType === Node.ELEMENT_NODE || e.textContent.trim());
		e.querySelector(".meta").hidden = !t("meta"), e.querySelector(".finishes").hidden = !t("finishes"), this.#l();
		let n = this.querySelector("[slot=\"name\"]")?.textContent.trim() ?? "";
		e.querySelector(".fallback").textContent = n, e.querySelector(".compare-name").textContent = n ? ` ${n}` : "", this.#o(), this.#m(e.querySelector(".card"));
	}
	#c() {
		return [...this.querySelectorAll(":scope > arq-swatch[slot=\"finishes\"]")];
	}
	#l() {
		let e = this.#c(), t = this.shadowRoot.querySelector(".finishes");
		if (!(e.length > 1 && e.some((e) => e.dataset.sku || e.dataset.image))) {
			t.removeAttribute("role");
			return;
		}
		t.setAttribute("role", "radiogroup"), t.setAttribute("aria-label", "Acabado"), e.some((e) => e.hasAttribute("selected")) || e[0].setAttribute("selected", "");
		for (let t of e) {
			let e = t.hasAttribute("selected");
			t.setAttribute("role", "radio"), t.setAttribute("aria-checked", String(e)), t.setAttribute("tabindex", e ? "0" : "-1");
		}
	}
	#u(e) {
		let t = {
			ArrowRight: 1,
			ArrowDown: 1,
			ArrowLeft: -1,
			ArrowUp: -1
		}, n = this.#c(), r = n.indexOf(e.target.closest?.("arq-swatch"));
		if (r !== -1) {
			if (e.key === "Enter" || e.key === " ") e.preventDefault(), this.#d(n[r]);
			else if (t[e.key]) {
				e.preventDefault();
				let i = n[(r + t[e.key] + n.length) % n.length];
				i.focus(), this.#d(i);
			}
		}
	}
	#d(e) {
		if (!e || e.getAttribute("role") !== "radio" || e.hasAttribute("selected")) return;
		for (let t of this.#c()) {
			let n = t === e;
			t.toggleAttribute("selected", n), t.setAttribute("aria-checked", String(n)), t.setAttribute("tabindex", n ? "0" : "-1");
		}
		let t = e.dataset, n = {
			href: t.href ?? this.href,
			image: t.image ?? null,
			imageHover: t.imageHover ?? null,
			imageLit: t.imageLit ?? null,
			imageHoverLit: t.imageHoverLit ?? null
		}, r = ++this.#n, i = () => {
			r === this.#n && Object.assign(this, n);
		}, a = this.#e && n.imageLit || n.image;
		if (a) {
			let e = new Image();
			e.onload = e.onerror = i, e.src = a;
		} else i();
		this.emit("finish", {
			name: e.textContent.trim(),
			sku: t.sku ?? null,
			href: n.href,
			image: n.image
		});
	}
	#f() {
		let e = this.shadowRoot, t = e.querySelector(".card"), n = (t.classList.contains("hover-unlit") || t.classList.contains("hover-ground")) && (t.classList.contains("is-media-hover") || !!e.querySelector(".card-link:focus-visible")), r = e.querySelector(".card-media");
		n ? r.setAttribute("data-arq-theme", "light") : r.removeAttribute("data-arq-theme");
	}
	#p() {
		let e = this.shadowRoot, t = e.querySelector(".base"), n = e.querySelector(".hover"), r = (e) => e && !this.#i.has(e) ? e : null, i = this.#e && r(this.imageLit) || r(this.image), a = (this.#e ? [this.imageHoverLit, this.image] : [this.imageHover]).map(r).find((e) => e && e !== i) ?? null;
		this.#h(t, i), this.#v(!i), e.querySelector(".card").classList.toggle("has-hover", !!(i && a)), e.querySelector(".card").classList.toggle("hover-unlit", !!(this.#e && a && a === r(this.image))), e.querySelector(".card").classList.toggle("hover-ground", !!(this.#e && i && !a && i === r(this.image))), this.#f(), this.#h(n, this.#t ? a : null);
		let o = this.#e ? this.image : this.imageLit;
		i && o && o !== i && (new Image().src = o);
	}
	#m(e) {
		let t = (e) => String(e ?? "").normalize("NFD").replace(/\p{M}/gu, "").trim().toLowerCase(), n = t(this.family), r = t(this.querySelector("[slot=\"name\"]")?.textContent), i = n === "fuji" || n === "mini kai" || n === "mini kai round" || n === "sen" || r === "tori visera" || r.startsWith("mini kai");
		e?.classList.toggle("is-contain", i), e?.classList.toggle("is-wide", r.startsWith("mini kai"));
	}
	#h(e, t) {
		if (e.getAttribute("src") !== (t ?? null)) {
			if (e.classList.remove("loaded"), !t) {
				e.removeAttribute("src");
				return;
			}
			e.src = t, e.classList.contains("base") && !this.#r && (this.#r = !0, e.complete && e.naturalWidth || e.classList.add("reveal"));
		}
	}
	#g(e, t) {
		e.querySelector(".theme-transition")?.remove();
		let n = document.createElement("img");
		return n.className = "theme-transition", n.src = t, n.alt = "", n.setAttribute("aria-hidden", "true"), e.append(n), n;
	}
	#_(e) {
		if (!e.isConnected) return;
		e.addEventListener("transitionend", (t) => {
			t.propertyName === "opacity" && e.remove();
		}, { once: !0 }), e.offsetWidth, e.classList.add("fade-out");
		let t = getComputedStyle(e).transitionDuration.split(",")[0];
		Number.parseFloat(t) || e.remove();
	}
	#v(e) {
		this.shadowRoot.querySelector(".fallback").hidden = !e;
	}
}).define();
//#endregion
//#region src/components/compare-slot/compare-slot.css?inline
var Oo = ":host{min-width:0;display:block}.slot{align-items:center;gap:var(--arq-space-gap-sm-md);max-width:var(--arq-layout-compare-slot);display:flex;position:relative}.thumb{width:var(--arq-layout-compare-thumb);height:var(--arq-layout-compare-thumb);background:var(--arq-color-surface-subtle);flex:none;justify-content:center;align-items:center;display:flex;position:relative;overflow:hidden}.thumb img{object-fit:cover;width:100%;height:100%;position:absolute;inset:0}.icon{width:var(--arq-icon-md);height:var(--arq-icon-md);color:var(--arq-color-icon-primary)}:host([filled]) .icon{display:none}.info{gap:var(--arq-space-gap-xs);flex-direction:column;flex:auto;min-width:0;display:flex}.name{color:var(--arq-color-text-primary);overflow-wrap:break-word}.meta,.empty{color:var(--arq-color-text-secondary);overflow-wrap:break-word}:host(:not([filled])) .name,:host(:not([filled])) .meta,.empty:empty{display:none}.remove{flex:none}.add{border-radius:var(--arq-radius-control);background:var(--arq-color-surface-transparent);cursor:pointer;border:0;margin:0;padding:0;position:absolute;inset:0}.add:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.add:focus:not(:focus-visible){outline:none}:host(:not([filled])) .slot{border:var(--arq-border-default) dashed var(--arq-color-border-default);padding-inline-end:var(--arq-space-padding-md)}:host(:not([filled])) .add:focus-visible{outline-offset:calc(-1 * var(--arq-border-strong))}@media (hover:hover) and (pointer:fine){:host(:not([filled])) .slot:hover{background:var(--arq-color-surface-faint);border-color:var(--arq-color-border-strong)}}";
(class extends L {
	static tag = "arq-compare-slot";
	static styles = Oo;
	static properties = {
		filled: { type: Boolean },
		image: { type: String },
		sku: { type: String },
		emptyLabel: {
			type: String,
			default: "Agregar producto"
		}
	};
	static template = `<div class="slot"><span class="thumb"><img alt="" hidden>${R("plus")}</span><span class="info"><span class="name role-label"><slot name="name"></slot></span><span class="meta role-body-sm"><slot name="meta"></slot></span><span class="empty role-body-sm"></span></span><arq-icon-button icon="close" class="remove"></arq-icon-button><button type="button" class="add" hidden></button></div>`;
	setup() {
		let e = this.shadowRoot, t = e.querySelector("img");
		t.addEventListener("load", () => t.hidden = !1), t.addEventListener("error", () => t.hidden = !0), e.querySelector(".remove").addEventListener("click", () => this.emit("remove", { sku: this.sku ?? null })), e.querySelector(".add").addEventListener("click", () => this.emit("add"));
		for (let t of e.querySelectorAll("slot")) t.addEventListener("slotchange", () => this.#e());
	}
	update(e) {
		let t = this.shadowRoot.querySelector("img");
		e.has("image") && (this.image ? t.src = this.image : (t.removeAttribute("src"), t.hidden = !0)), this.#e();
	}
	#e() {
		let e = this.shadowRoot, t = this.querySelector("[slot=\"name\"]")?.textContent.trim() ?? "", n = !!t;
		this.filled !== n && (this.filled = n), e.querySelector(".empty").textContent = n ? "" : this.emptyLabel ?? "";
		let r = e.querySelector(".remove");
		r.textContent = `Quitar ${t}`, r.hidden = !n;
		let i = e.querySelector(".add");
		i.hidden = n, i.setAttribute("aria-label", this.emptyLabel ?? "");
		let a = e.querySelector(".thumb");
		n ? a.dataset.arqTheme = "light" : delete a.dataset.arqTheme;
	}
}).define();
//#endregion
//#region src/components/compare-bar/compare-bar.css?inline
var ko = ":host{display:contents}.bar{z-index:3;box-sizing:border-box;gap:var(--arq-space-gap-md);padding:var(--arq-space-padding-md) var(--page-gutter) calc(var(--arq-space-padding-md) + env(safe-area-inset-bottom,var(--arq-space-0)));border-top:var(--arq-border-default) solid var(--arq-color-border-default);background:var(--arq-color-surface-default);color:var(--arq-color-text-primary);flex-direction:column;display:flex;position:sticky;bottom:0}.bar.animate{transition-property:transform,display;transition-duration:var(--arq-motion-duration-panel);transition-timing-function:var(--arq-motion-easing-standard);transition-behavior:allow-discrete}.bar.animate[hidden]{transform:translateY(100%)}@starting-style{.bar.animate{transform:translateY(100%)}}.bar.sliding:after{content:\"\";background:inherit;pointer-events:none;height:100svh;position:absolute;inset:100% 0 auto}@media (prefers-reduced-motion:reduce){.bar.animate{transition-property:opacity,display;transition-duration:var(--arq-motion-duration-fade)}.bar.animate[hidden]{opacity:0;transition-duration:var(--arq-motion-duration-fade);transform:none}@starting-style{.bar.animate{opacity:0;transform:none}}}.head{justify-content:space-between;align-items:center;gap:var(--arq-space-gap-md);display:flex}.title{align-items:center;gap:var(--arq-space-gap-sm);margin:0;display:inline-flex}.row{justify-content:space-between;align-items:center;gap:var(--arq-space-gap-2xl);display:flex}.slots{align-items:stretch;gap:var(--arq-space-gap-lg);flex:auto;min-width:0;display:flex}.slots arq-compare-slot{flex:1 1 0;min-width:0}.actions{align-items:center;gap:var(--arq-space-gap-xl);flex:none;display:flex}.toggle{flex:auto}.toggle .icon-box{margin-inline-start:auto}:host(:not([open])) .row{display:none}.toggle{align-items:center;gap:var(--arq-space-gap-sm);background:var(--arq-color-surface-transparent);color:inherit;font:inherit;text-align:start;cursor:pointer;-webkit-tap-highlight-color:var(--arq-color-surface-transparent);border:0;margin:0;padding:0;display:inline-flex}.icon-box{padding:var(--arq-space-padding-xs);border-radius:var(--arq-radius-control);background:var(--arq-color-surface-transparent);color:var(--arq-color-icon-primary);flex:none;display:inline-flex}.icon-box svg{width:var(--arq-icon-md);height:var(--arq-icon-md)}:host(:not([open])) [data-icon=chevron-down],:host([open]) [data-icon=chevron-up]{display:none}@media (hover:hover) and (pointer:fine){.toggle:hover .icon-box{background:var(--arq-color-surface-hover)}}.toggle:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.toggle:focus:not(:focus-visible){outline:none}@media (width>=768px) and (width<=1023px){.row{align-items:stretch;gap:var(--arq-space-gap-md);flex-direction:column}.actions{justify-content:flex-end}}@media (width<=767px){.bar{gap:var(--arq-space-gap-sm-md);padding-bottom:calc(var(--arq-space-padding-lg) + env(safe-area-inset-bottom,var(--arq-space-0)));border-top-color:var(--arq-color-border-subtle)}.toggle{flex:none}.toggle .icon-box{margin-inline-start:0}.row{align-items:stretch;gap:var(--arq-space-gap-md);flex-direction:column}.slots{gap:var(--arq-space-gap-sm);flex-direction:column;flex:none}.slots arq-compare-slot{flex:none}.actions{align-items:center;gap:var(--arq-space-gap-md);flex-direction:column-reverse}.go{align-self:stretch}}@media print{:host{display:none}}", Ao = "arq:compare", jo = 3, Mo = matchMedia("(max-width: 767px)");
function No() {
	try {
		let e = JSON.parse(localStorage.getItem(Ao) ?? "[]");
		return Array.isArray(e) ? e.filter((e) => e && e.sku).slice(0, jo) : [];
	} catch {
		return [];
	}
}
function Po(e) {
	try {
		localStorage.setItem(Ao, JSON.stringify(e));
	} catch {}
}
(class extends L {
	static tag = "arq-compare-bar";
	static styles = ko;
	static properties = {
		href: {
			type: String,
			default: "/arq/comparativa"
		},
		open: { type: Boolean }
	};
	static template = `<section class="bar" data-arq-theme="dark" aria-label="Comparar productos" hidden><div class="head"><button class="title toggle"><span class="role-body-lg">Productos seleccionados</span><arq-count-badge class="count"></arq-count-badge><span class="icon-box">${R("chevron-down")}${R("chevron-up")}</span></button></div><div class="row"><div class="slots"></div><div class="actions"><arq-button type="underline" show-underline class="clear">Borrar todo</arq-button><arq-button class="go" show-icon icon="arrow-right">Comparar</arq-button></div></div></section>`;
	#e = No();
	get items() {
		return [...this.#e];
	}
	set items(e) {
		this.#e = (Array.isArray(e) ? e : []).filter((e) => e && e.sku).slice(0, jo), this.#r();
	}
	setup() {
		let e = this.shadowRoot;
		this.open = !this.#t(), this.disclosure = new Li(this, {
			trigger: e.querySelector(".toggle"),
			panel: e.querySelector(".slots")
		});
		let t = null;
		e.querySelector(".toggle").addEventListener("click", () => {
			t = e.querySelector(".bar").getBoundingClientRect().top;
		}, { capture: !0 }), this.addEventListener("arq:toggle", () => this.#n(t));
		for (let t of e.querySelectorAll(".clear")) t.addEventListener("click", () => this.clear());
		e.querySelector(".slots").addEventListener("arq:remove", (e) => {
			e.stopPropagation(), this.remove(e.detail.sku);
		}), Mo.addEventListener("change", () => this.#i()), addEventListener("storage", (e) => {
			e.key === Ao && (this.#e = No(), this.#i(), this.emit("compare-change", { items: this.items }));
		}), this.#i(), requestAnimationFrame(() => requestAnimationFrame(() => e.querySelector(".bar").classList.add("animate")));
	}
	update(e) {
		e.has("href") && this.#i();
	}
	add(e) {
		return !e?.sku || this.has(e.sku) || this.#e.length >= jo ? !1 : (this.#e.push({
			sku: e.sku,
			name: e.name ?? "",
			meta: e.meta ?? "",
			image: e.image ?? ""
		}), this.#t() || (this.open = !0), this.#r(), !0);
	}
	#t() {
		return Mo.matches && this.#e.length >= 2;
	}
	remove(e) {
		let t = this.#e.length;
		this.#e = this.#e.filter((t) => t.sku !== e), this.#e.length !== t && this.#r();
	}
	clear() {
		this.#e.length && (this.#e = [], this.#r());
	}
	has(e) {
		return this.#e.some((t) => t.sku === e);
	}
	focusAdd() {
		let e = this.shadowRoot;
		([...e.querySelectorAll("arq-compare-slot")].find((e) => !e.filled)?.shadowRoot.querySelector(".add") ?? e.querySelector(".go"))?.focus();
	}
	get compareUrl() {
		let e = this.#e.map((e) => encodeURIComponent(e.sku)).join(",");
		return `${this.href ?? "/arq/comparativa"}?sku=${e}`;
	}
	#n(e) {
		let t = this.shadowRoot.querySelector(".bar");
		if (e === null || t.hidden || !t.classList.contains("animate")) return;
		let n = getComputedStyle(t), r = Number.parseFloat(n.getPropertyValue("--arq-motion-duration-panel")) || 0;
		if (!r) return;
		t.getAnimations().forEach((e) => e.cancel()), t.classList.remove("sliding");
		let i = e - t.getBoundingClientRect().top;
		if (!i) return;
		t.classList.add("sliding");
		let a = t.animate([{ transform: `translateY(${i}px)` }, { transform: "none" }], {
			duration: r,
			easing: n.getPropertyValue("--arq-motion-easing-standard").trim() || "ease-out"
		});
		a.onfinish = () => t.classList.remove("sliding");
	}
	#r() {
		Po(this.#e), this.#i(), this.emit("compare-change", { items: this.items });
	}
	#i() {
		let e = this.shadowRoot;
		if (!e.querySelector(".bar")) return;
		let t = this.#e;
		e.querySelector(".bar").hidden = t.length === 0, e.querySelector(".count").count = t.length;
		let n = Mo.matches, r = e.querySelector(".slots"), i = [], a = n ? Math.min(t.length + 1, jo) : jo;
		for (let e = 0; e < a; e++) {
			if (e > 0) {
				let e = document.createElement("arq-divider");
				e.setAttribute("orientation", n ? "horizontal" : "vertical"), e.setAttribute("emphasis", n ? "subtle" : "default"), i.push(e);
			}
			let r = t[e], a = document.createElement("arq-compare-slot");
			if (r) {
				a.sku = r.sku, r.image && (a.image = r.image);
				let e = document.createElement("span");
				e.slot = "name", e.textContent = r.name;
				let t = document.createElement("span");
				t.slot = "meta", t.textContent = r.meta, a.append(e, t);
			}
			i.push(a);
		}
		r.replaceChildren(...i), e.querySelector(".go").href = this.compareUrl;
	}
}).define();
//#endregion
//#region src/components/compare-picker-item/compare-picker-item.css?inline
var Fo = ":host{min-width:0;display:block}.item{align-items:center;gap:var(--arq-space-gap-md);padding:var(--arq-space-padding-md) var(--arq-space-padding-sm-md) calc(var(--arq-space-padding-md) - var(--arq-border-default));border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle);display:flex}@media (hover:hover) and (pointer:fine){:host(:not([added]):not([disabled])) .item:hover{background:var(--arq-color-surface-hover)}}.thumb{width:var(--arq-layout-search-thumb);height:var(--arq-layout-search-thumb);background:var(--arq-color-surface-subtle);flex:none;position:relative;overflow:hidden}.thumb img{object-fit:cover;width:100%;height:100%;position:absolute;inset:0}.info{gap:var(--arq-space-gap-xs);flex-direction:column;flex:auto;min-width:0;display:flex}.name,.meta{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.name{-webkit-line-clamp:2;line-clamp:2;white-space:normal;color:var(--arq-color-text-primary);-webkit-box-orient:vertical;display:-webkit-box}.meta{color:var(--arq-color-text-tertiary)}.action{flex:none}:host([disabled]) .name,:host([disabled]) .meta{color:var(--arq-color-text-disabled)}:host([disabled]) .thumb{opacity:var(--arq-opacity-disabled)}";
(class extends L {
	static tag = "arq-compare-picker-item";
	static styles = Fo;
	static properties = {
		added: { type: Boolean },
		disabled: { type: Boolean },
		image: { type: String },
		sku: { type: String }
	};
	static template = "<div class=\"item\"><span class=\"thumb\"><img alt=\"\" hidden></span><span class=\"info\"><span class=\"name role-body-compact-regular\"><slot name=\"name\"></slot></span><span class=\"meta role-caption\"><slot name=\"meta\"></slot></span></span><arq-button type=\"outline\" class=\"action\" show-leading-icon leading-icon=\"plus\"><span class=\"label\"></span><span class=\"visually-hidden product\"></span></arq-button></div>";
	setup() {
		let e = this.shadowRoot, t = e.querySelector("img");
		t.addEventListener("load", () => t.hidden = !1), t.addEventListener("error", () => t.hidden = !0), e.querySelector(".action").addEventListener("click", () => {
			this.added || this.disabled || this.emit("add", { sku: this.sku ?? null });
		}), e.querySelector("slot[name=\"name\"]").addEventListener("slotchange", () => this.#e()), e.querySelector("slot[name=\"meta\"]").addEventListener("slotchange", () => this.#e()), this.hasAttribute("role") || this.setAttribute("role", "listitem");
	}
	update(e) {
		let t = this.shadowRoot;
		if (e.has("image")) {
			let e = t.querySelector("img");
			this.image ? e.src = this.image : (e.removeAttribute("src"), e.hidden = !0);
		}
		let n = t.querySelector(".action");
		n.disabled = this.added || this.disabled, n.showLeadingIcon = !this.added, t.querySelector(".label").textContent = this.added ? "Agregado" : "Agregar", this.#e();
	}
	focus(e) {
		let t = this.shadowRoot?.querySelector(".action");
		t ? t.focus(e) : super.focus(e);
	}
	#e() {
		let e = this.querySelector("[slot=\"name\"]")?.textContent.trim() ?? "";
		this.shadowRoot.querySelector(".product").textContent = e ? ` ${e}` : "";
		let t = this.querySelector("[slot=\"meta\"]")?.textContent.trim() ?? "";
		this.shadowRoot.querySelector(".name").title = e, this.shadowRoot.querySelector(".meta").title = t;
	}
}).define();
//#endregion
//#region src/components/compare-picker/compare-picker.css?inline
var Io = ":host{--panel-slow:var(--arq-motion-duration-panel);display:contents}.dialog:not(.is-open){--panel-slow:var(--arq-motion-duration-expand)}.dialog{box-sizing:border-box;width:100%;max-width:none;height:100%;max-height:none;padding:var(--arq-layout-gutter);background:var(--arq-color-surface-transparent);color:var(--arq-color-text-primary);overscroll-behavior:contain;border:0;margin:0;position:fixed;inset:0;overflow:hidden}.dialog[open]{display:flex}.dialog::backdrop{background:var(--arq-color-overlay-scrim);opacity:0;transition:opacity var(--panel-slow) var(--arq-motion-easing-standard)}.dialog.is-open::backdrop{opacity:1}.dialog:not(.is-open){pointer-events:none}.sheet{box-sizing:border-box;gap:var(--arq-space-gap-lg);width:var(--arq-layout-filter-panel);max-width:100%;max-height:100%;padding:var(--arq-space-padding-xl-2xl);border:var(--arq-border-default) solid var(--arq-color-border-default);border-radius:var(--arq-radius-control);background:var(--arq-color-surface-default);opacity:0;transition-property:opacity,transform;transition-duration:var(--panel-slow);transition-timing-function:var(--arq-motion-easing-standard);flex-direction:column;margin:auto;display:flex;transform:translateY(2%)}.dialog.is-open .sheet{opacity:1;transform:none}.header{justify-content:space-between;align-items:flex-start;gap:var(--arq-space-gap-md);flex:none;display:flex}.title{min-width:0;color:var(--arq-color-text-primary)}.search{flex:none}.list,.empty{min-height:0;block-size:var(--arq-layout-compare-picker-list);flex:0 auto}.list{overscroll-behavior:contain;flex-direction:column;display:flex;overflow:hidden auto}.list>*{flex:none}.empty{justify-content:center;align-items:center;gap:var(--arq-space-gap-md);text-align:center;flex-direction:column;display:flex}.empty[hidden]{display:none}.empty p{margin:0}.empty-title{color:var(--arq-color-text-primary)}.empty-hint{color:var(--arq-color-text-tertiary)}.footer{flex:none;justify-content:flex-end;display:flex}@media (width<=767px){.dialog{padding:var(--arq-space-0)}.sheet{width:100%;max-width:none;height:100%;padding-bottom:calc(var(--arq-space-padding-xl-2xl) + env(safe-area-inset-bottom,var(--arq-space-0)));border:0}.list,.empty{flex:auto;block-size:auto}}@media (prefers-reduced-motion:reduce){.sheet{transition-property:opacity;transition-duration:var(--arq-motion-duration-fade);transition-timing-function:var(--arq-motion-easing-out);transform:none}.dialog::backdrop{transition:opacity var(--arq-motion-duration-fade) var(--arq-motion-easing-out)}}", Lo = 3, Ro = matchMedia("(hover: hover) and (pointer: fine)"), zo = {
	noResults: (e) => e ? `No encontramos productos para «${e}».` : "No encontramos productos.",
	hint: "Probá con otro nombre, SKU o familia.",
	count: (e) => e === 1 ? "1 producto" : `${e.toLocaleString("es-AR")} productos`,
	added: (e) => `${e} agregado a la comparación.`,
	error: "No se pudieron cargar los productos.",
	errorHint: "Probá de nuevo en unos minutos.",
	retry: "Reintentar"
};
(class extends L {
	static tag = "arq-compare-picker";
	static styles = Io;
	static properties = {
		open: { type: Boolean },
		href: {
			type: String,
			default: "/arq/productos"
		},
		count: {
			type: Number,
			default: 0
		}
	};
	static template = `<dialog class="dialog" data-arq-theme="light"><div class="sheet"><div class="header"><div class="title role-heading-2"><slot name="title">Agregar producto</slot></div><arq-icon-button icon="close" size="large" class="close">Cerrar</arq-icon-button></div><arq-search-field type="line" class="search" placeholder="Buscar por nombre, SKU o familia…" label="Buscar por nombre, SKU o familia"></arq-search-field><div class="list" role="list"></div><div class="empty" hidden><p class="empty-title role-body-regular"></p><p class="empty-hint role-body-compact">${zo.hint}</p><arq-button class="retry" type="underline" show-underline hidden>${zo.retry}</arq-button></div><div class="footer"><arq-button class="go" type="underline" show-underline show-icon icon="arrow-right">Ver todos los productos</arq-button></div><span class="visually-hidden" aria-live="polite"></span></div></dialog>`;
	#e = null;
	#t = null;
	#n = null;
	#r = [];
	#i = "";
	#a = !1;
	#o = !1;
	get items() {
		return [...this.#r];
	}
	set items(e) {
		this.#r = Array.isArray(e) ? e.filter((e) => e && e.sku) : [], this.#o = !1, this.#c();
	}
	showError() {
		this.#r = [], this.#o = !0, this.#c();
	}
	get search() {
		return { query: this.#i };
	}
	setup() {
		let e = this.shadowRoot;
		this.#e = e.querySelector("dialog"), z(this.#e), this.#e.addEventListener("close", () => V(!1)), e.querySelector(".close").addEventListener("click", () => this.close()), this.#e.addEventListener("click", (e) => {
			e.target === this.#e && this.close();
		}), this.#e.addEventListener("cancel", (e) => {
			e.preventDefault(), this.close();
		}), this.#e.addEventListener("keydown", (e) => {
			e.key === "Escape" && (e.preventDefault(), this.close());
		});
		let t = e.querySelector(".search");
		t.addEventListener("arq:input", (e) => {
			e.stopPropagation(), this.#i = e.detail.value.trim(), this.#s();
		}), t.addEventListener("arq:submit", (e) => e.stopPropagation()), t.addEventListener("arq:navigate", (e) => e.stopPropagation()), t.addEventListener("arq:close", (e) => e.stopPropagation()), e.querySelector(".list").addEventListener("arq:add", (e) => {
			e.stopPropagation();
			let t = this.#r.find((t) => t.sku === e.detail.sku);
			!t || t.added || this.count >= Lo || (this.emit("add", { item: { ...t } }), this.#l(zo.added(t.name)));
		}), e.querySelector(".retry").addEventListener("click", () => {
			e.querySelector(".search").focus(), this.#s();
		}), e.querySelector("slot[name=\"title\"]").addEventListener("slotchange", () => this.#p()), this.#p();
	}
	update(e) {
		e.has("count") && this.#c(), this.shadowRoot.querySelector(".go").href = this.href ?? "/arq/productos", e.has("open") && (this.open ? this.#u() : this.#e.open && this.#d());
	}
	show(e) {
		if (this.#t = e ?? this.#f(), !this.open) {
			let e = this.shadowRoot;
			this.#i = "", e.querySelector(".search").value = "", e.querySelector(".list").scrollTop = 0, this.#s({ announce: !1 });
		}
		this.open = !0;
	}
	close() {
		this.open = !1;
	}
	#s({ announce: e = !0 } = {}) {
		this.#a = e, this.emit("search", this.search);
	}
	#c() {
		let e = this.shadowRoot, t = e.querySelector(".list");
		if (!t) return;
		let n = (this.count ?? 0) >= Lo, r = this.#r.map((e) => {
			let t = document.createElement("arq-compare-picker-item");
			t.sku = e.sku, t.added = !!e.added, t.disabled = n && !e.added, e.image && (t.image = e.image);
			let r = document.createElement("span");
			if (r.slot = "name", r.textContent = e.name ?? "", t.append(r), e.meta) {
				let n = document.createElement("span");
				n.slot = "meta", n.textContent = e.meta, t.append(n);
			}
			return t;
		}), i = e.activeElement?.closest?.("arq-compare-picker-item")?.sku ?? null;
		if (t.replaceChildren(...r), i) {
			let t = Math.max(0, r.findIndex((e) => e.sku === i)), n = (e) => !e.added && !e.disabled, a = r.slice(t).find(n) ?? r.slice(0, t).reverse().find(n);
			requestAnimationFrame(() => {
				a ? a.focus() : e.querySelector(".go").focus();
			});
		}
		let a = !r.length;
		t.hidden = a, e.querySelector(".empty").hidden = !a;
		let o = this.#o, s = o ? zo.error : zo.noResults(this.#i), c = o ? zo.errorHint : zo.hint;
		e.querySelector(".empty-title").textContent = a ? s : "", e.querySelector(".empty-hint").textContent = c, e.querySelector(".retry").hidden = !o, (this.#a || o) && (this.#a = !1, this.#l(a ? `${s} ${c}` : zo.count(r.length)));
	}
	#l(e) {
		let t = this.shadowRoot.querySelector("[aria-live]");
		t.textContent = "", requestAnimationFrame(() => t.textContent = e);
	}
	#u() {
		let e = this.#e;
		clearTimeout(this.#n), this.#n = null, e.open || (e.showModal(), V(!0, e), e.offsetHeight, (Ro.matches ? this.shadowRoot.querySelector(".search") : this.shadowRoot.querySelector(".close")).focus({ preventScroll: !0 })), e.classList.add("is-open");
	}
	#d() {
		let e = this.#e;
		if (this.#n) return;
		e.classList.remove("is-open");
		let { transitionDuration: t } = getComputedStyle(this.shadowRoot.querySelector(".sheet")), n = Math.max(0, ...t.split(",").map((e) => (parseFloat(e) || 0) * (e.trim().endsWith("ms") ? 1 : 1e3)));
		this.#n = setTimeout(() => {
			this.#n = null, e.close();
			let t = this.#t;
			this.#t = null, t?.focus?.(), this.emit("close", { restored: !!t && this.#f() === t });
		}, n);
	}
	#f() {
		let e = document.activeElement;
		for (; e?.shadowRoot?.activeElement;) e = e.shadowRoot.activeElement;
		return e;
	}
	#p() {
		let e = this.shadowRoot.querySelector("slot[name=\"title\"]"), t = e.assignedNodes({ flatten: !0 }), n = (t.length ? t : [...e.childNodes]).map((e) => e.textContent).join("").trim();
		this.#e.setAttribute("aria-label", n || "Agregar producto");
	}
}).define();
//#endregion
//#region src/components/compare-product/compare-product.css?inline
var Bo = ":host{min-width:0;display:block}.product{gap:var(--arq-space-gap-md);flex-direction:column;width:100%;height:100%;display:flex;position:relative}.media{box-sizing:border-box;aspect-ratio:1;width:100%;padding:var(--arq-space-padding-md);background:var(--arq-color-surface-soft);justify-content:center;align-items:center;display:flex;overflow:hidden}.media img{object-fit:contain;width:100%;height:100%;display:block}.remove{top:var(--arq-space-padding-sm-md);right:var(--arq-space-padding-sm-md);position:absolute}:host([empty]) .media{background:var(--arq-color-surface-transparent);border:var(--arq-border-default) dashed var(--arq-color-border-default);flex:auto;align-self:stretch;max-width:none;padding:0}:host([empty]) .remove,:host([empty]) .info,:host([empty]) .selects{display:none}.add{all:unset;justify-content:center;align-self:stretch;align-items:center;gap:var(--arq-space-gap-sm-md);box-sizing:border-box;cursor:pointer;color:var(--arq-color-text-secondary);text-align:center;flex-direction:column;flex:auto;display:none}:host([empty]) .add{display:flex}.add-icon{padding:var(--arq-space-padding-sm-md);justify-content:center;align-items:center;display:flex}.add-icon .icon{width:var(--arq-icon-xl);height:var(--arq-icon-xl)}.add:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:calc(-1 * var(--arq-border-strong))}@media (hover:hover) and (pointer:fine){:host([empty]) .product:hover{background:var(--arq-color-surface-faint)}:host([empty]) .product:hover .media{border-color:var(--arq-color-border-strong)}}.info{align-items:flex-start;gap:var(--arq-space-gap-xs);flex-direction:column;display:flex}.title{align-items:center;gap:var(--arq-space-gap-sm);max-width:100%;color:var(--arq-color-text-primary);text-decoration:none;display:flex}.title:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:var(--arq-space-gap-xs)}.name{overflow-wrap:break-word;flex:0 auto;min-width:0}.title .icon{width:var(--arq-icon-md);height:var(--arq-icon-md);flex:none}.sku{color:var(--arq-color-text-tertiary);margin:0}.selects{flex-direction:column;display:flex}.selects>*{border-bottom:var(--arq-border-default) solid var(--arq-color-border-default);min-width:0}.selects>*+*{padding-top:var(--arq-space-gap-sm-md)}@media print{.remove,.selects,.title .icon{display:none}.media{max-width:var(--arq-layout-compare-column);padding:var(--arq-space-padding-md);background:var(--arq-color-surface-strong);-webkit-print-color-adjust:exact;print-color-adjust:exact;align-self:center}:host([empty]){display:none}}.compact,:host([size=compact]) .product{display:none}:host([size=compact]) .compact{align-items:center;gap:var(--arq-space-gap-sm-md);width:100%;min-width:0;display:flex}.thumb{width:var(--arq-layout-compare-thumb);height:var(--arq-layout-compare-thumb);background:var(--arq-color-surface-subtle);flex:none;position:relative;overflow:hidden}.thumb img{object-fit:cover;width:100%;height:100%;position:absolute;inset:0}.compact-info{gap:var(--arq-space-gap-xs);flex-direction:column;flex:auto;min-width:0;display:flex}.compact-name,.compact-sku{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.compact-name{color:var(--arq-color-text-primary)}.compact-sku{color:var(--arq-color-text-secondary)}:host(:not([show-sku])) .compact-sku{display:none}.compact-remove{flex:none}.compact-add{all:unset;justify-content:center;align-items:center;gap:var(--arq-space-gap-sm-md);box-sizing:border-box;height:var(--arq-layout-compare-thumb);padding-inline:var(--arq-space-padding-md);border:var(--arq-border-default) dashed var(--arq-color-border-default);cursor:pointer;color:var(--arq-color-text-secondary);flex:auto;display:none}:host([size=compact][empty]) .thumb,:host([size=compact][empty]) .compact-info,:host([size=compact][empty]) .compact-remove{display:none}:host([size=compact][empty]) .compact-add{display:flex}.compact-plus{flex:none;display:flex}.compact-plus .icon{width:var(--arq-icon-md);height:var(--arq-icon-md)}@media (hover:hover) and (pointer:fine){.compact-add:hover{background:var(--arq-color-surface-faint);border-color:var(--arq-color-border-strong)}}.compact-add:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:calc(-1 * var(--arq-border-strong))}@media (width<=767px){:host([size=compact]) .compact{gap:var(--arq-space-gap-sm);text-align:center;flex-direction:column;height:100%;position:relative}.compact-info{flex:none;align-self:stretch;align-items:center}.compact-name,.compact-sku{white-space:normal;overflow-wrap:anywhere}.compact-remove{position:absolute;top:0;right:0}.compact-add{align-self:stretch;gap:var(--arq-space-gap-xs);height:auto;min-height:var(--arq-layout-compare-thumb);padding:var(--arq-space-padding-sm);text-align:center;flex-direction:column}}";
(class extends L {
	static tag = "arq-compare-product";
	static styles = Bo;
	static properties = {
		addLabel: {
			type: String,
			default: "Agregar producto"
		},
		size: {
			type: String,
			values: ["default", "compact"],
			default: "default"
		},
		showSku: { type: Boolean }
	};
	static template = `<div class="product"><div class="media"><img alt="" hidden><arq-icon-button icon="close" class="remove"></arq-icon-button><button type="button" class="add"><span class="add-icon">${R("plus")}</span><span class="add-label role-body"></span></button></div><div class="info"><a class="title"><span class="name role-body-lg-medium"></span>${R("arrow-up-right")}</a><p class="sku role-label"></p></div><div class="selects"></div></div><div class="compact"><div class="thumb"><img alt="" hidden></div><div class="compact-info"><span class="compact-name role-label"></span><span class="compact-sku role-body-sm"></span></div><arq-icon-button icon="close" class="compact-remove"></arq-icon-button><button type="button" class="compact-add"><span class="compact-plus">${R("plus")}</span><span class="compact-add-label role-body-sm"></span></button></div>`;
	#e = null;
	get data() {
		return this.#e;
	}
	set data(e) {
		this.#e = e ?? null, this.toggleAttribute("empty", !e), this.isConnected && this.#t();
	}
	setup() {
		let e = this.shadowRoot;
		e.querySelector(".remove").addEventListener("click", () => this.emit("remove", { sku: this.#e?.sku ?? null })), e.querySelector(".add").addEventListener("click", () => this.emit("add")), e.querySelector(".compact-remove").addEventListener("click", () => this.emit("remove", { sku: this.#e?.sku ?? null })), e.querySelector(".compact-add").addEventListener("click", () => this.emit("add")), e.querySelector(".selects").addEventListener("arq:change", (e) => {
			e.stopPropagation();
			let t = e.target.dataset.field;
			t && this.emit("change", {
				field: t,
				value: e.detail.value
			});
		});
		for (let t of e.querySelectorAll("img")) t.addEventListener("error", () => t.hidden = !0);
		this.#t();
	}
	update() {
		this.#t();
	}
	#t() {
		let e = this.shadowRoot, t = this.#e, n = e.querySelector("img");
		t?.image ? (n.src = t.image, n.hidden = !1) : (n.removeAttribute("src"), n.hidden = !0), e.querySelector(".add-label").textContent = this.addLabel ?? "", e.querySelector(".name").textContent = t?.name ?? "";
		let r = e.querySelector(".title");
		t?.href ? r.href = t.href : r.removeAttribute("href"), r.setAttribute("aria-label", t ? `Ver ficha de ${t.name}` : ""), e.querySelector(".sku").textContent = t?.sku ?? "", e.querySelector(".remove").textContent = t ? `Quitar ${t.name}` : "Quitar", this.#r(t), this.#n(t);
	}
	#n(e) {
		let t = this.shadowRoot, n = t.querySelector(".thumb img");
		e?.image ? (n.src = e.image, n.hidden = !1) : (n.removeAttribute("src"), n.hidden = !0), t.querySelector(".compact-name").textContent = e?.name ?? "", t.querySelector(".compact-sku").textContent = e?.sku ?? "", t.querySelector(".compact-name").title = e?.name ?? "", t.querySelector(".compact-sku").title = e?.sku ?? "", t.querySelector(".compact-add-label").textContent = this.addLabel ?? "", t.querySelector(".compact-remove").textContent = e ? `Quitar ${e.name}` : "Quitar";
	}
	#r(e) {
		let t = this.shadowRoot.querySelector(".selects"), n = (e?.attributes ?? []).map((e) => ({
			field: e.field,
			label: e.label,
			value: e.value ?? "",
			options: e.options ?? []
		}));
		for (; t.children.length > n.length;) t.lastElementChild.remove();
		for (; t.children.length < n.length;) {
			let e = document.createElement("arq-select");
			e.type = "filter", e.size = "small", e.hideAll = !0, t.append(e);
		}
		n.forEach((e, n) => {
			let r = t.children[n];
			r.dataset.field = e.field, r.label = e.label, r.options = e.options, r.value = e.value;
		});
	}
}).define();
//#endregion
//#region src/components/compare-header/compare-header.css?inline
var Vo = ":host{z-index:2;display:block;position:relative}.default{align-items:flex-start;gap:var(--arq-space-gap-xl);padding-inline:var(--page-gutter);padding-block-end:var(--arq-space-section-xs);display:flex;position:relative}.sentinel{width:var(--arq-border-default);height:var(--arq-border-default);position:absolute;bottom:0;left:0}.controls{width:var(--arq-layout-compare-label);flex:none}.default .controls{flex-direction:column;justify-content:flex-end;align-self:stretch;display:flex}.products{align-items:stretch;gap:var(--arq-space-gap-xl);flex:auto;min-width:0;display:flex}.products>*{flex:1 1 0;min-width:0}@media screen and (width>=768px){.default{gap:0}.default .controls{padding-inline-end:var(--arq-space-gap-lg)}.products{gap:0}.products>*{padding-inline:var(--arq-space-padding-lg) var(--arq-space-padding-xl);border-left:var(--arq-border-default) solid var(--arq-color-border-subtle)}}@media screen and (width>=768px) and (width<=1439px){.default .controls{padding-inline-end:var(--arq-space-gap-md)}.products>*{padding-inline:var(--arq-space-padding-sm-md) var(--arq-space-padding-md)}}.compact{top:var(--navbar-height,var(--arq-layout-navbar-height));z-index:2;align-items:center;gap:var(--arq-space-gap-lg);padding-inline:var(--page-gutter);padding-block:var(--arq-space-padding-sm-md);background:var(--arq-color-surface-default);border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle);transition:translate var(--arq-motion-duration-base) var(--arq-motion-easing-out);display:flex;position:fixed;left:0;right:0}@media (prefers-reduced-motion:no-preference){@starting-style{.compact:not([hidden]){translate:0 -100%}}}.compact{gap:0}.compact .controls{white-space:nowrap;align-items:center;padding-inline-end:var(--arq-space-gap-lg);display:flex}.slots{flex:auto;align-items:stretch;min-width:0;display:flex;overflow:hidden}.slots>*{min-width:0;padding-inline:var(--arq-space-padding-md) var(--arq-space-gap-lg);border-left:var(--arq-border-default) solid var(--arq-color-border-subtle);flex:1 1 0}@media screen and (width>=768px) and (width<=1439px){.compact .controls{padding-inline-end:var(--arq-space-gap-md)}.slots>*{padding-inline:var(--arq-space-padding-sm-md) var(--arq-space-padding-md)}}@media (width<=767px){:host{--column-width:var(--arq-layout-compare-column)}.default{width:100%;min-width:0;padding-inline:0}.default .controls{display:none}.products>*{width:var(--column-width);flex:none}.products{gap:var(--arq-space-gap-md);padding-inline:var(--page-gutter);scrollbar-width:none;overflow-x:auto}.products::-webkit-scrollbar{display:none}.slots::-webkit-scrollbar{display:none}.compact{align-items:stretch;gap:var(--arq-space-gap-md);flex-direction:column;padding-inline:0;top:0;overflow:visible}.slots{box-sizing:border-box;gap:var(--arq-space-gap-md);width:100%;padding-inline:var(--page-gutter);overscroll-behavior-x:contain;scrollbar-width:none;flex:auto;order:1;overflow-x:auto}.compact .controls{width:auto;padding-inline:var(--page-gutter);order:2}.slots{align-items:stretch}.slots>*{box-sizing:border-box;width:var(--column-width);border-left:0;flex:none;padding-inline:0}.slots>*+*{border-left:var(--arq-border-default) solid var(--arq-color-border-subtle);padding-inline-start:var(--arq-space-padding-md)}}@media print{.compact{display:none}.default{box-sizing:border-box;padding-inline:var(--page-gutter);break-inside:avoid;gap:0;padding-block-end:0}.default .controls{padding-inline-end:var(--arq-space-gap-lg);display:block}.controls arq-toggle{visibility:hidden}.products{gap:0;padding-inline:0;overflow:visible}.products>*{width:auto;padding-inline:var(--arq-space-padding-md) var(--arq-space-gap-lg);border-left:var(--arq-border-default) solid var(--arq-color-border-default);flex:1 1 0}}@media screen and (width<=767px){:host([embedded]) .default{width:max-content;min-width:100%}:host([embedded]) .products{flex:none;width:max-content;overflow:visible}}", Ho = 3, Uo = matchMedia("(max-width: 767px)");
(class extends L {
	static tag = "arq-compare-header";
	static styles = Vo;
	static properties = {
		onlyDifferences: { type: Boolean },
		embedded: { type: Boolean },
		diffLabel: {
			type: String,
			default: "Solo diferencias"
		}
	};
	static template = "<div class=\"header\"><div class=\"default\"><div class=\"controls\"><arq-toggle show-label class=\"diff\"></arq-toggle></div><div class=\"products\"></div><span class=\"sentinel\" aria-hidden=\"true\"></span></div><div class=\"compact\" hidden><div class=\"controls\"><arq-toggle show-label class=\"diff-compact\"></arq-toggle></div><div class=\"slots\"></div></div></div>";
	#e = [];
	#t = null;
	#n = !1;
	get products() {
		return this.#e;
	}
	set products(e) {
		this.#e = (Array.isArray(e) ? e : []).slice(0, Ho), this.isConnected && this.#r();
	}
	setup() {
		let e = this.shadowRoot;
		for (let t of e.querySelectorAll("arq-toggle")) t.addEventListener("arq:change", (e) => {
			e.stopPropagation(), this.onlyDifferences = e.detail.checked, this.emit("differences", { value: e.detail.checked });
		});
		e.querySelector(".products").addEventListener("arq:remove", (e) => {
			e.stopPropagation(), this.emit("remove", { sku: e.detail.sku });
		}), e.querySelector(".products").addEventListener("arq:change", (t) => {
			t.stopPropagation();
			let n = [...e.querySelectorAll(".products arq-compare-product")].indexOf(t.target);
			this.emit("change", {
				index: n,
				field: t.detail.field,
				value: t.detail.value
			});
		}), e.querySelector(".products").addEventListener("arq:add", (t) => {
			t.stopPropagation();
			let n = [...e.querySelectorAll(".products arq-compare-product")].indexOf(t.target);
			this.emit("add", { index: n });
		}), e.querySelector(".slots").addEventListener("arq:remove", (e) => {
			e.stopPropagation(), this.emit("remove", { sku: e.detail.sku });
		}), e.querySelector(".slots").addEventListener("arq:add", (t) => {
			t.stopPropagation();
			let n = [...e.querySelectorAll(".slots arq-compare-product")].indexOf(t.target);
			this.emit("add", { index: n });
		});
		for (let t of e.querySelectorAll(".products, .slots")) t.addEventListener("scroll", () => this.#s(t));
		Uo.addEventListener("change", () => this.#i()), this.#c(), addEventListener("resize", () => {
			this.#c(), Uo.matches && document.querySelector("arq-navbar")?.removeAttribute("data-arq-compare-hidden");
		}), this.#r();
	}
	disconnectedCallback() {
		this.#t?.disconnect(), document.querySelector("arq-navbar")?.removeAttribute("data-arq-compare-hidden");
	}
	update(e) {
		if (e.has("diffLabel") || e.has("onlyDifferences")) for (let e of this.shadowRoot.querySelectorAll("arq-toggle")) e.textContent = this.diffLabel ?? "", e.checked = this.onlyDifferences;
	}
	#r() {
		let e = this.shadowRoot, t = e.querySelector(".products"), n = e.querySelector(".slots");
		for (let e = 0; e < Ho; e++) {
			let r = this.#e[e] ?? null, i = t.children[e];
			i || (i = document.createElement("arq-compare-product"), t.append(i)), i.data = r;
			let a = n.children[e];
			a || (a = document.createElement("arq-compare-product"), a.size = "compact", n.append(a)), a.data = r;
		}
		for (; t.children.length > Ho;) t.lastElementChild.remove();
		for (; n.children.length > Ho;) n.lastElementChild.remove();
		this.#i();
	}
	#i() {
		for (let e of this.shadowRoot.querySelectorAll(".slots arq-compare-product")) e.showSku = !0;
		document.querySelector("arq-navbar")?.removeAttribute("data-arq-compare-hidden");
	}
	setScrollLeft(e) {
		if (Uo.matches) for (let t of this.shadowRoot.querySelectorAll(".products, .slots")) this.#o(t, e);
	}
	#a = /* @__PURE__ */ new WeakMap();
	#o(e, t) {
		Math.abs(e.scrollLeft - t) < 1 || (this.#a.set(e, t), e.scrollLeft = t);
	}
	refreshCompact() {
		this.#c();
	}
	#s(e) {
		if (!Uo.matches || this.#n) return;
		let t = this.#a.get(e);
		if (!(t !== void 0 && (this.#a.delete(e), Math.abs(e.scrollLeft - t) < 1))) {
			this.#n = !0;
			for (let t of this.shadowRoot.querySelectorAll(".products, .slots")) t !== e && this.#o(t, e.scrollLeft);
			this.emit("scroll", { left: e.scrollLeft }), this.#n = !1;
		}
	}
	#c() {
		let e = document.querySelector("arq-navbar"), t = e ? Math.round(e.getBoundingClientRect().height) : 0;
		this.shadowRoot.querySelector(".compact").style.setProperty("--navbar-height", `${t}px`), this.#l(t);
	}
	#l(e = 0) {
		this.#t?.disconnect(), this.#u(!1);
		let t = this.shadowRoot.querySelector(".sentinel");
		this.#t = new IntersectionObserver(([e]) => {
			let t = e.rootBounds?.top ?? 0;
			this.#u(!e.isIntersecting && e.boundingClientRect.bottom <= t);
		}, {
			rootMargin: `${Uo.matches ? 0 : -e}px 0px 10000% 0px`,
			threshold: 0
		}), this.#t.observe(t);
	}
	#u(e) {
		if (!this.getClientRects().length) return;
		this.shadowRoot.querySelector(".compact").hidden = !e;
		let t = document.querySelector("arq-navbar");
		t && Uo.matches && t.toggleAttribute("data-arq-compare-hidden", e);
	}
}).define();
//#endregion
//#region src/components/compare-table/compare-table.css?inline
var Wo = ":host{isolation:isolate;min-width:0;display:block}.scroll{overscroll-behavior-x:contain;padding-inline:var(--page-gutter);padding-block-end:var(--arq-space-section-xl);overflow-x:auto}.scroll:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:calc(-1 * var(--arq-border-strong))}:host([embedded]) .scroll{overflow:visible}.table{border-collapse:collapse;table-layout:fixed;width:100%}th,td{background:var(--arq-color-surface-default);text-align:start;vertical-align:middle;font-weight:inherit;padding:0}.label-cell{width:var(--arq-layout-compare-label);padding-inline-end:var(--arq-space-gap-lg)}thead th{border:none;height:0;padding:0}.product{padding-inline-end:var(--arq-space-gap-lg)}.group th{padding-block:var(--arq-space-gap-2xl) var(--arq-space-padding-sm-md);border-bottom:var(--arq-border-default) solid var(--arq-color-border-strong);color:var(--arq-color-text-primary)}.row>*{padding-block:var(--arq-space-padding-md);border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle)}.row-label{color:var(--arq-color-text-secondary);overflow-wrap:break-word}.value{padding-inline:var(--arq-space-padding-md) var(--arq-space-gap-lg);border-left:var(--arq-border-default) solid var(--arq-color-border-subtle);color:var(--arq-color-text-primary);overflow-wrap:break-word;text-align:center}@media screen and (width>=768px) and (width<=1439px){.label-cell{padding-inline-end:var(--arq-space-gap-md)}.value{padding-inline:var(--arq-space-padding-sm-md) var(--arq-space-padding-md)}}@media (width<=767px){:host{--column-width:var(--arq-layout-compare-column)}.scroll{padding-inline:0;overflow-x:visible}.group,.group th{display:block}.group th{margin-inline-start:var(--page-gutter);padding-inline:0}.table{table-layout:auto;width:100%;min-width:0}.row{grid-template-columns:repeat(3, var(--column-width));padding-inline:var(--page-gutter);column-gap:var(--arq-space-gap-md);row-gap:var(--arq-space-gap-sm);scrollbar-width:none;border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle);width:100%;display:grid;overflow-x:auto}.row::-webkit-scrollbar{display:none}.row>*{border-bottom:none;padding-block:0}.row .label-cell{z-index:1;width:max-content;max-width:calc(100vw - 2 * var(--page-gutter));padding:var(--arq-space-padding-xs) 0;background:var(--arq-color-surface-default);grid-column:1/-1;justify-self:start;position:sticky;inset-inline-start:0}.row .value{width:var(--column-width);padding:var(--arq-space-padding-sm) 0 var(--arq-space-padding-sm) var(--arq-space-padding-md)}.row .value:first-of-type{border-left:none;padding-inline-start:0}.table,thead,tbody{display:block}.row+.row{margin-top:var(--arq-space-gap-sm)}.group+.row{margin-top:var(--arq-space-padding-md)}}@media print{.scroll{padding-block-end:0;overflow:visible}.empty,thead{display:none}.table,tbody,.group,.group th{display:block}.group{break-inside:avoid;break-after:avoid}.group th{padding-block-start:var(--arq-space-gap-xl)}.row>*,.row>.label-cell{padding-block:var(--arq-space-padding-sm)}.row:last-child{break-before:avoid}.row{grid-template-columns:auto repeat(var(--columns,3), minmax(0, 1fr));break-inside:avoid;display:grid}.row>*{align-items:center;display:flex}.row>.value{justify-content:center}.row>.empty{display:none}}@media print and (width<=767px){.scroll{padding-inline:var(--page-gutter)}.group th{margin-inline-start:0;padding-inline:0}.row{box-sizing:border-box;border-bottom:none;gap:0;padding-inline:0;overflow:visible}.row+.row,.group+.row{margin-top:0}.row>*{padding-block:var(--arq-space-padding-sm);border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle)}.row .label-cell{width:var(--arq-layout-compare-label);padding-inline:0 var(--arq-space-gap-lg);grid-column:auto;position:static}.row .value,.row .value:first-of-type{width:auto;padding-inline:var(--arq-space-padding-md) var(--arq-space-gap-lg);border-left:var(--arq-border-default) solid var(--arq-color-border-subtle)}}@media print{.row>*,.row .value,.row .value:first-of-type{border-color:var(--arq-color-border-default)}.row .row-label,.row .value{font-size:var(--arq-type-body-sm-size);line-height:var(--arq-type-body-sm-leading)}.row .row-label{font-weight:var(--arq-font-weight-regular)}.row .value{font-weight:var(--arq-font-weight-medium)}.group .group-label{font-size:var(--arq-type-body-compact-size);line-height:var(--arq-type-body-compact-leading);font-weight:var(--arq-font-weight-medium)}}@media screen and (width<=767px){:host([embedded]) .table{width:max-content;min-width:100%}:host([embedded]) .row{width:max-content;overflow:visible}:host([embedded]) .row .label-cell{inset-inline-start:var(--page-gutter)}:host([embedded]) .group th{width:calc(100vw - var(--page-gutter));position:sticky;inset-inline-start:var(--page-gutter)}}", Go = (e) => String(e ?? "").replace(/[&<>"]/g, (e) => ({
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;"
})[e]), Ko = 3, qo = matchMedia("(max-width: 767px)");
(class extends L {
	static tag = "arq-compare-table";
	static styles = Wo;
	static properties = {
		onlyDifferences: { type: Boolean },
		label: {
			type: String,
			default: "Comparación de productos"
		},
		embedded: { type: Boolean }
	};
	static template = "<div class=\"scroll\" tabindex=\"0\" role=\"region\"><table class=\"table\" role=\"table\"><thead role=\"rowgroup\"></thead></table></div>";
	#e = {
		products: [],
		groups: []
	};
	#t = !1;
	get data() {
		return this.#e;
	}
	set data(e) {
		this.#e = {
			products: (e?.products ?? []).slice(0, Ko),
			groups: e?.groups ?? []
		}, this.isConnected && this.#n();
	}
	setup() {
		qo.addEventListener("change", () => this.#r()), this.shadowRoot.querySelector(".table").addEventListener("scroll", (e) => {
			let t = e.target;
			!qo.matches || this.#t || !t.classList?.contains("row") || (this.#t = !0, this.setScrollLeft(t.scrollLeft), this.emit("scroll", { left: t.scrollLeft }), this.#t = !1);
		}, !0), this.#n();
	}
	update(e) {
		let t = this.shadowRoot;
		if (e.has("label") && t.querySelector(".scroll").setAttribute("aria-label", this.label ?? ""), e.has("onlyDifferences") && this.#i(), e.has("embedded")) {
			let e = t.querySelector(".scroll");
			this.embedded ? (e.removeAttribute("tabindex"), e.removeAttribute("role")) : (e.setAttribute("tabindex", "0"), e.setAttribute("role", "region"));
		}
	}
	#n() {
		let e = this.shadowRoot, t = e.querySelector(".table"), { products: n, groups: r } = this.#e;
		e.querySelector(".scroll").style.setProperty("--columns", String(Math.max(1, Math.min(Ko, n.length))));
		let i = (e) => e >= n.length ? " empty" : "";
		e.querySelector("thead").innerHTML = "<tr role=\"row\"><th scope=\"col\" class=\"label-cell\" role=\"columnheader\"></th>" + Array.from({ length: Ko }, (e, t) => n[t]).map((e, t) => `<th scope="col" class="product${i(t)}" role="columnheader">${e ? `<span class="visually-hidden">${Go(e.name)} (${Go(e.meta ?? e.sku)})</span>` : ""}</th>`).join("") + "</tr>";
		for (let e of t.querySelectorAll("tbody")) e.remove();
		for (let e of r) {
			let r = document.createElement("tbody");
			r.setAttribute("role", "rowgroup"), r.innerHTML = `<tr class="group" role="row"><th scope="colgroup" colspan="4" role="columnheader"><span class="group-label role-body-xl">${Go(e.label)}</span></th></tr>` + (e.rows ?? []).map((e) => {
				let t = n.map((t, n) => e.values?.[n] ?? "—"), r = t.length > 0 && t.every((e) => String(e) === String(t[0])), a = Array.from({ length: Ko }, (e, n) => t[n] ?? "");
				return `<tr class="row" role="row"${r ? " data-same" : ""}><th scope="row" class="label-cell row-label" role="rowheader">${Go(e.label)}</th>` + a.map((e, t) => `<td class="value${i(t)} role-body-lg-regular" role="cell">${Go(e)}</td>`).join("") + "</tr>";
			}).join(""), t.append(r);
		}
		this.#r(), this.#i();
	}
	#r() {
		let e = qo.matches;
		for (let t of this.shadowRoot.querySelectorAll(".row-label")) t.classList.toggle("role-body", !e), t.classList.toggle("role-body-sm", e);
	}
	setScrollLeft(e) {
		for (let t of this.shadowRoot.querySelectorAll(".row")) t.scrollLeft = e;
	}
	#i() {
		let e = this.onlyDifferences;
		for (let t of this.shadowRoot.querySelectorAll("tbody")) {
			let n = 0;
			for (let r of t.querySelectorAll("tr.row")) r.hidden = e && r.hasAttribute("data-same"), r.hidden || n++;
			t.hidden = n === 0;
		}
	}
}).define();
//#endregion
//#region src/components/comparativa/comparativa.css?inline
var Jo = ":host{display:block}.page{flex-direction:column;max-width:100%;display:flex;overflow-x:clip}.status{padding-inline:var(--page-gutter);padding-block:var(--arq-space-section-xs);color:var(--arq-color-text-secondary);margin:0}.status:empty{padding:0;position:absolute}.mobile-controls{display:none}@media (width<=767px){.mobile-controls:not([hidden]){padding-inline:var(--page-gutter);align-items:center;padding-block-end:var(--arq-space-gap-md);display:flex}.scroll{overscroll-behavior-x:contain;scrollbar-width:none;overflow-x:auto}.scroll::-webkit-scrollbar{display:none}.scroll:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:calc(-1 * var(--arq-border-strong))}}@media print{.page{padding-block:var(--arq-space-padding-2xl);-webkit-box-decoration-break:clone;box-decoration-break:clone}.mobile-controls,.mobile-controls:not([hidden]){display:none}.scroll{overflow:visible}}", Yo = "arq:compare", Xo = 3, Zo = matchMedia("(max-width: 767px)"), Qo = {
	count: (e) => e === 1 ? "1 producto seleccionado." : `${e} productos seleccionados.`,
	printTitle: (e) => `Comparativa · ${e.join(" · ")} · Macroled Arq`,
	empty: "Elegí hasta 3 productos para comparar desde el listado de Productos.",
	error: "No se pudo cargar la comparación. Probá de nuevo en unos minutos."
};
function $o() {
	let e = new URLSearchParams(location.search).get("sku");
	return e ? e.split(",").map((e) => decodeURIComponent(e.trim())).filter(Boolean).slice(0, Xo) : [];
}
function es(e) {
	try {
		localStorage.setItem(Yo, JSON.stringify(e.map((e) => ({
			sku: e.sku,
			name: e.name,
			meta: e.meta,
			image: e.image
		}))));
	} catch {}
}
(class extends L {
	static tag = "arq-comparativa";
	static styles = Jo;
	static properties = {};
	static template = "<div class=\"page\"><p class=\"status role-body\" role=\"status\"></p><div class=\"mobile-controls\" hidden><arq-toggle show-label class=\"diff-mobile\">Solo diferencias</arq-toggle></div><div class=\"scroll\" aria-label=\"Comparación de productos\" hidden><arq-compare-header class=\"header\" embedded></arq-compare-header><arq-compare-table class=\"table\" embedded></arq-compare-table></div></div><arq-compare-picker class=\"picker\"></arq-compare-picker>";
	#e = [];
	#t = 0;
	#n = [];
	#r = !1;
	#i = null;
	setup() {
		let e = this.shadowRoot, t = e.querySelector(".header"), n = e.querySelector(".table"), r = (e) => {
			this.#r = e, t.onlyDifferences = e, n.onlyDifferences = e;
		};
		t.addEventListener("arq:differences", (e) => r(e.detail.value)), e.querySelector(".diff-mobile").addEventListener("arq:change", (e) => r(e.detail.checked)), t.addEventListener("arq:remove", (e) => {
			this.#e = this.#e.filter((t) => t !== e.detail.sku), this.#u();
		}), t.addEventListener("arq:change", (e) => this.#l(e.detail));
		let i = e.querySelector(".picker");
		t.addEventListener("arq:add", (e) => {
			e.stopPropagation(), i.show();
		}), i.addEventListener("arq:search", () => this.#c()), i.addEventListener("arq:close", (e) => {
			if (e.detail.restored) return;
			let n = [...t.shadowRoot.querySelectorAll(".products arq-compare-product")], r = n.find((e) => e.hasAttribute("empty"));
			(r ? r.shadowRoot.querySelector(".add") : n.at(-1)?.shadowRoot.querySelector(".title"))?.focus();
		}), i.addEventListener("arq:add", (e) => {
			let { sku: t } = e.detail.item;
			this.#e.length >= Xo || this.#e.includes(t) || (this.#e = [...this.#e, t], this.#u());
		});
		let a = e.querySelector(".scroll"), o = null;
		a.addEventListener("scroll", () => {
			if (o !== null && Math.abs(a.scrollLeft - o) < 1) {
				o = null;
				return;
			}
			o = null, Zo.matches && t.setScrollLeft(a.scrollLeft);
		}), t.addEventListener("arq:scroll", (e) => {
			!Zo.matches || Math.abs(a.scrollLeft - e.detail.left) < 1 || (o = e.detail.left, a.scrollLeft = e.detail.left);
		}), Zo.addEventListener("change", () => this.#s()), this.#s(), this.#e = $o(), this.#u();
	}
	connectedCallback() {
		super.connectedCallback?.(), addEventListener("beforeprint", this.#a), addEventListener("afterprint", this.#o);
	}
	disconnectedCallback() {
		super.disconnectedCallback?.(), removeEventListener("beforeprint", this.#a), removeEventListener("afterprint", this.#o);
	}
	#a = () => {
		this.#n.length && (this.#i ??= document.title, document.title = Qo.printTitle(this.#n));
	};
	#o = () => {
		this.#i !== null && (document.title = this.#i, this.#i = null);
	};
	#s() {
		let e = this.shadowRoot.querySelector(".scroll");
		Zo.matches ? (e.setAttribute("tabindex", "0"), e.setAttribute("role", "region")) : (e.removeAttribute("tabindex"), e.removeAttribute("role"));
	}
	async #c() {
		let e = this.shadowRoot.querySelector(".picker"), t = [...this.#e], n = ++this.#t;
		e.count = t.length;
		try {
			let { items: r } = await Un({
				...e.search,
				selected: t
			});
			n === this.#t && (e.items = r);
		} catch (t) {
			console.error("[arq] compare-picker: no se pudo cargar el catálogo", t), n === this.#t && e.showError();
		}
	}
	async #l({ index: e, field: t, value: n }) {
		let r = this.#e[e];
		if (!n || !r) return;
		let i = await Mn(r, t, n);
		i && i !== r && (this.#e[e] = i, this.#e = this.#e.slice(0, Xo), this.#u());
	}
	async #u() {
		let e = this.shadowRoot, t = e.querySelector(".header"), n = e.querySelector(".table"), r = e.querySelector(".scroll"), i = e.querySelector(".mobile-controls");
		this.setAttribute("aria-busy", "true");
		let a = null, o = !1;
		try {
			a = this.#e.length ? await Nn(this.#e) : {
				products: [],
				groups: []
			};
		} catch (e) {
			o = !0, console.error("[arq] comparativa: no se pudo cargar el catálogo", e);
		}
		if (this.removeAttribute("aria-busy"), !a || o && !a.products.length) {
			this.#f(o ? Qo.error : Qo.empty), r.hidden = !0, i.hidden = !0;
			return;
		}
		if (this.#e = a.products.map((e) => e.sku), this.#n = a.products.map((e) => e.name).filter(Boolean), !this.#e.length) {
			this.#f(Qo.empty), r.hidden = !0, i.hidden = !0;
			return;
		}
		this.#f(""), this.#d(this.#e.length), r.hidden = !1, i.hidden = !1, t.products = a.products, t.onlyDifferences = this.#r, n.data = {
			products: a.products,
			groups: a.groups
		}, n.onlyDifferences = this.#r, e.querySelector(".diff-mobile").checked = this.#r, requestAnimationFrame(() => t.refreshCompact()), es(a.products), e.querySelector(".picker").open && this.#c();
		let s = new URL(location.href);
		s.searchParams.set("sku", this.#e.map(encodeURIComponent).join(",")), history.replaceState(history.state, "", s);
	}
	#d(e) {
		for (let t of document.querySelectorAll("[data-arq-compare-count]")) t.textContent = e ? Qo.count(e) : "";
	}
	#f(e) {
		let t = this.shadowRoot.querySelector(".status");
		t.textContent = e, e && this.#d(0);
	}
}).define();
//#endregion
//#region src/components/mega-link/mega-link.css?inline
var ts = ":host{min-width:0;display:block}.link{box-sizing:border-box;align-items:center;gap:var(--arq-space-gap-md);width:100%;padding:var(--arq-space-gap-sm-md) 0;border:0;border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle);color:var(--arq-color-text-primary);font:inherit;text-align:start;background:0 0;margin:0;text-decoration:none;display:flex}.link.with-meta{padding-block:var(--arq-space-gap-sm)}:host([size=large]) .link,button.link{gap:var(--arq-space-gap-sm);padding-block:var(--arq-space-gap-md)}:host([size=large][show-image]) .link{padding-block:var(--arq-space-gap-sm-md)}@media (hover:hover) and (pointer:fine){.link[href]:hover,button.link:hover{background:var(--arq-color-surface-hover)}}button.link{cursor:pointer}.link:focus-visible,.trigger:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.text{flex-direction:column;flex:1;min-width:0;display:flex}:host([size=large]) .text{gap:var(--arq-space-gap-xs)}.name{overflow-wrap:break-word}.meta{color:var(--arq-color-text-tertiary)}.thumb{width:var(--arq-layout-mega-link-thumb);aspect-ratio:1;background:var(--arq-color-surface-subtle);flex:none;position:relative}.thumb[hidden]{display:none}.thumb img{object-fit:cover;width:100%;height:100%;position:absolute;inset:0}.arrow,.chevron{color:var(--arq-color-icon-primary);flex:none;display:inline-flex}.arrow[hidden]{display:none}.link:not(:focus-visible) .arrow{visibility:hidden}@media (hover:hover) and (pointer:fine){.link:hover .arrow{visibility:visible}}.icon{width:var(--arq-icon-md);height:var(--arq-icon-md)}.group{border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle)}.trigger{align-items:center;gap:var(--arq-space-gap-sm);width:100%;padding:var(--arq-space-gap-md) 0;color:var(--arq-color-text-primary);font:inherit;text-align:start;cursor:pointer;background:0 0;border:0;display:flex}@media (hover:hover) and (pointer:fine){.trigger:hover{background:var(--arq-color-surface-hover)}}.trigger .name{flex:1;min-width:0}.toggle{color:var(--arq-color-icon-primary);flex:none;display:inline-flex}:host(:not([open])) [data-icon=minus],:host([open]) [data-icon=plus]{display:none}.links{padding-bottom:var(--arq-space-gap-md);flex-direction:column;align-items:flex-start;display:flex}::slotted(a){width:100%;padding-block:var(--arq-space-gap-sm);color:var(--arq-color-text-primary);font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-light);font-size:var(--arq-type-body-lg-size);line-height:var(--arq-type-body-lg-leading);letter-spacing:var(--arq-font-tracking-normal);text-decoration:none;display:block}::slotted(a:focus-visible){outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}::slotted(arq-button){margin-block:var(--arq-space-gap-sm)}@media (hover:none){.link[href]:active,button.link:active,.trigger:active{background:var(--arq-color-surface-hover)}}", ns = (e, t) => `<${e} class="link"${e === "button" ? " type=\"button\"" : ""}><span class="text"><span class="name"><slot></slot></span><span class="meta"><slot name="meta"></slot></span></span><span class="thumb" hidden><img alt="" hidden></span>` + t + `</${e}>`, rs = ns("a", `<span class="arrow">${R("arrow-right")}</span>`), is = ns("button", `<span class="chevron">${R("chevron-right")}</span>`), as = `<div class="group"><button type="button" class="trigger"><span class="name role-body-xl"><slot></slot></span><span class="toggle">${R("plus")}${R("minus")}</span></button><div class="links"><slot name="links"></slot></div></div>`;
(class extends L {
	#e = [];
	#t = "";
	static tag = "arq-mega-link";
	static styles = ts;
	static properties = {
		type: {
			type: String,
			values: ["link", "group"],
			default: "link"
		},
		size: {
			type: String,
			values: ["default", "large"],
			default: "default"
		},
		open: { type: Boolean },
		showArrow: { type: Boolean },
		showImage: { type: Boolean },
		image: { type: String },
		fallbacks: { type: String },
		submenu: { type: Boolean },
		href: { type: String }
	};
	setup() {
		let e = this.shadowRoot, t = document.createElement("template");
		if (t.innerHTML = this.type === "group" ? as : this.submenu ? is : rs, e.append(t.content), this.type === "group") this.disclosure = new Li(this, {
			trigger: e.querySelector(".trigger"),
			panel: e.querySelector(".links")
		});
		else {
			e.querySelector("slot[name=\"meta\"]").addEventListener("slotchange", () => this.#n());
			let t = e.querySelector("img");
			t.addEventListener("load", () => t.hidden = !1), t.addEventListener("error", () => {
				let e = this.#e.shift();
				e ? t.src = e : t.hidden = !0;
			});
		}
	}
	focus(e) {
		let t = this.shadowRoot.querySelector(".link, .trigger");
		t ? t.focus(e) : super.focus(e);
	}
	update() {
		let e = this.shadowRoot.querySelector(".link");
		if (!e) return;
		e.localName === "a" && (this.href ? e.setAttribute("href", this.href) : e.removeAttribute("href"), this.shadowRoot.querySelector(".arrow").hidden = !this.showArrow);
		let t = this.size === "large";
		e.querySelector(".name").className = `name ${t || this.submenu ? "role-heading-3" : "role-body-xl"}`, e.querySelector(".meta").className = "meta role-body-compact-regular", this.#n(), this.#r();
	}
	#n() {
		let e = this.shadowRoot.querySelector("slot[name=\"meta\"]");
		if (!e) return;
		let t = e.assignedNodes({ flatten: !0 }).some((e) => e.textContent.trim());
		e.parentElement.hidden = !t, this.shadowRoot.querySelector(".link").classList.toggle("with-meta", t);
	}
	#r() {
		let e = this.shadowRoot.querySelector(".thumb"), t = e.querySelector("img");
		if (e.hidden = !this.showImage, this.showImage && this.image) {
			let e = `${this.image}|${this.fallbacks ?? ""}`;
			if (e !== this.#t) {
				this.#t = e;
				try {
					this.#e = JSON.parse(this.fallbacks || "[]").filter((e) => e && e !== this.image);
				} catch {
					this.#e = [];
				}
				t.getAttribute("src") === this.image ? t.hidden && t.complete && t.dispatchEvent(new Event("error")) : t.src = this.image;
			}
		} else t.removeAttribute("src"), t.hidden = !0;
	}
}).define();
//#endregion
//#region src/components/mega-menu/mega-menu.css?inline
var os = ":host{display:block}.menu{grid-template-columns:minmax(0, 1fr) var(--arq-layout-mega-menu-image);background:var(--arq-color-surface-default);grid-template-rows:auto 1fr;display:grid}.tabs{gap:var(--arq-space-gap-xl);padding:var(--arq-space-gap-md) var(--page-gutter) 0;border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle);grid-area:1/1;display:flex}.body{display:contents}.panels{min-width:0;min-height:calc(var(--arq-layout-mega-menu-image) * 5 / 4);border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle);flex:1;grid-area:2/1;display:flex}.panel{min-width:0;padding:var(--arq-space-padding-2xl) var(--arq-space-padding-2xl) var(--arq-space-padding-2xl) var(--page-gutter);flex-direction:column;flex:1;display:flex}.panel[hidden]{display:none}.columns{gap:var(--arq-space-gap-2xl);flex:1;display:flex}.column{justify-content:space-between;align-items:flex-start;gap:var(--arq-space-gap-xl);flex-direction:column;flex:1;min-width:0;display:flex}.top{gap:var(--arq-space-gap-xl-2xl);flex-direction:column;align-self:stretch;display:flex}.all-products{margin-top:var(--arq-space-gap-xl);align-self:flex-start}.title{color:var(--arq-color-text-primary);margin:0}.title-link{width:fit-content;color:inherit;text-decoration:none;display:inline-flex}.title-text{position:relative}.title-text:after{content:\"\";inset-inline:0;top:calc(100% + var(--arq-space-padding-2xs) - var(--arq-border-default));height:var(--arq-border-strong);background:var(--arq-color-border-strong);transform-origin:100%;transition:transform var(--arq-motion-duration-base) var(--arq-motion-easing-standard);position:absolute;transform:scaleX(0)}@media (hover:hover) and (pointer:fine){.title-link:hover .title-text:after{transform-origin:0;transform:scaleX(1)}}.title-link:active{color:var(--arq-color-text-tertiary)}.title-link:active .title-text:after{transform-origin:0;background:var(--arq-color-text-tertiary);transform:scaleX(1)}.title-link:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.links{flex-direction:column;align-self:stretch;display:flex}.panel--colecciones{gap:var(--arq-space-gap-xl)}.columns--collections{align-items:flex-start;gap:var(--arq-space-gap-xl);flex:none}.columns--collections .column{justify-content:flex-start;align-items:stretch}.preview{box-sizing:border-box;justify-content:flex-end;gap:var(--arq-space-gap-sm);width:var(--arq-layout-mega-menu-image);padding:var(--arq-space-padding-xl-2xl);background:var(--arq-color-surface-subtle);flex-direction:column;flex:none;grid-area:1/2/3;display:flex;position:relative;overflow:hidden}.photos{isolation:isolate;position:absolute;inset:0}.photo{object-fit:cover;background:var(--arq-color-surface-subtle);opacity:0;width:100%;height:100%;position:absolute;inset:0}.photo.is-leaving{z-index:0;opacity:1}.photo.is-front{z-index:1;opacity:1;transition:opacity var(--arq-motion-duration-slow) var(--arq-motion-easing-illumination-image)}.caption.is-in{animation:arq-mega-caption-in var(--arq-motion-duration-slow) var(--arq-motion-easing-standard) both}@keyframes arq-mega-caption-in{0%{opacity:0}}@media (prefers-reduced-motion:reduce){.photo.is-front{transition-duration:var(--arq-motion-duration-fade)}.caption.is-in{animation-duration:var(--arq-motion-duration-fade)}}.preview:after{content:\"\";background:linear-gradient(#0000 45%,#000000b3 100%);position:absolute;inset:0}.preview:not(.has-photo):after{display:none}.caption{z-index:1;gap:var(--arq-space-gap-sm);color:var(--arq-color-text-inverse);flex-direction:column;display:flex;position:relative}.preview:not(.has-photo) .caption,.caption[hidden],.eyebrow[hidden]{display:none}.eyebrow,.preview-title{margin:0}@media (width>=768px) and (width<=1023px){.menu{grid-template-columns:minmax(0,1fr)}.panels{min-height:0}.preview{display:none}.panel{padding-inline-end:var(--page-gutter)}}", W = (e) => String(e ?? "").replace(/[&<>"]/g, (e) => ({
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;"
})[e]), ss = [
	{
		id: "por-espacio",
		label: "Por espacio"
	},
	{
		id: "lamparas-y-artefactos",
		label: "Lámparas y artefactos"
	},
	{
		id: "colecciones",
		label: "Colecciones"
	}
], cs = 4, ls = {
	"por-espacio": (e) => y(e.dataset.eyebrow) === "interior" && y(e.dataset.title) === "embutir",
	colecciones: (e) => y(e.dataset.title) === "koen",
	"lamparas-y-artefactos": (e) => /l[aá]mpara/i.test(e.dataset.title)
}, us = 0;
(class extends L {
	static tag = "arq-mega-menu";
	static styles = os;
	static properties = {
		tab: {
			type: String,
			values: ss.map((e) => e.id),
			default: "por-espacio"
		},
		label: {
			type: String,
			default: "Productos"
		}
	};
	static template = "<div class=\"menu\"><div class=\"tabs\" role=\"tablist\"></div><div class=\"body\"><div class=\"panels\"></div><div class=\"preview\" aria-hidden=\"true\"><div class=\"photos\"><img class=\"photo\" alt=\"\"><img class=\"photo\" alt=\"\"></div><div class=\"caption\"><p class=\"eyebrow role-label\"></p><p class=\"preview-title role-heading-2\"></p></div></div></div></div>";
	#e = null;
	#t = {};
	#n = null;
	#r = 0;
	#i = ++us;
	get navigation() {
		return this.#e;
	}
	set navigation(e) {
		this.#e = e, this.shadowRoot.querySelector(".tabs") && this.#o();
	}
	get images() {
		return this.#t;
	}
	set images(e) {
		this.#t = e ?? {}, this.shadowRoot.querySelector(".tabs") && this.#u();
	}
	reset(e) {
		let t = [...this.shadowRoot.querySelectorAll("arq-tab")].map((e) => e.value), n = (e && ss.some((t) => t.id === e) && (!t.length || t.includes(e)) ? e : null) ?? t[0];
		n && n !== this.tab ? this.tab = n : this.shadowRoot.querySelector(".tabs") && this.#u();
	}
	setup() {
		let e = this.shadowRoot, t = e.querySelector(".tabs");
		this.select = new sa(t, { items: "arq-tab" }), t.addEventListener("arq:change", (e) => {
			e.stopPropagation(), this.tab = e.detail.value;
		});
		let n = e.querySelector(".panels"), r = (e) => {
			let t = e.target.closest?.("arq-mega-link");
			t && this.#d(t);
		};
		n.addEventListener("pointerover", r), n.addEventListener("focusin", r), this.#o();
	}
	update(e) {
		let t = this.shadowRoot;
		if (e.has("label") && t.querySelector(".tabs").setAttribute("aria-label", this.label ?? ""), e.has("tab")) {
			for (let e of t.querySelectorAll("arq-tab")) e.selected = e.value === this.tab;
			for (let e of t.querySelectorAll("[role=\"tabpanel\"]")) e.hidden = e.dataset.tab !== this.tab;
			this.#u();
		}
	}
	#a(e) {
		let t = this.#e?.sections ?? {};
		return e === "por-espacio" ? [t.interior, t.exterior].filter(Boolean) : e === "lamparas-y-artefactos" ? [t["lamparas-y-artefactos"]].filter(Boolean) : [];
	}
	#o() {
		let e = this.shadowRoot, t = this.#e, n = ss.filter((e) => e.id === "colecciones" ? t?.collections?.length : this.#a(e.id).length);
		n.length && !n.some((e) => e.id === this.tab) && (this.tab = n[0].id);
		let r = (e) => ({
			tab: `mega-tab-${this.#i}-${e.id}`,
			panel: `mega-panel-${this.#i}-${e.id}`
		});
		e.querySelector(".tabs").innerHTML = n.map((e) => `<arq-tab id="${r(e).tab}" value="${e.id}" aria-controls="${r(e).panel}"${e.id === this.tab ? " selected" : ""}>${W(e.label)}</arq-tab>`).join(""), e.querySelector(".panels").innerHTML = n.map((e) => {
			let n = e.id === "colecciones" ? this.#l(t) : this.#c(this.#a(e.id), e.id === "por-espacio" || e.id === "lamparas-y-artefactos") + (e.id === "por-espacio" ? "<arq-button class=\"all-products\" type=\"underline\" show-underline show-icon icon=\"arrow-up-right\" href=\"/arq/productos\">Ver todos los productos</arq-button>" : "");
			return `<div class="panel panel--${e.id}" role="tabpanel" id="${r(e).panel}" aria-labelledby="${r(e).tab}" data-tab="${e.id}"${e.id === this.tab ? "" : " hidden"}>${n}</div>`;
		}).join(""), this.select.refresh(), this.#u();
	}
	#s(e, t, n = "") {
		return `<arq-mega-link href="${W(e.href)}" show-arrow data-image="${W(e.image ?? "")}" data-fallbacks="${W(JSON.stringify(e.fallbacks ?? []))}" data-eyebrow="${W(t)}" data-title="${W(e.label)}">${W(e.label)}${n ? `<span slot="meta">${W(n)}</span>` : ""}</arq-mega-link>`;
	}
	#c(e, t = !1) {
		let n = (e) => t ? `<a class="title title-link role-heading-1" href="${W(e.href)}"><span class="title-text">${W(e.label)}</span></a>` : `<p class="title role-heading-1">${W(e.label)}</p>`;
		return "<div class=\"columns\">" + e.map((e) => `<div class="column"><div class="top">${n(e)}<div class="links">${e.links.map((t) => this.#s(t, e.label)).join("")}</div></div>` + (t ? "" : `<arq-button class="all" type="underline" show-underline show-icon icon="arrow-up-right" href="${W(e.all.href)}">${W(e.all.label)}</arq-button>`) + "</div>").join("") + "</div>";
	}
	#l(e) {
		let t = e?.collections ?? [], n = Math.floor(t.length / cs), r = t.length % cs, i = 0;
		return "<p class=\"title role-heading-1\">Colecciones</p><div class=\"columns columns--collections\">" + Array.from({ length: cs }, (e, a) => {
			let o = n + +(a < r), s = t.slice(i, i + o);
			return i += o, s;
		}).map((e) => `<div class="links column">${e.map((e) => this.#s(e, e.eyebrow, e.meta)).join("")}</div>`).join("") + "</div>";
	}
	#u() {
		let e = [...this.shadowRoot.querySelectorAll(`[role="tabpanel"][data-tab="${this.tab}"] arq-mega-link`)], t = e.find(ls[this.tab] ?? (() => !1)) ?? e[0];
		t ? this.#d(t, this.#t[this.tab]) : this.#f(this.#t[this.tab], "", "");
	}
	#d(e, t) {
		this.#f(t || e.dataset.image, e.dataset.eyebrow, e.dataset.title, t ? [] : JSON.parse(e.dataset.fallbacks || "[]"));
	}
	async #f(e, t, n, r = []) {
		let i = ++this.#r, a = [e, ...r].filter(Boolean), o = a[0] && a[0] === this.#n ? this.#n : await this.#p(a);
		i === this.#r && (o !== this.#n && await this.#m(o, i), i === this.#r && this.#h(t, n));
	}
	#p(e) {
		let t = (n) => n >= e.length ? Promise.resolve(null) : new Promise((r) => {
			let i = new Image();
			i.onload = () => r(e[n]), i.onerror = () => r(t(n + 1)), i.src = e[n];
		});
		return t(0);
	}
	async #m(e, t) {
		let n = this.shadowRoot, r = [...n.querySelectorAll(".photo")], i = r.find((e) => e.classList.contains("is-front")), a = r.find((e) => e !== i);
		e && (a.classList.remove("is-leaving"), a.offsetWidth, a.src = e, await a.decode().catch(() => {}), t !== this.#r) || (this.#n = e, n.querySelector(".preview").classList.toggle("has-photo", !!e), i && (i.classList.remove("is-front"), e && i.classList.add("is-leaving")), e && a.classList.add("is-front"));
	}
	#h(e, t) {
		let n = this.shadowRoot, r = n.querySelector(".caption");
		(n.querySelector(".preview-title").textContent !== (t ?? "") || n.querySelector(".eyebrow").textContent !== (e ?? "")) && (n.querySelector(".eyebrow").textContent = e ?? "", n.querySelector(".eyebrow").hidden = !e, n.querySelector(".preview-title").textContent = t ?? "", r.hidden = !t, r.classList.remove("is-in"), r.offsetWidth, r.classList.add("is-in"));
	}
}).define();
//#endregion
//#region src/base/highlight.js
var ds = (e) => e.replace(/[&<>"]/g, (e) => ({
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;"
})[e]), fs = (e) => e.normalize("NFD")[0].toLowerCase()[0];
function ps(e, t) {
	let n = [...String(e ?? "")], r = [...new Set([...String(t ?? "").trim()].map(fs).join("").split(/\s+/).filter(Boolean))];
	if (!r.length) return ds(n.join(""));
	let i = n.map(fs).join(""), a = Array(n.length).fill(!1);
	for (let e of r) for (let t = i.indexOf(e); t !== -1; t = i.indexOf(e, t + 1)) for (let n = t; n < t + e.length; n++) a[n] = !0;
	let o = "";
	for (let e = 0; e < n.length;) {
		let t = e;
		for (; t < n.length && a[t] === a[e];) t++;
		let r = ds(n.slice(e, t).join(""));
		o += a[e] ? `<span class="match role-body-medium">${r}</span>` : r, e = t;
	}
	return o;
}
//#endregion
//#region src/components/search-result/search-result.css?inline
var ms = ":host{min-width:0;display:block}.result{align-items:center;gap:var(--arq-space-gap-md);padding:var(--arq-space-gap-sm) var(--search-inline,var(--arq-space-padding-md));border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle);background:var(--arq-color-surface-default);color:var(--arq-color-text-primary);text-decoration:none;display:flex}.result.active{background:var(--arq-color-surface-hover)}@media (hover:hover) and (pointer:fine){.result[href]:hover{background:var(--arq-color-surface-hover)}}.result:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:calc(var(--arq-border-strong) * -1)}.thumb{width:var(--arq-layout-search-thumb);height:var(--arq-layout-search-thumb);background:var(--arq-color-surface-subtle);flex:none}.thumb img{object-fit:cover;width:100%;height:100%;display:block}.text{gap:var(--arq-space-gap-xs);flex-direction:column;flex:1;min-width:0;display:flex}.name,.meta{overflow-wrap:break-word}.meta{color:var(--arq-color-text-tertiary)}.arrow{color:var(--arq-color-icon-primary);flex:none;display:inline-flex}.icon{width:var(--arq-icon-md);height:var(--arq-icon-md)}:host([type=simple]) .result{gap:var(--arq-space-gap-lg);background:0 0;border-bottom:0;padding-block:0}:host([type=simple]) .result.active{background:0 0}@media (hover:hover) and (pointer:fine){:host([type=simple]) .result[href]:hover{background:0 0}}:host([type=simple]) .result:focus-visible{outline-offset:2px}:host([type=simple]) .thumb{width:var(--arq-layout-result-thumb);height:var(--arq-layout-result-thumb)}:host([type=simple]) .meta,:host([type=simple]) .arrow{display:none}:host([type=simple]) .name{color:var(--arq-color-text-tertiary);transition:color var(--arq-motion-duration-fast) var(--arq-motion-easing-standard)}.name.has-marks slot{display:none}.match,:host([type=simple]) .result.active .name,:host([type=simple]) .result:focus-visible .name{color:var(--arq-color-text-primary)}@media (hover:hover) and (pointer:fine){:host([type=simple]) .result[href]:hover .name{color:var(--arq-color-text-primary)}}@media (hover:none){.result[href]:active{background:var(--arq-color-surface-hover)}:host([type=simple]) .result[href]:active{background:0 0}:host([type=simple]) .result[href]:active .name{color:var(--arq-color-text-primary)}}";
(class extends L {
	static tag = "arq-search-result";
	static styles = ms;
	static properties = {
		type: {
			type: String,
			values: ["default", "simple"],
			default: "default"
		},
		href: { type: String },
		term: {
			type: String,
			default: ""
		},
		image: { type: String },
		active: { type: Boolean }
	};
	static template = `<a class="result"><span class="thumb"><img alt="" loading="lazy"></span><span class="text"><span class="name role-body-strong"><slot></slot><span class="marked" hidden></span></span><span class="meta role-body-sm"><slot name="meta"></slot></span></span><span class="arrow">${R("arrow-right")}</span></a>`;
	setup() {
		this.shadowRoot.querySelector("img").addEventListener("error", () => this.#e()), this.shadowRoot.querySelector("slot:not([name])").addEventListener("slotchange", () => this.#t());
	}
	#e() {
		let e = this.shadowRoot.querySelector("img");
		e.removeAttribute("src"), e.hidden = !0, e.parentElement.hidden = this.type !== "simple";
	}
	#t() {
		let e = this.shadowRoot, t = e.querySelector(".marked"), n = [...this.childNodes].filter((e) => e.nodeType !== 1 || e.slot !== "meta").map((e) => e.textContent).join("").trim(), r = this.type === "simple" && !!this.term?.trim() && !!n;
		t.hidden = !r, e.querySelector(".name").classList.toggle("has-marks", r), t.innerHTML = r ? ps(n, this.term) : "";
	}
	focus(e) {
		this.shadowRoot.querySelector("a").focus(e);
	}
	click() {
		this.shadowRoot.querySelector("a").click();
	}
	update() {
		let e = this.shadowRoot, t = e.querySelector("a");
		this.href ? t.setAttribute("href", this.href) : t.removeAttribute("href"), t.classList.toggle("active", this.active);
		let n = e.querySelector(".name");
		n.classList.toggle("role-body-strong", this.type !== "simple"), n.classList.toggle("role-body-regular", this.type === "simple"), this.#t();
		let r = e.querySelector("img");
		this.image ? (r.getAttribute("src") !== this.image && (r.src = this.image), r.hidden = !1, r.parentElement.hidden = !1) : this.#e();
	}
}).define();
//#endregion
//#region src/components/search-see-all/search-see-all.css?inline
var hs = ":host{min-width:0;display:block}.row{align-items:center;gap:var(--arq-space-gap-md);padding:var(--arq-space-gap-sm) var(--search-inline,var(--arq-space-padding-md));color:var(--arq-color-icon-tertiary);text-decoration:none;display:flex}@media (hover:hover) and (pointer:fine){.row[href]:hover{background:var(--arq-color-surface-hover)}}.row:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:calc(var(--arq-border-strong) * -1)}.icon{width:var(--arq-icon-md);height:var(--arq-icon-md);flex:none}.text{min-width:0;color:var(--arq-color-text-tertiary);overflow-wrap:break-word;flex:1}.term{color:var(--arq-color-text-primary)}:host([type=simple]) .row>.icon:first-child{display:none}:host([type=simple]) .text{flex:0 auto}@media (hover:hover) and (pointer:fine){:host([type=simple]) .row[href]:hover{background:0 0}:host([type=simple]) .row[href]:hover .text{color:var(--arq-color-text-primary)}}:host([type=simple]) .row:focus-visible{outline-offset:2px}:host([type=simple]) .row:focus-visible .text{color:var(--arq-color-text-primary)}:host([type=simple]) .row{gap:var(--arq-space-gap-sm);color:var(--arq-color-icon-primary);justify-content:flex-start}@media (hover:none){.row[href]:active{background:var(--arq-color-surface-hover)}:host([type=simple]) .row[href]:active{background:0 0}:host([type=simple]) .row[href]:active .text{color:var(--arq-color-text-primary)}}";
(class extends L {
	static tag = "arq-search-see-all";
	static styles = hs;
	static properties = {
		type: {
			type: String,
			values: ["default", "simple"],
			default: "default"
		},
		href: { type: String },
		term: {
			type: String,
			default: ""
		},
		count: { type: Number }
	};
	static template = `<a class="row">${R("search")}<span class="text role-body-sm"><span class="lead"></span><span class="term role-body-sm-medium"></span></span>${R("arrow-right")}</a>`;
	focus(e) {
		this.shadowRoot.querySelector("a").focus(e);
	}
	click() {
		this.shadowRoot.querySelector("a").click();
	}
	update(e) {
		let t = this.shadowRoot;
		if (e.has("type")) {
			let e = this.type === "simple", n = t.querySelector(".text"), r = t.querySelector(".term");
			n.classList.toggle("role-body-sm", !e), n.classList.toggle("role-body-compact-regular", e), r.classList.toggle("role-body-sm-medium", !e), r.classList.toggle("role-body-compact-medium", e);
		}
		let n = t.querySelector("a");
		this.href ? n.setAttribute("href", this.href) : n.removeAttribute("href");
		let r = Number.isFinite(this.count) ? ` (${this.count.toLocaleString("es-AR")})` : "";
		t.querySelector(".lead").textContent = `Ver todos los resultados${r} para `, t.querySelector(".term").textContent = `“${this.term ?? ""}”`;
	}
}).define();
//#endregion
//#region src/components/search-dropdown/search-dropdown.css?inline
var gs = ":host{min-width:0;display:block}.dropdown{background:var(--arq-color-surface-default);border:var(--arq-border-default) solid var(--arq-color-border-subtle)}.results{flex-direction:column;display:flex}:host([state=no-results]) .dropdown,:host([state=error]) .dropdown{border:0}.empty{gap:var(--arq-space-gap-xl);padding:var(--arq-space-padding-md);flex-direction:column;display:flex}.message{gap:var(--arq-space-gap-sm-md);flex-direction:column;display:flex}.message p{margin:0}.title{color:var(--arq-color-text-primary)}.help{max-width:var(--arq-layout-measure-wide);color:var(--arq-color-text-tertiary)}.explore{align-items:flex-start;gap:var(--arq-space-gap-md);flex-direction:column;display:flex}", _s = {
	title: (e) => `No encontramos resultados para «${e}».`,
	help: "Probá con otro nombre, revisá la ortografía o buscá por SKU.",
	errorTitle: "No se pudo completar la búsqueda.",
	errorHelp: "Probá de nuevo en unos minutos."
}, vs = [{
	label: "Todos los productos",
	href: E()
}];
(class extends L {
	static tag = "arq-search-dropdown";
	static styles = gs;
	static properties = {
		state: {
			type: String,
			values: [
				"results",
				"no-results",
				"error"
			],
			default: "results"
		},
		term: {
			type: String,
			default: ""
		}
	};
	static template = "<div class=\"dropdown\"><div class=\"results\"><slot></slot></div><div class=\"empty\"><div class=\"message\"><p class=\"title role-heading-2\"></p><p class=\"help role-body-regular\"></p></div><nav class=\"explore\" aria-label=\"Explorar productos\">" + vs.map((e) => `<arq-button type="underline" show-underline show-icon icon="arrow-right" href="${e.href}">${e.label}</arq-button>`).join("") + "</nav></div></div>";
	update() {
		let e = this.shadowRoot, t = this.state === "error", n = this.state === "no-results" || t;
		e.querySelector(".results").hidden = n, e.querySelector(".empty").hidden = !n, e.querySelector(".title").textContent = t ? _s.errorTitle : _s.title(this.term ?? ""), e.querySelector(".help").textContent = t ? _s.errorHelp : _s.help;
	}
}).define();
//#endregion
//#region src/components/search-screen/search-screen.css?inline
var ys = ":host{display:contents}.dialog{box-sizing:border-box;border-radius:var(--arq-radius-control);background:var(--arq-color-surface-default);width:100%;max-width:none;height:100dvh;max-height:none;color:var(--arq-color-text-primary);border:0;margin:0;padding:0;inset:0}.screen{flex-direction:column;height:100%;display:flex}.header{align-items:center;gap:var(--arq-space-gap-sm);padding:var(--arq-space-gap-md) var(--arq-layout-gutter);border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle);flex:none;display:flex}.field{flex:1}.content{overscroll-behavior:contain;--search-inline:var(--arq-layout-gutter);flex:1;overflow-y:auto}";
(class extends L {
	static tag = "arq-search-screen";
	static styles = ys;
	static properties = {
		open: { type: Boolean },
		label: {
			type: String,
			default: "Buscar"
		}
	};
	static template = "<dialog class=\"dialog\" data-arq-theme=\"light\"><div class=\"screen\"><div class=\"header\"><arq-icon-button class=\"back\" icon=\"chevron-left\">Volver</arq-icon-button><arq-search-field class=\"field\" combobox></arq-search-field></div><div class=\"content\"><slot></slot></div></div></dialog>";
	#e = null;
	#t = null;
	get field() {
		return this.shadowRoot.querySelector("arq-search-field");
	}
	setup() {
		let e = this.shadowRoot;
		this.#e = e.querySelector("dialog"), z(this.#e), e.querySelector(".back").addEventListener("click", () => this.close()), this.#e.addEventListener("cancel", (e) => {
			e.preventDefault(), this.close();
		});
	}
	update(e) {
		e.has("label") && this.#e.setAttribute("aria-label", this.label ?? ""), e.has("open") && (this.open && !this.#e.open ? (this.#e.showModal(), requestAnimationFrame(() => this.field.focus())) : !this.open && this.#e.open && (this.#e.close(), this.#t?.focus?.(), this.#t = null));
	}
	show(e = null) {
		this.#t = e, this.open = !0;
	}
	close() {
		this.open && (this.open = !1, this.emit("close"));
	}
}).define();
//#endregion
//#region src/components/search-card/search-card.css?inline
var bs = ":host{min-width:0;display:block}.card{cursor:pointer;gap:var(--arq-space-gap-sm);color:var(--arq-color-text-primary);flex-direction:column;text-decoration:none;display:flex}.card:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.media{aspect-ratio:var(--card-ratio,1 / 1);background:var(--arq-color-surface-subtle);display:block;overflow:hidden}.img{object-fit:cover;width:100%;height:100%;transition:transform var(--arq-motion-duration-slow) var(--arq-motion-easing-standard);display:block}.card{--zoom:1.1}@media (hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference){.card:hover .img{transform:scale(var(--zoom))}}@media (prefers-reduced-motion:no-preference){.card:focus-visible .img{transform:scale(var(--zoom))}}.info{gap:var(--arq-space-gap-xs);flex-direction:column;display:flex}.title{align-items:center;gap:var(--arq-space-gap-sm);display:flex}.name{overflow-wrap:break-word;flex:auto;min-width:0}.finishes{align-items:center;gap:var(--arq-space-gap-xs);flex:none;display:flex}.meta{min-width:0;color:var(--arq-color-text-secondary);overflow-wrap:break-word}.finishes[hidden],.meta[hidden]{display:none}";
(class extends L {
	static tag = "arq-search-card";
	static styles = bs;
	static properties = {
		href: { type: String },
		image: { type: String },
		size: {
			type: String,
			values: ["default", "large"],
			default: "default"
		}
	};
	static template = "<a class=\"card\"><span class=\"media\"><img class=\"img\" alt=\"\" loading=\"lazy\"></span><span class=\"info\"><span class=\"title\"><span class=\"name role-body-regular\"><slot></slot></span><span class=\"finishes\" hidden><slot name=\"finishes\"></slot></span></span><span class=\"meta role-body-sm\" hidden><slot name=\"meta\"></slot></span></span></a>";
	setup() {
		let e = this.shadowRoot.querySelector("img");
		e.addEventListener("error", () => e.hidden = !0);
		for (let e of ["finishes", "meta"]) {
			let t = this.shadowRoot.querySelector(`slot[name="${e}"]`), n = () => t.parentElement.hidden = !t.assignedNodes().some((e) => e.nodeType === 1 || e.textContent.trim());
			t.addEventListener("slotchange", n), n();
		}
	}
	focus(e) {
		this.shadowRoot.querySelector("a").focus(e);
	}
	update() {
		let e = this.shadowRoot, t = e.querySelector("a");
		this.href ? t.setAttribute("href", this.href) : t.removeAttribute("href"), e.querySelector(".name").className = `name ${this.size === "large" ? "role-body-xl" : "role-body-regular"}`;
		let n = e.querySelector("img");
		this.image ? (n.getAttribute("src") !== this.image && (n.src = this.image), n.hidden = !1) : (n.removeAttribute("src"), n.hidden = !0);
	}
}).define();
//#endregion
//#region src/base/reveal.css?inline
var G = ".reveal:not(.revealed){opacity:0}.reveal.revealed{animation:arq-reveal calc(var(--arq-motion-duration-slow) * 2) var(--arq-motion-easing-standard) backwards;animation-delay:calc(var(--arq-motion-duration-fast) * var(--reveal-index,0))}@keyframes arq-reveal{0%{opacity:0;transform:translateY(var(--arq-space-gap-2xl))}}", xs = 5;
function Ss() {
	return !!document.querySelector("arq-preloader[open]");
}
function Cs(e) {
	let t = document.querySelector("arq-preloader[open]");
	if (!t) {
		e();
		return;
	}
	let n = new MutationObserver(() => {
		t.hasAttribute("open") || (n.disconnect(), e());
	});
	n.observe(t, {
		attributes: !0,
		attributeFilter: ["open"]
	});
}
function ws(e) {
	if (e.target !== e.currentTarget || e.animationName !== "arq-reveal") return;
	let t = e.currentTarget;
	t.classList.remove("reveal", "revealed"), t.style.removeProperty("--reveal-index"), t.removeEventListener("animationend", ws);
}
function Ts(e) {
	if (!e.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return null;
	let t = new IntersectionObserver((e) => {
		let n = 0;
		for (let r of e) r.isIntersecting && (r.target.style.setProperty("--reveal-index", String(Math.min(n++, xs))), r.target.classList.add("revealed"), t.unobserve(r.target));
	}, { threshold: .15 }), n = !0, r = t.disconnect.bind(t);
	t.disconnect = () => {
		n = !1, r();
	};
	for (let t of e) t.classList.add("reveal"), t.addEventListener("animationend", ws);
	return Cs(() => {
		if (n) for (let n of e) t.observe(n);
	}), t;
}
//#endregion
//#region src/components/compatible-products/compatible-products.css?inline
var Es = ":host{min-width:0;display:block}.section{gap:var(--arq-space-gap-2xl);padding:var(--arq-space-section-md) var(--page-gutter);flex-direction:column;display:flex}.section[hidden]{display:none}.heading{justify-content:space-between;align-items:center;gap:var(--arq-space-gap-md);flex-wrap:wrap;display:flex}.title{min-width:0}slot[name=action]{margin-inline-start:auto}.grid{--card-min:var(--arq-layout-card-min);grid-template-columns:repeat(auto-fill, minmax(var(--card-min), 1fr));gap:var(--arq-space-gap-lg);margin:0;padding:0;list-style:none;display:grid}@media (width>=1024px){.grid{grid-template-columns:repeat(4,minmax(0,1fr))}}@media (width>=1440px){.grid{grid-template-columns:repeat(5,minmax(0,1fr))}}.grid li{min-width:0}";
(class extends L {
	static tag = "arq-compatible-products";
	static styles = G + Es;
	static template = "<section class=\"section\" hidden><div class=\"heading\"><div class=\"title role-heading-2\"><slot name=\"title\"></slot></div><slot name=\"action\"></slot></div><ul class=\"grid\"></ul></section>";
	#e = [];
	#t = "[]";
	#n = null;
	get items() {
		return this.#e;
	}
	set items(e) {
		this.#e = Array.isArray(e) ? e : [];
		let t = JSON.stringify(this.#e);
		t !== this.#t && (this.#t = t, this.#r());
	}
	#r() {
		let e = this.shadowRoot;
		e.querySelector(".section").hidden = !this.#e.length;
		let t = this.#e.map((e) => {
			let t = document.createElement("li"), n = document.createElement("arq-search-card");
			n.size = "large", e.href && (n.href = e.href), e.image && (n.image = e.image), n.textContent = e.name;
			for (let t of e.finishes ?? []) {
				let e = document.createElement("arq-swatch");
				e.slot = "finishes", e.textContent = t.name, t.src && (e.src = t.src), n.append(e);
			}
			if (e.meta) {
				let t = document.createElement("span");
				t.slot = "meta", t.textContent = e.meta, n.append(t);
			}
			return t.append(n), t;
		});
		this.#n?.disconnect(), e.querySelector(".grid").replaceChildren(...t), this.#n = Ts(t);
	}
}).define();
//#endregion
//#region src/components/search-collection/search-collection.css?inline
var Ds = ":host{min-width:0;display:block}.card{align-items:center;gap:var(--arq-space-gap-md);color:var(--arq-color-text-tertiary);text-decoration:none;display:flex}.card:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.thumb{width:var(--arq-layout-search-thumb);height:var(--arq-layout-search-thumb);background:var(--arq-color-surface-subtle);flex:none}.thumb img{object-fit:cover;width:100%;height:100%;display:block}.name{overflow-wrap:break-word;min-width:0;transition:color var(--arq-motion-duration-fast) var(--arq-motion-easing-standard)}.name.has-marks slot{display:none}.match,.card:focus-visible .name,.card.active .name{color:var(--arq-color-text-primary)}@media (hover:hover) and (pointer:fine){.card[href]:hover .name{color:var(--arq-color-text-primary)}}";
(class extends L {
	static tag = "arq-search-collection";
	static styles = Ds;
	static properties = {
		href: { type: String },
		image: { type: String },
		term: {
			type: String,
			default: ""
		},
		active: { type: Boolean }
	};
	static template = "<a class=\"card\"><span class=\"thumb\"><img alt=\"\" loading=\"lazy\"></span><span class=\"name role-body-regular\"><slot></slot><span class=\"marked\" hidden></span></span></a>";
	setup() {
		let e = this.shadowRoot, t = e.querySelector("img");
		t.addEventListener("error", () => t.hidden = !0), e.querySelector("slot").addEventListener("slotchange", () => this.#e());
	}
	#e() {
		let e = this.shadowRoot, t = e.querySelector(".marked"), n = this.textContent.trim(), r = !!this.term?.trim() && !!n;
		t.hidden = !r, e.querySelector(".name").classList.toggle("has-marks", r), t.innerHTML = r ? ps(n, this.term) : "";
	}
	focus(e) {
		this.shadowRoot.querySelector("a").focus(e);
	}
	click() {
		this.shadowRoot.querySelector("a").click();
	}
	update() {
		let e = this.shadowRoot, t = e.querySelector("a");
		this.href ? t.setAttribute("href", this.href) : t.removeAttribute("href"), t.classList.toggle("active", this.active);
		let n = e.querySelector("img");
		this.image ? (n.getAttribute("src") !== this.image && (n.src = this.image), n.hidden = !1) : (n.removeAttribute("src"), n.hidden = !0), this.#e();
	}
}).define();
//#endregion
//#region src/components/search-sheet/search-sheet.css?inline
var Os = ":host{display:contents}.dialog{box-sizing:border-box;inset:var(--sheet-top,0dvh) 0 auto 0;width:100%;max-width:none;max-height:var(--sheet-height);border-radius:var(--arq-radius-control);color:var(--arq-color-text-primary);background:0 0;border:0;margin:0;padding:0;overflow:clip}.dialog::backdrop{top:calc(var(--sheet-top,0dvh) + var(--bar-height));background:var(--arq-color-overlay-scrim);opacity:0;transition:opacity var(--sheet-slow) var(--arq-motion-easing-standard)}.dialog.is-open::backdrop{opacity:1}.dialog:not(.is-open){pointer-events:none}.sheet{box-sizing:border-box;max-height:var(--sheet-height);grid-template-rows:auto 1fr;align-content:start;display:grid}.bar{box-sizing:border-box;height:var(--bar-height);padding:0 var(--page-gutter);background:var(--arq-color-surface-transparent);color:var(--arq-color-text-primary);transition-property:background-color,color;transition-duration:var(--sheet-slow);transition-timing-function:var(--arq-motion-easing-standard);justify-content:space-between;align-items:center;display:flex}.dialog.is-open .bar{background:var(--arq-color-surface-default)}:host([over-photo]) .dialog:not(.is-open) .bar{color:var(--arq-color-text-inverse)}.logo{color:inherit;flex:none}.close{color:inherit;opacity:0;transition:opacity var(--arq-motion-duration-fast) var(--arq-motion-easing-standard);margin-inline-end:calc(var(--arq-space-padding-sm-md) * -1)}.dialog.is-open .close{opacity:1}.drawer{background:var(--arq-color-surface-default);clip-path:inset(0 0 100%);min-height:0;transition:clip-path var(--sheet-slow) var(--arq-motion-easing-standard);overflow:clip}.dialog.is-open .drawer{clip-path:inset(0)}.drawer-inner{max-height:calc(var(--sheet-height) - var(--bar-height));opacity:0;transition-property:opacity;transition-duration:var(--arq-motion-duration-slow);transition-timing-function:var(--arq-motion-easing-standard);flex-direction:column;display:flex}.dialog.is-open .drawer-inner{opacity:1}:host([inline]){display:block}:host([inline]) .dialog{max-height:none;position:static;overflow:visible}:host([inline]) .sheet,:host([inline]) .drawer-inner{max-height:none}:host([inline]) .drawer{border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle)}.field-row{padding:var(--arq-space-gap-md) var(--page-gutter) 0;flex:none}.content{min-height:0;padding:calc(var(--arq-space-gap-xl) * 2) var(--page-gutter);padding-bottom:calc(var(--arq-space-gap-xl) * 2 + var(--keyboard-inset,0dvh));overscroll-behavior:contain;--search-inline:0;flex:1;overflow-y:auto}.recommended,.results{opacity:0;transition-property:opacity;transition-duration:calc(var(--sheet-slow) - var(--arq-motion-duration-fast));transition-timing-function:var(--arq-motion-easing-standard)}.dialog.is-open .recommended,.dialog.is-open .results{opacity:1;transition-delay:var(--arq-motion-duration-fast)}.recommended{gap:var(--arq-space-gap-lg);flex-direction:column;display:flex}.recommended[data-empty=true]{display:none}.title{color:var(--arq-color-text-tertiary);margin:0}.cards-wrap{min-width:0;position:relative}.rail-arrow{z-index:1;top:var(--arq-search-arrow-top,50%);opacity:0;visibility:hidden;pointer-events:none;--rail-in:var(--arq-motion-duration-base);--rail-out:var(--arq-motion-duration-slow);transition:opacity var(--rail-out) var(--arq-motion-easing-standard), visibility 0s linear var(--rail-out);position:absolute;transform:translateY(-50%)}@media (prefers-reduced-motion:reduce){.rail-arrow{--rail-in:var(--arq-motion-duration-fade);--rail-out:var(--arq-motion-duration-fade)}}.rail-arrow[data-arq-unavailable]{--rail-end:var(--arq-motion-duration-fast);transition:opacity var(--rail-end) var(--arq-motion-easing-standard), visibility 0s linear var(--rail-end)}@media (prefers-reduced-motion:reduce){.rail-arrow[data-arq-unavailable]{--rail-end:var(--arq-motion-duration-fade)}}.rail-prev{inset-inline-start:var(--arq-space-gap-md)}.rail-next{inset-inline-end:var(--arq-space-gap-md)}@media (hover:hover) and (pointer:fine){.cards-wrap:hover .rail-arrow:not([data-arq-unavailable]){opacity:1;visibility:visible;pointer-events:auto;transition:opacity var(--rail-in) var(--arq-motion-easing-standard), visibility 0s linear 0s}}.cards-wrap:has(:focus-visible) .rail-arrow:not([data-arq-unavailable]){opacity:1;visibility:visible;pointer-events:auto;transition:opacity var(--rail-in) var(--arq-motion-easing-standard), visibility 0s linear 0s}.cards{--cols:4;--peek:.5;--gap:var(--arq-space-gap-lg);grid-auto-flow:column;grid-auto-columns:calc((100% - var(--gap) * var(--cols)) / (var(--cols) + var(--peek)));gap:var(--gap);overscroll-behavior-x:contain;scroll-snap-type:x mandatory;scrollbar-width:none;display:grid;overflow-x:auto}.cards[data-scroll=false]{grid-auto-columns:calc((100% - var(--gap) * (var(--cols) - 1)) / var(--cols))}.cards::-webkit-scrollbar{display:none}.cards>*{scroll-snap-align:start}.cards>:last-child{scroll-snap-align:end}.all{padding:0 var(--page-gutter) var(--arq-space-padding-2xl);flex:none;display:flex}.all[hidden]{display:none}.results{column-gap:var(--arq-space-section-2xs);row-gap:var(--arq-space-gap-lg);display:grid}.results.has-both{grid-template-columns:minmax(0, 1fr) minmax(0, var(--arq-layout-search-field))}.results.has-both .group-collections{grid-area:1/2/span 2}.results.has-both .see-all{grid-area:2/1}.see-all,.group{min-width:0}.group-title{margin:0 0 var(--arq-space-gap-lg);color:var(--arq-color-text-tertiary)}.list{gap:var(--arq-space-gap-lg);flex-direction:column;display:flex}.collections{gap:var(--arq-space-gap-md);flex-direction:column;display:flex}@media (width>=1600px){.cards{--cols:5}}@media (width<=1023px){.cards{--cols:3}.results.has-both{grid-template-columns:minmax(0,1fr)}.results.has-both .group-collections,.results.has-both .see-all{grid-area:auto}}@media (width<=767px){.cards{--cols:2;--gap:var(--arq-space-gap-md)}.cards-wrap{margin-inline-end:calc(var(--page-gutter) * -1)}.cards{padding-inline-end:var(--page-gutter);scroll-padding-inline-end:var(--page-gutter)}}:host{--bar-height:calc(var(--arq-space-gap-md) * 2 + var(--arq-icon-xl));--sheet-height:calc(100dvh - var(--sheet-top,0dvh));--sheet-slow:var(--arq-motion-duration-panel)}@media (prefers-reduced-motion:reduce){:host{--sheet-slow:var(--arq-motion-duration-fade)}.drawer{clip-path:none;opacity:0;transition:opacity var(--sheet-slow) var(--arq-motion-easing-standard)}.dialog.is-open .drawer{opacity:1}}@media (height<=760px){.content{padding-block:var(--arq-space-gap-xl) calc(var(--arq-space-gap-xl) + var(--keyboard-inset,0dvh))}}@media (height<=600px){.content{padding-block:var(--arq-space-gap-md) calc(var(--arq-space-gap-md) + var(--keyboard-inset,0dvh))}.field-row{padding-top:var(--arq-space-gap-sm)}}", ks = matchMedia("(max-width: 767px)"), K = (e) => String(e ?? "").replace(/[&<>"]/g, (e) => ({
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;"
})[e]), As = (e) => e.image ? ` image="${K(e.image)}"` : "";
(class extends L {
	static tag = "arq-search-sheet";
	static styles = Os;
	static properties = {
		open: { type: Boolean },
		inline: { type: Boolean },
		label: {
			type: String,
			default: "Buscar"
		},
		recommendedTitle: {
			type: String,
			default: "Productos recomendados"
		},
		allHref: {
			type: String,
			default: "/arq/productos"
		},
		allLabel: {
			type: String,
			default: "Ver todos los productos"
		},
		placeholder: {
			type: String,
			default: "Buscar productos…"
		}
	};
	static template = "<dialog class=\"dialog\"><div class=\"sheet\"><div class=\"bar\"><arq-logo class=\"logo\"></arq-logo><arq-icon-button class=\"close\" icon=\"close\" size=\"large\" background=\"none\">Cerrar búsqueda</arq-icon-button></div><div class=\"drawer\"><div class=\"drawer-inner\"><div class=\"field-row\"><arq-search-field class=\"field\" type=\"line\" size=\"large\" show-clear combobox></arq-search-field></div><div class=\"content\"><div class=\"recommended\"><p class=\"title role-label\"></p><div class=\"cards-wrap\"><div class=\"cards\"></div><arq-carousel-button class=\"rail-arrow rail-prev\" direction=\"previous\" background=\"frosted\" hidden>Productos anteriores</arq-carousel-button><arq-carousel-button class=\"rail-arrow rail-next\" direction=\"next\" background=\"frosted\" hidden>Productos siguientes</arq-carousel-button></div></div><div class=\"results\"></div></div><div class=\"all\" hidden><arq-button class=\"all-button\" type=\"underline\" show-underline show-icon icon=\"arrow-right\"></arq-button></div></div></div></div></dialog>";
	#e = null;
	#t = null;
	#n = null;
	#r = [];
	#i = null;
	get field() {
		return this.shadowRoot.querySelector("arq-search-field");
	}
	get recommended() {
		return this.#r;
	}
	set recommended(e) {
		this.#r = e ?? [], this.shadowRoot && this.#f();
	}
	get results() {
		return this.#i;
	}
	set results(e) {
		this.#i = e?.query ? e : null, this.shadowRoot && !this.#n && this.#h();
	}
	get items() {
		return [...this.shadowRoot.querySelectorAll(".results arq-search-result, .results arq-search-collection")];
	}
	setup() {
		let e = this.shadowRoot, t = e.querySelector(".cards");
		t.addEventListener("scroll", () => this.#s(), { passive: !0 }), t.addEventListener("dragstart", (e) => e.preventDefault()), e.querySelector(".rail-prev").addEventListener("click", () => this.#c(-1)), e.querySelector(".rail-next").addEventListener("click", () => this.#c(1)), this.#e = e.querySelector("dialog"), e.querySelector(".close").addEventListener("click", () => this.close());
		let n = () => e.querySelector(".logo").size = ks.matches ? "small" : "default";
		ks.addEventListener("change", n), n(), this.inline ? (this.#e.show(), this.#e.classList.add("is-open")) : (z(this.#e), this.#e.addEventListener("close", () => V(!1)), this.#e.addEventListener("cancel", (e) => {
			e.preventDefault(), this.close();
		}), this.#e.addEventListener("click", (e) => {
			e.target === this.#e && this.close();
		})), this.#f(), this.#h(), window.addEventListener("resize", () => this.#p()), window.visualViewport?.addEventListener("resize", () => {
			let e = window.visualViewport, t = Math.max(0, window.innerHeight - e.height - e.offsetTop);
			this.style.setProperty("--keyboard-inset", `${Math.round(t)}px`);
		});
	}
	#a = new ResizeObserver(() => this.#s());
	connectedCallback() {
		super.connectedCallback(), this.#o();
	}
	disconnectedCallback() {
		this.#a.disconnect();
	}
	#o() {
		this.#a.disconnect();
		let e = this.shadowRoot.querySelector(".cards");
		this.#a.observe(e), e.firstElementChild && this.#a.observe(e.firstElementChild), this.#s();
	}
	#s() {
		let e = this.shadowRoot, t = e.querySelector(".cards"), n = t.scrollWidth - t.clientWidth, r = e.querySelector(".rail-prev"), i = e.querySelector(".rail-next"), a = [[
			r,
			!t.firstElementChild || n <= 1 || t.scrollLeft <= 1,
			t.firstElementChild
		], [
			i,
			!t.firstElementChild || n - t.scrollLeft <= 1,
			t.lastElementChild
		]];
		for (let [t, n, r] of a) n && e.activeElement === t && r?.focus(), t.toggleAttribute("data-arq-unavailable", n), t.inert = n, t.setAttribute("aria-hidden", String(n)), t.hidden = !1;
		let o = t.firstElementChild?.shadowRoot?.querySelector(".media");
		o && e.querySelector(".cards-wrap").style.setProperty("--arq-search-arrow-top", `${o.getBoundingClientRect().height / 2}px`);
	}
	#c(e) {
		let t = this.shadowRoot.querySelector(".cards"), n = t.firstElementChild;
		if (!n) return;
		let r = parseFloat(getComputedStyle(t).columnGap) || 0;
		t.scrollBy({
			left: e * (n.getBoundingClientRect().width + r),
			behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
		});
	}
	update(e) {
		let t = this.shadowRoot;
		if (e.has("label") && this.#e.setAttribute("aria-label", this.label ?? ""), e.has("recommendedTitle") && (t.querySelector(".title").textContent = this.recommendedTitle ?? ""), e.has("allHref") || e.has("allLabel")) {
			let e = t.querySelector(".all-button");
			e.setAttribute("href", this.allHref ?? "/arq/productos"), e.textContent = this.allLabel ?? "";
		}
		e.has("placeholder") && (this.field.placeholder = this.placeholder ?? ""), e.has("open") && !this.inline && (this.open ? this.#l() : this.#u());
	}
	#l() {
		clearTimeout(this.#n), this.#n = null;
		let e = this.#e;
		e.open || (e.showModal(), V(!0, e), e.offsetHeight, this.#p(), requestAnimationFrame(() => this.field.focus({ preventScroll: !0 }))), e.classList.add("is-open");
	}
	#u() {
		let e = this.#e;
		!e.open || this.#n || (e.classList.remove("is-open"), this.#n = setTimeout(() => {
			this.#n = null, e.close(), this.#t?.focus?.(), this.#t = null, this.#h();
		}, this.#d()));
	}
	#d() {
		let { transitionDuration: e } = getComputedStyle(this.shadowRoot.querySelector(".drawer"));
		return Math.max(0, ...e.split(",").map((e) => (parseFloat(e) || 0) * (/mss*$/.test(e) ? 1 : 1e3)));
	}
	show(e = null) {
		this.#t = e, this.open = !0;
	}
	close() {
		this.open && (this.open = !1, this.emit("close"));
	}
	#f() {
		let e = this.shadowRoot;
		e.querySelector(".cards").replaceChildren(...this.#r.map(({ name: e, href: t, image: n }) => {
			let r = document.createElement("arq-search-card");
			return Object.assign(r, {
				href: t,
				image: n
			}), r.textContent = e, r;
		})), e.querySelector(".recommended").dataset.empty = String(this.#r.length === 0), this.isConnected && this.#o(), this.#m(), this.#p();
	}
	#p() {
		if (!this.#e?.open) return;
		let e = this.shadowRoot, t = e.querySelector(".cards"), n = e.querySelector(".content");
		t.style.removeProperty("--cols");
		let r = parseInt(getComputedStyle(t).getPropertyValue("--cols"), 10) || 4, i = t.children.length;
		for (let e = r; e <= r + 3 && (t.style.setProperty("--cols", String(e)), t.dataset.scroll = String(i > e), !(n.scrollHeight - n.clientHeight <= 0)); e++);
	}
	#m() {
		this.shadowRoot.querySelector(".all").hidden = !!this.#i || this.#r.length === 0;
	}
	#h() {
		let e = this.shadowRoot, t = this.#i, n = e.querySelector(".results");
		if (e.querySelector(".recommended").hidden = !!t, this.#m(), n.hidden = !t, !t) {
			n.replaceChildren();
			return;
		}
		let r = t.items ?? [], i = r.filter((e) => e.kind !== "collection"), a = r.filter((e) => e.kind === "collection"), o = `<arq-search-see-all type="simple" href="${K(t.href)}" term="${K(t.query)}" count="${t.total ?? r.length}"></arq-search-see-all>`, s = K(t.query);
		n.classList.toggle("has-both", i.length > 0 && a.length > 0), n.innerHTML = r.length ? (i.length ? `<div class="group" role="group" aria-labelledby="group-products"><p class="group-title role-label" id="group-products">Productos</p><div class="list">${i.map((e) => `<arq-search-result type="simple" term="${s}" href="${K(e.href)}"${As(e)}>${K(e.name)}</arq-search-result>`).join("")}</div></div>` : "") + (a.length ? `<div class="group group-collections" role="group" aria-labelledby="group-collections"><p class="group-title role-label" id="group-collections">Colecciones</p><div class="collections">${a.map((e) => `<arq-search-collection term="${s}" href="${K(e.href)}"${As(e)}>${K(e.name)}</arq-search-collection>`).join("")}</div></div>` : "") + `<div class="see-all">${o}</div>` : `<arq-search-dropdown state="${t.error ? "error" : "no-results"}" term="${K(t.query)}"></arq-search-dropdown>`;
	}
}).define();
//#endregion
//#region src/components/nav-link/nav-link.css?inline
var js = ":host{vertical-align:middle;max-width:100%;display:inline-flex}.link{box-sizing:border-box;align-items:center;gap:var(--arq-space-gap-sm);background:var(--arq-color-surface-transparent);max-width:100%;color:var(--arq-color-text-primary);font:inherit;text-align:start;cursor:pointer;-webkit-tap-highlight-color:var(--arq-color-surface-transparent);border:0;margin:0;padding:0;text-decoration:none;display:inline-flex;position:relative}.label{white-space:nowrap;min-width:0}.indicator{width:var(--arq-space-gap-sm);height:var(--arq-border-strong);background:var(--arq-color-border-strong);transition-property:background-color;transition-duration:var(--arq-theme-text-duration,var(--arq-motion-duration-fast));transition-delay:var(--arq-theme-text-delay,0s);flex:none;display:none}.current .indicator,.link[aria-expanded=true] .indicator{display:block}.trailing{display:none}.link:after{content:\"\";inset-inline:0;top:calc(100% + var(--arq-space-padding-2xs) - var(--arq-border-default));height:var(--arq-border-default);background:var(--arq-color-border-strong);transform-origin:100%;transition:transform var(--arq-motion-duration-base) var(--arq-motion-easing-standard);position:absolute;transform:scaleX(0)}@media (hover:hover) and (pointer:fine){.link:not(.current):not([aria-expanded=true]):hover:after{transform-origin:0;transform:scaleX(1)}}.link:active{color:var(--arq-color-text-tertiary)}.link:active:after{transform:scaleX(0)}.link:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.link:focus:not(:focus-visible){outline:none}@media (width>=768px){:host([theme=inverse]) .link,:host([theme=inverse]) .link:active{color:var(--arq-color-text-inverse)}:host([theme=inverse]) .indicator,:host([theme=inverse]) .link:after{background:var(--arq-color-icon-inverse)}}@media (width<=767px){:host{width:100%;display:flex}.link{width:100%;padding:var(--arq-space-gap-md) var(--arq-layout-gutter)}.label{white-space:normal;flex:1}:host([has-dropdown]) .trailing{flex:none;display:inline-flex}.trailing .icon{width:var(--arq-icon-md);height:var(--arq-icon-md)}.trailing [data-icon=arrow-right],.link:after{display:none}.link:active{background:var(--arq-color-surface-selected);color:var(--arq-color-text-primary)}@media (hover:hover) and (pointer:fine){.link:not(:active):hover{background:var(--arq-color-surface-hover)}}.link:focus-visible{outline-offset:calc(var(--arq-border-strong) * -1)}}", Ms = matchMedia("(max-width: 767px)");
(class extends L {
	static tag = "arq-nav-link";
	static styles = js;
	static properties = {
		hasDropdown: { type: Boolean },
		open: { type: Boolean },
		current: { type: Boolean },
		href: { type: String },
		theme: {
			type: String,
			values: ["default", "inverse"],
			default: "default"
		}
	};
	static template = `<a class="link"><span class="indicator" aria-hidden="true"></span><span class="label role-body"><slot></slot></span><span class="trailing">${R("chevron-right")}${R("arrow-right")}</span></a>`;
	#e = null;
	#t = !0;
	setCurrentIndicatorVisible(e) {
		this.#t = !!e, this.#e && (this.#e.classList.toggle("current", this.current && !this.hasDropdown && this.#t), this.#n());
	}
	setup() {
		this.#e = this.shadowRoot.querySelector(".link"), Ms.addEventListener("change", () => this.#n()), this.#n();
	}
	#n() {
		let e = this.shadowRoot.querySelector(".label"), t = !Ms.matches, n = this.hasDropdown ? this.open : this.current && this.#t;
		e.classList.toggle("role-body", t && !n), e.classList.toggle("role-body-medium", t && n), e.classList.toggle("role-heading-3", !t);
	}
	focus(e) {
		this.#e ? this.#e.focus(e) : super.focus(e);
	}
	update(e) {
		e.has("hasDropdown") && this.#r();
		let t = this.#e;
		t.localName === "a" ? (this.href === null ? t.removeAttribute("href") : t.setAttribute("href", this.href), this.current ? t.setAttribute("aria-current", "page") : t.removeAttribute("aria-current")) : t.setAttribute("aria-expanded", String(this.open)), t.classList.toggle("current", this.current && !this.hasDropdown && this.#t), (e.has("current") || e.has("hasDropdown") || e.has("open")) && this.#n();
	}
	#r() {
		let e = this.hasDropdown ? "button" : "a", t = this.#e;
		if (t.localName === e) return;
		let n = document.createElement(e);
		n.className = t.className, e === "button" && (n.type = "button", n.addEventListener("click", () => {
			this.emit("toggle", { open: !this.open });
		})), n.append(...t.childNodes), t.replaceWith(n), this.#e = n;
	}
}).define();
//#endregion
//#region src/components/navbar/navbar.css?inline
var Ns = ":host{--mega-in:var(--arq-motion-duration-panel);--mega-out:var(--arq-motion-duration-slow);--mega-slow:var(--mega-out);--mega-ease:var(--arq-motion-easing-standard);--bar-height:calc(var(--arq-space-gap-md) * 2 + var(--arq-icon-xl));z-index:4;transition:transform var(--arq-motion-duration-base) var(--arq-motion-easing-standard);display:block;position:sticky;top:0}@media (width<=767px){:host([data-arq-compare-hidden]){transform:translateY(-100%)}}:host([theme=transparent]){margin-bottom:calc(-1 * var(--bar-height))}.navbar{position:relative}.navbar.mega-open{--mega-slow:var(--mega-in)}.scrim{inset:var(--bar-top,0dvh) 0 0 0;z-index:-1;background:var(--arq-color-overlay-scrim);opacity:0;pointer-events:none;transition:opacity var(--mega-slow) var(--mega-ease);position:fixed}.mega-open .scrim{opacity:1;pointer-events:auto}.bar{box-sizing:border-box;justify-content:space-between;align-items:center;gap:var(--arq-space-gap-xl);height:var(--bar-height);padding:0 var(--page-gutter);border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle);background:var(--arq-color-surface-default);color:var(--arq-color-text-primary);transition-property:background-color,border-color;transition-duration:var(--arq-theme-bg-duration,var(--arq-motion-duration-fast)), var(--arq-theme-text-duration,var(--arq-motion-duration-fast));transition-delay:0s, var(--arq-theme-text-delay,0s);transition-timing-function:var(--arq-theme-bg-easing,var(--arq-motion-easing-standard)), var(--arq-theme-text-easing,var(--arq-motion-easing-standard));display:flex}.over-photo .bar{background:var(--arq-color-overlay-translucent);-webkit-backdrop-filter:blur(var(--arq-blur-backdrop))}.over-photo .logo{color:var(--arq-color-text-inverse)}.logo{flex:none}.right{align-self:stretch;align-items:stretch;gap:var(--arq-space-gap-xl);min-width:0;display:flex}.links{align-items:stretch;gap:var(--arq-space-gap-xl);display:flex}.links ::slotted(arq-nav-link){align-self:center}.search{align-self:center;align-items:center;display:flex;position:relative}.search-open,.search-open-mobile{transition:opacity var(--arq-motion-duration-fast) var(--arq-motion-easing-standard)}:host([mode=search]:not([search=inline])) .search-open,:host([mode=search]:not([search=inline])) .search-open-mobile{opacity:0}.search-box{width:var(--arq-layout-search-field);position:relative}.search-dropdown{top:100%;position:absolute;inset-inline:0}.actions{display:none}.mega-wrap{top:100%;position:absolute;inset-inline:0}.mega-wrap[hidden]{display:none}.mega-wrap:before{content:\"\";position:absolute;inset:0}.mega-drawer{min-height:0;max-height:calc(100dvh - var(--bar-top,0dvh) - var(--arq-layout-navbar-height));overscroll-behavior:contain;clip-path:inset(0 0 100%);transition:clip-path var(--mega-slow) var(--mega-ease);position:relative;overflow:clip auto}.mega-wrap.is-open .mega-drawer{clip-path:inset(0)}.mega,.recursos{opacity:0;transition-property:opacity;transition-duration:var(--mega-slow);transition-timing-function:var(--mega-ease)}.mega-wrap.is-open .mega,.mega-wrap.is-open .recursos{opacity:1}.mega-drawer{background:var(--arq-color-surface-default);display:grid}.mega-drawer>*{grid-area:1/1;align-self:start}.mega-wrap.is-open .mega.leaving,.mega-wrap.is-open .recursos.leaving{opacity:0;pointer-events:none}@starting-style{.mega-wrap.is-open .mega,.mega-wrap.is-open .recursos{opacity:0}}.recursos{background:var(--arq-color-surface-default);align-items:stretch;display:flex}.recursos[hidden]{display:none}.recursos-nav{box-sizing:border-box;flex:1 1 var(--arq-layout-measure);align-items:stretch;gap:var(--arq-space-gap-xl-2xl);min-width:var(--arq-layout-measure);padding:var(--arq-space-section-sm) var(--arq-space-padding-2xl) var(--arq-space-section-sm) var(--page-gutter);border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle);flex-direction:column;margin:0;display:flex}.recursos-title{color:var(--arq-color-text-primary);margin:0}.recursos-links{flex-direction:column;display:flex}.recursos-media{flex:0 1 calc(var(--arq-layout-mega-menu-image) * 2);width:calc(var(--arq-layout-mega-menu-image) * 2);max-width:calc(var(--arq-layout-mega-menu-image) * 2);min-width:0;min-height:calc(var(--arq-layout-mega-menu-image) * 5 / 4);background:var(--arq-color-surface-subtle);position:relative}.recursos-media img,.recursos-media ::slotted(img){object-fit:cover;width:100%;height:100%;position:absolute;inset:0}.recursos-media img.catalogs{object-position:center 72%}@media (width>=768px) and (width<=1023px){.recursos-nav{flex-basis:var(--arq-layout-catalog-nav);min-width:var(--arq-layout-catalog-nav)}}.mega-motion .bar{transition-duration:var(--mega-slow), var(--mega-slow);transition-delay:0s;transition-timing-function:var(--mega-ease)}@media (prefers-reduced-motion:reduce){:host{--mega-in:var(--arq-motion-duration-fade);--mega-out:var(--arq-motion-duration-fade)}.mega-drawer{clip-path:none;opacity:0;transition:opacity var(--mega-slow) var(--mega-ease)}.mega-wrap.is-open .mega-drawer{opacity:1}}.menu{box-sizing:border-box;inset:var(--bar-top,0dvh) 0 auto 0;--menu-full:calc(100dvh - var(--bar-top,0dvh));width:100%;max-width:none;height:min(55dvh, var(--menu-full));max-height:var(--menu-full);padding:0 0 calc(var(--arq-space-gap-xl) * 2);border-radius:var(--arq-radius-control);background:var(--arq-color-surface-default);color:var(--arq-color-text-primary);overscroll-behavior:contain;border:0;margin:0}.menu::backdrop{top:var(--bar-top,0dvh);background:var(--arq-color-overlay-scrim);opacity:0;transition:opacity var(--arq-motion-duration-panel) var(--arq-motion-easing-standard)}.menu.is-open::backdrop{opacity:1}.menu[open]{flex-direction:column;display:flex}.menu{clip-path:inset(0 0 100%);transition:clip-path var(--arq-motion-duration-panel) var(--arq-motion-easing-standard);overflow-x:clip}.menu.is-open{clip-path:inset(0)}.menu.is-tall{height:var(--menu-full)}.menu:not(.is-open){pointer-events:none}@media (prefers-reduced-motion:reduce){.menu{clip-path:none;opacity:0;transition:opacity var(--arq-motion-duration-fade) var(--arq-motion-easing-standard)}.menu::backdrop{transition-duration:var(--arq-motion-duration-fade)}.menu.is-open{opacity:1}}.menu-bar{box-sizing:border-box;height:var(--bar-height);padding:0 var(--page-gutter);border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle);flex:none;justify-content:space-between;align-items:center;display:flex}.menu-main,.menu-products,.menu-recursos{overscroll-behavior:contain;flex:auto;min-height:0;overflow-y:auto}.menu-main{padding-block:var(--arq-space-gap-xl) var(--arq-space-gap-sm);flex-direction:column;display:flex}.menu-products,.menu-recursos{padding:var(--arq-space-gap-xl) 0;flex-direction:column;display:flex}.menu-products[hidden],.menu-recursos[hidden]{display:none}.recursos-list{padding:var(--arq-space-gap-md) var(--page-gutter) var(--arq-space-padding-md);flex-direction:column;display:flex}.back{align-items:center;gap:var(--arq-space-gap-xs);padding:var(--arq-space-gap-sm) var(--page-gutter);color:var(--arq-color-text-secondary);text-align:start;cursor:pointer;background:0 0;border:0;display:flex}.back .icon{box-sizing:content-box;width:var(--arq-icon-md);height:var(--arq-icon-md);padding:var(--arq-space-padding-xs);color:var(--arq-color-icon-primary)}.back:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:calc(var(--arq-border-strong) * -1)}.groups,.sub-list{padding:var(--arq-space-gap-md) var(--page-gutter) var(--arq-space-padding-md);flex-direction:column;display:flex}.menu-sub{min-height:0;padding:var(--arq-space-gap-xl) 0;flex-direction:column;flex:1;display:flex}.menu-sub[hidden]{display:none}.back-sub{flex:none}.sub-list{overscroll-behavior:contain;flex:0 auto;min-height:0;overflow-y:auto}.sub-cta,.products-cta{padding:var(--arq-space-gap-xl) var(--page-gutter) 0;flex:none}.sub-cta:empty{display:none}.menu-sub--colecciones{padding-bottom:var(--arq-space-padding-md)}.menu-sub--colecciones .sub-list{padding-block:0}.menu-sub--grupos .sub-list{padding-bottom:0}.sub-group{flex-direction:column;display:flex}.sub-group+.sub-group{padding-top:var(--arq-space-padding-lg)}.sub-eyebrow{color:var(--arq-color-text-tertiary);margin:0}.sub-group-cta{padding-top:var(--arq-space-gap-xl)}@media (width<=767px){.right{display:contents}.links,.search{display:none}.actions{align-items:center;gap:var(--arq-space-gap-sm);display:flex}}@media print{:host,:host([theme=transparent]),:host([data-arq-compare-hidden]){top:0;margin-bottom:0;position:absolute;inset-inline-end:0;transform:none}.bar,.over-photo .bar{height:calc(var(--page-gutter) + var(--arq-type-heading-3-leading));padding-block:var(--page-gutter) 0;padding-inline:var(--page-gutter);background:var(--arq-color-surface-default);-webkit-backdrop-filter:none;border-bottom:none}.over-photo .logo{color:var(--arq-color-text-primary)}.right,.actions,.mega-wrap,.scrim,.menu{display:none}}", q = matchMedia("(max-width: 767px)"), Ps = matchMedia("(prefers-reduced-transparency: reduce), (prefers-contrast: more)"), J = (e) => String(e ?? "").replace(/[&<>"]/g, (e) => ({
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;"
})[e]), Fs = 5, Is = 240, Ls = 150, Rs = [
	"interior",
	"exterior",
	"lamparas-y-artefactos",
	"colecciones"
];
(class extends L {
	static tag = "arq-navbar";
	static styles = Ns;
	static properties = {
		theme: {
			type: String,
			values: ["default", "transparent"],
			default: "default"
		},
		mode: {
			type: String,
			values: [
				"default",
				"search",
				"menu",
				"products",
				"recursos",
				...Rs
			],
			default: "default"
		},
		search: {
			type: String,
			values: ["inline", "sheet"],
			default: "sheet"
		},
		label: {
			type: String,
			default: "Principal"
		}
	};
	static template = `<header class="navbar"><div class="scrim" aria-hidden="true"></div><nav class="bar"><arq-logo class="logo"></arq-logo><div class="right"><div class="links"><slot name="links"></slot></div><div class="search"><arq-icon-button class="search-open" icon="search">Buscar</arq-icon-button><div class="search-box" hidden><arq-search-field class="search-field" show-close combobox></arq-search-field><arq-search-dropdown class="search-dropdown" data-arq-theme="light" hidden></arq-search-dropdown></div></div><div class="actions"><arq-icon-button class="search-open-mobile" icon="search">Buscar</arq-icon-button><arq-icon-button class="menu-open" icon="menu">Abrir menú</arq-icon-button></div></div></nav><div class="mega-wrap" hidden><div class="mega-drawer"><arq-mega-menu class="mega" data-arq-theme="light"></arq-mega-menu><div class="recursos" data-arq-theme="light" hidden><nav class="recursos-nav" aria-label="Recursos"><p class="recursos-title role-heading-1">Recursos</p><div class="recursos-links"><arq-mega-link href="/arq/catalogos" show-arrow>Catálogos</arq-mega-link><arq-mega-link href="/arq/descargas" show-arrow>Descargas</arq-mega-link></div></nav><div class="recursos-media" aria-hidden="true"><slot name="recursos-media"><img class="catalogs" src="https://d1zltvqju4u8ql.cloudfront.net/fit-in/filters:format(webp)/MACROLED/ARQ/imagenes/home/catalogos_todos.png" alt=""></slot></div></div></div></div></header><dialog class="menu" data-arq-theme="light" aria-label="Menú"><div class="menu-bar"><arq-logo class="menu-logo" size="small"></arq-logo><arq-icon-button class="menu-close" icon="close" background="subtle">Cerrar menú</arq-icon-button></div><div class="menu-main"></div><div class="menu-products" hidden><button type="button" class="back role-body-medium">${R("chevron-left")}<span>Productos</span></button><div class="groups"></div><div class="products-cta"><arq-button type="underline" show-underline show-icon icon="arrow-right" href="/arq/productos">Ver todos los productos</arq-button></div></div><div class="menu-recursos" hidden><button type="button" class="back back-recursos role-body-medium">${R("chevron-left")}<span>Recursos</span></button><div class="recursos-list"><arq-mega-link size="large" href="/arq/catalogos">Catálogos</arq-mega-link><arq-mega-link size="large" href="/arq/descargas">Descargas</arq-mega-link></div></div><div class="menu-sub" hidden><button type="button" class="back back-sub role-body-medium">${R("chevron-left")}<span class="sub-label"></span></button><div class="sub-list"></div><div class="sub-cta"></div></div></dialog><arq-search-screen class="search-screen" data-arq-theme="light"></arq-search-screen><arq-search-sheet class="search-sheet" data-arq-theme="light"></arq-search-sheet>`;
	#e = null;
	#t = null;
	#n = null;
	#r = [];
	#i = -1;
	#a = 0;
	#o = "";
	get navigation() {
		return this.#e;
	}
	set navigation(e) {
		this.#e = e, this.#z();
	}
	setup() {
		let e = this.shadowRoot;
		this.#l(), q.addEventListener("change", () => {
			this.#D(), this.#l();
		}), Ps.addEventListener("change", () => this.#u()), this.addEventListener("arq:toggle", (e) => {
			if (e.target.localName !== "arq-nav-link") return;
			e.stopPropagation();
			let t = e.target.dataset.menu === "recursos" ? "recursos" : "products";
			q.matches ? this.#d(t) : this.#I(!(this.#g && this.#k === t), t);
		}), this.addEventListener("keydown", (e) => {
			if (q.matches || !["Tab", "ArrowDown"].includes(e.key) || e.shiftKey) return;
			let t = e.composedPath().find((e) => e.localName === "arq-nav-link" && e.hasAttribute("has-dropdown"));
			if (!t) return;
			let n = t.dataset.menu === "recursos" ? "recursos" : "products", r = this.#g && this.#k === n;
			(e.key !== "Tab" || r) && (e.preventDefault(), r || this.#I(!0, n), this.#A(n));
		}), this.addEventListener("focusin", (e) => {
			if (!this.#g) return;
			let t = e.composedPath(), n = this.shadowRoot.querySelector(".mega-wrap");
			!t.includes(n) && !t.includes(this.#s(this.#k)) && this.#I(!1);
		}), this.addEventListener("focusout", (e) => {
			let t = e.relatedTarget;
			this.#g && t && t !== this && !this.contains(t) && this.#I(!1);
		}), this.addEventListener("arq:toggle", (e) => {
			e.target.localName === "arq-nav-link" && e.target.dataset.menu !== "recursos" && this.#R();
		});
		for (let t of e.querySelectorAll(".search-open, .search-open-mobile")) for (let e of ["pointerenter", "focusin"]) t.addEventListener(e, () => this.#G(), { once: !0 });
		let t = e.querySelector(".search-sheet");
		e.querySelector(".search-open").addEventListener("click", (e) => {
			this.#d("search"), this.#p && this.#K(e.currentTarget);
		}), t.addEventListener("arq:close", (e) => {
			e.stopPropagation(), this.#d("default");
		});
		let n = e.querySelector(".search-field");
		n.addEventListener("arq:close", (t) => {
			t.stopPropagation(), this.#d("default"), e.querySelector(".search-open").focus();
		}), e.querySelector(".search-box").addEventListener("keydown", (t) => {
			t.key === "Escape" && (t.stopPropagation(), e.querySelector(".search-dropdown").hidden ? (this.#d("default"), e.querySelector(".search-open").focus()) : this.#q(!1));
		});
		let r = e.querySelector(".search-screen");
		e.querySelector(".search-open-mobile").addEventListener("click", (e) => {
			this.#d("search"), this.#p ? this.#K(e.currentTarget) : r.show(e.currentTarget);
		}), r.addEventListener("arq:close", (e) => {
			e.stopPropagation(), this.#d("default");
		});
		for (let e of [
			n,
			r,
			t
		]) e.addEventListener("arq:input", (e) => {
			e.stopPropagation(), this.#H(e.detail.value);
		}), e.addEventListener("arq:navigate", (e) => {
			e.stopPropagation(), this.#X(e.detail.step);
		}), e.addEventListener("arq:submit", (e) => {
			e.stopPropagation(), this.#Q(e.detail.value);
		});
		let i = e.querySelector(".menu");
		e.querySelector(".menu-open").addEventListener("click", () => this.#d("menu")), e.querySelector(".menu-close").addEventListener("click", () => this.#d("default")), i.addEventListener("cancel", (e) => {
			e.preventDefault(), this.#d(Rs.includes(this.mode) ? "products" : this.mode === "products" || this.mode === "recursos" ? "menu" : "default");
		}), i.addEventListener("click", (e) => {
			if (e.target !== i) return;
			let { bottom: t } = i.getBoundingClientRect();
			e.clientY > t && this.#d("default");
		}), e.querySelector(".back").addEventListener("click", () => this.#d("menu")), e.querySelector(".back-recursos").addEventListener("click", () => this.#d("menu")), e.querySelector(".back-sub").addEventListener("click", () => this.#d("products")), e.querySelector(".groups").addEventListener("click", (e) => {
			let t = e.target.closest("arq-mega-link[data-sub]");
			t && this.#d(t.dataset.sub);
		}), z(e.querySelector(".navbar"), { when: () => this.#g }), z(e.querySelector(".menu")), e.querySelector(".menu").addEventListener("close", () => V(!1)), e.querySelector(".scrim").addEventListener("click", () => this.#I(!1)), this.addEventListener("keydown", (e) => {
			if (e.key === "Escape" && this.#g) {
				e.stopPropagation();
				let t = this.#k;
				this.#I(!1), this.#s(t)?.focus();
			}
		}), document.addEventListener("click", (e) => {
			let t = e.composedPath().find((e) => e.dataset?.arqMenu);
			if (t && !e.defaultPrevented && e.button === 0 && !(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)) {
				e.preventDefault(), this.#L(t.dataset.arqMenu);
				return;
			}
			e.composedPath().includes(this) || (this.#I(!1), this.mode === "search" && !q.matches && this.#q(!1));
		});
		let a = () => {
			let e = document.querySelector("arq-hero"), t = e ? e.getBoundingClientRect().bottom <= this.shadowRoot.querySelector(".bar").getBoundingClientRect().bottom : window.scrollY > 0;
			t !== this.#h && (this.#h = t, this.shadowRoot.querySelector(".navbar").classList.toggle("scrolled", t), this.#u());
		};
		window.addEventListener("scroll", a, { passive: !0 }), window.addEventListener("resize", a, { passive: !0 });
		let o = document.querySelector("arq-hero");
		o && new ResizeObserver(a).observe(o), a(), this.shadowRoot.querySelector("slot[name=\"links\"]").addEventListener("slotchange", () => this.#u()), this.#u(), this.#c();
	}
	update(e) {
		e.has("label") && this.shadowRoot.querySelector(".bar").setAttribute("aria-label", this.label ?? ""), (e.has("theme") || e.has("mode")) && this.#u();
	}
	#s(e) {
		return this.querySelector(`arq-nav-link[data-menu="${e}"]`) || this.querySelector("arq-nav-link[has-dropdown]");
	}
	#c() {
		let e = decodeURIComponent(location.pathname).replace(/\/$/, "").split("/").pop().replace(/\.html$/, "");
		for (let t of this.shadowRoot.querySelectorAll(".recursos-nav arq-mega-link, .recursos-list arq-mega-link")) {
			let n = (t.getAttribute("href") || "").split("/").pop(), r = t.shadowRoot?.querySelector("a");
			r && (n && n === e ? r.setAttribute("aria-current", "page") : r.removeAttribute("aria-current"));
		}
	}
	#l() {
		let e = this.shadowRoot, t = e.querySelector("slot[name=\"links\"]");
		e.querySelector(q.matches ? ".menu-main" : ".links").append(t), e.querySelector(".logo").size = q.matches ? "small" : "default";
	}
	#u() {
		let e = this.mode === "default" || this.mode === "search" && (!q.matches || this.#p), t = this.theme === "transparent" && e && !this.#h && !this.#g && !Ps.matches;
		this.shadowRoot.querySelector(".navbar").classList.toggle("over-photo", t);
		for (let e of this.querySelectorAll("arq-nav-link")) customElements.upgrade(e), e.theme = t ? "inverse" : "default", e.setCurrentIndicatorVisible(!this.#g);
		for (let e of this.shadowRoot.querySelectorAll(".search-open, .actions arq-icon-button")) t ? e.setAttribute("data-arq-theme", "dark") : e.removeAttribute("data-arq-theme");
	}
	#d(e) {
		let t = this.shadowRoot, n = this.mode;
		this.mode = e, this.#I(!1);
		let r = t.querySelector(".menu"), i = q.matches, a = e === "search" && !i && !this.#p;
		t.querySelector(".search-open").hidden = a, t.querySelector(".search-box").hidden = !a, a && requestAnimationFrame(() => t.querySelector(".search-field").focus()), e !== "search" && this.#J();
		let o = Rs.includes(e), s = e === "menu" || e === "products" || e === "recursos" || o, c = [...t.querySelectorAll(".menu-main, .menu-products, .menu-recursos, .menu-sub")], l = r.classList.contains("is-open") ? c.find((e) => !e.hidden && !e.inert) : null, u = l?.offsetTop ?? 0, d = l ? this.#x(r) : 0;
		if (r.classList.toggle("is-tall", e === "colecciones"), s && !r.open ? (this.#f(), this.#m = t.querySelector(".menu-open"), clearTimeout(this.#_), r.showModal(), V(!0, r), r.offsetHeight, r.classList.add("is-open"), e === "menu" && t.querySelector(".menu-close").focus()) : s && !r.classList.contains("is-open") ? (clearTimeout(this.#_), r.classList.add("is-open")) : !s && r.open && this.#w(r), s) {
			t.querySelector(".menu-main").hidden = e !== "menu", t.querySelector(".menu-products").hidden = e !== "products", t.querySelector(".menu-recursos").hidden = e !== "recursos", t.querySelector(".menu-sub").hidden = !o;
			let i = c.find((e) => !e.hidden), a = (e) => e === "menu" ? 0 : e === "products" || e === "recursos" ? 1 : 2;
			l && i && l !== i && (this.#T(l, i, a(e) > a(n), u), this.#S(r, d));
		}
		if (o && this.#V(e), e === "products") {
			this.#R();
			let e = Rs.includes(n) && t.querySelector(`.groups [data-sub="${n}"]`);
			requestAnimationFrame(() => (e || t.querySelector(".back")).focus());
		} else e === "recursos" ? requestAnimationFrame(() => t.querySelector(".back-recursos").focus()) : o ? requestAnimationFrame(() => t.querySelector(".back-sub").focus()) : e === "menu" && (n === "products" || n === "recursos") && requestAnimationFrame(() => this.#s(n)?.focus());
		e !== "search" && (t.querySelector(".search-screen").open = !1, t.querySelector(".search-sheet").open = !1), this.#u();
	}
	#f() {
		let e = this.shadowRoot, t = `${Math.max(0, e.querySelector(".bar").getBoundingClientRect().top)}px`;
		e.querySelector(".navbar").style.setProperty("--bar-top", t), e.querySelector(".menu").style.setProperty("--bar-top", t), e.querySelector(".search-sheet").style.setProperty("--sheet-top", t);
	}
	get #p() {
		return this.search === "sheet";
	}
	#m = null;
	#h = !1;
	#g = !1;
	#_ = 0;
	#v = [];
	#y = null;
	#b = 0;
	#x(e) {
		let t = e.getBoundingClientRect().height, n = Number.parseFloat(e.style.clipPath.match(/inset\(0px 0px ([\d.]+)px/)?.[1] ?? e.style.clipPath.match(/inset\(0 0 ([\d.]+)px/)?.[1]) || 0;
		return Math.max(0, t - n);
	}
	#S(e, t) {
		this.#C(e);
		let n = e.getBoundingClientRect().height;
		if (!t || Math.abs(n - t) < 1 || !this.#j("panel")) return;
		let r = (t, n = "") => {
			e.style.transition = "none", e.style.minHeight = n, e.style.clipPath = t, e.offsetHeight, e.style.transition = "";
		};
		n > t ? (r(`inset(0 0 ${n - t}px 0)`), e.style.clipPath = "inset(0)") : (r("inset(0)", `${t}px`), e.style.clipPath = `inset(0 0 ${t - n}px 0)`), this.#b = setTimeout(() => this.#C(e), this.#j("panel"));
	}
	#C(e) {
		clearTimeout(this.#b), (e.style.clipPath || e.style.minHeight) && (e.style.transition = "none", e.style.clipPath = "", e.style.minHeight = "", e.offsetHeight, e.style.transition = "");
	}
	#w(e) {
		this.#C(e), e.classList.remove("is-open");
		let { transitionDuration: t } = getComputedStyle(e), n = Math.max(0, ...t.split(",").map((e) => (parseFloat(e) || 0) * (/ms\s*$/.test(e) ? 1 : 1e3)));
		clearTimeout(this.#_), this.#_ = setTimeout(() => {
			e.classList.contains("is-open") || (e.close(), this.#m?.focus());
		}, n);
	}
	#T(e, t, n, r) {
		let [i, a] = this.#v;
		if (this.#v.length === 2 && this.#v.every((e) => e.playState === "running") && this.#y?.from === t && this.#y?.to === e) {
			for (let e of [
				"position",
				"top",
				"left",
				"right"
			]) t.style.removeProperty(e);
			t.inert = !1, e.hidden = !1, e.inert = !0, Object.assign(e.style, {
				position: "absolute",
				top: `${r}px`,
				left: "0",
				right: "0"
			}), i.reverse(), a.reverse(), this.#y = {
				from: e,
				to: t
			};
			let n = () => this.#E(e);
			a.finished.then(n, n);
			return;
		}
		for (let e of this.#v) e.finish();
		this.#y = {
			from: e,
			to: t
		};
		let o = getComputedStyle(this), s = o.getPropertyValue("--arq-motion-easing-standard").trim() || "ease", c = Number.parseFloat(o.getPropertyValue("--arq-motion-duration-panel")) || 0;
		if (!c) {
			let e = Number.parseFloat(o.getPropertyValue("--arq-motion-duration-fade")) || 0;
			this.#v = [t.animate([{ opacity: 0 }, { opacity: 1 }], {
				duration: e,
				easing: s
			})];
			return;
		}
		e.hidden = !1, e.inert = !0, Object.assign(e.style, {
			position: "absolute",
			top: `${r}px`,
			left: "0",
			right: "0"
		});
		let l = (e) => `calc(${e} * var(--arq-space-gap-4xl)) 0`, u = {
			duration: c,
			easing: s
		}, d = e.animate([{
			translate: "0 0",
			opacity: 1
		}, {
			translate: l(n ? -1 : 1),
			opacity: 0
		}], u), f = t.animate([{
			translate: l(n ? 1 : -1),
			opacity: 0
		}, {
			translate: "0 0",
			opacity: 1
		}], u);
		this.#v = [d, f];
		let p = () => this.#E(e);
		d.finished.then(p, p);
	}
	#E(e) {
		for (let t of [
			"position",
			"top",
			"left",
			"right"
		]) e.style.removeProperty(t);
		e.inert = !1;
		let t = {
			menu: ".menu-main",
			products: ".menu-products",
			recursos: ".menu-recursos"
		}[this.mode] ?? (Rs.includes(this.mode) ? ".menu-sub" : null);
		e.hidden = !(t && e.matches(t));
	}
	#D() {
		this.mode !== "default" && this.#d("default"), this.#I(!1);
	}
	#O = 0;
	#k = "products";
	#A(e) {
		let t = () => {
			if (!this.#g || this.#k !== e) return;
			let t = this.shadowRoot;
			(e === "recursos" ? t.querySelector(".recursos-links arq-mega-link") : t.querySelector(".mega").shadowRoot?.querySelector("arq-tab[selected]") ?? t.querySelector(".mega").shadowRoot?.querySelector("arq-tab"))?.focus();
		};
		e === "products" && !this.#e && this.#t ? this.#t.then(() => requestAnimationFrame(t)) : requestAnimationFrame(t);
	}
	#j(e) {
		let t = getComputedStyle(this).getPropertyValue(`--arq-motion-duration-${e}`).trim();
		return (parseFloat(t) || 0) * (t.endsWith("ms") ? 1 : 1e3);
	}
	#M = 0;
	#N(e, t) {
		let n = this.shadowRoot.querySelector(".mega-drawer"), r = this.#F(n);
		this.#P(), e.classList.remove("leaving"), e.hidden = !1, t.classList.add("leaving");
		let i = n.getBoundingClientRect().height, a = e.getBoundingClientRect().height;
		n.style.transition = "none", n.style.clipPath = `inset(0 0 ${Math.max(0, i - r)}px 0)`, n.offsetHeight, n.style.transition = "", n.style.clipPath = `inset(0 0 ${Math.max(0, i - a)}px 0)`, this.#M = setTimeout(() => this.#P(), Math.max(this.#j("panel"), this.#j("fade")));
	}
	#P() {
		clearTimeout(this.#M);
		let e = this.shadowRoot;
		for (let t of e.querySelectorAll(".mega-drawer > .leaving")) t.hidden = !0, t.classList.remove("leaving");
		let t = e.querySelector(".mega-drawer");
		t.style.clipPath && (t.style.transition = "none", t.style.clipPath = "", t.offsetHeight, t.style.transition = "");
	}
	#F(e) {
		let t = /inset\(([^)]*)\)/.exec(getComputedStyle(e).clipPath)?.[1].trim().split(/\s+/).map(parseFloat) ?? [0], n = t.length >= 3 ? t[2] : t[0];
		return e.getBoundingClientRect().height - (n || 0);
	}
	#I(e, t = "products", n) {
		let r = this.shadowRoot, i = r.querySelector(".mega-wrap"), a = r.querySelector(".navbar"), o = !!e && !q.matches;
		o && t === "products" && this.#R(), o && this.mode === "search" && this.#d("default"), o && (this.#k = t);
		let s = o ? t : this.#k;
		for (let e of this.querySelectorAll("arq-nav-link[has-dropdown]")) e.open = o && (e.dataset.menu || "products") === s;
		if (o) {
			let e = r.querySelector(s === "products" ? ".mega" : ".recursos"), t = r.querySelector(s === "products" ? ".recursos" : ".mega");
			this.#g && !t.hidden && !t.classList.contains("leaving") ? this.#N(e, t) : this.#g || (this.#P(), e.hidden = !1, t.hidden = !0);
		} else this.#P();
		if (o && s === "products" && r.querySelector(".mega").reset(n), o !== this.#g) {
			clearTimeout(this.#O), o && (i.hidden = !1, i.offsetHeight), a.classList.add("mega-motion"), o && this.#f(), o ? a.setAttribute("data-arq-theme", "light") : a.removeAttribute("data-arq-theme"), i.classList.toggle("is-open", o), a.classList.toggle("mega-open", o);
			let { transitionDuration: e } = getComputedStyle(r.querySelector(".mega-drawer")), t = Math.max(0, ...e.split(",").map((e) => (parseFloat(e) || 0) * (/mss*$/.test(e) ? 1 : 1e3)));
			this.#O = setTimeout(() => {
				a.classList.remove("mega-motion"), this.#g || (i.hidden = !0);
			}, t);
		}
		this.#g = o, this.#u();
	}
	#L(e) {
		this.#R(), q.matches ? Rs.includes(e) && this.#d(e) : this.#I(!0, "products", e);
	}
	#R() {
		this.#e || this.#t || (this.#t = Wn().then((e) => this.navigation = e).catch((e) => console.error("[arq] navbar: no se pudo cargar la navegación", e)).finally(() => this.#t = null));
	}
	#z() {
		let e = this.shadowRoot, t = this.#e;
		e.querySelector(".mega").navigation = t, e.querySelector(".groups").innerHTML = Rs.map((e) => ({
			id: e,
			label: this.#B(e)
		})).filter((e) => e.label).map((e) => `<arq-mega-link submenu data-sub="${e.id}">${J(e.label)}</arq-mega-link>`).join(""), Rs.includes(this.mode) && this.#V(this.mode);
	}
	#B(e) {
		let t = this.#e;
		return e === "colecciones" ? t?.collections?.length ? "Colecciones" : "" : t?.sections?.[e]?.label ?? "";
	}
	#V(e) {
		let t = this.shadowRoot, n = this.#e;
		t.querySelector(".menu-sub").classList.toggle("menu-sub--colecciones", e === "colecciones"), t.querySelector(".sub-label").textContent = this.#B(e);
		let r = "", i = "";
		if (e === "colecciones") r = (n?.collections ?? []).map((e) => {
			let t = [
				e.image,
				...e.fallbacks ?? [],
				e.thumb
			].filter(Boolean).map((e) => be(e, Is)), [n, ...r] = [...new Set(t)];
			return `<arq-mega-link size="large" show-image href="${J(e.href)}"${n ? ` image="${J(n)}"` : ""}${r.length ? ` fallbacks="${J(JSON.stringify(r))}"` : ""}>${J(e.label)}<span slot="meta">${J(e.meta)}</span></arq-mega-link>`;
		}).join("");
		else {
			let t = n?.sections?.[e];
			r = (t?.links ?? []).map((e) => `<arq-mega-link size="large" href="${J(e.href)}">${J(e.label)}</arq-mega-link>`).join(""), t && (i = `<arq-button type="underline" show-underline show-icon icon="arrow-right" href="${J(t.all.href)}">${J(t.all.label)}</arq-button>`);
		}
		t.querySelector(".sub-list").innerHTML = r, t.querySelector(".sub-cta").innerHTML = i, t.querySelector(".sub-list").scrollTop = 0;
	}
	#H(e) {
		if (clearTimeout(this.#a), this.#o = e.trim(), !this.#o) {
			this.#U([], 0);
			return;
		}
		this.#a = setTimeout(async () => {
			let e = this.#o;
			try {
				let { results: t, total: n } = await Rn(e, { limit: Fs });
				e === this.#o && this.#U(t, n);
			} catch (t) {
				console.error("[arq] navbar: no se pudo buscar", t), e === this.#o && this.#U([], 0, !0);
			}
		}, Ls);
	}
	#U(e, t, n = !1) {
		let r = this.shadowRoot;
		this.#r = e, this.#i = -1;
		let i = this.#o, a = e.map((e) => `<arq-search-result href="${J(e.href)}"${e.image ? ` image="${J(e.image)}"` : ""}>${J(e.name)}<span slot="meta">${J(e.meta)}</span></arq-search-result>`).join("") + (e.length ? `<arq-search-see-all href="${J(zn(i))}" term="${J(i)}" count="${t}"></arq-search-see-all>` : ""), o = i && !e.length, s = n ? "error" : "no-results", c = r.querySelector(".search-dropdown");
		c.state = o ? s : "results", c.term = i, c.innerHTML = a, this.#q(!!i);
		let l = r.querySelector(".search-screen");
		l.innerHTML = o ? `<arq-search-dropdown state="${s}" term="${J(i)}"></arq-search-dropdown>` : a, r.querySelector(".search-sheet").results = {
			query: i,
			items: e,
			total: t,
			href: zn(i),
			error: n
		}, this.#Z();
		let u = t + e.filter((e) => e.kind === "collection").length, d = i ? n ? "No se pudo completar la búsqueda." : e.length ? `${u.toLocaleString("es-AR")} ${u === 1 ? "resultado" : "resultados"}` : `No encontramos resultados para «${i}»` : "";
		for (let t of this.#W()) t.status = d, t.expanded = e.length > 0;
		r.querySelector(".search-field").expanded = !c.hidden;
	}
	#W() {
		let e = this.shadowRoot;
		return [
			e.querySelector(".search-field"),
			e.querySelector(".search-screen").field,
			e.querySelector(".search-sheet").field
		];
	}
	#G() {
		if (this.#n || this.search !== "sheet") return;
		let e = this.shadowRoot.querySelector(".search-sheet");
		this.#n = xn().then((t) => e.recommended = t).catch((e) => {
			this.#n = null, console.error("[arq] navbar: no se pudieron cargar los recomendados", e);
		});
	}
	#K(e) {
		this.#G();
		let t = this.shadowRoot.querySelector(".search-sheet");
		t.toggleAttribute("over-photo", this.shadowRoot.querySelector(".navbar").classList.contains("over-photo")), this.#f(), t.show(e);
	}
	#q(e) {
		this.shadowRoot.querySelector(".search-dropdown").hidden = !e, this.shadowRoot.querySelector(".search-field").expanded = e;
	}
	#J() {
		clearTimeout(this.#a), this.#o = "";
		let e = this.shadowRoot;
		e.querySelector(".search-field").value = "", e.querySelector(".search-screen").field.value = "", e.querySelector(".search-sheet").field.value = "", this.#U([], 0);
	}
	#Y() {
		let e = this.shadowRoot;
		return this.#p ? e.querySelector(".search-sheet").items : [...(q.matches ? e.querySelector(".search-screen") : e.querySelector(".search-dropdown")).querySelectorAll("arq-search-result")];
	}
	#X(e) {
		let t = this.#Y();
		t.length && (this.#i = this.#i < 0 && e < 0 ? t.length - 1 : (this.#i + e + t.length) % t.length, t.forEach((e, t) => e.active = t === this.#i), !q.matches && !this.#p && this.#q(!0), this.#Z());
	}
	#Z() {
		let e = this.#r[this.#i], t = e ? `${e.name}, ${e.meta}, ${this.#i + 1} de ${this.#r.length}` : "";
		for (let e of this.#W()) e.activeLabel = t;
	}
	#Q(e) {
		let t = this.#Y()[this.#i];
		t ? t.click() : e.trim() && location.assign(zn(e.trim()));
	}
}).define();
//#endregion
//#region src/components/announcement-bar/announcement-bar.css?inline
var zs = ":host{display:block}.bar{box-sizing:border-box;padding:var(--arq-space-padding-2xs) var(--page-gutter);background:var(--arq-color-surface-default);color:var(--arq-color-text-primary);text-align:center;justify-content:center;align-items:center;display:flex}@media print{:host{display:none}}";
(class extends L {
	static tag = "arq-announcement-bar";
	static styles = zs;
	static properties = { label: { type: String } };
	static template = "<aside class=\"bar\" data-arq-theme=\"dark\"><slot></slot></aside>";
	update(e) {
		if (!e.has("label")) return;
		let t = this.shadowRoot.querySelector(".bar");
		this.label ? t.setAttribute("aria-label", this.label) : t.removeAttribute("aria-label");
	}
}).define();
//#endregion
//#region src/components/contact-item/contact-item.css?inline
var Bs = ":host{min-width:0;display:block}.item{align-items:flex-start;gap:var(--arq-space-gap-sm);flex-direction:column;display:flex;position:relative}.label{color:var(--arq-color-text-tertiary)}.value{max-width:100%;color:var(--arq-color-text-primary);overflow-wrap:anywhere;text-decoration:none;position:relative}.value[href]:after{content:\"\";inset-inline:0;top:calc(100% + var(--arq-space-padding-2xs) - var(--arq-border-default));height:var(--arq-border-default);background:var(--arq-color-border-strong);transform-origin:100%;transition:transform var(--arq-motion-duration-base) var(--arq-motion-easing-standard);position:absolute;transform:scaleX(0)}@media (hover:hover) and (pointer:fine){.value[href]:hover:after{transform-origin:0;transform:scaleX(1)}}.value:focus-visible{outline:none}.item:has(.value:focus-visible){outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}";
(class extends L {
	static tag = "arq-contact-item";
	static styles = Bs;
	static properties = { href: { type: String } };
	static template = "<div class=\"item\"><span class=\"label role-body-sm\"><slot name=\"label\"></slot></span><a class=\"value role-body-lg-regular\"><slot></slot></a></div>";
	focus(e) {
		this.shadowRoot.querySelector(".value").focus(e);
	}
	update() {
		let e = this.shadowRoot.querySelector(".value");
		this.href ? e.setAttribute("href", this.href) : e.removeAttribute("href");
	}
}).define();
//#endregion
//#region src/components/link-list/link-list.css?inline
var Vs = ":host{min-width:0;display:block}.list{align-items:flex-start;gap:var(--arq-space-gap-sm);flex-direction:column;display:flex}.title{color:var(--arq-color-text-secondary)}.links{align-self:stretch;align-items:flex-start;gap:var(--arq-space-gap-sm);flex-direction:column;display:flex}", Hs = 0;
(class extends L {
	static tag = "arq-link-list";
	static styles = Vs;
	static template = "<nav class=\"list\"><span class=\"title role-body-lg-regular\"><slot name=\"title\"></slot></span><div class=\"links\" role=\"list\"><slot></slot></div></nav>";
	setup() {
		let e = this.shadowRoot, t = e.querySelector(".title");
		t.id = `arq-link-list-${++Hs}`, e.querySelector("nav").setAttribute("aria-labelledby", t.id);
		let n = e.querySelector("slot:not([name])"), r = () => {
			for (let e of n.assignedElements()) e.setAttribute("role", "listitem");
		};
		n.addEventListener("slotchange", r), r();
	}
}).define();
//#endregion
//#region src/components/option-tile/option-tile.css?inline
var Us = ":host{cursor:pointer;flex:0 auto;min-width:0;display:flex}.tile{box-sizing:border-box;min-width:0;padding:0 0 var(--arq-space-padding-xs);border-bottom:var(--arq-border-default) solid var(--arq-color-surface-transparent);border-radius:var(--arq-radius-control);color:var(--arq-color-text-secondary);transition-property:color,border-color;transition-duration:var(--arq-theme-text-duration,var(--arq-motion-duration-base));transition-delay:var(--arq-theme-text-delay,0s);transition-timing-function:var(--arq-theme-text-easing,var(--arq-motion-easing-standard));flex:1;align-items:center;display:flex}@media (hover:hover) and (pointer:fine){:host(:not([disabled]):not([selected]):not([type=value]):hover) .tile{border-bottom-color:var(--arq-color-border-hover);color:var(--arq-color-text-primary)}}:host([selected]) .tile{border-bottom-color:var(--arq-color-border-strong);color:var(--arq-color-text-primary)}:host([type=value]){cursor:default}:host([type=value]) .tile{border-bottom-color:var(--arq-color-surface-transparent);color:var(--arq-color-text-primary)}:host(:not([type=card])) .title{line-height:calc(1em + var(--arq-border-strong))}.title{align-items:center;gap:var(--arq-space-gap-sm);min-width:0;display:flex}.meta{color:var(--arq-color-text-secondary)}:host([type=card]) .tile:has(>.media:not([hidden])){align-items:center;column-gap:var(--arq-space-gap-sm-md);grid-template-columns:auto minmax(0,1fr);display:grid}:host([type=card]) .tile:has(>.meta:not([hidden]))>.media{grid-row:1/span 2}.media{width:var(--arq-layout-search-thumb);height:var(--arq-layout-search-thumb);background:var(--arq-color-surface-subtle);display:block}.media[hidden]{display:none}::slotted([slot=media]){object-fit:contain;mix-blend-mode:multiply;width:100%;height:100%;display:block}.meta[hidden]{display:none}:host([type=card]) .tile{--card-pad-y:var(--arq-space-padding-sm-md);--card-pad-x:var(--arq-space-padding-md);align-items:flex-start;gap:var(--arq-space-gap-xs);padding:var(--card-pad-y) var(--card-pad-x);border:var(--arq-border-default) solid var(--arq-color-border-subtle);flex-direction:column;transition-property:color,border-color}@media (hover:hover) and (pointer:fine){:host([type=card]:not([disabled]):not([selected]):hover) .tile{border-color:var(--arq-color-border-hover)}}:host([type=card][selected]) .tile{border-color:var(--arq-color-border-strong)}:host([type=card][disabled]) .tile{border-color:var(--arq-color-border-disabled)}:host([type=card][disabled]) .meta{color:var(--arq-color-text-disabled)}:host([disabled]){cursor:default}:host([disabled]) .tile{color:var(--arq-color-text-disabled)}:host(:focus-visible){outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}:host(:focus:not(:focus-visible)){outline:none}";
(class extends L {
	static tag = "arq-option-tile";
	static styles = Us;
	static properties = {
		type: {
			type: String,
			values: [
				"option",
				"value",
				"card"
			],
			default: "option"
		},
		selected: { type: Boolean },
		disabled: { type: Boolean },
		value: { type: String }
	};
	static template = "<span class=\"tile\"><span class=\"media\" hidden><slot name=\"media\"></slot></span><span class=\"title role-body-regular\"><slot name=\"swatch\"></slot><slot></slot></span><span class=\"meta role-body-compact\" hidden><slot name=\"meta\"></slot></span></span>";
	setup() {
		this.selectable = new Gi(this, {
			role: "radio",
			state: "aria-checked"
		});
		let e = this.shadowRoot.querySelector("slot[name=\"meta\"]"), t = () => e.parentElement.hidden = !e.assignedNodes().some((e) => e.nodeType === 1 || e.textContent.trim());
		e.addEventListener("slotchange", t), t();
		let n = this.shadowRoot.querySelector("slot[name=\"media\"]"), r = () => n.parentElement.hidden = !n.assignedElements().length;
		n.addEventListener("slotchange", r), r();
	}
}).define();
//#endregion
//#region src/components/swatch-picker/swatch-picker.css?inline
var Ws = ":host{align-items:center;gap:var(--arq-space-gap-sm-md);flex-wrap:wrap;display:flex}";
(class extends L {
	static tag = "arq-swatch-picker";
	static styles = Ws;
	static properties = { label: { type: String } };
	static template = "<slot></slot>";
	setup() {
		this.setAttribute("role", "radiogroup"), this.select = new sa(this, { items: "arq-swatch" });
		let e = () => {
			for (let e of this.select.items) e.getAttribute("size") !== "xlarge" && e.setAttribute("size", "xlarge");
		};
		new MutationObserver(e).observe(this, {
			childList: !0,
			subtree: !0
		}), e();
	}
	update(e) {
		e.has("label") && (this.label ? this.setAttribute("aria-label", this.label) : this.removeAttribute("aria-label"));
	}
}).define();
//#endregion
//#region src/components/option-group/option-group.css?inline
var Gs = ":host{display:block}.group{align-items:flex-start;gap:var(--arq-space-gap-md);flex-direction:column;display:flex}.heading{align-items:baseline;gap:var(--arq-space-gap-sm);flex-wrap:wrap;display:flex}.heading[hidden]{display:none}.label{color:var(--arq-color-text-tertiary)}.value{color:var(--arq-color-text-secondary)}.options{gap:var(--arq-space-gap-sm) var(--arq-space-gap-lg);flex-wrap:wrap;align-self:stretch;display:flex}:host([type=cards]) .options{gap:var(--arq-space-gap-sm)}:host([type=swatches]) .options,:host([type=select]) .options{display:block}";
(class extends L {
	static tag = "arq-option-group";
	static styles = Gs;
	static properties = {
		label: { type: String },
		type: {
			type: String,
			values: [
				"tiles",
				"cards",
				"select",
				"swatches"
			],
			default: "tiles"
		},
		labelHidden: {
			type: Boolean,
			attribute: "label-hidden"
		},
		value: { type: String }
	};
	static template = "<div class=\"group\"><span class=\"heading\" hidden><span class=\"label role-label\"></span><span class=\"value role-body-sm\" aria-hidden=\"true\" hidden></span></span><div class=\"options\"><slot></slot></div></div>";
	setup() {
		this.select = new sa(this, { items: "arq-option-tile" }), this.shadowRoot.querySelector("slot").addEventListener("slotchange", () => {
			this.#n(), this.#e();
		});
	}
	#e() {
		if (this.type === "cards") {
			for (let e of this.querySelectorAll("arq-option-tile")) e.setAttribute("type", "card");
			return;
		}
		if (this.type !== "tiles") return;
		let e = [...this.querySelectorAll("arq-option-tile")], t = e.length === 1;
		for (let n of e) n.setAttribute("type", t ? "value" : "option");
		this.toggleAttribute("data-single", t), this.#t();
	}
	#t() {
		(this.type === "tiles" || this.type === "cards") && !this.hasAttribute("data-single") ? (this.setAttribute("role", "radiogroup"), this.label ? this.setAttribute("aria-label", this.label) : this.removeAttribute("aria-label")) : (this.removeAttribute("role"), this.removeAttribute("aria-label"));
	}
	update(e) {
		if (e.has("label") && (this.shadowRoot.querySelector(".label").textContent = this.label ?? ""), this.shadowRoot.querySelector(".heading").hidden = this.labelHidden || !(this.label || this.value), e.has("value")) {
			let e = this.shadowRoot.querySelector(".value");
			e.textContent = this.value ?? "", e.hidden = !this.value;
		}
		this.#t(), this.#n(), this.#e();
	}
	#n() {
		if (this.type !== "swatches") return;
		let e = this.querySelector("arq-swatch-picker");
		e && !e.hasAttribute("label") && this.label && (e.label = this.label);
	}
}).define();
//#endregion
//#region src/components/choice-chip/choice-chip.css?inline
var Ks = ":host{vertical-align:middle;cursor:pointer;max-width:100%;display:inline-flex}.chip{box-sizing:border-box;max-width:100%;padding:var(--arq-space-padding-sm) var(--arq-space-padding-md);border:var(--arq-border-default) solid var(--arq-color-border-default);border-radius:var(--arq-radius-control);color:var(--arq-color-text-primary);white-space:nowrap;flex:1;justify-content:center;align-items:center;display:inline-flex}@media (hover:hover) and (pointer:fine){:host(:not([disabled]):hover) .chip{border-color:var(--arq-color-border-strong)}}:host([selected]) .chip{border-color:var(--arq-color-border-strong);background:var(--arq-color-surface-inverse);color:var(--arq-color-text-inverse)}:host([disabled]){cursor:default}:host([disabled]) .chip{border-color:var(--arq-color-border-disabled);color:var(--arq-color-text-disabled)}:host(:focus-visible){outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}:host(:focus:not(:focus-visible)){outline:none}";
(class extends L {
	static tag = "arq-choice-chip";
	static styles = Ks;
	static formAssociated = !0;
	static properties = {
		selected: { type: Boolean },
		disabled: { type: Boolean },
		name: { type: String },
		value: { type: String }
	};
	static template = "<span class=\"chip role-body-regular\"><slot></slot></span>";
	#e = this.attachInternals();
	#t = !1;
	setup() {
		this.#t = this.selected, this.selectable = new Gi(this, {
			role: "radio",
			state: "aria-checked"
		});
	}
	update() {
		this.#e.setFormValue(this.selected ? this.value ?? "on" : null);
	}
	formResetCallback() {
		this.selected = this.#t;
	}
}).define();
//#endregion
//#region src/components/input/input.css?inline
var qs = ":host{width:100%;display:block}.input{gap:var(--arq-space-gap-sm);flex-direction:column;display:flex}.label{color:var(--arq-color-text-primary)}.field{box-sizing:border-box;align-items:center;gap:var(--arq-space-gap-sm);padding:calc(var(--arq-space-padding-sm) - var(--arq-border-default)) var(--arq-space-padding-sm-md);border:var(--arq-border-default) solid var(--arq-color-border-default);border-radius:var(--arq-radius-control);background:var(--arq-color-surface-default);display:flex}@media (hover:hover) and (pointer:fine){:host(:not([disabled]):not([error]):not([open])) .field:hover{border-color:var(--arq-color-border-hover)}}.control{box-sizing:border-box;border-radius:var(--arq-radius-control);background:var(--arq-color-surface-transparent);width:100%;min-width:0;color:var(--arq-color-text-primary);border:0;flex:1;margin:0;padding:0}.control::placeholder{color:var(--arq-color-text-tertiary);opacity:1}:host([type=textarea]) .field{align-items:stretch}textarea.control{resize:vertical}:host([type=select]) .field{position:relative}.trigger{align-items:center;gap:var(--arq-space-gap-sm);text-align:start;cursor:pointer;-webkit-tap-highlight-color:var(--arq-color-surface-transparent);display:flex}.select-value{overflow-wrap:break-word;flex:auto;min-width:0}.select-value.placeholder{color:var(--arq-color-text-tertiary)}.chevron{flex:none;display:inline-flex}.icon{width:var(--arq-icon-md);height:var(--arq-icon-md);color:var(--arq-color-icon-primary)}:host(:not([open])) [data-icon=chevron-up],:host([open]) [data-icon=chevron-down]{display:none}.menu{top:calc(100% + var(--arq-border-default));left:calc(-1 * var(--arq-border-default));z-index:2;width:calc(100% + 2 * var(--arq-border-default));transform-origin:top;max-width:none;transition:opacity var(--arq-motion-duration-slow) var(--arq-motion-easing-standard), transform var(--arq-motion-duration-slow) var(--arq-motion-easing-standard);position:absolute}@starting-style{.menu:not([hidden]){opacity:0;transform:scale(var(--arq-motion-scale-enter))}}@media (prefers-reduced-motion:reduce){.menu{transition:opacity var(--arq-motion-duration-fade) var(--arq-motion-easing-standard)}}:host([open]) .field,:host([open]) .field:focus-within{border-color:var(--arq-color-border-strong)}:host([disabled]) .trigger{cursor:default}:host([disabled]) .icon{color:var(--arq-color-icon-disabled)}.helper{color:var(--arq-color-text-tertiary);margin:0}.error{color:var(--arq-color-text-error);margin:0}.error-wrap{margin-top:calc(-1 * var(--arq-space-gap-sm));transition:grid-template-rows var(--arq-motion-duration-base) var(--arq-motion-easing-out);grid-template-rows:1fr;display:grid}.error-wrap>.error{min-height:0;padding-top:var(--arq-space-gap-sm);transition:opacity var(--arq-motion-duration-fade) var(--arq-motion-easing-out);overflow:hidden}@starting-style{.error-wrap:not([hidden]){grid-template-rows:0fr}.error-wrap:not([hidden])>.error{opacity:0}}.control:focus,.control:focus-visible{outline:none}.field:has(.control:focus-visible){outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}:host([error]) .field,:host([error]) .field:focus-within{border-color:var(--arq-color-border-error)}:host([disabled]) .label,:host([disabled]) .helper,:host([disabled]) .control,:host([disabled]) .control::placeholder{color:var(--arq-color-text-disabled)}:host([disabled]) .field{border-color:var(--arq-color-border-disabled)}@media (prefers-contrast:more){.field{border-color:var(--arq-color-border-strong)}}", Js = (() => {
	let e = 0;
	return () => `arq-input-${++e}`;
})(), Ys = 4, Xs = [
	"placeholder",
	"autocomplete",
	"required",
	"minlength",
	"maxlength",
	"pattern",
	"inputmode",
	"rows",
	"autocapitalize",
	"enterkeyhint"
];
(class extends L {
	static tag = "arq-input";
	static styles = qs;
	static formAssociated = !0;
	static properties = {
		type: {
			type: String,
			values: [
				"text",
				"select",
				"textarea"
			],
			default: "text"
		},
		showLabel: { type: Boolean },
		showHelper: { type: Boolean },
		error: { type: String },
		disabled: { type: Boolean },
		name: { type: String },
		inputType: {
			type: String,
			values: [
				"text",
				"email",
				"tel",
				"url",
				"number",
				"search"
			],
			default: "text"
		},
		placeholder: { type: String },
		autocomplete: { type: String },
		required: { type: Boolean },
		open: { type: Boolean }
	};
	static template = "<div class=\"input\"><label class=\"label role-body-regular\"><slot></slot></label><div class=\"field\"></div><p class=\"helper role-body-sm\"><slot name=\"helper\"></slot></p><div class=\"error-wrap\" hidden><p class=\"error role-body-sm\"></p></div><span class=\"live visually-hidden\" aria-live=\"polite\"></span></div>";
	#e = this.attachInternals();
	#t = null;
	#n = {
		control: Js(),
		helper: Js(),
		error: Js()
	};
	#r = "";
	#i = [];
	#a = "";
	#o = null;
	#s = !1;
	setError(e, { announce: t = !0 } = {}) {
		if (e) {
			if (e === this.error) return;
			this.#s = !t, this.error = e;
		} else this.removeAttribute("error");
	}
	get options() {
		return this.#i;
	}
	set options(e) {
		this.#i = Array.isArray(e) ? e.map((e) => ({
			value: String(e.value),
			label: e.label ?? String(e.value),
			disabled: !!e.disabled
		})) : [], this.#o && this.#u();
	}
	setup() {
		this.#r = this.getAttribute("value") ?? "";
		let e = this.shadowRoot;
		e.querySelector(".label").htmlFor = this.#n.control, e.querySelector(".helper").id = this.#n.helper, e.querySelector(".error").id = this.#n.error;
	}
	get value() {
		return this.#o ? this.#a : this.#t?.value ?? this.getAttribute("value") ?? "";
	}
	set value(e) {
		let t = e == null ? "" : String(e);
		this.#o ? (this.#a = t, this.#u(), this.#d()) : this.#t ? (this.#t.value = t, this.#d()) : this.setAttribute("value", t);
	}
	focus(e) {
		this.#t ? this.#t.focus(e) : super.focus(e);
	}
	checkValidity() {
		return this.#e.checkValidity();
	}
	reportValidity() {
		return this.#e.reportValidity();
	}
	get validity() {
		return this.#e.validity;
	}
	update(e) {
		(e.has("type") || !this.#t) && this.#c();
		let t = this.#t, n = this.shadowRoot;
		t.localName === "input" && (t.type = this.inputType);
		let r = !!this.#o;
		for (let e of r ? [] : Xs) this.hasAttribute(e) ? t.setAttribute(e, this.getAttribute(e)) : t.removeAttribute(e);
		t.localName === "textarea" && !this.hasAttribute("rows") && (t.rows = Ys), t.disabled = this.disabled, n.querySelector(".label").classList.toggle("visually-hidden", !this.showLabel);
		let i = !!this.error, a = n.querySelector(".helper"), o = n.querySelector(".error");
		o.textContent = this.error ?? "", n.querySelector(".error-wrap").hidden = !i;
		let s = n.querySelector(".live"), c = this.#s && i ? "" : this.error ?? "";
		this.#s = !1, s.textContent !== c && (s.textContent = c), a.hidden = i || !this.showHelper, t.setAttribute("aria-invalid", String(i));
		let l = [i ? this.#n.error : null, a.hidden ? null : this.#n.helper].filter(Boolean);
		l.length ? t.setAttribute("aria-describedby", l.join(" ")) : t.removeAttribute("aria-describedby"), r && (e.has("open") && (n.querySelector(".menu").hidden = !this.open, t.setAttribute("aria-expanded", String(this.open)), this.open || this.#o.closed()), this.#u()), this.#d();
	}
	formResetCallback() {
		this.value = this.#r;
	}
	formDisabledCallback(e) {
		this.#t.disabled = e || this.disabled;
	}
	#c() {
		let e = {
			textarea: "textarea",
			select: "button"
		}[this.type] ?? "input";
		if (this.#t?.localName === e) return;
		if (this.#o = null, this.shadowRoot.querySelector(".menu")?.remove(), e === "button") {
			this.#l();
			return;
		}
		let t = document.createElement(e);
		t.className = "control role-body", t.id = this.#n.control, t.value = this.#t?.value ?? this.getAttribute("value") ?? "", t.addEventListener("input", () => {
			this.#d(), this.emit("input", { value: t.value });
		}), t.addEventListener("change", () => this.emit("change", { value: t.value })), this.shadowRoot.querySelector(".field").replaceChildren(t), this.#t = t;
	}
	#l() {
		let e = this.shadowRoot, t = document.createElement("button");
		t.type = "button", t.className = "control trigger role-body", t.id = this.#n.control, t.setAttribute("aria-expanded", "false"), t.innerHTML = `<span class="select-value"></span><span class="chevron">${R("chevron-down")}${R("chevron-up")}</span>`;
		let n = e.querySelector(".field");
		n.replaceChildren(t);
		let r = document.createElement("arq-select-menu");
		r.type = "text", r.className = "menu", r.id = `${this.#n.control}-menu`, r.hidden = !0, n.append(r), this.#t = t, this.#a = this.getAttribute("value") ?? "", this.#o = new Ui({
			trigger: t,
			menu: r,
			options: () => this.#i,
			selected: () => this.#i.findIndex((e) => e.value === this.#a),
			isOpen: () => this.open,
			setOpen: (e) => this.open = e,
			choose: (e) => {
				let t = this.#i[e];
				t.value !== this.#a && (this.value = t.value, this.emit("input", { value: t.value }), this.emit("change", { value: t.value }));
			}
		});
	}
	#u() {
		let e = this.shadowRoot, t = this.#i.find((e) => e.value === this.#a), n = e.querySelector(".select-value");
		n.textContent = t?.label ?? this.placeholder ?? "", n.classList.toggle("placeholder", !t);
		let r = e.querySelector(".menu");
		for (; r.children.length > this.#i.length;) r.lastElementChild.remove();
		for (; r.children.length < this.#i.length;) r.append(document.createElement("arq-select-option"));
		this.#i.forEach((e, n) => {
			let i = r.children[n];
			i.id = `${r.id}-${n}`, i.value = e.value, i.textContent = e.label, i.disabled = e.disabled, i.selected = e === t;
		});
	}
	#d() {
		let e = this.#t;
		if (this.#o) {
			this.#e.setFormValue(this.#a || null), this.required && !this.#a ? this.#e.setValidity({ valueMissing: !0 }, "Elegí una opción.", e) : this.#e.setValidity({});
			return;
		}
		this.#e.setFormValue(e.value), e.validity.valid ? this.#e.setValidity({}) : this.#e.setValidity(e.validity, e.validationMessage, e);
	}
}).define();
//#endregion
//#region src/components/file-upload/file-upload.css?inline
var Zs = ":host{width:100%;display:block}.upload{gap:var(--arq-space-gap-sm);flex-direction:column;display:flex}.label{color:var(--arq-color-text-primary)}.zone,.attached{box-sizing:border-box;padding:var(--arq-space-padding-lg);border:var(--arq-border-default) dashed var(--arq-color-border-default);border-radius:var(--arq-radius-control);background:var(--arq-color-surface-subtle);align-items:center;display:flex;position:relative}.zone{cursor:pointer;-webkit-user-select:none;user-select:none}.attached{justify-content:space-between;gap:var(--arq-space-gap-sm-md);border-style:solid}.empty{align-items:center;gap:var(--arq-space-gap-sm-md);min-width:0;display:flex}.icon{width:var(--arq-icon-md);height:var(--arq-icon-md);color:var(--arq-color-icon-primary);flex:none}.prompt,.file{min-width:0;color:var(--arq-color-text-primary)}.file{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.remove{flex:none}.helper{color:var(--arq-color-text-tertiary);margin:0}.error{color:var(--arq-color-text-error);margin:0}.drop{min-width:0;color:var(--arq-color-text-primary);display:none}:host(:state(drag-over)) .zone{border-color:var(--arq-color-border-strong);background:var(--arq-color-surface-hover)}:host(:state(drag-over)) .prompt{display:none}:host(:state(drag-over)) .drop{display:inline}:host(:state(error)) .zone{border-color:var(--arq-color-border-error)}:host([disabled]) .zone{border-color:var(--arq-color-border-disabled);cursor:default}:host([disabled]) .label,:host([disabled]) .prompt,:host([disabled]) .file,:host([disabled]) .helper{color:var(--arq-color-text-disabled)}:host([disabled]) .icon{color:var(--arq-color-icon-disabled)}.zone:has(.native:focus-visible){outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}@media (prefers-contrast:more){.zone,.attached{border-color:var(--arq-color-border-strong)}}", Qs = ".pdf,.dwg,.jpg,.jpeg,.png", $s = 10, ec = {
	type: "El formato no está admitido.",
	size: (e) => `El archivo supera los ${e} MB.`
};
function tc(e) {
	let t = [...new Set(e.split(",").map((e) => e.trim().replace(/^\./, "").toUpperCase()).filter(Boolean).map((e) => e === "JPEG" ? "JPG" : e))];
	return t.length > 1 ? `${t.slice(0, -1).join(", ")} o ${t.at(-1)}` : t.join("");
}
(class extends L {
	static tag = "arq-file-upload";
	static styles = Zs;
	static formAssociated = !0;
	static properties = {
		accept: {
			type: String,
			default: Qs
		},
		maxSize: {
			type: Number,
			default: $s
		},
		name: { type: String },
		required: { type: Boolean },
		disabled: { type: Boolean }
	};
	static template = `<div class="upload"><span class="label role-body-regular" id="label"><slot>Adjuntar archivo</slot></span><label class="zone" id="zone"><input type="file" class="native visually-hidden" aria-labelledby="label" aria-describedby="helper error"><span class="empty">${R("plus")}<span class="prompt role-body"><slot name="prompt">Arrastrá o seleccioná planos, renders o fotos</slot></span><span class="drop role-body" aria-hidden="true"><slot name="drop">Soltá el archivo acá</slot></span></span></label><div class="attached" hidden><span class="file role-body-regular"></span><arq-button type="underline" show-underline class="remove">Quitar<span class="visually-hidden"></span></arq-button></div><p class="helper role-body-sm" id="helper"><slot name="helper"></slot></p><p class="error role-body-sm" id="error" hidden></p><span class="live visually-hidden" aria-live="polite"></span></div>`;
	#e = this.attachInternals();
	#t = null;
	#n = null;
	#r = "";
	#i = 0;
	setup() {
		let e = this.shadowRoot;
		this.#t = e.querySelector(".native"), this.#t.addEventListener("change", () => this.#a(this.#t.files[0] ?? null));
		let t = e.querySelector(".zone");
		t.addEventListener("dragenter", (e) => {
			e.preventDefault(), !this.disabled && (this.#i += 1, this.#c(!0));
		}), t.addEventListener("dragover", (e) => {
			e.preventDefault(), e.dataTransfer && (e.dataTransfer.dropEffect = this.disabled ? "none" : "copy");
		}), t.addEventListener("dragleave", () => {
			this.#i = Math.max(0, this.#i - 1), this.#i || this.#c(!1);
		}), t.addEventListener("drop", (e) => {
			if (e.preventDefault(), this.#i = 0, this.#c(!1), this.disabled) return;
			let t = e.dataTransfer?.files?.[0];
			t && this.#a(t);
		}), e.querySelector(".remove").addEventListener("click", () => {
			this.clear(), this.#t.focus();
		});
	}
	get file() {
		return this.#n;
	}
	focus(e) {
		this.#t ? this.#t.focus(e) : super.focus(e);
	}
	clear() {
		this.#t.value = "", this.#s(null, ""), this.emit("change", { file: null });
	}
	update() {
		this.#t.accept = this.accept, this.#t.required = this.required, this.#t.disabled = this.disabled, this.shadowRoot.querySelector(".remove").disabled = this.disabled, this.#l();
	}
	formDisabledCallback(e) {
		this.#t.disabled = e || this.disabled;
	}
	formResetCallback() {
		this.#t.value = "", this.#s(null, "");
	}
	#a(e) {
		if (!e) return;
		let t = this.#o(e);
		if (t) {
			this.#t.value = "", this.#s(null, t);
			return;
		}
		this.#s(e, ""), this.emit("change", { file: e });
	}
	#o(e) {
		let t = this.accept.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean), n = `.${e.name.split(".").pop()?.toLowerCase()}`, r = t.length ? ` Formatos: ${tc(this.accept)}.` : "";
		return t.length && !t.includes(n) ? ec.type + r : this.maxSize && e.size > this.maxSize * 1024 * 1024 ? ec.size(this.maxSize) + r : "";
	}
	#s(e, t) {
		this.#n = e, this.#r = t, this.#e.setFormValue(e), this.required && !e ? this.#e.setValidity({ valueMissing: !0 }, "Adjuntá un archivo.", this.#t) : this.#e.setValidity({}), this.#l();
	}
	#c(e) {
		e ? this.#e.states.add("drag-over") : this.#e.states.delete("drag-over");
	}
	#l() {
		let e = this.shadowRoot, t = this.#n;
		e.querySelector(".zone").hidden = !!t, e.querySelector(".attached").hidden = !t, e.querySelector(".file").textContent = t?.name ?? "", e.querySelector(".remove .visually-hidden").textContent = t ? ` archivo ${t.name}` : "";
		let n = e.querySelector(".error");
		n.textContent = this.#r, n.hidden = !this.#r;
		let r = e.querySelector(".live");
		r.textContent !== this.#r && (r.textContent = this.#r), e.querySelector(".helper").hidden = !!this.#r, this.#r ? this.#e.states.add("error") : this.#e.states.delete("error"), this.#t.setAttribute("aria-invalid", String(!!this.#r));
	}
}).define();
//#endregion
//#region src/components/section-header/section-header.css?inline
var nc = ":host{min-width:0;display:block}.header{justify-content:space-between;align-items:flex-end;gap:var(--arq-space-gap-lg);min-width:0;display:flex}.text{gap:var(--arq-space-gap-sm-md);flex-direction:column;min-width:0;display:flex}.title,.description{overflow-wrap:break-word;margin:0}.title{color:var(--arq-color-text-primary)}.description{color:var(--arq-color-text-secondary)}.link{flex:none}:host([type=description]) .text{display:contents}:host([type=description]) .description{flex:0 1 var(--arq-layout-measure);max-width:var(--arq-layout-measure)}.title-block{display:contents}:host([type=editorial]) .title-block{align-items:flex-start;gap:var(--arq-space-gap-lg);flex-direction:column;min-width:0;display:flex}:host([type=editorial]) .text{display:contents}:host([type=editorial]) .header{padding-bottom:var(--arq-space-padding-xl);border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle)}:host([type=editorial]) .title{font-weight:var(--arq-font-weight-regular)}:host([type=editorial]) .kicker{color:var(--arq-color-text-secondary);margin:0}:host([type=editorial]) .description{flex:0 1 var(--arq-layout-measure);max-width:var(--arq-layout-measure);text-align:end}:host([type=stacked]) .header{flex-direction:column;justify-content:flex-start;align-items:flex-start}:host([type=stacked]) .text{align-self:stretch}@media (width<=767px){.header{flex-direction:column;justify-content:flex-start;align-items:flex-start}.text{width:100%}:host([type=description]) .text{display:flex}:host([type=description]) .description,:host([type=editorial]) .description{text-align:start;flex:none;max-width:none}:host([type=link]) .link,:host(:not([type])) .link{display:none}}", rc = [
	"description",
	"stacked",
	"editorial"
], ic = ["link", "stacked"];
(class extends L {
	static tag = "arq-section-header";
	static styles = nc;
	static properties = {
		type: {
			type: String,
			values: [
				"link",
				"description",
				"title",
				"stacked",
				"editorial"
			],
			default: "link"
		},
		href: { type: String }
	};
	static template = "<div class=\"header\"><div class=\"text\"><div class=\"title-block\"><p class=\"kicker role-label\" hidden><slot name=\"kicker\"></slot></p><div class=\"title role-heading-2\"><slot name=\"title\"></slot></div></div><p class=\"description role-body-lg\" hidden><slot name=\"description\"></slot></p></div><arq-button class=\"link\" type=\"underline\" show-underline show-icon icon=\"arrow-right\" hidden><slot name=\"link\">Ver todo</slot></arq-button></div>";
	setup() {
		for (let e of ["description", "kicker"]) this.shadowRoot.querySelector(`slot[name="${e}"]`).addEventListener("slotchange", () => this.update());
	}
	update() {
		let e = this.shadowRoot, t = (t) => e.querySelector(`slot[name="${t}"]`).assignedNodes({ flatten: !0 }).some((e) => e.textContent.trim()), n = this.type === "editorial";
		e.querySelector(".description").hidden = !rc.includes(this.type) || !t("description"), e.querySelector(".kicker").hidden = !n || !t("kicker"), e.querySelector(".title").classList.toggle("role-display-sm", n), e.querySelector(".title").classList.toggle("role-heading-2", !n), e.querySelector(".description").classList.toggle("role-body", n), e.querySelector(".description").classList.toggle("role-body-lg", !n);
		let r = e.querySelector(".link"), i = ic.includes(this.type) && !!this.href;
		r.hidden = !i, i ? r.setAttribute("href", this.href) : r.removeAttribute("href");
	}
}).define();
//#endregion
//#region src/components/page-header/page-header.css?inline
var ac = ":host{min-width:0;display:block}.header{align-items:flex-start;gap:var(--arq-space-gap-xl-2xl);padding:var(--arq-space-section-sm) var(--page-gutter) var(--arq-space-section-xs);flex-direction:column;display:flex}.row{justify-content:space-between;align-items:flex-end;gap:var(--arq-space-gap-lg);align-self:stretch;min-width:0;display:flex}.main,.heading{flex-direction:column;min-width:0;display:flex}.heading{gap:var(--arq-space-gap-lg)}.title,.description{overflow-wrap:break-word;margin:0}.title{color:var(--arq-color-text-primary)}.description{color:var(--arq-color-text-secondary)}.action{flex:none}:host(:not([type=detail])) .main{display:contents}:host(:not([type=detail])) .description{flex:0 1 var(--arq-layout-measure);max-width:var(--arq-layout-measure)}:host([type=detail]) .header{padding-block:var(--arq-space-section-xs) var(--arq-space-section-sm)}:host([type=detail]) .main{gap:var(--arq-space-gap-md)}:host([type=detail]) .description{max-width:var(--arq-layout-measure-wide)}@media (width<=767px){.row{align-items:stretch;gap:var(--arq-space-gap-lg);flex-direction:column}:host(:not([type=detail])) .main{gap:var(--arq-space-gap-lg);display:flex}:host(:not([type=detail])) .description,:host([type=detail]) .main{flex:none;max-width:none}:host([type=detail]) .row{gap:var(--arq-space-gap-xl-2xl)}.action ::slotted(*){width:100%}}.print-title{display:none}@media print{:host([type=detail]) .header{padding-block:var(--page-gutter) 0}.has-print-title .title{display:none}.has-print-title .print-title{display:block}.back,.breadcrumb,.description,.action{display:none}}", oc = matchMedia("(max-width: 767px)");
(class extends L {
	static tag = "arq-page-header";
	static styles = ac;
	static properties = {
		type: {
			type: String,
			values: ["list", "detail"],
			default: "list"
		},
		showBreadcrumb: { type: Boolean },
		showDescription: { type: Boolean },
		showBack: { type: Boolean },
		showAction: { type: Boolean },
		backHref: { type: String },
		searchTitle: { type: Boolean },
		titleStyle: {
			type: String,
			values: ["display", "heading-1"],
			default: "display"
		}
	};
	static template = "<div class=\"header\"><arq-button class=\"back\" type=\"underline\" show-leading-icon leading-icon=\"chevron-left\" hidden><slot name=\"back\"></slot></arq-button><div class=\"row\"><div class=\"main\"><div class=\"heading\"><div class=\"breadcrumb\" hidden><slot name=\"breadcrumb\"></slot></div><div class=\"title role-display\"><slot name=\"title\"></slot></div><div class=\"print-title role-heading-3\"><slot name=\"print-title\"></slot></div></div><p class=\"description role-body-lg\" hidden><slot name=\"description\"></slot></p></div><div class=\"action\" hidden><slot name=\"action\"></slot></div></div></div>";
	setup() {
		for (let e of this.shadowRoot.querySelectorAll("slot[name]")) e.addEventListener("slotchange", () => this.update());
		oc.addEventListener("change", () => this.update());
	}
	update() {
		let e = this.shadowRoot, t = (t) => e.querySelector(`slot[name="${t}"]`).assignedNodes({ flatten: !0 }).some((e) => e.nodeType === Node.ELEMENT_NODE || e.textContent.trim()), n = this.type === "detail";
		e.querySelector(".breadcrumb").hidden = !this.showBreadcrumb || !t("breadcrumb"), e.querySelector(".description").hidden = !this.showDescription || !t("description"), e.querySelector(".action").hidden = !n || !this.showAction || !t("action"), e.querySelector(".header").classList.toggle("has-print-title", t("print-title"));
		let r = e.querySelector(".back"), i = n && this.showBack && !!this.backHref && t("back");
		r.hidden = !i, i ? r.setAttribute("href", this.backHref) : r.removeAttribute("href");
		let a = this.titleStyle === "heading-1", o = !a && !n && !oc.matches && !this.searchTitle, s = e.querySelector(".title");
		s.classList.toggle("role-heading-1", a), s.classList.toggle("role-display-lg", o), s.classList.toggle("role-display", !a && !o);
		let c = e.querySelector(".description");
		c.classList.toggle("role-body", o), c.classList.toggle("role-body-lg", !o);
	}
}).define();
//#endregion
//#region src/components/faq-item/faq-item.css?inline
var sc = ":host{min-width:0;display:block}:host([data-arq-empty]){display:none}.item{border-top:var(--arq-border-default) solid var(--arq-color-border-default)}.trigger{box-sizing:border-box;align-items:center;gap:var(--arq-space-gap-lg);width:100%;padding:var(--arq-space-padding-lg) 0;background:var(--arq-color-surface-transparent);color:var(--arq-color-text-primary);font:inherit;text-align:start;cursor:pointer;-webkit-tap-highlight-color:var(--arq-color-surface-transparent);border:0;margin:0;display:flex}:host([open]) .trigger{padding-bottom:var(--arq-space-gap-sm-md)}.trigger{transition:padding-bottom var(--arq-motion-duration-expand) var(--arq-motion-easing-out), background-color var(--arq-motion-duration-fast) var(--arq-motion-easing-standard), color var(--arq-motion-duration-fast) var(--arq-motion-easing-standard)}.question{overflow-wrap:break-word;flex:1 1 0;min-width:0}.icon{width:var(--arq-icon-md);height:var(--arq-icon-md);color:var(--arq-color-icon-primary);flex:none}:host(:not([open])) [data-icon=minus],:host([open]) [data-icon=plus]{display:none}.answer{max-width:var(--arq-layout-measure-wide);padding-bottom:var(--arq-space-padding-lg);color:var(--arq-color-text-secondary);overflow-wrap:break-word}::slotted(a){color:var(--arq-color-text-primary);text-decoration:underline}@media (hover:hover) and (pointer:fine){:host(:not([open])) .trigger:hover{background:var(--arq-color-surface-faint)}}.item:has(.trigger:focus-visible){outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.trigger:focus{outline:none}:host([number]) .number{width:var(--arq-icon-xl);color:var(--arq-color-text-tertiary);flex:none}:host([number]) .answer{max-width:none;padding-inline-start:calc(var(--arq-icon-xl) + var(--arq-space-gap-lg))}:host([number]:last-child) .item{border-bottom:var(--arq-border-default) solid var(--arq-color-border-default)}@media (width<=1023px){.answer{max-width:none}}@media (width<=767px){:host([number]) .trigger{row-gap:var(--arq-space-gap-xs);flex-wrap:wrap}:host([number]) .number{flex:1 0 100%;width:auto}:host([number]) .answer{padding-inline-start:0}}";
(class extends L {
	static tag = "arq-faq-item";
	static styles = sc;
	static properties = {
		open: { type: Boolean },
		number: { type: String }
	};
	static template = `<div class="item"><button type="button" class="trigger"><span class="number role-caption" hidden></span><span class="question role-body-xl"><slot name="question"></slot></span>${R("plus")}${R("minus")}</button><div class="answer-wrap" part="panel"><div class="answer-clip"><div class="answer role-body"><slot></slot></div></div></div></div>`;
	setup() {
		this.disclosure = new Li(this, {
			trigger: this.shadowRoot.querySelector(".trigger"),
			panel: this.shadowRoot.querySelector(".answer-wrap"),
			animateHeight: !0
		});
		let e = this.shadowRoot.querySelector(".answer slot"), t = () => {
			let t = !e.assignedNodes().some((e) => e.nodeType === Node.ELEMENT_NODE || e.textContent.trim());
			this.toggleAttribute("data-arq-empty", t);
		};
		e.addEventListener("slotchange", t), t();
	}
	update() {
		let e = (this.number || "").trim(), t = this.shadowRoot.querySelector(".number");
		t.textContent = e, t.hidden = !e;
		let n = this.shadowRoot.querySelector(".question");
		n.classList.toggle("role-heading-3", !!e), n.classList.toggle("role-body-xl", !e);
	}
}).define();
//#endregion
//#region src/components/footer/footer.css?inline
var cc = ":host{display:block}.footer{grid-template-columns:minmax(var(--arq-layout-footer-tagline), 1fr) minmax(0, auto);column-gap:var(--arq-space-gap-xl);row-gap:var(--arq-space-gap-md);padding:var(--arq-space-section-sm) var(--page-gutter);border-top:var(--arq-border-default) solid var(--arq-color-border-subtle);background:var(--arq-color-surface-default);transition-property:background-color;transition-duration:var(--arq-illumination-bg-duration);transition-delay:0s;transition-timing-function:var(--arq-illumination-bg-easing);grid-template-rows:auto 1fr;grid-template-areas:\"brand columns\"\"legal columns\";display:grid}.brand{align-items:flex-start;gap:var(--arq-space-gap-md);flex-direction:column;grid-area:brand;min-width:0;display:flex}.tagline{max-width:var(--arq-layout-footer-tagline);color:var(--arq-color-text-secondary);overflow-wrap:break-word;margin:0}.legal{color:var(--arq-color-text-tertiary);text-transform:uppercase;grid-area:legal;align-self:start;margin:0}.columns{align-items:flex-start;gap:var(--arq-space-gap-xl);grid-area:columns;display:flex}.column{width:var(--arq-layout-footer-column);align-items:flex-start;gap:var(--arq-space-gap-sm);flex-direction:column;flex:0 auto;min-width:0;display:flex}.title{padding-bottom:var(--arq-space-gap-sm);color:var(--arq-color-text-primary);margin:0}.list{align-items:flex-start;gap:var(--arq-space-gap-sm);flex-direction:column;max-width:100%;display:flex}@media (width<=767px){.footer{row-gap:var(--arq-space-gap-xl);grid-template-rows:none;grid-template-columns:minmax(0,1fr);grid-template-areas:\"brand\"\"columns\"\"legal\"}.columns{row-gap:var(--arq-space-gap-xl);flex-wrap:wrap}.column{flex:1 1 0;min-width:min-content}}@media print{:host{display:none}}", lc = [
	"productos",
	"informacion",
	"redes"
];
(class extends L {
	static tag = "arq-footer";
	static styles = cc;
	static template = "<footer class=\"footer\"><div class=\"brand\"><arq-logo></arq-logo><p class=\"tagline role-body\"><slot name=\"tagline\"></slot></p></div><div class=\"columns\">" + lc.map((e) => `<nav class="column" data-column="${e}"><div class="title role-body-strong"><slot name="${e}-title"></slot></div><div class="list" role="list"><slot name="${e}"></slot></div></nav>`).join("") + "</div><p class=\"legal role-body-sm\">© <span class=\"year\"></span> Macroled Arq.</p></footer>";
	setup() {
		let e = this.shadowRoot;
		e.querySelector(".year").textContent = String((/* @__PURE__ */ new Date()).getFullYear());
		let t = e.querySelector("slot[name=\"tagline\"]"), n = () => {
			e.querySelector(".tagline").hidden = !t.assignedNodes({ flatten: !0 }).some((e) => e.textContent.trim());
		};
		t.addEventListener("slotchange", n), n();
		for (let t of lc) {
			let n = e.querySelector(`[data-column="${t}"]`), r = e.querySelector(`slot[name="${t}-title"]`), i = () => {
				let e = r.assignedNodes({ flatten: !0 }).map((e) => e.textContent).join(" ").trim();
				e ? n.setAttribute("aria-label", e) : n.removeAttribute("aria-label");
			};
			r.addEventListener("slotchange", i), i();
		}
	}
}).define();
//#endregion
//#region src/base/play-once.js
var uc = /* @__PURE__ */ new WeakSet(), dc = null;
function fc(e) {
	let t = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	for (let n of e) if (!(n.localName !== "video" || n.autoplay || n.loop || uc.has(n))) {
		if (uc.add(n), n.muted = !0, t) {
			mc(n);
			continue;
		}
		dc ??= new IntersectionObserver(pc, { threshold: .5 }), dc.observe(n);
	}
}
function pc(e) {
	for (let t of e) t.isIntersecting && (dc.unobserve(t.target), t.target.play().catch(() => mc(t.target)));
}
function mc(e) {
	let t = () => {
		e.currentTime = e.duration;
	};
	e.readyState >= HTMLMediaElement.HAVE_METADATA ? t() : e.addEventListener("loadedmetadata", t, { once: !0 });
}
//#endregion
//#region src/components/hero/hero.css?inline
var hc = ":host{display:block}.hero{background:var(--arq-color-surface-inverse);flex-direction:column;justify-content:flex-end;height:70svh;display:flex;position:relative;overflow:hidden}.media{position:absolute;inset:0}::slotted([slot=media]){object-fit:cover;width:100%!important;max-width:none!important;height:100%!important;display:block!important}.scrim{background:linear-gradient(#00000085 0%,#0003 18% 45%,#000000ad 100%);position:absolute;inset:0}.content{justify-content:space-between;align-items:flex-end;gap:var(--arq-space-gap-xl);padding:0 var(--page-gutter) var(--arq-space-section-sm);color:var(--arq-color-text-inverse);display:flex;position:relative}.text{align-items:flex-start;gap:var(--arq-space-gap-lg);flex-direction:column;min-width:0;display:flex}.eyebrow,.title,.description{overflow-wrap:break-word;max-width:100%;margin:0}.action{flex:none}@media (width<=767px){.content{justify-content:flex-start;align-items:flex-start;gap:var(--arq-space-gap-lg);flex-direction:column}.text{align-self:stretch}}:host([tall]) .hero{height:80svh}:host([parallax]) .media{clip-path:inset(0);overflow:hidden}:host([parallax]) ::slotted([slot=media]){position:fixed!important;inset:0!important}@media (prefers-reduced-motion:reduce){:host([parallax]) ::slotted([slot=media]){position:absolute!important}}:host([full-height]) .hero{height:calc(100svh - var(--announcement-height,var(--arq-space-0)))}:host([full-height]) .veil{background:var(--arq-color-surface-inverse);opacity:0;pointer-events:none;position:absolute;inset:0}:host([full-height]) .hero.intro:not(.entered) .veil{opacity:var(--arq-opacity-track)}:host([full-height]) .hero.entered .veil{animation:arq-hero-on var(--arq-motion-duration-illumination-image) var(--arq-motion-easing-illumination) both}@keyframes arq-hero-on{0%{opacity:var(--arq-opacity-track)}to{opacity:0}}:host([full-height]) .hero.intro:not(.entered) .content{opacity:0}:host([full-height]) .hero.intro:not(.entered) .title{transform:translateY(var(--arq-space-gap-lg))}:host([full-height]) .hero.entered .content{animation:arq-hero-in var(--arq-motion-duration-illumination-image) var(--arq-motion-easing-illumination-image) both;animation-delay:var(--arq-motion-duration-illumination-lead)}:host([full-height]) .hero.entered .title{animation:arq-hero-title var(--arq-motion-duration-illumination-image) var(--arq-motion-easing-illumination-image) both;animation-delay:var(--arq-motion-duration-illumination-lead)}@keyframes arq-hero-in{0%{opacity:0}}@keyframes arq-hero-title{0%{transform:translateY(var(--arq-space-gap-lg))}}:host([full-height]) .scrim{background:linear-gradient(#0000 0%,#000000b3 100%);height:66.666%;inset:auto 0 0}:host([full-height]) .content{padding:0 var(--arq-space-padding-4xl) var(--arq-space-padding-4xl)}@media (width<=767px){:host([full-height]) .content{padding-inline:var(--page-gutter);padding-bottom:var(--arq-space-section-sm)}}:host([size=compact]) .hero{height:auto;min-height:41svh;padding-top:var(--arq-space-section-md)}@media (width<=767px){:host([size=compact]) .hero{min-height:47svh}}", gc = [
	"eyebrow",
	"description",
	"action"
];
(class extends L {
	static tag = "arq-hero";
	static styles = G + hc;
	static properties = {
		fullHeight: { type: Boolean },
		tall: { type: Boolean },
		parallax: { type: Boolean },
		reveal: { type: Boolean },
		size: {
			type: String,
			values: ["default", "compact"],
			default: "default"
		}
	};
	static template = "<div class=\"hero\"><div class=\"media\"><slot name=\"media\"></slot></div><div class=\"veil\" aria-hidden=\"true\"></div><div class=\"scrim\" aria-hidden=\"true\"></div><div class=\"content\"><div class=\"text\"><p class=\"eyebrow role-label\" hidden><slot name=\"eyebrow\"></slot></p><div class=\"title role-display\"><slot name=\"title\"></slot></div><p class=\"description role-body-lg\" hidden><slot name=\"description\"></slot></p></div><div class=\"action\" hidden><slot name=\"action\"></slot></div></div></div>";
	#e = window.matchMedia("(prefers-reduced-motion: reduce)");
	setup() {
		for (let e of this.shadowRoot.querySelectorAll("slot[name]")) e.addEventListener("slotchange", () => this.update());
		this.#e.addEventListener("change", () => this.#f());
		let e = document.querySelector("arq-preloader[page]");
		this.#r = !!e?.hasAttribute("open"), this.#a();
		let t = document.querySelector("arq-announcement-bar");
		t && new ResizeObserver(() => this.style.setProperty("--announcement-height", `${t.offsetHeight}px`)).observe(t);
	}
	update(e) {
		let t = this.shadowRoot, n = (e) => t.querySelector(`slot[name="${e}"]`).assignedNodes({ flatten: !0 }).some((e) => e.nodeType === Node.ELEMENT_NODE || e.textContent.trim());
		for (let e of gc) t.querySelector(`.${e}`).hidden = !n(e);
		let r = t.querySelector(".title"), i = this.size === "compact" || this.fullHeight;
		r.classList.toggle("role-display", !i), r.classList.toggle("role-display-lg", i);
		let a = t.querySelector(".action"), o = t.querySelector("slot[name=\"action\"]").assignedElements({ flatten: !0 }).find((e) => e.localName === "arq-button"), s = o?.getAttribute("type") || "filled";
		o && s !== "filled" ? a.setAttribute("data-arq-theme", "dark") : a.removeAttribute("data-arq-theme"), this.#f(), fc(t.querySelector("slot[name=\"media\"]").assignedElements()), e?.has("reveal") && this.#o();
	}
	#t = null;
	#n = 0;
	#r = !1;
	#i = null;
	#a() {
		let e = this.shadowRoot.querySelector(".hero"), t = this.fullHeight && !this.#e.matches;
		t && e.classList.add("intro");
		let n = () => {
			this.#r = !1, this.#d(), t && e.classList.add("entered");
		}, r = document.querySelector("arq-preloader[page]");
		if (!r?.hasAttribute("open")) {
			t ? requestAnimationFrame(() => requestAnimationFrame(n)) : n();
			return;
		}
		this.#t = new MutationObserver(() => {
			if (r.hasAttribute("open")) return;
			this.#t.disconnect(), this.#t = null;
			let e = (t) => {
				(!t || t.target === r && t.propertyName === "opacity") && (r.removeEventListener("transitionend", e), window.clearTimeout(this.#n), n());
			};
			r.addEventListener("transitionend", e);
			let t = Number.parseFloat(getComputedStyle(r).transitionDuration) * 1e3 || 0;
			this.#n = window.setTimeout(e, t + 40);
		}), this.#t.observe(r, {
			attributes: !0,
			attributeFilter: ["open"]
		});
	}
	#o() {
		this.#i?.disconnect(), this.#i = null, this.reveal && (this.#i = Ts([this.shadowRoot.querySelector(".content")]));
	}
	disconnectedCallback() {
		this.#t?.disconnect(), this.#t = null, window.clearTimeout(this.#n), this.#i?.disconnect(), this.#i = null;
	}
	#s = /* @__PURE__ */ new WeakSet();
	#c = /* @__PURE__ */ new WeakSet();
	#l() {
		return this.shadowRoot.querySelector("slot[name=\"media\"]").assignedElements().filter((e) => e.localName === "video");
	}
	#u(e) {
		if (this.#c.has(e)) return;
		this.#c.add(e);
		let t = () => {
			this.#r && (e.pause(), e.readyState >= HTMLMediaElement.HAVE_METADATA && e.currentTime !== 0 && (e.currentTime = 0));
		};
		e.addEventListener("play", t), e.addEventListener("loadedmetadata", t), t();
	}
	#d() {
		if (this.#e.matches) {
			this.#f();
			return;
		}
		for (let e of this.#l()) {
			if (e.autoplay && this.#s.add(e), !this.#s.has(e)) continue;
			e.autoplay = !0;
			let t = () => {
				e.readyState >= HTMLMediaElement.HAVE_METADATA && (e.currentTime = 0), e.play().catch(() => {});
			};
			e.readyState >= HTMLMediaElement.HAVE_METADATA ? t() : e.addEventListener("loadedmetadata", t, { once: !0 });
		}
	}
	#f() {
		for (let e of this.#l()) if (e.autoplay && this.#s.add(e), this.#s.has(e)) {
			if (this.#r) {
				e.autoplay = !1, e.pause(), this.#u(e);
				continue;
			}
			if (this.#e.matches) {
				if (!e.autoplay && e.paused) continue;
				e.autoplay = !1, e.pause(), e.load();
			} else e.autoplay || (e.autoplay = !0, e.play().catch(() => {}));
		}
	}
}).define();
//#endregion
//#region src/components/cta-block/cta-block.css?inline
var _c = ":host{isolation:isolate;min-width:0;display:block}.block{justify-content:space-between;align-items:center;gap:var(--arq-space-gap-xl);padding:var(--arq-space-section-md) var(--page-gutter);background:var(--arq-color-surface-subtle);display:flex}.text{gap:var(--arq-space-gap-sm-md);flex-direction:column;min-width:0;display:flex}.title{color:var(--arq-color-text-primary);overflow-wrap:break-word}.description{max-width:var(--arq-layout-measure-wide);color:var(--arq-color-text-secondary);overflow-wrap:break-word;margin:0}.action{align-items:center;gap:var(--arq-space-gap-md);flex-wrap:wrap;flex:none;display:flex;position:relative}.message{flex:1 0 100%}.message:empty{position:absolute}.email{width:var(--arq-layout-measure)}::slotted(arq-input){width:100%;display:block}:host(.has-media) .block{column-gap:var(--arq-space-gap-6xl);aspect-ratio:1440/564;padding:var(--arq-space-section-lg) var(--arq-space-padding-4xl);background:var(--arq-color-surface-inverse);grid-template-columns:1fr 1fr;align-content:center;justify-items:start;display:grid;position:relative;overflow:hidden}:host(.has-media) .media{position:absolute;inset:0}:host(.has-media) ::slotted([slot=media]){object-fit:cover;width:100%!important;height:100%!important;display:block!important}:host(.has-media) .text,:host(.has-media) .action{z-index:1;grid-column:2;position:relative}:host(.has-media) .text{gap:var(--arq-space-gap-lg)}:host(.has-media) .kicker,:host(.has-media) .title,:host(.has-media) .description{color:var(--arq-color-text-inverse)}:host(.has-media) .title{font-weight:var(--arq-font-weight-regular)}:host(.has-media) .kicker{margin:0}:host(.has-media) .action{width:min(100%, var(--arq-layout-measure));justify-content:flex-start;align-items:center;gap:var(--arq-space-gap-md)}:host(.has-media) .email{flex:auto;width:auto}@media (width<=767px){.block{flex-direction:column;align-items:stretch}.description{max-width:none}.action{align-items:stretch;gap:var(--arq-space-gap-xl);flex-direction:column}.message{flex:none}.email{width:auto}::slotted(arq-button){width:100%}:host(.has-media) .block{aspect-ratio:auto;grid-template-columns:1fr;min-height:70svh}:host(.has-media) .text,:host(.has-media) .action{grid-column:1}:host(.has-media) .action{flex-flow:wrap;align-items:center;width:100%}}@media print{:host{display:none}}", vc = "Listo. Te suscribiste al newsletter.";
(class extends L {
	static tag = "arq-cta-block";
	static styles = _c;
	static properties = { type: {
		type: String,
		values: ["button", "newsletter"],
		default: "button"
	} };
	static template = "<div class=\"block\"><div class=\"media\" hidden><slot name=\"media\"></slot></div><div class=\"text\"><p class=\"kicker role-label\" hidden><slot name=\"kicker\"></slot></p><div class=\"title role-heading-2\"><slot name=\"title\"></slot></div><p class=\"description role-body-lg\" hidden><slot name=\"description\"></slot></p></div><div class=\"action\"><div class=\"email\" hidden><slot name=\"email\"></slot></div><slot name=\"action\"></slot><arq-form-message class=\"message\"></arq-form-message></div></div>";
	setup() {
		let e = this.shadowRoot;
		for (let t of [
			"description",
			"kicker",
			"media"
		]) e.querySelector(`slot[name="${t}"]`).addEventListener("slotchange", () => this.update());
		this.addEventListener("click", (e) => {
			this.type === "newsletter" && e.target.closest?.("arq-button") && this.#e();
		}), this.addEventListener("keydown", (e) => {
			if (this.type !== "newsletter" || e.key !== "Enter") return;
			let t = e.target.closest?.("[slot=\"email\"]");
			t && this.contains(t) && (e.preventDefault(), this.#e());
		});
	}
	update() {
		let e = this.shadowRoot, t = (t) => e.querySelector(`slot[name="${t}"]`).assignedNodes({ flatten: !0 }).some((e) => e.nodeType === Node.ELEMENT_NODE || e.textContent.trim());
		e.querySelector(".description").hidden = !t("description"), e.querySelector(".kicker").hidden = !t("kicker");
		let n = e.querySelector("slot[name=\"media\"]").assignedElements({ flatten: !0 }).length > 0;
		e.querySelector(".media").hidden = !n, this.classList.toggle("has-media", n), e.querySelector(".title").classList.toggle("role-display-sm", n), e.querySelector(".title").classList.toggle("role-heading-2", !n), e.querySelector(".description").classList.toggle("role-body", n), e.querySelector(".description").classList.toggle("role-body-lg", !n), e.querySelector(".email").hidden = this.type !== "newsletter";
	}
	#e() {
		let e = this.querySelector("[slot=\"email\"]");
		if (!e) return !1;
		let t = this.shadowRoot.querySelector(".message");
		if (typeof e.reportValidity == "function" && !e.reportValidity()) return t.textContent = "", e.focus?.(), !1;
		let n = e.value;
		return this.emit("submit", { email: n }), e.value = "", t.tone = "success", t.textContent = "", requestAnimationFrame(() => requestAnimationFrame(() => {
			t.textContent = vc;
		})), !0;
	}
}).define();
//#endregion
//#region src/components/category-card/category-card.css?inline
var yc = ":host{min-width:0;display:block}.card{gap:var(--arq-space-gap-lg);flex-direction:column;display:flex}.card-media{aspect-ratio:3/4}.caption{align-items:stretch;gap:var(--arq-space-gap-sm-md);flex-direction:column;display:flex}.title-row{align-items:center;gap:var(--arq-space-gap-sm);display:flex}.description{color:var(--arq-color-text-secondary);overflow-wrap:break-word;margin:0}.name{min-width:0;color:var(--arq-color-text-primary);overflow-wrap:break-word}.icon{width:var(--arq-icon-md);height:var(--arq-icon-md);color:var(--arq-color-icon-primary);flex:none}@media (width>=768px){.card-media{max-height:none}}@media (width<=767px){.card{gap:var(--arq-space-gap-md)}.card-media{aspect-ratio:4/5}}.card-media ::slotted(*){transition:transform var(--arq-motion-duration-slow) var(--arq-motion-easing-standard)!important}@media (hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference){.card:has(.card-link:hover) .card-media ::slotted(*){transform:scale(var(--arq-motion-scale-hover))!important}}.card-media{position:relative}.card.reveal{opacity:0;transform:translateY(var(--arq-space-gap-2xl));transition-property:color,background-color,border-color,outline-color,opacity,transform;transition-duration:var(--arq-motion-duration-fast), var(--arq-motion-duration-fast), var(--arq-motion-duration-fast), var(--arq-motion-duration-fast), calc(var(--arq-motion-duration-slow) * 2), calc(var(--arq-motion-duration-slow) * 2);transition-delay:0s, 0s, 0s, 0s, calc(var(--arq-motion-duration-fast) * var(--reveal-index,0)), calc(var(--arq-motion-duration-fast) * var(--reveal-index,0));transition-timing-function:var(--arq-motion-easing-standard)}.card.reveal.revealed{opacity:1;transform:none}:host([overlay]){height:100%}:host([overlay]) .card{gap:0;height:100%;overflow:hidden}:host([overlay]) .card-media{aspect-ratio:auto;flex:auto;height:100%;min-height:0}:host([overlay]) .card-media:after{content:\"\";z-index:0;pointer-events:none;background:linear-gradient(#0000,#000000b8);height:50%;position:absolute;bottom:0;left:0;right:0}:host([overlay]) .caption{right:var(--arq-space-padding-xl);bottom:var(--arq-space-padding-xl);left:var(--arq-space-padding-xl);z-index:var(--card-above);pointer-events:none;transform:translateY(var(--description-shift,0));transition:transform var(--arq-motion-duration-slow) var(--arq-motion-easing-out);position:absolute}:host([overlay]) .title-row{justify-content:space-between;gap:var(--arq-space-gap-md)}:host([overlay]) .name{min-width:0;color:var(--arq-color-text-inverse);flex:auto}:host([overlay]) .icon{width:var(--arq-icon-xl);height:var(--arq-icon-xl);color:var(--arq-color-icon-inverse)}:host([overlay]) .description{color:var(--arq-color-text-inverse);opacity:0;transition-property:opacity,color,background-color,border-color,outline-color;transition-duration:var(--arq-motion-duration-slow);transition-timing-function:var(--arq-motion-easing-out)}:host([overlay]:focus-within) .caption{transform:none}:host([overlay]:focus-within) .description{opacity:1}@media (hover:hover) and (pointer:fine){:host([overlay]:hover) .caption{transform:none}:host([overlay]:hover) .description{opacity:1}:host([overlay]) .card:has(.card-link:hover) .card-media{outline:none}:host([overlay]) .card-media ::slotted(*){transition:transform var(--arq-motion-duration-slow) var(--arq-motion-easing-standard)!important}@media (prefers-reduced-motion:no-preference){:host([overlay]:hover) .card-media ::slotted(*),:host([overlay]:focus-within) .card-media ::slotted(*){transform:scale(var(--arq-motion-scale-hover))!important}}}@media (width<=767px){:host([overlay]),:host([overlay]) .card{height:auto}:host([overlay]) .card-media{aspect-ratio:3/4;flex:none;height:auto}:host([overlay]) .caption{transform:none}:host([overlay]) .description{opacity:1}}";
(class extends L {
	static tag = "arq-category-card";
	static styles = lo + yc;
	static properties = {
		href: { type: String },
		overlay: { type: Boolean }
	};
	static template = `<div class="card"><div class="card-media"><slot name="image"></slot></div><div class="caption"><div class="title-row"><a class="card-link name role-heading-3"><slot name="name"></slot></a>${R("arrow-right")}</div><p class="description role-body" hidden><span class="description-inner"><slot name="description"></slot></span></p></div></div>`;
	#e = null;
	setup() {
		this.shadowRoot.querySelector("slot[name=\"description\"]").addEventListener("slotchange", () => this.update(/* @__PURE__ */ new Set()));
		let e = this.shadowRoot.querySelector(".caption"), t = this.shadowRoot.querySelector(".title-row");
		if (new ResizeObserver(() => {
			let n = e.offsetHeight - (t.offsetTop + t.offsetHeight);
			e.style.setProperty("--description-shift", `${Math.max(n, 0)}px`);
		}).observe(e), window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		let n = this.shadowRoot.querySelector(".card"), r = [...this.parentElement.children].filter((e) => e.localName === this.localName).indexOf(this);
		n.style.setProperty("--reveal-index", String(Math.max(r, 0))), n.classList.add("reveal"), this.#e = new IntersectionObserver(([e]) => {
			e.isIntersecting && (n.classList.add("revealed"), this.#e.disconnect());
		}, { threshold: .15 }), this.#e.observe(this);
	}
	disconnectedCallback() {
		this.#e?.disconnect();
	}
	update(e) {
		let t = this.shadowRoot;
		if (!e.size || e.has("href")) {
			let e = t.querySelector(".card-link");
			this.href ? e.setAttribute("href", this.href) : e.removeAttribute("href");
		}
		let n = t.querySelector("slot[name=\"description\"]").assignedNodes({ flatten: !0 }).some((e) => e.textContent.trim()), r = t.querySelector(".description");
		r && (r.hidden = !n);
		let i = this.overlay ? "arrow-up-right" : "arrow-right", a = t.querySelector(".title-row .icon");
		a && a.dataset.icon !== i && (a.outerHTML = R(i));
	}
}).define();
//#endregion
//#region src/components/line-card/line-card.css?inline
var bc = ":host{min-width:0;display:block}.card{gap:var(--arq-space-gap-lg);flex-direction:column;display:flex}.card-media{aspect-ratio:5/4}.content{align-items:flex-start;gap:var(--arq-space-gap-md);padding-top:var(--arq-space-padding-sm);flex-direction:column;display:flex}.label,.description{margin:0}.label{color:var(--arq-color-text-tertiary)}.name{max-width:100%;color:var(--arq-color-text-primary);overflow-wrap:break-word}.description{max-width:var(--arq-layout-measure);color:var(--arq-color-text-secondary);overflow-wrap:break-word}.cta{margin-top:calc(var(--arq-space-gap-sm) + var(--arq-space-gap-md))}@media (width>=768px){.card-media{max-height:max(50svh, 100svh - var(--arq-space-section-xl) * 2 - var(--arq-space-gap-6xl))}}@media (width<=767px){.card-media{aspect-ratio:1}.content{gap:var(--arq-space-gap-sm-md);padding-top:0}.description{max-width:none}.cta{margin-top:calc(var(--arq-space-gap-xs) + var(--arq-space-gap-sm-md))}}", xc = ["label", "description"];
(class extends L {
	static tag = "arq-line-card";
	static styles = lo + bc;
	static properties = { href: { type: String } };
	static template = "<div class=\"card\"><div class=\"card-media\"><slot name=\"image\"></slot></div><div class=\"content\"><p class=\"label role-label\" hidden><slot name=\"label\"></slot></p><div class=\"name role-heading-1\"><slot name=\"name\"></slot></div><p class=\"description role-body-lg\" hidden><slot name=\"description\"></slot></p><arq-button class=\"cta\" type=\"underline\" show-underline show-icon icon=\"arrow-right\"><slot name=\"action\">Ver colección</slot></arq-button></div></div>";
	setup() {
		for (let e of xc) this.shadowRoot.querySelector(`slot[name="${e}"]`).addEventListener("slotchange", () => this.update(/* @__PURE__ */ new Set()));
	}
	update(e) {
		let t = this.shadowRoot;
		for (let e of xc) t.querySelector(`.${e}`).hidden = !t.querySelector(`slot[name="${e}"]`).assignedNodes({ flatten: !0 }).some((e) => e.nodeType === Node.ELEMENT_NODE || e.textContent.trim());
		if (e.has("href")) {
			let e = t.querySelector(".cta");
			this.href ? e.setAttribute("href", this.href) : e.removeAttribute("href");
		}
	}
}).define();
//#endregion
//#region src/components/feature-block/feature-block.css?inline
var Sc = ":host{min-width:0;display:block}.block{column-gap:var(--arq-space-gap-6xl);grid-template:\"image content\"\"image secondary\"1fr/50% minmax(0,1fr);align-items:start;display:grid}:host([layout=image-right]) .block{grid-template-columns:minmax(0,1fr) 50%;grid-template-areas:\"content image\"\"secondary image\"}.block:has(.secondary[hidden]){grid-template-areas:\"image content\"\"image content\"}:host([layout=image-right]) .block:has(.secondary[hidden]){grid-template-areas:\"content image\"\"content image\"}:host([size=large]) .block{grid-template-columns:62% minmax(0,1fr)}:host([size=large][layout=image-right]) .block{grid-template-columns:minmax(0,1fr) 62%}:host([size=medium]) .block{grid-template-columns:44% minmax(0,1fr)}:host([size=medium][layout=image-right]) .block{grid-template-columns:minmax(0,1fr) 44%}:host([size=small]) .block{grid-template-columns:30% minmax(0,1fr)}:host([size=small][layout=image-right]) .block{grid-template-columns:minmax(0,1fr) 30%}:host([size=medium]) .image{aspect-ratio:4/3}:host([size=small]) .image{aspect-ratio:1}:host([size=medium]),:host([size=small]){margin-bottom:var(--arq-space-gap-4xl)}:host([size]) .content,:host([size][layout=image-right]) .content{gap:var(--arq-space-gap-md);padding-top:0}.media{background:var(--arq-color-surface-subtle);overflow:hidden}.image{aspect-ratio:4/5;grid-area:image}.secondary{aspect-ratio:16/10;margin-top:calc(var(--arq-space-gap-xl) * 2 + var(--arq-space-gap-lg));grid-area:secondary}.media ::slotted(*){object-fit:cover;width:100%!important;max-width:none!important;height:100%!important;display:block!important}.content{align-items:flex-start;gap:var(--arq-space-gap-xl);padding-top:var(--arq-space-padding-xl-2xl);flex-direction:column;grid-area:content;display:flex}:host([layout=image-right]) .content{padding-top:var(--arq-space-padding-6xl)}.label,.description{margin:0}.label{color:var(--arq-color-text-tertiary)}.title{max-width:100%;color:var(--arq-color-text-primary);overflow-wrap:break-word}.description{max-width:var(--arq-layout-measure);color:var(--arq-color-text-secondary);overflow-wrap:break-word}@media (width>=768px){:host(:not([size])) .image,:host([size=large]) .image{width:100%;max-height:max(50svh, 100svh - var(--arq-space-section-xl))}}@media (width<=767px){:host([size=medium]),:host([size=small]){margin-bottom:var(--arq-space-gap-2xl)}.block,:host([layout=image-right]) .block,:host([size]) .block,:host([size][layout=image-right]) .block{row-gap:var(--arq-space-gap-lg);grid-template-rows:none;grid-template-columns:minmax(0,1fr);grid-template-areas:\"image\"\"content\"\"secondary\"}.block:has(.secondary[hidden]){row-gap:var(--arq-space-gap-lg);grid-template-rows:none;grid-template-columns:minmax(0,1fr);grid-template-areas:\"image\"\"content\"\"secondary\"}:host([layout=image-right]) .block:has(.secondary[hidden]){row-gap:var(--arq-space-gap-lg);grid-template-rows:none;grid-template-columns:minmax(0,1fr);grid-template-areas:\"image\"\"content\"\"secondary\"}:host([size]) .block:has(.secondary[hidden]){row-gap:var(--arq-space-gap-lg);grid-template-rows:none;grid-template-columns:minmax(0,1fr);grid-template-areas:\"image\"\"content\"\"secondary\"}.content,:host([layout=image-right]) .content{gap:var(--arq-space-gap-md);padding-top:var(--arq-space-padding-sm)}.secondary{margin-top:0}.description{max-width:none}}", Cc = [
	"label",
	"title",
	"description",
	"action",
	"secondary"
];
(class extends L {
	static tag = "arq-feature-block";
	static styles = G + Sc;
	static properties = {
		layout: {
			type: String,
			values: ["image-left", "image-right"],
			default: "image-left"
		},
		size: {
			type: String,
			values: [
				"large",
				"medium",
				"small"
			]
		},
		reveal: { type: Boolean }
	};
	static template = "<div class=\"block\"><div class=\"media image\"><slot name=\"image\"></slot></div><div class=\"content\"><p class=\"label role-label\" hidden><slot name=\"label\"></slot></p><div class=\"title role-display-sm\"><slot name=\"title\"></slot></div><p class=\"description role-body-lg\" hidden><slot name=\"description\"></slot></p><div class=\"action\" hidden><slot name=\"action\"></slot></div></div><div class=\"media secondary\" hidden><slot name=\"secondary\"></slot></div></div>";
	#e = null;
	setup() {
		for (let e of Cc) this.shadowRoot.querySelector(`slot[name="${e}"]`).addEventListener("slotchange", () => this.update());
	}
	disconnectedCallback() {
		this.#e?.disconnect(), this.#e = null;
	}
	update(e) {
		let t = this.shadowRoot;
		for (let e of Cc) t.querySelector(`.${e}`).hidden = !t.querySelector(`slot[name="${e}"]`).assignedNodes({ flatten: !0 }).some((e) => e.nodeType === Node.ELEMENT_NODE || e.textContent.trim());
		let n = !!this.size, r = t.querySelector(".title");
		r.classList.toggle("role-display-sm", !n), r.classList.toggle("role-heading-3-light", n);
		let i = t.querySelector(".description");
		i.classList.toggle("role-body-lg", !n), i.classList.toggle("role-body", n), e?.has("reveal") && this.#t();
	}
	#t() {
		this.#e?.disconnect();
		let e = this.shadowRoot.querySelector(".block");
		e.classList.remove("reveal", "revealed"), this.#e = this.reveal ? Ts([e]) : null;
	}
}).define();
//#endregion
//#region src/components/section/section.css?inline
var wc = ":host{--section-gap:var(--arq-space-gap-2xl);--section-inline:var(--page-gutter);box-sizing:border-box;min-width:0;padding:0 var(--section-inline) var(--arq-space-section-xl);background:var(--arq-color-surface-default);display:block}:host([padding-top]){padding-top:var(--arq-space-section-md)}:host([background=subtle]){padding-block:var(--arq-space-section-md);background:var(--arq-color-surface-subtle)}:host([background=bone]){background:var(--arq-color-surface-bone)}:host([background=sand]){background:var(--arq-color-surface-sand)}:host([padding=section]){--section-inline:var(--page-gutter);padding:var(--arq-space-section-lg) var(--section-inline)}:host([padding=wide]){--section-inline:var(--arq-space-padding-4xl);padding:var(--arq-space-section-md) var(--section-inline)}:host([layout=split]){--section-inline:var(--page-gutter)}:host([bleed=end]){padding-inline-end:0}.section{gap:var(--section-gap);flex-direction:column;min-width:0;display:flex}.head,.lead,.body,.rail{min-width:0}.rail{display:contents}.action,.mobile-action{align-self:flex-start}@media (width>=768px){.mobile-action{display:none}:host([layout=tools]) .section{column-gap:var(--arq-space-gap-6xl);row-gap:var(--arq-space-gap-2xl);grid-template-columns:minmax(0,1fr) minmax(0,1.22fr);grid-template-areas:\"head head\"\"lead body\";align-items:start;display:grid}:host([layout=tools]) .head{grid-area:head}:host([layout=tools]) .lead{grid-area:lead;justify-self:start;width:90%}:host([layout=tools]) .body{gap:var(--arq-space-gap-sm);grid-area:body;justify-self:end;align-items:flex-start;width:90%;display:flex}}@media (width<=767px){:host{--section-gap:var(--arq-space-gap-xl);overflow-x:clip}:host,:host([padding=section]),:host([padding=wide]){--section-inline:var(--arq-space-padding-sm)}:host([layout=split]){--section-inline:var(--page-gutter)}:host([layout=tools]) .rail{align-items:flex-start;gap:var(--arq-space-gap-sm);overscroll-behavior-x:contain;scroll-snap-type:x mandatory;scrollbar-width:none;margin-inline-end:calc(var(--section-inline,0px) * -1);padding-inline-end:var(--section-inline,0px);display:flex;overflow-x:auto}:host([layout=tools]) .rail::-webkit-scrollbar{display:none}:host([layout=tools]) .lead,:host([layout=tools]) .body{display:contents}:host([layout=tools]) ::slotted(arq-tool-card){scroll-snap-align:start;flex:none;width:80%}}@media (width>=1024px){:host([layout=split]) .section{grid-template-columns:var(--arq-layout-measure) minmax(0, 1fr);column-gap:var(--arq-space-section-md);row-gap:var(--arq-space-gap-lg);grid-template-rows:auto 1fr;grid-template-areas:\"head body\"\"action body\";align-items:start;display:grid}:host([layout=split]) .head{grid-area:head}:host([layout=split]) .body{grid-area:body}:host([layout=split]) .action{grid-area:action}:host([layout=split][padding=wide]) .section{grid-template-columns:var(--arq-layout-measure-wide) minmax(0, 1fr);column-gap:var(--arq-space-gap-6xl)}}.section.reveal{transform:translateY(var(--arq-space-gap-2xl));transition-property:opacity,transform;transition-duration:calc(var(--arq-motion-duration-slow) * 2);transition-timing-function:var(--arq-motion-easing-standard)}.section.reveal:not(.revealed){pointer-events:none}.section.reveal.revealed{opacity:1;animation:none;transform:none}", Tc = [
	"header",
	"lead",
	"action",
	"mobile-action"
];
(class extends L {
	static tag = "arq-section";
	static styles = G + wc;
	static properties = {
		layout: {
			type: String,
			values: [
				"stack",
				"split",
				"tools"
			],
			default: "stack"
		},
		paddingTop: { type: Boolean },
		padding: {
			type: String,
			values: [
				"default",
				"section",
				"wide"
			],
			default: "default"
		},
		bleed: {
			type: String,
			values: ["none", "end"],
			default: "none"
		},
		background: {
			type: String,
			values: [
				"default",
				"subtle",
				"bone",
				"sand"
			],
			default: "default"
		},
		reveal: { type: Boolean }
	};
	static template = "<div class=\"section\"><div class=\"head\" hidden><slot name=\"header\"></slot></div><div class=\"rail\"><div class=\"lead\" hidden><slot name=\"lead\"></slot></div><div class=\"body\"><slot></slot></div></div><div class=\"action\" hidden><slot name=\"action\"></slot></div><div class=\"mobile-action\" hidden><slot name=\"mobile-action\"></slot></div></div>";
	#e = null;
	#t = null;
	#n = 0;
	#r = !1;
	setup() {
		for (let e of Tc) {
			let t = this.shadowRoot.querySelector(`slot[name="${e}"]`), n = () => t.parentElement.hidden = t.assignedElements({ flatten: !0 }).length === 0;
			t.addEventListener("slotchange", n), n();
		}
	}
	disconnectedCallback() {
		this.#a();
	}
	update(e) {
		e.has("reveal") && this.#i();
	}
	#i() {
		this.#a();
		let e = this.shadowRoot.querySelector(".section");
		e.classList.remove("reveal", "revealed"), this.reveal && !window.matchMedia("(prefers-reduced-motion: reduce)").matches && (e.classList.add("reveal"), this.#n = window.scrollY, this.#t = () => {
			let e = window.scrollY;
			this.#r = e < this.#n, this.#n = e;
		}, window.addEventListener("scroll", this.#t, { passive: !0 }), this.#e = new IntersectionObserver(([t]) => {
			this.#r && !t.isIntersecting ? e.classList.remove("revealed") : t.intersectionRatio >= .15 && e.classList.add("revealed");
		}, { threshold: [0, .15] }), this.#e.observe(this));
	}
	#a() {
		this.#e?.disconnect(), this.#e = null, this.#t && window.removeEventListener("scroll", this.#t), this.#t = null;
	}
}).define();
//#endregion
//#region src/components/grid/grid.css?inline
var Ec = ":host{min-width:0;display:block}.grid{--card-min:var(--arq-layout-card-min);grid-template-columns:repeat(var(--columns,1), minmax(0, 1fr));gap:var(--arq-space-gap-lg);align-items:start;display:grid}.grid.auto{grid-template-columns:repeat(auto-fill, minmax(var(--card-min), 1fr));gap:var(--arq-space-gap-2xl) var(--arq-space-gap-lg)}@media (width>=1600px){.grid.auto{--card-min:var(--arq-layout-card-min-wide)}}::slotted(*){min-width:0}:host([layout=editorial]){margin-inline:calc(var(--section-inline,0px) * -1);width:calc(100% + var(--section-inline,0px) * 2)}@media (width>=768px){.grid.editorial{align-items:stretch;gap:var(--arq-space-5);aspect-ratio:1440/614;display:flex}.grid.editorial ::slotted(*){flex:1 1 0;align-self:stretch;min-width:0}:host([stagger]) ::slotted(:nth-child(2n)){margin-top:calc(var(--arq-space-section-xl) + var(--arq-space-section-sm))}}@media (width<=767px){.grid.auto{grid-template-columns:repeat(auto-fill, minmax(min(var(--card-min), (100% - var(--arq-space-gap-md)) / 2), 1fr));gap:var(--arq-space-gap-xl) var(--arq-space-gap-md)}.grid:not(.auto){gap:var(--arq-space-section-md);grid-template-columns:minmax(0,1fr)}:host([mobile=two-columns]) .grid{gap:var(--arq-space-gap-sm-md);grid-template-columns:repeat(2,minmax(0,1fr))}:host([mobile=carousel]){overscroll-behavior-x:contain;scroll-snap-type:x mandatory;scrollbar-width:none;margin-block:calc(var(--arq-space-gap-xs) * -1);margin-inline:calc(var(--arq-space-gap-xs) * -1) calc(var(--arq-layout-gutter) * -1);padding-block:var(--arq-space-gap-xs);padding-inline-start:var(--arq-space-gap-xs);scroll-padding-inline-start:var(--arq-space-gap-xs);overflow-x:auto;container-type:inline-size}:host([mobile=carousel])::-webkit-scrollbar{display:none}:host([mobile=carousel]) .grid{gap:var(--arq-space-gap-sm-md);width:max-content;padding-inline-end:var(--arq-layout-gutter);display:flex}:host([mobile=carousel]) ::slotted(*){width:calc((100cqi - var(--arq-layout-gutter)) * .8);scroll-snap-align:start;flex:none}:host([layout=editorial]){min-width:0;overflow:hidden}:host([layout=editorial]) .grid.editorial{aspect-ratio:auto;align-items:stretch;gap:var(--arq-space-5);overscroll-behavior-x:contain;scroll-snap-type:x mandatory;scrollbar-width:none;width:100%;min-width:0;display:flex;overflow:auto clip}:host([layout=editorial]) .grid.editorial::-webkit-scrollbar{display:none}:host([layout=editorial]) .grid.editorial:after{content:\"\";width:calc(20% - var(--arq-space-5));scroll-snap-align:none;flex:none}:host([layout=editorial]) ::slotted(*){scroll-snap-align:start;flex:none;align-self:stretch;width:80%}}:host([gap=sm]) .grid,:host([gap=sm][mobile=carousel]) .grid{gap:var(--arq-space-gap-sm)}";
(class extends L {
	static tag = "arq-grid";
	static styles = Ec;
	static properties = {
		columns: { type: Number },
		mobile: {
			type: String,
			values: [
				"stack",
				"two-columns",
				"carousel"
			],
			default: "stack"
		},
		gap: {
			type: String,
			values: ["default", "sm"],
			default: "default"
		},
		layout: {
			type: String,
			values: ["default", "editorial"],
			default: "default"
		},
		stagger: { type: Boolean }
	};
	static template = "<div class=\"grid\" part=\"grid\"><slot></slot></div>";
	update() {
		let e = this.shadowRoot.querySelector(".grid"), t = Math.trunc(this.columns), n = this.layout === "editorial";
		!n && t > 0 ? e.style.setProperty("--columns", t) : e.style.removeProperty("--columns"), e.classList.toggle("editorial", n), e.classList.toggle("auto", !n && !(t > 0));
	}
}).define();
//#endregion
//#region src/components/project-mosaic/project-mosaic.css?inline
var Dc = ":host{--mosaic-gap:var(--arq-space-gap-lg);min-width:0;display:block}:host([bleed]){--mosaic-gap:var(--arq-space-5);margin-inline:calc(var(--section-inline,0px) * -1);width:calc(100% + var(--section-inline,0px) * 2)}.mosaic{gap:var(--mosaic-gap);grid-template-rows:1fr 1fr;grid-template-columns:repeat(4,minmax(0,1fr));display:grid}::slotted(img){background:var(--arq-color-surface-subtle);min-width:0;box-sizing:border-box!important;object-fit:cover!important;width:100%!important;max-width:none!important;height:100%!important;display:block!important}::slotted(img:first-child){contain:size;grid-area:1/1/span 2/span 2}::slotted(img:nth-child(2)){contain:size;grid-area:1/3/auto/span 2}::slotted(img:nth-child(3)),::slotted(img:nth-child(4)){aspect-ratio:1;grid-row:2;height:auto!important;max-height:calc((max(50svh, 100svh - var(--arq-space-section-xl) * 2) - var(--mosaic-gap)) / 2)!important}:host([bleed]) ::slotted(img:nth-child(3)),:host([bleed]) ::slotted(img:nth-child(4)){max-height:calc((max(50svh, 100svh - var(--arq-space-section-xl)) - var(--mosaic-gap)) / 2)!important}::slotted(img:nth-child(n+5)){display:none!important}@media (width<=767px){:host(:not([bleed])){--mosaic-gap:var(--arq-space-gap-sm-md)}.mosaic{grid-template-rows:none;grid-template-columns:repeat(2,minmax(0,1fr))}::slotted(img){aspect-ratio:4/5;contain:none;height:auto!important}::slotted(img:first-child){contain:none;grid-area:auto/1/auto/-1}::slotted(img:nth-child(2)),::slotted(img:nth-child(3)){aspect-ratio:4/5;contain:none;grid-area:auto;max-height:none!important}::slotted(img:nth-child(4)){display:none!important}}:host([zoom]) .mosaic>slot:not([name]){display:none}.frame{box-sizing:border-box;background:var(--arq-color-surface-subtle);min-width:0;min-height:0;color:inherit;cursor:zoom-in;border:0;margin:0;padding:0;display:block;position:relative;overflow:hidden}.frame:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}:host([zoom]) .frame[data-index=\"0\"]{contain:size;grid-area:1/1/span 2/span 2;height:100%}:host([zoom]) .frame[data-index=\"1\"]{contain:size;grid-area:1/3/auto/span 2;height:100%}:host([zoom]) .frame[data-index=\"2\"]{grid-area:2/3}:host([zoom]) .frame[data-index=\"3\"]{grid-area:2/4}:host([zoom]) .frame[data-index=\"2\"],:host([zoom]) .frame[data-index=\"3\"]{aspect-ratio:1;height:auto;max-height:calc((max(50svh, 100svh - var(--arq-space-section-xl) * 2) - var(--mosaic-gap)) / 2)}:host([zoom][bleed]) .frame[data-index=\"2\"],:host([zoom][bleed]) .frame[data-index=\"3\"]{max-height:calc((max(50svh, 100svh - var(--arq-space-section-xl)) - var(--mosaic-gap)) / 2)}.frame ::slotted(img){box-sizing:border-box!important;object-fit:cover!important;width:100%!important;max-width:none!important;height:100%!important;transition:transform var(--arq-motion-duration-slow) var(--arq-motion-easing-standard)!important;display:block!important;position:absolute!important;inset:0!important}@media (hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference){.frame:hover ::slotted(img){transform:scale(var(--arq-motion-scale-hover))!important}}.lightbox{box-sizing:border-box;width:100%;max-width:none;height:100%;max-height:none;padding:var(--arq-layout-gutter);background:var(--arq-color-surface-transparent);color:var(--arq-color-text-primary);border:0;margin:0;position:fixed;inset:0;overflow:hidden}.lightbox[open]{gap:var(--arq-space-gap-md);grid-template-rows:auto minmax(0,1fr);display:grid}.lightbox::backdrop{background:var(--arq-color-overlay-scrim-gallery)}.lightbox-bar{justify-content:space-between;align-items:center;gap:var(--arq-space-gap-md);min-width:0;display:flex}.lightbox-count{min-width:0;color:var(--arq-color-text-primary);margin:0}.lightbox-stage{place-items:center;gap:var(--arq-space-gap-md);grid-template-columns:auto minmax(0,1fr) auto;min-width:0;min-height:0;display:grid}.lightbox-image{object-fit:contain;width:100%;min-width:0;height:100%;min-height:0;display:block}.lightbox-prev,.lightbox-next,.lightbox-close{flex:none}@media (width<=767px){:host([zoom]) .frame[data-index=\"0\"]{aspect-ratio:4/5;contain:none;grid-area:auto/1/auto/-1;height:auto}:host([zoom]) .frame[data-index=\"1\"],:host([zoom]) .frame[data-index=\"2\"]{aspect-ratio:4/5;contain:none;grid-area:auto;height:auto;max-height:none}:host([zoom]) .frame[data-index=\"3\"]{display:none!important}}", Oc = 4;
(class extends L {
	static tag = "arq-project-mosaic";
	static styles = Dc;
	static properties = {
		bleed: { type: Boolean },
		zoom: { type: Boolean }
	};
	static template = "<div class=\"mosaic\"><slot></slot>" + Array.from({ length: Oc }, (e, t) => `<button type="button" class="frame" data-index="${t}" hidden><slot name="m${t}"></slot></button>`).join("") + "</div><dialog class=\"lightbox\" data-arq-theme=\"dark\" aria-label=\"Foto ampliada\"><div class=\"lightbox-bar\"><p class=\"lightbox-count role-body\" aria-live=\"polite\"></p><arq-icon-button class=\"lightbox-close\" icon=\"close\" size=\"large\" background=\"subtle\">Cerrar</arq-icon-button></div><div class=\"lightbox-stage\"><arq-icon-button class=\"lightbox-prev\" icon=\"chevron-left\" size=\"large\" background=\"subtle\">Foto anterior</arq-icon-button><img class=\"lightbox-image\" alt=\"\"><arq-icon-button class=\"lightbox-next\" icon=\"chevron-right\" size=\"large\" background=\"subtle\">Foto siguiente</arq-icon-button></div></dialog>";
	#e = 0;
	#t = null;
	setup() {
		let e = this.shadowRoot, t = e.querySelector(".lightbox");
		e.querySelector("slot:not([name])").addEventListener("slotchange", () => this.#r()), e.querySelectorAll(".frame").forEach((e) => {
			e.addEventListener("click", () => this.#i(Number(e.dataset.index)));
		}), z(t), e.querySelector(".lightbox-close").addEventListener("click", () => t.close()), e.querySelector(".lightbox-prev").addEventListener("click", () => this.#a(-1)), e.querySelector(".lightbox-next").addEventListener("click", () => this.#a(1)), t.addEventListener("click", (e) => {
			e.target.closest("img, arq-icon-button, .lightbox-bar") || t.close();
		}), t.addEventListener("cancel", (e) => {
			e.preventDefault(), t.close();
		}), t.addEventListener("close", () => this.#t?.focus()), t.addEventListener("keydown", (e) => {
			e.key === "ArrowLeft" && (e.preventDefault(), this.#a(-1)), e.key === "ArrowRight" && (e.preventDefault(), this.#a(1));
		});
	}
	update() {
		this.#r();
	}
	#n() {
		return [...this.querySelectorAll(":scope > img")].slice(0, Oc);
	}
	#r() {
		let e = this.#n();
		e.forEach((e, t) => {
			let n = `m${t}`;
			this.zoom ? e.getAttribute("slot") !== n && e.setAttribute("slot", n) : e.hasAttribute("slot") && e.removeAttribute("slot");
		}), this.shadowRoot.querySelectorAll(".frame").forEach((t, n) => {
			let r = e[n];
			t.hidden = !this.zoom || !r, r && t.setAttribute("aria-label", `Ampliar: ${r.getAttribute("alt") || "foto"}`);
		});
	}
	#i(e) {
		let t = this.#n()[e];
		if (!t?.getAttribute("src")) return;
		let n = this.#n().filter((e) => e.getAttribute("src"));
		this.#e = n.indexOf(t), this.#t = this.shadowRoot.querySelector(`.frame[data-index="${e}"]`), this.#o();
		let r = this.shadowRoot.querySelector(".lightbox");
		r.open || r.showModal(), this.shadowRoot.querySelector(".lightbox-close").focus();
	}
	#a(e) {
		let t = this.#n().filter((e) => e.getAttribute("src"));
		t.length < 2 || (this.#e = (this.#e + e + t.length) % t.length, this.#o());
	}
	#o() {
		let e = this.#n().filter((e) => e.getAttribute("src")), t = e[this.#e];
		if (!t) return;
		let n = this.shadowRoot, r = n.querySelector(".lightbox-image");
		r.src = t.getAttribute("src"), r.alt = t.getAttribute("alt") || "";
		let i = String(this.#e + 1).padStart(2, "0"), a = String(e.length).padStart(2, "0");
		n.querySelector(".lightbox-count").textContent = `${i} / ${a}`, n.querySelector(".lightbox-prev").hidden = e.length < 2, n.querySelector(".lightbox-next").hidden = e.length < 2;
	}
}).define();
//#endregion
//#region src/components/text-block/text-block.css?inline
var kc = ":host{min-width:0;display:block}.block{align-items:flex-start;gap:var(--arq-space-gap-lg);flex-direction:column;min-width:0;display:flex}.kicker,.title,.description{overflow-wrap:break-word;margin:0}.kicker,.description{color:var(--arq-color-text-secondary)}.description{max-width:var(--arq-layout-measure)}.title{color:var(--arq-color-text-primary);font-weight:var(--arq-font-weight-regular)}.arrow{width:var(--arq-space-32);height:var(--arq-space-32);color:var(--arq-color-icon-primary);justify-content:center;align-items:center;text-decoration:none;display:flex}.arrow .icon{width:var(--arq-icon-xl);height:var(--arq-icon-xl)}.arrow:focus{outline:none}.arrow:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}", Ac = [
	"kicker",
	"title",
	"description"
];
(class extends L {
	static tag = "arq-text-block";
	static styles = kc;
	static properties = { href: { type: String } };
	static template = `<div class="block"><p class="kicker role-label" hidden><slot name="kicker"></slot></p><div class="title role-display-sm"><slot name="title"></slot></div><p class="description role-body" hidden><slot name="description"></slot></p><a class="arrow" hidden>${R("arrow-right")}<span class="visually-hidden"><slot name="link"></slot></span></a></div>`;
	setup() {
		for (let e of Ac) this.shadowRoot.querySelector(`slot[name="${e}"]`).addEventListener("slotchange", () => this.update());
	}
	update() {
		let e = this.shadowRoot, t = (t) => e.querySelector(`slot[name="${t}"]`).assignedNodes({ flatten: !0 }).some((e) => e.textContent.trim());
		for (let n of Ac) e.querySelector(`.${n}`).hidden = !t(n);
		let n = e.querySelector(".arrow");
		this.href ? (n.hidden = !1, n.href = this.href) : (n.hidden = !0, n.removeAttribute("href"));
	}
}).define();
//#endregion
//#region src/components/collection-tile/collection-tile.css?inline
var jc = ":host{min-width:0;height:100%;min-height:0;display:block}:host(.reveal:not(.revealed)){opacity:0}:host(.reveal.revealed){animation:arq-reveal calc(var(--arq-motion-duration-slow) * 2) var(--arq-motion-easing-standard) backwards;animation-delay:calc(var(--arq-motion-duration-fast) * var(--reveal-index,0))}.card{background:var(--arq-color-surface-inverse);height:100%;color:var(--arq-color-text-inverse);overflow:hidden}.card-media{position:absolute;inset:0}::slotted([slot=image]){object-fit:cover;width:100%!important;max-width:none!important;height:100%!important;transition:transform var(--arq-motion-duration-slow) var(--arq-motion-easing-standard)!important;display:block!important}.scrim{pointer-events:none;background:linear-gradient(#0000,#000000c7);height:50%;position:absolute;bottom:0;left:0;right:0}.tag{top:var(--arq-space-padding-lg);left:var(--arq-space-padding-lg);z-index:var(--card-above);padding:var(--arq-space-padding-xs) var(--arq-space-padding-sm);border:var(--arq-border-default) solid var(--arq-color-border-default);background:var(--arq-color-surface-default);color:var(--arq-color-text-secondary);position:absolute}.info{right:var(--arq-space-padding-xl);bottom:var(--arq-space-padding-xl);left:var(--arq-space-padding-xl);z-index:var(--card-above);gap:var(--arq-space-gap-sm-md);transform:translateY(var(--description-shift,0));transition:transform var(--arq-motion-duration-slow) var(--arq-motion-easing-out);flex-direction:column;display:flex;position:absolute}.title-row{justify-content:space-between;align-items:center;gap:var(--arq-space-gap-md);display:flex}.label,.name,.description{margin:0}.label{opacity:.8}.name{min-width:0;color:var(--arq-color-text-inverse);flex:auto}.icon{width:var(--arq-icon-xl);height:var(--arq-icon-xl);color:var(--arq-color-icon-inverse);pointer-events:none;flex:none}.description{color:var(--arq-color-text-inverse);opacity:0;transition-property:opacity,color,background-color,border-color,outline-color;transition-duration:var(--arq-motion-duration-slow);transition-timing-function:var(--arq-motion-easing-out)}:host(:focus-within) .info{transform:none}:host(:focus-within) .description{opacity:1}@media (hover:hover) and (pointer:fine){:host(:hover) .info{transform:none}:host(:hover) .description{opacity:1}.card:has(.card-link:hover) .card-media{outline:none}@media (prefers-reduced-motion:no-preference){:host(:hover) ::slotted([slot=image]),:host(:focus-within) ::slotted([slot=image]){transform:scale(var(--arq-motion-scale-hover))!important}}}@media (width<=767px){.info{transform:none}.description{opacity:1}}";
(class extends L {
	static tag = "arq-collection-tile";
	static styles = lo + G + jc;
	static properties = {
		href: { type: String },
		featured: { type: Boolean }
	};
	static template = `<div class="card"><div class="card-media"><slot name="image"></slot></div><span class="scrim" aria-hidden="true"></span><span class="tag role-body-sm" hidden><slot name="tag">Destacada</slot></span><div class="info"><p class="label role-label"><slot name="label"></slot></p><div class="title-row"><a class="card-link name role-heading-2"><slot name="name"></slot></a>${R("arrow-up-right")}</div><p class="description role-body" hidden><span class="description-inner"><slot name="description"></slot></span></p></div></div>`;
	setup() {
		this.shadowRoot.querySelector("slot[name=\"label\"]").addEventListener("slotchange", () => this.update(/* @__PURE__ */ new Set())), this.shadowRoot.querySelector("slot[name=\"description\"]").addEventListener("slotchange", () => this.update(/* @__PURE__ */ new Set()));
		let e = this.shadowRoot.querySelector(".info"), t = this.shadowRoot.querySelector(".title-row");
		new ResizeObserver(() => {
			let n = e.offsetHeight - (t.offsetTop + t.offsetHeight);
			e.style.setProperty("--description-shift", `${Math.max(n, 0)}px`);
		}).observe(e);
	}
	update() {
		let e = this.shadowRoot, t = e.querySelector(".card-link");
		this.href ? t.href = this.href : t.removeAttribute("href"), e.querySelector(".tag").hidden = !this.featured;
		let n = e.querySelector("slot[name=\"label\"]").assignedNodes({ flatten: !0 }).some((e) => e.textContent.trim());
		e.querySelector(".label").hidden = !n;
		let r = e.querySelector("slot[name=\"description\"]").assignedNodes({ flatten: !0 }).some((e) => e.textContent.trim()), i = e.querySelector(".description");
		i && (i.hidden = !r);
	}
}).define();
//#endregion
//#region src/components/collection-mosaic/collection-mosaic.css?inline
var Mc = ":host{min-width:0;margin-inline:calc(var(--section-inline,0px) * -1);width:calc(100% + var(--section-inline,0px) * 2);display:block}.mosaic{grid-template-columns:543fr var(--arq-space-5) 470fr var(--arq-space-5) 412fr;grid-template-rows:175fr 384fr var(--arq-space-5) 206fr 198fr 146fr;aspect-ratio:1440/1114;display:grid}slot{display:contents}::slotted(*){min-width:0;height:100%;min-height:0;display:block}::slotted([slot=primary]){grid-area:1/1/5}::slotted([slot=wide]){grid-area:2/3/auto/6}::slotted([slot=stack]:nth-child(3)){grid-area:4/3/6}::slotted([slot=stack]:nth-child(4)){grid-area:4/5/7}@media (width<=767px){.mosaic{gap:var(--arq-space-5);aspect-ratio:auto;flex-direction:column;display:flex}::slotted([slot=primary]),::slotted([slot=wide]),::slotted([slot=stack]:nth-child(3)),::slotted([slot=stack]:nth-child(4)){aspect-ratio:4/5;grid-area:auto;height:auto}}";
(class extends L {
	static tag = "arq-collection-mosaic";
	static styles = Mc;
	static template = "<div class=\"mosaic\"><slot name=\"primary\"></slot><slot name=\"wide\"></slot><slot name=\"stack\"></slot></div>";
	#e = null;
	#t = !1;
	#n = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	setup() {
		let e = [...this.shadowRoot.querySelectorAll("slot")], t = () => e.flatMap((e) => e.assignedElements()), n = () => {
			let e = t();
			if (e.forEach((e, t) => {
				e.style.setProperty("--reveal-index", String(t)), this.#n || e.classList.add("reveal");
			}), this.#t) for (let t of e) t.classList.add("revealed");
		};
		for (let t of e) t.addEventListener("slotchange", n);
		n(), !this.#n && (this.#e = new IntersectionObserver((e) => {
			if (e.some((e) => e.isIntersecting)) {
				this.#t = !0;
				for (let e of t()) e.classList.add("revealed");
				this.#e.disconnect();
			}
		}, { threshold: .15 }), this.#e.observe(this));
	}
	disconnectedCallback() {
		this.#e?.disconnect();
	}
}).define();
//#endregion
//#region src/components/collection-index/collection-index.css?inline
var Nc = ":host{isolation:isolate;min-width:0;display:block}.layout{align-items:center;gap:var(--arq-space-gap-4xl);grid-template-columns:minmax(0,1fr) minmax(0,1fr);min-width:0;display:grid}.names{align-items:flex-start;gap:var(--arq-space-gap-2xl);flex-direction:column;min-width:0;display:flex}.list{width:100%;min-width:0}::slotted(a){box-sizing:border-box;width:100%;padding-block:var(--arq-space-padding-sm);border-block:var(--arq-border-strong) solid transparent;color:var(--arq-color-text-tertiary);font:inherit;letter-spacing:inherit;overflow-wrap:break-word;transition-property:color,border-color;transition-duration:var(--arq-motion-duration-fast);transition-timing-function:var(--arq-motion-easing-standard);margin:0;display:block;text-decoration:none!important}::slotted(a:hover),::slotted(a:focus),::slotted(a:active){text-decoration:none!important}::slotted(a[aria-current=true]){color:var(--arq-color-text-primary);border-block-color:var(--arq-color-border-strong)}::slotted(a:focus-visible){outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.stage{aspect-ratio:5/4;background:var(--arq-color-surface-subtle);min-width:0;position:relative;overflow:hidden}.photo{object-fit:cover;object-position:center;opacity:0;width:100%;height:100%;transition:opacity 0s linear var(--arq-motion-duration-slow);position:absolute;inset:0}.photo[data-focus=top]{object-position:center top}.photo[data-focus=bottom]{object-position:center bottom}.photo.is-shown{z-index:1;opacity:1;transition:opacity var(--arq-motion-duration-slow) var(--arq-motion-easing-standard)}@media (width<=767px){.layout{gap:var(--arq-space-gap-xl);grid-template-columns:minmax(0,1fr)}.stage{order:-1}}@media (prefers-reduced-motion:reduce){.photo{transition:none}}";
(class extends L {
	static tag = "arq-collection-index";
	static styles = Nc;
	static template = "<div class=\"layout\"><div class=\"names\"><nav class=\"list role-display-sm\" aria-label=\"Colecciones\"><slot></slot></nav><div class=\"action\"><slot name=\"action\"></slot></div></div><div class=\"stage\"><img class=\"photo is-shown\" alt=\"\"><img class=\"photo\" alt=\"\"></div></div>";
	#e = null;
	#t = "mouse";
	#n = window.matchMedia("(prefers-reduced-motion: reduce)");
	setup() {
		this.shadowRoot.querySelector("slot:not([name])").addEventListener("slotchange", () => this.#o()), this.addEventListener("pointerdown", (e) => {
			this.#t = e.pointerType;
		}), this.addEventListener("pointerover", (e) => {
			if (e.pointerType !== "mouse") return;
			let t = this.#a(e.target);
			t && this.#s(t);
		}), this.addEventListener("focusin", (e) => {
			let t = this.#a(e.target);
			t && this.#s(t);
		}), this.addEventListener("click", (e) => {
			if (this.#t === "mouse") return;
			let t = this.#a(e.target);
			t && t !== this.#e && (e.preventDefault(), this.#s(t));
		}), this.#o(), this.#r();
	}
	async #r() {
		let e = [];
		try {
			e = await nn();
		} catch (e) {
			console.error("[arq] collection-index: no se pudieron cargar las familias", e);
			return;
		}
		let t = e.map((e) => {
			let t = document.createElement("a");
			if (t.href = e.href, e.image) {
				let n = document.createElement("img");
				n.src = e.image, n.alt = "", n.loading = "lazy", e.focus && (n.dataset.focus = e.focus), t.append(n);
			}
			return t.append(document.createTextNode(e.name)), t;
		}), n = this.querySelector(":scope > [slot=\"action\"]");
		for (let e of [...this.querySelectorAll(":scope > a")]) e.remove();
		n ? n.before(...t) : this.append(...t);
	}
	#i() {
		return [...this.querySelectorAll(":scope > a[href]")];
	}
	#a(e) {
		let t = e instanceof Element ? e.closest("a[href]") : null;
		return t && this.#i().includes(t) ? t : null;
	}
	#o() {
		for (let e of this.#i()) {
			let t = e.querySelector("img");
			t && (t.hidden = !0);
		}
		let e = this.#i();
		(!this.#e || !e.includes(this.#e)) && this.#s(e[0], !0);
	}
	#s(e, t = !1) {
		if (!e) return;
		for (let e of this.#i()) e.removeAttribute("aria-current");
		e.setAttribute("aria-current", "true"), this.#e = e;
		let n = e.querySelector("img"), r = n?.getAttribute("src") || "", i = n?.getAttribute("alt") || e.textContent.trim(), a = n?.dataset.focus || "";
		r && this.#l(r, i, a, t || this.#n.matches);
	}
	#c(e, t) {
		t ? e.dataset.focus = t : delete e.dataset.focus;
	}
	#l(e, t, n, r) {
		let i = [...this.shadowRoot.querySelectorAll(".photo")], a = i.find((e) => e.classList.contains("is-shown")) ?? i[0], o = i.find((e) => e !== a);
		if (a.getAttribute("src") === e) {
			a.alt = t, this.#c(a, n);
			return;
		}
		if (r || !o) {
			a.src = e, a.alt = t, this.#c(a, n), a.classList.add("is-shown"), o?.classList.remove("is-shown");
			return;
		}
		o.src = e, o.alt = t, this.#c(o, n), o.classList.add("is-shown"), a.classList.remove("is-shown");
	}
}).define();
//#endregion
//#region src/components/tool-card/tool-card.css?inline
var Pc = ":host{min-width:0;color:var(--arq-color-text-primary);flex:1 1 0;display:block}.card{gap:var(--arq-space-gap-md);color:inherit;flex-direction:column;text-decoration:none;display:flex}.card:focus{outline:none}.card:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.media{aspect-ratio:311/332;background:var(--arq-color-surface-strong);justify-content:center;align-items:center;display:flex;overflow:hidden}:host([size=large]) .media{aspect-ratio:520/578}::slotted([slot=image]){object-fit:cover;width:100%!important;height:100%!important;transition:transform var(--arq-motion-duration-slow) var(--arq-motion-easing-standard)!important;display:block!important}@media (hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference){.card:hover ::slotted([slot=image]){transform:scale(var(--arq-motion-scale-hover))!important}}@media (prefers-reduced-motion:no-preference){.card:focus-visible ::slotted([slot=image]){transform:scale(var(--arq-motion-scale-hover))!important}}.placeholder{padding:var(--arq-space-padding-md);color:var(--arq-color-text-tertiary);text-align:center}.caption{gap:var(--arq-space-gap-xs);flex-direction:column;min-width:0;display:flex}.title-row{justify-content:space-between;align-items:center;gap:var(--arq-space-gap-sm);display:flex}.title,.subtitle{overflow-wrap:break-word;min-width:0}.subtitle{color:var(--arq-color-text-secondary)}.icon{width:var(--arq-icon-lg);height:var(--arq-icon-lg);color:var(--arq-color-icon-primary);flex:none}:host([type=index]) .card{align-items:center;column-gap:var(--arq-space-gap-xl);row-gap:var(--arq-space-gap-xs);padding-block:var(--arq-space-padding-lg);border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle);grid-template-columns:auto minmax(0,1fr) auto;grid-template-areas:\"index title icon\"\"index subtitle icon\";display:grid}:host([type=index]) .index{color:var(--arq-color-text-tertiary);grid-area:index}:host([type=index]) .caption,:host([type=index]) .title-row{display:contents}:host([type=index]) .title{grid-area:title}:host([type=index]) .subtitle{color:var(--arq-color-text-secondary);grid-area:subtitle}:host([type=index]) .icon{transition:transform var(--arq-motion-duration-base) var(--arq-motion-easing-standard);grid-area:icon}@media (hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference){:host([type=index]) .card:hover .icon{transform:translate(var(--arq-space-gap-xs), calc(var(--arq-space-gap-xs) * -1))}}@media (width<=767px){:host([type=index]) .card{column-gap:var(--arq-space-gap-lg)}}";
(class extends L {
	static tag = "arq-tool-card";
	static styles = Pc;
	static properties = {
		href: { type: String },
		target: { type: String },
		size: {
			type: String,
			values: ["large", "small"],
			default: "small"
		},
		type: {
			type: String,
			values: ["media", "index"],
			default: "media"
		}
	};
	static template = `<a class="card"><span class="index role-label" hidden><slot name="index"></slot></span><span class="media"><slot name="image"></slot><span class="placeholder role-caption"><slot name="placeholder"></slot></span></span><span class="caption"><span class="title-row"><span class="title"><slot name="title"></slot></span>${R("arrow-up-right")}</span><span class="subtitle"><slot name="subtitle"></slot></span></span></a>`;
	setup() {
		this.shadowRoot.querySelector("slot[name=\"image\"]").addEventListener("slotchange", () => this.update());
	}
	update() {
		let e = this.shadowRoot, t = e.querySelector(".card");
		this.href ? t.href = this.href : t.removeAttribute("href"), this.target ? t.setAttribute("target", this.target) : t.removeAttribute("target"), this.target === "_blank" ? t.setAttribute("rel", "noopener") : t.removeAttribute("rel");
		let n = this.type === "index";
		e.querySelector(".media").hidden = n, e.querySelector(".index").hidden = !n, e.querySelector(".title").className = `title ${n ? "role-heading-3-light" : "role-body-medium"}`, e.querySelector(".subtitle").className = `subtitle ${n ? "role-body" : "role-caption"}`;
		let r = e.querySelector("slot[name=\"image\"]").assignedElements({ flatten: !0 }).length > 0;
		e.querySelector(".placeholder").hidden = r;
	}
}).define();
//#endregion
//#region src/components/project-slide/project-slide.css?inline
var Fc = ":host{background:var(--arq-color-surface-subtle);width:calc(var(--arq-layout-measure) * 3 / 4);aspect-ratio:3/4;cursor:grab;flex:none;display:block;overflow:hidden}:host([active]){width:var(--arq-layout-measure);aspect-ratio:4/5}.slide{width:100%;height:100%;position:relative}.slide ::slotted(*){object-fit:cover;-webkit-user-select:none;user-select:none;-webkit-user-drag:none;width:100%!important;max-width:none!important;height:100%!important;display:block!important}.veil{background:var(--arq-color-surface-default);opacity:var(--arq-opacity-muted);pointer-events:none;transition-property:opacity,color,background-color,border-color,outline-color;transition-duration:var(--arq-motion-duration-slow);transition-timing-function:var(--arq-motion-easing-standard);position:absolute;inset:0}:host([active]) .veil{opacity:0}:host([data-instant]) .veil{transition:none}:host([data-dragging]){cursor:grabbing}:host(:focus-visible){outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}";
(class extends L {
	static tag = "arq-project-slide";
	static styles = Fc;
	static properties = { active: { type: Boolean } };
	static template = "<div class=\"slide\"><slot name=\"image\"></slot><span class=\"veil\" aria-hidden=\"true\"></span></div>";
}).define();
//#endregion
//#region src/components/project-slider/project-slider.css?inline
var Ic = ":host{min-width:0;display:block}.slider{gap:var(--arq-space-gap-3xl);flex-direction:column;min-width:0;display:flex}.rail{height:calc(var(--arq-layout-measure) * 5 / 4);margin-inline:calc(var(--section-inline,var(--arq-space-padding-4xl)) * -1);width:calc(100% + var(--section-inline,var(--arq-space-padding-4xl)) * 2);cursor:grab;-webkit-user-select:none;user-select:none;touch-action:pan-y;overflow:hidden}.rail[data-dragging]{cursor:grabbing}.track{align-items:center;gap:var(--arq-space-gap-sm);width:max-content;height:100%;transition:transform var(--arq-motion-duration-slow) var(--arq-motion-easing-standard);display:flex}.before,.after,.track>slot{display:contents}::slotted(arq-project-slide){flex:none}.caption{justify-content:space-between;align-items:flex-end;gap:var(--arq-space-gap-lg);min-width:0;display:flex}.info{flex:0 1 var(--arq-layout-measure);max-width:var(--arq-layout-measure);color:var(--arq-color-text-primary);overflow-wrap:break-word;margin:0}.controls{flex:none}@media (width<=767px){.caption{flex-direction:column;align-items:flex-start}.info{flex-basis:auto;max-width:none}.controls{display:none}}@media (prefers-reduced-motion:reduce){.track{transition:none}}", Lc = ".lightbox{box-sizing:border-box;width:100%;max-width:none;height:100%;max-height:none;padding:var(--arq-layout-gutter);background:var(--arq-color-surface-transparent);color:var(--arq-color-text-primary);border:0;margin:0;position:fixed;inset:0;overflow:hidden}.lightbox[open]{gap:var(--arq-space-gap-md);grid-template-rows:auto minmax(0,1fr);display:grid}.lightbox::backdrop{background:var(--arq-color-overlay-scrim-gallery)}.lightbox-bar{justify-content:space-between;align-items:center;gap:var(--arq-space-gap-md);min-width:0;display:flex}.lightbox-count{min-width:0;color:var(--arq-color-text-primary);margin:0}.lightbox-stage{place-items:center;gap:var(--arq-space-gap-md);grid-template-columns:auto minmax(0,1fr) auto;min-width:0;min-height:0;display:grid}.lightbox-image{object-fit:contain;width:100%;min-width:0;height:100%;min-height:0;display:block}.lightbox-prev,.lightbox-next,.lightbox-close{flex:none}.lightbox.is-single .lightbox-stage{grid-template-columns:minmax(0,1fr)}.lightbox.is-single .lightbox-prev,.lightbox.is-single .lightbox-next{display:none}.lightbox.is-original .lightbox-image{width:auto;max-width:min(100%,70vw);height:auto;max-height:min(100%,70svh)}.lightbox,.lightbox::backdrop{transition:opacity var(--arq-motion-duration-base) var(--arq-motion-easing-out)}.lightbox-image{transition:scale var(--arq-motion-duration-base) var(--arq-motion-easing-out)}@starting-style{.lightbox[open],.lightbox[open]::backdrop{opacity:0}.lightbox[open] .lightbox-image{scale:var(--arq-motion-scale-enter)}}.lightbox.is-original,.lightbox.is-original::backdrop{transition-duration:var(--arq-motion-duration-panel);transition-timing-function:var(--arq-motion-easing-standard)}.lightbox.is-original .lightbox-image{transition-duration:var(--arq-motion-duration-panel)}.lightbox.is-original::backdrop{background:var(--arq-color-overlay-scrim)}@media (prefers-reduced-motion:reduce){.lightbox,.lightbox::backdrop,.lightbox.is-original,.lightbox.is-original::backdrop{transition-duration:var(--arq-motion-duration-fade)}.lightbox.is-original .lightbox-image{transition-duration:0s}}", Rc = 2400, zc = "<dialog class=\"lightbox\" data-arq-theme=\"dark\" aria-label=\"Galería ampliada\"><div class=\"lightbox-bar\"><p class=\"lightbox-count role-body\" aria-live=\"polite\"></p><arq-icon-button class=\"lightbox-close\" icon=\"close\" size=\"large\" background=\"subtle\">Cerrar</arq-icon-button></div><div class=\"lightbox-stage\"><arq-icon-button class=\"lightbox-prev\" icon=\"chevron-left\" size=\"large\" background=\"subtle\">Foto anterior</arq-icon-button><img class=\"lightbox-image\" alt=\"\"><arq-icon-button class=\"lightbox-next\" icon=\"chevron-right\" size=\"large\" background=\"subtle\">Foto siguiente</arq-icon-button></div></dialog>", Bc = class {
	#e;
	#t;
	#n = null;
	#r = 0;
	#i;
	#a;
	constructor(e, t, n = () => {}) {
		this.#e = e.querySelector(".lightbox"), this.#t = t, this.#a = n;
		let r = this.#e;
		z(r), r.querySelector(".lightbox-close").addEventListener("click", () => r.close()), r.querySelector(".lightbox-prev").addEventListener("click", () => this.#s(-1)), r.querySelector(".lightbox-next").addEventListener("click", () => this.#s(1)), r.addEventListener("click", (e) => {
			e.target.closest("img, arq-icon-button, .lightbox-bar") || r.close();
		}), r.addEventListener("keydown", (e) => {
			["ArrowLeft", "ArrowRight"].includes(e.key) && (e.preventDefault(), e.stopPropagation(), this.#s(e.key === "ArrowLeft" ? -1 : 1));
		}), r.addEventListener("close", () => {
			this.#a(!1), this.#i?.focus({ preventScroll: !0 });
		});
	}
	open(e, t, n = null) {
		this.#n = n, this.#o()[e]?.src && (this.#r = e, this.#i = t, this.#c(), this.#a(!0), this.#e.showModal(), this.#e.querySelector(".lightbox-close").focus());
	}
	close() {
		this.#e.open && this.#e.close();
	}
	#o() {
		return this.#n ?? this.#t();
	}
	#s(e) {
		let t = this.#o();
		t.length < 2 || (this.#r = (this.#r + e + t.length) % t.length, this.#c());
	}
	#c() {
		let e = this.#o(), t = e[this.#r];
		if (!t) return;
		let n = this.#e.querySelector("img");
		n.src = t.original ? t.src : be(t.src, Rc), n.alt = t.alt, this.#e.classList.toggle("is-original", !!t.original), this.#e.classList.toggle("is-single", e.length < 2), this.#e.querySelector(".lightbox-count").textContent = e.length < 2 ? "" : `${String(this.#r + 1).padStart(2, "0")} / ${String(e.length).padStart(2, "0")}`;
		for (let t of this.#e.querySelectorAll(".lightbox-prev, .lightbox-next")) t.hidden = e.length < 2;
	}
}, Vc = 3e3, Hc = 6, Uc = .4, Wc = 100;
(class extends L {
	static tag = "arq-project-slider";
	static styles = Ic + Lc;
	static properties = { autoplay: { type: Boolean } };
	static template = "<div class=\"slider\"><div class=\"rail\"><div class=\"track\"><div class=\"before\"></div><slot></slot><div class=\"after\"></div></div></div><div class=\"caption\"><p class=\"info role-body\"><slot name=\"caption\"></slot></p><arq-carousel-controls class=\"controls\" buttons=\"carousel\" label-prev=\"Proyecto anterior\" label-next=\"Proyecto siguiente\"></arq-carousel-controls></div></div>" + zc;
	#e = 0;
	#t = 0;
	#n = !1;
	#r = 0;
	#i = 0;
	#a = null;
	#o = null;
	#s = !1;
	#c = null;
	#l = !1;
	#u = window.matchMedia("(prefers-reduced-motion: reduce)");
	#d = new ResizeObserver(() => this.#O());
	#f = () => this.#V();
	#p = () => this.#V();
	setup() {
		let e = this.shadowRoot, t = e.querySelector("slot:not([name])"), n = e.querySelector(".lightbox");
		this.setAttribute("role", "region"), this.hasAttribute("aria-label") || this.setAttribute("aria-label", "Galería de proyectos"), t.addEventListener("slotchange", () => this.#y()), e.querySelector("slot[name=\"caption\"]").addEventListener("slotchange", () => this.#m()), e.querySelector(".controls").addEventListener("arq:prev", () => this.#b(-1)), e.querySelector(".controls").addEventListener("arq:next", () => this.#b(1)), this.addEventListener("click", (e) => {
			this.#l && (e.preventDefault(), e.stopPropagation());
		}), this.addEventListener("keydown", (e) => {
			if (!n.open && (e.key === "ArrowLeft" && (e.preventDefault(), this.#b(-1)), e.key === "ArrowRight" && (e.preventDefault(), this.#b(1)), (e.key === "Enter" || e.key === " ") && e.composedPath()[0] === this)) {
				e.preventDefault();
				let t = this.#g();
				t[this.#e] && this.#N(t[this.#e]);
			}
		});
		let r = e.querySelector(".rail");
		r.addEventListener("pointerdown", (e) => this.#I(e)), r.addEventListener("pointermove", (e) => this.#L(e)), r.addEventListener("pointerup", (e) => this.#R(e)), r.addEventListener("pointercancel", (e) => this.#R(e)), r.addEventListener("dragstart", (e) => e.preventDefault()), z(n), e.querySelector(".lightbox-close").addEventListener("click", () => n.close()), e.querySelector(".lightbox-prev").addEventListener("click", () => this.#P(-1)), e.querySelector(".lightbox-next").addEventListener("click", () => this.#P(1)), n.addEventListener("click", (e) => {
			e.target.closest("img, arq-icon-button, button, .lightbox-bar") || n.close();
		}), n.addEventListener("cancel", (e) => {
			e.preventDefault(), n.close();
		}), n.addEventListener("close", () => {
			let e = this.#c;
			this.#c = null, e?.focus({ preventScroll: !0 }), this.#V();
		}), this.addEventListener("focusin", () => this.#V()), this.addEventListener("focusout", () => queueMicrotask(() => this.#V())), this.addEventListener("pointerenter", (e) => {
			e.pointerType === "mouse" && (this.#s = !0, this.#V());
		}), this.addEventListener("pointerleave", (e) => {
			e.pointerType === "mouse" && (this.#s = !1, this.#V());
		}), n.addEventListener("keydown", (e) => {
			e.key === "ArrowLeft" && (e.preventDefault(), e.stopPropagation(), this.#P(-1)), e.key === "ArrowRight" && (e.preventDefault(), e.stopPropagation(), this.#P(1));
		}), this.tabIndex = 0, this.#d.observe(r), this.#u.addEventListener("change", this.#f), document.addEventListener("visibilitychange", this.#p), this.#y(), this.#m();
	}
	update(e) {
		e.has("autoplay") && this.#V();
	}
	#m() {
		let e = this.shadowRoot.querySelector("slot[name=\"caption\"]"), t = e.assignedNodes({ flatten: !0 }).some((e) => e.textContent.trim());
		e.parentElement.hidden = !t;
	}
	disconnectedCallback() {
		this.#d.disconnect(), cancelAnimationFrame(this.#r), this.#D(), this.#H(), this.#u.removeEventListener("change", this.#f), document.removeEventListener("visibilitychange", this.#p);
		let e = this.shadowRoot?.querySelector(".lightbox");
		e?.open && e.close();
	}
	#h() {
		return this.shadowRoot.querySelector("slot:not([name])").assignedElements().filter((e) => e.localName === "arq-project-slide");
	}
	#g() {
		let e = this.shadowRoot;
		return [
			...e.querySelector(".before").children,
			...this.#h(),
			...e.querySelector(".after").children
		];
	}
	#_(e) {
		let t = e.cloneNode(!0);
		return t.removeAttribute("active"), t.setAttribute("aria-hidden", "true"), t;
	}
	#v() {
		let e = this.shadowRoot, t = e.querySelector(".before"), n = e.querySelector(".after"), r = this.#h();
		if (t.replaceChildren(), n.replaceChildren(), !(r.length < 2)) for (let e of r) t.append(this.#_(e)), n.append(this.#_(e));
	}
	#y() {
		this.#v();
		let e = this.#h(), t = e.length;
		if (!this.#n && t) {
			let n = e.findIndex((e) => e.active), r = n >= 0 ? n : Math.floor((t - 1) / 2);
			this.#e = t > 1 ? t + r : r, this.#n = !0;
		} else this.#e = t > 1 ? t + (this.#e % t + t) % t : 0;
		this.#C(), this.#T();
		for (let e of this.querySelectorAll("img")) e.draggable = !1;
		this.#V();
	}
	#b(e) {
		if (!this.#o && !(this.#h().length < 2)) {
			if (this.#x() && this.#S(), this.#e += e, this.#u.matches) {
				this.#S(), this.#V();
				return;
			}
			this.#C(), this.#w(), this.#x() && this.#E(), this.#V();
		}
	}
	#x() {
		let e = this.#h().length;
		return e > 1 && (this.#e < e || this.#e >= e * 2);
	}
	#S() {
		let e = this.#h().length;
		e > 1 && (this.#e = e + (this.#e % e + e) % e), this.#C(), this.#T();
	}
	#C() {
		let e = this.#g(), t = this.#h().length;
		e.forEach((e, t) => {
			e.active = t === this.#e;
		});
		let n = this.shadowRoot.querySelector(".controls"), r = t ? (this.#e % t + t) % t : 0;
		n.hidden = t < 2, n.count = Math.max(t, 1), n.index = r, n.position = t > 1 ? "middle" : "start";
	}
	#w() {
		cancelAnimationFrame(this.#r), this.#r = requestAnimationFrame(() => this.#O());
	}
	#T() {
		let e = this.shadowRoot.querySelector(".track");
		cancelAnimationFrame(this.#r), this.#D();
		for (let e of this.#g()) e.setAttribute("data-instant", "");
		e.style.transition = "none", this.#O(), e.getBoundingClientRect(), e.style.transition = "", requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				for (let e of this.#g()) e.removeAttribute("data-instant");
			});
		});
	}
	#E() {
		let e = this.shadowRoot.querySelector(".track");
		this.#D(), this.#a = (t) => {
			t.target === e && t.propertyName === "transform" && (this.#D(), this.#S());
		}, e.addEventListener("transitionend", this.#a);
	}
	#D() {
		let e = this.shadowRoot.querySelector(".track");
		this.#a && e && (e.removeEventListener("transitionend", this.#a), this.#a = null);
	}
	#O() {
		if (this.#o?.moved) return;
		let e = this.#k();
		e.slides[this.#e] && e.rail.clientWidth && (e.track.style.transform = `translateX(${this.#A(this.#e, e)}px)`);
	}
	#k() {
		let e = this.shadowRoot, t = e.querySelector(".rail"), n = e.querySelector(".track");
		return {
			rail: t,
			track: n,
			slides: this.#g(),
			gap: Number.parseFloat(getComputedStyle(n).columnGap || getComputedStyle(n).gap) || 0
		};
	}
	#A(e, t = this.#k()) {
		let { rail: n, slides: r, gap: i } = t, a = r[e];
		if (!a || !n.clientWidth) return 0;
		let o = 0;
		for (let t = 0; t < e; t += 1) o += r[t].offsetWidth + i;
		return n.clientWidth / 2 - o - a.offsetWidth / 2;
	}
	#j(e) {
		let t = this.#k(), n = this.#e, r = Infinity;
		for (let i = 0; i < t.slides.length; i += 1) {
			let a = Math.abs(this.#A(i, t) - e);
			a < r && (r = a, n = i);
		}
		return n;
	}
	#M() {
		return this.#h().map((e) => {
			let t = e.querySelector("[slot=\"image\"]");
			return {
				src: t?.getAttribute("src") || "",
				alt: t?.getAttribute("alt") || ""
			};
		});
	}
	#N(e) {
		let t = this.#g().indexOf(e), n = this.#h().length;
		if (t < 0 || !n) return;
		let r = (t % n + n) % n;
		if (!this.#M()[r]?.src) return;
		this.#e = t, this.#S(), this.#t = r, this.#F();
		let i = this.shadowRoot.querySelector(".lightbox");
		i.open || (this.#c = this, i.showModal()), this.#V();
	}
	#P(e) {
		let t = this.#h().length;
		t < 2 || (this.#t = (this.#t + e + t) % t, this.#e = t + this.#t, this.#C(), this.#T(), this.#F());
	}
	#F() {
		let e = this.shadowRoot, t = this.#M(), n = t[this.#t], r = e.querySelector(".lightbox-image"), i = t.length;
		if (!n) return;
		r.src = n.src, r.alt = n.alt;
		let a = String(this.#t + 1).padStart(2, "0"), o = String(i).padStart(2, "0");
		e.querySelector(".lightbox-count").textContent = `${a} / ${o}`, e.querySelector(".lightbox-prev").hidden = i < 2, e.querySelector(".lightbox-next").hidden = i < 2;
	}
	#I(e) {
		if (e.pointerType === "mouse" && e.button !== 0 || this.#h().length < 2) return;
		let t = e.composedPath().find((e) => e.localName === "arq-project-slide");
		this.#x() && this.#S(), this.#o = {
			id: e.pointerId,
			x: e.clientX,
			tx: this.#A(this.#e),
			index: this.#e,
			moved: !1,
			slide: t,
			samples: [{
				x: e.clientX,
				t: e.timeStamp
			}]
		}, e.currentTarget.setPointerCapture(e.pointerId), this.#V();
	}
	#L(e) {
		if (!this.#o || e.pointerId !== this.#o.id) return;
		let t = e.clientX - this.#o.x;
		if (!this.#o.moved) {
			if (Math.abs(t) <= Hc) return;
			this.#o.moved = !0;
			let e = this.shadowRoot.querySelector(".track"), n = new DOMMatrixReadOnly(getComputedStyle(e).transform).m41;
			this.#o.tx = n - t, e.style.transition = "none", this.#z(!0), this.#V();
		}
		let n = this.#o.samples;
		for (n.push({
			x: e.clientX,
			t: e.timeStamp
		}); n.length > 2 && e.timeStamp - n[0].t > Wc;) n.shift();
		e.preventDefault(), this.shadowRoot.querySelector(".track").style.transform = `translateX(${this.#o.tx + t}px)`;
	}
	#R(e) {
		if (!this.#o || e.pointerId !== this.#o.id) return;
		let t = this.#o;
		this.#o = null, this.#l = !0, setTimeout(() => {
			this.#l = !1;
		}, 0);
		let n = this.shadowRoot.querySelector(".track");
		if (this.#z(!1), n.style.transition = "", !t.moved) {
			e.type === "pointerup" && t.slide && this.#N(t.slide);
			return;
		}
		let r = t.tx + (e.clientX - t.x), i = t.samples[0], a = t.samples.at(-1), o = (a.x - i.x) / Math.max(a.t - i.t, 1);
		if (this.#e = this.#j(r), !this.#u.matches) {
			n.style.transition = "transform var(--arq-motion-duration-slow) var(--arq-motion-easing-out)";
			let e = (t) => {
				t.target === n && t.propertyName === "transform" && (n.removeEventListener("transitionend", e), n.style.transition = "");
			};
			n.addEventListener("transitionend", e);
		}
		if (this.#e === t.index && Math.abs(o) > Uc) {
			let e = this.#k().slides.length - 1;
			this.#e = Math.min(e, Math.max(0, t.index - Math.sign(o)));
		}
		this.#u.matches ? this.#S() : (this.#C(), this.#w(), this.#x() && this.#E()), this.#V();
	}
	#z(e) {
		this.shadowRoot.querySelector(".rail").toggleAttribute("data-dragging", e);
		for (let t of this.#g()) t.toggleAttribute("data-dragging", e);
	}
	#B() {
		let e = this.shadowRoot?.querySelector(".lightbox");
		return !!this.autoplay && !this.#u.matches && !this.#o && !this.#s && !this.matches(":focus-within") && !e?.open && !document.hidden && this.#h().length > 1;
	}
	#V() {
		this.#H(), this.#B() && (this.#i = window.setInterval(() => {
			this.#B() ? this.#b(1) : this.#H();
		}, Vc));
	}
	#H() {
		window.clearInterval(this.#i), this.#i = 0;
	}
}).define();
//#endregion
//#region src/components/featured-products/featured-products.css?inline
var Gc = ":host{min-width:0;display:block}.layout{align-items:flex-start;gap:var(--arq-space-gap-4xl);min-width:0;display:flex}.intro{flex:0 0 var(--arq-layout-measure);align-items:flex-start;gap:var(--arq-space-gap-lg);flex-direction:column;min-width:0;display:flex}.rail{gap:var(--arq-space-gap-sm);overscroll-behavior-x:contain;scroll-snap-type:x mandatory;scrollbar-width:none;cursor:grab;-webkit-user-select:none;user-select:none;flex:auto;min-width:0;display:flex;overflow-x:auto}.rail[data-dragging]{scroll-snap-type:none;cursor:grabbing}.rail[data-gliding]{scroll-snap-type:none;scroll-behavior:auto}.rail::-webkit-scrollbar{display:none}.rail>*{flex:0 0 var(--arq-layout-card-min-wide);scroll-snap-align:start}.rail>arq-product-card[loading]{transition-property:opacity;transition-duration:var(--arq-motion-duration-fade);transition-timing-function:var(--arq-motion-easing-standard);transition-delay:var(--arq-motion-duration-fade)}@starting-style{.rail>arq-product-card[loading]{opacity:0}}:host([layout=stacked]) .layout{align-items:stretch;gap:var(--arq-space-gap-2xl);flex-direction:column}:host([layout=stacked]) .intro{flex-direction:row;flex:none;justify-content:space-between;align-items:flex-end;width:100%}:host([layout=stacked]) .rail{width:auto;margin-inline-end:calc(var(--section-inline,0px) * -1);padding-inline-end:var(--section-inline,0px)}@media (width<=767px){.layout{gap:var(--arq-space-gap-xl);flex-direction:column}.intro{flex-basis:auto;width:100%}:host([layout=stacked]) .intro{flex-direction:column;align-items:flex-start}.rail>*{flex-basis:var(--arq-layout-card-min)}}.fallback{align-items:flex-start;gap:var(--arq-space-gap-sm);color:var(--arq-color-text-primary);flex-direction:column;display:flex}", Kc = 100;
(class extends L {
	static tag = "arq-featured-products";
	static styles = G + Gc;
	static properties = { layout: {
		type: String,
		values: ["side", "stacked"],
		default: "side"
	} };
	static template = "<div class=\"layout\"><div class=\"intro\"><slot name=\"intro\"></slot><arq-carousel-controls class=\"controls\" buttons=\"carousel\" progress=\"scroll\" slide=\"slow\" for=\"featured-rail\" step=\"item\" label-prev=\"Productos anteriores\" label-next=\"Productos siguientes\"></arq-carousel-controls></div><div class=\"rail\" id=\"featured-rail\"></div></div><p class=\"status visually-hidden\" role=\"status\"></p><div class=\"fallback role-body\" hidden><slot></slot></div>";
	#e = "";
	#t = 0;
	#n = null;
	#r = 0;
	#i = !1;
	#a = null;
	#o = !1;
	#s = !1;
	#c = 0;
	#l = window.matchMedia("(prefers-reduced-motion: reduce)");
	#u = () => this.#v();
	#d = () => this.#v();
	#f = new IntersectionObserver(([e]) => {
		this.#i = e.isIntersecting, this.#v();
	});
	setup() {
		this.shadowRoot.querySelector(".fallback slot").addEventListener("slotchange", () => this.#p());
		let e = this.shadowRoot.querySelector(".rail");
		e.addEventListener("pointerdown", (e) => this.#S(e)), e.addEventListener("pointermove", (e) => this.#C(e)), e.addEventListener("pointerup", (e) => this.#w(e)), e.addEventListener("pointercancel", (e) => this.#w(e)), e.addEventListener("dragstart", (e) => e.preventDefault()), e.addEventListener("click", (e) => {
			this.#s && (this.#s = !1, window.clearTimeout(this.#c), e.preventDefault(), e.stopPropagation());
		}, !0);
		let t = this.shadowRoot;
		t.addEventListener("focusin", () => this.#v()), t.addEventListener("focusout", () => queueMicrotask(() => this.#v())), this.addEventListener("pointerenter", (e) => {
			e.pointerType === "mouse" && (this.#o = !0, this.#v());
		}), this.addEventListener("pointerleave", (e) => {
			e.pointerType === "mouse" && (this.#o = !1, this.#v());
		}), this.#l.addEventListener("change", this.#d), document.addEventListener("visibilitychange", this.#u), this.#f.observe(this), this.#p();
	}
	disconnectedCallback() {
		this.#b(), window.clearTimeout(this.#c), this.#f.disconnect(), this.#l.removeEventListener("change", this.#d), document.removeEventListener("visibilitychange", this.#u);
	}
	async #p() {
		let e = [...this.querySelectorAll(":scope > a[data-group]")].map((e) => e.dataset.group.trim()).filter(Boolean), t = e.join("\n");
		if (t === this.#e) return;
		this.#e = t;
		let n = ++this.#t;
		this.setAttribute("aria-busy", "true"), e.length && this.#m(e.length), this.#h(e.length ? "Cargando productos…" : "");
		let r = [];
		try {
			r = e.length ? await bn(e) : [];
		} catch (e) {
			console.error("[arq] featured-products: no se pudo cargar el catálogo", e);
		}
		n === this.#t && (this.removeAttribute("aria-busy"), this.#h(""), this.#g(r));
	}
	#m(e) {
		let t = this.shadowRoot.querySelector(".rail");
		if (t.querySelectorAll("[loading]").length === e) return;
		let n = Array.from({ length: e }, () => {
			let e = document.createElement("arq-product-card");
			return e.loading = !0, e;
		});
		this.#n?.disconnect(), this.#n = null, t.replaceChildren(...n), t.hidden = !1, this.shadowRoot.querySelector(".controls").hidden = !0, this.shadowRoot.querySelector(".fallback").hidden = !0, this.#v();
	}
	#h(e) {
		this.shadowRoot.querySelector(".status").textContent = e;
	}
	#g(e) {
		let t = this.shadowRoot, n = t.querySelector(".rail"), r = n.querySelector("[loading]"), i = !Ss() && !!r && Number.parseFloat(getComputedStyle(r).opacity) > 0, a = e.map((e) => this.#O(e));
		n.replaceChildren(...a), this.#n?.disconnect(), this.#n = i ? null : Ts(a), n.hidden = e.length === 0, t.querySelector(".controls").hidden = e.length < 2, t.querySelector(".fallback").hidden = e.length > 0, this.#v();
	}
	#_() {
		return 3e3;
	}
	#v() {
		let e = this.shadowRoot.querySelector(".rail");
		!e.hidden && !e.querySelector("[loading]") && this.#i && !this.#a && !this.#o && !this.shadowRoot.activeElement && !this.#l.matches && document.visibilityState === "visible" && e.scrollWidth - e.clientWidth > 1 ? this.#y() : this.#b();
	}
	#y() {
		this.#r ||= window.setInterval(() => {
			this.#v(), this.#r && this.#D();
		}, this.#_());
	}
	#b() {
		window.clearInterval(this.#r), this.#r = 0;
	}
	#x() {
		let e = this.shadowRoot.querySelector(".rail"), t = e.firstElementChild;
		if (!t) return 0;
		let n = Number.parseFloat(getComputedStyle(e).columnGap || getComputedStyle(e).gap) || 0;
		return t.offsetWidth + n;
	}
	#S(e) {
		if (e.pointerType !== "mouse" || e.button !== 0) return;
		let t = e.currentTarget;
		t.scrollWidth - t.clientWidth <= 1 || (this.shadowRoot.querySelector(".controls").cancelGlide(), this.#T?.(), this.#a = {
			id: e.pointerId,
			x: e.clientX,
			y: e.clientY,
			left: t.scrollLeft,
			samples: [{
				x: e.clientX,
				t: e.timeStamp
			}],
			moved: !1,
			axis: null
		}, this.#v());
	}
	#C(e) {
		if (!this.#a || e.pointerId !== this.#a.id) return;
		let t = e.clientX - this.#a.x, n = e.clientY - this.#a.y;
		if (!this.#a.axis) {
			if (Math.abs(t) < 6 && Math.abs(n) < 6) return;
			this.#a.axis = Math.abs(t) > Math.abs(n) ? "x" : "y";
		}
		if (this.#a.axis !== "x") return;
		let r = this.shadowRoot.querySelector(".rail");
		this.#a.moved || (this.#a.moved = !0, r.setPointerCapture(e.pointerId), r.setAttribute("data-dragging", ""));
		let i = this.#a.samples;
		for (i.push({
			x: e.clientX,
			t: e.timeStamp
		}); i.length > 2 && e.timeStamp - i[0].t > Kc;) i.shift();
		e.preventDefault(), r.scrollLeft = this.#a.left - t;
	}
	#w(e) {
		if (!this.#a || e.pointerId !== this.#a.id) return;
		let t = this.#a;
		this.#a = null;
		let n = this.shadowRoot.querySelector(".rail");
		if (t.moved && e.type === "pointerup") {
			this.#s = !0, window.clearTimeout(this.#c), this.#c = window.setTimeout(() => {
				this.#s = !1;
			}, 400);
			let e = t.samples[0], n = t.samples.at(-1);
			this.#E((n.x - e.x) / Math.max(n.t - e.t, 1));
		} else n.removeAttribute("data-dragging");
		this.#v();
	}
	#T = null;
	#E(e) {
		let t = this.shadowRoot.querySelector(".rail"), n = this.#x(), r = () => {
			this.#T = null, t.removeEventListener("scrollend", r), window.clearTimeout(i), t.removeAttribute("data-dragging");
		}, i = 0;
		if (!n) return r();
		let a = t.scrollWidth - t.clientWidth, o = t.scrollLeft;
		Math.abs(e) > .4 && (o -= Math.sign(e) * n);
		let s = Math.round(o / n), c = Math.min(a, Math.max(0, s * n));
		if (Math.abs(c - t.scrollLeft) < 1) return r();
		this.#T = r, t.addEventListener("scrollend", r);
		let l = Number.parseFloat(getComputedStyle(this).getPropertyValue("--arq-motion-duration-panel")) || 400;
		i = window.setTimeout(r, l * 2), this.shadowRoot.querySelector(".controls").glideTo(c);
	}
	#D() {
		if (this.#a) return;
		let e = this.shadowRoot.querySelector(".rail"), t = e.scrollWidth - e.clientWidth;
		if (!(t <= 1)) {
			if (e.scrollLeft >= t - 1) {
				let t = getComputedStyle(this), n = {
					duration: Number.parseFloat(t.getPropertyValue("--arq-motion-duration-fade")) || 0,
					easing: t.getPropertyValue("--arq-motion-easing-standard").trim() || "ease"
				}, r = e.animate([{ opacity: 1 }, { opacity: 0 }], {
					...n,
					fill: "forwards"
				});
				r.finished.then(() => {
					e.scrollTo({
						left: 0,
						behavior: "auto"
					}), e.animate([{ opacity: 0 }, { opacity: 1 }], n), r.cancel();
				}).catch(() => {});
				return;
			}
			this.shadowRoot.querySelector(".controls").go(1);
		}
	}
	#O({ name: e, meta: t, href: n, family: r, image: i, imageHover: a, imageLit: o, imageHoverLit: s }) {
		let c = document.createElement("arq-product-card");
		c.href = n, c.family = r, c.showCursor = !0, c.image = i, c.imageHover = a, c.imageLit = o, c.imageHoverLit = s;
		let l = document.createElement("h3");
		if (l.slot = "name", l.textContent = e, c.append(l), t) {
			let e = document.createElement("span");
			e.slot = "meta", e.textContent = t, c.append(e);
		}
		return c;
	}
}).define();
//#endregion
//#region src/data/category-descriptions.js
var qc = (e) => String(e ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").trim().toLowerCase(), Jc = {
	"interior/embutir": "Luminarias a ras del cielorraso: aros simples, dobles y trimless, cabezales direccionables y accesorios.",
	"interior/aplicar": "Luminarias que se montan sobre la superficie, para sumar luz de forma directa en techo, pared o piso.",
	"interior/colgante": "Luminarias suspendidas del techo que concentran la luz sobre un punto del espacio, como una mesa.",
	"interior/artefactos": "Accesorios y artefactos para completar las luminarias de interior.",
	"interior/lamparas": "Lámparas para las luminarias de interior que las usan.",
	"exterior/jardin": "Bolardos y estacas que marcan recorridos y resaltan la vegetación con una luz baja, sin deslumbrar.",
	"exterior/pared": "Luminarias de pared para fachadas, accesos, galerías y pasos, que acompañan la arquitectura desde el muro.",
	"exterior/artefactos": "Accesorios y artefactos para completar las luminarias de exterior.",
	"exterior/lamparas": "Lámparas para las luminarias de exterior que las usan.",
	"lamparas-artefactos/lampara": "Lámparas mini dicroicas PAR11 de luz cálida, con versión dim to warm.",
	"lamparas-artefactos/artefacto": "Accesorios para completar lámparas PAR11."
}, Yc = {
	dao: "Sistema modular de embutir que combina aros simples, dobles y triples, con terminación trimless o con marco, en versión estándar y Mini.",
	"mini kai": "Luminarias compactas para embutir y aplicar, en formato cuadrado y Round, con una luz cálida y discreta que se integra al cielorraso.",
	"par 11": "Lámparas mini dicroicas con frentes de cerámica. La versión dim to warm entibia la luz a medida que se regula, como una lámpara incandescente.",
	tori: "Estacas de jardín para plantas bajas y nivel de cantero, con una visera antideslumbrante opcional que cuida la mirada.",
	kanu: "Bolardo de jardín y luz de pared de diseño vertical, que controla la emisión de luz y reduce el deslumbramiento.",
	fuji: "Spot de aplicar sobre el cielorraso, de presencia discreta, para acentuar un objeto o una zona del ambiente.",
	ugoki: "Spot de aplicar sobre el cielorraso, de presencia discreta, para acentuar un objeto o una zona del ambiente.",
	sen: "Downlight de embutir que ilumina el ambiente con una luz cálida y pareja, sin llamar la atención.",
	afo: "Una línea de luz que dibuja el espacio. Diseño minimalista para destacar muros, pasillos y detalles arquitectónicos.",
	yoru: "Bolardo que marca un punto de luz en un camino o sendero, con una presencia vertical y precisa.",
	nobu: "Bolardo con un hueco transversal que deja pasar la luz y la dibuja sobre el recorrido del jardín.",
	nami: "Luminaria de embutir regulable, con luz cálida y un haz concentrado para destacar lo que importa.",
	koen: "Luminaria de pared de gran escala, pensada para la fachada, junto a una doble puerta de entrada o un ventanal.",
	sento: "Bolardo decorativo para rodear de plantas, que suma una luz cálida y suave al jardín.",
	hoshi: "Luminaria de embutir de efecto de punto de luz: no ilumina grandes superficies, acompaña como un detalle.",
	douli: "Una luz que cuelga sobre la mesa y reúne: crea un círculo cálido de intimidad en comedores, islas de cocina, restaurantes y salas de reunión."
}, Xc = (e, t) => Jc[`${e}/${qc(t)}`] ?? "", Zc = (e) => Yc[qc(e)] ?? "", Qc = ":host{box-sizing:border-box;background:var(--arq-color-surface-default);min-width:0;transition-property:background-color;transition-duration:var(--arq-illumination-bg-duration);transition-delay:0s;transition-timing-function:var(--arq-illumination-bg-easing);display:block}.layout{gap:var(--arq-space-gap-xl);min-width:0;padding:0 var(--page-gutter) var(--arq-space-section-xl);flex-direction:column;display:flex}.nav{min-width:0}.content{gap:var(--arq-space-gap-xl-2xl);flex-direction:column;min-width:0;display:flex}.status{color:var(--arq-color-text-secondary);margin:0}.status:empty{display:none}.grid{--busy-opacity:var(--arq-opacity-muted);transition-property:opacity;transition-duration:var(--arq-motion-duration-fast);transition-timing-function:var(--arq-motion-easing-standard)}:host([aria-busy=true]) .grid:not(:has(>[loading])){opacity:var(--busy-opacity);transition-delay:var(--arq-motion-duration-fast)}.grid>arq-product-card[loading]{animation:arq-reveal calc(var(--arq-motion-duration-slow) * 2) var(--arq-motion-easing-standard) backwards;animation-delay:calc(var(--arq-motion-duration-fade) + var(--arq-motion-duration-fast) * var(--reveal-index,0))}.grid>arq-product-card.settled{transition:none}@media (prefers-reduced-motion:reduce){.grid>arq-product-card{transition-property:opacity;transition-duration:var(--arq-motion-duration-fade);transition-timing-function:var(--arq-motion-easing-standard)}@starting-style{.grid>arq-product-card{opacity:0}}.grid>arq-product-card[loading]{transition-delay:var(--arq-motion-duration-fade);animation:none}}@media (width>=1024px){.layout{grid-template-columns:var(--arq-layout-catalog-nav) minmax(0, 1fr);column-gap:var(--arq-space-section-xs);display:grid}.toolbar{top:calc(var(--arq-space-gap-md) * 2 + var(--arq-icon-xl));z-index:3;background:var(--arq-color-surface-default);transition-property:background-color;transition-duration:var(--arq-illumination-bg-duration);transition-delay:0s;transition-timing-function:var(--arq-illumination-bg-easing);position:sticky}.nav{top:calc(var(--arq-space-gap-md) * 2 + var(--arq-icon-xl));z-index:3;align-self:start;position:sticky}.nav-scroll{box-sizing:border-box;margin:calc(var(--arq-space-padding-xs) * -1);padding:var(--arq-space-padding-xs);scrollbar-width:none}.nav-scroll::-webkit-scrollbar{display:none}.nav.scrolls .nav-scroll{max-height:var(--nav-max);overflow-y:auto}.nav-bar{position:absolute;inset-block:0;inset-inline-start:calc(100% + var(--arq-space-gap-sm))}.nav:not(.scrolls) .nav-bar{display:none}}@media (width<=1023px){.nav{display:none}}@media (width<=767px){.content{gap:var(--arq-space-gap-xl)}}", $c = {
	label: "Colecciones",
	href: "/arq/productos",
	menu: "colecciones"
}, el = {
	environment: "environment",
	application: "application",
	product_type: "productType",
	collection: "collection",
	family: "family"
}, tl = matchMedia("(min-width: 1024px)"), nl = matchMedia("(min-width: 1920px)"), rl = "dao", il = {
	loading: "Cargando productos…",
	empty: "No hay productos con estos filtros.",
	error: "No se pudieron cargar los productos. Probá de nuevo en unos minutos."
}, al = class extends L {
	static tag = "arq-catalog-listing";
	static styles = G + Qc;
	static template = "<div class=\"layout\"><div class=\"nav\"><div class=\"nav-scroll\" id=\"nav-scroll\"><div class=\"nav-content\"><slot name=\"nav\"></slot></div></div><arq-carousel-controls class=\"nav-bar\" for=\"nav-scroll\" buttons=\"none\" progress=\"scroll\" scrub orientation=\"vertical\" label-prev=\"Subir\" label-next=\"Bajar\"></arq-carousel-controls></div><div class=\"content\"><arq-catalog-toolbar class=\"toolbar\" for=\"filters\" show-iluminar></arq-catalog-toolbar><p class=\"status role-body\" role=\"status\"></p><arq-grid class=\"grid\"></arq-grid></div></div><arq-filter-panel id=\"filters\" show-categories><slot name=\"filter-title\" slot=\"title\"></slot></arq-filter-panel><arq-compare-bar class=\"compare\"></arq-compare-bar><arq-compare-picker class=\"picker\"></arq-compare-picker><p class=\"notice visually-hidden\" aria-live=\"polite\"></p>";
	#e = {};
	#t = "";
	#n = {};
	#r = /* @__PURE__ */ new Map();
	#i = null;
	#a = 0;
	#o = 0;
	#s = null;
	#c = null;
	#l = null;
	setup() {
		let e = this.shadowRoot;
		this.#e = ol(), this.#t = new URLSearchParams(location.search).get("q")?.trim() ?? "", this.#h(), e.querySelector("slot[name=\"nav\"]").addEventListener("slotchange", () => this.#D()), new MutationObserver(() => this.#D()).observe(this, {
			subtree: !0,
			attributes: !0,
			attributeFilter: ["href"]
		}), this.#E(), e.addEventListener("click", this.#u), document.querySelector("arq-page-header")?.addEventListener("click", this.#u), Oa(!1), e.querySelector(".grid").addEventListener("click", (e) => {
			e.composedPath().some((e) => e.localName === "a" && e.hasAttribute("href")) && Oa(document.documentElement.getAttribute("data-arq-theme") === "dark");
		}), window.addEventListener("popstate", this.#d);
		let t = e.querySelector("arq-filter-panel");
		t.addEventListener("arq:filters", (e) => this.#v(e.detail.filters)), t.addEventListener("arq:apply", (e) => {
			this.#n = e.detail.filters, this.#g();
		});
		let n = e.querySelector(".grid"), r = () => {
			n.columns = tl.matches ? nl.matches ? 4 : 3 : null;
		};
		tl.addEventListener("change", r), nl.addEventListener("change", r), r();
		let i = e.querySelector(".toolbar"), a = null, o = () => {
			if (a?.disconnect(), i.stuck = !1, !tl.matches) return;
			let e = Number.parseFloat(getComputedStyle(i).top) || 0;
			a = new IntersectionObserver(([t]) => {
				i.stuck = t.intersectionRatio < 1 && t.boundingClientRect.top <= e + 1;
			}, {
				rootMargin: `-${e + 1}px 0px 0px 0px`,
				threshold: 1
			}), a.observe(i);
		};
		tl.addEventListener("change", o), o();
		let s = e.querySelector(".nav"), c = e.querySelector(".nav-scroll"), l = 0, u = () => {
			l = 0;
			let t = e.querySelector("slot[name=\"nav\"]").assignedElements()[0], n = Number.parseFloat(getComputedStyle(c).paddingTop) || 0, r = Math.max(s.getBoundingClientRect().top, Number.parseFloat(getComputedStyle(s).top) || 0) - n, i = Math.max(window.innerHeight - r, 0), a = (t?.offsetHeight ?? 0) + n * 2;
			s.style.setProperty("--nav-max", `${i}px`), s.classList.toggle("scrolls", tl.matches && a > i);
		}, d = () => {
			l ||= requestAnimationFrame(u);
		};
		window.addEventListener("scroll", d, { passive: !0 }), window.addEventListener("resize", d);
		let f = new ResizeObserver(d);
		f.observe(document.documentElement), e.querySelector("slot[name=\"nav\"]").addEventListener("slotchange", (e) => {
			let t = e.target.assignedElements()[0];
			t && f.observe(t), d();
		}), d();
		let p = e.querySelector(".compare");
		n.addEventListener("arq:compare", (e) => {
			let t = e.target, n = this.#r.get(t);
			n && (e.detail.checked ? p.add({
				sku: n.sku,
				name: n.name,
				meta: n.meta,
				image: n.image
			}) || (t.compared = !1, this.#x(`Podés comparar hasta ${p.items.length} productos. Sacá uno de la barra para sumar otro.`)) : p.remove(n.sku));
		}), n.addEventListener("arq:finish", (e) => {
			let t = e.target, n = this.#r.get(t);
			n && (Object.assign(n, {
				sku: e.detail.sku ?? n.sku,
				href: e.detail.href,
				image: e.detail.image
			}), t.compared = p.has(n.sku));
		}), p.addEventListener("arq:compare-change", () => {
			this.#w(), m.open && this.#p();
		});
		let m = e.querySelector(".picker");
		p.addEventListener("arq:add", (e) => {
			e.stopPropagation(), m.show();
		}), m.addEventListener("arq:search", () => this.#p()), m.addEventListener("arq:close", (e) => {
			e.detail.restored || p.focusAdd();
		}), m.addEventListener("arq:add", (e) => {
			let { sku: t, name: n, cardMeta: r, meta: i, image: a } = e.detail.item;
			p.add({
				sku: t,
				name: n,
				meta: r ?? i,
				image: a
			});
		});
	}
	#u = (e) => {
		if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
		let t = e.target.closest?.("arq-catalog-nav-item, arq-breadcrumb-item:not([current])");
		if (t?.hasAttribute("data-arq-menu")) return;
		let n = t?.getAttribute("href") ?? t?.href;
		if (!n) return;
		let r = new URL(n, location.href);
		r.origin === location.origin && r.pathname.replace(/\/$/, "") === location.pathname.replace(/\/$/, "") && (e.preventDefault(), r.pathname + r.search !== location.pathname + location.search && (history.pushState(null, "", r.pathname + r.search), this.shadowRoot.querySelector("arq-filter-panel").open = !1, this.#m()));
	};
	#d = () => this.#m();
	#f = 0;
	async #p() {
		let e = this.shadowRoot, t = e.querySelector(".compare"), n = e.querySelector(".picker"), r = t.items.map((e) => e.sku), i = ++this.#f;
		n.count = r.length, n.href = location.pathname;
		try {
			let { items: e } = await Un({
				...n.search,
				selected: r
			});
			i === this.#f && (n.items = e);
		} catch (e) {
			console.error("[arq] compare-picker: no se pudo cargar el catálogo", e), i === this.#f && n.showError();
		}
	}
	#m() {
		let e = new URLSearchParams(location.search);
		this.#e = ol(), this.#t = e.get("q")?.trim() ?? "", this.#n = {}, this.shadowRoot.querySelector("arq-filter-panel").clear(), this.#h(), this.#D(), this.#g();
	}
	#h() {
		let e = (e) => (e ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").trim().toLowerCase(), { collection: t, family: n } = this.#e, r = [t, n].some((t) => e(t) === rl);
		this.shadowRoot.querySelector(".toolbar").showIluminar = !r;
		let i = document.documentElement;
		r && i.getAttribute("data-arq-theme") === "dark" && ba(() => {
			i.removeAttribute("data-arq-theme"), Ca(!1);
		});
	}
	update() {
		this.#t && this.#k(), this.#g({ rows: !0 });
	}
	async #g({ rows: e = !1 } = {}) {
		let t = ++this.#a, n = il;
		this.setAttribute("aria-busy", "true"), this.#r.size || this.#b(), e && this.#y(n.loading, { quiet: !0 });
		let r = null;
		try {
			r = await this.#_(this.#n);
		} catch (e) {
			console.error("[arq] catalog-listing: no se pudo cargar el catálogo", e);
		}
		if (t !== this.#a) return;
		this.removeAttribute("aria-busy");
		let i = this.shadowRoot.querySelector(".toolbar");
		if (!r) {
			i.count = null, this.#S([]), this.#y(n.error);
			return;
		}
		e && this.#T(r.filters), i.count = r.count, this.#S(r.cards), this.#y(r.count ? "" : this.#t ? `No encontramos productos para «${this.#t}».` : n.empty);
	}
	#_(e) {
		return Xt({
			...this.#e,
			query: this.#t,
			filters: e
		});
	}
	async #v(e) {
		let t = this.shadowRoot.querySelector("arq-filter-panel"), n = ++this.#o, r = null;
		try {
			r = await this.#_(e);
		} catch {}
		if (n === this.#o && (t.count = r ? r.count : null, r?.available)) {
			for (let e of t.options) e.count = r.available[e.getAttribute("name")]?.[e.value] ?? null;
			t.showAvailable((e) => Number.isFinite(e.count));
		}
	}
	#y(e, { quiet: t = !1 } = {}) {
		let n = this.shadowRoot.querySelector(".status");
		n.textContent = e, n.hidden = !e, n.classList.toggle("visually-hidden", t);
	}
	#b() {
		let e = this.shadowRoot.querySelector(".grid");
		if (e.querySelector("[loading]")) return;
		let t = getComputedStyle(e.shadowRoot.querySelector(".grid")).gridTemplateColumns.split(" ").filter(Boolean), n = Array.from({ length: Math.max(t.length, 1) * 2 }, (e, t) => {
			let n = document.createElement("arq-product-card");
			return n.loading = !0, n.style.setProperty("--reveal-index", String(Math.min(t, 5))), n.showCompare = !0, n;
		});
		e.replaceChildren(...n);
	}
	#x(e) {
		let t = this.shadowRoot.querySelector(".notice");
		t.textContent = "", requestAnimationFrame(() => {
			t.textContent = e;
		});
	}
	#S(e) {
		let t = this.shadowRoot.querySelector(".grid > [loading]"), n = !Ss() && !!t && Number.parseFloat(getComputedStyle(t).opacity) > 0, r = new Map([...this.#r].map(([e, t]) => [t.href, {
			card: e,
			json: JSON.stringify(t)
		}])), i = [];
		this.#r = new Map(e.map((e) => {
			let t = r.get(e.href), a = t?.json === JSON.stringify(e) ? t.card : null;
			return a ? a.classList.contains("reveal") && i.push(a) : (a = this.#C(e), a.classList.toggle("settled", n || !!t), !n && !t && i.push(a)), [a, e];
		})), this.#i?.disconnect(), this.shadowRoot.querySelector(".grid").replaceChildren(...this.#r.keys()), this.#i = Ts(i), this.#w();
	}
	#C(e) {
		let t = document.createElement("arq-product-card");
		t.href = e.href, t.family = e.family, t.image = e.image, t.imageHover = e.imageHover, t.imageLit = e.imageLit, t.imageHoverLit = e.imageHoverLit, t.showCompare = !0;
		let n = document.createElement("h2");
		return n.slot = "name", n.textContent = e.name, t.append(n), Eo(t, e.finishes), t;
	}
	#w() {
		let e = this.shadowRoot.querySelector(".compare");
		for (let [t, n] of this.#r) t.compared = e.has(n.sku);
	}
	#T(e) {
		let t = this.shadowRoot.querySelector("arq-filter-panel");
		for (let e of t.querySelectorAll(":scope > arq-filter-row")) e.remove();
		for (let { name: n, label: r, options: i } of e) {
			let e = document.createElement("arq-filter-row"), a = document.createElement("span");
			a.slot = "label", a.textContent = r, e.append(a);
			for (let { value: t } of i) {
				let r = document.createElement("arq-checkbox");
				r.size = "large", r.showLabel = !0, r.setAttribute("name", n), r.value = String(t), r.textContent = String(t), e.append(r);
			}
			t.append(e);
		}
		this.#v({});
	}
	async #E() {
		let e = this.shadowRoot.querySelector("slot[name=\"nav\"]").assignedElements()[0]?.querySelectorAll("arq-catalog-nav-group[data-arq-nav]");
		if (!e?.length) return;
		let t;
		try {
			t = await Gn();
		} catch (e) {
			console.error("[arq] catalog-listing: no se pudieron cargar las categorías", e);
			return;
		}
		for (let n of e) {
			n.querySelectorAll(":scope > [data-arq-nav-item]").forEach((e) => e.remove());
			for (let e of t[n.dataset.arqNav] ?? []) {
				let t = document.createElement("arq-catalog-nav-item");
				t.setAttribute("href", e.href), t.setAttribute("data-arq-nav-item", ""), t.textContent = e.label, n.append(t);
			}
		}
		this.#D();
	}
	#D() {
		let e = this.shadowRoot.querySelector("slot[name=\"nav\"]").assignedElements()[0];
		if (!e) return;
		let t = location.pathname + location.search, n = null;
		for (let r of e.querySelectorAll("arq-catalog-nav-item")) {
			let e = r.getAttribute("href");
			r.selected = !!e && sl(e, t), r.selected && (n ??= r);
		}
		let r = n?.closest("arq-catalog-nav-group");
		for (let t of e.querySelectorAll(":scope > arq-catalog-nav-group")) t.selected = t === r;
		this.#A(n), this.#O(e);
		let i = document.querySelector("arq-page-header");
		i && (i.showDescription = !0);
	}
	#O(e) {
		let t = this.shadowRoot.querySelector("arq-filter-panel"), n = t.querySelector("[slot=\"categories\"]") ?? document.createElement("nav");
		n.slot = "categories", n.setAttribute("aria-label", "Categorías de productos");
		let r = [...e.querySelectorAll(":scope > arq-catalog-nav-group")].map((e) => {
			let t = e.cloneNode(!0);
			return t.open = e.selected, t;
		});
		n.replaceChildren(...r), n.isConnected || t.append(n);
	}
	#k() {
		let e = document.querySelector("arq-page-header > [slot=\"title\"]");
		e && (this.#c ??= e.textContent), e && (e.textContent = `Resultados para «${this.#t}»`), e?.parentElement.setAttribute("search-title", ""), this.#L([{
			label: "Productos",
			href: location.pathname
		}], !0);
	}
	#A(e) {
		if (this.#e.family && !this.#t) {
			let t = (e?.closest("[data-arq-nav=\"colecciones\"]") ? e.textContent.trim() : "") || this.#e.family, n = document.querySelector("arq-page-header > [slot=\"title\"]");
			n && (this.#c ??= n.textContent, this.#M(n, t), n.parentElement.removeAttribute("search-title"));
			let r = document.querySelector("arq-page-header > [slot=\"description\"]");
			r && (this.#l ??= r.textContent, this.#P(r, Zc(t) || this.#l)), this.#L([
				{
					label: "Productos",
					href: location.pathname
				},
				$c,
				{ label: t }
			]);
			return;
		}
		let t = e?.closest("arq-catalog-nav-group"), n = t?.dataset.arqNav === "colecciones" ? null : t?.querySelector(":scope > arq-catalog-nav-item"), r = t?.querySelector("[slot=\"label\"]")?.textContent.trim(), i = e && e !== n, a = i ? e.textContent.trim() : r, o = document.querySelector("arq-page-header > [slot=\"title\"]"), s = document.querySelector("arq-page-header > [slot=\"description\"]");
		if (s) {
			this.#l ??= s.textContent;
			let e = i ? t.dataset.arqNav === "colecciones" ? Zc(a) : Xc(t.dataset.arqNav, a) : "";
			this.#P(s, e || a && t.dataset.arqDescription || this.#l);
		}
		if (!a && this.#t) return this.#k();
		o && (this.#c ??= o.textContent, this.#M(o, a || this.#c), o.parentElement.removeAttribute("search-title"));
		let c = {
			label: "Productos",
			href: location.pathname
		};
		if (!a) this.#L([]);
		else if (i) {
			let e = n ? {
				label: r,
				href: n.getAttribute("href")
			} : $c;
			this.#L([
				c,
				e,
				{ label: a }
			]);
		} else this.#L([c, { label: a }]);
	}
	#j = !1;
	#M(e, t) {
		let n = this.#j;
		this.#j = !0, this.#I(e, t, n, { rise: !0 });
	}
	#N = !1;
	#P(e, t) {
		let n = this.#N;
		this.#N = !0, this.#I(e, t, n, { delay: "motion-duration-fast" });
	}
	#F = /* @__PURE__ */ new WeakMap();
	#I(e, t, n, { rise: r = !1, delay: i = null } = {}) {
		if ((this.#F.get(e) ?? e.textContent) === t) return;
		for (let t of e.getAnimations()) t.cancel();
		if (!n || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			this.#F.delete(e), e.textContent = t;
			return;
		}
		let a = getComputedStyle(document.documentElement), o = (e) => a.getPropertyValue(`--arq-${e}`).trim();
		this.#F.set(e, t);
		let s = e.animate([{ opacity: 1 }, { opacity: 0 }], {
			duration: parseFloat(o("motion-duration-fade")),
			easing: o("motion-easing-standard"),
			delay: i ? parseFloat(o(i)) : 0,
			fill: "forwards"
		});
		s.finished.then(() => {
			if (this.#F.get(e) === t) {
				if (this.#F.delete(e), e.textContent = t, s.cancel(), r) {
					e.animate([{
						opacity: 0,
						transform: `translateY(${o("space-gap-2xl")})`
					}, {
						opacity: 1,
						transform: "none"
					}], {
						duration: parseFloat(o("motion-duration-slow")) * 1.5,
						easing: o("motion-easing-standard"),
						fill: "backwards"
					});
					return;
				}
				e.animate([{ opacity: 0 }, { opacity: 1 }], {
					duration: parseFloat(o("motion-duration-slow")),
					easing: o("motion-easing-illumination-image"),
					fill: "backwards"
				});
			}
		}, () => {});
	}
	#L(e, t = !1) {
		let n = document.querySelector("arq-page-header > arq-breadcrumb");
		if (!n) return;
		this.#s ??= [...n.children].slice(1);
		let [r] = n.children, i = e.length ? e.map(({ label: n, href: r, menu: i }, a) => {
			let o = document.createElement("arq-breadcrumb-item");
			return a === e.length - 1 && !t ? o.current = !0 : (o.href = r, i && (o.dataset.arqMenu = i), o.showSeparator = !0), o.textContent = n, o;
		}) : this.#s;
		n.replaceChildren(...[r, ...i].filter(Boolean));
	}
};
function ol() {
	let e = new URLSearchParams(location.search), t = {};
	for (let [n, r] of Object.entries(el)) {
		let i = e.get(n);
		i && (t[r] = i);
	}
	return t;
}
function sl(e, t) {
	let n = new URL(e, location.href), r = (e) => [...new URLSearchParams(e)].sort().join("&"), i = new URL(t, location.href);
	return n.pathname.replace(/\/$/, "") === i.pathname.replace(/\/$/, "") && r(n.search) === r(i.search);
}
al.define();
//#endregion
//#region src/base/horizontal-rail.js
var cl = 100, ll = .998, ul = class {
	#e;
	#t;
	#n;
	#r;
	#i = null;
	#a = 0;
	#o = 0;
	#s = !1;
	#c = !1;
	#l = !1;
	#u = null;
	#d = !1;
	#f = !1;
	#p = matchMedia("(prefers-reduced-motion: reduce)");
	#m;
	#h;
	#g;
	constructor(e, t, { autoplay: n = !1, open: r = null } = {}) {
		this.#t = e, this.#e = t, this.#n = n, this.#r = r, this.#m = new ResizeObserver(() => this.refresh()), this.#h = new IntersectionObserver(([e]) => {
			this.#s = e.isIntersecting, this.#C();
		}), this.#g = new MutationObserver(() => {
			for (let e of t.children) this.#m.observe(e);
			this.refresh();
		});
	}
	connect() {
		if (this.#u) return;
		this.#u = new AbortController();
		let e = this.#u.signal, t = this.#e;
		this.#m.observe(t);
		for (let e of t.children) this.#m.observe(e);
		this.#g.observe(t, { childList: !0 }), this.#h.observe(t), t.addEventListener("load", () => this.refresh(), {
			capture: !0,
			signal: e
		}), t.addEventListener("dragstart", (e) => e.preventDefault(), { signal: e }), t.addEventListener("pointerdown", (e) => {
			if (e.pointerType !== "mouse") {
				this.#d = !0, this.#C();
				return;
			}
			e.pointerType === "mouse" && e.button === 0 && this.#v() && (this.#b?.(), this.#i = {
				id: e.pointerId,
				x: e.clientX,
				y: e.clientY,
				left: t.scrollLeft,
				moved: !1,
				samples: [{
					x: e.clientX,
					t: e.timeStamp
				}],
				snaps: getComputedStyle(t).scrollSnapType !== "none"
			}, this.#C());
		}, { signal: e }), t.addEventListener("pointermove", (e) => {
			let n = this.#i;
			if (!n || e.pointerId !== n.id) return;
			let r = e.clientX - n.x;
			if (!(!n.moved && Math.abs(r) < 6) && !(!n.moved && Math.abs(r) < Math.abs(e.clientY - n.y))) for (n.moved = !0, t.setPointerCapture(e.pointerId), t.toggleAttribute("data-arq-dragging", !0), e.preventDefault(), t.scrollLeft = n.left - r, n.samples.push({
				x: e.clientX,
				t: e.timeStamp
			}); n.samples.length > 2 && e.timeStamp - n.samples[0].t > cl;) n.samples.shift();
		}, { signal: e });
		let n = (e) => {
			if (e.pointerType !== "mouse" && this.#d && (this.#d = !1, this.#C()), !this.#i || e.pointerId !== this.#i.id) return;
			let n = this.#i;
			this.#l = n.moved, this.#i = null, n.moved && e.type === "pointerup" ? this.#x(n.samples, n.snaps) : t.removeAttribute("data-arq-dragging"), t.hasPointerCapture(e.pointerId) && t.releasePointerCapture(e.pointerId), clearTimeout(this.#o), this.#o = setTimeout(() => {
				this.#l = !1, this.#o = 0, this.#C();
			}, 0);
		};
		for (let r of [
			"pointerup",
			"pointercancel",
			"lostpointercapture"
		]) t.addEventListener(r, n, { signal: e });
		t.addEventListener("pointerleave", () => {
			this.#i?.moved || (this.#i = null, this.#C());
		}, { signal: e }), t.addEventListener("click", (e) => {
			if (this.#l) {
				e.preventDefault(), e.stopImmediatePropagation();
				return;
			}
			this.#r && this.#r(e);
		}, {
			capture: !0,
			signal: e
		});
		let r = this.#_();
		r.addEventListener("focusin", () => this.#C(), { signal: e }), r.addEventListener("focusout", () => queueMicrotask(() => this.#C()), { signal: e }), r.addEventListener("pointerenter", (e) => {
			e.pointerType === "mouse" && (this.#f = !0, this.#C());
		}, { signal: e }), r.addEventListener("pointerleave", (e) => {
			e.pointerType === "mouse" && (this.#f = !1, this.#C());
		}, { signal: e }), document.addEventListener("visibilitychange", () => this.#C(), { signal: e }), this.#p.addEventListener("change", () => this.#C(), { signal: e }), this.refresh();
	}
	disconnect() {
		this.#u?.abort(), this.#u = null, this.#S(), clearTimeout(this.#o), this.#o = 0, this.#m.disconnect(), this.#h.disconnect(), this.#g.disconnect(), this.#i = null, this.#b?.(), this.#e.removeAttribute("data-arq-dragging"), this.#d = !1, this.#f = !1;
	}
	set blocked(e) {
		this.#c = e, this.#C();
	}
	#_() {
		return this.#e.parentElement ?? this.#e;
	}
	#v() {
		return this.#e.scrollWidth - this.#e.clientWidth > 1;
	}
	#y() {
		let e = getComputedStyle(this.#t).getPropertyValue("--arq-motion-duration-feedback").trim();
		return parseFloat(e) * (e.endsWith("ms") ? 1 : 1e3) * 1.5;
	}
	refresh() {
		this.#e.toggleAttribute("data-arq-scrollable", this.#v()), this.#e.dispatchEvent(new Event("arq:rail-resize")), this.#C();
	}
	go(e) {
		let t = this.#e, n = t.getBoundingClientRect(), r = parseFloat(getComputedStyle(t).paddingInlineStart) || 0, i = [...t.children].map((e) => e.getBoundingClientRect().left - n.left + t.scrollLeft - r), a = t.scrollWidth - t.clientWidth, o = e > 0 ? i.find((e) => e > t.scrollLeft + 1) : i.reverse().find((e) => e < t.scrollLeft - 1);
		t.scrollTo({
			left: Math.min(a, Math.max(0, o ?? (e > 0 ? a : 0))),
			behavior: this.#p.matches ? "auto" : "smooth"
		});
	}
	#b = null;
	#x(e, t) {
		let n = this.#e, r = e[0], i = e.at(-1), a = (i.x - r.x) / Math.max(i.t - r.t, 1), o = n.scrollWidth - n.clientWidth, s = n.scrollLeft - ll / .0020000000000000018 * a;
		if (s = Math.min(n.scrollLeft + n.clientWidth, Math.max(n.scrollLeft - n.clientWidth, s)), t) {
			let e = n.getBoundingClientRect(), t = parseFloat(getComputedStyle(n).paddingInlineStart) || 0;
			s = [...n.children].map((r) => r.getBoundingClientRect().left - e.left + n.scrollLeft - t).reduce((e, t) => Math.abs(t - s) < Math.abs(e - s) ? t : e, s);
		}
		s = Math.min(o, Math.max(0, s));
		let c = 0, l = () => {
			this.#b = null, n.removeEventListener("scrollend", l), clearTimeout(c), n.removeAttribute("data-arq-dragging");
		};
		if (this.#p.matches || Math.abs(s - n.scrollLeft) < 1) return n.scrollTo({
			left: s,
			behavior: "auto"
		}), l();
		this.#b = l, n.addEventListener("scrollend", l), c = setTimeout(l, (parseFloat(getComputedStyle(this.#t).getPropertyValue("--arq-motion-duration-panel")) || 400) * 2), n.scrollTo({
			left: s,
			behavior: "smooth"
		});
	}
	#S() {
		clearInterval(this.#a), this.#a = 0;
	}
	#C() {
		let e = this.#_().matches(":focus-within");
		if (!(this.#u && this.#n && this.#s && !this.#c && !this.#i && !this.#d && !this.#o && !e && !this.#f && !this.#p.matches && document.visibilityState === "visible" && this.#v())) {
			this.#S();
			return;
		}
		this.#a ||= setInterval(() => {
			this.#C(), this.#a && (this.#e.scrollLeft >= this.#e.scrollWidth - this.#e.clientWidth - 1 ? this.#e.scrollTo({
				left: 0,
				behavior: "smooth"
			}) : this.go(1));
		}, this.#y());
	}
}, dl = "Dao", fl = [
	"DAO-E",
	"DAO-T",
	"DAO-MINI-E",
	"DAO-MINI-T",
	"DAO-E-PH",
	"DAO-E-DF"
], Y = [
	"Negro",
	"Blanco",
	"Cobre",
	"Bronce",
	"Celeste",
	"Grafito",
	"Platil"
], pl = {
	bornera: {
		nombre: "Bornera + casquillo GU10",
		sku: ""
	},
	panal: {
		nombre: "Panal abeja",
		sku: ""
	}
}, ml = [
	"sku",
	"familia",
	"product_name",
	"categoria",
	"grupo_variantes",
	"color_carcasa",
	"modulos",
	"tamanio",
	"dimensiones",
	"cabezales_compatibles",
	"lamparas_compatibles",
	"frentes_compatibles",
	"orientacion",
	"visto_en_cielorraso",
	"angulo_apertura",
	"temperatura_color",
	"multimagen_producto"
], hl = [
	"cabezales_compatibles",
	"lamparas_compatibles",
	"frentes_compatibles"
], X = (e) => e == null ? "" : String(e).trim(), gl = (e) => (Array.isArray(e) ? e.map(X) : X(e).split(",")).map((e) => e.trim()).filter(Boolean), _l = (e) => X(e).replace(/\s+(Simple|Doble|Triple)$/i, "");
function vl(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let r of e) {
		let e = n.get(r.grupo);
		(!e || r.color === t && e.color !== t) && n.set(r.grupo, r);
	}
	return [...n.values()];
}
var Z = (e, t) => {
	let n = e.indexOf(t);
	return n < 0 ? 999 : n;
};
function yl(e) {
	let t = X(e);
	return t ? t.replace(/(\d+(?:[.,]\d+)?)\s*Ø/g, "Ø$1").replace(/\s*[*xX×]\s*/g, "×").replace(/\s*mm$/i, " mm") : "";
}
function bl(e) {
	let t = Array.isArray(e.multimagen_producto) ? e.multimagen_producto : [];
	return {
		sku: X(e.sku),
		nombre: X(e.product_name),
		categoria: X(e.categoria),
		grupo: X(e.grupo_variantes),
		color: X(e.color_carcasa),
		modulos: Number.parseInt(X(e.modulos), 10) || 1,
		dim: X(e.tamanio) || X(e.dimensiones),
		cabezales: gl(e.cabezales_compatibles),
		lamparas: gl(e.lamparas_compatibles),
		frentes: gl(e.frentes_compatibles),
		orientacion: X(e.orientacion),
		visto: X(e.visto_en_cielorraso),
		haz: X(e.angulo_apertura),
		luz: X(e.temperatura_color),
		img: X(t[1]) || X(t[0])
	};
}
function xl(e) {
	let t = [], n = (e, n) => {
		t.some((e) => e.text === n) || t.push({
			level: e,
			text: n
		});
	}, r = {};
	for (let t of e) (t.sku.startsWith("DAO-") || t.sku.startsWith("PAR11-")) && (r[t.sku] = t);
	let i = Object.values(r);
	for (let e of i) e.sku.startsWith("DAO-") && !e.categoria && n("error", `${e.sku}: falta la categoría (Aro, Cabezal o Accesorio).`);
	let a = i.filter((e) => e.sku.startsWith("DAO-") && (e.categoria === "Aro" || e.categoria === "Accesorio")), o = /* @__PURE__ */ new Map();
	for (let e of a) o.has(e.grupo) || o.set(e.grupo, []), o.get(e.grupo).push(e);
	let s = [...o.keys()].sort((e, t) => Z(fl, e) - Z(fl, t)).map((e) => {
		let t = o.get(e);
		return {
			id: e,
			name: _l(t[0].nombre) || e,
			rows: t,
			modulos: [...new Set(t.map((e) => e.modulos))].sort((e, t) => e - t),
			colores: [...new Set(t.map((e) => e.color).filter(Boolean))].sort((e, t) => Z(Y, e) - Z(Y, t))
		};
	}), c = (e) => e.map((e) => r[e]).filter(Boolean), l = {
		bySku: r,
		groups: s,
		moduleName: (e) => `x${e}`,
		formatSize: yl,
		swatch: (e) => _t(e, dl),
		extra: (e) => {
			let t = pl[e];
			return t?.sku && r[t.sku] ? r[t.sku] : null;
		},
		group: (e) => s.find((t) => t.id === e) ?? null,
		colorsFor(e, t) {
			let n = l.group(e);
			return n ? n.colores.filter((e) => n.rows.some((n) => n.modulos === t && n.color === e)) : [];
		},
		ring(e, t, n) {
			return l.group(e)?.rows.find((e) => e.modulos === t && e.color === n) ?? null;
		},
		cabezales: (e) => e ? c(e.cabezales) : [],
		lamparas: (e) => e ? c(e.lamparas) : [],
		frentes: (e) => e ? c(e.frentes) : []
	}, u = /* @__PURE__ */ new Map(), d = (e, t, n) => {
		u.has(t) || u.set(t, {
			level: e,
			items: /* @__PURE__ */ new Set()
		}), u.get(t).items.add(n);
	}, f = (e, t, n) => {
		for (let i of t) r[i] || d("error", `«${i}» figura como ${n} compatible pero no existe en la base`, e.sku);
	};
	for (let e of a) {
		f(e, e.cabezales, "cabezal"), f(e, e.lamparas, "lámpara");
		let t = l.cabezales(e), n = t.length ? [] : l.lamparas(e);
		!t.length && !n.length && d("error", "Aros sin cabezales ni lámparas compatibles", e.sku);
		for (let e of t) f(e, e.lamparas, "lámpara"), l.lamparas(e).length || d("error", "Cabezales sin lámparas compatibles", e.sku);
	}
	for (let [e, t] of u) {
		let r = [...t.items];
		n(t.level, `${e} (${r.length}): ${r.slice(0, 6).join(", ")}${r.length > 6 ? ", …" : ""}`);
	}
	for (let e of t) console.warn(`[arq] configurador Daö: ${e.text}`);
	return l;
}
function Sl(e) {
	let t = e.groups[0];
	return {
		group: t?.id ?? null,
		qty: t?.modulos[0] ?? 1,
		color: null,
		head: null,
		lamp: null
	};
}
function Cl(e, t = {}) {
	return {
		group: e.grupo,
		qty: e.modulos,
		color: e.color,
		head: t.head ?? null,
		headColor: t.headColor ?? null,
		lamp: t.lamp ?? null,
		front: t.front ?? null
	};
}
function wl(e) {
	let t = [];
	for (let n of e.groups) t.push(...[...n.rows].sort((e, t) => e.modulos - t.modulos || Z(Y, e.color) - Z(Y, t.color)));
	return t;
}
function Tl(e, t) {
	for (let n of wl(e)) {
		let r = e.cabezales(n).find((e) => e.lamparas.includes(t));
		if (r) return Cl(n, {
			head: r.grupo,
			lamp: t
		});
		if (n.lamparas.includes(t)) return Cl(n, { lamp: t });
	}
	return null;
}
function El(e, t) {
	let n = Object.values(e.bySku);
	return n.some((e) => e.frentes.includes(t.sku)) ? "front" : n.some((e) => e.lamparas.includes(t.sku)) ? "lamp" : n.some((e) => e.cabezales.includes(t.sku)) ? "head" : (t.categoria === "Aro" || t.categoria === "Accesorio") && e.group(t.grupo) ? "ring" : null;
}
function Dl(e, t) {
	let n = t ? e.bySku[X(t)] : null;
	if (!n) return Sl(e);
	let r = El(e, n);
	if (r === "ring") return Cl(n);
	if (r === "head") {
		let t = wl(e).find((e) => e.cabezales.includes(n.sku));
		if (t) return Cl(t, {
			head: n.grupo,
			headColor: n.color
		});
	}
	if (r === "lamp") return Tl(e, n.sku) ?? Sl(e);
	if (r === "front") {
		let t = Object.values(e.bySku).find((e) => e.frentes.includes(n.sku)), r = t ? Tl(e, t.sku) : null;
		if (!r) return Sl(e);
		let i = e.ring(r.group, r.qty, n.color);
		return i ? Cl(i, {
			head: r.head,
			lamp: t.sku,
			front: n.sku
		}) : {
			...r,
			front: n.sku
		};
	}
	return Sl(e);
}
function Ol(e, t, n, r = { step: null }) {
	let i = (t) => r.step === "head" ? e.cabezales(t).some((e) => e.grupo === r.head) : r.step !== "lamp" || e.cabezales(t).some((e) => e.lamparas.includes(r.lamp)) || t.lamparas.includes(r.lamp), a = e.groups.filter((e) => e.rows.some(i)), o = a.find((e) => e.id === t.group) ?? a[0];
	if (!o) return null;
	let s = [...new Set(o.rows.filter(i).map((e) => e.modulos))].sort((e, t) => e - t), c = s.includes(t.qty) ? t.qty : s[0], l = e.colorsFor(o.id, c).filter((t) => i(e.ring(o.id, c, t))), u = l.includes(t.color) ? t.color : l[0] ?? null, d = e.ring(o.id, c, u);
	if (!d) return null;
	let f = vl(e.cabezales(d), d.color);
	r.step === "lamp" && (f = f.filter((t) => e.cabezales(d).some((e) => e.grupo === t.grupo && e.lamparas.includes(r.lamp))));
	let p = kl(t, f, c), m = f.find((e) => p[e.grupo] > 0) ?? f.find((e) => e.grupo === t.head) ?? f[0] ?? null, h = l.map((t) => e.ring(o.id, c, t)).filter(Boolean), g = [...new Set(h.flatMap((t) => e.cabezales(t)))], _ = (e) => g.filter((t) => t.grupo === e), ee = f.filter((e) => p[e.grupo] > 0).map((e) => e.grupo), te = (ee.length ? ee : m ? [m.grupo] : []).map((e) => new Set(_(e).map((e) => e.color).filter(Boolean))), ne = te.length ? [...te[0]].filter((e) => te.every((t) => t.has(e))).sort((e, t) => Z(Y, e) - Z(Y, t)) : [], re = ne.includes(t.headColor) ? t.headColor : ne.includes(d.color) ? d.color : ne[0] ?? null, v = (e) => t.headColorBy?.[e] ?? re, ie = (e) => _(e).find((t) => t.color === v(e)) ?? _(e).find((e) => e.color === re) ?? _(e)[0] ?? f.find((t) => t.grupo === e) ?? null, ae = Object.fromEntries(f.map((e) => [e.grupo, [...new Set(_(e.grupo).map((e) => e.color).filter(Boolean))].sort((e, t) => Z(Y, e) - Z(Y, t))])), oe = m ? ie(m.grupo) : null, se = ee.map((e) => ({
		row: ie(e),
		qty: p[e]
	})).filter((e) => e.row), y = e.lamparas(oe || d);
	r.step === "lamp" && (y = y.filter((e) => e.sku === r.lamp));
	let b = y.find((e) => e.sku === t.lamp) ?? y[0] ?? null, ce = e.frentes(b), x = ce.find((e) => e.sku === t.front) ?? ce.find((e) => e.color === d.color) ?? ce[0] ?? null, le = s.length > 1 ? `${e.moduleName(c).toLowerCase()} ` : "", ue = `${o.name} ${le}${d.color.toLowerCase()}`.replace(/\s+/g, " ").trim(), de = [{
		qty: 1,
		name: ue,
		sku: d.sku
	}];
	if (se.length) {
		let t = e.extra("bornera");
		t && de.push({
			qty: d.modulos,
			name: t.nombre,
			sku: t.sku
		});
		for (let { row: e, qty: t } of se) de.push({
			qty: t,
			name: `${e.nombre || e.sku} ${(e.color || d.color).toLowerCase()}`.trim(),
			sku: e.sku
		});
	}
	if (b && de.push({
		qty: d.modulos,
		name: b.nombre || b.sku,
		sku: b.sku
	}), x && de.push({
		qty: d.modulos,
		name: `${x.nombre || "Frente"} ${(x.color || d.color).toLowerCase()}`.trim(),
		sku: x.sku
	}), b?.frentes.length) {
		let t = e.extra("panal");
		t && de.push({
			qty: d.modulos,
			name: t.nombre,
			sku: t.sku
		});
	}
	let fe = [
		["Haz", b?.haz],
		["Color de luz", b?.luz],
		["Orientación", [...new Set(se.map(({ row: e }) => e.orientacion).filter(Boolean))].join(" · ")],
		["En el cielorraso", d.visto],
		["Medida del aro", e.formatSize(d.dim)]
	].filter(([, e]) => e), pe = (e) => `${e.nombre || e.sku} ${(e.color || "").toLowerCase()}`.trim();
	return {
		groups: a,
		group: o,
		modulos: s,
		qty: c,
		color: u,
		colors: l,
		ring: d,
		heads: f,
		head: oe,
		headCounts: p,
		headParts: se,
		headColor: re,
		headColors: ne,
		headColorsBy: ae,
		lamps: y,
		lamp: b,
		fronts: ce,
		front: x,
		ringName: ue,
		title: ue.charAt(0).toUpperCase() + ue.slice(1),
		pieces: {
			ring: d.img ? {
				src: d.img,
				label: ue
			} : null,
			head: oe?.img ? {
				src: oe.img,
				label: pe(oe)
			} : null,
			heads: se.filter(({ row: e }) => e.img).map(({ row: e, qty: t }) => ({
				key: e.grupo,
				src: e.img,
				label: pe(e),
				qty: t
			})),
			lamp: b?.img ? {
				src: b.img,
				label: [b.nombre || b.sku, b.haz].filter(Boolean).join(" · ")
			} : null,
			front: x?.img ? {
				src: x.img,
				label: pe(x)
			} : null
		},
		specs: fe,
		parts: de.map((e) => ({
			...e,
			href: n.get(e.sku) ?? null
		}))
	};
}
function kl(e, t, n) {
	let r = new Set(t.map((e) => e.grupo)), i = Object.entries(e.headCounts ?? {}).filter(([e, t]) => r.has(e) && t > 0);
	if (!i.length) {
		let r = t.find((t) => t.grupo === e.head) ?? t[0];
		return r ? { [r.grupo]: n } : {};
	}
	let a = {}, o = n;
	for (let [e, t] of i) {
		let n = Math.min(t, o);
		n > 0 && (a[e] = n), o -= n;
	}
	return a;
}
async function Al() {
	let e = {
		q: "*",
		include_fields: ml.join(",")
	}, t = await f({
		...e,
		filter_by: `familia:=${c(dl)}`
	}), n = new Map(t.map((e) => [X(e.sku), e]));
	for (let t = 0; t < 4; t += 1) {
		let t = /* @__PURE__ */ new Set();
		for (let e of n.values()) for (let r of hl) for (let i of gl(e[r])) n.has(i) || t.add(i);
		if (!t.size) break;
		let r = n.size, i = await f({
			...e,
			filter_by: l("sku", [...t])
		});
		for (let e of i) n.set(X(e.sku), e);
		if (n.size === r) break;
	}
	return [...n.values()].map(bl);
}
function jl(e, t, n) {
	let r = e.bySku[X(n)];
	if (!r) return {
		kind: "compatible",
		items: []
	};
	let i = Object.values(e.bySku), a = (e) => new Set(i.flatMap((t) => t[e])), o = a("cabezales"), s = a("lamparas"), c = a("frentes"), l = (e) => c.has(e.sku) ? 3 : s.has(e.sku) ? 2 : +!!o.has(e.sku), u = (t) => [
		...t.cabezales,
		...t.lamparas,
		...t.frentes
	].map((t) => e.bySku[t]).filter(Boolean), d = (e) => i.filter((t) => u(t).includes(e)), f = (e) => {
		let t = /* @__PURE__ */ new Set(), n = [r];
		for (; n.length;) for (let r of e(n.pop())) t.has(r) || (t.add(r), n.push(r));
		return t;
	}, p = (e) => e.grupo || e.sku, m = l(r) === 2, h = l(r) === 3, g = [];
	g = m ? r.frentes.map((t) => e.bySku[t]).filter(Boolean) : h ? d(r).filter((e) => l(e) === 2) : [...f(u), ...f(d)].filter((e) => l(e) !== 3), g = g.filter((e) => p(e) !== p(r)), g.sort((e, t) => l(e) - l(t) || Z(fl, e.grupo) - Z(fl, t.grupo));
	let _ = /* @__PURE__ */ new Map();
	for (let e of g) _.has(p(e)) || _.set(p(e), e);
	return {
		kind: m ? "accessory" : h ? "product" : "compatible",
		items: [..._.values()].map((n) => {
			let r = i.filter((e) => p(e) === p(n)), a = [...new Set(r.map((e) => e.color).filter(Boolean))].sort((e, t) => Z(Y, e) - Z(Y, t)), o = l(n) === 0 ? [...new Set(r.map((e) => e.modulos))].sort((e, t) => e - t) : [], s = o.length > 1 ? `${o[0]}-${o.at(-1)}` : String(o[0] ?? "");
			return {
				sku: n.sku,
				name: _l(n.nombre) || n.sku,
				image: n.img,
				href: t.get(n.sku) ?? null,
				finishes: a.map((t) => ({
					name: t,
					src: e.swatch(t)
				})),
				meta: o.length ? `${s} ${o.at(-1) === 1 ? "módulo" : "módulos"}` : ""
			};
		})
	};
}
var Ml = null;
function Nl() {
	return Ml ??= (async () => {
		let [e, { groups: t }] = await Promise.all([Al(), Je()]), n = /* @__PURE__ */ new Map();
		for (let e of t) for (let t of e.variants) n.set(t.sku, Et(e.id, t.sku));
		return {
			model: xl(e),
			hrefs: n
		};
	})(), Ml.catch(() => Ml = null), Ml;
}
//#endregion
//#region src/components/dao-configurator/dao-configurator.css?inline
var Pl = ":host{--panel-slow:var(--arq-motion-duration-panel);display:contents}.dialog{box-sizing:border-box;background:var(--arq-color-surface-transparent);width:100%;max-width:none;height:100%;max-height:none;color:var(--arq-color-text-primary);overscroll-behavior:contain;border:0;margin:0;padding:0;position:fixed;inset:0;overflow:hidden}.dialog[open]{display:flex}.dialog:not(.is-open){pointer-events:none}.sheet{box-sizing:border-box;gap:var(--arq-space-gap-xl);width:100%;height:100%;padding:var(--arq-space-padding-xl) var(--arq-layout-gutter) 0;background:var(--arq-color-surface-default);opacity:0;transition-property:opacity,transform;transition-duration:var(--panel-slow);transition-timing-function:var(--arq-motion-easing-standard);flex-direction:column;display:flex;transform:translateY(2%)}.dialog.is-open .sheet{opacity:1;transform:none}.header{justify-content:space-between;align-items:center;gap:var(--arq-space-gap-md);padding-bottom:var(--arq-space-padding-md);border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle);flex:none;display:flex}.title{min-width:0;margin:0}.status{color:var(--arq-color-text-secondary);margin:0}.status:empty{display:none}.body{gap:var(--arq-space-gap-3xl);flex:1;grid-template-columns:minmax(0,1fr) minmax(0,1fr);min-height:0;display:grid}.body[hidden]{display:none}.steps{min-width:0;margin-inline:calc(-1 * var(--arq-space-padding-sm-md));padding-inline:var(--arq-space-padding-sm-md);padding-bottom:var(--arq-space-padding-3xl);overscroll-behavior:contain;scrollbar-width:none;flex-direction:column;display:flex;overflow-y:auto}.steps::-webkit-scrollbar{display:none}.panel{min-width:0;min-height:0;margin-bottom:var(--arq-space-padding-xl);flex-direction:column;display:flex}.step{gap:var(--arq-space-gap-lg);padding-block:var(--arq-space-padding-xl);border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle);flex-direction:column;display:flex}.step:first-child{padding-top:0}.step-head{align-items:baseline;gap:var(--arq-space-gap-sm);display:flex}.step-number{color:var(--arq-color-text-tertiary)}.step-text{flex-direction:column;flex:1;min-width:0;display:flex}.step-title,.summary{margin:0;display:block}.step.is-done{padding-block:0}.step-toggle{box-sizing:border-box;width:calc(100% + 2 * var(--arq-space-padding-sm-md));margin:0 calc(-1 * var(--arq-space-padding-sm-md));padding:var(--arq-space-padding-xl) var(--arq-space-padding-sm-md);border-radius:var(--arq-radius-control);background:var(--arq-color-surface-transparent);color:inherit;font:inherit;text-align:start;cursor:pointer;transition:background-color var(--arq-motion-duration-fast) var(--arq-motion-easing-standard);border:0}.step.is-done:first-child .step-toggle{padding-top:var(--arq-space-padding-sm-md)}.step-toggle:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.step-toggle:focus:not(:focus-visible){outline:none}.change{padding-bottom:var(--arq-space-padding-2xs);color:var(--arq-color-text-primary);flex:none;position:relative}.change:before,.change:after{content:\"\";background:var(--arq-color-border-strong);position:absolute;inset:auto 0 0}.change:before{height:var(--arq-border-default)}.change:after{height:var(--arq-border-strong);transform-origin:100%;transition:transform var(--arq-motion-duration-base) var(--arq-motion-easing-standard);transform:scaleX(0)}@media (hover:hover) and (pointer:fine){.step-toggle:hover{background:var(--arq-color-surface-faint)}.step-toggle:hover .change:after{transform-origin:0;transform:scaleX(1)}}@media (prefers-reduced-motion:reduce){.change:after{transition:none}}.summary{color:var(--arq-color-text-secondary)}.step.is-future .step-title{color:var(--arq-color-text-tertiary)}.mine{color:var(--arq-color-text-tertiary);flex:none}.step-body{align-items:flex-start;gap:var(--arq-space-gap-lg);flex-direction:column;display:flex}.step-body>arq-option-group{align-self:stretch}.note{color:var(--arq-color-text-secondary);margin:0}.counter{gap:var(--arq-space-gap-sm);flex-direction:column;align-self:stretch;display:flex}.counter-hint{justify-content:space-between;align-items:baseline;gap:var(--arq-space-gap-xs) var(--arq-space-gap-md);margin-bottom:var(--arq-space-gap-xs);color:var(--arq-color-text-secondary);flex-wrap:wrap;display:flex}.counter-hint p{margin:0}.counter-tally{color:var(--arq-color-text-tertiary);white-space:nowrap}.counter-tally.is-complete{color:var(--arq-color-text-primary)}.count-row{justify-content:space-between;align-items:center;gap:var(--arq-space-gap-md);padding:var(--arq-space-padding-sm-md) var(--arq-space-padding-md);border:var(--arq-border-default) solid var(--arq-color-border-subtle);transition:border-color var(--arq-motion-duration-fast) var(--arq-motion-easing-standard);flex-wrap:wrap;display:flex}.count-row.is-selected{border-color:var(--arq-color-border-default)}.count-text{gap:var(--arq-space-gap-xs);flex-direction:column;min-width:0;display:flex}.count-meta{color:var(--arq-color-text-secondary)}.stepper{--arq-icon-button-border:var(--arq-color-border-default);align-items:center;gap:var(--arq-space-gap-sm);flex:none;display:flex}.count-value{min-width:var(--arq-icon-md);text-align:center;font-variant-numeric:tabular-nums}.count-row:not(.is-selected) .count-value{color:var(--arq-color-text-tertiary)}.count-colors{padding-top:var(--arq-space-padding-xs);flex-basis:100%}.notice{align-self:stretch;align-items:flex-start;gap:var(--arq-space-gap-sm);padding:var(--arq-space-padding-sm-md) var(--arq-space-padding-md);background:var(--arq-color-surface-soft);color:var(--arq-color-text-secondary);margin:0;display:flex}.notice .icon{width:var(--arq-icon-md);height:var(--arq-icon-md);margin-top:calc((var(--arq-type-body-compact-leading) - var(--arq-icon-md)) / 2);color:var(--arq-color-text-warning);flex:none}.notice-title{color:var(--arq-color-text-primary)}.step.is-entering{animation:arq-step-in var(--arq-motion-duration-base) var(--arq-motion-easing-out) both}@keyframes arq-step-in{0%{opacity:0;transform:translateY(var(--arq-space-gap-md))}}@keyframes arq-step-fade{0%{opacity:0}}@media (prefers-reduced-motion:reduce){.step.is-entering{animation:arq-step-fade var(--arq-motion-duration-fade) var(--arq-motion-easing-standard) both}}.hint{color:var(--arq-color-text-secondary);margin:0}.photos{grid-template-columns:repeat(var(--cols,2), minmax(0, 1fr));grid-template-rows:repeat(var(--rows,1), minmax(0, 1fr));gap:var(--arq-space-gap-sm);flex:1;min-height:0;margin:0;display:grid}.photos figure{gap:var(--arq-space-gap-xs);min-width:0;min-height:0;padding:var(--arq-space-padding-sm);background:var(--arq-color-surface-subtle);transition-property:opacity,transform;transition-duration:var(--arq-motion-duration-slow);transition-timing-function:var(--arq-motion-easing-out);flex-direction:column;margin:0;display:flex}.photos figure.is-new{opacity:0;transform:scale(var(--arq-motion-scale-enter))}.media{flex:1;min-height:0;position:relative}.media img{object-fit:contain;mix-blend-mode:multiply;opacity:0;width:100%;height:100%;transition:opacity var(--arq-motion-duration-slow) var(--arq-motion-easing-illumination-image);display:block;position:absolute;inset:0}.media img.is-loaded{opacity:1}.media img.is-leaving{opacity:0}.photos figcaption{align-items:center;gap:var(--arq-space-gap-xs);color:var(--arq-color-text-secondary);flex:none;display:flex}@media (prefers-reduced-motion:reduce){.photos figure{transition-duration:var(--arq-motion-duration-fade)}.photos figure.is-new{transform:none}.media img{transition-duration:var(--arq-motion-duration-fade)}}.back{margin-top:var(--arq-space-gap-lg);align-self:flex-start}.final{gap:var(--arq-space-gap-2xl);padding-bottom:var(--arq-space-padding-xl);flex-direction:column;display:flex}.result-block{flex-direction:column;display:flex}.result-summary{gap:var(--arq-space-gap-lg)}.result-parts{gap:var(--arq-space-gap-sm)}.final.is-entering{animation:arq-step-in var(--arq-motion-duration-base) var(--arq-motion-easing-out) both}@media (prefers-reduced-motion:reduce){.final.is-entering{animation:arq-step-fade var(--arq-motion-duration-fade) var(--arq-motion-easing-standard) both}}.result-head{justify-content:space-between;align-items:baseline;gap:var(--arq-space-gap-lg);display:flex}.result-title{flex:1;min-width:0;margin:0}.change-all{flex:none}.specs{gap:var(--arq-space-gap-xs) var(--arq-space-gap-lg);grid-template-columns:auto minmax(0,1fr);margin:0;display:grid}.specs dt{color:var(--arq-color-text-secondary)}.specs dd,.parts-title{margin:0}.parts{gap:var(--arq-space-gap-md);flex-direction:column;margin:0;padding:0;list-style:none;display:flex}.part{gap:var(--arq-space-gap-sm);grid-template-columns:auto minmax(0,1fr);align-items:baseline;display:grid}.qty{color:var(--arq-color-text-secondary)}.part-body{align-items:flex-start;gap:var(--arq-space-gap-xs);flex-direction:column;min-width:0;display:flex}.print{align-self:flex-start}@media (width<=767px){.sheet{padding-inline:var(--arq-layout-gutter)}.body{margin-inline:calc(-1 * var(--arq-space-padding-sm-md));padding-inline:var(--arq-space-padding-sm-md);overscroll-behavior:contain;scrollbar-width:none;flex-direction:column;display:flex;overflow-y:auto}.body::-webkit-scrollbar{display:none}.steps{overflow-y:visible}.panel{margin-bottom:var(--arq-space-padding-xl);flex:none;order:-1}.panel:empty{display:none}.result-summary{order:1}.print{order:2}.result-parts{order:3}.photos{--photo-col:calc((100vw - 2 * var(--arq-layout-gutter) - var(--arq-space-gap-sm)) / 2);min-height:calc((100vw - 2 * var(--arq-layout-gutter)) * 4 / 5);grid-template-rows:repeat(var(--rows,1), minmax(calc(var(--photo-col) * 4 / 5), 1fr))}}", Fl = () => matchMedia("(prefers-reduced-motion: reduce)").matches, Q = {
	title: "Armá tu Daö",
	loading: "Cargando configurador…",
	empty: "No hay piezas de Daö para armar.",
	error: "No se pudo cargar el configurador. Probá de nuevo en unos minutos.",
	noHead: "Este aro no lleva cabezal: la lámpara va directo al aro.",
	headsHint: "Un cabezal por módulo, podés combinarlos.",
	headsCount: (e, t) => `${e} de ${t} elegidos`,
	add: (e) => `Sumar ${e}`,
	remove: (e) => `Quitar ${e}`,
	noLamp: "No hay lámparas cargadas para este armado.",
	frontTitle: "Accesorios requeridos",
	frontText: "esta lámpara se instala con un frente y un panal antideslumbrante que se suman al armado.",
	next: "Continuar",
	finish: "Finalizar",
	change: "Cambiar",
	back: "Ver resumen",
	parts: "Piezas para este armado",
	print: "Descargar configuración",
	generating: "Generando…"
}, Il = {
	ring: "Aro",
	head: "Cabezal",
	lamp: "Lámpara"
}, Ll = {
	group: "ring",
	qty: "ring",
	color: "ring",
	head: "head",
	headColor: "head",
	lamp: "lamp",
	lampBeam: "lamp",
	front: "lamp"
}, Rl = {
	group: [
		"qty",
		"color",
		"head",
		"headColor",
		"lamp",
		"front"
	],
	qty: ["color"],
	head: [
		"headColor",
		"lamp",
		"lampBeam",
		"front"
	],
	lamp: ["lampBeam", "front"],
	lampBeam: ["front"]
}, zl = {
	group: ["qty", "color"],
	qty: ["color"],
	head: ["headColor"],
	lamp: ["lampBeam"]
}, Bl = (e) => Object.values(e ?? {}).reduce((e, t) => e + t, 0), Vl = (e, t) => {
	let n = getComputedStyle(e).getPropertyValue(t).trim();
	return (parseFloat(n) || 0) * (n.endsWith("ms") ? 1 : 1e3);
};
(class extends L {
	static tag = "arq-dao-configurator";
	static styles = Pl;
	static template = `<dialog class="dialog" data-arq-theme="light" aria-label="${Q.title}"><div class="sheet"><div class="header"><p class="title role-heading-2">${Q.title}</p><arq-icon-button class="close" icon="close" size="large">Cerrar</arq-icon-button></div><p class="status role-body" role="status"></p><div class="body" hidden><div class="steps"></div><aside class="panel" aria-live="polite"></aside></div></div></dialog>`;
	#e = null;
	#t = null;
	#n = null;
	#r = null;
	#i = /* @__PURE__ */ new Map();
	#a = null;
	#o = null;
	#s = /* @__PURE__ */ new Set();
	#c = /* @__PURE__ */ new Set();
	#l = null;
	#u = !1;
	#d = null;
	#f = {};
	#p = null;
	setup() {
		let e = this.shadowRoot;
		this.#e = e.querySelector("dialog"), z(this.#e), e.querySelector(".close").addEventListener("click", () => this.close()), this.#e.addEventListener("cancel", (e) => {
			e.preventDefault(), this.close();
		}), this.#e.addEventListener("keydown", (e) => {
			e.key === "Escape" && (e.preventDefault(), this.close());
		});
		let t = e.querySelector(".steps");
		t.addEventListener("arq:change", (t) => {
			let n = t.target.closest?.("arq-option-group");
			if (!n || !e.contains(n)) return;
			t.stopPropagation();
			let r = n.dataset.step;
			if (!r) return;
			let i = t.detail.value;
			if (r.startsWith("headColorBy:")) {
				let e = r.slice(12);
				this.#o.headColorBy = {
					...this.#o.headColorBy,
					[e]: i
				}, this.#y(`[data-step="${CSS.escape(r)}"] [value="${CSS.escape(String(i))}"]`);
				return;
			}
			if (r === "lamp" || r === "lampBeam") {
				let e = Ol(this.#r, this.#o, this.#i);
				if (r === "lamp") {
					let t = e.lamps.filter((e) => (e.nombre || e.sku) === i);
					this.#o.lamp = (t.find((t) => t.haz === e.lamp?.haz) ?? t[0])?.sku ?? null;
				} else this.#o.lamp = i;
				this.#m(r), this.#y(`[data-step="${CSS.escape(r)}"] [value="${CSS.escape(String(i))}"]`);
				return;
			}
			r === "group" && (this.#o.headColor = null, this.#o.headColorBy = null), this.#o[r] = r === "qty" ? Number(i) : i, r === "head" && (this.#o.headCounts = null), this.#m(r), this.#y(`[data-step="${CSS.escape(r)}"] [value="${CSS.escape(String(i))}"]`);
		}), t.addEventListener("click", (e) => {
			let t = e.target.closest?.(".print");
			if (t) return this.#R(t);
			if (e.target.closest?.(".change-all")) {
				this.#u = !0, this.#l = null, this.#y(), this.shadowRoot.querySelector(".step-toggle")?.focus({ preventScroll: !0 });
				return;
			}
			if (e.target.closest?.(".back")) {
				this.#u = !1, this.#y();
				return;
			}
			let n = e.target.closest?.("[data-count]");
			if (n) return this.#h(n.dataset.head, n.dataset.count === "add");
			let r = e.target.closest?.(".next"), i = e.target.closest?.(".step-toggle");
			r ? this.#v() : i && (this.#l = i.closest(".step").dataset.section, this.#d = this.#l, this.#y());
		});
	}
	#m(e) {
		this.#c.add(e);
		for (let t of Rl[e] ?? []) this.#c.delete(t), this.#s.delete(Ll[t]);
		for (let t of zl[e] ?? []) this.#c.add(t);
	}
	#h(e, t) {
		let n = Ol(this.#r, this.#o, this.#i);
		if (!n) return;
		let r = this.#c.has("head") ? { ...n.headCounts } : {}, i = Bl(r);
		if (t) {
			if (i < n.qty) r[e] = (r[e] ?? 0) + 1;
			else {
				let [t] = Object.entries(r).filter(([t, n]) => t !== e && n > 0).sort((e, t) => t[1] - e[1])[0] ?? [];
				if (!t) return;
				--r[t], r[e] = (r[e] ?? 0) + 1;
			}
		} else {
			if (!r[e]) return;
			--r[e];
		}
		for (let e of Object.keys(r)) r[e] || delete r[e];
		this.#o.headCounts = r, this.#o.head = Object.keys(r)[0] ?? this.#o.head, Bl(r) ? this.#c.has("head") || this.#m("head") : (this.#c.delete("head"), this.#s.delete("head"));
		let a = this.shadowRoot, o = (t) => `[data-head="${CSS.escape(e)}"][data-count="${t}"]`;
		this.#y(o(t ? "add" : "remove")), a.querySelector(o(t ? "add" : "remove"))?.disabled && a.querySelector(o(t ? "remove" : "add"))?.focus({ preventScroll: !0 });
	}
	async show(e, t) {
		this.#t = t ?? this.#V(), this.#z();
		let n = this.shadowRoot;
		n.querySelector(".body").hidden = !0, this.#g(Q.loading);
		try {
			this.#a ??= Nl();
			let { model: e, hrefs: t } = await this.#a;
			this.#r = e, this.#i = t;
		} catch (e) {
			console.error("[arq] configurador Daö: no se pudo cargar", e), this.#a = null, this.#g(Q.error);
			return;
		}
		if (!this.#r.groups.length) {
			this.#g(Q.empty);
			return;
		}
		this.#g(""), this.#o = Dl(this.#r, null), this.#s = /* @__PURE__ */ new Set(), this.#c = /* @__PURE__ */ new Set(), this.#l = null, this.#d = null, this.#f = {}, this.#F = !1, this.shadowRoot.querySelector(".panel").replaceChildren(), this.#y(), n.querySelector(".steps").scrollTop = 0;
	}
	close() {
		this.#B();
	}
	#g(e) {
		this.shadowRoot.querySelector(".status").textContent = e;
	}
	#_(e) {
		return this.#s.has(e);
	}
	#v() {
		this.#l && this.#s.add(this.#l), this.#l = null, this.#u = !1, this.#y();
	}
	#y(e) {
		let t = Ol(this.#r, this.#o, this.#i);
		if (!t) return;
		!this.#C(t) && this.#o.headColorBy && (this.#o.headColorBy = null, t = Ol(this.#r, this.#o, this.#i)), this.#o = {
			group: t.group.id,
			qty: t.qty,
			color: t.color,
			head: t.head?.grupo ?? null,
			headCounts: this.#o.headCounts ? t.headCounts : null,
			headColor: this.#c.has("head") ? t.headColor : this.#o.headColor ?? null,
			headColorBy: this.#c.has("head") && this.#C(t) ? {
				...this.#o.headColorBy,
				...Object.fromEntries(t.headParts.map(({ row: e }) => [e.grupo, e.color]))
			} : this.#o.headColorBy ?? null,
			lamp: t.lamp?.sku ?? null,
			front: t.front?.sku ?? null
		};
		let n = {
			head: t.headParts.map(({ row: e, qty: t }) => `${t}×${e.sku}`).join(" ") || null,
			lamp: t.lamp?.sku ?? null,
			front: t.front?.sku ?? null
		};
		this.#f.head !== void 0 && (n.head !== this.#f.head && this.#s.delete("head"), (n.lamp !== this.#f.lamp || n.front !== this.#f.front) && this.#s.delete("lamp")), this.#f = n;
		let r = [
			"ring",
			...t.heads.length ? ["head"] : [],
			"lamp"
		];
		this.#l && !r.includes(this.#l) && (this.#l = null);
		let i = this.#l;
		this.#l ??= r.find((e) => !this.#_(e)) ?? null, this.#l && this.#l !== i && (this.#d = this.#l);
		let a = this.shadowRoot;
		a.querySelector(".body").hidden = !1;
		let o = r.every((e) => this.#_(e));
		o || (this.#u = !1);
		let s;
		o && !this.#u ? s = [this.#P(t, r)] : (this.#F = !1, this.#p = null, s = this.#b(t, r), o && s.push(this.#N())), a.querySelector(".steps").replaceChildren(...s), this.#A(t, r);
		let c = a.querySelector(".is-entering");
		c && (c.scrollIntoView({
			behavior: Fl() ? "auto" : "smooth",
			block: "nearest"
		}), this.#d = null), e && a.querySelector(e)?.focus({ preventScroll: !0 });
	}
	#b(e, t) {
		return t.map((n, r) => {
			let i = n === this.#l ? "active" : this.#_(n) ? "done" : "future", a = document.createElement("section");
			a.className = `step is-${i}`, n === this.#d && a.classList.add("is-entering"), a.dataset.section = n;
			let o = i === "done", s = document.createElement(o ? "button" : "div");
			s.className = "step-head", o && (s.type = "button", s.classList.add("step-toggle"), s.setAttribute("aria-label", `${Q.change}: ${Il[n]}, ${this.#x(e, n)}`));
			let c = document.createElement("span");
			c.className = "step-number role-body-xl", c.textContent = String(r + 1);
			let l = document.createElement("span");
			l.className = "step-text";
			let u = document.createElement("span");
			if (u.className = "step-title role-body-xl", u.textContent = Il[n], l.append(u), o) {
				let t = document.createElement("span");
				t.className = "summary role-body-compact", t.textContent = this.#x(e, n), l.append(t);
			}
			if (s.append(c, l), o) {
				let e = document.createElement("span");
				e.className = "change role-body-regular", e.textContent = Q.change, s.append(e);
			}
			if (a.append(s), i === "active") {
				let r = document.createElement("div");
				r.className = "step-body";
				let { nodes: i, ready: o } = this.#w(e, n);
				r.append(...i);
				let s = document.createElement("arq-button");
				s.className = "next", s.disabled = !o, s.textContent = t.every((e) => e === n || this.#_(e)) ? Q.finish : Q.next, r.append(s), a.append(r);
			}
			return a;
		});
	}
	#x(e, t) {
		if (t === "ring") return e.title;
		if (t === "head") return e.head ? this.#S(e) : "";
		let n = [e.lamp?.nombre || e.lamp?.sku, e.lamp?.haz].filter(Boolean).join(" · ");
		return e.fronts.length > 1 && e.front?.color ? `${n} · frente ${e.front.color.toLowerCase()}` : n;
	}
	#S(e) {
		let t = this.#C(e);
		return e.headParts.map(({ row: e, qty: n }) => `${t ? `${n}× ` : ""}${e.nombre || e.sku} ${(e.color || "").toLowerCase()}`.trim()).join(" + ");
	}
	#C(e) {
		return e.qty > 1 && e.heads.length > 1;
	}
	#w(e, t) {
		let n = [], r = (e, t, r, i, a = {}) => n.push({
			key: e,
			label: t,
			selected: r,
			options: i,
			...a
		}), i = [];
		if (t === "ring") r("group", "Aro", e.group.id, e.groups.map((e) => ({
			value: e.id,
			title: e.name
		})), { hideLabel: !0 }), e.modulos.length > 1 && r("qty", "Módulos", String(e.qty), e.modulos.map((e) => ({
			value: String(e),
			title: this.#r.moduleName(e)
		}))), r("color", "Color", e.color ?? "", e.colors.map((e) => this.#E(e, e))), e.heads.length || i.push(Q.noHead);
		else if (t === "head") this.#C(e) ? n.push({
			key: "head",
			node: () => this.#T(e),
			ready: () => this.#c.has("head") && Bl(e.headCounts) === e.qty
		}) : (r("head", "Cabezal", e.head?.grupo ?? "", e.heads.map((e) => ({
			value: e.grupo,
			title: e.nombre || e.sku,
			meta: e.orientacion
		})), { hideLabel: !0 }), e.headColors.length > 1 && r("headColor", "Color", e.headColor ?? "", e.headColors.map((e) => this.#E(e, e))));
		else {
			if (e.lamps.length) {
				let t = /* @__PURE__ */ new Map();
				for (let n of e.lamps) {
					let e = n.nombre || n.sku;
					t.has(e) || t.set(e, []), t.get(e).push(n);
				}
				r("lamp", "Lámpara", e.lamp ? e.lamp.nombre || e.lamp.sku : "", [...t].map(([e, t]) => ({
					value: e,
					title: e,
					meta: [t.length === 1 ? t[0].haz : "", t[0].luz].filter(Boolean).join(" · ")
				})), { hideLabel: !0 });
				let n = t.get(e.lamp?.nombre || e.lamp?.sku) ?? [];
				n.length > 1 && r("lampBeam", "Ángulo", e.lamp.sku, n.map((e) => ({
					value: e.sku,
					title: e.haz || e.sku
				})));
			} else i.push(Q.noLamp);
			e.fronts.length && (n.push({
				key: "notice",
				node: () => this.#O(Q.frontTitle, Q.frontText),
				ready: () => !0
			}), r("front", "Color del frente", e.front?.sku ?? "", e.fronts.map((e) => ({
				value: e.sku,
				title: e.color || e.nombre || e.sku,
				image: e.img
			}))));
		}
		let a = [], o = !0;
		for (let e of n) {
			if (!o) break;
			if (e.node) {
				a.push(e.node()), o = e.ready();
				continue;
			}
			e.options.length === 1 && this.#c.add(e.key), a.push(this.#D(e.key, e.label, this.#c.has(e.key) ? e.selected : null, e.options, { hideLabel: e.hideLabel })), o = this.#c.has(e.key);
		}
		return o && a.push(...i.map((e) => this.#k(e))), {
			nodes: a,
			ready: o
		};
	}
	#T(e) {
		let t = this.#c.has("head") ? e.headCounts : {}, n = Bl(t), r = document.createElement("div");
		r.className = "counter", r.setAttribute("role", "group"), r.setAttribute("aria-label", "Cabezales");
		let i = document.createElement("div");
		i.className = "counter-hint role-body-compact";
		let a = document.createElement("p");
		a.textContent = Q.headsHint;
		let o = document.createElement("p");
		o.className = "counter-tally", o.classList.toggle("is-complete", n === e.qty), o.setAttribute("role", "status"), o.textContent = Q.headsCount(n, e.qty), i.append(a, o), r.append(i);
		for (let n of e.heads) {
			let i = t[n.grupo] ?? 0, a = n.nombre || n.sku, o = document.createElement("div");
			o.className = "count-row", o.classList.toggle("is-selected", i > 0);
			let s = document.createElement("span");
			s.className = "count-text";
			let c = document.createElement("span");
			if (c.className = "role-body-regular", c.textContent = a, s.append(c), n.orientacion) {
				let e = document.createElement("span");
				e.className = "count-meta role-body-compact", e.textContent = n.orientacion, s.append(e);
			}
			let l = document.createElement("span");
			l.className = "stepper";
			let u = (e, t, r, i) => {
				let a = document.createElement("arq-icon-button");
				return a.icon = t, a.background = "outline", a.dataset.head = n.grupo, a.dataset.count = e, a.disabled = i, a.textContent = r, a;
			}, d = document.createElement("span");
			d.className = "count-value role-body-medium", d.textContent = String(i), l.append(u("remove", "minus", Q.remove(a), !i), d, u("add", "plus", Q.add(a), i >= e.qty)), o.append(s, l);
			let f = e.headColorsBy[n.grupo] ?? [];
			if (i > 0 && f.length > 1) {
				let t = e.headParts.find((e) => e.row.grupo === n.grupo)?.row.color ?? "", r = this.#D(`headColorBy:${n.grupo}`, `Color de ${a}`, t, f.map((e) => this.#E(e, e)), { hideLabel: !0 });
				r.classList.add("count-colors"), o.append(r);
			}
			r.append(o);
		}
		return r;
	}
	#E(e, t, n = e) {
		return {
			value: n,
			title: e,
			swatch: t ? this.#r.swatch(t) : null
		};
	}
	#D(e, t, n, r, { hideLabel: i = !1 } = {}) {
		let a = document.createElement("arq-option-group");
		a.dataset.step = e, a.type = "cards", a.label = t, a.labelHidden = i;
		for (let e of r) {
			let t = document.createElement("arq-option-tile");
			if (t.value = e.value, t.selected = e.value === n, t.textContent = e.title, e.image) {
				let n = document.createElement("img");
				n.slot = "media", n.src = e.image, n.alt = "", n.loading = "lazy", t.append(n);
			}
			if (e.swatch) {
				let n = document.createElement("arq-swatch");
				n.slot = "swatch", n.src = e.swatch, n.textContent = e.title, t.append(n);
			}
			if (e.meta) {
				let n = document.createElement("span");
				n.slot = "meta", n.textContent = e.meta, t.append(n);
			}
			a.append(t);
		}
		return a;
	}
	#O(e, t) {
		let n = document.createElement("p");
		n.className = "notice role-body-compact", n.setAttribute("role", "note"), n.innerHTML = R("alert");
		let r = document.createElement("span"), i = document.createElement("span");
		return i.className = "notice-title role-body-compact-medium", i.textContent = `${e}: `, r.append(i, t), n.append(r), n;
	}
	#k(e) {
		let t = document.createElement("p");
		return t.className = "note role-body", t.textContent = e, t;
	}
	#A(e, t) {
		let n = (e) => this.#c.has(e), r = [], i = (e, t) => t && r.push({
			...t,
			key: e
		});
		if (n("group") && i("ring", e.pieces.ring), t.includes("head") && n("head")) for (let t of e.pieces.heads) i(`head:${t.key}`, {
			...t,
			qty: e.qty > 1 ? t.qty : 0
		});
		n("lamp") && i("lamp", e.pieces.lamp), (n("front") || n("lamp") && e.fronts.length === 1) && i("front", e.pieces.front);
		let a = this.shadowRoot.querySelector(".panel"), o = a.querySelector(".photos");
		if (!r.length) {
			a.replaceChildren();
			return;
		}
		o || (o = document.createElement("div"), o.className = "photos", a.replaceChildren(o));
		let s = !Fl() && this.#e.open, c = new Map([...o.children].map((e) => [e.dataset.key, e])), l = new Map(s ? [...c].map(([e, t]) => [e, t.getBoundingClientRect()]) : []);
		o.style.setProperty("--cols", r.length === 1 ? "1" : "2"), o.style.setProperty("--rows", String(Math.ceil(r.length / 2)));
		let u = r.map((e) => {
			let t = c.get(e.key) ?? this.#j(e.key);
			return this.#M(t, e, s), t;
		});
		if ((u.length !== o.children.length || u.some((e, t) => o.children[t] !== e)) && o.replaceChildren(...u), !s) return;
		let d = Vl(this, "--arq-motion-duration-panel"), f = getComputedStyle(this).getPropertyValue("--arq-motion-easing-standard").trim() || "ease";
		for (let e of u) {
			let t = l.get(e.dataset.key);
			if (!t) continue;
			let n = e.getBoundingClientRect();
			if (!n.width || !n.height) continue;
			let r = Math.min(t.width / n.width, t.height / n.height), i = t.left + t.width / 2 - (n.left + n.width / 2), a = t.top + t.height / 2 - (n.top + n.height / 2);
			Math.abs(i) < 1 && Math.abs(a) < 1 && Math.abs(r - 1) < .01 || e.animate([{ transform: `translate(${i}px, ${a}px) scale(${r})` }, { transform: "none" }], {
				duration: d,
				easing: f
			});
		}
	}
	#j(e) {
		let t = document.createElement("figure");
		t.dataset.key = e, t.className = "is-new";
		let n = document.createElement("div");
		n.className = "media";
		let r = document.createElement("arq-count-badge");
		r.className = "badge";
		let i = document.createElement("figcaption");
		i.className = "role-body-sm";
		let a = document.createElement("span");
		return a.className = "caption-text", i.append(r, a), t.append(n, i), t;
	}
	#M(e, t, n) {
		let r = e.querySelector(".media"), i = t.qty ? `${t.qty} × ${t.label}` : t.label, a = r.querySelector("img");
		if (a?.dataset.src !== t.src) {
			let i = document.createElement("img");
			i.dataset.src = t.src, i.decoding = "async";
			let o = () => {
				if (i.isConnected) {
					for (let e of r.querySelectorAll("img")) e === i || e.classList.contains("is-leaving") || (e.classList.add("is-leaving"), e.alt = "", n ? setTimeout(() => e.remove(), Vl(this, "--arq-motion-duration-slow")) : e.remove());
					i.classList.add("is-loaded"), e.classList.remove("is-new");
				}
			}, s = () => n ? requestAnimationFrame(() => requestAnimationFrame(o)) : o();
			i.addEventListener("load", s, { once: !0 }), i.addEventListener("error", s, { once: !0 }), i.src = t.src, r.prepend(i), a = i;
		}
		a.alt = i;
		let o = e.querySelector(".badge");
		n && t.qty && o.count && o.count !== t.qty && o.animate([{ transform: "scale(1.25)" }, { transform: "none" }], {
			duration: Vl(this, "--arq-motion-duration-base"),
			easing: "ease-out"
		}), o.count = t.qty || null, e.querySelector(".caption-text").textContent = t.qty ? `× ${t.label}` : t.label;
	}
	#N() {
		let e = document.createElement("arq-button");
		return e.className = "back", e.setAttribute("type", "underline"), e.setAttribute("show-underline", ""), e.textContent = Q.back, e;
	}
	#P(e, t) {
		this.#p = e;
		let n = document.createElement("section");
		n.className = "final", this.#F || n.classList.add("is-entering"), this.#F = !0;
		let r = document.createElement("div");
		r.className = "result-head";
		let i = document.createElement("p");
		i.className = "result-title role-heading-3", i.textContent = this.#I(e);
		let a = document.createElement("arq-button");
		a.className = "change-all", a.setAttribute("type", "underline"), a.setAttribute("show-underline", ""), a.textContent = Q.change, a.setAttribute("label", `${Q.change}: configuración`), r.append(i, a);
		let o = document.createElement("div");
		if (o.className = "result-block result-summary", o.append(r), e.specs.length) {
			let t = document.createElement("dl");
			t.className = "specs role-body";
			for (let [n, r] of e.specs) {
				let e = document.createElement("dt");
				e.textContent = n;
				let i = document.createElement("dd");
				i.textContent = r, t.append(e, i);
			}
			o.append(t);
		}
		let s = document.createElement("p");
		s.className = "parts-title role-body-medium", s.textContent = Q.parts;
		let c = document.createElement("ul");
		c.className = "parts";
		for (let t of e.parts) c.append(this.#L(t));
		let l = document.createElement("div");
		l.className = "result-block result-parts", l.append(s, c);
		let u = document.createElement("arq-button");
		return u.className = "print", u.loadingLabel = Q.generating, u.textContent = Q.print, n.append(o, l, u), n;
	}
	#F = !1;
	#I(e) {
		let t = e.headParts.map(({ row: e }) => {
			let t = e.nombre || e.sku, n = t.search(/cabezal/i);
			return `${(n >= 0 ? t.slice(n) : t).toLowerCase()} ${(e.color || "").toLowerCase()}`.trim();
		});
		if (!t.length) return e.title;
		let n = t.length > 1 ? `${t.slice(0, -1).join(", ")} y ${t.at(-1)}` : t[0];
		return `${e.title} con ${n}`;
	}
	#L(e) {
		let t = document.createElement("li");
		t.className = "part";
		let n = document.createElement("span");
		n.className = "qty role-body", n.textContent = `${e.qty}×`;
		let r = document.createElement("div");
		if (r.className = "part-body", e.href) {
			let t = document.createElement("arq-text-link");
			t.href = e.href, t.textContent = e.name, r.append(t);
		} else {
			let t = document.createElement("span");
			t.className = "role-body", t.textContent = e.name, r.append(t);
		}
		let i = document.createElement("arq-sku");
		return i.size = "compact", i.textContent = e.sku, r.append(i), t.append(n, r), t;
	}
	#R(e) {
		let t = this.#p;
		if (!t || e?.loading) return;
		let { ring: n, heads: r, lamp: i, front: a } = t.pieces, o = t.qty > 1, s = {
			title: this.#I(t),
			pieces: [
				n,
				...r.map((e) => ({
					...e,
					qty: o ? e.qty : 0
				})),
				i,
				a
			].filter(Boolean).map(({ src: e, label: t, qty: n }) => ({
				src: e,
				label: t,
				qty: n || 0
			})),
			specs: t.specs,
			parts: t.parts
		};
		if (this.emit("configuration", s), !s.pending || !e) return;
		e.loading = !0;
		let c = () => e.loading = !1;
		s.pending.then(c, c);
	}
	#z() {
		let e = this.#e;
		clearTimeout(this.#n), this.#n = null, e.open || (e.showModal(), e.offsetHeight, this.shadowRoot.querySelector(".close").focus({ preventScroll: !0 })), e.classList.add("is-open");
	}
	#B() {
		let e = this.#e;
		if (this.#n || !e.open) return;
		e.classList.remove("is-open");
		let { transitionDuration: t } = getComputedStyle(this.shadowRoot.querySelector(".sheet")), n = Math.max(0, ...t.split(",").map((e) => (parseFloat(e) || 0) * (e.trim().endsWith("ms") ? 1 : 1e3)));
		this.#n = setTimeout(() => {
			this.#n = null, e.close();
			let t = this.#t;
			this.#t = null, t?.focus?.(), this.emit("close", { restored: !!t });
		}, n);
	}
	#V() {
		let e = document.activeElement;
		for (; e?.shadowRoot?.activeElement;) e = e.shadowRoot.activeElement;
		return e;
	}
}).define();
//#endregion
//#region src/components/ficha-producto/ficha-producto.css?inline
var Hl = ":host{min-width:0;color:var(--arq-color-text-primary);display:block}.page:not([data-ready]) .needs-data{display:none}.hero{background:var(--arq-color-surface-default);color:var(--arq-color-text-primary);transition-property:background-color,color;transition-duration:var(--arq-illumination-bg-duration), var(--arq-theme-text-duration,var(--arq-motion-duration-fast));transition-delay:0s, var(--arq-theme-text-delay,0s);transition-timing-function:var(--arq-illumination-bg-easing), var(--arq-theme-text-easing,var(--arq-motion-easing-standard));padding:0}.configurator{column-gap:var(--arq-space-gap-3xl);grid-template-columns:minmax(0,14fr) minmax(0,9fr);align-items:start;display:grid}.gallery-column{top:var(--arq-layout-navbar-height);height:calc(100svh - var(--arq-layout-navbar-height));flex-direction:column;min-width:0;display:flex;position:sticky;overflow:hidden}.config-cta-inline{flex:none}.config-cta[hidden]{display:none}.gallery{flex:auto;min-height:0}.breadcrumb{z-index:2;top:var(--arq-space-padding-xl);left:var(--arq-space-padding-xl-2xl);max-width:calc(100% - 2 * var(--arq-space-padding-xl-2xl));position:absolute}.iluminar[hidden]{display:none}.iluminar{z-index:2;right:var(--arq-space-padding-xl-2xl);bottom:var(--arq-space-padding-xl);position:absolute}.configurator-column{justify-content:space-between;gap:var(--arq-space-gap-2xl);box-sizing:border-box;min-width:0;min-height:calc(100svh - var(--arq-layout-navbar-height));padding-right:var(--page-gutter);padding-bottom:var(--arq-space-padding-xl);flex-direction:column;display:flex}.header{align-items:flex-start;gap:var(--arq-space-gap-xl);padding-top:var(--arq-space-padding-xl);flex-direction:column;min-width:0;display:flex}.title-row{align-items:flex-start;gap:var(--arq-space-gap-sm);flex-direction:column;align-self:stretch;min-width:0;display:flex}.title{overflow-wrap:anywhere;-webkit-hyphens:auto;hyphens:auto;min-width:0;max-width:100%}.info{gap:var(--arq-space-gap-lg);flex-direction:column;flex:auto;min-width:0;display:flex}.status{color:var(--arq-color-text-secondary);margin:0}.status:empty{padding:0;position:absolute}.description{max-width:100%;color:var(--arq-color-text-tertiary);overflow-wrap:break-word;text-transform:lowercase}.description:first-letter{text-transform:uppercase}@media (width>=1920px){.description{font-size:var(--arq-type-body-size);line-height:var(--arq-type-body-leading)}}.description:has(>.variant-description[hidden]){display:none}::slotted([slot=description]){font:inherit!important;color:inherit!important;margin:0!important}.options{gap:var(--arq-space-gap-xl-2xl);flex-direction:column;display:flex}.buy{gap:var(--arq-space-gap-md);flex-direction:column;display:flex}.actions{gap:var(--arq-space-gap-md);display:flex}.datasheet-error:empty{position:absolute}.actions arq-button{flex:1 1 0}.details{padding:var(--arq-space-section-md) var(--page-gutter) var(--arq-space-gap-4xl) var(--arq-space-section-lg)}.spec-tabs{gap:var(--arq-space-gap-xl);border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle);display:flex;overflow-x:auto}.spec-tabs:not([hidden])+.spec-panels .accordion{border-top:0}.spec-tabs:not([hidden])+.spec-panels .spec-panel[data-tab=configurador]{padding-top:var(--arq-space-gap-xl)}.cota{width:auto;max-width:100%;height:auto;display:block}.cota[hidden]{display:none}.with-cota{gap:var(--arq-space-gap-xl);display:grid}@media (width<=767px){.with-cota{gap:var(--arq-space-gap-2xl)}.cota.is-expandable{cursor:zoom-in}.cota.is-expandable:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}}@media (width>=1024px){.with-cota{column-gap:var(--arq-space-gap-4xl);grid-template-columns:repeat(2,minmax(0,1fr));align-items:start}}.spec-tabs[hidden],.spec-panel[hidden]{display:none}.accordion{border-top:var(--arq-border-default) solid var(--arq-color-border-default);flex-direction:column;min-width:0;display:flex}.ambient-block{margin-bottom:var(--arq-space-section-md);position:relative}.ambient{--ambient-height:40rem;--ambient-gap:var(--arq-space-gap-md);gap:var(--ambient-gap);padding-left:var(--page-gutter);overscroll-behavior-x:contain;scrollbar-width:none;display:flex;overflow-x:auto}@media (width<=1023px){.ambient{--ambient-height:30rem}}@media (width<=767px){.ambient{--ambient-height:20rem}}.ambient::-webkit-scrollbar{display:none}.ambient:after{content:\"\";width:calc(var(--page-gutter) - var(--ambient-gap));flex:none}.ambient-controls{display:none}.ambient{touch-action:pan-x pan-y pinch-zoom}.ambient img:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:calc(-1 * var(--arq-border-strong))}@media (hover:hover) and (pointer:fine){.ambient{cursor:zoom-in}.ambient[data-arq-scrollable]{cursor:grab}.ambient[data-arq-dragging]{cursor:grabbing;-webkit-user-select:none;user-select:none}}@media (hover:none),(pointer:coarse){.ambient-controls{justify-content:flex-end;gap:var(--arq-space-gap-sm);padding:var(--arq-space-gap-md) var(--page-gutter) 0;display:flex}}.ambient img{width:auto;height:var(--ambient-height);aspect-ratio:auto 4/5;object-fit:cover;background:var(--arq-color-surface-subtle);flex:none;max-width:none;display:block}.story-block{padding-bottom:var(--arq-space-section-sm)}.story{grid-template-columns:minmax(0, 1fr) minmax(0, var(--arq-layout-measure-wide));column-gap:var(--arq-space-gap-3xl);box-sizing:border-box;min-height:100svh;padding:var(--arq-space-section-lg);background:var(--arq-color-surface-default);color:var(--arq-color-text-primary);align-items:start;display:grid;position:relative}.story-bg{clip-path:inset(0);pointer-events:none;position:absolute;inset:0;overflow:hidden}.story-bg img{object-fit:cover;width:100%;height:100%;display:block;position:fixed;inset:0}@media (prefers-reduced-motion:reduce){.story-bg img{position:absolute}}.story-title,.story-body{min-width:0;position:relative}.story-title{max-width:var(--arq-layout-measure);grid-column:1}.story-body{align-self:center;align-items:flex-start;gap:var(--arq-space-gap-lg);flex-direction:column;grid-column:2;display:flex}.story-text{gap:var(--arq-space-gap-sm);flex-direction:column;display:flex}::slotted(h2[slot=story-title]){font-family:var(--arq-font-family-sans)!important;font-weight:var(--arq-font-weight-light)!important;font-size:var(--arq-type-heading-2-size)!important;line-height:var(--arq-type-heading-2-leading)!important;letter-spacing:var(--arq-font-tracking-normal)!important;color:inherit!important;margin:0!important}::slotted(h3[slot=story-text]),::slotted(p[slot=story-text]),::slotted(ul){font-family:var(--arq-font-family-sans)!important;font-weight:var(--arq-font-weight-regular)!important;font-size:var(--arq-type-body-xl-size)!important;line-height:var(--arq-type-body-xl-leading)!important;letter-spacing:var(--arq-font-tracking-normal)!important;color:inherit!important;margin:0!important}::slotted(ul){padding:0 0 0 var(--arq-space-padding-lg)!important;list-style-type:\"- \"!important}.story-link{align-self:flex-start}.cards{gap:var(--arq-space-gap-sm);margin:calc(-1 * var(--arq-space-gap-xs));padding:var(--arq-space-gap-xs);overscroll-behavior-x:contain;scroll-snap-type:x mandatory;scrollbar-width:none;display:flex;overflow-x:auto}.cards::-webkit-scrollbar{display:none}@media (hover:hover) and (pointer:fine){.cards[data-arq-scrollable]{cursor:grab}.cards[data-arq-dragging]{cursor:grabbing;scroll-snap-type:none;-webkit-user-select:none;user-select:none}}.cards arq-product-card{flex:0 0 var(--arq-layout-card-min);min-width:0;width:var(--arq-layout-card-min);scroll-snap-align:start}.cards arq-product-card:last-child{scroll-snap-align:end}@media (width>=1440px) and (height>=860px){.cards arq-product-card{flex-basis:var(--arq-layout-card-min-wide);width:var(--arq-layout-card-min-wide)}}.glossary{gap:var(--arq-space-gap-md);padding-block:var(--arq-space-section-md);scroll-margin-top:var(--arq-layout-navbar-height);flex-direction:column;display:flex}.glossary-title{padding:0 var(--page-gutter)}::slotted([slot=glossary-title]:focus){outline:none}.media-portrait,.media-wide{object-fit:cover;background:var(--arq-color-surface-subtle);width:100%;min-width:0;display:block}.inspiration{align-items:flex-start;gap:var(--arq-space-gap-lg);padding:var(--arq-space-section-md) var(--arq-space-section-lg) var(--arq-space-section-xl);display:flex}.inspiration-copy{flex:0 1 var(--arq-layout-measure);gap:var(--arq-space-gap-lg);flex-direction:column;order:2;min-width:0;display:flex}.inspiration-text{color:var(--arq-color-text-primary)}::slotted([slot=inspiration]){font:inherit!important;color:inherit!important;margin:0!important}.inspiration-images{align-items:flex-start;gap:var(--arq-space-gap-md);flex:1 1 0;order:1;min-width:0;display:flex}.inspiration-images:empty{display:none}.inspiration-images .media-wide{aspect-ratio:940/568;object-position:50% 80%;flex:940 1 0}.inspiration-images .media-portrait{aspect-ratio:346/447;flex:346 1 0}.collection{padding:var(--arq-space-padding-5xl) 0 var(--arq-space-padding-5xl) var(--page-gutter);background:var(--arq-neutral-700);color:var(--arq-color-text-inverse);align-items:flex-start;display:flex}.collection-link,.collection-controls{--arq-color-action-primary:var(--arq-color-text-inverse);--arq-color-border-strong:var(--arq-color-text-inverse);--arq-color-text-primary:var(--arq-color-text-inverse);--arq-color-text-secondary:var(--arq-color-text-inverse)}.collection-intro{align-items:flex-start;gap:var(--arq-space-gap-md);flex-direction:column;flex:none;max-width:100%;display:flex}.collection-rail{flex-direction:column;flex:auto;min-width:0;display:flex}.collection-rail>.cards{margin-inline-end:0}.collection-rail>.cards arq-product-card{--arq-color-text-primary:var(--arq-color-text-inverse)}.collection-rail>.cards arq-product-card [slot=name]{color:var(--arq-color-text-inverse)}.collection-rail>.cards:after{content:\"\";width:calc(var(--page-gutter) - var(--arq-space-gap-sm));flex:none}.collection-controls{--arq-color-border-disabled:var(--arq-color-icon-disabled);margin-inline-end:var(--page-gutter);margin-bottom:var(--arq-space-gap-lg);align-self:flex-end}.collection-controls[hidden]{display:none}@media (width>=1024px){.collection{grid-template-columns:fit-content(var(--arq-layout-measure)) minmax(0, 1fr);column-gap:var(--arq-space-gap-4xl);align-items:start;display:grid}.collection-rail{display:contents}.collection-controls{grid-area:1/2;justify-self:end}.collection-intro{grid-area:2/1}.collection-rail>.cards{grid-area:2/2}}@media (width>=1024px) and (not ((width>=1440px) and (height>=860px))){.collection{padding-block:var(--arq-space-padding-3xl)}}@media (width<=1023px){.hero{padding-top:0}.configurator{align-items:stretch;gap:var(--arq-space-gap-2xl);flex-direction:column;display:flex}.configurator-column{display:contents}.header{padding:0 var(--page-gutter)}.gallery-column{height:auto;position:relative;top:auto}.iluminar{right:var(--arq-space-padding-md);bottom:var(--arq-space-padding-md)}.breadcrumb{top:var(--arq-space-padding-md);left:var(--arq-space-padding-md);max-width:calc(100% - 2 * var(--arq-space-padding-md))}.info,.buy{padding-inline:var(--page-gutter)}.buy{padding-bottom:var(--arq-space-padding-xl)}.details{padding:var(--arq-space-section-md) var(--page-gutter) var(--arq-space-section-xs)}.story{row-gap:var(--arq-space-gap-4xl);padding:var(--arq-space-section-sm) var(--page-gutter);grid-template-rows:auto 1fr;grid-template-columns:minmax(0,1fr)}.story-title,.story-body{grid-column:1;max-width:none}.story-body{align-self:end}.inspiration{align-items:stretch;gap:var(--arq-space-gap-xl);padding-inline:var(--page-gutter);flex-direction:column}.inspiration-images{flex:none;order:0}.inspiration-copy{flex:none;order:1}.collection{gap:var(--arq-space-gap-4xl);flex-direction:column}.collection-rail{align-self:stretch}}@media (width<=767px){.cards arq-product-card{flex-basis:var(--arq-layout-card-min);width:var(--arq-layout-card-min)}.gallery{--gallery-ratio:4 / 5}.header{gap:var(--arq-space-gap-2xl)}.actions{flex-direction:column}.actions arq-button{flex:none;width:100%}.ambient{--ambient-gap:var(--arq-space-gap-sm-md)}.inspiration-images{flex-direction:column}.inspiration-images>*{flex:none;width:100%}}", $ = {
	loading: "Cargando producto…",
	notFound: "No encontramos este producto.",
	error: "No se pudo cargar el producto. Probá de nuevo en unos minutos.",
	datasheet: "Ficha técnica",
	commercial: "Características comerciales",
	configure: "Configura tu Daö",
	generating: "Generando…",
	datasheetError: "No se pudo generar la ficha técnica. Probá de nuevo.",
	previous: "Anterior",
	next: "Siguiente"
}, Ul = .16, Wl = 16, Gl = matchMedia("(max-width: 767px)"), Kl = (e) => {
	let t = Gl.matches;
	e.classList.toggle("is-expandable", t), t ? (e.tabIndex = 0, e.setAttribute("role", "button"), e.setAttribute("aria-label", `Ampliar ${e.alt}`)) : (e.removeAttribute("tabindex"), e.removeAttribute("role"), e.removeAttribute("aria-label"));
}, ql = ["tori visera"], Jl = ["afo"], Yl = (e) => String(e ?? "").normalize("NFD").replace(/\p{M}/gu, "").trim().toLowerCase(), Xl = (e) => Jl.includes(Yl(e.name)) || e.environment?.includes("Exterior") && !ql.includes(Yl(e.name)), Zl = (e) => {
	let { sampleFrom: t, sampleBase: r } = n.images;
	if (e.startsWith(t)) return r + e.slice(t.length);
	let i = new URL(r).origin;
	return e.startsWith(`${i}/`) ? e : null;
}, Ql = (e) => {
	let t = e / 255;
	return t <= .04045 ? t / 12.92 : ((t + .055) / 1.055) ** 2.4;
}, $l = "dao", eu = "tori-visera", tu = /^PAR11-.*FRENTE/i, nu = class extends L {
	static tag = "arq-ficha-producto";
	static styles = G + Hl + Lc;
	static template = `<div class="page"><div class="hero"><div class="configurator"><div class="gallery-column"><arq-product-gallery class="gallery" fill inset-thumbs><arq-breadcrumb class="breadcrumb needs-data" slot="overlay"></arq-breadcrumb><arq-toggle class="iluminar needs-data" slot="overlay" show-label>Iluminar</arq-toggle></arq-product-gallery></div><div class="configurator-column"><div class="header"><div class="title-row"><div class="title role-display"><slot name="title"></slot></div><div class="description role-body-compact"><span class="variant-description" hidden></span></div><arq-sku class="sku needs-data" size="compact" data-arq-copy-motion></arq-sku></div></div><div class="info"><p class="status role-body" role="status"></p><div class="options needs-data"></div></div><div class="buy needs-data"><arq-checkbox class="compare" show-label>Comparar</arq-checkbox><div class="actions"><arq-button class="datasheet">Generar ficha técnica</arq-button><arq-button class="to-downloads" type="outline">Ver descargas</arq-button></div><arq-form-message class="datasheet-error" tone="error"></arq-form-message></div></div></div></div><div class="details needs-data"><div class="spec-tabs" role="tablist" aria-label="Información técnica" hidden></div><div class="spec-panels"></div></div><arq-compatible-products class="compatible needs-data"><span slot="title" class="compatible-title"><slot name="compatible-title"></slot></span><span slot="title" class="accessory-title" hidden><slot name="accessory-title"></slot></span><span slot="title" class="accessory-compatible-title" hidden><slot name="accessory-compatible-title"></slot></span><span slot="title" class="product-compatible-title" hidden><slot name="product-compatible-title"></slot></span><arq-button class="config-cta config-cta-inline" slot="action" hidden>${$.configure}</arq-button></arq-compatible-products><div class="ambient-block needs-data" hidden><div class="ambient" role="region" aria-label="Galería de ambiente" tabindex="0"></div><div class="ambient-controls"><arq-icon-button class="ambient-prev" icon="chevron-left" size="large" background="outline" disabled>${$.previous}</arq-icon-button><arq-icon-button class="ambient-next" icon="chevron-right" size="large" background="outline">${$.next}</arq-icon-button></div></div>` + zc + "<div class=\"glossary needs-data\"><div class=\"glossary-title role-display-sm\"><slot name=\"glossary-title\"></slot></div><arq-variants-table class=\"table\" downloads=\"downloads-modal\"></arq-variants-table></div><div class=\"story-block needs-data\" hidden><div class=\"story\" data-arq-theme=\"dark\" hidden><div class=\"story-bg\" hidden><img alt=\"\" loading=\"lazy\"></div><div class=\"story-title\"><slot name=\"story-title\"></slot></div><div class=\"story-body\"><div class=\"story-text\"><slot name=\"story-text\"></slot><slot name=\"story-list\"></slot></div><arq-button class=\"story-link\" type=\"underline\" show-underline show-icon icon=\"arrow-up-right\" hidden></arq-button></div></div></div><div class=\"inspiration\" hidden><div class=\"inspiration-copy\"><div class=\"inspiration-text role-body-lg\"><slot name=\"inspiration\"></slot></div></div><div class=\"inspiration-images needs-data\"></div></div><div class=\"collection needs-data\" hidden><div class=\"collection-intro\"><div class=\"collection-title role-heading-1\"><slot name=\"collection-title\"></slot></div><arq-button class=\"collection-link\" type=\"underline\" show-underline show-icon icon=\"arrow-up-right\"></arq-button></div><div class=\"collection-rail\"><arq-carousel-controls class=\"collection-controls\" buttons=\"carousel\" progress=\"scroll\" for=\"collection-rail\" step=\"item\" label-prev=\"Productos anteriores\" label-next=\"Productos siguientes\"></arq-carousel-controls><div class=\"cards\" id=\"collection-rail\"></div></div></div></div><arq-dao-configurator class=\"dao-config\"></arq-dao-configurator><arq-compare-bar class=\"compare-bar\"></arq-compare-bar><arq-compare-picker class=\"picker\"></arq-compare-picker><arq-download-modal id=\"downloads-modal\" show-product><slot name=\"modal-title\" slot=\"title\"></slot><arq-form-message class=\"datasheet-error\" slot=\"message\" tone=\"error\"></arq-form-message></arq-download-modal>";
	#e = null;
	#t = null;
	#n = null;
	#r = null;
	#i = null;
	#a = null;
	#o = () => this.shadowRoot.querySelectorAll(".cota").forEach(Kl);
	connectedCallback() {
		super.connectedCallback(), Gl.addEventListener("change", this.#o), this.#t?.connect(), this.#n?.connect();
	}
	disconnectedCallback() {
		Gl.removeEventListener("change", this.#o), this.#t?.disconnect(), this.#n?.disconnect(), this.#a?.close();
	}
	#s = {};
	#c = null;
	setup() {
		let e = this.shadowRoot, t = e.querySelector(".spec-tabs");
		new sa(t, { items: "arq-tab" }), t.addEventListener("arq:change", (e) => {
			e.stopPropagation(), this.#F(e.detail.value);
		}), this.#d(), e.querySelector("slot[name=\"inspiration\"]").addEventListener("slotchange", () => this.#J()), this.#J(), this.#H(), this.#n = new ul(this, e.querySelector(".cards")), this.#n.connect(), this.#r = new ResizeObserver(() => this.#Z()), this.#r.observe(e.querySelector(".cards"));
		let n = matchMedia("(max-width: 1023px)"), r = () => e.querySelector(".iluminar").showLabel = !n.matches;
		n.addEventListener("change", r), r(), e.querySelector(".iluminar").addEventListener("arq:change", (e) => this.#b(e.detail.checked)), this.#g(), ka() && (e.querySelector(".iluminar").checked = !0, ba(() => this.#C(!0))), e.querySelector(".options").addEventListener("arq:change", (e) => {
			let t = e.target.closest("[data-attribute]")?.dataset.attribute;
			if (!t || !e.detail?.selected) return;
			let { variants: n, variantAttributes: r } = this.#e;
			this.#s = ct(n, r, this.#s, t, e.detail.value), this.#T(), this.#D({ updateUrl: !0 });
		}), e.querySelector(".datasheet").addEventListener("click", (e) => this.#z(this.#c, e.currentTarget)), e.querySelector(".to-downloads").addEventListener("click", (t) => {
			this.#G(this.#c), e.querySelector("arq-download-modal").show(t.currentTarget);
		});
		for (let t of e.querySelectorAll(".config-cta")) t.addEventListener("click", () => e.querySelector(".dao-config").show(this.#c, t));
		let i = e.querySelector(".compare"), a = e.querySelector(".compare-bar");
		i.addEventListener("arq:change", (e) => {
			e.stopPropagation(), this.#c && (e.detail.checked ? a.add(this.#R()) || (i.checked = !1) : a.remove(this.#c));
		}), a.addEventListener("arq:compare-change", () => {
			i.checked = a.has(this.#c), o.open && this.#L();
		});
		let o = e.querySelector(".picker");
		a.addEventListener("arq:add", (e) => {
			e.stopPropagation(), o.show();
		}), o.addEventListener("arq:search", () => this.#L()), o.addEventListener("arq:close", (e) => {
			e.detail.restored || a.focusAdd();
		}), o.addEventListener("arq:add", (e) => {
			let { sku: t, name: n, cardMeta: r, meta: i, image: o } = e.detail.item;
			a.add({
				sku: t,
				name: n,
				meta: r ?? i,
				image: o
			});
		}), e.querySelector(".table").addEventListener("arq:downloads", (e) => e.detail.sku ? this.#G(e.detail.sku) : this.#K()), e.querySelector("arq-download-modal").addEventListener("arq:download", (e) => {
			e.stopPropagation(), this.#z(e.currentTarget.dataset.sku, e.target.closest("arq-download-item"));
		}), this.#l();
	}
	async #l() {
		let e = this.getAttribute("data-group");
		this.setAttribute("aria-busy", "true"), this.#u($.loading);
		let t = null, n = !1;
		try {
			t = e ? await on(e) : null;
		} catch (e) {
			n = !0, console.error("[arq] ficha-producto: no se pudo cargar el catálogo", e);
		}
		if (this.removeAttribute("aria-busy"), !t) {
			this.#u(n ? $.error : $.notFound);
			return;
		}
		this.#e = t, this.#u("");
		let r = t.group.variantGroup ?? "";
		if (y(t.group.family) === $l || /^DAO-/i.test(r) || t.group.id === eu || tu.test(r)) {
			let e = this.shadowRoot.querySelector(".iluminar");
			e.hidden = !0, e.checked && (e.checked = !1, ba(() => this.#C(!1)));
		}
		let i = new URLSearchParams(location.search).get("sku");
		this.#s = et(t.variants, t.variantAttributes, i), this.#f(), this.#U(t.group.story), this.#q(t.group.inspiration), this.#w(), this.#T(), this.#D({
			updateUrl: !0,
			sku: t.variants.find((e) => e.sku === i)?.sku ?? t.variants.find((e) => e.isDefault)?.sku
		});
		try {
			this.#E(t);
		} catch {}
		this.#V(), this.#W(), this.#Y(), this.#X(), this.shadowRoot.querySelector(".page").toggleAttribute("data-ready", !0);
	}
	#u(e) {
		let t = this.shadowRoot.querySelector(".status");
		t.textContent = e;
	}
	#d() {
		let e = this.querySelector(":scope > img[slot=\"image\"]");
		e && this.shadowRoot.querySelector(".gallery").append(e);
	}
	#f() {
		let { group: e, collection: t } = this.#e, n = this.shadowRoot, { crumbs: r, see: i } = iu(e, t);
		n.querySelector(".breadcrumb").replaceChildren(...r.map(({ label: e, href: t, menu: n }) => {
			let r = document.createElement("arq-breadcrumb-item");
			return r.theme = "transparent", r.href = t, n && (r.dataset.arqMenu = n), r.showSeparator = !0, r.textContent = e, r;
		}), Object.assign(document.createElement("arq-breadcrumb-item"), {
			current: !0,
			theme: "transparent",
			textContent: e.name
		}));
		for (let e of n.querySelectorAll(".collection-link")) e.hidden = !i, i && (e.href = i.href, e.textContent = i.label);
	}
	#p(e) {
		if (!this.#e.group.variantNames || !e) return;
		let t = this.querySelector(":scope > [slot=\"title\"]");
		t && t.textContent !== e && (t.textContent = e);
		let n = this.shadowRoot.querySelector(".breadcrumb").lastElementChild;
		n && n.textContent !== e && (n.textContent = e);
	}
	#m = /* @__PURE__ */ new Map();
	#h = 0;
	#g() {
		let e = this.shadowRoot, t = e.querySelector(".gallery"), n = () => {
			cancelAnimationFrame(this.#h), this.#h = requestAnimationFrame(() => this.#_());
		};
		t.addEventListener("load", n, !0), t.addEventListener("arq:slide", n);
		let r = new ResizeObserver(n);
		r.observe(t), r.observe(e.querySelector(".iluminar")), r.observe(e.querySelector(".breadcrumb")), n();
	}
	async #_() {
		let e = this.shadowRoot, t = e.querySelector(".iluminar"), n = e.querySelector(".breadcrumb"), r = e.querySelector(".gallery"), i = r.currentImage, a = i && !i.hidden && i.getAttribute("src") ? i.src : null, o = async (e) => {
			if (!a) return null;
			try {
				return await this.#v(a, i, e);
			} catch {
				return null;
			}
		}, s = Object.entries(r.overlays), [c, l, ...u] = await Promise.all([
			o(t),
			o(n),
			...s.map(([, e]) => o(e))
		]);
		if (a && (i.src !== a || r.currentImage !== i)) return;
		let d = e.querySelector(".gallery").images.find((e) => [e.src, e.srcOn].some((e) => e && new URL(be(e, 1600), location.href).href === a));
		for (let e of [d?.src, d?.srcOn]) e && this.#y(e).catch(() => {});
		let f = (e) => e !== null && e < Ul;
		t.theme = f(c) ? "inverse" : "default", c === null || f(c) ? t.removeAttribute("data-arq-theme") : t.setAttribute("data-arq-theme", "light"), l === null ? n.removeAttribute("data-arq-theme") : n.setAttribute("data-arq-theme", f(l) ? "dark" : "light"), s.forEach(([e], t) => {
			let n = u[t];
			r.setOverlayTone(e, n === null ? null : f(n) ? "dark" : "light");
		});
	}
	async #v(e, t, n) {
		let r = this.shadowRoot.querySelector(".gallery").frame.getBoundingClientRect(), i = n.getBoundingClientRect();
		if (!r.width || !r.height || !i.width || !i.height || i.right <= r.left || i.left >= r.right || i.bottom <= r.top || i.top >= r.bottom) return null;
		let a = await this.#y(e);
		if (!a) return null;
		let o = getComputedStyle(t), s = (e) => parseFloat(o.getPropertyValue(`padding-${e}`)) || 0, c = t.dataset.fit === "air", l = c ? {
			left: r.left + s("left"),
			top: r.top + s("top"),
			width: r.width - s("left") - s("right"),
			height: r.height - s("top") - s("bottom")
		} : r, u = (c ? Math.min : Math.max)(l.width / a.naturalWidth, l.height / a.naturalHeight), d = l.left + (l.width - a.naturalWidth * u) / 2, f = l.top + (l.height - a.naturalHeight * u) / 2, p = document.createElement("canvas");
		p.width = Wl, p.height = Wl;
		let m = p.getContext("2d", { willReadFrequently: !0 });
		m.fillStyle = getComputedStyle(t).getPropertyValue("--arq-color-surface-subtle").trim() || "transparent", m.fillRect(0, 0, Wl, Wl), m.drawImage(a, (i.left - d) / u, (i.top - f) / u, i.width / u, i.height / u, 0, 0, Wl, Wl);
		let { data: h } = m.getImageData(0, 0, Wl, Wl), g = 0;
		for (let e = 0; e < h.length; e += 4) g += .2126 * Ql(h[e]) + .7152 * Ql(h[e + 1]) + .0722 * Ql(h[e + 2]);
		return g / (h.length / 4);
	}
	#y(e) {
		if (!this.#m.has(e)) {
			let t = Zl(e), n = (e, t) => {
				let n = new Image();
				return t && (n.crossOrigin = "anonymous"), n.src = e, n.decode().then(() => n);
			}, r = t ? n(e, !1).then(() => n(t, !0)) : Promise.resolve(null);
			r.catch(() => this.#m.delete(e)), this.#m.set(e, r);
		}
		return this.#m.get(e);
	}
	#b(e) {
		Aa(void 0, [this.shadowRoot.querySelector(".hero"), ...document.querySelectorAll("arq-navbar")]), this.#C(e);
	}
	#x = 0;
	#S() {
		let e = this.shadowRoot, t = [
			e.querySelector(".breadcrumb"),
			e.querySelector(".iluminar"),
			...Object.values(e.querySelector(".gallery").overlays)
		], n = {
			"--arq-theme-text-delay": "0s",
			"--arq-theme-text-duration": "var(--arq-illumination-image-duration)",
			"--arq-theme-text-easing": "var(--arq-illumination-image-easing)"
		};
		for (let e of t) for (let [t, r] of Object.entries(n)) e.style.setProperty(t, r);
		clearTimeout(this.#x), this.#x = setTimeout(() => {
			for (let e of t) for (let t of Object.keys(n)) e.style.removeProperty(t);
		}, 1200);
	}
	#C(e) {
		let t = this.shadowRoot.querySelector(".hero");
		for (let n of [t, ...document.querySelectorAll("arq-navbar")]) e ? n.setAttribute("data-arq-theme", "dark") : n.removeAttribute("data-arq-theme");
		ha(), this.#S(), this.#_(), Ca(e, document.querySelector("arq-navbar") ?? t);
	}
	#w() {
		let { variants: e, variantAttributes: t } = this.#e, n = rt(e, t, this.#s).map(({ attribute: e, options: t }) => {
			let n = v(e), r = document.createElement("arq-option-group");
			r.dataset.attribute = e, r.label = n.label;
			let i = n.control === "swatches", a = i ? document.createElement("arq-swatch-picker") : r;
			i && (r.type = "swatches", r.append(a));
			for (let e of t) {
				let t = document.createElement(i ? "arq-swatch" : "arq-option-tile");
				t.value = e.value, t.textContent = e.value;
				let n = i ? this.#e.finishImages?.[e.value] : null;
				n && (t.src = n), a.append(t);
			}
			return r;
		});
		this.shadowRoot.querySelector(".options").replaceChildren(...n);
	}
	#T() {
		let { variants: e, variantAttributes: t } = this.#e, n = this.shadowRoot;
		for (let { attribute: r, options: i } of rt(e, t, this.#s)) {
			n.querySelectorAll(`.options [data-attribute="${CSS.escape(r)}"] :is(arq-swatch, arq-option-tile)`).forEach((e, t) => {
				e.selected = i[t].selected, e.disabled = i[t].disabled;
			});
			let e = n.querySelector(`.options [data-attribute="${CSS.escape(r)}"]`);
			e?.type === "swatches" && (e.value = i.find((e) => e.selected)?.value ?? "");
		}
	}
	#E({ group: e }) {
		if (navigator.connection?.saveData) return;
		let t = e.variants.slice(0, 40).flatMap((e) => [e.images?.gallery?.[0] ?? e.images?.studio, e.images?.galleryOn?.[0] ?? e.images?.studioOn]).filter(Boolean).map((e) => be(e, _e)), n = [...new Set(t)], r = () => {
			let e = n.shift();
			if (!e || !this.isConnected) return;
			let t = new Image();
			t.onload = t.onerror = () => setTimeout(r, 80), t.src = e;
		};
		setTimeout(r, 1500);
	}
	#D({ updateUrl: e = !1, sku: t = null } = {}) {
		let { group: n, variants: r } = this.#e, i = Object.keys(this.#s).length ? $e(r, this.#s) : null, a = r.find((e) => e.sku === t) ?? i ?? r.find((e) => e.isDefault) ?? r[0];
		if (!a || a.sku === this.#c) return;
		this.#c = a.sku;
		let o = En(n, a.sku), s = this.shadowRoot;
		s.querySelector(".sku").textContent = o.sku, this.#p(o.name);
		let c = s.querySelector(".variant-description");
		c.textContent = o.description ?? "", c.hidden = !o.description, s.querySelector(".gallery").toggleAttribute("zoom", Xl(n)), s.querySelector(".gallery").images = o.images;
		for (let e of [o.images?.[0]?.src, o.images?.[0]?.srcOn]) e && this.#y(e).catch(() => {});
		this.#j(o.sections, o.cota, o.name), this.#P();
		let l = s.querySelector(".compare");
		if (l.checked = s.querySelector(".compare-bar").has(o.sku), e) {
			let e = new URL(location.href);
			e.searchParams.set("sku", a.sku), history.replaceState(history.state, "", e);
		}
		this.emit("variant", { sku: a.sku });
	}
	#O = "specs";
	#k(e, t = !0) {
		let n = document.createElement("arq-spec-list");
		n.columns = t;
		for (let t of e.rows) {
			let e = document.createElement("arq-spec-row"), r = document.createElement("span");
			r.slot = "label", r.textContent = t.label, e.append(r, String(t.value)), n.append(e);
		}
		return n;
	}
	#A(e, t) {
		let n = au(e, `Cotas de ${t}`, "cota");
		n.addEventListener("error", () => n.hidden = !0), n.draggable = !1, Kl(n);
		let r = () => {
			Gl.matches && this.#B().open(0, n, [{
				src: n.currentSrc || n.src,
				alt: n.alt,
				original: !0
			}]);
		};
		return n.addEventListener("click", r), n.addEventListener("keydown", (e) => {
			(e.key === "Enter" || e.key === " ") && Gl.matches && (e.preventDefault(), r());
		}), n.addEventListener("load", () => {
			let e = parseFloat(getComputedStyle(n).getPropertyValue("--arq-layout-pdf-cover-image"));
			e && n.naturalWidth && n.naturalHeight && (n.style.width = `${n.naturalWidth * Math.sqrt(e * e / (n.naturalWidth * n.naturalHeight))}px`);
		}), n;
	}
	#j(e, t, n) {
		let r = this.shadowRoot, i = r.querySelector(".spec-tabs"), a = r.querySelector(".spec-panels"), o = [...a.querySelectorAll("arq-accordion-item")], s = e.filter((e) => e.id !== "comercial"), c = o.length ? new Set(o.filter((e) => e.open).map((e) => e.dataset.section)) : new Set(s.map((e) => e.id)), l = (e, r) => {
			let i = document.createElement("div");
			i.className = "accordion";
			for (let a of e) {
				let e = document.createElement("arq-accordion-item");
				e.dataset.section = a.id, e.open = r(a);
				let o = document.createElement("span");
				if (o.slot = "title", o.textContent = a.id === "comercial" ? $.commercial : a.label, a.id === "materiales" && t) {
					let r = document.createElement("div");
					r.className = "with-cota", r.append(this.#k(a, !1), this.#A(t, n)), e.append(o, r);
				} else e.append(o, this.#k(a));
				i.append(e);
			}
			return i;
		}, u = l(s, (e) => c.has(e.id)), d = e.find((e) => e.id === "comercial"), f = [s.length && {
			id: "specs",
			label: "Especificaciones",
			content: u
		}, d && {
			id: "commercial",
			label: d.label,
			content: l([d], () => !o.length || c.has("comercial"))
		}].filter(Boolean);
		f.some((e) => e.id === this.#O) || (this.#O = f[0]?.id), i.replaceChildren(...f.map((e) => {
			let t = document.createElement("arq-tab");
			return t.id = `spec-tab-${e.id}`, t.value = e.id, t.setAttribute("aria-controls", `spec-panel-${e.id}`), t.selected = e.id === this.#O, t.textContent = e.label, t;
		})), a.replaceChildren(...f.map((e) => {
			let t = document.createElement("div");
			return t.className = "spec-panel", t.id = `spec-panel-${e.id}`, t.dataset.tab = e.id, t.setAttribute("role", "tabpanel"), t.setAttribute("aria-labelledby", `spec-tab-${e.id}`), t.hidden = e.id !== this.#O, t.append(e.content), t;
		})), i.hidden = f.length < 2, r.querySelector(".details").hidden = !f.length;
	}
	#M = 0;
	#N(e, t) {
		for (let n of [
			"compatible-title",
			"accessory-title",
			"accessory-compatible-title",
			"product-compatible-title"
		]) e.querySelector(`.${n}`).hidden = n !== t;
	}
	async #P() {
		let e = this.shadowRoot.querySelector(".compatible"), t = ++this.#M, n = this.shadowRoot.querySelector(".config-cta-inline");
		if (this.#e.collection?.id !== "dao" && !this.#c?.startsWith("PAR11-")) {
			let { accessories: t = [], related: r = [] } = this.#e;
			this.#N(e, t.length ? "accessory-compatible-title" : r.length ? "product-compatible-title" : null), e.items = t.length ? t : r, n.hidden = !0;
			return;
		}
		try {
			let { model: r, hrefs: i } = await Nl();
			if (t !== this.#M) return;
			let { kind: a, items: o } = jl(r, i, this.#c);
			this.#N(e, {
				accessory: "accessory-title",
				product: "product-compatible-title"
			}[a] ?? "compatible-title"), n.hidden = a !== "compatible", e.items = o;
		} catch (r) {
			console.error("[arq] productos compatibles: no se pudieron cargar", r), t === this.#M && (e.items = [], n.hidden = !0);
		}
	}
	#F(e) {
		let t = this.shadowRoot;
		this.#O = e;
		for (let n of t.querySelectorAll(".spec-tabs arq-tab")) n.selected = n.value === e;
		for (let n of t.querySelectorAll(".spec-panel")) n.hidden = n.dataset.tab !== e;
	}
	#I = 0;
	async #L() {
		let e = this.shadowRoot, t = e.querySelector(".picker"), n = e.querySelector(".compare-bar").items.map((e) => e.sku), r = ++this.#I;
		t.count = n.length;
		try {
			let { items: e } = await Un({
				...t.search,
				selected: n
			});
			r === this.#I && (t.items = e);
		} catch (e) {
			console.error("[arq] compare-picker: no se pudo cargar el catálogo", e), r === this.#I && t.showError();
		}
	}
	#R() {
		let { group: e } = this.#e, t = En(e, this.#c);
		return {
			sku: this.#c,
			name: t.name || e.name,
			meta: this.#c,
			image: t.images?.[0]?.src ?? null
		};
	}
	#z(e, t = null) {
		if (!e) return;
		let n = !!t?.closest("arq-download-modal"), r = this.shadowRoot.querySelector(n ? "arq-download-modal .datasheet-error" : ".buy .datasheet-error");
		r.textContent = "";
		let i = { sku: e };
		if (this.emit("datasheet", i), !i.pending || (i.pending.catch(() => r.textContent = $.datasheetError), !t)) return;
		t.loadingLabel = $.generating, t.loading = !0;
		let a = () => t.loading = !1;
		i.pending.then(a, a);
	}
	#B() {
		return this.#a ??= new Bc(this.shadowRoot, () => []), this.#a;
	}
	#V() {
		let { group: e, images: t } = this.#e, n = this.shadowRoot;
		n.querySelector(".ambient"), n.querySelector(".ambient-block").hidden = !0;
	}
	#H() {}
	#U(e) {
		for (let e of this.querySelectorAll(":scope > [slot=\"story-title\"], :scope > [slot=\"story-text\"], :scope > [slot=\"story-list\"]")) e.remove();
	}
	#W() {
		let { group: e, glossary: t, files: n } = this.#e, r = this.shadowRoot.querySelector(".table");
		r.label = `Variantes de ${e.name}`, r.data = t, r.replaceChildren(...n.map((e) => {
			let t = document.createElement("arq-button");
			return t.slot = "downloads", t.type = "outline", t.showIcon = !0, t.icon = "arrow-up-right", t.href = e.href, t.target = "_blank", t.textContent = e.label, t;
		}));
	}
	#G(e) {
		let { group: t, variantAttributes: n } = this.#e, r = this.shadowRoot.querySelector("arq-download-modal"), i = En(t, e);
		r.dataset.sku = e, r.sku = e, r.thumb = i.images[0]?.src ?? null, r.meta = n.map((e) => i.values[e]).filter(Boolean).join(", ");
		let a = document.createElement("arq-download-item");
		a.emphasis = "featured", a.textContent = $.datasheet;
		let o = i.downloads.map((e) => {
			let t = document.createElement("arq-download-item");
			return t.href = e.href, t.textContent = e.label, t;
		});
		for (let e of r.querySelectorAll(":scope > arq-download-item")) e.remove();
		r.querySelector(".datasheet-error").textContent = "", r.append(a, ...o);
	}
	#K() {
		let e = this.shadowRoot.querySelector("arq-download-modal");
		delete e.dataset.sku, e.sku = null, e.thumb = null, e.meta = null;
		let t = this.#e.files.map((e) => {
			let t = document.createElement("arq-download-item");
			return t.href = e.href, t.textContent = e.label, t;
		});
		for (let t of e.querySelectorAll(":scope > arq-download-item")) t.remove();
		e.querySelector(".datasheet-error").textContent = "", e.append(...t);
	}
	#q(e) {
		this.querySelector(":scope > [slot=\"inspiration\"]")?.remove();
	}
	#J() {
		let e = this.shadowRoot;
		e.querySelector("slot[name=\"inspiration\"]").assignedElements().length, e.querySelector(".inspiration-images").children.length, e.querySelector(".inspiration").hidden = !0;
	}
	#Y() {}
	#X() {
		let { family: e } = this.#e, t = this.shadowRoot.querySelector(".collection");
		t.hidden = !e.length;
		let n = t.querySelector(".cards"), r = e.map(ou);
		this.#i?.disconnect(), n.replaceChildren(...r), this.#i = Ts(r), this.#r?.disconnect(), this.#r?.observe(n);
		for (let e of n.children) this.#r?.observe(e);
		this.#Z();
	}
	#Z() {
		let e = this.shadowRoot, t = e.querySelector(".cards");
		e.querySelector(".collection-controls").hidden = t.scrollWidth <= t.clientWidth + 1;
	}
}, ru = {
	label: "Productos",
	href: "/arq/productos"
};
function iu(e, t) {
	if (e.environment?.includes("Lámparas y Artefactos") && !e.environment.some((e) => e === "Interior" || e === "Exterior")) {
		let t = [ru, {
			label: "Lámparas y artefactos",
			href: E({ environment: kt })
		}];
		return e.application && t.push({
			label: e.application,
			href: E({
				environment: kt,
				application: e.application
			})
		}), { crumbs: t };
	}
	let n = e.family?.trim();
	if (n) {
		let e = E({ family: n });
		return {
			crumbs: [ru, {
				label: n,
				href: e
			}],
			see: {
				href: e,
				label: `Ver colección ${n}`
			}
		};
	}
	if (t) {
		let e = E({ collection: t.id });
		return {
			crumbs: [ru, {
				label: t.name,
				href: e
			}],
			see: {
				href: e,
				label: `Ver colección ${t.name}`
			}
		};
	}
	return { crumbs: [ru] };
}
function au(e, t, n = "") {
	let r = document.createElement("img");
	return r.src = e, n && (r.className = n), r.alt = t, r.loading = "lazy", r;
}
function ou(e) {
	let t = document.createElement("arq-product-card");
	t.href = e.href, t.family = e.family, t.image = e.image, t.imageHover = e.imageHover, t.imageLit = e.imageLit, t.imageHoverLit = e.imageHoverLit;
	let n = document.createElement("h3");
	return n.slot = "name", n.textContent = e.name, t.append(n), Eo(t, e.finishes), t;
}
nu.define();
//#endregion
//#region src/components/coleccion/coleccion.css?inline
var su = ":host{min-width:0;color:var(--arq-color-text-primary);display:block}.products{gap:var(--arq-space-gap-xl);padding:0 var(--page-gutter) var(--arq-space-section-xl);flex-direction:column;display:flex}.status{color:var(--arq-color-text-secondary);margin:0}.status:empty{padding:0;position:absolute}.gallery{padding-bottom:var(--arq-space-section-xl);display:flex}.gallery img{aspect-ratio:1;object-fit:cover;background:var(--arq-color-surface-subtle);flex:1 1 0;min-width:0;display:block}.feature{padding:0 0 var(--arq-space-section-xl) var(--page-gutter);grid-template-columns:minmax(0,1fr) minmax(0,2fr);align-items:center;display:grid}.feature-text{max-width:var(--arq-layout-measure);padding-right:var(--page-gutter);color:var(--arq-color-text-primary)}::slotted([slot=description]){font:inherit!important;color:inherit!important;margin:0!important}.feature-image{aspect-ratio:5/4;background:var(--arq-color-surface-subtle);grid-column:2}.feature-image img{object-fit:cover;width:100%;height:100%;display:block}.mosaic{gap:var(--arq-space-gap-lg);padding-bottom:var(--arq-space-section-xl);flex-direction:column;display:flex}.controls{padding-right:var(--page-gutter);justify-content:flex-end;display:flex}.track{gap:var(--arq-space-gap-md);padding-left:var(--page-gutter);scroll-snap-type:x mandatory;scrollbar-width:none;scroll-padding-inline-start:var(--page-gutter);display:flex;overflow-x:auto}.track::-webkit-scrollbar{display:none}.track img{object-fit:cover;scroll-snap-align:start;background:var(--arq-color-surface-subtle);flex:none;width:auto;max-width:none;height:70svh;display:block}.track:focus-visible{outline-offset:calc(-1 * var(--arq-border-strong))}@media (width<=767px){.gallery{flex-direction:column}.gallery img{flex:none;width:100%}.feature{align-items:stretch;gap:var(--arq-space-gap-xl);flex-direction:column;padding-left:0;display:flex}.feature-text{max-width:none;padding:0 var(--page-gutter)}.controls{display:none}.track{gap:var(--arq-space-gap-sm-md)}}", cu = {
	loading: "Cargando colección…",
	notFound: "No encontramos esta colección.",
	empty: "Esta colección todavía no tiene productos.",
	error: "No se pudo cargar la colección. Probá de nuevo en unos minutos."
}, lu = class extends L {
	static tag = "arq-coleccion";
	static styles = G + su;
	static properties = {};
	static template = "<div class=\"products\"><p class=\"status role-body\" role=\"status\"></p><arq-grid class=\"grid\"></arq-grid></div><div class=\"gallery\" hidden></div><div class=\"feature\" hidden><div class=\"feature-text role-body-xl\"><slot name=\"description\"></slot></div><div class=\"feature-image\" hidden><img alt=\"\" loading=\"lazy\"></div></div><div class=\"mosaic\" hidden><div class=\"controls\"><arq-carousel-controls for=\"mosaic-track\" label-prev=\"Fotos anteriores\" label-next=\"Fotos siguientes\"></arq-carousel-controls></div><div class=\"track\" id=\"mosaic-track\" role=\"region\" aria-label=\"Fotos de la colección\" tabindex=\"0\"></div></div>";
	setup() {
		this.shadowRoot.querySelector("slot[name=\"description\"]").addEventListener("slotchange", () => this.#o()), this.#o(), this.#e();
	}
	async #e() {
		let e = this.getAttribute("data-collection");
		this.setAttribute("aria-busy", "true"), this.#t(cu.loading);
		let t = null, n = !1;
		try {
			t = e ? await Dn(e) : null;
		} catch (e) {
			n = !0, console.error("[arq] coleccion: no se pudo cargar el catálogo", e);
		}
		if (this.removeAttribute("aria-busy"), !t) {
			this.#t(n ? cu.error : cu.notFound);
			return;
		}
		this.#t(t.cards.length ? "" : cu.empty), this.#n(t.collection), this.#i(t.cards), this.#a(t);
	}
	#t(e) {
		let t = this.shadowRoot.querySelector(".status");
		t.textContent = e;
	}
	#n({ intro: e, description: t }) {
		let n = document.querySelector("arq-page-header");
		n && uu(n, "span", e), uu(this, "p", t);
	}
	#r = null;
	#i(e) {
		let t = e.map((e) => {
			let t = document.createElement("arq-product-card");
			t.href = e.href, t.family = e.family, t.image = e.image, t.imageHover = e.imageHover, t.imageLit = e.imageLit, t.imageHoverLit = e.imageHoverLit;
			let n = document.createElement("h2");
			if (n.slot = "name", n.textContent = e.name, t.append(n), Eo(t, e.finishes), e.meta) {
				let n = document.createElement("span");
				n.slot = "meta", n.textContent = e.meta, t.append(n);
			}
			return t;
		});
		this.#r?.disconnect(), this.shadowRoot.querySelector(".grid").replaceChildren(...t), this.#r = Ts(t);
	}
	#a({ collection: e, images: t }) {
		let n = this.shadowRoot, r = n.querySelector(".gallery");
		r.hidden = !t.gallery.length, r.replaceChildren(...t.gallery.map((t, n) => du(t, `${e.name}, imagen ${n + 1}`)));
		let i = n.querySelector(".feature-image");
		i.hidden = !t.description, t.description && (i.querySelector("img").src = t.description), this.#o();
		let a = n.querySelector(".mosaic");
		a.hidden = !t.inspiration.length, n.querySelector(".track").replaceChildren(...t.inspiration.map((t, n) => du(t, `${e.name}, proyecto ${n + 1}`)));
	}
	#o() {
		let e = this.shadowRoot, t = e.querySelector("slot[name=\"description\"]").assignedElements().length > 0;
		e.querySelector(".feature-text").hidden = !t, e.querySelector(".feature").hidden = !t && e.querySelector(".feature-image").hidden;
	}
};
function uu(e, t, n) {
	let r = e.querySelector(":scope > [slot=\"description\"]");
	if (!n) {
		r?.remove();
		return;
	}
	r || (r = document.createElement(t), r.slot = "description", e.append(r)), r.textContent = n;
}
function du(e, t) {
	let n = document.createElement("img");
	return n.src = e, n.alt = t, n.loading = "lazy", n;
}
lu.define();
//#endregion
//#region src/components/descargas/descargas.css?inline
var fu = ":host{min-width:0;padding-bottom:var(--arq-space-section-xl);color:var(--arq-color-text-primary);display:block}.search-section{gap:var(--arq-space-gap-md);padding-top:var(--arq-space-section-md);flex-direction:column;display:flex}.table{gap:var(--arq-space-gap-xl)}.search-title{box-sizing:border-box;max-width:100%;padding-inline:var(--page-gutter);color:var(--arq-color-text-primary);align-self:flex-start}.status{padding:0 var(--page-gutter);color:var(--arq-color-text-secondary);margin:0}.status:empty{padding:0;position:absolute}.retry{align-self:flex-start;margin-inline-start:var(--page-gutter)}", pu = {
	empty: "Todavía no hay productos para descargar.",
	error: "No se pudieron cargar las descargas. Probá de nuevo en unos minutos.",
	retry: "Reintentar",
	label: "Descargas por SKU",
	datasheet: "Ficha técnica",
	datasheetError: "No se pudo generar la ficha técnica. Probá de nuevo."
};
(class extends L {
	static tag = "arq-descargas";
	static styles = fu;
	static template = `<div class="search-section"><div class="search-title role-heading-1"><slot name="search-title"></slot></div><p class="status role-body" role="status"></p><arq-button class="retry" type="underline" show-underline hidden>${pu.retry}</arq-button><arq-variants-table class="table" type="catalog" downloads="downloads-modal"></arq-variants-table></div><arq-download-modal id="downloads-modal" show-product><slot name="modal-title" slot="title"></slot><arq-form-message class="datasheet-error" slot="message" tone="error"></arq-form-message></arq-download-modal>`;
	#e = /* @__PURE__ */ new Map();
	#t = new ResizeObserver((e) => {
		let t = e[0]?.contentRect.width;
		t > 0 && this.shadowRoot.querySelector(".table").style.setProperty("--arq-download-search-width", `${t}px`);
	});
	connectedCallback() {
		super.connectedCallback(), this.#t.observe(this.shadowRoot.querySelector(".search-title"));
	}
	disconnectedCallback() {
		this.#t.disconnect();
	}
	setup() {
		let e = this.shadowRoot, t = e.querySelector(".table");
		t.label = pu.label, t.addEventListener("arq:downloads", (e) => this.#i(e.detail.sku)), e.querySelector("arq-download-modal").addEventListener("arq:download", (e) => {
			e.stopPropagation();
			let { sku: t } = e.currentTarget;
			if (!t) return;
			let n = e.currentTarget.querySelector(".datasheet-error");
			n.textContent = "";
			let r = { sku: t };
			this.emit("datasheet", r), r.pending?.catch(() => n.textContent = pu.datasheetError);
			let i = e.target.closest?.("arq-download-item");
			if (!i || !r.pending) return;
			i.loading = !0;
			let a = () => i.loading = !1;
			r.pending.then(a, a);
		}), e.querySelector(".retry").addEventListener("click", () => this.#n()), this.#n();
	}
	async #n() {
		let e = this.shadowRoot.querySelector(".table"), t = this.shadowRoot.querySelector(".retry"), n = !t.hidden;
		t.hidden = !0, e.hidden = !1, this.setAttribute("aria-busy", "true"), e.loading = !0, this.#r("");
		let r = null;
		try {
			r = await gn();
		} catch (e) {
			console.error("[arq] descargas: no se pudo cargar el catálogo", e);
		}
		if (this.removeAttribute("aria-busy"), e.loading = !1, !r) {
			e.hidden = !0, this.#r(pu.error), t.hidden = !1;
			return;
		}
		n && requestAnimationFrame(() => e.shadowRoot?.querySelector(".search")?.focus()), this.#e = new Map(r.rows.map((e) => [e.sku, e])), this.#r(r.rows.length ? "" : pu.empty), e.data = r, e.hidden = !r.rows.length;
	}
	#r(e) {
		let t = this.shadowRoot.querySelector(".status");
		t.textContent = e;
	}
	async #i(e) {
		let t = this.shadowRoot.querySelector("arq-download-modal"), n = this.#e.get(e);
		t.sku = e, t.meta = n?.meta ?? "", t.thumb = n?.thumb ?? null;
		for (let e of t.querySelectorAll(":scope > arq-download-item")) e.remove();
		t.querySelector(".datasheet-error").textContent = "";
		let r = this.#a(pu.datasheet);
		r.emphasis = "featured", t.append(r);
		let i = await vn(e);
		t.sku === e && t.append(...i.map((e) => this.#a(e.label, e.href)));
	}
	#a(e, t) {
		let n = document.createElement("arq-download-item");
		return t && (n.href = t), n.append(e), n;
	}
}).define();
//#endregion
//#region src/components/form-contacto/form-contacto.css?inline
var mu = ":host{min-width:0;color:var(--arq-color-text-primary);display:block}.layout,.faq{column-gap:var(--arq-space-gap-6xl);grid-template-columns:minmax(0,2fr) minmax(0,3fr);align-items:start;display:grid}.layout{padding:var(--arq-space-section-md) var(--page-gutter) var(--arq-space-section-xl)}.faq[hidden]{display:none}.info{gap:var(--arq-space-gap-2xl);flex-direction:column;min-width:0;display:flex}.intro{gap:var(--arq-space-gap-lg);padding-bottom:var(--arq-space-padding-lg);border-bottom:var(--arq-border-default) solid var(--arq-color-border-default);flex-direction:column;display:flex}.title{color:var(--arq-color-text-primary)}.description,.faq-description{color:var(--arq-color-text-secondary)}::slotted([slot=description]),::slotted([slot=faq-description]){font:inherit!important;color:inherit!important;margin:0!important}.channels{gap:var(--arq-space-gap-sm);flex-direction:column;display:flex}.channels-title{color:var(--arq-color-text-secondary)}.channels-title[hidden]{display:none}.form{gap:var(--arq-space-gap-3xl);flex-direction:column;min-width:0;display:flex}.section{gap:var(--arq-space-gap-lg);border:0;flex-direction:column;min-inline-size:0;margin:0;padding:0;display:flex}.section>legend{float:left;box-sizing:border-box;width:100%;padding:0 0 var(--arq-space-padding-sm);border-bottom:var(--arq-border-default) solid var(--arq-color-border-default);color:var(--arq-color-text-primary);margin:0}.choices{gap:var(--arq-space-gap-sm-md);flex-wrap:wrap;display:flex}.fields{gap:var(--arq-space-gap-lg);grid-template-columns:minmax(0,1fr) minmax(0,1fr);display:grid}.honeypot{width:var(--arq-border-default);height:var(--arq-border-default);clip-path:inset(50%);white-space:nowrap;position:absolute;overflow:hidden}.submit{align-items:flex-start;gap:var(--arq-space-gap-xl);flex-direction:column;display:flex}.send{align-items:flex-start;gap:var(--arq-space-gap-sm);flex-direction:column;min-width:0;display:flex}.message:empty{position:absolute}.faq{padding:var(--arq-space-section-lg) var(--page-gutter);background:var(--arq-color-surface-faint)}.faq-text{align-items:flex-start;gap:var(--arq-space-gap-lg);flex-direction:column;min-width:0;display:flex}.faq-title{color:var(--arq-color-text-primary)}.faq-description{max-width:var(--arq-layout-measure)}.faq-items{min-width:0}@media (width>=1024px){.info{top:var(--arq-space-section-md);position:sticky}}@media (width<=1023px){.layout,.faq{grid-template-columns:minmax(0,1fr)}.layout{row-gap:var(--arq-space-gap-6xl)}.faq{row-gap:var(--arq-space-gap-2xl)}}@media (width>=768px) and (width<=1023px){.description{max-width:var(--arq-layout-measure-wide)}}@media (width<=767px){.fields{grid-template-columns:minmax(0,1fr)}.submit,.send{align-items:stretch}.send-button{width:100%}}", hu = [
	"Asesoramiento lumínico",
	"Cotización de proyecto",
	"Consulta técnica",
	"Garantía"
], gu = [
	"Buenos Aires",
	"Ciudad Autónoma de Buenos Aires",
	"Catamarca",
	"Chaco",
	"Chubut",
	"Córdoba",
	"Corrientes",
	"Entre Ríos",
	"Formosa",
	"Jujuy",
	"La Pampa",
	"La Rioja",
	"Mendoza",
	"Misiones",
	"Neuquén",
	"Río Negro",
	"Salta",
	"San Juan",
	"San Luis",
	"Santa Cruz",
	"Santa Fe",
	"Santiago del Estero",
	"Tierra del Fuego",
	"Tucumán"
], _u = {
	nombre: "Completá tu nombre.",
	email: {
		valueMissing: "Completá tu email.",
		typeMismatch: "Revisá el formato del email."
	},
	detalles: "Contanos un poco sobre tu proyecto."
}, vu = 25, yu = {
	"channels-title": ".channels-title",
	faq: ".faq"
}, bu = {
	sent: "Recibimos tu consulta. Te respondemos a la brevedad.",
	error: "No pudimos enviar tu consulta. Probá de nuevo en unos minutos."
}, xu = (e) => e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;"), Su = class extends L {
	static tag = "arq-form-contacto";
	static styles = mu;
	static properties = {};
	static template = "<div class=\"layout\"><div class=\"info\"><div class=\"intro\"><div class=\"title role-display-sm\"><slot name=\"title\"></slot></div><div class=\"description role-body\"><slot name=\"description\"></slot></div></div><div class=\"channels\"><span class=\"channels-title role-body-lg-regular\" hidden><slot name=\"channels-title\"></slot></span><slot name=\"channels\"></slot></div><slot name=\"links\"></slot></div><form class=\"form\" novalidate><fieldset class=\"section topics\"><legend class=\"role-heading-3\">Tipo de consulta</legend><div class=\"choices\" role=\"radiogroup\" aria-label=\"Tipo de consulta\">" + hu.map((e, t) => `<arq-choice-chip name="tipo" value="${xu(e)}"${t ? "" : " selected"}>${xu(e)}</arq-choice-chip>`).join("") + `</div></fieldset><fieldset class="section"><legend class="role-heading-3">Tus datos</legend><div class="fields"><arq-input name="nombre" placeholder="Tu nombre y apellido" autocomplete="name" autocapitalize="words" enterkeyhint="next" required show-label>Nombre completo</arq-input><arq-input name="empresa" placeholder="Nombre del estudio" autocomplete="organization" autocapitalize="words" enterkeyhint="next" show-label>Estudio o empresa (opcional)</arq-input><arq-input name="email" input-type="email" placeholder="nombre@estudio.com" autocomplete="email" enterkeyhint="next" required show-label>Email</arq-input><arq-input name="telefono" input-type="tel" placeholder="+54 11 0000-0000" autocomplete="tel" enterkeyhint="next" show-label>Teléfono (opcional)</arq-input><arq-input name="provincia" type="select" placeholder="Seleccioná una provincia" show-label>Provincia (opcional)</arq-input><arq-input name="ciudad" placeholder="Tu ciudad" autocomplete="address-level2" autocapitalize="words" enterkeyhint="next" show-label>Ciudad (opcional)</arq-input></div></fieldset><fieldset class="section"><legend class="role-heading-3">Tu proyecto</legend><arq-input name="detalles" type="textarea" rows="6" placeholder="Contanos el tipo de espacio, etapa del proyecto y qué necesitás…" required show-label>Detalles del proyecto</arq-input><arq-file-upload name="adjunto" max-size="${vu}">Planos o imágenes (opcional)<span slot="helper">PDF, DWG, JPG o PNG · hasta ${vu} MB. ¿Pesa más? Pegá un link de Drive o WeTransfer en el detalle.</span></arq-file-upload></fieldset><div class="honeypot" aria-hidden="true"><label>No completar este campo <input type="text" name="website" tabindex="-1" autocomplete="off"></label></div><div class="submit"><arq-checkbox name="novedades" value="si" show-label>Quiero recibir novedades y lanzamientos</arq-checkbox><div class="send"><arq-button class="send-button" submit show-icon icon="arrow-right">Enviar consulta</arq-button><arq-form-message class="message"></arq-form-message></div></div></form></div><div class="faq" hidden><div class="faq-text"><div class="faq-title role-display-sm"><slot name="faq-title"></slot></div><div class="faq-description role-body"><slot name="faq-description"></slot></div><slot name="faq-action"></slot></div><div class="faq-items"><slot name="faq"></slot></div></div>`;
	#e = !1;
	setup() {
		let e = this.shadowRoot;
		new sa(e.querySelector(".choices"), { items: "arq-choice-chip" });
		for (let [t, n] of Object.entries(yu)) {
			let r = e.querySelector(`slot[name="${t}"]`), i = () => {
				e.querySelector(n).hidden = !r.assignedNodes().length;
			};
			r.addEventListener("slotchange", i), i();
		}
		e.querySelector("[name=\"provincia\"]").options = gu.map((e) => ({ value: e }));
		let t = e.querySelector("form");
		t.addEventListener("submit", (e) => {
			e.preventDefault(), this.#r(t);
		}), t.addEventListener("arq:change", (e) => {
			this.#e && e.target.localName === "arq-input" && this.#n(e.target);
		}), t.addEventListener("arq:input", (e) => {
			e.target.localName === "arq-input" && e.target.hasAttribute("error") && this.#n(e.target);
		});
	}
	#t(e) {
		if (e.checkValidity()) return "";
		let t = _u[e.name];
		return typeof t == "string" ? t : e.validity.typeMismatch && t?.typeMismatch || t?.valueMissing || "Revisá este campo.";
	}
	#n(e, { announce: t = !0 } = {}) {
		let n = this.#t(e);
		return e.setError(n, { announce: t }), !n;
	}
	async #r(e) {
		let t = this.shadowRoot;
		this.#e = !0;
		let n = [...t.querySelectorAll("arq-input")], r = n.filter((e) => !this.#n(e, { announce: !1 })), i = t.querySelector(".message");
		if (r.length) {
			i.textContent = "", r[0].focus();
			return;
		}
		let a = t.querySelector(".send-button");
		i.textContent = "";
		let o = new FormData(e), s = String(o.get("website") ?? "").trim() !== "";
		o.delete("website"), this.emit("submit", { data: o }), a.loading = !0;
		let c = !1;
		try {
			c = s || await Cu(o);
		} catch (e) {
			console.error("[arq] form-contacto: no se pudo enviar", e);
		}
		if (a.loading = !1, i.tone = c ? "success" : "error", await new Promise((e) => requestAnimationFrame(() => requestAnimationFrame(e))), i.textContent = c ? bu.sent : bu.error, c) {
			e.reset(), this.#e = !1;
			for (let e of n) e.removeAttribute("error");
			this.emit("sent", {});
		} else this.emit("error", {});
	}
};
async function Cu(e) {
	let t = n.n8n.webhookUrl;
	return t ? (await fetch(t, {
		method: "POST",
		body: e
	})).ok : (console.error("[arq] form-contacto: falta VITE_N8N_WEBHOOK_URL"), !1);
}
Su.define(), document.addEventListener("arq:datasheet", (e) => {
	let t = e.detail?.sku;
	if (!t) return;
	let n = Nr(t);
	e.detail.pending = n, n.catch((e) => console.error("[arq] ficha técnica:", e));
}), document.addEventListener("arq:configuration", (e) => {
	if (!e.detail?.parts) return;
	let t = Vr(e.detail);
	e.detail.pending = t, t.catch((e) => console.error("[arq] configuración Daö:", e));
}), document.addEventListener("click", (e) => {
	e.target.closest?.("[data-arq-print]") && window.print();
}), window.Arq || (window.Arq = Object.freeze({ version: e }));
//#endregion
