const STORAGE = {
  language: "sumimap:language",
  saved: "sumimap:saved",
  recent: "sumimap:recent"
};

const GITHUB_ISSUES = "https://github.com/wlstj86231-cloud/sumimap/issues";
const CHECKED_AT = "2026-08-14";

const sources = {
  tokyo: {
    authority: "東京都デジタルサービス局",
    title: "Tokyo Map（都公式地図）",
    url: "https://www.digitalservice.metro.tokyo.lg.jp/business/data-utilization/tokyomap",
    note: "車いす使用者対応トイレ와 TOKYO FREE Wi-Fi 등 도쿄도 보유 지도를 함께 확인할 수 있습니다."
  },
  osaka: {
    authority: "大阪市環境局",
    title: "大阪市内の公衆トイレ",
    url: "https://www.city.osaka.lg.jp/kankyo/page/0000369340.html",
    note: "오사카시가 관리하는 공중화장실 목록과 공식 지도 연결을 제공합니다."
  },
  kyoto: {
    authority: "京都市環境政策局",
    title: "京都市内の公衆トイレ",
    url: "https://www.city.kyoto.lg.jp/kankyo/page/0000330061.html",
    note: "교토시 공중화장실 위치와 이용 시 주의사항을 확인할 수 있습니다."
  },
  fukuoka: {
    authority: "福岡市",
    title: "福岡市Webまっぷ",
    url: "https://webmap.city.fukuoka.lg.jp/fukuoka/Map?mid=16",
    note: "후쿠오카시가 제공하는 시설 지도를 열어 현재 위치와 이용 조건을 다시 확인합니다."
  },
  sapporo: {
    authority: "札幌市",
    title: "札幌市バリアフリーマップ",
    url: "https://www.city.sapporo.jp/fukushi/barrierfree/index.html",
    note: "삿포로시의 배리어프리 시설 정보와 겨울철 이용 조건을 확인하는 출발점입니다."
  },
  nagoya: {
    authority: "名古屋市",
    title: "なごやバリアフリーお出かけナビ",
    url: "https://barrierfree.city.nagoya.jp/map/",
    note: "나고야역·사카에·가나야마의 환승 및 배리어프리 화장실 정보를 확인할 수 있습니다."
  },
  charge: {
    authority: "INFORICH",
    title: "CHARGESPOT 공식 설치 지도",
    url: "https://chargespot.jp/",
    note: "대여·반납 가능 여부와 빈 슬롯은 이동 직전에 공식 앱 또는 지도로 다시 확인해야 합니다."
  },
  language: {
    authority: "日本政府観光局（JNTO）",
    title: "Tourist Information Center",
    url: "https://www.japan.travel/en/tic/",
    note: "가까운 인증 관광안내소와 지원 언어를 찾고, 방문 전 실제 운영시간을 확인합니다."
  }
};

const cities = {
  tokyo: { label: "도쿄", labelJa: "東京", center: [35.6812, 139.7671], zoom: 12 },
  osaka: { label: "오사카", labelJa: "大阪", center: [34.6937, 135.5023], zoom: 12 },
  fukuoka: { label: "후쿠오카", labelJa: "福岡", center: [33.5902, 130.4017], zoom: 13 },
  kyoto: { label: "교토", labelJa: "京都", center: [35.0116, 135.7681], zoom: 12 },
  sapporo: { label: "삿포로", labelJa: "札幌", center: [43.0621, 141.3544], zoom: 13 },
  nagoya: { label: "나고야", labelJa: "名古屋", center: [35.1709, 136.8815], zoom: 13 }
};

const categories = [
  { key: "all", label: "전체", labelJa: "すべて", emoji: "🗺️" },
  { key: "charge", label: "충전 확인", labelJa: "充電確認", emoji: "🔌" },
  { key: "restroom", label: "화장실 확인", labelJa: "トイレ確認", emoji: "🚻" },
  { key: "rest", label: "쉬기 동선", labelJa: "休憩動線", emoji: "☔" },
  { key: "korean", label: "다국어 안내", labelJa: "多言語案内", emoji: "💬" },
  { key: "caution", label: "이용 조건", labelJa: "利用条件", emoji: "ℹ️" }
];

const scenarios = [
  { key: "battery", filter: "charge", label: "배터리 부족", labelJa: "電池不足", emoji: "🔋", hint: "공식 대여 상태 확인" },
  { key: "toilet", filter: "restroom", label: "화장실 급함", labelJa: "トイレ", emoji: "🚻", hint: "공공 동선 먼저" },
  { key: "rain", filter: "rest", label: "비·대기", labelJa: "雨・待機", emoji: "☔", hint: "실내 연결 확인" },
  { key: "korean", filter: "korean", label: "언어 안내", labelJa: "言語案内", emoji: "💬", hint: "지원 언어 재확인" }
];

const places = [
  place("tokyo-shinjuku-charge", "신주쿠 충전 확인 구역", "新宿 充電確認エリア", "도쿄 신주쿠", "東京 新宿", "tokyo", "charge", 35.6915, 139.7038, "charge", ["공식 설치 지도", "반납 슬롯 확인", "현장 재확인"], ["CHARGESPOT 공식 지도에서 현재 대여 가능한 스테이션을 먼저 찾습니다.", "매장 콘센트는 표시가 보여도 직원 허락 없이 사용하지 않습니다."]),
  place("tokyo-ueno-restroom", "우에노 화장실 확인 구역", "上野 トイレ確認エリア", "도쿄 우에노", "東京 上野", "tokyo", "restroom", 35.7138, 139.7772, "tokyo", ["도쿄도 공식 지도", "층·출구 확인", "대체 후보 저장"], ["현재 출구와 같은 층에 있는 공공시설 후보를 먼저 확인합니다.", "영업시간이 있는 시설은 도착 직전 운영 여부를 다시 봅니다."]),
  place("tokyo-ikebukuro-restroom", "이케부쿠로 화장실 확인 구역", "池袋 トイレ確認エリア", "도쿄 이케부쿠로", "東京 池袋", "tokyo", "restroom", 35.7295, 139.7109, "tokyo", ["공식 시설 지도", "개찰 안팎 구분", "현장 표지 우선"], ["개찰 안과 밖을 구분하고 현재 이동 방향에 맞는 후보를 고릅니다.", "공사나 통로 변경이 있으면 현장 안내판을 우선합니다."]),
  place("tokyo-shinokubo-language", "신오쿠보 다국어 안내 확인 구역", "新大久保 多言語案内確認", "도쿄 신오쿠보", "東京 新大久保", "tokyo", "korean", 35.7008, 139.7003, "language", ["JNTO 인증 안내소", "지원 언어 확인", "운영시간 확인"], ["지역 전체가 한국어 대응한다고 전제하지 않고 가까운 인증 안내소를 찾습니다.", "지원 언어와 상담 가능 시간은 안내소별 공식 정보를 다시 확인합니다."]),
  place("tokyo-shibuya-conditions", "시부야 이용 조건 확인 구역", "渋谷 利用条件確認エリア", "도쿄 시부야", "東京 渋谷", "tokyo", "caution", 35.6595, 139.7005, "tokyo", ["혼잡 동선", "시설 규칙 확인", "단정 없는 안내"], ["이 핀은 특정 매장 평가가 아니라 혼잡 지역에서 확인할 항목을 보여주는 기준점입니다.", "촬영·대기·좌석 이용은 각 시설의 현장 규칙을 따릅니다."]),
  place("tokyo-tokyo-station-rest", "도쿄역 실내 동선 확인", "東京駅 屋内動線確認", "도쿄역", "東京駅", "tokyo", "rest", 35.6812, 139.7671, "tokyo", ["실내 연결", "출구 방향", "현장 표지 우선"], ["비를 피할 때도 다음 환승 방향과 같은 쪽의 실내 동선을 고릅니다.", "좌석·휴게공간의 이용 가능 여부는 현장 표지와 운영시간을 확인합니다."]),
  place("tokyo-akihabara-charge", "아키하바라 충전 확인 구역", "秋葉原 充電確認エリア", "도쿄 아키하바라", "東京 秋葉原", "tokyo", "charge", 35.6984, 139.7730, "charge", ["공식 설치 지도", "결제수단 확인", "반납 위치 확인"], ["대여 전 사용 가능한 결제수단과 요금을 공식 서비스에서 확인합니다.", "다음 이동지 근처의 반납 가능 슬롯도 함께 봅니다."]),
  place("tokyo-shinagawa-rest", "시나가와 실내 대기 확인", "品川 屋内待機確認", "도쿄 시나가와", "東京 品川", "tokyo", "rest", 35.6285, 139.7388, "tokyo", ["역내 동선", "짧은 대기", "이용 조건 확인"], ["통행을 방해하지 않는 짧은 대기 장소인지 현장에서 확인합니다.", "운영시간과 혼잡 상황은 고정 정보가 아니므로 도착 직전 다시 봅니다."]),
  place("osaka-namba-charge", "난바 충전 확인 구역", "難波 充電確認エリア", "오사카 난바", "大阪 難波", "osaka", "charge", 34.6657, 135.5019, "charge", ["대여 상태 확인", "지하 출구 확인", "반납 슬롯 확인"], ["공식 설치 지도에서 현재 작동 중인 대여 지점을 확인합니다.", "난바 지하 동선에서는 출구 번호와 다음 반납 위치를 함께 봅니다."]),
  place("osaka-umeda-restroom", "우메다 화장실 확인 구역", "梅田 トイレ確認エリア", "오사카 우메다", "大阪 梅田", "osaka", "restroom", 34.7025, 135.4959, "osaka", ["오사카시 공식 자료", "지하 구역 확인", "현장 표지 우선"], ["우메다는 같은 역권에서도 지하 구역이 나뉘므로 현재 표지판 이름을 먼저 확인합니다.", "시 관리 시설과 민간 상업시설의 이용 조건을 구분합니다."]),
  place("osaka-tennoji-rest", "텐노지 실내 동선 확인", "天王寺 屋内動線確認", "오사카 텐노지", "大阪 天王寺", "osaka", "rest", 34.6465, 135.5133, "osaka", ["공공시설 우선", "운영시간 확인", "대체 동선"], ["비나 더위를 피할 때 통행 공간과 실제 휴게공간을 구분합니다.", "행사일에는 이용 조건이 달라질 수 있어 두 번째 후보를 남깁니다."]),
  place("osaka-tsuruhashi-language", "쓰루하시 다국어 안내 확인", "鶴橋 多言語案内確認", "오사카 쓰루하시", "大阪 鶴橋", "osaka", "korean", 34.6651, 135.5306, "language", ["지원 언어 확인", "공식 안내소 검색", "현장 재확인"], ["상권 전체의 언어 지원을 보장하지 않으며, 필요한 경우 JNTO 인증 안내소를 찾습니다.", "매장별 메뉴 언어와 실제 대화 가능 언어는 서로 다를 수 있습니다."]),
  place("fukuoka-hakata-restroom", "하카타 화장실 확인 구역", "博多 トイレ確認エリア", "후쿠오카 하카타", "福岡 博多", "fukuoka", "restroom", 33.5904, 130.4206, "fukuoka", ["후쿠오카시 공식 지도", "교통 동선", "현장 표지 우선"], ["공항·신칸센·버스 이동 방향과 같은 쪽의 공공시설을 먼저 찾습니다.", "개찰 안팎과 층 정보를 현장 안내에서 다시 확인합니다."]),
  place("fukuoka-tenjin-rest", "텐진 비·대기 동선 확인", "天神 雨・待機動線確認", "후쿠오카 텐진", "福岡 天神", "fukuoka", "rest", 33.5908, 130.3991, "fukuoka", ["공식 시설 지도", "지하 연결", "운영시간 확인"], ["비를 피하는 동선이 목적지 방향과 이어지는지 먼저 확인합니다.", "실내 통로는 휴게공간이 아니므로 장시간 머무르지 않습니다."]),
  place("fukuoka-hakata-language", "하카타 다국어 안내 확인", "博多 多言語案内確認", "후쿠오카 하카타", "福岡 博多", "fukuoka", "korean", 33.5898, 130.4214, "language", ["JNTO 인증 안내소", "지원 언어 확인", "전화 안내"], ["가까운 인증 관광안내소의 지원 언어와 운영시간을 공식 목록에서 확인합니다.", "JNTO 전화 안내도 날짜와 시간 조건을 확인한 뒤 이용합니다."]),
  place("kyoto-station-rest", "교토역 대기 동선 확인", "京都駅 待機動線確認", "교토역", "京都駅", "kyoto", "rest", 34.9859, 135.7588, "kyoto", ["공공 동선", "혼잡 시간 확인", "현장 안내 우선"], ["짐이 많을 때 통행 공간과 실제 휴게공간을 구분합니다.", "관광 성수기에는 시설 운영 안내와 혼잡 통제를 우선합니다."]),
  place("kyoto-gion-restroom", "기온 화장실 확인 구역", "祇園 トイレ確認エリア", "교토 기온", "京都 祇園", "kyoto", "restroom", 35.0030, 135.7751, "kyoto", ["교토시 공식 목록", "공공시설 우선", "매너 안내 확인"], ["교토시가 공개한 공중화장실 목록에서 가장 가까운 공공 후보를 찾습니다.", "사유지·매장 시설은 무단으로 이용하지 않고 현장 안내를 따릅니다."]),
  place("kyoto-shijo-conditions", "시조가와라마치 이용 조건 확인", "四条河原町 利用条件確認", "교토 시조가와라마치", "京都 四条河原町", "kyoto", "caution", 35.0037, 135.7687, "kyoto", ["관광 혼잡", "시설 규칙", "단정 없는 안내"], ["특정 장소에 대한 평가가 아니라 혼잡 지역의 이용 규칙을 확인하기 위한 기준점입니다.", "촬영·대기·화장실 이용은 시설과 지역의 안내를 우선합니다."]),
  place("sapporo-station-restroom", "삿포로역 겨울 화장실 확인", "札幌駅 冬季トイレ確認", "삿포로역", "札幌駅", "sapporo", "restroom", 43.0687, 141.3508, "sapporo", ["삿포로시 공식 정보", "겨울 운영 확인", "지하 동선"], ["겨울철에는 공원 화장실의 폐쇄 여부와 실내 대체 동선을 공식 자료에서 확인합니다.", "적설·공사로 이동 경로가 달라질 수 있어 현장 안내를 우선합니다."]),
  place("nagoya-station-access", "나고야역 배리어프리 동선", "名古屋駅 バリアフリー動線", "나고야역", "名古屋駅", "nagoya", "restroom", 35.1709, 136.8815, "nagoya", ["나고야시 공식 지도", "다기능 화장실", "환승 경로"], ["나고야시 공식 환승 지도에서 엘리베이터와 배리어프리 화장실 위치를 확인합니다.", "작성 연도가 표시된 지도는 현장 변경 가능성을 고려해 최신 안내와 대조합니다."])
];

function place(id, name, nameJa, area, areaJa, city, category, lat, lng, sourceKey, tags, checks) {
  return { id, name, nameJa, area, areaJa, city, category, lat, lng, sourceKey, tags, checks, checkedAt: CHECKED_AT };
}

const uiJa = {
  "스미맵": "スミマップ",
  "일본 생활 확인 지도": "日本生活 確認マップ",
  "스미맵 - 일본 생활 확인 지도": "スミマップ - 日本生活 確認マップ",
  "공식 원문과 현장 안내를 함께 확인하는 일본 생활 지도.": "公式情報と現地案内を一緒に確認する日本生活マップ。",
  "현재 위치로 이동": "現在地へ移動",
  "검색 열기": "検索を開く",
  "검색 닫기": "検索を閉じる",
  "한국어로 보기": "韓国語で見る",
  "일본어로 보기": "日本語で見る",
  "출처와 방법론": "出典と方法",
  "정정 제안": "修正提案",
  "도시·역·지역 검색": "都市・駅・地域を検索",
  "검색": "検索",
  "도시 빠른 이동": "都市へ移動",
  "주요 메뉴": "メインメニュー",
  "근처": "近く",
  "필터": "絞り込み",
  "출처": "出典",
  "저장": "保存",
  "정보": "情報",
  "지도에서 확인 포인트를 눌러요": "地図の確認ポイントを押してください",
  "핀은 시설 보증이 아니라 공식 원문을 여는 지역 기준점입니다.": "ピンは施設の保証ではなく、公式情報を開く地域の基準点です。",
  "지도 크게": "地図を広く",
  "패널 열기": "パネルを開く",
  "패널 닫기": "パネルを閉じる",
  "공식 원문 연결": "公式情報あり",
  "자료 성격": "情報の種類",
  "지역 기준점": "地域の基準点",
  "자료 대조일": "照合日",
  "현장 상태": "現地状況",
  "도착 직전 재확인": "到着前に再確認",
  "공식 원문": "公式情報",
  "길찾기": "経路",
  "저장하기": "保存",
  "저장됨": "保存済み",
  "확인 순서": "確認手順",
  "필터 기준": "絞り込み基準",
  "상황별로 필요한 확인 포인트만 좁힙니다.": "状況別に必要な確認ポイントだけを表示します。",
  "저장한 확인 포인트": "保存した確認ポイント",
  "이 브라우저에만 저장되며 서버로 전송되지 않습니다.": "このブラウザだけに保存され、サーバーには送信されません。",
  "저장한 곳이 없습니다": "保存した場所はありません",
  "장소 상세에서 저장하기를 누르면 여기에 모입니다.": "詳細で保存するとここに表示されます。",
  "스미맵 이용 기준": "スミマップの利用基準",
  "공식 자료의 범위와 현장 재확인 원칙을 먼저 읽어주세요.": "公式情報の範囲と現地再確認の原則を先にお読みください。",
  "자료 출처": "情報源",
  "도시 가이드": "都市ガイド",
  "상황 가이드": "状況ガイド",
  "편집 원칙": "編集方針",
  "개인정보": "プライバシー",
  "문의·정정": "問い合わせ・修正",
  "공식 지도와 시설 페이지는 이동 전 최신 상태를 다시 확인합니다.": "公式地図と施設ページは移動前に最新状態を再確認します。",
  "핀의 좌표는 지역 탐색을 시작하기 위한 기준점이며 개별 시설 위치 보증이 아닙니다.": "ピンの座標は地域探索の基準点であり、個別施設の位置保証ではありません。",
  "신뢰도 점수·실시간 제보 수·검증되지 않은 최근 확인 표시는 사용하지 않습니다.": "信頼度点数・リアルタイム投稿数・未検証の最近確認表示は使用しません。",
  "현장 안내와 시설 운영자의 규칙이 이 지도보다 우선합니다.": "現地案内と施設運営者の規則がこの地図より優先されます。",
  "검색 결과": "検索結果",
  "일치하는 지역이 없습니다": "一致する地域がありません",
  "위치 권한을 허용하면 화면에서만 현재 위치를 표시합니다.": "位置情報を許可すると画面上だけに現在地を表示します。",
  "위치를 확인할 수 없습니다.": "位置情報を確認できません。",
  "저장했습니다.": "保存しました。",
  "저장을 해제했습니다.": "保存を解除しました。"
};

const state = {
  language: readJson(STORAGE.language, "ko") === "ja" ? "ja" : "ko",
  filter: "all",
  scenario: "",
  activePanel: "near",
  sheetMode: "collapsed",
  selectedId: places[0].id,
  saved: normalizeIds(readJson(STORAGE.saved, [])),
  recent: normalizeIds(readJson(STORAGE.recent, [])).slice(0, 8)
};

const els = {
  shell: document.querySelector(".app-shell"),
  sheet: document.querySelector("#sheet"),
  status: document.querySelector("#statusPill"),
  rail: document.querySelector("#mapQuickRail"),
  searchPanel: document.querySelector("#searchPanel"),
  searchToggle: document.querySelector("#searchToggle"),
  searchInput: document.querySelector("#placeSearch"),
  searchClear: document.querySelector("#searchClear"),
  searchButton: document.querySelector("#addressSearchButton"),
  searchResults: document.querySelector("#addressResults"),
  locate: document.querySelector("#locateButton"),
  language: document.querySelector("#languageToggle"),
  sibling: document.querySelector("#siblingButton"),
  feedback: document.querySelector("#feedbackButton"),
  toast: document.querySelector("#toast")
};

let map;
let markers = new Map();
let userMarker = null;
let toastTimer = null;

cleanupLegacyStorage();
initMap();
bindEvents();
applyEntryParams();
applyLanguage();
renderAll();
registerServiceWorker();

function initMap() {
  map = L.map("map", { zoomControl: false, minZoom: 5, maxZoom: 18, preferCanvas: true }).setView(cities.tokyo.center, cities.tokyo.zoom);
  L.tileLayer("https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
    attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
    maxZoom: 20,
    subdomains: "abcd"
  }).addTo(map);
  L.control.zoom({ position: "bottomright" }).addTo(map);
  places.forEach((item) => {
    const marker = L.marker([item.lat, item.lng], {
      icon: L.divIcon({
        className: `sumimap-marker marker-${item.category}`,
        html: category(item.category).emoji,
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      }),
      title: item.name
    });
    marker.on("click", () => selectPlace(item.id, true));
    markers.set(item.id, marker);
  });
  map.on("moveend zoomend", () => {
    updateStatus();
    if (state.activePanel === "near") renderSheet();
  });
}

function bindEvents() {
  document.addEventListener("click", (event) => {
    const nav = event.target.closest("[data-action]");
    if (nav) {
      const action = nav.dataset.action;
      if (action === "sources") {
        location.href = "/sources/";
        return;
      }
      setPanel(action);
      return;
    }
    const panelButton = event.target.closest("[data-open-panel]");
    if (panelButton) {
      setPanel(panelButton.dataset.openPanel);
      return;
    }
    const placeButton = event.target.closest("[data-place-id]");
    if (placeButton) {
      selectPlace(placeButton.dataset.placeId, true);
      return;
    }
    const filterButton = event.target.closest("[data-filter]");
    if (filterButton) {
      state.filter = filterButton.dataset.filter;
      state.scenario = "";
      syncSelected();
      renderAll();
      return;
    }
    const scenarioButton = event.target.closest("[data-scenario]");
    if (scenarioButton) {
      const item = scenarios.find((entry) => entry.key === scenarioButton.dataset.scenario);
      if (!item) return;
      state.scenario = item.key;
      state.filter = item.filter;
      state.activePanel = "near";
      state.sheetMode = "collapsed";
      syncSelected();
      renderAll();
      return;
    }
    const saveButton = event.target.closest("[data-save-place]");
    if (saveButton) {
      toggleSaved(saveButton.dataset.savePlace);
      return;
    }
    if (event.target.closest("[data-sheet-toggle], [data-sheet-collapse]")) {
      state.sheetMode = state.sheetMode === "collapsed" ? "expanded" : "collapsed";
      syncSheetMode();
    }
  });

  els.searchToggle?.addEventListener("click", toggleSearch);
  els.searchClear?.addEventListener("click", () => {
    els.searchInput.value = "";
    els.searchClear.hidden = true;
    els.searchResults.hidden = true;
    els.searchResults.innerHTML = "";
  });
  els.searchButton?.addEventListener("click", runSearch);
  els.searchInput?.addEventListener("input", () => {
    els.searchClear.hidden = !els.searchInput.value;
  });
  els.searchInput?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      runSearch();
    }
  });
  document.querySelectorAll("[data-city]").forEach((button) => {
    button.addEventListener("click", () => {
      const item = cities[button.dataset.city];
      if (!item) return;
      map.setView(item.center, item.zoom);
      els.searchPanel.hidden = true;
      els.searchToggle.setAttribute("aria-expanded", "false");
    });
  });
  els.locate?.addEventListener("click", locateUser);
  els.language?.addEventListener("click", () => {
    state.language = state.language === "ko" ? "ja" : "ko";
    writeJson(STORAGE.language, state.language);
    applyLanguage();
    renderAll();
  });
  els.sibling?.addEventListener("click", () => { location.href = "/sources/"; });
  els.feedback?.addEventListener("click", () => window.open(GITHUB_ISSUES, "_blank", "noopener,noreferrer"));
}

function applyEntryParams() {
  const params = new URLSearchParams(location.search);
  const cityKey = params.get("city");
  const scenarioKey = params.get("case") || params.get("scenario");
  const filterKey = params.get("filter");
  const placeId = params.get("place");
  const panel = params.get("panel");
  if (cities[cityKey]) map.setView(cities[cityKey].center, cities[cityKey].zoom);
  const scenario = scenarios.find((item) => item.key === scenarioKey);
  if (scenario) {
    state.scenario = scenario.key;
    state.filter = scenario.filter;
  } else if (categories.some((item) => item.key === filterKey)) {
    state.filter = filterKey;
  }
  if (places.some((item) => item.id === placeId)) state.selectedId = placeId;
  if (["near", "filters", "saved", "guide"].includes(panel)) {
    state.activePanel = panel;
    state.sheetMode = panel === "near" ? "collapsed" : "expanded";
  }
  syncSelected();
}

function applyLanguage() {
  const japanese = state.language === "ja";
  document.documentElement.lang = japanese ? "ja" : "ko";
  document.title = t("스미맵 - 일본 생활 확인 지도");
  const description = t("공식 원문과 현장 안내를 함께 확인하는 일본 생활 지도.");
  document.querySelector("meta[name='description']")?.setAttribute("content", description);
  document.querySelector("meta[property='og:title']")?.setAttribute("content", document.title);
  document.querySelector("meta[property='og:description']")?.setAttribute("content", description);
  document.querySelector("meta[name='twitter:title']")?.setAttribute("content", document.title);
  document.querySelector("meta[name='twitter:description']")?.setAttribute("content", description);
  document.querySelector(".brand strong").textContent = t("스미맵");
  document.querySelector(".brand small").textContent = t("일본 생활 확인 지도");
  document.querySelector(".brand-mark").textContent = japanese ? "す" : "스";
  els.locate?.setAttribute("aria-label", t("현재 위치로 이동"));
  els.searchToggle?.setAttribute("aria-label", t(els.searchPanel?.hidden ? "검색 열기" : "검색 닫기"));
  els.language?.setAttribute("aria-label", t(japanese ? "한국어로 보기" : "일본어로 보기"));
  els.language?.setAttribute("aria-pressed", String(japanese));
  const languageCode = els.language?.querySelector(".language-code");
  if (languageCode) languageCode.textContent = japanese ? "한" : "일";
  els.sibling?.setAttribute("aria-label", t("출처와 방법론"));
  els.feedback?.setAttribute("aria-label", t("정정 제안"));
  els.searchInput.placeholder = t("도시·역·지역 검색");
  els.searchButton.textContent = t("검색");
  document.querySelector(".city-strip")?.setAttribute("aria-label", t("도시 빠른 이동"));
  document.querySelectorAll("[data-city]").forEach((button) => {
    const item = cities[button.dataset.city];
    if (item) button.textContent = japanese ? item.labelJa : item.label;
  });
  document.querySelector(".bottom-nav")?.setAttribute("aria-label", t("주요 메뉴"));
  const navLabels = { near: "근처", filters: "필터", sources: "출처", saved: "저장", guide: "정보" };
  document.querySelectorAll(".nav-button").forEach((button) => {
    const span = button.querySelector("span");
    if (span && navLabels[button.dataset.action]) span.textContent = t(navLabels[button.dataset.action]);
  });
}

function renderAll() {
  renderRail();
  renderMarkers();
  renderSheet();
  setActiveNav();
  updateStatus();
}

function renderRail() {
  els.rail.innerHTML = scenarios.map((item) => `
    <button class="scenario-chip ${state.scenario === item.key ? "is-active" : ""}" type="button" data-scenario="${item.key}" aria-pressed="${state.scenario === item.key}">
      <span class="scenario-emoji" aria-hidden="true">${item.emoji}</span>
      <span><strong>${state.language === "ja" ? item.labelJa : item.label}</strong><small>${state.language === "ja" ? "公式情報を確認" : item.hint}</small></span>
    </button>
  `).join("");
}

function renderMarkers() {
  const allowed = new Set(filteredPlaces().map((item) => item.id));
  markers.forEach((marker, id) => {
    if (allowed.has(id)) {
      if (!map.hasLayer(marker)) marker.addTo(map);
    } else if (map.hasLayer(marker)) {
      marker.removeFrom(map);
    }
    marker.getElement()?.classList.toggle("is-selected", id === state.selectedId);
  });
}

function renderSheet() {
  if (!els.sheet) return;
  let html;
  if (state.activePanel === "filters") html = renderFilters();
  else if (state.activePanel === "saved") html = renderSaved();
  else if (state.activePanel === "guide") html = renderGuide();
  else html = renderNearby();
  els.sheet.innerHTML = html;
  syncSheetMode();
}

function renderNearby() {
  const list = filteredPlaces();
  const selected = list.find((item) => item.id === state.selectedId) || list[0] || null;
  return `
    <button class="sheet-grip" type="button" data-sheet-toggle aria-label="${escapeAttr(t(state.sheetMode === "collapsed" ? "패널 열기" : "패널 닫기"))}"></button>
    <div class="sheet-head" data-sheet-toggle>
      <div><h1>${t("지도에서 확인 포인트를 눌러요")}</h1><p>${t("핀은 시설 보증이 아니라 공식 원문을 여는 지역 기준점입니다.")}</p></div>
      <div class="sheet-head-actions"><button class="sheet-mini-action" type="button" data-sheet-collapse>${t("지도 크게")}</button><span class="compact-stat">${list.length}${state.language === "ja" ? "件" : "곳"}</span></div>
    </div>
    ${selected ? renderPlace(selected) : `<div class="place-card"><h3>${t("일치하는 지역이 없습니다")}</h3></div>`}
    ${renderMethodCard()}
  `;
}

function renderPlace(item) {
  const source = sources[item.sourceKey];
  const saved = state.saved.includes(item.id);
  return `
    <article class="place-brief">
      <div class="place-title-row">
        <div><h2><span class="place-title-emoji" aria-hidden="true">${category(item.category).emoji}</span>${escapeHtml(placeText(item, "name"))}</h2><p>${escapeHtml(placeText(item, "area"))}</p></div>
        <span class="badge good">${t("공식 원문 연결")}</span>
      </div>
      <div class="tag-row compact-tags">${item.tags.map((tag) => `<span class="badge info">${escapeHtml(state.language === "ja" ? japaneseTag(tag) : tag)}</span>`).join("")}</div>
      <div class="brief-line"><span>${escapeHtml(source.authority)}</span><strong>${escapeHtml(source.title)}</strong></div>
      <div class="brief-stats">
        <div><span>${t("자료 성격")}</span><strong>${t("지역 기준점")}</strong></div>
        <div><span>${t("자료 대조일")}</span><strong>${item.checkedAt}</strong></div>
        <div><span>${t("현장 상태")}</span><strong>${t("도착 직전 재확인")}</strong></div>
        <div><span>${state.language === "ja" ? "距離目安" : "지도 중심 거리"}</span><strong>${distanceLabel(item)}</strong></div>
      </div>
      <div class="place-section-title">${t("확인 순서")}</div>
      <ul class="note-list">${item.checks.map((note) => `<li>${escapeHtml(state.language === "ja" ? japaneseCheck(note) : note)}</li>`).join("")}<li>${escapeHtml(state.language === "ja" ? "公式情報の範囲を超える個別施設の営業・設備は保証しません。" : source.note)}</li></ul>
      <div class="detail-actions brief-actions">
        <a class="primary-button" href="${escapeAttr(source.url)}" target="_blank" rel="noopener noreferrer">${icon("book-open")}${t("공식 원문")}</a>
        <a class="text-button" href="${mapsUrl(item)}" target="_blank" rel="noopener noreferrer">${icon("navigation")}${t("길찾기")}</a>
        <button class="text-button" type="button" data-save-place="${item.id}">${icon("bookmark")}${t(saved ? "저장됨" : "저장하기")}</button>
      </div>
    </article>
  `;
}

function renderFilters() {
  return `
    <button class="sheet-grip" type="button" data-sheet-toggle aria-label="${escapeAttr(t("패널 닫기"))}"></button>
    <div class="sheet-head" data-sheet-toggle><div><h2>${t("필터 기준")}</h2><p>${t("상황별로 필요한 확인 포인트만 좁힙니다.")}</p></div><button class="sheet-mini-action" type="button" data-sheet-collapse>${t("지도 크게")}</button></div>
    <div class="filter-row">${categories.map((item) => `<button class="chip ${state.filter === item.key ? "is-active" : ""}" type="button" data-filter="${item.key}" aria-pressed="${state.filter === item.key}"><span class="chip-emoji" aria-hidden="true">${item.emoji}</span>${state.language === "ja" ? item.labelJa : item.label}</button>`).join("")}</div>
    <ul class="note-list">
      <li>${t("핀의 좌표는 지역 탐색을 시작하기 위한 기준점이며 개별 시설 위치 보증이 아닙니다.")}</li>
      <li>${t("공식 지도와 시설 페이지는 이동 전 최신 상태를 다시 확인합니다.")}</li>
      <li>${t("현장 안내와 시설 운영자의 규칙이 이 지도보다 우선합니다.")}</li>
    </ul>
  `;
}

function renderSaved() {
  const saved = state.saved.map((id) => places.find((item) => item.id === id)).filter(Boolean);
  return `
    <button class="sheet-grip" type="button" data-sheet-toggle aria-label="${escapeAttr(t("패널 닫기"))}"></button>
    <div class="sheet-head" data-sheet-toggle><div><h2>${t("저장한 확인 포인트")}</h2><p>${t("이 브라우저에만 저장되며 서버로 전송되지 않습니다.")}</p></div><button class="sheet-mini-action" type="button" data-sheet-collapse>${t("지도 크게")}</button></div>
    <div class="place-list">${saved.length ? saved.map(renderCard).join("") : `<div class="place-card"><h3>${t("저장한 곳이 없습니다")}</h3><p>${t("장소 상세에서 저장하기를 누르면 여기에 모입니다.")}</p></div>`}</div>
  `;
}

function renderGuide() {
  return `
    <button class="sheet-grip" type="button" data-sheet-toggle aria-label="${escapeAttr(t("패널 닫기"))}"></button>
    <div class="sheet-head" data-sheet-toggle><div><h2>${t("스미맵 이용 기준")}</h2><p>${t("공식 자료의 범위와 현장 재확인 원칙을 먼저 읽어주세요.")}</p></div><button class="sheet-mini-action" type="button" data-sheet-collapse>${t("지도 크게")}</button></div>
    <ul class="note-list">
      <li>${t("핀의 좌표는 지역 탐색을 시작하기 위한 기준점이며 개별 시설 위치 보증이 아닙니다.")}</li>
      <li>${t("신뢰도 점수·실시간 제보 수·검증되지 않은 최근 확인 표시는 사용하지 않습니다.")}</li>
      <li>${t("현장 안내와 시설 운영자의 규칙이 이 지도보다 우선합니다.")}</li>
    </ul>
    <div class="home-content-links">
      <a href="/sources/"><span>${t("자료 출처")}</span><em>${state.language === "ja" ? "公式情報と照合日" : "공식 원문과 대조일"}</em></a>
      <a href="/cities/"><span>${t("도시 가이드")}</span><em>${state.language === "ja" ? "都市別の確認方法" : "도시별 확인 방법"}</em></a>
      <a href="/routes/"><span>${t("상황 가이드")}</span><em>${state.language === "ja" ? "状況別の確認順序" : "상황별 확인 순서"}</em></a>
      <a href="/editorial/"><span>${t("편집 원칙")}</span><em>${state.language === "ja" ? "掲載・修正の基準" : "게재·정정 기준"}</em></a>
      <a href="/privacy/"><span>${t("개인정보")}</span><em>${state.language === "ja" ? "ブラウザ保存と広告" : "브라우저 저장과 광고"}</em></a>
      <a href="/contact/"><span>${t("문의·정정")}</span><em>${state.language === "ja" ? "公開Issueで提案" : "공개 이슈로 제안"}</em></a>
    </div>
  `;
}

function renderMethodCard() {
  return `<section class="home-content-card"><div><span>${t("자료 출처")}</span><strong>${state.language === "ja" ? "公式情報から始め、現地で再確認" : "공식 원문에서 시작해 현장에서 다시 확인"}</strong><p>${t("핀의 좌표는 지역 탐색을 시작하기 위한 기준점이며 개별 시설 위치 보증이 아닙니다.")}</p></div><div class="home-content-links"><a href="/sources/"><span>${t("자료 출처")}</span><em>${state.language === "ja" ? "方法と公式リンク" : "방법론과 공식 링크"}</em></a><a href="/editorial/"><span>${t("편집 원칙")}</span><em>${state.language === "ja" ? "更新・修正基準" : "업데이트·정정 기준"}</em></a></div></section>`;
}

function renderCard(item) {
  return `<button class="place-card ${item.id === state.selectedId ? "is-selected" : ""}" type="button" data-place-id="${item.id}"><div class="place-title-row"><h3><span class="place-title-emoji" aria-hidden="true">${category(item.category).emoji}</span>${escapeHtml(placeText(item, "name"))}</h3><span class="badge good">${t("공식 원문 연결")}</span></div><p>${escapeHtml(placeText(item, "area"))} · ${distanceLabel(item)}</p></button>`;
}

function setPanel(panel) {
  if (!["near", "filters", "saved", "guide"].includes(panel)) return;
  state.activePanel = panel;
  state.sheetMode = panel === "near" ? "collapsed" : "expanded";
  renderSheet();
  setActiveNav();
}

function setActiveNav() {
  document.querySelectorAll(".nav-button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.action === state.activePanel);
  });
}

function syncSheetMode() {
  els.sheet.classList.toggle("is-collapsed", state.sheetMode === "collapsed");
  els.sheet.classList.toggle("is-expanded", state.sheetMode !== "collapsed");
}

function selectPlace(id, move) {
  const item = places.find((entry) => entry.id === id);
  if (!item) return;
  state.selectedId = id;
  state.activePanel = "near";
  state.sheetMode = "expanded";
  state.recent = [id, ...state.recent.filter((entry) => entry !== id)].slice(0, 8);
  writeJson(STORAGE.recent, state.recent);
  if (els.searchPanel) {
    els.searchPanel.hidden = true;
    els.searchToggle?.setAttribute("aria-expanded", "false");
  }
  if (move) map.flyTo([item.lat, item.lng], Math.max(map.getZoom(), 14), { duration: 0.35 });
  renderAll();
}

function toggleSaved(id) {
  if (!places.some((item) => item.id === id)) return;
  if (state.saved.includes(id)) {
    state.saved = state.saved.filter((entry) => entry !== id);
    showToast(t("저장을 해제했습니다."));
  } else {
    state.saved = [id, ...state.saved].slice(0, 30);
    showToast(t("저장했습니다."));
  }
  writeJson(STORAGE.saved, state.saved);
  renderSheet();
}

function toggleSearch() {
  const open = els.searchPanel.hidden;
  els.searchPanel.hidden = !open;
  els.searchToggle.setAttribute("aria-expanded", String(open));
  els.searchToggle.setAttribute("aria-label", t(open ? "검색 닫기" : "검색 열기"));
  if (open) els.searchInput.focus();
}

function runSearch() {
  const query = els.searchInput.value.trim().toLocaleLowerCase();
  const results = query ? places.filter((item) => `${item.name} ${item.nameJa} ${item.area} ${item.areaJa}`.toLocaleLowerCase().includes(query)).slice(0, 8) : [];
  els.searchResults.hidden = false;
  els.searchResults.innerHTML = `<strong>${t("검색 결과")}</strong>${results.length ? results.map((item) => `<button type="button" data-place-id="${item.id}"><span>${category(item.category).emoji}</span><span><strong>${escapeHtml(placeText(item, "name"))}</strong><small>${escapeHtml(placeText(item, "area"))}</small></span></button>`).join("") : `<p>${t("일치하는 지역이 없습니다")}</p>`}`;
}

function locateUser() {
  if (!navigator.geolocation) {
    showToast(t("위치를 확인할 수 없습니다."));
    return;
  }
  showToast(t("위치 권한을 허용하면 화면에서만 현재 위치를 표시합니다."));
  navigator.geolocation.getCurrentPosition((position) => {
    const point = [position.coords.latitude, position.coords.longitude];
    if (userMarker) userMarker.setLatLng(point);
    else userMarker = L.circleMarker(point, { radius: 8, color: "#ffffff", weight: 3, fillColor: "#1b865e", fillOpacity: 1 }).addTo(map);
    map.setView(point, 15);
  }, () => showToast(t("위치를 확인할 수 없습니다.")), { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 });
}

function filteredPlaces() {
  if (state.filter === "all") return places;
  return places.filter((item) => item.category === state.filter);
}

function syncSelected() {
  const list = filteredPlaces();
  if (!list.some((item) => item.id === state.selectedId)) state.selectedId = list[0]?.id || "";
}

function updateStatus() {
  const bounds = map.getBounds();
  const count = filteredPlaces().filter((item) => bounds.contains([item.lat, item.lng])).length;
  const label = category(state.filter);
  els.status.textContent = state.language === "ja" ? `${label.labelJa} ${count}件` : `${label.label} ${count}곳`;
}

function distanceLabel(item) {
  const center = map.getCenter();
  const meters = center.distanceTo([item.lat, item.lng]);
  if (meters < 1000) return `${Math.max(10, Math.round(meters / 10) * 10)}m`;
  return `${(meters / 1000).toFixed(meters < 10000 ? 1 : 0)}km`;
}

function category(key) {
  return categories.find((item) => item.key === key) || categories[0];
}

function placeText(item, field) {
  return state.language === "ja" ? item[`${field}Ja`] || item[field] : item[field];
}

function mapsUrl(item) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${item.lat},${item.lng}`)}`;
}

function t(text) {
  return state.language === "ja" ? uiJa[text] || text : text;
}

function japaneseTag(tag) {
  const map = { "공식 설치 지도": "公式設置マップ", "반납 슬롯 확인": "返却枠確認", "현장 재확인": "現地再確認", "도쿄도 공식 지도": "東京都公式マップ", "층·출구 확인": "階・出口確認", "대체 후보 저장": "代替候補保存", "공식 시설 지도": "公式施設マップ", "개찰 안팎 구분": "改札内外確認", "현장 표지 우선": "現地表示優先", "JNTO 인증 안내소": "JNTO認定案内所", "지원 언어 확인": "対応言語確認", "운영시간 확인": "営業時間確認", "혼잡 동선": "混雑動線", "시설 규칙 확인": "施設規則確認", "단정 없는 안내": "断定しない案内", "실내 연결": "屋内接続", "출구 방향": "出口方向", "결제수단 확인": "決済方法確認", "반납 위치 확인": "返却場所確認", "역내 동선": "駅内動線", "짧은 대기": "短時間待機", "이용 조건 확인": "利用条件確認", "대여 상태 확인": "貸出状況確認", "지하 출구 확인": "地下出口確認", "오사카시 공식 자료": "大阪市公式資料", "지하 구역 확인": "地下区域確認", "공공시설 우선": "公共施設優先", "대체 동선": "代替動線", "공식 안내소 검색": "公式案内所検索", "후쿠오카시 공식 지도": "福岡市公式マップ", "교통 동선": "交通動線", "지하 연결": "地下接続", "전화 안내": "電話案内", "공공 동선": "公共動線", "혼잡 시간 확인": "混雑時間確認", "교토시 공식 목록": "京都市公式一覧", "매너 안내 확인": "マナー案内確認", "관광 혼잡": "観光混雑", "시설 규칙": "施設規則", "삿포로시 공식 정보": "札幌市公式情報", "겨울 운영 확인": "冬季運用確認", "나고야시 공식 지도": "名古屋市公式マップ", "다기능 화장실": "多機能トイレ", "환승 경로": "乗換経路" };
  return map[tag] || tag;
}

function japaneseCheck(text) {
  const generic = text
    .replaceAll("확인합니다", "確認します")
    .replaceAll("우선합니다", "優先します")
    .replaceAll("않습니다", "しません");
  return generic;
}

function showToast(message) {
  if (!els.toast) return;
  window.clearTimeout(toastTimer);
  els.toast.textContent = message;
  els.toast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => els.toast.classList.remove("is-visible"), 2400);
}

function icon(name) {
  const paths = {
    "book-open": '<path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H20v17H7.5A3.5 3.5 0 0 0 4 22V5.5Z"/><path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H20"/>',
    navigation: '<path d="M12 2 3 21l9-4 9 4-9-19Z"/>',
    bookmark: '<path d="M6 4h12v17l-6-3.5L6 21V4Z"/>'
  };
  return `<svg class="inline-icon" viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.bookmark}</svg>`;
}

function escapeHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

function escapeAttr(value) {
  return escapeHtml(value).replaceAll("`", "&#96;");
}

function readJson(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage can be blocked */ }
}

function normalizeIds(value) {
  if (!Array.isArray(value)) return [];
  const valid = new Set(places.map((item) => item.id));
  return [...new Set(value.filter((id) => valid.has(id)))];
}

function cleanupLegacyStorage() {
  ["sumimap:reports", "sumimap:reportClientId", "sumimap:feedbackOutbox", "sumimap:customPlaces"].forEach((key) => {
    try { localStorage.removeItem(key); } catch { /* storage can be blocked */ }
  });
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator && location.protocol === "https:") {
    window.addEventListener("load", () => navigator.serviceWorker.register("/sw.js").catch(() => {}), { once: true });
  }
}
