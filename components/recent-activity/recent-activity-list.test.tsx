import { fireEvent, render, screen } from "@testing-library/react-native";

import { RecentActivityList } from "./recent-activity-list";

jest.mock("@/hooks/use-color-scheme");

const mockActivity = [
  {
    id: "act_001",
    type: "deposit" as const,
    amount: 150000,
    currency: "GBP" as const,
    date: "2025-01-15T10:00:00Z",
    description: "Payment from Customer ABC",
    status: "completed" as const,
  },
  {
    id: "act_002",
    type: "payout" as const,
    amount: -50000,
    currency: "GBP" as const,
    date: "2025-01-14T10:00:00Z",
    description: "Payout to Bank Account ****1234",
    status: "completed" as const,
  },
  {
    id: "act_003",
    type: "deposit" as const,
    amount: 230000,
    currency: "GBP" as const,
    date: "2025-01-13T10:00:00Z",
    description: "Payment from Customer XYZ",
    status: "completed" as const,
  },
  {
    id: "act_004",
    type: "fee" as const,
    amount: -2500,
    currency: "GBP" as const,
    date: "2025-01-12T10:00:00Z",
    description: "Monthly service fee",
    status: "completed" as const,
  },
];

describe("RecentActivityList", () => {
  it("renders at most 3 items from activities", () => {
    render(<RecentActivityList activities={mockActivity} />);

    expect(screen.getByText("Payment from Customer ABC")).toBeTruthy();
    expect(screen.getByText("Payout to Bank Account ****1234")).toBeTruthy();
    expect(screen.getByText("Payment from Customer XYZ")).toBeTruthy();
    expect(screen.queryByText("Monthly service fee")).toBeNull();
  });

  it("renders Show more button in list footer", () => {
    render(<RecentActivityList activities={mockActivity} />);

    expect(screen.getByText("Show more")).toBeTruthy();
  });

  it("calls onShowMore when Show more is pressed", () => {
    const onShowMore = jest.fn();
    render(
      <RecentActivityList activities={mockActivity} onShowMore={onShowMore} />,
    );

    fireEvent.press(screen.getByText("Show more"));

    expect(onShowMore).toHaveBeenCalledTimes(1);
  });

  it("handles empty activities array", () => {
    render(<RecentActivityList activities={[]} />);

    expect(screen.getByText("No recent activity")).toBeTruthy();
    expect(screen.getByText("Show more")).toBeTruthy();
  });
});
