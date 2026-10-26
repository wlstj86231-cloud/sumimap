// Generates every public HTML page of 영농폐기물 집하장 지도.
// Facts come from the verified TSV (scripts/lib/farm-data.mjs) and from the
// official sources in scripts/lib/sources.mjs (re-read 2026-10-26).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DATA, NO_AREA, loadRows, groupRegions, mapQuery, hasProvincePage, provinceHref, looseVillage } from "./lib/farm-data.mjs";
import { page, esc, finderHref, sourcesBlock, metaBlock, scopeBlock, boribay, SITE_URL, SITE_NAME, FINDER_ROUTE, FINDER_JS, CHECKED, ORG_REF, WEBSITE_REF, OPERATOR_INFO } from "./lib/layout.mjs";
import { SRC } from "./lib/sources.mjs";
import { GUIDES, GUIDE_LIST, relatedGuides } from "./lib/guides.mjs";
import { LOCAL_NOTES, KECO_FACILITIES, SEJONG_TABLE, compareSejong } from "./lib/local-notes.mjs";

// 게시일: first commit that published the current content of each page.
// 2026-09-24 = 082621f (finder and /kr/ hub), 2026-10-26 = 6916ac0 (province pages, guides).
const FIRST_PUBLISHED = { finder: "2026-09-24", directory: "2026-09-24", province: "2026-10-26" };

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const siteRoot = path.join(root, "site");
const rows = loadRows();
const provinces = groupRegions(rows);
const fmt = (n) => n.toLocaleString("ko-KR");
// Korean particle after a word (ignores a trailing "(…)"): josa("의령(의령읍)", "이", "가") -> "의령(의령읍)이".
const josa = (word, withFinal, withoutFinal) => {
  const base = String(word).replace(/\([^)]*\)\s*$/u, "").trim();
  const code = base.charCodeAt(base.length - 1) - 0xac00;
  const hasFinal = code >= 0 && code <= 11171 ? code % 28 !== 0 : /[0-9]$/u.test(base) ? !/[2459]$/u.test(base) : false;
  return `${word}${hasFinal ? withFinal : withoutFinal}`;
};
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
      <p><a href="${SRC.data.url}">공공데이터포털의 한국환경공단 「전국 영농폐기물 공동집하장 위치」</a> 2025년 8월 27일 기준 파일에서 시·도, 시·군·구, 이름, 소재지를 가져왔습니다. 포털의 이용 조건은 ‘이용허락범위 제한 없음’입니다. ${fmt(DATA.totalRows)}건은 자료에 실린 주소 줄 수이며, 같은 주소가 두 번 실린 경우도 있어 실제 운영 중인 집하장 수와 다릅니다. 좌표가 없어 거리순 정렬은 하지 않습니다.</p>
      <p><a href="/sources/">자료 출처와 가공 방법</a> · <a href="/about/">서비스 소개</a> · <a href="/kr/">시·도별 목록</a></p>
    </section>
    <section class="box box-soft" aria-labelledby="who-title">
      <h2 id="who-title">누가 만드나요</h2>
      <p>보리장터(boribay.com)를 운영하는 제이 미디어가 만들고 관리합니다. 정부나 한국환경공단의 서비스가 아니며, 주소와 설명은 공식 자료를 옮겨 정리한 것입니다. 틀린 곳은 <a href="/contact/">문의</a>로 알려 주시면 원문과 대조해 고치고 <a href="/policy/#changelog">수정 기록</a>에 남깁니다.</p>
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
    datePublished: FIRST_PUBLISHED.finder,
    dateModified: CHECKED,
    author: ORG_REF,
    publisher: ORG_REF,
    isPartOf: WEBSITE_REF
  }],
  scripts: `<script type="application/json" id="finder-index">${JSON.stringify(finderIndex).replaceAll("</", "<\\/")}</script>
  <script src="${FINDER_JS}" defer></script>`,
  body: `
    <div class="page-head">
      <h1>영농폐기물 공동집하장 찾기</h1>
      <p class="lead">지역을 차례로 누르거나 마을 이름으로 찾으면, 한국환경공단 공개자료에 실린 집하장 주소가 나옵니다.</p>
      ${metaBlock({ published: FIRST_PUBLISHED.finder, sources: 2 })}
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
        <li><strong>이용 조건:</strong> 공공데이터포털에 ‘이용허락범위 제한 없음’, 무료로 표시된 자료입니다. 제공기관은 한국환경공단입니다.</li>
        <li><strong>기준 파일:</strong> 2025년 8월 27일 기준 파일(${fmt(DATA.totalRows)}건)을 보관해 사용합니다. 2026-10-26에 포털을 다시 열었을 때는 2026년 9월 29일 수정 파일(전체 행 9,553)이 올라와 있었습니다. 새 파일 내용은 아직 이 사이트 자료와 한 줄씩 대조하지 않았으므로, 화면의 기준일은 2025년 8월 27일로 표시합니다.</li>
        <li><strong>쓴 항목:</strong> 시·도, 시·군·구, 공동집하장 이름, 소재지 네 가지입니다. 운영 여부, 수거 요일, 받는 품목, 연락처, 좌표는 원자료에 없습니다.</li>
        <li><strong>건수의 뜻:</strong> ${fmt(DATA.totalRows)}건은 주소 줄 수입니다. 완전히 같은 줄이 ${fmt(totalDuplicates)}건 더 들어 있고 이를 합치지 않았으므로 실제 집하장 수와 다릅니다.</li>
        <li><strong>표시 방법:</strong> 이름이 빈 16건은 ‘이름 미등록’으로 보여 줍니다. 소재지에 지역명이 빠진 1건은 시·도와 시·군·구를 앞에 붙이고, 지역명이 두 번 적힌 3건은 한 번만 보여 줍니다. 원자료의 오탈자는 고치지 않았습니다.</li>
        <li><strong>읍·면·동 단추:</strong> 주소 글자에 적힌 읍·면·동으로 묶었습니다. ${fmt(totalNoArea)}건은 주소에 읍·면이 없어 ‘${NO_AREA}’으로 모았습니다.</li>
        <li><strong>지도 버튼:</strong> 좌표가 없어 주소 글자로 검색합니다. 괄호 속 설명을 빼고 ‘고단1리’는 ‘고단리’처럼 번호를 뺀 이름으로 검색하며, 결과가 집하장 입구와 다를 수 있습니다.</li>
      </ul>
      <p>가공 과정은 <a href="/sources/#farm-data">자료 출처</a>에 공개하며, 원문과 다른 표시는 <a href="/contact/">문의</a>로 알려 주세요. <a href="/data/farm-waste-collection-sites-2025.tsv">가공한 주소 파일(TSV, 약 0.9MB) 내려받기</a></p>
    </section>

    <section class="box" aria-labelledby="how-title">
      <h2 id="how-title">찾기 도구가 주소를 고르는 방식</h2>
      <ol class="steps-list">
        <li><strong>지역 단추:</strong> 시·도와 시·군·구는 원자료의 두 열을 그대로 씁니다. 읍·면·동 단추는 소재지 글자에서 처음 나오는 읍·면·동을 읽어 묶은 것입니다. 읍·면이 빠진 주소가 절반 이상인 시·군은 읍·면 단추 없이 주소를 바로 보여 주고, 시·도 페이지에서는 마을(리) 이름 단추로 묶습니다.</li>
        <li><strong>검색:</strong> 시·도·시·군·읍면·이름·주소를 한 줄로 이어 붙인 글자에서 찾습니다. 먼저 띄어쓰기를 모두 빼고 찾고, 그렇게 해서 나온 주소가 없을 때만 낱말을 나눠 모든 낱말이 들어간 주소를 보여 줍니다. 숫자 없이 ‘고단리’로 찾으면 ‘고단1리’, ‘고단2리’도 함께 나오고, ‘고단1리’처럼 숫자를 넣으면 그 마을만 나옵니다.</li>
        <li><strong>순서:</strong> 결과는 원자료에 실린 순서대로 20건씩 보여 줍니다. 좌표가 없어 가까운 순으로 정렬하지 않습니다.</li>
        <li><strong>지도 버튼:</strong> 화면 주소는 원문 그대로 두고, 지도 검색어에서만 괄호 속 설명을 빼고 행정리 번호를 뺀 이름(‘고단1리’→‘고단리’)으로 바꿉니다.</li>
      </ol>
      <p>검색어와 고른 지역은 이 기기의 브라우저 안에서만 처리하며 서버로 보내지 않습니다. 고른 시·도의 주소 파일만 내려받고, 다음 방문 때 ‘지난번에 본 지역’ 단추를 보여 주려고 마지막 지역 이름을 기기에 저장합니다(<a href="/privacy/">개인정보처리방침</a>).</p>
    </section>

    ${scopeBlock([
      "이 도구는 공개자료에 실린 주소를 찾아 줄 뿐, 집하장이 지금 운영 중인지, 언제 수거하는지, 무엇을 받는지는 알려 주지 못합니다. 이용 전에 읍·면 행정복지센터나 시·군청 환경(자원순환) 담당 부서에 확인하세요.",
      "운영자는 현장 방문이나 지자체 전화 확인을 하지 않았습니다. 2026년 9월 29일 수정된 포털의 새 파일은 아직 이 자료와 한 줄씩 대조하지 않았습니다.",
      `${missingProvinces}의 주소는 기준 파일에 없습니다. 이 지역에 집하장이 없다는 뜻은 아니므로 구청·시청에 문의하세요.`,
      "원자료의 오탈자나 없어진 집하장은 제공기관(한국환경공단)이 고칠 수 있습니다. 공공데이터포털 자료 페이지의 오류신고를 이용하세요."
    ])}
    ${sourcesBlock([SRC.data, SRC.keco])}

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
    datePublished: FIRST_PUBLISHED.directory,
    dateModified: CHECKED,
    author: ORG_REF,
    publisher: ORG_REF,
    isPartOf: WEBSITE_REF,
    hasPart: provinces.filter(hasProvincePage).map((p) => ({ "@type": "WebPage", name: `${p.name} 영농폐기물 공동집하장`, url: `${SITE_URL}/kr/${p.slug}/` }))
  }],
  body: `
    <div class="page-head">
      <h1>시·도별 영농폐기물 공동집하장 목록</h1>
      <p class="lead">시·도를 고르면 시·군·구와 읍·면·동별 주소 건수가 나옵니다. 주소를 바로 보려면 <a href="${FINDER_ROUTE}">집하장 찾기</a>를 이용하세요.</p>
      ${metaBlock({ published: FIRST_PUBLISHED.directory, sources: 2 })}
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
    ${scopeBlock([
      "이 목록은 한국환경공단 공개자료(2025년 8월 27일 기준)의 건수와 주소만 보여 줍니다. 운영 여부, 수거 일정, 받는 품목은 들어 있지 않습니다.",
      "시·도 페이지는 주소가 20건 이상인 12개 시·도에만 만들었고, 대전·울산은 이 페이지에 주소를 모두 적었습니다."
    ])}
    ${sourcesBlock([SRC.data, SRC.keco])}`
}));

// ---------------------------------------------------------------- province pages
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

// Patterns counted on the displayed address/name text (see /sources/).
const ROAD_ADDRESS = /(?:^|\s)[가-힣0-9]+(?:로|길)\s?[0-9]/u;
const SAN_LOT = /(?:\s|리|동)산\s?[0-9]/u;
const PLACE_HINT = /(옆|앞|뒤|입구|맞은편|건너편|인근|아래|부근|공터|회관|창고|교$|안길|진입로|농로)/u;

// What the operator read off this province's rows. Every number is counted
// from the 2025-08-27 file at build time; nothing here comes from field visits.
function provinceInsights(p) {
  const total = p.rows.length;
  const pct = (part) => `${Math.round((part / total) * 100)}%`;
  const byCount = [...p.cities].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "ko"));
  const items = [];

  if (p.cities.length >= 3) {
    const top = byCount.slice(0, 3);
    const share = top.reduce((sum, city) => sum + city.count, 0);
    const small = byCount.filter((city) => city.count <= 5);
    items.push(`<strong>건수가 몰린 곳.</strong> ${top.map((city) => `${esc(city.name)} ${fmt(city.count)}건`).join(", ")}을 합치면 ${p.short} 전체의 ${pct(share)}입니다.${small.length ? ` 반대로 ${josa(small.map((city) => `${esc(city.name)}(${fmt(city.count)}건)`).join(", "), "은", "는")} 5건 이하입니다.` : ""} 이 자료는 시·군이 해마다 제출한 정보를 모은 것이라(포털 설명), 건수가 적다고 집하장이 적다고 단정할 수는 없습니다.`);
  } else if (p.cities.length === 2) {
    items.push(`<strong>두 곳으로 나뉩니다.</strong> ${byCount.map((city) => `${esc(city.name)} ${fmt(city.count)}건`).join(", ")}입니다.`);
  }
  const areaCounts = p.cities
    .flatMap((city) => city.areas.filter(([name]) => name !== NO_AREA).map(([name, count]) => [p.cities.length > 1 ? `${city.name} ${name}` : name, count]))
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "ko"));
  if (areaCounts.length) {
    items.push(`<strong>주소가 많은 읍·면·동.</strong> 주소에 적힌 읍·면·동 ${fmt(areaCounts.length)}곳 가운데 ${areaCounts.slice(0, 3).map(([name, count]) => `${esc(name)} ${fmt(count)}건`).join(", ")} 순으로 많습니다.`);
  }

  const villages = new Map();
  for (const row of p.rows) {
    if (!row.village) continue;
    const area = row.area === NO_AREA || row.area === row.village ? "" : `${row.area} `;
    const key = `${p.cities.length > 1 ? `${row.city} ` : ""}${area}${row.village}`;
    if (!villages.has(key)) villages.set(key, new Set());
    villages.get(key).add(row.line);
  }
  const multi = [...villages].map(([name, lines]) => [name, lines.size]).filter(([, count]) => count >= 3).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "ko"));
  if (multi.length) {
    items.push(`<strong>한 마을에 여러 곳.</strong> 같은 리·동에 서로 다른 주소가 3건 이상 실린 마을이 ${fmt(multi.length)}곳입니다(예: ${multi.slice(0, 2).map(([name, count]) => `${esc(name)} ${fmt(count)}건`).join(", ")}). 이런 마을은 집에서 가장 가까운 곳이 어디인지 이장에게 물어보세요.`);
  }

  const road = p.rows.filter((row) => ROAD_ADDRESS.test(row.address)).length;
  const san = p.rows.filter((row) => SAN_LOT.test(row.address));
  items.push(`<strong>주소를 적은 방식.</strong> ${road ? `도로 이름과 번호(‘○○로 12’ 꼴)로 적힌 주소가 ${fmt(road)}건(${pct(road)})이고 ` : ""}나머지는 대부분 리·동 이름과 지번입니다.${san.length ? ` ‘산’ 지번은 ${fmt(san.length)}건이며(예: ${esc(san[0].address)}), 지도 핀이 입구와 떨어질 수 있습니다.` : ""}`);

  const notes = p.rows.map((row) => row.address.match(/\(([^)]+)\)/u)?.[1]).filter(Boolean);
  if (notes.length) {
    const freq = new Map();
    for (const note of notes) freq.set(note, (freq.get(note) || 0) + 1);
    const hints = [...freq].filter(([note]) => PLACE_HINT.test(note)).sort((a, b) => b[1] - a[1]).slice(0, 3);
    const shown = hints.length ? hints : [...freq].slice(0, 2);
    items.push(`<strong>괄호 속 위치 설명.</strong> ${fmt(notes.length)}건에 괄호 설명이 붙어 있습니다(예: ${shown.map(([note, count]) => `‘${esc(note)}’${count > 1 ? ` ${fmt(count)}건` : ""}`).join(", ")}). 지도 검색에서는 빠지니 현장에서 자리를 찾는 단서로 쓰세요.`);
  }

  const named = p.rows.filter((row) => row.name !== "이름 미등록");
  const withWord = named.filter((row) => row.name.includes("집하장")).length;
  const hall = named.filter((row) => /(마을회관|경로당)/u.test(row.name)).length;
  const bare = named.filter((row) => !/(집하장|집하소|회관|경로당|창고|보관)/u.test(row.name));
  const bareExamples = [...new Set(bare.map((row) => row.name.trim()).filter((name) => name.length >= 2 && name.length <= 8))].slice(0, 2);
  items.push(`<strong>집하장 이름.</strong> ‘집하장’이 들어간 이름이 ${fmt(withWord)}건(${pct(withWord)})입니다.${hall >= 5 ? ` ‘마을회관’·‘경로당’이 적힌 이름도 ${fmt(hall)}건이니, 자리가 헷갈리면 그곳에 먼저 물어보세요.` : ""}${bare.length >= 5 && bareExamples.length ? ` ${fmt(bare.length)}건은 ${bareExamples.map((name) => `‘${esc(name)}’`).join(", ")}처럼 마을 이름 등만 적혀 있어, 마을에서 부르는 이름으로 검색해도 나옵니다.` : ""}`);

  const noArea = p.rows.filter((row) => row.area === NO_AREA).length;
  const villageCities = p.cities.filter((city) => !useAreas(city) && city.count > 3).map((city) => esc(city.name));
  items.push(noArea
    ? `<strong>읍·면이 빠진 주소.</strong> ${fmt(noArea)}건(${pct(noArea)})은 읍·면 없이 마을 이름부터 적혀 있습니다.${villageCities.length ? ` ${josa(villageCities.join(", "), "은", "는")} 대부분 이런 형태라 아래에서 마을 이름 단추로 묶었습니다.` : " 아래 ‘읍·면 표기 없음’ 단추에 모았습니다."}`
    : `<strong>읍·면 표기.</strong> 모든 주소에 읍·면·동이 적혀 있어 아래 단추로 바로 좁힐 수 있습니다.`);

  const dup = duplicateExtra(p.rows);
  const noName = unnamed(p.rows);
  items.push(`<strong>건수를 읽는 법.</strong> ${dup ? `완전히 같은 줄 ${fmt(dup)}건을 합치지 않아 실제 집하장 수는 ${fmt(p.count)}곳보다 적을 수 있습니다.` : "같은 줄이 반복된 경우는 없지만, 건수가 지금 운영 중인 집하장 수라는 뜻은 아닙니다."}${noName ? ` 이름 칸이 빈 ${fmt(noName)}건은 ‘이름 미등록’으로 보여 줍니다.` : ""}`);
  return items;
}

function sejongComparison(p) {
  const result = compareSejong(p.rows);
  const listed = SEJONG_TABLE.areas.reduce((sum, [, , lots]) => sum + lots.length, 0);
  return `<h3>세종시 설치현황 표와 공개자료 맞춰 보기</h3>
      <p>세종시 자원순환 누리집의 ‘영농폐기물 공동집하장 설치현황’ 표는 ${SEJONG_TABLE.declared}개소로 적혀 있고, 표에 지번이 적힌 곳은 ${listed}곳입니다(장군면은 11개소로 적혀 있으나 지번은 10곳). 이 표와 공개자료 ${fmt(p.count)}줄을 읍·면, 리, 지번으로 하나씩 맞춰 보았습니다.</p>
      <div class="compare-grid">
        <div><h4>둘 다 있는 곳</h4><p><b>${result.both}곳</b> · 읍·면, 리, 지번이 모두 같습니다.</p></div>
        <div><h4>공개자료에만 있는 줄 ${result.onlyData.length}건</h4><ul>${result.onlyData.map((address) => `<li>${esc(address)}</li>`).join("")}</ul></div>
        <div><h4>시 표에만 있는 곳 ${result.onlyCity.length}곳</h4><ul>${result.onlyCity.map((lot) => `<li>${esc(lot)}</li>`).join("")}</ul></div>
      </div>
      <p>도로 이름으로 적혔거나 지번이 조금 다른 줄(예: 전동면 청람리 58-5와 58-1)은 같은 집하장이어도 일치로 세지 않았습니다. 어느 쪽이 지금 맞는지는 이 사이트가 판단할 수 없으니, 시 표에 없는 곳을 이용하려면 읍·면사무소에 먼저 확인하세요.</p>
      <ul>
        <li>폐비닐 수거보상금은 세종시가 1kg당 A등급 140원·B등급 100원·C등급 60원, 농약 빈 용기는 한국환경공단이 유리병 300원·플라스틱병 1,600원·봉지 3,680원(1kg당)을 지급한다고 적혀 있습니다.</li>
        <li>영농폐기물이 1톤 이상 나오면 시가 배출을 지원하고, 5톤 이상이면 한국환경공단이 수거·처리한다고 안내합니다.</li>
        <li>남은 농약은 용기째 밀봉해 읍·면사무소에 방문·배출 신청을 하면 관리자가 지켜보는 가운데 전용 수거함에 넣는 방식입니다.</li>
        <li>담당: 세종시 자원순환과 도시청결팀, 누리집에 적힌 연락처 044-300-4724.</li>
      </ul>
      <p class="small">출처: <a href="${esc(SRC.sejong.url)}">${esc(SRC.sejong.org)} · ${esc(SRC.sejong.title)}</a>, 확인일 ${CHECKED}</p>`;
}

function localSection(p) {
  const notes = LOCAL_NOTES[p.name] || [];
  const facilities = KECO_FACILITIES[p.name];
  const parts = [];
  if (p.name === "세종특별자치시") parts.push(sejongComparison(p));
  for (const note of notes) {
    parts.push(`<h3>${esc(note.title)}</h3>
      ${note.html}
      <p class="small">출처: <a href="${esc(note.source.url)}">${esc(note.source.org)} · ${esc(note.source.title)}</a>, 확인일 ${CHECKED}</p>`);
  }
  if (facilities) {
    parts.push(`<h3>모은 폐비닐이 가는 곳</h3>
      <p>한국환경공단이 안내하는 영농 폐비닐 재활용시설 7곳 가운데 ${josa(facilities.join(", "), "이", "가")} ${p.short}에 있습니다. 공단은 마을 공동집하장에서 수거한 폐비닐을 자체 재활용시설에서 재활용해 국내외 재활용업체에 공급한다고 설명합니다. 농가가 직접 가져가는 곳으로 안내된 시설은 아니므로, 배출은 마을 공동집하장으로 하세요.</p>
      <p class="small">출처: <a href="${esc(SRC.keco.url)}">${esc(SRC.keco.org)} · ${esc(SRC.keco.title)}</a>, 확인일 ${CHECKED}</p>`);
  }
  const checkedLocal = notes.some((note) => note.kind !== "context") || p.name === "세종특별자치시";
  const fallback = p.cities.length === 1
    ? `<p class="small">위 안내는 ${p.short === "세종" ? "세종시" : p.short} 누리집 표기를 옮긴 것이라 그 뒤에 바뀌었을 수 있습니다. 이용 전에 읍·면사무소나 담당 부서에 확인하세요.</p>`
    : checkedLocal
    ? `<p class="small">위 안내는 ${p.short}의 일부 시·군 누리집에서 옮긴 것입니다. 다른 시·군의 기준은 다를 수 있으니 해당 시·군청이나 읍·면 행정복지센터에 확인하세요.</p>`
    : `<p>${p.short} 시·군 누리집의 배출 안내는 아직 원문과 대조하지 않아 옮기지 않았습니다. 시·군청 누리집에서 ‘영농폐기물’을 검색하거나 읍·면 행정복지센터에 물어보세요.</p>`;
  return `<section class="box box-soft" aria-labelledby="local-title">
      <h2 id="local-title">${p.short}에서 확인한 공식 안내</h2>
      ${parts.join("\n      ")}
      ${fallback}
    </section>`;
}

function provinceSources(p) {
  const list = [SRC.data, SRC.keco];
  if (p.name === "세종특별자치시") list.push(SRC.sejong);
  for (const note of LOCAL_NOTES[p.name] || []) if (!list.includes(note.source)) list.push(note.source);
  return list;
}

for (const p of provinces.filter(hasProvincePage)) {
  const route = `/kr/${p.slug}/`;
  const top = [...p.cities].sort((a, b) => b.count - a.count).slice(0, 3);
  const listAddresses = p.count <= 60;
  const areaTotal = p.cities.reduce((sum, city) => sum + city.areas.filter(([name]) => name !== NO_AREA).length, 0);
  const sources = provinceSources(p);
  write(route, page({
    route,
    title: `${p.name} 영농폐기물 공동집하장 주소 ${fmt(p.count)}건 - 시·군·읍면별 | ${SITE_NAME}`,
    description: `${p.name} ${p.cities.length}개 시·군·구의 영농폐기물 공동집하장 주소 ${fmt(p.count)}건을 읍·면·동별로 나눠 보고, 주소 자료의 특징과 지역 공식 안내를 확인하세요. ${top.map((city) => `${city.name} ${fmt(city.count)}건`).join(", ")}. 한국환경공단 2025년 공개자료 기준.`,
    crumbs: [["홈", "/"], ["시·도별 목록", "/kr/"], [p.name, route]],
    jsonLd: [{
      "@type": "CollectionPage",
      name: `${p.name} 영농폐기물 공동집하장 주소`,
      url: `${SITE_URL}${route}`,
      inLanguage: "ko-KR",
      isBasedOn: SRC.data.url,
      about: { "@type": "AdministrativeArea", name: p.name },
      datePublished: FIRST_PUBLISHED.province,
      dateModified: CHECKED,
      author: ORG_REF,
      publisher: ORG_REF,
      isPartOf: WEBSITE_REF,
      citation: sources.map((source) => source.url)
    }],
    body: `
    <div class="page-head">
      <h1>${p.name} 영농폐기물 공동집하장</h1>
      <p class="lead">${p.name}에는 한국환경공단 2025년 공개자료 기준 ${p.cities.length}개 시·군·구에 집하장 주소 ${fmt(p.count)}건이 실려 있습니다. 시·군과 읍·면·동을 누르면 주소 목록이 열립니다.</p>
      ${metaBlock({ published: FIRST_PUBLISHED.province, sources: sources.length })}
      <p class="cta-row"><a class="btn" href="${esc(finderHref({ province: p.name }))}">${p.short} 집하장 주소 바로 찾기</a></p>
    </div>
    <ul class="stat-row" aria-label="${p.short} 자료 요약">
      <li><b>${fmt(p.count)}건</b><span>주소 줄 수</span></li>
      <li><b>${p.cities.length}곳</b><span>시·군·구</span></li>
      <li><b>${fmt(areaTotal)}곳</b><span>주소에 적힌 읍·면·동</span></li>
      <li><b>${esc(top[0].name)}</b><span>가장 많은 곳 ${fmt(top[0].count)}건</span></li>
    </ul>
    <section class="box" aria-labelledby="insight-title">
      <h2 id="insight-title">${p.short} 주소 자료에서 읽히는 것</h2>
      <p>아래는 운영자가 2025년 8월 27일 기준 공개자료의 ${p.short} ${fmt(p.count)}줄을 세어 정리한 것입니다. 현장 조사 결과가 아니며, 찾을 때 헷갈리기 쉬운 점을 미리 알려 드리려는 것입니다.</p>
      <ul>${provinceInsights(p).map((item) => `<li>${item}</li>`).join("\n        ")}</ul>
    </section>
    ${p.cities.map((city) => `<section class="city-block" aria-labelledby="c-${esc(city.name).replaceAll(" ", "-")}">
      <h2 id="c-${esc(city.name).replaceAll(" ", "-")}">${esc(city.name)} <span class="small">${fmt(city.count)}건</span></h2>
      ${useAreas(city)
        ? `<ul class="chips">${city.areas.map(([name, count]) => `<li><a class="chip" href="${esc(finderHref({ province: p.name, city: city.name, area: name }))}"><span>${esc(name)}</span><span class="count">${fmt(count)}건</span></a></li>`).join("")}</ul>`
        : city.count > 3 ? villageChips(p, city) : ""}
      <p><a href="${esc(finderHref({ province: p.name, city: city.name }))}">${esc(city.name)} 주소 ${fmt(city.count)}건 모두 보기 →</a></p>
      ${listAddresses ? staticAddressList(city) : ""}
    </section>`).join("\n    ")}
    ${localSection(p)}
    ${scopeBlock([
      `${p.short} ${fmt(p.count)}건은 2025년 8월 27일 기준 공개자료의 주소입니다. 운영 요일, 수거 일정, 받는 품목, 보상금은 들어 있지 않으니 이용 전에 읍·면 행정복지센터나 ${esc(top[0].name)} 등 시·군청 환경 담당 부서에 확인하세요. → <a href="/guide/before-visit/">가기 전 확인할 5가지</a>`,
      "운영자는 현장 방문이나 전화 조사를 하지 않았습니다. 원자료의 오탈자나 없어진 집하장은 공공데이터포털 자료 페이지의 오류신고로 한국환경공단에 알릴 수 있습니다."
    ])}
    ${sourcesBlock(sources)}
    <p><a href="/kr/">다른 시·도 목록 보기</a> · <a href="/guide/">품목별 배출 방법</a></p>`
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
      mainEntityOfPage: `${SITE_URL}${guide.route}`,
      inLanguage: "ko-KR",
      datePublished: guide.published,
      dateModified: CHECKED,
      author: ORG_REF,
      publisher: ORG_REF,
      citation: guide.sources.map((source) => source.url),
      isPartOf: WEBSITE_REF
    }],
    body: `
    <div class="page-head">
      <h1>${esc(guide.h1)}</h1>
      <p class="lead">${esc(guide.lead)}</p>
      ${metaBlock({ published: guide.published, sources: guide.sources.length })}
    </div>
    ${guide.body}
    ${scopeBlock(guide.scope)}
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
  jsonLd: [{
    "@type": extra.type || "WebPage",
    name: title,
    url: `${SITE_URL}${route}`,
    inLanguage: "ko-KR",
    dateModified: CHECKED,
    author: ORG_REF,
    publisher: ORG_REF,
    isPartOf: WEBSITE_REF,
    ...(extra.aboutOrg ? { mainEntity: ORG_REF } : {})
  }],
  body: `
    <div class="page-head">
      <h1>${esc(h1)}</h1>
      <p class="lead">${esc(lead)}</p>
      <p class="meta-line">작성·관리: <a href="/editorial/">제이 미디어 편집팀</a> (운영 책임: 대표 ${OPERATOR_INFO.ceo}) · 최종 수정 ${CHECKED}</p>
    </div>
${body}`
}));

const telHref = `tel:${OPERATOR_INFO.phone.replaceAll("-", "")}`;
const mailHref = `mailto:${OPERATOR_INFO.email}?subject=${encodeURIComponent("[영농폐기물 집하장 지도] 문의")}`;
// Cloudflare's email obfuscation would turn the address into a /cdn-cgi/ link and "[email protected]" without JS; email_off keeps it readable.
const emailLink = `<!--email_off--><a href="${mailHref}">${OPERATOR_INFO.email}</a><!--/email_off-->`;
const operatorTable = `<div class="table-wrap">
        <table class="facts">
          <tbody>
            <tr><th scope="row">상호</th><td>${OPERATOR_INFO.name} (제이미디어, J MEDIA)</td></tr>
            <tr><th scope="row">대표</th><td>${OPERATOR_INFO.ceo}</td></tr>
            <tr><th scope="row">사업자등록번호</th><td>${OPERATOR_INFO.bizNo}</td></tr>
            <tr><th scope="row">주소</th><td>${OPERATOR_INFO.address}</td></tr>
            <tr><th scope="row">고객센터</th><td><a href="${telHref}">${OPERATOR_INFO.phone}</a></td></tr>
            <tr><th scope="row">이메일</th><td>${emailLink}</td></tr>
            <tr><th scope="row">카카오톡 오픈채팅</th><td><a href="${OPERATOR_INFO.kakaoGeneral}">제휴·일반 문의</a> · <a href="${OPERATOR_INFO.kakaoBoribay}">보리장터 이용 문의</a></td></tr>
            <tr><th scope="row">회사 정보</th><td><a href="${OPERATOR_INFO.company}">jnewmedia.com/company</a></td></tr>
          </tbody>
        </table>
      </div>`;

const SISTER_SITES = [
  ["농산물 거래사전", "https://yomiwiki.com/"],
  ["직거래 사기 점검", "https://scamreader.com/"],
  ["농가 손익 계산기", "https://www.reportools.com/"],
  ["거래 증빙 도우미", "https://goatool.com/"],
  ["농사 비교 월드컵", "https://occultworldcup.com/"],
  ["농업 정책자금 백과", "https://policyfundpedia.com/"],
  ["농기계 자산 수첩", "https://megapureunasset.kr/"],
  ["농기계 탁송 견적 비교", "https://tripmarking.com/"]
];

trust("/about/", "서비스 소개", "영농폐기물 집하장 지도가 하는 일과 대상, 운영자 제이 미디어(대표 이정우)의 사업자 정보와 연락처, 보리장터와의 관계, 운영 비용과 광고, 주소 자료를 다룬 방법을 설명합니다.", "가까운 집하장 주소를 빨리 찾도록 돕습니다", "영농폐기물 집하장 지도는 한국환경공단 공개자료에 실린 전국 공동집하장 주소를 지역별로 찾고, 품목별 배출 방법을 공식 안내로 정리한 서비스입니다.", `
    <section class="box">
      <h2>누구를 위한 사이트인가요</h2>
      <p>폐비닐과 농약 빈 용기를 어디에 내놓아야 할지 찾는 농가, 마을 집하장을 챙기는 이장·작목반, 처음 농사를 짓는 귀농·귀촌인을 위해 만들었습니다. 휴대전화에서 큰 글씨와 큰 단추로 쓸 수 있게 만들었습니다.</p>
      <ul>
        <li><a href="${FINDER_ROUTE}">집하장 찾기</a>: 시·도 → 시·군·구 → 읍·면·동 순서나 마을 이름으로 주소를 찾고, 복사하거나 지도에서 엽니다.</li>
        <li><a href="/guide/">배출 방법</a>: 폐비닐, 농약 빈 용기, 남은 농약, 그 밖의 농자재를 어디에 어떻게 내놓는지 한국환경공단·농림축산식품부·지자체 안내로 정리합니다.</li>
        <li><a href="/kr/">시·도별 목록</a>: 시·군·구와 읍·면·동별 주소 건수, 시·도별 자료의 특징과 확인한 지역 공식 안내를 보여 줍니다.</li>
      </ul>
    </section>
    <section class="box">
      <h2>운영자</h2>
      <p>이 사이트는 제이 미디어가 만들고 운영합니다. 내용의 작성과 관리는 제이 미디어 편집팀이 맡고, 운영 책임자는 대표 ${OPERATOR_INFO.ceo}입니다. 아래 정보는 <a href="${OPERATOR_INFO.company}">제이 미디어 회사 정보</a>와 <a href="${boribay("/about")}">보리장터 운영자 정보</a>에 공개된 내용과 같습니다.</p>
      ${operatorTable}
      <p>정부, 한국환경공단, 지방자치단체의 공식 서비스가 아닙니다.</p>
    </section>
    <section class="box">
      <h2>왜 제이 미디어가 이 사이트를 만드나요</h2>
      <p>제이 미디어는 같은 지역 사람끼리 농산물과 중고 농기계를 사고팔고 농기계 운송 업체를 찾는 <a href="${boribay("/")}">보리장터</a>를 운영합니다. 농사를 마치거나 농자재를 정리하고 농기계를 바꾸면, 걷어 낸 비닐과 다 쓴 농약 병을 어디에 내놓을지가 다음 일이 됩니다. 이 사이트는 그 한 단계, 가까운 공동집하장 주소와 배출 방법을 공식 자료로 확인하는 일을 맡습니다.</p>
    </section>
    <section class="box">
      <h2>운영 비용과 광고</h2>
      <ul>
        <li>모든 기능은 무료이며 회원가입이 없습니다.</li>
        <li>배출 방법 안내 7쪽(<a href="/guide/">/guide/</a> 아래)에는 Google AdSense 자동 광고가 표시될 수 있습니다. 광고는 Google이 자동으로 고르며, 운영자가 광고 내용을 쓰거나 고르지 않습니다.</li>
        <li>집하장 찾기, 지역별 목록, 소개·정책 페이지에는 광고를 넣지 않습니다.</li>
        <li>돈을 받고 싣는 글, 협찬 콘텐츠, 유료 순위나 유료 링크는 없습니다.</li>
        <li>보리장터로 가는 링크는 운영자 자신의 서비스로 연결되는 것이며, 링크 옆에 같은 운영자라는 점을 밝힙니다.</li>
      </ul>
    </section>
    <section class="box">
      <h2>주소 자료를 다룬 방법</h2>
      <p><a href="${SRC.data.url}">공공데이터포털의 한국환경공단 자료</a>(이용허락범위 제한 없음) 2025년 8월 27일 기준 파일에서 시·도, 시·군·구, 이름, 소재지 네 항목만 썼습니다. 원자료의 줄을 고치거나 합치지 않았고, 원자료에 없는 운영 요일·좌표·연락처를 만들어 넣지 않습니다. 실제 집하장 방문이나 지자체 전화 조사는 하지 않았습니다. 자세한 내용은 <a href="/sources/">자료 출처</a>와 <a href="/editorial/">편집 원칙</a>에 있습니다.</p>
    </section>
    <section class="box">
      <h2>하지 않는 일</h2>
      <ul>
        <li>집하장의 현재 운영 여부, 수거 일정, 보상금 지급을 보장하지 않습니다.</li>
        <li>회원가입과 위치 추적이 없고, 문의할 때 직접 보내 주신 내용 말고는 개인정보를 받지 않습니다.</li>
        <li>법률 판단이나 행정 처분에 대한 자문을 하지 않습니다.</li>
      </ul>
    </section>
    <section class="box">
      <h2>보리장터와 같은 운영자의 사이트</h2>
      <p>제이 미디어는 보리장터 거래 전후에 쓰는 아래 사이트도 함께 운영합니다. 모두 같은 운영자의 사이트입니다.</p>
      <ul>
        <li><a href="${boribay("/")}">보리장터</a> — 농산물·중고 농기계 지역 거래</li>
        ${SISTER_SITES.map(([name, url]) => `<li><a href="${url}">${name}</a> (${new URL(url).hostname})</li>`).join("\n        ")}
      </ul>
      <p>주소나 설명이 틀렸다면 <a href="/contact/">문의</a>로 알려 주세요. 고친 내용은 <a href="/policy/#changelog">수정 기록</a>에 남깁니다.</p>
    </section>`, { type: "AboutPage", aboutOrg: true });

trust("/sources/", "자료 출처", "영농폐기물 집하장 지도가 쓰는 한국환경공단 공동집하장 주소 자료의 출처, 이용허락범위(제한 없음), 기준일(2025-08-27), 가공 기록과 배출 방법 안내에 쓴 공식 원문 목록을 정리했습니다.", "자료 출처와 가공 기록", "모든 주소와 배출 방법 설명은 아래 공식 원문에서 왔습니다. 원문 기관의 갱신일과 운영자가 다시 확인한 날(확인일)을 구분해 적습니다.", `
    <section class="box" id="farm-data">
      <h2>공동집하장 주소 자료 한눈에 보기</h2>
      <div class="table-wrap">
        <table class="facts">
          <tbody>
            <tr><th scope="row">자료 이름</th><td>${esc(DATA.sourceTitle)}</td></tr>
            <tr><th scope="row">제공기관</th><td>한국환경공단 (포털 표시 관리부서: 폐자원사업처 영농폐기물처리부)</td></tr>
            <tr><th scope="row">원문</th><td><a href="${SRC.data.url}">공공데이터포털 자료 페이지</a><br><small class="source-url">www.data.go.kr/data/15106132/fileData.do</small></td></tr>
            <tr><th scope="row">이용 조건</th><td>이용허락범위 제한 없음, 무료(공공데이터포털 표시)</td></tr>
            <tr><th scope="row">이 사이트가 쓰는 파일</th><td>2025년 8월 27일 기준 파일, ${fmt(DATA.totalRows)}행</td></tr>
            <tr><th scope="row">포털의 최신 표시</th><td>파일명 기준일·수정일 2026년 9월 29일, 전체 행 9,553. 새 파일은 아직 이 사이트 자료와 한 줄씩 대조하지 않았습니다.</td></tr>
            <tr><th scope="row">수집 방법</th><td>매년 지방자치단체에서 공동집하장 정보를 제출받음(포털 설명)</td></tr>
            <tr><th scope="row">갱신 주기</th><td>연간, 차기 등록 예정일 2027년 10월 4일(포털 표시)</td></tr>
            <tr><th scope="row">확인일</th><td>${CHECKED}</td></tr>
          </tbody>
        </table>
      </div>
      <h3>가공 기록</h3>
      <ul>
        <li>원본 CSV(CP949)의 시도·시군구·공동집하장명·소재지 열만 UTF-8 TSV로 바꿨습니다. 원본·변환본의 SHA-256 해시를 기록해 두고, 변환본 해시와 행 수는 점검(<code>npm run check</code>) 때마다 다시 확인합니다.</li>
        <li>화면 표시: 이름이 빈 16건은 ‘이름 미등록’, 소재지에 지역명이 빠진 1건은 시·도·시·군·구를 앞에 붙임, 지역명이 두 번 적힌 3건은 한 번만 표시. 완전히 같은 줄 ${fmt(totalDuplicates)}건은 합치지 않았습니다.</li>
        <li>읍·면·동 묶음: 주소 글자에서 첫 읍·면·동을 읽었습니다. 의성군처럼 ‘면’ 없이 적은 이름은 적힌 그대로 쓰고, 같은 시·군에 ‘○○면’ 표기가 있으면 그쪽으로 합쳤습니다. 읍·면이 없는 ${fmt(totalNoArea)}건은 ‘${NO_AREA}’으로 모았습니다.</li>
        <li>시·도 페이지의 ‘주소 자료에서 읽히는 것’은 같은 파일에서 도로 이름 주소(‘○○로 12’ 꼴), ‘산’ 지번, 괄호 설명, 이름에 든 낱말을 글자 규칙으로 센 값입니다. 사람이 한 줄씩 판정한 값이 아니라 근삿값일 수 있습니다.</li>
        <li>찾기 화면 자료: 위 TSV를 시·도별 JSON 파일로 나눠 필요한 지역만 내려받게 했습니다. 내용은 TSV와 같습니다. <a href="/data/farm-waste-collection-sites-2025.tsv">가공 TSV 내려받기</a></li>
      </ul>
      <p>재현 방법과 해시 값은 저장소의 <code>docs/data-sources/farm-waste-collection-2025.md</code>에 있습니다.</p>
    </section>
    <section class="box" id="guide-sources">
      <h2 id="sources-title">배출 방법·지역 안내에 쓴 공식 원문</h2>
      <ol class="source-list">
        ${Object.values(SRC).map((source) => `<li><a href="${esc(source.url)}">${esc(source.title)}</a> <span class="small">· ${esc(source.org)}</span><br><small>확인한 내용: ${esc(source.use)} · 확인일 ${CHECKED}</small></li>`).join("\n        ")}
      </ol>
      <p class="small">확인일(자료 대조일)은 운영자가 원문을 다시 열어 이 사이트의 설명과 맞춰 본 날입니다. 한국환경공단 영농폐기물 수거·처리사업 페이지는 최종수정일 2025-03-11로 표시되며, 수거처리체계 그림 설명(보상금·수거비 포함)을 함께 확인했습니다. 폐기물관리법은 2026년 9월 18일 시행 법률을 기준으로 읽었습니다.</p>
    </section>
    <section class="box">
      <h2>출처를 고르는 기준</h2>
      <p>정부 부처, 한국환경공단, 지방자치단체, 국가법령정보센터 원문을 씁니다. 언론 기사나 블로그는 근거로 쓰지 않습니다. 지역마다 다른 기준은 어느 시·군의 안내인지 밝혀 예시로만 씁니다. 편집 기준은 <a href="/editorial/">편집 원칙</a>에 있습니다.</p>
    </section>`, { type: "CollectionPage" });

trust("/editorial/", "편집 원칙", "영농폐기물 집하장 지도를 누가 어떻게 만드는지: 공식 원문 우선, 날짜 구분, 지역 차이 표시, AI 도구 활용 공개, 이해관계와 광고, 하지 않는 일, 오류 수정 방법.", "편집 원칙과 콘텐츠 작성 방법", "주소와 배출 방법은 농가가 실제로 짐을 싣고 움직이는 데 쓰입니다. 틀린 정보가 헛걸음이나 과태료로 이어지지 않도록 아래 원칙을 지킵니다.", `
    <section class="box">
      <h2>누가 만드나요</h2>
      <p>모든 페이지는 <strong>제이 미디어 편집팀</strong>이 작성·관리하고, 게시 내용 전체의 책임은 운영자인 제이 미디어(운영 책임: 대표 ${OPERATOR_INFO.ceo})에게 있습니다. 운영 책임자는 사이트 운영을 책임지는 사람이며, 영농폐기물 분야의 전문 감수자로 표시하지 않습니다. 운영자 정보는 <a href="/about/">서비스 소개</a>에 있습니다.</p>
    </section>
    <section class="box">
      <h2>어떻게 만드나요</h2>
      <ol class="steps-list">
        <li><strong>공식 원문을 모읍니다.</strong> 주소는 공공데이터포털의 한국환경공단 자료만 씁니다. 배출 방법, 보상금, 법 기준은 한국환경공단, 농림축산식품부, 지방자치단체, 국가법령정보센터 원문을 모읍니다.</li>
        <li><strong>원문끼리 비교합니다.</strong> 기관마다 설명이 다르면 그대로 나란히 적고, 지역 기준이면 지역 이름을 붙입니다. 예를 들어 세종시 집하장 표와 공개자료는 지번으로 맞춰 본 결과를 숫자로 보여 줍니다.</li>
        <li><strong>초안 작성과 자료 대조에 AI 도구를 씁니다.</strong> 문장 초안, 원문과 설명의 대조, 공개자료 건수 세기에 AI 도구와 스크립트를 활용합니다. 사람 전문가의 감수는 거치지 않으며, 그렇게 했다고 쓰지 않습니다.</li>
        <li><strong>출처와 날짜를 붙입니다.</strong> 각 페이지 위에 작성·관리 주체, 게시일, 최종 확인일, 출처 수를 적고, 아래에 출처 목록(기관, 제목, 주소, 확인일)과 범위와 한계를 붙입니다.</li>
        <li><strong>틀린 것은 고치고 기록합니다.</strong> 오류 제보를 받으면 원문과 다시 대조해 고치고, 날짜와 내용을 <a href="/policy/#changelog">수정 기록</a>에 남깁니다.</li>
      </ol>
    </section>
    <section class="box">
      <h2>날짜를 섞지 않습니다</h2>
      <p>원자료 기준일(2025년 8월 27일), 포털의 수정일, 운영자가 다시 확인한 날을 따로 적습니다. <strong>게시일</strong>은 그 페이지의 지금 내용이 처음 공개된 날이고, <strong>최종 확인일</strong>은 운영자가 출처 원문을 다시 열어 설명과 맞춰 본 날입니다. 확인일이 최근이어도 원자료가 최신이라는 뜻은 아닙니다.</p>
    </section>
    <section class="box">
      <h2>지역마다 다른 것은 지역 이름을 붙입니다</h2>
      <p>폐비닐 보상금, 영양제 병이나 비료 포대 처리처럼 시·군마다 다른 기준은 “세종시 안내”, “청주시 안내”처럼 출처 지역을 밝혀 예시로만 씁니다. 다른 지역에 그대로 적용된다고 쓰지 않습니다. 시·군 누리집을 대조하지 않은 시·도 페이지에는 지역 안내를 지어내 넣지 않고, 대조하지 않았다고 밝힙니다.</p>
    </section>
    <section class="box">
      <h2>없는 정보를 만들지 않습니다</h2>
      <p>원자료에 없는 운영 요일, 좌표, 연락처, 시설 사진, 이용 후기를 만들어 넣지 않습니다. 건수를 운영 중인 집하장 수로 바꿔 말하지 않습니다. 하지 않은 현장 조사나 전문가 감수를 했다고 쓰지 않습니다. 예시가 필요하면 실제 공개자료의 주소를 쓰거나, 지어낸 예시라면 ‘가상 예시’라고 밝힙니다.</p>
    </section>
    <section class="box">
      <h2>하지 않는 일</h2>
      <ul>
        <li>집하장의 현재 운영, 수거 일정, 보상금 지급, 법 적용 여부를 보장하지 않습니다. 이는 해당 기관이 결정합니다.</li>
        <li>개별 사안에 대한 법률·행정 자문을 하지 않습니다. 과태료 등 처분은 처분한 기관에 문의해야 합니다.</li>
        <li>농약 노출 같은 건강 문제에 대한 의학적 조언을 하지 않습니다.</li>
      </ul>
    </section>
    <section class="box">
      <h2>이해관계와 광고</h2>
      <ul>
        <li>보리장터는 이 사이트를 운영하는 제이 미디어의 서비스입니다. 보리장터로 연결할 때는 같은 운영자라는 점을 밝히고, 독립된 외부 추천처럼 표시하지 않습니다.</li>
        <li>배출 방법 안내 페이지에는 Google AdSense 광고가 표시될 수 있습니다. 광고 내용은 Google이 고르며, 광고 때문에 설명을 바꾸지 않습니다.</li>
        <li>돈을 받고 싣는 글, 협찬 콘텐츠, 유료 링크는 없습니다.</li>
      </ul>
    </section>`);

const CHANGELOG = [
  ["2026-10-26", "운영자 정보(상호, 대표, 사업자등록번호, 주소, 연락처)를 서비스 소개·문의 페이지와 모든 페이지 바닥글에 공개하고, 이메일·전화·카카오톡 문의 창구를 더했습니다."],
  ["2026-10-26", "시·도 페이지 12곳에 공개자료를 세어 정리한 ‘주소 자료에서 읽히는 것’, 확인한 지역 공식 안내(세종·청주·당진·밀양, 군위군 편입 근거, 한국환경공단 폐비닐 재활용시설 위치), 범위와 한계를 더했습니다."],
  ["2026-10-26", "세종시 누리집의 공동집하장 설치현황 표기가 35개소로 바뀐 것을 확인해 ‘38개소’로 적었던 설명을 고치고, 시 표와 공개자료를 지번으로 맞춰 본 결과를 세종 페이지에 실었습니다."],
  ["2026-10-26", "찾기 도구와 안내 페이지마다 작성·관리 주체, 게시일, 최종 확인일, 출처 수, 범위와 한계를 표시했습니다. 자료 출처 페이지에 이용 조건(이용허락범위 제한 없음)과 기준일을 표로 정리하고, 개인정보처리방침의 광고 쿠키 설명과 편집 원칙의 작성 방법(AI 도구 활용) 설명을 보강했습니다."],
  ["2026-10-26", "찾기 화면에서 띄어 쓴 검색어도 찾도록 고치고, 마을 단추의 건수를 실제 결과 수와 맞추고, 보상금을 받는 주체에 대한 설명(밀양시 안내)을 더했습니다."],
  ["2026-10-26", "찾기 도구를 시·도 → 시·군·구 → 읍·면·동 순서로 다시 만들고, 배출 방법 안내 7쪽을 공식 원문을 근거로 새로 실었습니다."],
  ["2026-10-26", "사이트 이름을 지금의 ‘영농폐기물 집하장 지도’로 바꾸고, 이전 주제(일본 도시 안내) 페이지는 종료 안내(HTTP 410)로 바꿨습니다."],
  ["2026-10-15", "보관 중인 2025년 8월 27일 기준 주소 파일과 포털의 최신 표시(2026년 9월 29일 수정)를 구분해 적었습니다."],
  ["2026-09-27", "영농폐기물 공동집하장 찾기를 사이트의 주 서비스로 바꿨습니다."],
  ["2026-09-24", "한국환경공단 공개자료로 영농폐기물 공동집하장 주소 찾기를 처음 공개했습니다."]
];

trust("/policy/", "정정 정책과 수정 기록", "영농폐기물 집하장 지도의 주소 표시·배출 방법 설명에 대한 정정 요청을 어떻게 확인하고 반영하는지, 그리고 지금까지 고친 내용의 날짜별 기록입니다.", "정정 요청은 원문과 대조해 반영합니다", "주소가 다르거나 집하장이 없어졌거나 설명이 틀렸다면 알려 주세요. 확인 가능한 원문과 대조한 뒤 반영하고, 고친 내용은 아래 수정 기록에 남깁니다.", `
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
      <h2>처리 순서</h2>
      <ol class="steps-list">
        <li><strong>접수:</strong> <a href="/contact/">문의</a>의 이메일·전화·카카오톡으로 받습니다.</li>
        <li><strong>원문 대조:</strong> 공공데이터포털 원문, 기관 누리집, 법령 원문을 다시 열어 봅니다.</li>
        <li><strong>반영 또는 안내:</strong> 사이트의 표시·설명 오류는 고치고, 원자료 자체의 오류는 제공기관에 알리도록 안내합니다.</li>
        <li><strong>기록:</strong> 고친 날짜와 내용을 아래 수정 기록에 남기고, 해당 페이지의 최종 확인일을 바꿉니다.</li>
      </ol>
    </section>
    <section class="box">
      <h2>반영 기준</h2>
      <ul>
        <li><strong>표시 오류</strong>(가공 과정에서 생긴 차이)는 확인되는 대로 고칩니다.</li>
        <li><strong>원자료 자체의 오류</strong>(예: 오탈자, 없어진 집하장)는 원자료를 고치지 않고, 해당 내용과 함께 제공기관(한국환경공단·공공데이터포털)에 알리도록 안내합니다. 새 공개 파일이 나오면 다시 대조합니다.</li>
        <li><strong>배출 방법 설명</strong>은 정부·공단·지자체 원문으로 확인되면 고치고 확인일을 바꿉니다. 개인 경험담이나 블로그만으로는 바꾸지 않습니다.</li>
      </ul>
    </section>
    <section class="box" id="changelog" aria-labelledby="changelog-title">
      <h2 id="changelog-title">수정 기록</h2>
      <div class="table-wrap">
        <table>
          <thead><tr><th scope="col">날짜</th><th scope="col">바뀐 내용</th></tr></thead>
          <tbody>
            ${CHANGELOG.map(([date, text]) => `<tr><td><time datetime="${date}">${date}</time></td><td>${esc(text)}</td></tr>`).join("\n            ")}
          </tbody>
        </table>
      </div>
      <p class="small">같은 날 여러 번 고친 경우 최근 것부터 적었습니다. 이 기록은 저장소의 변경 이력(커밋)을 바탕으로 적습니다.</p>
    </section>`);

trust("/contact/", "문의", "영농폐기물 집하장 지도 운영자 제이 미디어에 연락하는 방법(이메일, 고객센터 전화, 카카오톡 오픈채팅, 우편)과 주소 오류·설명 오류를 알릴 때 적어 주면 좋은 내용을 안내합니다.", "문의", "주소가 다르거나 설명이 틀렸다면, 또는 사이트에 대해 묻고 싶다면 아래 창구로 연락해 주세요. 집하장 운영이나 수거 일정은 이 사이트가 아니라 읍·면사무소가 답할 수 있습니다.", `
    <section class="box">
      <h2>연락 방법</h2>
      <div class="table-wrap">
        <table class="facts">
          <tbody>
            <tr><th scope="row">이메일</th><td>${emailLink}</td></tr>
            <tr><th scope="row">고객센터 전화</th><td><a href="${telHref}">${OPERATOR_INFO.phone}</a> (제이 미디어 고객센터, 보리장터와 같은 번호)</td></tr>
            <tr><th scope="row">카카오톡 오픈채팅</th><td><a href="${OPERATOR_INFO.kakaoGeneral}">제휴·일반 문의</a>(이 사이트 문의·정정 요청) · <a href="${OPERATOR_INFO.kakaoBoribay}">보리장터 이용 문의</a></td></tr>
            <tr><th scope="row">우편</th><td>${OPERATOR_INFO.address}, 제이 미디어</td></tr>
          </tbody>
        </table>
      </div>
      <p>공개적으로 남기고 싶다면 <a href="https://github.com/wlstj86231-cloud/sumimap/issues/new">GitHub 공개 정정 창구</a>를 써도 됩니다. 이 창구는 GitHub 계정이 필요하고, 쓴 글이 인터넷에 공개됩니다.</p>
    </section>
    <section class="box">
      <h2>답변</h2>
      <p>보내 주신 내용은 영업일 기준으로 확인한 뒤 답변합니다. 공식 원문과 대조해야 하는 정정 요청은 원문을 다시 확인한 다음 반영 여부를 알려 드리며, 확인에 시간이 더 걸릴 수 있습니다. 반영한 내용은 <a href="/policy/#changelog">수정 기록</a>에 남깁니다.</p>
    </section>
    <section class="box">
      <h2>정정 요청에 적어 주면 좋은 내용</h2>
      <ol>
        <li>문제가 있는 페이지 주소, 또는 시·도·시·군·마을 이름</li>
        <li>화면에 보이는 주소나 문장</li>
        <li>바른 내용과 확인한 곳(지자체 공지 링크, 원문 페이지 등)</li>
        <li>답변을 받을 방법(이메일로 보내셨다면 그 주소로 답합니다)</li>
      </ol>
      <p>신분증, 계좌, 정확한 집 주소처럼 답변에 필요 없는 개인정보는 적지 마세요.</p>
    </section>
    <section class="box">
      <h2>이 사이트가 답할 수 없는 것</h2>
      <ul>
        <li>집하장 운영 여부, 수거 날짜, 보상금 지급 → 읍·면 행정복지센터, 시·군청 환경(자원순환) 담당 부서</li>
        <li>원자료 수정 → 공공데이터포털 자료 페이지의 제공기관(한국환경공단)</li>
        <li>과태료 등 처분 → 처분한 기관</li>
      </ul>
      <p>처리 기준은 <a href="/policy/">정정 정책</a>, 개인정보는 <a href="/privacy/">개인정보처리방침</a>을 보세요.</p>
    </section>`, { type: "ContactPage", aboutOrg: true });

trust("/privacy/", "개인정보처리방침", "영농폐기물 집하장 지도는 회원가입과 개인정보 수집을 하지 않습니다. 문의할 때 보내는 정보, 기기에 저장되는 항목, 외부 지도 링크, Google AdSense 광고 쿠키와 맞춤 광고 해제 방법, 시행일을 안내합니다.", "개인정보처리방침", "영농폐기물 집하장 지도는 회원가입이 없고, 이름·연락처·위치를 서버에 모으지 않습니다. 이 방침은 2026년 10월 26일부터 적용합니다.", `
    <section class="box">
      <h2>1. 서버에 모으는 정보</h2>
      <p>운영자 서버에 개인정보를 저장하는 기능이 없습니다. 검색어와 고른 지역은 브라우저 안에서만 처리하며 서버로 보내지 않습니다. 사이트를 전달하는 호스팅 사업자(Cloudflare)는 보안과 전송을 위해 IP 주소, 브라우저 정보, 요청 시각 같은 기술 기록을 처리할 수 있습니다. 방문 통계나 분석 도구(Google Analytics 등)는 쓰지 않습니다.</p>
    </section>
    <section class="box">
      <h2>2. 문의할 때 보내는 정보</h2>
      <p>이메일, 전화, 카카오톡 오픈채팅으로 문의하면 보내 주신 연락처와 내용을 받게 됩니다. 이 정보는 답변과 정정 처리에만 씁니다. 각 수단의 기록은 해당 서비스(Google Gmail, 카카오, 통신사)의 정책에 따라서도 처리됩니다. GitHub 공개 정정 창구에 쓴 글과 계정 정보는 공개되며 <a href="https://docs.github.com/ko/site-policy/privacy-policies/github-general-privacy-statement">GitHub 개인정보처리방침</a>을 따릅니다.</p>
    </section>
    <section class="box">
      <h2>3. 기기에 저장되는 항목</h2>
      <ul>
        <li><code>sumimap:last-region</code>(브라우저 localStorage): 마지막으로 본 시·도·시·군·읍면 이름. 다음에 “지난번에 본 지역” 단추를 보여 주는 데만 쓰며 서버로 보내지 않습니다.</li>
        <li>서비스 워커 캐시: 화면 파일과 시·도별 주소 자료를 기기에 저장해 다시 열 때 빠르게 보여 줍니다.</li>
      </ul>
      <p>브라우저 설정에서 sumimap.com의 사이트 데이터를 지우면 모두 삭제됩니다.</p>
    </section>
    <section class="box">
      <h2>4. 주소 복사와 지도 링크</h2>
      <p>‘주소 복사’는 기기의 클립보드에만 주소를 넣습니다. ‘네이버 지도’, ‘카카오맵’을 누르면 집하장 주소가 검색어로 담긴 해당 지도 서비스로 이동하며, 그 뒤의 처리는 각 회사의 개인정보처리방침을 따릅니다.</p>
    </section>
    <section class="box">
      <h2>5. 광고와 쿠키(Google AdSense)</h2>
      <ul>
        <li>배출 방법 안내 페이지(/guide/ 아래 7쪽)에는 Google AdSense 광고가 표시될 수 있습니다. 집하장 찾기, 지역별 목록, 소개·정책 페이지에는 광고 코드를 넣지 않습니다. 모든 페이지에는 사이트 소유 확인용 Google AdSense 계정 메타 태그가 있으며, 이 태그는 쿠키를 만들지 않습니다.</li>
        <li>Google을 포함한 제3자 광고 사업자는 쿠키를 사용해, 이용자가 이 사이트나 다른 웹사이트를 이전에 방문한 기록을 바탕으로 광고를 게재합니다.</li>
        <li>Google은 광고 쿠키를 사용하여 Google과 파트너가 이 사이트 및 인터넷의 다른 사이트 방문 기록을 바탕으로 이용자에게 광고를 게재할 수 있도록 합니다.</li>
        <li>이용자는 <a href="https://adssettings.google.com/?hl=ko">Google 광고 설정(adssettings.google.com)</a>에서 맞춤 광고를 사용 중지할 수 있습니다. 브라우저에서 쿠키를 차단하거나 지워도 됩니다.</li>
      </ul>
      <p><a href="https://policies.google.com/technologies/ads?hl=ko">Google의 광고 쿠키 사용 방식</a> · <a href="https://policies.google.com/technologies/partner-sites?hl=ko">Google 파트너 사이트의 정보 사용 방식</a></p>
    </section>
    <section class="box">
      <h2>6. 개인정보 관련 문의</h2>
      <p>제이 미디어(대표 ${OPERATOR_INFO.ceo}) · 이메일 ${emailLink} · 고객센터 <a href="${telHref}">${OPERATOR_INFO.phone}</a>. 자세한 연락 방법은 <a href="/contact/">문의</a>에 있습니다.</p>
    </section>
    <section class="box">
      <h2>7. 시행일과 변경</h2>
      <p>이 방침은 2026년 10월 26일부터 적용합니다. 처리 방식이 바뀌면 이 페이지의 내용과 시행일을 함께 고치고, <a href="/policy/#changelog">수정 기록</a>에 남깁니다.</p>
    </section>`);

trust("/terms/", "이용약관", "영농폐기물 집하장 지도의 운영자와 정보 성격, 이용자가 직접 확인할 사항과 확인할 기관, 면책, 외부 서비스와 광고, 금지 행위, 시행일을 안내합니다.", "이용약관", "영농폐기물 집하장 지도를 이용할 때 알아 두어야 할 조건입니다. 이용하면 이 약관에 동의한 것으로 봅니다. 이 약관은 2026년 10월 26일부터 적용합니다.", `
    <section class="box">
      <h2>1. 서비스와 운영자</h2>
      <p>이 서비스는 한국환경공단이 공공데이터포털에 공개한 영농폐기물 공동집하장 주소를 지역별로 찾기 쉽게 보여 주고, 공식 안내를 바탕으로 배출 방법을 정리한 참고 정보입니다. 운영자는 ${OPERATOR_INFO.name}(대표 ${OPERATOR_INFO.ceo}, 사업자등록번호 ${OPERATOR_INFO.bizNo})입니다. 정부, 한국환경공단, 지방자치단체의 공식 서비스가 아닙니다.</p>
    </section>
    <section class="box">
      <h2>2. 이용자가 직접 확인할 사항</h2>
      <p>공개자료는 2025년 8월 27일 기준 파일이며 운영 요일, 수거 일정, 받는 품목, 연락처가 들어 있지 않습니다. 이용하기 전에 아래 기관에 확인해야 합니다. 지역 기준이 이 사이트의 설명과 다르면 지역 기준을 따르세요.</p>
      <ul>
        <li>집하장 운영 여부, 수거 날짜, 마을 집하장 위치 → 읍·면 행정복지센터, 마을 이장</li>
        <li>폐비닐 보상금 단가·지급 방법, 대량 배출 → 시·군청 환경(자원순환) 담당 부서</li>
        <li>남은 농약 반납 → 구입한 농약판매점, 읍·면사무소</li>
        <li>원자료 수정 → 한국환경공단(공공데이터포털 오류신고)</li>
      </ul>
    </section>
    <section class="box">
      <h2>3. 면책</h2>
      <p>운영자는 정보를 정확하게 유지하려고 노력하지만, 원자료의 오류, 자료 기준일 이후의 변경, 지도 검색 결과의 차이로 생긴 손해를 보장하지 않습니다. 보상금 지급, 과태료 등 행정 처분, 법 적용 여부는 해당 기관이 판단하며, 이 사이트의 설명은 법률 자문이나 의학적 조언이 아닙니다. 농약에 노출되어 몸에 이상이 있으면 바로 119나 의료기관에 연락하세요.</p>
    </section>
    <section class="box">
      <h2>4. 외부 서비스와 광고</h2>
      <p>네이버 지도, 카카오맵, 공공데이터포털, 정부·지자체 누리집, 보리장터 등 외부 링크는 각 사업자의 약관과 개인정보처리방침을 따릅니다. 지도 링크는 주소 글자로 검색한 결과를 보여 주며 집하장의 정확한 입구를 뜻하지 않습니다. 배출 방법 안내 페이지의 광고는 Google이 게재하며, 광고된 상품이나 서비스를 운영자가 보증하지 않습니다.</p>
    </section>
    <section class="box">
      <h2>5. 금지 행위와 저작권</h2>
      <p>서비스에 과도한 자동 요청을 보내거나 보안을 우회하는 행위, 공개 문의 창구에 다른 사람의 개인정보·비방·광고를 올리는 행위를 금지합니다. 공공데이터 원문은 포털의 이용 조건(이용허락범위 제한 없음)에 따라 누구나 이용할 수 있으며, 이 사이트의 안내 문장과 구성은 운영자에게 저작권이 있습니다.</p>
    </section>
    <section class="box">
      <h2>6. 변경</h2>
      <p>서비스 내용과 약관은 바뀔 수 있으며, 바뀌면 이 페이지의 내용과 적용일을 고치고 <a href="/policy/#changelog">수정 기록</a>에 남깁니다. 문의는 <a href="/contact/">문의</a>를 이용하세요.</p>
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
