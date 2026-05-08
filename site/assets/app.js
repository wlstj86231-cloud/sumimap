const cities = {
  tokyo: { label: "도쿄", center: [35.6812, 139.7671], zoom: 12 },
  osaka: { label: "오사카", center: [34.6937, 135.5023], zoom: 12 },
  fukuoka: { label: "후쿠오카", center: [33.5902, 130.4017], zoom: 12 },
  kyoto: { label: "교토", center: [35.0116, 135.7681], zoom: 12 }
};

const categories = [
  { key: "all", label: "전체", emoji: "📍" },
  { key: "charge", label: "충전", emoji: "🔌" },
  { key: "restroom", label: "화장실", emoji: "🚻" },
  { key: "rest", label: "쉬기", emoji: "🪑" },
  { key: "korean", label: "한국어", emoji: "🇰🇷" },
  { key: "caution", label: "응대 불편", emoji: "⚠️" }
];

const scenarios = [
  { key: "battery", label: "배터리 5%", filter: "charge", icon: "battery-low", emoji: "🔌", hint: "콘센트와 허락 여부 먼저" },
  { key: "toilet", label: "화장실 급함", filter: "restroom", icon: "toilet", emoji: "🚻", hint: "단독 이용 가능성 확인" },
  { key: "rain", label: "비 피하기", filter: "rest", icon: "cloud-rain", emoji: "☔", hint: "잠깐 머물기 좋은 곳" },
  { key: "korean", label: "한국어 필요", filter: "korean", icon: "languages", emoji: "🇰🇷", hint: "한국어 대응 신호" },
  { key: "caution", label: "응대 조심", filter: "caution", icon: "triangle-alert", emoji: "⚠️", hint: "불편 제보가 있는 곳" }
];

const reportTags = [
  { key: "charge", label: "충전 가능", emoji: "🔌" },
  { key: "permission", label: "직원 허락 필요", emoji: "🙋" },
  { key: "restroom", label: "화장실 가능", emoji: "🚻" },
  { key: "restroom-caution", label: "화장실만 이용 애매", emoji: "⚠️" },
  { key: "rest", label: "잠깐 쉬기 좋음", emoji: "🪑" },
  { key: "long-stay", label: "장시간 비추천", emoji: "⏱️" },
  { key: "wifi", label: "와이파이", emoji: "📶" },
  { key: "korean", label: "한국어 대응", emoji: "🇰🇷" },
  { key: "caution", label: "응대 불편", emoji: "⚠️", danger: true },
  { key: "rain", label: "비 피하기 좋음", emoji: "☔" }
];

const allowedReportLabels = new Set(reportTags.map((tag) => tag.label));

const signalForReportTag = {
  "충전 가능": "charge",
  "직원 허락 필요": "charge",
  "화장실 가능": "restroom",
  "화장실만 이용 애매": "restroom",
  "잠깐 쉬기 좋음": "rest",
  "장시간 비추천": "rest",
  "한국어 대응": "korean",
  "응대 불편": "caution",
  "비 피하기 좋음": "rest"
};

const filterThresholds = {
  charge: 8,
  restroom: 8,
  rest: 8,
  korean: 8,
  caution: 3
};

const places = [
  {
    id: "tokyo-shinjuku-east",
    name: "신주쿠 동쪽 카페형 스팟",
    area: "도쿄 신주쿠",
    city: "tokyo",
    kind: "카페/식당",
    lat: 35.6912,
    lng: 139.7044,
    category: "charge",
    trust: "자주 확인됨",
    tags: ["충전 가능", "와이파이", "혼자 쉬기 좋음"],
    signals: { charge: 18, restroom: 7, rest: 12, korean: 1, caution: 0 },
    walk: "도보 6분",
    lastSeen: "오늘 확인",
    crowd: "점심 혼잡",
    bestFor: "배터리 부족할 때 1순위",
    watchout: "콘센트 좌석은 먼저 확인하고 주문하는 편이 안전해요.",
    notes: ["혼잡 시간에는 장시간 체류가 부담스러울 수 있어요.", "콘센트는 좌석마다 다르니 주문 전에 확인하는 편이 좋아요."]
  },
  {
    id: "tokyo-ueno-public",
    name: "우에노역 근처 공공 편의 스팟",
    area: "도쿄 우에노",
    city: "tokyo",
    kind: "공공시설",
    lat: 35.7138,
    lng: 139.7772,
    category: "restroom",
    trust: "이용 가능성 높음",
    tags: ["화장실 가능", "잠깐 쉬기 좋음", "비 피하기 좋음"],
    signals: { charge: 2, restroom: 21, rest: 10, korean: 0, caution: 1 },
    walk: "도보 4분",
    lastSeen: "최근 1주",
    crowd: "낮 시간 보통",
    bestFor: "화장실이 급할 때",
    watchout: "늦은 시간에는 주변 동선과 운영 시간을 같이 확인해요.",
    notes: ["화장실 동선이 편한 편이라는 제보가 많아요.", "늦은 시간에는 주변 분위기를 확인하고 이동하는 편이 좋아요."]
  },
  {
    id: "tokyo-ikebukuro-rest",
    name: "이케부쿠로 북쪽 대기 스팟",
    area: "도쿄 이케부쿠로",
    city: "tokyo",
    kind: "실내 휴식",
    lat: 35.7311,
    lng: 139.7102,
    category: "rest",
    trust: "제보 있음",
    tags: ["잠깐 쉬기 좋음", "비 피하기 좋음"],
    signals: { charge: 1, restroom: 4, rest: 8, korean: 0, caution: 0 },
    walk: "도보 8분",
    lastSeen: "최근 1개월",
    crowd: "저녁 혼잡",
    bestFor: "약속 전 10분 대기",
    watchout: "매장 이용 조건은 현장 안내를 우선해야 해요.",
    notes: ["짧게 대기하기 좋다는 제보가 있어요.", "매장 이용 조건은 현장 안내를 우선해야 해요."]
  },
  {
    id: "tokyo-shinokubo-korean",
    name: "신오쿠보 한국어 대응 가능 구역",
    area: "도쿄 신오쿠보",
    city: "tokyo",
    kind: "상점가",
    lat: 35.7008,
    lng: 139.7003,
    category: "korean",
    trust: "자주 확인됨",
    tags: ["한국어 대응", "혼자 이용 편함", "화장실 가능"],
    signals: { charge: 5, restroom: 9, rest: 6, korean: 24, caution: 0 },
    walk: "도보 5분",
    lastSeen: "오늘 확인",
    crowd: "주말 혼잡",
    bestFor: "일본어가 막힐 때",
    watchout: "가게마다 한국어 대응 정도가 달라 상세 태그를 같이 봐요.",
    notes: ["한국어 메뉴나 안내가 있는 곳이 많다는 제보가 모여 있어요.", "가게별 조건 차이가 커서 상세 태그 확인이 필요해요."]
  },
  {
    id: "tokyo-shibuya-caution",
    name: "시부야 혼잡 구역 주의 스팟",
    area: "도쿄 시부야",
    city: "tokyo",
    kind: "혼잡 상권",
    lat: 35.6595,
    lng: 139.7005,
    category: "caution",
    trust: "주의 제보 있음",
    tags: ["응대 불편", "장시간 비추천", "직원 허락 필요"],
    signals: { charge: 3, restroom: 2, rest: 2, korean: 0, caution: 5 },
    walk: "도보 7분",
    lastSeen: "최근 1주",
    crowd: "상시 혼잡",
    bestFor: "방문 전 분위기 확인",
    watchout: "응대 불편은 단정이 아니라 주의 신호예요. 반대 경험도 같이 반영돼요.",
    notes: ["응대 불편 제보가 여러 건 있어요. 단정 표현 대신 방문 전 확인 신호로만 표시해요.", "반대 경험이 있으면 같은 장소에서 '문제없었음' 신호로 균형을 맞출 수 있어요."]
  },
  {
    id: "osaka-namba-charge",
    name: "난바역 근처 충전 확인 스팟",
    area: "오사카 난바",
    city: "osaka",
    kind: "카페/식당",
    lat: 34.6657,
    lng: 135.5019,
    category: "charge",
    trust: "제보 있음",
    tags: ["충전 가능", "직원 허락 필요", "와이파이"],
    signals: { charge: 10, restroom: 3, rest: 4, korean: 1, caution: 0 },
    walk: "도보 6분",
    lastSeen: "최근 1주",
    crowd: "오후 보통",
    bestFor: "난바 이동 전 충전",
    watchout: "주문 없이 충전만 하는 이용은 피하는 편이 좋아요.",
    notes: ["콘센트 좌석이 제한적이라는 제보가 있어요.", "주문 없이 충전만 하는 이용은 피하는 편이 좋아요."]
  },
  {
    id: "fukuoka-hakata-restroom",
    name: "하카타역 주변 화장실 확인 스팟",
    area: "후쿠오카 하카타",
    city: "fukuoka",
    kind: "역 주변",
    lat: 33.5904,
    lng: 130.4206,
    category: "restroom",
    trust: "이용 가능성 높음",
    tags: ["화장실 가능", "잠깐 쉬기 좋음"],
    signals: { charge: 1, restroom: 16, rest: 8, korean: 0, caution: 0 },
    walk: "도보 3분",
    lastSeen: "최근 1주",
    crowd: "출퇴근 혼잡",
    bestFor: "하카타역 이동 중 급할 때",
    watchout: "시설 운영 시간은 계절과 행사에 따라 달라질 수 있어요.",
    notes: ["역 주변 이동 중 급할 때 확인하기 좋은 위치예요.", "시설 운영 시간은 계절과 행사에 따라 달라질 수 있어요."]
  },
  {
    id: "kyoto-station-rest",
    name: "교토역 대기와 휴식 스팟",
    area: "교토역",
    city: "kyoto",
    kind: "역 주변",
    lat: 34.9859,
    lng: 135.7588,
    category: "rest",
    trust: "제보 있음",
    tags: ["잠깐 쉬기 좋음", "비 피하기 좋음", "화장실 가능"],
    signals: { charge: 2, restroom: 11, rest: 13, korean: 0, caution: 0 },
    walk: "도보 5분",
    lastSeen: "최근 1개월",
    crowd: "성수기 혼잡",
    bestFor: "짐이 많을 때 동선 정리",
    watchout: "관광 성수기에는 혼잡도가 빠르게 올라가요.",
    notes: ["짐이 많을 때 잠깐 동선을 정리하기 좋다는 제보가 있어요.", "관광 성수기에는 혼잡도가 빠르게 올라가요."]
  },
  {
    id: "tokyo-yaesu-restroom",
    name: "도쿄역 야에스 화장실 확인 스팟",
    area: "도쿄역 야에스",
    city: "tokyo",
    kind: "역 주변",
    lat: 35.6805,
    lng: 139.7703,
    category: "restroom",
    trust: "이용 가능성 높음",
    tags: ["화장실 가능", "비 피하기 좋음", "잠깐 쉬기 좋음"],
    signals: { charge: 3, restroom: 19, rest: 9, korean: 1, caution: 0 },
    walk: "도보 4분",
    lastSeen: "최근 1주",
    crowd: "출퇴근 혼잡",
    bestFor: "도쿄역 환승 중 급할 때",
    watchout: "역 내부 동선이 복잡해서 출구와 층을 먼저 확인하는 편이 좋아요.",
    notes: ["환승 중 화장실과 실내 대기 동선을 같이 확인하기 좋은 구역이에요.", "러시아워에는 이동 시간이 예상보다 길어질 수 있어요."]
  },
  {
    id: "tokyo-akihabara-charge",
    name: "아키하바라 전자상가 충전 후보 스팟",
    area: "도쿄 아키하바라",
    city: "tokyo",
    kind: "상점가",
    lat: 35.6984,
    lng: 139.7730,
    category: "charge",
    trust: "제보 있음",
    tags: ["충전 가능", "와이파이", "직원 허락 필요"],
    signals: { charge: 13, restroom: 4, rest: 6, korean: 1, caution: 1 },
    walk: "도보 6분",
    lastSeen: "최근 1개월",
    crowd: "주말 혼잡",
    bestFor: "전자기기 배터리와 데이터 정리",
    watchout: "콘센트가 보이더라도 직원 확인 없이 사용하는 것은 피하는 편이 안전해요.",
    notes: ["기기 충전 수요가 많은 생활권이라 충전 후보 신호를 따로 모아두었어요.", "매장별 정책 차이가 크니 주문 전 확인이 필요해요."]
  },
  {
    id: "tokyo-shinagawa-rain",
    name: "시나가와역 비 피하기 스팟",
    area: "도쿄 시나가와",
    city: "tokyo",
    kind: "실내 이동",
    lat: 35.6285,
    lng: 139.7388,
    category: "rest",
    trust: "자주 확인됨",
    tags: ["비 피하기 좋음", "잠깐 쉬기 좋음", "화장실 가능"],
    signals: { charge: 2, restroom: 10, rest: 17, korean: 0, caution: 0 },
    walk: "도보 5분",
    lastSeen: "최근 1주",
    crowd: "평일 저녁 혼잡",
    bestFor: "비 오는 날 약속 전 대기",
    watchout: "통로형 공간은 오래 머무르기보다 짧게 동선을 정리하는 용도로 보는 편이 좋아요.",
    notes: ["비가 올 때 실내로 이동하며 짐을 정리하기 좋은 신호가 있어요.", "퇴근 시간에는 앉을 자리가 빠르게 줄어들 수 있어요."]
  },
  {
    id: "tokyo-takadanobaba-korean",
    name: "다카다노바바 한국어 생활권 스팟",
    area: "도쿄 다카다노바바",
    city: "tokyo",
    kind: "생활 상권",
    lat: 35.7123,
    lng: 139.7035,
    category: "korean",
    trust: "제보 있음",
    tags: ["한국어 대응", "혼자 이용 편함", "와이파이"],
    signals: { charge: 6, restroom: 5, rest: 7, korean: 14, caution: 0 },
    walk: "도보 7분",
    lastSeen: "최근 1개월",
    crowd: "저녁 보통",
    bestFor: "일본어 설명이 부담스러울 때",
    watchout: "한국어 가능 여부는 시간대와 직원에 따라 달라질 수 있어요.",
    notes: ["유학생 생활권 제보가 쌓이기 쉬운 구역이에요.", "한국어 메뉴와 실제 한국어 응대는 별도로 확인하는 편이 좋아요."]
  },
  {
    id: "osaka-umeda-underground-rest",
    name: "우메다 지하상가 대기 스팟",
    area: "오사카 우메다",
    city: "osaka",
    kind: "지하상가",
    lat: 34.7025,
    lng: 135.4959,
    category: "rest",
    trust: "자주 확인됨",
    tags: ["비 피하기 좋음", "잠깐 쉬기 좋음", "화장실 가능"],
    signals: { charge: 4, restroom: 14, rest: 20, korean: 1, caution: 0 },
    walk: "도보 5분",
    lastSeen: "오늘 확인",
    crowd: "상시 혼잡",
    bestFor: "비 오거나 더울 때 실내 대기",
    watchout: "지하 동선이 복잡해 길찾기를 켠 상태로 이동하는 편이 좋아요.",
    notes: ["우메다는 비 피하기와 화장실 동선을 함께 보는 사용자가 많아요.", "초행이면 출구 번호를 먼저 확인해야 덜 헤맵니다."]
  },
  {
    id: "osaka-tsuruhashi-korean",
    name: "쓰루하시 한국어 대응 생활권",
    area: "오사카 쓰루하시",
    city: "osaka",
    kind: "상점가",
    lat: 34.6651,
    lng: 135.5306,
    category: "korean",
    trust: "자주 확인됨",
    tags: ["한국어 대응", "혼자 이용 편함", "화장실 가능"],
    signals: { charge: 4, restroom: 8, rest: 7, korean: 22, caution: 0 },
    walk: "도보 6분",
    lastSeen: "최근 1주",
    crowd: "주말 혼잡",
    bestFor: "한국어 메뉴와 생활 상권 확인",
    watchout: "가게마다 분위기와 응대 가능 언어가 다르니 상세 신호를 같이 봐요.",
    notes: ["한국인 방문자가 많은 생활권이라 한국어 신호를 따로 모아두기 좋습니다.", "혼잡 시간에는 오래 머무르기보다 목적지를 정하고 움직이는 편이 좋아요."]
  },
  {
    id: "osaka-tennoji-restroom",
    name: "텐노지 주변 화장실 확인 스팟",
    area: "오사카 텐노지",
    city: "osaka",
    kind: "역 주변",
    lat: 34.6465,
    lng: 135.5133,
    category: "restroom",
    trust: "이용 가능성 높음",
    tags: ["화장실 가능", "잠깐 쉬기 좋음"],
    signals: { charge: 2, restroom: 15, rest: 8, korean: 0, caution: 0 },
    walk: "도보 4분",
    lastSeen: "최근 1주",
    crowd: "오후 혼잡",
    bestFor: "공원·상업시설 이동 전 확인",
    watchout: "행사일에는 주변 화장실 대기 시간이 길어질 수 있어요.",
    notes: ["텐노지는 관광 동선과 생활 동선이 겹쳐 급한 상황 제보가 쌓이기 쉬워요.", "혼잡일에는 가까운 곳만 보지 말고 두 번째 후보도 같이 저장해두면 좋아요."]
  },
  {
    id: "osaka-shinimamiya-caution",
    name: "신이마미야 이동 전 주의 스팟",
    area: "오사카 신이마미야",
    city: "osaka",
    kind: "역 주변",
    lat: 34.6500,
    lng: 135.5007,
    category: "caution",
    trust: "주의 제보 있음",
    tags: ["응대 불편", "장시간 비추천", "비 피하기 좋음"],
    signals: { charge: 1, restroom: 3, rest: 3, korean: 0, caution: 4 },
    walk: "도보 8분",
    lastSeen: "최근 1개월",
    crowd: "야간 주의",
    bestFor: "밤 이동 전 분위기 확인",
    watchout: "응대 불편과 야간 분위기 신호는 단정이 아니라 이동 전 참고 신호로만 봐요.",
    notes: ["밤 시간 이동 전에는 밝은 큰길과 역 동선을 우선하는 편이 안전해요.", "반대 경험 제보가 쌓이면 주의 신호는 약해질 수 있어요."]
  },
  {
    id: "fukuoka-tenjin-charge",
    name: "텐진 중심가 충전 확인 스팟",
    area: "후쿠오카 텐진",
    city: "fukuoka",
    kind: "상업시설",
    lat: 33.5908,
    lng: 130.3991,
    category: "charge",
    trust: "제보 있음",
    tags: ["충전 가능", "와이파이", "잠깐 쉬기 좋음"],
    signals: { charge: 12, restroom: 7, rest: 9, korean: 1, caution: 0 },
    walk: "도보 5분",
    lastSeen: "최근 1주",
    crowd: "주말 혼잡",
    bestFor: "쇼핑 중 배터리 회복",
    watchout: "충전 가능 좌석은 제한적일 수 있어요.",
    notes: ["텐진은 이동 전 충전과 화장실을 동시에 확인하려는 사용자가 많아요.", "주말에는 오래 앉을 수 있는 자리가 빨리 없어질 수 있어요."]
  },
  {
    id: "fukuoka-nakasu-rain",
    name: "나카스 비 피하기 확인 스팟",
    area: "후쿠오카 나카스",
    city: "fukuoka",
    kind: "실내 대기",
    lat: 33.5929,
    lng: 130.4068,
    category: "rest",
    trust: "제보 있음",
    tags: ["비 피하기 좋음", "잠깐 쉬기 좋음", "장시간 비추천"],
    signals: { charge: 1, restroom: 5, rest: 10, korean: 0, caution: 1 },
    walk: "도보 7분",
    lastSeen: "최근 1개월",
    crowd: "저녁 혼잡",
    bestFor: "비 올 때 짧게 동선 정리",
    watchout: "야간에는 혼잡과 호객 분위기를 함께 확인하는 편이 좋아요.",
    notes: ["비를 피하면서 다음 이동 경로를 정리하기 좋은 신호가 있어요.", "장시간 머무르기보다 짧은 대기 용도로 보는 편이 맞습니다."]
  },
  {
    id: "fukuoka-hakata-korean",
    name: "하카타 한국어 안내 후보 스팟",
    area: "후쿠오카 하카타",
    city: "fukuoka",
    kind: "역 주변",
    lat: 33.5898,
    lng: 130.4214,
    category: "korean",
    trust: "제보 있음",
    tags: ["한국어 대응", "혼자 이용 편함", "화장실 가능"],
    signals: { charge: 3, restroom: 9, rest: 5, korean: 12, caution: 0 },
    walk: "도보 4분",
    lastSeen: "최근 1개월",
    crowd: "낮 시간 보통",
    bestFor: "하카타역 주변 한국어 안내 확인",
    watchout: "한국어 안내판과 실제 대화 가능 여부는 구분해서 봐야 해요.",
    notes: ["공항과 역 이동이 잦은 구역이라 한국어 안내 신호가 유용해요.", "직원 응대 가능 언어는 시간대별로 달라질 수 있어요."]
  },
  {
    id: "kyoto-shijo-restroom",
    name: "시조가와라마치 화장실 확인 스팟",
    area: "교토 시조가와라마치",
    city: "kyoto",
    kind: "상업시설",
    lat: 35.0037,
    lng: 135.7687,
    category: "restroom",
    trust: "이용 가능성 높음",
    tags: ["화장실 가능", "비 피하기 좋음", "잠깐 쉬기 좋음"],
    signals: { charge: 2, restroom: 17, rest: 11, korean: 0, caution: 0 },
    walk: "도보 5분",
    lastSeen: "최근 1주",
    crowd: "관광 혼잡",
    bestFor: "관광 동선 중 급한 화장실 확인",
    watchout: "관광객이 몰리는 시간에는 가까운 후보 두 곳을 같이 보는 편이 좋아요.",
    notes: ["교토 중심 상권은 화장실과 비 피하기 신호를 같이 보는 일이 많아요.", "계절 행사 기간에는 평소보다 대기 시간이 길어질 수 있어요."]
  },
  {
    id: "kyoto-gion-caution",
    name: "기온 주변 응대 조심 스팟",
    area: "교토 기온",
    city: "kyoto",
    kind: "관광 상권",
    lat: 35.0030,
    lng: 135.7751,
    category: "caution",
    trust: "주의 제보 있음",
    tags: ["응대 불편", "장시간 비추천", "직원 허락 필요"],
    signals: { charge: 1, restroom: 2, rest: 2, korean: 0, caution: 3 },
    walk: "도보 8분",
    lastSeen: "최근 1개월",
    crowd: "저녁 혼잡",
    bestFor: "관광지 매너와 이용 조건 확인",
    watchout: "응대 불편은 낙인이 아니라 방문 전 조심해서 확인할 신호예요.",
    notes: ["관광지에서는 촬영, 대기, 이용 조건을 현장 안내에 맞추는 편이 안전해요.", "반대 경험 제보가 쌓이면 주의 신호는 낮아질 수 있어요."]
  }
];

const state = {
  filter: "all",
  query: "",
  selectedId: places[0].id,
  activePanel: "near",
  sheetMode: "collapsed",
  activeScenario: "",
  userPosition: null,
  saved: normalizeSaved(readJson("sumimap:saved", [])),
  recent: normalizeRecent(readJson("sumimap:recent", [])),
  reports: normalizeReports(readJson("sumimap:reports", []))
};

const placesById = new Map(places.map((place) => [place.id, place]));
const validPlaceIds = new Set(placesById.keys());
const categoriesByKey = new Map(categories.map((category) => [category.key, category]));
const categoryEmojis = new Map(categories.map((category) => [category.key, category.emoji]));
const scenariosByKey = new Map(scenarios.map((scenario) => [scenario.key, scenario]));
const reportTagsByKey = new Map(reportTags.map((tag) => [tag.key, tag]));
const reportTagsByLabel = new Map(reportTags.map((tag) => [tag.label, tag]));

const sheet = document.querySelector("#sheet");
const toast = document.querySelector("#toast");
const statusPill = document.querySelector("#statusPill");
const mapQuickRail = document.querySelector("#mapQuickRail");
const locateButton = document.querySelector("#locateButton");
const searchPanel = document.querySelector("#searchPanel");
const searchToggle = document.querySelector("#searchToggle");
const searchClear = document.querySelector("#searchClear");
const placeSearch = document.querySelector("#placeSearch");

let map;
let markerLayer;
let userLocationLayer;
const markers = new Map();
const markerClassNames = new Map();
let reportVersion = 0;
let visibleReportsCache = null;
let derivedPlaceCache = new Map();
let filteredPlacesCacheKey = "";
let filteredPlacesCache = [];
let started = false;
let sheetPointerStartY = null;
let ignoreNextSheetToggleClick = false;

startWhenReady();

function startWhenReady() {
  if (started) return;
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startWhenReady, { once: true });
    return;
  }
  if (!window.L) {
    window.setTimeout(startWhenReady, 16);
    return;
  }
  started = true;
  init();
}

function init() {
  bootMap();
  bindEvents();
  renderMapQuickRail();
  renderSheet();
  renderMarkers();
  refreshStatus();
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }
}

function bootMap() {
  map = L.map("map", {
    zoomControl: false,
    attributionControl: true,
    fadeAnimation: false,
    zoomAnimation: false,
    markerZoomAnimation: false
  }).setView(cities.tokyo.center, cities.tokyo.zoom);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap",
    updateWhenIdle: true,
    updateWhenZooming: false,
    keepBuffer: 1
  }).addTo(map);

  markerLayer = L.layerGroup().addTo(map);
}

function bindEvents() {
  document.querySelectorAll(".nav-button").forEach((button) => {
    button.addEventListener("click", () => {
      setPanel(button.dataset.action);
    });
  });

  searchToggle.addEventListener("click", () => {
    searchPanel.hidden = !searchPanel.hidden;
    if (!searchPanel.hidden) placeSearch.focus();
  });

  locateButton.addEventListener("click", locateUser);

  mapQuickRail.addEventListener("click", (event) => {
    const button = event.target.closest("[data-quick-scenario]");
    if (!button) return;
    applyScenario(button.dataset.quickScenario);
  });

  sheet.addEventListener("pointerdown", (event) => {
    if (!event.target.closest("[data-sheet-toggle]")) return;
    sheetPointerStartY = event.clientY;
  });

  sheet.addEventListener("pointerup", (event) => {
    if (sheetPointerStartY === null) return;

    const deltaY = event.clientY - sheetPointerStartY;
    sheetPointerStartY = null;
    if (Math.abs(deltaY) < 28) return;

    setSheetMode(deltaY > 0 ? "collapsed" : "expanded");
    ignoreNextSheetToggleClick = true;
    window.setTimeout(() => {
      ignoreNextSheetToggleClick = false;
    }, 0);
  });

  sheet.addEventListener("pointercancel", () => {
    sheetPointerStartY = null;
  });

  placeSearch.addEventListener("input", (event) => {
    state.query = event.target.value.trim();
    updateSearchClear();
    syncSelectedWithFiltered();
    renderSheet();
    renderMarkers();
    refreshStatus();
  });

  searchClear.addEventListener("click", () => {
    state.query = "";
    placeSearch.value = "";
    updateSearchClear();
    syncSelectedWithFiltered();
    renderSheet();
    renderMarkers();
    refreshStatus();
    placeSearch.focus();
  });

  document.querySelectorAll("[data-city]").forEach((button) => {
    button.addEventListener("click", () => {
      const city = cities[button.dataset.city];
      if (!city) return;
      map.setView(city.center, city.zoom);
      showToast(`${city.label} 중심으로 이동했어.`);
      searchPanel.hidden = true;
    });
  });

  sheet.addEventListener("submit", (event) => {
    const form = event.target.closest("#reportForm");
    if (!form) return;
    event.preventDefault();
    submitReport(form);
  });

  sheet.addEventListener("click", (event) => {
    const sheetToggle = event.target.closest("[data-sheet-toggle]");
    if (sheetToggle) {
      if (!ignoreNextSheetToggleClick) toggleSheetMode();
      ignoreNextSheetToggleClick = false;
      return;
    }

    const placeButton = event.target.closest("[data-place-id]");
    if (placeButton) {
      selectPlace(placeButton.dataset.placeId, true);
      return;
    }

    const filterButton = event.target.closest("[data-filter]");
    if (filterButton) {
      state.filter = filterButton.dataset.filter;
      state.activeScenario = "";
      syncSelectedWithFiltered();
      renderMapQuickRail();
      renderSheet();
      renderMarkers();
      refreshStatus();
      return;
    }

    const scenarioButton = event.target.closest("[data-scenario]");
    if (scenarioButton) {
      applyScenario(scenarioButton.dataset.scenario);
      return;
    }

    const resetButton = event.target.closest("[data-reset-context]");
    if (resetButton) {
      resetContext();
      return;
    }

    const locationClearButton = event.target.closest("[data-clear-location]");
    if (locationClearButton) {
      clearLocationContext();
      return;
    }

    const reportOpenButton = event.target.closest("[data-open-report]");
    if (reportOpenButton) {
      setPanel("report");
      return;
    }

    const saveButton = event.target.closest("[data-save]");
    if (saveButton) {
      toggleSave(saveButton.dataset.save);
      return;
    }

    const reportChip = event.target.closest("[data-report-tag]");
    if (reportChip) {
      reportChip.classList.toggle("is-selected");
      return;
    }

    const form = event.target.closest("#reportForm");
    const submit = event.target.closest("[data-submit-report]");
    if (form && submit) {
      event.preventDefault();
      submitReport(form);
      return;
    }

    const reportVote = event.target.closest("[data-report-vote]");
    if (reportVote) {
      voteReport(reportVote.dataset.reportId, reportVote.dataset.reportVote);
    }
  });
}

function setPanel(panel) {
  state.activePanel = panel;
  state.sheetMode = panel === "near" ? "collapsed" : "expanded";
  document.querySelectorAll(".nav-button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.action === panel);
  });

  if (panel === "near") {
    const place = getSelectedPlace();
    if (place) map.setView([place.lat, place.lng], 14);
  }

  renderSheet();
}

function toggleSheetMode() {
  setSheetMode(state.sheetMode === "collapsed" ? "expanded" : "collapsed");
}

function setSheetMode(mode) {
  state.sheetMode = mode === "collapsed" ? "collapsed" : "expanded";
  syncSheetMode();
  if (map) {
    window.setTimeout(() => map.invalidateSize(), 220);
  }
}

function syncSheetMode() {
  const isCollapsed = state.activePanel === "near" && state.sheetMode === "collapsed";
  sheet.classList.toggle("is-collapsed", isCollapsed);
  sheet.classList.toggle("is-expanded", !isCollapsed);
}

function renderSheet() {
  if (state.activePanel === "filters") {
    sheet.innerHTML = renderFilters();
  } else if (state.activePanel === "report") {
    sheet.innerHTML = renderReport();
  } else if (state.activePanel === "saved") {
    sheet.innerHTML = renderSaved();
  } else if (state.activePanel === "guide") {
    sheet.innerHTML = renderGuide();
  } else {
    sheet.innerHTML = renderNearby();
  }
  syncSheetMode();
}

function renderNearby() {
  const list = getFilteredPlaces();
  const place = list.find((item) => item.id === state.selectedId) || null;

  return `
    <button class="sheet-grip" type="button" data-sheet-toggle aria-label="Toggle panel"></button>
    <div class="sheet-head" data-sheet-toggle>
      <div>
        <h1>지금 확인할 생활 스팟</h1>
        <p>충전, 화장실, 쉬기, 한국어 대응, 응대 불편 신호를 한 번에 봐요.</p>
      </div>
      <span class="compact-stat">${list.length}곳</span>
    </div>
    ${renderScenarioRail()}
    <div class="filter-row">
      ${categories.map((item) => filterChip(item)).join("")}
    </div>
    ${renderContextTools()}
    ${place ? renderPlaceDetail(place) : renderEmptyState()}
    ${list.length ? `<div class="place-list">${list.map((item) => renderPlaceCard(item)).join("")}</div>` : ""}
  `;
}

function renderFilters() {
  return `
    <button class="sheet-grip" type="button" data-sheet-toggle aria-label="Toggle panel"></button>
    <div class="sheet-head" data-sheet-toggle>
      <div>
        <h2>필터</h2>
        <p>상황별로 빠르게 좁혀요. 응대 불편은 낙인이 아니라 최근 제보 신호로만 봐요.</p>
      </div>
    </div>
    ${renderScenarioRail()}
    <div class="filter-row">
      ${categories.map((item) => filterChip(item)).join("")}
    </div>
    ${renderContextTools()}
    <ul class="note-list">
      <li>충전은 콘센트 위치와 직원 허락 여부를 같이 봐야 정확해요.</li>
      <li>화장실은 단독 이용 가능 여부가 장소마다 달라요.</li>
      <li>응대 불편은 1건으로 공개하지 않고 반복 신호일 때만 약하게 표시하는 전제로 설계했어요.</li>
    </ul>
  `;
}

function renderReport() {
  const place = getSelectedPlace();
  const visibleReports = getVisibleReports();
  return `
    <button class="sheet-grip" type="button" data-sheet-toggle aria-label="Toggle panel"></button>
    <div class="sheet-head" data-sheet-toggle>
      <div>
        <h2>제보하기</h2>
        <p>제보는 바로 지도에 반영돼요. 허위로 보이면 다른 사람이 허위 의심을 눌러 신호를 밀어낼 수 있어요.</p>
      </div>
      <span class="compact-stat">반영 ${visibleReports.length}</span>
    </div>
    <form class="report-form" id="reportForm">
      <div class="form-section">
        <h3>장소</h3>
        <select class="mini-field" name="placeId" aria-label="제보할 장소">
          ${places.map((item) => `<option value="${item.id}" ${item.id === place?.id ? "selected" : ""}>${item.name}</option>`).join("")}
        </select>
      </div>
      <div class="form-section">
        <h3>확인한 내용</h3>
        <p>해당되는 버튼만 눌러요. 응대 불편은 단정이 아니라 방문자 주의 신호로 바로 반영돼요.</p>
        <div class="report-grid">
          ${reportTags.map((tag) => `
            <button type="button" class="chip report-chip ${tag.danger ? "danger" : ""}" data-report-tag="${escapeAttr(tag.key)}" aria-label="${escapeAttr(tag.label)}">
              <span class="report-emoji" aria-hidden="true">${tag.emoji}</span>
              <span>${tag.label}</span>
            </button>
          `).join("")}
        </div>
      </div>
      <div class="form-section">
        <h3>방문 시점</h3>
        <select class="mini-field" name="recency" aria-label="방문 시점">
          <option value="today">오늘</option>
          <option value="week">최근 1주일</option>
          <option value="month">최근 1개월</option>
          <option value="old">이전 기억</option>
        </select>
      </div>
      <button class="primary-button" type="submit" data-submit-report>
        ${icon("send")}
        바로 제보
      </button>
    </form>
  `;
}

function renderSaved() {
  const savedPlaces = places.filter((place) => state.saved.includes(place.id));
  const recentPlaces = state.recent
    .map((id) => placesById.get(id))
    .filter((place) => place && !state.saved.includes(place.id))
    .slice(0, 6);
  return `
    <button class="sheet-grip" type="button" data-sheet-toggle aria-label="Toggle panel"></button>
    <div class="sheet-head" data-sheet-toggle>
      <div>
        <h2>저장한 곳</h2>
        <p>저장한 곳과 방금 확인한 곳을 빠르게 다시 열어요.</p>
      </div>
      <span class="compact-stat">${savedPlaces.length}곳</span>
    </div>
    <div class="place-section-title">저장한 곳</div>
    <div class="place-list compact-list">
      ${savedPlaces.length ? savedPlaces.map((item) => renderPlaceCard(item)).join("") : `<div class="place-card"><h3>아직 저장한 장소가 없어요</h3><p>장소 상세에서 저장을 누르면 여기에 모여요.</p></div>`}
    </div>
    <div class="place-section-title">최근 본 곳</div>
    <div class="place-list compact-list">
      ${recentPlaces.length ? recentPlaces.map((item) => renderPlaceCard(item)).join("") : `<div class="place-card"><h3>최근 확인한 장소가 없어요</h3><p>지도를 누르거나 장소 카드를 열면 자동으로 기록돼요.</p></div>`}
    </div>
  `;
}

function renderGuide() {
  return `
    <button class="sheet-grip" type="button" data-sheet-toggle aria-label="Toggle panel"></button>
    <div class="sheet-head" data-sheet-toggle>
      <div>
        <h2>스미맵 기준</h2>
        <p>일본 생활 중 곤란한 순간을 빠르게 피하기 위한 한국어 지도예요.</p>
      </div>
    </div>
    <ul class="note-list">
      <li>응대 불편은 상대를 공격하는 표시가 아니라, 방문자가 조심할 수 있게 만드는 약한 신호예요.</li>
      <li>제보는 바로 반영하되 자유 텍스트는 열지 않아 애드센스와 운영 리스크를 낮춰요.</li>
      <li>허위 의심이 누적되고 동의보다 많아지면 해당 제보는 자동으로 신호 계산에서 빠지는 구조예요.</li>
      <li>도쿄는 출구와 환승, 오사카는 지하 동선, 후쿠오카는 짧은 이동, 교토는 관광 혼잡을 같이 봐요.</li>
    </ul>
    <div class="detail-actions">
      <a class="text-button" href="/guide/">${icon("book-open")}운영 기준</a>
      <a class="text-button" href="/cities/">${icon("map")}도시 가이드</a>
      <a class="text-button" href="/policy/">${icon("shield-check")}제보 정책</a>
    </div>
  `;
}

function renderPlaceDetail(place) {
  const saved = state.saved.includes(place.id);
  const signals = getLiveSignals(place);
  const tags = getLiveTags(place);
  const reports = getVisibleReportsForPlace(place.id).slice(0, 4);
  const caution = signals.caution > 0;
  const trustScore = getTrustScore(place);

  return `
    <section class="place-card is-selected">
      <div class="place-title-row">
        <div>
          <h3><span class="place-title-emoji" aria-hidden="true">${categoryEmoji(place.category)}</span>${place.name}</h3>
          <p>${place.area} · ${place.kind}</p>
        </div>
        <span class="badge ${caution ? "caution" : reports.length ? "info" : "good"}">${getLiveTrust(place)}</span>
      </div>
      <div class="tag-row" aria-label="장소 태그">
        ${tags.map((tag) => `<span class="badge ${tag === "응대 불편" ? "caution" : tag.includes("충전") || tag.includes("와이파이") ? "info" : tag.includes("비") || tag.includes("허락") ? "warn" : "good"}"><span class="badge-emoji" aria-hidden="true">${emojiForTag(tag)}</span>${tag}</span>`).join("")}
      </div>
      <div class="detail-actions">
        <button class="text-button" type="button" data-save="${place.id}">
          ${icon(saved ? "bookmark-check" : "bookmark")}
          ${saved ? "저장됨" : "저장"}
        </button>
        <a class="text-button" href="${mapsUrl(place)}" target="_blank" rel="noreferrer">
          ${icon("navigation")}
          길찾기
        </a>
      </div>
      <div class="detail-actions single">
        <button class="primary-button" type="button" data-open-report>
          ${icon("plus")}
          이 장소 바로 제보
        </button>
      </div>
      <div class="use-summary">
        <div>
          <span>거리감</span>
          <strong>${distanceLabel(place)}</strong>
        </div>
        <div>
          <span>최근 확인</span>
          <strong>${place.lastSeen || "제보 필요"}</strong>
        </div>
        <div>
          <span>혼잡</span>
          <strong>${place.crowd || "현장 확인"}</strong>
        </div>
        <div>
          <span>신뢰도</span>
          <strong>${trustScore}%</strong>
        </div>
      </div>
      <div class="decision-card ${caution ? "is-caution" : ""}">
        <div>
          <span>이럴 때 좋아요</span>
          <strong>${place.bestFor || "잠깐 확인이 필요할 때"}</strong>
        </div>
        <p>${place.watchout || "운영 시간과 현장 안내를 먼저 확인해요."}</p>
      </div>
      <div class="signal-grid">
        <div class="signal"><strong>${signals.charge}</strong><span>충전 제보</span></div>
        <div class="signal"><strong>${signals.restroom}</strong><span>화장실 제보</span></div>
        <div class="signal"><strong>${signals.rest}</strong><span>쉬기 제보</span></div>
        <div class="signal"><strong>${signals.korean}</strong><span>한국어 신호</span></div>
        <div class="signal"><strong>${signals.caution}</strong><span>응대 불편</span></div>
        <div class="signal"><strong>${totalSignals(place)}</strong><span>누적 신호</span></div>
      </div>
      <ul class="note-list">
        ${place.notes.map((note) => `<li>${note}</li>`).join("")}
      </ul>
      ${renderReportFeed(reports)}
    </section>
  `;
}

function renderPlaceCard(place) {
  const signals = getLiveSignals(place);
  const caution = signals.caution > 0;
  return `
    <button type="button" class="place-card ${place.id === state.selectedId ? "is-selected" : ""}" data-place-id="${place.id}">
      <div class="place-title-row">
        <div>
          <h3><span class="place-title-emoji" aria-hidden="true">${categoryEmoji(place.category)}</span>${place.name}</h3>
          <p>${place.area} · ${getLiveTags(place).slice(0, 3).map((tag) => `${emojiForTag(tag)} ${tag}`).join(" · ")}</p>
          <small class="card-meta">${distanceLabel(place)} · ${place.lastSeen || "최근 확인 필요"} · 신뢰 ${getTrustScore(place)}%</small>
        </div>
        <span class="badge ${caution ? "caution" : "info"}">${getLiveTrust(place)}</span>
      </div>
    </button>
  `;
}

function renderEmptyState() {
  const label = categoriesByKey.get(state.filter)?.label || "조건";
  return `
    <section class="place-card empty-card">
      <h3>조건에 맞는 장소가 아직 없어요</h3>
      <p>${state.query ? `"${escapeHtml(state.query)}" 검색 결과가 없어요. ` : ""}${label} 제보를 남기면 바로 지도에 반영돼요.</p>
      <button class="primary-button" type="button" data-open-report>
        ${icon("plus")}
        새 제보 남기기
      </button>
    </section>
  `;
}

function renderScenarioRail() {
  return `
    <div class="scenario-rail" aria-label="빠른 상황">
      ${scenarios.map((scenario) => `
        <button type="button" class="scenario-chip ${state.activeScenario === scenario.key ? "is-active" : ""}" data-scenario="${scenario.key}">
          <span class="scenario-emoji" aria-hidden="true">${scenario.emoji}</span>
          <span>${scenario.label}</span>
          <small>${scenario.hint}</small>
        </button>
      `).join("")}
    </div>
  `;
}

function renderReportFeed(reports) {
  if (!reports.length) {
    return `
      <div class="live-feed">
        <div class="feed-head">
          <strong>최근 제보</strong>
          <span>아직 실시간 제보 없음</span>
        </div>
      </div>
    `;
  }

  return `
    <div class="live-feed">
      <div class="feed-head">
        <strong>최근 제보</strong>
        <span>바로 반영됨</span>
      </div>
      ${reports.map((report) => `
        <article class="feed-item">
          <div>
            <p>${report.tags.map((tag) => `${emojiForTag(tag)} ${escapeHtml(tag)}`).join(" · ")}</p>
            <small>${formatRecency(report.recency)} · 동의 ${report.agrees} · 허위 의심 ${report.disputes}</small>
          </div>
          <div class="feed-actions">
            <button type="button" data-report-id="${escapeAttr(report.id)}" data-report-vote="agree">동의</button>
            <button type="button" data-report-id="${escapeAttr(report.id)}" data-report-vote="dispute">허위 의심</button>
          </div>
        </article>
      `).join("")}
    </div>
  `;
}

function filterChip(item) {
  return `<button type="button" class="chip ${state.filter === item.key ? "is-active" : ""}" data-filter="${item.key}"><span class="chip-emoji" aria-hidden="true">${item.emoji}</span><span>${item.label}</span></button>`;
}

function renderMarkers() {
  const visiblePlaces = getFilteredPlaces();
  const visibleIds = new Set(visiblePlaces.map((place) => place.id));

  markers.forEach((marker, placeId) => {
    if (!visibleIds.has(placeId)) {
      markerLayer.removeLayer(marker);
      markers.delete(placeId);
      markerClassNames.delete(placeId);
    }
  });

  visiblePlaces.forEach((place) => {
    const markerClassName = `sumimap-marker marker-${place.category} ${place.id === state.selectedId ? "is-selected" : ""}`;
    const existing = markers.get(place.id);

    if (existing) {
      if (markerClassNames.get(place.id) !== markerClassName) {
        existing.setIcon(L.divIcon({
          className: markerClassName,
          html: markerLabel(place.category)
        }));
        markerClassNames.set(place.id, markerClassName);
      }
      return;
    }

    const marker = L.marker([place.lat, place.lng], {
      icon: L.divIcon({
        className: markerClassName,
        html: markerLabel(place.category)
      })
    });
    marker.on("click", () => selectPlace(place.id, false));
    marker.addTo(markerLayer);
    markers.set(place.id, marker);
    markerClassNames.set(place.id, markerClassName);
  });
}

function selectPlace(placeId, moveMap) {
  const place = placesById.get(placeId);
  if (!place) return;
  state.selectedId = place.id;
  rememberPlace(place.id);
  state.activePanel = "near";
  state.sheetMode = "expanded";
  document.querySelectorAll(".nav-button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.action === "near");
  });
  if (moveMap) {
    map.setView([place.lat, place.lng], 15);
  }
  renderSheet();
  renderMarkers();
}

function applyScenario(scenarioKey) {
  const scenario = scenariosByKey.get(scenarioKey);
  if (!scenario) return;

  state.activeScenario = scenario.key;
  state.sheetMode = "collapsed";
  state.filter = scenario.filter;
  state.query = "";
  placeSearch.value = "";
  const list = getFilteredPlaces();
  if (list.length) {
    state.selectedId = list[0].id;
    rememberPlace(list[0].id);
    map.setView([list[0].lat, list[0].lng], 14);
  }
  showToast(`${scenario.label} 상황으로 좁혔어.`);
  renderMapQuickRail();
  renderSheet();
  renderMarkers();
  refreshStatus();
}

function submitReport(form) {
  const selected = [...form.querySelectorAll("[data-report-tag].is-selected")]
    .map((button) => labelForReportKey(button.dataset.reportTag))
    .filter(Boolean);
  if (!selected.length) {
    showToast("확인한 내용을 하나 이상 선택해줘.");
    return;
  }

  const data = new FormData(form);
  const report = {
    id: createId(),
    placeId: data.get("placeId"),
    tags: selected,
    recency: data.get("recency"),
    createdAt: new Date().toISOString(),
    agrees: 0,
    disputes: 0
  };

  state.reports.unshift(report);
  invalidateReportCaches();
  writeJson("sumimap:reports", state.reports.slice(0, 100));
  state.selectedId = report.placeId;
  state.activePanel = "near";
  state.sheetMode = "expanded";
  state.activeScenario = "";
  state.filter = "all";
  state.query = "";
  placeSearch.value = "";
  updateSearchClear();
  searchPanel.hidden = true;
  renderMapQuickRail();
  document.querySelectorAll(".nav-button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.action === "near");
  });
  showToast("제보가 바로 반영됐어. 허위면 다른 사람들이 허위 의심으로 밀어낼 수 있어.");
  renderSheet();
  renderMarkers();
  refreshStatus();
}

function voteReport(reportId, vote) {
  const report = state.reports.find((item) => item.id === reportId);
  if (!report) return;

  if (vote === "agree") {
    report.agrees += 1;
    showToast("동의가 반영됐어.");
  } else if (vote === "dispute") {
    report.disputes += 1;
    showToast(isHiddenReport(report) ? "허위 의심이 누적되어 신호 계산에서 빠졌어." : "허위 의심을 반영했어.");
  }

  invalidateReportCaches();
  writeJson("sumimap:reports", state.reports);
  renderSheet();
  renderMarkers();
  refreshStatus();
}

function toggleSave(placeId) {
  if (state.saved.includes(placeId)) {
    state.saved = state.saved.filter((id) => id !== placeId);
    showToast("저장에서 뺐어.");
  } else {
    state.saved.unshift(placeId);
    showToast("저장했어.");
  }
  writeJson("sumimap:saved", state.saved);
  renderSheet();
}

function getSelectedPlace() {
  return placesById.get(state.selectedId) || places[0];
}

function syncSelectedWithFiltered() {
  const list = getFilteredPlaces();
  if (!list.length) return;
  if (!list.some((place) => place.id === state.selectedId)) {
    state.selectedId = list[0].id;
  }
}

function getFilteredPlaces() {
  const cacheKey = [
    state.filter,
    state.query,
    state.activeScenario,
    state.userPosition ? `${state.userPosition.lat.toFixed(5)},${state.userPosition.lng.toFixed(5)}` : "",
    reportVersion
  ].join("|");

  if (cacheKey === filteredPlacesCacheKey) return filteredPlacesCache;

  const normalized = state.query.toLowerCase();
  const filtered = places.filter((place) => {
    const signals = getLiveSignals(place);
    const liveTags = getLiveTags(place);
    const threshold = filterThresholds[state.filter] || 1;
    const filterMatch =
      state.filter === "all" ||
      place.category === state.filter ||
      signals[state.filter] >= threshold ||
      liveTags.some((tag) => tag.includes(labelForFilter(state.filter)));
    const queryMatch =
      !normalized ||
      `${place.name} ${place.area} ${place.kind} ${liveTags.join(" ")}`.toLowerCase().includes(normalized);
    return filterMatch && queryMatch;
  });
  filteredPlacesCacheKey = cacheKey;
  filteredPlacesCache = sortPlacesForContext(filtered);
  return filteredPlacesCache;
}

function refreshStatus() {
  const visible = getFilteredPlaces();
  const scenario = scenariosByKey.get(state.activeScenario);
  statusPill.textContent = scenario ? `${scenario.emoji} ${scenario.label} · ${visible.length}곳` : `📍 ${visible.length}곳 표시 · 바로 제보`;
  if (state.userPosition && !scenario) {
    statusPill.textContent = `📍 내 위치 기준 · ${visible.length}곳`;
  }
}

function renderContextTools() {
  const labels = [];
  const scenario = scenariosByKey.get(state.activeScenario);
  const filter = state.filter !== "all" ? categoriesByKey.get(state.filter) : null;
  if (scenario) labels.push(`${scenario.emoji} ${scenario.label}`);
  if (filter && !scenario) labels.push(`${filter.emoji} ${filter.label}`);
  if (state.query) labels.push(`검색 "${escapeHtml(state.query)}"`);
  if (state.userPosition) labels.push("내 위치 기준");
  if (!labels.length) return "";

  return `
    <div class="context-tools" aria-label="현재 보기 조건">
      <span>${labels.join(" · ")}</span>
      <div>
        ${(state.filter !== "all" || state.query || state.activeScenario) ? `<button type="button" data-reset-context>조건 해제</button>` : ""}
        ${state.userPosition ? `<button type="button" data-clear-location>위치 해제</button>` : ""}
      </div>
    </div>
  `;
}

function resetContext() {
  state.filter = "all";
  state.query = "";
  state.activeScenario = "";
  placeSearch.value = "";
  updateSearchClear();
  syncSelectedWithFiltered();
  renderMapQuickRail();
  renderSheet();
  renderMarkers();
  refreshStatus();
  showToast("검색과 필터를 해제했어.");
}

function clearLocationContext() {
  state.userPosition = null;
  if (userLocationLayer) {
    map.removeLayer(userLocationLayer);
    userLocationLayer = null;
  }
  syncSelectedWithFiltered();
  renderSheet();
  renderMarkers();
  refreshStatus();
  showToast("내 위치 기준을 해제했어.");
}

function updateSearchClear() {
  searchClear.hidden = !state.query;
}

function totalSignals(place) {
  return getPlaceDerived(place).totalSignals;
}

function markerLabel(category) {
  return categoryEmoji(category);
}

function labelForFilter(filter) {
  return {
    charge: "충전",
    restroom: "화장실",
    rest: "쉬",
    korean: "한국어",
    caution: "응대"
  }[filter] || "";
}

function renderMapQuickRail() {
  mapQuickRail.innerHTML = scenarios.map((scenario) => `
    <button type="button" class="quick-chip ${state.activeScenario === scenario.key ? "is-active" : ""}" data-quick-scenario="${scenario.key}" aria-label="${escapeAttr(scenario.label)}">
      <span aria-hidden="true">${scenario.emoji}</span>
      <strong>${scenario.label}</strong>
    </button>
  `).join("");
}

function sortPlacesForContext(list) {
  const key = state.activeScenario
    ? scenariosByKey.get(state.activeScenario)?.filter
    : state.filter !== "all" ? state.filter : "";

  if (!key) {
    return [...list].sort((a, b) => {
      const distanceDiff = distanceScore(a) - distanceScore(b);
      if (distanceDiff) return distanceDiff;
      return totalSignals(b) - totalSignals(a);
    });
  }

  return [...list].sort((a, b) => {
    const scoreDiff = scorePlaceForKey(b, key) - scorePlaceForKey(a, key);
    if (scoreDiff) return scoreDiff;
    const distanceDiff = distanceScore(a) - distanceScore(b);
    if (distanceDiff) return distanceDiff;
    return totalSignals(b) - totalSignals(a);
  });
}

function scorePlaceForKey(place, key) {
  const signals = getLiveSignals(place);
  const directMatch = place.category === key ? 8 : 0;
  const cautionPenalty = key !== "caution" ? Math.min(signals.caution, 4) : 0;
  return (signals[key] || 0) + directMatch - cautionPenalty;
}

function locateUser() {
  if (!navigator.geolocation) {
    showToast("이 브라우저에서는 현재 위치를 사용할 수 없어.");
    return;
  }

  locateButton.classList.add("is-loading");
  navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
      const position = [coords.latitude, coords.longitude];
      state.userPosition = { lat: coords.latitude, lng: coords.longitude };
      if (userLocationLayer) map.removeLayer(userLocationLayer);
      userLocationLayer = L.circleMarker(position, {
        radius: 8,
        color: "#ffffff",
        weight: 3,
        fillColor: "#13a77a",
        fillOpacity: 0.95
      }).addTo(map);
      userLocationLayer.bindPopup("내 위치").openPopup();
      map.setView(position, 15);
      locateButton.classList.remove("is-loading");
      const list = getFilteredPlaces();
      if (list.length) {
        state.selectedId = list[0].id;
        rememberPlace(list[0].id);
      }
      renderSheet();
      renderMarkers();
      refreshStatus();
      showToast("현재 위치 기준으로 지도를 이동했어.");
    },
    () => {
      locateButton.classList.remove("is-loading");
      showToast("위치 권한을 허용하면 내 주변으로 바로 이동할 수 있어.");
    },
    { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
  );
}

function distanceScore(place) {
  if (!state.userPosition) return 0;
  return distanceInMeters(state.userPosition.lat, state.userPosition.lng, place.lat, place.lng);
}

function distanceLabel(place) {
  if (!state.userPosition) return place.walk || "거리 확인";
  return `${formatDistance(distanceScore(place))} · ${place.walk || "도보 확인"}`;
}

function distanceInMeters(lat1, lng1, lat2, lng2) {
  const radius = 6371000;
  const toRad = (value) => value * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return radius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDistance(meters) {
  if (!Number.isFinite(meters)) return "거리 확인";
  if (meters < 1000) return `${Math.max(10, Math.round(meters / 10) * 10)}m`;
  return `${(meters / 1000).toFixed(meters < 10000 ? 1 : 0)}km`;
}

function categoryEmoji(category) {
  return categoryEmojis.get(category) || "📍";
}

function labelForReportKey(key) {
  return reportTagsByKey.get(key)?.label || "";
}

function emojiForTag(label) {
  const reportTag = reportTagsByLabel.get(label);
  if (reportTag) return reportTag.emoji;
  if (label.includes("와이파이")) return "📶";
  if (label.includes("충전")) return "🔌";
  if (label.includes("화장실")) return "🚻";
  if (label.includes("비")) return "☔";
  if (label.includes("한국어")) return "🇰🇷";
  if (label.includes("허락")) return "🙋";
  if (label.includes("응대") || label.includes("비추천")) return "⚠️";
  if (label.includes("쉬") || label.includes("대기") || label.includes("혼자")) return "🪑";
  return "📍";
}

function icon(name) {
  const paths = {
    send: `<path d="M21 3 10 14"/><path d="m21 3-7 18-4-7-7-4 18-7Z"/>`,
    "book-open": `<path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H20v17H7.5A3.5 3.5 0 0 0 4 22V5.5Z"/><path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H20"/>`,
    "shield-check": `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-5"/>`,
    bookmark: `<path d="M6 4h12v17l-6-3.5L6 21V4Z"/>`,
    "bookmark-check": `<path d="M6 4h12v17l-6-3.5L6 21V4Z"/><path d="m9 11 2 2 4-5"/>`,
    navigation: `<path d="M12 2 3 21l9-4 9 4-9-19Z"/>`,
    plus: `<path d="M12 5v14M5 12h14"/>`,
    "battery-low": `<rect x="3" y="7" width="16" height="10" rx="2"/><path d="M21 11v2"/><path d="M7 11v2"/>`,
    toilet: `<path d="M7 3h10v8a5 5 0 0 1-5 5h-1a4 4 0 0 1-4-4V3Z"/><path d="M8 21h8"/><path d="M12 16v5"/>`,
    "cloud-rain": `<path d="M17 18a5 5 0 0 0 0-10 7 7 0 0 0-13 3 4 4 0 0 0 1 7"/><path d="M8 19v2M12 19v2M16 19v2"/>`,
    languages: `<path d="M5 8h8"/><path d="M9 4v4c0 4-2 7-5 9"/><path d="M7 12c1 2 3 4 6 5"/><path d="M15 21l4-9 4 9"/><path d="M17 17h4"/>`,
    "triangle-alert": `<path d="M12 3 2 21h20L12 3Z"/><path d="M12 9v5M12 17h.01"/>`
  };
  return `<svg class="inline-icon" viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.plus}</svg>`;
}

function getLiveSignals(place) {
  return getPlaceDerived(place).signals;
}

function getLiveTags(place) {
  return getPlaceDerived(place).tags;
}

function getLiveTrust(place) {
  return getPlaceDerived(place).liveTrust;
}

function getTrustScore(place) {
  return getPlaceDerived(place).trustScore;
}

function getVisibleReports() {
  if (visibleReportsCache?.version === reportVersion) return visibleReportsCache.list;

  const list = state.reports.filter((report) => !isHiddenReport(report));
  const byPlace = new Map();
  list.forEach((report) => {
    const placeReports = byPlace.get(report.placeId) || [];
    placeReports.push(report);
    byPlace.set(report.placeId, placeReports);
  });
  visibleReportsCache = { version: reportVersion, list, byPlace };
  return list;
}

function getVisibleReportsForPlace(placeId) {
  getVisibleReports();
  return visibleReportsCache.byPlace.get(placeId) || [];
}

function getPlaceDerived(place) {
  const cached = derivedPlaceCache.get(place.id);
  if (cached?.version === reportVersion) return cached;

  const reports = getVisibleReportsForPlace(place.id);
  const signals = { ...place.signals };
  const tags = new Set(place.tags);
  reports.forEach((report) => {
    report.tags.forEach((tag) => {
      tags.add(tag);
      const key = signalForReportTag[tag];
      if (key) signals[key] += 1;
    });
  });

  const total = Object.values(signals).reduce((sum, value) => sum + value, 0);
  const disputes = reports.reduce((sum, report) => sum + report.disputes, 0);
  const agrees = reports.reduce((sum, report) => sum + report.agrees, 0);
  const derived = {
    version: reportVersion,
    reports,
    signals,
    tags: [...tags].slice(0, 8),
    totalSignals: total,
    liveTrust: reports.length ? `${reports.length}건 즉시 반영` : place.trust,
    trustScore: Math.max(48, Math.min(98, Math.round(62 + Math.min(total, 42) * 0.7 + agrees * 3 - disputes * 5)))
  };
  derivedPlaceCache.set(place.id, derived);
  return derived;
}

function invalidateReportCaches() {
  reportVersion += 1;
  visibleReportsCache = null;
  derivedPlaceCache = new Map();
  filteredPlacesCacheKey = "";
  filteredPlacesCache = [];
}

function isHiddenReport(report) {
  return report.disputes >= 3 && report.disputes > report.agrees;
}

function normalizeReports(reports) {
  if (!Array.isArray(reports)) return [];
  const validPlaceIds = new Set(places.map((place) => place.id));
  return reports
    .map((report, index) => ({
      id: safeId(report?.id, `legacy-${index}-${report?.createdAt || Date.now()}`),
      placeId: validPlaceIds.has(report?.placeId) ? report.placeId : "",
      tags: Array.isArray(report?.tags) ? report.tags.filter((tag) => allowedReportLabels.has(tag)) : [],
      recency: ["today", "week", "month", "old"].includes(report?.recency) ? report.recency : "old",
      createdAt: report?.createdAt || new Date().toISOString(),
      agrees: clampCount(report?.agrees),
      disputes: clampCount(report?.disputes)
    }))
    .filter((report) => report.placeId && report.tags.length)
    .slice(0, 100);
}

function normalizeSaved(ids) {
  if (!Array.isArray(ids)) return [];
  const validPlaceIds = new Set(places.map((place) => place.id));
  return [...new Set(ids.filter((id) => validPlaceIds.has(id)))];
}

function normalizeRecent(ids) {
  return normalizeSaved(ids).slice(0, 8);
}

function rememberPlace(placeId) {
  if (!validPlaceIds.has(placeId)) return;
  state.recent = [placeId, ...state.recent.filter((id) => id !== placeId)].slice(0, 8);
  writeJson("sumimap:recent", state.recent);
}

function safeId(value, fallback) {
  const id = String(value || fallback).replace(/[^a-zA-Z0-9:_-]/g, "").slice(0, 90);
  return id || String(fallback).replace(/[^a-zA-Z0-9:_-]/g, "").slice(0, 90);
}

function clampCount(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.max(0, Math.min(999, Math.floor(number)));
}

function createId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `report-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function formatRecency(recency) {
  return {
    today: "오늘 확인",
    week: "최근 1주일",
    month: "최근 1개월",
    old: "이전 기억"
  }[recency] || "방문 시점 미상";
}

function mapsUrl(place) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place.lat},${place.lng}`)}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttr(value) {
  return escapeHtml(value).replaceAll("`", "&#96;");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2300);
}

function readJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    showToast("기기 저장 공간이 부족해서 이번 변경은 임시로만 반영됐어.");
  }
}
