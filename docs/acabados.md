# Acabados: de dónde sale la imagen de cada muestra

Cómo se ve cada acabado («Negro», «Verde»…) en la ficha, en las cards de Productos y Colecciones y en la comparativa. Resumen de la decisión en `docs/decisiones.md`, 2026-10-19 · Imágenes de acabados; reglas de diseño en DESIGN.md §8 · Acabados de producto.

## Cómo funciona

```
Sheets → Typesense                    src/data/finishes.js                   servidor de imágenes
color_carcasa = «Negro»       →   nombre + familia  →  slug del archivo  →  …/acabado-negro-mate.png
familia       = «Yoru»
```

1. **La base no cambia.** El acabado sigue llegando con su nombre de siempre («Negro»). Ese texto es el que se ve en la ficha, en las características y en los filtros. **Nunca** dice «negro mate».
2. **El código elige la imagen.** `src/data/finishes.js` (único archivo de mapeo) convierte el nombre en el nombre de un archivo. Para la mayoría de los acabados alcanza con el nombre. Cuando la misma palabra es otro acabado según el producto, decide la **familia** (campo `familia` de la base).
3. **La imagen se pide al servidor de la empresa.** `https://s3.coresagroup.com/MACROLED/ARQ/imagenes/acabados/acabado-<slug>.png`. La dirección base está en `src/config.js` (`config.images.finishesBase`).
4. **Si no hay imagen, no se rompe nada.** Un acabado que no está en el mapeo (o cuya imagen no carga) se ve como el neutro `color/surface/subtle`, con el nombre como texto accesible. Sirve para detectar qué falta.

## Los archivos

13 PNG de 128 × 128 px, cuadrados y sin forma dibujada (el recorte lo hace el código). Se exportan de Figma, frame `Acabados · gradients (128×128)` (`2720:5498`) dentro de la sección ACABADOS (`2713:9370`) de la página PRUEBA: un frame por acabado, con el mismo nombre que el archivo.

| Acabado en la base | Archivo | Tipo | Cuándo |
| --- | --- | --- | --- |
| Negro | `acabado-negro.png` | metálico (DAO) | siempre, salvo en las familias de abajo |
| Negro | `acabado-negro-mate.png` | mate | familias Kanu, Nobu, Tori, Koen, Douli, Yoru y Sento |
| Negro satinado | `acabado-negro-mate.png` | mate | siempre (es lo mismo que el negro mate: conectores de riel Skyline) |
| Blanco | `acabado-blanco.png` | metálico | siempre |
| — | `acabado-blanco-mate.png` | mate | **sin regla todavía** (ver Pendientes) |
| Cobre | `acabado-cobre.png` | metálico | siempre |
| Bronce | `acabado-bronce.png` | metálico | siempre |
| Celeste | `acabado-celeste.png` | metálico | siempre |
| Grafito · Gris Grafito | `acabado-grafito.png` | metálico | siempre |
| Platil | `acabado-platil.png` | metálico | siempre |
| Verde | `acabado-verde.png` | mate | siempre |
| Terracota | `acabado-terracota.png` | mate | siempre |
| Beige | `acabado-beige.png` | mate | siempre |
| Pardo | `acabado-pardo.png` | mate | siempre |

- Los nombres se comparan sin tildes ni mayúsculas, y con los espacios normalizados: «Plátil», «PLATIL» y «platil» dan lo mismo.
- La familia se compara igual y **es exacta**: «Tori» no incluye a una familia que se llame «Mini Tori». Hoy no hace falta: en la base, «Mini Tori Jardín» tiene familia «Tori». Si una familia nueva usa el negro mate, se agrega a la lista.
- Un grupo de productos tiene una sola familia: la de su SKU predeterminado.

## Dónde se usa

| Pantalla | Qué muestra |
| --- | --- |
| Ficha de producto | `swatch-picker`: una muestra por acabado del grupo. La elegida va a 24 px y las demás a 20 px, también en mobile (el código no los baja a 16 px) |
| Cards de Productos y Colecciones | `product-card` con Show finishes, siempre a 16 px. En una colección se juntan los acabados de todos sus productos; si dos productos tienen «Negro» con imágenes distintas, salen las dos muestras |
| Comparativa | La muestra de cada opción del select de acabado |

Todavía **sin imagen**: los filtros de acabado de la tabla del glosario y de Descargas (ver Pendientes).

## Cómo se cambia

**Agregar una familia al negro mate:** sumar su nombre a `MATTE_BLACK_FAMILIES` en `src/data/finishes.js`.

**Agregar un acabado nuevo** (por ejemplo «Rosa»):
1. Diseñar la imagen en Figma (128 × 128, cuadrada, sin forma) y exportarla como `acabado-rosa.png`.
2. Subirla a la carpeta de acabados del servidor.
3. En `SLUGS` de `src/data/finishes.js`, agregar `rosa: 'rosa'`.

**Una palabra que es otro acabado según la familia** (como el negro): agregar una regla en `BY_FAMILY`, con el slug y las familias.

**Un nombre distinto para el mismo acabado** («Gris Grafito» y «Grafito»): agregar el nombre a `SLUGS` apuntando al mismo slug.

**Cambiar solo cómo se ve un acabado:** reemplazar el archivo en el servidor con el mismo nombre. El navegador puede tener la anterior en caché unas horas.

Después de tocar `src/data/finishes.js`: `npm run build` y commit de `dist/`.

## Peso y carga

- Cada imagen pesa entre 8 y 17 KB. Una pantalla muestra como mucho unas doce distintas y el navegador repite la misma sin volver a pedirla.
- Alcanza con 128 px: la muestra más grande mide 24 px, y con una pantalla 3x son 72 px.
- No llevan `loading="lazy"`: el `<img>` del swatch arranca oculto hasta que carga, y una imagen diferida y oculta no se pide nunca.

## Pendientes

- **Blanco mate (productos Skyline):** la imagen `acabado-blanco-mate.png` ya está diseñada, pero no tiene regla: los productos Skyline (conectores y accesorios de riel) la van a usar cuando se organice su estructura en la base. Hasta entonces, el nombre «Blanco» sigue dando `acabado-blanco.png` (el blanco metálico de DAO). La regla probable es por familia, como la del negro mate (`BY_FAMILY` en `src/data/finishes.js`). Subir el archivo al servidor antes de conectarla.
- **Acero** (`RMS-S-S`, Skyline Kit Colgante, familia Riel Magnético): sin imagen a propósito. Es un producto con un solo color, que la ficha no ofrece como opción de variante. Se resuelve junto con la regla de los productos Skyline.
- **«Blanco y negro»** no es un acabado real: solo aparece en `demo/fixtures/peor-caso.js`, datos de prueba para romper la interfaz. No hay SKU con ese valor.
- **Códigos de acabado** (N, V, R, B, BN, P): falta la tabla de equivalencias con el nombre. Hoy no se usan: el mapeo parte del nombre completo.
- **Filtros de acabado** del glosario (`variants-table`) y de Descargas (`downloads-table`): hoy la muestra va neutra. Cuando se quiera la imagen, hay que pasarle el acabado de cada opción como se hace en la comparativa.
