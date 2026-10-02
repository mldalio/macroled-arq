# select · `<arq-select>`

Selector con menú desplegable (select-menu). Type=Field: campo del configurador (muestra + nombre). Type=Filter: celda de filter-bar (etiqueta + valor; "Todos" primero).

- Figma: [921-2544](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=921-2544) · ficha `doc/select`

```html
<arq-select label="Acabado" value="Negro"></arq-select>
<arq-select type="filter" label="Acabado" name="color_de_carcasa"></arq-select>
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
| Label | `label` | `label` | Filter: etiqueta visible (`role/label-sm`). Field: nombre accesible |
| Name (Field) · Value (Filter) | `value` | `value` | Valor elegido; el texto que se ve sale de la opción. Filter sin valor = "Todos" |
| — (opciones) | — | `options` | Lista `{ value, label?, swatch?, showSwatch?, disabled? }` (solo JS) |
| State=Disabled | `disabled` | `disabled` | booleano |
| Open | `open` | `open` | booleano. Mejor `show()` y `close()` |
| State=Filled | `filled` | `filled` | Lo pone el componente: Filter con un valor elegido |
| — | `name` | `name` | Campo al que corresponde (lo usa filter-bar para armar los filtros) |
| — | `all-label` | `allLabel` | Texto de la primera opción de Filter. Por defecto "Todos" |

- **No son props:** State=Hover y State=Focus (CSS).
- **Las opciones las arma el componente** (decisión 2026-10-02 · glosario): el campo y la lista quedan en el mismo Shadow DOM y funciona el patrón de select de un valor (`role="combobox"` + `role="listbox"` con `aria-activedescendant`). El foco queda siempre en el campo.
- **Teclado:** cerrado, flechas, Enter, Espacio, Inicio, Fin o una letra abren. Abierto: flechas, Inicio y Fin mueven la opción resaltada (saltean las deshabilitadas), una letra salta a la primera que empieza así, Enter o Espacio eligen, Esc cierra y Tab cierra sin elegir. Clic afuera cierra.
- **Evento:** `arq:change { value }` al elegir un valor distinto.
- Donde la descripción difiere del set se sigue al set: Hover del Field en `color/surface/faint` (la descripción dice `surface/subtle`); valor del Filter en `role/body-medium` y Hover en `color/text/tertiary`.

## Tokens

| Parte | Token |
| --- | --- |
| Field | `color/surface/soft` con línea inferior `border/default` en `color/border/strong`; padding `space/padding/sm-md` × `space/padding/md`; gap `space/gap/md`; swatch Large; nombre `role/body-regular`; chevron `icon/md` (hacia arriba abierto) |
| Field Hover | `color/surface/faint` |
| Filter | etiqueta `role/label-sm` en `color/text/tertiary`; valor `role/body-medium`; chevron `icon/sm`; gap y padding inferior `space/gap/xs` · `space/padding/xs` |
| Filter Filled | gap `space/gap/sm`, padding inferior `space/padding/sm`, línea inferior `color/border/strong`; swatch Small si es un acabado |
| Disabled | `color/text/disabled`, línea `color/border/disabled` |
| Menú | select-menu debajo del campo (Filter a `space/gap/sm`) |
| Foco | `border/strong` en `color/border/focus`, separado 2 px |

## Pendientes

- `TODO` (diseño) En Dark, la etiqueta del Filter (`color/text/tertiary`) sobre `color/surface/faint` (filter-bar) da 4.44 de contraste (axe lo marca): mismo caso que accordion-item.
