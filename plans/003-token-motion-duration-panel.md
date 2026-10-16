# 003 — Un token para la duración de los paneles en lugar de `slow × 1,25` repetido cuatro veces

- **Status**: DONE (2026-10-15, rama feat/contacto-descargas-pulido)
- **Commit**: 6833c6b
- **Severity**: LOW
- **Category**: Coherencia y tokens
- **Estimated scope**: Figma (1 variable) + pipeline de tokens + 4 archivos CSS

## Problem

La misma derivación está escrita cuatro veces, cada una con su propio `TODO`:

```css
/* src/components/filter-panel/filter-panel.css:16 */
--panel-slow: calc(var(--arq-motion-duration-slow) * 1.25); /* TODO: token propio, igual que search-sheet */
/* src/components/download-modal/download-modal.css:46 */
--panel-slow: calc(var(--arq-motion-duration-slow) * 1.25); /* TODO: token propio, igual que filter-panel y search-sheet */
/* src/components/navbar/navbar.css:9 */
--mega-slow: calc(var(--arq-motion-duration-slow) * 1.25);
/* src/components/search-sheet/search-sheet.css:344 */
--sheet-slow: calc(var(--arq-motion-duration-slow) * 1.25);
```

Si alguien cambia `slow`, los paneles cambian sin querer; y las reglas del proyecto (AGENTS.md · Tokens) piden no dejar valores derivados sin token.

## Target

Una variable nueva en Figma, en la colección **2 · Semantic · Motion** (id `VariableCollectionId:1564:5647`, modo `Value` = `1564:0`):

| Nombre | Tipo | Valor | Scopes | Code syntax WEB | Descripción |
| --- | --- | --- | --- | --- | --- |
| `motion/duration/panel` | FLOAT | 400 | `[]` | `var(--arq-motion-duration-panel)` | Entrada y salida de paneles y menús que se abren por encima (filter-panel, download-modal, search-sheet, mega-menú). En ms. Con prefers-reduced-motion: 0. |

Y en el código, en los cuatro lugares: `var(--arq-motion-duration-panel)` en lugar de `calc(var(--arq-motion-duration-slow) * 1.25)`.

## Repo conventions to follow

- Los tokens **solo se cambian en Figma** (AGENTS.md · Tokens). Pipeline documentado en `docs/setup.md`, Parte 6: exportar la colección con `scripts/figma/export-variables.figma.js` (por `use_figma`, solo lectura) → guardar la respuesta → `node scripts/figma/rows-to-dtcg.js <respuesta.json>` → `npm run tokens:import` → `npm run tokens`.
- `scripts/import-tokens.js` tiene la lista `REDUCED_MOTION` de las duraciones que pasan a 0: sumar `'motion.duration.panel'`.
- Ejemplo de un token de movimiento agregado así: `motion/duration/expand` (decisiones.md, 2026-10-15 · Contacto: animaciones).

## Steps

1. **Figma** (requiere permiso para escribir en el archivo `djAb2r3otXYOjEJjHiuKnF`): crear `motion/duration/panel` con los datos de la tabla de **Target**.
2. Exportar la colección Motion y correr el pipeline (ver convenciones). `tokens:import` tiene que listar un solo token nuevo.
3. `scripts/import-tokens.js`: agregar `'motion.duration.panel'` a `REDUCED_MOTION` y volver a correr `npm run tokens:import` y `npm run tokens`. Comprobar en `src/styles/tokens.css` que `--arq-motion-duration-panel: 400ms` está en `:root` y en `0ms` dentro de `@media (prefers-reduced-motion: reduce)`.
4. En los cuatro archivos, reemplazar la fórmula por el token y borrar el `TODO`:
   - `filter-panel.css`: `--panel-slow: var(--arq-motion-duration-panel);`
   - `download-modal.css`: lo mismo.
   - `navbar.css:9`: `--mega-slow: var(--arq-motion-duration-panel);` (y borrar el comentario de la línea 8).
   - `search-sheet.css:344`: `--sheet-slow: var(--arq-motion-duration-panel);` (y actualizar los comentarios de las líneas 29 y 343).
5. DESIGN.md §6, tabla de Movimiento: sumar la fila `motion/duration/panel | 400 ms | Entrada y salida de paneles (filter-panel, download-modal, search-sheet, mega-menú)`; y la misma línea en la copia del frame DESIGN.md (página Plan del proyecto, nodo de texto `1502:5640`), reemplazando solo esa tabla.

## Boundaries

- No cambia ningún valor visible (400 ms = 320 × 1,25): si algo se ve distinto, hay un error.
- No tocar otras duraciones.

## Verification

- **Mecánica**: `grep -rn "slow) \* 1.25" src` no devuelve nada; `npm run build` sin errores.
- **Feel check**: filtros de Descargas, modal de descargas, buscador del navbar y mega-menú se abren y cierran igual que antes.
- **Done when**: la variable existe en Figma, en `tokens.css` (400 ms y 0 con reduced motion) y los cuatro componentes la usan.
