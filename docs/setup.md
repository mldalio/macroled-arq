# Setup y forma de trabajo — Macroled Arq

Guía para trabajar con IAs sobre las mismas reglas.

**Hoy trabaja una sola persona:** Lau construye todos los componentes con Claude Code. Las filas de Codex y Cursor quedan como referencia, por si más adelante se suma alguien con otra IA.

| Persona | Editor | IA | Qué lee automáticamente |
| --- | --- | --- | --- |
| Lau | VS Code | Claude Code | `CLAUDE.md` → importa `AGENTS.md` y `DESIGN.md` |
| (a futuro) | VS Code | Codex (ChatGPT) | `AGENTS.md` |
| (a futuro) | Cursor | Agente de Cursor | `AGENTS.md` |

Las reglas viven en **un solo lugar** (`AGENTS.md` + `DESIGN.md`). `CLAUDE.md` solo agrega notas para Claude. No se crean reglas propias por herramienta (`.cursor/rules/`, instrucciones personalizadas de ChatGPT, etc.): si hace falta una regla nueva, va en `AGENTS.md`, en una rama `docs/`, y después se actualiza su copia en *Plan del proyecto* de Figma.

---

## Estado actual

Ya está hecho:

- **Base del repo:** Vite en modo librería (`dist/arq.js` + `dist/arq.css`), tokens desde Figma (`npm run tokens:import` + `npm run tokens`, 256 tokens con los de movimiento), estilos `role/*` compartidos, demo con Light/Dark, `.gitattributes` con LF.
- **Publicación:** repo público y `dist/` servido por jsDelivr desde los tags de GitHub (opción A, ver Parte 5).
- **Fase 1:** primitivos en `main` (lista en Parte 4) con transiciones de color y movimiento reducido.
- **Base de componentes** (en `main`): `ArqElement` (clase base), `icons.js` (20 íconos) y `disclosure.js` (desplegables). El patrón está en `docs/decisiones.md`.
- **Documentación para IAs:** `AGENTS.md`, `DESIGN.md`, `CLAUDE.md`, `docs/components.md` (descripción de los 74 componentes). Hay una copia de cada uno en la página *Plan del proyecto* de Figma.

- **v0.1.0:** publicada y probada en el staging de Webflow.

Falta:

- Completar `docs/typesense-schema.md` y `docs/urls.md`.

---

## Parte 1 · Lau: cerrar la base

### 1. Dónde se publica `dist/` (hecho)

**Opción A · repo público + jsDelivr.** El repo `github.com/mldalio/macroled-arq` es público y jsDelivr sirve `dist/` desde los tags de GitHub:

```
https://cdn.jsdelivr.net/gh/mldalio/macroled-arq@vX.Y.Z/dist/arq.js
https://cdn.jsdelivr.net/gh/mldalio/macroled-arq@vX.Y.Z/dist/arq.css
```

No hay secretos en el repo: la única key del front es la search-only de Typesense, que es pública por diseño. La decisión está en `docs/decisiones.md` (2026-10-01 · Publicación).

### 2. Subir el repo y la base (hecho)

El repo está en GitHub y la base de componentes (`feat/arq-base`) está mergeada en `main`.

### 3. Validar el circuito con `<arq-button>` (hecho)

`<arq-button>` está en `main` y `v0.1.0` se probó en el staging de Webflow: se ve igual que en la demo y los estilos de Macroled no lo afectan (ni al revés). Si una versión nueva rompe algo en Webflow, se corrige en la base antes de seguir con componentes.

### 4. Opcional: tarjetas en Trello

Una tarjeta por componente pendiente, en el orden de la Parte 4, con el link al set de Figma (Anexo A de `DESIGN.md`) y el nombre de la rama.

---

## Parte 2 · Preparar una máquina

> Hoy trabaja una sola persona y esta máquina ya está lista. Esta parte queda para cuando se sume alguien (con Claude Code, Codex o Cursor).

Hace falta **Node.js 22 LTS**, **Git**, acceso al repo de GitHub y acceso al archivo de Figma `Macroled-ARQ` con su propia cuenta.

```bash
git clone https://github.com/mldalio/macroled-arq.git
cd macroled-arq
npm install
npm run dev
```

Si la demo abre y muestra los tokens y los íconos, el entorno está bien.

### Codex (VS Code)

1. Instalar la extensión **Codex** de OpenAI en VS Code e iniciar sesión con la cuenta de ChatGPT.
2. Codex lee `AGENTS.md` en cada tarea. `AGENTS.md` le indica leer `DESIGN.md` y `docs/components.md` antes de construir.
3. Conectar Figma. En una terminal (necesita la CLI: `npm i -g @openai/codex`):
   ```bash
   codex mcp add figma --url https://mcp.figma.com/mcp
   ```
   Completar el login de Figma en el navegador.

### Cursor

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
5. Revisar en la demo (`npm run dev`, ver más abajo): Light/Dark, 390 px y teclado.
6. `npm run build` sin errores.
7. `git push -u origin feat/arq-<nombre>` y abrir un Pull Request.
8. Antes de mergear: `git pull origin main` en la rama. Mergear y mover la tarjeta a Hecho.

### Ver la demo

`npm run build` no muestra nada en pantalla: solo genera `dist/arq.js` y `dist/arq.css`, los archivos que carga Webflow. Los componentes se ven en la demo:

1. En la terminal, en la carpeta del repo: `npm run dev`.
2. Se abre el navegador en `http://localhost:5173/demo/index.html`. Si no se abre solo, copiar la dirección que muestra la terminal y agregarle `/demo/index.html`. Si el puerto 5173 está ocupado, Vite usa otro (5174…): vale el que muestre la terminal.
3. Cada componente tiene su sección. **Índice** (arriba a la izquierda) las lista agrupadas, con un buscador: escribir el nombre y Enter lleva a la sección. Al lado se ve en qué sección estás.
4. **Dark:** switch "Dark" arriba a la derecha. **Mobile:** botón **Ver a 390**, que muestra la demo en 390 de ancho (también se puede con F12 → ícono de celular, Ctrl+Shift+M). **Consola:** F12 → Console, sin errores.
5. Para cortar el servidor: Ctrl+C en la terminal.

Si la demo ya estaba abierta, los cambios aparecen solos al guardar y la página vuelve a la misma sección; si no, recargar con Ctrl+F5. Una sección nueva aparece sola en el índice (en "Otros" hasta que se le asigna un grupo en `demo/demo-nav.js`). Para ver lo último de `main`: `git checkout main && git pull` antes de `npm run dev`.

### Prompt común para construir un componente

Cualquier IA usa el mismo texto, así todas trabajan igual:

> Construí `<arq-NOMBRE>` siguiendo AGENTS.md y DESIGN.md.
> 1. Leé el set NODE-ID de Figma por MCP (variantes, props y variables enlazadas), su descripción en `docs/components.md` y su ficha `doc/NOMBRE` en la página Documentación (`1422:1702`).
> 2. Extendé `ArqElement`. Usá `icons.js` para los íconos y `disclosure.js` si es un desplegable. Hover, Pressed, Focus y Breakpoint van por CSS, no como props.
> 3. Si las fuentes no coinciden o falta un token, un estado o un dato, frená y preguntame antes de inventar.
> 4. Crealo en `src/components/NOMBRE/` (`.js`, `.css`, `README.md`), registralo en `src/main.js` y sumalo a `demo/index.html` con todas sus variantes, en Light y Dark.
> 5. Actualizá su fila en `docs/components.md` (Estado en código).
> 6. Mostrame el plan antes de escribir. Al terminar, listá los `TODO` que quedaron.

El `NODE-ID` de cada componente está en el Anexo A de `DESIGN.md`.

### Reglas para no pisarse

- Si un componente necesita otro que todavía no existe, se construye primero el que falta (orden de la Parte 4). No se crea una versión propia.
- Los cambios en `src/base/`, `tokens/` y `src/styles/` van en su propia rama `fix/` o `tokens/`, no dentro de la rama de un componente.
- `AGENTS.md` y `DESIGN.md` se cambian en una rama `docs/`. Después se actualiza su copia en *Plan del proyecto* de Figma.
- Si la IA propone cambiar algo fuera del alcance de la tarea, se rechaza.

---

## Parte 4 · Orden de construcción

Lau construye todos los componentes. El orden sale de las dependencias (descripciones de `docs/components.md`): cada nivel usa solo lo que ya está en código o en un nivel anterior. Dentro de un nivel el orden es libre; la columna Página ayuda a cerrar páginas de a una.

✅ = ya en código (en `main`, con README y en la demo). El estado de cada componente está en `docs/components.md`.

**Fase 1, ya en código (no están en las tablas):** button, icon-button, input (Text y Textarea), checkbox, toggle (con toggle-switch), choice-chip, option-tile, swatch, tab, select-option, file-upload, form-message, form-section-header, sku, spec-row, filter-chip, gallery-thumb, count-badge, divider, logo, nav-link, footer-link, breadcrumb, breadcrumb-item, section-header, page-header.

**En espera de diseño:** tag.

### Nivel 1 · Usan solo componentes que ya están

| Página | Componente | Usa |
| --- | --- | --- |
| Home y Contacto | ✅ hero | button (el navbar va aparte, ver `docs/decisiones.md`) |
| Home | ✅ category-card, line-card, feature-block | button |
| Home | ✅ cta-block | input, button |
| Home | ✅ faq-item | disclosure |
| Home y Colección | ✅ carousel-controls | icon-button |
| Todas | ✅ footer | logo, footer-link |
| Ficha | ✅ spec-list | spec-row |
| Ficha | ✅ accordion-item | icon-button, disclosure |
| Ficha | ✅ swatch-picker | swatch |
| Ficha | select-menu | select-option |
| Ficha | ✅ product-gallery | gallery-thumb |
| Ficha | variants-table-row | sku, icon-button |
| Ficha | family-card | — |
| Ficha | download-item | íconos |
| Listados | product-card | swatch, checkbox |
| Listados | catalog-toolbar | toggle, divider, button y count-badge |
| Listados | ✅ catalog-nav-item | — |
| Listados | ✅ catalog-nav-trigger (dentro de catalog-nav) | icon-button, disclosure |
| Listados | ✅ filter-row | icon-button, checkbox, disclosure |
| Comparativa | compare-slot | icon-button |
| Comparativa | compare-group, compare-row | — |
| Contacto | contact-item | — |
| Contacto | link-list | button |
| Navbar | search-field | icon-button |
| Navbar | search-result, search-see-all | íconos |
| Navbar | mega-link | íconos, disclosure |

product-card necesita los campos de las 4 imágenes en `docs/typesense-schema.md`; hasta que estén, se construye con `TODO` y fixtures.

### Nivel 2 · Dependen del nivel 1

| Componente | Usa |
| --- | --- |
| select | select-menu, swatch |
| input Type=Select (completar) | select-menu Type=Text; cierra el `TODO` de input |
| ✅ catalog-nav-group | catalog-nav-item |
| ✅ catalog-nav-mobile (dentro de catalog-nav) | catalog-nav-trigger, catalog-nav-item |
| ✅ filter-panel | filter-row, filter-chip, button |
| compare-bar | compare-slot, count-badge, divider, button |
| download-modal | download-item |
| search-dropdown | search-result, search-see-all |
| search-screen | search-field, search-result, search-see-all |
| mega-menu | tab, mega-link |

### Nivel 3 · Dependen del nivel 2

| Componente | Usa |
| --- | --- |
| ✅ option-group (falta Type=Select) | option-tile, swatch-picker, select |
| filter-bar | select (Type Filter), button |
| ✅ catalog-nav | catalog-nav-group |
| compare-product | select (familia y variante), button |

### Nivel 4

| Componente | Usa |
| --- | --- |
| variants-table | variants-table-row, filter-bar, button |
| compare-header | compare-product, compare-slot, toggle |

### Al final · navbar

Usa nav-link, logo, icon-button, search-field, search-dropdown, search-screen, mega-menu y mega-link. Cierra los `TODO` de navbar que hoy están en logo y nav-link (Theme Inverse, `aria-controls` hacia el mega-menu).

### En paralelo: datos

Las páginas necesitan datos reales. Antes de armar las páginas hay que completar:

- `docs/typesense-schema.md`: campos de la colección de Arq, incluidas las 4 imágenes de product-card y los códigos de acabado.
- `docs/urls.md`: rutas de cada página dentro de `/arq`.
- `demo/fixtures/`: un producto de ejemplo en JSON con esos campos, para probar componentes sin Typesense.

---

## Parte 5 · Publicar una versión

1. En `main`, con todo mergeado y al día (`git pull`): subir la versión en `package.json` (`npm version X.Y.Z --no-git-tag-version`), `npm run build` y commit de `package.json`, `package-lock.json` y `dist/`.
2. Crear el tag y subirlo: `git tag -a vX.Y.Z -m "vX.Y.Z"` y `git push origin main vX.Y.Z`. jsDelivr lo toma del tag; no hace falta nada más.
3. Opcional: en GitHub → Releases, crear el release a partir del tag con las notas.
4. Un tag publicado no se mueve ni se borra (jsDelivr lo cachea): si algo está mal, se publica `vX.Y.Z+1`.
5. En Webflow, en el `<head>` de las páginas de `/arq` (loader):
   ```html
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Albert+Sans:wght@300..700&display=swap">
   <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/mldalio/macroled-arq@vX.Y.Z/dist/arq.css">
   <script type="module" src="https://cdn.jsdelivr.net/gh/mldalio/macroled-arq@vX.Y.Z/dist/arq.js"></script>
   ```
6. Probar en el staging (`.webflow.io`). Si está bien, publicar en producción.
7. Para volver atrás: poner la versión anterior en las dos URLs del loader.

---

## Parte 6 · Actualizar los tokens desde Figma

Figma manda: valores, modos y descripciones de las variables. No se edita `tokens/tokens.json` a mano.

1. Se cambia la variable en Figma (con su descripción y su nombre CSS).
2. En una rama `tokens/<cambio>`, pedirle a Claude Code:
   > Exportá por MCP las colecciones de variables que cambiaron (o todas) a `tokens/figma/` con `scripts/figma/export-variables.figma.js` y `scripts/figma/rows-to-dtcg.js`.

   Claude lee las variables con `use_figma` en modo solo lectura, una colección por llamada, y escribe un archivo por colección y modo (`tokens/figma/<colección>.<modo>.json`).
3. `npm run tokens:import` → convierte `tokens/figma/` a `tokens/tokens.json`, lo valida y lista lo nuevo, lo quitado y lo cambiado. Revisar que esa lista sea lo esperado.
4. `npm run tokens` → regenera `src/styles/tokens.css` y `roles.css`.
5. `npm run build`, revisar la demo y commit de `tokens/figma/`, `tokens/tokens.json` y `src/styles/` juntos.

Los estilos de texto `role/*` no son variables: el import los conserva tal como están en `tokens.json`.
