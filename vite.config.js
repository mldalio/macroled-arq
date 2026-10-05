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
  plugins: [
    {
      // Solo demo: Enter en el buscador del navbar navega con location.assign a
      // /arq/productos?q=…, que demo/demo-page.js no puede cambiar (solo cambia
      // links y clics). Se redirige a la demo de Productos con el mismo ?query.
      name: 'arq-demo-productos',
      apply: 'serve',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = new URL(req.url, 'http://localhost');
          if (url.pathname.replace(/\/$/, '') !== '/arq/productos') return next();
          res.writeHead(302, { Location: `/demo/productos.html${url.search}` });
          res.end();
        });
      },
    },
  ],
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
