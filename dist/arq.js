//#region package.json
var e = "0.1.0", t, n, r = /* @__PURE__ */ new Map();
function i(e) {
	let t = new CSSStyleSheet();
	return t.replaceSync(e), t;
}
function a() {
	return t ??= i(".role-display{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-light);font-size:var(--arq-type-display-size);line-height:var(--arq-type-display-leading);letter-spacing:var(--arq-font-tracking-tighter)}.role-display-sm{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-light);font-size:var(--arq-type-display-sm-size);line-height:var(--arq-type-display-sm-leading);letter-spacing:var(--arq-font-tracking-tight)}.role-heading-1{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-light);font-size:var(--arq-type-heading-1-size);line-height:var(--arq-type-heading-1-leading);letter-spacing:var(--arq-font-tracking-tight)}.role-heading-2{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-light);font-size:var(--arq-type-heading-2-size);line-height:var(--arq-type-heading-2-leading);letter-spacing:var(--arq-font-tracking-normal)}.role-heading-3{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-regular);font-size:var(--arq-type-heading-3-size);line-height:var(--arq-type-heading-3-leading);letter-spacing:var(--arq-font-tracking-normal)}.role-body-xl{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-regular);font-size:var(--arq-type-body-xl-size);line-height:var(--arq-type-body-xl-leading);letter-spacing:var(--arq-font-tracking-normal)}.role-body-lg{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-light);font-size:var(--arq-type-body-lg-size);line-height:var(--arq-type-body-lg-leading);letter-spacing:var(--arq-font-tracking-normal)}.role-body-lg-regular{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-regular);font-size:var(--arq-type-body-lg-size);line-height:var(--arq-type-body-lg-leading);letter-spacing:var(--arq-font-tracking-normal)}.role-body-lg-medium{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-medium);font-size:var(--arq-type-body-lg-size);line-height:var(--arq-type-body-lg-leading);letter-spacing:var(--arq-font-tracking-normal)}.role-body{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-light);font-size:var(--arq-type-body-size);line-height:var(--arq-type-body-leading);letter-spacing:var(--arq-font-tracking-normal)}.role-body-regular{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-regular);font-size:var(--arq-type-body-size);line-height:var(--arq-type-body-leading);letter-spacing:var(--arq-font-tracking-normal)}.role-body-medium{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-medium);font-size:var(--arq-type-body-size);line-height:var(--arq-type-body-leading);letter-spacing:var(--arq-font-tracking-normal)}.role-body-strong{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-semibold);font-size:var(--arq-type-body-size);line-height:var(--arq-type-body-leading);letter-spacing:var(--arq-font-tracking-normal)}.role-body-sm{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-regular);font-size:var(--arq-type-body-sm-size);line-height:var(--arq-type-body-sm-leading);letter-spacing:var(--arq-font-tracking-normal)}.role-body-sm-medium{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-medium);font-size:var(--arq-type-body-sm-size);line-height:var(--arq-type-body-sm-leading);letter-spacing:var(--arq-font-tracking-normal)}.role-label{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-regular);font-size:var(--arq-type-label-size);line-height:var(--arq-type-label-leading);letter-spacing:var(--arq-font-tracking-widest);text-transform:uppercase}.role-label-sm{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-medium);font-size:var(--arq-type-label-sm-size);line-height:var(--arq-type-label-sm-leading);letter-spacing:var(--arq-font-tracking-widest);text-transform:uppercase}.role-caption{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-regular);font-size:var(--arq-type-caption-size);line-height:var(--arq-type-caption-leading);letter-spacing:var(--arq-font-tracking-wide)}.role-caption-medium{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-medium);font-size:var(--arq-type-caption-size);line-height:var(--arq-type-caption-leading);letter-spacing:var(--arq-font-tracking-wide)}"), t;
}
function o() {
	return n ??= i("[data-arq-theme=dark]{--arq-color-bg-default:var(--arq-neutral-800);--arq-color-bg-subtle:var(--arq-neutral-750);--arq-color-bg-inverse:var(--arq-neutral-0);--arq-color-surface-default:var(--arq-neutral-800);--arq-color-surface-faint:var(--arq-neutral-775);--arq-color-surface-hover:var(--arq-neutral-775);--arq-color-surface-soft:var(--arq-neutral-725);--arq-color-surface-subtle:var(--arq-neutral-750);--arq-color-surface-selected:var(--arq-neutral-725);--arq-color-surface-strong:var(--arq-neutral-700);--arq-color-surface-inverse:var(--arq-neutral-0);--arq-color-surface-inverse-hover:var(--arq-neutral-150);--arq-color-surface-inverse-pressed:var(--arq-neutral-200);--arq-color-text-primary:var(--arq-neutral-100);--arq-color-text-secondary:var(--arq-neutral-200);--arq-color-text-tertiary:var(--arq-neutral-500);--arq-color-text-inverse:var(--arq-neutral-800);--arq-color-text-accent:var(--arq-neutral-150);--arq-color-text-disabled:var(--arq-neutral-600);--arq-color-text-error:var(--arq-red-300);--arq-color-text-success:var(--arq-green-300);--arq-color-text-warning:var(--arq-amber-300);--arq-color-icon-primary:var(--arq-neutral-100);--arq-color-icon-secondary:var(--arq-neutral-200);--arq-color-icon-tertiary:var(--arq-neutral-500);--arq-color-icon-accent:var(--arq-neutral-150);--arq-color-icon-inverse:var(--arq-neutral-800);--arq-color-icon-disabled:var(--arq-neutral-600);--arq-color-border-subtle:var(--arq-alpha-white-10);--arq-color-border-default:var(--arq-alpha-white-22);--arq-color-border-strong:var(--arq-neutral-0);--arq-color-border-disabled:var(--arq-alpha-white-10);--arq-color-border-focus:var(--arq-neutral-150);--arq-color-border-error:var(--arq-red-300);--arq-color-action-primary:var(--arq-neutral-100);--arq-color-action-primary-hover:var(--arq-neutral-200);--arq-color-action-on-primary:var(--arq-neutral-900);--arq-color-accent-default:var(--arq-neutral-150)}"), n;
}
function s(e, ...t) {
	let n = [a(), o()];
	for (let e of t) e && (r.has(e) || r.set(e, i(e)), n.push(r.get(e)));
	e.adoptedStyleSheets = [...n, ...e.adoptedStyleSheets.filter((e) => !n.includes(e))];
}
//#endregion
//#region src/base/arq-element.js
var c = (e) => e.replace(/[A-Z]/g, (e) => `-${e.toLowerCase()}`), l = /* @__PURE__ */ new WeakMap(), u = "\n:host([hidden]),\n[hidden] {\n  display: none !important;\n}\n\n*,\n*::before,\n*::after {\n  transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke;\n  transition-duration: var(--arq-motion-duration-fast);\n  transition-timing-function: var(--arq-motion-easing-standard);\n}\n\n.visually-hidden {\n  position: absolute;\n  width: var(--arq-border-default);\n  height: var(--arq-border-default);\n  overflow: hidden;\n  clip-path: inset(50%);\n  white-space: nowrap;\n}\n\n::slotted(h1),\n::slotted(h2),\n::slotted(h3),\n::slotted(h4),\n::slotted(h5),\n::slotted(h6) {\n  margin: 0 !important;\n  font: inherit !important;\n  letter-spacing: inherit !important;\n  text-transform: inherit !important;\n  color: inherit !important;\n}\n", d = class e extends HTMLElement {
	static tag = "";
	static styles = "";
	static template = "";
	static properties = {};
	static get observedAttributes() {
		return Object.entries(this.properties).map(([e, t]) => t.attribute ?? c(e));
	}
	static define() {
		if (!this.tag) throw Error(`${this.name}: falta static tag`);
		return customElements.get(this.tag) ? this : (e.#e.call(this), customElements.define(this.tag, this), this);
	}
	static #e() {
		this.attributeToProp = /* @__PURE__ */ new Map();
		for (let [e, t] of Object.entries(this.properties)) {
			let n = t.attribute ?? c(e);
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
		s(e, u, this.constructor.styles);
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
		if (!l.has(e)) {
			let t = document.createElement("template");
			t.innerHTML = e.template, l.set(e, t);
		}
		return l.get(e);
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
}, f = {
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
	copy: "<path vector-effect=\"non-scaling-stroke\" d=\"M11 5V2H2V11H5M5 5H14V14H5V5Z\"/>",
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
Object.freeze(Object.keys(f));
function p(e) {
	let t = f[e];
	return t ? `<svg class="icon" data-icon="${e}" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1" aria-hidden="true" focusable="false">${t}</svg>` : "";
}
//#endregion
//#region src/components/count-badge/count-badge.css?inline
var ee = ":host{vertical-align:middle;flex:none;display:inline-flex;position:relative}:host(:state(empty)){display:none}.badge{box-sizing:border-box;min-width:calc(var(--arq-type-caption-leading) + var(--arq-space-padding-2xs) * 2);padding:var(--arq-space-padding-2xs) var(--arq-space-padding-xs);border-radius:var(--arq-radius-control);background:var(--arq-color-action-primary);color:var(--arq-color-action-on-primary);text-align:center;white-space:nowrap;font-variant-numeric:tabular-nums;justify-content:center;align-items:center;display:inline-flex}.visually-hidden{width:var(--arq-border-default);height:var(--arq-border-default);clip-path:inset(50%);white-space:nowrap;position:absolute;overflow:hidden}:host([tone=inverse]) .badge{background:var(--arq-color-action-on-primary);color:var(--arq-color-action-primary)}", te = 99;
(class extends d {
	static tag = "arq-count-badge";
	static styles = ee;
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
		this.shadowRoot.querySelector(".badge").textContent = this.count > te ? `${te}+` : t, this.shadowRoot.querySelector(".visually-hidden").textContent = t, e ? this.#e.states.add("empty") : this.#e.states.delete("empty");
	}
}).define();
//#endregion
//#region src/components/button/button.css?inline
var ne = ":host{vertical-align:middle;min-width:0;max-width:100%;display:inline-flex}.control{box-sizing:border-box;justify-content:center;align-items:center;gap:var(--arq-space-gap-sm);max-width:100%;padding:var(--arq-space-gap-sm) var(--arq-space-padding-md);border-radius:var(--arq-radius-control);background:var(--arq-color-action-primary);color:var(--arq-color-action-on-primary);cursor:pointer;-webkit-tap-highlight-color:var(--arq-color-surface-transparent);border:0;flex:auto;margin:0;text-decoration:none;display:inline-flex;position:relative}.text{min-width:0;display:flex;position:relative}.label{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.leading,.trailing{flex:none;display:inline-flex}.icon{width:var(--arq-icon-md);height:var(--arq-icon-md)}.control:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.control:focus:not(:focus-visible){outline:none}.control.inactive{cursor:default}.control:not(.inactive):hover{background:var(--arq-color-action-primary-hover)}.control:not(.inactive):active{background:var(--arq-color-surface-inverse-pressed)}.control.inactive{background:var(--arq-color-surface-subtle);color:var(--arq-color-text-disabled)}.control[aria-busy=true]{background:var(--arq-color-action-primary-hover);color:var(--arq-color-action-on-primary)}.visually-hidden{width:var(--arq-border-default);height:var(--arq-border-default);clip-path:inset(50%);white-space:nowrap;position:absolute;overflow:hidden}:host([type=outline]) .control{padding:calc(var(--arq-space-gap-sm) - var(--arq-border-default)) calc(var(--arq-space-padding-md) - var(--arq-border-default));border:var(--arq-border-default) solid var(--arq-color-border-strong);background:var(--arq-color-surface-transparent);color:var(--arq-color-action-primary)}:host([type=outline]) .control:not(.inactive):hover{background:var(--arq-color-surface-hover)}:host([type=outline]) .control:not(.inactive):active{background:var(--arq-color-surface-selected)}:host([type=outline]) .control.inactive{border-color:var(--arq-color-border-disabled);background:var(--arq-color-surface-transparent);color:var(--arq-color-text-disabled)}:host([type=underline]) .control{padding:var(--arq-space-gap-xs) 0;background:var(--arq-color-surface-transparent);color:var(--arq-color-action-primary)}:host([type=underline]) .text:after{content:\"\";inset-inline:0;top:calc(100% + var(--arq-space-padding-2xs) - var(--arq-border-default));height:var(--arq-border-default);background:var(--arq-color-border-strong);visibility:hidden;position:absolute}:host([type=underline][show-underline]) .text:after,:host([type=underline]) .control:not(.inactive):hover .text:after,:host([type=underline]) .control:not(.inactive):active .text:after{visibility:visible}:host([type=underline]) .control:not(.inactive):hover .text:after,:host([type=underline]) .control:not(.inactive):active .text:after{height:var(--arq-border-strong)}:host([type=underline]) .control:not(.inactive):active{color:var(--arq-color-text-tertiary)}:host([type=underline]) .control:not(.inactive):active .text:after{background:var(--arq-color-text-tertiary)}:host([type=underline]) .control.inactive{background:var(--arq-color-surface-transparent);color:var(--arq-color-text-disabled)}:host([type=underline]) .control.inactive .text:after{background:var(--arq-color-border-disabled)}", m = "Enviando…";
(class extends d {
	static tag = "arq-button";
	static styles = ne;
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
		href: { type: String },
		target: { type: String }
	};
	static template = `
    <button type="button" class="control role-body-regular">
      <span class="leading" hidden></span>
      <span class="text">
        <span class="label"><slot></slot><span class="visually-hidden" hidden></span></span>
        <span class="label" data-loading hidden>${m}</span>
      </span>
      <arq-count-badge class="count" hidden></arq-count-badge>
      <span class="trailing" hidden></span>
    </button>
  `.replace(/>\s+</g, "><").trim();
	#e = null;
	setup() {
		this.#e = this.shadowRoot.querySelector(".control"), this.addEventListener("click", (e) => {
			(this.disabled || this.loading) && (e.preventDefault(), e.stopImmediatePropagation());
		}, { capture: !0 });
	}
	focus(e) {
		this.#e ? this.#e.focus(e) : super.focus(e);
	}
	update(e) {
		e.has("href") && this.#t(), e.has("loading") && this.loading && this.type;
		let t = this.shadowRoot, n = this.#e, r = this.loading, i = this.disabled || r;
		n.classList.toggle("inactive", i), r ? (n.setAttribute("aria-busy", "true"), n.setAttribute("aria-label", m)) : (n.removeAttribute("aria-busy"), n.removeAttribute("aria-label")), n.localName === "button" ? n.disabled = i : (i ? (n.removeAttribute("href"), n.setAttribute("aria-disabled", "true")) : (n.setAttribute("href", this.href), n.removeAttribute("aria-disabled")), this.target ? n.setAttribute("target", this.target) : n.removeAttribute("target"), this.target === "_blank" ? n.setAttribute("rel", "noopener") : n.removeAttribute("rel")), t.querySelector(".label:not([data-loading])").hidden = r, t.querySelector(".label[data-loading]").hidden = !r;
		let a = t.querySelector(".leading");
		e.has("leadingIcon") && (a.innerHTML = p(this.leadingIcon)), a.hidden = !this.showLeadingIcon || r;
		let o = t.querySelector(".trailing");
		e.has("icon") && (o.innerHTML = p(this.icon)), o.hidden = !this.showIcon || r;
		let s = t.querySelector(".count"), c = this.showCount && !!this.count && !r;
		this.count ? s.setAttribute("count", this.count) : s.removeAttribute("count"), s.setAttribute("tone", this.type === "filled" ? "inverse" : "primary"), s.hidden = !c;
		let l = t.querySelector(".visually-hidden"), u = this.countLabel?.trim();
		l.textContent = u ? `, ${this.count} ${u}` : "", l.hidden = !c || !u, c && u ? s.setAttribute("aria-hidden", "true") : s.removeAttribute("aria-hidden");
	}
	#t() {
		let e = this.href === null ? "button" : "a", t = this.#e;
		if (t.localName === e) return;
		let n = document.createElement(e);
		n.className = t.className, e === "button" && (n.type = "button"), n.append(...t.childNodes), t.replaceWith(n), this.#e = n;
	}
}).define();
//#endregion
//#region src/components/divider/divider.css?inline
var re = ":host{box-sizing:border-box;width:100%;height:var(--arq-border-default);background:var(--arq-color-border-subtle);flex:none;display:block}:host([emphasis=default]){background:var(--arq-color-border-default)}:host([orientation=vertical]){width:var(--arq-border-default);align-self:stretch;height:auto;display:inline-block}";
(class extends d {
	static tag = "arq-divider";
	static styles = re;
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
var ie = ":host{vertical-align:middle;color:var(--arq-color-text-primary);flex:none;display:inline-flex}.link{color:inherit;display:inline-flex}.link:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.link:focus:not(:focus-visible){outline:none}.mark{aspect-ratio:181/16;width:181px;height:auto;display:block}:host([size=small]) .mark{width:158px}:host([size=compact]) .mark{width:117px}", ae = "Macroled Arq, inicio", oe = "<svg class=\"mark\" viewBox=\"0 0 181 16\" fill=\"currentColor\" aria-hidden=\"true\" focusable=\"false\">" + [
	"M13.2112 1.03819C13.5552 0.538809 14.1401 0.243121 14.7662 0.243121H16.9337V15.6977H13.452V7.16879C13.452 6.99138 13.2112 6.92567 13.108 7.07023L8.62167 13.4637C8.54598 13.5688 8.38772 13.5688 8.31203 13.4637L3.80509 7.07023C3.70188 6.92567 3.46793 6.99138 3.46793 7.16879V15.6977H0V0.243121H2.16746C2.79361 0.243121 3.37848 0.538809 3.72252 1.03819L8.31203 7.76674C8.38772 7.87187 8.55286 7.87187 8.62855 7.76674L13.2112 1.03819ZM35.0922 15.6977H31.1564L30.5233 14.1799C30.5233 14.1799 30.5233 14.1667 30.5164 14.1602C30.1518 13.306 29.4362 13.1351 28.5623 13.1351H23.5943L22.5209 15.6977H18.592L24.8604 1.07105C25.0806 0.571663 25.5898 0.243121 26.1609 0.243121H28.4591L28.4797 0.295688L35.0853 15.6977H35.0922ZM29.0095 10.2571L27.021 5.46037C26.9591 5.30924 26.7389 5.30924 26.6769 5.46037L24.6677 10.2637H29.0164L29.0095 10.2571ZM47.6703 10.7828C47.6703 10.7828 46.2873 12.6949 43.5487 12.6949C42.1657 12.6949 41.0235 12.2546 40.0533 11.361C39.1175 10.4476 38.6633 9.34374 38.6633 7.98357C38.6633 6.62341 39.1175 5.51951 40.0533 4.60616C41.0166 3.71253 42.1657 3.27228 43.5487 3.27228C45.1244 3.27228 46.4455 3.85051 47.4914 4.99384L47.5534 5.05955L49.191 2.51663C49.2804 2.37207 49.2529 2.18152 49.1222 2.06324C47.574 0.742505 45.6405 0.0197125 43.5487 0.0197125C41.1542 0.0197125 39.1725 0.755647 37.4936 2.28008C36.0073 3.64682 35.0096 5.85462 35.0096 7.977C35.0096 10.2702 35.8216 12.1363 37.4936 13.6739C39.1725 15.1918 41.1542 15.9343 43.5487 15.9343C45.7024 15.9343 47.6979 15.1721 49.2598 13.7725C49.3905 13.6542 49.4181 13.4702 49.3217 13.3257L47.6703 10.7828ZM60.9985 9.66571C60.9022 9.7117 60.8677 9.82998 60.9297 9.9154L64.9068 15.6912H61.4113C60.9297 15.6912 60.4755 15.4481 60.2209 15.0604L57.331 10.6053H55.1291V15.6912H51.4617V3.48912V0.243121H58.198C59.7118 0.243121 61.0122 0.742505 62.065 1.7347C63.1522 2.72033 63.682 3.90965 63.682 5.36838C63.682 7.22793 62.5811 8.88378 60.9916 9.66571M55.1291 7.27392C55.1291 7.37248 55.2117 7.45134 55.3149 7.45134H57.8127C59.1407 7.45134 59.9939 6.64969 59.9939 5.41437C59.9939 4.31704 59.1819 3.48912 58.1085 3.48912H55.1291V7.27392ZM79.7281 2.32608C81.3795 3.86366 82.2121 5.77577 82.2121 8.00329C82.2121 10.2374 81.3864 12.1561 79.7487 13.7002C78.1042 15.2312 76.0881 16.0066 73.7349 16.0066C71.4092 16.0066 69.3862 15.2312 67.7279 13.7002C66.0903 12.1561 65.2646 10.2374 65.2646 8.00329C65.2646 5.78234 66.0903 3.87023 67.7279 2.32608C69.3862 0.78193 71.4092 0 73.7418 0C76.0881 0 78.0973 0.78193 79.735 2.32608M68.9665 8.00329C68.9665 9.34374 69.4206 10.4476 70.3495 11.3676C71.2647 12.2546 72.4069 12.708 73.7418 12.708C75.0904 12.708 76.1913 12.2612 77.1134 11.3478C78.0423 10.4411 78.5171 9.31745 78.5171 8.00329C78.5171 6.70883 78.056 5.59179 77.1409 4.67844C76.2189 3.75852 75.0766 3.29199 73.7486 3.29199C72.4206 3.29199 71.2784 3.75852 70.3564 4.67844C69.4413 5.58522 68.9734 6.70883 68.9734 8.00329M86.6433 0.243121H84.2832V3.48912V15.6977H94.164V12.3598H88.2328C88.1296 12.3598 88.047 12.2809 88.047 12.1823V1.577C88.047 0.841068 87.4208 0.243121 86.6433 0.243121ZM100.185 12.4517C100.082 12.4517 99.999 12.3729 99.999 12.2743V9.37659H105.951V6.16345H100.192C100.088 6.16345 100.006 6.0846 100.006 5.98604V3.48912H105.779C106.55 3.48912 107.183 2.89117 107.183 2.15524V0.243121H96.3177V15.6977H107.492V12.4517H100.192H100.185ZM124.364 8.00329C124.364 10.3359 123.621 12.2218 122.148 13.6148C120.71 15.0012 118.598 15.7043 115.866 15.7043H109.928V0.243121H115.846C118.557 0.243121 120.669 0.965914 122.128 2.39836C123.614 3.80452 124.364 5.69035 124.364 8.00329ZM113.623 12.2678C113.623 12.3663 113.706 12.4452 113.809 12.4452H115.639C119.052 12.4452 120.641 11.0324 120.641 7.99672C120.641 6.59055 120.256 5.47351 119.506 4.68501C118.77 3.88994 117.463 3.48912 115.612 3.48912H113.616V12.2743L113.623 12.2678Z",
	"M141.655 1.64271H140.912L135.532 15.5006H134.142L139.977 0.512526H142.578L148.385 15.5072H147.016L141.655 1.64928V1.64271ZM136.722 10.2374H145.873V11.3741H136.722V10.2374Z",
	"M156.89 0.512526C158.128 0.512526 159.133 0.70308 159.903 1.09076C160.674 1.47844 161.245 1.99754 161.617 2.65462C161.988 3.3117 162.174 4.05421 162.174 4.88214C162.174 5.49322 162.071 6.06489 161.858 6.59713C161.651 7.12279 161.328 7.58932 160.894 7.977C160.461 8.37125 159.917 8.68008 159.257 8.91006C158.596 9.14004 157.819 9.25175 156.924 9.25175H153.023V15.5072H151.653V0.512526H156.883H156.89ZM160.791 4.88214C160.791 3.89651 160.495 3.11458 159.897 2.5232C159.298 1.9384 158.293 1.64271 156.89 1.64271H153.029V8.08871H156.931C157.825 8.08871 158.562 7.95072 159.126 7.68131C159.69 7.41191 160.11 7.0308 160.385 6.54456C160.653 6.05832 160.791 5.4998 160.791 4.87557V4.88214ZM158.073 8.75893L162.449 15.5072H160.901L156.594 8.75893H158.073Z",
	"M180.415 4.91499C180.023 3.98193 179.486 3.17372 178.791 2.49692C178.096 1.82012 177.277 1.29446 176.349 0.919918C175.413 0.551951 174.401 0.361396 173.307 0.361396C172.213 0.361396 171.174 0.54538 170.232 0.919918C169.289 1.29446 168.47 1.81355 167.761 2.49692C167.059 3.17372 166.516 3.98193 166.137 4.91499C165.759 5.84805 165.566 6.87967 165.566 8.00986C165.566 9.14004 165.759 10.1717 166.137 11.1047C166.516 12.0378 167.059 12.846 167.761 13.5228C168.463 14.1996 169.289 14.7253 170.232 15.0998C171.174 15.4743 172.199 15.6583 173.307 15.6583C174.415 15.6583 175.413 15.4743 176.349 15.0998C177.284 14.7318 178.096 14.2062 178.791 13.5228C179.486 12.846 180.03 12.0378 180.415 11.1047C180.8 10.1717 181 9.14004 181 8.00986C181 6.87967 180.807 5.84805 180.415 4.91499ZM178.771 11.4793C178.206 12.4517 177.456 13.2008 176.507 13.7265C175.557 14.2522 174.491 14.5216 173.307 14.5216C172.124 14.5216 171.037 14.2587 170.08 13.7265C169.124 13.2008 168.367 12.4517 167.803 11.4793C167.238 10.5068 166.963 9.35031 166.963 8.00986C166.963 6.6694 167.245 5.50637 167.803 4.52731C168.367 3.54825 169.124 2.79918 170.08 2.28008C171.037 1.76099 172.117 1.49815 173.307 1.49815C174.498 1.49815 175.55 1.76099 176.507 2.28008C177.456 2.79918 178.213 3.54825 178.771 4.52731C179.335 5.50637 179.61 6.66283 179.61 8.00986C179.61 9.35688 179.328 10.5068 178.771 11.4793Z",
	"M176.698 10.9485L175.745 11.8591L179.598 15.539L180.552 14.6283L176.698 10.9485Z"
].map((e) => `<path d="${e}"/>`).join("") + "</svg>";
(class extends d {
	static tag = "arq-logo";
	static styles = ie;
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
	static template = `<a class="link" aria-label="${ae}">${oe}</a>`;
	update(e) {
		e.has("href") && this.shadowRoot.querySelector(".link").setAttribute("href", this.href);
	}
}).define();
//#endregion
//#region src/components/icon-button/icon-button.css?inline
var se = ":host{vertical-align:middle;color:var(--arq-color-icon-primary);flex:none;display:inline-flex}.control{box-sizing:border-box;padding:var(--arq-space-padding-xs);border-radius:var(--arq-radius-control);background:var(--arq-color-surface-transparent);color:inherit;cursor:pointer;-webkit-tap-highlight-color:var(--arq-color-surface-transparent);border:0;justify-content:center;align-items:center;margin:0;display:inline-flex;position:relative}.glyph{display:inline-flex}.icon{width:var(--arq-icon-md);height:var(--arq-icon-md)}:host([size=large]) .control{padding:var(--arq-space-padding-sm-md)}:host([size=large]) .icon{width:var(--arq-icon-xl);height:var(--arq-icon-xl)}.control:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.control:focus:not(:focus-visible){outline:none}.visually-hidden{width:var(--arq-border-default);height:var(--arq-border-default);clip-path:inset(50%);white-space:nowrap;position:absolute;overflow:hidden}.control:enabled:hover{background:var(--arq-color-surface-hover)}.control:enabled:active{background:var(--arq-color-surface-selected)}:host([background=surface]) .control{background:var(--arq-color-surface-default)}:host([background=surface]) .control:enabled:hover{background:var(--arq-color-surface-subtle)}:host([background=surface]) .control:enabled:active{background:var(--arq-color-surface-selected)}:host([background=subtle]) .control{background:var(--arq-color-surface-subtle)}:host([background=subtle]) .control:enabled:hover{background:var(--arq-color-surface-selected)}:host([background=subtle]) .control:enabled:active{background:var(--arq-color-surface-strong)}.control:disabled{color:var(--arq-color-icon-disabled);cursor:default}";
(class extends d {
	static tag = "arq-icon-button";
	static styles = se;
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
				"subtle"
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
		e.has("icon") && (this.shadowRoot.querySelector(".glyph").innerHTML = p(this.icon)), this.#e.disabled = this.disabled;
	}
	#t() {
		this.textContent.trim() || console.warn(`[arq] <arq-icon-button icon="${this.icon}"> no tiene nombre accesible: escribí qué hace entre las etiquetas (p. ej. <arq-icon-button icon="search">Buscar</arq-icon-button>).`);
	}
}).define();
//#endregion
//#region src/components/breadcrumb-item/breadcrumb-item.css?inline
var ce = ":host{min-width:0;display:inline-flex}.item{align-items:center;gap:var(--arq-space-gap-sm);min-width:0;color:var(--arq-color-text-tertiary);display:inline-flex}.label{color:inherit;text-overflow:ellipsis;white-space:nowrap;text-decoration:none;overflow:hidden}.label[aria-current=page]{white-space:normal;overflow-wrap:break-word;overflow:visible}.separator{color:var(--arq-color-text-tertiary);flex:none}@media (hover:hover){a.label:hover{color:var(--arq-color-text-primary)}}.label[aria-current=page]{color:var(--arq-color-text-primary)}a.label:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}a.label:focus:not(:focus-visible){outline:none}";
(class extends d {
	static tag = "arq-breadcrumb-item";
	static styles = ce;
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
var le = ":host{min-width:0;display:block}.list{align-items:flex-start;gap:var(--arq-space-gap-sm);flex-wrap:nowrap;min-width:0;margin:0;padding:0;list-style:none;display:flex}::slotted(*){flex:0 auto;min-width:0}::slotted([current]){flex-shrink:1000;min-width:auto}", ue = "Migas de pan";
(class extends d {
	static tag = "arq-breadcrumb";
	static styles = le;
	static template = `<nav aria-label="${ue}"><div class="list" role="list"><slot></slot></div></nav>`;
}).define();
//#endregion
//#region src/components/footer-link/footer-link.css?inline
var de = ":host{vertical-align:middle;max-width:100%;display:inline-flex}.link{align-items:center;gap:var(--arq-space-gap-sm);max-width:100%;color:var(--arq-color-text-secondary);text-decoration:none;display:inline-flex;position:relative}.label{overflow-wrap:break-word;min-width:0}.leading{flex:none;display:inline-flex}.icon{width:var(--arq-icon-md);height:var(--arq-icon-md)}.link:after{content:\"\";inset-inline:0;height:var(--arq-border-default);background:var(--arq-color-border-strong);visibility:hidden;position:absolute;top:100%}.link[href]:hover{color:var(--arq-color-text-primary)}.link[href]:hover:after{visibility:visible}.link[href]:active{color:var(--arq-color-text-tertiary)}.link[href]:active:after{visibility:hidden}.link:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.link:focus:not(:focus-visible){outline:none}";
(class extends d {
	static tag = "arq-footer-link";
	static styles = de;
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
		e.has("icon") && (n.innerHTML = p(this.icon)), n.hidden = !this.showIcon;
	}
}).define();
//#endregion
//#region src/components/form-message/form-message.css?inline
var fe = ":host{display:block}.message{color:var(--arq-color-text-success);margin:0}:host([tone=error]) .message{color:var(--arq-color-text-error)}";
(class extends d {
	static tag = "arq-form-message";
	static styles = fe;
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
//#region src/components/form-section-header/form-section-header.css?inline
var pe = ":host{width:100%;display:block}.header{align-items:baseline;gap:var(--arq-space-gap-md);padding-bottom:var(--arq-space-padding-sm-md);border-bottom:var(--arq-border-default) solid var(--arq-color-border-strong);display:flex}.number{color:var(--arq-color-text-tertiary);flex:none}.label{min-width:0;color:var(--arq-color-text-primary)}";
(class extends d {
	static tag = "arq-form-section-header";
	static styles = pe;
	static properties = {
		number: { type: String },
		showNumber: { type: Boolean }
	};
	static template = "<span class=\"header role-label\"><span class=\"number\" hidden></span><span class=\"label\"><slot></slot></span></span>";
	update() {
		let e = this.shadowRoot.querySelector(".number");
		e.textContent = this.number ?? "", e.hidden = !this.showNumber || !this.number;
	}
}).define();
//#endregion
//#region src/components/spec-row/spec-row.css?inline
var me = ":host{display:block}.row{justify-content:space-between;align-items:flex-start;gap:var(--arq-space-gap-lg);padding-block:var(--arq-space-padding-md);border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle);margin:0;display:flex}.label{overflow-wrap:anywhere;min-width:0;color:var(--arq-color-text-tertiary)}.value{overflow-wrap:anywhere;min-width:0;color:var(--arq-color-text-primary);text-align:end;margin:0}";
(class extends d {
	static tag = "arq-spec-row";
	static styles = me;
	static template = "<dl class=\"row role-body-regular\"><dt class=\"label\"><slot name=\"label\"></slot></dt><dd class=\"value\"><slot></slot></dd></dl>";
}).define();
//#endregion
//#region src/components/spec-list/spec-list.css?inline
var he = ":host{min-width:0;display:block}.list{flex-direction:column;display:flex}";
(class extends d {
	static tag = "arq-spec-list";
	static styles = he;
	static template = "<div class=\"list\"><slot></slot></div>";
}).define();
//#endregion
//#region src/base/disclosure.js
var ge = 0, _e = "\n[data-disclosure-panel] {\n  transition-property: opacity, color, background-color, border-color, outline-color, text-decoration-color, fill, stroke;\n  transition-duration: var(--arq-motion-duration-base);\n  transition-timing-function: var(--arq-motion-easing-standard);\n}\n\n@starting-style {\n  [data-disclosure-panel]:not([hidden]) {\n    opacity: 0;\n  }\n}\n", h;
function ve(e) {
	h || (h = new CSSStyleSheet(), h.replaceSync(_e)), e.adoptedStyleSheets.includes(h) || (e.adoptedStyleSheets = [...e.adoptedStyleSheets, h]);
}
var g = class {
	#e;
	#t;
	#n;
	constructor(e, { trigger: t, panel: n, closeOnEscape: r = !1 }) {
		this.#e = e, this.#t = t, this.#n = n, n.id ||= `arq-disclosure-${++ge}`, n.setAttribute("data-disclosure-panel", ""), ve(e.shadowRoot), t.type = "button", t.setAttribute("aria-controls", n.id), t.addEventListener("click", () => this.toggle()), r && e.addEventListener("keydown", (e) => {
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
		t !== this.open && (this.#e.open = t, this.#r(), this.#e.emit("toggle", { open: t }));
	}
	hostUpdate(e) {
		e.has("open") && this.#r();
	}
	#r() {
		let e = this.open;
		this.#t.setAttribute("aria-expanded", String(e)), this.#n.hidden = !e;
	}
}, ye = ":host{min-width:0;display:block}.item{border-bottom:var(--arq-border-default) solid var(--arq-color-border-default);background:var(--arq-color-surface-transparent)}:host([open]) .item{background:var(--arq-color-surface-faint);border-bottom:0}.trigger{box-sizing:border-box;align-items:center;gap:var(--arq-space-gap-md);width:100%;padding:var(--arq-space-padding-xl-2xl) var(--arq-space-padding-2xl);padding-bottom:calc(var(--arq-space-padding-xl-2xl) - var(--arq-border-default));background:var(--arq-color-surface-transparent);color:var(--arq-color-text-primary);font:inherit;text-align:start;cursor:pointer;-webkit-tap-highlight-color:var(--arq-color-surface-transparent);border:0;margin:0;display:flex}:host([open]) .trigger{padding-bottom:var(--arq-space-gap-xl)}.title{overflow-wrap:break-word;flex:1 1 0;min-width:0}.icon-box{padding:var(--arq-space-padding-sm-md);border-radius:var(--arq-radius-control);background:var(--arq-color-surface-transparent);color:var(--arq-color-icon-primary);flex:none;display:inline-flex}:host([open]) .icon-box{background:var(--arq-color-surface-default)}.icon{width:var(--arq-icon-xl);height:var(--arq-icon-xl)}:host(:not([open])) [data-icon=minus],:host([open]) [data-icon=plus]{display:none}.content{padding:0 var(--arq-space-padding-2xl) var(--arq-space-padding-2xl)}@media (hover:hover){:host(:not([open])) .item:has(.trigger:hover){background:var(--arq-color-surface-faint)}:host(:not([open])) .trigger:hover .icon-box{background:var(--arq-color-surface-hover)}}.item:has(.trigger:focus-visible){outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.trigger:focus{outline:none}@media (width<=767px){.trigger{padding-inline:var(--arq-space-padding-xl);padding-bottom:calc(var(--arq-space-padding-2xl) - var(--arq-border-default))}.content{padding-inline:var(--arq-space-padding-xl)}}";
(class extends d {
	static tag = "arq-accordion-item";
	static styles = ye;
	static properties = { open: { type: Boolean } };
	static template = `<div class="item"><button type="button" class="trigger"><span class="title role-heading-2"><slot name="title"></slot></span><span class="icon-box">${p("plus")}${p("minus")}</span></button><div class="content" part="panel"><slot></slot></div></div>`;
	setup() {
		this.disclosure = new g(this, {
			trigger: this.shadowRoot.querySelector(".trigger"),
			panel: this.shadowRoot.querySelector(".content")
		});
	}
}).define();
//#endregion
//#region src/components/filter-chip/filter-chip.css?inline
var be = ":host{vertical-align:middle;max-width:100%;display:inline-flex}.chip{box-sizing:border-box;align-items:center;gap:var(--arq-space-gap-xs);max-width:100%;padding:var(--arq-space-padding-xs) var(--arq-space-padding-sm);border:var(--arq-border-default) solid var(--arq-color-border-default);border-radius:var(--arq-radius-control);background:var(--arq-color-surface-transparent);color:var(--arq-color-text-primary);cursor:pointer;-webkit-tap-highlight-color:var(--arq-color-surface-transparent);margin:0;display:inline-flex}.label{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.icon{width:var(--arq-icon-sm);height:var(--arq-icon-sm);flex:none}.chip:hover{border-color:var(--arq-color-text-primary)}.chip:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.chip:focus:not(:focus-visible){outline:none}";
(class extends d {
	static tag = "arq-filter-chip";
	static styles = be;
	static template = `<button type="button" class="chip role-body-sm"><span class="label"><slot></slot></span>${p("close")}</button>`;
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
var xe = ":host{cursor:pointer;display:block}:host([disabled]){cursor:default}.option{align-items:center;gap:var(--arq-space-gap-sm);padding:var(--arq-space-padding-md);border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle);display:flex}:host(:not([disabled]):hover) .option{background:var(--arq-color-surface-faint)}.swatch{box-sizing:border-box;width:var(--arq-swatch-sm);height:var(--arq-swatch-sm);border:var(--arq-border-default) solid var(--arq-color-border-default);border-radius:var(--arq-radius-control);background:var(--arq-color-surface-subtle);flex:none;position:relative;overflow:hidden}.swatch img{object-fit:cover;width:100%;height:100%;display:block}.name{min-width:0;color:var(--arq-color-text-primary)}:host([disabled]) .name{color:var(--arq-color-text-disabled)}:host([active]) .option{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:calc(-1 * var(--arq-border-strong))}:host(:focus-visible){outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}:host(:focus:not(:focus-visible)){outline:none}";
(class extends d {
	static tag = "arq-select-option";
	static styles = xe;
	static properties = {
		showSwatch: { type: Boolean },
		swatchSrc: { type: String },
		selected: { type: Boolean },
		disabled: { type: Boolean },
		active: { type: Boolean },
		value: { type: String }
	};
	static template = "<span class=\"option\"><span class=\"swatch\" aria-hidden=\"true\" hidden><img alt=\"\" hidden></span><span class=\"name role-body\"><slot></slot></span></span>";
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
		this.setAttribute("aria-selected", String(this.selected)), this.disabled ? this.setAttribute("aria-disabled", "true") : this.removeAttribute("aria-disabled"), this.shadowRoot.querySelector(".swatch").hidden = !this.showSwatch;
		let t = this.shadowRoot.querySelector(".name");
		if (t.classList.toggle("role-body", !this.selected), t.classList.toggle("role-body-medium", this.selected), e.has("swatchSrc")) {
			let e = this.shadowRoot.querySelector("img");
			this.swatchSrc ? e.src = this.swatchSrc : (e.removeAttribute("src"), e.hidden = !0);
		}
	}
}).define();
//#endregion
//#region src/components/select-menu/select-menu.css?inline
var Se = ":host{box-sizing:border-box;border:var(--arq-border-default) solid var(--arq-color-border-default);border-radius:var(--arq-radius-control);background:var(--arq-color-surface-default);min-width:100%;display:block}:host([type=filter]),:host([type=text]){width:max-content;max-width:calc(100vw - 2 * var(--arq-layout-gutter))}.menu{max-height:calc(7 * (2 * var(--arq-space-padding-md) + var(--arq-type-body-leading) + var(--arq-border-default)));overscroll-behavior:contain;overflow-y:auto}";
(class extends d {
	static tag = "arq-select-menu";
	static styles = Se;
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
		this.setAttribute("role", "listbox");
	}
}).define();
//#endregion
//#region src/base/selectable.js
var Ce = "[role=\"radiogroup\"], [role=\"tablist\"]", _ = class {
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
		e.setAttribute(this.state, String(!!e.selected)), e.disabled ? e.setAttribute("aria-disabled", "true") : e.removeAttribute("aria-disabled"), e.parentElement?.closest(Ce) || e.setAttribute("tabindex", e.disabled ? "-1" : "0");
	}
}, we = ":host{vertical-align:middle;flex:none;display:inline-flex}.swatch{box-sizing:border-box;width:var(--arq-swatch-sm);height:var(--arq-swatch-sm);border-radius:var(--arq-radius-control);background:var(--arq-color-surface-subtle);display:block;position:relative;overflow:hidden}:host([size=default]) .swatch{width:var(--arq-swatch-md);height:var(--arq-swatch-md)}:host([size=large]) .swatch{width:var(--arq-swatch-lg);height:var(--arq-swatch-lg)}.swatch img{object-fit:cover;width:100%;height:100%;display:block}.swatch:after{content:\"\";border:var(--arq-border-default) solid var(--arq-color-border-subtle);border-radius:inherit;pointer-events:none;position:absolute;inset:0}:host([role=radio]){cursor:pointer}:host([role=radio]:not([disabled]):hover) .swatch:after,:host([selected]) .swatch:after{border-width:var(--arq-border-strong);border-color:var(--arq-color-border-strong)}:host([disabled]){cursor:default}:host([disabled]) .swatch:after{border-color:var(--arq-color-border-disabled)}:host([disabled]) .swatch:before{content:\"\";background:linear-gradient(to bottom right, transparent calc(50% - var(--arq-border-default) / 2), var(--arq-color-icon-tertiary) calc(50% - var(--arq-border-default) / 2), var(--arq-color-icon-tertiary) calc(50% + var(--arq-border-default) / 2), transparent calc(50% + var(--arq-border-default) / 2));pointer-events:none;position:absolute;inset:0}:host(:focus-visible){outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}:host(:focus:not(:focus-visible)){outline:none}";
(class extends d {
	static tag = "arq-swatch";
	static styles = we;
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
		this.shadowRoot.querySelector("slot").addEventListener("slotchange", t), t(), this.getAttribute("role") === "radio" || this.parentElement?.closest("arq-swatch-picker") ? this.selectable = new _(this, {
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
var Te = ":host{min-width:0;display:block}.select{flex-direction:column;display:flex;position:relative}.trigger{box-sizing:border-box;align-items:center;gap:var(--arq-space-gap-md);border-radius:var(--arq-radius-control);width:100%;font:inherit;text-align:start;cursor:pointer;-webkit-tap-highlight-color:var(--arq-color-surface-transparent);border:0;margin:0;display:flex}.value{overflow-wrap:break-word;flex:auto;min-width:0}.chevron{flex:none;display:inline-flex}.icon{width:var(--arq-icon-md);height:var(--arq-icon-md);color:var(--arq-color-icon-primary)}:host(:not([open])) [data-icon=chevron-up],:host([open]) [data-icon=chevron-down]{display:none}.menu{z-index:2;position:absolute;top:100%;left:0}:host(:not([type=filter])) .trigger{padding:var(--arq-space-padding-sm-md) var(--arq-space-padding-md) calc(var(--arq-space-padding-sm-md) - var(--arq-border-default));border-bottom:var(--arq-border-default) solid var(--arq-color-border-strong);background:var(--arq-color-surface-soft);color:var(--arq-color-text-primary)}@media (hover:hover){:host(:not([type=filter]):not([open])) .trigger:enabled:hover{background:var(--arq-color-surface-faint)}}:host(:not([type=filter])) .menu{right:0}:host([type=filter]) .select{gap:var(--arq-space-gap-xs);padding-bottom:var(--arq-space-padding-xs)}:host([type=filter][filled]) .select{gap:var(--arq-space-gap-sm);padding-bottom:calc(var(--arq-space-padding-sm) - var(--arq-border-default));border-bottom:var(--arq-border-default) solid var(--arq-color-border-strong)}.label{color:var(--arq-color-text-tertiary)}:host([type=filter]) .trigger{justify-content:space-between;gap:var(--arq-space-gap-sm);background:var(--arq-color-surface-transparent);color:var(--arq-color-text-primary);padding:0}:host([type=filter]) .icon{width:var(--arq-icon-sm);height:var(--arq-icon-sm)}@media (hover:hover){:host([type=filter]:not([open])) .trigger:enabled:hover .value{color:var(--arq-color-text-tertiary)}}:host([type=filter]) .menu{margin-top:var(--arq-space-gap-sm)}:host([disabled]) .trigger{cursor:default;border-bottom-color:var(--arq-color-border-disabled);background:var(--arq-color-surface-transparent);color:var(--arq-color-text-disabled)}:host([disabled]) .label,:host([disabled]) .icon{color:var(--arq-color-text-disabled)}.trigger:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.trigger:focus:not(:focus-visible){outline:none}", Ee = 0;
(class extends d {
	static tag = "arq-select";
	static styles = Te;
	static properties = {
		type: {
			type: String,
			values: ["field", "filter"],
			default: "field"
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
		}
	};
	static template = `<div class="select"><span class="label role-label-sm" hidden></span><button type="button" class="trigger" role="combobox" aria-haspopup="listbox" aria-expanded="false"><arq-swatch class="swatch" aria-hidden="true" hidden></arq-swatch><span class="value"></span><span class="chevron">${p("chevron-down")}${p("chevron-up")}</span></button><arq-select-menu class="menu" hidden></arq-select-menu></div>`;
	#e = [];
	#t = -1;
	#n = "";
	#r = 0;
	get options() {
		return this.#e;
	}
	set options(e) {
		this.#e = Array.isArray(e) ? e : [], this.isConnected && this.#a();
	}
	setup() {
		let e = this.shadowRoot, t = `arq-select-${++Ee}`;
		this.trigger = e.querySelector(".trigger"), this.menu = e.querySelector(".menu"), this.menu.id = `${t}-menu`, e.querySelector(".label").id = `${t}-label`, this.trigger.id = `${t}-trigger`, this.trigger.setAttribute("aria-controls", this.menu.id), this.trigger.addEventListener("click", () => this.open ? this.close() : this.show()), this.trigger.addEventListener("keydown", (e) => this.#u(e)), this.trigger.addEventListener("blur", () => {
			setTimeout(() => {
				this.open && !this.matches(":focus-within") && this.close(!1);
			});
		}), this.menu.addEventListener("pointerdown", (e) => e.preventDefault()), this.menu.addEventListener("click", (e) => {
			let t = e.target.closest("arq-select-option");
			t && !t.disabled && this.#c(Number(t.dataset.index));
		}), this.menu.addEventListener("arq:change", (e) => e.stopPropagation()), this.#a();
	}
	update(e) {
		let t = this.shadowRoot, n = this.type === "filter", r = t.querySelector(".label");
		r.hidden = !n, r.textContent = this.label ?? "", r.className = "label role-label-sm", n ? (this.trigger.setAttribute("aria-labelledby", `${r.id} ${this.trigger.id}`), this.trigger.removeAttribute("aria-label")) : (this.trigger.removeAttribute("aria-labelledby"), this.label && this.trigger.setAttribute("aria-label", this.label)), this.trigger.disabled = this.disabled, this.menu.type = n ? "filter" : "finishes", e.has("open") && (this.menu.hidden = !this.open, this.trigger.setAttribute("aria-expanded", String(this.open)), this.open || this.#o(-1)), this.#a();
	}
	show() {
		if (this.disabled) return;
		this.open = !0;
		let e = this.#i(), t = e.findIndex((e) => e.value === (this.value ?? ""));
		this.#o(t >= 0 && !e[t].disabled ? t : this.#s(-1, 1));
	}
	close(e = !0) {
		this.open = !1, e && this.trigger.focus();
	}
	focus(e) {
		this.trigger ? this.trigger.focus(e) : super.focus(e);
	}
	#i() {
		let e = this.#e.map((e) => ({
			value: String(e.value),
			label: e.label ?? String(e.value),
			swatch: e.swatch,
			showSwatch: !!(e.swatch || e.showSwatch),
			disabled: !!e.disabled
		}));
		return this.type === "filter" && e.unshift({
			value: "",
			label: this.allLabel ?? "Todos",
			showSwatch: !1,
			disabled: !1
		}), e;
	}
	#a() {
		if (!this.trigger) return;
		let e = this.#i(), t = e.find((e) => e.value === (this.value ?? "")) ?? (this.type === "filter" ? e[0] : null), n = this.type === "filter" && !!this.value;
		this.filled !== n && (this.filled = n);
		let r = this.shadowRoot.querySelector(".swatch");
		r.hidden = !t?.showSwatch || this.type !== "field" && !n, r.setAttribute("size", this.type === "field" ? "large" : "small"), t?.swatch ? r.setAttribute("src", t.swatch) : r.removeAttribute("src"), r.textContent = t?.label ?? "";
		let i = this.shadowRoot.querySelector(".value");
		i.textContent = t?.label ?? "", i.className = `value ${this.type === "filter" && !this.disabled ? "role-body-medium" : "role-body-regular"}`;
		let a = this.menu;
		for (; a.children.length > e.length;) a.lastElementChild.remove();
		for (; a.children.length < e.length;) a.append(document.createElement("arq-select-option"));
		e.forEach((e, n) => {
			let r = a.children[n];
			r.id = `${a.id}-${n}`, r.dataset.index = String(n), r.value = e.value, r.textContent = e.label, r.showSwatch = e.showSwatch, r.swatchSrc = e.swatch ?? null, r.disabled = e.disabled, r.selected = e === t;
		});
	}
	#o(e) {
		this.#t = e;
		let t = [...this.menu.children];
		t.forEach((t, n) => t.active = n === e), e >= 0 && t[e] ? (this.trigger.setAttribute("aria-activedescendant", t[e].id), t[e].scrollIntoView({ block: "nearest" })) : this.trigger.removeAttribute("aria-activedescendant");
	}
	#s(e, t) {
		let n = this.#i();
		for (let r = e + t; r >= 0 && r < n.length; r += t) if (!n[r].disabled) return r;
		return e;
	}
	#c(e) {
		let t = this.#i()[e];
		if (!t || t.disabled) return;
		let n = t.value !== (this.value ?? "");
		this.value = t.value, this.close(), n && this.emit("change", { value: t.value });
	}
	#l(e) {
		let t = Date.now();
		this.#n = t - this.#r > 500 ? e : this.#n + e, this.#r = t;
		let n = this.#i(), r = this.#t >= 0 ? this.#t : 0, i = [...n.keys()].slice(r + 1).concat([...n.keys()].slice(0, r + 1)).find((e) => !n[e].disabled && n[e].label.toLowerCase().startsWith(this.#n.toLowerCase()));
		i !== void 0 && this.#o(i);
	}
	#u(e) {
		let { key: t } = e, n = this.#i();
		if (!this.open) {
			[
				"ArrowDown",
				"ArrowUp",
				"Enter",
				" ",
				"Home",
				"End"
			].includes(t) ? (e.preventDefault(), this.show(), t === "Home" && this.#o(this.#s(-1, 1)), t === "End" && this.#o(this.#s(n.length, -1))) : t.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey && (this.show(), this.#l(t));
			return;
		}
		if (t === "ArrowDown") this.#o(this.#s(this.#t, 1));
		else if (t === "ArrowUp") this.#o(this.#s(this.#t, -1));
		else if (t === "Home") this.#o(this.#s(-1, 1));
		else if (t === "End") this.#o(this.#s(n.length, -1));
		else if (t === "Enter" || t === " ") this.#c(this.#t);
		else if (t === "Escape") this.close();
		else if (t === "Tab") {
			this.close(!1);
			return;
		} else if (t.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) this.#l(t);
		else return;
		e.preventDefault();
	}
}).define();
//#endregion
//#region src/components/filter-bar/filter-bar.css?inline
var De = ":host{min-width:0;display:block}.bar{justify-content:space-between;align-items:center;gap:var(--arq-space-gap-lg);padding:calc(var(--arq-space-padding-md) - var(--arq-border-default)) var(--arq-layout-gutter);border-block:var(--arq-border-default) solid var(--arq-color-border-subtle);background:var(--arq-color-surface-faint);display:flex}.filters{align-items:stretch;gap:var(--arq-space-gap-lg);flex-wrap:wrap;min-width:0;display:flex}::slotted(arq-select){flex:none}::slotted(arq-select:not(:first-child)){border-inline-start:var(--arq-border-default) solid var(--arq-color-border-subtle);padding-inline-start:var(--arq-space-gap-lg)}.clear{flex:none}@media (width<=767px){.bar{align-items:stretch;gap:var(--arq-space-gap-md);flex-direction:column}.filters{gap:var(--arq-space-gap-md);flex-direction:column}::slotted(arq-select:not(:first-child)){border-inline-start:0;padding-inline-start:0}.clear{align-self:flex-start}}";
(class extends d {
	static tag = "arq-filter-bar";
	static styles = De;
	static properties = { applied: { type: Boolean } };
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
//#region src/data/variants.js
var v = (e) => e != null && String(e).trim() !== "";
function Oe(e, t) {
	let n = [];
	for (let r of e) {
		let e = r.attributes[t];
		v(e) && !n.includes(e) && n.push(e);
	}
	return n;
}
var y = (e, t, n) => Object.entries(t).every(([t, r]) => t === n || !v(r) || e.attributes[t] === r);
function ke(e, t) {
	return e.filter((e) => y(e, t));
}
function Ae(e, t, n) {
	return t.map((t) => ({
		attribute: t,
		options: Oe(e, t).map((r) => ({
			value: r,
			selected: n[t] === r,
			disabled: !e.some((e) => e.attributes[t] === r && y(e, n, t))
		}))
	}));
}
//#endregion
//#region src/components/sku/sku.css?inline
var je = ":host{vertical-align:middle;max-width:100%;display:inline-flex}.sku{align-items:flex-start;gap:var(--arq-space-gap-xs);flex-direction:column;min-width:0;display:flex}.label{color:var(--arq-color-text-secondary)}:host([size=compact]) .label{display:none}.row{align-items:flex-start;gap:var(--arq-space-gap-sm);background:var(--arq-color-surface-transparent);max-width:100%;color:var(--arq-color-text-primary);text-align:start;cursor:pointer;-webkit-tap-highlight-color:var(--arq-color-surface-transparent);border:0;margin:0;padding:0;display:inline-flex}.code{min-width:0;color:var(--arq-color-text-primary);overflow-wrap:anywhere}.copy{color:var(--arq-color-icon-secondary);flex:none;margin-block-start:calc((var(--arq-type-body-lg-leading) - var(--arq-icon-md)) / 2);display:inline-flex}:host([size=compact]) .copy{margin-block-start:calc((var(--arq-type-body-leading) - var(--arq-icon-md)) / 2)}.icon{width:var(--arq-icon-md);height:var(--arq-icon-md)}.row:hover .copy{color:var(--arq-color-icon-primary)}.copied,.failed{color:var(--arq-color-text-success);flex:none;margin-block-start:calc((var(--arq-type-body-lg-leading) - var(--arq-type-caption-leading)) / 2);display:none}:host([size=compact]) .copied,:host([size=compact]) .failed{margin-block-start:calc((var(--arq-type-body-leading) - var(--arq-type-caption-leading)) / 2)}:host([copied]) .copy,:host(:state(copy-failed)) .copy{display:none}:host([copied]) .copied,:host(:state(copy-failed)) .failed{display:inline}.failed{color:var(--arq-color-text-secondary)}.label,.copy,.copied,.failed{-webkit-user-select:none;user-select:none}.row:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.row:focus:not(:focus-visible){outline:none}", b = "Copiado", x = /Mac|iPhone|iPad/.test(navigator.userAgentData?.platform ?? navigator.platform ?? "") ? "Copialo con ⌘C" : "Copialo con Ctrl+C";
function S(e) {
	let t = getComputedStyle(e).getPropertyValue("--arq-motion-duration-feedback").trim(), n = Number.parseFloat(t);
	return Number.isNaN(n) ? 0 : t.endsWith("ms") ? n : n * 1e3;
}
(class extends d {
	static tag = "arq-sku";
	static styles = je;
	static properties = {
		size: {
			type: String,
			values: ["default", "compact"],
			default: "default"
		},
		copied: { type: Boolean }
	};
	static template = `<span class="sku"><span class="label role-label">SKU</span><button type="button" class="row"><span class="code"><slot></slot></span><span class="copy">${p("copy")}</span><span class="copied role-caption" aria-hidden="true">${b}</span><span class="failed role-caption" aria-hidden="true">${x}</span></button><span class="visually-hidden" aria-live="polite"></span></span>`;
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
			getSelection()?.selectAllChildren(this), this.copied = !1, this.#r(!0), this.#t = setTimeout(() => this.#r(!1), S(this));
			return;
		}
		this.copied = !0, this.emit("copy", { code: this.code }), this.#t = setTimeout(() => this.copied = !1, S(this));
	}
	update() {
		this.shadowRoot.querySelector(".code").classList.toggle("role-body-lg", this.size !== "compact"), this.shadowRoot.querySelector(".code").classList.toggle("role-body", this.size === "compact"), this.#i();
	}
	disconnectedCallback() {
		clearTimeout(this.#t);
	}
	#r(e) {
		e ? this.#n.states.add("copy-failed") : this.#n.states.delete("copy-failed"), this.#i();
	}
	#i() {
		let e = this.#n.states.has("copy-failed");
		this.shadowRoot.querySelector("[aria-live]").textContent = e ? x : this.copied ? b : "";
	}
}).define();
//#endregion
//#region src/components/variants-table/variants-table.css?inline
var Me = ":host{gap:var(--arq-space-gap-md);flex-direction:column;min-width:0;display:flex}.toolbar{justify-content:space-between;align-items:center;gap:var(--arq-space-gap-md);padding:var(--arq-space-padding-md) var(--arq-layout-gutter);flex-wrap:wrap;display:flex}.downloads{gap:var(--arq-space-gap-sm);flex-wrap:wrap;display:flex}.scroll{overscroll-behavior-x:contain;overflow-x:auto}.scroll:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:calc(-1 * var(--arq-border-strong))}.table{border-collapse:collapse;border-spacing:0;width:100%}th,td{padding:0 var(--arq-space-gap-sm) 0 0;border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle);background:var(--arq-color-bg-default);text-align:start;white-space:nowrap;vertical-align:middle}thead th{padding-block:var(--arq-space-padding-sm-md);color:var(--arq-color-text-tertiary);font-weight:inherit}tbody td{color:var(--arq-color-text-primary)}@media (hover:hover){tbody tr:hover>*{background:var(--arq-color-surface-faint)}}.start{z-index:1;padding-inline-start:var(--arq-layout-gutter);position:sticky;left:0}.cell-start{align-items:center;gap:var(--arq-space-gap-sm);display:flex}.th-sku{padding-inline-start:calc(var(--arq-layout-table-thumb) + var(--arq-space-gap-sm));display:inline-block}.thumb{width:var(--arq-layout-table-thumb);height:var(--arq-layout-table-thumb);background:var(--arq-color-surface-subtle);flex:none;display:block;overflow:hidden}.thumb img{object-fit:cover;width:100%;height:100%;display:block}.end{z-index:1;width:1%;padding-inline:var(--arq-space-gap-sm) var(--arq-layout-gutter);text-align:end;position:sticky;right:0}", C = (e) => String(e ?? "").replace(/[&<>"]/g, (e) => ({
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;"
})[e]);
(class extends d {
	static tag = "arq-variants-table";
	static styles = Me;
	static properties = {
		filters: { type: Boolean },
		downloads: { type: String },
		label: {
			type: String,
			default: "Variantes"
		}
	};
	static template = "<div class=\"controls\"><div class=\"toolbar\"><arq-button class=\"toggle-filters\" show-icon icon=\"filter\">Filtros</arq-button><div class=\"downloads\"><slot name=\"downloads\"></slot></div></div><arq-filter-bar class=\"filter-bar\" hidden></arq-filter-bar></div><div class=\"scroll\" tabindex=\"0\" role=\"region\" aria-label=\"Variantes\"><table class=\"table\"><thead></thead><tbody></tbody></table></div>";
	#e = {
		columns: [],
		filters: [],
		rows: []
	};
	#t = {};
	get data() {
		return this.#e;
	}
	set data(e) {
		this.#e = {
			columns: e?.columns ?? [],
			filters: e?.filters ?? [],
			rows: e?.rows ?? []
		}, this.#t = {}, this.isConnected && this.#n();
	}
	setup() {
		let e = this.shadowRoot;
		e.querySelector(".toggle-filters").addEventListener("click", () => this.filters = !this.filters), e.querySelector(".filter-bar").addEventListener("arq:filters", (e) => {
			e.stopPropagation(), this.#t = e.detail.filters, this.#r();
		}), e.querySelector("tbody").addEventListener("click", (e) => {
			let t = e.target.closest("arq-icon-button[data-sku]");
			if (!t) return;
			let n = t.dataset.sku;
			this.emit("downloads", { sku: n }), (this.downloads ? this.getRootNode().getElementById?.(this.downloads) : null)?.show?.(t);
		}), this.#n();
	}
	update(e) {
		let t = this.shadowRoot;
		if (e.has("label") && t.querySelector(".scroll").setAttribute("aria-label", this.label ?? "Variantes"), !e.has("filters")) return;
		let n = t.querySelector(".toggle-filters");
		if (n.type = this.filters ? "outline" : "filled", n.icon = this.filters ? "filter-off" : "filter", customElements.whenDefined("arq-button").then(() => {
			let e = n.shadowRoot?.querySelector(".control");
			e && (e.setAttribute("aria-expanded", String(this.filters)), "ariaControlsElements" in e && (e.ariaControlsElements = [t.querySelector(".filter-bar")]));
		}), t.querySelector(".filter-bar").hidden = !this.filters, !this.filters && Object.keys(this.#t).length) {
			this.#t = {};
			for (let e of t.querySelectorAll(".filter-bar arq-select")) e.value = "";
			t.querySelector(".filter-bar").applied = !1, this.#r();
		}
	}
	#n() {
		let e = this.shadowRoot, { columns: t, filters: n } = this.#e;
		e.querySelector("thead").innerHTML = "<tr><th scope=\"col\" class=\"start role-label\"><span class=\"th-sku\">SKU</span></th>" + t.map((e) => `<th scope="col" class="role-label">${C(e.label)}</th>`).join("") + "<th scope=\"col\" class=\"end\"><span class=\"visually-hidden\">Descargas</span></th></tr>", e.querySelector(".filter-bar").replaceChildren(...n.map((e) => {
			let t = document.createElement("arq-select");
			return t.type = "filter", t.label = e.label, t.name = e.key, t;
		})), this.#r();
	}
	#r() {
		let e = this.shadowRoot, { columns: t, filters: n, rows: r } = this.#e, i = Ae(r, n.map((e) => e.key), this.#t);
		e.querySelectorAll(".filter-bar arq-select").forEach((e, t) => {
			e.options = i[t].options.map((e) => ({
				value: e.value,
				label: e.value,
				disabled: e.disabled
			})), e.value = this.#t[e.name] ?? "";
		});
		let a = ke(r, this.#t);
		e.querySelector("tbody").innerHTML = a.map((e) => `<tr><th scope="row" class="start"><span class="cell-start"><span class="thumb">${e.thumb ? `<img src="${C(e.thumb)}" alt="" loading="lazy">` : ""}</span><arq-sku size="compact">${C(e.sku)}</arq-sku></span></th>` + t.map((t) => `<td class="role-body">${C(e.values?.[t.key] ?? "—")}</td>`).join("") + `<td class="end"><arq-icon-button icon="download" background="subtle" data-sku="${C(e.sku)}">Descargas de ${C(e.sku)}</arq-icon-button></td></tr>`).join("");
	}
}).define();
//#endregion
//#region src/components/gallery-thumb/gallery-thumb.css?inline
var Ne = ":host{display:block}.thumb{box-sizing:border-box;aspect-ratio:5/4;border-radius:var(--arq-radius-control);background:var(--arq-color-surface-subtle);cursor:pointer;-webkit-tap-highlight-color:var(--arq-color-surface-transparent);border:0;width:100%;margin:0;padding:0;display:block;position:relative;overflow:hidden}.thumb img{object-fit:cover;width:100%;height:100%;display:block}.thumb:after{content:\"\";border:var(--arq-border-default) solid var(--arq-color-surface-transparent);border-radius:inherit;pointer-events:none;position:absolute;inset:0}.thumb:hover:after{border-color:var(--arq-color-border-hover)}.thumb[aria-current=true]:after{border-color:var(--arq-color-border-strong)}.thumb:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.thumb:focus:not(:focus-visible){outline:none}";
(class extends d {
	static tag = "arq-gallery-thumb";
	static styles = Ne;
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
var w = /* @__PURE__ */ new Set(), T = null;
function Pe(e) {
	if (e.assignedSlot) return e.assignedSlot;
	if (e.parentElement) return e.parentElement;
	let t = e.parentNode;
	return t instanceof ShadowRoot ? t.host : null;
}
function E(e) {
	for (let t = e; t; t = Pe(t)) if (t.hasAttribute?.("data-arq-theme")) return t.getAttribute("data-arq-theme") === "dark";
	return !1;
}
function Fe() {
	for (let e of w) {
		let t = e.ref.deref();
		if (!t) {
			w.delete(e);
			continue;
		}
		if (!t.isConnected) continue;
		let n = E(t);
		n !== e.dark && (e.dark = n, t[e.method](n));
	}
}
function D(e, t) {
	let n = {
		ref: new WeakRef(e),
		dark: E(e),
		method: t
	};
	w.add(n), T || (T = new MutationObserver(Fe), T.observe(document.documentElement, {
		attributes: !0,
		subtree: !0,
		attributeFilter: ["data-arq-theme"]
	})), e[t](n.dark);
}
//#endregion
//#region src/components/product-gallery/product-gallery.css?inline
var Ie = ":host{min-width:0;display:block}.gallery{gap:var(--arq-space-gap-sm);flex-direction:column;display:flex;position:relative}.image{aspect-ratio:5/4;border-radius:var(--arq-radius-control);background:var(--arq-color-surface-subtle);overflow:hidden}::slotted(img){object-fit:cover!important;width:100%!important;height:100%!important;display:block!important}.thumbs{gap:var(--arq-space-gap-sm);margin:calc(-1 * var(--arq-space-padding-xs));padding:var(--arq-space-padding-xs);scroll-snap-type:x mandatory;scrollbar-width:none;display:flex;overflow-x:auto}.thumbs::-webkit-scrollbar{display:none}arq-gallery-thumb{width:var(--arq-layout-gallery-thumb);scroll-snap-align:start;flex:none}@media (width>=768px){.thumbs{left:var(--arq-space-padding-lg);bottom:var(--arq-space-padding-lg);max-width:calc(100% - 2 * var(--arq-space-padding-lg));position:absolute}}";
(class extends d {
	static tag = "arq-product-gallery";
	static styles = Ie;
	static properties = {};
	static template = "<div class=\"gallery\"><div class=\"image\"><slot name=\"image\"></slot></div><div class=\"thumbs\" hidden></div></div>";
	#e = [];
	#t = 0;
	#n = !1;
	get images() {
		return this.#e;
	}
	set images(e) {
		this.#e = Array.isArray(e) ? e.filter((e) => e && e.src) : [], this.#t = 0, this.isConnected && this.#a();
	}
	setup() {
		this.shadowRoot.querySelector(".thumbs").addEventListener("click", (e) => {
			let t = e.target.closest("arq-gallery-thumb");
			t && this.select(Number(t.dataset.index));
		}), D(this, "themeChanged"), this.#a();
	}
	themeChanged(e) {
		this.#n = e, this.#a();
	}
	select(e) {
		this.#e[e] && e !== this.#t && (this.#t = e, this.#a());
	}
	#r(e) {
		return this.#n && e.srcOn || e.src;
	}
	#i() {
		let e = this.querySelector(":scope > img[slot=\"image\"]");
		return !e && this.#e.length && (e = document.createElement("img"), e.slot = "image", this.append(e)), e;
	}
	#a() {
		let e = this.#e, t = e[this.#t], n = this.#i();
		if (n && t) {
			let e = this.#r(t);
			n.getAttribute("src") !== e && (n.src = e), n.alt = t.alt ?? "";
		}
		let r = this.shadowRoot.querySelector(".thumbs");
		if (r.hidden = e.length < 2, r.hidden) {
			r.replaceChildren();
			return;
		}
		for (; r.children.length > e.length;) r.lastElementChild.remove();
		for (; r.children.length < e.length;) r.append(document.createElement("arq-gallery-thumb"));
		e.forEach((e, t) => {
			let n = r.children[t];
			n.dataset.index = String(t), n.src = this.#r(e), n.alt = e.alt ?? "", n.selected = t === this.#t;
		});
	}
}).define();
//#endregion
//#region src/base/card-link.css?inline
var O = ".card{--card-above:1;position:relative}.card-link{color:inherit;-webkit-tap-highlight-color:var(--arq-color-surface-transparent);text-decoration:none;display:block}.card-link:after{content:\"\";position:absolute;inset:0}.card-link:focus{outline:none}.card:has(.card-link:focus-visible){outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}@media (hover:hover){.card:has(.card-link:hover) .card-media{outline:var(--arq-border-default) solid var(--arq-color-border-hover);outline-offset:calc(var(--arq-border-default) * -1)}}.card-media{background:var(--arq-color-bg-subtle);overflow:hidden}.card-media ::slotted(*){object-fit:cover;width:100%!important;max-width:none!important;height:100%!important;display:block!important}", Le = ":host{min-width:0;display:block}.card{gap:var(--arq-space-gap-md);flex-direction:column;display:flex}.card-media{aspect-ratio:1;background:var(--arq-color-surface-subtle)}:host([size=large]) .card-media{aspect-ratio:7/10}.name{max-width:100%;color:var(--arq-color-text-secondary);overflow-wrap:break-word;align-self:flex-start}:host([size=large]) .name{color:var(--arq-color-text-primary)}";
(class extends d {
	static tag = "arq-family-card";
	static styles = O + Le;
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
//#region src/components/download-item/download-item.css?inline
var Re = ":host{min-width:0;display:block}.row{box-sizing:border-box;align-items:center;gap:var(--arq-space-gap-md);width:100%;padding:var(--arq-space-padding-md) 0 calc(var(--arq-space-padding-md) - var(--arq-border-default));border:0;border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle);border-radius:var(--arq-radius-control);background:var(--arq-color-surface-transparent);color:var(--arq-color-text-primary);font:inherit;text-align:start;cursor:pointer;-webkit-tap-highlight-color:var(--arq-color-surface-transparent);margin:0;text-decoration:none;display:flex}.label{overflow-wrap:break-word;flex:auto;min-width:0}.icon{width:var(--arq-icon-md);height:var(--arq-icon-md);color:var(--arq-color-icon-primary);flex:none}:host([emphasis=featured]) .row{padding:calc(var(--arq-space-padding-md) - var(--arq-border-default)) calc(var(--arq-space-padding-lg) - var(--arq-border-default));border:var(--arq-border-default) solid var(--arq-color-border-strong)}@media (hover:hover){:host(:not([emphasis=featured])) .row:hover .label{text-decoration:underline;text-decoration-thickness:var(--arq-border-default)}:host([emphasis=featured]) .row:hover{background:var(--arq-color-surface-faint)}}.row:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.row:focus:not(:focus-visible){outline:none}";
(class extends d {
	static tag = "arq-download-item";
	static styles = Re;
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
			e.className = "row", e.innerHTML = `<span class="label role-body-xl"><slot></slot></span>${p("download")}`, t === "button" && (e.type = "button", e.addEventListener("click", () => this.emit("download", {}))), this.shadowRoot.querySelector(".slot-host").replaceChildren(e), this.#e = e;
		}
		this.href && (this.#e.setAttribute("href", this.href), this.#e.setAttribute("download", ""));
	}
	focus(e) {
		this.#e ? this.#e.focus(e) : super.focus(e);
	}
}).define();
//#endregion
//#region src/components/download-modal/download-modal.css?inline
var ze = ":host{display:contents}.dialog{box-sizing:border-box;inset:auto var(--arq-layout-gutter) var(--arq-layout-gutter) auto;width:var(--arq-layout-filter-panel);max-width:calc(100% - 2 * var(--arq-layout-gutter));max-height:calc(100dvh - 2 * var(--arq-layout-gutter));border:var(--arq-border-default) solid var(--arq-color-border-default);border-radius:var(--arq-radius-control);background:var(--arq-color-surface-default);color:var(--arq-color-text-primary);margin:0;padding:0}.dialog::backdrop{background:var(--arq-color-overlay-scrim)}.sheet{gap:var(--arq-space-gap-2xl);padding:var(--arq-space-padding-xl-2xl);flex-direction:column;display:flex}.header{justify-content:space-between;align-items:center;gap:var(--arq-space-gap-md);display:flex}.title{min-width:0;color:var(--arq-color-text-primary)}.content{gap:var(--arq-space-gap-md);flex-direction:column;display:flex}.list{flex-direction:column;display:flex}@media (width<=767px){.dialog{inset:auto var(--arq-layout-gutter) var(--arq-layout-gutter);width:auto;max-width:none}}";
(class extends d {
	static tag = "arq-download-modal";
	static styles = ze;
	static properties = { open: { type: Boolean } };
	static template = "<dialog class=\"dialog\"><div class=\"sheet\"><div class=\"header\"><div class=\"title role-heading-1\"><slot name=\"title\"></slot></div><arq-icon-button icon=\"close\" size=\"large\" class=\"close\">Cerrar descargas</arq-icon-button></div><div class=\"content\"><div class=\"featured\"><slot name=\"featured\"></slot></div><div class=\"list\" role=\"list\"><slot></slot></div></div></div></dialog>";
	#e = null;
	#t = null;
	setup() {
		this.#e = this.shadowRoot.querySelector("dialog"), this.shadowRoot.querySelector(".close").addEventListener("click", () => this.close()), this.#e.addEventListener("click", (e) => {
			e.target === this.#e && this.close();
		}), this.#e.addEventListener("cancel", (e) => {
			e.preventDefault(), this.close();
		});
		let e = () => {
			for (let e of this.querySelectorAll(":scope > arq-download-item")) {
				let t = e.getAttribute("emphasis") === "featured";
				t && e.slot !== "featured" && (e.slot = "featured"), !t && e.slot === "featured" && e.removeAttribute("slot");
			}
		};
		new MutationObserver(e).observe(this, {
			childList: !0,
			attributes: !0,
			subtree: !0,
			attributeFilter: ["emphasis"]
		}), e(), this.shadowRoot.querySelector("slot[name=\"title\"]").addEventListener("slotchange", () => this.#r()), this.#r();
	}
	update(e) {
		e.has("open") && (this.open && !this.#e.open && this.#e.showModal(), !this.open && this.#e.open && (this.#e.close(), this.#t?.focus?.(), this.#t = null));
	}
	show(e) {
		this.#t = e ?? this.#n(), this.open = !0;
	}
	close() {
		this.open = !1;
	}
	#n() {
		let e = document.activeElement;
		for (; e?.shadowRoot?.activeElement;) e = e.shadowRoot.activeElement;
		let t = e?.getRootNode?.();
		return t instanceof ShadowRoot ? t.host : e;
	}
	#r() {
		let e = this.querySelector("[slot=\"title\"]")?.textContent.trim();
		this.#e.setAttribute("aria-label", e || "Descargas");
	}
}).define();
//#endregion
//#region src/components/catalog-nav-item/catalog-nav-item.css?inline
var Be = ":host{min-width:0;display:flex}.link{align-items:center;gap:var(--arq-space-gap-sm);min-width:0;color:var(--arq-color-text-tertiary);-webkit-tap-highlight-color:var(--arq-color-surface-transparent);text-decoration:none;display:inline-flex}.label{overflow-wrap:break-word;min-width:0}.indicator{width:var(--arq-space-gap-sm-md);height:var(--arq-border-default);background:var(--arq-color-text-primary);flex:none;display:none}@media (hover:hover){.link:hover{color:var(--arq-color-text-primary)}}:host([selected]) .link{color:var(--arq-color-text-primary)}:host([selected]) .indicator{display:block}.link:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.link:focus:not(:focus-visible){outline:none}";
(class extends d {
	static tag = "arq-catalog-nav-item";
	static styles = Be;
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
		let t = `role-body${this.size === "large" ? "-lg" : ""}${this.selected ? "-regular" : ""}`;
		this.shadowRoot.querySelector(".label").className = `label ${t}`;
	}
}).define();
//#endregion
//#region src/components/catalog-nav-group/catalog-nav-group.css?inline
var Ve = ":host{min-width:0;display:block}.group{border-top:var(--arq-border-default) solid var(--arq-color-border-subtle)}.header{box-sizing:border-box;justify-content:space-between;align-items:center;gap:var(--arq-space-gap-md);width:100%;padding:var(--arq-space-padding-md) 0;background:var(--arq-color-surface-transparent);color:var(--arq-color-text-secondary);font:inherit;text-align:start;cursor:pointer;-webkit-tap-highlight-color:var(--arq-color-surface-transparent);border:0;margin:0;display:flex}:host([open]) .header{padding-bottom:var(--arq-space-gap-md);color:var(--arq-color-text-primary)}.label{overflow-wrap:break-word;min-width:0}.icon-box{padding:var(--arq-space-padding-xs);border-radius:var(--arq-radius-control);background:var(--arq-color-surface-transparent);color:var(--arq-color-icon-primary);flex:none;display:inline-flex}.icon{width:var(--arq-icon-md);height:var(--arq-icon-md)}:host(:not([open])) [data-icon=minus],:host([open]) [data-icon=plus]{display:none}@media (hover:hover){.header:hover .icon-box{background:var(--arq-color-surface-hover)}}.items{align-items:flex-start;gap:var(--arq-space-gap-sm-md);padding-bottom:calc(var(--arq-space-padding-md) + var(--arq-space-padding-xs));flex-direction:column;display:flex}.header:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.header:focus:not(:focus-visible){outline:none}";
(class extends d {
	static tag = "arq-catalog-nav-group";
	static styles = Ve;
	static properties = { open: { type: Boolean } };
	static template = `<div class="group"><button type="button" class="header"><span class="label role-label"><slot name="label"></slot></span><span class="icon-box">${p("plus")}${p("minus")}</span></button><div class="items" role="list" part="panel"><slot></slot></div></div>`;
	setup() {
		this.disclosure = new g(this, {
			trigger: this.shadowRoot.querySelector(".header"),
			panel: this.shadowRoot.querySelector(".items")
		});
	}
}).define();
//#endregion
//#region src/components/catalog-nav/catalog-nav.css?inline
var He = ":host{min-width:0;display:block}.nav{background:var(--arq-color-surface-default)}.trigger{display:none}.panel,.panel[hidden]{padding-inline:var(--arq-space-padding-md);display:block!important}@media (width<=1023px){.nav{border-block:var(--arq-border-default) solid var(--arq-color-border-default)}.panel[hidden]{display:none!important}.trigger{box-sizing:border-box;justify-content:space-between;align-items:center;gap:var(--arq-space-gap-md);width:100%;padding:var(--arq-space-padding-md);background:var(--arq-color-surface-default);color:var(--arq-color-text-primary);font:inherit;text-align:start;cursor:pointer;-webkit-tap-highlight-color:var(--arq-color-surface-transparent);border:0;margin:0;display:flex}:host([open]) .trigger{background:var(--arq-color-surface-faint)}@media (hover:hover){.trigger:hover{background:var(--arq-color-surface-faint)}:host(:not([open])) .trigger:hover .icon-box{background:var(--arq-color-surface-hover)}}.trigger:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.trigger:focus:not(:focus-visible){outline:none}}.current{align-items:center;gap:var(--arq-space-gap-sm);min-width:0;display:inline-flex}.current-label{overflow-wrap:break-word;min-width:0}.indicator{width:var(--arq-space-gap-sm-md);height:var(--arq-border-default);background:var(--arq-color-text-primary);flex:none}.icon-box{padding:var(--arq-space-padding-xs);border-radius:var(--arq-radius-control);background:var(--arq-color-surface-transparent);color:var(--arq-color-icon-primary);flex:none;display:inline-flex}:host([open]) .icon-box{background:var(--arq-color-surface-default)}.icon{width:var(--arq-icon-md);height:var(--arq-icon-md)}:host(:not([open])) [data-icon=minus],:host([open]) [data-icon=plus]{display:none}";
(class extends d {
	static tag = "arq-catalog-nav";
	static styles = He;
	static properties = {
		open: { type: Boolean },
		label: {
			type: String,
			default: "Categorías"
		}
	};
	static template = `<nav class="nav"><button type="button" class="trigger"><span class="current"><span class="indicator" aria-hidden="true"></span><span class="current-label role-body-regular"></span></span><span class="icon-box">${p("plus")}${p("minus")}</span></button><div class="panel" part="panel"><slot></slot></div></nav>`;
	setup() {
		this.disclosure = new g(this, {
			trigger: this.shadowRoot.querySelector(".trigger"),
			panel: this.shadowRoot.querySelector(".panel")
		});
		let e = () => this.#t();
		this.shadowRoot.querySelector("slot").addEventListener("slotchange", e), new MutationObserver(e).observe(this, {
			subtree: !0,
			childList: !0,
			characterData: !0,
			attributes: !0,
			attributeFilter: ["selected"]
		}), this.addEventListener("click", (e) => {
			e.target.closest?.("arq-catalog-nav-item") && this.disclosure.hide();
		}), e(), this.#n();
	}
	update(e) {
		e.has("label") && this.shadowRoot.querySelector(".nav").setAttribute("aria-label", this.label ?? "");
	}
	#e() {
		return this.querySelector("arq-catalog-nav-item[selected]");
	}
	#t() {
		let e = this.#e();
		this.shadowRoot.querySelector(".current-label").textContent = e ? e.textContent.trim() : this.label ?? "", this.shadowRoot.querySelector(".indicator").hidden = !e;
	}
	#n() {
		if (this.querySelector("arq-catalog-nav-group[open]")) return;
		let e = this.#e()?.closest("arq-catalog-nav-group");
		e && (e.open = !0);
	}
}).define();
//#endregion
//#region src/components/checkbox/checkbox.css?inline
var Ue = ":host{vertical-align:middle;max-width:100%;display:inline-flex}.row{align-items:center;gap:var(--arq-space-gap-sm);max-width:100%;padding-block:var(--arq-space-gap-xs);cursor:pointer;display:inline-flex;position:relative}.control{width:var(--arq-icon-md);height:var(--arq-icon-md);flex:none;justify-content:center;align-items:center;display:inline-flex}.box{box-sizing:border-box;width:var(--arq-icon-sm);height:var(--arq-icon-sm);border:var(--arq-border-default) solid var(--arq-color-icon-tertiary);border-radius:var(--arq-radius-control);background:var(--arq-color-surface-default)}.label{min-width:0;color:var(--arq-color-text-secondary)}.row:hover .box{border-color:var(--arq-color-icon-primary)}.row:hover .label{color:var(--arq-color-text-primary)}.native:checked+.control .box{border-color:var(--arq-color-action-primary);background:var(--arq-color-action-primary)}.row:hover .native:checked+.control .box{border-color:var(--arq-color-action-primary-hover);background:var(--arq-color-action-primary-hover)}:host([disabled]) .row{cursor:default}:host([disabled]) .box,:host([disabled]) .row:hover .box{border-color:var(--arq-color-icon-disabled)}:host([disabled]) .native:checked+.control .box{border-color:var(--arq-color-icon-disabled);background:var(--arq-color-icon-disabled)}:host([disabled]) .label,:host([disabled]) .row:hover .label{color:var(--arq-color-text-disabled)}.native:focus-visible+.control .box{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}";
(class extends d {
	static tag = "arq-checkbox";
	static styles = Ue;
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
var We = ":host{min-width:0;display:block}.row{border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle)}.header{box-sizing:border-box;justify-content:space-between;align-items:center;gap:var(--arq-space-gap-md);width:100%;padding:var(--arq-space-padding-md) 0;background:var(--arq-color-surface-transparent);color:var(--arq-color-text-primary);font:inherit;text-align:start;cursor:pointer;-webkit-tap-highlight-color:var(--arq-color-surface-transparent);border:0;margin:0;display:flex}:host([open]) .header{padding-bottom:var(--arq-space-gap-md)}.label{overflow-wrap:break-word;min-width:0}.icon-box{padding:var(--arq-space-padding-xs);border-radius:var(--arq-radius-control);background:var(--arq-color-surface-transparent);color:var(--arq-color-icon-primary);flex:none;display:inline-flex}.icon{width:var(--arq-icon-md);height:var(--arq-icon-md)}:host(:not([open])) [data-icon=minus],:host([open]) [data-icon=plus]{display:none}.options{align-items:flex-start;gap:var(--arq-space-gap-sm-md);padding-bottom:calc(var(--arq-space-padding-sm) + var(--arq-space-padding-md));flex-direction:column;display:flex}@media (hover:hover){.row:has(.header:hover){border-bottom-color:var(--arq-color-border-default)}.header:hover .icon-box{background:var(--arq-color-surface-hover)}}.row:has(.header:focus-visible){outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.header:focus{outline:none}";
(class extends d {
	static tag = "arq-filter-row";
	static styles = We;
	static properties = { open: { type: Boolean } };
	static template = `<div class="row"><button type="button" class="header"><span class="label role-body-xl"><slot name="label"></slot></span><span class="icon-box">${p("plus")}${p("minus")}</span></button><div class="options" role="group" part="panel"><slot></slot></div></div>`;
	setup() {
		this.disclosure = new g(this, {
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
//#region src/components/filter-panel/filter-panel.css?inline
var Ge = ":host{display:contents}.dialog{box-sizing:border-box;width:var(--arq-layout-filter-panel);border:var(--arq-border-default) solid var(--arq-color-border-default);border-radius:var(--arq-radius-control);background:var(--arq-color-surface-default);max-width:100%;height:100dvh;max-height:none;color:var(--arq-color-text-primary);margin:0;padding:0;inset:0 0 0 auto;overflow:hidden}.dialog::backdrop{background:var(--arq-color-overlay-scrim)}.sheet{box-sizing:border-box;gap:var(--arq-space-gap-lg);height:100%;padding:var(--arq-space-padding-xl-2xl);flex-direction:column;display:flex}.header{justify-content:space-between;align-items:center;gap:var(--arq-space-gap-md);display:flex}.titles{gap:var(--arq-space-gap-xs);flex-direction:column;min-width:0;display:flex}.title{color:var(--arq-color-text-primary)}.summary{color:var(--arq-color-text-secondary);margin:0}.applied{gap:var(--arq-space-gap-sm);flex-wrap:wrap;display:flex}.body{min-height:0;margin:calc(-1 * var(--arq-space-padding-xs));padding:var(--arq-space-padding-xs);overscroll-behavior:contain;flex:auto;overflow-y:auto}.footer{justify-content:space-between;align-items:center;gap:var(--arq-space-gap-lg);display:flex}@media (width<=767px){.dialog{border:0;width:100%;inset:0}.dialog::backdrop{background:var(--arq-color-surface-transparent)}.sheet{gap:var(--arq-space-gap-xl);padding:var(--arq-space-padding-lg) var(--arq-layout-gutter)}.footer{justify-content:flex-start}.apply{flex:auto}}", k = {
	productos: ["producto", "productos"],
	colecciones: ["colección", "colecciones"]
};
(class extends d {
	static tag = "arq-filter-panel";
	static styles = Ge;
	static properties = {
		open: { type: Boolean },
		count: { type: Number },
		unit: {
			type: String,
			values: ["productos", "colecciones"],
			default: "productos"
		}
	};
	static template = "<dialog class=\"dialog\"><div class=\"sheet\"><div class=\"header\"><div class=\"titles\"><div class=\"title role-heading-1\"><slot name=\"title\"></slot></div><p class=\"summary role-body\" hidden></p></div><arq-icon-button icon=\"close\" size=\"large\" class=\"close\">Cerrar filtros</arq-icon-button></div><div class=\"applied\" hidden></div><div class=\"body\"><slot></slot></div><div class=\"footer\"><arq-button type=\"underline\" show-underline class=\"clear\">Borrar todo</arq-button><arq-button class=\"apply\"></arq-button></div></div></dialog>";
	#e = null;
	#t = null;
	#n = null;
	setup() {
		let e = this.shadowRoot;
		this.#e = e.querySelector("dialog"), e.querySelector(".close").addEventListener("click", () => this.close()), e.querySelector(".clear").addEventListener("click", () => this.clear()), e.querySelector(".apply").addEventListener("click", () => this.apply()), this.#e.addEventListener("click", (e) => {
			e.target === this.#e && this.close();
		}), this.#e.addEventListener("cancel", (e) => {
			e.preventDefault(), this.close();
		}), e.querySelector(".applied").addEventListener("click", (e) => {
			let t = e.target.closest("arq-filter-chip");
			t && this.#d(t);
		}), this.addEventListener("arq:change", (e) => {
			e.target.localName === "arq-checkbox" && this.#s();
		}), e.querySelector("slot[name=\"title\"]").addEventListener("slotchange", () => this.#o()), this.#o(), this.#l();
	}
	update(e) {
		e.has("open") && (this.open && !this.#e.open && this.#r(), !this.open && this.#e.open && this.#i()), (e.has("count") || e.has("unit")) && this.#u();
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
		this.#n = e ?? this.#a(), this.open = !0;
	}
	close() {
		let e = this.#t;
		if (this.#t = null, e && [...e].some(([e, t]) => e.checked !== t)) {
			for (let [t, n] of e) t.checked = n;
			this.#s();
		} else this.#l();
		this.open = !1;
	}
	apply() {
		this.#t = null, this.emit("apply", { filters: this.filters }), this.open = !1;
	}
	clear() {
		for (let e of this.options) e.checked = !1;
		this.#s();
	}
	#r() {
		this.#t = new Map(this.options.map((e) => [e, e.checked])), this.#l(), this.#e.showModal();
	}
	#i() {
		this.#t && this.close(), this.#e.close(), this.#n?.focus?.(), this.#n = null;
	}
	#a() {
		let e = document.activeElement;
		for (; e?.shadowRoot?.activeElement;) e = e.shadowRoot.activeElement;
		let t = e?.getRootNode?.();
		return t instanceof ShadowRoot ? t.host : e;
	}
	#o() {
		let e = this.querySelector("[slot=\"title\"]")?.textContent.trim();
		this.#e.setAttribute("aria-label", e || "Filtrar");
	}
	#s() {
		this.#l(), this.emit("filters", { filters: this.filters });
	}
	#c() {
		return this.options.filter((e) => e.checked);
	}
	#l() {
		let e = this.#c(), t = this.shadowRoot, n = t.querySelector(".summary");
		n.hidden = e.length === 0, n.textContent = `${e.length} ${e.length === 1 ? "filtro activo" : "filtros activos"}`;
		let r = t.querySelector(".applied");
		for (r.hidden = e.length === 0; r.children.length > e.length;) r.lastElementChild.remove();
		for (; r.children.length < e.length;) r.append(document.createElement("arq-filter-chip"));
		e.forEach((e, t) => {
			let n = r.children[t];
			n.textContent = e.textContent.trim(), n.option = e;
		}), this.#u();
	}
	#u() {
		let e = this.shadowRoot.querySelector(".apply");
		if (!e) return;
		let [t, n] = k[this.unit] ?? k.productos;
		e.textContent = Number.isFinite(this.count) ? `Ver ${this.count} ${this.count === 1 ? t : n}` : `Ver ${n}`;
	}
	#d(e) {
		let t = [...this.shadowRoot.querySelectorAll(".applied arq-filter-chip")].indexOf(e);
		e.option.checked = !1, this.#s();
		let n = [...this.shadowRoot.querySelectorAll(".applied arq-filter-chip")];
		(n[t] ?? n[t - 1] ?? this.shadowRoot.querySelector(".close")).focus();
	}
}).define();
//#endregion
//#region src/components/toggle/toggle.css?inline
var Ke = ":host{vertical-align:middle;max-width:100%;display:inline-flex}.toggle{align-items:center;gap:var(--arq-space-gap-sm);cursor:pointer;max-width:100%;display:inline-flex;position:relative}.track{box-sizing:border-box;width:calc(var(--arq-space-padding-2xs) * 2 + var(--arq-icon-sm) * 2 + var(--arq-space-gap-sm));height:calc(var(--arq-space-padding-2xs) * 2 + var(--arq-icon-sm));padding:calc(var(--arq-space-padding-2xs) - var(--arq-border-default));border:var(--arq-border-default) solid var(--arq-color-border-strong);border-radius:var(--arq-radius-pill);background:var(--arq-color-surface-transparent);flex:none;align-items:center;display:inline-flex}.thumb{width:var(--arq-icon-sm);height:var(--arq-icon-sm);border-radius:var(--arq-radius-pill);background:var(--arq-color-icon-primary);transition-property:transform,color,background-color,border-color,outline-color,text-decoration-color,fill,stroke}.label{min-width:0;color:var(--arq-color-text-primary)}.toggle:hover .track{background:var(--arq-color-surface-hover)}.native:checked+.track{border-color:var(--arq-color-action-primary);background:var(--arq-color-action-primary)}.native:checked+.track .thumb{background:var(--arq-color-action-on-primary);transform:translateX(calc(var(--arq-icon-sm) + var(--arq-space-gap-sm)))}.toggle:hover .native:checked+.track{border-color:var(--arq-color-action-primary-hover);background:var(--arq-color-action-primary-hover)}:host([disabled]) .toggle{cursor:default}:host([disabled]) .track,:host([disabled]) .toggle:hover .track{border-color:var(--arq-color-border-disabled);background:var(--arq-color-surface-transparent)}:host([disabled]) .native:checked+.track{border-color:var(--arq-color-border-disabled);background:var(--arq-color-surface-strong)}:host([disabled]) .thumb,:host([disabled]) .native:checked+.track .thumb{background:var(--arq-color-icon-disabled)}:host([disabled]) .label{color:var(--arq-color-text-disabled)}.native:focus-visible+.track{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}";
(class extends d {
	static tag = "arq-toggle";
	static styles = Ke;
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
var qe = ":host{min-width:0;display:block}.bar{justify-content:space-between;align-items:center;gap:var(--arq-space-gap-md);padding-block:var(--arq-space-padding-md);border-block:var(--arq-border-default) solid var(--arq-color-border-subtle);display:flex}.count{min-width:0;color:var(--arq-color-text-secondary);white-space:nowrap;margin:0}.actions{align-items:center;gap:var(--arq-space-gap-xl);flex:none;display:flex}.lead{align-items:stretch;gap:var(--arq-space-gap-xl);display:flex}@media (width<=767px){.actions,.lead{gap:var(--arq-space-gap-lg)}}", Je = {
	productos: ["producto", "productos"],
	colecciones: ["colección", "colecciones"]
}, Ye = "arq:theme";
function Xe() {
	try {
		return localStorage.getItem(Ye);
	} catch {
		return null;
	}
}
function Ze(e) {
	try {
		localStorage.setItem(Ye, e);
	} catch {}
}
(class extends d {
	static tag = "arq-catalog-toolbar";
	static styles = qe;
	static properties = {
		count: { type: Number },
		unit: {
			type: String,
			values: ["productos", "colecciones"],
			default: "productos"
		},
		showIluminar: { type: Boolean },
		for: { type: String },
		filterCount: { type: Number }
	};
	static template = "<div class=\"bar\"><p class=\"count role-body\" aria-live=\"polite\"></p><div class=\"actions\"><div class=\"lead\"><arq-toggle show-label class=\"iluminar\">Iluminar</arq-toggle><arq-divider orientation=\"vertical\"></arq-divider></div><arq-button type=\"outline\" show-icon icon=\"filter\" count-label=\"filtros activos\" class=\"filter\">Filtrar</arq-button></div></div>";
	#e = null;
	#t = null;
	#n = null;
	setup() {
		let e = this.shadowRoot;
		if (this.#t = e.querySelector(".iluminar"), this.#n = e.querySelector(".filter"), this.#n.addEventListener("click", () => this.#u()), this.#t.addEventListener("arq:change", (e) => {
			e.stopPropagation(), this.#a(e.detail.checked, !0);
		}), this.showIluminar) {
			let e = Xe();
			(e === "dark" || e === "light") && this.#a(e === "dark", !1);
		}
		new MutationObserver(() => this.#o()).observe(document.documentElement, {
			attributes: !0,
			attributeFilter: ["data-arq-theme"]
		}), this.#o(), customElements.whenDefined("arq-button").then(() => this.#d());
	}
	update(e) {
		(e.has("count") || e.has("unit")) && this.#r(), e.has("showIluminar") && (this.shadowRoot.querySelector(".lead").hidden = !this.showIluminar), e.has("for") && this.#s(), e.has("filterCount") && this.#i();
	}
	#r() {
		let [e, t] = Je[this.unit] ?? Je.productos, n = this.shadowRoot.querySelector(".count");
		n.textContent = Number.isFinite(this.count) ? `${this.count} ${this.count === 1 ? e : t}` : "";
	}
	#i() {
		let e = Number.isFinite(this.filterCount) ? this.filterCount : 0, t = this.#n;
		t.showCount = e > 0, t.count = e > 0 ? e : null, t.icon = e > 0 ? "filter-off" : "filter";
	}
	#a(e, t) {
		let n = document.documentElement;
		e ? n.setAttribute("data-arq-theme", "dark") : n.removeAttribute("data-arq-theme"), t && Ze(e ? "dark" : "light");
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
var Qe = ":host{min-width:0;display:block}.card{gap:var(--arq-space-gap-md);flex-direction:column;display:flex}.card.is-small{gap:var(--arq-space-gap-sm)}.card-media{aspect-ratio:7/10;background:var(--arq-color-surface-subtle);position:relative}@media (hover:hover){.card:has(.card-link:hover) .card-media{outline:none}}.img{object-fit:cover;visibility:hidden;width:100%;height:100%;position:absolute;inset:0}.img.loaded{visibility:visible}.hover{opacity:0;transition-property:opacity,color,background-color,border-color,outline-color,text-decoration-color,fill,stroke;transition-duration:var(--arq-motion-duration-slow);transition-timing-function:var(--arq-motion-easing-standard)}.card.has-hover:has(.card-link:focus-visible) .hover{opacity:1}@media (hover:hover){.card.has-hover:has(.card-link:hover) .hover{opacity:1}}.fallback{padding:var(--arq-space-padding-md);color:var(--arq-color-text-secondary);text-align:center;overflow-wrap:break-word;justify-content:center;align-items:center;display:flex;position:absolute;inset:0}.info{align-items:flex-start;gap:var(--arq-space-gap-xs);padding-top:var(--arq-space-gap-xs);padding-bottom:var(--arq-space-gap-sm);flex-direction:column;display:flex}.title{align-items:center;gap:var(--arq-space-gap-sm);align-self:stretch;display:flex}.name{min-width:0;color:var(--arq-color-text-primary);overflow-wrap:break-word;flex:auto}.finishes{align-items:center;gap:var(--arq-space-gap-xs);flex:none;display:flex}.meta{-webkit-line-clamp:2;color:var(--arq-color-text-secondary);overflow-wrap:break-word;-webkit-box-orient:vertical;margin:0;display:-webkit-box;overflow:hidden}.meta[hidden]{display:none}.compare{z-index:var(--card-above);position:relative}", $e = matchMedia("(max-width: 767px)");
(class extends d {
	static tag = "arq-product-card";
	static styles = O + Qe;
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
	setup() {
		let e = this.shadowRoot;
		for (let t of e.querySelectorAll(".img")) t.addEventListener("load", () => t.classList.add("loaded")), t.addEventListener("error", () => {
			t.classList.remove("loaded"), t.classList.contains("base") && this.#s(!0);
		});
		let t = () => {
			this.#t || (this.#t = !0, this.#a());
		};
		e.querySelector(".card").addEventListener("pointerenter", t), e.querySelector(".card-link").addEventListener("focus", t);
		for (let t of [
			"name",
			"meta",
			"finishes"
		]) e.querySelector(`slot[name="${t}"]`).addEventListener("slotchange", () => this.#i());
		e.querySelector(".compare").addEventListener("arq:change", (e) => {
			e.stopPropagation(), this.compared = e.detail.checked, this.emit("compare", { checked: e.detail.checked });
		}), $e.addEventListener("change", () => this.#r()), D(this, "themeChanged");
	}
	themeChanged(e) {
		this.#e = e, this.#a();
	}
	update(e) {
		let t = this.shadowRoot;
		if (e.has("href")) {
			let e = t.querySelector(".card-link");
			this.href ? e.setAttribute("href", this.href) : e.removeAttribute("href");
		}
		let n = t.querySelector(".compare");
		n.hidden = !this.showCompare, n.checked = this.compared, e.has("size") && this.#r(), [...e].some((e) => e.startsWith("image")) && this.#a(), this.#i();
	}
	#n() {
		return this.size === "small" || $e.matches;
	}
	#r() {
		let e = this.#n(), t = this.shadowRoot;
		t.querySelector(".card").classList.toggle("is-small", e), t.querySelector(".name").className = `card-link name ${e ? "role-body-regular" : "role-heading-3"}`, t.querySelector(".meta").className = `meta ${e ? "role-body-sm" : "role-body"}`;
		for (let t of this.querySelectorAll(":scope > arq-swatch[slot=\"finishes\"]")) t.setAttribute("size", e ? "small" : "default");
	}
	#i() {
		let e = this.shadowRoot, t = (t) => e.querySelector(`slot[name="${t}"]`).assignedNodes({ flatten: !0 }).some((e) => e.nodeType === Node.ELEMENT_NODE || e.textContent.trim());
		e.querySelector(".meta").hidden = !t("meta"), e.querySelector(".finishes").hidden = !t("finishes"), e.querySelector(".fallback").textContent = this.querySelector("[slot=\"name\"]")?.textContent.trim() ?? "", this.#r();
	}
	#a() {
		let e = this.shadowRoot, t = e.querySelector(".base"), n = e.querySelector(".hover"), r = this.#e && this.imageLit || this.image, i = this.#e && this.imageHoverLit || this.imageHover;
		this.#o(t, r), this.#s(!r), e.querySelector(".card").classList.toggle("has-hover", !!(r && i)), this.#o(n, this.#t ? i : null);
	}
	#o(e, t) {
		e.getAttribute("src") !== (t ?? null) && (e.classList.remove("loaded"), t ? e.src = t : e.removeAttribute("src"));
	}
	#s(e) {
		this.shadowRoot.querySelector(".fallback").hidden = !e;
	}
}).define();
//#endregion
//#region src/components/compare-slot/compare-slot.css?inline
var et = ":host{min-width:0;display:block}.slot{align-items:center;gap:var(--arq-space-gap-sm-md);max-width:var(--arq-layout-compare-slot);display:flex}.thumb{width:var(--arq-layout-compare-thumb);height:var(--arq-layout-compare-thumb);background:var(--arq-color-surface-subtle);flex:none;justify-content:center;align-items:center;display:flex;position:relative;overflow:hidden}.thumb img{object-fit:cover;width:100%;height:100%;position:absolute;inset:0}.icon{width:var(--arq-icon-md);height:var(--arq-icon-md);color:var(--arq-color-icon-primary)}:host([filled]) .icon{display:none}.info{gap:var(--arq-space-gap-xs);flex-direction:column;flex:auto;min-width:0;display:flex}.name{color:var(--arq-color-text-primary);overflow-wrap:break-word}.meta,.empty{color:var(--arq-color-text-secondary);overflow-wrap:break-word}:host(:not([filled])) .name,:host(:not([filled])) .meta,.empty:empty{display:none}.remove{flex:none}:host([size=compact]) .slot{max-width:none}:host([size=compact]) .thumb{width:var(--arq-layout-compare-thumb-sm);aspect-ratio:7/10;height:auto}:host([size=compact]) .info{width:var(--arq-border-default);height:var(--arq-border-default);clip-path:inset(50%);white-space:nowrap;position:absolute;overflow:hidden}";
(class extends d {
	static tag = "arq-compare-slot";
	static styles = et;
	static properties = {
		size: {
			type: String,
			values: ["default", "compact"],
			default: "default"
		},
		filled: { type: Boolean },
		image: { type: String },
		sku: { type: String },
		emptyLabel: {
			type: String,
			default: "Agregar producto"
		}
	};
	static template = `<div class="slot"><span class="thumb"><img alt="" hidden>${p("plus")}</span><span class="info"><span class="name role-label"><slot name="name"></slot></span><span class="meta role-body-sm"><slot name="meta"></slot></span><span class="empty role-body-sm"></span></span><arq-icon-button icon="close" class="remove"></arq-icon-button></div>`;
	setup() {
		let e = this.shadowRoot, t = e.querySelector("img");
		t.addEventListener("load", () => t.hidden = !1), t.addEventListener("error", () => t.hidden = !0), e.querySelector(".remove").addEventListener("click", () => this.emit("remove", { sku: this.sku ?? null }));
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
		r.textContent = `Quitar ${t}`, r.hidden = !n || this.size === "compact";
	}
}).define();
//#endregion
//#region src/components/compare-bar/compare-bar.css?inline
var tt = ":host{display:contents}.bar{z-index:3;box-sizing:border-box;gap:var(--arq-space-gap-md);padding:var(--arq-space-padding-md) var(--arq-layout-gutter);border-top:var(--arq-border-default) solid var(--arq-color-border-default);background:var(--arq-color-surface-default);color:var(--arq-color-text-primary);flex-direction:column;display:flex;position:fixed;inset:auto 0 0}.head{justify-content:space-between;align-items:center;gap:var(--arq-space-gap-md);display:flex}.title{align-items:center;gap:var(--arq-space-gap-sm);margin:0;display:inline-flex}.row{justify-content:space-between;align-items:center;gap:var(--arq-space-gap-2xl);display:flex}.slots{align-items:stretch;gap:var(--arq-space-gap-lg);flex:auto;min-width:0;display:flex}.slots arq-compare-slot{flex:1 1 0;min-width:0}.actions{align-items:center;gap:var(--arq-space-gap-xl);flex:none;display:flex}.clear-mobile{display:none}@media (width<=767px){.bar{gap:var(--arq-space-gap-sm-md);padding-bottom:var(--arq-space-padding-lg);border-top-color:var(--arq-color-border-subtle)}.clear-mobile{display:inline-flex}.clear-desktop{display:none}.row{gap:var(--arq-space-gap-md)}.slots{gap:var(--arq-space-gap-sm);flex:none}.slots arq-compare-slot{flex:none}.actions,.go{flex:auto}}", A = "arq:compare", j = 3, nt = matchMedia("(max-width: 767px)");
function rt() {
	try {
		let e = JSON.parse(localStorage.getItem(A) ?? "[]");
		return Array.isArray(e) ? e.filter((e) => e && e.sku).slice(0, j) : [];
	} catch {
		return [];
	}
}
function it(e) {
	try {
		localStorage.setItem(A, JSON.stringify(e));
	} catch {}
}
(class extends d {
	static tag = "arq-compare-bar";
	static styles = tt;
	static properties = { href: {
		type: String,
		default: "/arq/comparativa"
	} };
	static template = "<section class=\"bar\" data-arq-theme=\"dark\" aria-label=\"Comparar productos\" hidden><div class=\"head\"><p class=\"title role-body-lg\"><span>Productos seleccionados</span><arq-count-badge class=\"count\"></arq-count-badge></p><arq-button type=\"underline\" show-underline class=\"clear clear-mobile\">Borrar todo</arq-button></div><div class=\"row\"><div class=\"slots\"></div><div class=\"actions\"><arq-button type=\"underline\" show-underline class=\"clear clear-desktop\">Borrar todo</arq-button><arq-button class=\"go\">Comparar</arq-button></div></div></section>";
	#e = rt();
	get items() {
		return [...this.#e];
	}
	set items(e) {
		this.#e = (Array.isArray(e) ? e : []).filter((e) => e && e.sku).slice(0, j), this.#t();
	}
	setup() {
		let e = this.shadowRoot;
		for (let t of e.querySelectorAll(".clear")) t.addEventListener("click", () => this.clear());
		e.querySelector(".slots").addEventListener("arq:remove", (e) => {
			e.stopPropagation(), this.remove(e.detail.sku);
		}), nt.addEventListener("change", () => this.#n()), addEventListener("storage", (e) => {
			e.key === A && (this.#e = rt(), this.#n(), this.emit("compare-change", { items: this.items }));
		}), this.#n();
	}
	update(e) {
		e.has("href") && this.#n();
	}
	add(e) {
		return !e?.sku || this.has(e.sku) || this.#e.length >= j ? !1 : (this.#e.push({
			sku: e.sku,
			name: e.name ?? "",
			meta: e.meta ?? "",
			image: e.image ?? ""
		}), this.#t(), !0);
	}
	remove(e) {
		let t = this.#e.length;
		this.#e = this.#e.filter((t) => t.sku !== e), this.#e.length !== t && this.#t();
	}
	clear() {
		this.#e.length && (this.#e = [], this.#t());
	}
	has(e) {
		return this.#e.some((t) => t.sku === e);
	}
	#t() {
		it(this.#e), this.#n(), this.emit("compare-change", { items: this.items });
	}
	#n() {
		let e = this.shadowRoot;
		if (!e.querySelector(".bar")) return;
		let t = this.#e;
		e.querySelector(".bar").hidden = t.length === 0, e.querySelector(".count").count = t.length;
		let n = nt.matches, r = e.querySelector(".slots"), i = [];
		for (let e = 0; e < j; e++) {
			if (e > 0 && !n) {
				let e = document.createElement("arq-divider");
				e.setAttribute("orientation", "vertical"), e.setAttribute("emphasis", "default"), i.push(e);
			}
			let r = t[e], a = document.createElement("arq-compare-slot");
			if (a.size = n ? "compact" : "default", r) {
				a.sku = r.sku, r.image && (a.image = r.image);
				let e = document.createElement("span");
				e.slot = "name", e.textContent = r.name;
				let t = document.createElement("span");
				t.slot = "meta", t.textContent = r.meta, a.append(e, t);
			}
			i.push(a);
		}
		r.replaceChildren(...i);
		let a = e.querySelector(".go"), o = t.map((e) => encodeURIComponent(e.sku)).join(",");
		a.href = `${this.href ?? "/arq/comparativa"}?sku=${o}`;
	}
}).define();
//#endregion
//#region src/components/compare-table/compare-table.css?inline
var at = ":host{min-width:0;display:block}.scroll{overscroll-behavior-x:contain;padding-inline:var(--arq-layout-gutter);overflow-x:auto}.scroll:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:calc(-1 * var(--arq-border-strong))}.table{border-collapse:collapse;table-layout:fixed;width:100%}th,td{background:var(--arq-color-bg-default);text-align:start;vertical-align:middle;font-weight:inherit;padding:0}.label-cell{width:var(--arq-layout-compare-label);padding-inline-end:var(--arq-space-gap-lg)}thead th,thead td{vertical-align:top;padding-block-end:var(--arq-space-gap-lg)}.product{padding-inline-end:var(--arq-space-gap-lg)}.mobile-name{color:var(--arq-color-text-primary);display:none}.group th{padding-block:var(--arq-space-gap-2xl) var(--arq-space-padding-sm-md);border-bottom:var(--arq-border-default) solid var(--arq-color-border-strong);color:var(--arq-color-text-primary)}.row>*{padding-block:var(--arq-space-padding-md);border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle)}.row-label{color:var(--arq-color-text-secondary);overflow-wrap:break-word}.value{padding-inline:var(--arq-space-padding-md) var(--arq-space-gap-lg);border-left:var(--arq-border-default) solid var(--arq-color-border-subtle);color:var(--arq-color-text-primary);overflow-wrap:break-word}@media (width<=767px){.scroll{padding-inline:0}.table{table-layout:auto;width:auto}.label-cell{z-index:1;min-width:var(--arq-layout-compare-label);max-width:var(--arq-layout-compare-label);box-sizing:content-box;padding-inline-start:var(--arq-layout-gutter);position:sticky;left:0}.value,.product{box-sizing:border-box;min-width:var(--arq-layout-compare-column);max-width:var(--arq-layout-compare-column)}.product{padding-inline-start:var(--arq-space-padding-md)}thead th .mobile-name{margin-top:var(--arq-space-gap-sm);display:block}.group th{padding-inline-start:var(--arq-layout-gutter)}.group-label{left:var(--arq-layout-gutter);position:sticky}}", M = (e) => String(e ?? "").replace(/[&<>"]/g, (e) => ({
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;"
})[e]), ot = 3, st = matchMedia("(max-width: 767px)");
(class extends d {
	static tag = "arq-compare-table";
	static styles = at;
	static properties = {
		onlyDifferences: { type: Boolean },
		label: {
			type: String,
			default: "Comparación de productos"
		}
	};
	static template = "<div class=\"scroll\" tabindex=\"0\" role=\"region\"><table class=\"table\"><thead></thead></table></div>";
	#e = {
		products: [],
		groups: []
	};
	get data() {
		return this.#e;
	}
	set data(e) {
		this.#e = {
			products: (e?.products ?? []).slice(0, ot),
			groups: e?.groups ?? []
		}, this.isConnected && this.#t();
	}
	setup() {
		let e = this.shadowRoot;
		e.querySelector(".table").addEventListener("arq:change", (e) => {
			e.target.localName === "arq-toggle" && (e.stopPropagation(), this.onlyDifferences = e.detail.checked);
		}), e.querySelector(".table").addEventListener("arq:remove", (e) => {
			e.stopPropagation(), this.emit("remove", { sku: e.detail.sku });
		}), st.addEventListener("change", () => this.#n()), this.#t();
	}
	update(e) {
		let t = this.shadowRoot;
		if (e.has("label") && t.querySelector(".scroll").setAttribute("aria-label", this.label ?? ""), e.has("onlyDifferences")) {
			let e = t.querySelector("arq-toggle");
			e && (e.checked = this.onlyDifferences), this.#r();
		}
	}
	#t() {
		let e = this.shadowRoot, t = e.querySelector(".table"), { products: n, groups: r } = this.#e, i = n.length;
		e.querySelector("thead").innerHTML = "<tr><td class=\"label-cell controls\"><arq-toggle show-label class=\"diff\">Solo diferencias</arq-toggle></td>" + n.map((e) => `<th scope="col" class="product"><arq-compare-slot sku="${M(e.sku)}"${e.image ? ` image="${M(e.image)}"` : ""}><span slot="name">${M(e.name)}</span><span slot="meta">${M(e.meta ?? e.sku)}</span></arq-compare-slot><span class="mobile-name role-label" aria-hidden="true">${M(e.name)}</span></th>`).join("") + "</tr>", e.querySelector("arq-toggle").checked = this.onlyDifferences;
		for (let e of t.querySelectorAll("tbody")) e.remove();
		for (let e of r) {
			let r = document.createElement("tbody");
			r.innerHTML = `<tr class="group"><th scope="colgroup" colspan="${i + 1}"><span class="group-label role-label">${M(e.label)}</span></th></tr>` + (e.rows ?? []).map((e) => {
				let t = n.map((t, n) => e.values?.[n] ?? "—");
				return `<tr class="row"${t.every((e) => String(e) === String(t[0])) ? " data-same" : ""}><th scope="row" class="label-cell row-label">${M(e.label)}</th>` + t.map((e) => `<td class="value role-body-lg-regular">${M(e)}</td>`).join("") + "</tr>";
			}).join(""), t.append(r);
		}
		this.#n(), this.#r();
	}
	#n() {
		let e = st.matches;
		for (let t of this.shadowRoot.querySelectorAll("thead arq-compare-slot")) t.size = e ? "compact" : "default";
		for (let t of this.shadowRoot.querySelectorAll(".row-label")) t.classList.toggle("role-body", !e), t.classList.toggle("role-body-sm", e);
	}
	#r() {
		let e = this.onlyDifferences;
		for (let t of this.shadowRoot.querySelectorAll("tbody")) {
			let n = 0;
			for (let r of t.querySelectorAll("tr.row")) r.hidden = e && r.hasAttribute("data-same"), r.hidden || n++;
			t.hidden = n === 0;
		}
	}
}).define();
//#endregion
//#region src/components/mega-link/mega-link.css?inline
var ct = ":host{min-width:0;display:block}.link{align-items:center;gap:var(--arq-space-gap-sm);padding-block:var(--arq-space-gap-sm);border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle);color:var(--arq-color-text-primary);text-decoration:none;display:flex}.link[href]:hover{background:var(--arq-color-surface-hover)}.link:focus-visible,.trigger:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.text{gap:var(--arq-space-gap-xs);flex-direction:column;flex:1;min-width:0;display:flex}.name{overflow-wrap:break-word}.meta{color:var(--arq-color-text-tertiary)}.arrow{color:var(--arq-color-icon-primary);flex:none;display:inline-flex}.icon{width:var(--arq-icon-md);height:var(--arq-icon-md)}.group{border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle)}.trigger{align-items:center;gap:var(--arq-space-gap-sm);width:100%;padding:var(--arq-space-gap-md) 0;color:var(--arq-color-text-primary);font:inherit;text-align:start;cursor:pointer;background:0 0;border:0;display:flex}.trigger:hover{background:var(--arq-color-surface-hover)}.trigger .name{flex:1;min-width:0}.toggle{color:var(--arq-color-icon-primary);flex:none;display:inline-flex}:host(:not([open])) [data-icon=minus],:host([open]) [data-icon=plus]{display:none}.links{padding-bottom:var(--arq-space-gap-md);flex-direction:column;align-items:flex-start;display:flex}::slotted(a){width:100%;padding-block:var(--arq-space-gap-sm);color:var(--arq-color-text-primary);font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-light);font-size:var(--arq-type-body-lg-size);line-height:var(--arq-type-body-lg-leading);letter-spacing:var(--arq-font-tracking-normal);text-decoration:none;display:block}::slotted(a:focus-visible){outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}::slotted(arq-button){margin-block:var(--arq-space-gap-sm)}", lt = `<a class="link"><span class="text"><span class="name role-body"><slot></slot></span><span class="meta role-caption"><slot name="meta"></slot></span></span><span class="arrow">${p("arrow-right")}</span></a>`, ut = `<div class="group"><button type="button" class="trigger"><span class="name role-body-xl"><slot></slot></span><span class="toggle">${p("plus")}${p("minus")}</span></button><div class="links"><slot name="links"></slot></div></div>`;
(class extends d {
	static tag = "arq-mega-link";
	static styles = ct;
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
		href: { type: String }
	};
	setup() {
		let e = this.shadowRoot, t = document.createElement("template");
		t.innerHTML = this.type === "group" ? ut : lt, e.append(t.content), this.type === "group" ? this.disclosure = new g(this, {
			trigger: e.querySelector(".trigger"),
			panel: e.querySelector(".links")
		}) : e.querySelector("slot[name=\"meta\"]").addEventListener("slotchange", () => this.#e());
	}
	focus(e) {
		let t = this.shadowRoot.querySelector(".link, .trigger");
		t ? t.focus(e) : super.focus(e);
	}
	update() {
		let e = this.shadowRoot.querySelector(".link");
		if (!e) return;
		this.href ? e.setAttribute("href", this.href) : e.removeAttribute("href"), this.shadowRoot.querySelector(".arrow").hidden = !this.showArrow;
		let t = e.querySelector(".name");
		t.classList.toggle("role-body", this.size !== "large"), t.classList.toggle("role-body-lg", this.size === "large"), this.#e();
	}
	#e() {
		let e = this.shadowRoot.querySelector("slot[name=\"meta\"]");
		e && (e.parentElement.hidden = !e.assignedNodes({ flatten: !0 }).some((e) => e.textContent.trim()));
	}
}).define();
//#endregion
//#region src/base/single-select.js
var dt = ["ArrowRight", "ArrowDown"], ft = ["ArrowLeft", "ArrowUp"], N = class {
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
		dt.includes(e.key) ? r = t[(n + 1) % t.length] : ft.includes(e.key) ? r = t[(n - 1 + t.length) % t.length] : e.key === "Home" ? r = t[0] : e.key === "End" && (r = t[t.length - 1]), r && (e.preventDefault(), r.focus(), r.choose?.());
	}
}, pt = ":host{cursor:pointer;flex:none;display:inline-flex}.tab{padding-bottom:var(--arq-space-gap-sm);border-bottom:var(--arq-border-default) solid var(--arq-color-surface-transparent);color:var(--arq-color-text-tertiary);white-space:nowrap;display:inline-flex}:host(:not([disabled]):hover) .tab{color:var(--arq-color-text-primary)}:host([selected]) .tab{border-bottom-color:var(--arq-color-border-strong);color:var(--arq-color-text-primary)}:host([disabled]){cursor:default}:host([disabled]) .tab{color:var(--arq-color-text-disabled)}:host(:focus-visible){outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}:host(:focus:not(:focus-visible)){outline:none}";
(class extends d {
	static tag = "arq-tab";
	static styles = pt;
	static properties = {
		selected: { type: Boolean },
		disabled: { type: Boolean },
		value: { type: String }
	};
	static template = "<span class=\"tab role-label\"><slot></slot></span>";
	setup() {
		this.selectable = new _(this, {
			role: "tab",
			state: "aria-selected"
		});
		let e = () => {
			let e = this.textContent.trim();
			e && this.setAttribute("aria-label", e);
		};
		this.shadowRoot.querySelector("slot").addEventListener("slotchange", e), e();
	}
}).define();
//#endregion
//#region src/components/mega-menu/mega-menu.css?inline
var mt = ":host{display:block}.menu{background:var(--arq-color-surface-default);border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle)}.tabs{gap:var(--arq-space-gap-xl);padding:var(--arq-space-gap-md) var(--arq-layout-gutter) 0;border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle);display:flex}.body{align-items:stretch;display:flex}.panels{flex:1;min-width:0;display:flex}.panel{gap:var(--arq-space-gap-md);min-width:0;padding:var(--arq-space-gap-xl) var(--arq-layout-gutter);flex-direction:column;flex:1;display:flex}.columns{gap:var(--arq-space-gap-xl);flex:1;display:flex}.column{justify-content:space-between;align-items:flex-start;gap:var(--arq-space-gap-md);flex-direction:column;flex:1;min-width:0;display:flex}.top{gap:var(--arq-space-gap-md);flex-direction:column;align-self:stretch;display:flex}.title{color:var(--arq-color-text-primary);margin:0}.links{flex-direction:column;align-self:stretch;display:flex}.panel--colecciones .column{justify-content:flex-start;align-items:stretch}.panel--colecciones .all{align-self:flex-start}.image{width:var(--arq-layout-mega-menu-image);aspect-ratio:4/5;background:var(--arq-color-surface-subtle);flex:none;position:relative}.image img{object-fit:cover;width:100%;height:100%;position:absolute;inset:0}", P = (e) => String(e ?? "").replace(/[&<>"]/g, (e) => ({
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;"
})[e]), ht = [
	{
		id: "aplicacion",
		label: "Aplicación"
	},
	{
		id: "lamparas",
		label: "Lámparas y artefactos"
	},
	{
		id: "colecciones",
		label: "Colecciones"
	}
], gt = 3, _t = 0;
(class extends d {
	static tag = "arq-mega-menu";
	static styles = mt;
	static properties = {
		tab: {
			type: String,
			values: ht.map((e) => e.id),
			default: "aplicacion"
		},
		label: {
			type: String,
			default: "Productos"
		}
	};
	static template = "<div class=\"menu\"><div class=\"tabs\" role=\"tablist\"></div><div class=\"body\"><div class=\"panels\"></div><div class=\"image\"><img alt=\"\" hidden></div></div></div>";
	#e = null;
	#t = {};
	#n = ++_t;
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
		this.#t = e ?? {}, this.#s();
	}
	setup() {
		let e = this.shadowRoot, t = e.querySelector(".tabs");
		this.select = new N(t, { items: "arq-tab" }), t.addEventListener("arq:change", (e) => {
			e.stopPropagation(), this.tab = e.detail.value;
		});
		let n = e.querySelector("img");
		n.addEventListener("load", () => n.hidden = !1), n.addEventListener("error", () => n.hidden = !0), this.#i();
	}
	update(e) {
		let t = this.shadowRoot;
		if (e.has("label") && t.querySelector(".tabs").setAttribute("aria-label", this.label ?? ""), e.has("tab")) {
			for (let e of t.querySelectorAll("arq-tab")) e.selected = e.value === this.tab;
			for (let e of t.querySelectorAll("[role=\"tabpanel\"]")) e.hidden = e.dataset.tab !== this.tab;
			this.#s();
		}
	}
	#r(e) {
		let t = this.#e?.sections ?? {};
		return e === "aplicacion" ? [t.exterior, t.interior].filter(Boolean) : e === "lamparas" ? [t.lamparas, t.artefactos].filter(Boolean) : [];
	}
	#i() {
		let e = this.shadowRoot, t = this.#e, n = ht.filter((e) => e.id === "colecciones" ? t?.collections?.length : this.#r(e.id).length);
		n.length && !n.some((e) => e.id === this.tab) && (this.tab = n[0].id);
		let r = (e) => ({
			tab: `mega-tab-${this.#n}-${e.id}`,
			panel: `mega-panel-${this.#n}-${e.id}`
		});
		e.querySelector(".tabs").innerHTML = n.map((e) => `<arq-tab id="${r(e).tab}" value="${e.id}" aria-controls="${r(e).panel}"${e.id === this.tab ? " selected" : ""}>${P(e.label)}</arq-tab>`).join(""), e.querySelector(".panels").innerHTML = n.map((e) => {
			let n = e.id === "colecciones" ? this.#o(t) : this.#a(this.#r(e.id));
			return `<div class="panel panel--${e.id}" role="tabpanel" id="${r(e).panel}" aria-labelledby="${r(e).tab}" data-tab="${e.id}"${e.id === this.tab ? "" : " hidden"}>${n}</div>`;
		}).join(""), this.select.refresh(), this.#s();
	}
	#a(e) {
		return "<div class=\"columns\">" + e.map((e) => `<div class="column"><div class="top"><p class="title role-heading-3">${P(e.label)}</p><div class="links">${e.links.map((e) => `<arq-mega-link href="${P(e.href)}" show-arrow>${P(e.label)}</arq-mega-link>`).join("")}</div></div><arq-button type="underline" show-underline href="${P(e.all.href)}">${P(e.all.label)}</arq-button></div>`).join("") + "</div>";
	}
	#o(e) {
		let t = e?.collections ?? [], n = Math.ceil(t.length / gt);
		return "<p class=\"title role-heading-3\">Colecciones</p><div class=\"columns\">" + Array.from({ length: gt }, (e, r) => t.slice(r * n, (r + 1) * n)).map((e) => `<div class="links column">${e.map((e) => `<arq-mega-link href="${P(e.href)}" show-arrow>${P(e.label)}<span slot="meta">${P(e.meta)}</span></arq-mega-link>`).join("")}</div>`).join("") + `</div><arq-button class="all" type="underline" show-underline href="${P(e?.allCollections?.href)}">${P(e?.allCollections?.label)}</arq-button>`;
	}
	#s() {
		let e = this.shadowRoot.querySelector("img"), t = this.#t[this.tab];
		t ? e.src = t : (e.removeAttribute("src"), e.hidden = !0);
	}
}).define();
//#endregion
//#region src/components/search-field/search-field.css?inline
var vt = ":host{min-width:0;display:block}.field{align-items:center;gap:var(--arq-space-gap-md);padding:var(--arq-space-gap-sm) var(--arq-space-padding-xs) var(--arq-space-gap-sm) var(--arq-space-padding-md);border:var(--arq-border-default) solid var(--arq-color-border-default);background:var(--arq-color-surface-default);display:flex}:host(:not([show-close])) .field{padding-inline-end:var(--arq-space-padding-md)}.field:focus-within{border-color:var(--arq-color-border-focus)}.input{min-width:0;color:var(--arq-color-text-primary);caret-color:var(--arq-color-text-primary);appearance:none;background:0 0;border:0;flex:1;margin:0;padding:0}.input::placeholder{color:var(--arq-color-text-tertiary);opacity:1}.input:focus{outline:none}.input::-webkit-search-cancel-button{appearance:none}.input::-webkit-search-decoration{appearance:none}.close{flex:none}";
(class extends d {
	static tag = "arq-search-field";
	static styles = vt;
	static properties = {
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
	static template = "<div class=\"field\"><input class=\"input role-body\" type=\"search\" autocomplete=\"off\" spellcheck=\"false\" enterkeyhint=\"search\"><arq-icon-button class=\"close\" icon=\"close\">Cerrar búsqueda</arq-icon-button></div><span class=\"visually-hidden\" aria-live=\"polite\"></span>";
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
//#region src/components/search-result/search-result.css?inline
var yt = ":host{min-width:0;display:block}.result{align-items:center;gap:var(--arq-space-gap-md);padding:var(--arq-space-gap-sm) var(--search-inline,var(--arq-space-padding-md));border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle);background:var(--arq-color-surface-default);color:var(--arq-color-text-primary);text-decoration:none;display:flex}.result[href]:hover,.result.active{background:var(--arq-color-surface-hover)}.result:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:calc(var(--arq-border-strong) * -1)}.thumb{width:var(--arq-layout-search-thumb);height:var(--arq-layout-search-thumb);background:var(--arq-color-surface-subtle);flex:none}.thumb img{object-fit:cover;width:100%;height:100%;display:block}.text{gap:var(--arq-space-gap-xs);flex-direction:column;flex:1;min-width:0;display:flex}.name,.meta{overflow-wrap:break-word}.meta{color:var(--arq-color-text-tertiary)}.arrow{color:var(--arq-color-icon-primary);flex:none;display:inline-flex}.icon{width:var(--arq-icon-md);height:var(--arq-icon-md)}";
(class extends d {
	static tag = "arq-search-result";
	static styles = yt;
	static properties = {
		href: { type: String },
		image: { type: String },
		active: { type: Boolean }
	};
	static template = `<a class="result"><span class="thumb"><img alt="" loading="lazy"></span><span class="text"><span class="name role-body-strong"><slot></slot></span><span class="meta role-body-sm"><slot name="meta"></slot></span></span><span class="arrow">${p("arrow-right")}</span></a>`;
	setup() {
		let e = this.shadowRoot.querySelector("img");
		e.addEventListener("error", () => e.parentElement.hidden = !0);
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
		this.image ? (n.getAttribute("src") !== this.image && (n.src = this.image), n.parentElement.hidden = !1) : (n.removeAttribute("src"), n.parentElement.hidden = !0);
	}
}).define();
//#endregion
//#region src/components/search-see-all/search-see-all.css?inline
var bt = ":host{min-width:0;display:block}.row{align-items:center;gap:var(--arq-space-gap-md);padding:var(--arq-space-gap-sm) var(--search-inline,var(--arq-space-padding-md));color:var(--arq-color-icon-tertiary);text-decoration:none;display:flex}.row[href]:hover{background:var(--arq-color-surface-hover)}.row:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:calc(var(--arq-border-strong) * -1)}.icon{width:var(--arq-icon-md);height:var(--arq-icon-md);flex:none}.text{min-width:0;color:var(--arq-color-text-tertiary);overflow-wrap:break-word;flex:1}.term{color:var(--arq-color-text-primary)}";
(class extends d {
	static tag = "arq-search-see-all";
	static styles = bt;
	static properties = {
		href: { type: String },
		term: {
			type: String,
			default: ""
		},
		count: { type: Number }
	};
	static template = `<a class="row">${p("search")}<span class="text role-body-sm"><span class="lead"></span><span class="term role-body-sm-medium"></span></span>${p("arrow-right")}</a>`;
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
var xt = ":host{min-width:0;display:block}.dropdown{background:var(--arq-color-surface-default);border:var(--arq-border-default) solid var(--arq-color-border-subtle)}.results{flex-direction:column;display:flex}.message{gap:var(--arq-space-gap-sm);padding:var(--arq-space-padding-md) var(--arq-space-padding-md);flex-direction:column;display:flex}.message p{margin:0}.title{color:var(--arq-color-text-primary)}.help{color:var(--arq-color-text-tertiary)}.explore{align-items:center;gap:var(--arq-space-gap-sm);padding:var(--arq-space-padding-sm) var(--arq-space-padding-md);border-top:var(--arq-border-default) solid var(--arq-color-border-subtle);color:var(--arq-color-text-tertiary);text-decoration:none;display:flex}.explore:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:calc(var(--arq-border-strong) * -1)}.explore .icon{width:var(--arq-icon-md);height:var(--arq-icon-md);color:var(--arq-color-icon-primary);flex:none}";
(class extends d {
	static tag = "arq-search-dropdown";
	static styles = xt;
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
	static template = `<div class="dropdown"><div class="results"><slot></slot></div><div class="empty"><div class="message"><p class="title role-body-strong"></p><p class="help role-body-sm">Probá con otro término, revisá la ortografía o buscá por código de producto (SKU).</p></div><a class="explore role-body-sm">Explorá nuestros productos${p("arrow-right")}</a></div></div>`;
	update() {
		let e = this.shadowRoot, t = this.state === "no-results";
		e.querySelector(".results").hidden = t, e.querySelector(".empty").hidden = !t, e.querySelector(".title").textContent = `No se encontraron resultados para “${this.term ?? ""}”`, e.querySelector(".explore").setAttribute("href", this.exploreHref ?? "/arq/productos");
	}
}).define();
//#endregion
//#region src/components/search-screen/search-screen.css?inline
var St = ":host{display:contents}.dialog{box-sizing:border-box;border-radius:var(--arq-radius-control);background:var(--arq-color-surface-default);width:100%;max-width:none;height:100dvh;max-height:none;color:var(--arq-color-text-primary);border:0;margin:0;padding:0;inset:0}.screen{flex-direction:column;height:100%;display:flex}.header{align-items:center;gap:var(--arq-space-gap-sm);padding:var(--arq-space-gap-md) var(--arq-layout-gutter);border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle);flex:none;display:flex}.field{flex:1}.content{overscroll-behavior:contain;--search-inline:var(--arq-layout-gutter);flex:1;overflow-y:auto}";
(class extends d {
	static tag = "arq-search-screen";
	static styles = St;
	static properties = {
		open: { type: Boolean },
		label: {
			type: String,
			default: "Buscar"
		}
	};
	static template = "<dialog class=\"dialog\"><div class=\"screen\"><div class=\"header\"><arq-icon-button class=\"back\" icon=\"chevron-left\">Volver</arq-icon-button><arq-search-field class=\"field\"></arq-search-field></div><div class=\"content\"><slot></slot></div></div></dialog>";
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
//#region src/config.js
var F = {
	BASE_URL: "/",
	DEV: !1,
	MODE: "production",
	PROD: !0,
	SSR: !1,
	VITE_DATA_SOURCE: "mock",
	VITE_N8N_WEBHOOK_URL: "",
	VITE_TYPESENSE_COLLECTION: "macroled_arq",
	VITE_TYPESENSE_HOST: "https://typesense.coresagroup.com",
	VITE_TYPESENSE_SEARCH_KEY: "87MlPgGKNghOVMpUQZnlsI9PRNqScWRu"
}, Ct = Object.freeze({
	typesense: Object.freeze({
		host: F.VITE_TYPESENSE_HOST ?? "",
		searchKey: F.VITE_TYPESENSE_SEARCH_KEY ?? "",
		collection: F.VITE_TYPESENSE_COLLECTION ?? ""
	}),
	n8n: Object.freeze({ webhookUrl: F.VITE_N8N_WEBHOOK_URL ?? "" })
}), I = 250, L = /* @__PURE__ */ new Map(), wt = class extends Error {
	constructor(e, t) {
		super(`Typesense ${e}: ${t}`), this.name = "TypesenseError", this.status = e;
	}
};
function Tt() {
	let { host: e, searchKey: t, collection: n } = Ct.typesense;
	return !!(e && t && n);
}
async function Et(e, { signal: t } = {}) {
	if (!Tt()) throw new wt(0, "falta configurar VITE_TYPESENSE_* en .env");
	let { host: n, searchKey: r, collection: i } = Ct.typesense, a = new URLSearchParams({
		q: "*",
		...e
	}), o = `${n.replace(/\/$/, "")}/collections/${encodeURIComponent(i)}/documents/search?${a}`;
	if (L.has(o)) return L.get(o);
	let s = fetch(o, {
		headers: { "X-TYPESENSE-API-KEY": r },
		signal: t
	}).then(async (e) => {
		let t = await e.json().catch(() => ({}));
		if (!e.ok) throw new wt(e.status, t.message ?? e.statusText);
		return t;
	});
	return L.set(o, s), s.catch(() => L.delete(o)), s;
}
async function Dt(e = {}, t) {
	let n = await Et(e, t);
	return {
		hits: (n.hits ?? []).map((e) => e.document),
		found: n.found ?? 0,
		facets: Object.fromEntries((n.facet_counts ?? []).map((e) => [e.field_name, e.counts.map(({ value: e, count: t }) => ({
			value: e,
			count: t
		}))]))
	};
}
async function Ot(e = {}, t) {
	let n = await Dt({
		...e,
		per_page: I,
		page: 1
	}, t), r = Math.ceil(n.found / I);
	return [n, ...await Promise.all(Array.from({ length: Math.max(0, r - 1) }, (n, r) => Dt({
		...e,
		per_page: I,
		page: r + 2
	}, t)))].flatMap((e) => e.hits);
}
Object.freeze([
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
]);
var R = (e, t, n = {}) => Object.freeze({
	label: e,
	section: t,
	control: "tiles",
	...n
}), z = Object.freeze({
	potencia: R("Potencia", "luminicas", { filter: !0 }),
	flujo_luminoso: R("Flujo luminoso", "luminicas"),
	lumenes_lmw: R("Eficiencia luminosa", "luminicas"),
	temperatura_color: R("Temperatura de color", "luminicas", { filter: !0 }),
	cri: R("CRI", "luminicas"),
	angulo_apertura: R("Ángulo de apertura", "luminicas"),
	ugr: R("UGR", "luminicas"),
	sdcm: R("SDCM", "luminicas"),
	tipo_led: R("Tipo de LED", "luminicas"),
	vida_util: R("Vida útil", "luminicas"),
	tension_proveedor: R("Tensión de entrada", "electricas"),
	factor_potencia: R("Factor de potencia", "electricas"),
	thd: R("THD", "electricas"),
	dimeable: R("Dimerizable", "electricas"),
	tipo_driver: R("Driver", "electricas"),
	emc: R("EMC", "electricas"),
	color_carcasa: R("Color", "materiales", {
		control: "swatches",
		column: "Color de carcasa"
	}),
	altura: R("Altura", "materiales", { column: "Altura" }),
	tamanio: R("Medidas", "materiales"),
	material_cuerpo: R("Material del cuerpo", "materiales"),
	material_lente: R("Material de la lente", "materiales"),
	largo_cable: R("Largo de cable", "materiales"),
	peso: R("Peso", "materiales"),
	proteccion_ip: R("Grado de protección", "instalacion"),
	proteccion_ik: R("Resistencia al impacto", "instalacion"),
	tipo_montaje: R("Montaje", "instalacion"),
	temperatura_operacion: R("Temperatura de operación", "instalacion"),
	garantia_proveedor: R("Garantía", "comercial")
});
function kt(e) {
	return z[e] ?? {
		label: e,
		control: "tiles"
	};
}
var At = Object.freeze(Object.keys(z).filter((e) => z[e].filter));
function jt(e) {
	return (Array.isArray(e) ? e : String(e ?? "").split(",")).map((e) => e.trim()).filter(Boolean).map((e) => {
		let t = Object.keys(z).find((t) => z[t].column === e);
		return t || console.warn(`[arq] variant_attributes: la columna «${e}» no está en src/data/attributes.js`), t;
	}).filter(Boolean);
}
//#endregion
//#region src/data/typesense-adapter.js
var B = {
	group: "product_group_id",
	name: "product_name",
	collection: "collection_id",
	collectionName: "collection_name",
	productType: "product_type",
	environment: "environment",
	application: "application",
	isDefault: "is_group_default",
	variantAttributes: "variant_attributes",
	description: "description",
	story: "product_story_text",
	inspiration: "product_inspiration_text",
	collectionIntro: "collection_intro_text",
	collectionDescription: "collection_description_text",
	video: "video_inspiration"
}, Mt = [
	"ies",
	"cad",
	"manual",
	"fotometria"
], V = (e) => e == null ? "" : String(e).trim(), Nt = (e) => Array.isArray(e) ? e : V(e) ? V(e).split(",").map((e) => e.trim()) : [];
function Pt(e) {
	return {};
}
function Ft(e) {
	return {};
}
function It(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) {
		let e = V(n[B.group]) || n.sku;
		t.has(e) || t.set(e, []), t.get(e).push(n);
	}
	let n = /* @__PURE__ */ new Map(), r = [...t].map(([e, t]) => {
		let r = t.find((e) => e[B.isDefault] === !0) ?? t[0], i = V(r[B.collection]) || null;
		return i && !n.has(i) && n.set(i, {
			id: i,
			name: V(r[B.collectionName]) || i,
			intro: V(r[B.collectionIntro]),
			description: V(r[B.collectionDescription]),
			images: {}
		}), {
			id: e,
			name: V(r[B.name]) || r.sku,
			collection: i,
			productType: V(r[B.productType]) || null,
			environment: Nt(r[B.environment]),
			application: V(r[B.application]) || null,
			variantAttributes: jt(r[B.variantAttributes]),
			story: V(r[B.story]),
			inspiration: V(r[B.inspiration]),
			video: V(r[B.video]),
			images: Ft(t),
			specs: {},
			variants: t.map((e) => ({
				sku: e.sku,
				isDefault: e === r,
				description: V(e[B.description]),
				attributes: Object.fromEntries(Object.keys(z).map((t) => [t, V(e[t])]).filter(([, e]) => e && e !== "-")),
				images: Pt(e),
				downloads: Object.fromEntries(Mt.map((t) => [t, V(e[t])]).filter(([, e]) => e))
			}))
		};
	});
	return {
		collections: [...n.values()],
		groups: r
	};
}
//#endregion
//#region src/data/source.js
async function Lt() {
	return It(await Ot({ q: "*" }));
}
//#endregion
//#region src/data/catalog.js
var H = null;
function U() {
	return H ??= Lt().then(Rt), H.catch(() => H = null), H;
}
function Rt({ collections: e, groups: t }) {
	let n = new Map(e.map((e) => [e.id, e]));
	for (let e of t) {
		e.collectionData = n.get(e.collection) ?? null;
		for (let t of e.variants) t.values = {
			...e.specs,
			...t.attributes
		};
		e.defaultVariant = e.variants.find((e) => e.isDefault) ?? e.variants[0];
	}
	return {
		collections: e,
		groups: t,
		collectionById: n,
		groupById: new Map(t.map((e) => [e.id, e]))
	};
}
var zt = (e, t) => `/arq/producto/${encodeURIComponent(e)}${t ? `?sku=${encodeURIComponent(t)}` : ""}`, W = (e) => `/arq/coleccion/${encodeURIComponent(e)}`;
function G({ environment: e, application: t, productType: n } = {}) {
	let r = new URLSearchParams();
	e && r.set("environment", e), t && r.set("application", t), n && r.set("product_type", n);
	let i = r.toString();
	return `/arq/productos${i ? `?${i}` : ""}`;
}
var K = (e) => e != null && String(e).trim() !== "";
function Bt(e, t) {
	return Object.entries(t).every(([t, n]) => !n?.length || n.includes(e.values[t]));
}
function Vt(e, t) {
	return [e.defaultVariant, ...e.variants.filter((t) => t !== e.defaultVariant)].find((e) => Bt(e, t)) ?? null;
}
function Ht(e, { environment: t, application: n, productType: r, collection: i } = {}) {
	return !(t && !e.environment.includes(t) || n && e.application !== n || r && e.productType !== r || i && e.collection !== i);
}
var Ut = (e = {}) => Object.fromEntries(Object.entries(e).filter(([, e]) => e?.length));
function Wt(e) {
	return At.map((t) => {
		let n = /* @__PURE__ */ new Map();
		for (let r of e) for (let e of new Set(r.variants.map((e) => e.values[t]).filter(K))) n.set(e, (n.get(e) ?? 0) + 1);
		let r = [...n].map(([e, t]) => ({
			value: e,
			count: t
		})).sort((e, t) => String(e.value).localeCompare(String(t.value), "es", { numeric: !0 }));
		return {
			name: t,
			label: kt(t).label,
			options: r
		};
	}).filter((e) => e.options.length > 1);
}
function Gt(e) {
	return e.productType && e.productType !== "Luminaria" ? e.productType : [e.environment.join(" · "), e.application].filter(Boolean).join(" · ");
}
var Kt = Object.keys(z).filter((e) => z[e].control === "swatches"), qt = (e) => [...new Set(e.variants.flatMap((e) => Kt.map((t) => e.values[t])).filter(K))];
function q(e, t = e.defaultVariant, n = !1) {
	let r = {
		...e.defaultVariant.images,
		...Jt(t.images)
	};
	return {
		id: e.id,
		sku: t.sku,
		name: e.name,
		meta: Gt(e),
		finishes: qt(e),
		href: zt(e.id, n && t !== e.defaultVariant ? t.sku : null),
		image: r.studio ?? null,
		imageHover: r.context ?? null,
		imageLit: r.studioOn ?? null,
		imageHoverLit: r.contextOn ?? null
	};
}
var Jt = (e = {}) => Object.fromEntries(Object.entries(e).filter(([, e]) => K(e) && (!Array.isArray(e) || e.length)));
function Yt(e, t) {
	let n = [...new Set(t.map((e) => e.application).filter(Boolean))], r = e.images ?? {};
	return {
		id: e.id,
		name: e.name,
		meta: n.join(" · "),
		href: W(e.id),
		image: r.studio ?? null,
		imageHover: r.context ?? null,
		imageLit: r.studioOn ?? null,
		imageHoverLit: r.contextOn ?? null
	};
}
async function Xt({ filters: e, ...t } = {}) {
	let { groups: n } = await U(), r = n.filter((e) => Ht(e, t)), i = Ut(e), a = Object.keys(i).length > 0, o = r.flatMap((e) => {
		let t = Vt(e, i);
		return t ? [q(e, t, a)] : [];
	});
	return {
		cards: o,
		count: o.length,
		filters: Wt(r)
	};
}
async function Zt({ filters: e } = {}) {
	let { collections: t, groups: n } = await U(), r = Ut(e), i = t.flatMap((e) => {
		let t = n.filter((t) => t.collection === e.id);
		return t.some((e) => Vt(e, r)) ? [Yt(e, t)] : [];
	});
	return {
		cards: i,
		count: i.length,
		filters: Wt(n.filter((e) => e.collection))
	};
}
async function Qt(e) {
	let { groupById: t } = await U();
	return e.map((e) => t.get(e)).filter(Boolean).map((e) => q(e));
}
var J = (e) => String(e ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
async function $t(e, { limit: t = 5 } = {}) {
	let n = J(e).split(/\s+/).filter(Boolean);
	if (!n.length) return {
		results: [],
		total: 0
	};
	let { groups: r, collections: i } = await U(), a = (e) => n.every((t) => J(e).includes(t)), o = r.flatMap((e) => {
		let t = e.variants.find((e) => a(e.sku));
		if (!t && !a([
			e.name,
			e.collectionData?.name,
			e.application,
			e.productType,
			...e.environment
		].join(" "))) return [];
		let n = q(e, t ?? e.defaultVariant, !!t);
		return [{
			name: e.name,
			meta: (t ?? e.defaultVariant).sku,
			href: n.href,
			image: n.image
		}];
	}), s = i.filter((e) => a(e.name)).map((e) => ({
		name: e.name,
		meta: "Colección",
		href: W(e.id),
		image: e.images?.studio ?? null
	})), c = [...o, ...s];
	return {
		results: c.slice(0, t),
		total: c.length
	};
}
var en = (e) => `/arq/buscar?q=${encodeURIComponent(e)}`;
async function tn() {
	let { groups: e, collections: t } = await U(), n = (t) => e.filter((e) => Ht(e, t)).length, r = (e, t) => ({
		label: e,
		href: G(t),
		count: n(t)
	}), i = (t, n) => {
		let i = [
			...[...new Set(e.filter((e) => e.productType === "Luminaria" && e.environment.includes(t)).map((e) => e.application).filter(Boolean))].map((e) => r(e, {
				environment: t,
				application: e,
				productType: "Luminaria"
			})),
			r("Artefactos", {
				environment: t,
				productType: "Artefacto"
			}),
			r("Lámparas", {
				environment: t,
				productType: "Lámpara"
			})
		].filter((e) => e.count);
		return i.length ? {
			id: J(t),
			label: t,
			href: G({ environment: t }),
			all: {
				label: n,
				href: G({ environment: t })
			},
			links: i
		} : null;
	}, a = (t, n, r) => {
		let i = e.filter((e) => e.productType === t).map((e) => ({
			label: e.name,
			href: zt(e.id),
			count: 1
		}));
		return i.length ? {
			id: J(n),
			label: n,
			href: G({ productType: t }),
			all: {
				label: r,
				href: G({ productType: t })
			},
			links: i
		} : null;
	};
	return {
		sections: {
			exterior: i("Exterior", "Ver todo Exterior"),
			interior: i("Interior", "Ver todo Interior"),
			lamparas: a("Lámpara", "Lámparas", "Ver todas las lámparas"),
			artefactos: a("Artefacto", "Artefactos", "Ver todos los artefactos")
		},
		collections: t.map((t) => ({
			label: t.name,
			meta: [...new Set(e.filter((e) => e.collection === t.id).map((e) => e.application ?? e.productType).filter(Boolean))].join(" · "),
			href: W(t.id)
		})).filter((e) => e.meta),
		allCollections: {
			label: "Ver todas las colecciones",
			href: "/arq/colecciones"
		}
	};
}
//#endregion
//#region src/components/nav-link/nav-link.css?inline
var nn = ":host{vertical-align:middle;max-width:100%;display:inline-flex}.link{box-sizing:border-box;align-items:center;gap:var(--arq-space-gap-sm);background:var(--arq-color-surface-transparent);max-width:100%;color:var(--arq-color-text-primary);font:inherit;text-align:start;cursor:pointer;-webkit-tap-highlight-color:var(--arq-color-surface-transparent);border:0;margin:0;padding:0;text-decoration:none;display:inline-flex;position:relative}.label{white-space:nowrap;min-width:0}.indicator{width:var(--arq-space-gap-sm);height:var(--arq-border-strong);background:var(--arq-color-border-strong);flex:none;display:none}.current .indicator{display:block}.chevron{flex:none;display:none}:host([has-dropdown]) .chevron{display:inline-flex}.chevron .icon{width:var(--arq-icon-sm);height:var(--arq-icon-sm)}[aria-expanded=true] .chevron .icon{transform:rotate(180deg)}.trailing{display:none}.link:after{content:\"\";inset-inline:0;top:calc(100% + var(--arq-space-padding-2xs) - var(--arq-border-default));height:var(--arq-border-default);background:var(--arq-color-border-strong);visibility:hidden;position:absolute}.link:not(.current):not([aria-expanded=true]):hover:after{visibility:visible}.link:active{color:var(--arq-color-text-tertiary)}.link:active:after{visibility:hidden}.link:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.link:focus:not(:focus-visible){outline:none}@media (width>=768px){:host([theme=inverse]) .link,:host([theme=inverse]) .link:active{color:var(--arq-color-text-inverse)}:host([theme=inverse]) .indicator,:host([theme=inverse]) .link:after{background:var(--arq-color-icon-inverse)}:host([theme=inverse]) .chevron{color:var(--arq-color-icon-inverse)}}@media (width<=767px){:host{width:100%;display:flex}.link{width:100%;padding:var(--arq-space-gap-md) var(--arq-layout-gutter)}.label{white-space:normal;flex:1}:host([has-dropdown]) .chevron{display:none}.trailing{flex:none;display:inline-flex}.trailing .icon{width:var(--arq-icon-md);height:var(--arq-icon-md)}.trailing [data-icon=arrow-right],.current .trailing [data-icon=chevron-right]{display:none}.current .trailing [data-icon=arrow-right]{display:block}.link:after{display:none}.link:active{background:var(--arq-color-surface-selected);color:var(--arq-color-text-primary)}@media (hover:hover){.link:not(:active):hover{background:var(--arq-color-surface-hover)}}.link:focus-visible{outline-offset:calc(var(--arq-border-strong) * -1)}}", Y = matchMedia("(max-width: 767px)");
(class extends d {
	static tag = "arq-nav-link";
	static styles = nn;
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
	static template = `<a class="link"><span class="indicator" aria-hidden="true"></span><span class="label role-body"><slot></slot></span><span class="chevron">${p("chevron-down")}</span><span class="trailing">${p("chevron-right")}${p("arrow-right")}</span></a>`;
	#e = null;
	setup() {
		this.#e = this.shadowRoot.querySelector(".link");
		let e = this.shadowRoot.querySelector(".label"), t = () => {
			e.classList.toggle("role-body", !Y.matches), e.classList.toggle("role-body-xl", Y.matches);
		};
		Y.addEventListener("change", t), t();
	}
	focus(e) {
		this.#e ? this.#e.focus(e) : super.focus(e);
	}
	update(e) {
		e.has("hasDropdown") && this.#t();
		let t = this.#e;
		t.localName === "a" ? (this.href === null ? t.removeAttribute("href") : t.setAttribute("href", this.href), this.current ? t.setAttribute("aria-current", "page") : t.removeAttribute("aria-current")) : t.setAttribute("aria-expanded", String(this.open)), t.classList.toggle("current", this.current);
	}
	#t() {
		let e = this.hasDropdown ? "button" : "a", t = this.#e;
		if (t.localName === e) return;
		let n = document.createElement(e);
		n.className = t.className, e === "button" && (n.type = "button", n.addEventListener("click", () => this.emit("toggle", { open: !this.open }))), n.append(...t.childNodes), t.replaceWith(n), this.#e = n;
	}
}).define();
//#endregion
//#region src/components/navbar/navbar.css?inline
var rn = ":host{z-index:4;display:block;position:sticky;top:0}:host([theme=transparent]){position:fixed;inset-inline:0}.navbar{position:relative}.bar{box-sizing:border-box;justify-content:space-between;align-items:center;gap:var(--arq-space-gap-xl);height:calc(var(--arq-space-gap-md) * 2 + var(--arq-icon-xl));padding:0 var(--arq-layout-gutter);border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle);background:var(--arq-color-surface-default);color:var(--arq-color-text-primary);display:flex}.over-photo .bar{background:var(--arq-color-overlay-translucent);-webkit-backdrop-filter:blur(var(--arq-blur-backdrop))}.over-photo .logo{color:var(--arq-color-text-inverse)}.over-photo .search-open,.over-photo .actions arq-icon-button{color:var(--arq-color-icon-inverse)}.logo{flex:none}.right{align-items:center;gap:var(--arq-space-gap-xl);min-width:0;display:flex}.links{align-items:center;gap:var(--arq-space-gap-xl);display:flex}.search{align-items:center;display:flex;position:relative}.search-box{width:var(--arq-layout-search-field);position:relative}.search-dropdown{top:100%;position:absolute;inset-inline:0}.actions{display:none}.mega{top:100%;position:absolute;inset-inline:0}.menu{box-sizing:border-box;border-radius:var(--arq-radius-control);background:var(--arq-color-surface-default);width:100%;max-width:none;height:100dvh;max-height:none;color:var(--arq-color-text-primary);overscroll-behavior:contain;border:0;margin:0;padding:0;inset:0}.menu-bar{box-sizing:border-box;height:calc(var(--arq-space-gap-md) * 2 + var(--arq-icon-xl));padding:0 var(--arq-layout-gutter);border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle);justify-content:space-between;align-items:center;display:flex}.menu-main{padding-block:var(--arq-space-gap-sm);flex-direction:column;display:flex}.menu-products{padding:var(--arq-space-gap-sm) 0 var(--arq-space-gap-xl);flex-direction:column;display:flex}.back{align-items:center;gap:var(--arq-space-gap-xs);padding:var(--arq-space-gap-sm) var(--arq-layout-gutter);color:var(--arq-color-text-secondary);text-align:start;cursor:pointer;background:0 0;border:0;display:flex}.back .icon{box-sizing:content-box;width:var(--arq-icon-md);height:var(--arq-icon-md);padding:var(--arq-space-padding-xs);color:var(--arq-color-icon-primary)}.back:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:calc(var(--arq-border-strong) * -1)}.groups{padding:var(--arq-space-gap-md) var(--arq-layout-gutter) var(--arq-space-padding-md);flex-direction:column;display:flex}.collections{padding:var(--arq-space-gap-md) var(--arq-layout-gutter) 0}@media (width<=767px){.right{display:contents}.links,.search{display:none}.actions{align-items:center;gap:var(--arq-space-gap-sm);display:flex}}", X = matchMedia("(max-width: 767px)"), Z = (e) => String(e ?? "").replace(/[&<>"]/g, (e) => ({
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;"
})[e]), an = 5, on = 150;
(class extends d {
	static tag = "arq-navbar";
	static styles = rn;
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
				"products"
			],
			default: "default"
		},
		label: {
			type: String,
			default: "Principal"
		}
	};
	static template = `<header class="navbar"><nav class="bar"><arq-logo class="logo"></arq-logo><div class="right"><div class="links"><slot name="links"></slot></div><div class="search"><arq-icon-button class="search-open" icon="search">Buscar</arq-icon-button><div class="search-box" hidden><arq-search-field class="search-field" show-close></arq-search-field><arq-search-dropdown class="search-dropdown" hidden></arq-search-dropdown></div></div><div class="actions"><arq-icon-button class="search-open-mobile" icon="search">Buscar</arq-icon-button><arq-icon-button class="menu-open" icon="menu">Abrir menú</arq-icon-button></div></div></nav><arq-mega-menu class="mega" hidden></arq-mega-menu></header><dialog class="menu"><div class="menu-bar"><arq-logo class="menu-logo" size="small"></arq-logo><arq-icon-button class="menu-close" icon="close" background="subtle">Cerrar menú</arq-icon-button></div><div class="menu-main"></div><div class="menu-products" hidden><button type="button" class="back role-body-medium">${p("chevron-left")}<span>Productos</span></button><div class="groups"></div><div class="collections"></div></div></dialog><arq-search-screen class="search-screen"></arq-search-screen>`;
	#e = null;
	#t = null;
	#n = [];
	#r = -1;
	#i = 0;
	#a = "";
	get navigation() {
		return this.#e;
	}
	set navigation(e) {
		this.#e = e, this.#g();
	}
	setup() {
		let e = this.shadowRoot;
		this.#s(), X.addEventListener("change", () => {
			this.#p(), this.#s();
		}), this.addEventListener("arq:toggle", (e) => {
			e.target.localName === "arq-nav-link" && (e.stopPropagation(), X.matches ? this.#l("products") : this.#m(e.detail.open));
		}), e.querySelector(".search-open").addEventListener("click", () => this.#l("search"));
		let t = e.querySelector(".search-field");
		t.addEventListener("arq:close", (t) => {
			t.stopPropagation(), this.#l("default"), e.querySelector(".search-open").focus();
		}), e.querySelector(".search-box").addEventListener("keydown", (t) => {
			t.key === "Escape" && (t.stopPropagation(), e.querySelector(".search-dropdown").hidden ? (this.#l("default"), e.querySelector(".search-open").focus()) : this.#y(!1));
		});
		let n = e.querySelector(".search-screen");
		e.querySelector(".search-open-mobile").addEventListener("click", (e) => {
			this.#l("search"), n.show(e.currentTarget);
		}), n.addEventListener("arq:close", (e) => {
			e.stopPropagation(), this.#l("default");
		});
		for (let e of [t, n]) e.addEventListener("arq:input", (e) => {
			e.stopPropagation(), this.#_(e.detail.value);
		}), e.addEventListener("arq:navigate", (e) => {
			e.stopPropagation(), this.#S(e.detail.step);
		}), e.addEventListener("arq:submit", (e) => {
			e.stopPropagation(), this.#w(e.detail.value);
		});
		let r = e.querySelector(".menu");
		e.querySelector(".menu-open").addEventListener("click", () => this.#l("menu")), e.querySelector(".menu-close").addEventListener("click", () => this.#l("default")), r.addEventListener("cancel", (e) => {
			e.preventDefault(), this.#l(this.mode === "products" ? "menu" : "default");
		}), e.querySelector(".back").addEventListener("click", () => this.#l("menu")), this.addEventListener("keydown", (e) => {
			e.key === "Escape" && this.#f && (e.stopPropagation(), this.#m(!1), this.#o()?.focus());
		}), document.addEventListener("click", (e) => {
			e.composedPath().includes(this) || (this.#m(!1), this.mode === "search" && !X.matches && this.#y(!1));
		});
		let i = () => {
			let e = window.scrollY > 0;
			e !== this.#d && (this.#d = e, this.shadowRoot.querySelector(".navbar").classList.toggle("scrolled", e), this.#c());
		};
		window.addEventListener("scroll", i, { passive: !0 }), i(), this.shadowRoot.querySelector("slot[name=\"links\"]").addEventListener("slotchange", () => this.#c()), this.#c();
	}
	update(e) {
		e.has("label") && this.shadowRoot.querySelector(".bar").setAttribute("aria-label", this.label ?? ""), (e.has("theme") || e.has("mode")) && this.#c();
	}
	#o() {
		return this.querySelector("arq-nav-link[has-dropdown]");
	}
	#s() {
		let e = this.shadowRoot, t = e.querySelector("slot[name=\"links\"]");
		e.querySelector(X.matches ? ".menu-main" : ".links").append(t), e.querySelector(".logo").size = X.matches ? "small" : "default";
	}
	#c() {
		let e = this.theme === "transparent" && this.mode === "default" && !this.#d && !this.#f;
		this.shadowRoot.querySelector(".navbar").classList.toggle("over-photo", e);
		for (let t of this.querySelectorAll("arq-nav-link")) t.theme = e ? "inverse" : "default";
	}
	#l(e) {
		let t = this.shadowRoot, n = this.mode;
		this.mode = e, this.#m(!1);
		let r = t.querySelector(".menu"), i = X.matches, a = e === "search" && !i;
		t.querySelector(".search-open").hidden = a, t.querySelector(".search-box").hidden = !a, a && requestAnimationFrame(() => t.querySelector(".search-field").focus()), e !== "search" && this.#b();
		let o = e === "menu" || e === "products";
		o && !r.open ? (this.#u = t.querySelector(".menu-open"), r.showModal(), e === "menu" && t.querySelector(".menu-close").focus()) : !o && r.open && (r.close(), this.#u?.focus()), t.querySelector(".menu-main").hidden = e === "products", t.querySelector(".menu-products").hidden = e !== "products", e === "products" ? (this.#h(), requestAnimationFrame(() => t.querySelector(".back").focus())) : e === "menu" && n === "products" && requestAnimationFrame(() => this.#o()?.focus()), e !== "search" && (t.querySelector(".search-screen").open = !1), this.#c();
	}
	#u = null;
	#d = !1;
	#f = !1;
	#p() {
		this.mode !== "default" && this.#l("default"), this.#m(!1);
	}
	#m(e) {
		let t = this.shadowRoot.querySelector(".mega"), n = this.#o(), r = !!e && !X.matches;
		r && this.#h(), r && this.mode === "search" && this.#l("default"), t.hidden = !r, n && (n.open = r), this.#f = r, this.#c();
	}
	#h() {
		this.#e || this.#t || (this.#t = tn().then((e) => this.navigation = e).catch((e) => console.error("[arq] navbar: no se pudo cargar la navegación", e)).finally(() => this.#t = null));
	}
	#g() {
		let e = this.shadowRoot, t = this.#e;
		e.querySelector(".mega").navigation = t;
		let n = t?.sections ?? {};
		e.querySelector(".groups").innerHTML = [
			n.interior,
			n.exterior,
			n.lamparas,
			n.artefactos
		].filter(Boolean).map((e) => `<arq-mega-link type="group">${Z(e.label)}` + e.links.map((e) => `<a slot="links" href="${Z(e.href)}">${Z(e.label)}</a>`).join("") + `<arq-button slot="links" type="underline" show-underline href="${Z(e.all.href)}">Ver todo</arq-button></arq-mega-link>`).join(""), e.querySelector(".collections").innerHTML = t?.allCollections ? `<arq-button type="underline" show-underline show-icon icon="arrow-right" href="${Z(t.allCollections.href)}">Ver colecciones</arq-button>` : "";
	}
	#_(e) {
		if (clearTimeout(this.#i), this.#a = e.trim(), !this.#a) {
			this.#v([], 0);
			return;
		}
		this.#i = setTimeout(async () => {
			let e = this.#a;
			try {
				let { results: t, total: n } = await $t(e, { limit: an });
				e === this.#a && this.#v(t, n);
			} catch (e) {
				console.error("[arq] navbar: no se pudo buscar", e);
			}
		}, on);
	}
	#v(e, t) {
		let n = this.shadowRoot;
		this.#n = e, this.#r = -1;
		let r = this.#a, i = e.map((e) => `<arq-search-result href="${Z(e.href)}"${e.image ? ` image="${Z(e.image)}"` : ""}>${Z(e.name)}<span slot="meta">${Z(e.meta)}</span></arq-search-result>`).join("") + (e.length ? `<arq-search-see-all href="${Z(en(r))}" term="${Z(r)}" count="${t}"></arq-search-see-all>` : ""), a = r && !e.length, o = n.querySelector(".search-dropdown");
		o.state = a ? "no-results" : "results", o.term = r, o.innerHTML = i, this.#y(!!r);
		let s = n.querySelector(".search-screen");
		s.innerHTML = a ? `<arq-search-dropdown state="no-results" term="${Z(r)}"></arq-search-dropdown>` : i, this.#C();
	}
	#y(e) {
		this.shadowRoot.querySelector(".search-dropdown").hidden = !e;
	}
	#b() {
		clearTimeout(this.#i), this.#a = "";
		let e = this.shadowRoot;
		e.querySelector(".search-field").value = "", e.querySelector(".search-screen").field.value = "", this.#v([], 0);
	}
	#x() {
		return [...(X.matches ? this.shadowRoot.querySelector(".search-screen") : this.shadowRoot.querySelector(".search-dropdown")).querySelectorAll("arq-search-result")];
	}
	#S(e) {
		let t = this.#x();
		t.length && (this.#r = this.#r < 0 && e < 0 ? t.length - 1 : (this.#r + e + t.length) % t.length, t.forEach((e, t) => e.active = t === this.#r), X.matches || this.#y(!0), this.#C());
	}
	#C() {
		let e = this.#n[this.#r], t = e ? `${e.name}, ${e.meta}, ${this.#r + 1} de ${this.#n.length}` : "";
		this.shadowRoot.querySelector(".search-field").activeLabel = t, this.shadowRoot.querySelector(".search-screen").field.activeLabel = t;
	}
	#w(e) {
		let t = this.#x()[this.#r];
		t ? t.click() : e.trim() && location.assign(en(e.trim()));
	}
}).define();
//#endregion
//#region src/components/contact-item/contact-item.css?inline
var sn = ":host{min-width:0;display:block}.item{align-items:flex-start;gap:var(--arq-space-gap-sm);padding-block:var(--arq-space-padding-lg);border-top:var(--arq-border-default) solid var(--arq-color-border-subtle);flex-direction:column;display:flex;position:relative}.label{color:var(--arq-color-text-tertiary)}.value{max-width:100%;color:var(--arq-color-text-primary);overflow-wrap:anywhere;text-decoration:none}.value[href]:hover{text-decoration:underline;text-decoration-thickness:var(--arq-border-default);text-underline-offset:var(--arq-space-padding-2xs)}.value:focus-visible{outline:none}.item:has(.value:focus-visible){outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}";
(class extends d {
	static tag = "arq-contact-item";
	static styles = sn;
	static properties = { href: { type: String } };
	static template = "<div class=\"item\"><span class=\"label role-label\"><slot name=\"label\"></slot></span><a class=\"value role-body-lg-regular\"><slot></slot></a></div>";
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
var cn = ":host{min-width:0;display:block}.list{align-items:flex-start;gap:var(--arq-space-gap-md);flex-direction:column;display:flex}.title{color:var(--arq-color-text-tertiary)}.links{align-items:flex-start;gap:var(--arq-space-gap-md);flex-direction:column;display:flex}", ln = 0;
(class extends d {
	static tag = "arq-link-list";
	static styles = cn;
	static template = "<nav class=\"list\"><span class=\"title role-label\"><slot name=\"title\"></slot></span><div class=\"links\" role=\"list\"><slot></slot></div></nav>";
	setup() {
		let e = this.shadowRoot, t = e.querySelector(".title");
		t.id = `arq-link-list-${++ln}`, e.querySelector("nav").setAttribute("aria-labelledby", t.id);
		let n = e.querySelector("slot:not([name])"), r = () => {
			for (let e of n.assignedElements()) e.setAttribute("role", "listitem");
		};
		n.addEventListener("slotchange", r), r();
	}
}).define();
//#endregion
//#region src/components/option-tile/option-tile.css?inline
var un = ":host{flex:1 1 max-content;cursor:pointer;min-width:0;display:flex}.tile{box-sizing:border-box;min-width:0;padding:var(--arq-space-padding-sm-md) var(--arq-space-padding-md);border-bottom:var(--arq-border-default) solid var(--arq-color-border-default);border-radius:var(--arq-radius-control);color:var(--arq-color-text-tertiary);text-align:center;flex:1;justify-content:center;align-items:center;display:flex}:host(:not([disabled]):not([selected]):hover) .tile{border-bottom-color:var(--arq-color-border-hover);background:var(--arq-color-surface-faint);color:var(--arq-color-text-primary)}:host([selected]) .tile{border-bottom-color:var(--arq-color-border-strong);background:var(--arq-color-surface-soft);color:var(--arq-color-text-primary)}:host([disabled]){cursor:default}:host([disabled]) .tile{border-bottom-color:var(--arq-color-border-disabled);color:var(--arq-color-text-disabled)}:host(:focus-visible){outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}:host(:focus:not(:focus-visible)){outline:none}";
(class extends d {
	static tag = "arq-option-tile";
	static styles = un;
	static properties = {
		selected: { type: Boolean },
		disabled: { type: Boolean },
		value: { type: String }
	};
	static template = "<span class=\"tile role-body-regular\"><slot></slot></span>";
	setup() {
		this.selectable = new _(this, {
			role: "radio",
			state: "aria-checked"
		});
	}
}).define();
//#endregion
//#region src/components/swatch-picker/swatch-picker.css?inline
var dn = ":host{align-items:center;gap:var(--arq-space-gap-sm-md);flex-wrap:wrap;display:flex}";
(class extends d {
	static tag = "arq-swatch-picker";
	static styles = dn;
	static properties = { label: { type: String } };
	static template = "<slot></slot>";
	setup() {
		this.setAttribute("role", "radiogroup"), this.select = new N(this, { items: "arq-swatch" });
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
var fn = ":host{display:block}.group{align-items:flex-start;gap:var(--arq-space-gap-md);flex-direction:column;display:flex}.label{color:var(--arq-color-text-secondary)}.options{gap:var(--arq-space-gap-sm);flex-wrap:wrap;align-self:stretch;display:flex}:host([type=swatches]) .options,:host([type=select]) .options{display:block}";
(class extends d {
	static tag = "arq-option-group";
	static styles = fn;
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
		this.select = new N(this, { items: "arq-option-tile" }), this.shadowRoot.querySelector("slot").addEventListener("slotchange", () => this.#e());
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
var pn = ":host{vertical-align:middle;cursor:pointer;max-width:100%;display:inline-flex}.chip{box-sizing:border-box;max-width:100%;padding:var(--arq-space-padding-sm-md) var(--arq-space-padding-lg);border:var(--arq-border-default) solid var(--arq-color-border-default);border-radius:var(--arq-radius-control);color:var(--arq-color-text-primary);white-space:nowrap;align-items:center;display:inline-flex}:host(:not([disabled]):hover) .chip{border-color:var(--arq-color-border-strong)}:host([selected]) .chip{border-color:var(--arq-color-border-strong);background:var(--arq-color-surface-selected)}:host([disabled]){cursor:default}:host([disabled]) .chip{border-color:var(--arq-color-border-disabled);color:var(--arq-color-text-disabled)}:host(:focus-visible){outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}:host(:focus:not(:focus-visible)){outline:none}";
(class extends d {
	static tag = "arq-choice-chip";
	static styles = pn;
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
		this.#t = this.selected, this.selectable = new _(this, {
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
var mn = ":host{width:100%;display:block}.input{gap:var(--arq-space-gap-sm);flex-direction:column;display:flex}.label{color:var(--arq-color-text-tertiary)}.field{align-items:center;gap:var(--arq-space-gap-sm);padding-block:var(--arq-space-gap-sm);border-bottom:var(--arq-border-default) solid var(--arq-color-border-default);display:flex}.control{box-sizing:border-box;border-radius:var(--arq-radius-control);background:var(--arq-color-surface-transparent);width:100%;min-width:0;color:var(--arq-color-text-primary);border:0;flex:1;margin:0;padding:0}.control::placeholder{color:var(--arq-color-text-tertiary);opacity:1}:host([type=textarea]) .field{align-items:stretch}textarea.control{resize:vertical}.helper{color:var(--arq-color-text-tertiary);margin:0}.error{color:var(--arq-color-text-error);margin:0}.control:focus,.control:focus-visible{outline:none}.field:focus-within{border-bottom-color:var(--arq-color-border-focus)}:host([error]) .field,:host([error]) .field:focus-within{border-bottom-color:var(--arq-color-border-error)}:host([disabled]) .label,:host([disabled]) .helper,:host([disabled]) .control,:host([disabled]) .control::placeholder{color:var(--arq-color-text-disabled)}:host([disabled]) .field{border-bottom-color:var(--arq-color-border-disabled)}", Q = (() => {
	let e = 0;
	return () => `arq-input-${++e}`;
})(), hn = 4, gn = [
	"placeholder",
	"autocomplete",
	"required",
	"minlength",
	"maxlength",
	"pattern",
	"inputmode",
	"rows"
];
(class extends d {
	static tag = "arq-input";
	static styles = mn;
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
		required: { type: Boolean }
	};
	static template = "<div class=\"input\"><label class=\"label role-label\"><slot></slot></label><div class=\"field\"></div><p class=\"helper role-body-sm\"><slot name=\"helper\"></slot></p><p class=\"error role-body-sm\" aria-live=\"polite\"></p></div>";
	#e = this.attachInternals();
	#t = null;
	#n = {
		control: Q(),
		helper: Q(),
		error: Q()
	};
	#r = "";
	setup() {
		this.#r = this.getAttribute("value") ?? "";
		let e = this.shadowRoot;
		e.querySelector(".label").htmlFor = this.#n.control, e.querySelector(".helper").id = this.#n.helper, e.querySelector(".error").id = this.#n.error, this.type === "select" && console.warn("[arq] <arq-input type=\"select\"> todavía no está: se construye con select y select-menu. Se muestra como Text.");
	}
	get value() {
		return this.#t?.value ?? this.getAttribute("value") ?? "";
	}
	set value(e) {
		let t = e == null ? "" : String(e);
		this.#t ? (this.#t.value = t, this.#a()) : this.setAttribute("value", t);
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
	update(e) {
		(e.has("type") || !this.#t) && this.#i();
		let t = this.#t, n = this.shadowRoot;
		t.localName === "input" && (t.type = this.inputType);
		for (let e of gn) this.hasAttribute(e) ? t.setAttribute(e, this.getAttribute(e)) : t.removeAttribute(e);
		t.localName === "textarea" && !this.hasAttribute("rows") && (t.rows = hn), t.disabled = this.disabled, n.querySelector(".label").classList.toggle("visually-hidden", !this.showLabel);
		let r = !!this.error, i = n.querySelector(".helper"), a = n.querySelector(".error");
		a.textContent = this.error ?? "", a.hidden = !r, i.hidden = r || !this.showHelper, t.setAttribute("aria-invalid", String(r));
		let o = [r ? this.#n.error : null, i.hidden ? null : this.#n.helper].filter(Boolean);
		o.length ? t.setAttribute("aria-describedby", o.join(" ")) : t.removeAttribute("aria-describedby"), this.#a();
	}
	formResetCallback() {
		this.value = this.#r;
	}
	formDisabledCallback(e) {
		this.#t.disabled = e || this.disabled;
	}
	#i() {
		let e = this.type === "textarea" ? "textarea" : "input";
		if (this.#t?.localName === e) return;
		let t = document.createElement(e);
		t.className = "control role-body", t.id = this.#n.control, t.value = this.#t?.value ?? this.getAttribute("value") ?? "", t.addEventListener("input", () => {
			this.#a(), this.emit("input", { value: t.value });
		}), t.addEventListener("change", () => this.emit("change", { value: t.value })), this.shadowRoot.querySelector(".field").replaceChildren(t), this.#t = t;
	}
	#a() {
		let e = this.#t;
		this.#e.setFormValue(e.value), e.validity.valid ? this.#e.setValidity({}) : this.#e.setValidity(e.validity, e.validationMessage, e);
	}
}).define();
//#endregion
//#region src/components/file-upload/file-upload.css?inline
var _n = ":host{width:100%;display:block}.upload{gap:var(--arq-space-gap-sm);flex-direction:column;display:flex}.label{color:var(--arq-color-text-secondary)}.zone,.attached{box-sizing:border-box;padding:var(--arq-space-padding-lg);border:var(--arq-border-default) dashed var(--arq-color-border-default);border-radius:var(--arq-radius-control);background:var(--arq-color-bg-subtle);align-items:center;display:flex;position:relative}.zone{cursor:pointer}.attached{justify-content:space-between;gap:var(--arq-space-gap-sm-md);border-style:solid}.empty{align-items:center;gap:var(--arq-space-gap-sm-md);min-width:0;display:flex}.icon{width:var(--arq-icon-md);height:var(--arq-icon-md);color:var(--arq-color-icon-primary);flex:none}.prompt,.file{min-width:0;color:var(--arq-color-text-primary)}.file{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.remove{flex:none}.helper{color:var(--arq-color-text-tertiary);margin:0}.error{color:var(--arq-color-text-error);margin:0}.drop{min-width:0;color:var(--arq-color-text-primary);display:none}:host(:state(drag-over)) .zone{border-color:var(--arq-color-border-strong);background:var(--arq-color-surface-hover)}:host(:state(drag-over)) .prompt{display:none}:host(:state(drag-over)) .drop{display:inline}:host(:state(error)) .zone{border-color:var(--arq-color-border-error)}:host([disabled]) .zone{border-color:var(--arq-color-border-disabled);cursor:default}:host([disabled]) .label,:host([disabled]) .prompt,:host([disabled]) .file,:host([disabled]) .helper{color:var(--arq-color-text-disabled)}:host([disabled]) .icon{color:var(--arq-color-icon-disabled)}.zone:has(.native:focus-visible){outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}", vn = ".pdf,.dwg,.jpg,.jpeg,.png", yn = 10, bn = {
	type: "El formato no está admitido.",
	size: (e) => `El archivo supera los ${e} MB.`
};
function xn(e) {
	let t = [...new Set(e.split(",").map((e) => e.trim().replace(/^\./, "").toUpperCase()).filter(Boolean).map((e) => e === "JPEG" ? "JPG" : e))];
	return t.length > 1 ? `${t.slice(0, -1).join(", ")} o ${t.at(-1)}` : t.join("");
}
(class extends d {
	static tag = "arq-file-upload";
	static styles = _n;
	static formAssociated = !0;
	static properties = {
		accept: {
			type: String,
			default: vn
		},
		maxSize: {
			type: Number,
			default: yn
		},
		name: { type: String },
		required: { type: Boolean },
		disabled: { type: Boolean }
	};
	static template = `<div class="upload"><span class="label role-label" id="label"><slot>Adjuntar archivo</slot></span><label class="zone" id="zone"><input type="file" class="native visually-hidden" aria-labelledby="label" aria-describedby="helper error"><span class="empty">${p("plus")}<span class="prompt role-body"><slot name="prompt">Arrastrá o seleccioná planos, renders o fotos</slot></span><span class="drop role-body" aria-hidden="true"><slot name="drop">Soltá el archivo acá</slot></span></span></label><div class="attached" hidden><span class="file role-body-regular"></span><arq-button type="underline" show-underline class="remove">Quitar<span class="visually-hidden"></span></arq-button></div><p class="helper role-body-sm" id="helper"><slot name="helper"></slot></p><p class="error role-body-sm" id="error" aria-live="polite" hidden></p></div>`;
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
		let t = this.accept.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean), n = `.${e.name.split(".").pop()?.toLowerCase()}`, r = t.length ? ` Formatos: ${xn(this.accept)}.` : "";
		return t.length && !t.includes(n) ? bn.type + r : this.maxSize && e.size > this.maxSize * 1024 * 1024 ? bn.size(this.maxSize) + r : "";
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
		n.textContent = this.#r, n.hidden = !this.#r, e.querySelector(".helper").hidden = !!this.#r, this.#r ? this.#e.states.add("error") : this.#e.states.delete("error"), this.#t.setAttribute("aria-invalid", String(!!this.#r));
	}
}).define();
//#endregion
//#region src/components/section-header/section-header.css?inline
var Sn = ":host{min-width:0;display:block}.header{justify-content:space-between;align-items:flex-end;gap:var(--arq-space-gap-lg);min-width:0;display:flex}.text{gap:var(--arq-space-gap-sm-md);flex-direction:column;min-width:0;display:flex}.title,.description{overflow-wrap:break-word;margin:0}.title{color:var(--arq-color-text-primary)}.description{color:var(--arq-color-text-secondary)}.link{flex:none}:host([type=description]) .text{display:contents}:host([type=description]) .description{flex:0 1 var(--arq-layout-measure);max-width:var(--arq-layout-measure)}:host([type=stacked]) .header{flex-direction:column;justify-content:flex-start;align-items:flex-start}:host([type=stacked]) .text{align-self:stretch}@media (width<=767px){.header{flex-direction:column;justify-content:flex-start;align-items:flex-start}.text{width:100%}:host([type=description]) .text{display:flex}:host([type=description]) .description{flex:none;max-width:none}:host([type=link]) .link,:host(:not([type])) .link{display:none}}", Cn = ["description", "stacked"], wn = ["link", "stacked"];
(class extends d {
	static tag = "arq-section-header";
	static styles = Sn;
	static properties = {
		type: {
			type: String,
			values: [
				"link",
				"description",
				"title",
				"stacked"
			],
			default: "link"
		},
		href: { type: String }
	};
	static template = "<div class=\"header\"><div class=\"text\"><div class=\"title role-heading-2\"><slot name=\"title\"></slot></div><p class=\"description role-body-lg\" hidden><slot name=\"description\"></slot></p></div><arq-button class=\"link\" type=\"underline\" show-underline show-icon icon=\"arrow-right\" hidden><slot name=\"link\">Ver todo</slot></arq-button></div>";
	setup() {
		this.shadowRoot.querySelector("slot[name=\"description\"]").addEventListener("slotchange", () => this.update());
	}
	update() {
		let e = this.shadowRoot, t = e.querySelector("slot[name=\"description\"]").assignedNodes({ flatten: !0 }).some((e) => e.textContent.trim());
		e.querySelector(".description").hidden = !Cn.includes(this.type) || !t;
		let n = e.querySelector(".link"), r = wn.includes(this.type) && !!this.href;
		n.hidden = !r, r ? n.setAttribute("href", this.href) : n.removeAttribute("href");
	}
}).define();
//#endregion
//#region src/components/page-header/page-header.css?inline
var Tn = ":host{min-width:0;display:block}.header{align-items:flex-start;gap:var(--arq-space-gap-xl-2xl);padding:var(--arq-space-section-sm) var(--arq-layout-gutter) var(--arq-space-section-xs);flex-direction:column;display:flex}.row{justify-content:space-between;align-items:flex-end;gap:var(--arq-space-gap-lg);align-self:stretch;min-width:0;display:flex}.main,.heading{flex-direction:column;min-width:0;display:flex}.heading{gap:var(--arq-space-gap-lg)}.title,.description{overflow-wrap:break-word;margin:0}.title{color:var(--arq-color-text-primary)}.description{color:var(--arq-color-text-secondary)}.action{flex:none}:host(:not([type=detail])) .main{display:contents}:host(:not([type=detail])) .description{flex:0 1 var(--arq-layout-measure);max-width:var(--arq-layout-measure)}:host([type=detail]) .header{padding-block:var(--arq-space-section-xs) var(--arq-space-section-sm)}:host([type=detail]) .main{gap:var(--arq-space-gap-md);max-width:var(--arq-layout-measure-wide)}@media (width<=767px){.row{align-items:stretch;gap:var(--arq-space-gap-lg);flex-direction:column}:host(:not([type=detail])) .main{gap:var(--arq-space-gap-lg);display:flex}:host(:not([type=detail])) .description,:host([type=detail]) .main{flex:none;max-width:none}:host([type=detail]) .row{gap:var(--arq-space-gap-xl-2xl)}.action ::slotted(*){width:100%}}";
(class extends d {
	static tag = "arq-page-header";
	static styles = Tn;
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
		backHref: { type: String }
	};
	static template = "<div class=\"header\"><arq-button class=\"back\" type=\"underline\" show-leading-icon leading-icon=\"chevron-left\" hidden><slot name=\"back\"></slot></arq-button><div class=\"row\"><div class=\"main\"><div class=\"heading\"><div class=\"breadcrumb\" hidden><slot name=\"breadcrumb\"></slot></div><div class=\"title role-display\"><slot name=\"title\"></slot></div></div><p class=\"description role-body-lg\" hidden><slot name=\"description\"></slot></p></div><div class=\"action\" hidden><slot name=\"action\"></slot></div></div></div>";
	setup() {
		for (let e of this.shadowRoot.querySelectorAll("slot[name]")) e.addEventListener("slotchange", () => this.update());
	}
	update() {
		let e = this.shadowRoot, t = (t) => e.querySelector(`slot[name="${t}"]`).assignedNodes({ flatten: !0 }).some((e) => e.nodeType === Node.ELEMENT_NODE || e.textContent.trim()), n = this.type === "detail";
		e.querySelector(".breadcrumb").hidden = !this.showBreadcrumb || !t("breadcrumb"), e.querySelector(".description").hidden = !this.showDescription || !t("description"), e.querySelector(".action").hidden = !n || !this.showAction || !t("action");
		let r = e.querySelector(".back"), i = n && this.showBack && !!this.backHref && t("back");
		r.hidden = !i, i ? r.setAttribute("href", this.backHref) : r.removeAttribute("href");
	}
}).define();
//#endregion
//#region src/components/faq-item/faq-item.css?inline
var En = ":host{min-width:0;display:block}.item{border-top:var(--arq-border-default) solid var(--arq-color-border-default)}.trigger{box-sizing:border-box;align-items:center;gap:var(--arq-space-gap-lg);width:100%;padding:var(--arq-space-padding-lg) 0;background:var(--arq-color-surface-transparent);color:var(--arq-color-text-primary);font:inherit;text-align:start;cursor:pointer;-webkit-tap-highlight-color:var(--arq-color-surface-transparent);border:0;margin:0;display:flex}:host([open]) .trigger{padding-bottom:var(--arq-space-gap-sm-md)}.question{overflow-wrap:break-word;flex:1 1 0;min-width:0}.icon{width:var(--arq-icon-md);height:var(--arq-icon-md);color:var(--arq-color-icon-primary);flex:none}:host(:not([open])) [data-icon=minus],:host([open]) [data-icon=plus]{display:none}.answer{max-width:var(--arq-layout-measure-wide);padding-bottom:var(--arq-space-padding-lg);color:var(--arq-color-text-secondary);overflow-wrap:break-word}::slotted(a){color:var(--arq-color-text-primary);text-decoration:underline}@media (hover:hover){:host(:not([open])) .trigger:hover{background:var(--arq-color-surface-faint)}}.item:has(.trigger:focus-visible){outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.trigger:focus{outline:none}@media (width<=767px){.answer{max-width:none}}";
(class extends d {
	static tag = "arq-faq-item";
	static styles = En;
	static properties = { open: { type: Boolean } };
	static template = `<div class="item"><button type="button" class="trigger"><span class="question role-body-lg-regular"><slot name="question"></slot></span>${p("plus")}${p("minus")}</button><div class="answer role-body" part="panel"><slot></slot></div></div>`;
	setup() {
		this.disclosure = new g(this, {
			trigger: this.shadowRoot.querySelector(".trigger"),
			panel: this.shadowRoot.querySelector(".answer")
		});
	}
}).define();
//#endregion
//#region src/components/footer/footer.css?inline
var Dn = ":host{display:block}.footer{column-gap:var(--arq-space-gap-xl);row-gap:var(--arq-space-gap-md);padding:var(--arq-space-section-sm) var(--arq-layout-gutter);border-top:var(--arq-border-default) solid var(--arq-color-border-subtle);background:var(--arq-color-surface-default);grid-template:\"brand columns\"\"legal columns\"1fr/minmax(0,1fr) auto;display:grid}.brand{align-items:flex-start;gap:var(--arq-space-gap-md);flex-direction:column;grid-area:brand;min-width:0;display:flex}.tagline{color:var(--arq-color-text-secondary);overflow-wrap:break-word;margin:0}.legal{color:var(--arq-color-text-tertiary);text-transform:uppercase;grid-area:legal;align-self:start;margin:0}.columns{align-items:flex-start;gap:var(--arq-space-gap-xl);grid-area:columns;display:flex}.column{align-items:flex-start;gap:var(--arq-space-gap-sm);flex-direction:column;min-width:0;display:flex}.title{padding-bottom:var(--arq-space-gap-sm);color:var(--arq-color-text-primary);margin:0}.list{align-items:flex-start;gap:var(--arq-space-gap-sm);flex-direction:column;max-width:100%;display:flex}@media (width<=767px){.footer{row-gap:var(--arq-space-gap-xl);grid-template-rows:none;grid-template-columns:minmax(0,1fr);grid-template-areas:\"brand\"\"columns\"\"legal\"}.column{flex:1 1 0}}", On = [
	"productos",
	"informacion",
	"redes"
];
(class extends d {
	static tag = "arq-footer";
	static styles = Dn;
	static template = "<footer class=\"footer\"><div class=\"brand\"><arq-logo size=\"compact\"></arq-logo><p class=\"tagline role-body\"><slot name=\"tagline\"></slot></p></div><div class=\"columns\">" + On.map((e) => `<nav class="column" data-column="${e}"><div class="title role-body-strong"><slot name="${e}-title"></slot></div><div class="list" role="list"><slot name="${e}"></slot></div></nav>`).join("") + "</div><p class=\"legal role-body-sm\">© <span class=\"year\"></span> Macroled Arq.</p></footer>";
	setup() {
		let e = this.shadowRoot;
		e.querySelector(".year").textContent = String((/* @__PURE__ */ new Date()).getFullYear());
		let t = e.querySelector("slot[name=\"tagline\"]"), n = () => {
			e.querySelector(".tagline").hidden = !t.assignedNodes({ flatten: !0 }).some((e) => e.textContent.trim());
		};
		t.addEventListener("slotchange", n), n();
		for (let t of On) {
			let n = e.querySelector(`[data-column="${t}"]`), r = e.querySelector(`slot[name="${t}-title"]`), i = () => {
				let e = r.assignedNodes({ flatten: !0 }).map((e) => e.textContent).join(" ").trim();
				e ? n.setAttribute("aria-label", e) : n.removeAttribute("aria-label");
			};
			r.addEventListener("slotchange", i), i();
		}
	}
}).define();
//#endregion
//#region src/components/hero/hero.css?inline
var kn = ":host{display:block}.hero{aspect-ratio:16/10;background:var(--arq-color-surface-inverse);flex-direction:column;justify-content:flex-end;display:flex;position:relative;overflow:hidden}.media{position:absolute;inset:0}::slotted([slot=media]){object-fit:cover;width:100%!important;max-width:none!important;height:100%!important;display:block!important}.scrim{background:linear-gradient(#00000085 0%,#0003 18% 45%,#000000ad 100%);position:absolute;inset:0}.content{justify-content:space-between;align-items:flex-end;gap:var(--arq-space-gap-xl);padding:0 var(--arq-layout-gutter) var(--arq-space-section-sm);color:var(--arq-color-text-inverse);display:flex;position:relative}.text{align-items:flex-start;gap:var(--arq-space-gap-lg);flex-direction:column;min-width:0;display:flex}.eyebrow,.title,.description{overflow-wrap:break-word;margin:0}.action{flex:none}@media (width<=767px){.hero{aspect-ratio:auto;height:70svh}.content{justify-content:flex-start;align-items:flex-start;gap:var(--arq-space-gap-lg);flex-direction:column}}", An = [
	"eyebrow",
	"description",
	"action"
];
(class extends d {
	static tag = "arq-hero";
	static styles = kn;
	static template = "<div class=\"hero\"><div class=\"media\"><slot name=\"media\"></slot></div><div class=\"scrim\" aria-hidden=\"true\"></div><div class=\"content\"><div class=\"text\"><p class=\"eyebrow role-label\" hidden><slot name=\"eyebrow\"></slot></p><div class=\"title role-display\"><slot name=\"title\"></slot></div><p class=\"description role-body-lg\" hidden><slot name=\"description\"></slot></p></div><div class=\"action\" data-arq-theme=\"dark\" hidden><slot name=\"action\"></slot></div></div></div>";
	#e = window.matchMedia("(prefers-reduced-motion: reduce)");
	setup() {
		for (let e of this.shadowRoot.querySelectorAll("slot[name]")) e.addEventListener("slotchange", () => this.update());
		this.#e.addEventListener("change", () => this.#n());
	}
	update() {
		let e = this.shadowRoot, t = (t) => e.querySelector(`slot[name="${t}"]`).assignedNodes({ flatten: !0 }).some((e) => e.nodeType === Node.ELEMENT_NODE || e.textContent.trim());
		for (let n of An) e.querySelector(`.${n}`).hidden = !t(n);
		this.#n();
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
var jn = ":host{min-width:0;display:block}.block{justify-content:space-between;align-items:center;gap:var(--arq-space-gap-xl);padding:var(--arq-space-section-md) var(--arq-layout-gutter);background:var(--arq-color-bg-subtle);display:flex}.text{gap:var(--arq-space-gap-sm-md);flex-direction:column;min-width:0;display:flex}.title{color:var(--arq-color-text-primary);overflow-wrap:break-word}.description{max-width:var(--arq-layout-measure-wide);color:var(--arq-color-text-secondary);overflow-wrap:break-word;margin:0}.action{align-items:center;gap:var(--arq-space-gap-md);flex:none;display:flex}.email{width:var(--arq-layout-measure)}::slotted(arq-input){width:100%;display:block}@media (width<=767px){.block{flex-direction:column;align-items:stretch}.description{max-width:none}.action{align-items:stretch;gap:var(--arq-space-gap-xl);flex-direction:column}.email{width:auto}::slotted(arq-button){width:100%}}";
(class extends d {
	static tag = "arq-cta-block";
	static styles = jn;
	static properties = { type: {
		type: String,
		values: ["button", "newsletter"],
		default: "button"
	} };
	static template = "<div class=\"block\"><div class=\"text\"><div class=\"title role-heading-2\"><slot name=\"title\"></slot></div><p class=\"description role-body-lg\" hidden><slot name=\"description\"></slot></p></div><div class=\"action\"><div class=\"email\" hidden><slot name=\"email\"></slot></div><slot name=\"action\"></slot></div></div>";
	setup() {
		let e = this.shadowRoot;
		e.querySelector("slot[name=\"description\"]").addEventListener("slotchange", () => this.update()), e.querySelector("slot[name=\"action\"]").addEventListener("click", () => {
			this.type === "newsletter" && this.#e();
		}), e.querySelector("slot[name=\"email\"]").addEventListener("keydown", (e) => {
			this.type === "newsletter" && e.key === "Enter" && (e.preventDefault(), this.#e());
		});
	}
	update() {
		let e = this.shadowRoot;
		e.querySelector(".description").hidden = !e.querySelector("slot[name=\"description\"]").assignedNodes({ flatten: !0 }).some((e) => e.nodeType === Node.ELEMENT_NODE || e.textContent.trim()), e.querySelector(".email").hidden = this.type !== "newsletter";
	}
	#e() {
		let e = this.querySelector("[slot=\"email\"]");
		return e ? typeof e.reportValidity == "function" && !e.reportValidity() ? (e.focus?.(), !1) : (this.emit("submit", { email: e.value }), !0) : !1;
	}
}).define();
//#endregion
//#region src/components/carousel-controls/carousel-controls.css?inline
var Mn = ":host{display:inline-flex}.controls{align-items:center;gap:var(--arq-space-gap-sm);display:flex}@media (width<=767px){:host{display:none}}", Nn = [
	"start",
	"middle",
	"end"
];
(class extends d {
	static tag = "arq-carousel-controls";
	static styles = Mn;
	static properties = {
		position: {
			type: String,
			values: Nn,
			default: "start"
		},
		for: { type: String },
		labelPrev: {
			type: String,
			default: "Anterior"
		},
		labelNext: {
			type: String,
			default: "Siguiente"
		}
	};
	static template = "<div class=\"controls\" role=\"group\"><arq-icon-button class=\"prev\" size=\"large\" icon=\"arrow-left\"></arq-icon-button><arq-icon-button class=\"next\" size=\"large\" icon=\"arrow-right\"></arq-icon-button></div>";
	#e = null;
	#t = !1;
	#n = !0;
	#r = () => this.#l();
	#i = new ResizeObserver(() => this.#l());
	#a = window.matchMedia("(prefers-reduced-motion: reduce)");
	setup() {
		let e = this.shadowRoot;
		e.querySelector(".prev").addEventListener("click", () => this.#u(-1)), e.querySelector(".next").addEventListener("click", () => this.#u(1));
	}
	connectedCallback() {
		super.connectedCallback(), this.#e && !this.#t && this.#s(this.#e);
	}
	disconnectedCallback() {
		this.#c();
	}
	update(e) {
		let t = this.shadowRoot, n = t.querySelector(".prev"), r = t.querySelector(".next");
		e.has("labelPrev") && (n.textContent = this.labelPrev), e.has("labelNext") && (r.textContent = this.labelNext), t.querySelector(".controls").setAttribute("aria-label", `${this.labelPrev} / ${this.labelNext}`), e.has("for") && this.#o();
		let i = t.activeElement;
		n.disabled = this.position === "start", r.disabled = this.position === "end" || !this.#n, i === n && n.disabled && r.focus(), i === r && r.disabled && n.focus();
	}
	#o() {
		this.#c();
		let e = this.for ? this.getRootNode().getElementById?.(this.for) : null;
		this.for && !e && document.readyState === "loading" && document.addEventListener("DOMContentLoaded", () => this.#o(), { once: !0 }), this.#e = e, e && this.#s(e);
	}
	#s(e) {
		this.#t = !0, e.addEventListener("scroll", this.#r, { passive: !0 }), this.#i.observe(e), customElements.whenDefined("arq-icon-button").then(() => {
			for (let t of this.shadowRoot.querySelectorAll("arq-icon-button")) {
				let n = t.shadowRoot?.querySelector("button");
				n && "ariaControlsElements" in n && (n.ariaControlsElements = [e]);
			}
		}), this.#l();
	}
	#c() {
		this.#e && this.#t && (this.#t = !1, this.#e.removeEventListener("scroll", this.#r), this.#i.unobserve(this.#e));
	}
	#l() {
		let e = this.#e;
		if (!e) return;
		let t = e.scrollWidth - e.clientWidth, n = t <= 1 || e.scrollLeft <= 1 ? "start" : e.scrollLeft >= t - 1 ? "end" : "middle", r = t > 1;
		r !== this.#n && (this.#n = r, this.shadowRoot.querySelector(".next").disabled = !r || n === "end"), n !== this.position && (this.position = n);
	}
	#u(e) {
		let t = this.#e;
		if (!t) {
			this.emit(e < 0 ? "prev" : "next");
			return;
		}
		t.scrollBy({
			left: e * t.clientWidth,
			behavior: this.#a.matches ? "auto" : "smooth"
		});
	}
}).define();
//#endregion
//#region src/components/category-card/category-card.css?inline
var Pn = ":host{min-width:0;display:block}.card{gap:var(--arq-space-gap-lg);flex-direction:column;display:flex}.card-media{aspect-ratio:4/5}.caption{justify-content:space-between;align-items:center;gap:var(--arq-space-gap-md);display:flex}.name{min-width:0;color:var(--arq-color-text-primary);overflow-wrap:break-word}.icon{width:var(--arq-icon-md);height:var(--arq-icon-md);color:var(--arq-color-icon-primary);flex:none}@media (width<=767px){.card{gap:var(--arq-space-gap-md)}}";
(class extends d {
	static tag = "arq-category-card";
	static styles = O + Pn;
	static properties = { href: { type: String } };
	static template = `<div class="card"><div class="card-media"><slot name="image"></slot></div><div class="caption"><a class="card-link name role-heading-3"><slot name="name"></slot></a>${p("arrow-right")}</div></div>`;
	update(e) {
		if (!e.has("href")) return;
		let t = this.shadowRoot.querySelector(".card-link");
		this.href ? t.setAttribute("href", this.href) : t.removeAttribute("href");
	}
}).define();
//#endregion
//#region src/components/line-card/line-card.css?inline
var Fn = ":host{min-width:0;display:block}.card{gap:var(--arq-space-gap-lg);flex-direction:column;display:flex}.card-media{aspect-ratio:5/4}.content{align-items:flex-start;gap:var(--arq-space-gap-md);padding-top:var(--arq-space-padding-sm);flex-direction:column;display:flex}.label,.description{margin:0}.label{color:var(--arq-color-text-tertiary)}.name{max-width:100%;color:var(--arq-color-text-primary);overflow-wrap:break-word}.description{max-width:var(--arq-layout-measure);color:var(--arq-color-text-secondary);overflow-wrap:break-word}.cta{align-items:center;gap:var(--arq-space-gap-sm);margin-top:calc(var(--arq-space-gap-sm) + var(--arq-space-gap-md));padding:var(--arq-space-gap-xs) 0;color:var(--arq-color-action-primary);display:inline-flex}.cta-text{position:relative}.cta-text:after{content:\"\";inset-inline:0;top:calc(100% + var(--arq-space-padding-2xs) - var(--arq-border-default));height:var(--arq-border-default);background:var(--arq-color-border-strong);position:absolute}.cta .icon{width:var(--arq-icon-md);height:var(--arq-icon-md)}@media (width<=767px){.card-media{aspect-ratio:1}.content{gap:var(--arq-space-gap-sm-md);padding-top:0}.description{max-width:none}.cta{margin-top:calc(var(--arq-space-gap-xs) + var(--arq-space-gap-sm-md))}}", In = ["label", "description"];
(class extends d {
	static tag = "arq-line-card";
	static styles = O + Fn;
	static properties = { href: { type: String } };
	static template = `<div class="card"><div class="card-media"><slot name="image"></slot></div><div class="content"><p class="label role-label" hidden><slot name="label"></slot></p><a class="card-link name role-heading-1"><slot name="name"></slot></a><p class="description role-body-lg" hidden><slot name="description"></slot></p><span class="cta role-body-regular" aria-hidden="true"><span class="cta-text"><slot name="action">Ver colección</slot></span>${p("arrow-right")}</span></div></div>`;
	setup() {
		for (let e of In) this.shadowRoot.querySelector(`slot[name="${e}"]`).addEventListener("slotchange", () => this.update(/* @__PURE__ */ new Set()));
	}
	update(e) {
		let t = this.shadowRoot;
		for (let e of In) t.querySelector(`.${e}`).hidden = !t.querySelector(`slot[name="${e}"]`).assignedNodes({ flatten: !0 }).some((e) => e.nodeType === Node.ELEMENT_NODE || e.textContent.trim());
		if (e.has("href")) {
			let e = t.querySelector(".card-link");
			this.href ? e.setAttribute("href", this.href) : e.removeAttribute("href");
		}
	}
}).define();
//#endregion
//#region src/components/feature-block/feature-block.css?inline
var Ln = ":host{min-width:0;display:block}.block{column-gap:var(--arq-space-gap-6xl);grid-template:\"image content\"\"image secondary\"1fr/50% minmax(0,1fr);align-items:start;display:grid}:host([layout=image-right]) .block{grid-template-columns:minmax(0,1fr) 50%;grid-template-areas:\"content image\"\"secondary image\"}.block:has(.secondary[hidden]){grid-template-areas:\"image content\"\"image content\"}:host([layout=image-right]) .block:has(.secondary[hidden]){grid-template-areas:\"content image\"\"content image\"}.media{background:var(--arq-color-bg-subtle);overflow:hidden}.image{aspect-ratio:4/5;grid-area:image}.secondary{aspect-ratio:16/10;margin-top:calc(var(--arq-space-gap-xl) * 2 + var(--arq-space-gap-lg));grid-area:secondary}.media ::slotted(*){object-fit:cover;width:100%!important;max-width:none!important;height:100%!important;display:block!important}.content{align-items:flex-start;gap:var(--arq-space-gap-xl);padding-top:var(--arq-space-padding-xl-2xl);flex-direction:column;grid-area:content;display:flex}:host([layout=image-right]) .content{padding-top:var(--arq-space-padding-6xl)}.label,.description{margin:0}.label{color:var(--arq-color-text-tertiary)}.title{max-width:100%;color:var(--arq-color-text-primary);overflow-wrap:break-word}.description{max-width:var(--arq-layout-measure);color:var(--arq-color-text-secondary);overflow-wrap:break-word}@media (width<=767px){.block,:host([layout=image-right]) .block{row-gap:var(--arq-space-gap-lg);grid-template-rows:none;grid-template-columns:minmax(0,1fr);grid-template-areas:\"image\"\"content\"\"secondary\"}.block:has(.secondary[hidden]){row-gap:var(--arq-space-gap-lg);grid-template-rows:none;grid-template-columns:minmax(0,1fr);grid-template-areas:\"image\"\"content\"\"secondary\"}:host([layout=image-right]) .block:has(.secondary[hidden]){row-gap:var(--arq-space-gap-lg);grid-template-rows:none;grid-template-columns:minmax(0,1fr);grid-template-areas:\"image\"\"content\"\"secondary\"}.content,:host([layout=image-right]) .content{gap:var(--arq-space-gap-md);padding-top:var(--arq-space-padding-sm)}.secondary{margin-top:0}.description{max-width:none}}", Rn = [
	"label",
	"description",
	"action",
	"secondary"
];
(class extends d {
	static tag = "arq-feature-block";
	static styles = Ln;
	static properties = { layout: {
		type: String,
		values: ["image-left", "image-right"],
		default: "image-left"
	} };
	static template = "<div class=\"block\"><div class=\"media image\"><slot name=\"image\"></slot></div><div class=\"content\"><p class=\"label role-label\" hidden><slot name=\"label\"></slot></p><div class=\"title role-display-sm\"><slot name=\"title\"></slot></div><p class=\"description role-body-lg\" hidden><slot name=\"description\"></slot></p><div class=\"action\" hidden><slot name=\"action\"></slot></div></div><div class=\"media secondary\" hidden><slot name=\"secondary\"></slot></div></div>";
	setup() {
		for (let e of Rn) this.shadowRoot.querySelector(`slot[name="${e}"]`).addEventListener("slotchange", () => this.update());
	}
	update() {
		let e = this.shadowRoot;
		for (let t of Rn) e.querySelector(`.${t}`).hidden = !e.querySelector(`slot[name="${t}"]`).assignedNodes({ flatten: !0 }).some((e) => e.nodeType === Node.ELEMENT_NODE || e.textContent.trim());
	}
}).define();
//#endregion
//#region src/components/section/section.css?inline
var zn = ":host{--section-gap:var(--arq-space-gap-2xl);box-sizing:border-box;min-width:0;padding:0 var(--arq-layout-gutter) var(--arq-space-section-xl);background:var(--arq-color-bg-default);display:block}:host([padding-top]){padding-top:var(--arq-space-section-xl)}.section{gap:var(--section-gap);flex-direction:column;min-width:0;display:flex}.head,.body{min-width:0}.action,.mobile-action{align-self:flex-start}@media (width>=768px){.mobile-action{display:none}:host([layout=split]) .section{grid-template-columns:var(--arq-layout-measure) minmax(0, 1fr);column-gap:var(--arq-space-section-md);row-gap:var(--arq-space-gap-lg);grid-template-rows:auto 1fr;grid-template-areas:\"head body\"\"action body\";align-items:start;display:grid}:host([layout=split]) .head{grid-area:head}:host([layout=split]) .body{grid-area:body}:host([layout=split]) .action{grid-area:action}}@media (width<=767px){:host{--section-gap:var(--arq-space-gap-xl)}}", Bn = [
	"header",
	"action",
	"mobile-action"
];
(class extends d {
	static tag = "arq-section";
	static styles = zn;
	static properties = {
		layout: {
			type: String,
			values: ["stack", "split"],
			default: "stack"
		},
		paddingTop: { type: Boolean }
	};
	static template = "<div class=\"section\"><div class=\"head\" hidden><slot name=\"header\"></slot></div><div class=\"body\"><slot></slot></div><div class=\"action\" hidden><slot name=\"action\"></slot></div><div class=\"mobile-action\" hidden><slot name=\"mobile-action\"></slot></div></div>";
	setup() {
		for (let e of Bn) {
			let t = this.shadowRoot.querySelector(`slot[name="${e}"]`), n = () => t.parentElement.hidden = t.assignedElements({ flatten: !0 }).length === 0;
			t.addEventListener("slotchange", n), n();
		}
	}
}).define();
//#endregion
//#region src/components/grid/grid.css?inline
var Vn = ":host{min-width:0;display:block}.grid{--card-min:var(--arq-layout-card-min);grid-template-columns:repeat(var(--columns,1), minmax(0, 1fr));gap:var(--arq-space-gap-lg);align-items:start;display:grid}.grid.auto{grid-template-columns:repeat(auto-fill, minmax(var(--card-min), 1fr));gap:var(--arq-space-gap-2xl) var(--arq-space-gap-lg)}@media (width>=1600px){.grid.auto{--card-min:var(--arq-layout-card-min-wide)}}::slotted(*){min-width:0}@media (width<=767px){.grid.auto{gap:var(--arq-space-gap-xl) var(--arq-space-gap-md)}.grid:not(.auto){gap:var(--arq-space-section-md);grid-template-columns:minmax(0,1fr)}:host([mobile=two-columns]) .grid{gap:var(--arq-space-gap-sm-md);grid-template-columns:repeat(2,minmax(0,1fr))}:host([mobile=carousel]){overscroll-behavior-x:contain;scroll-snap-type:x mandatory;scrollbar-width:none;margin-block:calc(var(--arq-space-gap-xs) * -1);margin-inline:calc(var(--arq-space-gap-xs) * -1) calc(var(--arq-layout-gutter) * -1);padding-block:var(--arq-space-gap-xs);padding-inline-start:var(--arq-space-gap-xs);scroll-padding-inline-start:var(--arq-space-gap-xs);overflow-x:auto;container-type:inline-size}:host([mobile=carousel])::-webkit-scrollbar{display:none}:host([mobile=carousel]) .grid{gap:var(--arq-space-gap-sm-md);width:max-content;padding-inline-end:var(--arq-layout-gutter);display:flex}:host([mobile=carousel]) ::slotted(*){width:calc((100cqi - var(--arq-layout-gutter)) * .8);scroll-snap-align:start;flex:none}}";
(class extends d {
	static tag = "arq-grid";
	static styles = Vn;
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
		}
	};
	static template = "<div class=\"grid\" part=\"grid\"><slot></slot></div>";
	update() {
		let e = this.shadowRoot.querySelector(".grid"), t = Math.trunc(this.columns);
		t > 0 ? e.style.setProperty("--columns", t) : e.style.removeProperty("--columns"), e.classList.toggle("auto", !(t > 0));
	}
}).define();
//#endregion
//#region src/components/project-mosaic/project-mosaic.css?inline
var Hn = ":host{min-width:0;display:block}.mosaic{gap:var(--arq-space-gap-lg);grid-template-rows:1fr 1fr;grid-template-columns:repeat(4,minmax(0,1fr));display:grid}::slotted(img){background:var(--arq-color-bg-subtle);min-width:0;box-sizing:border-box!important;object-fit:cover!important;width:100%!important;max-width:none!important;height:100%!important;display:block!important}::slotted(img:first-child){contain:size;grid-area:1/1/span 2/span 2}::slotted(img:nth-child(2)){contain:size;grid-area:1/3/auto/span 2}::slotted(img:nth-child(3)),::slotted(img:nth-child(4)){aspect-ratio:1;grid-row:2;height:auto!important}::slotted(img:nth-child(n+5)){display:none!important}@media (width<=767px){.mosaic{gap:var(--arq-space-gap-sm-md);grid-template-rows:none;grid-template-columns:repeat(2,minmax(0,1fr))}::slotted(img){aspect-ratio:4/5;contain:none;height:auto!important}::slotted(img:first-child){contain:none;grid-area:auto/1/auto/-1}::slotted(img:nth-child(2)),::slotted(img:nth-child(3)){aspect-ratio:4/5;contain:none;grid-area:auto}::slotted(img:nth-child(4)){display:none!important}}";
(class extends d {
	static tag = "arq-project-mosaic";
	static styles = Hn;
	static template = "<div class=\"mosaic\"><slot></slot></div>";
}).define();
//#endregion
//#region src/components/featured-products/featured-products.css?inline
var Un = ":host{min-width:0;display:block}.fallback{align-items:flex-start;gap:var(--arq-space-gap-sm);color:var(--arq-color-text-primary);flex-direction:column;display:flex}";
(class extends d {
	static tag = "arq-featured-products";
	static styles = Un;
	static template = "<arq-grid class=\"grid\" columns=\"4\" mobile=\"two-columns\"></arq-grid><div class=\"fallback role-body\" hidden><slot></slot></div>";
	#e = "";
	#t = 0;
	setup() {
		this.shadowRoot.querySelector("slot").addEventListener("slotchange", () => this.#n()), this.#n();
	}
	async #n() {
		let e = [...this.querySelectorAll(":scope > a[data-group]")].map((e) => e.dataset.group.trim()).filter(Boolean), t = e.join("\n");
		if (t === this.#e) return;
		this.#e = t;
		let n = ++this.#t;
		this.setAttribute("aria-busy", "true");
		let r = [];
		try {
			r = e.length ? await Qt(e) : [];
		} catch (e) {
			console.error("[arq] featured-products: no se pudo cargar el catálogo", e);
		}
		n === this.#t && (this.removeAttribute("aria-busy"), this.#r(r));
	}
	#r(e) {
		let t = this.shadowRoot;
		t.querySelector(".grid").replaceChildren(...e.map((e) => this.#i(e))), t.querySelector(".grid").hidden = e.length === 0, t.querySelector(".fallback").hidden = e.length > 0;
	}
	#i({ name: e, meta: t, href: n, image: r, imageHover: i, imageLit: a, imageHoverLit: o }) {
		let s = document.createElement("arq-product-card");
		s.href = n, s.image = r, s.imageHover = i, s.imageLit = a, s.imageHoverLit = o;
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
var Wn = ":host{box-sizing:border-box;min-width:0;padding:0 var(--arq-layout-gutter) var(--arq-space-section-xl);background:var(--arq-color-bg-default);display:block}.layout{gap:var(--arq-space-gap-xl);flex-direction:column;min-width:0;display:flex}.nav{min-width:0}.content{gap:var(--arq-space-gap-xl-2xl);flex-direction:column;min-width:0;display:flex}.status{color:var(--arq-color-text-secondary);margin:0}.status:empty{display:none}@media (width>=1024px){.layout{grid-template-columns:var(--arq-layout-card-min) minmax(0, 1fr);column-gap:var(--arq-space-section-sm);align-items:start;display:grid}}@media (width<=767px){.content{gap:var(--arq-space-gap-xl)}}", Gn = {
	environment: "environment",
	application: "application",
	product_type: "productType"
}, $ = {
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
}, Kn = class extends d {
	static tag = "arq-catalog-listing";
	static styles = Wn;
	static properties = { unit: {
		type: String,
		values: ["productos", "colecciones"],
		default: "productos"
	} };
	static template = "<div class=\"layout\"><div class=\"nav\"><slot name=\"nav\"></slot></div><div class=\"content\"><arq-catalog-toolbar class=\"toolbar\" for=\"filters\" show-iluminar></arq-catalog-toolbar><p class=\"status role-body\" role=\"status\"></p><arq-grid class=\"grid\"></arq-grid></div></div><arq-filter-panel id=\"filters\"><slot name=\"filter-title\" slot=\"title\"></slot></arq-filter-panel><arq-compare-bar class=\"compare\"></arq-compare-bar><div class=\"compare-space\" aria-hidden=\"true\"></div>";
	#e = {};
	#t = {};
	#n = /* @__PURE__ */ new Map();
	#r = 0;
	setup() {
		let e = this.shadowRoot;
		this.#e = qn(), e.querySelector("slot[name=\"nav\"]").addEventListener("slotchange", () => this.#p());
		let t = e.querySelector("arq-filter-panel");
		t.addEventListener("arq:filters", (e) => this.#s(e.detail.filters)), t.addEventListener("arq:apply", (e) => {
			this.#t = e.detail.filters, this.#a();
		});
		let n = e.querySelector(".grid"), r = e.querySelector(".compare");
		n.addEventListener("arq:compare", (e) => {
			let t = e.target, n = this.#n.get(t);
			n && (e.detail.checked ? r.add({
				sku: n.sku,
				name: n.name,
				meta: n.meta,
				image: n.image
			}) || (t.compared = !1) : r.remove(n.sku));
		}), r.addEventListener("arq:compare-change", () => {
			this.#d(), requestAnimationFrame(() => this.#i());
		}), new ResizeObserver(() => this.#i()).observe(r), requestAnimationFrame(() => this.#i());
	}
	#i() {
		let e = this.shadowRoot.querySelector(".compare"), t = e.shadowRoot?.querySelector(".bar"), n = !e.hidden && t && !t.hidden ? t.getBoundingClientRect().height : 0;
		this.shadowRoot.querySelector(".compare-space").style.height = n ? `${n}px` : "";
	}
	update(e) {
		if (!e.has("unit")) return;
		let t = this.shadowRoot;
		t.querySelector(".toolbar").unit = this.unit, t.querySelector("arq-filter-panel").unit = this.unit, t.querySelector(".compare").hidden = this.unit !== "productos", this.#a({ rows: !0 });
	}
	async #a({ rows: e = !1 } = {}) {
		let t = ++this.#r, n = $[this.unit] ?? $.productos;
		this.setAttribute("aria-busy", "true"), e && this.#c(n.loading);
		let r = null;
		try {
			r = await this.#o(this.#t);
		} catch (e) {
			console.error("[arq] catalog-listing: no se pudo cargar el catálogo", e);
		}
		if (t !== this.#r) return;
		this.removeAttribute("aria-busy");
		let i = this.shadowRoot.querySelector(".toolbar");
		if (!r) {
			i.count = null, this.#l([]), this.#c(n.error);
			return;
		}
		e && this.#f(r.filters), i.count = r.count, this.#l(r.cards), this.#c(r.count ? "" : n.empty);
	}
	#o(e) {
		return this.unit === "colecciones" ? Zt({ filters: e }) : Xt({
			...this.#e,
			filters: e
		});
	}
	async #s(e) {
		let t = this.shadowRoot.querySelector("arq-filter-panel");
		try {
			t.count = (await this.#o(e)).count;
		} catch {
			t.count = null;
		}
	}
	#c(e) {
		let t = this.shadowRoot.querySelector(".status");
		t.textContent = e, t.hidden = !e;
	}
	#l(e) {
		let t = this.unit === "productos";
		this.#n = new Map(e.map((e) => [this.#u(e, t), e])), this.shadowRoot.querySelector(".grid").replaceChildren(...this.#n.keys()), t && this.#d();
	}
	#u(e, t) {
		let n = document.createElement("arq-product-card");
		n.href = e.href, n.image = e.image, n.imageHover = e.imageHover, n.imageLit = e.imageLit, n.imageHoverLit = e.imageHoverLit, n.showCompare = t;
		let r = document.createElement("h2");
		if (r.slot = "name", r.textContent = e.name, n.append(r), t) for (let t of e.finishes ?? []) {
			let e = document.createElement("arq-swatch");
			e.slot = "finishes", e.textContent = t, n.append(e);
		}
		else if (e.meta) {
			let t = document.createElement("span");
			t.slot = "meta", t.textContent = e.meta, n.append(t);
		}
		return n;
	}
	#d() {
		let e = this.shadowRoot.querySelector(".compare");
		for (let [t, n] of this.#n) t.compared = e.has(n.sku);
	}
	#f(e) {
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
		this.#s({});
	}
	#p() {
		let e = this.shadowRoot.querySelector("slot[name=\"nav\"]").assignedElements()[0];
		if (!e) return;
		let t = location.pathname + location.search;
		for (let n of e.querySelectorAll("arq-catalog-nav-item")) {
			let e = n.getAttribute("href");
			n.selected = !!e && Jn(e, t);
		}
	}
};
function qn() {
	let e = new URLSearchParams(location.search), t = {};
	for (let [n, r] of Object.entries(Gn)) {
		let i = e.get(n);
		i && (t[r] = i);
	}
	return t;
}
function Jn(e, t) {
	let n = new URL(e, location.href), r = (e) => [...new URLSearchParams(e)].sort().join("&"), i = new URL(t, location.href);
	return n.pathname.replace(/\/$/, "") === i.pathname.replace(/\/$/, "") && r(n.search) === r(i.search);
}
//#endregion
//#region src/main.js
Kn.define(), window.Arq || (window.Arq = Object.freeze({ version: e }));
//#endregion
