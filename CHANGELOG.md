# Changelog

## 25.0

- Added a dedicated basic-concept question queue.
- Classified 667 concept-oriented questions and highlighted 140 core basic-concept questions.
- Added subject filters and a core-only toggle for concept review.

## 24.0

- Added a dedicated "오늘 약점 큐" screen for due, weak, starred, low-grade, slow, and tagged questions.
- Improved recommendation ranking with self-evaluation, elapsed time, review due date, and weak-review tags.
- Centralized core keywords, study keyword candidates, and weak-review tags in `StudyPolicy`.
- Expanded search token handling with keyword aliases and technical abbreviations.

## 23.0

- Added runtime repair for legacy mojibake question data before display and search indexing.
- Rebuilt the local question database under a new DB name so upgraded installs reseed repaired text.
- Updated the data audit report to avoid publishing broken raw OCR strings.

## 22.0

- Added app icon and launcher label polish.
- Added startup loading state before the local question database finishes seeding.
- Added OCR review shortcuts, data quality summary, and last backup time in the stats screen.
- Prepared optional release signing with GitHub Secrets.
- Added GitHub Actions release notes and a stable release APK path.

## 21.0

- Added home review alerts, practice-time summary, and self-evaluation summary.
- Reworked the Android README into setup and usage documentation.

## 20.0

- Added per-question timer and elapsed practice time tracking.
- Added self-grade and failure reason tags.

## 19.0

- Added 1/3/7/14/30-day review intervals and search ranking.
- Built debug and release APKs from GitHub Actions.
