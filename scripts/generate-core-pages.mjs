// Generates every public HTML page of 영농폐기물 집하장 지도.
// Facts come from the verified TSV (scripts/lib/farm-data.mjs) and from the
// official sources in scripts/lib/sources.mjs (re-read 2026-10-26).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DATA, NO_AREA, loadRows, groupRegions, mapQuery, hasProvincePage, provinceHref, looseVillage } from "./lib/farm-data.mjs";
import { page, esc, finderHref, sourcesBlock, boribay, SITE_URL, SITE_NAME, FINDER_ROUTE, FINDER_JS, PUBLISHED, OPERATOR } from "./lib/layout.mjs";
import { SRC } from "./lib/sources.mjs";
import { GUIDES, GUIDE_LIST, relatedGuides } from "./lib/guides.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const siteRoot = path.join(root, "site");
const rows = loadRows();
const provinces = groupRegions(rows);
const fmt = (n) => n.toLocaleString("ko-KR");
const written = [];

function write(route, html) {
  const file = route === "/404.html"
    ? path.join(siteRoot, "404.html")
    : path.join(siteRoot, ...route.split("/").filter(Boolean), "index.html");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html, "utf8");
  written.push(route);
}

const useAreas = (city) => city.areas.length > 1 && city.noArea / city.count < 0.5;
// Exact duplicates are counted on the original TSV line, like the data check.
const duplicateExtra = (list) => list.length - new Set(list.map((row) => row.line)).size;
const unnamed = (list) => list.filter((row) => row.name === "이름 미등록").length;
const totalDuplicates = duplicateExtra(rows);
const totalNoArea = rows.filter((row) => row.area === NO_AREA).length;
const missingProvinces = "서울·부산·광주";

const dataBadge = `<p class="data-badge"><span>한국환경공단 공개자료</span><span>${DATA.baseDateLabel} 기준</span><span>전국 ${fmt(DATA.totalRows)}건</span><a href="${FINDER_ROUTE}#about-data">자료 설명</a></p>`;

const visitChecklist = `<ol class="check-list">
          <li><strong>지금도 쓰는 곳인지</strong> 읍·면사무소에 확인하기</li>
          <li><strong>수거 날짜와 받는 품목</strong> 묻기(폐비닐·농약 빈 용기)</li>
          <li>폐비닐은 <strong>흙·잡초를 털고</strong> 하우스·멀칭 따로 묶기</li>
          <li>농약 병은 <strong>다 쓴 것만</strong>, 남은 농약은 따로 문의</li>
        </ol>`;

// ---------------------------------------------------------------- home
write("/", page({
  route: "/",
  title: "영농폐기물 공동집하장 찾기 - 우리 동네 집하장 주소 | 영농폐기물 집하장 지도",
  description: "시·도, 시·군·구, 읍·면·동을 차례로 눌러 가까운 영농폐기물 공동집하장 주소를 찾고, 복사하거나 네이버·카카오 지도로 바로 여세요. 한국환경공단 공개자료 9,553건 기준.",
  ogType: "website",
  verification: true,
  jsonLd: [{
    "@type": "WebSite",
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    inLanguage: "ko-KR",
    description: "한국환경공단 공개자료로 영농폐기물 공동집하장 주소를 지역별로 찾고 배출 방법을 확인하는 서비스",
    publisher: OPERATOR,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}${FINDER_ROUTE}?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  }],
  body: `
    <section class="home-hero">
      <h1>가까운 영농폐기물 공동집하장 찾기</h1>
      <p class="lead">시·도와 시·군을 차례로 누르면 한국환경공단 공개자료에 실린 집하장 주소가 나옵니다. 주소를 복사하거나 네이버·카카오 지도로 바로 열 수 있습니다.</p>
    </section>
    <form class="finder-search box" action="${FINDER_ROUTE}" method="get" role="search">
      <label for="home-q">마을·읍면 이름으로 바로 찾기</label>
      <div class="search-row"><input id="home-q" name="q" type="search" placeholder="예: 대화면, 고단1리" maxlength="40" autocomplete="off"><button type="submit">찾기</button></div>
      ${dataBadge}
    </form>
    <section class="box" aria-labelledby="pick-title">
      <h2 id="pick-title">시·도부터 고르기</h2>
      <ul class="chips">
        ${provinces.map((p) => `<li><a class="chip" href="${esc(finderHref({ province: p.name }))}"><span>${p.short}</span><span class="count">${fmt(p.count)}건</span></a></li>`).join("\n        ")}
      </ul>
      <p class="small">2025년 공개자료에 주소가 실린 14개 시·도입니다. ${missingProvinces}의 주소는 이 자료에 없습니다.</p>
    </section>
    <section class="notice" aria-labelledby="visit-title">
      <h2 id="visit-title">짐 싣기 전에 꼭 확인하세요</h2>
      <p>공개자료에는 주소만 있고 <strong>운영 요일·수거일·받는 품목·연락처가 없습니다.</strong></p>
      ${visitChecklist}
      <p><a href="/guide/before-visit/">읍·면사무소에 물어볼 말 보기</a></p>
    </section>
    <section aria-labelledby="guide-title">
      <h2 id="guide-title">무엇을 어떻게 내놓나요</h2>
      <div class="card-grid three">
        ${GUIDE_LIST.map((item) => `<a class="card" href="${item.route}"><strong>${item.label}</strong><span>${item.summary}</span></a>`).join("\n        ")}
      </div>
      <p><a href="/guide/">종류별 배출 방법 한눈에 보기</a></p>
    </section>
    <section class="box" aria-labelledby="data-title">
      <h2 id="data-title">이 주소 자료에 대해</h2>
      <p><a href="${SRC.data.url}">공공데이터포털의 한국환경공단 「전국 영농폐기물 공동집하장 위치」</a> 2025년 8월 27일 기준 파일에서 시·도, 시·군·구, 이름, 소재지를 가져왔습니다. ${fmt(DATA.totalRows)}건은 자료에 실린 주소 줄 수이며, 같은 주소가 두 번 실린 경우도 있어 실제 운영 중인 집하장 수와 다릅니다. 좌표가 없어 거리순 정렬은 하지 않습니다.</p>
      <p><a href="/sources/">자료 출처와 가공 방법</a> · <a href="/about/">서비스 소개</a> · <a href="/kr/">시·도별 목록</a></p>
    </section>`
}));

// ---------------------------------------------------------------- finder
const finderIndex = {
  v: DATA.version,
  noArea: NO_AREA,
  total: DATA.totalRows,
  p: provinces.map((p) => ({
    n: p.name,
    s: p.slug,
    k: p.short,
    c: p.count,
    ci: p.cities.map((city) => ({ n: city.name, c: city.count, na: city.noArea, a: city.areas }))
  }))
};

write(FINDER_ROUTE, page({
  route: FINDER_ROUTE,
  title: "전국 영농폐기물 공동집하장 주소 찾기 (시·군·읍면별) | 영농폐기물 집하장 지도",
  description: "한국환경공단 2025년 공개자료의 영농폐기물 공동집하장 주소 9,553건을 시·도 → 시·군·구 → 읍·면·동 순서로 찾고, 주소 복사와 네이버·카카오 지도 검색을 바로 이용하세요.",
  crumbs: [["홈", "/"], ["집하장 찾기", FINDER_ROUTE]],
  jsonLd: [{
    "@type": "WebApplication",
    name: "영농폐기물 공동집하장 주소 찾기",
    url: `${SITE_URL}${FINDER_ROUTE}`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    inLanguage: "ko-KR",
    isAccessibleForFree: true,
    description: "한국환경공단 공개자료의 영농폐기물 공동집하장 주소를 지역별로 찾는 도구",
    isBasedOn: SRC.data.url,
    publisher: OPERATOR
  }],
  scripts: `<script type="application/json" id="finder-index">${JSON.stringify(finderIndex).replaceAll("</", "<\\/")}</script>
  <script src="${FINDER_JS}" defer></script>`,
  body: `
    <div class="page-head">
      <h1>영농폐기물 공동집하장 찾기</h1>
      <p class="lead">지역을 차례로 누르거나 마을 이름으로 찾으면, 한국환경공단 공개자료에 실린 집하장 주소가 나옵니다.</p>
    </div>
    <form class="finder-search box" id="finder-form" action="${FINDER_ROUTE}" method="get" role="search">
      <label for="finder-q">마을·읍면 이름이나 주소로 찾기</label>
      <div class="search-row"><input id="finder-q" name="q" type="search" placeholder="예: 대화면, 고단1리" maxlength="40" autocomplete="off"><button type="submit">찾기</button></div>
      <p class="search-help">띄어쓰기는 상관없고, ‘고단리’로 찾으면 고단1리·고단2리도 함께 나옵니다. 지역을 먼저 고르면 그 지역 안에서만 찾습니다.</p>
      ${dataBadge}
    </form>
    <div class="finder-layout">
      <div>
        <section class="box" id="finder-steps" aria-labelledby="step-title">
          <ol class="region-trail" id="trail" hidden></ol>
          <div class="step-head"><h2 id="step-title" tabindex="-1">1단계 · 시·도를 고르세요</h2></div>
          <p id="step-help" class="finder-note">자료에 주소가 있는 14개 시·도만 보입니다. 다른 지역에 집하장이 없다는 뜻은 아닙니다.</p>
          <ul class="chips" id="choices">
            ${provinces.map((p) => `<li><a class="chip" href="${provinceHref(p)}"><span>${p.short}</span><span class="count">${fmt(p.count)}건</span></a></li>`).join("\n            ")}
          </ul>
          <p id="last-region" hidden></p>
        </section>
        <section id="results-box" aria-labelledby="results-title" hidden>
          <h2 id="results-title" tabindex="-1">집하장 주소</h2>
          <p class="status" id="status" role="status" aria-live="polite"></p>
          <ol class="results" id="results"></ol>
          <p class="more-row" id="more-row" hidden><button class="btn-line" id="more" type="button">더 보기</button></p>
        </section>
        <noscript><p class="notice">이 검색 화면은 자바스크립트가 필요합니다. 위 시·도를 누르면 시·군·읍면별 목록 페이지로 이동합니다.</p></noscript>
      </div>
      <aside class="finder-aside" aria-label="방문 전 확인">
        <section class="notice visit-check" id="before-visit">
          <h2>가기 전에 꼭 확인하세요</h2>
          <p id="visit-local">지역을 고르면 어디에 물어보면 되는지 여기에 알려 드립니다.</p>
          ${visitChecklist}
          <p><a href="/guide/before-visit/">전화로 물어볼 말</a> · <a href="/guide/">배출 방법</a></p>
        </section>
      </aside>
    </div>

    <section class="box" id="about-data" aria-labelledby="data-title">
      <h2 id="data-title">자료 설명과 한계</h2>
      <p>주소는 <a href="${SRC.data.url}">공공데이터포털의 한국환경공단 「전국 영농폐기물 공동집하장 위치」</a>를 가공했습니다. 포털은 이 자료를 농가가 영농폐기물을 마을 단위로 임시 보관하는 중간 거점의 위치 정보라고 설명하며, 지방자치단체가 매년 제출한 정보를 모은다고 밝힙니다.</p>
      <ul>
        <li><strong>기준 파일:</strong> 2025년 8월 27일 기준 파일(${fmt(DATA.totalRows)}건)을 보관해 사용합니다. 2026-10-26에 포털을 다시 열었을 때는 2026년 9월 29일 수정 파일(전체 행 9,553)이 올라와 있었습니다. 새 파일 내용은 아직 이 사이트 자료와 한 줄씩 대조하지 않았으므로, 화면의 기준일은 2025년 8월 27일로 표시합니다.</li>
        <li><strong>쓴 항목:</strong> 시·도, 시·군·구, 공동집하장 이름, 소재지 네 가지입니다. 운영 여부, 수거 요일, 받는 품목, 연락처, 좌표는 원자료에 없습니다.</li>
        <li><strong>건수의 뜻:</strong> ${fmt(DATA.totalRows)}건은 주소 줄 수입니다. 완전히 같은 줄이 ${fmt(totalDuplicates)}건 더 들어 있고 이를 합치지 않았으므로 실제 집하장 수와 다릅니다.</li>
        <li><strong>표시 방법:</strong> 이름이 빈 16건은 ‘이름 미등록’으로 보여 줍니다. 소재지에 지역명이 빠진 1건은 시·도와 시·군·구를 앞에 붙이고, 지역명이 두 번 적힌 3건은 한 번만 보여 줍니다. 원자료의 오탈자는 고치지 않았습니다.</li>
        <li><strong>읍·면·동 단추:</strong> 주소 글자에 적힌 읍·면·동으로 묶었습니다. ${fmt(totalNoArea)}건은 주소에 읍·면이 없어 ‘${NO_AREA}’으로 모았습니다.</li>
        <li><strong>지도 버튼:</strong> 좌표가 없어 주소 글자로 검색합니다. 괄호 속 설명을 빼고 ‘고단1리’는 ‘고단리’처럼 번호를 뺀 이름으로 검색하며, 결과가 집하장 입구와 다를 수 있습니다.</li>
      </ul>
      <p>공식 원문: <a href="${SRC.data.url}">공공데이터포털 자료 페이지</a> · <a href="${SRC.keco.url}">한국환경공단 영농폐기물 수거·처리사업</a>. 자료 대조일 ${PUBLISHED}. 현장 방문이나 지자체 전화 확인은 하지 않았습니다. 가공 과정은 <a href="/sources/#farm-data">자료 출처</a>에 공개하며, 원문과 다른 표시는 <a href="/contact/">정정 요청</a>으로 알려 주세요.</p>
      <p><a href="/data/farm-waste-collection-sites-2025.tsv">가공한 주소 파일(TSV, 약 0.9MB) 내려받기</a></p>
    </section>

    <section class="box box-soft" aria-labelledby="next-title">
      <h2 id="next-title">버리기 전에, 아직 쓸 만한 자재라면</h2>
      <p>찢어지지 않은 자재나 쓰던 농기계는 가까운 농가에 필요할 수 있습니다. 같은 운영자(제이 미디어)가 만든 <a href="${boribay("/guides/farm-supplies-disposal-guide")}">보리장터 농자재 정리·배출 안내</a>에서 나눔과 재사용 전에 확인할 점을 볼 수 있습니다.</p>
    </section>`
}));

// ---------------------------------------------------------------- /kr/ directory
write("/kr/", page({
  route: "/kr/",
  title: "시·도별 영농폐기물 공동집하장 목록 | 영농폐기물 집하장 지도",
  description: "14개 시·도의 영농폐기물 공동집하장 주소 건수와 시·군·구 수를 한눈에 보고, 시·군·읍면별 목록으로 들어가세요. 주소 자료를 읽을 때 주의할 점도 함께 정리했습니다.",
  crumbs: [["홈", "/"], ["시·도별 목록", "/kr/"]],
  jsonLd: [{
    "@type": "CollectionPage",
    name: "시·도별 영농폐기물 공동집하장 목록",
    url: `${SITE_URL}/kr/`,
    inLanguage: "ko-KR",
    isBasedOn: SRC.data.url,
    hasPart: provinces.filter(hasProvincePage).map((p) => ({ "@type": "WebPage", name: `${p.name} 영농폐기물 공동집하장`, url: `${SITE_URL}/kr/${p.slug}/` }))
  }],
  body: `
    <div class="page-head">
      <h1>시·도별 영농폐기물 공동집하장 목록</h1>
      <p class="lead">시·도를 고르면 시·군·구와 읍·면·동별 주소 건수가 나옵니다. 주소를 바로 보려면 <a href="${FINDER_ROUTE}">집하장 찾기</a>를 이용하세요.</p>
    </div>
    <section class="box" aria-labelledby="list-title">
      <h2 id="list-title">14개 시·도</h2>
      <div class="table-wrap">
        <table>
          <thead><tr><th scope="col">시·도</th><th scope="col">주소</th><th scope="col">시·군·구</th><th scope="col">가장 많은 곳</th></tr></thead>
          <tbody>
            ${provinces.map((p) => {
              const top = [...p.cities].sort((a, b) => b.count - a.count)[0];
              return `<tr><td><a href="${provinceHref(p)}">${p.name}</a></td><td>${fmt(p.count)}건</td><td>${p.cities.length}곳</td><td>${esc(top.name)} ${fmt(top.count)}건</td></tr>`;
            }).join("\n            ")}
          </tbody>
        </table>
      </div>
      <p class="small">${missingProvinces}의 주소는 2025년 8월 27일 기준 파일에 없습니다. 이 지역에 집하장이 없다는 뜻은 아니므로 구청이나 시청에 확인하세요.</p>
    </section>
    ${provinces.filter((p) => !hasProvincePage(p)).map((p) => `<section class="box" id="${p.slug}" aria-labelledby="${p.slug}-title">
      <h2 id="${p.slug}-title">${p.name} 집하장 주소 ${fmt(p.count)}건</h2>
      <p>주소가 적어 따로 페이지를 만들지 않고 여기에 모두 적었습니다. 운영 여부는 해당 구청 환경 담당 부서에 확인하세요.</p>
      ${p.cities.map((city) => `<h3>${esc(city.name)}</h3>${staticAddressList(city)}`).join("\n      ")}
    </section>`).join("\n    ")}
    <section class="box" aria-labelledby="read-title">
      <h2 id="read-title">주소 자료를 읽을 때 알아 둘 점</h2>
      <ol class="steps-list">
        <li><strong>건수는 집하장 수가 아닙니다.</strong> 같은 주소가 두 번 실린 줄을 합치지 않았고, 자료 이후 새로 생기거나 없어진 곳은 반영되지 않습니다.</li>
        <li><strong>주소에 읍·면이 빠진 곳이 있습니다.</strong> 전국 ${fmt(totalNoArea)}건은 “강릉시 고단1리”처럼 읍·면 없이 마을 이름부터 적혀 있습니다. 이런 지역은 마을(리) 이름으로 검색하는 편이 빠릅니다.</li>
        <li><strong>지도 검색은 주소 글자 기준입니다.</strong> 원자료에 좌표가 없어 지도 결과가 실제 입구와 다를 수 있습니다.</li>
        <li><strong>운영 여부는 따로 확인합니다.</strong> 수거 날짜와 받는 품목은 읍·면사무소나 시·군 환경 담당 부서가 압니다. → <a href="/guide/before-visit/">가기 전 확인할 5가지</a></li>
      </ol>
    </section>
    ${sourcesBlock([SRC.data, SRC.keco], { heading: "공식 원문" })}`
}));

// ---------------------------------------------------------------- province pages
const localGuides = {
  "세종특별자치시": [{ ...SRC.sejong, note: "세종시가 직접 공개한 배출 방법, 수거보상금, 공동집하장 설치현황(38개소) 표가 있습니다." }],
  "충청북도": [{ ...SRC.cheongju, note: "청주시의 배출 방법, 민간위탁 수거업체 관할 구역, 폐비닐 등급별 보상금 안내입니다." }],
  "충청남도": [{ ...SRC.dangjin, note: "당진시의 농촌쓰레기 배출 방법과 폐비닐·농약병 수거 문의처 안내입니다." }],
  "경상남도": [{ ...SRC.miryang, note: "밀양시의 폐비닐·농약빈병 배출 방법 안내입니다(2020년 3월 수정, 금액은 바뀌었을 수 있음)." }]
};

function staticAddressList(city) {
  return `<ul class="addr-list">${city.rows.map((row) => {
    const query = encodeURIComponent(mapQuery(row.address));
    return `<li><span class="addr">${esc(row.address)}</span><span class="small">${esc(row.name)}</span><br><span class="links"><a href="https://map.naver.com/p/search/${query}">네이버 지도</a> · <a href="https://map.kakao.com/link/search/${query}">카카오맵</a></span></li>`;
  }).join("")}</ul>`;
}

// Same text the finder searches (finder-*.js loadProvince/rowHas), so a chip's
// count is exactly the number of results its link opens.
const finderKey = (p, row) => `${p.name}${p.short}${row.city}${row.area === NO_AREA ? "" : row.area}${row.name}${row.address}`.replace(/\s+/gu, "").toLowerCase();

function villageChips(p, city) {
  const names = new Set(city.rows.filter((row) => row.village).map((row) => looseVillage(row.village)));
  const keys = city.rows.map((row) => finderKey(p, row));
  const looseKeys = keys.map(looseVillage);
  const villages = [...names].sort((left, right) => left.localeCompare(right, "ko")).map((name) => {
    const pool = /[0-9]/u.test(name) ? keys : looseKeys;
    return [name, pool.filter((key) => key.includes(name)).length];
  });
  if (!villages.length) return "";
  return `<p class="small">주소에 읍·면이 거의 적혀 있지 않아 주소에 나오는 마을(리·동) 이름으로 묶었습니다. ‘고단1리’, ‘고단2리’는 ‘고단리’ 하나로 모았습니다. 이름을 누르면 주소나 집하장 이름에 그 마을 이름이 들어간 곳이 열리고, 건수도 그 기준입니다.</p>
      <ul class="chips compact">${villages.map(([name, count]) => `<li><a class="chip" href="${esc(finderHref({ province: p.name, city: city.name, q: name }))}"><span>${esc(name)}</span><span class="count">${fmt(count)}건</span></a></li>`).join("")}</ul>`;
}

for (const p of provinces.filter(hasProvincePage)) {
  const route = `/kr/${p.slug}/`;
  const sortedByCount = [...p.cities].sort((a, b) => b.count - a.count);
  const top = sortedByCount.slice(0, 3);
  const noArea = p.rows.filter((row) => row.area === NO_AREA).length;
  const dup = duplicateExtra(p.rows);
  const noName = unnamed(p.rows);
  const listAddresses = p.count <= 60;
  const areaTotal = p.cities.reduce((sum, city) => sum + city.areas.filter(([name]) => name !== NO_AREA).length, 0);
  const notes = [
    noArea ? `주소에 읍·면이 적히지 않은 줄이 ${fmt(noArea)}건 있습니다${p.cities.filter((city) => !useAreas(city) && city.count > 3).length ? ` (${p.cities.filter((city) => !useAreas(city) && city.count > 3).map((city) => city.name).join(", ")} 등). 이 지역은 마을(리) 이름으로 찾으세요` : ""}.` : "모든 주소에 읍·면·동이 적혀 있습니다.",
    dup ? `완전히 같은 주소 줄이 ${fmt(dup)}건 더 들어 있어 실제 집하장 수는 ${fmt(p.count)}곳보다 적을 수 있습니다.` : "완전히 같은 줄이 반복된 경우는 없습니다. 그래도 건수가 운영 중인 집하장 수라는 뜻은 아닙니다.",
    noName ? `이름 없이 주소만 있는 줄이 ${fmt(noName)}건입니다.` : ""
  ].filter(Boolean);
  const local = localGuides[p.name] || [];
  write(route, page({
    route,
    title: `${p.name} 영농폐기물 공동집하장 주소 ${fmt(p.count)}건 - 시·군·읍면별 | ${SITE_NAME}`,
    description: `${p.name} ${p.cities.length}개 시·군·구의 영농폐기물 공동집하장 주소 ${fmt(p.count)}건을 읍·면·동별로 나눠 봅니다. ${top.map((city) => `${city.name} ${fmt(city.count)}건`).join(", ")}. 한국환경공단 2025년 공개자료 기준.`,
    crumbs: [["홈", "/"], ["시·도별 목록", "/kr/"], [p.name, route]],
    jsonLd: [{
      "@type": "CollectionPage",
      name: `${p.name} 영농폐기물 공동집하장 주소`,
      url: `${SITE_URL}${route}`,
      inLanguage: "ko-KR",
      isBasedOn: SRC.data.url,
      about: { "@type": "AdministrativeArea", name: p.name },
      dateModified: PUBLISHED
    }],
    body: `
    <div class="page-head">
      <h1>${p.name} 영농폐기물 공동집하장</h1>
      <p class="lead">${p.name}에는 한국환경공단 2025년 공개자료 기준 ${p.cities.length}개 시·군·구에 집하장 주소 ${fmt(p.count)}건이 실려 있습니다. 시·군과 읍·면·동을 누르면 주소 목록이 열립니다.</p>
      <p class="cta-row"><a class="btn" href="${esc(finderHref({ province: p.name }))}">${p.short} 집하장 주소 바로 찾기</a></p>
    </div>
    <ul class="stat-row" aria-label="${p.short} 자료 요약">
      <li><b>${fmt(p.count)}건</b><span>주소 줄 수</span></li>
      <li><b>${p.cities.length}곳</b><span>시·군·구</span></li>
      <li><b>${fmt(areaTotal)}곳</b><span>주소에 적힌 읍·면·동</span></li>
      <li><b>${esc(top[0].name)}</b><span>가장 많은 곳 ${fmt(top[0].count)}건</span></li>
    </ul>
    ${p.cities.map((city) => `<section class="city-block" aria-labelledby="c-${esc(city.name).replaceAll(" ", "-")}">
      <h2 id="c-${esc(city.name).replaceAll(" ", "-")}">${esc(city.name)} <span class="small">${fmt(city.count)}건</span></h2>
      ${useAreas(city)
        ? `<ul class="chips">${city.areas.map(([name, count]) => `<li><a class="chip" href="${esc(finderHref({ province: p.name, city: city.name, area: name }))}"><span>${esc(name)}</span><span class="count">${fmt(count)}건</span></a></li>`).join("")}</ul>`
        : city.count > 3 ? villageChips(p, city) : ""}
      <p><a href="${esc(finderHref({ province: p.name, city: city.name }))}">${esc(city.name)} 주소 ${fmt(city.count)}건 모두 보기 →</a></p>
      ${listAddresses ? staticAddressList(city) : ""}
    </section>`).join("\n    ")}
    <section class="box" aria-labelledby="note-title">
      <h2 id="note-title">${p.short} 자료를 볼 때</h2>
      <ul>${notes.map((note) => `<li>${esc(note)}</li>`).join("")}</ul>
      <p>읍·면·동 단추는 주소 글자를 그대로 묶은 것이라 원자료의 오탈자가 보일 수 있습니다. 운영 요일과 받는 품목은 해당 시·군청 환경(자원순환) 담당 부서나 읍·면 행정복지센터에 확인하세요. → <a href="/guide/before-visit/">가기 전 확인할 5가지</a></p>
    </section>
    ${local.length ? `<section class="box box-soft" aria-labelledby="local-title">
      <h2 id="local-title">${p.short} 시·군이 직접 공개한 안내</h2>
      <ul>${local.map((item) => `<li><a href="${esc(item.url)}">${esc(item.org)} · ${esc(item.title)}</a><br><span class="small">${esc(item.note)} 자료 대조일 ${PUBLISHED}.</span></li>`).join("")}</ul>
    </section>` : ""}
    ${sourcesBlock([SRC.data, SRC.keco], { heading: "공식 원문" })}
    <p><a href="/kr/">다른 시·도 목록 보기</a></p>`
  }));
}

// ---------------------------------------------------------------- guides
for (const guide of GUIDES) {
  const isHub = guide.route === "/guide/";
  const crumbs = isHub ? [["홈", "/"], ["배출 방법", "/guide/"]] : [["홈", "/"], ["배출 방법", "/guide/"], [guide.h1, guide.route]];
  write(guide.route, page({
    route: guide.route,
    title: guide.title,
    description: guide.description,
    narrow: true,
    ads: true,
    crumbs,
    jsonLd: [{
      "@type": "Article",
      headline: guide.h1,
      description: guide.description,
      url: `${SITE_URL}${guide.route}`,
      inLanguage: "ko-KR",
      datePublished: PUBLISHED,
      dateModified: PUBLISHED,
      author: OPERATOR,
      publisher: OPERATOR,
      citation: guide.sources.map((source) => source.url),
      isPartOf: { "@type": "WebSite", name: SITE_NAME, url: `${SITE_URL}/` }
    }],
    body: `
    <div class="page-head">
      <h1>${esc(guide.h1)}</h1>
      <p class="lead">${esc(guide.lead)}</p>
      <p class="meta-line">작성·자료 대조: ${PUBLISHED} · 정리: 영농폐기물 집하장 지도 운영자(제이 미디어)</p>
    </div>
    ${guide.body}
    ${sourcesBlock(guide.sources, { note: "지역 예시는 해당 시·군의 안내이며, 다른 지역의 기준은 다를 수 있습니다." })}
    ${relatedGuides(guide.route)}`
  }));
}

// ---------------------------------------------------------------- trust pages
const trust = (route, title, description, h1, lead, body, extra = {}) => write(route, page({
  route,
  title: `${title} | ${SITE_NAME}`,
  description,
  narrow: true,
  crumbs: [["홈", "/"], [title, route]],
  jsonLd: [{ "@type": extra.type || "WebPage", name: title, url: `${SITE_URL}${route}`, inLanguage: "ko-KR", dateModified: PUBLISHED, publisher: OPERATOR }],
  body: `
    <div class="page-head">
      <h1>${esc(h1)}</h1>
      <p class="lead">${esc(lead)}</p>
    </div>
${body}
    <p class="small">최종 수정: ${PUBLISHED}</p>`
}));

trust("/about/", "서비스 소개", "영농폐기물 집하장 지도가 하는 일, 운영자(제이 미디어·보리장터 운영사), 주소 자료를 가공한 방법과 하지 않는 일을 설명합니다.", "가까운 집하장 주소를 빨리 찾도록 돕습니다", "영농폐기물 집하장 지도는 한국환경공단 공개자료에 실린 전국 공동집하장 주소를 지역별로 찾고, 품목별 배출 방법을 공식 안내로 정리한 서비스입니다.", `
    <section class="box">
      <h2>하는 일</h2>
      <ul>
        <li><a href="${FINDER_ROUTE}">집하장 찾기</a>: 시·도 → 시·군·구 → 읍·면·동 순서나 마을 이름으로 주소를 찾고, 복사하거나 지도에서 엽니다.</li>
        <li><a href="/guide/">배출 방법</a>: 폐비닐, 농약 빈 용기, 남은 농약, 그 밖의 농자재를 어디에 어떻게 내놓는지 한국환경공단·농림축산식품부·지자체 안내로 정리합니다.</li>
        <li><a href="/kr/">시·도별 목록</a>: 시·군·구와 읍·면·동별 주소 건수를 보여 줍니다.</li>
      </ul>
    </section>
    <section class="box">
      <h2>운영자</h2>
      <p>운영: 제이 미디어(J MEDIA) · <a href="${boribay("/")}">보리장터(boribay.com)</a> 운영사. 자료의 가공·표시와 정정 책임은 영농폐기물 집하장 지도 운영자에게 있습니다. 사업자 정보와 고객센터는 <a href="${boribay("/about")}">보리장터 운영자 정보</a>에 공개되어 있습니다.</p>
      <p>이 사이트에서 보리장터 안내로 연결할 때는 같은 운영자의 서비스라는 점을 밝히며, 독립된 외부 추천으로 표시하지 않습니다. 정부, 한국환경공단, 지방자치단체의 공식 서비스가 아닙니다.</p>
    </section>
    <section class="box">
      <h2>주소 자료를 다룬 방법</h2>
      <p><a href="${SRC.data.url}">공공데이터포털의 한국환경공단 자료</a> 2025년 8월 27일 기준 파일에서 시·도, 시·군·구, 이름, 소재지 네 항목만 썼습니다. 원자료의 줄을 고치거나 합치지 않았고, 원자료에 없는 운영 요일·좌표·연락처를 만들어 넣지 않습니다. 실제 집하장 방문이나 지자체 전화 조사는 하지 않았습니다. 자세한 내용은 <a href="/sources/">자료 출처</a>에 있습니다.</p>
    </section>
    <section class="box">
      <h2>하지 않는 일</h2>
      <ul>
        <li>집하장의 현재 운영 여부, 수거 일정, 보상금 지급을 보장하지 않습니다.</li>
        <li>회원가입, 위치 추적, 개인정보 수집을 하지 않습니다.</li>
        <li>법률 판단이나 행정 처분에 대한 자문을 하지 않습니다.</li>
      </ul>
    </section>
    <section class="box">
      <h2>같은 운영자의 농촌 도구</h2>
      <p>보리장터 거래 전후에 쓰는 도구를 함께 운영합니다: 농산물 거래사전(yomiwiki.com), 직거래 사기 점검(scamreader.com), 농가 손익 계산기(www.reportools.com), 거래 증빙 도우미(goatool.com), 농사 비교 월드컵(occultworldcup.com), 농업 정책자금 백과(policyfundpedia.com), 농기계 자산 수첩(megapureunasset.kr), 농기계 탁송 견적 비교(tripmarking.com).</p>
      <p>주소나 설명이 틀렸다면 <a href="/contact/">문의·정정 요청</a>으로 알려 주세요.</p>
    </section>`, { type: "AboutPage" });

trust("/sources/", "자료 출처", "영농폐기물 집하장 지도가 사용한 한국환경공단 공동집하장 주소 자료의 가공 기록과, 배출 방법 안내에 쓴 공식 원문 목록과 대조일입니다.", "자료 출처와 가공 기록", "모든 주소와 배출 방법 설명은 아래 공식 원문에서 왔습니다. 원문 기관의 갱신일과 운영자가 다시 확인한 날(자료 대조일)을 구분해 적습니다.", `
    <section class="box" id="farm-data">
      <h2>공동집하장 주소 자료</h2>
      <ul>
        <li>원문: <a href="${SRC.data.url}">${esc(DATA.sourceTitle)}</a> (공공데이터포털, 제공기관 한국환경공단, 이용허락범위 제한 없음)</li>
        <li>사용 중인 파일: 2025년 8월 27일 기준, ${fmt(DATA.totalRows)}행. 원본 CSV(CP949)의 시도·시군구·공동집하장명·소재지 열만 UTF-8 TSV로 바꿨고, 원본·변환본의 SHA-256 해시를 기록해 두고, 변환본 해시는 점검(<code>npm run check</code>) 때마다 다시 확인합니다.</li>
        <li>포털 최신 표시(${PUBLISHED} 확인): 파일명 기준일·수정일 2026년 9월 29일, 전체 행 9,553, 업데이트 주기 연간, 차기 등록 예정일 2027년 10월 4일. 새 파일과의 전체 대조는 아직 하지 않았습니다.</li>
        <li>화면 표시: 이름이 빈 16건은 ‘이름 미등록’, 소재지에 지역명이 빠진 1건은 시·도·시·군·구를 앞에 붙임, 지역명이 두 번 적힌 3건은 한 번만 표시. 완전히 같은 줄 ${fmt(totalDuplicates)}건은 합치지 않았습니다.</li>
        <li>읍·면·동 묶음: 주소 글자에서 첫 읍·면·동을 읽었습니다. 의성군처럼 ‘면’ 없이 적은 이름은 적힌 그대로 쓰고, 같은 시·군에 ‘○○면’ 표기가 있으면 그쪽으로 합쳤습니다. 읍·면이 없는 ${fmt(totalNoArea)}건은 ‘${NO_AREA}’으로 모았습니다.</li>
        <li>찾기 화면 자료: 위 TSV를 시·도별 JSON 파일로 나눠 필요한 지역만 내려받게 했습니다. 내용은 TSV와 같습니다. <a href="/data/farm-waste-collection-sites-2025.tsv">가공 TSV 내려받기</a></li>
      </ul>
      <p>재현 방법과 해시 값은 저장소의 <code>docs/data-sources/farm-waste-collection-2025.md</code>에 있습니다.</p>
    </section>
    <section class="box" id="guide-sources">
      <h2>배출 방법 안내에 쓴 공식 원문</h2>
      <ul class="source-list">
        ${Object.values(SRC).map((source) => `<li><a href="${esc(source.url)}">${esc(source.org)} · ${esc(source.title)}</a><br><small>${esc(source.use)} · 자료 대조일 ${PUBLISHED}</small></li>`).join("\n        ")}
      </ul>
      <p class="small">한국환경공단 영농폐기물 수거·처리사업 페이지는 최종수정일 2025-03-11로 표시되며, 수거처리체계 그림 설명(보상금·수거비 포함)을 함께 확인했습니다. 폐기물관리법은 2026년 9월 18일 시행 법률을 기준으로 읽었습니다.</p>
    </section>
    <section class="box">
      <h2>출처를 고르는 기준</h2>
      <p>정부 부처, 한국환경공단, 지방자치단체, 국가법령정보센터 원문을 씁니다. 언론 기사나 블로그는 근거로 쓰지 않습니다. 지역마다 다른 기준은 어느 시·군의 안내인지 밝혀 예시로만 씁니다. 편집 기준은 <a href="/editorial/">편집 원칙</a>에 있습니다.</p>
    </section>`, { type: "CollectionPage" });

trust("/editorial/", "편집 원칙", "영농폐기물 집하장 지도가 주소 자료와 배출 방법 안내를 만들 때 지키는 원칙: 공식 원문 우선, 날짜 구분, 지역 차이 표시, 보장하지 않는 것.", "편집 원칙", "주소와 배출 방법은 농가가 실제로 짐을 싣고 움직이는 데 쓰입니다. 틀린 정보가 헛걸음이나 과태료로 이어지지 않도록 아래 원칙을 지킵니다.", `
    <section class="box">
      <h2>1. 공식 원문에 있는 것만 사실로 적습니다</h2>
      <p>주소는 공공데이터포털의 한국환경공단 자료만 씁니다. 배출 방법, 보상금, 법 기준은 한국환경공단, 농림축산식품부, 지방자치단체, 국가법령정보센터 원문에서 확인한 내용만 적고, 각 페이지 아래에 원문 링크와 자료 대조일을 붙입니다.</p>
    </section>
    <section class="box">
      <h2>2. 날짜를 섞지 않습니다</h2>
      <p>원자료 기준일(2025년 8월 27일), 포털의 수정일, 운영자가 다시 확인한 날을 따로 적습니다. 대조일이 최근이어도 원자료가 최신이라는 뜻은 아닙니다.</p>
    </section>
    <section class="box">
      <h2>3. 지역마다 다른 것은 지역 이름을 붙입니다</h2>
      <p>폐비닐 보상금, 영양제 병이나 비료 포대 처리처럼 시·군마다 다른 기준은 “세종시 안내”, “청주시 안내”처럼 출처 지역을 밝혀 예시로만 씁니다. 다른 지역에 그대로 적용된다고 쓰지 않습니다.</p>
    </section>
    <section class="box">
      <h2>4. 없는 정보를 만들지 않습니다</h2>
      <p>원자료에 없는 운영 요일, 좌표, 연락처, 시설 사진, 이용 후기를 만들어 넣지 않습니다. 건수를 운영 중인 집하장 수로 바꿔 말하지 않습니다. 하지 않은 현장 조사나 전문가 감수를 했다고 쓰지 않습니다.</p>
    </section>
    <section class="box">
      <h2>5. 보장하지 않는 것을 분명히 합니다</h2>
      <p>집하장의 현재 운영, 수거 일정, 보상금 지급, 법 적용 여부는 해당 기관이 결정합니다. 이 사이트는 확인할 곳과 물어볼 내용을 안내할 뿐입니다.</p>
    </section>
    <section class="box">
      <h2>6. 틀린 것은 고치고 남깁니다</h2>
      <p>오류가 확인되면 고치고 페이지의 수정일을 바꿉니다. 원자료 자체의 오류는 제공기관에 알려야 하므로, 이 사이트에서는 원자료를 고치지 않고 표시 방법만 바꿉니다. 처리 기준은 <a href="/policy/">정정 정책</a>에 있습니다.</p>
    </section>`);

trust("/policy/", "정정 정책", "영농폐기물 집하장 지도의 주소 표시·배출 방법 설명에 대한 정정 요청을 어떻게 확인하고 반영하는지 안내합니다.", "정정 요청은 원문과 대조해 반영합니다", "주소가 다르거나 집하장이 없어졌거나 설명이 틀렸다면 알려 주세요. 확인 가능한 원문과 대조한 뒤 반영합니다.", `
    <section class="box">
      <h2>이런 내용을 받습니다</h2>
      <ul>
        <li>화면의 주소가 공공데이터포털 원문과 다른 경우</li>
        <li>집하장이 옮겨졌거나 없어진 경우(지자체 공지 링크가 있으면 함께)</li>
        <li>배출 방법·보상금 설명이 공식 안내와 다른 경우</li>
        <li>끊어진 링크, 모바일 화면 오류, 읽기 어려운 문장</li>
      </ul>
    </section>
    <section class="box">
      <h2>반영 기준</h2>
      <ul>
        <li><strong>표시 오류</strong>(가공 과정에서 생긴 차이)는 확인되는 대로 고칩니다.</li>
        <li><strong>원자료 자체의 오류</strong>(예: 오탈자, 없어진 집하장)는 원자료를 고치지 않고, 해당 내용과 함께 제공기관(한국환경공단·공공데이터포털)에 알리도록 안내합니다. 새 공개 파일이 나오면 다시 대조합니다.</li>
        <li><strong>배출 방법 설명</strong>은 정부·공단·지자체 원문으로 확인되면 고치고 자료 대조일을 바꿉니다. 개인 경험담이나 블로그만으로는 바꾸지 않습니다.</li>
      </ul>
    </section>
    <section class="box">
      <h2>보내는 곳</h2>
      <p><a href="/contact/">문의·정정 요청</a> 페이지를 이용하세요. 개인 연락처, 정확한 농가 주소, 신분증 같은 개인정보는 적지 마세요.</p>
    </section>`);

trust("/contact/", "문의·정정 요청", "영농폐기물 집하장 지도의 주소 오류, 없어진 집하장, 배출 방법 설명 오류를 알리는 방법과 적어 주면 좋은 내용을 안내합니다.", "문의·정정 요청", "주소가 다르거나 설명이 틀렸다면 아래 방법으로 알려 주세요. 집하장 운영이나 수거 일정 문의는 이 사이트가 아니라 읍·면사무소에서 답할 수 있습니다.", `
    <section class="box">
      <h2>알리는 방법</h2>
      <ul>
        <li><a href="https://github.com/wlstj86231-cloud/sumimap/issues/new">공개 정정 창구(GitHub)에 새 글 쓰기</a> — 계정 로그인이 필요하며, 쓴 내용은 인터넷에 공개됩니다.</li>
        <li>GitHub를 쓰기 어렵다면 운영자(제이 미디어)의 <a href="${boribay("/about")}">보리장터 고객센터</a>로 알려 주세요.</li>
      </ul>
    </section>
    <section class="box">
      <h2>적어 주면 좋은 내용</h2>
      <ol>
        <li>문제가 있는 페이지 주소, 또는 시·도·시·군·마을 이름</li>
        <li>화면에 보이는 주소나 문장</li>
        <li>바른 내용과 확인한 곳(지자체 공지 링크, 원문 페이지 등)</li>
      </ol>
      <p>이름, 전화번호, 정확한 집 주소, 신분증, 계좌 같은 개인정보는 적지 마세요.</p>
    </section>
    <section class="box">
      <h2>이 사이트가 답할 수 없는 것</h2>
      <ul>
        <li>집하장 운영 여부, 수거 날짜, 보상금 지급 → 읍·면 행정복지센터, 시·군청 환경(자원순환) 담당 부서</li>
        <li>원자료 수정 → 공공데이터포털 자료 페이지의 제공기관(한국환경공단)</li>
        <li>과태료 등 처분 → 처분한 기관</li>
      </ul>
      <p>처리 기준은 <a href="/policy/">정정 정책</a>, 개인정보는 <a href="/privacy/">개인정보 처리방침</a>을 보세요.</p>
    </section>`, { type: "ContactPage" });

trust("/privacy/", "개인정보 처리방침", "영농폐기물 집하장 지도는 회원가입과 개인정보 수집을 하지 않습니다. 기기에 저장되는 항목, 외부 지도 링크, 광고 쿠키, 공개 문의 창구에 대해 안내합니다.", "개인정보 처리방침", "영농폐기물 집하장 지도는 회원가입이 없고, 이름·연락처·위치를 서버에 모으지 않습니다.", `
    <section class="box">
      <h2>서버에 모으는 정보</h2>
      <p>운영자 서버에 개인정보를 저장하는 기능이 없습니다. 검색어와 고른 지역은 브라우저 안에서만 처리하며 서버로 보내지 않습니다. 사이트를 전달하는 호스팅 사업자(Cloudflare)는 보안과 전송을 위해 IP 주소, 브라우저 정보, 요청 시각 같은 기술 기록을 일시적으로 처리할 수 있습니다.</p>
    </section>
    <section class="box">
      <h2>기기에 저장되는 항목</h2>
      <ul>
        <li><code>sumimap:last-region</code>: 마지막으로 본 시·도·시·군·읍면 이름. 다음에 “지난번에 본 지역” 단추를 보여 주는 데만 씁니다.</li>
        <li>서비스 워커 캐시: 화면 파일과 시·도별 주소 자료를 기기에 저장해 다시 열 때 빠르게 보여 줍니다.</li>
      </ul>
      <p>브라우저 설정에서 sumimap.com의 사이트 데이터를 지우면 모두 삭제됩니다.</p>
    </section>
    <section class="box">
      <h2>주소 복사와 지도 링크</h2>
      <p>‘주소 복사’는 기기의 클립보드에만 주소를 넣습니다. ‘네이버 지도’, ‘카카오맵’을 누르면 집하장 주소가 검색어로 담긴 해당 지도 서비스로 이동하며, 그 뒤의 처리는 각 회사의 개인정보처리방침을 따릅니다.</p>
    </section>
    <section class="box">
      <h2>광고와 쿠키</h2>
      <p>배출 방법 안내 페이지에는 Google 광고 코드가 들어갈 수 있습니다. Google 등 제3자 사업자는 광고 제공과 측정을 위해 쿠키를 쓰거나 이전 방문 기록을 바탕으로 맞춤 광고를 보여 줄 수 있습니다. 집하장 찾기, 시·도별 목록, 소개·정책 페이지에는 광고를 싣지 않습니다.</p>
      <p><a href="https://policies.google.com/technologies/partner-sites?hl=ko">Google 파트너 사이트의 정보 사용 방식</a> · <a href="https://adssettings.google.com/?hl=ko">Google 광고 설정</a></p>
    </section>
    <section class="box">
      <h2>공개 문의 창구</h2>
      <p>정정 요청에 쓰는 GitHub Issues의 글과 계정 정보는 공개되며 GitHub의 정책에 따라 처리됩니다. 개인정보를 적지 마세요. <a href="https://docs.github.com/ko/site-policy/privacy-policies/github-general-privacy-statement">GitHub 개인정보처리방침</a></p>
    </section>
    <section class="box">
      <h2>변경</h2>
      <p>처리 방식이 바뀌면 이 페이지와 수정일을 함께 고칩니다. 운영: 제이 미디어(J MEDIA). 문의는 <a href="/contact/">문의·정정 요청</a>을 이용하세요.</p>
    </section>`);

trust("/terms/", "이용약관", "영농폐기물 집하장 지도의 정보 성격, 이용자가 직접 확인할 사항, 외부 서비스, 금지 행위, 책임 범위를 안내합니다.", "이용약관", "영농폐기물 집하장 지도를 이용할 때 알아 두어야 할 조건입니다. 이용하면 이 약관에 동의한 것으로 봅니다.", `
    <section class="box">
      <h2>1. 서비스의 성격</h2>
      <p>이 서비스는 한국환경공단이 공공데이터포털에 공개한 영농폐기물 공동집하장 주소를 지역별로 찾기 쉽게 보여 주고, 공식 안내를 바탕으로 배출 방법을 정리한 참고 정보입니다. 정부, 한국환경공단, 지방자치단체의 공식 서비스가 아닙니다. 운영자는 제이 미디어(J MEDIA)입니다.</p>
    </section>
    <section class="box">
      <h2>2. 이용자가 직접 확인할 사항</h2>
      <p>공개자료는 2025년 8월 27일 기준 파일이며 운영 요일, 수거 일정, 받는 품목, 연락처가 들어 있지 않습니다. 집하장을 이용하기 전에 읍·면 행정복지센터나 시·군 담당 부서에 현재 운영 여부와 배출 기준을 확인해야 합니다. 지역 기준이 이 사이트의 설명과 다르면 지역 기준을 따르세요.</p>
    </section>
    <section class="box">
      <h2>3. 책임의 범위</h2>
      <p>운영자는 정보를 정확하게 유지하려고 노력하지만, 원자료의 오류, 자료 기준일 이후의 변경, 지도 검색 결과의 차이로 생긴 손해를 보장하지 않습니다. 보상금 지급, 과태료 등 행정 처분, 법 적용 여부는 해당 기관이 판단하며 이 사이트의 설명은 법률 자문이 아닙니다.</p>
    </section>
    <section class="box">
      <h2>4. 외부 서비스</h2>
      <p>네이버 지도, 카카오맵, 공공데이터포털, 정부·지자체 누리집, 보리장터 등 외부 링크는 각 사업자의 약관과 개인정보처리방침을 따릅니다. 지도 링크는 주소 글자로 검색한 결과를 보여 주며 집하장의 정확한 입구를 뜻하지 않습니다.</p>
    </section>
    <section class="box">
      <h2>5. 금지 행위</h2>
      <p>서비스에 과도한 자동 요청을 보내거나 보안을 우회하는 행위, 공개 문의 창구에 다른 사람의 개인정보·비방·광고를 올리는 행위를 금지합니다. 공공데이터 원문은 포털의 이용 조건(이용허락범위 제한 없음)에 따라 누구나 이용할 수 있으며, 이 사이트의 안내 문장과 구성은 운영자에게 저작권이 있습니다.</p>
    </section>
    <section class="box">
      <h2>6. 변경</h2>
      <p>서비스 내용과 약관은 바뀔 수 있으며, 바뀌면 이 페이지의 수정일을 고칩니다. 문의는 <a href="/contact/">문의·정정 요청</a>을 이용하세요.</p>
    </section>`);

// ---------------------------------------------------------------- 404
write("/404.html", page({
  route: "/404.html",
  title: `페이지를 찾을 수 없습니다 | ${SITE_NAME}`,
  description: "요청한 페이지를 찾을 수 없습니다.",
  noindex: true,
  narrow: true,
  body: `
    <div class="page-head">
      <h1>페이지를 찾을 수 없습니다</h1>
      <p class="lead">주소가 바뀌었거나 없어진 페이지입니다. 아래에서 다시 찾아보세요.</p>
    </div>
    <p class="cta-row"><a class="btn" href="${FINDER_ROUTE}">집하장 주소 찾기</a><a class="btn-line" href="/guide/">배출 방법 보기</a><a class="btn-line" href="/">처음으로</a></p>`
}));

console.log(`Generated ${written.length} pages (${provinces.filter(hasProvincePage).length} province pages, ${GUIDES.length} guides). Duplicate extra rows: ${totalDuplicates}, rows without 읍·면: ${totalNoArea}.`);
