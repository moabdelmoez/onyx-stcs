import { EnterpriseSettings } from "@/interfaces/settings";

export const ENTERPRISE_LOGO_PATH = "/api/enterprise-settings/logo";

export const DEFAULT_BRAND = {
  applicationName: "Presales GPT",
  logoPath: "/branding/stc-logo.png",
  faviconPath: "/branding/stc-favicon.png",
  logoAlt: "Presales GPT logo",
  hidePoweredBy: true,
} as const;

export interface ResolvedBrand {
  applicationName: string;
  logoSrc: string;
  faviconSrc: string;
  logoAlt: string;
  logoDisplayStyle: NonNullable<EnterpriseSettings["logo_display_style"]>;
  isCustomLogo: boolean;
  isDefaultBrand: boolean;
  shouldHidePoweredBy: boolean;
}

function appendCacheBuster(path: string, cacheBuster?: number): string {
  return cacheBuster == null ? path : `${path}?v=${cacheBuster}`;
}

function getCustomApplicationName(
  enterpriseSettings: EnterpriseSettings | null | undefined
): string | null {
  const value = enterpriseSettings?.application_name?.trim();
  return value ? value : null;
}

function getLogoAlt(
  customApplicationName: string | null,
  isCustomLogo: boolean
): string {
  if (!isCustomLogo) {
    return DEFAULT_BRAND.logoAlt;
  }

  return customApplicationName
    ? `${customApplicationName} logo`
    : "Application logo";
}

export function resolveBrand(
  enterpriseSettings: EnterpriseSettings | null | undefined,
  cacheBuster?: number
): ResolvedBrand {
  const customApplicationName = getCustomApplicationName(enterpriseSettings);
  const isCustomLogo = enterpriseSettings?.use_custom_logo === true;
  const isDefaultBrand = !customApplicationName && !isCustomLogo;
  const logoSrc = isCustomLogo
    ? appendCacheBuster(ENTERPRISE_LOGO_PATH, cacheBuster)
    : DEFAULT_BRAND.logoPath;

  return {
    applicationName: customApplicationName ?? DEFAULT_BRAND.applicationName,
    logoSrc,
    faviconSrc: isCustomLogo ? logoSrc : DEFAULT_BRAND.faviconPath,
    logoAlt: getLogoAlt(customApplicationName, isCustomLogo),
    logoDisplayStyle: enterpriseSettings?.logo_display_style ?? "logo_and_name",
    isCustomLogo,
    isDefaultBrand,
    shouldHidePoweredBy:
      enterpriseSettings?.hide_onyx_branding === true ||
      (isDefaultBrand && DEFAULT_BRAND.hidePoweredBy),
  };
}
