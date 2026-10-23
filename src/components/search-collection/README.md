# search-collection · `<arq-search-collection>` (prueba)

Resultado de búsqueda de una **colección**, discreto: miniatura muy chica y nombre. Va en el grupo «Colecciones» del [search-sheet](../search-sheet/README.md), a la derecha en Desktop; la jerarquía la llevan los productos.

> **Componente de prueba: no existe en Figma** (TODO diseño).

```html
<arq-search-collection href="/arq/productos?collection=kanu" image="…" term="ka">Kanu</arq-search-collection>
```

| Atributo / slot | Valores |
| --- | --- |
| slot por defecto | Nombre de la colección |
| `href` | Destino. Todo es un link |
| `image` | Miniatura. Sin imagen queda el recuadro gris (`color/surface/subtle`) |
| `term` | Lo que escribió el usuario, para resaltar |
| `active` | booleano · elegido con ↑ / ↓ (lo pone el navbar) |

- Nombre en `color/text/tertiary`; lo que coincide con `term`, en `color/text/primary` con más peso ([`src/base/highlight.js`](../../base/highlight.js)). Sin coincidencia, todo en tertiary. Hover, Focus y Active: todo el nombre en primary, sin cambiar el peso (DESIGN.md §6).
- Mismo contrato que search-result para el navbar: `active` y `click()`.

## Tokens

Miniatura `layout/search-thumb` (48), gap `space/gap/md`, texto `role/body-regular` (la marca, `role/body-medium`), foco con anillo separado (`color/border/focus`, offset 2).
