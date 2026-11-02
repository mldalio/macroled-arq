# compare-bar · `<arq-compare-bar>`

Barra fija inferior para comparar productos (hasta 3), en Productos y la ficha. Aparece cuando hay al menos un producto elegido con "Comparar" en una product-card.

Es `position: sticky` (`bottom: 0`), como macroled.com.ar/productos: queda pegada al borde de la pantalla mientras se recorre su contenedor y, al final, se apoya sobre el footer, sin espacio reservado. Va al final del contenedor y a todo su ancho (sin padding lateral en el padre). Decisión: `docs/decisiones.md`, 2026-10-23 · compare-bar sticky.

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
bar.addEventListener('arq:add', () => picker.show());                                   // lugar vacío
bar.addEventListener('arq:replace', (e) => picker.show(null, { replace: e.detail.sku })); // lugar con producto
bar.addEventListener('arq:dismiss', () => focusHeading(contenedor));                    // X de la barra vacía
```

## Props y métodos

| Figma | Atributo | Prop JS | Valores |
| --- | --- | --- | --- |
| Title | — | — | "Productos seleccionados" + count-badge con la cantidad |
| — (productos) | — | `items` | `[{ sku, name, meta, image }]`, hasta 3 |
| — | `href` | `href` | Página de la comparativa. Por defecto `/arq/comparativa` |
| Open | `open` | `open` | Booleano. Lista de productos desplegada. La pone el componente: arranca abierta, el título (botón con chevron-down / chevron-up) la pliega y despliega, y se vuelve a abrir al agregar un producto. En Mobile, con 2 o más productos arranca plegada y no se abre sola al agregar (abierta con 3 ocupaba más de la mitad de la pantalla; decisión 2026-10-26). Plegada queda solo el título con el chevron (en Desktop, el chevron en la punta derecha de la barra): «Borrar todo» y «Comparar» se ocultan con la lista. `TODO` (diseño): el set los muestra plegada. Usa el disclosure base (`arq:toggle { open }`) |
| Breakpoint | — | — | Media query: hasta 767 px, como macroled.com.ar, los productos elegidos, uno arriba de otro (compare-slot Default, con divider Horizontal Subtle), más un lugar vacío «+ Agregar producto» mientras haya menos de 3, y «Comparar» debajo a todo el ancho. En Tablet (768–1023 px) los tres lugares van en una línea y «Borrar todo» y «Comparar» debajo, a la derecha |

- **Métodos:** `add(item)` (devuelve `false` si ya hay 3 o si ya estaba), `remove(sku)`, `replace(sku, item)` (otro producto en el mismo lugar; `false` si `item` ya estaba), `clear()` ("Borrar todo"), `dismiss()` (la X de la barra vacía), `has(sku)`, `focusAdd()` (foco en el primer lugar vacío o en «Comparar»), `focusItem(sku)` (foco en ese producto; abre la lista si estaba plegada) y `compareUrl` (solo lectura: la URL de «Comparar»).
- **Alto plegada:** `foldedHeight` (solo lectura) es el alto de la barra con la lista plegada (solo el título), en px, o 0 si no se ve. Cuando cambia (aparece, se oculta o cambia el alto del título) emite `arq:compare-space { height }`. La ficha lo descuenta del alto del hero, así la barra plegada no tapa los botones del configurador (2026-11-02).
- **`focusHeading(host)`** (export del módulo): después de `arq:dismiss`, el foco va al `<h1>` del contenedor o de la página, sin desplazarla. Lo usan catalog-listing y ficha-producto.
- **Lugar con producto:** tocarlo emite `arq:replace { sku }` (de compare-slot): la página abre `compare-picker` en «Cambiar producto» y llama a `replace()`. Cuando el modal se cierra, el foco va al producto elegido (`focusItem`). El orden es fijo: el de cómo se agregaron. Se probó reordenar arrastrando y quedó para más adelante (`docs/decisiones.md`, 2026-11-02 · compare-bar: cambiar y quitar).
- **Vacía:** al quitar todos los productos (X o «Borrar todo») la barra sigue a la vista con los lugares vacíos (Mobile: uno), sin cantidad ni «Borrar todo», «Comparar» deshabilitado y una X («Cerrar comparador», icon-button) a la derecha del título. La X oculta la barra y emite `arq:dismiss`. Al recargar sin productos, la barra no aparece. Foco: después de «Borrar todo», al primer lugar vacío; después de la X de un producto, al lugar que queda en esa posición.
- **Avisos:** una región `aria-live` (fuera de la barra, para que se escuche también al cerrarla) anuncia lo que se agrega («… 2 de 3.»), se quita, se cambia, «Borrar todo» y el cierre.
- **Lugar vacío (+):** emite `arq:add` (de compare-slot). En Productos (`catalog-listing`) y en la ficha (`ficha-producto`), la página abre `compare-picker` («Agregar producto») y lo elegido se suma a la barra. Caja punteada con la foto resaltada y «+ Agregar producto» (ver compare-slot). En Mobile hay un solo lugar vacío, debajo de los elegidos. `TODO` (diseño): el set de compare-bar Mobile no lo muestra; pasarlo a Figma.
- **Evento:** `arq:compare-change { items }` cuando cambia la selección (también si cambia en otra pestaña).
- **"Comparar"** lleva a `/arq/comparativa?sku=SKU1,SKU2,SKU3` (decisión 2026-10-02 · Comparativa); cada SKU va con `encodeURIComponent`.
- **La selección se recuerda** en `localStorage` (`arq:compare`): sigue al cambiar de filtros o de página.
- **Dark local** (DESIGN.md §2): el contenedor interno lleva `data-arq-theme="dark"`; quien arma la página no pone nada.
- **Fija abajo:** la página tiene que dejar lugar al final del contenido para que la barra no tape lo último (el componente no toca `body`, AGENTS.md). Abajo suma el área segura del teléfono (`env(safe-area-inset-bottom)`), como filter-panel; vale 0 si el sitio no usa `viewport-fit=cover`.
- **Movimiento:** entra desde el borde de abajo al elegir el primer producto (`motion/duration/base`, `motion/easing/out`) y sale por el mismo borde, más rápido (`motion/duration/fast`), al quitar el último. Si la página carga con productos ya elegidos, aparece sin animar. Con movimiento reducido, solo un fundido (`motion/duration/fade`).

## Tokens

| Parte | Token |
| --- | --- |
| Fondo · línea superior | `color/surface/default` (en Dark) · `border/default` en `color/border/default` (Mobile `color/border/subtle`, como el set) |
| Padding | `space/padding/md` × `layout/gutter` (Mobile, abajo `space/padding/lg`) |
| Gaps | título–lugares `space/gap/md` (Mobile `space/gap/sm-md`); lugares `space/gap/lg` con divider Vertical Default (Mobile, apilados: `space/gap/sm` con divider Horizontal Subtle); lugares–acciones `space/gap/2xl` (Mobile `space/gap/md`); acciones `space/gap/xl` |
| Título | `role/body-lg` + count-badge, gap `space/gap/sm` |
| Acciones | button Underline "Borrar todo" y Filled "Comparar" con arrow-right. En Mobile, «Comparar» debajo de los productos a todo el ancho y «Borrar todo» debajo, centrado, a `space/gap/md` (junto al título no entraba por debajo de 375 px). `TODO` (diseño): el set Mobile lo tiene junto al título |

## Pendientes

- `TODO` (listados) Qué datos van en `meta` del lugar y de dónde sale la imagen (la de la product-card).
