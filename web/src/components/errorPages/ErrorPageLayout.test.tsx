import { render, screen } from "@tests/setup/test-utils";
import ErrorPageLayout from "./ErrorPageLayout";

describe("ErrorPageLayout", () => {
  test("renders default STC branding without settings context", () => {
    render(
      <ErrorPageLayout>
        <p>Configuration issue</p>
      </ErrorPageLayout>
    );

    expect(screen.getByAltText("STC Presales Sandbox logo")).toHaveAttribute(
      "src",
      "/branding/stc-logo.png"
    );
    expect(screen.getByText("STC Presales Sandbox")).toBeInTheDocument();
    expect(screen.getByText("Configuration issue")).toBeInTheDocument();
  });
});
