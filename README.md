# Macroled Arq

Web Components (vanilla JS, Shadow DOM) del sitio `macroled.com.ar/arq`. Se cargan en Webflow desde jsDelivr: `dist/arq.js` y `dist/arq.css`.

Reglas del repo en [AGENTS.md](./AGENTS.md) y sistema de diseño en [DESIGN.md](./DESIGN.md).

## Requisitos

- Node 22 (ver `.nvmrc`)

## Comandos

```sh
npm install      # dependencias
npm run dev      # demo en demo/index.html
npm run tokens   # tokens/tokens.json → src/styles/tokens.css y roles.css
npm run build    # dist/arq.js y dist/arq.css
```

Configuración inicial, variables de entorno y MCP de Figma: [docs/setup.md](./docs/setup.md).
