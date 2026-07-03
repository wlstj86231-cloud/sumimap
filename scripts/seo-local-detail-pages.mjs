import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(__dirname, "..", "site");
const siteUrl = "https://sumimap.com";
const lastmod = "2026-07-03";
const buildDate = "Fri, 03 Jul 2026 20:40:00 +0900";
const styleVersion = "20260703-content3";

const pages = [
  {
    slug: "spots/tokyo/shinjuku-station-restroom-002",
    type: "spot",
    title: "신주쿠역 화장실 급할 때 보는 출구 기준 - 스미맵",
    h1: "신주쿠역에서 화장실 후보를 빠르게 좁히는 법",
    description: "도쿄 신주쿠역 주변에서 화장실이 급할 때 출구, 층, 혼잡, 두 번째 후보를 함께 확인하는 스미맵 장소 상세 가이드.",
    city: "도쿄",
    area: "신주쿠역",
    signal: "화장실",
    emoji: "🚻",
    mapHref: "/?case=restroom&city=tokyo&utm_source=spot-page&utm_medium=internal&utm_campaign=shinjuku-station-restroom-002",
    summary: "신주쿠역은 가까운 화장실보다 지금 있는 출구와 층이 더 중요합니다. 먼저 현재 위치가 동쪽인지 서쪽인지 확인하고, 역 안 후보와 상업시설 후보를 동시에 남겨야 다시 헤매는 시간을 줄일 수 있습니다.",
    usefulWhen: ["출구가 많아 지도상 가까운 후보가 실제로는 멀게 느껴지는 상황", "역 화장실 대기 줄이 길어 상업시설 후보를 같이 봐야 하는 상황", "동행자에게 바로 공유할 두 번째 후보가 필요한 상황"],
    signals: ["출구 이름과 지하/지상 층을 먼저 확인", "대형 상업시설 화장실은 영업시간과 층 이동 부담을 같이 확인", "혼잡 시간에는 가장 가까운 후보와 두 번째 후보를 동시에 저장"],
    caveats: ["시설 공사, 행사, 심야 시간에는 실제 이용 가능성이 달라질 수 있습니다.", "화장실만 이용하기 부담스러운 매장은 직원 안내와 현장 표기를 우선합니다."],
    fieldNote: "신주쿠에서는 거리 숫자보다 방향 전환 비용이 큽니다. 스미맵은 하나의 정답을 단정하기보다, 사용자가 지금 선 출구에서 바로 움직일 후보와 우회 후보를 함께 읽게 만드는 쪽으로 장소 상세를 구성합니다.",
    related: ["/cities/tokyo/", "/tokyo-restroom-urgent-guide/", "/routes/restroom/", "/spots/tokyo/shinjuku-cafe-charging-001/"]
  },
  {
    slug: "spots/tokyo/shibuya-cafe-charging-002",
    type: "spot",
    title: "시부야 카페 충전 후보 확인 기준 - 스미맵",
    h1: "시부야에서 카페 충전을 고르기 전 확인할 것",
    description: "도쿄 시부야 주변에서 콘센트, 주문 조건, 좌석 회전, 와이파이를 함께 보는 스미맵 충전 장소 상세 가이드.",
    city: "도쿄",
    area: "시부야",
    signal: "카페 충전",
    emoji: "🔌",
    mapHref: "/?case=battery&city=tokyo&utm_source=spot-page&utm_medium=internal&utm_campaign=shibuya-cafe-charging-002",
    summary: "시부야는 충전 가능한 카페가 있어도 혼잡과 좌석 회전이 빠릅니다. 콘센트가 보이는지보다 짧게 회복할 수 있는 좌석인지, 직원 확인이 필요한지, 다음 이동과 연결되는지가 더 중요합니다.",
    usefulWhen: ["번역 앱과 지도 앱을 계속 켜야 하는데 배터리가 15% 아래인 상황", "카페가 붐벼 콘센트 좌석이 실제로 비어 있을지 판단해야 하는 상황", "충전하면서 와이파이나 메시지 확인도 함께 해야 하는 상황"],
    signals: ["콘센트 좌석이 입구 근처인지 안쪽인지 확인", "주문 후 이용이 자연스러운 분위기인지 확인", "장시간보다 15~25분 회복에 적합한 후보인지 확인"],
    caveats: ["콘센트가 보여도 고객 사용 가능 여부는 점포별로 다릅니다.", "혼잡 시간에는 음료 주문 후에도 오래 머물기 부담스러울 수 있습니다."],
    fieldNote: "충전 장소 상세는 가게 추천이 아니라 선택 비용을 줄이는 문서입니다. 시부야에서는 유명한 카페보다 지금 앉을 수 있는지, 배터리를 조금이라도 회복하고 이동할 수 있는지가 먼저입니다.",
    related: ["/cities/tokyo/", "/tokyo-phone-charging-options/", "/routes/battery/", "/tokyo-charging-spots/"]
  },
  {
    slug: "spots/tokyo/ueno-rain-shelter-001",
    type: "spot",
    title: "우에노 비 피하기 실내 대기 기준 - 스미맵",
    h1: "우에노에서 비를 피하며 다음 동선을 정하는 법",
    description: "우에노역과 공원 주변에서 갑자기 비가 올 때 실내 대기, 화장실, 충전 후보를 함께 보는 스미맵 장소 상세 가이드.",
    city: "도쿄",
    area: "우에노",
    signal: "비 피하기",
    emoji: "☔",
    mapHref: "/?case=rain&city=tokyo&utm_source=spot-page&utm_medium=internal&utm_campaign=ueno-rain-shelter-001",
    summary: "우에노는 공원과 역, 상업시설이 붙어 있어 비가 오면 동선 판단이 빨리 흔들립니다. 실내로 들어가는 것뿐 아니라 젖은 짐을 정리하고 다음 이동을 다시 잡을 수 있는 후보를 봐야 합니다.",
    usefulWhen: ["공원이나 박물관 주변에서 우산 없이 비를 만난 상황", "비를 피하면서 화장실과 충전 후보도 같이 확인해야 하는 상황", "역으로 돌아가기 전 젖은 짐을 정리할 짧은 대기 공간이 필요한 상황"],
    signals: ["실내 연결 동선이 역 방향과 이어지는지 확인", "젖은 우산과 짐을 정리해도 부담이 적은지 확인", "비가 길어질 때 화장실과 충전 후보가 가까운지 확인"],
    caveats: ["행사일과 주말에는 공원 주변 실내 공간이 빠르게 붐빌 수 있습니다.", "상업시설은 층 이동과 영업시간을 먼저 확인해야 합니다."],
    fieldNote: "비 피하기는 지붕만 찾는 문제가 아닙니다. 우에노에서는 공원에서 역으로 돌아오는 방향, 실내 체류 부담, 다음 이동을 다시 계획할 여유가 함께 있어야 실제 도움이 됩니다.",
    related: ["/cities/tokyo/", "/tokyo-rain-shelter-route/", "/routes/rain/", "/routes/rest/"]
  },
  {
    slug: "spots/osaka/umeda-restroom-002",
    type: "spot",
    title: "우메다 화장실 동선 확인 기준 - 스미맵",
    h1: "우메다에서 화장실 후보를 고를 때 먼저 볼 것",
    description: "오사카 우메다 주변에서 역, 지하상가, 상업시설 화장실 후보를 비교하는 스미맵 장소 상세 가이드.",
    city: "오사카",
    area: "우메다",
    signal: "화장실",
    emoji: "🚻",
    mapHref: "/?case=restroom&city=osaka&utm_source=spot-page&utm_medium=internal&utm_campaign=umeda-restroom-002",
    summary: "우메다는 지하 동선이 길어 가까운 후보도 출구를 잘못 잡으면 멀어집니다. 화장실이 급할 때는 역 이름보다 현재 있는 지하상가 구역과 층 이동 부담을 먼저 확인해야 합니다.",
    usefulWhen: ["우메다에서 지하 출구와 쇼핑몰 입구가 헷갈리는 상황", "역 안 화장실이 붐벼 상업시설 후보를 같이 봐야 하는 상황", "비 오는 날 지상 이동을 피하면서 화장실을 찾아야 하는 상황"],
    signals: ["현재 지하상가 이름과 방향 표지를 먼저 확인", "상업시설 후보는 층 이동과 영업시간을 같이 확인", "혼잡 시간에는 역 안 후보보다 한 블록 떨어진 후보도 남기기"],
    caveats: ["공사와 통로 폐쇄가 있으면 평소 동선과 달라질 수 있습니다.", "매장 내부 화장실은 주문 조건과 직원 안내를 우선합니다."],
    fieldNote: "우메다에서는 지도상 거리가 짧아도 체감 이동이 길어질 수 있습니다. 스미맵 장소 상세는 현재 사용자가 어떤 통로에 있는지부터 생각하게 만드는 구조가 더 안전합니다.",
    related: ["/cities/osaka/", "/osaka-station-restroom-route/", "/routes/restroom/", "/routes/station/"]
  },
  {
    slug: "spots/osaka/namba-charging-001",
    type: "spot",
    title: "난바 충전 가능한 후보를 고르는 기준 - 스미맵",
    h1: "난바에서 배터리 회복 후보를 빠르게 고르는 법",
    description: "오사카 난바 주변에서 카페 충전, 보조배터리 대여, 지하상가 대기 후보를 비교하는 스미맵 장소 상세 가이드.",
    city: "오사카",
    area: "난바",
    signal: "충전",
    emoji: "🔋",
    mapHref: "/?case=battery&city=osaka&utm_source=spot-page&utm_medium=internal&utm_campaign=namba-charging-001",
    summary: "난바에서는 카페 충전만 고집하면 혼잡에 걸릴 수 있습니다. 배터리 상황이 급하면 보조배터리 대여, 짧은 카페 충전, 실내 대기 후보를 함께 비교하는 편이 빠릅니다.",
    usefulWhen: ["도톤보리나 난바역 주변에서 길찾기를 계속 해야 하는 상황", "콘센트 카페가 붐벼 보조배터리 대여가 나은지 판단해야 하는 상황", "비나 더위 때문에 실내에서 충전과 휴식을 함께 해결하고 싶은 상황"],
    signals: ["카페 충전은 좌석 여유와 직원 확인 필요 여부를 확인", "보조배터리 대여는 반납 위치가 다음 동선과 맞는지 확인", "지하상가 후보는 길을 잃지 않는 방향인지 확인"],
    caveats: ["점포별 콘센트 사용 가능 여부는 빠르게 바뀔 수 있습니다.", "대여형 보조배터리는 앱 설치와 결제 수단 조건을 먼저 확인해야 합니다."],
    fieldNote: "난바의 충전 문제는 전기만 찾는 일이 아닙니다. 많은 사람이 한꺼번에 움직이는 구역이라 앉을 수 있는지, 반납할 수 있는지, 다음 이동을 망치지 않는지가 핵심입니다.",
    related: ["/cities/osaka/", "/osaka-cafe-charging-checklist/", "/routes/battery/", "/osaka-first-day-map-reading-guide/"]
  },
  {
    slug: "spots/osaka/tennoji-rain-shelter-002",
    type: "spot",
    title: "텐노지 비 피하기와 쉬기 후보 기준 - 스미맵",
    h1: "텐노지에서 비를 피하며 잠깐 쉬는 후보를 보는 법",
    description: "오사카 텐노지 주변에서 비 피하기, 실내 대기, 화장실, 짐 정리 후보를 함께 보는 스미맵 장소 상세 가이드.",
    city: "오사카",
    area: "텐노지",
    signal: "비 피하기",
    emoji: "🌧️",
    mapHref: "/?case=rain&city=osaka&utm_source=spot-page&utm_medium=internal&utm_campaign=tennoji-rain-shelter-002",
    summary: "텐노지는 역과 상업시설이 붙어 있어 비 오는 날 동선 선택지가 많습니다. 하지만 후보가 많을수록 급한 사용자는 망설이기 쉬우므로, 실내 대기와 화장실 접근을 함께 봐야 합니다.",
    usefulWhen: ["비가 강해져 지상 이동을 줄이고 싶은 상황", "짐이 많아 잠깐 앉거나 정리할 실내 공간이 필요한 상황", "비를 피하면서 화장실과 다음 열차 동선을 함께 확인해야 하는 상황"],
    signals: ["역으로 다시 돌아가기 쉬운 실내 동선인지 확인", "대기 공간이 너무 혼잡하지 않은지 확인", "화장실과 충전 후보가 같은 건물 안에 있는지 확인"],
    caveats: ["상업시설은 영업시간과 행사에 따라 대기 가능성이 달라집니다.", "장시간 체류보다 다음 이동을 정리하는 짧은 휴식 기준으로 보는 편이 안전합니다."],
    fieldNote: "텐노지 비 피하기 후보는 관광 추천보다 회복 지점에 가깝습니다. 잠깐 멈춰 비, 짐, 화장실, 다음 이동을 정리할 수 있다면 충분히 좋은 후보입니다.",
    related: ["/cities/osaka/", "/osaka-rain-waiting-spots/", "/routes/rain/", "/spots/osaka/tennoji-restroom-001/"]
  },
  {
    slug: "spots/kyoto/kyoto-station-charging-001",
    type: "spot",
    title: "교토역 충전 후보와 보조배터리 판단 기준 - 스미맵",
    h1: "교토역에서 충전과 다음 이동을 같이 보는 법",
    description: "교토역 주변에서 충전, 보조배터리 대여, 버스 동선, 실내 대기를 함께 확인하는 스미맵 장소 상세 가이드.",
    city: "교토",
    area: "교토역",
    signal: "충전",
    emoji: "🔌",
    mapHref: "/?case=battery&city=kyoto&utm_source=spot-page&utm_medium=internal&utm_campaign=kyoto-station-charging-001",
    summary: "교토역에서는 배터리 회복과 버스·지하철 동선 판단이 동시에 필요합니다. 충전 후보를 볼 때는 앉을 수 있는지보다 다음 관광지나 숙소 방향과 끊기지 않는지를 함께 확인해야 합니다.",
    usefulWhen: ["버스 노선을 계속 확인해야 하는데 배터리가 부족한 상황", "카페 충전과 보조배터리 대여 중 어느 쪽이 빠른지 판단해야 하는 상황", "짐이 많아 충전하면서 잠깐 정리할 실내 후보가 필요한 상황"],
    signals: ["보조배터리 반납 위치가 다음 동선과 맞는지 확인", "카페 충전은 좌석 여유와 주문 조건을 확인", "역 안 대기 후보는 화장실과 가까운지도 함께 확인"],
    caveats: ["관광 성수기에는 앉을 수 있는 후보가 빠르게 줄어듭니다.", "대여형 보조배터리는 결제 수단과 반납 지점을 먼저 확인해야 합니다."],
    fieldNote: "교토역에서는 충전을 오래 하는 것보다 이동 판단을 되살릴 만큼 회복하는 것이 중요할 때가 많습니다. 스미맵은 충전과 버스 동선을 한 번에 생각하도록 문서를 연결합니다.",
    related: ["/cities/kyoto/", "/kyoto-mobile-battery-rental-guide/", "/routes/battery/", "/spots/kyoto/station-rest-001/"]
  },
  {
    slug: "spots/kyoto/gion-restroom-001",
    type: "spot",
    title: "기온 주변 화장실과 관광 매너 확인 기준 - 스미맵",
    h1: "기온에서 화장실 후보를 볼 때 조심할 점",
    description: "교토 기온 주변에서 관광 혼잡, 매장 이용 부담, 공공 동선, 현장 안내를 함께 보는 스미맵 장소 상세 가이드.",
    city: "교토",
    area: "기온",
    signal: "화장실",
    emoji: "🚻",
    mapHref: "/?case=restroom&city=kyoto&utm_source=spot-page&utm_medium=internal&utm_campaign=gion-restroom-001",
    summary: "기온은 관광 매너와 현장 안내가 특히 중요한 구역입니다. 화장실이 급해도 무작정 매장에 들어가기보다 공공 동선과 이용 조건을 먼저 확인하는 편이 안전합니다.",
    usefulWhen: ["관광지 주변에서 화장실 후보를 찾지만 매장 이용이 부담스러운 상황", "성수기 혼잡으로 가까운 후보가 실제로 쓰기 어려운 상황", "동행자와 떨어지지 않고 빠르게 다녀올 후보가 필요한 상황"],
    signals: ["공공시설 또는 역 방향 후보를 먼저 확인", "매장 내부 후보는 주문 조건과 안내 표지를 확인", "사진 촬영 제한이나 출입 제한 안내가 있는지 확인"],
    caveats: ["관광지 주변은 시간대와 행사에 따라 혼잡이 크게 달라집니다.", "현장 매너와 직원 안내가 지도 정보보다 우선합니다."],
    fieldNote: "기온 장소 상세는 '어디든 들어가라'는 안내가 아닙니다. 관광지에서 생활 편의를 찾을 때는 현장 매너와 이용 조건을 함께 보는 방식이 사이트 신뢰에도 더 맞습니다.",
    related: ["/cities/kyoto/", "/kyoto-tourist-restroom-guide/", "/routes/restroom/", "/routes/response/"]
  },
  {
    slug: "spots/fukuoka/hakata-charging-001",
    type: "spot",
    title: "하카타역 충전 후보와 공항 이동 전 체크 - 스미맵",
    h1: "하카타에서 공항 이동 전 배터리를 회복하는 기준",
    description: "후쿠오카 하카타역 주변에서 충전, 와이파이, 짐 정리, 공항 이동 동선을 함께 확인하는 스미맵 장소 상세 가이드.",
    city: "후쿠오카",
    area: "하카타역",
    signal: "충전",
    emoji: "🔋",
    mapHref: "/?case=battery&city=fukuoka&utm_source=spot-page&utm_medium=internal&utm_campaign=hakata-charging-001",
    summary: "하카타에서는 충전과 공항 이동 준비가 자주 겹칩니다. 배터리를 오래 채우는 것보다 탑승 전 필요한 주소, 예약, 번역, 교통 정보를 확인할 만큼 회복하는 것이 먼저입니다.",
    usefulWhen: ["공항이나 신칸센 이동 전 배터리가 부족한 상황", "짐을 들고 있어 오래 걷지 않고 충전 후보를 고르고 싶은 상황", "와이파이와 충전을 같이 확인해야 하는 상황"],
    signals: ["역 출구와 공항 이동 방향이 끊기지 않는지 확인", "카페 후보는 좌석 회전과 주문 조건을 확인", "충전 중 짐 정리가 가능한 공간인지 확인"],
    caveats: ["출퇴근 시간과 주말에는 역 주변 좌석이 빠르게 줄어듭니다.", "공항 이동 직전에는 반납형 보조배터리보다 짧은 카페 충전이 나을 수 있습니다."],
    fieldNote: "하카타 충전 후보는 여행 마무리와 생활 동선 사이에 있습니다. 스미맵은 오래 머무는 장소보다 다음 이동을 흔들리지 않게 만드는 회복 지점으로 다룹니다.",
    related: ["/cities/fukuoka/", "/fukuoka-station-charging-guide/", "/routes/battery/", "/spots/fukuoka/hakata-restroom-001/"]
  },
  {
    slug: "spots/fukuoka/tenjin-rain-shelter-001",
    type: "spot",
    title: "텐진 비 피하기와 실내 대기 후보 기준 - 스미맵",
    h1: "텐진에서 비를 피하며 다음 약속을 기다리는 법",
    description: "후쿠오카 텐진 주변에서 비 피하기, 실내 대기, 쇼핑 동선, 화장실 후보를 함께 보는 스미맵 장소 상세 가이드.",
    city: "후쿠오카",
    area: "텐진",
    signal: "비 피하기",
    emoji: "☔",
    mapHref: "/?case=rain&city=fukuoka&utm_source=spot-page&utm_medium=internal&utm_campaign=tenjin-rain-shelter-001",
    summary: "텐진은 쇼핑과 약속 동선이 겹치는 구역이라 비가 오면 실내 대기 후보를 빨리 잡아야 합니다. 비를 피하면서 화장실과 다음 이동 방향을 같이 보는 편이 좋습니다.",
    usefulWhen: ["약속 전 비가 강해져 실내에서 짧게 기다려야 하는 상황", "쇼핑 동선 중 짐이 많아 비와 피로를 함께 해결해야 하는 상황", "텐진 지하 동선으로 이동할지 지상으로 갈지 판단해야 하는 상황"],
    signals: ["지하상가와 상업시설 연결이 다음 목적지와 맞는지 확인", "대기 후보의 혼잡과 앉을 수 있는 가능성을 확인", "화장실과 충전 후보가 가까운지 함께 확인"],
    caveats: ["주말과 비 오는 날에는 실내 대기 공간이 빠르게 붐빌 수 있습니다.", "매장 내부 체류는 주문 조건과 운영 시간 안내를 우선합니다."],
    fieldNote: "텐진에서 비 피하기는 쇼핑을 더 하라는 추천이 아니라 이동 판단을 멈추지 않게 하는 장치입니다. 짧게 서서 다음 행동을 정리할 수 있다면 충분히 유용합니다.",
    related: ["/cities/fukuoka/", "/fukuoka-rain-shelter/", "/routes/rain/", "/routes/rest/"]
  },
  {
    slug: "spots/sapporo/sapporo-station-winter-restroom-001",
    type: "spot",
    title: "삿포로역 겨울 화장실과 실내 대기 기준 - 스미맵",
    h1: "삿포로역에서 겨울에 화장실 후보를 고르는 법",
    description: "삿포로역 주변에서 눈, 추위, 지하 보행공간, 화장실, 실내 대기 후보를 함께 보는 스미맵 장소 상세 가이드.",
    city: "삿포로",
    area: "삿포로역",
    signal: "겨울 화장실",
    emoji: "❄️",
    mapHref: "/?case=restroom&city=sapporo&utm_source=spot-page&utm_medium=internal&utm_campaign=sapporo-station-winter-restroom-001",
    summary: "삿포로 겨울에는 가까운 거리라도 눈길과 추위 때문에 이동 부담이 커집니다. 화장실 후보는 지하 보행공간과 연결되는지, 실내에서 대기할 수 있는지까지 함께 확인해야 합니다.",
    usefulWhen: ["눈이 오거나 길이 미끄러워 지상 이동을 줄이고 싶은 상황", "화장실을 찾으면서 잠깐 몸을 녹일 실내 후보가 필요한 상황", "역 주변에서 동행자와 떨어지지 않고 빠르게 다녀올 후보가 필요한 상황"],
    signals: ["지하 보행공간이나 역 연결 동선이 있는지 확인", "겨울 외투와 짐을 들고 움직이기 쉬운지 확인", "화장실 뒤 바로 대기하거나 다음 이동을 잡을 수 있는지 확인"],
    caveats: ["폭설, 행사, 심야 시간에는 평소보다 이동과 이용 가능성이 달라집니다.", "눈길 이동이 어렵다면 가까운 지상 후보보다 실내 연결 후보가 더 안전할 수 있습니다."],
    fieldNote: "삿포로 겨울 장소 상세는 계절성을 분명히 봐야 합니다. 같은 300미터라도 눈이 오면 완전히 다른 이동이 되므로, 스미맵은 거리보다 실내 연결과 회복 가능성을 우선합니다.",
    related: ["/cities/sapporo/", "/sapporo-winter-restroom-guide/", "/routes/restroom/", "/routes/station/"]
  },
  {
    slug: "cities/nagoya",
    type: "city",
    title: "나고야 생활 스팟 지도 가이드 - 스미맵",
    h1: "나고야역과 사카에에서 먼저 볼 생활 신호",
    description: "나고야역, 사카에, 오스 주변에서 충전, 화장실, 비 피하기, 첫날 생활 동선을 확인하는 스미맵 도시 가이드.",
    city: "나고야",
    area: "나고야역·사카에",
    signal: "도시 생활",
    emoji: "🏙️",
    mapHref: "/?city=nagoya&utm_source=city-page&utm_medium=internal&utm_campaign=nagoya-city",
    summary: "나고야는 역 주변 이동과 사카에 쇼핑 동선이 생활 판단의 중심입니다. 처음 방문한 한국인은 충전과 화장실, 비 피하기 후보를 역과 지하상가 기준으로 나눠 보는 편이 안전합니다.",
    usefulWhen: ["나고야역에서 신칸센이나 숙소 이동 전 생활 후보를 잡아야 하는 상황", "사카에에서 쇼핑과 약속 사이에 충전이나 화장실이 필요한 상황", "오스 주변에서 비나 더위를 피해 잠깐 쉬어야 하는 상황"],
    signals: ["역 안 후보와 역 밖 후보를 먼저 분리", "사카에 지하 동선은 출구 이름과 다음 목적지를 함께 확인", "첫날에는 충전·화장실·실내 대기 후보를 한 묶음으로 저장"],
    caveats: ["초행자는 지하상가 출구를 잘못 잡기 쉬우므로 지도 확대와 현장 표지를 같이 봅니다.", "매장 내부 편의시설은 점포 안내를 우선합니다."],
    fieldNote: "나고야 도시 페이지는 새 지역 확장의 시작점입니다. 장소 수가 적어도 도시별 판단 기준을 먼저 세워 두면 이후 제보와 장소 상세가 같은 방향으로 쌓입니다.",
    related: ["/nagoya-station-living-guide/", "/routes/station/", "/routes/battery/", "/routes/restroom/"]
  },
  {
    slug: "cities/sapporo",
    type: "city",
    title: "삿포로 생활 스팟 지도 가이드 - 스미맵",
    h1: "삿포로에서 겨울과 지하 동선을 함께 보는 법",
    description: "삿포로역, 오도리, 스스키노 주변에서 겨울 화장실, 실내 대기, 충전, 비·눈 피하기 신호를 정리한 스미맵 도시 가이드.",
    city: "삿포로",
    area: "삿포로역·오도리",
    signal: "겨울 생활",
    emoji: "❄️",
    mapHref: "/?city=sapporo&utm_source=city-page&utm_medium=internal&utm_campaign=sapporo-city",
    summary: "삿포로는 계절에 따라 생활 판단이 달라집니다. 겨울에는 거리보다 실내 연결, 화장실 접근, 몸을 녹일 수 있는 대기 후보가 더 중요합니다.",
    usefulWhen: ["눈길 때문에 가까운 후보보다 실내 연결 후보가 필요한 상황", "삿포로역과 오도리 사이에서 지하 보행공간을 활용해야 하는 상황", "스스키노 야간 이동 전 화장실과 대기 후보를 미리 확인하고 싶은 상황"],
    signals: ["지상 거리보다 지하 연결 가능성을 먼저 확인", "겨울에는 화장실과 실내 대기를 한 번에 봄", "야간에는 다음 이동 수단과 밝은 동선을 함께 확인"],
    caveats: ["폭설과 행사 기간에는 동선과 혼잡이 빠르게 달라질 수 있습니다.", "관광 성수기에는 실내 대기 공간의 체감 혼잡이 높아집니다."],
    fieldNote: "삿포로 도시 페이지는 스미맵이 도시별 기후와 생활 신호를 구분한다는 점을 보여줍니다. 같은 화장실 문제라도 겨울 도시에서는 실내 연결이 핵심 기준이 됩니다.",
    related: ["/sapporo-winter-restroom-guide/", "/spots/sapporo/sapporo-station-winter-restroom-001/", "/routes/restroom/", "/routes/rain/"]
  },
  {
    slug: "nagoya-station-living-guide",
    type: "guide",
    title: "나고야역 첫날 생활 동선 가이드 - 스미맵",
    h1: "나고야역에 도착한 첫날 먼저 확인할 생활 후보",
    description: "나고야역 도착 직후 충전, 화장실, 지하상가, 숙소 이동을 함께 보는 스미맵 생활 가이드.",
    city: "나고야",
    area: "나고야역",
    signal: "첫날 생활",
    emoji: "🚉",
    mapHref: "/?case=firstDay&city=nagoya&utm_source=seo-guide&utm_medium=internal&utm_campaign=nagoya-station-living-guide",
    summary: "나고야역 첫날에는 유명 장소보다 생활 기준점이 먼저입니다. 배터리, 화장실, 지하 동선, 숙소 이동 후보를 짧게 잡아 두면 초행 동선이 덜 흔들립니다.",
    usefulWhen: ["신칸센이나 공항 이동 후 나고야역에서 숙소로 가야 하는 상황", "배터리와 화장실을 먼저 해결하고 도시 이동을 시작해야 하는 상황", "사카에나 오스 이동 전에 지하상가 방향을 정리하고 싶은 상황"],
    signals: ["역 안 화장실과 역 밖 후보를 구분", "충전 후보는 다음 이동과 반대 방향인지 확인", "지하상가 출구 이름을 지도 후보와 함께 저장"],
    caveats: ["초행자는 출구 이름과 지도 방향을 함께 확인해야 합니다.", "영업시간 전후에는 상업시설 후보를 공공 후보와 분리해 봅니다."],
    fieldNote: "첫날 가이드는 지도 앱을 쓰기 전의 기준점입니다. 나고야역처럼 큰 역에서는 먼저 해결할 생활 문제를 줄인 뒤 이동하는 편이 사용자의 피로를 낮춥니다.",
    related: ["/cities/nagoya/", "/routes/first-day/", "/routes/station/", "/routes/battery/"]
  },
  {
    slug: "sapporo-winter-restroom-guide",
    type: "guide",
    title: "삿포로 겨울 화장실과 실내 동선 가이드 - 스미맵",
    h1: "삿포로 겨울에는 화장실 후보를 실내 연결로 먼저 봅니다",
    description: "삿포로 겨울 여행과 생활 중 화장실, 지하 보행공간, 실내 대기, 눈길 이동 부담을 함께 보는 스미맵 가이드.",
    city: "삿포로",
    area: "삿포로역·오도리",
    signal: "겨울 화장실",
    emoji: "🚻",
    mapHref: "/?case=restroom&city=sapporo&utm_source=seo-guide&utm_medium=internal&utm_campaign=sapporo-winter-restroom-guide",
    summary: "삿포로 겨울에는 화장실을 찾는 일도 기후와 연결됩니다. 실내 연결, 지하 보행공간, 몸을 녹일 대기 후보를 함께 보면 급한 상황에서 이동 부담을 줄일 수 있습니다.",
    usefulWhen: ["눈길이나 강추위 때문에 지상 이동을 줄이고 싶은 상황", "화장실과 실내 대기를 동시에 해결해야 하는 상황", "삿포로역, 오도리, 스스키노 사이에서 다음 이동을 다시 잡아야 하는 상황"],
    signals: ["지하 연결 후보를 우선", "실내 대기 가능성과 화장실 접근을 함께 확인", "겨울철 외투와 짐을 들고 이동 가능한지 확인"],
    caveats: ["폭설이나 축제 기간에는 평소보다 실내 공간이 붐빌 수 있습니다.", "지도 정보보다 현장 안내와 시설 운영 시간이 우선입니다."],
    fieldNote: "이 가이드는 계절형 생활 콘텐츠입니다. 스미맵이 단순 장소 목록이 아니라 도시와 상황의 조합을 설명하는 정보 사이트로 보이게 하는 데 중요한 유형입니다.",
    related: ["/cities/sapporo/", "/spots/sapporo/sapporo-station-winter-restroom-001/", "/routes/restroom/", "/routes/rain/"]
  }
];

const relatedTitles = new Map([
  ["/guide/", "스미맵 이용 가이드"],
  ["/routes/", "상황별 바로가기"],
  ["/routes/battery/", "충전 상황 가이드"],
  ["/routes/restroom/", "화장실 상황 가이드"],
  ["/routes/rain/", "비 피하기 가이드"],
  ["/routes/rest/", "잠깐 쉬기 가이드"],
  ["/routes/station/", "역 주변 생활 가이드"],
  ["/routes/first-day/", "일본 첫날 생활 루트"],
  ["/routes/response/", "응대 불편 신호 기준"],
  ["/cities/", "도시별 생활권 가이드"],
  ["/cities/tokyo/", "도쿄 생활 스팟 지도 가이드"],
  ["/cities/osaka/", "오사카 생활 스팟 지도 가이드"],
  ["/cities/fukuoka/", "후쿠오카 생활 스팟 지도 가이드"],
  ["/cities/kyoto/", "교토 생활 스팟 지도 가이드"],
  ["/cities/nagoya/", "나고야 생활 스팟 지도 가이드"],
  ["/cities/sapporo/", "삿포로 생활 스팟 지도 가이드"],
  ["/tokyo-restroom-urgent-guide/", "도쿄 화장실 급할 때 보는 순서"],
  ["/tokyo-phone-charging-options/", "도쿄 휴대폰 충전 가능한 곳"],
  ["/tokyo-rain-shelter-route/", "도쿄 비 피하기 실내 동선"],
  ["/tokyo-charging-spots/", "도쿄 충전 가능한 곳 찾기"],
  ["/osaka-station-restroom-route/", "오사카 역 주변 화장실 동선"],
  ["/osaka-cafe-charging-checklist/", "오사카 카페 충전 체크리스트"],
  ["/osaka-rain-waiting-spots/", "오사카 비 오는 날 대기 스팟"],
  ["/osaka-first-day-map-reading-guide/", "오사카 첫날 지도 읽기"],
  ["/kyoto-mobile-battery-rental-guide/", "교토 보조배터리와 충전 판단"],
  ["/kyoto-tourist-restroom-guide/", "교토 관광 동선 화장실 확인"],
  ["/fukuoka-station-charging-guide/", "후쿠오카 역 주변 충전 후보"],
  ["/fukuoka-rain-shelter/", "후쿠오카 비 피하기 좋은 곳"],
  ["/nagoya-station-living-guide/", "나고야역 첫날 생활 동선"],
  ["/sapporo-winter-restroom-guide/", "삿포로 겨울 화장실 동선"],
  ["/spots/tokyo/shinjuku-cafe-charging-001/", "신주쿠 동쪽 카페형 충전 스팟"],
  ["/spots/tokyo/shinjuku-station-restroom-002/", "신주쿠역 화장실 출구 기준"],
  ["/spots/osaka/tennoji-restroom-001/", "텐노지 주변 화장실 확인 스팟"],
  ["/spots/kyoto/station-rest-001/", "교토역 대기와 휴식 스팟"],
  ["/spots/fukuoka/hakata-restroom-001/", "하카타역 주변 화장실 확인 스팟"],
  ["/spots/sapporo/sapporo-station-winter-restroom-001/", "삿포로역 겨울 화장실 스팟"]
]);

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function pageRoute(page) {
  return `/${page.slug}/`;
}

function pageUrl(page) {
  return `${siteUrl}${pageRoute(page)}`;
}

function relatedTitle(href) {
  return relatedTitles.get(href) || href;
}

function renderList(items) {
  return items.map((item) => `<li>${escapeHtml(item)}</li>`).join("\n");
}

function renderRelated(page) {
  return page.related
    .map((href) => `<li><a href="${href}">${escapeHtml(relatedTitle(href))}</a></li>`)
    .join("\n");
}

function renderPage(page) {
  const url = pageUrl(page);
  const headline = page.title.replace(" - 스미맵", "");
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description: page.description,
    inLanguage: "ko-KR",
    datePublished: lastmod,
    dateModified: lastmod,
    author: { "@type": "Organization", name: "스미맵 편집부" },
    publisher: { "@type": "Organization", name: "스미맵", url: siteUrl },
    mainEntityOfPage: url,
    about: [page.city, page.area, page.signal, "일본 생활 편의 정보"]
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
    <meta property="og:title" content="${escapeHtml(headline)}">
    <meta property="og:description" content="${escapeHtml(page.description)}">
    <meta property="og:url" content="${url}">
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7217591196020054" crossorigin="anonymous"></script>
    <meta name="google-adsense-account" content="ca-pub-7217591196020054">
    <link rel="alternate" type="application/rss+xml" title="스미맵 RSS" href="${siteUrl}/feed.xml">
    <link rel="stylesheet" href="/assets/styles.css?v=${styleVersion}">
    <script type="application/ld+json">${JSON.stringify(articleLd)}</script>
  </head>
  <body class="static-body">
    <main class="static-shell">
      <nav class="static-nav">
        <a class="brand" href="/">
          <span class="brand-mark">住</span>
          <span><strong>스미맵</strong><small>일본 생활 제보 지도</small></span>
        </a>
        <a href="${page.mapHref}">지도에서 보기</a>
      </nav>
      <section class="static-hero">
        <h1>${escapeHtml(page.h1)}</h1>
        <p>${escapeHtml(page.description)} ${escapeHtml(page.city)} ${escapeHtml(page.area)}에서 ${escapeHtml(page.signal)} 신호를 볼 때 필요한 기준을 정리했습니다.</p>
      </section>
      <section class="static-content">
        <article class="static-section">
          <h2>${page.emoji} 이 페이지의 역할</h2>
          <p>${escapeHtml(page.summary)}</p>
          <p>스미맵의 장소 상세는 특정 장소를 공식 추천처럼 밀어주는 문서가 아닙니다. 현장에서 사용자가 먼저 확인할 신호, 조심할 예외, 다음 후보로 넘어갈 기준을 짧게 정리해 지도 사용으로 이어지게 하는 문서입니다.</p>
          <ul>
            ${renderList(page.usefulWhen)}
          </ul>
        </article>
        <article class="static-section">
          <h2>현장 확인 전 체크할 신호</h2>
          <p>같은 도시와 같은 역 주변이라도 시간대, 층, 혼잡, 직원 안내에 따라 실제 사용 가능성이 달라집니다. 아래 신호를 먼저 보면 검색 결과를 무작정 따라가기보다 지금 움직일 후보를 줄일 수 있습니다.</p>
          <ul>
            ${renderList(page.signals)}
          </ul>
          <p><a href="${page.mapHref}">${escapeHtml(page.city)} ${escapeHtml(page.signal)} 지도 조건으로 열기</a></p>
        </article>
        <article class="static-section">
          <h2>지도에서 보는 순서</h2>
          <ol>
            <li>현재 위치가 ${escapeHtml(page.area)} 안에서 어느 출구나 통로에 가까운지 먼저 확인합니다.</li>
            <li>가장 가까운 후보와 두 번째 후보를 동시에 열어 동선이 꼬이지 않게 합니다.</li>
            <li>상세의 최근 확인, 혼잡, 직원 확인 필요, 현장 주의 문장을 먼저 읽습니다.</li>
            <li>애매하면 현장 안내와 직원 요청을 우선하고, 무리한 이용은 피합니다.</li>
            <li>정보가 달라졌다면 제보나 정정 기준에 맞춰 짧게 남깁니다.</li>
          </ol>
        </article>
        <article class="static-section static-experience">
          <h2>편집 기준 메모</h2>
          <p>${escapeHtml(page.fieldNote)}</p>
          <p>이 문서는 검색어를 채우기 위한 반복 페이지가 아니라, 도시와 상황이 달라질 때 판단 기준이 어떻게 달라지는지 보여주기 위한 콘텐츠입니다. 지도는 빠르게 쓰고, 문서는 왜 그 신호를 봐야 하는지 설명하는 역할을 맡습니다.</p>
        </article>
        <article class="static-section">
          <h2>현장 주의와 정정 기준</h2>
          <p>시설 정보는 운영 시간, 행사, 공사, 계절, 점포 정책에 따라 바뀔 수 있습니다. 스미맵은 단정적인 표현보다 방문 전 확인 가능한 문장을 우선합니다.</p>
          <ul>
            ${renderList(page.caveats)}
          </ul>
          <p>제보를 남길 때는 개인을 특정하거나 장소를 공격하는 표현보다 “직원 확인 필요”, “혼잡 시간은 피하는 편이 좋음”, “지하 연결 동선이 더 편함”처럼 다음 사용자가 행동으로 바꿀 수 있는 문장이 좋습니다.</p>
        </article>
        <article class="static-section">
          <h2>같이 볼 스미맵 문서</h2>
          <ul>
            ${renderRelated(page)}
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
  const generatedBlocks = pages.map((page) => `  <url><loc>${pageUrl(page)}</loc><lastmod>${lastmod}</lastmod><changefreq>weekly</changefreq><priority>${page.type === "city" ? "0.82" : "0.8"}</priority></url>`);
  const next = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${existingBlocks.map((block) => `  ${block}`).join("\n")}
${generatedBlocks.join("\n")}
</urlset>
`;
  fs.writeFileSync(sitemapPath, next);
}

function renderFeedItem(page) {
  return `    <item>
      <title>${escapeHtml(page.title.replace(" - 스미맵", ""))}</title>
      <link>${pageUrl(page)}</link>
      <guid>${pageUrl(page)}</guid>
      <pubDate>${buildDate}</pubDate>
      <description>${escapeHtml(page.description)}</description>
    </item>`;
}

function writeFeed() {
  const feedPath = path.join(siteRoot, "feed.xml");
  const current = fs.readFileSync(feedPath, "utf8");
  const generatedLinks = new Set(pages.map(pageUrl));
  const existingItems = [...current.matchAll(/<item\b[\s\S]*?<\/item>/gi)]
    .map((match) => match[0])
    .filter((block) => {
      const link = block.match(/<link>\s*([^<]+?)\s*<\/link>/i)?.[1]?.trim();
      return link && !generatedLinks.has(link);
    });
  const items = [
    ...pages.map(renderFeedItem),
    ...existingItems.map((block) => block.split("\n").map((line) => line.startsWith("    ") ? line : `    ${line}`).join("\n"))
  ].join("\n");
  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>스미맵</title>
    <link>${siteUrl}/</link>
    <description>일본 생활 중 필요한 충전, 화장실, 쉬기, 비 피하기, 한국어 대응 신호를 정리한 스미맵 콘텐츠 피드.</description>
    <language>ko-KR</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
${items}
  </channel>
</rss>
`;
  fs.writeFileSync(feedPath, feed);
}

for (const page of pages) {
  const dir = path.join(siteRoot, page.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), renderPage(page));
}

upsertSitemap();
writeFeed();

console.log(`Generated ${pages.length} Sumimap local detail pages.`);
