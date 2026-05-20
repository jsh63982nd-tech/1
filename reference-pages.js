(() => {
  const REFERENCE_MAP = [
    {
      book: "최신 송배전공학",
      chapter: "보호계전 및 보호협조",
      pages: "p.530-610",
      terms: ["보호계전", "계전기", "과전류", "거리계전", "차동계전", "보호협조", "CT", "PT", "OCR", "87", "51"]
    },
    {
      book: "최신 송배전공학",
      chapter: "가공송전선로",
      pages: "p.80-165",
      terms: ["가공송전", "송전선", "코로나", "철탑", "애자", "연가", "선로정수", "전선진동"]
    },
    {
      book: "최신 송배전공학",
      chapter: "지중송전 및 전력케이블",
      pages: "p.166-245",
      terms: ["지중", "케이블", "XLPE", "OF케이블", "시스", "VLF", "부분방전", "케이블진단"]
    },
    {
      book: "최신 송배전공학",
      chapter: "변전소 및 변압기",
      pages: "p.330-430",
      terms: ["변전소", "변압기", "단권변압기", "OLTC", "절연협조", "피뢰기", "모선", "GIS"]
    },
    {
      book: "최신 송배전공학",
      chapter: "배전계통",
      pages: "p.440-525",
      terms: ["배전", "22.9kV", "저압", "고압지중배전", "리클로저", "ALTS", "전압강하", "배전손실"]
    },
    {
      book: "최신 송배전공학",
      chapter: "접지 및 고장계산",
      pages: "p.250-330",
      terms: ["접지", "중성점", "지락", "고장전류", "단락", "대칭좌표", "불평형"]
    },
    {
      book: "최신 발전공학",
      chapter: "화력발전",
      pages: "p.170-310",
      terms: ["화력", "보일러", "증기터빈", "복합화력", "가스터빈", "절탄기", "공기예열기", "랭킨"]
    },
    {
      book: "최신 발전공학",
      chapter: "수력발전",
      pages: "p.55-135",
      terms: ["수력", "수차", "조압수조", "서징", "캐비테이션", "양수발전", "낙차"]
    },
    {
      book: "최신 발전공학",
      chapter: "원자력발전",
      pages: "p.315-430",
      terms: ["원자력", "원자로", "PWR", "BWR", "고속증식로", "반감기", "SMR"]
    },
    {
      book: "최신 발전공학",
      chapter: "신재생 및 에너지저장",
      pages: "p.500-620",
      terms: ["태양광", "풍력", "ESS", "신재생", "암모니아", "연료전지", "VPP", "재생에너지"]
    },
    {
      book: "전력계통공학",
      chapter: "전력조류 및 안정도",
      pages: "p.70-180",
      terms: ["조류", "전력조류", "안정도", "상차각", "전력편차", "동요방정식", "과도안정도"]
    },
    {
      book: "전력계통공학",
      chapter: "주파수 및 경제부하배분",
      pages: "p.190-250",
      terms: ["주파수", "AFC", "LFC", "ELD", "경제부하", "조속기", "Governor"]
    },
    {
      book: "전력계통공학",
      chapter: "전압/무효전력 및 유연송전",
      pages: "p.255-340",
      terms: ["무효전력", "전압무효", "VQC", "FACTS", "STATCOM", "SVC", "TCSC", "HVDC", "고조파"]
    },
    {
      book: "전력계통공학",
      chapter: "분산전원 계통연계",
      pages: "p.345-430",
      terms: ["분산전원", "계통연계", "FRT", "인버터", "단독운전", "역송", "마이크로그리드"]
    }
  ];

  function normalizeReferenceText(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/[()[\]{}<>「」『』"'.,:;!?·/_-]/g, "");
  }

  function getReferencePages(item) {
    const question = typeof formatDisplayQuestion === "function" ? formatDisplayQuestion(item.question) : item.question;
    const keywordText = typeof extractKeywords === "function" ? extractKeywords(question).join(" ") : "";
    const haystack = normalizeReferenceText(`${item.category} ${question} ${keywordText}`);

    return REFERENCE_MAP
      .map((reference) => {
        const score = reference.terms.reduce((sum, term) => {
          return sum + (haystack.includes(normalizeReferenceText(term)) ? 1 : 0);
        }, 0);
        return { ...reference, score };
      })
      .filter((reference) => reference.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 2);
  }

  function referenceMarkup(item) {
    const references = getReferencePages(item);
    const rows = references.length
      ? references
      : [{ book: "최신 송배전공학 / 최신 발전공학 / 전력계통공학", chapter: "문제 키워드로 단원 확인", pages: "목차 기준 확인 필요" }];

    return `
      <div class="aid-block">
        <strong>참조 교재/페이지</strong>
        <div class="aid-chips">
          ${rows.map((row) => `
            <span>${escapeHtml(row.book)} ${escapeHtml(row.pages)} · ${escapeHtml(row.chapter)}</span>
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
