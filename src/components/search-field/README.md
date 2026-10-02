# search-field · `<arq-search-field>`

Campo de búsqueda. En Desktop va en el navbar con la cruz que cierra la búsqueda; en Mobile, dentro de search-screen, sin cruz.

- Figma: [795-2179](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=795-2179) · ficha `doc/search-field`

```html
<arq-search-field show-close></arq-search-field>
```

## Props

| Figma | Atributo | Prop JS | Valores · por defecto |
| --- | --- | --- | --- |
| Show close | `show-close` | `showClose` | booleano. **En Figma viene en `true`; en código hay que escribirlo** |
| State | — | — | Empty y Filled salen del valor; Focus es `:focus-within` |
| — | `value` | `value` | Texto buscado |
| — | `placeholder` | `placeholder` | Por defecto "Buscar productos…" |
| — | `label` | `label` | Nombre accesible. Por defecto "Buscar productos" |
| — | `active-label` | `activeLabel` | Resultado activo, se anuncia en `aria-live` (lo pone el navbar) |

- **Eventos:** `arq:input { value }` al escribir, `arq:submit { value }` con Enter, `arq:navigate { step }` con ↑ / ↓ y `arq:close` con la cruz.
- El foco del campo se marca con el borde (`color/border/focus`), como el set.

## Tokens

| Parte | Token |
| --- | --- |
| Campo | fondo `color/surface/default`, borde `border/default` en `color/border/default` (Focus `color/border/focus`) |
| Padding · gap | `space/gap/sm` × `space/padding/md` (derecha `space/padding/xs` con la cruz) · `space/gap/md` |
| Texto | `role/body`: valor `color/text/primary`, placeholder `color/text/tertiary` |

## Pendientes

- `TODO` (a11y) Los resultados viven en otro Shadow DOM y `aria-activedescendant` no lo cruza: el activo se anuncia con `aria-live`. Revisar con lector de pantalla.
