import { render, waitFor } from "@tests/setup/test-utils";
import DynamicMetadata from "./DynamicMetadata";

const mockUseSettingsContext = jest.fn();

jest.mock("@/providers/SettingsProvider", () => ({
  useSettingsContext: () => mockUseSettingsContext(),
}));

describe("DynamicMetadata", () => {
  beforeEach(() => {
    document.title = "";
    mockUseSettingsContext.mockReturnValue({ enterpriseSettings: null });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("sets default STC title and favicon", async () => {
    render(<DynamicMetadata />);

    await waitFor(() => {
      expect(document.title).toBe("Presales GPT");
    });
    expect(document.head.querySelector('link[rel="icon"]')).toHaveAttribute(
      "href",
      "/branding/stc-favicon.png"
    );
  });

  test("sets enterprise title and custom logo favicon", async () => {
    mockUseSettingsContext.mockReturnValue({
      enterpriseSettings: {
        application_name: "Customer Portal",
        use_custom_logo: true,
        logo_display_style: null,
        hide_onyx_branding: null,
      },
    });

    render(<DynamicMetadata />);

    await waitFor(() => {
      expect(document.title).toBe("Customer Portal");
    });
    expect(
      document.head.querySelector('link[rel="icon"]')?.getAttribute("href")
    ).toContain("/api/enterprise-settings/logo");
  });
});
