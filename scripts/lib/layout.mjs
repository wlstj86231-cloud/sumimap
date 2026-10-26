// Shared HTML shell for every generated page.
export const SITE_URL = "https://sumimap.com";
export const SITE_NAME = "영농폐기물 집하장 지도";
export const STYLE_HREF = "/assets/site-20261026.css";
export const FINDER_JS = "/assets/finder-2026102602.js";
export const FINDER_ROUTE = "/kr/farm-waste-collection/";
export const PUBLISHED = "2026-10-26";
export const OPERATOR = Object.freeze({ "@type": "Organization", name: "제이 미디어(J MEDIA)", url: "https://jnewmedia.com/" });
const UTM = "utm_source=sumimap.com&utm_medium=referral&utm_campaign=support";

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
  ["/sources/", "자료 출처"],
  ["/editorial/", "편집 원칙"],
  ["/contact/", "문의·정정 요청"],
  ["/privacy/", "개인정보 처리방침"],
  ["/terms/", "이용약관"]
];

const ADS_LOADER = `<meta name="google-adsense-account" content="ca-pub-5877883031077615">
  <script>
    if (location.hostname === "sumimap.com") {
      const ads = document.createElement("script");
      ads.async = true;
      ads.crossOrigin = "anonymous";
      ads.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5877883031077615";
      document.head.append(ads);
    }
  </script>`;

// The Google and Naver ownership meta tags lived on the old Japan home page.
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
  const graph = [...jsonLd];
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
  ${ads ? ADS_LOADER : ""}
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
      <p>운영: 제이 미디어(J MEDIA) · <a href="${boribay("/")}">보리장터(boribay.com)</a> 운영사. 정부·한국환경공단의 공식 서비스가 아닙니다.</p>
      <p>집하장 주소: 한국환경공단 공개자료(공공데이터포털), 2025년 8월 27일 기준 파일.</p>
    </div>
  </footer>
  ${scripts}
  <script>if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => {});</script>
</body>
</html>
`;
}

// Standard "근거와 확인" block: official links with the review date.
export function sourcesBlock(sources, { heading = "근거로 삼은 공식 원문", note = "" } = {}) {
  return `<section class="box" aria-labelledby="sources-title">
      <h2 id="sources-title">${esc(heading)}</h2>
      <ul class="source-list">
        ${sources.map((source) => `<li><a href="${esc(source.url)}">${esc(source.org)} · ${esc(source.title)}</a><br><small>${esc(source.use)} · 자료 대조일 ${source.checked || PUBLISHED}</small></li>`).join("\n        ")}
      </ul>
      <p class="small">자료 대조일은 운영자가 위 공식 원문을 다시 열어 이 페이지의 설명과 맞춰 본 날입니다. 원문 기관의 갱신일이나 실제 수거 일정이 바뀐 날과는 다릅니다.${note ? ` ${esc(note)}` : ""}</p>
    </section>`;
}
