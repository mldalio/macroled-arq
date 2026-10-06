# select · `<arq-select>`

Selector con menú desplegable (select-menu). Field y Filter se construyen igual: etiqueta arriba (sin gap) y un trigger con línea inferior; solo cambian el ancho, el tamaño de la muestra y del chevron, y el valor Filled. Type=Field: campo del configurador y de compare-product. Type=Filter: celda de filter-bar y del glosario ("Todos" primero).

- Figma: [921-2544](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=921-2544) · ficha `doc/select`

```html
<arq-select label="Acabado" value="Negro" show-swatch></arq-select>
<arq-select type="filter" label="Acabado" name="color_carcasa"></arq-select>
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
| Label | `label` | `label` | Etiqueta visible (`role/label-sm`) arriba del campo, siempre, en los dos Type y en cualquier State (incluido Disabled) |
| Name (Field) · Value (Filter) | `value` | `value` | Valor elegido; el texto que se ve sale de la opción. Filter sin valor = "Todos" |
| — (opciones) | — | `options` | Lista `{ value, label?, swatch?, showSwatch?, disabled? }` (solo JS). La muestra solo se ve si la opción trae `swatch` o `showSwatch` (acabado/color, p. ej. color de carcasa); el resto queda solo texto. `TODO` (diseño): falta definir qué campos cuentan como "color" |
| Show swatch | `show-swatch` | `showSwatch` | booleano. Muestra la muestra de color en todas las opciones (sin imagen, el neutro de swatch). En Figma viene activada; en código va desactivada por defecto (atributo de presencia). Una opción puede apagarla con `showSwatch: false` |
| State=Disabled | `disabled` | `disabled` | booleano |
| Open | `open` | `open` | booleano. Mejor `show()` y `close()` |
| State=Filled | `filled` | `filled` | Lo pone el componente: Filter con un valor elegido |
| — | `name` | `name` | Campo al que corresponde (lo usa filter-bar para armar los filtros) |
| — | `all-label` | `allLabel` | Texto de la primera opción de Filter. Por defecto "Todos" |

- **No son props:** State=Hover y State=Focus (CSS).
- **Las opciones las arma el componente** (decisión 2026-10-02 · glosario): el campo y la lista quedan en el mismo Shadow DOM y funciona el patrón de select de un valor (`role="combobox"` + `role="listbox"` con `aria-activedescendant`). El foco queda siempre en el campo.
- **Teclado:** cerrado, flechas, Enter, Espacio, Inicio, Fin o una letra abren. Abierto: flechas, Inicio y Fin mueven la opción resaltada (saltean las deshabilitadas), una letra salta a la primera que empieza así, Enter o Espacio eligen, Esc cierra y Tab cierra sin elegir. Clic afuera cierra.
- **Evento:** `arq:change { value }` al elegir un valor distinto.
- **Misma construcción en los dos Type** (cambio de 2026-10-06): reposo en `role/body-regular`, Hover y Open con fondo `color/surface/faint` y el texto sin cambios; solo el valor elegido de Filter (Filled) va en `role/body-medium`. El gap entre la etiqueta y el campo es 0: la separación es el padding vertical del trigger.
- **Focus:** anillo `border/strong` en `color/border/focus` separado 2 px (DESIGN.md §7). En Figma el anillo se dibuja pegado, por limitación de la herramienta.

## Tokens

| Parte | Token |
| --- | --- |
| Trigger (los dos Type) | línea inferior `border/default` en `color/border/strong`; padding vertical `space/padding/sm-md` (se descuenta la línea: el campo mide 48), sin padding lateral; gap `space/gap/sm-md`; texto `role/body-regular` |
| Etiqueta | `role/label-sm` en `color/text/tertiary`, sin gap con el trigger |
| Hover y Open | `color/surface/faint` |
| Field | ancho del contenedor; swatch Default (`swatch/md`); chevron `icon/md` (hacia arriba abierto) |
| Filter | ancho mínimo `layout/select-filter` (160, la flecha al extremo derecho); swatch Small (`swatch/sm`); chevron `icon/sm`; Filled con el valor en `role/body-medium` |
| Disabled | `color/text/disabled`, línea `color/border/disabled`; swatch con opacidad 0.4 (sin token) |
| Menú | select-menu debajo del campo; ancho del menú Filter `layout/select-menu-filter` (200) |
| Foco | `border/strong` en `color/border/focus`, separado 2 px |

## Pendientes

- `TODO` (diseño) En Dark, la etiqueta del Filter (`color/text/tertiary`) sobre `color/surface/faint` (filter-bar) da 4.44 de contraste (axe lo marca): mismo caso que accordion-item.
