import json
import re
import subprocess
from pathlib import Path

import fitz
from PIL import Image, ImageEnhance, ImageFilter, ImageOps


ROOT = Path(__file__).resolve().parents[1]
CACHE = ROOT.parent / "reference-ocr-cache"
REPORT = ROOT / "android-app" / "app" / "src" / "main" / "assets" / "ocr-quality-report.json"
TESSERACT = Path(r"C:\Program Files\Tesseract-OCR\tesseract.exe")
TESSDATA = Path(r"C:\Users\Public\Documents\ESTsoft\CreatorTemp\tessdata")

BOOKS = [
    {
        "id": "song",
        "title": "최신 송배전공학",
        "path": Path(r"C:\Users\오승엽\Documents\카카오톡 받은 파일\최신 송배전공학_260607_094041.pdf"),
        "min_page": 16,
        "max_page": 582,
    },
    {
        "id": "grid",
        "title": "전력계통공학",
        "path": Path(r"C:\Users\오승엽\Downloads\전력계통공학.pdf"),
        "min_page": 15,
        "max_page": 620,
    },
    {
        "id": "generation",
        "title": "최신 발전공학",
        "path": Path(r"C:\Users\오승엽\Downloads\최신 발전공학.pdf"),
        "min_page": 11,
        "max_page": 608,
    },
]


def quality(text):
    chars = [ch for ch in text if not ch.isspace()]
    total = len(chars)
    if total == 0:
        return {"score": 0, "chars": 0, "hangulRatio": 0, "noiseRatio": 1, "lineCount": 0}
    hangul = sum(1 for ch in chars if "가" <= ch <= "힣")
    alpha = sum(1 for ch in chars if ch.isalpha())
    digit = sum(1 for ch in chars if ch.isdigit())
    useful = hangul + alpha + digit
    noise = max(0, total - useful)
    lines = [line.strip() for line in text.splitlines() if len(line.strip()) >= 6]
    hangul_ratio = hangul / total
    noise_ratio = noise / total
    length_score = min(35, total / 45)
    hangul_score = min(35, hangul_ratio * 90)
    noise_score = max(0, 20 - noise_ratio * 60)
    line_score = min(10, len(lines) / 3)
    score = round(length_score + hangul_score + noise_score + line_score, 1)
    return {
        "score": score,
        "chars": total,
        "hangulRatio": round(hangul_ratio, 3),
        "noiseRatio": round(noise_ratio, 3),
        "lineCount": len(lines),
    }


def is_bad(metrics, page, book):
    if page < book["min_page"] or page > book["max_page"]:
        return False
    return metrics["score"] < 52 or metrics["chars"] < 260 or metrics["hangulRatio"] < 0.22 or metrics["noiseRatio"] > 0.28


def render(doc, page_index, image_path, scale, contrast, sharpen, threshold=False):
    pix = doc[page_index].get_pixmap(matrix=fitz.Matrix(scale, scale), colorspace=fitz.csGRAY, alpha=False)
    pix.save(image_path)
    image = Image.open(image_path).convert("L")
    image = ImageOps.autocontrast(image, cutoff=1)
    image = ImageEnhance.Contrast(image).enhance(contrast)
    image = ImageEnhance.Sharpness(image).enhance(sharpen)
    if threshold:
        image = image.filter(ImageFilter.SHARPEN)
        image = image.point(lambda p: 255 if p > 170 else 0)
    image.save(image_path)


def ocr(image_path, psm):
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
            str(psm),
        ],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        check=False,
    )
    return result.stdout.decode("utf-8", errors="replace")


def improve_page(book, page):
    text_path = CACHE / book["id"] / "pages" / f"page_{page:04d}.txt"
    old = text_path.read_text(encoding="utf-8", errors="replace") if text_path.exists() else ""
    old_metrics = quality(old)
    doc = fitz.open(book["path"])
    tmp_dir = CACHE / book["id"] / "audit-images"
    tmp_dir.mkdir(parents=True, exist_ok=True)
    attempts = [
        (2.2, 1.9, 1.3, False, 6),
        (2.6, 2.1, 1.5, False, 6),
        (2.2, 2.0, 1.4, True, 6),
        (2.4, 1.9, 1.3, False, 4),
    ]
    best_text = old
    best_metrics = old_metrics
    for idx, args in enumerate(attempts):
        image_path = tmp_dir / f"page_{page:04d}_{idx}.png"
        render(doc, page - 1, image_path, *args[:-1])
        new_text = ocr(image_path, args[-1])
        image_path.unlink(missing_ok=True)
        new_metrics = quality(new_text)
        if new_metrics["score"] > best_metrics["score"] + 3 and new_metrics["chars"] >= max(80, old_metrics["chars"] * 0.75):
            best_text = new_text
            best_metrics = new_metrics
    if best_text != old:
        text_path.write_text(best_text, encoding="utf-8")
        return True, old_metrics, best_metrics
    return False, old_metrics, best_metrics


def audit():
    pages = []
    bad = []
    for book in BOOKS:
        page_dir = CACHE / book["id"] / "pages"
        for path in sorted(page_dir.glob("page_*.txt")):
            page = int(path.stem.split("_")[1])
            text = path.read_text(encoding="utf-8", errors="replace")
            metrics = quality(text)
            row = {"book": book["title"], "bookId": book["id"], "page": page, **metrics}
            pages.append(row)
            if is_bad(metrics, page, book):
                bad.append(row)
    return pages, bad


def main():
    pages, bad_before = audit()
    improved = []
    # Keep runtime bounded; the worst pages are the highest leverage.
    for row in sorted(bad_before, key=lambda item: item["score"])[:160]:
        book = next(item for item in BOOKS if item["id"] == row["bookId"])
        changed, before, after = improve_page(book, row["page"])
        if changed:
            improved.append({"book": row["book"], "page": row["page"], "before": before, "after": after})
            print(f"improved {row['book']} p.{row['page']} {before['score']} -> {after['score']}", flush=True)
    pages_after, bad_after = audit()
    payload = {
        "version": 1,
        "totalPages": len(pages_after),
        "badBefore": len(bad_before),
        "badAfter": len(bad_after),
        "improved": improved,
        "badPages": sorted(bad_after, key=lambda item: item["score"])[:120],
    }
    REPORT.write_text(json.dumps(payload, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"bad {len(bad_before)} -> {len(bad_after)}, improved {len(improved)}", flush=True)


if __name__ == "__main__":
    main()
