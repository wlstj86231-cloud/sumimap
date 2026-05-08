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

const dailyChecks = [
  { key: "charge", label: "충전 후보 저장", hint: "배터리 20% 전에 가까운 곳 하나를 잡아둬요.", filter: "charge", emoji: "🔌" },
  { key: "restroom", label: "화장실 후보 확인", hint: "역·상업시설·공원 중 하나를 미리 봐두면 편해요.", filter: "restroom", emoji: "🚻" },
  { key: "rest", label: "잠깐 머물 곳 확보", hint: "비·더위·대기 시간이 생길 때 갈 곳을 남겨둬요.", filter: "rest", emoji: "☔" },
  { key: "korean", label: "한국어 신호 확인", hint: "초행 동선이면 한국어 대응 신호도 같이 확인해요.", filter: "korean", emoji: "🇰🇷" }
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

const geocodeSearchUrl = "https://nominatim.openstreetmap.org/search";
const reverseGeocodeUrl = "https://nominatim.openstreetmap.org/reverse";
const japanBounds = {
  minLat: 24,
  maxLat: 46,
  minLng: 122,
  maxLng: 154
};

const languageStorageKey = "sumimap:language";
const supportedLanguages = new Set(["ko", "ja"]);
let currentLanguage = readLanguagePreference();

const jaText = {
  "오늘 생활 루틴": "今日の生活ルーティン",
  "지금 바로 챙길 것": "今すぐ見るもの",
  "체크 진행": "チェック進捗",
  "체크": "チェック",
  "완료": "完了",
  "충전 후보 저장": "充電候補を保存",
  "화장실 후보 확인": "トイレ候補を確認",
  "잠깐 머물 곳 확보": "少し休める場所を確保",
  "한국어 신호 확인": "韓国語対応の目印を確認",
  "배터리 20% 전에 가까운 곳 하나를 잡아둬요.": "バッテリー20%前に近い場所を1つ見ておきましょう。",
  "역·상업시설·공원 중 하나를 미리 봐두면 편해요.": "駅・商業施設・公園のどれかを先に見ておくと安心です。",
  "비·더위·대기 시간이 생길 때 갈 곳을 남겨둬요.": "雨・暑さ・待ち時間に移動できる場所を残しておきます。",
  "초행 동선이면 한국어 대응 신호도 같이 확인해요.": "初めての動線なら韓国語対応の目印も一緒に確認します。",
  "이어서 보기 좋은 곳": "次に見るとよい場所",
  "저장 보기": "保存を見る",
  "제보하기": "投稿する",
  "저장 브리프": "保存ブリーフ",
  "오늘 다시 열어볼 장소를 한 문장씩 묶어둬요.": "今日また開く場所を短くまとめます。",
  "브리프 복사": "ブリーフをコピー",
  "저장한 장소가 있어야 브리프를 만들 수 있어요.": "保存した場所があるとブリーフを作れます。",
  "브리프를 복사했어.": "ブリーフをコピーしました。",
  "복사가 막혔어. 브라우저 권한을 확인해줘.": "コピーできませんでした。ブラウザ権限を確認してください。",
  "저장한 장소 없음": "保存した場所なし",
  "장소를 저장하면 이동 전에 다시 볼 수 있는 브리프가 생겨요.": "場所を保存すると、移動前に見返せるブリーフができます。",
  "3단계 사용 팁": "3ステップ利用メモ",
  "먼저 확인": "先に確認",
  "현장": "現地",
  "제보": "投稿",
  "이 장소는 이동 전에 신호와 최근 제보를 같이 봐요.": "この場所は移動前に目印と最新投稿を一緒に見ます。",
  "도착하면 운영 시간과 현장 안내를 한 번 더 확인해요.": "到着したら営業時間と現地案内をもう一度確認します。",
  "달라진 점이 있으면 두 번만 눌러 바로 제보해요.": "変化があれば数回タップですぐ投稿します。",
  "지도 크게": "地図を広く",
  "스미맵": "スミマップ",
  "스미맵 - 일본 생활 제보 지도": "スミマップ - 日本生活スポットマップ",
  "일본 생활 제보 지도": "日本生活スポットマップ",
  "일본에서 사는 한국인을 위한 충전, 화장실, 쉬기 좋은 곳, 한국어 대응, 응대 불편 제보 지도.": "日本で暮らす韓国語ユーザー向けの、充電・トイレ・休憩・韓国語対応・対応に不安がある場所を確認できる生活マップです。",
  "스미맵 지도": "スミマップ地図",
  "상단 탐색": "上部ナビゲーション",
  "스미맵 홈": "スミマップ ホーム",
  "현재 위치로 이동": "現在地へ移動",
  "검색 열기": "検索を開く",
  "검색 닫기": "検索を閉じる",
  "일본어로 번역": "日本語に翻訳",
  "한국어로 보기": "韓国語で表示",
  "주소·지명 검색 또는 태그 검색": "住所・地名・タグを検索",
  "검색어 지우기": "検索語を消去",
  "주소검색": "住所検索",
  "도시 빠른 이동": "都市へすぐ移動",
  "긴급 상황 바로 보기": "急ぎの状況をすぐ確認",
  "주요 메뉴": "メインメニュー",
  "근처": "近く",
  "필터": "絞り込み",
  "제보": "投稿",
  "저장": "保存",
  "정보": "情報",
  "도쿄": "東京",
  "오사카": "大阪",
  "후쿠오카": "福岡",
  "교토": "京都",
  "전체": "すべて",
  "충전": "充電",
  "화장실": "トイレ",
  "쉬기": "休憩",
  "한국어": "韓国語",
  "응대 불편": "対応不安",
  "배터리 5%": "バッテリー5%",
  "화장실 급함": "トイレ急ぎ",
  "비 피하기": "雨宿り",
  "한국어 필요": "韓国語が必要",
  "응대 조심": "対応に注意",
  "콘센트와 허락 여부 먼저": "コンセントと許可を先に確認",
  "단독 이용 가능성 확인": "単独利用できるか確認",
  "잠깐 머물기 좋은 곳": "少し滞在しやすい場所",
  "한국어 대응 신호": "韓国語対応のサイン",
  "불편 제보가 있는 곳": "不安投稿がある場所",
  "충전 가능": "充電可",
  "직원 허락 필요": "スタッフ確認が必要",
  "화장실 가능": "トイレ利用可",
  "화장실만 이용 애매": "トイレだけの利用は微妙",
  "잠깐 쉬기 좋음": "少し休みやすい",
  "장시간 비추천": "長時間滞在は非推奨",
  "와이파이": "Wi-Fi",
  "한국어 대응": "韓国語対応",
  "비 피하기 좋음": "雨宿りしやすい",
  "혼자 쉬기 좋음": "一人で休みやすい",
  "혼자 이용 편함": "一人でも利用しやすい",
  "주소 검색": "住所検索",
  "제보 대기": "投稿待ち",
  "새 장소": "新しい場所",
  "주소 선택": "住所選択",
  "방금 검색": "検索したばかり",
  "현장 확인": "現地確認",
  "새 생활 스팟 제보": "新しい生活スポット投稿",
  "검색한 위치": "検索した位置",
  "지금 확인할 생활 스팟": "今すぐ確認したい生活スポット",
  "충전, 화장실, 쉬기, 한국어 대응, 응대 불편 신호를 한 번에 봐요.": "充電、トイレ、休憩、韓国語対応、対応不安のサインをまとめて確認できます。",
  "상황별로 빠르게 좁혀요. 응대 불편은 낙인이 아니라 최근 제보 신호로만 봐요.": "状況別にすばやく絞り込めます。対応不安はレッテルではなく、最近の投稿サインとしてだけ扱います。",
  "충전은 콘센트 위치와 직원 허락 여부를 같이 봐야 정확해요.": "充電はコンセント位置とスタッフ確認の必要性を一緒に見ると正確です。",
  "화장실은 단독 이용 가능 여부가 장소마다 달라요.": "トイレは単独利用できるかが場所によって異なります。",
  "응대 불편은 1건으로 공개하지 않고 반복 신호일 때만 약하게 표시하는 전제로 설계했어요.": "対応不安は1件だけで強く表示せず、繰り返しのサインとして弱く扱う前提で設計しています。",
  "간단 제보": "かんたん投稿",
  "주소를 검색해 장소를 먼저 잡고, 확인한 신호만 눌러요.": "住所を検索して場所を決め、確認したサインだけを押してください。",
  "지도 보기": "地図を見る",
  "장소": "場所",
  "지도 중심": "地図の中心",
  "내 위치": "現在地",
  "지도 확인": "地図で確認",
  "장소 선택 필요": "場所の選択が必要です",
  "주소나 지명을 검색해서 위치를 잡아주세요.": "住所や地名を検索して位置を指定してください。",
  "빠른 장소 선택": "場所をすばやく選択",
  "확인한 내용": "確認した内容",
  "한두 개만 눌러도 충분해요. 응대 불편은 낙인이 아니라 방문 전 주의 신호로만 써요.": "1、2個だけでも十分です。対応不安はレッテルではなく、訪問前の注意サインとしてだけ使います。",
  "추가 옵션": "追加オプション",
  "방문 시점": "訪問時期",
  "오늘": "今日",
  "오늘 확인": "今日確認",
  "최근 1주일": "直近1週間",
  "최근 1개월": "直近1か月",
  "이전 기억": "以前の記憶",
  "바로 반영": "すぐ反映",
  "첫 제보 남기기": "最初の投稿を残す",
  "저장한 곳": "保存した場所",
  "저장한 곳과 방금 확인한 곳을 빠르게 다시 열어요.": "保存した場所と直前に見た場所をすばやく開けます。",
  "아직 저장한 장소가 없어요": "まだ保存した場所がありません",
  "장소 상세에서 저장을 누르면 여기에 모여요.": "場所の詳細で保存を押すとここに集まります。",
  "최근 본 곳": "最近見た場所",
  "최근 확인한 장소가 없어요": "最近確認した場所がありません",
  "지도를 누르거나 장소 카드를 열면 자동으로 기록돼요.": "地図や場所カードを開くと自動で記録されます。",
  "스미맵 기준": "スミマップの基準",
  "일본 생활 중 곤란한 순간을 빠르게 피하기 위한 한국어 지도예요.": "日本生活で困る瞬間をすばやく避けるための韓国語ベースの地図です。",
  "응대 불편은 상대를 공격하는 표시가 아니라, 방문자가 조심할 수 있게 만드는 약한 신호예요.": "対応不安は相手を攻撃する表示ではなく、訪問者が注意できるようにする弱いサインです。",
  "제보는 바로 반영하되 자유 텍스트는 열지 않아 애드센스와 운영 리스크를 낮춰요.": "投稿はすぐ反映しますが、自由入力を開かないことで広告審査と運営リスクを下げています。",
  "허위 의심이 누적되고 동의보다 많아지면 해당 제보는 자동으로 신호 계산에서 빠지는 구조예요.": "虚偽疑いが同意より多く積み上がると、その投稿は自動的にサイン計算から外れます。",
  "도쿄는 출구와 환승, 오사카는 지하 동선, 후쿠오카는 짧은 이동, 교토는 관광 혼잡을 같이 봐요.": "東京は出口と乗換、大阪は地下動線、福岡は短い移動、京都は観光混雑を一緒に見ます。",
  "운영 기준": "運営基準",
  "도시 가이드": "都市ガイド",
  "제보 정책": "投稿ポリシー",
  "저장됨": "保存済み",
  "길찾기": "経路",
  "이 장소 바로 제보": "この場所を投稿",
  "거리감": "距離感",
  "최근 확인": "最近確認",
  "혼잡": "混雑",
  "신뢰도": "信頼度",
  "이럴 때 좋아요": "こんな時に便利",
  "잠깐 확인이 필요할 때": "少し確認したい時",
  "운영 시간과 현장 안내를 먼저 확인해요.": "営業時間と現地案内を先に確認しましょう。",
  "충전 제보": "充電投稿",
  "화장실 제보": "トイレ投稿",
  "쉬기 제보": "休憩投稿",
  "한국어 신호": "韓国語サイン",
  "누적 신호": "累計サイン",
  "최근 제보": "最近の投稿",
  "아직 실시간 제보 없음": "まだリアルタイム投稿はありません",
  "바로 반영됨": "すぐ反映済み",
  "동의": "同意",
  "허위 의심": "虚偽疑い",
  "조건에 맞는 장소가 아직 없어요": "条件に合う場所はまだありません",
  "검색 결과가 없어요.": "検索結果がありません。",
  "제보를 남기면 바로 지도에 반영돼요.": "投稿するとすぐ地図に反映されます。",
  "새 제보 남기기": "新しい投稿を残す",
  "현재 보기 조건": "現在の表示条件",
  "조건 해제": "条件解除",
  "위치 해제": "位置解除",
  "내 위치 기준": "現在地基準",
  "주소를 찾는 중...": "住所を検索中...",
  "검색 결과를 눌러 제보 장소로 잡아주세요.": "検索結果を押して投稿場所に指定してください。",
  "일본 주소나 역 이름으로 다시 검색해보세요.": "日本の住所や駅名でもう一度検索してください。",
  "주소검색이 잠시 불안정해요. 지명 또는 역 이름으로 다시 시도해줘.": "住所検索が一時的に不安定です。地名または駅名でもう一度試してください。",
  "주소나 지명을 두 글자 이상 입력해줘.": "住所や地名を2文字以上入力してください。",
  "확인한 내용을 하나 이상 선택해줘.": "確認した内容を1つ以上選んでください。",
  "주소검색으로 장소를 먼저 선택해줘.": "住所検索で先に場所を選んでください。",
  "제보가 바로 반영됐어. 허위면 다른 사람들이 허위 의심으로 밀어낼 수 있어.": "投稿をすぐ反映しました。虚偽なら他の人が虚偽疑いで押し下げられます。",
  "동의가 반영됐어.": "同意を反映しました。",
  "허위 의심이 누적되어 신호 계산에서 빠졌어.": "虚偽疑いが積み上がったため、サイン計算から外れました。",
  "허위 의심을 반영했어.": "虚偽疑いを反映しました。",
  "저장에서 뺐어.": "保存から外しました。",
  "저장했어.": "保存しました。",
  "검색과 필터를 해제했어.": "検索と絞り込みを解除しました。",
  "내 위치 기준을 해제했어.": "現在地基準を解除しました。",
  "이 브라우저에서는 현재 위치를 사용할 수 없어.": "このブラウザでは現在地を利用できません。",
  "현재 위치 기준으로 지도를 이동했어.": "現在地基準で地図を移動しました。",
  "위치 권한을 허용하면 내 주변으로 바로 이동할 수 있어.": "位置情報を許可すると周辺へすぐ移動できます。",
  "기기 저장 공간이 부족해서 이번 변경은 임시로만 반영됐어.": "端末の保存容量が不足しているため、今回の変更は一時的にだけ反映されました。",
  "일본어로 전환했어.": "日本語表示に切り替えました。",
  "한국어로 전환했어.": "韓国語表示に切り替えました。",
  "표시": "表示",
  "바로 제보": "すぐ投稿",
  "검색": "検索",
  "조건": "条件",
  "중심으로 이동했어.": "中心へ移動しました。",
  "상황으로 좁혔어.": "の状況で絞り込みました。",
  "최근 확인 필요": "最近確認が必要",
  "제보 필요": "投稿が必要",
  "방문 시점 미상": "訪問時期不明",
  "거리 확인": "距離確認",
  "도보 확인": "徒歩確認",
  "신뢰": "信頼",
  "문제없었음": "問題なかった",
  "주소나 지명을 검색하면 그 위치로 바로 제보할 수 있어.": "住所や地名を検索すると、その位置をすぐ投稿場所にできます。",
  "위치 권한을 허용하면 내 위치를 제보 장소로 바로 잡을 수 있어.": "位置情報を許可すると、現在地をすぐ投稿場所にできます。",
  "스미맵은 일본 안의 위치만 제보 장소로 잡을 수 있어.": "スミマップでは日本国内の位置だけを投稿場所にできます。",
  "주소를 확인하는 중이야.": "の住所を確認しています。",
  "제보 장소로 잡았어.": "を投稿場所に指定しました。",
  "길게 누른 위치": "長押しした位置",
  "선택 위치": "選択位置",
  "주소를 제보 장소로 잡았어. 이제 신호만 눌러주면 돼.": "住所を投稿場所に指定しました。あとはサインを押すだけです。",
  "검색한 주소는 위치 기준이에요. 운영 시간과 현장 안내는 직접 확인해 주세요.": "検索した住所は位置の基準です。営業時間と現地案内は直接確認してください。",
  "주소검색으로 잡은 새 장소예요.": "住所検索で指定した新しい場所です。",
  "제보가 쌓이면 충전, 화장실, 쉬기, 한국어 대응 신호가 지도에 반영돼요.": "投稿が集まると、充電・トイレ・休憩・韓国語対応のサインが地図に反映されます。",
  "제보가 쌓이면 생활 신호가 지도에 반영돼요.": "投稿が集まると生活サインが地図に反映されます。",
  "빠른 상황": "すぐ見る状況"
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

const placeJapanese = {
  "tokyo-shinjuku-east": {
    name: "新宿東側 カフェ型スポット",
    area: "東京 新宿",
    kind: "カフェ/飲食店",
    trust: "よく確認されています",
    walk: "徒歩6分",
    lastSeen: "今日確認",
    crowd: "昼は混雑",
    bestFor: "バッテリー不足の時の第一候補",
    watchout: "コンセント席は先に確認してから注文する方が安心です。",
    notes: ["混雑時間帯は長時間滞在が少し気まずい場合があります。", "コンセントは席によって違うため、注文前に確認すると安心です。"]
  },
  "tokyo-ueno-public": {
    name: "上野駅近くの公共便利スポット",
    area: "東京 上野",
    kind: "公共施設",
    trust: "利用できる可能性が高い",
    walk: "徒歩4分",
    lastSeen: "直近1週間",
    crowd: "昼は普通",
    bestFor: "トイレが急ぎの時",
    watchout: "遅い時間は周辺の動線と営業時間を一緒に確認しましょう。",
    notes: ["トイレまでの動線が比較的わかりやすいという投稿が多いです。", "遅い時間は周辺の雰囲気を確認して移動する方が安心です。"]
  },
  "tokyo-ikebukuro-rest": {
    name: "池袋北側の待機スポット",
    area: "東京 池袋",
    kind: "屋内休憩",
    trust: "投稿あり",
    walk: "徒歩8分",
    lastSeen: "直近1か月",
    crowd: "夕方は混雑",
    bestFor: "待ち合わせ前の10分待機",
    watchout: "店舗の利用条件は現地案内を優先してください。",
    notes: ["短時間の待機に向いているという投稿があります。", "店舗の利用条件は現地案内を優先してください。"]
  },
  "tokyo-shinokubo-korean": {
    name: "新大久保 韓国語対応が期待できるエリア",
    area: "東京 新大久保",
    kind: "商店街",
    trust: "よく確認されています",
    walk: "徒歩5分",
    lastSeen: "今日確認",
    crowd: "週末は混雑",
    bestFor: "日本語で詰まった時",
    watchout: "店によって韓国語対応の度合いが違うため、詳細タグも一緒に見ましょう。",
    notes: ["韓国語メニューや案内がある場所が多いという投稿が集まっています。", "店舗ごとの条件差が大きいため、詳細タグの確認が必要です。"]
  },
  "tokyo-shibuya-caution": {
    name: "渋谷 混雑エリア注意スポット",
    area: "東京 渋谷",
    kind: "混雑商圏",
    trust: "注意投稿あり",
    walk: "徒歩7分",
    lastSeen: "直近1週間",
    crowd: "常に混雑",
    bestFor: "訪問前の雰囲気確認",
    watchout: "対応不安は断定ではなく注意サインです。反対の経験も一緒に反映されます。",
    notes: ["対応不安の投稿が複数あります。断定ではなく、訪問前の確認サインとしてだけ表示します。", "反対の経験があれば同じ場所で「問題なかった」サインとしてバランスを取れます。"]
  },
  "osaka-namba-charge": {
    name: "なんば駅近くの充電確認スポット",
    area: "大阪 なんば",
    kind: "カフェ/飲食店",
    trust: "投稿あり",
    walk: "徒歩6分",
    lastSeen: "直近1週間",
    crowd: "午後は普通",
    bestFor: "なんば移動前の充電",
    watchout: "注文せず充電だけする利用は避ける方がよいです。",
    notes: ["コンセント席が限られるという投稿があります。", "注文せず充電だけする利用は避ける方がよいです。"]
  },
  "fukuoka-hakata-restroom": {
    name: "博多駅周辺 トイレ確認スポット",
    area: "福岡 博多",
    kind: "駅周辺",
    trust: "利用できる可能性が高い",
    walk: "徒歩3分",
    lastSeen: "直近1週間",
    crowd: "通勤時間は混雑",
    bestFor: "博多駅を移動中で急ぎの時",
    watchout: "施設の営業時間は季節やイベントによって変わることがあります。",
    notes: ["駅周辺を移動中、急ぎの時に確認しやすい位置です。", "施設の営業時間は季節やイベントによって変わることがあります。"]
  },
  "kyoto-station-rest": {
    name: "京都駅 待機と休憩スポット",
    area: "京都駅",
    kind: "駅周辺",
    trust: "投稿あり",
    walk: "徒歩5分",
    lastSeen: "直近1か月",
    crowd: "繁忙期は混雑",
    bestFor: "荷物が多い時の動線整理",
    watchout: "観光シーズンは混雑度がすぐ上がります。",
    notes: ["荷物が多い時に少し動線を整理しやすいという投稿があります。", "観光シーズンは混雑度がすぐ上がります。"]
  },
  "tokyo-yaesu-restroom": {
    name: "東京駅 八重洲トイレ確認スポット",
    area: "東京駅 八重洲",
    kind: "駅周辺",
    trust: "利用できる可能性が高い",
    walk: "徒歩4分",
    lastSeen: "直近1週間",
    crowd: "通勤時間は混雑",
    bestFor: "東京駅で乗り換え中に急ぎの時",
    watchout: "駅構内の動線が複雑なので、出口と階を先に確認する方がよいです。",
    notes: ["乗り換え中にトイレと屋内待機動線を一緒に確認しやすいエリアです。", "ラッシュ時は移動時間が予想より長くなることがあります。"]
  },
  "tokyo-akihabara-charge": {
    name: "秋葉原 電子街の充電候補スポット",
    area: "東京 秋葉原",
    kind: "商店街",
    trust: "投稿あり",
    walk: "徒歩6分",
    lastSeen: "直近1か月",
    crowd: "週末は混雑",
    bestFor: "電子機器のバッテリーとデータ整理",
    watchout: "コンセントが見えても、スタッフ確認なしで使うのは避ける方が安心です。",
    notes: ["機器充電の需要が多い生活圏なので、充電候補サインを別で集めています。", "店舗ごとの方針差が大きいため、注文前の確認が必要です。"]
  },
  "tokyo-shinagawa-rain": {
    name: "品川駅 雨宿りスポット",
    area: "東京 品川",
    kind: "屋内移動",
    trust: "投稿あり",
    walk: "徒歩5分",
    lastSeen: "直近1週間",
    crowd: "退勤時間は混雑",
    bestFor: "雨の日の待ち合わせ前待機",
    watchout: "通路型の空間は長く滞在するより、短く動線を整える用途で見る方がよいです。",
    notes: ["雨の日に屋内を移動しながら荷物を整理しやすいサインがあります。", "退勤時間は座れる場所がすぐ減ることがあります。"]
  },
  "tokyo-takadanobaba-korean": {
    name: "高田馬場 韓国語生活圏スポット",
    area: "東京 高田馬場",
    kind: "生活商圏",
    trust: "投稿あり",
    walk: "徒歩7分",
    lastSeen: "直近1か月",
    crowd: "夜は普通",
    bestFor: "日本語の説明が負担な時",
    watchout: "韓国語対応の有無は時間帯とスタッフによって変わることがあります。",
    notes: ["留学生生活圏の投稿が集まりやすいエリアです。", "韓国語メニューと実際の韓国語対応は分けて確認する方がよいです。"]
  },
  "osaka-umeda-underground-rest": {
    name: "梅田地下街 待機スポット",
    area: "大阪 梅田",
    kind: "地下街",
    trust: "よく確認されています",
    walk: "徒歩4分",
    lastSeen: "今日確認",
    crowd: "常に混雑",
    bestFor: "雨の日や暑い日の屋内待機",
    watchout: "地下動線が複雑なので、経路案内をつけたまま移動する方がよいです。",
    notes: ["梅田では雨宿りとトイレ動線を一緒に見るユーザーが多いです。", "初めてなら出口番号を先に確認すると迷いにくくなります。"]
  },
  "osaka-tsuruhashi-korean": {
    name: "鶴橋 韓国語対応生活圏",
    area: "大阪 鶴橋",
    kind: "商店街",
    trust: "投稿あり",
    walk: "徒歩6分",
    lastSeen: "直近1週間",
    crowd: "週末は混雑",
    bestFor: "韓国語メニューと生活商圏の確認",
    watchout: "店ごとに雰囲気と対応できる言語が違うため、詳細サインも一緒に見ましょう。",
    notes: ["韓国人訪問者が多い生活圏なので、韓国語サインを別で集めやすい場所です。", "混雑時間は長く滞在するより、目的地を決めて動く方がよいです。"]
  },
  "osaka-tennoji-restroom": {
    name: "天王寺周辺 トイレ確認スポット",
    area: "大阪 天王寺",
    kind: "駅周辺",
    trust: "利用できる可能性が高い",
    walk: "徒歩5分",
    lastSeen: "直近1週間",
    crowd: "休日は混雑",
    bestFor: "公園・商業施設へ移動する前の確認",
    watchout: "イベント日は周辺トイレの待ち時間が長くなることがあります。",
    notes: ["天王寺は観光動線と生活動線が重なり、急ぎの状況投稿が集まりやすいです。", "混雑日は近い場所だけでなく、2番目の候補も一緒に保存しておくと便利です。"]
  },
  "osaka-shinimamiya-caution": {
    name: "新今宮 移動前注意スポット",
    area: "大阪 新今宮",
    kind: "駅周辺",
    trust: "注意投稿あり",
    walk: "徒歩7分",
    lastSeen: "直近1か月",
    crowd: "夜は要確認",
    bestFor: "夜の移動前の雰囲気確認",
    watchout: "対応不安と夜間の雰囲気サインは断定ではなく、移動前の参考サインとしてだけ見ましょう。",
    notes: ["夜間移動前は明るい大通りと駅動線を優先する方が安心です。", "反対の経験投稿が集まれば注意サインは弱くなります。"]
  },
  "fukuoka-tenjin-charge": {
    name: "天神中心部 充電確認スポット",
    area: "福岡 天神",
    kind: "商業施設",
    trust: "投稿あり",
    walk: "徒歩5分",
    lastSeen: "直近1週間",
    crowd: "午後は混雑",
    bestFor: "買い物中のバッテリー回復",
    watchout: "充電できる席は限られている場合があります。",
    notes: ["天神は移動前に充電とトイレを同時に確認したいユーザーが多いです。", "週末は長く座れる席が早くなくなることがあります。"]
  },
  "fukuoka-nakasu-rain": {
    name: "中洲 雨宿り確認スポット",
    area: "福岡 中洲",
    kind: "屋内待機",
    trust: "投稿あり",
    walk: "徒歩6分",
    lastSeen: "直近1か月",
    crowd: "夜は混雑",
    bestFor: "雨の日に短く動線整理",
    watchout: "夜間は混雑と客引きの雰囲気も一緒に確認する方がよいです。",
    notes: ["雨を避けながら次の移動経路を整理しやすいサインがあります。", "長時間滞在より短い待機用途で見る方が合っています。"]
  },
  "fukuoka-hakata-korean": {
    name: "博多 韓国語案内候補スポット",
    area: "福岡 博多",
    kind: "駅周辺",
    trust: "投稿あり",
    walk: "徒歩4分",
    lastSeen: "直近1週間",
    crowd: "旅行客混雑",
    bestFor: "博多駅周辺の韓国語案内確認",
    watchout: "韓国語案内板と実際に会話できるかは分けて見る必要があります。",
    notes: ["空港と駅の移動が多いエリアなので、韓国語案内サインが役立ちます。", "スタッフの対応可能言語は時間帯によって変わることがあります。"]
  },
  "kyoto-shijo-restroom": {
    name: "四条河原町 トイレ確認スポット",
    area: "京都 四条河原町",
    kind: "商業施設",
    trust: "利用できる可能性が高い",
    walk: "徒歩5分",
    lastSeen: "直近1週間",
    crowd: "観光混雑",
    bestFor: "観光動線中の急なトイレ確認",
    watchout: "観光客が多い時間は、近い候補を2つ一緒に見る方がよいです。",
    notes: ["京都中心商圏はトイレと雨宿りサインを一緒に見ることが多いです。", "季節イベント期間は普段より待ち時間が長くなることがあります。"]
  },
  "kyoto-gion-caution": {
    name: "祇園周辺 対応注意スポット",
    area: "京都 祇園",
    kind: "観光商圏",
    trust: "注意投稿あり",
    walk: "徒歩8分",
    lastSeen: "直近1か月",
    crowd: "夕方は混雑",
    bestFor: "観光地のマナーと利用条件確認",
    watchout: "対応不安はレッテルではなく、訪問前に慎重に確認するためのサインです。",
    notes: ["観光地では撮影、待機、利用条件を現地案内に合わせる方が安心です。", "反対の経験投稿が集まれば注意サインは弱くなります。"]
  }
};

normalizeCustomPlaces(readJson("sumimap:customPlaces", [])).forEach((place) => {
  places.push(place);
});

const state = {
  language: currentLanguage,
  filter: "all",
  query: "",
  selectedId: places[0].id,
  activePanel: "near",
  sheetMode: "collapsed",
  activeScenario: "",
  addressCandidates: [],
  addressLoading: false,
  addressMessage: "",
  userPosition: null,
  saved: normalizeSaved(readJson("sumimap:saved", [])),
  recent: normalizeRecent(readJson("sumimap:recent", [])),
  checks: normalizeChecks(readJson("sumimap:checks", {})),
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
const languageToggle = document.querySelector("#languageToggle");
const searchClear = document.querySelector("#searchClear");
const placeSearch = document.querySelector("#placeSearch");
const addressSearchButton = document.querySelector("#addressSearchButton");
const addressResults = document.querySelector("#addressResults");

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
let addressSearchSeq = 0;
let locationPickPending = false;

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
  applyStaticLanguage();
  renderMapQuickRail();
  renderAddressResults();
  renderSheet();
  renderMarkers();
  refreshStatus();
  setSearchPanel(false);
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
  map.on("contextmenu", selectHeldMapPointForReport);
  map.on("click", () => {
    if (!searchPanel?.hidden) setSearchPanel(false);
    if (state.activePanel === "near" && state.sheetMode !== "collapsed") {
      setSheetMode("collapsed");
    }
  });
}

function bindEvents() {
  document.querySelectorAll(".nav-button").forEach((button) => {
    button.addEventListener("click", () => {
      setPanel(button.dataset.action);
    });
  });

  searchToggle.addEventListener("click", () => {
    setSearchPanel(searchPanel.hidden, true);
  });

  addressSearchButton.addEventListener("click", () => {
    searchAddressFromInput();
  });

  locateButton.addEventListener("click", locateUser);

  languageToggle?.addEventListener("click", toggleLanguage);

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || searchPanel.hidden) return;
    setSearchPanel(false);
    searchToggle.focus();
  });

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
    addressSearchSeq += 1;
    state.query = event.target.value.trim();
    state.addressCandidates = [];
    state.addressLoading = false;
    state.addressMessage = "";
    addressSearchButton.disabled = false;
    updateSearchClear();
    renderAddressResults();
    syncSelectedWithFiltered();
    renderSheet();
    renderMarkers();
    refreshStatus();
  });

  placeSearch.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    searchAddressFromInput();
  });

  searchClear.addEventListener("click", () => {
    clearSearchState({ focus: true });
    syncSelectedWithFiltered();
    renderSheet();
    renderMarkers();
    refreshStatus();
  });

  addressResults.addEventListener("click", (event) => {
    const button = event.target.closest("[data-address-index]");
    if (!button) return;
    selectAddressCandidate(Number(button.dataset.addressIndex));
  });

  document.querySelectorAll("[data-city]").forEach((button) => {
    button.addEventListener("click", () => {
      const city = cities[button.dataset.city];
      if (!city) return;
      map.setView(city.center, city.zoom);
      showToast(`${t(city.label)} ${t("중심으로 이동했어.")}`);
      setSearchPanel(false);
    });
  });

  sheet.addEventListener("submit", (event) => {
    const form = event.target.closest("#reportForm");
    if (!form) return;
    event.preventDefault();
    submitReport(form);
  });

  sheet.addEventListener("click", (event) => {
    const sheetCollapse = event.target.closest("[data-sheet-collapse]");
    if (sheetCollapse) {
      setSheetMode("collapsed");
      return;
    }

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

    const focusAddressButton = event.target.closest("[data-focus-address-search]");
    if (focusAddressButton) {
      setSearchPanel(true, true);
      showToast("주소나 지명을 검색하면 그 위치로 바로 제보할 수 있어.");
      return;
    }

    const mapCenterButton = event.target.closest("[data-use-map-center]");
    if (mapCenterButton) {
      selectMapCenterForReport();
      return;
    }

    const currentLocationButton = event.target.closest("[data-use-current-location]");
    if (currentLocationButton) {
      selectCurrentLocationForReport();
      return;
    }

    const reportPlaceButton = event.target.closest("[data-report-place]");
    if (reportPlaceButton) {
      const place = placesById.get(reportPlaceButton.dataset.reportPlace);
      if (!place) return;
      state.selectedId = place.id;
      rememberPlace(state.selectedId);
      map.setView([place.lat, place.lng], 15);
      renderSheet();
      renderMarkers();
      return;
    }

    const saveButton = event.target.closest("[data-save]");
    if (saveButton) {
      toggleSave(saveButton.dataset.save);
      return;
    }

    const dailyCheckButton = event.target.closest("[data-daily-check]");
    if (dailyCheckButton) {
      toggleDailyCheck(dailyCheckButton.dataset.dailyCheck);
      return;
    }

    const openPanelButton = event.target.closest("[data-open-panel]");
    if (openPanelButton) {
      setPanel(openPanelButton.dataset.openPanel);
      return;
    }

    const copyBriefButton = event.target.closest("[data-copy-brief]");
    if (copyBriefButton) {
      copySavedBrief();
      return;
    }

    const reportChip = event.target.closest("[data-report-tag]");
    if (reportChip) {
      reportChip.classList.toggle("is-selected");
      reportChip.setAttribute("aria-pressed", String(reportChip.classList.contains("is-selected")));
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
  setActiveNav(panel);

  if (panel === "near") {
    const place = getSelectedPlace();
    if (place) map.setView([place.lat, place.lng], 14);
  }

  renderSheet();
}

function setActiveNav(panel) {
  document.querySelectorAll(".nav-button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.action === panel);
  });
}

function setSearchPanel(open, focus = false) {
  searchPanel.hidden = !open;
  searchToggle.setAttribute("aria-expanded", String(open));
  searchToggle.setAttribute("aria-label", t(open ? "검색 닫기" : "검색 열기"));
  if (open && focus) {
    window.requestAnimationFrame(() => placeSearch.focus());
  }
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
  const isCollapsed = state.sheetMode === "collapsed";
  sheet.classList.toggle("is-collapsed", isCollapsed);
  sheet.classList.toggle("is-expanded", !isCollapsed);
}

function toggleLanguage() {
  state.language = state.language === "ja" ? "ko" : "ja";
  currentLanguage = state.language;
  writeJson(languageStorageKey, state.language);
  filteredPlacesCacheKey = "";
  applyStaticLanguage();
  renderMapQuickRail();
  renderAddressResults();
  renderSheet();
  renderMarkers();
  refreshStatus();
  showToast(state.language === "ja" ? "일본어로 전환했어." : "한국어로 전환했어.");
}

function applyStaticLanguage() {
  const japanese = isJapanese();
  document.documentElement.lang = japanese ? "ja" : "ko";
  document.title = t("스미맵 - 일본 생활 제보 지도");

  const description = t("일본에서 사는 한국인을 위한 충전, 화장실, 쉬기 좋은 곳, 한국어 대응, 응대 불편 제보 지도.");
  document.querySelector("meta[name='description']")?.setAttribute("content", description);
  document.querySelector("meta[property='og:title']")?.setAttribute("content", document.title);
  document.querySelector("meta[property='og:description']")?.setAttribute("content", description);
  document.querySelector("meta[name='twitter:title']")?.setAttribute("content", document.title);
  document.querySelector("meta[name='twitter:description']")?.setAttribute("content", description);
  document.querySelector("#map")?.setAttribute("aria-label", t("스미맵 지도"));
  document.querySelector(".topbar")?.setAttribute("aria-label", t("상단 탐색"));
  document.querySelector(".brand")?.setAttribute("aria-label", t("스미맵 홈"));
  document.querySelector(".brand strong").textContent = t("스미맵");
  document.querySelector(".brand small").textContent = t("일본 생활 제보 지도");

  locateButton?.setAttribute("aria-label", t("현재 위치로 이동"));
  searchToggle?.setAttribute("aria-label", t(searchPanel?.hidden ? "검색 열기" : "검색 닫기"));
  languageToggle?.setAttribute("aria-label", japanese ? t("한국어로 보기") : t("일본어로 번역"));
  languageToggle?.setAttribute("aria-pressed", String(japanese));
  const languageCode = languageToggle?.querySelector(".language-code");
  if (languageCode) languageCode.textContent = japanese ? "한" : "日";

  if (placeSearch) placeSearch.placeholder = t("주소·지명 검색 또는 태그 검색");
  searchClear?.setAttribute("aria-label", t("검색어 지우기"));
  if (addressSearchButton) addressSearchButton.textContent = t("주소검색");
  document.querySelector(".city-strip")?.setAttribute("aria-label", t("도시 빠른 이동"));
  document.querySelectorAll("[data-city]").forEach((button) => {
    const city = cities[button.dataset.city];
    if (city) button.textContent = t(city.label);
  });
  mapQuickRail?.setAttribute("aria-label", t("긴급 상황 바로 보기"));
  document.querySelector(".bottom-nav")?.setAttribute("aria-label", t("주요 메뉴"));
  document.querySelectorAll(".nav-button").forEach((button) => {
    const span = button.querySelector("span");
    const labels = { near: "근처", filters: "필터", report: "제보", saved: "저장", guide: "정보" };
    if (span && labels[button.dataset.action]) span.textContent = t(labels[button.dataset.action]);
  });
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
    <button class="sheet-grip" type="button" data-sheet-toggle aria-label="${escapeAttr(t("지도 보기"))}"></button>
    <div class="sheet-head" data-sheet-toggle>
      <div>
        <h1>${t("지금 확인할 생활 스팟")}</h1>
        <p>${t("충전, 화장실, 쉬기, 한국어 대응, 응대 불편 신호를 한 번에 봐요.")}</p>
      </div>
      <div class="sheet-head-actions">
        <button class="sheet-mini-action" type="button" data-sheet-collapse>${t("지도 크게")}</button>
        <span class="compact-stat">${countLabel(list.length, "곳")}</span>
      </div>
    </div>
    ${renderScenarioRail()}
    <div class="filter-row">
      ${categories.map((item) => filterChip(item)).join("")}
    </div>
    ${renderContextTools()}
    ${renderDailyRoutine(list, place)}
    ${place ? renderPlaceDetail(place) : renderEmptyState()}
    ${list.length ? `<div class="place-list">${list.map((item) => renderPlaceCard(item)).join("")}</div>` : ""}
  `;
}

function renderFilters() {
  return `
    <button class="sheet-grip" type="button" data-sheet-toggle aria-label="${escapeAttr(t("지도 보기"))}"></button>
    <div class="sheet-head" data-sheet-toggle>
      <div>
        <h2>${t("필터")}</h2>
        <p>${t("상황별로 빠르게 좁혀요. 응대 불편은 낙인이 아니라 최근 제보 신호로만 봐요.")}</p>
      </div>
      <button class="sheet-mini-action" type="button" data-sheet-collapse>${t("지도 크게")}</button>
    </div>
    ${renderScenarioRail()}
    <div class="filter-row">
      ${categories.map((item) => filterChip(item)).join("")}
    </div>
    ${renderContextTools()}
    <ul class="note-list">
      <li>${t("충전은 콘센트 위치와 직원 허락 여부를 같이 봐야 정확해요.")}</li>
      <li>${t("화장실은 단독 이용 가능 여부가 장소마다 달라요.")}</li>
      <li>${t("응대 불편은 1건으로 공개하지 않고 반복 신호일 때만 약하게 표시하는 전제로 설계했어요.")}</li>
    </ul>
  `;
}

function renderReport() {
  const place = getSelectedPlace();
  const visibleReports = getVisibleReports();
  const nearbyChoices = getFilteredPlaces()
    .filter((item) => item.id !== place?.id)
    .slice(0, 3);
  const mainTags = ["charge", "restroom", "rest", "korean", "rain", "caution"];
  const extraTags = reportTags.filter((tag) => !mainTags.includes(tag.key));
  return `
    <button class="sheet-grip" type="button" data-sheet-toggle aria-label="${escapeAttr(t("지도 보기"))}"></button>
    <div class="sheet-head" data-sheet-toggle>
      <div>
        <h2>${t("간단 제보")}</h2>
        <p>${t("주소를 검색해 장소를 먼저 잡고, 확인한 신호만 눌러요.")}</p>
      </div>
      <button class="sheet-mini-action" type="button" data-sheet-collapse>${t("지도 보기")}</button>
    </div>
    <form class="report-form" id="reportForm">
      <div class="form-section">
        <h3>${t("장소")}</h3>
        <input type="hidden" name="placeId" value="${escapeAttr(place?.id || "")}">
        <div class="report-place-actions">
          <button class="text-button" type="button" data-focus-address-search>${icon("search")}${t("주소검색")}</button>
          <button class="text-button" type="button" data-use-map-center>${icon("crosshair")}${t("지도 중심")}</button>
          <button class="text-button" type="button" data-use-current-location>${icon("locate-fixed")}${t("내 위치")}</button>
          ${place?.custom ? `<a class="text-button" href="${mapsUrl(place)}" target="_blank" rel="noreferrer">${icon("navigation")}${t("지도 확인")}</a>` : ""}
        </div>
        <div class="report-place-box">
          <span class="place-title-emoji" aria-hidden="true">${categoryEmoji(place?.category)}</span>
          <div>
            <strong>${escapeHtml(place ? placeText(place, "name") : t("장소 선택 필요"))}</strong>
            <p>${escapeHtml(place ? placeText(place, "area") : t("주소나 지명을 검색해서 위치를 잡아주세요."))}</p>
          </div>
        </div>
        ${nearbyChoices.length ? `
          <div class="quick-place-row" aria-label="${escapeAttr(t("빠른 장소 선택"))}">
            ${nearbyChoices.map((item) => `
              <button type="button" class="${item.id === place?.id ? "is-active" : ""}" data-report-place="${escapeAttr(item.id)}" aria-pressed="${item.id === place?.id ? "true" : "false"}">
                <span aria-hidden="true">${categoryEmoji(item.category)}</span>${escapeHtml(shortPlaceName(placeText(item, "name")))}
              </button>
            `).join("")}
          </div>
        ` : ""}
      </div>
      <div class="form-section">
        <h3>${t("확인한 내용")}</h3>
        <p>${t("한두 개만 눌러도 충분해요. 응대 불편은 낙인이 아니라 방문 전 주의 신호로만 써요.")}</p>
        <div class="report-grid">
          ${mainTags.map((key) => reportTagsByKey.get(key)).filter(Boolean).map((tag) => `
            <button type="button" class="chip report-chip ${tag.danger ? "danger" : ""}" data-report-tag="${escapeAttr(tag.key)}" aria-label="${escapeAttr(t(tag.label))}" aria-pressed="false">
              <span class="report-emoji" aria-hidden="true">${tag.emoji}</span>
              <span>${t(tag.label)}</span>
            </button>
          `).join("")}
        </div>
        <details class="report-extra">
          <summary>${t("추가 옵션")}</summary>
          <div class="report-grid is-extra">
            ${extraTags.map((tag) => `
              <button type="button" class="chip report-chip ${tag.danger ? "danger" : ""}" data-report-tag="${escapeAttr(tag.key)}" aria-label="${escapeAttr(t(tag.label))}" aria-pressed="false">
                <span class="report-emoji" aria-hidden="true">${tag.emoji}</span>
                <span>${t(tag.label)}</span>
              </button>
            `).join("")}
          </div>
        </details>
      </div>
      <div class="form-section">
        <h3>${t("방문 시점")}</h3>
        <select class="mini-field" name="recency" aria-label="${escapeAttr(t("방문 시점"))}">
          <option value="today">${t("오늘")}</option>
          <option value="week">${t("최근 1주일")}</option>
          <option value="month">${t("최근 1개월")}</option>
          <option value="old">${t("이전 기억")}</option>
        </select>
      </div>
      <button class="primary-button" type="submit" data-submit-report>
        ${icon("send")}
        ${visibleReports.length ? t("바로 반영") : t("첫 제보 남기기")}
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
    <button class="sheet-grip" type="button" data-sheet-toggle aria-label="${escapeAttr(t("지도 보기"))}"></button>
    <div class="sheet-head" data-sheet-toggle>
      <div>
        <h2>${t("저장한 곳")}</h2>
        <p>${t("저장한 곳과 방금 확인한 곳을 빠르게 다시 열어요.")}</p>
      </div>
      <div class="sheet-head-actions">
        <button class="sheet-mini-action" type="button" data-sheet-collapse>${t("지도 크게")}</button>
        <span class="compact-stat">${countLabel(savedPlaces.length, "곳")}</span>
      </div>
    </div>
    ${renderSavedBrief(savedPlaces)}
    <div class="place-section-title">${t("저장한 곳")}</div>
    <div class="place-list compact-list">
      ${savedPlaces.length ? savedPlaces.map((item) => renderPlaceCard(item)).join("") : `<div class="place-card"><h3>${t("아직 저장한 장소가 없어요")}</h3><p>${t("장소 상세에서 저장을 누르면 여기에 모여요.")}</p></div>`}
    </div>
    <div class="place-section-title">${t("최근 본 곳")}</div>
    <div class="place-list compact-list">
      ${recentPlaces.length ? recentPlaces.map((item) => renderPlaceCard(item)).join("") : `<div class="place-card"><h3>${t("최근 확인한 장소가 없어요")}</h3><p>${t("지도를 누르거나 장소 카드를 열면 자동으로 기록돼요.")}</p></div>`}
    </div>
  `;
}

function renderGuide() {
  return `
    <button class="sheet-grip" type="button" data-sheet-toggle aria-label="${escapeAttr(t("지도 보기"))}"></button>
    <div class="sheet-head" data-sheet-toggle>
      <div>
        <h2>${t("스미맵 기준")}</h2>
        <p>${t("일본 생활 중 곤란한 순간을 빠르게 피하기 위한 한국어 지도예요.")}</p>
      </div>
      <button class="sheet-mini-action" type="button" data-sheet-collapse>${t("지도 크게")}</button>
    </div>
    <ul class="note-list">
      <li>${t("응대 불편은 상대를 공격하는 표시가 아니라, 방문자가 조심할 수 있게 만드는 약한 신호예요.")}</li>
      <li>${t("제보는 바로 반영하되 자유 텍스트는 열지 않아 애드센스와 운영 리스크를 낮춰요.")}</li>
      <li>${t("허위 의심이 누적되고 동의보다 많아지면 해당 제보는 자동으로 신호 계산에서 빠지는 구조예요.")}</li>
      <li>${t("도쿄는 출구와 환승, 오사카는 지하 동선, 후쿠오카는 짧은 이동, 교토는 관광 혼잡을 같이 봐요.")}</li>
    </ul>
    <div class="detail-actions">
      <a class="text-button" href="/guide/">${icon("book-open")}${t("운영 기준")}</a>
      <a class="text-button" href="/cities/">${icon("map")}${t("도시 가이드")}</a>
      <a class="text-button" href="/policy/">${icon("shield-check")}${t("제보 정책")}</a>
    </div>
  `;
}

function renderDailyRoutine(list, selected) {
  const done = dailyChecks.filter((item) => state.checks[item.key]).length;
  const progress = Math.round((done / dailyChecks.length) * 100);
  const recommendations = (list.length ? list : places)
    .filter((place) => place.id !== selected?.id)
    .slice(0, 2);

  return `
    <section class="routine-card">
      <div class="routine-head">
        <div>
          <span>${t("오늘 생활 루틴")}</span>
          <strong>${t("지금 바로 챙길 것")}</strong>
          <p>${t("체크 진행")} ${done}/${dailyChecks.length}</p>
        </div>
        <div class="routine-progress" aria-label="${escapeAttr(`${t("체크 진행")} ${done}/${dailyChecks.length}`)}">
          <span style="width: ${progress}%"></span>
        </div>
      </div>
      <div class="check-list">
        ${dailyChecks.map((item) => {
          const checked = Boolean(state.checks[item.key]);
          return `
            <button class="check-row ${checked ? "is-done" : ""}" type="button" data-daily-check="${escapeAttr(item.key)}" aria-pressed="${checked ? "true" : "false"}">
              <span class="check-emoji" aria-hidden="true">${item.emoji}</span>
              <span>
                <strong>${t(item.label)}</strong>
                <small>${t(item.hint)}</small>
              </span>
              <em>${checked ? t("완료") : t("체크")}</em>
            </button>
          `;
        }).join("")}
      </div>
      ${recommendations.length ? `
        <div class="related-inline">
          <strong>${t("이어서 보기 좋은 곳")}</strong>
          <div class="mini-place-row">
            ${recommendations.map((place) => renderMiniPlace(place)).join("")}
          </div>
        </div>
      ` : ""}
      <div class="detail-actions compact-actions">
        <button class="text-button" type="button" data-open-panel="saved">${icon("bookmark")}${t("저장 보기")}</button>
        <button class="text-button" type="button" data-open-panel="report">${icon("plus")}${t("제보하기")}</button>
      </div>
    </section>
  `;
}

function renderSavedBrief(savedPlaces) {
  const preview = savedPlaces.slice(0, 3);
  return `
    <section class="travel-brief-card ${preview.length ? "" : "is-empty"}">
      <div>
        <span>${t("저장 브리프")}</span>
        <strong>${preview.length ? preview.map((place) => shortPlaceName(placeText(place, "name"))).join(" · ") : t("저장한 장소 없음")}</strong>
        <p>${preview.length ? t("오늘 다시 열어볼 장소를 한 문장씩 묶어둬요.") : t("장소를 저장하면 이동 전에 다시 볼 수 있는 브리프가 생겨요.")}</p>
      </div>
      <button class="text-button" type="button" data-copy-brief ${preview.length ? "" : "disabled"}>
        ${icon("copy")}
        ${t("브리프 복사")}
      </button>
    </section>
  `;
}

function renderPlacePlaybook(place) {
  const tips = categoryUseTips(place.category);
  return `
    <div class="playbook-strip">
      <div class="playbook-head">
        <span>${t("3단계 사용 팁")}</span>
        <strong>${escapeHtml(shortPlaceName(placeText(place, "name")))}</strong>
      </div>
      <ol class="playbook-list">
        <li><span>1</span><div><strong>${t("먼저 확인")}</strong><p>${escapeHtml(t(tips.check))}</p></div></li>
        <li><span>2</span><div><strong>${t("현장")}</strong><p>${escapeHtml(t(tips.onsite))}</p></div></li>
        <li><span>3</span><div><strong>${t("제보")}</strong><p>${escapeHtml(t(tips.report))}</p></div></li>
      </ol>
    </div>
  `;
}

function renderRelatedPlaces(place) {
  const currentTags = new Set(getLiveTags(place));
  const related = places
    .filter((item) => item.id !== place.id)
    .map((item) => {
      const tags = getLiveTags(item);
      const overlap = tags.filter((tag) => currentTags.has(tag)).length;
      const score = (item.city === place.city ? 5 : 0) + (item.category === place.category ? 3 : 0) + overlap;
      return { item, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ item }) => item);

  if (!related.length) return "";

  return `
    <div class="related-block">
      <div class="related-title">${t("이어서 보기 좋은 곳")}</div>
      <div class="mini-place-row">
        ${related.map((item) => renderMiniPlace(item)).join("")}
      </div>
    </div>
  `;
}

function renderMiniPlace(place) {
  return `
    <button type="button" class="mini-place" data-place-id="${escapeAttr(place.id)}">
      <span aria-hidden="true">${categoryEmoji(place.category)}</span>
      <strong>${escapeHtml(shortPlaceName(placeText(place, "name")))}</strong>
      <small>${escapeHtml(distanceLabel(place))} · ${escapeHtml(placeText(place, "area"))}</small>
    </button>
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
          <h3><span class="place-title-emoji" aria-hidden="true">${categoryEmoji(place.category)}</span>${escapeHtml(placeText(place, "name"))}</h3>
          <p>${escapeHtml(placeText(place, "area"))} · ${escapeHtml(placeText(place, "kind"))}</p>
        </div>
        <span class="badge ${caution ? "caution" : reports.length ? "info" : "good"}">${escapeHtml(getLiveTrust(place))}</span>
      </div>
      <div class="tag-row" aria-label="${escapeAttr(t("장소"))}">
        ${tags.map((tag) => `<span class="badge ${tag === "응대 불편" ? "caution" : tag.includes("충전") || tag.includes("와이파이") ? "info" : tag.includes("비") || tag.includes("허락") ? "warn" : "good"}"><span class="badge-emoji" aria-hidden="true">${emojiForTag(tag)}</span>${escapeHtml(tagText(tag))}</span>`).join("")}
      </div>
      <div class="detail-actions">
        <button class="text-button" type="button" data-save="${place.id}">
          ${icon(saved ? "bookmark-check" : "bookmark")}
          ${saved ? t("저장됨") : t("저장")}
        </button>
        <a class="text-button" href="${mapsUrl(place)}" target="_blank" rel="noreferrer">
          ${icon("navigation")}
          ${t("길찾기")}
        </a>
      </div>
      <div class="detail-actions single">
        <button class="primary-button" type="button" data-open-report>
          ${icon("plus")}
          ${t("이 장소 바로 제보")}
        </button>
      </div>
      <div class="use-summary">
        <div>
          <span>${t("거리감")}</span>
          <strong>${escapeHtml(distanceLabel(place))}</strong>
        </div>
        <div>
          <span>${t("최근 확인")}</span>
          <strong>${escapeHtml(placeText(place, "lastSeen") || t("제보 필요"))}</strong>
        </div>
        <div>
          <span>${t("혼잡")}</span>
          <strong>${escapeHtml(placeText(place, "crowd") || t("현장 확인"))}</strong>
        </div>
        <div>
          <span>${t("신뢰도")}</span>
          <strong>${trustScore}%</strong>
        </div>
      </div>
      <div class="decision-card ${caution ? "is-caution" : ""}">
        <div>
          <span>${t("이럴 때 좋아요")}</span>
          <strong>${escapeHtml(placeText(place, "bestFor") || t("잠깐 확인이 필요할 때"))}</strong>
        </div>
        <p>${escapeHtml(placeText(place, "watchout") || t("운영 시간과 현장 안내를 먼저 확인해요."))}</p>
      </div>
      <div class="signal-grid">
        <div class="signal"><strong>${signals.charge}</strong><span>${t("충전 제보")}</span></div>
        <div class="signal"><strong>${signals.restroom}</strong><span>${t("화장실 제보")}</span></div>
        <div class="signal"><strong>${signals.rest}</strong><span>${t("쉬기 제보")}</span></div>
        <div class="signal"><strong>${signals.korean}</strong><span>${t("한국어 신호")}</span></div>
        <div class="signal"><strong>${signals.caution}</strong><span>${t("응대 불편")}</span></div>
        <div class="signal"><strong>${totalSignals(place)}</strong><span>${t("누적 신호")}</span></div>
      </div>
      <ul class="note-list">
        ${placeNotes(place).map((note) => `<li>${escapeHtml(note)}</li>`).join("")}
      </ul>
      ${renderPlacePlaybook(place)}
      ${renderRelatedPlaces(place)}
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
          <h3><span class="place-title-emoji" aria-hidden="true">${categoryEmoji(place.category)}</span>${escapeHtml(placeText(place, "name"))}</h3>
          <p>${escapeHtml(placeText(place, "area"))} · ${getLiveTags(place).slice(0, 3).map((tag) => `${emojiForTag(tag)} ${escapeHtml(tagText(tag))}`).join(" · ")}</p>
          <small class="card-meta">${escapeHtml(distanceLabel(place))} · ${escapeHtml(placeText(place, "lastSeen") || t("최근 확인 필요"))} · ${t("신뢰")} ${getTrustScore(place)}%</small>
        </div>
        <span class="badge ${caution ? "caution" : "info"}">${escapeHtml(getLiveTrust(place))}</span>
      </div>
    </button>
  `;
}

function renderEmptyState() {
  const label = categoriesByKey.get(state.filter)?.label || "조건";
  return `
    <section class="place-card empty-card">
      <h3>${t("조건에 맞는 장소가 아직 없어요")}</h3>
      <p>${state.query ? `"${escapeHtml(state.query)}" ${t("검색 결과가 없어요.")} ` : ""}${t(label)} ${t("제보를 남기면 바로 지도에 반영돼요.")}</p>
      <button class="primary-button" type="button" data-open-report>
        ${icon("plus")}
        ${t("새 제보 남기기")}
      </button>
    </section>
  `;
}

function renderScenarioRail() {
  return `
    <div class="scenario-rail" aria-label="${escapeAttr(t("빠른 상황"))}">
      ${scenarios.map((scenario) => `
        <button type="button" class="scenario-chip ${state.activeScenario === scenario.key ? "is-active" : ""}" data-scenario="${scenario.key}">
          <span class="scenario-emoji" aria-hidden="true">${scenario.emoji}</span>
          <span>${t(scenario.label)}</span>
          <small>${t(scenario.hint)}</small>
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
          <strong>${t("최근 제보")}</strong>
          <span>${t("아직 실시간 제보 없음")}</span>
        </div>
      </div>
    `;
  }

  return `
    <div class="live-feed">
      <div class="feed-head">
        <strong>${t("최근 제보")}</strong>
        <span>${t("바로 반영됨")}</span>
      </div>
      ${reports.map((report) => `
        <article class="feed-item">
          <div>
            <p>${report.tags.map((tag) => `${emojiForTag(tag)} ${escapeHtml(tagText(tag))}`).join(" · ")}</p>
            <small>${formatRecency(report.recency)} · ${t("동의")} ${report.agrees} · ${t("허위 의심")} ${report.disputes}</small>
          </div>
          <div class="feed-actions">
            <button type="button" data-report-id="${escapeAttr(report.id)}" data-report-vote="agree">${t("동의")}</button>
            <button type="button" data-report-id="${escapeAttr(report.id)}" data-report-vote="dispute">${t("허위 의심")}</button>
          </div>
        </article>
      `).join("")}
    </div>
  `;
}

function filterChip(item) {
  return `<button type="button" class="chip ${state.filter === item.key ? "is-active" : ""}" data-filter="${item.key}"><span class="chip-emoji" aria-hidden="true">${item.emoji}</span><span>${t(item.label)}</span></button>`;
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
    marker.on("click", (event) => {
      if (event?.originalEvent) L.DomEvent.stopPropagation(event.originalEvent);
      selectPlace(place.id, false);
    });
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
  setActiveNav("near");
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
  clearSearchState();
  const list = getFilteredPlaces();
  if (list.length) {
    state.selectedId = list[0].id;
    rememberPlace(list[0].id);
    map.setView([list[0].lat, list[0].lng], 14);
  }
  showToast(`${t(scenario.label)} ${t("상황으로 좁혔어.")}`);
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
  const placeId = String(data.get("placeId") || "");
  if (!validPlaceIds.has(placeId)) {
    showToast("주소검색으로 장소를 먼저 선택해줘.");
    return;
  }

  const report = {
    id: createId(),
    placeId,
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
  clearSearchState();
  setSearchPanel(false);
  renderMapQuickRail();
  setActiveNav("near");
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

function toggleDailyCheck(key) {
  if (!dailyChecks.some((item) => item.key === key)) return;
  state.checks = { ...state.checks, [key]: !state.checks[key] };
  writeJson("sumimap:checks", state.checks);
  showToast(state.checks[key] ? "오늘 체크에 담았어." : "오늘 체크에서 뺐어.");
  renderSheet();
}

async function copySavedBrief() {
  const savedPlaces = state.saved.map((id) => placesById.get(id)).filter(Boolean);
  if (!savedPlaces.length) {
    showToast("저장한 장소가 있어야 브리프를 만들 수 있어요.");
    return;
  }

  try {
    await copyText(savedBriefText(savedPlaces));
    showToast("브리프를 복사했어.");
  } catch {
    showToast("복사가 막혔어. 브라우저 권한을 확인해줘.");
  }
}

function savedBriefText(savedPlaces) {
  const lines = savedPlaces.slice(0, 8).map((place, index) => {
    const tags = getLiveTags(place).slice(0, 3).map(tagText).join(", ");
    return `${index + 1}. ${placeText(place, "name")} - ${placeText(place, "area")} / ${tags} / ${mapsUrl(place)}`;
  });
  return [`스미맵 저장 브리프`, ...lines].join("\n");
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Some in-app browsers expose Clipboard API but block it until a fallback is used.
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "-9999px";
  document.body.append(textarea);
  textarea.select();
  const ok = document.execCommand("copy");
  textarea.remove();
  if (!ok) throw new Error("copy failed");
}

function categoryUseTips(category) {
  const tips = {
    charge: {
      check: "콘센트 위치와 직원 허락 필요 여부를 먼저 봐요.",
      onsite: "주문·이용 규칙을 확인하고 짧게 충전해요.",
      report: "충전 가능 여부가 바뀌면 제보로 신호를 남겨요."
    },
    restroom: {
      check: "단독 이용 가능인지, 매장 이용이 필요한지 먼저 봐요.",
      onsite: "동선이 복잡하면 직원 안내 표지를 먼저 확인해요.",
      report: "대기나 이용 제한이 있으면 바로 표시해요."
    },
    rest: {
      check: "비 피하기·잠깐 쉬기·장시간 비추천 신호를 같이 봐요.",
      onsite: "혼잡하면 오래 머물기보다 다음 후보를 열어둬요.",
      report: "머물기 애매한 분위기는 응대 불편이 아니라 이용 팁으로 남겨요."
    },
    korean: {
      check: "한국어 메뉴·응대·주변 생활권 신호를 함께 봐요.",
      onsite: "가능하면 일본어 안내와 현장 표기도 같이 확인해요.",
      report: "한국어 대응이 실제와 다르면 최신 신호로 바로 고쳐요."
    },
    caution: {
      check: "불편 신호는 단정이 아니라 최근 참고 신호로만 봐요.",
      onsite: "무리하게 머물지 말고 가까운 대체 장소를 같이 열어둬요.",
      report: "괜찮았거나 달라졌다면 동의·허위 의심으로 균형을 맞춰요."
    }
  };

  return tips[category] || {
    check: "이 장소는 이동 전에 신호와 최근 제보를 같이 봐요.",
    onsite: "도착하면 운영 시간과 현장 안내를 한 번 더 확인해요.",
    report: "달라진 점이 있으면 두 번만 눌러 바로 제보해요."
  };
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
    state.language,
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
      [
        place.name,
        place.area,
        place.kind,
        placeText(place, "name"),
        placeText(place, "area"),
        placeText(place, "kind"),
        liveTags.join(" "),
        liveTags.map(tagText).join(" ")
      ].join(" ").toLowerCase().includes(normalized);
    return filterMatch && queryMatch;
  });
  filteredPlacesCacheKey = cacheKey;
  filteredPlacesCache = sortPlacesForContext(filtered);
  return filteredPlacesCache;
}

function refreshStatus() {
  const visible = getFilteredPlaces();
  const scenario = scenariosByKey.get(state.activeScenario);
  statusPill.textContent = scenario ? `${scenario.emoji} ${t(scenario.label)} · ${countLabel(visible.length, "곳")}` : `📍 ${countLabel(visible.length, "곳")} ${t("표시")} · ${t("바로 제보")}`;
  if (state.userPosition && !scenario) {
    statusPill.textContent = `📍 ${t("내 위치 기준")} · ${countLabel(visible.length, "곳")}`;
  }
}

function renderContextTools() {
  const labels = [];
  const scenario = scenariosByKey.get(state.activeScenario);
  const filter = state.filter !== "all" ? categoriesByKey.get(state.filter) : null;
  if (scenario) labels.push(`${scenario.emoji} ${t(scenario.label)}`);
  if (filter && !scenario) labels.push(`${filter.emoji} ${t(filter.label)}`);
  if (state.query) labels.push(`${t("검색")} "${escapeHtml(state.query)}"`);
  if (state.userPosition) labels.push(t("내 위치 기준"));
  if (!labels.length) return "";

  return `
    <div class="context-tools" aria-label="${escapeAttr(t("현재 보기 조건"))}">
      <span>${labels.join(" · ")}</span>
      <div>
        ${(state.filter !== "all" || state.query || state.activeScenario) ? `<button type="button" data-reset-context>${t("조건 해제")}</button>` : ""}
        ${state.userPosition ? `<button type="button" data-clear-location>${t("위치 해제")}</button>` : ""}
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

async function searchAddressFromInput() {
  const query = placeSearch.value.trim();
  if (query.length < 2) {
    showToast("주소나 지명을 두 글자 이상 입력해줘.");
    return;
  }

  const searchSeq = addressSearchSeq + 1;
  addressSearchSeq = searchSeq;
  state.query = query;
  state.addressLoading = true;
  state.addressMessage = "";
  state.addressCandidates = [];
  updateSearchClear();
  renderAddressResults();
  addressSearchButton.disabled = true;

  try {
    const params = new URLSearchParams({
      format: "jsonv2",
      q: query,
      countrycodes: "jp",
      limit: "6",
      addressdetails: "1",
      "accept-language": isJapanese() ? "ja" : "ko"
    });
    const response = await fetch(`${geocodeSearchUrl}?${params.toString()}`, {
      headers: { Accept: "application/json" }
    });
    if (!response.ok) throw new Error(`geocode ${response.status}`);
    const results = await response.json();
    if (searchSeq !== addressSearchSeq) return;
    state.addressCandidates = results
      .map(normalizeAddressCandidate)
      .filter(Boolean)
      .filter((candidate) => isPointInJapan(candidate.lat, candidate.lng))
      .slice(0, 5);
    state.addressMessage = state.addressCandidates.length
      ? "검색 결과를 눌러 제보 장소로 잡아주세요."
      : "일본 주소나 역 이름으로 다시 검색해보세요.";
  } catch (error) {
    if (searchSeq !== addressSearchSeq) return;
    state.addressMessage = "주소검색이 잠시 불안정해요. 지명 또는 역 이름으로 다시 시도해줘.";
    state.addressCandidates = [];
  } finally {
    if (searchSeq === addressSearchSeq) {
      state.addressLoading = false;
      addressSearchButton.disabled = false;
      renderAddressResults();
    }
  }
}

function renderAddressResults() {
  if (!addressResults) return;
  if (state.addressLoading) {
    addressResults.hidden = false;
    addressResults.innerHTML = `<div class="address-result is-muted">${t("주소를 찾는 중...")}</div>`;
    return;
  }

  if (!state.addressCandidates.length && !state.addressMessage) {
    addressResults.hidden = true;
    addressResults.innerHTML = "";
    return;
  }

  addressResults.hidden = false;
  addressResults.innerHTML = `
    ${state.addressMessage ? `<div class="address-result-hint">${escapeHtml(t(state.addressMessage))}</div>` : ""}
    ${state.addressCandidates.map((candidate, index) => `
      <button type="button" class="address-result" data-address-index="${index}">
        <strong>${escapeHtml(candidate.title)}</strong>
        <span>${escapeHtml(candidate.address)}</span>
      </button>
    `).join("")}
  `;
}

function clearSearchState({ focus = false } = {}) {
  addressSearchSeq += 1;
  state.query = "";
  state.addressCandidates = [];
  state.addressLoading = false;
  state.addressMessage = "";
  addressSearchButton.disabled = false;
  placeSearch.value = "";
  updateSearchClear();
  renderAddressResults();
  if (focus) {
    window.requestAnimationFrame(() => placeSearch.focus());
  }
}

function normalizeAddressCandidate(item) {
  const lat = Number(item?.lat);
  const lng = Number(item?.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  const address = String(item?.display_name || "").replace(/\s+/g, " ").trim();
  const title =
    item?.name ||
    item?.address?.amenity ||
    item?.address?.shop ||
    item?.address?.tourism ||
    item?.address?.building ||
    item?.address?.station ||
    item?.address?.road ||
    item?.address?.neighbourhood ||
    item?.address?.quarter ||
    item?.address?.suburb ||
    item?.address?.city ||
    item?.address?.town ||
    item?.address?.village ||
    item?.address?.county ||
    item?.address?.state ||
    t("검색한 위치");

  return {
    id: safeId(`addr-${item?.osm_type || "point"}-${item?.osm_id || `${lat.toFixed(5)}-${lng.toFixed(5)}`}`, createId()),
    title: String(title).trim(),
    address: address || `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
    lat,
    lng
  };
}

function selectAddressCandidate(index) {
  const candidate = state.addressCandidates[index];
  if (!candidate) return;
  const place = upsertCustomPlace(candidate);
  activateReportPlace(place, 16, "주소를 제보 장소로 잡았어. 이제 신호만 눌러주면 돼.");
}

function activateReportPlace(place, zoom = 16, message = "") {
  state.selectedId = place.id;
  state.activePanel = "report";
  state.sheetMode = "expanded";
  state.activeScenario = "";
  rememberPlace(place.id);
  map.setView([place.lat, place.lng], zoom);
  setSearchPanel(false);
  setActiveNav("report");
  renderMapQuickRail();
  renderSheet();
  renderMarkers();
  refreshStatus();
  if (message) showToast(message);
}

async function selectMapCenterForReport() {
  const center = getVisibleMapCenter();
  await selectPointForReport(center.lat, center.lng, "지도 중심");
}

function selectHeldMapPointForReport(event) {
  if (state.activePanel !== "report") return;
  if (!event?.latlng || !Number.isFinite(event.latlng.lat) || !Number.isFinite(event.latlng.lng)) return;
  selectPointForReport(event.latlng.lat, event.latlng.lng, "길게 누른 위치");
}

function getVisibleMapCenter() {
  const mapRect = map.getContainer().getBoundingClientRect();
  const sheetRect = sheet.getBoundingClientRect();
  const usableBottom =
    sheetRect.top > mapRect.top && sheetRect.top < mapRect.bottom
      ? sheetRect.top
      : mapRect.bottom;
  const visibleHeight = Math.max(120, usableBottom - mapRect.top);
  const point = L.point(
    mapRect.width / 2,
    Math.min(usableBottom - mapRect.top - 24, visibleHeight / 2)
  );
  return map.containerPointToLatLng(point);
}

async function selectCurrentLocationForReport() {
  if (state.userPosition) {
    await selectPointForReport(state.userPosition.lat, state.userPosition.lng, "내 위치");
    return;
  }

  if (!navigator.geolocation) {
    showToast("이 브라우저에서는 현재 위치를 사용할 수 없어.");
    return;
  }

  locateButton.classList.add("is-loading");
  try {
    const coords = await getCurrentPosition();
    updateUserLocationLayer(coords.latitude, coords.longitude, true);
    await selectPointForReport(coords.latitude, coords.longitude, "내 위치");
  } catch (error) {
    showToast("위치 권한을 허용하면 내 위치를 제보 장소로 바로 잡을 수 있어.");
  } finally {
    locateButton.classList.remove("is-loading");
  }
}

async function selectPointForReport(lat, lng, label) {
  if (!isPointInJapan(lat, lng)) {
    showToast("스미맵은 일본 안의 위치만 제보 장소로 잡을 수 있어.");
    return;
  }

  if (locationPickPending) return;
  locationPickPending = true;
  showToast(isJapanese() ? `${t(label)}${t("주소를 확인하는 중이야.")}` : `${label} 주소를 확인하는 중이야.`);

  try {
    const candidate = await reverseGeocodePoint(lat, lng).catch(() => null);
    const place = upsertCustomPlace(candidate || fallbackCandidateForPoint(lat, lng, label));
    activateReportPlace(
      place,
      16,
      isJapanese() ? `${t(label)}${t("제보 장소로 잡았어.")}` : `${label}${objectParticle(label)} 제보 장소로 잡았어.`
    );
  } finally {
    locationPickPending = false;
  }
}

async function reverseGeocodePoint(lat, lng) {
  const params = new URLSearchParams({
    format: "jsonv2",
    lat: String(lat),
    lon: String(lng),
    addressdetails: "1",
    "accept-language": isJapanese() ? "ja" : "ko"
  });
  const response = await fetch(`${reverseGeocodeUrl}?${params.toString()}`, {
    headers: { Accept: "application/json" }
  });
  if (!response.ok) throw new Error(`reverse geocode ${response.status}`);
  const result = await response.json();
  return normalizeAddressCandidate({ ...result, lat: result.lat || lat, lon: result.lon || lng });
}

function fallbackCandidateForPoint(lat, lng, label) {
  return {
    id: safeId(`addr-point-${lat.toFixed(5)}-${lng.toFixed(5)}`, createId()),
    title: isJapanese() ? `${t(label)} ${t("선택 위치")}` : `${label} 선택 위치`,
    address: `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
    lat,
    lng
  };
}

function objectParticle(label) {
  const last = [...String(label || "").trim()].pop();
  if (!last) return "을";
  const code = last.charCodeAt(0);
  if (code < 0xac00 || code > 0xd7a3) return "를";
  return (code - 0xac00) % 28 ? "을" : "를";
}

function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve(coords),
      reject,
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  });
}

function upsertCustomPlace(candidate) {
  const existing = placesById.get(candidate.id);
  if (existing) {
    existing.name = candidate.title;
    existing.area = candidate.address;
    existing.lat = candidate.lat;
    existing.lng = candidate.lng;
    persistCustomPlaces();
    return existing;
  }

  const place = {
    id: candidate.id,
    name: candidate.title,
    area: candidate.address,
    city: nearestCityKey(candidate.lat, candidate.lng),
    kind: "주소 검색",
    lat: candidate.lat,
    lng: candidate.lng,
    category: "custom",
    trust: "새 장소",
    tags: ["주소 검색", "제보 대기"],
    signals: { charge: 0, restroom: 0, rest: 0, korean: 0, caution: 0 },
    walk: "주소 선택",
    lastSeen: "방금 검색",
    crowd: "현장 확인",
    bestFor: "새 생활 스팟 제보",
    watchout: "검색한 주소는 위치 기준이에요. 운영 시간과 현장 안내는 직접 확인해 주세요.",
    notes: ["주소검색으로 잡은 새 장소예요.", "제보가 쌓이면 충전, 화장실, 쉬기, 한국어 대응 신호가 지도에 반영돼요."],
    custom: true
  };

  places.unshift(place);
  placesById.set(place.id, place);
  validPlaceIds.add(place.id);
  persistCustomPlaces();
  invalidateReportCaches();
  return place;
}

function persistCustomPlaces() {
  const custom = places.filter((place) => place.custom).slice(0, 50);
  writeJson("sumimap:customPlaces", custom);
}

function nearestCityKey(lat, lng) {
  return Object.entries(cities)
    .map(([key, city]) => ({ key, distance: distanceInMeters(lat, lng, city.center[0], city.center[1]) }))
    .sort((a, b) => a.distance - b.distance)[0]?.key || "tokyo";
}

function isPointInJapan(lat, lng) {
  return lat >= japanBounds.minLat &&
    lat <= japanBounds.maxLat &&
    lng >= japanBounds.minLng &&
    lng <= japanBounds.maxLng;
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
    <button type="button" class="quick-chip ${state.activeScenario === scenario.key ? "is-active" : ""}" data-quick-scenario="${scenario.key}" aria-label="${escapeAttr(t(scenario.label))}">
      <span aria-hidden="true">${scenario.emoji}</span>
      <strong>${t(scenario.label)}</strong>
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
      updateUserLocationLayer(coords.latitude, coords.longitude, true);
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

function updateUserLocationLayer(lat, lng, openPopup = false) {
  state.userPosition = { lat, lng };
  if (userLocationLayer) map.removeLayer(userLocationLayer);
  userLocationLayer = L.circleMarker([lat, lng], {
    radius: 8,
    color: "#ffffff",
    weight: 3,
    fillColor: "#13a77a",
    fillOpacity: 0.95
  }).addTo(map);
  userLocationLayer.bindPopup(t("내 위치"));
  if (openPopup) userLocationLayer.openPopup();
}

function distanceScore(place) {
  if (!state.userPosition) return 0;
  return distanceInMeters(state.userPosition.lat, state.userPosition.lng, place.lat, place.lng);
}

function distanceLabel(place) {
  if (!state.userPosition) return placeText(place, "walk") || t("거리 확인");
  return `${formatDistance(distanceScore(place))} · ${placeText(place, "walk") || t("도보 확인")}`;
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
  if (!Number.isFinite(meters)) return t("거리 확인");
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
    "triangle-alert": `<path d="M12 3 2 21h20L12 3Z"/><path d="M12 9v5M12 17h.01"/>`,
    search: `<path d="m21 21-4.3-4.3"/><circle cx="11" cy="11" r="7"/>`,
    copy: `<rect x="9" y="9" width="13" height="13" rx="2"/><rect x="2" y="2" width="13" height="13" rx="2"/>`,
    map: `<path d="M9 18 3 21V6l6-3 6 3 6-3v15l-6 3-6-3Z"/><path d="M9 3v15M15 6v15"/>`,
    crosshair: `<circle cx="12" cy="12" r="6"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>`,
    "locate-fixed": `<line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="3"/>`
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
  if (cached?.version === reportVersion && cached?.language === state.language) return cached;

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
    language: state.language,
    reports,
    signals,
    tags: [...tags].slice(0, 8),
    totalSignals: total,
    liveTrust: reports.length ? countLabel(reports.length, "건 즉시 반영") : placeText(place, "trust"),
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

function normalizeCustomPlaces(customPlaces) {
  if (!Array.isArray(customPlaces)) return [];
  return customPlaces
    .map((place, index) => {
      const lat = Number(place?.lat);
      const lng = Number(place?.lng);
      if (!Number.isFinite(lat) || !Number.isFinite(lng) || !isPointInJapan(lat, lng)) return null;
      return {
        id: safeId(place?.id, `addr-legacy-${index}`),
        name: String(place?.name || "검색한 위치").slice(0, 80),
        area: String(place?.area || `${lat.toFixed(5)}, ${lng.toFixed(5)}`).slice(0, 160),
        city: cities[place?.city] ? place.city : nearestCityKey(lat, lng),
        kind: "주소 검색",
        lat,
        lng,
        category: "custom",
        trust: "새 장소",
        tags: ["주소 검색", "제보 대기"],
        signals: { charge: 0, restroom: 0, rest: 0, korean: 0, caution: 0 },
        walk: "주소 선택",
        lastSeen: place?.lastSeen || "주소 검색",
        crowd: "현장 확인",
        bestFor: "새 생활 스팟 제보",
        watchout: "검색한 주소는 위치 기준이에요. 운영 시간과 현장 안내는 직접 확인해 주세요.",
        notes: ["주소검색으로 잡은 새 장소예요.", "제보가 쌓이면 생활 신호가 지도에 반영돼요."],
        custom: true
      };
    })
    .filter(Boolean)
    .slice(0, 50);
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

function normalizeChecks(checks) {
  if (!checks || typeof checks !== "object" || Array.isArray(checks)) return {};
  return Object.fromEntries(dailyChecks.map((item) => [item.key, Boolean(checks[item.key])]));
}

function rememberPlace(placeId) {
  if (!validPlaceIds.has(placeId)) return;
  state.recent = [placeId, ...state.recent.filter((id) => id !== placeId)].slice(0, 8);
  writeJson("sumimap:recent", state.recent);
}

function shortPlaceName(name) {
  const text = String(name || t("장소")).trim();
  return text.length > 10 ? `${text.slice(0, 10)}...` : text;
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
  return t({
    today: "오늘 확인",
    week: "최근 1주일",
    month: "최근 1개월",
    old: "이전 기억"
  }[recency] || "방문 시점 미상");
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

function readLanguagePreference() {
  const stored = readJson(languageStorageKey, "ko");
  return supportedLanguages.has(stored) ? stored : "ko";
}

function isJapanese() {
  return currentLanguage === "ja";
}

function t(value) {
  const text = String(value ?? "");
  if (!isJapanese()) return text;
  return jaText[text] || translatePattern(text);
}

function placeText(place, field) {
  const text = String(place?.[field] || "");
  if (!isJapanese()) return text;
  const translated = placeJapanese[place?.id]?.[field];
  return typeof translated === "string" ? translated : t(text);
}

function placeNotes(place) {
  if (!isJapanese()) return Array.isArray(place.notes) ? place.notes : [];
  const translated = placeJapanese[place?.id]?.notes;
  if (Array.isArray(translated)) return translated;
  return Array.isArray(place.notes) ? place.notes.map(t) : [];
}

function tagText(tag) {
  return t(tag);
}

function countLabel(count, unit) {
  const number = Number(count) || 0;
  if (!isJapanese()) return `${number}${unit}`;
  if (unit === "곳") return `${number}か所`;
  if (unit === "건 즉시 반영") return `${number}件すぐ反映`;
  return `${number}${t(unit)}`;
}

function translatePattern(text) {
  if (!text) return "";
  const walkMatch = text.match(/^도보\s*(\d+)분$/);
  if (walkMatch) return `徒歩${walkMatch[1]}分`;
  const recentWeekMatch = text.match(/^최근\s*(\d+)주(?:일)?$/);
  if (recentWeekMatch) return `直近${recentWeekMatch[1]}週間`;
  const recentMonthMatch = text.match(/^최근\s*(\d+)개월$/);
  if (recentMonthMatch) return `直近${recentMonthMatch[1]}か月`;
  const placesMatch = text.match(/^(\d+)곳$/);
  if (placesMatch) return `${placesMatch[1]}か所`;
  const reportMatch = text.match(/^(\d+)건 즉시 반영$/);
  if (reportMatch) return `${reportMatch[1]}件すぐ反映`;
  return text;
}

function showToast(message) {
  toast.textContent = t(message);
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
