import { render, screen } from "@tests/setup/test-utils";
import BrandMark from "./BrandMark";

const mockUseSettingsContext = jest.fn();

jest.mock("@/providers/SettingsProvider", () => ({
  useSettingsContext: () => mockUseSettingsContext(),
}));

describe("BrandMark", () => {
  beforeEach(() => {
    mockUseSettingsContext.mockReturnValue({ enterpriseSettings: null });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders the default STC logo without circular crop", () => {
    render(<BrandMark size={40} />);

    const wrapper = screen.getByTestId("brand-mark");
    const image = screen.getByAltText("STC Presales Sandbox logo");

    expect(wrapper).toHaveStyle({ width: "40px", height: "40px" });
    expect(wrapper).not.toHaveClass("rounded-full");
    expect(image).toHaveAttribute("src", "/branding/stc-logo.png");
    expect(image).toHaveClass("object-contain");
  });

  test("renders enterprise custom logo with circular crop when requested", () => {
    mockUseSettingsContext.mockReturnValue({
      enterpriseSettings: {
        application_name: "Customer Portal",
        use_custom_logo: true,
        logo_display_style: null,
        hide_onyx_branding: null,
      },
    });

    render(<BrandMark size={32} cropToCircle />);

    const wrapper = screen.getByTestId("brand-mark");
    const image = screen.getByAltText("Customer Portal logo");

    expect(wrapper).toHaveClass("rounded-full");
    expect(image.getAttribute("src")).toContain("/api/enterprise-settings/logo");
    expect(image).toHaveClass("object-cover");
  });
});
