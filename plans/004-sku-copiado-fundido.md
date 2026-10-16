# 004 — «Copiado» del sku aparece con un fundido corto

- **Status**: DONE (2026-10-15, rama feat/contacto-descargas-pulido)
- **Commit**: 6833c6b
- **Severity**: LOW
- **Category**: Oportunidad que falta
- **Estimated scope**: 1 archivo CSS, unas 15 líneas

## Problem

En Descargas (cada fila y el modal) y en la ficha, al copiar un SKU el ícono se cambia por «Copiado» de golpe. Es una confirmación (para qué: feedback, se usa algunas veces por visita), y el cambio instantáneo de ícono a texto se lee como un salto.

```css
/* src/components/sku/sku.css (bloque «State=Copied») — actual */
.copied,
.failed {
  display: none;
  /* … */
  color: var(--arq-color-text-success);
}
:host([copied]) .copy,
:host(:state(copy-failed)) .copy {
  display: none;
}
:host([copied]) .copied,
:host(:state(copy-failed)) .failed {
  display: inline;
}
```

## Target

Solo la entrada de «Copiado» (y del aviso de falla) funde con `motion/duration/fade` y `motion/easing/out`. Sin desplazamiento: está dentro de una fila de tabla. La vuelta al ícono sigue instantánea.

```css
/* target — en sku.css, después de las reglas de display de .copied / .failed */
.copied,
.failed {
  transition-property: opacity, color;
  transition-duration: var(--arq-motion-duration-fade), var(--arq-motion-duration-fast);
  transition-timing-function: var(--arq-motion-easing-out);
}

@starting-style {
  :host([copied]) .copied,
  :host(:state(copy-failed)) .failed {
    opacity: 0;
  }
}
```

`motion/duration/fade` no cambia con reduced motion: el fundido se queda, como pide DESIGN.md §6.

## Repo conventions to follow

- Ejemplo de entrada con `@starting-style` en un elemento interno (Chrome no la aplica al `:host`): `src/components/form-message/form-message.css`.
- `sku.js` mide el tiempo visible con `--arq-motion-duration-feedback`: no tocar.

## Steps

1. `src/components/sku/sku.css`: agregar el bloque de **Target** justo después de `:host([copied]) .copied, :host(:state(copy-failed)) .failed { display: inline; }`.
2. En el comentario «State=Copied» sumar: «Entra con un fundido (motion/duration/fade); vuelve al ícono sin animación.»

## Boundaries

- No cambiar `sku.js` ni la duración del aviso.
- No agregar `transform`.

## Verification

- **Mecánica**: `npm run build`; `npm run dev` sin errores en consola.
- **Feel check**: en `/demo/descargas.html`, clic en el ícono de copiar de un SKU: «Copiado» aparece fundiéndose en ~150 ms y a los 2 s vuelve el ícono de golpe. Al 10 % en el panel Animations, solo cambia `opacity`. Con reduced motion, igual (el fundido se queda).
- **Done when**: la entrada de «Copiado» funde y nada más cambió.
