# 005 — El pliegue de catalog-nav-group dura según cuánto se mueve

- **Status**: DONE (2026-10-27, rama `fix/catalog-nav-scroll-viewport`). Dos cambios respecto del plan: el chevron no usa `--slide-duration`, porque cuando corre `#slide` su transition de CSS ya arrancó; lo anima `#slide` con WAAPI desde el ángulo en que esté. Y el alto del ítem se mide en el clic (`#measureItem`), porque al cerrar la lista ya está oculta y daba 0. Después Lau lo pidió un poco más lento: abrir pasó a `slow` → `fold` (320 → 500 ms, token nuevo en Figma) y cerrar a `expand` → `panel` (250 → 400 ms).
- **Commit**: 05cc5c0 (con los cambios sin commitear de la rama `fix/catalog-nav-scroll-viewport`: la lista de Colecciones ya no se corta en 9 ítems y medio)
- **Severity**: HIGH
- **Category**: Easing & duration
- **Estimated scope**: 2 archivos de código (`catalog-nav-group.js`, `catalog-nav-group.css`) + docs

## Problem

Al abrir o cerrar un grupo del sidebar de Productos, la lista cambia de golpe y los grupos de abajo vuelven desde donde estaban con `transform`. Ese desplazamiento dura siempre `motion/duration/expand` (250 ms), sin importar cuánto se mueve:

```js
/* src/components/catalog-nav-group/catalog-nav-group.js:82 — actual */
  #slide(before) {
    if (before === null) return;
    const styles = getComputedStyle(this);
    const duration = Number.parseFloat(styles.getPropertyValue('--arq-motion-duration-expand')) || 0;
    if (!duration) return;
    …
    const delta = before - this.getBoundingClientRect().height + current;
    if (!delta) return;
    const options = { duration, easing: styles.getPropertyValue('--arq-motion-easing-standard').trim() || 'ease-out' };
    const from = [{ transform: `translateY(${delta}px)` }, { transform: 'none' }];
    group.animate(from, { ...options, pseudoElement: '::after' });
    for (const element of below) element.animate(from, options);
    if (this.open) items.animate([{ clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0)' }], options);
  }
```

```css
/* src/components/catalog-nav-group/catalog-nav-group.css:69 — actual */
.icon {
  transition: rotate var(--arq-motion-duration-expand) var(--arq-motion-easing-standard);
}
```

- Con Interior (4 o 5 ítems, unos 150 px) 250 ms está bien. Con Colecciones (15 colecciones, unos 500 px), los grupos de abajo y el `clip-path` de la lista recorren 500 px en el mismo tiempo. `motion/easing/standard` (`cubic-bezier(0.2, 0, 0, 1)`) hace casi todo el recorrido en el primer tercio, así que la lista se descubre en unos 90 ms. Se ve como un salto, no como un despliegue.
- Esto ya pasó antes. `docs/decisiones.md`, 2026-10-19 · Navbar fijo en los listados (Listas largas del sidebar): «la lista se descubría en 250 ms sobre un recorrido muy largo (se veía demasiado rápido)». Se resolvió cortando la lista en 9 ítems y medio. Ese corte se sacó el 2026-10-27 (Sidebar a la altura de la pantalla), así que el problema volvió.
- DESIGN.md §6 dice que catalog-nav-group se pliega «como el pliegue de compare-bar», pero compare-bar usa `motion/duration/panel` (400 ms; `src/components/compare-bar/compare-bar.js:189`) y catalog-nav-group usa `expand` (250 ms).

## Target

La duración sale del recorrido (`|delta|`), medido en alturas de ítem, entre tokens que ya existen. No se crea ningún token: los tokens solo se cambian en Figma.

| | Recorrido corto (≤ 4 ítems) | Recorrido largo (≥ 15 ítems) | En el medio |
| --- | --- | --- | --- |
| Abrir | `motion/duration/expand` (250 ms) | `motion/duration/panel` (400 ms) | interpolación lineal |
| Cerrar | `motion/duration/expand` (250 ms) | `motion/duration/slow` (320 ms) | interpolación lineal |

- **Cerrar dura menos que abrir:** es la convención del repo («la salida es más corta», descripción de `motion/duration/panel`) y la regla de tiempos asimétricos: la respuesta del sistema es más rápida.
- **Curva:** sigue `motion/easing/standard`. Es la de compare-bar y la que eligió Lau el 2026-10-19; no se cambia.
- **Chevron:** gira con la misma duración que el desplazamiento.
- **Reduced motion:** `expand` vale 0, entonces no hay desplazamiento; queda el fundido de Disclosure. Igual que hoy.
- **Interrupción:** si se toca a mitad del desplazamiento, sigue arrancando desde donde se ve. Esa parte del código no se toca.

```js
/* target — src/components/catalog-nav-group/catalog-nav-group.js, en #slide */
    const ms = (name) => Number.parseFloat(styles.getPropertyValue(name)) || 0;
    const short = ms('--arq-motion-duration-expand');
    if (!short) return; // reduced motion: expand vale 0
    …
    const delta = before - this.getBoundingClientRect().height + current;
    if (!delta) return;
    // Recorrido en alturas de ítem: hasta 4 ítems, expand; desde 15, panel
    // al abrir y slow al cerrar (la salida es más corta); en el medio, lineal.
    const itemHeight = this.querySelector(':scope > arq-catalog-nav-item')?.offsetHeight || Math.abs(delta);
    const progress = Math.min(Math.max((Math.abs(delta) / itemHeight - 4) / (15 - 4), 0), 1);
    const long = ms(this.open ? '--arq-motion-duration-panel' : '--arq-motion-duration-slow');
    const duration = Math.round(short + (long - short) * progress);
    this.style.setProperty('--slide-duration', `${duration}ms`);
    const options = { duration, easing: styles.getPropertyValue('--arq-motion-easing-standard').trim() || 'ease-out' };
```

```css
/* target — src/components/catalog-nav-group/catalog-nav-group.css */
.icon {
  transition: rotate var(--slide-duration, var(--arq-motion-duration-expand)) var(--arq-motion-easing-standard);
}
```

## Repo conventions to follow

- Las duraciones se leen de los tokens con `getComputedStyle(...).getPropertyValue('--arq-motion-duration-…')`, como hace hoy `#slide` y `src/components/compare-bar/compare-bar.js:189`. No se escriben números de ms en el código. Los únicos números nuevos son los umbrales en ítems (4 y 15) y van comentados.
- Las variables CSS locales de un componente no llevan prefijo `--arq-` y viven en el host (por ejemplo, `--page-gutter` en `ArqElement`). `--slide-duration` se pone en el host con `this.style.setProperty`.
- Comentarios en español, en el tono de los que ya tiene el archivo.

## Steps

1. En `src/components/catalog-nav-group/catalog-nav-group.js`, dentro de `#slide(before)`:
   - Cambiar `const duration = …expand… ; if (!duration) return;` por el helper `ms`, `const short = ms('--arq-motion-duration-expand'); if (!short) return;`.
   - Después de `if (!delta) return;`, agregar el cálculo de `itemHeight`, `progress`, `long` y `duration`, más el `setProperty('--slide-duration', …)`, tal como está en Target.
   - No tocar el resto: `options`, los `animate` y la cancelación de animaciones en curso quedan igual.
   - Actualizar el comentario de arriba de `#slide`, que hoy dice «Con reduced motion expand vale 0…», para que diga que la duración va de expand a panel (abrir) o a slow (cerrar) según el recorrido.
2. En `src/components/catalog-nav-group/catalog-nav-group.css:69`, cambiar la `transition` de `.icon` por la de Target. Actualizar el comentario de arriba («con el mismo tiempo y la misma curva que el deslizamiento»): el tiempo ahora lo pone el JS en `--slide-duration`.
3. En `docs/decisiones.md`, sumar una viñeta en «2026-10-19 · Navbar fijo en los listados», después de «Sidebar a la altura de la pantalla (2026-10-27)». Debe decir: **Pliegue según el recorrido (2026-10-27)**, con la tabla de duraciones de Target en una frase y el motivo (la lista larga se descubría en unos 90 ms).
4. En `src/components/catalog-nav-group/README.md`, donde describe el pliegue, cambiar `motion/duration/expand` por la regla nueva.
5. **No editar DESIGN.md en esta rama.** DESIGN.md §6 (línea «catalog-nav-group no anima el alto… (`motion/duration/expand`, `motion/easing/standard`)») hay que cambiarlo en una rama `docs/` y actualizar la copia en Figma (Plan del proyecto). Dejarlo anotado en el mensaje final como pendiente.

## Boundaries

- No tocar `src/base/disclosure.js` (el fundido de la lista) ni compare-bar.
- No tocar `src/styles/tokens.css` ni crear tokens.
- No cambiar la curva (`motion/easing/standard`) ni el mecanismo (`transform` + `clip-path`; no animar `height`).
- No tocar el sidebar en filter-panel (hasta 1023 px): ahí el grupo es una copia y se comporta igual con este mismo código; no hace falta nada aparte.
- Si el código de `#slide` no coincide con el extracto (cambió desde este plan), parar y avisar.

## Verification

- **Mecánica:** `npm run build` sin errores; `demo/productos.html` sin errores en consola.
- **Feel check** (Chrome, 1280 px de ancho; DevTools → Animations al 10 %):
  - Abrir Interior: dura unos 250 ms, como antes.
  - Abrir Colecciones (15 ítems): unos 400 ms. La lista se descubre de arriba abajo de forma pareja, sin «salto» en los primeros cuadros.
  - Cerrar Colecciones: unos 320 ms, un poco más corto que abrir.
  - El chevron termina de girar a la vez que los grupos llegan a su lugar.
  - Tocar Colecciones dos veces rápido: la segunda arranca desde donde se ve, sin volver a empezar.
  - Rendering → `prefers-reduced-motion: reduce`: sin desplazamiento ni giro animado; la lista aparece con el fundido.
  - Con la barra del sidebar a la vista (pantalla baja, plan de `fix/catalog-nav-scroll-viewport`): no asoma la barra mientras se pliega.
- **Done when:** las duraciones medidas en el panel Animations coinciden con la tabla de Target (±10 ms) para Interior y Colecciones, abriendo y cerrando.
