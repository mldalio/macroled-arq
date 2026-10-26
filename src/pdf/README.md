# Ficha técnica en PDF

Genera en el navegador la ficha técnica de un SKU y la abre en una pestaña nueva, en el visor de PDF del navegador (no se descarga). Diseño: componentes `pdf-*` en «11 · Ficha PDF» de la página Componentes ([1907:8278](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1907-8278)). Decisiones: `docs/decisiones.md`, 2026-10-06 · Ficha técnica en PDF y 2026-10-23 · Ficha técnica: una hoja menos.

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

- **pdf-cover:** foto cuadrada de `layout/pdf-cover-image`, entera (contain) sobre `color/surface/subtle`; al lado, nombre (`role/display`), SKU (`role/body-lg`) y, alineados con el pie de la foto, los datos clave. Si el nombre ocupa muchas líneas, el bloque crece.
- **Datos clave:** hasta cuatro, según el producto (`KEY_DATA` y `keyData()` en `src/data/attributes.js`): los primeros que el SKU tiene cargados de Potencia, Flujo, Protección (solo desde IP44), Temperatura, CRI y Ángulo. Sin ninguno, la fila no se muestra.
- Las secciones y sus etiquetas son las del acordeón de la ficha (`src/data/attributes.js`).
- Una sección no se parte entre hojas: si no entra, pasa entera a la siguiente. Una sección más alta que una hoja se corta y repite su título.
- Pie sin aviso legal: solo el paginado.

## Tokens

pdfmake no lee variables CSS: los valores salen de `src/styles/print-tokens.js`, que genera `npm run tokens` (Color Light, Dimension Desktop, Type Mobile). Figma mide en px a 96 dpi; el PDF, en puntos (1 px = 0,75 pt).

## Requisitos y casos

- **Imagen:** la principal (`images.main`, primera foto de `multimagen_producto`); si falta, la de estudio. S3 (`s3.coresagroup.com`) no manda CORS: la foto se pide al CloudFront que sirve los mismos archivos con CORS, en JPEG y al tamaño de la hoja (`config.images.pdfBase`), como la ficha de macroled.com.ar. Si no hay foto o el archivo no existe, pdf-cover muestra solo el fondo `color/surface/subtle` y avisa en consola.
- **SKU inexistente:** la pestaña se cierra; error en consola.
- **Pestaña nueva:** se abre vacía en el momento del clic (si se abriera después, el navegador la bloquearía como ventana emergente) y muestra el PDF cuando está listo. Si el navegador la bloquea igual, el PDF se descarga como `ficha-tecnica-<sku>.pdf`. Si hay un error, la pestaña se cierra.
- Guardar desde el visor usa el nombre que pone el navegador, no el del producto.
- Dos clics seguidos sobre el mismo SKU abren una sola pestaña.

## TODO

- (diseño) Mensaje de error si no se puede generar (hoy: la pestaña se cierra y queda en consola).
- (datos) Al 2026-10-23, de 170 SKU: 58 con la foto principal subida, 38 con el archivo faltante en S3 y 74 sin foto en la base. Esos salen sin foto.
