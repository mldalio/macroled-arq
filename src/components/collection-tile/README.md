# collection-tile · `<arq-collection-tile>`

Tarjeta de colección del mosaico de Home v2: foto, kicker, nombre y flecha. Toda la tarjeta lleva a la colección. En hover (Desktop) aparece la bajada y la foto hace un zoom leve (`scale(1.05)`), igual que las cards de Explorar por espacio. El cursor es el de enlace (`pointer`).

- Figma: Home v2 `2063:29997` (y el símbolo de collection tile en `2030`)

```html
<arq-collection-tile href="/arq/coleccion/kanu" featured>
  <img slot="image" src="…" alt="" loading="lazy">
  <span slot="label">Línea exterior</span>
  <h3 slot="name">Kanu</h3>
  <span slot="description">Balizas de líneas puras…</span>
  <span slot="tag">Destacada</span>
</arq-collection-tile>
```

## Props

| Figma | Atributo / slot | Valores · por defecto |
| --- | --- | --- |
| — | `href` | destino de la tarjeta |
| tag | `featured` + slot `tag` | con `featured` se muestra el tag. Texto def. "Destacada" |
| kicker | slot `label` | `role/label` sobre la foto |
| name | slot `name` | un `<h3>` en `role/heading-2` |
| description | slot `description` | bajada sobre la foto; en Desktop solo en hover |
| — | flecha | `arrow-up-right` en `icon/xl` (24), Inverse |
| image | slot `image` | foto a sangre |

No confundir con line-card (texto debajo de la foto) ni category-card.
