# link-list · `<arq-link-list>`

Lista corta de links con título. Se usa en "Recursos técnicos" de Contacto.

- Figma: [1303-4377](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1303-4377) · ficha `doc/link-list`

```html
<arq-link-list>
  <span slot="title">Recursos técnicos</span>
  <arq-button type="underline" show-underline show-icon icon="arrow-up-right" href="/arq/descargas">Centro de descargas</arq-button>
</arq-link-list>
```

## Props

| Figma | Atributo / slot | Prop JS | Valores |
| --- | --- | --- | --- |
| Title | slot `title` | — | Título del grupo. También es el nombre del `<nav>` |
| — (links) | slot por defecto | — | `arq-button` Underline con `show-underline` y `show-icon`: `icon="arrow-up-right"` para descargas o destinos externos, `arrow-right` para navegación interna (descripción de button) |
| Show link 3 | — | — | No es prop: la cantidad es libre (la ficha recomienda 2 o 3) |

- Es un `<nav>` con una lista: cada link lleva `role="listitem"`.
- Una descarga lleva el tipo y el peso en el texto ("Catálogo PDF · 8 MB").

## Tokens

| Parte | Token |
| --- | --- |
| Título | `role/body-lg-regular` en `color/text/secondary` |
| Separación | `space/gap/sm` entre el título y los links y entre links, como el set |
