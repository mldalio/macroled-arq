# AGENTS.md — Macroled Arq

Reglas para todas las IAs que trabajan en este repo (Claude, Codex, Cursor u otras). Los cambios en este archivo se acuerdan entre las tres personas del equipo.

- **Diseño:** leer [DESIGN.md](./DESIGN.md) antes de escribir cualquier componente. Si DESIGN.md y este archivo no cubren algo, **no se inventa**: se deja un `TODO` y se pregunta.
- Si una regla impide hacer la tarea, preguntar en vez de romperla.

---

## Contexto

- Sitio en `macroled.com.ar/arq`. Se desarrolla en este repo y se carga dentro de páginas de Webflow que comparten sitio y dominio con el e-commerce de Macroled.
- Las páginas de colección del CMS se anidan en la carpeta `/arq` de Webflow.
- **Datos:** Google Sheets es la fuente maestra y alimenta Typesense. Webflow CMS guarda solo lo que Google necesita leer en el HTML (nombre, SKU, macrofamilia, slug, meta title, meta description, imagen principal, descripción corta).
- **Formulario de contacto:** webhook de n8n.

## Fuente de verdad

Orden de prioridad cuando algo se contradice:

1. Variables y componentes de Figma ([Macroled-ARQ](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ)), incluidas la **descripción de cada componente** y la de cada variable
2. DESIGN.md (copia en texto plano en el frame DESIGN.md de la página Plan del proyecto)
3. Fichas `doc/<nombre>` de la página Documentación
4. Este archivo

Excepción: cuando DESIGN.md o la descripción de un componente describen un comportamiento que una variante estática de Figma no puede mostrar (por ejemplo, el cambio de imagen en hover de product-card), manda el texto.

Qué leer por el MCP de Figma: páginas **Componentes** y **Final** (pantallas), y **Tokens** / **Documentación** / **Plan del proyecto** como referencia. El MCP puede listar solo algunas páginas: se accede a las demás por su node id.

| Página | Node id |
| --- | --- |
| Componentes | `751:4274` |
| Final (pantallas) | `475:7137` |
| Documentación (fichas `doc/<nombre>`) | `1422:1702` |
| Tokens | `557:1112` |
| Plan del proyecto | `703:2696` |

Para encontrar la ficha de un componente, listar los hijos de Documentación (`get_metadata` sobre `1422:1702`) y buscar el frame `doc/<nombre>`.
Qué **no** usar: página *baja / media*, frames *Registro · …* (historial de pendientes).

## Stack

Web Components nativos, vanilla JS, sin framework · Vite (solo para desarrollar y generar `dist/`) · Style Dictionary · Typesense · n8n · jsDelivr

No se usa Storybook. Los componentes se prueban en `demo/index.html`.

## Estructura del repo

```
tokens/tokens.json            ← export de variables de Figma (no editar a mano salvo acuerdo)
src/styles/tokens.css         ← generado con npm run tokens (no editar)
src/base/                     ← ArqElement (clase base), icons.js, disclosure.js
src/components/<nombre>/      ← <nombre>.js, <nombre>.css, README.md
src/pages/                    ← páginas armadas con componentes y datos
demo/index.html               ← página de prueba: todos los componentes y sus estados
demo/fixtures/                ← datos de ejemplo (JSON) para la demo
src/data/                     ← único acceso a Typesense
src/config.js                 ← endpoints (webhook de n8n, host de Typesense)
docs/components.md            ← índice de componentes con la descripción de Figma de cada uno
docs/typesense-schema.md      ← campos disponibles en Typesense
dist/arq.js · dist/arq.css    ← única salida que carga Webflow
```

## Tokens

- Prohibido usar valores sueltos (hex, px, rem). Solo variables de `tokens.css`.
- Los componentes usan tokens **semánticos**, nunca primitivos.
- `tokens.css` es generado: se cambia `tokens/tokens.json` y se corre `npm run tokens`. Se commitean juntos.
- No se exportan las paletas de marca sin uso (bronze, cacao, olive, terracotta, offwhite).
- Los estilos de texto `role/*` no son variables: se exportan aparte y se aplican como clases o reglas dentro de cada componente.
- Si falta un token, **no inventarlo**: dejar un `TODO` y avisar al equipo.

## Componentes

- Web Components con prefijo `arq-` (`<arq-button>`) y **Shadow DOM**. Dentro del Shadow DOM las clases no llevan prefijo.
- Nombres de props y variantes **idénticos a Figma** (Type, Open, Size, Theme, Show …). En HTML se escriben en kebab-case como atributos y valores: `type="outline"`, `show-icon`, `layout="image-left"`. Los booleanos son atributos de presencia.
- **No son props:** `Breakpoint` (se resuelve con media query) ni los estados de interacción `Hover`, `Pressed` y `Focus` (se resuelven con `:hover`, `:active` y `:focus-visible`). Sí son props los estados que dependen de datos o de la app: `selected`, `current`, `checked`, `value`, `filled`, `error`, `disabled`, `loading`, `copied`, `applied`, `open`.
- Todo componente extiende `ArqElement` (`src/base/`). Los íconos salen de `src/base/icons.js` y los desplegables usan `src/base/disclosure.js`.
- Una carpeta por componente en `src/components/<nombre>/` con `.js`, `.css` y `README.md`.
- Antes de construir un componente, leer **tres cosas**: el set en Figma por MCP (variantes, props y variables enlazadas), su **descripción** en Figma (copiada en `docs/components.md`; si no coincide con Figma, manda Figma) y su ficha `doc/<nombre>` en la página Documentación (uso, "No confundir con", notas de código). El link al set está en el Anexo A de DESIGN.md y en la tarjeta de Trello. Si las tres fuentes no coinciden, avisar en vez de elegir.
- El texto principal llega como **slot** desde el HTML (indexable), no se genera por JS.
- **Foco:** siempre `:focus-visible` con un anillo separado: `outline` de `--arq-border-strong` en `--arq-color-border-focus` y `outline-offset: 2px`. El foco nunca cambia el tamaño del componente.
- Las props booleanas de Figma que vienen activadas por defecto (Show icon, Show underline…) en código van desactivadas por defecto, porque son atributos de presencia. Se aclara en el README del componente.
- **Responsive:** Desktop es la base; Mobile con `@media (max-width: 767px)`. Los listados usan `catalog-nav-mobile` hasta 1023 px.
- **Dark:** solo con `data-arq-theme="dark"` (switch Iluminar). Nunca `prefers-color-scheme`.
- Los desplegables (accordion-item, faq-item, filter-row, catalog-nav-group, catalog-nav-trigger) comparten un disclosure base.
- Cantidades variables (filas, opciones, acabados) son libres en código aunque en Figma haya un número fijo.
- Cada componente se agrega a `demo/index.html` con todas sus variantes de Figma + cargando, vacío, error, texto largo, sin imagen, en Light y Dark. La demo tiene un switch para `data-arq-theme` y se revisa también en 390 px.
- Actualizar `docs/components.md` al crear o modificar un componente.
- Si un valor de Figma no tiene token o un texto no tiene estilo `role/*`: usar el más cercano y dejar un `TODO`.
- Los nombres de imágenes de Figma son placeholders: las imágenes reales vienen de los datos.

## Integración con Webflow

- Prohibido estilar `html`, `body` o selectores globales.
- Todo lo global lleva prefijo: variables `--arq-*`, atributos `data-arq-*`, eventos `arq:<nombre>`, localStorage `arq:<clave>`, `@keyframes arq-<nombre>`, un único global `window.Arq`.
- La tipografía (Albert Sans) se carga a nivel página, no dentro del Shadow DOM.
- No depender de scripts de Macroled ni modificarlos. Las interacciones de Webflow y Finsweet no entran al Shadow DOM.
- Salida final: solo `dist/arq.js` y `dist/arq.css`, publicados en jsDelivr con tag de versión (`@v1.0.0`).

## Datos (Typesense)

- Todo acceso pasa por `src/data/`. Los componentes reciben datos, no consultan.
- En el front, solo la **search-only key** de la colección de Arq. Nunca escribir, commitear ni pedir la admin key.
- Campos disponibles: `docs/typesense-schema.md`. **No inventar campos.**
- El template del CMS imprime el SKU y el componente busca el resto:

```html
<arq-ficha-producto data-sku="KANU-J-500-12W-N-WW">
  <h1>Kanu Jardín</h1>          <!-- CMS: indexable -->
  <p>Descripción corta</p>
</arq-ficha-producto>
```

- **SKU:** es el vínculo entre Webflow CMS y Typesense. El criterio de formato está pendiente: tratarlo como identificador opaco, tal como viene de Sheets (puede tener espacios o paréntesis). No usarlo directo como `id` HTML ni como slug.
- **product-card:** cada producto trae cuatro imágenes (estudio y contexto, con la luz apagada y encendida). Reglas de uso en DESIGN.md §8 · Imágenes de product-card.
- Acabados: Sheets trae el nombre como texto; se normaliza a slug en inglés con un único archivo de mapeo. Si falta la imagen, mostrar un neutro con el nombre.

## Formulario (n8n)

- `<arq-form-contacto>` envía por `fetch` al webhook de n8n definido en `src/config.js`.
- Validar en el componente; incluir campo honeypot.
- Estados: enviando (button `State=Loading`), enviado, error (`form-message`).

## Flujo de trabajo

1. El componente está en Figma con todos sus estados y marcado "Ready for dev" en Dev Mode.
2. Tarjeta en Trello con el link al set de Figma.
3. Rama `feat/arq-<nombre>`; la IA lo construye leyendo el set por el MCP de Figma y siguiendo DESIGN.md y este archivo.
4. Sumarlo a `demo/index.html` con fixtures (ver Componentes).
5. Comparar contra Figma en la demo (`npm run dev`).
6. Merge a `main`, actualizar `docs/components.md` y mover la tarjeta a Hecho.

- Una rama por tarea: `feat/`, `fix/`, `tokens/`, `docs/`. Ramas cortas.
- Hacer pull antes de empezar y antes de mergear a `main`.
- No mergear si el build falla o la demo tiene errores en consola.
- Antes de un release: `npm run build` y commit de `dist/`.
- No modificar archivos fuera del alcance de la tarea.
- Las decisiones se escriben: si no está en DESIGN.md, AGENTS.md o `docs/decisiones.md`, las IAs no lo saben.

## Definición de terminado

- Coincide con Figma en todas sus variantes, en Light/Dark y Desktop/Mobile.
- Usa solo tokens semánticos, sin valores sueltos.
- Está en `demo/index.html` con todos sus estados.
- Se puede usar con teclado, tiene foco visible y pasa un chequeo de accesibilidad (Lighthouse o axe DevTools sobre la demo).
- Tiene README con sus props.
- `npm run build` corre sin errores y la demo no tiene errores en consola.
