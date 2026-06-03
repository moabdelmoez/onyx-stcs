# STC Presales Sandbox UI Theme Design

Date: 2026-06-03

## Goal

Customize the Onyx web UI for the STC presales sandbox without changing backend behavior, data models, API semantics, docs, package names, or internal Onyx identifiers.

The default visible web brand should become:

- Application name: `STC Presales Sandbox`
- Main logo: the provided logo image, preserved as an uncropped transparent mark
- Theme: restrained STC accents using the logo's purple as the primary accent and red/pink as a supporting accent

## Current Codebase Findings

The repository root is `onyx/` inside the workspace. The visible web app is a Next.js app under `web/`.

The top-level homepage route, `web/src/app/page.tsx`, redirects to `/app`. The visible home surface is the authenticated app shell at `/app`, backed by `web/src/app/app/page.tsx` and `web/src/refresh-pages/AppPage.tsx`.

Shared app branding mostly flows through `web/src/refresh-components/Logo.tsx`, which reads `enterpriseSettings` from `web/src/providers/SettingsProvider.tsx`. Browser title and favicon are handled by `web/src/providers/DynamicMetadata.tsx`.

The app already has Enterprise Appearance settings:

- frontend: `web/src/app/ee/admin/theme/page.tsx`
- frontend settings UI: `web/src/app/ee/admin/theme/AppearanceThemeSettings.tsx`
- backend API: `backend/ee/onyx/server/enterprise_settings/api.py`
- backend store: `backend/ee/onyx/server/enterprise_settings/store.py`

Those settings should continue to override the repo-level STC defaults when an admin configures custom branding.

The theme palette is controlled by Opal CSS variables imported through `web/src/app/globals.css`. The app can override variables after importing Opal CSS without editing Opal's base design system files.

## Decisions

1. Make STC branding a repo-level UI default for this sandbox.
2. Keep existing admin Appearance settings higher priority than the STC defaults.
3. Apply STC default branding to shared visible web UI surfaces:
   - `/app` welcome state
   - app/admin/Craft sidebars that use shared branding
   - browser title and favicon
   - loading screens using shared branding
   - auth and visible error pages where they currently hardcode Onyx logos
4. Do not rename backend services, API names, database values, docs links, package names, or internal code identifiers.
5. Hide the visible `Powered by Onyx` tagline for the STC default shell.
6. Preserve the supplied logo geometry. Do not crop it into the existing circular custom-logo treatment.
7. Use restrained global STC accents in both light and dark mode. Preserve neutral backgrounds and semantic status colors.

## Proposed Architecture

Add a small shared default-brand layer for web UI defaults.

Expected files:

- `web/src/lib/branding/defaultBrand.ts`
- `web/src/refresh-components/Logo.tsx`
- `web/src/providers/DynamicMetadata.tsx`
- `web/src/app/globals.css`
- `web/src/app/css/stc-theme.css`
- visible logo consumers that bypass `Logo.tsx`, including at least:
  - `web/src/components/auth/AuthFlowContainer.tsx`
  - `web/src/components/errorPages/ErrorPageLayout.tsx`
  - `web/src/app/craft/components/IntroContent.tsx`

Expected assets:

- keep workspace root `logo.jpg` unchanged
- add `web/public/branding/stc-logo.png`
- add favicon-ready assets under `web/public/branding/` when the implementation needs a dedicated browser favicon file

The default-brand layer should centralize:

- `DEFAULT_APPLICATION_NAME = "STC Presales Sandbox"`
- default logo path
- default favicon path
- default decision to hide the Onyx-powered tagline

## Brand Resolution Rules

`Logo.tsx` should resolve display as follows:

1. If enterprise settings specify a custom logo, use `/api/enterprise-settings/logo` with the existing cache-buster behavior.
2. If enterprise settings specify a custom application name, use that name.
3. If no custom enterprise name/logo exists, use the STC default name and logo.
4. Honor `logo_display_style` when enterprise settings provide it.
5. For the STC default logo, render an uncropped image with object-fit containment, not a rounded full mask.
6. For the STC default shell, suppress the `Powered by Onyx` tagline.

`DynamicMetadata.tsx` should set:

- title to the enterprise app name when configured, otherwise `STC Presales Sandbox`
- favicon to the enterprise custom logo when configured, otherwise the STC favicon asset

Visible components that directly import Onyx logo SVGs should be routed through the shared brand layer when they are part of auth, error, or onboarding-like UI surfaces. Internal provider icons and product-specific feature names can remain unchanged.

## Theme Design

Add `web/src/app/css/stc-theme.css` and import it from `web/src/app/globals.css` after the existing CSS imports.

The file should override a narrow set of CSS variables:

- `--theme-primary-06`
- `--theme-primary-05`
- `--theme-primary-04`
- selected `--action-link-*`
- selected tint or accent helpers only when required for selected and focus surfaces to remain visually coherent

Use the logo purple as primary and red/pink as a supporting accent. Keep:

- neutral backgrounds
- text contrast model
- success, warning, error, and info status semantics
- existing light/dark mode structure

Dark mode should use contrast-safe accent values without turning the UI into a full purple theme.

## Non-Goals

This work will not:

- alter backend behavior
- alter database schemas or migrations
- seed or mutate runtime database settings
- rename source packages, API routes, docs, or deployment files
- change chat, search, indexing, auth, or billing behavior
- replace existing Onyx public assets in place unless a visible web consumer is deliberately moved to the new shared brand path

## Validation Plan

Run focused web checks from `web/`:

```bash
bun run types:check
bun run lint
```

Then run or reuse the local web app at `http://localhost:3000` and verify in browser:

- `/app` welcome shows the STC logo and expected default brand behavior
- sidebar shows `STC Presales Sandbox` and does not show `Powered by Onyx`
- browser title is `STC Presales Sandbox`
- favicon uses the STC logo asset
- auth/login screen uses STC visible branding
- light and dark modes both preserve readable STC accent colors
- admin-configured enterprise branding still overrides the STC default if present

Playwright welcome visual specs are not required for the initial validation unless implementation risk grows.
