//#region package.json
var e = "0.1.0", t, n, r, i = /* @__PURE__ */ new Map();
function a(e) {
	let t = new CSSStyleSheet();
	return t.replaceSync(e), t;
}
function o() {
	return t ??= a(".role-display{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-light);font-size:var(--arq-type-display-size);line-height:var(--arq-type-display-leading);letter-spacing:var(--arq-font-tracking-tighter)}.role-display-sm{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-light);font-size:var(--arq-type-display-sm-size);line-height:var(--arq-type-display-sm-leading);letter-spacing:var(--arq-font-tracking-tight)}.role-heading-1{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-light);font-size:var(--arq-type-heading-1-size);line-height:var(--arq-type-heading-1-leading);letter-spacing:var(--arq-font-tracking-tight)}.role-heading-2{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-light);font-size:var(--arq-type-heading-2-size);line-height:var(--arq-type-heading-2-leading);letter-spacing:var(--arq-font-tracking-normal)}.role-heading-3{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-regular);font-size:var(--arq-type-heading-3-size);line-height:var(--arq-type-heading-3-leading);letter-spacing:var(--arq-font-tracking-normal)}.role-body-xl{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-regular);font-size:var(--arq-type-body-xl-size);line-height:var(--arq-type-body-xl-leading);letter-spacing:var(--arq-font-tracking-normal)}.role-body-lg{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-light);font-size:var(--arq-type-body-lg-size);line-height:var(--arq-type-body-lg-leading);letter-spacing:var(--arq-font-tracking-normal)}.role-body-lg-regular{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-regular);font-size:var(--arq-type-body-lg-size);line-height:var(--arq-type-body-lg-leading);letter-spacing:var(--arq-font-tracking-normal)}.role-body-lg-medium{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-medium);font-size:var(--arq-type-body-lg-size);line-height:var(--arq-type-body-lg-leading);letter-spacing:var(--arq-font-tracking-normal)}.role-body{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-light);font-size:var(--arq-type-body-size);line-height:var(--arq-type-body-leading);letter-spacing:var(--arq-font-tracking-normal)}.role-body-regular{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-regular);font-size:var(--arq-type-body-size);line-height:var(--arq-type-body-leading);letter-spacing:var(--arq-font-tracking-normal)}.role-body-medium{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-medium);font-size:var(--arq-type-body-size);line-height:var(--arq-type-body-leading);letter-spacing:var(--arq-font-tracking-normal)}.role-body-strong{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-semibold);font-size:var(--arq-type-body-size);line-height:var(--arq-type-body-leading);letter-spacing:var(--arq-font-tracking-normal)}.role-body-sm{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-regular);font-size:var(--arq-type-body-sm-size);line-height:var(--arq-type-body-sm-leading);letter-spacing:var(--arq-font-tracking-normal)}.role-body-sm-medium{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-medium);font-size:var(--arq-type-body-sm-size);line-height:var(--arq-type-body-sm-leading);letter-spacing:var(--arq-font-tracking-normal)}.role-label{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-regular);font-size:var(--arq-type-label-size);line-height:var(--arq-type-label-leading);letter-spacing:var(--arq-font-tracking-widest);text-transform:uppercase}.role-label-sm{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-medium);font-size:var(--arq-type-label-sm-size);line-height:var(--arq-type-label-sm-leading);letter-spacing:var(--arq-font-tracking-widest);text-transform:uppercase}.role-caption{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-regular);font-size:var(--arq-type-caption-size);line-height:var(--arq-type-caption-leading);letter-spacing:var(--arq-font-tracking-wide)}.role-caption-medium{font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-medium);font-size:var(--arq-type-caption-size);line-height:var(--arq-type-caption-leading);letter-spacing:var(--arq-font-tracking-wide)}"), t;
}
function s() {
	return n ??= a("[data-arq-theme=dark]{--arq-color-bg-default:var(--arq-neutral-800);--arq-color-bg-subtle:var(--arq-neutral-750);--arq-color-bg-inverse:var(--arq-neutral-0);--arq-color-surface-default:var(--arq-neutral-800);--arq-color-surface-faint:var(--arq-neutral-775);--arq-color-surface-hover:var(--arq-neutral-775);--arq-color-surface-soft:var(--arq-neutral-725);--arq-color-surface-subtle:var(--arq-neutral-750);--arq-color-surface-selected:var(--arq-neutral-725);--arq-color-surface-strong:var(--arq-neutral-700);--arq-color-surface-inverse:var(--arq-neutral-0);--arq-color-surface-inverse-hover:var(--arq-neutral-150);--arq-color-surface-inverse-pressed:var(--arq-neutral-200);--arq-color-text-primary:var(--arq-neutral-100);--arq-color-text-secondary:var(--arq-neutral-200);--arq-color-text-tertiary:var(--arq-neutral-500);--arq-color-text-inverse:var(--arq-neutral-800);--arq-color-text-accent:var(--arq-neutral-150);--arq-color-text-disabled:var(--arq-neutral-600);--arq-color-text-error:var(--arq-red-300);--arq-color-text-success:var(--arq-green-300);--arq-color-text-warning:var(--arq-amber-300);--arq-color-icon-primary:var(--arq-neutral-100);--arq-color-icon-secondary:var(--arq-neutral-200);--arq-color-icon-tertiary:var(--arq-neutral-500);--arq-color-icon-accent:var(--arq-neutral-150);--arq-color-icon-inverse:var(--arq-neutral-800);--arq-color-icon-disabled:var(--arq-neutral-600);--arq-color-border-subtle:var(--arq-alpha-white-10);--arq-color-border-default:var(--arq-alpha-white-22);--arq-color-border-strong:var(--arq-neutral-0);--arq-color-border-disabled:var(--arq-alpha-white-10);--arq-color-border-focus:var(--arq-neutral-150);--arq-color-border-error:var(--arq-red-300);--arq-color-action-primary:var(--arq-neutral-100);--arq-color-action-primary-hover:var(--arq-neutral-200);--arq-color-action-on-primary:var(--arq-neutral-900);--arq-color-accent-default:var(--arq-neutral-150)}"), n;
}
function c() {
	return r ??= a("[data-arq-theme=light]{--arq-color-bg-default:var(--arq-neutral-0);--arq-color-bg-subtle:var(--arq-neutral-100);--arq-color-bg-inverse:var(--arq-neutral-900);--arq-color-surface-default:var(--arq-neutral-0);--arq-color-surface-faint:var(--arq-neutral-25);--arq-color-surface-hover:var(--arq-neutral-50);--arq-color-surface-soft:var(--arq-neutral-75);--arq-color-surface-subtle:var(--arq-neutral-100);--arq-color-surface-selected:var(--arq-neutral-150);--arq-color-surface-strong:var(--arq-neutral-200);--arq-color-surface-inverse:var(--arq-neutral-900);--arq-color-surface-inverse-hover:var(--arq-neutral-750);--arq-color-surface-inverse-pressed:var(--arq-neutral-600);--arq-color-text-primary:var(--arq-neutral-900);--arq-color-text-secondary:var(--arq-neutral-750);--arq-color-text-tertiary:var(--arq-neutral-600);--arq-color-text-inverse:var(--arq-neutral-0);--arq-color-text-accent:var(--arq-neutral-900);--arq-color-text-disabled:var(--arq-neutral-400);--arq-color-text-error:var(--arq-red-600);--arq-color-text-success:var(--arq-green-600);--arq-color-text-warning:var(--arq-amber-600);--arq-color-icon-primary:var(--arq-neutral-900);--arq-color-icon-secondary:var(--arq-neutral-750);--arq-color-icon-tertiary:var(--arq-neutral-600);--arq-color-icon-accent:var(--arq-neutral-900);--arq-color-icon-inverse:var(--arq-neutral-0);--arq-color-icon-disabled:var(--arq-neutral-400);--arq-color-border-subtle:var(--arq-alpha-ink-10);--arq-color-border-default:var(--arq-alpha-ink-22);--arq-color-border-strong:var(--arq-neutral-900);--arq-color-border-disabled:var(--arq-neutral-200);--arq-color-border-focus:var(--arq-neutral-900);--arq-color-border-error:var(--arq-red-600);--arq-color-action-primary:var(--arq-neutral-900);--arq-color-action-primary-hover:var(--arq-neutral-750);--arq-color-action-on-primary:var(--arq-neutral-0);--arq-color-accent-default:var(--arq-neutral-900)}"), r;
}
function l(e, ...t) {
	let n = [
		o(),
		s(),
		c()
	];
	for (let e of t) e && (i.has(e) || i.set(e, a(e)), n.push(i.get(e)));
	e.adoptedStyleSheets = [...n, ...e.adoptedStyleSheets.filter((e) => !n.includes(e))];
}
//#endregion
//#region src/base/arq-element.js
var u = (e) => e.replace(/[A-Z]/g, (e) => `-${e.toLowerCase()}`), d = /* @__PURE__ */ new WeakMap(), ee = "\n:host {\n  --page-gutter: max(var(--arq-layout-gutter), (100vw - var(--arq-layout-max-width)) / 2);\n}\n\n:host([hidden]),\n[hidden] {\n  display: none !important;\n}\n\n*,\n*::before,\n*::after {\n  transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke;\n  transition-duration: var(--arq-motion-duration-fast);\n  transition-timing-function: var(--arq-motion-easing-standard);\n}\n\n.visually-hidden {\n  position: absolute;\n  width: var(--arq-border-default);\n  height: var(--arq-border-default);\n  margin: calc(-1 * var(--arq-border-default));\n  overflow: hidden;\n  clip-path: inset(50%);\n  white-space: nowrap;\n}\n\n::slotted(h1),\n::slotted(h2),\n::slotted(h3),\n::slotted(h4),\n::slotted(h5),\n::slotted(h6) {\n  margin: 0 !important;\n  font: inherit !important;\n  letter-spacing: inherit !important;\n  text-transform: inherit !important;\n  color: inherit !important;\n}\n", f = class e extends HTMLElement {
	static tag = "";
	static styles = "";
	static template = "";
	static properties = {};
	static get observedAttributes() {
		return Object.entries(this.properties).map(([e, t]) => t.attribute ?? u(e));
	}
	static define() {
		if (!this.tag) throw Error(`${this.name}: falta static tag`);
		return customElements.get(this.tag) ? this : (e.#e.call(this), customElements.define(this.tag, this), this);
	}
	static #e() {
		this.attributeToProp = /* @__PURE__ */ new Map();
		for (let [e, t] of Object.entries(this.properties)) {
			let n = t.attribute ?? u(e);
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
		l(e, ee, this.constructor.styles);
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
		if (!d.has(e)) {
			let t = document.createElement("template");
			t.innerHTML = e.template, d.set(e, t);
		}
		return d.get(e);
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
}, te = {
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
Object.freeze(Object.keys(te));
function p(e) {
	let t = te[e];
	return t ? `<svg class="icon" data-icon="${e}" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1" aria-hidden="true" focusable="false">${t}</svg>` : "";
}
//#endregion
//#region src/components/count-badge/count-badge.css?inline
var ne = ":host{vertical-align:middle;flex:none;display:inline-flex;position:relative}:host(:state(empty)){display:none}.badge{box-sizing:border-box;min-width:calc(var(--arq-type-caption-leading) + var(--arq-space-padding-2xs) * 2);padding:var(--arq-space-padding-2xs) var(--arq-space-padding-xs);border-radius:var(--arq-radius-control);background:var(--arq-color-action-primary);color:var(--arq-color-action-on-primary);text-align:center;white-space:nowrap;font-variant-numeric:tabular-nums;justify-content:center;align-items:center;display:inline-flex}.visually-hidden{width:var(--arq-border-default);height:var(--arq-border-default);clip-path:inset(50%);white-space:nowrap;position:absolute;overflow:hidden}:host([tone=inverse]) .badge{background:var(--arq-color-action-on-primary);color:var(--arq-color-action-primary)}", re = 99;
(class extends f {
	static tag = "arq-count-badge";
	static styles = ne;
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
		this.shadowRoot.querySelector(".badge").textContent = this.count > re ? `${re}+` : t, this.shadowRoot.querySelector(".visually-hidden").textContent = t, e ? this.#e.states.add("empty") : this.#e.states.delete("empty");
	}
}).define();
//#endregion
//#region src/components/button/button.css?inline
var ie = ":host{vertical-align:middle;min-width:0;max-width:100%;display:inline-flex}.control{box-sizing:border-box;justify-content:center;align-items:center;gap:var(--arq-space-gap-sm);max-width:100%;padding:var(--arq-space-gap-sm) var(--arq-space-padding-md);border-radius:var(--arq-radius-control);background:var(--arq-color-action-primary);color:var(--arq-color-action-on-primary);cursor:pointer;-webkit-tap-highlight-color:var(--arq-color-surface-transparent);border:0;flex:auto;margin:0;text-decoration:none;display:inline-flex;position:relative}.text{min-width:0;display:flex;position:relative}.label{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.leading,.trailing{flex:none;display:inline-flex}.icon{width:var(--arq-icon-md);height:var(--arq-icon-md)}.control:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.control:focus:not(:focus-visible){outline:none}.control.inactive{cursor:default}.control:not(.inactive):hover{background:var(--arq-color-action-primary-hover)}.control:not(.inactive):active{background:var(--arq-color-surface-inverse-pressed)}.control.inactive{background:var(--arq-color-surface-subtle);color:var(--arq-color-text-disabled)}.control[aria-busy=true]{background:var(--arq-color-action-primary-hover);color:var(--arq-color-action-on-primary)}.visually-hidden{width:var(--arq-border-default);height:var(--arq-border-default);clip-path:inset(50%);white-space:nowrap;position:absolute;overflow:hidden}:host([type=outline]) .control{padding:calc(var(--arq-space-gap-sm) - var(--arq-border-default)) calc(var(--arq-space-padding-md) - var(--arq-border-default));border:var(--arq-border-default) solid var(--arq-color-border-strong);background:var(--arq-color-surface-transparent);color:var(--arq-color-action-primary)}:host([type=outline]) .control:not(.inactive):hover{background:var(--arq-color-surface-hover)}:host([type=outline]) .control:not(.inactive):active{background:var(--arq-color-surface-selected)}:host([type=outline]) .control.inactive{border-color:var(--arq-color-border-disabled);background:var(--arq-color-surface-transparent);color:var(--arq-color-text-disabled)}:host([type=underline]) .control{padding:var(--arq-space-gap-xs) 0;background:var(--arq-color-surface-transparent);color:var(--arq-color-action-primary)}:host([type=underline]) .text:after{content:\"\";inset-inline:0;top:calc(100% + var(--arq-space-padding-2xs) - var(--arq-border-default));height:var(--arq-border-default);background:var(--arq-color-border-strong);visibility:hidden;position:absolute}:host([type=underline][show-underline]) .text:after,:host([type=underline]) .control:not(.inactive):hover .text:after,:host([type=underline]) .control:not(.inactive):active .text:after{visibility:visible}:host([type=underline]) .control:not(.inactive):hover .text:after,:host([type=underline]) .control:not(.inactive):active .text:after{height:var(--arq-border-strong)}:host([type=underline]) .control:not(.inactive):active{color:var(--arq-color-text-tertiary)}:host([type=underline]) .control:not(.inactive):active .text:after{background:var(--arq-color-text-tertiary)}:host([type=underline]) .control.inactive{background:var(--arq-color-surface-transparent);color:var(--arq-color-text-disabled)}:host([type=underline]) .control.inactive .text:after{background:var(--arq-color-border-disabled)}", ae = "Enviando…";
(class extends f {
	static tag = "arq-button";
	static styles = ie;
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
		href: { type: String },
		target: { type: String },
		submit: { type: Boolean }
	};
	static template = `
    <button type="button" class="control role-body-regular">
      <span class="leading" hidden></span>
      <span class="text">
        <span class="label"><slot></slot><span class="visually-hidden" hidden></span></span>
        <span class="label" data-loading hidden>${ae}</span>
      </span>
      <arq-count-badge class="count" hidden></arq-count-badge>
      <span class="trailing" hidden></span>
    </button>
  `.replace(/>\s+</g, "><").trim();
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
		e.has("href") && this.#n(), e.has("loading") && this.loading && this.type;
		let t = this.shadowRoot, n = this.#e, r = this.loading, i = this.disabled || r;
		n.classList.toggle("inactive", i), r ? (n.setAttribute("aria-busy", "true"), n.setAttribute("aria-label", ae)) : (n.removeAttribute("aria-busy"), n.removeAttribute("aria-label")), n.localName === "button" ? n.disabled = i : (i ? (n.removeAttribute("href"), n.setAttribute("aria-disabled", "true")) : (n.setAttribute("href", this.href), n.removeAttribute("aria-disabled")), this.target ? n.setAttribute("target", this.target) : n.removeAttribute("target"), this.target === "_blank" ? n.setAttribute("rel", "noopener") : n.removeAttribute("rel")), t.querySelector(".label:not([data-loading])").hidden = r, t.querySelector(".label[data-loading]").hidden = !r;
		let a = t.querySelector(".leading");
		e.has("leadingIcon") && (a.innerHTML = p(this.leadingIcon)), a.hidden = !this.showLeadingIcon || r;
		let o = t.querySelector(".trailing");
		e.has("icon") && (o.innerHTML = p(this.icon)), o.hidden = !this.showIcon || r;
		let s = t.querySelector(".count"), c = this.showCount && !!this.count && !r;
		this.count ? s.setAttribute("count", this.count) : s.removeAttribute("count"), s.setAttribute("tone", this.type === "filled" ? "inverse" : "primary"), s.hidden = !c;
		let l = t.querySelector(".visually-hidden"), u = this.countLabel?.trim();
		l.textContent = u ? `, ${this.count} ${u}` : "", l.hidden = !c || !u, c && u ? s.setAttribute("aria-hidden", "true") : s.removeAttribute("aria-hidden");
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
var oe = ":host{box-sizing:border-box;width:100%;height:var(--arq-border-default);background:var(--arq-color-border-subtle);flex:none;display:block}:host([emphasis=default]){background:var(--arq-color-border-default)}:host([orientation=vertical]){width:var(--arq-border-default);align-self:stretch;height:auto;display:inline-block}";
(class extends f {
	static tag = "arq-divider";
	static styles = oe;
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
var se = ":host{vertical-align:middle;color:var(--arq-color-text-primary);flex:none;display:inline-flex}.link{color:inherit;display:inline-flex}.link:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.link:focus:not(:focus-visible){outline:none}.mark{aspect-ratio:181/16;width:181px;height:auto;display:block}:host([size=small]) .mark{width:158px}:host([size=compact]) .mark{width:117px}", ce = "Macroled Arq, inicio", le = "<svg class=\"mark\" viewBox=\"0 0 181 16\" fill=\"currentColor\" aria-hidden=\"true\" focusable=\"false\">" + [
	"M13.2112 1.03819C13.5552 0.538809 14.1401 0.243121 14.7662 0.243121H16.9337V15.6977H13.452V7.16879C13.452 6.99138 13.2112 6.92567 13.108 7.07023L8.62167 13.4637C8.54598 13.5688 8.38772 13.5688 8.31203 13.4637L3.80509 7.07023C3.70188 6.92567 3.46793 6.99138 3.46793 7.16879V15.6977H0V0.243121H2.16746C2.79361 0.243121 3.37848 0.538809 3.72252 1.03819L8.31203 7.76674C8.38772 7.87187 8.55286 7.87187 8.62855 7.76674L13.2112 1.03819ZM35.0922 15.6977H31.1564L30.5233 14.1799C30.5233 14.1799 30.5233 14.1667 30.5164 14.1602C30.1518 13.306 29.4362 13.1351 28.5623 13.1351H23.5943L22.5209 15.6977H18.592L24.8604 1.07105C25.0806 0.571663 25.5898 0.243121 26.1609 0.243121H28.4591L28.4797 0.295688L35.0853 15.6977H35.0922ZM29.0095 10.2571L27.021 5.46037C26.9591 5.30924 26.7389 5.30924 26.6769 5.46037L24.6677 10.2637H29.0164L29.0095 10.2571ZM47.6703 10.7828C47.6703 10.7828 46.2873 12.6949 43.5487 12.6949C42.1657 12.6949 41.0235 12.2546 40.0533 11.361C39.1175 10.4476 38.6633 9.34374 38.6633 7.98357C38.6633 6.62341 39.1175 5.51951 40.0533 4.60616C41.0166 3.71253 42.1657 3.27228 43.5487 3.27228C45.1244 3.27228 46.4455 3.85051 47.4914 4.99384L47.5534 5.05955L49.191 2.51663C49.2804 2.37207 49.2529 2.18152 49.1222 2.06324C47.574 0.742505 45.6405 0.0197125 43.5487 0.0197125C41.1542 0.0197125 39.1725 0.755647 37.4936 2.28008C36.0073 3.64682 35.0096 5.85462 35.0096 7.977C35.0096 10.2702 35.8216 12.1363 37.4936 13.6739C39.1725 15.1918 41.1542 15.9343 43.5487 15.9343C45.7024 15.9343 47.6979 15.1721 49.2598 13.7725C49.3905 13.6542 49.4181 13.4702 49.3217 13.3257L47.6703 10.7828ZM60.9985 9.66571C60.9022 9.7117 60.8677 9.82998 60.9297 9.9154L64.9068 15.6912H61.4113C60.9297 15.6912 60.4755 15.4481 60.2209 15.0604L57.331 10.6053H55.1291V15.6912H51.4617V3.48912V0.243121H58.198C59.7118 0.243121 61.0122 0.742505 62.065 1.7347C63.1522 2.72033 63.682 3.90965 63.682 5.36838C63.682 7.22793 62.5811 8.88378 60.9916 9.66571M55.1291 7.27392C55.1291 7.37248 55.2117 7.45134 55.3149 7.45134H57.8127C59.1407 7.45134 59.9939 6.64969 59.9939 5.41437C59.9939 4.31704 59.1819 3.48912 58.1085 3.48912H55.1291V7.27392ZM79.7281 2.32608C81.3795 3.86366 82.2121 5.77577 82.2121 8.00329C82.2121 10.2374 81.3864 12.1561 79.7487 13.7002C78.1042 15.2312 76.0881 16.0066 73.7349 16.0066C71.4092 16.0066 69.3862 15.2312 67.7279 13.7002C66.0903 12.1561 65.2646 10.2374 65.2646 8.00329C65.2646 5.78234 66.0903 3.87023 67.7279 2.32608C69.3862 0.78193 71.4092 0 73.7418 0C76.0881 0 78.0973 0.78193 79.735 2.32608M68.9665 8.00329C68.9665 9.34374 69.4206 10.4476 70.3495 11.3676C71.2647 12.2546 72.4069 12.708 73.7418 12.708C75.0904 12.708 76.1913 12.2612 77.1134 11.3478C78.0423 10.4411 78.5171 9.31745 78.5171 8.00329C78.5171 6.70883 78.056 5.59179 77.1409 4.67844C76.2189 3.75852 75.0766 3.29199 73.7486 3.29199C72.4206 3.29199 71.2784 3.75852 70.3564 4.67844C69.4413 5.58522 68.9734 6.70883 68.9734 8.00329M86.6433 0.243121H84.2832V3.48912V15.6977H94.164V12.3598H88.2328C88.1296 12.3598 88.047 12.2809 88.047 12.1823V1.577C88.047 0.841068 87.4208 0.243121 86.6433 0.243121ZM100.185 12.4517C100.082 12.4517 99.999 12.3729 99.999 12.2743V9.37659H105.951V6.16345H100.192C100.088 6.16345 100.006 6.0846 100.006 5.98604V3.48912H105.779C106.55 3.48912 107.183 2.89117 107.183 2.15524V0.243121H96.3177V15.6977H107.492V12.4517H100.192H100.185ZM124.364 8.00329C124.364 10.3359 123.621 12.2218 122.148 13.6148C120.71 15.0012 118.598 15.7043 115.866 15.7043H109.928V0.243121H115.846C118.557 0.243121 120.669 0.965914 122.128 2.39836C123.614 3.80452 124.364 5.69035 124.364 8.00329ZM113.623 12.2678C113.623 12.3663 113.706 12.4452 113.809 12.4452H115.639C119.052 12.4452 120.641 11.0324 120.641 7.99672C120.641 6.59055 120.256 5.47351 119.506 4.68501C118.77 3.88994 117.463 3.48912 115.612 3.48912H113.616V12.2743L113.623 12.2678Z",
	"M141.655 1.64271H140.912L135.532 15.5006H134.142L139.977 0.512526H142.578L148.385 15.5072H147.016L141.655 1.64928V1.64271ZM136.722 10.2374H145.873V11.3741H136.722V10.2374Z",
	"M156.89 0.512526C158.128 0.512526 159.133 0.70308 159.903 1.09076C160.674 1.47844 161.245 1.99754 161.617 2.65462C161.988 3.3117 162.174 4.05421 162.174 4.88214C162.174 5.49322 162.071 6.06489 161.858 6.59713C161.651 7.12279 161.328 7.58932 160.894 7.977C160.461 8.37125 159.917 8.68008 159.257 8.91006C158.596 9.14004 157.819 9.25175 156.924 9.25175H153.023V15.5072H151.653V0.512526H156.883H156.89ZM160.791 4.88214C160.791 3.89651 160.495 3.11458 159.897 2.5232C159.298 1.9384 158.293 1.64271 156.89 1.64271H153.029V8.08871H156.931C157.825 8.08871 158.562 7.95072 159.126 7.68131C159.69 7.41191 160.11 7.0308 160.385 6.54456C160.653 6.05832 160.791 5.4998 160.791 4.87557V4.88214ZM158.073 8.75893L162.449 15.5072H160.901L156.594 8.75893H158.073Z",
	"M180.415 4.91499C180.023 3.98193 179.486 3.17372 178.791 2.49692C178.096 1.82012 177.277 1.29446 176.349 0.919918C175.413 0.551951 174.401 0.361396 173.307 0.361396C172.213 0.361396 171.174 0.54538 170.232 0.919918C169.289 1.29446 168.47 1.81355 167.761 2.49692C167.059 3.17372 166.516 3.98193 166.137 4.91499C165.759 5.84805 165.566 6.87967 165.566 8.00986C165.566 9.14004 165.759 10.1717 166.137 11.1047C166.516 12.0378 167.059 12.846 167.761 13.5228C168.463 14.1996 169.289 14.7253 170.232 15.0998C171.174 15.4743 172.199 15.6583 173.307 15.6583C174.415 15.6583 175.413 15.4743 176.349 15.0998C177.284 14.7318 178.096 14.2062 178.791 13.5228C179.486 12.846 180.03 12.0378 180.415 11.1047C180.8 10.1717 181 9.14004 181 8.00986C181 6.87967 180.807 5.84805 180.415 4.91499ZM178.771 11.4793C178.206 12.4517 177.456 13.2008 176.507 13.7265C175.557 14.2522 174.491 14.5216 173.307 14.5216C172.124 14.5216 171.037 14.2587 170.08 13.7265C169.124 13.2008 168.367 12.4517 167.803 11.4793C167.238 10.5068 166.963 9.35031 166.963 8.00986C166.963 6.6694 167.245 5.50637 167.803 4.52731C168.367 3.54825 169.124 2.79918 170.08 2.28008C171.037 1.76099 172.117 1.49815 173.307 1.49815C174.498 1.49815 175.55 1.76099 176.507 2.28008C177.456 2.79918 178.213 3.54825 178.771 4.52731C179.335 5.50637 179.61 6.66283 179.61 8.00986C179.61 9.35688 179.328 10.5068 178.771 11.4793Z",
	"M176.698 10.9485L175.745 11.8591L179.598 15.539L180.552 14.6283L176.698 10.9485Z"
].map((e) => `<path d="${e}"/>`).join("") + "</svg>";
(class extends f {
	static tag = "arq-logo";
	static styles = se;
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
	static template = `<a class="link" aria-label="${ce}">${le}</a>`;
	update(e) {
		e.has("href") && this.shadowRoot.querySelector(".link").setAttribute("href", this.href);
	}
}).define();
//#endregion
//#region src/components/icon-button/icon-button.css?inline
var ue = ":host{vertical-align:middle;color:var(--arq-color-icon-primary);flex:none;display:inline-flex}.control{box-sizing:border-box;padding:var(--arq-space-padding-xs);border-radius:var(--arq-radius-control);background:var(--arq-color-surface-transparent);color:inherit;cursor:pointer;-webkit-tap-highlight-color:var(--arq-color-surface-transparent);border:0;justify-content:center;align-items:center;margin:0;display:inline-flex;position:relative}.glyph{display:inline-flex}.icon{width:var(--arq-icon-md);height:var(--arq-icon-md)}:host([size=large]) .control{padding:var(--arq-space-padding-sm-md)}:host([size=large]) .icon{width:var(--arq-icon-xl);height:var(--arq-icon-xl)}.control:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.control:focus:not(:focus-visible){outline:none}.visually-hidden{width:var(--arq-border-default);height:var(--arq-border-default);clip-path:inset(50%);white-space:nowrap;position:absolute;overflow:hidden}.control:enabled:hover{background:var(--arq-color-surface-hover)}.control:enabled:active{background:var(--arq-color-surface-selected)}:host([background=surface]) .control{background:var(--arq-color-surface-default)}:host([background=surface]) .control:enabled:hover{background:var(--arq-color-surface-subtle)}:host([background=surface]) .control:enabled:active{background:var(--arq-color-surface-selected)}:host([background=subtle]) .control{background:var(--arq-color-surface-subtle)}:host([background=subtle]) .control:enabled:hover{background:var(--arq-color-surface-selected)}:host([background=subtle]) .control:enabled:active{background:var(--arq-color-surface-strong)}.control:disabled{color:var(--arq-color-icon-disabled);cursor:default}:host([background=outline]) .control{padding:calc(var(--arq-space-padding-xs) - var(--arq-border-default));border:var(--arq-border-default) solid var(--arq-color-border-strong)}:host([background=outline][size=large]) .control{padding:calc(var(--arq-space-padding-sm-md) - var(--arq-border-default))}:host([background=outline]) .control:disabled{border-color:var(--arq-color-border-disabled)}";
(class extends f {
	static tag = "arq-icon-button";
	static styles = ue;
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
		e.has("icon") && (this.shadowRoot.querySelector(".glyph").innerHTML = p(this.icon)), this.#e.disabled = this.disabled;
	}
	#t() {
		this.textContent.trim() || console.warn(`[arq] <arq-icon-button icon="${this.icon}"> no tiene nombre accesible: escribí qué hace entre las etiquetas (p. ej. <arq-icon-button icon="search">Buscar</arq-icon-button>).`);
	}
}).define();
//#endregion
//#region src/components/breadcrumb-item/breadcrumb-item.css?inline
var de = ":host{min-width:0;display:inline-flex}.item{align-items:center;gap:var(--arq-space-gap-sm);min-width:0;color:var(--arq-color-text-tertiary);display:inline-flex}.label{color:inherit;text-overflow:ellipsis;white-space:nowrap;text-decoration:none;overflow:hidden}.label[aria-current=page]{white-space:normal;overflow-wrap:break-word;overflow:visible}.separator{color:var(--arq-color-text-tertiary);flex:none}@media (hover:hover){a.label:hover{color:var(--arq-color-text-primary)}}.label[aria-current=page]{color:var(--arq-color-text-primary)}a.label:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}a.label:focus:not(:focus-visible){outline:none}";
(class extends f {
	static tag = "arq-breadcrumb-item";
	static styles = de;
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
var fe = ":host{min-width:0;display:block}.list{align-items:flex-start;gap:var(--arq-space-gap-sm);flex-wrap:nowrap;min-width:0;margin:0;padding:0;list-style:none;display:flex}::slotted(*){flex:0 auto;min-width:0}::slotted([current]){flex-shrink:1000;min-width:auto}", pe = "Migas de pan";
(class extends f {
	static tag = "arq-breadcrumb";
	static styles = fe;
	static template = `<nav aria-label="${pe}"><div class="list" role="list"><slot></slot></div></nav>`;
}).define();
//#endregion
//#region src/components/footer-link/footer-link.css?inline
var me = ":host{vertical-align:middle;max-width:100%;display:inline-flex}.link{align-items:center;gap:var(--arq-space-gap-sm);max-width:100%;color:var(--arq-color-text-secondary);text-decoration:none;display:inline-flex;position:relative}.label{overflow-wrap:break-word;min-width:0}.leading{flex:none;display:inline-flex}.icon{width:var(--arq-icon-md);height:var(--arq-icon-md)}.link:after{content:\"\";inset-inline:0;height:var(--arq-border-default);background:var(--arq-color-border-strong);visibility:hidden;position:absolute;top:100%}.link[href]:hover{color:var(--arq-color-text-primary)}.link[href]:hover:after{visibility:visible}.link[href]:active{color:var(--arq-color-text-tertiary)}.link[href]:active:after{visibility:hidden}.link:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.link:focus:not(:focus-visible){outline:none}";
(class extends f {
	static tag = "arq-footer-link";
	static styles = me;
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
var he = ":host{display:block}.message{color:var(--arq-color-text-success);margin:0}:host([tone=error]) .message{color:var(--arq-color-text-error)}";
(class extends f {
	static tag = "arq-form-message";
	static styles = he;
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
var ge = ":host{display:block}.row{justify-content:space-between;align-items:flex-start;gap:var(--arq-space-gap-lg);padding-block:var(--arq-space-padding-md);border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle);margin:0;display:flex}.label{overflow-wrap:anywhere;min-width:0;color:var(--arq-color-text-tertiary)}.value{overflow-wrap:anywhere;min-width:0;color:var(--arq-color-text-primary);text-align:end;margin:0}";
(class extends f {
	static tag = "arq-spec-row";
	static styles = ge;
	static template = "<dl class=\"row role-body-regular\"><dt class=\"label\"><slot name=\"label\"></slot></dt><dd class=\"value\"><slot></slot></dd></dl>";
}).define();
//#endregion
//#region src/components/spec-list/spec-list.css?inline
var _e = ":host{min-width:0;display:block}.list{flex-direction:column;display:flex}";
(class extends f {
	static tag = "arq-spec-list";
	static styles = _e;
	static template = "<div class=\"list\"><slot></slot></div>";
}).define();
//#endregion
//#region src/base/disclosure.js
var ve = 0, ye = "\n[data-disclosure-panel] {\n  transition-property: opacity, color, background-color, border-color, outline-color, text-decoration-color, fill, stroke;\n  transition-duration: var(--arq-motion-duration-base);\n  transition-timing-function: var(--arq-motion-easing-standard);\n}\n\n@starting-style {\n  [data-disclosure-panel]:not([hidden]) {\n    opacity: 0;\n  }\n}\n", m;
function be(e) {
	m || (m = new CSSStyleSheet(), m.replaceSync(ye)), e.adoptedStyleSheets.includes(m) || (e.adoptedStyleSheets = [...e.adoptedStyleSheets, m]);
}
var h = class {
	#e;
	#t;
	#n;
	constructor(e, { trigger: t, panel: n, closeOnEscape: r = !1 }) {
		this.#e = e, this.#t = t, this.#n = n, n.id ||= `arq-disclosure-${++ve}`, n.setAttribute("data-disclosure-panel", ""), be(e.shadowRoot), t.type = "button", t.setAttribute("aria-controls", n.id), t.addEventListener("click", () => this.toggle()), r && e.addEventListener("keydown", (e) => {
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
}, xe = ":host{min-width:0;display:block}.item{border-bottom:var(--arq-border-default) solid var(--arq-color-border-default);background:var(--arq-color-surface-transparent)}:host([open]) .item{background:var(--arq-color-surface-faint);border-bottom:0}.trigger{box-sizing:border-box;align-items:center;gap:var(--arq-space-gap-md);width:100%;padding:var(--arq-space-padding-xl-2xl) var(--arq-space-padding-2xl);padding-bottom:calc(var(--arq-space-padding-xl-2xl) - var(--arq-border-default));background:var(--arq-color-surface-transparent);color:var(--arq-color-text-primary);font:inherit;text-align:start;cursor:pointer;-webkit-tap-highlight-color:var(--arq-color-surface-transparent);border:0;margin:0;display:flex}:host([open]) .trigger{padding-bottom:var(--arq-space-gap-xl)}.title{overflow-wrap:break-word;flex:1 1 0;min-width:0}.icon-box{padding:var(--arq-space-padding-sm-md);border-radius:var(--arq-radius-control);background:var(--arq-color-surface-transparent);color:var(--arq-color-icon-primary);flex:none;display:inline-flex}:host([open]) .icon-box{background:var(--arq-color-surface-default)}.icon{width:var(--arq-icon-xl);height:var(--arq-icon-xl)}:host(:not([open])) [data-icon=minus],:host([open]) [data-icon=plus]{display:none}.content{padding:0 var(--arq-space-padding-2xl) var(--arq-space-padding-2xl)}@media (hover:hover){:host(:not([open])) .item:has(.trigger:hover){background:var(--arq-color-surface-faint)}:host(:not([open])) .trigger:hover .icon-box{background:var(--arq-color-surface-hover)}}.item:has(.trigger:focus-visible){outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.trigger:focus{outline:none}@media (width<=767px){.trigger{padding-inline:var(--arq-space-padding-xl);padding-bottom:calc(var(--arq-space-padding-2xl) - var(--arq-border-default))}.content{padding-inline:var(--arq-space-padding-xl)}}";
(class extends f {
	static tag = "arq-accordion-item";
	static styles = xe;
	static properties = { open: { type: Boolean } };
	static template = `<div class="item"><button type="button" class="trigger"><span class="title role-heading-2"><slot name="title"></slot></span><span class="icon-box">${p("plus")}${p("minus")}</span></button><div class="content" part="panel"><slot></slot></div></div>`;
	setup() {
		this.disclosure = new h(this, {
			trigger: this.shadowRoot.querySelector(".trigger"),
			panel: this.shadowRoot.querySelector(".content")
		});
	}
}).define();
//#endregion
//#region src/components/filter-chip/filter-chip.css?inline
var Se = ":host{vertical-align:middle;max-width:100%;display:inline-flex}.chip{box-sizing:border-box;align-items:center;gap:var(--arq-space-gap-xs);max-width:100%;padding:var(--arq-space-padding-xs) var(--arq-space-padding-sm);border:var(--arq-border-default) solid var(--arq-color-border-default);border-radius:var(--arq-radius-control);background:var(--arq-color-surface-transparent);color:var(--arq-color-text-primary);cursor:pointer;-webkit-tap-highlight-color:var(--arq-color-surface-transparent);margin:0;display:inline-flex}.label{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.icon{width:var(--arq-icon-sm);height:var(--arq-icon-sm);flex:none}.chip:hover{border-color:var(--arq-color-text-primary)}.chip:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.chip:focus:not(:focus-visible){outline:none}";
(class extends f {
	static tag = "arq-filter-chip";
	static styles = Se;
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
var Ce = ":host{cursor:pointer;display:block}:host([disabled]){cursor:default}.option{align-items:center;gap:var(--arq-space-gap-sm);padding:var(--arq-space-padding-md);border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle);display:flex}:host(:not([disabled]):hover) .option{background:var(--arq-color-surface-faint)}.swatch{box-sizing:border-box;width:var(--arq-swatch-sm);height:var(--arq-swatch-sm);border:var(--arq-border-default) solid var(--arq-color-border-default);border-radius:var(--arq-radius-control);background:var(--arq-color-surface-subtle);flex:none;position:relative;overflow:hidden}.swatch img{object-fit:cover;width:100%;height:100%;display:block}.name{min-width:0;color:var(--arq-color-text-primary)}:host([disabled]) .name{color:var(--arq-color-text-disabled)}:host([active]) .option{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:calc(-1 * var(--arq-border-strong))}:host(:focus-visible){outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}:host(:focus:not(:focus-visible)){outline:none}";
(class extends f {
	static tag = "arq-select-option";
	static styles = Ce;
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
var we = ":host{box-sizing:border-box;border:var(--arq-border-default) solid var(--arq-color-border-default);border-radius:var(--arq-radius-control);background:var(--arq-color-surface-default);min-width:100%;display:block}:host([type=filter]),:host([type=text]){width:max-content;max-width:calc(100vw - 2 * var(--arq-layout-gutter))}:host([type=filter]){min-width:max(100%, var(--arq-layout-select-menu-filter))}:host{max-height:calc(7 * (2 * var(--arq-space-padding-md) + var(--arq-type-body-leading) + var(--arq-border-default)) + 2 * var(--arq-border-default));overscroll-behavior:contain;overflow-y:auto}:host(:focus){outline:none}";
(class extends f {
	static tag = "arq-select-menu";
	static styles = we;
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
var Te = class {
	#e;
	#t = -1;
	#n = "";
	#r = 0;
	constructor(e) {
		this.#e = e;
		let { trigger: t, menu: n } = e;
		t.setAttribute("role", "combobox"), t.setAttribute("aria-haspopup", "listbox"), t.setAttribute("aria-controls", n.id), t.addEventListener("click", () => e.isOpen() ? this.close() : this.show()), t.addEventListener("keydown", (e) => this.#c(e)), t.addEventListener("blur", () => {
			setTimeout(() => {
				let n = t.getRootNode();
				e.isOpen() && n.activeElement !== t && this.close(!1);
			});
		}), n.addEventListener("pointerdown", (e) => e.preventDefault()), n.addEventListener("click", (e) => {
			let t = e.target.closest("arq-select-option");
			t && !t.disabled && this.#o([...n.children].indexOf(t));
		}), n.addEventListener("arq:change", (e) => e.stopPropagation());
	}
	show() {
		let { setOpen: e, selected: t, options: n } = this.#e;
		e(!0);
		let r = t();
		this.#i(r >= 0 && !n()[r]?.disabled ? r : this.#a(-1, 1));
	}
	close(e = !0) {
		this.#e.setOpen(!1), e && this.#e.trigger.focus();
	}
	closed() {
		this.#i(-1);
	}
	#i(e) {
		this.#t = e;
		let { trigger: t, menu: n } = this.#e, r = [...n.children];
		r.forEach((t, n) => t.active = n === e), e >= 0 && r[e] ? (t.setAttribute("aria-activedescendant", r[e].id), requestAnimationFrame(() => r[e].scrollIntoView({ block: "nearest" }))) : t.removeAttribute("aria-activedescendant");
	}
	#a(e, t) {
		let n = this.#e.options();
		for (let r = e + t; r >= 0 && r < n.length; r += t) if (!n[r].disabled) return r;
		return e;
	}
	#o(e) {
		let t = this.#e.options()[e];
		t && !t.disabled && (this.#e.choose(e), this.close());
	}
	#s(e) {
		let t = Date.now();
		this.#n = t - this.#r > 500 ? e : this.#n + e, this.#r = t;
		let n = this.#e.options(), r = this.#t >= 0 ? this.#t : 0, i = [...n.keys()].slice(r + 1).concat([...n.keys()].slice(0, r + 1)).find((e) => !n[e].disabled && n[e].label.toLowerCase().startsWith(this.#n.toLowerCase()));
		i !== void 0 && this.#i(i);
	}
	#c(e) {
		let { key: t } = e, n = this.#e.options().length, r = t.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey;
		if (!this.#e.isOpen()) {
			[
				"ArrowDown",
				"ArrowUp",
				"Enter",
				" ",
				"Home",
				"End"
			].includes(t) ? (e.preventDefault(), this.show(), t === "Home" && this.#i(this.#a(-1, 1)), t === "End" && this.#i(this.#a(n, -1))) : r && (this.show(), this.#s(t));
			return;
		}
		if (t === "ArrowDown") this.#i(this.#a(this.#t, 1));
		else if (t === "ArrowUp") this.#i(this.#a(this.#t, -1));
		else if (t === "Home") this.#i(this.#a(-1, 1));
		else if (t === "End") this.#i(this.#a(n, -1));
		else if (t === "Enter" || t === " ") this.#o(this.#t);
		else if (t === "Escape") this.close();
		else if (t === "Tab") {
			this.close(!1);
			return;
		} else if (r) this.#s(t);
		else return;
		e.preventDefault();
	}
}, Ee = "[role=\"radiogroup\"], [role=\"tablist\"]", g = class {
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
		e.setAttribute(this.state, String(!!e.selected)), e.disabled ? e.setAttribute("aria-disabled", "true") : e.removeAttribute("aria-disabled"), e.parentElement?.closest(Ee) || e.setAttribute("tabindex", e.disabled ? "-1" : "0");
	}
}, De = ":host{vertical-align:middle;flex:none;display:inline-flex}.swatch{box-sizing:border-box;width:var(--arq-swatch-sm);height:var(--arq-swatch-sm);border-radius:var(--arq-radius-control);background:var(--arq-color-surface-subtle);display:block;position:relative;overflow:hidden}:host([size=default]) .swatch{width:var(--arq-swatch-md);height:var(--arq-swatch-md)}:host([size=large]) .swatch{width:var(--arq-swatch-lg);height:var(--arq-swatch-lg)}.swatch img{object-fit:cover;width:100%;height:100%;display:block}.swatch:after{content:\"\";border:var(--arq-border-default) solid var(--arq-color-border-subtle);border-radius:inherit;pointer-events:none;position:absolute;inset:0}:host([role=radio]){cursor:pointer}:host([role=radio]:not([disabled]):hover) .swatch:after,:host([selected]) .swatch:after{border-width:var(--arq-border-strong);border-color:var(--arq-color-border-strong)}:host([disabled]){cursor:default}:host([disabled]) .swatch:after{border-color:var(--arq-color-border-disabled)}:host([disabled]) .swatch:before{content:\"\";background:linear-gradient(to bottom right, transparent calc(50% - var(--arq-border-default) / 2), var(--arq-color-icon-tertiary) calc(50% - var(--arq-border-default) / 2), var(--arq-color-icon-tertiary) calc(50% + var(--arq-border-default) / 2), transparent calc(50% + var(--arq-border-default) / 2));pointer-events:none;position:absolute;inset:0}:host(:focus-visible){outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}:host(:focus:not(:focus-visible)){outline:none}";
(class extends f {
	static tag = "arq-swatch";
	static styles = De;
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
		this.shadowRoot.querySelector("slot").addEventListener("slotchange", t), t(), this.getAttribute("role") === "radio" || this.parentElement?.closest("arq-swatch-picker") ? this.selectable = new g(this, {
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
var Oe = ":host{min-width:0;display:block}.select{flex-direction:column;display:flex;position:relative}:host(:not([type=filter])) .select{gap:var(--arq-space-gap-sm)}.trigger{box-sizing:border-box;align-items:center;gap:var(--arq-space-gap-md);border-radius:var(--arq-radius-control);width:100%;font:inherit;text-align:start;cursor:pointer;-webkit-tap-highlight-color:var(--arq-color-surface-transparent);border:0;margin:0;display:flex}.value{overflow-wrap:break-word;flex:auto;min-width:0}.chevron{flex:none;display:inline-flex}.icon{width:var(--arq-icon-md);height:var(--arq-icon-md);color:var(--arq-color-icon-primary)}:host(:not([open])) [data-icon=chevron-up],:host([open]) [data-icon=chevron-down]{display:none}.menu{z-index:2;position:absolute;top:100%;left:0}:host(:not([type=filter])) .trigger{padding:var(--arq-space-padding-sm-md) var(--arq-space-padding-md) calc(var(--arq-space-padding-sm-md) - var(--arq-border-default));border-bottom:var(--arq-border-default) solid var(--arq-color-border-strong);background:var(--arq-color-surface-transparent);color:var(--arq-color-text-primary)}@media (hover:hover){:host(:not([type=filter]):not([open])) .trigger:enabled:hover{background:var(--arq-color-surface-faint)}}:host(:not([type=filter])[open]) .trigger,:host(:not([type=filter])) .trigger:focus-visible{background:var(--arq-color-surface-soft)}:host(:not([type=filter])) .trigger:focus-visible{border-bottom-color:var(--arq-color-border-focus)}:host(:not([type=filter])) .menu{right:0}:host([type=filter]){min-width:var(--arq-layout-select-filter)}:host([type=filter]) .select{gap:var(--arq-space-gap-sm);padding-bottom:calc(var(--arq-space-padding-sm) - var(--arq-border-default));border-bottom:var(--arq-border-default) solid var(--arq-color-border-strong)}:host([type=filter][disabled]) .select{border-bottom-color:var(--arq-color-border-disabled)}.label{color:var(--arq-color-text-tertiary)}:host([type=filter]) .trigger{justify-content:space-between;gap:var(--arq-space-gap-sm);background:var(--arq-color-surface-transparent);color:var(--arq-color-text-primary);padding:0}:host([type=filter]) .icon{width:var(--arq-icon-sm);height:var(--arq-icon-sm)}@media (hover:hover){:host([type=filter]:not([open])) .trigger:enabled:hover .value{color:var(--arq-color-text-tertiary)}}:host([type=filter]) .menu{margin-top:var(--arq-space-gap-sm)}:host([disabled]) .trigger{cursor:default;border-bottom-color:var(--arq-color-border-disabled);background:var(--arq-color-surface-transparent);color:var(--arq-color-text-disabled)}:host([disabled]) .label,:host([disabled]) .icon{color:var(--arq-color-text-disabled)}:host([disabled]) .swatch{opacity:.4}.trigger:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.trigger:focus:not(:focus-visible){outline:none}", ke = 0;
(class extends f {
	static tag = "arq-select";
	static styles = Oe;
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
	static template = `<div class="select"><span class="label role-label-sm" hidden></span><button type="button" class="trigger" aria-expanded="false"><arq-swatch class="swatch" aria-hidden="true" hidden></arq-swatch><span class="value"></span><span class="chevron">${p("chevron-down")}${p("chevron-up")}</span></button><arq-select-menu class="menu" hidden></arq-select-menu></div>`;
	#e = [];
	#t = null;
	get options() {
		return this.#e;
	}
	set options(e) {
		this.#e = Array.isArray(e) ? e : [], this.isConnected && this.#r();
	}
	setup() {
		let e = this.shadowRoot, t = `arq-select-${++ke}`;
		this.trigger = e.querySelector(".trigger"), this.menu = e.querySelector(".menu"), this.menu.id = `${t}-menu`, e.querySelector(".label").id = `${t}-label`, this.trigger.id = `${t}-trigger`, this.#t = new Te({
			trigger: this.trigger,
			menu: this.menu,
			options: () => this.#n(),
			selected: () => this.#n().findIndex((e) => e.value === (this.value ?? "")),
			isOpen: () => this.open,
			setOpen: (e) => this.open = e,
			choose: (e) => this.#i(e)
		}), this.#r();
	}
	update(e) {
		let t = this.shadowRoot, n = this.type === "filter", r = t.querySelector(".label");
		r.hidden = !1, r.textContent = this.label ?? "", r.className = "label role-label-sm", this.trigger.setAttribute("aria-labelledby", `${r.id} ${this.trigger.id}`), this.trigger.removeAttribute("aria-label"), this.trigger.disabled = this.disabled, this.menu.type = n ? "filter" : "finishes", e.has("open") && (this.menu.hidden = !this.open, this.trigger.setAttribute("aria-expanded", String(this.open)), this.open || this.#t.closed()), this.#r();
	}
	show() {
		this.disabled || this.#t.show();
	}
	close(e = !0) {
		this.#t.close(e);
	}
	focus(e) {
		this.trigger ? this.trigger.focus(e) : super.focus(e);
	}
	#n() {
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
	#r() {
		if (!this.trigger) return;
		let e = this.#n(), t = e.find((e) => e.value === (this.value ?? "")) ?? (this.type === "filter" ? e[0] : null), n = this.type === "filter" && !!this.value;
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
	#i(e) {
		let t = this.#n()[e], n = t.value !== (this.value ?? "");
		this.value = t.value, n && this.emit("change", { value: t.value });
	}
}).define();
//#endregion
//#region src/components/filter-bar/filter-bar.css?inline
var Ae = ":host{min-width:0;display:block}.bar{justify-content:space-between;align-items:center;gap:var(--arq-space-gap-lg);padding:calc(var(--arq-space-padding-md) - var(--arq-border-default)) var(--page-gutter);border-block:var(--arq-border-default) solid var(--arq-color-border-subtle);background:var(--arq-color-surface-faint);display:flex}.filters{align-items:stretch;gap:var(--arq-space-gap-lg);flex-wrap:wrap;min-width:0;display:flex}::slotted(arq-select){flex:none}::slotted(arq-select:not(:first-child)){border-inline-start:var(--arq-border-default) solid var(--arq-color-border-subtle);padding-inline-start:var(--arq-space-gap-lg)}.clear{flex:none}@media (width<=767px){.bar{align-items:stretch;gap:var(--arq-space-gap-md);flex-direction:column}.filters{gap:var(--arq-space-gap-md);flex-direction:column}::slotted(arq-select:not(:first-child)){border-inline-start:0;padding-inline-start:0}.clear{align-self:flex-start}}";
(class extends f {
	static tag = "arq-filter-bar";
	static styles = Ae;
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
//#region src/data/text.js
var _ = (e) => String(e ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
function je(e) {
	let t = [e];
	return e.length > 3 && e.endsWith("es") && t.push(e.slice(0, -2)), e.length > 3 && e.endsWith("s") && t.push(e.slice(0, -1)), t;
}
function Me(e) {
	return _(e).split(/\s+/).filter(Boolean).map(je);
}
var v = (e, t) => {
	let n = _(e);
	return t.every((e) => e.some((e) => n.includes(e)));
}, Ne = (e) => e != null && String(e).trim() !== "";
function Pe(e, t) {
	let n = [];
	for (let r of e) {
		let e = r.attributes[t];
		Ne(e) && !n.includes(e) && n.push(e);
	}
	return n.sort((e, t) => String(e).localeCompare(String(t), "es", { numeric: !0 }));
}
function Fe(e, t) {
	let n = Object.keys(t);
	return e.find((e) => n.every((n) => e.attributes[n] === t[n])) ?? null;
}
function Ie(e, t, n) {
	let r = e.find((e) => n && e.sku === n) ?? e.find((e) => e.isDefault) ?? e[0];
	return r ? Object.fromEntries(t.map((e) => [e, r.attributes[e]])) : {};
}
function Le(e, t, n) {
	return t.map((r) => ({
		attribute: r,
		options: Pe(e, r).map((i) => ({
			value: i,
			selected: n[r] === i,
			disabled: !e.some((e) => e.attributes[r] === i && t.every((t) => t === r || e.attributes[t] === n[t]))
		}))
	}));
}
var Re = (e, t, n) => Object.entries(t).every(([t, r]) => t === n || !Ne(r) || e.attributes[t] === r);
function ze(e, t) {
	return e.filter((e) => Re(e, t));
}
function Be(e, t, n) {
	return t.map((t) => ({
		attribute: t,
		options: Pe(e, t).map((r) => ({
			value: r,
			selected: n[t] === r,
			disabled: !e.some((e) => e.attributes[t] === r && Re(e, n, t))
		}))
	}));
}
function Ve(e, t, n) {
	return {
		...e,
		[t]: n
	};
}
function He(e, t) {
	let n = Me(t ?? "");
	return n.length ? e.filter((e) => v(`${e.sku} ${e.search ?? ""}`, n)) : e;
}
var y = Object.freeze([{
	value: "sku-asc",
	label: "SKU (A–Z)"
}, {
	value: "sku-desc",
	label: "SKU (Z–A)"
}]), Ue = new Intl.Collator("es", {
	numeric: !0,
	sensitivity: "base"
});
function We(e, t) {
	if (t !== "sku-asc" && t !== "sku-desc") return e;
	let n = t === "sku-desc" ? -1 : 1;
	return [...e].sort((e, t) => n * Ue.compare(e.sku, t.sku));
}
//#endregion
//#region src/components/sku/sku.css?inline
var Ge = ":host{vertical-align:middle;max-width:100%;display:inline-flex}.sku{align-items:flex-start;gap:var(--arq-space-gap-xs);flex-direction:column;min-width:0;display:flex}.label{color:var(--arq-color-text-secondary)}:host([size=compact]) .label{display:none}.row{align-items:flex-start;gap:var(--arq-space-gap-sm);background:var(--arq-color-surface-transparent);max-width:100%;color:var(--arq-color-text-primary);text-align:start;cursor:pointer;-webkit-tap-highlight-color:var(--arq-color-surface-transparent);border:0;margin:0;padding:0;display:inline-flex}.code{min-width:0;color:var(--arq-color-text-primary);overflow-wrap:anywhere}.copy{color:var(--arq-color-icon-secondary);flex:none;margin-block-start:calc((var(--arq-type-body-lg-leading) - var(--arq-icon-md)) / 2);display:inline-flex}:host([size=compact]) .copy{margin-block-start:calc((var(--arq-type-body-leading) - var(--arq-icon-md)) / 2)}.icon{width:var(--arq-icon-md);height:var(--arq-icon-md)}.row:hover .copy{color:var(--arq-color-icon-primary)}.copied,.failed{color:var(--arq-color-text-success);flex:none;margin-block-start:calc((var(--arq-type-body-lg-leading) - var(--arq-type-caption-leading)) / 2);display:none}:host([size=compact]) .copied,:host([size=compact]) .failed{margin-block-start:calc((var(--arq-type-body-leading) - var(--arq-type-caption-leading)) / 2)}:host([copied]) .copy,:host(:state(copy-failed)) .copy{display:none}:host([copied]) .copied,:host(:state(copy-failed)) .failed{display:inline}.failed{color:var(--arq-color-text-secondary)}.label,.copy,.copied,.failed{-webkit-user-select:none;user-select:none}.row:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.row:focus:not(:focus-visible){outline:none}", Ke = "Copiado", qe = /Mac|iPhone|iPad/.test(navigator.userAgentData?.platform ?? navigator.platform ?? "") ? "Copialo con ⌘C" : "Copialo con Ctrl+C";
function Je(e) {
	let t = getComputedStyle(e).getPropertyValue("--arq-motion-duration-feedback").trim(), n = Number.parseFloat(t);
	return Number.isNaN(n) ? 0 : t.endsWith("ms") ? n : n * 1e3;
}
(class extends f {
	static tag = "arq-sku";
	static styles = Ge;
	static properties = {
		size: {
			type: String,
			values: ["default", "compact"],
			default: "default"
		},
		copied: { type: Boolean }
	};
	static template = `<span class="sku"><span class="label role-label">SKU</span><button type="button" class="row"><span class="code"><slot></slot></span><span class="copy">${p("copy")}</span><span class="copied role-caption" aria-hidden="true">${Ke}</span><span class="failed role-caption" aria-hidden="true">${qe}</span></button><span class="visually-hidden" aria-live="polite"></span></span>`;
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
			getSelection()?.selectAllChildren(this), this.copied = !1, this.#r(!0), this.#t = setTimeout(() => this.#r(!1), Je(this));
			return;
		}
		this.copied = !0, this.emit("copy", { code: this.code }), this.#t = setTimeout(() => this.copied = !1, Je(this));
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
		this.shadowRoot.querySelector("[aria-live]").textContent = e ? qe : this.copied ? Ke : "";
	}
}).define();
//#endregion
//#region src/components/search-field/search-field.css?inline
var Ye = ":host{min-width:0;display:block}.field{align-items:center;gap:var(--arq-space-gap-md);padding:var(--arq-space-gap-sm) var(--arq-space-padding-xs) var(--arq-space-gap-sm) var(--arq-space-padding-md);border:var(--arq-border-default) solid var(--arq-color-border-default);background:var(--arq-color-surface-default);display:flex}:host(:not([show-close])) .field{padding-inline-end:var(--arq-space-padding-md)}.field:focus-within{border-color:var(--arq-color-border-focus)}.input{min-width:0;color:var(--arq-color-text-primary);caret-color:var(--arq-color-text-primary);appearance:none;background:0 0;border:0;flex:1;margin:0;padding:0}.input::placeholder{color:var(--arq-color-text-tertiary);opacity:1}.input:focus{outline:none}.input::-webkit-search-cancel-button{appearance:none}.input::-webkit-search-decoration{appearance:none}.close{flex:none}";
(class extends f {
	static tag = "arq-search-field";
	static styles = Ye;
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
//#region src/components/variants-table/variants-table.css?inline
var Xe = ":host{gap:var(--arq-space-gap-md);min-width:0;margin-inline:var(--page-gutter);flex-direction:column;display:flex}.toolbar{--page-gutter:var(--arq-space-0)}.scroll{--page-gutter:var(--arq-space-padding-sm)}.filter-bar{--page-gutter:var(--arq-space-padding-md)}.toolbar{align-items:flex-end;gap:var(--arq-space-gap-md);padding:var(--arq-space-padding-md) var(--page-gutter);flex-wrap:wrap;display:flex}:host([show-search]) .toolbar{column-gap:var(--arq-space-gap-sm-md)}.downloads,.sort{margin-inline-start:auto}.search{flex:1 1 0;min-width:0}:host([show-search]) .toggle-filters{align-self:stretch}.downloads{gap:var(--arq-space-gap-sm);flex-wrap:wrap;display:flex}.empty{padding-block:var(--arq-space-padding-md);color:var(--arq-color-text-secondary);margin:0}.scroll{overscroll-behavior-x:contain;scrollbar-width:none;overflow-x:auto}.scroll::-webkit-scrollbar{display:none}.scroll:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:calc(-1 * var(--arq-border-strong))}.table{border-collapse:collapse;border-spacing:0;width:100%}th,td{padding:0 var(--arq-space-gap-sm) 0 0;border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle);background:var(--arq-color-bg-default);text-align:start;white-space:nowrap;vertical-align:middle}thead th{padding-block:var(--arq-space-padding-sm-md);color:var(--arq-color-text-tertiary);font-weight:inherit}tbody th,tbody td{padding-block:var(--arq-space-padding-sm);color:var(--arq-color-text-primary)}@media (hover:hover){tbody tr:hover>*{background:var(--arq-color-surface-faint)}}.start{z-index:1;width:1%;padding-inline:var(--page-gutter) var(--arq-space-gap-sm);position:sticky;left:0}.sku-col{left:calc(var(--page-gutter) + var(--arq-layout-table-thumb) + var(--arq-space-gap-sm));z-index:1;width:1%;font-weight:inherit;padding-inline-end:var(--arq-space-gap-sm-md);position:sticky}.thumb{width:var(--arq-layout-table-thumb);height:var(--arq-layout-table-thumb);background:var(--arq-color-surface-subtle);flex:none;display:block;overflow:hidden}.thumb img{object-fit:cover;width:100%;height:100%;display:block}th.end,td.end{z-index:1;width:1%;padding-inline:var(--arq-space-gap-sm) var(--page-gutter);text-align:center;position:sticky;right:0}@media (width<=1023px){.sku-col{position:static}}@media (width<=767px){.th-downloads{width:var(--arq-border-default);height:var(--arq-border-default);clip-path:inset(50%);white-space:nowrap;position:absolute;overflow:hidden}}", b = (e) => String(e ?? "").replace(/[&<>"]/g, (e) => ({
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;"
})[e]), x = {
	search: "Buscar por SKU o nombre…",
	searchLabel: "Buscar por SKU o nombre",
	sort: "Ordenar por",
	downloads: "Descargas",
	image: "Imagen",
	empty: "Ningún SKU coincide con la búsqueda o los filtros.",
	count: (e) => e === 1 ? "1 variante" : `${e} variantes`
};
(class extends f {
	static tag = "arq-variants-table";
	static styles = Xe;
	static properties = {
		filters: { type: Boolean },
		downloads: { type: String },
		label: {
			type: String,
			default: "Variantes"
		},
		showSearch: { type: Boolean },
		showSort: { type: Boolean }
	};
	static template = `<div class="controls"><div class="toolbar"><arq-search-field class="search" placeholder="${x.search}" label="${x.searchLabel}" hidden></arq-search-field><arq-button class="toggle-filters" show-icon icon="filter">Filtros</arq-button><div class="downloads"><slot name="downloads"></slot></div><arq-select class="sort" type="filter" label="${x.sort}" hidden></arq-select></div><arq-filter-bar class="filter-bar" hidden></arq-filter-bar></div><div class="scroll" tabindex="0" role="region" aria-label="Variantes"><table class="table"><thead></thead><tbody></tbody></table></div><p class="empty role-body" hidden>${x.empty}</p><span class="visually-hidden count" role="status"></span>`;
	#e = {
		columns: [],
		filters: [],
		rows: []
	};
	#t = {};
	#n = "";
	#r = y[0].value;
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
		e.querySelector(".toggle-filters").addEventListener("click", () => this.filters = !this.filters), e.querySelector(".filter-bar").addEventListener("arq:filters", (e) => {
			e.stopPropagation(), this.#t = e.detail.filters, this.#a(!0);
		}), e.querySelector(".search").addEventListener("arq:input", (e) => {
			e.stopPropagation(), this.#n = e.detail.value, this.#a(!0);
		}), e.querySelector(".search").addEventListener("arq:submit", (e) => e.stopPropagation());
		let t = e.querySelector("slot[name=\"downloads\"]"), n = () => t.parentElement.hidden = !t.assignedElements().length;
		t.addEventListener("slotchange", n), n();
		let r = e.querySelector(".sort");
		r.allLabel = y[0].label, r.options = y.slice(1), r.addEventListener("arq:change", (e) => {
			e.stopPropagation(), this.#r = e.detail.value || y[0].value, this.#a(!0);
		}), e.querySelector("tbody").addEventListener("click", (e) => {
			let t = e.target.closest("arq-icon-button[data-sku]");
			if (!t) return;
			let n = t.dataset.sku;
			this.emit("downloads", { sku: n }), (this.downloads ? this.getRootNode().getElementById?.(this.downloads) : null)?.show?.(t);
		}), this.#i();
	}
	update(e) {
		let t = this.shadowRoot;
		e.has("label") && t.querySelector(".scroll").setAttribute("aria-label", this.label ?? "Variantes"), e.has("showSearch") && (t.querySelector(".search").hidden = !this.showSearch), e.has("showSort") && (t.querySelector(".sort").hidden = !this.showSort), (e.has("showSearch") || e.has("showSort")) && this.#a();
		let n = t.querySelector(".toggle-filters");
		if ((e.has("filters") || e.has("showSearch")) && (n.type = this.filters || this.showSearch ? "outline" : "filled"), e.has("filters") && (n.icon = this.filters ? "filter-off" : "filter", customElements.whenDefined("arq-button").then(() => {
			let e = n.shadowRoot?.querySelector(".control");
			e && (e.setAttribute("aria-expanded", String(this.filters)), "ariaControlsElements" in e && (e.ariaControlsElements = [t.querySelector(".filter-bar")]));
		}), t.querySelector(".filter-bar").hidden = !this.filters, !this.filters && Object.keys(this.#t).length)) {
			this.#t = {};
			for (let e of t.querySelectorAll(".filter-bar arq-select")) e.value = "";
			t.querySelector(".filter-bar").applied = !1, this.#a(!0);
		}
	}
	#i() {
		let e = this.shadowRoot, { columns: t, filters: n } = this.#e;
		e.querySelector("thead").innerHTML = `<tr><th scope="col" class="start"><span class="visually-hidden">${x.image}</span></th><th scope="col" class="sku-col role-label">SKU</th>` + t.map((e) => `<th scope="col" class="role-label">${b(e.label)}</th>`).join("") + `<th scope="col" class="end role-label"><span class="th-downloads">${x.downloads}</span></th></tr>`, e.querySelector(".filter-bar").replaceChildren(...n.map((e) => {
			let t = document.createElement("arq-select");
			return t.type = "filter", t.label = e.label, t.name = e.key, t;
		})), this.#a();
	}
	#a(e = !1) {
		let t = this.shadowRoot, { columns: n, filters: r } = this.#e, i = this.showSearch ? He(this.#e.rows, this.#n) : this.#e.rows;
		this.showSort && (i = We(i, this.#r));
		let a = r.map((e) => e.key), o = Be(i, a, this.#t);
		t.querySelectorAll(".filter-bar arq-select").forEach((e, t) => {
			let n = !!r[t].swatches;
			e.options = o[t].options.map((e) => ({
				value: e.value,
				label: e.value,
				disabled: e.disabled,
				showSwatch: n
			})), e.value = this.#t[e.name] ?? "";
		});
		let s = ze(i, this.#t);
		t.querySelector("tbody").innerHTML = s.map((e) => `<tr><td class="start"><span class="thumb">${e.thumb ? `<img src="${b(e.thumb)}" alt="" loading="lazy">` : ""}</span></td><th scope="row" class="sku-col"><arq-sku size="compact">${b(e.sku)}</arq-sku></th>` + n.map((t) => `<td class="role-body">${b(e.values?.[t.key] ?? "—")}</td>`).join("") + `<td class="end"><arq-icon-button icon="download" size="large" background="outline" data-sku="${b(e.sku)}">Descargas de ${b(e.sku)}</arq-icon-button></td></tr>`).join("");
		let c = !s.length && this.#e.rows.length > 0;
		t.querySelector(".scroll").hidden = c, t.querySelector(".empty").hidden = !c, e && (t.querySelector(".count").textContent = x.count(s.length));
	}
}).define();
//#endregion
//#region src/components/gallery-thumb/gallery-thumb.css?inline
var Ze = ":host{display:block}.thumb{box-sizing:border-box;aspect-ratio:5/4;border-radius:var(--arq-radius-control);background:var(--arq-color-surface-subtle);cursor:pointer;-webkit-tap-highlight-color:var(--arq-color-surface-transparent);border:0;width:100%;margin:0;padding:0;display:block;position:relative;overflow:hidden}.thumb img{object-fit:cover;width:100%;height:100%;display:block}.thumb:after{content:\"\";border:var(--arq-border-default) solid var(--arq-color-surface-transparent);border-radius:inherit;pointer-events:none;position:absolute;inset:0}.thumb:hover:after{border-color:var(--arq-color-border-hover)}.thumb[aria-current=true]:after{border-color:var(--arq-color-border-strong)}.thumb:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.thumb:focus:not(:focus-visible){outline:none}";
(class extends f {
	static tag = "arq-gallery-thumb";
	static styles = Ze;
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
var S = /* @__PURE__ */ new Set(), Qe = null;
function $e(e) {
	if (e.assignedSlot) return e.assignedSlot;
	if (e.parentElement) return e.parentElement;
	let t = e.parentNode;
	return t instanceof ShadowRoot ? t.host : null;
}
function et(e) {
	for (let t = e; t; t = $e(t)) if (t.hasAttribute?.("data-arq-theme")) return t.getAttribute("data-arq-theme") === "dark";
	return !1;
}
function tt() {
	nt();
}
function nt() {
	for (let e of S) {
		let t = e.ref.deref();
		if (!t) {
			S.delete(e);
			continue;
		}
		if (!t.isConnected) continue;
		let n = et(t);
		n !== e.dark && (e.dark = n, t[e.method](n));
	}
}
function rt(e, t) {
	let n = {
		ref: new WeakRef(e),
		dark: et(e),
		method: t
	};
	S.add(n), Qe || (Qe = new MutationObserver(nt), Qe.observe(document.documentElement, {
		attributes: !0,
		subtree: !0,
		attributeFilter: ["data-arq-theme"]
	})), e[t](n.dark);
}
//#endregion
//#region src/components/product-gallery/product-gallery.css?inline
var it = ":host{min-width:0;display:block}.gallery{gap:var(--arq-space-gap-sm);flex-direction:column;display:flex;position:relative}.image{aspect-ratio:5/4;border-radius:var(--arq-radius-control);background:var(--arq-color-surface-subtle);overflow:hidden}::slotted(img){object-fit:cover!important;width:100%!important;height:100%!important;display:block!important}.thumbs{gap:var(--arq-space-gap-sm);margin:calc(-1 * var(--arq-space-padding-xs));padding:var(--arq-space-padding-xs);scroll-snap-type:x mandatory;scrollbar-width:none;display:flex;overflow-x:auto}.thumbs::-webkit-scrollbar{display:none}arq-gallery-thumb{width:var(--arq-layout-gallery-thumb);scroll-snap-align:start;flex:none}@media (width>=768px){.thumbs{left:var(--arq-space-padding-lg);bottom:var(--arq-space-padding-lg);max-width:calc(100% - 2 * var(--arq-space-padding-lg));position:absolute}}";
(class extends f {
	static tag = "arq-product-gallery";
	static styles = it;
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
		}), rt(this, "themeChanged"), this.#a();
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
var C = ".card{--card-above:1;position:relative}.card-link{color:inherit;-webkit-tap-highlight-color:var(--arq-color-surface-transparent);text-decoration:none;display:block}.card-link:after{content:\"\";position:absolute;inset:0}.card-link:focus{outline:none}.card:has(.card-link:focus-visible){outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}@media (hover:hover){.card:has(.card-link:hover) .card-media{outline:var(--arq-border-default) solid var(--arq-color-border-hover);outline-offset:calc(var(--arq-border-default) * -1)}}.card-media{background:var(--arq-color-bg-subtle);overflow:hidden}.card-media ::slotted(*){object-fit:cover;width:100%!important;max-width:none!important;height:100%!important;display:block!important}", at = ":host{min-width:0;display:block}.card{gap:var(--arq-space-gap-md);flex-direction:column;display:flex}.card-media{aspect-ratio:1;background:var(--arq-color-surface-subtle)}:host([size=large]) .card-media{aspect-ratio:7/10}.name{max-width:100%;color:var(--arq-color-text-secondary);overflow-wrap:break-word;align-self:flex-start}:host([size=large]) .name{color:var(--arq-color-text-primary)}";
(class extends f {
	static tag = "arq-family-card";
	static styles = C + at;
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
var ot = ":host{min-width:0;display:block}.row{box-sizing:border-box;align-items:center;gap:var(--arq-space-gap-md);width:100%;padding:var(--arq-space-padding-md) 0 calc(var(--arq-space-padding-md) - var(--arq-border-default));border:0;border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle);border-radius:var(--arq-radius-control);background:var(--arq-color-surface-transparent);color:var(--arq-color-text-primary);font:inherit;text-align:start;cursor:pointer;-webkit-tap-highlight-color:var(--arq-color-surface-transparent);margin:0;text-decoration:none;display:flex}.label{overflow-wrap:break-word;flex:auto;min-width:0}.icon{width:var(--arq-icon-md);height:var(--arq-icon-md);color:var(--arq-color-icon-primary);flex:none}:host([emphasis=featured]) .row{padding:calc(var(--arq-space-padding-md) - var(--arq-border-default)) calc(var(--arq-space-padding-lg) - var(--arq-border-default));border:var(--arq-border-default) solid var(--arq-color-border-strong)}@media (hover:hover){:host(:not([emphasis=featured])) .row:hover .label{text-decoration:underline;text-decoration-thickness:var(--arq-border-default)}:host([emphasis=featured]) .row:hover{background:var(--arq-color-surface-faint)}}.row:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.row:focus:not(:focus-visible){outline:none}";
(class extends f {
	static tag = "arq-download-item";
	static styles = ot;
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
//#region src/base/scroll-lock.js
var st = {
	ArrowDown: 1,
	ArrowUp: -1,
	PageDown: 1,
	PageUp: -1,
	End: 1,
	Home: -1,
	" ": 1
};
function w(e, t, n) {
	for (let r of e.composedPath()) {
		if (!(r instanceof Element)) continue;
		let { overflowY: e } = getComputedStyle(r);
		if ((e === "auto" || e === "scroll") && r.scrollHeight > r.clientHeight && (n < 0 ? r.scrollTop > 0 : Math.ceil(r.scrollTop + r.clientHeight) < r.scrollHeight)) return !0;
		if (r === t) break;
	}
	return !1;
}
var ct = (e) => e.composedPath().some((e) => e instanceof Element && (e.matches("input, textarea, select, [contenteditable=\"\"], [contenteditable=\"true\"]") || e.getAttribute("role") === "combobox"));
function lt(e) {
	e.addEventListener("wheel", (t) => {
		t.deltaY && !w(t, e, t.deltaY) && t.preventDefault();
	}, { passive: !1 });
	let t = 0;
	e.addEventListener("touchstart", (e) => t = e.touches[0].clientY, { passive: !0 }), e.addEventListener("touchmove", (n) => {
		let r = t - n.touches[0].clientY;
		r && !w(n, e, r) && n.preventDefault();
	}, { passive: !1 }), e.addEventListener("keydown", (t) => {
		let n = st[t.key];
		!n || t.altKey || t.ctrlKey || t.metaKey || ct(t) || t.key === " " && t.composedPath().some((e) => e instanceof Element && e.matches("button, a[href], [role=\"button\"]")) || w(t, e, n) || t.preventDefault();
	});
}
//#endregion
//#region src/components/download-modal/download-modal.css?inline
var ut = ":host{display:contents}.dialog{box-sizing:border-box;width:100%;max-width:none;height:100%;max-height:none;padding:var(--arq-layout-gutter);background:var(--arq-color-surface-transparent);color:var(--arq-color-text-primary);overscroll-behavior:contain;border:0;margin:0;position:fixed;inset:0;overflow-y:auto}.dialog[open]{flex-direction:column;display:flex}.dialog::backdrop{background:var(--arq-color-overlay-scrim)}.sheet{box-sizing:border-box;gap:var(--arq-space-gap-2xl);width:var(--arq-layout-filter-panel);max-width:100%;padding:var(--arq-space-padding-xl-2xl);border:var(--arq-border-default) solid var(--arq-color-border-default);border-radius:var(--arq-radius-control);background:var(--arq-color-surface-default);flex-direction:column;flex:none;margin:auto 0 0 auto;display:flex}.header{justify-content:space-between;align-items:flex-start;gap:var(--arq-space-gap-md);display:flex}.title-wrap{gap:var(--arq-space-gap-sm);flex-direction:column;min-width:0;display:flex}.title{min-width:0;color:var(--arq-color-text-primary)}.content{gap:var(--arq-space-gap-md);flex-direction:column;display:flex}.list{flex-direction:column;display:flex}@media (width<=767px){.sheet{width:auto;margin-inline-start:0}}";
(class extends f {
	static tag = "arq-download-modal";
	static styles = ut;
	static properties = {
		open: { type: Boolean },
		sku: { type: String }
	};
	static template = "<dialog class=\"dialog\"><div class=\"sheet\"><div class=\"header\"><div class=\"title-wrap\"><div class=\"title role-heading-1\"><slot name=\"title\"></slot></div><arq-sku class=\"sku\" size=\"compact\" hidden></arq-sku></div><arq-icon-button icon=\"close\" size=\"large\" class=\"close\">Cerrar descargas</arq-icon-button></div><div class=\"content\"><div class=\"featured\"><slot name=\"featured\"></slot></div><div class=\"list\" role=\"list\"><slot></slot></div></div></div></dialog>";
	#e = null;
	#t = null;
	setup() {
		this.#e = this.shadowRoot.querySelector("dialog"), lt(this.#e), this.shadowRoot.querySelector(".close").addEventListener("click", () => this.close()), this.#e.addEventListener("click", (e) => {
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
		if (e.has("sku")) {
			let e = this.shadowRoot.querySelector(".sku");
			e.textContent = this.sku ?? "", e.hidden = !this.sku;
		}
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
var dt = ":host{min-width:0;display:flex}.link{align-items:center;gap:var(--arq-space-gap-sm);min-width:0;color:var(--arq-color-text-tertiary);-webkit-tap-highlight-color:var(--arq-color-surface-transparent);text-decoration:none;display:inline-flex}.label{overflow-wrap:break-word;min-width:0}.indicator{width:var(--arq-space-gap-sm-md);height:var(--arq-border-default);background:var(--arq-color-text-primary);flex:none;display:none}@media (hover:hover){.link:hover{color:var(--arq-color-text-primary)}}:host([selected]) .link{color:var(--arq-color-text-primary)}:host([selected]) .indicator{display:block}.link:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.link:focus:not(:focus-visible){outline:none}";
(class extends f {
	static tag = "arq-catalog-nav-item";
	static styles = dt;
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
var ft = ":host{min-width:0;display:block}.group{border-top:var(--arq-border-default) solid var(--arq-color-border-subtle)}.header{box-sizing:border-box;justify-content:space-between;align-items:center;gap:var(--arq-space-gap-md);width:100%;padding:var(--arq-space-padding-md) 0;background:var(--arq-color-surface-transparent);color:var(--arq-color-text-secondary);font:inherit;text-align:start;cursor:pointer;-webkit-tap-highlight-color:var(--arq-color-surface-transparent);border:0;margin:0;display:flex}:host([open]) .header{padding-bottom:var(--arq-space-gap-md);color:var(--arq-color-text-primary)}.label{overflow-wrap:break-word;min-width:0}.icon-box{padding:var(--arq-space-padding-xs);border-radius:var(--arq-radius-control);background:var(--arq-color-surface-transparent);color:var(--arq-color-icon-primary);flex:none;display:inline-flex}.icon{width:var(--arq-icon-md);height:var(--arq-icon-md)}:host(:not([open])) [data-icon=minus],:host([open]) [data-icon=plus]{display:none}@media (hover:hover){.header:hover .icon-box{background:var(--arq-color-surface-hover)}}.items{align-items:flex-start;gap:var(--arq-space-gap-sm-md);padding-bottom:calc(var(--arq-space-padding-md) + var(--arq-space-padding-xs));flex-direction:column;display:flex}.header:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.header:focus:not(:focus-visible){outline:none}";
(class extends f {
	static tag = "arq-catalog-nav-group";
	static styles = ft;
	static properties = { open: { type: Boolean } };
	static template = `<div class="group"><button type="button" class="header"><span class="label role-label"><slot name="label"></slot></span><span class="icon-box">${p("plus")}${p("minus")}</span></button><div class="items" role="list" part="panel"><slot></slot></div></div>`;
	setup() {
		this.disclosure = new h(this, {
			trigger: this.shadowRoot.querySelector(".header"),
			panel: this.shadowRoot.querySelector(".items")
		});
	}
}).define();
//#endregion
//#region src/components/catalog-nav/catalog-nav.css?inline
var pt = ":host{min-width:0;display:block}.nav{background:var(--arq-color-surface-default)}.trigger{display:none}.panel,.panel[hidden]{display:block!important}@media (width<=1023px){.panel,.panel[hidden]{padding-inline:var(--arq-space-padding-md)}.nav{border-block:var(--arq-border-default) solid var(--arq-color-border-default)}.panel[hidden]{display:none!important}.trigger{box-sizing:border-box;justify-content:space-between;align-items:center;gap:var(--arq-space-gap-md);width:100%;padding:var(--arq-space-padding-md);background:var(--arq-color-surface-default);color:var(--arq-color-text-primary);font:inherit;text-align:start;cursor:pointer;-webkit-tap-highlight-color:var(--arq-color-surface-transparent);border:0;margin:0;display:flex}:host([open]) .trigger{background:var(--arq-color-surface-faint)}@media (hover:hover){.trigger:hover{background:var(--arq-color-surface-faint)}:host(:not([open])) .trigger:hover .icon-box{background:var(--arq-color-surface-hover)}}.trigger:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.trigger:focus:not(:focus-visible){outline:none}}.current{align-items:center;gap:var(--arq-space-gap-sm);min-width:0;display:inline-flex}.current-label{overflow-wrap:break-word;min-width:0}.indicator{width:var(--arq-space-gap-sm-md);height:var(--arq-border-default);background:var(--arq-color-text-primary);flex:none}.icon-box{padding:var(--arq-space-padding-xs);border-radius:var(--arq-radius-control);background:var(--arq-color-surface-transparent);color:var(--arq-color-icon-primary);flex:none;display:inline-flex}:host([open]) .icon-box{background:var(--arq-color-surface-default)}.icon{width:var(--arq-icon-md);height:var(--arq-icon-md)}:host(:not([open])) [data-icon=minus],:host([open]) [data-icon=plus]{display:none}";
(class extends f {
	static tag = "arq-catalog-nav";
	static styles = pt;
	static properties = {
		open: { type: Boolean },
		label: {
			type: String,
			default: "Categorías"
		}
	};
	static template = `<nav class="nav"><button type="button" class="trigger"><span class="current"><span class="indicator" aria-hidden="true"></span><span class="current-label role-body-regular"></span></span><span class="icon-box">${p("plus")}${p("minus")}</span></button><div class="panel" part="panel"><slot></slot></div></nav>`;
	setup() {
		this.disclosure = new h(this, {
			trigger: this.shadowRoot.querySelector(".trigger"),
			panel: this.shadowRoot.querySelector(".panel")
		});
		let e = () => {
			this.#t(), this.#n();
		};
		this.shadowRoot.querySelector("slot").addEventListener("slotchange", e), new MutationObserver(e).observe(this, {
			subtree: !0,
			childList: !0,
			characterData: !0,
			attributes: !0,
			attributeFilter: ["selected"]
		}), this.addEventListener("click", (e) => {
			e.target.closest?.("arq-catalog-nav-item") && this.disclosure.hide();
		}), this.addEventListener("arq:toggle", (e) => {
			let t = e.target;
			if (t.localName === "arq-catalog-nav-group" && e.detail.open) {
				for (let e of this.querySelectorAll("arq-catalog-nav-group")) e.open = e === t;
				t.querySelector(":scope > arq-catalog-nav-item")?.shadowRoot?.querySelector("a")?.click();
			}
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
		let e = this.#e()?.closest("arq-catalog-nav-group");
		if (e) for (let t of this.querySelectorAll("arq-catalog-nav-group")) t.open = t === e;
	}
}).define();
//#endregion
//#region src/components/checkbox/checkbox.css?inline
var mt = ":host{vertical-align:middle;max-width:100%;display:inline-flex}.row{align-items:center;gap:var(--arq-space-gap-sm);max-width:100%;padding-block:var(--arq-space-gap-xs);cursor:pointer;display:inline-flex;position:relative}.control{width:var(--arq-icon-md);height:var(--arq-icon-md);flex:none;justify-content:center;align-items:center;display:inline-flex}.box{box-sizing:border-box;width:var(--arq-icon-sm);height:var(--arq-icon-sm);border:var(--arq-border-default) solid var(--arq-color-icon-tertiary);border-radius:var(--arq-radius-control);background:var(--arq-color-surface-default)}.label{min-width:0;color:var(--arq-color-text-secondary)}.row:hover .box{border-color:var(--arq-color-icon-primary)}.row:hover .label{color:var(--arq-color-text-primary)}.native:checked+.control .box{border-color:var(--arq-color-action-primary);background:var(--arq-color-action-primary)}.row:hover .native:checked+.control .box{border-color:var(--arq-color-action-primary-hover);background:var(--arq-color-action-primary-hover)}:host([disabled]) .row{cursor:default}:host([disabled]) .box,:host([disabled]) .row:hover .box{border-color:var(--arq-color-icon-disabled)}:host([disabled]) .native:checked+.control .box{border-color:var(--arq-color-icon-disabled);background:var(--arq-color-icon-disabled)}:host([disabled]) .label,:host([disabled]) .row:hover .label{color:var(--arq-color-text-disabled)}.native:focus-visible+.control .box{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}";
(class extends f {
	static tag = "arq-checkbox";
	static styles = mt;
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
var ht = ":host{min-width:0;display:block}.row{border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle)}.header{box-sizing:border-box;justify-content:space-between;align-items:center;gap:var(--arq-space-gap-md);width:100%;padding:var(--arq-space-padding-md) 0;background:var(--arq-color-surface-transparent);color:var(--arq-color-text-primary);font:inherit;text-align:start;cursor:pointer;-webkit-tap-highlight-color:var(--arq-color-surface-transparent);border:0;margin:0;display:flex}:host([open]) .header{padding-bottom:var(--arq-space-gap-md)}.label{overflow-wrap:break-word;min-width:0}.icon-box{padding:var(--arq-space-padding-xs);border-radius:var(--arq-radius-control);background:var(--arq-color-surface-transparent);color:var(--arq-color-icon-primary);flex:none;display:inline-flex}.icon{width:var(--arq-icon-md);height:var(--arq-icon-md)}:host(:not([open])) [data-icon=minus],:host([open]) [data-icon=plus]{display:none}.options{align-items:flex-start;gap:var(--arq-space-gap-sm-md);padding-bottom:calc(var(--arq-space-padding-sm) + var(--arq-space-padding-md));flex-direction:column;display:flex}@media (hover:hover){.row:has(.header:hover){border-bottom-color:var(--arq-color-border-default)}.header:hover .icon-box{background:var(--arq-color-surface-hover)}}.row:has(.header:focus-visible){outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.header:focus{outline:none}";
(class extends f {
	static tag = "arq-filter-row";
	static styles = ht;
	static properties = { open: { type: Boolean } };
	static template = `<div class="row"><button type="button" class="header"><span class="label role-body-xl"><slot name="label"></slot></span><span class="icon-box">${p("plus")}${p("minus")}</span></button><div class="options" role="group" part="panel"><slot></slot></div></div>`;
	setup() {
		this.disclosure = new h(this, {
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
var gt = ":host{cursor:pointer;flex:none;display:inline-flex}.tab{padding-bottom:var(--arq-space-gap-sm);border-bottom:var(--arq-border-default) solid var(--arq-color-surface-transparent);color:var(--arq-color-text-tertiary);white-space:nowrap;display:inline-flex}:host(:not([disabled]):hover) .tab{color:var(--arq-color-text-primary)}:host([selected]) .tab{border-bottom-color:var(--arq-color-border-strong);color:var(--arq-color-text-primary)}:host([disabled]){cursor:default}:host([disabled]) .tab{color:var(--arq-color-text-disabled)}:host(:focus-visible){outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}:host(:focus:not(:focus-visible)){outline:none}";
(class extends f {
	static tag = "arq-tab";
	static styles = gt;
	static properties = {
		selected: { type: Boolean },
		disabled: { type: Boolean },
		value: { type: String }
	};
	static template = "<span class=\"tab role-label\"><slot></slot></span>";
	setup() {
		this.selectable = new g(this, {
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
//#region src/base/single-select.js
var _t = ["ArrowRight", "ArrowDown"], vt = ["ArrowLeft", "ArrowUp"], T = class {
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
		_t.includes(e.key) ? r = t[(n + 1) % t.length] : vt.includes(e.key) ? r = t[(n - 1 + t.length) % t.length] : e.key === "Home" ? r = t[0] : e.key === "End" && (r = t[t.length - 1]), r && (e.preventDefault(), r.focus(), r.choose?.());
	}
}, yt = ":host{display:contents}.dialog{box-sizing:border-box;width:var(--arq-layout-filter-panel);border:var(--arq-border-default) solid var(--arq-color-border-default);border-radius:var(--arq-radius-control);background:var(--arq-color-surface-default);max-width:100%;height:100dvh;max-height:none;color:var(--arq-color-text-primary);margin:0;padding:0;inset:0 0 0 auto;overflow:hidden}.dialog::backdrop{background:var(--arq-color-overlay-scrim)}.sheet{box-sizing:border-box;gap:var(--arq-space-gap-lg);height:100%;padding:var(--arq-space-padding-xl-2xl);flex-direction:column;display:flex}.header{justify-content:space-between;align-items:center;gap:var(--arq-space-gap-md);display:flex}.titles{gap:var(--arq-space-gap-xs);flex-direction:column;min-width:0;display:flex}.title{color:var(--arq-color-text-primary)}.summary{color:var(--arq-color-text-secondary);margin:0}.applied{gap:var(--arq-space-gap-sm);flex-wrap:wrap;display:flex}.tabs{display:none}.body{min-height:0;margin:calc(-1 * var(--arq-space-padding-xs));padding:var(--arq-space-padding-xs);overscroll-behavior:contain;flex:auto;overflow-y:auto}.footer{justify-content:space-between;align-items:center;gap:var(--arq-space-gap-lg);display:flex}@media (width<=767px){.dialog{border:0;width:100%;inset:0}.dialog::backdrop{background:var(--arq-color-surface-transparent)}.sheet{gap:var(--arq-space-gap-xl);padding:var(--arq-space-padding-lg) var(--arq-layout-gutter)}:host([show-categories]) .tabs{gap:var(--arq-space-gap-xl);border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle);flex:none;display:flex;overflow-x:auto}.categories-panel{min-width:0}.footer{justify-content:flex-start}.apply{flex:auto}}", bt = {
	productos: ["producto", "productos"],
	colecciones: ["colección", "colecciones"]
};
(class extends f {
	static tag = "arq-filter-panel";
	static styles = yt;
	static properties = {
		open: { type: Boolean },
		count: { type: Number },
		unit: {
			type: String,
			values: ["productos", "colecciones"],
			default: "productos"
		},
		showCategories: { type: Boolean }
	};
	static template = "<dialog class=\"dialog\" data-arq-theme=\"light\"><div class=\"sheet\"><div class=\"header\"><div class=\"titles\"><div class=\"title role-heading-1\"><slot name=\"title\"></slot></div><p class=\"summary role-body\" hidden></p></div><arq-icon-button icon=\"close\" size=\"large\" class=\"close\">Cerrar filtros</arq-icon-button></div><div class=\"applied\" hidden></div><div class=\"tabs\" role=\"tablist\" aria-label=\"Tipo de filtro\"><arq-tab value=\"features\" id=\"features-tab\" aria-controls=\"features-panel\" selected>Características</arq-tab><arq-tab value=\"categories\" id=\"categories-tab\" aria-controls=\"categories-panel\">Categorías</arq-tab></div><div class=\"body\"><div class=\"features-panel\" id=\"features-panel\" role=\"tabpanel\" aria-labelledby=\"features-tab\"><slot></slot></div><div class=\"categories-panel\" id=\"categories-panel\" role=\"tabpanel\" aria-labelledby=\"categories-tab\" hidden><slot name=\"categories\"></slot></div></div><div class=\"footer\"><arq-button type=\"underline\" show-underline class=\"clear\">Borrar todo</arq-button><arq-button class=\"apply\"></arq-button></div></div></dialog>";
	#e = null;
	#t = null;
	#n = null;
	setup() {
		let e = this.shadowRoot;
		this.#e = e.querySelector("dialog"), e.querySelector(".close").addEventListener("click", () => this.close()), e.querySelector(".clear").addEventListener("click", () => this.clear()), e.querySelector(".apply").addEventListener("click", () => this.apply()), new T(e.querySelector(".tabs"), { items: "arq-tab" }), e.querySelector(".tabs").addEventListener("arq:change", (e) => {
			this.#i(e.detail.value);
		}), this.addEventListener("arq:toggle", (e) => {
			let t = e.target;
			if (t.localName === "arq-catalog-nav-group" && e.detail.open && t.closest("[slot=\"categories\"]")) for (let e of this.querySelectorAll("[slot=\"categories\"] arq-catalog-nav-group")) e.open = e === t;
		}), this.#e.addEventListener("click", (e) => {
			e.target === this.#e && this.close();
		}), this.#e.addEventListener("cancel", (e) => {
			e.preventDefault(), this.close();
		}), e.querySelector(".applied").addEventListener("click", (e) => {
			let t = e.target.closest("arq-filter-chip");
			t && this.#f(t);
		}), this.addEventListener("arq:change", (e) => {
			e.target.localName === "arq-checkbox" && this.#c();
		}), e.querySelector("slot[name=\"title\"]").addEventListener("slotchange", () => this.#s()), this.#s(), this.#u();
	}
	update(e) {
		e.has("open") && (this.open && !this.#e.open && this.#r(), !this.open && this.#e.open && this.#a()), (e.has("count") || e.has("unit")) && this.#d(), e.has("showCategories") && this.#i("features");
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
		this.#n = e ?? this.#o(), this.open = !0;
	}
	close() {
		let e = this.#t;
		if (this.#t = null, e && [...e].some(([e, t]) => e.checked !== t)) {
			for (let [t, n] of e) t.checked = n;
			this.#c();
		} else this.#u();
		this.open = !1;
	}
	apply() {
		this.#t = null, this.emit("apply", { filters: this.filters }), this.open = !1;
	}
	clear() {
		for (let e of this.options) e.checked = !1;
		this.#c();
	}
	#r() {
		this.#t = new Map(this.options.map((e) => [e, e.checked])), this.#i("features"), this.#u(), this.#e.showModal();
	}
	#i(e) {
		let t = this.showCategories && e === "categories", n = this.shadowRoot;
		n.querySelector("#features-tab").selected = !t, n.querySelector("#categories-tab").selected = t, n.querySelector(".features-panel").hidden = t, n.querySelector(".categories-panel").hidden = !t, n.querySelector(".summary").hidden = t || this.#l().length === 0, n.querySelector(".applied").hidden = t || this.#l().length === 0, n.querySelector(".footer").hidden = t;
	}
	#a() {
		this.#t && this.close(), this.#e.close(), this.#n?.focus?.(), this.#n = null;
	}
	#o() {
		let e = document.activeElement;
		for (; e?.shadowRoot?.activeElement;) e = e.shadowRoot.activeElement;
		let t = e?.getRootNode?.();
		return t instanceof ShadowRoot ? t.host : e;
	}
	#s() {
		let e = this.querySelector("[slot=\"title\"]")?.textContent.trim();
		this.#e.setAttribute("aria-label", e || "Filtrar");
	}
	#c() {
		this.#u(), this.emit("filters", { filters: this.filters });
	}
	#l() {
		return this.options.filter((e) => e.checked);
	}
	#u() {
		let e = this.#l(), t = this.shadowRoot, n = t.querySelector(".summary");
		n.hidden = e.length === 0 || t.querySelector("#categories-tab").selected, n.textContent = `${e.length} ${e.length === 1 ? "filtro activo" : "filtros activos"}`;
		let r = t.querySelector(".applied");
		for (r.hidden = e.length === 0 || t.querySelector("#categories-tab").selected; r.children.length > e.length;) r.lastElementChild.remove();
		for (; r.children.length < e.length;) r.append(document.createElement("arq-filter-chip"));
		e.forEach((e, t) => {
			let n = r.children[t];
			n.textContent = e.textContent.trim(), n.option = e;
		}), this.#d();
	}
	#d() {
		let e = this.shadowRoot.querySelector(".apply");
		if (!e) return;
		let [t, n] = bt[this.unit] ?? bt.productos;
		e.textContent = Number.isFinite(this.count) ? `Ver ${this.count} ${this.count === 1 ? t : n}` : `Ver ${n}`;
	}
	#f(e) {
		let t = [...this.shadowRoot.querySelectorAll(".applied arq-filter-chip")].indexOf(e);
		e.option.checked = !1, this.#c();
		let n = [...this.shadowRoot.querySelectorAll(".applied arq-filter-chip")];
		(n[t] ?? n[t - 1] ?? this.shadowRoot.querySelector(".close")).focus();
	}
}).define();
//#endregion
//#region src/components/toggle/toggle.css?inline
var xt = ":host{vertical-align:middle;max-width:100%;display:inline-flex}.toggle{align-items:center;gap:var(--arq-space-gap-sm);cursor:pointer;max-width:100%;display:inline-flex;position:relative}.track{box-sizing:border-box;width:calc(var(--arq-space-padding-2xs) * 2 + var(--arq-icon-sm) * 2 + var(--arq-space-gap-sm));height:calc(var(--arq-space-padding-2xs) * 2 + var(--arq-icon-sm));padding:calc(var(--arq-space-padding-2xs) - var(--arq-border-default));border:var(--arq-border-default) solid var(--arq-color-border-strong);border-radius:var(--arq-radius-pill);background:var(--arq-color-surface-transparent);flex:none;align-items:center;display:inline-flex}.thumb{width:var(--arq-icon-sm);height:var(--arq-icon-sm);border-radius:var(--arq-radius-pill);background:var(--arq-color-icon-primary);transition-property:transform,color,background-color,border-color,outline-color,text-decoration-color,fill,stroke}.label{min-width:0;color:var(--arq-color-text-primary)}.toggle:hover .track{background:var(--arq-color-surface-hover)}.native:checked+.track{border-color:var(--arq-color-action-primary);background:var(--arq-color-action-primary)}.native:checked+.track .thumb{background:var(--arq-color-action-on-primary);transform:translateX(calc(var(--arq-icon-sm) + var(--arq-space-gap-sm)))}.toggle:hover .native:checked+.track{border-color:var(--arq-color-action-primary-hover);background:var(--arq-color-action-primary-hover)}:host([disabled]) .toggle{cursor:default}:host([disabled]) .track,:host([disabled]) .toggle:hover .track{border-color:var(--arq-color-border-disabled);background:var(--arq-color-surface-transparent)}:host([disabled]) .native:checked+.track{border-color:var(--arq-color-border-disabled);background:var(--arq-color-surface-strong)}:host([disabled]) .thumb,:host([disabled]) .native:checked+.track .thumb{background:var(--arq-color-icon-disabled)}:host([disabled]) .label{color:var(--arq-color-text-disabled)}.native:focus-visible+.track{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}";
(class extends f {
	static tag = "arq-toggle";
	static styles = xt;
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
var St = ":host{min-width:0;display:block}.bar{justify-content:space-between;align-items:center;gap:var(--arq-space-gap-md);padding-block:var(--arq-space-padding-md);border-block:var(--arq-border-default) solid var(--arq-color-border-subtle);display:flex}:host([state=scroll]) .bar{padding-block:var(--arq-space-padding-sm)}.count{min-width:0;color:var(--arq-color-text-secondary);white-space:nowrap;margin:0}.actions{align-items:center;gap:var(--arq-space-gap-xl);flex:none;display:flex}.lead{align-items:stretch;gap:var(--arq-space-gap-xl);display:flex}@media (width<=767px){.actions,.lead{gap:var(--arq-space-gap-lg)}}", Ct = {
	productos: ["producto", "productos"],
	colecciones: ["colección", "colecciones"]
}, wt = "arq:theme";
function Tt() {
	try {
		return localStorage.getItem(wt);
	} catch {
		return null;
	}
}
function Et(e) {
	try {
		localStorage.setItem(wt, e);
	} catch {}
}
(class extends f {
	static tag = "arq-catalog-toolbar";
	static styles = St;
	static properties = {
		count: { type: Number },
		unit: {
			type: String,
			values: ["productos", "colecciones"],
			default: "productos"
		},
		state: {
			type: String,
			values: ["default", "scroll"],
			default: "default"
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
			let e = Tt();
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
		let [e, t] = Ct[this.unit] ?? Ct.productos, n = this.shadowRoot.querySelector(".count");
		n.textContent = Number.isFinite(this.count) ? `${this.count} ${this.count === 1 ? e : t}` : "";
	}
	#i() {
		let e = Number.isFinite(this.filterCount) ? this.filterCount : 0, t = this.#n;
		t.showCount = e > 0, t.count = e > 0 ? e : null, t.icon = e > 0 ? "filter-off" : "filter";
	}
	#a(e, t) {
		let n = document.documentElement;
		e ? n.setAttribute("data-arq-theme", "dark") : n.removeAttribute("data-arq-theme"), t && Et(e ? "dark" : "light");
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
var Dt = ":host{min-width:0;display:block}.card{gap:var(--arq-space-gap-md);flex-direction:column;display:flex}.card.is-small{gap:var(--arq-space-gap-sm)}.card-media{aspect-ratio:7/10;background:var(--arq-color-surface-subtle);position:relative}@media (hover:hover){.card:has(.card-link:hover) .card-media{outline:none}}.img{object-fit:cover;visibility:hidden;width:100%;height:100%;position:absolute;inset:0}.img.loaded{visibility:visible}.hover{opacity:0;transition-property:opacity,color,background-color,border-color,outline-color,text-decoration-color,fill,stroke;transition-duration:var(--arq-motion-duration-slow);transition-timing-function:var(--arq-motion-easing-standard)}.card.has-hover:has(.card-link:focus-visible) .hover{opacity:1}@media (hover:hover){.card.has-hover:has(.card-link:hover) .hover{opacity:1}}.fallback{padding:var(--arq-space-padding-md);color:var(--arq-color-text-secondary);text-align:center;overflow-wrap:break-word;justify-content:center;align-items:center;display:flex;position:absolute;inset:0}.info{align-items:flex-start;gap:var(--arq-space-gap-xs);padding-top:var(--arq-space-gap-xs);padding-bottom:var(--arq-space-gap-sm);flex-direction:column;display:flex}.title{align-items:center;gap:var(--arq-space-gap-sm);align-self:stretch;display:flex}.name{min-width:0;color:var(--arq-color-text-primary);overflow-wrap:break-word;flex:auto}.finishes{align-items:center;gap:var(--arq-space-gap-xs);flex:none;display:flex}.meta{-webkit-line-clamp:2;color:var(--arq-color-text-secondary);overflow-wrap:break-word;-webkit-box-orient:vertical;margin:0;display:-webkit-box;overflow:hidden}.meta[hidden]{display:none}.compare{z-index:var(--card-above);position:relative}", Ot = matchMedia("(max-width: 767px)");
(class extends f {
	static tag = "arq-product-card";
	static styles = C + Dt;
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
		}), Ot.addEventListener("change", () => this.#r()), rt(this, "themeChanged");
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
		return this.size === "small" || Ot.matches;
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
var kt = ":host{min-width:0;display:block}.slot{align-items:center;gap:var(--arq-space-gap-sm-md);max-width:var(--arq-layout-compare-slot);display:flex}.thumb{width:var(--arq-layout-compare-thumb);height:var(--arq-layout-compare-thumb);background:var(--arq-color-surface-subtle);flex:none;justify-content:center;align-items:center;display:flex;position:relative;overflow:hidden}.thumb img{object-fit:cover;width:100%;height:100%;position:absolute;inset:0}.icon{width:var(--arq-icon-md);height:var(--arq-icon-md);color:var(--arq-color-icon-primary)}:host([filled]) .icon{display:none}.info{gap:var(--arq-space-gap-xs);flex-direction:column;flex:auto;min-width:0;display:flex}.name{color:var(--arq-color-text-primary);overflow-wrap:break-word}.meta,.empty{color:var(--arq-color-text-secondary);overflow-wrap:break-word}:host(:not([filled])) .name,:host(:not([filled])) .meta,.empty:empty{display:none}.remove{flex:none}:host([size=compact]) .slot{max-width:none}:host([size=compact]) .thumb{width:var(--arq-layout-compare-thumb-sm);aspect-ratio:7/10;height:auto}:host([size=compact]) .info{width:var(--arq-border-default);height:var(--arq-border-default);clip-path:inset(50%);white-space:nowrap;position:absolute;overflow:hidden}";
(class extends f {
	static tag = "arq-compare-slot";
	static styles = kt;
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
var At = ":host{display:contents}.bar{z-index:3;box-sizing:border-box;gap:var(--arq-space-gap-md);padding:var(--arq-space-padding-md) var(--page-gutter);border-top:var(--arq-border-default) solid var(--arq-color-border-default);background:var(--arq-color-surface-default);color:var(--arq-color-text-primary);flex-direction:column;display:flex;position:fixed;inset:auto 0 0}.head{justify-content:space-between;align-items:center;gap:var(--arq-space-gap-md);display:flex}.title{align-items:center;gap:var(--arq-space-gap-sm);margin:0;display:inline-flex}.row{justify-content:space-between;align-items:center;gap:var(--arq-space-gap-2xl);display:flex}.slots{align-items:stretch;gap:var(--arq-space-gap-lg);flex:auto;min-width:0;display:flex}.slots arq-compare-slot{flex:1 1 0;min-width:0}.actions{align-items:center;gap:var(--arq-space-gap-xl);flex:none;display:flex}.clear-mobile{display:none}@media (width<=767px){.bar{gap:var(--arq-space-gap-sm-md);padding-bottom:var(--arq-space-padding-lg);border-top-color:var(--arq-color-border-subtle)}.clear-mobile{display:inline-flex}.clear-desktop{display:none}.row{gap:var(--arq-space-gap-md)}.slots{gap:var(--arq-space-gap-sm);flex:none}.slots arq-compare-slot{flex:none}.actions,.go{flex:auto}}", E = "arq:compare", D = 3, jt = matchMedia("(max-width: 767px)");
function Mt() {
	try {
		let e = JSON.parse(localStorage.getItem(E) ?? "[]");
		return Array.isArray(e) ? e.filter((e) => e && e.sku).slice(0, D) : [];
	} catch {
		return [];
	}
}
function Nt(e) {
	try {
		localStorage.setItem(E, JSON.stringify(e));
	} catch {}
}
(class extends f {
	static tag = "arq-compare-bar";
	static styles = At;
	static properties = { href: {
		type: String,
		default: "/arq/comparativa"
	} };
	static template = "<section class=\"bar\" data-arq-theme=\"dark\" aria-label=\"Comparar productos\" hidden><div class=\"head\"><p class=\"title role-body-lg\"><span>Productos seleccionados</span><arq-count-badge class=\"count\"></arq-count-badge></p><arq-button type=\"underline\" show-underline class=\"clear clear-mobile\">Borrar todo</arq-button></div><div class=\"row\"><div class=\"slots\"></div><div class=\"actions\"><arq-button type=\"underline\" show-underline class=\"clear clear-desktop\">Borrar todo</arq-button><arq-button class=\"go\">Comparar</arq-button></div></div></section>";
	#e = Mt();
	get items() {
		return [...this.#e];
	}
	set items(e) {
		this.#e = (Array.isArray(e) ? e : []).filter((e) => e && e.sku).slice(0, D), this.#t();
	}
	setup() {
		let e = this.shadowRoot;
		for (let t of e.querySelectorAll(".clear")) t.addEventListener("click", () => this.clear());
		e.querySelector(".slots").addEventListener("arq:remove", (e) => {
			e.stopPropagation(), this.remove(e.detail.sku);
		}), jt.addEventListener("change", () => this.#n()), addEventListener("storage", (e) => {
			e.key === E && (this.#e = Mt(), this.#n(), this.emit("compare-change", { items: this.items }));
		}), this.#n();
	}
	update(e) {
		e.has("href") && this.#n();
	}
	add(e) {
		return !e?.sku || this.has(e.sku) || this.#e.length >= D ? !1 : (this.#e.push({
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
		Nt(this.#e), this.#n(), this.emit("compare-change", { items: this.items });
	}
	#n() {
		let e = this.shadowRoot;
		if (!e.querySelector(".bar")) return;
		let t = this.#e;
		e.querySelector(".bar").hidden = t.length === 0, e.querySelector(".count").count = t.length;
		let n = jt.matches, r = e.querySelector(".slots"), i = [];
		for (let e = 0; e < D; e++) {
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
//#region src/components/compare-product/compare-product.css?inline
var Pt = ":host{min-width:0;display:block}.product{gap:var(--arq-space-gap-lg);flex-direction:column;width:100%;height:100%;display:flex}.media{width:100%;max-width:var(--arq-layout-compare-media-max);aspect-ratio:1;background:var(--arq-color-bg-subtle);justify-content:center;align-items:center;display:flex;position:relative;overflow:hidden}.media img{object-fit:cover;width:100%;height:100%;position:absolute;inset:0}.remove{top:var(--arq-space-padding-sm-md);right:var(--arq-space-padding-sm-md);position:absolute}:host([empty]) .media{background:var(--arq-color-surface-transparent);border:var(--arq-border-default) dashed var(--arq-color-border-default);flex:auto}:host([empty]) .remove,:host([empty]) .info,:host([empty]) .selects{display:none}.add{all:unset;justify-content:center;align-self:stretch;align-items:center;gap:var(--arq-space-gap-sm-md);box-sizing:border-box;cursor:pointer;color:var(--arq-color-text-secondary);flex-direction:column;flex:auto;display:none}:host([empty]) .add{display:flex}.add-icon{padding:var(--arq-space-padding-sm-md);background:var(--arq-color-surface-subtle);justify-content:center;align-items:center;display:flex}.add-icon .icon{width:var(--arq-icon-xl);height:var(--arq-icon-xl)}.add:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:calc(-1 * var(--arq-border-strong))}@media (hover:hover){:host([empty]) .product:hover{background:var(--arq-color-surface-faint)}:host([empty]) .product:hover .media{border-color:var(--arq-color-border-strong)}:host([empty]) .product:hover .add-icon{background:var(--arq-color-surface-transparent)}}.info{gap:var(--arq-space-gap-sm);flex-direction:column;display:flex}.title{align-items:center;gap:var(--arq-space-gap-sm-md);color:var(--arq-color-text-primary);text-decoration:none;display:flex}.title:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:var(--arq-space-gap-xs)}.name{overflow-wrap:break-word;flex:auto;min-width:0}.title .icon{width:var(--arq-icon-md);height:var(--arq-icon-md);flex:none}.sku{color:var(--arq-color-text-tertiary);margin:0}.selects{gap:var(--arq-space-gap-sm-md);flex-direction:column;display:flex}";
(class extends f {
	static tag = "arq-compare-product";
	static styles = Pt;
	static properties = { addLabel: {
		type: String,
		default: "Agregar producto"
	} };
	static template = `<div class="product"><div class="media"><img alt="" hidden><arq-icon-button icon="close" class="remove"></arq-icon-button><button type="button" class="add"><span class="add-icon">${p("plus")}</span><span class="add-label role-body"></span></button></div><div class="info"><a class="title"><span class="name role-heading-3"></span>${p("arrow-up-right")}</a><p class="sku role-label"></p></div><div class="selects"></div></div>`;
	#e = null;
	get data() {
		return this.#e;
	}
	set data(e) {
		this.#e = e ?? null, this.toggleAttribute("empty", !e), this.isConnected && this.#t();
	}
	setup() {
		let e = this.shadowRoot;
		e.querySelector(".remove").addEventListener("click", () => this.emit("remove", { sku: this.#e?.sku ?? null })), e.querySelector(".add").addEventListener("click", () => this.emit("add")), e.querySelector(".selects").addEventListener("arq:change", (e) => {
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
		t?.href ? r.href = t.href : r.removeAttribute("href"), r.setAttribute("aria-label", t ? `Ver ficha de ${t.name}` : ""), e.querySelector(".sku").textContent = t?.sku ?? "", e.querySelector(".remove").textContent = t ? `Quitar ${t.name}` : "Quitar", this.#n(t);
	}
	#n(e) {
		let t = this.shadowRoot.querySelector(".selects"), n = (e?.attributes ?? []).map((e) => ({
			field: e.field,
			label: e.label,
			value: e.value ?? "",
			options: e.options ?? []
		}));
		for (; t.children.length > n.length;) t.lastElementChild.remove();
		for (; t.children.length < n.length;) {
			let e = document.createElement("arq-select");
			e.type = "field", t.append(e);
		}
		n.forEach((e, n) => {
			let r = t.children[n];
			r.dataset.field = e.field, r.label = e.label, r.options = e.options, r.value = e.value;
		});
	}
}).define();
//#endregion
//#region src/components/compare-header/compare-header.css?inline
var Ft = ":host{z-index:2;display:block;position:relative}.default{align-items:flex-start;gap:var(--arq-space-gap-xl);padding-inline:var(--page-gutter);padding-block-end:var(--arq-space-section-xs);display:flex;position:relative}.sentinel{width:var(--arq-border-default);height:var(--arq-border-default);position:absolute;bottom:0;left:0}.controls{width:var(--arq-layout-compare-label);flex:none}.products{align-items:stretch;gap:var(--arq-space-gap-xl);flex:auto;min-width:0;display:flex}.products>*{flex:1 1 0;min-width:0}.compact{top:var(--navbar-height,0px);z-index:2;align-items:center;gap:var(--arq-space-gap-lg);padding-inline:var(--page-gutter);padding-block:var(--arq-space-padding-sm-md);background:var(--arq-color-bg-default);border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle);display:flex;position:fixed;left:0;right:0}.compact .controls{white-space:nowrap;align-items:center;width:auto;display:flex}.slots{align-items:center;gap:var(--arq-space-gap-lg);flex:auto;min-width:0;display:flex;overflow:hidden}.slots .product{align-items:center;gap:var(--arq-space-gap-sm);flex:1 1 0;min-width:0;display:flex}.mobile-name{text-overflow:ellipsis;white-space:nowrap;color:var(--arq-color-text-primary);display:none;overflow:hidden}@media (width<=767px){:host{--column-width:60vw}.default{width:100%;min-width:0;padding-inline:0}.default .controls{display:none}.products>*{width:var(--column-width);flex:none}.products{gap:var(--arq-space-gap-md);padding-inline:var(--page-gutter);scrollbar-width:none;overflow-x:auto}.products::-webkit-scrollbar{display:none}.slots::-webkit-scrollbar{display:none}.compact{align-items:stretch;gap:var(--arq-space-gap-md);flex-direction:column;padding-inline:0;top:0;overflow:visible}.slots{gap:var(--arq-space-gap-md);width:100%;padding-inline:var(--page-gutter);overscroll-behavior-x:contain;scrollbar-width:none;flex:auto;order:1;overflow-x:auto}.compact .controls{width:auto;padding-inline:var(--page-gutter);order:2}.slots .product{width:var(--column-width);flex:none}.slots arq-compare-slot{flex:none}.mobile-name{display:block}}", O = 3, k = matchMedia("(max-width: 767px)");
(class extends f {
	static tag = "arq-compare-header";
	static styles = Ft;
	static properties = {
		onlyDifferences: { type: Boolean },
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
		this.#e = (Array.isArray(e) ? e : []).slice(0, O), this.isConnected && this.#i();
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
		});
		for (let t of e.querySelectorAll(".products, .slots")) t.addEventListener("scroll", () => this.#o(t));
		k.addEventListener("change", () => this.#a()), this.#s(), addEventListener("resize", () => {
			this.#s(), k.matches && document.querySelector("arq-navbar")?.removeAttribute("data-arq-compare-hidden");
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
		for (let e = 0; e < O; e++) {
			let r = this.#e[e] ?? null, i = t.children[e];
			i || (i = document.createElement("arq-compare-product"), t.append(i)), i.data = r;
			let a = n.children[e];
			a || (a = document.createElement("div"), a.className = "product", a.innerHTML = "<arq-compare-slot></arq-compare-slot><span class=\"mobile-name role-label\" aria-hidden=\"true\"></span>", n.append(a));
			let o = a.querySelector("arq-compare-slot");
			if (r) {
				o.sku = r.sku, r.image ? o.image = r.image : o.removeAttribute("image"), o.replaceChildren();
				let e = document.createElement("span");
				e.slot = "name", e.textContent = r.name ?? "";
				let t = document.createElement("span");
				t.slot = "meta", t.textContent = r.meta ?? r.sku ?? "", o.append(e, t);
			} else o.removeAttribute("sku"), o.removeAttribute("image"), o.replaceChildren();
			a.querySelector(".mobile-name").textContent = r?.name ?? "";
		}
		for (; t.children.length > O;) t.lastElementChild.remove();
		for (; n.children.length > O;) n.lastElementChild.remove();
		this.#a();
	}
	#a() {
		let e = k.matches;
		for (let t of this.shadowRoot.querySelectorAll(".slots arq-compare-slot")) t.size = e ? "compact" : "default";
		document.querySelector("arq-navbar")?.removeAttribute("data-arq-compare-hidden");
	}
	setScrollLeft(e) {
		if (k.matches) for (let t of this.shadowRoot.querySelectorAll(".products, .slots")) t.scrollLeft = e;
	}
	refreshCompact() {
		this.#s();
	}
	#o(e) {
		if (!(!k.matches || this.#n)) {
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
			rootMargin: `${k.matches ? 0 : -e}px 0px 0px 0px`,
			threshold: 0
		}), this.#t.observe(t);
	}
	#l(e) {
		if (!this.getClientRects().length) return;
		this.shadowRoot.querySelector(".compact").hidden = !e;
		let t = document.querySelector("arq-navbar");
		t && k.matches && t.toggleAttribute("data-arq-compare-hidden", e);
	}
}).define();
//#endregion
//#region src/components/compare-table/compare-table.css?inline
var It = ":host{min-width:0;display:block}.scroll{overscroll-behavior-x:contain;padding-inline:var(--page-gutter);padding-block-end:var(--arq-space-section-xl);overflow-x:auto}.scroll:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:calc(-1 * var(--arq-border-strong))}:host([embedded]) .scroll{overflow:visible}.table{border-collapse:collapse;table-layout:fixed;width:100%}th,td{background:var(--arq-color-bg-default);text-align:start;vertical-align:middle;font-weight:inherit;padding:0}.label-cell{width:var(--arq-layout-compare-label);padding-inline-end:var(--arq-space-gap-lg)}thead th{border:none;height:0;padding:0}.product{padding-inline-end:var(--arq-space-gap-lg)}.group th{padding-block:var(--arq-space-gap-2xl) var(--arq-space-padding-sm-md);border-bottom:var(--arq-border-default) solid var(--arq-color-border-strong);color:var(--arq-color-text-primary)}.row>*{padding-block:var(--arq-space-padding-md);border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle)}.row-label{color:var(--arq-color-text-secondary);overflow-wrap:break-word}.value{padding-inline:var(--arq-space-padding-md) var(--arq-space-gap-lg);border-left:var(--arq-border-default) solid var(--arq-color-border-subtle);color:var(--arq-color-text-primary);overflow-wrap:break-word}@media (width<=767px){:host{--column-width:60vw}.scroll{padding-inline:0;overflow-x:visible}.group th{padding-inline:var(--page-gutter)}.table{table-layout:auto;width:100%;min-width:0}.row{grid-template-columns:repeat(3, var(--column-width));padding-inline:var(--page-gutter);column-gap:var(--arq-space-gap-md);row-gap:var(--arq-space-gap-sm);scrollbar-width:none;border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle);width:100%;display:grid;overflow-x:auto}.row::-webkit-scrollbar{display:none}.row>*{border-bottom:none;padding-block:0}.row .label-cell{z-index:1;width:auto;padding:var(--arq-space-padding-xs) 0;background:var(--arq-color-bg-default);grid-column:1/-1;position:sticky;inset-inline-start:var(--page-gutter)}.row .value{width:var(--column-width);padding:var(--arq-space-padding-sm) 0 var(--arq-space-padding-sm) var(--arq-space-padding-md)}.row .value:first-of-type{border-left:none;padding-inline-start:0}.table,thead,tbody{display:block}.row+.row{margin-top:var(--arq-space-gap-sm)}.group+.row{margin-top:var(--arq-space-padding-md)}}", A = (e) => String(e ?? "").replace(/[&<>"]/g, (e) => ({
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;"
})[e]), j = 3, Lt = matchMedia("(max-width: 767px)");
(class extends f {
	static tag = "arq-compare-table";
	static styles = It;
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
			products: (e?.products ?? []).slice(0, j),
			groups: e?.groups ?? []
		}, this.isConnected && this.#n();
	}
	setup() {
		Lt.addEventListener("change", () => this.#r()), this.shadowRoot.querySelector(".table").addEventListener("scroll", (e) => {
			let t = e.target;
			!Lt.matches || this.#t || !t.classList?.contains("row") || (this.#t = !0, this.setScrollLeft(t.scrollLeft), this.emit("scroll", { left: t.scrollLeft }), this.#t = !1);
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
		e.querySelector("thead").innerHTML = "<tr role=\"row\"><th scope=\"col\" class=\"label-cell\" role=\"columnheader\"></th>" + Array.from({ length: j }, (e, t) => n[t]).map((e) => `<th scope="col" class="product" role="columnheader">${e ? `<span class="visually-hidden">${A(e.name)} (${A(e.meta ?? e.sku)})</span>` : ""}</th>`).join("") + "</tr>";
		for (let e of t.querySelectorAll("tbody")) e.remove();
		for (let e of r) {
			let r = document.createElement("tbody");
			r.setAttribute("role", "rowgroup"), r.innerHTML = `<tr class="group" role="row"><th scope="colgroup" colspan="4" role="columnheader"><span class="group-label role-label">${A(e.label)}</span></th></tr>` + (e.rows ?? []).map((e) => {
				let t = n.map((t, n) => e.values?.[n] ?? "—"), r = t.length > 0 && t.every((e) => String(e) === String(t[0])), i = Array.from({ length: j }, (e, n) => t[n] ?? "");
				return `<tr class="row" role="row"${r ? " data-same" : ""}><th scope="row" class="label-cell row-label" role="rowheader">${A(e.label)}</th>` + i.map((e) => `<td class="value role-body-lg-regular" role="cell">${A(e)}</td>`).join("") + "</tr>";
			}).join(""), t.append(r);
		}
		this.#r(), this.#i();
	}
	#r() {
		let e = Lt.matches;
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
//#region src/config.js
var M = {
	BASE_URL: "/",
	DEV: !1,
	MODE: "production",
	PROD: !0,
	SSR: !1,
	VITE_DATA_SOURCE: "mock",
	VITE_N8N_WEBHOOK_URL: "",
	VITE_TYPESENSE_COLLECTION: "",
	VITE_TYPESENSE_HOST: "",
	VITE_TYPESENSE_SEARCH_KEY: ""
}, Rt = Object.freeze({
	typesense: Object.freeze({
		host: M.VITE_TYPESENSE_HOST ?? "",
		searchKey: M.VITE_TYPESENSE_SEARCH_KEY ?? "",
		collection: M.VITE_TYPESENSE_COLLECTION ?? ""
	}),
	n8n: Object.freeze({ webhookUrl: M.VITE_N8N_WEBHOOK_URL ?? "" })
}), zt = 250, N = /* @__PURE__ */ new Map(), Bt = class extends Error {
	constructor(e, t) {
		super(`Typesense ${e}: ${t}`), this.name = "TypesenseError", this.status = e;
	}
};
function Vt() {
	let { host: e, searchKey: t, collection: n } = Rt.typesense;
	return !!(e && t && n);
}
async function Ht(e, { signal: t } = {}) {
	if (!Vt()) throw new Bt(0, "falta configurar VITE_TYPESENSE_* en .env");
	let { host: n, searchKey: r, collection: i } = Rt.typesense, a = new URLSearchParams({
		q: "*",
		...e
	}), o = `${n.replace(/\/$/, "")}/collections/${encodeURIComponent(i)}/documents/search?${a}`;
	if (N.has(o)) return N.get(o);
	let s = fetch(o, {
		headers: { "X-TYPESENSE-API-KEY": r },
		signal: t
	}).then(async (e) => {
		let t = await e.json().catch(() => ({}));
		if (!e.ok) throw new Bt(e.status, t.message ?? e.statusText);
		return t;
	});
	return N.set(o, s), s.catch(() => N.delete(o)), s;
}
async function Ut(e = {}, t) {
	let n = await Ht(e, t);
	return {
		hits: (n.hits ?? []).map((e) => e.document),
		found: n.found ?? 0,
		facets: Object.fromEntries((n.facet_counts ?? []).map((e) => [e.field_name, e.counts.map(({ value: e, count: t }) => ({
			value: e,
			count: t
		}))]))
	};
}
async function Wt(e = {}, t) {
	let n = await Ut({
		...e,
		per_page: zt,
		page: 1
	}, t), r = Math.ceil(n.found / zt);
	return [n, ...await Promise.all(Array.from({ length: Math.max(0, r - 1) }, (n, r) => Ut({
		...e,
		per_page: zt,
		page: r + 2
	}, t)))].flatMap((e) => e.hits);
}
//#endregion
//#region src/data/attributes.js
var Gt = Object.freeze([
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
]), P = (e, t, n = {}) => Object.freeze({
	label: e,
	section: t,
	control: "tiles",
	...n
}), F = Object.freeze({
	potencia: P("Potencia", "luminicas", { filter: !0 }),
	flujo_luminoso: P("Flujo luminoso", "luminicas"),
	lumenes_lmw: P("Eficiencia luminosa", "luminicas"),
	temperatura_color: P("Temperatura de color", "luminicas", { filter: !0 }),
	cri: P("CRI", "luminicas"),
	angulo_apertura: P("Ángulo de apertura", "luminicas"),
	ugr: P("UGR", "luminicas"),
	sdcm: P("SDCM", "luminicas"),
	tipo_led: P("Tipo de LED", "luminicas"),
	vida_util: P("Vida útil", "luminicas"),
	tension_proveedor: P("Tensión de entrada", "electricas"),
	factor_potencia: P("Factor de potencia", "electricas"),
	thd: P("THD", "electricas"),
	dimeable: P("Dimerizable", "electricas"),
	tipo_driver: P("Driver", "electricas"),
	emc: P("EMC", "electricas"),
	color_carcasa: P("Color", "materiales", {
		control: "swatches",
		column: "Color de carcasa"
	}),
	altura: P("Altura", "materiales", { column: "Altura" }),
	tamanio: P("Medidas", "materiales"),
	material_cuerpo: P("Material del cuerpo", "materiales"),
	material_lente: P("Material de la lente", "materiales"),
	largo_cable: P("Largo de cable", "materiales"),
	peso: P("Peso", "materiales"),
	proteccion_ip: P("Grado de protección", "instalacion"),
	proteccion_ik: P("Resistencia al impacto", "instalacion"),
	tipo_montaje: P("Montaje", "instalacion"),
	temperatura_operacion: P("Temperatura de operación", "instalacion"),
	garantia_proveedor: P("Garantía", "comercial")
}), Kt = Object.freeze([
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
]);
function I(e) {
	return F[e] ?? {
		label: e,
		control: "tiles"
	};
}
var qt = Object.freeze(Object.keys(F).filter((e) => F[e].filter));
function Jt(e) {
	return Gt.map((t) => ({
		...t,
		rows: Object.entries(F).filter(([n, r]) => r.section === t.id && Yt(e[n])).map(([t, n]) => ({
			field: t,
			label: n.label,
			value: e[t]
		}))
	})).filter((e) => e.rows.length);
}
var Yt = (e) => e != null && String(e).trim() !== "" && e !== "-";
function Xt(e) {
	return (Array.isArray(e) ? e : String(e ?? "").split(",")).map((e) => e.trim()).filter(Boolean).map((e) => {
		let t = Object.keys(F).find((t) => F[t].column === e);
		return t || console.warn(`[arq] variant_attributes: la columna «${e}» no está en src/data/attributes.js`), t;
	}).filter(Boolean);
}
//#endregion
//#region src/data/typesense-adapter.js
var L = {
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
}, Zt = [
	"ies",
	"cad",
	"manual",
	"fotometria"
], R = (e) => e == null ? "" : String(e).trim(), Qt = (e) => Array.isArray(e) ? e : R(e) ? R(e).split(",").map((e) => e.trim()) : [];
function $t(e) {
	return {};
}
function en(e) {
	return {};
}
function tn(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) {
		let e = R(n[L.group]) || n.sku;
		t.has(e) || t.set(e, []), t.get(e).push(n);
	}
	let n = /* @__PURE__ */ new Map(), r = [...t].map(([e, t]) => {
		let r = t.find((e) => e[L.isDefault] === !0) ?? t[0], i = R(r[L.collection]) || null;
		return i && !n.has(i) && n.set(i, {
			id: i,
			name: R(r[L.collectionName]) || i,
			intro: R(r[L.collectionIntro]),
			description: R(r[L.collectionDescription]),
			images: {}
		}), {
			id: e,
			name: R(r[L.name]) || r.sku,
			collection: i,
			productType: R(r[L.productType]) || null,
			environment: Qt(r[L.environment]),
			application: R(r[L.application]) || null,
			variantAttributes: Xt(r[L.variantAttributes]),
			story: R(r[L.story]),
			inspiration: R(r[L.inspiration]),
			video: R(r[L.video]),
			images: en(t),
			specs: {},
			variants: t.map((e) => ({
				sku: e.sku,
				isDefault: e === r,
				description: R(e[L.description]),
				attributes: Object.fromEntries(Object.keys(F).map((t) => [t, R(e[t])]).filter(([, e]) => e && e !== "-")),
				images: $t(e),
				downloads: Object.fromEntries(Zt.map((t) => [t, R(e[t])]).filter(([, e]) => e))
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
async function nn() {
	return tn(await Wt({ q: "*" }));
}
//#endregion
//#region src/data/catalog.js
var z = null;
function B() {
	return z ??= nn().then(rn), z.catch(() => z = null), z;
}
function rn({ collections: e, groups: t }) {
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
var an = (e, t) => `/arq/producto/${encodeURIComponent(e)}${t ? `?sku=${encodeURIComponent(t)}` : ""}`, V = (e) => `/arq/coleccion/${encodeURIComponent(e)}`;
function H({ environment: e, application: t, productType: n } = {}) {
	let r = new URLSearchParams();
	e && r.set("environment", e), t && r.set("application", t), n && r.set("product_type", n);
	let i = r.toString();
	return `/arq/productos${i ? `?${i}` : ""}`;
}
var U = (e) => e != null && String(e).trim() !== "";
function on(e, t) {
	return Object.entries(t).every(([t, n]) => !n?.length || n.includes(e.values[t]));
}
function sn(e, t, n = e.defaultVariant) {
	return [
		n,
		e.defaultVariant,
		...e.variants
	].filter((e, t, n) => n.indexOf(e) === t).find((e) => on(e, t)) ?? null;
}
function cn(e, { environment: t, application: n, productType: r, collection: i } = {}) {
	return !(t && !e.environment.includes(t) || n && e.application !== n || r && e.productType !== r || i && e.collection !== i);
}
var ln = (e = {}) => Object.fromEntries(Object.entries(e).filter(([, e]) => e?.length));
function un(e) {
	return qt.map((t) => {
		let n = /* @__PURE__ */ new Map();
		for (let r of e) for (let e of new Set(r.variants.map((e) => e.values[t]).filter(U))) n.set(e, (n.get(e) ?? 0) + 1);
		let r = [...n].map(([e, t]) => ({
			value: e,
			count: t
		})).sort((e, t) => String(e.value).localeCompare(String(t.value), "es", { numeric: !0 }));
		return {
			name: t,
			label: I(t).label,
			options: r
		};
	}).filter((e) => e.options.length > 1);
}
function dn(e) {
	return e.productType && e.productType !== "Luminaria" ? e.productType : [e.environment.join(" · "), e.application].filter(Boolean).join(" · ");
}
var fn = Object.keys(F).filter((e) => F[e].control === "swatches"), pn = (e) => [...new Set(e.variants.flatMap((e) => fn.map((t) => e.values[t])).filter(U))];
function W(e, t = e.defaultVariant, n = !1) {
	let r = {
		...e.defaultVariant.images,
		...G(t.images)
	};
	return {
		id: e.id,
		sku: t.sku,
		name: e.name,
		meta: dn(e),
		finishes: pn(e),
		href: an(e.id, n && t !== e.defaultVariant ? t.sku : null),
		image: r.studio ?? null,
		imageHover: r.context ?? null,
		imageLit: r.studioOn ?? null,
		imageHoverLit: r.contextOn ?? null
	};
}
var G = (e = {}) => Object.fromEntries(Object.entries(e).filter(([, e]) => U(e) && (!Array.isArray(e) || e.length)));
function mn(e, t) {
	let n = [...new Set(t.map((e) => e.application).filter(Boolean))], r = e.images ?? {};
	return {
		id: e.id,
		name: e.name,
		meta: n.join(" · "),
		finishes: [...new Set(t.flatMap(pn))],
		href: V(e.id),
		image: r.studio ?? null,
		imageHover: r.context ?? null,
		imageLit: r.studioOn ?? null,
		imageHoverLit: r.contextOn ?? null
	};
}
async function hn({ filters: e, query: t, ...n } = {}) {
	let { groups: r } = await B(), i = Me(t ?? ""), a = /* @__PURE__ */ new Map();
	for (let e of r) {
		if (!cn(e, n)) continue;
		let t = i.length ? Pn(e, i) : {
			variant: e.defaultVariant,
			bySku: !1
		};
		t && a.set(e, t);
	}
	let o = [...a.keys()], s = ln(e), c = Object.keys(s).length > 0, l = o.flatMap((e) => {
		let t = a.get(e), n = sn(e, s, t.variant);
		return n ? [W(e, n, c || t.bySku)] : [];
	});
	return {
		cards: l,
		count: l.length,
		filters: un(o)
	};
}
async function gn({ filters: e } = {}) {
	let { collections: t, groups: n } = await B(), r = ln(e), i = t.flatMap((e) => {
		let t = n.filter((t) => t.collection === e.id);
		return t.some((e) => sn(e, r)) ? [mn(e, t)] : [];
	});
	return {
		cards: i,
		count: i.length,
		filters: un(n.filter((e) => e.collection))
	};
}
async function _n(e) {
	let { groups: t, groupById: n } = await B(), r = n.get(e);
	if (!r) return null;
	let i = r.collection ? t.filter((e) => e.collection === r.collection && e !== r).map((e) => W(e)) : [], a = r.images ?? {};
	return {
		group: r,
		collection: r.collectionData,
		variants: r.variants.map((e) => ({
			sku: e.sku,
			isDefault: e === r.defaultVariant,
			attributes: e.values
		})),
		variantAttributes: r.variantAttributes,
		family: i,
		images: {
			ambient: K(a.ambient),
			description: U(a.description) ? a.description : null,
			inspiration: K(a.inspiration)
		},
		glossary: vn(r),
		files: wn(r.defaultVariant).filter((e) => e.type === "cad" || e.type === "manual")
	};
}
var K = (e) => [...new Set([e ?? []].flat().filter(U))];
function vn(e) {
	let t = e.defaultVariant.images?.studio ?? null;
	return {
		columns: Kt.filter(({ field: t }) => e.variants.some((e) => U(e.values[t]))).map(({ field: e, label: t }) => ({
			key: e,
			label: t
		})),
		filters: e.variantAttributes.map((e) => ({
			key: e,
			label: I(e).label,
			swatches: I(e).control === "swatches"
		})),
		rows: e.variants.map((e) => ({
			sku: e.sku,
			thumb: e.images?.studio ?? t,
			attributes: e.values,
			values: e.values
		}))
	};
}
async function yn() {
	let { groups: e } = await B(), t = e.flatMap((e) => e.variants.map((t) => ({
		group: e,
		variant: t
	}))), n = /* @__PURE__ */ new Set([...e.flatMap((e) => e.variantAttributes), ...qt]), r = Object.keys(F).filter((e) => n.has(e) && new Set(t.map(({ variant: t }) => t.values[e]).filter(U)).size > 1);
	return {
		columns: Kt.filter(({ field: e }) => t.some(({ variant: t }) => U(t.values[e]))).map(({ field: e, label: t }) => ({
			key: e,
			label: t
		})),
		filters: r.map((e) => ({
			key: e,
			label: I(e).label,
			swatches: I(e).control === "swatches"
		})),
		rows: t.map(({ group: e, variant: t }) => ({
			sku: t.sku,
			thumb: t.images?.studio ?? e.defaultVariant.images?.studio ?? null,
			search: [e.name, e.collectionData?.name].filter(Boolean).join(" "),
			attributes: t.values,
			values: t.values
		}))
	};
}
async function bn(e) {
	let { groups: t } = await B(), n = t.flatMap((e) => e.variants).find((t) => t.sku === e);
	return n ? wn(n) : [];
}
async function xn(e) {
	let { groupById: t } = await B();
	return e.map((e) => t.get(e)).filter(Boolean).map((e) => ({
		...W(e),
		meta: Sn(e)
	}));
}
function Sn(e) {
	return e.productType && e.productType !== "Luminaria" ? e.productType : e.application ?? e.productType ?? "";
}
var Cn = {
	cad: "CAD 2D/3D",
	manual: "Manual",
	ies: "IES",
	fotometria: "Fotometría"
};
function wn(e) {
	let t = G(e.downloads);
	return Object.keys(Cn).filter((e) => t[e]).map((e) => ({
		type: e,
		label: Cn[e],
		href: t[e]
	}));
}
function Tn(e, t) {
	let n = e.variants.find((e) => e.sku === t) ?? e.defaultVariant, r = G(n.images), i = G(e.defaultVariant.images), a = r.gallery ?? i.gallery ?? [r.studio ?? i.studio].filter(Boolean), o = r.galleryOn ?? (r.gallery ? [] : i.galleryOn ?? []);
	return {
		sku: n.sku,
		description: n.description,
		values: n.values,
		images: a.map((t, n) => ({
			src: t,
			srcOn: o[n] ?? null,
			alt: `${e.name}, imagen ${n + 1}`
		})),
		sections: Jt(n.values),
		downloads: wn(n)
	};
}
async function En(e) {
	let { collectionById: t, groups: n } = await B(), r = t.get(e);
	if (!r) return null;
	let i = r.images ?? {};
	return {
		collection: r,
		cards: n.filter((t) => t.collection === e).map((e) => ({
			...W(e),
			meta: Dn(e)
		})),
		images: {
			gallery: K(i.gallery),
			description: U(i.description) ? i.description : null,
			inspiration: K(i.inspiration)
		}
	};
}
function Dn(e) {
	let t = (e) => Number.parseFloat(String(e).replace(",", "."));
	return e.variantAttributes.filter((e) => I(e).control !== "swatches").map((n) => {
		let r = [...new Set(e.variants.map((e) => e.values[n]).filter(U))];
		return r.sort((e, n) => t(e) - t(n) || String(e).localeCompare(String(n), "es")), r.length > 1 ? `${r[0]} – ${r.at(-1)}` : r[0];
	}).filter(Boolean).join(" · ");
}
var On = (e) => e.variants.map((t) => ({
	sku: t.sku,
	isDefault: t === e.defaultVariant,
	attributes: t.values
})), kn = (e, t) => Object.fromEntries(e.variantAttributes.map((e) => [e, t.values[e]]));
function An(e, t) {
	let n = kn(e, t);
	return Le(On(e), e.variantAttributes, n).map(({ attribute: e, options: t }) => {
		let r = I(e);
		return {
			field: e,
			label: r.label,
			value: n[e] ?? "",
			options: t.map((e) => ({
				value: e.value,
				label: e.value,
				disabled: e.disabled,
				showSwatch: r.control === "swatches"
			}))
		};
	});
}
async function jn(e, t, n) {
	let { groups: r } = await B(), i = r.find((t) => t.variants.some((t) => t.sku === e)), a = i?.variants.find((t) => t.sku === e);
	if (!i || !a) return null;
	let o = Ve(kn(i, a), t, n);
	return Fe(On(i), o)?.sku ?? null;
}
async function Mn(e) {
	let { groups: t } = await B(), n = e.slice(0, 3).flatMap((e) => {
		let n = t.find((t) => t.variants.some((t) => t.sku === e));
		return n ? [{
			group: n,
			variant: n.variants.find((t) => t.sku === e)
		}] : [];
	}), r = n.map(({ group: e, variant: t }) => {
		let n = W(e, t, !0);
		return {
			sku: t.sku,
			name: e.name,
			meta: t.sku,
			image: n.image,
			href: n.href,
			attributes: An(e, t)
		};
	}), i = Jt(Object.assign({}, ...n.map(({ variant: e }) => e.values))).map((e) => ({
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
var Nn = (e) => [
	e.name,
	e.collectionData?.name,
	e.application,
	e.productType,
	...e.environment
].join(" ");
function Pn(e, t) {
	let n = e.variants.find((e) => v(e.sku, t));
	return n ? {
		variant: n,
		bySku: !0
	} : v(Nn(e), t) ? {
		variant: e.defaultVariant,
		bySku: !1
	} : null;
}
async function Fn(e, { limit: t = 5 } = {}) {
	let n = Me(e);
	if (!n.length) return {
		results: [],
		total: 0
	};
	let { groups: r, collections: i } = await B(), a = r.flatMap((e) => {
		let t = Pn(e, n);
		if (!t) return [];
		let r = W(e, t.variant, t.bySku);
		return [{
			name: e.name,
			meta: t.variant.sku,
			href: r.href,
			image: r.image
		}];
	}), o = i.filter((e) => v(e.name, n)).map((e) => ({
		name: e.name,
		meta: "Colección",
		href: V(e.id),
		image: e.images?.studio ?? null
	})), s = [...a, ...o];
	return {
		results: s.slice(0, t),
		total: s.length
	};
}
var In = (e) => `/arq/productos?q=${encodeURIComponent(e)}`;
async function Ln() {
	let { groups: e, collections: t } = await B(), n = (t) => e.filter((e) => cn(e, t)).length, r = (e, t) => ({
		label: e,
		href: H(t),
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
			id: _(t),
			label: t,
			href: H({ environment: t }),
			all: {
				label: n,
				href: H({ environment: t })
			},
			links: i
		} : null;
	}, a = (t, n, r) => {
		let i = e.filter((e) => e.productType === t).map((e) => ({
			label: e.name,
			href: an(e.id),
			count: 1
		}));
		return i.length ? {
			id: _(n),
			label: n,
			href: H({ productType: t }),
			all: {
				label: r,
				href: H({ productType: t })
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
			href: V(t.id)
		})).filter((e) => e.meta),
		allCollections: {
			label: "Ver todas las colecciones",
			href: "/arq/productos?view=colecciones"
		}
	};
}
//#endregion
//#region src/components/comparativa/comparativa.css?inline
var Rn = ":host{display:block}.page{flex-direction:column;max-width:100%;display:flex;overflow-x:clip}.status{padding-inline:var(--page-gutter);padding-block:var(--arq-space-section-xs);color:var(--arq-color-text-secondary);margin:0}.mobile-controls{display:none}@media (width<=767px){.mobile-controls:not([hidden]){padding-inline:var(--page-gutter);align-items:center;padding-block-end:var(--arq-space-gap-md);display:flex}.scroll{overflow-x:visible}.scroll:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:calc(-1 * var(--arq-border-strong))}}", zn = "arq:compare", Bn = 3, q = matchMedia("(max-width: 767px)"), Vn = {
	empty: "Elegí hasta 3 productos para comparar desde el listado de Productos.",
	error: "No se pudo cargar la comparación. Probá de nuevo en unos minutos."
};
function Hn() {
	let e = new URLSearchParams(location.search).get("sku");
	return e ? e.split(",").map((e) => decodeURIComponent(e.trim())).filter(Boolean).slice(0, Bn) : [];
}
function Un(e) {
	try {
		localStorage.setItem(zn, JSON.stringify(e.map((e) => ({
			sku: e.sku,
			name: e.name,
			meta: e.meta,
			image: e.image
		}))));
	} catch {}
}
(class extends f {
	static tag = "arq-comparativa";
	static styles = Rn;
	static properties = {};
	static template = "<div class=\"page\"><p class=\"status role-body\" role=\"status\" hidden></p><div class=\"mobile-controls\" hidden><arq-toggle show-label class=\"diff-mobile\">Solo diferencias</arq-toggle></div><div class=\"scroll\" aria-label=\"Comparación de productos\" hidden><arq-compare-header class=\"header\"></arq-compare-header><arq-compare-table class=\"table\" embedded></arq-compare-table></div></div>";
	#e = [];
	#t = !1;
	setup() {
		let e = this.shadowRoot, t = e.querySelector(".header"), n = e.querySelector(".table"), r = (e) => {
			this.#t = e, t.onlyDifferences = e, n.onlyDifferences = e;
		};
		t.addEventListener("arq:differences", (e) => r(e.detail.value)), e.querySelector(".diff-mobile").addEventListener("arq:change", (e) => r(e.detail.checked)), t.addEventListener("arq:remove", (e) => {
			this.#e = this.#e.filter((t) => t !== e.detail.sku), this.#i();
		}), t.addEventListener("arq:change", (e) => this.#r(e.detail)), t.addEventListener("arq:scroll", (e) => {
			q.matches && n.setScrollLeft(e.detail.left);
		}), n.addEventListener("arq:scroll", (e) => {
			q.matches && t.setScrollLeft(e.detail.left);
		}), q.addEventListener("change", () => this.#n()), this.#n(), this.#e = Hn(), this.#i();
	}
	#n() {
		let e = this.shadowRoot.querySelector(".scroll");
		q.matches ? (e.setAttribute("tabindex", "0"), e.setAttribute("role", "region")) : (e.removeAttribute("tabindex"), e.removeAttribute("role"));
	}
	async #r({ index: e, field: t, value: n }) {
		let r = this.#e[e];
		if (!n || !r) return;
		let i = await jn(r, t, n);
		i && i !== r && (this.#e[e] = i, this.#e = this.#e.slice(0, Bn), this.#i());
	}
	async #i() {
		let e = this.shadowRoot, t = e.querySelector(".header"), n = e.querySelector(".table"), r = e.querySelector(".scroll"), i = e.querySelector(".mobile-controls");
		this.setAttribute("aria-busy", "true");
		let a = null, o = !1;
		try {
			a = this.#e.length ? await Mn(this.#e) : {
				products: [],
				groups: []
			};
		} catch (e) {
			o = !0, console.error("[arq] comparativa: no se pudo cargar el catálogo", e);
		}
		if (this.removeAttribute("aria-busy"), !a || o && !a.products.length) {
			this.#a(o ? Vn.error : Vn.empty), r.hidden = !0, i.hidden = !0;
			return;
		}
		if (this.#e = a.products.map((e) => e.sku), !this.#e.length) {
			this.#a(Vn.empty), r.hidden = !0, i.hidden = !0;
			return;
		}
		this.#a(""), r.hidden = !1, i.hidden = !1, t.products = a.products, t.onlyDifferences = this.#t, n.data = {
			products: a.products,
			groups: a.groups
		}, n.onlyDifferences = this.#t, e.querySelector(".diff-mobile").checked = this.#t, requestAnimationFrame(() => t.refreshCompact()), Un(a.products);
		let s = new URL(location.href);
		s.searchParams.set("sku", this.#e.map(encodeURIComponent).join(",")), history.replaceState(history.state, "", s);
	}
	#a(e) {
		let t = this.shadowRoot.querySelector(".status");
		t.textContent = e, t.hidden = !e;
	}
}).define();
//#endregion
//#region src/components/mega-link/mega-link.css?inline
var Wn = ":host{min-width:0;display:block}.link{align-items:center;gap:var(--arq-space-gap-sm);padding-block:var(--arq-space-gap-sm);border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle);color:var(--arq-color-text-primary);text-decoration:none;display:flex}.link[href]:hover{background:var(--arq-color-surface-hover)}.link:focus-visible,.trigger:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.text{gap:var(--arq-space-gap-xs);flex-direction:column;flex:1;min-width:0;display:flex}.name{overflow-wrap:break-word}.meta{color:var(--arq-color-text-tertiary)}.arrow{color:var(--arq-color-icon-primary);flex:none;display:inline-flex}.icon{width:var(--arq-icon-md);height:var(--arq-icon-md)}.group{border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle)}.trigger{align-items:center;gap:var(--arq-space-gap-sm);width:100%;padding:var(--arq-space-gap-md) 0;color:var(--arq-color-text-primary);font:inherit;text-align:start;cursor:pointer;background:0 0;border:0;display:flex}.trigger:hover{background:var(--arq-color-surface-hover)}.trigger .name{flex:1;min-width:0}.toggle{color:var(--arq-color-icon-primary);flex:none;display:inline-flex}:host(:not([open])) [data-icon=minus],:host([open]) [data-icon=plus]{display:none}.links{padding-bottom:var(--arq-space-gap-md);flex-direction:column;align-items:flex-start;display:flex}::slotted(a){width:100%;padding-block:var(--arq-space-gap-sm);color:var(--arq-color-text-primary);font-family:var(--arq-font-family-sans);font-weight:var(--arq-font-weight-light);font-size:var(--arq-type-body-lg-size);line-height:var(--arq-type-body-lg-leading);letter-spacing:var(--arq-font-tracking-normal);text-decoration:none;display:block}::slotted(a:focus-visible){outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}::slotted(arq-button){margin-block:var(--arq-space-gap-sm)}", Gn = `<a class="link"><span class="text"><span class="name role-body"><slot></slot></span><span class="meta role-caption"><slot name="meta"></slot></span></span><span class="arrow">${p("arrow-right")}</span></a>`, Kn = `<div class="group"><button type="button" class="trigger"><span class="name role-body-xl"><slot></slot></span><span class="toggle">${p("plus")}${p("minus")}</span></button><div class="links"><slot name="links"></slot></div></div>`;
(class extends f {
	static tag = "arq-mega-link";
	static styles = Wn;
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
		t.innerHTML = this.type === "group" ? Kn : Gn, e.append(t.content), this.type === "group" ? this.disclosure = new h(this, {
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
//#region src/components/mega-menu/mega-menu.css?inline
var qn = ":host{display:block}.menu{background:var(--arq-color-surface-default);border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle)}.tabs{gap:var(--arq-space-gap-xl);padding:var(--arq-space-gap-md) var(--page-gutter) 0;border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle);display:flex}.body{align-items:stretch;display:flex}.panels{flex:1;min-width:0;display:flex}.panel{gap:var(--arq-space-gap-md);min-width:0;padding:var(--arq-space-gap-xl) var(--page-gutter);flex-direction:column;flex:1;display:flex}.columns{gap:var(--arq-space-gap-xl);flex:1;display:flex}.column{justify-content:space-between;align-items:flex-start;gap:var(--arq-space-gap-md);flex-direction:column;flex:1;min-width:0;display:flex}.top{gap:var(--arq-space-gap-md);flex-direction:column;align-self:stretch;display:flex}.title{color:var(--arq-color-text-primary);margin:0}.links{flex-direction:column;align-self:stretch;display:flex}.panel--colecciones .column{justify-content:flex-start;align-items:stretch}.panel--colecciones .all{align-self:flex-start}.image{width:var(--arq-layout-mega-menu-image);aspect-ratio:4/5;background:var(--arq-color-surface-subtle);flex:none;position:relative}.image img{object-fit:cover;width:100%;height:100%;position:absolute;inset:0}", J = (e) => String(e ?? "").replace(/[&<>"]/g, (e) => ({
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;"
})[e]), Jn = [
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
], Yn = 3, Xn = 0;
(class extends f {
	static tag = "arq-mega-menu";
	static styles = qn;
	static properties = {
		tab: {
			type: String,
			values: Jn.map((e) => e.id),
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
	#n = ++Xn;
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
		this.select = new T(t, { items: "arq-tab" }), t.addEventListener("arq:change", (e) => {
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
		let e = this.shadowRoot, t = this.#e, n = Jn.filter((e) => e.id === "colecciones" ? t?.collections?.length : this.#r(e.id).length);
		n.length && !n.some((e) => e.id === this.tab) && (this.tab = n[0].id);
		let r = (e) => ({
			tab: `mega-tab-${this.#n}-${e.id}`,
			panel: `mega-panel-${this.#n}-${e.id}`
		});
		e.querySelector(".tabs").innerHTML = n.map((e) => `<arq-tab id="${r(e).tab}" value="${e.id}" aria-controls="${r(e).panel}"${e.id === this.tab ? " selected" : ""}>${J(e.label)}</arq-tab>`).join(""), e.querySelector(".panels").innerHTML = n.map((e) => {
			let n = e.id === "colecciones" ? this.#o(t) : this.#a(this.#r(e.id));
			return `<div class="panel panel--${e.id}" role="tabpanel" id="${r(e).panel}" aria-labelledby="${r(e).tab}" data-tab="${e.id}"${e.id === this.tab ? "" : " hidden"}>${n}</div>`;
		}).join(""), this.select.refresh(), this.#s();
	}
	#a(e) {
		return "<div class=\"columns\">" + e.map((e) => `<div class="column"><div class="top"><p class="title role-heading-3">${J(e.label)}</p><div class="links">${e.links.map((e) => `<arq-mega-link href="${J(e.href)}" show-arrow>${J(e.label)}</arq-mega-link>`).join("")}</div></div><arq-button type="underline" show-underline href="${J(e.all.href)}">${J(e.all.label)}</arq-button></div>`).join("") + "</div>";
	}
	#o(e) {
		let t = e?.collections ?? [], n = Math.ceil(t.length / Yn);
		return "<p class=\"title role-heading-3\">Colecciones</p><div class=\"columns\">" + Array.from({ length: Yn }, (e, r) => t.slice(r * n, (r + 1) * n)).map((e) => `<div class="links column">${e.map((e) => `<arq-mega-link href="${J(e.href)}" show-arrow>${J(e.label)}<span slot="meta">${J(e.meta)}</span></arq-mega-link>`).join("")}</div>`).join("") + `</div><arq-button class="all" type="underline" show-underline href="${J(e?.allCollections?.href)}">${J(e?.allCollections?.label)}</arq-button>`;
	}
	#s() {
		let e = this.shadowRoot.querySelector("img"), t = this.#t[this.tab];
		t ? e.src = t : (e.removeAttribute("src"), e.hidden = !0);
	}
}).define();
//#endregion
//#region src/components/search-result/search-result.css?inline
var Zn = ":host{min-width:0;display:block}.result{align-items:center;gap:var(--arq-space-gap-md);padding:var(--arq-space-gap-sm) var(--search-inline,var(--arq-space-padding-md));border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle);background:var(--arq-color-surface-default);color:var(--arq-color-text-primary);text-decoration:none;display:flex}.result[href]:hover,.result.active{background:var(--arq-color-surface-hover)}.result:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:calc(var(--arq-border-strong) * -1)}.thumb{width:var(--arq-layout-search-thumb);height:var(--arq-layout-search-thumb);background:var(--arq-color-surface-subtle);flex:none}.thumb img{object-fit:cover;width:100%;height:100%;display:block}.text{gap:var(--arq-space-gap-xs);flex-direction:column;flex:1;min-width:0;display:flex}.name,.meta{overflow-wrap:break-word}.meta{color:var(--arq-color-text-tertiary)}.arrow{color:var(--arq-color-icon-primary);flex:none;display:inline-flex}.icon{width:var(--arq-icon-md);height:var(--arq-icon-md)}";
(class extends f {
	static tag = "arq-search-result";
	static styles = Zn;
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
var Qn = ":host{min-width:0;display:block}.row{align-items:center;gap:var(--arq-space-gap-md);padding:var(--arq-space-gap-sm) var(--search-inline,var(--arq-space-padding-md));color:var(--arq-color-icon-tertiary);text-decoration:none;display:flex}.row[href]:hover{background:var(--arq-color-surface-hover)}.row:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:calc(var(--arq-border-strong) * -1)}.icon{width:var(--arq-icon-md);height:var(--arq-icon-md);flex:none}.text{min-width:0;color:var(--arq-color-text-tertiary);overflow-wrap:break-word;flex:1}.term{color:var(--arq-color-text-primary)}";
(class extends f {
	static tag = "arq-search-see-all";
	static styles = Qn;
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
var $n = ":host{min-width:0;display:block}.dropdown{background:var(--arq-color-surface-default);border:var(--arq-border-default) solid var(--arq-color-border-subtle)}.results{flex-direction:column;display:flex}.message{gap:var(--arq-space-gap-sm);padding:var(--arq-space-padding-md) var(--arq-space-padding-md);flex-direction:column;display:flex}.message p{margin:0}.title{color:var(--arq-color-text-primary)}.help{color:var(--arq-color-text-tertiary)}.explore{align-items:center;gap:var(--arq-space-gap-sm);padding:var(--arq-space-padding-sm) var(--arq-space-padding-md);border-top:var(--arq-border-default) solid var(--arq-color-border-subtle);color:var(--arq-color-text-tertiary);text-decoration:none;display:flex}.explore:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:calc(var(--arq-border-strong) * -1)}.explore .icon{width:var(--arq-icon-md);height:var(--arq-icon-md);color:var(--arq-color-icon-primary);flex:none}";
(class extends f {
	static tag = "arq-search-dropdown";
	static styles = $n;
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
var er = ":host{display:contents}.dialog{box-sizing:border-box;border-radius:var(--arq-radius-control);background:var(--arq-color-surface-default);width:100%;max-width:none;height:100dvh;max-height:none;color:var(--arq-color-text-primary);border:0;margin:0;padding:0;inset:0}.screen{flex-direction:column;height:100%;display:flex}.header{align-items:center;gap:var(--arq-space-gap-sm);padding:var(--arq-space-gap-md) var(--arq-layout-gutter);border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle);flex:none;display:flex}.field{flex:1}.content{overscroll-behavior:contain;--search-inline:var(--arq-layout-gutter);flex:1;overflow-y:auto}";
(class extends f {
	static tag = "arq-search-screen";
	static styles = er;
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
//#region src/components/nav-link/nav-link.css?inline
var tr = ":host{vertical-align:middle;max-width:100%;display:inline-flex}.link{box-sizing:border-box;align-items:center;gap:var(--arq-space-gap-sm);background:var(--arq-color-surface-transparent);max-width:100%;color:var(--arq-color-text-primary);font:inherit;text-align:start;cursor:pointer;-webkit-tap-highlight-color:var(--arq-color-surface-transparent);border:0;margin:0;padding:0;text-decoration:none;display:inline-flex;position:relative}.label{white-space:nowrap;min-width:0}.indicator{width:var(--arq-space-gap-sm);height:var(--arq-border-strong);background:var(--arq-color-border-strong);flex:none;display:none}.current .indicator{display:block}.chevron{flex:none;display:none}:host([has-dropdown]) .chevron{display:inline-flex}.chevron .icon{width:var(--arq-icon-sm);height:var(--arq-icon-sm)}[aria-expanded=true] .chevron .icon{transform:rotate(180deg)}.trailing{display:none}.link:after{content:\"\";inset-inline:0;top:calc(100% + var(--arq-space-padding-2xs) - var(--arq-border-default));height:var(--arq-border-default);background:var(--arq-color-border-strong);visibility:hidden;position:absolute}.link:not(.current):not([aria-expanded=true]):hover:after{visibility:visible}.link:active{color:var(--arq-color-text-tertiary)}.link:active:after{visibility:hidden}.link:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.link:focus:not(:focus-visible){outline:none}@media (width>=768px){:host([theme=inverse]) .link,:host([theme=inverse]) .link:active{color:var(--arq-color-text-inverse)}:host([theme=inverse]) .indicator,:host([theme=inverse]) .link:after{background:var(--arq-color-icon-inverse)}:host([theme=inverse]) .chevron{color:var(--arq-color-icon-inverse)}}@media (width<=767px){:host{width:100%;display:flex}.link{width:100%;padding:var(--arq-space-gap-md) var(--arq-layout-gutter)}.label{white-space:normal;flex:1}:host([has-dropdown]) .chevron{display:none}.trailing{flex:none;display:inline-flex}.trailing .icon{width:var(--arq-icon-md);height:var(--arq-icon-md)}.trailing [data-icon=arrow-right],.current .trailing [data-icon=chevron-right]{display:none}.current .trailing [data-icon=arrow-right]{display:block}.link:after{display:none}.link:active{background:var(--arq-color-surface-selected);color:var(--arq-color-text-primary)}@media (hover:hover){.link:not(:active):hover{background:var(--arq-color-surface-hover)}}.link:focus-visible{outline-offset:calc(var(--arq-border-strong) * -1)}}", nr = matchMedia("(max-width: 767px)");
(class extends f {
	static tag = "arq-nav-link";
	static styles = tr;
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
		this.#e = this.shadowRoot.querySelector(".link"), nr.addEventListener("change", () => this.#t()), this.#t();
	}
	#t() {
		let e = this.shadowRoot.querySelector(".label"), t = !nr.matches;
		e.classList.toggle("role-body", t && !this.current), e.classList.toggle("role-body-regular", t && this.current), e.classList.toggle("role-body-xl", !t);
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
var rr = ":host{z-index:4;transition:transform var(--arq-motion-duration-base) var(--arq-motion-easing-standard);display:block;position:sticky;top:0}@media (width>=1024px){:host([data-arq-catalog-hidden]){transform:translateY(-100%)}}@media (width<=767px){:host([data-arq-compare-hidden]){transform:translateY(-100%)}}:host([theme=transparent]){position:fixed;inset-inline:0}.navbar{position:relative}.bar{box-sizing:border-box;justify-content:space-between;align-items:center;gap:var(--arq-space-gap-xl);height:calc(var(--arq-space-gap-md) * 2 + var(--arq-icon-xl));padding:0 var(--page-gutter);border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle);background:var(--arq-color-surface-default);color:var(--arq-color-text-primary);display:flex}.over-photo .bar{background:var(--arq-color-overlay-translucent);-webkit-backdrop-filter:blur(var(--arq-blur-backdrop))}.over-photo .logo{color:var(--arq-color-text-inverse)}.over-photo .search-open,.over-photo .actions arq-icon-button{color:var(--arq-color-icon-inverse)}.logo{flex:none}.right{align-items:center;gap:var(--arq-space-gap-xl);min-width:0;display:flex}.links{align-items:center;gap:var(--arq-space-gap-xl);display:flex}.search{align-items:center;display:flex;position:relative}.search-box{width:var(--arq-layout-search-field);position:relative}.search-dropdown{top:100%;position:absolute;inset-inline:0}.actions{display:none}.mega{top:100%;position:absolute;inset-inline:0}.menu{box-sizing:border-box;border-radius:var(--arq-radius-control);background:var(--arq-color-surface-default);width:100%;max-width:none;height:100dvh;max-height:none;color:var(--arq-color-text-primary);overscroll-behavior:contain;border:0;margin:0;padding:0;inset:0}.menu-bar{box-sizing:border-box;height:calc(var(--arq-space-gap-md) * 2 + var(--arq-icon-xl));padding:0 var(--page-gutter);border-bottom:var(--arq-border-default) solid var(--arq-color-border-subtle);justify-content:space-between;align-items:center;display:flex}.menu-main{padding-block:var(--arq-space-gap-sm);flex-direction:column;display:flex}.menu-products{padding:var(--arq-space-gap-sm) 0 var(--arq-space-gap-xl);flex-direction:column;display:flex}.back{align-items:center;gap:var(--arq-space-gap-xs);padding:var(--arq-space-gap-sm) var(--page-gutter);color:var(--arq-color-text-secondary);text-align:start;cursor:pointer;background:0 0;border:0;display:flex}.back .icon{box-sizing:content-box;width:var(--arq-icon-md);height:var(--arq-icon-md);padding:var(--arq-space-padding-xs);color:var(--arq-color-icon-primary)}.back:focus-visible{outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:calc(var(--arq-border-strong) * -1)}.groups{padding:var(--arq-space-gap-md) var(--page-gutter) var(--arq-space-padding-md);flex-direction:column;display:flex}.collections{padding:var(--arq-space-gap-md) var(--page-gutter) 0}@media (width<=767px){.right{display:contents}.links,.search{display:none}.actions{align-items:center;gap:var(--arq-space-gap-sm);display:flex}}", Y = matchMedia("(max-width: 767px)"), X = (e) => String(e ?? "").replace(/[&<>"]/g, (e) => ({
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;"
})[e]), ir = 5, ar = 150;
(class extends f {
	static tag = "arq-navbar";
	static styles = rr;
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
		this.#s(), Y.addEventListener("change", () => {
			this.#p(), this.#s();
		}), this.addEventListener("arq:toggle", (e) => {
			e.target.localName === "arq-nav-link" && (e.stopPropagation(), Y.matches ? this.#l("products") : this.#m(e.detail.open));
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
			e.composedPath().includes(this) || (this.#m(!1), this.mode === "search" && !Y.matches && this.#y(!1));
		});
		let i = () => {
			let e = document.querySelector("arq-hero"), t = e ? e.getBoundingClientRect().bottom <= this.shadowRoot.querySelector(".bar").getBoundingClientRect().bottom : window.scrollY > 0;
			t !== this.#d && (this.#d = t, this.shadowRoot.querySelector(".navbar").classList.toggle("scrolled", t), this.#c());
		};
		window.addEventListener("scroll", i, { passive: !0 }), window.addEventListener("resize", i, { passive: !0 });
		let a = document.querySelector("arq-hero");
		a && new ResizeObserver(i).observe(a), i(), this.shadowRoot.querySelector("slot[name=\"links\"]").addEventListener("slotchange", () => this.#c()), this.#c();
	}
	update(e) {
		e.has("label") && this.shadowRoot.querySelector(".bar").setAttribute("aria-label", this.label ?? ""), (e.has("theme") || e.has("mode")) && this.#c();
	}
	#o() {
		return this.querySelector("arq-nav-link[has-dropdown]");
	}
	#s() {
		let e = this.shadowRoot, t = e.querySelector("slot[name=\"links\"]");
		e.querySelector(Y.matches ? ".menu-main" : ".links").append(t), e.querySelector(".logo").size = Y.matches ? "small" : "default";
	}
	#c() {
		let e = this.theme === "transparent" && this.mode === "default" && !this.#d && !this.#f;
		this.shadowRoot.querySelector(".navbar").classList.toggle("over-photo", e);
		for (let t of this.querySelectorAll("arq-nav-link")) t.theme = e ? "inverse" : "default";
	}
	#l(e) {
		let t = this.shadowRoot, n = this.mode;
		this.mode = e, this.#m(!1);
		let r = t.querySelector(".menu"), i = Y.matches, a = e === "search" && !i;
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
		let t = this.shadowRoot.querySelector(".mega"), n = this.#o(), r = !!e && !Y.matches;
		r && this.#h(), r && this.mode === "search" && this.#l("default"), t.hidden = !r, n && (n.open = r), this.#f = r, this.#c();
	}
	#h() {
		this.#e || this.#t || (this.#t = Ln().then((e) => this.navigation = e).catch((e) => console.error("[arq] navbar: no se pudo cargar la navegación", e)).finally(() => this.#t = null));
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
		].filter(Boolean).map((e) => `<arq-mega-link type="group">${X(e.label)}` + e.links.map((e) => `<a slot="links" href="${X(e.href)}">${X(e.label)}</a>`).join("") + `<arq-button slot="links" type="underline" show-underline href="${X(e.all.href)}">Ver todo</arq-button></arq-mega-link>`).join(""), e.querySelector(".collections").innerHTML = t?.allCollections ? `<arq-button type="underline" show-underline show-icon icon="arrow-right" href="${X(t.allCollections.href)}">Ver colecciones</arq-button>` : "";
	}
	#_(e) {
		if (clearTimeout(this.#i), this.#a = e.trim(), !this.#a) {
			this.#v([], 0);
			return;
		}
		this.#i = setTimeout(async () => {
			let e = this.#a;
			try {
				let { results: t, total: n } = await Fn(e, { limit: ir });
				e === this.#a && this.#v(t, n);
			} catch (e) {
				console.error("[arq] navbar: no se pudo buscar", e);
			}
		}, ar);
	}
	#v(e, t) {
		let n = this.shadowRoot;
		this.#n = e, this.#r = -1;
		let r = this.#a, i = e.map((e) => `<arq-search-result href="${X(e.href)}"${e.image ? ` image="${X(e.image)}"` : ""}>${X(e.name)}<span slot="meta">${X(e.meta)}</span></arq-search-result>`).join("") + (e.length ? `<arq-search-see-all href="${X(In(r))}" term="${X(r)}" count="${t}"></arq-search-see-all>` : ""), a = r && !e.length, o = n.querySelector(".search-dropdown");
		o.state = a ? "no-results" : "results", o.term = r, o.innerHTML = i, this.#y(!!r);
		let s = n.querySelector(".search-screen");
		s.innerHTML = a ? `<arq-search-dropdown state="no-results" term="${X(r)}"></arq-search-dropdown>` : i, this.#C();
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
		return [...(Y.matches ? this.shadowRoot.querySelector(".search-screen") : this.shadowRoot.querySelector(".search-dropdown")).querySelectorAll("arq-search-result")];
	}
	#S(e) {
		let t = this.#x();
		t.length && (this.#r = this.#r < 0 && e < 0 ? t.length - 1 : (this.#r + e + t.length) % t.length, t.forEach((e, t) => e.active = t === this.#r), Y.matches || this.#y(!0), this.#C());
	}
	#C() {
		let e = this.#n[this.#r], t = e ? `${e.name}, ${e.meta}, ${this.#r + 1} de ${this.#n.length}` : "";
		this.shadowRoot.querySelector(".search-field").activeLabel = t, this.shadowRoot.querySelector(".search-screen").field.activeLabel = t;
	}
	#w(e) {
		let t = this.#x()[this.#r];
		t ? t.click() : e.trim() && location.assign(In(e.trim()));
	}
}).define();
//#endregion
//#region src/components/contact-item/contact-item.css?inline
var or = ":host{min-width:0;display:block}.item{align-items:flex-start;gap:var(--arq-space-gap-sm);flex-direction:column;display:flex;position:relative}.label{color:var(--arq-color-text-tertiary)}.value{max-width:100%;color:var(--arq-color-text-primary);overflow-wrap:anywhere;text-decoration:none}.value[href]:hover{text-decoration:underline;text-decoration-thickness:var(--arq-border-default);text-underline-offset:var(--arq-space-padding-2xs)}.value:focus-visible{outline:none}.item:has(.value:focus-visible){outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}";
(class extends f {
	static tag = "arq-contact-item";
	static styles = or;
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
var sr = ":host{min-width:0;display:block}.list{align-items:flex-start;gap:var(--arq-space-gap-md);flex-direction:column;display:flex}.title{color:var(--arq-color-text-tertiary)}.links{align-items:flex-start;gap:var(--arq-space-gap-md);flex-direction:column;display:flex}", cr = 0;
(class extends f {
	static tag = "arq-link-list";
	static styles = sr;
	static template = "<nav class=\"list\"><span class=\"title role-label\"><slot name=\"title\"></slot></span><div class=\"links\" role=\"list\"><slot></slot></div></nav>";
	setup() {
		let e = this.shadowRoot, t = e.querySelector(".title");
		t.id = `arq-link-list-${++cr}`, e.querySelector("nav").setAttribute("aria-labelledby", t.id);
		let n = e.querySelector("slot:not([name])"), r = () => {
			for (let e of n.assignedElements()) e.setAttribute("role", "listitem");
		};
		n.addEventListener("slotchange", r), r();
	}
}).define();
//#endregion
//#region src/components/option-tile/option-tile.css?inline
var lr = ":host{flex:1 1 max-content;cursor:pointer;min-width:0;display:flex}.tile{box-sizing:border-box;min-width:0;padding:var(--arq-space-padding-sm-md) var(--arq-space-padding-md);border-bottom:var(--arq-border-default) solid var(--arq-color-border-default);border-radius:var(--arq-radius-control);color:var(--arq-color-text-secondary);text-align:center;flex:1;justify-content:center;align-items:center;display:flex}:host(:not([disabled]):not([selected]):hover) .tile{border-bottom-color:var(--arq-color-border-hover);background:var(--arq-color-surface-faint);color:var(--arq-color-text-primary)}:host([selected]) .tile{border-bottom-color:var(--arq-color-border-strong);background:var(--arq-color-surface-soft);color:var(--arq-color-text-primary)}:host([disabled]){cursor:default}:host([disabled]) .tile{border-bottom-color:var(--arq-color-border-disabled);color:var(--arq-color-text-disabled);text-decoration:line-through}:host(:focus-visible){outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}:host(:focus:not(:focus-visible)){outline:none}";
(class extends f {
	static tag = "arq-option-tile";
	static styles = lr;
	static properties = {
		selected: { type: Boolean },
		disabled: { type: Boolean },
		value: { type: String }
	};
	static template = "<span class=\"tile role-body-regular\"><slot></slot></span>";
	setup() {
		this.selectable = new g(this, {
			role: "radio",
			state: "aria-checked"
		});
	}
}).define();
//#endregion
//#region src/components/swatch-picker/swatch-picker.css?inline
var ur = ":host{align-items:center;gap:var(--arq-space-gap-sm-md);flex-wrap:wrap;display:flex}";
(class extends f {
	static tag = "arq-swatch-picker";
	static styles = ur;
	static properties = { label: { type: String } };
	static template = "<slot></slot>";
	setup() {
		this.setAttribute("role", "radiogroup"), this.select = new T(this, { items: "arq-swatch" });
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
var dr = ":host{display:block}.group{align-items:flex-start;gap:var(--arq-space-gap-md);flex-direction:column;display:flex}.label{color:var(--arq-color-text-secondary)}.options{gap:var(--arq-space-gap-sm);flex-wrap:wrap;align-self:stretch;display:flex}:host([type=swatches]) .options,:host([type=select]) .options{display:block}";
(class extends f {
	static tag = "arq-option-group";
	static styles = dr;
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
		this.select = new T(this, { items: "arq-option-tile" }), this.shadowRoot.querySelector("slot").addEventListener("slotchange", () => this.#e());
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
var fr = ":host{vertical-align:middle;cursor:pointer;max-width:100%;display:inline-flex}.chip{box-sizing:border-box;max-width:100%;padding:var(--arq-space-padding-sm-md) var(--arq-space-padding-md);border:var(--arq-border-default) solid var(--arq-color-border-default);border-radius:var(--arq-radius-control);color:var(--arq-color-text-primary);white-space:nowrap;flex:1;justify-content:center;align-items:center;display:inline-flex}:host(:not([disabled]):hover) .chip{border-color:var(--arq-color-border-strong)}:host([selected]) .chip{border-color:var(--arq-color-border-strong);background:var(--arq-color-surface-selected)}:host([disabled]){cursor:default}:host([disabled]) .chip{border-color:var(--arq-color-border-disabled);color:var(--arq-color-text-disabled)}:host(:focus-visible){outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}:host(:focus:not(:focus-visible)){outline:none}";
(class extends f {
	static tag = "arq-choice-chip";
	static styles = fr;
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
		this.#t = this.selected, this.selectable = new g(this, {
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
var pr = ":host{width:100%;display:block}.input{gap:var(--arq-space-gap-sm);flex-direction:column;display:flex}.label{color:var(--arq-color-text-tertiary)}.field{box-sizing:border-box;align-items:center;gap:var(--arq-space-gap-sm);padding:calc(var(--arq-space-padding-sm) - var(--arq-border-default)) var(--arq-space-padding-sm-md);border:var(--arq-border-default) solid var(--arq-color-border-default);border-radius:var(--arq-radius-control);background:var(--arq-color-surface-default);display:flex}@media (hover:hover){:host(:not([disabled]):not([error]):not([open])) .field:hover{border-color:var(--arq-color-border-hover)}}.control{box-sizing:border-box;border-radius:var(--arq-radius-control);background:var(--arq-color-surface-transparent);width:100%;min-width:0;color:var(--arq-color-text-primary);border:0;flex:1;margin:0;padding:0}.control::placeholder{color:var(--arq-color-text-tertiary);opacity:1}:host([type=textarea]) .field{align-items:stretch}textarea.control{resize:vertical}:host([type=select]) .field{position:relative}.trigger{align-items:center;gap:var(--arq-space-gap-sm);text-align:start;cursor:pointer;-webkit-tap-highlight-color:var(--arq-color-surface-transparent);display:flex}.select-value{overflow-wrap:break-word;flex:auto;min-width:0}.select-value.placeholder{color:var(--arq-color-text-tertiary)}.chevron{flex:none;display:inline-flex}.icon{width:var(--arq-icon-md);height:var(--arq-icon-md);color:var(--arq-color-icon-primary)}:host(:not([open])) [data-icon=chevron-up],:host([open]) [data-icon=chevron-down]{display:none}.menu{top:calc(100% + var(--arq-border-default));left:calc(-1 * var(--arq-border-default));z-index:2;width:calc(100% + 2 * var(--arq-border-default));max-width:none;position:absolute}:host([open]) .field,:host([open]) .field:focus-within{border-color:var(--arq-color-border-strong)}:host([disabled]) .trigger{cursor:default}:host([disabled]) .icon{color:var(--arq-color-icon-disabled)}.helper{color:var(--arq-color-text-tertiary);margin:0}.error{color:var(--arq-color-text-error);margin:0}.control:focus,.control:focus-visible{outline:none}.field:has(.control:focus-visible){outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}:host([error]) .field,:host([error]) .field:focus-within{border-color:var(--arq-color-border-error)}:host([disabled]) .label,:host([disabled]) .helper,:host([disabled]) .control,:host([disabled]) .control::placeholder{color:var(--arq-color-text-disabled)}:host([disabled]) .field{border-color:var(--arq-color-border-disabled)}", mr = (() => {
	let e = 0;
	return () => `arq-input-${++e}`;
})(), hr = 4, gr = [
	"placeholder",
	"autocomplete",
	"required",
	"minlength",
	"maxlength",
	"pattern",
	"inputmode",
	"rows"
];
(class extends f {
	static tag = "arq-input";
	static styles = pr;
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
	static template = "<div class=\"input\"><label class=\"label role-label\"><slot></slot></label><div class=\"field\"></div><p class=\"helper role-body-sm\"><slot name=\"helper\"></slot></p><p class=\"error role-body-sm\" aria-live=\"polite\"></p></div>";
	#e = this.attachInternals();
	#t = null;
	#n = {
		control: mr(),
		helper: mr(),
		error: mr()
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
		for (let e of r ? [] : gr) this.hasAttribute(e) ? t.setAttribute(e, this.getAttribute(e)) : t.removeAttribute(e);
		t.localName === "textarea" && !this.hasAttribute("rows") && (t.rows = hr), t.disabled = this.disabled, n.querySelector(".label").classList.toggle("visually-hidden", !this.showLabel);
		let i = !!this.error, a = n.querySelector(".helper"), o = n.querySelector(".error");
		o.textContent = this.error ?? "", o.hidden = !i, a.hidden = i || !this.showHelper, t.setAttribute("aria-invalid", String(i));
		let s = [i ? this.#n.error : null, a.hidden ? null : this.#n.helper].filter(Boolean);
		s.length ? t.setAttribute("aria-describedby", s.join(" ")) : t.removeAttribute("aria-describedby"), r && (e.has("open") && (n.querySelector(".menu").hidden = !this.open, t.setAttribute("aria-expanded", String(this.open)), this.open || this.#o.closed()), this.#l()), this.#u();
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
		t.type = "button", t.className = "control trigger role-body", t.id = this.#n.control, t.setAttribute("aria-expanded", "false"), t.innerHTML = `<span class="select-value"></span><span class="chevron">${p("chevron-down")}${p("chevron-up")}</span>`;
		let n = e.querySelector(".field");
		n.replaceChildren(t);
		let r = document.createElement("arq-select-menu");
		r.type = "text", r.className = "menu", r.id = `${this.#n.control}-menu`, r.hidden = !0, n.append(r), this.#t = t, this.#a = this.getAttribute("value") ?? "", this.#o = new Te({
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
var _r = ":host{width:100%;display:block}.upload{gap:var(--arq-space-gap-sm);flex-direction:column;display:flex}.label{color:var(--arq-color-text-secondary)}.zone,.attached{box-sizing:border-box;padding:var(--arq-space-padding-lg);border:var(--arq-border-default) dashed var(--arq-color-border-default);border-radius:var(--arq-radius-control);background:var(--arq-color-bg-subtle);align-items:center;display:flex;position:relative}.zone{cursor:pointer}.attached{justify-content:space-between;gap:var(--arq-space-gap-sm-md);border-style:solid}.empty{align-items:center;gap:var(--arq-space-gap-sm-md);min-width:0;display:flex}.icon{width:var(--arq-icon-md);height:var(--arq-icon-md);color:var(--arq-color-icon-primary);flex:none}.prompt,.file{min-width:0;color:var(--arq-color-text-primary)}.file{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.remove{flex:none}.helper{color:var(--arq-color-text-tertiary);margin:0}.error{color:var(--arq-color-text-error);margin:0}.drop{min-width:0;color:var(--arq-color-text-primary);display:none}:host(:state(drag-over)) .zone{border-color:var(--arq-color-border-strong);background:var(--arq-color-surface-hover)}:host(:state(drag-over)) .prompt{display:none}:host(:state(drag-over)) .drop{display:inline}:host(:state(error)) .zone{border-color:var(--arq-color-border-error)}:host([disabled]) .zone{border-color:var(--arq-color-border-disabled);cursor:default}:host([disabled]) .label,:host([disabled]) .prompt,:host([disabled]) .file,:host([disabled]) .helper{color:var(--arq-color-text-disabled)}:host([disabled]) .icon{color:var(--arq-color-icon-disabled)}.zone:has(.native:focus-visible){outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}", vr = ".pdf,.dwg,.jpg,.jpeg,.png", yr = 10, br = {
	type: "El formato no está admitido.",
	size: (e) => `El archivo supera los ${e} MB.`
};
function xr(e) {
	let t = [...new Set(e.split(",").map((e) => e.trim().replace(/^\./, "").toUpperCase()).filter(Boolean).map((e) => e === "JPEG" ? "JPG" : e))];
	return t.length > 1 ? `${t.slice(0, -1).join(", ")} o ${t.at(-1)}` : t.join("");
}
(class extends f {
	static tag = "arq-file-upload";
	static styles = _r;
	static formAssociated = !0;
	static properties = {
		accept: {
			type: String,
			default: vr
		},
		maxSize: {
			type: Number,
			default: yr
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
		let t = this.accept.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean), n = `.${e.name.split(".").pop()?.toLowerCase()}`, r = t.length ? ` Formatos: ${xr(this.accept)}.` : "";
		return t.length && !t.includes(n) ? br.type + r : this.maxSize && e.size > this.maxSize * 1024 * 1024 ? br.size(this.maxSize) + r : "";
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
var Sr = ":host{min-width:0;display:block}.header{justify-content:space-between;align-items:flex-end;gap:var(--arq-space-gap-lg);min-width:0;display:flex}.text{gap:var(--arq-space-gap-sm-md);flex-direction:column;min-width:0;display:flex}.title,.description{overflow-wrap:break-word;margin:0}.title{color:var(--arq-color-text-primary)}.description{color:var(--arq-color-text-secondary)}.link{flex:none}:host([type=description]) .text{display:contents}:host([type=description]) .description{flex:0 1 var(--arq-layout-measure);max-width:var(--arq-layout-measure)}:host([type=stacked]) .header{flex-direction:column;justify-content:flex-start;align-items:flex-start}:host([type=stacked]) .text{align-self:stretch}@media (width<=767px){.header{flex-direction:column;justify-content:flex-start;align-items:flex-start}.text{width:100%}:host([type=description]) .text{display:flex}:host([type=description]) .description{flex:none;max-width:none}:host([type=link]) .link,:host(:not([type])) .link{display:none}}", Cr = ["description", "stacked"], wr = ["link", "stacked"];
(class extends f {
	static tag = "arq-section-header";
	static styles = Sr;
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
		e.querySelector(".description").hidden = !Cr.includes(this.type) || !t;
		let n = e.querySelector(".link"), r = wr.includes(this.type) && !!this.href;
		n.hidden = !r, r ? n.setAttribute("href", this.href) : n.removeAttribute("href");
	}
}).define();
//#endregion
//#region src/components/page-header/page-header.css?inline
var Tr = ":host{min-width:0;display:block}.header{align-items:flex-start;gap:var(--arq-space-gap-xl-2xl);padding:var(--arq-space-section-sm) var(--page-gutter) var(--arq-space-section-xs);flex-direction:column;display:flex}.row{justify-content:space-between;align-items:flex-end;gap:var(--arq-space-gap-lg);align-self:stretch;min-width:0;display:flex}.main,.heading{flex-direction:column;min-width:0;display:flex}.heading{gap:var(--arq-space-gap-lg)}.title,.description{overflow-wrap:break-word;margin:0}.title{color:var(--arq-color-text-primary)}.description{color:var(--arq-color-text-secondary)}.action{flex:none}:host(:not([type=detail])) .main{display:contents}:host(:not([type=detail])) .description{flex:0 1 var(--arq-layout-measure);max-width:var(--arq-layout-measure)}:host([type=detail]) .header{padding-block:var(--arq-space-section-xs) var(--arq-space-section-sm)}:host([type=detail]) .main{gap:var(--arq-space-gap-md)}:host([type=detail]) .description{max-width:var(--arq-layout-measure-wide)}@media (width<=767px){.row{align-items:stretch;gap:var(--arq-space-gap-lg);flex-direction:column}:host(:not([type=detail])) .main{gap:var(--arq-space-gap-lg);display:flex}:host(:not([type=detail])) .description,:host([type=detail]) .main{flex:none;max-width:none}:host([type=detail]) .row{gap:var(--arq-space-gap-xl-2xl)}.action ::slotted(*){width:100%}}";
(class extends f {
	static tag = "arq-page-header";
	static styles = Tr;
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
var Er = ":host{min-width:0;display:block}.item{border-top:var(--arq-border-default) solid var(--arq-color-border-default)}.trigger{box-sizing:border-box;align-items:center;gap:var(--arq-space-gap-lg);width:100%;padding:var(--arq-space-padding-lg) 0;background:var(--arq-color-surface-transparent);color:var(--arq-color-text-primary);font:inherit;text-align:start;cursor:pointer;-webkit-tap-highlight-color:var(--arq-color-surface-transparent);border:0;margin:0;display:flex}:host([open]) .trigger{padding-bottom:var(--arq-space-gap-sm-md)}.question{overflow-wrap:break-word;flex:1 1 0;min-width:0}.icon{width:var(--arq-icon-md);height:var(--arq-icon-md);color:var(--arq-color-icon-primary);flex:none}:host(:not([open])) [data-icon=minus],:host([open]) [data-icon=plus]{display:none}.answer{max-width:var(--arq-layout-measure-wide);padding-bottom:var(--arq-space-padding-lg);color:var(--arq-color-text-secondary);overflow-wrap:break-word}::slotted(a){color:var(--arq-color-text-primary);text-decoration:underline}@media (hover:hover){:host(:not([open])) .trigger:hover{background:var(--arq-color-surface-faint)}}.item:has(.trigger:focus-visible){outline:var(--arq-border-strong) solid var(--arq-color-border-focus);outline-offset:2px}.trigger:focus{outline:none}@media (width<=767px){.answer{max-width:none}}";
(class extends f {
	static tag = "arq-faq-item";
	static styles = Er;
	static properties = { open: { type: Boolean } };
	static template = `<div class="item"><button type="button" class="trigger"><span class="question role-body-lg-regular"><slot name="question"></slot></span>${p("plus")}${p("minus")}</button><div class="answer role-body" part="panel"><slot></slot></div></div>`;
	setup() {
		this.disclosure = new h(this, {
			trigger: this.shadowRoot.querySelector(".trigger"),
			panel: this.shadowRoot.querySelector(".answer")
		});
	}
}).define();
//#endregion
//#region src/components/footer/footer.css?inline
var Dr = ":host{display:block}.footer{column-gap:var(--arq-space-gap-xl);row-gap:var(--arq-space-gap-md);padding:var(--arq-space-section-sm) var(--page-gutter);border-top:var(--arq-border-default) solid var(--arq-color-border-subtle);background:var(--arq-color-surface-default);grid-template:\"brand columns\"\"legal columns\"1fr/minmax(0,1fr) auto;display:grid}.brand{align-items:flex-start;gap:var(--arq-space-gap-md);flex-direction:column;grid-area:brand;min-width:0;display:flex}.tagline{color:var(--arq-color-text-secondary);overflow-wrap:break-word;margin:0}.legal{color:var(--arq-color-text-tertiary);text-transform:uppercase;grid-area:legal;align-self:start;margin:0}.columns{align-items:flex-start;gap:var(--arq-space-gap-xl);grid-area:columns;display:flex}.column{align-items:flex-start;gap:var(--arq-space-gap-sm);flex-direction:column;min-width:0;display:flex}.title{padding-bottom:var(--arq-space-gap-sm);color:var(--arq-color-text-primary);margin:0}.list{align-items:flex-start;gap:var(--arq-space-gap-sm);flex-direction:column;max-width:100%;display:flex}@media (width<=767px){.footer{row-gap:var(--arq-space-gap-xl);grid-template-rows:none;grid-template-columns:minmax(0,1fr);grid-template-areas:\"brand\"\"columns\"\"legal\"}.column{flex:1 1 0}}", Or = [
	"productos",
	"informacion",
	"redes"
];
(class extends f {
	static tag = "arq-footer";
	static styles = Dr;
	static template = "<footer class=\"footer\"><div class=\"brand\"><arq-logo size=\"compact\"></arq-logo><p class=\"tagline role-body\"><slot name=\"tagline\"></slot></p></div><div class=\"columns\">" + Or.map((e) => `<nav class="column" data-column="${e}"><div class="title role-body-strong"><slot name="${e}-title"></slot></div><div class="list" role="list"><slot name="${e}"></slot></div></nav>`).join("") + "</div><p class=\"legal role-body-sm\">© <span class=\"year\"></span> Macroled Arq.</p></footer>";
	setup() {
		let e = this.shadowRoot;
		e.querySelector(".year").textContent = String((/* @__PURE__ */ new Date()).getFullYear());
		let t = e.querySelector("slot[name=\"tagline\"]"), n = () => {
			e.querySelector(".tagline").hidden = !t.assignedNodes({ flatten: !0 }).some((e) => e.textContent.trim());
		};
		t.addEventListener("slotchange", n), n();
		for (let t of Or) {
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
var kr = ":host{display:block}.hero{background:var(--arq-color-surface-inverse);flex-direction:column;justify-content:flex-end;height:70svh;display:flex;position:relative;overflow:hidden}.media{position:absolute;inset:0}::slotted([slot=media]){object-fit:cover;width:100%!important;max-width:none!important;height:100%!important;display:block!important}.scrim{background:linear-gradient(#00000085 0%,#0003 18% 45%,#000000ad 100%);position:absolute;inset:0}.content{justify-content:space-between;align-items:flex-end;gap:var(--arq-space-gap-xl);padding:0 var(--page-gutter) var(--arq-space-section-sm);color:var(--arq-color-text-inverse);display:flex;position:relative}.text{align-items:flex-start;gap:var(--arq-space-gap-lg);flex-direction:column;min-width:0;display:flex}.eyebrow,.title,.description{overflow-wrap:break-word;margin:0}.action{flex:none}@media (width<=767px){.content{justify-content:flex-start;align-items:flex-start;gap:var(--arq-space-gap-lg);flex-direction:column}}:host([full-height]) .hero{height:100svh}", Ar = [
	"eyebrow",
	"description",
	"action"
];
(class extends f {
	static tag = "arq-hero";
	static styles = kr;
	static properties = { fullHeight: { type: Boolean } };
	static template = "<div class=\"hero\"><div class=\"media\"><slot name=\"media\"></slot></div><div class=\"scrim\" aria-hidden=\"true\"></div><div class=\"content\"><div class=\"text\"><p class=\"eyebrow role-label\" hidden><slot name=\"eyebrow\"></slot></p><div class=\"title role-display\"><slot name=\"title\"></slot></div><p class=\"description role-body-lg\" hidden><slot name=\"description\"></slot></p></div><div class=\"action\" data-arq-theme=\"dark\" hidden><slot name=\"action\"></slot></div></div></div>";
	#e = window.matchMedia("(prefers-reduced-motion: reduce)");
	setup() {
		for (let e of this.shadowRoot.querySelectorAll("slot[name]")) e.addEventListener("slotchange", () => this.update());
		this.#e.addEventListener("change", () => this.#n());
	}
	update() {
		let e = this.shadowRoot, t = (t) => e.querySelector(`slot[name="${t}"]`).assignedNodes({ flatten: !0 }).some((e) => e.nodeType === Node.ELEMENT_NODE || e.textContent.trim());
		for (let n of Ar) e.querySelector(`.${n}`).hidden = !t(n);
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
var jr = ":host{min-width:0;display:block}.block{justify-content:space-between;align-items:center;gap:var(--arq-space-gap-xl);padding:var(--arq-space-section-md) var(--page-gutter);background:var(--arq-color-bg-subtle);display:flex}.text{gap:var(--arq-space-gap-sm-md);flex-direction:column;min-width:0;display:flex}.title{color:var(--arq-color-text-primary);overflow-wrap:break-word}.description{max-width:var(--arq-layout-measure-wide);color:var(--arq-color-text-secondary);overflow-wrap:break-word;margin:0}.action{align-items:center;gap:var(--arq-space-gap-md);flex:none;display:flex}.email{width:var(--arq-layout-measure)}::slotted(arq-input){width:100%;display:block}@media (width<=767px){.block{flex-direction:column;align-items:stretch}.description{max-width:none}.action{align-items:stretch;gap:var(--arq-space-gap-xl);flex-direction:column}.email{width:auto}::slotted(arq-button){width:100%}}";
(class extends f {
	static tag = "arq-cta-block";
	static styles = jr;
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
var Mr = ":host{display:inline-flex}.controls{align-items:center;gap:var(--arq-space-gap-sm);display:flex}@media (width<=767px){:host{display:none}}", Nr = [
	"start",
	"middle",
	"end"
];
(class extends f {
	static tag = "arq-carousel-controls";
	static styles = Mr;
	static properties = {
		position: {
			type: String,
			values: Nr,
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
	#r = () => this.#d();
	#i = new ResizeObserver(() => this.#d());
	#a = new MutationObserver(() => this.#u());
	#o = window.matchMedia("(prefers-reduced-motion: reduce)");
	setup() {
		let e = this.shadowRoot;
		e.querySelector(".prev").addEventListener("click", () => this.#f(-1)), e.querySelector(".next").addEventListener("click", () => this.#f(1));
	}
	connectedCallback() {
		super.connectedCallback(), this.#e && !this.#t && this.#c(this.#e);
	}
	disconnectedCallback() {
		this.#l();
	}
	update(e) {
		let t = this.shadowRoot, n = t.querySelector(".prev"), r = t.querySelector(".next");
		e.has("labelPrev") && (n.textContent = this.labelPrev), e.has("labelNext") && (r.textContent = this.labelNext), t.querySelector(".controls").setAttribute("aria-label", `${this.labelPrev} / ${this.labelNext}`), e.has("for") && this.#s();
		let i = t.activeElement;
		n.disabled = this.position === "start", r.disabled = this.position === "end" || !this.#n, i === n && n.disabled && r.focus(), i === r && r.disabled && n.focus();
	}
	#s() {
		this.#l();
		let e = this.for ? this.getRootNode().getElementById?.(this.for) : null;
		this.for && !e && document.readyState === "loading" && document.addEventListener("DOMContentLoaded", () => this.#s(), { once: !0 }), this.#e = e, e && this.#c(e);
	}
	#c(e) {
		this.#t = !0, e.addEventListener("scroll", this.#r, { passive: !0 }), this.#i.observe(e), this.#a.observe(e, { childList: !0 }), this.#u(), customElements.whenDefined("arq-icon-button").then(() => {
			for (let t of this.shadowRoot.querySelectorAll("arq-icon-button")) {
				let n = t.shadowRoot?.querySelector("button");
				n && "ariaControlsElements" in n && (n.ariaControlsElements = [e]);
			}
		}), this.#d();
	}
	#l() {
		this.#e && this.#t && (this.#t = !1, this.#e.removeEventListener("scroll", this.#r), this.#a.disconnect(), this.#i.disconnect());
	}
	#u() {
		for (let e of this.#e?.children ?? []) this.#i.observe(e);
		this.#d();
	}
	#d() {
		let e = this.#e;
		if (!e) return;
		let t = e.scrollWidth - e.clientWidth, n = t <= 1 || e.scrollLeft <= 1 ? "start" : e.scrollLeft >= t - 1 ? "end" : "middle", r = t > 1;
		r !== this.#n && (this.#n = r, this.shadowRoot.querySelector(".next").disabled = !r || n === "end"), n !== this.position && (this.position = n);
	}
	#f(e) {
		let t = this.#e;
		if (!t) {
			this.emit(e < 0 ? "prev" : "next");
			return;
		}
		t.scrollBy({
			left: e * t.clientWidth,
			behavior: this.#o.matches ? "auto" : "smooth"
		});
	}
}).define();
//#endregion
//#region src/components/category-card/category-card.css?inline
var Pr = ":host{min-width:0;display:block}.card{gap:var(--arq-space-gap-lg);flex-direction:column;display:flex}.card-media{aspect-ratio:4/5}.caption{justify-content:space-between;align-items:center;gap:var(--arq-space-gap-md);display:flex}.name{min-width:0;color:var(--arq-color-text-primary);overflow-wrap:break-word}.icon{width:var(--arq-icon-md);height:var(--arq-icon-md);color:var(--arq-color-icon-primary);flex:none}@media (width>=768px){.card-media{max-height:max(50svh, 100svh - var(--arq-space-section-xl) * 2)}}@media (width<=767px){.card{gap:var(--arq-space-gap-md)}}";
(class extends f {
	static tag = "arq-category-card";
	static styles = C + Pr;
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
var Fr = ":host{min-width:0;display:block}.card{gap:var(--arq-space-gap-lg);flex-direction:column;display:flex}.card-media{aspect-ratio:5/4}.content{align-items:flex-start;gap:var(--arq-space-gap-md);padding-top:var(--arq-space-padding-sm);flex-direction:column;display:flex}.label,.description{margin:0}.label{color:var(--arq-color-text-tertiary)}.name{max-width:100%;color:var(--arq-color-text-primary);overflow-wrap:break-word}.description{max-width:var(--arq-layout-measure);color:var(--arq-color-text-secondary);overflow-wrap:break-word}.cta{margin-top:calc(var(--arq-space-gap-sm) + var(--arq-space-gap-md))}@media (width>=768px){.card-media{max-height:max(50svh, 100svh - var(--arq-space-section-xl) * 2 - var(--arq-space-gap-6xl))}}@media (width<=767px){.card-media{aspect-ratio:1}.content{gap:var(--arq-space-gap-sm-md);padding-top:0}.description{max-width:none}.cta{margin-top:calc(var(--arq-space-gap-xs) + var(--arq-space-gap-sm-md))}}", Ir = ["label", "description"];
(class extends f {
	static tag = "arq-line-card";
	static styles = C + Fr;
	static properties = { href: { type: String } };
	static template = "<div class=\"card\"><div class=\"card-media\"><slot name=\"image\"></slot></div><div class=\"content\"><p class=\"label role-label\" hidden><slot name=\"label\"></slot></p><div class=\"name role-heading-1\"><slot name=\"name\"></slot></div><p class=\"description role-body-lg\" hidden><slot name=\"description\"></slot></p><arq-button class=\"cta\" type=\"underline\" show-underline show-icon icon=\"arrow-right\"><slot name=\"action\">Ver colección</slot></arq-button></div></div>";
	setup() {
		for (let e of Ir) this.shadowRoot.querySelector(`slot[name="${e}"]`).addEventListener("slotchange", () => this.update(/* @__PURE__ */ new Set()));
	}
	update(e) {
		let t = this.shadowRoot;
		for (let e of Ir) t.querySelector(`.${e}`).hidden = !t.querySelector(`slot[name="${e}"]`).assignedNodes({ flatten: !0 }).some((e) => e.nodeType === Node.ELEMENT_NODE || e.textContent.trim());
		if (e.has("href")) {
			let e = t.querySelector(".cta");
			this.href ? e.setAttribute("href", this.href) : e.removeAttribute("href");
		}
	}
}).define();
//#endregion
//#region src/components/feature-block/feature-block.css?inline
var Lr = ":host{min-width:0;display:block}.block{column-gap:var(--arq-space-gap-6xl);grid-template:\"image content\"\"image secondary\"1fr/50% minmax(0,1fr);align-items:start;display:grid}:host([layout=image-right]) .block{grid-template-columns:minmax(0,1fr) 50%;grid-template-areas:\"content image\"\"secondary image\"}.block:has(.secondary[hidden]){grid-template-areas:\"image content\"\"image content\"}:host([layout=image-right]) .block:has(.secondary[hidden]){grid-template-areas:\"content image\"\"content image\"}.media{background:var(--arq-color-bg-subtle);overflow:hidden}.image{aspect-ratio:4/5;grid-area:image}.secondary{aspect-ratio:16/10;margin-top:calc(var(--arq-space-gap-xl) * 2 + var(--arq-space-gap-lg));grid-area:secondary}.media ::slotted(*){object-fit:cover;width:100%!important;max-width:none!important;height:100%!important;display:block!important}.content{align-items:flex-start;gap:var(--arq-space-gap-xl);padding-top:var(--arq-space-padding-xl-2xl);flex-direction:column;grid-area:content;display:flex}:host([layout=image-right]) .content{padding-top:var(--arq-space-padding-6xl)}.label,.description{margin:0}.label{color:var(--arq-color-text-tertiary)}.title{max-width:100%;color:var(--arq-color-text-primary);overflow-wrap:break-word}.description{max-width:var(--arq-layout-measure);color:var(--arq-color-text-secondary);overflow-wrap:break-word}@media (width>=768px){.image{width:100%;max-height:max(50svh, 100svh - var(--arq-space-section-xl))}}@media (width<=767px){.block,:host([layout=image-right]) .block{row-gap:var(--arq-space-gap-lg);grid-template-rows:none;grid-template-columns:minmax(0,1fr);grid-template-areas:\"image\"\"content\"\"secondary\"}.block:has(.secondary[hidden]){row-gap:var(--arq-space-gap-lg);grid-template-rows:none;grid-template-columns:minmax(0,1fr);grid-template-areas:\"image\"\"content\"\"secondary\"}:host([layout=image-right]) .block:has(.secondary[hidden]){row-gap:var(--arq-space-gap-lg);grid-template-rows:none;grid-template-columns:minmax(0,1fr);grid-template-areas:\"image\"\"content\"\"secondary\"}.content,:host([layout=image-right]) .content{gap:var(--arq-space-gap-md);padding-top:var(--arq-space-padding-sm)}.secondary{margin-top:0}.description{max-width:none}}", Rr = [
	"label",
	"description",
	"action",
	"secondary"
];
(class extends f {
	static tag = "arq-feature-block";
	static styles = Lr;
	static properties = { layout: {
		type: String,
		values: ["image-left", "image-right"],
		default: "image-left"
	} };
	static template = "<div class=\"block\"><div class=\"media image\"><slot name=\"image\"></slot></div><div class=\"content\"><p class=\"label role-label\" hidden><slot name=\"label\"></slot></p><div class=\"title role-display-sm\"><slot name=\"title\"></slot></div><p class=\"description role-body-lg\" hidden><slot name=\"description\"></slot></p><div class=\"action\" hidden><slot name=\"action\"></slot></div></div><div class=\"media secondary\" hidden><slot name=\"secondary\"></slot></div></div>";
	setup() {
		for (let e of Rr) this.shadowRoot.querySelector(`slot[name="${e}"]`).addEventListener("slotchange", () => this.update());
	}
	update() {
		let e = this.shadowRoot;
		for (let t of Rr) e.querySelector(`.${t}`).hidden = !e.querySelector(`slot[name="${t}"]`).assignedNodes({ flatten: !0 }).some((e) => e.nodeType === Node.ELEMENT_NODE || e.textContent.trim());
	}
}).define();
//#endregion
//#region src/components/section/section.css?inline
var zr = ":host{--section-gap:var(--arq-space-gap-2xl);box-sizing:border-box;min-width:0;padding:0 var(--page-gutter) var(--arq-space-section-xl);background:var(--arq-color-bg-default);display:block}:host([padding-top]){padding-top:var(--arq-space-section-xl)}.section{gap:var(--section-gap);flex-direction:column;min-width:0;display:flex}.head,.body{min-width:0}.action,.mobile-action{align-self:flex-start}@media (width>=768px){.mobile-action{display:none}:host([layout=split]) .section{grid-template-columns:var(--arq-layout-measure) minmax(0, 1fr);column-gap:var(--arq-space-section-md);row-gap:var(--arq-space-gap-lg);grid-template-rows:auto 1fr;grid-template-areas:\"head body\"\"action body\";align-items:start;display:grid}:host([layout=split]) .head{grid-area:head}:host([layout=split]) .body{grid-area:body}:host([layout=split]) .action{grid-area:action}}@media (width<=767px){:host{--section-gap:var(--arq-space-gap-xl)}}", Br = [
	"header",
	"action",
	"mobile-action"
];
(class extends f {
	static tag = "arq-section";
	static styles = zr;
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
		for (let e of Br) {
			let t = this.shadowRoot.querySelector(`slot[name="${e}"]`), n = () => t.parentElement.hidden = t.assignedElements({ flatten: !0 }).length === 0;
			t.addEventListener("slotchange", n), n();
		}
	}
}).define();
//#endregion
//#region src/components/grid/grid.css?inline
var Vr = ":host{min-width:0;display:block}.grid{--card-min:var(--arq-layout-card-min);grid-template-columns:repeat(var(--columns,1), minmax(0, 1fr));gap:var(--arq-space-gap-lg);align-items:start;display:grid}.grid.auto{grid-template-columns:repeat(auto-fill, minmax(var(--card-min), 1fr));gap:var(--arq-space-gap-2xl) var(--arq-space-gap-lg)}@media (width>=1600px){.grid.auto{--card-min:var(--arq-layout-card-min-wide)}}::slotted(*){min-width:0}@media (width<=767px){.grid.auto{gap:var(--arq-space-gap-xl) var(--arq-space-gap-md)}.grid:not(.auto){gap:var(--arq-space-section-md);grid-template-columns:minmax(0,1fr)}:host([mobile=two-columns]) .grid{gap:var(--arq-space-gap-sm-md);grid-template-columns:repeat(2,minmax(0,1fr))}:host([mobile=carousel]){overscroll-behavior-x:contain;scroll-snap-type:x mandatory;scrollbar-width:none;margin-block:calc(var(--arq-space-gap-xs) * -1);margin-inline:calc(var(--arq-space-gap-xs) * -1) calc(var(--arq-layout-gutter) * -1);padding-block:var(--arq-space-gap-xs);padding-inline-start:var(--arq-space-gap-xs);scroll-padding-inline-start:var(--arq-space-gap-xs);overflow-x:auto;container-type:inline-size}:host([mobile=carousel])::-webkit-scrollbar{display:none}:host([mobile=carousel]) .grid{gap:var(--arq-space-gap-sm-md);width:max-content;padding-inline-end:var(--arq-layout-gutter);display:flex}:host([mobile=carousel]) ::slotted(*){width:calc((100cqi - var(--arq-layout-gutter)) * .8);scroll-snap-align:start;flex:none}}";
(class extends f {
	static tag = "arq-grid";
	static styles = Vr;
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
var Hr = ":host{min-width:0;display:block}.mosaic{gap:var(--arq-space-gap-lg);grid-template-rows:1fr 1fr;grid-template-columns:repeat(4,minmax(0,1fr));display:grid}::slotted(img){background:var(--arq-color-bg-subtle);min-width:0;box-sizing:border-box!important;object-fit:cover!important;width:100%!important;max-width:none!important;height:100%!important;display:block!important}::slotted(img:first-child){contain:size;grid-area:1/1/span 2/span 2}::slotted(img:nth-child(2)){contain:size;grid-area:1/3/auto/span 2}::slotted(img:nth-child(3)),::slotted(img:nth-child(4)){aspect-ratio:1;grid-row:2;height:auto!important;max-height:calc((max(50svh, 100svh - var(--arq-space-section-xl) * 2) - var(--arq-space-gap-lg)) / 2)!important}::slotted(img:nth-child(n+5)){display:none!important}@media (width<=767px){.mosaic{gap:var(--arq-space-gap-sm-md);grid-template-rows:none;grid-template-columns:repeat(2,minmax(0,1fr))}::slotted(img){aspect-ratio:4/5;contain:none;height:auto!important}::slotted(img:first-child){contain:none;grid-area:auto/1/auto/-1}::slotted(img:nth-child(2)),::slotted(img:nth-child(3)){aspect-ratio:4/5;contain:none;grid-area:auto;max-height:none!important}::slotted(img:nth-child(4)){display:none!important}}";
(class extends f {
	static tag = "arq-project-mosaic";
	static styles = Hr;
	static template = "<div class=\"mosaic\"><slot></slot></div>";
}).define();
//#endregion
//#region src/components/featured-products/featured-products.css?inline
var Ur = ":host{min-width:0;display:block}.fallback{align-items:flex-start;gap:var(--arq-space-gap-sm);color:var(--arq-color-text-primary);flex-direction:column;display:flex}";
(class extends f {
	static tag = "arq-featured-products";
	static styles = Ur;
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
			r = e.length ? await xn(e) : [];
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
var Wr = ":host{box-sizing:border-box;min-width:0;padding:0 var(--page-gutter) var(--arq-space-section-xl);background:var(--arq-color-bg-default);display:block}.layout{gap:var(--arq-space-gap-xl);flex-direction:column;min-width:0;display:flex}.nav{min-width:0}.content{gap:var(--arq-space-gap-xl-2xl);flex-direction:column;min-width:0;display:flex}.status{color:var(--arq-color-text-secondary);margin:0}.status:empty{display:none}@media (width>=1024px){.layout{grid-template-columns:var(--arq-layout-card-min) minmax(0, 1fr);column-gap:var(--arq-space-section-sm);display:grid}.toolbar{z-index:3;background:var(--arq-color-bg-default);position:sticky;top:0}.nav{align-self:start;position:sticky;top:0}.toolbar.nav-visible,.nav.nav-visible{top:calc(var(--arq-space-gap-md) * 2 + var(--arq-icon-xl))}}@media (width<=767px){:host(:not([unit=colecciones])) .nav{display:none}.content{gap:var(--arq-space-gap-xl)}}", Gr = {
	environment: "environment",
	application: "application",
	product_type: "productType"
}, Kr = matchMedia("(min-width: 1024px)"), qr = matchMedia("(min-width: 1920px)"), Jr = {
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
}, Yr = class extends f {
	static tag = "arq-catalog-listing";
	static styles = Wr;
	static properties = { unit: {
		type: String,
		values: ["productos", "colecciones"],
		default: "productos"
	} };
	static template = "<div class=\"layout\"><div class=\"nav\"><slot name=\"nav\"></slot></div><div class=\"content\"><arq-catalog-toolbar class=\"toolbar\" for=\"filters\" show-iluminar></arq-catalog-toolbar><p class=\"status role-body\" role=\"status\"></p><arq-grid class=\"grid\"></arq-grid></div></div><arq-filter-panel id=\"filters\"><slot name=\"filter-title\" slot=\"title\"></slot></arq-filter-panel><arq-compare-bar class=\"compare\"></arq-compare-bar><div class=\"compare-space\" aria-hidden=\"true\"></div>";
	#e = {};
	#t = "";
	#n = {};
	#r = /* @__PURE__ */ new Map();
	#i = 0;
	#a = 0;
	setup() {
		new URLSearchParams(location.search).get("view") === "colecciones" && (this.unit = "colecciones");
		let e = this.shadowRoot;
		this.#e = Xr(), this.#t = new URLSearchParams(location.search).get("q")?.trim() ?? "", this.#c(), window.addEventListener("scroll", this.#s, { passive: !0 }), e.querySelector("slot[name=\"nav\"]").addEventListener("slotchange", () => this.#_());
		let t = e.querySelector("arq-filter-panel");
		t.addEventListener("arq:filters", (e) => this.#d(e.detail.filters)), t.addEventListener("arq:apply", (e) => {
			this.#n = e.detail.filters, this.#l();
		});
		let n = e.querySelector(".grid"), r = () => {
			n.columns = Kr.matches ? qr.matches ? 4 : 3 : null;
		};
		Kr.addEventListener("change", r), qr.addEventListener("change", r), r();
		let i = e.querySelector(".compare");
		n.addEventListener("arq:compare", (e) => {
			let t = e.target, n = this.#r.get(t);
			n && (e.detail.checked ? i.add({
				sku: n.sku,
				name: n.name,
				meta: n.meta,
				image: n.image
			}) || (t.compared = !1) : i.remove(n.sku));
		}), i.addEventListener("arq:compare-change", () => {
			this.#h(), requestAnimationFrame(() => this.#o());
		}), new ResizeObserver(() => this.#o()).observe(i), requestAnimationFrame(() => this.#o());
	}
	#o() {
		let e = this.shadowRoot.querySelector(".compare"), t = e.shadowRoot?.querySelector(".bar"), n = !e.hidden && t && !t.hidden ? t.getBoundingClientRect().height : 0;
		this.shadowRoot.querySelector(".compare-space").style.height = n ? `${n}px` : "";
	}
	#s = () => this.#c();
	#c() {
		let e = window.scrollY, t = e > 0, n = e > this.#a ? "down" : "up";
		this.#a = e;
		let r = document.documentElement;
		t ? r.setAttribute("data-arq-catalog-scroll", n) : r.removeAttribute("data-arq-catalog-scroll");
		let i = this.shadowRoot?.querySelector(".toolbar");
		i && (i.state = t ? "scroll" : "default"), document.querySelector("arq-navbar")?.toggleAttribute("data-arq-catalog-hidden", t && n === "down"), this.shadowRoot?.querySelector(".toolbar")?.classList.toggle("nav-visible", t && n === "up"), this.shadowRoot?.querySelector(".nav")?.classList.toggle("nav-visible", t && n === "up");
	}
	update(e) {
		if (!e.has("unit")) return;
		let t = this.shadowRoot;
		t.querySelector(".toolbar").unit = this.unit, t.querySelector("arq-filter-panel").unit = this.unit, t.querySelector("arq-filter-panel").showCategories = this.unit === "productos", t.querySelector(".compare").hidden = this.unit !== "productos", this.#t && this.unit === "productos" && this.#y(), this.#l({ rows: !0 });
	}
	async #l({ rows: e = !1 } = {}) {
		let t = ++this.#i, n = Jr[this.unit] ?? Jr.productos;
		this.setAttribute("aria-busy", "true"), e && this.#f(n.loading);
		let r = null;
		try {
			r = await this.#u(this.#n);
		} catch (e) {
			console.error("[arq] catalog-listing: no se pudo cargar el catálogo", e);
		}
		if (t !== this.#i) return;
		this.removeAttribute("aria-busy");
		let i = this.shadowRoot.querySelector(".toolbar");
		if (!r) {
			i.count = null, this.#p([]), this.#f(n.error);
			return;
		}
		e && this.#g(r.filters), i.count = r.count, this.#p(r.cards), this.#f(r.count ? "" : this.#t && this.unit === "productos" ? `No hay productos para «${this.#t}».` : n.empty);
	}
	#u(e) {
		return this.unit === "colecciones" ? gn({ filters: e }) : hn({
			...this.#e,
			query: this.#t,
			filters: e
		});
	}
	async #d(e) {
		let t = this.shadowRoot.querySelector("arq-filter-panel");
		try {
			t.count = (await this.#u(e)).count;
		} catch {
			t.count = null;
		}
	}
	#f(e) {
		let t = this.shadowRoot.querySelector(".status");
		t.textContent = e, t.hidden = !e;
	}
	#p(e) {
		let t = this.unit === "productos";
		this.#r = new Map(e.map((e) => [this.#m(e, t), e])), this.shadowRoot.querySelector(".grid").replaceChildren(...this.#r.keys()), t && this.#h();
	}
	#m(e, t) {
		let n = document.createElement("arq-product-card");
		n.href = e.href, n.image = e.image, n.imageHover = e.imageHover, n.imageLit = e.imageLit, n.imageHoverLit = e.imageHoverLit, n.showCompare = t;
		let r = document.createElement("h2");
		r.slot = "name", r.textContent = e.name, n.append(r);
		for (let t of e.finishes ?? []) {
			let e = document.createElement("arq-swatch");
			e.slot = "finishes", e.textContent = t, n.append(e);
		}
		if (!t && e.meta) {
			let t = document.createElement("span");
			t.slot = "meta", t.textContent = e.meta, n.append(t);
		}
		return n;
	}
	#h() {
		let e = this.shadowRoot.querySelector(".compare");
		for (let [t, n] of this.#r) t.compared = e.has(n.sku);
	}
	#g(e) {
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
		this.#d({});
	}
	#_() {
		let e = this.shadowRoot.querySelector("slot[name=\"nav\"]").assignedElements()[0];
		if (!e) return;
		let t = location.pathname + location.search, n = null;
		for (let r of e.querySelectorAll("arq-catalog-nav-item")) {
			let e = r.getAttribute("href");
			r.selected = !!e && Zr(e, t), r.selected && (n ??= r);
		}
		this.#b(n), this.#v(e, n);
		let r = document.querySelector("arq-page-header");
		r && (r.showDescription = this.unit !== "colecciones");
	}
	#v(e, t) {
		let n = this.shadowRoot.querySelector("arq-filter-panel"), r = n.querySelector("[slot=\"categories\"]") ?? document.createElement("nav");
		r.slot = "categories", r.setAttribute("aria-label", "Categorías de productos");
		let i = t?.closest("arq-catalog-nav-group"), a = [...e.querySelectorAll(":scope > arq-catalog-nav-group")].map((e) => {
			let t = e.cloneNode(!0);
			return t.open = e === i, t;
		});
		r.replaceChildren(...a), r.isConnected || n.append(r);
	}
	#y() {
		let e = document.querySelector("arq-page-header > [slot=\"title\"]");
		e && (e.textContent = `Resultados para «${this.#t}»`);
	}
	#b(e) {
		let t = e?.closest("arq-catalog-nav-group"), n = t?.querySelector(":scope > arq-catalog-nav-item"), r = e && e !== n ? e.textContent.trim() : t?.querySelector("[slot=\"label\"]")?.textContent.trim(), i = document.querySelector("arq-page-header > [slot=\"title\"]");
		r && i && (i.textContent = r);
	}
};
function Xr() {
	let e = new URLSearchParams(location.search), t = {};
	for (let [n, r] of Object.entries(Gr)) {
		let i = e.get(n);
		i && (t[r] = i);
	}
	return t;
}
function Zr(e, t) {
	let n = new URL(e, location.href), r = (e) => [...new URLSearchParams(e)].sort().join("&"), i = new URL(t, location.href);
	return n.pathname.replace(/\/$/, "") === i.pathname.replace(/\/$/, "") && r(n.search) === r(i.search);
}
Yr.define();
//#endregion
//#region src/components/ficha-producto/ficha-producto.css?inline
var Qr = ":host{min-width:0;color:var(--arq-color-text-primary);display:block}.page:not([data-ready]) .needs-data{display:none}.hero{padding:0 var(--page-gutter) var(--arq-space-section-xl);background:var(--arq-color-bg-default);color:var(--arq-color-text-primary);flex-direction:column;display:flex}.hero[data-arq-theme=dark]{padding-bottom:var(--arq-space-section-lg)}.hero[data-arq-theme=dark]+.details{padding-top:var(--arq-space-section-md)}.header{align-items:flex-start;gap:var(--arq-space-gap-xl);padding:var(--arq-space-padding-xl) 0 var(--arq-space-padding-xl-2xl);flex-direction:column;min-width:0;display:flex}.title-row{align-items:last baseline;gap:var(--arq-space-gap-md);flex-wrap:wrap;min-width:0;display:flex}.title{overflow-wrap:break-word;min-width:0}.configurator{grid-template-columns:minmax(0, 3fr) minmax(var(--arq-layout-measure), 2fr);column-gap:var(--arq-space-gap-5xl);align-items:stretch;display:grid}.gallery-column{align-items:flex-start;gap:var(--arq-space-gap-sm-md);flex-direction:column;min-width:0;display:flex}.gallery{align-self:stretch}.configurator-column{justify-content:space-between;gap:var(--arq-space-gap-4xl);flex-direction:column;min-width:0;display:flex}.info{gap:var(--arq-space-gap-xl);flex-direction:column;min-width:0;display:flex}.status{color:var(--arq-color-text-secondary);margin:0}.product{align-items:flex-start;gap:var(--arq-space-gap-lg);flex-direction:column;min-width:0;display:flex}.description{max-width:100%;color:var(--arq-color-text-primary);overflow-wrap:break-word}::slotted([slot=description]){font:inherit!important;color:inherit!important;margin:0!important}.options{gap:var(--arq-space-gap-xl-2xl);flex-direction:column;display:flex}.actions{gap:var(--arq-space-gap-md);display:flex}.actions arq-button{flex:auto}.details{grid-template-columns:var(--arq-layout-measure) minmax(0, 1fr);gap:var(--arq-space-gap-3xl);padding:0 var(--page-gutter) var(--arq-space-section-xl);align-items:start;display:grid}.downloads{gap:var(--arq-space-gap-2xl);flex-direction:column;min-width:0;display:flex}.download-buttons{gap:var(--arq-space-gap-sm);flex-wrap:wrap;display:flex}.accordion{flex-direction:column;min-width:0;display:flex}.accordion arq-accordion-item[open]+arq-accordion-item,.accordion arq-accordion-item+arq-accordion-item[open]{margin-top:var(--arq-space-gap-sm)}.ambient{gap:var(--arq-space-gap-md);margin-bottom:var(--arq-space-section-xl);padding-left:var(--page-gutter);overscroll-behavior-x:contain;scroll-snap-type:x proximity;scrollbar-width:none;scroll-padding-inline-start:var(--page-gutter);display:flex;overflow-x:auto}.ambient::-webkit-scrollbar{display:none}.ambient img{aspect-ratio:auto 4/5;object-fit:cover;scroll-snap-align:start;background:var(--arq-color-surface-subtle);flex:none;width:auto;max-width:none;height:70svh;display:block}.story-block{gap:var(--arq-space-gap-2xl);padding:0 var(--page-gutter) var(--arq-space-section-xl);flex-direction:column;display:flex}.story{gap:var(--arq-space-gap-lg);color:var(--arq-color-text-primary);flex-direction:column;display:flex}.story-text{gap:var(--arq-space-gap-lg);flex-direction:column;display:flex}::slotted(h2[slot=story-text]),::slotted(h3[slot=story-text]){font-family:var(--arq-font-family-sans)!important;font-weight:var(--arq-font-weight-light)!important;font-size:var(--arq-type-heading-2-size)!important;line-height:var(--arq-type-heading-2-leading)!important;letter-spacing:var(--arq-font-tracking-normal)!important}::slotted(p[slot=story-text]){max-width:var(--arq-layout-measure-wide);font-family:var(--arq-font-family-sans)!important;font-weight:var(--arq-font-weight-light)!important;font-size:var(--arq-type-body-size)!important;line-height:var(--arq-type-body-leading)!important;letter-spacing:var(--arq-font-tracking-normal)!important;color:inherit!important;margin:0!important}.features{gap:var(--arq-space-gap-sm);max-width:var(--arq-layout-measure-wide);flex-direction:column;display:flex}.features-label{margin:0}::slotted(ul){padding:0 0 0 var(--arq-space-padding-lg)!important;font:inherit!important;color:inherit!important;margin:0!important;list-style:outside!important}.family-row{gap:var(--arq-space-gap-sm);grid-template-columns:minmax(0,1fr) minmax(0,1fr);align-items:end;display:grid}.family{gap:var(--arq-space-gap-md);flex-direction:column;min-width:0;display:flex}.family-label{color:var(--arq-color-text-secondary);margin:0}.description-image{aspect-ratio:16/10;background:var(--arq-color-surface-subtle);grid-column:2}.description-image img{object-fit:cover;width:100%;height:100%;display:block}.cards{gap:var(--arq-space-gap-sm);margin:calc(-1 * var(--arq-space-gap-xs));padding:var(--arq-space-gap-xs);scroll-snap-type:x mandatory;scrollbar-width:none;display:flex;overflow-x:auto}.cards::-webkit-scrollbar{display:none}.cards arq-family-card{width:var(--arq-layout-card-min);scroll-snap-align:start;flex:none}.cards arq-family-card[size=large]{width:var(--arq-layout-card-min-wide)}.glossary{gap:var(--arq-space-gap-md);padding-bottom:var(--arq-space-section-xl);scroll-margin-top:var(--arq-space-gap-4xl);flex-direction:column;display:flex}.glossary-title{padding:0 var(--page-gutter)}::slotted([slot=glossary-title]:focus){outline:none}.inspiration{padding:0 var(--page-gutter) var(--arq-space-section-xl);grid-template-columns:minmax(0,1fr) minmax(0,2fr);align-items:center;display:grid}.inspiration-text{max-width:var(--arq-layout-measure);color:var(--arq-color-text-primary)}::slotted([slot=inspiration]){font:inherit!important;color:inherit!important;margin:0!important}.inspiration-images{min-width:0;display:flex}.inspiration-images:empty{display:none}.inspiration-images img{aspect-ratio:4/5;object-fit:cover;background:var(--arq-color-surface-subtle);flex:0 50%;min-width:0;display:block}.collection{padding:var(--arq-space-padding-5xl) var(--page-gutter);background:var(--arq-color-bg-default);color:var(--arq-color-text-primary);grid-template-columns:minmax(0,1fr) minmax(0,2fr);align-items:start;display:grid}.collection-intro{align-items:flex-start;gap:var(--arq-space-gap-md);max-width:var(--arq-layout-measure);flex-direction:column;display:flex}.collection-cards{flex:auto;min-width:0}@media (width<=1023px){.hero{gap:var(--arq-space-gap-2xl)}.header{padding-bottom:0}.configurator{gap:var(--arq-space-gap-2xl);flex-direction:column;display:flex}.details{align-items:stretch;gap:var(--arq-space-gap-2xl);flex-direction:column;display:flex}.inspiration{align-items:stretch;gap:var(--arq-space-gap-xl);flex-direction:column;display:flex}.collection{gap:var(--arq-space-gap-4xl);flex-direction:column;display:flex}}@media (width<=767px){.header{gap:var(--arq-space-gap-2xl)}.title-row{align-items:flex-start;gap:var(--arq-space-gap-xs);flex-direction:column}.actions{flex-direction:column}.actions arq-button{flex:none;width:100%}.downloads{gap:var(--arq-space-gap-xl)}.ambient{gap:var(--arq-space-gap-sm-md)}::slotted(p[slot=story-text]),.features{max-width:none}.family-row{align-items:stretch;gap:var(--arq-space-gap-6xl);flex-direction:column;display:flex}.description-image{order:-1}.inspiration-text{max-width:none}.inspiration-images{flex-direction:column}.inspiration-images img{flex:none;width:100%}}", Z = {
	loading: "Cargando producto…",
	notFound: "No encontramos este producto.",
	error: "No se pudo cargar el producto. Probá de nuevo en unos minutos.",
	datasheet: "Ficha técnica"
}, $r = () => matchMedia("(prefers-reduced-motion: reduce)").matches, ei = class extends f {
	static tag = "arq-ficha-producto";
	static styles = Qr;
	static properties = {};
	static template = "<div class=\"page\"><div class=\"hero\"><div class=\"header\"><arq-breadcrumb class=\"breadcrumb needs-data\"></arq-breadcrumb><div class=\"title-row\"><div class=\"title role-display\"><slot name=\"title\"></slot></div><arq-button class=\"collection-link needs-data\" type=\"underline\" show-underline show-icon icon=\"arrow-up-right\" hidden></arq-button></div></div><div class=\"configurator\"><div class=\"gallery-column\"><arq-toggle class=\"iluminar needs-data\" show-label>Iluminar</arq-toggle><arq-product-gallery class=\"gallery\"></arq-product-gallery></div><div class=\"configurator-column\"><div class=\"info\"><p class=\"status role-body\" role=\"status\" hidden></p><div class=\"product\"><arq-sku class=\"sku needs-data\"></arq-sku><div class=\"description role-body-regular\"><slot name=\"description\"></slot><span class=\"variant-description\" hidden></span></div></div><div class=\"options needs-data\"></div></div><div class=\"actions needs-data\"><arq-button class=\"datasheet\" show-icon icon=\"arrow-up-right\">Generar ficha técnica</arq-button><arq-button class=\"to-glossary\" type=\"outline\" show-icon icon=\"arrow-up-right\">Ver glosario</arq-button></div></div></div></div><div class=\"details needs-data\"><div class=\"downloads\"><div class=\"downloads-title role-display-sm\"><slot name=\"downloads-title\"></slot></div><div class=\"download-buttons\"></div></div><div class=\"accordion\"></div></div><div class=\"ambient needs-data\" role=\"region\" aria-label=\"Galería de ambiente\" tabindex=\"0\" hidden></div><div class=\"story-block\"><div class=\"story\"><div class=\"story-text\"><slot name=\"story-text\"></slot></div><div class=\"features\" hidden><p class=\"features-label role-body-medium\">Características del producto</p><div class=\"features-list role-body\"><slot name=\"story-list\"></slot></div></div></div><div class=\"family-row needs-data\" hidden><div class=\"family\" hidden><p class=\"family-label role-label\">Otras familias de la colección</p><div class=\"cards family-cards\"></div></div><div class=\"description-image\" hidden><img alt=\"\" loading=\"lazy\"></div></div></div><div class=\"glossary needs-data\"><div class=\"glossary-title role-display-sm\"><slot name=\"glossary-title\"></slot></div><arq-variants-table class=\"table\" downloads=\"downloads-modal\"></arq-variants-table></div><div class=\"inspiration\" hidden><div class=\"inspiration-text role-body-xl\"><slot name=\"inspiration\"></slot></div><div class=\"inspiration-images needs-data\"></div></div><div class=\"collection needs-data\" data-arq-theme=\"dark\" hidden><div class=\"collection-intro\"><div class=\"collection-title role-heading-2\"><slot name=\"collection-title\"></slot></div><arq-button class=\"collection-link\" type=\"underline\" show-underline show-icon icon=\"arrow-up-right\"></arq-button></div><div class=\"cards collection-cards\"></div></div></div><arq-download-modal id=\"downloads-modal\"><slot name=\"modal-title\" slot=\"title\"></slot></arq-download-modal>";
	#e = null;
	#t = {};
	#n = null;
	setup() {
		let e = this.shadowRoot;
		this.#a(), this.#g(), e.querySelector("slot[name=\"inspiration\"]").addEventListener("slotchange", () => this.#b()), this.#b(), e.querySelector(".iluminar").addEventListener("arq:change", (e) => this.#s(e.detail.checked)), e.querySelector(".options").addEventListener("arq:change", (e) => {
			let t = e.target.closest("[data-attribute]")?.dataset.attribute;
			t && e.detail?.selected && (this.#t = Ve(this.#t, t, e.detail.value), this.#l(), this.#u({ updateUrl: !0 }));
		}), e.querySelector(".datasheet").addEventListener("click", () => this.#p(this.#n)), e.querySelector(".to-glossary").addEventListener("click", () => this.#m()), e.querySelector(".download-buttons").addEventListener("click", (e) => {
			e.target.closest("[data-datasheet]") && this.#p(this.#n);
		}), e.querySelector(".table").addEventListener("arq:downloads", (e) => this.#y(e.detail.sku)), e.querySelector("arq-download-modal").addEventListener("arq:download", (e) => {
			e.stopPropagation(), this.#p(e.currentTarget.dataset.sku);
		}), this.#r();
	}
	async #r() {
		let e = this.getAttribute("data-group");
		this.setAttribute("aria-busy", "true"), this.#i(Z.loading);
		let t = null, n = !1;
		try {
			t = e ? await _n(e) : null;
		} catch (e) {
			n = !0, console.error("[arq] ficha-producto: no se pudo cargar el catálogo", e);
		}
		if (this.removeAttribute("aria-busy"), !t) {
			this.#i(n ? Z.error : Z.notFound);
			return;
		}
		this.#e = t, this.#i("");
		let r = new URLSearchParams(location.search).get("sku");
		this.#t = Ie(t.variants, t.variantAttributes, r), this.#o(), this.#c(), this.#l(), this.#u(), this.#h(), this.#_(), this.#v(), this.#x(), this.#S(), this.shadowRoot.querySelector(".page").toggleAttribute("data-ready", !0);
	}
	#i(e) {
		let t = this.shadowRoot.querySelector(".status");
		t.textContent = e, t.hidden = !e;
	}
	#a() {
		let e = this.querySelector(":scope > img[slot=\"image\"]");
		e && this.shadowRoot.querySelector(".gallery").append(e);
	}
	#o() {
		let { group: e, collection: t } = this.#e, n = this.shadowRoot, r = t ? [{
			label: "Colecciones",
			href: "/arq/productos?view=colecciones"
		}, {
			label: t.name,
			href: V(t.id)
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
		for (let e of n.querySelectorAll(".collection-link")) e.hidden = !t, t && (e.href = V(t.id), e.textContent = `Ver colección ${t.name}`);
	}
	#s(e) {
		let t = this.shadowRoot.querySelector(".hero");
		for (let n of [t, ...document.querySelectorAll("arq-navbar")]) e ? n.setAttribute("data-arq-theme", "dark") : n.removeAttribute("data-arq-theme");
		tt();
	}
	#c() {
		let { variants: e, variantAttributes: t } = this.#e, n = Le(e, t, this.#t).map(({ attribute: e, options: t }) => {
			let n = I(e), r = document.createElement("arq-option-group");
			r.dataset.attribute = e, r.label = n.label;
			let i = n.control === "swatches", a = i ? document.createElement("arq-swatch-picker") : r;
			i && (r.type = "swatches", r.append(a));
			for (let e of t) {
				let t = document.createElement(i ? "arq-swatch" : "arq-option-tile");
				t.value = e.value, t.textContent = e.value, a.append(t);
			}
			return r;
		});
		this.shadowRoot.querySelector(".options").replaceChildren(...n);
	}
	#l() {
		let { variants: e, variantAttributes: t } = this.#e, n = this.shadowRoot;
		for (let { attribute: r, options: i } of Le(e, t, this.#t)) n.querySelectorAll(`.options [data-attribute="${CSS.escape(r)}"] :is(arq-swatch, arq-option-tile)`).forEach((e, t) => {
			e.selected = i[t].selected, e.disabled = i[t].disabled;
		});
	}
	#u({ updateUrl: e = !1 } = {}) {
		let { group: t, variants: n } = this.#e, r = Fe(n, this.#t) ?? n.find((e) => e.isDefault) ?? n[0];
		if (!r || r.sku === this.#n) return;
		this.#n = r.sku;
		let i = Tn(t, r.sku), a = this.shadowRoot;
		a.querySelector(".sku").textContent = i.sku;
		let o = a.querySelector(".variant-description");
		if (o.textContent = i.description ?? "", o.hidden = !i.description, a.querySelector("slot[name=\"description\"]").hidden = !!i.description, a.querySelector(".gallery").images = i.images, this.#d(i.sections), this.#f(i.downloads), e) {
			let e = new URL(location.href);
			r.isDefault ? e.searchParams.delete("sku") : e.searchParams.set("sku", r.sku), history.replaceState(history.state, "", e);
		}
		this.emit("variant", { sku: r.sku });
	}
	#d(e) {
		let t = this.shadowRoot.querySelector(".accordion"), n = [...t.children], r = n.length ? new Set(n.filter((e) => e.open).map((e) => e.dataset.section)) : /* @__PURE__ */ new Set([e[0]?.id]);
		t.replaceChildren(...e.map((e) => {
			let t = document.createElement("arq-accordion-item");
			t.dataset.section = e.id, t.open = r.has(e.id);
			let n = document.createElement("span");
			n.slot = "title", n.textContent = e.label;
			let i = document.createElement("arq-spec-list");
			for (let t of e.rows) {
				let e = document.createElement("arq-spec-row"), n = document.createElement("span");
				n.slot = "label", n.textContent = t.label, e.append(n, String(t.value)), i.append(e);
			}
			return t.append(n, i), t;
		}));
	}
	#f(e) {
		let t = (e, t) => {
			let n = document.createElement("arq-button");
			return n.type = "outline", n.showIcon = !0, n.icon = "download", t && (n.href = t), n.textContent = e, n;
		}, n = t(Z.datasheet);
		n.dataset.datasheet = "", this.shadowRoot.querySelector(".download-buttons").replaceChildren(n, ...e.map((e) => t(e.label, e.href)));
	}
	#p(e) {
		e && this.emit("datasheet", { sku: e });
	}
	#m() {
		this.shadowRoot.querySelector(".glossary").scrollIntoView({
			behavior: $r() ? "auto" : "smooth",
			block: "start"
		});
		let e = this.querySelector(":scope > [slot=\"glossary-title\"]");
		e && (e.tabIndex = -1, e.focus({ preventScroll: !0 }));
	}
	#h() {
		let { group: e, images: t } = this.#e, n = this.shadowRoot.querySelector(".ambient");
		n.hidden = !t.ambient.length, n.replaceChildren(...t.ambient.map((t, n) => ti(t, `${e.name}, ambiente ${n + 1}`)));
	}
	#g() {
		let e = this.shadowRoot, t = this.querySelector(":scope > [slot=\"story\"]");
		if (!t) {
			e.querySelector(".story").hidden = !0;
			return;
		}
		let n = t.textContent.split("\n").map((e) => e.trim()).filter(Boolean), r = [], i = null, a = 0;
		for (let e of n) {
			if (e.startsWith("- ")) {
				i ??= Object.assign(document.createElement("ul"), { slot: "story-list" }), i.append(Object.assign(document.createElement("li"), { textContent: e.slice(2).trim() }));
				continue;
			}
			let t = e.startsWith("## "), n = document.createElement(t ? a++ ? "h3" : "h2" : "p");
			n.slot = "story-text", n.textContent = t ? e.slice(3).trim() : e, r.push(n);
		}
		t.replaceWith(...r, ...i ? [i] : []), e.querySelector(".story-text").hidden = !r.length, e.querySelector(".features").hidden = !i, e.querySelector(".story").hidden = !r.length && !i;
	}
	#_() {
		let { family: e, images: t } = this.#e, n = this.shadowRoot;
		n.querySelector(".family").hidden = !e.length, n.querySelector(".family-cards").replaceChildren(...e.map((e) => ni(e)));
		let r = n.querySelector(".description-image");
		r.hidden = !t.description, t.description && (r.querySelector("img").src = t.description), n.querySelector(".family-row").hidden = !e.length && !t.description;
	}
	#v() {
		let { group: e, glossary: t, files: n } = this.#e, r = this.shadowRoot.querySelector(".table");
		r.label = `Variantes de ${e.name}`, r.data = t, r.replaceChildren(...n.map((e) => {
			let t = document.createElement("arq-button");
			return t.slot = "downloads", t.type = "outline", t.showIcon = !0, t.icon = "download", t.href = e.href, t.textContent = e.label, t;
		}));
	}
	#y(e) {
		let t = this.shadowRoot.querySelector("arq-download-modal");
		t.dataset.sku = e;
		let n = document.createElement("arq-download-item");
		n.emphasis = "featured", n.textContent = Z.datasheet;
		let r = Tn(this.#e.group, e).downloads.map((e) => {
			let t = document.createElement("arq-download-item");
			return t.href = e.href, t.textContent = e.label, t;
		});
		for (let e of t.querySelectorAll(":scope > arq-download-item")) e.remove();
		t.append(n, ...r);
	}
	#b() {
		let e = this.shadowRoot, t = e.querySelector("slot[name=\"inspiration\"]").assignedElements().length > 0, n = e.querySelector(".inspiration-images").children.length > 0;
		e.querySelector(".inspiration").hidden = !t && !n;
	}
	#x() {
		let { group: e, images: t } = this.#e;
		this.shadowRoot.querySelector(".inspiration-images").replaceChildren(...t.inspiration.map((t, n) => ti(t, `${e.name}, inspiración ${n + 1}`))), this.#b();
	}
	#S() {
		let { collection: e, family: t } = this.#e, n = this.shadowRoot.querySelector(".collection");
		n.hidden = !e || !t.length, n.querySelector(".collection-cards").replaceChildren(...t.map((e) => ni(e, "large")));
	}
};
function ti(e, t) {
	let n = document.createElement("img");
	return n.src = e, n.alt = t, n.loading = "lazy", n;
}
function ni(e, t) {
	let n = document.createElement("arq-family-card");
	if (n.href = e.href, t && (n.size = t), e.image) {
		let t = ti(e.image, "");
		t.slot = "image", n.append(t);
	}
	let r = document.createElement("h3");
	return r.slot = "name", r.textContent = e.name, n.append(r), n;
}
ei.define();
//#endregion
//#region src/components/coleccion/coleccion.css?inline
var ri = ":host{min-width:0;color:var(--arq-color-text-primary);display:block}.products{gap:var(--arq-space-gap-xl);padding:0 var(--page-gutter) var(--arq-space-section-xl);flex-direction:column;display:flex}.status{color:var(--arq-color-text-secondary);margin:0}.gallery{padding-bottom:var(--arq-space-section-xl);display:flex}.gallery img{aspect-ratio:1;object-fit:cover;background:var(--arq-color-surface-subtle);flex:1 1 0;min-width:0;display:block}.feature{padding:0 0 var(--arq-space-section-xl) var(--page-gutter);grid-template-columns:minmax(0,1fr) minmax(0,2fr);align-items:center;display:grid}.feature-text{max-width:var(--arq-layout-measure);padding-right:var(--page-gutter);color:var(--arq-color-text-primary)}::slotted([slot=description]){font:inherit!important;color:inherit!important;margin:0!important}.feature-image{aspect-ratio:5/4;background:var(--arq-color-surface-subtle);grid-column:2}.feature-image img{object-fit:cover;width:100%;height:100%;display:block}.mosaic{gap:var(--arq-space-gap-lg);padding-bottom:var(--arq-space-section-xl);flex-direction:column;display:flex}.controls{padding-right:var(--page-gutter);justify-content:flex-end;display:flex}.track{gap:var(--arq-space-gap-md);padding-left:var(--page-gutter);scroll-snap-type:x mandatory;scrollbar-width:none;scroll-padding-inline-start:var(--page-gutter);display:flex;overflow-x:auto}.track::-webkit-scrollbar{display:none}.track img{object-fit:cover;scroll-snap-align:start;background:var(--arq-color-surface-subtle);flex:none;width:auto;max-width:none;height:70svh;display:block}.track:focus-visible{outline-offset:calc(-1 * var(--arq-border-strong))}@media (width<=767px){.gallery{flex-direction:column}.gallery img{flex:none;width:100%}.feature{align-items:stretch;gap:var(--arq-space-gap-xl);flex-direction:column;padding-left:0;display:flex}.feature-text{max-width:none;padding:0 var(--page-gutter)}.controls{display:none}.track{gap:var(--arq-space-gap-sm-md)}}", Q = {
	loading: "Cargando colección…",
	notFound: "No encontramos esta colección.",
	empty: "Esta colección todavía no tiene productos.",
	error: "No se pudo cargar la colección. Probá de nuevo en unos minutos."
}, ii = class extends f {
	static tag = "arq-coleccion";
	static styles = ri;
	static properties = {};
	static template = "<div class=\"products\"><p class=\"status role-body\" role=\"status\" hidden></p><arq-grid class=\"grid\"></arq-grid></div><div class=\"gallery\" hidden></div><div class=\"feature\" hidden><div class=\"feature-text role-body-xl\"><slot name=\"description\"></slot></div><div class=\"feature-image\" hidden><img alt=\"\" loading=\"lazy\"></div></div><div class=\"mosaic\" hidden><div class=\"controls\"><arq-carousel-controls for=\"mosaic-track\" label-prev=\"Fotos anteriores\" label-next=\"Fotos siguientes\"></arq-carousel-controls></div><div class=\"track\" id=\"mosaic-track\" role=\"region\" aria-label=\"Fotos de la colección\" tabindex=\"0\"></div></div>";
	setup() {
		this.shadowRoot.querySelector("slot[name=\"description\"]").addEventListener("slotchange", () => this.#i()), this.#i(), this.#e();
	}
	async #e() {
		let e = this.getAttribute("data-collection");
		this.setAttribute("aria-busy", "true"), this.#t(Q.loading);
		let t = null, n = !1;
		try {
			t = e ? await En(e) : null;
		} catch (e) {
			n = !0, console.error("[arq] coleccion: no se pudo cargar el catálogo", e);
		}
		if (this.removeAttribute("aria-busy"), !t) {
			this.#t(n ? Q.error : Q.notFound);
			return;
		}
		this.#t(t.cards.length ? "" : Q.empty), this.#n(t.cards), this.#r(t);
	}
	#t(e) {
		let t = this.shadowRoot.querySelector(".status");
		t.textContent = e, t.hidden = !e;
	}
	#n(e) {
		this.shadowRoot.querySelector(".grid").replaceChildren(...e.map((e) => {
			let t = document.createElement("arq-product-card");
			t.href = e.href, t.image = e.image, t.imageHover = e.imageHover, t.imageLit = e.imageLit, t.imageHoverLit = e.imageHoverLit;
			let n = document.createElement("h2");
			n.slot = "name", n.textContent = e.name, t.append(n);
			for (let n of e.finishes ?? []) {
				let e = document.createElement("arq-swatch");
				e.slot = "finishes", e.textContent = n, t.append(e);
			}
			if (e.meta) {
				let n = document.createElement("span");
				n.slot = "meta", n.textContent = e.meta, t.append(n);
			}
			return t;
		}));
	}
	#r({ collection: e, images: t }) {
		let n = this.shadowRoot, r = n.querySelector(".gallery");
		r.hidden = !t.gallery.length, r.replaceChildren(...t.gallery.map((t, n) => ai(t, `${e.name}, imagen ${n + 1}`)));
		let i = n.querySelector(".feature-image");
		i.hidden = !t.description, t.description && (i.querySelector("img").src = t.description), this.#i();
		let a = n.querySelector(".mosaic");
		a.hidden = !t.inspiration.length, n.querySelector(".track").replaceChildren(...t.inspiration.map((t, n) => ai(t, `${e.name}, proyecto ${n + 1}`)));
	}
	#i() {
		let e = this.shadowRoot, t = e.querySelector("slot[name=\"description\"]").assignedElements().length > 0;
		e.querySelector(".feature-text").hidden = !t, e.querySelector(".feature").hidden = !t && e.querySelector(".feature-image").hidden;
	}
};
function ai(e, t) {
	let n = document.createElement("img");
	return n.src = e, n.alt = t, n.loading = "lazy", n;
}
ii.define();
//#endregion
//#region src/components/descargas/descargas.css?inline
var oi = ":host{min-width:0;padding-bottom:var(--arq-space-section-xl);color:var(--arq-color-text-primary);display:block}.status{padding:0 var(--page-gutter);color:var(--arq-color-text-secondary);margin:0}", $ = {
	loading: "Cargando descargas…",
	empty: "Todavía no hay productos para descargar.",
	error: "No se pudieron cargar las descargas. Probá de nuevo en unos minutos.",
	label: "Descargas por SKU",
	datasheet: "Ficha técnica"
};
(class extends f {
	static tag = "arq-descargas";
	static styles = oi;
	static properties = {};
	static template = "<p class=\"status role-body\" role=\"status\" hidden></p><arq-variants-table class=\"table\" downloads=\"downloads-modal\" show-search hidden></arq-variants-table><arq-download-modal id=\"downloads-modal\"><slot name=\"modal-title\" slot=\"title\"></slot></arq-download-modal>";
	setup() {
		let e = this.shadowRoot;
		e.querySelector(".table").label = $.label, e.querySelector(".table").addEventListener("arq:downloads", (e) => this.#n(e.detail.sku)), e.querySelector("arq-download-modal").addEventListener("arq:download", (e) => {
			e.stopPropagation();
			let { sku: t } = e.currentTarget;
			t && this.emit("datasheet", { sku: t });
		}), this.#e();
	}
	async #e() {
		this.setAttribute("aria-busy", "true"), this.#t($.loading);
		let e = null;
		try {
			e = await yn();
		} catch (e) {
			console.error("[arq] descargas: no se pudo cargar el catálogo", e);
		}
		if (this.removeAttribute("aria-busy"), !e) {
			this.#t($.error);
			return;
		}
		this.#t(e.rows.length ? "" : $.empty);
		let t = this.shadowRoot.querySelector(".table");
		t.data = e, t.hidden = !e.rows.length;
	}
	#t(e) {
		let t = this.shadowRoot.querySelector(".status");
		t.textContent = e, t.hidden = !e;
	}
	async #n(e) {
		let t = this.shadowRoot.querySelector("arq-download-modal");
		t.sku = e;
		let n = document.createElement("arq-download-item");
		n.textContent = $.datasheet;
		for (let e of t.querySelectorAll(":scope > arq-download-item")) e.remove();
		t.append(n);
		let r = await bn(e);
		t.sku === e && t.append(...r.map((e) => {
			let t = document.createElement("arq-download-item");
			return t.href = e.href, t.textContent = e.label, t;
		}));
	}
}).define();
//#endregion
//#region src/components/form-contacto/form-contacto.css?inline
var si = ":host{min-width:0;color:var(--arq-color-text-primary);display:block}.layout{column-gap:var(--arq-space-gap-6xl);padding:var(--arq-space-section-lg) var(--page-gutter) var(--arq-space-section-xl);grid-template-columns:minmax(0,2fr) minmax(0,3fr);align-items:start;display:grid}.info{gap:var(--arq-space-gap-2xl);flex-direction:column;min-width:0;display:flex}.intro{gap:var(--arq-space-gap-md);flex-direction:column;display:flex}.title{color:var(--arq-color-text-primary)}.description{color:var(--arq-color-text-secondary)}::slotted([slot=description]){font:inherit!important;color:inherit!important;margin:0!important}.channels{gap:var(--arq-space-gap-lg);flex-direction:column;display:flex}.form{gap:var(--arq-space-gap-2xl);flex-direction:column;min-width:0;display:flex}.section{gap:var(--arq-space-gap-lg);border:0;flex-direction:column;min-inline-size:0;margin:0;padding:0;display:flex}.section>legend{float:left;width:100%;color:var(--arq-color-text-primary);margin:0;padding:0}.choices{gap:var(--arq-space-gap-sm);flex-wrap:wrap;display:flex}.choices.fill>arq-choice-chip{flex:auto}.fields{gap:var(--arq-space-gap-lg);grid-template-columns:minmax(0,1fr) minmax(0,1fr);display:grid}.honeypot{width:var(--arq-border-default);height:var(--arq-border-default);clip-path:inset(50%);white-space:nowrap;position:absolute;overflow:hidden}.submit{justify-content:space-between;align-items:flex-start;gap:var(--arq-space-gap-lg);display:flex}.submit arq-checkbox{flex:none}.send{align-items:flex-end;gap:var(--arq-space-gap-md);text-align:end;flex-direction:column;min-width:0;margin-inline-start:auto;display:flex}@media (width<=767px){.layout{row-gap:var(--arq-space-gap-6xl);grid-template-columns:minmax(0,1fr)}.fields{grid-template-columns:minmax(0,1fr)}.submit{flex-direction:column;align-items:stretch}.send{text-align:start;align-items:stretch;margin-inline-start:0}.send-button{width:100%}}", ci = [
	"Asesoramiento lumínico",
	"Cotización de proyecto",
	"Consulta técnica",
	"Garantía"
], li = [
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
], ui = {
	nombre: "Completá tu nombre.",
	email: {
		valueMissing: "Completá tu email.",
		typeMismatch: "Revisá el formato del email."
	},
	detalles: "Contanos un poco sobre tu proyecto."
}, di = {
	sent: "Recibimos tu consulta. Te respondemos a la brevedad.",
	error: "No pudimos enviar tu consulta. Probá de nuevo en unos minutos."
}, fi = (e) => e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;"), pi = class extends f {
	static tag = "arq-form-contacto";
	static styles = si;
	static properties = {};
	static template = "<div class=\"layout\"><div class=\"info\"><div class=\"intro\"><div class=\"title role-heading-2\"><slot name=\"title\"></slot></div><div class=\"description role-body-lg\"><slot name=\"description\"></slot></div></div><div class=\"channels\"><slot name=\"channels\"></slot></div><slot name=\"links\"></slot></div><form class=\"form\" novalidate><fieldset class=\"section topics\"><legend class=\"role-heading-3\">Tipo de consulta</legend><div class=\"choices\" role=\"radiogroup\" aria-label=\"Tipo de consulta\">" + ci.map((e, t) => `<arq-choice-chip name="tipo" value="${fi(e)}"${t ? "" : " selected"}>${fi(e)}</arq-choice-chip>`).join("") + "</div></fieldset><fieldset class=\"section\"><legend class=\"role-heading-3\">Tus datos</legend><div class=\"fields\"><arq-input name=\"nombre\" placeholder=\"Tu nombre y apellido\" autocomplete=\"name\" required show-label>Nombre completo</arq-input><arq-input name=\"empresa\" placeholder=\"Nombre del estudio\" autocomplete=\"organization\" show-label>Estudio o empresa</arq-input><arq-input name=\"email\" input-type=\"email\" placeholder=\"nombre@estudio.com\" autocomplete=\"email\" required show-label>Email</arq-input><arq-input name=\"telefono\" input-type=\"tel\" placeholder=\"+54 11 0000-0000\" autocomplete=\"tel\" show-label>Teléfono</arq-input><arq-input name=\"provincia\" type=\"select\" placeholder=\"Seleccioná una provincia\" show-label>Provincia</arq-input><arq-input name=\"ciudad\" placeholder=\"Tu ciudad\" autocomplete=\"address-level2\" show-label>Ciudad</arq-input></div></fieldset><fieldset class=\"section\"><legend class=\"role-heading-3\">Tu proyecto</legend><arq-input name=\"detalles\" type=\"textarea\" placeholder=\"Contanos el tipo de espacio, etapa del proyecto y qué necesitás…\" required show-label>Detalles del proyecto</arq-input><arq-file-upload name=\"adjunto\">Planos o imágenes (opcional)<span slot=\"helper\">PDF, DWG, JPG o PNG · hasta 10 MB</span></arq-file-upload></fieldset><div class=\"honeypot\" aria-hidden=\"true\"><label>No completar este campo <input type=\"text\" name=\"website\" tabindex=\"-1\" autocomplete=\"off\"></label></div><div class=\"submit\"><arq-checkbox name=\"novedades\" value=\"si\" show-label>Quiero recibir novedades y lanzamientos</arq-checkbox><div class=\"send\"><arq-button class=\"send-button\" submit show-icon icon=\"arrow-right\">Enviar consulta</arq-button><arq-form-message class=\"message\" hidden></arq-form-message></div></div></form></div>";
	#e = !1;
	setup() {
		let e = this.shadowRoot, t = e.querySelector(".choices");
		new T(t, { items: "arq-choice-chip" });
		let n = [...t.querySelectorAll("arq-choice-chip")], r = new ResizeObserver(() => t.classList.toggle("fill", n.every((e) => e.offsetTop === n[0].offsetTop)));
		r.observe(t);
		for (let e of n) r.observe(e);
		e.querySelector("[name=\"provincia\"]").options = li.map((e) => ({ value: e }));
		let i = e.querySelector("form");
		i.addEventListener("submit", (e) => {
			e.preventDefault(), this.#r(i);
		}), i.addEventListener("arq:change", (e) => {
			this.#e && e.target.localName === "arq-input" && this.#n(e.target);
		});
	}
	#t(e) {
		if (e.checkValidity()) return "";
		let t = ui[e.name];
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
			c = s || await mi(o);
		} catch (e) {
			console.error("[arq] form-contacto: no se pudo enviar", e);
		}
		if (i.loading = !1, a.tone = c ? "success" : "error", a.textContent = c ? di.sent : di.error, a.hidden = !1, c) {
			e.reset(), this.#e = !1;
			for (let e of n) e.removeAttribute("error");
			this.emit("sent", {});
		} else this.emit("error", {});
	}
};
async function mi(e) {
	let t = Rt.n8n.webhookUrl;
	return t ? (await fetch(t, {
		method: "POST",
		body: e
	})).ok : (console.error("[arq] form-contacto: falta VITE_N8N_WEBHOOK_URL"), !1);
}
//#endregion
//#region src/main.js
pi.define(), window.Arq || (window.Arq = Object.freeze({ version: e }));
//#endregion
