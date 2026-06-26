import json
from collections import Counter
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "android-app" / "app" / "src" / "main" / "assets"


def load_json(name):
    return json.loads((ASSETS / name).read_text(encoding="utf-8"))


def mojibake_score(value):
    score = 0
    for char in value or "":
        if char == "\ufffd":
            score += 5
        if char == "?" or ord(char) in {0x8ADB, 0xC4D6, 0xAFB8, 0xC830, 0xB6AE}:
            score += 2
    return score


def repair_mojibake(value):
    if not value:
        return ""
    candidate = value
    try:
        converted = value.encode("cp949").decode("utf-8")
        if mojibake_score(converted) < mojibake_score(candidate):
            candidate = converted
    except UnicodeError:
        pass
    return candidate.replace("\ufffd", "?").strip()


def display_value(value):
    repaired = repair_mojibake(value)
    return repaired if mojibake_score(repaired) <= 0 else "검수 필요"


def main():
    questions = load_json("questions.json")
    references = load_json("references.json").get("references", {})
    keywords = load_json("answer-keywords.json").get("keywords", {})
    summaries = load_json("summary-points.json").get("summaries", {})
    exercises = load_json("textbook-exercises.json").get("exercises", [])
    basic_concepts = load_json("basic-concept-questions.json").get("questions", [])

    keyword_counts = Counter(q.get("keyword", "") for q in questions)
    question_counts = Counter(q.get("question", "") for q in questions)
    category_counts = Counter(q.get("category", "") for q in questions)
    suspect_questions = sum(
        1 for q in questions
        if mojibake_score(repair_mojibake(q.get("keyword", "") + " " + q.get("question", ""))) > 0
    )
    suspect_exercises = sum(
        1 for e in exercises
        if mojibake_score(repair_mojibake(e.get("keyword", "") + " " + e.get("question", ""))) > 0
    )

    report = []
    report.append("# Android Data Audit")
    report.append("")
    report.append(f"- Questions: {len(questions)}")
    report.append(f"- Categories: {len(category_counts)}")
    report.append(f"- Keywords: {len(keyword_counts)}")
    report.append(f"- Questions with references: {len(references)}")
    report.append(f"- Questions with answer keywords: {len(keywords)}")
    report.append(f"- Questions with summaries: {len(summaries)}")
    report.append(f"- Basic concept questions: {len(basic_concepts)}")
    report.append(f"- Core basic concept questions: {sum(1 for row in basic_concepts if row.get('level') == 'core')}")
    report.append(f"- Textbook exercises: {len(exercises)}")
    report.append(f"- Textbook exercises needing review: {sum(1 for e in exercises if e.get('reviewNeeded'))}")
    report.append(f"- Questions with encoding/OCR review signals: {suspect_questions}")
    report.append(f"- Textbook exercises with encoding/OCR review signals: {suspect_exercises}")
    report.append("")
    report.append("## Top Keywords (display-repaired)")
    for keyword, count in keyword_counts.most_common(20):
        report.append(f"- {display_value(keyword)}: {count}")
    report.append("")
    report.append("## Duplicate Question Candidates")
    duplicates = [(text, count) for text, count in question_counts.items() if count > 1]
    if not duplicates:
        report.append("- None")
    else:
        for text, count in sorted(duplicates, key=lambda row: (-row[1], row[0]))[:30]:
            report.append(f"- {count}x {display_value(text[:120])}")

    output = ROOT / "android-app" / "DATA_AUDIT.md"
    output.write_text("\n".join(report) + "\n", encoding="utf-8")
    print(output)


if __name__ == "__main__":
    main()
