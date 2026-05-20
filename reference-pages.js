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
      terms: ["차단기", "단로기", "개폐", "개폐서지", "쇄정", "차단용량", "한류리액터", "모선", "변전소"],
      refs: [
        ["최신 송배전공학.pdf", 434, "11장 변전소"],
        ["최신 송배전공학.pdf", 415, "10장 보호계전 방식"]
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
      terms: ["발전기", "동기발전기", "여자", "동기투입", "병렬운전", "단락전류", "전기자", "동기임피던스", "단락비", "PSS", "자기부하제어"],
      refs: [
        ["최신 발전공학.pdf", 130, "7장 발전기 운전과 제어"],
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
    },
    {
      terms: ["전력시장", "신뢰도", "품질", "공급신뢰도", "전력계통운영", "장기전력계통", "예비력", "수급"],
      refs: [
        ["최신 송배전공학.pdf", 334, "8장 안정도 및 계통운영"],
        ["최신 송배전공학.pdf", 233, "5장 송전특성"]
      ]
    },
    {
      terms: ["연료전지", "목재펠릿", "바이오", "IGCC", "석탄", "유연탄", "연료", "환경", "탈황", "탈질"],
      refs: [
        ["최신 발전공학.pdf", 209, "7장 기력발전의 개요"],
        ["최신 발전공학.pdf", 512, "17장 새로운 발전"]
      ]
    },
    {
      terms: ["전기설비기술기준", "KEC", "한국전기설비규정", "감리", "공사관리", "검측", "피뢰설비", "보호범위"],
      refs: [
        ["최신 송배전공학.pdf", 456, "12장 배전계통의 구성"],
        ["최신 송배전공학.pdf", 434, "11장 변전소"]
      ]
    }
  ];

  const FALLBACK_REFERENCES = [
    {
      terms: ["발전기", "화력", "수력", "원자력", "연료", "터빈", "보일러", "수차", "양수", "태양광", "풍력", "ESS", "연료전지"],
      refs: [
        ["최신 발전공학.pdf", 209, "발전공학 관련 장"],
        ["최신 발전공학.pdf", 512, "신재생/저장 관련 장"]
      ]
    },
    {
      terms: ["송전", "배전", "변전", "계통", "전압", "전류", "케이블", "접지", "차단", "계전", "보호", "고장", "전력", "무효", "조류"],
      refs: [
        ["최신 송배전공학.pdf", 233, "송배전공학 관련 장"],
        ["최신 송배전공학.pdf", 456, "배전/변전 관련 장"]
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
    if (refs.length) {
      return refs;
    }

    const fallback = FALLBACK_REFERENCES.find((rule) => {
      return rule.terms.some((term) => haystack.includes(normalizeReferenceText(term)));
    });
    return fallback ? fallback.refs : [
      ["최신 송배전공학.pdf", 233, "송배전공학 공통 색인"],
      ["최신 발전공학.pdf", 209, "발전공학 공통 색인"]
    ];
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
