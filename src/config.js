// Endpoints y claves públicas. Se leen de .env (ver .env.example).
// Vite reemplaza import.meta.env al compilar: los valores quedan dentro de
// dist/arq.js. Por eso acá va solo la search-only key de Typesense.

const env = import.meta.env;

export const config = Object.freeze({
  typesense: Object.freeze({
    host: env.VITE_TYPESENSE_HOST ?? '',
    searchKey: env.VITE_TYPESENSE_SEARCH_KEY ?? '',
    collection: env.VITE_TYPESENSE_COLLECTION ?? '',
  }),
  n8n: Object.freeze({
    webhookUrl: env.VITE_N8N_WEBHOOK_URL ?? '',
  }),
  // Imágenes de los acabados (docs/acabados.md): PNG de 128 × 128 en el servidor
  // de imágenes de la empresa, un archivo por acabado (`acabado-<slug>.png`).
  // Termina en «/». VITE_FINISHES_BASE_URL la pisa (pruebas con otro servidor).
  images: Object.freeze({
    finishesBase: env.VITE_FINISHES_BASE_URL ?? 'https://s3.coresagroup.com/MACROLED/ARQ/imagenes/acabados/',
    // Copia chica de una foto para leer sus píxeles (brillo debajo del toggle
    // Iluminar de la ficha). El servidor de las fotos no manda CORS; el
    // CloudFront sirve los mismos archivos con CORS y en el tamaño pedido
    // (fit-in/128x128/<misma ruta>). decisiones.md, 2026-10-21 · Toggle Iluminar
    // según la foto.
    sampleFrom: 'https://s3.coresagroup.com/',
    sampleBase: 'https://d1zltvqju4u8ql.cloudfront.net/fit-in/128x128/',
    // Imágenes de la ficha técnica en PDF: el mismo CloudFront, al tamaño que
    // usa la hoja ({size} en px) y en {format}: webp la foto (en jpeg la
    // transparencia sale negra), png las cotas. decisiones.md, 2026-10-23 ·
    // Ficha técnica: una hoja menos y 2026-10-27 · Foto transparente en el PDF.
    pdfBase: 'https://d1zltvqju4u8ql.cloudfront.net/fit-in/{size}x{size}/filters:format({format})/',
  }),
  // Ficha técnica en PDF: se cargan de jsDelivr con versión fija al primer clic
  // y no entran en dist/arq.js (decisiones.md, 2026-10-02 · Ficha técnica en PDF).
  // pdfmake por /+esm: módulo ES, sin globales. La fuente, de @fontsource;
  // {weight} se reemplaza por el peso (300, 400…).
  pdf: Object.freeze({
    pdfmakeUrl: 'https://cdn.jsdelivr.net/npm/pdfmake@0.3.11/build/pdfmake.min.js/+esm',
    fontUrl: 'https://cdn.jsdelivr.net/npm/@fontsource/albert-sans@5.3.0/files/albert-sans-latin-{weight}-normal.woff',
  }),
});
