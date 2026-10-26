// Province-level notes that come from an official page (re-read 2026-10-26).
// Only facts printed on the cited page go here; nothing is filled in for
// provinces whose 시·군 pages were not checked.
import { SRC } from "./sources.mjs";

// 한국환경공단 영농폐기물 수거·처리사업 page, "영농 폐비닐 처리시설 현황" table.
export const KECO_FACILITIES = Object.freeze({
  "경기도": ["시화(시흥시)", "안성(안성시 서운면)"],
  "경상북도": ["안동(안동시 임하면)", "성주(성주군 가천면)"],
  "경상남도": ["의령(의령군 의령읍)"],
  "전라남도": ["담양(담양군 금성면)"],
  "전북특별자치도": ["정읍(정읍시)"]
});

// 세종특별자치시 자원순환 누리집 "영농폐기물 공동집하장 설치현황(35개소)" table,
// exactly as printed (the page lists 10 lots under 장군면 although it says 11개소).
export const SEJONG_TABLE = Object.freeze({
  declared: 35,
  areas: [
    ["연기면", 2, ["보통리 132-1", "수산리 466-2"]],
    ["연동면", 4, ["명학리 653-8", "예양리 655-1", "응암리 795", "응암리 835"]],
    ["부강면", 2, ["부강리 663-1", "부강리 352-1"]],
    ["금남면", 4, ["부용리 576-2", "남곡리 17", "영대리 244", "호탄리 573-2"]],
    ["장군면", 11, ["대교리 480-4", "용암리 435", "하봉리 90-8", "용현리 238-2", "송학리 68-1", "송학리 468-5", "태산리 346-1", "평기리 336-1", "산학리 171-6", "은용리 470-1"]],
    ["연서면", 2, ["쌍류리 381-3", "신대리 71-6"]],
    ["전의면", 5, ["양곡리 315", "유천리 869", "금사리 137-3", "서정리 428-2", "관정리 531-1"]],
    ["전동면", 3, ["송성리 745-25", "청람리 58-1", "봉대리 107-1"]],
    ["소정면", 2, ["소정리 551-4", "대곡리 562"]]
  ]
});

const lotKey = (area, text) => `${area} ${text.replace(/번지$/u, "").replace(/\s+/gu, " ").trim()}`;

// Compares the public-data rows with the city's own table by 읍·면 + 리 + 지번.
// Rows written as a road address cannot match a 지번 and are counted as "only in data".
export function compareSejong(rows) {
  const cityLots = SEJONG_TABLE.areas.flatMap(([area, , lots]) => lots.map((lot) => lotKey(area, lot)));
  const listed = cityLots.length;
  const dataKeys = rows.map((row) => {
    const match = row.address.match(/([가-힣]+(?:읍|면))\s([가-힣]+리)\s(\d+(?:-\d+)?)(?:번지)?$/u);
    return { row, key: match ? lotKey(match[1], `${match[2]} ${match[3]}`) : "" };
  });
  const citySet = new Set(cityLots);
  const dataSet = new Set(dataKeys.map((item) => item.key).filter(Boolean));
  return {
    listed,
    both: cityLots.filter((key) => dataSet.has(key)).length,
    onlyData: dataKeys.filter((item) => !citySet.has(item.key)).map((item) => item.row.address.replace(/^세종특별자치시\s/u, "")),
    onlyCity: cityLots.filter((key) => !dataSet.has(key))
  };
}

// 화성특례시 청소행정 포털 "지역별 영농폐기물 집하장 수" (16 places, 231 in total), as printed.
export const HWASEONG_TABLE = Object.freeze({
  eupmyeon: [["봉담읍", 18], ["팔탄면", 27], ["우정읍", 2], ["장안면", 41], ["향남읍", 9], ["양감면", 25], ["남양읍", 10], ["정남면", 10], ["비봉면", 23], ["마도면", 15], ["송산면", 2], ["서신면", 19]],
  dong: [["진안동", 8], ["기배동", 15], ["화산동", 3], ["동탄6동", 4]]
});

// Compares the portal's 읍·면 counts with the public-data rows of 화성시 counted
// by the 읍·면 written in each address. 동 areas are compared only as a total,
// because most of those rows are road addresses that do not name the 동.
export function compareHwaseong(city) {
  const dataCount = new Map(city.areas);
  const rows = HWASEONG_TABLE.eupmyeon.map(([name, portal]) => [name, portal, dataCount.get(name) || 0]);
  const listedData = rows.reduce((sum, [, , data]) => sum + data, 0);
  return {
    rows,
    same: rows.filter(([, portal, data]) => portal === data).map(([name]) => name),
    portalTotal: [...HWASEONG_TABLE.eupmyeon, ...HWASEONG_TABLE.dong].reduce((sum, [, count]) => sum + count, 0),
    portalDong: HWASEONG_TABLE.dong.reduce((sum, [, count]) => sum + count, 0),
    dataTotal: city.count,
    dataOther: city.count - listedData
  };
}

// Short notice shown under the province page title when the province name in
// the 2025 file no longer matches today's administrative name.
export const HEAD_NOTES = Object.freeze({
  "전라남도": "전라남도는 2026년 7월 1일 광주광역시와 합쳐 전남광주통합특별시가 되었습니다. 이 페이지의 주소는 통합 전에 만든 2025년 자료라 ‘전라남도’로 적혀 있습니다.",
  "인천광역시": "인천 중구·동구는 2026년 7월 1일 폐지되고 제물포구·영종구·검단구가 생겼습니다. 2025년 자료의 ‘중구’ 주소 2건은 아래 설명을 보세요."
});

// Facts per province. `html` is trusted markup written here, `source` is the page it came from.
// kind "context" = background (law, administrative change), not a 시·군 disposal rule.
export const LOCAL_NOTES = Object.freeze({
  "강원특별자치도": [{
    source: SRC.hoengseong,
    title: "횡성군 안내(누리집 최종수정 2023년 1월 31일)",
    html: `<ul>
        <li>횡성군 누리집은 수거 장소를 ‘마을별 폐비닐 간이수집소’라고 부릅니다. 공개자료에는 횡성군 213건이 모두 ‘공동집하장’으로 적혀 있으니, 마을에서는 두 이름이 같은 곳을 가리킬 수 있습니다.</li>
        <li>폐비닐은 흰색과 검정색을 나눠 내놓아야 하며, 나누지 않으면 수거하지 않는다고 적혀 있습니다. 흙·자갈·잡초를 털고 묶어 둡니다.</li>
        <li>농약 용기는 다 쓴 뒤 병·플라스틱·봉지로 나눠 마대나 투명 그물망에 담아 읍·면 지정 장소에 내놓습니다.</li>
        <li>수거기관은 한국환경공단 홍천사업소이고, 수거 전표에 따라 수집장려금을 줍니다. 폐비닐 A등급 150원·B등급 120원·C등급 110원, 농약 용기는 봉지 4,650원·플라스틱 1,420원·병 290원으로 적혀 있습니다(단위 표기 없음).</li>
        <li>이 농약 용기 금액은 한국환경공단 누리집의 1kg당 금액(봉지류 3,680원·플라스틱 1,600원·유리병 300원)과 다릅니다. 횡성군 페이지가 2023년에 마지막으로 고쳐졌으므로, 올해 금액은 군에 확인하세요.</li>
        <li>담당: 횡성군 환경자원사업소 자원순환팀, 누리집 표기 033-340-5932.</li>
      </ul>`
  }],
  "경기도": [{
    source: SRC.hwaseong,
    title: "화성시 안내(화성특례시 청소행정 포털)",
    hwaseong: true,
    html: `<ul>
        <li>재활용이 안 되는 모판, 트레이, 점적호스, 반사필름, 부직포, 종묘포트를 지정 장소나 농협에 모으면 전문업체가 수거하는 지원사업을 한다고 적혀 있습니다. 한국환경공단이 수거하는 폐비닐·농약 용기와 일반 생활폐기물은 이 사업 대상이 아닙니다.</li>
        <li>쓰지 않은 농약은 반기마다 한 번 있는 집중수거기간에 읍·면·동 행정복지센터의 지정 장소로 냅니다.</li>
        <li>포털의 ‘한국환경공단의 수거·보상 안내’ 표에는 폐비닐 1kg당 70~150원, 농약 용기 1개 100원, 농약 봉지 1개 80원으로 적혀 있습니다. 한국환경공단 누리집은 농약 용기를 1kg당 금액으로 안내하므로 단위가 다릅니다. 실제 지급 기준은 화성시에 확인하세요.</li>
        <li>포털에 적힌 시청 주소는 ‘화성시 만세구 남양읍’처럼 구 이름이 들어갑니다. 2025년 공개자료의 화성시 주소에는 구 이름이 없으니, 지도에서 안 나오면 구 이름을 넣거나 빼고 다시 검색해 보세요.</li>
      </ul>`
  }],
  "경상북도": [{
    source: SRC.andong,
    title: "안동시 안내",
    html: `<ul>
        <li>폐비닐은 이물질을 없애고 흰색·검정색 등 색깔별로, 농약 용기는 다 쓴 뒤 유리병·플라스틱·봉지로 나눠 냅니다. ‘농약’ 표시가 있는 용기만 해당하고 영양제병은 일반 폐기물로 냅니다.</li>
        <li>쓰지 않은 농약은 읍·면 행정복지센터에 있는 폐농약 수거함에 넣습니다.</li>
        <li>반사필름은 무상수거기간(11~1월)에 마대에 담아, 점적호스는 무상수거기간(3~4월, 9~10월)에 묶거나 말아서 냅니다. 기간 밖에는 대형폐기물 스티커를 붙여야 합니다(마대 30리터당 1,000원, 150cm 끈 한 묶음 2,000원).</li>
        <li>폐비닐은 마을별로 한국환경공단 안동폐비닐처리공장(누리집 표기 823-0083~4)에 수거를 요청하고, 농약 용기는 일정을 맞춘 뒤 직접 가져가도록 안내합니다. 공단 누리집은 아래 ‘모은 폐비닐이 가는 곳’의 안동 폐비닐 재활용시설 전화번호를 054-823-0084로 적고 있습니다.</li>
        <li>수집보상금은 리(통)장·부녀회·노인회·청년회 등 읍·면·동장이 인정한 단체에 주며, 폐비닐 1kg당 90~130원(공단 등급 판정), 농약 용기는 공단 보상 단가의 50%(공단 예산이 다 쓰이면 150%)로 적혀 있습니다. 신청은 읍·면·동 행정복지센터에서 합니다.</li>
        <li>담당: 안동시 자원순환과, 누리집 표기 054-840-5288.</li>
      </ul>`
  }],
  "전라남도": [{
    kind: "context",
    source: SRC.jeonnamLaw,
    title: "전남은 2026년 7월부터 전남광주통합특별시",
    html: `<p>「전남광주통합특별시 설치를 위한 특별법」에 따라 2026년 7월 1일 전라남도와 광주광역시가 폐지되고 전남광주통합특별시(약칭 광주특별시)가 생겼습니다. 이 페이지의 주소는 2025년 8월 기준 자료라 ‘전라남도 해남군 …’처럼 적혀 있지만, 지금 공문서와 누리집 주소는 ‘전남광주통합특별시 해남군 …’ 꼴입니다. 지도에서 찾을 때는 시·도 이름을 빼고 ‘해남군 ○○면 ○○리 지번’처럼 검색해도 됩니다.</p>`
  }, {
    source: SRC.boseong,
    title: "보성군 안내(누리집 최종업데이트 2026년 9월 18일)",
    html: `<ul>
        <li>수거장려금은 두 곳에서 나옵니다. 영농 폐비닐·멀칭 비닐은 군이 1kg당 A등급 140원·B등급 120원·C등급 100원을, 농약 용기는 한국환경공단이 1kg당 병 300원·플라스틱병 1,600원·봉지 3,680원을 준다고 적혀 있습니다.</li>
        <li>흙, 돌, 작물 찌꺼기 같은 이물질이 많이 섞인 폐비닐과 농약 용기는 수거하지 않습니다.</li>
        <li>집하장에 모을 때 바람에 날리지 않도록 마대나 끈으로 묶고, 농약 용기는 마대나 비닐봉투에 담습니다.</li>
        <li>문의: 보성군 기후환경과 자원순환팀 061-850-5343, 한국환경공단 062-949-0765(누리집 표기).</li>
      </ul>`
  }],
  "전북특별자치도": [{
    source: SRC.namwon,
    title: "남원시 덕과면 공지(2025년 6월 12일)",
    html: `<ul>
        <li>폐비닐은 흙과 이물질을 없애고 하우스·로덴·하이덴으로 나눠 집하장에 내놓거나, 한국환경공단 남원수거사업소에 직접 가져갈 수 있다고 적혀 있습니다. 농약 용기도 병·봉지로 나눠 마대에 담아 내놓거나 직접 가져갈 수 있습니다.</li>
        <li>폐부직포, 폐차광막, 반사필름, 점적호스, 곤포사일리지 비닐은 따로 수거하지 않고, 집중수거기간에만 임시 적환장에 내놓거나 대산매립장에 직접 가져갑니다(반입확인증 필요, 반입 수수료 없음).</li>
        <li>생활폐기물과 섞어 내놓으면 수거하지 않고 불법투기로 과태료를 물릴 수 있다고 적혀 있습니다.</li>
        <li>면 단위 공지이므로 다른 면이나 다른 시·군의 일정은 해당 읍·면사무소에 확인하세요. 덕과면 연락처: 063-620-3987(공지 표기).</li>
      </ul>`
  }],
  "인천광역시": [{
    kind: "context",
    source: SRC.incheonLaw,
    title: "‘중구’ 주소 2건과 2026년 구 개편",
    html: `<p>「인천광역시 제물포구ㆍ영종구 및 검단구 설치 등에 관한 법률」에 따라 2026년 7월 1일 인천 중구와 동구가 폐지되고 제물포구·영종구·검단구가 생겼습니다. 공개자료의 중구 주소 2건(운남동 1113-41 ‘영종 공동집하장’, 을왕동 산34-9 ‘용유 공동집하장’)은 그 전에 만든 자료라 ‘중구’로 적혀 있습니다. 지도에서 찾을 때는 ‘인천 운남동 1113-41’처럼 구 이름 없이 검색하고, 이용 여부는 해당 구청이나 행정복지센터에 확인하세요.</p>
      <p>옹진군 10건은 이름이 모두 ‘백령 재활용선별장’, ‘대청 재활용선별장’처럼 ‘재활용선별장’으로 적혀 있습니다. 다른 지역의 마을 공동집하장과 받는 방식이 다를 수 있으니 옹진군청이나 면사무소에 먼저 물어보세요.</p>`
  }],
  "충청북도": [{
    source: SRC.cheongju,
    title: "청주시 안내",
    html: `<ul>
        <li>수거기관은 한국환경공단 충청권환경본부로 적혀 있고, 2025년 민간위탁 수거업자 관할 구역을 흥덕구, 상당구 미원·낭성·가덕면, 그 밖의 서원구·청원구·상당구로 나눠 업체 이름과 연락처를 공개합니다.</li>
        <li>폐비닐 수거장려금(1kg당): A등급 130원, B등급 110원, C등급 90원. 예산이 다 쓰이면 지급하지 않는다고 적혀 있습니다.</li>
        <li>부직포·반사필름처럼 농사 중에 나오는 다른 폐기물은 보상금이 없고 일반 생활폐기물이나 재활용품으로 내놓도록 안내합니다.</li>
        <li>담당: 청주시 자원순환팀, 누리집 표기 문의전화 043-201-4673.</li>
      </ul>`
  }],
  "충청남도": [{
    source: SRC.dangjin,
    title: "당진시 안내",
    html: `<ul>
        <li>폐비닐과 농약빈병은 공동집하장이나 마을회관 등 공터에 보관하도록 안내합니다.</li>
        <li>폐비닐·농약병 수거 문의처로 한국환경공단 번호 두 개(042-939-2309, 041-356-7553)를 적어 두었습니다.</li>
        <li>누리집 최종수정일이 2024년 10월 2일이므로, 번호와 방법이 바뀌었을 수 있습니다.</li>
      </ul>`
  }],
  "경상남도": [{
    source: SRC.miryang,
    title: "밀양시 안내(2020년 3월 6일 수정)",
    html: `<ul>
        <li>수거기관은 한국환경공단 부산울산경남지역본부로 적혀 있습니다.</li>
        <li>수거 순서: 농가가 이장이나 작목반장에게 신고 → 마을 공동집하장에 종류별로 모음 → 수거.</li>
        <li>수집장려금은 이장·작목반·부녀회·노인회에 지급하며, 폐비닐은 1kg당 A등급 140원·B등급 100원·C등급 60원, 농약빈병은 수거수수료의 40%로 적혀 있습니다.</li>
        <li>2020년에 고친 안내라 기관 이름, 연락처, 금액이 지금과 다를 수 있습니다. 밀양시 환경 담당 부서에 다시 확인하세요.</li>
      </ul>`
  }],
  "대구광역시": [{
    kind: "context",
    source: SRC.gunwiLaw,
    title: "대구 자료에 군위군이 들어 있는 이유",
    html: `<p>「경상북도와 대구광역시 간 관할구역 변경에 관한 법률」에 따라 군위군은 2023년 7월 1일부터 대구광역시에 속합니다. 그래서 공개자료의 대구 주소 대부분이 군위군에 있습니다. 예전처럼 ‘경상북도 군위군’으로 찾으면 나오지 않으니, 대구광역시에서 찾으세요. 수거 일정과 운영 여부는 군위군청이나 읍·면사무소에 확인합니다.</p>`
  }]
});
