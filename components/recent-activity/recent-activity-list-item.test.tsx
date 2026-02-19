import { render, screen } from "@testing-library/react-native";

import { RecentActivityListItem } from "./recent-activity-list-item";

jest.mock("@/hooks/use-color-scheme", () => ({
  useColorScheme: () => "light",
}));

const mockItem = {
  id: "act_001",
  type: "deposit" as const,
  amount: 150000,
  currency: "GBP" as const,
  date: "2026-01-23T10:00:00Z",
  description: "Payment from Customer ABC",
  status: "completed" as const,
};

describe("RecentActivityListItem", () => {
  it("renders type, description, date, amount, and status", () => {
    render(<RecentActivityListItem item={mockItem} />);

    expect(screen.getByText("Deposit")).toBeTruthy();
    expect(screen.getByText("Payment from Customer ABC")).toBeTruthy();
    expect(screen.getByText("23 Jan 2026")).toBeTruthy();
    expect(screen.getByText("£1,500.00")).toBeTruthy();
    expect(screen.getByText("Completed")).toBeTruthy();
  });

  it("renders capitalized type and status for payout", () => {
    render(
      <RecentActivityListItem
        item={{
          ...mockItem,
          type: "payout",
          description: "Payout to Bank ****1234",
          status: "pending",
        }}
      />,
    );

    expect(screen.getByText("Payout")).toBeTruthy();
    expect(screen.getByText("Pending")).toBeTruthy();
  });

  it("renders negative amount for fee", () => {
    render(
      <RecentActivityListItem
        item={{
          ...mockItem,
          type: "fee",
          amount: -2500,
          description: "Processing fee",
        }}
      />,
    );

    expect(screen.getByText("£-25.00")).toBeTruthy();
  });
});
