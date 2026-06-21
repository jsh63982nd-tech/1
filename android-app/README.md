# 발송배전기술사 기출 회독 Android 앱

`android-app`은 발송배전기술사 기출 회독용 네이티브 Android 앱입니다. 웹앱을 감싼 WebView가 아니라 `MainActivity.java`에서 Android UI와 SQLite 저장소를 직접 구성합니다.

## 주요 기능

- 기출문제 930개 회독
- 문제 검색, 상태 필터, 별표, 메모
- 1/3/7/14/30일 복습 주기
- 오늘 추천 문제
- 문제별 10분/25분 타이머
- 문제별 소요 시간 저장
- 자가평가 상/중/하
- 실패 이유 태그: 목차 부족, 키워드 누락, 계산 실수, 시간 초과
- 빈출 키워드와 과목 추정
- 교재 페이지, 요약 포인트, 답안 키워드 표시
- 교재 연습문제/예제 OCR 자료
- 회독 기록 백업/복원

## APK 설치

최신 APK는 저장소의 `apk` 폴더에서 받을 수 있습니다.

- `apk/power-exam-review-debug.apk`: 일반 테스트 설치용
- `apk/power-exam-review-release-unsigned.apk`: unsigned release 빌드

Android에서 직접 설치하려면 APK를 내려받은 뒤 “알 수 없는 앱 설치” 권한을 허용해야 할 수 있습니다.

## 학습 흐름

1. 홈에서 `오늘 볼 것`을 확인합니다.
2. `미회독 시작`, `취약 문제 보기`, `별표 문제 보기` 중 하나로 들어갑니다.
3. 문제 상세에서 답안 키워드와 답안 구성을 확인합니다.
4. `10분 시작` 또는 `25분 시작`으로 문제별 타이머를 켭니다.
5. 답안을 작성한 뒤 `정지 저장` 또는 `회독 완료`를 누릅니다.
6. 자가평가 `상/중/하`와 실패 이유 태그를 남깁니다.
7. `회독 완료` 시 다음 복습일이 자동으로 잡힙니다.

## 복습 주기

회독 완료 횟수에 따라 다음 복습일이 자동 지정됩니다.

- 1회독 후 1일
- 2회독 후 3일
- 3회독 후 7일
- 4회독 후 14일
- 5회독 이상 30일

자가평가에서 `하`를 선택하면 해당 문제는 취약 문제로 전환됩니다.

## 백업

`통계 > 회독 기록 백업 내보내기`로 기록을 JSON 파일로 저장할 수 있습니다.

백업에는 상태, 별표, 메모, 복습 횟수, 다음 복습일, 문제별 소요 시간, 자가평가, 실패 이유 태그가 포함됩니다.

## 포함 자료

- `questions.json`: 기출문제 930개
- `answer-keywords.json`: 문제별 답안 키워드
- `summary-points.json`: 문제별 요약/암기 포인트
- `references.json`: 교재 PDF 페이지 매칭
- `textbook-exercises.json`: 교재 연습문제/예제 OCR 추출본
- `ocr-quality-report.json`: OCR 품질 리포트

## GitHub Actions 빌드

`Build Android APK` 워크플로는 Android SDK와 Gradle 8.10.2를 설치한 뒤 다음 명령을 실행합니다.

```powershell
gradle assembleDebug assembleRelease
```

빌드 결과는 Actions artifact로 업로드되고 아래 파일로도 복사됩니다.

- `apk/power-exam-review-debug.apk`
- `apk/power-exam-review-release-unsigned.apk`

## 로컬 빌드

현재 저장소에는 Gradle Wrapper가 없습니다. 로컬 빌드에는 JDK 17과 Gradle 8.10.2가 필요합니다.

```powershell
cd android-app
gradle assembleDebug assembleRelease
```

Windows에서는 보조 스크립트를 사용할 수 있습니다.

```powershell
cd android-app
.\build-debug.ps1
```

로컬 재현성을 높이려면 추후 Gradle Wrapper(`gradlew`, `gradlew.bat`, `gradle/wrapper/*`)를 추가하는 것이 좋습니다.
