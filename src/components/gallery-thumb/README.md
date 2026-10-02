# gallery-thumb · `<arq-gallery-thumb>`

Miniatura de la galería de producto, proporción 5:4. Elegirla muestra la imagen grande en product-gallery. Selected marca la imagen que se está viendo.

- Figma: [920-2474](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=920-2474) · ficha `doc/gallery-thumb` (`1463:10579`)

```html
<arq-gallery-thumb src="https://…/kanu-1.jpg" alt="Kanu Jardín, vista frontal" selected></arq-gallery-thumb>
<arq-gallery-thumb src="https://…/kanu-2.jpg" alt="Kanu Jardín, detalle del difusor"></arq-gallery-thumb>
```

## Props

| Figma | Atributo | Prop JS | Valores |
| --- | --- | --- | --- |
| State=Selected | `selected` | `selected` | booleano · `aria-current="true"` |
| — (imagen del fill) | `src` | `src` | URL de la imagen (de los datos). Sin imagen queda `color/surface/subtle` |
| — | `alt` | `alt` | descripción de la imagen; es el nombre del botón. Si falta, avisa en consola |

- Hover y Focus son CSS. Es un `<button>`: product-gallery escucha el `click`, cambia la imagen grande y mueve `selected`.
- Toma el ancho que le da la galería (`layout/gallery-thumb`: 105 Desktop · 76 Mobile) y mantiene 5:4.
- La imagen se carga en diferido (`loading="lazy"`) y cubre la miniatura (`object-fit: cover`).

## Tokens

| Parte | Token |
| --- | --- |
| Fondo (sin imagen) | `color/surface/subtle` |
| Borde Hover · Selected | `border/default` en `color/border/hover` · `color/border/strong` |
| Radio | `radius/control` |
| Foco | `border/strong` en `color/border/focus`, separado 2 px |

## Pendientes

- En product-gallery se recorren con Tab, y con Iluminar también pasan a la versión encendida (decisión 2026-10-02).
- `TODO` (datos) Campos de imagen y alt en Typesense (`docs/typesense-schema.md`).
- La ficha pide `aria-pressed` y `aria-current` a la vez; se usa solo `aria-current="true"` (acordado).
