import { EnterpriseSettings } from "@/interfaces/settings";
import {
  DEFAULT_BRAND,
  ENTERPRISE_LOGO_PATH,
  resolveBrand,
} from "./defaultBrand";

function makeEnterpriseSettings(
  overrides: Partial<EnterpriseSettings> = {}
): EnterpriseSettings {
  return {
    application_name: null,
    use_custom_logo: false,
    use_custom_logotype: false,
    logo_display_style: null,
    custom_nav_items: [],
    custom_lower_disclaimer_content: null,
    custom_header_content: null,
    two_lines_for_chat_header: null,
    custom_popup_header: null,
    custom_popup_content: null,
    enable_consent_screen: null,
    consent_screen_prompt: null,
    show_first_visit_notice: null,
    custom_greeting_message: null,
    custom_help_link_url: null,
    custom_help_link_label: null,
    hide_onyx_branding: null,
    ...overrides,
  };
}

describe("resolveBrand", () => {
  test("returns Presales GPT defaults without enterprise settings", () => {
    const brand = resolveBrand(null, 123);

    expect(brand.applicationName).toBe("Presales GPT");
    expect(brand.logoAlt).toBe("Presales GPT logo");
    expect(brand.logoSrc).toBe(DEFAULT_BRAND.logoPath);
    expect(brand.faviconSrc).toBe(DEFAULT_BRAND.faviconPath);
    expect(brand.logoDisplayStyle).toBe("logo_and_name");
    expect(brand.isCustomLogo).toBe(false);
    expect(brand.isDefaultBrand).toBe(true);
    expect(brand.shouldHidePoweredBy).toBe(true);
  });

  test("uses custom enterprise application name", () => {
    const brand = resolveBrand(
      makeEnterpriseSettings({ application_name: "Customer Portal" }),
      123
    );

    expect(brand.applicationName).toBe("Customer Portal");
    expect(brand.logoSrc).toBe(DEFAULT_BRAND.logoPath);
    expect(brand.logoAlt).toBe(DEFAULT_BRAND.logoAlt);
    expect(brand.isDefaultBrand).toBe(false);
    expect(brand.shouldHidePoweredBy).toBe(false);
  });

  test("uses custom enterprise logo URL with cache buster", () => {
    const brand = resolveBrand(
      makeEnterpriseSettings({ use_custom_logo: true }),
      456
    );

    expect(brand.logoSrc).toBe(`${ENTERPRISE_LOGO_PATH}?v=456`);
    expect(brand.faviconSrc).toBe(`${ENTERPRISE_LOGO_PATH}?v=456`);
    expect(brand.isCustomLogo).toBe(true);
    expect(brand.isDefaultBrand).toBe(false);
  });

  test("uses custom enterprise logo URL without cache buster", () => {
    const brand = resolveBrand(
      makeEnterpriseSettings({ use_custom_logo: true })
    );

    expect(brand.logoSrc).toBe(ENTERPRISE_LOGO_PATH);
    expect(brand.faviconSrc).toBe(ENTERPRISE_LOGO_PATH);
  });

  test("uses generic alt text for custom logo without application name", () => {
    const brand = resolveBrand(
      makeEnterpriseSettings({ use_custom_logo: true })
    );

    expect(brand.logoAlt).toBe("Application logo");
  });

  test("uses custom application name in custom logo alt text", () => {
    const brand = resolveBrand(
      makeEnterpriseSettings({
        application_name: "Customer Portal",
        use_custom_logo: true,
      })
    );

    expect(brand.logoAlt).toBe("Customer Portal logo");
  });

  test("preserves configured display style", () => {
    const brand = resolveBrand(
      makeEnterpriseSettings({ logo_display_style: "logo_only" }),
      123
    );

    expect(brand.logoDisplayStyle).toBe("logo_only");
  });

  test("honors enterprise hide branding toggle", () => {
    const brand = resolveBrand(
      makeEnterpriseSettings({
        application_name: "Customer Portal",
        hide_onyx_branding: true,
      }),
      123
    );

    expect(brand.shouldHidePoweredBy).toBe(true);
  });
});
