# Decisiones

Registro de decisiones técnicas que no están en AGENTS.md ni en DESIGN.md. Si una decisión no está escrita acá, las IAs no la conocen.

Formato: fecha · decisión · por qué.

---

## 2026-09-30 · Base del repo

### Albert Sans se carga a nivel página

- En Webflow, la fuente se carga en la página (custom code o fuentes del sitio), **no** en `dist/arq.css` ni dentro del Shadow DOM.
- `dist/arq.css` tiene solo `tokens.css`.
- La demo la carga con un `<link>` a Google Fonts (pesos 300–700, `display=swap`).
- Por qué: el sitio de Macroled puede tener Albert Sans cargada; así no se descarga dos veces ni se pisa su configuración.

### Salida del build

- Vite en modo librería genera solo `dist/arq.js` (ES module) y `dist/arq.css`, con nombre fijo y sin hash, para publicarlos en jsDelivr con tag de versión.
- La demo no entra al build.
- `dist/` se commitea.

### CSS de componentes y estilos role/*

- Cada componente importa su CSS con `?inline` y lo aplica en su Shadow DOM.
- Los estilos `role/*` se generan en `src/styles/roles.css` (clases `.role-<nombre>`, sin prefijo porque viven dentro del Shadow DOM). Se comparten como **una única `CSSStyleSheet`** vía `adoptedStyleSheets` con el helper `src/styles/roles.js` (`adoptStyles(shadowRoot, css)`). La hoja de cada componente también se crea una sola vez y la comparten sus instancias.
- `roles.css` referencia primitivos de tipografía (`--arq-font-*`) porque así están definidos los estilos de texto en Figma. Los componentes siguen sin usar primitivos directamente: usan las clases `.role-*`.

### Formato de tokens/tokens.json

- DTCG (`$type`, `$value`, `$description`). La ruta es el nombre de la variable en Figma sin el nombre de la colección: `color/text/primary` → `color.text.primary` → `--arq-color-text-primary`.
- `$value` es el valor del **primer modo** (Light o Desktop). El otro modo va en `$extensions["arq.modes"]` con la clave `dark` o `mobile`, **solo si cambia** respecto del primero. Si vale lo mismo, el token no lleva la extensión (el script lo marca como error).
- Tipos: `color` (hex de 6 u 8 dígitos), `dimension` (`px`), `fontWeight` (número), `fontFamily` (texto) y `typography` (solo en `role/*`).
- Los colores con transparencia salen como `rgba()` con el alpha redondeado a 2 decimales (`#1010101A` → `0.1`), porque el hex de Figma no da el porcentaje exacto. Los opacos quedan en hex.
- Los alias se escriben `{ruta.del.token}` y salen como `var(--arq-…)`.
- Un token no puede tener `dark` y `mobile` a la vez: el script corta con error (hoy los modos no se cruzan entre colecciones).
- Los estilos de texto `role/*` van en la rama `role` con `$type: typography` y **solo alias** en sus campos (familia, peso, tamaño, interlineado, tracking). No salen como variables: generan `roles.css`.
  - `fontSize` y `lineHeight` tienen que apuntar a `type/*` (Semantic · Type). En `roles.css` quedan como `var(--arq-type-<rol>-size)`, así el cambio a Mobile llega solo desde `tokens.css`.
  - `$extensions["arq.textTransform"]` (`uppercase`, por ejemplo en `role/label` y `role/label-sm`) genera `text-transform`.
  - Los `role/*` no llevan modos.
- Antes de convertir, `npm run tokens` valida todo el archivo (alias inexistentes, tipos, valores, modos, extensiones desconocidas). Si hay problemas, los lista y no escribe nada.
- Salida (`npm run tokens`): `:root` (base), `[data-arq-theme="dark"]` y `@media (max-width: 767px) { :root }`. Nunca `prefers-color-scheme`.
- Pendiente: conversor del export de variables de Figma a este formato (TODO).

### Variables de entorno

- `src/config.js` lee `import.meta.env.VITE_*`. Vite reemplaza los valores al compilar y quedan dentro de `dist/arq.js`: solo se usa la search-only key de Typesense.
