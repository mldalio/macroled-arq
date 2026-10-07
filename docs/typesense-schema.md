# Typesense · esquema de la colección de Arq

Campos disponibles en Typesense. Los componentes y `src/data/` usan **solo** los campos de este documento: si un campo no está acá, no existe.

- Fuente: Google Sheets «Macroled ARQ - Base de datos - Final». Los **encabezados de la hoja son los nombres de campo** (`product_name`, `description`, `color_carcasa`…). La sincronización (n8n, fuera del repo) pasa cada columna con su mismo nombre.
- **Un documento por fila**, `id` = `sku`. Estructura y decisiones: `docs/decisiones.md`, 2026-10-07 · Base de datos sin IDs.
- En el front se usa solo la search-only key (ver `.env.example`).
- El único archivo que conoce estos campos es `src/data/typesense-adapter.js` (los técnicos, `src/data/attributes.js`).

## Estado del índice (2026-10-07)

Colección `macroled_arq` en `typesense.coresagroup.com`: 139 documentos (132 SKU y 7 colecciones). Con fotos y textos de prueba: Kanu Jardín (SKU predeterminado) y la colección Kanu.

### Cómo se arma el catálogo

| Qué | Cómo | Campo |
| --- | --- | --- |
| Producto (grupo) | Filas con el mismo nombre. El id (slug de la ficha y del CMS) sale del nombre: «Kanu Jardín» → `kanu-jardin` | `product_name` |
| Fila no publicada | Sin nombre | `product_name` vacío |
| SKU predeterminado | Un `true` por producto; si no hay, el primero | `is_group_default` (bool) |
| Selectores de variante | Nombres de campo separados por coma: «color_carcasa, altura» | `variant_attributes` |
| Colección | Fila con `product_type` «Colección» (SKU `col-<id>`). Su `familia` lista las familias que reúne («Tori, Mini Tori»); el id sale del nombre | `product_type`, `familia`, `product_name` |
| Pertenencia a una colección | La colección cuya `familia` incluye la del producto. Los accesorios no entran. Una colección sin productos publicados no se muestra | `familia` |
| Accesorio | `product_type` «Accesorio». Con qué producto se usa: su nombre | `compatible_with` |
| Navegación | Ambiente = `macrofamilia` (Exterior · Interior); aplicación = `subfamilia`; tipo = `product_type` (Luminaria · Lámpara · Artefacto) | |

### Imágenes: listas con posición fija

Cada lista guarda siempre sus fotos en la misma posición; una foto que falta queda como `""` en su lugar. Una lista sin ninguna foto llega vacía (`[]`). La arma la sincronización a partir de las columnas `img_*` de la hoja.

| Lista | Posiciones |
| --- | --- |
| `multimagen_producto` | 0 `img_main` · 1 `img_main_on` |
| `multimagen_vistas` | 0 `img_front` · 1 `img_front_on` · 2 `img_back` · 3 `img_back_on` · 4 `img_left` · 5 `img_left_on` · 6 `img_right` · 7 `img_right_on` |
| `multimagen_perspectivas` | 0 `img_pers_1` · 1 `img_pers_1_on` · 2 `img_pers_2` · 3 `img_pers_2_on` |
| `multimagen_detalles` | 0 `img_detail_1` · 1 `img_detail_1_on` · 2 `img_detail_2` · 3 `img_detail_2_on` |
| `multimagen_ambiente` | 0 `img_ambient_1` · 1 `img_ambient_1_on` · 2–5 `img_ambient_2` a `img_ambient_5` · 6 `img_ambient_6` · 7 `img_ambient_7` |
| `multimagen_coleccion` | 0 `img_collection` · 1 `img_collection_on` · 2 `collection_description_image` |
| `collection_gallery_images`, `collection_inspiration_images` | Largo variable, en el orden de la celda (URLs separadas por salto de línea o coma) |

Dónde se usa cada foto:

| Lugar | Fotos | Con Iluminar |
| --- | --- | --- |
| product-card | Reposo `img_main` · hover `img_ambient_1` | `_on` de cada una; sin `_on`, la apagada |
| Galería de la ficha | `img_main`, `img_ambient_1`, front, back, left, right, pers_1, pers_2, detail_1, detail_2 (las que existen) | Cada una a su `_on` |
| Ficha: ambiente · descripción · inspiración | `img_ambient_2` a `5` · `img_ambient_6` · `img_ambient_7` (del SKU predeterminado) | No cambian |
| Card de colección | `img_collection` | `img_collection_on` |
| Página de colección | Galería, `collection_description_image`, inspiración | No cambian |

- Una variante sin fotos propias no toma las del predeterminado (serían de otro color o tamaño): se ve el fondo neutro.
- La card de colección no cambia en hover: tiene solo foto de reposo (decidido así por ahora; DESIGN.md §8 pide cuatro imágenes).

### Otros campos

- Textos: `description` (por SKU), `product_story_text`, `product_inspiration_text`, `escena_uso_sugerido`, `collection_intro_text`, `collection_description_text`. `video_inspiration`.
- Descargas: `ies`, `cad`, `manual`, `fotometria`.
- Sin uso en el sitio todavía: `categoria`, `new` (bool), `nombre_origen`.
- Técnicos: los de `src/data/attributes.js`, más `tension_pack`, `tension_salida`, `frecuencia`, `corriente_entrada`, `corriente_salida`, `marca_driver`, `anti_high_volt`, `on_off_switch`, `protector_spd`, `no_flicker`, `corriente_irrupcion`, `tiempo_irrupcion`, `clase_proteccion`, `max_lum_b16`, `max_lum_c10`, `max_lum_c16`, `td_distorsion_tonal`, `marca_led`, `tiempo_arranque`, `certificado_lm80`, `desviacion_color`, `grupo_seguridad_fotobiologica`, `conector`, `garantia_pack`, `instalacion`. Llegan como texto con unidad («12W», «50 cm», «-»).
- Facets: `familia`, `macrofamilia`, `subfamilia`, `potencia`, `temperatura_color`, `angulo_apertura`.

### Esquema y pendientes

- Los campos de la versión anterior siguen como obligatorios (`optional: false`): la sincronización los manda siempre, vacíos si no hay dato. Los nuevos (`categoria`, `new`, `compatible_with`, `multimagen_coleccion`, `collection_gallery_images`, `collection_inspiration_images`) son opcionales. Se quitaron `application`, `collection_name`, `environment` e `is_collection_default`.
- `TODO` (base): `altura` vacía en Tori y Sento (es lo que distingue sus variantes); `proteccion_ik` pierde el cero inicial (la hoja la toma como número).
- `TODO` (seguridad): el `.env` de desarrollo usa una clave con permisos de escritura; antes de un release hace falta una search-only.

---

## Propuesta original (versión 5) · histórico

Lo que sigue es la propuesta con la que se armó la base. **No es el estado actual**: no existen `product_group_id`, `collection_id` ni las columnas `img_*` como campos de Typesense. Queda como referencia de los usos de cada dato.

## Nombres de campo

- Los nombres los define el índice (ver Estado del índice): no siempre siguen una regla (`Color de carcasa` → `color_carcasa`, `Descripcion` → `description`).
- `VARIANT_ATTRIBUTES` trae los nombres de columna tal como están en la hoja («Color de carcasa, Altura»), como texto. `src/data/attributes.js` los traduce a campos.
- Las etiquetas visibles («Color», «Altura», «Flujo luminoso») no salen de los nombres de campo: viven en un único archivo de `src/data/`, junto con las secciones del acordeón, los filtros, las filas de la comparativa y las columnas del glosario.

## Identificación y navegación

| Columna en Sheets | Campo | Tipo | Facet | Nivel | Uso |
| --- | --- | --- | --- | --- | --- |
| SKU | `sku` | string | — | SKU | Código de la variante. Identificador opaco (puede tener espacios o paréntesis) |
| PRODUCT_GROUP_ID | `product_group_id` | string | sí | grupo | Agrupa variantes. Slug de la ficha |
| PRODUCT_NAME | `product_name` | string | — | grupo | Título de la card y de la ficha |
| COLLECTION_ID | `collection_id` | string | sí | colección | Slug de la ficha de colección |
| COLLECTION_NAME | `collection_name` | string | — | colección | Nombre visible de la colección (breadcrumb, cards, mega menú) |
| APPLICATION | `application` | string | sí | grupo | Jardín, Bañadores, Aplicar, Pared, Embutir, Colgante. Vacío en lámparas y artefactos |
| ENVIRONMENT | `environment` | string[] | sí | grupo | Interior, Exterior o los dos (lámparas). Ver `docs/decisiones.md`, 2026-10-02 · Navegación |
| PRODUCT_TYPE | `product_type` | string | sí | grupo | Luminaria, Lámpara o Artefacto |
| COLLECTION_APPLICATIONS | `collection_applications` | string[] | — | colección | Aplicaciones de la colección (bajada del mega-link y de la card de colección) |
| IS_GROUP_DEFAULT | `is_group_default` | bool | sí | SKU | Un `true` por grupo: SKU inicial y card del grupo |
| IS_COLLECTION_DEFAULT | `is_collection_default` | bool | sí | SKU | Un `true` por colección: documento representante |
| VARIANT_ATTRIBUTES | `variant_attributes` | string[] | — | grupo | Campos de los selectores de variante, en orden |
| — | `sheet_order` | int32 | — | SKU | **Propuesto, no es una columna:** número de fila en la hoja, lo escribe la sincronización. Hace falta para "el primer SKU del grupo en el orden de la hoja" |

## Textos

| Columna en Sheets | Campo | Tipo | Nivel | Uso |
| --- | --- | --- | --- | --- |
| Descripcion | `description` | string | SKU | Resumen técnico junto a los selectores. Cambia con la variante |
| PRODUCT_STORY_TEXT | `product_story_text` | string | grupo | Ficha, sección Descripción. Markdown limitado: `##` título y `-` características |
| PRODUCT_INSPIRATION_TEXT | `product_inspiration_text` | string | grupo | Ficha, sección Inspiración |
| COLLECTION_INTRO_TEXT | `collection_intro_text` | string | colección | Ficha de colección, junto al título |
| COLLECTION_DESCRIPTION_TEXT | `collection_description_text` | string | colección | Ficha de colección, bloque texto + imagen |
| NOMBRE_ORIGEN | — | — | — | Referencia interna. No se muestra |

Los textos editoriales también van en el CMS para que estén en el HTML (`docs/decisiones.md`, 2026-10-02 · Textos editoriales).

## Imágenes y video (URLs)

| Columna en Sheets | Campo | Tipo | Nivel | Uso |
| --- | --- | --- | --- | --- |
| IMG_MAIN · IMG_MAIN_ON | `img_main` · `img_main_on` | string | SKU | Imagen principal; `_on` con Iluminar |
| IMG_AMBIENT_1 · IMG_AMBIENT_1_ON | `img_ambient_1` · `img_ambient_1_on` | string | SKU | Ambiente de la galería superior |
| IMG_PERS_1 · IMG_PERS_2 | `img_pers_1` · `img_pers_2` | string | SKU | Perspectivas (galería superior) |
| IMG_DETAIL_1 · IMG_DETAIL_2 | `img_detail_1` · `img_detail_2` | string | SKU | Detalles (galería superior) |
| IMG_FRONT · IMG_BACK · IMG_LEFT · IMG_RIGHT | `img_front` · `img_back` · `img_left` · `img_right` | string | SKU | Vistas disponibles; su uso en la galería se define en código |
| IMG_AMBIENT_2 a IMG_AMBIENT_5 | `img_ambient_2` … `img_ambient_5` | string | grupo | Galería de ambiente |
| IMG_AMBIENT_6 | `img_ambient_6` | string | grupo | Imagen junto a la Descripción |
| IMG_AMBIENT_7 | `img_ambient_7` | string | grupo | Inspiración |
| VIDEO_INSPIRATION | `video_inspiration` | string | grupo | Video opcional de Inspiración |
| IMG_COLLECTION · IMG_COLLECTION_ON | `img_collection` · `img_collection_on` | string | colección | Card del listado de Colecciones |
| COLLECTION_GALLERY_IMAGES | `collection_gallery_images` | string[] | colección | Primera galería de la ficha de colección (una URL por línea en la hoja) |
| COLLECTION_DESCRIPTION_IMAGE | `collection_description_image` | string | colección | Imagen junto a `collection_description_text` |
| COLLECTION_INSPIRATION_IMAGES | `collection_inspiration_images` | string[] | colección | Galería final de la ficha de colección |

- Campo vacío = la imagen no se muestra.
- `TODO` (orden): orden y selección de la galería superior. Propuesta del documento: main, ambient_1, pers_1, pers_2, detail_1, detail_2.

### Imágenes de product-card

Cuatro imágenes por producto (DESIGN.md §8): estudio y contexto, con la luz apagada y encendida. Diseño no definió todavía qué columna es la foto de estudio y cuál la de contexto (mismo encuadre, `ratio/portrait`).

| Imagen | Campo |
| --- | --- |
| Estudio, luz apagada | TODO |
| Contexto, luz apagada | TODO |
| Estudio, luz encendida | TODO |
| Contexto, luz encendida | TODO |

Las cards de Colecciones usan las mismas cuatro imágenes (`docs/decisiones.md`, 2026-10-02 · Cards). De dónde salen para una colección se define en la base: `TODO`.

## Descargas (URLs)

| Columna en Sheets | Campo | Tipo | Nivel | Uso |
| --- | --- | --- | --- | --- |
| IES | `ies` | string | SKU | Descarga IES |
| CAD | `cad` | string | SKU | Descarga CAD 2D/3D |
| MANUAL | `manual` | string | SKU | Descarga Manual |
| FOTOMETRIA | `fotometria` | string | SKU | Descarga Fotometría |

Si un campo está vacío, su descarga no se muestra. La ficha técnica no tiene columna: se genera en el front (`docs/decisiones.md`, 2026-10-02 · Ficha técnica en PDF).

## Características técnicas

`TODO`: el documento las nombra como rango («de Tension proveedor a Instalacion») sin listarlas. Para cada columna falta: nombre, campo, tipo (número o texto, por ejemplo «12W»), si es facet (filtro) y a qué sección del acordeón, fila de la comparativa y columna del glosario va.

## No se sincronizan

`VARIANT_CANDIDATES`, `COLLECTION_GALLERY_REFS`, `COLLECTION_DESCRIPTION_REF` y `COLLECTION_INSPIRATION_REFS` (columnas de ayuda de la hoja).

## Contrato de conversión

`TODO` (con la sincronización): checkboxes como `true` / `false` (no texto), listas (coma o una por línea) como arrays sin espacios de más, celdas vacías como campo ausente.
