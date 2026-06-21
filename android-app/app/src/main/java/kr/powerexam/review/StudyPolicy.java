package kr.powerexam.review;

final class StudyPolicy {
    static final int[] REVIEW_INTERVAL_DAYS = {1, 3, 7, 14, 30};

    static final String[][] KEYWORD_ALIASES = {
            {"전력용콘덴서", "콘덴서 SC capacitor"},
            {"콘덴서", "전력용콘덴서 SC capacitor"},
            {"보호계전", "계전기 보호릴레이 relay"},
            {"계전기", "보호계전 relay"},
            {"과전류", "OCR 50 51 overcurrent"},
            {"접지", "중성점접지 grounding earth"},
            {"중성점", "접지 NGR"},
            {"변압기", "transformer TR"},
            {"피뢰기", "LA surge arrester"},
            {"차단기", "CB breaker"},
            {"전압", "voltage V"},
            {"전류", "current I"},
            {"단락", "short circuit 고장"},
            {"고장", "fault 단락 지락"},
            {"HVDC", "직류송전 고압직류"},
            {"STATCOM", "무효전력 보상 FACTS"},
            {"SVC", "무효전력 보상 FACTS"},
            {"ESS", "에너지저장장치 storage"},
            {"분산형전원", "DER DG 계통연계"},
            {"태양광", "PV 인버터"},
            {"풍력", "wind"},
            {"원자력", "nuclear"},
            {"터빈", "turbine"},
            {"보일러", "boiler"}
    };

    private StudyPolicy() {}
}
