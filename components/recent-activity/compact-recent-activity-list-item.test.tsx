import { render, screen } from "@testing-library/react-native";

import { CompactRecentActivityListItem } from "./compact-recent-activity-list-item";

jest.mock("@/hooks/use-color-scheme");

describe("CompactRecentActivityListItem", () => {
  it("renders description and amount", () => {
    render(
      <CompactRecentActivityListItem
        item={{
          id: "act_001",
          type: "deposit",
          amount: 150000,
          currency: "GBP",
          date: "2025-01-15T10:00:00Z",
          description: "Payment from Customer ABC",
          status: "completed",
        }}
      />,
    );

    expect(screen.getByText("Payment from Customer ABC")).toBeTruthy();
    expect(screen.getByLabelText(/Payment from Customer ABC,.+/)).toBeTruthy();
  });

  it("renders for negative amounts", () => {
    render(
      <CompactRecentActivityListItem
        item={{
          id: "act_002",
          type: "payout",
          amount: -50000,
          currency: "GBP",
          date: "2025-01-14T10:00:00Z",
          description: "Payout to Bank",
          status: "completed",
        }}
      />,
    );

    expect(screen.getByText("Payout to Bank")).toBeTruthy();
  });

  it("returns null for invalid item (missing currency)", () => {
    render(
      <CompactRecentActivityListItem
        item={
          {
            id: "act_003",
            type: "deposit",
            amount: 100,
            currency: "USD",
            date: "2025-01-15",
            description: "Test",
            status: "completed",
          } as never
        }
      />,
    );

    expect(screen.queryByText("Test")).toBeNull();
  });

  it("returns null for invalid item (NaN amount)", () => {
    render(
      <CompactRecentActivityListItem
        item={
          {
            id: "act_004",
            type: "deposit",
            amount: Number.NaN,
            currency: "GBP",
            date: "2025-01-15",
            description: "Invalid",
            status: "completed",
          } as never
        }
      />,
    );

    expect(screen.queryByText("Invalid")).toBeNull();
  });

  it("returns null for invalid item (missing description)", () => {
    render(
      <CompactRecentActivityListItem
        item={
          {
            id: "act_005",
            type: "deposit",
            amount: 100,
            currency: "GBP",
            date: "2025-01-15",
            description: undefined,
            status: "completed",
          } as never
        }
      />,
    );

    expect(screen.queryByText("£1.00")).toBeNull();
  });
});
