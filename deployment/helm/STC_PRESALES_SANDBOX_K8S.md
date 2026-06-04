# STC Presales Sandbox Kubernetes Guide

This guide is for running the STC-branded Onyx UI in a Kubernetes environment
with the Onyx Helm chart. It uses the standard Onyx backend services and
overrides only the web UI image, matching the Docker Compose
`ONYX_WEB_SERVER_IMAGE` setup.

## Prerequisites

- Kubernetes cluster access with `kubectl` configured.
- Helm 3 installed.
- Access to the STC fork:
  `https://github.com/moabdelmoez/onyx-stcs`.
- Access to the published STC web image:
  `moabdelmoez/onyx-web-server:stc-presales-sandbox`.
- Optional: a private values file for your environment if you need custom
  domain, storage, database, ingress, or external service configuration.

## 1. Clone the Repository

```bash
git clone https://github.com/moabdelmoez/onyx-stcs.git
cd onyx-stcs
```

If you already cloned the repo, pull the latest `main` branch before deploying:

```bash
git pull origin main
```

## 2. Prepare Helm Dependencies

```bash
helm dependency update deployment/helm/charts/onyx
```

## 3. Prepare the OpenSearch Secret

The committed `prod-values.yaml` points the chart at a Kubernetes Secret for
the OpenSearch admin credentials. Create that Secret before installing:

```bash
kubectl create namespace onyx --dry-run=client -o yaml | kubectl apply -f -

kubectl -n onyx create secret generic onyx-opensearch \
  --from-literal=opensearch_admin_username=admin \
  --from-literal=opensearch_admin_password='<replace-with-a-strong-password>'
```

The password must meet OpenSearch complexity requirements: at least 8
characters with uppercase, lowercase, digit, and special character.

If the Secret already exists, update it deliberately rather than recreating it
blindly:

```bash
kubectl -n onyx create secret generic onyx-opensearch \
  --from-literal=opensearch_admin_username=admin \
  --from-literal=opensearch_admin_password='<replace-with-a-strong-password>' \
  --dry-run=client -o yaml | kubectl apply -f -
```

## 4. Prepare Optional Environment Values

For a real domain or external services, create a private values file such as
`my-values.yaml`. Do not put cluster-specific values in the STC overlay. Keep
them in your environment file, for example:

```yaml
configMap:
  DOMAIN: "onyx.example.com"
  WEB_DOMAIN: "https://onyx.example.com"
```

If you are adapting a Docker Compose `.env`, do not copy Compose service
hostnames such as `api_server`, `cache`, or `inference_model_server`. The Helm
chart computes Kubernetes service names for those.

If your STC web image is private, configure `imagePullSecrets` in the same
environment values file.

## 5. Install or Upgrade Onyx with the STC UI

Apply the minimal production values first, then your optional environment values
if you have one, and keep the STC overlay last so it wins for the web image:

```bash
helm upgrade --install onyx deployment/helm/charts/onyx \
  -n onyx \
  -f deployment/helm/charts/onyx/prod-values.yaml \
  -f my-values.yaml \
  -f deployment/helm/charts/onyx/values-stc-presales.yaml
```

If you do not have a private environment values file yet, omit `-f
my-values.yaml`:

```bash
helm upgrade --install onyx deployment/helm/charts/onyx \
  -n onyx \
  -f deployment/helm/charts/onyx/prod-values.yaml \
  -f deployment/helm/charts/onyx/values-stc-presales.yaml
```

For a quick render-only check before installing:

```bash
helm template onyx deployment/helm/charts/onyx \
  -n onyx \
  -f deployment/helm/charts/onyx/prod-values.yaml \
  -f deployment/helm/charts/onyx/values-stc-presales.yaml \
  --show-only templates/webserver-deployment.yaml
```

The rendered `web-server` container should use:

```text
moabdelmoez/onyx-web-server:stc-presales-sandbox
```

## 6. Validate the Deployment

Check pod rollout:

```bash
kubectl -n onyx rollout status deployment/onyx-web-server
kubectl -n onyx rollout status deployment/onyx-api-server
kubectl -n onyx get pods
```

If you use the bundled nginx service, check the service:

```bash
kubectl -n onyx get svc
```

For a local smoke test through port-forwarding:

```bash
kubectl -n onyx port-forward svc/onyx-nginx 8080:80
```

Then open:

```text
http://localhost:8080
```

Expected UI result:

- The logo is the STC purple/red diamond.
- The product name is `STC Presales Sandbox`.
- The sign-in or create-account screen loads without the backend-unavailable
  banner.

## Updating the STC UI Image

The STC overlay uses:

```yaml
webserver:
  image:
    full: "moabdelmoez/onyx-web-server:stc-presales-sandbox"
```

For immutable production rollouts, deploy a commit-specific image tag:

```bash
helm upgrade --install onyx deployment/helm/charts/onyx \
  -n onyx \
  -f deployment/helm/charts/onyx/prod-values.yaml \
  -f deployment/helm/charts/onyx/values-stc-presales.yaml \
  --set webserver.image.full=moabdelmoez/onyx-web-server:stc-presales-sandbox-<commit-sha>
```

Add `-f my-values.yaml` before the STC overlay if you use a private
environment values file.

Restart only the web deployment after changing the image:

```bash
kubectl -n onyx rollout restart deployment/onyx-web-server
kubectl -n onyx rollout status deployment/onyx-web-server
```

## Troubleshooting

### STC Branding Does Not Appear

Confirm Helm rendered the STC image:

```bash
helm get manifest onyx -n onyx | grep -n "moabdelmoez/onyx-web-server"
```

If it does not appear, re-run `helm upgrade` with
`values-stc-presales.yaml` after your environment-specific values file.

### Web Pod Cannot Pull the Image

Check pod events:

```bash
kubectl -n onyx describe pod -l app=web-server
```

If the error is `ImagePullBackOff` or `ErrImagePull`, confirm the tag exists
and configure `imagePullSecrets` if the registry requires authentication.

### Browser Shows Backend Unavailable

The STC image only changes the frontend. Check backend health first:

```bash
kubectl -n onyx get pods
kubectl -n onyx logs deploy/onyx-api-server --tail=160
```

Also confirm `DOMAIN` and `WEB_DOMAIN` are correct in your values file.
