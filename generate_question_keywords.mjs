import fs from "node:fs";

const CSV_PATH = "all_exam_questions.csv";
const OUT_PATH = "bundled-questions.js";
const REPORT_PATH = "keyword_report.csv";

const DETAILED_KEYWORDS = [
  "부유식해상풍력발전", "입축형수차발전기", "초전도한류기", "3고조파", "덕커브", "고장파급방지장치", "스포트네트워크",
  "전압조정방법", "고압케이블", "계기용변류기", "전력계통안정화장치", "해수염도차발전", "전류형초고압직류송전",
  "BacktoBack", "PointtoPoint", "전류실패", "고압차단기", "마이크로그리드", "SubSynchronousResonance",
  "절연레벨", "피뢰기제한전압", "스위치야드", "수차비속도", "X/RRatio", "중장기배전계획", "주접지망",
  "기계적보호장치", "자기유지시퀀스", "SoftStarter", "VVVF", "이상전압", "전력용변압기", "배전손실",
  "계통운영시스템", "조류계산", "상태추정", "안전도제약경제급전", "고장전류", "전압안정도", "과도안정도",
  "증분연료비", "추기복수식터빈", "추기배압식터빈", "가변속양수발전", "AMI", "BTM서비스", "부하응답모델",
  "직류조류계산", "저압뱅킹배전", "캐스케이딩", "전압강하율", "전압변동율", "전력손실율", "PenaltyFactor",
  "변압기효율", "오차", "정동작", "정부동작", "오동작", "오부동작", "페일세이프", "소호환", "소호각",
  "분산형전원계통연계", "변류기규격", "C200", "C100", "전류형HVDC", "전압형HVDC", "열병합발전",
  "복합사이클발전", "전력원선도", "집합계수", "바이패스소자", "블로킹소자", "한국형RE100", "균등화발전비용",
  "가공송전용연선", "연정", "연입률", "코로나발생", "자연순환보일러", "순환비", "핵융합", "핵분열",
  "해상전력망", "육상전력망", "거리계전방식", "분류효과", "배전용SVR", "계기용변류기", "전력케이블허용전류",
  "전력구종합감시시스템", "무구속속도", "LOLP", "송전전압결정", "TN-C-S접지", "배전선로손실",
  "ZIP모델", "SAIFI", "SAIDI", "SARFI", "THD", "TDD", "STATCOM", "SVC", "주파수제어방식",
  "SmallModularReactor", "수냉각SMR", "소듐냉각고속로SMR", "용융염료SMR", "Motoring", "감속재",
  "복소전력", "전기자반작용", "분산형전원재병입", "발전기용량산정", "주파수조정용ESS", "언더리치",
  "오버리치", "최대전력전달조건", "테브난등가회로", "단상변압기", "표유부하손", "유전율", "투자율",
  "뇌충격전압파", "트래킹", "유전체손", "유전체역률", "무효전력공급능력", "LVRT", "단락용량",
  "계통병입조건", "동기검정기", "갤러핑", "몰드변압기", "%임피던스", "%저항강하", "%리액턴스강하",
  "COS", "재폐로계전기", "양수발전소", "재생에너지출력제어", "STACIR/AW", "ACSR", "전력설비건설사업관리",
  "단절연", "직렬리액터", "분로리액터", "한류리액터", "소호리액터", "회전자권선층간단락", "육상풍력",
  "해상풍력", "주변압기", "3권선변압기", "MVDC", "인버터효율", "유로효율", "CEC효율", "증기터빈진동",
  "발전기진동", "모선종류", "총괄비용법", "한계비용법", "해저케이블고장점탐지", "변압기병렬운전조건",
  "이중모선", "변전소자동화", "양수발전효율", "직류조류", "AC법", "DC법", "LOLE", "전력손실",
  "동기발전기병렬운전", "관성모멘트", "발전기난조", "송전용량", "전력계통신뢰도", "배전계통계획",
  "발전제약", "송전제약", "비상상황", "선로정수", "절연협조", "피뢰기정격", "변위전류", "맥스웰방정식",
  "불량현수애자", "변압비측정", "최대전압변동률", "대칭좌표법", "영상임피던스", "ESS용량산정",
  "유도전동기자기여자", "전압구분", "전선식별", "토리첼리정리", "냉각재", "IGCC", "열적한계",
  "전압안정도한계", "과도안정도한계", "단권변압기", "분산전원전압변동", "암페어주회적분법칙",
  "수차발전기", "터빈발전기", "항력형풍차", "양력형풍차", "복합발전", "매설지선", "중성점잔류전압",
  "무부하손", "부하손", "유효접지", "비율차동계전기", "전압무효전력", "배선규격", "주파수조정용발전소",
  "철공진", "저주파진동", "풍력터빈", "FreeSnake", "Snake포설", "가공송전선부식", "배전선로분할",
  "3분할3연계", "단상전력", "역률측정", "단단법", "동요방정식", "전압불평형률", "개방사이클가스터빈",
  "밀폐사이클가스터빈", "실효저항", "리클로저", "수차캐비테이션", "PWR", "BWR", "속도조정률",
  "조속기프리운전", "TCSC", "순시전압변동", "암모니아혼소발전", "PulseRadar법", "지열발전",
  "계전기부담", "전력케이블손실", "Dy1", "Dy11", "원자력발전출력감발", "무부하시험", "단락시험",
  "TN계통", "TT계통", "저압배전선로", "중성선단선", "가상발전소", "공급예비력", "운영예비력",
  "첨두부하운전", "초전도선재", "고온초전도체", "저온초전도체", "랭킨사이클", "변압기냉각방식",
  "부하시탭절환장치", "OLTC시험", "차단기트립방식", "DCTripDevice", "ACTripDevice", "CTD트립방식",
  "3상단락", "선간단락", "고조파발생원인"
];

const GENERIC_FALLBACKS = [
  "HVDC", "MVDC", "STATCOM", "SVC", "ESS", "KEC", "SMR", "IGCC", "PSS", "CT", "PT", "COS",
  "SAIFI", "SAIDI", "LOLP", "LOLE", "THD", "TDD", "LVRT", "VPP", "EMS", "OLTC",
  "풍력발전", "태양광발전", "분산전원", "신재생발전", "변압기", "송전선로", "배전계통", "발전기",
  "접지", "고조파", "전압강하", "무효전력", "역률", "케이블", "차단기", "계전기", "전력조류",
  "원자력발전", "화력발전", "양수발전", "수력발전", "전력품질", "주파수", "신뢰도"
];

const STOP_PATTERNS = [
  /에대하여.*$/u,
  /에대한.*$/u,
  /을설명하시오.*$/u,
  /를설명하시오.*$/u,
  /설명하시오.*$/u,
  /구하시오.*$/u,
  /비교하여설명하시오.*$/u,
  /비교하시오.*$/u,
  /쓰시오.*$/u,
  /나열하고.*$/u,
  /열거하고.*$/u
];

const STOPWORDS = new Set([
  "다음", "아래", "각각", "대하여", "설명", "설명하시오", "구하시오", "비교", "비교하여", "항목", "사항",
  "경우", "종류", "특징", "방법", "원리", "목적", "대책", "정의", "계산", "기준", "구성", "장점", "단점",
  "장단점", "영향", "관계", "그림", "문제점", "적용", "고려사항", "시스템", "설비", "기기", "회로",
  "형식", "분류", "설치", "위치", "최근", "국내", "우리나라", "사용", "이용", "필요성"
]);

const BAD_COMPOUND_PARTS = [
  "아래", "그림", "같은", "위한", "사용", "설치", "에따른", "에서", "으로", "있는", "하는", "된다",
  "나타내", "구하기", "권선등가회로", "계통에", "전력계통에", "발전기의", "변압기의", "송전선로의"
];

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  const input = text.replace(/^\uFEFF/, "");

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    const next = input[index + 1];
    if (char === '"' && quoted && next === '"') {
      cell += '"';
      index += 1;
      continue;
    }
    if (char === '"') {
      quoted = !quoted;
      continue;
    }
    if (char === "," && !quoted) {
      row.push(cell);
      cell = "";
      continue;
    }
    if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(cell);
      if (row.some(Boolean)) rows.push(row);
      row = [];
      cell = "";
      continue;
    }
    cell += char;
  }
  row.push(cell);
  if (row.some(Boolean)) rows.push(row);
  return rows;
}

function norm(value) {
  return String(value || "")
    .replace(/\s/g, "")
    .replace(/[(){}\[\]「」『』“”"']/g, "")
    .toLowerCase();
}

function removeInstruction(question) {
  let text = norm(question)
    .replace(/※.*/u, "")
    .replace(/단,.*/u, "")
    .replace(/[.,:;!?·]/g, "");
  for (const pattern of STOP_PATTERNS) {
    text = text.replace(pattern, "");
  }
  return text;
}

function normalizeKeyword(keyword) {
  const aliases = new Map([
    ["부유식해상풍력발전", "부유식해상풍력발전"],
    ["해상풍력", "해상풍력발전"],
    ["석탄가스화발전", "IGCC"],
    ["석탄가스화복합발전", "IGCC"],
    ["전류형초고압직류송전", "전류형HVDC"],
    ["초고압직류송전", "HVDC"],
    ["전류형hvdc", "전류형HVDC"],
    ["전압형hvdc", "전압형HVDC"],
    ["소형모듈원자로", "SMR"],
    ["smallmodularreactor", "SMR"],
    ["sps", "고장파급방지장치"],
    ["spotsystem", "스포트네트워크"],
    ["spotnetworksystem", "스포트네트워크"],
    ["subsynchrounousresonance", "SSR"],
    ["subsynchronousresonance", "SSR"],
    ["surgeabsorber", "서지흡수기"],
    ["levelizedcostofenergy", "균등화발전비용"],
    ["duckcurve", "덕커브"],
    ["currenttransformer", "계기용변류기"],
    ["powersystemstabilizer", "PSS"],
    ["staticcompensator", "STATCOM"]
  ]);
  const compactKeyword = norm(keyword);
  return aliases.get(compactKeyword) || keyword;
}

function chooseKeyword(question) {
  const compactQuestion = removeInstruction(question);
  const special = chooseSpecialKeyword(compactQuestion);
  if (special) return normalizeKeyword(special);

  const detailed = [...DETAILED_KEYWORDS].sort((a, b) => norm(b).length - norm(a).length);
  for (const keyword of detailed) {
    if (compactQuestion.includes(norm(keyword))) {
      return normalizeKeyword(keyword);
    }
  }
  for (const keyword of GENERIC_FALLBACKS.sort((a, b) => norm(b).length - norm(a).length)) {
    if (compactQuestion.includes(norm(keyword))) {
      return normalizeKeyword(keyword);
    }
  }

  const candidates = compactQuestion
    .split(/(?:에서|으로|로|의|을|를|와|과|및|중|시|별|별로|하고|하며|대한|대하여)/u)
    .map((part) => part.replace(/^[0-9]+/g, "").trim())
    .filter((part) => part.length >= 3 && !STOPWORDS.has(part) && !isNoiseCandidate(part));

  if (candidates.length) {
    candidates.sort((a, b) => scoreCandidate(b) - scoreCandidate(a));
    return normalizeKeyword(candidates[0].slice(0, 18));
  }

  return "기타";
}

function chooseSpecialKeyword(compactQuestion) {
  const directRules = [
    [/과전류보호계전기.*협조시간|보호계전기상호간의협조|시간협조항목/u, "과전류보호계전기협조"],
    [/22\.?9kv.*(?:cable|케이블)|배전용.*22\.?9kv.*cable/u, "22.9kV케이블"],
    [/발전기자기부하제어/u, "발전기자기부하제어"],
    [/전동기.*절체/u, "전동기절체"],
    [/터빈발전기.*동기가불일치|동기투입조건|비동기투입/u, "발전기동기투입"],
    [/변압기.*여자돌입전류|여자돌입전류/u, "변압기여자돌입전류"],
    [/알루미늄.*권선.*변압기/u, "알루미늄권선변압기"],
    [/동작협조곡선/u, "보호계전기동작협조곡선"],
    [/자동.*재폐로.*차단기|recloser/u, "리클로저"],
    [/발전기.*보호장치.*연료전지/u, "발전기보호장치"],
    [/돌발3상단락전류|단락전류와리액턴스/u, "발전기단락전류"],
    [/유도장해.*차폐|차폐계수/u, "유도장해차폐"],
    [/유도장해/u, "유도장해"],
    [/변전소.*접지.*중요접지/u, "변전소접지"],
    [/대칭정전계|전기력선밀도/u, "가우스법칙"],
    [/2중모선|doublebus|모선연락용/u, "이중모선절체"],
    [/발전기.*지락전류|b상이지락/u, "발전기지락전류"],
    [/전력계통.*한류기|currentlimitter/u, "한류기"],
    [/3권선변압기.*비율차동계전기/u, "3권선변압기차동보호"],
    [/화력발전소.*단독운전/u, "화력발전소단독운전"],
    [/50hz.*60hz.*동기발전기/u, "동기발전기주파수운전"],
    [/송전선로.*인덕턴스|인덕턴스종류/u, "송전선로인덕턴스"],
    [/증분연료비|연료비특성|경제부하배분/u, "경제부하배분"],
    [/영상.*정상.*역상.*리액턴스/u, "대칭분리액턴스"],
    [/특성임피던스.*케이블|반사되는전압|전달되는전압/u, "케이블반사파"],
    [/154kv.*표준절연간격|최소절연간격/u, "가공송전선로절연간격"],
    [/pmu|위상측정장치/u, "PMU"],
    [/콘덴서.*개폐/u, "콘덴서개폐"],
    [/애자.*염진해/u, "애자염진해"],
    [/계기용변압기.*결선방식|계기용변압기.*용도/u, "계기용변압기"],
    [/단상변압기.*병렬운전|두대의단상변압기|인두대의단상변압기/u, "단상변압기병렬운전"],
    [/4단자정수.*합성|합성4단자정수/u, "4단자정수"],
    [/원통형동기발전기.*벡터도|전기자저항.*출력식/u, "원통형동기발전기"],
    [/무정전공법/u, "배전선로무정전공법"],
    [/동심원통.*코로나|코로나발생/u, "코로나발생"],
    [/고압케이블.*도체단면적|단락전류.*고압케이블/u, "고압케이블단면적"],
    [/고압차단기.*소호매질/u, "고압차단기"],
    [/selfholding|자기유지/u, "자기유지시퀀스"],
    [/y행렬.*축약|등가y/u, "Y행렬축약"],
    [/중첩의원리/u, "중첩의원리"],
    [/2기모델계통.*손실방정식/u, "손실방정식"],
    [/f점/u, "고장전류계산"],
    [/철심포화.*공진/u, "철공진"],
    [/변압기.*tap.*비율차동|변압기명판.*비율차동/u, "변압기비율차동보호"],
    [/22\.?9kv.*회선.*운전용량/u, "22.9kV배전선로"],
    [/속도조정율|조속기프리운전/u, "속도조정률"],
    [/iec61850.*디지털변전소/u, "디지털변전소"],
    [/예비전원설비.*발전기.*용량산정|발전기.*용량산정/u, "발전기용량산정"],
    [/345kv이상전력용변압기/u, "전력용변압기"],
    [/권선등가회로.*2권선등가회로/u, "3권선변압기등가회로"],
    [/차단기.*정격.*비대칭계수/u, "차단기정격"],
    [/직렬리액터.*분로.*한류.*소호/u, "리액터종류"],
    [/전력계통혁신방안/u, "전력계통혁신방안"],
    [/발전기.*기술규격|계통병입/u, "발전기계통병입조건"],
    [/차단기투입.*개폐서지|switchingsurge/u, "개폐서지"],
    [/배전선로.*보호협조|보호협조방법/u, "배전선로보호협조"],
    [/22\.?9kv.*전압강하|배전선로.*전압강하/u, "배전선로전압강하"],
    [/슈퍼커패시터|슈퍼커패/u, "슈퍼커패시터"],
    [/ngr|neutralgroundreactor/u, "중성점접지리액터"],
    [/절연열화.*진단/u, "지중배전케이블진단"],
    [/60hz기기.*50hz|50hz에서운전/u, "주파수변경운전"],
    [/전력용3권선변압기.*y-y-△|송변전계통.*3권선변압기/u, "3권선변압기결선"],
    [/gis.*sf6|가스절연개폐장치/u, "GIS"],
    [/변압기.*내부고장.*비율차동/u, "변압기비율차동보호"],
    [/전력망건설.*회피|그리드기술/u, "전력망건설회피기술"],
    [/가능출력곡선|capabilitycurve/u, "발전기출력가능곡선"],
    [/1선지락.*2선지락.*3상단락.*안정도/u, "고장종류별안정도"],
    [/dy1.*dy|각변위/u, "변압기각변위"],
    [/중성선단선/u, "중성선단선"],
    [/ct.*위치.*보호계전방식|보호계전기용ct/u, "보호계전기용CT"],
    [/모선구성방식|모선구성/u, "모선구성방식"],
    [/전력계통운영보조서비스|ancilla|ancillary/u, "보조서비스"],
    [/부유식.*해상풍력발전/u, "부유식해상풍력발전"],
    [/석탄가스화/u, "IGCC"],
    [/육상풍력.*해상풍력/u, "육상풍력·해상풍력"],
    [/3고조파/u, "3고조파"],
    [/고조파.*역률/u, "고조파와역률"],
    [/고조파.*변압기|변압기.*고조파/u, "변압기고조파"],
    [/고조파.*발생/u, "고조파발생원인"],
    [/계통접지/u, "계통접지"],
    [/중성점.*접지/u, "중성점접지"],
    [/접지.*저항/u, "접지저항"],
    [/접지망/u, "주접지망"],
    [/전압.*무효전력/u, "전압무효전력"],
    [/전압.*불평형/u, "전압불평형률"],
    [/순시전압.*유지성능/u, "LVRT"],
    [/순시전압변동/u, "순시전압변동"],
    [/전압강하.*보상/u, "전압조정방법"],
    [/전압강하율|전압변동율|전력손실율/u, "전압강하율·전압변동율·전력손실율"],
    [/전압변동률/u, "전압변동률"],
    [/송전용량/u, "송전용량"],
    [/단락용량/u, "단락용량"],
    [/고장전류/u, "고장전류"],
    [/전력조류|조류계산/u, "전력조류계산"],
    [/직류조류/u, "직류조류"],
    [/상태추정/u, "상태추정"],
    [/경제급전/u, "경제급전"],
    [/전력시장/u, "전력시장운영"],
    [/전력계통.*신뢰도|공급신뢰도/u, "전력계통신뢰도"],
    [/전력계통.*주파수/u, "전력계통주파수"],
    [/공급예비력|운영예비력/u, "예비력"],
    [/주파수.*제어/u, "주파수제어"],
    [/속도조정률|속도변동율/u, "속도조정률"],
    [/무부하손.*부하손/u, "변압기손실"],
    [/철손.*동손/u, "변압기손실"],
    [/냉각방식/u, "변압기냉각방식"],
    [/병렬운전조건/u, "변압기병렬운전조건"],
    [/비상발전기/u, "비상발전기"],
    [/허용전류/u, "케이블허용전류"],
    [/고장점탐지/u, "고장점탐지"],
    [/아크플래시|arcflash/u, "아크플래시"],
    [/피뢰기/u, "피뢰기"],
    [/서지흡수기/u, "서지흡수기"],
    [/절연레벨/u, "절연레벨"],
    [/절연협조/u, "절연협조"],
    [/유전율.*투자율/u, "유전율·투자율"],
    [/맥스웰/u, "맥스웰방정식"],
    [/토리첼리/u, "토리첼리정리"],
    [/캐비테이션/u, "캐비테이션"],
    [/비속도|특유속도/u, "수차비속도"],
    [/무구속속도/u, "무구속속도"],
    [/감속재.*냉각재/u, "감속재·냉각재"],
    [/감속재/u, "감속재"],
    [/냉각재/u, "냉각재"],
    [/핵융합.*핵분열/u, "핵융합·핵분열"],
    [/원자력.*출력감발/u, "원자력출력감발"],
    [/가스터빈.*발전/u, "가스터빈발전"],
    [/증기터빈/u, "증기터빈"],
    [/랭킨사이클/u, "랭킨사이클"],
    [/복합사이클|복합발전/u, "복합발전"],
    [/열효율/u, "열효율"],
    [/양수발전효율/u, "양수발전효율"],
    [/가변속양수발전/u, "가변속양수발전"],
    [/재생에너지.*출력제어/u, "재생에너지출력제어"],
    [/분산형전원.*재병입/u, "분산전원재병입"],
    [/분산형전원|분산전원/u, "분산전원"],
    [/229kv.*배전/u, "22.9kV배전선로"],
    [/마이크로그리드/u, "마이크로그리드"],
    [/가상발전소|vpp/u, "가상발전소"],
    [/덕커브/u, "덕커브"],
    [/태양광.*인버터/u, "태양광인버터효율"],
    [/태양광/u, "태양광발전"],
    [/해상풍력/u, "해상풍력발전"],
    [/풍력터빈/u, "풍력터빈"],
    [/풍력발전/u, "풍력발전"],
    [/hvdc/u, "HVDC"],
    [/mvdc/u, "MVDC"],
    [/statcom/u, "STATCOM"],
    [/svc/u, "SVC"],
    [/ess/u, "ESS"],
    [/smr/u, "SMR"],
    [/kec|한국전기설비규정/u, "KEC"]
  ];

  for (const [pattern, keyword] of directRules) {
    if (pattern.test(compactQuestion)) return keyword;
  }

  const compoundPatterns = [
    /([가-힣A-Za-z0-9·-]{2,}수차발전기)/u,
    /([가-힣A-Za-z0-9·-]{2,}동기발전기)/u,
    /([가-힣A-Za-z0-9·-]{2,}유도전동기)/u,
    /([가-힣A-Za-z0-9·-]{2,}발전기)/u,
    /([가-힣A-Za-z0-9·-]{2,}변압기)/u,
    /([가-힣A-Za-z0-9·-]{2,}계전기)/u,
    /([가-힣A-Za-z0-9·-]{2,}차단기)/u,
    /([가-힣A-Za-z0-9·-]{2,}케이블)/u,
    /([가-힣A-Za-z0-9·-]{2,}배전방식)/u,
    /([가-힣A-Za-z0-9·-]{2,}배전선로)/u,
    /([가-힣A-Za-z0-9·-]{2,}송전선로)/u,
    /([가-힣A-Za-z0-9·-]{2,}리액터)/u,
    /([가-힣A-Za-z0-9·-]{2,}접지)/u
  ];

  for (const pattern of compoundPatterns) {
    const match = compactQuestion.match(pattern);
    if (match?.[1]) {
      const candidate = trimKeyword(match[1]);
      if (!STOPWORDS.has(candidate) && !isBadCompoundKeyword(candidate)) {
        return candidate;
      }
    }
  }

  return "";
}

function trimKeyword(keyword) {
  return keyword
    .replace(/^다음/u, "")
    .replace(/^최근/u, "")
    .replace(/^국내/u, "")
    .replace(/^우리나라/u, "")
    .slice(0, 18);
}

function isBadCompoundKeyword(value) {
  return value.length > 14
    || BAD_COMPOUND_PARTS.some((part) => value.includes(part))
    || /^[0-9/%.]/u.test(value)
    || /(의|을|를|과|와|가|은|는)$/u.test(value);
}

function scoreCandidate(value) {
  let score = Math.min(value.length, 20);
  for (const token of ["발전", "변압기", "송전", "배전", "전압", "전류", "접지", "케이블", "계전", "차단", "안정도", "고조파"]) {
    if (value.includes(token)) score += 10;
  }
  for (const stop of STOPWORDS) {
    if (value.includes(stop)) score -= 8;
  }
  return score;
}

function isNoiseCandidate(value) {
  return /^(있는|하는|따른|위한|사용|적용|최근|국내|아래|다음|각|각각)/u.test(value)
    || /(설명하시오|구하시오|나타내는|분류하고|비교하여)$/u.test(value);
}

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

const table = parseCsv(fs.readFileSync(CSV_PATH, "utf8"));
const [headers, ...dataRows] = table;
const [hRound, hPeriod, hCategory, hNumber, hQuestion] = headers;
const rows = dataRows.map((row) => {
  const record = Object.fromEntries(headers.map((header, index) => [header, row[index] || ""]));
  const round = record[hRound];
  const period = record[hPeriod];
  const number = record[hNumber];
  return {
    id: `q-${round.replace("회", "")}-${period.replace("교시", "")}-${number}`,
    round: `${round} ${period}`,
    category: record[hCategory] || "발송배전",
    keyword: chooseKeyword(record[hQuestion]),
    question: record[hQuestion],
    status: "unseen",
    starred: false,
    memo: "",
    reviews: []
  };
});

fs.writeFileSync(
  OUT_PATH,
  `window.BUNDLED_QUESTIONS = ${JSON.stringify(rows, null, 2)};\n`,
  "utf8"
);

const counts = new Map();
for (const row of rows) counts.set(row.keyword, (counts.get(row.keyword) || 0) + 1);
const report = [["키워드", "출제횟수"], ...[...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "ko"))];
fs.writeFileSync(REPORT_PATH, report.map((row) => row.map(csvEscape).join(",")).join("\n"), "utf8");

console.log(`wrote ${rows.length} questions, ${counts.size} keywords`);
