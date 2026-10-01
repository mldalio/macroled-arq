# Macroled Arq

Web Components (vanilla JS, Shadow DOM) del sitio `macroled.com.ar/arq`. Se cargan en Webflow desde jsDelivr: `dist/arq.js` y `dist/arq.css`.

Reglas del repo en [AGENTS.md](./AGENTS.md) y sistema de diseño en [DESIGN.md](./DESIGN.md).

## Requisitos

- Node 22 (ver `.nvmrc`)

## Comandos

```sh
npm install      # dependencias
npm run dev      # demo en demo/index.html
npm run tokens:import  # tokens/figma/ (export de Figma por MCP) → tokens/tokens.json
npm run tokens   # tokens/tokens.json → src/styles/tokens.css y roles.css
npm run build    # dist/arq.js y dist/arq.css
```

Configuración inicial, variables de entorno, MCP de Figma, cómo actualizar los tokens y cómo publicar una versión: [docs/setup.md](./docs/setup.md).

## Cargar en Webflow

Siempre con tag de versión (las versiones están en los tags del repo):

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/mldalio/macroled-arq@vX.Y.Z/dist/arq.css">
<script type="module" src="https://cdn.jsdelivr.net/gh/mldalio/macroled-arq@vX.Y.Z/dist/arq.js"></script>
```
