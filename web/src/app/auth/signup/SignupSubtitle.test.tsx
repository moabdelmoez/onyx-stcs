import { render, screen } from "@tests/setup/test-utils";
import { CombinedSettings, EnterpriseSettings } from "@/interfaces/settings";
import { SettingsContext } from "@/providers/SettingsProvider";
import SignupSubtitle from "./SignupSubtitle";

function renderWithSettings(
  enterpriseSettings: Partial<EnterpriseSettings> | null = null
) {
  return render(
    <SettingsContext.Provider
      value={{ enterpriseSettings } as CombinedSettings}
    >
      <SignupSubtitle />
    </SettingsContext.Provider>
  );
}

describe("SignupSubtitle", () => {
  test("renders default STC application name", () => {
    renderWithSettings();

    expect(
      screen.getByText("Get started with STC Presales Sandbox")
    ).toBeInTheDocument();
  });

  test("renders custom enterprise application name", () => {
    renderWithSettings({
      application_name: "Customer Portal",
      use_custom_logo: false,
      logo_display_style: null,
      hide_onyx_branding: null,
    });

    expect(
      screen.getByText("Get started with Customer Portal")
    ).toBeInTheDocument();
  });
});
