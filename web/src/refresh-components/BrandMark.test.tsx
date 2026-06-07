import { render, screen } from "@tests/setup/test-utils";
import { SettingsContext } from "@/providers/SettingsProvider";
import { CombinedSettings, EnterpriseSettings } from "@/interfaces/settings";
import BrandMark from "./BrandMark";

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

describe("BrandMark", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders the default STC logo without circular crop", () => {
    renderWithSettings(<BrandMark size={40} />);

    const wrapper = screen.getByTestId("brand-mark");
    const image = screen.getByAltText("Presales GPT logo");

    expect(wrapper).toHaveStyle({ width: "40px", height: "40px" });
    expect(wrapper).not.toHaveClass("rounded-full");
    expect(image).toHaveAttribute("src", "/branding/stc-logo.png");
    expect(image).toHaveClass("object-contain");
  });

  test("renders enterprise custom logo with circular crop when requested", () => {
    renderWithSettings(<BrandMark size={32} cropToCircle />, {
      application_name: "Customer Portal",
      use_custom_logo: true,
      logo_display_style: null,
      hide_onyx_branding: null,
    });

    const wrapper = screen.getByTestId("brand-mark");
    const image = screen.getByAltText("Customer Portal logo");

    expect(wrapper).toHaveClass("rounded-full");
    expect(image).toHaveAttribute("alt", "Customer Portal logo");
    expect(image.getAttribute("src")).toContain(
      "/api/enterprise-settings/logo"
    );
    expect(image).toHaveClass("object-cover");
  });
});
