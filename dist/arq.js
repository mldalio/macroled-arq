//#region package.json
var e = "0.1.0", t = {
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
	images: Object.freeze({ finishesBase: t.VITE_FINISHES_BASE_URL ?? "https://s3.coresagroup.com/MACROLED/ARQ/imagenes/acabados/" }),
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
async function l(e, { signal: t } = {}) {
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
async function u(e = {}, t) {
	let n = await l(e, t);
	return {
		hits: (n.hits ?? []).map((e) => e.document),
		found: n.found ?? 0,
		facets: Object.fromEntries((n.facet_counts ?? []).map((e) => [e.field_name, e.counts.map(({ value: e, count: t }) => ({
			value: e,
			count: t
		}))]))
	};
}
async function d(e = {}, t) {
	let n = await u({
		...e,
		per_page: r,
		page: 1
	}, t), i = Math.ceil(n.found / r);
	return [n, ...await Promise.all(Array.from({ length: Math.max(0, i - 1) }, (n, i) => u({
		...e,
		per_page: r,
		page: i + 2
	}, t)))].flatMap((e) => e.hits);
}
//#endregion
//#region src/data/attributes.js
var f = Object.freeze([
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
		label: "Materiales y dimensiones"
	},
	{
		id: "instalacion",
		label: "Instalación y protección"
	},
	{
		id: "comercial",
		label: "Información comercial"
	}
]), p = (e, t, n = {}) => Object.freeze({
	label: e,
	section: t,
	control: "tiles",
	...n
}), m = Object.freeze({
	potencia: p("Potencia", "luminicas", { filter: !0 }),
	flujo_luminoso: p("Flujo luminoso", "luminicas"),
	lumenes_lmw: p("Eficiencia luminosa", "luminicas"),
	temperatura_color: p("Temperatura de color", "luminicas", { filter: !0 }),
	cri: p("CRI", "luminicas"),
	angulo_apertura: p("Ángulo de apertura", "luminicas"),
	ugr: p("UGR", "luminicas"),
	sdcm: p("SDCM", "luminicas"),
	tipo_led: p("Tipo de LED", "luminicas"),
	vida_util: p("Vida útil", "luminicas"),
	tension_proveedor: p("Tensión de entrada", "electricas"),
	factor_potencia: p("Factor de potencia", "electricas"),
	thd: p("THD", "electricas"),
	dimeable: p("Dimerizable", "electricas"),
	tipo_driver: p("Driver", "electricas"),
	emc: p("EMC", "electricas"),
	color_carcasa: p("Color", "materiales", {
		control: "swatches",
		column: "Color de carcasa"
	}),
	altura: p("Altura", "materiales", { column: "Altura" }),
	tamanio: p("Medidas", "materiales"),
	material_cuerpo: p("Material del cuerpo", "materiales"),
	material_lente: p("Material de la lente", "materiales"),
	largo_cable: p("Largo de cable", "materiales"),
	peso: p("Peso", "materiales"),
	proteccion_ip: p("Grado de protección", "instalacion"),
	proteccion_ik: p("Resistencia al impacto", "instalacion"),
	tipo_montaje: p("Montaje", "instalacion"),
	temperatura_operacion: p("Temperatura de operación", "instalacion"),
	garantia_proveedor: p("Garantía", "comercial")
}), ee = Object.freeze([
	{
		field: "tamanio",
		label: "Tamaño"
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
		field: "dimeable",
		label: "Regulación"
	},
	{
		field: "proteccion_ip",
		label: "IP"
	},
	{
		field: "tipo_led",
		label: "Fuente"
	},
	{
		field: "cri",
		label: "CRI"
	}
]), te = Object.freeze([
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
		label: "Temperatura de color",
		column: "Temp."
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
		label: "Material del cuerpo",
		column: "Material"
	},
	{
		field: "tension_proveedor",
		label: "Tensión de entrada",
		column: "Tensión"
	}
]);
function h(e) {
	return m[e] ?? {
		label: e,
		control: "tiles"
	};
}
var ne = Object.freeze(Object.keys(m).filter((e) => m[e].filter));
function re(e) {
	return f.map((t) => ({
		...t,
		rows: Object.entries(m).filter(([n, r]) => r.section === t.id && ie(e[n])).map(([t, n]) => ({
			field: t,
			label: n.label,
			value: e[t]
		}))
	})).filter((e) => e.rows.length);
}
var ie = (e) => e != null && String(e).trim() !== "" && e !== "-";
function ae(e) {
	return (Array.isArray(e) ? e : String(e ?? "").split(",")).map((e) => e.trim()).filter(Boolean).map((e) => {
		let t = m[e] ? e : Object.keys(m).find((t) => m[t].column === e);
		return t || console.warn(`[arq] variant_attributes: el campo «${e}» no está en src/data/attributes.js`), t;
	}).filter(Boolean);
}
//#endregion
//#region src/data/text.js
var g = (e) => String(e ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
function oe(e) {
	let t = [e];
	return e.length > 3 && e.endsWith("es") && t.push(e.slice(0, -2)), e.length > 3 && e.endsWith("s") && t.push(e.slice(0, -1)), t;
}
function se(e) {
	return g(e).split(/\s+/).filter(Boolean).map(oe);
}
var ce = (e, t) => {
	let n = g(e);
	return t.every((e) => e.some((e) => n.includes(e)));
}, _ = {
	name: "product_name",
	family: "familia",
	productType: "product_type",
	environment: "macrofamilia",
	application: "subfamilia",
	isDefault: "is_group_default",
	isNew: "new",
	variantAttributes: "variant_attributes",
	compatibleWith: "compatible_with",
	description: "description",
	story: "product_story_text",
	inspiration: "product_inspiration_text",
	video: "video_inspiration",
	collectionIntro: "collection_intro_text",
	collectionDescription: "collection_description_text",
	collectionGallery: "collection_gallery_images",
	collectionInspiration: "collection_inspiration_images"
}, le = "Colección", ue = "Accesorio", de = {
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
}, fe = [
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
], pe = [
	"ies",
	"cad",
	"manual",
	"fotometria"
], me = Object.freeze([
	"sku",
	_.name,
	_.family,
	_.productType,
	_.environment,
	_.application,
	_.isDefault,
	_.isNew,
	_.variantAttributes,
	_.compatibleWith,
	_.collectionIntro,
	_.collectionDescription,
	_.collectionGallery,
	_.collectionInspiration,
	"multimagen_producto",
	"multimagen_ambiente",
	"multimagen_coleccion",
	...Object.keys(m)
]), he = Object.freeze([
	"sku",
	_.name,
	_.isDefault,
	_.description,
	_.story,
	_.inspiration,
	_.video,
	"multimagen_vistas",
	"multimagen_perspectivas",
	"multimagen_detalles",
	...pe
]), v = (e) => e == null ? "" : String(e).trim(), y = (e) => Array.isArray(e) ? e.map(v).filter(Boolean) : v(e) ? v(e).split(",").map((e) => e.trim()).filter(Boolean) : [], ge = (e) => g(e).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
function _e(e) {
	let t = {};
	for (let [n, r] of Object.entries(de)) {
		let i = Array.isArray(e[n]) ? e[n] : [];
		r.forEach((e, n) => {
			let r = v(i[n]);
			r && (t[e] = r);
		});
	}
	return t.ambient1 && !t.ambient1On && /_on\.\w+$/i.test(t.ambient1.split(/[?#]/)[0]) && (t.ambient1On = t.ambient1), t;
}
function ve(e) {
	let t = _e(e), n = fe.filter((e) => t[e]), r = {
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
function ye(e) {
	let t = _e(e);
	return {
		ambient: [
			"ambient2",
			"ambient3",
			"ambient4",
			"ambient5",
			"ambient7"
		].map((e) => t[e]).filter(Boolean),
		description: t.ambient6 ?? null,
		inspiration: [t.ambient7].filter(Boolean)
	};
}
function be(e) {
	let t = _e(e);
	return {
		id: ge(e[_.name]),
		name: v(e[_.name]),
		families: y(e[_.family]).map(g),
		intro: v(e[_.collectionIntro]),
		description: v(e[_.collectionDescription]),
		images: {
			studio: t.card ?? null,
			studioOn: t.cardOn ?? null,
			gallery: y(e[_.collectionGallery]),
			description: t.description ?? null,
			inspiration: y(e[_.collectionInspiration])
		}
	};
}
function xe(e) {
	let t = [], n = /* @__PURE__ */ new Map();
	for (let r of e) {
		let e = v(r[_.name]);
		if (!e) continue;
		if (v(r[_.productType]) === le) {
			t.push(be(r));
			continue;
		}
		let i = ge(e);
		n.has(i) || n.set(i, []), n.get(i).push(r);
	}
	let r = (e) => t.find((t) => t.families.includes(g(e)))?.id ?? null, i = new Map([...n].map(([e, t]) => [g(t[0][_.name]), e])), a = (e, t) => {
		let n = t.find((e) => e[_.isDefault] === !0) ?? t[0], a = v(n[_.productType]) || null, o = y(n[_.compatibleWith]).map((e) => i.get(g(e))).filter(Boolean);
		return {
			id: e,
			name: v(n[_.name]),
			family: y(n[_.family])[0] ?? "",
			collection: a === ue ? null : r(n[_.family]),
			productType: a,
			hasDefault: t.some((e) => e[_.isDefault] === !0),
			environment: y(n[_.environment]),
			application: v(n[_.application]) || null,
			variantAttributes: ae(n[_.variantAttributes]),
			compatibleWith: o,
			story: v(n[_.story]),
			inspiration: v(n[_.inspiration]),
			video: v(n[_.video]),
			images: ye(n),
			specs: {},
			variants: t.map((e) => ({
				sku: e.sku,
				isDefault: e === n,
				isNew: e[_.isNew] === !0,
				description: v(e[_.description]),
				attributes: Object.fromEntries(Object.keys(m).map((t) => [t, v(e[t])]).filter(([, e]) => e && e !== "-")),
				images: ve(e),
				downloads: Object.fromEntries(pe.map((t) => [t, v(e[t])]).filter(([, e]) => e))
			}))
		};
	}, o = [...n].map(([e, t]) => a(e, t));
	return {
		collections: t.filter((e) => o.some((t) => t.collection === e.id)),
		groups: o,
		withDetails: (e, t) => {
			let r = new Map(t.map((e) => [e.sku, e]));
			return a(e, n.get(e).map((e) => ({
				...e,
				...r.get(e.sku)
			})));
		}
	};
}
//#endregion
//#region src/data/source.js
var Se = "arq:catalog", Ce = 6e4, we = () => [
	n.typesense.host,
	n.typesense.collection,
	me.join(",")
].join("|");
function Te() {
	try {
		if (new URLSearchParams(location.search).has("arq-nocache") || performance.getEntriesByType("navigation")[0]?.type === "reload") return null;
		let e = JSON.parse(sessionStorage.getItem(Se));
		return e?.signature === we() && Array.isArray(e.docs) ? e : null;
	} catch {
		return null;
	}
}
function Ee(e) {
	try {
		sessionStorage.setItem(Se, JSON.stringify({
			signature: we(),
			at: Date.now(),
			docs: e
		}));
	} catch {}
}
async function De() {
	let e = await d({
		q: "*",
		include_fields: me.join(",")
	});
	return Ee(e), e;
}
async function Oe() {
	let e = Te();
	return e ? (Date.now() - e.at > Ce && De().catch(() => {}), xe(e.docs)) : xe(await De());
}
function ke(e) {
	return d({
		q: "*",
		filter_by: `product_name:=${c(e)}`,
		include_fields: he.join(",")
	});
}
//#endregion
//#region src/data/variants.js
var Ae = (e) => e != null && String(e).trim() !== "";
function je(e, t) {
	let n = [];
	for (let r of e) {
		let e = r.attributes[t];
		Ae(e) && !n.includes(e) && n.push(e);
	}
	return n.sort((e, t) => String(e).localeCompare(String(t), "es", { numeric: !0 }));
}
function Me(e, t) {
	let n = Object.keys(t);
	return e.find((e) => n.every((n) => e.attributes[n] === t[n])) ?? null;
}
function Ne(e, t, n) {
	let r = e.find((e) => n && e.sku === n) ?? e.find((e) => e.isDefault) ?? e[0];
	return r ? Object.fromEntries(t.map((e) => [e, r.attributes[e]])) : {};
}
function Pe(e, t, n) {
	return t.map((r) => ({
		attribute: r,
		options: je(e, r).map((i) => ({
			value: i,
			selected: n[r] === i,
			disabled: !e.some((e) => e.attributes[r] === i && t.every((t) => t === r || e.attributes[t] === n[t]))
		}))
	}));
}
var Fe = (e, t) => Array.isArray(t) ? !t.length || t.includes(e) : !Ae(t) || e === t, Ie = (e, t, n) => Object.entries(t).every(([t, r]) => t === n || Fe(e.attributes[t], r));
function b(e, t) {
	return e.filter((e) => Ie(e, t));
}
function Le(e, t, n) {
	return t.map((t) => ({
		attribute: t,
		options: je(e, t).map((r) => ({
			value: r,
			selected: Array.isArray(n[t]) ? n[t].includes(r) : n[t] === r,
			disabled: !e.some((e) => e.attributes[t] === r && Ie(e, n, t))
		}))
	}));
}
function Re(e, t, n) {
	return {
		...e,
		[t]: n
	};
}
function ze(e, t) {
	let n = se(t ?? "");
	return n.length ? e.filter((e) => ce(`${e.sku} ${e.search ?? ""}`, n)) : e;
}
var Be = Object.freeze([{
	value: "sku-asc",
	label: "SKU (A–Z)"
}, {
	value: "sku-desc",
	label: "SKU (Z–A)"
}]), Ve = new Intl.Collator("es", {
	numeric: !0,
	sensitivity: "base"
});
function He(e, t) {
	if (t !== "sku-asc" && t !== "sku-desc") return e;
	let n = t === "sku-desc" ? -1 : 1;
	return [...e].sort((e, t) => n * Ve.compare(e.sku, t.sku));
}
//#endregion
//#region src/data/finishes.js
var Ue = (e) => g(e).replace(/\s+/g, " ").trim(), We = Object.freeze({
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
}), Ge = Object.freeze({ negro: [{
	slug: "negro-mate",
	families: [
		"Kanu",
		"Nobu",
		"Tori",
		"Koen",
		"Douli",
		"Yoru",
		"Sento"
	].map(Ue)
}] });
function Ke(e, t = "") {
	let n = We[Ue(e)];
	if (!n) return null;
	let r = (Ge[n] ?? []).find(({ families: e }) => e.includes(Ue(t)));
	return r ? r.slug : n;
}
function qe(e, t = "") {
	let r = Ke(e, t);
	return r ? `${n.images.finishesBase}acabado-${r}.png` : null;
}
//#endregion
//#region src/data/catalog.js
var Je = null;
function x() {
	return Je ??= Oe().then(Ye), Je.catch(() => Je = null), Je;
}
function Ye({ collections: e, groups: t, withDetails: n }) {
	let r = new Map(e.map((e) => [e.id, e]));
	for (let e of t) Xe(e, r);
	return {
		collections: e,
		groups: t,
		collectionById: r,
		groupById: new Map(t.map((e) => [e.id, e])),
		withDetails: n
	};
}
function Xe(e, t) {
	e.collectionData = t.get(e.collection) ?? null;
	for (let t of e.variants) t.values = {
		...e.specs,
		...t.attributes
	};
	e.defaultVariant = e.variants.find((e) => e.isDefault) ?? e.variants[0];
}
var Ze = /* @__PURE__ */ new Map();
function Qe(e) {
	if (!Ze.has(e.id)) {
		let t = (async () => {
			let t = await x();
			return Object.assign(e, t.withDetails(e.id, await ke(e.name))), Xe(e, t.collectionById), e;
		})();
		Ze.set(e.id, t), t.catch(() => Ze.delete(e.id));
	}
	return Ze.get(e.id);
}
var $e = (e, t) => `/arq/producto/${encodeURIComponent(e)}${t ? `?sku=${encodeURIComponent(t)}` : ""}`, S = (e) => `/arq/coleccion/${encodeURIComponent(e)}`;
function C({ environment: e, application: t, productType: n, collection: r } = {}) {
	let i = new URLSearchParams();
	e && i.set("environment", e), t && i.set("application", t), n && i.set("product_type", n), r && i.set("collection", r);
	let a = i.toString();
	return `/arq/productos${a ? `?${a}` : ""}`;
}
var w = (e) => e != null && String(e).trim() !== "";
function et(e, t) {
	return Object.entries(t).every(([t, n]) => !n?.length || n.includes(e.values[t]));
}
function tt(e, t, n = e.defaultVariant) {
	return [
		n,
		e.defaultVariant,
		...e.variants
	].filter((e, t, n) => n.indexOf(e) === t).find((e) => et(e, t)) ?? null;
}
var nt = (e, t) => e.hasDefault && (t ? !0 : e.productType === "Luminaria");
function rt(e, { environment: t, application: n, productType: r, collection: i } = {}) {
	return !(t && !e.environment.includes(t) || n && e.application !== n || r && e.productType !== r || i && e.collection !== i);
}
var it = (e = {}) => Object.fromEntries(Object.entries(e).filter(([, e]) => e?.length));
function at(e) {
	return ne.map((t) => {
		let n = /* @__PURE__ */ new Map();
		for (let r of e) for (let e of new Set(r.variants.map((e) => e.values[t]).filter(w))) n.set(e, (n.get(e) ?? 0) + 1);
		let r = [...n].map(([e, t]) => ({
			value: e,
			count: t
		})).sort((e, t) => String(e.value).localeCompare(String(t.value), "es", { numeric: !0 }));
		return {
			name: t,
			label: h(t).label,
			options: r
		};
	}).filter((e) => e.options.length > 1);
}
function ot(e) {
	return e.productType && e.productType !== "Luminaria" ? e.productType : [e.environment.join(" · "), e.application].filter(Boolean).join(" · ");
}
var st = Object.keys(m).filter((e) => m[e].control === "swatches"), ct = (e) => [...new Set(e.variants.flatMap((e) => st.map((t) => e.values[t])).filter(w))], lt = [
	"negro",
	"blanco",
	"terracota",
	"verde"
], ut = (e) => {
	let t = String(e).normalize("NFD").replace(/[̀-ͯ]/g, "").trim().toLowerCase().split(/\s+/)[0], n = lt.indexOf(t);
	return n === -1 ? lt.length : n;
}, dt = (e) => e.map((e, t) => [e, t]).sort((e, t) => ut(e[0].name) - ut(t[0].name) || e[1] - t[1]).map(([e]) => e), ft = (e) => dt(ct(e).map((t) => ({
	name: t,
	src: qe(t, e.family)
}))), pt = (e) => dt([...new Map(e.map((e) => [`${e.name}|${e.src}`, e])).values()]), mt = (e) => st.map((t) => e.values[t]).find(w);
function ht(e, t = {}) {
	let n = (e) => ut(mt(e) ?? "");
	return [e.defaultVariant, ...e.variants].filter((e, t, n) => n.indexOf(e) === t).map((e, t) => [e, t]).sort((e, t) => n(e[0]) - n(t[0]) || e[1] - t[1]).map(([e]) => e).find((e) => et(e, t)) ?? null;
}
function gt(e, t, n = {}) {
	let r = ft(e);
	return r.length < 2 ? r : r.map((r) => {
		let i = [
			t,
			e.defaultVariant,
			...e.variants
		].filter((e, t, n) => n.indexOf(e) === t && mt(e) === r.name), a = i.find((e) => et(e, n)) ?? i[0], o = E(a.images);
		return {
			...r,
			selected: mt(t) === r.name,
			sku: a.sku,
			href: $e(e.id, a.sku),
			image: o.studio ?? null,
			imageHover: o.studioOn ?? o.context ?? null,
			imageLit: o.studioOn ?? null,
			imageHoverLit: o.contextOn ?? null
		};
	});
}
function T(e, t = ht(e) ?? e.defaultVariant, n = {}) {
	let r = E(t.images);
	return {
		id: e.id,
		sku: t.sku,
		name: e.name,
		meta: ot(e),
		finishes: gt(e, t, n),
		href: $e(e.id, t.sku),
		image: r.studio ?? null,
		imageHover: r.studioOn ?? r.context ?? null,
		imageLit: r.studioOn ?? null,
		imageHoverLit: r.contextOn ?? null
	};
}
var E = (e = {}) => Object.fromEntries(Object.entries(e).filter(([, e]) => w(e) && (!Array.isArray(e) || e.length)));
function _t(e, t) {
	let n = [...new Set(t.map((e) => e.application).filter(Boolean))], r = e.images ?? {};
	return {
		id: e.id,
		name: e.name,
		meta: n.join(" · "),
		finishes: pt(t.flatMap(ft)),
		href: S(e.id),
		image: r.studio ?? null,
		imageHover: r.context ?? null,
		imageLit: r.studioOn ?? null,
		imageHoverLit: r.contextOn ?? null
	};
}
async function vt({ filters: e, query: t, ...n } = {}) {
	let { groups: r } = await x(), i = se(t ?? ""), a = /* @__PURE__ */ new Map();
	for (let e of r) {
		if (!rt(e, n) || !i.length && !nt(e, n.productType)) continue;
		let t = i.length ? Ut(e, i) : {
			variant: e.defaultVariant,
			bySku: !1
		};
		t && a.set(e, t);
	}
	let o = [...a.keys()], s = it(e);
	Object.keys(s).length;
	let c = o.flatMap((e) => {
		let t = a.get(e), n = t.bySku ? tt(e, s, t.variant) : ht(e, s);
		return n ? [T(e, n, s)] : [];
	});
	return {
		cards: c,
		count: c.length,
		filters: at(o)
	};
}
async function yt({ filters: e } = {}) {
	let { collections: t, groups: n } = await x(), r = it(e), i = t.flatMap((e) => {
		let t = n.filter((t) => t.collection === e.id);
		return t.some((e) => tt(e, r)) ? [_t(e, t)] : [];
	});
	return {
		cards: i,
		count: i.length,
		filters: at(n.filter((e) => e.collection))
	};
}
async function bt(e) {
	let { groups: t, groupById: n } = await x(), r = n.get(e);
	if (!r) return null;
	await Qe(r);
	let i = r.collection ? t.filter((e) => e.collection === r.collection && e !== r).map((e) => T(e)) : [], a = r.images ?? {};
	return {
		group: r,
		collection: r.collectionData,
		variants: r.variants.map((e) => ({
			sku: e.sku,
			isDefault: e === r.defaultVariant,
			attributes: e.values
		})),
		variantAttributes: r.variantAttributes,
		finishImages: Object.fromEntries(ft(r).filter((e) => e.src).map((e) => [e.name, e.src])),
		family: i,
		images: {
			ambient: xt(a.ambient),
			description: w(a.description) ? a.description : null,
			inspiration: xt(a.inspiration)
		},
		glossary: St(r),
		files: Nt(r.defaultVariant).filter((e) => e.type === "cad" || e.type === "manual")
	};
}
var xt = (e) => [...new Set([e ?? []].flat().filter(w))];
function St(e) {
	return {
		columns: ee.filter(({ field: t }) => e.variants.some((e) => w(e.values[t]))).map(({ field: e, label: t }) => ({
			key: e,
			label: t
		})),
		filters: e.variantAttributes.map((e) => ({
			key: e,
			label: h(e).label,
			swatches: h(e).control === "swatches"
		})),
		rows: e.variants.map((e) => ({
			sku: e.sku,
			thumb: e.images?.studio ?? null,
			attributes: e.values,
			values: e.values
		}))
	};
}
function Ct(e, t) {
	let n = e.collectionData?.name;
	if (!n) return e.name.split(/\s+/)[0];
	let r = t.filter((t) => t.collection === e.collection);
	if (r.length === 1) return n;
	let i = r.filter((t) => t.application === e.application);
	return e.application && i.length === 1 ? `${n} ${e.application}` : e.name;
}
async function wt() {
	return null;
}
async function Tt() {
	let e = await Et(), t = await wt();
	return t ? t.fixtures.downloadsTable(t.mode, e) : e;
}
async function Et() {
	let { groups: e } = await x(), t = e.flatMap((e) => e.variants.map((t) => ({
		group: e,
		variant: t
	}))), n = (e) => new Set(t.map(({ variant: t }) => t.values[e]).filter(w)).size > 1;
	return {
		columns: te.filter(({ field: e }) => t.some(({ variant: t }) => w(t.values[e]))).map(({ field: e, label: t, column: n }) => ({
			key: e,
			label: n ?? t
		})),
		filters: te.filter(({ field: e }) => n(e)).map(({ field: e, label: t }) => ({
			key: e,
			label: t,
			swatches: h(e).control === "swatches"
		})),
		rows: t.map(({ group: t, variant: n }) => ({
			sku: n.sku,
			name: Ct(t, e),
			href: $e(t.id, n.sku),
			meta: t.variantAttributes.map((e) => n.values[e]).filter(w).join(", "),
			thumb: n.images?.studio ?? null,
			search: [t.name, t.collectionData?.name].filter(Boolean).join(" "),
			attributes: n.values,
			values: n.values
		}))
	};
}
async function Dt(e) {
	let t = await wt(), n = t?.fixtures.skuFiles(t.mode, e);
	if (n) return n;
	let { groups: r } = await x(), i = r.find((t) => t.variants.some((t) => t.sku === e));
	return i ? (await Qe(i), Nt(i.variants.find((t) => t.sku === e))) : [];
}
async function Ot(e) {
	let { groups: t } = await x(), n = t.find((t) => t.variants.some((t) => t.sku === e));
	if (!n) return null;
	let r = n.variants.find((t) => t.sku === e), i = E(r.images), a = E(n.defaultVariant.images);
	return {
		name: n.name,
		sku: r.sku,
		image: i.main ?? i.studio ?? a.main ?? a.studio ?? null,
		sections: re(r.values)
	};
}
async function kt(e) {
	let { groupById: t } = await x();
	return e.map((e) => t.get(e)).filter(Boolean).map((e) => ({
		...T(e),
		meta: jt(e)
	}));
}
async function At() {
	let { groups: e } = await x();
	return e.flatMap((e) => e.variants.filter((e) => e.isNew).map((t) => ({
		...T(e, t),
		meta: jt(e)
	})));
}
function jt(e) {
	return e.productType && e.productType !== "Luminaria" ? e.productType : e.application ?? e.productType ?? "";
}
var Mt = {
	cad: "CAD 2D/3D",
	manual: "Manual",
	ies: "IES",
	fotometria: "Fotometría"
};
function Nt(e) {
	let t = E(e.downloads);
	return Object.keys(Mt).filter((e) => t[e]).map((e) => ({
		type: e,
		label: Mt[e],
		href: t[e]
	}));
}
function Pt(e, t) {
	let n = e.variants.find((e) => e.sku === t) ?? e.defaultVariant, r = E(n.images), i = r.gallery ?? [r.studio].filter(Boolean), a = r.galleryOn ?? [r.studioOn ?? null];
	return {
		sku: n.sku,
		description: n.description,
		values: n.values,
		images: i.map((t, n) => ({
			src: t,
			srcOn: a[n] ?? null,
			alt: `${e.name}, imagen ${n + 1}`
		})),
		sections: re(n.values),
		downloads: Nt(n)
	};
}
async function Ft(e) {
	let { collectionById: t, groups: n } = await x(), r = t.get(e);
	if (!r) return null;
	let i = r.images ?? {};
	return {
		collection: r,
		cards: n.filter((t) => t.collection === e).map((e) => ({
			...T(e),
			meta: It(e)
		})),
		images: {
			gallery: xt(i.gallery),
			description: w(i.description) ? i.description : null,
			inspiration: xt(i.inspiration)
		}
	};
}
function It(e) {
	let t = (e) => Number.parseFloat(String(e).replace(",", "."));
	return e.variantAttributes.filter((e) => h(e).control !== "swatches").map((n) => {
		let r = [...new Set(e.variants.map((e) => e.values[n]).filter(w))];
		return r.sort((e, n) => t(e) - t(n) || String(e).localeCompare(String(n), "es")), r.length > 1 ? `${r[0]} – ${r.at(-1)}` : r[0];
	}).filter(Boolean).join(" · ");
}
var Lt = (e) => e.variants.map((t) => ({
	sku: t.sku,
	isDefault: t === e.defaultVariant,
	attributes: t.values
})), Rt = (e, t) => Object.fromEntries(e.variantAttributes.map((e) => [e, t.values[e]]));
function zt(e, t) {
	let n = Rt(e, t);
	return Pe(Lt(e), e.variantAttributes, n).map(({ attribute: t, options: r }) => {
		let i = h(t);
		return {
			field: t,
			label: i.label,
			value: n[t] ?? "",
			options: r.map((t) => ({
				value: t.value,
				label: t.value,
				disabled: t.disabled,
				showSwatch: i.control === "swatches",
				swatch: i.control === "swatches" ? qe(t.value, e.family) ?? void 0 : void 0
			}))
		};
	});
}
async function Bt(e, t, n) {
	let { groups: r } = await x(), i = r.find((t) => t.variants.some((t) => t.sku === e)), a = i?.variants.find((t) => t.sku === e);
	if (!i || !a) return null;
	let o = Re(Rt(i, a), t, n);
	return Me(Lt(i), o)?.sku ?? null;
}
async function Vt(e) {
	let { groups: t } = await x(), n = e.slice(0, 3).flatMap((e) => {
		let n = t.find((t) => t.variants.some((t) => t.sku === e));
		return n ? [{
			group: n,
			variant: n.variants.find((t) => t.sku === e)
		}] : [];
	}), r = n.map(({ group: e, variant: t }) => {
		let n = T(e, t);
		return {
			sku: t.sku,
			name: e.name,
			meta: t.sku,
			image: n.image,
			href: n.href,
			attributes: zt(e, t)
		};
	}), i = re(Object.assign({}, ...n.map(({ variant: e }) => e.values))).map((e) => ({
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
var Ht = (e) => [
	e.name,
	e.collectionData?.name,
	e.application,
	e.productType,
	...e.environment
].join(" ");
function Ut(e, t) {
	if (ce(Ht(e), t)) return {
		variant: e.defaultVariant,
		bySku: !1
	};
	let n = e.variants.find((e) => ce(e.sku, t));
	return n ? {
		variant: n,
		bySku: !0
	} : null;
}
async function Wt(e, { limit: t = 5 } = {}) {
	let n = se(e);
	if (!n.length) return {
		results: [],
		total: 0
	};
	let { groups: r, collections: i } = await x(), a = r.flatMap((e) => {
		let t = Ut(e, n);
		if (!t) return [];
		let r = T(e, t.variant);
		return [{
			kind: "product",
			name: e.name,
			meta: t.variant.sku,
			href: r.href,
			image: r.image
		}];
	}), o = i.filter((e) => ce(e.name, n)).map((e) => ({
		kind: "collection",
		name: e.name,
		meta: "Colección",
		href: S(e.id),
		image: e.images?.studio ?? null
	}));
	return {
		results: [...a, ...o].slice(0, t),
		total: a.length
	};
}
var Gt = (e) => `/arq/productos?q=${encodeURIComponent(e)}`, Kt = "Lámparas y artefactos", qt = (e) => !e.productType || e.productType === "Luminaria";
function Jt(e) {
	return qt(e) ? ot(e) : [Kt, e.application ?? e.productType].filter(Boolean).join(" · ");
}
async function Yt({ query: e = "", selected: t = [] } = {}) {
	let { groups: n } = await x(), r = se(e), i = new Set(t);
	return { items: n.flatMap((e) => {
		if (!e.hasDefault) return [];
		let t = r.length ? Ut(e, r) : { variant: e.defaultVariant };
		return t ? [{
			id: e.id,
			sku: t.variant.sku,
			name: e.name,
			meta: Jt(e),
			cardMeta: ot(e),
			image: T(e, t.variant).image,
			added: e.variants.some((e) => i.has(e.sku))
		}] : [];
	}) };
}
async function Xt() {
	let { groups: e, collections: t } = await x(), n = e.filter((e) => e.hasDefault), r = (e) => n.filter((t) => rt(t, e) && nt(t, e.productType)).length, i = (e) => {
		let t = E(e.defaultVariant.images);
		return {
			image: t.context ?? t.studio ?? null,
			thumb: t.studio ?? null
		};
	}, a = (e) => n.filter((t) => rt(t, e)).map(i).find((e) => e.image) ?? {
		image: null,
		thumb: null
	}, o = (e, t) => ({
		label: e,
		href: C(t),
		count: r(t),
		...a(t)
	}), s = (e, t) => {
		let r = [
			...[...new Set(n.filter((t) => t.productType === "Luminaria" && t.environment.includes(e)).map((e) => e.application).filter(Boolean))].map((t) => o(t, {
				environment: e,
				application: t,
				productType: "Luminaria"
			})),
			o("Artefactos", {
				environment: e,
				productType: "Artefacto"
			}),
			o("Lámparas", {
				environment: e,
				productType: "Lámpara"
			})
		].filter((e) => e.count);
		return r.length ? {
			id: g(e),
			label: e,
			href: C({ environment: e }),
			all: {
				label: t,
				href: C({ environment: e })
			},
			links: r
		} : null;
	}, c = (e, t, r) => {
		let a = n.filter((t) => t.productType === e).map((e) => ({
			label: e.name,
			href: $e(e.id, e.defaultVariant.sku),
			count: 1,
			...i(e)
		}));
		return a.length ? {
			id: g(t),
			label: t,
			href: C({ productType: e }),
			all: {
				label: r,
				href: C({ productType: e })
			},
			links: a
		} : null;
	};
	return {
		sections: {
			interior: s("Interior", "Ver todo interior"),
			exterior: s("Exterior", "Ver todo exterior"),
			lamparas: c("Lámpara", "Lámparas", "Ver todas las lámparas"),
			artefactos: c("Artefacto", "Artefactos", "Ver todos los artefactos")
		},
		collections: t.map((e) => {
			let t = n.filter((t) => t.collection === e.id), r = E(e.images), i = [...new Set(t.flatMap((e) => e.environment))];
			return {
				label: e.name,
				meta: [...new Set(t.map((e) => e.application ?? e.productType).filter(Boolean))].join(" · "),
				href: S(e.id),
				eyebrow: i.length ? `Línea ${i.join(" · ")}` : "",
				image: r.context ?? r.studio ?? null,
				thumb: r.studio ?? null
			};
		}).filter((e) => e.meta),
		allCollections: {
			label: "Ver todas las colecciones",
			href: "/arq/productos?view=colecciones"
		}
	};
}
//#endregion
//#region src/styles/print-tokens.js
var D = Object.freeze({
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
	"color/overlay/scrim": "#00000099",
	"color/overlay/translucent": "#1010101A",
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
	"layout/compare-label": 200,
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
}), O = Object.freeze({
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
}), Zt = [
	"M13.2112 1.03819C13.5552 0.538809 14.1401 0.243121 14.7662 0.243121H16.9337V15.6977H13.452V7.16879C13.452 6.99138 13.2112 6.92567 13.108 7.07023L8.62167 13.4637C8.54598 13.5688 8.38772 13.5688 8.31203 13.4637L3.80509 7.07023C3.70188 6.92567 3.46793 6.99138 3.46793 7.16879V15.6977H0V0.243121H2.16746C2.79361 0.243121 3.37848 0.538809 3.72252 1.03819L8.31203 7.76674C8.38772 7.87187 8.55286 7.87187 8.62855 7.76674L13.2112 1.03819ZM35.0922 15.6977H31.1564L30.5233 14.1799C30.5233 14.1799 30.5233 14.1667 30.5164 14.1602C30.1518 13.306 29.4362 13.1351 28.5623 13.1351H23.5943L22.5209 15.6977H18.592L24.8604 1.07105C25.0806 0.571663 25.5898 0.243121 26.1609 0.243121H28.4591L28.4797 0.295688L35.0853 15.6977H35.0922ZM29.0095 10.2571L27.021 5.46037C26.9591 5.30924 26.7389 5.30924 26.6769 5.46037L24.6677 10.2637H29.0164L29.0095 10.2571ZM47.6703 10.7828C47.6703 10.7828 46.2873 12.6949 43.5487 12.6949C42.1657 12.6949 41.0235 12.2546 40.0533 11.361C39.1175 10.4476 38.6633 9.34374 38.6633 7.98357C38.6633 6.62341 39.1175 5.51951 40.0533 4.60616C41.0166 3.71253 42.1657 3.27228 43.5487 3.27228C45.1244 3.27228 46.4455 3.85051 47.4914 4.99384L47.5534 5.05955L49.191 2.51663C49.2804 2.37207 49.2529 2.18152 49.1222 2.06324C47.574 0.742505 45.6405 0.0197125 43.5487 0.0197125C41.1542 0.0197125 39.1725 0.755647 37.4936 2.28008C36.0073 3.64682 35.0096 5.85462 35.0096 7.977C35.0096 10.2702 35.8216 12.1363 37.4936 13.6739C39.1725 15.1918 41.1542 15.9343 43.5487 15.9343C45.7024 15.9343 47.6979 15.1721 49.2598 13.7725C49.3905 13.6542 49.4181 13.4702 49.3217 13.3257L47.6703 10.7828ZM60.9985 9.66571C60.9022 9.7117 60.8677 9.82998 60.9297 9.9154L64.9068 15.6912H61.4113C60.9297 15.6912 60.4755 15.4481 60.2209 15.0604L57.331 10.6053H55.1291V15.6912H51.4617V3.48912V0.243121H58.198C59.7118 0.243121 61.0122 0.742505 62.065 1.7347C63.1522 2.72033 63.682 3.90965 63.682 5.36838C63.682 7.22793 62.5811 8.88378 60.9916 9.66571M55.1291 7.27392C55.1291 7.37248 55.2117 7.45134 55.3149 7.45134H57.8127C59.1407 7.45134 59.9939 6.64969 59.9939 5.41437C59.9939 4.31704 59.1819 3.48912 58.1085 3.48912H55.1291V7.27392ZM79.7281 2.32608C81.3795 3.86366 82.2121 5.77577 82.2121 8.00329C82.2121 10.2374 81.3864 12.1561 79.7487 13.7002C78.1042 15.2312 76.0881 16.0066 73.7349 16.0066C71.4092 16.0066 69.3862 15.2312 67.7279 13.7002C66.0903 12.1561 65.2646 10.2374 65.2646 8.00329C65.2646 5.78234 66.0903 3.87023 67.7279 2.32608C69.3862 0.78193 71.4092 0 73.7418 0C76.0881 0 78.0973 0.78193 79.735 2.32608M68.9665 8.00329C68.9665 9.34374 69.4206 10.4476 70.3495 11.3676C71.2647 12.2546 72.4069 12.708 73.7418 12.708C75.0904 12.708 76.1913 12.2612 77.1134 11.3478C78.0423 10.4411 78.5171 9.31745 78.5171 8.00329C78.5171 6.70883 78.056 5.59179 77.1409 4.67844C76.2189 3.75852 75.0766 3.29199 73.7486 3.29199C72.4206 3.29199 71.2784 3.75852 70.3564 4.67844C69.4413 5.58522 68.9734 6.70883 68.9734 8.00329M86.6433 0.243121H84.2832V3.48912V15.6977H94.164V12.3598H88.2328C88.1296 12.3598 88.047 12.2809 88.047 12.1823V1.577C88.047 0.841068 87.4208 0.243121 86.6433 0.243121ZM100.185 12.4517C100.082 12.4517 99.999 12.3729 99.999 12.2743V9.37659H105.951V6.16345H100.192C100.088 6.16345 100.006 6.0846 100.006 5.98604V3.48912H105.779C106.55 3.48912 107.183 2.89117 107.183 2.15524V0.243121H96.3177V15.6977H107.492V12.4517H100.192H100.185ZM124.364 8.00329C124.364 10.3359 123.621 12.2218 122.148 13.6148C120.71 15.0012 118.598 15.7043 115.866 15.7043H109.928V0.243121H115.846C118.557 0.243121 120.669 0.965914 122.128 2.39836C123.614 3.80452 124.364 5.69035 124.364 8.00329ZM113.623 12.2678C113.623 12.3663 113.706 12.4452 113.809 12.4452H115.639C119.052 12.4452 120.641 11.0324 120.641 7.99672C120.641 6.59055 120.256 5.47351 119.506 4.68501C118.77 3.88994 117.463 3.48912 115.612 3.48912H113.616V12.2743L113.623 12.2678Z",
	"M141.655 1.64271H140.912L135.532 15.5006H134.142L139.977 0.512526H142.578L148.385 15.5072H147.016L141.655 1.64928V1.64271ZM136.722 10.2374H145.873V11.3741H136.722V10.2374Z",
	"M156.89 0.512526C158.128 0.512526 159.133 0.70308 159.903 1.09076C160.674 1.47844 161.245 1.99754 161.617 2.65462C161.988 3.3117 162.174 4.05421 162.174 4.88214C162.174 5.49322 162.071 6.06489 161.858 6.59713C161.651 7.12279 161.328 7.58932 160.894 7.977C160.461 8.37125 159.917 8.68008 159.257 8.91006C158.596 9.14004 157.819 9.25175 156.924 9.25175H153.023V15.5072H151.653V0.512526H156.883H156.89ZM160.791 4.88214C160.791 3.89651 160.495 3.11458 159.897 2.5232C159.298 1.9384 158.293 1.64271 156.89 1.64271H153.029V8.08871H156.931C157.825 8.08871 158.562 7.95072 159.126 7.68131C159.69 7.41191 160.11 7.0308 160.385 6.54456C160.653 6.05832 160.791 5.4998 160.791 4.87557V4.88214ZM158.073 8.75893L162.449 15.5072H160.901L156.594 8.75893H158.073Z",
	"M180.415 4.91499C180.023 3.98193 179.486 3.17372 178.791 2.49692C178.096 1.82012 177.277 1.29446 176.349 0.919918C175.413 0.551951 174.401 0.361396 173.307 0.361396C172.213 0.361396 171.174 0.54538 170.232 0.919918C169.289 1.29446 168.47 1.81355 167.761 2.49692C167.059 3.17372 166.516 3.98193 166.137 4.91499C165.759 5.84805 165.566 6.87967 165.566 8.00986C165.566 9.14004 165.759 10.1717 166.137 11.1047C166.516 12.0378 167.059 12.846 167.761 13.5228C168.463 14.1996 169.289 14.7253 170.232 15.0998C171.174 15.4743 172.199 15.6583 173.307 15.6583C174.415 15.6583 175.413 15.4743 176.349 15.0998C177.284 14.7318 178.096 14.2062 178.791 13.5228C179.486 12.846 180.03 12.0378 180.415 11.1047C180.8 10.1717 181 9.14004 181 8.00986C181 6.87967 180.807 5.84805 180.415 4.91499ZM178.771 11.4793C178.206 12.4517 177.456 13.2008 176.507 13.7265C175.557 14.2522 174.491 14.5216 173.307 14.5216C172.124 14.5216 171.037 14.2587 170.08 13.7265C169.124 13.2008 168.367 12.4517 167.803 11.4793C167.238 10.5068 166.963 9.35031 166.963 8.00986C166.963 6.6694 167.245 5.50637 167.803 4.52731C168.367 3.54825 169.124 2.79918 170.08 2.28008C171.037 1.76099 172.117 1.49815 173.307 1.49815C174.498 1.49815 175.55 1.76099 176.507 2.28008C177.456 2.79918 178.213 3.54825 178.771 4.52731C179.335 5.50637 179.61 6.66283 179.61 8.00986C179.61 9.35688 179.328 10.5068 178.771 11.4793Z",
	"M176.698 10.9485L175.745 11.8591L179.598 15.539L180.552 14.6283L176.698 10.9485Z"
], k = Object.freeze({
	width: 181,
	height: 16
}), Qt = Object.freeze({
	default: 181,
	small: 158,
	compact: 117
}), A = Object.freeze({
	eyebrow: "Ficha técnica",
	brand: "Macroled Arq",
	legal: "Los datos técnicos pueden variar sin previo aviso."
}), $t = .75, j = (e) => e * $t, en = Object.freeze({
	width: 595.28,
	height: 841.89
}), tn = 1.2, M = {
	top: D["space/padding/xl-2xl"],
	side: D["space/padding/2xl"],
	bottom: D["space/padding/xl"]
}, nn = D["border/default"], rn = (e) => `${D["font/family/sans"].replace(/\s+/g, "")}-${e}`, an = Object.freeze([...new Set([
	"label",
	"display",
	"body-lg",
	"body",
	"body-lg-regular",
	"body-sm"
].map((e) => O[e].fontWeight))]);
function on(e, t = D["color/surface/default"]) {
	let n = e.match(/^#([0-9a-f]{6})([0-9a-f]{2})?$/i);
	if (!n?.[2]) return e;
	let r = parseInt(n[2], 16) / 255, i = (e) => [
		0,
		2,
		4
	].map((t) => parseInt(e.slice(t, t + 2), 16)), a = i(t.replace("#", ""));
	return `#${i(n[1]).map((e, t) => Math.round(e * r + a[t] * (1 - r))).map((e) => e.toString(16).padStart(2, "0")).join("")}`;
}
var N = (e) => on(D[`color/${e}`]);
function P(e, t, n, { above: r = 0 } = {}) {
	let i = O[t], a = j((i.lineHeight - tn * i.fontSize) / 2);
	return {
		text: i.textTransform === "uppercase" ? String(e).toLocaleUpperCase("es") : String(e),
		font: rn(i.fontWeight),
		fontSize: j(i.fontSize),
		lineHeight: i.lineHeight / (tn * i.fontSize),
		characterSpacing: j(i.letterSpacing),
		color: N(n),
		margin: [
			0,
			j(r) + a,
			0,
			-a
		]
	};
}
function sn(e, { lineAt: t, lineColor: n, padding: r }) {
	return {
		table: {
			widths: ["*"],
			body: [[e]]
		},
		layout: {
			hLineWidth: (e) => e === +(t === "bottom") ? j(nn) : 0,
			vLineWidth: () => 0,
			hLineColor: () => n,
			paddingLeft: () => 0,
			paddingRight: () => 0,
			paddingTop: () => t === "top" ? j(r) : 0,
			paddingBottom: () => t === "bottom" ? j(r) : 0
		}
	};
}
function cn() {
	let e = Qt.small, t = Zt.map((e) => `<path d="${e}"/>`).join("");
	return {
		svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${k.width} ${k.height}" fill="${N("text/primary")}">${t}</svg>`,
		width: j(e),
		height: j(e * k.height / k.width)
	};
}
var ln = Math.max(O.label.lineHeight, Qt.small * k.height / k.width) + D["space/padding/md"] + nn, un = Math.max(O["body-sm"].lineHeight, O.label.lineHeight) + D["space/padding/md"] + nn;
function dn(e) {
	let t = cn(), n = j((O.label.lineHeight - Qt.small * k.height / k.width) / 2), r = e.map((e) => ({
		...P(e, "label", "text/tertiary"),
		width: "auto"
	}));
	return sn({
		columns: [
			{
				...t,
				margin: [
					0,
					n,
					0,
					0
				]
			},
			{
				width: "*",
				text: ""
			},
			...r
		],
		columnGap: j(D["space/gap/md"])
	}, {
		lineAt: "bottom",
		lineColor: N("border/subtle"),
		padding: D["space/padding/md"]
	});
}
function fn(e, t, n) {
	return sn({ columns: [{
		...P(e, "body-sm", "text/tertiary"),
		width: "*"
	}, {
		...P(`${t} / ${n}`, "label", "text/tertiary"),
		width: "auto"
	}] }, {
		lineAt: "top",
		lineColor: N("border/subtle"),
		padding: D["space/padding/md"]
	});
}
var pn = en.width / $t - 2 * M.side;
function mn({ nameLines: e = 1, skuLines: t = 1 } = {}) {
	let n = O.label.lineHeight + D["space/gap/sm-md"] + e * O.display.lineHeight + D["space/gap/sm-md"] + t * O["body-lg"].lineHeight + D["space/padding/xl-2xl"], r = en.height / $t - M.top - ln - D["space/padding/xl-2xl"] - D["space/gap/xl-2xl"] - n - un - M.bottom;
	return Math.floor(r) - 1;
}
function hn(e, t, n) {
	let r = j(D["space/padding/sm-md"]);
	return {
		id: `spec-${t}`,
		table: {
			widths: [j(D["layout/pdf-spec-label"]), "*"],
			headerRows: 1,
			keepWithHeaderRows: 1,
			dontBreakRows: !0,
			body: [[{
				...P(e.label, "label", "text/primary"),
				colSpan: 2
			}, {}], ...e.rows.map((e) => [P(e.label, "body", "text/secondary"), P(e.value, "body-lg-regular", "text/primary")])]
		},
		layout: {
			hLineWidth: (e) => e === 0 ? 0 : j(nn),
			vLineWidth: () => 0,
			hLineColor: (e) => N(e === 1 ? "border/strong" : "border/subtle"),
			paddingLeft: (e) => e === 0 ? 0 : j(D["space/gap/lg"]),
			paddingRight: () => 0,
			paddingTop: (e) => e === 0 ? 0 : r,
			paddingBottom: () => r
		},
		pageBreak: t === 0 ? "before" : void 0,
		margin: [
			0,
			0,
			0,
			n ? 0 : j(D["space/gap/xl-2xl"])
		]
	};
}
function gn(e, { getPreviousNodesOnPage: t }) {
	return !String(e.id ?? "").startsWith("spec-") || e.pageNumbers.length < 2 ? !1 : t().length > 0;
}
function _n(e, { image: t = null, nameLines: n = 1, skuLines: r = 1 } = {}) {
	let i = mn({
		nameLines: n,
		skuLines: r
	}), a = M.top + ln + D["space/padding/xl-2xl"], o = M.top + ln + D["space/padding/2xl"], s = {
		width: j(pn),
		height: j(i)
	}, c = e.sections ?? [], l = [{
		...t ? {
			image: t,
			...s
		} : { canvas: [{
			type: "rect",
			x: 0,
			y: 0,
			w: s.width,
			h: s.height,
			color: N("surface/subtle")
		}] },
		margin: [
			0,
			j(a - o),
			0,
			j(D["space/gap/xl-2xl"])
		]
	}, {
		stack: [
			P(A.eyebrow, "label", "text/tertiary"),
			P(e.name, "display", "text/primary", { above: D["space/gap/sm-md"] }),
			P(e.sku, "body-lg", "text/secondary", { above: D["space/gap/sm-md"] })
		],
		unbreakable: !0
	}];
	return {
		pageSize: "A4",
		pageMargins: [
			j(M.side),
			j(o),
			j(M.side),
			j(un + M.bottom)
		],
		info: {
			title: `${A.eyebrow} · ${e.name} · ${e.sku}`,
			author: A.brand
		},
		header: (t) => ({
			...dn(t === 1 ? [A.eyebrow] : [e.name, e.sku]),
			margin: [
				j(M.side),
				j(M.top),
				j(M.side),
				0
			]
		}),
		footer: (e, t) => ({
			...fn(e === 1 ? A.brand : A.legal, e, t),
			margin: [
				j(M.side),
				0,
				j(M.side),
				0
			]
		}),
		pageBreakBefore: gn,
		defaultStyle: { font: rn(O.body.fontWeight) },
		content: [...l, ...c.map((e, t) => hn(e, t, t === c.length - 1))]
	};
}
//#endregion
//#region src/pdf/ficha-tecnica.js
var vn = 2.5, yn = .9, bn = null;
function xn() {
	return bn ??= import(
		/* @vite-ignore */
		n.pdf.pdfmakeUrl
).then(({ default: e }) => {
		let t = {};
		for (let e of an) {
			let r = n.pdf.fontUrl.replace("{weight}", e);
			t[rn(e)] = {
				normal: r,
				bold: r,
				italics: r,
				bolditalics: r
			};
		}
		return e.addFonts(t), e.setUrlAccessPolicy((e) => e.startsWith(n.pdf.fontUrl.split("{weight}")[0])), e;
	}), bn.catch(() => bn = null), bn;
}
async function Sn(e, t) {
	let n = O[t], r = `${n.fontWeight} ${n.fontSize}px "${D["font/family/sans"]}"`;
	try {
		await document.fonts?.load(r, e);
	} catch {}
	let i = document.createElement("canvas").getContext("2d");
	i.font = r;
	let a = (e) => i.measureText(e).width + e.length * n.letterSpacing, o = 1, s = "";
	for (let t of String(e).split(/\s+/).filter(Boolean)) {
		let e = s ? `${s} ${t}` : t;
		s && a(e) > pn ? (o += 1, s = t) : s = e;
	}
	return o;
}
function Cn(e, t, n) {
	return e ? new Promise((r) => {
		let i = new Image();
		i.crossOrigin = "anonymous", i.decoding = "async", i.onload = () => {
			try {
				let e = document.createElement("canvas");
				e.width = Math.round(t * vn), e.height = Math.round(n * vn);
				let a = e.getContext("2d");
				a.fillStyle = D["color/surface/subtle"], a.fillRect(0, 0, e.width, e.height);
				let o = Math.max(e.width / i.naturalWidth, e.height / i.naturalHeight), s = i.naturalWidth * o, c = i.naturalHeight * o;
				a.drawImage(i, (e.width - s) / 2, (e.height - c) / 2, s, c), r(e.toDataURL("image/jpeg", yn));
			} catch (t) {
				console.warn("[arq] ficha técnica: la imagen no se puede usar en el PDF (¿falta CORS en el servidor de imágenes?)", e, t), r(null);
			}
		}, i.onerror = () => {
			console.warn("[arq] ficha técnica: no se pudo cargar la imagen", e), r(null);
		}, i.src = e;
	}) : Promise.resolve(null);
}
var wn = (e) => `ficha-tecnica-${String(e).replace(/[^\w-]+/g, "-").replace(/^-+|-+$/g, "")}.pdf`;
async function Tn(e) {
	let t = await Ot(e);
	if (!t) return null;
	let [n, r] = await Promise.all([Sn(t.name, "display"), Sn(t.sku, "body-lg")]);
	return {
		data: t,
		definition: _n(t, {
			image: await Cn(t.image, pn, mn({
				nameLines: n,
				skuLines: r
			})),
			nameLines: n,
			skuLines: r
		})
	};
}
var En = /* @__PURE__ */ new Map();
function Dn(e) {
	if (En.has(e)) return En.get(e);
	let t = window.open("", "_blank"), n = (async () => {
		try {
			let [n, r] = await Promise.all([xn(), Tn(e)]);
			if (!r) throw Error(`el SKU «${e}» no está en el catálogo`);
			let i = n.createPdf(r.definition);
			t && !t.closed ? await i.open(t) : await i.download(wn(r.data.sku));
		} catch (e) {
			throw t?.close(), e;
		}
	})().finally(() => En.delete(e));
	return En.set(e, n), n;
}
//#endregion
//#region src/styles/roles.css?inline
var On = ".role-display-lg{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-light);font-size:var(--arq-type-display-lg-size);line-height:var(--arq-type-display-lg-leading);letter-spacing:var(--arq-font-tracking-tighter)}.role-display{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-light);font-size:var(--arq-type-display-size);line-height:var(--arq-type-display-leading);letter-spacing:var(--arq-font-tracking-tighter)}.role-display-sm{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-light);font-size:var(--arq-type-display-sm-size);line-height:var(--arq-type-display-sm-leading);letter-spacing:var(--arq-font-tracking-tight)}.role-heading-1{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-light);font-size:var(--arq-type-heading-1-size);line-height:var(--arq-type-heading-1-leading);letter-spacing:var(--arq-font-tracking-tight)}.role-heading-2{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-light);font-size:var(--arq-type-heading-2-size);line-height:var(--arq-type-heading-2-leading);letter-spacing:var(--arq-font-tracking-normal)}.role-heading-3{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-regular);font-size:var(--arq-type-heading-3-size);line-height:var(--arq-type-heading-3-leading);letter-spacing:var(--arq-font-tracking-normal)}.role-heading-3-light{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-light);font-size:var(--arq-type-heading-3-size);line-height:var(--arq-type-heading-3-leading);letter-spacing:var(--arq-font-tracking-normal)}.role-body-xl{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-regular);font-size:var(--arq-type-body-xl-size);line-height:var(--arq-type-body-xl-leading);letter-spacing:var(--arq-font-tracking-normal)}.role-body-lg{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-light);font-size:var(--arq-type-body-lg-size);line-height:var(--arq-type-body-lg-leading);letter-spacing:var(--arq-font-tracking-normal)}.role-body-lg-regular{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-regular);font-size:var(--arq-type-body-lg-size);line-height:var(--arq-type-body-lg-leading);letter-spacing:var(--arq-font-tracking-normal)}.role-body-lg-medium{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-medium);font-size:var(--arq-type-body-lg-size);line-height:var(--arq-type-body-lg-leading);letter-spacing:var(--arq-font-tracking-normal)}.role-body{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-light);font-size:var(--arq-type-body-size);line-height:var(--arq-type-body-leading);letter-spacing:var(--arq-font-tracking-normal)}.role-body-regular{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-regular);font-size:var(--arq-type-body-size);line-height:var(--arq-type-body-leading);letter-spacing:var(--arq-font-tracking-normal)}.role-body-medium{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-medium);font-size:var(--arq-type-body-size);line-height:var(--arq-type-body-leading);letter-spacing:var(--arq-font-tracking-normal)}.role-body-strong{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-semibold);font-size:var(--arq-type-body-size);line-height:var(--arq-type-body-leading);letter-spacing:var(--arq-font-tracking-normal)}.role-body-compact{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-light);font-size:var(--arq-type-body-compact-size);line-height:var(--arq-type-body-compact-leading);letter-spacing:var(--arq-font-tracking-normal)}.role-body-compact-regular{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-regular);font-size:var(--arq-type-body-compact-size);line-height:var(--arq-type-body-compact-leading);letter-spacing:var(--arq-font-tracking-normal)}.role-body-compact-medium{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-medium);font-size:var(--arq-type-body-compact-size);line-height:var(--arq-type-body-compact-leading);letter-spacing:var(--arq-font-tracking-normal)}.role-body-compact-strong{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-semibold);font-size:var(--arq-type-body-compact-size);line-height:var(--arq-type-body-compact-leading);letter-spacing:var(--arq-font-tracking-normal)}.role-body-sm{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-regular);font-size:var(--arq-type-body-sm-size);line-height:var(--arq-type-body-sm-leading);letter-spacing:var(--arq-font-tracking-normal)}.role-body-sm-medium{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-medium);font-size:var(--arq-type-body-sm-size);line-height:var(--arq-type-body-sm-leading);letter-spacing:var(--arq-font-tracking-normal)}.role-label-lg{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-regular);font-size:var(--arq-type-label-lg-size);line-height:var(--arq-type-label-lg-leading);letter-spacing:var(--arq-font-tracking-widest);text-transform:uppercase}.role-label{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-regular);font-size:var(--arq-type-label-size);line-height:var(--arq-type-label-leading);letter-spacing:var(--arq-font-tracking-widest);text-transform:uppercase}.role-label-sm{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-medium);font-size:var(--arq-type-label-sm-size);line-height:var(--arq-type-label-sm-leading);letter-spacing:var(--arq-font-tracking-widest);text-transform:uppercase}.role-caption{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-regular);font-size:var(--arq-type-caption-size);line-height:var(--arq-type-caption-leading);letter-spacing:var(--arq-font-tracking-wide)}.role-caption-medium{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-medium);font-size:var(--arq-type-caption-size);line-height:var(--arq-type-caption-leading);letter-spacing:var(--arq-font-tracking-wide)}", kn = "[data-arq-theme=dark]{--arq-color-surface-default:var(--arq-neutral-800);--arq-color-surface-faint:var(--arq-neutral-775);--arq-color-surface-hover:var(--arq-neutral-775);--arq-color-surface-soft:var(--arq-neutral-725);--arq-color-surface-subtle:var(--arq-neutral-750);--arq-color-surface-selected:var(--arq-neutral-725);--arq-color-surface-strong:var(--arq-neutral-700);--arq-color-surface-inverse:var(--arq-neutral-0);--arq-color-surface-inverse-hover:var(--arq-neutral-150);--arq-color-surface-inverse-pressed:var(--arq-neutral-200);--arq-color-surface-bone:var(--arq-neutral-750);--arq-color-text-primary:var(--arq-neutral-100);--arq-color-text-secondary:var(--arq-neutral-200);--arq-color-text-tertiary:var(--arq-neutral-500);--arq-color-text-inverse:var(--arq-neutral-800);--arq-color-text-accent:var(--arq-neutral-150);--arq-color-text-disabled:var(--arq-neutral-600);--arq-color-text-error:var(--arq-red-300);--arq-color-text-success:var(--arq-green-300);--arq-color-text-warning:var(--arq-amber-300);--arq-color-icon-primary:var(--arq-neutral-100);--arq-color-icon-secondary:var(--arq-neutral-200);--arq-color-icon-tertiary:var(--arq-neutral-500);--arq-color-icon-accent:var(--arq-neutral-150);--arq-color-icon-inverse:var(--arq-neutral-800);--arq-color-icon-disabled:var(--arq-neutral-600);--arq-color-border-subtle:var(--arq-alpha-white-10);--arq-color-border-default:var(--arq-alpha-white-22);--arq-color-border-strong:var(--arq-neutral-0);--arq-color-border-disabled:var(--arq-alpha-white-10);--arq-color-border-focus:var(--arq-neutral-150);--arq-color-border-error:var(--arq-red-300);--arq-color-action-primary:var(--arq-neutral-100);--arq-color-action-primary-hover:var(--arq-neutral-200);--arq-color-action-on-primary:var(--arq-neutral-900);--arq-color-accent-default:var(--arq-neutral-150)}", An = "[data-arq-theme=light]{--arq-color-surface-default:var(--arq-neutral-0);--arq-color-surface-faint:var(--arq-neutral-25);--arq-color-surface-hover:var(--arq-neutral-50);--arq-color-surface-soft:var(--arq-neutral-75);--arq-color-surface-subtle:var(--arq-neutral-100);--arq-color-surface-selected:var(--arq-neutral-150);--arq-color-surface-strong:var(--arq-neutral-200);--arq-color-surface-inverse:var(--arq-neutral-900);--arq-color-surface-inverse-hover:var(--arq-neutral-750);--arq-color-surface-inverse-pressed:var(--arq-neutral-600);--arq-color-surface-bone:var(--arq-offwhite-bone);--arq-color-text-primary:var(--arq-neutral-900);--arq-color-text-secondary:var(--arq-neutral-750);--arq-color-text-tertiary:var(--arq-neutral-600);--arq-color-text-inverse:var(--arq-neutral-0);--arq-color-text-accent:var(--arq-neutral-900);--arq-color-text-disabled:var(--arq-neutral-400);--arq-color-text-error:var(--arq-red-600);--arq-color-text-success:var(--arq-green-600);--arq-color-text-warning:var(--arq-amber-600);--arq-color-icon-primary:var(--arq-neutral-900);--arq-color-icon-secondary:var(--arq-neutral-750);--arq-color-icon-tertiary:var(--arq-neutral-600);--arq-color-icon-accent:var(--arq-neutral-900);--arq-color-icon-inverse:var(--arq-neutral-0);--arq-color-icon-disabled:var(--arq-neutral-400);--arq-color-border-subtle:var(--arq-alpha-ink-10);--arq-color-border-default:var(--arq-alpha-ink-22);--arq-color-border-strong:var(--arq-neutral-900);--arq-color-border-disabled:var(--arq-neutral-200);--arq-color-border-focus:var(--arq-neutral-900);--arq-color-border-error:var(--arq-red-600);--arq-color-action-primary:var(--arq-neutral-900);--arq-color-action-primary-hover:var(--arq-neutral-750);--arq-color-action-on-primary:var(--arq-neutral-0);--arq-color-accent-default:var(--arq-neutral-900)}", jn, Mn, Nn, Pn = /* @__PURE__ */ new Map();
function Fn(e) {
	let t = new CSSStyleSheet();
	return t.replaceSync(e), t;
}
function In() {
	return jn ??= Fn(On), jn;
}
function Ln() {
	return Mn ??= Fn(kn), Mn;
}
function Rn() {
	return Nn ??= Fn(An), Nn;
}
function zn(e, ...t) {
	let n = [
		In(),
		Ln(),
		Rn()
	];
	for (let e of t) e && (Pn.has(e) || Pn.set(e, Fn(e)), n.push(Pn.get(e)));
	e.adoptedStyleSheets = [...n, ...e.adoptedStyleSheets.filter((e) => !n.includes(e))];
}
//#endregion
//#region src/base/arq-element.js
var Bn = (e) => e.replace(/[A-Z]/g, (e) => `-${e.toLowerCase()}`), Vn = /* @__PURE__ */ new WeakMap(), Hn = "\n:host {\n  --page-gutter: max(var(--arq-layout-gutter), (100vw - var(--arq-layout-max-width)) / 2);\n}\n\n:host([hidden]),\n[hidden] {\n  display: none !important;\n}\n\n/* Táctil (mobile-native): sin el destello gris del navegador al tocar (cada\n   control tiene su propio Pressed o Hover), sin la espera del doble toque\n   (manipulation deja el desplazamiento y el zoom con dos dedos; touch-action\n   se suma con el de los ancestros, así que alcanza con el host) y sin\n   seleccionar el texto de un control al dejar el dedo apretado. El texto que\n   es contenido (mails, teléfonos, respuestas) se sigue pudiendo seleccionar. */\n:host {\n  -webkit-tap-highlight-color: var(--arq-color-surface-transparent);\n  touch-action: manipulation;\n}\n\nbutton,\n[role='button'],\n:host([role='button']),\n:host([role='radio']),\n:host([role='checkbox']) {\n  -webkit-user-select: none;\n  user-select: none;\n  -webkit-touch-callout: none;\n}\n\n*,\n*::before,\n*::after {\n  transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke;\n  transition-duration: var(--arq-theme-text-duration, var(--arq-motion-duration-fast)), var(--arq-motion-duration-fast), var(--arq-theme-text-duration, var(--arq-motion-duration-fast)), var(--arq-motion-duration-fast), var(--arq-theme-text-duration, var(--arq-motion-duration-fast)), var(--arq-theme-text-duration, var(--arq-motion-duration-fast)), var(--arq-theme-text-duration, var(--arq-motion-duration-fast));\n  transition-delay: var(--arq-theme-text-delay, 0s), 0s, var(--arq-theme-text-delay, 0s), 0s, var(--arq-theme-text-delay, 0s), var(--arq-theme-text-delay, 0s), var(--arq-theme-text-delay, 0s);\n  transition-timing-function: var(--arq-theme-text-easing, var(--arq-motion-easing-standard));\n}\n\n/* Íconos SVG: heredan el color del texto que los rodea. Sin transición propia,\n   porque se sumaría a la del padre y cambiarían mucho después (logo, flechas). */\nsvg,\nsvg * {\n  transition: none;\n}\n\n.visually-hidden {\n  position: absolute;\n  width: var(--arq-border-default);\n  height: var(--arq-border-default);\n  margin: calc(-1 * var(--arq-border-default));\n  overflow: hidden;\n  clip-path: inset(50%);\n  white-space: nowrap;\n}\n\n::slotted(h1),\n::slotted(h2),\n::slotted(h3),\n::slotted(h4),\n::slotted(h5),\n::slotted(h6) {\n  margin: 0 !important;\n  font: inherit !important;\n  letter-spacing: inherit !important;\n  text-transform: inherit !important;\n  color: inherit !important;\n}\n", F = class e extends HTMLElement {
	static tag = "";
	static styles = "";
	static template = "";
	static properties = {};
	static get observedAttributes() {
		return Object.entries(this.properties).map(([e, t]) => t.attribute ?? Bn(e));
	}
	static define() {
		if (!this.tag) throw Error(`${this.name}: falta static tag`);
		return customElements.get(this.tag) ? this : (e.#e.call(this), customElements.define(this.tag, this), this);
	}
	static #e() {
		this.attributeToProp = /* @__PURE__ */ new Map();
		for (let [e, t] of Object.entries(this.properties)) {
			let n = t.attribute ?? Bn(e);
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
		zn(e, Hn, this.constructor.styles);
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
		if (!Vn.has(e)) {
			let t = document.createElement("template");
			t.innerHTML = e.template, Vn.set(e, t);
		}
		return Vn.get(e);
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
}, Un = {
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
	filter: "<path vector-effect=\"non-scaling-stroke\" d=\"M2.5 4.5H13.5M4.5 8H11.5M7 11.5H9\"/>",
	"filter-off": "<path vector-effect=\"non-scaling-stroke\" d=\"M2 4H14M4 8H12M6 12H10M3 2L13 14\"/>",
	instagram: "<path vector-effect=\"non-scaling-stroke\" d=\"M11.667 4.33304H11.6736M4.6664 1.3328H11.3336C13.1747 1.3328 14.6672 2.8253 14.6672 4.6664V11.3336C14.6672 13.1747 13.1747 14.6672 11.3336 14.6672H4.6664C2.8253 14.6672 1.3328 13.1747 1.3328 11.3336V4.6664C1.3328 2.8253 2.8253 1.3328 4.6664 1.3328ZM10.6667 7.58017C10.749 8.13504 10.6542 8.70173 10.3958 9.19964C10.1375 9.69755 9.72871 10.1013 9.22765 10.3535C8.7266 10.6057 8.15878 10.6935 7.60496 10.6044C7.05115 10.5152 6.53953 10.2538 6.14288 9.85712C5.74624 9.46048 5.48476 8.94886 5.39564 8.39504C5.30652 7.84122 5.39431 7.27341 5.6465 6.77235C5.8987 6.2713 6.30246 5.86252 6.80037 5.60417C7.29827 5.34582 7.86496 5.25104 8.41984 5.33332C8.98583 5.41725 9.50983 5.68099 9.91442 6.08559C10.319 6.49018 10.5828 7.01417 10.6667 7.58017Z\" stroke-linecap=\"round\"/>",
	menu: "<path vector-effect=\"non-scaling-stroke\" d=\"M0 14H15.75M0 8H15.75M0 2H15.75\" stroke-linejoin=\"round\"/>",
	minus: "<path vector-effect=\"non-scaling-stroke\" d=\"M3 8H13\"/>",
	plus: "<path vector-effect=\"non-scaling-stroke\" d=\"M8 3V13M3 8H13\"/>",
	search: "<path vector-effect=\"non-scaling-stroke\" d=\"M13.6667 13.6667L10.676 10.6707M12.3333 6.66667C12.3333 8.16956 11.7363 9.6109 10.6736 10.6736C9.6109 11.7363 8.16956 12.3333 6.66667 12.3333C5.16377 12.3333 3.72243 11.7363 2.65973 10.6736C1.59702 9.6109 1 8.16956 1 6.66667C1 5.16377 1.59702 3.72243 2.65973 2.65973C3.72243 1.59702 5.16377 1 6.66667 1C8.16956 1 9.6109 1.59702 10.6736 2.65973C11.7363 3.72243 12.3333 5.16377 12.3333 6.66667Z\"/>",
	youtube: "<path vector-effect=\"non-scaling-stroke\" d=\"M1.66688 4.66703C1.20117 6.86458 1.20117 9.13533 1.66688 11.3329C1.72807 11.556 1.8463 11.7594 2.00994 11.9231C2.17358 12.0867 2.37699 12.2049 2.60018 12.2661C6.17568 12.8585 9.82432 12.8585 13.3998 12.2661C13.623 12.2049 13.8264 12.0867 13.9901 11.9231C14.1537 11.7594 14.2719 11.556 14.3331 11.3329C14.7988 9.13533 14.7988 6.86458 14.3331 4.66703C14.2719 4.44387 14.1537 4.24047 13.9901 4.07684C13.8264 3.91322 13.623 3.795 13.3998 3.73382C9.82431 3.14153 6.17569 3.14153 2.60018 3.73382C2.37699 3.795 2.17358 3.91322 2.00994 4.07684C1.8463 4.24047 1.72807 4.44387 1.66688 4.66703Z\" stroke-linecap=\"round\"/><path vector-effect=\"non-scaling-stroke\" d=\"M10 8L6.5 5.75V10.25L10 8Z\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>"
};
Object.freeze(Object.keys(Un));
function I(e) {
	let t = Un[e];
	return t ? `<svg class="icon" data-icon="${e}" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1" aria-hidden="true" focusable="false">${t}</svg>` : "";
}
//#endregion
//#region src/components/count-badge/count-badge.css?inline
var Wn = ":host{vertical-align:middle;flex:none;display:inline-flex;position:relative}:host(:state(empty)){display:none}.badge{box-sizing:border-box;min-width:calc(var(--arq-type-caption-leading) + var(--arq-space-padding-2xs) * 2);padding:var(--arq-space-padding-2xs) var(--arq-space-padding-xs);border-radius:var(--arq-radius-control);background:var(--arq-color-action-primary);color:var(--arq-color-action-on-primary);text-align:center;white-space:nowrap;font-variant-numeric:tabular-nums;justify-content:center;align-items:center;display:inline-flex}.visually-hidden{width:var(--arq-border-default);height:var(--arq-border-default);clip-path:inset(50%);white-space:nowrap;position:absolute;overflow:hidden}:host([tone=inverse]) .badge{background:var(--arq-color-action-on-primary);color:var(--arq-color-action-primary)}", Gn = 99;
(class extends F {
	static tag = "arq-count-badge";
	static styles = Wn;
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
		this.shadowRoot.querySelector(".badge").textContent = this.count > Gn ? `${Gn}+` : t, this.shadowRoot.querySelector(".visually-hidden").textContent = t, e ? this.#e.states.add("empty") : this.#e.states.delete("empty");
	}
}).define();
//#endregion
//#region src/components/button/button.css?inline
var Kn = ":host{vertical-align:middle;min-width:0;max-width:100%;transition:scale var(--arq-motion-duration-fast) var(--arq-motion-easing-out);display:inline-flex}@media (prefers-reduced-motion:no-preference){:host(:not([type=underline]):not([disabled]):not([loading]):active){scale:var(--arq-motion-scale-pressed)}}.control{box-sizing:border-box;justify-content:center;align-items:center;gap:var(--arq-space-gap-sm);max-width:100%;padding:var(--arq-space-gap-sm) var(--arq-space-padding-md);border-radius:var(--arq-radius-control);background:var(--arq-color-action-primary);color:var(--arq-color-action-on-primary);cursor:pointer;-webkit-tap-highlight-color:var(--arq-color-surface-transparent);border:0;flex:auto;margin:0;text-decoration:none;display:inline-flex;position:relative}.text{min-width:0;display:flex;position:relative}.label{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.leading,.trailing{flex:none;display:inline-flex}.icon{width:var(--arq-icon-md);height:var(--arq-icon-md)}.control:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.control:focus:not(:focus-visible){outline:none}.control.inactive{cursor:default}@media (hover:hover) and (pointer:fine){.control:not(.inactive):hover{background:var(--arq-color-action-primary-hover)}}.control:not(.inactive):active{background:var(--arq-color-surface-inverse-pressed)}.control.inactive{background:var(--arq-color-surface-subtle);color:var(--arq-color-text-disabled)}.control[aria-busy=true]{background:var(--arq-color-action-primary-hover);color:var(--arq-color-action-on-primary)}.visually-hidden{width:var(--arq-border-default);height:var(--arq-border-default);clip-path:inset(50%);white-space:nowrap;position:absolute;overflow:hidden}:host([type=outline]) .control{padding:calc(var(--arq-space-gap-sm) - var(--arq-border-default)) calc(var(--arq-space-padding-md) - var(--arq-border-default));border:var(--arq-border-default) solid var(--arq-color-border-strong);background:var(--arq-color-surface-transparent);color:var(--arq-color-action-primary)}@media (hover:hover) and (pointer:fine){:host([type=outline]) .control:not(.inactive):hover{background:var(--arq-color-surface-hover)}}:host([type=outline]) .control:not(.inactive):active{background:var(--arq-color-surface-selected)}:host([type=outline]) .control.inactive{border-color:var(--arq-color-border-disabled);background:var(--arq-color-surface-transparent);color:var(--arq-color-text-disabled)}:host([type=outline]) .control[aria-busy=true]{border-color:var(--arq-color-border-strong);background:var(--arq-color-surface-hover);color:var(--arq-color-action-primary)}:host([compact]) .control{font-size:var(--arq-type-body-compact-size);line-height:var(--arq-type-body-compact-leading)}:host([compact][type=underline]) .text:after,:host([compact][type=underline]) .control:not(.inactive):active .text:after{top:calc(100% - var(--arq-space-padding-2xs));height:var(--arq-border-default)}@media (hover:hover) and (pointer:fine){:host([compact][type=underline]) .control:not(.inactive):hover .text:after{height:var(--arq-border-default)}}:host([type=underline]) .control{padding:var(--arq-space-gap-xs) 0;background:var(--arq-color-surface-transparent);color:var(--arq-color-action-primary)}:host([type=underline]) .text:after{content:\"\";inset-inline:0;top:calc(100% + var(--arq-space-padding-2xs) - var(--arq-border-default));height:var(--arq-border-default);background:var(--arq-color-border-strong);visibility:hidden;position:absolute}:host([type=underline][show-underline]) .text:after,:host([type=underline]) .control:not(.inactive):active .text:after{visibility:visible}:host([type=underline]) .control:not(.inactive):active .text:after{height:var(--arq-border-strong)}@media (hover:hover) and (pointer:fine){:host([type=underline]) .control:not(.inactive):hover .text:after{visibility:visible;height:var(--arq-border-strong)}}:host([type=underline]) .control:not(.inactive):active{color:var(--arq-color-text-tertiary)}:host([type=underline]) .control:not(.inactive):active .text:after{background:var(--arq-color-text-tertiary)}:host([type=underline]) .control.inactive{background:var(--arq-color-surface-transparent);color:var(--arq-color-text-disabled)}:host([type=underline]) .control.inactive .text:after{background:var(--arq-color-border-disabled)}", qn = "Enviando…", Jn = ["filled", "outline"];
(class extends F {
	static tag = "arq-button";
	static styles = Kn;
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
		e.has("href") && this.#n(), e.has("loading") && this.loading && Jn.includes(this.type);
		let t = this.shadowRoot, n = this.#e, r = this.loading, i = this.loadingLabel?.trim() || qn, a = this.disabled || r;
		t.querySelector(".label[data-loading]").textContent = i, n.classList.toggle("inactive", a), r ? (n.setAttribute("aria-busy", "true"), n.setAttribute("aria-label", i)) : (n.removeAttribute("aria-busy"), n.removeAttribute("aria-label")), n.localName === "button" ? n.disabled = a : (a ? (n.removeAttribute("href"), n.setAttribute("aria-disabled", "true")) : (n.setAttribute("href", this.href), n.removeAttribute("aria-disabled")), this.target ? n.setAttribute("target", this.target) : n.removeAttribute("target"), this.target === "_blank" ? n.setAttribute("rel", "noopener") : n.removeAttribute("rel")), t.querySelector(".label:not([data-loading])").hidden = r, t.querySelector(".label[data-loading]").hidden = !r;
		let o = t.querySelector(".leading");
		e.has("leadingIcon") && (o.innerHTML = I(this.leadingIcon)), o.hidden = !this.showLeadingIcon || r;
		let s = t.querySelector(".trailing");
		e.has("icon") && (s.innerHTML = I(this.icon)), s.hidden = !this.showIcon || r;
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
var Yn = ":host{box-sizing:border-box;width:100%;height:var(--arq-border-default);background:var(--arq-color-border-subtle);flex:none;display:block}:host([emphasis=default]){background:var(--arq-color-border-default)}:host([orientation=vertical]){width:var(--arq-border-default);align-self:stretch;height:auto;display:inline-block}";
(class extends F {
	static tag = "arq-divider";
	static styles = Yn;
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
var Xn = ":host{vertical-align:middle;color:var(--arq-color-text-primary);flex:none;display:inline-flex}.link{color:inherit;transition:none;display:inline-flex}.link:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.link:focus:not(:focus-visible){outline:none}.mark{aspect-ratio:181/16;width:181px;height:auto;display:block}:host([size=small]) .mark{width:158px}:host([size=compact]) .mark{width:117px}", Zn = "Macroled Arq, inicio", Qn = "<svg class=\"mark\" viewBox=\"0 0 181 16\" fill=\"currentColor\" aria-hidden=\"true\" focusable=\"false\">" + Zt.map((e) => `<path d="${e}"/>`).join("") + "</svg>";
(class extends F {
	static tag = "arq-logo";
	static styles = Xn;
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
			default: "/arq"
		}
	};
	static template = `<a class="link" aria-label="${Zn}">${Qn}</a>`;
	update(e) {
		e.has("href") && this.shadowRoot.querySelector(".link").setAttribute("href", this.href);
	}
}).define();
//#endregion
//#region src/components/icon-button/icon-button.css?inline
var $n = ":host{vertical-align:middle;color:var(--arq-color-icon-primary);transition:scale var(--arq-motion-duration-fast) var(--arq-motion-easing-out);flex:none;display:inline-flex}@media (prefers-reduced-motion:no-preference){:host(:not([disabled]):active){scale:var(--arq-motion-scale-pressed)}}.control{box-sizing:border-box;padding:var(--arq-space-padding-xs);border-radius:var(--arq-radius-control);background:var(--arq-color-surface-transparent);color:inherit;transition-property:background-color,border-color,outline-color;transition-duration:var(--arq-motion-duration-fast);cursor:pointer;-webkit-tap-highlight-color:var(--arq-color-surface-transparent);border:0;justify-content:center;align-items:center;margin:0;transition-delay:0s;display:inline-flex;position:relative}.glyph{display:inline-flex}.icon{width:var(--arq-icon-md);height:var(--arq-icon-md)}:host([size=large]) .control{padding:var(--arq-space-padding-sm-md)}:host([size=large]) .icon{width:var(--arq-icon-xl);height:var(--arq-icon-xl)}.control:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.control:focus:not(:focus-visible){outline:none}.visually-hidden{width:var(--arq-border-default);height:var(--arq-border-default);clip-path:inset(50%);white-space:nowrap;position:absolute;overflow:hidden}@media (hover:hover) and (pointer:fine){.control:enabled:hover{background:var(--arq-color-surface-hover)}}.control:enabled:active{background:var(--arq-color-surface-selected)}:host([background=surface]) .control{background:var(--arq-color-surface-default)}@media (hover:hover) and (pointer:fine){:host([background=surface]) .control:enabled:hover{background:var(--arq-color-surface-subtle)}}:host([background=surface]) .control:enabled:active{background:var(--arq-color-surface-selected)}:host([background=subtle]) .control{background:var(--arq-color-surface-subtle)}@media (hover:hover) and (pointer:fine){:host([background=subtle]) .control:enabled:hover{background:var(--arq-color-surface-selected)}}:host([background=subtle]) .control:enabled:active{background:var(--arq-color-surface-strong)}.control:disabled{color:var(--arq-color-icon-disabled);cursor:default}:host([background=outline]) .control{padding:calc(var(--arq-space-padding-xs) - var(--arq-border-default));border:var(--arq-border-default) solid var(--arq-color-border-strong)}:host([background=outline][size=large]) .control{padding:calc(var(--arq-space-padding-sm-md) - var(--arq-border-default));border-color:var(--arq-color-border-default)}:host([background=outline][size=large]) .icon :is(path,line,circle,rect){vector-effect:none}:host([background=outline]) .control:disabled{border-color:var(--arq-color-border-disabled)}";
(class extends F {
	static tag = "arq-icon-button";
	static styles = $n;
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
		e.has("icon") && (this.shadowRoot.querySelector(".glyph").innerHTML = I(this.icon)), this.#e.disabled = this.disabled;
	}
	#t() {
		this.textContent.trim() || console.warn(`[arq] <arq-icon-button icon="${this.icon}"> no tiene nombre accesible: escribí qué hace entre las etiquetas (p. ej. <arq-icon-button icon="search">Buscar</arq-icon-button>).`);
	}
}).define();
//#endregion
//#region src/components/breadcrumb-item/breadcrumb-item.css?inline
var er = ":host{min-width:0;display:inline-flex}.item{align-items:center;gap:var(--arq-space-gap-sm);min-width:0;color:var(--arq-color-text-tertiary);display:inline-flex}.label{color:inherit;text-overflow:ellipsis;white-space:nowrap;text-decoration:none;transition:none;overflow:hidden}.label[aria-current=page]{white-space:normal;overflow-wrap:break-word;overflow:visible}.separator{color:var(--arq-color-text-tertiary);flex:none}@media (hover:hover) and (pointer:fine){a.label:hover{color:var(--arq-color-text-primary)}}.label[aria-current=page]{color:var(--arq-color-text-primary)}a.label:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}a.label:focus:not(:focus-visible){outline:none}";
(class extends F {
	static tag = "arq-breadcrumb-item";
	static styles = er;
	static properties = {
		href: { type: String },
		showSeparator: { type: Boolean },
		current: { type: Boolean }
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
		e.localName === "a" && t ? e.setAttribute("aria-label", t) : e.removeAttribute("aria-label");
	}
}).define();
//#endregion
//#region src/components/breadcrumb/breadcrumb.css?inline
var tr = ":host{min-width:0;display:block}.list{align-items:flex-start;gap:var(--arq-space-gap-sm);flex-wrap:nowrap;min-width:0;margin:0;padding:0;list-style:none;display:flex}::slotted(*){flex:0 auto;min-width:0}::slotted([current]){flex-shrink:1000;min-width:auto}", nr = "Migas de pan";
(class extends F {
	static tag = "arq-breadcrumb";
	static styles = tr;
	static template = `<nav aria-label="${nr}"><div class="list" role="list"><slot></slot></div></nav>`;
}).define();
//#endregion
//#region src/components/footer-link/footer-link.css?inline
var rr = ":host{vertical-align:middle;max-width:100%;display:inline-flex}.link{align-items:center;gap:var(--arq-space-gap-sm);max-width:100%;color:var(--arq-color-text-secondary);text-decoration:none;display:inline-flex;position:relative}.label{overflow-wrap:break-word;min-width:0}.leading{flex:none;display:inline-flex}.icon{width:var(--arq-icon-md);height:var(--arq-icon-md)}.link:after{content:\"\";inset-inline:0;height:var(--arq-border-default);background:var(--arq-color-border-strong);visibility:hidden;position:absolute;top:100%}@media (hover:hover) and (pointer:fine){.link[href]:hover{color:var(--arq-color-text-primary)}.link[href]:hover:after{visibility:visible}}.link[href]:active{color:var(--arq-color-text-tertiary)}.link[href]:active:after{visibility:hidden}.link:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.link:focus:not(:focus-visible){outline:none}";
(class extends F {
	static tag = "arq-footer-link";
	static styles = rr;
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
		e.has("icon") && (n.innerHTML = I(this.icon)), n.hidden = !this.showIcon;
	}
}).define();
//#endregion
//#region src/components/form-message/form-message.css?inline
var ir = ":host{display:block}.message{transition:opacity var(--arq-motion-duration-slow) var(--arq-motion-easing-out), transform var(--arq-motion-duration-slow) var(--arq-motion-easing-out), color var(--arq-motion-duration-fast) var(--arq-motion-easing-standard)}@starting-style{.message{opacity:0;transform:translateY(var(--arq-space-gap-sm))}}@media (prefers-reduced-motion:reduce){.message{transition:opacity var(--arq-motion-duration-fade) var(--arq-motion-easing-out)}}.message{color:var(--arq-color-text-success);margin:0}:host([tone=error]) .message{color:var(--arq-color-text-error)}";
(class extends F {
	static tag = "arq-form-message";
	static styles = ir;
	static properties = { tone: {
		type: String,
		values: ["success", "error"],
		default: "success"
	} };
	static template = "<p class=\"message role-body\"><slot></slot></p>";
	update() {
		this.setAttribute("role", this.tone === "error" ? "alert" : "status");
	}
}).define();
//#endregion
//#region src/components/spec-row/spec-row.css?inline
var ar = ":host{display:block}.row{align-items:flex-start;gap:var(--arq-space-gap-md);padding-block:var(--arq-space-padding-sm);border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle);margin:0;display:flex}:host([data-arq-last]) .row{border-bottom-color:var(--arq-color-surface-transparent)}.label{flex:0 1 var(--arq-layout-measure);overflow-wrap:anywhere;min-width:0;max-width:50%;color:var(--arq-color-text-primary)}.value{overflow-wrap:anywhere;min-width:0;color:var(--arq-color-text-primary);flex:1 1 0;margin:0}";
(class extends F {
	static tag = "arq-spec-row";
	static styles = ar;
	static template = "<dl class=\"row role-body-regular\"><dt class=\"label\"><slot name=\"label\"></slot></dt><dd class=\"value role-body\"><slot></slot></dd></dl>";
}).define();
//#endregion
//#region src/components/spec-list/spec-list.css?inline
var or = ":host{min-width:0;display:block}.list{flex-direction:column;display:flex}@media (width>=1024px){:host([columns]) .list{grid-template-columns:repeat(2,minmax(0,1fr));grid-auto-flow:column;grid-template-rows:repeat(var(--rows,1), auto);column-gap:var(--arq-space-gap-4xl);display:grid}}";
(class extends F {
	static tag = "arq-spec-list";
	static styles = or;
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
var sr = 0, cr = "\n[data-disclosure-panel=''] {\n  transition-property: opacity, color, background-color, border-color, outline-color, text-decoration-color, fill, stroke;\n  transition-duration: var(--arq-motion-duration-base);\n  transition-timing-function: var(--arq-motion-easing-standard);\n}\n\n@starting-style {\n  [data-disclosure-panel='']:not([hidden]) {\n    opacity: 0;\n  }\n}\n\n/* Reduced motion: el fundido se queda (motion/duration/fade); los colores, en\n   motion/duration/fast, que vale 0. Ocho valores, uno por propiedad. */\n@media (prefers-reduced-motion: reduce) {\n  [data-disclosure-panel=''] {\n    transition-duration: var(--arq-motion-duration-fade), var(--arq-motion-duration-fast), var(--arq-motion-duration-fast), var(--arq-motion-duration-fast), var(--arq-motion-duration-fast), var(--arq-motion-duration-fast), var(--arq-motion-duration-fast), var(--arq-motion-duration-fast);\n    transition-timing-function: var(--arq-motion-easing-out);\n  }\n}\n\n/* animateHeight. visibility pasa a hidden recién al terminar de cerrar. */\n[data-disclosure-panel='height'] {\n  display: grid;\n  grid-template-rows: 0fr;\n  opacity: 0;\n  visibility: hidden;\n  transition:\n    grid-template-rows var(--arq-motion-duration-expand) var(--arq-motion-easing-out),\n    opacity var(--arq-motion-duration-base) var(--arq-motion-easing-out),\n    visibility 0s linear var(--arq-motion-duration-expand);\n}\n\n[data-disclosure-panel='height'][data-open] {\n  grid-template-rows: 1fr;\n  opacity: 1;\n  visibility: visible;\n  transition-delay: 0s;\n}\n\n[data-disclosure-panel='height'] > * {\n  min-height: 0;\n  overflow: hidden;\n}\n\n@media (prefers-reduced-motion: reduce) {\n  [data-disclosure-panel='height'] {\n    transition:\n      opacity var(--arq-motion-duration-fade) var(--arq-motion-easing-out),\n      visibility 0s linear var(--arq-motion-duration-fade);\n  }\n\n  [data-disclosure-panel='height'][data-open] {\n    transition-delay: 0s;\n  }\n}\n", lr;
function ur(e) {
	lr || (lr = new CSSStyleSheet(), lr.replaceSync(cr)), e.adoptedStyleSheets.includes(lr) || (e.adoptedStyleSheets = [...e.adoptedStyleSheets, lr]);
}
var L = class {
	#e;
	#t;
	#n;
	#r;
	constructor(e, { trigger: t, panel: n, closeOnEscape: r = !1, animateHeight: i = !1 }) {
		this.#e = e, this.#t = t, this.#n = n, this.#r = i, n.id ||= `arq-disclosure-${++sr}`, n.setAttribute("data-disclosure-panel", i ? "height" : ""), ur(e.shadowRoot), t.type = "button", t.setAttribute("aria-controls", n.id), t.addEventListener("click", () => this.toggle()), r && e.addEventListener("keydown", (e) => {
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
}, dr = ":host{min-width:0;display:block}.item{border-bottom:var(--arq-border-default) solid var(--arq-color-border-default);background:var(--arq-color-surface-transparent)}.trigger{box-sizing:border-box;align-items:center;gap:var(--arq-space-gap-md);width:100%;padding:var(--arq-space-padding-xl-2xl) var(--arq-space-padding-xl);padding-bottom:calc(var(--arq-space-padding-xl-2xl) - var(--arq-border-default));background:var(--arq-color-surface-transparent);color:var(--arq-color-text-primary);font:inherit;text-align:start;cursor:pointer;-webkit-tap-highlight-color:var(--arq-color-surface-transparent);border:0;margin:0;display:flex}:host([open]) .trigger{padding-block:var(--arq-space-padding-lg) var(--arq-space-gap-xs)}.title{overflow-wrap:break-word;flex:1 1 0;min-width:0}.icon-box{padding:var(--arq-space-padding-sm-md);color:var(--arq-color-icon-primary);flex:none;display:inline-flex}.icon{width:var(--arq-icon-xl);height:var(--arq-icon-xl)}:host(:not([open])) [data-icon=minus],:host([open]) [data-icon=plus]{display:none}.content{padding:0 var(--arq-space-padding-xl) var(--arq-space-padding-lg)}@media (width<=767px){.trigger,.content{padding-inline:0}}@media (hover:hover) and (pointer:fine){:host(:not([open])) .item:has(.trigger:hover){background:var(--arq-color-surface-faint)}}.item:has(.trigger:focus-visible){outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.trigger:focus{outline:none}";
(class extends F {
	static tag = "arq-accordion-item";
	static styles = dr;
	static properties = { open: { type: Boolean } };
	static template = `<div class="item"><button type="button" class="trigger"><span class="title role-heading-3"><slot name="title"></slot></span><span class="icon-box">${I("plus")}${I("minus")}</span></button><div class="content" part="panel"><slot></slot></div></div>`;
	setup() {
		this.disclosure = new L(this, {
			trigger: this.shadowRoot.querySelector(".trigger"),
			panel: this.shadowRoot.querySelector(".content")
		});
	}
}).define();
//#endregion
//#region src/components/filter-chip/filter-chip.css?inline
var fr = ":host{vertical-align:middle;max-width:100%;display:inline-flex}.chip{box-sizing:border-box;align-items:center;gap:var(--arq-space-gap-xs);max-width:100%;padding:var(--arq-space-padding-xs) var(--arq-space-padding-sm);border:var(--arq-border-default) solid var(--arq-color-border-default);border-radius:var(--arq-radius-control);background:var(--arq-color-surface-transparent);color:var(--arq-color-text-primary);cursor:pointer;-webkit-tap-highlight-color:var(--arq-color-surface-transparent);margin:0;display:inline-flex}.label{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.icon{width:var(--arq-icon-sm);height:var(--arq-icon-sm);flex:none}@media (hover:hover) and (pointer:fine){.chip:hover{border-color:var(--arq-color-text-primary)}}.chip:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.chip:focus:not(:focus-visible){outline:none}";
(class extends F {
	static tag = "arq-filter-chip";
	static styles = fr;
	static template = `<button type="button" class="chip role-body-sm"><span class="label"><slot></slot></span>${I("close")}</button>`;
	#e = null;
	setup() {
		this.#e = this.shadowRoot.querySelector(".chip");
		let e = () => this.#e.setAttribute("aria-label", `Quitar filtro ${this.textContent.trim()}`);
		this.shadowRoot.querySelector("slot").addEventListener("slotchange", e), e();
	}
	focus(e) {
		this.#e ? this.#e.focus(e) : super.focus(e);
	}
}).define();
//#endregion
//#region src/components/select-option/select-option.css?inline
var pr = ":host{cursor:pointer;display:block}:host([disabled]){cursor:default}.option{align-items:center;gap:var(--arq-space-gap-sm);padding:var(--arq-space-padding-md);border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle);display:flex}@media (hover:hover) and (pointer:fine){:host(:not([disabled]):hover) .option{background:var(--arq-color-surface-faint)}}.swatch{box-sizing:border-box;width:var(--arq-swatch-sm);height:var(--arq-swatch-sm);border:var(--arq-border-default) solid var(--arq-color-border-default);border-radius:var(--arq-radius-control);background:var(--arq-color-surface-subtle);flex:none;position:relative;overflow:hidden}.swatch img{object-fit:cover;width:100%;height:100%;display:block}.name{min-width:0;color:var(--arq-color-text-primary)}:host([disabled]) .name{color:var(--arq-color-text-disabled)}.control{width:var(--arq-icon-md);height:var(--arq-icon-md);flex:none;justify-content:center;align-items:center;display:inline-flex}.box{box-sizing:border-box;width:var(--arq-icon-sm);height:var(--arq-icon-sm);border:var(--arq-border-default) solid var(--arq-color-icon-tertiary);border-radius:var(--arq-radius-control);background:var(--arq-color-surface-default)}:host([multiple]) .option{padding:var(--arq-space-padding-sm) var(--arq-space-padding-md);border-bottom:0}:host([multiple]) .name{color:var(--arq-color-text-secondary)}:host([multiple][active]) .name{color:var(--arq-color-text-primary)}@media (hover:hover) and (pointer:fine){:host([multiple]:not([disabled]):hover) .name{color:var(--arq-color-text-primary)}:host([multiple]:not([disabled]):hover) .box{border-width:var(--arq-border-strong);border-color:var(--arq-color-border-strong)}}:host([multiple][selected]) .box{border-color:var(--arq-color-action-primary);background:var(--arq-color-action-primary)}:host([multiple][disabled]) .box{border-color:var(--arq-color-icon-disabled);background:var(--arq-color-surface-default)}:host([multiple][disabled]) .name{color:var(--arq-color-text-disabled)}:host([active]) .option{background:var(--arq-color-surface-faint)}:host(:focus-visible){outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}:host(:focus:not(:focus-visible)){outline:none}";
(class extends F {
	static tag = "arq-select-option";
	static styles = pr;
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
var mr = ":host{box-sizing:border-box;border:var(--arq-border-default) solid var(--arq-color-border-default);border-radius:var(--arq-radius-control);background:var(--arq-color-surface-default);min-width:100%;display:block}:host([type=filter]),:host([type=text]){width:max-content;max-width:calc(100vw - 2 * var(--arq-layout-gutter))}:host([type=filter]){min-width:max(100%, var(--arq-layout-select-menu-filter))}:host{max-height:calc(7 * (2 * var(--arq-space-padding-md) + var(--arq-type-body-leading) + var(--arq-border-default)) + 2 * var(--arq-border-default));overscroll-behavior:contain;overflow-y:auto}:host(:focus){outline:none}:host([aria-multiselectable=true]){padding-block:var(--arq-space-padding-sm)}";
(class extends F {
	static tag = "arq-select-menu";
	static styles = mr;
	static properties = { type: {
		type: String,
		values: [
			"finishes",
			"filter",
			"text"
		],
		default: "finishes"
	} };
	static template = "<div class=\"menu\"><slot></slot></div>";
	setup() {
		this.setAttribute("role", "listbox"), this.hasAttribute("tabindex") || this.setAttribute("tabindex", "-1");
	}
}).define();
//#endregion
//#region src/base/combobox.js
var hr = class {
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
}, gr = "[role=\"radiogroup\"], [role=\"tablist\"]", _r = class {
	constructor(e, { role: t, state: n }) {
		this.host = e, this.state = n, e.hasAttribute("role") || e.setAttribute("role", t), e.choose = () => this.choose(), e.addEventListener("click", () => this.choose()), e.addEventListener("keydown", (e) => {
			(e.key === "Enter" || e.key === " ") && (e.preventDefault(), this.choose());
		}), e.addController(this);
	}
	choose() {
		let e = this.host;
		e.disabled || e.selected || (e.selected = !0, e.emit("change", {
			value: e.value ?? null,
			selected: !0
		}));
	}
	hostUpdate() {
		let e = this.host;
		e.setAttribute(this.state, String(!!e.selected)), e.disabled ? e.setAttribute("aria-disabled", "true") : e.removeAttribute("aria-disabled"), e.parentElement?.closest(gr) || e.setAttribute("tabindex", e.disabled ? "-1" : "0");
	}
}, vr = ":host{vertical-align:middle;flex:none;display:inline-flex}.swatch{box-sizing:border-box;width:var(--arq-swatch-sm);height:var(--arq-swatch-sm);border-radius:var(--arq-radius-control);background:var(--arq-color-surface-subtle);display:block;position:relative;overflow:hidden}:host([size=default]) .swatch{width:var(--arq-swatch-md);height:var(--arq-swatch-md)}:host([size=large]) .swatch{width:var(--arq-swatch-lg);height:var(--arq-swatch-lg)}.swatch img{object-fit:cover;width:100%;height:100%;display:block}.swatch:after{content:\"\";border:var(--arq-border-default) solid var(--arq-color-border-subtle);border-radius:inherit;pointer-events:none;position:absolute;inset:0}:host([role=radio]){cursor:pointer}:host([role=radio]:not([disabled]):hover) .swatch:after,:host([selected]) .swatch:after{border-width:var(--arq-border-strong);border-color:var(--arq-color-border-strong)}:host([disabled]){cursor:default}:host([disabled]) .swatch:after{border-color:var(--arq-color-border-disabled)}:host([disabled]) .swatch:before{content:\"\";background:linear-gradient(to bottom right, transparent calc(50% - var(--arq-border-default) / 2), var(--arq-color-icon-tertiary) calc(50% - var(--arq-border-default) / 2), var(--arq-color-icon-tertiary) calc(50% + var(--arq-border-default) / 2), transparent calc(50% + var(--arq-border-default) / 2));pointer-events:none;position:absolute;inset:0}:host(:focus-visible){outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}:host(:focus:not(:focus-visible)){outline:none}";
(class extends F {
	static tag = "arq-swatch";
	static styles = vr;
	static properties = {
		size: {
			type: String,
			values: [
				"small",
				"default",
				"large"
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
			e && this.setAttribute("aria-label", e);
		};
		this.shadowRoot.querySelector("slot").addEventListener("slotchange", t), t(), this.getAttribute("role") === "radio" || this.parentElement?.closest("arq-swatch-picker") ? this.selectable = new _r(this, {
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
var yr = ":host{min-width:0;display:block}.select{flex-direction:column;display:flex;position:relative}.label{color:var(--arq-color-text-tertiary)}.trigger{box-sizing:border-box;align-items:center;gap:var(--arq-space-gap-sm-md);width:100%;padding:var(--arq-space-padding-sm-md) 0 calc(var(--arq-space-padding-sm-md) - var(--arq-border-default));border:0;border-bottom:var(--arq-border-default) solid var(--arq-color-border-strong);border-radius:var(--arq-radius-control);background:var(--arq-color-surface-transparent);color:var(--arq-color-text-primary);font:inherit;text-align:start;cursor:pointer;-webkit-tap-highlight-color:var(--arq-color-surface-transparent);margin:0;display:flex}.value{overflow-wrap:break-word;flex:auto;min-width:0}.chevron{flex:none;display:inline-flex}.icon{width:var(--arq-icon-md);height:var(--arq-icon-md);color:var(--arq-color-icon-primary)}:host(:not([open])) [data-icon=chevron-up],:host([open]) [data-icon=chevron-down]{display:none}@media (hover:hover) and (pointer:fine){:host(:not([open])) .trigger:enabled:hover{background:var(--arq-color-surface-faint)}}:host([open]) .trigger{background:var(--arq-color-surface-faint)}.menu{z-index:2;position:absolute;top:100%;left:0}:host(:not([type=filter])) .menu,:host([size=small]) .menu,:host([multiple]) .menu{right:0}:host([type=filter]){min-width:var(--arq-layout-select-filter)}:host([type=filter]) .select{gap:var(--arq-space-gap-sm)}:host([type=filter]) .trigger{border-bottom-color:var(--arq-color-surface-transparent);justify-content:space-between}:host([type=filter]) .icon{width:var(--arq-icon-sm);height:var(--arq-icon-sm)}:host([disabled]) .trigger,:host([type=filter][disabled]) .trigger{cursor:default;border-bottom-color:var(--arq-color-border-disabled);background:var(--arq-color-surface-transparent);color:var(--arq-color-text-disabled)}:host([disabled]) .label,:host([disabled]) .icon{color:var(--arq-color-text-disabled)}:host([disabled]) .swatch{opacity:.4}.trigger:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.trigger:focus:not(:focus-visible){outline:none}", br = 0;
(class extends F {
	static tag = "arq-select";
	static styles = yr;
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
	static template = `<div class="select"><span class="label role-label" hidden></span><button type="button" class="trigger" aria-expanded="false"><arq-swatch class="swatch" aria-hidden="true" hidden></arq-swatch><span class="value"></span><span class="chevron">${I("chevron-down")}${I("chevron-up")}</span></button><arq-select-menu class="menu" hidden></arq-select-menu></div>`;
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
		let e = this.shadowRoot, t = `arq-select-${++br}`;
		this.trigger = e.querySelector(".trigger"), this.menu = e.querySelector(".menu"), this.menu.id = `${t}-menu`, e.querySelector(".label").id = `${t}-label`, this.trigger.id = `${t}-trigger`, this.#n = new hr({
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
var xr = ":host{min-width:0;display:block}.bar{align-items:flex-start;gap:var(--arq-space-gap-xl);padding:var(--arq-space-padding-2xl) var(--page-gutter);background:var(--arq-color-surface-soft);flex-direction:column;display:flex}.filters{align-items:stretch;gap:var(--arq-space-gap-lg);flex-wrap:wrap;min-width:0;display:flex}::slotted(arq-select){flex:none}::slotted(arq-select:not(:first-child)){border-inline-start:var(--arq-border-default) solid var(--arq-color-border-subtle);padding-inline-start:var(--arq-space-gap-lg)}.clear{flex:none}@media (width<=767px){.bar{align-items:stretch}.filters{gap:var(--arq-space-gap-md);flex-direction:column}::slotted(arq-select:not(:first-child)){border-inline-start:0;padding-inline-start:0}.clear{align-self:flex-start}}:host([stacked]) .bar{justify-content:flex-start;align-items:flex-start;gap:var(--arq-space-gap-xl);padding-block:var(--arq-space-padding-2xl);background:var(--arq-color-surface-soft);border-block:0;flex-direction:column}@media (width<=767px){:host([stacked]) .bar{align-items:stretch}}";
(class extends F {
	static tag = "arq-filter-bar";
	static styles = xr;
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
var Sr = ":host{vertical-align:middle;max-width:100%;display:inline-flex}.sku{align-items:flex-start;gap:var(--arq-space-gap-xs);flex-direction:column;min-width:0;display:flex}.label{color:var(--arq-color-text-secondary)}:host([size=compact]) .label{display:none}.row{align-items:flex-start;gap:var(--arq-space-gap-sm);background:var(--arq-color-surface-transparent);max-width:100%;color:var(--arq-color-text-primary);text-align:start;cursor:pointer;-webkit-tap-highlight-color:var(--arq-color-surface-transparent);border:0;margin:0;padding:0;display:inline-flex}.code{min-width:0;color:var(--arq-color-text-primary);overflow-wrap:anywhere}.copy{color:var(--arq-color-icon-secondary);flex:none;margin-block-start:calc((var(--arq-type-body-lg-leading) - var(--arq-icon-md)) / 2);display:inline-flex}:host([size=compact]) .copy{margin-block-start:calc((var(--arq-type-body-leading) - var(--arq-icon-md)) / 2)}.icon{width:var(--arq-icon-md);height:var(--arq-icon-md)}@media (hover:hover) and (pointer:fine){.row:hover .copy{color:var(--arq-color-icon-primary)}}.copied,.failed{color:var(--arq-color-text-success);flex:none;margin-block-start:calc((var(--arq-type-body-lg-leading) - var(--arq-type-caption-leading)) / 2);display:none}:host([size=compact]) .copied,:host([size=compact]) .failed{margin-block-start:calc((var(--arq-type-body-leading) - var(--arq-type-caption-leading)) / 2)}:host([copied]) .copy,:host(:state(copy-failed)) .copy{display:none}:host([copied]) .copied,:host(:state(copy-failed)) .failed{display:inline}.copied,.failed{transition-property:opacity,color;transition-duration:var(--arq-motion-duration-fade), var(--arq-motion-duration-fast);transition-timing-function:var(--arq-motion-easing-out)}@starting-style{:host([copied]) .copied,:host(:state(copy-failed)) .failed{opacity:0}}.failed{color:var(--arq-color-text-secondary)}.label,.copy,.copied,.failed{-webkit-user-select:none;user-select:none}.row:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.row:focus:not(:focus-visible){outline:none}:host([size=underline]) .label,:host([size=underline]) .copy{display:none}:host([size=underline]) .code{text-underline-position:from-font;text-decoration:underline}:host([size=underline][copied]) .code,:host([size=underline]:state(copy-failed)) .code{display:none}:host([size=underline]) .copied,:host([size=underline]) .failed{margin-block-start:0}", Cr = "Copiado", wr = /Mac|iPhone|iPad/.test(navigator.userAgentData?.platform ?? navigator.platform ?? "") ? "Copialo con ⌘C" : "Copialo con Ctrl+C";
function Tr(e) {
	let t = getComputedStyle(e).getPropertyValue("--arq-motion-duration-feedback").trim(), n = Number.parseFloat(t);
	return Number.isNaN(n) ? 0 : t.endsWith("ms") ? n : n * 1e3;
}
(class extends F {
	static tag = "arq-sku";
	static styles = Sr;
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
		copied: { type: Boolean }
	};
	static template = `<span class="sku"><span class="label role-label">SKU</span><button type="button" class="row"><span class="code"><slot></slot></span><span class="copy">${I("copy")}</span><span class="copied role-caption" aria-hidden="true">${Cr}</span><span class="failed role-caption" aria-hidden="true">${wr}</span></button><span class="visually-hidden" aria-live="polite"></span></span>`;
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
			getSelection()?.selectAllChildren(this), this.copied = !1, this.#r(!0), this.#t = setTimeout(() => this.#r(!1), Tr(this));
			return;
		}
		this.copied = !0, this.emit("copy", { code: this.code }), this.#t = setTimeout(() => this.copied = !1, Tr(this));
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
		this.shadowRoot.querySelector("[aria-live]").textContent = e ? wr : this.copied ? Cr : "";
	}
}).define();
//#endregion
//#region src/components/checkbox/checkbox.css?inline
var Er = ":host{vertical-align:middle;max-width:100%;display:inline-flex}.row{align-items:center;gap:var(--arq-space-gap-sm);max-width:100%;padding-block:var(--arq-space-gap-xs);cursor:pointer;-webkit-user-select:none;user-select:none;display:inline-flex;position:relative}.control{width:var(--arq-icon-md);height:var(--arq-icon-md);flex:none;justify-content:center;align-items:center;display:inline-flex}.box{box-sizing:border-box;width:var(--arq-icon-sm);height:var(--arq-icon-sm);border:var(--arq-border-default) solid var(--arq-color-icon-tertiary);border-radius:var(--arq-radius-control);background:var(--arq-color-surface-transparent)}.label{min-width:0;color:var(--arq-color-text-secondary)}@media (hover:hover) and (pointer:fine){.row:hover .box{border-width:var(--arq-border-strong);border-color:var(--arq-color-border-strong)}.row:hover .label{color:var(--arq-color-text-primary)}}.native:checked+.control .box{border-color:var(--arq-color-action-primary);background:var(--arq-color-action-primary)}@media (hover:hover) and (pointer:fine){.row:hover .native:checked+.control .box{border-color:var(--arq-color-action-primary-hover);background:var(--arq-color-action-primary-hover)}}:host([disabled]) .row{cursor:default}:host([disabled]) .box,:host([disabled]) .row:hover .box{border-width:var(--arq-border-default);border-color:var(--arq-color-icon-disabled)}:host([disabled]) .native:checked+.control .box{border-color:var(--arq-color-icon-disabled);background:var(--arq-color-icon-disabled)}:host([disabled]) .label,:host([disabled]) .row:hover .label{color:var(--arq-color-text-disabled)}.native:focus-visible+.control .box{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}";
(class extends F {
	static tag = "arq-checkbox";
	static styles = Er;
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
		}
	};
	static template = "<label class=\"row\"><input type=\"checkbox\" class=\"native visually-hidden\"><span class=\"control\" aria-hidden=\"true\"><span class=\"box\"></span></span><span class=\"label\"><slot></slot></span></label>";
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
		e.checked = this.checked, e.disabled = this.disabled, this.shadowRoot.querySelector(".label").classList.toggle("visually-hidden", !this.showLabel), this.shadowRoot.querySelector(".label").classList.toggle("role-body", this.size !== "large"), this.shadowRoot.querySelector(".label").classList.toggle("role-body-lg", this.size === "large"), this.#e.setFormValue(this.checked ? this.value : null);
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
var Dr = ":host{min-width:0;display:block}.row{border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle)}.header{box-sizing:border-box;justify-content:space-between;align-items:center;gap:var(--arq-space-gap-md);width:100%;padding:var(--arq-space-padding-md) 0;background:var(--arq-color-surface-transparent);color:var(--arq-color-text-primary);font:inherit;text-align:start;cursor:pointer;-webkit-tap-highlight-color:var(--arq-color-surface-transparent);border:0;margin:0;display:flex}:host([open]) .header{padding-bottom:var(--arq-space-gap-md)}.label{overflow-wrap:break-word;min-width:0}.icon-box{padding:var(--arq-space-padding-xs);border-radius:var(--arq-radius-control);background:var(--arq-color-surface-transparent);color:var(--arq-color-icon-primary);flex:none;display:inline-flex}.icon{width:var(--arq-icon-md);height:var(--arq-icon-md)}:host(:not([open])) [data-icon=minus],:host([open]) [data-icon=plus]{display:none}.options{align-items:flex-start;gap:var(--arq-space-gap-sm-md);padding-bottom:calc(var(--arq-space-padding-sm) + var(--arq-space-padding-md));flex-direction:column;display:flex}@media (hover:hover) and (pointer:fine){.row:has(.header:hover){border-bottom-color:var(--arq-color-border-default)}.header:hover .icon-box{background:var(--arq-color-surface-hover)}}.row:has(.header:focus-visible){outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.header:focus{outline:none}";
(class extends F {
	static tag = "arq-filter-row";
	static styles = Dr;
	static properties = { open: { type: Boolean } };
	static template = `<div class="row"><button type="button" class="header"><span class="label role-body-xl"><slot name="label"></slot></span><span class="icon-box">${I("plus")}${I("minus")}</span></button><div class="options" role="group" part="panel"><slot></slot></div></div>`;
	setup() {
		this.disclosure = new L(this, {
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
var Or = ":host{cursor:pointer;flex:none;display:inline-flex}.tab{padding-bottom:var(--arq-space-padding-sm-md);border-bottom:var(--arq-border-default) solid var(--arq-color-surface-transparent);color:var(--arq-color-text-secondary);white-space:nowrap;display:inline-flex}:host(:not([disabled]):hover) .tab{color:var(--arq-color-text-primary)}:host([selected]) .tab{border-bottom-color:var(--arq-color-border-strong);color:var(--arq-color-text-primary)}:host([disabled]){cursor:default}:host([disabled]) .tab{color:var(--arq-color-text-disabled)}:host(:focus-visible){outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}:host(:focus:not(:focus-visible)){outline:none}";
(class extends F {
	static tag = "arq-tab";
	static styles = Or;
	static properties = {
		selected: { type: Boolean },
		disabled: { type: Boolean },
		value: { type: String }
	};
	static template = "<span class=\"tab role-body-regular\"><slot></slot></span>";
	setup() {
		this.selectable = new _r(this, {
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
var kr = ["ArrowRight", "ArrowDown"], Ar = ["ArrowLeft", "ArrowUp"], jr = class {
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
		for (let e of this.items) e.setAttribute("tabindex", e === t ? "0" : "-1");
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
		kr.includes(e.key) ? r = t[(n + 1) % t.length] : Ar.includes(e.key) ? r = t[(n - 1 + t.length) % t.length] : e.key === "Home" ? r = t[0] : e.key === "End" && (r = t[t.length - 1]), r && (e.preventDefault(), r.focus(), r.choose?.());
	}
}, Mr = {
	ArrowDown: 1,
	ArrowUp: -1,
	PageDown: 1,
	PageUp: -1,
	End: 1,
	Home: -1,
	" ": 1
};
function Nr(e, t, n) {
	for (let r of e.composedPath()) {
		if (!(r instanceof Element)) continue;
		let { overflowY: e } = getComputedStyle(r);
		if ((e === "auto" || e === "scroll") && r.scrollHeight > r.clientHeight && (n < 0 ? r.scrollTop > 0 : Math.ceil(r.scrollTop + r.clientHeight) < r.scrollHeight)) return !0;
		if (r === t) break;
	}
	return !1;
}
var Pr = (e) => e.composedPath().some((e) => e instanceof Element && (e.matches("input, textarea, select, [contenteditable=\"\"], [contenteditable=\"true\"]") || e.getAttribute("role") === "combobox"));
function R(e, { when: t = () => !0 } = {}) {
	e.addEventListener("wheel", (n) => {
		t() && n.deltaY && !Nr(n, e, n.deltaY) && n.preventDefault();
	}, { passive: !1 });
	let n = 0;
	e.addEventListener("touchstart", (e) => n = e.touches[0].clientY, { passive: !0 }), e.addEventListener("touchmove", (r) => {
		let i = n - r.touches[0].clientY;
		t() && i && !Nr(r, e, i) && r.preventDefault();
	}, { passive: !1 }), e.addEventListener("keydown", (n) => {
		let r = Mr[n.key];
		!t() || !r || n.altKey || n.ctrlKey || n.metaKey || Pr(n) || n.key === " " && n.composedPath().some((e) => e instanceof Element && e.matches("button, a[href], [role=\"button\"]")) || Nr(n, e, r) || n.preventDefault();
	});
}
//#endregion
//#region src/components/filter-panel/filter-panel.css?inline
var Fr = ":host{--panel-slow:var(--arq-motion-duration-panel);display:contents}.dialog{box-sizing:border-box;width:var(--arq-layout-filter-panel);border:var(--arq-border-default) solid var(--arq-color-border-default);border-radius:var(--arq-radius-control);background:var(--arq-color-surface-default);max-width:100%;height:100dvh;max-height:none;color:var(--arq-color-text-primary);clip-path:inset(0 0 0 100%);transition:clip-path var(--panel-slow) var(--arq-motion-easing-standard);margin:0;padding:0;inset:0 0 0 auto;overflow:clip}.dialog.is-open{clip-path:inset(0)}.dialog:not(.is-open){pointer-events:none}.dialog::backdrop{background:var(--arq-color-overlay-scrim);opacity:0;transition:opacity var(--panel-slow) var(--arq-motion-easing-standard)}.dialog.is-open::backdrop{opacity:1}.sheet{opacity:0;transition:opacity var(--arq-motion-duration-slow) var(--arq-motion-easing-standard)}.dialog.is-open .sheet{opacity:1}.sheet{box-sizing:border-box;gap:var(--arq-space-gap-lg);height:100%;padding:var(--arq-space-padding-xl-2xl);flex-direction:column;display:flex}.header{justify-content:space-between;align-items:center;gap:var(--arq-space-gap-md);display:flex}.titles{gap:var(--arq-space-gap-xs);flex-direction:column;min-width:0;display:flex}.title{color:var(--arq-color-text-primary)}.summary{color:var(--arq-color-text-secondary);margin:0}.applied{gap:var(--arq-space-gap-sm);flex-wrap:wrap;display:flex}.tabs{display:none}.body{min-height:0;margin:calc(-1 * var(--arq-space-padding-xs));padding:var(--arq-space-padding-xs);overscroll-behavior:contain;flex:auto;overflow-y:auto}.footer{justify-content:space-between;align-items:center;gap:var(--arq-space-gap-lg);display:flex}@media (width<=767px){.dialog{border:0;width:100%;inset:0}.dialog::backdrop{background:var(--arq-color-surface-transparent)}.sheet{gap:var(--arq-space-gap-xl);padding:var(--arq-space-padding-lg) var(--arq-layout-gutter) calc(var(--arq-space-padding-lg) + env(safe-area-inset-bottom,var(--arq-space-0)))}:host([show-categories]) .tabs{gap:var(--arq-space-gap-xl);border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle);flex:none;display:flex;overflow-x:auto}.categories-panel{min-width:0}.footer{justify-content:flex-start}.apply{flex:auto}}@media (prefers-reduced-motion:reduce){.dialog{clip-path:none;opacity:0;transition:opacity var(--arq-motion-duration-fade) var(--arq-motion-easing-out)}.dialog.is-open{opacity:1}.dialog::backdrop,.sheet{transition:opacity var(--arq-motion-duration-fade) var(--arq-motion-easing-out)}}", Ir = {
	productos: ["producto", "productos"],
	colecciones: ["colección", "colecciones"],
	variantes: ["variante", "variantes"]
}, Lr = new Intl.NumberFormat("es-AR");
(class extends F {
	static tag = "arq-filter-panel";
	static styles = Fr;
	static properties = {
		open: { type: Boolean },
		count: { type: Number },
		unit: {
			type: String,
			values: [
				"productos",
				"colecciones",
				"variantes"
			],
			default: "productos"
		},
		showCategories: { type: Boolean }
	};
	static template = "<dialog class=\"dialog\" data-arq-theme=\"light\"><div class=\"sheet\"><div class=\"header\"><div class=\"titles\"><div class=\"title role-heading-1\"><slot name=\"title\"></slot></div><p class=\"summary role-body\" hidden></p></div><arq-icon-button icon=\"close\" size=\"large\" class=\"close\">Cerrar filtros</arq-icon-button></div><div class=\"applied\" hidden></div><div class=\"tabs\" role=\"tablist\" aria-label=\"Tipo de filtro\"><arq-tab value=\"features\" id=\"features-tab\" aria-controls=\"features-panel\" selected>Características</arq-tab><arq-tab value=\"categories\" id=\"categories-tab\" aria-controls=\"categories-panel\">Categorías</arq-tab></div><div class=\"body\"><div class=\"features-panel\" id=\"features-panel\" role=\"tabpanel\" aria-labelledby=\"features-tab\"><slot></slot></div><div class=\"categories-panel\" id=\"categories-panel\" role=\"tabpanel\" aria-labelledby=\"categories-tab\" hidden><slot name=\"categories\"></slot></div></div><div class=\"footer\"><arq-button type=\"underline\" show-underline class=\"clear\">Borrar todo</arq-button><arq-button class=\"apply\"></arq-button></div></div></dialog>";
	#e = null;
	#t = null;
	#n = null;
	#r = null;
	setup() {
		let e = this.shadowRoot;
		this.#e = e.querySelector("dialog"), R(this.#e), e.querySelector(".close").addEventListener("click", () => this.close()), e.querySelector(".clear").addEventListener("click", () => this.clear()), e.querySelector(".apply").addEventListener("click", () => this.apply()), new jr(e.querySelector(".tabs"), { items: "arq-tab" }), e.querySelector(".tabs").addEventListener("arq:change", (e) => {
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
	clear() {
		for (let e of this.options) e.checked = !1;
		this.#l();
	}
	#i() {
		this.#t = new Map(this.options.map((e) => [e, e.checked])), this.#a("features"), this.#d(), clearTimeout(this.#r), this.#r = null, this.#e.open || (this.#e.showModal(), this.#e.offsetHeight), this.#e.classList.add("is-open");
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
		}), this.#f();
	}
	#f() {
		let e = this.shadowRoot.querySelector(".apply");
		if (!e) return;
		let [t, n] = Ir[this.unit] ?? Ir.productos;
		e.textContent = Number.isFinite(this.count) ? `Ver ${Lr.format(this.count)} ${this.count === 1 ? t : n}` : `Ver ${n}`;
	}
	#p(e) {
		let t = [...this.shadowRoot.querySelectorAll(".applied arq-filter-chip")].indexOf(e);
		e.option.checked = !1, this.#l();
		let n = [...this.shadowRoot.querySelectorAll(".applied arq-filter-chip")];
		(n[t] ?? n[t - 1] ?? this.shadowRoot.querySelector(".close")).focus();
	}
}).define();
//#endregion
//#region src/components/search-field/search-field.css?inline
var Rr = ":host{min-width:0;display:block}.field{align-items:center;gap:var(--arq-space-gap-md);padding:var(--arq-space-gap-sm) var(--arq-space-padding-xs) var(--arq-space-gap-sm) var(--arq-space-padding-md);border:var(--arq-border-default) solid var(--arq-color-border-default);background:var(--arq-color-surface-default);display:flex}:host(:not([show-close])) .field{padding-inline-end:var(--arq-space-padding-md)}.field:focus-within{border-color:var(--arq-color-border-focus)}.input{min-width:0;color:var(--arq-color-text-primary);caret-color:var(--arq-color-text-primary);appearance:none;background:0 0;border:0;flex:1;margin:0;padding:0}.input::placeholder{color:var(--arq-color-text-tertiary);opacity:1}.input:focus{outline:none}.input::-webkit-search-cancel-button{appearance:none}.input::-webkit-search-decoration{appearance:none}.close{flex:none}.lead{display:none}:host([type=line]) .lead{color:var(--arq-color-icon-tertiary);flex:none;display:inline-flex}:host([type=line]) .field{gap:var(--arq-space-gap-sm-md);padding:var(--arq-space-gap-md) 0;border-width:0 0 var(--arq-border-default);border-color:var(--arq-color-border-default);background:0 0}:host([type=line]) .field:focus-within{border-color:var(--arq-color-border-focus)}.lead .icon{width:var(--arq-icon-lg);height:var(--arq-icon-lg)}";
(class extends F {
	static tag = "arq-search-field";
	static styles = Rr;
	static properties = {
		type: {
			type: String,
			values: ["box", "line"],
			default: "box"
		},
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
		}
	};
	static template = `<div class="field"><span class="lead">${I("search")}</span><input class="input role-body" type="search" autocomplete="off" spellcheck="false" enterkeyhint="search"><arq-icon-button class="close" icon="close">Cerrar búsqueda</arq-icon-button></div><span class="visually-hidden" aria-live="polite"></span>`;
	#e = null;
	setup() {
		let e = this.shadowRoot;
		this.#e = e.querySelector("input"), this.#e.addEventListener("input", () => {
			this.value = this.#e.value, this.emit("input", { value: this.value });
		}), this.#e.addEventListener("keydown", (e) => {
			e.key === "ArrowDown" || e.key === "ArrowUp" ? (e.preventDefault(), this.emit("navigate", { step: e.key === "ArrowDown" ? 1 : -1 })) : e.key === "Enter" && (e.preventDefault(), this.emit("submit", { value: this.value }));
		}), e.querySelector(".close").addEventListener("click", () => this.emit("close"));
	}
	focus(e) {
		this.#e?.focus(e);
	}
	update(e) {
		let t = this.shadowRoot;
		this.#e.value !== this.value && (this.#e.value = this.value ?? ""), this.#e.placeholder = this.placeholder ?? "", this.#e.setAttribute("aria-label", this.label ?? ""), t.querySelector(".close").hidden = !this.showClose, e.has("activeLabel") && (t.querySelector("[aria-live]").textContent = this.activeLabel ?? "");
	}
}).define();
//#endregion
//#region src/components/variants-table/variants-table.css?inline
var zr = ":host{gap:var(--arq-space-gap-md);min-width:0;margin-inline:var(--page-gutter);flex-direction:column;display:flex}.toolbar{--page-gutter:var(--arq-space-0)}.scroll{--page-gutter:var(--arq-space-padding-sm)}.toolbar{align-items:center;gap:var(--arq-space-gap-md);padding:var(--arq-space-padding-md) var(--page-gutter);flex-wrap:wrap;display:flex}.filters-group{align-items:center;gap:var(--arq-space-gap-md);display:flex}.total{color:var(--arq-color-text-secondary)}:host([show-search]) .total{display:none}.applied{align-items:center;gap:var(--arq-space-gap-lg);padding-bottom:var(--arq-space-padding-md);flex-wrap:wrap;display:flex}.chips{gap:var(--arq-space-gap-sm);flex-wrap:wrap;display:flex}.downloads,.sort,.search{margin-inline-start:auto}.search{flex:0 1 var(--arq-layout-search-field);min-width:0}.downloads{gap:var(--arq-space-gap-sm);flex-wrap:wrap;display:flex}.empty{padding-block:var(--arq-space-padding-md);color:var(--arq-color-text-secondary);margin:0}.scroll{overscroll-behavior-x:contain;scrollbar-width:none;overflow-x:auto}.scroll::-webkit-scrollbar{display:none}.scroll:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:calc(-1 * var(--arq-border-strong))}.table{border-collapse:collapse;border-spacing:0;width:100%}th,td{padding:0 var(--arq-space-gap-sm) 0 0;border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle);background:var(--arq-color-surface-default);text-align:start;white-space:nowrap;vertical-align:middle}thead th{padding-block:var(--arq-space-padding-sm-md);color:var(--arq-color-text-tertiary);font-weight:inherit}tbody th,tbody td{padding-block:var(--arq-space-padding-sm);color:var(--arq-color-text-primary)}@media (hover:hover) and (pointer:fine){tbody tr:hover>*{background:var(--arq-color-surface-faint)}}.start{z-index:1;width:1%;padding-inline:var(--page-gutter) var(--arq-space-gap-sm);position:sticky;left:0}.sku-col{left:calc(var(--page-gutter) + var(--arq-layout-table-thumb) + var(--arq-space-gap-sm));z-index:1;width:1%;font-weight:inherit;padding-inline-end:var(--arq-space-gap-sm-md);position:sticky}.thumb{width:var(--arq-layout-table-thumb);height:var(--arq-layout-table-thumb);background:var(--arq-color-surface-subtle);flex:none;display:block;overflow:hidden}.thumb img{object-fit:cover;width:100%;height:100%;display:block}th.end,td.end{z-index:1;width:1%;padding-inline:var(--arq-space-gap-sm) var(--page-gutter);text-align:center;position:sticky;right:0}@media (width<=1023px){.sku-col{position:static}}.cards{margin:0;padding:0;list-style:none;display:none}@media (width<=767px){.search{flex:1 1 0}.scroll{display:none}.cards:not([hidden]){gap:var(--arq-space-gap-6xl);flex-direction:column;display:flex}.card{gap:var(--arq-space-gap-md);flex-direction:column;display:flex}.card-image{aspect-ratio:16/10;background:var(--arq-color-surface-subtle);display:block;overflow:hidden}.card-image img{object-fit:cover;width:100%;height:100%;display:block}.card-head{justify-content:space-between;align-items:center;gap:var(--arq-space-gap-sm);display:flex}.card-data{grid-template-columns:repeat(2,minmax(0,1fr));margin:0;display:grid}.card-item{gap:var(--arq-space-gap-sm);padding-block:var(--arq-space-padding-sm);border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle);flex-direction:column;display:flex}.card-item dt{color:var(--arq-color-text-secondary)}.card-item dd{color:var(--arq-color-text-primary);overflow-wrap:break-word;margin:0}}", z = (e) => String(e ?? "").replace(/[&<>"]/g, (e) => ({
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;"
})[e]), Br = (e, t) => `<arq-icon-button icon="download" size="large" background="${t}" data-sku="${z(e)}">Descargas de ${z(e)}</arq-icon-button>`, B = {
	search: "Buscar por SKU o nombre…",
	searchLabel: "Buscar por SKU o nombre",
	filters: "Filtros",
	clear: "Limpiar filtros",
	sort: "Ordenar por",
	downloads: "Descargas",
	image: "Imagen",
	empty: "Ningún SKU coincide con la búsqueda o los filtros.",
	count: (e) => e === 1 ? "1 variante" : `${e} variantes`
};
(class extends F {
	static tag = "arq-variants-table";
	static styles = zr;
	static properties = {
		downloads: { type: String },
		label: {
			type: String,
			default: "Variantes"
		},
		showSearch: { type: Boolean },
		showSort: { type: Boolean }
	};
	static template = `<div class="controls"><div class="toolbar"><div class="filters-group"><arq-button class="toggle-filters" show-icon icon="filter">${B.filters}</arq-button><span class="total role-body" aria-hidden="true"></span></div><div class="downloads"><slot name="downloads"></slot></div><arq-select class="sort" type="filter" label="${B.sort}" hidden></arq-select><arq-search-field class="search" placeholder="${B.search}" label="${B.searchLabel}" hidden></arq-search-field></div><div class="applied" hidden><div class="chips" role="list" aria-label="Filtros aplicados"></div><arq-button class="clear" type="underline" show-underline>${B.clear}</arq-button></div></div><div class="scroll" tabindex="0" role="region" aria-label="Variantes"><table class="table"><thead></thead><tbody></tbody></table></div><ul class="cards" role="list" aria-label="Variantes"></ul><p class="empty role-body" hidden>${B.empty}</p><span class="visually-hidden count" role="status"></span><arq-filter-panel class="panel" unit="variantes"><span slot="title">${B.filters}</span></arq-filter-panel>`;
	#e = {
		columns: [],
		filters: [],
		rows: []
	};
	#t = {};
	#n = "";
	#r = Be[0].value;
	get data() {
		return this.#e;
	}
	set data(e) {
		this.#e = {
			columns: e?.columns ?? [],
			filters: e?.filters ?? [],
			rows: e?.rows ?? []
		}, this.#t = {}, this.isConnected && this.#i();
	}
	setup() {
		let e = this.shadowRoot;
		e.querySelector(".toggle-filters").addEventListener("click", (e) => this.#d(e.currentTarget)), customElements.whenDefined("arq-button").then(() => {
			e.querySelector(".toggle-filters").shadowRoot?.querySelector(".control")?.setAttribute("aria-haspopup", "dialog");
		}), e.querySelector(".chips").addEventListener("click", (e) => {
			let t = e.target.closest("arq-filter-chip");
			t && this.#u(t);
		}), e.querySelector(".clear").addEventListener("click", () => {
			this.#t = {}, this.#a(!0), e.querySelector(".toggle-filters").focus();
		});
		let t = e.querySelector(".panel");
		t.addEventListener("arq:filters", (e) => {
			e.stopPropagation(), this.#f(e.detail.filters);
		}), t.addEventListener("arq:apply", (e) => {
			e.stopPropagation(), this.#t = { ...e.detail.filters }, this.#a(!0);
		}), e.querySelector(".search").addEventListener("arq:input", (e) => {
			e.stopPropagation(), this.#n = e.detail.value, this.#a(!0);
		}), e.querySelector(".search").addEventListener("arq:submit", (e) => e.stopPropagation());
		let n = e.querySelector("slot[name=\"downloads\"]"), r = () => n.parentElement.hidden = !n.assignedElements().length;
		n.addEventListener("slotchange", r), r();
		let i = e.querySelector(".sort");
		i.allLabel = Be[0].label, i.options = Be.slice(1), i.addEventListener("arq:change", (e) => {
			e.stopPropagation(), this.#r = e.detail.value || Be[0].value, this.#a(!0);
		}), e.addEventListener("click", (e) => {
			let t = e.target.closest("arq-icon-button[data-sku]");
			if (!t) return;
			let n = t.dataset.sku;
			this.emit("downloads", { sku: n }), (this.downloads ? this.getRootNode().getElementById?.(this.downloads) : null)?.show?.(t);
		}), this.#i();
	}
	update(e) {
		let t = this.shadowRoot;
		e.has("label") && t.querySelector(".scroll").setAttribute("aria-label", this.label ?? "Variantes"), e.has("showSearch") && (t.querySelector(".search").hidden = !this.showSearch), e.has("showSort") && (t.querySelector(".sort").hidden = !this.showSort), (e.has("showSearch") || e.has("showSort")) && this.#a();
	}
	#i() {
		let e = this.shadowRoot, { columns: t } = this.#e;
		e.querySelector("thead").innerHTML = `<tr><th scope="col" class="start"><span class="visually-hidden">${B.image}</span></th><th scope="col" class="sku-col role-body-regular">SKU</th>` + t.map((e) => `<th scope="col" class="role-body-regular">${z(e.label)}</th>`).join("") + `<th scope="col" class="end role-body-regular"><span class="th-downloads">${B.downloads}</span></th></tr>`, this.#a();
	}
	#a(e = !1) {
		let t = this.shadowRoot, { columns: n } = this.#e, r = this.showSearch ? ze(this.#e.rows, this.#n) : this.#e.rows;
		this.showSort && (r = He(r, this.#r));
		let i = b(r, this.#t), a = this.showSearch ? "none" : "outline";
		t.querySelector("tbody").innerHTML = i.map((e) => `<tr><td class="start"><span class="thumb">${e.thumb ? `<img src="${z(e.thumb)}" alt="" loading="lazy">` : ""}</span></td><th scope="row" class="sku-col"><arq-sku size="underline">${z(e.sku)}</arq-sku></th>` + n.map((t) => `<td class="role-body-lg-regular">${z(e.values?.[t.key] ?? "—")}</td>`).join("") + `<td class="end">${Br(e.sku, a)}</td></tr>`).join(""), t.querySelector(".cards").innerHTML = i.map((e) => `<li class="card"><span class="card-image">${e.thumb ? `<img src="${z(e.thumb)}" alt="" loading="lazy">` : ""}</span><span class="card-head"><arq-sku size="underline">${z(e.sku)}</arq-sku>${Br(e.sku, a)}</span><dl class="card-data">` + n.map((t) => `<div class="card-item"><dt class="role-body-sm">${z(t.label)}</dt><dd class="role-body-sm-medium">${z(e.values?.[t.key] ?? "—")}</dd></div>`).join("") + "</dl></li>").join(""), t.querySelector(".total").textContent = B.count(i.length);
		let o = this.#c();
		t.querySelector(".toggle-filters").textContent = o ? `${B.filters} (${o})` : B.filters, this.#l();
		let s = !i.length && this.#e.rows.length > 0;
		t.querySelector(".scroll").hidden = s, t.querySelector(".cards").hidden = s, t.querySelector(".empty").hidden = !s, e && (t.querySelector(".count").textContent = B.count(i.length));
	}
	#o() {
		let e = this.showSearch ? ze(this.#e.rows, this.#n) : this.#e.rows;
		return this.showSort ? He(e, this.#r) : e;
	}
	#s(e = this.#t) {
		let t = this.#e.filters.map((e) => e.key), n = Le(this.#e.rows, t, e), r = Le(this.#o(), t, e);
		return n.map((e, t) => {
			let n = new Set(r[t].options.filter((e) => !e.disabled).map((e) => e.value));
			return e.options.map((e) => ({
				value: e.value,
				selected: e.selected,
				disabled: !n.has(e.value) && !e.selected
			}));
		});
	}
	#c(e = this.#t) {
		return Object.values(e).reduce((e, t) => e + (t?.length ?? 0), 0);
	}
	#l() {
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
	#u(e) {
		let t = [...this.shadowRoot.querySelectorAll(".chips arq-filter-chip")].indexOf(e), { key: n, value: r } = e.dataset;
		this.#t = {
			...this.#t,
			[n]: (this.#t[n] ?? []).filter((e) => e !== r)
		}, this.#a(!0);
		let i = [...this.shadowRoot.querySelectorAll(".chips arq-filter-chip")];
		(i[t] ?? i[t - 1] ?? this.shadowRoot.querySelector(".toggle-filters")).focus();
	}
	#d(e) {
		let t = this.shadowRoot.querySelector(".panel"), { filters: n } = this.#e, r = this.#s();
		t.replaceChildren(t.querySelector("[slot=\"title\"]"), ...n.map((e, t) => {
			let n = document.createElement("arq-filter-row"), i = document.createElement("span");
			i.slot = "label", i.textContent = e.label, n.append(i);
			for (let i of r[t]) {
				let t = document.createElement("arq-checkbox");
				t.size = "large", t.showLabel = !0, t.setAttribute("name", e.key), t.value = i.value, t.textContent = i.value, t.checked = i.selected, t.disabled = i.disabled, n.append(t);
			}
			return n.open = r[t].some((e) => e.selected), n;
		})), t.count = b(this.#o(), this.#t).length, t.show(e);
	}
	#f(e) {
		let t = this.shadowRoot.querySelector(".panel"), n = this.#s(e);
		t.querySelectorAll("arq-filter-row").forEach((e, t) => {
			let r = n[t] ?? [];
			e.querySelectorAll("arq-checkbox").forEach((e, t) => {
				e.disabled = !!r[t]?.disabled && !e.checked;
			});
		}), t.count = b(this.#o(), e).length;
	}
}).define();
//#endregion
//#region src/components/downloads-table/downloads-table.css?inline
var Vr = ":host{gap:var(--arq-space-gap-md);min-width:0;margin-inline:var(--page-gutter);color:var(--arq-color-text-primary);flex-direction:column;display:flex}.controls{align-items:center;gap:var(--arq-space-gap-md) var(--arq-space-gap-lg);padding-block:var(--arq-space-padding-md);grid-template-columns:auto minmax(0,1fr) auto;display:grid}.search{width:100%;max-width:var(--arq-layout-download-search);grid-area:1/1/auto/3;justify-self:start;min-width:0}.toggle-filters{grid-area:1/3;justify-self:end}.total{color:var(--arq-color-text-secondary);grid-area:2/1}.applied{align-items:center;gap:var(--arq-space-gap-lg);flex-wrap:wrap;grid-area:2/2/auto/4;display:flex}.chips{gap:var(--arq-space-gap-sm);flex-wrap:wrap;display:flex}.reveal{transition-property:opacity,color,background-color,border-color,outline-color,text-decoration-color,fill,stroke;transition-duration:var(--arq-motion-duration-base);transition-timing-function:var(--arq-motion-easing-standard)}@media (prefers-reduced-motion:reduce){.reveal{transition-duration:var(--arq-motion-duration-fade), var(--arq-motion-duration-fast), var(--arq-motion-duration-fast), var(--arq-motion-duration-fast), var(--arq-motion-duration-fast), var(--arq-motion-duration-fast), var(--arq-motion-duration-fast), var(--arq-motion-duration-fast);transition-timing-function:var(--arq-motion-easing-out)}}@starting-style{.reveal:not([hidden]){opacity:0}}.scroll{--page-gutter:var(--arq-space-padding-sm);overscroll-behavior-x:contain;scrollbar-width:none;overflow-x:auto}.scroll::-webkit-scrollbar{display:none}.scrollbar{z-index:2;margin-top:calc(-1 * var(--arq-space-gap-md));background:var(--arq-color-surface-default);scrollbar-width:thin;scrollbar-color:var(--arq-color-border-default) var(--arq-color-surface-transparent);overscroll-behavior-x:contain;position:sticky;bottom:0;overflow-x:auto}@media (hover:hover) and (pointer:fine){.scrollbar:hover{scrollbar-color:var(--arq-color-border-hover) var(--arq-color-surface-transparent)}}.scrollbar-track{height:var(--arq-border-default)}.scrollbar::-webkit-scrollbar{height:var(--arq-space-gap-xs)}.scrollbar::-webkit-scrollbar-track{background:var(--arq-color-surface-transparent)}.scrollbar::-webkit-scrollbar-thumb{background:var(--arq-color-border-default)}.scroll:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:calc(-1 * var(--arq-border-strong))}.table{border-collapse:collapse;border-spacing:0;width:100%}th,td{padding:0 var(--arq-space-gap-lg) 0 0;border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle);background:var(--arq-color-surface-default);text-align:start;white-space:nowrap;vertical-align:middle}thead th{padding-block:var(--arq-space-padding-sm-md);color:var(--arq-color-text-tertiary);font-weight:inherit}tbody th,tbody td{padding-block:var(--arq-space-padding-sm);color:var(--arq-color-text-primary)}@media (hover:hover) and (pointer:fine){tbody tr:hover>*{background:var(--arq-color-surface-faint)}}.start{z-index:1;width:1%;padding-inline:var(--page-gutter) var(--arq-space-gap-sm);position:sticky;left:0}.sku-col{left:calc(var(--page-gutter) + var(--arq-layout-download-thumb) + var(--arq-space-gap-sm));z-index:1;width:1%;font-weight:inherit;padding-inline-end:var(--arq-space-gap-xl);position:sticky}.thumb{width:var(--arq-layout-download-thumb);height:var(--arq-layout-download-thumb);background:var(--arq-color-surface-subtle);display:block;overflow:hidden}.thumb img,.card-thumb img{object-fit:cover;width:100%;height:100%;display:block}.product{align-items:flex-start;gap:var(--arq-space-gap-xs);flex-direction:column;min-width:0;display:flex}.name{color:var(--arq-color-text-primary)}th.end,td.end{z-index:1;width:1%;padding-inline:var(--arq-space-gap-sm) var(--page-gutter);text-align:center;position:sticky;right:0}@media (width<=1023px){.sku-col{position:static}}.more{padding-top:var(--arq-space-gap-xl);justify-content:center;display:flex}.empty{gap:var(--arq-space-gap-sm-md);padding:var(--arq-space-section-sm) 0 var(--arq-space-section-md);flex-direction:column;display:flex}.empty p{margin:0}.empty-title{color:var(--arq-color-text-primary)}.empty-text{max-width:var(--arq-layout-measure-wide);color:var(--arq-color-text-secondary)}.skeleton{flex-direction:column;display:flex}.sk-row{align-items:center;gap:var(--arq-space-gap-sm);padding:var(--arq-space-padding-sm);border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle);display:flex}.sk-thumb{width:var(--arq-layout-download-thumb);height:var(--arq-layout-download-thumb);background:var(--arq-color-surface-subtle);flex:none}.sk-product{gap:var(--arq-space-gap-sm);flex-direction:column;flex:0 0 25%;padding-inline-start:var(--arq-space-padding-sm);display:flex}.sk-bar{width:70%;height:var(--arq-space-gap-sm-md);background:var(--arq-color-surface-subtle);display:block}.sk-short{width:35%;height:var(--arq-icon-sm)}.sk-cells{gap:var(--arq-space-gap-sm);flex:auto;min-width:0;display:flex}.sk-cell{flex:1 1 0;min-width:0}.sk-cell .sk-bar{width:55%}.sk-download{width:var(--arq-icon-xl);height:var(--arq-icon-xl);margin-inline:var(--arq-space-padding-lg);background:var(--arq-color-surface-subtle);flex:none}.sk-card{display:none}.cards{margin:0;padding:0;list-style:none;display:none}@media (width<=767px){.controls{grid-template-columns:auto minmax(0,1fr)}.search{grid-column:1/-1;max-width:none}.toggle-filters{grid-area:2/1;justify-self:start}.total{grid-column:2}.applied{grid-area:3/1/auto/-1}.scroll,.scrollbar{display:none}.cards:not([hidden]){flex-direction:column;display:flex}.card{gap:var(--arq-space-gap-md);padding-block:var(--arq-space-padding-lg);border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle);flex-direction:column;display:flex}.card-head{align-items:center;gap:var(--arq-space-gap-md);display:flex}.card-thumb{width:var(--arq-layout-download-thumb);height:var(--arq-layout-download-thumb);background:var(--arq-color-surface-subtle);flex:none;overflow:hidden}.card-data{grid-template-columns:repeat(2,minmax(0,1fr));margin:0;display:grid}.card-item{gap:var(--arq-space-gap-xs);padding-block:var(--arq-space-padding-sm);border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle);flex-direction:column;display:flex}.card-item dt{color:var(--arq-color-text-secondary)}.card-item dd{color:var(--arq-color-text-primary);overflow-wrap:break-word;margin:0}.card-actions{justify-content:space-between;align-items:center;gap:var(--arq-space-gap-md);flex-wrap:wrap;display:flex}.sk-row{display:none}.sk-card{gap:var(--arq-space-gap-md);padding-block:var(--arq-space-padding-lg);border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle);flex-direction:column;display:flex}.sk-head{align-items:center;gap:var(--arq-space-gap-md);display:flex}.sk-card .sk-thumb{width:var(--arq-layout-download-thumb);height:var(--arq-layout-download-thumb)}.sk-card .sk-product{flex:auto;padding:0}.sk-data{gap:var(--arq-space-gap-md);grid-template-columns:repeat(2,minmax(0,1fr));display:grid}.sk-data .sk-bar{width:50%}}", Hr = new Intl.NumberFormat("es-AR"), V = (e) => String(e ?? "").replace(/[&<>"]/g, (e) => ({
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;"
})[e]), H = {
	filters: "Filtros",
	search: "Buscar por nombre o SKU…",
	searchLabel: "Buscar por nombre o SKU",
	clear: "Limpiar filtros",
	downloads: "Descargas",
	product: "Ver producto",
	image: "Imagen",
	sku: "SKU",
	loading: "Buscando…",
	emptyTitle: "No hay productos con estos filtros",
	emptyText: "Probá quitar alguno de los filtros aplicados o buscar por otro nombre o SKU.",
	emptySearchTitle: (e) => `No hay productos para «${e}»`,
	emptySearchText: "Probá con otro nombre o SKU, o con una parte del código.",
	emptyBothTitle: (e) => `No hay productos para «${e}» con estos filtros`,
	more: "Ver más productos",
	shown: (e, t) => `Se muestran ${Hr.format(e)} de ${Hr.format(t)} productos`,
	count: (e) => e === 1 ? "1 producto" : `${Hr.format(e)} productos`
}, Ur = 100, Wr = 500, Gr = [
	"potencia",
	"temperatura_color",
	"angulo_apertura",
	"proteccion_ip"
], Kr = 9, qr = (e) => `<arq-icon-button icon="download" size="large" background="outline" data-sku="${V(e)}">Descargas de ${V(e)}</arq-icon-button>`, Jr = (e, t) => `<span class="${t}">${e.thumb ? `<img src="${V(e.thumb)}" alt="" loading="lazy">` : ""}</span>`;
(class extends F {
	static tag = "arq-downloads-table";
	static styles = Vr;
	static properties = {
		loading: { type: Boolean },
		downloads: { type: String },
		label: {
			type: String,
			default: "Productos"
		}
	};
	static template = `<div class="controls"><arq-search-field class="search" placeholder="${H.search}" label="${H.searchLabel}"></arq-search-field><arq-button class="toggle-filters" show-icon icon="filter">${H.filters}</arq-button><span class="total role-body" aria-hidden="true"></span><div class="applied" hidden><div class="chips" role="list" aria-label="Filtros aplicados"></div><arq-button class="clear" type="underline" show-underline>${H.clear}</arq-button></div></div><div class="scroll" tabindex="0" role="region" aria-label="Productos"><table class="table"><thead></thead><tbody></tbody></table></div><div class="scrollbar" aria-hidden="true" hidden><div class="scrollbar-track"></div></div><ul class="cards" role="list" aria-label="Productos"></ul><div class="more" hidden><arq-button class="more-button" type="outline">${H.more}</arq-button></div><div class="skeleton" aria-hidden="true" hidden></div><div class="empty" hidden><p class="empty-title role-heading-2">${H.emptyTitle}</p><p class="empty-text role-body-regular">${H.emptyText}</p></div><span class="visually-hidden count" role="status"></span><arq-filter-panel class="panel" unit="productos"><span slot="title">${H.filters}</span></arq-filter-panel>`;
	#e = {
		columns: [],
		filters: [],
		rows: []
	};
	#t = {};
	#n = "";
	#r = !1;
	#i = Ur;
	#a = null;
	get data() {
		return this.#e;
	}
	set data(e) {
		this.#e = {
			columns: e?.columns ?? [],
			filters: e?.filters ?? [],
			rows: e?.rows ?? []
		}, this.#o(), this.isConnected && this.#d();
	}
	#o() {
		let e = new URLSearchParams(location.search);
		this.#n = e.get("q") ?? "";
		let t = {};
		for (let { key: n } of this.#e.filters) {
			let r = e.getAll(n);
			r.length && (t[n] = r);
		}
		this.#t = t;
		let n = this.shadowRoot?.querySelector(".search");
		n && (n.value = this.#n);
	}
	#s() {
		let e = new URL(location.href);
		e.searchParams.delete("q");
		for (let { key: t } of this.#e.filters) e.searchParams.delete(t);
		this.#n.trim() && e.searchParams.set("q", this.#n.trim());
		for (let { key: t } of this.#e.filters) for (let n of this.#t[t] ?? []) e.searchParams.append(t, n);
		e.href !== location.href && history.replaceState(history.state, "", e);
	}
	#c(e = 0) {
		this.#i = Ur, this.#_(), this.#s(), this.#l(H.count(this.#h().length), e);
	}
	#l(e, t = 0) {
		clearTimeout(this.#a), this.#a = setTimeout(() => {
			this.shadowRoot.querySelector(".count").textContent = e;
		}, t);
	}
	setup() {
		let e = this.shadowRoot;
		e.addEventListener("error", (e) => {
			e.target.localName === "img" && (e.target.hidden = !0);
		}, !0), e.querySelector(".toggle-filters").addEventListener("click", (e) => this.#S(e.currentTarget)), customElements.whenDefined("arq-button").then(() => {
			e.querySelector(".toggle-filters").shadowRoot?.querySelector(".control")?.setAttribute("aria-haspopup", "dialog");
		}), e.querySelector(".search").addEventListener("arq:input", (e) => {
			e.stopPropagation(), this.#n = e.detail.value, this.#c(Wr);
		}), e.querySelector(".search").addEventListener("arq:submit", (e) => e.stopPropagation()), e.querySelector(".search").value = this.#n, e.querySelector(".chips").addEventListener("click", (e) => {
			let t = e.target.closest("arq-filter-chip");
			t && this.#x(t);
		}), e.querySelector(".clear").addEventListener("click", () => {
			this.#t = {}, this.#c(), e.querySelector(".toggle-filters").focus();
		}), e.querySelector(".more-button").addEventListener("click", () => this.#g());
		let t = e.querySelector(".panel");
		t.addEventListener("arq:filters", (e) => {
			e.stopPropagation(), this.#C(e.detail.filters);
		}), t.addEventListener("arq:apply", (e) => {
			e.stopPropagation(), this.#t = { ...e.detail.filters }, this.#c();
		}), e.addEventListener("click", (e) => {
			let t = e.target.closest("[data-sku]");
			if (!t) return;
			let n = t.dataset.sku;
			this.emit("downloads", { sku: n }), (this.downloads ? this.getRootNode().getElementById?.(this.downloads) : null)?.show?.(t);
		}), this.#u(), this.#d();
	}
	#u() {
		let e = this.shadowRoot, t = e.querySelector(".scroll"), n = e.querySelector(".scrollbar"), r = e.querySelector(".scrollbar-track"), i = null, a = (e, t) => {
			i !== t && (i = e, t.scrollLeft = e.scrollLeft, requestAnimationFrame(() => i = null));
		};
		t.addEventListener("scroll", () => a(t, n), { passive: !0 }), n.addEventListener("scroll", () => a(n, t), { passive: !0 });
		let o = new ResizeObserver(() => {
			r.style.width = `${t.scrollWidth}px`, n.hidden = t.hidden || t.scrollWidth <= t.clientWidth, n.scrollLeft = t.scrollLeft;
		});
		o.observe(t), o.observe(e.querySelector(".table"));
	}
	update(e) {
		let t = this.shadowRoot;
		e.has("label") && t.querySelector(".scroll").setAttribute("aria-label", this.label ?? "Productos"), e.has("loading") && this.#_();
	}
	#d() {
		let e = this.shadowRoot, { columns: t } = this.#e;
		e.querySelector("thead").innerHTML = `<tr><th scope="col" class="start"><span class="visually-hidden">${H.image}</span></th><th scope="col" class="sku-col role-label-lg">${H.sku}</th>` + t.map((e) => `<th scope="col" class="role-label-lg">${V(e.label)}</th>`).join("") + `<th scope="col" class="end role-label-lg">${H.downloads}</th></tr>`, this.#_();
	}
	#f() {
		return ze(this.#e.rows, this.#n);
	}
	#p(e = this.#t) {
		let t = this.#e.filters.map((e) => e.key), n = Le(this.#e.rows, t, e), r = Le(this.#f(), t, e);
		return n.map((e, t) => {
			let n = new Set(r[t].options.filter((e) => !e.disabled).map((e) => e.value));
			return e.options.map((e) => ({
				value: e.value,
				selected: e.selected,
				disabled: !n.has(e.value) && !e.selected
			}));
		});
	}
	#m(e = this.#t) {
		return Object.values(e).reduce((e, t) => e + (t?.length ?? 0), 0);
	}
	#h() {
		return b(this.#f(), this.#t);
	}
	#g() {
		let e = this.shadowRoot, t = this.#i;
		this.#i += Ur, this.#_();
		let n = this.#h().length;
		if (this.#l(H.shown(Math.min(this.#i, n), n)), e.querySelector(".more").hidden) {
			let n = getComputedStyle(e.querySelector(".cards")).display !== "none";
			e.querySelectorAll(n ? ".cards [data-sku]" : "tbody [data-sku]")[t]?.focus();
		}
	}
	#_() {
		let e = this.shadowRoot, { columns: t, filters: n } = this.#e, r = this.#h(), i = r.slice(0, this.#i), a = this.#m(), o = e.querySelector(".toggle-filters");
		o.textContent = a ? `${H.filters} (${a})` : H.filters, o.disabled = this.loading || !n.length, this.#b(), e.querySelector("tbody").innerHTML = i.map((e) => `<tr><td class="start">${Jr(e, "thumb")}</td><th scope="row" class="sku-col"><span class="product">` + (e.name ? `<span class="name role-body-compact-medium">${V(e.name)}</span>` : "") + `<arq-sku size="compact">${V(e.sku)}</arq-sku></span></th>` + t.map((t) => `<td class="role-body-lg-regular">${V(e.values?.[t.key] ?? "—")}</td>`).join("") + `<td class="end">${qr(e.sku)}</td></tr>`).join("");
		let s = Gr.map((e) => t.find((t) => t.key === e)).filter(Boolean);
		e.querySelector(".cards").innerHTML = i.map((e) => `<li class="card"><span class="card-head">${Jr(e, "card-thumb")}<span class="product">` + (e.name ? `<span class="name role-body-medium">${V(e.name)}</span>` : "") + `<arq-sku size="compact">${V(e.sku)}</arq-sku></span></span>` + (s.length ? "<dl class=\"card-data\">" + s.map((t) => `<div class="card-item"><dt class="role-body-compact-regular">${V(t.label)}</dt><dd class="role-body-medium">${V(e.values?.[t.key] ?? "—")}</dd></div>`).join("") + "</dl>" : "") + `<span class="card-actions"><arq-button type="outline" show-icon icon="download" data-sku="${V(e.sku)}">${H.downloads}<span class="visually-hidden"> de ${V(e.sku)}</span></arq-button>` + (e.href ? `<arq-button type="underline" show-underline show-icon icon="arrow-up-right" href="${V(e.href)}">${H.product}<span class="visually-hidden"> ${V(e.name ?? e.sku)}</span></arq-button>` : "") + "</span></li>").join(""), e.querySelector(".total").textContent = this.loading ? H.loading : H.count(r.length);
		let c = !this.loading && !r.length && this.#e.rows.length > 0;
		!this.loading && !this.#r && !e.querySelector(".skeleton").hidden && this.#y(), e.querySelector(".skeleton").hidden = !this.loading, this.loading && this.#w(), e.querySelector(".scroll").hidden = c || this.loading, e.querySelector(".cards").hidden = c || this.loading, e.querySelector(".more").hidden = this.loading || r.length <= this.#i, e.querySelector(".empty").hidden = !c, c && this.#v(a);
	}
	#v(e) {
		let t = this.shadowRoot, n = this.#n.trim(), r = n && e ? H.emptyBothTitle(n) : n ? H.emptySearchTitle(n) : H.emptyTitle;
		t.querySelector(".empty-title").textContent = r, t.querySelector(".empty-text").textContent = n && !e ? H.emptySearchText : H.emptyText;
	}
	#y() {
		this.#r = !0;
		let e = [this.shadowRoot.querySelector(".scroll"), this.shadowRoot.querySelector(".cards")], t = () => {
			for (let t of e) t.classList.remove("reveal"), t.removeEventListener("transitionend", n), t.removeEventListener("transitioncancel", n);
		}, n = (e) => {
			e.target === e.currentTarget && e.propertyName === "opacity" && t();
		};
		for (let t of e) t.classList.add("reveal"), t.addEventListener("transitionend", n), t.addEventListener("transitioncancel", n);
		parseFloat(getComputedStyle(e[0]).transitionDuration) || requestAnimationFrame(t);
	}
	#b() {
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
	#x(e) {
		let t = [...this.shadowRoot.querySelectorAll(".chips arq-filter-chip")].indexOf(e), { key: n, value: r } = e.dataset;
		this.#t = {
			...this.#t,
			[n]: (this.#t[n] ?? []).filter((e) => e !== r)
		}, this.#c();
		let i = [...this.shadowRoot.querySelectorAll(".chips arq-filter-chip")];
		(i[t] ?? i[t - 1] ?? this.shadowRoot.querySelector(".toggle-filters")).focus();
	}
	#S(e) {
		let t = this.shadowRoot.querySelector(".panel"), n = this.#f(), { filters: r } = this.#e, i = this.#p();
		t.replaceChildren(t.querySelector("[slot=\"title\"]"), ...r.map((e, t) => {
			let n = document.createElement("arq-filter-row"), r = document.createElement("span");
			r.slot = "label", r.textContent = e.label, n.append(r);
			for (let r of i[t]) {
				let t = document.createElement("arq-checkbox");
				t.size = "large", t.showLabel = !0, t.setAttribute("name", e.key), t.value = r.value, t.textContent = r.value, t.checked = r.selected, t.disabled = r.disabled, n.append(t);
			}
			return n.open = i[t].some((e) => e.selected), n;
		})), t.count = b(n, this.#t).length, t.show(e);
	}
	#C(e) {
		let t = this.shadowRoot.querySelector(".panel"), n = this.#f(), r = this.#p(e);
		t.querySelectorAll("arq-filter-row").forEach((e, t) => {
			let n = r[t] ?? [];
			e.querySelectorAll("arq-checkbox").forEach((e, t) => {
				e.disabled = !!n[t]?.disabled && !e.checked;
			});
		}), t.count = b(n, e).length;
	}
	#w() {
		let e = this.shadowRoot.querySelector(".skeleton");
		if (e.childElementCount) return;
		let t = this.#e.columns.length || Kr, n = Array.from({ length: t }, () => "<span class=\"sk-cell\"><span class=\"sk-bar\"></span></span>").join("");
		e.innerHTML = Array.from({ length: 4 }, () => `<div class="sk-row"><span class="sk-thumb"></span><span class="sk-product"><span class="sk-bar sk-short"></span><span class="sk-bar"></span></span><span class="sk-cells">${n}</span><span class="sk-download"></span></div>`).join("") + Array.from({ length: 3 }, () => "<div class=\"sk-card\"><span class=\"sk-head\"><span class=\"sk-thumb\"></span><span class=\"sk-product\"><span class=\"sk-bar sk-short\"></span><span class=\"sk-bar\"></span></span></span><span class=\"sk-data\"><span class=\"sk-bar\"></span><span class=\"sk-bar\"></span><span class=\"sk-bar\"></span><span class=\"sk-bar\"></span></span></div>").join("");
	}
}).define();
//#endregion
//#region src/components/gallery-thumb/gallery-thumb.css?inline
var Yr = ":host{display:block}.thumb{box-sizing:border-box;aspect-ratio:5/4;border-radius:var(--arq-radius-control);background:var(--arq-color-surface-subtle);cursor:pointer;-webkit-tap-highlight-color:var(--arq-color-surface-transparent);border:0;width:100%;margin:0;padding:0;display:block;position:relative;overflow:hidden}.thumb img{object-fit:cover;width:100%;height:100%;display:block}.thumb:after{content:\"\";border:var(--arq-border-default) solid var(--arq-color-surface-transparent);border-radius:inherit;pointer-events:none;position:absolute;inset:0}.thumb:hover:after{border-color:var(--arq-color-border-hover)}.thumb[aria-current=true]:after{border-color:var(--arq-color-border-strong)}.thumb:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.thumb:focus:not(:focus-visible){outline:none}";
(class extends F {
	static tag = "arq-gallery-thumb";
	static styles = Yr;
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
//#region src/base/theme.js
var Xr = /* @__PURE__ */ new Set(), Zr = null;
function Qr(e) {
	if (e.assignedSlot) return e.assignedSlot;
	if (e.parentElement) return e.parentElement;
	let t = e.parentNode;
	return t instanceof ShadowRoot ? t.host : null;
}
function $r(e, t) {
	for (let n = e; n; n = Qr(n)) {
		if (t !== void 0 && n === document.documentElement) return t;
		if (n.hasAttribute?.("data-arq-theme")) return n.getAttribute("data-arq-theme") === "dark";
	}
	return t ?? !1;
}
function ei() {
	ti();
}
function ti(e) {
	typeof e != "boolean" && (e = void 0);
	for (let t of Xr) {
		let n = t.ref.deref();
		if (!n) {
			Xr.delete(t);
			continue;
		}
		if (!n.isConnected) continue;
		let r = $r(n, e);
		r !== t.dark && (t.dark = r, n[t.method](r));
	}
}
function ni(e, t) {
	let n = {
		ref: new WeakRef(e),
		dark: $r(e),
		method: t
	};
	Xr.add(n), Zr || (Zr = new MutationObserver(ti), Zr.observe(document.documentElement, {
		attributes: !0,
		subtree: !0,
		attributeFilter: ["data-arq-theme"]
	})), e[t](n.dark);
}
var U = [
	"--arq-theme-text-delay",
	"--arq-theme-text-duration",
	"--arq-theme-text-easing",
	"--arq-theme-bg-duration",
	"--arq-theme-bg-easing"
], ri = 0, ii = [
	"--arq-illumination-bg-duration",
	"--arq-illumination-image-duration",
	"--arq-theme-bg-duration",
	"--arq-theme-text-duration",
	"--arq-theme-text-delay"
];
function ai(e) {
	let t = document.documentElement.style;
	for (let e of ii) t.setProperty(e, "0s");
	e(), requestAnimationFrame(() => requestAnimationFrame(() => ii.forEach((e) => t.removeProperty(e))));
}
var oi = "data-arq-theme-color", si = "data-arq-theme-color-added";
function ci(e, t = document.documentElement) {
	let n = [...document.head.querySelectorAll("meta[name=\"theme-color\"]")];
	if (!e) {
		for (let e of n) e.hasAttribute(si) ? e.remove() : e.hasAttribute(oi) && (e.content = e.getAttribute(oi), e.removeAttribute(oi));
		return;
	}
	let r = getComputedStyle(t).getPropertyValue("--arq-color-surface-default").trim();
	if (r) {
		if (!n.length) {
			let e = document.createElement("meta");
			e.name = "theme-color", e.setAttribute(si, ""), document.head.append(e), n.push(e);
		}
		for (let e of n) !e.hasAttribute(si) && !e.hasAttribute(oi) && e.setAttribute(oi, e.content), e.content = r;
	}
}
var li = "arq:iluminar-handoff", ui = 1e4;
function di(e) {
	try {
		e ? sessionStorage.setItem(li, String(Date.now())) : sessionStorage.removeItem(li);
	} catch {}
}
function fi() {
	try {
		let e = Number(sessionStorage.getItem(li));
		return sessionStorage.removeItem(li), !!e && Date.now() - e < ui;
	} catch {
		return !1;
	}
}
function pi(e = 1200) {
	let t = document.documentElement.style;
	if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
		let e = "var(--arq-motion-duration-fade)";
		t.setProperty(U[0], "0s"), t.setProperty(U[1], e), t.setProperty(U[2], "var(--arq-motion-easing-standard)"), t.setProperty(U[3], e), t.setProperty(U[4], "var(--arq-motion-easing-standard)"), clearTimeout(ri), ri = setTimeout(() => U.forEach((e) => t.removeProperty(e)), 1e3);
		return;
	}
	t.setProperty(U[0], `${Math.round(e * .25)}ms`), t.setProperty(U[1], `${Math.round(e * .5)}ms`), t.setProperty(U[2], "cubic-bezier(0.4, 0, 0.2, 1)"), t.setProperty(U[3], `${e}ms`), t.setProperty(U[4], "cubic-bezier(0.45, 0, 0.2, 1)"), clearTimeout(ri), ri = setTimeout(() => U.forEach((e) => t.removeProperty(e)), e + 100);
}
var mi = 400, hi = 150, gi = /* @__PURE__ */ new Set(), _i = 0, vi = (e) => new Promise((t) => setTimeout(t, e));
function yi(e) {
	return !e.getAttribute("src") || e.complete ? Promise.resolve() : Promise.race([e.decode().catch(() => {}), vi(mi)]);
}
function bi(e) {
	if (!e.getAttribute("src") || e.complete) return;
	let t = e.getBoundingClientRect();
	if (t.bottom < 0 || t.top > innerHeight) return;
	let n = yi(e).finally(() => gi.delete(n));
	gi.add(n);
}
function xi(e, t, n) {
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
async function Si(e, t, n) {
	let r = document.documentElement, i = getComputedStyle(r), a = Number.parseFloat(i.getPropertyValue("--arq-illumination-bg-duration")) || 0;
	if (!document.startViewTransition || !a) {
		pi(), t();
		return;
	}
	let o = i.getPropertyValue("--arq-illumination-bg-easing").trim() || "ease", s = r.style, c = ++_i, l = a, u = matchMedia("(prefers-reduced-motion: reduce)").matches, d = !u && n && i.getPropertyValue("--arq-illumination-style").trim() === "spread";
	if (!u) {
		let t = Number.parseFloat(i.getPropertyValue("--arq-motion-duration-illumination-lead")) || 0;
		if (ti(e), await Promise.race([Promise.all(gi), vi(hi)]), await vi(t), c !== _i) return;
		l = Math.max(a - t, 0);
	}
	let f = document.startViewTransition(async () => {
		for (let e of ii) s.setProperty(e, "0s");
		t(), await Promise.resolve(), await Promise.race([Promise.all(gi), vi(hi)]);
	});
	f.ready.then(() => {
		if (d) return xi(n, l, o);
		for (let e of document.getAnimations()) e.effect?.pseudoElement?.startsWith("::view-transition") && e.effect.updateTiming({
			duration: l,
			easing: o
		});
	}).catch(() => {}), f.finished.finally(() => {
		c === _i && ii.forEach((e) => s.removeProperty(e));
	});
}
//#endregion
//#region src/components/product-gallery/product-gallery.css?inline
var Ci = ":host{min-width:0;display:block}.gallery{gap:var(--arq-space-gap-sm);flex-direction:column;display:flex;position:relative}.image{aspect-ratio:5/4;border-radius:var(--arq-radius-control);background:var(--arq-color-surface-subtle);position:relative;overflow:hidden}.theme-transition{z-index:1;object-fit:cover;opacity:1;pointer-events:none;width:100%;height:100%;transition-property:opacity;transition-duration:var(--arq-illumination-image-duration,var(--arq-motion-duration-slow));transition-timing-function:var(--arq-illumination-image-easing,var(--arq-motion-easing-standard));position:absolute;inset:0}.theme-transition.fade-out{opacity:0}::slotted(img){object-fit:cover!important;width:100%!important;height:100%!important;display:block!important}.thumbs{gap:var(--arq-space-gap-sm);margin:calc(-1 * var(--arq-space-padding-xs));padding:var(--arq-space-padding-xs);scroll-snap-type:x mandatory;scrollbar-width:none;display:flex;overflow-x:auto}.thumbs::-webkit-scrollbar{display:none}arq-gallery-thumb{width:var(--arq-layout-gallery-thumb);scroll-snap-align:start;flex:none}@media (width>=768px){.thumbs{left:var(--arq-space-padding-lg);bottom:var(--arq-space-padding-lg);max-width:calc(100% - 2 * var(--arq-space-padding-lg));position:absolute}}@media (width>=1024px){:host([fill]){flex-direction:column;display:flex}:host([fill]) .gallery{flex:auto;min-height:0}:host([fill]) .image{aspect-ratio:auto;flex:auto;min-height:0}:host([fill]) ::slotted(img){position:absolute!important;inset:0!important}:host([fill]) .thumbs{left:var(--arq-space-padding-xl-2xl);bottom:var(--arq-space-padding-xl);max-width:none;max-height:calc(100% - 2 * var(--arq-space-padding-xl));scroll-snap-type:y mandatory;flex-direction:column;overflow:hidden auto}}";
(class extends F {
	static tag = "arq-product-gallery";
	static styles = Ci;
	static properties = {};
	static template = "<div class=\"gallery\"><div class=\"image\"><slot name=\"image\"></slot><slot name=\"overlay\"></slot></div><div class=\"thumbs\" hidden></div></div>";
	#e = [];
	#t = 0;
	#n = !1;
	#r = !1;
	#i = null;
	get images() {
		return this.#e;
	}
	set images(e) {
		this.#e = Array.isArray(e) ? e.filter((e) => e && e.src) : [], this.#r = !0, this.#t = 0, this.isConnected && this.#s();
	}
	setup() {
		this.shadowRoot.querySelector(".thumbs").addEventListener("click", (e) => {
			let t = e.target.closest("arq-gallery-thumb");
			t && this.select(Number(t.dataset.index));
		}), ni(this, "themeChanged"), this.#s();
	}
	themeChanged(e) {
		let t = this.#e[this.#t], n = t ? this.#a(t) : null;
		this.#n = e, this.#s(n);
	}
	select(e) {
		this.#e[e] && e !== this.#t && (this.#t = e, this.#s());
	}
	#a(e) {
		return this.#n && e.srcOn || e.src;
	}
	#o() {
		let e = this.querySelector(":scope > img[slot=\"image\"]");
		return !e && this.#e.length && (e = document.createElement("img"), e.slot = "image", this.append(e)), e;
	}
	#s(e = null) {
		let t = this.#e, n = t[this.#t], r = this.#o();
		if (r && n) {
			let t = this.#a(n);
			r.getAttribute("src") !== t && (e && r.getAttribute("src") === e && t !== e ? this.#c(r, e, t) : r.src = t), r.alt = n.alt ?? "";
			let i = this.#n ? n.src : n.srcOn;
			i && i !== t && (new Image().src = i);
		}
		r && this.#r && (r.style.display = n ? "" : "none");
		let i = this.shadowRoot.querySelector(".thumbs");
		if (i.hidden = t.length < 2, i.hidden) {
			i.replaceChildren();
			return;
		}
		for (; i.children.length > t.length;) i.lastElementChild.remove();
		for (; i.children.length < t.length;) i.append(document.createElement("arq-gallery-thumb"));
		t.forEach((e, t) => {
			let n = i.children[t];
			n.dataset.index = String(t), n.src = this.#a(e), n.alt = e.alt ?? "", n.selected = t === this.#t;
		});
	}
	#c(e, t, n) {
		this.#i?.remove();
		let r = document.createElement("img");
		r.className = "theme-transition", r.src = t, r.alt = "", r.setAttribute("aria-hidden", "true"), this.#i = r, this.shadowRoot.querySelector(".image").append(r), e.src = n, r.addEventListener("transitionend", (e) => {
			e.propertyName === "opacity" && r.remove();
		}, { once: !0 }), r.offsetWidth, r.classList.add("fade-out");
		let i = getComputedStyle(r).transitionDuration.split(",")[0];
		Number.parseFloat(i) || r.remove();
	}
}).define();
//#endregion
//#region src/base/card-link.css?inline
var W = ".card{--card-above:1;position:relative}.card-link{color:inherit;-webkit-tap-highlight-color:var(--arq-color-surface-transparent);text-decoration:none;display:block}.card-link[href],.card-link[href]:after{cursor:pointer}.card:has(.card-link[href]) .card-media ::slotted(*){cursor:pointer!important}.card-link:after{content:\"\";position:absolute;inset:0}.card-link:focus{outline:none}.card:has(.card-link:focus-visible){outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}@media (hover:hover) and (pointer:fine){.card:has(.card-link:hover) .card-media{outline:var(--arq-border-default) solid var(--arq-color-border-hover);outline-offset:calc(var(--arq-border-default) * -1)}}.card-media{background:var(--arq-color-surface-subtle);overflow:hidden}.card-media ::slotted(*){object-fit:cover;width:100%!important;max-width:none!important;height:100%!important;display:block!important}", wi = ":host{min-width:0;display:block}.card{gap:var(--arq-space-gap-md);flex-direction:column;display:flex}.card-media{aspect-ratio:1;background:var(--arq-color-surface-subtle)}:host([size=large]) .card-media{aspect-ratio:7/10}.name{max-width:100%;color:var(--arq-color-text-secondary);overflow-wrap:break-word;align-self:flex-start}:host([size=large]) .name{color:var(--arq-color-text-primary)}";
(class extends F {
	static tag = "arq-family-card";
	static styles = W + wi;
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
var Ti = ":host{min-width:0;display:block}.card{gap:var(--arq-space-gap-md);flex-direction:column;display:flex}.card-media{aspect-ratio:5/4}.card-media ::slotted(*){object-fit:contain!important}.caption{gap:var(--arq-space-gap-xs);flex-direction:column;display:flex}.title-row{align-items:center;gap:var(--arq-space-gap-sm-md);display:flex}.title{min-width:0;color:var(--arq-color-text-primary);overflow-wrap:break-word;flex:auto}.icon-wrap{color:var(--arq-color-icon-primary);flex:none;display:inline-flex}.icon{width:var(--arq-icon-lg);height:var(--arq-icon-lg)}.description{color:var(--arq-color-text-secondary);margin:0}";
(class extends F {
	static tag = "arq-download-card";
	static styles = W + Ti;
	static properties = {
		href: { type: String },
		showDescription: { type: Boolean }
	};
	static template = `<div class="card"><div class="card-media"><slot name="image"></slot></div><div class="caption"><div class="title-row"><a class="card-link title role-heading-3"><slot name="title"></slot></a><span class="icon-wrap" aria-hidden="true">${I("download")}</span></div><p class="description role-body" hidden><slot name="description"></slot></p></div></div>`;
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
//#region src/components/download-item/download-item.css?inline
var Ei = ":host{min-width:0;display:block}.row{box-sizing:border-box;align-items:center;gap:var(--arq-space-gap-md);width:100%;padding:var(--arq-space-padding-md) 0 calc(var(--arq-space-padding-md) - var(--arq-border-default));border:0;border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle);border-radius:var(--arq-radius-control);background:var(--arq-color-surface-transparent);color:var(--arq-color-text-primary);font:inherit;text-align:start;cursor:pointer;-webkit-tap-highlight-color:var(--arq-color-surface-transparent);margin:0;text-decoration:none;display:flex}.label{overflow-wrap:break-word;flex:auto;min-width:0}.icon{width:var(--arq-icon-md);height:var(--arq-icon-md);color:var(--arq-color-icon-primary);flex:none}:host([emphasis=featured]) .row{padding:calc(var(--arq-space-padding-md) - var(--arq-border-default)) calc(var(--arq-space-padding-lg) - var(--arq-border-default));border:var(--arq-border-default) solid var(--arq-color-border-strong)}@media (hover:hover) and (pointer:fine){:host(:not([emphasis=featured])) .row:hover .label{text-decoration:underline;text-decoration-thickness:var(--arq-border-default)}:host([emphasis=featured]) .row:hover{background:var(--arq-color-surface-faint)}}.row:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.row:focus:not(:focus-visible){outline:none}";
(class extends F {
	static tag = "arq-download-item";
	static styles = Ei;
	static properties = {
		emphasis: {
			type: String,
			values: ["default", "featured"],
			default: "default"
		},
		href: { type: String }
	};
	static template = "<div class=\"slot-host\"></div>";
	#e = null;
	update(e) {
		if (this.emphasis === "featured" ? this.removeAttribute("role") : this.setAttribute("role", "listitem"), !e.has("href") && this.#e) return;
		let t = this.href ? "a" : "button";
		if (this.#e?.localName !== t) {
			let e = document.createElement(t);
			e.className = "row", e.innerHTML = `<span class="label role-body-xl"><slot></slot></span>${I("download")}`, t === "button" && (e.type = "button", e.addEventListener("click", () => this.emit("download", {}))), this.shadowRoot.querySelector(".slot-host").replaceChildren(e), this.#e = e;
		}
		this.href && (this.#e.setAttribute("href", this.href), this.#e.setAttribute("download", ""));
	}
	focus(e) {
		this.#e ? this.#e.focus(e) : super.focus(e);
	}
}).define();
//#endregion
//#region src/components/download-file-row/download-file-row.css?inline
var Di = ":host{min-width:0;display:block}.row{box-sizing:border-box;align-items:center;gap:var(--arq-space-gap-md);width:100%;padding:var(--arq-space-padding-md) 0 calc(var(--arq-space-padding-md) - var(--arq-border-default));border:0;border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle);border-radius:var(--arq-radius-control);background:var(--arq-color-surface-transparent);color:var(--arq-color-text-primary);font:inherit;text-align:start;cursor:pointer;-webkit-tap-highlight-color:var(--arq-color-surface-transparent);margin:0;text-decoration:none;display:flex}.info{gap:var(--arq-space-gap-xs);flex-direction:column;flex:auto;min-width:0;display:flex}.label{color:var(--arq-color-text-primary);overflow-wrap:break-word}.meta{color:var(--arq-color-text-tertiary)}.icon{width:var(--arq-icon-md);height:var(--arq-icon-md);color:var(--arq-color-icon-primary);flex:none}@media (hover:hover) and (pointer:fine){.row:hover .label{text-decoration:underline;text-decoration-thickness:var(--arq-border-default)}}.row:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.row:focus:not(:focus-visible){outline:none}";
(class extends F {
	static tag = "arq-download-file-row";
	static styles = Di;
	static properties = {
		href: { type: String },
		loading: { type: Boolean }
	};
	static template = "<div class=\"slot-host\"></div>";
	#e = null;
	update(e) {
		this.setAttribute("role", "listitem"), (e.has("href") || !this.#e) && this.#t();
		let t = !(!this.loading || this.href);
		this.#e.toggleAttribute("aria-busy", t), this.#e.querySelector(".name").hidden = t, this.#e.querySelector(".busy").hidden = !t;
	}
	#t() {
		let e = this.href ? "a" : "button";
		if (this.#e?.localName !== e) {
			let t = document.createElement(e);
			t.className = "row", t.innerHTML = `<span class="info"><span class="label role-body-xl"><span class="name"><slot></slot></span><span class="busy" hidden>Generando…</span></span><span class="meta role-body-compact-regular"><slot name="meta"></slot></span></span>${I("download")}`;
			let n = t.querySelector("slot[name=\"meta\"]"), r = () => n.parentElement.hidden = !n.assignedNodes().length;
			n.addEventListener("slotchange", r), r(), e === "button" && (t.type = "button", t.addEventListener("click", () => {
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
var Oi = ":host{display:contents}.dialog{box-sizing:border-box;width:100%;max-width:none;height:100%;max-height:none;padding:var(--arq-layout-gutter);background:var(--arq-color-surface-transparent);color:var(--arq-color-text-primary);overscroll-behavior:contain;border:0;margin:0;position:fixed;inset:0;overflow-y:auto}.dialog[open]{flex-direction:column;display:flex}.dialog::backdrop{background:var(--arq-color-overlay-scrim)}:host{--panel-slow:var(--arq-motion-duration-panel)}.dialog::backdrop{opacity:0;transition:opacity var(--panel-slow) var(--arq-motion-easing-standard)}.dialog.is-open::backdrop{opacity:1}.dialog:not(.is-open){pointer-events:none}.dialog:not(.is-settled){overflow:clip}.sheet{opacity:0;transition-property:opacity,transform;transition-duration:var(--panel-slow);transition-timing-function:var(--arq-motion-easing-standard);transform:translateY(2%)}.dialog.is-open .sheet{opacity:1;transform:none}.sheet{box-sizing:border-box;gap:var(--arq-space-gap-2xl);width:var(--arq-layout-filter-panel);max-width:100%;padding:var(--arq-space-padding-xl-2xl);border:var(--arq-border-default) solid var(--arq-color-border-default);border-radius:var(--arq-radius-control);background:var(--arq-color-surface-default);flex-direction:column;flex:none;margin:auto 0 0 auto;display:flex}.header{justify-content:space-between;align-items:flex-start;gap:var(--arq-space-gap-md);display:flex}.title-wrap{gap:var(--arq-space-gap-sm);flex-direction:column;min-width:0;display:flex}.title{min-width:0;color:var(--arq-color-text-primary)}.content{gap:var(--arq-space-gap-md);flex-direction:column;display:flex}.list{flex-direction:column;display:flex}@media (width<=767px){.sheet{width:auto;margin-inline-start:0}}:host([show-product]) .sheet{gap:var(--arq-space-gap-xl)}.product{align-items:center;gap:var(--arq-space-gap-md);min-width:0;display:flex}.thumb{width:var(--arq-layout-download-thumb);height:var(--arq-layout-download-thumb);background:var(--arq-color-surface-subtle);flex:none;overflow:hidden}.thumb img{object-fit:cover;width:100%;height:100%;display:block}.product-info{gap:var(--arq-space-gap-xs);flex-direction:column;min-width:0;display:flex}.meta{color:var(--arq-color-text-tertiary)}:host([show-product]) .list{gap:var(--arq-space-gap-md);border-top:var(--arq-border-default) solid var(--arq-color-border-subtle)}@media (width<=767px){:host([show-product]) .dialog{padding:var(--arq-space-0)}:host([show-product]) .sheet{width:100%;padding:var(--arq-space-padding-lg) var(--arq-layout-gutter) calc(var(--arq-space-padding-xl) + env(safe-area-inset-bottom,var(--arq-space-0)));border-inline:0;opacity:1;border-bottom:0;margin:auto 0 0;transform:translateY(100%)}:host([show-product]) .dialog.is-open .sheet{transform:none}}@media (prefers-reduced-motion:reduce){.sheet,:host([show-product]) .sheet{opacity:0;transition-property:opacity,transform;transition-duration:var(--arq-motion-duration-fade), 0s;transition-timing-function:var(--arq-motion-easing-out);transform:none}.dialog.is-open .sheet,:host([show-product]) .dialog.is-open .sheet{opacity:1}.dialog::backdrop{transition:opacity var(--arq-motion-duration-fade) var(--arq-motion-easing-out)}}";
(class extends F {
	static tag = "arq-download-modal";
	static styles = Oi;
	static properties = {
		open: { type: Boolean },
		sku: { type: String },
		showProduct: { type: Boolean },
		thumb: { type: String },
		meta: { type: String }
	};
	static template = "<dialog class=\"dialog\" data-arq-theme=\"light\"><div class=\"sheet\"><div class=\"header\"><div class=\"title-wrap\"><div class=\"title role-heading-1\"><slot name=\"title\"></slot></div><arq-sku class=\"sku\" size=\"compact\" hidden></arq-sku></div><arq-icon-button icon=\"close\" size=\"large\" class=\"close\">Cerrar descargas</arq-icon-button></div><div class=\"product\" hidden><span class=\"thumb\"><img alt=\"\" hidden></span><span class=\"product-info\"><arq-sku class=\"product-sku\" size=\"compact\"></arq-sku><span class=\"meta role-body-compact-regular\"></span></span></div><div class=\"content\"><div class=\"featured\"><slot name=\"featured\"></slot></div><div class=\"list\" role=\"list\"><slot></slot></div></div></div></dialog>";
	#e = null;
	#t = null;
	#n = null;
	setup() {
		this.#e = this.shadowRoot.querySelector("dialog");
		let e = this.shadowRoot.querySelector(".thumb img");
		e.addEventListener("error", () => e.hidden = !0), e.addEventListener("load", () => e.hidden = !1), R(this.#e), this.shadowRoot.querySelector(".close").addEventListener("click", () => this.close()), this.#e.addEventListener("click", (e) => {
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
			e.textContent = this.sku ?? "", e.hidden = !this.sku || this.showProduct, this.shadowRoot.querySelector(".product-sku").textContent = this.sku ?? "", this.shadowRoot.querySelector(".product").hidden = !this.showProduct;
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
var ki = ":host{min-width:0;display:flex}.link{align-items:center;gap:var(--arq-space-gap-sm);min-width:0;padding-block:var(--arq-space-padding-xs);color:var(--arq-color-text-secondary);-webkit-tap-highlight-color:var(--arq-color-surface-transparent);padding-inline-start:var(--arq-space-padding-sm-md);text-decoration:none;display:inline-flex}.label{overflow-wrap:break-word;min-width:0}.indicator{width:var(--arq-space-gap-sm-md);height:var(--arq-border-default);background:var(--arq-color-text-primary);transition-property:background-color;transition-duration:var(--arq-theme-text-duration,var(--arq-motion-duration-fast));transition-delay:var(--arq-theme-text-delay,0s);flex:none;display:none}:host([size=large]) .link{color:var(--arq-color-text-tertiary)}@media (hover:hover) and (pointer:fine){.link:hover{color:var(--arq-color-text-primary)}}:host([selected]) .link{color:var(--arq-color-text-primary)}:host([selected]) .indicator{display:block}.link:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.link:focus:not(:focus-visible){outline:none}";
(class extends F {
	static tag = "arq-catalog-nav-item";
	static styles = ki;
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
var Ai = ":host{min-width:0;display:block}.group:after{content:\"\";border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle);display:block}.header{box-sizing:border-box;width:100%;padding:var(--arq-space-padding-md) 0;background:var(--arq-color-surface-transparent);color:var(--arq-color-text-secondary);font:inherit;text-align:start;cursor:pointer;-webkit-tap-highlight-color:var(--arq-color-surface-transparent);border:0;justify-content:space-between;align-items:center;margin:0;display:flex}:host([open]) .header{padding-bottom:var(--arq-space-gap-md);color:var(--arq-color-text-primary)}.label{overflow-wrap:break-word;min-width:0}.icon-box{padding:var(--arq-space-padding-xs);border-radius:var(--arq-radius-control);background:var(--arq-color-surface-transparent);color:var(--arq-color-icon-primary);flex:none;display:inline-flex}.icon{width:var(--arq-icon-md);height:var(--arq-icon-md);transition:rotate var(--arq-motion-duration-expand) var(--arq-motion-easing-standard)}:host([open]) .icon{rotate:180deg}@media (hover:hover) and (pointer:fine){.header:hover .icon-box{background:var(--arq-color-surface-hover)}}.items-inner{padding-inline-start:var(--arq-space-padding-lg);padding-bottom:calc(var(--arq-space-padding-md) + var(--arq-space-padding-xs))}.rail{border-inline-start:var(--arq-border-default) solid var(--arq-color-border-subtle);flex-direction:column;align-items:flex-start;display:flex}.header:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.header:focus:not(:focus-visible){outline:none}";
(class extends F {
	static tag = "arq-catalog-nav-group";
	static styles = Ai;
	static properties = {
		open: { type: Boolean },
		selected: { type: Boolean }
	};
	static template = `<div class="group"><button type="button" class="header"><span class="label role-body-xl"><slot name="label"></slot></span><span class="icon-box">${I("chevron-down")}</span></button><div class="items" part="panel"><div class="items-clip"><div class="items-inner"><div class="rail" role="list"><slot></slot></div></div></div></div></div>`;
	#e = !1;
	setup() {
		let e = this.shadowRoot.querySelector(".header"), t = null;
		e.addEventListener("click", () => {
			t = this.getBoundingClientRect().height;
		}), this.disclosure = new L(this, {
			trigger: e,
			panel: this.shadowRoot.querySelector(".items")
		}), this.addEventListener("arq:toggle", (e) => {
			e.target === this && (this.#t(t), t = null);
		});
		let n = () => this.#n();
		this.shadowRoot.querySelector("slot:not([name])").addEventListener("slotchange", n), new MutationObserver(n).observe(this, {
			subtree: !0,
			attributes: !0,
			attributeFilter: ["selected"]
		}), n();
	}
	#t(e) {
		if (e === null) return;
		let t = getComputedStyle(this), n = Number.parseFloat(t.getPropertyValue("--arq-motion-duration-expand")) || 0, r = e - this.getBoundingClientRect().height;
		if (!n || !r) return;
		let i = {
			duration: n,
			easing: t.getPropertyValue("--arq-motion-easing-standard").trim() || "ease-out"
		}, a = [{ transform: `translateY(${r}px)` }, { transform: "none" }], o = this.shadowRoot.querySelector(".group"), s = this.shadowRoot.querySelector(".items"), c = [];
		for (let e = this.nextElementSibling; e; e = e.nextElementSibling) c.push(e);
		for (let e of [
			o,
			s,
			...c
		]) e.getAnimations().forEach((e) => e.cancel());
		o.animate(a, {
			...i,
			pseudoElement: "::after"
		});
		for (let e of c) e.animate(a, i);
		this.open && s.animate([{ clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0)" }], i);
	}
	#n() {
		let e = !!this.querySelector(":scope > arq-catalog-nav-item[selected]");
		e && !this.selected ? (this.#e = !0, this.selected = !0) : !e && this.selected && this.#e && (this.#e = !1, this.selected = !1);
	}
}).define();
//#endregion
//#region src/components/catalog-nav/catalog-nav.css?inline
var ji = ":host{min-width:0;display:block}.nav{background:var(--arq-color-surface-transparent)}.trigger{display:none}.panel,.panel[hidden]{display:block!important}@media (width<=1023px){.panel,.panel[hidden]{padding-inline:var(--arq-space-padding-md)}.nav{border-block:var(--arq-border-default) solid var(--arq-color-border-default)}.panel[hidden]{display:none!important}.trigger{box-sizing:border-box;justify-content:space-between;align-items:center;gap:var(--arq-space-gap-md);width:100%;padding:var(--arq-space-padding-md);background:var(--arq-color-surface-transparent);color:var(--arq-color-text-primary);font:inherit;text-align:start;cursor:pointer;-webkit-tap-highlight-color:var(--arq-color-surface-transparent);border:0;margin:0;display:flex}:host([open]) .trigger{background:var(--arq-color-surface-faint)}@media (hover:hover) and (pointer:fine){.trigger:hover{background:var(--arq-color-surface-faint)}:host(:not([open])) .trigger:hover .icon-box{background:var(--arq-color-surface-hover)}}.trigger:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.trigger:focus:not(:focus-visible){outline:none}}.current{align-items:center;gap:var(--arq-space-gap-sm);min-width:0;display:inline-flex}.current-label{overflow-wrap:break-word;min-width:0}.indicator{width:var(--arq-space-gap-sm-md);height:var(--arq-border-default);background:var(--arq-color-text-primary);flex:none}.icon-box{padding:var(--arq-space-padding-xs);border-radius:var(--arq-radius-control);background:var(--arq-color-surface-transparent);color:var(--arq-color-icon-primary);flex:none;display:inline-flex}:host([open]) .icon-box{background:var(--arq-color-surface-default)}.icon{width:var(--arq-icon-md);height:var(--arq-icon-md)}:host(:not([open])) [data-icon=minus],:host([open]) [data-icon=plus]{display:none}";
(class extends F {
	static tag = "arq-catalog-nav";
	static styles = ji;
	static properties = {
		open: { type: Boolean },
		label: {
			type: String,
			default: "Categorías"
		}
	};
	static template = `<nav class="nav"><button type="button" class="trigger"><span class="current"><span class="indicator" aria-hidden="true"></span><span class="current-label role-body-regular"></span></span><span class="icon-box">${I("plus")}${I("minus")}</span></button><div class="panel" part="panel"><slot></slot></div></nav>`;
	setup() {
		this.disclosure = new L(this, {
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
			e.target.localName === "arq-catalog-nav-group" && (this.#i = !0);
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
var Mi = ":host{vertical-align:middle;max-width:100%;display:inline-flex}.toggle{align-items:center;gap:var(--arq-space-gap-sm);cursor:pointer;max-width:100%;display:inline-flex;position:relative}.track{box-sizing:border-box;width:calc(var(--arq-space-padding-2xs) * 2 + var(--arq-icon-sm) * 2 + var(--arq-space-gap-sm));height:calc(var(--arq-space-padding-2xs) * 2 + var(--arq-icon-sm));padding:calc(var(--arq-space-padding-2xs) - var(--arq-border-default));border:var(--arq-border-default) solid var(--arq-color-border-strong);border-radius:var(--arq-radius-pill);background:var(--arq-color-surface-transparent);flex:none;align-items:center;display:inline-flex}.thumb{width:var(--arq-icon-sm);height:var(--arq-icon-sm);border-radius:var(--arq-radius-pill);background:var(--arq-color-icon-primary);transition-property:transform,color,background-color,border-color,outline-color,text-decoration-color,fill,stroke}.label{min-width:0;color:var(--arq-color-text-primary)}.native:checked+.track{border-color:var(--arq-color-action-primary);background:var(--arq-color-action-primary)}.native:checked+.track .thumb{background:var(--arq-color-action-on-primary);transform:translateX(calc(var(--arq-icon-sm) + var(--arq-space-gap-sm)))}:host([disabled]) .toggle{cursor:default}:host([disabled]) .track{border-color:var(--arq-color-border-disabled);background:var(--arq-color-surface-transparent)}:host([disabled]) .native:checked+.track{border-color:var(--arq-color-border-disabled);background:var(--arq-color-surface-strong)}:host([disabled]) .thumb,:host([disabled]) .native:checked+.track .thumb{background:var(--arq-color-icon-disabled)}:host([disabled]) .label{color:var(--arq-color-text-disabled)}.native:focus-visible+.track{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}";
(class extends F {
	static tag = "arq-toggle";
	static styles = Mi;
	static formAssociated = !0;
	static properties = {
		checked: { type: Boolean },
		disabled: { type: Boolean },
		showLabel: { type: Boolean },
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
		this.#t.checked = this.checked, this.#t.disabled = this.disabled, this.shadowRoot.querySelector(".label").classList.toggle("visually-hidden", !this.showLabel), this.#e.setFormValue(this.checked ? this.value : null);
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
var Ni = ":host{min-width:0;display:block}.bar{justify-content:space-between;align-items:center;gap:var(--arq-space-gap-md);padding-block:var(--arq-space-padding-md);border-block:var(--arq-border-default) solid var(--arq-color-border-subtle);background:var(--arq-color-surface-transparent);transition:border-top-color var(--arq-motion-duration-fast) var(--arq-motion-easing-standard);display:flex}:host([stuck]) .bar{border-top-color:var(--arq-color-surface-transparent)}.count{min-width:0;color:var(--arq-color-text-secondary);white-space:nowrap;margin:0}.actions{align-items:center;gap:var(--arq-space-gap-xl);flex:none;display:flex}.lead{align-items:stretch;gap:var(--arq-space-gap-xl);display:flex}@media (width<=767px){.actions,.lead{gap:var(--arq-space-gap-lg)}}", Pi = {
	productos: ["producto", "productos"],
	colecciones: ["colección", "colecciones"]
}, Fi = new Intl.NumberFormat("es-AR");
(class extends F {
	static tag = "arq-catalog-toolbar";
	static styles = Ni;
	static properties = {
		count: { type: Number },
		unit: {
			type: String,
			values: ["productos", "colecciones"],
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
		let [e, t] = Pi[this.unit] ?? Pi.productos, n = this.shadowRoot.querySelector(".count");
		n.textContent = Number.isFinite(this.count) ? `${Fi.format(this.count)} ${this.count === 1 ? e : t}` : "";
	}
	#i() {
		let e = Number.isFinite(this.filterCount) ? this.filterCount : 0, t = this.#n;
		t.showCount = e > 0, t.count = e > 0 ? e : null, t.icon = e > 0 ? "filter-off" : "filter";
	}
	#a(e) {
		let t = document.documentElement, n = this.#t.getBoundingClientRect();
		Si(e, () => {
			e ? t.setAttribute("data-arq-theme", "dark") : t.removeAttribute("data-arq-theme"), ci(e);
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
var Ii = ":host{min-width:0;display:block}.card{gap:var(--arq-space-gap-md);flex-direction:column;display:flex}.card.is-small{gap:var(--arq-space-gap-sm)}.card-media{aspect-ratio:var(--card-ratio,7 / 10);background:var(--arq-color-surface-subtle);transition-property:background-color;transition-delay:0s;transition-duration:var(--arq-illumination-bg-duration,var(--arq-motion-duration-fast));transition-timing-function:var(--arq-illumination-bg-easing,var(--arq-motion-easing-standard));position:relative}@media (hover:hover) and (pointer:fine){.card:has(.card-link:hover) .card-media{outline:none}}.img{object-fit:cover;visibility:hidden;width:100%;height:100%;position:absolute;inset:0}.theme-transition{z-index:1;object-fit:cover;opacity:1;pointer-events:none;width:100%;height:100%;transition-property:opacity;transition-duration:var(--arq-illumination-image-duration,var(--arq-motion-duration-slow));transition-timing-function:var(--arq-illumination-image-easing,var(--arq-motion-easing-standard));position:absolute;inset:0}.theme-transition.fade-out{opacity:0}.img.loaded{visibility:visible}.hover{opacity:0;transition-property:opacity,color,background-color,border-color,outline-color,text-decoration-color,fill,stroke;transition-duration:var(--arq-motion-duration-slow);transition-timing-function:var(--arq-motion-easing-standard)}.card.has-hover:has(.card-link:focus-visible) .hover{opacity:1}@media (hover:hover) and (pointer:fine){.card.has-hover.is-media-hover .hover{opacity:1}}.fallback{padding:var(--arq-space-padding-md);color:var(--arq-color-text-secondary);text-align:center;overflow-wrap:break-word;justify-content:center;align-items:center;display:flex;position:absolute;inset:0}.info{align-items:flex-start;gap:var(--arq-space-gap-xs);padding-top:var(--arq-space-gap-xs);padding-bottom:var(--arq-space-gap-sm);flex-direction:column;display:flex}.title{align-items:center;gap:var(--arq-space-gap-sm);align-self:stretch;display:flex}.name{min-width:0;color:var(--arq-color-text-primary);overflow-wrap:break-word;flex:auto}.is-small .info{gap:var(--arq-space-gap-md)}.is-small .title{flex-direction:column;align-items:flex-start}.is-small .finishes{gap:var(--arq-space-gap-sm)}.finishes{z-index:var(--card-above);align-items:center;gap:var(--arq-space-gap-xs);flex:none;display:flex;position:relative}.meta{-webkit-line-clamp:2;color:var(--arq-color-text-secondary);overflow-wrap:break-word;-webkit-box-orient:vertical;margin:0;display:-webkit-box;overflow:hidden}.meta[hidden]{display:none}.compare{z-index:var(--card-above);position:relative}", Li = matchMedia("(max-width: 767px)");
function Ri(e, t = []) {
	for (let n of t) {
		let t = document.createElement("arq-swatch");
		t.slot = "finishes", t.textContent = n.name, n.src && (t.src = n.src), n.selected && t.setAttribute("selected", "");
		for (let e of zi) n[e] && (t.dataset[e] = n[e]);
		e.append(t);
	}
}
var zi = [
	"sku",
	"href",
	"image",
	"imageHover",
	"imageLit",
	"imageHoverLit"
];
(class extends F {
	static tag = "arq-product-card";
	static styles = W + Ii;
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
		imageHoverLit: { type: String }
	};
	static template = "<div class=\"card\"><div class=\"card-media\"><img class=\"img base\" alt=\"\" loading=\"lazy\" decoding=\"async\"><img class=\"img hover\" alt=\"\" decoding=\"async\"><span class=\"fallback role-body-sm\" aria-hidden=\"true\"></span></div><div class=\"info\"><div class=\"title\"><a class=\"card-link name\"><slot name=\"name\"></slot></a><span class=\"finishes\" hidden><slot name=\"finishes\"></slot></span></div><p class=\"meta\" hidden><slot name=\"meta\"></slot></p><arq-checkbox class=\"compare\" show-label hidden>Comparar</arq-checkbox></div></div>";
	#e = !1;
	#t = !1;
	#n = 0;
	setup() {
		let e = this.shadowRoot;
		for (let t of e.querySelectorAll(".img")) t.addEventListener("load", () => t.classList.add("loaded")), t.addEventListener("error", () => {
			t.classList.remove("loaded"), t.classList.contains("base") && this.#m(!0);
		});
		let t = () => {
			this.#t || (this.#t = !0, this.#u());
		}, n = e.querySelector(".card");
		n.addEventListener("pointerenter", t), e.querySelector(".card-link").addEventListener("focus", t);
		let r = e.querySelector(".card-media"), i = (e) => n.classList.toggle("is-media-hover", e);
		n.addEventListener("pointermove", (e) => {
			if (e.pointerType !== "mouse") return;
			let t = r.getBoundingClientRect();
			i(e.clientX >= t.left && e.clientX < t.right && e.clientY >= t.top && e.clientY < t.bottom);
		}), n.addEventListener("pointerleave", () => i(!1));
		for (let t of [
			"name",
			"meta",
			"finishes"
		]) e.querySelector(`slot[name="${t}"]`).addEventListener("slotchange", () => this.#a());
		let a = e.querySelector(".finishes");
		a.addEventListener("click", (e) => this.#l(e.target.closest?.("arq-swatch"))), a.addEventListener("keydown", (e) => this.#c(e)), e.querySelector(".compare").addEventListener("arq:change", (e) => {
			e.stopPropagation(), this.compared = e.detail.checked, this.emit("compare", { checked: e.detail.checked });
		}), Li.addEventListener("change", () => this.#i()), ni(this, "themeChanged");
	}
	themeChanged(e) {
		let t = this.shadowRoot, n = t.querySelector(".base"), r = t.querySelector(".hover"), i = Number.parseFloat(getComputedStyle(r).opacity) > .5 && r.classList.contains("loaded"), a = i ? r : n, o = a.naturalWidth ? a.currentSrc || a.getAttribute("src") : null, s = i ? e && this.imageHoverLit || this.imageHover : e && this.imageLit || this.image, c = o && s && o !== new URL(s, location.href).href ? this.#f(t.querySelector(".card-media"), o) : null;
		this.#e = e, this.#u(), bi(a), c && yi(a).then(() => this.#p(c));
	}
	update(e) {
		let t = this.shadowRoot;
		if (e.has("href")) {
			let e = t.querySelector(".card-link");
			this.href ? e.setAttribute("href", this.href) : e.removeAttribute("href");
		}
		let n = t.querySelector(".compare");
		n.hidden = !this.showCompare, n.checked = this.compared, e.has("size") && this.#i(), [...e].some((e) => e.startsWith("image")) && this.#u(), this.#a();
	}
	#r() {
		return this.size === "small" || Li.matches;
	}
	#i() {
		let e = this.#r(), t = this.shadowRoot;
		t.querySelector(".card").classList.toggle("is-small", e);
		let n = e ? Li.matches ? "role-heading-3" : "role-body-xl" : "role-heading-3";
		t.querySelector(".name").className = `card-link name ${n}`, t.querySelector(".meta").className = `meta ${e ? "role-body-sm" : "role-body"}`;
		for (let e of this.querySelectorAll(":scope > arq-swatch[slot=\"finishes\"]")) e.setAttribute("size", "small");
	}
	#a() {
		let e = this.shadowRoot, t = (t) => e.querySelector(`slot[name="${t}"]`).assignedNodes({ flatten: !0 }).some((e) => e.nodeType === Node.ELEMENT_NODE || e.textContent.trim());
		e.querySelector(".meta").hidden = !t("meta"), e.querySelector(".finishes").hidden = !t("finishes"), this.#s(), e.querySelector(".fallback").textContent = this.querySelector("[slot=\"name\"]")?.textContent.trim() ?? "", this.#i();
	}
	#o() {
		return [...this.querySelectorAll(":scope > arq-swatch[slot=\"finishes\"]")];
	}
	#s() {
		let e = this.#o(), t = this.shadowRoot.querySelector(".finishes");
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
	#c(e) {
		let t = {
			ArrowRight: 1,
			ArrowDown: 1,
			ArrowLeft: -1,
			ArrowUp: -1
		}, n = this.#o(), r = n.indexOf(e.target.closest?.("arq-swatch"));
		if (r !== -1) {
			if (e.key === "Enter" || e.key === " ") e.preventDefault(), this.#l(n[r]);
			else if (t[e.key]) {
				e.preventDefault();
				let i = n[(r + t[e.key] + n.length) % n.length];
				i.focus(), this.#l(i);
			}
		}
	}
	#l(e) {
		if (!e || e.getAttribute("role") !== "radio" || e.hasAttribute("selected")) return;
		for (let t of this.#o()) {
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
	#u() {
		let e = this.shadowRoot, t = e.querySelector(".base"), n = e.querySelector(".hover"), r = this.#e && this.imageLit || this.image, i = this.#e && this.imageHoverLit || this.imageHover;
		this.#d(t, r), this.#m(!r), e.querySelector(".card").classList.toggle("has-hover", !!(r && i)), this.#d(n, this.#t ? i : null);
		let a = this.#e ? this.image : this.imageLit;
		r && a && a !== r && (new Image().src = a);
	}
	#d(e, t) {
		e.getAttribute("src") !== (t ?? null) && (e.classList.remove("loaded"), t ? e.src = t : e.removeAttribute("src"));
	}
	#f(e, t) {
		e.querySelector(".theme-transition")?.remove();
		let n = document.createElement("img");
		return n.className = "theme-transition", n.src = t, n.alt = "", n.setAttribute("aria-hidden", "true"), e.append(n), n;
	}
	#p(e) {
		if (!e.isConnected) return;
		e.addEventListener("transitionend", (t) => {
			t.propertyName === "opacity" && e.remove();
		}, { once: !0 }), e.offsetWidth, e.classList.add("fade-out");
		let t = getComputedStyle(e).transitionDuration.split(",")[0];
		Number.parseFloat(t) || e.remove();
	}
	#m(e) {
		this.shadowRoot.querySelector(".fallback").hidden = !e;
	}
}).define();
//#endregion
//#region src/components/compare-slot/compare-slot.css?inline
var Bi = ":host{min-width:0;display:block}.slot{align-items:center;gap:var(--arq-space-gap-sm-md);max-width:var(--arq-layout-compare-slot);display:flex;position:relative}.thumb{width:var(--arq-layout-compare-thumb);height:var(--arq-layout-compare-thumb);background:var(--arq-color-surface-subtle);flex:none;justify-content:center;align-items:center;display:flex;position:relative;overflow:hidden}.thumb img{object-fit:cover;width:100%;height:100%;position:absolute;inset:0}.icon{width:var(--arq-icon-md);height:var(--arq-icon-md);color:var(--arq-color-icon-primary)}:host([filled]) .icon{display:none}.info{gap:var(--arq-space-gap-xs);flex-direction:column;flex:auto;min-width:0;display:flex}.name{color:var(--arq-color-text-primary);overflow-wrap:break-word}.meta,.empty{color:var(--arq-color-text-secondary);overflow-wrap:break-word}:host(:not([filled])) .name,:host(:not([filled])) .meta,.empty:empty{display:none}.remove{flex:none}.add{border-radius:var(--arq-radius-control);background:var(--arq-color-surface-transparent);cursor:pointer;border:0;margin:0;padding:0;position:absolute;inset:0}.add:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.add:focus:not(:focus-visible){outline:none}:host(:not([filled])) .slot{border:var(--arq-border-default) dashed var(--arq-color-border-default);padding-inline-end:var(--arq-space-padding-md)}:host(:not([filled])) .add:focus-visible{outline-offset:calc(-1 * var(--arq-border-strong))}@media (hover:hover) and (pointer:fine){:host(:not([filled])) .slot:hover{background:var(--arq-color-surface-faint);border-color:var(--arq-color-border-strong)}}";
(class extends F {
	static tag = "arq-compare-slot";
	static styles = Bi;
	static properties = {
		filled: { type: Boolean },
		image: { type: String },
		sku: { type: String },
		emptyLabel: {
			type: String,
			default: "Agregar producto"
		}
	};
	static template = `<div class="slot"><span class="thumb"><img alt="" hidden>${I("plus")}</span><span class="info"><span class="name role-label"><slot name="name"></slot></span><span class="meta role-body-sm"><slot name="meta"></slot></span><span class="empty role-body-sm"></span></span><arq-icon-button icon="close" class="remove"></arq-icon-button><button type="button" class="add" hidden></button></div>`;
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
	}
}).define();
//#endregion
//#region src/components/compare-bar/compare-bar.css?inline
var Vi = ":host{display:contents}.bar{z-index:3;box-sizing:border-box;gap:var(--arq-space-gap-md);padding:var(--arq-space-padding-md) var(--page-gutter) calc(var(--arq-space-padding-md) + env(safe-area-inset-bottom,var(--arq-space-0)));border-top:var(--arq-border-default) solid var(--arq-color-border-default);background:var(--arq-color-surface-default);color:var(--arq-color-text-primary);flex-direction:column;display:flex;position:fixed;inset:auto 0 0}.bar.animate{transition-property:transform,display;transition-duration:var(--arq-motion-duration-panel);transition-timing-function:var(--arq-motion-easing-standard);transition-behavior:allow-discrete}.bar.animate[hidden]{transform:translateY(100%)}@starting-style{.bar.animate{transform:translateY(100%)}}.bar:after{content:\"\";background:inherit;pointer-events:none;height:100svh;position:absolute;inset:100% 0 auto}@media (prefers-reduced-motion:reduce){.bar.animate{transition-property:opacity,display;transition-duration:var(--arq-motion-duration-fade)}.bar.animate[hidden]{opacity:0;transition-duration:var(--arq-motion-duration-fade);transform:none}@starting-style{.bar.animate{opacity:0;transform:none}}}.head{justify-content:space-between;align-items:center;gap:var(--arq-space-gap-md);display:flex}.title{align-items:center;gap:var(--arq-space-gap-sm);margin:0;display:inline-flex}.row{justify-content:space-between;align-items:center;gap:var(--arq-space-gap-2xl);display:flex}.slots{align-items:stretch;gap:var(--arq-space-gap-lg);flex:auto;min-width:0;display:flex}.slots arq-compare-slot{flex:1 1 0;min-width:0}.actions{align-items:center;gap:var(--arq-space-gap-xl);flex:none;display:flex}.clear-mobile{display:none}.toggle{flex:auto}.toggle .icon-box{margin-inline-start:auto}:host(:not([open])) .bar{align-items:center;display:grid}:host(:not([open])) .head,:host(:not([open])) .row{grid-area:1/1}:host(:not([open])) .row{z-index:1;justify-self:end;margin-inline-end:calc(var(--arq-icon-md) + 2 * var(--arq-space-padding-xs) + var(--arq-space-gap-xl));position:relative}.toggle{align-items:center;gap:var(--arq-space-gap-sm);background:var(--arq-color-surface-transparent);color:inherit;font:inherit;text-align:start;cursor:pointer;-webkit-tap-highlight-color:var(--arq-color-surface-transparent);border:0;margin:0;padding:0;display:inline-flex}.icon-box{padding:var(--arq-space-padding-xs);border-radius:var(--arq-radius-control);background:var(--arq-color-surface-transparent);color:var(--arq-color-icon-primary);flex:none;display:inline-flex}.icon-box svg{width:var(--arq-icon-md);height:var(--arq-icon-md)}:host(:not([open])) [data-icon=chevron-down],:host([open]) [data-icon=chevron-up]{display:none}@media (hover:hover) and (pointer:fine){.toggle:hover .icon-box{background:var(--arq-color-surface-hover)}}.toggle:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.toggle:focus:not(:focus-visible){outline:none}@media (width<=767px){.bar{gap:var(--arq-space-gap-sm-md);padding-bottom:calc(var(--arq-space-padding-lg) + env(safe-area-inset-bottom,var(--arq-space-0)));border-top-color:var(--arq-color-border-subtle)}.clear-mobile{display:inline-flex}.clear-desktop{display:none}.toggle{flex:none}.toggle .icon-box{margin-inline-start:0}:host(:not([open])) .bar{align-items:stretch;display:flex}:host(:not([open])) .row{justify-self:auto;margin-inline-end:0}.row{align-items:stretch;gap:var(--arq-space-gap-md);flex-direction:column}.slots{gap:var(--arq-space-gap-sm);flex-direction:column;flex:none}.slots arq-compare-slot{flex:none}.actions,.go{flex:auto}}@media print{:host{display:none}}", Hi = "arq:compare", Ui = 3, Wi = matchMedia("(max-width: 767px)");
function Gi() {
	try {
		let e = JSON.parse(localStorage.getItem(Hi) ?? "[]");
		return Array.isArray(e) ? e.filter((e) => e && e.sku).slice(0, Ui) : [];
	} catch {
		return [];
	}
}
function Ki(e) {
	try {
		localStorage.setItem(Hi, JSON.stringify(e));
	} catch {}
}
(class extends F {
	static tag = "arq-compare-bar";
	static styles = Vi;
	static properties = {
		href: {
			type: String,
			default: "/arq/comparativa"
		},
		open: { type: Boolean }
	};
	static template = `<section class="bar" data-arq-theme="dark" aria-label="Comparar productos" hidden><div class="head"><button class="title toggle role-body-lg"><span>Productos seleccionados</span><arq-count-badge class="count"></arq-count-badge><span class="icon-box">${I("chevron-down")}${I("chevron-up")}</span></button><arq-button type="underline" show-underline class="clear clear-mobile">Borrar todo</arq-button></div><div class="row"><div class="slots"></div><div class="actions"><arq-button type="underline" show-underline class="clear clear-desktop">Borrar todo</arq-button><arq-button class="go" show-icon icon="arrow-right">Comparar</arq-button></div></div></section>`;
	#e = Gi();
	get items() {
		return [...this.#e];
	}
	set items(e) {
		this.#e = (Array.isArray(e) ? e : []).filter((e) => e && e.sku).slice(0, Ui), this.#n();
	}
	setup() {
		let e = this.shadowRoot;
		this.open = !0, this.disclosure = new L(this, {
			trigger: e.querySelector(".toggle"),
			panel: e.querySelector(".slots")
		});
		let t = null;
		e.querySelector(".toggle").addEventListener("click", () => {
			t = e.querySelector(".bar").getBoundingClientRect().top;
		}, { capture: !0 }), this.addEventListener("arq:toggle", () => this.#t(t));
		for (let t of e.querySelectorAll(".clear")) t.addEventListener("click", () => this.clear());
		e.querySelector(".slots").addEventListener("arq:remove", (e) => {
			e.stopPropagation(), this.remove(e.detail.sku);
		}), Wi.addEventListener("change", () => this.#r()), addEventListener("storage", (e) => {
			e.key === Hi && (this.#e = Gi(), this.#r(), this.emit("compare-change", { items: this.items }));
		}), this.#r(), requestAnimationFrame(() => requestAnimationFrame(() => e.querySelector(".bar").classList.add("animate")));
	}
	update(e) {
		e.has("href") && this.#r();
	}
	add(e) {
		return !e?.sku || this.has(e.sku) || this.#e.length >= Ui ? !1 : (this.#e.push({
			sku: e.sku,
			name: e.name ?? "",
			meta: e.meta ?? "",
			image: e.image ?? ""
		}), this.open = !0, this.#n(), !0);
	}
	remove(e) {
		let t = this.#e.length;
		this.#e = this.#e.filter((t) => t.sku !== e), this.#e.length !== t && this.#n();
	}
	clear() {
		this.#e.length && (this.#e = [], this.#n());
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
	#t(e) {
		let t = this.shadowRoot.querySelector(".bar");
		if (e === null || t.hidden || !t.classList.contains("animate")) return;
		let n = getComputedStyle(t), r = Number.parseFloat(n.getPropertyValue("--arq-motion-duration-panel")) || 0;
		if (!r) return;
		t.getAnimations().forEach((e) => e.cancel());
		let i = e - t.getBoundingClientRect().top;
		i && t.animate([{ transform: `translateY(${i}px)` }, { transform: "none" }], {
			duration: r,
			easing: n.getPropertyValue("--arq-motion-easing-standard").trim() || "ease-out"
		});
	}
	#n() {
		Ki(this.#e), this.#r(), this.emit("compare-change", { items: this.items });
	}
	#r() {
		let e = this.shadowRoot;
		if (!e.querySelector(".bar")) return;
		let t = this.#e;
		e.querySelector(".bar").hidden = t.length === 0, e.querySelector(".count").count = t.length;
		let n = Wi.matches, r = e.querySelector(".slots"), i = [], a = n ? Math.min(t.length + 1, Ui) : Ui;
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
var qi = ":host{min-width:0;display:block}.item{align-items:center;gap:var(--arq-space-gap-md);padding:var(--arq-space-padding-md) var(--arq-space-padding-sm-md) calc(var(--arq-space-padding-md) - var(--arq-border-default));border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle);display:flex}@media (hover:hover) and (pointer:fine){:host(:not([added]):not([disabled])) .item:hover{background:var(--arq-color-surface-hover)}}.thumb{width:var(--arq-layout-search-thumb);height:var(--arq-layout-search-thumb);background:var(--arq-color-surface-subtle);flex:none;position:relative;overflow:hidden}.thumb img{object-fit:cover;width:100%;height:100%;position:absolute;inset:0}.info{gap:var(--arq-space-gap-xs);flex-direction:column;flex:auto;min-width:0;display:flex}.name,.meta{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.name{color:var(--arq-color-text-primary)}.meta{color:var(--arq-color-text-tertiary)}.action{flex:none}:host([disabled]) .name,:host([disabled]) .meta{color:var(--arq-color-text-disabled)}:host([disabled]) .thumb{opacity:var(--arq-opacity-disabled)}";
(class extends F {
	static tag = "arq-compare-picker-item";
	static styles = qi;
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
		}), e.querySelector("slot[name=\"name\"]").addEventListener("slotchange", () => this.#e()), this.hasAttribute("role") || this.setAttribute("role", "listitem");
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
	}
}).define();
//#endregion
//#region src/components/compare-picker/compare-picker.css?inline
var Ji = ":host{--panel-slow:var(--arq-motion-duration-panel);display:contents}.dialog{box-sizing:border-box;width:100%;max-width:none;height:100%;max-height:none;padding:var(--arq-layout-gutter);background:var(--arq-color-surface-transparent);color:var(--arq-color-text-primary);overscroll-behavior:contain;border:0;margin:0;position:fixed;inset:0;overflow:hidden}.dialog[open]{display:flex}.dialog::backdrop{background:var(--arq-color-overlay-scrim);opacity:0;transition:opacity var(--panel-slow) var(--arq-motion-easing-standard)}.dialog.is-open::backdrop{opacity:1}.dialog:not(.is-open){pointer-events:none}.sheet{box-sizing:border-box;gap:var(--arq-space-gap-lg);width:var(--arq-layout-filter-panel);max-width:100%;max-height:100%;padding:var(--arq-space-padding-xl-2xl);border:var(--arq-border-default) solid var(--arq-color-border-default);border-radius:var(--arq-radius-control);background:var(--arq-color-surface-default);opacity:0;transition-property:opacity,transform;transition-duration:var(--panel-slow);transition-timing-function:var(--arq-motion-easing-standard);flex-direction:column;margin:auto;display:flex;transform:translateY(2%)}.dialog.is-open .sheet{opacity:1;transform:none}.header{justify-content:space-between;align-items:flex-start;gap:var(--arq-space-gap-md);flex:none;display:flex}.title{min-width:0;color:var(--arq-color-text-primary)}.search{flex:none}.list,.empty{min-height:0;block-size:var(--arq-layout-compare-picker-list);flex:0 auto}.list{overscroll-behavior:contain;flex-direction:column;display:flex;overflow:hidden auto}.list>*{flex:none}.empty{justify-content:center;align-items:center;gap:var(--arq-space-gap-md);text-align:center;flex-direction:column;display:flex}.empty[hidden]{display:none}.empty p{margin:0}.empty-title{color:var(--arq-color-text-primary)}.empty-hint{color:var(--arq-color-text-tertiary)}.footer{flex:none;justify-content:flex-end;display:flex}@media (width<=767px){.dialog{padding:var(--arq-space-0)}.sheet{width:100%;max-width:none;height:100%;padding-bottom:calc(var(--arq-space-padding-xl-2xl) + env(safe-area-inset-bottom,var(--arq-space-0)));border:0}.list,.empty{flex:auto;block-size:auto}}@media (prefers-reduced-motion:reduce){.sheet{transition-property:opacity;transition-duration:var(--arq-motion-duration-fade);transition-timing-function:var(--arq-motion-easing-out);transform:none}.dialog::backdrop{transition:opacity var(--arq-motion-duration-fade) var(--arq-motion-easing-out)}}", Yi = 3, Xi = matchMedia("(hover: hover) and (pointer: fine)"), G = {
	noResults: (e) => e ? `No encontramos productos para «${e}».` : "No encontramos productos.",
	hint: "Probá con otro nombre, SKU o familia.",
	count: (e) => e === 1 ? "1 producto" : `${e} productos`,
	added: (e) => `${e} agregado a la comparación.`
};
(class extends F {
	static tag = "arq-compare-picker";
	static styles = Ji;
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
	static template = `<dialog class="dialog" data-arq-theme="light"><div class="sheet"><div class="header"><div class="title role-heading-2"><slot name="title">Agregar producto</slot></div><arq-icon-button icon="close" size="large" class="close">Cerrar</arq-icon-button></div><arq-search-field type="line" class="search" placeholder="Buscar por nombre, SKU o familia…" label="Buscar por nombre, SKU o familia"></arq-search-field><div class="list" role="list"></div><div class="empty" hidden><p class="empty-title role-body-regular"></p><p class="empty-hint role-body-compact">${G.hint}</p></div><div class="footer"><arq-button class="go" type="underline" show-underline show-icon icon="arrow-right">Ver todos los productos</arq-button></div><span class="visually-hidden" aria-live="polite"></span></div></dialog>`;
	#e = null;
	#t = null;
	#n = null;
	#r = [];
	#i = "";
	#a = !1;
	get items() {
		return [...this.#r];
	}
	set items(e) {
		this.#r = Array.isArray(e) ? e.filter((e) => e && e.sku) : [], this.#s();
	}
	get search() {
		return { query: this.#i };
	}
	setup() {
		let e = this.shadowRoot;
		this.#e = e.querySelector("dialog"), R(this.#e), e.querySelector(".close").addEventListener("click", () => this.close()), this.#e.addEventListener("click", (e) => {
			e.target === this.#e && this.close();
		}), this.#e.addEventListener("cancel", (e) => {
			e.preventDefault(), this.close();
		}), this.#e.addEventListener("keydown", (e) => {
			e.key === "Escape" && (e.preventDefault(), this.close());
		});
		let t = e.querySelector(".search");
		t.addEventListener("arq:input", (e) => {
			e.stopPropagation(), this.#i = e.detail.value.trim(), this.#o();
		}), t.addEventListener("arq:submit", (e) => e.stopPropagation()), t.addEventListener("arq:navigate", (e) => e.stopPropagation()), t.addEventListener("arq:close", (e) => e.stopPropagation()), e.querySelector(".list").addEventListener("arq:add", (e) => {
			e.stopPropagation();
			let t = this.#r.find((t) => t.sku === e.detail.sku);
			!t || t.added || this.count >= Yi || (this.emit("add", { item: { ...t } }), this.#c(G.added(t.name)));
		}), e.querySelector("slot[name=\"title\"]").addEventListener("slotchange", () => this.#f()), this.#f();
	}
	update(e) {
		e.has("count") && this.#s(), this.shadowRoot.querySelector(".go").href = this.href ?? "/arq/productos", e.has("open") && (this.open ? this.#l() : this.#e.open && this.#u());
	}
	show(e) {
		if (this.#t = e ?? this.#d(), !this.open) {
			let e = this.shadowRoot;
			this.#i = "", e.querySelector(".search").value = "", e.querySelector(".list").scrollTop = 0, this.#o({ announce: !1 });
		}
		this.open = !0;
	}
	close() {
		this.open = !1;
	}
	#o({ announce: e = !0 } = {}) {
		this.#a = e, this.emit("search", this.search);
	}
	#s() {
		let e = this.shadowRoot, t = e.querySelector(".list");
		if (!t) return;
		let n = (this.count ?? 0) >= Yi, r = this.#r.map((e) => {
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
		t.hidden = a, e.querySelector(".empty").hidden = !a, e.querySelector(".empty-title").textContent = a ? G.noResults(this.#i) : "", this.#a && (this.#a = !1, this.#c(a ? `${G.noResults(this.#i)} ${G.hint}` : G.count(r.length)));
	}
	#c(e) {
		let t = this.shadowRoot.querySelector("[aria-live]");
		t.textContent = "", requestAnimationFrame(() => t.textContent = e);
	}
	#l() {
		let e = this.#e;
		clearTimeout(this.#n), this.#n = null, e.open || (e.showModal(), e.offsetHeight, (Xi.matches ? this.shadowRoot.querySelector(".search") : this.shadowRoot.querySelector(".close")).focus({ preventScroll: !0 })), e.classList.add("is-open");
	}
	#u() {
		let e = this.#e;
		if (this.#n) return;
		e.classList.remove("is-open");
		let { transitionDuration: t } = getComputedStyle(this.shadowRoot.querySelector(".sheet")), n = Math.max(0, ...t.split(",").map((e) => (parseFloat(e) || 0) * (e.trim().endsWith("ms") ? 1 : 1e3)));
		this.#n = setTimeout(() => {
			this.#n = null, e.close();
			let t = this.#t;
			this.#t = null, t?.focus?.(), this.emit("close", { restored: !!t && this.#d() === t });
		}, n);
	}
	#d() {
		let e = document.activeElement;
		for (; e?.shadowRoot?.activeElement;) e = e.shadowRoot.activeElement;
		return e;
	}
	#f() {
		let e = this.shadowRoot.querySelector("slot[name=\"title\"]"), t = e.assignedNodes({ flatten: !0 }), n = (t.length ? t : [...e.childNodes]).map((e) => e.textContent).join("").trim();
		this.#e.setAttribute("aria-label", n || "Agregar producto");
	}
}).define();
//#endregion
//#region src/components/compare-product/compare-product.css?inline
var Zi = ":host{min-width:0;display:block}.product{gap:var(--arq-space-gap-lg);flex-direction:column;width:100%;height:100%;display:flex}.media{width:100%;max-width:var(--arq-layout-compare-media-max);aspect-ratio:1;background:var(--arq-color-surface-subtle);justify-content:center;align-items:center;display:flex;position:relative;overflow:hidden}.media img{object-fit:cover;width:100%;height:100%;position:absolute;inset:0}.remove{top:var(--arq-space-padding-sm-md);right:var(--arq-space-padding-sm-md);position:absolute}:host([empty]) .media{background:var(--arq-color-surface-transparent);border:var(--arq-border-default) dashed var(--arq-color-border-default);flex:auto}:host([empty]) .remove,:host([empty]) .info,:host([empty]) .selects{display:none}.add{all:unset;justify-content:center;align-self:stretch;align-items:center;gap:var(--arq-space-gap-sm-md);box-sizing:border-box;cursor:pointer;color:var(--arq-color-text-secondary);flex-direction:column;flex:auto;display:none}:host([empty]) .add{display:flex}.add-icon{padding:var(--arq-space-padding-sm-md);justify-content:center;align-items:center;display:flex}.add-icon .icon{width:var(--arq-icon-xl);height:var(--arq-icon-xl)}.add:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:calc(-1 * var(--arq-border-strong))}@media (hover:hover) and (pointer:fine){:host([empty]) .product:hover{background:var(--arq-color-surface-faint)}:host([empty]) .product:hover .media{border-color:var(--arq-color-border-strong)}}.info{gap:var(--arq-space-gap-sm);flex-direction:column;display:flex}.title{align-items:center;gap:var(--arq-space-gap-sm-md);color:var(--arq-color-text-primary);text-decoration:none;display:flex}.title:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:var(--arq-space-gap-xs)}.name{overflow-wrap:break-word;flex:auto;min-width:0}.title .icon{width:var(--arq-icon-md);height:var(--arq-icon-md);flex:none}.sku{color:var(--arq-color-text-tertiary);margin:0}.selects{flex-direction:column;display:flex}.selects>*{border-bottom:var(--arq-border-default) solid var(--arq-color-border-default)}.selects>*+*{padding-top:var(--arq-space-gap-sm-md)}.variant{margin:0;display:none}.variant dt{color:var(--arq-color-text-tertiary)}.variant dd{color:var(--arq-color-text-primary);margin:0}@media print{.remove,.selects,.title .icon{display:none}.variant{gap:var(--arq-space-gap-sm-md);flex-direction:column;display:flex}.variant>div{gap:var(--arq-space-gap-xs);flex-direction:column;display:flex}:host([empty]){display:none}}.compact,:host([size=compact]) .product{display:none}:host([size=compact]) .compact{align-items:center;gap:var(--arq-space-gap-sm-md);width:100%;min-width:0;display:flex}.thumb{width:var(--arq-layout-compare-thumb);height:var(--arq-layout-compare-thumb);background:var(--arq-color-surface-subtle);flex:none;position:relative;overflow:hidden}.thumb img{object-fit:cover;width:100%;height:100%;position:absolute;inset:0}.compact-info{gap:var(--arq-space-gap-xs);flex-direction:column;flex:auto;min-width:0;display:flex}.compact-name,.compact-sku{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.compact-name{color:var(--arq-color-text-primary)}.compact-sku{color:var(--arq-color-text-secondary)}:host(:not([show-sku])) .compact-sku{display:none}.compact-remove{flex:none}.compact-add{all:unset;justify-content:center;align-items:center;gap:var(--arq-space-gap-sm-md);box-sizing:border-box;height:var(--arq-layout-compare-thumb);padding-inline:var(--arq-space-padding-md);border:var(--arq-border-default) dashed var(--arq-color-border-default);cursor:pointer;color:var(--arq-color-text-secondary);flex:auto;display:none}:host([size=compact][empty]) .thumb,:host([size=compact][empty]) .compact-info,:host([size=compact][empty]) .compact-remove{display:none}:host([size=compact][empty]) .compact-add{display:flex}.compact-plus{flex:none;display:flex}.compact-plus .icon{width:var(--arq-icon-md);height:var(--arq-icon-md)}@media (hover:hover) and (pointer:fine){.compact-add:hover{background:var(--arq-color-surface-faint);border-color:var(--arq-color-border-strong)}}.compact-add:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:calc(-1 * var(--arq-border-strong))}@media (width<=767px){:host([size=compact]) .compact{gap:var(--arq-space-gap-sm);text-align:center;flex-direction:column;height:100%;position:relative}.compact-info{flex:none;align-self:stretch;align-items:center}.compact-name,.compact-sku{white-space:normal;overflow-wrap:anywhere}.compact-remove{position:absolute;top:0;right:0}.compact-add{align-self:stretch;gap:var(--arq-space-gap-xs);height:auto;min-height:var(--arq-layout-compare-thumb);padding:var(--arq-space-padding-sm);text-align:center;flex-direction:column}}";
(class extends F {
	static tag = "arq-compare-product";
	static styles = Zi;
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
	static template = `<div class="product"><div class="media"><img alt="" hidden><arq-icon-button icon="close" class="remove"></arq-icon-button><button type="button" class="add"><span class="add-icon">${I("plus")}</span><span class="add-label role-body"></span></button></div><div class="info"><a class="title"><span class="name role-heading-3"></span>${I("arrow-up-right")}</a><p class="sku role-label"></p></div><div class="selects"></div><dl class="variant"></dl></div><div class="compact"><div class="thumb"><img alt="" hidden></div><div class="compact-info"><span class="compact-name role-label"></span><span class="compact-sku role-body-sm"></span></div><arq-icon-button icon="close" class="compact-remove"></arq-icon-button><button type="button" class="compact-add"><span class="compact-plus">${I("plus")}</span><span class="compact-add-label role-body-sm"></span></button></div>`;
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
		}), this.#t();
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
		e?.image ? (n.src = e.image, n.hidden = !1) : (n.removeAttribute("src"), n.hidden = !0), t.querySelector(".compact-name").textContent = e?.name ?? "", t.querySelector(".compact-sku").textContent = e?.sku ?? "", t.querySelector(".compact-add-label").textContent = this.addLabel ?? "", t.querySelector(".compact-remove").textContent = e ? `Quitar ${e.name}` : "Quitar";
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
		}), this.shadowRoot.querySelector(".variant").replaceChildren(...n.filter((e) => e.value !== "").map((e) => {
			let t = document.createElement("div"), n = document.createElement("dt");
			n.className = "role-label", n.textContent = e.label;
			let r = document.createElement("dd");
			return r.className = "role-body-regular", r.textContent = e.options.find((t) => String(t.value) === String(e.value))?.label ?? e.value, t.append(n, r), t;
		}));
	}
}).define();
//#endregion
//#region src/components/compare-header/compare-header.css?inline
var Qi = ":host{z-index:2;display:block;position:relative}.default{align-items:flex-start;gap:var(--arq-space-gap-xl);padding-inline:var(--page-gutter);padding-block-end:var(--arq-space-section-xs);display:flex;position:relative}.sentinel{width:var(--arq-border-default);height:var(--arq-border-default);position:absolute;bottom:0;left:0}.controls{width:var(--arq-layout-compare-label);flex:none}.default .controls{flex-direction:column;justify-content:flex-end;align-self:stretch;display:flex}.products{align-items:stretch;gap:var(--arq-space-gap-xl);flex:auto;min-width:0;display:flex}.products>*{flex:1 1 0;min-width:0}.compact{top:var(--navbar-height,0px);z-index:2;align-items:center;gap:var(--arq-space-gap-lg);padding-inline:var(--page-gutter);padding-block:var(--arq-space-padding-sm-md);background:var(--arq-color-surface-default);border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle);display:flex;position:fixed;left:0;right:0}.compact .controls{white-space:nowrap;align-items:center;width:auto;display:flex}.slots{align-items:center;gap:var(--arq-space-gap-lg);flex:auto;min-width:0;display:flex;overflow:hidden}.slots>*{flex:1 1 0;min-width:0}@media (width<=767px){:host{--column-width:var(--arq-layout-compare-column)}.default{width:100%;min-width:0;padding-inline:0}.default .controls{display:none}.products>*{width:var(--column-width);flex:none}.products{gap:var(--arq-space-gap-md);padding-inline:var(--page-gutter);scrollbar-width:none;overflow-x:auto}.products::-webkit-scrollbar{display:none}.slots::-webkit-scrollbar{display:none}.compact{align-items:stretch;gap:var(--arq-space-gap-md);flex-direction:column;padding-inline:0;top:0;overflow:visible}.slots{box-sizing:border-box;gap:var(--arq-space-gap-md);width:100%;padding-inline:var(--page-gutter);overscroll-behavior-x:contain;scrollbar-width:none;flex:auto;order:1;overflow-x:auto}.compact .controls{width:auto;padding-inline:var(--page-gutter);order:2}.slots{align-items:stretch}.slots>*{box-sizing:border-box;width:var(--column-width);flex:none}.slots>*+*{border-left:var(--arq-border-default) solid var(--arq-color-border-subtle);padding-inline-start:var(--arq-space-padding-md)}}@media print{.compact{display:none}.default{padding-inline:var(--page-gutter);break-inside:avoid;gap:0}.default .controls{padding-inline-end:var(--arq-space-gap-lg);display:block}.controls arq-toggle{visibility:hidden}.products{gap:0;padding-inline:0;overflow:visible}.products>*{width:auto;padding-inline:var(--arq-space-padding-md) var(--arq-space-gap-lg);flex:1 1 0}}@media (width<=767px){:host([embedded]) .default{width:max-content;min-width:100%}:host([embedded]) .products{flex:none;width:max-content;overflow:visible}}", $i = 3, K = matchMedia("(max-width: 767px)");
(class extends F {
	static tag = "arq-compare-header";
	static styles = Qi;
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
	#r = !1;
	get products() {
		return this.#e;
	}
	set products(e) {
		this.#e = (Array.isArray(e) ? e : []).slice(0, $i), this.isConnected && this.#i();
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
		for (let t of e.querySelectorAll(".products, .slots")) t.addEventListener("scroll", () => this.#o(t));
		K.addEventListener("change", () => this.#a()), this.#s(), addEventListener("resize", () => {
			this.#s(), K.matches && document.querySelector("arq-navbar")?.removeAttribute("data-arq-compare-hidden");
		}), this.#i();
	}
	disconnectedCallback() {
		this.#t?.disconnect(), document.querySelector("arq-navbar")?.removeAttribute("data-arq-compare-hidden");
	}
	update(e) {
		if (e.has("diffLabel") || e.has("onlyDifferences")) for (let e of this.shadowRoot.querySelectorAll("arq-toggle")) e.textContent = this.diffLabel ?? "", e.checked = this.onlyDifferences;
	}
	#i() {
		let e = this.shadowRoot, t = e.querySelector(".products"), n = e.querySelector(".slots");
		for (let e = 0; e < $i; e++) {
			let r = this.#e[e] ?? null, i = t.children[e];
			i || (i = document.createElement("arq-compare-product"), t.append(i)), i.data = r;
			let a = n.children[e];
			a || (a = document.createElement("arq-compare-product"), a.size = "compact", n.append(a)), a.data = r;
		}
		for (; t.children.length > $i;) t.lastElementChild.remove();
		for (; n.children.length > $i;) n.lastElementChild.remove();
		this.#a();
	}
	#a() {
		for (let e of this.shadowRoot.querySelectorAll(".slots arq-compare-product")) e.showSku = !0;
		document.querySelector("arq-navbar")?.removeAttribute("data-arq-compare-hidden");
	}
	setScrollLeft(e) {
		if (K.matches) for (let t of this.shadowRoot.querySelectorAll(".products, .slots")) t.scrollLeft = e;
	}
	refreshCompact() {
		this.#s();
	}
	#o(e) {
		if (!(!K.matches || this.#n)) {
			this.#n = !0;
			for (let t of this.shadowRoot.querySelectorAll(".products, .slots")) t !== e && (t.scrollLeft = e.scrollLeft);
			this.emit("scroll", { left: e.scrollLeft }), this.#n = !1;
		}
	}
	#s() {
		let e = document.querySelector("arq-navbar"), t = e ? Math.round(e.getBoundingClientRect().height) : 0;
		this.shadowRoot.querySelector(".compact").style.setProperty("--navbar-height", `${t}px`), this.#c(t);
	}
	#c(e = 0) {
		this.#t?.disconnect(), this.#r = !1, this.#l(!1);
		let t = this.shadowRoot.querySelector(".sentinel");
		this.#t = new IntersectionObserver(([e]) => {
			e.isIntersecting && (this.#r = !0), this.#l(this.#r && e.boundingClientRect.top < 0);
		}, {
			rootMargin: `${K.matches ? 0 : -e}px 0px 0px 0px`,
			threshold: 0
		}), this.#t.observe(t);
	}
	#l(e) {
		if (!this.getClientRects().length) return;
		this.shadowRoot.querySelector(".compact").hidden = !e;
		let t = document.querySelector("arq-navbar");
		t && K.matches && t.toggleAttribute("data-arq-compare-hidden", e);
	}
}).define();
//#endregion
//#region src/components/compare-table/compare-table.css?inline
var ea = ":host{min-width:0;display:block}.scroll{overscroll-behavior-x:contain;padding-inline:var(--page-gutter);padding-block-end:var(--arq-space-section-xl);overflow-x:auto}.scroll:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:calc(-1 * var(--arq-border-strong))}:host([embedded]) .scroll{overflow:visible}.table{border-collapse:collapse;table-layout:fixed;width:100%}th,td{background:var(--arq-color-surface-default);text-align:start;vertical-align:middle;font-weight:inherit;padding:0}.label-cell{width:var(--arq-layout-compare-label);padding-inline-end:var(--arq-space-gap-lg)}thead th{border:none;height:0;padding:0}.product{padding-inline-end:var(--arq-space-gap-lg)}.group th{padding-block:var(--arq-space-gap-2xl) var(--arq-space-padding-sm-md);border-bottom:var(--arq-border-default) solid var(--arq-color-border-strong);color:var(--arq-color-text-primary)}.row>*{padding-block:var(--arq-space-padding-md);border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle)}.row-label{color:var(--arq-color-text-secondary);overflow-wrap:break-word}.value{padding-inline:var(--arq-space-padding-md) var(--arq-space-gap-lg);border-left:var(--arq-border-default) solid var(--arq-color-border-subtle);color:var(--arq-color-text-primary);overflow-wrap:break-word}@media (width<=767px){:host{--column-width:var(--arq-layout-compare-column)}.scroll{padding-inline:0;overflow-x:visible}.group,.group th{display:block}.group th{margin-inline-start:var(--page-gutter);padding-inline:0}.table{table-layout:auto;width:100%;min-width:0}.row{grid-template-columns:repeat(3, var(--column-width));padding-inline:var(--page-gutter);column-gap:var(--arq-space-gap-md);row-gap:var(--arq-space-gap-sm);scrollbar-width:none;border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle);width:100%;display:grid;overflow-x:auto}.row::-webkit-scrollbar{display:none}.row>*{border-bottom:none;padding-block:0}.row .label-cell{z-index:1;width:max-content;max-width:calc(100vw - 2 * var(--page-gutter));padding:var(--arq-space-padding-xs) 0;background:var(--arq-color-surface-default);grid-column:1/-1;justify-self:start;position:sticky;inset-inline-start:0}.row .value{width:var(--column-width);padding:var(--arq-space-padding-sm) 0 var(--arq-space-padding-sm) var(--arq-space-padding-md)}.row .value:first-of-type{border-left:none;padding-inline-start:0}.table,thead,tbody{display:block}.row+.row{margin-top:var(--arq-space-gap-sm)}.group+.row{margin-top:var(--arq-space-padding-md)}}@media print{.scroll{overflow:visible}.empty,thead{display:none}.table,tbody,.group,.group th{display:block}.group{break-inside:avoid;break-after:avoid}.row{grid-template-columns:auto repeat(var(--columns,3), minmax(0, 1fr));break-inside:avoid;display:grid}.row>*{align-items:center;display:flex}}@media print and (width<=767px){.scroll{padding-inline:var(--page-gutter)}.group th{margin-inline-start:0;padding-inline:0}.row{box-sizing:border-box;border-bottom:none;gap:0;padding-inline:0;overflow:visible}.row+.row,.group+.row{margin-top:0}.row>*{padding-block:var(--arq-space-padding-md);border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle)}.row .label-cell{width:var(--arq-layout-compare-label);padding-inline:0 var(--arq-space-gap-lg);grid-column:auto;position:static}.row .value,.row .value:first-of-type{width:auto;padding-inline:var(--arq-space-padding-md) var(--arq-space-gap-lg);border-left:var(--arq-border-default) solid var(--arq-color-border-subtle)}}@media screen and (width<=767px){:host([embedded]) .table{width:max-content;min-width:100%}:host([embedded]) .row{width:max-content;overflow:visible}:host([embedded]) .row .label-cell{inset-inline-start:var(--page-gutter)}:host([embedded]) .group th{width:calc(100vw - var(--page-gutter));position:sticky;inset-inline-start:var(--page-gutter)}}", ta = (e) => String(e ?? "").replace(/[&<>"]/g, (e) => ({
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;"
})[e]), na = 3, ra = matchMedia("(max-width: 767px)");
(class extends F {
	static tag = "arq-compare-table";
	static styles = ea;
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
			products: (e?.products ?? []).slice(0, na),
			groups: e?.groups ?? []
		}, this.isConnected && this.#n();
	}
	setup() {
		ra.addEventListener("change", () => this.#r()), this.shadowRoot.querySelector(".table").addEventListener("scroll", (e) => {
			let t = e.target;
			!ra.matches || this.#t || !t.classList?.contains("row") || (this.#t = !0, this.setScrollLeft(t.scrollLeft), this.emit("scroll", { left: t.scrollLeft }), this.#t = !1);
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
		e.querySelector(".scroll").style.setProperty("--columns", String(Math.max(1, Math.min(na, n.length))));
		let i = (e) => e >= n.length ? " empty" : "";
		e.querySelector("thead").innerHTML = "<tr role=\"row\"><th scope=\"col\" class=\"label-cell\" role=\"columnheader\"></th>" + Array.from({ length: na }, (e, t) => n[t]).map((e, t) => `<th scope="col" class="product${i(t)}" role="columnheader">${e ? `<span class="visually-hidden">${ta(e.name)} (${ta(e.meta ?? e.sku)})</span>` : ""}</th>`).join("") + "</tr>";
		for (let e of t.querySelectorAll("tbody")) e.remove();
		for (let e of r) {
			let r = document.createElement("tbody");
			r.setAttribute("role", "rowgroup"), r.innerHTML = `<tr class="group" role="row"><th scope="colgroup" colspan="4" role="columnheader"><span class="group-label role-body-xl">${ta(e.label)}</span></th></tr>` + (e.rows ?? []).map((e) => {
				let t = n.map((t, n) => e.values?.[n] ?? "—"), r = t.length > 0 && t.every((e) => String(e) === String(t[0])), a = Array.from({ length: na }, (e, n) => t[n] ?? "");
				return `<tr class="row" role="row"${r ? " data-same" : ""}><th scope="row" class="label-cell row-label" role="rowheader">${ta(e.label)}</th>` + a.map((e, t) => `<td class="value${i(t)} role-body-lg-regular" role="cell">${ta(e)}</td>`).join("") + "</tr>";
			}).join(""), t.append(r);
		}
		this.#r(), this.#i();
	}
	#r() {
		let e = ra.matches;
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
var ia = ":host{display:block}.page{flex-direction:column;max-width:100%;display:flex;overflow-x:clip}.status{padding-inline:var(--page-gutter);padding-block:var(--arq-space-section-xs);color:var(--arq-color-text-secondary);margin:0}.mobile-controls{display:none}@media (width<=767px){.mobile-controls:not([hidden]){padding-inline:var(--page-gutter);align-items:center;padding-block-end:var(--arq-space-gap-md);display:flex}.scroll{overscroll-behavior-x:contain;scrollbar-width:none;overflow-x:auto}.scroll::-webkit-scrollbar{display:none}.scroll:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:calc(-1 * var(--arq-border-strong))}}@media print{.mobile-controls,.mobile-controls:not([hidden]){display:none}.scroll{overflow:visible}}", aa = "arq:compare", oa = 3, sa = matchMedia("(max-width: 767px)"), q = {
	count: (e) => e === 1 ? "1 luminaria seleccionada." : `${e} luminarias seleccionadas.`,
	printTitle: (e) => `Comparativa · ${e.join(" · ")} · Macroled Arq`,
	empty: "Elegí hasta 3 productos para comparar desde el listado de Productos.",
	error: "No se pudo cargar la comparación. Probá de nuevo en unos minutos."
};
function ca() {
	let e = new URLSearchParams(location.search).get("sku");
	return e ? e.split(",").map((e) => decodeURIComponent(e.trim())).filter(Boolean).slice(0, oa) : [];
}
function la(e) {
	try {
		localStorage.setItem(aa, JSON.stringify(e.map((e) => ({
			sku: e.sku,
			name: e.name,
			meta: e.meta,
			image: e.image
		}))));
	} catch {}
}
(class extends F {
	static tag = "arq-comparativa";
	static styles = ia;
	static properties = {};
	static template = "<div class=\"page\"><p class=\"status role-body\" role=\"status\" hidden></p><div class=\"mobile-controls\" hidden><arq-toggle show-label class=\"diff-mobile\">Solo diferencias</arq-toggle></div><div class=\"scroll\" aria-label=\"Comparación de productos\" hidden><arq-compare-header class=\"header\" embedded></arq-compare-header><arq-compare-table class=\"table\" embedded></arq-compare-table></div></div><arq-compare-picker class=\"picker\"></arq-compare-picker>";
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
			this.#e.length >= oa || this.#e.includes(t) || (this.#e = [...this.#e, t], this.#u());
		});
		let a = e.querySelector(".scroll");
		a.addEventListener("scroll", () => {
			sa.matches && t.setScrollLeft(a.scrollLeft);
		}), t.addEventListener("arq:scroll", (e) => {
			sa.matches && a.scrollLeft !== e.detail.left && (a.scrollLeft = e.detail.left);
		}), sa.addEventListener("change", () => this.#s()), this.#s(), this.#e = ca(), this.#u();
	}
	connectedCallback() {
		super.connectedCallback?.(), addEventListener("beforeprint", this.#a), addEventListener("afterprint", this.#o);
	}
	disconnectedCallback() {
		super.disconnectedCallback?.(), removeEventListener("beforeprint", this.#a), removeEventListener("afterprint", this.#o);
	}
	#a = () => {
		this.#n.length && (this.#i ??= document.title, document.title = q.printTitle(this.#n));
	};
	#o = () => {
		this.#i !== null && (document.title = this.#i, this.#i = null);
	};
	#s() {
		let e = this.shadowRoot.querySelector(".scroll");
		sa.matches ? (e.setAttribute("tabindex", "0"), e.setAttribute("role", "region")) : (e.removeAttribute("tabindex"), e.removeAttribute("role"));
	}
	async #c() {
		let e = this.shadowRoot.querySelector(".picker"), t = [...this.#e], n = ++this.#t;
		e.count = t.length;
		try {
			let { items: r } = await Yt({
				...e.search,
				selected: t
			});
			n === this.#t && (e.items = r);
		} catch (e) {
			console.error("[arq] compare-picker: no se pudo cargar el catálogo", e);
		}
	}
	async #l({ index: e, field: t, value: n }) {
		let r = this.#e[e];
		if (!n || !r) return;
		let i = await Bt(r, t, n);
		i && i !== r && (this.#e[e] = i, this.#e = this.#e.slice(0, oa), this.#u());
	}
	async #u() {
		let e = this.shadowRoot, t = e.querySelector(".header"), n = e.querySelector(".table"), r = e.querySelector(".scroll"), i = e.querySelector(".mobile-controls");
		this.setAttribute("aria-busy", "true");
		let a = null, o = !1;
		try {
			a = this.#e.length ? await Vt(this.#e) : {
				products: [],
				groups: []
			};
		} catch (e) {
			o = !0, console.error("[arq] comparativa: no se pudo cargar el catálogo", e);
		}
		if (this.removeAttribute("aria-busy"), !a || o && !a.products.length) {
			this.#f(o ? q.error : q.empty), r.hidden = !0, i.hidden = !0;
			return;
		}
		if (this.#e = a.products.map((e) => e.sku), this.#n = a.products.map((e) => e.name).filter(Boolean), !this.#e.length) {
			this.#f(q.empty), r.hidden = !0, i.hidden = !0;
			return;
		}
		this.#f(""), this.#d(this.#e.length), r.hidden = !1, i.hidden = !1, t.products = a.products, t.onlyDifferences = this.#r, n.data = {
			products: a.products,
			groups: a.groups
		}, n.onlyDifferences = this.#r, e.querySelector(".diff-mobile").checked = this.#r, requestAnimationFrame(() => t.refreshCompact()), la(a.products), e.querySelector(".picker").open && this.#c();
		let s = new URL(location.href);
		s.searchParams.set("sku", this.#e.map(encodeURIComponent).join(",")), history.replaceState(history.state, "", s);
	}
	#d(e) {
		for (let t of document.querySelectorAll("[data-arq-compare-count]")) t.textContent = e ? q.count(e) : "";
	}
	#f(e) {
		let t = this.shadowRoot.querySelector(".status");
		t.textContent = e, t.hidden = !e, e && this.#d(0);
	}
}).define();
//#endregion
//#region src/components/mega-link/mega-link.css?inline
var ua = ":host{min-width:0;display:block}.link{box-sizing:border-box;align-items:center;gap:var(--arq-space-gap-md);width:100%;padding:var(--arq-space-gap-sm-md) 0;border:0;border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle);color:var(--arq-color-text-primary);font:inherit;text-align:start;background:0 0;margin:0;text-decoration:none;display:flex}.link.with-meta{padding-block:var(--arq-space-gap-sm)}:host([size=large]) .link,button.link{gap:var(--arq-space-gap-sm);padding-block:var(--arq-space-gap-md)}@media (hover:hover) and (pointer:fine){.link[href]:hover,button.link:hover{background:var(--arq-color-surface-hover)}}button.link{cursor:pointer}.link:focus-visible,.trigger:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.text{flex-direction:column;flex:1;min-width:0;display:flex}:host([size=large]) .text{gap:var(--arq-space-gap-xs)}.name{overflow-wrap:break-word}.meta{color:var(--arq-color-text-tertiary)}.thumb{width:calc(var(--arq-layout-search-thumb) + var(--arq-space-gap-sm-md));aspect-ratio:1;background:var(--arq-color-surface-subtle);flex:none;position:relative}.thumb[hidden]{display:none}.thumb img{object-fit:cover;width:100%;height:100%;position:absolute;inset:0}.arrow,.chevron{color:var(--arq-color-icon-primary);flex:none;display:inline-flex}.arrow[hidden]{display:none}.link:not(:focus-visible) .arrow{visibility:hidden}@media (hover:hover) and (pointer:fine){.link:hover .arrow{visibility:visible}}.icon{width:var(--arq-icon-md);height:var(--arq-icon-md)}.group{border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle)}.trigger{align-items:center;gap:var(--arq-space-gap-sm);width:100%;padding:var(--arq-space-gap-md) 0;color:var(--arq-color-text-primary);font:inherit;text-align:start;cursor:pointer;background:0 0;border:0;display:flex}@media (hover:hover) and (pointer:fine){.trigger:hover{background:var(--arq-color-surface-hover)}}.trigger .name{flex:1;min-width:0}.toggle{color:var(--arq-color-icon-primary);flex:none;display:inline-flex}:host(:not([open])) [data-icon=minus],:host([open]) [data-icon=plus]{display:none}.links{padding-bottom:var(--arq-space-gap-md);flex-direction:column;align-items:flex-start;display:flex}::slotted(a){width:100%;padding-block:var(--arq-space-gap-sm);color:var(--arq-color-text-primary);font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-light);font-size:var(--arq-type-body-lg-size);line-height:var(--arq-type-body-lg-leading);letter-spacing:var(--arq-font-tracking-normal);text-decoration:none;display:block}::slotted(a:focus-visible){outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}::slotted(arq-button){margin-block:var(--arq-space-gap-sm)}", da = (e, t) => `<${e} class="link"${e === "button" ? " type=\"button\"" : ""}><span class="text"><span class="name"><slot></slot></span><span class="meta"><slot name="meta"></slot></span></span><span class="thumb" hidden><img alt="" loading="lazy" hidden></span>` + t + `</${e}>`, fa = da("a", `<span class="arrow">${I("arrow-right")}</span>`), pa = da("button", `<span class="chevron">${I("chevron-right")}</span>`), ma = `<div class="group"><button type="button" class="trigger"><span class="name role-body-xl"><slot></slot></span><span class="toggle">${I("plus")}${I("minus")}</span></button><div class="links"><slot name="links"></slot></div></div>`;
(class extends F {
	static tag = "arq-mega-link";
	static styles = ua;
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
		submenu: { type: Boolean },
		href: { type: String }
	};
	setup() {
		let e = this.shadowRoot, t = document.createElement("template");
		if (t.innerHTML = this.type === "group" ? ma : this.submenu ? pa : fa, e.append(t.content), this.type === "group") this.disclosure = new L(this, {
			trigger: e.querySelector(".trigger"),
			panel: e.querySelector(".links")
		});
		else {
			e.querySelector("slot[name=\"meta\"]").addEventListener("slotchange", () => this.#e());
			let t = e.querySelector("img");
			t.addEventListener("load", () => t.hidden = !1), t.addEventListener("error", () => t.hidden = !0);
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
		e.querySelector(".name").className = `name ${t || this.submenu ? "role-heading-3" : "role-body-xl"}`, e.querySelector(".meta").className = `meta ${t ? "role-caption" : "role-body-compact-regular"}`, this.#e(), this.#t();
	}
	#e() {
		let e = this.shadowRoot.querySelector("slot[name=\"meta\"]");
		if (!e) return;
		let t = e.assignedNodes({ flatten: !0 }).some((e) => e.textContent.trim());
		e.parentElement.hidden = !t, this.shadowRoot.querySelector(".link").classList.toggle("with-meta", t);
	}
	#t() {
		let e = this.shadowRoot.querySelector(".thumb"), t = e.querySelector("img");
		e.hidden = !this.showImage, this.showImage && this.image ? t.getAttribute("src") !== this.image && (t.src = this.image) : (t.removeAttribute("src"), t.hidden = !0);
	}
}).define();
//#endregion
//#region src/components/mega-menu/mega-menu.css?inline
var ha = ":host{display:block}.menu{background:var(--arq-color-surface-default);border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle)}.tabs{gap:var(--arq-space-gap-xl);padding:var(--arq-space-gap-md) var(--page-gutter) 0;border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle);display:flex}.body{align-items:stretch;display:flex}.panels{flex:1;min-width:0;display:flex}.panel{min-width:0;padding:var(--arq-space-padding-2xl) var(--arq-space-padding-2xl) var(--arq-space-padding-2xl) var(--page-gutter);flex-direction:column;flex:1;display:flex}.panel[hidden]{display:none}.columns{gap:var(--arq-space-gap-2xl);flex:1;display:flex}.column{justify-content:space-between;align-items:flex-start;gap:var(--arq-space-gap-xl);flex-direction:column;flex:1;min-width:0;display:flex}.top{gap:var(--arq-space-gap-xl-2xl);flex-direction:column;align-self:stretch;display:flex}.title{color:var(--arq-color-text-primary);margin:0}.links{flex-direction:column;align-self:stretch;display:flex}.panel--colecciones{gap:var(--arq-space-gap-xl)}.columns--collections{align-items:flex-start;gap:var(--arq-space-gap-xl);flex:none}.columns--collections .column{justify-content:flex-start;align-items:stretch;gap:0}.panel--colecciones .all{align-self:flex-start;margin-top:auto}.preview{box-sizing:border-box;justify-content:flex-end;gap:var(--arq-space-gap-sm);width:var(--arq-layout-mega-menu-image);aspect-ratio:4/5;padding:var(--arq-space-padding-xl-2xl);background:var(--arq-color-surface-subtle);flex-direction:column;flex:none;display:flex;position:relative;overflow:hidden}.preview img{object-fit:cover;width:100%;height:100%;position:absolute;inset:0}.preview:after{content:\"\";background:linear-gradient(#0000 45%,#000000b3 100%);position:absolute;inset:0}.preview:has(img[hidden]):after{display:none}.caption{z-index:1;gap:var(--arq-space-gap-sm);color:var(--arq-color-text-inverse);flex-direction:column;display:flex;position:relative}:is(.preview:has(img[hidden]) .caption,.caption[hidden],.eyebrow[hidden]){display:none}.eyebrow,.preview-title{margin:0}", J = (e) => String(e ?? "").replace(/[&<>"]/g, (e) => ({
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;"
})[e]), ga = [
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
], _a = 4, va = 0;
(class extends F {
	static tag = "arq-mega-menu";
	static styles = ha;
	static properties = {
		tab: {
			type: String,
			values: ga.map((e) => e.id),
			default: "por-espacio"
		},
		label: {
			type: String,
			default: "Productos"
		}
	};
	static template = "<div class=\"menu\"><div class=\"tabs\" role=\"tablist\"></div><div class=\"body\"><div class=\"panels\"></div><div class=\"preview\" aria-hidden=\"true\"><img alt=\"\" hidden><div class=\"caption\"><p class=\"eyebrow role-label\"></p><p class=\"preview-title role-heading-2\"></p></div></div></div></div>";
	#e = null;
	#t = {};
	#n = ++va;
	get navigation() {
		return this.#e;
	}
	set navigation(e) {
		this.#e = e, this.shadowRoot.querySelector(".tabs") && this.#i();
	}
	get images() {
		return this.#t;
	}
	set images(e) {
		this.#t = e ?? {}, this.shadowRoot.querySelector(".tabs") && this.#c();
	}
	setup() {
		let e = this.shadowRoot, t = e.querySelector(".tabs");
		this.select = new jr(t, { items: "arq-tab" }), t.addEventListener("arq:change", (e) => {
			e.stopPropagation(), this.tab = e.detail.value;
		});
		let n = e.querySelector(".preview img");
		n.addEventListener("load", () => n.hidden = !1), n.addEventListener("error", () => n.hidden = !0);
		let r = e.querySelector(".panels"), i = (e) => {
			let t = e.target.closest?.("arq-mega-link");
			t && this.#l(t);
		};
		r.addEventListener("pointerover", i), r.addEventListener("focusin", i), this.#i();
	}
	update(e) {
		let t = this.shadowRoot;
		if (e.has("label") && t.querySelector(".tabs").setAttribute("aria-label", this.label ?? ""), e.has("tab")) {
			for (let e of t.querySelectorAll("arq-tab")) e.selected = e.value === this.tab;
			for (let e of t.querySelectorAll("[role=\"tabpanel\"]")) e.hidden = e.dataset.tab !== this.tab;
			this.#c();
		}
	}
	#r(e) {
		let t = this.#e?.sections ?? {};
		return e === "por-espacio" ? [t.interior, t.exterior].filter(Boolean) : e === "lamparas-y-artefactos" ? [t.lamparas, t.artefactos].filter(Boolean) : [];
	}
	#i() {
		let e = this.shadowRoot, t = this.#e, n = ga.filter((e) => e.id === "colecciones" ? t?.collections?.length : this.#r(e.id).length);
		n.length && !n.some((e) => e.id === this.tab) && (this.tab = n[0].id);
		let r = (e) => ({
			tab: `mega-tab-${this.#n}-${e.id}`,
			panel: `mega-panel-${this.#n}-${e.id}`
		});
		e.querySelector(".tabs").innerHTML = n.map((e) => `<arq-tab id="${r(e).tab}" value="${e.id}" aria-controls="${r(e).panel}"${e.id === this.tab ? " selected" : ""}>${J(e.label)}</arq-tab>`).join(""), e.querySelector(".panels").innerHTML = n.map((e) => {
			let n = e.id === "colecciones" ? this.#s(t) : this.#o(this.#r(e.id));
			return `<div class="panel panel--${e.id}" role="tabpanel" id="${r(e).panel}" aria-labelledby="${r(e).tab}" data-tab="${e.id}"${e.id === this.tab ? "" : " hidden"}>${n}</div>`;
		}).join(""), this.select.refresh(), this.#c();
	}
	#a(e, t, n = "") {
		return `<arq-mega-link href="${J(e.href)}" show-arrow data-image="${J(e.image ?? "")}" data-eyebrow="${J(t)}" data-title="${J(e.label)}">${J(e.label)}${n ? `<span slot="meta">${J(n)}</span>` : ""}</arq-mega-link>`;
	}
	#o(e) {
		return "<div class=\"columns\">" + e.map((e) => `<div class="column"><div class="top"><p class="title role-heading-1">${J(e.label)}</p><div class="links">${e.links.map((t) => this.#a(t, `${e.label} · ${t.label}`)).join("")}</div></div><arq-button class="all" type="underline" show-underline show-icon icon="arrow-right" href="${J(e.all.href)}">${J(e.all.label)}</arq-button></div>`).join("") + "</div>";
	}
	#s(e) {
		let t = e?.collections ?? [], n = Math.floor(t.length / _a), r = t.length % _a, i = 0;
		return "<p class=\"title role-heading-1\">Colecciones</p><div class=\"columns columns--collections\">" + Array.from({ length: _a }, (e, a) => {
			let o = n + +(a < r), s = t.slice(i, i + o);
			return i += o, s;
		}).map((e) => `<div class="links column">${e.map((e) => this.#a(e, e.eyebrow, e.meta)).join("")}</div>`).join("") + `</div><arq-button class="all" type="underline" show-underline show-icon icon="arrow-up-right" href="${J(e?.allCollections?.href)}">${J(e?.allCollections?.label)}</arq-button>`;
	}
	#c() {
		let e = this.shadowRoot.querySelector(`[role="tabpanel"][data-tab="${this.tab}"] arq-mega-link`);
		e ? this.#l(e, this.#t[this.tab]) : this.#u(this.#t[this.tab], "", "");
	}
	#l(e, t) {
		this.#u(t || e.dataset.image, e.dataset.eyebrow, e.dataset.title);
	}
	#u(e, t, n) {
		let r = this.shadowRoot, i = r.querySelector(".preview img");
		e ? i.getAttribute("src") !== e && (i.src = e) : (i.removeAttribute("src"), i.hidden = !0), r.querySelector(".eyebrow").textContent = t ?? "", r.querySelector(".eyebrow").hidden = !t, r.querySelector(".preview-title").textContent = n ?? "", r.querySelector(".caption").hidden = !n;
	}
}).define();
//#endregion
//#region src/base/highlight.js
var ya = (e) => e.replace(/[&<>"]/g, (e) => ({
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;"
})[e]), ba = (e) => e.normalize("NFD")[0].toLowerCase()[0];
function xa(e, t) {
	let n = [...String(e ?? "")], r = [...new Set([...String(t ?? "").trim()].map(ba).join("").split(/\s+/).filter(Boolean))];
	if (!r.length) return ya(n.join(""));
	let i = n.map(ba).join(""), a = Array(n.length).fill(!1);
	for (let e of r) for (let t = i.indexOf(e); t !== -1; t = i.indexOf(e, t + 1)) for (let n = t; n < t + e.length; n++) a[n] = !0;
	let o = "";
	for (let e = 0; e < n.length;) {
		let t = e;
		for (; t < n.length && a[t] === a[e];) t++;
		let r = ya(n.slice(e, t).join(""));
		o += a[e] ? `<span class="match role-body-medium">${r}</span>` : r, e = t;
	}
	return o;
}
//#endregion
//#region src/components/search-result/search-result.css?inline
var Sa = ":host{min-width:0;display:block}.result{align-items:center;gap:var(--arq-space-gap-md);padding:var(--arq-space-gap-sm) var(--search-inline,var(--arq-space-padding-md));border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle);background:var(--arq-color-surface-default);color:var(--arq-color-text-primary);text-decoration:none;display:flex}.result[href]:hover,.result.active{background:var(--arq-color-surface-hover)}.result:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:calc(var(--arq-border-strong) * -1)}.thumb{width:var(--arq-layout-search-thumb);height:var(--arq-layout-search-thumb);background:var(--arq-color-surface-subtle);flex:none}.thumb img{object-fit:cover;width:100%;height:100%;display:block}.text{gap:var(--arq-space-gap-xs);flex-direction:column;flex:1;min-width:0;display:flex}.name,.meta{overflow-wrap:break-word}.meta{color:var(--arq-color-text-tertiary)}.arrow{color:var(--arq-color-icon-primary);flex:none;display:inline-flex}.icon{width:var(--arq-icon-md);height:var(--arq-icon-md)}:host([type=simple]) .result{gap:var(--arq-space-gap-lg);background:0 0;border-bottom:0;padding-block:0}:host([type=simple]) .result[href]:hover,:host([type=simple]) .result.active{background:0 0}:host([type=simple]) .result:focus-visible{outline-offset:2px}:host([type=simple]) .thumb{width:var(--arq-layout-table-thumb);height:var(--arq-layout-table-thumb)}@media (width<=767px){:host([type=simple]) .thumb{width:var(--arq-layout-gallery-thumb);height:var(--arq-layout-gallery-thumb)}}:host([type=simple]) .meta,:host([type=simple]) .arrow{display:none}:host([type=simple]) .name{color:var(--arq-color-text-tertiary);transition:color var(--arq-motion-duration-fast) var(--arq-motion-easing-standard)}.name.has-marks slot{display:none}.match{color:var(--arq-color-text-primary)}:host([type=simple]) .result[href]:hover .name,:host([type=simple]) .result.active .name,:host([type=simple]) .result:focus-visible .name{color:var(--arq-color-text-primary);font-weight:var(--arq-font-weight-medium)}";
(class extends F {
	static tag = "arq-search-result";
	static styles = Sa;
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
	static template = `<a class="result"><span class="thumb"><img alt="" loading="lazy"></span><span class="text"><span class="name role-body-strong"><slot></slot><span class="marked" hidden></span></span><span class="meta role-body-sm"><slot name="meta"></slot></span></span><span class="arrow">${I("arrow-right")}</span></a>`;
	setup() {
		this.shadowRoot.querySelector("img").addEventListener("error", () => this.#e()), this.shadowRoot.querySelector("slot:not([name])").addEventListener("slotchange", () => this.#t());
	}
	#e() {
		let e = this.shadowRoot.querySelector("img");
		e.removeAttribute("src"), e.hidden = !0, e.parentElement.hidden = this.type !== "simple";
	}
	#t() {
		let e = this.shadowRoot, t = e.querySelector(".marked"), n = [...this.childNodes].filter((e) => e.nodeType !== 1 || e.slot !== "meta").map((e) => e.textContent).join("").trim(), r = this.type === "simple" && !!this.term?.trim() && !!n;
		t.hidden = !r, e.querySelector(".name").classList.toggle("has-marks", r), t.innerHTML = r ? xa(n, this.term) : "";
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
var Ca = ":host{min-width:0;display:block}.row{align-items:center;gap:var(--arq-space-gap-md);padding:var(--arq-space-gap-sm) var(--search-inline,var(--arq-space-padding-md));color:var(--arq-color-icon-tertiary);text-decoration:none;display:flex}.row[href]:hover{background:var(--arq-color-surface-hover)}.row:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:calc(var(--arq-border-strong) * -1)}.icon{width:var(--arq-icon-md);height:var(--arq-icon-md);flex:none}.text{min-width:0;color:var(--arq-color-text-tertiary);overflow-wrap:break-word;flex:1}.term{color:var(--arq-color-text-primary)}:host([type=simple]) .row>.icon:first-child{display:none}:host([type=simple]) .text{flex:none}:host([type=simple]) .row[href]:hover{background:0 0}:host([type=simple]) .row:focus-visible{outline-offset:2px}:host([type=simple]) .row[href]:hover .text,:host([type=simple]) .row:focus-visible .text{color:var(--arq-color-text-primary)}:host([type=simple]) .row{gap:var(--arq-space-gap-sm);color:var(--arq-color-icon-primary);justify-content:flex-start}";
(class extends F {
	static tag = "arq-search-see-all";
	static styles = Ca;
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
	static template = `<a class="row">${I("search")}<span class="text role-body-sm"><span class="lead"></span><span class="term role-body-sm-medium"></span></span>${I("arrow-right")}</a>`;
	focus(e) {
		this.shadowRoot.querySelector("a").focus(e);
	}
	click() {
		this.shadowRoot.querySelector("a").click();
	}
	update() {
		let e = this.shadowRoot, t = e.querySelector("a");
		this.href ? t.setAttribute("href", this.href) : t.removeAttribute("href");
		let n = Number.isFinite(this.count) ? ` (${this.count})` : "";
		e.querySelector(".lead").textContent = `Ver todos los resultados${n} para `, e.querySelector(".term").textContent = `“${this.term ?? ""}”`;
	}
}).define();
//#endregion
//#region src/components/search-dropdown/search-dropdown.css?inline
var wa = ":host{min-width:0;display:block}.dropdown{background:var(--arq-color-surface-default);border:var(--arq-border-default) solid var(--arq-color-border-subtle)}.results{flex-direction:column;display:flex}.message{gap:var(--arq-space-gap-sm);padding:var(--arq-space-padding-md) var(--arq-space-padding-md);flex-direction:column;display:flex}.message p{margin:0}.title{color:var(--arq-color-text-primary)}.help{color:var(--arq-color-text-tertiary)}.explore{align-items:center;gap:var(--arq-space-gap-sm);padding:var(--arq-space-padding-sm) var(--arq-space-padding-md);border-top:var(--arq-border-default) solid var(--arq-color-border-subtle);color:var(--arq-color-text-tertiary);text-decoration:none;display:flex}.explore:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:calc(var(--arq-border-strong) * -1)}.explore .icon{width:var(--arq-icon-md);height:var(--arq-icon-md);color:var(--arq-color-icon-primary);flex:none}";
(class extends F {
	static tag = "arq-search-dropdown";
	static styles = wa;
	static properties = {
		state: {
			type: String,
			values: ["results", "no-results"],
			default: "results"
		},
		term: {
			type: String,
			default: ""
		},
		exploreHref: {
			type: String,
			default: "/arq/productos"
		}
	};
	static template = `<div class="dropdown"><div class="results"><slot></slot></div><div class="empty"><div class="message"><p class="title role-body-strong"></p><p class="help role-body-sm">Probá con otro término, revisá la ortografía o buscá por código de producto (SKU).</p></div><a class="explore role-body-sm">Explorá nuestros productos${I("arrow-right")}</a></div></div>`;
	update() {
		let e = this.shadowRoot, t = this.state === "no-results";
		e.querySelector(".results").hidden = t, e.querySelector(".empty").hidden = !t, e.querySelector(".title").textContent = `No se encontraron resultados para “${this.term ?? ""}”`, e.querySelector(".explore").setAttribute("href", this.exploreHref ?? "/arq/productos");
	}
}).define();
//#endregion
//#region src/components/search-screen/search-screen.css?inline
var Ta = ":host{display:contents}.dialog{box-sizing:border-box;border-radius:var(--arq-radius-control);background:var(--arq-color-surface-default);width:100%;max-width:none;height:100dvh;max-height:none;color:var(--arq-color-text-primary);border:0;margin:0;padding:0;inset:0}.screen{flex-direction:column;height:100%;display:flex}.header{align-items:center;gap:var(--arq-space-gap-sm);padding:var(--arq-space-gap-md) var(--arq-layout-gutter);border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle);flex:none;display:flex}.field{flex:1}.content{overscroll-behavior:contain;--search-inline:var(--arq-layout-gutter);flex:1;overflow-y:auto}";
(class extends F {
	static tag = "arq-search-screen";
	static styles = Ta;
	static properties = {
		open: { type: Boolean },
		label: {
			type: String,
			default: "Buscar"
		}
	};
	static template = "<dialog class=\"dialog\" data-arq-theme=\"light\"><div class=\"screen\"><div class=\"header\"><arq-icon-button class=\"back\" icon=\"chevron-left\">Volver</arq-icon-button><arq-search-field class=\"field\"></arq-search-field></div><div class=\"content\"><slot></slot></div></div></dialog>";
	#e = null;
	#t = null;
	get field() {
		return this.shadowRoot.querySelector("arq-search-field");
	}
	setup() {
		let e = this.shadowRoot;
		this.#e = e.querySelector("dialog"), e.querySelector(".back").addEventListener("click", () => this.close()), this.#e.addEventListener("cancel", (e) => {
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
var Ea = ":host{min-width:0;display:block}.card{gap:var(--arq-space-gap-sm);color:var(--arq-color-text-primary);flex-direction:column;text-decoration:none;display:flex}.card:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.media{aspect-ratio:var(--card-ratio,1 / 1);background:var(--arq-color-surface-subtle);display:block;overflow:hidden}.img{object-fit:cover;width:100%;height:100%;transition:transform var(--arq-motion-duration-slow) var(--arq-motion-easing-standard);display:block}@media (hover:hover) and (pointer:fine){.card:hover .img{transform:scale(1.05)}}.card:focus-visible .img{transform:scale(1.05)}.name{overflow-wrap:break-word;min-width:0}";
(class extends F {
	static tag = "arq-search-card";
	static styles = Ea;
	static properties = {
		href: { type: String },
		image: { type: String }
	};
	static template = "<a class=\"card\"><span class=\"media\"><img class=\"img\" alt=\"\" loading=\"lazy\"></span><span class=\"name role-body-regular\"><slot></slot></span></a>";
	setup() {
		let e = this.shadowRoot.querySelector("img");
		e.addEventListener("error", () => e.hidden = !0);
	}
	focus(e) {
		this.shadowRoot.querySelector("a").focus(e);
	}
	update() {
		let e = this.shadowRoot, t = e.querySelector("a");
		this.href ? t.setAttribute("href", this.href) : t.removeAttribute("href");
		let n = e.querySelector("img");
		this.image ? (n.getAttribute("src") !== this.image && (n.src = this.image), n.hidden = !1) : (n.removeAttribute("src"), n.hidden = !0);
	}
}).define();
//#endregion
//#region src/components/search-collection/search-collection.css?inline
var Da = ":host{min-width:0;display:block}.card{align-items:center;gap:var(--arq-space-gap-md);color:var(--arq-color-text-tertiary);text-decoration:none;display:flex}.card:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.thumb{width:var(--arq-layout-search-thumb);height:var(--arq-layout-search-thumb);background:var(--arq-color-surface-subtle);flex:none}.thumb img{object-fit:cover;width:100%;height:100%;display:block}.name{overflow-wrap:break-word;min-width:0;transition:color var(--arq-motion-duration-fast) var(--arq-motion-easing-standard)}.name.has-marks slot{display:none}.match{color:var(--arq-color-text-primary)}.card[href]:hover .name,.card:focus-visible .name,.card.active .name{color:var(--arq-color-text-primary);font-weight:var(--arq-font-weight-medium)}";
(class extends F {
	static tag = "arq-search-collection";
	static styles = Da;
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
		t.hidden = !r, e.querySelector(".name").classList.toggle("has-marks", r), t.innerHTML = r ? xa(n, this.term) : "";
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
var Oa = ":host{display:contents}.dialog{box-sizing:border-box;border-radius:var(--arq-radius-control);width:100%;max-width:none;max-height:100dvh;color:var(--arq-color-text-primary);background:0 0;border:0;margin:0;padding:0;inset:0 0 auto;overflow:clip}.dialog::backdrop{background:var(--arq-color-overlay-scrim);opacity:0;transition:opacity var(--sheet-slow) var(--arq-motion-easing-standard)}.dialog.is-open::backdrop{opacity:1}.dialog:not(.is-open){pointer-events:none}.sheet{box-sizing:border-box;max-height:100dvh;transition:grid-template-rows var(--sheet-slow) var(--arq-motion-easing-standard);grid-template-rows:auto 0fr;align-content:start;display:grid}.dialog.is-open .sheet{grid-template-rows:auto 1fr}.bar{box-sizing:border-box;height:var(--bar-height);padding:0 var(--page-gutter);background:var(--arq-color-surface-transparent);color:var(--arq-color-text-primary);transition-property:background-color,color;transition-duration:var(--sheet-slow);transition-timing-function:var(--arq-motion-easing-standard);justify-content:space-between;align-items:center;display:flex}.dialog.is-open .bar{background:var(--arq-color-surface-default)}:host([over-photo]) .dialog:not(.is-open) .bar{color:var(--arq-color-text-inverse)}.logo{color:inherit;flex:none}.close{color:inherit;margin-inline-end:calc(var(--arq-space-padding-sm-md) * -1)}.drawer{background:var(--arq-color-surface-default);min-height:0;overflow:clip}.drawer-inner{max-height:calc(100dvh - var(--bar-height));opacity:0;transition-property:opacity;transition-duration:var(--arq-motion-duration-slow);transition-timing-function:var(--arq-motion-easing-standard);flex-direction:column;display:flex}.dialog.is-open .drawer-inner{opacity:1}:host([inline]){display:block}:host([inline]) .dialog{max-height:none;position:static;overflow:visible}:host([inline]) .sheet,:host([inline]) .drawer-inner{max-height:none}:host([inline]) .drawer{border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle)}.field-row{padding:var(--arq-space-gap-md) var(--page-gutter) 0;flex:none}.content{min-height:0;padding:calc(var(--arq-space-gap-xl) * 2) var(--page-gutter);overscroll-behavior:contain;--search-inline:0;flex:1;overflow-y:auto}.recommended,.results{opacity:0;transition-property:opacity;transition-duration:calc(var(--sheet-slow) - var(--arq-motion-duration-fast));transition-timing-function:var(--arq-motion-easing-standard)}.dialog.is-open .recommended,.dialog.is-open .results{opacity:1;transition-delay:var(--arq-motion-duration-fast)}.recommended{gap:var(--arq-space-gap-lg);flex-direction:column;display:flex}.recommended[data-empty=true]{display:none}.title{color:var(--arq-color-text-tertiary);margin:0}.cards{--cols:4;--card-ratio:1 / 1;grid-auto-flow:column;grid-auto-columns:calc((100% - var(--arq-space-gap-md) * (var(--cols) - 1)) / (var(--cols) + .4));gap:var(--arq-space-gap-md);overscroll-behavior-x:contain;scroll-snap-type:x proximity;scrollbar-width:none;display:grid;overflow-x:auto}.cards::-webkit-scrollbar{display:none}.cards>*{scroll-snap-align:start}.all{padding:0 var(--page-gutter) var(--arq-space-gap-lg);flex:none;display:flex}.all[hidden]{display:none}.results{column-gap:var(--arq-space-section-2xs);row-gap:var(--arq-space-gap-lg);display:grid}.results.has-both{grid-template-columns:minmax(0, 1fr) minmax(0, var(--arq-layout-search-field))}.results.has-both .group-collections{grid-area:1/2/span 2}.results.has-both .see-all{grid-area:2/1}.see-all,.group{min-width:0}.group-title{margin:0 0 var(--arq-space-gap-lg);color:var(--arq-color-text-tertiary)}.list{gap:var(--arq-space-gap-lg);flex-direction:column;display:flex}.collections{gap:var(--arq-space-gap-md);flex-direction:column;display:flex}@media (width>=1600px){.cards{--cols:5}}@media (width<=1023px){.cards{--cols:3}.results.has-both{grid-template-columns:minmax(0,1fr)}.results.has-both .group-collections,.results.has-both .see-all{grid-area:auto}}@media (width<=767px){.cards{--cols:3;grid-auto-columns:max(var(--arq-layout-card-min), calc((100% - var(--arq-space-gap-md) * (var(--cols) - 1)) / (var(--cols) + .4)))}}:host{--bar-height:calc(var(--arq-space-gap-md) * 2 + var(--arq-icon-xl));--sheet-slow:var(--arq-motion-duration-panel)}@media (height<=760px){.content{padding-block:var(--arq-space-gap-xl)}}@media (height<=600px){.content{padding-block:var(--arq-space-gap-md)}.field-row{padding-top:var(--arq-space-gap-sm)}}", ka = matchMedia("(max-width: 767px)"), Y = (e) => String(e ?? "").replace(/[&<>"]/g, (e) => ({
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;"
})[e]), Aa = (e) => e.image ? ` image="${Y(e.image)}"` : "";
(class extends F {
	static tag = "arq-search-sheet";
	static styles = Oa;
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
	static template = "<dialog class=\"dialog\"><div class=\"sheet\"><div class=\"bar\"><arq-logo class=\"logo\"></arq-logo><arq-icon-button class=\"close\" icon=\"close\" size=\"large\" background=\"none\">Cerrar búsqueda</arq-icon-button></div><div class=\"drawer\"><div class=\"drawer-inner\"><div class=\"field-row\"><arq-search-field class=\"field\" type=\"line\"></arq-search-field></div><div class=\"content\"><div class=\"recommended\"><p class=\"title role-label\"></p><div class=\"cards\"></div></div><div class=\"results\"></div></div><div class=\"all\" hidden><arq-button class=\"all-button\" type=\"underline\" show-underline show-icon icon=\"arrow-right\"></arq-button></div></div></div></div></dialog>";
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
		this.#r = e ?? [], this.shadowRoot && this.#c();
	}
	get results() {
		return this.#i;
	}
	set results(e) {
		this.#i = e?.query ? e : null, this.shadowRoot && !this.#n && this.#d();
	}
	get items() {
		return [...this.shadowRoot.querySelectorAll(".results arq-search-result, .results arq-search-collection")];
	}
	setup() {
		let e = this.shadowRoot;
		this.#e = e.querySelector("dialog"), e.querySelector(".close").addEventListener("click", () => this.close());
		let t = () => e.querySelector(".logo").size = ka.matches ? "small" : "default";
		ka.addEventListener("change", t), t(), this.inline ? (this.#e.show(), this.#e.classList.add("is-open")) : (R(this.#e), this.#e.addEventListener("cancel", (e) => {
			e.preventDefault(), this.close();
		}), this.#e.addEventListener("click", (e) => {
			e.target === this.#e && this.close();
		})), this.#c(), this.#d(), window.addEventListener("resize", () => this.#l());
	}
	update(e) {
		let t = this.shadowRoot;
		if (e.has("label") && this.#e.setAttribute("aria-label", this.label ?? ""), e.has("recommendedTitle") && (t.querySelector(".title").textContent = this.recommendedTitle ?? ""), e.has("allHref") || e.has("allLabel")) {
			let e = t.querySelector(".all-button");
			e.setAttribute("href", this.allHref ?? "/arq/productos"), e.textContent = this.allLabel ?? "";
		}
		e.has("placeholder") && (this.field.placeholder = this.placeholder ?? ""), e.has("open") && !this.inline && (this.open ? this.#a() : this.#o());
	}
	#a() {
		clearTimeout(this.#n), this.#n = null;
		let e = this.#e;
		e.open || (e.showModal(), e.offsetHeight, this.#l(), requestAnimationFrame(() => this.field.focus({ preventScroll: !0 }))), e.classList.add("is-open");
	}
	#o() {
		let e = this.#e;
		!e.open || this.#n || (e.classList.remove("is-open"), this.#n = setTimeout(() => {
			this.#n = null, e.close(), this.#t?.focus?.(), this.#t = null, this.#d();
		}, this.#s()));
	}
	#s() {
		let { transitionDuration: e } = getComputedStyle(this.shadowRoot.querySelector(".sheet"));
		return Math.max(0, ...e.split(",").map((e) => (parseFloat(e) || 0) * (/mss*$/.test(e) ? 1 : 1e3)));
	}
	show(e = null) {
		this.#t = e, this.open = !0;
	}
	close() {
		this.open && (this.open = !1, this.emit("close"));
	}
	#c() {
		let e = this.shadowRoot;
		e.querySelector(".cards").replaceChildren(...this.#r.map(({ name: e, href: t, image: n }) => {
			let r = document.createElement("arq-search-card");
			return Object.assign(r, {
				href: t,
				image: n
			}), r.textContent = e, r;
		})), e.querySelector(".recommended").dataset.empty = String(this.#r.length === 0), this.#u(), this.#l();
	}
	#l() {
		if (!this.#e?.open) return;
		let e = this.shadowRoot, t = e.querySelector(".cards");
		t.style.removeProperty("--card-ratio");
		let n = e.querySelector(".content"), r = 1;
		for (let e = 0; e < 3; e++) {
			let e = n.scrollHeight - n.clientHeight, i = t.firstElementChild?.getBoundingClientRect().width;
			if (e <= 0 || !i) break;
			r = i / Math.max(1, i / r - e), t.style.setProperty("--card-ratio", String(r));
		}
	}
	#u() {
		this.shadowRoot.querySelector(".all").hidden = !!this.#i || this.#r.length === 0;
	}
	#d() {
		let e = this.shadowRoot, t = this.#i, n = e.querySelector(".results");
		if (e.querySelector(".recommended").hidden = !!t, this.#u(), n.hidden = !t, !t) {
			n.replaceChildren();
			return;
		}
		let r = t.items ?? [], i = r.filter((e) => e.kind !== "collection"), a = r.filter((e) => e.kind === "collection"), o = `<arq-search-see-all type="simple" href="${Y(t.href)}" term="${Y(t.query)}" count="${t.total ?? r.length}"></arq-search-see-all>`, s = Y(t.query);
		n.classList.toggle("has-both", i.length > 0 && a.length > 0), n.innerHTML = r.length ? (i.length ? `<section class="group"><h3 class="group-title role-label">Productos</h3><div class="list">${i.map((e) => `<arq-search-result type="simple" term="${s}" href="${Y(e.href)}"${Aa(e)}>${Y(e.name)}</arq-search-result>`).join("")}</div></section>` : "") + (a.length ? `<section class="group group-collections"><h3 class="group-title role-label">Colecciones</h3><div class="collections">${a.map((e) => `<arq-search-collection term="${s}" href="${Y(e.href)}"${Aa(e)}>${Y(e.name)}</arq-search-collection>`).join("")}</div></section>` : "") + `<div class="see-all">${o}</div>` : `<arq-search-dropdown state="no-results" term="${Y(t.query)}"></arq-search-dropdown>`;
	}
}).define();
//#endregion
//#region src/components/nav-link/nav-link.css?inline
var ja = ":host{vertical-align:middle;max-width:100%;display:inline-flex}.link{box-sizing:border-box;align-items:center;gap:var(--arq-space-gap-sm);background:var(--arq-color-surface-transparent);max-width:100%;color:var(--arq-color-text-primary);font:inherit;text-align:start;cursor:pointer;-webkit-tap-highlight-color:var(--arq-color-surface-transparent);border:0;margin:0;padding:0;text-decoration:none;display:inline-flex;position:relative}.label{white-space:nowrap;min-width:0}.indicator{width:var(--arq-space-gap-sm);height:var(--arq-border-strong);background:var(--arq-color-border-strong);transition-property:background-color;transition-duration:var(--arq-theme-text-duration,var(--arq-motion-duration-fast));transition-delay:var(--arq-theme-text-delay,0s);flex:none;display:none}.current .indicator{display:block}.chevron{flex:none;display:none}:host([has-dropdown]) .chevron{display:inline-flex}.chevron .icon{width:var(--arq-icon-sm);height:var(--arq-icon-sm)}[aria-expanded=true] .chevron .icon{transform:rotate(180deg)}.trailing{display:none}.link:after{content:\"\";inset-inline:0;top:calc(100% + var(--arq-space-padding-2xs) - var(--arq-border-default));height:var(--arq-border-default);background:var(--arq-color-border-strong);visibility:hidden;position:absolute}@media (hover:hover) and (pointer:fine){.link:not(.current):not([aria-expanded=true]):hover:after{visibility:visible}}.link:active{color:var(--arq-color-text-tertiary)}.link:active:after{visibility:hidden}.link:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.link:focus:not(:focus-visible){outline:none}@media (width>=768px){:host([theme=inverse]) .link,:host([theme=inverse]) .link:active{color:var(--arq-color-text-inverse)}:host([theme=inverse]) .indicator,:host([theme=inverse]) .link:after{background:var(--arq-color-icon-inverse)}:host([theme=inverse]) .chevron{color:var(--arq-color-icon-inverse)}}@media (width<=767px){:host{width:100%;display:flex}.link{width:100%;padding:var(--arq-space-gap-md) var(--arq-layout-gutter)}.label{white-space:normal;flex:1}:host([has-dropdown]) .chevron{display:none}.trailing{flex:none;display:inline-flex}.trailing .icon{width:var(--arq-icon-md);height:var(--arq-icon-md)}.trailing [data-icon=arrow-right],.current .trailing [data-icon=chevron-right]{display:none}.current .trailing [data-icon=arrow-right]{display:block}.link:after{display:none}.link:active{background:var(--arq-color-surface-selected);color:var(--arq-color-text-primary)}@media (hover:hover) and (pointer:fine){.link:not(:active):hover{background:var(--arq-color-surface-hover)}}.link:focus-visible{outline-offset:calc(var(--arq-border-strong) * -1)}}", Ma = matchMedia("(max-width: 767px)");
(class extends F {
	static tag = "arq-nav-link";
	static styles = ja;
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
	static template = `<a class="link"><span class="indicator" aria-hidden="true"></span><span class="label role-body"><slot></slot></span><span class="chevron">${I("chevron-down")}</span><span class="trailing">${I("chevron-right")}${I("arrow-right")}</span></a>`;
	#e = null;
	setup() {
		this.#e = this.shadowRoot.querySelector(".link"), Ma.addEventListener("change", () => this.#t()), this.#t();
	}
	#t() {
		let e = this.shadowRoot.querySelector(".label"), t = !Ma.matches;
		e.classList.toggle("role-body", t && !this.current), e.classList.toggle("role-body-medium", t && this.current), e.classList.toggle("role-heading-3", !t);
	}
	focus(e) {
		this.#e ? this.#e.focus(e) : super.focus(e);
	}
	update(e) {
		e.has("hasDropdown") && this.#n();
		let t = this.#e;
		t.localName === "a" ? (this.href === null ? t.removeAttribute("href") : t.setAttribute("href", this.href), this.current ? t.setAttribute("aria-current", "page") : t.removeAttribute("aria-current")) : t.setAttribute("aria-expanded", String(this.open)), t.classList.toggle("current", this.current), e.has("current") && this.#t();
	}
	#n() {
		let e = this.hasDropdown ? "button" : "a", t = this.#e;
		if (t.localName === e) return;
		let n = document.createElement(e);
		n.className = t.className, e === "button" && (n.type = "button", n.addEventListener("click", () => this.emit("toggle", { open: !this.open }))), n.append(...t.childNodes), t.replaceWith(n), this.#e = n;
	}
}).define();
//#endregion
//#region src/components/navbar/navbar.css?inline
var Na = ":host{--mega-slow:var(--arq-motion-duration-panel);--bar-height:calc(var(--arq-space-gap-md) * 2 + var(--arq-icon-xl));z-index:4;transition:transform var(--arq-motion-duration-base) var(--arq-motion-easing-standard);display:block;position:sticky;top:0}@media (width<=767px){:host([data-arq-compare-hidden]){transform:translateY(-100%)}}:host([theme=transparent]){margin-bottom:calc(-1 * var(--bar-height))}.navbar{position:relative}.scrim{z-index:-1;background:var(--arq-color-overlay-scrim);opacity:0;pointer-events:none;transition:opacity var(--mega-slow) var(--arq-motion-easing-standard);position:fixed;inset:0}.mega-open .scrim{opacity:1;pointer-events:auto}.bar{box-sizing:border-box;justify-content:space-between;align-items:center;gap:var(--arq-space-gap-xl);height:var(--bar-height);padding:0 var(--page-gutter);border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle);background:var(--arq-color-surface-default);color:var(--arq-color-text-primary);transition-property:background-color,border-color;transition-duration:var(--arq-theme-bg-duration,var(--arq-motion-duration-fast)), var(--arq-theme-text-duration,var(--arq-motion-duration-fast));transition-delay:0s, var(--arq-theme-text-delay,0s);transition-timing-function:var(--arq-theme-bg-easing,var(--arq-motion-easing-standard)), var(--arq-theme-text-easing,var(--arq-motion-easing-standard));display:flex}.over-photo .bar{background:var(--arq-color-overlay-translucent);-webkit-backdrop-filter:blur(var(--arq-blur-backdrop))}.over-photo .logo{color:var(--arq-color-text-inverse)}.logo{flex:none}.right{align-items:center;gap:var(--arq-space-gap-xl);min-width:0;display:flex}.links{align-items:center;gap:var(--arq-space-gap-xl);display:flex}.search{align-items:center;display:flex;position:relative}.search-box{width:var(--arq-layout-search-field);position:relative}.search-dropdown{top:100%;position:absolute;inset-inline:0}.actions{display:none}.mega-wrap{top:100%;transition:grid-template-rows var(--mega-slow) var(--arq-motion-easing-standard);grid-template-rows:0fr;display:grid;position:absolute;inset-inline:0}.mega-wrap[hidden]{display:none}.mega-wrap.is-open{grid-template-rows:1fr}.mega-drawer{min-height:0;overflow:clip}.mega{opacity:0;transition-property:opacity;transition-duration:var(--arq-motion-duration-slow);transition-timing-function:var(--arq-motion-easing-standard)}.mega-wrap.is-open .mega{opacity:1}.mega-motion .bar{transition-duration:var(--mega-slow), var(--mega-slow);transition-delay:0s;transition-timing-function:var(--arq-motion-easing-standard)}.menu{box-sizing:border-box;border-radius:var(--arq-radius-control);background:var(--arq-color-surface-default);width:100%;max-width:none;height:100dvh;max-height:none;color:var(--arq-color-text-primary);overscroll-behavior:contain;border:0;margin:0;padding:0;inset:0}.menu[open]{flex-direction:column;display:flex}.menu-bar{box-sizing:border-box;height:var(--bar-height);padding:0 var(--page-gutter);border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle);flex:none;justify-content:space-between;align-items:center;display:flex}.menu-main{padding-block:var(--arq-space-gap-sm);flex-direction:column;display:flex}.menu-products{padding:var(--arq-space-gap-sm) 0 var(--arq-space-gap-xl);flex-direction:column;display:flex}.back{align-items:center;gap:var(--arq-space-gap-xs);padding:var(--arq-space-gap-sm) var(--page-gutter);color:var(--arq-color-text-secondary);text-align:start;cursor:pointer;background:0 0;border:0;display:flex}.back .icon{box-sizing:content-box;width:var(--arq-icon-md);height:var(--arq-icon-md);padding:var(--arq-space-padding-xs);color:var(--arq-color-icon-primary)}.back:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:calc(var(--arq-border-strong) * -1)}.groups,.sub-list{padding:var(--arq-space-gap-md) var(--page-gutter) var(--arq-space-padding-md);flex-direction:column;display:flex}.menu-sub{min-height:0;padding:var(--arq-space-gap-sm) 0 var(--arq-space-gap-xl);flex-direction:column;flex:1;display:flex}.menu-sub[hidden]{display:none}.back-sub{flex:none}.sub-list{overscroll-behavior:contain;flex:0 auto;min-height:0;overflow-y:auto}.sub-cta{padding:var(--arq-space-gap-md) var(--page-gutter) 0;flex:none}.sub-cta:empty{display:none}.menu-sub--colecciones{padding-bottom:var(--arq-space-padding-md)}.menu-sub--colecciones .sub-list{padding-block:0}.menu-sub--grupos .sub-list{padding-bottom:0}.sub-group{flex-direction:column;display:flex}.sub-group+.sub-group{padding-top:var(--arq-space-padding-lg)}.sub-eyebrow{color:var(--arq-color-text-tertiary);margin:0}.sub-group-cta{margin-top:var(--arq-space-padding-md);padding-top:var(--arq-space-gap-md)}@media (width<=767px){.right{display:contents}.links,.search{display:none}.actions{align-items:center;gap:var(--arq-space-gap-sm);display:flex}}@media print{:host,:host([theme=transparent]),:host([data-arq-compare-hidden]){margin-bottom:0;position:static;transform:none}.bar,.over-photo .bar{padding-inline:var(--page-gutter);background:var(--arq-color-surface-default);-webkit-backdrop-filter:none;border-bottom:none}.over-photo .logo{color:var(--arq-color-text-primary)}.right,.actions,.mega-wrap,.scrim,.menu{display:none}}", X = matchMedia("(max-width: 767px)"), Pa = matchMedia("(prefers-reduced-transparency: reduce), (prefers-contrast: more)"), Z = (e) => String(e ?? "").replace(/[&<>"]/g, (e) => ({
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;"
})[e]), Fa = 5, Ia = 150, Q = [
	"interior",
	"exterior",
	"lamparas-y-artefactos",
	"colecciones"
];
(class extends F {
	static tag = "arq-navbar";
	static styles = Na;
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
				...Q
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
	static template = `<header class="navbar"><div class="scrim" aria-hidden="true"></div><nav class="bar"><arq-logo class="logo"></arq-logo><div class="right"><div class="links"><slot name="links"></slot></div><div class="search"><arq-icon-button class="search-open" icon="search">Buscar</arq-icon-button><div class="search-box" hidden><arq-search-field class="search-field" show-close></arq-search-field><arq-search-dropdown class="search-dropdown" data-arq-theme="light" hidden></arq-search-dropdown></div></div><div class="actions"><arq-icon-button class="search-open-mobile" icon="search">Buscar</arq-icon-button><arq-icon-button class="menu-open" icon="menu">Abrir menú</arq-icon-button></div></div></nav><div class="mega-wrap" hidden><div class="mega-drawer"><arq-mega-menu class="mega" data-arq-theme="light"></arq-mega-menu></div></div></header><dialog class="menu" data-arq-theme="light"><div class="menu-bar"><arq-logo class="menu-logo" size="small"></arq-logo><arq-icon-button class="menu-close" icon="close" background="subtle">Cerrar menú</arq-icon-button></div><div class="menu-main"></div><div class="menu-products" hidden><button type="button" class="back role-body-medium">${I("chevron-left")}<span>Productos</span></button><div class="groups"></div></div><div class="menu-sub" hidden><button type="button" class="back back-sub role-body-medium">${I("chevron-left")}<span class="sub-label"></span></button><div class="sub-list"></div><div class="sub-cta"></div></div></dialog><arq-search-screen class="search-screen" data-arq-theme="light"></arq-search-screen><arq-search-sheet class="search-sheet" data-arq-theme="light"></arq-search-sheet>`;
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
		this.#e = e, this.#y();
	}
	setup() {
		let e = this.shadowRoot;
		this.#c(), X.addEventListener("change", () => {
			this.#h(), this.#c();
		}), Pa.addEventListener("change", () => this.#l()), this.addEventListener("arq:toggle", (e) => {
			e.target.localName === "arq-nav-link" && (e.stopPropagation(), X.matches ? this.#u("products") : this.#_(e.detail.open));
		});
		for (let t of e.querySelectorAll(".search-open, .search-open-mobile")) for (let e of ["pointerenter", "focusin"]) t.addEventListener(e, () => this.#T(), { once: !0 });
		let t = e.querySelector(".search-sheet");
		e.querySelector(".search-open").addEventListener("click", (e) => {
			this.#u("search"), this.#d && this.#E(e.currentTarget);
		}), t.addEventListener("arq:close", (e) => {
			e.stopPropagation(), this.#u("default");
		});
		let n = e.querySelector(".search-field");
		n.addEventListener("arq:close", (t) => {
			t.stopPropagation(), this.#u("default"), e.querySelector(".search-open").focus();
		}), e.querySelector(".search-box").addEventListener("keydown", (t) => {
			t.key === "Escape" && (t.stopPropagation(), e.querySelector(".search-dropdown").hidden ? (this.#u("default"), e.querySelector(".search-open").focus()) : this.#D(!1));
		});
		let r = e.querySelector(".search-screen");
		e.querySelector(".search-open-mobile").addEventListener("click", (e) => {
			this.#u("search"), this.#d ? this.#E(e.currentTarget) : r.show(e.currentTarget);
		}), r.addEventListener("arq:close", (e) => {
			e.stopPropagation(), this.#u("default");
		});
		for (let e of [
			n,
			r,
			t
		]) e.addEventListener("arq:input", (e) => {
			e.stopPropagation(), this.#C(e.detail.value);
		}), e.addEventListener("arq:navigate", (e) => {
			e.stopPropagation(), this.#A(e.detail.step);
		}), e.addEventListener("arq:submit", (e) => {
			e.stopPropagation(), this.#M(e.detail.value);
		});
		let i = e.querySelector(".menu");
		e.querySelector(".menu-open").addEventListener("click", () => this.#u("menu")), e.querySelector(".menu-close").addEventListener("click", () => this.#u("default")), i.addEventListener("cancel", (e) => {
			e.preventDefault(), this.#u(Q.includes(this.mode) ? "products" : this.mode === "products" ? "menu" : "default");
		}), e.querySelector(".back").addEventListener("click", () => this.#u("menu")), e.querySelector(".back-sub").addEventListener("click", () => this.#u("products")), e.querySelector(".groups").addEventListener("click", (e) => {
			let t = e.target.closest("arq-mega-link[data-sub]");
			t && this.#u(t.dataset.sub);
		}), R(e.querySelector(".navbar"), { when: () => this.#m }), e.querySelector(".scrim").addEventListener("click", () => this.#_(!1)), this.addEventListener("keydown", (e) => {
			e.key === "Escape" && this.#m && (e.stopPropagation(), this.#_(!1), this.#s()?.focus());
		}), document.addEventListener("click", (e) => {
			e.composedPath().includes(this) || (this.#_(!1), this.mode === "search" && !X.matches && this.#D(!1));
		});
		let a = () => {
			let e = document.querySelector("arq-hero"), t = e ? e.getBoundingClientRect().bottom <= this.shadowRoot.querySelector(".bar").getBoundingClientRect().bottom : window.scrollY > 0;
			t !== this.#p && (this.#p = t, this.shadowRoot.querySelector(".navbar").classList.toggle("scrolled", t), this.#l());
		};
		window.addEventListener("scroll", a, { passive: !0 }), window.addEventListener("resize", a, { passive: !0 });
		let o = document.querySelector("arq-hero");
		o && new ResizeObserver(a).observe(o), a(), this.shadowRoot.querySelector("slot[name=\"links\"]").addEventListener("slotchange", () => this.#l()), this.#l();
	}
	update(e) {
		e.has("label") && this.shadowRoot.querySelector(".bar").setAttribute("aria-label", this.label ?? ""), (e.has("theme") || e.has("mode")) && this.#l();
	}
	#s() {
		return this.querySelector("arq-nav-link[has-dropdown]");
	}
	#c() {
		let e = this.shadowRoot, t = e.querySelector("slot[name=\"links\"]");
		e.querySelector(X.matches ? ".menu-main" : ".links").append(t), e.querySelector(".logo").size = X.matches ? "small" : "default";
	}
	#l() {
		let e = this.mode === "default" || this.mode === "search" && (!X.matches || this.#d), t = this.theme === "transparent" && e && !this.#p && !this.#m && !Pa.matches;
		this.shadowRoot.querySelector(".navbar").classList.toggle("over-photo", t);
		for (let e of this.querySelectorAll("arq-nav-link")) e.theme = t ? "inverse" : "default";
		for (let e of this.shadowRoot.querySelectorAll(".search-open, .actions arq-icon-button")) t ? e.setAttribute("data-arq-theme", "dark") : e.removeAttribute("data-arq-theme");
	}
	#u(e) {
		let t = this.shadowRoot, n = this.mode;
		this.mode = e, this.#_(!1);
		let r = t.querySelector(".menu"), i = X.matches, a = e === "search" && !i && !this.#d;
		t.querySelector(".search-open").hidden = a, t.querySelector(".search-box").hidden = !a, a && requestAnimationFrame(() => t.querySelector(".search-field").focus()), e !== "search" && this.#O();
		let o = Q.includes(e), s = e === "menu" || e === "products" || o;
		if (s && !r.open ? (this.#f = t.querySelector(".menu-open"), r.showModal(), e === "menu" && t.querySelector(".menu-close").focus()) : !s && r.open && (r.close(), this.#f?.focus()), t.querySelector(".menu-main").hidden = e !== "menu", t.querySelector(".menu-products").hidden = e !== "products", t.querySelector(".menu-sub").hidden = !o, o && this.#S(e), e === "products") {
			this.#v();
			let e = Q.includes(n) && t.querySelector(`.groups [data-sub="${n}"]`);
			requestAnimationFrame(() => (e || t.querySelector(".back")).focus());
		} else o ? requestAnimationFrame(() => t.querySelector(".back-sub").focus()) : e === "menu" && n === "products" && requestAnimationFrame(() => this.#s()?.focus());
		e !== "search" && (t.querySelector(".search-screen").open = !1, t.querySelector(".search-sheet").open = !1), this.#l();
	}
	get #d() {
		return this.search === "sheet";
	}
	#f = null;
	#p = !1;
	#m = !1;
	#h() {
		this.mode !== "default" && this.#u("default"), this.#_(!1);
	}
	#g = 0;
	#_(e) {
		let t = this.shadowRoot, n = t.querySelector(".mega-wrap"), r = t.querySelector(".navbar"), i = this.#s(), a = !!e && !X.matches;
		if (a && this.#v(), a && this.mode === "search" && this.#u("default"), i && (i.open = a), a !== this.#m) {
			clearTimeout(this.#g), a && (n.hidden = !1, n.offsetHeight), r.classList.add("mega-motion"), a ? r.setAttribute("data-arq-theme", "light") : r.removeAttribute("data-arq-theme"), n.classList.toggle("is-open", a), r.classList.toggle("mega-open", a);
			let { transitionDuration: e } = getComputedStyle(n), t = Math.max(0, ...e.split(",").map((e) => (parseFloat(e) || 0) * (/mss*$/.test(e) ? 1 : 1e3)));
			this.#g = setTimeout(() => {
				r.classList.remove("mega-motion"), this.#m || (n.hidden = !0);
			}, t);
		}
		this.#m = a, this.#l();
	}
	#v() {
		this.#e || this.#t || (this.#t = Xt().then((e) => this.navigation = e).catch((e) => console.error("[arq] navbar: no se pudo cargar la navegación", e)).finally(() => this.#t = null));
	}
	#y() {
		let e = this.shadowRoot, t = this.#e;
		e.querySelector(".mega").navigation = t, e.querySelector(".groups").innerHTML = Q.map((e) => ({
			id: e,
			label: this.#b(e)
		})).filter((e) => e.label).map((e) => `<arq-mega-link submenu data-sub="${e.id}">${Z(e.label)}</arq-mega-link>`).join(""), Q.includes(this.mode) && this.#S(this.mode);
	}
	#b(e) {
		let t = this.#e;
		return e === "colecciones" ? t?.collections?.length ? "Colecciones" : "" : e === "lamparas-y-artefactos" ? this.#x(e).length ? "Lámparas y artefactos" : "" : t?.sections?.[e]?.label ?? "";
	}
	#x(e) {
		let t = this.#e?.sections ?? {};
		return e === "lamparas-y-artefactos" ? [t.lamparas, t.artefactos].filter(Boolean) : [];
	}
	#S(e) {
		let t = this.shadowRoot, n = this.#e, r = t.querySelector(".menu-sub");
		r.classList.toggle("menu-sub--colecciones", e === "colecciones"), r.classList.toggle("menu-sub--grupos", e === "lamparas-y-artefactos"), t.querySelector(".sub-label").textContent = this.#b(e);
		let i = "", a = "";
		if (e === "colecciones") i = (n?.collections ?? []).map((e) => `<arq-mega-link size="large" show-image href="${Z(e.href)}"${e.thumb ? ` image="${Z(e.thumb)}"` : ""}>${Z(e.label)}<span slot="meta">${Z(e.meta)}</span></arq-mega-link>`).join(""), n?.allCollections && (a = `<arq-button type="underline" show-underline href="${Z(n.allCollections.href)}">Ver todo</arq-button>`);
		else if (e === "lamparas-y-artefactos") i = this.#x(e).map((e) => `<div class="sub-group" role="group" aria-label="${Z(e.label)}"><p class="sub-eyebrow role-label" aria-hidden="true">${Z(e.label)}</p>` + e.links.map((e) => `<arq-mega-link size="large" show-image href="${Z(e.href)}"${e.thumb ? ` image="${Z(e.thumb)}"` : ""}>${Z(e.label)}</arq-mega-link>`).join("") + `<div class="sub-group-cta"><arq-button type="underline" show-underline show-icon icon="arrow-right" href="${Z(e.all.href)}">${Z(e.all.label)}</arq-button></div></div>`).join("");
		else {
			let t = n?.sections?.[e];
			i = (t?.links ?? []).map((e) => `<arq-mega-link size="large" href="${Z(e.href)}">${Z(e.label)}</arq-mega-link>`).join(""), t && (a = `<arq-button type="underline" show-underline show-icon icon="arrow-right" href="${Z(t.all.href)}">${Z(t.all.label)}</arq-button>`);
		}
		t.querySelector(".sub-list").innerHTML = i, t.querySelector(".sub-cta").innerHTML = a, t.querySelector(".sub-list").scrollTop = 0;
	}
	#C(e) {
		if (clearTimeout(this.#a), this.#o = e.trim(), !this.#o) {
			this.#w([], 0);
			return;
		}
		this.#a = setTimeout(async () => {
			let e = this.#o;
			try {
				let { results: t, total: n } = await Wt(e, { limit: Fa });
				e === this.#o && this.#w(t, n);
			} catch (e) {
				console.error("[arq] navbar: no se pudo buscar", e);
			}
		}, Ia);
	}
	#w(e, t) {
		let n = this.shadowRoot;
		this.#r = e, this.#i = -1;
		let r = this.#o, i = e.map((e) => `<arq-search-result href="${Z(e.href)}"${e.image ? ` image="${Z(e.image)}"` : ""}>${Z(e.name)}<span slot="meta">${Z(e.meta)}</span></arq-search-result>`).join("") + (e.length ? `<arq-search-see-all href="${Z(Gt(r))}" term="${Z(r)}" count="${t}"></arq-search-see-all>` : ""), a = r && !e.length, o = n.querySelector(".search-dropdown");
		o.state = a ? "no-results" : "results", o.term = r, o.innerHTML = i, this.#D(!!r);
		let s = n.querySelector(".search-screen");
		s.innerHTML = a ? `<arq-search-dropdown state="no-results" term="${Z(r)}"></arq-search-dropdown>` : i, n.querySelector(".search-sheet").results = {
			query: r,
			items: e,
			total: t,
			href: Gt(r)
		}, this.#j();
	}
	#T() {
		if (this.#n || this.search !== "sheet") return;
		let e = this.shadowRoot.querySelector(".search-sheet");
		this.#n = At().then((t) => e.recommended = t).catch((e) => {
			this.#n = null, console.error("[arq] navbar: no se pudieron cargar los recomendados", e);
		});
	}
	#E(e) {
		this.#T();
		let t = this.shadowRoot.querySelector(".search-sheet");
		t.toggleAttribute("over-photo", this.shadowRoot.querySelector(".navbar").classList.contains("over-photo")), t.show(e);
	}
	#D(e) {
		this.shadowRoot.querySelector(".search-dropdown").hidden = !e;
	}
	#O() {
		clearTimeout(this.#a), this.#o = "";
		let e = this.shadowRoot;
		e.querySelector(".search-field").value = "", e.querySelector(".search-screen").field.value = "", e.querySelector(".search-sheet").field.value = "", this.#w([], 0);
	}
	#k() {
		let e = this.shadowRoot;
		return this.#d ? e.querySelector(".search-sheet").items : [...(X.matches ? e.querySelector(".search-screen") : e.querySelector(".search-dropdown")).querySelectorAll("arq-search-result")];
	}
	#A(e) {
		let t = this.#k();
		t.length && (this.#i = this.#i < 0 && e < 0 ? t.length - 1 : (this.#i + e + t.length) % t.length, t.forEach((e, t) => e.active = t === this.#i), !X.matches && !this.#d && this.#D(!0), this.#j());
	}
	#j() {
		let e = this.#r[this.#i], t = e ? `${e.name}, ${e.meta}, ${this.#i + 1} de ${this.#r.length}` : "";
		this.shadowRoot.querySelector(".search-field").activeLabel = t, this.shadowRoot.querySelector(".search-screen").field.activeLabel = t, this.shadowRoot.querySelector(".search-sheet").field.activeLabel = t;
	}
	#M(e) {
		let t = this.#k()[this.#i];
		t ? t.click() : e.trim() && location.assign(Gt(e.trim()));
	}
}).define();
//#endregion
//#region src/components/announcement-bar/announcement-bar.css?inline
var La = ":host{display:block}.bar{box-sizing:border-box;padding:var(--arq-space-padding-xs) var(--page-gutter);background:var(--arq-color-surface-default);color:var(--arq-color-text-primary);text-align:center;justify-content:center;align-items:center;display:flex}@media print{:host{display:none}}";
(class extends F {
	static tag = "arq-announcement-bar";
	static styles = La;
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
var Ra = ":host{min-width:0;display:block}.item{align-items:flex-start;gap:var(--arq-space-gap-sm);flex-direction:column;display:flex;position:relative}.label{color:var(--arq-color-text-tertiary)}.value{max-width:100%;color:var(--arq-color-text-primary);overflow-wrap:anywhere;text-decoration:none}@media (hover:hover) and (pointer:fine){.value[href]:hover{text-decoration:underline;text-decoration-thickness:var(--arq-border-default);text-underline-offset:var(--arq-space-padding-2xs)}}.value:focus-visible{outline:none}.item:has(.value:focus-visible){outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}";
(class extends F {
	static tag = "arq-contact-item";
	static styles = Ra;
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
var za = ":host{min-width:0;display:block}.list{align-items:flex-start;gap:var(--arq-space-gap-sm);flex-direction:column;display:flex}.title{color:var(--arq-color-text-secondary)}.links{align-self:stretch;align-items:flex-start;gap:var(--arq-space-gap-sm);flex-direction:column;display:flex}", Ba = 0;
(class extends F {
	static tag = "arq-link-list";
	static styles = za;
	static template = "<nav class=\"list\"><span class=\"title role-body-lg-regular\"><slot name=\"title\"></slot></span><div class=\"links\" role=\"list\"><slot></slot></div></nav>";
	setup() {
		let e = this.shadowRoot, t = e.querySelector(".title");
		t.id = `arq-link-list-${++Ba}`, e.querySelector("nav").setAttribute("aria-labelledby", t.id);
		let n = e.querySelector("slot:not([name])"), r = () => {
			for (let e of n.assignedElements()) e.setAttribute("role", "listitem");
		};
		n.addEventListener("slotchange", r), r();
	}
}).define();
//#endregion
//#region src/components/option-tile/option-tile.css?inline
var Va = ":host{cursor:pointer;flex:0 auto;min-width:0;display:flex}.tile{box-sizing:border-box;min-width:0;padding:var(--arq-space-padding-sm-md) var(--arq-space-padding-md);border-bottom:var(--arq-border-default) solid var(--arq-color-border-default);border-radius:var(--arq-radius-control);color:var(--arq-color-text-secondary);text-align:center;flex:1;justify-content:center;align-items:center;display:flex}:host(:not([disabled]):not([selected]):hover) .tile{border-bottom-color:var(--arq-color-border-hover);background:var(--arq-color-surface-faint);color:var(--arq-color-text-primary)}:host([selected]) .tile{border-bottom-color:var(--arq-color-border-strong);background:var(--arq-color-surface-soft);color:var(--arq-color-text-primary)}:host([disabled]){cursor:default}:host([disabled]) .tile{border-bottom-color:var(--arq-color-border-disabled);color:var(--arq-color-text-disabled);text-decoration:line-through}:host(:focus-visible){outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}:host(:focus:not(:focus-visible)){outline:none}";
(class extends F {
	static tag = "arq-option-tile";
	static styles = Va;
	static properties = {
		selected: { type: Boolean },
		disabled: { type: Boolean },
		value: { type: String }
	};
	static template = "<span class=\"tile role-body-regular\"><slot></slot></span>";
	setup() {
		this.selectable = new _r(this, {
			role: "radio",
			state: "aria-checked"
		});
	}
}).define();
//#endregion
//#region src/components/swatch-picker/swatch-picker.css?inline
var Ha = ":host{align-items:center;gap:var(--arq-space-gap-sm-md);flex-wrap:wrap;display:flex}";
(class extends F {
	static tag = "arq-swatch-picker";
	static styles = Ha;
	static properties = { label: { type: String } };
	static template = "<slot></slot>";
	setup() {
		this.setAttribute("role", "radiogroup"), this.select = new jr(this, { items: "arq-swatch" });
		let e = () => {
			for (let e of this.select.items) {
				let t = e.hasAttribute("selected") ? "large" : "default";
				e.getAttribute("size") !== t && e.setAttribute("size", t);
			}
		};
		new MutationObserver(e).observe(this, {
			childList: !0,
			subtree: !0,
			attributes: !0,
			attributeFilter: ["selected"]
		}), e();
	}
	update(e) {
		e.has("label") && (this.label ? this.setAttribute("aria-label", this.label) : this.removeAttribute("aria-label"));
	}
}).define();
//#endregion
//#region src/components/option-group/option-group.css?inline
var Ua = ":host{display:block}.group{align-items:flex-start;gap:var(--arq-space-gap-md);flex-direction:column;display:flex}.label{color:var(--arq-color-text-secondary)}.options{gap:var(--arq-space-gap-sm);flex-wrap:wrap;align-self:stretch;display:flex}:host([type=swatches]) .options,:host([type=select]) .options{display:block}";
(class extends F {
	static tag = "arq-option-group";
	static styles = Ua;
	static properties = {
		label: { type: String },
		type: {
			type: String,
			values: [
				"tiles",
				"select",
				"swatches"
			],
			default: "tiles"
		}
	};
	static template = "<div class=\"group\"><span class=\"label role-label\"></span><div class=\"options\"><slot></slot></div></div>";
	setup() {
		this.select = new jr(this, { items: "arq-option-tile" }), this.shadowRoot.querySelector("slot").addEventListener("slotchange", () => this.#e());
	}
	update(e) {
		e.has("label") && (this.shadowRoot.querySelector(".label").textContent = this.label ?? ""), this.type === "tiles" ? (this.setAttribute("role", "radiogroup"), this.label ? this.setAttribute("aria-label", this.label) : this.removeAttribute("aria-label")) : (this.removeAttribute("role"), this.removeAttribute("aria-label")), this.#e();
	}
	#e() {
		if (this.type !== "swatches") return;
		let e = this.querySelector("arq-swatch-picker");
		e && !e.hasAttribute("label") && this.label && (e.label = this.label);
	}
}).define();
//#endregion
//#region src/components/choice-chip/choice-chip.css?inline
var Wa = ":host{vertical-align:middle;cursor:pointer;max-width:100%;display:inline-flex}.chip{box-sizing:border-box;max-width:100%;padding:var(--arq-space-padding-sm) var(--arq-space-padding-md);border:var(--arq-border-default) solid var(--arq-color-border-default);border-radius:var(--arq-radius-control);color:var(--arq-color-text-primary);white-space:nowrap;flex:1;justify-content:center;align-items:center;display:inline-flex}@media (hover:hover) and (pointer:fine){:host(:not([disabled]):hover) .chip{border-color:var(--arq-color-border-strong)}}:host([selected]) .chip{border-color:var(--arq-color-border-strong);background:var(--arq-color-surface-inverse);color:var(--arq-color-text-inverse)}:host([disabled]){cursor:default}:host([disabled]) .chip{border-color:var(--arq-color-border-disabled);color:var(--arq-color-text-disabled)}:host(:focus-visible){outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}:host(:focus:not(:focus-visible)){outline:none}";
(class extends F {
	static tag = "arq-choice-chip";
	static styles = Wa;
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
		this.#t = this.selected, this.selectable = new _r(this, {
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
var Ga = ":host{width:100%;display:block}.input{gap:var(--arq-space-gap-sm);flex-direction:column;display:flex}.label{color:var(--arq-color-text-primary)}.field{box-sizing:border-box;align-items:center;gap:var(--arq-space-gap-sm);padding:calc(var(--arq-space-padding-sm) - var(--arq-border-default)) var(--arq-space-padding-sm-md);border:var(--arq-border-default) solid var(--arq-color-border-default);border-radius:var(--arq-radius-control);background:var(--arq-color-surface-default);display:flex}@media (hover:hover) and (pointer:fine){:host(:not([disabled]):not([error]):not([open])) .field:hover{border-color:var(--arq-color-border-hover)}}.control{box-sizing:border-box;border-radius:var(--arq-radius-control);background:var(--arq-color-surface-transparent);width:100%;min-width:0;color:var(--arq-color-text-primary);border:0;flex:1;margin:0;padding:0}.control::placeholder{color:var(--arq-color-text-tertiary);opacity:1}:host([type=textarea]) .field{align-items:stretch}textarea.control{resize:vertical}:host([type=select]) .field{position:relative}.trigger{align-items:center;gap:var(--arq-space-gap-sm);text-align:start;cursor:pointer;-webkit-tap-highlight-color:var(--arq-color-surface-transparent);display:flex}.select-value{overflow-wrap:break-word;flex:auto;min-width:0}.select-value.placeholder{color:var(--arq-color-text-tertiary)}.chevron{flex:none;display:inline-flex}.icon{width:var(--arq-icon-md);height:var(--arq-icon-md);color:var(--arq-color-icon-primary)}:host(:not([open])) [data-icon=chevron-up],:host([open]) [data-icon=chevron-down]{display:none}.menu{top:calc(100% + var(--arq-border-default));left:calc(-1 * var(--arq-border-default));z-index:2;width:calc(100% + 2 * var(--arq-border-default));transform-origin:top;max-width:none;transition:opacity var(--arq-motion-duration-fade) var(--arq-motion-easing-out), transform var(--arq-motion-duration-base) var(--arq-motion-easing-out);position:absolute}@starting-style{.menu:not([hidden]){opacity:0;transform:scale(.97)}}:host([open]) .field,:host([open]) .field:focus-within{border-color:var(--arq-color-border-strong)}:host([disabled]) .trigger{cursor:default}:host([disabled]) .icon{color:var(--arq-color-icon-disabled)}.helper{color:var(--arq-color-text-tertiary);margin:0}.error{color:var(--arq-color-text-error);margin:0}.error-wrap{margin-top:calc(-1 * var(--arq-space-gap-sm));transition:grid-template-rows var(--arq-motion-duration-base) var(--arq-motion-easing-out);grid-template-rows:1fr;display:grid}.error-wrap>.error{min-height:0;padding-top:var(--arq-space-gap-sm);transition:opacity var(--arq-motion-duration-fade) var(--arq-motion-easing-out);overflow:hidden}@starting-style{.error-wrap:not([hidden]){grid-template-rows:0fr}.error-wrap:not([hidden])>.error{opacity:0}}.control:focus,.control:focus-visible{outline:none}.field:has(.control:focus-visible){outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}:host([error]) .field,:host([error]) .field:focus-within{border-color:var(--arq-color-border-error)}:host([disabled]) .label,:host([disabled]) .helper,:host([disabled]) .control,:host([disabled]) .control::placeholder{color:var(--arq-color-text-disabled)}:host([disabled]) .field{border-color:var(--arq-color-border-disabled)}@media (prefers-contrast:more){.field{border-color:var(--arq-color-border-strong)}}", Ka = (() => {
	let e = 0;
	return () => `arq-input-${++e}`;
})(), qa = 4, Ja = [
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
(class extends F {
	static tag = "arq-input";
	static styles = Ga;
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
		control: Ka(),
		helper: Ka(),
		error: Ka()
	};
	#r = "";
	#i = [];
	#a = "";
	#o = null;
	get options() {
		return this.#i;
	}
	set options(e) {
		this.#i = Array.isArray(e) ? e.map((e) => ({
			value: String(e.value),
			label: e.label ?? String(e.value),
			disabled: !!e.disabled
		})) : [], this.#o && this.#l();
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
		this.#o ? (this.#a = t, this.#l(), this.#u()) : this.#t ? (this.#t.value = t, this.#u()) : this.setAttribute("value", t);
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
		(e.has("type") || !this.#t) && this.#s();
		let t = this.#t, n = this.shadowRoot;
		t.localName === "input" && (t.type = this.inputType);
		let r = !!this.#o;
		for (let e of r ? [] : Ja) this.hasAttribute(e) ? t.setAttribute(e, this.getAttribute(e)) : t.removeAttribute(e);
		t.localName === "textarea" && !this.hasAttribute("rows") && (t.rows = qa), t.disabled = this.disabled, n.querySelector(".label").classList.toggle("visually-hidden", !this.showLabel);
		let i = !!this.error, a = n.querySelector(".helper"), o = n.querySelector(".error");
		o.textContent = this.error ?? "", n.querySelector(".error-wrap").hidden = !i;
		let s = n.querySelector(".live");
		s.textContent !== (this.error ?? "") && (s.textContent = this.error ?? ""), a.hidden = i || !this.showHelper, t.setAttribute("aria-invalid", String(i));
		let c = [i ? this.#n.error : null, a.hidden ? null : this.#n.helper].filter(Boolean);
		c.length ? t.setAttribute("aria-describedby", c.join(" ")) : t.removeAttribute("aria-describedby"), r && (e.has("open") && (n.querySelector(".menu").hidden = !this.open, t.setAttribute("aria-expanded", String(this.open)), this.open || this.#o.closed()), this.#l()), this.#u();
	}
	formResetCallback() {
		this.value = this.#r;
	}
	formDisabledCallback(e) {
		this.#t.disabled = e || this.disabled;
	}
	#s() {
		let e = {
			textarea: "textarea",
			select: "button"
		}[this.type] ?? "input";
		if (this.#t?.localName === e) return;
		if (this.#o = null, this.shadowRoot.querySelector(".menu")?.remove(), e === "button") {
			this.#c();
			return;
		}
		let t = document.createElement(e);
		t.className = "control role-body", t.id = this.#n.control, t.value = this.#t?.value ?? this.getAttribute("value") ?? "", t.addEventListener("input", () => {
			this.#u(), this.emit("input", { value: t.value });
		}), t.addEventListener("change", () => this.emit("change", { value: t.value })), this.shadowRoot.querySelector(".field").replaceChildren(t), this.#t = t;
	}
	#c() {
		let e = this.shadowRoot, t = document.createElement("button");
		t.type = "button", t.className = "control trigger role-body", t.id = this.#n.control, t.setAttribute("aria-expanded", "false"), t.innerHTML = `<span class="select-value"></span><span class="chevron">${I("chevron-down")}${I("chevron-up")}</span>`;
		let n = e.querySelector(".field");
		n.replaceChildren(t);
		let r = document.createElement("arq-select-menu");
		r.type = "text", r.className = "menu", r.id = `${this.#n.control}-menu`, r.hidden = !0, n.append(r), this.#t = t, this.#a = this.getAttribute("value") ?? "", this.#o = new hr({
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
	#l() {
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
	#u() {
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
var Ya = ":host{width:100%;display:block}.upload{gap:var(--arq-space-gap-sm);flex-direction:column;display:flex}.label{color:var(--arq-color-text-primary)}.zone,.attached{box-sizing:border-box;padding:var(--arq-space-padding-lg);border:var(--arq-border-default) dashed var(--arq-color-border-default);border-radius:var(--arq-radius-control);background:var(--arq-color-surface-subtle);align-items:center;display:flex;position:relative}.zone{cursor:pointer;-webkit-user-select:none;user-select:none}.attached{justify-content:space-between;gap:var(--arq-space-gap-sm-md);border-style:solid}.empty{align-items:center;gap:var(--arq-space-gap-sm-md);min-width:0;display:flex}.icon{width:var(--arq-icon-md);height:var(--arq-icon-md);color:var(--arq-color-icon-primary);flex:none}.prompt,.file{min-width:0;color:var(--arq-color-text-primary)}.file{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.remove{flex:none}.helper{color:var(--arq-color-text-tertiary);margin:0}.error{color:var(--arq-color-text-error);margin:0}.drop{min-width:0;color:var(--arq-color-text-primary);display:none}:host(:state(drag-over)) .zone{border-color:var(--arq-color-border-strong);background:var(--arq-color-surface-hover)}:host(:state(drag-over)) .prompt{display:none}:host(:state(drag-over)) .drop{display:inline}:host(:state(error)) .zone{border-color:var(--arq-color-border-error)}:host([disabled]) .zone{border-color:var(--arq-color-border-disabled);cursor:default}:host([disabled]) .label,:host([disabled]) .prompt,:host([disabled]) .file,:host([disabled]) .helper{color:var(--arq-color-text-disabled)}:host([disabled]) .icon{color:var(--arq-color-icon-disabled)}.zone:has(.native:focus-visible){outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}@media (prefers-contrast:more){.zone,.attached{border-color:var(--arq-color-border-strong)}}", Xa = ".pdf,.dwg,.jpg,.jpeg,.png", Za = 10, Qa = {
	type: "El formato no está admitido.",
	size: (e) => `El archivo supera los ${e} MB.`
};
function $a(e) {
	let t = [...new Set(e.split(",").map((e) => e.trim().replace(/^\./, "").toUpperCase()).filter(Boolean).map((e) => e === "JPEG" ? "JPG" : e))];
	return t.length > 1 ? `${t.slice(0, -1).join(", ")} o ${t.at(-1)}` : t.join("");
}
(class extends F {
	static tag = "arq-file-upload";
	static styles = Ya;
	static formAssociated = !0;
	static properties = {
		accept: {
			type: String,
			default: Xa
		},
		maxSize: {
			type: Number,
			default: Za
		},
		name: { type: String },
		required: { type: Boolean },
		disabled: { type: Boolean }
	};
	static template = `<div class="upload"><span class="label role-body-regular" id="label"><slot>Adjuntar archivo</slot></span><label class="zone" id="zone"><input type="file" class="native visually-hidden" aria-labelledby="label" aria-describedby="helper error"><span class="empty">${I("plus")}<span class="prompt role-body"><slot name="prompt">Arrastrá o seleccioná planos, renders o fotos</slot></span><span class="drop role-body" aria-hidden="true"><slot name="drop">Soltá el archivo acá</slot></span></span></label><div class="attached" hidden><span class="file role-body-regular"></span><arq-button type="underline" show-underline class="remove">Quitar<span class="visually-hidden"></span></arq-button></div><p class="helper role-body-sm" id="helper"><slot name="helper"></slot></p><p class="error role-body-sm" id="error" hidden></p><span class="live visually-hidden" aria-live="polite"></span></div>`;
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
		let t = this.accept.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean), n = `.${e.name.split(".").pop()?.toLowerCase()}`, r = t.length ? ` Formatos: ${$a(this.accept)}.` : "";
		return t.length && !t.includes(n) ? Qa.type + r : this.maxSize && e.size > this.maxSize * 1024 * 1024 ? Qa.size(this.maxSize) + r : "";
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
var eo = ":host{min-width:0;display:block}.header{justify-content:space-between;align-items:flex-end;gap:var(--arq-space-gap-lg);min-width:0;display:flex}.text{gap:var(--arq-space-gap-sm-md);flex-direction:column;min-width:0;display:flex}.title,.description{overflow-wrap:break-word;margin:0}.title{color:var(--arq-color-text-primary)}.description{color:var(--arq-color-text-secondary)}.link{flex:none}:host([type=description]) .text{display:contents}:host([type=description]) .description{flex:0 1 var(--arq-layout-measure);max-width:var(--arq-layout-measure)}.title-block{display:contents}:host([type=editorial]) .title-block{align-items:flex-start;gap:var(--arq-space-gap-lg);flex-direction:column;min-width:0;display:flex}:host([type=editorial]) .text{display:contents}:host([type=editorial]) .header{padding-bottom:var(--arq-space-padding-xl);border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle)}:host([type=editorial]) .title{font-weight:var(--arq-font-weight-regular)}:host([type=editorial]) .kicker{color:var(--arq-color-text-secondary);margin:0}:host([type=editorial]) .description{flex:0 1 var(--arq-layout-measure);max-width:var(--arq-layout-measure);text-align:end}:host([type=stacked]) .header{flex-direction:column;justify-content:flex-start;align-items:flex-start}:host([type=stacked]) .text{align-self:stretch}@media (width<=767px){.header{flex-direction:column;justify-content:flex-start;align-items:flex-start}.text{width:100%}:host([type=description]) .text{display:flex}:host([type=description]) .description,:host([type=editorial]) .description{text-align:start;flex:none;max-width:none}:host([type=link]) .link,:host(:not([type])) .link{display:none}}", to = [
	"description",
	"stacked",
	"editorial"
], no = ["link", "stacked"];
(class extends F {
	static tag = "arq-section-header";
	static styles = eo;
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
		e.querySelector(".description").hidden = !to.includes(this.type) || !t("description"), e.querySelector(".kicker").hidden = !n || !t("kicker"), e.querySelector(".title").classList.toggle("role-display-sm", n), e.querySelector(".title").classList.toggle("role-heading-2", !n), e.querySelector(".description").classList.toggle("role-body", n), e.querySelector(".description").classList.toggle("role-body-lg", !n);
		let r = e.querySelector(".link"), i = no.includes(this.type) && !!this.href;
		r.hidden = !i, i ? r.setAttribute("href", this.href) : r.removeAttribute("href");
	}
}).define();
//#endregion
//#region src/components/page-header/page-header.css?inline
var ro = ":host{min-width:0;display:block}.header{align-items:flex-start;gap:var(--arq-space-gap-xl-2xl);padding:var(--arq-space-section-sm) var(--page-gutter) var(--arq-space-section-xs);flex-direction:column;display:flex}.row{justify-content:space-between;align-items:flex-end;gap:var(--arq-space-gap-lg);align-self:stretch;min-width:0;display:flex}.main,.heading{flex-direction:column;min-width:0;display:flex}.heading{gap:var(--arq-space-gap-lg)}.title,.description{overflow-wrap:break-word;margin:0}.title{color:var(--arq-color-text-primary)}.description{color:var(--arq-color-text-secondary)}.action{flex:none}:host(:not([type=detail])) .main{display:contents}:host(:not([type=detail])) .description{flex:0 1 var(--arq-layout-measure);max-width:var(--arq-layout-measure)}:host([type=detail]) .header{padding-block:var(--arq-space-section-xs) var(--arq-space-section-sm)}:host([type=detail]) .main{gap:var(--arq-space-gap-md)}:host([type=detail]) .description{max-width:var(--arq-layout-measure-wide)}@media (width<=767px){.row{align-items:stretch;gap:var(--arq-space-gap-lg);flex-direction:column}:host(:not([type=detail])) .main{gap:var(--arq-space-gap-lg);display:flex}:host(:not([type=detail])) .description,:host([type=detail]) .main{flex:none;max-width:none}:host([type=detail]) .row{gap:var(--arq-space-gap-xl-2xl)}.action ::slotted(*){width:100%}}@media print{.back,.breadcrumb,.description,.action{display:none}}", io = matchMedia("(max-width: 767px)");
(class extends F {
	static tag = "arq-page-header";
	static styles = ro;
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
		searchTitle: { type: Boolean }
	};
	static template = "<div class=\"header\"><arq-button class=\"back\" type=\"underline\" show-leading-icon leading-icon=\"chevron-left\" hidden><slot name=\"back\"></slot></arq-button><div class=\"row\"><div class=\"main\"><div class=\"heading\"><div class=\"breadcrumb\" hidden><slot name=\"breadcrumb\"></slot></div><div class=\"title role-display\"><slot name=\"title\"></slot></div></div><p class=\"description role-body-lg\" hidden><slot name=\"description\"></slot></p></div><div class=\"action\" hidden><slot name=\"action\"></slot></div></div></div>";
	setup() {
		for (let e of this.shadowRoot.querySelectorAll("slot[name]")) e.addEventListener("slotchange", () => this.update());
		io.addEventListener("change", () => this.update());
	}
	update() {
		let e = this.shadowRoot, t = (t) => e.querySelector(`slot[name="${t}"]`).assignedNodes({ flatten: !0 }).some((e) => e.nodeType === Node.ELEMENT_NODE || e.textContent.trim()), n = this.type === "detail";
		e.querySelector(".breadcrumb").hidden = !this.showBreadcrumb || !t("breadcrumb"), e.querySelector(".description").hidden = !this.showDescription || !t("description"), e.querySelector(".action").hidden = !n || !this.showAction || !t("action");
		let r = e.querySelector(".back"), i = n && this.showBack && !!this.backHref && t("back");
		r.hidden = !i, i ? r.setAttribute("href", this.backHref) : r.removeAttribute("href");
		let a = !n && !io.matches && !this.searchTitle, o = e.querySelector(".title");
		o.classList.toggle("role-display-lg", a), o.classList.toggle("role-display", !a);
		let s = e.querySelector(".description");
		s.classList.toggle("role-body", a), s.classList.toggle("role-body-lg", !a);
	}
}).define();
//#endregion
//#region src/components/faq-item/faq-item.css?inline
var ao = ":host{min-width:0;display:block}:host([data-arq-empty]){display:none}.item{border-top:var(--arq-border-default) solid var(--arq-color-border-default)}.trigger{box-sizing:border-box;align-items:center;gap:var(--arq-space-gap-lg);width:100%;padding:var(--arq-space-padding-lg) 0;background:var(--arq-color-surface-transparent);color:var(--arq-color-text-primary);font:inherit;text-align:start;cursor:pointer;-webkit-tap-highlight-color:var(--arq-color-surface-transparent);border:0;margin:0;display:flex}:host([open]) .trigger{padding-bottom:var(--arq-space-gap-sm-md)}.trigger{transition:padding-bottom var(--arq-motion-duration-expand) var(--arq-motion-easing-out), background-color var(--arq-motion-duration-fast) var(--arq-motion-easing-standard), color var(--arq-motion-duration-fast) var(--arq-motion-easing-standard)}.question{overflow-wrap:break-word;flex:1 1 0;min-width:0}.icon{width:var(--arq-icon-md);height:var(--arq-icon-md);color:var(--arq-color-icon-primary);flex:none}:host(:not([open])) [data-icon=minus],:host([open]) [data-icon=plus]{display:none}.answer{max-width:var(--arq-layout-measure-wide);padding-bottom:var(--arq-space-padding-lg);color:var(--arq-color-text-secondary);overflow-wrap:break-word}::slotted(a){color:var(--arq-color-text-primary);text-decoration:underline}@media (hover:hover) and (pointer:fine){:host(:not([open])) .trigger:hover{background:var(--arq-color-surface-faint)}}.item:has(.trigger:focus-visible){outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.trigger:focus{outline:none}:host([number]) .number{width:var(--arq-icon-xl);color:var(--arq-color-text-tertiary);flex:none}:host([number]) .answer{max-width:none;padding-inline-start:calc(var(--arq-icon-xl) + var(--arq-space-gap-lg))}:host([number]:last-child) .item{border-bottom:var(--arq-border-default) solid var(--arq-color-border-default)}@media (width<=767px){.answer{max-width:none}}";
(class extends F {
	static tag = "arq-faq-item";
	static styles = ao;
	static properties = {
		open: { type: Boolean },
		number: { type: String }
	};
	static template = `<div class="item"><button type="button" class="trigger"><span class="number role-caption" hidden></span><span class="question role-heading-3-light"><slot name="question"></slot></span>${I("plus")}${I("minus")}</button><div class="answer-wrap" part="panel"><div class="answer-clip"><div class="answer role-body"><slot></slot></div></div></div></div>`;
	setup() {
		this.disclosure = new L(this, {
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
		n.classList.toggle("role-heading-3", !!e), n.classList.toggle("role-heading-3-light", !e);
	}
}).define();
//#endregion
//#region src/components/footer/footer.css?inline
var oo = ":host{display:block}.footer{grid-template-columns:minmax(var(--arq-layout-footer-tagline), 1fr) minmax(0, auto);column-gap:var(--arq-space-gap-xl);row-gap:var(--arq-space-gap-md);padding:var(--arq-space-section-sm) var(--page-gutter);border-top:var(--arq-border-default) solid var(--arq-color-border-subtle);background:var(--arq-color-surface-default);transition-property:background-color;transition-duration:var(--arq-illumination-bg-duration);transition-delay:0s;transition-timing-function:var(--arq-illumination-bg-easing);grid-template-rows:auto 1fr;grid-template-areas:\"brand columns\"\"legal columns\";display:grid}.brand{align-items:flex-start;gap:var(--arq-space-gap-md);flex-direction:column;grid-area:brand;min-width:0;display:flex}.tagline{max-width:var(--arq-layout-footer-tagline);color:var(--arq-color-text-secondary);overflow-wrap:break-word;margin:0}.legal{color:var(--arq-color-text-tertiary);text-transform:uppercase;grid-area:legal;align-self:start;margin:0}.columns{align-items:flex-start;gap:var(--arq-space-gap-xl);grid-area:columns;display:flex}.column{width:var(--arq-layout-footer-column);align-items:flex-start;gap:var(--arq-space-gap-sm);flex-direction:column;flex:0 auto;min-width:0;display:flex}.title{padding-bottom:var(--arq-space-gap-sm);color:var(--arq-color-text-primary);margin:0}.list{align-items:flex-start;gap:var(--arq-space-gap-sm);flex-direction:column;max-width:100%;display:flex}@media (width<=767px){.footer{row-gap:var(--arq-space-gap-xl);grid-template-rows:none;grid-template-columns:minmax(0,1fr);grid-template-areas:\"brand\"\"columns\"\"legal\"}.columns{row-gap:var(--arq-space-gap-xl);flex-wrap:wrap}.column{flex:1 1 0;min-width:min-content}}@media print{:host{display:none}}", so = [
	"productos",
	"informacion",
	"redes"
];
(class extends F {
	static tag = "arq-footer";
	static styles = oo;
	static template = "<footer class=\"footer\"><div class=\"brand\"><arq-logo></arq-logo><p class=\"tagline role-body\"><slot name=\"tagline\"></slot></p></div><div class=\"columns\">" + so.map((e) => `<nav class="column" data-column="${e}"><div class="title role-body-strong"><slot name="${e}-title"></slot></div><div class="list" role="list"><slot name="${e}"></slot></div></nav>`).join("") + "</div><p class=\"legal role-body-sm\">© <span class=\"year\"></span> Macroled Arq.</p></footer>";
	setup() {
		let e = this.shadowRoot;
		e.querySelector(".year").textContent = String((/* @__PURE__ */ new Date()).getFullYear());
		let t = e.querySelector("slot[name=\"tagline\"]"), n = () => {
			e.querySelector(".tagline").hidden = !t.assignedNodes({ flatten: !0 }).some((e) => e.textContent.trim());
		};
		t.addEventListener("slotchange", n), n();
		for (let t of so) {
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
var co = /* @__PURE__ */ new WeakSet(), lo = null;
function uo(e) {
	let t = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	for (let n of e) if (!(n.localName !== "video" || n.autoplay || n.loop || co.has(n))) {
		if (co.add(n), n.muted = !0, t) {
			po(n);
			continue;
		}
		lo ??= new IntersectionObserver(fo, { threshold: .5 }), lo.observe(n);
	}
}
function fo(e) {
	for (let t of e) t.isIntersecting && (lo.unobserve(t.target), t.target.play().catch(() => po(t.target)));
}
function po(e) {
	let t = () => {
		e.currentTime = e.duration;
	};
	e.readyState >= HTMLMediaElement.HAVE_METADATA ? t() : e.addEventListener("loadedmetadata", t, { once: !0 });
}
//#endregion
//#region src/components/hero/hero.css?inline
var mo = ":host{display:block}.hero{background:var(--arq-color-surface-inverse);flex-direction:column;justify-content:flex-end;height:70svh;display:flex;position:relative;overflow:hidden}.media{position:absolute;inset:0}::slotted([slot=media]){object-fit:cover;width:100%!important;max-width:none!important;height:100%!important;display:block!important}.scrim{background:linear-gradient(#00000085 0%,#0003 18% 45%,#000000ad 100%);position:absolute;inset:0}.content{justify-content:space-between;align-items:flex-end;gap:var(--arq-space-gap-xl);padding:0 var(--page-gutter) var(--arq-space-section-sm);color:var(--arq-color-text-inverse);display:flex;position:relative}.text{align-items:flex-start;gap:var(--arq-space-gap-lg);flex-direction:column;min-width:0;display:flex}.eyebrow,.title,.description{overflow-wrap:break-word;max-width:100%;margin:0}.action{flex:none}@media (width<=767px){.content{justify-content:flex-start;align-items:flex-start;gap:var(--arq-space-gap-lg);flex-direction:column}.text{align-self:stretch}}:host([full-height]) .hero{height:calc(100svh - var(--announcement-height,var(--arq-space-0)))}:host([full-height]) .scrim{background:linear-gradient(#0000 0%,#000000b3 100%);height:66.666%;inset:auto 0 0}:host([full-height]) .content{padding:0 var(--arq-space-padding-4xl) var(--arq-space-padding-4xl)}@media (width<=767px){:host([full-height]) .content{padding-inline:var(--page-gutter);padding-bottom:var(--arq-space-section-sm)}}:host([size=compact]) .hero{height:auto;min-height:41svh;padding-top:var(--arq-space-section-md)}@media (width<=767px){:host([size=compact]) .hero{min-height:47svh}}", ho = [
	"eyebrow",
	"description",
	"action"
];
(class extends F {
	static tag = "arq-hero";
	static styles = mo;
	static properties = {
		fullHeight: { type: Boolean },
		size: {
			type: String,
			values: ["default", "compact"],
			default: "default"
		}
	};
	static template = "<div class=\"hero\"><div class=\"media\"><slot name=\"media\"></slot></div><div class=\"scrim\" aria-hidden=\"true\"></div><div class=\"content\"><div class=\"text\"><p class=\"eyebrow role-label\" hidden><slot name=\"eyebrow\"></slot></p><div class=\"title role-display\"><slot name=\"title\"></slot></div><p class=\"description role-body-lg\" hidden><slot name=\"description\"></slot></p></div><div class=\"action\" hidden><slot name=\"action\"></slot></div></div></div>";
	#e = window.matchMedia("(prefers-reduced-motion: reduce)");
	setup() {
		for (let e of this.shadowRoot.querySelectorAll("slot[name]")) e.addEventListener("slotchange", () => this.update());
		this.#e.addEventListener("change", () => this.#n());
		let e = document.querySelector("arq-announcement-bar");
		e && new ResizeObserver(() => this.style.setProperty("--announcement-height", `${e.offsetHeight}px`)).observe(e);
	}
	update() {
		let e = this.shadowRoot, t = (t) => e.querySelector(`slot[name="${t}"]`).assignedNodes({ flatten: !0 }).some((e) => e.nodeType === Node.ELEMENT_NODE || e.textContent.trim());
		for (let n of ho) e.querySelector(`.${n}`).hidden = !t(n);
		let n = e.querySelector(".title"), r = this.size === "compact" || this.fullHeight;
		n.classList.toggle("role-display", !r), n.classList.toggle("role-display-lg", r);
		let i = e.querySelector(".action"), a = e.querySelector("slot[name=\"action\"]").assignedElements({ flatten: !0 }).find((e) => e.localName === "arq-button"), o = a?.getAttribute("type") || "filled";
		a && o !== "filled" ? i.setAttribute("data-arq-theme", "dark") : i.removeAttribute("data-arq-theme"), this.#n(), uo(e.querySelector("slot[name=\"media\"]").assignedElements());
	}
	#t = /* @__PURE__ */ new WeakSet();
	#n() {
		let e = this.shadowRoot.querySelector("slot[name=\"media\"]").assignedElements().filter((e) => e.localName === "video");
		for (let t of e) if (t.autoplay && this.#t.add(t), this.#t.has(t)) {
			if (this.#e.matches) {
				if (!t.autoplay && t.paused) continue;
				t.autoplay = !1, t.pause(), t.load();
			} else t.autoplay || (t.autoplay = !0, t.play().catch(() => {}));
		}
	}
}).define();
//#endregion
//#region src/components/cta-block/cta-block.css?inline
var go = ":host{min-width:0;display:block}.block{justify-content:space-between;align-items:center;gap:var(--arq-space-gap-xl);padding:var(--arq-space-section-md) var(--page-gutter);background:var(--arq-color-surface-subtle);display:flex}.text{gap:var(--arq-space-gap-sm-md);flex-direction:column;min-width:0;display:flex}.title{color:var(--arq-color-text-primary);overflow-wrap:break-word}.description{max-width:var(--arq-layout-measure-wide);color:var(--arq-color-text-secondary);overflow-wrap:break-word;margin:0}.action{align-items:center;gap:var(--arq-space-gap-md);flex:none;display:flex}.email{width:var(--arq-layout-measure)}::slotted(arq-input){width:100%;display:block}:host(.has-media) .block{column-gap:var(--arq-space-gap-6xl);aspect-ratio:1440/564;padding:var(--arq-space-section-lg) var(--arq-space-padding-4xl);background:var(--arq-color-surface-inverse);grid-template-columns:1fr 1fr;align-content:center;justify-items:start;display:grid;position:relative;overflow:hidden}:host(.has-media) .media{position:absolute;inset:0}:host(.has-media) ::slotted([slot=media]){object-fit:cover;width:100%!important;height:100%!important;display:block!important}:host(.has-media) .text,:host(.has-media) .action{z-index:1;grid-column:2;position:relative}:host(.has-media) .text{gap:var(--arq-space-gap-lg)}:host(.has-media) .kicker,:host(.has-media) .title,:host(.has-media) .description{color:var(--arq-color-text-inverse)}:host(.has-media) .title{font-weight:var(--arq-font-weight-regular)}:host(.has-media) .kicker{margin:0}:host(.has-media) .action{width:min(100%, var(--arq-layout-measure));padding:var(--arq-space-padding-md);background:var(--arq-color-surface-subtle);justify-content:space-between;padding-inline-start:var(--arq-space-padding-lg)}:host(.has-media) .email{flex:auto;width:auto}@media (width<=767px){.block{flex-direction:column;align-items:stretch}.description{max-width:none}.action{align-items:stretch;gap:var(--arq-space-gap-xl);flex-direction:column}.email{width:auto}::slotted(arq-button){width:100%}:host(.has-media) .block{aspect-ratio:auto;grid-template-columns:1fr;min-height:70svh}:host(.has-media) .text,:host(.has-media) .action{grid-column:1}:host(.has-media) .action{flex-direction:row;align-items:center;width:100%}}@media print{:host{display:none}}";
(class extends F {
	static tag = "arq-cta-block";
	static styles = go;
	static properties = { type: {
		type: String,
		values: ["button", "newsletter"],
		default: "button"
	} };
	static template = "<div class=\"block\"><div class=\"media\" hidden><slot name=\"media\"></slot></div><div class=\"text\"><p class=\"kicker role-label\" hidden><slot name=\"kicker\"></slot></p><div class=\"title role-heading-2\"><slot name=\"title\"></slot></div><p class=\"description role-body-lg\" hidden><slot name=\"description\"></slot></p></div><div class=\"action\"><div class=\"email\" hidden><slot name=\"email\"></slot></div><slot name=\"action\"></slot></div></div>";
	setup() {
		let e = this.shadowRoot;
		for (let t of [
			"description",
			"kicker",
			"media"
		]) e.querySelector(`slot[name="${t}"]`).addEventListener("slotchange", () => this.update());
		e.querySelector("slot[name=\"action\"]").addEventListener("click", () => {
			this.type === "newsletter" && this.#e();
		}), e.querySelector("slot[name=\"email\"]").addEventListener("keydown", (e) => {
			this.type === "newsletter" && e.key === "Enter" && (e.preventDefault(), this.#e());
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
		return e ? typeof e.reportValidity == "function" && !e.reportValidity() ? (e.focus?.(), !1) : (this.emit("submit", { email: e.value }), !0) : !1;
	}
}).define();
//#endregion
//#region src/components/carousel-button/carousel-button.css?inline
var _o = ":host{vertical-align:middle;color:var(--arq-color-icon-primary);flex:none;display:inline-flex}.control{box-sizing:border-box;width:var(--arq-layout-carousel-button);height:var(--arq-layout-carousel-button);border:var(--arq-border-default) solid var(--arq-color-border-disabled);border-radius:var(--arq-radius-control);background:var(--arq-color-surface-default);color:inherit;cursor:pointer;-webkit-tap-highlight-color:var(--arq-color-surface-transparent);justify-content:center;align-items:center;margin:0;padding:0;display:inline-flex}.glyph{display:inline-flex}.icon{width:var(--arq-icon-md);height:var(--arq-icon-md)}.control:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.control:focus:not(:focus-visible){outline:none}.control:enabled:hover{background:var(--arq-color-surface-hover)}.control:enabled:active{background:var(--arq-color-surface-selected)}:host([disabled]){color:var(--arq-color-icon-disabled)}:host([disabled]) .control{background:var(--arq-color-surface-subtle);cursor:default}";
(class extends F {
	static tag = "arq-carousel-button";
	static styles = _o;
	static properties = {
		direction: {
			type: String,
			values: ["previous", "next"],
			default: "previous"
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
			this.shadowRoot.querySelector(".glyph").innerHTML = I(e);
		}
		this.#e.disabled = this.disabled;
	}
}).define();
//#endregion
//#region src/components/carousel-controls/carousel-controls.css?inline
var vo = ":host{display:inline-flex}.controls,.arrows{align-items:center;gap:var(--arq-space-gap-sm);display:flex}:host([buttons=carousel]) .controls{gap:var(--arq-space-gap-lg)}.count{color:var(--arq-color-text-secondary);margin:0}.progress{width:var(--arq-space-gap-5xl);height:var(--arq-border-strong);flex:none;position:relative}.track{height:var(--arq-border-default);background:var(--arq-color-text-secondary);opacity:.35;position:absolute;top:50%;left:0;right:0;transform:translateY(-50%)}.indicator{height:100%;width:calc(100% / var(--progress-count,1));background:var(--arq-color-text-primary);transform:translateX(calc(var(--progress-index,0) * 100%));transition:transform var(--arq-motion-duration-base) var(--arq-motion-easing-standard);position:absolute;top:0;left:0}@media (prefers-reduced-motion:reduce){.indicator{transition:none}}@media (width<=767px){:host{display:none}}", yo = [
	"start",
	"middle",
	"end"
];
(class extends F {
	static tag = "arq-carousel-controls";
	static styles = vo;
	static properties = {
		position: {
			type: String,
			values: yo,
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
			values: ["icon", "carousel"],
			default: "icon"
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
	static template = "<div class=\"controls\" role=\"group\"><p class=\"count role-caption\" hidden></p><div class=\"progress\" hidden><span class=\"track\"></span><span class=\"indicator\"></span></div><div class=\"arrows\"><arq-icon-button class=\"prev icon\" size=\"large\" icon=\"arrow-left\"></arq-icon-button><arq-carousel-button class=\"prev square\" direction=\"previous\" hidden></arq-carousel-button><arq-icon-button class=\"next icon\" size=\"large\" icon=\"arrow-right\"></arq-icon-button><arq-carousel-button class=\"next square\" direction=\"next\" hidden></arq-carousel-button></div></div>";
	#e = null;
	#t = !1;
	#n = !0;
	#r = () => this.#f();
	#i = new ResizeObserver(() => this.#f());
	#a = new MutationObserver(() => this.#d());
	#o = window.matchMedia("(prefers-reduced-motion: reduce)");
	setup() {
		let e = this.shadowRoot;
		for (let t of e.querySelectorAll(".prev")) t.addEventListener("click", () => this.#h(-1));
		for (let t of e.querySelectorAll(".next")) t.addEventListener("click", () => this.#h(1));
	}
	#s() {
		let e = this.buttons === "carousel" ? "square" : "icon", t = this.shadowRoot;
		return {
			prev: t.querySelector(`.prev.${e}`),
			next: t.querySelector(`.next.${e}`)
		};
	}
	connectedCallback() {
		super.connectedCallback(), this.#e && !this.#t && this.#l(this.#e);
	}
	disconnectedCallback() {
		this.#u();
	}
	update(e) {
		let t = this.shadowRoot, n = this.buttons === "carousel";
		for (let e of t.querySelectorAll(".icon")) e.hidden = n;
		for (let e of t.querySelectorAll(".square")) e.hidden = !n;
		let { prev: r, next: i } = this.#s();
		if (e.has("labelPrev") || e.has("buttons")) for (let e of t.querySelectorAll(".prev")) e.textContent = this.labelPrev;
		if (e.has("labelNext") || e.has("buttons")) for (let e of t.querySelectorAll(".next")) e.textContent = this.labelNext;
		t.querySelector(".controls").setAttribute("aria-label", `${this.labelPrev} / ${this.labelNext}`), this.#p(), e.has("for") && this.#c();
		let a = t.activeElement;
		r.disabled = this.position === "start", i.disabled = this.position === "end" || !this.#n, a === r && r.disabled && i.focus(), a === i && i.disabled && r.focus();
	}
	#c() {
		this.#u();
		let e = this.for ? this.getRootNode().getElementById?.(this.for) : null;
		this.for && !e && document.readyState === "loading" && document.addEventListener("DOMContentLoaded", () => this.#c(), { once: !0 }), this.#e = e, e && this.#l(e);
	}
	#l(e) {
		this.#t = !0, e.addEventListener("scroll", this.#r, { passive: !0 }), this.#i.observe(e), this.#a.observe(e, { childList: !0 }), this.#d();
		let t = this.buttons === "carousel" ? "arq-carousel-button" : "arq-icon-button";
		customElements.whenDefined(t).then(() => {
			for (let n of this.shadowRoot.querySelectorAll(t)) {
				let t = n.shadowRoot?.querySelector("button");
				t && "ariaControlsElements" in t && (t.ariaControlsElements = [e]);
			}
		}), this.#f();
	}
	#u() {
		this.#e && this.#t && (this.#t = !1, this.#e.removeEventListener("scroll", this.#r), this.#a.disconnect(), this.#i.disconnect());
	}
	#d() {
		for (let e of this.#e?.children ?? []) this.#i.observe(e);
		this.#f();
	}
	#f() {
		let e = this.#e;
		if (!e) return;
		let t = e.scrollWidth - e.clientWidth, n = t <= 1 || e.scrollLeft <= 1 ? "start" : e.scrollLeft >= t - 1 ? "end" : "middle", r = t > 1;
		r !== this.#n && (this.#n = r, this.#s().next.disabled = !r || n === "end"), n !== this.position && (this.position = n), this.buttons === "carousel" && this.#m(e);
	}
	#p() {
		let e = this.shadowRoot, t = Math.max(this.count || 1, 1), n = Math.min(Math.max(this.index || 0, 0), t - 1), r = this.buttons === "carousel" && t > 1, i = e.querySelector(".count"), a = e.querySelector(".progress");
		i.hidden = !r, a.hidden = !r, i.textContent = `${String(n + 1).padStart(2, "0")} / ${String(t).padStart(2, "0")}`, a.style.setProperty("--progress-count", String(t)), a.style.setProperty("--progress-index", String(n)), a.setAttribute("role", "progressbar"), a.setAttribute("aria-valuemin", "1"), a.setAttribute("aria-valuemax", String(t)), a.setAttribute("aria-valuenow", String(n + 1)), a.setAttribute("aria-valuetext", `${n + 1} de ${t}`);
	}
	#m(e) {
		let t = [...e.children], n = Math.max(t.length, 1), r = t[0], i = r && Number.parseFloat(getComputedStyle(e).columnGap || getComputedStyle(e).gap) || 0, a = r ? r.getBoundingClientRect().width + i : e.clientWidth || 1, o = Math.min(n - 1, Math.max(0, Math.round(e.scrollLeft / Math.max(a, 1))));
		this.count !== n && (this.count = n), this.index === o ? this.#p() : this.index = o;
	}
	go(e) {
		this.#h(e);
	}
	#h(e) {
		let t = this.#e;
		if (!t) {
			this.emit(e < 0 ? "prev" : "next");
			return;
		}
		let n = this.step === "item" ? t.children[0] : null, r = n && Number.parseFloat(getComputedStyle(t).columnGap || getComputedStyle(t).gap) || 0, i = n ? n.getBoundingClientRect().width + r : t.clientWidth;
		t.scrollBy({
			left: e * i,
			behavior: this.#o.matches ? "auto" : "smooth"
		});
	}
}).define();
//#endregion
//#region src/components/category-card/category-card.css?inline
var bo = ":host{min-width:0;display:block}.card{gap:var(--arq-space-gap-lg);flex-direction:column;display:flex}.card-media{aspect-ratio:3/4}.caption{align-items:stretch;gap:var(--arq-space-gap-sm-md);flex-direction:column;display:flex}.title-row{align-items:center;gap:var(--arq-space-gap-sm);display:flex}.description{color:var(--arq-color-text-secondary);overflow-wrap:break-word;margin:0}.name{min-width:0;color:var(--arq-color-text-primary);overflow-wrap:break-word}.icon{width:var(--arq-icon-md);height:var(--arq-icon-md);color:var(--arq-color-icon-primary);flex:none}@media (width>=768px){.card-media{max-height:none}}@media (width<=767px){.card{gap:var(--arq-space-gap-md)}.card-media{aspect-ratio:4/5}}.card-media ::slotted(*){transition:transform var(--arq-motion-duration-slow) var(--arq-motion-easing-standard)!important}@media (hover:hover){.card:has(.card-link:hover) .card-media ::slotted(*){transform:scale(1.05)!important}}.card-media{position:relative}.card.reveal{opacity:0;transform:translateY(var(--arq-space-gap-2xl));transition-property:color,background-color,border-color,outline-color,opacity,transform;transition-duration:var(--arq-motion-duration-fast), var(--arq-motion-duration-fast), var(--arq-motion-duration-fast), var(--arq-motion-duration-fast), calc(var(--arq-motion-duration-slow) * 2), calc(var(--arq-motion-duration-slow) * 2);transition-delay:0s, 0s, 0s, 0s, calc(var(--arq-motion-duration-fast) * var(--reveal-index,0)), calc(var(--arq-motion-duration-fast) * var(--reveal-index,0));transition-timing-function:var(--arq-motion-easing-standard)}.card.reveal.revealed{opacity:1;transform:none}:host([overlay]){height:100%}:host([overlay]) .card{gap:0;height:100%}:host([overlay]) .card-media{aspect-ratio:auto;flex:auto;height:100%;min-height:0}:host([overlay]) .card-media:after{content:\"\";z-index:0;pointer-events:none;background:linear-gradient(#0000,#000000b8);height:50%;position:absolute;bottom:0;left:0;right:0}:host([overlay]) .caption{right:var(--arq-space-padding-xl);bottom:var(--arq-space-padding-xl);left:var(--arq-space-padding-xl);z-index:var(--card-above);pointer-events:none;position:absolute}:host([overlay]) .title-row{justify-content:space-between;gap:var(--arq-space-gap-md)}:host([overlay]) .name{min-width:0;color:var(--arq-color-text-inverse);flex:auto}:host([overlay]) .icon{width:var(--arq-icon-xl);height:var(--arq-icon-xl);color:var(--arq-color-icon-inverse)}:host([overlay]) .description{color:var(--arq-color-text-inverse);opacity:0;transition-property:grid-template-rows,opacity,color,background-color,border-color,outline-color;transition-duration:calc(var(--arq-motion-duration-slow) * 4);transition-timing-function:var(--arq-motion-easing-standard);grid-template-rows:0fr;display:grid}:host([overlay]) .description-inner{min-height:0;overflow:hidden}@media (hover:hover){:host([overlay]:hover) .description,:host([overlay]:focus-within) .description{opacity:1;grid-template-rows:1fr}:host([overlay]) .card:has(.card-link:hover) .card-media{outline:none}:host([overlay]) .card-media ::slotted(*){transition:transform calc(var(--arq-motion-duration-slow) * 4) var(--arq-motion-easing-standard)!important}:host([overlay]:hover) .card-media ::slotted(*),:host([overlay]:focus-within) .card-media ::slotted(*){transform:scale(1.05)!important}}@media (width<=767px){:host([overlay]),:host([overlay]) .card{height:auto}:host([overlay]) .card-media{aspect-ratio:3/4;flex:none;height:auto}:host([overlay]) .description{opacity:1;grid-template-rows:1fr}}";
(class extends F {
	static tag = "arq-category-card";
	static styles = W + bo;
	static properties = {
		href: { type: String },
		overlay: { type: Boolean }
	};
	static template = `<div class="card"><div class="card-media"><slot name="image"></slot></div><div class="caption"><div class="title-row"><a class="card-link name role-heading-3"><slot name="name"></slot></a>${I("arrow-right")}</div><p class="description role-body" hidden><span class="description-inner"><slot name="description"></slot></span></p></div></div>`;
	#e = null;
	setup() {
		if (this.shadowRoot.querySelector("slot[name=\"description\"]").addEventListener("slotchange", () => this.update(/* @__PURE__ */ new Set())), window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		let e = this.shadowRoot.querySelector(".card"), t = [...this.parentElement.children].filter((e) => e.localName === this.localName).indexOf(this);
		e.style.setProperty("--reveal-index", String(Math.max(t, 0))), e.classList.add("reveal"), this.#e = new IntersectionObserver(([t]) => {
			t.isIntersecting && (e.classList.add("revealed"), this.#e.disconnect());
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
		a && a.dataset.icon !== i && (a.outerHTML = I(i));
	}
}).define();
//#endregion
//#region src/components/line-card/line-card.css?inline
var xo = ":host{min-width:0;display:block}.card{gap:var(--arq-space-gap-lg);flex-direction:column;display:flex}.card-media{aspect-ratio:5/4}.content{align-items:flex-start;gap:var(--arq-space-gap-md);padding-top:var(--arq-space-padding-sm);flex-direction:column;display:flex}.label,.description{margin:0}.label{color:var(--arq-color-text-tertiary)}.name{max-width:100%;color:var(--arq-color-text-primary);overflow-wrap:break-word}.description{max-width:var(--arq-layout-measure);color:var(--arq-color-text-secondary);overflow-wrap:break-word}.cta{margin-top:calc(var(--arq-space-gap-sm) + var(--arq-space-gap-md))}@media (width>=768px){.card-media{max-height:max(50svh, 100svh - var(--arq-space-section-xl) * 2 - var(--arq-space-gap-6xl))}}@media (width<=767px){.card-media{aspect-ratio:1}.content{gap:var(--arq-space-gap-sm-md);padding-top:0}.description{max-width:none}.cta{margin-top:calc(var(--arq-space-gap-xs) + var(--arq-space-gap-sm-md))}}", So = ["label", "description"];
(class extends F {
	static tag = "arq-line-card";
	static styles = W + xo;
	static properties = { href: { type: String } };
	static template = "<div class=\"card\"><div class=\"card-media\"><slot name=\"image\"></slot></div><div class=\"content\"><p class=\"label role-label\" hidden><slot name=\"label\"></slot></p><div class=\"name role-heading-1\"><slot name=\"name\"></slot></div><p class=\"description role-body-lg\" hidden><slot name=\"description\"></slot></p><arq-button class=\"cta\" type=\"underline\" show-underline show-icon icon=\"arrow-right\"><slot name=\"action\">Ver colección</slot></arq-button></div></div>";
	setup() {
		for (let e of So) this.shadowRoot.querySelector(`slot[name="${e}"]`).addEventListener("slotchange", () => this.update(/* @__PURE__ */ new Set()));
	}
	update(e) {
		let t = this.shadowRoot;
		for (let e of So) t.querySelector(`.${e}`).hidden = !t.querySelector(`slot[name="${e}"]`).assignedNodes({ flatten: !0 }).some((e) => e.nodeType === Node.ELEMENT_NODE || e.textContent.trim());
		if (e.has("href")) {
			let e = t.querySelector(".cta");
			this.href ? e.setAttribute("href", this.href) : e.removeAttribute("href");
		}
	}
}).define();
//#endregion
//#region src/components/feature-block/feature-block.css?inline
var Co = ":host{min-width:0;display:block}.block{column-gap:var(--arq-space-gap-6xl);grid-template:\"image content\"\"image secondary\"1fr/50% minmax(0,1fr);align-items:start;display:grid}:host([layout=image-right]) .block{grid-template-columns:minmax(0,1fr) 50%;grid-template-areas:\"content image\"\"secondary image\"}.block:has(.secondary[hidden]){grid-template-areas:\"image content\"\"image content\"}:host([layout=image-right]) .block:has(.secondary[hidden]){grid-template-areas:\"content image\"\"content image\"}.media{background:var(--arq-color-surface-subtle);overflow:hidden}.image{aspect-ratio:4/5;grid-area:image}.secondary{aspect-ratio:16/10;margin-top:calc(var(--arq-space-gap-xl) * 2 + var(--arq-space-gap-lg));grid-area:secondary}.media ::slotted(*){object-fit:cover;width:100%!important;max-width:none!important;height:100%!important;display:block!important}.content{align-items:flex-start;gap:var(--arq-space-gap-xl);padding-top:var(--arq-space-padding-xl-2xl);flex-direction:column;grid-area:content;display:flex}:host([layout=image-right]) .content{padding-top:var(--arq-space-padding-6xl)}.label,.description{margin:0}.label{color:var(--arq-color-text-tertiary)}.title{max-width:100%;color:var(--arq-color-text-primary);overflow-wrap:break-word}.description{max-width:var(--arq-layout-measure);color:var(--arq-color-text-secondary);overflow-wrap:break-word}@media (width>=768px){.image{width:100%;max-height:max(50svh, 100svh - var(--arq-space-section-xl))}}@media (width<=767px){.block,:host([layout=image-right]) .block{row-gap:var(--arq-space-gap-lg);grid-template-rows:none;grid-template-columns:minmax(0,1fr);grid-template-areas:\"image\"\"content\"\"secondary\"}.block:has(.secondary[hidden]){row-gap:var(--arq-space-gap-lg);grid-template-rows:none;grid-template-columns:minmax(0,1fr);grid-template-areas:\"image\"\"content\"\"secondary\"}:host([layout=image-right]) .block:has(.secondary[hidden]){row-gap:var(--arq-space-gap-lg);grid-template-rows:none;grid-template-columns:minmax(0,1fr);grid-template-areas:\"image\"\"content\"\"secondary\"}.content,:host([layout=image-right]) .content{gap:var(--arq-space-gap-md);padding-top:var(--arq-space-padding-sm)}.secondary{margin-top:0}.description{max-width:none}}", wo = [
	"label",
	"description",
	"action",
	"secondary"
];
(class extends F {
	static tag = "arq-feature-block";
	static styles = Co;
	static properties = { layout: {
		type: String,
		values: ["image-left", "image-right"],
		default: "image-left"
	} };
	static template = "<div class=\"block\"><div class=\"media image\"><slot name=\"image\"></slot></div><div class=\"content\"><p class=\"label role-label\" hidden><slot name=\"label\"></slot></p><div class=\"title role-display-sm\"><slot name=\"title\"></slot></div><p class=\"description role-body-lg\" hidden><slot name=\"description\"></slot></p><div class=\"action\" hidden><slot name=\"action\"></slot></div></div><div class=\"media secondary\" hidden><slot name=\"secondary\"></slot></div></div>";
	setup() {
		for (let e of wo) this.shadowRoot.querySelector(`slot[name="${e}"]`).addEventListener("slotchange", () => this.update());
	}
	update() {
		let e = this.shadowRoot;
		for (let t of wo) e.querySelector(`.${t}`).hidden = !e.querySelector(`slot[name="${t}"]`).assignedNodes({ flatten: !0 }).some((e) => e.nodeType === Node.ELEMENT_NODE || e.textContent.trim());
	}
}).define();
//#endregion
//#region src/base/reveal.css?inline
var To = ".reveal:not(.revealed){opacity:0}.reveal.revealed{animation:arq-reveal calc(var(--arq-motion-duration-slow) * 2) var(--arq-motion-easing-standard) backwards;animation-delay:calc(var(--arq-motion-duration-fast) * var(--reveal-index,0))}@keyframes arq-reveal{0%{opacity:0;transform:translateY(var(--arq-space-gap-2xl))}}";
//#endregion
//#region src/base/reveal.js
function Eo(e, { start: t = 0 } = {}) {
	if (!e.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return null;
	let n = new IntersectionObserver((e) => {
		for (let t of e) t.isIntersecting && (t.target.classList.add("revealed"), n.unobserve(t.target));
	}, { threshold: .15 });
	return e.forEach((e, r) => {
		e.style.setProperty("--reveal-index", String(t + r)), e.classList.add("reveal"), n.observe(e);
	}), n;
}
//#endregion
//#region src/components/section/section.css?inline
var Do = ":host{--section-gap:var(--arq-space-gap-2xl);--section-inline:var(--page-gutter);box-sizing:border-box;min-width:0;padding:0 var(--section-inline) var(--arq-space-section-xl);background:var(--arq-color-surface-default);display:block}:host([padding-top]){padding-top:var(--arq-space-section-md)}:host([background=subtle]){padding-block:var(--arq-space-section-md);background:var(--arq-color-surface-subtle)}:host([background=bone]){background:var(--arq-color-surface-bone)}:host([background=sand]){background:#f7f1ec}:host([padding=section]){--section-inline:var(--page-gutter);padding:var(--arq-space-section-lg) var(--section-inline)}:host([padding=wide]){--section-inline:var(--arq-space-padding-4xl);padding:var(--arq-space-section-lg) var(--section-inline)}:host([bleed=end]){padding-inline-end:0}.section{gap:var(--section-gap);flex-direction:column;min-width:0;display:flex}.head,.lead,.body{min-width:0}.action,.mobile-action{align-self:flex-start}@media (width>=768px){.mobile-action{display:none}:host([layout=split]) .section{grid-template-columns:var(--arq-layout-measure) minmax(0, 1fr);column-gap:var(--arq-space-section-md);row-gap:var(--arq-space-gap-lg);grid-template-rows:auto 1fr;grid-template-areas:\"head body\"\"action body\";align-items:start;display:grid}:host([layout=split]) .head{grid-area:head}:host([layout=split]) .body{grid-area:body}:host([layout=split]) .action{grid-area:action}:host([layout=split][padding=wide]) .section{grid-template-columns:var(--arq-layout-measure-wide) minmax(0, 1fr);column-gap:var(--arq-space-gap-6xl)}:host([layout=tools]) .section{column-gap:var(--arq-space-gap-6xl);row-gap:var(--arq-space-gap-2xl);grid-template-columns:minmax(0,1fr) minmax(0,1.22fr);grid-template-areas:\"head head\"\"lead body\";align-items:start;display:grid}:host([layout=tools]) .head{grid-area:head}:host([layout=tools]) .lead{grid-area:lead;justify-self:start;width:90%}:host([layout=tools]) .body{gap:var(--arq-space-gap-sm);grid-area:body;justify-self:end;align-items:flex-start;width:90%;display:flex}}@media (width<=767px){:host{--section-gap:var(--arq-space-gap-xl)}}", Oo = [
	"header",
	"lead",
	"action",
	"mobile-action"
];
(class extends F {
	static tag = "arq-section";
	static styles = To + Do;
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
	static template = "<div class=\"section\"><div class=\"head\" hidden><slot name=\"header\"></slot></div><div class=\"lead\" hidden><slot name=\"lead\"></slot></div><div class=\"body\"><slot></slot></div><div class=\"action\" hidden><slot name=\"action\"></slot></div><div class=\"mobile-action\" hidden><slot name=\"mobile-action\"></slot></div></div>";
	#e = null;
	setup() {
		for (let e of Oo) {
			let t = this.shadowRoot.querySelector(`slot[name="${e}"]`), n = () => t.parentElement.hidden = t.assignedElements({ flatten: !0 }).length === 0;
			t.addEventListener("slotchange", n), n();
		}
	}
	disconnectedCallback() {
		this.#e?.disconnect();
	}
	update(e) {
		e.has("reveal") && this.#t();
	}
	#t() {
		this.#e?.disconnect(), this.#e = null;
		let e = this.shadowRoot.querySelector(".section");
		e.classList.remove("reveal", "revealed"), this.reveal && !window.matchMedia("(prefers-reduced-motion: reduce)").matches && (e.classList.add("reveal"), this.#e = new IntersectionObserver(([t]) => {
			t.isIntersecting && (e.classList.add("revealed"), this.#e.disconnect(), this.#e = null);
		}, { threshold: .15 }), this.#e.observe(this));
	}
}).define();
//#endregion
//#region src/components/grid/grid.css?inline
var ko = ":host{min-width:0;display:block}.grid{--card-min:var(--arq-layout-card-min);grid-template-columns:repeat(var(--columns,1), minmax(0, 1fr));gap:var(--arq-space-gap-lg);align-items:start;display:grid}.grid.auto{grid-template-columns:repeat(auto-fill, minmax(var(--card-min), 1fr));gap:var(--arq-space-gap-2xl) var(--arq-space-gap-lg)}@media (width>=1600px){.grid.auto{--card-min:var(--arq-layout-card-min-wide)}}::slotted(*){min-width:0}:host([layout=editorial]){margin-inline:calc(var(--section-inline,0px) * -1);width:calc(100% + var(--section-inline,0px) * 2)}@media (width>=768px){.grid.editorial{align-items:stretch;gap:var(--arq-space-5);aspect-ratio:1440/614;display:flex}.grid.editorial ::slotted(*){flex:1 1 0;align-self:stretch;min-width:0}:host([stagger]) ::slotted(:nth-child(2n)){margin-top:calc(var(--arq-space-section-xl) + var(--arq-space-section-sm))}}@media (width<=767px){.grid.auto{gap:var(--arq-space-gap-xl) var(--arq-space-gap-md)}.grid:not(.auto){gap:var(--arq-space-section-md);grid-template-columns:minmax(0,1fr)}:host([mobile=two-columns]) .grid{gap:var(--arq-space-gap-sm-md);grid-template-columns:repeat(2,minmax(0,1fr))}:host([mobile=carousel]){overscroll-behavior-x:contain;scroll-snap-type:x mandatory;scrollbar-width:none;margin-block:calc(var(--arq-space-gap-xs) * -1);margin-inline:calc(var(--arq-space-gap-xs) * -1) calc(var(--arq-layout-gutter) * -1);padding-block:var(--arq-space-gap-xs);padding-inline-start:var(--arq-space-gap-xs);scroll-padding-inline-start:var(--arq-space-gap-xs);overflow-x:auto;container-type:inline-size}:host([mobile=carousel])::-webkit-scrollbar{display:none}:host([mobile=carousel]) .grid{gap:var(--arq-space-gap-sm-md);width:max-content;padding-inline-end:var(--arq-layout-gutter);display:flex}:host([mobile=carousel]) ::slotted(*){width:calc((100cqi - var(--arq-layout-gutter)) * .8);scroll-snap-align:start;flex:none}}:host([gap=sm]) .grid,:host([gap=sm][mobile=carousel]) .grid{gap:var(--arq-space-gap-sm)}";
(class extends F {
	static tag = "arq-grid";
	static styles = ko;
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
var Ao = ":host{min-width:0;display:block}.mosaic{gap:var(--arq-space-gap-lg);grid-template-rows:1fr 1fr;grid-template-columns:repeat(4,minmax(0,1fr));display:grid}::slotted(img){background:var(--arq-color-surface-subtle);min-width:0;box-sizing:border-box!important;object-fit:cover!important;width:100%!important;max-width:none!important;height:100%!important;display:block!important}::slotted(img:first-child){contain:size;grid-area:1/1/span 2/span 2}::slotted(img:nth-child(2)){contain:size;grid-area:1/3/auto/span 2}::slotted(img:nth-child(3)),::slotted(img:nth-child(4)){aspect-ratio:1;grid-row:2;height:auto!important;max-height:calc((max(50svh, 100svh - var(--arq-space-section-xl) * 2) - var(--arq-space-gap-lg)) / 2)!important}::slotted(img:nth-child(n+5)){display:none!important}@media (width<=767px){.mosaic{gap:var(--arq-space-gap-sm-md);grid-template-rows:none;grid-template-columns:repeat(2,minmax(0,1fr))}::slotted(img){aspect-ratio:4/5;contain:none;height:auto!important}::slotted(img:first-child){contain:none;grid-area:auto/1/auto/-1}::slotted(img:nth-child(2)),::slotted(img:nth-child(3)){aspect-ratio:4/5;contain:none;grid-area:auto;max-height:none!important}::slotted(img:nth-child(4)){display:none!important}}";
(class extends F {
	static tag = "arq-project-mosaic";
	static styles = Ao;
	static template = "<div class=\"mosaic\"><slot></slot></div>";
}).define();
//#endregion
//#region src/components/text-block/text-block.css?inline
var jo = ":host{min-width:0;display:block}.block{align-items:flex-start;gap:var(--arq-space-gap-lg);flex-direction:column;min-width:0;display:flex}.kicker,.title,.description{overflow-wrap:break-word;margin:0}.kicker,.description{color:var(--arq-color-text-secondary)}.description{max-width:var(--arq-layout-measure)}.title{color:var(--arq-color-text-primary);font-weight:var(--arq-font-weight-regular)}.arrow{width:var(--arq-space-32);height:var(--arq-space-32);color:var(--arq-color-icon-primary);justify-content:center;align-items:center;text-decoration:none;display:flex}.arrow .icon{width:var(--arq-icon-xl);height:var(--arq-icon-xl)}.arrow:focus{outline:none}.arrow:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}", Mo = ["kicker", "description"];
(class extends F {
	static tag = "arq-text-block";
	static styles = jo;
	static properties = { href: { type: String } };
	static template = `<div class="block"><p class="kicker role-label" hidden><slot name="kicker"></slot></p><div class="title role-display-sm"><slot name="title"></slot></div><p class="description role-body" hidden><slot name="description"></slot></p><a class="arrow" hidden>${I("arrow-right")}<span class="visually-hidden"><slot name="link"></slot></span></a></div>`;
	setup() {
		for (let e of Mo) this.shadowRoot.querySelector(`slot[name="${e}"]`).addEventListener("slotchange", () => this.update());
	}
	update() {
		let e = this.shadowRoot, t = (t) => e.querySelector(`slot[name="${t}"]`).assignedNodes({ flatten: !0 }).some((e) => e.textContent.trim());
		for (let n of Mo) e.querySelector(`.${n}`).hidden = !t(n);
		let n = e.querySelector(".arrow");
		this.href ? (n.hidden = !1, n.href = this.href) : (n.hidden = !0, n.removeAttribute("href"));
	}
}).define();
//#endregion
//#region src/components/collection-tile/collection-tile.css?inline
var No = ":host{min-width:0;height:100%;min-height:0;display:block}:host(.reveal:not(.revealed)){opacity:0}:host(.reveal.revealed){animation:arq-reveal calc(var(--arq-motion-duration-slow) * 2) var(--arq-motion-easing-standard) backwards;animation-delay:calc(var(--arq-motion-duration-slow) * 2 * var(--reveal-index,0))}.card{background:var(--arq-color-surface-inverse);height:100%;color:var(--arq-color-text-inverse);overflow:hidden}.card-media{position:absolute;inset:0}::slotted([slot=image]){object-fit:cover;width:100%!important;max-width:none!important;height:100%!important;transition:transform calc(var(--arq-motion-duration-slow) * 4) var(--arq-motion-easing-standard)!important;display:block!important}.scrim{pointer-events:none;background:linear-gradient(#0000,#000000c7);height:50%;position:absolute;bottom:0;left:0;right:0}.tag{top:var(--arq-space-padding-lg);left:var(--arq-space-padding-lg);z-index:var(--card-above);padding:var(--arq-space-padding-xs) var(--arq-space-padding-sm);border:var(--arq-border-default) solid var(--arq-color-border-default);background:var(--arq-color-surface-default);color:var(--arq-color-text-secondary);position:absolute}.info{right:var(--arq-space-padding-xl);bottom:var(--arq-space-padding-xl);left:var(--arq-space-padding-xl);z-index:var(--card-above);gap:var(--arq-space-gap-sm-md);flex-direction:column;display:flex;position:absolute}.title-row{justify-content:space-between;align-items:center;gap:var(--arq-space-gap-md);display:flex}.label,.name,.description{margin:0}.label{opacity:.8}.name{min-width:0;color:var(--arq-color-text-inverse);flex:auto}.icon{width:var(--arq-icon-xl);height:var(--arq-icon-xl);color:var(--arq-color-icon-inverse);pointer-events:none;flex:none}.description{color:var(--arq-color-text-inverse);opacity:0;transition-property:grid-template-rows,opacity,color,background-color,border-color,outline-color;transition-duration:calc(var(--arq-motion-duration-slow) * 4);transition-timing-function:var(--arq-motion-easing-standard);grid-template-rows:0fr;display:grid}.description-inner{min-height:0;overflow:hidden}@media (hover:hover){:host(:hover) .description,:host(:focus-within) .description{opacity:1;grid-template-rows:1fr}.card:has(.card-link:hover) .card-media{outline:none}:host(:hover) ::slotted([slot=image]),:host(:focus-within) ::slotted([slot=image]){transform:scale(1.05)!important}}@media (width<=767px){.description{opacity:1;grid-template-rows:1fr}}";
(class extends F {
	static tag = "arq-collection-tile";
	static styles = W + To + No;
	static properties = {
		href: { type: String },
		featured: { type: Boolean }
	};
	static template = `<div class="card"><div class="card-media"><slot name="image"></slot></div><span class="scrim" aria-hidden="true"></span><span class="tag role-body-sm" hidden><slot name="tag">Destacada</slot></span><div class="info"><p class="label role-label"><slot name="label"></slot></p><div class="title-row"><a class="card-link name role-heading-2"><slot name="name"></slot></a>${I("arrow-up-right")}</div><p class="description role-body" hidden><span class="description-inner"><slot name="description"></slot></span></p></div></div>`;
	setup() {
		this.shadowRoot.querySelector("slot[name=\"label\"]").addEventListener("slotchange", () => this.update(/* @__PURE__ */ new Set())), this.shadowRoot.querySelector("slot[name=\"description\"]").addEventListener("slotchange", () => this.update(/* @__PURE__ */ new Set()));
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
var Po = ":host{min-width:0;margin-inline:calc(var(--section-inline,0px) * -1);width:calc(100% + var(--section-inline,0px) * 2);display:block}.mosaic{grid-template-columns:543fr var(--arq-space-5) 470fr var(--arq-space-5) 412fr;grid-template-rows:175fr 384fr var(--arq-space-5) 206fr 198fr 146fr;aspect-ratio:1440/1114;display:grid}slot{display:contents}::slotted(*){min-width:0;height:100%;min-height:0;display:block}::slotted([slot=primary]){grid-area:1/1/5}::slotted([slot=wide]){grid-area:2/3/auto/6}::slotted([slot=stack]:nth-child(3)){grid-area:4/3/6}::slotted([slot=stack]:nth-child(4)){grid-area:4/5/7}@media (width<=767px){.mosaic{gap:var(--arq-space-5);aspect-ratio:auto;flex-direction:column;display:flex}::slotted([slot=primary]),::slotted([slot=wide]),::slotted([slot=stack]:nth-child(3)),::slotted([slot=stack]:nth-child(4)){aspect-ratio:4/5;grid-area:auto;height:auto}}";
(class extends F {
	static tag = "arq-collection-mosaic";
	static styles = Po;
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
//#region src/components/tool-card/tool-card.css?inline
var Fo = ":host{min-width:0;color:var(--arq-color-text-primary);flex:1 1 0;display:block}.card{gap:var(--arq-space-gap-md);color:inherit;flex-direction:column;text-decoration:none;display:flex}.card:focus{outline:none}.card:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.media{aspect-ratio:311/332;background:var(--arq-color-surface-strong);justify-content:center;align-items:center;display:flex;overflow:hidden}:host([size=large]) .media{aspect-ratio:520/578}::slotted([slot=image]){object-fit:cover;width:100%!important;height:100%!important;display:block!important}.placeholder{padding:var(--arq-space-padding-md);color:var(--arq-color-text-tertiary);text-align:center}.caption{gap:var(--arq-space-gap-xs);flex-direction:column;min-width:0;display:flex}.title-row{justify-content:space-between;align-items:center;gap:var(--arq-space-gap-sm);display:flex}.title,.subtitle{overflow-wrap:break-word;min-width:0}.subtitle{color:var(--arq-color-text-secondary)}.icon{width:var(--arq-icon-lg);height:var(--arq-icon-lg);color:var(--arq-color-icon-primary);flex:none}";
(class extends F {
	static tag = "arq-tool-card";
	static styles = Fo;
	static properties = {
		href: { type: String },
		size: {
			type: String,
			values: ["large", "small"],
			default: "small"
		}
	};
	static template = `<a class="card"><span class="media"><slot name="image"></slot><span class="placeholder role-caption"><slot name="placeholder"></slot></span></span><span class="caption"><span class="title-row"><span class="title role-body-medium"><slot name="title"></slot></span>${I("arrow-up-right")}</span><span class="subtitle role-caption"><slot name="subtitle"></slot></span></span></a>`;
	setup() {
		this.shadowRoot.querySelector("slot[name=\"image\"]").addEventListener("slotchange", () => this.update());
	}
	update() {
		let e = this.shadowRoot, t = e.querySelector(".card");
		this.href ? t.href = this.href : t.removeAttribute("href");
		let n = e.querySelector("slot[name=\"image\"]").assignedElements({ flatten: !0 }).length > 0;
		e.querySelector(".placeholder").hidden = n;
	}
}).define();
//#endregion
//#region src/components/project-slide/project-slide.css?inline
var Io = ":host{background:var(--arq-color-surface-subtle);width:calc(var(--arq-layout-measure) * 3 / 4);aspect-ratio:3/4;cursor:grab;flex:none;display:block;overflow:hidden}:host([active]){width:var(--arq-layout-measure);aspect-ratio:4/5}.slide{width:100%;height:100%;position:relative}.slide ::slotted(*){object-fit:cover;-webkit-user-select:none;user-select:none;-webkit-user-drag:none;width:100%!important;max-width:none!important;height:100%!important;display:block!important}.veil{background:var(--arq-color-surface-default);opacity:.5;pointer-events:none;transition-property:opacity,color,background-color,border-color,outline-color;transition-duration:var(--arq-motion-duration-slow);transition-timing-function:var(--arq-motion-easing-standard);position:absolute;inset:0}:host([active]) .veil{opacity:0}:host([data-instant]) .veil{transition:none}:host([data-dragging]){cursor:grabbing}:host(:focus-visible){outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}";
(class extends F {
	static tag = "arq-project-slide";
	static styles = Io;
	static properties = { active: { type: Boolean } };
	static template = "<div class=\"slide\"><slot name=\"image\"></slot><span class=\"veil\" aria-hidden=\"true\"></span></div>";
}).define();
//#endregion
//#region src/components/project-slider/project-slider.css?inline
var Lo = ":host{min-width:0;display:block}.slider{gap:var(--arq-space-gap-3xl);flex-direction:column;min-width:0;display:flex}.rail{height:calc(var(--arq-layout-measure) * 5 / 4);margin-inline:calc(var(--section-inline,var(--arq-space-padding-4xl)) * -1);width:calc(100% + var(--section-inline,var(--arq-space-padding-4xl)) * 2);cursor:grab;-webkit-user-select:none;user-select:none;touch-action:pan-y;overflow:hidden}.rail[data-dragging]{cursor:grabbing}.track{align-items:center;gap:var(--arq-space-gap-sm);width:max-content;height:100%;transition:transform var(--arq-motion-duration-slow) var(--arq-motion-easing-standard);display:flex}.before,.after,.track>slot{display:contents}::slotted(arq-project-slide){flex:none}.caption{justify-content:space-between;align-items:flex-end;gap:var(--arq-space-gap-lg);min-width:0;display:flex}.info{flex:0 1 var(--arq-layout-measure);max-width:var(--arq-layout-measure);color:var(--arq-color-text-primary);overflow-wrap:break-word;margin:0}.controls{flex:none}@media (width<=767px){.caption{flex-direction:column;align-items:flex-start}.info{flex-basis:auto;max-width:none}.controls{display:none}}.lightbox{box-sizing:border-box;width:100%;max-width:none;height:100%;max-height:none;padding:var(--arq-layout-gutter);background:var(--arq-color-surface-transparent);color:var(--arq-color-text-primary);border:0;margin:0;position:fixed;inset:0;overflow:hidden}.lightbox[open]{gap:var(--arq-space-gap-md);grid-template-rows:auto minmax(0,1fr);display:grid}.lightbox::backdrop{background:var(--arq-color-overlay-scrim)}.lightbox-bar{justify-content:space-between;align-items:center;gap:var(--arq-space-gap-md);min-width:0;display:flex}.lightbox-count{min-width:0;color:var(--arq-color-text-primary);margin:0}.lightbox-stage{place-items:center;gap:var(--arq-space-gap-md);grid-template-columns:auto minmax(0,1fr) auto;min-width:0;min-height:0;display:grid}.lightbox-image{object-fit:contain;width:100%;min-width:0;height:100%;min-height:0;display:block}.lightbox-prev,.lightbox-next,.lightbox-close{flex:none}@media (prefers-reduced-motion:reduce){.track{transition:none}}", Ro = 4e3, zo = 6;
(class extends F {
	static tag = "arq-project-slider";
	static styles = Lo;
	static properties = { autoplay: { type: Boolean } };
	static template = "<div class=\"slider\"><div class=\"rail\"><div class=\"track\"><div class=\"before\"></div><slot></slot><div class=\"after\"></div></div></div><div class=\"caption\"><p class=\"info role-body\"><slot name=\"caption\"></slot></p><arq-carousel-controls class=\"controls\" buttons=\"carousel\" label-prev=\"Proyecto anterior\" label-next=\"Proyecto siguiente\"></arq-carousel-controls></div></div><dialog class=\"lightbox\" data-arq-theme=\"dark\" aria-label=\"Galería ampliada\"><div class=\"lightbox-bar\"><p class=\"lightbox-count role-body\" aria-live=\"polite\"></p><arq-icon-button class=\"lightbox-close\" icon=\"close\" size=\"large\" background=\"subtle\">Cerrar</arq-icon-button></div><div class=\"lightbox-stage\"><arq-icon-button class=\"lightbox-prev\" icon=\"chevron-left\" size=\"large\" background=\"subtle\">Foto anterior</arq-icon-button><img class=\"lightbox-image\" alt=\"\"><arq-icon-button class=\"lightbox-next\" icon=\"chevron-right\" size=\"large\" background=\"subtle\">Foto siguiente</arq-icon-button></div></dialog>";
	#e = 0;
	#t = 0;
	#n = !1;
	#r = 0;
	#i = 0;
	#a = null;
	#o = null;
	#s = !1;
	#c = !1;
	#l = window.matchMedia("(prefers-reduced-motion: reduce)");
	#u = new ResizeObserver(() => this.#D());
	#d = () => this.#B();
	#f = () => this.#B();
	setup() {
		let e = this.shadowRoot, t = e.querySelector("slot:not([name])"), n = e.querySelector(".lightbox");
		this.setAttribute("role", "region"), this.hasAttribute("aria-label") || this.setAttribute("aria-label", "Galería de proyectos"), t.addEventListener("slotchange", () => this.#v()), e.querySelector("slot[name=\"caption\"]").addEventListener("slotchange", () => this.#p()), e.querySelector(".controls").addEventListener("arq:prev", () => this.#y(-1)), e.querySelector(".controls").addEventListener("arq:next", () => this.#y(1)), this.addEventListener("click", (e) => {
			this.#s && (e.preventDefault(), e.stopPropagation());
		}), this.addEventListener("keydown", (e) => {
			if (!n.open && (e.key === "ArrowLeft" && (e.preventDefault(), this.#y(-1)), e.key === "ArrowRight" && (e.preventDefault(), this.#y(1)), e.key === "Enter" || e.key === " ")) {
				e.preventDefault();
				let t = this.#h();
				t[this.#e] && this.#M(t[this.#e]);
			}
		});
		let r = e.querySelector(".rail");
		r.addEventListener("pointerenter", (e) => {
			e.pointerType === "mouse" && (this.#c = !0, this.#B());
		}), r.addEventListener("pointerleave", (e) => {
			e.pointerType === "mouse" && (this.#c = !1, this.#B());
		}), r.addEventListener("pointerdown", (e) => this.#F(e)), r.addEventListener("pointermove", (e) => this.#I(e)), r.addEventListener("pointerup", (e) => this.#L(e)), r.addEventListener("pointercancel", (e) => this.#L(e)), r.addEventListener("dragstart", (e) => e.preventDefault()), R(n), e.querySelector(".lightbox-close").addEventListener("click", () => n.close()), e.querySelector(".lightbox-prev").addEventListener("click", () => this.#N(-1)), e.querySelector(".lightbox-next").addEventListener("click", () => this.#N(1)), n.addEventListener("click", (e) => {
			e.target.closest("img, arq-icon-button, button, .lightbox-bar") || n.close();
		}), n.addEventListener("cancel", (e) => {
			e.preventDefault(), n.close();
		}), n.addEventListener("close", () => this.#B()), n.addEventListener("keydown", (e) => {
			e.key === "ArrowLeft" && (e.preventDefault(), e.stopPropagation(), this.#N(-1)), e.key === "ArrowRight" && (e.preventDefault(), e.stopPropagation(), this.#N(1));
		}), this.tabIndex = 0, this.#u.observe(r), this.#l.addEventListener("change", this.#d), document.addEventListener("visibilitychange", this.#f), this.#v(), this.#p();
	}
	update(e) {
		e.has("autoplay") && this.#B();
	}
	#p() {
		let e = this.shadowRoot.querySelector("slot[name=\"caption\"]"), t = e.assignedNodes({ flatten: !0 }).some((e) => e.textContent.trim());
		e.parentElement.hidden = !t;
	}
	disconnectedCallback() {
		this.#u.disconnect(), cancelAnimationFrame(this.#r), this.#E(), this.#V(), this.#l.removeEventListener("change", this.#d), document.removeEventListener("visibilitychange", this.#f);
		let e = this.shadowRoot?.querySelector(".lightbox");
		e?.open && e.close();
	}
	#m() {
		return this.shadowRoot.querySelector("slot:not([name])").assignedElements().filter((e) => e.localName === "arq-project-slide");
	}
	#h() {
		let e = this.shadowRoot;
		return [
			...e.querySelector(".before").children,
			...this.#m(),
			...e.querySelector(".after").children
		];
	}
	#g(e) {
		let t = e.cloneNode(!0);
		return t.removeAttribute("active"), t.setAttribute("aria-hidden", "true"), t;
	}
	#_() {
		let e = this.shadowRoot, t = e.querySelector(".before"), n = e.querySelector(".after"), r = this.#m();
		if (t.replaceChildren(), n.replaceChildren(), !(r.length < 2)) for (let e of r) t.append(this.#g(e)), n.append(this.#g(e));
	}
	#v() {
		this.#_();
		let e = this.#m(), t = e.length;
		if (!this.#n && t) {
			let n = e.findIndex((e) => e.active), r = n >= 0 ? n : Math.floor((t - 1) / 2);
			this.#e = t > 1 ? t + r : r, this.#n = !0;
		} else this.#e = t > 1 ? t + (this.#e % t + t) % t : 0;
		this.#S(), this.#w();
		for (let e of this.querySelectorAll("img")) e.draggable = !1;
		this.#B();
	}
	#y(e) {
		if (!this.#o && !(this.#m().length < 2)) {
			if (this.#b() && this.#x(), this.#e += e, this.#l.matches) {
				this.#x(), this.#B();
				return;
			}
			this.#S(), this.#C(), this.#b() && this.#T(), this.#B();
		}
	}
	#b() {
		let e = this.#m().length;
		return e > 1 && (this.#e < e || this.#e >= e * 2);
	}
	#x() {
		let e = this.#m().length;
		e > 1 && (this.#e = e + (this.#e % e + e) % e), this.#S(), this.#w();
	}
	#S() {
		let e = this.#h(), t = this.#m().length;
		e.forEach((e, t) => {
			e.active = t === this.#e;
		});
		let n = this.shadowRoot.querySelector(".controls"), r = t ? (this.#e % t + t) % t : 0;
		n.hidden = t < 2, n.count = Math.max(t, 1), n.index = r, n.position = t > 1 ? "middle" : "start";
	}
	#C() {
		cancelAnimationFrame(this.#r), this.#r = requestAnimationFrame(() => this.#D());
	}
	#w() {
		let e = this.shadowRoot.querySelector(".track");
		cancelAnimationFrame(this.#r), this.#E();
		for (let e of this.#h()) e.setAttribute("data-instant", "");
		e.style.transition = "none", this.#D(), e.getBoundingClientRect(), e.style.transition = "", requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				for (let e of this.#h()) e.removeAttribute("data-instant");
			});
		});
	}
	#T() {
		let e = this.shadowRoot.querySelector(".track");
		this.#E(), this.#a = (t) => {
			t.target === e && t.propertyName === "transform" && (this.#E(), this.#x());
		}, e.addEventListener("transitionend", this.#a);
	}
	#E() {
		let e = this.shadowRoot.querySelector(".track");
		this.#a && e && (e.removeEventListener("transitionend", this.#a), this.#a = null);
	}
	#D() {
		if (this.#o?.moved) return;
		let e = this.#O();
		e.slides[this.#e] && e.rail.clientWidth && (e.track.style.transform = `translateX(${this.#k(this.#e, e)}px)`);
	}
	#O() {
		let e = this.shadowRoot, t = e.querySelector(".rail"), n = e.querySelector(".track");
		return {
			rail: t,
			track: n,
			slides: this.#h(),
			gap: Number.parseFloat(getComputedStyle(n).columnGap || getComputedStyle(n).gap) || 0
		};
	}
	#k(e, t = this.#O()) {
		let { rail: n, slides: r, gap: i } = t, a = r[e];
		if (!a || !n.clientWidth) return 0;
		let o = 0;
		for (let t = 0; t < e; t += 1) o += r[t].offsetWidth + i;
		return n.clientWidth / 2 - o - a.offsetWidth / 2;
	}
	#A(e) {
		let t = this.#O(), n = this.#e, r = Infinity;
		for (let i = 0; i < t.slides.length; i += 1) {
			let a = Math.abs(this.#k(i, t) - e);
			a < r && (r = a, n = i);
		}
		return n;
	}
	#j() {
		return this.#m().map((e) => {
			let t = e.querySelector("[slot=\"image\"]");
			return {
				src: t?.getAttribute("src") || "",
				alt: t?.getAttribute("alt") || ""
			};
		});
	}
	#M(e) {
		let t = this.#h().indexOf(e), n = this.#m().length;
		if (t < 0 || !n) return;
		let r = (t % n + n) % n;
		if (!this.#j()[r]?.src) return;
		this.#e = t, this.#x(), this.#t = r, this.#P();
		let i = this.shadowRoot.querySelector(".lightbox");
		i.open || i.showModal(), this.#B();
	}
	#N(e) {
		let t = this.#m().length;
		t < 2 || (this.#t = (this.#t + e + t) % t, this.#e = t + this.#t, this.#S(), this.#w(), this.#P());
	}
	#P() {
		let e = this.shadowRoot, t = this.#j(), n = t[this.#t], r = e.querySelector(".lightbox-image"), i = t.length;
		if (!n) return;
		r.src = n.src, r.alt = n.alt;
		let a = String(this.#t + 1).padStart(2, "0"), o = String(i).padStart(2, "0");
		e.querySelector(".lightbox-count").textContent = `${a} / ${o}`, e.querySelector(".lightbox-prev").hidden = i < 2, e.querySelector(".lightbox-next").hidden = i < 2;
	}
	#F(e) {
		if (e.pointerType === "mouse" && e.button !== 0 || this.#m().length < 2) return;
		let t = e.composedPath().find((e) => e.localName === "arq-project-slide");
		this.#b() && this.#x(), this.#o = {
			id: e.pointerId,
			x: e.clientX,
			tx: this.#k(this.#e),
			moved: !1,
			slide: t
		}, e.currentTarget.setPointerCapture(e.pointerId), this.#B();
	}
	#I(e) {
		if (!this.#o || e.pointerId !== this.#o.id) return;
		let t = e.clientX - this.#o.x;
		if (!this.#o.moved) {
			if (Math.abs(t) <= zo) return;
			this.#o.moved = !0, this.shadowRoot.querySelector(".track").style.transition = "none", this.#R(!0), this.#B();
		}
		e.preventDefault(), this.shadowRoot.querySelector(".track").style.transform = `translateX(${this.#o.tx + t}px)`;
	}
	#L(e) {
		if (!this.#o || e.pointerId !== this.#o.id) return;
		let t = this.#o;
		this.#o = null, this.#s = !0, setTimeout(() => {
			this.#s = !1;
		}, 0);
		let n = this.shadowRoot.querySelector(".track");
		if (this.#R(!1), n.style.transition = "", !t.moved) {
			e.type === "pointerup" && t.slide && this.#M(t.slide);
			return;
		}
		let r = t.tx + (e.clientX - t.x);
		this.#e = this.#A(r), this.#l.matches ? this.#x() : (this.#S(), this.#C(), this.#b() && this.#T()), this.#B();
	}
	#R(e) {
		this.shadowRoot.querySelector(".rail").toggleAttribute("data-dragging", e);
		for (let t of this.#h()) t.toggleAttribute("data-dragging", e);
	}
	#z() {
		let e = this.shadowRoot?.querySelector(".lightbox");
		return !!this.autoplay && !this.#l.matches && !this.#c && !this.#o && !e?.open && !document.hidden && this.#m().length > 1;
	}
	#B() {
		this.#V(), this.#z() && (this.#i = window.setInterval(() => this.#y(1), Ro));
	}
	#V() {
		window.clearInterval(this.#i), this.#i = 0;
	}
}).define();
//#endregion
//#region src/components/featured-products/featured-products.css?inline
var Bo = ":host{min-width:0;display:block}.layout{align-items:flex-start;gap:var(--arq-space-gap-4xl);min-width:0;display:flex}.intro{flex:0 0 var(--arq-layout-measure);align-items:flex-start;gap:var(--arq-space-gap-lg);flex-direction:column;min-width:0;display:flex}.rail{gap:var(--arq-space-gap-sm);overscroll-behavior-x:contain;scroll-snap-type:x mandatory;scrollbar-width:none;cursor:grab;-webkit-user-select:none;user-select:none;touch-action:pan-y;flex:auto;min-width:0;display:flex;overflow-x:auto}.rail[data-dragging]{scroll-snap-type:none;cursor:grabbing}.rail::-webkit-scrollbar{display:none}.rail>*{flex:0 0 var(--arq-layout-card-min-wide);scroll-snap-align:start}:host([layout=stacked]) .layout{align-items:stretch;gap:var(--arq-space-gap-2xl);flex-direction:column}:host([layout=stacked]) .intro{flex-direction:row;flex:none;justify-content:space-between;align-items:flex-end;width:100%}:host([layout=stacked]) .rail{width:auto;margin-inline-end:calc(var(--section-inline,0px) * -1);padding-inline-end:var(--section-inline,0px)}@media (width<=767px){.layout{gap:var(--arq-space-gap-xl);flex-direction:column}.intro{flex-basis:auto;width:100%}:host([layout=stacked]) .intro{flex-direction:column;align-items:flex-start}}.fallback{align-items:flex-start;gap:var(--arq-space-gap-sm);color:var(--arq-color-text-primary);flex-direction:column;display:flex}";
(class extends F {
	static tag = "arq-featured-products";
	static styles = To + Bo;
	static properties = { layout: {
		type: String,
		values: ["side", "stacked"],
		default: "side"
	} };
	static template = "<div class=\"layout\"><div class=\"intro\"><slot name=\"intro\"></slot><arq-carousel-controls class=\"controls\" buttons=\"carousel\" for=\"featured-rail\" step=\"item\" label-prev=\"Productos anteriores\" label-next=\"Productos siguientes\"></arq-carousel-controls></div><div class=\"rail\" id=\"featured-rail\"></div></div><div class=\"fallback role-body\" hidden><slot></slot></div>";
	#e = "";
	#t = 0;
	#n = null;
	#r = 0;
	#i = !1;
	#a = !1;
	#o = null;
	#s = !1;
	#c = 0;
	#l = window.matchMedia("(prefers-reduced-motion: reduce)");
	#u = () => this.#y();
	#d = () => this.#y();
	#f = new IntersectionObserver(([e]) => {
		this.#i = e.isIntersecting, this.#y();
	});
	setup() {
		this.shadowRoot.querySelector(".fallback slot").addEventListener("slotchange", () => this.#p());
		let e = this.shadowRoot.querySelector(".rail");
		e.addEventListener("pointerenter", (e) => this.#g(e, !0), !0), e.addEventListener("pointerleave", (e) => this.#g(e, !1), !0), e.addEventListener("pointerdown", (e) => this.#C(e)), e.addEventListener("pointermove", (e) => this.#w(e)), e.addEventListener("pointerup", (e) => this.#T(e)), e.addEventListener("pointercancel", (e) => this.#T(e)), e.addEventListener("dragstart", (e) => e.preventDefault()), e.addEventListener("click", (e) => {
			this.#s && (this.#s = !1, window.clearTimeout(this.#c), e.preventDefault(), e.stopPropagation());
		}, !0), e.addEventListener("focusin", () => this.#y()), e.addEventListener("focusout", () => queueMicrotask(() => this.#y())), this.#l.addEventListener("change", this.#d), document.addEventListener("visibilitychange", this.#u), this.#f.observe(this), this.#p();
	}
	disconnectedCallback() {
		this.#x(), window.clearTimeout(this.#c), this.#f.disconnect(), this.#l.removeEventListener("change", this.#d), document.removeEventListener("visibilitychange", this.#u);
	}
	async #p() {
		let e = [...this.querySelectorAll(":scope > a[data-group]")].map((e) => e.dataset.group.trim()).filter(Boolean), t = e.join("\n");
		if (t === this.#e) return;
		this.#e = t;
		let n = ++this.#t;
		this.setAttribute("aria-busy", "true");
		let r = [];
		try {
			r = e.length ? await kt(e) : [];
		} catch (e) {
			console.error("[arq] featured-products: no se pudo cargar el catálogo", e);
		}
		n === this.#t && (this.removeAttribute("aria-busy"), this.#m(r));
	}
	#m(e) {
		let t = this.shadowRoot, n = t.querySelector(".rail"), r = e.map((e) => this.#O(e));
		n.replaceChildren(...r), this.#n?.disconnect(), this.#n = Eo(r), n.hidden = e.length === 0, t.querySelector(".controls").hidden = e.length === 0, t.querySelector(".fallback").hidden = e.length > 0, this.#y();
	}
	#h(e) {
		if (!e || e.nodeType !== Node.ELEMENT_NODE) return null;
		if (e.localName === "arq-product-card") return e;
		let t = e.getRootNode?.()?.host;
		return t?.localName === "arq-product-card" ? t : e.closest?.("arq-product-card") ?? null;
	}
	#g(e, t) {
		this.#h(e.target) && (t || !this.#h(e.relatedTarget)) && (this.#a = t, this.#y());
	}
	#_() {
		let e = this.shadowRoot.activeElement;
		return !!this.#h(e);
	}
	#v() {
		return (Number.parseFloat(getComputedStyle(this).getPropertyValue("--arq-motion-duration-feedback")) || 2e3) * 2;
	}
	#y() {
		let e = this.shadowRoot.querySelector(".rail");
		!e.hidden && this.#i && !this.#a && !this.#o && !this.#_() && !this.#l.matches && document.visibilityState === "visible" && e.scrollWidth - e.clientWidth > 1 ? this.#b() : this.#x();
	}
	#b() {
		this.#r ||= window.setInterval(() => this.#D(), this.#v());
	}
	#x() {
		window.clearInterval(this.#r), this.#r = 0;
	}
	#S() {
		let e = this.shadowRoot.querySelector(".rail"), t = e.firstElementChild;
		if (!t) return 0;
		let n = Number.parseFloat(getComputedStyle(e).columnGap || getComputedStyle(e).gap) || 0;
		return t.offsetWidth + n;
	}
	#C(e) {
		if (e.pointerType === "mouse" && e.button !== 0) return;
		let t = e.currentTarget;
		t.scrollWidth - t.clientWidth <= 1 || (this.#o = {
			id: e.pointerId,
			x: e.clientX,
			y: e.clientY,
			left: t.scrollLeft,
			lastX: e.clientX,
			lastT: e.timeStamp,
			vx: 0,
			moved: !1,
			axis: null
		}, this.#y());
	}
	#w(e) {
		if (!this.#o || e.pointerId !== this.#o.id) return;
		let t = e.clientX - this.#o.x, n = e.clientY - this.#o.y;
		if (!this.#o.axis) {
			if (Math.abs(t) < 6 && Math.abs(n) < 6) return;
			this.#o.axis = Math.abs(t) > Math.abs(n) ? "x" : "y";
		}
		if (this.#o.axis !== "x") return;
		let r = this.shadowRoot.querySelector(".rail");
		this.#o.moved || (this.#o.moved = !0, r.setPointerCapture(e.pointerId), r.setAttribute("data-dragging", ""));
		let i = Math.max(e.timeStamp - this.#o.lastT, 1);
		this.#o.vx = (e.clientX - this.#o.lastX) / i, this.#o.lastX = e.clientX, this.#o.lastT = e.timeStamp, e.preventDefault(), r.scrollLeft = this.#o.left - t;
	}
	#T(e) {
		if (!this.#o || e.pointerId !== this.#o.id) return;
		let t = this.#o;
		this.#o = null, this.shadowRoot.querySelector(".rail").removeAttribute("data-dragging"), t.moved && e.type === "pointerup" && (this.#s = !0, window.clearTimeout(this.#c), this.#c = window.setTimeout(() => {
			this.#s = !1;
		}, 400), this.#E(t.vx)), this.#y();
	}
	#E(e) {
		let t = this.shadowRoot.querySelector(".rail"), n = this.#S();
		if (!n) return;
		let r = t.scrollWidth - t.clientWidth, i = t.scrollLeft;
		Math.abs(e) > .4 && (i -= Math.sign(e) * n);
		let a = Math.round(i / n);
		t.scrollTo({
			left: Math.min(r, Math.max(0, a * n)),
			behavior: this.#l.matches ? "auto" : "smooth"
		});
	}
	#D() {
		if (this.#o) return;
		let e = this.shadowRoot.querySelector(".rail"), t = e.scrollWidth - e.clientWidth;
		if (!(t <= 1)) {
			if (e.scrollLeft >= t - 1) {
				e.scrollTo({
					left: 0,
					behavior: this.#l.matches ? "auto" : "smooth"
				});
				return;
			}
			this.shadowRoot.querySelector(".controls").go(1);
		}
	}
	#O({ name: e, meta: t, href: n, image: r, imageHover: i, imageLit: a, imageHoverLit: o }) {
		let s = document.createElement("arq-product-card");
		s.href = n, s.showCursor = !0, s.image = r, s.imageHover = i, s.imageLit = a, s.imageHoverLit = o;
		let c = document.createElement("h3");
		if (c.slot = "name", c.textContent = e, s.append(c), t) {
			let e = document.createElement("span");
			e.slot = "meta", e.textContent = t, s.append(e);
		}
		return s;
	}
}).define();
//#endregion
//#region src/components/catalog-listing/catalog-listing.css?inline
var Vo = ":host{box-sizing:border-box;min-width:0;padding:0 var(--page-gutter) var(--arq-space-section-xl);background:var(--arq-color-surface-default);transition-property:background-color;transition-duration:var(--arq-illumination-bg-duration);transition-delay:0s;transition-timing-function:var(--arq-illumination-bg-easing);display:block}.layout{gap:var(--arq-space-gap-xl);flex-direction:column;min-width:0;display:flex}.nav{min-width:0}.content{gap:var(--arq-space-gap-xl-2xl);flex-direction:column;min-width:0;display:flex}.status{color:var(--arq-color-text-secondary);margin:0}.status:empty{display:none}.grid{--busy-opacity:.5;transition-property:opacity;transition-duration:var(--arq-motion-duration-fast);transition-timing-function:var(--arq-motion-easing-standard)}:host([aria-busy=true]) .grid{opacity:var(--busy-opacity);transition-delay:var(--arq-motion-duration-fast)}.grid>arq-product-card{transition-property:opacity,transform;transition-duration:var(--arq-motion-duration-base);transition-timing-function:var(--arq-motion-easing-out);transition-delay:calc(var(--enter-index,0) * var(--arq-motion-duration-fast) / 4)}@starting-style{.grid>arq-product-card{opacity:0;transform:translateY(var(--arq-space-gap-sm))}}@media (prefers-reduced-motion:reduce){.grid>arq-product-card{transition-property:opacity;transition-duration:var(--arq-motion-duration-fade);transition-delay:0s}@starting-style{.grid>arq-product-card{transform:none}}}@media (width>=1024px){.layout{grid-template-columns:var(--arq-layout-catalog-nav) minmax(0, 1fr);column-gap:var(--arq-space-section-xs);display:grid}.toolbar{top:calc(var(--arq-space-gap-md) * 2 + var(--arq-icon-xl));z-index:3;background:var(--arq-color-surface-default);transition-property:background-color;transition-duration:var(--arq-illumination-bg-duration);transition-delay:0s;transition-timing-function:var(--arq-illumination-bg-easing);position:sticky}.nav{top:calc(var(--arq-space-gap-md) * 2 + var(--arq-icon-xl));align-self:start;position:sticky}}@media (width<=767px){:host(:not([unit=colecciones])) .nav{display:none}.content{gap:var(--arq-space-gap-xl)}}", Ho = {
	environment: "environment",
	application: "application",
	product_type: "productType",
	collection: "collection"
}, Uo = matchMedia("(min-width: 1024px)"), Wo = matchMedia("(min-width: 1920px)"), Go = 8, Ko = {
	productos: {
		loading: "Cargando productos…",
		empty: "No hay productos con estos filtros.",
		error: "No se pudieron cargar los productos. Probá de nuevo en unos minutos."
	},
	colecciones: {
		loading: "Cargando colecciones…",
		empty: "No hay colecciones con estos filtros.",
		error: "No se pudieron cargar las colecciones. Probá de nuevo en unos minutos."
	}
}, qo = class extends F {
	static tag = "arq-catalog-listing";
	static styles = Vo;
	static properties = { unit: {
		type: String,
		values: ["productos", "colecciones"],
		default: "productos"
	} };
	static template = "<div class=\"layout\"><div class=\"nav\"><slot name=\"nav\"></slot></div><div class=\"content\"><arq-catalog-toolbar class=\"toolbar\" for=\"filters\" show-iluminar></arq-catalog-toolbar><p class=\"status role-body\" role=\"status\"></p><arq-grid class=\"grid\"></arq-grid></div></div><arq-filter-panel id=\"filters\"><slot name=\"filter-title\" slot=\"title\"></slot></arq-filter-panel><arq-compare-bar class=\"compare\"></arq-compare-bar><arq-compare-picker class=\"picker\"></arq-compare-picker><div class=\"compare-space\" aria-hidden=\"true\"></div><p class=\"notice visually-hidden\" aria-live=\"polite\"></p>";
	#e = {};
	#t = "";
	#n = {};
	#r = /* @__PURE__ */ new Map();
	#i = 0;
	#a = null;
	#o = null;
	setup() {
		new URLSearchParams(location.search).get("view") === "colecciones" && (this.unit = "colecciones");
		let e = this.shadowRoot;
		this.#e = Jo(), this.#t = new URLSearchParams(location.search).get("q")?.trim() ?? "", e.querySelector("slot[name=\"nav\"]").addEventListener("slotchange", () => this.#C()), e.addEventListener("click", this.#s), document.querySelector("arq-page-header")?.addEventListener("click", this.#s), di(!1), e.querySelector(".grid").addEventListener("click", (e) => {
			e.composedPath().some((e) => e.localName === "a" && e.hasAttribute("href")) && di(document.documentElement.getAttribute("data-arq-theme") === "dark");
		}), window.addEventListener("popstate", this.#c);
		let t = e.querySelector("arq-filter-panel");
		t.addEventListener("arq:filters", (e) => this.#g(e.detail.filters)), t.addEventListener("arq:apply", (e) => {
			this.#n = e.detail.filters, this.#m();
		});
		let n = e.querySelector(".grid"), r = () => {
			n.columns = Uo.matches ? Wo.matches ? 4 : 3 : null;
		};
		Uo.addEventListener("change", r), Wo.addEventListener("change", r), r();
		let i = e.querySelector(".toolbar"), a = null, o = () => {
			if (a?.disconnect(), i.stuck = !1, !Uo.matches) return;
			let e = Number.parseFloat(getComputedStyle(i).top) || 0;
			a = new IntersectionObserver(([t]) => {
				i.stuck = t.intersectionRatio < 1 && t.boundingClientRect.top <= e + 1;
			}, {
				rootMargin: `-${e + 1}px 0px 0px 0px`,
				threshold: 1
			}), a.observe(i);
		};
		Uo.addEventListener("change", o), o();
		let s = e.querySelector(".compare");
		n.addEventListener("arq:compare", (e) => {
			let t = e.target, n = this.#r.get(t);
			n && (e.detail.checked ? s.add({
				sku: n.sku,
				name: n.name,
				meta: n.meta,
				image: n.image
			}) || (t.compared = !1, this.#v(`Podés comparar hasta ${s.items.length} productos. Sacá uno de la barra para sumar otro.`)) : s.remove(n.sku));
		}), n.addEventListener("arq:finish", (e) => {
			let t = e.target, n = this.#r.get(t);
			n && (Object.assign(n, {
				sku: e.detail.sku ?? n.sku,
				href: e.detail.href,
				image: e.detail.image
			}), this.unit === "productos" && (t.compared = s.has(n.sku)));
		}), s.addEventListener("arq:compare-change", () => {
			this.#x(), requestAnimationFrame(() => this.#p()), c.open && this.#u();
		});
		let c = e.querySelector(".picker");
		s.addEventListener("arq:add", (e) => {
			e.stopPropagation(), c.show();
		}), c.addEventListener("arq:search", () => this.#u()), c.addEventListener("arq:close", (e) => {
			e.detail.restored || s.focusAdd();
		}), c.addEventListener("arq:add", (e) => {
			let { sku: t, name: n, cardMeta: r, meta: i, image: a } = e.detail.item;
			s.add({
				sku: t,
				name: n,
				meta: r ?? i,
				image: a
			});
		}), new ResizeObserver(() => this.#p()).observe(s), requestAnimationFrame(() => this.#p());
	}
	#s = (e) => {
		if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
		let t = e.target.closest?.("arq-catalog-nav-item, arq-breadcrumb-item:not([current])"), n = t?.getAttribute("href") ?? t?.href;
		if (!n) return;
		let r = new URL(n, location.href);
		r.origin === location.origin && r.pathname.replace(/\/$/, "") === location.pathname.replace(/\/$/, "") && (e.preventDefault(), r.pathname + r.search !== location.pathname + location.search && (history.pushState(null, "", r.pathname + r.search), this.shadowRoot.querySelector("arq-filter-panel").open = !1, this.#d()));
	};
	#c = () => this.#d();
	#l = 0;
	async #u() {
		let e = this.shadowRoot, t = e.querySelector(".compare"), n = e.querySelector(".picker"), r = t.items.map((e) => e.sku), i = ++this.#l;
		n.count = r.length, n.href = location.pathname;
		try {
			let { items: e } = await Yt({
				...n.search,
				selected: r
			});
			i === this.#l && (n.items = e);
		} catch (e) {
			console.error("[arq] compare-picker: no se pudo cargar el catálogo", e);
		}
	}
	#d() {
		let e = new URLSearchParams(location.search), t = e.get("view") === "colecciones" ? "colecciones" : "productos";
		this.#e = Jo(), this.#t = e.get("q")?.trim() ?? "", this.#n = {}, this.shadowRoot.querySelector("arq-filter-panel").clear(), this.#C(), this.unit === t ? this.#m() : this.unit = t;
	}
	#f = 0;
	#p() {
		let e = this.shadowRoot.querySelector(".compare"), t = e.shadowRoot?.querySelector(".bar"), n = this.shadowRoot.querySelector(".compare-space"), r = !e.hidden && t && !t.hidden ? t.getBoundingClientRect().height : 0;
		if (clearTimeout(this.#f), r || !n.style.height || !t) {
			n.style.height = r ? `${r}px` : "";
			return;
		}
		let i = Number.parseFloat(getComputedStyle(t).transitionDuration) * 1e3 || 0;
		this.#f = setTimeout(() => {
			n.style.height = "";
		}, i);
	}
	update(e) {
		if (!e.has("unit")) return;
		let t = this.shadowRoot;
		t.querySelector(".toolbar").unit = this.unit, t.querySelector("arq-filter-panel").unit = this.unit, t.querySelector("arq-filter-panel").showCategories = this.unit === "productos", this.#t && this.unit === "productos" && this.#T(), this.#m({ rows: !0 });
	}
	async #m({ rows: e = !1 } = {}) {
		let t = ++this.#i, n = Ko[this.unit] ?? Ko.productos;
		this.setAttribute("aria-busy", "true"), e && this.#_(n.loading);
		let r = null;
		try {
			r = await this.#h(this.#n);
		} catch (e) {
			console.error("[arq] catalog-listing: no se pudo cargar el catálogo", e);
		}
		if (t !== this.#i) return;
		this.removeAttribute("aria-busy");
		let i = this.shadowRoot.querySelector(".toolbar");
		if (!r) {
			i.count = null, this.#y([]), this.#_(n.error);
			return;
		}
		e && this.#S(r.filters), i.count = r.count, this.#y(r.cards), this.#_(r.count ? "" : this.#t && this.unit === "productos" ? `No hay productos para «${this.#t}».` : n.empty);
	}
	#h(e) {
		return this.unit === "colecciones" ? yt({ filters: e }) : vt({
			...this.#e,
			query: this.#t,
			filters: e
		});
	}
	async #g(e) {
		let t = this.shadowRoot.querySelector("arq-filter-panel");
		try {
			t.count = (await this.#h(e)).count;
		} catch {
			t.count = null;
		}
	}
	#_(e) {
		let t = this.shadowRoot.querySelector(".status");
		t.textContent = e, t.hidden = !e;
	}
	#v(e) {
		let t = this.shadowRoot.querySelector(".notice");
		t.textContent = "", requestAnimationFrame(() => {
			t.textContent = e;
		});
	}
	#y(e) {
		let t = this.unit === "productos";
		this.#r = new Map(e.map((e, n) => {
			let r = this.#b(e, t);
			return r.style.setProperty("--enter-index", String(Math.min(n, Go))), [r, e];
		})), this.shadowRoot.querySelector(".grid").replaceChildren(...this.#r.keys()), t && this.#x();
	}
	#b(e, t) {
		let n = document.createElement("arq-product-card");
		n.href = e.href, n.image = e.image, n.imageHover = e.imageHover, n.imageLit = e.imageLit, n.imageHoverLit = e.imageHoverLit, n.showCompare = t;
		let r = document.createElement("h2");
		if (r.slot = "name", r.textContent = e.name, n.append(r), Ri(n, e.finishes), !t && e.meta) {
			let t = document.createElement("span");
			t.slot = "meta", t.textContent = e.meta, n.append(t);
		}
		return n;
	}
	#x() {
		let e = this.shadowRoot.querySelector(".compare");
		for (let [t, n] of this.#r) t.compared = e.has(n.sku);
	}
	#S(e) {
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
		this.#g({});
	}
	#C() {
		let e = this.shadowRoot.querySelector("slot[name=\"nav\"]").assignedElements()[0];
		if (!e) return;
		let t = location.pathname + location.search, n = null;
		for (let r of e.querySelectorAll("arq-catalog-nav-item")) {
			let e = r.getAttribute("href");
			r.selected = !!e && Yo(e, t), r.selected && (n ??= r);
		}
		let r = n?.closest("arq-catalog-nav-group");
		for (let t of e.querySelectorAll(":scope > arq-catalog-nav-group")) t.selected = t === r;
		this.#E(n), this.#w(e);
		let i = document.querySelector("arq-page-header");
		i && (i.showDescription = this.unit !== "colecciones");
	}
	#w(e) {
		let t = this.shadowRoot.querySelector("arq-filter-panel"), n = t.querySelector("[slot=\"categories\"]") ?? document.createElement("nav");
		n.slot = "categories", n.setAttribute("aria-label", "Categorías de productos");
		let r = [...e.querySelectorAll(":scope > arq-catalog-nav-group")].map((e) => {
			let t = e.cloneNode(!0);
			return t.open = e.selected, t;
		});
		n.replaceChildren(...r), n.isConnected || t.append(n);
	}
	#T() {
		let e = document.querySelector("arq-page-header > [slot=\"title\"]");
		e && (this.#o ??= e.textContent), e && (e.textContent = `Resultados para «${this.#t}»`), e?.parentElement.setAttribute("search-title", ""), this.#D([{
			label: "Productos",
			href: location.pathname
		}], !0);
	}
	#E(e) {
		let t = e?.closest("arq-catalog-nav-group"), n = t?.querySelector(":scope > arq-catalog-nav-item"), r = t?.querySelector("[slot=\"label\"]")?.textContent.trim(), i = e && e !== n, a = i ? e.textContent.trim() : r, o = document.querySelector("arq-page-header > [slot=\"title\"]");
		if (!a && this.#t && this.unit === "productos") return this.#T();
		o && (this.#o ??= o.textContent, o.textContent = a || this.#o, o.parentElement.removeAttribute("search-title")), a ? i ? this.#D([{
			label: r,
			href: n.getAttribute("href")
		}, { label: a }]) : this.#D([{
			label: "Productos",
			href: location.pathname
		}, { label: a }]) : this.#D([]);
	}
	#D(e, t = !1) {
		let n = document.querySelector("arq-page-header > arq-breadcrumb");
		if (!n) return;
		this.#a ??= [...n.children].slice(1);
		let [r] = n.children, i = e.length ? e.map(({ label: n, href: r }, i) => {
			let a = document.createElement("arq-breadcrumb-item");
			return i === e.length - 1 && !t ? a.current = !0 : (a.href = r, a.showSeparator = !0), a.textContent = n, a;
		}) : this.#a;
		n.replaceChildren(...[r, ...i].filter(Boolean));
	}
};
function Jo() {
	let e = new URLSearchParams(location.search), t = {};
	for (let [n, r] of Object.entries(Ho)) {
		let i = e.get(n);
		i && (t[r] = i);
	}
	return t;
}
function Yo(e, t) {
	let n = new URL(e, location.href), r = (e) => [...new URLSearchParams(e)].sort().join("&"), i = new URL(t, location.href);
	return n.pathname.replace(/\/$/, "") === i.pathname.replace(/\/$/, "") && r(n.search) === r(i.search);
}
qo.define();
//#endregion
//#region src/components/ficha-producto/ficha-producto.css?inline
var Xo = ":host{min-width:0;color:var(--arq-color-text-primary);display:block}.page:not([data-ready]) .needs-data{display:none}.hero{background:var(--arq-color-surface-default);color:var(--arq-color-text-primary);transition-property:background-color,color;transition-duration:var(--arq-illumination-bg-duration), var(--arq-theme-text-duration,var(--arq-motion-duration-fast));transition-delay:0s, var(--arq-theme-text-delay,0s);transition-timing-function:var(--arq-illumination-bg-easing), var(--arq-theme-text-easing,var(--arq-motion-easing-standard));padding:0}.hero[data-arq-theme=dark]+.details{padding-top:var(--arq-space-section-md)}.configurator{column-gap:var(--arq-space-gap-3xl);grid-template-columns:minmax(0,14fr) minmax(0,9fr);align-items:stretch;display:grid}.gallery-column{aspect-ratio:4/3;flex-direction:column;justify-self:stretch;min-width:0;display:flex;position:relative;overflow:hidden}.gallery{flex:auto;min-height:0}.iluminar{z-index:2;right:var(--arq-space-padding-xl-2xl);bottom:var(--arq-space-padding-xl);position:absolute}.configurator-column{justify-content:space-between;gap:var(--arq-space-gap-4xl);min-width:0;padding-right:var(--page-gutter);padding-bottom:var(--arq-space-padding-xl);flex-direction:column;display:flex}.header{align-items:flex-start;gap:var(--arq-space-gap-xl);padding-top:var(--arq-space-padding-xl);flex-direction:column;min-width:0;display:flex}.title-row{align-items:flex-start;gap:var(--arq-space-gap-sm);flex-direction:column;min-width:0;display:flex}.title{overflow-wrap:break-word;min-width:0}.info{gap:var(--arq-space-gap-lg);flex-direction:column;flex:auto;min-width:0;display:flex}.status{color:var(--arq-color-text-secondary);margin:0}.product{align-items:flex-start;gap:var(--arq-space-gap-lg);flex-direction:column;min-width:0;display:flex}.description{max-width:100%;color:var(--arq-color-text-tertiary);overflow-wrap:break-word}::slotted([slot=description]){font:inherit!important;color:inherit!important;margin:0!important}.options{gap:var(--arq-space-gap-lg);flex-direction:column;display:flex}.buy{gap:var(--arq-space-gap-md);flex-direction:column;display:flex}.actions{gap:var(--arq-space-gap-md);display:flex}.actions arq-button{flex:1 1 0}.details{padding:var(--arq-space-gap-4xl) var(--page-gutter) var(--arq-space-gap-4xl) var(--arq-space-section-lg)}.accordion{border-top:var(--arq-border-default) solid var(--arq-color-border-default);flex-direction:column;min-width:0;display:flex}.ambient-block{margin-bottom:var(--arq-space-section-md);position:relative}.ambient{--ambient-height:40rem;--ambient-gap:var(--arq-space-gap-md);gap:var(--ambient-gap);padding-left:var(--page-gutter);overscroll-behavior-x:contain;scrollbar-width:none;display:flex;overflow-x:auto}@media (width<=1023px){.ambient{--ambient-height:30rem}}@media (width<=767px){.ambient{--ambient-height:20rem}}.ambient::-webkit-scrollbar{display:none}.ambient:after{content:\"\";width:calc(var(--page-gutter) - var(--ambient-gap));flex:none}.ambient-cursor{z-index:3;--cursor-size:calc(var(--arq-icon-2xl) * 2);width:var(--cursor-size);height:var(--cursor-size);margin:calc(var(--cursor-size) / -2) 0 0 calc(var(--cursor-size) / -2);color:var(--arq-color-icon-inverse);pointer-events:none;display:block;position:fixed;top:0;left:0}.ambient-cursor[hidden]{display:none}.ambient-cursor .icon{width:100%;height:100%;stroke-width:var(--arq-border-strong)}.ambient-cursor[data-direction=next] [data-icon=arrow-left],.ambient-cursor[data-direction=prev] [data-icon=arrow-right],.ambient-controls{display:none}@media (hover:hover) and (pointer:fine){.ambient.is-scrollable{cursor:none}}@media (hover:none),(pointer:coarse){.ambient-cursor{display:none}.ambient-controls{justify-content:flex-end;gap:var(--arq-space-gap-sm);padding:var(--arq-space-gap-md) var(--page-gutter) 0;display:flex}}.ambient img{width:auto;height:var(--ambient-height);aspect-ratio:auto 4/5;object-fit:cover;background:var(--arq-color-surface-subtle);flex:none;max-width:none;display:block}.story-block{padding-bottom:var(--arq-space-section-sm)}.story{grid-template-columns:minmax(0, 1fr) minmax(0, var(--arq-layout-measure-wide));column-gap:var(--arq-space-gap-3xl);box-sizing:border-box;min-height:100svh;padding:var(--arq-space-section-lg);background:var(--arq-color-surface-default);color:var(--arq-color-text-primary);align-items:start;display:grid;position:relative}.story-bg{clip-path:inset(0);pointer-events:none;position:absolute;inset:0;overflow:hidden}.story-bg img{object-fit:cover;width:100%;height:100%;display:block;position:fixed;inset:0}@media (prefers-reduced-motion:reduce){.story-bg img{position:absolute}}.story-title,.story-body{min-width:0;position:relative}.story-title{max-width:var(--arq-layout-measure);grid-column:1}.story-body{align-self:center;align-items:flex-start;gap:var(--arq-space-gap-lg);flex-direction:column;grid-column:2;display:flex}.story-text{gap:var(--arq-space-gap-sm);flex-direction:column;display:flex}::slotted(h2[slot=story-title]){font-family:var(--arq-font-family-sans)!important;font-weight:var(--arq-font-weight-light)!important;font-size:var(--arq-type-heading-2-size)!important;line-height:var(--arq-type-heading-2-leading)!important;letter-spacing:var(--arq-font-tracking-normal)!important;color:inherit!important;margin:0!important}::slotted(h3[slot=story-text]),::slotted(p[slot=story-text]),::slotted(ul){font-family:var(--arq-font-family-sans)!important;font-weight:var(--arq-font-weight-regular)!important;font-size:var(--arq-type-body-xl-size)!important;line-height:var(--arq-type-body-xl-leading)!important;letter-spacing:var(--arq-font-tracking-normal)!important;color:inherit!important;margin:0!important}::slotted(ul){padding:0 0 0 var(--arq-space-padding-lg)!important;list-style-type:\"- \"!important}.story-link{align-self:flex-start}.cards{gap:var(--arq-space-gap-sm);margin:calc(-1 * var(--arq-space-gap-xs));padding:var(--arq-space-gap-xs);scroll-snap-type:x mandatory;scrollbar-width:none;display:flex;overflow-x:auto}.cards::-webkit-scrollbar{display:none}.cards arq-family-card{width:var(--arq-layout-card-min);scroll-snap-align:start;flex:none}.cards arq-family-card[size=large]{width:var(--arq-layout-card-min-wide)}.glossary{gap:var(--arq-space-gap-md);padding-top:var(--arq-space-section-sm);padding-bottom:var(--arq-space-section-xl);scroll-margin-top:var(--arq-space-gap-4xl);flex-direction:column;display:flex}.glossary-title{padding:0 var(--page-gutter)}::slotted([slot=glossary-title]:focus){outline:none}.cta{padding:var(--arq-layout-gutter)}.cta-block{justify-content:center;align-items:center;gap:var(--arq-space-gap-2xl);padding:var(--arq-space-section-md) var(--arq-layout-gutter);background:var(--arq-color-surface-subtle);color:var(--arq-color-text-primary);text-align:center;flex-direction:column;display:flex}.cta-text{align-items:center;gap:var(--arq-space-gap-sm-md);flex-direction:column;display:flex}.cta-description{max-width:var(--arq-layout-measure-wide);color:var(--arq-color-text-secondary);margin:0}::slotted([slot=cta-title]){font:inherit!important;color:inherit!important;margin:0!important}.media-portrait,.media-wide{object-fit:cover;background:var(--arq-color-surface-subtle);width:100%;min-width:0;display:block}.inspiration{align-items:flex-start;gap:var(--arq-space-gap-lg);padding:var(--arq-space-section-md) var(--arq-space-section-lg) var(--arq-space-section-xl);display:flex}.inspiration-copy{flex:0 1 var(--arq-layout-measure);gap:var(--arq-space-gap-lg);flex-direction:column;order:2;min-width:0;display:flex}.inspiration-text{color:var(--arq-color-text-primary)}::slotted([slot=inspiration]){font:inherit!important;color:inherit!important;margin:0!important}.inspiration-images{align-items:flex-start;gap:var(--arq-space-gap-md);flex:1 1 0;order:1;min-width:0;display:flex}.inspiration-images:empty{display:none}.inspiration-images .media-wide{aspect-ratio:940/568;object-position:50% 80%;flex:940 1 0}.inspiration-images .media-portrait{aspect-ratio:346/447;flex:346 1 0}.collection{padding:var(--arq-space-padding-5xl) var(--arq-space-section-lg);background:var(--arq-color-surface-subtle);color:var(--arq-color-text-primary);align-items:flex-start;display:flex}.collection-intro{align-items:flex-start;gap:var(--arq-space-gap-md);width:calc(var(--arq-layout-measure) + var(--arq-space-gap-xl-2xl));flex-direction:column;flex:none;max-width:100%;display:flex}.collection-cards{flex:auto;min-width:0}@media (width<=1023px){.hero{padding-top:0}.configurator{gap:var(--arq-space-gap-2xl);flex-direction:column;display:flex}.configurator-column{display:contents}.header{padding:var(--arq-space-padding-xl) var(--page-gutter) 0;order:-1}.gallery-column{aspect-ratio:auto;margin-inline:var(--page-gutter)}.iluminar{right:var(--arq-space-padding-md);bottom:var(--arq-space-padding-md)}.info,.buy{padding-inline:var(--page-gutter)}.buy{padding-bottom:var(--arq-space-padding-xl)}.details{padding:var(--arq-space-section-xs) var(--page-gutter)}.story{row-gap:var(--arq-space-gap-4xl);padding:var(--arq-space-section-sm) var(--page-gutter);grid-template-rows:auto 1fr;grid-template-columns:minmax(0,1fr)}.story-title,.story-body{grid-column:1;max-width:none}.story-body{align-self:end}.inspiration{align-items:stretch;gap:var(--arq-space-gap-xl);padding-inline:var(--page-gutter);flex-direction:column}.inspiration-images{flex:none;order:0}.inspiration-copy{flex:none;order:1}.cta{padding:var(--arq-space-section-xs) var(--page-gutter)}.cta-block{padding-inline:var(--arq-layout-gutter)}.collection{gap:var(--arq-space-gap-4xl);padding-inline:var(--page-gutter);flex-direction:column}.collection-intro{width:auto}}@media (width<=767px){.header{gap:var(--arq-space-gap-2xl)}.actions{flex-direction:column}.actions arq-button{flex:none;width:100%}.ambient{--ambient-gap:var(--arq-space-gap-sm-md)}.inspiration-images{flex-direction:column}.inspiration-images>*{flex:none;width:100%}.glossary{padding-top:var(--arq-space-section-xs)}}", $ = {
	loading: "Cargando producto…",
	notFound: "No encontramos este producto.",
	error: "No se pudo cargar el producto. Probá de nuevo en unos minutos.",
	datasheet: "Ficha técnica",
	generating: "Generando…",
	previous: "Anterior",
	next: "Siguiente"
}, Zo = () => matchMedia("(prefers-reduced-motion: reduce)").matches, Qo = class extends F {
	static tag = "arq-ficha-producto";
	static styles = Xo;
	static properties = { ctaHref: {
		type: String,
		default: "/arq/contacto"
	} };
	static template = `<div class="page"><div class="hero"><div class="configurator"><div class="gallery-column"><arq-product-gallery class="gallery" fill><arq-toggle class="iluminar needs-data" slot="overlay" show-label>Iluminar</arq-toggle></arq-product-gallery></div><div class="configurator-column"><div class="header"><arq-breadcrumb class="breadcrumb needs-data"></arq-breadcrumb><div class="title-row"><div class="title role-display"><slot name="title"></slot></div><arq-sku class="sku needs-data" size="compact"></arq-sku></div></div><div class="info"><p class="status role-body" role="status" hidden></p><div class="product"><div class="description role-body-regular"><span class="variant-description" hidden></span></div></div><div class="options needs-data"></div></div><div class="buy needs-data"><arq-checkbox class="compare" show-label>Comparar</arq-checkbox><div class="actions"><arq-button class="datasheet">Generar ficha técnica</arq-button><arq-button class="to-glossary" type="outline">Ver descargas</arq-button></div></div></div></div></div><div class="details needs-data"><div class="accordion"></div></div><div class="ambient-block needs-data" hidden><div class="ambient" role="region" aria-label="Galería de ambiente" tabindex="0"></div><div class="ambient-controls"><arq-icon-button class="ambient-prev" icon="arrow-left" size="large" background="outline" disabled>${$.previous}</arq-icon-button><arq-icon-button class="ambient-next" icon="arrow-right" size="large" background="outline">${$.next}</arq-icon-button></div><span class="ambient-cursor" aria-hidden="true" hidden>${I("arrow-right")}${I("arrow-left")}</span></div><div class="glossary needs-data"><div class="glossary-title role-display-sm"><slot name="glossary-title"></slot></div><arq-variants-table class="table" downloads="downloads-modal"></arq-variants-table></div><div class="story-block needs-data"><div class="story" data-arq-theme="dark" hidden><div class="story-bg" hidden><img alt="" loading="lazy"></div><div class="story-title"><slot name="story-title"></slot></div><div class="story-body"><div class="story-text"><slot name="story-text"></slot><slot name="story-list"></slot></div><arq-button class="story-link" type="underline" show-underline show-icon icon="arrow-up-right" hidden></arq-button></div></div></div><div class="cta" hidden><div class="cta-block"><div class="cta-text"><div class="cta-title role-heading-1"><slot name="cta-title"></slot></div><p class="cta-description role-body-lg"><slot name="cta-description"></slot></p></div><arq-button class="cta-action" show-icon icon="arrow-right"><slot name="cta-action"></slot></arq-button></div></div><div class="inspiration" hidden><div class="inspiration-copy"><div class="inspiration-text role-body-lg"><slot name="inspiration"></slot></div></div><div class="inspiration-images needs-data"></div></div><div class="collection needs-data" hidden><div class="collection-intro"><div class="collection-title role-heading-2"><slot name="collection-title"></slot></div><arq-button class="collection-link" type="underline" show-underline show-icon icon="arrow-up-right"></arq-button></div><div class="cards collection-cards"></div></div></div><arq-compare-bar class="compare-bar"></arq-compare-bar><arq-download-modal id="downloads-modal"><slot name="modal-title" slot="title"></slot></arq-download-modal>`;
	#e = null;
	update(e) {
		e.has("ctaHref") && (this.shadowRoot.querySelector(".cta-action").href = this.ctaHref);
	}
	#t = {};
	#n = !1;
	#r = null;
	setup() {
		let e = this.shadowRoot;
		this.#o(), e.querySelector("slot[name=\"inspiration\"]").addEventListener("slotchange", () => this.#w()), this.#w(), e.querySelector("slot[name=\"cta-title\"]").addEventListener("slotchange", () => this.#O()), this.#O(), this.#v();
		let t = matchMedia("(max-width: 1023px)"), n = () => e.querySelector(".iluminar").showLabel = !t.matches;
		t.addEventListener("change", n), n(), e.querySelector(".iluminar").addEventListener("arq:change", (e) => this.#c(e.detail.checked)), fi() && (e.querySelector(".iluminar").checked = !0, ai(() => this.#l(!0))), e.querySelector(".options").addEventListener("arq:change", (e) => {
			let t = e.target.closest("[data-attribute]")?.dataset.attribute;
			t && e.detail?.selected && (this.#t = Re(this.#t, t, e.detail.value), this.#d(), this.#f({ updateUrl: !0 }));
		}), e.querySelector(".datasheet").addEventListener("click", (e) => this.#h(this.#r, e.currentTarget)), e.querySelector(".to-glossary").addEventListener("click", () => this.#g());
		let r = e.querySelector(".compare"), i = e.querySelector(".compare-bar");
		r.addEventListener("arq:change", (e) => {
			e.stopPropagation(), this.#r && (e.detail.checked ? i.add(this.#m()) || (r.checked = !1) : i.remove(this.#r));
		}), i.addEventListener("arq:compare-change", () => {
			r.checked = i.has(this.#r);
		}), e.querySelector(".table").addEventListener("arq:downloads", (e) => this.#S(e.detail.sku)), e.querySelector("arq-download-modal").addEventListener("arq:download", (e) => {
			e.stopPropagation(), this.#h(e.currentTarget.dataset.sku);
		}), this.#i();
	}
	async #i() {
		let e = this.getAttribute("data-group");
		this.setAttribute("aria-busy", "true"), this.#a($.loading);
		let t = null, n = !1;
		try {
			t = e ? await bt(e) : null;
		} catch (e) {
			n = !0, console.error("[arq] ficha-producto: no se pudo cargar el catálogo", e);
		}
		if (this.removeAttribute("aria-busy"), !t) {
			this.#a(n ? $.error : $.notFound);
			return;
		}
		this.#e = t, this.#a("");
		let r = new URLSearchParams(location.search).get("sku");
		this.#t = Ne(t.variants, t.variantAttributes, r), this.#s(), this.#y(t.group.story), this.#C(t.group.inspiration), this.#u(), this.#d(), this.#f({
			updateUrl: !0,
			sku: t.variants.find((e) => e.sku === r)?.sku ?? t.variants.find((e) => e.isDefault)?.sku
		}), this.#_(), this.#x(), this.#D(), this.#k(), this.shadowRoot.querySelector(".page").toggleAttribute("data-ready", !0);
	}
	#a(e) {
		let t = this.shadowRoot.querySelector(".status");
		t.textContent = e, t.hidden = !e;
	}
	#o() {
		let e = this.querySelector(":scope > img[slot=\"image\"]");
		e && this.shadowRoot.querySelector(".gallery").append(e);
	}
	#s() {
		let { group: e, collection: t } = this.#e, n = this.shadowRoot, r = t ? [{
			label: "Colecciones",
			href: "/arq/productos?view=colecciones"
		}, {
			label: t.name,
			href: S(t.id)
		}] : [{
			label: "Productos",
			href: "/arq/productos"
		}];
		n.querySelector(".breadcrumb").replaceChildren(...r.map(({ label: e, href: t }) => {
			let n = document.createElement("arq-breadcrumb-item");
			return n.href = t, n.showSeparator = !0, n.textContent = e, n;
		}), Object.assign(document.createElement("arq-breadcrumb-item"), {
			current: !0,
			textContent: e.name
		}));
		for (let e of n.querySelectorAll(".collection-link")) e.hidden = !t, t && (e.href = S(t.id), e.textContent = `Ver colección ${t.name}`);
	}
	#c(e) {
		pi(), this.#l(e);
	}
	#l(e) {
		let t = this.shadowRoot.querySelector(".hero");
		for (let n of [t, ...document.querySelectorAll("arq-navbar")]) e ? n.setAttribute("data-arq-theme", "dark") : n.removeAttribute("data-arq-theme");
		ei(), ci(e, document.querySelector("arq-navbar") ?? t);
	}
	#u() {
		let { variants: e, variantAttributes: t } = this.#e, n = Pe(e, t, this.#t).map(({ attribute: e, options: t }) => {
			let n = h(e), r = document.createElement("arq-option-group");
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
	#d() {
		let { variants: e, variantAttributes: t } = this.#e, n = this.shadowRoot;
		for (let { attribute: r, options: i } of Pe(e, t, this.#t)) n.querySelectorAll(`.options [data-attribute="${CSS.escape(r)}"] :is(arq-swatch, arq-option-tile)`).forEach((e, t) => {
			e.selected = i[t].selected, e.disabled = i[t].disabled;
		});
	}
	#f({ updateUrl: e = !1, sku: t = null } = {}) {
		let { group: n, variants: r } = this.#e, i = Object.keys(this.#t).length ? Me(r, this.#t) : null, a = r.find((e) => e.sku === t) ?? i ?? r.find((e) => e.isDefault) ?? r[0];
		if (!a || a.sku === this.#r) return;
		this.#r = a.sku;
		let o = Pt(n, a.sku), s = this.shadowRoot;
		s.querySelector(".sku").textContent = o.sku;
		let c = s.querySelector(".variant-description");
		c.textContent = o.description ?? "", c.hidden = !o.description, s.querySelector(".gallery").images = o.images, this.#p(o.sections);
		let l = s.querySelector(".compare");
		if (l.checked = s.querySelector(".compare-bar").has(o.sku), e) {
			let e = new URL(location.href);
			e.searchParams.set("sku", a.sku), history.replaceState(history.state, "", e);
		}
		this.emit("variant", { sku: a.sku });
	}
	#p(e) {
		let t = this.shadowRoot.querySelector(".accordion"), n = [...t.children], r = n.length ? new Set(n.filter((e) => e.open).map((e) => e.dataset.section)) : /* @__PURE__ */ new Set([e[0]?.id]);
		t.replaceChildren(...e.map((e) => {
			let t = document.createElement("arq-accordion-item");
			t.dataset.section = e.id, t.open = r.has(e.id);
			let n = document.createElement("span");
			n.slot = "title", n.textContent = e.label;
			let i = document.createElement("arq-spec-list");
			i.columns = !0;
			for (let t of e.rows) {
				let e = document.createElement("arq-spec-row"), n = document.createElement("span");
				n.slot = "label", n.textContent = t.label, e.append(n, String(t.value)), i.append(e);
			}
			return t.append(n, i), t;
		}));
	}
	#m() {
		let { group: e } = this.#e, t = Pt(e, this.#r);
		return {
			sku: this.#r,
			name: e.name,
			meta: this.#r,
			image: t.images?.[0]?.src ?? null
		};
	}
	#h(e, t = null) {
		if (!e) return;
		let n = { sku: e };
		if (this.emit("datasheet", n), !t || !n.pending) return;
		t.loadingLabel = $.generating, t.loading = !0;
		let r = () => t.loading = !1;
		n.pending.then(r, r);
	}
	#g() {
		this.shadowRoot.querySelector(".glossary").scrollIntoView({
			behavior: Zo() ? "auto" : "smooth",
			block: "start"
		});
		let e = this.querySelector(":scope > [slot=\"glossary-title\"]");
		e && (e.tabIndex = -1, e.focus({ preventScroll: !0 }));
	}
	#_() {
		let { group: e, images: t } = this.#e, n = this.shadowRoot, r = n.querySelector(".ambient");
		n.querySelector(".ambient-block").hidden = !t.ambient.length, r.replaceChildren(...t.ambient.map((t, n) => $o(t, `${e.name}, ambiente ${n + 1}`))), r.dispatchEvent(new Event("scroll"));
	}
	#v() {
		let e = this.shadowRoot, t = e.querySelector(".ambient"), n = e.querySelector(".ambient-cursor"), r = e.querySelector(".ambient-prev"), i = e.querySelector(".ambient-next"), a = () => t.scrollLeft > 1, o = () => t.scrollLeft + t.clientWidth < t.scrollWidth - 1, s = null, c = (e) => {
			let n = t.getBoundingClientRect(), r = e < n.left + n.width / 2 ? -1 : 1;
			return r === -1 && !a() && (r = 1), r === 1 && !o() && (r = -1), r;
		}, l = () => {
			let e = a() || o();
			t.classList.toggle("is-scrollable", e), n.hidden = !s || !e, !n.hidden && (n.dataset.direction = c(s.x) === 1 ? "next" : "prev", n.style.transform = `translate(${s.x}px, ${s.y}px)`);
		}, u = (e) => {
			let n = t.getBoundingClientRect(), r = parseFloat(getComputedStyle(t).paddingLeft) || 0, i = t.scrollLeft, a = [...t.children].map((e) => {
				let t = e.getBoundingClientRect();
				return {
					left: t.left - n.left + i,
					right: t.right - n.left + i
				};
			}), o = t.scrollWidth - t.clientWidth, s;
			if (e === 1) {
				let e = a.find((e) => e.right > i + t.clientWidth - r + 2 && e.left > i + r + 2);
				s = e ? Math.min(e.right + r - t.clientWidth, e.left - r) : o;
			} else {
				let e = [...a].reverse().find((e) => e.left < i + r - 2);
				s = e ? e.left - r : 0;
			}
			t.scrollTo({
				left: Math.min(Math.max(s, 0), o),
				behavior: Zo() ? "auto" : "smooth"
			});
		}, d = () => {
			r.disabled = !a(), i.disabled = !o(), l();
		};
		t.addEventListener("scroll", d, { passive: !0 }), t.addEventListener("load", d, !0), new ResizeObserver(d).observe(t), t.addEventListener("pointermove", (e) => {
			e.pointerType === "mouse" && (s = {
				x: e.clientX,
				y: e.clientY
			}, l());
		}), t.addEventListener("pointerleave", () => {
			s = null, l();
		}), t.addEventListener("click", (e) => {
			if (e.pointerType === "mouse" || e.detail > 0) {
				if (!(a() || o())) return;
				u(c(e.clientX));
			}
		}), r.addEventListener("click", () => u(-1)), i.addEventListener("click", () => u(1));
	}
	#y(e) {
		for (let e of this.querySelectorAll(":scope > [slot=\"story-title\"], :scope > [slot=\"story-text\"], :scope > [slot=\"story-list\"]")) e.remove();
		let t = String(e ?? "").split("\n").map((e) => e.trim()).filter(Boolean), n = [], r = null;
		for (let e of t) {
			let t = e.match(/^[-–•]\s+(.*)$/);
			if (t) {
				r ??= Object.assign(document.createElement("ul"), { slot: "story-list" }), r.append(Object.assign(document.createElement("li"), { textContent: t[1] }));
				continue;
			}
			let i = e.startsWith("## "), a = !n.length, o = document.createElement(a ? "h2" : i ? "h3" : "p");
			o.slot = a ? "story-title" : "story-text", o.textContent = i ? e.slice(3).trim() : e, n.push(o);
		}
		this.append(...n, ...r ? [r] : []), this.#n = n.length > 0 || !!r, this.#b();
	}
	#b() {
		let e = this.shadowRoot, { images: t, collection: n } = this.#e ?? {}, r = e.querySelector(".story");
		r.hidden = !this.#n;
		let i = e.querySelector(".story-bg");
		i.hidden = !t?.description, t?.description && (i.querySelector("img").src = t.description);
		let a = e.querySelector(".story-link");
		a.hidden = !n, n && (a.href = S(n.id), a.textContent = `Ver colección ${n.name}`);
	}
	#x() {
		let { group: e, glossary: t, files: n } = this.#e, r = this.shadowRoot.querySelector(".table");
		r.label = `Variantes de ${e.name}`, r.data = t, r.replaceChildren(...n.map((e) => {
			let t = document.createElement("arq-button");
			return t.slot = "downloads", t.type = "outline", t.showIcon = !0, t.icon = "download", t.href = e.href, t.textContent = e.label, t;
		}));
	}
	#S(e) {
		let t = this.shadowRoot.querySelector("arq-download-modal");
		t.dataset.sku = e;
		let n = document.createElement("arq-download-item");
		n.emphasis = "featured", n.textContent = $.datasheet;
		let r = Pt(this.#e.group, e).downloads.map((e) => {
			let t = document.createElement("arq-download-item");
			return t.href = e.href, t.textContent = e.label, t;
		});
		for (let e of t.querySelectorAll(":scope > arq-download-item")) e.remove();
		t.append(n, ...r);
	}
	#C(e) {
		let t = this.querySelector(":scope > [slot=\"inspiration\"]");
		if (!e) {
			t?.remove();
			return;
		}
		t || (t = document.createElement("p"), t.slot = "inspiration", this.append(t)), t.textContent = e;
	}
	#w() {
		let e = this.shadowRoot, t = e.querySelector("slot[name=\"inspiration\"]").assignedElements().length > 0, n = e.querySelector(".inspiration-images").children.length > 0;
		e.querySelector(".inspiration").hidden = !t && !n;
	}
	#T() {
		return this.#e.images.ambient;
	}
	#E(e, t) {
		let n = this.#e.group.video;
		if (!n) return $o(e, t, "media-wide");
		let r = document.createElement("video");
		return r.src = n, r.controls = !0, r.playsInline = !0, r.preload = "metadata", r.className = "media-wide", r.setAttribute("aria-label", t), r;
	}
	#D() {
		let { group: e } = this.#e, [, , , t, n] = this.#T(), r = [t && this.#E(t, `${e.name}, video`), n && $o(n, `${e.name}, inspiración`, "media-portrait")];
		this.shadowRoot.querySelector(".inspiration-images").replaceChildren(...r.filter(Boolean)), this.#w();
	}
	#O() {
		this.shadowRoot.querySelector(".cta").hidden = !this.shadowRoot.querySelector("slot[name=\"cta-title\"]").assignedElements().length;
	}
	#k() {
		let { collection: e, family: t } = this.#e, n = this.shadowRoot.querySelector(".collection");
		n.hidden = !e || !t.length, n.querySelector(".collection-cards").replaceChildren(...t.map((e) => es(e, "large")));
	}
};
function $o(e, t, n = "") {
	let r = document.createElement("img");
	return r.src = e, n && (r.className = n), r.alt = t, r.loading = "lazy", r;
}
function es(e, t) {
	let n = document.createElement("arq-family-card");
	if (n.href = e.href, t && (n.size = t), e.image) {
		let t = $o(e.image, "");
		t.slot = "image", n.append(t);
	}
	let r = document.createElement("h3");
	return r.slot = "name", r.textContent = e.name, n.append(r), n;
}
Qo.define();
//#endregion
//#region src/components/coleccion/coleccion.css?inline
var ts = ":host{min-width:0;color:var(--arq-color-text-primary);display:block}.products{gap:var(--arq-space-gap-xl);padding:0 var(--page-gutter) var(--arq-space-section-xl);flex-direction:column;display:flex}.status{color:var(--arq-color-text-secondary);margin:0}.gallery{padding-bottom:var(--arq-space-section-xl);display:flex}.gallery img{aspect-ratio:1;object-fit:cover;background:var(--arq-color-surface-subtle);flex:1 1 0;min-width:0;display:block}.feature{padding:0 0 var(--arq-space-section-xl) var(--page-gutter);grid-template-columns:minmax(0,1fr) minmax(0,2fr);align-items:center;display:grid}.feature-text{max-width:var(--arq-layout-measure);padding-right:var(--page-gutter);color:var(--arq-color-text-primary)}::slotted([slot=description]){font:inherit!important;color:inherit!important;margin:0!important}.feature-image{aspect-ratio:5/4;background:var(--arq-color-surface-subtle);grid-column:2}.feature-image img{object-fit:cover;width:100%;height:100%;display:block}.mosaic{gap:var(--arq-space-gap-lg);padding-bottom:var(--arq-space-section-xl);flex-direction:column;display:flex}.controls{padding-right:var(--page-gutter);justify-content:flex-end;display:flex}.track{gap:var(--arq-space-gap-md);padding-left:var(--page-gutter);scroll-snap-type:x mandatory;scrollbar-width:none;scroll-padding-inline-start:var(--page-gutter);display:flex;overflow-x:auto}.track::-webkit-scrollbar{display:none}.track img{object-fit:cover;scroll-snap-align:start;background:var(--arq-color-surface-subtle);flex:none;width:auto;max-width:none;height:70svh;display:block}.track:focus-visible{outline-offset:calc(-1 * var(--arq-border-strong))}@media (width<=767px){.gallery{flex-direction:column}.gallery img{flex:none;width:100%}.feature{align-items:stretch;gap:var(--arq-space-gap-xl);flex-direction:column;padding-left:0;display:flex}.feature-text{max-width:none;padding:0 var(--page-gutter)}.controls{display:none}.track{gap:var(--arq-space-gap-sm-md)}}", ns = {
	loading: "Cargando colección…",
	notFound: "No encontramos esta colección.",
	empty: "Esta colección todavía no tiene productos.",
	error: "No se pudo cargar la colección. Probá de nuevo en unos minutos."
}, rs = class extends F {
	static tag = "arq-coleccion";
	static styles = ts;
	static properties = {};
	static template = "<div class=\"products\"><p class=\"status role-body\" role=\"status\" hidden></p><arq-grid class=\"grid\"></arq-grid></div><div class=\"gallery\" hidden></div><div class=\"feature\" hidden><div class=\"feature-text role-body-xl\"><slot name=\"description\"></slot></div><div class=\"feature-image\" hidden><img alt=\"\" loading=\"lazy\"></div></div><div class=\"mosaic\" hidden><div class=\"controls\"><arq-carousel-controls for=\"mosaic-track\" label-prev=\"Fotos anteriores\" label-next=\"Fotos siguientes\"></arq-carousel-controls></div><div class=\"track\" id=\"mosaic-track\" role=\"region\" aria-label=\"Fotos de la colección\" tabindex=\"0\"></div></div>";
	setup() {
		this.shadowRoot.querySelector("slot[name=\"description\"]").addEventListener("slotchange", () => this.#a()), this.#a(), this.#e();
	}
	async #e() {
		let e = this.getAttribute("data-collection");
		this.setAttribute("aria-busy", "true"), this.#t(ns.loading);
		let t = null, n = !1;
		try {
			t = e ? await Ft(e) : null;
		} catch (e) {
			n = !0, console.error("[arq] coleccion: no se pudo cargar el catálogo", e);
		}
		if (this.removeAttribute("aria-busy"), !t) {
			this.#t(n ? ns.error : ns.notFound);
			return;
		}
		this.#t(t.cards.length ? "" : ns.empty), this.#n(t.collection), this.#r(t.cards), this.#i(t);
	}
	#t(e) {
		let t = this.shadowRoot.querySelector(".status");
		t.textContent = e, t.hidden = !e;
	}
	#n({ intro: e, description: t }) {
		let n = document.querySelector("arq-page-header");
		n && is(n, "span", e), is(this, "p", t);
	}
	#r(e) {
		this.shadowRoot.querySelector(".grid").replaceChildren(...e.map((e) => {
			let t = document.createElement("arq-product-card");
			t.href = e.href, t.image = e.image, t.imageHover = e.imageHover, t.imageLit = e.imageLit, t.imageHoverLit = e.imageHoverLit;
			let n = document.createElement("h2");
			if (n.slot = "name", n.textContent = e.name, t.append(n), Ri(t, e.finishes), e.meta) {
				let n = document.createElement("span");
				n.slot = "meta", n.textContent = e.meta, t.append(n);
			}
			return t;
		}));
	}
	#i({ collection: e, images: t }) {
		let n = this.shadowRoot, r = n.querySelector(".gallery");
		r.hidden = !t.gallery.length, r.replaceChildren(...t.gallery.map((t, n) => as(t, `${e.name}, imagen ${n + 1}`)));
		let i = n.querySelector(".feature-image");
		i.hidden = !t.description, t.description && (i.querySelector("img").src = t.description), this.#a();
		let a = n.querySelector(".mosaic");
		a.hidden = !t.inspiration.length, n.querySelector(".track").replaceChildren(...t.inspiration.map((t, n) => as(t, `${e.name}, proyecto ${n + 1}`)));
	}
	#a() {
		let e = this.shadowRoot, t = e.querySelector("slot[name=\"description\"]").assignedElements().length > 0;
		e.querySelector(".feature-text").hidden = !t, e.querySelector(".feature").hidden = !t && e.querySelector(".feature-image").hidden;
	}
};
function is(e, t, n) {
	let r = e.querySelector(":scope > [slot=\"description\"]");
	if (!n) {
		r?.remove();
		return;
	}
	r || (r = document.createElement(t), r.slot = "description", e.append(r)), r.textContent = n;
}
function as(e, t) {
	let n = document.createElement("img");
	return n.src = e, n.alt = t, n.loading = "lazy", n;
}
rs.define();
//#endregion
//#region src/components/descargas/descargas.css?inline
var os = ":host{min-width:0;padding-bottom:var(--arq-space-section-xl);color:var(--arq-color-text-primary);display:block}.hero{justify-content:space-between;align-items:flex-start;gap:var(--arq-space-gap-lg);padding:var(--arq-space-section-sm) var(--page-gutter) 0;display:flex}.heading{gap:var(--arq-space-gap-lg);flex-direction:column;min-width:0;display:flex}.title{color:var(--arq-color-text-primary);overflow-wrap:break-word}.description{max-width:var(--arq-layout-measure);color:var(--arq-color-text-secondary)}.catalog{align-items:flex-start;gap:var(--arq-space-gap-lg);flex:none;min-width:0;display:flex}.cover{width:var(--arq-layout-catalog-cover);aspect-ratio:4/5;flex:none;overflow:hidden}.cover ::slotted(img){object-fit:cover;width:100%;height:100%;display:block}.catalog-info{gap:var(--arq-space-gap-sm);flex-direction:column;min-width:0;display:flex}.catalog-title{color:var(--arq-color-text-primary)}.catalog-description{max-width:var(--arq-layout-measure);color:var(--arq-color-text-secondary)}.catalog-actions{padding-top:var(--arq-space-padding-md);display:flex}.search-section{gap:var(--arq-space-gap-md);padding-top:var(--arq-space-section-sm);flex-direction:column;display:flex}.search-title{padding-inline:var(--page-gutter);color:var(--arq-color-text-primary)}.status{padding:0 var(--page-gutter);color:var(--arq-color-text-secondary);margin:0}.retry{align-self:flex-start;margin-inline-start:var(--page-gutter)}@media (width<=767px){.hero{align-items:stretch;gap:var(--arq-space-gap-xl);padding-bottom:var(--arq-space-section-sm);flex-direction:column}.description{max-width:none}.catalog{gap:var(--arq-space-gap-md)}.catalog-info{gap:var(--arq-space-gap-xs);flex:auto}.catalog-description{max-width:none;color:var(--arq-color-text-tertiary)}.catalog-actions{padding-top:var(--arq-space-padding-sm-md)}.search-section{padding-top:var(--arq-space-section-sm)}}", ss = {
	empty: "Todavía no hay productos para descargar.",
	error: "No se pudieron cargar las descargas. Probá de nuevo en unos minutos.",
	retry: "Reintentar",
	label: "Descargas por SKU",
	datasheet: "Ficha técnica"
}, cs = "(max-width: 767px)";
(class extends F {
	static tag = "arq-descargas";
	static styles = os;
	static properties = { catalogHref: { type: String } };
	static template = `<div class="hero"><div class="heading"><div class="title role-display"><slot name="title"></slot></div><div class="description role-body-regular"><slot name="description"></slot></div></div><div class="catalog"><div class="cover"><slot name="catalog-cover"></slot></div><div class="catalog-info"><div class="catalog-title"><slot name="catalog-title"></slot></div><div class="catalog-description"><slot name="catalog-description"></slot></div><div class="catalog-actions"><arq-button class="catalog-action" show-icon icon="download"><slot name="catalog-action"></slot></arq-button></div></div></div></div><div class="search-section"><div class="search-title role-heading-1"><slot name="search-title"></slot></div><p class="status role-body" role="status" hidden></p><arq-button class="retry" type="underline" show-underline hidden>${ss.retry}</arq-button><arq-downloads-table class="table" downloads="downloads-modal"></arq-downloads-table></div><arq-download-modal id="downloads-modal" show-product><slot name="modal-title" slot="title"></slot></arq-download-modal>`;
	#e = null;
	#t = /* @__PURE__ */ new Map();
	setup() {
		let e = this.shadowRoot, t = e.querySelector(".table");
		t.label = ss.label, t.addEventListener("arq:downloads", (e) => this.#a(e.detail.sku)), e.querySelector("arq-download-modal").addEventListener("arq:download", (e) => {
			e.stopPropagation();
			let { sku: t } = e.currentTarget;
			if (!t) return;
			let n = { sku: t };
			this.emit("datasheet", n);
			let r = e.target.closest?.("arq-download-file-row");
			if (!r || !n.pending) return;
			r.loading = !0;
			let i = () => r.loading = !1;
			n.pending.then(i, i);
		}), e.querySelector(".retry").addEventListener("click", () => this.#r()), this.#e = matchMedia(cs), this.#e.addEventListener("change", () => this.#n()), this.#n(), this.#r();
	}
	update(e) {
		let t = this.shadowRoot;
		if (e.has("catalogHref")) {
			let e = t.querySelector(".catalog-action");
			e.href = this.catalogHref || null, e.target = this.catalogHref ? "_blank" : null, e.hidden = !this.catalogHref;
		}
	}
	#n() {
		let e = this.#e.matches, t = this.shadowRoot, n = t.querySelector(".catalog-action");
		n.type = e ? "underline" : "outline", n.showUnderline = e, t.querySelector(".catalog-title").className = `catalog-title ${e ? "role-body-xl" : "role-heading-3"}`, t.querySelector(".catalog-description").className = `catalog-description ${e ? "role-body-compact-regular" : "role-body"}`;
	}
	async #r() {
		let e = this.shadowRoot.querySelector(".table"), t = this.shadowRoot.querySelector(".retry"), n = !t.hidden;
		t.hidden = !0, e.hidden = !1, this.setAttribute("aria-busy", "true"), e.loading = !0, this.#i("");
		let r = null;
		try {
			r = await Tt();
		} catch (e) {
			console.error("[arq] descargas: no se pudo cargar el catálogo", e);
		}
		if (this.removeAttribute("aria-busy"), e.loading = !1, !r) {
			e.hidden = !0, this.#i(ss.error), t.hidden = !1;
			return;
		}
		n && requestAnimationFrame(() => e.shadowRoot?.querySelector(".search")?.focus()), this.#t = new Map(r.rows.map((e) => [e.sku, e])), this.#i(r.rows.length ? "" : ss.empty), e.data = r, e.hidden = !r.rows.length;
	}
	#i(e) {
		let t = this.shadowRoot.querySelector(".status");
		t.textContent = e, t.hidden = !e;
	}
	async #a(e) {
		let t = this.shadowRoot.querySelector("arq-download-modal"), n = this.#t.get(e);
		t.sku = e, t.meta = n?.meta ?? "", t.thumb = n?.thumb ?? null;
		for (let e of t.querySelectorAll(":scope > arq-download-file-row")) e.remove();
		t.append(this.#o(ss.datasheet));
		let r = await Dt(e);
		t.sku === e && t.append(...r.map((e) => this.#o(e.label, e.href)));
	}
	#o(e, t) {
		let n = document.createElement("arq-download-file-row");
		return t && (n.href = t), n.append(e), n;
	}
}).define();
//#endregion
//#region src/components/form-contacto/form-contacto.css?inline
var ls = ":host{min-width:0;color:var(--arq-color-text-primary);display:block}.layout,.faq{column-gap:var(--arq-space-gap-6xl);grid-template-columns:minmax(0,2fr) minmax(0,3fr);align-items:start;display:grid}.layout{padding:var(--arq-space-section-md) var(--page-gutter) var(--arq-space-section-xl)}.faq[hidden]{display:none}.info{gap:var(--arq-space-gap-2xl);flex-direction:column;min-width:0;display:flex}.intro{gap:var(--arq-space-gap-lg);padding-bottom:var(--arq-space-padding-lg);border-bottom:var(--arq-border-default) solid var(--arq-color-border-default);flex-direction:column;display:flex}.title{color:var(--arq-color-text-primary)}.description,.faq-description{color:var(--arq-color-text-secondary)}::slotted([slot=description]),::slotted([slot=faq-description]){font:inherit!important;color:inherit!important;margin:0!important}.channels{gap:var(--arq-space-gap-sm);flex-direction:column;display:flex}.channels-title{color:var(--arq-color-text-secondary)}.channels-title[hidden]{display:none}.form{gap:var(--arq-space-gap-3xl);flex-direction:column;min-width:0;display:flex}.section{gap:var(--arq-space-gap-lg);border:0;flex-direction:column;min-inline-size:0;margin:0;padding:0;display:flex}.section>legend{float:left;box-sizing:border-box;width:100%;padding:0 0 var(--arq-space-padding-sm);border-bottom:var(--arq-border-default) solid var(--arq-color-border-default);color:var(--arq-color-text-primary);margin:0}.choices{gap:var(--arq-space-gap-sm-md);flex-wrap:wrap;display:flex}.fields{gap:var(--arq-space-gap-lg);grid-template-columns:minmax(0,1fr) minmax(0,1fr);display:grid}.honeypot{width:var(--arq-border-default);height:var(--arq-border-default);clip-path:inset(50%);white-space:nowrap;position:absolute;overflow:hidden}.submit{align-items:flex-start;gap:var(--arq-space-gap-xl);flex-direction:column;display:flex}.send{align-items:flex-start;gap:var(--arq-space-gap-sm);flex-direction:column;min-width:0;display:flex}.faq{padding:var(--arq-space-section-lg) var(--page-gutter);background:var(--arq-color-surface-faint)}.faq-text{align-items:flex-start;gap:var(--arq-space-gap-lg);flex-direction:column;min-width:0;display:flex}.faq-title{color:var(--arq-color-text-primary)}.faq-description{max-width:var(--arq-layout-measure)}.faq-items{min-width:0}@media (width>=768px){.info{top:var(--arq-space-section-md);position:sticky}}@media (width<=767px){.layout,.faq{grid-template-columns:minmax(0,1fr)}.layout{row-gap:var(--arq-space-gap-6xl)}.faq{row-gap:var(--arq-space-gap-2xl)}.fields{grid-template-columns:minmax(0,1fr)}.submit,.send{align-items:stretch}.send-button{width:100%}}", us = [
	"Asesoramiento lumínico",
	"Cotización de proyecto",
	"Consulta técnica",
	"Garantía"
], ds = [
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
], fs = {
	nombre: "Completá tu nombre.",
	email: {
		valueMissing: "Completá tu email.",
		typeMismatch: "Revisá el formato del email."
	},
	detalles: "Contanos un poco sobre tu proyecto."
}, ps = 25, ms = {
	"channels-title": ".channels-title",
	faq: ".faq"
}, hs = {
	sent: "Recibimos tu consulta. Te respondemos a la brevedad.",
	error: "No pudimos enviar tu consulta. Probá de nuevo en unos minutos."
}, gs = (e) => e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;"), _s = class extends F {
	static tag = "arq-form-contacto";
	static styles = ls;
	static properties = {};
	static template = "<div class=\"layout\"><div class=\"info\"><div class=\"intro\"><div class=\"title role-display-sm\"><slot name=\"title\"></slot></div><div class=\"description role-body\"><slot name=\"description\"></slot></div></div><div class=\"channels\"><span class=\"channels-title role-body-lg-regular\" hidden><slot name=\"channels-title\"></slot></span><slot name=\"channels\"></slot></div><slot name=\"links\"></slot></div><form class=\"form\" novalidate><fieldset class=\"section topics\"><legend class=\"role-heading-3\">Tipo de consulta</legend><div class=\"choices\" role=\"radiogroup\" aria-label=\"Tipo de consulta\">" + us.map((e, t) => `<arq-choice-chip name="tipo" value="${gs(e)}"${t ? "" : " selected"}>${gs(e)}</arq-choice-chip>`).join("") + `</div></fieldset><fieldset class="section"><legend class="role-heading-3">Tus datos</legend><div class="fields"><arq-input name="nombre" placeholder="Tu nombre y apellido" autocomplete="name" autocapitalize="words" enterkeyhint="next" required show-label>Nombre completo</arq-input><arq-input name="empresa" placeholder="Nombre del estudio" autocomplete="organization" autocapitalize="words" enterkeyhint="next" show-label>Estudio o empresa (opcional)</arq-input><arq-input name="email" input-type="email" placeholder="nombre@estudio.com" autocomplete="email" enterkeyhint="next" required show-label>Email</arq-input><arq-input name="telefono" input-type="tel" placeholder="+54 11 0000-0000" autocomplete="tel" enterkeyhint="next" show-label>Teléfono (opcional)</arq-input><arq-input name="provincia" type="select" placeholder="Seleccioná una provincia" show-label>Provincia (opcional)</arq-input><arq-input name="ciudad" placeholder="Tu ciudad" autocomplete="address-level2" autocapitalize="words" enterkeyhint="next" show-label>Ciudad (opcional)</arq-input></div></fieldset><fieldset class="section"><legend class="role-heading-3">Tu proyecto</legend><arq-input name="detalles" type="textarea" rows="6" placeholder="Contanos el tipo de espacio, etapa del proyecto y qué necesitás…" required show-label>Detalles del proyecto</arq-input><arq-file-upload name="adjunto" max-size="${ps}">Planos o imágenes (opcional)<span slot="helper">PDF, DWG, JPG o PNG · hasta ${ps} MB. ¿Pesa más? Pegá un link de Drive o WeTransfer en el detalle.</span></arq-file-upload></fieldset><div class="honeypot" aria-hidden="true"><label>No completar este campo <input type="text" name="website" tabindex="-1" autocomplete="off"></label></div><div class="submit"><arq-checkbox name="novedades" value="si" show-label>Quiero recibir novedades y lanzamientos</arq-checkbox><div class="send"><arq-button class="send-button" submit show-icon icon="arrow-right">Enviar consulta</arq-button><arq-form-message class="message" hidden></arq-form-message></div></div></form></div><div class="faq" hidden><div class="faq-text"><div class="faq-title role-display-sm"><slot name="faq-title"></slot></div><div class="faq-description role-body"><slot name="faq-description"></slot></div><slot name="faq-action"></slot></div><div class="faq-items"><slot name="faq"></slot></div></div>`;
	#e = !1;
	setup() {
		let e = this.shadowRoot;
		new jr(e.querySelector(".choices"), { items: "arq-choice-chip" });
		for (let [t, n] of Object.entries(ms)) {
			let r = e.querySelector(`slot[name="${t}"]`), i = () => {
				e.querySelector(n).hidden = !r.assignedNodes().length;
			};
			r.addEventListener("slotchange", i), i();
		}
		e.querySelector("[name=\"provincia\"]").options = ds.map((e) => ({ value: e }));
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
		let t = fs[e.name];
		return typeof t == "string" ? t : e.validity.typeMismatch && t?.typeMismatch || t?.valueMissing || "Revisá este campo.";
	}
	#n(e) {
		let t = this.#t(e);
		return t ? e.error = t : e.removeAttribute("error"), !t;
	}
	async #r(e) {
		let t = this.shadowRoot;
		this.#e = !0;
		let n = [...t.querySelectorAll("arq-input")], r = n.filter((e) => !this.#n(e));
		if (r.length) {
			r[0].focus();
			return;
		}
		let i = t.querySelector(".send-button"), a = t.querySelector(".message");
		a.hidden = !0;
		let o = new FormData(e), s = String(o.get("website") ?? "").trim() !== "";
		o.delete("website"), this.emit("submit", { data: o }), i.loading = !0;
		let c = !1;
		try {
			c = s || await vs(o);
		} catch (e) {
			console.error("[arq] form-contacto: no se pudo enviar", e);
		}
		if (i.loading = !1, a.tone = c ? "success" : "error", a.textContent = c ? hs.sent : hs.error, a.hidden = !1, c) {
			e.reset(), this.#e = !1;
			for (let e of n) e.removeAttribute("error");
			this.emit("sent", {});
		} else this.emit("error", {});
	}
};
async function vs(e) {
	let t = n.n8n.webhookUrl;
	return t ? (await fetch(t, {
		method: "POST",
		body: e
	})).ok : (console.error("[arq] form-contacto: falta VITE_N8N_WEBHOOK_URL"), !1);
}
_s.define(), document.addEventListener("arq:datasheet", (e) => {
	let t = e.detail?.sku;
	if (!t) return;
	let n = Dn(t);
	e.detail.pending = n, n.catch((e) => console.error("[arq] ficha técnica:", e));
}), document.addEventListener("click", (e) => {
	e.target.closest?.("[data-arq-print]") && window.print();
}), window.Arq || (window.Arq = Object.freeze({ version: e }));
//#endregion
