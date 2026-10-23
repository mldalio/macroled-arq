# search-field · `<arq-search-field>`

Campo de búsqueda. En Desktop va en el navbar con la cruz que cierra la búsqueda; en Mobile, dentro de search-screen, sin cruz.

- Figma: [795-2179](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=795-2179) · ficha `doc/search-field`

```html
<arq-search-field show-close></arq-search-field>
```

## Props

| Figma | Atributo | Prop JS | Valores · por defecto |
| --- | --- | --- | --- |
| Size | `size` | `size` | `default` · `medium` · `large` (ver abajo) |
| Show icon | `show-icon` | `showIcon` | booleano: la lupa a la izquierda en Type=Box (en Line va siempre) |
| Show clear | `show-clear` | `showClear` | booleano: con texto, una cruz a la derecha borra lo escrito (`arq:input` con valor vacío; el foco vuelve al campo). No es la cruz de Show close |
| Show close | `show-close` | `showClose` | booleano. **En Figma viene en `true`; en código hay que escribirlo** |
| State | — | — | Empty y Filled salen del valor; Focus es `:focus-within` |
| — | `value` | `value` | Texto buscado |
| — | `placeholder` | `placeholder` | Por defecto "Buscar productos…" |
| — | `label` | `label` | Nombre accesible. Por defecto "Buscar productos" |
| — | `active-label` | `activeLabel` | Resultado activo, se anuncia en `aria-live` (lo pone el navbar) |
| — | `status` | `status` | Cantidad de resultados, «sin resultados» o error; se anuncia en otra región `aria-live`, siempre presente y vacía al inicio (lo pone el navbar) |
| — | `combobox` | `combobox` | booleano (solo de código): el campo abre una lista de resultados. El input pasa a `role="combobox"` con `aria-autocomplete="list"` |
| — | `expanded` | `expanded` | booleano: la lista está a la vista (`aria-expanded`, con `combobox`) |

- **Eventos:** `arq:input { value }` al escribir, `arq:submit { value }` con Enter, `arq:navigate { step }` con ↑ / ↓ y `arq:close` con la cruz.
- El foco del campo se marca solo con el borde (`color/border/focus`), como el set: sin anillo separado (excepción a DESIGN §7; el cursor y el borde ya lo marcan).
- Con `prefers-contrast: more`, la caja y la línea pasan a `color/border/strong` (`color/border/default` no llega a 3:1).

## Tokens

| Parte | Token |
| --- | --- |
| Campo | fondo `color/surface/default`, borde `border/default` en `color/border/default` (Focus `color/border/focus`) |
| Padding · gap | `space/gap/sm` × `space/padding/md` (derecha `space/padding/xs` con la cruz) · `space/gap/md` |
| Texto | `role/body` (`size="large"`: `role/heading-3-light`): valor `color/text/primary`, placeholder `color/text/tertiary` |

## Pendientes

- `TODO` (a11y) Los resultados viven en otro Shadow DOM y `aria-activedescendant` y `aria-controls` no lo cruzan: con `combobox` el campo no los lleva, y el activo se anuncia con `aria-live`. Revisar con lector de pantalla.

## Type (solo de código)

`type="box"` (por defecto, el campo con borde del navbar) o `type="line"`: sin caja, lupa a la izquierda y línea inferior `color/border/default` (en foco, `color/border/focus`). Lo usa el [search-sheet](../search-sheet/README.md). No está en Figma (TODO).

## Size

| Size | Lo escrito | Placeholder | Dónde |
| --- | --- | --- | --- |
| `default` | `role/body` | `role/body` | navbar `search="inline"`, compare-picker |
| `medium` | `role/body-xl` (20/28 · 16/24 en Mobile) | Light, como `role/body-xl-light` | Descargas (variants-table Catalog), con `show-icon show-clear` |
| `large` | `role/heading-3` (24/32 · 20/28 en Mobile) | Light, como `role/heading-3-light` | Búsqueda del navbar (search-sheet), con `show-clear` |

Lo que se escribe se destaca frente a los resultados y el placeholder va un peso menos. `::placeholder` no acepta una clase `role-*`: toma el peso del rol Light (tamaño e interlineado son los mismos). Con `type="box"` la caja crece con el texto. En Figma: `Size`, `Show icon` y `Show clear` de los sets search-field y search-field-line. `docs/decisiones.md`, 2026-10-21 · Buscador: texto grande.
