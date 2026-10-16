# 002 — Con reduced motion, el fundido de los desplegables y de la primera carga de Descargas no desaparece

- **Status**: DONE (2026-10-15, rama feat/contacto-descargas-pulido)
- **Commit**: 6833c6b
- **Severity**: LOW
- **Category**: Accesibilidad
- **Estimated scope**: 2 archivos, unas 20 líneas

## Problem

Criterio de DESIGN.md §6 · Movimiento: con reduced motion quedan los fundidos (`motion/duration/fade`, que no pasa a 0). Dos fundidos usan `motion/duration/base`, que vale 0 con reduced motion, así que desaparecen:

```js
// src/base/disclosure.js:42-52 — actual (hoja que adopta cada desplegable: filter-row, accordion-item, catalog-nav-group…)
[data-disclosure-panel=''] {
  transition-property: opacity, color, background-color, border-color, outline-color, text-decoration-color, fill, stroke;
  transition-duration: var(--arq-motion-duration-base);
  transition-timing-function: var(--arq-motion-easing-standard);
}
@starting-style {
  [data-disclosure-panel='']:not([hidden]) { opacity: 0; }
}
```

```css
/* src/components/downloads-table/downloads-table.css (bloque «Primera carga», justo antes de «── Tabla (Desktop)») — actual */
.reveal {
  transition-property: opacity, color, background-color, border-color, outline-color, text-decoration-color, fill, stroke;
  transition-duration: var(--arq-motion-duration-base);
  transition-timing-function: var(--arq-motion-easing-standard);
}
```

## Target

Con reduced motion, la opacidad dura `motion/duration/fade` y los colores siguen en `motion/duration/fast` (que con reduced motion vale 0). `transition-duration` se aplica en el mismo orden que `transition-property`, así que hacen falta ocho valores: el primero para `opacity` y siete para los colores.

```css
/* target — en disclosureCss (src/base/disclosure.js), después del @starting-style */
@media (prefers-reduced-motion: reduce) {
  [data-disclosure-panel=''] {
    transition-duration: var(--arq-motion-duration-fade), var(--arq-motion-duration-fast), var(--arq-motion-duration-fast), var(--arq-motion-duration-fast), var(--arq-motion-duration-fast), var(--arq-motion-duration-fast), var(--arq-motion-duration-fast), var(--arq-motion-duration-fast);
    transition-timing-function: var(--arq-motion-easing-out);
  }
}
```

```css
/* target — en downloads-table.css, después de la regla .reveal */
@media (prefers-reduced-motion: reduce) {
  .reveal {
    transition-duration: var(--arq-motion-duration-fade), var(--arq-motion-duration-fast), var(--arq-motion-duration-fast), var(--arq-motion-duration-fast), var(--arq-motion-duration-fast), var(--arq-motion-duration-fast), var(--arq-motion-duration-fast), var(--arq-motion-duration-fast);
    transition-timing-function: var(--arq-motion-easing-out);
  }
}
```

**Ojo con downloads-table**: `#reveal()` en `downloads-table.js` quita la clase cuando llega el `transitionend` de `opacity`, y si `parseFloat(getComputedStyle(targets[0]).transitionDuration)` es 0 la quita en el cuadro siguiente. Con este cambio la primera duración pasa a 150 ms, así que llega el `transitionend` y anda solo. Comprobarlo en la verificación.

## Repo conventions to follow

- Tokens en `src/styles/tokens.css`: `--arq-motion-duration-fade` (150 ms, no cambia), `--arq-motion-duration-fast` (120 ms, 0 con reduced motion), `--arq-motion-easing-out`.
- Ejemplo: el bloque de reduced motion del panel `animateHeight` en `src/base/disclosure.js` (mismo archivo, `[data-disclosure-panel='height']`).

## Steps

1. `src/base/disclosure.js`: dentro del string `disclosureCss`, después del bloque `@starting-style { [data-disclosure-panel='']… }`, agregar el primer bloque de **Target**.
2. Actualizar el comentario de cabecera de `disclosure.js` («Con prefers-reduced-motion la duración vale 0») → «Con prefers-reduced-motion queda el fundido de motion/duration/fade».
3. `src/components/downloads-table/downloads-table.css`: después de la regla `.reveal { … }`, agregar el segundo bloque de **Target**, y en el comentario de arriba cambiar «Con reduced motion la duración vale 0» por «Con reduced motion queda el fundido (motion/duration/fade)».

## Boundaries

- No tocar el panel `animateHeight` (faq-item): ya cumple.
- No tocar la hoja base de ArqElement (`src/base/arq-element.js`): los cambios de color sí pasan a 0 con reduced motion, y está bien.
- Si el código no coincide con lo citado, frenar e informar.

## Verification

- **Mecánica**: `npm run build`; `npm run dev` sin errores en consola.
- **Feel check** con `prefers-reduced-motion: reduce` emulado:
  - Descargas → Filtros → abrir «Montaje»: las opciones funden (150 ms) en lugar de aparecer de golpe.
  - Recargar `/demo/descargas.html`: la tabla funde al reemplazar las filas de carga, y después de terminar ya no tiene la clase `reveal` (DevTools → Elements).
  - Buscar algo: las filas cambian sin fundido (el fundido es solo de la primera carga).
- **Done when**: con reduced motion los dos fundidos duran 150 ms y los colores cambian de golpe.
