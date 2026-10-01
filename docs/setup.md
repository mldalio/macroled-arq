# Setup y forma de trabajo — Macroled Arq

Guía para trabajar las tres con IAs distintas sobre las mismas reglas.

| Persona | Editor | IA | Qué lee automáticamente |
| --- | --- | --- | --- |
| Lau | VS Code | Claude Code | `CLAUDE.md` → importa `AGENTS.md` y `DESIGN.md` |
| Compañera 2 | VS Code | Codex (ChatGPT) | `AGENTS.md` |
| Compañera 3 | Cursor | Agente de Cursor | `AGENTS.md` |

Las reglas viven en **un solo lugar** (`AGENTS.md` + `DESIGN.md`). `CLAUDE.md` solo agrega notas para Claude. No se crean reglas propias por herramienta (`.cursor/rules/`, instrucciones personalizadas de ChatGPT, etc.): si hace falta una regla nueva, va en `AGENTS.md` y se acuerda entre las tres.

---

## Estado actual

Ya está hecho:

- **Base del repo:** Vite en modo librería (`dist/arq.js` + `dist/arq.css`), tokens desde Figma (`npm run tokens`, 251 tokens), estilos `role/*` compartidos, demo con Light/Dark, `.gitattributes` con LF.
- **Base de componentes** (rama `feat/arq-base`): `ArqElement` (clase base), `icons.js` (20 íconos) y `disclosure.js` (desplegables). El patrón está en `docs/decisiones.md`.
- **Documentación para IAs:** `AGENTS.md`, `DESIGN.md`, `CLAUDE.md`, `docs/components.md` (descripción de los 74 componentes). Hay una copia de cada uno en la página *Plan del proyecto* de Figma.

Falta:

- Decidir dónde se publica `dist/` (ver Parte 1, paso 1).
- Construir `<arq-button>` y probarlo en el staging de Webflow.
- Completar `docs/typesense-schema.md` y `docs/urls.md`.
- Tokens de movimiento (duraciones y curvas): hoy no hay animaciones.

---

## Parte 1 · Lau: cerrar la base y abrir el repo al equipo

### 1. Decidir dónde se publica `dist/`

jsDelivr sirve archivos **solo de repos públicos de GitHub o de paquetes públicos de npm**. Opciones:

| Opción | Repo | Cómo se carga en Webflow | A tener en cuenta |
| --- | --- | --- | --- |
| **A · Repo público + jsDelivr** | Público | `cdn.jsdelivr.net/gh/<org>/macroled-arq@v1.0.0/dist/arq.js` | Lo más simple. Se ve todo el código fuente, la documentación y las decisiones. |
| **B · Repo privado + paquete npm público** | Privado | `cdn.jsdelivr.net/npm/@macroled/arq@1.0.0/dist/arq.js` | Solo se publica `dist/` (que de todos modos es público en el sitio). Requiere una cuenta u organización en npm y `npm publish` en cada release. |
| **C · Repo privado + Cloudflare Pages o Netlify** | Privado | URL propia del hosting | Gratis y automático en cada push, pero el versionado por release hay que armarlo. |

Recomendación: **B** si la empresa no quiere el código abierto; **A** si no le importa. En ningún caso hay secretos en el repo: la única key del front es la search-only de Typesense, que es pública por diseño.

Anotar la decisión en `docs/decisiones.md`.

### 2. Subir el repo

```bash
git checkout main
git push -u origin main
git checkout feat/arq-base
git push -u origin feat/arq-base
```

En GitHub, abrir un Pull Request de `feat/arq-base` a `main`, revisarlo y mergearlo. Después:

```bash
git checkout main
git pull
```

### 3. Validar el circuito con `<arq-button>`

```bash
git checkout -b feat/arq-button
```

Pedirle a Claude Code el componente con el **prompt común** (Parte 3), con `NOMBRE = button` y `NODE-ID = 907-2375`. Después:

1. Revisarlo en la demo (`npm run dev`) contra Figma: Light/Dark, 390 px, teclado y los estados Filled, Outline, Underline, Disabled y Loading.
2. `npm run build`, commit, push y Pull Request.
3. Publicar una versión de prueba `v0.1.0` según la opción elegida en el paso 1 (Parte 5).
4. En el staging de Webflow, crear una página de prueba en `/arq` con el loader (Parte 5) y un `<arq-button>`.
5. Verificar que se ve igual que en la demo y que los estilos de Macroled no lo afectan (ni al revés).

Si algo falla acá, se corrige en la base antes de repartir trabajo.

### 4. Cargar las tarjetas en Trello

Una tarjeta por componente de la Fase 1 y la Fase 2 (Parte 4), con el link al set de Figma (Anexo A de `DESIGN.md`) y el nombre de la rama.

### 5. Avisar a las compañeras

Cuando `feat/arq-base` y `feat/arq-button` estén en `main`, pasarles este archivo.

---

## Parte 2 · Cada compañera prepara su máquina

Necesitan **Node.js 22 LTS**, **Git**, acceso al repo de GitHub y acceso al archivo de Figma `Macroled-ARQ` con su propia cuenta.

```bash
git clone https://github.com/<organizacion>/macroled-arq.git
cd macroled-arq
npm install
npm run dev
```

Si la demo abre y muestra los tokens y los íconos, el entorno está bien.

### Codex (VS Code) — compañera 2

1. Instalar la extensión **Codex** de OpenAI en VS Code e iniciar sesión con la cuenta de ChatGPT.
2. Codex lee `AGENTS.md` en cada tarea. `AGENTS.md` le indica leer `DESIGN.md` y `docs/components.md` antes de construir.
3. Conectar Figma. En una terminal (necesita la CLI: `npm i -g @openai/codex`):
   ```bash
   codex mcp add figma --url https://mcp.figma.com/mcp
   ```
   Completar el login de Figma en el navegador.

### Cursor — compañera 3

1. Abrir la carpeta del repo en Cursor. Cursor lee `AGENTS.md` como reglas del proyecto.
2. Conectar Figma: en el chat del agente escribir `/add-plugin figma`, o en Settings → MCP agregar `https://mcp.figma.com/mcp`, tocar **Connect** y autorizar.

### Comprobar que la IA quedó bien configurada

Hacerle estas tres preguntas. Si responde bien las tres, está lista:

1. "¿Qué dice AGENTS.md sobre los estados Hover y Focus?" → no son props, van con `:hover` y `:focus-visible`.
2. "Leé por el MCP de Figma el componente 907-2375 y decime sus propiedades." → Type, State, Label, Show icon…
3. "Leé la ficha doc/button de la página Documentación (1422:1702)." → si dice que la página no existe, recordarle que se accede por node id (tabla en AGENTS.md).

---

## Parte 3 · Cómo se trabaja

### Una tarea = una tarjeta de Trello = una rama

1. Tomar una tarjeta y asignársela.
2. `git checkout main && git pull`
3. `git checkout -b feat/arq-<nombre>` (o `fix/`, `tokens/`, `docs/`).
4. Pedirle a la IA la tarea con el **prompt común**.
5. Revisar en la demo (`npm run dev`): Light/Dark, 390 px y teclado.
6. `npm run build` sin errores.
7. `git push -u origin feat/arq-<nombre>` y abrir un Pull Request.
8. Antes de mergear: `git pull origin main` en la rama. Mergear y mover la tarjeta a Hecho.

### Prompt común para construir un componente

Las tres usan el mismo texto, así las IAs trabajan igual:

> Construí `<arq-NOMBRE>` siguiendo AGENTS.md y DESIGN.md.
> 1. Leé el set NODE-ID de Figma por MCP (variantes, props y variables enlazadas), su descripción en `docs/components.md` y su ficha `doc/NOMBRE` en la página Documentación (`1422:1702`).
> 2. Extendé `ArqElement`. Usá `icons.js` para los íconos y `disclosure.js` si es un desplegable. Hover, Pressed, Focus y Breakpoint van por CSS, no como props.
> 3. Si las fuentes no coinciden o falta un token, un estado o un dato, frená y preguntame antes de inventar.
> 4. Crealo en `src/components/NOMBRE/` (`.js`, `.css`, `README.md`), registralo en `src/main.js` y sumalo a `demo/index.html` con todas sus variantes, en Light y Dark.
> 5. Actualizá su fila en `docs/components.md` (Estado en código).
> 6. Mostrame el plan antes de escribir. Al terminar, listá los `TODO` que quedaron.

El `NODE-ID` de cada componente está en el Anexo A de `DESIGN.md`.

### Reglas para no pisarse

- No trabajar dos personas en el mismo componente a la vez.
- Si un componente necesita otro que todavía no existe, se avisa en Trello y se espera o se coordina. No se crea una versión propia.
- `src/base/`, `tokens/tokens.json` y `src/styles/` los toca una sola persona por vez, en una rama `fix/` o `tokens/`, avisando en Trello.
- `AGENTS.md` y `DESIGN.md` solo se cambian con acuerdo de las tres, en una rama `docs/`. Después se actualiza la copia en *Plan del proyecto* de Figma.
- Si la IA propone cambiar algo fuera del alcance de la tarea, se rechaza.

---

## Parte 4 · Reparto del trabajo

### Fase 1 · Primitivos (Lau)

Lau construye todos los primitivos, para que la Fase 2 arranque sobre una base pareja: icon-button, tag (en espera de diseño), divider, count-badge, logo, nav-link, footer-link, breadcrumb-item, checkbox, toggle, choice-chip, input, file-upload, form-message, form-section-header, swatch, option-tile, tab, select-option, sku, gallery-thumb, spec-row, filter-chip.

Mientras tanto, las compañeras preparan su máquina (Parte 2) y avanzan con los datos (más abajo). Empiezan la Fase 2 cuando la Fase 1 esté en `main`.

### Fase 2 · Compuestos y páginas, por dominio

Cada una toma un dominio y lo lleva hasta su página.

| | Componentes | Páginas |
| --- | --- | --- |
| **Lau · navegación y contenido** | navbar, mega-menu, mega-link, search-field, search-result, search-see-all, search-dropdown, search-screen, footer, hero, page-header, section-header, breadcrumb, cta-block, feature-block, category-card, line-card, faq-item, carousel-controls | Home |
| **Compañera 2 · catálogo** | product-card (hover con 4 imágenes), catalog-toolbar, catalog-nav, catalog-nav-group, catalog-nav-item, catalog-nav-mobile, catalog-nav-trigger, filter-panel, filter-row, compare-bar, compare-slot, compare-header, compare-group, compare-row, compare-product | Productos, Colecciones, Comparativa |
| **Compañera 3 · ficha** | select, select-menu, option-group, swatch-picker, product-gallery, accordion-item, spec-list, variants-table, variants-table-row, filter-bar, download-modal, download-item, family-card | Ficha de producto |

Contact-item, link-list y el formulario de Contacto los toma la primera que termine.

### En paralelo: datos

Las páginas necesitan datos reales. Antes de la Fase 2 hay que completar:

- `docs/typesense-schema.md`: campos de la colección de Arq, incluidas las 4 imágenes de product-card y los códigos de acabado.
- `docs/urls.md`: rutas de cada página dentro de `/arq`.
- `demo/fixtures/`: un producto de ejemplo en JSON con esos campos, para probar componentes sin Typesense.

---

## Parte 5 · Publicar una versión

1. En `main`, con todo mergeado: `npm run build` y commit de `dist/`.
2. En GitHub → Releases → crear un release con tag `vX.Y.Z` (por ejemplo `v0.1.0`).
3. Publicar según la opción elegida:
   - **A:** nada más; jsDelivr lo toma del tag.
   - **B:** `npm version X.Y.Z` y `npm publish --access public`.
   - **C:** el hosting publica solo en cada push.
4. En Webflow, en el `<head>` de las páginas de `/arq` (loader):
   ```html
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Albert+Sans:wght@300..700&display=swap">
   <link rel="stylesheet" href="URL-DE-arq.css">
   <script type="module" src="URL-DE-arq.js"></script>
   ```
5. Probar en el staging (`.webflow.io`). Si está bien, publicar en producción.
6. Para volver atrás: poner la versión anterior en las dos URLs del loader.
