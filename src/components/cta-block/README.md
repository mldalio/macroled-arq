# cta-block · `<arq-cta-block>`

Bloque de cierre de página, con fondo `color/bg/subtle` a sangre. Último bloque antes del footer; uno por página. Type=Button deriva a una acción (Contacto, Comparativa); Type=Newsletter lleva un email + button (Home).

- Figma: [1265-4464](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1265-4464) · ficha `doc/cta-block` (`1455:7747`)

```html
<arq-cta-block>
  <h2 slot="title">¿Necesitás ayuda para elegir?</h2>
  <span slot="description">Nuestro equipo técnico te asesora.</span>
  <arq-button slot="action" show-icon icon="arrow-right" href="/arq/contacto">Hablar con un asesor</arq-button>
</arq-cta-block>

<arq-cta-block type="newsletter">
  <h2 slot="title">Novedades para estudios</h2>
  <span slot="description">Lanzamientos y fichas técnicas, una vez por mes.</span>
  <arq-input slot="email" name="email" input-type="email" placeholder="Tu email profesional" autocomplete="email" required>Email</arq-input>
  <arq-button slot="action">Suscribirme</arq-button>
</arq-cta-block>
```

## Props y slots

| Figma | Atributo / slot | Prop JS | Valores · por defecto |
| --- | --- | --- | --- |
| Type | `type` | `type` | `button` · `newsletter` (def. `button`) |
| Title | slot `title` | — | un `<h2>` con el título |
| Description | slot `description` | — | texto, una línea con el beneficio. Sin contenido, no se muestra |
| (button expuesto) | slot `action` | — | un `<arq-button>`: Filled por defecto; Outline si la acción es secundaria |
| (input expuesto) | slot `email` | — | solo Newsletter: un `<arq-input input-type="email" required>` sin `show-label` (el label queda para lectores de pantalla) |
| Breakpoint | — | — | media query: hasta 767 px es Mobile |

- **El `<h2>` va en el HTML de la página** (`<h2 slot="title">`), no dentro del Shadow DOM. El componente le da `role/heading-2` y el color con `::slotted(h2)`.
- Aplica su propio `layout/gutter`: el fondo llega a los bordes y la página no le suma margen lateral.

## Newsletter

- Al tocar el button o con Enter en el email, el componente corre la validación nativa del `arq-input` (`required` + `input-type="email"`). Si no pasa, muestra el mensaje del navegador y deja el foco en el campo.
- Si pasa, emite **`arq:submit`** con `{ email }`. **No envía nada**: el envío a n8n y la respuesta con `form-message` llegan con el envío de formularios (`TODO`, ver Pendientes).

```js
document.addEventListener('arq:submit', (event) => {
  if (event.target.localName === 'arq-cta-block') console.log(event.detail.email);
});
```

## Layout

| | Desktop | Mobile |
| --- | --- | --- |
| Armado | texto a la izquierda, acción a la derecha, centrados | todo apilado a `space/gap/xl` |
| Bajada | hasta `layout/measure-wide` | ancho completo |
| Email | `layout/measure` de ancho, a `space/gap/md` del button | ancho completo, a `space/gap/xl` del button |
| Button | ancho de su texto | ancho completo |
| Padding | `space/section/md` arriba y abajo, `layout/gutter` a los lados | ídem (valores Mobile) |

## Tokens

| Parte | Token |
| --- | --- |
| Fondo | `color/bg/subtle` |
| Título | `color/text/primary` · `role/heading-2` |
| Bajada | `color/text/secondary` · `role/body-lg` |
| Gap título–bajada | `space/gap/sm-md` |
| Gap texto–acción | `space/gap/xl` |
| Gap email–button (Desktop) | `space/gap/md` |

## Pendientes

- `TODO` (formularios): el envío de la newsletter a n8n y el `form-message` de respuesta. Falta definir el webhook (en `src/config.js` hay uno solo, el de contacto) y construir el envío de formularios (`arq-button submit`, `docs/decisiones.md`).
- `TODO` (diseño): en el set el email mide 380 fijos y no hay token; se usa `layout/measure` (400).
- La ficha `doc/cta-block` dice gap título–bajada `space/gap/sm` (8) y email–button `space/gap/sm-md` (12); el set usa 12 y 16 y se sigue el set. Falta corregir la ficha.
