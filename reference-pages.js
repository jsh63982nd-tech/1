(() => {
  const REFERENCE_RULES = [
    {
      terms: ["과전류", "OCR", "50/51", "보호계전", "계전기", "보호협조", "거리계전", "차동계전"],
      refs: [
        ["최신 송배전공학.pdf", 415, "10장 보호계전 방식"],
        ["최신 송배전공학.pdf", 569, "14장 배전선로의 보호"]
      ]
    },
    {
      terms: ["전력용콘덴서", "콘덴서", "진상콘덴서", "정전용량"],
      refs: [
        ["최신 송배전공학.pdf", 548, "14장 역률 개선용 콘덴서"],
        ["최신 송배전공학.pdf", 554, "14장 전력 손실 및 배전전압 관리"]
      ]
    },
    {
      terms: ["케이블", "전력케이블", "XLPE", "CN/CV", "CNCV", "VLF", "부분방전", "시스"],
      refs: [
        ["최신 송배전공학.pdf", 102, "3장 지중송전선로 - 전력케이블"],
        ["최신 송배전공학.pdf", 157, "4장 선로정수와 코로나 - 케이블 선로정수"]
      ]
    },
    {
      terms: ["접지", "중성점", "지락", "유도장해", "대지전위"],
      refs: [
        ["최신 송배전공학.pdf", 261, "6장 중성점 접지방식과 유도장해"],
        ["최신 송배전공학.pdf", 434, "11장 변전소"]
      ]
    },
    {
      terms: ["변압기", "단권변압기", "3권선변압기", "OLTC", "여자돌입전류", "각변위"],
      refs: [
        ["최신 송배전공학.pdf", 434, "11장 변전소"],
        ["최신 송배전공학.pdf", 505, "13장 배전선로의 전기적 특성 - 변압기"]
      ]
    },
    {
      terms: ["배전", "22.9kV", "ALTS", "리클로저", "저압지중배전", "전압강하", "배전손실"],
      refs: [
        ["최신 송배전공학.pdf", 456, "12장 배전계통의 구성"],
        ["최신 송배전공학.pdf", 505, "13장 배전선로의 전기적 특성"]
      ]
    },
    {
      terms: ["송전선", "가공송전", "코로나", "연가", "선로정수", "철탑", "애자"],
      refs: [
        ["최신 송배전공학.pdf", 64, "2장 가공송전선로"],
        ["최신 송배전공학.pdf", 157, "4장 선로정수와 코로나"]
      ]
    },
    {
      terms: ["고장전류", "단락", "단락용량", "대칭좌표", "불평형고장"],
      refs: [
        ["최신 송배전공학.pdf", 290, "7장 고장계산"],
        ["최신 송배전공학.pdf", 334, "8장 안정도"]
      ]
    },
    {
      terms: ["무효전력", "전압무효", "VQC", "SVC", "STATCOM", "FACTS", "TCSC", "HVDC", "고조파"],
      refs: [
        ["최신 송배전공학.pdf", 233, "5장 송전특성 - 전압/무효전력"],
        ["최신 송배전공학.pdf", 548, "14장 역률 개선용 콘덴서"]
      ]
    },
    {
      terms: ["조류", "전력조류", "안정도", "상차각", "전력편차", "동요방정식", "과도안정도"],
      refs: [
        ["최신 송배전공학.pdf", 334, "8장 안정도"],
        ["최신 송배전공학.pdf", 233, "5장 송전특성"]
      ]
    },
    {
      terms: ["주파수", "AFC", "LFC", "ELD", "경제부하", "조속기", "Governor"],
      refs: [
        ["최신 발전공학.pdf", 35, "2장 수력발전의 개요"],
        ["최신 송배전공학.pdf", 334, "8장 안정도"]
      ]
    },
    {
      terms: ["수력", "수차", "조압수조", "서징", "캐비테이션", "양수발전", "낙차"],
      refs: [
        ["최신 발전공학.pdf", 35, "2장 수력발전의 개요"],
        ["최신 발전공학.pdf", 92, "6장 수력설비"]
      ]
    },
    {
      terms: ["화력", "보일러", "증기터빈", "복합화력", "가스터빈", "절탄기", "공기예열기", "랭킨"],
      refs: [
        ["최신 발전공학.pdf", 209, "7장 기력발전의 개요"],
        ["최신 발전공학.pdf", 264, "9장 보일러 및 연소장치"]
      ]
    },
    {
      terms: ["원자력", "원자로", "PWR", "BWR", "고속증식로", "반감기", "SMR"],
      refs: [
        ["최신 발전공학.pdf", 376, "12장 원자력발전의 개요"],
        ["최신 발전공학.pdf", 414, "13장 원자로"]
      ]
    },
    {
      terms: ["태양광", "풍력", "ESS", "신재생", "분산전원", "계통연계", "FRT", "인버터", "단독운전"],
      refs: [
        ["최신 발전공학.pdf", 512, "17장 새로운 발전"],
        ["최신 발전공학.pdf", 588, "18장 에너지 저장기술"]
      ]
    }
  ];

  function normalizeReferenceText(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/[()[\]{}<>「」『』"'.,:;!?·/_-]/g, "");
  }

  function getReferenceRows(item) {
    const question = typeof formatDisplayQuestion === "function" ? formatDisplayQuestion(item.question) : item.question;
    const keywordText = typeof extractKeywords === "function" ? extractKeywords(question).join(" ") : "";
    const haystack = normalizeReferenceText(`${item.keyword || ""} ${item.category || ""} ${question} ${keywordText}`);

    const matches = REFERENCE_RULES
      .map((rule) => {
        const score = rule.terms.reduce((sum, term) => {
          return sum + (haystack.includes(normalizeReferenceText(term)) ? 1 : 0);
        }, 0);
        return { rule, score };
      })
      .filter((row) => row.score > 0)
      .sort((a, b) => b.score - a.score);

    const refs = matches.flatMap((row) => row.rule.refs).slice(0, 2);
    return refs.length ? refs : [["최신 송배전공학.pdf / 최신 발전공학.pdf", null, "문제 키워드로 색인 확인 필요"]];
  }

  function formatReferencePage(page) {
    return page ? `PDF p.${page}` : "페이지 확인 필요";
  }

  function referenceMarkup(item) {
    const rows = getReferenceRows(item);
    return `
      <div class="aid-block">
        <strong>참조 교재/페이지</strong>
        <div class="aid-chips">
          ${rows.map(([book, page, title]) => `
            <span>${escapeHtml(book)} ${formatReferencePage(page)} · ${escapeHtml(title)}</span>
          `).join("")}
        </div>
      </div>
    `;
  }

  const previousRenderStudyAid = renderStudyAid;
  renderStudyAid = (item) => {
    previousRenderStudyAid(item);
    if (!elements.studyAid) {
      return;
    }
    elements.studyAid.insertAdjacentHTML("beforeend", referenceMarkup(item));
  };

  renderAll();
})();
