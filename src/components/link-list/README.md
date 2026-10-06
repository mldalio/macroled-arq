# link-list · `<arq-link-list>`

Lista corta de links con título. Se usa en "Recursos técnicos" de Contacto.

- Figma: [1303-4377](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1303-4377) · ficha `doc/link-list`

```html
<arq-link-list>
  <span slot="title">Recursos técnicos</span>
  <arq-button type="underline" show-underline show-icon icon="arrow-right" href="/arq/descargas">Centro de descargas</arq-button>
</arq-link-list>
```

## Props

| Figma | Atributo / slot | Prop JS | Valores |
| --- | --- | --- | --- |
| Title | slot `title` | — | Título del grupo. También es el nombre del `<nav>` |
| — (links) | slot por defecto | — | `arq-button` Underline con `show-underline`, `show-icon` e `icon="arrow-right"` |
| Show link 3 | — | — | No es prop: la cantidad es libre (la ficha recomienda 2 o 3) |

- Es un `<nav>` con una lista: cada link lleva `role="listitem"`.
- Una descarga lleva el tipo y el peso en el texto ("Catálogo PDF · 8 MB").

## Tokens

| Parte | Token |
| --- | --- |
| Título | `role/label` en `color/text/tertiary` |
| Separación | `space/gap/md` entre el título y los links y entre links, como el set (la ficha dice `space/gap/sm` entre links) |
