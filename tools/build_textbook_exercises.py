import json
import re
from pathlib import Path
import csv


ROOT = Path(__file__).resolve().parents[1]
CACHE = ROOT.parent / "reference-ocr-cache"
OUTPUT = ROOT / "android-app" / "app" / "src" / "main" / "assets" / "textbook-exercises.json"
FORMULA_REVIEW = ROOT / "formula-review.csv"

BOOKS = [
    {"id": "song", "book": "최신 송배전공학", "subject": "송배전공학", "min_page": 16, "max_page": 582},
    {"id": "grid", "book": "전력계통공학", "subject": "계통공학", "min_page": 15, "max_page": 620},
    {"id": "generation", "book": "최신 발전공학", "subject": "발전공학", "min_page": 11, "max_page": 608},
]


def clean(text):
    text = re.sub(r"\s+", " ", str(text)).strip()
    text = re.sub(r"^[|ㆍ·\-\s]+", "", text)
    text = re.sub(r"[^\w가-힣%/().,\-+×÷=~\[\] ]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def chapter_from_text(text):
    compact = text.replace(" ", "")
    match = re.search(r"([0-9]{1,2})\s*장\s*([가-힣A-Za-z0-9 |ㆍ·-]{2,30})", text)
    if match:
        return clean(match.group(1) + "장 " + match.group(2))
    match = re.search(r"([0-9]{1,2})장([가-힣A-Za-z0-9]{2,20})", compact)
    if match:
        return clean(match.group(1) + "장 " + match.group(2))
    return ""


def is_exercise_page(text):
    compact = text.replace(" ", "")
    if any(bad in compact for bad in ["차례", "목차", "해답", "해탐", "부록", "찾아보기", "찾이보기"]):
        return False
    return "연습문제" in compact or "연슴문제" in compact or "연숨문제" in compact


def split_numbered(text):
    text = clean(text)
    text = re.sub(r"연[습슴숨]문제", " 연습문제 ", text)
    pattern = re.compile(r"(?:^|\s)([0-9]{1,2})[,.]\s+")
    matches = list(pattern.finditer(text))
    rows = []
    for idx, match in enumerate(matches):
        start = match.end()
        end = matches[idx + 1].start() if idx + 1 < len(matches) else len(text)
        number = int(match.group(1))
        body = clean(text[start:end])
        if len(body) < 12:
            continue
        if any(bad in body for bad in ["연습문제 해답", "해답", "찾아보기", "부록", "차례", "목차"]):
            continue
        if sum(ch.isdigit() for ch in body) > len(body) * 0.55:
            continue
        rows.append((number, body[:260]))
    return rows


def split_examples(text):
    cleaned = clean(text)
    pattern = re.compile(r"(?:예제|에제|의제|여제)\s*([0-9]{1,2}(?:[.\-]?[0-9]{1,2})?)|(?:이제)\s*([0-9]{1,2}[.\-][0-9]{1,2})")
    matches = list(pattern.finditer(cleaned))
    rows = []
    for idx, match in enumerate(matches):
        start = match.end()
        end = matches[idx + 1].start() if idx + 1 < len(matches) else len(cleaned)
        number = match.group(1) or match.group(2)
        body = clean(cleaned[start:end])
        if len(body) < 14:
            continue
        if any(bad in body for bad in ["연습문제", "해답", "찾아보기", "부록", "차례", "목차"]):
            continue
        stop = re.search(r"(?:\?|구하여라\.?|설명하여라\.?|계산하여라\.?|비교하여라\.?|열거하여라\.?)", body)
        if stop:
            body = body[:stop.end()]
        body = clean(body)
        if len(body) < 14:
            continue
        rows.append((number, body[:260]))
    return rows


def split_grid_examples(text, page):
    raw_lines = [re.sub(r"\s+", " ", line).strip() for line in text.splitlines()]
    lines = [clean(line) for line in raw_lines]
    word_marker = re.compile(r"^[^가-힣A-Za-z0-9]*(?:[@©®]\s*)?(?:예제|에제|여제|이제)\s*([0-9]{1,2}[-.][0-9]{1,2})\b")
    alias_marker = re.compile(r"^[^가-힣A-Za-z0-9]*[@©®]\s*(?:WA|wa|Wi|wi|WI|Wl|wl|wil|Fi|FH|PH|Pi|oI|OF|MI|Mi|21|4)\s*([0-9]{1,2}[-.][0-9]{1,2})\b")
    rows = []
    starts = []
    for idx, line in enumerate(raw_lines):
        match = word_marker.search(line) or alias_marker.search(line)
        if not match:
            continue
        starts.append((idx, match.group(1), line[match.end():]))
    for pos, (idx, number, remainder) in enumerate(starts):
        end_idx = starts[pos + 1][0] if pos + 1 < len(starts) else min(len(lines), idx + 36)
        body_lines = [remainder] + lines[idx + 1:end_idx]
        body = clean(" ".join(body_lines))
        body = re.sub(r"^(?:[)\]}|[JjilIl]+\s*)+", "", body).strip()
        if len(body) < 14:
            continue
        if any(bad in body for bad in ["연습문제", "해답", "찾아보기", "부록", "차례", "목차"]):
            continue
        stop = re.search(r"(?:\?|구하여라\.?|설명하여라\.?|계산하여라\.?|비교하여라\.?|열거하여라\.?)", body)
        if stop:
            body = body[:stop.end()]
        body = clean(body)
        if len(body) < 14:
            continue
        rows.append((number, body[:260]))
    if page == 34 and not any(number == "1-1" for number, _ in rows):
        body = clean(" ".join(lines[3:24]))
        if body:
            rows.insert(0, ("1-1", body[:260]))
    return rows


def infer_keyword(question):
    terms = [
        "과전류", "보호계전", "변압기", "송전", "배전", "케이블", "전압", "전류", "접지", "피뢰",
        "고장", "단락", "안정도", "무효전력", "주파수", "수력", "수차", "화력", "보일러", "터빈",
        "원자력", "원자로", "풍력", "태양광", "연료전지", "ESS", "경제급전", "조류계산",
    ]
    for term in terms:
        if term in question:
            return term
    tokens = re.findall(r"[가-힣A-Za-z0-9]{2,12}", question)
    return tokens[0] if tokens else "연습문제"


def formula_flags(question):
    number_count = len(re.findall(r"\d", question))
    unit_hits = len(re.findall(r"\[[^\]]{1,12}\]|kV|kW|MW|MVA|kVA|kg|km|m\]|%|pu|PU", question))
    operator_hits = len(re.findall(r"[=+×÷*/]|\\/", question))
    ask_calc = any(word in question for word in ["구하여라", "계산", "얼마", "몇 ", "산정", "비는", "배가"])
    suspicious = any(token in question for token in ["[07", "[0ㅁ", "mech", "ㅁ", "F719", "AAS", "SSS", "ARS", "MMO"])
    formula = unit_hits > 0 or operator_hits > 0 or number_count >= 8 or ask_calc
    review = formula and (suspicious or number_count >= 12 or operator_hits >= 2 or unit_hits >= 2)
    return formula, review


def exercise_page_allowed(text):
    compact = text.replace(" ", "")
    return not any(bad in compact for bad in ["차례", "목차", "해답", "해탐", "부록", "찾아보기", "찾이보기"])


def extract_book(book):
    page_dir = CACHE / book["id"] / "pages"
    rows = []
    last_chapter = ""
    for path in sorted(page_dir.glob("page_*.txt")):
        page = int(path.stem.split("_")[1])
        if page < book["min_page"] or page > book["max_page"]:
            continue
        text = path.read_text(encoding="utf-8", errors="replace")
        chapter = chapter_from_text(text) or last_chapter
        if chapter:
            last_chapter = chapter
        if not exercise_page_allowed(text):
            continue
        if is_exercise_page(text):
            for seq, (number, question) in enumerate(split_numbered(text), start=1):
                formula, review = formula_flags(question)
                rows.append({
                    "id": f"tx-{book['id']}-{page:04d}-{seq:02d}",
                    "kind": "exercise",
                    "book": book["book"],
                    "subject": book["subject"],
                    "chapter": chapter or "단원 연습문제",
                    "page": page,
                    "number": str(number),
                    "keyword": infer_keyword(question),
                    "question": question,
                    "formula": formula,
                    "reviewNeeded": review,
                })
        seen_examples = set()
        example_rows = split_grid_examples(text, page) if book["id"] == "grid" else split_examples(text)
        for seq, (number, question) in enumerate(example_rows, start=1):
            key = (number, question[:60])
            if key in seen_examples:
                continue
            seen_examples.add(key)
            formula, review = formula_flags(question)
            rows.append({
                "id": f"ex-{book['id']}-{page:04d}-{seq:02d}",
                "kind": "example",
                "book": book["book"],
                "subject": book["subject"],
                "chapter": chapter or "단원 예제",
                "page": page,
                "number": str(number),
                "keyword": infer_keyword(question),
                "question": question,
                "formula": formula,
                "reviewNeeded": review,
            })
    return rows


def main():
    all_rows = []
    for book in BOOKS:
        rows = extract_book(book)
        print(f"{book['book']} {len(rows)}", flush=True)
        all_rows.extend(rows)
    payload = {"version": 1, "source": "textbook OCR exercises and examples", "exercises": all_rows}
    OUTPUT.write_text(json.dumps(payload, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    with FORMULA_REVIEW.open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=["id", "kind", "book", "subject", "chapter", "page", "number", "keyword", "formula", "reviewNeeded", "question"])
        writer.writeheader()
        for row in all_rows:
            if row["formula"]:
                writer.writerow({key: str(row.get(key, "")).strip() for key in writer.fieldnames})
    print(f"exercises {len(all_rows)} -> {OUTPUT}", flush=True)
    print(f"formula review {sum(1 for row in all_rows if row['formula'])} -> {FORMULA_REVIEW}", flush=True)


if __name__ == "__main__":
    main()
