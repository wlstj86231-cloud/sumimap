const dataPath = "/data/farm-waste-collection-sites-2025.tsv";
const expectedRows = 9553;
const visibleLimit = 50;
const shortlistLimit = 3;

const provinceSelect = document.querySelector("#province");
const citySelect = document.querySelector("#city");
const termInput = document.querySelector("#term");
const loadStatus = document.querySelector("#load-status");
const provinceSummary = document.querySelector("#province-summary");
const results = document.querySelector("#results");
const shortlist = document.querySelector("#shortlist");
const shortlistCount = document.querySelector("#shortlist-count");

let rows = [];
let provinceCounts = new Map();
let selected = new Map();
let inputTimer;

function parseRows(tsv) {
  const [header, ...lines] = tsv.trimEnd().split(/\r?\n/);
  if (header !== "province\tcity\tname\taddress") throw new Error("자료 열 구성이 다릅니다.");
  if (lines.length !== expectedRows) throw new Error("자료 행 수가 예상과 다릅니다.");
  return lines.map((line, index) => {
    const parts = line.split("\t");
    if (parts.length !== 4 || !parts[0] || !parts[1] || !parts[3]) {
      throw new Error(`자료 ${index + 2}행의 형식이 다릅니다.`);
    }
    return { id: index, province: parts[0], city: parts[1], name: parts[2], address: parts[3] };
  });
}

function addOption(select, value, label) {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = label;
  select.append(option);
}

function fillProvinces() {
  provinceCounts = new Map();
  for (const row of rows) provinceCounts.set(row.province, (provinceCounts.get(row.province) || 0) + 1);
  provinceSelect.replaceChildren();
  addOption(provinceSelect, "", "전국에서 찾기");
  for (const [province, count] of [...provinceCounts].sort(([left], [right]) => left.localeCompare(right, "ko"))) {
    addOption(provinceSelect, province, `${province} · ${count.toLocaleString("ko-KR")}행`);
  }
  provinceSelect.disabled = false;
  termInput.disabled = false;
}

function fillCities(wanted = "") {
  citySelect.replaceChildren();
  addOption(citySelect, "", "전체 시·군·구");
  const province = provinceSelect.value;
  citySelect.disabled = !province;
  if (!province) return;
  const counts = new Map();
  for (const row of rows) if (row.province === province) counts.set(row.city, (counts.get(row.city) || 0) + 1);
  for (const [city, count] of [...counts].sort(([left], [right]) => left.localeCompare(right, "ko"))) {
    addOption(citySelect, city, `${city} · ${count.toLocaleString("ko-KR")}행`);
  }
  if (counts.has(wanted)) citySelect.value = wanted;
}

function renderProvinceSummary() {
  provinceSummary.replaceChildren();
  for (const [province, count] of [...provinceCounts].sort(([left], [right]) => left.localeCompare(right, "ko"))) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = `${province} ${count.toLocaleString("ko-KR")}`;
    button.setAttribute("aria-pressed", String(provinceSelect.value === province));
    button.addEventListener("click", () => {
      provinceSelect.value = province;
      fillCities();
      syncUrl();
      render();
    });
    provinceSummary.append(button);
  }
}

function syncUrl() {
  const url = new URL(location.href);
  for (const key of ["province", "city", "q"]) url.searchParams.delete(key);
  if (provinceSelect.value) url.searchParams.set("province", provinceSelect.value);
  if (citySelect.value) url.searchParams.set("city", citySelect.value);
  const term = termInput.value.trim();
  if (term) url.searchParams.set("q", term);
  history.replaceState(null, "", url);
}

function mapSearchUrl(address) {
  return `https://map.naver.com/p/search/${encodeURIComponent(address)}`;
}

function fullAddress(row) {
  const address = row.address.replaceAll(/\s+/g, " ").trim();
  const missingRegion = [row.province, row.city].filter((part) => !address.includes(part));
  return [...missingRegion, address].join(" ");
}

function renderShortlist() {
  shortlist.replaceChildren();
  shortlistCount.textContent = `${selected.size}/${shortlistLimit}`;
  if (!selected.size) {
    const empty = document.createElement("li");
    empty.className = "farm-empty";
    empty.textContent = "검색 결과에서 비교할 주소를 선택하세요.";
    shortlist.append(empty);
    return;
  }
  for (const row of selected.values()) {
    const item = document.createElement("li");
    const name = document.createElement("strong");
    name.textContent = `${row.province} ${row.city} · ${row.name}`;
    const address = document.createElement("span");
    address.textContent = fullAddress(row);
    item.append(name, address);
    shortlist.append(item);
  }
}

function resultCard(row) {
  const item = document.createElement("li");
  item.className = "farm-result";
  const name = document.createElement("h3");
  name.textContent = row.name;
  const region = document.createElement("p");
  region.className = "farm-result-meta";
  region.textContent = `${row.province} · ${row.city}`;
  const address = document.createElement("p");
  address.textContent = fullAddress(row);
  const actions = document.createElement("div");
  actions.className = "farm-result-actions";
  const mapLink = document.createElement("a");
  mapLink.href = mapSearchUrl(fullAddress(row));
  mapLink.target = "_blank";
  mapLink.rel = "noopener noreferrer";
  mapLink.textContent = "지도에서 주소 검색";
  const compareButton = document.createElement("button");
  compareButton.type = "button";
  compareButton.textContent = selected.has(row.id) ? "후보에서 빼기" : "후보에 담기";
  compareButton.setAttribute("aria-pressed", String(selected.has(row.id)));
  compareButton.disabled = selected.size >= shortlistLimit && !selected.has(row.id);
  compareButton.addEventListener("click", () => {
    if (selected.has(row.id)) selected.delete(row.id);
    else if (selected.size < shortlistLimit) selected.set(row.id, row);
    renderShortlist();
    renderResults();
  });
  actions.append(mapLink, compareButton);
  item.append(name, region, address, actions);
  return item;
}

function filteredRows() {
  const province = provinceSelect.value;
  const city = citySelect.value;
  const term = termInput.value.trim().toLocaleLowerCase("ko");
  if (!province && term.length < 2) return null;
  return rows.filter((row) => {
    if (province && row.province !== province) return false;
    if (city && row.city !== city) return false;
    if (!term) return true;
    return `${row.province} ${row.city} ${row.name} ${row.address}`.toLocaleLowerCase("ko").includes(term);
  });
}

function renderResults() {
  results.replaceChildren();
  const matches = filteredRows();
  if (matches === null) {
    loadStatus.textContent = "시·도를 선택하거나 두 글자 이상 검색하면 주소가 나타납니다.";
    return;
  }
  loadStatus.textContent = matches.length
    ? `${matches.length.toLocaleString("ko-KR")}개 등록 행 중 ${Math.min(matches.length, visibleLimit)}개를 표시합니다.`
    : "일치하는 주소가 없습니다. 시·군·구 또는 검색어를 바꿔보세요.";
  for (const row of matches.slice(0, visibleLimit)) results.append(resultCard(row));
}

function render() {
  renderProvinceSummary();
  renderResults();
}

provinceSelect.addEventListener("change", () => {
  fillCities();
  syncUrl();
  render();
});
citySelect.addEventListener("change", () => {
  syncUrl();
  renderResults();
});
termInput.addEventListener("input", () => {
  clearTimeout(inputTimer);
  inputTimer = setTimeout(() => {
    syncUrl();
    renderResults();
  }, 150);
});

try {
  const response = await fetch(dataPath, { cache: "force-cache" });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  rows = parseRows(await response.text());
  fillProvinces();
  const params = new URLSearchParams(location.search);
  const wantedProvince = params.get("province") || "";
  if (provinceCounts.has(wantedProvince)) provinceSelect.value = wantedProvince;
  fillCities(params.get("city") || "");
  termInput.value = (params.get("q") || "").slice(0, 80);
  renderShortlist();
  render();
} catch (error) {
  loadStatus.textContent = "주소 자료를 불러오지 못했습니다. 잠시 후 다시 시도하거나 아래 한국환경공단 원문을 확인하세요.";
  console.error("Farm waste collection data unavailable:", error);
}
