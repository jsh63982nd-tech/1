(() => {
  const STOP_KEYWORDS = new Set([
    "에서", "에게", "으로", "로서", "로써", "으로써", "으로서", "부터", "까지", "보다",
    "을", "를", "이", "가", "은", "는", "의", "에", "와", "과", "로", "도", "만", "및", "또는",
    "다음", "아래", "각각", "서로", "관련", "관한", "대한", "대하여", "관하여",
    "설명", "설명하시오", "구하시오", "제시하시오", "비교하시오", "작성하시오", "열거하시오",
    "제시하고", "유지하기", "방지하기", "사용하는", "적용하는", "발생하는", "설치된",
    "항목", "사항", "경우", "종류", "특징", "방법", "원리", "목적", "역할", "기능",
    "대책", "정의", "계산", "기준", "구성", "장점", "단점", "장단점", "영향", "관계", "그림",
    "조건", "문제점", "유의사항", "고려사항", "차이점", "개요", "일반", "주요",
    "kg", "mm", "cm", "km"
  ]);

  const TERM_FIXES = [
    ["SpecialProtectionSystem", "Special Protection System"],
    ["EnergyStorageSystem", "Energy Storage System"],
    ["UninterruptiblePowerSupply", "Uninterruptible Power Supply"],
    ["HighVoltageDirectCurrent", "High Voltage Direct Current"],
    ["KeySingleLineDiagram", "Key Single Line Diagram"],
    ["Partialdifferentialprotection", "Partial differential protection"],
    ["Surgetank", "Surge tank"],
    ["workscope", "work scope"],
    ["케이 블", "케이블"],
    ["공기 예 열기", "공기예열기"],
    ["측 면", "측면"],
    ["특 정", "특징"],
    ["전압 변 통율", "전압 변동률"],
    ["셜명하시오", "설명하시오"],
    ["콘멘서", "콘덴서"],
    ["바깔지 름", "바깥지름"],
    ["통 (Cu)", "동(Cu)"],
    ["k g!m", "kg/m"]
  ];

  const TECH_TERMS = [
    "한시과전류보호계전기", "과전류보호계전기", "고압전동기용과전류계전기", "과전류계전기",
    "비율차동계전방식", "보호계전기", "시간협조", "협조시간간격", "협조시간 간격",
    "공장구내", "가공송전선로", "지중송전선로", "배전계통", "배전선로", "전력계통",
    "전력케이블", "지중케이블", "전력용변압기", "단권변압기", "3권선변압기",
    "동기발전기", "수차발전기", "터빈발전기", "대용량발전기", "예방진단시스템",
    "전력시스템", "화력발전", "수력발전", "풍력발전", "태양광발전", "분산전원",
    "무효전력", "고장전류", "전압강하", "전압변동", "전력조류", "조류계산",
    "중성점접지", "접지저항", "절연협조", "피뢰기", "차단기"
  ];

  const DISPLAY_RULES = [
    [/(\d+(?:\.\d+)?)\s*k\s*V/gi, "$1kV"],
    [/(\d+(?:\.\d+)?)\s*k\s*A/gi, "$1kA"],
    [/(\d+(?:\.\d+)?)\s*M\s*W/gi, "$1MW"],
    [/(\d+(?:\.\d+)?)\s*M\s*V\s*A/gi, "$1MVA"],
    [/(\d+(?:\.\d+)?)\s*k\s*V\s*A/gi, "$1kVA"],
    [/(\d+(?:\.\d+)?)kV(?=[가-힣])/g, "$1kV "],
    [/(\d+(?:\.\d+)?)kA(?=[가-힣])/g, "$1kA "],
    [/kV\s*Cable/gi, "kV Cable"],
    [/([,;:])(?=\S)/g, "$1 "],
    [/([.!?])(?=[가-힣A-Za-z])/g, "$1 "],
    [/([가-힣])(\d+[.)])/g, "$1 $2"],
    [/(\))(?=[가-힣A-Za-z0-9])/g, "$1 "],
    [/([가-힣])([A-Z]{2,}[A-Za-z0-9/-]*)/g, "$1 $2"],
    [/([A-Za-z0-9])([가-힣])/g, "$1 $2"],
    [/또는(?=\S)/g, "또는 "],
    [/그리고(?=\S)/g, "그리고 "],
    [/다음(?=\S)/g, "다음 "],
    [/아래(?=\S)/g, "아래 "],
    [/각각(?=\S)/g, "각각 "],
    [/대하여(?=\S)/g, "대하여 "],
    [/관하여(?=\S)/g, "관하여 "],
    [/비교하여(?=\S)/g, "비교하여 "],
    [/제시하고(?=\S)/g, "제시하고 "],
    [/설명하고(?=\S)/g, "설명하고 "],
    [/사용하는(?=\S)/g, "사용하는 "],
    [/적용하는(?=\S)/g, "적용하는 "],
    [/설치된(?=\S)/g, "설치된 "],
    [/발생하는(?=\S)/g, "발생하는 "],
    [/유지하기(?=\S)/g, "유지하기 "],
    [/방지하기(?=\S)/g, "방지하기 "],
    [/위한(?=\S)/g, "위한 "],
    [/따른(?=\S)/g, "따른 "],
    [/시(?=전동기|모선|다음|보호|전압|계통|발전|변압|차단|전류|고장|부하|운전|설비|송전|배전)/g, "시 "],
    [/([가-힣])(에서|으로|로서|로써|에는|과의|와의|에|의|을|를|이|가|은|는)(?=(다음|아래|각각|서로|설명|비교|구하|제시|작성|열거|검토|선정|사용|적용|발생|미치는|나타나는|유지|방지|고려|계산|정정|접속|설치|운전|제어|보호|해석|분류|구성|종류|특징|방법|목적|역할|기능|원리|조건|기준|구조|형태|특성|영향|관계|문제점|대책|사항))/g, "$1$2 "],
    [/([가-힣])의(?=[가-힣]+(관계|구조|형태|특징|기능|종류|역할|목적|용량|사양|차이점|문제점|대책|영향))/g, "$1의 "],
    [/([가-힣])를(?=(정정|비교|설명|구하|제시|작성|설계|검토|산정|선정))/g, "$1를 "],
    [/([가-힣])을(?=(정정|비교|설명|구하|제시|작성|설계|검토|산정|선정))/g, "$1을 "],
    [/([가-힣])에(?=(대하여|관하여|따른|설치|사용|적용|연결|접속|미치는))/g, "$1에 "]
  ];

  function cleanDisplayQuestion(question) {
    let text = String(question || "").replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();

    TERM_FIXES.forEach(([from, to]) => {
      text = text.replaceAll(from, to);
    });

    DISPLAY_RULES.forEach(([pattern, replacement]) => {
      text = text.replace(pattern, replacement);
    });

    const termDisplays = new Map([
      ["한시과전류보호계전기", "한시 과전류 보호계전기"],
      ["한시과 전류보호계전기", "한시 과전류 보호계전기"],
      ["과전류보호계전기", "과전류 보호계전기"],
      ["과 전류보호계전기", "과전류 보호계전기"],
      ["고압전동기용과전류계전기", "고압전동기용 과전류계전기"],
      ["과전류계전기", "과전류계전기"],
      ["비율차동계전방식", "비율차동계전 방식"],
      ["협조시간간격", "협조시간 간격"],
      ["상호간의협조시간", "상호 간의 협조시간"],
      ["상호간의협조", "상호 간의 협조"],
      ["보호계전기상호", "보호계전기 상호"],
      ["시간협조항목", "시간협조 항목"],
      ["시간협조", "시간협조"],
      ["공장구내", "공장 구내"],
      ["급공장", "급 공장"],
      ["예방진단시스템", "예방진단 시스템"],
      ["전력시스템", "전력 시스템"],
      ["전원공급", "전원 공급"],
      ["유지보수", "유지보수"],
      ["산업플랜트", "산업 플랜트"],
      ["기본신뢰도", "기본 신뢰도"],
      ["저압지중배전계통", "저압 지중배전계통"],
      ["구성방식", "구성 방식"],
      ["부하변동", "부하 변동"],
      ["부하응답모델", "부하응답 모델"],
      ["계통운영상", "계통 운영상"],
      ["동기투입", "동기 투입"],
      ["비동기투입", "비동기 투입"],
      ["주단선도", "주단선도"],
      ["용량선정사유", "용량 선정 사유"],
      ["기기사양", "기기 사양"],
      ["여자돌입전류", "여자돌입전류"],
      ["정한시정정", "정한시 정정"],
      ["발생원인", "발생 원인"],
      ["상차각", "상차각"],
      ["전력편차", "전력 편차"],
      ["안정도계산법", "안정도 계산법"],
      ["작업순서", "작업 순서"]
    ]);

    termDisplays.forEach((display, term) => {
      text = text.replaceAll(term, display);
    });

    return text
      .replace(/\s+([,.;:!?])/g, "$1")
      .replace(/([,;:!?])(?=\S)/g, "$1 ")
      .replace(/(\d)\.\s+(\d)/g, "$1.$2")
      .replace(/\(\s+/g, "(")
      .replace(/\s+\)/g, ")")
      .replace(/\s+(을|를|이|가|은|는|의|와|과|에|에서|으로|로|도|만)(?=\s|$)/g, "$1")
      .replace(/(를|을|이|가|은|는|의|에|에서)(?=(정정|비교|설명|구하|제시|작성|설계|검토|산정|선정|사용|적용|설치|연결|유지|방지|계산|대하여|관하여|수전|송전|배전|발전|변압|전동|계통))/g, "$1 ")
      .replace(/과(?=(송전|배전|발전|변압|전동|전력|전압|수전))/g, "과 ")
      .replace(/\s+(을|를|이|가|은|는|의|와|과|에|에서|으로|로|도|만)(?=\s|$)/g, "$1")
      .replace(/이간격/g, "이 간격")
      .replace(/(설명하|구하|제시하|비교하|작성하)시\s+오/g, "$1시오")
      .replace(/비교\s*설명하시오/g, "비교하여 설명하시오")
      .replace(/\s{2,}/g, " ")
      .trim();
  }

  function getKnownKeywordTerms() {
    const terms = new Set(TECH_TERMS);
    const add = (keyword) => {
      const cleaned = cleanKeyword(keyword);
      if (cleaned && !STOP_KEYWORDS.has(cleaned) && cleaned.length >= 2) {
        terms.add(cleaned);
      }
    };

    try {
      if (typeof topicGroups !== "undefined") {
        topicGroups.forEach((group) => group.keywords.forEach(add));
      }
      if (typeof subjectTabs !== "undefined") {
        subjectTabs.forEach((subject) => subject.keywords.forEach(add));
      }
      Object.values(typeof bookOutlines !== "undefined" ? bookOutlines : {}).forEach((outline) => {
        outline.keywords?.forEach(add);
        outline.chapters?.forEach(add);
      });
      if (typeof state !== "undefined") {
        state.questions?.forEach((item) => add(item.keyword));
      }
    } catch (error) {
      return [...terms];
    }

    return [...terms].sort((a, b) => b.length - a.length);
  }

  function cleanKeyword(keyword) {
    let value = String(keyword || "")
      .replace(/[()[\]{}<>「」『』“”"'.,:;!?·/_\-]/g, " ")
      .replace(/\s+/g, "")
      .trim();

    value = (typeof keywordAliases !== "undefined" ? keywordAliases.get(value) : undefined) || value;

    for (let index = 0; index < 3; index += 1) {
      value = value.replace(/(에서|에게|으로써|으로서|으로|로서|로써|부터|까지|보다|에는|과의|와의|의|을|를|이|가|은|는|에|와|과|로|도|만)$/g, "");
    }

    value = value.replace(/(설명하시오|구하시오|제시하시오|비교하시오|작성하시오|설명|비교|종류|특징|방법|경우|사항|항목|대책|영향|관계)$/g, "");
    value = value.replace(/(설치된|제시하고|유지하기|방지하기|사용하는|적용하는|발생하는|설명하고|설명하며|정정하|비교하|구하|제시하|작성하|사용하|적용하|관련하|대하여|관하여)$/g, "");

    return value.trim();
  }

  function extractCleanKeywords(question) {
    const text = cleanDisplayQuestion(question);
    const compact = normalizeForFrequency(text);
    const found = [];

    getKnownKeywordTerms().forEach((term) => {
      const cleaned = cleanKeyword(term);
      if (!cleaned || STOP_KEYWORDS.has(cleaned) || cleaned.length < 2) {
        return;
      }
      if (compact.includes(normalizeForFrequency(cleaned))) {
        found.push(cleaned);
      }
    });

    const tokenCandidates = text.match(/[가-힣A-Za-z0-9%.-]{2,}/g) || [];
    tokenCandidates.forEach((token) => {
      const cleaned = cleanKeyword(token);
      if (!cleaned || STOP_KEYWORDS.has(cleaned) || cleaned.length < 3 || /^[0-9.%-]+$/.test(cleaned) || /\d/.test(cleaned)) {
        return;
      }
      found.push(cleaned);
    });

    return [...new Set(found)].slice(0, 12);
  }

  formatDisplayQuestion = cleanDisplayQuestion;
  extractKeywords = extractCleanKeywords;
  isStopKeyword = (keyword) => STOP_KEYWORDS.has(cleanKeyword(keyword));
  normalizeQuestionKeyword = (keyword) => {
    const cleaned = cleanKeyword(keyword);
    return (typeof keywordAliases !== "undefined" ? keywordAliases.get(cleaned) : undefined) || cleaned || "기타";
  };
  getQuestionKeyword = (item) => {
    const corrected = keywordCorrections.get(item.id);
    const source = corrected || item.keyword;
    const cleaned = normalizeQuestionKeyword(source);
    if (cleaned && !STOP_KEYWORDS.has(cleaned) && cleaned.length >= 2) {
      return cleaned;
    }
    return extractCleanKeywords(item.question)[0] || "기타";
  };

  function activeViewName() {
    const activeView = [...elements.views].find((view) => view.classList.contains("active"));
    return activeView?.id.replace(/View$/, "") || "home";
  }

  function renderVisibleView(viewName = activeViewName()) {
    if (viewName === "study") {
      renderList();
      renderDetail();
      return;
    }
    if (viewName === "add") {
      renderRegisteredList();
      return;
    }
    if (viewName === "frequent") {
      renderFrequentProblems();
      return;
    }
    if (viewName === "subject") {
      renderSubjectView();
      return;
    }
    if (viewName === "stats") {
      renderStats();
      return;
    }
    renderHome();
  }

  const originalActivateView = activateView;
  renderAll = () => {
    renderCategoryFilter();
    renderFrequentSubjectFilter();
    renderVisibleView();
  };
  activateView = (viewName, activeNavItem = null) => {
    originalActivateView(viewName, activeNavItem);
    renderVisibleView(viewName);
  };

  window.questionCleanupReady = true;
})();
