import { render, screen } from "@tests/setup/test-utils";
import { CombinedSettings, EnterpriseSettings } from "@/interfaces/settings";
import { SettingsContext } from "@/providers/SettingsProvider";
import LoginText from "./LoginText";

function renderWithSettings(
  enterpriseSettings: Partial<EnterpriseSettings> | null = null
) {
  return render(
    <SettingsContext.Provider
      value={{ enterpriseSettings } as CombinedSettings}
    >
      <LoginText />
    </SettingsContext.Provider>
  );
}

describe("LoginText", () => {
  test("renders default STC welcome copy", () => {
    renderWithSettings();

    expect(
      screen.getByText("Welcome to Presales GPT")
    ).toBeInTheDocument();
    expect(screen.getByText("Your AI platform for work")).toBeInTheDocument();
  });

  test("renders custom enterprise application name", () => {
    renderWithSettings({
      application_name: "Customer Portal",
      use_custom_logo: false,
      logo_display_style: null,
      hide_onyx_branding: null,
    });

    expect(screen.getByText("Welcome to Customer Portal")).toBeInTheDocument();
  });
});
