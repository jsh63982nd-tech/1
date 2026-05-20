(() => {
  const REFERENCE_RULES = [
    {
      terms: ["과전류", "OCR", "50/51", "보호계전", "계전기", "보호협조", "거리계전", "차동계전"],
      refs: [
        ["이존우 상권 송전공학(2008)", 798, "제9장 보호계전시스템 - 과전류계전기 정정"],
        ["이존우 상권 송전공학(2008)", 747, "제9장 보호계전시스템"]
      ]
    },
    {
      terms: ["전력용콘덴서", "콘덴서", "진상콘덴서", "정전용량"],
      refs: [
        ["이존우 하권 배전/발전/계통공학(2008)", 156, "제3장 배전계통 - 전력용콘덴서"],
        ["이존우 하권 배전/발전/계통공학(2008)", 173, "제3장 배전계통 - 전력용콘덴서 자동운전"]
      ]
    },
    {
      terms: ["케이블", "전력케이블", "XLPE", "CN/CV", "CNCV", "VLF", "부분방전", "시스"],
      refs: [
        ["이존우 하권 배전/발전/계통공학(2008)", 62, "제2장 전력케이블"],
        ["이존우 하권 배전/발전/계통공학(2008)", 76, "제2장 전력케이블 - 절연내력시험"]
      ]
    },
    {
      terms: ["접지", "중성점", "지락", "유도장해", "대지전위"],
      refs: [
        ["이존우 하권 배전/발전/계통공학(2008)", 248, "제4장 접지시스템"],
        ["이존우 상권 송전공학(2008)", 574, "제6장 중성점접지방식과 유도장해"]
      ]
    },
    {
      terms: ["변압기", "단권변압기", "3권선변압기", "OLTC", "여자돌입전류", "각변위"],
      refs: [
        ["이존우 하권 배전/발전/계통공학(2008)", 6, "제1장 변전설비 - 변압기"],
        ["이존우 상권 송전공학(2008)", 116, "제1장 기초이론 - 변압기 원리"]
      ]
    },
    {
      terms: ["배전", "22.9kV", "ALTS", "리클로저", "저압지중배전", "전압강하", "배전손실"],
      refs: [
        ["이존우 하권 배전/발전/계통공학(2008)", 118, "제3장 배전계통"],
        ["이존우 하권 배전/발전/계통공학(2008)", 128, "제3장 배전계통 - 네트워크/배전운용"]
      ]
    },
    {
      terms: ["송전선", "가공송전", "코로나", "연가", "선로정수", "철탑", "애자"],
      refs: [
        ["이존우 상권 송전공학(2008)", 424, "제5장 송전계통의 특성"],
        ["이존우 상권 송전공학(2008)", 458, "제5장 송전선로의 기본모델"]
      ]
    },
    {
      terms: ["고장전류", "단락", "단락용량", "대칭좌표", "불평형고장"],
      refs: [
        ["이존우 상권 송전공학(2008)", 352, "제4장 고장전류계산"],
        ["이존우 상권 송전공학(2008)", 648, "제7장 불평형고장계산"]
      ]
    },
    {
      terms: ["무효전력", "전압무효", "VQC", "SVC", "STATCOM", "FACTS", "TCSC", "HVDC", "고조파"],
      refs: [
        ["이존우 하권 배전/발전/계통공학(2008)", 719, "계통공학 제4장 전압 무효전력제어"],
        ["이존우 상권 송전공학(2008)", 730, "제8장 안정도 - SVC"]
      ]
    },
    {
      terms: ["조류", "전력조류", "안정도", "상차각", "전력편차", "동요방정식", "과도안정도"],
      refs: [
        ["이존우 하권 배전/발전/계통공학(2008)", 672, "계통공학 제1장 전력조류계산"],
        ["이존우 상권 송전공학(2008)", 700, "제8장 안정도"]
      ]
    },
    {
      terms: ["주파수", "AFC", "LFC", "ELD", "경제부하", "조속기", "Governor"],
      refs: [
        ["이존우 하권 배전/발전/계통공학(2008)", 690, "계통공학 - 주파수 및 유효전력제어"],
        ["이존우 하권 배전/발전/계통공학(2008)", 672, "계통공학 제1장 전력조류계산"]
      ]
    },
    {
      terms: ["수력", "수차", "조압수조", "서징", "캐비테이션", "양수발전", "낙차"],
      refs: [
        ["이존우 하권 배전/발전/계통공학(2008)", 320, "발전공학 - 수력발전"],
        ["이존우 하권 배전/발전/계통공학(2008)", 340, "발전공학 - 수력설비 및 수차"]
      ]
    },
    {
      terms: ["화력", "보일러", "증기터빈", "복합화력", "가스터빈", "절탄기", "공기예열기", "랭킨"],
      refs: [
        ["이존우 하권 배전/발전/계통공학(2008)", 390, "발전공학 - 화력발전"],
        ["이존우 하권 배전/발전/계통공학(2008)", 430, "발전공학 - 보일러/증기터빈"]
      ]
    },
    {
      terms: ["원자력", "원자로", "PWR", "BWR", "고속증식로", "반감기", "SMR"],
      refs: [
        ["이존우 하권 배전/발전/계통공학(2008)", 520, "발전공학 - 원자력발전"],
        ["이존우 하권 배전/발전/계통공학(2008)", 540, "발전공학 - 원자로"]
      ]
    },
    {
      terms: ["태양광", "풍력", "ESS", "신재생", "분산전원", "계통연계", "FRT", "인버터", "단독운전"],
      refs: [
        ["이존우 하권 배전/발전/계통공학(2008)", 719, "계통공학 제4장 전압 무효전력제어"],
        ["이존우 하권 배전/발전/계통공학(2008)", 118, "제3장 배전계통"]
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
    return refs.length ? refs : [["이존우 상권/하권(2008)", null, "문제 키워드로 색인 확인 필요"]];
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
