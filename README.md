# Zeon x402 Mint API

Minimal Express server exposing `/api/mint` for Zeon x402 Protocol.

## Endpoints
- `GET /` — Health check.
- `POST /api/mint` — Returns Zeon mint payload.

## Local run
```bash
npm install
npm start
```

## Deploy on Railway
- New Project → **GitHub Repository** → select your repo.
- Railway auto-detects `npm start` and deploys.
- Your URL: `https://<app>.up.railway.app/api/mint`
