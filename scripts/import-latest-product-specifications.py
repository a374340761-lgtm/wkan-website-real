"""Import reviewed, non-price specification rows from the latest source folder."""
import json
import re
import subprocess
import sys
from html import escape
from pathlib import Path

import openpyxl

ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path(sys.argv[1])
DATA = ROOT / "data/product-specifications-2026.json"
LOCALES = ("en", "zh", "de", "es", "fr", "it", "pt", "ru", "nl", "da", "sv")
# The localized labels below share the same units and row data.
HEADERS = {
    "model": ("Model", "型号", "Modell", "Modelo", "Modèle", "Modello", "Modelo", "Модель", "Model", "Model", "Modell"),
    "size": ("Dimensions", "尺寸", "Maße", "Medidas", "Dimensions", "Misure", "Dimensões", "Размеры", "Afmetingen", "Mål", "Mått"),
    "span": ("Width (m)", "宽度（米）", "Breite (m)", "Ancho (m)", "Largeur (m)", "Larghezza (m)", "Largura (m)", "Ширина (м)", "Breedte (m)", "Bredde (m)", "Bredd (m)"),
    "weight": ("Net weight (kg)", "净重（kg）", "Nettogewicht (kg)", "Peso neto (kg)", "Poids net (kg)", "Peso netto (kg)", "Peso líquido (kg)", "Вес нетто (кг)", "Nettogewicht (kg)", "Nettovægt (kg)", "Nettovikt (kg)"),
    "packed": ("Packed weight (kg)", "含包装重量（kg）", "Gewicht inkl. Verpackung (kg)", "Peso con embalaje (kg)", "Poids emballé (kg)", "Peso imballato (kg)", "Peso embalado (kg)", "Вес с упаковкой (кг)", "Gewicht incl. verpakking (kg)", "Vægt inkl. emballage (kg)", "Vikt inkl. emballage (kg)"),
    "carton": ("Carton (cm)", "箱规（cm）", "Karton (cm)", "Caja (cm)", "Carton (cm)", "Cartone (cm)", "Caixa (cm)", "Коробка (см)", "Doos (cm)", "Karton (cm)", "Kartong (cm)"),
    "posts": ("Uprights", "立柱数量", "Stützen", "Postes", "Montants", "Montanti", "Montantes", "Стойки", "Staanders", "Stolper", "Stolpar"),
    "dimensions": ("Upper / lower leg, cross tube, roof Ø25 / Ø22 (cm)", "大脚管 / 小脚管、交叉管、25 / 22 顶杆（cm）", "Oberes / unteres Bein, Kreuzrohr, Dach Ø25 / Ø22 (cm)", "Pata superior / inferior, travesaño, techo Ø25 / Ø22 (cm)", "Pied haut / bas, traverse, toit Ø25 / Ø22 (cm)", "Gamba alta / bassa, traversa, tetto Ø25 / Ø22 (cm)", "Perna superior / inferior, travessa, teto Ø25 / Ø22 (cm)", "Верх / низ стойки, поперечина, крыша Ø25 / Ø22 (см)", "Boven- / onderpoot, kruisprofiel, dak Ø25 / Ø22 (cm)", "Øvre / nedre ben, krydsrør, tag Ø25 / Ø22 (cm)", "Övre / nedre ben, tvärrör, tak Ø25 / Ø22 (cm)"),
    "pole": ("Pole diameter (mm)", "杆径（mm）", "Stangendurchmesser (mm)", "Diámetro del mástil (mm)", "Diamètre du mât (mm)", "Diametro asta (mm)", "Diâmetro da haste (mm)", "Диаметр стойки (мм)", "Stangdiameter (mm)", "Stangdiameter (mm)", "Stångdiameter (mm)"),
}
# Numeric or model columns only. Model WK-T40-P3*4.5 has a conflicting size in row 6.
SOURCES = (
    ("2002", "40 mm", "40管六边形帐篷各规格铝管尺寸.xlsx", "Sheet1", range(2, 11), {"size": 1, "dimensions": (2, 3, 4, 5, 6)}),
    ("series:wk-t40-p", "WK-T40-P", "广西伟群帐篷制造有限公司 网红帐篷.xlsx", "Sheet1", (3, 4, 5, 7, 8, 9, 10), {"model": 1, "size": 2, "posts": 3, "packed": 4, "carton": 5}),
    ("series:wk-t40-pof", "WK-T40-POF", "广西伟群帐篷制造有限公司 网红帐篷.xlsx", "Sheet1", range(12, 16), {"model": 1, "size": 2, "posts": 3, "packed": 4, "carton": 5}),
    ("series:ad-t90", "AD-T90", "广西伟群帐篷制造有限公司（圆顶帐篷，星星.xlsx", "单顶星帐", range(4, 10), {"model": 1, "size": 3, "carton": 4, "weight": 5}),
    ("series:ad-t99", "AD-T99", "广西伟群帐篷制造有限公司（圆顶帐篷，星星.xlsx", "双顶星帐", range(4, 10), {"model": 1, "size": 2, "carton": 3, "weight": 4}),
    ("series:ad-t12", "AD-T12", "广西伟群帐篷制造有限公司（圆顶帐篷，星星.xlsx", "天幕帐篷", range(4, 7), {"model": 1, "size": 2, "carton": 3, "weight": 4}),
    ("series:star-tent-wall-options", ("Star tent walls", "星帐围布", "Sternzeltwände", "Paredes para carpas estrella", "Parois pour tentes étoile", "Pareti per tende a stella", "Paredes para tendas estrela", "Стенки для шатров-звёзд", "Zijwanden voor stertenten", "Sider til stjernetelte", "Sidoväggar för stjärntält"), "伟群帐篷星帐围布报价表2026.xlsx", "Sheet1", range(3, 9), {"size": 1, "span": 2}),
    ("series:thick-pole-arches", "Ø20 / Ø24", "欢迎拱门价格.xlsx", "粗杆拱门", range(2, 5), {"size": 2, "pole": 3}),
)
REPLACEMENTS = (("半径", "R "), ("，高", " / H "), ("星帐围布", " tent wall"), ("米", " m"))
def rendered(value):
    return str(value).strip() if value is not None else ""

def standardized(value):
    for source, target in REPLACEMENTS:
        value = value.replace(source, target)
    return value.replace("*", " × ").replace("，", ", ")

def render_group(group, key, index, language, name):
    cells = []
    for row in group["rows"]:
        values = row if language == 1 else row["en"]
        cells.append("<tr>" + "".join(f'<td>{escape(values[field])}</td>' for field in group["source"]["columns"]) + "</tr>")
    headings = "".join(f'<th scope="col">{escape(HEADERS[field][language])}</th>' for field in group["source"]["columns"])
    return (
        f'<details class="spec-library-group" id="spec-group-{key}-{index}" data-latest-spec>'
        f'<summary><span>{escape(name)}</span></summary><div class="spec-library-content">'
        f'<div aria-label="{escape(name)}" class="spec-library-table" role="region" tabindex="0">'
        f'<table><thead><tr>{headings}</tr></thead><tbody>{"".join(cells)}</tbody></table></div></div></details>'
    )

def main():
    payload = json.loads(DATA.read_text(encoding="utf-8"))
    products = payload["products"]
    library_insertions = []
    for key, title, filename, sheet, row_numbers, columns in SOURCES:
        titles = title if isinstance(title, tuple) else (title,) * len(LOCALES)
        book = openpyxl.load_workbook(SOURCE / filename, read_only=True, data_only=True)
        try:
            source_rows = list(book[sheet].values)
        finally:
            book.close()
        rows = []
        for number in row_numbers:
            source = source_rows[number - 1]
            row = {}
            for field, column in columns.items():
                if isinstance(column, tuple):
                    row[field] = " / ".join(rendered(source[i - 1]) or "—" for i in column)
                else:
                    row[field] = rendered(source[column - 1])
                if key == "series:thick-pole-arches" and field == "pole":
                    diameter = re.search(r"(\d+)\s*mm", row[field], re.I)
                    row[field] = diameter[1] if diameter else ""
                if re.search(r"[¥￥]|单价|成本|不含税|人民币|售价", row[field]):
                    raise ValueError(f"Commercial text in mapped technical cell: {filename}, row {number}")
            row["en"] = {field: standardized(value) for field, value in row.items()}
            rows.append(row)
        group = {
            "titleZh": titles[1],
            "titleEn": titles[0],
            "columns": [{"key": field, "en": HEADERS[field][0], "zh": HEADERS[field][1]} for field in columns],
            "rows": rows,
            "notesZh": [],
            "notesEn": [],
            "source": {"file": filename, "sheet": sheet, "rows": list(row_numbers), "columns": columns, "review": "latest-price-list"},
        }
        groups = products.setdefault(key, [])
        index = next((i for i, entry in enumerate(groups) if entry["source"].get("review") == "latest-price-list"), len(groups))
        groups[index:index + 1] = [group]
        library_insertions.append((key, index, group, titles))

    DATA.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    products_path = ROOT / "scripts/products.js"
    runtime = (ROOT / "scripts/verified-specifications-runtime.js").read_text(encoding="utf-8")
    products_js = products_path.read_text(encoding="utf-8")
    embedded = "/* BEGIN VERIFIED 2026 SPECS */\nconst WK_VERIFIED_SPECIFICATIONS = "
    embedded += json.dumps(payload, ensure_ascii=False, separators=(",", ":")) + ";\n" + runtime + "\n/* END VERIFIED 2026 SPECS */"
    products_js, replaced = re.subn(r"/\* BEGIN VERIFIED 2026 SPECS \*/.*?/\* END VERIFIED 2026 SPECS \*/", lambda _: embedded, products_js, count=1, flags=re.S)
    if replaced != 1:
        raise ValueError("Missing verified specification data block")
    products_path.write_text(products_js, encoding="utf-8")

    for language, locale in enumerate(LOCALES):
        if locale in ("en", "zh"):
            continue
        path = ROOT / locale / "specifications-packing.html"
        html = path.read_bytes().decode("utf-8")
        for key, index, group, titles in library_insertions:
            details = render_group(group, key, index, language, titles[language])
            pattern = rf'<details\b[^>]*\bid="spec-group-{re.escape(key)}-{index}"[^>]*>.*?</details>'
            if re.search(pattern, html, re.S):
                html = re.sub(pattern, lambda _: details, html, count=1, flags=re.S)
                continue
            section = re.search(rf'<section\b[^>]*\bid="spec-{re.escape(key)}"[^>]*>.*?(?=</section>)', html, re.S)
            if section:
                html = html[:section.end()] + details + html[section.end():]
            else:
                position = html.index('<section class="spec-library-help">')
                html = html[:position] + f'<section class="spec-library-family" id="spec-{key}">{details}</section>' + html[position:]
        path.write_bytes(html.encode("utf-8"))
    subprocess.run([sys.executable, str(ROOT / "scripts/build-specifications-library.py")], check=True)
    print(f"Imported {sum(len(group['rows']) for _, _, group, _ in library_insertions)} configurations into {len(LOCALES)} languages.")

if __name__ == "__main__":
    main()
