// Official sources re-read on 2026-10-26. Each entry says what it supports.
// /sources/ lists every entry, so only add pages whose facts are used on the site.
export const SRC = Object.freeze({
  data: {
    org: "공공데이터포털(한국환경공단)",
    title: "전국 영농폐기물 공동집하장 위치",
    url: "https://www.data.go.kr/data/15106132/fileData.do",
    use: "집하장 시·도, 시·군·구, 이름, 소재지(2025-08-27 기준 파일)"
  },
  keco: {
    org: "한국환경공단",
    title: "영농폐기물 수거·처리사업",
    url: "https://www.keco.or.kr/web/lay1/S1T185C1072/contents.do",
    use: "공동집하장 분리배출 기준(폐비닐 재질·색상, 농약 빈 용기 재질), 수거 흐름, 농약 빈 용기 수거비, 폐비닐 보상비 범위, 폐비닐 재활용시설 7곳의 위치(최종수정일 2025-03-11)"
  },
  sejong: {
    org: "세종특별자치시 자원순환",
    title: "영농폐기물 배출 방법",
    url: "https://www.sejong.go.kr/recycle/sub03_05.do",
    use: "지자체 배출 방법 예시(폐비닐·농약용기·폐농약 절차, 수거보상금, 재활용 의무 품목, 재활용 불가 품목), 공동집하장 설치현황(35개소) 표, 담당 부서"
  },
  cheongju: {
    org: "청주시",
    title: "영농폐기물(폐비닐, 폐농약병)",
    url: "https://www.cheongju.go.kr/www/contents.do?key=23188",
    use: "조례에 따른 배출 방법 예시, 농약 빈병과 유사 용기 구분, 보상금 예산 소진 시 미지급 안내, 수거기관(한국환경공단 충청권환경본부)과 구역별 민간위탁 수거업자, 담당 부서"
  },
  mafra: {
    org: "농림축산식품부",
    title: "PLS 농업인 실천사항",
    url: "https://www.mafra.go.kr/PLS/2069/subview.do",
    use: "사용하지 않거나 유효기간이 지난 농약의 반납, 폐농약함 이용, 남은 약액 재살포 시 잔류 초과 위험"
  },
  jejuAgri: {
    org: "제주특별자치도농업기술원",
    title: "작물보호제지침서 일러두기",
    url: "https://agri.jeju.go.kr/jadx/web/agriInfo/sftyInfo.do",
    use: "농약 보관 방법(밀봉, 햇빛을 피한 건조하고 서늘한 곳)"
  },
  wasteLaw8: {
    org: "국가법령정보센터",
    title: "폐기물관리법 제8조(폐기물의 투기 금지 등)",
    url: "https://www.law.go.kr/%EB%B2%95%EB%A0%B9/%ED%8F%90%EA%B8%B0%EB%AC%BC%EA%B4%80%EB%A6%AC%EB%B2%95/%EC%A0%9C8%EC%A1%B0",
    use: "정해진 장소·방법 외 투기 금지, 허가받지 않은 곳에서의 매립·소각 금지(2026-09-18 시행 법률 기준)"
  },
  wasteLaw68: {
    org: "국가법령정보센터",
    title: "폐기물관리법 제68조(과태료)",
    url: "https://www.law.go.kr/%EB%B2%95%EB%A0%B9/%ED%8F%90%EA%B8%B0%EB%AC%BC%EA%B4%80%EB%A6%AC%EB%B2%95/%EC%A0%9C68%EC%A1%B0",
    use: "제8조를 위반해 생활폐기물을 버리거나 매립·소각한 경우 100만원 이하 과태료(2026-09-18 시행 법률 기준)"
  },
  miryang: {
    org: "밀양시",
    title: "영농폐기물 배출 안내(2020-03-06 수정)",
    url: "https://www.miryang.go.kr/web/index.do?mnNo=50203000000",
    use: "지자체 예시: 폐비닐 이물질(흙·돌멩이·철사·노끈·농업용 호스) 제거, 하우스·멀칭 색깔별 구분, 도로변·하천변 적치 불가, 묘판·비료포대 등 일반쓰레기 배출, 수집장려금 지급 대상(이장·작목반·부녀회·노인회)과 농약빈병 수거수수료의 40% 지급, 수거기관(한국환경공단 부산울산경남지역본부)과 이장·작목반장 신고 절차"
  },
  dangjin: {
    org: "당진시",
    title: "농촌쓰레기 배출 안내",
    url: "https://www.dangjin.go.kr/kor/sub05_06_04_03.do",
    use: "지자체 예시: 폐비닐·농약빈병을 공동집하장 또는 마을회관 등 공터에 보관, 한국환경공단 문의처 안내(누리집 최종수정일 2024-10-02)"
  },
  gunwiLaw: {
    org: "국가법령정보센터",
    title: "경상북도와 대구광역시 간 관할구역 변경에 관한 법률(법률 제19155호)",
    url: "https://www.law.go.kr/%EB%B2%95%EB%A0%B9/%EA%B2%BD%EC%83%81%EB%B6%81%EB%8F%84%EC%99%80%EB%8C%80%EA%B5%AC%EA%B4%91%EC%97%AD%EC%8B%9C%EA%B0%84%EA%B4%80%ED%95%A0%EA%B5%AC%EC%97%AD%EB%B3%80%EA%B2%BD%EC%97%90%EA%B4%80%ED%95%9C%EB%B2%95%EB%A5%A0",
    use: "군위군이 2023년 7월 1일부터 대구광역시에 편입된 근거(대구 자료에 군위군 주소가 실린 이유)"
  },
  jeonnamLaw: {
    org: "국가법령정보센터",
    title: "전남광주통합특별시 설치를 위한 특별법(법률 제21446호)",
    url: "https://www.law.go.kr/%EB%B2%95%EB%A0%B9/%EC%A0%84%EB%82%A8%EA%B4%91%EC%A3%BC%ED%86%B5%ED%95%A9%ED%8A%B9%EB%B3%84%EC%8B%9C%EC%84%A4%EC%B9%98%EB%A5%BC%EC%9C%84%ED%95%9C%ED%8A%B9%EB%B3%84%EB%B2%95",
    use: "2026년 7월 1일 시행. 전라남도와 광주광역시를 폐지하고 전남광주통합특별시(약칭 광주특별시)를 설치한 근거(제7조, 부칙 제1조)"
  },
  incheonLaw: {
    org: "국가법령정보센터",
    title: "인천광역시 제물포구ㆍ영종구 및 검단구 설치 등에 관한 법률",
    url: "https://www.law.go.kr/%EB%B2%95%EB%A0%B9/%EC%9D%B8%EC%B2%9C%EA%B4%91%EC%97%AD%EC%8B%9C%EC%A0%9C%EB%AC%BC%ED%8F%AC%EA%B5%AC%E3%86%8D%EC%98%81%EC%A2%85%EA%B5%AC%EB%B0%8F%EA%B2%80%EB%8B%A8%EA%B5%AC%EC%84%A4%EC%B9%98%EB%93%B1%EC%97%90%EA%B4%80%ED%95%9C%EB%B2%95%EB%A5%A0",
    use: "2026년 7월 1일 시행. 인천광역시 중구·동구 폐지와 제물포구·영종구·검단구 설치(제2조, 부칙 제1조)"
  },
  hoengseong: {
    org: "횡성군",
    title: "폐기물 배출요령(영농폐기물)",
    url: "https://www.hsg.go.kr/www/contents.do?key=1310",
    use: "지자체 예시: 마을별 폐비닐 간이수집소, 흰색·검정색 분리(미분리 시 수거 안 함), 수거기관(한국환경공단 홍천사업소), 수집장려금 단가, 농약용기 배출 방법, 담당 부서(누리집 최종수정일 2023-01-31)"
  },
  hwaseong: {
    org: "화성특례시 청소행정 포털",
    title: "영농폐기물",
    url: "https://h-waste.hscity.go.kr/05_recycle/05_recycle0105.asp",
    use: "지자체 예시: 재활용이 안 되는 영농폐기물 수거처리 지원사업 품목, 미사용 농약 집중수거(반기별 1회), 일반폐기물로 내는 품목, 포털에 적힌 공단 수거·보상 금액, 읍·면·동별 영농폐기물 집하장 수"
  },
  andong: {
    org: "안동시",
    title: "영농폐기물 배출안내",
    url: "https://www.andong.go.kr/portal/contents.do?mId=0607130000",
    use: "지자체 예시: 폐비닐·농약용기 분리배출, 미사용 농약 수거함, 반사필름·점적호스 무상수거기간, 수집보상금 지급 대상·단가·신청 방법, 한국환경공단 안동폐비닐처리공장 수거 요청, 담당 부서"
  },
  boseong: {
    org: "보성군",
    title: "영농폐기물 수거안내",
    url: "https://www.boseong.go.kr/www/open_data/environment/farming_waste",
    use: "지자체 예시: 수거장려금을 주는 곳(군·한국환경공단)과 단가, 이물질이 많으면 수거하지 않음, 묶음·마대 배출, 문의처(누리집 최종업데이트 2026-09-18)"
  },
  namwon: {
    org: "남원시 덕과면",
    title: "영농폐기물 올바른 분리배출 안내(2025-06-12 게시)",
    url: "https://www.namwon.go.kr/board/post/view.do?boardUid=ff8080818f2717db018f2c6a0b9e036d&menuUid=ff8080818e3beff0018e407625450070&postUid=9be51b0e972ffdd7019761a9e1175bb3",
    use: "지자체 예시: 폐비닐 재질별 구분과 한국환경공단 남원수거사업소 직접 반입, 농약용기 배출, 부직포·차광막·반사필름·점적호스·곤포사일리지 비닐의 집중수거기간 배출과 대산매립장 반입"
  }
});
