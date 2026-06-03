# STC Local UI Testing Guide

This guide explains how to run the Onyx backend locally with Docker Compose and
test the STC UI theme from the local `web/` project.

Use this workflow when you are changing frontend/theme code and want hot reload
from `bun run dev`.

## What Runs Where

- Docker Compose runs the backend and dependencies:
  - `api_server`
  - `background`
  - PostgreSQL
  - Redis
  - OpenSearch
  - model servers
  - MinIO, when `COMPOSE_PROFILES=s3-filestore`
- The local machine runs the frontend:
  - Next.js from `web/`
  - available at `http://localhost:3000`
- The frontend proxies backend API calls to:
  - `http://localhost:8080`

## Prerequisites

- Docker Desktop or Docker Engine with Docker Compose v2.
- Bun installed.
- The repository cloned locally.
- The STC `.env` values configured in `deployment/docker_compose/.env`.

From the repo root:

```bash
cd "/Users/mostafa/Downloads/Coding_Projects/onyx - stcs/onyx"
```

## 1. Check the Compose Environment

Go to the Docker Compose directory:

```bash
cd deployment/docker_compose
```

Check the important `.env` values:

```bash
rg -n "^(IMAGE_TAG|SANDBOX_BACKEND|AUTH_TYPE|COMPOSE_PROFILES|FILE_STORE_BACKEND|ONYX_WEB_SERVER_IMAGE)=" .env
```

Expected values for this STC local setup:

```env
IMAGE_TAG=latest
SANDBOX_BACKEND=local
AUTH_TYPE=basic
COMPOSE_PROFILES=s3-filestore
FILE_STORE_BACKEND=s3
ONYX_WEB_SERVER_IMAGE=moabdelmoez/onyx-web-server:stc-presales-sandbox
```

`SANDBOX_BACKEND=local` is important. Without it, the backend may restart with:

```text
ValueError: 'docker' is not a valid SandboxBackend
```

## 2. Start the Local Backend

Start the backend services with the development Compose overlay:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml --profile s3-filestore up -d --wait api_server background
```

The dev overlay publishes the backend on `localhost:8080`.

First startup can take several minutes because Docker may need to pull images,
run database migrations, and download model assets.

## 3. Validate the Backend

Check container status:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml ps
```

Check backend health:

```bash
curl -i http://localhost:8080/health
```

Expected result:

```text
HTTP/1.1 200 OK
```

If the health check fails, inspect the API logs:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml logs --tail=160 api_server
```

## 4. Stop Docker Web Services if Needed

For local theme development, port `3000` should be free for `bun run dev`.

If Docker nginx or `web_server` is running, stop them:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml stop nginx web_server
```

This keeps the backend running and frees `http://localhost:3000` for the local
Next.js dev server.

## 5. Start the Local Frontend

Open a second terminal and go to the web project:

```bash
cd "/Users/mostafa/Downloads/Coding_Projects/onyx - stcs/onyx/web"
```

Install dependencies if needed:

```bash
bun install
```

Start the dev server:

```bash
bun run dev
```

Open the UI:

```text
http://localhost:3000
```

By default, the local frontend connects to the backend at
`http://localhost:8080`.

## 6. Log In

If the local database already has the test user, use:

```text
Email: a@example.com
Password: a
```

If this is a fresh database, create the first account from the signup screen.
The first account is usually created as the admin user.

## 7. Test the STC Theme

After the frontend is running, verify:

- The STC theme loads on `http://localhost:3000`.
- API calls under `/api/*` succeed.
- The app does not show the backend unavailable banner.
- Login or signup works.
- Theme changes hot reload when editing files in `web/`.

Useful browser paths:

```text
http://localhost:3000
http://localhost:3000/app
http://localhost:3000/admin
```

## Troubleshooting

### Docker Permission Error

If Docker commands fail with a socket permission error, make sure Docker Desktop
is running and that your terminal can access Docker:

```bash
docker compose version
docker ps
```

### Backend Health Fails

Check the API server logs:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml logs --tail=160 api_server
```

If the logs mention `SandboxBackend`, confirm:

```bash
rg -n "^SANDBOX_BACKEND=" .env
```

Expected:

```env
SANDBOX_BACKEND=local
```

Then recreate the backend containers:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --force-recreate api_server background
```

### Frontend Shows Backend Unavailable

Confirm the backend is reachable:

```bash
curl -i http://localhost:8080/health
```

Confirm the frontend is running locally:

```text
http://localhost:3000
```

If you created or changed `web/.env.local`, restart `bun run dev`.

### Port 3000 Is Already Used

Stop Docker nginx and Docker web:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml stop nginx web_server
```

Then restart the frontend:

```bash
cd "/Users/mostafa/Downloads/Coding_Projects/onyx - stcs/onyx/web"
bun run dev
```

### STC Branding Does Not Appear

If you are testing the published Docker web image, confirm:

```bash
rg -n "^ONYX_WEB_SERVER_IMAGE=" .env
```

Expected:

```env
ONYX_WEB_SERVER_IMAGE=moabdelmoez/onyx-web-server:stc-presales-sandbox
```

If you are testing local frontend code, the Docker web image is not used.
Check the local files under `web/` instead.

## Optional: Run the Full Docker STC UI

Use this when you want to test the published STC web image instead of local
frontend code:

```bash
cd "/Users/mostafa/Downloads/Coding_Projects/onyx - stcs/onyx/deployment/docker_compose"
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --wait
```

Open:

```text
http://localhost:3000
```

To pull a newly published STC image and recreate the web service:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml pull web_server
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --force-recreate web_server
```

## Shutdown

Stop the stack without deleting volumes:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml down
```

Delete containers and volumes only when you want a fresh database:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml down -v
```
