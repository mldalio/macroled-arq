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
  // Ficha técnica en PDF: se cargan de jsDelivr con versión fija al primer clic
  // y no entran en dist/arq.js (decisiones.md, 2026-10-02 · Ficha técnica en PDF).
  // pdfmake por /+esm: módulo ES, sin globales. La fuente, de @fontsource;
  // {weight} se reemplaza por el peso (300, 400…).
  pdf: Object.freeze({
    pdfmakeUrl: 'https://cdn.jsdelivr.net/npm/pdfmake@0.3.11/build/pdfmake.min.js/+esm',
    fontUrl: 'https://cdn.jsdelivr.net/npm/@fontsource/albert-sans@5.3.0/files/albert-sans-latin-{weight}-normal.woff',
  }),
});
