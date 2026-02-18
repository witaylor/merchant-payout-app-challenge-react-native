import { render, screen } from "@testing-library/react-native";

import { LoadingView } from "./loading-view";

describe("LoadingView", () => {
  it("renders activity indicator", () => {
    render(<LoadingView />);

    expect(
      screen.getByTestId(LoadingView.testIds.loadingIndicator),
    ).toBeTruthy();
  });
});
