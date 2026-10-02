# DESIGN.md — Design system de Macroled Arq

Referencia de diseño para todas las personas del equipo y todas las IAs (Claude, Codex, Cursor u otras). Se lee junto con [AGENTS.md](./AGENTS.md).

- Si algo de este archivo contradice una suposición de la IA, manda este archivo.
- Si falta un token, un estado o un componente, **no se inventa**: se deja un `TODO` en el código y se avisa al equipo.

> Este archivo vive en el repo. Hay una copia en texto plano en el frame **DESIGN.md** de la página Plan del proyecto del Figma. Si cambia, se actualizan los dos.

---

## 1. Fuente de verdad

| Qué | Dónde |
| --- | --- |
| Diseño, variables y componentes | Figma: [Macroled-ARQ](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ) |
| Tokens documentados (muestras) | Página **Tokens** |
| Este documento, AGENTS.md y CLAUDE.md (copia) | Página **Plan del proyecto** |
| Componentes | Página **Componentes** |
| Fichas de uso de cada componente (`doc/<nombre>`) | Página **Documentación** |
| Pantallas | Página **Final** |
| Tokens en código | `tokens/tokens.json` → se genera `src/styles/tokens.css` (no editar a mano) |

- Figma manda sobre **cómo se ve** algo; el repo manda sobre **cómo se comporta**. Si el código y Figma no coinciden, es un bug.
- Cada variable semántica tiene cargada su descripción de uso y su nombre CSS (visibles en Dev Mode y por el MCP de Figma).
- **No usar como referencia:** la página *baja / media* y los frames *Registro · …* de la página Final (historial de pendientes).

---

## 2. Arquitectura de tokens: dos niveles

```
1 · Primitive   →   2 · Semantic   →   componente
valores crudos      roles con modos     usa SOLO Semantic
                    (Light/Dark,
                    Desktop/Mobile)
```

| Nivel | Colecciones en Figma | Qué contiene | ¿Se usa en componentes? |
| --- | --- | --- | --- |
| 1 · Primitive | 1 · Primitive · Color, Space, Type, Radius, Border | Valores crudos (`neutral/900` = #101010, `space/16` = 16) | Nunca directo |
| 2 · Semantic | 2 · Semantic · Color (Light/Dark), Dimension y Type (Desktop/Mobile) | Roles de uso general (`color/text/primary`, `space/gap/md`) | Sí: es lo único que usan los componentes |

No hay nivel de componente (Mapped). Se descartó por escalabilidad: cada componente se enlaza directamente a los semánticos. Si un componente necesita un valor que no existe, se agrega un semántico nuevo que sirva para todos (por ejemplo, `color/surface/inverse-hover`).

### Reglas de oro

1. Los componentes usan solo Semantic. Nunca un Primitive, nunca un valor suelto.
2. Prohibidos los valores sueltos: nada de `#hex`, `px`, `rem` escritos a mano.
3. Los modos (Light/Dark, Desktop/Mobile) viven solo en Semantic.
4. Si falta un rol, se agrega en Semantic, para todos. No se crea un color para un caso puntual.
5. Los nombres de Figma y de código son los mismos.
6. Texto: todo texto usa un estilo `role/*` y un color Semantic (`color/text/*`). Nunca tamaño, peso, interlineado ni color sueltos. Si ningún rol encaja, se usa el más cercano y se avisa; no se crea un estilo nuevo sin acordarlo.

### Nombres en código

- Prefijo obligatorio: `--arq-`. Las barras pasan a guiones: `color/text/primary` → `--arq-color-text-primary`.
- El nombre de la colección no forma parte del nombre CSS.

| Figma | CSS |
| --- | --- |
| `neutral/900` (Primitive) | `--arq-neutral-900` |
| `color/text/primary` | `--arq-color-text-primary` |
| `space/gap/md` | `--arq-space-gap-md` |
| `type/body/size` | `--arq-type-body-size` |
| `layout/card-min-wide` | `--arq-layout-card-min-wide` |

### Convivencia con Webflow

Arq vive en `macroled.com.ar/arq`, dentro del mismo sitio de Webflow que el e-commerce de Macroled.

- **Regla:** todo lo que sale al DOM global lleva el prefijo `arq-`. Nada nuestro puede pisar clases, variables o scripts de Macroled (ni al revés).
- **Elementos:** `<arq-button>`, `<arq-variants-table>`. Los estilos internos quedan encerrados en el Shadow DOM: las clases de Webflow no entran y las nuestras no salen. Dentro del Shadow DOM las clases no llevan prefijo.
- **Clases fuera del Shadow DOM:** `arq-<componente>` y modificadores `arq-<componente>--<variante>` (`arq-button--outline`). Nunca clases genéricas sueltas (`outline`, `active`, `hidden`, `container`).
- **Variables CSS:** solo `--arq-*`. No se declaran variables sin prefijo en `:root`.
- **Atributos:** `data-arq-*` (el tema va en `data-arq-theme="dark"`). **Eventos:** `arq:<nombre>` (`arq:change`). **localStorage:** `arq:<clave>`. **@keyframes:** `arq-<nombre>`. **JS:** un único global, `window.Arq`.
- **Slots:** el contenido que se pasa por slot vive en el DOM de Webflow y hereda sus estilos. Lo que tiene que verse igual en cualquier sitio va dentro del componente, no por slot.
- **Tipografía:** Albert Sans se carga a nivel página, no dentro del Shadow DOM.
- **SEO:** el template del CMS imprime h1 y descripción en el HTML y los pasa por slot; el resto lo trae el componente desde Typesense.
- **URLs:** las páginas de colección del CMS se anidan en la carpeta `/arq` (CMS Folders de Webflow). Una carpeta y una colección no pueden compartir slug en el mismo nivel.
- En Figma no se usa el prefijo: componentes, variantes, props y variables mantienen su nombre. El prefijo se agrega en código; el code syntax de cada variable ya lo trae (`var(--arq-…)`).

### Modos en código

```css
/* Light es el valor base */
:root { --arq-color-text-primary: var(--arq-neutral-900); }

/* Dark: solo con data-arq-theme="dark" (Iluminar o Dark local), sin prefers-color-scheme */
[data-arq-theme="dark"] { --arq-color-text-primary: var(--arq-neutral-100); }

/* Desktop es el valor base; Mobile por media query */
:root { --arq-layout-gutter: var(--arq-space-40); }
@media (max-width: 767px) {
  :root { --arq-layout-gutter: var(--arq-space-20); }
}
```

Las variables CSS atraviesan el Shadow DOM. Un bloque en modo Dark se logra con `data-arq-theme="dark"` en el contenedor (en Figma: modo Dark en el frame). **Dark nunca se activa solo por la preferencia del sistema**: únicamente con `data-arq-theme="dark"`, por Iluminar o por Dark local (ver Modo Dark, más abajo).

### Breakpoints y grilla

- **Mobile** hasta 767 px y **Desktop** desde 768 px (modos de Dimension y Type).
- **Listados** (Productos y Colecciones): hasta 1023 px usan `catalog-nav-mobile` en lugar del sidebar `catalog-nav`.
- **Grilla de catálogo:** `layout/card-min` vale 280 (160 en mobile) y desde 1600 px se usa `layout/card-min-wide` (340). El cambio se resuelve en el CSS de la grilla, no en `tokens.css` (que solo refleja los modos de Figma):

```css
.grid {
  --card-min: var(--arq-layout-card-min);
  grid-template-columns: repeat(auto-fill, minmax(var(--card-min), 1fr));
}
@media (min-width: 1600px) {
  .grid { --card-min: var(--arq-layout-card-min-wide); }
}
```

`--card-min` es una variable local de la grilla, dentro del Shadow DOM del componente que la contiene: no sale al DOM global.

| Viewport | Columnas | Ancho de tarjeta |
| --- | --- | --- |
| 390 (mobile) | 2 | ≈ 167 |
| 1400 | 3 | ≈ 323 |
| 1920 | 4 | ≈ 366 |
| 2560 | 6 | ≈ 343 |

- No hay ancho máximo: todas las páginas son full width y el margen lateral es siempre `layout/gutter`.

### Modo Dark: Iluminar y Dark local

Hay dos usos del modo Dark. Los dos usan `data-arq-theme="dark"`; cambia quién lo pone y cuándo.

**Iluminar:** switch del usuario. Solo existe en la ficha de producto, Productos y Colecciones.

- **Ficha de producto:** el switch pone el modo Dark en `navbar` y `hero` (desktop y mobile) y cambia la foto; el resto de la página no cambia. `explora-coleccion` ya es Dark siempre (Dark local, abajo). En código: `data-arq-theme="dark"` en `<arq-navbar>` y en la sección hero de la ficha (elementos del DOM de la página).
- **Productos y Colecciones:** el toggle Iluminar de `catalog-toolbar` pasa toda la página a Dark y las product-card muestran sus imágenes con la luz encendida (ver §8, Imágenes de product-card). En código: `data-arq-theme="dark"` en `<html>`.
- **Home y Contacto** no tienen Iluminar.

**Dark local:** fijo por diseño, para tener colores claros sobre fotos o fondos oscuros. No depende de Iluminar ni lo activa: se ve igual con Iluminar apagado o encendido.

| Caso | Qué va en Dark | Dónde va el atributo |
| --- | --- | --- |
| hero (Home, Contacto) | Solo el CTA (button Outline claro). Los textos usan `color/text/inverse` | Contenedor interno del Shadow DOM que envuelve el slot del CTA |
| compare-bar | Toda la barra | Contenedor interno del Shadow DOM (el que envuelve todo el componente) |
| explora-coleccion (ficha), con family-card Large | Toda la sección | La sección, en el DOM de la página |

- **Regla:** un componente con Dark local lo aplica en un contenedor interno; el contenido por slot lo hereda. Quien arma la página no pone el atributo. Si el Dark es de una sección de la página (explora-coleccion), el atributo va en la sección y los componentes de adentro lo heredan.
- **Dónde funciona el atributo:** en un ancestro del DOM de la página, en el host del componente (`<arq-compare-bar data-arq-theme="dark">`) y en un contenedor dentro del Shadow DOM. Este último caso funciona porque `ArqElement` adopta en cada Shadow DOM la hoja `src/styles/dark.css` (el mismo bloque Dark de `tokens.css`): `tokens.css` solo alcanza el DOM de la página, no lo que está dentro de un componente (`docs/decisiones.md`, 2026-10-01 · Dark dentro del Shadow DOM).
- El contenido por slot hereda el modo del contenedor donde se muestra, no el de su padre en el HTML.
- No hay Light local: dentro de un bloque Dark no se puede volver a Light.

Para los dos usos:

- El negro es `color/bg/default` en Dark (`neutral/800`, #1C1C1C).
- **Cambio de fondo:** cuando una sección pasa a oscuro, su padding inferior baja un escalón (`space/section/xl` → `space/section/lg`) y la sección clara que sigue suma padding superior `space/section/md`. Desktop: 128 + 96 · Mobile: 96 + 56. Con el fondo igual, la sección siguiente no lleva padding superior. En código, el ajuste va atado a `data-arq-theme="dark"` en la sección.

---

## 3. Nivel 1 · Primitive

Estos valores **no se usan en componentes**. Están acá para entender de dónde salen los semánticos.

- **Color:** neutral (0–900, con 25, 75, 150, 725, 750 y 775), bronze, cacao, olive, terracotta (50–900), offwhite, red / green / amber y alpha. Bronze, cacao, olive, terracotta y offwhite quedan en Figma como paleta de marca, pero **no se exportan a `tokens.json`** hasta que un semántico los use.
- **Espaciado (px):** 0 · 2 · 3 · 4 · 6 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 56 · 64 · 80 · 96 · 128 · 160.
- **Tipografía:** familia única Albert Sans; pesos 300–700; tamaños 10 · 11 · 12 · 14 · 16 · 20 · 24 · 32 · 40 · 48 · 64.
- **Radio:** `radius/0 · 2 · 4 · 8 · 16 · 24 · full`. **Borde:** `border/1 · border/2`. **Blur:** `blur/12`.

### Primitivas de color que usa Semantic

| Primitive | Valor |
| --- | --- |
| neutral/0 | #FFFFFF |
| neutral/25 | #FBFBFB |
| neutral/50 | #F7F7F7 |
| neutral/75 | #F4F4F4 |
| neutral/100 | #F0F0F0 |
| neutral/150 | #E9E9E9 |
| neutral/200 | #E0E0E0 |
| neutral/400 | #ADADAD |
| neutral/500 | #8A8A8A |
| neutral/600 | #666666 |
| neutral/700 | #454545 |
| neutral/725 | #3A3A3A |
| neutral/750 | #2E2E2E |
| neutral/775 | #252525 |
| neutral/800 | #1C1C1C |
| neutral/900 | #101010 |
| red/300 · red/600 | #E38B7F · #A8322A |
| green/300 · green/600 | #8FBF9F · #3F6F53 |
| amber/300 · amber/600 | #E0B35A · #8A5F10 |
| alpha/ink-10 · ink-22 | #101010 al 10 % · 22 % |
| alpha/white-10 · white-22 | #FFFFFF al 10 % · 22 % |
| alpha/black-60 | #000000 al 60 % |
| alpha/transparent | #000000 al 0 % |

---

## 4. Semantic · Color (Light / Dark)

Cómo elegir un token:

1. **¿Qué propiedad es?** Fondo de sección → `color/bg/*`. Fondo de elemento → `color/surface/*`. Texto → `color/text/*`. Ícono → `color/icon/*`. Borde → `color/border/*`. Acción principal → `color/action/*`. Marca → `color/accent/*`. Modal o barra translúcida → `color/overlay/*`.
2. **¿Qué jerarquía tiene?** primary para títulos, secondary para lectura, tertiary para lo secundario. Fondos: default, subtle, strong, inverse.
3. **¿En qué estado está?** hover, pressed, selected, disabled, focus, error, success, warning.

### Superficies

| Token | Light | Dark | Uso |
| --- | --- | --- | --- |
| color/surface/default | neutral/0 | neutral/800 | Fondo principal de página, tarjetas y paneles |
| color/surface/faint | neutral/25 | neutral/775 | Hover de opciones sin fondo (option-tile, select-option, accordion) |
| color/surface/hover | neutral/50 | neutral/775 | Hover de un elemento interactivo |
| color/surface/soft | neutral/75 | neutral/725 | Seleccionado liviano (option-tile) |
| color/surface/subtle | neutral/100 | neutral/750 | Bloques destacados, fondos de miniaturas |
| color/surface/selected | neutral/150 | neutral/725 | Elemento seleccionado o presionado |
| color/surface/strong | neutral/200 | neutral/700 | Fondos con más peso |
| color/surface/inverse | neutral/900 | neutral/0 | Máximo contraste, con color/text/inverse |
| color/surface/inverse-hover | neutral/750 | neutral/150 | Hover sobre fondo inverso |
| color/surface/inverse-pressed | neutral/600 | neutral/200 | Pressed sobre fondo inverso |
| color/surface/transparent | alpha/transparent | alpha/transparent | Fondo transparente explícito |
| color/bg/default · subtle · inverse | = surface | = surface | Fondo de las secciones de página. Para elementos (tarjetas, paneles, campos) se usa color/surface/* |

### Texto e íconos

| Token | Light | Dark | Uso |
| --- | --- | --- | --- |
| color/text/primary · icon/primary | neutral/900 | neutral/100 | Títulos, nombres, botones, íconos por defecto |
| color/text/secondary · icon/secondary | neutral/750 | neutral/200 | Lectura |
| color/text/tertiary · icon/tertiary | neutral/600 | neutral/500 | Metadatos, etiquetas, placeholders, flechas |
| color/text/inverse · icon/inverse | neutral/0 | neutral/800 | Sobre fondos inversos |
| color/text/accent · icon/accent | neutral/900 | neutral/150 | Acento |
| color/text/disabled · icon/disabled | neutral/400 | neutral/600 | Deshabilitado |
| color/text/error · success · warning | red · green · amber/600 | red · green · amber/300 | Mensajes de estado |

### Bordes

| Token | Light | Dark | Uso |
| --- | --- | --- | --- |
| color/border/subtle | alpha/ink-10 | alpha/white-10 | Divisores y bordes de tarjetas |
| color/border/default | alpha/ink-22 | alpha/white-22 | Controles en reposo |
| color/border/hover | neutral/500 | neutral/500 | Controles en hover |
| color/border/strong | neutral/900 | neutral/0 | Énfasis, seleccionado, subrayados, Outline |
| color/border/disabled | neutral/200 | alpha/white-10 | Deshabilitado |
| color/border/focus | neutral/900 | neutral/150 | Foco de teclado (obligatorio) |
| color/border/error | red/600 | red/300 | Campo con error |

### Acción, acento y overlay

| Token | Light | Dark | Uso |
| --- | --- | --- | --- |
| color/action/primary | neutral/900 | neutral/100 | Fondo del botón Filled; texto e ícono de Outline y Underline |
| color/action/primary-hover | neutral/750 | neutral/200 | Hover del botón Filled |
| color/action/on-primary | neutral/0 | neutral/900 | Texto e ícono sobre color/action/primary |
| color/accent/default | neutral/900 | neutral/150 | Detalles de marca |
| color/overlay/scrim | alpha/black-60 | alpha/black-60 | Detrás de download-modal (siempre) y filter-panel (solo desktop) |
| color/overlay/translucent | alpha/ink-10 | alpha/ink-10 | Fondo translúcido de barras sobre fotos (navbar Transparent), junto con blur/backdrop |
| hero/scrim (estilo de relleno) | Degradado negro 52 → 20 → 20 → 68 % | Igual | Scrim del hero sobre media. Ya incluye el oscurecido de la imagen. Único para Desktop y Mobile |

---

## 5. Semantic · Dimension (Desktop / Mobile)

| Token | Desktop | Mobile | Uso |
| --- | --- | --- | --- |
| layout/gutter | 40 | 20 | Margen lateral de la página. Lo aplica la sección, no cada componente. Excepción: componentes de borde a borde (navbar, footer, page-header, filter-bar, variants-table) lo usan como padding interno |
| layout/card-min | 280 | 160 | Ancho mínimo de tarjeta en la grilla de catálogo |
| layout/card-min-wide | 340 | 340 | Reemplaza a card-min desde 1600 px, en el CSS de la grilla |
| layout/compare-media-max | 2000 | 2000 | Tope de la media en la comparativa |
| layout/measure | 400 | 400 | Ancho máximo de un texto de lectura junto a otro elemento (bajada de section-header y de page-header List). En Mobile el texto ocupa todo el ancho |
| layout/measure-wide | 520 | 520 | Ancho máximo de un texto de lectura en una columna principal (page-header Detail). En Mobile el texto ocupa todo el ancho |
| layout/gallery-thumb | 105 | 76 | Ancho de gallery-thumb en product-gallery. El alto sale de ratio/landscape (5:4) |
| layout/filter-panel | 560 | 560 | Ancho de los paneles en Desktop: filter-panel y download-modal. En Mobile no se usa |
| space/section/2xs · xs · sm · md · lg · xl | 32 · 48 · 64 · 96 · 128 · 160 | 24 · 32 · 40 · 56 · 96 · 128 | Solo entre bloques de página (padding de la sección). Es la perilla del ritmo de página |
| space/gap/xs · sm · sm-md · md · lg · xl · xl-2xl · 2xl · 3xl · 4xl · 5xl · 6xl | 4 · 8 · 12 · 16 · 24 · 32 · 40 · 48 · 64 · 80 · 96 · 128 | 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 56 · 64 · 96 | Entre elementos (gap) |
| space/padding/2xs · xs · sm · sm-md · md · lg · xl · xl-2xl · 2xl · 3xl · 4xl · 5xl · 6xl | 3 · 4 · 8 · 12 · 16 · 24 · 32 · 40 · 48 · 64 · 80 · 96 · 128 | 3 · 4 · 8 · 12 · 16 · 20 · 24 · 32 · 32 · 48 · 56 · 64 · 96 | Padding interno |
| radius/control | 0 | 0 | Esquinas rectas |
| radius/pill | 999 | 999 | Solo si el componente lo requiere (toggle-switch) o se pide explícitamente |
| border/default · focus · strong | 1 · 1 · 2 | 1 · 1 · 2 | Bordes / foco (se distingue por color) / hover y selección de muestras |
| blur/backdrop | 12 | 12 | Desenfoque del fondo detrás de una superficie translúcida (background blur en Figma, `backdrop-filter` en código), junto con color/overlay/translucent |
| icon/sm · md · lg · xl · 2xl | 12 · 16 · 20 · 24 · 32 | 12 · 16 · 24 · 24 · 32 | Íconos |
| swatch/sm · md · lg | 16 · 20 · 24 | 16 · 20 · 24 | Muestras de acabado |

- **gap** es la distancia *entre* elementos; **padding**, el aire *dentro* de un bloque; **section**, la distancia *entre* bloques de página. `section` no se usa adentro de un bloque aunque coincida en valor.
- **No hay sombras.**

### Proporciones de imagen

| Nombre | Ratio | En código | Uso |
| --- | --- | --- | --- |
| ratio/portrait | 7:10 | `aspect-ratio: 7 / 10` | product-card, family-card Large, fotos verticales |
| ratio/portrait-soft | 4:5 | `aspect-ratio: 4 / 5` | category-card, bloque texto + imágenes |
| ratio/square | 1:1 | `aspect-ratio: 1 / 1` | compare-product, family-card Default, galería doble, proyectos, line-card (Mobile) |
| ratio/landscape | 5:4 | `aspect-ratio: 5 / 4` | product-gallery y thumbs, line-card (Desktop), texto + imagen |
| ratio/wide | 16:10 | `aspect-ratio: 16 / 10` | hero desktop, galería de ambiente |
| hero mobile | 70 % del alto | `height: 70svh` | Hero en mobile |

Los ratios no son variables (Figma no puede ligar una proporción). En código se aplican con `aspect-ratio`.

---

## 6. Tipografía: Semantic · Type y estilos role/*

`2 · Semantic · Type` guarda tamaño e interlineado por rol (`type/<rol>/size`, `type/<rol>/leading`) con modo Desktop/Mobile. El color y los estados no son parte del estilo.

| Estilo | Peso | Desktop | Mobile | Uso |
| --- | --- | --- | --- | --- |
| role/display | Light | 64/72 | 40/44 | Titulares principales |
| role/display-sm | Light | 48/56 | 32/40 | Titulares secundarios |
| role/heading-1 | Light | 40/48 | 32/40 | Título de página |
| role/heading-2 | Light | 32/40 | 24/32 | Título de sección |
| role/heading-3 | Regular | 24/32 | 20/28 | Subtítulos, columnas del mega menú, category-card |
| role/body-xl | Regular | 20/28 | 16/24 | Acciones grandes (opciones del modal de descargas) |
| role/body-lg | Light | 16/24 | 16/24 | Bajadas |
| role/body-lg-regular | Regular | 16/24 | 16/24 | Títulos o preguntas de lectura |
| role/body-lg-medium | Medium | 16/24 | 16/24 | Énfasis sobre body-lg |
| role/body | Light | 14/20 | 14/20 | Lectura, valores de inputs, links de listas |
| role/body-regular | Regular | 14/20 | 14/20 | Botones, opciones y controles con texto |
| role/body-medium | Medium | 14/20 | 14/20 | Énfasis intermedio |
| role/body-strong | SemiBold | 14/20 | 14/20 | Títulos de columna, nombres en listas |
| role/body-sm | Regular | 12/16 | 12/16 | Metadatos, SKU en listados, legales, ayudas |
| role/body-sm-medium | Medium | 12/16 | 12/16 | Énfasis sobre body-sm |
| role/label | Regular | 12/16 | 12/16 | MAYÚSCULAS, tracking 1 px: etiquetas de inputs, tabs, títulos de grupo, breadcrumb |
| role/label-sm | Medium | 10/14 | 10/14 | MAYÚSCULAS, tracking 1 px. Solo donde 12 no entra (celdas de filtro) |
| role/caption | Regular | 12/14 | 12/14 | Notas mínimas, "Copiado" |
| role/caption-medium | Medium | 12/14 | 12/14 | Énfasis sobre caption |

- No crear estilos por estado. **No cambiar el peso en hover**: hace saltar el layout.
- Si un diseño tiene 13 px, 9 px u otra familia, se normaliza al rol más cercano.
- Mayúsculas de interfaz: el dato va en caja normal y la mayúscula la pone el estilo (`text-transform`). Los textos que vienen de la base se muestran como llegan.

### Movimiento (2 · Semantic · Motion)

| Token | Valor | Uso |
| --- | --- | --- |
| motion/duration/fast | 120 ms | Hover, toggle, foco |
| motion/duration/base | 200 ms | Desplegables (disclosure) y menús |
| motion/duration/slow | 320 ms | Fundido de imágenes de product-card |
| motion/duration/feedback | 2000 ms | Tiempo visible de una confirmación ("Copiado" del sku) |
| motion/easing/standard | cubic-bezier(0.2, 0, 0, 1) | Todas las transiciones |

- Con `prefers-reduced-motion: reduce`, las duraciones fast, base y slow pasan a 0. feedback no cambia: es un tiempo de lectura, no una animación.
- Se anima solo `opacity`, `transform` y colores. Nunca alto, ancho ni posición de layout.

---

## 7. Estados de interacción

| Estado | Qué es | CSS / ARIA |
| --- | --- | --- |
| Default / Empty | Reposo (inputs: vacío con placeholder) | — |
| Hover | Cursor encima | `:hover` |
| Pressed | Mientras se hace clic | `:active` |
| Current | Página actual | `[aria-current="page"]` |
| Open (propiedad) | Desplegable abierto: `Open=True` (nav-link, select, input Select, accordion-item, faq-item, filtros) | `[aria-expanded="true"]` |
| Selected | Opción o pestaña elegida | `[aria-selected="true"]` |
| Active (listas) | Resaltado con flechas; el foco sigue en el campo (search-result) | `aria-activedescendant` |
| Filled | Campo con valor (input, search-field; select Filter con opción elegida) | — |
| Focus | Foco de teclado | `:focus-visible` con `color/border/focus` |
| Error | Valor inválido | `[aria-invalid="true"]` + mensaje |
| Disabled | Inactivo | `:disabled` |
| Checked | Checkbox marcado o switch encendido (`Checked=True`) | `[aria-checked="true"]` / `:checked` |
| Applied | filter-bar con filtros aplicados | — (se muestra "Limpiar filtros") |
| Copied | sku después de copiar el código | `aria-live="polite"` con el texto "Copiado" |
| Loading | Envío en curso (button Filled) | `[aria-busy="true"]` + `:disabled` |

**Foco:** anillo separado del componente: `outline: var(--arq-border-strong) solid var(--arq-color-border-focus)` con `outline-offset: 2px` (en Figma, la capa `focus-ring` de button). Así se ve también sobre fondos del mismo color que el foco. El estado Focus **nunca cambia el tamaño** del componente.

---

## 8. Componentes

Web Components con prefijo `arq-` y Shadow DOM. Nombres de props y variantes **idénticos a Figma**. Todos enlazados a Semantic. Cada componente tiene su ficha en la página Documentación (`doc/<nombre>`) con "Cómo se usa" y "No confundir con".

### Convención de propiedades

| Propiedad | Valores | Para qué |
| --- | --- | --- |
| Breakpoint | Desktop · Mobile | Cambios de layout responsive. En código no es una prop: media query |
| Type | según componente | Qué tipo de componente es (nunca "Variant") |
| State | Default · Hover · Pressed · Focus · Disabled (+ los del §7) | Estado. En código, Hover, Pressed y Focus son `:hover`, `:active` y `:focus-visible`; el resto son props (`disabled`, `selected`, `loading`…) |
| Open | False · True | Desplegables |
| Size | Small · Default · Large (+ Compact) | Tamaño |
| Theme | Default · Inverse · Transparent | Color sobre fondos especiales |
| Show … | booleano | Mostrar u ocultar una parte |

Todo en inglés. Los valores que son contenido (por ejemplo, los tabs del mega menú) no son parte de la convención.

### Fichas

| Componente | Variantes / propiedades | Tokens y notas |
| --- | --- | --- |
| button | Type: Filled · Outline · Underline. State: Default · Hover · Pressed · Focus · Disabled · Loading (solo Filled). Props: Label · Show icon · Icon · Show underline · Show count · Show leading icon · Leading icon | Filled: color/action/*. Outline: color/border/strong (el borde no suma al alto: 36 como Filled). Underline: subrayado border/default (1 px) en reposo y border/strong (2 px) en hover y pressed. Focus: anillo separado (ver Foco). Loading: label "Enviando…", aria-busy |
| icon-button | Size: Default · Large. Background: None · Surface · Subtle. State: Default · Hover · Pressed · Focus · Disabled. Prop: Icon | Default 24 × 24 (icon/md). Large 48 × 48 (padding sm-md + icon/xl). Surface sobre otra superficie; Subtle para destacar entre mucha información |
| input | Type: Text · Select · Textarea. State: Empty · Filled · Focus · Error · Disabled. Open: False · True (solo Select). Props: Label · Show label · Helper · Show helper | Línea border/default → focus border/focus → error border/error. Select abierto: border/strong, chevron-up y select-menu Type=Text flotante |
| select | Type: Field · Filter. State: Default · Hover · Focus · Disabled · Filled. Open: False · True. Props: Name · Label · Value | Filled = Filter con opción elegida |
| select-menu | Type: Finishes · Filter · Text | Hasta 7 opciones. surface/default, border/default, sin sombra |
| select-option | State: Default · Hover · Selected · Focus · Disabled. Props: Name · Show swatch | Hover surface/faint, Selected role/body-medium, Focus border/focus |
| tab | State: Default · Hover · Selected · Focus · Disabled. Prop: Label | role/label; seleccionado con línea border/strong. Un solo tab en todo el sitio |
| nav-link | Breakpoint: Desktop · Mobile. State: Default · Hover · Pressed · Current · Focus. Open: False · True. Theme: Default · Inverse. Props: Label · Has dropdown | Hover subrayado; Current guion de space/gap/sm × border/strong (8 × 2); Open: solo gira la flecha (sin subrayado) |
| navbar | Breakpoint: Desktop · Mobile. Mode: Default · Search · Menu · Products. Theme: Default · Transparent | 56 px de alto. Transparent sobre el hero: fondo translúcido (color/overlay/translucent) + blur (blur/backdrop); pasa a Default al hacer scroll |
| mega-menu | Tab: Aplicación · Lámparas y artefactos · Colecciones | Un solo componente; categorías, links y "Ver todo…" salen de los datos. Usa tab y mega-link |
| mega-link | Type: Link · Group. State: Default · Hover · Focus. Size: Default · Large. Open: False · True. Props: Name · Meta · Show meta · Show image · Show arrow | Link role/body (Large role/body-lg). Group role/body-xl con icon/plus / icon/minus |
| logo | Size: Default · Small · Compact | 181 / 158 / 117 px |
| footer · footer-link | Breakpoint: Desktop · Mobile / State: Default · Hover · Pressed · Focus | — |
| search-field | State: Empty · Focus · Filled. Prop: Show close | Campo con borde del navbar |
| search-result · search-see-all | State: Default · Hover · Active (solo search-result) · Focus | Miniatura, nombre, SKU, flecha |
| search-dropdown · search-screen | State: Results · No results (· Empty en search-screen) | Desktop / mobile |
| hero | Breakpoint: Desktop · Mobile. Props: Eyebrow · Show eyebrow · Title · Description · Show description · Show button | Media + hero/scrim. Eyebrow role/label, título role/display, button Outline en Dark local (CTA por slot). Alto: ratio/wide desktop; 70svh mobile |
| section-header | Breakpoint: Desktop · Mobile. Type: Link · Description · Title · Stacked. Props: Title · Description | role/heading-2 y role/body-lg. Sin separador. Gap título–bajada sm-md, textos–link lg. Bajada Description hasta layout/measure. En Mobile el link no se muestra: la página pone un button al final del bloque |
| page-header | Breakpoint: Desktop · Mobile. Type: List · Detail. Props: Title · Description · Show breadcrumb · Show description · Show back · Show action | Título role/display. Sin desplegable |
| breadcrumb · breadcrumb-item | Levels: 3 · 2 / State: Default · Hover · Current. Props: Label · Show separator | role/label. El ítem actual no lleva link ni separador |
| cta-block | Type: Button · Newsletter. Breakpoint: Desktop · Mobile. Props: Title · Description | Fondo color/bg/subtle, padding space/section/md |
| feature-block | Layout: Image left · Image right. Breakpoint: Desktop · Mobile. Props: Label · Title · Description · Show secondary image | Breakpoint=Mobile apila |
| faq-item | Open: False · True. State: Default · Hover · Focus. Props: Question · Answer | Home. No confundir con accordion-item |
| accordion-item | Open: False · True. State: Default · Hover · Focus. Breakpoint: Desktop · Mobile. Prop: Title | Ficha: bloques de especificaciones con spec-list adentro |
| spec-list · spec-row | Props: Title / Label · Value | Cantidad de filas libre en código |
| category-card | Breakpoint: Desktop · Mobile. State: Default · Hover · Focus. Prop: Name | Home. Toda la tarjeta es link. ratio/portrait-soft |
| line-card | Breakpoint: Desktop · Mobile. State: Default · Hover · Focus. Props: Label · Name · Description | Home, editorial. ratio/landscape (Desktop) · ratio/square (Mobile) |
| family-card | Size: Default · Large. State: Default · Hover · Focus. Prop: Name | Ficha: otras familias de la colección. Misma imagen que la product-card del grupo (estudio, luz apagada) |
| product-card | Size: Large · Small. State: Default · Hover · Focus. Props: Name · Meta · Show meta · Show finishes · Show compare | Toma el ancho de su columna (FILL). ratio/portrait. Hover y Iluminar cambian la imagen (ver Imágenes de product-card) |
| product-gallery · gallery-thumb | Breakpoint: Desktop · Mobile / State: Default · Hover · Selected · Focus | ratio/landscape |
| carousel-controls | Position: Start · Middle · End | icon-button Large con flechas |
| catalog-toolbar | Breakpoint: Desktop · Mobile. Props: Count · Show iluminar | Cantidad ("11 productos" / "10 colecciones"), toggle Iluminar y botón Filtrar |
| catalog-nav · catalog-nav-group · catalog-nav-item | — / Open: True · False / Size: Large · Default. State: Default · Hover · Selected · Focus | Sidebar desde 1024 px |
| catalog-nav-mobile · catalog-nav-trigger | Open: False · True / Open × State: Default · Hover · Focus | Hasta 1023 px. Abierto: la sección actual abierta con su opción marcada; las demás visibles y cerradas |
| filter-panel · filter-row · filter-chip · filter-bar | Breakpoint / Open × State / State: Default · Hover · Focus / State: Default · Applied × Breakpoint | filter-panel desktop con scrim; mobile pantalla completa sin scrim |
| checkbox | Size: Large · Default. Checked: False · True. State: Default · Hover · Focus · Disabled. Props: Label · Show label | Filtros y "Comparar" en tarjetas |
| toggle · toggle-switch | Checked: False · True. State: Default · Hover · Focus · Disabled. Props: Label · Show label | Pista 38 × 18, radius/pill |
| choice-chip | State: Default · Hover · Selected · Focus · Disabled. Prop: Label | Formularios. No confundir con option-tile |
| option-group · option-tile | Type: Tiles · Select · Swatches / State: Default · Hover · Selected · Focus · Disabled | Configurador de la ficha. option-tile funciona como radio |
| swatch · swatch-picker | Size: Small · Default · Large. State: Default · Hover · Selected · Focus · Disabled | Elegir acabado en la ficha. Cantidad variable en código. Disabled: acabado sin combinación con las otras opciones elegidas |
| tag | Type: Plain · Outline. Prop: Label | No interactivo |
| count-badge | Tone: Primary · Inverse. Prop: Count | Mín. 20, crece con el número |
| divider | Orientation: Horizontal · Vertical. Emphasis: Subtle · Default | — |
| sku | Size: Default · Compact. State: Default · Hover · Copied. Prop: Code | Botón de copiar. Código en role/body-lg (Default) o role/body (Compact) |
| variants-table · variants-table-row | Filters: Off · On × Breakpoint / Type: Header · Row. State: Default · Hover | Un solo contenedor con overflow-x; columnas fijas con position: sticky. Sin scroll por fila |
| download-modal · download-item | Breakpoint: Desktop · Mobile / Emphasis: Default · Featured. State: Default · Hover · Focus | Desktop: esquina inferior derecha a layout/gutter. Mobile: pantalla completa. Siempre con scrim |
| file-upload | State: Empty · Attached. Props: Label · Helper | — |
| form-section-header · form-message | Props: Number · Show number · Label / Tone: Success · Error. Prop: Message | form-message sin ícono |
| contact-item · link-list | State: Default · Hover · Focus. Props: Label · Value / Props: Title · Show link 3 | Valor como link mailto: / tel: |
| compare-header · compare-group · compare-row · compare-product | Type: Default · Compact × Breakpoint / Label / Breakpoint + Value 1–3 / State: Filled · Empty | Hasta 3 productos. Cada columna es un producto (grupo): selects de colección, producto y uno por atributo de variante (rediseño de compare-product pendiente) |
| compare-bar · compare-slot | Breakpoint: Desktop · Mobile / Size: Default · Compact. State: Filled · Empty | Barra fija inferior, en Dark local |

El inventario completo con links a Figma está en el [Anexo A](#anexo-a-inventario-de-componentes).

### Reutilización

- **Botones:** un solo button. El botón blanco sobre fotos es Filled en un contenedor en modo Dark. El ícono siempre usa el color del texto (`currentColor`).
- **Íconos:** 20 íconos de trazo de 1 px, `stroke="currentColor"`. Cada uno tiene `Theme=Default` (color/icon/primary) e `Inverse` (color/icon/inverse, solo sobre foto u oscuro en modo claro).
- **Formularios:** input cubre contacto (texto, select, textarea), el email del Home (Show label = false) y la versión oscura.
- **Desplegables:** accordion-item, faq-item, filter-row, catalog-nav-group y catalog-nav-trigger comparten patrón. En código, un solo disclosure base.
- **Tarjetas:** toman el ancho de su columna (FILL); no se pisa el tamaño en la instancia.
- **Cantidades variables** (swatch-picker, option-group, spec-list, filas): en Figma se ocultan las que sobran; en código la cantidad es libre.

### Overlays

- Fondo `color/overlay/scrim` detrás del panel abierto.
- download-modal: desktop en la esquina inferior derecha, separado `layout/gutter`; mobile pantalla completa respetando `layout/gutter`. Siempre con scrim.
- filter-panel: desktop panel lateral derecho a todo el alto, con scrim; mobile pantalla completa, sin scrim.

### Imágenes de product-card (hover e Iluminar)

Aplica a product-card en los listados de Productos y Colecciones (las cards de colección siguen el mismo criterio; de dónde salen sus cuatro imágenes: `TODO` en la base). Cada producto trae **cuatro imágenes**, todas en `ratio/portrait` (7:10) y con el mismo encuadre:

| | Reposo | Hover / Focus |
| --- | --- | --- |
| **Light** (Iluminar apagado) | Estudio, luz apagada | Contexto, luz apagada |
| **Dark** (Iluminar encendido) | Estudio, luz encendida | Contexto, luz encendida |

- El hover **no** usa borde: cambia la imagen. El foco de teclado muestra la misma imagen que el hover, además del anillo `color/border/focus`.
- El cambio es un fundido entre dos `<img>` apiladas (sin mover el layout). Usa `motion/duration/slow` con `motion/easing/standard`. Con `prefers-reduced-motion: reduce`, el cambio es instantáneo.
- La imagen que se muestra depende de `data-arq-theme` del ancestro: al activar Iluminar en `catalog-toolbar`, todas las tarjetas pasan a las versiones encendidas.
- En pantallas táctiles no hay hover: se ve solo la imagen de estudio.
- Aplica también a `Size=Small`. Una tarjeta Large pasa sola al aspecto Small hasta 767 px (grilla mobile).
- Si falta la imagen de contexto, no hay cambio en hover. Si falta la versión encendida, se usa la apagada. Si falta la de estudio, se muestra un fondo `color/surface/subtle` con el nombre: nunca se rompe la tarjeta.
- Solo se carga de entrada la imagen visible; las de hover y las encendidas se cargan en diferido (`loading="lazy"` o al primer hover / al activar Iluminar).
- Las imágenes vienen de los datos (Sheets → Typesense). Los nombres de los campos van en `docs/typesense-schema.md`; diseño todavía no definió qué columna es la de estudio y cuál la de contexto: hasta entonces, `TODO`.
- En Figma, la variante `State=Hover` de product-card es una referencia estática: muestra el estado, no el cambio de imagen. Para este comportamiento manda esta sección.

### Acabados de producto

- Los acabados no son tokens: son contenido. Cada acabado es una imagen.
- Sheets trae el nombre como texto ("blanco", "Gris Grafito"). El código lo normaliza a un slug en inglés con un único archivo de mapeo.
- La imagen se sirve desde el servidor de imágenes de la empresa (Amazon). Si falta, se muestra un neutro con el nombre en texto: nunca rompe la ficha.
- En la ficha, el acabado se elige con swatch-picker (option-group Type=Swatches).

---

## 9. Accesibilidad

- Contraste mínimo AA: 4.5 para texto normal y 3 para texto grande.
- Foco visible con `color/border/focus` en todo elemento interactivo. Área táctil mínima 24 × 24 px.
- Inputs con `<label>` siempre (con `aria-label` si Show label = false); error con `aria-invalid` y mensaje.
- Tabs con `role="tablist"`, `role="tab"` y `aria-selected`; flechas ←→ para moverse.
- Desplegables con `aria-expanded`; option-tile con `role="radio"` dentro de `role="radiogroup"`.

---

## 10. Hacer / Evitar

- **Hacer:** usar solo Semantic; reutilizar un componente antes de crear uno; revisar en Light/Dark y Desktop/Mobile; leer el diseño desde Figma por MCP.
- **Evitar:** hex, px o rem a mano; Primitives en componentes; sombras; esquinas redondeadas (salvo `radius/pill`); otra familia tipográfica; cambiar el peso en hover; que el foco cambie el tamaño; inventar tokens o estados.
- **Evitar:** nombrar variantes por dispositivo cuando lo que cambia es la función. Usar Type o Mode.

---

## 11. Cómo agregar algo nuevo

1. **Token semántico:** se propone al equipo → se crea en 2 · Semantic con descripción y nombre CSS → `tokens.json` → `npm run tokens` → se documenta acá.
2. **Componente:** primero se revisa si uno existente lo cubre con una variante o propiedad. Si no: se diseña en Componentes con todos sus estados, enlazado a Semantic → tarjeta en Trello → la IA lo construye y lo suma a `demo/index.html` con todos sus estados.
3. **Si algo no está definido:** no se inventa. `TODO` y aviso en Trello.

---

## 12. Pendientes conocidos

- **SKU:** el criterio de formato está pendiente (no hay información final). Hasta entonces, el SKU se trata como un identificador opaco, tal como viene de Sheets; el slug se deriva aparte.
- **Códigos de acabado** (N, V, R, B, BN, P): falta la tabla de equivalencias para mostrar el nombre.
- **project-mosaic y carousel:** se resuelven en código (grid + aspect-ratio; snap y peek), no como componentes de Figma.
- **button Loading:** no hay ícono de carga en la librería.
- **product-card:** qué columnas de la base son la foto de estudio y la de contexto, y de dónde salen las cuatro imágenes de una card de colección.
- **Ficha técnica en PDF** y **Descargar comparación:** falta el diseño del PDF.
- **compare-product:** rediseño con selects de colección, producto y uno por atributo de variante (`docs/decisiones.md`, 2026-10-02 · Comparativa).
- **Galerías** (product-gallery, ambiente, Inspiración, colección): cantidad de imágenes. Si hay más de las que entran, se desliza.
- **Acabados:** sin definir (imágenes y tabla de códigos).

---

## Anexo A. Inventario de componentes

Link a cada set en Figma (`node-id`). Base: `https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=`

| Componente | Nodo | Propiedades |
| --- | --- | --- |
| accordion-item | [922-2645](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=922-2645) | Title; Open: False · True; State: Default · Hover · Focus; Breakpoint: Desktop · Mobile |
| breadcrumb | [1244-12667](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1244-12667) | Levels: 3 · 2 |
| breadcrumb-item | [1053-4430](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1053-4430) | Label; Show separator; State: Default · Hover · Current |
| button | [907-2375](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=907-2375) | Label; Show icon; Icon; Show underline; Show count; Show leading icon; Leading icon; Type: Filled · Outline · Underline; State: Default · Hover · Pressed · Focus · Disabled · Loading |
| carousel-controls | [1410-17825](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1410-17825) | Position: Start · Middle · End |
| catalog-nav | [1035-2411](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1035-2411) | — |
| catalog-nav-group | [1035-2410](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1035-2410) | Label; Open: True · False |
| catalog-nav-item | [1035-2382](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1035-2382) | Label; Size: Large · Default; State: Default · Hover · Selected · Focus |
| catalog-nav-mobile | [1207-3314](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1207-3314) | Open: False · True |
| catalog-nav-trigger | [1215-3337](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1215-3337) | Label; Open: False · True; State: Default · Hover · Focus |
| catalog-toolbar | [1244-4058](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1244-4058) | Count; Show iluminar; Breakpoint: Desktop · Mobile |
| category-card | [1036-2461](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1036-2461) | Name; Breakpoint: Desktop · Mobile; State: Default · Hover · Focus |
| checkbox | [975-2322](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=975-2322) | Label; Show label; Size: Large · Default; Checked: False · True; State: Default · Hover · Focus · Disabled |
| choice-chip | [1113-2485](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1113-2485) | Label; State: Default · Hover · Selected · Focus · Disabled |
| compare-bar | [1233-3963](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1233-3963) | Title; Breakpoint: Desktop · Mobile |
| compare-group | [1263-4320](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1263-4320) | Label |
| compare-header | [1265-4330](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1265-4330) | Type: Default · Compact; Breakpoint: Desktop · Mobile |
| compare-product | [1057-2522](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1057-2522) | Name; SKU; State: Filled · Empty |
| compare-row | [1263-4317](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1263-4317) | Label; Value 1–3; Show value 1–3; Breakpoint: Desktop · Mobile |
| compare-slot | [1233-3656](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1233-3656) | Name; Meta; Size: Default · Compact; State: Filled · Empty |
| contact-item | [1303-4340](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1303-4340) | Label; Value; State: Default · Hover · Focus |
| count-badge | [1231-3557](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1231-3557) | Count; Tone: Primary · Inverse |
| cta-block | [1265-4464](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1265-4464) | Title; Description; Type: Button · Newsletter; Breakpoint: Desktop · Mobile |
| divider | [1244-3990](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1244-3990) | Orientation: Horizontal · Vertical; Emphasis: Subtle · Default |
| download-item | [1101-5542](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1101-5542) | Label; Emphasis: Default · Featured; State: Default · Hover · Focus |
| download-modal | [1375-4948](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1375-4948) | Title; Breakpoint: Desktop · Mobile |
| family-card | [1094-5766](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1094-5766) | Name; Size: Default · Large; State: Default · Hover · Focus |
| faq-item | [1036-2430](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1036-2430) | Question; Answer; Open: False · True; State: Default · Hover · Focus |
| feature-block | [1036-2535](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1036-2535) | Label; Title; Description; Show secondary image; Layout: Image left · Image right; Breakpoint: Desktop · Mobile |
| file-upload | [1113-2499](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1113-2499) | Label; Helper; State: Empty · Attached |
| filter-bar | [1068-5165](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1068-5165) | State: Default · Applied; Breakpoint: Desktop · Mobile |
| filter-chip | [1238-3693](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1238-3693) | Label; State: Default · Hover · Focus |
| filter-panel | [1225-13576](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1225-13576) | Title; Summary; Show summary; Show applied; Breakpoint: Desktop · Mobile |
| filter-row | [1225-3405](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1225-3405) | Label; Open: True · False; State: Default · Hover · Focus |
| footer | [788-3104](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=788-3104) | Breakpoint: Desktop · Mobile |
| footer-link | [788-2930](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=788-2930) | Label; Show icon; Icon; State: Default · Hover · Pressed · Focus |
| form-message | [1311-4871](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1311-4871) | Message; Tone: Success · Error |
| form-section-header | [1303-4382](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1303-4382) | Number; Show number; Label |
| gallery-thumb | [920-2474](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=920-2474) | State: Default · Hover · Selected · Focus |
| hero | [1311-4340](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1311-4340) | Eyebrow; Show eyebrow; Title; Description; Show description; Show button; Breakpoint: Desktop · Mobile |
| icon-button | [752-2882](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=752-2882) | Icon; Size: Default · Large; Background: None · Surface · Subtle; State: Default · Hover · Pressed · Focus · Disabled |
| input | [930-2364](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=930-2364) | Label; Show label; Helper; Show helper; Type: Text · Select · Textarea; State: Empty · Filled · Focus · Error · Disabled; Open: False · True |
| line-card | [1036-2490](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1036-2490) | Label; Name; Description; Breakpoint: Desktop · Mobile; State: Default · Hover · Focus |
| link-list | [1303-4377](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1303-4377) | Title; Show link 3 |
| logo | [751-4307](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=751-4307) | Size: Default · Small · Compact |
| mega-link | [840-2070](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=840-2070) | Name; Meta; Show meta; Show image; Show arrow; Type: Link · Group; State: Default · Hover · Focus; Open: False · True; Size: Default · Large |
| mega-menu | [841-2282](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=841-2282) | Tab: Aplicación · Lámparas y artefactos · Colecciones |
| nav-link | [752-2866](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=752-2866) | Label; Has dropdown; Breakpoint: Desktop · Mobile; State: Default · Hover · Pressed · Focus · Current; Open: False · True; Theme: Default · Inverse |
| navbar | [753-2907](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=753-2907) | Breakpoint: Desktop · Mobile; Mode: Default · Menu · Search · Products; Theme: Default · Transparent |
| option-group | [921-2560](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=921-2560) | Label; Type: Tiles · Select · Swatches |
| option-tile | [921-2487](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=921-2487) | Label; State: Default · Hover · Selected · Focus · Disabled |
| page-header | [1244-4016](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1244-4016) | Title; Description; Show breadcrumb; Show description; Show back; Show action; Breakpoint: Desktop · Mobile; Type: List · Detail |
| product-card | [990-2372](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=990-2372) | Name; Meta; Show meta; Show finishes; Show compare; Size: Large · Small; State: Default · Hover · Focus |
| product-gallery | [920-2490](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=920-2490) | Breakpoint: Desktop · Mobile |
| search-dropdown | [796-2271](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=796-2271) | State: Results · No results |
| search-field | [795-2179](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=795-2179) | Show close; State: Empty · Focus · Filled |
| search-result | [789-3045](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=789-3045) | Name; Meta; Show image; State: Default · Hover · Active · Focus |
| search-screen | [796-2351](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=796-2351) | State: Empty · Results · No results |
| search-see-all | [795-2206](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=795-2206) | State: Default · Hover · Focus |
| section-header | [1036-2448](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1036-2448) | Title; Description; Breakpoint: Desktop · Mobile; Type: Link · Description · Title · Stacked |
| select | [921-2544](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=921-2544) | Name; Label; Value; Type: Field · Filter; State: Default · Hover · Focus · Disabled · Filled; Open: False · True |
| select-menu | [1061-4867](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1061-4867) | Type: Finishes · Filter · Text |
| select-option | [921-2500](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=921-2500) | Name; Show swatch; State: Default · Hover · Selected · Focus · Disabled |
| sku | [920-2539](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=920-2539) | Code; Size: Default · Compact; State: Default · Hover · Copied |
| spec-list | [922-2500](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=922-2500) | Title |
| spec-row | [922-2497](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=922-2497) | Label; Value |
| swatch | [1063-4880](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1063-4880) | Size: Small · Default · Large; State: Default · Hover · Selected · Focus · Disabled |
| swatch-picker | [1063-4881](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1063-4881) | — |
| tab | [929-2287](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=929-2287) | Label; State: Default · Hover · Selected · Focus · Disabled |
| tag | [981-2305](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=981-2305) | Label; Type: Plain · Outline |
| toggle | [926-3102](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=926-3102) | Label; Show label; Checked: False · True; State: Default · Hover · Focus · Disabled |
| toggle-switch | [1131-6383](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1131-6383) | Checked: False · True; State: Default · Hover · Focus · Disabled |
| variants-table | [1068-5582](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1068-5582) | Filters: Off · On; Breakpoint: Desktop · Mobile |
| variants-table-row | [923-2708](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=923-2708) | Type: Header · Row; State: Default · Hover |

**Íconos (20):** arrow-down, arrow-left, arrow-right, arrow-up, arrow-up-right, chevron-down, chevron-left, chevron-right, chevron-up, close, copy, download, filter, filter-off, instagram, menu, minus, plus, search, youtube. Cada uno con `Theme: Default · Inverse`.
