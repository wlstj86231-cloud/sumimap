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
    slug: "cities/tokyo",
    title: "도쿄 생활 스팟 지도 가이드 - 스미맵",
    h1: "도쿄에서 충전·화장실·쉬기를 빠르게 고르는 법",
    description: "도쿄 신주쿠, 우에노, 도쿄역, 아키하바라 주변에서 충전, 화장실, 쉬기 좋은 생활 신호를 확인하는 스미맵 도시 가이드.",
    intent: "도쿄 충전 가능한 곳, 도쿄 화장실 급함, 신주쿠 쉬기 좋은 곳",
    city: "도쿄",
    signal: "생활 편의",
    emoji: "🗼",
    mapHref: "/?city=tokyo&utm_source=city-page&utm_medium=internal&utm_campaign=tokyo-city",
    related: ["/tokyo-charging-spots/", "/tokyo-late-night-living-spots/", "/spots/tokyo/shinjuku-cafe-charging-001/", "/routes/battery/"],
    situations: ["신주쿠나 시부야처럼 출구가 많은 역에서 배터리가 부족한 상황", "도쿄역이나 우에노 주변에서 화장실 후보를 빠르게 비교해야 하는 상황", "한국어 대응 또는 잠깐 쉬기 좋은 생활권을 여행 정보와 분리해서 보고 싶은 상황"],
    note: "도쿄는 후보가 많아 보일수록 실제 선택이 늦어지는 도시입니다. 스미맵은 큰 역 이름보다 출구, 혼잡, 충전 허락, 화장실 동선을 같이 보게 만들어 첫 후보가 막혔을 때 바로 두 번째 후보로 넘어가도록 구성했습니다.",
    lastmod: "2026-07-03",
    buildDate: "Fri, 03 Jul 2026 08:45:00 +0900"
  },
  {
    slug: "cities/osaka",
    title: "오사카 생활 스팟 지도 가이드 - 스미맵",
    h1: "오사카에서 지하상가·화장실·충전 신호를 같이 보는 법",
    description: "오사카 난바, 우메다, 텐노지 주변에서 화장실, 충전, 비 피하기, 한국어 대응 신호를 읽는 스미맵 도시 가이드.",
    intent: "오사카 화장실 급할 때, 난바 충전 가능한 곳, 우메다 비 피하기",
    city: "오사카",
    signal: "생활 편의",
    emoji: "🏙️",
    mapHref: "/?city=osaka&utm_source=city-page&utm_medium=internal&utm_campaign=osaka-city",
    related: ["/osaka-restroom-guide/", "/spots/osaka/tennoji-restroom-001/", "/routes/restroom/", "/routes/rain/"],
    situations: ["난바나 우메다에서 지하 동선과 출구가 헷갈리는 상황", "화장실이 급하지만 쇼핑몰, 역, 카페 중 어느 쪽이 빠른지 판단해야 하는 상황", "비가 오거나 더운 날 실내 대기와 충전 후보를 함께 봐야 하는 상황"],
    note: "오사카는 지하상가와 역 주변 시설이 많아 보이지만 초행자는 방향을 잃기 쉽습니다. 스미맵은 난바, 우메다, 텐노지 같은 생활권에서 화장실과 쉬기, 충전을 한 화면에서 비교하도록 잡았습니다.",
    lastmod: "2026-07-03",
    buildDate: "Fri, 03 Jul 2026 08:45:00 +0900"
  },
  {
    slug: "cities/fukuoka",
    title: "후쿠오카 생활 스팟 지도 가이드 - 스미맵",
    h1: "후쿠오카에서 하카타·텐진 생활 신호를 빠르게 보는 법",
    description: "후쿠오카 하카타, 텐진, 나카스 주변에서 화장실, 충전, 비 피하기, 한국어 안내 신호를 확인하는 스미맵 도시 가이드.",
    intent: "후쿠오카 화장실 급함, 하카타 충전 가능한 곳, 텐진 비 피하기",
    city: "후쿠오카",
    signal: "생활 편의",
    emoji: "🌊",
    mapHref: "/?city=fukuoka&utm_source=city-page&utm_medium=internal&utm_campaign=fukuoka-city",
    related: ["/fukuoka-rain-shelter/", "/spots/fukuoka/hakata-restroom-001/", "/routes/rain/", "/routes/restroom/"],
    situations: ["하카타역에서 공항, 신칸센, 버스 이동 전 화장실 후보를 빨리 정해야 하는 상황", "텐진 중심가에서 쇼핑 중 충전과 와이파이를 함께 확인해야 하는 상황", "나카스 주변에서 비를 피하면서 다음 동선을 짧게 다시 잡아야 하는 상황"],
    note: "후쿠오카는 하카타와 텐진 사이 이동이 짧아 보여도 공항, 쇼핑, 버스 동선이 겹치면 판단이 빨라야 합니다. 스미맵은 화장실, 충전, 비 피하기 신호를 도시 안에서 따로 보되, 급한 순간에는 가장 가까운 두 번째 후보까지 남기도록 연결합니다.",
    lastmod: "2026-07-03",
    buildDate: "Fri, 03 Jul 2026 10:20:00 +0900"
  },
  {
    slug: "cities/kyoto",
    title: "교토 생활 스팟 지도 가이드 - 스미맵",
    h1: "교토에서 관광 혼잡과 생활 편의를 분리해서 보는 법",
    description: "교토역, 시조가와라마치, 기온 주변에서 화장실, 쉬기, 비 피하기, 응대 조심 신호를 읽는 스미맵 도시 가이드.",
    intent: "교토 화장실 급함, 교토역 쉬기 좋은 곳, 교토 한국어 대응",
    city: "교토",
    signal: "생활 편의",
    emoji: "⛩️",
    mapHref: "/?city=kyoto&utm_source=city-page&utm_medium=internal&utm_campaign=kyoto-city",
    related: ["/kyoto-korean-support/", "/spots/kyoto/station-rest-001/", "/routes/station/", "/routes/response/"],
    situations: ["교토역에서 짐을 들고 환승이나 버스 동선을 다시 잡아야 하는 상황", "시조가와라마치 주변에서 화장실과 실내 대기 후보를 함께 봐야 하는 상황", "기온처럼 현장 매너와 이용 조건을 먼저 확인해야 하는 관광 생활권에 들어가는 상황"],
    note: "교토는 관광 정보가 많지만 생활 중 급한 문제는 다른 기준으로 봐야 합니다. 스미맵은 명소 추천이 아니라 화장실, 쉬기, 비 피하기, 응대 조심 신호를 분리해 초행자가 관광 혼잡 때문에 생활 판단을 놓치지 않도록 정리합니다.",
    lastmod: "2026-07-03",
    buildDate: "Fri, 03 Jul 2026 10:20:00 +0900"
  },
  {
    slug: "spots/tokyo/shinjuku-cafe-charging-001",
    title: "신주쿠 동쪽 카페형 충전 스팟 확인 기준 - 스미맵",
    h1: "신주쿠 동쪽에서 충전 가능한 카페형 스팟을 볼 때",
    description: "신주쿠 동쪽 출구 주변에서 콘센트, 와이파이, 직원 허락 필요 여부를 확인하는 스미맵 장소 상세 가이드.",
    intent: "신주쿠 충전 카페, 신주쿠 콘센트, 신주쿠 와이파이 카페",
    city: "도쿄 신주쿠",
    signal: "충전 가능",
    emoji: "🔌",
    mapHref: "/?place=tokyo-shinjuku-east&utm_source=spot-page&utm_medium=internal&utm_campaign=shinjuku-charging",
    related: ["/cities/tokyo/", "/tokyo-charging-spots/", "/routes/battery/", "/routes/station/"],
    situations: ["신주쿠 동쪽 출구 주변에서 길찾기 배터리가 부족한 상황", "콘센트가 보여도 고객용인지 직원에게 확인해야 하는지 애매한 상황", "와이파이와 잠깐 쉬기를 같이 해결하고 싶은 상황"],
    note: "신주쿠 동쪽 카페형 스팟은 충전 가능 신호가 있더라도 무단 사용을 뜻하지 않습니다. 주문, 좌석 조건, 직원 확인, 혼잡 시간대를 같이 보고 짧게 회복하는 후보로 다루는 편이 안전합니다.",
    lastmod: "2026-07-03",
    buildDate: "Fri, 03 Jul 2026 08:45:00 +0900"
  },
  {
    slug: "spots/osaka/tennoji-restroom-001",
    title: "텐노지 주변 화장실 확인 스팟 사용 기준 - 스미맵",
    h1: "오사카 텐노지에서 화장실 후보를 빠르게 고를 때",
    description: "오사카 텐노지 주변에서 화장실 가능성, 행사일 혼잡, 잠깐 쉬기 신호를 확인하는 스미맵 장소 상세 가이드.",
    intent: "텐노지 화장실, 오사카 화장실 급함, 텐노지 쉬기 좋은 곳",
    city: "오사카 텐노지",
    signal: "화장실 가능",
    emoji: "🚻",
    mapHref: "/?place=osaka-tennoji-restroom&utm_source=spot-page&utm_medium=internal&utm_campaign=tennoji-restroom",
    related: ["/cities/osaka/", "/osaka-restroom-guide/", "/routes/restroom/", "/routes/station/"],
    situations: ["텐노지 역 주변에서 급하게 화장실 후보를 골라야 하는 상황", "행사일이나 주말에 대기 시간이 길어질지 먼저 확인해야 하는 상황", "화장실과 잠깐 쉬기 신호를 같은 동선에서 보고 싶은 상황"],
    note: "텐노지 주변 화장실 스팟은 단독 이용 가능 여부보다 시간대와 주변 행사 영향을 같이 보는 것이 중요합니다. 스미맵은 화장실 가능 신호와 잠깐 쉬기 신호를 함께 보여 급한 상황에서도 두 번째 후보를 남기게 합니다.",
    lastmod: "2026-07-03",
    buildDate: "Fri, 03 Jul 2026 08:45:00 +0900"
  },
  {
    slug: "spots/fukuoka/hakata-restroom-001",
    title: "하카타역 주변 화장실 확인 스팟 사용 기준 - 스미맵",
    h1: "후쿠오카 하카타에서 화장실 후보를 빠르게 고를 때",
    description: "후쿠오카 하카타역 주변에서 화장실 가능성, 출퇴근 혼잡, 잠깐 쉬기 신호를 확인하는 스미맵 장소 상세 가이드.",
    intent: "하카타역 화장실, 후쿠오카 화장실 급함, 하카타역 쉬기 좋은 곳",
    city: "후쿠오카 하카타",
    signal: "화장실 가능",
    emoji: "🚻",
    mapHref: "/?place=fukuoka-hakata-restroom&utm_source=spot-page&utm_medium=internal&utm_campaign=hakata-restroom",
    related: ["/cities/fukuoka/", "/fukuoka-rain-shelter/", "/routes/restroom/", "/routes/station/"],
    situations: ["하카타역에서 공항이나 신칸센 이동 전에 급하게 화장실 후보를 정해야 하는 상황", "출퇴근 시간대 혼잡 때문에 가장 가까운 후보만 믿기 어려운 상황", "화장실과 잠깐 쉬기 신호를 함께 보며 짐을 정리해야 하는 상황"],
    note: "하카타역 주변 화장실 스팟은 공항과 버스, 신칸센 이동이 겹치는 시간대에 특히 판단 가치가 있습니다. 가까운 장소 하나만 보는 대신 운영 시간과 혼잡, 잠깐 쉬기 가능성을 같이 확인하면 다음 이동을 덜 흔들리게 잡을 수 있습니다.",
    lastmod: "2026-07-03",
    buildDate: "Fri, 03 Jul 2026 10:20:00 +0900"
  },
  {
    slug: "spots/kyoto/station-rest-001",
    title: "교토역 대기와 휴식 스팟 사용 기준 - 스미맵",
    h1: "교토역에서 짐을 들고 잠깐 쉬어야 할 때",
    description: "교토역 주변에서 잠깐 쉬기, 비 피하기, 화장실 가능성을 함께 확인하는 스미맵 장소 상세 가이드.",
    intent: "교토역 쉬기 좋은 곳, 교토역 비 피하기, 교토역 화장실",
    city: "교토역",
    signal: "잠깐 쉬기",
    emoji: "🪑",
    mapHref: "/?place=kyoto-station-rest&utm_source=spot-page&utm_medium=internal&utm_campaign=kyoto-station-rest",
    related: ["/cities/kyoto/", "/kyoto-korean-support/", "/routes/rest/", "/routes/station/"],
    situations: ["교토역에서 짐이 많아 버스나 열차 동선을 잠깐 다시 잡아야 하는 상황", "비가 오거나 성수기 혼잡 때문에 실내 대기 후보를 먼저 보고 싶은 상황", "화장실과 잠깐 쉬기 신호를 같은 위치에서 함께 확인하고 싶은 상황"],
    note: "교토역은 관광객과 환승 동선이 겹쳐 가까워 보이는 장소도 체감 이동이 길어질 수 있습니다. 스미맵의 교토역 휴식 스팟은 오래 머무는 추천이 아니라 짐을 정리하고 다음 이동을 판단하기 위한 짧은 회복 후보로 보는 편이 맞습니다.",
    lastmod: "2026-07-03",
    buildDate: "Fri, 03 Jul 2026 10:20:00 +0900"
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
    related: ["/cities/fukuoka/", "/spots/fukuoka/hakata-restroom-001/", "/routes/rain/", "/routes/rest/"],
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
    related: ["/cities/kyoto/", "/spots/kyoto/station-rest-001/", "/routes/korean/", "/routes/response/"],
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
  },
  {
    slug: "tokyo-phone-charging-options",
    title: "도쿄 휴대폰 충전 가능한 곳 판단 기준 - 스미맵",
    h1: "도쿄에서 휴대폰 배터리가 부족할 때 후보를 줄이는 법",
    description: "도쿄에서 카페, 역 주변, 보조배터리 대여, 상업시설 충전 후보를 비교할 때 확인할 생활 신호를 정리한 스미맵 가이드.",
    intent: "도쿄 휴대폰 충전, 도쿄 보조배터리 대여, 도쿄 콘센트 찾기",
    city: "도쿄",
    signal: "휴대폰 충전",
    emoji: "🔌",
    mapHref: "/?case=battery&city=tokyo&utm_source=seo-keyword&utm_medium=internal&utm_campaign=tokyo-phone-charging-options",
    related: ["/routes/battery/", "/cities/tokyo/", "/tokyo-charging-spots/", "/spots/tokyo/shinjuku-cafe-charging-001/"],
    situations: ["길찾기와 번역 앱을 동시에 써야 하는데 배터리가 15% 아래로 내려간 상황", "콘센트가 보이지만 고객용인지 직원 확인이 필요한지 애매한 상황", "보조배터리 대여와 카페 충전 중 어느 쪽이 빠른지 판단해야 하는 상황"],
    note: "도쿄에서는 충전 후보가 많아 보여도 실제로는 주문 조건, 좌석 회전, 직원 확인, 혼잡이 선택을 크게 바꿉니다. 스미맵은 콘센트 유무만 보지 않고 짧게 회복할 수 있는지와 다음 이동으로 이어지는지를 함께 보게 합니다.",
    lastmod: "2026-07-03",
    buildDate: "Fri, 03 Jul 2026 18:55:00 +0900"
  },
  {
    slug: "osaka-cafe-charging-checklist",
    title: "오사카 카페 충전 체크리스트 - 스미맵",
    h1: "오사카에서 카페 충전 후보를 고르기 전 확인할 것",
    description: "오사카 난바, 우메다, 텐노지 주변에서 카페 충전과 와이파이, 좌석 조건, 직원 확인 필요 여부를 보는 스미맵 생활 가이드.",
    intent: "오사카 카페 충전, 난바 콘센트 카페, 우메다 와이파이 카페",
    city: "오사카",
    signal: "카페 충전",
    emoji: "☕",
    mapHref: "/?case=battery&city=osaka&utm_source=seo-keyword&utm_medium=internal&utm_campaign=osaka-cafe-charging-checklist",
    related: ["/routes/battery/", "/cities/osaka/", "/routes/station/", "/spots/osaka/tennoji-restroom-001/"],
    situations: ["난바나 우메다에서 배터리와 데이터가 동시에 불안한 상황", "콘센트 좌석이 있어도 오래 앉기 부담스러운 분위기인지 봐야 하는 상황", "쇼핑 동선 중 짐을 놓고 충전하기 어려워 짧은 회복 후보가 필요한 상황"],
    note: "오사카의 카페 충전은 지하상가와 역 주변 동선 때문에 가까운 거리만 믿기 어렵습니다. 스미맵은 카페 이름보다 접근 동선, 좌석 여유, 직원 확인 필요 여부를 먼저 보도록 구성합니다.",
    lastmod: "2026-07-03",
    buildDate: "Fri, 03 Jul 2026 18:55:00 +0900"
  },
  {
    slug: "fukuoka-station-charging-guide",
    title: "후쿠오카 역 주변 충전 후보 가이드 - 스미맵",
    h1: "후쿠오카 하카타·텐진에서 충전 후보를 빠르게 고르는 법",
    description: "후쿠오카 하카타역과 텐진 주변에서 충전, 와이파이, 잠깐 쉬기 신호를 함께 확인하는 스미맵 역 주변 생활 가이드.",
    intent: "후쿠오카 충전 가능한 곳, 하카타역 충전, 텐진 와이파이 카페",
    city: "후쿠오카",
    signal: "역 주변 충전",
    emoji: "🚉",
    mapHref: "/?case=battery&city=fukuoka&utm_source=seo-keyword&utm_medium=internal&utm_campaign=fukuoka-station-charging-guide",
    related: ["/routes/battery/", "/cities/fukuoka/", "/routes/station/", "/spots/fukuoka/hakata-restroom-001/"],
    situations: ["하카타역에서 공항이나 버스로 이동하기 전 배터리를 회복해야 하는 상황", "텐진에서 쇼핑과 길찾기가 겹쳐 보조배터리만으로 부족한 상황", "충전하면서 짐을 잠깐 정리할 수 있는 후보를 같이 봐야 하는 상황"],
    note: "후쿠오카는 이동 거리가 짧아 보여도 공항, 버스, 쇼핑 동선이 겹치면 충전 판단이 늦어집니다. 스미맵은 하카타와 텐진을 나누어 충전 가능성, 쉬기, 다음 이동 연결성을 함께 보게 합니다.",
    lastmod: "2026-07-03",
    buildDate: "Fri, 03 Jul 2026 18:55:00 +0900"
  },
  {
    slug: "kyoto-mobile-battery-rental-guide",
    title: "교토 보조배터리 대여와 충전 판단 가이드 - 스미맵",
    h1: "교토에서 보조배터리 대여와 카페 충전 중 고르는 법",
    description: "교토역, 시조가와라마치, 기온 주변에서 보조배터리 대여, 카페 충전, 실내 대기 신호를 비교하는 스미맵 생활 가이드.",
    intent: "교토 보조배터리 대여, 교토 충전 가능한 곳, 교토역 충전",
    city: "교토",
    signal: "보조배터리 대여",
    emoji: "🔋",
    mapHref: "/?case=battery&city=kyoto&utm_source=seo-keyword&utm_medium=internal&utm_campaign=kyoto-mobile-battery-rental-guide",
    related: ["/routes/battery/", "/cities/kyoto/", "/routes/station/", "/spots/kyoto/station-rest-001/"],
    situations: ["교토역에서 버스 동선을 확인해야 하는데 배터리가 부족한 상황", "관광지 주변 카페가 붐벼 대여형 보조배터리가 더 나은지 판단해야 하는 상황", "기온이나 시조가와라마치에서 오래 머물지 않고 바로 이동해야 하는 상황"],
    note: "교토에서는 관광 혼잡 때문에 앉아서 충전하는 선택이 항상 빠르지 않습니다. 스미맵은 보조배터리 대여와 실내 대기, 카페 충전을 같은 충전 문제 안에서 비교하게 만듭니다.",
    lastmod: "2026-07-03",
    buildDate: "Fri, 03 Jul 2026 18:55:00 +0900"
  },
  {
    slug: "tokyo-restroom-urgent-guide",
    title: "도쿄에서 화장실 급할 때 보는 순서 - 스미맵",
    h1: "도쿄 큰 역에서 화장실 후보를 빠르게 좁히는 법",
    description: "도쿄 신주쿠, 시부야, 우에노, 도쿄역 주변에서 화장실이 급할 때 역·상업시설·카페 후보를 비교하는 스미맵 가이드.",
    intent: "도쿄 화장실 급함, 신주쿠 화장실, 시부야 화장실 찾기",
    city: "도쿄",
    signal: "화장실 급함",
    emoji: "🚻",
    mapHref: "/?case=restroom&city=tokyo&utm_source=seo-keyword&utm_medium=internal&utm_campaign=tokyo-restroom-urgent-guide",
    related: ["/routes/restroom/", "/cities/tokyo/", "/routes/station/", "/japan-convenience-store-restroom/"],
    situations: ["신주쿠나 시부야에서 출구가 많아 가장 가까운 후보를 고르기 어려운 상황", "역 안 화장실이 붐빌 때 상업시설이나 카페 후보를 같이 봐야 하는 상황", "동행자와 떨어지기 전에 바로 공유할 수 있는 후보가 필요한 상황"],
    note: "도쿄의 화장실 문제는 거리보다 출구와 층, 혼잡이 더 크게 작용합니다. 스미맵은 가장 가까운 점 하나가 아니라 두 번째 후보까지 남겨 급한 상황에서 다시 헤매지 않게 합니다.",
    lastmod: "2026-07-03",
    buildDate: "Fri, 03 Jul 2026 18:55:00 +0900"
  },
  {
    slug: "osaka-station-restroom-route",
    title: "오사카 역 주변 화장실 동선 가이드 - 스미맵",
    h1: "오사카 난바·우메다에서 화장실 동선을 잡는 법",
    description: "오사카 난바, 우메다, 텐노지 주변에서 지하상가와 역 화장실 후보를 빠르게 비교하는 스미맵 생활 가이드.",
    intent: "오사카역 화장실, 난바 화장실 위치, 우메다 화장실 급함",
    city: "오사카",
    signal: "역 화장실 동선",
    emoji: "🚻",
    mapHref: "/?case=restroom&city=osaka&utm_source=seo-keyword&utm_medium=internal&utm_campaign=osaka-station-restroom-route",
    related: ["/routes/restroom/", "/cities/osaka/", "/osaka-restroom-guide/", "/spots/osaka/tennoji-restroom-001/"],
    situations: ["난바 지하상가에서 어느 출구로 나가야 빠른지 헷갈리는 상황", "우메다에서 쇼핑몰과 역 화장실 중 어느 쪽이 덜 복잡할지 봐야 하는 상황", "텐노지 이동 전 화장실과 잠깐 쉬기 후보를 같이 정해야 하는 상황"],
    note: "오사카는 지하 동선이 길고 비슷한 출구가 많아 화장실 후보가 가까워 보여도 체감 거리가 달라집니다. 스미맵은 장소명보다 이동 방향과 혼잡 신호를 함께 보게 합니다.",
    lastmod: "2026-07-03",
    buildDate: "Fri, 03 Jul 2026 18:55:00 +0900"
  },
  {
    slug: "fukuoka-convenience-restroom-guide",
    title: "후쿠오카 편의점 화장실 이용 판단 가이드 - 스미맵",
    h1: "후쿠오카에서 편의점 화장실 후보를 볼 때 확인할 것",
    description: "후쿠오카 하카타, 텐진, 나카스 주변에서 편의점 화장실 이용 가능성과 직원 확인 필요 여부를 보는 스미맵 가이드.",
    intent: "후쿠오카 편의점 화장실, 하카타 화장실 급함, 텐진 편의점 화장실",
    city: "후쿠오카",
    signal: "편의점 화장실",
    emoji: "🏪",
    mapHref: "/?case=restroom&city=fukuoka&utm_source=seo-keyword&utm_medium=internal&utm_campaign=fukuoka-convenience-restroom-guide",
    related: ["/routes/restroom/", "/routes/convenience/", "/cities/fukuoka/", "/spots/fukuoka/hakata-restroom-001/"],
    situations: ["하카타역 밖에서 역 화장실보다 가까운 후보가 필요한 상황", "텐진 중심가에서 편의점마다 이용 조건이 다를 수 있어 확인이 필요한 상황", "나카스 주변에서 밤 시간대 부담 없이 들어갈 후보를 가려야 하는 상황"],
    note: "편의점 화장실은 일본 생활에서 유용하지만 모든 점포가 같은 방식으로 열려 있지는 않습니다. 스미맵은 사용 가능성, 직원 확인, 시간대 부담을 분리해서 읽게 합니다.",
    lastmod: "2026-07-03",
    buildDate: "Fri, 03 Jul 2026 18:55:00 +0900"
  },
  {
    slug: "kyoto-tourist-restroom-guide",
    title: "교토 관광 동선 화장실 확인 가이드 - 스미맵",
    h1: "교토 관광 중 화장실 후보를 미리 나눠 보는 법",
    description: "교토역, 기온, 시조가와라마치, 관광지 주변에서 화장실 후보와 실내 대기 가능성을 함께 보는 스미맵 생활 가이드.",
    intent: "교토 관광 화장실, 교토역 화장실, 기온 화장실 찾기",
    city: "교토",
    signal: "관광 동선 화장실",
    emoji: "🚻",
    mapHref: "/?case=restroom&city=kyoto&utm_source=seo-keyword&utm_medium=internal&utm_campaign=kyoto-tourist-restroom-guide",
    related: ["/routes/restroom/", "/cities/kyoto/", "/routes/station/", "/spots/kyoto/station-rest-001/"],
    situations: ["교토역에서 버스 탑승 전 화장실과 짐 정리를 함께 해야 하는 상황", "기온이나 관광지 주변에서 무작정 매장에 들어가기 부담스러운 상황", "성수기 혼잡 때문에 화장실과 대기 후보를 미리 나눠야 하는 상황"],
    note: "교토에서는 관광 정보가 많아도 화장실 같은 생활 정보는 따로 봐야 합니다. 스미맵은 명소 추천이 아니라 현장에서 부담을 줄이는 생활 후보를 우선합니다.",
    lastmod: "2026-07-03",
    buildDate: "Fri, 03 Jul 2026 18:55:00 +0900"
  },
  {
    slug: "tokyo-rain-shelter-route",
    title: "도쿄 비 피하기 실내 동선 가이드 - 스미맵",
    h1: "도쿄에서 갑자기 비가 올 때 실내 동선을 잡는 법",
    description: "도쿄 신주쿠, 시부야, 도쿄역 주변에서 비를 피하며 충전, 화장실, 잠깐 쉬기 후보를 함께 보는 스미맵 가이드.",
    intent: "도쿄 비 피할 곳, 신주쿠 비 피하기, 도쿄역 실내 대기",
    city: "도쿄",
    signal: "비 피하기",
    emoji: "☔",
    mapHref: "/?case=rain&city=tokyo&utm_source=seo-keyword&utm_medium=internal&utm_campaign=tokyo-rain-shelter-route",
    related: ["/routes/rain/", "/cities/tokyo/", "/routes/station/", "/routes/rest/"],
    situations: ["우산 없이 신주쿠나 시부야를 걷다가 비가 강해진 상황", "도쿄역 주변에서 실내 통로와 대기 장소를 함께 봐야 하는 상황", "비를 피하면서 배터리나 화장실 문제까지 같이 해결해야 하는 상황"],
    note: "비 피하기는 지붕만 찾는 문제가 아닙니다. 도쿄에서는 실내 통로, 역 출구, 상업시설 혼잡을 함께 봐야 다음 이동이 덜 꼬입니다.",
    lastmod: "2026-07-03",
    buildDate: "Fri, 03 Jul 2026 18:55:00 +0900"
  },
  {
    slug: "osaka-rain-waiting-spots",
    title: "오사카 비 오는 날 대기 스팟 판단 기준 - 스미맵",
    h1: "오사카에서 비를 피하며 잠깐 기다릴 곳을 고르는 법",
    description: "오사카 난바, 우메다, 텐노지 주변에서 비 오는 날 실내 대기, 충전, 화장실 후보를 비교하는 스미맵 가이드.",
    intent: "오사카 비 피하기, 난바 실내 대기, 우메다 비 오는 날 갈 곳",
    city: "오사카",
    signal: "비 오는 날 대기",
    emoji: "🌧️",
    mapHref: "/?case=rain&city=osaka&utm_source=seo-keyword&utm_medium=internal&utm_campaign=osaka-rain-waiting-spots",
    related: ["/routes/rain/", "/cities/osaka/", "/routes/rest/", "/routes/station/"],
    situations: ["난바에서 비가 강해져 지하상가와 카페 중 어디가 나은지 봐야 하는 상황", "우메다에서 출구를 잘못 나가면 더 젖을 수 있어 실내 동선이 필요한 상황", "텐노지 주변에서 비를 피하면서 화장실 후보도 같이 봐야 하는 상황"],
    note: "오사카의 비 피하기는 지하 동선을 잘 잡는 일이 핵심입니다. 스미맵은 비, 쉬기, 화장실 신호를 함께 보여 단순 대기보다 다음 이동까지 이어지게 합니다.",
    lastmod: "2026-07-03",
    buildDate: "Fri, 03 Jul 2026 18:55:00 +0900"
  },
  {
    slug: "kyoto-rainy-day-rest-guide",
    title: "교토 비 오는 날 쉬기 후보 가이드 - 스미맵",
    h1: "교토에서 비 오는 날 관광과 휴식을 분리해서 보는 법",
    description: "교토역, 시조가와라마치, 기온 주변에서 비를 피하고 잠깐 쉬며 다음 동선을 정하는 스미맵 생활 가이드.",
    intent: "교토 비 피하기, 교토 비 오는 날 쉬기, 교토역 실내 대기",
    city: "교토",
    signal: "비 오는 날 쉬기",
    emoji: "☔",
    mapHref: "/?case=rain&city=kyoto&utm_source=seo-keyword&utm_medium=internal&utm_campaign=kyoto-rainy-day-rest-guide",
    related: ["/routes/rain/", "/cities/kyoto/", "/routes/rest/", "/spots/kyoto/station-rest-001/"],
    situations: ["교토역에서 비 때문에 버스와 도보 동선을 다시 잡아야 하는 상황", "기온이나 시조가와라마치에서 실내 대기 후보를 먼저 정해야 하는 상황", "젖은 짐을 정리하고 화장실이나 충전까지 같이 해결하고 싶은 상황"],
    note: "교토의 비 오는 날은 관광지 혼잡과 이동 피로가 같이 옵니다. 스미맵은 관광 추천보다 지금 쉬어도 부담이 적은 후보와 다음 이동 기준을 먼저 보여줍니다.",
    lastmod: "2026-07-03",
    buildDate: "Fri, 03 Jul 2026 18:55:00 +0900"
  },
  {
    slug: "japan-arrival-first-hour-checklist",
    title: "일본 도착 첫 1시간 생활 체크리스트 - 스미맵",
    h1: "일본에 도착한 첫 1시간 안에 확인할 생활 신호",
    description: "일본 도착 직후 충전, 화장실, 교통, 데이터, 잠깐 쉬기 후보를 정리하는 스미맵 첫날 생활 체크리스트.",
    intent: "일본 도착 첫날 체크리스트, 일본 입국 후 할 일, 일본 여행 첫날 동선",
    city: "일본",
    signal: "도착 첫 1시간",
    emoji: "🧭",
    mapHref: "/?case=firstDay&city=tokyo&utm_source=seo-keyword&utm_medium=internal&utm_campaign=japan-arrival-first-hour-checklist",
    related: ["/routes/first-day/", "/guide/", "/cities/", "/japan-first-day-living-map/"],
    situations: ["공항에서 숙소로 이동하기 전 데이터와 배터리가 모두 불안한 상황", "짐이 많아 화장실과 잠깐 쉬기 후보를 먼저 정해야 하는 상황", "교통카드, 길찾기, 번역 앱을 한꺼번에 켜야 하는 상황"],
    note: "일본 도착 첫 1시간은 큰 계획보다 작은 생활 anchor가 중요합니다. 스미맵은 충전, 화장실, 쉬기 신호를 먼저 잡아 숙소 이동 전 흔들림을 줄이게 합니다.",
    lastmod: "2026-07-03",
    buildDate: "Fri, 03 Jul 2026 18:55:00 +0900"
  },
  {
    slug: "tokyo-first-day-korean-living-guide",
    title: "도쿄 첫날 한국인을 위한 생활 동선 가이드 - 스미맵",
    h1: "도쿄 도착 첫날 충전·화장실·한국어 대응을 같이 보는 법",
    description: "도쿄에 도착한 한국인이 첫날 신주쿠, 시부야, 도쿄역 주변에서 생활 신호를 빠르게 확인하는 스미맵 가이드.",
    intent: "도쿄 첫날 생활, 도쿄 한국인 생활 정보, 도쿄 도착 후 할 일",
    city: "도쿄",
    signal: "첫날 생활 동선",
    emoji: "🗼",
    mapHref: "/?case=firstDay&city=tokyo&utm_source=seo-keyword&utm_medium=internal&utm_campaign=tokyo-first-day-korean-living-guide",
    related: ["/routes/first-day/", "/cities/tokyo/", "/japan-korean-resident-map/", "/tokyo-phone-charging-options/"],
    situations: ["도쿄 도착 후 숙소 체크인 전 짐과 배터리를 정리해야 하는 상황", "신주쿠나 시부야에서 한국어 대응이나 쉬운 안내가 필요한 상황", "첫날부터 지하철 출구와 생활 후보가 많아 선택을 줄이고 싶은 상황"],
    note: "도쿄 첫날에는 유명 장소보다 반복해서 쓸 생활 기준이 더 중요합니다. 스미맵은 한국인이 자주 겪는 충전, 화장실, 언어 부담을 첫 화면에서 줄이는 쪽으로 설계했습니다.",
    lastmod: "2026-07-03",
    buildDate: "Fri, 03 Jul 2026 18:55:00 +0900"
  },
  {
    slug: "osaka-first-day-map-reading-guide",
    title: "오사카 첫날 지도 읽기와 생활 후보 고르기 - 스미맵",
    h1: "오사카 도착 첫날 지하상가와 생활 신호를 같이 보는 법",
    description: "오사카 첫날 난바, 우메다, 텐노지 주변에서 지하상가 동선, 충전, 화장실, 비 피하기 후보를 정리하는 스미맵 가이드.",
    intent: "오사카 첫날 동선, 오사카 지하상가 길찾기, 난바 첫날 생활",
    city: "오사카",
    signal: "첫날 지도 읽기",
    emoji: "🗺️",
    mapHref: "/?case=firstDay&city=osaka&utm_source=seo-keyword&utm_medium=internal&utm_campaign=osaka-first-day-map-reading-guide",
    related: ["/routes/first-day/", "/cities/osaka/", "/osaka-station-restroom-route/", "/osaka-rain-waiting-spots/"],
    situations: ["난바나 우메다에서 지하상가 출구가 많아 지도 방향이 흔들리는 상황", "숙소 체크인 전 충전과 화장실을 먼저 해결해야 하는 상황", "비가 오거나 짐이 많아 실내 동선 위주로 움직이고 싶은 상황"],
    note: "오사카 첫날은 지도상 거리가 짧아도 지하 동선 때문에 체감 이동이 달라집니다. 스미맵은 첫날부터 장소 추천보다 생활 신호와 출구 판단을 같이 보게 합니다.",
    lastmod: "2026-07-03",
    buildDate: "Fri, 03 Jul 2026 18:55:00 +0900"
  }
];

const coreFeedItems = [
  ["스미맵 일본 생활 지도", "/", "충전, 화장실, 쉬기, 비 피하기, 한국어 대응, 응대 불편 신호를 빠르게 확인하는 일본 생활 지도."],
  ["스미맵 이용 가이드", "/guide/", "일본 생활 중 곤란한 순간을 줄이기 위한 스미맵 사용 기준과 제보 해석 방식."],
  ["도시별 생활 신호", "/cities/", "도쿄, 오사카, 후쿠오카, 교토에서 생활 스팟을 다르게 읽는 방법."],
  ["스미맵 상황별 바로가기", "/routes/", "충전, 화장실, 비 피하기, 한국어 대응, 쉬기, 역 주변 생활처럼 곤란한 순간별로 스미맵을 여는 문서 허브."],
  ["충전 상황 가이드", "/routes/battery/", "일본에서 배터리가 부족할 때 콘센트, 카페, 보조배터리, 역 주변 후보를 어떤 순서로 확인할지 정리한 스미맵 상황 가이드."],
  ["화장실 상황 가이드", "/routes/restroom/", "일본에서 화장실이 급할 때 가까운 장소보다 실제 접근 가능성과 이용 조건을 먼저 보는 스미맵 상황 가이드."],
  ["비 피하기 상황 가이드", "/routes/rain/", "비가 올 때 실내 대기, 쉬기, 화장실, 충전을 함께 확인하는 스미맵 상황 가이드."],
  ["한국어 대응 상황 가이드", "/routes/korean/", "한국어 메뉴와 실제 응대 가능성을 구분해 읽는 스미맵 언어 대응 상황 가이드."],
  ["쉬기 상황 가이드", "/routes/rest/", "일본에서 잠깐 앉아 쉬어야 할 때 의자보다 체류 조건과 다음 이동을 먼저 보는 스미맵 휴식 가이드."],
  ["역 주변 생활 가이드", "/routes/station/", "역 안과 역 밖의 충전, 화장실, 쉬기, 비 피하기 후보를 구분해서 보는 스미맵 역세권 생활 가이드."],
  ["편의점 생활 기능 가이드", "/routes/convenience/", "일본 편의점에서 화장실, 충전, 프린트, 택배, 짧은 대기 가능성을 지점별 생활 신호로 읽는 스미맵 가이드."],
  ["늦은 밤 생활 가이드", "/routes/late-night/", "일본에서 늦은 밤 이동할 때 영업 중 여부보다 안전하게 머물고 다시 이동할 수 있는지를 보는 스미맵 가이드."],
  ["일본 첫날 생활 루트", "/routes/first-day/", "일본에 도착한 첫날 충전, 화장실, 쉬기, 비 피하기, 한국어 대응 기준점을 먼저 잡는 스미맵 생활 루트."],
  ["응대 불편 제보 해석 가이드", "/routes/response/", "응대 불편 제보를 비난이 아니라 다음 사용자의 선택 부담을 줄이는 생활 신호로 해석하는 스미맵 운영 가이드."]
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
    "/routes/response/": "응대 불편 신호",
    "/tokyo-charging-spots/": "도쿄에서 충전 가능한 곳 찾기",
    "/tokyo-phone-charging-options/": "도쿄 휴대폰 충전 가능한 곳 판단 기준",
    "/osaka-cafe-charging-checklist/": "오사카 카페 충전 체크리스트",
    "/fukuoka-station-charging-guide/": "후쿠오카 역 주변 충전 후보 가이드",
    "/kyoto-mobile-battery-rental-guide/": "교토 보조배터리 대여와 충전 판단 가이드",
    "/tokyo-late-night-living-spots/": "도쿄 밤늦게 확인할 생활 스팟",
    "/osaka-restroom-guide/": "오사카에서 화장실 급할 때 확인할 곳",
    "/tokyo-restroom-urgent-guide/": "도쿄에서 화장실 급할 때 보는 순서",
    "/osaka-station-restroom-route/": "오사카 역 주변 화장실 동선 가이드",
    "/fukuoka-convenience-restroom-guide/": "후쿠오카 편의점 화장실 이용 판단 가이드",
    "/kyoto-tourist-restroom-guide/": "교토 관광 동선 화장실 확인 가이드",
    "/tokyo-rain-shelter-route/": "도쿄 비 피하기 실내 동선 가이드",
    "/osaka-rain-waiting-spots/": "오사카 비 오는 날 대기 스팟 판단 기준",
    "/kyoto-rainy-day-rest-guide/": "교토 비 오는 날 쉬기 후보 가이드",
    "/japan-arrival-first-hour-checklist/": "일본 도착 첫 1시간 생활 체크리스트",
    "/tokyo-first-day-korean-living-guide/": "도쿄 첫날 한국인을 위한 생활 동선 가이드",
    "/osaka-first-day-map-reading-guide/": "오사카 첫날 지도 읽기와 생활 후보 고르기",
    "/fukuoka-rain-shelter/": "후쿠오카에서 비 피하기 좋은 곳",
    "/kyoto-korean-support/": "교토에서 한국어 대응 가능한 곳",
    "/cities/tokyo/": "도쿄 생활 스팟 지도 가이드",
    "/cities/osaka/": "오사카 생활 스팟 지도 가이드",
    "/cities/fukuoka/": "후쿠오카 생활 스팟 지도 가이드",
    "/cities/kyoto/": "교토 생활 스팟 지도 가이드",
    "/spots/tokyo/shinjuku-cafe-charging-001/": "신주쿠 동쪽 카페형 충전 스팟",
    "/spots/osaka/tennoji-restroom-001/": "텐노지 주변 화장실 확인 스팟",
    "/spots/fukuoka/hakata-restroom-001/": "하카타역 주변 화장실 확인 스팟",
    "/spots/kyoto/station-rest-001/": "교토역 대기와 휴식 스팟"
  };
  return titles[url] || url;
}

function renderPage(page) {
  const url = pageUrl(page);
  const pageLastmod = page.lastmod || lastmod;
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
    datePublished: page.datePublished || pageLastmod,
    dateModified: pageLastmod,
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
  const generatedBlocks = pages.map((page) => `  <url><loc>${pageUrl(page)}</loc><lastmod>${page.lastmod || lastmod}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`);
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
    ...pages.map((page) => renderFeedItem(page.title.replace(" - 스미맵", ""), `/${page.slug}/`, page.description, page.buildDate || buildDate)),
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
