const cities = {
  tokyo: { label: "도쿄", center: [35.6812, 139.7671], zoom: 12 },
  osaka: { label: "오사카", center: [34.6937, 135.5023], zoom: 12 },
  fukuoka: { label: "후쿠오카", center: [33.5902, 130.4017], zoom: 12 },
  kyoto: { label: "교토", center: [35.0116, 135.7681], zoom: 12 }
};

const categories = [
  { key: "all", label: "전체", emoji: "📍" },
  { key: "charge", label: "충전", emoji: "🔌" },
  { key: "restroom", label: "화장실", emoji: "🚻" },
  { key: "rest", label: "쉬기", emoji: "🪑" },
  { key: "korean", label: "한국어", emoji: "🇰🇷" },
  { key: "caution", label: "응대 불편", emoji: "⚠️" }
];

const scenarios = [
  { key: "battery", label: "배터리 5%", filter: "charge", icon: "battery-low", emoji: "🔌", hint: "콘센트와 허락 여부 먼저" },
  { key: "toilet", label: "화장실 급함", filter: "restroom", icon: "toilet", emoji: "🚻", hint: "단독 이용 가능성 확인" },
  { key: "rain", label: "비 피하기", filter: "rest", icon: "cloud-rain", emoji: "☔", hint: "잠깐 머물기 좋은 곳" },
  { key: "korean", label: "한국어 필요", filter: "korean", icon: "languages", emoji: "🇰🇷", hint: "한국어 대응 신호" },
  { key: "caution", label: "응대 조심", filter: "caution", icon: "triangle-alert", emoji: "⚠️", hint: "불편 제보가 있는 곳" }
];

const reportTags = [
  { key: "charge", label: "충전 가능", emoji: "🔌" },
  { key: "permission", label: "직원 허락 필요", emoji: "🙋" },
  { key: "restroom", label: "화장실 가능", emoji: "🚻" },
  { key: "restroom-caution", label: "화장실만 이용 애매", emoji: "⚠️" },
  { key: "rest", label: "잠깐 쉬기 좋음", emoji: "🪑" },
  { key: "long-stay", label: "장시간 비추천", emoji: "⏱️" },
  { key: "wifi", label: "와이파이", emoji: "📶" },
  { key: "korean", label: "한국어 대응", emoji: "🇰🇷" },
  { key: "caution", label: "응대 불편", emoji: "⚠️", danger: true },
  { key: "rain", label: "비 피하기 좋음", emoji: "☔" }
];

const allowedReportLabels = new Set(reportTags.map((tag) => tag.label));

const signalForReportTag = {
  "충전 가능": "charge",
  "직원 허락 필요": "charge",
  "화장실 가능": "restroom",
  "화장실만 이용 애매": "restroom",
  "잠깐 쉬기 좋음": "rest",
  "장시간 비추천": "rest",
  "한국어 대응": "korean",
  "응대 불편": "caution",
  "비 피하기 좋음": "rest"
};

const filterThresholds = {
  charge: 8,
  restroom: 8,
  rest: 8,
  korean: 8,
  caution: 3
};

const places = [
  {
    id: "tokyo-shinjuku-east",
    name: "신주쿠 동쪽 카페형 스팟",
    area: "도쿄 신주쿠",
    city: "tokyo",
    kind: "카페/식당",
    lat: 35.6912,
    lng: 139.7044,
    category: "charge",
    trust: "자주 확인됨",
    tags: ["충전 가능", "와이파이", "혼자 쉬기 좋음"],
    signals: { charge: 18, restroom: 7, rest: 12, korean: 1, caution: 0 },
    walk: "도보 6분",
    lastSeen: "오늘 확인",
    crowd: "점심 혼잡",
    bestFor: "배터리 부족할 때 1순위",
    watchout: "콘센트 좌석은 먼저 확인하고 주문하는 편이 안전해요.",
    notes: ["혼잡 시간에는 장시간 체류가 부담스러울 수 있어요.", "콘센트는 좌석마다 다르니 주문 전에 확인하는 편이 좋아요."]
  },
  {
    id: "tokyo-ueno-public",
    name: "우에노역 근처 공공 편의 스팟",
    area: "도쿄 우에노",
    city: "tokyo",
    kind: "공공시설",
    lat: 35.7138,
    lng: 139.7772,
    category: "restroom",
    trust: "이용 가능성 높음",
    tags: ["화장실 가능", "잠깐 쉬기 좋음", "비 피하기 좋음"],
    signals: { charge: 2, restroom: 21, rest: 10, korean: 0, caution: 1 },
    walk: "도보 4분",
    lastSeen: "최근 1주",
    crowd: "낮 시간 보통",
    bestFor: "화장실이 급할 때",
    watchout: "늦은 시간에는 주변 동선과 운영 시간을 같이 확인해요.",
    notes: ["화장실 동선이 편한 편이라는 제보가 많아요.", "늦은 시간에는 주변 분위기를 확인하고 이동하는 편이 좋아요."]
  },
  {
    id: "tokyo-ikebukuro-rest",
    name: "이케부쿠로 북쪽 대기 스팟",
    area: "도쿄 이케부쿠로",
    city: "tokyo",
    kind: "실내 휴식",
    lat: 35.7311,
    lng: 139.7102,
    category: "rest",
    trust: "제보 있음",
    tags: ["잠깐 쉬기 좋음", "비 피하기 좋음"],
    signals: { charge: 1, restroom: 4, rest: 8, korean: 0, caution: 0 },
    walk: "도보 8분",
    lastSeen: "최근 1개월",
    crowd: "저녁 혼잡",
    bestFor: "약속 전 10분 대기",
    watchout: "매장 이용 조건은 현장 안내를 우선해야 해요.",
    notes: ["짧게 대기하기 좋다는 제보가 있어요.", "매장 이용 조건은 현장 안내를 우선해야 해요."]
  },
  {
    id: "tokyo-shinokubo-korean",
    name: "신오쿠보 한국어 대응 가능 구역",
    area: "도쿄 신오쿠보",
    city: "tokyo",
    kind: "상점가",
    lat: 35.7008,
    lng: 139.7003,
    category: "korean",
    trust: "자주 확인됨",
    tags: ["한국어 대응", "혼자 이용 편함", "화장실 가능"],
    signals: { charge: 5, restroom: 9, rest: 6, korean: 24, caution: 0 },
    walk: "도보 5분",
    lastSeen: "오늘 확인",
    crowd: "주말 혼잡",
    bestFor: "일본어가 막힐 때",
    watchout: "가게마다 한국어 대응 정도가 달라 상세 태그를 같이 봐요.",
    notes: ["한국어 메뉴나 안내가 있는 곳이 많다는 제보가 모여 있어요.", "가게별 조건 차이가 커서 상세 태그 확인이 필요해요."]
  },
  {
    id: "tokyo-shibuya-caution",
    name: "시부야 혼잡 구역 주의 스팟",
    area: "도쿄 시부야",
    city: "tokyo",
    kind: "혼잡 상권",
    lat: 35.6595,
    lng: 139.7005,
    category: "caution",
    trust: "주의 제보 있음",
    tags: ["응대 불편", "장시간 비추천", "직원 허락 필요"],
    signals: { charge: 3, restroom: 2, rest: 2, korean: 0, caution: 5 },
    walk: "도보 7분",
    lastSeen: "최근 1주",
    crowd: "상시 혼잡",
    bestFor: "방문 전 분위기 확인",
    watchout: "응대 불편은 단정이 아니라 주의 신호예요. 반대 경험도 같이 반영돼요.",
    notes: ["응대 불편 제보가 여러 건 있어요. 단정 표현 대신 방문 전 확인 신호로만 표시해요.", "반대 경험이 있으면 같은 장소에서 '문제없었음' 신호로 균형을 맞출 수 있어요."]
  },
  {
    id: "osaka-namba-charge",
    name: "난바역 근처 충전 확인 스팟",
    area: "오사카 난바",
    city: "osaka",
    kind: "카페/식당",
    lat: 34.6657,
    lng: 135.5019,
    category: "charge",
    trust: "제보 있음",
    tags: ["충전 가능", "직원 허락 필요", "와이파이"],
    signals: { charge: 10, restroom: 3, rest: 4, korean: 1, caution: 0 },
    walk: "도보 6분",
    lastSeen: "최근 1주",
    crowd: "오후 보통",
    bestFor: "난바 이동 전 충전",
    watchout: "주문 없이 충전만 하는 이용은 피하는 편이 좋아요.",
    notes: ["콘센트 좌석이 제한적이라는 제보가 있어요.", "주문 없이 충전만 하는 이용은 피하는 편이 좋아요."]
  },
  {
    id: "fukuoka-hakata-restroom",
    name: "하카타역 주변 화장실 확인 스팟",
    area: "후쿠오카 하카타",
    city: "fukuoka",
    kind: "역 주변",
    lat: 33.5904,
    lng: 130.4206,
    category: "restroom",
    trust: "이용 가능성 높음",
    tags: ["화장실 가능", "잠깐 쉬기 좋음"],
    signals: { charge: 1, restroom: 16, rest: 8, korean: 0, caution: 0 },
    walk: "도보 3분",
    lastSeen: "최근 1주",
    crowd: "출퇴근 혼잡",
    bestFor: "하카타역 이동 중 급할 때",
    watchout: "시설 운영 시간은 계절과 행사에 따라 달라질 수 있어요.",
    notes: ["역 주변 이동 중 급할 때 확인하기 좋은 위치예요.", "시설 운영 시간은 계절과 행사에 따라 달라질 수 있어요."]
  },
  {
    id: "kyoto-station-rest",
    name: "교토역 대기와 휴식 스팟",
    area: "교토역",
    city: "kyoto",
    kind: "역 주변",
    lat: 34.9859,
    lng: 135.7588,
    category: "rest",
    trust: "제보 있음",
    tags: ["잠깐 쉬기 좋음", "비 피하기 좋음", "화장실 가능"],
    signals: { charge: 2, restroom: 11, rest: 13, korean: 0, caution: 0 },
    walk: "도보 5분",
    lastSeen: "최근 1개월",
    crowd: "성수기 혼잡",
    bestFor: "짐이 많을 때 동선 정리",
    watchout: "관광 성수기에는 혼잡도가 빠르게 올라가요.",
    notes: ["짐이 많을 때 잠깐 동선을 정리하기 좋다는 제보가 있어요.", "관광 성수기에는 혼잡도가 빠르게 올라가요."]
  }
];

const state = {
  filter: "all",
  query: "",
  selectedId: places[0].id,
  activePanel: "near",
  activeScenario: "",
  saved: normalizeSaved(readJson("sumimap:saved", [])),
  reports: normalizeReports(readJson("sumimap:reports", []))
};

const sheet = document.querySelector("#sheet");
const toast = document.querySelector("#toast");
const statusPill = document.querySelector("#statusPill");
const searchPanel = document.querySelector("#searchPanel");
const searchToggle = document.querySelector("#searchToggle");
const placeSearch = document.querySelector("#placeSearch");

let map;
let markerLayer;
const markers = new Map();
let started = false;

startWhenReady();

function startWhenReady() {
  if (started) return;
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startWhenReady, { once: true });
    return;
  }
  if (!window.L) {
    window.setTimeout(startWhenReady, 16);
    return;
  }
  started = true;
  init();
}

function init() {
  bootMap();
  bindEvents();
  renderSheet();
  renderMarkers();
  refreshStatus();
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }
}

function bootMap() {
  map = L.map("map", {
    zoomControl: false,
    attributionControl: true
  }).setView(cities.tokyo.center, cities.tokyo.zoom);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap"
  }).addTo(map);

  L.control.zoom({ position: "topright" }).addTo(map);
  markerLayer = L.layerGroup().addTo(map);
}

function bindEvents() {
  document.querySelectorAll(".nav-button").forEach((button) => {
    button.addEventListener("click", () => {
      setPanel(button.dataset.action);
    });
  });

  searchToggle.addEventListener("click", () => {
    searchPanel.hidden = !searchPanel.hidden;
    if (!searchPanel.hidden) placeSearch.focus();
  });

  placeSearch.addEventListener("input", (event) => {
    state.query = event.target.value.trim();
    syncSelectedWithFiltered();
    renderSheet();
    renderMarkers();
    refreshStatus();
  });

  document.querySelectorAll("[data-city]").forEach((button) => {
    button.addEventListener("click", () => {
      const city = cities[button.dataset.city];
      if (!city) return;
      map.setView(city.center, city.zoom);
      showToast(`${city.label} 중심으로 이동했어.`);
      searchPanel.hidden = true;
    });
  });

  sheet.addEventListener("submit", (event) => {
    const form = event.target.closest("#reportForm");
    if (!form) return;
    event.preventDefault();
    submitReport(form);
  });

  sheet.addEventListener("click", (event) => {
    const placeButton = event.target.closest("[data-place-id]");
    if (placeButton) {
      selectPlace(placeButton.dataset.placeId, true);
      return;
    }

    const filterButton = event.target.closest("[data-filter]");
    if (filterButton) {
      state.filter = filterButton.dataset.filter;
      state.activeScenario = "";
      syncSelectedWithFiltered();
      renderSheet();
      renderMarkers();
      refreshStatus();
      return;
    }

    const scenarioButton = event.target.closest("[data-scenario]");
    if (scenarioButton) {
      applyScenario(scenarioButton.dataset.scenario);
      return;
    }

    const reportOpenButton = event.target.closest("[data-open-report]");
    if (reportOpenButton) {
      setPanel("report");
      return;
    }

    const saveButton = event.target.closest("[data-save]");
    if (saveButton) {
      toggleSave(saveButton.dataset.save);
      return;
    }

    const reportChip = event.target.closest("[data-report-tag]");
    if (reportChip) {
      reportChip.classList.toggle("is-selected");
      return;
    }

    const form = event.target.closest("#reportForm");
    const submit = event.target.closest("[data-submit-report]");
    if (form && submit) {
      event.preventDefault();
      submitReport(form);
      return;
    }

    const reportVote = event.target.closest("[data-report-vote]");
    if (reportVote) {
      voteReport(reportVote.dataset.reportId, reportVote.dataset.reportVote);
    }
  });
}

function setPanel(panel) {
  state.activePanel = panel;
  document.querySelectorAll(".nav-button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.action === panel);
  });

  if (panel === "near") {
    const place = getSelectedPlace();
    if (place) map.setView([place.lat, place.lng], 14);
  }

  renderSheet();
}

function renderSheet() {
  if (state.activePanel === "filters") {
    sheet.innerHTML = renderFilters();
  } else if (state.activePanel === "report") {
    sheet.innerHTML = renderReport();
  } else if (state.activePanel === "saved") {
    sheet.innerHTML = renderSaved();
  } else if (state.activePanel === "guide") {
    sheet.innerHTML = renderGuide();
  } else {
    sheet.innerHTML = renderNearby();
  }
}

function renderNearby() {
  const list = getFilteredPlaces();
  const place = list.find((item) => item.id === state.selectedId) || null;

  return `
    <div class="sheet-grip"></div>
    <div class="sheet-head">
      <div>
        <h1>지금 확인할 생활 스팟</h1>
        <p>충전, 화장실, 쉬기, 한국어 대응, 응대 불편 신호를 한 번에 봐요.</p>
      </div>
      <span class="compact-stat">${list.length}곳</span>
    </div>
    ${renderScenarioRail()}
    <div class="filter-row">
      ${categories.map((item) => filterChip(item)).join("")}
    </div>
    ${place ? renderPlaceDetail(place) : renderEmptyState()}
    ${list.length ? `<div class="place-list">${list.map((item) => renderPlaceCard(item)).join("")}</div>` : ""}
  `;
}

function renderFilters() {
  return `
    <div class="sheet-grip"></div>
    <div class="sheet-head">
      <div>
        <h2>필터</h2>
        <p>상황별로 빠르게 좁혀요. 응대 불편은 낙인이 아니라 최근 제보 신호로만 봐요.</p>
      </div>
    </div>
    ${renderScenarioRail()}
    <div class="filter-row">
      ${categories.map((item) => filterChip(item)).join("")}
    </div>
    <ul class="note-list">
      <li>충전은 콘센트 위치와 직원 허락 여부를 같이 봐야 정확해요.</li>
      <li>화장실은 단독 이용 가능 여부가 장소마다 달라요.</li>
      <li>응대 불편은 1건으로 공개하지 않고 반복 신호일 때만 약하게 표시하는 전제로 설계했어요.</li>
    </ul>
  `;
}

function renderReport() {
  const place = getSelectedPlace();
  const visibleReports = getVisibleReports();
  return `
    <div class="sheet-grip"></div>
    <div class="sheet-head">
      <div>
        <h2>제보하기</h2>
        <p>제보는 바로 지도에 반영돼요. 허위로 보이면 다른 사람이 허위 의심을 눌러 신호를 밀어낼 수 있어요.</p>
      </div>
      <span class="compact-stat">반영 ${visibleReports.length}</span>
    </div>
    <form class="report-form" id="reportForm">
      <div class="form-section">
        <h3>장소</h3>
        <select class="mini-field" name="placeId" aria-label="제보할 장소">
          ${places.map((item) => `<option value="${item.id}" ${item.id === place?.id ? "selected" : ""}>${item.name}</option>`).join("")}
        </select>
      </div>
      <div class="form-section">
        <h3>확인한 내용</h3>
        <p>해당되는 버튼만 눌러요. 응대 불편은 단정이 아니라 방문자 주의 신호로 바로 반영돼요.</p>
        <div class="report-grid">
          ${reportTags.map((tag) => `
            <button type="button" class="chip report-chip ${tag.danger ? "danger" : ""}" data-report-tag="${escapeAttr(tag.key)}" aria-label="${escapeAttr(tag.label)}">
              <span class="report-emoji" aria-hidden="true">${tag.emoji}</span>
              <span>${tag.label}</span>
            </button>
          `).join("")}
        </div>
      </div>
      <div class="form-section">
        <h3>방문 시점</h3>
        <select class="mini-field" name="recency" aria-label="방문 시점">
          <option value="today">오늘</option>
          <option value="week">최근 1주일</option>
          <option value="month">최근 1개월</option>
          <option value="old">이전 기억</option>
        </select>
      </div>
      <button class="primary-button" type="submit" data-submit-report>
        ${icon("send")}
        바로 제보
      </button>
    </form>
  `;
}

function renderSaved() {
  const savedPlaces = places.filter((place) => state.saved.includes(place.id));
  return `
    <div class="sheet-grip"></div>
    <div class="sheet-head">
      <div>
        <h2>저장한 곳</h2>
        <p>도쿄, 오사카, 후쿠오카에서 다시 볼 장소를 모아둬요.</p>
      </div>
      <span class="compact-stat">${savedPlaces.length}곳</span>
    </div>
    <div class="place-list">
      ${savedPlaces.length ? savedPlaces.map((item) => renderPlaceCard(item)).join("") : `<div class="place-card"><h3>아직 저장한 장소가 없어요</h3><p>장소 상세에서 저장을 누르면 여기에 모여요.</p></div>`}
    </div>
  `;
}

function renderGuide() {
  return `
    <div class="sheet-grip"></div>
    <div class="sheet-head">
      <div>
        <h2>스미맵 기준</h2>
        <p>일본 생활 중 곤란한 순간을 빠르게 피하기 위한 한국어 지도예요.</p>
      </div>
    </div>
    <ul class="note-list">
      <li>응대 불편은 상대를 공격하는 표시가 아니라, 방문자가 조심할 수 있게 만드는 약한 신호예요.</li>
      <li>제보는 바로 반영하되 자유 텍스트는 열지 않아 애드센스와 운영 리스크를 낮춰요.</li>
      <li>허위 의심이 누적되고 동의보다 많아지면 해당 제보는 자동으로 신호 계산에서 빠지는 구조예요.</li>
    </ul>
    <div class="detail-actions">
      <a class="text-button" href="/guide/">${icon("book-open")}운영 기준</a>
      <a class="text-button" href="/policy/">${icon("shield-check")}제보 정책</a>
    </div>
  `;
}

function renderPlaceDetail(place) {
  const saved = state.saved.includes(place.id);
  const signals = getLiveSignals(place);
  const tags = getLiveTags(place);
  const reports = getVisibleReportsForPlace(place.id).slice(0, 4);
  const caution = signals.caution > 0;
  const trustScore = getTrustScore(place);

  return `
    <section class="place-card is-selected">
      <div class="place-title-row">
        <div>
          <h3><span class="place-title-emoji" aria-hidden="true">${categoryEmoji(place.category)}</span>${place.name}</h3>
          <p>${place.area} · ${place.kind}</p>
        </div>
        <span class="badge ${caution ? "caution" : reports.length ? "info" : "good"}">${getLiveTrust(place)}</span>
      </div>
      <div class="tag-row" aria-label="장소 태그">
        ${tags.map((tag) => `<span class="badge ${tag === "응대 불편" ? "caution" : tag.includes("충전") || tag.includes("와이파이") ? "info" : tag.includes("비") || tag.includes("허락") ? "warn" : "good"}"><span class="badge-emoji" aria-hidden="true">${emojiForTag(tag)}</span>${tag}</span>`).join("")}
      </div>
      <div class="detail-actions">
        <button class="text-button" type="button" data-save="${place.id}">
          ${icon(saved ? "bookmark-check" : "bookmark")}
          ${saved ? "저장됨" : "저장"}
        </button>
        <a class="text-button" href="${mapsUrl(place)}" target="_blank" rel="noreferrer">
          ${icon("navigation")}
          길찾기
        </a>
      </div>
      <div class="detail-actions single">
        <button class="primary-button" type="button" data-open-report>
          ${icon("plus")}
          이 장소 바로 제보
        </button>
      </div>
      <div class="use-summary">
        <div>
          <span>거리감</span>
          <strong>${place.walk || "도보 확인"}</strong>
        </div>
        <div>
          <span>최근 확인</span>
          <strong>${place.lastSeen || "제보 필요"}</strong>
        </div>
        <div>
          <span>혼잡</span>
          <strong>${place.crowd || "현장 확인"}</strong>
        </div>
        <div>
          <span>신뢰도</span>
          <strong>${trustScore}%</strong>
        </div>
      </div>
      <div class="decision-card ${caution ? "is-caution" : ""}">
        <div>
          <span>이럴 때 좋아요</span>
          <strong>${place.bestFor || "잠깐 확인이 필요할 때"}</strong>
        </div>
        <p>${place.watchout || "운영 시간과 현장 안내를 먼저 확인해요."}</p>
      </div>
      <div class="signal-grid">
        <div class="signal"><strong>${signals.charge}</strong><span>충전 제보</span></div>
        <div class="signal"><strong>${signals.restroom}</strong><span>화장실 제보</span></div>
        <div class="signal"><strong>${signals.rest}</strong><span>쉬기 제보</span></div>
        <div class="signal"><strong>${signals.korean}</strong><span>한국어 신호</span></div>
        <div class="signal"><strong>${signals.caution}</strong><span>응대 불편</span></div>
        <div class="signal"><strong>${totalSignals(place)}</strong><span>누적 신호</span></div>
      </div>
      <ul class="note-list">
        ${place.notes.map((note) => `<li>${note}</li>`).join("")}
      </ul>
      ${renderReportFeed(reports)}
    </section>
  `;
}

function renderPlaceCard(place) {
  const signals = getLiveSignals(place);
  const caution = signals.caution > 0;
  return `
    <button type="button" class="place-card ${place.id === state.selectedId ? "is-selected" : ""}" data-place-id="${place.id}">
      <div class="place-title-row">
        <div>
          <h3><span class="place-title-emoji" aria-hidden="true">${categoryEmoji(place.category)}</span>${place.name}</h3>
          <p>${place.area} · ${getLiveTags(place).slice(0, 3).map((tag) => `${emojiForTag(tag)} ${tag}`).join(" · ")}</p>
          <small class="card-meta">${place.walk || "거리 확인"} · ${place.lastSeen || "최근 확인 필요"} · 신뢰 ${getTrustScore(place)}%</small>
        </div>
        <span class="badge ${caution ? "caution" : "info"}">${getLiveTrust(place)}</span>
      </div>
    </button>
  `;
}

function renderEmptyState() {
  const label = categories.find((item) => item.key === state.filter)?.label || "조건";
  return `
    <section class="place-card empty-card">
      <h3>조건에 맞는 장소가 아직 없어요</h3>
      <p>${state.query ? `"${escapeHtml(state.query)}" 검색 결과가 없어요. ` : ""}${label} 제보를 남기면 바로 지도에 반영돼요.</p>
      <button class="primary-button" type="button" data-open-report>
        ${icon("plus")}
        새 제보 남기기
      </button>
    </section>
  `;
}

function renderScenarioRail() {
  return `
    <div class="scenario-rail" aria-label="빠른 상황">
      ${scenarios.map((scenario) => `
        <button type="button" class="scenario-chip ${state.activeScenario === scenario.key ? "is-active" : ""}" data-scenario="${scenario.key}">
          <span class="scenario-emoji" aria-hidden="true">${scenario.emoji}</span>
          <span>${scenario.label}</span>
          <small>${scenario.hint}</small>
        </button>
      `).join("")}
    </div>
  `;
}

function renderReportFeed(reports) {
  if (!reports.length) {
    return `
      <div class="live-feed">
        <div class="feed-head">
          <strong>최근 제보</strong>
          <span>아직 실시간 제보 없음</span>
        </div>
      </div>
    `;
  }

  return `
    <div class="live-feed">
      <div class="feed-head">
        <strong>최근 제보</strong>
        <span>바로 반영됨</span>
      </div>
      ${reports.map((report) => `
        <article class="feed-item">
          <div>
            <p>${report.tags.map((tag) => `${emojiForTag(tag)} ${escapeHtml(tag)}`).join(" · ")}</p>
            <small>${formatRecency(report.recency)} · 동의 ${report.agrees} · 허위 의심 ${report.disputes}</small>
          </div>
          <div class="feed-actions">
            <button type="button" data-report-id="${escapeAttr(report.id)}" data-report-vote="agree">동의</button>
            <button type="button" data-report-id="${escapeAttr(report.id)}" data-report-vote="dispute">허위 의심</button>
          </div>
        </article>
      `).join("")}
    </div>
  `;
}

function filterChip(item) {
  return `<button type="button" class="chip ${state.filter === item.key ? "is-active" : ""}" data-filter="${item.key}"><span class="chip-emoji" aria-hidden="true">${item.emoji}</span><span>${item.label}</span></button>`;
}

function renderMarkers() {
  markerLayer.clearLayers();
  markers.clear();

  getFilteredPlaces().forEach((place) => {
    const marker = L.marker([place.lat, place.lng], {
      icon: L.divIcon({
        className: `sumimap-marker marker-${place.category} ${place.id === state.selectedId ? "is-selected" : ""}`,
        html: markerLabel(place.category)
      })
    });
    marker.on("click", () => selectPlace(place.id, false));
    marker.addTo(markerLayer);
    markers.set(place.id, marker);
  });
}

function selectPlace(placeId, moveMap) {
  const place = places.find((item) => item.id === placeId);
  if (!place) return;
  state.selectedId = place.id;
  state.activePanel = "near";
  document.querySelectorAll(".nav-button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.action === "near");
  });
  if (moveMap) {
    map.setView([place.lat, place.lng], 15);
  }
  renderSheet();
  renderMarkers();
}

function applyScenario(scenarioKey) {
  const scenario = scenarios.find((item) => item.key === scenarioKey);
  if (!scenario) return;

  state.activeScenario = scenario.key;
  state.filter = scenario.filter;
  state.query = "";
  placeSearch.value = "";
  const list = getFilteredPlaces();
  if (list.length && !list.some((place) => place.id === state.selectedId)) {
    state.selectedId = list[0].id;
    map.setView([list[0].lat, list[0].lng], 14);
  }
  showToast(`${scenario.label} 상황으로 좁혔어.`);
  renderSheet();
  renderMarkers();
  refreshStatus();
}

function submitReport(form) {
  const selected = [...form.querySelectorAll("[data-report-tag].is-selected")]
    .map((button) => labelForReportKey(button.dataset.reportTag))
    .filter(Boolean);
  if (!selected.length) {
    showToast("확인한 내용을 하나 이상 선택해줘.");
    return;
  }

  const data = new FormData(form);
  const report = {
    id: createId(),
    placeId: data.get("placeId"),
    tags: selected,
    recency: data.get("recency"),
    createdAt: new Date().toISOString(),
    agrees: 0,
    disputes: 0
  };

  state.reports.unshift(report);
  writeJson("sumimap:reports", state.reports.slice(0, 100));
  state.selectedId = report.placeId;
  state.activePanel = "near";
  state.activeScenario = "";
  state.filter = "all";
  state.query = "";
  placeSearch.value = "";
  searchPanel.hidden = true;
  document.querySelectorAll(".nav-button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.action === "near");
  });
  showToast("제보가 바로 반영됐어. 허위면 다른 사람들이 허위 의심으로 밀어낼 수 있어.");
  renderSheet();
  renderMarkers();
  refreshStatus();
}

function voteReport(reportId, vote) {
  const report = state.reports.find((item) => item.id === reportId);
  if (!report) return;

  if (vote === "agree") {
    report.agrees += 1;
    showToast("동의가 반영됐어.");
  } else if (vote === "dispute") {
    report.disputes += 1;
    showToast(isHiddenReport(report) ? "허위 의심이 누적되어 신호 계산에서 빠졌어." : "허위 의심을 반영했어.");
  }

  writeJson("sumimap:reports", state.reports);
  renderSheet();
  renderMarkers();
  refreshStatus();
}

function toggleSave(placeId) {
  if (state.saved.includes(placeId)) {
    state.saved = state.saved.filter((id) => id !== placeId);
    showToast("저장에서 뺐어.");
  } else {
    state.saved.unshift(placeId);
    showToast("저장했어.");
  }
  writeJson("sumimap:saved", state.saved);
  renderSheet();
}

function getSelectedPlace() {
  return places.find((item) => item.id === state.selectedId) || places[0];
}

function syncSelectedWithFiltered() {
  const list = getFilteredPlaces();
  if (!list.length) return;
  if (!list.some((place) => place.id === state.selectedId)) {
    state.selectedId = list[0].id;
  }
}

function getFilteredPlaces() {
  const normalized = state.query.toLowerCase();
  return places.filter((place) => {
    const signals = getLiveSignals(place);
    const liveTags = getLiveTags(place);
    const threshold = filterThresholds[state.filter] || 1;
    const filterMatch =
      state.filter === "all" ||
      place.category === state.filter ||
      signals[state.filter] >= threshold ||
      liveTags.some((tag) => tag.includes(labelForFilter(state.filter)));
    const queryMatch =
      !normalized ||
      `${place.name} ${place.area} ${place.kind} ${liveTags.join(" ")}`.toLowerCase().includes(normalized);
    return filterMatch && queryMatch;
  });
}

function refreshStatus() {
  const visible = getFilteredPlaces();
  const scenario = scenarios.find((item) => item.key === state.activeScenario);
  statusPill.textContent = scenario ? `${scenario.label} · ${visible.length}곳` : `${visible.length}곳 표시 · 바로 제보`;
}

function totalSignals(place) {
  return Object.values(getLiveSignals(place)).reduce((sum, value) => sum + value, 0);
}

function markerLabel(category) {
  return categoryEmoji(category);
}

function labelForFilter(filter) {
  return {
    charge: "충전",
    restroom: "화장실",
    rest: "쉬",
    korean: "한국어",
    caution: "응대"
  }[filter] || "";
}

function categoryEmoji(category) {
  return categories.find((item) => item.key === category)?.emoji || "📍";
}

function labelForReportKey(key) {
  return reportTags.find((tag) => tag.key === key)?.label || "";
}

function emojiForTag(label) {
  const reportTag = reportTags.find((tag) => tag.label === label);
  if (reportTag) return reportTag.emoji;
  if (label.includes("와이파이")) return "📶";
  if (label.includes("충전")) return "🔌";
  if (label.includes("화장실")) return "🚻";
  if (label.includes("비")) return "☔";
  if (label.includes("한국어")) return "🇰🇷";
  if (label.includes("허락")) return "🙋";
  if (label.includes("응대") || label.includes("비추천")) return "⚠️";
  if (label.includes("쉬") || label.includes("대기") || label.includes("혼자")) return "🪑";
  return "📍";
}

function icon(name) {
  const paths = {
    send: `<path d="M21 3 10 14"/><path d="m21 3-7 18-4-7-7-4 18-7Z"/>`,
    "book-open": `<path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H20v17H7.5A3.5 3.5 0 0 0 4 22V5.5Z"/><path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H20"/>`,
    "shield-check": `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-5"/>`,
    bookmark: `<path d="M6 4h12v17l-6-3.5L6 21V4Z"/>`,
    "bookmark-check": `<path d="M6 4h12v17l-6-3.5L6 21V4Z"/><path d="m9 11 2 2 4-5"/>`,
    navigation: `<path d="M12 2 3 21l9-4 9 4-9-19Z"/>`,
    plus: `<path d="M12 5v14M5 12h14"/>`,
    "battery-low": `<rect x="3" y="7" width="16" height="10" rx="2"/><path d="M21 11v2"/><path d="M7 11v2"/>`,
    toilet: `<path d="M7 3h10v8a5 5 0 0 1-5 5h-1a4 4 0 0 1-4-4V3Z"/><path d="M8 21h8"/><path d="M12 16v5"/>`,
    "cloud-rain": `<path d="M17 18a5 5 0 0 0 0-10 7 7 0 0 0-13 3 4 4 0 0 0 1 7"/><path d="M8 19v2M12 19v2M16 19v2"/>`,
    languages: `<path d="M5 8h8"/><path d="M9 4v4c0 4-2 7-5 9"/><path d="M7 12c1 2 3 4 6 5"/><path d="M15 21l4-9 4 9"/><path d="M17 17h4"/>`,
    "triangle-alert": `<path d="M12 3 2 21h20L12 3Z"/><path d="M12 9v5M12 17h.01"/>`
  };
  return `<svg class="inline-icon" viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.plus}</svg>`;
}

function getLiveSignals(place) {
  const signals = { ...place.signals };
  getVisibleReportsForPlace(place.id).forEach((report) => {
    report.tags.forEach((tag) => {
      const key = signalForReportTag[tag];
      if (key) signals[key] += 1;
    });
  });
  return signals;
}

function getLiveTags(place) {
  const tags = new Set(place.tags);
  getVisibleReportsForPlace(place.id).forEach((report) => {
    report.tags.forEach((tag) => tags.add(tag));
  });
  return [...tags].slice(0, 8);
}

function getLiveTrust(place) {
  const reports = getVisibleReportsForPlace(place.id);
  if (reports.length) return `${reports.length}건 즉시 반영`;
  return place.trust;
}

function getTrustScore(place) {
  const total = totalSignals(place);
  const reports = getVisibleReportsForPlace(place.id);
  const disputes = reports.reduce((sum, report) => sum + report.disputes, 0);
  const agrees = reports.reduce((sum, report) => sum + report.agrees, 0);
  return Math.max(48, Math.min(98, Math.round(62 + Math.min(total, 42) * 0.7 + agrees * 3 - disputes * 5)));
}

function getVisibleReports() {
  return state.reports.filter((report) => !isHiddenReport(report));
}

function getVisibleReportsForPlace(placeId) {
  return getVisibleReports().filter((report) => report.placeId === placeId);
}

function isHiddenReport(report) {
  return report.disputes >= 3 && report.disputes > report.agrees;
}

function normalizeReports(reports) {
  if (!Array.isArray(reports)) return [];
  const validPlaceIds = new Set(places.map((place) => place.id));
  return reports
    .map((report, index) => ({
      id: safeId(report?.id, `legacy-${index}-${report?.createdAt || Date.now()}`),
      placeId: validPlaceIds.has(report?.placeId) ? report.placeId : "",
      tags: Array.isArray(report?.tags) ? report.tags.filter((tag) => allowedReportLabels.has(tag)) : [],
      recency: ["today", "week", "month", "old"].includes(report?.recency) ? report.recency : "old",
      createdAt: report?.createdAt || new Date().toISOString(),
      agrees: clampCount(report?.agrees),
      disputes: clampCount(report?.disputes)
    }))
    .filter((report) => report.placeId && report.tags.length)
    .slice(0, 100);
}

function normalizeSaved(ids) {
  if (!Array.isArray(ids)) return [];
  const validPlaceIds = new Set(places.map((place) => place.id));
  return [...new Set(ids.filter((id) => validPlaceIds.has(id)))];
}

function safeId(value, fallback) {
  const id = String(value || fallback).replace(/[^a-zA-Z0-9:_-]/g, "").slice(0, 90);
  return id || String(fallback).replace(/[^a-zA-Z0-9:_-]/g, "").slice(0, 90);
}

function clampCount(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.max(0, Math.min(999, Math.floor(number)));
}

function createId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `report-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function formatRecency(recency) {
  return {
    today: "오늘 확인",
    week: "최근 1주일",
    month: "최근 1개월",
    old: "이전 기억"
  }[recency] || "방문 시점 미상";
}

function mapsUrl(place) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place.lat},${place.lng}`)}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttr(value) {
  return escapeHtml(value).replaceAll("`", "&#96;");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2300);
}

function readJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    showToast("기기 저장 공간이 부족해서 이번 변경은 임시로만 반영됐어.");
  }
}
