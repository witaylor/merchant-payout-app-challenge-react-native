import { fireEvent, render, screen } from "@testing-library/react-native";

import { Colors } from "@/constants/theme";

import { Button } from "./button";

jest.mock("@/hooks/use-color-scheme", () => ({
  useColorScheme: () => "light" as const,
}));

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Submit</Button>);
    expect(screen.getByText("Submit")).toBeTruthy();
  });

  it("calls onPress when pressed", () => {
    const onPress = jest.fn();
    render(<Button onPress={onPress}>Submit</Button>);

    fireEvent.press(screen.getByText("Submit"));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("applies error variant background color", () => {
    render(<Button variant="error">Delete</Button>);

    expect(screen.getByTestId("button")).toHaveStyle({
      backgroundColor: Colors.light.button.error.background,
    });
  });
});
