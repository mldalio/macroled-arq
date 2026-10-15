# select · `<arq-select>`

Selector con menú desplegable (select-menu). Field: etiqueta arriba (sin gap) y un trigger con línea inferior. Filter: etiqueta a `space/gap/sm` y trigger sin línea (salvo Disabled), muestra y chevron chicos y el valor Filled en `role/body-medium`. Type=Field: campo del configurador y de compare-product. Type=Filter: celda de filter-bar y del glosario ("Todos" primero) y, con Size=Small y `hide-all`, los selects de compare-product.

- Figma: [921-2544](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=921-2544) · ficha `doc/select`

```html
<arq-select label="Acabado" value="Negro" show-swatch></arq-select>
<arq-select type="filter" label="Acabado" name="color_carcasa"></arq-select>
<arq-select type="filter" size="small" label="Acabado" value="Negro"></arq-select>
```

```js
select.options = [
  { value: 'Negro', label: 'Negro', swatch: '…/negro.jpg' },
  { value: 'Verde', label: 'Verde', showSwatch: true },      // muestra sin imagen: neutro
  { value: 'Terracota', label: 'Terracota', disabled: true }, // sin combinación
];
select.addEventListener('arq:change', (e) => console.log(e.detail.value));
```

## Props

| Figma | Atributo | Prop JS | Valores · por defecto |
| --- | --- | --- | --- |
| Type | `type` | `type` | `field` · `filter`. Por defecto `field` |
| Size | `size` | `size` | `default` · `small`. Por defecto `default`. Solo cambia la etiqueta de Filter: Default en `role/label-lg` (14, filter-bar y Descargas), Small en `role/label` (12, compare-product). En Field no cambia nada |
| Label | `label` | `label` | Etiqueta visible (`role/label` en Field y en Filter Small, `role/label-lg` en Filter Default) arriba del campo, siempre, en los dos Type y en cualquier State (incluido Disabled) |
| Name (Field) · Value (Filter) | `value` | `value` | Valor elegido; el texto que se ve sale de la opción. Filter sin valor = "Todos" |
| — (opciones) | — | `options` | Lista `{ value, label?, swatch?, showSwatch?, disabled? }` (solo JS). La muestra solo se ve si la opción trae `swatch` o `showSwatch` (acabado/color, p. ej. color de carcasa); el resto queda solo texto. `TODO` (diseño): falta definir qué campos cuentan como "color" |
| Show swatch | `show-swatch` | `showSwatch` | booleano. Muestra la muestra de color en todas las opciones (sin imagen, el neutro de swatch). En Figma viene activada; en código va desactivada por defecto (atributo de presencia). Una opción puede apagarla con `showSwatch: false` |
| State=Disabled | `disabled` | `disabled` | booleano |
| Open | `open` | `open` | booleano. Mejor `show()` y `close()` |
| State=Filled | `filled` | `filled` | Lo pone el componente: Filter con un valor elegido |
| — | `name` | `name` | Campo al que corresponde (lo usa filter-bar para armar los filtros) |
| — | `all-label` | `allLabel` | Texto de la primera opción de Filter. Por defecto "Todos" |
| — (solo de código) | `multiple` | `multiple` | booleano. Selección múltiple (solo Filter; Descargas · propuesta 2575:22875): opciones con la caja de checkbox, sin «Todos»; el menú queda abierto al marcar (Enter, Espacio o clic) y toma el ancho del campo. El campo muestra los valores separados por coma («8 W, 12 W», Filled) o `all-label` |
| — | — | `values` | Valores elegidos con `multiple` (array, solo JS). `arq:change` emite `{ value, values }` |
| — | `hide-all` | `hideAll` | booleano, solo de código. Filter sin la opción "Todos": para compare-product, donde siempre hay una variante elegida |

- **Size=Small** abre el menú del ancho del campo (select-menu Finishes), no de `layout/select-menu-filter`: en las columnas angostas de la comparativa Mobile no se sale de la columna ni de la pantalla.

- **No son props:** State=Hover y State=Focus (CSS).
- **Las opciones las arma el componente** (decisión 2026-10-02 · glosario): el campo y la lista quedan en el mismo Shadow DOM y funciona el patrón de select de un valor (`role="combobox"` + `role="listbox"` con `aria-activedescendant`). El foco queda siempre en el campo.
- **Teclado:** cerrado, flechas, Enter, Espacio, Inicio, Fin o una letra abren. Abierto: flechas, Inicio y Fin mueven la opción resaltada (saltean las deshabilitadas), una letra salta a la primera que empieza así, Enter o Espacio eligen, Esc cierra y Tab cierra sin elegir. Clic afuera cierra.
- **Evento:** `arq:change { value }` al elegir un valor distinto.
- **Construcción** (cambio de 2026-10-14, Figma 921:2544): Filter tiene gap `space/gap/sm` entre etiqueta y campo y el trigger sin línea en Default, Hover, Filled y Open (la línea solo en Disabled); Field sigue con gap 0 y línea. En los dos, reposo en `role/body-regular`, Hover y Open con fondo `color/surface/faint` y el texto sin cambios; solo el valor elegido de Filter (Filled) va en `role/body-medium`.
- **Focus:** anillo `border/strong` en `color/border/focus` separado 2 px (DESIGN.md §7). En Figma el anillo se dibuja pegado, por limitación de la herramienta.

## Tokens

| Parte | Token |
| --- | --- |
| Trigger | Field: línea inferior `border/default` en `color/border/strong`; Filter: sin línea (transparente, salvo Disabled); padding vertical `space/padding/sm-md` (se descuenta la línea: el campo mide 48), sin padding lateral; gap `space/gap/sm-md`; texto `role/body-regular` |
| Etiqueta | `role/label` (Field y Filter Small) o `role/label-lg` (Filter Default) en `color/text/tertiary`; gap 0 con el trigger en Field y `space/gap/sm` en Filter |
| Hover y Open | `color/surface/faint` |
| Field | ancho del contenedor; swatch Default (`swatch/md`); chevron `icon/md` (hacia arriba abierto) |
| Filter | ancho mínimo `layout/select-filter` (160, la flecha al extremo derecho); swatch Small (`swatch/sm`); chevron `icon/sm`; Filled con el valor en `role/body-medium` |
| Disabled | `color/text/disabled`, línea `color/border/disabled`; swatch con opacidad 0.4 (sin token) |
| Menú | select-menu debajo del campo; ancho del menú Filter `layout/select-menu-filter` (200) |
| Foco | `border/strong` en `color/border/focus`, separado 2 px |

## Pendientes

- `TODO` (diseño) En Dark, la etiqueta del Filter (`color/text/tertiary`) sobre `color/surface/faint` (filter-bar) da 4.44 de contraste (axe lo marca): mismo caso que accordion-item.
