# STC Presales Sandbox Docker Compose Guide

This guide is for running the STC-branded Onyx UI with Docker Compose. It uses
the standard Onyx backend services and overrides only the web UI image.

## Prerequisites

- Docker Desktop or Docker Engine with Docker Compose v2.
- Access to the STC fork:
  `https://github.com/moabdelmoez/onyx-stcs`.
- Access to the published STC web image:
  `moabdelmoez/onyx-web-server:stc-presales-sandbox`.

## 1. Clone the Repository

```bash
git clone https://github.com/moabdelmoez/onyx-stcs.git
cd onyx-stcs/deployment/docker_compose
```

If you already cloned the repo, pull the latest `main` branch before starting:

```bash
git pull origin main
cd deployment/docker_compose
```

## 2. Create the Environment File

Copy the template into `.env`:

```bash
cp env.template .env
```

Edit `.env` and add these values near the top, under `IMAGE_TAG=latest`:

```env
ONYX_WEB_SERVER_IMAGE=moabdelmoez/onyx-web-server:stc-presales-sandbox
SANDBOX_BACKEND=local
```

`ONYX_WEB_SERVER_IMAGE` tells Docker Compose to use the STC-branded frontend.
`SANDBOX_BACKEND=local` prevents the backend from starting with the unsupported
Compose default that caused `api_server` to restart.

Do not put these values directly in `docker-compose.yml`. Keep machine-specific
configuration in `.env`.

## 3. Start the Stack

For local laptop testing, use the dev overlay so the backend and web ports are
published to localhost:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

For a server deployment using the default Compose ports and nginx service, use:

```bash
docker compose up -d
```

If you changed `.env` after containers were already created, recreate the
services that read those variables:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --force-recreate api_server background web_server
```

## 4. Validate the Deployment

Check container health:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml ps api_server web_server
```

Expected result:

- `api_server` is `Up` and healthy, not restarting.
- `web_server` is `Up` and healthy.

Check backend health:

```bash
curl -i http://localhost:8080/health
```

Expected result:

```text
HTTP/1.1 200 OK
```

Open the UI:

```text
http://localhost:3000
```

Expected UI result:

- The logo is the STC purple/red diamond.
- The product name is `STC Presales Sandbox`.
- The sign-in or create-account screen loads without the backend-unavailable
  banner.

## Troubleshooting

### `api_server` is unhealthy or restarting

Inspect the logs:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml logs --tail=160 api_server
```

If the logs include this error:

```text
ValueError: 'docker' is not a valid SandboxBackend
```

then `.env` is missing:

```env
SANDBOX_BACKEND=local
```

Add it, then recreate the backend:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --force-recreate api_server background
```

### `curl http://localhost:8080/health` cannot connect

First confirm the dev overlay is running:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml ps api_server
```

The `docker-compose.dev.yml` overlay publishes port `8080` to localhost. Without
that overlay, the backend may be reachable only inside the Docker network.

### The browser shows "The backend is currently unavailable"

This usually means the web UI is healthy but cannot reach a healthy backend.
Check:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml ps api_server web_server
curl -i http://localhost:8080/health
```

Fix the backend first. The STC web image is not the cause if `web_server` is
healthy.

### The STC logo or name does not appear

Confirm `.env` contains the STC web image:

```bash
grep -n "ONYX_WEB_SERVER_IMAGE" .env
```

Expected result:

```text
ONYX_WEB_SERVER_IMAGE=moabdelmoez/onyx-web-server:stc-presales-sandbox
```

Then recreate the web service:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --force-recreate web_server
```

## Updating the STC UI Image

When a new STC UI image is pushed to Docker Hub with the same tag, pull and
recreate the web service:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml pull web_server
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --force-recreate web_server
```

For production-style server deployments without the dev overlay, run the same
commands without `-f docker-compose.dev.yml`.
