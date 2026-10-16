# 001 — Con reduced motion, filter-panel y download-modal funden en vez de aparecer de golpe

- **Status**: DONE (2026-10-15, rama feat/contacto-descargas-pulido)
- **Commit**: 6833c6b
- **Severity**: MEDIUM
- **Category**: Accesibilidad
- **Estimated scope**: 2 archivos CSS, unas 30 líneas

## Problem

DESIGN.md §6 · Movimiento (aprobado el 2026-10-15) dice: con `prefers-reduced-motion: reduce` se quitan desplazamientos, escalas y cambios de alto, **pero quedan los fundidos** (`motion/duration/fade`, 150 ms, que no pasa a 0). Los dos paneles de Descargas no lo cumplen: su duración sale de `--panel-slow`, que es `motion/duration/slow × 1,25`; `slow` vale 0 con reduced motion, así que el panel, el scrim y el contenido aparecen y desaparecen de golpe.

```css
/* src/components/filter-panel/filter-panel.css:15-60 — actual (resumen) */
:host {
  --panel-slow: calc(var(--arq-motion-duration-slow) * 1.25); /* TODO: token propio, igual que search-sheet */
}
.dialog {
  /* … */
  clip-path: inset(0 0 0 100%);
  transition: clip-path var(--panel-slow) var(--arq-motion-easing-standard);
}
.dialog.is-open { clip-path: inset(0); }
.dialog::backdrop {
  background: var(--arq-color-overlay-scrim);
  opacity: 0;
  transition: opacity var(--panel-slow) var(--arq-motion-easing-standard);
}
.dialog.is-open::backdrop { opacity: 1; }
.sheet {
  opacity: 0;
  transition: opacity var(--arq-motion-duration-slow) var(--arq-motion-easing-standard);
}
.dialog.is-open .sheet { opacity: 1; }
```

```css
/* src/components/download-modal/download-modal.css:45-80 — actual (resumen) */
:host {
  --panel-slow: calc(var(--arq-motion-duration-slow) * 1.25);
}
.dialog::backdrop {
  opacity: 0;
  transition: opacity var(--panel-slow) var(--arq-motion-easing-standard);
}
.dialog.is-open::backdrop { opacity: 1; }
.sheet {
  opacity: 0;
  transform: translateY(2%);
  transition-property: opacity, transform;
  transition-duration: var(--panel-slow);
  transition-timing-function: var(--arq-motion-easing-standard);
}
.dialog.is-open .sheet { opacity: 1; transform: none; }
/* Mobile, dentro de @media (max-width: 767px): */
:host([show-product]) .sheet { /* … */ opacity: 1; transform: translateY(100%); }
:host([show-product]) .dialog.is-open .sheet { transform: none; }
```

Los JS esperan la transición antes de cerrar el `<dialog>` leyendo `transitionDuration` del elemento que anima:

- `src/components/filter-panel/filter-panel.js:211` lee `getComputedStyle(dialog).transitionDuration` (el `<dialog>`).
- `src/components/download-modal/download-modal.js:159` y `:167` leen `getComputedStyle(sheet).transitionDuration` (el `.sheet`), y la entrada termina con el `transitionend` de la propiedad `transform` (`download-modal.js:151-160`).

## Target

Con reduced motion: sin persiana (`clip-path`) ni desplazamiento (`transform`); el panel, su contenido y el scrim funden con `motion/duration/fade` y `motion/easing/out`. Sin reduced motion, nada cambia.

```css
/* target — al final de src/components/filter-panel/filter-panel.css */
/* Reduced motion (DESIGN.md §6): sin persiana, queda el fundido
   (motion/duration/fade). La duración va en .dialog porque el JS la lee de
   ahí para cerrar (filter-panel.js #closeDialog). */
@media (prefers-reduced-motion: reduce) {
  .dialog {
    clip-path: none;
    opacity: 0;
    transition: opacity var(--arq-motion-duration-fade) var(--arq-motion-easing-out);
  }

  .dialog.is-open {
    opacity: 1;
  }

  .dialog::backdrop,
  .sheet {
    transition: opacity var(--arq-motion-duration-fade) var(--arq-motion-easing-out);
  }
}
```

```css
/* target — al final de src/components/download-modal/download-modal.css */
/* Reduced motion (DESIGN.md §6): sin desplazamiento, queda el fundido
   (motion/duration/fade). transform sigue en la lista, en 0, para que el
   JS reciba su transitionend y habilite el scroll (is-settled). */
@media (prefers-reduced-motion: reduce) {
  .sheet,
  :host([show-product]) .sheet {
    opacity: 0;
    transform: none;
    transition-property: opacity, transform;
    transition-duration: var(--arq-motion-duration-fade), 0s;
    transition-timing-function: var(--arq-motion-easing-out);
  }

  .dialog.is-open .sheet,
  :host([show-product]) .dialog.is-open .sheet {
    opacity: 1;
  }

  .dialog::backdrop {
    transition: opacity var(--arq-motion-duration-fade) var(--arq-motion-easing-out);
  }
}
```

**Ojo con download-modal**: como `transform` no cambia (vale `none` siempre), no hay `transitionend` de `transform`. `#showDialog` ya cubre ese caso: `if (!parseFloat(getComputedStyle(sheet).transitionDuration)) settle();`. Pero `parseFloat("0.15s, 0s")` da 0.15, no 0, y se quedaría esperando un evento que nunca llega (el `<dialog>` quedaría sin scroll). Por eso el paso 3 cambia `settle` para que escuche también `opacity`.

## Repo conventions to follow

- Tokens de movimiento en `src/styles/tokens.css` (generados, no se editan): `--arq-motion-duration-fade` (150 ms, no cambia con reduced motion) y `--arq-motion-easing-out` (`cubic-bezier(0.23, 1, 0.32, 1)`).
- Ejemplo a imitar: el fundido de reduced motion de form-message, `src/components/form-message/form-message.css` (bloque `@media (prefers-reduced-motion: reduce)`).
- Comentarios en castellano, como el resto del CSS.

## Steps

1. `src/components/filter-panel/filter-panel.css`: pegar al final el primer bloque de **Target**.
2. `src/components/download-modal/download-modal.css`: pegar al final el segundo bloque de **Target** (después del `@media (max-width: 767px)` del show-product, para que gane).
3. `src/components/download-modal/download-modal.js`, en `#showDialog`, cambiar la condición del `settle` para que acepte `transform` u `opacity`:
   ```js
   // antes
   if (event && (event.target !== sheet || event.propertyName !== 'transform')) return;
   // después
   if (event && (event.target !== sheet || !['transform', 'opacity'].includes(event.propertyName))) return;
   ```
4. Actualizar los comentarios que dicen «Con reduced motion las duraciones valen 0» en los dos CSS (filter-panel.css:12-14 y download-modal.css:42-44) para que digan «Con reduced motion queda solo el fundido (motion/duration/fade)».

## Boundaries

- No tocar `search-sheet` ni `navbar` (tienen su propia persiana; se revisan aparte).
- No cambiar la animación sin reduced motion.
- No agregar tokens: `fade` y `easing/out` ya existen.
- Si el código no coincide con lo citado (cambió después de 6833c6b), frenar e informar.

## Verification

- **Mecánica**: `npm run build` sin errores; `npm run dev` y abrir `/demo/descargas.html` sin errores en consola.
- **Feel check** (DevTools → Rendering → Emulate `prefers-reduced-motion: reduce`):
  - Filtros: el panel aparece fundiéndose en su lugar, sin barrerse desde la derecha; al cerrar, funde y recién ahí desaparece.
  - Ícono de descarga de una fila (Desktop) y «Descargas» de una tarjeta (390 px): el modal y su scrim funden, sin subir.
  - En 390 px con muchos archivos (`?data=worst`, primera fila), el modal se puede desplazar después de abrir (quedó `is-settled`).
  - Sin reduced motion: todo igual que antes (persiana en filtros, hoja que sube en el modal Mobile).
  - Animations panel al 10 %: con reduced motion solo se ve `opacity`.
- **Done when**: con reduced motion ningún panel aparece de golpe ni se desplaza, y el modal se puede desplazar después de abrir.
