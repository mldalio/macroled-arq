# collection-index · `<arq-collection-index>`

Lista de colecciones del Home, debajo de «Diseño que inspira». El nombre activo lleva líneas arriba y abajo; su foto está a la derecha. No está en Figma: adapta una referencia de lista + foto a los tokens de Arq, sin trama de fondo.

```html
<arq-collection-index>
  <a href="/arq/productos?collection=kanu">
    <img src="…" alt="Colección Kanu">
    Kanu
  </a>
  <a href="/arq/productos?collection=douli">
    <img src="…" alt="Colección Douli">
    Douli
  </a>
  <arq-button slot="action" type="outline" href="/arq/productos" data-arq-menu="colecciones">Ver todo</arq-button>
</arq-collection-index>
```

Pasar el mouse o enfocar un nombre cambia la foto. El primero arranca visible. En táctil, el primer toque muestra la foto y el segundo abre la colección. Con `prefers-reduced-motion` el cambio es instantáneo.

## Props y slots

| Atributo / slot | Contenido |
| --- | --- |
| slot por defecto | un `<a href>` por colección, con un `<img>` y el nombre |
| slot `action` | el botón «Ver todo» |

## Tokens

| Parte | Token |
| --- | --- |
| Nombres | `role/display-sm`. Activo: `color/text/primary` y líneas `border/strong` en `color/border/strong`. Resto: `color/text/tertiary` |
| Foto | `ratio/landscape` (5:4), `object-fit: cover`, fondo `color/surface/subtle` |
| Cambio de foto | `motion/duration/slow` |
| Columnas | `space/gap/4xl`. En Mobile la foto queda arriba |

`TODO` (diseño): no hay set en Figma ni token propio del bloque.
