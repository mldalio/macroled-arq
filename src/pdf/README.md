# Ficha técnica en PDF

Genera en el navegador la ficha técnica de un SKU y la abre en una pestaña nueva, en el visor de PDF del navegador (no se descarga). Diseño: `ficha_pdf · componentes` en Figma ([1907:27213](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1907-27213)). Decisión: `docs/decisiones.md`, 2026-10-06 · Ficha técnica en PDF.

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
| 1 · Portada | logo + «Ficha técnica» | Imagen principal, eyebrow, nombre (`role/display`) y SKU (`role/body-lg`) | «Macroled Arq» · `1 / N` |
| 2 en adelante | logo + nombre + SKU | Una pdf-spec-group por sección con datos | Aviso legal · `n / N` |

- Las secciones y sus etiquetas son las del acordeón de la ficha (`src/data/attributes.js`).
- Una sección no se parte entre hojas: si no entra, pasa entera a la siguiente. Una sección más alta que una hoja se corta y repite su título.
- La imagen ocupa el alto que dejan el título y el pie (FILL en Figma): si el nombre ocupa dos líneas, la imagen se achica.

## Tokens

pdfmake no lee variables CSS: los valores salen de `src/styles/print-tokens.js`, que genera `npm run tokens` (Color Light, Dimension Desktop, Type Mobile). Figma mide en px a 96 dpi; el PDF, en puntos (1 px = 0,75 pt).

## Requisitos y casos

- **Imagen:** la principal (`images.main`, de `img_main`); si falta, la de estudio. El servidor de imágenes tiene que responder con CORS; si no, o si no hay imagen, la portada muestra solo el fondo `color/bg/subtle` y avisa en consola.
- **SKU inexistente:** la pestaña se cierra; error en consola.
- **Pestaña nueva:** se abre vacía en el momento del clic (si se abriera después, el navegador la bloquearía como ventana emergente) y muestra el PDF cuando está listo. Si el navegador la bloquea igual, el PDF se descarga como `ficha-tecnica-<sku>.pdf`. Si hay un error, la pestaña se cierra.
- Guardar desde el visor usa el nombre que pone el navegador, no el del producto.
- Dos clics seguidos sobre el mismo SKU abren una sola pestaña.

## TODO

- (diseño) Mensaje de error si no se puede generar (hoy: la pestaña se cierra y queda en consola).
- (datos) Imágenes en Typesense y CORS de S3, sin probar con datos reales.
