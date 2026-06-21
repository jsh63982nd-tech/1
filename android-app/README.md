# Android 앱 빌드 메모

이 폴더는 발송배전기술사 기출 회독용 Android 앱입니다. 웹앱을 감싼 WebView가 아니라 `MainActivity.java`에서 네이티브 Android UI와 SQLite 저장소를 직접 구성합니다.

## 포함 자료

- `questions.json`: 기출문제 930개
- `answer-keywords.json`: 문제별 답안 키워드
- `summary-points.json`: 문제별 요약/암기 포인트
- `references.json`: 교재 PDF 페이지 매칭
- `textbook-exercises.json`: 교재 연습문제/예제 OCR 추출본
- `ocr-quality-report.json`: OCR 품질 리포트

## GitHub Actions 빌드

저장소의 `Build Android APK` 워크플로가 Android SDK와 Gradle 8.10.2를 설치한 뒤 `gradle assembleDebug assembleRelease`를 실행합니다. 빌드 결과는 Actions artifact로 업로드되고, `apk/power-exam-review-debug.apk`와 `apk/power-exam-review-release-unsigned.apk`에도 복사됩니다.

## 로컬 빌드

현재 저장소에는 Gradle Wrapper가 없습니다. 로컬에서 바로 빌드하려면 Gradle 8.10.2와 JDK 17을 설치한 뒤 아래 명령을 실행합니다.

```powershell
cd android-app
gradle assembleDebug assembleRelease
```

Windows에서는 같은 조건에서 보조 스크립트를 사용할 수 있습니다.

```powershell
cd android-app
.\build-debug.ps1
```

로컬 재현성을 높이려면 추후 Gradle Wrapper(`gradlew`, `gradlew.bat`, `gradle/wrapper/*`)를 추가하는 것이 좋습니다.
