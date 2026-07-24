# Viral insight — web platform

Next.js web app for the social-media viral-insight project. It's the **web-platform**
module: it only talks to the **AI-server** (ml-platform) over HTTP, never to the model
directly.

A user enters a post (text + platform + optional audience), the app calls the
AI-server `/report` endpoint, and displays the viral score, the factors behind it, the
suggestions, and the generated report (EN/VI).

## Requirements

- Node.js 18+ and npm
- A running AI-server reachable from your machine (see `NEXT_PUBLIC_API_URL`)

## Setup

```bash
npm install
cp .env.local.example .env.local   # then edit NEXT_PUBLIC_API_URL if needed
npm run dev
```

Open http://localhost:3000.

`NEXT_PUBLIC_API_URL` points at the AI-server (default `http://100.70.0.2:8000`, the
Tailscale server). Swap it for the public URL once the AI-server is deployed publicly.

> Note: the browser calls the API directly, so the AI-server must allow CORS from the
> web app origin. The server already sets permissive CORS in dev; tighten it for prod.

## Structure

```
app/
  layout.tsx        root layout
  page.tsx          main analyze page (form + results)
  components.tsx    ScoreCard, FactorBars, ResultPanels
  globals.css       styling
lib/
  api.ts            AI-server client (analyze -> /report)
  types.ts          shared types (Prediction, Factor, ...)
```

## Deploy (Vercel)

1. Push this folder to its own GitHub repo.
2. Import the repo on vercel.com.
3. Set the env var `NEXT_PUBLIC_API_URL` to the public AI-server URL.
4. Deploy.

## Build

```bash
npm run build && npm start
```
