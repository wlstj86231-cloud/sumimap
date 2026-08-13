import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const siteRoot = path.join(root, "site");
const siteUrl = "https://sumimap.com";
const checkedAt = "2026-08-14";
const styleVersion = "20260814-trust1";

const S = {
  charge: source("INFORICH", "CHARGESPOT 공식 사용·요금·설치 지도", "https://chargespot.jp/", "원문에 별도 갱신일 표기 없음", "대여·반납 가능 상태와 요금은 서비스 운영사의 공식 지도·앱에서 이동 직전에 확인합니다."),
  moj: source("出入国在留管理庁", "외국인 생활지원 포털", "https://www.moj.go.jp/isa/support/portal/?hl=ko", "2026-05-29 포털 일부 갱신", "한국어를 포함한 다국어 생활·취업 안내를 제공하는 일본 정부 원문입니다."),
  jnto: source("日本政府観光局（JNTO）", "Tourist Information Center", "https://www.japan.travel/en/tic/", "원문에 별도 갱신일 표기 없음", "전국 인증 관광안내소와 전화 안내의 운영 범위를 확인합니다."),
  jma: source("気象庁", "다국어 방재정보", "https://www.jma.go.jp/jma/kokusai/multi.html", "원문에 별도 갱신일 표기 없음", "호우·폭염·지진 등 공식 경보를 한국어를 포함한 다국어로 확인합니다."),
  tokyoMap: source("東京都デジタルサービス局", "Tokyo Map", "https://www.digitalservice.metro.tokyo.lg.jp/business/data-utilization/tokyomap", "2026-04-16", "도쿄도 보유 지도에서 배리어프리 화장실과 공공 Wi-Fi 같은 시설 레이어를 확인합니다."),
  tokyoConsult: source("東京都生活文化局", "도쿄도 외국인 상담 서비스", "https://www.seikatubunka.metro.tokyo.lg.jp/about/0000002541", "2026-01-20", "한국어 상담 요일, 시간과 상담 범위를 도쿄도 원문에서 확인합니다."),
  jrTokyo: source("JR東日本", "도쿄역 공식 안내", "https://www.jreast.co.jp/estation/stations/1039.html", "원문에 별도 갱신일 표기 없음", "역 구내도와 출구·시설 정보는 철도 운영사 원문을 기준으로 봅니다."),
  osakaToilet: source("大阪市環境局", "오사카시 공중화장실·시민화장실", "https://www.city.osaka.lg.jp/kankyo/page/0000369340.html", "2026-06-02", "오사카시 관리 공중화장실 목록과 공식 지도를 확인합니다."),
  osakaMetro: source("Osaka Metro", "난바역 공식 안내", "https://subway.osakametro.co.jp/station_guide/m/m20/index.php", "원문에 별도 갱신일 표기 없음", "역 구내도, 출구, 다기능 화장실과 엘리베이터를 운영사 원문에서 확인합니다."),
  osakaLife: source("大阪市", "한국어 신생활 준비 안내", "https://www.city.osaka.lg.jp/contents/wdu020/enjoy/ko/content_k.html", "원문에 별도 갱신일 표기 없음", "외국어 생활 상담과 공공 창구를 한국어로 안내하는 오사카시 원문입니다."),
  kyotoToilet: source("京都市環境政策局", "교토시 공중화장실 지도", "https://www.city.kyoto.lg.jp/kankyo/page/0000330061.html", "2026-03-10", "기온·기요미즈를 포함한 지역별 공중화장실 위치와 목록을 확인합니다."),
  kyotoTouristToilet: source("京都市", "교토시 관광화장실 제도와 목록", "https://www.city.kyoto.lg.jp/kankyo/page/0000193916.html", "2026-04-01", "무료 개방 조건, 개방 시간과 인증 시설의 이용 주의사항을 확인합니다."),
  kyotoConsult: source("京都市", "외국 국적 주민 상담", "https://www.city.kyoto.lg.jp/sogo/page/0000246836.html", "2022-10-01", "한국어를 포함한 생활 일반·법률·비자 상담 창구 범위를 확인합니다."),
  fukuokaSubway: source("福岡市交通局", "하카타역 공식 안내", "https://subway.city.fukuoka.lg.jp/eki/stations/hakata.php", "원문에 별도 갱신일 표기 없음", "역 입체도, 출구, 엘리베이터, 다기능 화장실과 설비를 확인합니다."),
  fukuokaJr: source("JR九州", "하카타역 공식 안내", "https://www.jrkyushu.co.jp/railway/station/1191771_1601.html", "원문에 별도 갱신일 표기 없음", "역 구내도, 창구 운영, 코인로커와 역 설비를 확인합니다."),
  fukuokaConsult: source("福岡市", "외국인 생활 상담 안내", "https://www.city.fukuoka.lg.jp/soki/kokusai/shisei/seikatugaidansu/enquirie_to_fukuoka_city_hall_2.html", "원문에 별도 갱신일 표기 없음", "구청 절차와 생활 문의의 한국어 통역 연결 범위를 확인합니다."),
  sapporoTransit: source("札幌市交通局", "노선도·역 구내도", "https://www.city.sapporo.jp/st/route_konaizu/", "2024-12-04", "지하철 역 구내도, 엘리베이터·계단, 피난 경로와 환승 동선을 확인합니다."),
  sapporoBarrier: source("札幌市", "삿포로시 배리어프리 타운맵", "https://www.city.sapporo.jp/fukushi/barrierfree/index.html", "시유 시설 데이터 2025-04 기준", "다목적 화장실과 배리어프리 설비를 찾고 실제 현황은 시설에 재확인합니다."),
  sapporoWinter: source("札幌市", "공원 화장실 동절기 이용 안내", "https://www.city.sapporo.jp/ryokuka/top/koueniji/benjoichiran.html", "2026-04-21", "겨울철 폐쇄 또는 이용 제한이 있는 공원 화장실을 확인합니다."),
  nagoyaBarrier: source("名古屋市", "나고야 배리어프리 외출 내비", "https://barrierfree.city.nagoya.jp/map/", "원문에 별도 갱신일 표기 없음", "나고야역·사카에·가나야마 환승과 배리어프리 화장실 정보를 확인합니다."),
  nagoyaTransit: source("名古屋市交通局", "지하철 화장실 안내", "https://kotsu.city.nagoya.jp/rp/barrierfr/TRP0000938.htm", "원문에 별도 갱신일 표기 없음", "각 역의 일반·배리어프리 화장실 설비 현황을 확인합니다."),
  nagoyaLife: source("名古屋市", "한국어 생활 가이드", "https://www.city.nagoya.jp/shisei/kokusai/1017227/1017236.html", "2025-10-17", "주거·병원·교통·재해·행정 절차와 상담 창구를 한국어로 확인합니다.")
};

const pages = [
  page("guide", "스미맵 이용 가이드: 공식 원문과 현장 확인 순서", "스미맵 지도 핀의 의미, 공식 원문과 자료 대조일을 읽는 법, 화장실·충전·다국어 안내를 현장에서 재확인하는 순서를 설명합니다.", "핀보다 원문, 원문보다 현장 안내를 먼저 봅니다", [S.moj, S.jnto, S.tokyoMap],
    ["스미맵의 핀은 개별 매장이나 시설이 확실히 운영 중이라는 인증이 아닙니다. 낯선 도시에서 어떤 공식 자료를 먼저 열어야 하는지 알려주는 지역 기준점입니다. 따라서 핀 좌표와 실제 시설 출입구가 다를 수 있고, 운영시간·공사·행사·계절에 따라 이용 조건도 바뀔 수 있습니다.", "각 문서에는 원문 기관, 원문 제목, 원문에 표시된 갱신일과 스미맵이 링크를 다시 열어 본 자료 대조일을 나눠 적습니다. 대조일이 오늘에 가깝더라도 원문 데이터 자체가 오래됐을 수 있으므로 두 날짜를 같은 의미로 읽지 않습니다."],
    ["필요한 상황을 고른 뒤 가까운 핀을 ‘정답’이 아니라 검색 시작점으로 봅니다.", "상세 화면의 공식 원문을 열어 시설명, 출구, 층, 운영시간과 이용 조건을 확인합니다.", "지도에서 현재 이동 방향과 같은 쪽인지 보고, 실패할 때 쓸 두 번째 후보도 남깁니다.", "현장에 도착하면 표지판과 직원 안내를 우선하고, 정보가 다르면 공개 정정 창구에 원문 링크와 차이를 남깁니다."],
    ["스미맵은 정부·지자체·교통기관의 공식 서비스가 아닌 독립 편집 서비스입니다.", "실시간 혼잡도, 빈 좌석, 화장실 개방, 언어 가능한 직원을 보증하지 않습니다.", "응급 상황과 안전 판단에는 스미맵이 아니라 현지 긴급전화와 공식 방재정보를 이용해야 합니다."], "/?utm_source=guide&utm_medium=internal&utm_campaign=map"),

  page("routes", "일본 생활 상황별 확인 순서 - 스미맵", "배터리 부족, 화장실 급함, 비·대기, 역 환승, 일본 첫날과 언어 안내 상황에서 공식 원문을 여는 순서를 고르는 허브입니다.", "지금 곤란한 이유부터 고르면 확인 순서가 짧아집니다", [S.charge, S.jma, S.jnto],
    ["같은 장소라도 배터리가 부족할 때와 화장실이 급할 때 필요한 판단은 다릅니다. 상황별 가이드는 장소를 추천 목록으로 나열하지 않고, 공식 원문에서 어떤 항목을 먼저 찾아야 실패 가능성이 줄어드는지 정리합니다.", "충전은 대여 가능 상태와 반납 슬롯, 화장실은 개찰 안팎과 층, 비·대기는 기상 경보와 실내 연결, 언어 안내는 지원 언어와 상담 시간을 구분합니다. 아래 가이드 중 지금 필요한 한 가지를 먼저 여는 것이 좋습니다."],
    ["배터리가 15% 아래면 충전 가이드에서 공식 대여 지도와 결제 조건을 확인합니다.", "화장실이 급하면 가까운 거리보다 공공시설·개찰 안팎·층을 먼저 봅니다.", "비나 폭염이면 공식 기상정보를 확인하고 목적지 방향과 이어지는 실내 동선을 찾습니다.", "일본 첫날이거나 언어 지원이 필요하면 정부 생활 포털과 인증 안내소를 우선합니다."],
    ["상황별 문서는 개별 영업점의 실시간 상태를 수집하지 않습니다.", "매장 콘센트와 화장실은 운영자의 허가나 구매 조건이 있을 수 있습니다.", "특정 지역 또는 시설의 안전도·친절도·신뢰도를 점수로 평가하지 않습니다."], "/?utm_source=routes&utm_medium=internal&utm_campaign=map"),

  page("cities", "일본 6개 도시 공식 시설 확인 가이드 - 스미맵", "도쿄·오사카·교토·후쿠오카·삿포로·나고야에서 지자체와 교통기관의 공식 시설 지도를 찾는 도시별 허브입니다.", "도시마다 먼저 열어야 할 공식 지도가 다릅니다", [S.tokyoMap, S.osakaToilet, S.nagoyaBarrier],
    ["대형역의 출구 구조, 공중화장실을 관리하는 기관, 겨울철 시설 운영 조건은 도시마다 다릅니다. 도시 허브는 같은 문장을 지역명만 바꿔 반복하지 않고, 해당 지자체와 교통기관이 실제로 공개한 자료의 범위부터 설명합니다.", "도쿄는 도 공식 통합지도, 오사카와 교토는 시가 공개한 공중화장실 자료, 후쿠오카는 교통국과 JR큐슈 역 안내, 삿포로는 겨울 운영과 배리어프리 정보, 나고야는 환승·배리어프리 지도를 중심으로 봅니다."],
    ["현재 있는 도시를 고르고 공식 자료가 다루는 시설 종류를 먼저 확인합니다.", "역권에서는 같은 역 이름보다 운영사, 개찰 안팎, 출구와 층을 구분합니다.", "지도 작성 기준일이 표시되면 자료 대조일과 별도로 기록된 날짜를 읽습니다.", "원문과 현장이 다르면 현장 안내를 따르고 정정 제안에는 확인한 원문 URL을 함께 남깁니다."],
    ["도시 페이지는 모든 공공시설을 망라하지 않습니다.", "지자체 데이터의 갱신 주기와 시설 실제 변경 시점 사이에는 차이가 생길 수 있습니다.", "지역 기준 핀은 특정 시설의 좌표·입구·운영 상태를 보증하지 않습니다."], "/?utm_source=cities&utm_medium=internal&utm_campaign=map"),

  page("routes/battery", "일본에서 배터리 부족할 때 공식 충전 위치 확인법 - 스미맵", "일본에서 휴대전화 배터리가 부족할 때 공식 보조배터리 설치 지도, 대여 상태, 요금, 결제와 반납 위치를 확인하는 순서입니다.", "콘센트를 찾기 전에 대여와 반납 가능 상태를 같이 봅니다", [S.charge, S.jnto],
    ["배터리가 급하면 지도에 콘센트가 표시된 카페를 무작정 찾아가기보다 공식 보조배터리 대여 지도의 현재 상태를 먼저 보는 편이 실패가 적습니다. CHARGESPOT은 공식 안내에서 스테이션 상태에 따라 대여나 반납이 불가능할 수 있다고 밝히므로, 설치 여부와 실제 이용 가능 여부를 같은 것으로 보면 안 됩니다.", "매장 콘센트는 눈에 보여도 고객 사용을 허용한다는 뜻이 아닙니다. 주문 조건, 좌석별 제한, 직원 확인이 필요할 수 있어 스미맵은 특정 카페를 ‘충전 가능’이라고 고정 표시하지 않습니다."],
    ["공식 대여 지도나 앱에서 현재 위치 주변의 대여 가능 스테이션을 찾습니다.", "지원 결제수단, 최신 요금과 케이블 규격을 운영사 원문에서 확인합니다.", "빌리기 전에 다음 이동지 주변에 반납 가능한 빈 슬롯이 있는지 함께 봅니다.", "매장 전원을 쓰려면 주문과 직원 허락을 먼저 받고, 무단 사용은 하지 않습니다."],
    ["스미맵은 배터리 재고, 고장, 반납 슬롯을 실시간으로 중계하지 않습니다.", "상업 서비스의 요금과 결제 조건은 운영사 공지가 우선합니다.", "핀은 대여기를 가리키는 확정 좌표가 아니라 공식 설치 지도를 여는 지역 기준점입니다."], "/?case=battery&utm_source=route-battery&utm_medium=internal&utm_campaign=map"),

  page("routes/restroom", "일본에서 화장실 급할 때 공식 시설 확인 순서 - 스미맵", "일본 대형역과 관광지에서 공중화장실, 개찰 안팎, 층, 운영시간과 대체 후보를 공식 자료로 확인하는 순서입니다.", "가장 가까운 곳보다 지금 들어갈 수 있는 공공 동선을 찾습니다", [S.tokyoMap, S.osakaToilet, S.kyotoToilet],
    ["화장실이 급할 때 직선거리만 보면 개찰 반대편, 다른 층, 영업이 끝난 상업시설을 선택할 수 있습니다. 도쿄도 지도, 오사카시 공중화장실 목록, 교토시 공중화장실 지도처럼 관리 기관이 공개한 원문에서 시설 종류와 위치를 먼저 확인합니다.", "편의점·카페·백화점 화장실은 점포와 시간에 따라 구매 또는 입장 조건이 달라집니다. 공공시설 후보를 먼저 보고, 민간 시설은 현장 표지와 직원 안내를 따르는 순서가 안전합니다."],
    ["현재 역의 운영사와 개찰 안팎을 먼저 구분합니다.", "공식 지도에서 같은 층 또는 현재 출구 방향의 공공시설 후보를 찾습니다.", "첫 후보가 공사·혼잡·폐쇄일 때 바로 이동할 두 번째 후보를 저장합니다.", "도착 후 표지판의 이용시간과 제한을 확인하고 사유지에는 무단 출입하지 않습니다."],
    ["공식 목록도 공사와 긴급 폐쇄를 즉시 반영하지 못할 수 있습니다.", "스미맵은 청결도, 대기줄과 현재 개방 상태를 측정하지 않습니다.", "개별 매장의 화장실 이용 가능성을 일반화하거나 보장하지 않습니다."], "/?case=toilet&utm_source=route-restroom&utm_medium=internal&utm_campaign=map"),

  page("routes/rain", "일본에서 비·폭염을 피할 때 공식 정보 확인법 - 스미맵", "일본에서 비, 호우, 폭염을 만났을 때 기상청 경보와 공공 실내 동선을 확인하고 통행 공간과 휴게공간을 구분하는 방법입니다.", "지붕보다 먼저 공식 경보와 다음 이동 방향을 확인합니다", [S.jma, S.jrTokyo, S.fukuokaSubway],
    ["갑작스러운 비나 폭염에서는 가까운 지붕만 찾기보다 기상청 다국어 방재정보로 경보 수준과 지속 가능성을 확인해야 합니다. 짧은 소나기와 이동을 멈춰야 할 호우는 대응이 다르며, 스미맵은 자체 날씨 판단이나 안전 등급을 만들지 않습니다.", "역 통로와 지하상가는 비를 피할 수 있어도 모두 휴게공간은 아닙니다. 목적지 방향과 이어지는 실내 동선, 실제 앉을 수 있는 공공 공간, 운영시간이 있는 시설을 구분해서 봅니다."],
    ["기상청 공식 정보에서 호우·폭염·지진 등 현재 경보를 확인합니다.", "철도 운영사 구내도에서 목적지 방향과 이어지는 실내 출구를 고릅니다.", "통행을 방해하지 않는 실제 휴게공간인지 현장 표지로 확인합니다.", "상황이 악화되면 지도를 계속 탐색하지 말고 시설 직원과 현지 재난 안내를 따릅니다."],
    ["지도 핀은 대피소나 안전지대를 뜻하지 않습니다.", "실내 연결 통로의 개방시간과 공사 상태는 변할 수 있습니다.", "재난·응급 상황에는 공식 경보와 현지 당국 지시가 스미맵보다 우선합니다."], "/?case=rain&utm_source=route-rain&utm_medium=internal&utm_campaign=map"),

  page("routes/rest", "일본에서 잠깐 쉬기 전 확인할 공공 동선 - 스미맵", "일본 역과 관광지에서 통행 공간, 대기 공간, 실제 휴게공간을 구분하고 운영시간과 이용 규칙을 확인하는 방법입니다.", "잠깐 머물 수 있는 곳과 지나가는 통로를 구분합니다", [S.jrTokyo, S.osakaMetro, S.jnto],
    ["짐을 정리하거나 약속 전 잠깐 기다릴 때 역 통로와 상업시설 입구를 휴게공간으로 오해하기 쉽습니다. 운영사 구내도와 시설 안내에서 대합실, 안내소, 개방된 공공 공간을 확인하고 통행을 막지 않는지를 먼저 봅니다.", "스미맵의 쉬기 핀은 좌석이 비어 있거나 장시간 체류가 허용된다는 제보가 아닙니다. 지역 기준점에서 공식 시설 정보를 열어 확인 순서를 제시할 뿐입니다."],
    ["현재 이동을 방해하지 않는 안전한 위치에서 짐과 배터리 상태를 먼저 확인합니다.", "역 운영사 또는 지자체 원문에서 대합실·안내소·공공시설의 위치를 찾습니다.", "좌석, 영업시간, 구매 조건과 체류 제한은 현장에서 다시 확인합니다.", "앉을 곳이 없으면 통로에 머무르지 말고 다음 공식 후보로 이동합니다."],
    ["빈 좌석과 혼잡도는 실시간으로 제공하지 않습니다.", "민간 영업장의 체류 허용 여부를 스미맵이 대신 판단하지 않습니다.", "늦은 시간에는 운영 종료와 교통편을 별도로 확인해야 합니다."], "/?filter=rest&utm_source=route-rest&utm_medium=internal&utm_campaign=map"),

  page("routes/station", "일본 대형역에서 출구·시설을 확인하는 순서 - 스미맵", "도쿄역, 난바역, 하카타역 같은 대형역에서 운영사, 개찰 안팎, 출구, 층과 배리어프리 동선을 공식 구내도로 확인합니다.", "역 이름보다 운영사·개찰·층을 먼저 구분합니다", [S.jrTokyo, S.osakaMetro, S.fukuokaSubway],
    ["일본의 대형역은 같은 이름 아래 JR, 지하철, 사철이 함께 있고 개찰과 출구가 멀리 떨어진 경우가 많습니다. ‘역 근처’라는 설명만으로는 화장실이나 엘리베이터에 도달하기 어렵기 때문에 해당 구간을 운영하는 기관의 공식 구내도를 먼저 엽니다.", "지도상 거리가 짧아도 층 이동, 개찰 통과, 지하 연결 방향 때문에 실제 동선은 길어질 수 있습니다. 스미맵은 도보 몇 분이라는 고정 시간을 만들지 않고 지도 중심과 기준점의 거리만 보조적으로 표시합니다."],
    ["승차권이나 앱에서 지금 이용 중인 철도 운영사를 확인합니다.", "공식 구내도에서 개찰 안팎, 층과 출구 번호를 순서대로 찾습니다.", "엘리베이터·다기능 화장실 등 필요한 설비 기호를 확인합니다.", "공사나 통제 표지가 있으면 구내도보다 역무원과 현장 안내를 우선합니다."],
    ["고정된 구내도와 실제 공사 동선은 다를 수 있습니다.", "환승 소요시간은 보행 속도와 혼잡에 따라 달라 보장하지 않습니다.", "승강장 안전과 운행 장애 정보는 해당 철도 운영사의 실시간 공지를 이용해야 합니다."], "/?filter=restroom&utm_source=route-station&utm_medium=internal&utm_campaign=map"),

  page("routes/first-day", "일본 도착 첫날 생활 정보 확인 순서 - 스미맵", "일본 도착 첫날 정부 생활 포털, 인증 관광안내소, 교통기관 원문을 이용해 통신·교통·상담과 기본 동선을 정리하는 방법입니다.", "첫날에는 넓은 추천 목록보다 공식 창구 세 곳을 저장합니다", [S.moj, S.jnto, S.fukuokaJr],
    ["일본 도착 첫날에는 배터리, 통신, 교통, 숙소 이동과 행정 정보가 한꺼번에 필요해집니다. 블로그나 커뮤니티의 오래된 글부터 보기보다 출입국재류관리청 생활지원 포털, JNTO 인증 안내소, 이용하는 교통기관의 공식 안내를 먼저 저장하면 기준점을 잡기 쉽습니다.", "관광객, 유학생, 취업 체류자는 필요한 행정 절차가 서로 다릅니다. 스미맵은 비자·법률 판단을 대신하지 않고, 정부의 한국어 원문과 공식 상담 창구로 이동하도록 안내합니다."],
    ["정부 생활지원 포털에서 자신의 체류 목적에 맞는 한국어 안내를 찾습니다.", "공항이나 주요 역에서 JNTO 인증 안내소의 위치·운영시간·지원 언어를 확인합니다.", "이용할 철도 운영사의 공식 역 안내에서 출구와 다음 환승 동선을 저장합니다.", "전화번호·주소·예약 정보는 공개 정정 창구에 쓰지 말고 본인 기기에만 보관합니다."],
    ["스미맵은 출입국·세금·의료·법률 자문을 제공하지 않습니다.", "안내소의 언어 가능 직원과 운영시간은 날마다 달라질 수 있습니다.", "개인 상황에 관한 결정은 담당 기관 또는 자격 있는 전문가에게 확인해야 합니다."], "/?utm_source=route-first-day&utm_medium=internal&utm_campaign=map"),

  page("routes/korean", "일본에서 한국어·다국어 공식 안내를 찾는 법 - 스미맵", "일본 정부 생활지원 포털, JNTO 인증 관광안내소와 도시별 외국인 상담에서 한국어 지원 범위와 시간을 확인하는 방법입니다.", "한국어 표지와 한국어 상담 가능 여부는 따로 확인합니다", [S.moj, S.jnto, S.tokyoConsult],
    ["한국어 메뉴가 있다는 사실, 한국어 안내문이 있다는 사실, 한국어로 복잡한 상담이 가능하다는 사실은 서로 다릅니다. 지역 전체를 ‘한국어 가능’으로 표시하지 않고 정부 포털, JNTO 인증 안내소, 지자체 상담창구의 지원 언어와 시간을 각각 확인합니다.", "JNTO의 도쿄 대면 카운터는 2026년 3월 31일 종료됐으므로 과거 블로그의 주소를 그대로 따라가면 안 됩니다. 현재 전화 안내와 전국 인증 안내소 정보는 JNTO 공식 원문을 기준으로 봅니다."],
    ["질문이 생활 행정인지 관광 안내인지 먼저 구분합니다.", "정부 또는 지자체 원문에서 한국어 지원 요일·시간·상담 범위를 확인합니다.", "방문 전에 전화나 공식 페이지로 휴무와 예약 필요 여부를 다시 봅니다.", "번역이 필요한 개인정보는 공개 이슈에 올리지 말고 해당 공식 창구에 직접 전달합니다."],
    ["상권이나 매장 전체의 한국어 응대를 보장하지 않습니다.", "직원 언어 능력과 근무 일정은 고정 정보가 아닙니다.", "의료·법률·긴급 상황에는 일반 관광 안내가 아닌 해당 전문·공공 창구를 이용해야 합니다."], "/?case=korean&utm_source=route-korean&utm_medium=internal&utm_campaign=map"),

  city("cities/tokyo", "도쿄 공식 생활시설 지도 읽기 - 스미맵", "도쿄도 공식 통합지도, JR동일본 역 안내와 외국인 상담 원문으로 화장실·Wi-Fi·출구·다국어 상담을 확인합니다.", "도쿄에서는 통합지도와 철도 운영사 구내도를 나눠 봅니다", [S.tokyoMap, S.jrTokyo, S.tokyoConsult],
    ["도쿄도 Tokyo Map은 배리어프리 화장실과 TOKYO FREE Wi-Fi 같은 공공 데이터 레이어를 한 화면에서 확인할 수 있습니다. 하지만 역 내부 출구와 개찰 동선은 해당 철도 운영사의 구내도가 더 구체적이므로 목적에 따라 원문을 나눠 엽니다.", "신주쿠·시부야·우에노처럼 역권이 큰 곳에서는 지도 중심과 실제 출구가 멀 수 있습니다. 현재 운영사, 개찰 안팎과 층을 확인한 뒤 지역 기준 핀을 이용합니다."],
    ["도쿄도 지도에서 필요한 시설 레이어를 켜고 범례를 확인합니다.", "역 안이면 JR·도쿄메트로·도영 등 현재 운영사의 구내도를 별도로 엽니다.", "외국어 생활 상담은 도쿄도 원문에서 한국어 요일과 시간을 확인합니다.", "공사·행사 통제가 보이면 원문보다 역무원과 현장 안내를 우선합니다."],
    ["도쿄 전체의 모든 민간 시설을 포함하지 않습니다.", "무료 Wi-Fi 연결 품질과 화장실 개방 상태는 실시간 보증 대상이 아닙니다.", "지역 기준 핀은 특정 출입구 또는 매장의 위치 표식이 아닙니다."], "tokyo"),

  city("cities/osaka", "오사카 공식 화장실·역 동선 확인 가이드 - 스미맵", "오사카시 공중화장실 지도, Osaka Metro 난바역 구내도와 한국어 생활 안내로 지하 동선과 공공시설을 확인합니다.", "오사카에서는 지하 구역 이름과 출구를 먼저 적습니다", [S.osakaToilet, S.osakaMetro, S.osakaLife],
    ["우메다와 난바는 지하 동선이 넓고 여러 철도 운영사가 이어져 있어 같은 역권 안에서도 방향을 잃기 쉽습니다. 오사카시 공중화장실 자료와 Osaka Metro 구내도를 함께 보고 현재 지하상가 이름, 출구 번호와 층을 먼저 확인합니다.", "시가 관리하는 공중화장실과 상업시설 내부 화장실은 이용 조건이 다릅니다. 공식 목록의 관리 주체를 확인하고 민간 시설은 영업시간과 현장 안내를 따릅니다."],
    ["오사카시 공식 지도에서 공중화장실의 관리 주체와 위치를 확인합니다.", "지하철역에서는 난바·우메다 같은 지역명보다 노선과 역 번호를 먼저 봅니다.", "엘리베이터와 다기능 화장실은 공식 구내도의 설비 기호를 사용합니다.", "생활 상담이 필요하면 오사카시 한국어 안내에서 담당 공공 창구를 찾습니다."],
    ["지하 공사와 통로 폐쇄는 지도보다 현장 표지가 빠를 수 있습니다.", "상업시설 영업시간과 매장 이용 조건을 대신 보증하지 않습니다.", "혼잡도와 체감 보행시간은 사람과 시간대에 따라 달라집니다."], "osaka"),

  city("cities/kyoto", "교토 공식 공중·관광 화장실 확인 가이드 - 스미맵", "교토시 공중화장실 지도와 관광화장실 제도, 외국 국적 주민 상담 원문으로 기온·교토역 주변 이용 조건을 확인합니다.", "교토에서는 공중화장실과 관광화장실의 개방 조건을 구분합니다", [S.kyotoToilet, S.kyotoTouristToilet, S.kyotoConsult],
    ["교토시는 공중화장실 지도와 민간 시설이 무료로 화장실을 개방하는 관광화장실 제도를 따로 안내합니다. 목록에 있다는 사실만 보고 언제나 열려 있다고 생각하지 말고 개방 시간과 현장 표지를 확인해야 합니다.", "기온과 시조가와라마치는 계절 행사와 관광 혼잡에 따라 동선이 크게 달라질 수 있습니다. 사유지·매장 시설을 무단 이용하지 않고 촬영·대기·화장실 관련 지역 안내를 우선합니다."],
    ["교토시 공식 지도에서 공중화장실과 관광화장실 종류를 구분합니다.", "목록에 표시된 개방 시간과 주의사항을 읽고 두 번째 후보도 정합니다.", "관광 성수기와 행사일에는 현장 통제와 안내원의 지시를 따릅니다.", "생활·비자 상담은 교토시 공식 외국 국적 주민 상담 범위를 확인합니다."],
    ["화장실 청결도와 현재 대기열은 제공하지 않습니다.", "관광화장실 제휴 시설의 사정에 따른 임시 변경을 즉시 반영하지 못할 수 있습니다.", "특정 지역의 친절도·안전도·혼잡도를 점수화하지 않습니다."], "kyoto"),

  city("cities/fukuoka", "후쿠오카 하카타·텐진 공식 역 시설 가이드 - 스미맵", "후쿠오카시 지하철과 JR큐슈 하카타역 공식 안내, 외국인 생활 상담으로 출구·화장실·역 설비를 확인합니다.", "후쿠오카에서는 하카타역의 운영사와 교통수단을 먼저 구분합니다", [S.fukuokaSubway, S.fukuokaJr, S.fukuokaConsult],
    ["하카타역은 지하철, JR, 버스와 공항 이동이 이어집니다. 후쿠오카시 지하철 역 입체도와 JR큐슈 역 안내는 다루는 구역이 다르므로 현재 교통수단에 맞는 운영사 원문을 열어야 합니다.", "텐진 역시 지하 연결이 편리하지만 통행 공간과 휴게공간은 다릅니다. 비를 피할 때는 목적지 방향과 운영시간을 확인하고 장시간 통로를 막지 않습니다."],
    ["현재 이용 중인 교통수단이 지하철인지 JR인지 먼저 확인합니다.", "운영사 공식 구내도에서 출구, 엘리베이터와 다기능 화장실을 찾습니다.", "공항·버스·신칸센 환승이면 다음 운영사의 원문도 함께 저장합니다.", "행정 문의는 후쿠오카시 외국인 생활 상담의 한국어 연결 범위를 확인합니다."],
    ["두 운영사의 지도 범위를 하나의 실시간 지도처럼 합치지 않습니다.", "코인로커·창구·설비의 현재 빈자리와 고장을 보증하지 않습니다.", "공항과 역의 보안·운영 통제가 공식 페이지보다 우선할 수 있습니다."], "fukuoka"),

  city("cities/sapporo", "삿포로 겨울철 화장실·배리어프리 확인 가이드 - 스미맵", "삿포로시 지하철 구내도, 배리어프리 타운맵과 공원 화장실 동절기 안내로 겨울 이용 제한과 대체 동선을 확인합니다.", "삿포로에서는 지도 위치와 겨울 운영 여부를 따로 봅니다", [S.sapporoTransit, S.sapporoBarrier, S.sapporoWinter],
    ["삿포로는 적설과 동절기 운영 때문에 여름에 이용 가능했던 공원 화장실이나 지상 동선이 같은 방식으로 유지되지 않을 수 있습니다. 시가 공개한 동절기 화장실 안내와 지하철 구내도를 함께 확인해 실내 대체 동선을 남깁니다.", "배리어프리 타운맵 원문도 실제 현황이 다를 수 있으므로 시설에 직접 확인하라고 안내합니다. 스미맵은 자료 기준일을 숨기지 않고 현장 재확인을 같은 비중으로 표시합니다."],
    ["공원 화장실은 삿포로시 동절기 목록에서 폐쇄·개방 조건을 확인합니다.", "눈길 이동이 어렵다면 지하철 구내도의 엘리베이터와 실내 출구를 찾습니다.", "배리어프리 설비는 원문 기준일을 읽고 필요한 경우 시설에 직접 문의합니다.", "폭설·교통 장애가 있으면 공식 운행·방재정보를 우선합니다."],
    ["제설 상태와 통로 미끄럼 정도를 실시간으로 측정하지 않습니다.", "민간 시설 데이터 일부는 시유 시설 자료보다 오래될 수 있습니다.", "겨울 안전 판단은 시 당국·교통기관의 최신 공지를 따라야 합니다."], "sapporo"),

  city("cities/nagoya", "나고야역 배리어프리·화장실 공식 가이드 - 스미맵", "나고야시 배리어프리 외출 내비와 교통국 화장실 안내, 한국어 생활 가이드로 환승 설비와 공공 창구를 확인합니다.", "나고야에서는 환승 경로와 다기능 화장실 설비를 같이 봅니다", [S.nagoyaBarrier, S.nagoyaTransit, S.nagoyaLife],
    ["나고야시 배리어프리 외출 내비는 나고야역, 사카에, 가나야마의 환승 지도와 엘리베이터·배리어프리 화장실 정보를 제공합니다. 작성 연도가 표시된 지도는 현재 현장과 달라질 수 있으므로 출발 전 교통기관 최신 안내와 대조합니다.", "나고야시 교통국은 역별 일반·배리어프리 화장실 설비 현황을 별도로 제공합니다. 필요한 설비가 있으면 화장실 존재 여부만 보지 말고 오스토메이트·베이비시트 등 세부 항목을 확인합니다."],
    ["이용 노선과 도착 개찰을 확인한 뒤 공식 환승 지도를 엽니다.", "엘리베이터 경로와 필요한 화장실 설비가 같은 동선에 있는지 확인합니다.", "작성 시점이 오래된 PDF는 현장 공사 안내와 교통국 최신 페이지를 대조합니다.", "행정·생활 문의는 나고야시 한국어 생활 가이드에서 담당 창구를 찾습니다."],
    ["환승 지도 작성 뒤의 공사와 임시 통제를 즉시 반영하지 못할 수 있습니다.", "다기능 화장실의 현재 고장·혼잡·청결 상태를 보증하지 않습니다.", "스미맵 핀은 역사 안의 정확한 설비 좌표가 아닙니다."], "nagoya")
];

function source(authority, title, url, updated, scope) {
  return { authority, title, url, updated, scope };
}

function page(slug, title, description, h1, sources, intro, steps, limits, mapHref) {
  return { slug, title, description, h1, sources, intro, steps, limits, mapHref, type: "Article" };
}

function city(slug, title, description, h1, sources, intro, steps, limits, cityKey) {
  return page(slug, title, description, h1, sources, intro, steps, limits, `/?city=${cityKey}&utm_source=${cityKey}-city&utm_medium=internal&utm_campaign=map`);
}

function render(item) {
  const route = `/${item.slug}/`;
  const citations = item.sources.map((entry) => entry.url);
  const related = relatedLinks(item.slug);
  return `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(item.title)}</title>
    <meta name="description" content="${escapeHtml(item.description)}">
    <link rel="canonical" href="${siteUrl}${route}">
    <link rel="icon" href="/assets/icon.svg" type="image/svg+xml">
    <meta property="og:type" content="article">
    <meta property="og:site_name" content="스미맵">
    <meta property="og:title" content="${escapeHtml(item.title)}">
    <meta property="og:description" content="${escapeHtml(item.description)}">
    <meta property="og:url" content="${siteUrl}${route}">
    <meta name="google-adsense-account" content="ca-pub-7217591196020054">
    <link rel="alternate" type="application/rss+xml" title="스미맵 RSS" href="${siteUrl}/feed.xml">
    <link rel="stylesheet" href="/assets/styles.css?v=${styleVersion}">
    <script>
      if (location.hostname === "sumimap.com") {
        const ads = document.createElement("script");
        ads.async = true;
        ads.crossOrigin = "anonymous";
        ads.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7217591196020054";
        document.head.append(ads);
      }
    </script>
    <script type="application/ld+json">${JSON.stringify({
      "@context": "https://schema.org",
      "@type": item.type,
      headline: item.title,
      description: item.description,
      url: `${siteUrl}${route}`,
      inLanguage: "ko-KR",
      datePublished: checkedAt,
      dateModified: checkedAt,
      author: { "@type": "Organization", name: "스미맵 편집팀", url: `${siteUrl}/about/` },
      publisher: { "@type": "Organization", name: "스미맵" },
      citation: citations
    })}</script>
  </head>
  <body class="static-body">
    <main class="static-shell">
      <nav class="static-nav" aria-label="상단 탐색">
        <a class="brand" href="/"><span class="brand-mark">住</span><span><strong>스미맵</strong><small>일본 생활 확인 지도</small></span></a>
        <a href="${escapeHtml(item.mapHref)}">지도 열기</a>
      </nav>
      <section class="static-hero">
        <h1>${escapeHtml(item.h1)}</h1>
        <p>${escapeHtml(item.description)}</p>
      </section>
      <section class="static-content">
        <article class="static-section static-experience">
          <h2>이 페이지가 답하는 질문</h2>
          ${item.intro.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("\n          ")}
        </article>
        <article class="static-section">
          <h2>확인에 사용한 공식 원문</h2>
          <ul>
            ${item.sources.map((entry) => `<li><a href="${escapeHtml(entry.url)}">${escapeHtml(entry.authority)} · ${escapeHtml(entry.title)}</a><br>${escapeHtml(entry.scope)}<br><small>원문 갱신: ${escapeHtml(entry.updated)} · 스미맵 자료 대조일: ${checkedAt}</small></li>`).join("\n            ")}
          </ul>
          <p>자료 대조일은 링크와 핵심 범위를 다시 확인한 날입니다. 원문 기관의 데이터 갱신일이나 시설의 실제 변경일과 같은 뜻이 아닙니다.</p>
        </article>
        <article class="static-section">
          <h2>현장에서 확인하는 순서</h2>
          <ol>${item.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol>
          <p><a href="${escapeHtml(item.mapHref)}">이 기준을 적용해 지도 열기</a></p>
        </article>
        <article class="static-section">
          <h2>범위와 한계</h2>
          <ul>${item.limits.map((limit) => `<li>${escapeHtml(limit)}</li>`).join("")}</ul>
          <p>시설 운영자와 현장 직원의 안내가 이 문서보다 우선합니다. 재난·응급 상황에는 지역 당국과 공식 긴급전화 안내를 따르세요.</p>
        </article>
        <article class="static-section">
          <h2>업데이트와 정정</h2>
          <p>이 문서는 ${checkedAt}에 위 원문을 다시 대조해 전면 작성했습니다. 링크 변경, 폐쇄, 운영시간 차이 또는 설명 오류를 발견하면 <a href="https://github.com/wlstj86231-cloud/sumimap/issues/new">공개 정정 창구</a>에 원문 URL과 차이를 남겨주세요. 공개 창구에는 전화번호, 위치 기록, 예약번호 같은 개인정보를 적지 마세요.</p>
          <p><a href="/sources/">전체 공식 출처와 검수 방법</a> · <a href="/editorial/">편집 원칙</a> · <a href="/privacy/">개인정보 처리방침</a></p>
        </article>
        <article class="static-section">
          <h2>관련 가이드</h2>
          <div class="static-link-grid">${related.map((entry) => `<div class="static-route-card"><strong>${escapeHtml(entry.label)}</strong><p>${escapeHtml(entry.description)}</p><a href="${entry.href}">읽기</a></div>`).join("")}</div>
        </article>
      </section>
    </main>
  </body>
</html>`;
}

function relatedLinks(slug) {
  const links = {
    guide: [{ href: "/sources/", label: "공식 출처", description: "기관별 원문과 검수 날짜를 봅니다." }, { href: "/routes/", label: "상황별 가이드", description: "곤란한 상황에 맞는 확인 순서를 고릅니다." }, { href: "/cities/", label: "도시별 가이드", description: "도시별 지자체와 교통기관 원문을 봅니다." }],
    routes: [{ href: "/routes/battery/", label: "충전", description: "대여·반납 가능 상태를 확인합니다." }, { href: "/routes/restroom/", label: "화장실", description: "공공시설과 개찰·층을 확인합니다." }, { href: "/routes/first-day/", label: "일본 첫날", description: "정부 생활 포털과 공식 창구를 저장합니다." }],
    cities: [{ href: "/cities/tokyo/", label: "도쿄", description: "도 공식 통합지도와 역 구내도를 봅니다." }, { href: "/cities/osaka/", label: "오사카", description: "시 공중화장실과 지하 동선을 봅니다." }, { href: "/cities/sapporo/", label: "삿포로", description: "겨울 운영과 배리어프리 정보를 봅니다." }]
  };
  if (links[slug]) return links[slug];
  if (slug.startsWith("cities/")) return [{ href: "/cities/", label: "다른 도시", description: "6개 도시의 공식 자료 범위를 비교합니다." }, { href: "/routes/station/", label: "역 동선", description: "운영사·개찰·층 확인 순서를 봅니다." }, { href: "/sources/", label: "전체 출처", description: "모든 공식 원문과 대조일을 봅니다." }];
  return [{ href: "/routes/", label: "다른 상황", description: "상황에 맞는 확인 순서를 고릅니다." }, { href: "/cities/", label: "도시별 확인", description: "지자체와 교통기관 원문을 봅니다." }, { href: "/sources/", label: "전체 출처", description: "공식 원문과 검수 방법을 봅니다." }];
}

function escapeHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

for (const item of pages) {
  const directory = path.join(siteRoot, ...item.slug.split("/"));
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(path.join(directory, "index.html"), render(item), "utf8");
}

console.log(`Generated ${pages.length} source-backed core pages.`);
