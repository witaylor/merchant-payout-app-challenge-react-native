import { render, screen } from "@testing-library/react-native";

import { AccountBalanceSection } from "./account-balance-section";

describe("AccountBalanceSection", () => {
  it("renders section title and labels with default zero values", () => {
    render(<AccountBalanceSection />);

    expect(screen.getByText("Account Balance")).toBeTruthy();
    expect(screen.getByText("Available")).toBeTruthy();
    expect(screen.getByText("Pending")).toBeTruthy();
    expect(screen.getAllByText("£0.00")).toHaveLength(2);
  });

  it("renders formatted balances from props", () => {
    render(
      <AccountBalanceSection
        available_balance={500000}
        pending_balance={25000}
        currency="GBP"
      />,
    );

    expect(screen.getByText("Account Balance")).toBeTruthy();
    expect(screen.getByText("Available")).toBeTruthy();
    expect(screen.getByText("Pending")).toBeTruthy();
    expect(screen.getByText("£5,000.00")).toBeTruthy();
    expect(screen.getByText("£250.00")).toBeTruthy();
  });

  it("renders EUR amounts when currency is EUR", () => {
    render(
      <AccountBalanceSection
        available_balance={100000}
        pending_balance={5000}
        currency="EUR"
      />,
    );

    expect(screen.getByText("€1,000.00")).toBeTruthy();
    expect(screen.getByText("€50.00")).toBeTruthy();
  });
});
