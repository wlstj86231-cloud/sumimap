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
  { key: "korean", label: "한국어", emoji: "💬" },
  { key: "caution", label: "응대 불편", emoji: "⚠️" }
];

const scenarios = [
  { key: "battery", label: "배터리 5%", filter: "charge", icon: "battery-low", emoji: "🔌", hint: "콘센트와 허락 여부 먼저" },
  { key: "toilet", label: "화장실 급함", filter: "restroom", icon: "toilet", emoji: "🚻", hint: "단독 이용 가능성 확인" },
  { key: "rain", label: "비 피하기", filter: "rest", icon: "cloud-rain", emoji: "☔", hint: "잠깐 머물기 좋은 곳" },
  { key: "korean", label: "한국어 필요", filter: "korean", icon: "languages", emoji: "💬", hint: "한국어 대응 신호" },
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
  { key: "korean", label: "한국어 대응", emoji: "💬" },
  { key: "caution", label: "응대 불편", emoji: "⚠️", danger: true },
  { key: "rain", label: "비 피하기 좋음", emoji: "☔" }
];

const dailyChecks = [
  { key: "charge", label: "충전 후보 저장", hint: "배터리 20% 전에 가까운 곳 하나를 잡아둬요.", filter: "charge", emoji: "🔌" },
  { key: "restroom", label: "화장실 후보 확인", hint: "역·상업시설·공원 중 하나를 미리 봐두면 편해요.", filter: "restroom", emoji: "🚻" },
  { key: "rest", label: "잠깐 머물 곳 확보", hint: "비·더위·대기 시간이 생길 때 갈 곳을 남겨둬요.", filter: "rest", emoji: "☔" },
  { key: "korean", label: "한국어 신호 확인", hint: "초행 동선이면 한국어 대응 신호도 같이 확인해요.", filter: "korean", emoji: "💬" }
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
const rasterBaseMapUrl = "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png";
const vectorMapStyleUrl = "https://tiles.openfreemap.org/styles/positron";
const mapLibreCssUrl = "https://unpkg.com/maplibre-gl@5.24.0/dist/maplibre-gl.css";
const mapLibreScriptUrl = "https://unpkg.com/maplibre-gl@5.24.0/dist/maplibre-gl.js";
const mapLibreLeafletScriptUrl = "https://unpkg.com/@maplibre/maplibre-gl-leaflet/leaflet-maplibre-gl.js";
const enableVectorBaseMap = false;
const japanBounds = {
  minLat: 24,
  maxLat: 46,
  minLng: 122,
  maxLng: 154
};

const languageStorageKey = "sumimap:language";
const reportClientStorageKey = "sumimap:reportClientId";
const reportApiUrl = location.hostname === "appassets.androidplatform.net" ? "https://sumimap.com/api/reports" : "/api/reports";
const feedbackApiUrl = location.hostname === "appassets.androidplatform.net" ? "https://sumimap.com/api/feedback" : "/api/feedback";
const reportSyncIntervalMs = 30000;
const reportRetryIntervalMs = 15000;
const supportedLanguages = new Set(["ko", "ja"]);
let currentLanguage = readLanguagePreference();
const reportClientId = readStableClientId(reportClientStorageKey);

const koreanMapTextReplacements = [
  [/東京都|Tokyo Metropolis|Tokyo Prefecture|Tokyo\b/gi, "도쿄"],
  [/大阪府|Osaka Prefecture|Osaka\b/gi, "오사카"],
  [/福岡県|Fukuoka Prefecture|Fukuoka\b/gi, "후쿠오카"],
  [/京都府|Kyoto Prefecture|Kyoto\b/gi, "교토"],
  [/新宿区|Shinjuku City|Shinjuku\b/gi, "신주쿠"],
  [/渋谷区|Shibuya City|Shibuya\b/gi, "시부야"],
  [/豊島区|Toshima City|Toshima\b/gi, "도시마"],
  [/台東区|Taito City|Taito\b/gi, "다이토"],
  [/千代田区|Chiyoda City|Chiyoda\b/gi, "치요다"],
  [/中央区|Chuo City|Chuo Ward|Chuo\b/gi, "주오"],
  [/港区|Minato City|Minato\b/gi, "미나토"],
  [/品川区|Shinagawa City|Shinagawa\b/gi, "시나가와"],
  [/浪速区|Naniwa Ward|Naniwa\b/gi, "나니와"],
  [/北区|Kita Ward|Kita\b/gi, "기타"],
  [/天王寺区|Tennoji Ward|Tennoji\b/gi, "텐노지"],
  [/東成区|Higashinari Ward|Higashinari\b/gi, "히가시나리"],
  [/博多区|Hakata Ward|Hakata\b/gi, "하카타"],
  [/下京区|Shimogyo Ward|Shimogyo\b/gi, "시모교"],
  [/中京区|Nakagyo Ward|Nakagyo\b/gi, "나카교"],
  [/東山区|Higashiyama Ward|Higashiyama\b/gi, "히가시야마"],
  [/新大久保|Shin[-\s]?Okubo\b/gi, "신오쿠보"],
  [/池袋|Ikebukuro\b/gi, "이케부쿠로"],
  [/上野|Ueno\b/gi, "우에노"],
  [/秋葉原|Akihabara\b/gi, "아키하바라"],
  [/高田馬場|Takadanobaba\b/gi, "다카다노바바"],
  [/難波|Namba\b/gi, "난바"],
  [/梅田|Umeda\b/gi, "우메다"],
  [/鶴橋|Tsuruhashi\b/gi, "쓰루하시"],
  [/新今宮|Shin[-\s]?Imamiya\b/gi, "신이마미야"],
  [/天神|Tenjin\b/gi, "텐진"],
  [/中洲|Nakasu\b/gi, "나카스"],
  [/四条|Shijo\b/gi, "시조"],
  [/河原町|Kawaramachi\b/gi, "가와라마치"],
  [/祇園|Gion\b/gi, "기온"],
  [/新宿三丁目/gi, "신주쿠3초메"],
  [/西新宿/gi, "니시신주쿠"],
  [/代々木/gi, "요요기"],
  [/四谷/gi, "요쓰야"],
  [/角筈/gi, "쓰노하즈"],
  [/東京駅|Tokyo Station\b/gi, "도쿄역"],
  [/京都駅|Kyoto Station\b/gi, "교토역"],
  [/JR\s?/gi, "제이알 "],
  [/京王|Keio\b/gi, "게이오"],
  [/小田急|Odakyu\b/gi, "오다큐"],
  [/東京メトロ|Metro\b/gi, "도쿄메트로"],
  [/地下(\d+)階/g, "지하 $1층"],
  [/東口/g, "동쪽 출구"],
  [/西口/g, "서쪽 출구"],
  [/南口/g, "남쪽 출구"],
  [/北口/g, "북쪽 출구"],
  [/Station\b|駅/g, "역"],
  [/Ward\b|区/g, "구"],
  [/City\b|市/g, "시"],
  [/Prefecture\b|県|府/g, "현"],
  [/丁目/g, "초메"],
  [/線/g, "선"],
  [/階/g, "층"],
  [/Road\b|Street\b|Avenue\b/gi, "도로"],
  [/Japan\b|日本国|日本/gi, "일본"]
];

const jaText = {
  "지도 언어를 바꾸는 중...": "地図の言語を切り替えています...",
  "지도 언어를 바꿨어.": "地図の言語を切り替えました。",
  "지도 언어 전환이 불안정해서 기본 지도로 보여줄게.": "地図の言語切替が不安定なため、基本地図で表示します。",
  "한국어 지도": "韓国語地図",
  "일본어 지도": "日本語地図",
  "후보 목록": "候補一覧",
  "다른 후보 보기": "別の候補を見る",
  "한국어 주소·역 이름 검색": "住所・駅名検索",
  "바로 공유": "すぐ共有",
  "현재 보기": "現在の表示",
  "미니 동선": "ミニ動線",
  "제보 입구": "投稿入口",
  "상황 가이드": "状況ガイド",
  "링크를 복사했어.": "リンクをコピーしました。",
  "공유가 막혀서 링크를 복사했어.": "共有できなかったためリンクをコピーしました。",
  "스미맵에서 바로 확인": "スミマップですぐ確認",
  "지금 보는 조건을 그대로 열 수 있게 공유해요.": "今の条件をそのまま開けるリンクで共有します。",
  "오늘 미니 동선": "今日のミニ動線",
  "급한 일 3곳으로 압축": "急ぎの用事を3か所に圧縮",
  "가까운 후보를 묶어두면 다시 검색하지 않아도 돼요.": "近い候補をまとめると再検索せずに見返せます。",
  "코스 저장": "コース保存",
  "오늘 동선에 저장했어.": "今日の動線に保存しました。",
  "저장 비교": "保存スポット比較",
  "저장한 곳을 신호 기준으로 다시 고르세요.": "保存した場所を目印で比較できます。",
  "가장 강한 신호": "一番強い目印",
  "대체 후보": "代替候補",
  "저장한 장소를 더 쌓으면 비교가 좋아져요.": "保存場所が増えると比較しやすくなります。",
  "다시 보기": "もう一度見る",
  "신호": "目印",
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
  "패널 열고 닫기": "パネルを開閉",
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
  "제보는 바로 반영하되 자유 텍스트는 열지 않아 광고와 운영 리스크를 낮춰요.": "投稿はすぐ反映しますが、自由入力を開かないことで広告と運営リスクを下げています。",
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
  "빠른 상황": "すぐ見る状況",
  "지도에서 이모티콘을 눌러요": "地図で絵文字を押します",
  "원하는 표시를 누르면 필요한 정보만 짧게 떠요.": "必要な表示を押すと短い情報だけ出ます。",
  "지도에서 필요한 표시를 고른 뒤 눌러보세요.": "地図で必要な表示を選んで押してください。",
  "한 줄 확인": "一行確認",
  "간단히 보기": "短く見る",
  "최근 제보 보기": "最近の投稿を見る",
  "자세한 정보는 필터나 정보 탭에서 천천히 볼 수 있어요.": "詳しい情報はフィルターや情報タブで見られます。",
  "삭제": "削除",
  "제보를 삭제했어.": "投稿を削除しました。"
};

const hiraganaTextReplacements = [
  ["スミマップ", "すみまっぷ"],
  ["日本語", "にほんご"],
  ["韓国語", "かんこくご"],
  ["日本", "にほん"],
  ["韓国", "かんこく"],
  ["現在地", "げんざいち"],
  ["現在", "げんざい"],
  ["住所検索", "じゅうしょけんさく"],
  ["住所", "じゅうしょ"],
  ["駅名", "えきめい"],
  ["地図", "ちず"],
  ["言語", "げんご"],
  ["切り替え", "きりかえ"],
  ["基本", "きほん"],
  ["候補一覧", "こうほいちらん"],
  ["候補", "こうほ"],
  ["一覧", "いちらん"],
  ["検索", "けんさく"],
  ["検索語", "けんさくご"],
  ["消去", "しょうきょ"],
  ["表示", "ひょうじ"],
  ["今すぐ", "いますぐ"],
  ["今", "いま"],
  ["翻訳", "ほんやく"],
  ["上部", "じょうぶ"],
  ["都市", "とし"],
  ["移動", "いどう"],
  ["近く", "ちかく"],
  ["絞り込み", "しぼりこみ"],
  ["情報", "じょうほう"],
  ["急ぎ", "いそぎ"],
  ["状況", "じょうきょう"],
  ["共有", "きょうゆう"],
  ["投稿場所", "とうこうばしょ"],
  ["投稿", "とうこう"],
  ["保存済み", "ほぞんずみ"],
  ["保存", "ほぞん"],
  ["確認", "かくにん"],
  ["選択", "せんたく"],
  ["中心", "ちゅうしん"],
  ["条件解除", "じょうけんかいじょ"],
  ["条件", "じょうけん"],
  ["解除", "かいじょ"],
  ["反映", "はんえい"],
  ["同意", "どうい"],
  ["虚偽疑い", "きょぎうたがい"],
  ["虚偽", "きょぎ"],
  ["疑い", "うたがい"],
  ["信頼度", "しんらいど"],
  ["信頼", "しんらい"],
  ["累計", "るいけい"],
  ["最近", "さいきん"],
  ["直近", "さいきん"],
  ["週間", "しゅうかん"],
  ["混雑", "こんざつ"],
  ["距離感", "きょりかん"],
  ["距離", "きょり"],
  ["徒歩", "とほ"],
  ["場所", "ばしょ"],
  ["新しい", "あたらしい"],
  ["生活", "せいかつ"],
  ["充電", "じゅうでん"],
  ["休憩", "きゅうけい"],
  ["対応", "たいおう"],
  ["不安", "ふあん"],
  ["必要", "ひつよう"],
  ["注意", "ちゅうい"],
  ["利用", "りよう"],
  ["可能", "かのう"],
  ["単独", "たんどく"],
  ["長時間", "ちょうじかん"],
  ["雨宿り", "あまやどり"],
  ["一人", "ひとり"],
  ["公共施設", "こうきょうしせつ"],
  ["商業施設", "しょうぎょうしせつ"],
  ["商店街", "しょうてんがい"],
  ["飲食店", "いんしょくてん"],
  ["屋内", "おくない"],
  ["地下街", "ちかがい"],
  ["駅周辺", "えきしゅうへん"],
  ["周辺", "しゅうへん"],
  ["営業", "えいぎょう"],
  ["時間", "じかん"],
  ["現地", "げんち"],
  ["案内", "あんない"],
  ["目印", "めじるし"],
  ["動線", "どうせん"],
  ["今日", "きょう"],
  ["少し休める", "すこしやすめる"],
  ["少し休みやすい", "すこしやすみやすい"],
  ["少し滞在", "すこしたいざい"],
  ["長時間滞在", "ちょうじかんたいざい"],
  ["非推奨", "ひすいしょう"],
  ["進捗", "しんちょく"],
  ["許可", "きょか"],
  ["先に", "さきに"],
  ["前に", "まえに"],
  ["近い", "ちかい"],
  ["近く", "ちかく"],
  ["公園", "こうえん"],
  ["安心", "あんしん"],
  ["確保", "かくほ"],
  ["雨", "あめ"],
  ["暑さ", "あつさ"],
  ["待ち時間", "まちじかん"],
  ["残して", "のこして"],
  ["初めて", "はじめて"],
  ["一緒", "いっしょ"],
  ["次に", "つぎに"],
  ["分", "ふん"],
  ["用事", "ようじ"],
  ["圧縮", "あっしゅく"],
  ["再検索", "さいけんさく"],
  ["見返せます", "みかえせます"],
  ["見る", "みる"],
  ["公共", "こうきょう"],
  ["入口", "いりぐち"],
  ["経路", "けいろ"],
  ["別の", "べつの"],
  ["昼", "ひる"],
  ["不足", "ふそく"],
  ["第一", "だいいち"],
  ["席", "せき"],
  ["注文前", "ちゅうもんまえ"],
  ["注文", "ちゅうもん"],
  ["場合", "ばあい"],
  ["違う", "ちがう"],
  ["電子街", "でんしがい"],
  ["期待", "きたい"],
  ["生活圏", "せいかつけん"],
  ["待機", "たいき"],
  ["便利", "べんり"],
  ["可能性", "かのうせい"],
  ["高い", "たかい"],
  ["か月", "かげつ"],
  ["四条", "しじょう"],
  ["中心部", "ちゅうしんぶ"],
  ["部", "ぶ"],
  ["東京", "とうきょう"],
  ["大阪", "おおさか"],
  ["福岡", "ふくおか"],
  ["京都", "きょうと"],
  ["新宿", "しんじゅく"],
  ["上野", "うえの"],
  ["池袋", "いけぶくろ"],
  ["新大久保", "しんおおくぼ"],
  ["渋谷", "しぶや"],
  ["東側", "ひがしがわ"],
  ["北側", "きたがわ"],
  ["秋葉原", "あきはばら"],
  ["品川", "しながわ"],
  ["高田馬場", "たかだのばば"],
  ["八重洲", "やえす"],
  ["梅田", "うめだ"],
  ["鶴橋", "つるはし"],
  ["天王寺", "てんのうじ"],
  ["新今宮", "しんいまみや"],
  ["天神", "てんじん"],
  ["博多", "はかた"],
  ["中洲", "なかす"],
  ["河原町", "かわらまち"],
  ["祇園", "ぎおん"],
  ["型", "がた"]
].sort((a, b) => b[0].length - a[0].length);

const kanjiFallbackReadings = {
  一: "いち",
  不: "ふ",
  事: "こと",
  休: "やす",
  便: "べん",
  保: "ほ",
  先: "さき",
  入: "いり",
  公: "こう",
  共: "きょう",
  再: "さい",
  分: "ふん",
  初: "はじ",
  別: "べつ",
  利: "り",
  前: "まえ",
  口: "ぐち",
  可: "か",
  合: "あい",
  四: "し",
  圏: "けん",
  園: "えん",
  圧: "あつ",
  在: "ざい",
  場: "ば",
  奨: "しょう",
  子: "こ",
  安: "あん",
  少: "すこ",
  席: "せき",
  帯: "たい",
  広: "ひろ",
  待: "ま",
  心: "しん",
  性: "せい",
  所: "ところ",
  捗: "ちょく",
  推: "すい",
  文: "ぶん",
  方: "ほう",
  昼: "ひる",
  時: "じ",
  暑: "あつ",
  月: "げつ",
  条: "じょう",
  機: "き",
  次: "つぎ",
  残: "のこ",
  気: "き",
  注: "ちゅう",
  滞: "たい",
  用: "よう",
  確: "かく",
  第: "だい",
  経: "けい",
  緒: "しょ",
  縮: "しゅく",
  街: "がい",
  見: "み",
  許: "きょ",
  足: "そく",
  路: "ろ",
  近: "ちか",
  返: "かえ",
  進: "すす",
  違: "ちが",
  部: "ぶ",
  開: "ひら",
  雨: "あめ",
  電: "でん",
  非: "ひ",
  駅: "えき",
  高: "たか"
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

const localMapLabels = [
  { id: "tokyo-pref", type: "admin", ko: "도쿄도", ja: "とうきょうと", lat: 35.6895, lng: 139.6917, minZoom: 9.5, weight: 120 },
  { id: "tokyo-chiyoda", type: "admin", ko: "도쿄도 치요다구", ja: "とうきょうと ちよだく", lat: 35.6938, lng: 139.7536, minZoom: 11, weight: 94 },
  { id: "tokyo-chuo", type: "admin", ko: "도쿄도 주오구", ja: "とうきょうと ちゅうおうく", lat: 35.6706, lng: 139.7720, minZoom: 11, weight: 90 },
  { id: "tokyo-minato", type: "admin", ko: "도쿄도 미나토구", ja: "とうきょうと みなとく", lat: 35.6581, lng: 139.7516, minZoom: 11, weight: 86 },
  { id: "tokyo-shinjuku-ku", type: "admin", ko: "도쿄도 신주쿠구", ja: "とうきょうと しんじゅくく", lat: 35.6938, lng: 139.7034, minZoom: 11, weight: 108 },
  { id: "tokyo-shibuya-ku", type: "admin", ko: "도쿄도 시부야구", ja: "とうきょうと しぶやく", lat: 35.6618, lng: 139.7041, minZoom: 11, weight: 104 },
  { id: "tokyo-toshima-ku", type: "admin", ko: "도쿄도 도시마구", ja: "とうきょうと としまく", lat: 35.7263, lng: 139.7167, minZoom: 11, weight: 92 },
  { id: "tokyo-taito-ku", type: "admin", ko: "도쿄도 다이토구", ja: "とうきょうと たいとうく", lat: 35.7126, lng: 139.7802, minZoom: 11, weight: 88 },
  { id: "tokyo-shinagawa-ku", type: "admin", ko: "도쿄도 시나가와구", ja: "とうきょうと しながわく", lat: 35.6092, lng: 139.7301, minZoom: 11, weight: 82 },

  { id: "tokyo-shinjuku", type: "neighborhood", ko: "신주쿠", ja: "しんじゅく", lat: 35.6909, lng: 139.7003, minZoom: 12, weight: 116 },
  { id: "tokyo-shinjuku-east", type: "neighborhood", ko: "신주쿠 동쪽 출구", ja: "しんじゅく ひがしぐち", lat: 35.6915, lng: 139.7038, minZoom: 13, weight: 115 },
  { id: "tokyo-kabukicho", type: "neighborhood", ko: "가부키초", ja: "かぶきちょう", lat: 35.6955, lng: 139.7027, minZoom: 13, weight: 104 },
  { id: "tokyo-shinjuku-sanchome", type: "neighborhood", ko: "신주쿠 3초메", ja: "しんじゅく さんちょうめ", lat: 35.6902, lng: 139.7063, minZoom: 13, weight: 96 },
  { id: "tokyo-shinokubo", type: "neighborhood", ko: "신오쿠보", ja: "しんおおくぼ", lat: 35.7007, lng: 139.7000, minZoom: 12.5, weight: 104 },
  { id: "tokyo-okubo", type: "neighborhood", ko: "오쿠보", ja: "おおくぼ", lat: 35.7016, lng: 139.6953, minZoom: 13, weight: 84 },
  { id: "tokyo-yoyogi", type: "neighborhood", ko: "요요기", ja: "よよぎ", lat: 35.6836, lng: 139.7021, minZoom: 13, weight: 78 },
  { id: "tokyo-shibuya", type: "neighborhood", ko: "시부야", ja: "しぶや", lat: 35.6596, lng: 139.7005, minZoom: 12, weight: 112 },
  { id: "tokyo-dogenzaka", type: "neighborhood", ko: "도겐자카", ja: "どうげんざか", lat: 35.6584, lng: 139.6972, minZoom: 13, weight: 82 },
  { id: "tokyo-ueno", type: "neighborhood", ko: "우에노", ja: "うえの", lat: 35.7138, lng: 139.7770, minZoom: 12, weight: 98 },
  { id: "tokyo-okachimachi", type: "neighborhood", ko: "오카치마치", ja: "おかちまち", lat: 35.7074, lng: 139.7746, minZoom: 13, weight: 82 },
  { id: "tokyo-akihabara", type: "neighborhood", ko: "아키하바라", ja: "あきはばら", lat: 35.6984, lng: 139.7730, minZoom: 12.5, weight: 96 },
  { id: "tokyo-ikebukuro", type: "neighborhood", ko: "이케부쿠로", ja: "いけぶくろ", lat: 35.7295, lng: 139.7109, minZoom: 12, weight: 104 },
  { id: "tokyo-takadanobaba", type: "neighborhood", ko: "다카다노바바", ja: "たかだのばば", lat: 35.7123, lng: 139.7035, minZoom: 12.5, weight: 90 },
  { id: "tokyo-yaesu", type: "neighborhood", ko: "도쿄역 야에스", ja: "とうきょうえき やえす", lat: 35.6806, lng: 139.7700, minZoom: 13, weight: 90 },
  { id: "tokyo-nihonbashi", type: "neighborhood", ko: "니혼바시", ja: "にほんばし", lat: 35.6826, lng: 139.7749, minZoom: 13, weight: 74 },
  { id: "tokyo-ginza", type: "neighborhood", ko: "긴자", ja: "ぎんざ", lat: 35.6719, lng: 139.7650, minZoom: 13, weight: 76 },
  { id: "tokyo-shinagawa", type: "neighborhood", ko: "시나가와", ja: "しながわ", lat: 35.6285, lng: 139.7388, minZoom: 12.5, weight: 90 },

  { id: "osaka-pref", type: "admin", ko: "오사카부", ja: "おおさかふ", lat: 34.6863, lng: 135.5200, minZoom: 9.5, weight: 118 },
  { id: "osaka-city", type: "admin", ko: "오사카시", ja: "おおさかし", lat: 34.6937, lng: 135.5023, minZoom: 10.5, weight: 110 },
  { id: "osaka-kita-ku", type: "admin", ko: "오사카시 기타구", ja: "おおさかし きたく", lat: 34.7054, lng: 135.5100, minZoom: 11.5, weight: 96 },
  { id: "osaka-chuo-ku", type: "admin", ko: "오사카시 주오구", ja: "おおさかし ちゅうおうく", lat: 34.6813, lng: 135.5097, minZoom: 11.5, weight: 94 },
  { id: "osaka-naniwa-ku", type: "admin", ko: "오사카시 나니와구", ja: "おおさかし なにわく", lat: 34.6652, lng: 135.4991, minZoom: 11.5, weight: 92 },
  { id: "osaka-tennoji-ku", type: "admin", ko: "오사카시 덴노지구", ja: "おおさかし てんのうじく", lat: 34.6550, lng: 135.5187, minZoom: 11.5, weight: 86 },
  { id: "osaka-ikuno-ku", type: "admin", ko: "오사카시 이쿠노구", ja: "おおさかし いくのく", lat: 34.6534, lng: 135.5340, minZoom: 11.5, weight: 76 },
  { id: "osaka-nishinari-ku", type: "admin", ko: "오사카시 니시나리구", ja: "おおさかし にしなりく", lat: 34.6380, lng: 135.4940, minZoom: 11.5, weight: 72 },
  { id: "osaka-namba", type: "neighborhood", ko: "난바", ja: "なんば", lat: 34.6657, lng: 135.5019, minZoom: 12, weight: 116 },
  { id: "osaka-dotonbori", type: "neighborhood", ko: "도톤보리", ja: "どうとんぼり", lat: 34.6687, lng: 135.5032, minZoom: 13, weight: 104 },
  { id: "osaka-shinsaibashi", type: "neighborhood", ko: "신사이바시", ja: "しんさいばし", lat: 34.6746, lng: 135.5008, minZoom: 13, weight: 96 },
  { id: "osaka-umeda", type: "neighborhood", ko: "우메다", ja: "うめだ", lat: 34.7025, lng: 135.4959, minZoom: 12, weight: 110 },
  { id: "osaka-station", type: "station", ko: "오사카역", ja: "おおさかえき", lat: 34.7025, lng: 135.4959, minZoom: 12.5, weight: 104 },
  { id: "osaka-tsuruhashi", type: "neighborhood", ko: "쓰루하시", ja: "つるはし", lat: 34.6651, lng: 135.5306, minZoom: 12.5, weight: 98 },
  { id: "osaka-tennoji", type: "neighborhood", ko: "덴노지", ja: "てんのうじ", lat: 34.6465, lng: 135.5133, minZoom: 12.5, weight: 94 },
  { id: "osaka-shinimamiya", type: "neighborhood", ko: "신이마미야", ja: "しんいまみや", lat: 34.6500, lng: 135.5007, minZoom: 13, weight: 84 },
  { id: "osaka-nipponbashi", type: "neighborhood", ko: "닛폰바시", ja: "にっぽんばし", lat: 34.6661, lng: 135.5061, minZoom: 13, weight: 80 },

  { id: "fukuoka-pref", type: "admin", ko: "후쿠오카현", ja: "ふくおかけん", lat: 33.6064, lng: 130.4181, minZoom: 9.5, weight: 112 },
  { id: "fukuoka-city", type: "admin", ko: "후쿠오카시", ja: "ふくおかし", lat: 33.5902, lng: 130.4017, minZoom: 10.5, weight: 106 },
  { id: "fukuoka-hakata-ku", type: "admin", ko: "후쿠오카시 하카타구", ja: "ふくおかし はかたく", lat: 33.5898, lng: 130.4214, minZoom: 11.5, weight: 98 },
  { id: "fukuoka-chuo-ku", type: "admin", ko: "후쿠오카시 주오구", ja: "ふくおかし ちゅうおうく", lat: 33.5893, lng: 130.3929, minZoom: 11.5, weight: 92 },
  { id: "fukuoka-hakata", type: "neighborhood", ko: "하카타", ja: "はかた", lat: 33.5904, lng: 130.4206, minZoom: 12, weight: 112 },
  { id: "fukuoka-tenjin", type: "neighborhood", ko: "텐진", ja: "てんじん", lat: 33.5908, lng: 130.3991, minZoom: 12, weight: 104 },
  { id: "fukuoka-nakasu", type: "neighborhood", ko: "나카스", ja: "なかす", lat: 33.5929, lng: 130.4068, minZoom: 12.5, weight: 94 },
  { id: "fukuoka-gion", type: "neighborhood", ko: "기온", ja: "ぎおん", lat: 33.5937, lng: 130.4142, minZoom: 13, weight: 76 },
  { id: "fukuoka-canal", type: "neighborhood", ko: "캐널시티 하카타", ja: "きゃなるしてぃ はかた", lat: 33.5897, lng: 130.4107, minZoom: 13, weight: 82 },

  { id: "kyoto-pref", type: "admin", ko: "교토부", ja: "きょうとふ", lat: 35.0116, lng: 135.7681, minZoom: 9.5, weight: 110 },
  { id: "kyoto-city", type: "admin", ko: "교토시", ja: "きょうとし", lat: 35.0116, lng: 135.7681, minZoom: 10.5, weight: 106 },
  { id: "kyoto-shimogyo-ku", type: "admin", ko: "교토시 시모교구", ja: "きょうとし しもぎょうく", lat: 34.9902, lng: 135.7558, minZoom: 11.5, weight: 92 },
  { id: "kyoto-nakagyo-ku", type: "admin", ko: "교토시 나카교구", ja: "きょうとし なかぎょうく", lat: 35.0102, lng: 135.7519, minZoom: 11.5, weight: 90 },
  { id: "kyoto-higashiyama-ku", type: "admin", ko: "교토시 히가시야마구", ja: "きょうとし ひがしやまく", lat: 34.9970, lng: 135.7760, minZoom: 11.5, weight: 88 },
  { id: "kyoto-station", type: "station", ko: "교토역", ja: "きょうとえき", lat: 34.9859, lng: 135.7588, minZoom: 12, weight: 112 },
  { id: "kyoto-shijo-kawaramachi", type: "neighborhood", ko: "시조가와라마치", ja: "しじょうかわらまち", lat: 35.0037, lng: 135.7687, minZoom: 12, weight: 108 },
  { id: "kyoto-gion", type: "neighborhood", ko: "기온", ja: "ぎおん", lat: 35.0030, lng: 135.7751, minZoom: 12.5, weight: 98 },
  { id: "kyoto-karasuma", type: "neighborhood", ko: "가라스마", ja: "からすま", lat: 35.0039, lng: 135.7593, minZoom: 13, weight: 84 },
  { id: "kyoto-kiyomizu", type: "neighborhood", ko: "기요미즈", ja: "きよみず", lat: 34.9949, lng: 135.7850, minZoom: 13, weight: 78 },

  { id: "tokyo-sumida-ku", type: "admin", ko: "도쿄도 스미다구", ja: "とうきょうと すみだく", lat: 35.7101, lng: 139.8107, minZoom: 11.5, weight: 78 },
  { id: "tokyo-bunkyo-ku", type: "admin", ko: "도쿄도 분쿄구", ja: "とうきょうと ぶんきょうく", lat: 35.7081, lng: 139.7522, minZoom: 11.5, weight: 76 },
  { id: "tokyo-nakano-ku", type: "admin", ko: "도쿄도 나카노구", ja: "とうきょうと なかのく", lat: 35.7074, lng: 139.6638, minZoom: 11.5, weight: 74 },
  { id: "tokyo-meguro-ku", type: "admin", ko: "도쿄도 메구로구", ja: "とうきょうと めぐろく", lat: 35.6415, lng: 139.6982, minZoom: 11.5, weight: 72 },
  { id: "tokyo-setagaya-ku", type: "admin", ko: "도쿄도 세타가야구", ja: "とうきょうと せたがやく", lat: 35.6466, lng: 139.6532, minZoom: 11.5, weight: 70 },
  { id: "tokyo-nishi-shinjuku", type: "neighborhood", ko: "니시신주쿠", ja: "にししんじゅく", lat: 35.6932, lng: 139.6924, minZoom: 13, weight: 94 },
  { id: "tokyo-higashi-shinjuku", type: "neighborhood", ko: "히가시신주쿠", ja: "ひがししんじゅく", lat: 35.6979, lng: 139.7076, minZoom: 13, weight: 88 },
  { id: "tokyo-shinjuku-2chome", type: "neighborhood", ko: "신주쿠 2초메", ja: "しんじゅく にちょうめ", lat: 35.6891, lng: 139.7084, minZoom: 14, weight: 76 },
  { id: "tokyo-golden-gai", type: "neighborhood", ko: "골든가이", ja: "ごーるでんがい", lat: 35.6937, lng: 139.7049, minZoom: 14, weight: 70 },
  { id: "tokyo-waseda", type: "neighborhood", ko: "와세다", ja: "わせだ", lat: 35.7055, lng: 139.7210, minZoom: 13, weight: 72 },
  { id: "tokyo-harajuku", type: "neighborhood", ko: "하라주쿠", ja: "はらじゅく", lat: 35.6702, lng: 139.7026, minZoom: 12.5, weight: 88 },
  { id: "tokyo-omotesando", type: "neighborhood", ko: "오모테산도", ja: "おもてさんどう", lat: 35.6652, lng: 139.7126, minZoom: 13, weight: 82 },
  { id: "tokyo-ebisu", type: "neighborhood", ko: "에비스", ja: "えびす", lat: 35.6467, lng: 139.7101, minZoom: 13, weight: 78 },
  { id: "tokyo-daikanyama", type: "neighborhood", ko: "다이칸야마", ja: "だいかんやま", lat: 35.6480, lng: 139.7032, minZoom: 13, weight: 72 },
  { id: "tokyo-nakameguro", type: "neighborhood", ko: "나카메구로", ja: "なかめぐろ", lat: 35.6443, lng: 139.6992, minZoom: 13, weight: 72 },
  { id: "tokyo-roppongi", type: "neighborhood", ko: "롯폰기", ja: "ろっぽんぎ", lat: 35.6628, lng: 139.7311, minZoom: 12.5, weight: 84 },
  { id: "tokyo-asakusa", type: "neighborhood", ko: "아사쿠사", ja: "あさくさ", lat: 35.7148, lng: 139.7967, minZoom: 12.5, weight: 86 },
  { id: "tokyo-oshiage", type: "neighborhood", ko: "오시아게", ja: "おしあげ", lat: 35.7101, lng: 139.8129, minZoom: 13, weight: 72 },
  { id: "tokyo-ueno-park", type: "neighborhood", ko: "우에노 공원", ja: "うえのこうえん", lat: 35.7156, lng: 139.7730, minZoom: 13, weight: 74 },
  { id: "tokyo-kanda", type: "neighborhood", ko: "간다", ja: "かんだ", lat: 35.6917, lng: 139.7709, minZoom: 13, weight: 72 },

  { id: "osaka-nishi-ku", type: "admin", ko: "오사카시 니시구", ja: "おおさかし にしく", lat: 34.6763, lng: 135.4865, minZoom: 11.5, weight: 82 },
  { id: "osaka-yodogawa-ku", type: "admin", ko: "오사카시 요도가와구", ja: "おおさかし よどがわく", lat: 34.7210, lng: 135.4860, minZoom: 11.5, weight: 80 },
  { id: "osaka-abeno-ku", type: "admin", ko: "오사카시 아베노구", ja: "おおさかし あべのく", lat: 34.6382, lng: 135.5184, minZoom: 11.5, weight: 78 },
  { id: "osaka-amerikamura", type: "neighborhood", ko: "아메리카무라", ja: "あめりかむら", lat: 34.6724, lng: 135.4978, minZoom: 13, weight: 88 },
  { id: "osaka-horie", type: "neighborhood", ko: "호리에", ja: "ほりえ", lat: 34.6732, lng: 135.4914, minZoom: 13, weight: 78 },
  { id: "osaka-kuromon", type: "neighborhood", ko: "구로몬 시장", ja: "くろもんいちば", lat: 34.6653, lng: 135.5066, minZoom: 13, weight: 84 },
  { id: "osaka-den-den-town", type: "neighborhood", ko: "덴덴타운", ja: "でんでんたうん", lat: 34.6597, lng: 135.5062, minZoom: 13, weight: 82 },
  { id: "osaka-shinsekai", type: "neighborhood", ko: "신세카이", ja: "しんせかい", lat: 34.6525, lng: 135.5063, minZoom: 13, weight: 82 },
  { id: "osaka-honmachi", type: "neighborhood", ko: "혼마치", ja: "ほんまち", lat: 34.6828, lng: 135.5004, minZoom: 13, weight: 78 },
  { id: "osaka-yodoyabashi", type: "neighborhood", ko: "요도야바시", ja: "よどやばし", lat: 34.6924, lng: 135.5018, minZoom: 13, weight: 76 },
  { id: "osaka-kitashinchi", type: "neighborhood", ko: "기타신치", ja: "きたしんち", lat: 34.6974, lng: 135.4962, minZoom: 13, weight: 74 },
  { id: "osaka-nakazakicho", type: "neighborhood", ko: "나카자키초", ja: "なかざきちょう", lat: 34.7088, lng: 135.5058, minZoom: 13, weight: 70 },

  { id: "fukuoka-higashi-ku", type: "admin", ko: "후쿠오카시 히가시구", ja: "ふくおかし ひがしく", lat: 33.6177, lng: 130.4179, minZoom: 11.5, weight: 74 },
  { id: "fukuoka-minami-ku", type: "admin", ko: "후쿠오카시 미나미구", ja: "ふくおかし みなみく", lat: 33.5615, lng: 130.4265, minZoom: 11.5, weight: 72 },
  { id: "fukuoka-sawara-ku", type: "admin", ko: "후쿠오카시 사와라구", ja: "ふくおかし さわらく", lat: 33.5812, lng: 130.3482, minZoom: 11.5, weight: 70 },
  { id: "fukuoka-chikushi-exit", type: "neighborhood", ko: "하카타 지쿠시 출구", ja: "はかた ちくしぐち", lat: 33.5896, lng: 130.4238, minZoom: 13, weight: 86 },
  { id: "fukuoka-nakasu-kawabata", type: "neighborhood", ko: "나카스카와바타", ja: "なかすかわばた", lat: 33.5948, lng: 130.4052, minZoom: 13, weight: 82 },
  { id: "fukuoka-daimyo", type: "neighborhood", ko: "다이묘", ja: "だいみょう", lat: 33.5897, lng: 130.3935, minZoom: 13, weight: 80 },
  { id: "fukuoka-akasaka", type: "neighborhood", ko: "아카사카", ja: "あかさか", lat: 33.5890, lng: 130.3900, minZoom: 13, weight: 74 },
  { id: "fukuoka-yakuin", type: "neighborhood", ko: "야쿠인", ja: "やくいん", lat: 33.5817, lng: 130.4016, minZoom: 13, weight: 74 },
  { id: "fukuoka-ohori", type: "neighborhood", ko: "오호리 공원", ja: "おおほりこうえん", lat: 33.5860, lng: 130.3767, minZoom: 13, weight: 72 },
  { id: "fukuoka-nishijin", type: "neighborhood", ko: "니시진", ja: "にしじん", lat: 33.5839, lng: 130.3606, minZoom: 13, weight: 68 },
  { id: "fukuoka-momochi", type: "neighborhood", ko: "모모치", ja: "ももち", lat: 33.5932, lng: 130.3517, minZoom: 13, weight: 66 },

  { id: "kyoto-kamigyo-ku", type: "admin", ko: "교토시 가미교구", ja: "きょうとし かみぎょうく", lat: 35.0297, lng: 135.7567, minZoom: 11.5, weight: 76 },
  { id: "kyoto-sakyo-ku", type: "admin", ko: "교토시 사쿄구", ja: "きょうとし さきょうく", lat: 35.0485, lng: 135.7786, minZoom: 11.5, weight: 74 },
  { id: "kyoto-fushimi-ku", type: "admin", ko: "교토시 후시미구", ja: "きょうとし ふしみく", lat: 34.9360, lng: 135.7613, minZoom: 11.5, weight: 70 },
  { id: "kyoto-kiyamachi", type: "neighborhood", ko: "기야마치", ja: "きやまち", lat: 35.0056, lng: 135.7705, minZoom: 13, weight: 84 },
  { id: "kyoto-pontocho", type: "neighborhood", ko: "폰토초", ja: "ぽんとちょう", lat: 35.0067, lng: 135.7704, minZoom: 13.5, weight: 78 },
  { id: "kyoto-nishiki", type: "neighborhood", ko: "니시키 시장", ja: "にしきいちば", lat: 35.0050, lng: 135.7649, minZoom: 13, weight: 82 },
  { id: "kyoto-sanjo", type: "neighborhood", ko: "산조", ja: "さんじょう", lat: 35.0086, lng: 135.7696, minZoom: 13, weight: 80 },
  { id: "kyoto-gojo", type: "neighborhood", ko: "고조", ja: "ごじょう", lat: 34.9968, lng: 135.7594, minZoom: 13, weight: 74 },
  { id: "kyoto-ninenzaka", type: "neighborhood", ko: "니넨자카", ja: "にねんざか", lat: 34.9966, lng: 135.7800, minZoom: 13.5, weight: 72 },
  { id: "kyoto-sannenzaka", type: "neighborhood", ko: "산넨자카", ja: "さんねんざか", lat: 34.9960, lng: 135.7816, minZoom: 13.5, weight: 72 },
  { id: "kyoto-fushimi-inari", type: "neighborhood", ko: "후시미이나리", ja: "ふしみいなり", lat: 34.9671, lng: 135.7727, minZoom: 12.5, weight: 76 },
  { id: "kyoto-arashiyama", type: "neighborhood", ko: "아라시야마", ja: "あらしやま", lat: 35.0094, lng: 135.6668, minZoom: 12.5, weight: 74 },

  { id: "station-shinjuku", type: "station", ko: "신주쿠역", ja: "しんじゅくえき", lat: 35.6896, lng: 139.7006, minZoom: 13, weight: 112 },
  { id: "station-shibuya", type: "station", ko: "시부야역", ja: "しぶやえき", lat: 35.6580, lng: 139.7016, minZoom: 13, weight: 108 },
  { id: "station-shinokubo", type: "station", ko: "신오쿠보역", ja: "しんおおくぼえき", lat: 35.7013, lng: 139.7001, minZoom: 13.5, weight: 92 },
  { id: "station-ueno", type: "station", ko: "우에노역", ja: "うえのえき", lat: 35.7138, lng: 139.7773, minZoom: 13, weight: 96 },
  { id: "station-akihabara", type: "station", ko: "아키하바라역", ja: "あきはばらえき", lat: 35.6984, lng: 139.7731, minZoom: 13.5, weight: 92 },
  { id: "station-ikebukuro", type: "station", ko: "이케부쿠로역", ja: "いけぶくろえき", lat: 35.7295, lng: 139.7109, minZoom: 13, weight: 98 },
  { id: "station-tokyo", type: "station", ko: "도쿄역", ja: "とうきょうえき", lat: 35.6812, lng: 139.7671, minZoom: 13, weight: 98 },
  { id: "station-namba", type: "station", ko: "난바역", ja: "なんばえき", lat: 34.6665, lng: 135.5005, minZoom: 13, weight: 106 },
  { id: "station-umeda", type: "station", ko: "우메다역", ja: "うめだえき", lat: 34.7029, lng: 135.4985, minZoom: 13, weight: 100 },
  { id: "station-tsuruhashi", type: "station", ko: "쓰루하시역", ja: "つるはしえき", lat: 34.6652, lng: 135.5308, minZoom: 13.5, weight: 88 },
  { id: "station-shinimamiya", type: "station", ko: "신이마미야역", ja: "しんいまみやえき", lat: 34.6501, lng: 135.5008, minZoom: 13.5, weight: 84 },
  { id: "station-hakata", type: "station", ko: "하카타역", ja: "はかたえき", lat: 33.5902, lng: 130.4206, minZoom: 13, weight: 108 },
  { id: "station-tenjin", type: "station", ko: "텐진역", ja: "てんじんえき", lat: 33.5904, lng: 130.3992, minZoom: 13, weight: 96 },
  { id: "station-gion-shijo", type: "station", ko: "기온시조역", ja: "ぎおんしじょうえき", lat: 35.0037, lng: 135.7725, minZoom: 13, weight: 96 },
  { id: "station-kyoto-kawaramachi", type: "station", ko: "교토가와라마치역", ja: "きょうとかわらまちえき", lat: 35.0036, lng: 135.7685, minZoom: 13, weight: 94 },
  { id: "station-karasuma", type: "station", ko: "가라스마역", ja: "からすまえき", lat: 35.0038, lng: 135.7591, minZoom: 13.5, weight: 82 },

  { id: "block-kabukicho-1", type: "block", ko: "가부키초 1초메", ja: "かぶきちょう いっちょうめ", lat: 35.6949, lng: 139.7037, minZoom: 14.5, weight: 58 },
  { id: "block-shinjuku-3", type: "block", ko: "신주쿠 3초메", ja: "しんじゅく さんちょうめ", lat: 35.6904, lng: 139.7062, minZoom: 14.5, weight: 56 },
  { id: "block-nishi-shinjuku-1", type: "block", ko: "니시신주쿠 1초메", ja: "にししんじゅく いっちょうめ", lat: 35.6907, lng: 139.6972, minZoom: 14.5, weight: 54 },
  { id: "block-yoyogi-1", type: "block", ko: "요요기 1초메", ja: "よよぎ いっちょうめ", lat: 35.6824, lng: 139.7016, minZoom: 14.5, weight: 50 },
  { id: "block-jingumae", type: "block", ko: "진구마에", ja: "じんぐうまえ", lat: 35.6690, lng: 139.7078, minZoom: 14.5, weight: 54 },
  { id: "block-shibuya-1", type: "block", ko: "시부야 1초메", ja: "しぶや いっちょうめ", lat: 35.6608, lng: 139.7045, minZoom: 14.5, weight: 54 },
  { id: "block-dogenzaka-2", type: "block", ko: "도겐자카 2초메", ja: "どうげんざか にちょうめ", lat: 35.6592, lng: 139.6962, minZoom: 14.5, weight: 52 },
  { id: "block-ueno-6", type: "block", ko: "우에노 6초메", ja: "うえの ろくちょうめ", lat: 35.7105, lng: 139.7766, minZoom: 14.5, weight: 52 },
  { id: "block-sotokanda", type: "block", ko: "소토칸다", ja: "そとかんだ", lat: 35.7003, lng: 139.7713, minZoom: 14.5, weight: 50 },
  { id: "block-asakusa-1", type: "block", ko: "아사쿠사 1초메", ja: "あさくさ いっちょうめ", lat: 35.7134, lng: 139.7932, minZoom: 14.5, weight: 50 },
  { id: "block-dotonbori-1", type: "block", ko: "도톤보리 1초메", ja: "どうとんぼり いっちょうめ", lat: 34.6687, lng: 135.5030, minZoom: 14.5, weight: 58 },
  { id: "block-namba-3", type: "block", ko: "난바 3초메", ja: "なんば さんちょうめ", lat: 34.6649, lng: 135.5013, minZoom: 14.5, weight: 56 },
  { id: "block-sennichimae", type: "block", ko: "센니치마에", ja: "せんにちまえ", lat: 34.6658, lng: 135.5034, minZoom: 14.5, weight: 54 },
  { id: "block-nipponbashi-4", type: "block", ko: "닛폰바시 4초메", ja: "にっぽんばし よんちょうめ", lat: 34.6599, lng: 135.5066, minZoom: 14.5, weight: 50 },
  { id: "block-ebisuhigashi", type: "block", ko: "에비스히가시", ja: "えびすひがし", lat: 34.6525, lng: 135.5063, minZoom: 14.5, weight: 50 },
  { id: "block-umeda-1", type: "block", ko: "우메다 1초메", ja: "うめだ いっちょうめ", lat: 34.6996, lng: 135.4973, minZoom: 14.5, weight: 54 },
  { id: "block-sonezaki", type: "block", ko: "소네자키", ja: "そねざき", lat: 34.7014, lng: 135.5008, minZoom: 14.5, weight: 50 },
  { id: "block-shinsaibashisuji", type: "block", ko: "신사이바시스지", ja: "しんさいばしすじ", lat: 34.6727, lng: 135.5011, minZoom: 14.5, weight: 54 },
  { id: "block-hakata-ekimae", type: "block", ko: "하카타역앞", ja: "はかたえきまえ", lat: 33.5900, lng: 130.4172, minZoom: 14.5, weight: 56 },
  { id: "block-hakata-ekihigashi", type: "block", ko: "하카타역동", ja: "はかたえきひがし", lat: 33.5887, lng: 130.4244, minZoom: 14.5, weight: 52 },
  { id: "block-sumiyoshi", type: "block", ko: "스미요시", ja: "すみよし", lat: 33.5850, lng: 130.4112, minZoom: 14.5, weight: 48 },
  { id: "block-tenjin-2", type: "block", ko: "덴진 2초메", ja: "てんじん にちょうめ", lat: 33.5905, lng: 130.3970, minZoom: 14.5, weight: 54 },
  { id: "block-daimyo-1", type: "block", ko: "다이묘 1초메", ja: "だいみょう いっちょうめ", lat: 33.5886, lng: 130.3933, minZoom: 14.5, weight: 50 },
  { id: "block-nakasu-4", type: "block", ko: "나카스 4초메", ja: "なかす よんちょうめ", lat: 33.5924, lng: 130.4068, minZoom: 14.5, weight: 48 },
  { id: "block-gionmachi", type: "block", ko: "기온마치", ja: "ぎおんまち", lat: 33.5931, lng: 130.4143, minZoom: 14.5, weight: 48 },
  { id: "block-kiyamachi-shijo", type: "block", ko: "기야마치 4조", ja: "きやまち しじょう", lat: 35.0039, lng: 135.7707, minZoom: 14.5, weight: 54 },
  { id: "block-pontocho", type: "block", ko: "폰토초", ja: "ぽんとちょう", lat: 35.0067, lng: 135.7702, minZoom: 14.5, weight: 52 },
  { id: "block-gionmachi-kyoto", type: "block", ko: "기온마치", ja: "ぎおんまち", lat: 35.0038, lng: 135.7754, minZoom: 14.5, weight: 50 },
  { id: "block-yasaka", type: "block", ko: "야사카 주변", ja: "やさか しゅうへん", lat: 35.0037, lng: 135.7786, minZoom: 14.5, weight: 48 },
  { id: "block-kyoto-station-north", type: "block", ko: "교토역 북쪽", ja: "きょうとえき きたがわ", lat: 34.9870, lng: 135.7590, minZoom: 14.5, weight: 52 },
  { id: "block-kyoto-station-south", type: "block", ko: "교토역 남쪽", ja: "きょうとえき みなみがわ", lat: 34.9839, lng: 135.7590, minZoom: 14.5, weight: 50 },
  { id: "block-ninenzaka", type: "block", ko: "니넨자카", ja: "にねんざか", lat: 34.9965, lng: 135.7801, minZoom: 14.5, weight: 48 },
  { id: "block-sannenzaka", type: "block", ko: "산넨자카", ja: "さんねんざか", lat: 34.9960, lng: 135.7816, minZoom: 14.5, weight: 48 },
  { id: "block-fushimi-inari-front", type: "block", ko: "후시미이나리역 앞", ja: "ふしみいなりえきまえ", lat: 34.9677, lng: 135.7708, minZoom: 14.5, weight: 48 },

  { id: "road-yasukuni", type: "road", ko: "야스쿠니도리", ja: "やすくにどおり", lat: 35.6937, lng: 139.7068, minZoom: 14, weight: 70 },
  { id: "road-shinjuku-dori", type: "road", ko: "신주쿠도리", ja: "しんじゅくどおり", lat: 35.6901, lng: 139.7086, minZoom: 14, weight: 68 },
  { id: "road-koshu-kaido", type: "road", ko: "고슈카이도", ja: "こうしゅうかいどう", lat: 35.6878, lng: 139.6956, minZoom: 14, weight: 66 },
  { id: "road-ome-kaido", type: "road", ko: "오메카이도", ja: "おうめかいどう", lat: 35.6974, lng: 139.6963, minZoom: 14, weight: 62 },
  { id: "road-meiji-tokyo", type: "road", ko: "메이지도리", ja: "めいじどおり", lat: 35.6824, lng: 139.7067, minZoom: 14, weight: 66 },
  { id: "road-aoyama-dori", type: "road", ko: "아오야마도리", ja: "あおやまどおり", lat: 35.6654, lng: 139.7157, minZoom: 14, weight: 62 },
  { id: "road-roppongi-dori", type: "road", ko: "롯폰기도리", ja: "ろっぽんぎどおり", lat: 35.6617, lng: 139.7279, minZoom: 14, weight: 60 },
  { id: "road-omotesando", type: "road", ko: "오모테산도", ja: "おもてさんどう", lat: 35.6665, lng: 139.7089, minZoom: 14, weight: 60 },
  { id: "road-takeshita", type: "road", ko: "다케시타도리", ja: "たけしたどおり", lat: 35.6712, lng: 139.7049, minZoom: 14.5, weight: 54 },
  { id: "road-chuo-dori-tokyo", type: "road", ko: "주오도리", ja: "ちゅうおうどおり", lat: 35.6956, lng: 139.7738, minZoom: 14, weight: 64 },
  { id: "road-showa-dori", type: "road", ko: "쇼와도리", ja: "しょうわどおり", lat: 35.6996, lng: 139.7772, minZoom: 14, weight: 60 },
  { id: "road-yamate-dori", type: "road", ko: "야마테도리", ja: "やまてどおり", lat: 35.6989, lng: 139.6878, minZoom: 14, weight: 58 },
  { id: "road-kappabashi", type: "road", ko: "갓파바시도리", ja: "かっぱばしどおり", lat: 35.7149, lng: 139.7889, minZoom: 14, weight: 56 },
  { id: "road-kototoi", type: "road", ko: "고토토이도리", ja: "ことといどおり", lat: 35.7188, lng: 139.7996, minZoom: 14, weight: 54 },
  { id: "road-midosuji", type: "road", ko: "미도스지", ja: "みどうすじ", lat: 34.6770, lng: 135.5012, minZoom: 14, weight: 76 },
  { id: "road-sennichimae", type: "road", ko: "센니치마에도리", ja: "せんにちまえどおり", lat: 34.6666, lng: 135.5036, minZoom: 14, weight: 70 },
  { id: "road-dotonbori", type: "road", ko: "도톤보리도리", ja: "どうとんぼりどおり", lat: 34.6689, lng: 135.5035, minZoom: 14, weight: 66 },
  { id: "road-sakaisuji", type: "road", ko: "사카이스지", ja: "さかいすじ", lat: 34.6706, lng: 135.5068, minZoom: 14, weight: 62 },
  { id: "road-yotsubashi", type: "road", ko: "요쓰바시스지", ja: "よつばしすじ", lat: 34.6732, lng: 135.4978, minZoom: 14, weight: 58 },
  { id: "road-nagahori", type: "road", ko: "나가호리도리", ja: "ながほりどおり", lat: 34.6750, lng: 135.5012, minZoom: 14, weight: 62 },
  { id: "road-tanimachi", type: "road", ko: "다니마치스지", ja: "たにまちすじ", lat: 34.6768, lng: 135.5164, minZoom: 14, weight: 58 },
  { id: "road-matsuyamachi", type: "road", ko: "마쓰야마치스지", ja: "まつやまちすじ", lat: 34.6708, lng: 135.5125, minZoom: 14, weight: 54 },
  { id: "road-abiko", type: "road", ko: "아비코스지", ja: "あびこすじ", lat: 34.6427, lng: 135.5165, minZoom: 14, weight: 52 },
  { id: "road-watanabe", type: "road", ko: "와타나베도리", ja: "わたなべどおり", lat: 33.5869, lng: 130.4020, minZoom: 14, weight: 68 },
  { id: "road-taikou", type: "road", ko: "다이코도리", ja: "たいこうどおり", lat: 33.5884, lng: 130.4217, minZoom: 14, weight: 58 },
  { id: "road-kokutai", type: "road", ko: "고쿠타이도로", ja: "こくたいどうろ", lat: 33.5872, lng: 130.3995, minZoom: 14, weight: 56 },
  { id: "road-fukuoka-meiji", type: "road", ko: "메이지도리", ja: "めいじどおり", lat: 33.5912, lng: 130.3962, minZoom: 14, weight: 58 },
  { id: "road-fukuoka-showa", type: "road", ko: "쇼와도리", ja: "しょうわどおり", lat: 33.5942, lng: 130.3992, minZoom: 14, weight: 56 },
  { id: "road-hakata-ekimae", type: "road", ko: "하카타역앞도리", ja: "はかたえきまえどおり", lat: 33.5905, lng: 130.4170, minZoom: 14, weight: 56 },
  { id: "road-oyafuko", type: "road", ko: "오야후코도리", ja: "おやふこうどおり", lat: 33.5935, lng: 130.3954, minZoom: 14.5, weight: 50 },
  { id: "road-shijo", type: "road", ko: "시조도리", ja: "しじょうどおり", lat: 35.0036, lng: 135.7659, minZoom: 14, weight: 72 },
  { id: "road-kawaramachi", type: "road", ko: "가와라마치도리", ja: "かわらまちどおり", lat: 35.0061, lng: 135.7685, minZoom: 14, weight: 68 },
  { id: "road-karasuma", type: "road", ko: "가라스마도리", ja: "からすまどおり", lat: 35.0029, lng: 135.7590, minZoom: 14, weight: 64 },
  { id: "road-higashioji", type: "road", ko: "히가시오지도리", ja: "ひがしおおじどおり", lat: 34.9998, lng: 135.7789, minZoom: 14, weight: 60 },
  { id: "road-shichijo", type: "road", ko: "시치조도리", ja: "しちじょうどおり", lat: 34.9897, lng: 135.7617, minZoom: 14, weight: 54 },
  { id: "road-sanjo", type: "road", ko: "산조도리", ja: "さんじょうどおり", lat: 35.0087, lng: 135.7669, minZoom: 14, weight: 62 },
  { id: "road-gojo", type: "road", ko: "고조도리", ja: "ごじょうどおり", lat: 34.9964, lng: 135.7623, minZoom: 14, weight: 60 },
  { id: "road-kiyamachi", type: "road", ko: "기야마치도리", ja: "きやまちどおり", lat: 35.0060, lng: 135.7706, minZoom: 14.5, weight: 58 },
  { id: "road-pontocho", type: "road", ko: "폰토초도리", ja: "ぽんとちょうどおり", lat: 35.0067, lng: 135.7700, minZoom: 14.5, weight: 54 },
  { id: "road-marutamachi", type: "road", ko: "마루타마치도리", ja: "まるたまちどおり", lat: 35.0175, lng: 135.7625, minZoom: 14, weight: 54 },
  { id: "road-oike", type: "road", ko: "오이케도리", ja: "おいけどおり", lat: 35.0106, lng: 135.7628, minZoom: 14, weight: 56 }
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
  reports: normalizeReports(readJson("sumimap:reports", [])),
  reportFeedOpen: false
};

const placesById = new Map(places.map((place) => [place.id, place]));
const validPlaceIds = new Set(placesById.keys());
const categoriesByKey = new Map(categories.map((category) => [category.key, category]));
const categoryEmojis = new Map(categories.map((category) => [category.key, category.emoji]));
const scenariosByKey = new Map(scenarios.map((scenario) => [scenario.key, scenario]));
const reportTagsByKey = new Map(reportTags.map((tag) => [tag.key, tag]));
const reportTagsByLabel = new Map(reportTags.map((tag) => [tag.label, tag]));

const sheet = document.querySelector("#sheet");
const appShell = document.querySelector(".app-shell");
const toast = document.querySelector("#toast");
const statusPill = document.querySelector("#statusPill");
const mapQuickRail = document.querySelector("#mapQuickRail");
const locateButton = document.querySelector("#locateButton");
const searchPanel = document.querySelector("#searchPanel");
const searchToggle = document.querySelector("#searchToggle");
const languageToggle = document.querySelector("#languageToggle");
const feedbackButton = document.querySelector("#feedbackButton");
const siblingButton = document.querySelector("#siblingButton");
const searchClear = document.querySelector("#searchClear");
const placeSearch = document.querySelector("#placeSearch");
const addressSearchButton = document.querySelector("#addressSearchButton");
const addressResults = document.querySelector("#addressResults");

let map;
let markerLayer;
let mapLabelLayer;
let userLocationLayer;
let baseMapLayer;
let baseMapSeq = 0;
const markers = new Map();
const markerClassNames = new Map();
let reportVersion = 0;
let visibleReportsCache = null;
let derivedPlaceCache = new Map();
const vectorStyleCache = new Map();
let mapLibreLoadPromise = null;
let filteredPlacesCacheKey = "";
let filteredPlacesCache = [];
let started = false;
let sheetPointerStartY = null;
let sheetPointerStartX = null;
let sheetPointerStartMode = "";
let sheetPointerMoved = false;
let ignoreNextSheetToggleClick = false;
let addressSearchSeq = 0;
let locationPickPending = false;
let reportSyncTimer = null;
let reportSyncInFlight = false;
let reportSyncAvailable = true;
let reportLastFailureAt = 0;
let reportServerFingerprint = "";
let searchRenderFrame = 0;
let mapResizeTimer = 0;
let mapLabelFrame = 0;
let mapInteractionTimer = 0;
let pendingMapRenderFrame = 0;
let sheetHtmlCache = "";
let markerRenderKey = "";
let mapLabelRenderKey = "";
let quickRailHtmlCache = "";
let mapInteractionActive = false;

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
  applyEntryParams();
  renderMapQuickRail();
  renderAddressResults();
  renderSheet();
  renderMarkers();
  refreshStatus();
  setSearchPanel(false);
  registerServiceWorkerWhenIdle();
  runAfterFirstPaint(startReportSync, 1800, 3200);
}

function bootMap() {
  const compactViewport = isCompactViewport();
  const initialZoom = compactViewport ? Math.min(cities.tokyo.zoom, 11) : cities.tokyo.zoom;
  map = L.map("map", {
    zoomControl: false,
    attributionControl: true,
    keyboard: false,
    boxZoom: false,
    fadeAnimation: false,
    zoomAnimation: false,
    markerZoomAnimation: false
  }).setView(cities.tokyo.center, initialZoom);

  const labelPane = map.createPane("sumimapLabelPane");
  labelPane.classList.add("sumimap-label-pane");
  labelPane.style.zIndex = "550";
  labelPane.style.pointerEvents = "none";
  mapLabelLayer = L.layerGroup().addTo(map);
  markerLayer = map.createPane("sumimapFastMarkerPane");
  markerLayer.classList.add("sumimap-fast-marker-pane");
  markerLayer.style.zIndex = "600";
  markerLayer.addEventListener("click", handleMarkerLayerClick);
  markerLayer.addEventListener("keydown", handleMarkerLayerKeydown);
  L.DomEvent.disableClickPropagation(markerLayer);
  L.DomEvent.disableScrollPropagation(markerLayer);
  setBaseMapLanguage(state.language, false);

  map.on("movestart zoomstart dragstart", beginMapInteraction);
  map.on("moveend zoomend dragend", finishMapInteraction);
  map.on("moveend zoomend", scheduleMapRenderAfterInteraction);
  map.on("contextmenu", selectHeldMapPointForReport);
  map.on("click", () => {
    if (!searchPanel?.hidden) setSearchPanel(false);
    if (state.activePanel === "near" && state.sheetMode !== "collapsed") {
      setSheetMode("collapsed");
    }
  });
}

function setBaseMapLanguage(language, notify = true) {
  const seq = baseMapSeq + 1;
  baseMapSeq = seq;
  const mapLanguage = language === "ja" ? "ja" : "ko";
  document.querySelector("#map")?.setAttribute("data-map-language", mapLanguage);
  replaceBaseMap(rasterBaseMap(mapLanguage));
  if (notify) showToast("지도 언어를 바꿨어.");
  mapLabelRenderKey = "";
  scheduleMapLabels();
  if (enableVectorBaseMap) {
    scheduleVectorMapUpgrade(mapLanguage, seq, notify);
  }
}

function scheduleVectorMapUpgrade(mapLanguage, seq, userRequested = false) {
  const connection = navigator.connection;
  if (connection?.saveData || /^(slow-2g|2g)$/.test(connection?.effectiveType || "")) return;
  if (!userRequested && navigator.deviceMemory && navigator.deviceMemory <= 3) return;
  const upgrade = () => upgradeToVectorBaseMap(mapLanguage, seq);
  const compactViewport = isCompactViewport();
  const delay = userRequested ? 700 : compactViewport ? 12000 : 6200;
  const timeout = userRequested ? 2600 : compactViewport ? 18000 : 9500;
  runAfterFirstPaint(upgrade, delay, timeout);
}

async function upgradeToVectorBaseMap(mapLanguage, seq) {
  try {
    await loadMapLibreAssets();
    if (
      !window.maplibregl ||
      !L.maplibreGL ||
      (typeof window.maplibregl.supported === "function" && !window.maplibregl.supported({ failIfMajorPerformanceCaveat: true }))
    ) {
      throw new Error("vector map unavailable");
    }
    const style = await localizedVectorStyle(mapLanguage);
    if (seq !== baseMapSeq || !map) return;
    const nextLayer = L.maplibreGL({
      style,
      interactive: false
    });
    nextLayer.on?.("error", () => fallbackToRasterBaseMap(nextLayer, mapLanguage));
    map.getContainer().addEventListener("webglcontextlost", (event) => {
      event.preventDefault?.();
      fallbackToRasterBaseMap(nextLayer, mapLanguage);
    }, { once: true, capture: true });
    replaceBaseMap(nextLayer);
  } catch {
    if (seq !== baseMapSeq || !map) return;
    if (!baseMapLayer) replaceBaseMap(rasterBaseMap(mapLanguage));
  }
}

async function loadMapLibreAssets() {
  if (window.maplibregl && L.maplibreGL) return;
  if (!mapLibreLoadPromise) {
    mapLibreLoadPromise = Promise.all([
      loadStylesheet(mapLibreCssUrl),
      loadScript(mapLibreScriptUrl).then(() => loadScript(mapLibreLeafletScriptUrl))
    ]).catch((error) => {
      mapLibreLoadPromise = null;
      throw error;
    });
  }
  await mapLibreLoadPromise;
}

function loadStylesheet(href) {
  if (document.querySelector(`link[href="${href}"]`)) return Promise.resolve();
  return new Promise((resolve) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.onload = resolve;
    link.onerror = resolve;
    document.head.appendChild(link);
  });
}

function loadScript(src) {
  const existing = document.querySelector(`script[src="${src}"]`);
  if (existing?.dataset.loaded === "true") return Promise.resolve();
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", resolve, { once: true });
      existing.addEventListener("error", reject, { once: true });
    });
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => {
      script.dataset.loaded = "true";
      resolve();
    };
    script.onerror = () => {
      script.remove();
      reject(new Error(`Failed to load ${src}`));
    };
    document.head.appendChild(script);
  });
}

function registerServiceWorkerWhenIdle() {
  if (!("serviceWorker" in navigator)) return;
  const register = () => navigator.serviceWorker.register("/sw.js").catch(() => {});
  runAfterFirstPaint(register, 2400, 5200);
}

function runWhenIdle(callback, timeout = 2000) {
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(callback, { timeout });
  } else {
    window.setTimeout(callback, Math.min(timeout, 1600));
  }
}

function runAfterFirstPaint(callback, delay = 800, idleTimeout = 2000) {
  const schedule = () => window.setTimeout(() => runWhenIdle(callback, idleTimeout), delay);
  if ("requestAnimationFrame" in window) {
    window.requestAnimationFrame(() => window.requestAnimationFrame(schedule));
  } else {
    schedule();
  }
}

function fallbackToRasterBaseMap(layer, language) {
  if (!map || baseMapLayer !== layer) return;
  replaceBaseMap(rasterBaseMap(language));
}

function replaceBaseMap(nextLayer) {
  if (baseMapLayer) {
    map.removeLayer(baseMapLayer);
  }
  baseMapLayer = nextLayer.addTo(map);
}

function rasterBaseMap(language = "ko") {
  return L.tileLayer(rasterBaseMapUrl, {
    maxZoom: 19,
    subdomains: "abcd",
    attribution: "&copy; OpenStreetMap &copy; CARTO",
    updateWhenIdle: true,
    updateWhenZooming: false,
    keepBuffer: isCompactViewport() ? 0 : 1
  });
}

function isCompactViewport() {
  return window.matchMedia?.("(max-width: 760px), (pointer: coarse)")?.matches || window.innerWidth <= 760;
}

async function localizedVectorStyle(language) {
  if (vectorStyleCache.has(language)) return cloneJson(vectorStyleCache.get(language));
  const response = await fetch(vectorMapStyleUrl, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`map style ${response.status}`);
  const style = await response.json();
  const labelExpression = mapLabelExpression(language);

  style.layers = style.layers.map((layer) => {
    if (layer.type !== "symbol" || !layer.layout?.["text-field"]) return layer;
    return {
      ...layer,
      layout: {
        ...layer.layout,
        "text-field": labelExpression
      }
    };
  });

  vectorStyleCache.set(language, style);
  return cloneJson(style);
}

function mapLabelExpression(language) {
  const fields = language === "ja"
    ? ["name:ja", "name_ja", "name:ja_kana", "name"]
    : ["name:ko", "name_ko"];
  return ["coalesce", ...fields.map((field) => ["get", field])];
}

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
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
  siblingButton?.addEventListener("click", openSiblingDialog);
  feedbackButton?.addEventListener("click", openFeedbackDialog);

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || searchPanel.hidden) return;
    setSearchPanel(false);
    searchToggle.focus();
  });

  document.addEventListener("click", handleFeedbackClick);
  document.addEventListener("submit", handleFeedbackSubmit);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && document.querySelector(".feedback-overlay")) {
      closeSiblingDialog();
      closeFeedbackDialog();
    }
  });

  mapQuickRail.addEventListener("click", (event) => {
    const button = event.target.closest("[data-quick-scenario]");
    if (!button) return;
    applyScenario(button.dataset.quickScenario);
  });

  sheet.addEventListener("pointerdown", (event) => {
    const handle = event.target.closest("[data-sheet-toggle]");
    if (!handle) return;
    sheetPointerStartY = event.clientY;
    sheetPointerStartX = event.clientX;
    sheetPointerStartMode = state.sheetMode;
    sheetPointerMoved = false;
    sheet.classList.add("is-dragging");
    sheet.style.setProperty("--sheet-drag-offset", "0px");
    try {
      handle.setPointerCapture?.(event.pointerId);
    } catch {
      // Synthetic pointer events used by some test runners do not own capture.
    }
  });

  sheet.addEventListener("pointermove", (event) => {
    if (sheetPointerStartY === null || sheetPointerStartX === null) return;

    const deltaY = event.clientY - sheetPointerStartY;
    const deltaX = event.clientX - sheetPointerStartX;
    if (Math.abs(deltaY) > 6 || Math.abs(deltaX) > 6) {
      sheetPointerMoved = true;
    }
    if (Math.abs(deltaY) > 12 && Math.abs(deltaY) > Math.abs(deltaX)) {
      event.preventDefault();
      previewSheetDrag(deltaY);
    }
  });

  sheet.addEventListener("pointerup", (event) => {
    if (sheetPointerStartY === null) return;

    const deltaY = event.clientY - sheetPointerStartY;
    const moved = sheetPointerMoved;
    clearSheetDragState();
    if (Math.abs(deltaY) < 28) {
      if (moved) {
        ignoreNextSheetToggleClick = true;
        window.setTimeout(() => {
          ignoreNextSheetToggleClick = false;
        }, 0);
      }
      return;
    }

    setSheetMode(deltaY > 0 ? "collapsed" : "expanded");
    ignoreNextSheetToggleClick = true;
    window.setTimeout(() => {
      ignoreNextSheetToggleClick = false;
    }, 0);
  });

  sheet.addEventListener("pointercancel", () => {
    clearSheetDragState();
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
    scheduleSearchRender();
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
      setMapView(city.center, city.zoom);
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

    const focusListButton = event.target.closest("[data-focus-list]");
    if (focusListButton) {
      focusCandidateList();
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
      setMapView([place.lat, place.lng], 15);
      renderSheet();
      renderMarkers();
      return;
    }

    const saveButton = event.target.closest("[data-save]");
    if (saveButton) {
      toggleSave(saveButton.dataset.save);
      return;
    }

    const saveRouteButton = event.target.closest("[data-save-route]");
    if (saveRouteButton) {
      saveRouteCandidates();
      return;
    }

    const shareEntryButton = event.target.closest("[data-share-entry]");
    if (shareEntryButton) {
      shareEntryLink(shareEntryButton.dataset.shareEntry);
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
      return;
    }

    const reportDelete = event.target.closest("[data-report-delete]");
    if (reportDelete) {
      deleteReport(reportDelete.dataset.reportDelete);
      return;
    }
  });
}

function setPanel(panel) {
  state.activePanel = panel;
  state.sheetMode = panel === "near" ? "collapsed" : "expanded";
  setActiveNav(panel);

  if (panel === "near") {
    const place = getSelectedPlace();
    if (place) setMapView([place.lat, place.lng], 14);
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

function previewSheetDrag(deltaY) {
  const maxOffset = 88;
  const offset = sheetPointerStartMode === "collapsed"
    ? Math.min(0, Math.max(deltaY, -maxOffset))
    : Math.max(0, Math.min(deltaY, maxOffset));
  sheet.style.setProperty("--sheet-drag-offset", `${Math.round(offset)}px`);
}

function clearSheetDragState() {
  sheetPointerStartY = null;
  sheetPointerStartX = null;
  sheetPointerStartMode = "";
  sheetPointerMoved = false;
  sheet.classList.remove("is-dragging");
  sheet.style.removeProperty("--sheet-drag-offset");
}

function setSheetMode(mode) {
  state.sheetMode = mode === "collapsed" ? "collapsed" : "expanded";
  syncSheetMode();
  if (map) {
    scheduleMapResize(220);
  }
}

function scheduleMapResize(delay = 180) {
  window.clearTimeout(mapResizeTimer);
  mapResizeTimer = window.setTimeout(() => {
    mapResizeTimer = 0;
    map?.invalidateSize?.();
  }, delay);
}

function beginMapInteraction() {
  window.clearTimeout(mapInteractionTimer);
  if (mapInteractionActive) return;
  mapInteractionActive = true;
  appShell?.classList.add("is-map-moving");
  if (mapLabelLayer) {
    mapLabelLayer.clearLayers();
    mapLabelRenderKey = "";
  }
}

function finishMapInteraction() {
  window.clearTimeout(mapInteractionTimer);
  mapInteractionTimer = window.setTimeout(() => {
    mapInteractionTimer = 0;
    mapInteractionActive = false;
    appShell?.classList.remove("is-map-moving");
    renderMarkers();
  }, isCompactViewport() ? 120 : 70);
}

function scheduleMapRenderAfterInteraction() {
  if (mapInteractionActive) {
    finishMapInteraction();
    return;
  }
  if (pendingMapRenderFrame) return;
  const schedule = window.requestAnimationFrame || ((callback) => window.setTimeout(callback, 16));
  pendingMapRenderFrame = schedule(() => {
    pendingMapRenderFrame = 0;
    renderMarkers();
  });
}

function setMapView(center, zoom) {
  if (!map || !center) return;
  map.setView(center, zoom, { animate: false });
  scheduleMapLabels();
}

function scheduleMapLabels() {
  if (mapInteractionActive) {
    mapLabelRenderKey = "";
    return;
  }
  if (mapLabelFrame) return;
  mapLabelFrame = window.setTimeout(() => {
    mapLabelFrame = 0;
    runWhenIdle(() => {
      if (!mapInteractionActive) renderMapLabels();
    }, isCompactViewport() ? 900 : 600);
  }, isCompactViewport() ? 140 : 80);
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
  setBaseMapLanguage(state.language);
  localizeCustomPlacesForLanguage(state.language);
  applyStaticLanguage();
  renderMapQuickRail();
  renderAddressResults();
  renderSheet();
  renderMarkers();
  refreshStatus();
  showToast(state.language === "ja" ? "일본어 지도와 문장으로 바꿨어." : "한국어 지도와 문장으로 바꿨어.");
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
  document.querySelector(".brand-mark").textContent = japanese ? "す" : "스";
  document.querySelector(".brand strong").textContent = t("스미맵");
  document.querySelector(".brand small").textContent = t("일본 생활 제보 지도");

  locateButton?.setAttribute("aria-label", t("현재 위치로 이동"));
  searchToggle?.setAttribute("aria-label", t(searchPanel?.hidden ? "검색 열기" : "검색 닫기"));
  languageToggle?.setAttribute("aria-label", japanese ? t("한국어로 보기") : t("일본어로 번역"));
  languageToggle?.setAttribute("aria-pressed", String(japanese));
  siblingButton?.setAttribute("aria-label", japanese ? "きょうだいサービスをみる" : "형제 서비스 보기");
  feedbackButton?.setAttribute("aria-label", feedbackCopy("buttonLabel"));
  const languageCode = languageToggle?.querySelector(".language-code");
  if (languageCode) languageCode.textContent = japanese ? "한" : "일";

  if (placeSearch) placeSearch.placeholder = t("한국어 주소·역 이름 검색");
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

function applyEntryParams() {
  const params = new URLSearchParams(window.location.search);
  const cityKey = params.get("city");
  const scenarioKey = params.get("case") || params.get("scenario");
  const filterKey = params.get("filter");
  const placeId = params.get("place");
  const panel = params.get("panel");

  if (cities[cityKey]) {
    setMapView(cities[cityKey].center, cities[cityKey].zoom);
  }

  if (scenariosByKey.has(scenarioKey)) {
    const scenario = scenariosByKey.get(scenarioKey);
    state.activeScenario = scenario.key;
    state.filter = scenario.filter;
    state.sheetMode = "collapsed";
  } else if (categoriesByKey.has(filterKey)) {
    state.filter = filterKey;
  }

  if (validPlaceIds.has(placeId)) {
    const place = placesById.get(placeId);
    state.selectedId = place.id;
    state.activePanel = "near";
    state.sheetMode = "expanded";
    setMapView([place.lat, place.lng], 15);
    rememberPlace(place.id);
  } else {
    syncSelectedWithFiltered();
  }

  if (panel === "report") {
    state.activePanel = "report";
    state.sheetMode = "expanded";
  }

  setActiveNav(state.activePanel);
}

function renderSheet() {
  let nextHtml = "";
  if (state.activePanel === "filters") {
    nextHtml = renderFilters();
  } else if (state.activePanel === "report") {
    nextHtml = renderReport();
  } else if (state.activePanel === "saved") {
    nextHtml = renderSaved();
  } else if (state.activePanel === "guide") {
    nextHtml = renderGuide();
  } else {
    nextHtml = renderNearby();
  }
  if (sheetHtmlCache !== nextHtml) {
    sheet.innerHTML = nextHtml;
    sheetHtmlCache = nextHtml;
  }
  syncSheetMode();
}

function renderNearby() {
  const list = getFilteredPlaces();
  const place = list.find((item) => item.id === state.selectedId) || null;
  const introHead = place
    ? ""
    : `
    <div class="sheet-head" data-sheet-toggle>
      <div>
        <h1>${t("지도에서 이모티콘을 눌러요")}</h1>
        <p>${t("원하는 표시를 누르면 필요한 정보만 짧게 떠요.")}</p>
      </div>
      <div class="sheet-head-actions">
        <button class="sheet-mini-action" type="button" data-sheet-collapse>${t("지도 크게")}</button>
        <span class="compact-stat">${countLabel(list.length, "곳")}</span>
      </div>
    </div>
  `;

  return `
    <button class="sheet-grip" type="button" data-sheet-toggle aria-label="${escapeAttr(t("패널 열고 닫기"))}"></button>
    ${introHead}
    ${renderContextTools()}
    ${place ? renderPlaceBrief(place) : renderMapFirstHint(list)}
  `;
}

function renderFilters() {
  return `
    <button class="sheet-grip" type="button" data-sheet-toggle aria-label="${escapeAttr(t("패널 열고 닫기"))}"></button>
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
    <button class="sheet-grip" type="button" data-sheet-toggle aria-label="${escapeAttr(t("패널 열고 닫기"))}"></button>
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
    <button class="sheet-grip" type="button" data-sheet-toggle aria-label="${escapeAttr(t("패널 열고 닫기"))}"></button>
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
    ${renderSavedCompare(savedPlaces)}
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
    <button class="sheet-grip" type="button" data-sheet-toggle aria-label="${escapeAttr(t("패널 열고 닫기"))}"></button>
    <div class="sheet-head" data-sheet-toggle>
      <div>
        <h2>${t("스미맵 기준")}</h2>
        <p>${t("일본 생활 중 곤란한 순간을 빠르게 피하기 위한 한국어 지도예요.")}</p>
      </div>
      <button class="sheet-mini-action" type="button" data-sheet-collapse>${t("지도 크게")}</button>
    </div>
    <ul class="note-list">
      <li>${t("응대 불편은 상대를 공격하는 표시가 아니라, 방문자가 조심할 수 있게 만드는 약한 신호예요.")}</li>
      <li>${t("제보는 바로 반영하되 자유 텍스트는 열지 않아 광고와 운영 리스크를 낮춰요.")}</li>
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

function renderMiniRoute(list, selected) {
  const route = getRouteCandidates(list, selected);
  if (route.length < 2) return "";
  const signalCount = route.reduce((sum, place) => sum + totalSignals(place), 0);

  return `
    <section class="route-card">
      <div class="route-head">
        <div>
          <span>${t("오늘 미니 동선")}</span>
          <strong>${t("급한 일 3곳으로 압축")}</strong>
          <p>${t("가까운 후보를 묶어두면 다시 검색하지 않아도 돼요.")}</p>
        </div>
        <span class="route-signal">${signalCount}${t("신호")}</span>
      </div>
      <div class="route-steps">
        ${route.map((place, index) => `
          <button class="route-step" type="button" data-place-id="${escapeAttr(place.id)}">
            <span class="route-number">${index + 1}</span>
            <span class="route-emoji" aria-hidden="true">${categoryEmoji(place.category)}</span>
            <span>
              <strong>${escapeHtml(shortPlaceName(placeText(place, "name")))}</strong>
              <small>${escapeHtml(distanceLabel(place))} · ${getLiveTags(place).slice(0, 2).map((tag) => `${emojiForTag(tag)} ${escapeHtml(tagText(tag))}`).join(" · ")}</small>
            </span>
          </button>
        `).join("")}
      </div>
      <div class="detail-actions compact-actions">
        <button class="primary-button route-save" type="button" data-save-route>${icon("bookmark-check")}${t("코스 저장")}</button>
        <button class="text-button" type="button" data-open-panel="saved">${icon("bookmark")}${t("저장 보기")}</button>
      </div>
    </section>
  `;
}

function renderEntryShareCard(list, selected) {
  const route = getRouteCandidates(list, selected);
  return `
    <section class="entry-share-card">
      <div class="entry-share-head">
        <div>
          <span>${t("바로 공유")}</span>
          <strong>${t("스미맵에서 바로 확인")}</strong>
          <p>${t("지금 보는 조건을 그대로 열 수 있게 공유해요.")}</p>
        </div>
      </div>
      <div class="entry-share-grid">
        <button type="button" data-share-entry="view">${icon("share-2")}<span>${t("현재 보기")}</span></button>
        <button type="button" data-share-entry="route" ${route.length < 2 ? "disabled" : ""}>${icon("map")}<span>${t("미니 동선")}</span></button>
        <button type="button" data-share-entry="report">${icon("plus")}<span>${t("제보 입구")}</span></button>
        <a href="/routes/${activeCaseSlug()}/">${icon("book-open")}<span>${t("상황 가이드")}</span></a>
      </div>
    </section>
  `;
}

function renderSavedCompare(savedPlaces) {
  const targets = savedPlaces.slice(0, 4);
  if (!targets.length) {
    return `
      <section class="saved-compare is-empty">
        <div>
          <span>${t("저장 비교")}</span>
          <strong>${t("대체 후보")}</strong>
          <p>${t("저장한 장소를 더 쌓으면 비교가 좋아져요.")}</p>
        </div>
      </section>
    `;
  }

  return `
    <section class="saved-compare">
      <div class="compare-head">
        <div>
          <span>${t("저장 비교")}</span>
          <strong>${t("저장한 곳을 신호 기준으로 다시 고르세요.")}</strong>
        </div>
        <em>${targets.length}${t("곳")}</em>
      </div>
      <div class="compare-list">
        ${targets.map((place) => {
          const tags = getLiveTags(place);
          return `
            <button type="button" class="compare-row" data-place-id="${escapeAttr(place.id)}">
              <span class="compare-emoji" aria-hidden="true">${categoryEmoji(place.category)}</span>
              <span>
                <strong>${escapeHtml(shortPlaceName(placeText(place, "name")))}</strong>
                <small>${t("가장 강한 신호")} · ${tags.slice(0, 2).map((tag) => `${emojiForTag(tag)} ${escapeHtml(tagText(tag))}`).join(" · ")}</small>
              </span>
              <em>${getTrustScore(place)}%</em>
            </button>
          `;
        }).join("")}
      </div>
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

function renderMapFirstHint(list) {
  return `
    <section class="place-card place-brief">
      <h3>${t("지도에서 필요한 표시를 고른 뒤 눌러보세요.")}</h3>
      <p>${t("자세한 정보는 필터나 정보 탭에서 천천히 볼 수 있어요.")}</p>
      <div class="brief-stats">
        <div><span>${t("장소")}</span><strong>${countLabel(list.length, "곳")}</strong></div>
        <div><span>${t("빠른 상황")}</span><strong>${scenarios.slice(0, 3).map((item) => item.emoji).join(" ")}</strong></div>
      </div>
    </section>
  `;
}

function renderPlaceBrief(place) {
  const saved = state.saved.includes(place.id);
  const signals = getLiveSignals(place);
  const tags = getLiveTags(place).slice(0, 3);
  const reports = getVisibleReportsForPlace(place.id).slice(0, 3);
  const caution = signals.caution > 0;
  const line = placeText(place, "watchout") || placeText(place, "bestFor") || t("운영 시간과 현장 안내를 먼저 확인해요.");

  return `
    <section class="place-card place-brief is-selected">
      <div class="place-title-row">
        <div>
          <h3><span class="place-title-emoji" aria-hidden="true">${categoryEmoji(place.category)}</span>${escapeHtml(placeText(place, "name"))}</h3>
          <p>${escapeHtml(placeText(place, "area"))} · ${escapeHtml(placeText(place, "kind"))}</p>
        </div>
        <span class="badge ${caution ? "caution" : reports.length ? "info" : "good"}">${escapeHtml(getLiveTrust(place))}</span>
      </div>
      <div class="tag-row compact-tags" aria-label="${escapeAttr(t("간단히 보기"))}">
        ${tags.map((tag) => `<span class="badge ${tag === "응대 불편" ? "caution" : tag.includes("충전") || tag.includes("와이파이") ? "info" : tag.includes("비") || tag.includes("허락") ? "warn" : "good"}"><span class="badge-emoji" aria-hidden="true">${emojiForTag(tag)}</span>${escapeHtml(tagText(tag))}</span>`).join("")}
      </div>
      <div class="brief-line">
        <span>${t("한 줄 확인")}</span>
        <strong>${escapeHtml(line)}</strong>
      </div>
      <div class="brief-stats">
        <div><span>${t("최근 확인")}</span><strong>${escapeHtml(placeText(place, "lastSeen") || t("제보 필요"))}</strong></div>
        <div><span>${t("신뢰")}</span><strong>${getTrustScore(place)}%</strong></div>
      </div>
      <div class="detail-actions brief-actions">
        <button class="text-button" type="button" data-save="${place.id}">
          ${icon(saved ? "bookmark-check" : "bookmark")}
          ${saved ? t("저장됨") : t("저장")}
        </button>
        <a class="text-button" href="${mapsUrl(place)}" target="_blank" rel="noreferrer">
          ${icon("navigation")}
          ${t("길찾기")}
        </a>
        <button class="primary-button" type="button" data-open-report>
          ${icon("plus")}
          ${t("제보")}
        </button>
      </div>
      ${reports.length ? `
        <details class="place-more" ${state.reportFeedOpen ? "open" : ""}>
          <summary>${t("최근 제보 보기")}</summary>
          ${renderReportFeed(reports)}
        </details>
      ` : ""}
    </section>
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
      <div class="detail-actions return-actions">
        <button class="text-button" type="button" data-sheet-collapse>
          ${icon("map")}
          ${t("지도 크게")}
        </button>
        <button class="text-button" type="button" data-focus-list>
          ${icon("list")}
          ${t("다른 후보 보기")}
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
            ${canDeleteReport(report) ? `<button type="button" class="danger-action" data-report-delete="${escapeAttr(report.id)}">${t("삭제")}</button>` : ""}
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
  if (mapInteractionActive) {
    markerRenderKey = "";
    return;
  }
  const visiblePlaces = getMarkerRenderPlaces();
  const nextRenderKey = `${state.selectedId}|${markerViewportKey()}|${visiblePlaces.map((place) => `${place.id}:${place.category}`).join("|")}`;
  if (markerRenderKey === nextRenderKey) {
    syncMarkerPositions(visiblePlaces);
    scheduleMapLabels();
    return;
  }
  markerRenderKey = nextRenderKey;
  const visibleIds = new Set(visiblePlaces.map((place) => place.id));

  markers.forEach((marker, placeId) => {
    if (!visibleIds.has(placeId)) {
      marker.remove();
      markers.delete(placeId);
      markerClassNames.delete(placeId);
    }
  });

  visiblePlaces.forEach((place) => {
    const markerClassName = `sumimap-marker marker-${place.category} ${place.id === state.selectedId ? "is-selected" : ""}`;
    const existing = markers.get(place.id);

    if (existing) {
      if (markerClassNames.get(place.id) !== markerClassName) {
        existing.className = markerClassName;
        existing.innerHTML = markerLabel(place.category);
        markerClassNames.set(place.id, markerClassName);
      }
      positionMarkerElement(existing, [place.lat, place.lng]);
      return;
    }

    const marker = document.createElement("button");
    marker.type = "button";
    marker.className = markerClassName;
    marker.dataset.placeMarker = place.id;
    marker.setAttribute("aria-label", placeText(place, "name"));
    marker.innerHTML = markerLabel(place.category);
    positionMarkerElement(marker, [place.lat, place.lng]);
    markerLayer.appendChild(marker);
    markers.set(place.id, marker);
    markerClassNames.set(place.id, markerClassName);
  });
  scheduleMapLabels();
}

function syncMarkerPositions(visiblePlaces) {
  visiblePlaces.forEach((place) => {
    const marker = markers.get(place.id);
    if (marker) positionMarkerElement(marker, [place.lat, place.lng]);
  });
}

function positionMarkerElement(marker, latLng) {
  if (!map?.latLngToLayerPoint) return;
  const point = map.latLngToLayerPoint(latLng);
  marker.style.transform = `translate3d(${Math.round(point.x)}px, ${Math.round(point.y)}px, 0)`;
}

function handleMarkerLayerClick(event) {
  const marker = event.target.closest("[data-place-marker]");
  if (!marker || !markerLayer?.contains(marker)) return;
  event.preventDefault();
  event.stopPropagation();
  selectPlace(marker.dataset.placeMarker, false);
}

function handleMarkerLayerKeydown(event) {
  if (event.key !== "Enter" && event.key !== " ") return;
  const marker = event.target.closest("[data-place-marker]");
  if (!marker || !markerLayer?.contains(marker)) return;
  event.preventDefault();
  selectPlace(marker.dataset.placeMarker, false);
}

function getMarkerRenderPlaces() {
  const filtered = getFilteredPlaces();
  if (!map?.getBounds) return limitMarkerPlaces(filtered, filtered);

  const bounds = map.getBounds().pad(isCompactViewport() ? 0.3 : 0.24);
  const visible = filtered.filter((place) => bounds.contains([place.lat, place.lng]));
  return limitMarkerPlaces(visible, filtered);
}

function limitMarkerPlaces(list, fallbackList = list) {
  let visible = list;
  const maxMarkers = maxMarkerCountForZoom(map?.getZoom?.() || 12);
  if (visible.length > maxMarkers) {
    visible = visible.slice(0, maxMarkers);
  }
  const selected = state.selectedId ? fallbackList.find((place) => place.id === state.selectedId) : null;
  if (selected && !visible.some((place) => place.id === selected.id)) {
    visible.push(selected);
  }
  return visible;
}

function maxMarkerCountForZoom(zoom) {
  const compact = isCompactViewport();
  if (zoom < 11) return compact ? 12 : 18;
  if (zoom < 13) return compact ? 20 : 30;
  if (zoom < 15) return compact ? 32 : 48;
  return compact ? 42 : 64;
}

function markerViewportKey() {
  if (!map?.getBounds) return "no-map";
  const bounds = map.getBounds();
  return [
    Math.round(map.getZoom() * 10) / 10,
    bounds.getSouth().toFixed(2),
    bounds.getWest().toFixed(2),
    bounds.getNorth().toFixed(2),
    bounds.getEast().toFixed(2)
  ].join(":");
}

function renderMapLabels() {
  if (mapInteractionActive) return;
  if (!map || !mapLabelLayer) return;
  const zoom = map.getZoom();
  const bounds = map.getBounds?.()?.pad(0.12);
  const visibleLocalLabels = getVisibleLocalMapLabels(bounds, zoom);
  const visiblePlaces = getFilteredPlaces()
    .filter((place) => !bounds || bounds.contains([place.lat, place.lng]))
    .sort((a, b) => totalSignals(b) - totalSignals(a))
    .slice(0, zoom >= 14 ? 32 : 14);
  const cityLabels = Object.entries(cities)
    .filter(([, city]) => !bounds || bounds.pad(0.8).contains(city.center))
    .map(([key, city]) => ({ key, city }));
  const nextKey = [
    state.language,
    state.filter,
    state.query,
    state.activeScenario,
    Math.round(zoom * 10) / 10,
    map.getCenter().lat.toFixed(3),
    map.getCenter().lng.toFixed(3),
    visibleLocalLabels.map((label) => label.id).join(","),
    visiblePlaces.map((place) => place.id).join(",")
  ].join("|");
  if (mapLabelRenderKey === nextKey) return;
  mapLabelRenderKey = nextKey;
  mapLabelLayer.clearLayers();

  cityLabels.forEach(({ key, city }) => {
    const label = t(city.label);
    L.marker(city.center, {
      pane: "sumimapLabelPane",
      interactive: false,
      keyboard: false,
      icon: L.divIcon({
        className: `sumimap-map-label city-label city-${key}`,
        html: `<span>${escapeHtml(label)}</span>`
      })
    }).addTo(mapLabelLayer);
  });

  visibleLocalLabels.forEach((label) => {
    L.marker([label.lat, label.lng], {
      pane: "sumimapLabelPane",
      interactive: false,
      keyboard: false,
      icon: L.divIcon({
        className: `sumimap-map-label local-label ${label.type}-label`,
        html: `<span>${escapeHtml(localMapLabelText(label))}</span>`
      })
    }).addTo(mapLabelLayer);
  });

  if (zoom < 13) return;
  visiblePlaces.forEach((place) => {
    L.marker([place.lat, place.lng], {
      pane: "sumimapLabelPane",
      interactive: false,
      keyboard: false,
      icon: L.divIcon({
        className: `sumimap-map-label place-label label-${place.category}`,
        html: `<span>${categoryEmoji(place.category)} ${escapeHtml(shortPlaceName(placeText(place, "name")))}</span>`
      })
    }).addTo(mapLabelLayer);
  });
}

function getVisibleLocalMapLabels(bounds, zoom) {
  const compact = isCompactViewport();
  const paddedBounds = bounds?.pad(compact ? 0.36 : 0.32);
  const maxLabels = compact
    ? (zoom >= 15 ? 32 : zoom >= 14 ? 24 : zoom >= 13 ? 16 : zoom >= 12 ? 10 : 6)
    : (zoom >= 15 ? 48 : zoom >= 14 ? 36 : zoom >= 13 ? 24 : zoom >= 12 ? 16 : 8);
  const boxes = [];
  const accepted = [];
  const candidates = localMapLabels
    .filter((label) => localMapLabelText(label))
    .filter((label) => zoom >= localMapLabelMinZoom(label))
    .filter((label) => !paddedBounds || paddedBounds.contains([label.lat, label.lng]))
    .sort((a, b) => localMapLabelScore(b, zoom) - localMapLabelScore(a, zoom));

  for (const label of candidates) {
    if (accepted.length >= maxLabels) break;
    const box = localMapLabelBox(label, zoom, compact);
    if (box && boxes.some((current) => boxesOverlap(current, box))) continue;
    if (box) boxes.push(box);
    accepted.push(label);
  }

  return accepted;
}

function localMapLabelText(label) {
  return isJapanese() ? label.ja || "" : label.ko || "";
}

function localMapLabelMinZoom(label) {
  const minZoom = Number(label.minZoom) || 12;
  const advanceByType = {
    station: 0.25,
    road: 0.65,
    block: 0.45,
    neighborhood: 0.15
  }[label.type] || 0;
  return Math.max(9, minZoom - advanceByType);
}

function localMapLabelScore(label, zoom) {
  const typeScore = {
    admin: zoom < 11.6 ? 82 : 28,
    neighborhood: zoom >= 12 ? 66 : 44,
    station: zoom >= 13 ? 60 : 38,
    road: zoom >= 14 ? 56 : 4,
    block: zoom >= 14.5 ? 48 : 0
  }[label.type] ?? 20;
  return (label.weight ?? 0) + typeScore + Math.max(0, zoom - localMapLabelMinZoom(label)) * 2;
}

function localMapLabelBox(label, zoom, compact) {
  if (!map?.latLngToLayerPoint) return null;
  const text = localMapLabelText(label);
  if (!text) return null;
  const textLength = [...text].length;
  const point = map.latLngToLayerPoint([label.lat, label.lng]);
  const baseWidth = {
    admin: 62,
    neighborhood: 58,
    station: 58,
    road: 54,
    block: 46
  }[label.type] ?? 54;
  const width = Math.min(compact ? 128 : 164, Math.max(baseWidth, textLength * (label.type === "road" ? 6.8 : 8) + 16));
  const height = label.type === "road" || label.type === "block" ? 15 : 20;
  const gap = compact ? (label.type === "road" || label.type === "block" ? 2 : 4) : (label.type === "road" || label.type === "block" ? 3 : 5);
  return {
    left: point.x - width / 2 - gap,
    right: point.x + width / 2 + gap,
    top: point.y - height / 2 - gap,
    bottom: point.y + height / 2 + gap
  };
}

function boxesOverlap(a, b) {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}

function selectPlace(placeId, moveMap) {
  const place = placesById.get(placeId);
  if (!place) return;
  state.selectedId = place.id;
  rememberPlace(place.id);
  state.activePanel = "near";
  state.sheetMode = "expanded";
  state.reportFeedOpen = false;
  setActiveNav("near");
  if (moveMap) {
    setMapView([place.lat, place.lng], 15);
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
    setMapView([list[0].lat, list[0].lng], 14);
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
  const place = placesById.get(placeId);
  if (!place) {
    showToast("장소 정보를 다시 확인해줘.");
    return;
  }
  const createdAt = new Date().toISOString();

  const report = {
    id: createId(),
    placeId,
    place: snapshotPlaceForReport(place),
    tags: selected,
    recency: data.get("recency"),
    createdAt,
    updatedAt: createdAt,
    agrees: 0,
    disputes: 0,
    clientId: reportClientId,
    pending: true,
    remote: false
  };

  state.reports.unshift(report);
  invalidateReportCaches();
  persistReports();
  state.selectedId = report.placeId;
  state.activePanel = "near";
  state.sheetMode = "expanded";
  state.activeScenario = "";
  state.filter = "all";
  state.reportFeedOpen = true;
  clearSearchState();
  setSearchPanel(false);
  renderMapQuickRail();
  setActiveNav("near");
  showToast("제보가 바로 반영됐어. 허위면 다른 사람들이 허위 의심으로 밀어낼 수 있어.");
  renderSheet();
  renderMarkers();
  refreshStatus();
  sendReportToServer(report);
}

function voteReport(reportId, vote) {
  const report = state.reports.find((item) => item.id === reportId);
  if (!report) return;

  if (vote === "agree") {
    report.agrees += 1;
    report.updatedAt = new Date().toISOString();
    showToast("동의가 반영됐어.");
  } else if (vote === "dispute") {
    report.disputes += 1;
    report.updatedAt = new Date().toISOString();
    showToast(isHiddenReport(report) ? "허위 의심이 누적되어 신호 계산에서 빠졌어." : "허위 의심을 반영했어.");
  }

  invalidateReportCaches();
  state.reportFeedOpen = true;
  persistReports();
  renderSheet();
  renderMarkers();
  refreshStatus();
  sendReportVote(reportId, vote);
}

function deleteReport(reportId) {
  const previousLength = state.reports.length;
  const target = state.reports.find((item) => item.id === reportId);
  if (target && !canDeleteReport(target)) {
    showToast("내가 남긴 제보만 삭제할 수 있어.");
    return;
  }
  state.reports = state.reports.filter((item) => item.id !== reportId);
  if (state.reports.length === previousLength) return;

  invalidateReportCaches();
  state.reportFeedOpen = target ? getVisibleReportsForPlace(target.placeId).length > 0 : false;
  persistReports();
  showToast("제보를 삭제했어.");
  renderSheet();
  renderMarkers();
  refreshStatus();
  if (target?.remote) deleteRemoteReport(reportId);
}

function startReportSync() {
  syncReports({ silent: true });
  if (reportSyncTimer) window.clearInterval(reportSyncTimer);
  reportSyncTimer = window.setInterval(() => {
    if (document.hidden) return;
    syncReports({ silent: true });
  }, reportSyncIntervalMs);
  window.addEventListener("focus", () => syncReports({ silent: true }));
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) syncReports({ silent: true });
  });
  window.addEventListener("online", () => syncReports({ silent: true, force: true }));
}

async function syncReports({ silent = true, force = false } = {}) {
  if (!reportSyncAvailable || reportSyncInFlight) return;
  if (!force && reportLastFailureAt && Date.now() - reportLastFailureAt < reportRetryIntervalMs) return;

  reportSyncInFlight = true;
  try {
    const response = await fetch(reportApiUrl, {
      headers: { Accept: "application/json" },
      cache: "no-store"
    });
    if (response.status === 404 || response.status === 503) {
      reportSyncAvailable = false;
      return;
    }
    if (!response.ok) throw new Error(`reports ${response.status}`);
    const payload = await response.json();
    if (!payload?.ok || !Array.isArray(payload.reports)) throw new Error("invalid reports response");
    mergeServerReports(payload.reports, true);
    reportLastFailureAt = 0;
    flushPendingReports();
  } catch {
    reportLastFailureAt = Date.now();
    if (!silent) showToast("서버 동기화가 잠시 느려. 기기 안에는 먼저 반영했어.");
  } finally {
    reportSyncInFlight = false;
  }
}

function mergeServerReports(rawReports, replaceServerSnapshot = false) {
  if (!Array.isArray(rawReports)) return;
  rawReports.forEach(upsertPlaceFromServerReport);
  const serverReports = normalizeReports(rawReports.map((report) => ({
    ...report,
    id: report.id,
    placeId: report.placeId || report.place_id,
    createdAt: report.createdAt || report.created_at,
    updatedAt: report.updatedAt || report.updated_at,
    clientId: report.clientId || report.client_id,
    remote: true,
    pending: false
  })));
  const fingerprint = serverReports
    .map((report) => `${report.id}:${report.updatedAt}:${report.agrees}:${report.disputes}`)
    .join("|");
  if (replaceServerSnapshot && fingerprint === reportServerFingerprint) return;

  const serverIds = new Set(serverReports.map((report) => report.id));
  const localOnly = state.reports.filter((report) => {
    if (serverIds.has(report.id)) return false;
    return !replaceServerSnapshot || !report.remote || report.pending;
  });
  state.reports = normalizeReports([...serverReports, ...localOnly])
    .sort((a, b) => Date.parse(b.updatedAt || b.createdAt) - Date.parse(a.updatedAt || a.createdAt))
    .slice(0, 120);
  reportServerFingerprint = fingerprint;
  invalidateReportCaches();
  persistReports();
  renderMapQuickRail();
  renderSheet();
  renderMarkers();
  refreshStatus();
}

async function flushPendingReports() {
  const pending = state.reports.filter((report) => report.pending && !report.remote).slice(0, 5);
  for (const report of pending) {
    await sendReportToServer(report, { silent: true });
  }
}

async function sendReportToServer(report, { silent = false } = {}) {
  if (!reportSyncAvailable) return;
  try {
    const response = await fetch(reportApiUrl, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-Client-ID": reportClientId
      },
      body: JSON.stringify({
        id: report.id,
        placeId: report.placeId,
        place: report.place || snapshotPlaceForReport(placesById.get(report.placeId)),
        tags: report.tags,
        recency: report.recency,
        createdAt: report.createdAt
      })
    });
    if (response.status === 404 || response.status === 503) {
      reportSyncAvailable = false;
      return;
    }
    if (!response.ok) throw new Error(`save report ${response.status}`);
    const payload = await response.json();
    if (payload?.report) mergeServerReports([payload.report], false);
  } catch {
    reportLastFailureAt = Date.now();
    if (!silent) showToast("제보는 이 기기에 먼저 반영했고 서버 반영은 다시 시도할게.");
  }
}

async function sendReportVote(reportId, vote) {
  if (!reportSyncAvailable || !["agree", "dispute"].includes(vote)) return;
  try {
    const response = await fetch(`${reportApiUrl}/${encodeURIComponent(reportId)}/vote`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-Client-ID": reportClientId
      },
      body: JSON.stringify({ vote })
    });
    if (response.status === 404 || response.status === 503) {
      reportSyncAvailable = false;
      return;
    }
    if (!response.ok) throw new Error(`vote ${response.status}`);
    const payload = await response.json();
    if (payload?.report) mergeServerReports([payload.report], false);
  } catch {
    reportLastFailureAt = Date.now();
  }
}

async function deleteRemoteReport(reportId) {
  if (!reportSyncAvailable) return;
  try {
    const response = await fetch(`${reportApiUrl}/${encodeURIComponent(reportId)}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "X-Client-ID": reportClientId
      }
    });
    if (response.status === 404 || response.status === 503) reportSyncAvailable = false;
  } catch {
    reportLastFailureAt = Date.now();
  }
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

async function shareEntryLink(kind = "view") {
  const url = entryLink(kind);
  const title = t("스미맵에서 바로 확인");
  try {
    if (navigator.share) {
      await navigator.share({ title, url });
      return;
    }
    await copyText(url);
    showToast("링크를 복사했어.");
  } catch {
    await copyText(url);
    showToast("공유가 막혀서 링크를 복사했어.");
  }
}

function entryLink(kind = "view") {
  const url = new URL("/", window.location.origin);
  const place = getSelectedPlace();
  const center = map?.getCenter?.();
  const city = center ? nearestCityKey(center.lat, center.lng) : place.city;
  const params = url.searchParams;
  params.set("city", city);

  if (kind === "report") {
    params.set("panel", "report");
    params.set("place", place.id);
  } else if (kind === "route") {
    const route = getRouteCandidates(getFilteredPlaces(), place);
    params.set("place", route[0]?.id || place.id);
    params.set("filter", state.filter);
    if (state.activeScenario) params.set("case", state.activeScenario);
  } else {
    params.set("place", place.id);
    if (state.activeScenario) params.set("case", state.activeScenario);
    else if (state.filter !== "all") params.set("filter", state.filter);
  }

  params.set("utm_source", "sumimap");
  params.set("utm_medium", "share");
  params.set("utm_campaign", `entry_${kind}`);
  return url.toString();
}

function activeCaseSlug() {
  const scenarioMap = {
    battery: "battery",
    toilet: "restroom",
    rain: "rain",
    korean: "korean",
    caution: "korean"
  };
  const filterMap = {
    charge: "battery",
    restroom: "restroom",
    rest: "rain",
    korean: "korean",
    caution: "korean"
  };
  return scenarioMap[state.activeScenario] || filterMap[state.filter] || "battery";
}

function getRouteCandidates(list, selected) {
  const primary = selected || list[0] || places[0];
  if (!primary) return [];
  const source = uniquePlaces([
    primary,
    ...list,
    ...places.filter((place) => place.city === primary.city),
    ...places
  ]);
  const picks = [];
  const categoryOrder = [primary.category, "charge", "restroom", "rest", "korean", "caution"];
  const add = (place) => {
    if (place && !picks.some((item) => item.id === place.id)) picks.push(place);
  };

  add(primary);
  categoryOrder.forEach((category) => {
    add(source.find((place) => place.category === category && place.city === primary.city));
  });
  sortPlacesForContext(source).forEach(add);
  return picks.slice(0, 3);
}

function saveRouteCandidates() {
  const route = getRouteCandidates(getFilteredPlaces(), getSelectedPlace());
  const ids = route.map((place) => place.id);
  if (!ids.length) return;
  state.saved = [...ids, ...state.saved.filter((id) => !ids.includes(id))].slice(0, 40);
  writeJson("sumimap:saved", state.saved);
  showToast("오늘 동선에 저장했어.");
  renderSheet();
}

function uniquePlaces(items) {
  const seen = new Set();
  return items.filter((place) => {
    if (!place || seen.has(place.id)) return false;
    seen.add(place.id);
    return true;
  });
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

function scheduleSearchRender() {
  if (searchRenderFrame) return;
  const schedule = window.requestAnimationFrame || ((callback) => window.setTimeout(callback, 16));
  searchRenderFrame = schedule(() => {
    searchRenderFrame = 0;
    syncSelectedWithFiltered();
    renderSheet();
    renderMarkers();
    refreshStatus();
  });
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
  statusPill.textContent = scenario ? `${scenario.emoji} ${t(scenario.label)} · ${countLabel(visible.length, "곳")}` : `📍 ${countLabel(visible.length, "곳")} ${t("표시")}`;
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

function focusCandidateList() {
  const list = sheet.querySelector(".place-list");
  if (!list) {
    showToast("후보 목록을 다시 불러올게.");
    renderSheet();
    return;
  }
  list.scrollIntoView({ block: "start", behavior: "smooth" });
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
  const rawAddress = String(item?.display_name || "").replace(/\s+/g, " ").trim();
  const rawTitle =
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
  const title = localizeMapCandidateText(rawTitle);
  const address = compactAddressForLanguage(item, rawAddress, lat, lng);

  return {
    id: safeId(`addr-${item?.osm_type || "point"}-${item?.osm_id || `${lat.toFixed(5)}-${lng.toFixed(5)}`}`, createId()),
    title,
    address,
    language: state.language,
    lat,
    lng
  };
}

function localizeMapCandidateText(value) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  if (!text) return t("검색한 위치");
  if (isJapanese()) return hiraganaJapaneseText(text);
  return readableKoreanMapText(text) || t("검색한 위치");
}

function compactAddressForLanguage(item, rawAddress, lat, lng) {
  if (isJapanese()) return rawAddress || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  const address = item?.address || {};
  const parts = [
    address.amenity || address.shop || address.tourism || address.building || address.station,
    address.road,
    address.neighbourhood || address.quarter || address.suburb,
    address.city || address.town || address.village || address.county,
    address.state,
    address.country
  ]
    .map(readableKoreanMapText)
    .filter(Boolean);
  const compact = [...new Set(parts)].join(", ");
  return compact || readableKoreanMapText(rawAddress) || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
}

function koreanizeMapText(value) {
  let result = String(value || "").replace(/\s+/g, " ").trim();
  koreanMapTextReplacements.forEach(([pattern, replacement]) => {
    result = result.replace(pattern, replacement);
  });
  return result
    .replace(/\b\d{3}-\d{4}\b/g, "")
    .replace(/\s*,\s*/g, ", ")
    .replace(/,\s*,+/g, ",")
    .replace(/^,\s*|\s*,$/g, "")
    .trim();
}

function readableKoreanMapText(value) {
  const text = koreanizeMapText(value);
  if (!text) return "";
  return hasUntranslatedMapText(text) ? "" : text;
}

function hasUntranslatedMapText(value) {
  return /[A-Za-z]/.test(value) || /[\u3040-\u30ff\u3400-\u9fff]/.test(value);
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
  setMapView([place.lat, place.lng], zoom);
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
    assignLocalizedAddress(existing, candidate);
    existing.lat = candidate.lat;
    existing.lng = candidate.lng;
    persistCustomPlaces();
    return existing;
  }

  const localized = localizedAddressFields(candidate);
  const place = {
    id: candidate.id,
    name: candidate.title,
    area: candidate.address,
    ...localized,
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

function assignLocalizedAddress(place, candidate) {
  Object.assign(place, localizedAddressFields(candidate));
}

function localizedAddressFields(candidate) {
  const suffix = candidate.language === "ja" ? "Ja" : "Ko";
  const title = suffix === "Ko" ? readableKoreanMapText(candidate.title) || "검색한 위치" : candidate.title;
  const address = suffix === "Ko" ? readableKoreanMapText(candidate.address) || "주소 확인 중" : candidate.address;
  return {
    [`name${suffix}`]: title,
    [`area${suffix}`]: address
  };
}

async function localizeCustomPlacesForLanguage(language) {
  const suffix = language === "ja" ? "Ja" : "Ko";
  const targets = getFilteredPlaces()
    .filter((place) => place.custom && (!place[`name${suffix}`] || !place[`area${suffix}`]))
    .slice(0, 4);
  if (!targets.length) return;

  await Promise.allSettled(targets.map(async (place) => {
    const candidate = await reverseGeocodePoint(place.lat, place.lng);
    assignLocalizedAddress(place, { ...candidate, language });
  }));
  persistCustomPlaces();
  filteredPlacesCacheKey = "";
  renderSheet();
  renderMarkers();
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
  const nextHtml = scenarios.map((scenario) => `
    <button type="button" class="quick-chip ${state.activeScenario === scenario.key ? "is-active" : ""}" data-quick-scenario="${scenario.key}" aria-label="${escapeAttr(t(scenario.label))}">
      <span aria-hidden="true">${scenario.emoji}</span>
      <strong>${t(scenario.label)}</strong>
    </button>
  `).join("");
  if (quickRailHtmlCache !== nextHtml) {
    mapQuickRail.innerHTML = nextHtml;
    quickRailHtmlCache = nextHtml;
  }
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
      setMapView(position, 15);
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
  if (label.includes("한국어")) return "💬";
  if (label.includes("허락")) return "🙋";
  if (label.includes("응대") || label.includes("비추천")) return "⚠️";
  if (label.includes("쉬") || label.includes("대기") || label.includes("혼자")) return "🪑";
  return "📍";
}

function siblingCopy(key) {
  const ko = {
    kicker: "스미맵 패밀리",
    title: "트립마킹",
    desc: "해외에서 소매치기, 날치기, 관광지 스캠처럼 치안 주의가 필요한 길목을 사용자 제보와 도시별 주의 신호로 빠르게 보여주는 형제 지도입니다.",
    badge: "치안 주의 지도",
    note: "스미맵이 일본 생활 편의를 맡고, 트립마킹은 해외 이동 중 피해야 할 길목과 대처 루틴을 맡습니다.",
    cta: "트립마킹 열기",
    close: "닫기"
  };
  const ja = {
    kicker: "すみまっぷ ふぁみりー",
    title: "とりっぷまーきんぐ",
    desc: "かいがいで すり、ひったくり、かんこうち の すきゃむ など、ちあん の ちゅうい が ひつよう な みち を じょうほう から はやく みられる きょうだい ちずです。",
    badge: "ちあん ちゅうい ちず",
    note: "すみまっぷ は にほん せいかつ の べんり を、とりっぷまーきんぐ は かいがい いどう の ちゅうい と たいおう を たすけます。",
    cta: "とりっぷまーきんぐ を ひらく",
    close: "とじる"
  };
  return (isJapanese() ? ja : ko)[key] || ko[key] || "";
}

function openSiblingDialog() {
  document.querySelector(".feedback-overlay")?.remove();
  document.body.insertAdjacentHTML("beforeend", renderSiblingDialog());
  const overlay = document.querySelector(".sibling-overlay");
  overlay?.addEventListener("click", handleSiblingDialogClick);
  window.requestAnimationFrame(() => {
    document.querySelector(".sibling-link")?.focus();
  });
}

function closeSiblingDialog() {
  document.querySelector(".sibling-overlay")?.remove();
}

function handleSiblingDialogClick(event) {
  if (event.target === event.currentTarget || event.target.closest("[data-sibling-close]")) {
    closeSiblingDialog();
  }
}

function renderSiblingDialog() {
  return `
    <div class="feedback-overlay sibling-overlay">
      <section class="feedback-card sibling-card" role="dialog" aria-modal="true" aria-labelledby="siblingTitle">
        <div class="feedback-head">
          <div>
            <span class="feedback-kicker">${escapeHtml(siblingCopy("kicker"))}</span>
            <h2 id="siblingTitle">${escapeHtml(siblingCopy("title"))}</h2>
            <p>${escapeHtml(siblingCopy("desc"))}</p>
          </div>
          <button class="feedback-close" type="button" data-sibling-close aria-label="${escapeHtml(siblingCopy("close"))}">×</button>
        </div>
        <div class="sibling-body">
          <span class="sibling-badge">路 ${escapeHtml(siblingCopy("badge"))}</span>
          <p class="sibling-note">${escapeHtml(siblingCopy("note"))}</p>
          <a class="sibling-link" href="https://tripmarking.com/" rel="noopener">
            <span>${escapeHtml(siblingCopy("cta"))}</span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>
    </div>
  `;
}

function openFeedbackDialog() {
  document.querySelector(".feedback-overlay")?.remove();
  document.body.insertAdjacentHTML("beforeend", renderFeedbackDialog());
  window.requestAnimationFrame(() => {
    document.querySelector("#feedbackMessage")?.focus();
  });
}

function closeFeedbackDialog() {
  document.querySelector(".feedback-overlay")?.remove();
}

function handleFeedbackClick(event) {
  const close = event.target.closest("[data-feedback-close]");
  if (close && (close.matches("button") || event.target === close)) {
    closeFeedbackDialog();
    return;
  }

  const kind = event.target.closest("[data-feedback-kind]");
  if (!kind) return;
  const form = kind.closest("#feedbackForm");
  if (!form) return;
  form.elements.kind.value = kind.dataset.feedbackKind;
  form.querySelectorAll("[data-feedback-kind]").forEach((button) => {
    const active = button === kind;
    button.classList.toggle("is-selected", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function handleFeedbackSubmit(event) {
  const form = event.target.closest("#feedbackForm");
  if (!form) return;
  event.preventDefault();
  submitFeedback(form);
}

function renderFeedbackDialog() {
  const kinds = [
    ["idea", "💬", feedbackCopy("kindIdea")],
    ["bug", "🛠️", feedbackCopy("kindBug")],
    ["question", "❓", feedbackCopy("kindQuestion")]
  ];
  return `
    <div class="feedback-overlay" data-feedback-close>
      <section class="feedback-card" role="dialog" aria-modal="true" aria-labelledby="feedbackTitle">
        <div class="feedback-head">
          <div>
            <span class="feedback-kicker">${feedbackCopy("kicker")}</span>
            <h2 id="feedbackTitle">${feedbackCopy("title")}</h2>
            <p>${feedbackCopy("desc")}</p>
          </div>
          <button class="feedback-close" type="button" data-feedback-close aria-label="${escapeHtml(feedbackCopy("close"))}">×</button>
        </div>
        <form id="feedbackForm" class="feedback-form">
          <input type="hidden" name="kind" value="idea">
          <div class="feedback-kind-row" aria-label="${escapeHtml(feedbackCopy("kindLabel"))}">
            ${kinds.map(([key, emoji, label], index) => `
              <button class="${index === 0 ? "is-selected" : ""}" type="button" data-feedback-kind="${key}" aria-pressed="${index === 0 ? "true" : "false"}">
                <span aria-hidden="true">${emoji}</span>${label}
              </button>
            `).join("")}
          </div>
          <label class="feedback-field">
            <span>${feedbackCopy("messageLabel")}</span>
            <textarea id="feedbackMessage" name="message" rows="5" maxlength="1200" placeholder="${escapeHtml(feedbackCopy("messagePlaceholder"))}" required></textarea>
          </label>
          <label class="feedback-field">
            <span>${feedbackCopy("contactLabel")}</span>
            <input name="contact" type="text" maxlength="180" placeholder="${escapeHtml(feedbackCopy("contactPlaceholder"))}">
          </label>
          <div class="feedback-actions">
            <button class="text-button" type="button" data-feedback-close>${feedbackCopy("cancel")}</button>
            <button class="primary-button" type="submit">${icon("send")}${feedbackCopy("send")}</button>
          </div>
          <p class="feedback-note">${feedbackCopy("note")}</p>
        </form>
      </section>
    </div>
  `;
}

async function submitFeedback(form) {
  const data = new FormData(form);
  const message = String(data.get("message") || "").trim();
  const contact = String(data.get("contact") || "").trim();
  const kind = String(data.get("kind") || "idea");
  if (message.length < 2) {
    showFeedbackToast(feedbackCopy("tooShort"));
    return;
  }

  const submit = form.querySelector("[type='submit']");
  submit.disabled = true;
  const payload = {
    id: createId(),
    app: "sumimap",
    kind,
    message: message.slice(0, 1200),
    contact: contact.slice(0, 180),
    language: state.language,
    path: location.pathname,
    userAgent: navigator.userAgent.slice(0, 180),
    clientId: reportClientId,
    createdAt: new Date().toISOString()
  };

  try {
    const response = await fetch(feedbackApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Client-ID": reportClientId
      },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error(`Feedback failed: ${response.status}`);
    closeFeedbackDialog();
    showFeedbackToast(feedbackCopy("sent"));
  } catch {
    saveLocalFeedback(payload);
    closeFeedbackDialog();
    showFeedbackToast(feedbackCopy("localSaved"));
  } finally {
    submit.disabled = false;
  }
}

function saveLocalFeedback(payload) {
  const key = "sumimap:feedbackOutbox";
  const current = Array.isArray(readJson(key, [])) ? readJson(key, []) : [];
  writeJson(key, [payload, ...current].slice(0, 20));
}

function feedbackCopy(key) {
  const ko = {
    buttonLabel: "그냥 건의 사항",
    kicker: "편하게 주세요",
    title: "그냥 건의 사항",
    desc: "어떤 질문, 개선점, 버그든 짧게 남겨주세요. 서비스가 실제로 쓰이게 만드는 가장 중요한 단서로 볼게요.",
    close: "닫기",
    kindLabel: "피드백 종류",
    kindIdea: "건의",
    kindBug: "버그",
    kindQuestion: "질문",
    messageLabel: "내용",
    messagePlaceholder: "예: 제보 버튼이 헷갈려요, 지도에서 이 정보가 더 잘 보이면 좋겠어요.",
    contactLabel: "답장 받을 연락처 선택",
    contactPlaceholder: "이메일 또는 닉네임, 비워도 괜찮아요",
    cancel: "괜찮아요",
    send: "보내기",
    note: "욕설, 개인정보, 민감한 위치 정보는 남기지 않는 쪽이 안전해요.",
    tooShort: "조금만 더 적어주세요.",
    sent: "고마워요. 피드백을 받았어요.",
    localSaved: "서버 연결이 아직 없어 기기에 임시 저장했어요."
  };
  const ja = {
    buttonLabel: "きがるないけん",
    kicker: "きがるにどうぞ",
    title: "きがるないけん",
    desc: "しつもん、かいぜんてん、ばぐをみじかくのこしてください。じっさいにつかいやすくするためのたいせつなてがかりにします。",
    close: "とじる",
    kindLabel: "いけんのしゅるい",
    kindIdea: "いけん",
    kindBug: "ばぐ",
    kindQuestion: "しつもん",
    messageLabel: "ないよう",
    messagePlaceholder: "れい: つうほうぼたんがわかりにくい、ちずのじょうほうをもっとみやすくしてほしい。",
    contactLabel: "へんじのれんらくさき",
    contactPlaceholder: "めーる、なまえ。からでもだいじょうぶです",
    cancel: "やめる",
    send: "おくる",
    note: "こじんじょうほう、くわしいいち、びんかんなないようはかかないほうがあんぜんです。",
    tooShort: "もうすこしだけかいてください。",
    sent: "ありがとう。いけんをうけとりました。",
    localSaved: "さーばーにつながらないため、いったんききにほぞんしました。"
  };
  const source = state.language === "ja" ? ja : ko;
  return source[key] || ko[key] || key;
}

function showFeedbackToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2300);
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
    "share-2": `<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.7 6.8-4.4M8.6 13.3l6.8 4.4"/>`,
    copy: `<rect x="9" y="9" width="13" height="13" rx="2"/><rect x="2" y="2" width="13" height="13" rx="2"/>`,
    list: `<path d="M8 6h13M8 12h13M8 18h13"/><path d="M3 6h.01M3 12h.01M3 18h.01"/>`,
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

function canDeleteReport(report) {
  return !report.clientId || report.clientId === reportClientId;
}

function persistReports() {
  writeJson("sumimap:reports", state.reports.slice(0, 120));
}

function snapshotPlaceForReport(place) {
  if (!place) return null;
  return {
    id: place.id,
    name: place.name,
    area: place.area,
    nameKo: place.nameKo || "",
    areaKo: place.areaKo || "",
    nameJa: place.nameJa || "",
    areaJa: place.areaJa || "",
    city: place.city,
    category: place.category,
    lat: place.lat,
    lng: place.lng
  };
}

function upsertPlaceFromServerReport(report) {
  const snapshot = normalizeReportPlaceSnapshot(report);
  if (!snapshot) return;
  const existing = placesById.get(snapshot.id);
  if (existing) {
    if (existing.custom) {
      existing.name = snapshot.name || existing.name;
      existing.area = snapshot.area || existing.area;
      existing.nameKo = snapshot.nameKo || existing.nameKo || "";
      existing.areaKo = snapshot.areaKo || existing.areaKo || "";
      existing.nameJa = snapshot.nameJa || existing.nameJa || "";
      existing.areaJa = snapshot.areaJa || existing.areaJa || "";
    }
    return;
  }

  const place = placeFromReportSnapshot(snapshot);
  places.unshift(place);
  placesById.set(place.id, place);
  validPlaceIds.add(place.id);
}

function placeFromReportSnapshot(snapshot) {
  return {
    id: snapshot.id,
    name: snapshot.name || "제보 위치",
    area: snapshot.area || `${snapshot.lat.toFixed(5)}, ${snapshot.lng.toFixed(5)}`,
    nameKo: snapshot.nameKo || snapshot.name || "",
    areaKo: snapshot.areaKo || snapshot.area || "",
    nameJa: snapshot.nameJa || "",
    areaJa: snapshot.areaJa || "",
    city: cities[snapshot.city] ? snapshot.city : nearestCityKey(snapshot.lat, snapshot.lng),
    kind: "사용자 제보",
    lat: snapshot.lat,
    lng: snapshot.lng,
    category: categoriesByKey.has(snapshot.category) && snapshot.category !== "all" ? snapshot.category : "custom",
    trust: "실시간 제보",
    tags: ["주소 검색", "제보 대기"],
    signals: { charge: 0, restroom: 0, rest: 0, korean: 0, caution: 0 },
    walk: "지도 제보",
    lastSeen: "실시간 제보",
    crowd: "현장 확인",
    bestFor: "사용자가 남긴 생활 스팟",
    watchout: "새로 공유된 제보 위치예요. 운영 시간과 현장 안내는 직접 확인해 주세요.",
    notes: ["다른 사용자가 남긴 공유 제보예요.", "신호와 허위 의심이 함께 쌓이면서 지도 표시가 조정됩니다."],
    custom: true
  };
}

function normalizeReportPlaceSnapshot(report) {
  const source = report?.place && typeof report.place === "object" ? report.place : report;
  const id = safeId(source?.id || report?.placeId || report?.place_id, "");
  const lat = Number(source?.lat);
  const lng = Number(source?.lng);
  if (!id || !Number.isFinite(lat) || !Number.isFinite(lng) || !isPointInJapan(lat, lng)) return null;
  return {
    id,
    name: String(source?.name || source?.placeName || source?.place_name || "제보 위치").slice(0, 80),
    area: String(source?.area || source?.placeArea || source?.place_area || `${lat.toFixed(5)}, ${lng.toFixed(5)}`).slice(0, 160),
    nameKo: String(source?.nameKo || source?.name_ko || "").slice(0, 80),
    areaKo: String(source?.areaKo || source?.area_ko || "").slice(0, 160),
    nameJa: String(source?.nameJa || source?.name_ja || "").slice(0, 80),
    areaJa: String(source?.areaJa || source?.area_ja || "").slice(0, 160),
    city: String(source?.city || "").slice(0, 24),
    category: String(source?.category || "").slice(0, 24),
    lat,
    lng
  };
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
        nameKo: typeof place?.nameKo === "string" ? place.nameKo.slice(0, 80) : "",
        areaKo: typeof place?.areaKo === "string" ? place.areaKo.slice(0, 160) : "",
        nameJa: typeof place?.nameJa === "string" ? place.nameJa.slice(0, 80) : "",
        areaJa: typeof place?.areaJa === "string" ? place.areaJa.slice(0, 160) : "",
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
    .map((report, index) => {
      const placeId = safeId(report?.placeId || report?.place_id, "");
      const tags = Array.isArray(report?.tags)
        ? report.tags
        : typeof report?.tags === "string"
          ? parseJsonArray(report.tags)
          : [];
      return {
        id: safeId(report?.id, `legacy-${index}-${report?.createdAt || report?.created_at || Date.now()}`),
        placeId: validPlaceIds.has(placeId) ? placeId : "",
        place: normalizeReportPlaceSnapshot(report),
        tags: tags.filter((tag) => allowedReportLabels.has(tag)),
        recency: ["today", "week", "month", "old"].includes(report?.recency) ? report.recency : "old",
        createdAt: report?.createdAt || report?.created_at || new Date().toISOString(),
        updatedAt: report?.updatedAt || report?.updated_at || report?.createdAt || report?.created_at || new Date().toISOString(),
        agrees: clampCount(report?.agrees),
        disputes: clampCount(report?.disputes),
        clientId: safeId(report?.clientId || report?.client_id || reportClientId, reportClientId),
        pending: Boolean(report?.pending),
        remote: Boolean(report?.remote)
      };
    })
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

function parseJsonArray(value) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
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
  const requested = readRequestedLanguage();
  return requested || "ko";
}

function readRequestedLanguage() {
  try {
    const params = new URLSearchParams(window.location.search);
    const requested = params.get("lang") || params.get("language");
    return supportedLanguages.has(requested) ? requested : "";
  } catch {
    return "";
  }
}

function readStableClientId(key) {
  const existing = safeId(readJson(key, ""), "");
  if (existing) return existing;
  const next = createId();
  try {
    localStorage.setItem(key, JSON.stringify(next));
  } catch {
    // A stable ID improves report ownership, but reporting still works without storage.
  }
  return next;
}

function isJapanese() {
  return currentLanguage === "ja";
}

function t(value) {
  const text = String(value ?? "");
  if (!isJapanese()) return text;
  return hiraganaJapaneseText(jaText[text] || translatePattern(text));
}

function placeText(place, field) {
  if (place?.custom && (field === "name" || field === "area")) {
    const suffix = isJapanese() ? "Ja" : "Ko";
    const localized = place[`${field}${suffix}`];
    if (typeof localized === "string" && localized.trim()) {
      return isJapanese() ? hiraganaJapaneseText(localized) : readableKoreanMapText(localized) || (field === "area" ? "주소 확인 중" : "검색한 위치");
    }
  }
  const text = String(place?.[field] || "");
  if (!isJapanese()) {
    if (place?.custom && (field === "name" || field === "area")) {
      return readableKoreanMapText(text) || (field === "area" ? "주소 확인 중" : "검색한 위치");
    }
    return text;
  }
  const translated = placeJapanese[place?.id]?.[field];
  return typeof translated === "string" ? hiraganaJapaneseText(translated) : t(text);
}

function placeNotes(place) {
  if (!isJapanese()) return Array.isArray(place.notes) ? place.notes : [];
  const translated = placeJapanese[place?.id]?.notes;
  if (Array.isArray(translated)) return translated.map(hiraganaJapaneseText);
  return Array.isArray(place.notes) ? place.notes.map(t) : [];
}

function tagText(tag) {
  return t(tag);
}

function countLabel(count, unit) {
  const number = Number(count) || 0;
  if (!isJapanese()) return `${number}${unit}`;
  if (unit === "곳") return `${number}かしょ`;
  if (unit === "건 즉시 반영") return `${number}けんすぐはんえい`;
  return hiraganaJapaneseText(`${number}${t(unit)}`);
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

function hiraganaJapaneseText(value) {
  let result = String(value ?? "");
  hiraganaTextReplacements.forEach(([from, to]) => {
    result = result.split(from).join(to);
  });
  result = result.replace(/[\u30A1-\u30F6]/g, (char) =>
    String.fromCharCode(char.charCodeAt(0) - 0x60)
  );
  return result.replace(/[一-龯]/g, (char) => kanjiFallbackReadings[char] || "");
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
