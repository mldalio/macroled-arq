# search-result · `<arq-search-result>`

Fila de resultado de búsqueda: miniatura, nombre, SKU y flecha. Va dentro de search-dropdown o search-screen.

- Figma: [789-3045](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=789-3045) · ficha `doc/search-result`

```html
<arq-search-result href="/arq/producto/kanu-jardin" image="…">
  Kanu Jardín<span slot="meta">KANU-J-500-12W-N-WW</span>
</arq-search-result>
```

## Props

| Figma | Atributo / slot | Prop JS | Valores |
| --- | --- | --- | --- |
| Name | slot por defecto | — | Nombre del producto o colección |
| Meta | slot `meta` | — | SKU (o "Colección") |
| Show image | `image` | `image` | URL de la miniatura. Sin imagen no hay miniatura |
| State=Active | `active` | `active` | booleano · elegido con ↑ / ↓ (lo pone el navbar) |
| — | `href` | `href` | Destino |

- Es un link. Hover y Active: fondo `color/surface/hover`. Focus: anillo hacia adentro.
- En search-screen el padding lateral es `layout/gutter` (variable local `--search-inline` del contenedor).

## Tokens

| Parte | Token |
| --- | --- |
| Fila | padding `space/gap/sm` × `space/padding/md`, gap `space/gap/md`, línea inferior `color/border/subtle` |
| Miniatura | `layout/search-thumb` (token nuevo, 48), fondo `color/surface/subtle` |
| Textos | nombre `role/body-strong` en `color/text/primary` · meta `role/body-sm` en `color/text/tertiary`, gap `space/gap/xs` |
| Flecha | `icon/md` en `color/icon/primary` |
