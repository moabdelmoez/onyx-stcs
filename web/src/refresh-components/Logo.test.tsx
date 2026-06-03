import { render, screen } from "@tests/setup/test-utils";
import Logo from "./Logo";

const mockUseSettingsContext = jest.fn();

jest.mock("@/providers/SettingsProvider", () => ({
  useSettingsContext: () => mockUseSettingsContext(),
}));

jest.mock("@/lib/constants", () => ({
  DEFAULT_LOGO_SIZE_PX: 24,
  NEXT_PUBLIC_DO_NOT_USE_TOGGLE_OFF_DANSWER_POWERED: false,
}));

describe("Logo", () => {
  beforeEach(() => {
    mockUseSettingsContext.mockReturnValue({ enterpriseSettings: null });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders default STC logo and name", () => {
    render(<Logo size={28} />);

    expect(screen.getByAltText("STC Presales Sandbox logo")).toHaveAttribute(
      "src",
      "/branding/stc-logo.png"
    );
    expect(screen.getAllByText("STC Presales Sandbox")).not.toHaveLength(0);
  });

  test("does not render Powered by Onyx for default STC shell", () => {
    render(<Logo size={28} />);

    expect(screen.queryByText("Powered by Onyx")).not.toBeInTheDocument();
  });

  test("renders custom enterprise application name", () => {
    mockUseSettingsContext.mockReturnValue({
      enterpriseSettings: {
        application_name: "Customer Portal",
        use_custom_logo: false,
        logo_display_style: "logo_and_name",
        hide_onyx_branding: null,
      },
    });

    render(<Logo size={28} />);

    expect(screen.getAllByText("Customer Portal")).not.toHaveLength(0);
  });

  test("renders custom enterprise logo with circular crop", () => {
    mockUseSettingsContext.mockReturnValue({
      enterpriseSettings: {
        application_name: "Customer Portal",
        use_custom_logo: true,
        logo_display_style: "logo_and_name",
        hide_onyx_branding: true,
      },
    });

    render(<Logo size={28} />);

    const image = screen.getByAltText("Customer Portal logo");
    expect(image.getAttribute("src")).toContain("/api/enterprise-settings/logo");
    expect(screen.getByTestId("brand-mark")).toHaveClass("rounded-full");
  });

  test("honors logo_only display style", () => {
    mockUseSettingsContext.mockReturnValue({
      enterpriseSettings: {
        application_name: "Customer Portal",
        use_custom_logo: false,
        logo_display_style: "logo_only",
        hide_onyx_branding: null,
      },
    });

    render(<Logo size={28} />);

    expect(screen.getByAltText("STC Presales Sandbox logo")).toBeInTheDocument();
    expect(screen.queryByText("Customer Portal")).not.toBeInTheDocument();
  });

  test("honors name_only display style", () => {
    mockUseSettingsContext.mockReturnValue({
      enterpriseSettings: {
        application_name: "Customer Portal",
        use_custom_logo: false,
        logo_display_style: "name_only",
        hide_onyx_branding: null,
      },
    });

    render(<Logo size={28} />);

    expect(screen.queryByAltText("STC Presales Sandbox logo")).not.toBeInTheDocument();
    expect(screen.getAllByText("Customer Portal")).not.toHaveLength(0);
  });
});
