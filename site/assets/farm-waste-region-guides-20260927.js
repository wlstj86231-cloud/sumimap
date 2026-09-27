// Exact city-page snapshot from Boribay src/shared/farmWasteRegions.ts at
// f8aeaf200855513004be75eabb853f95748d2018 (2026-09-27).
// Only these province/city pairs have a verified regional guide.
export const FARM_WASTE_REGION_GUIDES = Object.freeze(
{
  "강원특별자치도": {
    "slug": "gangwon",
    "cities": [
      "강릉시",
      "고성군",
      "삼척시",
      "양구군",
      "양양군",
      "영월군",
      "원주시",
      "인제군",
      "정선군",
      "철원군",
      "춘천시",
      "평창군",
      "홍천군",
      "화천군",
      "횡성군"
    ]
  },
  "경기도": {
    "slug": "gyeonggi",
    "cities": [
      "안성시",
      "여주시",
      "이천시",
      "화성시"
    ]
  },
  "경상남도": {
    "slug": "gyeongnam",
    "cities": [
      "거창군",
      "고성군",
      "남해군",
      "밀양시",
      "산청군",
      "의령군",
      "창녕군",
      "창원시",
      "하동군",
      "함양군",
      "합천군"
    ]
  },
  "경상북도": {
    "slug": "gyeongbuk",
    "cities": [
      "경주시",
      "고령군",
      "구미시",
      "김천시",
      "문경시",
      "봉화군",
      "상주시",
      "안동시",
      "영덕군",
      "영양군",
      "영주시",
      "영천시",
      "예천군",
      "울진군",
      "의성군",
      "청도군",
      "청송군"
    ]
  },
  "대구광역시": {
    "slug": "daegu",
    "cities": [
      "군위군"
    ]
  },
  "세종특별자치시": {
    "slug": "sejong",
    "cities": [
      "세종특별자치시"
    ]
  },
  "전라남도": {
    "slug": "jeonnam",
    "cities": [
      "강진군",
      "고흥군",
      "곡성군",
      "무안군",
      "보성군",
      "순천시",
      "여수시",
      "영광군",
      "완도군",
      "장흥군",
      "진도군",
      "함평군",
      "해남군",
      "화순군"
    ]
  },
  "전북특별자치도": {
    "slug": "jeonbuk",
    "cities": [
      "고창군",
      "김제시",
      "남원시",
      "무주군",
      "부안군",
      "순창군",
      "익산시",
      "임실군",
      "장수군",
      "정읍시",
      "진안군"
    ]
  },
  "제주특별자치도": {
    "slug": "jeju",
    "cities": [
      "서귀포시",
      "제주시"
    ]
  },
  "충청남도": {
    "slug": "chungnam",
    "cities": [
      "공주시",
      "금산군",
      "당진시",
      "보령시",
      "부여군",
      "서산시",
      "서천군",
      "예산군",
      "천안시",
      "청양군",
      "태안군",
      "홍성군"
    ]
  },
  "충청북도": {
    "slug": "chungbuk",
    "cities": [
      "괴산군",
      "단양군",
      "보은군",
      "영동군",
      "옥천군",
      "음성군",
      "제천시",
      "증평군",
      "진천군",
      "청주시 상당구",
      "충주시"
    ]
  }
}
);

export function regionGuideUrl(province, city) {
  const region = FARM_WASTE_REGION_GUIDES[province];
  if (!region || !region.cities.includes(city)) return null;
  return `https://boribay.com/guides/farm-waste-collection-sites/${region.slug}/${encodeURIComponent(city)}`;
}
