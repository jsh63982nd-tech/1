import json
import re
import subprocess
from collections import Counter
from pathlib import Path

import fitz
from PIL import Image, ImageEnhance, ImageOps


ROOT = Path(__file__).resolve().parents[1]
CACHE = ROOT.parent / "reference-ocr-cache"
QUESTIONS = ROOT / "android-app" / "app" / "src" / "main" / "assets" / "questions.json"
OUTPUT = ROOT / "android-app" / "app" / "src" / "main" / "assets" / "references.json"
TESSERACT = Path(r"C:\Program Files\Tesseract-OCR\tesseract.exe")
TESSDATA = Path(r"C:\Users\Public\Documents\ESTsoft\CreatorTemp\tessdata")

BOOKS = [
    {
        "id": "song",
        "title": "최신 송배전공학",
        "subject": "송배전공학",
        "path": Path(r"C:\Users\오승엽\Documents\카카오톡 받은 파일\최신 송배전공학_260607_094041.pdf"),
        "min_page": 16,
        "max_page": 582,
        "strong_terms": ["송전", "배전", "변전", "선로", "케이블", "전선", "피뢰", "접지", "차단", "계전", "보호", "고장", "단락", "지락", "코로나", "절연", "전압강하", "분산형전원", "계통연계"],
        "terms": ["송전", "배전", "변전", "선로", "케이블", "전선", "전압", "전류", "전력", "피뢰", "접지", "차단", "계전", "보호", "고장", "단락", "지락", "코로나", "절연", "전압강하", "분산형전원", "계통연계"],
    },
    {
        "id": "grid",
        "title": "전력계통공학",
        "subject": "계통공학",
        "path": Path(r"C:\Users\오승엽\Downloads\전력계통공학.pdf"),
        "min_page": 15,
        "max_page": 620,
        "strong_terms": ["계통", "조류", "안정도", "주파수", "무효전력", "유효전력", "경제급전", "ELD", "AFC", "HVDC", "전력시장", "예비력", "수급", "수요관리"],
        "terms": ["계통", "조류", "안정도", "주파수", "무효전력", "유효전력", "전압", "전류", "송전", "발전기", "부하", "고장", "단락", "경제급전", "ELD", "AFC", "HVDC", "전력시장", "예비력"],
    },
    {
        "id": "generation",
        "title": "최신 발전공학",
        "subject": "발전공학",
        "path": Path(r"C:\Users\오승엽\Downloads\최신 발전공학.pdf"),
        "min_page": 11,
        "max_page": 608,
        "strong_terms": ["발전", "발전소", "수력", "수차", "낙차", "유량", "화력", "기력", "보일러", "터빈", "증기터빈", "원자력", "원자로", "핵연료", "태양광", "풍력", "연료전지", "ESS", "에너지저장", "IGCC", "랭킨", "열효율"],
        "terms": ["발전", "발전소", "수력", "수차", "낙차", "유량", "화력", "기력", "보일러", "터빈", "증기터빈", "원자력", "원자로", "핵연료", "태양광", "풍력", "연료전지", "ESS", "에너지저장"],
    },
]

STOP = {
    "설명", "제시", "대하여", "관하여", "다음", "아래", "각각", "비교", "정의", "종류", "특징",
    "장점", "단점", "문제점", "대책", "방법", "방식", "기준", "기술", "공학", "전력", "문제",
}

COMMON_TERMS = {"전력", "전압", "전류", "발전", "송전", "계통", "또한", "정리"}


def normalize(value):
    return re.sub(r"[\s\-_/·.,;:()\[\]{}<>\"']", "", str(value)).lower()


def split_terms(value):
    text = str(value)
    for word in ["과전류", "보호", "계전기", "변압기", "송전", "배전", "발전", "계통", "전압", "전류", "고장", "접지", "피뢰", "차단기", "무효전력", "주파수", "안정도"]:
        text = text.replace(word, f" {word} ")
    tokens = re.findall(r"[가-힣A-Za-z0-9]{2,20}", text)
    return [token for token in tokens if token not in STOP]


def render_page(doc, page_index, image_path):
    page = doc[page_index]
    pix = page.get_pixmap(matrix=fitz.Matrix(1.8, 1.8), colorspace=fitz.csGRAY, alpha=False)
    pix.save(image_path)
    image = Image.open(image_path).convert("L")
    image = ImageOps.autocontrast(image, cutoff=1)
    image = ImageEnhance.Contrast(image).enhance(1.7)
    image = ImageEnhance.Sharpness(image).enhance(1.2)
    image.save(image_path)


def ocr_image(image_path):
    result = subprocess.run(
        [
            str(TESSERACT),
            str(image_path),
            "stdout",
            "--tessdata-dir",
            str(TESSDATA),
            "-l",
            "kor+eng",
            "--psm",
            "6",
        ],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        check=False,
    )
    return result.stdout.decode("utf-8", errors="replace")


def ensure_ocr(book):
    page_dir = CACHE / book["id"] / "pages"
    image_dir = CACHE / book["id"] / "images"
    page_dir.mkdir(parents=True, exist_ok=True)
    image_dir.mkdir(parents=True, exist_ok=True)
    doc = fitz.open(book["path"])
    total = doc.page_count
    for page_index in range(total):
        text_path = page_dir / f"page_{page_index + 1:04d}.txt"
        if text_path.exists() and text_path.stat().st_size > 80:
            continue
        image_path = image_dir / f"page_{page_index + 1:04d}.png"
        render_page(doc, page_index, image_path)
        text_path.write_text(ocr_image(image_path), encoding="utf-8")
        image_path.unlink(missing_ok=True)
        if page_index == 0 or (page_index + 1) % 25 == 0:
            print(f"ocr {book['title']} {page_index + 1}/{total}", flush=True)


def read_pages(book):
    pages = []
    for path in sorted((CACHE / book["id"] / "pages").glob("page_*.txt")):
        page = int(path.stem.split("_")[1])
        text = path.read_text(encoding="utf-8", errors="replace")
        pages.append({"page": page, "text": text, "norm": normalize(text)})
    return pages


def subject_books(question):
    text = f"{question.get('category','')} {question.get('keyword','')} {question.get('question','')}"
    compact = normalize(text)
    selected = []
    if any(normalize(t) in compact for t in BOOKS[0]["strong_terms"]):
        selected.append("song")
    if any(normalize(t) in compact for t in BOOKS[1]["strong_terms"]):
        selected.append("grid")
    if any(normalize(t) in compact for t in BOOKS[2]["strong_terms"]):
        selected.append("generation")
    if not selected:
        selected.append("song")
    return selected


def score_page(page, question, book):
    if page["page"] < book["min_page"] or page["page"] > book["max_page"]:
        return 0, []
    keyword = question.get("keyword", "")
    qtext = question.get("question", "")
    terms = split_terms(f"{keyword} {qtext}")
    norm_keyword = normalize(keyword)
    norm_page = page["norm"]
    score = 0
    hits = []
    strong_hits = 0
    if norm_keyword and norm_keyword in norm_page:
        score += 80
        hits.append(keyword)
        strong_hits += 1
    for term in terms:
        nterm = normalize(term)
        if len(nterm) < 2:
            continue
        if nterm in norm_page:
            term_score = 12 + min(len(nterm), 10)
            if term in COMMON_TERMS:
                term_score = 4
            else:
                strong_hits += 1
            score += term_score
            hits.append(term)
    for term in book["terms"]:
        nterm = normalize(term)
        if nterm in norm_page and nterm in normalize(f"{keyword} {qtext}"):
            score += 6 if term in COMMON_TERMS else 18
            if term not in COMMON_TERMS:
                strong_hits += 1
            hits.append(term)
    if strong_hits == 0:
        return 0, []
    return score, hits


def best_ranges(question, pages_by_book):
    candidates = []
    for book_id in subject_books(question):
        book = next(item for item in BOOKS if item["id"] == book_id)
        scored = []
        for page in pages_by_book[book_id]:
            score, hits = score_page(page, question, book)
            if score >= 60:
                scored.append((score, page["page"], hits))
        if not scored:
            continue
        scored.sort(reverse=True)
        used = set()
        for score, page, hits in scored[:8]:
            if any(abs(page - existing) <= 2 for existing in used):
                continue
            used.add(page)
            terms = [term for term, _ in Counter(hits).most_common(5)]
            candidates.append({
                "book": book["title"],
                "subject": book["subject"],
                "pdfPageStart": max(1, page - 1),
                "pdfPageEnd": page + 1,
                "score": score,
                "confidence": "high" if score >= 120 else "medium",
                "terms": terms,
            })
            break
    candidates.sort(key=lambda row: row["score"], reverse=True)
    return candidates[:2]


def main():
    for book in BOOKS:
        if not book["path"].exists():
            raise FileNotFoundError(book["path"])
        ensure_ocr(book)
    pages_by_book = {book["id"]: read_pages(book) for book in BOOKS}
    questions = json.loads(QUESTIONS.read_text(encoding="utf-8"))
    refs = {}
    matched = 0
    for question in questions:
        ranges = best_ranges(question, pages_by_book)
        if ranges:
            refs[question["id"]] = ranges
            matched += 1
    payload = {
        "version": 1,
        "pageBasis": "PDF page",
        "books": [{"id": b["id"], "title": b["title"], "subject": b["subject"], "pages": len(pages_by_book[b["id"]])} for b in BOOKS],
        "references": refs,
    }
    OUTPUT.write_text(json.dumps(payload, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"matched {matched}/{len(questions)} -> {OUTPUT}", flush=True)


if __name__ == "__main__":
    main()
