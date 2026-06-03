import { render, screen } from "@tests/setup/test-utils";
import BrandLockup from "./BrandLockup";

const mockUseSettingsContext = jest.fn();

jest.mock("@/providers/SettingsProvider", () => ({
  useSettingsContext: () => mockUseSettingsContext(),
}));

describe("BrandLockup", () => {
  beforeEach(() => {
    mockUseSettingsContext.mockReturnValue({ enterpriseSettings: null });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders default STC logo and name", () => {
    render(<BrandLockup size={36} />);

    expect(screen.getByAltText("STC Presales Sandbox logo")).toHaveAttribute(
      "src",
      "/branding/stc-logo.png"
    );
    expect(screen.getByText("STC Presales Sandbox")).toBeInTheDocument();
  });

  test("renders custom enterprise application name", () => {
    mockUseSettingsContext.mockReturnValue({
      enterpriseSettings: {
        application_name: "Customer Portal",
        use_custom_logo: false,
        logo_display_style: null,
        hide_onyx_branding: null,
      },
    });

    render(<BrandLockup size={36} />);

    expect(screen.getByText("Customer Portal")).toBeInTheDocument();
  });
});
