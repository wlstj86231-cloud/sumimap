import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(__dirname, "..", "site");
const siteUrl = "https://sumimap.com";
const lastmod = "2026-05-09";
const buildDate = "Sat, 09 May 2026 18:30:00 +0900";

const pages = [
  {
    slug: "tokyo-charging-spots",
    title: "도쿄에서 충전 가능한 곳 찾기 - 스미맵",
    h1: "도쿄에서 배터리가 부족할 때 바로 확인할 충전 신호",
    description: "도쿄에서 콘센트, 충전 가능 카페, 역 주변 대기 장소를 찾는 한국인을 위한 스미맵 충전 검색 가이드.",
    intent: "도쿄 충전 가능한 곳, 도쿄 콘센트 카페, 일본 여행 배터리 부족",
    city: "도쿄",
    signal: "충전",
    emoji: "🔌",
    mapHref: "/?case=battery&city=tokyo&utm_source=seo-keyword&utm_medium=internal&utm_campaign=tokyo-charging",
    related: ["/routes/battery/", "/routes/station/", "/routes/late-night/"],
    situations: ["역 개찰구를 지나기 전 배터리가 10% 아래로 떨어진 상황", "카페에 콘센트는 보이지만 사용 가능 여부가 애매한 상황", "길찾기와 번역 앱을 계속 켜야 해서 보조배터리만으로 부족한 상황"],
    note: "도쿄에서는 콘센트가 보인다고 바로 쓸 수 있다고 판단하면 곤란해질 수 있습니다. 스미맵은 콘센트 유무보다 허락 필요, 오래 머물기 적합한지, 주변이 너무 붐비는지까지 같이 보게 만들었습니다."
  },
  {
    slug: "osaka-restroom-guide",
    title: "오사카에서 화장실 급할 때 확인할 곳 - 스미맵",
    h1: "오사카에서 화장실이 급할 때 먼저 볼 생활 신호",
    description: "오사카 난바, 우메다, 역 주변에서 화장실이 급할 때 확인할 장소 신호와 스미맵 사용 순서.",
    intent: "오사카 화장실, 난바 화장실 급함, 일본 역 화장실 찾기",
    city: "오사카",
    signal: "화장실",
    emoji: "🚻",
    mapHref: "/?case=restroom&city=osaka&utm_source=seo-keyword&utm_medium=internal&utm_campaign=osaka-restroom",
    related: ["/routes/restroom/", "/routes/station/", "/routes/convenience/"],
    situations: ["난바나 우메다처럼 출구와 쇼핑 동선이 복잡한 곳에서 급해진 상황", "편의점 화장실 이용 가능 여부가 점포마다 달라 헷갈리는 상황", "동행자와 떨어지기 전에 가장 가까운 후보를 빨리 정해야 하는 상황"],
    note: "화장실 정보는 오래된 기억보다 최근 제보와 위치 맥락이 중요합니다. 스미맵은 '그냥 있다'가 아니라 단독 이용 가능성, 직원 확인 필요, 붐비는 시간대를 함께 읽도록 구성했습니다."
  },
  {
    slug: "fukuoka-rain-shelter",
    title: "후쿠오카에서 비 피하기 좋은 곳 찾기 - 스미맵",
    h1: "후쿠오카에서 갑자기 비가 올 때 들어갈 곳을 빠르게 고르는 법",
    description: "후쿠오카 여행과 생활 중 갑작스러운 비, 실내 대기, 역 주변 이동을 위한 스미맵 비 피하기 가이드.",
    intent: "후쿠오카 비 피할 곳, 일본 비 올 때 갈 곳, 텐진 실내 대기",
    city: "후쿠오카",
    signal: "비 피하기",
    emoji: "☔",
    mapHref: "/?case=rain&city=fukuoka&utm_source=seo-keyword&utm_medium=internal&utm_campaign=fukuoka-rain",
    related: ["/routes/rain/", "/routes/rest/", "/routes/station/"],
    situations: ["텐진이나 하카타 주변에서 우산 없이 이동하다 비를 만난 상황", "잠깐만 기다리면 되는지, 오래 머물러야 하는지 판단이 필요한 상황", "짐이 젖기 전에 실내 동선을 먼저 잡아야 하는 상황"],
    note: "비를 피하는 장소는 단순히 지붕이 있는 곳이 아닙니다. 짐을 정리할 공간, 오래 서 있어도 부담이 적은지, 다음 이동으로 이어지기 쉬운지가 함께 중요합니다."
  },
  {
    slug: "kyoto-korean-support",
    title: "교토에서 한국어 대응 가능한 곳 찾기 - 스미맵",
    h1: "교토에서 한국어 대응과 쉬운 안내가 필요한 순간",
    description: "교토에서 한국어 대응, 번역 부담이 적은 장소, 문의가 쉬운 생활 스팟을 찾는 한국인을 위한 안내.",
    intent: "교토 한국어 대응, 일본 한국어 가능한 곳, 교토 여행 문의 쉬운 곳",
    city: "교토",
    signal: "한국어 대응",
    emoji: "🇰🇷",
    mapHref: "/?case=korean&city=kyoto&utm_source=seo-keyword&utm_medium=internal&utm_campaign=kyoto-korean",
    related: ["/routes/korean/", "/routes/response/", "/guide/"],
    situations: ["예약, 결제, 문의 내용을 일본어로 설명하기 어려운 상황", "부모님이나 동행자가 있어 안내가 쉬운 장소가 필요한 상황", "번역 앱으로는 뉘앙스가 잘 전달되지 않는 상황"],
    note: "한국어 대응 신호는 '한국어가 완벽하다'는 보증이 아닙니다. 스미맵은 한국어 안내, 쉬운 영어, 번역 앱으로 처리 가능한 정도까지 넓게 보되 과장하지 않는 쪽으로 정리합니다."
  },
  {
    slug: "japan-convenience-store-restroom",
    title: "일본 편의점 화장실·충전 이용 신호 읽기 - 스미맵",
    h1: "일본 편의점에서 화장실과 충전을 확인할 때 조심할 기준",
    description: "일본 편의점에서 화장실, 충전, 프린트, 택배, 잠깐 대기 가능성을 판단하는 스미맵 생활 신호 가이드.",
    intent: "일본 편의점 화장실, 일본 편의점 충전, 편의점 이용 가능",
    city: "일본",
    signal: "편의점",
    emoji: "🏪",
    mapHref: "/?case=convenience&city=tokyo&utm_source=seo-keyword&utm_medium=internal&utm_campaign=convenience-signal",
    related: ["/routes/convenience/", "/routes/restroom/", "/routes/battery/"],
    situations: ["화장실 표시는 있지만 실제 사용 가능 여부가 점포마다 다른 상황", "프린트나 택배처럼 급한 생활 업무를 처리해야 하는 상황", "콘센트가 보여도 고객용인지 직원용인지 판단하기 어려운 상황"],
    note: "편의점은 일본 생활의 작은 안전판이지만 모든 점포가 같은 규칙으로 움직이지 않습니다. 스미맵은 이용 가능성과 매너, 직원 확인 필요 여부를 같이 보게 합니다."
  },
  {
    slug: "japan-station-rest-spots",
    title: "일본 역 주변 쉬기 좋은 곳과 생활 신호 - 스미맵",
    h1: "일본 역 주변에서 잠깐 쉬고 정리할 곳을 고르는 법",
    description: "일본 역 주변에서 쉬기, 충전, 화장실, 환승 전 대기 장소를 찾는 한국인을 위한 스미맵 역 주변 가이드.",
    intent: "일본 역 주변 쉬는 곳, 일본 역 화장실, 일본 역 충전",
    city: "일본",
    signal: "역 주변",
    emoji: "🚉",
    mapHref: "/?case=station&city=tokyo&utm_source=seo-keyword&utm_medium=internal&utm_campaign=station-rest",
    related: ["/routes/station/", "/routes/rest/", "/routes/restroom/"],
    situations: ["환승 전 짐을 정리해야 하는 상황", "역 안팎 출구가 복잡해서 잠깐 멈춰야 하는 상황", "화장실, 충전, 쉬기를 한 번에 해결하고 싶은 상황"],
    note: "역 주변은 후보가 많아 보이지만 실제로는 동선이 복잡해 피로가 커집니다. 스미맵은 지도에서 바로 볼 수 있는 이모티콘 신호를 중심으로 선택을 줄이는 데 초점을 둡니다."
  },
  {
    slug: "tokyo-late-night-living-spots",
    title: "도쿄 밤늦게 확인할 생활 스팟 - 스미맵",
    h1: "도쿄에서 밤늦게 충전·화장실·쉬기를 확인하는 순서",
    description: "도쿄 밤늦은 시간에 충전, 화장실, 쉬기 좋은 곳을 찾을 때 필요한 스미맵 야간 생활 가이드.",
    intent: "도쿄 밤늦게 갈 곳, 도쿄 심야 화장실, 도쿄 야간 충전",
    city: "도쿄",
    signal: "야간 생활",
    emoji: "🌙",
    mapHref: "/?case=lateNight&city=tokyo&utm_source=seo-keyword&utm_medium=internal&utm_campaign=tokyo-late-night",
    related: ["/routes/late-night/", "/routes/battery/", "/routes/restroom/"],
    situations: ["막차 전후로 배터리와 길찾기 여유가 모두 부족한 상황", "밤늦게 문 연 장소와 실제로 머물기 편한 장소가 다른 상황", "혼자 이동하면서 너무 복잡한 선택지를 줄이고 싶은 상황"],
    note: "야간에는 '열려 있음'보다 '부담 없이 확인 가능함'이 더 중요해집니다. 스미맵은 심야 이동 중 눈에 피로하지 않게 핵심 신호만 빠르게 보는 흐름을 우선합니다."
  },
  {
    slug: "japan-first-day-living-map",
    title: "일본 생활 첫날 필요한 충전·화장실·쉬기 지도 - 스미맵",
    h1: "일본 도착 첫날 가장 먼저 저장해둘 생활 스팟",
    description: "일본 도착 첫날 충전, 화장실, 쉬기, 한국어 대응, 응대 불편 신호를 한 번에 보는 스미맵 첫날 가이드.",
    intent: "일본 생활 첫날, 일본 도착 후 할 일, 일본 유학생 생활 지도",
    city: "일본",
    signal: "첫날 동선",
    emoji: "🧭",
    mapHref: "/?case=firstDay&city=tokyo&utm_source=seo-keyword&utm_medium=internal&utm_campaign=first-day",
    related: ["/routes/first-day/", "/guide/", "/cities/"],
    situations: ["공항에서 숙소로 이동한 뒤 바로 생활 anchor가 필요한 상황", "유심, 배터리, 화장실, 짐 정리 장소가 한꺼번에 필요한 상황", "일본어가 아직 익숙하지 않아 문의 부담을 줄이고 싶은 상황"],
    note: "첫날에는 완벽한 정보보다 반복해서 쓸 기준이 중요합니다. 스미맵은 첫날 필요한 장소 신호를 저장하고, 다음 날부터 동네별로 보강하는 흐름을 권합니다."
  },
  {
    slug: "japan-korean-resident-map",
    title: "일본 거주 한국인을 위한 생활 지도 사용법 - 스미맵",
    h1: "일본 거주 한국인이 자주 쓰는 생활 신호를 한 화면에서 보는 법",
    description: "일본 거주 한국인, 유학생, 워홀러가 충전, 화장실, 쉬기, 한국어 대응 신호를 빠르게 확인하는 방법.",
    intent: "일본 거주 한국인 생활 정보, 일본 유학생 생활 지도, 일본 워홀 생활 팁",
    city: "일본",
    signal: "생활 지도",
    emoji: "📍",
    mapHref: "/?city=tokyo&utm_source=seo-keyword&utm_medium=internal&utm_campaign=korean-resident",
    related: ["/guide/", "/cities/", "/routes/"],
    situations: ["낯선 동네에서 잠깐 쉴 곳부터 확인하고 싶은 상황", "생활권을 옮겼을 때 다시 기준을 잡아야 하는 상황", "여행 정보가 아니라 실제 체류자의 작은 불편을 줄이고 싶은 상황"],
    note: "스미맵은 관광지 추천보다 생활 신호에 가깝습니다. 매일 쓰기 좋은 정보는 화려한 설명보다 지금 누를 수 있는 지도, 최근 느낌, 매너 기준이 중요합니다."
  },
  {
    slug: "japan-response-discomfort-signal",
    title: "일본 생활 중 응대 불편 신호를 조심스럽게 읽는 법 - 스미맵",
    h1: "응대 불편 제보는 단정이 아니라 조심 신호로 읽어야 합니다",
    description: "일본 생활 중 응대 불편, 문의 부담, 한국어 대응 부족 신호를 과장 없이 확인하는 스미맵 안내.",
    intent: "일본 응대 불편, 일본 생활 문의 불편, 일본 한국인 생활 제보",
    city: "일본",
    signal: "응대 불편",
    emoji: "⚠️",
    mapHref: "/?case=response&city=tokyo&utm_source=seo-keyword&utm_medium=internal&utm_campaign=response-signal",
    related: ["/routes/response/", "/routes/korean/", "/policy/"],
    situations: ["문의했을 때 설명이 잘 이어지지 않아 다음 선택지가 필요한 상황", "개인 경험을 일반화하지 않고 조심스럽게 참고하고 싶은 상황", "동행자에게 불필요한 스트레스를 줄이고 싶은 상황"],
    note: "응대 불편 신호는 특정 장소를 공격하기 위한 기능이 아닙니다. 스미맵은 사용자가 제보를 참고하되, 단정과 낙인 대신 다음 후보를 고르는 데 쓰도록 문장과 표시를 조심스럽게 다룹니다."
  }
];

const coreFeedItems = [
  ["스미맵 일본 생활 지도", "/", "충전, 화장실, 쉬기, 비 피하기, 한국어 대응, 응대 불편 신호를 빠르게 확인하는 일본 생활 지도."],
  ["스미맵 이용 가이드", "/guide/", "일본 생활 중 곤란한 순간을 줄이기 위한 스미맵 사용 기준과 제보 해석 방식."],
  ["도시별 생활 신호", "/cities/", "도쿄, 오사카, 후쿠오카, 교토에서 생활 스팟을 다르게 읽는 방법."]
];

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function pageUrl(page) {
  return `${siteUrl}/${page.slug}/`;
}

function relatedTitle(url) {
  const titles = {
    "/guide/": "스미맵 이용 가이드",
    "/cities/": "도시별 생활 신호",
    "/routes/": "상황별 바로가기",
    "/policy/": "제보 운영 기준",
    "/routes/battery/": "충전 신호 가이드",
    "/routes/restroom/": "화장실 신호 가이드",
    "/routes/rain/": "비 피하기 가이드",
    "/routes/korean/": "한국어 대응 가이드",
    "/routes/rest/": "잠깐 쉬기 가이드",
    "/routes/station/": "역 주변 생활 가이드",
    "/routes/convenience/": "편의점 생활 신호",
    "/routes/late-night/": "야간 생활 스팟",
    "/routes/first-day/": "일본 첫날 동선",
    "/routes/response/": "응대 불편 신호"
  };
  return titles[url] || url;
}

function renderPage(page) {
  const url = pageUrl(page);
  const relatedLinks = page.related
    .map((href) => `<li><a href="${href}">${escapeHtml(relatedTitle(href))}</a></li>`)
    .join("\n");
  const situations = page.situations.map((item) => `<li>${escapeHtml(item)}</li>`).join("\n");
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.title.replace(" - 스미맵", ""),
    description: page.description,
    inLanguage: "ko-KR",
    datePublished: lastmod,
    dateModified: lastmod,
    author: { "@type": "Organization", name: "스미맵 편집부" },
    publisher: { "@type": "Organization", name: "스미맵", url: siteUrl },
    mainEntityOfPage: url,
    about: [page.city, page.signal, "일본 생활 정보"]
  };

  return `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(page.title)}</title>
    <meta name="description" content="${escapeHtml(page.description)}">
    <link rel="canonical" href="${url}">
    <meta property="og:type" content="article">
    <meta property="og:site_name" content="스미맵">
    <meta property="og:title" content="${escapeHtml(page.title.replace(" - 스미맵", ""))}">
    <meta property="og:description" content="${escapeHtml(page.description)}">
    <meta property="og:url" content="${url}">
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7217591196020054" crossorigin="anonymous"></script>
    <meta name="google-adsense-account" content="ca-pub-7217591196020054">
    <link rel="alternate" type="application/rss+xml" title="스미맵 RSS" href="${siteUrl}/feed.xml">
    <link rel="stylesheet" href="/assets/styles.css?v=20260509-seo1">
    <script type="application/ld+json">${JSON.stringify(articleLd)}</script>
  </head>
  <body class="static-body">
    <main class="static-shell">
      <nav class="static-nav">
        <a class="brand" href="/"><span class="brand-mark">住</span><span><strong>스미맵</strong><small>일본 생활 제보 지도</small></span></a>
        <a href="${page.mapHref}">지도에서 보기</a>
      </nav>
      <section class="static-hero">
        <h1>${escapeHtml(page.h1)}</h1>
        <p>${escapeHtml(page.description)} 검색해서 들어온 사람이 긴 설명을 읽기 전에 바로 판단할 수 있도록, ${escapeHtml(page.city)}에서 ${escapeHtml(page.signal)} 신호를 볼 때의 기준을 정리했습니다.</p>
      </section>
      <section class="static-content">
        <article class="static-section">
          <h2>${page.emoji} 이 페이지가 잡는 검색 의도</h2>
          <p>${escapeHtml(page.intent)}처럼 검색하는 사람은 대개 이미 현장에서 작은 압박을 느끼고 있습니다. 그래서 이 문서는 광고성 추천보다 “지금 내가 어디를 눌러야 하는지”, “무엇을 확인해야 실수하지 않는지”, “어떤 표현을 조심해야 하는지”를 먼저 보여주는 입구로 만들었습니다.</p>
          <ul>
            ${situations}
          </ul>
        </article>
        <article class="static-section">
          <h2>지도에서 먼저 볼 신호</h2>
          <p>스미맵에서는 ${escapeHtml(page.signal)} 신호를 하나의 정답처럼 보지 않습니다. 같은 장소라도 시간대, 붐빔 정도, 직원 확인 필요 여부, 오래 머물기 적합한지에 따라 체감이 달라집니다. 검색 결과에서 이 페이지로 들어온 뒤에는 먼저 지도를 열고, 이모티콘 신호를 눌러 후보를 좁히는 흐름이 가장 빠릅니다.</p>
          <p><a href="${page.mapHref}">${escapeHtml(page.city)} ${escapeHtml(page.signal)} 지도 바로 열기</a></p>
        </article>
        <article class="static-section static-experience">
          <h2>편집자 사용 노트</h2>
          <p>${escapeHtml(page.note)}</p>
          <p>실제로 현장에서 중요한 것은 많은 글을 읽는 것이 아니라 선택지를 줄이는 일입니다. 배터리가 부족하거나, 화장실이 급하거나, 비가 오거나, 문의가 막히는 순간에는 정보가 많을수록 오히려 손이 멈춥니다. 그래서 스미맵 문서는 검색 유입용 설명을 제공하되, 최종 행동은 지도 화면에서 바로 이어지도록 설계했습니다.</p>
        </article>
        <article class="static-section">
          <h2>사용 순서</h2>
          <ol>
            <li>검색어와 맞는 이 페이지에서 상황 기준을 20초 정도만 확인합니다.</li>
            <li>상단의 지도 버튼을 눌러 ${escapeHtml(page.city)} 쪽 ${escapeHtml(page.signal)} 신호를 엽니다.</li>
            <li>이모티콘 마커를 누르고 한 줄 요약, 최근 느낌, 주의 문장을 먼저 봅니다.</li>
            <li>장소가 애매하면 같은 유형의 주변 후보를 하나 더 비교합니다.</li>
            <li>확실하지 않은 이용은 직원 확인, 시설 안내, 현장 표지를 우선합니다.</li>
          </ol>
        </article>
        <article class="static-section">
          <h2>같이 보면 좋은 스미맵 문서</h2>
          <ul>
            ${relatedLinks}
          </ul>
        </article>
      </section>
    </main>
  </body>
</html>
`;
}

function upsertSitemap() {
  const sitemapPath = path.join(siteRoot, "sitemap.xml");
  const xml = fs.readFileSync(sitemapPath, "utf8");
  const generatedLocs = new Set(pages.map(pageUrl));
  const existingBlocks = [...xml.matchAll(/\s*<url>[\s\S]*?<\/url>/g)]
    .map((match) => match[0].trim())
    .filter((block) => {
      const loc = block.match(/<loc>(.*?)<\/loc>/)?.[1];
      return loc && !generatedLocs.has(loc);
    });
  const generatedBlocks = pages.map((page) => `  <url><loc>${pageUrl(page)}</loc><lastmod>${lastmod}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`);
  const next = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${existingBlocks.map((block) => `  ${block}`).join("\n")}\n${generatedBlocks.join("\n")}\n</urlset>\n`;
  fs.writeFileSync(sitemapPath, next);
}

function renderFeedItem(title, href, description, date = buildDate) {
  const link = href.startsWith("http") ? href : `${siteUrl}${href}`;
  return `    <item>
      <title>${escapeHtml(title)}</title>
      <link>${link}</link>
      <guid>${link}</guid>
      <pubDate>${date}</pubDate>
      <description>${escapeHtml(description)}</description>
    </item>`;
}

function writeFeed() {
  const items = [
    ...pages.map((page) => renderFeedItem(page.title.replace(" - 스미맵", ""), `/${page.slug}/`, page.description)),
    ...coreFeedItems.map(([title, href, description]) => renderFeedItem(title, href, description, "Sat, 09 May 2026 00:00:00 +0900"))
  ].join("\n");
  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>스미맵</title>
    <link>${siteUrl}/</link>
    <description>일본 거주 한국인을 위한 충전, 화장실, 쉬기, 비 피하기, 한국어 대응 생활 지도.</description>
    <language>ko-KR</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
${items}
  </channel>
</rss>
`;
  fs.writeFileSync(path.join(siteRoot, "feed.xml"), feed);
}

for (const page of pages) {
  const dir = path.join(siteRoot, page.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), renderPage(page));
}

upsertSitemap();
writeFeed();

console.log(`Generated ${pages.length} Sumimap keyword pages.`);
