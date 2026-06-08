import json
import re
from collections import Counter
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
CACHE = ROOT.parent / "reference-ocr-cache"
QUESTIONS = ROOT / "android-app" / "app" / "src" / "main" / "assets" / "questions.json"
REFERENCES = ROOT / "android-app" / "app" / "src" / "main" / "assets" / "references.json"
OUTPUT = ROOT / "android-app" / "app" / "src" / "main" / "assets" / "answer-keywords.json"

BOOK_DIRS = {
    "최신 송배전공학": "song",
    "전력계통공학": "grid",
    "최신 발전공학": "generation",
}

IMPORTANT_TERMS = [
    "정의", "원리", "목적", "필요성", "특징", "장점", "단점", "문제점", "대책", "비교",
    "구성", "구조", "동작", "조건", "기준", "절차", "계산", "식", "영향", "보호", "협조",
    "전압", "전류", "전력", "주파수", "무효전력", "유효전력", "역률", "고장", "단락", "지락",
    "과전류", "계전기", "차단기", "피뢰기", "접지", "절연", "전압강하", "전압변동", "안정도",
    "조류", "경제급전", "부하", "발전기", "변압기", "송전선로", "배전선로", "케이블",
    "수력", "수차", "낙차", "유량", "화력", "보일러", "터빈", "원자력", "원자로",
    "태양광", "풍력", "연료전지", "ESS", "분산형전원", "계통연계", "단독운전", "FRT",
]

STOP = {
    "그리고", "그러나", "따라서", "대하여", "관하여", "설명", "제시", "다음", "아래", "각각",
    "경우", "문제", "그림", "표", "페이지", "예제", "정답", "해설", "전력", "공학", "기술",
    "가지는", "하는", "있는", "한다", "있다", "대한", "위한", "같은", "이를", "또는",
    "전기", "에서", "기를", "기와", "방식", "방법", "개요", "순서", "사항", "고려사항",
    "설명하시오", "각각설명하시오", "대하여각각설명하시오", "사용하는", "적용하는",
}


def normalize(value):
    return re.sub(r"[\s\-_/·.,;:()\[\]{}<>\"']", "", str(value)).lower()


def clean_term(term):
    term = re.sub(r"^[0-9.\-·\s]+", "", term)
    term = re.sub(r"[^가-힣A-Za-z0-9%/().\- ]", "", term)
    term = re.sub(r"[).]+$", "", term)
    return re.sub(r"\s+", " ", term).strip()


def split_compact(value):
    text = str(value)
    words = [
        "과전류", "보호", "계전기", "변압기", "차단기", "송전", "배전", "발전", "계통", "전압", "전류",
        "전력", "주파수", "무효전력", "유효전력", "고장", "단락", "지락", "접지", "피뢰", "절연",
        "안정도", "조류", "보일러", "터빈", "수차", "원자로", "분산형전원", "계통연계",
    ]
    for word in words:
        text = text.replace(word, f" {word} ")
    return text


def tokens(text):
    text = split_compact(text)
    found = []
    for term in IMPORTANT_TERMS:
        if normalize(term) in normalize(text):
            found.append(term)
    for raw in re.findall(r"[가-힣A-Za-z0-9%()./-]{2,20}", text):
        term = clean_term(raw)
        if not term or term in STOP:
            continue
        if any(bad in term for bad in ["설명하시오", "하시오", "대하여", "관하여", "아래순서로"]):
            continue
        if re.fullmatch(r"[가-힣]{2,3}", term) and term.endswith(("와", "과", "을", "를", "에", "의", "로")):
            continue
        if re.search(r"[가-힣A-Za-z]", term):
            found.append(term)
    return found


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


def build_for_question(question, refs):
    question_text = f"{question.get('keyword', '')} {question.get('question', '')}"
    q_norm = normalize(question_text)
    counter = Counter()
    source_terms = Counter()

    for term in tokens(question_text):
        counter[term] += 8

    for ref in refs:
        text = page_text(ref.get("book", ""), int(ref.get("pdfPageStart", 1)), int(ref.get("pdfPageEnd", 1)))
        for term in tokens(text):
            nterm = normalize(term)
            if len(nterm) < 2:
                continue
            if nterm in q_norm:
                counter[term] += 12
            elif any(normalize(core) in nterm or nterm in normalize(core) for core in tokens(question_text)):
                counter[term] += 6
            elif term in IMPORTANT_TERMS:
                counter[term] += 3
            source_terms[term] += 1

    keyword = question.get("keyword", "")
    if keyword:
        counter[keyword] += 30

    ranked = []
    seen_norm = set()
    for term, score in counter.most_common(40):
        term = clean_term(term)
        nterm = normalize(term)
        if len(nterm) < 2 or term in STOP:
            continue
        if any(bad in term for bad in ["설명하시오", "하시오", "대하여", "관하여", "아래순서로"]):
            continue
        if re.search(r"\d", term) and len(term) > 8 and not re.search(r"[A-Z]", term):
            continue
        if len(term) > 8 and term.endswith(("사", "항", "및")):
            continue
        if nterm in seen_norm:
            continue
        if len(term) > 14 and not re.search(r"[A-Z0-9]", term):
            continue
        seen_norm.add(nterm)
        ranked.append(term)
        if len(ranked) >= 10:
            break

    action_terms = []
    q = question.get("question", "")
    if any(word in q for word in ["장점", "단점", "문제점", "대책"]):
        action_terms.extend(["장점/단점", "문제점", "대책"])
    if any(word in q for word in ["설명", "원리", "동작"]):
        action_terms.extend(["개념", "동작원리"])
    if any(word in q for word in ["비교", "차이"]):
        action_terms.extend(["비교표", "차이점"])
    if any(word in q for word in ["계산", "산정", "정정"]):
        action_terms.extend(["계산식", "적용조건"])
    for term in action_terms:
        if term not in ranked:
            ranked.append(term)
        if len(ranked) >= 12:
            break

    return ranked


def main():
    questions = json.loads(QUESTIONS.read_text(encoding="utf-8"))
    references = json.loads(REFERENCES.read_text(encoding="utf-8"))["references"]
    result = {}
    for question in questions:
        refs = references.get(question["id"], [])
        result[question["id"]] = build_for_question(question, refs)
    payload = {"version": 1, "source": "question text + matched textbook OCR pages", "keywords": result}
    OUTPUT.write_text(json.dumps(payload, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    nonempty = sum(1 for values in result.values() if values)
    print(f"answer keywords {nonempty}/{len(questions)} -> {OUTPUT}", flush=True)


if __name__ == "__main__":
    main()
