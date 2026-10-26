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

// Facts per province. `html` is trusted markup written here, `source` is the page it came from.
export const LOCAL_NOTES = Object.freeze({
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
