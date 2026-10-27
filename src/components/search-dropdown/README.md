# search-dropdown · `<arq-search-dropdown>`

Resultados de la búsqueda en Desktop, debajo de search-field y con su mismo ancho.

- Figma: [796-2271](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=796-2271) · ficha `doc/search-dropdown`

```html
<arq-search-dropdown term="kanu">
  <arq-search-result href="…">Kanu Jardín<span slot="meta">KANU-J-…</span></arq-search-result>
  <arq-search-see-all href="/arq/productos?q=kanu" term="kanu" count="12"></arq-search-see-all>
</arq-search-dropdown>
<arq-search-dropdown state="no-results" term="lámpara roja"></arq-search-dropdown>
```

## Props

| Figma | Atributo / slot | Prop JS | Valores · por defecto |
| --- | --- | --- | --- |
| State | `state` | `state` | `results` · `no-results` · `error` (def. `results`). `error`: la búsqueda falló; mismo dibujo que No results con «No se pudo completar la búsqueda.» y «Probá de nuevo en unos minutos.» (State=Error, 2924:44879) |
| — (resultados) | slot por defecto | — | `arq-search-result` (hasta 5) y `arq-search-see-all` |
| — | `term` | `term` | Término (para el mensaje sin resultados) |

- **No results:** «No encontramos resultados para «término».» (`role/heading-2`), ayuda «Probá con otro nombre, revisá la ortografía o buscá por SKU.» (`role/body-regular`, `color/text/tertiary`), sin caja ni línea como en Descargas, y un button Underline con flecha, «Todos los productos» (`categoryHref`). El vacío de Descargas (variants-table) usa el mismo título y «Probá con otro nombre o SKU, o con una parte del código.»
- `TODO` (diseño): este vacío cambió respecto del set de Figma (que tenía un solo link «Explorá nuestros productos»); actualizar el set.
- Con el campo vacío no se muestra (lo oculta el navbar). Se cierra con Esc o un clic afuera.
- El ancho lo pone el contenedor: `layout/search-field` en el navbar.

## Tokens

| Parte | Token |
| --- | --- |
| Caja | fondo `color/surface/default`, borde `border/default` en `color/border/subtle` |
| Sin resultados | padding `space/padding/md`, gap `space/gap/sm`; link con padding `space/padding/sm` × `space/padding/md` y línea superior `color/border/subtle` |
