import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
CACHE = ROOT.parent / "reference-ocr-cache"
QUESTIONS = ROOT / "android-app" / "app" / "src" / "main" / "assets" / "questions.json"
REFERENCES = ROOT / "android-app" / "app" / "src" / "main" / "assets" / "references.json"
ANSWER_KEYWORDS = ROOT / "android-app" / "app" / "src" / "main" / "assets" / "answer-keywords.json"
OUTPUT = ROOT / "android-app" / "app" / "src" / "main" / "assets" / "summary-points.json"

BOOK_DIRS = {
    "최신 송배전공학": "song",
    "전력계통공학": "grid",
    "최신 발전공학": "generation",
}

COMMON_NOISE = {
    "그림", "표", "예제", "문제", "해설", "설명", "다음", "대하여", "관하여", "그리고",
    "그러나", "또한", "한다", "있다", "있는", "경우", "위한", "대한", "전력", "공학",
}


def normalize(value):
    return re.sub(r"[\s\-_/·.,;:()\[\]{}<>\"']", "", str(value)).lower()


def clean_line(value):
    text = re.sub(r"\s+", " ", str(value)).strip()
    text = re.sub(r"^[|ㆍ·\-\s0-9.)①-⑳]+", "", text)
    text = re.sub(r"[\x00-\x1f]", " ", text)
    return text.strip()


def page_text(book, start, end):
    book_dir = BOOK_DIRS.get(book)
    if not book_dir:
        return ""
    parts = []
    page_dir = CACHE / book_dir / "pages"
    for page in range(start, end + 1):
        path = page_dir / f"page_{page:04d}.txt"
        if path.exists():
            parts.append(path.read_text(encoding="utf-8", errors="replace"))
    return "\n".join(parts)


def unique_terms(values, limit=8):
    rows = []
    seen = set()
    for value in values:
        term = clean_line(value)
        term = re.sub(r"[).]+$", "", term)
        term = re.sub(r"(이|가|은|는|을|를|의|에)$", "", term)
        nterm = normalize(term)
        if len(nterm) < 2 or term in COMMON_NOISE:
            continue
        if re.fullmatch(r"[a-z]{1,3}", term):
            continue
        if any(bad in term for bad in ["기와", "하시오", "대하여", "관하여", "아래", "그림"]):
            continue
        if any(bad in term for bad in ["하시오", "대하여", "관하여", "아래", "그림"]):
            continue
        if len(term) > 16 and not re.search(r"[A-Z0-9]", term):
            continue
        if nterm in seen:
            continue
        seen.add(nterm)
        rows.append(term)
        if len(rows) >= limit:
            break
    return rows


def strategy_points(question):
    q = question.get("question", "")
    points = []
    if any(word in q for word in ["장점", "단점", "문제점", "대책"]):
        points.append("답안 구성: 개념 → 문제점/영향 → 대책 순서로 정리")
    if any(word in q for word in ["비교", "차이"]):
        points.append("답안 구성: 비교 기준을 먼저 세우고 항목별 차이점 제시")
    if any(word in q for word in ["계산", "산정", "정정"]):
        points.append("암기 포인트: 적용 조건, 기준값, 계산식의 의미를 함께 정리")
    if any(word in q for word in ["설명", "원리", "동작"]):
        points.append("답안 구성: 정의 → 동작 원리 → 적용상 유의점 순서로 작성")
    return points


def concept_points(question, keywords, refs):
    q = question.get("question", "")
    keyword = question.get("keyword", "")
    ref_terms = []
    books = []
    for ref in refs:
        books.append(f"{ref.get('book', '교재')} p.{ref.get('pdfPageStart')}~{ref.get('pdfPageEnd')}")
        ref_terms.extend(ref.get("terms", []))
    terms = unique_terms([keyword] + keywords + ref_terms, 10)
    points = []
    if terms:
        points.append("핵심 개념: " + " · ".join(terms[:5]))
    if len(terms) > 5:
        points.append("연결 키워드: " + " · ".join(terms[5:10]))
    if books:
        points.append("교재 확인: " + " / ".join(books[:2]))
    if any(word in q for word in ["구조", "형태", "구성"]):
        points.append("암기 포인트: 구성 요소, 기능, 적용 조건을 묶어서 정리")
    if any(word in q for word in ["특징", "장점", "단점"]):
        points.append("암기 포인트: 특징은 원인·효과·한계로 나누어 정리")
    if any(word in q for word in ["대책", "방지", "보호"]):
        points.append("암기 포인트: 원인 → 영향 → 보호/대책 순서로 정리")
    return points


def build_summary(question, references, answer_keywords):
    refs = references.get(question["id"], [])
    keywords = answer_keywords.get(question["id"], [])
    points = []
    seen = set()

    for point in concept_points(question, keywords, refs) + strategy_points(question):
        key = normalize(point)
        if key not in seen:
            points.append(point)
            seen.add(key)
        if len(points) >= 5:
            break

    if not points:
        for term in keywords[:5]:
            points.append(f"암기 키워드: {term}")

    return points[:5]


def main():
    questions = json.loads(QUESTIONS.read_text(encoding="utf-8"))
    references = json.loads(REFERENCES.read_text(encoding="utf-8"))["references"]
    answer_keywords = json.loads(ANSWER_KEYWORDS.read_text(encoding="utf-8"))["keywords"]
    summaries = {}
    for question in questions:
        summaries[question["id"]] = build_summary(question, references, answer_keywords)
    payload = {
        "version": 1,
        "source": "matched textbook OCR pages + answer keywords",
        "summaries": summaries,
    }
    OUTPUT.write_text(json.dumps(payload, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    nonempty = sum(1 for values in summaries.values() if values)
    print(f"summary points {nonempty}/{len(questions)} -> {OUTPUT}", flush=True)


if __name__ == "__main__":
    main()
