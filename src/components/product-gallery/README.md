# product-gallery · `<arq-product-gallery>`

Galería del hero de la ficha: imagen principal (5:4) + fila de `arq-gallery-thumb`. Elegir una miniatura la muestra en grande, sin recargar.

- Figma: [920-2490](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=920-2490) · ficha `doc/product-gallery` (`1463:10376`)

```html
<!-- En el embed de la ficha: la imagen principal del CMS (LCP) -->
<arq-product-gallery>
  <img slot="image" src="https://…/kanu-jardin.jpg" alt="Kanu Jardín" fetchpriority="high">
</arq-product-gallery>
```

```js
// Desde src/data/, con las imágenes del SKU elegido (la primera es la principal)
gallery.images = [
  { src: '…/main.jpg', srcOn: '…/main-on.jpg', alt: 'Kanu Jardín' },
  { src: '…/ambient-1.jpg', srcOn: '…/ambient-1-on.jpg', alt: 'Kanu Jardín en un jardín' },
  { src: '…/detail-1.jpg', alt: 'Kanu Jardín, detalle' },
];
```

## Props y slots

| Figma | Atributo / slot | Prop JS | Valores |
| --- | --- | --- | --- |
| image | slot `image` | — | Un `<img>` con la imagen principal. Va en el HTML del embed: es el LCP (`fetchpriority="high"`, sin `loading="lazy"`). Si no viene, el componente crea uno con la primera de `images` |
| thumbs | — | `images` | Lista `{ src, srcOn?, alt }` (solo JS). La primera es la principal. Al cambiarla (otra variante) vuelve a la primera. Con menos de dos no hay miniaturas |
| Breakpoint | — | — | Media query: hasta 767 px es Mobile |

- **Métodos:** `select(index)` muestra en grande la imagen `index`.
- **Miniaturas:** un `<button>` cada una; se recorren con Tab y la elegida lleva `aria-current="true"` (cierra el TODO de gallery-thumb). El nombre de cada una es su `alt`.
- **Desktop:** las miniaturas van sobre la imagen, abajo a la izquierda, a `space/padding/lg` del borde. **Mobile:** debajo, separadas por `space/gap/sm`.
- **Si no entran,** la fila se desliza (scroll-snap, sin barra visible; decisión 2026-10-02 · Galerías). Con Tab, la miniatura con foco entra sola en la vista.
- **Iluminar:** dentro de un bloque con `data-arq-theme="dark"` (en la ficha, la sección hero), la imagen grande y las miniaturas usan `srcOn`; si falta, la apagada. Lo detecta `src/base/theme.js` cuando cambia el atributo; la página no tiene que avisar.
- **Sin imagen:** queda el fondo `color/surface/subtle`.

## Tokens

| Parte | Token |
| --- | --- |
| Imagen principal | `ratio/landscape` (5:4), fondo `color/surface/subtle`, `radius/control` |
| Gap imagen–miniaturas (Mobile) · entre miniaturas | `space/gap/sm` |
| Ancho de miniatura | `layout/gallery-thumb` (105 Desktop · 76 Mobile); el alto sale de 5:4 |
| Separación de las miniaturas al borde (Desktop) | `space/padding/lg` |
| Lugar para el anillo de foco dentro de la fila | `space/padding/xs` |

## Pendientes

- `TODO` (diseño) En Figma las miniaturas están a 20 del borde de la imagen y no hay token: se usa `space/padding/lg` (decisión 2026-10-02).
- Orden de `images`: main, ambient_1, front, back, left, right, pers_1, pers_2, detail_1, detail_2 (las que existen), con `srcOn` desde su versión `_on` (`docs/typesense-schema.md`). Con `images` vacía (variante sin fotos), la imagen grande se oculta y se ve el fondo del marco; antes de recibir `images` no se oculta la del HTML.
- `TODO` (datos) Los `alt` todavía no tienen campo.
- En Mobile el alto de la miniatura sale 61 (76 × 4/5); en Figma es 60.
