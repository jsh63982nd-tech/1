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
    ["k g!m", "kg/m"],
    ["WoodPellet", "Wood Pellet"],
    ["Governorfree", "Governor free"],
    ["Digital", "Digital"],
    ["Analog", "Analog"]
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
    [/([가-힣])에(?=(대하여|관하여|따른|설치|사용|적용|연결|접속|미치는))/g, "$1에 "],
    [/([가-힣])와(?=(화력|수력|원자력|풍력|태양광|UPS|ESS|송전|배전|변전|발전|계통|전압|전류|전력|보호|고장|단락|차단|변압|케이블|콘덴서|터빈|수차|보일러|피뢰|접지|주파수|경제|무효|유효|전기|기계|설비|방식|특징|문제점|대책))/g, "$1와 "],
    [/([가-힣])과(?=(화력|수력|원자력|풍력|태양광|UPS|ESS|송전|배전|변전|발전|계통|전압|전류|전력|보호|고장|단락|차단|변압|케이블|콘덴서|터빈|수차|보일러|피뢰|접지|주파수|경제|무효|유효|전기|기계|설비|방식|특징|문제점|대책))/g, "$1과 "],
    [/([가-힣])의(?=(구조|형태|특징|기능|종류|역할|목적|용량|사양|차이점|문제점|대책|영향|관계|수식|동작|개요|원리|조건|항목|기준|절차|방법|설계|운영|운전|보호|계산|해석|적용|발생|구성|특성|정정|협조|접속|분리|제어|출력|부하|전압|전류|전력|주파수|리액턴스))/g, "$1의 "],
    [/([가-힣])에(?=(설치|사용|적용|연결|접속|보인|나타|미치|대한|대해|대하여|관한|관하여|따른|의한|있어|있어서|필요|포함|의해|비해|따라|발생|소요|속한))/g, "$1에 "],
    [/([가-힣])에서(?=(조압|주파수|수전|송전|배전|발전|변전|계통|선로|차단|보호|전압|전류|전력|고장|단락|사용|발생|나타|검토|정하는|설명|계산|운전|적용))/g, "$1에서 "],
    [/([가-힣])시(?=(검토|고려|발생|보호|운전|조작|사용|적용|설치|접속|정정|계산|측정|선정|설계|주의|유의|공사|사고|전압|전류|계통))/g, "$1 시 "],
    [/([가-힣])및(?=[가-힣A-Za-z0-9])/g, "$1 및 "],
    [/([가-힣])등(?=(의|을|를|에서|에|으로|과|이|은|는|을|를| 보호| 설비| 기기| 장치| 방식| 특성| 기준))/g, "$1 등"],
    [/(\\d)(기|가지|배|상|선|차측|차|점|회|개)(?=[가-힣])/g, "$1$2 "],
    [/([가-힣])([A-Z][a-z]+\\s?(?:계전기|계전|기기|방식))/g, "$1 $2"]
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

    const compoundDisplays = new Map([
      ["22.9kV Cable에서 CN/CV, CNCV-W, FRCNCO-W, TRCNCV-W 의구조", "22.9kV Cable에서 CN/CV, CNCV-W, FRCNCO-W, TRCNCV-W의 구조"],
      ["수차발전기와화력용터빈발전기", "수차발전기와 화력용 터빈발전기"],
      ["대용량발전기", "대용량 발전기"],
      ["대용량화력", "대용량 화력"],
      ["발전기자기부하제어", "발전기 자기부하제어"],
      ["기본 신뢰도지수", "기본 신뢰도 지수"],
      ["대용량산업 플랜트", "대용량 산업 플랜트"],
      ["전동기M", "전동기 M"],
      ["전동기절체방법", "전동기 절체방법"],
      ["다분기모선", "다분기 모선"],
      ["점사고시", "점 사고 시"],
      ["모선보호용", "모선 보호용"],
      ["신규로계통", "신규로 계통"],
      ["터빈발전기", "터빈 발전기"],
      ["동기가불일치할때", "동기가 불일치할 때"],
      ["발생할수있는손상", "발생할 수 있는 손상"],
      ["이손상", "이 손상"],
      ["투입될경우동기조건별로각각", "투입될 경우 동기조건별로 각각"],
      ["가스터빈발전기", "가스터빈 발전기"],
      ["스팀터빈발전기", "스팀터빈 발전기"],
      ["구성된복합화력발전소", "구성된 복합화력발전소"],
      ["주단선도", "주단선도"],
      ["주요기기", "주요 기기"],
      ["발전기전압", "발전기 전압"],
      ["발전기역률", "발전기 역률"],
      ["정지형여자기", "정지형 여자기"],
      ["전동기전압", "전동기 전압"],
      ["송전전압", "송전 전압"],
      ["수력발전소에서조압수조", "수력발전소에서 조압수조"],
      ["조압수조(Surge tank) 의기능", "조압수조(Surge tank)의 기능"],
      ["기능과서징작용", "기능과 서징작용"],
      ["조압수조의 종류와특징", "조압수조의 종류와 특징"],
      ["전력계통에서주파수제어", "전력계통에서 주파수제어"],
      ["주파수제어(AFC) 와경제부하배분", "주파수제어(AFC)와 경제부하배분"],
      ["경제부하배분(ELD) 과의협조제어방식", "경제부하배분(ELD)과의 협조제어방식"],
      ["변압기1 차측", "변압기 1차측"],
      ["과전류계전기정정시", "과전류계전기 정정 시"],
      ["계전기에서정한시", "계전기에서 정한시"],
      ["메커니즘(Mechanism) 및발생 원인", "메커니즘(Mechanism) 및 발생 원인"],
      ["다기계통을 해석할경우상차각", "다기계통을 해석할 경우 상차각"],
      ["전력 편차를이용한안정도", "전력 편차를 이용한 안정도"],
      ["화력발전소에서급수순환방법에의 한보일러", "화력발전소에서 급수순환방법에 의한 보일러"],
      ["자동부하전환개폐기", "자동부하전환개폐기"],
      ["설치시유의 사항", "설치 시 유의사항"],
      ["설계시검토", "설계 시 검토"],
      ["단락비관계", "단락비 관계"],
      ["제작상고려사항", "제작상 고려사항"],
      ["선로정수L 과C", "선로정수 L과 C"],
      ["제어에이용되는", "제어에 이용되는"],
      ["주요기기의 종류와그역할", "주요 기기의 종류와 그 역할"],
      ["낙차가작은수력발전소", "낙차가 작은 수력발전소"],
      ["직결하여사용하는", "직결하여 사용하는"],
      ["유도발전기의장ㆍ단점", "유도발전기의 장ㆍ단점"],
      ["전력계통의부하모선", "전력계통의 부하모선"],
      ["전압변동이그모선", "전압변동이 그 모선"],
      ["부하응답 모델의소비전력", "부하응답 모델의 소비전력"],
      ["시스템구성설비중다음", "시스템 구성설비 중 다음"],
      ["설계시주의 사항", "설계 시 주의사항"],
      ["발생되는고조파가각종기기", "발생되는 고조파가 각종 기기"],
      ["분산전원을연계할경우배전계통", "분산전원을 연계할 경우 배전계통"],
      ["문제점및대책", "문제점 및 대책"],
      ["그림과같이", "그림과 같이"],
      ["발전소내에정격", "발전소 내에 정격"],
      ["차단기가 사용되고있다", "차단기가 사용되고 있다"],
      ["인접한변전소", "인접한 변전소"],
      ["연계해서운전", "연계해서 운전"],
      ["연계선의한류리액터", "연계선의 한류리액터"],
      ["10%여유", "10% 여유"]
    ]);

    termDisplays.forEach((display, term) => {
      text = text.replaceAll(term, display);
    });
    compoundDisplays.forEach((display, term) => {
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
      .replace(/\s+(의|와|과|에|에서|으로|로|을|를|이|가|은|는)(?=(구조|형태|특징|기능|종류|역할|목적|용량|사양|차이점|문제점|대책|영향|관계|수식|동작|개요|원리|조건|항목|기준|절차|방법|설계|운영|운전|보호|계산|해석|적용|발생|구성|특성|정정|협조|접속|분리|제어|출력|부하|전압|전류|전력|주파수|리액턴스))/g, "$1 ")
      .replace(/\s+(와|과)(?=(화력|수력|원자력|풍력|태양광|UPS|ESS|송전|배전|변전|발전|계통|전압|전류|전력|보호|고장|단락|차단|변압|케이블|콘덴서|터빈|수차|보일러|피뢰|접지|주파수|경제|무효|유효|전기|기계|설비|방식|특징|문제점|대책))/g, "$1 ")
      .replace(/(\d+(?:\.\d+)?)kV\s*급/g, "$1kV급")
      .replace(/(\d+)\s*차측/g, "$1차측")
      .replace(/(\d+)\s*상/g, "$1상")
      .replace(/(\d+)\s*선/g, "$1선")
      .replace(/([A-Z])\s+#/g, "$1#")
      .replace(/과 전류/g, "과전류")
      .replace(/한시과전류/g, "한시 과전류")
      .replace(/과 전압/g, "과전압")
      .replace(/과 도/g, "과도")
      .replace(/화력용터빈 발전기/g, "화력용 터빈발전기")
      .replace(/전력 시스템의기본/g, "전력 시스템의 기본")
      .replace(/지중배전계통구성/g, "지중배전계통 구성")
      .replace(/자기부하제어특성/g, "자기부하제어 특성")
      .replace(/그림은대용량/g, "그림은 대용량")
      .replace(/플랜트시스템/g, "플랜트 시스템")
      .replace(/유지보수시/g, "유지보수 시")
      .replace(/공급을위한/g, "공급을 위한")
      .replace(/절체방법(\d+)/g, "절체방법 $1")
      .replace(/(\d+)\s+가지/g, "$1가지")
      .replace(/그림의다분기/g, "그림의 다분기")
      .replace(/모선의F/g, "모선의 F")
      .replace(/보호용비율/g, "보호용 비율")
      .replace(/연결할터빈/g, "연결할 터빈")
      .replace(/발전기의동기/g, "발전기의 동기")
      .replace(/\)(?=(\d+)\))/g, ") ")
      .replace(/\)(?=[가-힣A-Za-z0-9])/g, ") ")
      .replace(/\((\d+)\)\s*/g, "($1) ")
      .replace(/\)\s+(의|와|과|에|에서|으로|로|을|를|이|가|은|는)/g, ")$1")
      .replace(/\((\d+)\)(?=[가-힣])/g, "($1) ")
      .replace(/MW(\d+)기/g, "MW $1기")
      .replace(/kV(\d+)기/g, "kV $1기")
      .replace(/(\d+)MW(\d+) 기/g, "$1MW $2기")
      .replace(/(\d+)MW(\d+)기/g, "$1MW $2기")
      .replace(/(\d+)kVA\s*와(\d+)kVA/g, "$1kVA와 $2kVA")
      .replace(/(\d+)kVA\s*를/g, "$1kVA를")
      .replace(/(\d+)MVA\s*의/g, "$1MVA의")
      .replace(/구성된 복합화력발전소의주단선도/g, "구성된 복합화력발전소의 주단선도")
      .replace(/발전기(\d+MW)/g, "발전기 $1")
      .replace(/(\d+)기로구성/g, "$1기로 구성")
      .replace(/사유와주요/g, "사유와 주요")
      .replace(/전압(\d+(?:\.\d+)?kV)/g, "전압 $1")
      .replace(/역률(\d+%)/g, "역률 $1")
      .replace(/여자기사용/g, "여자기 사용")
      .replace(/및조압수조/g, "및 조압수조")
      .replace(/과의 협조제어방식/g, "과의 협조제어방식")
      .replace(/변압기 1차측과전류계전기/g, "변압기 1차측 과전류계전기")
      .replace(/계전기정정시/g, "계전기 정정 시")
      .replace(/고려한Digital/g, "고려한 Digital")
      .replace(/계전기와Analog/g, "계전기와 Analog")
      .replace(/계전기에서정한시/g, "계전기에서 정한시")
      .replace(/에서정한시/g, "에서 정한시")
      .replace(/정한 시/g, "정한시")
      .replace(/정정차이점/g, "정정 차이점")
      .replace(/여자돌입전류메커니즘/g, "여자돌입전류 메커니즘")
      .replace(/대용량유연탄화력발전소를신규로건설하고자한다/g, "대용량 유연탄 화력발전소를 신규로 건설하고자 한다")
      .replace(/타당성조사역무/g, "타당성조사 역무")
      .replace(/내용을작업/g, "내용을 작업")
      .replace(/대로설명/g, "대로 설명")
      .replace(/우리나라의장기/g, "우리나라의 장기")
      .replace(/운영계획을수립하기위한/g, "운영계획을 수립하기 위한")
      .replace(/신뢰도 및 품질유지를위하여/g, "신뢰도 및 품질 유지를 위하여")
      .replace(/검토해야할주요역무/g, "검토해야 할 주요 역무")
      .replace(/이상을 열거하고설명/g, "이상을 열거하고 설명")
      .replace(/장기전력계통운영계획/g, "장기 전력계통 운영계획")
      .replace(/일환으로전력계통신뢰도/g, "일환으로 전력계통 신뢰도")
      .replace(/위하여검토해야/g, "위하여 검토해야")
      .replace(/주요 역무(\d+)가지이상/g, "주요 역무 $1가지 이상")
      .replace(/보일러종류/g, "보일러 종류")
      .replace(/유의 사항/g, "유의사항")
      .replace(/대용량발전소/g, "대용량 발전소")
      .replace(/단락비를크게하기위한/g, "단락비를 크게 하기 위한")
      .replace(/단락비를크게할경우계통특성/g, "단락비를 크게 할 경우 계통특성")
      .replace(/목적을선로정수/g, "목적을 선로정수")
      .replace(/사용하여설명/g, "사용하여 설명")
      .replace(/이용되는주요/g, "이용되는 주요")
      .replace(/종류와그역할/g, "종류와 그 역할")
      .replace(/수력발전소에서원통형/g, "수력발전소에서 원통형")
      .replace(/수차와직결/g, "수차와 직결")
      .replace(/접속된부하/g, "접속된 부하")
      .replace(/문제점및/g, "문제점 및")
      .replace(/발전소G/g, "발전소 G")
      .replace(/발전소 G 는(\d+)kVA와 (\d+)kVA를갖는/g, "발전소 G는 $1kVA와 $2kVA를 갖는")
      .replace(/발전소로서발전소/g, "발전소로서 발전소")
      .replace(/있다\.이/g, "있다. 이")
      .replace(/주변압기를갖는인접한/g, "주변압기를 갖는 인접한")
      .replace(/변전소S/g, "변전소 S")
      .replace(/연계해서 운전하고자할경우/g, "연계해서 운전하고자 할 경우")
      .replace(/발전기의차단기는절체하지않고/g, "발전기의 차단기는 절체하지 않고")
      .replace(/한류리액터X/g, "한류리액터 X")
      .replace(/여유를둘경우/g, "여유를 둘 경우")
      .replace(/리액턴스X/g, "리액턴스 X")
      .replace(/정격차단용량(\d+MVA)의차단기/g, "정격 차단용량 $1의 차단기")
      .replace(/이 발전소를(\d+)kVA 의주변압기/g, "이 발전소를 $1kVA의 주변압기")
      .replace(/변전소 S 와연계해서/g, "변전소 S와 연계해서")
      .replace(/경우발전기/g, "경우 발전기")
      .replace(/않고연계선/g, "않고 연계선")
      .replace(/X 를삽입/g, "X를 삽입")
      .replace(/하려고한다/g, "하려고 한다")
      .replace(/고려하여10%/g, "고려하여 10%")
      .replace(/(\d+)kVA 의/g, "$1kVA의")
      .replace(/([A-Z]) 를/g, "$1를")
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
