// 영농폐기물 공동집하장 찾기: 시·도 → 시·군·구 → 읍·면·동 browsing and search.
// Data: per-province JSON built from the verified 2025-08-27 TSV.
(() => {
  const indexNode = document.getElementById("finder-index");
  if (!indexNode) return;
  const INDEX = JSON.parse(indexNode.textContent);
  const DATA_BASE = `/data/farm-waste/${INDEX.v}/`;
  const NO_AREA = INDEX.noArea;
  const PAGE = 20;
  const LAST_KEY = "sumimap:last-region";

  const $ = (id) => document.getElementById(id);
  const form = $("finder-form");
  const input = $("finder-q");
  const trail = $("trail");
  const stepTitle = $("step-title");
  const stepHelp = $("step-help");
  const choices = $("choices");
  const lastRegion = $("last-region");
  const resultsBox = $("results-box");
  const resultsTitle = $("results-title");
  const status = $("status");
  const results = $("results");
  const moreRow = $("more-row");
  const moreButton = $("more");
  const visitLocal = $("visit-local");

  const provinces = INDEX.p;
  const cache = new Map();
  const state = { province: null, city: null, area: "", q: "", limit: PAGE };
  let renderToken = 0;
  let typingTimer;

  const fmt = (n) => n.toLocaleString("ko-KR");
  const norm = (text) => String(text).replace(/\s+/g, "").toLowerCase();
  // "고단리" should also find "고단1리"; a query with a number stays exact.
  // Keep in sync with looseVillage() in scripts/lib/farm-data.mjs.
  const loose = (text) => text.replace(/([가-힣]+리)[0-9]+리/g, "$1").replace(/([가-힣])[0-9]+리/g, "$1리");
  const rowHas = (row, part) => (/[0-9]/.test(part) ? row.key.includes(part) : row.loose.includes(part));

  // Keep in sync with mapQuery() in scripts/lib/farm-data.mjs.
  function mapQuery(address) {
    return address
      .replace(/\([^)]*\)/g, " ")
      .replace(/(읍|면)(?=[가-힣]+[0-9]*리)/g, "$1 ")
      .replace(/([가-힣]+리)[0-9]+리/g, "$1")
      .replace(/([가-힣])[0-9]+리(?=$|\s|산|[0-9])/g, "$1리")
      .replace(/리(?=산?[0-9])/g, "리 ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function findProvince(value) {
    if (!value) return null;
    return provinces.find((p) => p.n === value || p.k === value || p.s === value) || null;
  }

  function useAreas(city) {
    return city && city.a.length > 1 && city.na / city.c < 0.5;
  }

  function loadProvince(p) {
    if (!cache.has(p.s)) {
      const request = fetch(`${DATA_BASE}${p.s}.json`)
        .then((response) => {
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          return response.json();
        })
        .then((json) => json.rows.map((r) => {
          const key = norm(`${p.n}${p.k}${r[0]}${r[1] === NO_AREA ? "" : r[1]}${r[2]}${r[3]}`);
          return { p, city: r[0], area: r[1], name: r[2], address: r[3], key, loose: loose(key) };
        }));
      request.catch(() => cache.delete(p.s));
      cache.set(p.s, request);
    }
    return cache.get(p.s);
  }

  // ---------- URL state ----------
  function readUrl() {
    const params = new URLSearchParams(location.search);
    const p = findProvince(params.get("province"));
    const city = p ? p.ci.find((c) => c.n === params.get("city")) || null : null;
    const areaParam = params.get("area") || "";
    const area = city && city.a.some(([name]) => name === areaParam) ? areaParam : "";
    state.province = p;
    state.city = city;
    state.area = area;
    state.q = (params.get("q") || "").slice(0, 40);
    state.limit = PAGE;
    input.value = state.q;
  }

  function writeUrl(push) {
    const url = new URL(location.href);
    for (const key of ["province", "city", "area", "q"]) url.searchParams.delete(key);
    if (state.province) url.searchParams.set("province", state.province.n);
    if (state.city) url.searchParams.set("city", state.city.n);
    if (state.area) url.searchParams.set("area", state.area);
    if (state.q) url.searchParams.set("q", state.q);
    if (url.href === location.href) return;
    history[push ? "pushState" : "replaceState"](null, "", url);
  }

  function remember() {
    if (!state.province || !state.city) return;
    try {
      localStorage.setItem(LAST_KEY, JSON.stringify({ province: state.province.n, city: state.city.n, area: state.area }));
    } catch { /* storage may be blocked */ }
  }

  function showLastRegion() {
    lastRegion.hidden = true;
    if (state.province || state.q) return;
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem(LAST_KEY) || "null"); } catch { saved = null; }
    const p = saved && findProvince(saved.province);
    const city = p && p.ci.find((c) => c.n === saved.city);
    if (!city) return;
    const area = city.a.some(([name]) => name === saved.area) ? saved.area : "";
    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn-line";
    button.textContent = `지난번에 본 지역: ${p.k} ${city.n}${area && area !== NO_AREA ? ` ${area}` : ""}`;
    button.addEventListener("click", () => go({ province: p, city, area, q: "" }));
    lastRegion.replaceChildren(button);
    lastRegion.hidden = false;
  }

  // ---------- Navigation ----------
  function go(next, { focus = "step" } = {}) {
    Object.assign(state, next, { limit: PAGE });
    input.value = state.q;
    writeUrl(true);
    remember();
    render({ focus });
  }

  function chip(label, count, onClick, { pressed = false, all = false } = {}) {
    const li = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.className = all ? "chip chip-all" : "chip";
    if (pressed) button.setAttribute("aria-pressed", "true");
    const name = document.createElement("span");
    name.textContent = label;
    const num = document.createElement("span");
    num.className = "count";
    num.textContent = `${fmt(count)}건`;
    button.append(name, num);
    button.addEventListener("click", onClick);
    li.append(button);
    return li;
  }

  function renderTrail() {
    trail.replaceChildren();
    const items = [];
    if (state.province) items.push(["전국", () => go({ province: null, city: null, area: "", q: "" })]);
    if (state.city) items.push([state.province.k, () => go({ city: null, area: "", q: "" })]);
    if (state.area) items.push([state.city.n, () => go({ area: "", q: "" })]);
    for (const [label, action] of items) {
      const li = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = `← ${label}`;
      button.addEventListener("click", action);
      li.append(button);
      trail.append(li);
    }
    trail.hidden = items.length === 0;
  }

  function renderStep() {
    choices.replaceChildren();
    stepHelp.textContent = "";
    const p = state.province;
    const city = state.city;
    if (!p) {
      stepTitle.textContent = "1단계 · 시·도를 고르세요";
      stepHelp.textContent = "자료에 주소가 있는 14개 시·도만 보입니다. 다른 지역에 집하장이 없다는 뜻은 아닙니다.";
      for (const item of provinces) choices.append(chip(item.k, item.c, () => go({ province: item, city: null, area: "", q: "" })));
      return;
    }
    if (!city) {
      stepTitle.textContent = `2단계 · ${p.n}에서 시·군·구를 고르세요`;
      for (const item of p.ci) choices.append(chip(item.n, item.c, () => go({ city: item, area: "", q: "" }, { focus: useAreas(item) ? "step" : "results" })));
      return;
    }
    if (useAreas(city)) {
      stepTitle.textContent = `3단계 · ${city.n}에서 읍·면·동을 고르세요`;
      stepHelp.textContent = "주소에 적힌 읍·면·동으로 묶었습니다. 원자료 표기를 그대로 써서 오탈자가 보일 수 있습니다.";
      choices.append(chip(`${city.n} 전체`, city.c, () => go({ area: "", q: "" }, { focus: "results" }), { pressed: !state.area, all: true }));
      for (const [name, count] of city.a) {
        choices.append(chip(name, count, () => go({ area: name, q: "" }, { focus: "results" }), { pressed: state.area === name }));
      }
      return;
    }
    stepTitle.textContent = `${p.k} ${city.n} 집하장 주소`;
    stepHelp.textContent = city.a.length > 1 || city.na
      ? "이 지역 자료는 주소에 읍·면이 거의 적혀 있지 않아 원자료 순서대로 보여 드립니다. 위 검색창에 마을(리) 이름을 넣으면 바로 좁혀집니다."
      : "";
  }

  function renderVisitLocal() {
    if (!state.city) {
      visitLocal.textContent = "지역을 고르면 어디에 물어보면 되는지 여기에 알려 드립니다.";
      return;
    }
    const office = `${state.city.n.split(" ")[0]}청`;
    let local = "가까운 읍·면 행정복지센터";
    if (state.area && state.area !== NO_AREA) local = `${state.area} 행정복지센터`;
    visitLocal.textContent = `${state.province.k} ${state.city.n}: 운영 요일과 받는 품목은 ${office} 환경(자원순환) 담당 부서나 ${local}에 물어보세요.`;
  }

  function resultItem(row) {
    const li = document.createElement("li");
    li.className = "result";
    const region = document.createElement("p");
    region.className = "result-region";
    region.textContent = `${row.p.k} ${row.city}${row.area !== NO_AREA ? ` · ${row.area}` : ""}`;
    const name = document.createElement("h3");
    name.className = "result-name";
    name.textContent = row.name === "이름 미등록" ? "이름 미등록(원자료에 이름 없음)" : row.name;
    const address = document.createElement("p");
    address.className = "result-address";
    address.textContent = row.address;
    const actions = document.createElement("div");
    actions.className = "result-actions";
    const copy = document.createElement("button");
    copy.type = "button";
    copy.textContent = "주소 복사";
    copy.dataset.copy = row.address;
    copy.setAttribute("aria-label", `${row.address} 주소 복사`);
    const query = encodeURIComponent(mapQuery(row.address));
    const naver = document.createElement("a");
    naver.href = `https://map.naver.com/p/search/${query}`;
    naver.target = "_blank";
    naver.rel = "noopener noreferrer";
    naver.textContent = "네이버 지도";
    naver.setAttribute("aria-label", `${row.address} 네이버 지도에서 검색 (새 창)`);
    const kakao = document.createElement("a");
    kakao.href = `https://map.kakao.com/link/search/${query}`;
    kakao.target = "_blank";
    kakao.rel = "noopener noreferrer";
    kakao.textContent = "카카오맵";
    kakao.setAttribute("aria-label", `${row.address} 카카오맵에서 검색 (새 창)`);
    actions.append(copy, naver, kakao);
    li.append(region, name, address, actions);
    return li;
  }

  function scopeLabel() {
    if (state.area && state.area !== NO_AREA) return `${state.city.n} ${state.area}`;
    if (state.area === NO_AREA) return `${state.city.n} (읍·면 표기 없음)`;
    if (state.city) return `${state.province.k} ${state.city.n}`;
    if (state.province) return state.province.n;
    return "전국";
  }

  function emptyMessage(scoped) {
    const box = document.createElement("li");
    box.className = "empty";
    const text = document.createElement("p");
    text.textContent = state.q
      ? `${scopeLabel()}에서 ‘${state.q}’와 맞는 주소가 없습니다. 띄어쓰기 없이, 또는 ‘1리’ 같은 숫자를 빼고 다시 찾아보세요.`
      : "표시할 주소가 없습니다.";
    box.append(text);
    if (scoped && state.q) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "btn-line";
      button.textContent = `전국에서 ‘${state.q}’ 다시 찾기`;
      button.addEventListener("click", () => go({ province: null, city: null, area: "", q: state.q }, { focus: "results" }));
      box.append(button);
    }
    return box;
  }

  async function renderResults(focus) {
    const token = ++renderToken;
    const q = state.q.trim();
    const tokens = q.split(/\s+/).map(norm).filter(Boolean);
    const qLength = norm(q).length;
    const scoped = Boolean(state.province);
    const wantsSearch = tokens.length > 0 && (qLength >= 2 || state.city);
    moreRow.hidden = true;

    if (!wantsSearch && !state.city) {
      resultsBox.hidden = !q;
      results.replaceChildren();
      if (q) {
        resultsTitle.textContent = "검색어를 조금 더 길게 써 주세요";
        status.textContent = "전국에서 찾을 때는 두 글자 이상 입력하세요. 예: 대화면, 고단리";
      } else {
        status.textContent = "";
      }
      return;
    }

    resultsBox.hidden = false;
    const targets = state.province ? [state.province] : provinces;
    status.textContent = targets.length > 1 ? "전국 주소 자료를 불러오는 중입니다…" : "주소를 불러오는 중입니다…";
    let rows;
    try {
      rows = (await Promise.all(targets.map(loadProvince))).flat();
    } catch (error) {
      if (token !== renderToken) return;
      results.replaceChildren();
      resultsTitle.textContent = "주소 자료를 불러오지 못했습니다";
      status.textContent = "인터넷 연결을 확인한 뒤 다시 시도해 주세요.";
      const li = document.createElement("li");
      li.className = "empty";
      const retry = document.createElement("button");
      retry.type = "button";
      retry.className = "btn-line";
      retry.textContent = "다시 불러오기";
      retry.addEventListener("click", () => renderResults("results"));
      const note = document.createElement("p");
      note.textContent = "계속 안 되면 지역별 목록 페이지나 공공데이터포털 원문을 이용하세요.";
      li.append(note, retry);
      results.append(li);
      return;
    }
    if (token !== renderToken) return;

    let matches = rows;
    if (state.city) matches = matches.filter((row) => row.city === state.city.n);
    if (state.area) matches = matches.filter((row) => row.area === state.area);
    // Spacing should not matter: "고 단 리" and "송지면 가차리" are tried as one
    // word first. Separate words (e.g. "고단리 강릉") are matched one by one
    // only when the joined text finds nothing.
    if (tokens.length) {
      const joined = tokens.join("");
      const whole = matches.filter((row) => rowHas(row, joined));
      matches = whole.length || tokens.length === 1 ? whole : matches.filter((row) => tokens.every((part) => rowHas(row, part)));
    }

    resultsTitle.textContent = q
      ? `${scopeLabel()}에서 ‘${q}’ 찾기 · ${fmt(matches.length)}건`
      : `${scopeLabel()} · 집하장 주소 ${fmt(matches.length)}건`;
    results.replaceChildren();
    if (!matches.length) {
      status.textContent = "맞는 주소가 없습니다.";
      results.append(emptyMessage(scoped));
    } else {
      const shown = matches.slice(0, state.limit);
      const fragment = document.createDocumentFragment();
      for (const row of shown) fragment.append(resultItem(row));
      results.append(fragment);
      status.textContent = matches.length > shown.length
        ? `${fmt(matches.length)}건 중 ${fmt(shown.length)}건을 보여 드립니다.`
        : `${fmt(matches.length)}건을 모두 보여 드립니다.`;
      const left = matches.length - shown.length;
      moreRow.hidden = left <= 0;
      moreButton.textContent = `더 보기 (남은 ${fmt(left)}건)`;
    }
    if (focus === "results") {
      resultsTitle.focus({ preventScroll: true });
      const top = resultsTitle.getBoundingClientRect().top;
      if (top < 0 || top > window.innerHeight * 0.6) resultsTitle.scrollIntoView({ block: "start" });
    }
  }

  function render({ focus = "" } = {}) {
    renderTrail();
    renderStep();
    renderVisitLocal();
    showLastRegion();
    if (state.province) loadProvince(state.province).catch(() => {});
    if (focus === "step") {
      stepTitle.focus({ preventScroll: true });
      const top = stepTitle.getBoundingClientRect().top;
      if (top < 0) stepTitle.scrollIntoView({ block: "start" });
    }
    renderResults(focus);
  }

  // ---------- Events ----------
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    state.q = input.value.trim().slice(0, 40);
    state.limit = PAGE;
    writeUrl(true);
    renderResults("results");
  });

  input.addEventListener("input", () => {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
      const next = input.value.trim().slice(0, 40);
      if (next === state.q) return;
      state.q = next;
      state.limit = PAGE;
      writeUrl(false);
      renderResults("");
    }, 350);
  });

  moreButton.addEventListener("click", () => {
    const before = results.children.length;
    state.limit += PAGE;
    renderResults("").then(() => {
      const next = results.children[before];
      const target = next && next.querySelector("button");
      if (target) target.focus({ preventScroll: true });
    });
  });

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch { /* fall back below */ }
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.top = "0";
    area.style.opacity = "0";
    document.body.append(area);
    area.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch { ok = false; }
    area.remove();
    return ok;
  }

  results.addEventListener("click", async (event) => {
    const button = event.target.closest("button[data-copy]");
    if (!button) return;
    const ok = await copyText(button.dataset.copy);
    if (ok) {
      button.textContent = "복사했어요";
      button.classList.add("copied");
      status.textContent = `주소를 복사했습니다: ${button.dataset.copy}`;
      setTimeout(() => {
        button.textContent = "주소 복사";
        button.classList.remove("copied");
      }, 2500);
    } else {
      status.textContent = "복사가 되지 않았습니다. 주소 글자를 길게 눌러 복사해 주세요.";
    }
  });

  window.addEventListener("popstate", () => {
    readUrl();
    render({ focus: "" });
  });

  readUrl();
  render({ focus: "" });
})();
