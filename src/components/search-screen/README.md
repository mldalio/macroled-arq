# search-screen · `<arq-search-screen>`

Búsqueda en Mobile, a pantalla completa: volver + search-field (sin cruz) y los resultados debajo.

- Figma: [796-2351](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=796-2351) · ficha `doc/search-screen`

```html
<arq-search-screen>
  <arq-search-result href="…">…</arq-search-result>
  <arq-search-see-all …></arq-search-see-all>
</arq-search-screen>
```

```js
screen.show(botonLupa); // el foco vuelve a botonLupa al cerrar
```

## Props

| Figma | Atributo / slot | Prop JS | Valores |
| --- | --- | --- | --- |
| State | slot por defecto | — | Empty (sin contenido), Results (search-result + search-see-all) o No results (`arq-search-dropdown state="no-results"`). Lo decide el contenido |
| — | `open` | `open` | booleano. Mejor `show(opener)` y `close()` |
| — | `label` | `label` | Nombre del diálogo. Por defecto "Buscar" |

- **Diálogo modal nativo** (`<dialog>` + `showModal()`): el foco arranca en el campo y queda adentro. Volver o Esc cierran y emiten `arq:close`.
- Los eventos del campo (`arq:input`, `arq:submit`, `arq:navigate`) salen del componente; `field` devuelve el search-field.
- Los resultados llevan `layout/gutter` a los lados (variable local `--search-inline`).

## Tokens

| Parte | Token |
| --- | --- |
| Pantalla | fondo `color/surface/default` |
| Barra | padding `space/gap/md` × `layout/gutter`, gap `space/gap/sm`, línea inferior `color/border/subtle` |
