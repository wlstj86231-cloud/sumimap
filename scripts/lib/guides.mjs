// 배출 방법 안내. Every factual statement points to an entry in SRC
// (re-read 2026-10-26). Regional examples are labelled with the region.
import { SRC } from "./sources.mjs";
import { boribay, FINDER_ROUTE } from "./layout.mjs";

export const GUIDE_LIST = [
  { route: "/guide/vinyl/", label: "폐비닐", summary: "하우스·멀칭 비닐을 털고 나눠 묶는 방법" },
  { route: "/guide/pesticide-containers/", label: "농약 빈 용기", summary: "유리병·플라스틱병·봉지 나누기와 수거비" },
  { route: "/guide/leftover-pesticide/", label: "남은 농약", summary: "유효기간 지난 농약을 반납·배출하는 순서" },
  { route: "/guide/other-farm-waste/", label: "그 밖의 농자재", summary: "영양제 병, 비료 포대, 차광막, 부직포" },
  { route: "/guide/before-visit/", label: "가기 전 확인", summary: "읍·면사무소에 물어볼 5가지와 전화 요령" },
  { route: "/guide/no-burning/", label: "태우거나 묻으면", summary: "폐기물관리법 기준과 과태료" }
];

const finderCta = (text = "가까운 공동집하장 주소 찾기") => `<p class="cta-row"><a class="btn" href="${FINDER_ROUTE}">${text}</a></p>`;

export function relatedGuides(current) {
  const items = GUIDE_LIST.filter((item) => item.route !== current);
  return `<section class="related" aria-labelledby="related-title">
      <h2 id="related-title">다른 배출 안내</h2>
      <div class="card-grid">
        ${items.map((item) => `<a class="card" href="${item.route}"><strong>${item.label}</strong><span>${item.summary}</span></a>`).join("\n        ")}
      </div>
    </section>`;
}

export const GUIDES = [
  {
    route: "/guide/",
    title: "영농폐기물 종류별 배출 방법 한눈에 보기 | 영농폐기물 집하장 지도",
    description: "폐비닐, 농약 빈 용기, 남은 농약, 영양제 병, 비료 포대, 차광막을 각각 어디에 어떻게 내놓는지 한국환경공단과 지자체 공식 안내로 정리했습니다.",
    h1: "영농폐기물, 종류마다 내놓는 곳이 다릅니다",
    lead: "폐비닐과 농약 빈 용기는 마을 공동집하장으로, 남은 농약은 구입처나 읍·면사무소로 갑니다. 버릴 물건을 표에서 찾고, 자세한 방법은 각 안내를 눌러 보세요.",
    sources: [SRC.keco, SRC.sejong, SRC.cheongju, SRC.mafra],
    body: `
    <section class="box" aria-labelledby="table-title">
      <h2 id="table-title">품목별로 어디에 내놓나요</h2>
      <ul class="item-list">
        <li><h3><a href="/guide/vinyl/">폐비닐</a> <small>하우스·멀칭</small></h3><p><b>내놓는 곳</b> 마을 공동집하장</p><p><b>내놓기 전에</b> 흙·자갈·잡초를 털고 종류·색깔별로 묶기</p></li>
        <li><h3><a href="/guide/pesticide-containers/">농약 빈 용기</a> <small>유리병·플라스틱병·봉지</small></h3><p><b>내놓는 곳</b> 마을 공동집하장 또는 농약빈병 수거함</p><p><b>내놓기 전에</b> 내용물을 다 쓰고 재질별로 나누기, 겉면 ‘농약’ 표기 확인</p></li>
        <li><h3><a href="/guide/leftover-pesticide/">남은 농약</a> <small>안 쓰는 농약·유효기간 지난 농약</small></h3><p><b>내놓는 곳</b> 구입한 농약판매점(농협 등)에 반납, 또는 읍·면사무소에 폐농약 수거 문의</p><p><b>내놓기 전에</b> 원래 용기째 뚜껑을 닫아 밀봉</p></li>
        <li><h3><a href="/guide/other-farm-waste/">영양제·유기농자재 병</a> <small>‘농약’ 표기 없음</small></h3><p><b>내놓는 곳</b> 공동집하장 수거 대상 아님. 지역 기준에 따라 종량제 봉투 또는 재활용품</p><p><b>내놓기 전에</b> 사는 시·군의 분리배출 기준 확인</p></li>
        <li><h3><a href="/guide/other-farm-waste/">곤포사일리지 필름, 비료·사료 포대</a></h3><p><b>내놓는 곳</b> 지역 안내 확인(세종시는 재활용사업장 인계, 소량이면 폐비닐과 구분해 집하장)</p><p><b>내놓기 전에</b> 폐비닐과 섞지 않기</p></li>
        <li><h3><a href="/guide/other-farm-waste/">차광막·부직포·반사필름</a></h3><p><b>내놓는 곳</b> 세종시 안내 기준 재활용 불가 품목: 생활폐기물 또는 대형폐기물</p><p><b>내놓기 전에</b> 폐비닐 더미에 넣지 않기</p></li>
      </ul>
      <p>위 목록의 기본 흐름은 한국환경공단 안내를 따랐고, 영양제 병·비료 포대·차광막처럼 지역마다 다른 품목은 세종시와 청주시 안내를 예로 들었습니다. 우리 시·군의 기준은 읍·면사무소에 한 번 더 확인하세요.</p>
    </section>

    <section class="box" aria-labelledby="flow-title">
      <h2 id="flow-title">집하장에 모은 뒤에는 어떻게 되나요</h2>
      <ol class="steps-list">
        <li>농가와 마을에서 폐비닐과 농약 빈 용기를 종류별로 나눠 <strong>마을별 공동집하장</strong>에 모읍니다.</li>
        <li>한국환경공단 수거사업소가 수거 요청과 <strong>지역별 수거 일정</strong>에 따라 가져갑니다.</li>
        <li>모은 폐비닐은 재활용시설을 거쳐 국내외 재활용업체로 공급됩니다. 한국환경공단은 안동·담양·시화·정읍·안성·성주·의령의 폐비닐 재활용시설 7곳을 안내합니다.</li>
      </ol>
      <p>그래서 집하장에 아무 쓰레기나 섞어 두면 수거가 어려워집니다. 수거일은 지역마다 다르므로 마을 이장이나 읍·면사무소에서 확인합니다.</p>
    </section>

    <section class="box" aria-labelledby="reward-title">
      <h2 id="reward-title">수거 보상금은 얼마인가요</h2>
      <div class="table-wrap">
        <table>
          <thead><tr><th scope="col">품목</th><th scope="col">금액(1kg당)</th><th scope="col">지급</th></tr></thead>
          <tbody>
            <tr><td>농약 빈 유리병</td><td>300원</td><td>한국환경공단</td></tr>
            <tr><td>농약 빈 플라스틱병</td><td>1,600원</td><td>한국환경공단</td></tr>
            <tr><td>농약 봉지류</td><td>3,680원</td><td>한국환경공단</td></tr>
            <tr><td>폐비닐</td><td>10~250원, 지역마다 다름</td><td>지방자치단체</td></tr>
          </tbody>
        </table>
      </div>
      <p>폐비닐은 등급별로 단가를 정한 곳이 많습니다. 예를 들어 세종시는 A등급 140원·B등급 100원·C등급 60원, 청주시는 A등급 130원·B등급 110원·C등급 90원으로 안내합니다(각 시 누리집, 자료 대조일 2026-10-26). 청주시는 예산이 다 쓰이면 보상금을 지급하지 않는다고 적어 두었습니다. 등급을 나누는 기준과 올해 금액은 시·군에 확인하세요.</p>
    </section>

    <section class="notice" aria-labelledby="burn-title">
      <h2 id="burn-title">밭에서 태우거나 묻지 마세요</h2>
      <p>허가받은 처리시설이 아닌 곳에서 폐기물을 태우거나 묻는 일은 폐기물관리법 제8조가 금지합니다. 생활폐기물을 그렇게 처리하면 100만원 이하 과태료 대상입니다. 자세한 기준은 <a href="/guide/no-burning/">태우거나 묻으면 안 되는 이유</a>에 정리했습니다.</p>
    </section>

    <section class="box box-soft" aria-labelledby="find-title">
      <h2 id="find-title">우리 동네 집하장은 어디에 있나요</h2>
      <p>한국환경공단 공개자료에 실린 전국 공동집하장 주소 9,553건을 시·도 → 시·군·구 → 읍·면·동 순서로 찾을 수 있습니다. 주소를 복사하거나 네이버·카카오 지도로 바로 열 수 있습니다.</p>
      ${finderCta()}
      <p class="small">쓸 만한 농자재나 남는 자재는 버리기 전에 이웃에게 필요한지 먼저 물어보세요. 같은 운영자가 만든 <a href="${boribay("/guides/farm-supplies-disposal-guide")}">보리장터의 농자재 정리·배출 안내</a>에 재사용과 나눔 전 확인할 점을 정리해 두었습니다.</p>
    </section>`
  },
  {
    route: "/guide/vinyl/",
    title: "영농 폐비닐 버리는 방법: 하우스·멀칭 구분과 집하장 배출 | 영농폐기물 집하장 지도",
    description: "걷어 낸 하우스·멀칭 폐비닐을 흙과 잡초를 털어 종류·색깔별로 묶고 공동집하장에 내놓는 순서, 보상금과 하지 말아야 할 일을 공식 안내로 정리했습니다.",
    h1: "폐비닐은 털고, 나누고, 묶어서 집하장으로",
    lead: "폐비닐은 재질과 섞인 이물질에 따라 재활용 여부와 보상금이 달라집니다. 걷어 낸 날 바로 정리해 두면 수거 날 일이 줄어듭니다.",
    sources: [SRC.keco, SRC.cheongju, SRC.sejong, SRC.miryang, SRC.wasteLaw8, SRC.wasteLaw68],
    body: `
    <section class="box" aria-labelledby="steps-title">
      <h2 id="steps-title">이 순서로 정리하세요</h2>
      <ol class="steps-list">
        <li><strong>흙·자갈·잡초를 털어 냅니다.</strong> 청주시와 세종시 모두 흙과 자갈, 잡초를 털어 낸 뒤 내놓도록 안내합니다. 밀양시 안내(2020년 수정)는 철사, 노끈, 농업용 호스도 빼도록 적고 있습니다.</li>
        <li><strong>하우스용과 멀칭용을 따로 모읍니다.</strong> 한국환경공단은 재질(하우스, 멀칭로덴, 하이덴)과 색깔(흰색, 검정색)로 나눠 내놓도록 안내합니다.</li>
        <li><strong>운반하기 쉽게 묶습니다.</strong> 수거 차량에 싣기 좋게 한 묶음씩 정리합니다. 밀양시는 하우스 덮개용 깨끗한 비닐을 돌돌 말아 부피를 줄이도록 안내합니다.</li>
        <li><strong>마을 공동집하장에 둡니다.</strong> 청주시 조례는 마을 공동집하장 또는 수거·운반 차량이 들어올 수 있는 일정한 장소에 보관하도록 정합니다. 어느 쪽인지는 마을마다 다르니 이장에게 물어보세요.</li>
        <li><strong>수거일과 보상금 방법을 묻습니다.</strong> 한국환경공단 수거사업소가 지역별 일정에 따라 수거하므로, 읍·면사무소나 마을 이장에게 이번 수거 날짜를 확인합니다.</li>
      </ol>
      ${finderCta("내 지역 집하장 주소 찾기")}
    </section>

    <section class="box" aria-labelledby="money-title">
      <h2 id="money-title">보상금은 지자체가 지급합니다</h2>
      <p>한국환경공단 안내에 따르면 폐비닐 수거 보상비는 지방자치단체가 지급하며 1kg당 10~250원으로 지역마다 다릅니다. 등급(A·B·C)에 따라 단가를 달리 정한 곳이 많습니다.</p>
      <ul>
        <li>세종시: A등급 140원, B등급 100원, C등급 60원(1kg당)</li>
        <li>청주시: A등급 130원, B등급 110원, C등급 90원(1kg당), 예산이 소진되면 지급하지 않음</li>
      </ul>
      <p>위 금액은 두 시의 누리집을 2026-10-26에 확인한 예시입니다. 등급을 나누는 기준과 우리 지역 단가는 시·군 환경(자원순환) 담당 부서에 확인하세요.</p>
    </section>

    <section class="box" aria-labelledby="case-title">
      <h2 id="case-title">이럴 때는 이렇게</h2>
      <ul>
        <li><strong>양이 아주 많을 때:</strong> 세종시는 1톤 이상 나오면 시가 배출을 지원하고, 5톤 이상이면 한국환경공단이 수거·처리한다고 안내합니다. 다른 지역은 시·군에 기준을 물어보세요.</li>
        <li><strong>차광막·부직포·반사필름이 섞였을 때:</strong> 세종시는 이 품목을 재활용이 불가능한 폐기물로 분류해 생활폐기물이나 대형폐기물로 내놓게 합니다. 폐비닐 묶음에서 빼 두세요. → <a href="/guide/other-farm-waste/">그 밖의 농자재</a></li>
        <li><strong>곤포사일리지 필름·비료 포대:</strong> 세종시는 재활용사업장 인계를 기본으로 하고, 소량이면 폐비닐과 구분해 집하장에 내놓게 합니다.</li>
        <li><strong>집하장이 가득 찼거나 문이 잠겨 있을 때:</strong> 길가에 두고 오지 말고 마을 이장이나 읍·면사무소에 연락해 다른 보관 장소를 안내받으세요.</li>
      </ul>
    </section>

    <section class="notice" aria-labelledby="dont-title">
      <h2 id="dont-title">하지 말아야 할 일</h2>
      <ul class="check-list dont-list">
        <li><strong>태우거나 땅에 묻기.</strong> 폐기물관리법 제8조 제2항은 허가·승인·신고된 처리시설이 아닌 곳에서 폐기물을 매립하거나 소각하는 것을 금지합니다. 생활폐기물을 그렇게 처리하면 제68조에 따라 100만원 이하 과태료 대상입니다.</li>
        <li><strong>농약병이나 생활 쓰레기와 섞기.</strong> 공단은 폐비닐과 농약 빈 용기를 재질별로 따로 수거합니다.</li>
        <li><strong>길가나 하천변에 쌓아 두기.</strong> 밀양시는 도로변·하천변 적치를 금지하고 마을별로 지정된 집하장에 내놓도록 안내합니다. 지자체가 정한 장소·방법이 아닌 곳에 폐기물을 버리는 것은 폐기물관리법 제8조 제1항도 금지합니다.</li>
      </ul>
    </section>`
  },
  {
    route: "/guide/pesticide-containers/",
    title: "농약 빈 용기(빈병·봉지) 배출 방법과 수거비 | 영농폐기물 집하장 지도",
    description: "농약 빈병과 봉지를 유리병·플라스틱병·봉지류로 나누는 방법, ‘농약’ 표기 확인, 뚜껑 분리, 1kg당 수거비를 한국환경공단과 지자체 안내로 정리했습니다.",
    h1: "농약 빈 용기는 다 쓰고, 재질별로 나눠서",
    lead: "농약 빈 용기는 한국환경공단이 따로 수거하고 무게에 따라 수거비를 줍니다. 대신 내용물이 남은 병이나 농약이 아닌 병은 받지 않습니다.",
    sources: [SRC.keco, SRC.sejong, SRC.cheongju, SRC.mafra],
    body: `
    <section class="box" aria-labelledby="steps-title">
      <h2 id="steps-title">내놓기 전 다섯 가지</h2>
      <ol class="steps-list">
        <li><strong>겉면에 ‘농약’ 표기가 있는지 봅니다.</strong> 청주시는 살균제·살충제·제초제처럼 용기에 ‘농약’ 표기가 있는 것만 농약 빈병으로 봅니다.</li>
        <li><strong>내용물을 완전히 쓴 뒤 내놓습니다.</strong> 한국환경공단, 세종시, 청주시 모두 농약을 다 사용한 용기만 배출하도록 안내합니다. 남은 농약은 <a href="/guide/leftover-pesticide/">남은 농약 처리 방법</a>을 따릅니다.</li>
        <li><strong>유리병, 플라스틱병, 봉지로 나눕니다.</strong> 공단은 유리병·플라스틱·봉지(은박류, 종이)로 구분해 배출하도록 안내합니다.</li>
        <li><strong>뚜껑을 분리해 마대에 따로 담습니다.</strong> 세종시 안내 방법입니다. 우리 지역 방식은 읍·면사무소에 확인하세요.</li>
        <li><strong>공동집하장이나 농약빈병 수거함에 둡니다.</strong> 청주시는 마을 공동집하장, 농약빈병 수거함 또는 수거 차량이 들어올 수 있는 장소를 수거 장소로 안내합니다.</li>
      </ol>
      ${finderCta("내 지역 집하장 주소 찾기")}
    </section>

    <section class="box" aria-labelledby="money-title">
      <h2 id="money-title">수거비(1kg당)</h2>
      <div class="table-wrap">
        <table>
          <thead><tr><th scope="col">재질</th><th scope="col">수거비</th></tr></thead>
          <tbody>
            <tr><td>유리병</td><td>300원</td></tr>
            <tr><td>플라스틱병</td><td>1,600원</td></tr>
            <tr><td>봉지류(은박류·종이)</td><td>3,680원</td></tr>
          </tbody>
        </table>
      </div>
      <p>한국환경공단 안내 금액이며, 세종시와 청주시도 같은 금액을 공단 지급분으로 적어 두었습니다. 재질을 섞어 내면 무게를 나눠 재기 어려우니 처음부터 따로 모으세요.</p>
    </section>

    <section class="box" aria-labelledby="similar-title">
      <h2 id="similar-title">농약처럼 생겼지만 받지 않는 병</h2>
      <p>영양제, 친환경 유기농자재, 토양개량제 용기는 농약병과 모양이 비슷해도 「농약관리법」상 농약이 아니어서 겉면에 ‘농약’ 표기가 없습니다. 청주시는 이런 유사 용기를 수거 불가 품목이자 보상금 지급 대상이 아니라고 안내합니다.</p>
      <ul>
        <li>세종시: 토양개량제·영양제병 등은 종량제 봉투에 배출</li>
        <li>청주시: 유사 용기는 투명 비닐봉투에 따로 담아 재활용품으로 분리배출</li>
      </ul>
      <p>이처럼 지역마다 다르므로 사는 시·군의 기준을 확인하세요.</p>
    </section>

    <section class="box" aria-labelledby="box-title">
      <h2 id="box-title">집하장과 폐농약함, 어느 쪽에 넣나요</h2>
      <p>한국환경공단은 농약 빈 용기를 마을 공동집하장에서 재질별로 수거합니다. 농림축산식품부의 PLS 농업인 실천사항은 사용 후 농약 빈병을 가까운 폐농약함에 버리도록 안내합니다. 지역마다 빈병 수거함, 폐농약함, 공동집하장을 쓰는 방식이 다를 수 있으니 처음 내놓을 때 읍·면사무소에 어느 곳에 두면 되는지 물어보세요.</p>
    </section>`
  },
  {
    route: "/guide/leftover-pesticide/",
    title: "남은 농약·유효기간 지난 농약 처리 방법 | 영농폐기물 집하장 지도",
    description: "쓰고 남은 농약과 유효기간이 지난 농약은 빈 용기 수거함에 넣지 않습니다. 구입처 반납, 읍·면사무소 폐농약 수거, 보관 방법을 농림축산식품부와 지자체 안내로 정리했습니다.",
    h1: "남은 농약은 빈 용기 수거함에 넣지 않습니다",
    lead: "내용물이 남은 농약은 빈 용기와 처리 경로가 다릅니다. 원래 용기째 밀봉해 두고, 구입처나 읍·면사무소에 처리 방법을 물어보세요.",
    sources: [SRC.mafra, SRC.sejong, SRC.jejuAgri, SRC.keco],
    body: `
    <section class="box" aria-labelledby="steps-title">
      <h2 id="steps-title">처리 순서</h2>
      <ol class="steps-list">
        <li><strong>라벨과 유효기간을 확인합니다.</strong> 제품명과 남은 양을 알아야 반납이나 수거 신청 때 설명하기 쉽습니다.</li>
        <li><strong>원래 용기째 뚜껑을 닫아 밀봉합니다.</strong> 세종시는 잔류농약을 용기째 밀봉해 가져오도록 안내합니다. 다른 병에 옮겨 담지 마세요.</li>
        <li><strong>구입한 곳에 반납할 수 있는지 묻습니다.</strong> 농림축산식품부는 유효기간이 지났거나 사용하지 않는 농약을 구입한 농약판매점(농협, 농약시판상 등)에 반납하도록 안내합니다.</li>
        <li><strong>읍·면사무소에 폐농약 수거 방법을 묻습니다.</strong> 세종시는 읍·면사무소를 방문해 배출을 신청하면 관리자가 지켜보는 가운데 전용 수거함에 넣고, 처리업체에 위탁해 처리합니다.</li>
        <li><strong>처리 전까지는 안전하게 보관합니다.</strong> 제주특별자치도농업기술원은 농약을 잘 밀봉해 햇빛을 피한 건조하고 서늘한 곳에 보관하도록 안내합니다. 아이 손이 닿지 않는 곳에 두세요.</li>
      </ol>
    </section>

    <section class="notice" aria-labelledby="dont-title">
      <h2 id="dont-title">이렇게 하면 안 됩니다</h2>
      <ul class="check-list dont-list">
        <li><strong>빈 용기 수거함이나 공동집하장에 내용물째 넣기.</strong> 한국환경공단은 농약을 완전히 사용한 용기만 빈 용기로 수거합니다.</li>
        <li><strong>남은 약을 작물에 다시 뿌려 없애기.</strong> 농림축산식품부는 사용 후 남은 잔량을 다시 농작물에 뿌리면 잔류 초과가 생길 수 있다고 안내합니다.</li>
        <li><strong>음료병 같은 다른 용기에 옮겨 담기.</strong> 라벨이 없어지면 무엇인지 알 수 없고 반납·수거도 어려워집니다.</li>
        <li><strong>땅이나 도랑, 하수구에 붓기.</strong> 처리 방법을 모르겠다면 그대로 밀봉해 두고 읍·면사무소에 문의하세요.</li>
      </ul>
    </section>

    <section class="box" aria-labelledby="mafra-title">
      <h2 id="mafra-title">농림축산식품부 안내 요약</h2>
      <p>PLS(농약 허용물질목록 관리제도) 농업인 실천사항에는 다음 내용이 함께 있습니다.</p>
      <ul>
        <li>유효기간이 지난 농약, 사용하지 않는 농약은 구입한 농약판매점(농협, 농약시판상 등)에 반납</li>
        <li>사용 후 유효기간이 지난 농약과 농약 빈병은 가까운 폐농약함에 배출</li>
        <li>해당 작물에 등록된 농약만, 희석배수와 살포 횟수를 지켜 사용</li>
      </ul>
      <p>폐농약함이 어디 있는지, 언제 비우는지는 지역마다 다릅니다. 가까운 집하장 주소를 찾았다면 폐농약도 그곳에 받는지 함께 물어보세요.</p>
      ${finderCta("집하장 주소 찾고 함께 물어보기")}
    </section>`
  },
  {
    route: "/guide/other-farm-waste/",
    title: "영양제 병·비료 포대·차광막·부직포 버리는 법 | 영농폐기물 집하장 지도",
    description: "공동집하장에서 받지 않거나 따로 나눠야 하는 영양제·유기농자재 병, 곤포사일리지 필름과 비료·사료 포대, 차광막·부직포·반사필름 처리 방법을 지자체 안내로 정리했습니다.",
    h1: "집하장에 넣기 애매한 농자재 정리법",
    lead: "공동집하장은 폐비닐과 농약 빈 용기가 중심입니다. 그 밖의 농자재는 품목마다 내놓는 곳이 달라서, 섞어 두면 수거되지 않을 수 있습니다.",
    sources: [SRC.sejong, SRC.cheongju, SRC.miryang, SRC.keco],
    body: `
    <section class="box" aria-labelledby="bottle-title">
      <h2 id="bottle-title">영양제·친환경 유기농자재 병</h2>
      <p>겉면에 ‘농약’ 표기가 없는 병은 농약 빈 용기 수거 대상이 아닙니다. 청주시는 이런 병을 수거 불가 품목이자 보상금 지급 대상이 아니라고 안내합니다.</p>
      <ul>
        <li>세종시: 토양개량제·영양제병 등은 종량제 봉투로 배출</li>
        <li>청주시: 투명 비닐봉투에 따로 담아 재활용품으로 분리배출</li>
      </ul>
    </section>

    <section class="box" aria-labelledby="epr-title">
      <h2 id="epr-title">곤포사일리지 필름, 비료·사료 포대, PE 영농필름</h2>
      <p>세종시는 이 품목을 「자원의 절약과 재활용촉진에 관한 법률 시행령」 제18조와 별표 3에 따른 생산자책임재활용(EPR) 대상으로 안내합니다.</p>
      <ul>
        <li>기본: 인근 재활용사업장(한국농수산재활용사업공제조합)에 인계</li>
        <li>양이 적을 때: 폐비닐 등과 구분해 공동집하장에 배출</li>
      </ul>
      <p>같은 비료 포대라도 지역 안내가 다릅니다. 밀양시 안내(2020년 수정)는 묘판, 노끈, PVC 호스, 비료포대를 종량제 봉투에 넣어 일반쓰레기 배출 장소에 내놓도록 적고 있습니다. 재활용사업장이 어디인지, 우리 지역 집하장에서 받는지는 시·군 담당 부서에 확인하세요.</p>
    </section>

    <section class="box" aria-labelledby="shade-title">
      <h2 id="shade-title">차광막·부직포·반사필름</h2>
      <p>세종시는 차광막, 부직포, 반사필름을 재활용이 불가능한 폐기물로 분류해 생활폐기물 또는 대형폐기물로 내놓게 합니다. 폐비닐과 섞이면 폐비닐 재활용을 방해하므로 따로 모아 두세요. 대형폐기물 신고 방법과 수수료는 시·군마다 다릅니다.</p>
    </section>

    <section class="box" aria-labelledby="reuse-title">
      <h2 id="reuse-title">아직 쓸 만한 자재와 농기계</h2>
      <p>찢어지지 않은 차광막, 남은 지주대, 쓰던 농기계처럼 아직 쓸 수 있는 물건은 버리기 전에 가까운 농가에 필요한지 먼저 알아보세요. 이 사이트를 만든 제이 미디어가 운영하는 <a href="${boribay("/?category=MACHINERY")}">보리장터 농기계 장터</a>에서 같은 지역 사람끼리 중고 농기계와 농자재를 사고팔 수 있습니다.</p>
      <p>농약, 성분을 알 수 없는 약제, 유효기간이 지난 제품은 나눔이나 판매 대상으로 삼지 마세요. 남은 농약은 <a href="/guide/leftover-pesticide/">남은 농약 처리 방법</a>을 따릅니다.</p>
    </section>

    <section class="box box-soft" aria-labelledby="sort-title">
      <h2 id="sort-title">정리 순서 요약</h2>
      <ol class="steps-list">
        <li>폐비닐(하우스·멀칭)과 농약 빈 용기를 먼저 골라 집하장용으로 따로 둡니다.</li>
        <li>‘농약’ 표기가 없는 병, 비료·사료 포대, 차광막·부직포를 각각 다른 자루에 나눕니다.</li>
        <li>각 묶음을 어디에 내놓는지 읍·면사무소에 한 번에 물어봅니다.</li>
      </ol>
      ${finderCta("집하장 주소 찾기")}
    </section>`
  },
  {
    route: "/guide/before-visit/",
    title: "공동집하장 가기 전 확인할 5가지와 전화 문의 요령 | 영농폐기물 집하장 지도",
    description: "공개자료에는 집하장 운영 요일·수거일·받는 품목·연락처가 없습니다. 읍·면사무소에 무엇을 어떻게 물어보면 되는지, 지도에서 주소를 찾을 때 주의할 점을 정리했습니다.",
    h1: "집하장에 가기 전, 전화 한 통으로 확인하세요",
    lead: "이 사이트의 주소는 한국환경공단 공개자료에서 왔지만, 그 자료에는 운영 요일·수거일·받는 품목·연락처가 없습니다. 짐을 싣기 전에 아래 다섯 가지를 확인하면 헛걸음을 줄일 수 있습니다.",
    sources: [SRC.data, SRC.keco, SRC.cheongju, SRC.dangjin, SRC.wasteLaw8],
    body: `
    <section class="box" aria-labelledby="five-title">
      <h2 id="five-title">확인할 다섯 가지</h2>
      <ol class="steps-list">
        <li><strong>지금도 쓰는 집하장인가요?</strong> 공개자료는 2025년 8월 27일 기준 파일입니다. 그 뒤에 옮기거나 없어졌을 수 있습니다.</li>
        <li><strong>우리 마을이 써도 되는 곳인가요?</strong> 한국환경공단은 마을별 공동집하장에 분리배출하도록 안내합니다. 가까워도 다른 마을 몫인 곳이 있습니다.</li>
        <li><strong>무엇을 어떻게 나눠 두나요?</strong> 폐비닐(하우스·멀칭, 흰색·검정색)과 농약 빈 용기(유리병·플라스틱·봉지)를 나누는 방식, 묶는 방법을 묻습니다.</li>
        <li><strong>다음 수거는 언제인가요?</strong> 공단 수거사업소가 지역별 일정에 따라 수거합니다. 보상금은 어떻게 받는지도 함께 묻습니다.</li>
        <li><strong>차가 들어갈 수 있나요?</strong> 주소가 농로나 산 지번인 경우가 많습니다. 트럭이 들어갈 길과 내려놓을 자리를 확인합니다.</li>
      </ol>
    </section>

    <section class="box" aria-labelledby="call-title">
      <h2 id="call-title">어디에 전화하나요</h2>
      <ul>
        <li><strong>읍·면 행정복지센터(읍·면사무소):</strong> 마을 집하장 위치, 수거 일정, 폐농약 수거함을 가장 잘 압니다.</li>
        <li><strong>시·군청 환경(자원순환·청소) 담당 부서:</strong> 보상금 단가와 지급 방법, 대량 배출 지원을 안내합니다. 청주시처럼 누리집에 담당 팀과 전화번호를 적어 둔 곳도 있습니다.</li>
        <li><strong>마을 이장:</strong> 마을 집하장 열쇠나 공동 수거 날짜를 관리하는 경우가 많습니다.</li>
      </ul>
      <p>당진시처럼 시·군 누리집에 폐비닐·농약병 수거 문의처(한국환경공단)를 따로 적어 둔 곳도 있으니, 시·군 누리집에서 ‘영농폐기물’을 검색해 보세요.</p>
    </section>

    <section class="box" aria-labelledby="script-title">
      <h2 id="script-title">전화로 이렇게 물어보세요</h2>
      <ul class="check-list">
        <li>“○○리에 사는데요, 폐비닐이랑 농약 빈병은 어느 집하장에 내놓으면 되나요?”</li>
        <li>“이번 수거는 언제인가요? 그 전에 갖다 둬도 되나요?”</li>
        <li>“하우스 비닐이랑 멀칭 비닐은 따로 묶어야 하나요?”</li>
        <li>“다 못 쓴 농약은 어디로 가져가면 되나요?”</li>
        <li>“보상금은 어떻게 받나요? 신청해야 하나요?”</li>
      </ul>
    </section>

    <section class="box" aria-labelledby="map-title">
      <h2 id="map-title">지도에서 주소를 찾을 때</h2>
      <ul>
        <li>공개자료에는 좌표가 없어서 지도 버튼은 <strong>주소 글자로 검색</strong>합니다. 검색 결과가 집하장 입구와 다를 수 있으니 현장 표지와 마을 분들의 안내를 따르세요.</li>
        <li>“고단1리”처럼 마을(행정리) 번호가 붙은 주소는 지도에서 잘 안 나올 때가 있습니다. 지도 버튼은 “고단리”처럼 번호를 뺀 이름과 지번으로 검색합니다. 화면에 보이는 주소는 원자료 그대로입니다.</li>
        <li>괄호 안의 설명(예: 마을회관 옆)은 지도 검색에서는 빼고, 현장에서 위치를 찾는 단서로 쓰세요.</li>
      </ul>
      ${finderCta("집하장 주소 찾기")}
    </section>

    <section class="notice" aria-labelledby="site-title">
      <h2 id="site-title">집하장에 도착하면</h2>
      <ul>
        <li>칸이나 표지판이 있으면 그대로 나눠 둡니다.</li>
        <li>생활 쓰레기, 폐가전, 남은 농약은 두고 오지 않습니다. 지자체가 정한 장소와 방법이 아닌 곳에 폐기물을 버리는 일은 폐기물관리법 제8조가 금지합니다.</li>
        <li>집하장이 없어졌거나 주소가 다르면 <a href="/contact/">정정 요청</a>으로 알려 주세요. 원자료 자체의 수정은 제공기관에 전달해야 합니다.</li>
      </ul>
    </section>`
  },
  {
    route: "/guide/no-burning/",
    title: "폐비닐·농자재를 밭에서 태우거나 묻으면: 폐기물관리법 기준 | 영농폐기물 집하장 지도",
    description: "폐비닐과 농자재를 밭에서 태우거나 묻는 행위에 대한 폐기물관리법 제8조·제68조 기준과 과태료, 대신 이용할 수거 체계를 국가법령정보센터 원문으로 정리했습니다.",
    h1: "폐비닐을 태우거나 묻으면 안 되는 이유",
    lead: "폐비닐과 농약 빈 용기는 집하장에 모으면 수거해 가고 보상금도 받을 수 있습니다. 태우거나 묻으면 법 위반이 될 수 있고, 재활용할 자원도 사라집니다.",
    sources: [SRC.wasteLaw8, SRC.wasteLaw68, SRC.keco],
    body: `
    <section class="box" aria-labelledby="law-title">
      <h2 id="law-title">법은 이렇게 정합니다</h2>
      <p>아래는 국가법령정보센터의 폐기물관리법(2026년 9월 18일 시행)을 2026-10-26에 확인한 내용을 쉽게 풀어 쓴 것입니다.</p>
      <ul class="item-list">
        <li><h3>제8조 제1항</h3><p>누구든지 시장·군수·구청장 등이 폐기물 수집을 위해 마련한 장소나 설비가 아닌 곳에 폐기물을 버리거나, 조례로 정한 방법을 따르지 않고 생활폐기물을 버려서는 안 됩니다.</p></li>
        <li><h3>제8조 제2항</h3><p>누구든지 이 법에 따라 허가·승인을 받거나 신고한 폐기물처리시설이 아닌 곳에서 폐기물을 매립하거나 소각해서는 안 됩니다. 다만 제14조 제1항 단서에 따라 지정된 지역에서 조례로 정하는 바에 따라 소각하는 경우는 예외입니다.</p></li>
        <li><h3>제68조 제3항 제1호</h3><p>제8조 제1항 또는 제2항을 위반해 생활폐기물을 버리거나 매립 또는 소각한 자에게는 100만원 이하의 과태료를 부과합니다.</p></li>
      </ul>
      <p>예외 지역에 해당하는지, 어떤 경우가 위반인지는 이 사이트가 판단할 수 없습니다. 궁금하면 시·군 환경 담당 부서에 직접 확인하세요. 이 페이지는 법률 자문이 아닙니다.</p>
    </section>

    <section class="box" aria-labelledby="instead-title">
      <h2 id="instead-title">태우는 대신 이렇게</h2>
      <ol class="steps-list">
        <li>흙과 잡초를 털고 하우스·멀칭 비닐을 나눠 묶습니다. → <a href="/guide/vinyl/">폐비닐 배출 방법</a></li>
        <li>농약 빈 용기는 재질별로 나눕니다. → <a href="/guide/pesticide-containers/">농약 빈 용기 배출 방법</a></li>
        <li>마을 공동집하장에 모아 두면 한국환경공단 수거사업소가 지역별 일정에 따라 수거합니다. 폐비닐은 지자체가, 농약 빈 용기는 공단이 보상금이나 수거비를 지급합니다.</li>
      </ol>
      ${finderCta("가까운 집하장 주소 찾기")}
    </section>

    <section class="box" aria-labelledby="recycle-title">
      <h2 id="recycle-title">모은 폐비닐은 다시 쓰입니다</h2>
      <p>한국환경공단은 수거한 영농 폐비닐을 자체 재활용시설에서 파쇄·세척해 재활용하고 국내외 재활용업체에 공급한다고 안내합니다. 공단이 안내하는 폐비닐 재활용시설은 안동, 담양, 시화, 정읍, 안성, 성주, 의령 7곳입니다.</p>
      <p>고춧대·깻대 같은 작물 줄기(영농부산물) 처리는 이 안내의 범위가 아닙니다. 시·군 농업기술센터나 읍·면사무소의 안내를 확인하세요.</p>
    </section>`
  }
];
