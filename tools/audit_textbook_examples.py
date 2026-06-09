import csv
import json
import re
from pathlib import Path

from build_textbook_exercises import BOOKS, CACHE, ROOT, chapter_from_text, clean, grid_number


OUTPUT = ROOT / "textbook-example-review.csv"
EXERCISES = ROOT / "android-app" / "app" / "src" / "main" / "assets" / "textbook-exercises.json"


WORD_MARKER = re.compile(r"(?:^|[(@©®/]\s*)(?:예제|에제|의제|여제)\s*([0-9]{1,3}(?:[.\-][0-9]{1,2})?)(?![0-9.\-])")
NOW_MARKER = re.compile(r"(?:^|[(@©®/]\s*)이제\s*([0-9]{1,2}[.\-][0-9]{1,2})")
GRID_ALIAS_MARKER = re.compile(
    r"^[^가-힣A-Za-z0-9]*[@©®]\s*(?:A|WA|wa|Wi|wi|WI|Wl|wl|wil|Fi|FH|PH|Pi|oI|OF|MI|Mi|21|4)\s*([0-9]{1,3}(?:[-.][0-9]{1,2})?)(?![0-9.\-])"
)


def normalized_number(value):
    return re.sub(r"[^0-9]", "", str(value))


def load_extracted():
    payload = json.loads(EXERCISES.read_text(encoding="utf-8"))
    extracted = {}
    for row in payload.get("exercises", []):
        if row.get("kind") != "example":
            continue
        key = (row.get("book"), int(row.get("page", 0)), normalized_number(row.get("number")))
        extracted.setdefault(key, []).append(row)
    return extracted


def line_preview(lines, idx):
    return clean(" ".join(lines[idx : min(len(lines), idx + 5)]))[:280]


def candidate_rows(book, extracted):
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
        raw_lines = [re.sub(r"\s+", " ", line).strip() for line in text.splitlines()]
        for idx, line in enumerate(raw_lines):
            matches = []
            word_match = WORD_MARKER.search(line) or NOW_MARKER.search(line)
            if word_match:
                matches.append(("word", word_match.group(1), line, word_match.end()))
            if book["id"] == "grid":
                alias_match = GRID_ALIAS_MARKER.search(line)
                if alias_match:
                    matches.append(("grid_alias", alias_match.group(1), line, alias_match.end()))
            for source, number, marker_line, marker_end in matches:
                if source == "word" and line[marker_end:].lstrip().startswith("에서"):
                    continue
                if book["id"] == "grid":
                    number = grid_number(number, chapter)
                key = (book["book"], page, normalized_number(number))
                hit = extracted.get(key, [])
                status = "추출됨" if hit else "누락의심"
                priority = "상" if status == "누락의심" and source == "word" else "중" if status == "누락의심" else "낮음"
                rows.append({
                    "status": status,
                    "priority": priority,
                    "book": book["book"],
                    "subject": book["subject"],
                    "page": page,
                    "numberCandidate": number,
                    "markerType": source,
                    "ocrLine": clean(marker_line),
                    "ocrPreview": line_preview(raw_lines, idx),
                    "extractedIds": ";".join(row.get("id", "") for row in hit),
                    "extractedQuestion": hit[0].get("question", "")[:220] if hit else "",
                })
        if book["id"] == "grid" and page == 34:
            key = (book["book"], page, normalized_number("1-1"))
            hit = extracted.get(key, [])
            rows.append({
                "status": "추출됨" if hit else "누락의심",
                "priority": "낮음" if hit else "상",
                "book": book["book"],
                "subject": book["subject"],
                "page": page,
                "numberCandidate": "1-1",
                "markerType": "grid_heading",
                "ocrLine": "@ 예제",
                "ocrPreview": line_preview(raw_lines, 2),
                "extractedIds": ";".join(row.get("id", "") for row in hit),
                "extractedQuestion": hit[0].get("question", "")[:220] if hit else "",
            })
    return rows


def main():
    extracted = load_extracted()
    rows = []
    for book in BOOKS:
        rows.extend(candidate_rows(book, extracted))
    rows.sort(key=lambda row: (row["status"] != "누락의심", row["book"], int(row["page"]), row["numberCandidate"]))
    with OUTPUT.open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=[
            "status",
            "priority",
            "book",
            "subject",
            "page",
            "numberCandidate",
            "markerType",
            "ocrLine",
            "ocrPreview",
            "extractedIds",
            "extractedQuestion",
        ])
        writer.writeheader()
        writer.writerows(rows)
    missing = sum(1 for row in rows if row["status"] == "누락의심")
    print(f"candidates {len(rows)}")
    print(f"missing {missing}")
    print(f"report {OUTPUT}")


if __name__ == "__main__":
    main()
