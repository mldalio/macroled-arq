# search-collection · `<arq-search-collection>` (prueba)

Resultado de búsqueda de una **colección**, más llamativo que search-result: imagen grande (`ratio/landscape`), etiqueta «Colección», nombre en `role/heading-3` y flecha. Va en el slot `results` del [search-sheet](../search-sheet/README.md).

> **Componente de prueba: no existe en Figma** (TODO diseño).

```html
<arq-search-collection href="/arq/coleccion/kanu" image="…">Kanu</arq-search-collection>
```

| Atributo / slot | Valores |
| --- | --- |
| slot por defecto | Nombre de la colección |
| `href` | Destino. Toda la tarjeta es un link |
| `image` | Foto. Sin imagen, fondo `color/surface/subtle` |
| `active` | booleano · elegido con ↑ / ↓ (lo pone el navbar) |

- Hover y Active: nombre subrayado y flecha un paso a la derecha (`transform`). Focus: anillo separado (`color/border/focus`, offset 2).
- Mismo contrato que search-result para el navbar: `active` y `click()`.

## Tokens

Imagen `ratio/landscape`, gap `space/gap/md`, etiqueta `role/label` en `color/text/tertiary`, nombre `role/heading-3`, flecha `icon/xl`, subrayado `border/default`.
