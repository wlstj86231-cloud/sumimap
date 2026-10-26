// Shared HTML shell for every generated page.
export const SITE_URL = "https://sumimap.com";
export const SITE_NAME = "영농폐기물 집하장 지도";
export const STYLE_HREF = "/assets/site-2026102602.css";
export const FINDER_JS = "/assets/finder-2026102602.js";
export const FINDER_ROUTE = "/kr/farm-waste-collection/";
// Day the operator last re-read the official sources against the pages.
export const CHECKED = "2026-10-26";
export const PUBLISHED = CHECKED; // kept for older imports
const UTM = "utm_source=sumimap.com&utm_medium=referral&utm_campaign=support";

// Operator facts as published on boribay.com/about and jnewmedia.com/company/
// (checked 2026-10-26). Do not add facts that are not on those pages.
export const OPERATOR_INFO = Object.freeze({
  name: "제이 미디어(Media)",
  ceo: "이정우",
  bizNo: "456-33-01705",
  address: "전북특별자치도 군산시 의료원로 80-8, 301호(지곡동)",
  phone: "010-2846-2011",
  email: "consultingjinjeong@gmail.com",
  kakaoGeneral: "https://open.kakao.com/o/scuvl1wi",
  kakaoBoribay: "https://open.kakao.com/o/p6HiJ9Pi",
  company: "https://jnewmedia.com/company/"
});

const ORG_ID = "https://jnewmedia.com/#organization";
export const ORG = Object.freeze({
  "@type": "Organization",
  "@id": ORG_ID,
  name: "제이 미디어",
  alternateName: ["제이미디어", "제이 미디어(Media)", "J MEDIA"],
  url: "https://jnewmedia.com/",
  logo: { "@type": "ImageObject", url: "https://jnewmedia.com/assets/mark.svg" },
  address: {
    "@type": "PostalAddress",
    streetAddress: "의료원로 80-8, 301호(지곡동)",
    addressLocality: "군산시",
    addressRegion: "전북특별자치도",
    addressCountry: "KR"
  },
  telephone: "+82-10-2846-2011",
  email: OPERATOR_INFO.email,
  sameAs: [
    "https://www.instagram.com/boribaydotcom/",
    "https://blog.naver.com/plannerset",
    "https://jnewmedia.com/",
    "https://boribay.com/"
  ]
});
export const ORG_REF = Object.freeze({ "@id": ORG_ID });
export const OPERATOR = ORG_REF;
const WEBSITE_ID = `${SITE_URL}/#website`;
export const WEBSITE_REF = Object.freeze({ "@id": WEBSITE_ID });
const WEBSITE = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  inLanguage: "ko-KR",
  description: "한국환경공단 공개자료로 영농폐기물 공동집하장 주소를 지역별로 찾고 배출 방법을 확인하는 서비스",
  publisher: ORG_REF,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}${FINDER_ROUTE}?q={search_term_string}`,
    "query-input": "required name=search_term_string"
  }
};

export function boribay(path = "/") {
  const url = new URL(path, "https://boribay.com");
  for (const part of UTM.split("&")) {
    const [key, value] = part.split("=");
    url.searchParams.set(key, value);
  }
  return url.toString();
}

export function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function finderHref(params = {}) {
  const search = new URLSearchParams();
  for (const key of ["province", "city", "area", "q"]) if (params[key]) search.set(key, params[key]);
  const query = search.toString();
  return query ? `${FINDER_ROUTE}?${query}` : FINDER_ROUTE;
}

const NAV = [
  { href: FINDER_ROUTE, label: "집하장 찾기", match: (route) => route === FINDER_ROUTE },
  { href: "/guide/", label: "배출 방법", match: (route) => route.startsWith("/guide/") },
  { href: "/kr/", label: "지역별 목록", match: (route) => route === "/kr/" || (route.startsWith("/kr/") && route !== FINDER_ROUTE) }
];

const FOOTER_LINKS = [
  ["/about/", "서비스 소개"],
  ["/contact/", "문의"],
  ["/editorial/", "편집 원칙"],
  ["/policy/", "정정·수정 기록"],
  ["/sources/", "자료 출처"],
  ["/privacy/", "개인정보처리방침"],
  ["/terms/", "이용약관"]
];

const ADSENSE_META = `<meta name="google-adsense-account" content="ca-pub-5877883031077615">`;
const ADS_LOADER = `<script>
    if (location.hostname === "sumimap.com") {
      const ads = document.createElement("script");
      ads.async = true;
      ads.crossOrigin = "anonymous";
      ads.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5877883031077615";
      document.head.append(ads);
    }
  </script>`;

// The Google and Naver ownership meta tags lived on the old home page.
// They are kept verbatim on the current home page so verification still works.
const VERIFICATION_META = `<meta name="google-site-verification" content="tSlD6MvlQAUKN3XASMGLU-vJTeaoUxCSFg-tn3JMmvk">
  <meta name="naver-site-verification" content="23ea3b270fcb7dc89df52e670db1ea6aada447fc">`;

export function breadcrumbLd(items) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map(([name, route], index) => ({ "@type": "ListItem", position: index + 1, name, item: `${SITE_URL}${route}` }))
  };
}

export function crumbsHtml(items) {
  if (!items || items.length < 2) return "";
  return `<nav aria-label="현재 위치"><ol class="crumbs">${items.map(([name, route], index) => index === items.length - 1
    ? `<li aria-current="page">${esc(name)}</li>`
    : `<li><a href="${route}">${esc(name)}</a></li>`).join("")}</ol></nav>`;
}

export function page({
  route,
  title,
  description,
  body,
  jsonLd = [],
  ads = false,
  noindex = false,
  narrow = false,
  ogType = "article",
  extraHead = "",
  scripts = "",
  crumbs = null,
  verification = false
}) {
  const canonical = `${SITE_URL}${route}`;
  const graph = noindex ? [...jsonLd] : [ORG, WEBSITE, ...jsonLd];
  if (crumbs && crumbs.length > 1) graph.push(breadcrumbLd(crumbs));
  const ld = graph.length
    ? `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replaceAll("</", "<\\/")}</script>`
    : "";
  const nav = NAV.map((item) => `<a href="${item.href}"${item.match(route) ? ' aria-current="page"' : ""}>${item.label}</a>`).join("");
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  ${noindex ? '<meta name="robots" content="noindex, nofollow">' : `<link rel="canonical" href="${canonical}">`}
  <link rel="icon" href="/assets/icon.svg" type="image/svg+xml">
  <link rel="manifest" href="/manifest.webmanifest">
  <meta name="theme-color" content="#1d6a41">
  <meta property="og:type" content="${ogType}">
  <meta property="og:site_name" content="${SITE_NAME}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  ${noindex ? "" : `<meta property="og:url" content="${canonical}">`}
  ${verification ? VERIFICATION_META : ""}
  ${noindex ? "" : ADSENSE_META}
  ${ads && !noindex ? ADS_LOADER : ""}
  <link rel="alternate" type="application/rss+xml" title="${SITE_NAME} 새 안내" href="${SITE_URL}/feed.xml">
  <link rel="stylesheet" href="${STYLE_HREF}">
  ${extraHead}
  ${ld}
</head>
<body>
  <a class="skip" href="#main">본문으로 바로가기</a>
  <header class="site-header">
    <div class="wrap header-row">
      <a class="brand" href="/"><span class="brand-mark" aria-hidden="true">영</span>${SITE_NAME}</a>
      <nav class="site-nav" aria-label="주요 메뉴">${nav}</nav>
    </div>
  </header>
  <main id="main" class="wrap${narrow ? " narrow" : ""}">
    ${crumbsHtml(crumbs)}
${body}
  </main>
  <footer class="site-footer">
    <div class="wrap">
      <ul class="footer-links">${FOOTER_LINKS.map(([href, label]) => `<li><a href="${href}">${label}</a></li>`).join("")}</ul>
      <p class="operator-line">운영: ${OPERATOR_INFO.name} · 대표 ${OPERATOR_INFO.ceo} · 사업자등록번호 ${OPERATOR_INFO.bizNo} · 고객센터 <a href="tel:${OPERATOR_INFO.phone.replaceAll("-", "")}">${OPERATOR_INFO.phone}</a></p>
      <p>제이 미디어는 <a href="${boribay("/")}">보리장터(boribay.com)</a>를 운영합니다. 이 사이트는 정부·한국환경공단·지방자치단체의 공식 서비스가 아닙니다.</p>
      <p>집하장 주소: 한국환경공단 공개자료(공공데이터포털, 이용허락범위 제한 없음), 2025년 8월 27일 기준 파일.</p>
    </div>
  </footer>
  ${scripts}
  <script>if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => {});</script>
</body>
</html>
`;
}

// Visible "who / when / how many sources" line for content pages.
export function metaBlock({ published, checked = CHECKED, sources }) {
  return `<ul class="page-meta" aria-label="작성 정보">
        <li>작성·관리: <a href="/editorial/">제이 미디어 편집팀</a> (운영 책임: 대표 ${OPERATOR_INFO.ceo})</li>
        <li>게시일 <time datetime="${published}">${published}</time></li>
        <li>최종 확인일 <time datetime="${checked}">${checked}</time></li>
        <li><a href="#sources-title">출처 ${sources}개</a></li>
      </ul>`;
}

// What the page does not cover and whom to ask instead.
export function scopeBlock(items) {
  return `<section class="box scope" aria-labelledby="scope-title">
      <h2 id="scope-title">범위와 한계</h2>
      <ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>
      <p class="small">틀린 내용을 발견하면 <a href="/contact/">문의</a>로 알려 주세요. 확인한 수정은 <a href="/policy/#changelog">수정 기록</a>에 남깁니다.</p>
    </section>`;
}

const shortUrl = (url) => {
  const parsed = new URL(url);
  const pathText = decodeURIComponent(parsed.pathname + parsed.search);
  const full = `${parsed.hostname}${pathText === "/" ? "" : pathText}`;
  return full.length > 64 ? `${full.slice(0, 61)}…` : full;
};

// Standard 출처 block: official links with what each supports and the date checked.
export function sourcesBlock(sources, { heading = "출처(공식 원문)", note = "" } = {}) {
  return `<section class="box" aria-labelledby="sources-title">
      <h2 id="sources-title">${esc(heading)}</h2>
      <ol class="source-list">
        ${sources.map((source) => `<li><a href="${esc(source.url)}">${esc(source.title)}</a> <span class="small">· ${esc(source.org)}</span><br><small class="source-url">${esc(shortUrl(source.url))}</small><br><small>확인한 내용: ${esc(source.use)} · 확인일 ${source.checked || CHECKED}</small></li>`).join("\n        ")}
      </ol>
      <p class="small">확인일(자료 대조일)은 운영자가 위 공식 원문을 다시 열어 이 페이지의 설명과 맞춰 본 날입니다. 원문 기관의 갱신일이나 실제 수거 일정이 바뀐 날과는 다릅니다.${note ? ` ${esc(note)}` : ""}</p>
    </section>`;
}
