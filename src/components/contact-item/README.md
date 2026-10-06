# contact-item · `<arq-contact-item>`

Canal de contacto (Contacto): etiqueta y valor. El valor es un link.

- Figma: [1303-4340](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1303-4340) · ficha `doc/contact-item`

```html
<arq-contact-item href="mailto:info@macroled.com.ar"><span slot="label">Email</span>info@macroled.com.ar</arq-contact-item>
<arq-contact-item href="tel:+541100000000"><span slot="label">Teléfono</span>+54 11 0000-0000</arq-contact-item>
```

## Props

| Figma | Atributo / slot | Prop JS | Valores |
| --- | --- | --- | --- |
| Label | slot `label` | — | Tipo de canal, en caja normal (la mayúscula la pone `role/label`) |
| Value | slot por defecto | — | El dato tal cual se usa (número con código de área) |
| — | `href` | `href` | `mailto:`, `tel:` o `https:` (WhatsApp, mapa). Sin `href`, el valor es texto |

- **No son props:** Hover (subraya el valor) y Focus (anillo alrededor del ítem).
- Toma el ancho de su columna (en Contacto, hasta `layout/measure`).

## Tokens

| Parte | Token |
| --- | --- |
| Ítem | gap `space/gap/sm`, sin línea ni padding: la separación la pone la lista (decisiones.md, 2026-10-06). En el set, línea arriba y padding vertical `space/padding/lg` |
| Textos | etiqueta `role/label` en `color/text/tertiary` · valor `role/body-lg-regular` en `color/text/primary` |
| Subrayado (Hover) | `border/default`, a `space/padding/2xs` del texto |

## Pendientes

- `TODO` (Figma): el set todavía tiene la línea y el padding vertical.
