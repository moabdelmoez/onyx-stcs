import { render, screen } from "@tests/setup/test-utils";
import ErrorPageLayout from "./ErrorPageLayout";

describe("ErrorPageLayout", () => {
  test("renders default STC branding without settings context", () => {
    render(
      <ErrorPageLayout>
        <p>Configuration issue</p>
      </ErrorPageLayout>
    );

    expect(screen.getByAltText("Presales GPT logo")).toHaveAttribute(
      "src",
      "/branding/stc-logo.png"
    );
    expect(screen.getByText("Presales GPT")).toBeInTheDocument();
    expect(screen.getByText("Configuration issue")).toBeInTheDocument();
  });
});
