# compare-bar · `<arq-compare-bar>`

Barra fija inferior para comparar productos (hasta 3), en Productos y Colecciones. Aparece cuando hay al menos un producto elegido con "Comparar" en una product-card.

- Figma: [1233-3963](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1233-3963) · ficha `doc/compare-bar`

```html
<arq-compare-bar></arq-compare-bar>
```

```js
// en la página del listado
grilla.addEventListener('arq:compare', (e) => {
  const card = e.target;
  if (!e.detail.checked) bar.remove(sku);
  else if (!bar.add({ sku, name, meta, image })) card.compared = false; // ya hay 3
});
bar.addEventListener('arq:compare-change', (e) => marcarCards(e.detail.items));
```

## Props y métodos

| Figma | Atributo | Prop JS | Valores |
| --- | --- | --- | --- |
| Title | — | — | "Productos seleccionados" + count-badge con la cantidad |
| — (productos) | — | `items` | `[{ sku, name, meta, image }]`, hasta 3 |
| — | `href` | `href` | Página de la comparativa. Por defecto `/arq/comparativa` |
| Breakpoint | — | — | Media query: hasta 767 px los lugares van en Compact |

- **Métodos:** `add(item)` (devuelve `false` si ya hay 3 o si ya estaba), `remove(sku)`, `clear()` ("Borrar todo"), `has(sku)`.
- **Evento:** `arq:compare-change { items }` cuando cambia la selección (también si cambia en otra pestaña).
- **"Comparar"** lleva a `/arq/comparativa?sku=SKU1,SKU2,SKU3` (decisión 2026-10-02 · Comparativa); cada SKU va con `encodeURIComponent`.
- **La selección se recuerda** en `localStorage` (`arq:compare`): sigue al cambiar de filtros o de página.
- **Dark local** (DESIGN.md §2): el contenedor interno lleva `data-arq-theme="dark"`; quien arma la página no pone nada.
- **Fija abajo:** la página tiene que dejar lugar al final del contenido para que la barra no tape lo último (el componente no toca `body`, AGENTS.md).

## Tokens

| Parte | Token |
| --- | --- |
| Fondo · línea superior | `color/surface/default` (en Dark) · `border/default` en `color/border/default` (Mobile `color/border/subtle`, como el set) |
| Padding | `space/padding/md` × `layout/gutter` (Mobile, abajo `space/padding/lg`) |
| Gaps | título–lugares `space/gap/md` (Mobile `space/gap/sm-md`); lugares `space/gap/lg` con divider Vertical Default (Mobile `space/gap/sm`); lugares–acciones `space/gap/2xl` (Mobile `space/gap/md`); acciones `space/gap/xl` |
| Título | `role/body-lg` + count-badge, gap `space/gap/sm` |
| Acciones | button Underline "Borrar todo" (en Mobile arriba, junto al título) y Filled "Comparar" (en Mobile ocupa el resto) |

## Pendientes

- `TODO` (listados) Qué datos van en `meta` del lugar y de dónde sale la imagen (la de la product-card).
