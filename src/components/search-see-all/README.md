# search-see-all · `<arq-search-see-all>`

Última fila de los resultados: lleva a la página con todos los resultados.

- Figma: [795-2206](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=795-2206) · ficha `doc/search-see-all`

```html
<arq-search-see-all href="/arq/buscar?q=kanu" term="kanu" count="12"></arq-search-see-all>
```

## Props

| Figma | Atributo | Prop JS | Valores |
| --- | --- | --- | --- |
| — | `term` | `term` | Término buscado |
| — | `count` | `count` | Total de resultados |
| — | `href` | `href` | Página de resultados (`/arq/buscar?q=`) |

- Texto "Ver todos los resultados (N) para “término”" en `role/body-sm` y `color/text/tertiary`; el término en `role/body-sm-medium` y `color/text/primary` (el set usa Medium; la descripción dice SemiBold: manda el set).
- Hover: fondo `color/surface/hover`. Focus: anillo hacia adentro. No se muestra sin resultados.

## Tokens

| Parte | Token |
| --- | --- |
| Fila | padding `space/gap/sm` × `space/padding/md`, gap `space/gap/md` |
| Íconos | `icon/md` en `color/icon/tertiary` |
