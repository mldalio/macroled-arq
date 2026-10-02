# spec-list · `<arq-spec-list>`

Lista de especificaciones: una columna de `arq-spec-row` en Fill, dentro de accordion-item abierto. La cantidad de filas es libre (salen de los datos del SKU elegido).

- Figma: [922-2500](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=922-2500) · ficha `doc/spec-list` (`1462:8935`)

```html
<arq-spec-list>
  <arq-spec-row><span slot="label">Flujo luminoso</span>850 lm</arq-spec-row>
  <arq-spec-row><span slot="label">Temperatura de color</span>2700 K</arq-spec-row>
</arq-spec-list>
```

## Props

| Figma | Atributo | Prop JS | Valores |
| --- | --- | --- | --- |
| — (filas) | slot por defecto | — | `arq-spec-row`, cantidad libre |

- **Una columna** (decisión 2026-10-02 · accordion-item). La descripción del set dice "dos columnas"; la ficha `doc/spec-list`, el set de accordion-item y la Ficha de Final muestran una.
- **Sin Title:** la ficha lo lista como propiedad pero el set no tiene capa de título. El nombre del bloque lo da el título del accordion-item.
- Cada spec-row arma su propio `<dl>` (los `<dt>` / `<dd>` no cruzan el Shadow DOM).

## Tokens

Sin tokens propios: padding y separador vienen de spec-row (`space/padding/md`, `border/default` en `color/border/subtle`).

## Pendientes

- `TODO` (datos) Qué columnas técnicas van en cada lista y con qué etiqueta: `src/data/attributes.js`, cuando estén las columnas en `docs/typesense-schema.md`. Una fila sin valor no se muestra.
