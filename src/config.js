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
});
