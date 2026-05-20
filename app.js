const STORAGE_KEY = "power-exam-review-v1";
const DATA_VERSION = "pdf-104-137-keywords-v7-spacing";

const seedQuestions = [
  {
    id: crypto.randomUUID(),
    round: "예시 1교시",
    category: "송전",
    question: "가공송전선로에서 코로나 현상의 발생 원인, 영향 및 저감 대책을 설명하시오.",
    status: "unseen",
    starred: false,
    memo: "",
    reviews: []
  },
  {
    id: crypto.randomUUID(),
    round: "예시 2교시",
    category: "배전",
    question: "배전계통의 전압강하 원인과 전압 조정 방법을 비교하여 설명하시오.",
    status: "unseen",
    starred: false,
    memo: "",
    reviews: []
  },
  {
    id: crypto.randomUUID(),
    round: "예시 3교시",
    category: "보호계전",
    question: "거리계전기의 동작 원리와 송전선 보호 적용 시 유의사항을 설명하시오.",
    status: "weak",
    starred: true,
    memo: "",
    reviews: []
  },
  {
    id: crypto.randomUUID(),
    round: "예시 4교시",
    category: "변전",
    question: "변전소 접지설계의 목적, 접지저항 산정 및 안전전압 검토 방법을 설명하시오.",
    status: "unseen",
    starred: false,
    memo: "",
    reviews: []
  }
];

const topicGroups = [
  { name: "변압기", keywords: ["변압기", "단권변압기", "3권선", "권수비", "OLTC", "냉각방식", "손실", "효율", "병렬운전"] },
  { name: "배전계통", keywords: ["배전", "22.9kV", "배전선로", "배전자동화", "대용량배전", "배전손실", "SVR", "리클로저"] },
  { name: "송전선로", keywords: ["송전선로", "가공송전", "지중송전", "해저케이블", "송전용량", "코로나", "철탑", "애자"] },
  { name: "보호계전", keywords: ["보호계전", "계전기", "거리계전", "차동계전", "재폐로", "CT", "변류기", "차단기", "COS"] },
  { name: "접지", keywords: ["접지", "중성점", "지락", "유효접지", "TN", "TT", "접지망", "접지저항"] },
  { name: "발전기", keywords: ["발전기", "동기발전기", "여자", "전기자", "Motoring", "PSS", "동기조상기"] },
  { name: "화력/복합발전", keywords: ["화력", "기력", "가스터빈", "증기터빈", "복합발전", "IGCC", "랭킨", "열효율"] },
  { name: "수력/양수", keywords: ["수차", "양수", "낙차", "캐비테이션", "비속도", "무구속속도"] },
  { name: "원자력/SMR", keywords: ["원자력", "SMR", "원자로", "감속재", "냉각재", "핵융합", "핵분열"] },
  { name: "신재생/분산전원", keywords: ["신재생", "재생에너지", "태양광", "풍력", "해상풍력", "분산형전원", "분산전원", "VPP", "마이크로그리드"] },
  { name: "전력계통 안정도", keywords: ["안정도", "과도안정도", "전압안정도", "저주파진동", "SSR", "단락용량", "고장전류"] },
  { name: "전력조류/계산", keywords: ["조류계산", "전력조류", "DCPowerflow", "모선", "상태추정", "경제급전", "P-V", "Q-V"] },
  { name: "전압/무효전력", keywords: ["전압", "무효전력", "전압강하", "전압변동", "역률", "콘덴서", "STATCOM", "SVC"] },
  { name: "고조파/전력품질", keywords: ["고조파", "전력품질", "THD", "TDD", "전압불평형", "플리커"] },
  { name: "HVDC/MVDC", keywords: ["HVDC", "MVDC", "직류송전", "직류배전", "전류형", "전압형"] },
  { name: "케이블", keywords: ["케이블", "전력케이블", "해저케이블", "지중선로", "허용전류", "프리스네이크"] },
  { name: "시장/운영/신뢰도", keywords: ["전력시장", "계통운영", "공급신뢰도", "SAIFI", "SAIDI", "LOLP", "예비력", "주파수제어"] },
  { name: "KEC/기준", keywords: ["KEC", "한국전기설비규정", "전기설비기술기준", "신뢰도및전기품질유지기준"] },
  {
    name: "분산형전원 연계",
    keywords: [
      "분산형전원", "배전계통", "연계기술기준", "계통연계", "접속설비", "보호장치", "단독운전",
      "역송전", "전압변동", "전압상승", "플리커", "고조파", "역률", "주파수", "저전압",
      "과전압", "단락용량", "고장전류", "재폐로", "자동전압조정장치", "인버터", "태양광",
      "풍력", "ESS", "전기저장장치", "전력품질", "무효전력", "출력제어", "감시장치"
    ]
  },
  {
    name: "전력설비 용어",
    keywords: [
      "개로", "폐로", "한류저항", "한류리액터", "전류제한저항", "전류제한리액터", "쇄정",
      "이상음", "내부배선", "내부소자", "모선", "모선연락차단기", "구분차단기", "권선소손",
      "병렬커패시터", "병렬리액터", "가스절연개폐장치", "GIS", "절연유", "개폐서지",
      "뇌서지", "감발", "증발", "전력조류"
    ]
  }
];

const subjectTabs = [
  {
    name: "송배전공학",
    keywords: [
      "송전", "배전", "변전", "전선로", "가공송전", "지중송전", "가공전선", "지중케이블", "해저케이블",
      "전력케이블", "케이블", "애자", "철탑", "코로나", "섬락", "절연협조", "피뢰기", "차단기", "단로기",
      "개폐기", "변압기", "접지", "계전", "보호", "CT", "PT", "COS", "리클로저", "SVR", "배전선",
      "배전계통", "수전", "전력용콘덴서", "리액터", "모선", "GIS", "분산형전원", "계통연계",
      "연계기술기준", "접속설비", "단독운전", "역송전", "22.9", "154kV", "345kV", "765kV"
    ]
  },
  {
    name: "발전공학",
    keywords: [
      "발전기", "동기발전기", "화력", "수력", "원자력", "신재생", "태양광", "풍력", "해상풍력",
      "수차", "양수", "터빈", "가스터빈", "증기터빈", "복합발전", "열병합", "IGCC", "SMR", "연료전지",
      "보일러", "랭킨", "열효율", "캐비테이션", "비속도", "여자", "전기자", "PSS", "댐"
    ],
    exclude: ["비상발전기", "예비전원", "수전설비"]
  },
  {
    name: "계통공학",
    keywords: [
      "전력계통", "조류", "전력조류", "상태추정", "경제급전", "안정도", "과도안정도", "전압안정도",
      "주파수", "주파수제어", "고장전류", "단락", "대칭좌표", "무효전력", "전압무효전력", "전압강하",
      "전압변동", "전력품질", "고조파", "전압불평형", "플리커", "HVDC", "MVDC", "FACTS", "STATCOM",
      "SVC", "ESS", "분산전원", "분산형전원", "계통연계", "인버터", "출력제어", "마이크로그리드", "VPP", "전력시장", "예비력", "신뢰도", "EMS",
      "SCADA", "전력원선도", "수요", "RE100", "PMU", "보조서비스", "덕커브"
    ]
  }
];

const bookOutlines = {
  "송배전공학": {
    source: "최신 송배전공학 / 이존우 송전공학 목차",
    chapters: [
      "송배전 계통의 구성", "가공 송전 선로", "지중 송전 선로", "선로 정수와 코로나",
      "송전 특성", "중성점 접지 방식과 유도 장해", "고장 계산", "안정도",
      "이상 전압", "보호 계전 방식", "변전소", "배전 계통의 구성",
      "배전 선로의 전기적 특성", "배전 선로의 관리와 보호", "기초이론", "선로정수",
      "%임피던스", "3상단락고장", "송전계통의 특성", "불평형고장계산", "보호계전시스템",
      "변전설비", "전력케이블", "배전계통", "접지시스템"
    ],
    keywords: [
      "송전방식", "직류송전", "교류송전", "송전전압", "표준전압", "가공전선로", "전선종류", "허용전류",
      "이도", "애자", "지지물", "철탑", "지중송전", "전력케이블", "XLPE", "OF케이블", "전선로정수",
      "저항", "인덕턴스", "정전용량", "송전계통임피던스", "코로나", "송전용량", "페란티", "동기조상기",
      "전력용콘덴서", "중성점접지", "소호리액터", "유도장해", "고장계산", "대칭좌표", "안정도",
      "이상전압", "피뢰기", "절연협조", "보호계전", "변전소", "고압배전", "저압배전", "전압조정",
      "역률개선", "배전손실", "배전보호", "감전방지", "쌍곡선함수", "복소전력", "전계",
      "전속밀도", "전위", "가우스정리", "암페어법칙", "패러데이법칙", "플레밍법칙",
      "맥스웰방정식", "회로정수", "표피효과", "외뢰", "근거리선로고장", "SLF", "선로외뢰방지",
      "전선진동", "단위법", "퍼유닛", "단락용량", "차단기", "단락전류", "송수전전력",
      "전력원선도", "동기기", "여자기", "AVR", "유도발전기", "병렬콘덴서", "분로리액터",
      "고다상송전", "HVDC", "중성점잔류전압", "통신선유도전압", "GIS변전소", "SCADA",
      "ABC케이블", "시스유기전압", "케이블접속", "지중선로사고탐색", "방식", "순간전압강하",
      "UPS", "무정전공법", "배전자동화", "배전선로뇌보호", "IEC접지", "선로정수",
      "수전단", "송전단", "대지정전용량", "충전전류", "충전용량", "정태안정도", "과도안정도",
      "무한대모선", "대칭분", "영상분", "정상분", "역상분", "방향계전", "거리계전", "차동계전",
      "배전네트워크", "옥내배선", "저압뱅킹", "배전전압승압"
    ]
  },
  "발전공학": {
    source: "최신 발전공학 / 이존우 발전공학 목차",
    chapters: [
      "에너지 자원과 전력", "수력발전의 개요", "수력학", "유량과 낙차", "수력설비", "수차",
      "기력 발전의 개요", "열역학", "보일러 및 연소장치", "증기터빈", "기타의 화력발전",
      "원자력 발전의 개요", "원자로 이론", "발전용 원자로", "핵연료 및 핵연료 주기",
      "원자력 발전의 안전성", "새로운 발전", "에너지 저장기술", "수력설비 및 수차",
      "열력학 및 열사이클", "증기터빈 및 발전기", "기타의 화력발전", "신발전", "에너지저장장치"
    ],
    keywords: [
      "에너지자원", "발전방식", "부하특성", "발전소운용", "수력발전", "낙차", "유량", "수력설비",
      "댐", "수로", "수조", "수압관로", "수차", "흡출관", "조속기", "양수발전", "기력발전",
      "열사이클", "랭킨", "열역학", "엔트로피", "보일러", "연소", "화로", "과열기", "절탄기",
      "공기예열기", "통풍장치", "집진장치", "급수처리", "증기터빈", "열병합발전", "복수설비",
      "디젤기관발전", "가스터빈", "복합사이클", "원자력", "원자로", "핵분열", "감속재",
      "냉각재", "핵연료", "안전성", "MHD", "석탄가스화", "태양발전", "풍력발전", "해양에너지",
      "지열발전", "연료전지", "핵융합", "에너지저장", "양수저장", "압축공기저장", "전기에너지저장",
      "초전도저장", "전력수요곡선", "정수력학", "동수력학", "수력자원", "연료", "분산형전원",
      "자가발전기", "비등수형원자로", "가압중수형원자로", "고속증식로", "다중방호",
      "긴급정지장치", "SCRAM", "ECCS", "방사성폐기물", "열전현상", "열전기발전", "열전자발전",
      "CAES", "플라이휠저장", "전지에너지저장", "SMES"
    ]
  },
  "계통공학": {
    source: "이존우 계통공학 목차",
    chapters: [
      "전력조류계산", "주파수-유효전력제어", "전력계통의 경제운용", "전압-무효전력제어",
      "전력계통의 계획과 운용"
    ],
    keywords: [
      "전력조류계산", "조류계산", "이상기", "PhaseShifter", "계통운용자동화", "전력계통제어",
      "전력-주파수특성", "조속기프리", "GovernorFree", "LFC", "AFC", "경제부하급전", "ELD",
      "경제부하배분", "수화력협조방정식", "전압무효전력제어", "VQC", "계통계획", "계통운용"
    ]
  }
};

const state = loadState();
let selectedId = state.questions[0]?.id ?? null;
let activeSubject = subjectTabs[0].name;
let activeSubjectKeyword = "all";
let activeFrequentSubject = "";
localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, dataVersion: DATA_VERSION }));

const elements = {
  navItems: document.querySelectorAll(".nav-item"),
  views: document.querySelectorAll(".view"),
  toolbar: document.querySelector("#toolbar"),
  searchInput: document.querySelector("#searchInput"),
  categoryFilter: document.querySelector("#categoryFilter"),
  statusFilter: document.querySelector("#statusFilter"),
  questionList: document.querySelector("#questionList"),
  questionCount: document.querySelector("#questionCount"),
  listTitle: document.querySelector("#listTitle"),
  emptyDetail: document.querySelector("#emptyDetail"),
  detailCard: document.querySelector("#detailCard"),
  detailRound: document.querySelector("#detailRound"),
  detailCategory: document.querySelector("#detailCategory"),
  detailQuestion: document.querySelector("#detailQuestion"),
  studyAid: document.querySelector("#studyAid"),
  starButton: document.querySelector("#starButton"),
  memoInput: document.querySelector("#memoInput"),
  markDone: document.querySelector("#markDone"),
  markWeak: document.querySelector("#markWeak"),
  resetStatus: document.querySelector("#resetStatus"),
  reviewLog: document.querySelector("#reviewLog"),
  questionForm: document.querySelector("#questionForm"),
  roundInput: document.querySelector("#roundInput"),
  categoryInput: document.querySelector("#categoryInput"),
  questionInput: document.querySelector("#questionInput"),
  registeredCount: document.querySelector("#registeredCount"),
  registeredList: document.querySelector("#registeredList"),
  importFile: document.querySelector("#importFile"),
  csvInput: document.querySelector("#csvInput"),
  importCsv: document.querySelector("#importCsv"),
  importExam121: document.querySelector("#importExam121"),
  importMessage: document.querySelector("#importMessage"),
  exportJson: document.querySelector("#exportJson"),
  resetData: document.querySelector("#resetData"),
  dailyGoal: document.querySelector("#dailyGoal"),
  goalDown: document.querySelector("#goalDown"),
  goalUp: document.querySelector("#goalUp"),
  todayProgress: document.querySelector("#todayProgress"),
  goalText: document.querySelector("#goalText"),
  statTotal: document.querySelector("#statTotal"),
  statDone: document.querySelector("#statDone"),
  statWeak: document.querySelector("#statWeak"),
  statToday: document.querySelector("#statToday"),
  categoryStats: document.querySelector("#categoryStats"),
  frequencyFilter: document.querySelector("#frequencyFilter"),
  frequencyStats: document.querySelector("#frequencyStats"),
  frequentTitle: document.querySelector("#frequentTitle"),
  frequentBack: document.querySelector("#frequentBack"),
  frequentSubjectCards: document.querySelector("#frequentSubjectCards"),
  frequentKeywordList: document.querySelector("#frequentKeywordList"),
  subjectTitle: document.querySelector("#subjectTitle"),
  subjectCount: document.querySelector("#subjectCount"),
  subjectKeywordCount: document.querySelector("#subjectKeywordCount"),
  subjectKeywordList: document.querySelector("#subjectKeywordList"),
  subjectQuestionTitle: document.querySelector("#subjectQuestionTitle"),
  subjectQuestionList: document.querySelector("#subjectQuestionList"),
  homeTodayCount: document.querySelector("#homeTodayCount"),
  homeTodayGoal: document.querySelector("#homeTodayGoal"),
  homeTodayProgress: document.querySelector("#homeTodayProgress"),
  homeTotal: document.querySelector("#homeTotal"),
  homeUnseen: document.querySelector("#homeUnseen"),
  homeWeak: document.querySelector("#homeWeak"),
  homeDoneRate: document.querySelector("#homeDoneRate"),
  nextQuestionPreview: document.querySelector("#nextQuestionPreview"),
  startUnseen: document.querySelector("#startUnseen"),
  startWeak: document.querySelector("#startWeak"),
  openFrequent: document.querySelector("#openFrequent"),
  resumeStudy: document.querySelector("#resumeStudy"),
  strategyList: document.querySelector(".strategy-list")
};

function loadState() {
  const defaultQuestions = getDefaultQuestions();
  const shouldReset = new URLSearchParams(window.location.search).has("reset");

  if (shouldReset) {
    return { questions: defaultQuestions, dailyGoal: 20, dataVersion: DATA_VERSION };
  }

  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    return { questions: defaultQuestions, dailyGoal: 20, dataVersion: DATA_VERSION };
  }

  try {
    const parsed = JSON.parse(saved);
    if (parsed.dataVersion !== DATA_VERSION) {
      return { questions: defaultQuestions, dailyGoal: 20, dataVersion: DATA_VERSION };
    }

    return {
      questions: Array.isArray(parsed.questions) ? parsed.questions : defaultQuestions,
      dailyGoal: Number(parsed.dailyGoal) || 20,
      dataVersion: DATA_VERSION
    };
  } catch {
    return { questions: defaultQuestions, dailyGoal: 20, dataVersion: DATA_VERSION };
  }
}

function saveState() {
  state.dataVersion = DATA_VERSION;
  delete state.keywordCounts;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getDefaultQuestions() {
  const source = Array.isArray(window.BUNDLED_QUESTIONS) && window.BUNDLED_QUESTIONS.length
    ? window.BUNDLED_QUESTIONS
    : seedQuestions;

  return source.map((item) => ({
    ...item,
    status: item.status || "unseen",
    starred: Boolean(item.starred),
    memo: item.memo || "",
    reviews: Array.isArray(item.reviews) ? item.reviews : []
  }));
}

async function loadPdfQuestions({ replace = false } = {}) {
  let imported = Array.isArray(window.BUNDLED_QUESTIONS) && window.BUNDLED_QUESTIONS.length
    ? getDefaultQuestions()
    : [];

  if (!imported.length) {
    const response = await fetch("./all_exam_questions.csv?v=1");
    if (!response.ok) {
      throw new Error("exam csv not found");
    }
    imported = parseImportText(await response.text());
  }

  if (!imported.length) {
    return 0;
  }

  if (replace) {
    state.questions = imported;
    selectedId = imported[0].id;
  } else {
    const existingKeys = new Set(state.questions.map((item) => `${item.round}|${item.category}|${item.question}`));
    const newItems = imported.filter((item) => !existingKeys.has(`${item.round}|${item.category}|${item.question}`));
    state.questions = [...newItems, ...state.questions];
    selectedId = newItems[0]?.id || selectedId;
  }

  saveState();
  renderAll();
  return imported.length;
}

async function autoUploadFromPdfCsv() {
  const params = new URLSearchParams(window.location.search);
  if (!params.has("reset")) {
    return;
  }

  try {
    const count = await loadPdfQuestions({ replace: true });
    if (elements.importMessage) {
      elements.importMessage.textContent = `PDF 문제 ${count}개를 등록했습니다.`;
    }
  } catch {
    if (elements.importMessage) {
      elements.importMessage.textContent = "PDF 문제 CSV를 자동 등록하지 못했습니다.";
    }
  }
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function formatDateTime(value) {
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function formatDisplayQuestion(question) {
  let text = String(question || "")
    .replace(/\s+/g, " ")
    .replace(/([,;:])(?=\S)/g, "$1 ")
    .replace(/([.!?])(?=[가-힣A-Za-z])/g, "$1 ")
    .replace(/([가-힣])(\d+[.)])/g, "$1 $2")
    .replace(/(\))(?=[가-힣A-Za-z0-9])/g, "$1 ")
    .replace(/([가-힣])([A-Z]{2,}[A-Za-z0-9/-]*)/g, "$1 $2")
    .replace(/([A-Za-z0-9])([가-힣])/g, "$1 $2");

  const spacingTerms = [
    ["또는", "또는"],
    ["그리고", "그리고"],
    ["다음", "다음"],
    ["아래", "아래"],
    ["대하여", "대하여"],
    ["설명하시오", "설명하시오"],
    ["구하시오", "구하시오"],
    ["비교하여", "비교하여"],
    ["나누어", "나누어"],
    ["각각", "각각"],
    ["제시하고", "제시하고"],
    ["이간격", "이 간격"],
    ["유지하기", "유지하기"],
    ["설치된", "설치된"],
    ["사용하는", "사용하는"],
    ["적용하는", "적용하는"],
    ["정정하는", "정정하는"],
    ["발생하는", "발생하는"],
    ["발생시", "발생 시"],
    ["경우", "경우"],
    ["다음사항", "다음 사항"],
    ["다음물음", "다음 물음"],
    ["장단점", "장단점"],
    ["유의사항", "유의사항"],
    ["고려사항", "고려사항"],
    ["보호계전기", "보호계전기"],
    ["과전류계전기", "과전류 계전기"],
    ["과전류보호계전기", "과전류 보호계전기"],
    ["비율차동계전기", "비율차동계전기"],
    ["거리계전기", "거리계전기"],
    ["보호계전방식", "보호계전방식"],
    ["한시과전류", "한시 과전류"],
    ["협조시간간격", "협조시간 간격"],
    ["시간협조항목", "시간협조 항목"],
    ["공장구내에", "공장구내에"],
    ["가공송전선로", "가공송전선로"],
    ["지중송전선로", "지중송전선로"],
    ["배전계통", "배전계통"],
    ["배전선로", "배전선로"],
    ["전력계통", "전력계통"],
    ["전력케이블", "전력케이블"],
    ["해저케이블", "해저케이블"],
    ["전력용변압기", "전력용 변압기"],
    ["단권변압기", "단권변압기"],
    ["3권선변압기", "3권선 변압기"],
    ["동기발전기", "동기발전기"],
    ["수차발전기", "수차발전기"],
    ["터빈발전기", "터빈발전기"],
    ["대용량발전기", "대용량 발전기"],
    ["예방진단시스템", "예방진단 시스템"],
    ["화력발전", "화력발전"],
    ["수력발전", "수력발전"],
    ["풍력발전", "풍력발전"],
    ["태양광발전", "태양광발전"],
    ["원자력발전", "원자력발전"],
    ["무효전력", "무효전력"],
    ["고장전류", "고장전류"],
    ["전압강하", "전압강하"],
    ["전압변동", "전압변동"],
    ["주파수제어", "주파수제어"],
    ["전력조류", "전력조류"],
    ["조류계산", "조류계산"],
    ["상태추정", "상태추정"],
    ["경제급전", "경제급전"],
    ["절연협조", "절연협조"],
    ["중성점접지", "중성점 접지"],
    ["중성선단선", "중성선 단선"],
    ["허용전류", "허용전류"],
    ["단락전류", "단락전류"],
    ["차단기", "차단기"],
    ["피뢰기", "피뢰기"],
    ["개폐서지", "개폐서지"],
    ["고조파", "고조파"],
    ["분산전원", "분산전원"],
    ["신재생에너지", "신재생에너지"]
  ];

  for (const [term, display] of spacingTerms) {
    text = text.replaceAll(term, ` ${display} `);
  }

  return text
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/([,;:!?])(?=\S)/g, "$1 ")
    .replace(/(\d)\.\s+(\d)/g, "$1.$2")
    .replace(/kV\s*Cable/gi, "kV Cable")
    .replace(/의구조/g, "의 구조")
    .replace(/와특징/g, "와 특징")
    .replace(/\s+(을|를|이|가|은|는|와|과|에|에서|의|로|으로|부터|까지|마다|별)(?=\s|$)/g, "$1")
    .replace(/(을|를|이|가|은|는|에|에서|로|으로)(적용|사용|설명|정정|구하|비교|제시|유지|나타내|분류|설치|연결|접속|공급|운전|보호|검토|계산)/g, "$1 $2")
    .replace(/,(\S)/g, ", $1")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function getFilteredQuestions() {
  const keyword = elements.searchInput.value.trim().toLowerCase();
  const category = elements.categoryFilter.value;
  const status = elements.statusFilter.value;

  return state.questions.filter((item) => {
    const searchable = `${item.round} ${item.category} ${item.keyword || ""} ${item.question}`.toLowerCase();
    const keywordMatch = !keyword || searchable.includes(keyword);
    const categoryMatch = category === "all" || item.category === category;
    const statusMatch =
      status === "all" ||
      item.status === status ||
      (status === "starred" && item.starred);

    return keywordMatch && categoryMatch && statusMatch;
  });
}

function renderCategoryFilter() {
  const current = elements.categoryFilter.value || "all";
  const categories = [...new Set(state.questions.map((item) => item.category))].sort();
  elements.categoryFilter.innerHTML = [
    `<option value="all">전체 분야</option>`,
    ...categories.map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`)
  ].join("");
  elements.categoryFilter.value = categories.includes(current) ? current : "all";
}

function renderFrequentSubjectFilter() {
  if (!elements.frequentSubjectCards) {
    return;
  }

  elements.frequentSubjectCards.innerHTML = subjectTabs
    .map((subject) => {
      const questions = getQuestionsForSubject(subject.name);
      const keywords = buildSubjectKeywordRows(questions);
      const topKeyword = keywords[0]?.keyword || "분석 대기";
      const outline = getBookOutline(subject.name);
      const chapterSummary = outline
        ? `${outline.chapters.length}개 교재 단원 반영`
        : "기출 키워드 기준";
      return `
        <button type="button" class="frequent-subject-card" data-subject="${escapeHtml(subject.name)}">
          <span>${escapeHtml(subject.name)}</span>
          <strong>${questions.length}문제</strong>
          <p>${escapeHtml(chapterSummary)}</p>
          <p>대표 빈출: ${escapeHtml(topKeyword)}</p>
        </button>
      `;
    })
    .join("");
}

function renderList() {
  const filtered = getFilteredQuestions();
  elements.questionCount.textContent = `${filtered.length}문제`;
  elements.listTitle.textContent = elements.categoryFilter.value === "all" ? "전체 기출" : elements.categoryFilter.value;

  if (!filtered.length) {
    elements.questionList.innerHTML = `<div class="empty-state"><p>조건에 맞는 문제가 없습니다.</p></div>`;
    return;
  }

  elements.questionList.innerHTML = filtered
    .map((item) => {
      const statusLabel = item.status === "done" ? "완료" : item.status === "weak" ? "취약" : "미회독";
      const frequency = getQuestionKeywordFrequency(item);
      return `
        <button class="question-item ${item.id === selectedId ? "active" : ""}" data-id="${item.id}">
          <div class="item-meta">
            <span>${escapeHtml(item.round)}</span>
            <span>${escapeHtml(item.category)}</span>
            <span class="frequency-chip ${frequency.levelKey}">${escapeHtml(frequency.label)}</span>
            <span>${item.starred ? "★" : ""}</span>
          </div>
          <strong>${escapeHtml(formatDisplayQuestion(item.question))}</strong>
          <span class="status-pill ${item.status}">${statusLabel}</span>
        </button>
      `;
    })
    .join("");
}

function renderDetail() {
  const selected = state.questions.find((item) => item.id === selectedId);
  elements.emptyDetail.classList.toggle("hidden", Boolean(selected));
  elements.detailCard.classList.toggle("hidden", !selected);

  if (!selected) {
    return;
  }

  elements.detailRound.textContent = selected.round;
  elements.detailCategory.textContent = selected.category;
  elements.detailQuestion.textContent = formatDisplayQuestion(selected.question);
  renderStudyAid(selected);
  elements.starButton.textContent = selected.starred ? "★" : "☆";
  elements.memoInput.value = selected.memo || "";
  elements.reviewLog.innerHTML = selected.reviews.length
    ? selected.reviews
        .slice()
        .reverse()
        .map((review) => `<div class="log-item">${formatDateTime(review.date)} · ${review.label}</div>`)
        .join("")
    : `<p class="muted">아직 회독 기록이 없습니다.</p>`;
}

function renderStudyAid(item) {
  if (!elements.studyAid) {
    return;
  }

  const aid = buildStudyAid(item);
  elements.studyAid.innerHTML = `
    <div class="study-aid-head">
      <p class="eyebrow">교재 기반 정리</p>
      <span>${aid.source}</span>
    </div>
    <div class="aid-block">
      <strong>관련 단원</strong>
      <div class="aid-chips">
        ${aid.chapters.map((chapter) => `<span>${escapeHtml(chapter)}</span>`).join("")}
      </div>
    </div>
    <div class="aid-block">
      <strong>추천 키워드</strong>
      <div class="aid-chips">
        ${aid.keywords.map((keyword) => `<span>${escapeHtml(keyword)}</span>`).join("")}
      </div>
    </div>
    <div class="aid-block">
      <strong>답안 틀</strong>
      <ol>${aid.outline.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol>
    </div>
  `;
}

function buildStudyAid(item) {
  const question = formatDisplayQuestion(item.question);
  const compactQuestion = normalizeForFrequency(question);
  const subject = subjectTabs
    .map((candidate) => {
      const outline = getBookOutline(candidate.name);
      const keywords = [...candidate.keywords, ...(outline?.keywords || []), ...(outline?.chapters || [])];
      const score = keywords.reduce((sum, keyword) => {
        return sum + (compactQuestion.includes(normalizeForFrequency(keyword)) ? 1 : 0);
      }, 0);
      return { candidate, outline, score };
    })
    .sort((a, b) => b.score - a.score)[0];

  const outline = subject.outline || getBookOutline("송배전공학");
  const extracted = extractKeywords(question);
  const rankedChapters = (outline?.chapters || [])
    .map((chapter) => ({
      chapter,
      score: scoreChapterMatch(chapter, extracted, compactQuestion)
    }))
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((row) => row.chapter)
    .slice(0, 3);

  const recommended = [...new Set([
    ...extracted,
    ...(outline?.keywords || []).filter((keyword) => compactQuestion.includes(normalizeForFrequency(keyword)))
  ])].slice(0, 8);

  return {
    source: outline?.source || "기출 키워드",
    chapters: rankedChapters.length ? rankedChapters : (outline?.chapters || []).slice(0, 3),
    keywords: recommended.length ? recommended : extracted.slice(0, 6),
    outline: buildAnswerOutline(question),
  };
}

function scoreChapterMatch(chapter, keywords, compactQuestion) {
  const compactChapter = normalizeForFrequency(chapter);
  const chapterParts = chapter.split(/\s+/).filter((part) => part.length >= 2);
  let score = compactQuestion.includes(compactChapter) ? 6 : 0;

  keywords.forEach((keyword) => {
    const compactKeyword = normalizeForFrequency(keyword);
    if (compactChapter.includes(compactKeyword) || compactQuestion.includes(compactKeyword)) {
      score += 2;
    }
  });

  chapterParts.forEach((part) => {
    if (compactQuestion.includes(normalizeForFrequency(part))) {
      score += 1;
    }
  });

  return score;
}

function buildAnswerOutline(question) {
  const text = normalizeForFrequency(question);
  if (text.includes("비교")) {
    return ["비교 대상 정의", "구성/동작 원리", "장단점 비교", "적용 조건", "실무상 유의사항"];
  }
  if (text.includes("계산") || text.includes("구하")) {
    return ["조건 정리", "등가회로/기준값 설정", "계산식 전개", "결과 해석", "검토사항"];
  }
  if (text.includes("대책") || text.includes("방지") || text.includes("보호")) {
    return ["현상 정의", "발생 원인", "계통/설비 영향", "보호 및 저감 대책", "설계/운영 유의사항"];
  }
  if (text.includes("종류") || text.includes("분류")) {
    return ["분류 기준", "각 방식의 원리", "특징 및 장단점", "적용 분야", "선정 시 고려사항"];
  }
  return ["정의", "원리 또는 구성", "주요 특징", "계통 영향", "적용 및 유의사항"];
}

function renderHome() {
  const total = state.questions.length;
  const done = state.questions.filter((item) => item.status === "done").length;
  const weak = state.questions.filter((item) => item.status === "weak").length;
  const unseen = state.questions.filter((item) => item.status === "unseen").length;
  const today = countTodayReviews();
  const progress = Math.min(100, Math.round((today / state.dailyGoal) * 100));
  const next = state.questions.find((item) => item.status === "unseen")
    || state.questions.find((item) => item.status === "weak")
    || state.questions[0];

  elements.homeTodayCount.textContent = today;
  elements.homeTodayGoal.textContent = `/${state.dailyGoal}문제`;
  elements.homeTodayProgress.style.width = `${progress}%`;
  elements.homeTotal.textContent = total;
  elements.homeUnseen.textContent = unseen;
  elements.homeWeak.textContent = weak;
  elements.homeDoneRate.textContent = total ? `${Math.round((done / total) * 100)}%` : "0%";

  elements.nextQuestionPreview.innerHTML = next
    ? `
      <div class="item-meta">
        <span>${escapeHtml(next.round)}</span>
        <span>${escapeHtml(next.category)}</span>
      </div>
      <strong>${escapeHtml(formatDisplayQuestion(next.question))}</strong>
    `
    : `<p class="muted">등록된 문제가 없습니다.</p>`;
}

function renderStats() {
  const total = state.questions.length;
  const done = state.questions.filter((item) => item.status === "done").length;
  const weak = state.questions.filter((item) => item.status === "weak").length;
  const today = countTodayReviews();

  elements.dailyGoal.textContent = state.dailyGoal;
  elements.statTotal.textContent = total;
  elements.statDone.textContent = done;
  elements.statWeak.textContent = weak;
  elements.statToday.textContent = today;

  const progress = Math.min(100, Math.round((today / state.dailyGoal) * 100));
  elements.todayProgress.style.width = `${progress}%`;
  elements.goalText.textContent = `${today}/${state.dailyGoal}문제 완료`;

  const categories = [...new Set(state.questions.map((item) => item.category))].sort();
  elements.categoryStats.innerHTML = categories
    .map((category) => {
      const items = state.questions.filter((item) => item.category === category);
      const countDone = items.filter((item) => item.status === "done").length;
      const percent = items.length ? Math.round((countDone / items.length) * 100) : 0;
      return `
        <div class="category-row">
          <strong>${escapeHtml(category)}</strong>
          <div class="bar"><span style="width:${percent}%"></span></div>
          <span>${percent}%</span>
        </div>
      `;
    })
    .join("");

  renderFrequencyStats();
}

function renderFrequencyStats() {
  if (!elements.frequencyStats) {
    return;
  }

  const rows = buildKeywordFrequencyRows();
  const selected = elements.frequencyFilter?.value || "all";
  const filtered = selected === "all" ? rows : rows.filter((row) => row.levelKey === selected);

  elements.frequencyStats.innerHTML = filtered.length
    ? filtered
        .map(
          (row) => `
            <button type="button" class="frequency-item" data-topic="${escapeHtml(row.keyword)}">
              <div>
                <div class="frequency-title">
                  <strong>${escapeHtml(row.keyword)}</strong>
                  <span class="frequency-badge ${row.levelKey}">${row.level}</span>
                </div>
                <p>${row.count}문제 · ${row.percent}%</p>
              </div>
              <div class="bar"><span style="width:${row.percent}%"></span></div>
            </button>
          `
        )
        .join("")
    : `<p class="muted">해당 빈도 구간의 주제가 없습니다.</p>`;
}

function renderFrequentProblems() {
  if (!elements.frequentKeywordList || !elements.frequentSubjectCards) {
    return;
  }

  if (!activeFrequentSubject) {
    elements.frequentTitle.textContent = "과목을 선택하세요";
    elements.frequentBack.classList.add("hidden");
    elements.frequentSubjectCards.classList.remove("hidden");
    elements.frequentKeywordList.classList.add("hidden");
    return;
  }

  const subject = getSubjectDefinition(activeFrequentSubject);
  const outline = getBookOutline(subject.name);
  const subjectQuestions = getQuestionsForSubject(subject.name);
  const keywordRows = buildSubjectKeywordRows(subjectQuestions);

  elements.frequentTitle.textContent = `${subject.name} 빈출문제`;
  elements.frequentBack.classList.remove("hidden");
  elements.frequentSubjectCards.classList.add("hidden");
  elements.frequentKeywordList.classList.remove("hidden");
  elements.frequentKeywordList.innerHTML = keywordRows.length
    ? `
      ${outline ? `
        <section class="book-outline">
          <div>
            <p class="eyebrow">${escapeHtml(outline.source)}</p>
            <h3>교재 단원 기준</h3>
          </div>
          <div class="book-chapters">
            ${outline.chapters.map((chapter) => `<span>${escapeHtml(chapter)}</span>`).join("")}
          </div>
        </section>
      ` : ""}
      <section class="frequent-subject">
        <div class="frequent-subject-head">
          <h3>${escapeHtml(subject.name)}</h3>
          <span class="count-badge">${subjectQuestions.length}문제</span>
        </div>
        <div class="frequent-keywords">
          ${keywordRows
            .map(
              (row, index) => `
                <button type="button" class="frequent-keyword" data-keyword="${escapeHtml(row.keyword)}" data-category="all">
                  <span class="rank">${index + 1}</span>
                  <div>
                    <strong>${escapeHtml(row.keyword)}</strong>
                    <p>${row.count}문제 · ${row.percent}%</p>
                  </div>
                  <span class="frequency-badge ${row.levelKey}">${row.level}</span>
                </button>
              `
            )
            .join("")}
        </div>
      </section>
    `
    : `<p class="muted">표시할 빈출 키워드가 없습니다.</p>`;
}

function renderSubjectView() {
  if (!elements.subjectKeywordList || !elements.subjectQuestionList) {
    return;
  }

  const subject = getSubjectDefinition(activeSubject);
  const subjectQuestions = getQuestionsForSubject(subject.name);
  const keywordRows = buildSubjectKeywordRows(subjectQuestions);
  const visibleQuestions = activeSubjectKeyword === "all"
    ? subjectQuestions
    : subjectQuestions.filter((item) => getQuestionKeyword(item) === activeSubjectKeyword);

  elements.subjectTitle.textContent = subject.name;
  elements.subjectCount.textContent = `${visibleQuestions.length}/${subjectQuestions.length}문제`;
  elements.subjectKeywordCount.textContent = `${keywordRows.length}개`;
  elements.subjectQuestionTitle.textContent = activeSubjectKeyword === "all" ? "전체 문제" : activeSubjectKeyword;

  elements.subjectKeywordList.innerHTML = [
    `<button type="button" class="frequent-keyword ${activeSubjectKeyword === "all" ? "active" : ""}" data-keyword="all">
      <span class="rank">전체</span>
      <div>
        <strong>전체 문제</strong>
        <p>${subjectQuestions.length}문제</p>
      </div>
      <span class="frequency-badge high">보기</span>
    </button>`,
    ...keywordRows.map(
      (row, index) => `
        <button type="button" class="frequent-keyword ${activeSubjectKeyword === row.keyword ? "active" : ""}" data-keyword="${escapeHtml(row.keyword)}">
          <span class="rank">${index + 1}</span>
          <div>
            <strong>${escapeHtml(row.keyword)}</strong>
            <p>${row.count}문제 · ${row.percent}%</p>
          </div>
          <span class="frequency-badge ${row.levelKey}">${row.level}</span>
        </button>
      `
    )
  ].join("");

  elements.subjectQuestionList.innerHTML = visibleQuestions.length
    ? visibleQuestions
        .map((item) => {
          const frequency = getQuestionKeywordFrequency(item);
          return `
            <button type="button" class="subject-question" data-id="${item.id}">
              <div class="item-meta">
                <span>${escapeHtml(item.round)}</span>
                <span>${escapeHtml(getQuestionKeyword(item))}</span>
                <span class="frequency-chip ${frequency.levelKey}">${escapeHtml(frequency.label)}</span>
              </div>
              <strong>${escapeHtml(formatDisplayQuestion(item.question))}</strong>
            </button>
          `;
        })
        .join("")
    : `<div class="empty-state"><p>해당 조건의 문제가 없습니다.</p></div>`;
}

function buildFrequentKeywordGroups(selectedCategory) {
  const categories = [...new Set(state.questions.map((item) => item.category))].sort();
  return categories
    .filter((category) => selectedCategory === "all" || category === selectedCategory)
    .map((category) => {
      const questions = state.questions.filter((item) => item.category === category);
      const counts = new Map();
      questions.forEach((item) => {
        const keyword = getQuestionKeyword(item);
        counts.set(keyword, (counts.get(keyword) || 0) + 1);
      });
      const keywords = [...counts.entries()]
        .map(([keyword, count]) => {
          const percent = Math.round((count / Math.max(questions.length, 1)) * 100);
          const levelKey = count >= 10 ? "high" : count >= 4 ? "medium" : "low";
          const level = levelKey === "high" ? "상" : levelKey === "medium" ? "중" : "하";
          return { keyword, count, percent, levelKey, level };
        })
        .sort((a, b) => b.count - a.count || a.keyword.localeCompare(b.keyword, "ko"))
        .slice(0, 40);

      return { category, total: questions.length, keywords };
    })
    .filter((group) => group.keywords.length);
}

function getSubjectDefinition(name) {
  return subjectTabs.find((subject) => subject.name === name) || subjectTabs[0];
}

function getBookOutline(subjectName) {
  return bookOutlines[subjectName] || null;
}

function getQuestionsForSubject(subjectName) {
  const subject = getSubjectDefinition(subjectName);
  const matched = state.questions.filter((item) => questionMatchesSubject(item, subject));
  return matched.length ? matched : state.questions;
}

function questionMatchesSubject(item, subject) {
  const keywordText = normalizeForFrequency(getQuestionKeyword(item));
  const isExcluded = (subject.exclude || []).some((keyword) => keywordText.includes(normalizeForFrequency(keyword)));
  if (isExcluded) {
    return false;
  }

  const outline = getBookOutline(subject.name);
  const outlineKeywords = outline ? [...outline.chapters, ...outline.keywords] : [];
  const keywords = [...subject.keywords, ...outlineKeywords];
  return keywords.some((keyword) => keywordText.includes(normalizeForFrequency(keyword)));
}

function buildSubjectKeywordRows(questions) {
  const total = Math.max(questions.length, 1);
  const counts = new Map();

  questions.forEach((item) => {
    const keyword = getQuestionKeyword(item);
    counts.set(keyword, (counts.get(keyword) || 0) + 1);
  });

  const rows = [...counts.entries()]
    .map(([keyword, count]) => {
      const percent = Math.round((count / total) * 100);
      const levelKey = count >= 8 ? "high" : count >= 3 ? "medium" : "low";
      const level = levelKey === "high" ? "상" : levelKey === "medium" ? "중" : "하";
      return { keyword, count, percent, levelKey, level };
    })
    .sort((a, b) => b.count - a.count || a.keyword.localeCompare(b.keyword, "ko"));

  const repeated = rows.filter((row) => row.count >= 2);
  return (repeated.length ? repeated : rows).slice(0, 60);
}

function buildFrequencyRows() {
  const total = Math.max(state.questions.length, 1);
  return topicGroups
    .map((topic) => {
      const count = state.questions.filter((item) => questionMatchesTopic(item.question, topic.keywords)).length;
      const percent = Math.round((count / total) * 100);
      const levelKey = count >= 30 ? "high" : count >= 15 ? "medium" : "low";
      const level = levelKey === "high" ? "상" : levelKey === "medium" ? "중" : "하";
      return { ...topic, count, percent, levelKey, level };
    })
    .filter((row) => row.count > 0)
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "ko"));
}

function buildKeywordFrequencyRows() {
  const total = Math.max(state.questions.length, 1);
  return [...getKeywordCounts().entries()]
    .map(([keyword, count]) => {
      const percent = Math.round((count / total) * 100);
      const levelKey = count >= 30 ? "high" : count >= 15 ? "medium" : "low";
      const level = levelKey === "high" ? "상" : levelKey === "medium" ? "중" : "하";
      return { keyword, count, percent, levelKey, level };
    })
    .filter((row) => row.count >= 2)
    .sort((a, b) => b.count - a.count || a.keyword.localeCompare(b.keyword, "ko"))
    .slice(0, 80);
}

function getQuestionKeywordFrequency(item) {
  const keywordCounts = getKeywordCounts();
  const keyword = getQuestionKeyword(item);
  const count = keywordCounts.get(keyword) || 1;

  if (!keyword) {
    return { label: "키워드 하 · 1회", levelKey: "low" };
  }

  const levelKey = count >= 30 ? "high" : count >= 15 ? "medium" : "low";
  const level = levelKey === "high" ? "상" : levelKey === "medium" ? "중" : "하";
  return { label: `${keyword} ${level} · ${count}회`, levelKey };
}

function getKeywordCounts() {
  const counts = new Map();
  state.questions.forEach((item) => {
    const keyword = getQuestionKeyword(item);
    counts.set(keyword, (counts.get(keyword) || 0) + 1);
  });
  return counts;
}

function getQuestionKeyword(item) {
  return item.keyword || extractKeywords(item.question)[0] || "기타";
}

function extractKeywords(question) {
  const normalized = String(question || "")
    .replace(/[()[\]{}<>「」『』“”"'.,:;!?·/]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const protectedTerms = [
    "HVDC", "MVDC", "STATCOM", "SVC", "ESS", "KEC", "SMR", "IGCC", "PSS", "CT", "PT", "COS",
    "SAIFI", "SAIDI", "LOLP", "LOLE", "THD", "TDD", "LVRT", "VPP", "EMS", "OLTC"
  ];
  const keywords = [];
  const compact = normalizeForFrequency(question);

  protectedTerms.forEach((term) => {
    if (compact.includes(term.toLowerCase())) {
      keywords.push(term);
    }
  });

  const koreanTerms = normalized.match(/[가-힣A-Za-z0-9%.-]{2,}/g) || [];
  koreanTerms.forEach((term) => {
    const cleaned = term
      .replace(/^[0-9]+$/, "")
      .replace(/^(다음|아래|각각|대하여|설명하시오|구하시오|비교하여|나누어|관련|항목|사항)$/, "");

    if (!cleaned || cleaned.length < 2 || isStopKeyword(cleaned)) {
      return;
    }

    keywords.push(cleaned);
  });

  return [...new Set(keywords)].slice(0, 12);
}

function isStopKeyword(keyword) {
  const stops = new Set([
    "다음", "아래", "각각", "대하여", "설명", "설명하시오", "구하시오", "비교", "비교하여",
    "항목", "사항", "경우", "종류", "특징", "방법", "원리", "목적", "대책", "정의",
    "계산", "기준", "구성", "장점", "단점", "장단점", "영향", "관계", "그림"
  ]);
  return stops.has(keyword);
}

function questionMatchesTopic(question, keywords) {
  const compactQuestion = normalizeForFrequency(question);
  return keywords.some((keyword) => compactQuestion.includes(normalizeForFrequency(keyword)));
}

function normalizeForFrequency(value) {
  return String(value || "")
    .replace(/\s/g, "")
    .toLowerCase();
}

function renderRegisteredList() {
  if (!elements.registeredList) {
    return;
  }

  elements.registeredCount.textContent = `${state.questions.length}문제`;
  elements.registeredList.innerHTML = state.questions.length
    ? state.questions
        .map((item) => {
          const frequency = getQuestionKeywordFrequency(item);
          return `
            <button type="button" class="registered-item" data-id="${item.id}">
              <div class="item-meta">
                <span>${escapeHtml(item.round)}</span>
                <span>${escapeHtml(item.category)}</span>
                <span class="frequency-chip ${frequency.levelKey}">${escapeHtml(frequency.label)}</span>
              </div>
              <strong>${escapeHtml(formatDisplayQuestion(item.question))}</strong>
            </button>
          `;
        })
        .join("")
    : `<div class="empty-state"><p>아직 등록된 문제가 없습니다.</p></div>`;
}

function countTodayReviews() {
  const today = todayKey();
  return state.questions.reduce((sum, item) => {
    return sum + item.reviews.filter((review) => review.date.slice(0, 10) === today).length;
  }, 0);
}

function renderAll() {
  renderCategoryFilter();
  renderFrequentSubjectFilter();
  renderHome();
  renderList();
  renderDetail();
  renderStats();
  renderRegisteredList();
  renderFrequentProblems();
  renderSubjectView();
}

function updateQuestion(id, updates) {
  const index = state.questions.findIndex((item) => item.id === id);
  if (index === -1) {
    return;
  }
  state.questions[index] = { ...state.questions[index], ...updates };
  saveState();
  renderAll();
}

function addReview(status, label) {
  const selected = state.questions.find((item) => item.id === selectedId);
  if (!selected) {
    return;
  }
  updateQuestion(selected.id, {
    status,
    reviews: [...selected.reviews, { date: new Date().toISOString(), label }]
  });
}

function parseImportText(text) {
  const rows = parseTable(text);
  if (!rows.length) {
    return [];
  }

  const header = rows[0].map(normalizeHeader);
  const hasHeader = header.some((cell) => ["회차", "분야", "문제", "문항", "기출", "질문"].includes(cell));
  const dataRows = hasHeader ? rows.slice(1) : rows;
  const roundIndex = findColumn(header, ["회차", "년도", "연도", "시행"]);
  const periodIndex = findColumn(header, ["교시", "시간"]);
  const categoryIndex = findColumn(header, ["분야", "과목", "단원", "분류", "키워드"]);
  const questionIndex = findQuestionColumn(header, dataRows, [roundIndex, periodIndex, categoryIndex]);
  const context = { round: "", period: "", category: "" };

  return dataRows
    .map((row, index) => buildQuestionFromRow(row, index, roundIndex, periodIndex, categoryIndex, questionIndex, context))
    .filter(Boolean);
}

function parseTable(text) {
  const delimiter = guessDelimiter(text);
  const rows = [];
  let row = [];
  let current = "";
  let quoted = false;
  const normalizedText = String(text || "").replace(/^\uFEFF/, "");

  for (let index = 0; index < normalizedText.length; index += 1) {
    const char = normalizedText[index];
    const next = normalizedText[index + 1];

    if (char === '"' && quoted && next === '"') {
      current += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      quoted = !quoted;
      continue;
    }

    if (char === delimiter && !quoted) {
      row.push(current.trim());
      current = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") {
        index += 1;
      }
      row.push(current.trim());
      pushRow(rows, row);
      row = [];
      current = "";
      continue;
    }

    current += char;
  }

  row.push(current.trim());
  pushRow(rows, row);
  return rows;
}

function pushRow(rows, row) {
  const cleaned = row.map((cell) => cell.trim());
  if (cleaned.some(Boolean)) {
    rows.push(cleaned);
  }
}

function guessDelimiter(text) {
  const sample = String(text || "").slice(0, 2000);
  const tabCount = (sample.match(/\t/g) || []).length;
  const commaCount = (sample.match(/,/g) || []).length;
  return tabCount > commaCount ? "\t" : ",";
}

function normalizeHeader(value) {
  return String(value || "")
    .replace(/^\uFEFF/, "")
    .replace(/\s/g, "")
    .toLowerCase();
}

function findColumn(header, candidates) {
  const normalizedCandidates = candidates.map(normalizeHeader);
  const index = header.findIndex((cell) => normalizedCandidates.some((candidate) => cell.includes(candidate)));
  return index >= 0 ? index : null;
}

function findQuestionColumn(header, rows, excludedIndexes) {
  const blockedWords = ["번호", "순번", "no", "num", "index"];
  const preferredWords = ["문제내용", "문항내용", "질문내용", "기출문제", "문제", "문항", "질문", "내용"];
  const blocked = new Set(excludedIndexes.filter((index) => index !== null && index !== undefined));

  for (const word of preferredWords) {
    const index = header.findIndex((cell, cellIndex) => {
      return !blocked.has(cellIndex) && cell.includes(word) && !blockedWords.some((blockedWord) => cell.includes(blockedWord));
    });

    if (index >= 0 && !isMostlyNumericColumn(rows, index)) {
      return index;
    }
  }

  return guessQuestionColumn(rows, blocked);
}

function guessQuestionColumn(rows, blocked = new Set()) {
  const maxColumns = Math.max(...rows.map((row) => row.length), 1);
  let bestIndex = 0;
  let bestScore = -1;

  for (let column = 0; column < maxColumns; column += 1) {
    if (blocked.has(column) || isMostlyNumericColumn(rows, column)) {
      continue;
    }

    const score = rows.reduce((sum, row) => sum + String(row[column] || "").length, 0);
    if (score > bestScore) {
      bestScore = score;
      bestIndex = column;
    }
  }

  return bestIndex;
}

function isMostlyNumericColumn(rows, column) {
  const values = rows.map((row) => String(row[column] || "").trim()).filter(Boolean);
  if (!values.length) {
    return false;
  }

  const numericCount = values.filter((value) => /^[\d\s.,회차교시-]+$/.test(value)).length;
  return numericCount / values.length >= 0.7;
}

function buildQuestionFromRow(row, index, roundIndex, periodIndex, categoryIndex, questionIndex, context) {
  const question = String(row[questionIndex] || row.filter(Boolean).join(" ")).replace(/^\d+[.)]\s*/, "").trim();

  if (!question) {
    return null;
  }

  const roundValue = normalizeRoundValue(row[roundIndex]);
  const periodValue = normalizePeriodValue(row[periodIndex]);
  const categoryValue = String(row[categoryIndex] || "").trim();

  if (roundValue) {
    context.round = roundValue;
  }

  if (periodValue) {
    context.period = periodValue;
  }

  if (categoryValue) {
    context.category = categoryValue;
  }

  return {
    id: crypto.randomUUID(),
    round: composeRound(context.round, context.period, index),
    category: context.category || "미분류",
    question,
    status: "unseen",
    starred: false,
    memo: "",
    reviews: []
  };
}

function normalizeRoundValue(value) {
  const text = String(value || "").trim();
  if (!text) {
    return "";
  }

  if (/^\d+$/.test(text)) {
    return `${text}회`;
  }

  return text;
}

function normalizePeriodValue(value) {
  const text = String(value || "").trim();
  if (!text) {
    return "";
  }

  if (/^\d+$/.test(text)) {
    return `${text}교시`;
  }

  return text.includes("교시") ? text : `${text}교시`;
}

function composeRound(round, period, index) {
  const base = round || `미지정 ${index + 1}`;
  if (!period || base.includes(period)) {
    return base;
  }

  return `${base} ${period}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => registration.unregister());
    });
  });
}

function activateView(viewName, activeNavItem = null) {
  elements.navItems.forEach((nav) => {
    const isActive = activeNavItem
      ? nav === activeNavItem
      : nav.dataset.view === viewName && !nav.dataset.subject;
    nav.classList.toggle("active", isActive);
  });
  elements.views.forEach((view) => view.classList.toggle("active", view.id === `${viewName}View`));
  elements.toolbar.classList.toggle("hidden", viewName !== "study");
}

function openStudyWithStatus(status) {
  elements.searchInput.value = "";
  elements.categoryFilter.value = "all";
  elements.statusFilter.value = status;
  const next = state.questions.find((item) => {
    if (status === "starred") {
      return item.starred;
    }
    return status === "all" ? true : item.status === status;
  });
  if (next) {
    selectedId = next.id;
  }
  activateView("study");
  renderList();
  renderDetail();
}

elements.navItems.forEach((item) => {
  item.addEventListener("click", () => {
    if (item.dataset.view === "subject") {
      activeSubject = item.dataset.subject || subjectTabs[0].name;
      activeSubjectKeyword = "all";
      renderSubjectView();
    }
    activateView(item.dataset.view, item);
  });
});

elements.questionList.addEventListener("click", (event) => {
  const item = event.target.closest(".question-item");
  if (!item) {
    return;
  }
  selectedId = item.dataset.id;
  renderList();
  renderDetail();
});

elements.registeredList.addEventListener("click", (event) => {
  const item = event.target.closest(".registered-item");
  if (!item) {
    return;
  }

  selectedId = item.dataset.id;
  activateView("study");
  renderList();
  renderDetail();
});

elements.searchInput.addEventListener("input", renderList);
elements.categoryFilter.addEventListener("change", renderList);
elements.statusFilter.addEventListener("change", renderList);
elements.frequencyFilter.addEventListener("change", renderFrequencyStats);
elements.frequentSubjectCards.addEventListener("click", (event) => {
  const card = event.target.closest(".frequent-subject-card");
  if (!card) {
    return;
  }
  activeFrequentSubject = card.dataset.subject || "";
  renderFrequentProblems();
});

elements.frequentBack.addEventListener("click", () => {
  activeFrequentSubject = "";
  renderFrequentProblems();
});

elements.startUnseen.addEventListener("click", () => openStudyWithStatus("unseen"));
elements.startWeak.addEventListener("click", () => openStudyWithStatus("weak"));
elements.resumeStudy.addEventListener("click", () => openStudyWithStatus("all"));
elements.openFrequent.addEventListener("click", () => activateView("frequent"));
elements.strategyList.addEventListener("click", (event) => {
  const item = event.target.closest("[data-home-filter]");
  if (!item) {
    return;
  }
  openStudyWithStatus(item.dataset.homeFilter);
});

elements.frequencyStats.addEventListener("click", (event) => {
  const item = event.target.closest(".frequency-item");
  if (!item) {
    return;
  }

  elements.searchInput.value = item.dataset.topic;
  elements.statusFilter.value = "all";
  elements.categoryFilter.value = "all";
  activateView("study");
  renderList();
});

elements.frequentKeywordList.addEventListener("click", (event) => {
  const item = event.target.closest(".frequent-keyword");
  if (!item) {
    return;
  }

  elements.searchInput.value = item.dataset.keyword;
  elements.statusFilter.value = "all";
  elements.categoryFilter.value = item.dataset.category === "all" ? "all" : item.dataset.category;
  activateView("study");
  renderList();
});

elements.subjectKeywordList.addEventListener("click", (event) => {
  const item = event.target.closest(".frequent-keyword");
  if (!item) {
    return;
  }

  activeSubjectKeyword = item.dataset.keyword || "all";
  renderSubjectView();
});

elements.subjectQuestionList.addEventListener("click", (event) => {
  const item = event.target.closest(".subject-question");
  if (!item) {
    return;
  }

  selectedId = item.dataset.id;
  elements.searchInput.value = "";
  elements.statusFilter.value = "all";
  elements.categoryFilter.value = "all";
  activateView("study");
  renderList();
  renderDetail();
});

elements.memoInput.addEventListener("input", () => {
  const selected = state.questions.find((item) => item.id === selectedId);
  if (selected) {
    selected.memo = elements.memoInput.value;
    saveState();
  }
});

elements.starButton.addEventListener("click", () => {
  const selected = state.questions.find((item) => item.id === selectedId);
  if (selected) {
    updateQuestion(selected.id, { starred: !selected.starred });
  }
});

elements.markDone.addEventListener("click", () => addReview("done", "회독 완료"));
elements.markWeak.addEventListener("click", () => addReview("weak", "취약 표시"));
elements.resetStatus.addEventListener("click", () => {
  const selected = state.questions.find((item) => item.id === selectedId);
  if (selected) {
    updateQuestion(selected.id, { status: "unseen" });
  }
});

elements.questionForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const question = {
    id: crypto.randomUUID(),
    round: elements.roundInput.value.trim(),
    category: elements.categoryInput.value.trim(),
    question: elements.questionInput.value.trim(),
    status: "unseen",
    starred: false,
    memo: "",
    reviews: []
  };
  state.questions.unshift(question);
  selectedId = question.id;
  saveState();
  elements.questionForm.reset();
  renderAll();
});

async function readImportSources() {
  const file = elements.importFile.files?.[0];
  const pastedText = elements.csvInput.value;
  const fileText = file ? await file.text() : "";
  return { fileText, pastedText };
}

elements.importCsv.addEventListener("click", async () => {
  elements.importMessage.textContent = "가져오는 중입니다.";
  const { fileText, pastedText } = await readImportSources();
  const fileRows = parseImportText(fileText);
  const pastedRows = parseImportText(pastedText);
  const imported = fileRows.length ? fileRows : pastedRows;

  if (!imported.length) {
    elements.importMessage.textContent = "등록할 문제가 없습니다. CSV 파일이나 붙여넣기 칸에 문제를 넣어주세요.";
    return;
  }

  state.questions = [...imported, ...state.questions];
  selectedId = imported[0].id;
  elements.csvInput.value = "";
  elements.importFile.value = "";
  elements.importMessage.textContent = `${imported.length}문제를 등록했습니다.`;
  saveState();
  renderAll();
});

elements.importExam121.addEventListener("click", async () => {
  elements.importMessage.textContent = "PDF 문제를 등록하는 중입니다.";

  try {
    const count = await loadPdfQuestions();
    elements.importMessage.textContent = `${count}문제를 등록했습니다.`;
  } catch (error) {
    elements.importMessage.textContent = "PDF 문제 CSV를 읽지 못했습니다. 서버가 켜져 있는지 확인하세요.";
  }
});

elements.exportJson.addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "발송배전기술사-기출회독-백업.json";
  link.click();
  URL.revokeObjectURL(url);
});

elements.resetData.addEventListener("click", () => {
  if (!confirm("모든 문제와 회독 기록을 초기화할까요?")) {
    return;
  }
  state.questions = getDefaultQuestions();
  state.dailyGoal = 20;
  selectedId = state.questions[0]?.id ?? null;
  saveState();
  renderAll();
});

elements.goalDown.addEventListener("click", () => {
  state.dailyGoal = Math.max(1, state.dailyGoal - 5);
  saveState();
  renderStats();
});

elements.goalUp.addEventListener("click", () => {
  state.dailyGoal += 5;
  saveState();
  renderStats();
});

renderAll();
autoUploadFromPdfCsv();
