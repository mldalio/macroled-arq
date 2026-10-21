# search-card · `<arq-search-card>` (prueba)

Tarjeta de producto recomendado del [search-sheet](../search-sheet/README.md): **solo la imagen cuadrada y el nombre**. No lleva tipo de producto («Luminaria»), acabados ni comparar: no es una product-card.

> **Componente de prueba, documentado en Figma desde el código.** Set `search-card` en Componentes › 2 · Navegación › «Búsqueda · top sheet». Falta la revisión de diseño (TODO).

```html
<arq-search-card href="/arq/producto/kanu-jardin" image="…">Kanu Jardín</arq-search-card>
```

| Atributo / slot | Valores |
| --- | --- |
| slot por defecto | Nombre del producto |
| `href` | Destino. Toda la tarjeta es un link |
| `image` | Imagen de estudio. Sin imagen queda el recuadro `color/surface/subtle` |

- Imagen `ratio/square` (1:1) por defecto; el search-sheet la pasa a `ratio/landscape` (5:4) con `--card-ratio`, y más ancha si el alto de la pantalla no alcanza.
- Hover y Focus: zoom de la imagen, recortada por el recuadro (`motion/duration/slow` con `motion/easing/standard`; sin zoom con `prefers-reduced-motion`). `TODO` (prueba): 1,1, más notorio que `motion/scale/hover` (1,05); falta decidir el token. No cambia la imagen ni responde a Iluminar (eso es de product-card).
- State: Hover y Focus salen de `:hover` y `:focus-visible`.

## Tokens

Gap imagen–nombre `space/gap/sm`, nombre `role/body-regular` en `color/text/primary`, fondo de la imagen `color/surface/subtle`, foco con anillo separado (`color/border/focus`, offset 2).
