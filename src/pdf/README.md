# Ficha técnica en PDF

Genera en el navegador la ficha técnica de un SKU y la abre en una pestaña nueva, en el visor de PDF del navegador (no se descarga). Diseño: componentes `pdf-*` en «11 · Ficha PDF» de la página Componentes ([1907:8278](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1907-8278)) y la hoja con cotas «pdf · cotas A2 · 1 hoja» ([2992:45969](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=2992-45969)). Decisiones: `docs/decisiones.md`, 2026-10-06 · Ficha técnica en PDF, 2026-10-23 · Ficha técnica: una hoja menos y 2026-10-27 · Ficha técnica con cotas.

```js
// main.js ya lo engancha: cualquier componente que emita arq:datasheet { sku }.
// Deja la promesa en detail.pending (para mostrar el botón en Loading).
const detail = { sku };
this.emit('datasheet', detail);
detail.pending?.then(listo, listo);

// o directo, siempre dentro de un clic
import { openDatasheet } from '../pdf/ficha-tecnica.js';
button.addEventListener('click', () => openDatasheet('KANU-J-500-12W-N-WW'));
```

## Archivos

| Archivo | Qué hace |
| --- | --- |
| `ficha-tecnica.js` | Carga pdfmake y Albert Sans (jsDelivr, al primer clic), pide los datos a `src/data/catalog.js` (`getDatasheet`), prepara la imagen y abre el PDF |
| `ficha-tecnica-doc.js` | Arma el documento de pdfmake: hojas, encabezado, pie, secciones y paginado. No toca el DOM |

## Hojas

| Hoja | Encabezado | Contenido | Pie |
| --- | --- | --- | --- |
| 1 (pdf-page Type=Primera) | logo + «Ficha técnica» | pdf-cover y las pdf-spec-group que entran | `1 / N` |
| 2 en adelante (Type=Siguiente) | logo + nombre sobre SKU (pdf-header Type=Product) | El resto de las pdf-spec-group | `n / N` |

- **pdf-cover:** nombre (`role/heading-2`, 18 pt) y SKU (`role/body-sm`, 9 pt) a todo el ancho; debajo, a `space/gap/md`, la foto en un cuadrado de `layout/pdf-cover-image` (240) y, a `space/gap/md`, el lugar de las cotas, del mismo alto. La foto, entera sobre `color/surface/strong` (en pantalla es `color/surface/subtle`, pero ese gris no sale impreso); las cotas, enteras sobre el blanco de la hoja, sin recuadro y a `space/padding/lg` del borde de su lugar (impresas quedaban grandes). Las cotas verticales o cuadradas van en un cuadrado igual al de la foto; las horizontales se ensanchan lo que necesitan, hasta 1,5 veces la foto (`cotaWidth`). Padding vertical `space/padding/md`.
- **Cotas:** el PNG del campo `cotas_img` de cada SKU (columna de Sheets, URL completa en `MACROLED/ARQ/cotas/`). Sin dato, la foto queda sola. Al 2026-10-27, 108 de 179 documentos lo tienen; no tienen: PAR11, Sen, Kai Round, Mini Kai, Hoshi aplique y Mini Töri.
- **Sin datos clave:** pdf-cover no lleva la fila de características destacadas (pdf-key-data): esos datos ya están en las especificaciones (`docs/decisiones.md`, 2026-10-27 · Ficha técnica sin datos clave).
- **Especificaciones en dos columnas** (pdf-spec-row · 2 col): etiqueta `role/body-sm` de `layout/pdf-spec-label-compact` y valor `role/body-sm-medium` (12 px = 9 pt, el tamaño de las tablas impresas), filas con padding vertical `space/padding/sm`, título de sección `role/body-compact-medium` (10,5 pt), columnas a `space/gap/xl`, secciones a `space/gap/sm-md`. La primera mitad de las filas va a la izquierda y el resto a la derecha (se lee de arriba abajo). Es una tabla de cinco columnas, así las reglas de las dos columnas quedan a la misma altura aunque una etiqueta o un valor ocupe dos líneas.
- **Impresión:** las líneas finas (filas, encabezado, pie, pdf-cover) van en `color/border/default`: `color/border/subtle` (tinta al 10 %) no sale impreso. Márgenes de la hoja: `space/padding/xl` arriba, `space/padding/xl-2xl` a los lados y `space/padding/lg` abajo. El fondo de la foto va en `color/surface/strong` (#E0E0E0): `color/surface/subtle` (#F0F0F0, 6 % de gris) muchas impresoras no lo imprimen.
- Las secciones y sus etiquetas son las del acordeón de la ficha (`src/data/attributes.js`).
- **Una o dos hojas:** la meta es una hoja; si las especificaciones no entran, se acepta una segunda. Si una sección no entra en lo que queda de la hoja, sigue en la próxima: las filas no se parten, el título se repite arriba y nunca queda solo al pie de una hoja (`headerRows`, `keepWithHeaderRows`, `dontBreakRows`).
- Pie sin aviso legal: solo el paginado.

## Tokens

pdfmake no lee variables CSS: los valores salen de `src/styles/print-tokens.js`, que genera `npm run tokens` (Color Light, Dimension Desktop, Type Mobile). Figma mide en px a 96 dpi; el PDF, en puntos (1 px = 0,75 pt).

## Requisitos y casos

- **Imagen:** la principal (`images.main`, primera foto de `multimagen_producto`); si falta, la de estudio. S3 (`s3.coresagroup.com`) no manda CORS: la foto se pide al CloudFront que sirve los mismos archivos con CORS, en JPEG y al tamaño de la hoja (`config.images.pdfBase`), como la ficha de macroled.com.ar. Si no hay foto o el archivo no existe, pdf-cover muestra solo el fondo `color/surface/strong` y avisa en consola.
- **Cotas:** por el mismo CloudFront, en PNG (el JPEG ensucia las líneas finas) y a 4 × los px de Figma, para que las medidas en letra chica se lean impresas. Si no carga, la ficha sale sin las cotas y avisa en consola.
- **Si no se puede generar** (SKU inexistente, pdfmake o la fuente no cargan): la pestaña se cierra, el error queda en consola y quien la pidió muestra `form-message` Tone=Error «No se pudo generar la ficha técnica. Probá de nuevo.» debajo del botón (ficha) o de la ficha técnica en el modal (glosario y Descargas). Se borra al volver a intentar. En la demo: `?data=datasheet-error`.
- **Pestaña nueva:** se abre vacía en el momento del clic (si se abriera después, el navegador la bloquearía como ventana emergente) y muestra el PDF cuando está listo. Si el navegador la bloquea igual, el PDF se descarga como `ficha-tecnica-<sku>.pdf`. Si hay un error, la pestaña se cierra.
- Guardar desde el visor usa el nombre que pone el navegador, no el del producto.
- Dos clics seguidos sobre el mismo SKU abren una sola pestaña.

## TODO

- (datos) Al 2026-10-23, de 170 SKU: 58 con la foto principal subida, 38 con el archivo faltante en S3 y 74 sin foto en la base. Esos salen sin foto.
- (datos) `FUJI_12W.png` dibuja la Fuji de 7 W (Ø7 × 10 cm) y es el `cotas_img` de `FUJI-A-7W`: conviene renombrarlo y cambiar la celda.
- (datos) PAR11 tiene dibujo (`PAR11.png`) pero sus 5 SKU no lo tienen cargado en `cotas_img`.
- (diseño) El código se apartó de la hoja de Figma (2992:45969) por pedido de Lau: nombre arriba, imágenes cuadradas, cotas sin borde que se ensanchan hasta 1,5 veces la foto y textos de impresión. En Figma ya están la variable (`layout/pdf-cover-image` = 240), los componentes pdf-cover, pdf-cover-title y pdf-spec-row · 2 col y la hoja de ejemplo.
