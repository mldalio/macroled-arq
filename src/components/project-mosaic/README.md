# project-mosaic · `<arq-project-mosaic>`

Mosaico de fotos de proyectos ("Diseño que inspira" del Home). Componente de layout: DESIGN.md §12 dice que project-mosaic se resuelve en código (grid + aspect-ratio), no como set de Figma. Pantallas: Final, Home (`1203:9888` · `1204:10104`).

```html
<arq-project-mosaic>
  <img src="…" alt="Balizas encendidas en un patio de hormigón" loading="lazy">
  <img src="…" alt="Living con colgante sobre una mesa baja" loading="lazy">
  <img src="…" alt="Comedor con colgantes" loading="lazy">
  <img src="…" alt="Spot entre plantas de noche" loading="lazy">
</arq-project-mosaic>
```

## Slots

| Slot | Contenido |
| --- | --- |
| por defecto | hasta cuatro `<img>`, con `alt` descriptivo (son contenido) y `loading="lazy"` |

## Layout

| | Desktop | Mobile |
| --- | --- | --- |
| Armado | 1.ª a la izquierda a todo el alto; 2.ª arriba a la derecha; 3.ª y 4.ª abajo a la derecha | 1.ª a todo el ancho; 2.ª y 3.ª debajo; la 4.ª no se ve |
| Proporción | 3.ª y 4.ª `ratio/square` (dan el alto de las filas) | todas `ratio/portrait-soft` (4:5) |
| Gap | `space/gap/lg` | `space/gap/sm-md` |
| Sin foto (o cargando) | fondo `color/bg/subtle` | ídem |

- Más de cuatro fotos no se muestran (la cantidad de las galerías está pendiente, DESIGN.md §12).
- Los estilos de la foto van con `!important`: en el sitio, los estilos de Webflow para `img` ganan sobre `::slotted`.

## Pendientes

- `TODO` (diseño): las fotos del set no tienen ratio del sistema (Desktop 312 × 348; Mobile 350 × 420 y 169 × 200). Se usan los más cercanos: `ratio/square` en Desktop (el mosaico mide 648 de alto en vez de 720) y `ratio/portrait-soft` en Mobile.
