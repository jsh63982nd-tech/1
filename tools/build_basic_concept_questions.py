import csv
import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "android-app" / "app" / "src" / "main" / "assets"
QUESTIONS = ASSETS / "questions.json"
ANSWER_KEYWORDS = ASSETS / "answer-keywords.json"
OUTPUT_JSON = ASSETS / "basic-concept-questions.json"
OUTPUT_CSV = ROOT / "basic-concept-questions.csv"


CONCEPT_TERMS = [
    "개념", "정의", "원리", "동작원리", "개요", "특징", "구성", "구조", "목적", "역할",
    "종류", "기능", "차이", "차이점", "비교", "장점", "단점", "문제점", "대책", "영향",
    "필요성", "설명", "서술", "열거", "분류", "조건", "방식", "절차", "적용", "운영",
]

CALC_TERMS = [
    "계산", "산정", "구하여라", "구하시오", "얼마", "몇", "용량", "정정", "단락전류",
    "고장전류", "전압강하", "손실", "효율", "출력", "전류를", "전압을", "임피던스",
    "리액턴스", "MVA", "kVA", "MW", "kW", "kV", "pu", "PU", "%", "=",
]

CORE_BASIC_TOPICS = [
    "접지", "피뢰기", "보호계전", "계전기", "차단기", "변압기", "케이블", "송전", "배전",
    "발전기", "터빈", "보일러", "수력", "화력", "원자력", "풍력", "태양광", "ESS",
    "HVDC", "안정도", "무효전력", "주파수", "분산전원", "계통연계",
]


def contains_any(text, terms):
    return any(term.lower() in text.lower() for term in terms)


def count_hits(text, terms):
    lowered = text.lower()
    return sum(1 for term in terms if term.lower() in lowered)


def subject_of(question):
    text = f"{question.get('category','')} {question.get('keyword','')} {question.get('question','')}"
    if contains_any(text, ["수력", "화력", "원자력", "터빈", "보일러", "발전기", "풍력", "태양광", "연료전지"]):
        return "발전공학"
    if contains_any(text, ["계통", "안정도", "조류", "주파수", "무효전력", "경제급전", "전력시장"]):
        return "계통공학"
    if contains_any(text, ["송전", "배전", "변전", "케이블", "접지", "피뢰", "차단기", "변압기"]):
        return "송배전공학"
    return "공통"


def concept_score(question, keywords):
    text = f"{question.get('round','')} {question.get('category','')} {question.get('keyword','')} {question.get('question','')}"
    keyword_text = " ".join(keywords)
    joined = f"{text} {keyword_text}"
    direct_text = f"{question.get('keyword','')} {question.get('question','')}"

    direct_concept_hits = count_hits(direct_text, CONCEPT_TERMS)
    direct_calc_hits = count_hits(direct_text, CALC_TERMS)
    direct_explain = bool(re.search(r"(설명|서술|열거|비교|논하|기술|쓰시오|제시)", direct_text))
    if direct_concept_hits == 0 and not direct_explain:
        return -100, ["기본문제 직접 신호 없음"]

    score = 0
    reasons = []

    concept_hits = direct_concept_hits
    if concept_hits:
        score += concept_hits * 5
        reasons.append(f"개념형 표현 {concept_hits}")

    basic_topic_hits = count_hits(joined, CORE_BASIC_TOPICS)
    if basic_topic_hits:
        score += min(basic_topic_hits, 4) * 2
        reasons.append(f"핵심 주제 {basic_topic_hits}")

    if contains_any(keyword_text, ["개념", "동작원리", "특징", "구성", "목적", "비교표", "차이점"]):
        score += 3
        reasons.append("답안키워드 개념형")

    if direct_explain:
        score += 8
        reasons.append("서술형 요구")

    if re.search(r"(구성도|동작|특징|종류|역할|목적|원리)", text):
        score += 5
        reasons.append("기본개념 키워드")

    calc_hits = direct_calc_hits
    if calc_hits:
        score -= calc_hits * 4
        reasons.append(f"계산형 신호 {calc_hits}")

    digit_count = len(re.findall(r"\d", text))
    if digit_count >= 12:
        score -= 5
        reasons.append("수치 다수")

    if re.search(r"\[[^\]]{1,12}\]", text):
        score -= 3
        reasons.append("단위 포함")

    return score, reasons


def main():
    questions = json.loads(QUESTIONS.read_text(encoding="utf-8"))
    answer_keywords = json.loads(ANSWER_KEYWORDS.read_text(encoding="utf-8"))["keywords"]
    rows = []
    for question in questions:
        keywords = answer_keywords.get(question["id"], [])
        score, reasons = concept_score(question, keywords)
        if score < 20:
            continue
        rows.append({
            "id": question["id"],
            "round": question["round"],
            "subject": subject_of(question),
            "category": question.get("category", ""),
            "keyword": question.get("keyword", ""),
            "score": score,
            "level": "core" if score >= 35 else "standard",
            "reason": " · ".join(reasons[:5]),
            "question": question.get("question", ""),
        })
    rows.sort(key=lambda row: (-row["score"], row["subject"], row["round"], row["id"]))

    payload = {
        "version": 1,
        "source": "questions + answer-keywords concept scoring",
        "criteria": {
            "include": CONCEPT_TERMS,
            "downrank": CALC_TERMS,
            "minimumScore": 10,
        },
        "questions": rows,
    }
    OUTPUT_JSON.write_text(json.dumps(payload, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    with OUTPUT_CSV.open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=["id", "round", "subject", "category", "keyword", "score", "level", "reason", "question"])
        writer.writeheader()
        writer.writerows(rows)
    print(f"basic concepts {len(rows)} -> {OUTPUT_JSON}")
    print(f"review csv -> {OUTPUT_CSV}")


if __name__ == "__main__":
    main()
