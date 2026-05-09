# 스미맵

일본 거주 한국인을 위한 모바일 우선 생활 제보 지도입니다.

## 실행

```bash
npm run serve
```

로컬 주소: `http://127.0.0.1:4192/`

## 배포 방향

- 프론트: Cloudflare Pages
- API: Cloudflare Pages Functions 또는 Workers
- DB: Cloudflare D1
- 이미지: Cloudflare R2
- 스팸 방지: Cloudflare Turnstile

초기 버전은 자유 댓글 없이 선택형 제보만 수집하도록 설계했습니다.

## 공유 제보 API

Cloudflare Pages Functions가 `/api/reports`를 제공합니다. Cloudflare Pages 프로젝트에 D1 바인딩 `REPORTS_DB`를 연결하고 `migrations/0001_reports.sql`을 적용하면, 한 사용자의 선택형 제보가 다른 사용자 지도에도 짧은 주기로 반영됩니다.
## Feedback API

`/api/feedback` stores quick bug reports, questions, and suggestions in the same D1 binding (`REPORTS_DB`). Apply `migrations/0002_feedback.sql` after the reports migration.