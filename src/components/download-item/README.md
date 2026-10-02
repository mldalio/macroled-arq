# download-item · `<arq-download-item>`

Opción del modal de descargas: texto + `icon/download`. Cada opción descarga su archivo directamente.

- Figma: [1101-5542](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1101-5542) · ficha `doc/download-item`

```html
<arq-download-item emphasis="featured">Ficha técnica</arq-download-item>
<arq-download-item href="https://…/kanu.ies">IES</arq-download-item>
```

## Props

| Figma | Atributo / slot | Prop JS | Valores · por defecto |
| --- | --- | --- | --- |
| Label | slot por defecto | — | Nombre del archivo ("IES", "CAD 2D/3D") |
| Emphasis | `emphasis` | `emphasis` | `default` · `featured`. Por defecto `default`. Featured es el archivo principal: la ficha técnica |
| — | `href` | `href` | URL del archivo (campos `ies`, `cad`, `manual`, `fotometria` de `docs/typesense-schema.md`) |

- **Con `href`** es un `<a download>`. **Sin `href`** es un `<button>` que emite `arq:download`: la ficha técnica se genera al hacer clic (decisión 2026-10-02 · Ficha técnica en PDF).
- **Si un archivo falta,** la página no pone la opción.
- **No son props:** State=Hover y State=Focus (CSS). Default: Hover subraya el texto (como dice la descripción; la variante del set se corrigió). Featured: Hover `color/surface/faint`.
- Default lleva `role="listitem"` (va en la lista del modal); Featured no.

## Tokens

| Parte | Token |
| --- | --- |
| Texto · ícono | `role/body-xl` en `color/text/primary` · `icon/md` en `color/icon/primary`, gap `space/gap/md` |
| Default | padding vertical `space/padding/md`; línea inferior `border/default` en `color/border/subtle` (se descuenta del padding: 60 · Mobile 56) |
| Featured | caja `border/default` en `color/border/strong`, padding `space/padding/md` × `space/padding/lg` |
| Hover | Default: subrayado `border/default`; Featured: `color/surface/faint` |
| Foco | `border/strong` en `color/border/focus`, separado 2 px |
