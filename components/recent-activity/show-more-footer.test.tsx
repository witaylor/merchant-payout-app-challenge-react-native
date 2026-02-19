import { fireEvent, render, screen } from "@testing-library/react-native";

import { ShowMoreFooter } from "./show-more-footer";

describe("ShowMoreFooter", () => {
  it("renders Show more button", () => {
    render(<ShowMoreFooter onPress={() => {}} />);
    expect(screen.getByText("Show more")).toBeTruthy();
  });

  it("calls onPress when pressed", () => {
    const onPress = jest.fn();
    render(<ShowMoreFooter onPress={onPress} />);

    fireEvent.press(screen.getByText("Show more"));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
