# 영농폐기물 집하장 지도

https://sumimap.com/ — 한국환경공단 공개자료(2025-08-27 기준, 9,553행)로 영농폐기물 공동집하장 주소를 시·도 → 시·군·구 → 읍·면·동 순서로 찾고, 품목별 배출 방법을 공식 안내로 정리한 정적 사이트입니다. 운영: 제이 미디어(J MEDIA, 보리장터 운영사).

## 구조

- `/` 홈: 검색창과 시·도 바로가기
- `/kr/farm-waste-collection/` 찾기 도구 (`site/assets/finder-*.js`, 시·도별 JSON `site/data/farm-waste/<기준일>/`)
- `/kr/` 시·도별 목록, `/kr/<slug>/` 시·도 페이지(주소 20건 이상인 시·도만, 나머지는 `/kr/`에 전체 주소 표기)
- `/guide/` 배출 방법 안내 7쪽 (근거: `scripts/lib/sources.mjs`)
- `/about/`, `/sources/`, `/editorial/`, `/policy/`, `/contact/`, `/privacy/`, `/terms/`
- 예전 일본 생활 지도 경로(`/japan/`, `/routes/`, `/cities/`, `/spots/` 등)는 `functions/_middleware.js`가 410 안내로 응답합니다.

## 빌드와 검증

```bash
npm run check   # 데이터 해시 검증 → JSON·페이지·sitemap 생성 → 콘텐츠 점검 → 정적 점검
npm run check:links   # /sources/ 외부 링크 상태 확인(네트워크 필요)
```

- 페이지는 `scripts/generate-core-pages.mjs`가 만듭니다. HTML을 직접 고치지 말고 생성 스크립트(`scripts/lib/*.mjs`)를 고친 뒤 `npm run build`를 실행하세요.
- `site/assets/*`와 `site/data/farm-waste/*`는 1년 캐시입니다. 내용을 바꾸면 파일 이름의 날짜(예: `finder-20261026.js`, 같은 날 다시 바꾸면 `finder-2026102602.js`처럼 숫자를 붙임)를 바꾸고 `scripts/lib/layout.mjs`와 `site/sw.js`(캐시 이름 포함)를 함께 고치세요.
- 원자료 재생성 방법과 해시는 `docs/data-sources/farm-waste-collection-2025.md`에 있습니다.

## 배포

GitHub `main` → Cloudflare Pages(출력 디렉터리 `site`). 생성된 파일을 함께 커밋합니다.
