#!/usr/bin/env python3
"""Convierte el CSV exportado de la base (Archivo > Descargar > CSV) en base-rows.js.

Uso:   python3 generar_base.py "Macroled ARQ - Base de datos.csv"  [base-rows.js]

Solo se copian los SKU de Daö (DAO-...) y de PAR11 (PAR11-...) y las columnas que usa el configurador.
Si falta alguna columna, no se inventa nada: el configurador la avisa en el panel "Revisión de la base".
"""
import csv, json, sys, pathlib

COLUMNAS = ["sku", "product_name", "categoria", "grupo_variantes", "color_carcasa", "modulos", "dimensiones",
            "cabezales_compatibles", "lamparas_compatibles", "frentes_compatibles",
            "orientacion", "visto_en_cielorraso", "angulo_apertura", "temperatura_color",
            "img_hero_on", "img_hero_off"]
PREFIJOS = ("DAO-", "PAR11-")

src = pathlib.Path(sys.argv[1])
dst = pathlib.Path(sys.argv[2] if len(sys.argv) > 2 else "base-rows.js")

with open(src, newline="", encoding="utf-8-sig") as f:
    rd = csv.DictReader(f)
    campos = rd.fieldnames or []
    filas = []
    for r in rd:
        sku = (r.get("sku") or "").strip()
        if sku.startswith(PREFIJOS):
            filas.append({c: (r.get(c) or "").strip() for c in COLUMNAS if c in campos})

faltan = [c for c in COLUMNAS if c not in campos]
dst.write_text(
    "/* Generado por generar_base.py desde %s. No editar a mano. */\n"
    "window.BASE_ORIGEN = %s;\nwindow.BASE_ROWS = %s;\n" % (
        src.name, json.dumps(src.name, ensure_ascii=False), json.dumps(filas, ensure_ascii=False, indent=1)),
    encoding="utf-8")
print(f"{len(filas)} filas escritas en {dst}")
if faltan:
    print("Columnas que no están en el CSV:", ", ".join(faltan))
