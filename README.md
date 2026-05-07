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
