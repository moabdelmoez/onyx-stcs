import { render, screen } from "@tests/setup/test-utils";
import { SettingsContext } from "@/providers/SettingsProvider";
import { CombinedSettings, EnterpriseSettings } from "@/interfaces/settings";
import Logo from "./Logo";

jest.mock("@/lib/constants", () => ({
  DEFAULT_LOGO_SIZE_PX: 24,
  NEXT_PUBLIC_DO_NOT_USE_TOGGLE_OFF_DANSWER_POWERED: false,
}));

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

describe("Logo", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders default STC logo and name", () => {
    renderWithSettings(<Logo size={28} />);

    expect(screen.getByAltText("Presales GPT logo")).toHaveAttribute(
      "src",
      "/branding/stc-logo.png"
    );
    expect(screen.getAllByText("Presales GPT")).not.toHaveLength(0);
  });

  test("does not render Powered by Onyx for default STC shell", () => {
    renderWithSettings(<Logo size={28} />);

    expect(screen.queryByText("Powered by Onyx")).not.toBeInTheDocument();
  });

  test("renders custom enterprise application name", () => {
    renderWithSettings(<Logo size={28} />, {
      application_name: "Customer Portal",
      use_custom_logo: false,
      logo_display_style: "logo_and_name",
      hide_onyx_branding: null,
    });

    expect(screen.getAllByText("Customer Portal")).not.toHaveLength(0);
  });

  test("renders custom enterprise logo with circular crop", () => {
    renderWithSettings(<Logo size={28} />, {
      application_name: "Customer Portal",
      use_custom_logo: true,
      logo_display_style: "logo_and_name",
      hide_onyx_branding: true,
    });

    const image = screen.getByAltText("Customer Portal logo");
    expect(image.getAttribute("src")).toContain(
      "/api/enterprise-settings/logo"
    );
    expect(screen.getByTestId("brand-mark")).toHaveClass("rounded-full");
  });

  test("honors logo_only display style", () => {
    renderWithSettings(<Logo size={28} />, {
      application_name: "Customer Portal",
      use_custom_logo: false,
      logo_display_style: "logo_only",
      hide_onyx_branding: null,
    });

    expect(
      screen.getByAltText("Presales GPT logo")
    ).toBeInTheDocument();
    expect(screen.queryByText("Customer Portal")).not.toBeInTheDocument();
  });

  test("honors name_only display style", () => {
    renderWithSettings(<Logo size={28} />, {
      application_name: "Customer Portal",
      use_custom_logo: false,
      logo_display_style: "name_only",
      hide_onyx_branding: null,
    });

    expect(
      screen.queryByAltText("Presales GPT logo")
    ).not.toBeInTheDocument();
    expect(screen.getAllByText("Customer Portal")).not.toHaveLength(0);
  });
});
