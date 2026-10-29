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
| — (solo de código) | `inset-thumbs` | `insetThumbs` | booleano. En Mobile la foto va a todo el ancho y la fila de miniaturas lleva el margen de página (`--page-gutter`), deslizándose de borde a borde. Lo usa la ficha (2026-10-21) |

- **Métodos:** `select(index)` muestra la imagen `index` (la misma que una flecha o un deslizamiento). `currentImage` es la foto visible.
- **Slider:** la foto principal se recorre de a una, en loop (después de la última sigue la primera). Las flechas son solo el chevron, sin caja, a la misma altura (al centro de la foto), y aparecen al pasar el mouse o con el foco del teclado. Con el dedo se desliza (scroll nativo y snap, una foto por gesto); con mouse, se arrastra. ← → con el foco en la foto, una flecha o una miniatura. Con menos de dos fotos no hay flechas.
- **Miniaturas:** un `<button>` cada una; se recorren con Tab y la elegida lleva `aria-current="true"` (cierra el TODO de gallery-thumb). El nombre de cada una es su `alt`. Siguen a la foto visible.
- **Desktop:** las miniaturas van sobre la imagen, abajo a la izquierda, a `space/padding/lg` del borde. **Mobile:** debajo, separadas por `space/gap/sm`.
- **Si no entran,** la fila se desliza (scroll-snap, sin barra visible; decisión 2026-10-02 · Galerías). Con Tab, la miniatura con foco entra sola en la vista.
- **Iluminar:** dentro de un bloque con `data-arq-theme="dark"` (en la ficha, la sección hero), la imagen grande y las miniaturas usan `srcOn`; si falta, la apagada. Lo detecta `src/base/theme.js` cuando cambia el atributo; la página no tiene que avisar.
- **Modo de flechas y miniaturas:** `setOverlayTone(name, tone)` (`name`: `prev`, `next` o `thumbs`; `tone`: `'dark'`, `'light'` o `null`) pone `data-arq-theme` en cada una. La ficha lo elige según el brillo de la foto debajo, como el del breadcrumb y el toggle Iluminar; `frame` (el recuadro de la foto) y `overlays` (los tres elementos) son para medirlo.
- **Sin imagen:** queda el fondo `color/surface/subtle`.

## Tokens

| Parte | Token |
| --- | --- |
| Imagen principal | `ratio/landscape` (5:4; la página puede pisarlo con la variable local `--gallery-ratio`, la ficha usa 4:5 en Mobile), fondo `color/surface/subtle`, `radius/control` |
| Gap imagen–miniaturas (Mobile) · entre miniaturas | `space/gap/sm` |
| Ancho de miniatura | `layout/gallery-thumb` (105 Desktop · 76 Mobile); el alto sale de 5:4 |
| Separación de las miniaturas al borde (Desktop) | `space/padding/lg` |
| Lugar para el anillo de foco dentro de la fila | `space/padding/xs` |

## Pendientes

- `TODO` (diseño) En Figma las miniaturas están a 20 del borde de la imagen y no hay token: se usa `space/padding/lg` (decisión 2026-10-02).
- `TODO` (diseño) Las flechas del slider no están en el set: son solo el chevron (`icon/xl`), sin caja, y aparecen al pasar el mouse (decisión 2026-10-28 · Galería de la ficha: slider).
- Orden de `images`: main, ambient_1, front, back, left, right, pers_1, pers_2, detail_1, detail_2 (las que existen), con `srcOn` desde su versión `_on` (`docs/typesense-schema.md`). Con `images` vacía (variante sin fotos), la imagen grande se oculta y se ve el fondo del marco; antes de recibir `images` no se oculta la del HTML.
- `TODO` (datos) Los `alt` todavía no tienen campo.
- En Mobile el alto de la miniatura sale 61 (76 × 4/5); en Figma es 60.
