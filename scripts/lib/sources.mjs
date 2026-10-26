// Official sources re-read on 2026-10-26. Each entry says what it supports.
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
  }
});
