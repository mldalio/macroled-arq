import { defineConfig } from 'vite';

// Macroled Arq · Vite en modo librería.
//
// Salida: solo dist/arq.js (ES module) y dist/arq.css, con nombre fijo y sin
// hash, porque Webflow los carga desde jsDelivr con tag de versión (@v1.0.0).
//
// Reparto del CSS:
// - dist/arq.css tiene solo lo global: src/styles/global.css, que importa
//   tokens.css (variables --arq-*). Las variables CSS atraviesan el Shadow DOM,
//   así que alcanza con declararlas una vez a nivel página.
// - Cada componente importa su propio CSS con `?inline` (llega como texto) y
//   lo inyecta en su Shadow DOM. Ese CSS no pasa a arq.css ni sale del componente.
// - Los estilos de texto role/* (src/styles/roles.css) se comparten entre todos
//   los componentes como una única CSSStyleSheet vía adoptedStyleSheets
//   (helper en src/styles/roles.js). Tampoco pasan a arq.css.
// - Albert Sans no va en arq.css: la fuente se carga a nivel página
//   (en Webflow y en la demo). Ver docs/decisiones.md.
//
// La demo (demo/index.html) solo se usa con `npm run dev` y no entra al build.
export default defineConfig({
  server: {
    open: '/demo/index.html',
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    copyPublicDir: false,
    lib: {
      entry: 'src/main.js',
      formats: ['es'],
      fileName: () => 'arq.js',
      cssFileName: 'arq',
    },
  },
});
