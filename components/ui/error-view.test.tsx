import { fireEvent, render, screen } from "@testing-library/react-native";

import { ErrorView } from "./error-view";

describe("ErrorView", () => {
  it("renders error message", () => {
    render(<ErrorView message="Something went wrong" onRetry={() => {}} />);

    expect(screen.getByText("Something went wrong")).toBeTruthy();
  });

  it("calls onRetry when Retry button is pressed", () => {
    const onRetry = jest.fn();
    render(<ErrorView message="Error" onRetry={onRetry} />);

    fireEvent.press(screen.getByText("Retry"));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
