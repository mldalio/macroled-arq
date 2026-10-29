import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';

const bannerLoop = path.resolve('BannerLoopARQ.mp4');

// El MP4 de la portada vive en la raíz. En Windows, si Cursor lo tiene abierto,
// el servidor estático de Vite emite EBUSY y se cierra. Este middleware lo
// sirve antes y, si sigue bloqueado, responde 503 sin tirar el proceso.
function serveBannerLoop(req, res, next) {
  const url = new URL(req.url, 'http://localhost');
  if (decodeURIComponent(url.pathname) !== '/BannerLoopARQ.mp4') return next();
  fs.stat(bannerLoop, (err, stat) => {
    if (err) {
      res.statusCode = err.code === 'EBUSY' ? 503 : 404;
      res.end();
      return;
    }
    const match = /bytes=(\d*)-(\d*)/.exec(req.headers.range || '');
    const start = match?.[1] ? Number(match[1]) : 0;
    const end = match?.[2] ? Number(match[2]) : stat.size - 1;
    const headers = {
      'Content-Type': 'video/mp4',
      'Accept-Ranges': 'bytes',
      'Content-Length': end - start + 1,
    };
    if (match) headers['Content-Range'] = `bytes ${start}-${end}/${stat.size}`;
    res.writeHead(match ? 206 : 200, headers);
    const stream = fs.createReadStream(bannerLoop, { start, end });
    stream.on('error', () => {
      if (!res.headersSent) res.statusCode = 503;
      res.end();
    });
    stream.pipe(res);
  });
}

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
    // En Windows, vigilar un archivo abierto (JPG de arq_nosotros, o el MP4
    // de la home) tira el server con EBUSY.
    watch: {
      ignored: ['**/arq_nosotros/**', '**/BannerLoopARQ.mp4'],
    },
  },
  plugins: [
    {
      // Solo demo: Enter en el buscador del navbar navega con location.assign a
      // /arq/productos?q=…, que demo/demo-page.js no puede cambiar (solo cambia
      // links y clics). Se redirige a la demo de Productos con el mismo ?query.
      name: 'arq-demo-productos',
      apply: 'serve',
      configureServer(server) {
        server.middlewares.use(serveBannerLoop);
        server.middlewares.use((req, res, next) => {
          const url = new URL(req.url, 'http://localhost');
          const path = url.pathname.replace(/\/$/, '');
          const listing = path === '/arq/productos' || /^\/arq\/(interior|exterior|lamparas-y-artefactos)$/.test(path);
          if (!listing) return next();
          req.url = `/demo/productos.html${url.search}`;
          next();
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
