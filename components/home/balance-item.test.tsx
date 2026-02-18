import { render, screen } from "@testing-library/react-native";

import { BalanceItem } from "./balance-item";

describe("BalanceItem", () => {
  it.each([
    { title: "Available", amount: "£5,000.00" },
    { title: "Pending", amount: "€250.00" },
  ])("renders title and amount", ({ title, amount }) => {
    render(<BalanceItem title={title} amount={amount} />);

    expect(screen.getByText(title)).toBeTruthy();
    expect(screen.getByText(amount)).toBeTruthy();
  });
});
