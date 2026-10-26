# featured-products · `<arq-featured-products>`

Productos elegidos a mano para el Home ("Productos destacados"). El embed lista un link por grupo y el componente arma las `product-card` con los datos del catálogo. Pantallas: Final, Home (`1203:9846` · `1204:10062`). Decisión: `docs/decisiones.md`, 2026-10-02 · Home.

```html
<arq-featured-products>
  <a href="/arq/producto/kanu-jardin" data-group="kanu-jardin">Kanu Jardín</a>
  <a href="/arq/producto/douli-colgante" data-group="douli-colgante">Douli</a>
</arq-featured-products>
```

## Props y slots

| Atributo / slot | Contenido |
| --- | --- |
| `layout` | `side` (def.) texto al lado de las tarjetas · `stacked` título arriba, controles a la derecha y tarjetas debajo |
| slot por defecto | un `<a href data-group>` por grupo: `data-group` es el `PRODUCT_GROUP_ID`, `href` su ficha y el texto su nombre |

- **Orden:** el de los links. Un grupo que no está en el catálogo se saltea.
- **Datos:** nombre, meta e imágenes salen de `getProductCards()` (`src/data/catalog.js`). Es un contenedor que consulta, como el navbar; las `product-card` reciben datos.
- **Reserva:** los links quedan en el HTML de la página (indexables). Si el catálogo no carga o ningún grupo existe, se muestran como lista.
- Mientras carga, una `product-card` con `loading` por link (el mismo skeleton del listado de Productos: bloque 7:10, barras y shimmer). El host lleva `aria-busy="true"` y «Cargando productos…» queda solo para lectores de pantalla; las cards de carga van con `aria-hidden`. Aparecen con un fundido de `motion/duration/fade` después de esperar lo mismo: con el catálogo en caché no llegan a verse. Si ya se veían, las cards ocupan su lugar sin la entrada al hacer scroll.
- **Entrada al hacer scroll:** cada tarjeta sube y aparece al entrar en pantalla, una vez y escalonada (`src/base/reveal.js`). Con `prefers-reduced-motion` no se anima.
- **Iluminar:** dentro de un bloque con `data-arq-theme="dark"`, las tarjetas pasan a las imágenes encendidas (product-card).
- **Cursor de hover:** cada `product-card` lleva `show-cursor` con el texto "Ver producto".

## Layout

Home v2: texto a la izquierda (`slot="intro"`) y fila con scroll a la derecha (slider: `arq-carousel-controls` con `step="item"`, una tarjeta por clic). Autoplay: avanza solo. Se detiene con el mouse encima o el foco adentro (tarjetas y flechas) y no vuelve mientras siga así (WCAG 2.2.2); también al deslizar, fuera de pantalla o con `prefers-reduced-motion`. `TODO` (diseño): falta un botón de pausa visible (no hay ícono de pausa en el set). Al final vuelve al inicio. `TODO` (diseño): no hay token de intervalo; se usa `motion/duration/feedback` × 1.5 (3 s). En Mobile las flechas no se muestran. La fila se desliza con el dedo (scroll nativo, con la inercia y el snap del navegador) o arrastrando con el mouse; un toque abre la ficha y un deslizamiento no. Al soltar el arrastre, la fila se desliza hasta la tarjeta (con la velocidad de los últimos 100 ms) y el snap se vuelve a prender recién al terminar: antes saltaba de golpe. Con una sola tarjeta no hay flechas.

| Parte | Token |
| --- | --- |
| Entre tarjetas | `space/gap/sm` en Desktop y Mobile |
| Ancho de tarjeta | `layout/card-min-wide` (340). En Mobile, `layout/card-min` (160) |
| Reserva | links a `space/gap/sm`, `role/body` en `color/text/primary` |
