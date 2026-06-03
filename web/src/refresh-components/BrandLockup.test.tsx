import { render, screen } from "@tests/setup/test-utils";
import { SettingsContext } from "@/providers/SettingsProvider";
import { CombinedSettings, EnterpriseSettings } from "@/interfaces/settings";
import BrandLockup from "./BrandLockup";

function renderWithSettings(
  ui: React.ReactElement,
  enterpriseSettings: Partial<EnterpriseSettings> | null = null
) {
  return render(
    <SettingsContext.Provider
      value={{ enterpriseSettings } as CombinedSettings}
    >
      {ui}
    </SettingsContext.Provider>
  );
}

describe("BrandLockup", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders default STC logo and name", () => {
    renderWithSettings(<BrandLockup size={36} />);

    expect(screen.getByAltText("STC Presales Sandbox logo")).toHaveAttribute(
      "src",
      "/branding/stc-logo.png"
    );
    expect(screen.getByText("STC Presales Sandbox")).toBeInTheDocument();
  });

  test("renders custom enterprise application name", () => {
    renderWithSettings(
      <BrandLockup size={36} />,
      {
        application_name: "Customer Portal",
        use_custom_logo: false,
        logo_display_style: null,
        hide_onyx_branding: null,
      }
    );

    expect(screen.getByText("Customer Portal")).toBeInTheDocument();
  });

  test("honors logo_only display style", () => {
    renderWithSettings(
      <BrandLockup size={36} />,
      {
        application_name: "Customer Portal",
        use_custom_logo: false,
        logo_display_style: "logo_only",
        hide_onyx_branding: null,
      }
    );

    expect(screen.getByAltText("STC Presales Sandbox logo")).toBeInTheDocument();
    expect(screen.queryByText("Customer Portal")).not.toBeInTheDocument();
  });

  test("honors name_only display style", () => {
    renderWithSettings(
      <BrandLockup size={36} />,
      {
        application_name: "Customer Portal",
        use_custom_logo: false,
        logo_display_style: "name_only",
        hide_onyx_branding: null,
      }
    );

    expect(
      screen.queryByAltText("STC Presales Sandbox logo")
    ).not.toBeInTheDocument();
    expect(screen.getByText("Customer Portal")).toBeInTheDocument();
  });
});
