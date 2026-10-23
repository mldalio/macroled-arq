# Configurador Daö conectado a la base

## Archivos
- `index.html`, `styles.css`: la maqueta del demo (con panel "Revisión de la base" y fotos reales).
- `base.js`: lee la base (CSV o Typesense), arma el modelo (aro → cabezal → lámpara → frente) y avisa qué hay que arreglar.
- `app.js`: la interfaz. Todo lo que muestra sale de la base.
- `config.js`: acá se activa Typesense (viene comentado).
- `base-rows.js`: datos del CSV (se genera con `generar_base.py`; se ignora si Typesense está activo).

## Leer de Typesense
1. Abrí `config.js`, descomentá `window.TYPESENSE` y completá host y `apiKey`.
   Usá una API key de SOLO BÚSQUEDA limitada a la colección `macroled_arq` (la página es pública).
2. Listo: el configurador hace 1 consulta por `familia` ("Dao") y 1 o 2 más por SKU para traer
   las piezas referenciadas que no sean de esa familia (PAR11, frentes). Solo filtra por campos indexados.

Qué lee de cada documento: `sku`, `familia`, `product_name`, `categoria`, `grupo_variantes`, `color_carcasa`, `modulos`,
`tamanio` o `dimensiones` (el primero que tenga valor), `cabezales_compatibles`, `lamparas_compatibles`, `frentes_compatibles`
(texto con comas o lista), `orientacion`, `visto_en_cielorraso`, `angulo_apertura`, `temperatura_color`
y las fotos desde `multimagen_producto` ([0] apagada, [1] prendida).

## Leer de un CSV (pruebas)
`python3 generar_base.py "Macroled ARQ - Base de datos.csv"` y abrir `index.html` (con Typesense desactivado).

## Lo que sigue escrito en el código (`base.js`, bloque de configuración)
- Orden de grupos y tarjetas, y colores de las muestras (`COLOR_HEX`).
- Bornera + casquillo GU10 y panal (`EXTRAS`): cuando tengan SKU en la base, completar `sku` y se leen de ahí.
