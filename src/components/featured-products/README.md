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
| slot por defecto | un `<a href data-group>` por grupo: `data-group` es el `PRODUCT_GROUP_ID`, `href` su ficha y el texto su nombre |

- **Orden:** el de los links. Un grupo que no está en el catálogo se saltea.
- **Datos:** nombre, meta e imágenes salen de `getProductCards()` (`src/data/catalog.js`). Es un contenedor que consulta, como el navbar; las `product-card` reciben datos.
- **Reserva:** los links quedan en el HTML de la página (indexables). Si el catálogo no carga o ningún grupo existe, se muestran como lista.
- Mientras carga, el host lleva `aria-busy="true"` y no muestra nada.
- **Iluminar:** dentro de un bloque con `data-arq-theme="dark"`, las tarjetas pasan a las imágenes encendidas (product-card).

## Layout

`arq-grid` de 4 columnas en Desktop y 2 en Mobile (`mobile="two-columns"`). Las tarjetas son `product-card` Size=Large, que pasa sola al aspecto Small hasta 767 px.

| Parte | Token |
| --- | --- |
| Reserva | links a `space/gap/sm`, `role/body` en `color/text/primary` |
