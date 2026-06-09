import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
CACHE = ROOT.parent / "reference-ocr-cache"
OUTPUT = ROOT / "android-app" / "app" / "src" / "main" / "assets" / "textbook-exercises.json"

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
        if not is_exercise_page(text):
            continue
        for seq, (number, question) in enumerate(split_numbered(text), start=1):
            rows.append({
                "id": f"tx-{book['id']}-{page:04d}-{seq:02d}",
                "book": book["book"],
                "subject": book["subject"],
                "chapter": chapter or "단원 연습문제",
                "page": page,
                "number": number,
                "keyword": infer_keyword(question),
                "question": question,
            })
    return rows


def main():
    all_rows = []
    for book in BOOKS:
        rows = extract_book(book)
        print(f"{book['book']} {len(rows)}", flush=True)
        all_rows.extend(rows)
    payload = {"version": 1, "source": "textbook OCR exercise pages", "exercises": all_rows}
    OUTPUT.write_text(json.dumps(payload, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"exercises {len(all_rows)} -> {OUTPUT}", flush=True)


if __name__ == "__main__":
    main()
