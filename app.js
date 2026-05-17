const STORAGE_KEY = "power-exam-review-v1";
const DATA_VERSION = "pdf-104-137-keywords-v6-clean";

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
  { name: "KEC/기준", keywords: ["KEC", "한국전기설비규정", "전기설비기술기준", "신뢰도및전기품질유지기준"] }
];

const subjectTabs = [
  {
    name: "송배전공학",
    keywords: [
      "송전", "배전", "변전", "전선로", "가공송전", "지중송전", "가공전선", "지중케이블", "해저케이블",
      "전력케이블", "케이블", "애자", "철탑", "코로나", "섬락", "절연협조", "피뢰기", "차단기", "단로기",
      "개폐기", "변압기", "접지", "계전", "보호", "CT", "PT", "COS", "리클로저", "SVR", "배전선",
      "배전계통", "수전", "전력용콘덴서", "리액터", "모선", "GIS", "22.9", "154kV", "345kV", "765kV"
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
      "SVC", "ESS", "분산전원", "마이크로그리드", "VPP", "전력시장", "예비력", "신뢰도", "EMS",
      "SCADA", "전력원선도", "수요", "RE100", "PMU", "보조서비스", "덕커브"
    ]
  }
];

const state = loadState();
let selectedId = state.questions[0]?.id ?? null;
let activeSubject = subjectTabs[0].name;
let activeSubjectKeyword = "all";
localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, dataVersion: DATA_VERSION }));

const elements = {
  navItems: document.querySelectorAll(".nav-item"),
  views: document.querySelectorAll(".view"),
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
  frequentSubjectFilter: document.querySelector("#frequentSubjectFilter"),
  frequentKeywordList: document.querySelector("#frequentKeywordList"),
  subjectTitle: document.querySelector("#subjectTitle"),
  subjectCount: document.querySelector("#subjectCount"),
  subjectKeywordCount: document.querySelector("#subjectKeywordCount"),
  subjectKeywordList: document.querySelector("#subjectKeywordList"),
  subjectQuestionTitle: document.querySelector("#subjectQuestionTitle"),
  subjectQuestionList: document.querySelector("#subjectQuestionList")
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
  if (!elements.frequentSubjectFilter) {
    return;
  }

  const current = elements.frequentSubjectFilter.value || "all";
  const categories = [...new Set(state.questions.map((item) => item.category))].sort();
  elements.frequentSubjectFilter.innerHTML = [
    `<option value="all">전체 과목</option>`,
    ...categories.map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`)
  ].join("");
  elements.frequentSubjectFilter.value = categories.includes(current) ? current : "all";
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
          <strong>${escapeHtml(item.question)}</strong>
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
  elements.detailQuestion.textContent = selected.question;
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
  if (!elements.frequentKeywordList) {
    return;
  }

  const selectedCategory = elements.frequentSubjectFilter?.value || "all";
  const groups = buildFrequentKeywordGroups(selectedCategory);

  elements.frequentKeywordList.innerHTML = groups.length
    ? groups
        .map(
          (group) => `
            <section class="frequent-subject">
              <div class="frequent-subject-head">
                <h3>${escapeHtml(group.category)}</h3>
                <span class="count-badge">${group.total}문제</span>
              </div>
              <div class="frequent-keywords">
                ${group.keywords
                  .map(
                    (row, index) => `
                      <button type="button" class="frequent-keyword" data-keyword="${escapeHtml(row.keyword)}" data-category="${escapeHtml(group.category)}">
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
        )
        .join("")
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
              <strong>${escapeHtml(item.question)}</strong>
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

  return subject.keywords.some((keyword) => keywordText.includes(normalizeForFrequency(keyword)));
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
              <strong>${escapeHtml(item.question)}</strong>
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
elements.frequentSubjectFilter.addEventListener("change", renderFrequentProblems);

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
